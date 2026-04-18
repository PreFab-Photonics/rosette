//! Maximum width check.

use rosette_core::{Layer, Point, Polygon};

use crate::checks::width::{
    cast_ray_to_boundary, estimate_min_width_sampling, vertex_min_distance_to_far_edges,
};
use crate::violation::{DrcViolation, RuleType, Severity};

/// Check that polygon does not exceed maximum width at any cross-section.
///
/// Important in photonics to prevent multimode waveguides — a waveguide wider
/// than the single-mode cutoff will support higher-order modes and cause
/// unwanted interference.
///
/// The "width" of a polygon is the narrowest perpendicular extent at each
/// point along its boundary. For a 20x0.5 waveguide, the width is 0.5 (not
/// 20.0). For a T-shape with a 1-unit tall, 6-unit wide base, the base has
/// a width of 6 when measured perpendicular to its short side edges.
///
/// Uses ray-casting to sample perpendicular widths from each edge. For each
/// edge, the maximum perpendicular distance across all its samples gives the
/// "width" as seen from that edge — but only if the distance does not exceed
/// the edge length (otherwise we are measuring the polygon's length, not its
/// width). Additionally, the minimum bounding-box dimension is used as a
/// robust fallback to catch cases like square pads.
pub fn check_max_width(
    polygon: &Polygon,
    layer: Layer,
    max_width: f64,
    rule_name: Option<&str>,
) -> Option<DrcViolation> {
    let vertices = polygon.vertices();
    if vertices.len() < 3 {
        return None;
    }

    let bbox = polygon.bbox();

    // Quick pass: if both bbox dimensions fit, nothing can exceed the limit.
    if bbox.width() <= max_width && bbox.height() <= max_width {
        return None;
    }

    // Use the min-width estimator for convex/simple shapes. If the minimum
    // perpendicular width already exceeds the limit, the whole polygon is
    // too wide (e.g., a fat rectangle or square pad).
    let min_width = estimate_min_width_sampling(polygon, 10);
    if min_width > max_width {
        return make_violation(polygon, layer, max_width, min_width, rule_name);
    }

    // For non-convex shapes, the minimum width can be small (narrow arms)
    // while other regions are wide. Check each edge's local width.
    let local_max = estimate_max_local_width(polygon, 10);
    if local_max > max_width {
        return make_violation(polygon, layer, max_width, local_max, rule_name);
    }

    // Check vertex-to-edge distances at concave vertices to catch wide
    // regions behind short edges (the documented limitation of the
    // edge-length filter in estimate_max_local_width).
    let concave_max = max_width_at_concave_vertices(polygon);
    if concave_max > max_width {
        return make_violation(polygon, layer, max_width, concave_max, rule_name);
    }

    None
}

/// Estimate the maximum local width of a polygon.
///
/// For each edge, finds the minimum perpendicular distance among its samples
/// (the "width" as seen from that edge). Returns the maximum such width across
/// all edges. This catches wide regions in non-convex polygons.
///
/// Filters out measurements where perpendicular distance > edge length, since
/// those represent the polygon's length (e.g., end-cap edges of a waveguide).
///
/// **Note:** A short edge adjacent to a wide flared region may have its
/// width measurement filtered out if the perpendicular distance exceeds the
/// edge length (e.g., a 2-unit edge with a 5-unit perpendicular width).
/// The `max_width_at_concave_vertices` step in `check_max_width` catches
/// these cases by measuring vertex-to-edge distances at reflex vertices.
fn estimate_max_local_width(polygon: &Polygon, samples_per_edge: usize) -> f64 {
    let vertices = polygon.vertices();
    let n = vertices.len();

    if n < 3 {
        return 0.0;
    }

    let signed_area = polygon.signed_area();
    let winding_sign = if signed_area >= 0.0 { 1.0 } else { -1.0 };

    let mut max_width = 0.0f64;

    let edges: Vec<(Point, Point)> = (0..n)
        .map(|i| (vertices[i], vertices[(i + 1) % n]))
        .collect();

    for (edge_idx, &(p1, p2)) in edges.iter().enumerate() {
        let edge_vec = (p2.x - p1.x, p2.y - p1.y);
        let edge_len = (edge_vec.0.powi(2) + edge_vec.1.powi(2)).sqrt();

        if edge_len < 1e-10 {
            continue;
        }

        let normal = (
            -edge_vec.1 / edge_len * winding_sign,
            edge_vec.0 / edge_len * winding_sign,
        );

        let mut edge_min = f64::INFINITY;

        for j in 1..=samples_per_edge {
            let t = j as f64 / (samples_per_edge + 1) as f64;
            let sample = Point::new(p1.x + t * (p2.x - p1.x), p1.y + t * (p2.y - p1.y));

            if let Some(dist) = cast_ray_to_boundary(&edges, edge_idx, sample, normal) {
                edge_min = edge_min.min(dist);
            }
        }

        // The per-edge minimum perpendicular distance is the "width" of the
        // polygon as seen from this edge. Only count it if it doesn't exceed
        // the edge length — otherwise we're measuring length, not width
        // (e.g., end-cap edges of a waveguide).
        if edge_min.is_finite() && edge_min <= edge_len {
            max_width = max_width.max(edge_min);
        }
    }

    max_width
}

