//! Connectivity checking for photonic layouts.
//!
//! Verifies that component ports are properly connected by checking:
//! - **Unconnected ports** — every non-external port has a partner
//! - **Width mismatch** — connected ports have matching widths
//! - **Angle mismatch** — connected ports are properly anti-parallel
//!
//! Ports on the top-level cell are treated as external I/O and are
//! exempt from unconnected-port checks.
//!
//! Uses an R-tree spatial index keyed on port position so each port's
//! partner search is O(log P + k) on the number of nearby ports rather
//! than O(P). Drops the previous O(P²) matching to O(P log P) in practice.

use rosette_core::{BBox, Cell, Library, Point, Port, Transform};
use rstar::{AABB, PointDistance, RTree, RTreeObject};

use crate::config::ChecksConfig;
use crate::violation::{CheckViolation, CheckViolationType, Severity};

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
    let dot = a.direction.dot(b.direction);
    let dot_clamped = dot.clamp(-1.0, 1.0);
    let theta_deg = dot_clamped.acos().to_degrees();
    (180.0 - theta_deg).abs()
}

/// Make a point-sized BBox centred on a port position for violation location.
fn port_bbox(port: &Port) -> BBox {
    let half = 0.05; // 50nm box for visibility
    BBox::new(
        Point::new(port.position.x - half, port.position.y - half),
        Point::new(port.position.x + half, port.position.y + half),
    )
}

/// Connectivity check statistics.
#[derive(Debug, Clone, Default)]
pub struct ConnectivityStats {
    /// Number of ports checked.
    pub ports_checked: usize,
    /// Number of port-to-port connections found.
    pub connections_found: usize,
}

/// Wraps a port's absolute position for R-tree indexing. The `index` field
/// is the position within `flat_ports`.
#[derive(Clone, Copy, Debug)]
struct IndexedPort {
    index: usize,
    x: f64,
    y: f64,
}

impl RTreeObject for IndexedPort {
    type Envelope = AABB<[f64; 2]>;

    fn envelope(&self) -> Self::Envelope {
        AABB::from_point([self.x, self.y])
    }
}

impl PointDistance for IndexedPort {
    fn distance_2(&self, point: &[f64; 2]) -> f64 {
        let dx = self.x - point[0];
        let dy = self.y - point[1];
        dx * dx + dy * dy
    }
}

