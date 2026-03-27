//! Unified check runner.
//!
//! Orchestrates all design checks (connectivity, bend radius, etc.)
//! and returns a combined result.

use std::time::{Duration, Instant};

use rosette_core::{Cell, Library};

use crate::bend_radius;
use crate::config::ChecksConfig;
use crate::connectivity;
use crate::violation::CheckViolation;

/// Statistics from a check run.
#[derive(Debug, Clone)]
pub struct ChecksStats {
    /// Number of ports checked (connectivity).
    pub ports_checked: usize,
    /// Number of port-to-port connections found (connectivity).
    pub connections_found: usize,
    /// Number of bends checked (bend radius).
    pub bends_checked: usize,
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
    /// Check if all checks passed (no violations).
    pub fn passed(&self) -> bool {
        self.violations.is_empty()
    }

    /// Number of violations found.
    pub fn violation_count(&self) -> usize {
        self.violations.len()
    }
}

/// Run all design checks on a cell.
///
/// Runs connectivity checks and bend radius checks in sequence,
/// returning a unified result.
pub fn run_checks(cell: &Cell, config: &ChecksConfig, library: Option<&Library>) -> ChecksResult {
    let start = Instant::now();
    let mut violations = Vec::new();

    // 1. Connectivity checks
    let (conn_violations, conn_stats) = connectivity::check_connectivity(cell, config, library);
    violations.extend(conn_violations);

    // 2. Bend radius checks
    let (bend_violations, bend_stats) = bend_radius::check_bend_radius(cell, config, library);
    violations.extend(bend_violations);

    ChecksResult {
        violations,
        stats: ChecksStats {
            ports_checked: conn_stats.ports_checked,
            connections_found: conn_stats.connections_found,
            bends_checked: bend_stats.bends_checked,
            elapsed: start.elapsed(),
        },
    }
}

#[cfg(test)]
#[allow(unused_must_use)]
mod tests {
    use super::*;
    use rosette_core::{BendInfo, CellRef, Layer, Point, Polygon, Port, Vector2};

    #[test]
    fn test_run_checks_all_pass() {
        let mut cell = Cell::new("top");
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
        cell.add_bend(BendInfo::new(10.0, Point::new(5.0, 0.0)));

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let result = run_checks(&cell, &config, None);

        assert!(result.passed());
        assert_eq!(result.stats.ports_checked, 2);
        assert_eq!(result.stats.bends_checked, 1);
    }

    #[test]
    fn test_run_checks_mixed_violations() {
        // Cell with an unconnected sub-instance port and a tight bend
        let mut wg = Cell::new("wg");
        wg.add_polygon(Polygon::rect(Point::origin(), 10.0, 0.5), Layer::new(1, 0));
        wg.add_port(Port::with_width(
            "in",
            Point::new(0.0, 0.25),
            -Vector2::unit_x(),
            0.5,
        ));
        wg.add_port(Port::with_width(
            "out",
            Point::new(10.0, 0.25),
            Vector2::unit_x(),
            0.5,
        ));
        wg.add_bend(BendInfo::new(2.0, Point::new(5.0, 0.25)));

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("wg"));
        // Only cover "in" port — "out" is unconnected
        top.add_port(Port::with_width(
            "in",
            Point::new(0.0, 0.25),
            -Vector2::unit_x(),
            0.5,
        ));

        let mut lib = Library::new("test");
        lib.add_cell(wg);
        lib.add_cell(top);

        let config = ChecksConfig::default().with_min_bend_radius(5.0);
        let result = run_checks(lib.cell("top").unwrap(), &config, Some(&lib));

        assert!(!result.passed());
        // Should have unconnected port + bend radius violation
        assert!(result.violation_count() >= 2);
    }

    #[test]
    fn test_run_checks_default_config() {
        // With default config (no min_bend_radius), only connectivity runs meaningfully
        let cell = Cell::new("empty");
        let result = run_checks(&cell, &ChecksConfig::default(), None);

        assert!(result.passed());
        assert_eq!(result.stats.ports_checked, 0);
        assert_eq!(result.stats.bends_checked, 0);
    }
}
