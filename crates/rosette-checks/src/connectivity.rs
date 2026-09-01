//! Hierarchical photonic-port connectivity checking.

use std::collections::BTreeMap;

use rosette_core::hierarchy::{HierarchyEvent, HierarchyIssueKind, WalkControl, walk_hierarchy};
use rosette_core::{BBox, Cell, Library, Point, Port, Transform};
use rstar::{AABB, PointDistance, RTree, RTreeObject};

use crate::RouteAnnotationMap;
use crate::config::ChecksConfig;
use crate::violation::{CheckViolation, CheckViolationType, Severity};

const PROMOTION_ANGLE_EPSILON_DEG: f64 = 1e-6;

#[derive(Debug)]
struct FlatPort {
    port: Port,
    cell_path: String,
    is_top_level: bool,
    placement: usize,
    parent_placement: Option<usize>,
    transformed_width: Option<f64>,
    is_route_input: bool,
}

#[derive(Debug, Default)]
struct FlattenedPorts {
    ports: Vec<FlatPort>,
    violations: Vec<CheckViolation>,
    ports_uncheckable: usize,
    hierarchy_issues: usize,
}

/// Connectivity check statistics.
#[derive(Debug, Clone, Default)]
pub struct ConnectivityStats {
    /// Number of representable ports checked.
    pub ports_checked: usize,
    /// Number of valid two-terminal physical connections.
    pub connections_found: usize,
    /// Number of spatial connectivity nodes checked.
    pub nodes_checked: usize,
    /// Number of ports or port widths that could not be checked.
    pub ports_uncheckable: usize,
    /// Number of malformed hierarchy edges encountered.
    pub hierarchy_issues: usize,
}

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

#[derive(Debug)]
struct DisjointSet {
    parent: Vec<usize>,
}

impl DisjointSet {
    fn new(len: usize) -> Self {
        Self {
            parent: (0..len).collect(),
        }
    }

    fn find(&mut self, value: usize) -> usize {
        if self.parent[value] != value {
            self.parent[value] = self.find(self.parent[value]);
        }
        self.parent[value]
    }

    fn union(&mut self, a: usize, b: usize) {
        let a = self.find(a);
        let b = self.find(b);
        if a != b {
            let (root, child) = if a < b { (a, b) } else { (b, a) };
            self.parent[child] = root;
        }
    }
}

