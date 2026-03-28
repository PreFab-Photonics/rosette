//! Self-intersection check for polygon validity.

use rosette_core::{Layer, Point, Polygon};

use crate::violation::{DrcViolation, RuleType, Severity};

/// Check that a polygon does not self-intersect.
///
/// Self-intersecting polygons are geometrically invalid and cause incorrect
/// results in boolean operations, area calculations, and fabrication. Foundries
/// will reject designs containing self-intersecting geometry.
///
/// Uses an O(n^2) edge-pair intersection test. This is acceptable because
/// photonic layout polygons rarely have more than a few hundred vertices.
pub fn check_self_intersection(
    polygon: &Polygon,
    layer: Layer,
    rule_name: Option<&str>,
) -> Option<DrcViolation> {
    let vertices = polygon.vertices();
    let n = vertices.len();

    if n < 4 {
        // A triangle cannot self-intersect
        return None;
    }

    for i in 0..n {
        let a1 = vertices[i];
        let a2 = vertices[(i + 1) % n];

        // Only compare with non-adjacent edges to avoid shared-vertex false positives.
        // Edge j starts at j+2 from i (skip i and i+1 which are adjacent).
        // Also skip the edge that ends at i (which is edge n-1 when i==0).
        for j in (i + 2)..n {
            // Skip the last edge when checking the first edge (they share a vertex)
            if i == 0 && j == n - 1 {
                continue;
            }

            let b1 = vertices[j];
            let b2 = vertices[(j + 1) % n];

            if segments_intersect(a1, a2, b1, b2) {
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

                return Some(violation);
            }
        }
    }

    None
}

/// Test if two line segments properly intersect (cross each other).
///
/// Returns true only for proper crossings, not for shared endpoints or
/// collinear overlaps, which would produce false positives on adjacent edges.
fn segments_intersect(a1: Point, a2: Point, b1: Point, b2: Point) -> bool {
    let d1 = cross_product(b1, b2, a1);
    let d2 = cross_product(b1, b2, a2);
    let d3 = cross_product(a1, a2, b1);
    let d4 = cross_product(a1, a2, b2);

    // Proper crossing: the endpoints of each segment are on opposite sides
    // of the line defined by the other segment.
    ((d1 > 0.0 && d2 < 0.0) || (d1 < 0.0 && d2 > 0.0))
        && ((d3 > 0.0 && d4 < 0.0) || (d3 < 0.0 && d4 > 0.0))
}

/// Cross product of vectors (p2-p1) x (p3-p1).
/// Positive if p3 is to the left of p1->p2.
fn cross_product(p1: Point, p2: Point, p3: Point) -> f64 {
    (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x)
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
}
