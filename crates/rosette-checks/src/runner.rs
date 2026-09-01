//! Unified check runner.
//!
//! Orchestrates all design checks (connectivity, bend radius, etc.)
//! and returns a combined result.

use std::time::{Duration, Instant};

use rosette_core::{Cell, Library};

use crate::bend_radius::{self, RouteAnnotationMap};
use crate::config::ChecksConfig;
use crate::connectivity;
use crate::violation::{CheckViolation, Severity};

/// Statistics from a check run.
#[derive(Debug, Clone)]
pub struct ChecksStats {
    /// Number of ports checked (connectivity).
    pub ports_checked: usize,
    /// Number of port-to-port connections found (connectivity).
    pub connections_found: usize,
    /// Number of spatial connectivity nodes checked.
    pub connectivity_nodes: usize,
    /// Number of ports or port widths that could not be checked.
    pub ports_uncheckable: usize,
    /// Number of malformed hierarchy edges encountered.
    pub hierarchy_issues: usize,
    /// Number of bends checked (bend radius).
    pub bends_checked: usize,
    /// Number of bends that could not be checked.
    pub bends_uncheckable: usize,
    /// Cell placements with explicit route annotations.
    pub route_annotation_cells_checked: usize,
    /// Cell placements missing required route annotations.
    pub route_annotation_cells_missing: usize,
    /// Total elapsed time.
    pub elapsed: Duration,
}

/// Result of running all design checks.
#[derive(Debug, Clone)]
pub struct ChecksResult {
    /// List of violations found across all checks.
    pub violations: Vec<CheckViolation>,
    /// Combined statistics.
    pub stats: ChecksStats,
}

impl ChecksResult {
    /// Check if all checks passed (no error-severity violations).
    pub fn passed(&self) -> bool {
        self.error_count() == 0
    }

    /// Number of violations found.
    pub fn violation_count(&self) -> usize {
        self.violations.len()
    }

    /// Number of error-severity violations.
    pub fn error_count(&self) -> usize {
        self.violations
            .iter()
            .filter(|violation| violation.severity == Severity::Error)
            .count()
    }

    /// Number of warning-severity violations.
    pub fn warning_count(&self) -> usize {
        self.violations
            .iter()
            .filter(|violation| violation.severity == Severity::Warning)
            .count()
    }

    /// Whether every discovered entity was checkable and hierarchy traversal completed.
    pub fn complete(&self) -> bool {
        self.stats.ports_uncheckable == 0
            && self.stats.bends_uncheckable == 0
            && self.stats.hierarchy_issues == 0
            && self.stats.route_annotation_cells_missing == 0
    }
}

/// Run connectivity and bend checks with route annotations keyed by cell name.
pub fn run_checks(
    cell: &Cell,
    config: &ChecksConfig,
    library: Option<&Library>,
    route_annotations: &RouteAnnotationMap,
) -> ChecksResult {
    let start = Instant::now();
    let mut violations = Vec::new();

    // 1. Connectivity checks
    let (conn_violations, conn_stats) =
        connectivity::check_connectivity(cell, config, library, route_annotations);
    violations.extend(conn_violations);

    // 2. Bend radius checks
    let (bend_violations, bend_stats) =
        bend_radius::check_bend_radius(cell, config, library, route_annotations);
    violations.extend(bend_violations);
    violations.sort_by(|a, b| {
        a.rule_id()
            .cmp(b.rule_id())
            .then_with(|| a.cell_path.cmp(&b.cell_path))
            .then_with(|| a.name.cmp(&b.name))
            .then_with(|| a.partner_path.cmp(&b.partner_path))
            .then_with(|| a.partner_name.cmp(&b.partner_name))
            .then_with(|| a.location.min().x.total_cmp(&b.location.min().x))
            .then_with(|| a.location.min().y.total_cmp(&b.location.min().y))
    });

    ChecksResult {
        violations,
        stats: ChecksStats {
            ports_checked: conn_stats.ports_checked,
            connections_found: conn_stats.connections_found,
            connectivity_nodes: conn_stats.nodes_checked,
            ports_uncheckable: conn_stats.ports_uncheckable,
            hierarchy_issues: conn_stats.hierarchy_issues,
            bends_checked: bend_stats.bends_checked,
            bends_uncheckable: bend_stats.bends_uncheckable,
            route_annotation_cells_checked: bend_stats.annotation_cells_checked,
            route_annotation_cells_missing: bend_stats.annotation_cells_missing,
            elapsed: start.elapsed(),
        },
    }
}

