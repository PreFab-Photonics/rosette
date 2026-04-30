//! Acute interior angle check for polygon vertices.
//!
//! Flags **convex** vertices whose interior angle is below a threshold.
//! Reflex (concave, > 180°) vertices are ignored — they represent the polygon
//! poking outward and are not a lithography risk.
//!
//! ## Geometry
//!
//! At each vertex `v` with neighbors `prev` and `next`, we compute the turn
//! from the incoming edge direction (`prev -> v`) to the outgoing edge
//! direction (`v -> next`):
//!
//! - `cross = (v - prev) × (next - v)`
//! - `dot   = (v - prev) · (next - v)`
//! - `turn_deg = atan2(cross, dot)` in degrees
//!
//! For a CCW-wound polygon, a left turn (positive `cross`) is a convex
//! vertex, and interior angle = `180 - turn_deg`. For CW winding, the sign of
//! the turn is flipped; we multiply by the winding sign so convex vertices
//! always appear with a positive turn.

use std::f64::consts::PI;

use rosette_core::{Layer, Point, Polygon};

use crate::violation::{DrcViolation, RuleType, Severity};

/// Check that every convex interior angle is at least `threshold_deg`.
///
/// Emits one violation per offending vertex. Reflex (interior angle > 180°)
/// vertices are not checked.
///
/// `threshold_deg` is expected to be in `(0, 180)` — a sensible foundry
/// default is 60°. Values outside that range are still honoured but will
/// produce either no violations (<= 0) or flag every convex vertex (>= 180).
pub fn check_acute_angle(
    polygon: &Polygon,
    layer: Layer,
    threshold_deg: f64,
    rule_name: Option<&str>,
) -> Vec<DrcViolation> {
    let vertices = polygon.vertices();
    let n = vertices.len();
    let mut violations = Vec::new();

    if n < 3 {
        return violations;
    }

    // Winding sign: +1 for CCW, -1 for CW. A zero area (degenerate polygon)
    // has no meaningful winding — skip rather than report spurious angles.
    let signed_area = polygon.signed_area();
    if signed_area.abs() < 1e-20 {
        return violations;
    }
    let winding_sign = signed_area.signum();

    for i in 0..n {
        let prev = vertices[(i + n - 1) % n];
        let curr = vertices[i];
        let next = vertices[(i + 1) % n];

        let Some(interior_deg) = interior_angle_deg(prev, curr, next, winding_sign) else {
            continue;
        };

        // Only convex vertices (interior < 180°) are a concern. Reflex vertices
        // are the polygon turning the other way — fine for lithography.
        if interior_deg >= 180.0 {
            continue;
        }

        if interior_deg < threshold_deg {
            let mut violation = DrcViolation::new(
                RuleType::AcuteAngle {
                    angle_deg: interior_deg,
                    threshold_deg,
                    vertex: (curr.x, curr.y),
                },
                polygon.bbox(),
                layer,
                format!(
                    "Acute interior angle {:.2}° at ({:.4}, {:.4}) is below threshold {:.2}°",
                    interior_deg, curr.x, curr.y, threshold_deg
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

/// Compute the interior angle (in degrees) at a polygon vertex.
///
/// Returns `None` if either adjacent edge is degenerate (zero length), in
/// which case the angle is undefined.
///
/// The result is in `[0, 360)`:
/// - `< 180` — convex vertex (polygon turns inward)
/// - `= 180` — collinear (straight-through vertex; rare but possible)
/// - `> 180` — reflex / concave vertex
fn interior_angle_deg(prev: Point, curr: Point, next: Point, winding_sign: f64) -> Option<f64> {
    let incoming = (curr.x - prev.x, curr.y - prev.y);
    let outgoing = (next.x - curr.x, next.y - curr.y);

    let incoming_len_sq = incoming.0 * incoming.0 + incoming.1 * incoming.1;
    let outgoing_len_sq = outgoing.0 * outgoing.0 + outgoing.1 * outgoing.1;
    if incoming_len_sq < 1e-20 || outgoing_len_sq < 1e-20 {
        return None;
    }

    // Signed turn from incoming to outgoing edge. Positive = left turn.
    let cross = incoming.0 * outgoing.1 - incoming.1 * outgoing.0;
    let dot = incoming.0 * outgoing.0 + incoming.1 * outgoing.1;
    let turn_rad = cross.atan2(dot);
    // Normalize so a "convex" turn is always positive regardless of winding.
    let turn_deg = turn_rad * 180.0 / PI * winding_sign;

    // Interior angle:
    //   turn = 0   -> 180 (collinear)
    //   turn > 0   -> convex, interior = 180 - turn (range: 0 to 180)
    //   turn < 0   -> reflex, interior = 180 - turn (range: 180 to 360)
    Some(180.0 - turn_deg)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rectangle_no_violations() {
        // All interior angles are 90° — no violations at threshold 60°.
        let poly = Polygon::rect(Point::origin(), 10.0, 5.0);
        let violations = check_acute_angle(&poly, Layer::new(1, 0), 60.0, None);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_very_sharp_triangle() {
        // Thin isoceles triangle — apex at (50, 0), base from (0, 0.5) to (0, -0.5).
        // Apex angle = 2 * atan(0.5 / 50) ≈ 1.145°. Base angles ≈ 89.43° each.
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.5),
            Point::new(0.0, -0.5),
            Point::new(50.0, 0.0),
        ]);
        let violations = check_acute_angle(&poly, Layer::new(1, 0), 60.0, None);
        // The apex should trigger; the base corners (~89°) should not.
        assert_eq!(violations.len(), 1, "only the sharp apex should violate");

        let v = &violations[0];
        if let RuleType::AcuteAngle {
            angle_deg,
            threshold_deg,
            vertex,
        } = v.rule_type
        {
            assert!(angle_deg < 2.0, "apex angle should be very small");
            assert!((threshold_deg - 60.0).abs() < 1e-10);
            // The apex is at (50, 0).
            assert!((vertex.0 - 50.0).abs() < 1e-10);
            assert!(vertex.1.abs() < 1e-10);
        } else {
            panic!("wrong rule type");
        }
    }

    #[test]
    fn test_45_degree_corner_flagged_at_60() {
        // Right triangle with legs of length 10. Interior angles: 90°, 45°, 45°.
        // At threshold 60°, both 45° corners should violate.
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
        ]);
        let violations = check_acute_angle(&poly, Layer::new(1, 0), 60.0, None);
        assert_eq!(violations.len(), 2, "both 45° corners should violate");
        for v in &violations {
            if let RuleType::AcuteAngle { angle_deg, .. } = v.rule_type {
                assert!(
                    (angle_deg - 45.0).abs() < 1e-6,
                    "expected ~45°, got {}",
                    angle_deg
                );
            }
        }
    }

    #[test]
    fn test_45_degree_corner_passes_at_30() {
        // Same triangle, looser threshold (30°) — 45° corners pass.
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
        ]);
        let violations = check_acute_angle(&poly, Layer::new(1, 0), 30.0, None);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_reflex_vertex_not_flagged() {
        // L-shape: one vertex has interior angle 270° (reflex). All others are 90°.
        // With threshold 60°, nothing should be flagged — reflex vertices are ignored,
        // and 90° ≥ 60°.
        let l_shape = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 5.0),
            Point::new(5.0, 5.0),
            Point::new(5.0, 10.0),
            Point::new(0.0, 10.0),
        ]);
        let violations = check_acute_angle(&l_shape, Layer::new(1, 0), 60.0, None);
        assert!(
            violations.is_empty(),
            "L-shape has no convex acute angles: {:?}",
            violations.iter().map(|v| &v.message).collect::<Vec<_>>()
        );
    }

    #[test]
    fn test_cw_winding_treated_same_as_ccw() {
        // Same sharp triangle as test_very_sharp_triangle but wound CW.
        // Result should match: one violation at the apex.
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.5),
            Point::new(50.0, 0.0),
            Point::new(0.0, -0.5),
        ]);
        let violations = check_acute_angle(&poly, Layer::new(1, 0), 60.0, None);
        assert_eq!(violations.len(), 1, "CW winding should work the same");
    }

    #[test]
    fn test_rule_name_propagated() {
        // Thin sharp triangle — single offending vertex so we can assert cleanly.
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.5),
            Point::new(0.0, -0.5),
            Point::new(50.0, 0.0),
        ]);
        let violations = check_acute_angle(&poly, Layer::new(1, 0), 60.0, Some("ACUTE_RULE"));
        assert_eq!(violations.len(), 1);
        assert_eq!(violations[0].rule_name.as_deref(), Some("ACUTE_RULE"));
    }

    #[test]
    fn test_degenerate_polygon_skipped() {
        // Collinear "polygon" — three points on a line, zero signed area.
        // Should produce no violations rather than nonsense results.
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(1.0, 0.0),
            Point::new(2.0, 0.0),
        ]);
        let violations = check_acute_angle(&poly, Layer::new(1, 0), 60.0, None);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_threshold_exactly_on_boundary() {
        // A 90° corner should NOT violate when threshold is exactly 90°
        // (strict `<` comparison).
        let poly = Polygon::rect(Point::origin(), 10.0, 10.0);
        let violations = check_acute_angle(&poly, Layer::new(1, 0), 90.0, None);
        assert!(
            violations.is_empty(),
            "90° corners should not trigger threshold 90°"
        );
    }
}
