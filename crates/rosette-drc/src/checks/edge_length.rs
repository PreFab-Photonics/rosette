//! Minimum edge length check.

use rosette_core::{Layer, Polygon};

use crate::violation::{DrcViolation, RuleType, Severity};

/// Check that all polygon edges meet the minimum length requirement.
///
/// Short edges (below lithography resolution) can cause fabrication failures.
/// Returns one violation per edge that is too short.
pub fn check_edge_length(
    polygon: &Polygon,
    layer: Layer,
    min_length: f64,
    rule_name: Option<&str>,
) -> Vec<DrcViolation> {
    let vertices = polygon.vertices();
    let n = vertices.len();
    let mut violations = Vec::new();

    for i in 0..n {
        let p1 = vertices[i];
        let p2 = vertices[(i + 1) % n];
        let length = p1.distance_to(p2);

        if length < min_length && length > 1e-10 {
            let mut violation = DrcViolation::new(
                RuleType::MinEdgeLength {
                    required: min_length,
                    actual: length,
                },
                polygon.bbox(),
                layer,
                format!(
                    "Edge length {:.4} is less than minimum {:.4}",
                    length, min_length
                ),
            )
            .with_severity(Severity::Error);

            if let Some(name) = rule_name {
                violation = violation.with_name(name);
            }

            violations.push(violation);
        }
    }

    violations
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::Point;

    #[test]
    fn test_rectangle_passes() {
        // 10x5 rectangle — shortest edge is 5.0
        let poly = Polygon::rect(Point::origin(), 10.0, 5.0);
        let violations = check_edge_length(&poly, Layer::new(1, 0), 4.0, None);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_rectangle_fails() {
        // 10x0.05 rectangle — short edges are 0.05
        let poly = Polygon::rect(Point::origin(), 10.0, 0.05);
        let violations = check_edge_length(&poly, Layer::new(1, 0), 0.1, Some("EDGE_LEN"));
        assert_eq!(violations.len(), 2); // Two short edges (top and bottom height)

        let v = &violations[0];
        assert_eq!(v.rule_name, Some("EDGE_LEN".to_string()));
        if let RuleType::MinEdgeLength { required, actual } = v.rule_type {
            assert!((required - 0.1).abs() < 1e-10);
            assert!(actual < 0.1);
        } else {
            panic!("Wrong rule type");
        }
    }

    #[test]
    fn test_polygon_with_tiny_jog() {
        // Polygon with a small notch/jog creating a very short edge
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 5.0),
            Point::new(5.01, 5.0), // tiny jog edge: 0.01 long
            Point::new(5.0, 5.0),
            Point::new(0.0, 5.0),
        ]);

        let violations = check_edge_length(&poly, Layer::new(1, 0), 0.05, None);
        assert_eq!(violations.len(), 1); // Only the 0.01 edge
    }

    #[test]
    fn test_zero_length_edges_ignored() {
        // Degenerate edge with zero length should not produce a violation
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 0.0), // duplicate point = zero-length edge
            Point::new(10.0, 5.0),
            Point::new(0.0, 5.0),
        ]);

        let violations = check_edge_length(&poly, Layer::new(1, 0), 0.1, None);
        // Zero-length edge is below threshold but also below 1e-10, so skipped
        assert!(violations.is_empty());
    }
}