/// Compute the maximum "local width" at concave (reflex) vertices.
///
/// At a concave vertex the interior angle exceeds 180°. The *minimum*
/// distance from that vertex to a non-adjacent edge gives the local
/// cross-sectional width at that point (e.g., the width of a T-shape's
/// base as seen from the inner corner). We return the maximum of these
/// per-vertex minimum distances.
///
/// Convex vertices are skipped because their minimum distance to
/// non-adjacent edges would measure the polygon's length or a diagonal.
fn max_width_at_concave_vertices(polygon: &Polygon) -> f64 {
    let vertices = polygon.vertices();
    let n = vertices.len();
    if n < 4 {
        // Triangles have no concave vertices.
        return 0.0;
    }

    let signed_area = polygon.signed_area();
    let winding_sign = if signed_area >= 0.0 { 1.0 } else { -1.0 };

    let edges: Vec<(Point, Point)> = (0..n)
        .map(|i| (vertices[i], vertices[(i + 1) % n]))
        .collect();

    let skip_radius = (n / 4).max(1);
    let mut max_local_width = 0.0f64;

    for vi in 0..n {
        let prev = vertices[(vi + n - 1) % n];
        let curr = vertices[vi];
        let next = vertices[(vi + 1) % n];

        // Cross product of (curr - prev) × (next - curr) tells us the turn
        // direction. For CCW winding (positive area), a negative cross product
        // means a reflex (concave) vertex.
        let dx1 = curr.x - prev.x;
        let dy1 = curr.y - prev.y;
        let dx2 = next.x - curr.x;
        let dy2 = next.y - curr.y;
        let cross = dx1 * dy2 - dy1 * dx2;

        // Concave when cross and winding_sign have opposite signs.
        if cross * winding_sign >= 0.0 {
            continue; // Convex vertex — skip.
        }

        // The minimum distance from this concave vertex to any far-away
        // edge is the local width at this vertex.
        let vertex_min = vertex_min_distance_to_far_edges(vi, curr, &edges, n, skip_radius);

        if vertex_min.is_finite() {
            max_local_width = max_local_width.max(vertex_min);
        }
    }

    max_local_width
}

fn make_violation(
    polygon: &Polygon,
    layer: Layer,
    max_width: f64,
    actual: f64,
    rule_name: Option<&str>,
) -> Option<DrcViolation> {
    let mut violation = DrcViolation::new(
        RuleType::MaxWidth {
            limit: max_width,
            actual,
        },
        polygon.bbox(),
        layer,
        format!(
            "Polygon width {:.4} exceeds maximum {:.4}",
            actual, max_width
        ),
    )
    .with_severity(Severity::Error);

    if let Some(name) = rule_name {
        violation = violation.with_name(name);
    }

    Some(violation)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_narrow_waveguide_passes() {
        // 20x0.5 waveguide — width 0.5 is within max 1.0
        let poly = Polygon::rect(Point::origin(), 20.0, 0.5);
        let result = check_max_width(&poly, Layer::new(1, 0), 1.0, None);
        assert!(result.is_none());
    }

    #[test]
    fn test_wide_waveguide_fails() {
        // 20x3.0 waveguide — width 3.0 exceeds max 1.0
        let poly = Polygon::rect(Point::origin(), 20.0, 3.0);
        let result = check_max_width(&poly, Layer::new(1, 0), 1.0, Some("MAX_W"));
        assert!(result.is_some());

        let v = result.unwrap();
        assert_eq!(v.rule_name, Some("MAX_W".to_string()));
        if let RuleType::MaxWidth { limit, actual } = v.rule_type {
            assert!((limit - 1.0).abs() < 1e-10);
            assert!(actual > 1.0);
        } else {
            panic!("Wrong rule type");
        }
    }

    #[test]
    fn test_square_pad_fails() {
        // 10x10 pad — both dimensions exceed max 5.0
        let poly = Polygon::rect(Point::origin(), 10.0, 10.0);
        let result = check_max_width(&poly, Layer::new(1, 0), 5.0, None);
        assert!(result.is_some());
    }

    #[test]
    fn test_l_shape_narrow_arms_pass() {
        // L-shape with 1.0-wide arms — should pass max_width=2.0
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 1.0),
            Point::new(1.0, 1.0),
            Point::new(1.0, 10.0),
            Point::new(0.0, 10.0),
        ]);
        let result = check_max_width(&poly, Layer::new(1, 0), 2.0, None);
        assert!(result.is_none());
    }

    #[test]
    fn test_exact_boundary_passes() {
        // Width exactly at the limit should pass
        let poly = Polygon::rect(Point::origin(), 10.0, 2.0);
        let result = check_max_width(&poly, Layer::new(1, 0), 2.0, None);
        assert!(result.is_none());
    }

    #[test]
    fn test_t_shape_wide_base_fails() {
        // T-shape: narrow stem (1.0 wide) + wide base (8.0 wide, 8.0 tall)
        // The base is a large region — its min-width (measured by ray-casting)
        // is ~8.0, which exceeds the max_width of 2.0.
        //
        //       |---|          (1.0 wide stem, 3.0 tall)
        //  |-------------|    (8.0 wide base, 8.0 tall)
        //
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(8.0, 0.0),
            Point::new(8.0, 8.0),
            Point::new(4.5, 8.0),
            Point::new(4.5, 11.0),
            Point::new(3.5, 11.0),
            Point::new(3.5, 8.0),
            Point::new(0.0, 8.0),
        ]);

        // max_width=2.0 — the 8x8 base should fail
        let result = check_max_width(&poly, Layer::new(1, 0), 2.0, None);
        assert!(
            result.is_some(),
            "T-shape with wide base should fail max_width=2.0"
        );

        if let Some(v) = result {
            if let RuleType::MaxWidth { actual, .. } = v.rule_type {
                assert!(
                    actual > 2.0,
                    "Measured max width {} should exceed 2.0",
                    actual
                );
            }
        }
    }
}
