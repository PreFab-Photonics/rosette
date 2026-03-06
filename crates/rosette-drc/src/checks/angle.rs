//! Angle check for polygon edges.

use std::f64::consts::PI;

use rosette_core::{Layer, Point, Polygon};

use crate::violation::{DrcViolation, RuleType, Severity};

/// Tolerance for angle comparison (degrees).
const ANGLE_EPSILON: f64 = 0.1;

/// Check that all polygon edges use allowed angles.
pub fn check_angles(
    polygon: &Polygon,
    layer: Layer,
    allowed_angles: &[f64],
    rule_name: Option<&str>,
) -> Vec<DrcViolation> {
    let vertices = polygon.vertices();
    let mut violations = Vec::new();

    for i in 0..vertices.len() {
        let p1 = vertices[i];
        let p2 = vertices[(i + 1) % vertices.len()];

        let edge_angle = edge_angle_deg(p1, p2);
        let normalized = normalize_angle(edge_angle);

        if !is_allowed_angle(normalized, allowed_angles) {
            let mut violation = DrcViolation::new(
                RuleType::ForbiddenAngle {
                    angle_deg: normalized,
                    allowed: allowed_angles.to_vec(),
                },
                polygon.bbox(),
                layer,
                format!(
                    "Edge angle {:.1} deg not in allowed angles {:?}",
                    normalized, allowed_angles
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

/// Calculate edge angle in degrees.
fn edge_angle_deg(p1: Point, p2: Point) -> f64 {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    dy.atan2(dx) * 180.0 / PI
}

/// Normalize angle to [0, 180) range (edges are bidirectional).
fn normalize_angle(angle: f64) -> f64 {
    let mut a = angle % 360.0;
    if a < 0.0 {
        a += 360.0;
    }
    if a >= 180.0 {
        a -= 180.0;
    }
    a
}

/// Check if angle matches any allowed angle within tolerance.
fn is_allowed_angle(angle: f64, allowed: &[f64]) -> bool {
    for &allowed_angle in allowed {
        let normalized_allowed = normalize_angle(allowed_angle);
        let diff = (angle - normalized_allowed).abs();
        // Handle wrap-around at 180
        let diff = diff.min(180.0 - diff);
        if diff < ANGLE_EPSILON {
            return true;
        }
    }
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_manhattan_rect() {
        let poly = Polygon::rect(Point::origin(), 10.0, 5.0);
        let violations = check_angles(&poly, Layer::new(1, 0), &[0.0, 90.0], None);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_45_degree_diamond() {
        // Diamond with 45-degree edges
        let poly = Polygon::new(vec![
            Point::new(0.0, 1.0),
            Point::new(1.0, 0.0),
            Point::new(0.0, -1.0),
            Point::new(-1.0, 0.0),
        ]);

        // Only allow manhattan
        let violations = check_angles(&poly, Layer::new(1, 0), &[0.0, 90.0], None);
        assert_eq!(violations.len(), 4); // All 4 edges are 45 degrees

        // Allow 45 degrees too
        let violations = check_angles(&poly, Layer::new(1, 0), &[0.0, 45.0, 90.0, 135.0], None);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_angle_normalization() {
        assert!((normalize_angle(0.0) - 0.0).abs() < 1e-10);
        assert!((normalize_angle(90.0) - 90.0).abs() < 1e-10);
        assert!((normalize_angle(180.0) - 0.0).abs() < 1e-10);
        assert!((normalize_angle(270.0) - 90.0).abs() < 1e-10);
        assert!((normalize_angle(-45.0) - 135.0).abs() < 1e-10);
    }
}