#[cfg(test)]
#[allow(unused_must_use)]
mod tests {
    use super::*;
    use rosette_core::{CellRef, Layer, Point, Polygon, Port, Vector2};
    use rosette_route::{BendInfo, RouteAnnotations};

    #[test]
    fn test_run_checks_all_pass() {
        let mut cell = Cell::new("top").unwrap();
        cell.add_port(Port::with_width("in", Point::origin(), -Vector2::unit_x(), 0.5).unwrap())
            .unwrap();
        cell.add_port(
            Port::with_width("out", Point::new(10.0, 0.0), Vector2::unit_x(), 0.5).unwrap(),
        )
        .unwrap();
        let routes = RouteAnnotationMap::from([(
            "top".to_string(),
            RouteAnnotations::new(
                None,
                vec![BendInfo::new(10.0, Point::new(5.0, 0.0)).unwrap()],
                Vec::new(),
            )
            .unwrap(),
        )]);

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let result = run_checks(&cell, &config, None, &routes);

        assert!(result.passed());
        assert_eq!(result.stats.ports_checked, 2);
        assert_eq!(result.stats.bends_checked, 1);
    }

    #[test]
    fn test_run_checks_mixed_violations() {
        // Cell with an unconnected sub-instance port and a tight bend
        let mut wg = Cell::new("wg").unwrap();
        wg.add_polygon(
            Polygon::rect(Point::origin(), 10.0, 0.5).unwrap(),
            Layer::new(1, 0),
        );
        wg.add_port(
            Port::with_width("in", Point::new(0.0, 0.25), -Vector2::unit_x(), 0.5).unwrap(),
        )
        .unwrap();
        wg.add_port(
            Port::with_width("out", Point::new(10.0, 0.25), Vector2::unit_x(), 0.5).unwrap(),
        )
        .unwrap();
        let routes = RouteAnnotationMap::from([(
            "wg".to_string(),
            RouteAnnotations::new(
                None,
                vec![BendInfo::new(2.0, Point::new(5.0, 0.25)).unwrap()],
                Vec::new(),
            )
            .unwrap(),
        )]);

        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("wg").unwrap());
        // Only cover "in" port — "out" is unconnected
        top.add_port(
            Port::with_width("in", Point::new(0.0, 0.25), -Vector2::unit_x(), 0.5).unwrap(),
        )
        .unwrap();

        let mut lib = Library::new("test");
        lib.add_cell(wg);
        lib.add_cell(top);

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let result = run_checks(lib.cell("top").unwrap(), &config, Some(&lib), &routes);