/// Run connectivity checks on a cell.
///
/// Returns violations and stats. Called by the unified runner.
pub fn check_connectivity(
    cell: &Cell,
    config: &ChecksConfig,
    library: Option<&Library>,
) -> (Vec<CheckViolation>, ConnectivityStats) {
    let flat_ports = flatten_ports(cell, library, &Transform::identity(), "", true);
    let n = flat_ports.len();

    // Track which ports have been matched to a partner
    let mut matched = vec![false; n];
    // Track matched pairs for width/angle checks
    let mut pairs: Vec<(usize, usize)> = Vec::new();
    let mut violations = Vec::new();

    // Build an R-tree of port positions so partner lookup is O(log P + k)
    // rather than O(P) per port. Without the index, a design with thousands
    // of ports across many components spends almost all its time in this
    // pairwise loop.
    //
    // `IndexedPort::envelope()` is a point (`AABB::from_point`), which means
    // the `locate_in_envelope` queries below are semantically equivalent to
    // `locate_in_envelope_intersecting`. If the envelope ever changes to a
    // non-degenerate bbox, switch the queries to `*_intersecting` — otherwise
    // candidates on the window boundary would be silently skipped.
    let indexed: Vec<IndexedPort> = flat_ports
        .iter()
        .enumerate()
        .map(|(i, fp)| IndexedPort {
            index: i,
            x: fp.port.position.x,
            y: fp.port.position.y,
        })
        .collect();
    let tree = RTree::bulk_load(indexed);

    // Squared tolerance avoids a sqrt on every candidate.
    let tol = config.position_tolerance;
    let tol_sq = tol * tol;

    for i in 0..n {
        let pos = flat_ports[i].port.position;
        // Query all ports within `position_tolerance` of this one. Use a
        // bbox envelope (not nearest-neighbour) so we visit every candidate
        // in the window; the distance² filter below prunes the corners.
        let envelope = AABB::from_corners([pos.x - tol, pos.y - tol], [pos.x + tol, pos.y + tol]);

        for candidate in tree.locate_in_envelope(&envelope) {
            let j = candidate.index;
            // Pair each (i, j) once. `j > i` mirrors the upper-triangular
            // loop used previously so deduping the connection list and
            // self-pair skipping happen with one comparison.
            if j <= i {
                continue;
            }

            let dx = flat_ports[j].port.position.x - pos.x;
            let dy = flat_ports[j].port.position.y - pos.y;
            if dx * dx + dy * dy > tol_sq {
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
        let pos = flat_ports[i].port.position;
        let envelope = AABB::from_corners([pos.x - tol, pos.y - tol], [pos.x + tol, pos.y + tol]);
        for candidate in tree.locate_in_envelope(&envelope) {
            let j = candidate.index;
            if j == i || !flat_ports[j].is_top_level {
                continue;
            }
            let dx = flat_ports[j].port.position.x - pos.x;
            let dy = flat_ports[j].port.position.y - pos.y;
            if dx * dx + dy * dy <= tol_sq {
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
                CheckViolation::new(
                    CheckViolationType::WidthMismatch {
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
                CheckViolation::new(
                    CheckViolationType::AngleMismatch {
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
            violations.push(CheckViolation::new(
                CheckViolationType::UnconnectedPort,
                fp.port.name.clone(),
                fp.cell_path.clone(),
                port_bbox(&fp.port),
                msg,
                config.severity,
            ));
        }
    }

    let stats = ConnectivityStats {
        ports_checked: n,
        connections_found: pairs.len(),
    };

    (violations, stats)
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

    fn default_config() -> ChecksConfig {
        ChecksConfig::default()
    }

    #[test]
    fn test_all_connected() {
        let wg1 = make_component("wg1", 10.0, 0.5);
        let wg2 = make_component("wg2", 10.0, 0.5);

        let mut lib = Library::new("test");
        lib.add_cell(wg1);
        lib.add_cell(wg2);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("wg1"));
        top.add_ref(CellRef::new("wg2").at(10.0, 0.0));
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

        let (violations, stats) =
            check_connectivity(lib.cell("top").unwrap(), &default_config(), Some(&lib));

        assert!(
            violations.is_empty(),
            "Expected no violations but got: {:?}",
            violations
        );
        assert_eq!(stats.ports_checked, 6);
        assert_eq!(stats.connections_found, 1);
    }

    #[test]
    fn test_unconnected_port() {
        let wg = make_component("wg", 10.0, 0.5);

        let mut lib = Library::new("test");
        lib.add_cell(wg);

        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("wg"));
        top.add_port(Port::with_width(
            "in",
            Point::new(0.0, 0.25),
            -Vector2::unit_x(),
            0.5,
        ));

        lib.add_cell(top);

        let (violations, _) =
            check_connectivity(lib.cell("top").unwrap(), &default_config(), Some(&lib));

        assert_eq!(violations.len(), 1);
        assert_eq!(
            violations[0].violation_type,
            CheckViolationType::UnconnectedPort
        );
        assert_eq!(violations[0].name, "out");
    }

    #[test]
    fn test_width_mismatch() {
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

        let (violations, _) =
            check_connectivity(lib.cell("top").unwrap(), &default_config(), Some(&lib));

        let width_violations: Vec<_> = violations
            .iter()
            .filter(|v| matches!(v.violation_type, CheckViolationType::WidthMismatch { .. }))
            .collect();

        assert!(
            !width_violations.is_empty(),
            "Expected width mismatch violation"
        );
    }

    #[test]
    fn test_top_level_ports_exempt() {
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

        let (violations, stats) = check_connectivity(&top, &default_config(), None);

        assert!(violations.is_empty());
        assert_eq!(stats.ports_checked, 2);
        assert_eq!(stats.connections_found, 0);
    }

    #[test]
    fn test_empty_cell() {
        let cell = Cell::new("empty");
        let (violations, stats) = check_connectivity(&cell, &default_config(), None);

        assert!(violations.is_empty());
        assert_eq!(stats.ports_checked, 0);
        assert_eq!(stats.connections_found, 0);
    }

    #[test]
    fn test_with_hierarchy() {
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

        let (violations, stats) =
            check_connectivity(lib.cell("top").unwrap(), &default_config(), Some(&lib));

        assert!(
            violations.is_empty(),
            "Expected no violations but got: {:?}",
            violations
        );
        assert!(stats.connections_found >= 1);
    }

    #[test]
    fn test_check_widths_disabled() {
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

        let config = ChecksConfig::default().with_check_widths(false);
        let (violations, _) = check_connectivity(lib.cell("top").unwrap(), &config, Some(&lib));

        let width_violations: Vec<_> = violations
            .iter()
            .filter(|v| matches!(v.violation_type, CheckViolationType::WidthMismatch { .. }))
            .collect();

        assert!(width_violations.is_empty(), "Width check should be skipped");
    }
}