/// Run connectivity checks on a cell hierarchy.
pub fn check_connectivity(
    cell: &Cell,
    config: &ChecksConfig,
    library: Option<&Library>,
    route_annotations: &RouteAnnotationMap,
) -> (Vec<CheckViolation>, ConnectivityStats) {
    let flattened = flatten_ports(cell, library, config, route_annotations);
    let flat_ports = flattened.ports;
    let mut violations = flattened.violations;
    let candidates = positional_candidates(&flat_ports, config.position_tolerance());

    // Port promotion is an alias across one immediate parent/child placement,
    // not a physical connection. One-to-one degree checks prevent a parent
    // port from masking multiple coincident child terminals.
    let mut promotion_candidates = Vec::new();
    let mut downward_degree = vec![0_usize; flat_ports.len()];
    let mut upward_degree = vec![0_usize; flat_ports.len()];
    for &(i, j) in &candidates {
        let oriented = if flat_ports[i].parent_placement == Some(flat_ports[j].placement) {
            Some((j, i))
        } else if flat_ports[j].parent_placement == Some(flat_ports[i].placement) {
            Some((i, j))
        } else {
            None
        };
        let Some((parent, child)) = oriented else {
            continue;
        };
        if parallel_deviation_deg(&flat_ports[parent].port, &flat_ports[child].port)
            <= PROMOTION_ANGLE_EPSILON_DEG
        {
            promotion_candidates.push((parent, child));
            downward_degree[parent] += 1;
            upward_degree[child] += 1;
        }
    }

    let mut promotion_sets = DisjointSet::new(flat_ports.len());
    for (parent, child) in promotion_candidates {
        if downward_degree[parent] == 1 && upward_degree[child] == 1 {
            promotion_sets.union(parent, child);
            check_width_pair(
                &flat_ports[parent],
                &flat_ports[child],
                config,
                &mut violations,
            );
        }
    }

    let mut spatial_sets = DisjointSet::new(flat_ports.len());
    for &(i, j) in &candidates {
        spatial_sets.union(i, j);
    }
    let mut nodes = BTreeMap::<usize, Vec<usize>>::new();
    for index in 0..flat_ports.len() {
        nodes
            .entry(spatial_sets.find(index))
            .or_default()
            .push(index);
    }

    let mut connections_found = 0;
    for members in nodes.values() {
        let mut terminals = BTreeMap::<usize, Vec<usize>>::new();
        for &member in members {
            terminals
                .entry(promotion_sets.find(member))
                .or_default()
                .push(member);
        }
        let terminals: Vec<&Vec<usize>> = terminals.values().collect();
        match terminals.as_slice() {
            [terminal] => {
                if terminal.iter().any(|&index| flat_ports[index].is_top_level) {
                    continue;
                }
                let port = canonical_port(terminal, &flat_ports);
                violations.push(CheckViolation::new(
                    CheckViolationType::UnconnectedPort,
                    port.port.name().to_string(),
                    port.cell_path.clone(),
                    port_bbox(&port.port),
                    format!(
                        "Port \"{}\" on {} has no connection",
                        port.port.name(),
                        display_path(&port.cell_path),
                    ),
                    config.severity(),
                ));
            }
            [left, right] => {
                let (a, b) = closest_pair(left, right, &flat_ports);
                let deviation = anti_parallel_deviation_deg(&a.port, &b.port);
                let route_endpoint_coverage = parallel_deviation_deg(&a.port, &b.port)
                    <= PROMOTION_ANGLE_EPSILON_DEG
                    && (left.iter().any(|&index| flat_ports[index].is_route_input)
                        || right.iter().any(|&index| flat_ports[index].is_route_input));
                if deviation > config.angle_tolerance() && !route_endpoint_coverage {
                    violations.push(
                        CheckViolation::new(
                            CheckViolationType::AngleMismatch {
                                deviation_deg: deviation,
                                tolerance_deg: config.angle_tolerance(),
                            },
                            a.port.name().to_string(),
                            a.cell_path.clone(),
                            port_bbox(&a.port),
                            format!(
                                "Angle deviation {:.2} degrees between \"{}\" on {} and \"{}\" on {} exceeds tolerance {:.2} degrees",
                                deviation,
                                a.port.name(),
                                display_path(&a.cell_path),
                                b.port.name(),
                                display_path(&b.cell_path),
                                config.angle_tolerance(),
                            ),
                            config.severity(),
                        )
                        .with_partner(b.port.name().to_string(), b.cell_path.clone()),
                    );
                } else {
                    connections_found += 1;
                    check_width_pair(a, b, config, &mut violations);
                }
            }
            _ => {
                let port = canonical_port(terminals[0], &flat_ports);
                violations.push(CheckViolation::new(
                    CheckViolationType::ShortedNet {
                        terminal_count: terminals.len(),
                    },
                    port.port.name().to_string(),
                    port.cell_path.clone(),
                    port_bbox(&port.port),
                    format!(
                        "Shorted connectivity node contains {} logical terminals within position tolerance {:.6}",
                        terminals.len(),
                        config.position_tolerance(),
                    ),
                    config.severity(),
                ));
            }
        }
    }

    let stats = ConnectivityStats {
        ports_checked: flat_ports.len(),
        connections_found,
        nodes_checked: nodes.len(),
        ports_uncheckable: flattened.ports_uncheckable,
        hierarchy_issues: flattened.hierarchy_issues,
    };
    (violations, stats)
}

