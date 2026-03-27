//! Connectivity check execution engine.

use std::time::{Duration, Instant};

use rosette_core::{BBox, Cell, Library, Point, Port, Transform};

use crate::config::ConnectivityConfig;
use crate::violation::{ConnViolation, ConnViolationType, Severity};

/// Statistics from a connectivity check run.
#[derive(Debug, Clone)]
pub struct ConnectivityStats {
    /// Number of ports checked.
    pub ports_checked: usize,
    /// Number of port-to-port connections found.
    pub connections_found: usize,
    /// Total elapsed time.
    pub elapsed: Duration,
}

/// Result of running a connectivity check.
#[derive(Debug, Clone)]
pub struct ConnectivityResult {
    /// List of violations found.
    pub violations: Vec<ConnViolation>,
    /// Statistics from the run.
    pub stats: ConnectivityStats,
}

impl ConnectivityResult {
    /// Check if the connectivity check passed (no violations).
    pub fn passed(&self) -> bool {
        self.violations.is_empty()
    }

    /// Number of violations found.
    pub fn violation_count(&self) -> usize {
        self.violations.len()
    }
}

/// A port resolved to its absolute position in the design hierarchy.
#[derive(Debug)]
struct FlatPort {
    /// The port with position/direction transformed to absolute coordinates.
    port: Port,
    /// Hierarchy path (e.g. "mmi_1" or "arm_1/bend_2").
    cell_path: String,
    /// True for ports defined directly on the top-level cell.
    is_top_level: bool,
}

/// Recursively collect all ports from a cell hierarchy, applying transforms.
fn flatten_ports(
    cell: &Cell,
    library: Option<&Library>,
    transform: &Transform,
    path: &str,
    is_top: bool,
) -> Vec<FlatPort> {
    let mut result = Vec::new();

    // Collect this cell's own ports (transformed to absolute coordinates)
    for port in cell.ports() {
        let transformed = port.transform(transform);
        result.push(FlatPort {
            port: transformed,
            cell_path: path.to_string(),
            is_top_level: is_top,
        });
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
                let child_ports = flatten_ports(ref_cell, Some(lib), &combined, &child_path, false);
                result.extend(child_ports);
            }
        }
    }

    result
}

/// Compute the angular deviation between two ports from perfect anti-parallel
/// alignment. Returns the deviation in degrees (0 = perfectly anti-parallel).
fn angle_deviation_deg(a: &Port, b: &Port) -> f64 {
    // Dot product of perfectly anti-parallel unit vectors is -1.
    // dot = cos(theta) where theta is angle between directions.
    // Deviation from anti-parallel = 180 - theta = 180 - acos(dot).
    let dot = a.direction.dot(b.direction);
    // Clamp to [-1, 1] for numerical safety
    let dot_clamped = dot.clamp(-1.0, 1.0);
    let theta_deg = dot_clamped.acos().to_degrees();
    // theta_deg is angle between the two direction vectors.
    // For anti-parallel, theta should be 180. Deviation is |180 - theta|.
    (180.0 - theta_deg).abs()
}

/// Make a point-sized BBox centred on a port position for violation location.
fn port_bbox(port: &Port) -> BBox {
    // Create a small bbox around the port for location reporting.
    let half = 0.05; // 50nm box for visibility
    BBox::new(
        Point::new(port.position.x - half, port.position.y - half),
        Point::new(port.position.x + half, port.position.y + half),
    )
}

