//! Self-intersection check for polygon validity.

use geo::{Coord, Line, line_intersection::LineIntersection, sweep::Intersections};
use rosette_core::{Layer, Polygon};

use crate::violation::{DrcViolation, RuleType, Severity};

/// Check that a polygon does not self-intersect.
///
/// Self-intersecting polygons are geometrically invalid and cause incorrect
/// results in boolean operations, area calculations, and fabrication. Foundries
/// will reject designs containing self-intersecting geometry.
///
/// Uses `geo::sweep::Intersections`, which runs the Bentley–Ottmann sweep-line
/// algorithm in `O((V + K) log V)` where `V` is the vertex count and `K` is
/// the number of crossings. Reports only *proper* crossings (where the two
/// edges' interiors meet) — shared endpoints between adjacent edges and
/// collinear overlaps are ignored, matching the previous O(V²) implementation.
pub fn check_self_intersection(
    polygon: &Polygon,
    layer: Layer,
    rule_name: Option<&str>,
) -> Option<DrcViolation> {
    let vertices = polygon.vertices();
    let n = vertices.len();

    // A triangle (or shorter) cannot self-intersect.
    if n < 4 {
        return None;
    }

    // Collect polygon edges as `geo::Line` segments. The closing edge wraps
    // from the last vertex back to the first.
    let edges = (0..n).map(|i| {
        let a = vertices[i];
        let b = vertices[(i + 1) % n];
        Line::new(Coord { x: a.x, y: a.y }, Coord { x: b.x, y: b.y })
    });

    // Walk the sweep iterator until we find a proper crossing. Adjacent edges
    // share an endpoint; the sweep reports those as
    // `SinglePoint { is_proper: false }`, which we skip. Collinear overlaps
    // (`Collinear`) are also skipped to match the prior behavior.
    let has_proper_crossing = Intersections::<Line<f64>>::from_iter(edges).any(|(_, _, kind)| {
        matches!(
            kind,
            LineIntersection::SinglePoint {
                is_proper: true,
                ..
            }
        )
    });

    if !has_proper_crossing {
        return None;
    }

    let mut violation = DrcViolation::new(
        RuleType::SelfIntersection,
        polygon.bbox(),
        layer,
        format!(
            "Polygon on Layer({}, {}) has self-intersecting edges",
            layer.number, layer.datatype
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
    use rosette_core::Point;

    #[test]
    fn test_simple_rectangle_no_intersection() {
        let poly = Polygon::rect(Point::origin(), 10.0, 5.0);
        let result = check_self_intersection(&poly, Layer::new(1, 0), None);
        assert!(result.is_none());
    }

    #[test]
    fn test_convex_polygon_no_intersection() {
        // Regular hexagon
        let poly = Polygon::regular(Point::origin(), 5.0, 6);
        let result = check_self_intersection(&poly, Layer::new(1, 0), None);
        assert!(result.is_none());
    }

    #[test]
    fn test_concave_l_shape_no_intersection() {
        // L-shape is concave but does NOT self-intersect
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 2.0),
            Point::new(2.0, 2.0),
            Point::new(2.0, 10.0),
            Point::new(0.0, 10.0),
        ]);
        let result = check_self_intersection(&poly, Layer::new(1, 0), None);
        assert!(result.is_none());
    }

    #[test]
    fn test_bowtie_self_intersects() {
        // Bowtie shape: edges cross in the middle
        //  (0,0) -- (10,5)
        //       X
        //  (0,5) -- (10,0)
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 5.0),
            Point::new(10.0, 0.0),
            Point::new(0.0, 5.0),
        ]);

        let result = check_self_intersection(&poly, Layer::new(1, 0), Some("NO_SELF_X"));
        assert!(result.is_some());

        let v = result.unwrap();
        assert_eq!(v.rule_name, Some("NO_SELF_X".to_string()));
        assert!(matches!(v.rule_type, RuleType::SelfIntersection));
    }

    #[test]
    fn test_twisted_polygon_self_intersects() {
        // A polygon where non-adjacent edges cross:
        //   (0,0) -> (10,0) -> (0,10) -> (10,10)
        // Edge (10,0)->(0,10) crosses edge (0,0)->(10,10)... wait, that's not right.
        // Let's use a clear twisted quad:
        //   (0,0) -> (10,0) -> (0,5) -> (10,5)
        // Edge 1->2: (10,0)->(0,5) and edge 3->0: (10,5)->(0,0) cross each other.
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(0.0, 5.0),
            Point::new(10.0, 5.0),
        ]);

        let result = check_self_intersection(&poly, Layer::new(1, 0), None);
        assert!(result.is_some(), "Twisted quad should self-intersect");
    }

    #[test]
    fn test_triangle_cannot_self_intersect() {
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(5.0, 5.0),
        ]);
        let result = check_self_intersection(&poly, Layer::new(1, 0), None);
        assert!(result.is_none());
    }

    #[test]
    fn test_high_vertex_simple_polygon_terminates_quickly() {
        // 10 000-vertex regular polygon. Must terminate without timing out
        // and must not flag a violation. The previous O(V^2) implementation
        // costed several seconds at this scale (extrapolated from the 44 ms
        // measured at V=1000); the sweep-line implementation should be in
        // the low milliseconds.
        let poly = Polygon::regular(Point::origin(), 10.0, 10_000);
        let result = check_self_intersection(&poly, Layer::new(1, 0), None);
        assert!(
            result.is_none(),
            "Regular 10 000-gon must not flag self-intersection"
        );
    }

    #[test]
    fn test_high_vertex_self_crossing_terminates_quickly() {
        // 10 000-vertex polygon with one deliberate twist near the start.
        // Construct it from a regular polygon with two vertices swapped to
        // introduce exactly one X-crossing.
        let mut poly = Polygon::regular(Point::origin(), 10.0, 10_000);
        let verts = poly.vertices_mut();
        verts.swap(1, 2_000);

        let result = check_self_intersection(&poly, Layer::new(1, 0), None);
        assert!(
            result.is_some(),
            "Polygon with a swapped pair of vertices must flag self-intersection"
        );
    }
}