fn flatten_ports(
    cell: &Cell,
    library: Option<&Library>,
    config: &ChecksConfig,
    route_annotations: &RouteAnnotationMap,
) -> FlattenedPorts {
    let mut result = FlattenedPorts::default();
    let Some(library) = library else {
        result
            .ports
            .extend(cell.ports().iter().cloned().map(|port| {
                let is_route_input =
                    route_annotations.contains_key(cell.name()) && port.name() == "in";
                FlatPort {
                    transformed_width: port.width(),
                    port,
                    cell_path: String::new(),
                    is_top_level: true,
                    placement: 0,
                    parent_placement: None,
                    is_route_input,
                }
            }));
        return result;
    };

    let mut placement_stack = Vec::new();
    let mut next_placement = 0;
    let report = walk_hierarchy(library, cell, Transform::identity(), |event| {
        match event {
            HierarchyEvent::Enter(placement) => {
                let placement_id = next_placement;
                next_placement += 1;
                let parent_placement = placement_stack.last().copied();
                placement_stack.push(placement_id);
                let path = placement.relative_path_string();
                let is_route_cell = route_annotations.contains_key(placement.cell.name());
                for source_port in placement.cell.ports() {
                    let port = match source_port.try_transform(&placement.transform) {
                        Ok(port) => port,
                        Err(reason) => {
                            result.ports_uncheckable += 1;
                            result.violations.push(CheckViolation::new(
                                CheckViolationType::PortUncheckable,
                                source_port.name().to_string(),
                                path.clone(),
                                point_bbox(Point::origin()),
                                format!(
                                    "Port \"{}\" on {} cannot be transformed: {reason:?}; location uses the origin fallback",
                                    source_port.name(),
                                    display_path(&path),
                                ),
                                Severity::Error,
                            ));
                            continue;
                        }
                    };
                    let transformed_width = source_port.width().and_then(|width| {
                        conformal_scale(placement.transform).and_then(|scale| {
                            let width = width * scale;
                            width.is_finite().then_some(width)
                        })
                    });
                    if config.check_widths()
                        && source_port.width().is_some()
                        && transformed_width.is_none()
                    {
                        result.ports_uncheckable += 1;
                        result.violations.push(CheckViolation::new(
                            CheckViolationType::PortWidthUncheckable,
                            source_port.name().to_string(),
                            path.clone(),
                            port_bbox(&port),
                            format!(
                                "Width of port \"{}\" on {} cannot be checked because its transform is nonconformal or unrepresentable",
                                source_port.name(),
                                display_path(&path),
                            ),
                            Severity::Error,
                        ));
                    }
                    result.ports.push(FlatPort {
                        port,
                        cell_path: path.clone(),
                        is_top_level: placement.depth == 0,
                        placement: placement_id,
                        parent_placement,
                        transformed_width,
                        is_route_input: is_route_cell && source_port.name() == "in",
                    });
                }
            }
            HierarchyEvent::Exit(_) => {
                placement_stack.pop();
            }
            HierarchyEvent::Element(_) => {}
        }
        WalkControl::Continue
    });

    result.hierarchy_issues = report.issues.len();
    for issue in report.issues {
        let (kind, description) = match issue.kind {
            HierarchyIssueKind::MissingReference => {
                (CheckViolationType::MissingReference, "missing reference")
            }
            HierarchyIssueKind::Cycle => (CheckViolationType::HierarchyCycle, "cycle"),
        };
        result.violations.push(CheckViolation::new(
            kind,
            issue.cell_name.clone(),
            issue.path.clone(),
            point_bbox(Point::origin()),
            format!(
                "Hierarchy {description}: \"{}\" references \"{}\" at {}; location uses the origin fallback",
                issue.parent_cell, issue.cell_name, issue.path,
            ),
            Severity::Error,
        ));
    }
    result
}

fn positional_candidates(ports: &[FlatPort], tolerance: f64) -> Vec<(usize, usize)> {
    let indexed = ports
        .iter()
        .enumerate()
        .map(|(index, port)| IndexedPort {
            index,
            x: port.port.position().x,
            y: port.port.position().y,
        })
        .collect();
    let tree = RTree::bulk_load(indexed);
    let tolerance_sq = tolerance * tolerance;
    let mut result = Vec::new();
    for (i, port) in ports.iter().enumerate() {
        let position = port.port.position();
        let envelope = AABB::from_corners(
            [position.x - tolerance, position.y - tolerance],
            [position.x + tolerance, position.y + tolerance],
        );
        for candidate in tree.locate_in_envelope(&envelope) {
            let j = candidate.index;
            if j <= i {
                continue;
            }
            let dx = ports[j].port.position().x - position.x;
            let dy = ports[j].port.position().y - position.y;
            if dx * dx + dy * dy <= tolerance_sq {
                result.push((i, j));
            }
        }
    }
    result.sort_unstable();
    result.dedup();
    result
}

