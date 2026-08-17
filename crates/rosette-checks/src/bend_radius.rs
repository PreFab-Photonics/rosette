//! Bend radius checking for photonic layouts.
//!
//! Walks the cell hierarchy and checks that all bends meet the configured
//! minimum bend radius. Also surfaces auto-reduced bend warnings.

use std::collections::HashMap;

use rosette_core::hierarchy::{HierarchyEvent, WalkControl, walk_hierarchy};
use rosette_core::{BBox, Cell, Library, Point, Transform};
use rosette_route::RouteAnnotations;

use crate::config::ChecksConfig;
use crate::violation::{CheckViolation, CheckViolationType, Severity};

/// Route annotations keyed by the name of their materialized cell.
pub type RouteAnnotationMap = HashMap<String, RouteAnnotations>;

/// Bend radius check statistics.
#[derive(Debug, Clone, Default)]
pub struct BendRadiusStats {
    /// Total number of bends checked.
    pub bends_checked: usize,
}

/// Make a point-sized BBox centred on a finite position.
fn point_bbox(position: Point) -> Option<BBox> {
    if !position.is_finite() {
        return None;
    }
    let half = 0.05;
    let bbox = BBox::new(
        Point::new(position.x - half, position.y - half),
        Point::new(position.x + half, position.y + half),
    );
    bbox.is_valid().then_some(bbox)
}

/// Extract the magnification of a conformal transform without squaring its
/// matrix entries or summing two near-maximum column lengths.
fn conformal_scale(transform: Transform) -> Result<f64, &'static str> {
    let scale_x = transform.a.hypot(transform.c);
    let scale_y = transform.b.hypot(transform.d);
    if !scale_x.is_finite() || !scale_y.is_finite() {
        return Err("the accumulated transform has a non-finite scale");
    }
    if scale_x == 0.0 || scale_y == 0.0 {
        return Err("the accumulated transform has a zero scale");
    }
    let normalized_dot = (transform.a / scale_x) * (transform.b / scale_y)
        + (transform.c / scale_x) * (transform.d / scale_y);
    let min_scale = scale_x.min(scale_y);
    let max_scale = scale_x.max(scale_y);
    if normalized_dot.abs() > 1e-9 || (max_scale - min_scale) / max_scale > 1e-9 {
        return Err("the accumulated transform is nonconformal");
    }
    let scale = min_scale + (max_scale - min_scale) * 0.5;
    scale
        .is_finite()
        .then_some(scale)
        .ok_or("the accumulated transform has a non-finite scale")
}

fn report_uncheckable_bend(
    cell: &Cell,
    path: &str,
    location: Option<BBox>,
    message: String,
    violations: &mut Vec<CheckViolation>,
) {
    let (location, fallback_note) = match location {
        Some(location) => (location, ""),
        None => (
            point_bbox(Point::origin()).expect("origin bend violation BBox must be valid"),
            " The transformed bend position is unrepresentable; violation location uses a deterministic origin fallback.",
        ),
    };
    violations.push(CheckViolation::new(
        CheckViolationType::BendRadiusUncheckable,
        cell.name().to_string(),
        path.to_string(),
        location,
        format!("{message}{fallback_note}"),
        Severity::Error,
    ));
}

/// Run bend radius checks on a cell hierarchy using explicit route annotations.
///
/// Walks all cells (including sub-instances via Library), looks up each cell's
/// annotations by name, checks bend radii against `config.min_bend_radius`,
/// and reports auto-reduced bends.
pub fn check_bend_radius(
    cell: &Cell,
    config: &ChecksConfig,
    library: Option<&Library>,
    route_annotations: &RouteAnnotationMap,
) -> (Vec<CheckViolation>, BendRadiusStats) {
    let mut violations = Vec::new();
    let mut stats = BendRadiusStats::default();

    if let Some(library) = library {
        walk_hierarchy(library, cell, Transform::identity(), |event| {
            if let HierarchyEvent::Enter(placement) = event {
                check_cell_bends(
                    placement.cell,
                    placement.transform,
                    &placement.relative_path_string(),
                    config,
                    route_annotations,
                    &mut violations,
                    &mut stats,
                );
            }
            WalkControl::Continue
        });
    } else {
        check_cell_bends(
            cell,
            Transform::identity(),
            "",
            config,
            route_annotations,
            &mut violations,
            &mut stats,
        );
    }

    (violations, stats)
}

