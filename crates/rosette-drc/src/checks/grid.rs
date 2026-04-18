//! Snap-to-grid check for polygon vertices.

use rosette_core::{Layer, Polygon};

use crate::violation::{DrcViolation, RuleType, Severity};

/// Tolerance factor for floating-point grid alignment.
///
/// A coordinate is considered on-grid if its remainder after dividing by the
/// grid pitch is within `GRID_TOLERANCE * grid_pitch` of zero. This accounts
/// for IEEE 754 rounding without being so loose that genuinely off-grid
/// coordinates slip through.
const GRID_TOLERANCE: f64 = 1e-4;

/// Check that all polygon vertices lie on the manufacturing grid.
///
/// For each vertex, both x and y are checked independently. A coordinate
/// is on-grid if `remainder(coord, grid_pitch).abs() <= GRID_TOLERANCE * grid_pitch`.
///
/// Reports one violation per off-grid vertex (not per coordinate) to avoid
/// flooding results while still giving precise location information.
///
/// # Panics
///
/// Panics if `grid_pitch` is not positive (zero or negative grid makes no sense).
pub fn check_snap_to_grid(
    polygon: &Polygon,
    layer: Layer,
    grid_pitch: f64,
    rule_name: Option<&str>,
) -> Vec<DrcViolation> {
    assert!(
        grid_pitch > 0.0,
        "grid_pitch must be positive, got {grid_pitch}"
    );
    let vertices = polygon.vertices();
    let mut violations = Vec::new();
    let tol = GRID_TOLERANCE * grid_pitch;

    for &vertex in vertices {
        let x_rem = (vertex.x / grid_pitch).round() * grid_pitch - vertex.x;
        let y_rem = (vertex.y / grid_pitch).round() * grid_pitch - vertex.y;
        let x_off = x_rem.abs() > tol;
        let y_off = y_rem.abs() > tol;

        if x_off || y_off {
            let mut parts = Vec::new();
            if x_off {
                parts.push(format!("x={:.6}", vertex.x));
            }
            if y_off {
                parts.push(format!("y={:.6}", vertex.y));
            }

            let mut violation = DrcViolation::new(
                RuleType::OffGrid {
                    grid_pitch,
                    vertex: (vertex.x, vertex.y),
                },
                polygon.bbox(),
                layer,
                format!(
                    "Vertex ({:.6}, {:.6}) off grid (pitch={}, {})",
                    vertex.x,
                    vertex.y,
                    grid_pitch,
                    parts.join(", ")
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
    fn test_on_grid_rectangle() {
        // 1nm grid (0.001 um). Rectangle with integer-nm coords.
        let poly = Polygon::rect(Point::new(0.0, 0.0), 1.0, 0.5);
        let violations = check_snap_to_grid(&poly, Layer::new(1, 0), 0.001, None);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_on_grid_5nm() {
        // 5nm grid (0.005 um).
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(0.5, 0.0),
            Point::new(0.5, 0.25),
            Point::new(0.0, 0.25),
        ]);
        let violations = check_snap_to_grid(&poly, Layer::new(1, 0), 0.005, None);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_off_grid_vertex() {
        // 5nm grid. Vertex at 0.003 um is not a multiple of 0.005.
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(0.5, 0.0),
            Point::new(0.5, 0.003),
            Point::new(0.0, 0.003),
        ]);
        let violations = check_snap_to_grid(&poly, Layer::new(1, 0), 0.005, None);
        // Two vertices have y=0.003 which is off the 5nm grid
        assert_eq!(violations.len(), 2);
        for v in &violations {
            assert!(matches!(v.rule_type, RuleType::OffGrid { .. }));
            assert!(v.message.contains("off grid"));
        }
    }

    #[test]
    fn test_off_grid_both_coords() {
        // 5nm grid. Vertex at (0.003, 0.007) — both coords off-grid.
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(0.01, 0.0),
            Point::new(0.003, 0.007),
        ]);
        let violations = check_snap_to_grid(&poly, Layer::new(1, 0), 0.005, None);
        // (0.003, 0.007) has both x and y off-grid → 1 violation for that vertex
        // (0.01, 0.0) is on-grid (0.01 / 0.005 = 2)
        assert_eq!(violations.len(), 1);
        assert!(violations[0].message.contains("x="));
        assert!(violations[0].message.contains("y="));
    }

    #[test]
    fn test_1nm_grid_passes_for_nm_aligned() {
        // 1nm grid. Coords that are exact multiples of 0.001.
        let poly = Polygon::new(vec![
            Point::new(0.123, 0.456),
            Point::new(0.789, 0.012),
            Point::new(0.345, 0.678),
        ]);
        let violations = check_snap_to_grid(&poly, Layer::new(1, 0), 0.001, None);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_1nm_grid_catches_sub_nm() {
        // 1nm grid. Coord 0.1234 is not a multiple of 0.001 (0.4 sub-nm).
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(0.1234, 0.0),
            Point::new(0.0, 0.1),
        ]);
        let violations = check_snap_to_grid(&poly, Layer::new(1, 0), 0.001, None);
        assert_eq!(violations.len(), 1);
    }

    #[test]
    fn test_rule_name_propagated() {
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(0.003, 0.0),
            Point::new(0.0, 0.01),
        ]);
        let violations =
            check_snap_to_grid(&poly, Layer::new(1, 0), 0.005, Some("L1.snap_to_grid"));
        assert!(!violations.is_empty());
        assert_eq!(violations[0].rule_name.as_deref(), Some("L1.snap_to_grid"));
    }

    #[test]
    fn test_floating_point_tolerance() {
        // 1nm grid. 0.001 * 100 should equal 0.1 but floating-point
        // arithmetic can produce 0.1000000000000000055... — this must pass.
        let x = 0.001 * 100.0; // May not be exactly 0.1
        let poly = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(x, 0.0),
            Point::new(0.0, 0.001),
        ]);
        let violations = check_snap_to_grid(&poly, Layer::new(1, 0), 0.001, None);
        assert!(violations.is_empty(), "Should tolerate f64 rounding");
    }

    #[test]
    fn test_large_coordinates_on_grid() {
        // Large coords that are on-grid (common in real layouts).
        let poly = Polygon::rect(Point::new(1000.0, 2000.0), 500.0, 300.0);
        let violations = check_snap_to_grid(&poly, Layer::new(1, 0), 0.001, None);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_negative_coordinates_on_grid() {
        let poly = Polygon::rect(Point::new(-5.0, -3.0), 2.0, 1.5);
        let violations = check_snap_to_grid(&poly, Layer::new(1, 0), 0.001, None);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_negative_coordinates_off_grid() {
        let poly = Polygon::new(vec![
            Point::new(-0.003, 0.0),
            Point::new(0.01, 0.0),
            Point::new(0.0, 0.01),
        ]);
        let violations = check_snap_to_grid(&poly, Layer::new(1, 0), 0.005, None);
        assert_eq!(violations.len(), 1);
    }

    #[test]
    #[should_panic(expected = "grid_pitch must be positive")]
    fn test_zero_grid_pitch_panics() {
        let poly = Polygon::rect(Point::origin(), 1.0, 1.0);
        check_snap_to_grid(&poly, Layer::new(1, 0), 0.0, None);
    }

    #[test]
    #[should_panic(expected = "grid_pitch must be positive")]
    fn test_negative_grid_pitch_panics() {
        let poly = Polygon::rect(Point::origin(), 1.0, 1.0);
        check_snap_to_grid(&poly, Layer::new(1, 0), -0.001, None);
    }
}