        assert!(!result.passed());
        // Should have unconnected port + bend radius violation
        assert!(result.violation_count() >= 2);
    }

    #[test]
    fn test_run_checks_default_config() {
        // With default config (no min_bend_radius), only connectivity runs meaningfully
        let cell = Cell::new("empty").unwrap();
        let result = run_checks(
            &cell,
            &ChecksConfig::default(),
            None,
            &RouteAnnotationMap::new(),
        );

        assert!(result.passed());
        assert_eq!(result.stats.ports_checked, 0);
        assert_eq!(result.stats.bends_checked, 0);
    }

    #[test]
    fn warning_only_result_passes() {
        let result = ChecksResult {
            violations: vec![CheckViolation::new(
                crate::CheckViolationType::BendRadiusAutoReduced {
                    radius: 3.0,
                    requested_radius: 5.0,
                },
                "route",
                "",
                rosette_core::BBox::new(Point::origin(), Point::origin()).unwrap(),
                "bend radius was auto-reduced",
                crate::Severity::Warning,
            )],
            stats: ChecksStats {
                ports_checked: 0,
                connections_found: 0,
                connectivity_nodes: 0,
                ports_uncheckable: 0,
                hierarchy_issues: 0,
                bends_checked: 1,
                bends_uncheckable: 0,
                route_annotation_cells_checked: 1,
                route_annotation_cells_missing: 0,
                elapsed: Duration::ZERO,
            },
        };

        assert!(result.passed());
        assert_eq!(result.error_count(), 0);
        assert_eq!(result.warning_count(), 1);
        assert_eq!(result.violation_count(), 1);
    }

    #[test]
    fn unrelated_same_facing_ports_do_not_count_as_connected() {
        let mut left = Cell::new("left").unwrap();
        left.add_port(Port::new("port", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();
        let mut right = Cell::new("right").unwrap();
        right
            .add_port(Port::new("port", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();
        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("left").unwrap());
        top.add_ref(CellRef::new("right").unwrap());
        let mut library = Library::new("test");
        library.add_cell(left).unwrap();
        library.add_cell(right).unwrap();
        library.add_cell(top).unwrap();

        let result = run_checks(
            library.cell("top").unwrap(),
            &ChecksConfig::default(),
            Some(&library),
            &RouteAnnotationMap::new(),
        );

        assert!(!result.passed());
        assert!(result.violations.iter().any(|violation| matches!(
            violation.violation_type,
            crate::CheckViolationType::AngleMismatch { .. }
        )));
        assert_eq!(result.stats.connections_found, 0);
    }

    #[test]
    fn three_terminal_node_is_reported_as_a_short() {
        let directions = [Vector2::unit_x(), -Vector2::unit_x(), Vector2::unit_x()];
        let mut top = Cell::new("top").unwrap();
        let mut library = Library::new("test");
        for (index, direction) in directions.into_iter().enumerate() {
            let name = format!("leaf_{index}");
            let mut leaf = Cell::new(&name).unwrap();
            leaf.add_port(Port::new("port", Point::origin(), direction).unwrap())
                .unwrap();
            top.add_ref(CellRef::new(&name).unwrap());
            library.add_cell(leaf).unwrap();
        }
        library.add_cell(top).unwrap();

        let result = run_checks(
            library.cell("top").unwrap(),
            &ChecksConfig::default(),
            Some(&library),
            &RouteAnnotationMap::new(),
        );

        assert!(result.violations.iter().any(|violation| matches!(
            violation.violation_type,
            crate::CheckViolationType::ShortedNet { terminal_count: 3 }
        )));
        assert_eq!(result.stats.connections_found, 0);
    }

    #[test]
    fn configured_angle_tolerance_controls_connection_acceptance() {
        let mut left = Cell::new("left").unwrap();
        left.add_port(Port::new("port", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();
        let angle = 170.0_f64.to_radians();
        let mut right = Cell::new("right").unwrap();
        right
            .add_port(
                Port::new(
                    "port",
                    Point::origin(),
                    Vector2::new(angle.cos(), angle.sin()),
                )
                .unwrap(),
            )
            .unwrap();
        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("left").unwrap());
        top.add_ref(CellRef::new("right").unwrap());
        let mut library = Library::new("test");
        library.add_cell(left).unwrap();
        library.add_cell(right).unwrap();
        library.add_cell(top).unwrap();

        let config = ChecksConfig::default().with_angle_tolerance(20.0);
        let result = run_checks(
            library.cell("top").unwrap(),
            &config,
            Some(&library),
            &RouteAnnotationMap::new(),
        );

        assert!(
            result.passed(),
            "unexpected violations: {:?}",
            result.violations
        );
        assert_eq!(result.stats.connections_found, 1);
    }

    #[test]
    fn missing_reference_makes_the_run_incomplete() {
        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("missing").unwrap());
        let mut library = Library::new("test");
        library.add_cell(top).unwrap();

        let result = run_checks(
            library.cell("top").unwrap(),
            &ChecksConfig::default(),
            Some(&library),
            &RouteAnnotationMap::new(),
        );

        assert!(!result.passed());
        assert!(!result.complete());
        assert_eq!(result.stats.hierarchy_issues, 1);
        assert!(matches!(
            result.violations[0].violation_type,
            crate::CheckViolationType::MissingReference
        ));
    }

    #[test]
    fn untransformable_port_makes_the_run_incomplete() {
        let mut leaf = Cell::new("leaf").unwrap();
        leaf.add_port(Port::new("port", Point::new(2.0, 0.0), Vector2::unit_x()).unwrap())
            .unwrap();
        let mut middle = Cell::new("middle").unwrap();
        middle.add_ref(CellRef::new("leaf").unwrap().scale(f64::MAX).unwrap());
        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("middle").unwrap().scale(f64::MAX).unwrap());
        let mut library = Library::new("test");
        library.add_cell(leaf).unwrap();
        library.add_cell(middle).unwrap();
        library.add_cell(top).unwrap();

        let result = run_checks(
            library.cell("top").unwrap(),
            &ChecksConfig::default(),
            Some(&library),
            &RouteAnnotationMap::new(),
        );

        assert!(!result.passed());
        assert!(!result.complete());
        assert_eq!(result.stats.ports_uncheckable, 1);
        assert!(result.violations.iter().any(|violation| matches!(
            violation.violation_type,
            crate::CheckViolationType::PortUncheckable
        )));
    }

    #[test]
    fn conformal_scaling_is_applied_to_port_widths() {
        let mut narrow = Cell::new("narrow").unwrap();
        narrow
            .add_port(Port::with_width("port", Point::origin(), Vector2::unit_x(), 0.5).unwrap())
            .unwrap();
        let mut wide = Cell::new("wide").unwrap();
        wide.add_port(Port::with_width("port", Point::origin(), -Vector2::unit_x(), 1.0).unwrap())
            .unwrap();
        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("narrow").unwrap().scale(2.0).unwrap());
        top.add_ref(CellRef::new("wide").unwrap());
        let mut library = Library::new("test");
        library.add_cell(narrow).unwrap();
        library.add_cell(wide).unwrap();
        library.add_cell(top).unwrap();

        let result = run_checks(
            library.cell("top").unwrap(),
            &ChecksConfig::default(),
            Some(&library),
            &RouteAnnotationMap::new(),
        );

        assert!(
            result.passed(),
            "unexpected violations: {:?}",
            result.violations
        );
        assert_eq!(result.stats.connections_found, 1);
    }

    #[test]
    fn geometry_without_route_annotations_makes_bend_check_incomplete() {
        let mut cell = Cell::new("geometry").unwrap();
        cell.add_polygon(
            Polygon::rect(Point::origin(), 10.0, 1.0).unwrap(),
            Layer::new(1, 0),
        );

        let result = run_checks(
            &cell,
            &ChecksConfig::default().with_min_bend_radius(5.0),
            None,
            &RouteAnnotationMap::new(),
        );

        assert!(!result.passed());
        assert!(!result.complete());
        assert_eq!(result.stats.route_annotation_cells_missing, 1);
        assert!(matches!(
            result.violations[0].violation_type,
            crate::CheckViolationType::RouteAnnotationsMissing
        ));
    }

    #[test]
    fn route_warnings_are_reported_without_failing_the_run() {
        let cell = Cell::new("route").unwrap();
        let routes = RouteAnnotationMap::from([(
            "route".to_string(),
            RouteAnnotations::new(None, Vec::new(), vec!["route warning".to_string()]).unwrap(),
        )]);

        let result = run_checks(&cell, &ChecksConfig::default(), None, &routes);

        assert!(result.passed());
        assert_eq!(result.warning_count(), 1);
        assert_eq!(result.violations[0].rule_id(), "routing.warning");
        assert!(matches!(
            result.violations[0].violation_type,
            crate::CheckViolationType::RouteWarning
        ));
    }

    #[test]
    fn hierarchical_port_promotions_do_not_create_extra_terminals() {
        let mut waveguide = Cell::new("waveguide").unwrap();
        waveguide
            .add_port(Port::with_width("in", Point::origin(), -Vector2::unit_x(), 0.5).unwrap())
            .unwrap();
        waveguide
            .add_port(
                Port::with_width("out", Point::new(10.0, 0.0), Vector2::unit_x(), 0.5).unwrap(),
            )
            .unwrap();
        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("waveguide").unwrap());
        top.add_ref(CellRef::new("waveguide").unwrap().at(10.0, 0.0).unwrap());
        top.add_port(Port::with_width("in", Point::origin(), -Vector2::unit_x(), 0.5).unwrap())
            .unwrap();
        top.add_port(
            Port::with_width("out", Point::new(20.0, 0.0), Vector2::unit_x(), 0.5).unwrap(),
        )
        .unwrap();
        let mut library = Library::new("test");
        library.add_cell(waveguide).unwrap();
        library.add_cell(top).unwrap();

        let result = run_checks(
            library.cell("top").unwrap(),
            &ChecksConfig::default(),
            Some(&library),
            &RouteAnnotationMap::new(),
        );

        assert!(
            result.passed(),
            "unexpected violations: {:?}",
            result.violations
        );
        assert_eq!(result.stats.connections_found, 1);
        assert_eq!(result.stats.connectivity_nodes, 3);
    }

    #[test]
    fn configured_width_tolerance_controls_mismatch_reporting() {
        let mut left = Cell::new("left").unwrap();
        left.add_port(Port::with_width("port", Point::origin(), Vector2::unit_x(), 0.5).unwrap())
            .unwrap();
        let mut right = Cell::new("right").unwrap();
        right
            .add_port(
                Port::with_width("port", Point::origin(), -Vector2::unit_x(), 0.5005).unwrap(),
            )
            .unwrap();
        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("left").unwrap());
        top.add_ref(CellRef::new("right").unwrap());
        let mut library = Library::new("test");
        library.add_cell(left).unwrap();
        library.add_cell(right).unwrap();
        library.add_cell(top).unwrap();

        let accepted = run_checks(
            library.cell("top").unwrap(),
            &ChecksConfig::default().with_width_tolerance(0.001),
            Some(&library),
            &RouteAnnotationMap::new(),
        );
        let rejected = run_checks(
            library.cell("top").unwrap(),
            &ChecksConfig::default().with_width_tolerance(0.0001),
            Some(&library),
            &RouteAnnotationMap::new(),
        );

        assert!(accepted.passed());
        assert!(rejected.violations.iter().any(|violation| matches!(
            violation.violation_type,
            crate::CheckViolationType::WidthMismatch { .. }
        )));
    }

    #[test]
    fn physical_angle_tolerance_does_not_change_promotion_identity() {
        let mut child = Cell::new("child").unwrap();
        child
            .add_port(Port::new("port", Point::origin(), -Vector2::unit_x()).unwrap())
            .unwrap();
        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("child").unwrap());
        top.add_port(Port::new("port", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();
        let mut library = Library::new("test");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let result = run_checks(
            library.cell("top").unwrap(),
            &ChecksConfig::default().with_angle_tolerance(180.0),
            Some(&library),
            &RouteAnnotationMap::new(),
        );

        assert!(result.passed());
        assert_eq!(result.stats.connections_found, 1);
    }

    #[test]
    fn route_endpoint_provenance_allows_same_facing_component_attachment() {
        let mut component = Cell::new("component").unwrap();
        component
            .add_port(Port::new("opt", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();
        let mut route = Cell::new("route").unwrap();
        route
            .add_port(Port::new("in", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();
        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("component").unwrap());
        top.add_ref(CellRef::new("route").unwrap());
        let mut library = Library::new("test");
        library.add_cell(component).unwrap();
        library.add_cell(route).unwrap();
        library.add_cell(top).unwrap();
        let routes = RouteAnnotationMap::from([(
            "route".to_string(),
            RouteAnnotations::new(None, Vec::new(), Vec::new()).unwrap(),
        )]);

        let result = run_checks(
            library.cell("top").unwrap(),
            &ChecksConfig::default(),
            Some(&library),
            &routes,
        );

        assert!(
            result.passed(),
            "unexpected violations: {:?}",
            result.violations
        );
        assert_eq!(result.stats.connections_found, 1);
    }

    #[test]
    fn route_output_does_not_exempt_same_facing_ports() {
        let mut component = Cell::new("component").unwrap();
        component
            .add_port(Port::new("opt", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();
        let mut route = Cell::new("route").unwrap();
        route
            .add_port(Port::new("out", Point::origin(), Vector2::unit_x()).unwrap())
            .unwrap();
        let mut top = Cell::new("top").unwrap();
        top.add_ref(CellRef::new("component").unwrap());
        top.add_ref(CellRef::new("route").unwrap());
        let mut library = Library::new("test");
        library.add_cell(component).unwrap();
        library.add_cell(route).unwrap();
        library.add_cell(top).unwrap();
        let routes = RouteAnnotationMap::from([(
            "route".to_string(),
            RouteAnnotations::new(None, Vec::new(), Vec::new()).unwrap(),
        )]);

        let result = run_checks(
            library.cell("top").unwrap(),
            &ChecksConfig::default(),
            Some(&library),
            &routes,
        );

        assert!(result.violations.iter().any(|violation| matches!(
            violation.violation_type,
            crate::CheckViolationType::AngleMismatch { .. }
        )));
        assert_eq!(result.stats.connections_found, 0);
    }
}