fn check_cell_bends(
    cell: &Cell,
    transform: Transform,
    path: &str,
    config: &ChecksConfig,
    route_annotations: &RouteAnnotationMap,
    violations: &mut Vec<CheckViolation>,
    stats: &mut BendRadiusStats,
) {
    let Some(annotations) = route_annotations.get(cell.name()) else {
        return;
    };
    for bend in annotations.bends() {
        let abs_position = transform.apply(bend.position());
        let location = point_bbox(abs_position);
        let scale = match conformal_scale(transform) {
            Ok(scale) => scale,
            Err(reason) => {
                report_uncheckable_bend(
                    cell,
                    path,
                    location,
                    format!(
                        "Bend in \"{}\" cannot be checked because {reason}.",
                        cell.name()
                    ),
                    violations,
                );
                continue;
            }
        };
        let Some(location) = location else {
            report_uncheckable_bend(
                cell,
                path,
                None,
                format!(
                    "Bend in \"{}\" cannot be checked because transforming its local position ({:.1}, {:.1}) produced non-finite or unrepresentable coordinates.",
                    cell.name(),
                    bend.position().x,
                    bend.position().y,
                ),
                violations,
            );
            continue;
        };
        let radius = bend.radius() * scale;
        let requested_radius = bend.requested_radius().map(|requested| requested * scale);
        if !radius.is_finite() || requested_radius.is_some_and(|requested| !requested.is_finite()) {
            let radius_kind = if !radius.is_finite() {
                "scaled bend radius"
            } else {
                "scaled requested bend radius"
            };
            report_uncheckable_bend(
                cell,
                path,
                Some(location),
                format!(
                    "Bend at ({:.1}, {:.1}) in \"{}\" cannot be checked because the {radius_kind} is non-finite.",
                    abs_position.x,
                    abs_position.y,
                    cell.name(),
                ),
                violations,
            );
            continue;
        }
        stats.bends_checked += 1;

        // Check auto-reduced bends
        if let Some(requested) = requested_radius {
            violations.push(CheckViolation::new(
                CheckViolationType::BendRadiusAutoReduced {
                    radius,
                    requested_radius: requested,
                },
                cell.name().to_string(),
                path.to_string(),
                location,
                format!(
                    "Bend radius auto-reduced from {:.1} to {:.1} \u{00b5}m at ({:.1}, {:.1}) in \"{}\"",
                    requested, radius, abs_position.x, abs_position.y, cell.name()
                ),
                Severity::Warning,
            ));
        }

        // Check minimum bend radius
        if let Some(min_radius) = config.min_bend_radius
            && radius < min_radius
        {
            violations.push(CheckViolation::new(
                CheckViolationType::BendRadiusTooSmall {
                    radius,
                    min_radius,
                },
                cell.name().to_string(),
                path.to_string(),
                location,
                format!(
                    "Bend radius {:.1} \u{00b5}m at ({:.1}, {:.1}) in \"{}\" is below minimum {:.1} \u{00b5}m",
                    radius, abs_position.x, abs_position.y, cell.name(), min_radius
                ),
                config.severity,
            ));
        }
    }
}

#[cfg(test)]
#[allow(unused_must_use)]
mod tests {
    use super::*;
    use rosette_core::{CellRef, Layer, Point, Polygon, Vector2};
    use rosette_route::BendInfo;

    fn make_bend_cell(name: &str, radius: f64) -> (Cell, RouteAnnotations) {
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
        let annotations = RouteAnnotations::new(
            None,
            vec![BendInfo::new(radius, Point::new(5.0, 0.0))],
            Vec::new(),
        );
        (cell, annotations)
    }

    use rosette_core::Port;

