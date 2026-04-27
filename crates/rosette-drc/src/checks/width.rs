//! Minimum width check using ray-casting sampling and vertex-to-edge distances.

use rosette_core::{Layer, Point, Polygon};

use crate::violation::{DrcViolation, RuleType, Severity};

/// Check that polygon meets minimum width requirement.
///
/// Uses a ray-casting approach: sample points along each edge and cast rays
/// perpendicular to the edge (inward) to find the distance to the opposite
/// boundary. The minimum such distance is the polygon's width.
///
/// This correctly handles complex shapes like L-bends, tapers, and curves
/// that the previous bounding-box approach could not.
pub fn check_width(
    polygon: &Polygon,
    layer: Layer,
    min_width: f64,
    rule_name: Option<&str>,
) -> Option<DrcViolation> {
    let vertices = polygon.vertices();
    if vertices.len() < 3 {
        return None;
    }

    let min_measured = estimate_min_width_sampling(polygon, 10);

    if min_measured < min_width {
        let mut violation = DrcViolation::new(
            RuleType::MinWidth {
                required: min_width,
                actual: min_measured,
            },
            polygon.bbox(),
            layer,
            format!(
                "Polygon width {:.4} is less than minimum {:.4}",
                min_measured, min_width
            ),
        )
        .with_severity(Severity::Error);

        if let Some(name) = rule_name {
            violation = violation.with_name(name);
        }

        Some(violation)
    } else {
        None
    }
}

/// Estimate minimum width by sampling perpendicular distances from edges.
///
/// For each edge of the polygon, we sample points along it and cast rays
/// perpendicular to the edge (pointing inward). The distance to the first
/// intersection with another edge gives the local "width" at that point.
///
/// The minimum of all sampled widths is returned.
///
/// # Arguments
/// * `polygon` - The polygon to measure
/// * `samples_per_edge` - Number of sample points per edge (more = more accurate)
pub fn estimate_min_width_sampling(polygon: &Polygon, samples_per_edge: usize) -> f64 {
    let vertices = polygon.vertices();
    let n = vertices.len();

    if n < 3 {
        return 0.0;
    }

    // Determine winding direction to know which way is "inward"
    let signed_area = polygon.signed_area();
    let winding_sign = if signed_area >= 0.0 { 1.0 } else { -1.0 };

    let mut min_width = f64::INFINITY;

    // Collect all edges for intersection testing
    let edges: Vec<(Point, Point)> = (0..n)
        .map(|i| (vertices[i], vertices[(i + 1) % n]))
        .collect();

    for (edge_idx, &(p1, p2)) in edges.iter().enumerate() {
        let edge_vec = (p2.x - p1.x, p2.y - p1.y);
        let edge_len = (edge_vec.0.powi(2) + edge_vec.1.powi(2)).sqrt();

        if edge_len < 1e-10 {
            continue;
        }

        // Normal vector perpendicular to edge
        // For CCW winding, (-dy, dx) points inward (left of edge direction)
        let normal = (
            -edge_vec.1 / edge_len * winding_sign,
            edge_vec.0 / edge_len * winding_sign,
        );

        // Sample points along this edge (excluding endpoints to avoid corner issues)
        for j in 1..=samples_per_edge {
            let t = j as f64 / (samples_per_edge + 1) as f64;
            let sample = Point::new(p1.x + t * (p2.x - p1.x), p1.y + t * (p2.y - p1.y));

            // Cast ray from sample point in normal direction
            if let Some(dist) = cast_ray_to_boundary(&edges, edge_idx, sample, normal) {
                min_width = min_width.min(dist);
            }
        }
    }

    // Also check vertex-to-edge distances. This catches taper narrow ends
    // and other geometries where the narrowest point is at a vertex rather
    // than along an edge. Ray-casting misses these because the perpendicular
    // from a slanted edge doesn't pass through the narrow-end vertex, and
    // the short end-cap edge's perpendicular rays skip adjacent edges.
    let vertex_min = vertex_to_edge_min_distance(&edges, vertices);
    min_width = min_width.min(vertex_min);

    if min_width.is_infinite() {
        // Fallback to bounding box if nothing found
        let bbox = polygon.bbox();
        bbox.width().min(bbox.height())
    } else {
        min_width
    }
}