/// Run connectivity checks on a cell.
///
/// Flattens the cell hierarchy, identifies port connections by proximity
/// and direction, then checks for unconnected ports, width mismatches,
/// and angle misalignment.
///
/// Ports on the top-level cell are treated as external I/O and are not
/// flagged as unconnected.
pub fn run_connectivity(
    cell: &Cell,
    config: &ConnectivityConfig,
    library: Option<&Library>,
) -> ConnectivityResult {
    let start = Instant::now();

    let flat_ports = flatten_ports(cell, library, &Transform::identity(), "", true);
    let n = flat_ports.len();

    // Track which ports have been matched to a partner
    let mut matched = vec![false; n];
    // Track matched pairs for width/angle checks
    let mut pairs: Vec<(usize, usize)> = Vec::new();
    let mut violations = Vec::new();

    // O(n^2) pairwise matching — fine for typical port counts (10s-100s)
    for i in 0..n {
        for j in (i + 1)..n {
            let dist = flat_ports[i]
                .port
                .position
                .distance_to(flat_ports[j].port.position);
            if dist > config.position_tolerance {
                continue;
            }

            let dot = flat_ports[i]
                .port
                .direction
                .dot(flat_ports[j].port.direction);

            if dot < -0.99 {
                // Anti-parallel (opposite directions) = a real connection
                matched[i] = true;
                matched[j] = true;
                pairs.push((i, j));
            } else if dot > 0.99 {
                // Co-located with same direction = same physical port shared
                // between instances (e.g., a route's port placed at a component's
                // port). Both are covered.
                matched[i] = true;
                matched[j] = true;
            }
        }
    }

    // A sub-instance port is also "covered" if a top-level port exists at the
    // same position (within tolerance). Top-level ports declare external I/O —
    // they cover sub-instance ports regardless of direction.
    for i in 0..n {
        if matched[i] || flat_ports[i].is_top_level {
            continue;
        }
        for j in 0..n {
            if i == j || !flat_ports[j].is_top_level {
                continue;
            }
            let dist = flat_ports[i]
                .port
                .position
                .distance_to(flat_ports[j].port.position);
            if dist <= config.position_tolerance {
                matched[i] = true;
                break;
            }
        }
    }

    // Check matched pairs for width mismatch and angle precision
    for &(i, j) in &pairs {
        let a = &flat_ports[i];
        let b = &flat_ports[j];

        // Width mismatch check
        if config.check_widths
            && let (Some(wa), Some(wb)) = (a.port.width, b.port.width)
            && (wa - wb).abs() > 1e-6
        {
            let msg = format!(
                "Width mismatch: \"{}\"{} has {:.3} \u{00b5}m, \"{}\"{} has {:.3} \u{00b5}m",
                a.port.name,
                if a.cell_path.is_empty() {
                    String::new()
                } else {
                    format!(" on {}", a.cell_path)
                },
                wa,
                b.port.name,
                if b.cell_path.is_empty() {
                    String::new()
                } else {
                    format!(" on {}", b.cell_path)
                },
                wb,
            );
            violations.push(
                ConnViolation::new(
                    ConnViolationType::WidthMismatch {
                        width_a: wa,
                        width_b: wb,
                    },
                    a.port.name.clone(),
                    a.cell_path.clone(),
                    port_bbox(&a.port),
                    msg,
                    config.severity,
                )
                .with_partner(b.port.name.clone(), b.cell_path.clone()),
            );
        }

        // Angle precision check
        let deviation = angle_deviation_deg(&a.port, &b.port);
        if deviation > config.angle_tolerance {
            let msg = format!(
                "Angle deviation {:.2}\u{00b0} between \"{}\"{} and \"{}\"{} exceeds tolerance {:.2}\u{00b0}",
                deviation,
                a.port.name,
                if a.cell_path.is_empty() {
                    String::new()
                } else {
                    format!(" on {}", a.cell_path)
                },
                b.port.name,
                if b.cell_path.is_empty() {
                    String::new()
                } else {
                    format!(" on {}", b.cell_path)
                },
                config.angle_tolerance,
            );
            violations.push(
                ConnViolation::new(
                    ConnViolationType::AngleMismatch {
                        deviation_deg: deviation,
                        tolerance_deg: config.angle_tolerance,
                    },
                    a.port.name.clone(),
                    a.cell_path.clone(),
                    port_bbox(&a.port),
                    msg,
                    // Angle mismatch is typically a warning since can_connect_to
                    // already enforces a coarse anti-parallel check.
                    Severity::Warning,
                )
                .with_partner(b.port.name.clone(), b.cell_path.clone()),
            );
        }
    }

    // Flag unconnected ports (skip top-level ports — they are external I/O)
    for (i, fp) in flat_ports.iter().enumerate() {
        if !matched[i] && !fp.is_top_level {
            let msg = format!(
                "Port \"{}\" on {} has no connection",
                fp.port.name,
                if fp.cell_path.is_empty() {
                    "top cell"
                } else {
                    &fp.cell_path
                },
            );
            violations.push(ConnViolation::new(
                ConnViolationType::UnconnectedPort,
                fp.port.name.clone(),
                fp.cell_path.clone(),
                port_bbox(&fp.port),
                msg,
                config.severity,
            ));
        }
    }

    let connections_found = pairs.len();

    ConnectivityResult {
        violations,
        stats: ConnectivityStats {
            ports_checked: n,
            connections_found,
            elapsed: start.elapsed(),
        },
    }
}