fn parallel_deviation_deg(a: &Port, b: &Port) -> f64 {
    a.direction()
        .dot(b.direction())
        .clamp(-1.0, 1.0)
        .acos()
        .to_degrees()
}

fn anti_parallel_deviation_deg(a: &Port, b: &Port) -> f64 {
    (180.0 - parallel_deviation_deg(a, b)).abs()
}

fn canonical_port<'a>(members: &[usize], ports: &'a [FlatPort]) -> &'a FlatPort {
    &ports[*members
        .iter()
        .min_by_key(|&&index| {
            (
                ports[index].cell_path.matches('/').count(),
                ports[index].cell_path.as_str(),
                ports[index].port.name(),
                index,
            )
        })
        .expect("connectivity terminal must contain a port")]
}

fn closest_pair<'a>(
    left: &[usize],
    right: &[usize],
    ports: &'a [FlatPort],
) -> (&'a FlatPort, &'a FlatPort) {
    let mut candidates = Vec::new();
    for &left_index in left {
        for &right_index in right {
            candidates.push((
                ports[left_index]
                    .port
                    .position()
                    .distance_to(ports[right_index].port.position()),
                left_index,
                right_index,
            ));
        }
    }
    candidates.sort_by(|a, b| {
        a.0.total_cmp(&b.0)
            .then_with(|| a.1.cmp(&b.1))
            .then_with(|| a.2.cmp(&b.2))
    });
    let (_, left_index, right_index) = candidates[0];
    (&ports[left_index], &ports[right_index])
}

fn check_width_pair(
    a: &FlatPort,
    b: &FlatPort,
    config: &ChecksConfig,
    violations: &mut Vec<CheckViolation>,
) {
    if !config.check_widths() {
        return;
    }
    if let (Some(width_a), Some(width_b)) = (a.transformed_width, b.transformed_width)
        && (width_a - width_b).abs() > config.width_tolerance()
    {
        violations.push(
            CheckViolation::new(
                CheckViolationType::WidthMismatch { width_a, width_b },
                a.port.name().to_string(),
                a.cell_path.clone(),
                port_bbox(&a.port),
                format!(
                    "Width mismatch: \"{}\" on {} has {:.6}, \"{}\" on {} has {:.6}; tolerance is {:.6}",
                    a.port.name(),
                    display_path(&a.cell_path),
                    width_a,
                    b.port.name(),
                    display_path(&b.cell_path),
                    width_b,
                    config.width_tolerance(),
                ),
                config.severity(),
            )
            .with_partner(b.port.name().to_string(), b.cell_path.clone()),
        );
    }
}

fn conformal_scale(transform: Transform) -> Option<f64> {
    let scale_x = transform.a.hypot(transform.c);
    let scale_y = transform.b.hypot(transform.d);
    if !scale_x.is_finite() || !scale_y.is_finite() || scale_x == 0.0 || scale_y == 0.0 {
        return None;
    }
    let normalized_dot = (transform.a / scale_x) * (transform.b / scale_y)
        + (transform.c / scale_x) * (transform.d / scale_y);
    let max_scale = scale_x.max(scale_y);
    if normalized_dot.abs() > 1e-9 || (scale_x - scale_y).abs() / max_scale > 1e-9 {
        return None;
    }
    Some((scale_x + scale_y) * 0.5)
}

fn display_path(path: &str) -> &str {
    if path.is_empty() { "top cell" } else { path }
}

fn port_bbox(port: &Port) -> BBox {
    point_bbox(port.position())
}

fn point_bbox(position: Point) -> BBox {
    let half = 0.05;
    BBox::new(
        Point::new(position.x - half, position.y - half),
        Point::new(position.x + half, position.y + half),
    )
    .expect("finite port position produces a valid bounds")
}