/// Cast a ray from a point and find the distance to the polygon boundary.
///
/// # Arguments
/// * `edges` - All edges of the polygon
/// * `source_edge_idx` - Index of the edge the ray originates from (excluded from testing)
/// * `origin` - Starting point of the ray
/// * `direction` - Unit direction vector of the ray
///
/// # Returns
/// The distance to the nearest intersection, or None if no intersection found.
pub fn cast_ray_to_boundary(
    edges: &[(Point, Point)],
    source_edge_idx: usize,
    origin: Point,
    direction: (f64, f64),
) -> Option<f64> {
    let mut min_dist = f64::INFINITY;
    let n = edges.len();

    for (i, &(e1, e2)) in edges.iter().enumerate() {
        // Skip the source edge and its adjacent edges (they share vertices)
        if i == source_edge_idx
            || i == (source_edge_idx + 1) % n
            || i == (source_edge_idx + n - 1) % n
        {
            continue;
        }

        if let Some(dist) = ray_segment_intersection(origin, direction, e1, e2)
            && dist > 1e-10
            && dist < min_dist
        {
            min_dist = dist;
        }
    }

    if min_dist.is_infinite() {
        None
    } else {
        Some(min_dist)
    }
}

/// Compute the shortest distance from a point to a line segment.
///
/// Projects the point onto the infinite line through (e1, e2), then clamps to
/// the segment. Handles degenerate (zero-length) segments by returning the
/// point-to-point distance.
pub(crate) fn point_to_segment_distance(point: Point, e1: Point, e2: Point) -> f64 {
    let seg = (e2.x - e1.x, e2.y - e1.y);
    let seg_len_sq = seg.0 * seg.0 + seg.1 * seg.1;

    if seg_len_sq < 1e-20 {
        // Degenerate segment (zero length) — distance to the single point.
        let dx = point.x - e1.x;
        let dy = point.y - e1.y;
        return (dx * dx + dy * dy).sqrt();
    }

    // Parameter t: projection of (point - e1) onto the segment direction,
    // normalised by segment length squared so t ∈ [0, 1] means on-segment.
    let to_point = (point.x - e1.x, point.y - e1.y);
    let t = (to_point.0 * seg.0 + to_point.1 * seg.1) / seg_len_sq;
    let t_clamped = t.clamp(0.0, 1.0);

    let closest_x = e1.x + t_clamped * seg.0;
    let closest_y = e1.y + t_clamped * seg.1;

    let dx = point.x - closest_x;
    let dy = point.y - closest_y;
    (dx * dx + dy * dy).sqrt()
}

/// Compute the minimum distance from a single vertex to all far-away edges.
///
/// Skips edges that are topologically close to the vertex along the polygon
/// boundary using `skip_radius`. This avoids false positives on
/// finely-discretized curves, where nearby vertices on the *same side* of
/// the polygon would produce tiny distances that reflect local curvature
/// rather than cross-sectional width.
///
/// **Assumption:** The `n/4` skip radius works well when vertices are
/// roughly evenly distributed around the perimeter. For polygons with
/// highly non-uniform vertex density (e.g., 30+ vertices on one side, 2
/// on the other), a measurement from the dense side to the sparse side
/// may be skipped. In practice, the sparse side's vertices still capture
/// the width measurement in the other direction.
pub(crate) fn vertex_min_distance_to_far_edges(
    vi: usize,
    vertex: Point,
    edges: &[(Point, Point)],
    n: usize,
    skip_radius: usize,
) -> f64 {
    let mut min_dist = f64::INFINITY;

    for (ei, &(e1, e2)) in edges.iter().enumerate() {
        // Topological distance around the polygon ring.
        let fwd = (ei + n - vi) % n; // steps forward from vi to ei
        let bwd = (vi + n - ei) % n; // steps backward
        let topo_dist = fwd.min(bwd);

        if topo_dist <= skip_radius {
            continue;
        }

        let dist = point_to_segment_distance(vertex, e1, e2);
        if dist > 1e-10 {
            min_dist = min_dist.min(dist);
        }
    }

    min_dist
}