#[cfg(test)]
#[allow(unused_must_use)]
mod tests {
    use super::*;
    use rosette_core::{CellRef, Layer, Point, Polygon, Vector2};

    fn make_component(name: &str, length: f64, width: f64) -> Cell {
        let mut cell = Cell::new(name);
        cell.add_polygon(
            Polygon::rect(Point::origin(), length, width),
            Layer::new(1, 0),
        );
        cell.add_port(Port::with_width(
            "in",
            Point::new(0.0, width / 2.0),
            -Vector2::unit_x(),
            width,
        ));
        cell.add_port(Port::with_width(
            "out",
            Point::new(length, width / 2.0),
            Vector2::unit_x(),
            width,
        ));
        cell
    }

    fn default_config() -> ConnectivityConfig {
        ConnectivityConfig::default()
    }

    #[test]
    fn test_all_connected() {
        // Two waveguides placed end-to-end: wg1.out connects to wg2.in
        let wg1 = make_component("wg1", 10.0, 0.5);
        let wg2 = make_component("wg2", 10.0, 0.5);

        let mut lib = Library::new("test");
        lib.add_cell(wg1);
        lib.add_cell(wg2);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("wg1"));
        // Place wg2 so its "in" port (at 0.0, 0.25) aligns with wg1's "out" (at 10.0, 0.25)
        top.add_ref(CellRef::new("wg2").at(10.0, 0.0));

        // Top cell gets external ports (same direction as sub-instance ports —
        // these are I/O declarations, not connectable partners).
        top.add_port(Port::with_width(
            "in",
            Point::new(0.0, 0.25),
            -Vector2::unit_x(),
            0.5,
        ));
        top.add_port(Port::with_width(
            "out",
            Point::new(20.0, 0.25),
            Vector2::unit_x(),
            0.5,
        ));

        lib.add_cell(top);

        let result = run_connectivity(lib.cell("top").unwrap(), &default_config(), Some(&lib));