    #[test]
    fn test_bend_below_minimum() {
        let (cell, annotations) = make_bend_cell("tight_bend", 3.0);
        let routes = HashMap::from([(cell.name().to_string(), annotations)]);

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let (violations, stats) = check_bend_radius(&cell, &config, None, &routes);

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
        let (cell, annotations) = make_bend_cell("good_bend", 10.0);
        let routes = HashMap::from([(cell.name().to_string(), annotations)]);

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let (violations, stats) = check_bend_radius(&cell, &config, None, &routes);

        assert_eq!(stats.bends_checked, 1);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_no_min_bend_radius_configured() {
        let (cell, annotations) = make_bend_cell("any_bend", 1.0);
        let routes = HashMap::from([(cell.name().to_string(), annotations)]);

        let config = ChecksConfig::default(); // min_bend_radius = None
        let (violations, stats) = check_bend_radius(&cell, &config, None, &routes);

        assert_eq!(stats.bends_checked, 1);
        assert!(violations.is_empty()); // No minimum configured, so no violation
    }

    #[test]
    fn test_auto_reduced_bend() {
        let cell = Cell::new("reduced");
        let routes = HashMap::from([(
            cell.name().to_string(),
            RouteAnnotations::new(
                None,
                vec![BendInfo::auto_reduced(3.0, Point::new(5.0, 0.0), 10.0)],
                Vec::new(),
            ),
        )]);

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let (violations, stats) = check_bend_radius(&cell, &config, None, &routes);

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
        let (bend_cell, annotations) = make_bend_cell("inner_bend", 2.0);
        let routes = HashMap::from([("inner_bend".to_string(), annotations)]);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("inner_bend").at(0.0, 0.0));
        top.add_ref(CellRef::new("inner_bend").at(20.0, 0.0));

        let mut lib = Library::new("test");
        lib.add_cell(bend_cell);
        lib.add_cell(top);

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let (violations, stats) =
            check_bend_radius(lib.cell("top").unwrap(), &config, Some(&lib), &routes);

        assert_eq!(stats.bends_checked, 2); // One bend per instance
        assert_eq!(violations.len(), 2); // Both below minimum
    }

    #[test]
    fn accumulated_magnification_scales_bend_radius_above_one() {
        let (bend_cell, annotations) = make_bend_cell("inner_bend", 3.0);
        let routes = HashMap::from([("inner_bend".to_string(), annotations)]);
        let mut middle = Cell::new("middle");
        middle.add_ref(CellRef::new("inner_bend").scale(2.0));
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("middle").scale(2.0));
        let mut library = Library::new("test");
        library.add_cell(bend_cell);
        library.add_cell(middle);
        library.add_cell(top);

        let config = ChecksConfig::default().with_min_bend_radius(13.0);
        let (violations, stats) = check_bend_radius(
            library.cell("top").unwrap(),
            &config,
            Some(&library),
            &routes,
        );