/// Compute the minimum distance from any vertex to a far-away edge.
///
/// This catches width measurements that the ray-casting approach misses —
/// particularly taper narrow ends, where the vertex at a corner is the closest
/// point to the opposite boundary but no edge's perpendicular ray passes
/// through that vertex.
///
/// We skip `n/4` edges on each side of the vertex, ensuring only edges on
/// the "opposite" side of the polygon are measured. See
/// [`vertex_min_distance_to_far_edges`] for details on the skip heuristic.
pub(crate) fn vertex_to_edge_min_distance(edges: &[(Point, Point)], vertices: &[Point]) -> f64 {
    let n = vertices.len();
    if n < 4 {
        // Triangles: every edge is adjacent or nearly so — no opposite side.
        return f64::INFINITY;
    }

    let skip_radius = (n / 4).max(1);
    let mut min_dist = f64::INFINITY;

    for (vi, &vertex) in vertices.iter().enumerate() {
        let d = vertex_min_distance_to_far_edges(vi, vertex, edges, n, skip_radius);
        min_dist = min_dist.min(d);
    }

    min_dist
}

/// Calculate intersection of a ray with a line segment.
///
/// Uses the parametric form:
/// Ray: P = origin + t * direction (t >= 0)
/// Segment: Q = e1 + s * (e2 - e1) (0 <= s <= 1)
///
/// # Returns
/// The distance `t` to the intersection point, or None if no intersection.
fn ray_segment_intersection(
    origin: Point,
    direction: (f64, f64),
    e1: Point,
    e2: Point,
) -> Option<f64> {
    let seg_vec = (e2.x - e1.x, e2.y - e1.y);

    // Cross product of direction and segment vector
    let cross = direction.0 * seg_vec.1 - direction.1 * seg_vec.0;

    // Parallel check
    if cross.abs() < 1e-10 {
        return None;
    }

    let to_e1 = (e1.x - origin.x, e1.y - origin.y);

    // Parameter along the ray
    let t = (to_e1.0 * seg_vec.1 - to_e1.1 * seg_vec.0) / cross;

    // Parameter along the segment
    let s = (to_e1.0 * direction.1 - to_e1.1 * direction.0) / cross;

    // Check if intersection is valid (ray goes forward, point is on segment)
    if t >= 0.0 && (0.0..=1.0).contains(&s) {
        Some(t)
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::Point;

    #[test]
    fn test_rectangle_width_pass() {
        // 10x5 rectangle - width is 5
        let poly = Polygon::rect(Point::origin(), 10.0, 5.0);
        let result = check_width(&poly, Layer::new(1, 0), 4.0, None);
        assert!(result.is_none());
    }

    #[test]
    fn test_rectangle_width_fail() {
        // 10x2 rectangle - width is 2
        let poly = Polygon::rect(Point::origin(), 10.0, 2.0);
        let result = check_width(&poly, Layer::new(1, 0), 3.0, Some("MIN_WIDTH"));
        assert!(result.is_some());

        let v = result.unwrap();
        assert_eq!(v.rule_name, Some("MIN_WIDTH".to_string()));
        if let RuleType::MinWidth { required, actual } = v.rule_type {
            assert!((required - 3.0).abs() < 1e-10);
            assert!(actual < 3.0);
        } else {
            panic!("Wrong rule type");
        }
    }

    #[test]
    fn test_square() {
        // 5x5 square - width is 5
        let poly = Polygon::rect(Point::origin(), 5.0, 5.0);
        let result = check_width(&poly, Layer::new(1, 0), 4.0, None);
        assert!(result.is_none());
    }

    #[test]
    fn test_l_shape_width_fail() {
        // L-shaped polygon with 0.5 width arms
        // The bounding box would be 10x10, but actual width is 0.5
        //
        //   |---|  (0.5 wide arm going up)
        //   |
        //   |______  (0.5 wide arm going right)
        //
        let l_shape = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 0.5),
            Point::new(0.5, 0.5),
            Point::new(0.5, 10.0),
            Point::new(0.0, 10.0),
        ]);

        // This should FAIL because width is only ~0.5, less than required 0.6
        // The old bbox approach would incorrectly report width as 10.0
        let result = check_width(&l_shape, Layer::new(1, 0), 0.6, None);
        assert!(
            result.is_some(),
            "L-shape with 0.5 width should fail min_width=0.6"
        );

        if let Some(v) = result
            && let RuleType::MinWidth { actual, .. } = v.rule_type
        {
            assert!(
                actual < 0.6,
                "Measured width {} should be less than 0.6",
                actual
            );
            assert!(
                actual > 0.3,
                "Measured width {} should be reasonable (> 0.3)",
                actual
            );
        }
    }

    #[test]
    fn test_l_shape_width_pass() {
        // L-shaped polygon with 2.0 width arms - should pass min_width=1.5
        let l_shape = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 2.0),
            Point::new(2.0, 2.0),
            Point::new(2.0, 10.0),
            Point::new(0.0, 10.0),
        ]);

        let result = check_width(&l_shape, Layer::new(1, 0), 1.5, None);
        assert!(
            result.is_none(),
            "L-shape with 2.0 width should pass min_width=1.5"
        );
    }

    #[test]
    fn test_taper_width_narrow_end() {
        // Tapered shape: narrow at left (0.4 height), wide at right (2.0 height)
        // The left and right edges are vertical, top/bottom are slanted.
        //
        //   (0, 0.2) *-----------------------* (10, 1.0)
        //            |                      /
        //            |                     /
        //            |                    /
        //   (0,-0.2) *-------------------* (10, -1.0)
        //
        // The vertex-to-edge measurement catches the narrow end: the top-left
        // vertex (0, 0.2) is 0.4 from the bottom edge, and vice versa.

        let taper = Polygon::new(vec![
            Point::new(0.0, -0.2),  // bottom-left
            Point::new(10.0, -1.0), // bottom-right
            Point::new(10.0, 1.0),  // top-right
            Point::new(0.0, 0.2),   // top-left
        ]);

        let measured = estimate_min_width_sampling(&taper, 10);

        // The true width at the narrow end is 0.4. The vertex-to-edge
        // distance from (0, 0.2) to the bottom edge (0,-0.2)->(10,-1.0)
        // should measure exactly 0.4 (the point projects onto the segment
        // at its start endpoint).
        assert!(
            measured < 0.45,
            "Taper narrow-end width {} should be close to 0.4",
            measured
        );
        assert!(
            measured > 0.35,
            "Taper narrow-end width {} should be close to 0.4",
            measured
        );

        // Steep taper: 0.3 -> 3.0 over 3.0 length
        let steep_taper = Polygon::new(vec![
            Point::new(0.0, -0.15), // bottom-left (0.3 total height)
            Point::new(3.0, -1.5),  // bottom-right (3.0 total height)
            Point::new(3.0, 1.5),   // top-right
            Point::new(0.0, 0.15),  // top-left
        ]);

        let steep_measured = estimate_min_width_sampling(&steep_taper, 10);

        assert!(
            steep_measured < 0.35,
            "Steep taper width {} should be close to 0.3",
            steep_measured
        );
        assert!(
            steep_measured > 0.25,
            "Steep taper width {} should be close to 0.3",
            steep_measured
        );
    }

    #[test]
    fn test_taper_width_passes_when_wide_enough() {
        // Tapered shape: narrow at left (1.0), wide at right (2.0)
        let taper = Polygon::new(vec![
            Point::new(0.0, -0.5),  // bottom-left
            Point::new(10.0, -1.0), // bottom-right
            Point::new(10.0, 1.0),  // top-right
            Point::new(0.0, 0.5),   // top-left
        ]);

        // Should pass min_width=0.8 because narrow end is 1.0
        let result = check_width(&taper, Layer::new(1, 0), 0.8, None);
        assert!(
            result.is_none(),
            "Taper with 1.0 narrow end should pass min_width=0.8"
        );
    }

    #[test]
    fn test_mmi_taper_width() {
        // Realistic MMI input taper: waveguide_width=0.5 -> taper_width=1.2
        // over 5.0 length. This is the shape created by mmi.py.
        //
        //   (0, 0.25) *-----------* (5, 0.6)
        //             |          /
        //             |         /
        //   (0,-0.25) *-----------* (5, -0.6)
        //
        let taper = Polygon::new(vec![
            Point::new(0.0, -0.25), // bottom-left (port_width/2)
            Point::new(5.0, -0.6),  // bottom-right (taper_width/2)
            Point::new(5.0, 0.6),   // top-right
            Point::new(0.0, 0.25),  // top-left
        ]);

        let measured = estimate_min_width_sampling(&taper, 10);

        // The narrow end is 0.5 (waveguide width).
        // Vertex (0, 0.25) to bottom edge should give ~0.5.
        assert!(
            measured < 0.55,
            "MMI taper width {} should be close to 0.5 (waveguide width)",
            measured
        );
        assert!(
            measured > 0.45,
            "MMI taper width {} should be close to 0.5 (waveguide width)",
            measured
        );

        // Should fail min_width=0.6
        let result = check_width(&taper, Layer::new(1, 0), 0.6, None);
        assert!(
            result.is_some(),
            "MMI taper with 0.5 narrow end should fail min_width=0.6"
        );

        // Should pass min_width=0.4
        let result = check_width(&taper, Layer::new(1, 0), 0.4, None);
        assert!(
            result.is_none(),
            "MMI taper with 0.5 narrow end should pass min_width=0.4"
        );
    }

    #[test]
    fn test_asymmetric_taper_width() {
        // Taper where only the top edge is slanted, bottom is horizontal.
        // Narrow end = 0.5, wide end = 1.5.
        //
        //   (0, 0.5)  *-----------* (10, 1.5)
        //             |          /
        //             |         /
        //   (0, 0.0)  *-----------* (10, 0.0)
        //
        let taper = Polygon::new(vec![
            Point::new(0.0, 0.0),  // bottom-left
            Point::new(10.0, 0.0), // bottom-right
            Point::new(10.0, 1.5), // top-right
            Point::new(0.0, 0.5),  // top-left
        ]);

        let measured = estimate_min_width_sampling(&taper, 10);

        // Narrow end is 0.5. Vertex (0, 0.5) is 0.5 from the bottom edge.
        assert!(
            measured < 0.55,
            "Asymmetric taper width {} should be close to 0.5",
            measured
        );
        assert!(
            measured > 0.45,
            "Asymmetric taper width {} should be close to 0.5",
            measured
        );
    }

    #[test]
    fn test_curved_taper_width() {
        // Taper with many vertices on the top edge (simulating an arc),
        // straight bottom edge. Like a focused grating coupler taper.
        //
        // Narrow end at x=0: height = 0.5
        // Wide end at x=10: height ~2.0
        // Top edge is an arc with many points.
        let n_arc = 32;
        let mut vertices = Vec::new();

        // Bottom edge: two points (straight)
        vertices.push(Point::new(0.0, -0.25));
        vertices.push(Point::new(10.0, -1.0));

        // Top edge: arc from wide end back to narrow end (reversed for CCW)
        for i in 0..=n_arc {
            let t = 1.0 - i as f64 / n_arc as f64; // 1.0 -> 0.0
            let x = t * 10.0;
            // Parabolic-ish curve from 1.0 at x=10 to 0.25 at x=0
            let y = 0.25 + 0.75 * t * t.sqrt();
            vertices.push(Point::new(x, y));
        }

        let taper = Polygon::new(vertices);
        let measured = estimate_min_width_sampling(&taper, 10);

        // Narrow end is 0.5 (y: -0.25 to 0.25).
        // The vertex-to-edge approach should find this.
        assert!(
            measured < 0.55,
            "Curved taper width {} should be close to 0.5",
            measured
        );
        assert!(
            measured > 0.4,
            "Curved taper width {} should be reasonable (>0.4)",
            measured
        );
    }

    #[test]
    fn test_point_to_segment_distance_basic() {
        // Point directly above the midpoint of a horizontal segment
        let p = Point::new(5.0, 3.0);
        let e1 = Point::new(0.0, 0.0);
        let e2 = Point::new(10.0, 0.0);
        let dist = point_to_segment_distance(p, e1, e2);
        assert!(
            (dist - 3.0).abs() < 1e-10,
            "Distance should be 3.0, got {}",
            dist
        );
    }

    #[test]
    fn test_point_to_segment_distance_endpoint() {
        // Point closest to the start endpoint of the segment
        let p = Point::new(-1.0, 0.0);
        let e1 = Point::new(0.0, 0.0);
        let e2 = Point::new(10.0, 0.0);
        let dist = point_to_segment_distance(p, e1, e2);
        assert!(
            (dist - 1.0).abs() < 1e-10,
            "Distance should be 1.0, got {}",
            dist
        );
    }

    #[test]
    fn test_point_to_segment_distance_degenerate() {
        // Zero-length segment
        let p = Point::new(3.0, 4.0);
        let e1 = Point::new(0.0, 0.0);
        let e2 = Point::new(0.0, 0.0);
        let dist = point_to_segment_distance(p, e1, e2);
        assert!(
            (dist - 5.0).abs() < 1e-10,
            "Distance should be 5.0, got {}",
            dist
        );
    }

    #[test]
    fn test_u_shape_width() {
        // U-shaped polygon - tests that the algorithm finds the narrow parts
        //
        //  |     |
        //  |     |  <- arms are 1.0 wide
        //  |_____|  <- bottom is 1.0 tall
        //
        let u_shape = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(5.0, 0.0),
            Point::new(5.0, 5.0),
            Point::new(4.0, 5.0),
            Point::new(4.0, 1.0),
            Point::new(1.0, 1.0),
            Point::new(1.0, 5.0),
            Point::new(0.0, 5.0),
        ]);

        // Width of arms and bottom is 1.0, should pass 0.8
        let result = check_width(&u_shape, Layer::new(1, 0), 0.8, None);
        assert!(
            result.is_none(),
            "U-shape with 1.0 width should pass min_width=0.8"
        );

        // Should fail 1.2
        let result = check_width(&u_shape, Layer::new(1, 0), 1.2, None);
        assert!(
            result.is_some(),
            "U-shape with 1.0 width should fail min_width=1.2"
        );
    }

    #[test]
    fn test_ray_segment_intersection_basic() {
        // Ray from (0,0) going right (+x direction)
        let origin = Point::new(0.0, 0.0);
        let direction = (1.0, 0.0);

        // Vertical segment at x=5, from y=-1 to y=1
        let e1 = Point::new(5.0, -1.0);
        let e2 = Point::new(5.0, 1.0);

        let dist = ray_segment_intersection(origin, direction, e1, e2);
        assert!(dist.is_some());
        assert!((dist.unwrap() - 5.0).abs() < 1e-10);
    }

    #[test]
    fn test_ray_segment_intersection_miss() {
        // Ray from (0,0) going right
        let origin = Point::new(0.0, 0.0);
        let direction = (1.0, 0.0);

        // Segment above the ray
        let e1 = Point::new(5.0, 1.0);
        let e2 = Point::new(5.0, 2.0);

        let dist = ray_segment_intersection(origin, direction, e1, e2);
        assert!(dist.is_none());
    }

    #[test]
    fn test_ray_segment_intersection_behind() {
        // Ray from (0,0) going right
        let origin = Point::new(0.0, 0.0);
        let direction = (1.0, 0.0);

        // Segment behind the ray (negative x)
        let e1 = Point::new(-5.0, -1.0);
        let e2 = Point::new(-5.0, 1.0);

        let dist = ray_segment_intersection(origin, direction, e1, e2);
        assert!(dist.is_none());
    }
}
