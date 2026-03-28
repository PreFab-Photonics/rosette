//! Bend radius checking for photonic layouts.
//!
//! Walks the cell hierarchy and checks that all bends meet the configured
//! minimum bend radius. Also surfaces auto-reduced bend warnings.

use rosette_core::{BBox, Cell, Library, Point, Transform};

use crate::config::ChecksConfig;
use crate::violation::{CheckViolation, CheckViolationType, Severity};

/// Bend radius check statistics.
#[derive(Debug, Clone, Default)]
pub struct BendRadiusStats {
    /// Total number of bends checked.
    pub bends_checked: usize,
}

/// Make a point-sized BBox centred on a position.
fn point_bbox(position: Point) -> BBox {
    let half = 0.05;
    BBox::new(
        Point::new(position.x - half, position.y - half),
        Point::new(position.x + half, position.y + half),
    )
}

/// Run bend radius checks on a cell hierarchy.
///
/// Walks all cells (including sub-instances via Library), checks each
/// bend's radius against `config.min_bend_radius`, and reports
/// auto-reduced bends.
pub fn check_bend_radius(
    cell: &Cell,
    config: &ChecksConfig,
    library: Option<&Library>,
) -> (Vec<CheckViolation>, BendRadiusStats) {
    let mut violations = Vec::new();
    let mut stats = BendRadiusStats::default();

    walk_bends(
        cell,
        library,
        &Transform::identity(),
        "",
        config,
        &mut violations,
        &mut stats,
    );

    (violations, stats)
}

/// Recursively walk cells, checking bends at each level.
fn walk_bends(
    cell: &Cell,
    library: Option<&Library>,
    transform: &Transform,
    path: &str,
    config: &ChecksConfig,
    violations: &mut Vec<CheckViolation>,
    stats: &mut BendRadiusStats,
) {
    // Check bends in this cell
    for bend in cell.bends() {
        stats.bends_checked += 1;

        // Transform the bend position to absolute coordinates
        let abs_position = transform.apply(bend.position);

        // Check auto-reduced bends
        if let Some(requested) = bend.requested_radius {
            violations.push(CheckViolation::new(
                CheckViolationType::BendRadiusAutoReduced {
                    radius: bend.radius,
                    requested_radius: requested,
                },
                cell.name().to_string(),
                path.to_string(),
                point_bbox(abs_position),
                format!(
                    "Bend radius auto-reduced from {:.1} to {:.1} \u{00b5}m at ({:.1}, {:.1}) in \"{}\"",
                    requested, bend.radius, abs_position.x, abs_position.y, cell.name()
                ),
                Severity::Warning,
            ));
        }

        // Check minimum bend radius
        if let Some(min_radius) = config.min_bend_radius
            && bend.radius < min_radius
        {
            violations.push(CheckViolation::new(
                CheckViolationType::BendRadiusTooSmall {
                    radius: bend.radius,
                    min_radius,
                },
                cell.name().to_string(),
                path.to_string(),
                point_bbox(abs_position),
                format!(
                    "Bend radius {:.1} \u{00b5}m at ({:.1}, {:.1}) in \"{}\" is below minimum {:.1} \u{00b5}m",
                    bend.radius, abs_position.x, abs_position.y, cell.name(), min_radius
                ),
                config.severity,
            ));
        }
    }

    // Recurse into cell references
    if let Some(lib) = library {
        for cell_ref in cell.cell_refs() {
            if let Some(ref_cell) = lib.cell(&cell_ref.cell_name) {
                let combined = transform.then(&cell_ref.transform);
                let child_path = if path.is_empty() {
                    cell_ref.cell_name.clone()
                } else {
                    format!("{}/{}", path, cell_ref.cell_name)
                };
                walk_bends(
                    ref_cell,
                    Some(lib),
                    &combined,
                    &child_path,
                    config,
                    violations,
                    stats,
                );
            }
        }
    }
}

#[cfg(test)]
#[allow(unused_must_use)]
mod tests {
    use super::*;
    use rosette_core::{BendInfo, CellRef, Layer, Point, Polygon, Vector2};

    fn make_bend_cell(name: &str, radius: f64) -> Cell {
        let mut cell = Cell::new(name);
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 0.5), Layer::new(1, 0));
        cell.add_port(Port::with_width(
            "in",
            Point::origin(),
            -Vector2::unit_x(),
            0.5,
        ));
        cell.add_port(Port::with_width(
            "out",
            Point::new(10.0, 0.0),
            Vector2::unit_x(),
            0.5,
        ));
        cell.add_bend(BendInfo::new(radius, Point::new(5.0, 0.0)));
        cell
    }

    use rosette_core::Port;

    #[test]
    fn test_bend_below_minimum() {
        let cell = make_bend_cell("tight_bend", 3.0);

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let (violations, stats) = check_bend_radius(&cell, &config, None);

        assert_eq!(stats.bends_checked, 1);
        assert_eq!(violations.len(), 1);
        assert!(matches!(
            violations[0].violation_type,
            CheckViolationType::BendRadiusTooSmall { radius, min_radius }
            if (radius - 3.0).abs() < 1e-6 && (min_radius - 5.0).abs() < 1e-6
        ));
    }

    #[test]
    fn test_bend_above_minimum() {
        let cell = make_bend_cell("good_bend", 10.0);

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let (violations, stats) = check_bend_radius(&cell, &config, None);

        assert_eq!(stats.bends_checked, 1);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_no_min_bend_radius_configured() {
        let cell = make_bend_cell("any_bend", 1.0);

        let config = ChecksConfig::default(); // min_bend_radius = None
        let (violations, stats) = check_bend_radius(&cell, &config, None);

        assert_eq!(stats.bends_checked, 1);
        assert!(violations.is_empty()); // No minimum configured, so no violation
    }

    #[test]
    fn test_auto_reduced_bend() {
        let mut cell = Cell::new("reduced");
        cell.add_bend(BendInfo::auto_reduced(3.0, Point::new(5.0, 0.0), 10.0));

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let (violations, stats) = check_bend_radius(&cell, &config, None);

        assert_eq!(stats.bends_checked, 1);
        // Should have both: auto-reduced warning AND below-minimum error
        assert_eq!(violations.len(), 2);

        let auto_reduced: Vec<_> = violations
            .iter()
            .filter(|v| {
                matches!(
                    v.violation_type,
                    CheckViolationType::BendRadiusAutoReduced { .. }
                )
            })
            .collect();
        let too_small: Vec<_> = violations
            .iter()
            .filter(|v| {
                matches!(
                    v.violation_type,
                    CheckViolationType::BendRadiusTooSmall { .. }
                )
            })
            .collect();
        assert_eq!(auto_reduced.len(), 1);
        assert_eq!(too_small.len(), 1);
    }

    #[test]
    fn test_hierarchy_traversal() {
        let bend_cell = make_bend_cell("inner_bend", 2.0);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("inner_bend").at(0.0, 0.0));
        top.add_ref(CellRef::new("inner_bend").at(20.0, 0.0));

        let mut lib = Library::new("test");
        lib.add_cell(bend_cell);
        lib.add_cell(top);

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let (violations, stats) = check_bend_radius(lib.cell("top").unwrap(), &config, Some(&lib));

        assert_eq!(stats.bends_checked, 2); // One bend per instance
        assert_eq!(violations.len(), 2); // Both below minimum
    }

    #[test]
    fn test_cell_with_no_bends() {
        let cell = Cell::new("empty");

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let (violations, stats) = check_bend_radius(&cell, &config, None);

        assert_eq!(stats.bends_checked, 0);
        assert!(violations.is_empty());
    }
}