        assert_eq!(stats.bends_checked, 1);
        assert_eq!(violations.len(), 1);
        assert!(matches!(
            violations[0].violation_type,
            CheckViolationType::BendRadiusTooSmall { radius, min_radius }
                if (radius - 12.0).abs() < 1e-6 && (min_radius - 13.0).abs() < 1e-6
        ));
        assert_eq!(
            violations[0].location,
            BBox::new(Point::new(19.95, -0.05), Point::new(20.05, 0.05))
        );
    }

    #[test]
    fn accumulated_magnification_scales_bend_radii_below_one() {
        let bend_cell = Cell::new("inner_bend");
        let annotations = RouteAnnotations::new(
            None,
            vec![BendInfo::auto_reduced(8.0, Point::new(5.0, 0.0), 12.0)],
            Vec::new(),
        );
        let routes = HashMap::from([("inner_bend".to_string(), annotations)]);
        let mut middle = Cell::new("middle");
        middle.add_ref(CellRef::new("inner_bend").scale(0.5));
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("middle").scale(0.5));
        let mut library = Library::new("test");
        library.add_cell(bend_cell);
        library.add_cell(middle);
        library.add_cell(top);

        let config = ChecksConfig::default().with_min_bend_radius(2.5);
        let (violations, stats) = check_bend_radius(
            library.cell("top").unwrap(),
            &config,
            Some(&library),
            &routes,
        );

        assert_eq!(stats.bends_checked, 1);
        assert_eq!(violations.len(), 2);
        assert!(violations.iter().any(|violation| matches!(
            violation.violation_type,
            CheckViolationType::BendRadiusAutoReduced { radius, requested_radius }
                if (radius - 2.0).abs() < 1e-6 && (requested_radius - 3.0).abs() < 1e-6
        )));
        assert!(
            violations
                .iter()
                .all(|violation| violation.location.is_valid())
        );
    }

    #[test]
    fn scaled_bend_radius_overflow_is_uncheckable() {
        let (bend_cell, annotations) = make_bend_cell("inner_bend", f64::MAX);
        let routes = HashMap::from([("inner_bend".to_string(), annotations)]);
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("inner_bend").scale(2.0));
        let mut library = Library::new("test");
        library.add_cell(bend_cell);
        library.add_cell(top);

        let config = ChecksConfig::default().with_min_bend_radius(f64::MAX);
        let (violations, stats) = check_bend_radius(
            library.cell("top").unwrap(),
            &config,
            Some(&library),
            &routes,
        );

        assert_eq!(violations.len(), 1);
        assert_eq!(stats.bends_checked, 0);
        assert!(matches!(
            violations[0].violation_type,
            CheckViolationType::BendRadiusUncheckable
        ));
        assert_eq!(violations[0].severity, Severity::Error);
        assert!(violations[0].location.is_valid());
        assert!(
            violations[0]
                .message
                .contains("scaled bend radius is non-finite")
        );
    }

    #[test]
    fn nonconformal_transform_makes_bend_uncheckable() {
        let (bend_cell, _) = make_bend_cell("inner_bend", 5.0);
        let annotations = RouteAnnotations::new(
            None,
            vec![
                BendInfo::new(5.0, Point::new(5.0, 0.0)),
                BendInfo::new(6.0, Point::new(6.0, 0.0)),
            ],
            Vec::new(),
        );
        let routes = HashMap::from([("inner_bend".to_string(), annotations)]);
        let mut top = Cell::new("top");
        top.add_ref(CellRef::with_transform(
            "inner_bend",
            Transform::scale(2.0, 1.0),
        ));
        let mut library = Library::new("test");
        library.add_cell(bend_cell);
        library.add_cell(top);

        let (violations, stats) = check_bend_radius(
            library.cell("top").unwrap(),
            &ChecksConfig::default().with_min_bend_radius(5.0),
            Some(&library),
            &routes,
        );

        assert_eq!(stats.bends_checked, 0);
        assert_eq!(violations.len(), 2);
        assert!(violations.iter().all(|violation| matches!(
            violation.violation_type,
            CheckViolationType::BendRadiusUncheckable
        )));
        assert!(
            violations
                .iter()
                .all(|violation| violation.severity == Severity::Error)
        );
        assert_eq!(
            violations[0].location,
            BBox::new(Point::new(9.95, -0.05), Point::new(10.05, 0.05))
        );
        assert!(violations[0].message.contains("nonconformal"));
    }

    #[test]
    fn unrepresentable_bend_position_uses_valid_fallback() {
        let bend_cell = Cell::new("inner_bend");
        let annotations = RouteAnnotations::new(
            None,
            vec![BendInfo::new(5.0, Point::new(f64::MAX, 0.0))],
            Vec::new(),
        );
        let routes = HashMap::from([("inner_bend".to_string(), annotations)]);
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("inner_bend").scale(2.0));
        let mut library = Library::new("test");
        library.add_cell(bend_cell);
        library.add_cell(top);

        let (violations, stats) = check_bend_radius(
            library.cell("top").unwrap(),
            &ChecksConfig::default().with_min_bend_radius(5.0),
            Some(&library),
            &routes,
        );

        assert_eq!(stats.bends_checked, 0);
        assert_eq!(violations.len(), 1);
        assert!(matches!(
            violations[0].violation_type,
            CheckViolationType::BendRadiusUncheckable
        ));
        assert_eq!(
            violations[0].location,
            BBox::new(Point::new(-0.05, -0.05), Point::new(0.05, 0.05))
        );
        assert!(violations[0].location.is_valid());
        assert!(violations[0].message.contains("origin fallback"));
    }

    #[test]
    fn test_aref_bends_are_checked_per_copy() {
        let (bend_cell, annotations) = make_bend_cell("inner_bend", 2.0);
        let routes = HashMap::from([("inner_bend".to_string(), annotations)]);
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("inner_bend").array(3, 2, 20.0, 10.0));
        let mut library = Library::new("test");
        library.add_cell(bend_cell);
        library.add_cell(top);

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let (violations, stats) = check_bend_radius(
            library.cell("top").unwrap(),
            &config,
            Some(&library),
            &routes,
        );

        assert_eq!(stats.bends_checked, 6);
        assert_eq!(violations.len(), 6);
        assert_eq!(violations[5].cell_path, "inner_bend[ref=0,col=2,row=1]");
    }

    #[test]
    fn test_cell_with_no_bends() {
        let cell = Cell::new("empty");

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let (violations, stats) =
            check_bend_radius(&cell, &config, None, &RouteAnnotationMap::new());

        assert_eq!(stats.bends_checked, 0);
        assert!(violations.is_empty());
    }
}