        assert!(
            result.passed(),
            "Expected no violations but got: {:?}",
            result.violations
        );
        assert_eq!(result.stats.ports_checked, 6); // 2 ports on each of 2 instances + 2 top
        assert_eq!(result.stats.connections_found, 1); // wg1.out <-> wg2.in
    }

    #[test]
    fn test_unconnected_port() {
        // One waveguide with a dangling "out" port (nothing connected)
        let wg = make_component("wg", 10.0, 0.5);

        let mut lib = Library::new("test");
        lib.add_cell(wg);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("wg"));
        // Only connect the "in" side
        top.add_port(Port::with_width(
            "in",
            Point::new(0.0, 0.25),
            -Vector2::unit_x(),
            0.5,
        ));

        lib.add_cell(top);

        let result = run_connectivity(lib.cell("top").unwrap(), &default_config(), Some(&lib));

        assert!(!result.passed());
        assert_eq!(result.violation_count(), 1);
        assert_eq!(
            result.violations[0].violation_type,
            ConnViolationType::UnconnectedPort
        );
        assert_eq!(result.violations[0].port_name, "out");
    }

    #[test]
    fn test_width_mismatch() {
        // Two waveguides with different widths connected
        let wg1 = make_component("wg1", 10.0, 0.5);
        let wg2 = make_component("wg2", 10.0, 0.4);

        let mut lib = Library::new("test");
        lib.add_cell(wg1);
        lib.add_cell(wg2);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("wg1"));
        // Place wg2 so its "in" port aligns with wg1's "out" port position-wise
        // wg1 "out" is at (10.0, 0.25), wg2 "in" is at (0.0, 0.2), so translate by (10.0, 0.05)
        top.add_ref(CellRef::new("wg2").at(10.0, 0.05));

        // Add top-level ports to cover the external ends
        top.add_port(Port::with_width(
            "in",
            Point::new(0.0, 0.25),
            -Vector2::unit_x(),
            0.5,
        ));
        top.add_port(Port::with_width(
            "out",
            Point::new(20.0, 0.25),
            Vector2::unit_x(),
            0.4,
        ));

        lib.add_cell(top);

        let result = run_connectivity(lib.cell("top").unwrap(), &default_config(), Some(&lib));

        let width_violations: Vec<_> = result
            .violations
            .iter()
            .filter(|v| matches!(v.violation_type, ConnViolationType::WidthMismatch { .. }))
            .collect();

        assert!(
            !width_violations.is_empty(),
            "Expected width mismatch violation"
        );
    }

    #[test]
    fn test_top_level_ports_exempt() {
        // A top cell with ports but no sub-instances — ports should not be flagged
        let mut top = Cell::new("top");
        top.add_port(Port::with_width(
            "in",
            Point::origin(),
            -Vector2::unit_x(),
            0.5,
        ));
        top.add_port(Port::with_width(
            "out",
            Point::new(100.0, 0.0),
            Vector2::unit_x(),
            0.5,
        ));

        let result = run_connectivity(&top, &default_config(), None);

        assert!(result.passed());
        assert_eq!(result.stats.ports_checked, 2);
        assert_eq!(result.stats.connections_found, 0);
    }

    #[test]
    fn test_empty_cell() {
        let cell = Cell::new("empty");
        let result = run_connectivity(&cell, &default_config(), None);

        assert!(result.passed());
        assert_eq!(result.stats.ports_checked, 0);
        assert_eq!(result.stats.connections_found, 0);
    }

    #[test]
    fn test_with_hierarchy() {
        // Nested hierarchy: top -> arm -> wg
        let wg = make_component("wg", 10.0, 0.5);

        let mut arm = Cell::new("arm");
        arm.add_ref(CellRef::new("wg"));
        arm.add_port(Port::with_width(
            "in",
            Point::new(0.0, 0.25),
            -Vector2::unit_x(),
            0.5,
        ));
        arm.add_port(Port::with_width(
            "out",
            Point::new(10.0, 0.25),
            Vector2::unit_x(),
            0.5,
        ));

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("arm"));
        top.add_ref(CellRef::new("arm").at(10.0, 0.0));
        top.add_port(Port::with_width(
            "in",
            Point::new(0.0, 0.25),
            -Vector2::unit_x(),
            0.5,
        ));
        top.add_port(Port::with_width(
            "out",
            Point::new(20.0, 0.25),
            Vector2::unit_x(),
            0.5,
        ));

        let mut lib = Library::new("test");
        lib.add_cell(wg);
        lib.add_cell(arm);
        lib.add_cell(top);

        let result = run_connectivity(lib.cell("top").unwrap(), &default_config(), Some(&lib));

        // The two arm instances should connect at x=10.0
        // arm[0].out at (10, 0.25) and arm[1].in at (10, 0.25) -> connected
        assert!(
            result.passed(),
            "Expected no violations but got: {:?}",
            result.violations
        );
        assert!(result.stats.connections_found >= 1);
    }

    #[test]
    fn test_check_widths_disabled() {
        // Width mismatch should not be flagged when check_widths is false
        let wg1 = make_component("wg1", 10.0, 0.5);
        let wg2 = make_component("wg2", 10.0, 0.4);

        let mut lib = Library::new("test");
        lib.add_cell(wg1);
        lib.add_cell(wg2);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("wg1"));
        top.add_ref(CellRef::new("wg2").at(10.0, 0.05));
        top.add_port(Port::with_width(
            "in",
            Point::new(0.0, 0.25),
            -Vector2::unit_x(),
            0.5,
        ));
        top.add_port(Port::with_width(
            "out",
            Point::new(20.0, 0.25),
            Vector2::unit_x(),
            0.4,
        ));

        lib.add_cell(top);

        let config = ConnectivityConfig::default().with_check_widths(false);
        let result = run_connectivity(lib.cell("top").unwrap(), &config, Some(&lib));

        let width_violations: Vec<_> = result
            .violations
            .iter()
            .filter(|v| matches!(v.violation_type, ConnViolationType::WidthMismatch { .. }))
            .collect();

        assert!(width_violations.is_empty(), "Width check should be skipped");
    }
}
