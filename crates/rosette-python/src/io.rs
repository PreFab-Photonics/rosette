//! Python bindings for I/O operations.

use crate::layout::{PyCell, PyLibrary};
use pyo3::prelude::*;
use rosette_checks::RouteAnnotationMap;
use rosette_core::{Cell, DuplicatePolicy, Library};
use rosette_io::{gds, json};
use rosette_route::RouteAnnotations;

/// Build summary information for a cell.
struct BuildSummary {
    cell_name: String,
    bbox_width: Option<f64>,
    bbox_height: Option<f64>,
    cell_count: usize,
    port_count: usize,
    path_length: Option<f64>,
    ports: Vec<PortInfo>,
    refs: Vec<String>,
    has_refs_only: bool,
    /// Instance-resolved ports (child instances with their transformed ports).
    instance_ports: Vec<InstancePortGroup>,
}

struct PortInfo {
    name: String,
    x: f64,
    y: f64,
    width: Option<f64>,
}

/// Ports from a single cell instance, resolved to absolute coordinates.
struct InstancePortGroup {
    cell_name: String,
    /// Position of the instance origin after transform.
    origin_x: f64,
    origin_y: f64,
    ports: Vec<PortInfo>,
    /// Port direction angles in degrees.
    angles: Vec<f64>,
}

impl BuildSummary {
    fn from_cell(cell: &Cell, route_annotations: Option<&RouteAnnotations>) -> Self {
        Self::from_cell_with_library(cell, None, route_annotations)
    }

    fn from_cell_with_library(
        cell: &Cell,
        library: Option<&Library>,
        route_annotations: Option<&RouteAnnotations>,
    ) -> Self {
        // Prefer the library-resolved bbox so hierarchical designs (SREFs and
        // AREFs) report the true extent of the chip, not just the polygons
        // sitting directly in the top cell. Falls back to the local bbox when
        // no library is available (rare — only the CLI path without a library
        // context hits this branch).
        let bbox = match library {
            Some(lib) => lib.cell_bbox(cell.name()).or_else(|| cell.bbox()),
            None => cell.bbox(),
        };
        let (bbox_width, bbox_height) = match bbox {
            Some(b) => (Some(b.width()), Some(b.height())),
            None => (None, None),
        };

        let ports = cell
            .ports()
            .iter()
            .map(|p| PortInfo {
                name: p.name.clone(),
                x: p.position.x,
                y: p.position.y,
                width: p.width,
            })
            .collect();

        let refs: Vec<String> = cell.cell_refs().map(|r| r.cell_name.clone()).collect();

        // A cell is "hierarchical-only" when it has refs but no direct
        // polygons of its own.  Now that `bbox` resolves refs, we can't just
        // look at bbox_width — check the local geometry instead.
        let has_refs_only =
            cell.polygon_count() == 0 && cell.path_count() == 0 && cell.ref_count() > 0;

        // Resolve instance ports (one level deep) when library is available
        let instance_ports = if let Some(lib) = library {
            let mut groups = Vec::new();
            for cell_ref in cell.cell_refs() {
                if let Some(ref_cell) = lib.cell(&cell_ref.cell_name) {
                    for copy in cell_ref.copies() {
                        let origin = copy.transform.apply(rosette_core::Point::new(0.0, 0.0));
                        if !origin.is_finite() {
                            // Accumulated hierarchy arithmetic can overflow even
                            // when every stored transform is locally valid.
                            continue;
                        }
                        let mut port_infos = Vec::new();
                        let mut angles = Vec::new();
                        for port in ref_cell.ports() {
                            let Some(transformed) = port.try_transform(&copy.transform) else {
                                continue;
                            };
                            port_infos.push(PortInfo {
                                name: transformed.name.clone(),
                                x: transformed.position.x,
                                y: transformed.position.y,
                                width: transformed.width,
                            });
                            angles.push(transformed.direction.angle().to_degrees());
                        }
                        groups.push(InstancePortGroup {
                            cell_name: cell_ref.cell_name.clone(),
                            origin_x: origin.x,
                            origin_y: origin.y,
                            ports: port_infos,
                            angles,
                        });
                    }
                }
            }
            groups
        } else {
            Vec::new()
        };

        BuildSummary {
            cell_name: cell.name().to_string(),
            bbox_width,
            bbox_height,
            cell_count: cell.ref_count() + 1, // +1 for the cell itself
            port_count: cell.ports().len(),
            path_length: route_annotations.and_then(RouteAnnotations::path_length),
            ports,
            refs,
            has_refs_only,
            instance_ports,
        }
    }

    fn format_terse(&self) -> String {
        let bbox_str = match (self.bbox_width, self.bbox_height) {
            (Some(w), Some(h)) => format!("{:.1}x{:.1}um", w, h),
            _ if self.has_refs_only => "hierarchical".to_string(),
            _ => "empty".to_string(),
        };

        let path_str = self
            .path_length
            .map(|l| format!(" | {:.1}um path", l))
            .unwrap_or_default();

        format!(
            "{} | {} | {} cells | {} ports{}",
            self.cell_name, bbox_str, self.cell_count, self.port_count, path_str
        )
    }

    fn format_verbose(&self) -> String {
        let mut lines = vec![format!("{} (top cell)", self.cell_name)];

        // Bounding box
        let bbox_str = match (self.bbox_width, self.bbox_height) {
            (Some(w), Some(h)) => format!("{:.1} x {:.1} um", w, h),
            _ if self.has_refs_only => "hierarchical (refs only)".to_string(),
            _ => "empty".to_string(),
        };
        lines.push(format!("  bbox: {}", bbox_str));

        // Path length (if available)
        if let Some(path_len) = self.path_length {
            lines.push(format!("  path: {:.1} um", path_len));
        }

        // Ports
        if !self.ports.is_empty() {
            lines.push("  ports:".to_string());
            for port in &self.ports {
                let width_str = port.width.map_or(String::new(), |w| format!(" w={:.2}", w));
                lines.push(format!(
                    "    {} @ ({:.1}, {:.1}){}",
                    port.name, port.x, port.y, width_str
                ));
            }
        }

        // Cell references
        if !self.refs.is_empty() {
            // Count occurrences
            let mut counts: std::collections::HashMap<&str, usize> =
                std::collections::HashMap::new();
            for r in &self.refs {
                *counts.entry(r.as_str()).or_insert(0) += 1;
            }
            let cells_str: Vec<String> = counts
                .iter()
                .map(|(name, count)| {
                    if *count > 1 {
                        format!("{}x {}", count, name)
                    } else {
                        name.to_string()
                    }
                })
                .collect();
            lines.push(format!("  cells: {}", cells_str.join(", ")));
        }

        // Instance-resolved ports
        if !self.instance_ports.is_empty() {
            lines.push("  instances:".to_string());
            for group in &self.instance_ports {
                lines.push(format!(
                    "    {} (at {:.1}, {:.1}):",
                    group.cell_name, group.origin_x, group.origin_y
                ));
                for (port, angle) in group.ports.iter().zip(group.angles.iter()) {
                    let width_str = port.width.map_or(String::new(), |w| format!(" w={:.2}", w));
                    let dir_str = angle_to_dir_str(*angle);
                    if dir_str.is_empty() {
                        lines.push(format!(
                            "      {} @ ({:.1}, {:.1}){}",
                            port.name, port.x, port.y, width_str
                        ));
                    } else {
                        lines.push(format!(
                            "      {} @ ({:.1}, {:.1}){} {}",
                            port.name, port.x, port.y, width_str, dir_str
                        ));
                    }
                }
            }
        }

        lines.join("\n")
    }
}

/// Convert an angle in degrees to a compact direction string.
fn angle_to_dir_str(angle_deg: f64) -> &'static str {
    // Normalize to [0, 360)
    let a = ((angle_deg % 360.0) + 360.0) % 360.0;
    if (a - 0.0).abs() < 1.0 {
        "-> +X"
    } else if (a - 90.0).abs() < 1.0 {
        "-> +Y"
    } else if (a - 180.0).abs() < 1.0 {
        "-> -X"
    } else if (a - 270.0).abs() < 1.0 {
        "-> -Y"
    } else {
        ""
    }
}

/// Read a GDS file and return a Library.
///
/// Args:
///     path: Path to the GDS file
///
/// Returns:
///     A Library containing all cells from the GDS file
///
/// Example:
///     >>> lib = read_gds("input.gds")
///     >>> for cell in lib.cells():
///     ...     print(cell.name)
#[pyfunction]
pub fn read_gds(path: &str) -> PyResult<PyLibrary> {
    let lib = gds::read(path)
        .map_err(|e| pyo3::exceptions::PyIOError::new_err(format!("Failed to read GDS: {}", e)))?;
    Ok(PyLibrary::from_library(lib))
}

/// Write a cell or library to a GDS file.
///
/// Args:
///     path: Output file path
///     design: A Cell or Library to write
///     cells: Optional list of child cells (only for Cell, not Library)
///     quiet: If True, suppress the build summary (default: False)
///     verbose: If True, print detailed build info (default: False)
///
/// Example:
///     >>> cell = Cell("my_design")
///     >>> cell.add_polygon(Polygon.rect(Point.origin(), 10, 5), 1)
///     >>> write_gds("output.gds", cell)
#[pyfunction]
#[pyo3(signature = (path, design, cells=None, quiet=false, verbose=false))]
pub fn write_gds(
    path: &str,
    design: &Bound<'_, PyAny>,
    cells: Option<Vec<PyCell>>,
    quiet: bool,
    verbose: bool,
) -> PyResult<()> {
    let print_summary = !quiet;

    // Try Library first
    if let Ok(lib) = design.extract::<PyLibrary>() {
        if cells.is_some() {
            return Err(pyo3::exceptions::PyTypeError::new_err(
                "cells parameter is only valid when design is a Cell, not a Library",
            ));
        }
        gds::write_library(path, &lib.0).map_err(|e| {
            pyo3::exceptions::PyIOError::new_err(format!("Failed to write GDS: {}", e))
        })?;

        if print_summary {
            let entries = lib.0.top_cell().map_or_else(
                || {
                    let roots = lib.0.roots();
                    if roots.is_empty() {
                        lib.0.cells().first().into_iter().collect()
                    } else {
                        roots
                    }
                },
                |top| vec![top],
            );
            for entry in entries {
                let summary = BuildSummary::from_cell_with_library(
                    entry,
                    Some(&lib.0),
                    lib.route_annotations().get(entry.name()),
                );
                if verbose {
                    eprintln!("{}", summary.format_verbose());
                } else {
                    eprintln!("  {}", summary.format_terse());
                }
            }
        }
        return Ok(());
    }

    // Try Cell
    if let Ok(cell) = design.extract::<PyCell>() {
        // If child cells provided, create a library
        if let Some(child_cells) = cells {
            let mut lib = rosette_core::Library::new(cell.0.name().to_string());
            let cells_vec: Vec<_> = child_cells.iter().map(|c| c.0.clone()).collect();
            lib.add_cell_recursive(cell.0.clone(), &cells_vec, DuplicatePolicy::KeepExisting)
                .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
            gds::write_library(path, &lib).map_err(|e| {
                pyo3::exceptions::PyIOError::new_err(format!("Failed to write GDS: {}", e))
            })?;

            if print_summary && let Some(top) = lib.top_cell() {
                let summary = BuildSummary::from_cell_with_library(
                    top,
                    Some(&lib),
                    (top.name() == cell.0.name()).then(|| cell.route_annotations()),
                );
                if verbose {
                    eprintln!("{}", summary.format_verbose());
                } else {
                    eprintln!("  {}", summary.format_terse());
                }
            }
        } else {
            gds::write(path, &cell.0).map_err(|e| {
                pyo3::exceptions::PyIOError::new_err(format!("Failed to write GDS: {}", e))
            })?;

            if print_summary {
                let summary = BuildSummary::from_cell(&cell.0, Some(cell.route_annotations()));
                if verbose {
                    eprintln!("{}", summary.format_verbose());
                } else {
                    eprintln!("  {}", summary.format_terse());
                }
            }
        }
        return Ok(());
    }

    Err(pyo3::exceptions::PyTypeError::new_err(
        "design must be a Cell or Library",
    ))
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::{CellRef, Point, Port, Vector2};
    use rosette_route::{BendInfo, RouteAnnotations};

    #[test]
    fn build_summary_expands_aref_port_groups() {
        let mut child = Cell::new("child");
        child.add_port(Port::new("port", Point::new(1.0, 0.0), Vector2::unit_x()));
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("child").array(2, 1, 10.0, 0.0));
        let mut library = Library::new("test");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let summary = BuildSummary::from_cell_with_library(
            library.cell("top").unwrap(),
            Some(&library),
            None,
        );

        assert_eq!(summary.instance_ports.len(), 2);
        assert_eq!(summary.instance_ports[0].origin_x, 0.0);
        assert_eq!(summary.instance_ports[1].origin_x, 10.0);
        assert_eq!(summary.instance_ports[1].ports[0].x, 11.0);
    }

    #[test]
    fn build_summary_skips_overflowed_instance_ports() {
        let mut child = Cell::new("child");
        child.add_port(Port::new("port", Point::new(2.0, 0.0), Vector2::unit_x()));
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("child").scale(f64::MAX));
        let mut library = Library::new("test");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let summary = BuildSummary::from_cell_with_library(
            library.cell("top").unwrap(),
            Some(&library),
            None,
        );

        assert_eq!(summary.instance_ports.len(), 1);
        assert!(summary.instance_ports[0].ports.is_empty());
        assert!(summary.instance_ports[0].angles.is_empty());
    }

    #[test]
    fn layout_document_persists_only_route_sidecars() {
        let mut library = Library::new("test");
        library.add_cell(Cell::new("route")).unwrap();
        let routes = RouteAnnotationMap::from([(
            "route".to_string(),
            RouteAnnotations::new(
                Some(15.0),
                vec![BendInfo::auto_reduced(2.0, Point::new(5.0, 1.0), 4.0)],
                vec!["reduced".to_string()],
            ),
        )]);

        let document = layout_document(library, &routes).unwrap();
        let annotations = &document.annotations()["route"];

        assert_eq!(annotations.route.path_length, Some(15.0));
        assert_eq!(annotations.route.bends.len(), 1);
        assert_eq!(annotations.route.warnings, vec!["reduced"]);
        assert!(!annotations.drc.skip);
        assert!(annotations.drc.waive_regions.is_empty());
        assert_eq!(annotations.editor, json::EditorAnnotations::default());
    }
}

fn layout_document(
    library: Library,
    route_annotations: &RouteAnnotationMap,
) -> Result<json::LayoutDocument, json::JsonError> {
    let annotations = library
        .cells()
        .iter()
        .map(|cell| {
            let route_annotations = route_annotations
                .get(cell.name())
                .cloned()
                .unwrap_or_default();
            let route = json::RouteAnnotations {
                path_length: route_annotations.path_length(),
                bends: route_annotations
                    .bends()
                    .iter()
                    .map(|bend| json::BendAnnotation {
                        radius: bend.radius(),
                        position: bend.position(),
                        requested_radius: bend.requested_radius(),
                    })
                    .collect(),
                warnings: route_annotations.warnings().to_vec(),
            };
            (
                cell.name().to_string(),
                json::CellAnnotations {
                    route,
                    ..json::CellAnnotations::default()
                },
            )
        })
        .collect();
    json::LayoutDocument::from_parts(library, annotations)
}

/// Serialize a Cell or Library to a JSON string.
///
/// This is used internally by `rosette serve` to send designs to the web viewer.
/// Schema V1 preserves the full structure including cells, elements, and ports.
///
/// Args:
///     design: A Cell or Library to serialize
///     cells: Optional list of child cells (only for Cell, not Library)
///
/// Returns:
///     A JSON string representation of the design
///
/// Example:
///     >>> cell = Cell("my_design")
///     >>> cell.add_polygon(Polygon.rect(Point.origin(), 10, 5), 1)
///     >>> json_str = to_json(cell)
#[pyfunction]
#[pyo3(signature = (design, cells=None))]
pub fn to_json(design: &Bound<'_, PyAny>, cells: Option<Vec<PyCell>>) -> PyResult<String> {
    // Try Library first
    if let Ok(lib) = design.extract::<PyLibrary>() {
        if cells.is_some() {
            return Err(pyo3::exceptions::PyTypeError::new_err(
                "cells parameter is only valid when design is a Cell, not a Library",
            ));
        }
        let document = layout_document(lib.0.clone(), lib.route_annotations()).map_err(|e| {
            pyo3::exceptions::PyValueError::new_err(format!("Failed to serialize to JSON: {}", e))
        })?;
        return json::to_string_compact(&document).map_err(|e| {
            pyo3::exceptions::PyValueError::new_err(format!("Failed to serialize to JSON: {}", e))
        });
    }

    // Try Cell
    if let Ok(cell) = design.extract::<PyCell>() {
        // Create a library for serialization
        let mut lib = rosette_core::Library::new(cell.0.name().to_string());
        let mut route_annotations = RouteAnnotationMap::new();

        if let Some(child_cells) = cells {
            route_annotations.extend(child_cells.iter().map(|child| {
                (
                    child.0.name().to_string(),
                    child.route_annotations().clone(),
                )
            }));
            let cells_vec: Vec<_> = child_cells.iter().map(|c| c.0.clone()).collect();
            lib.add_cell_recursive(cell.0.clone(), &cells_vec, DuplicatePolicy::KeepExisting)
                .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        } else {
            lib.add_cell(cell.0.clone())
                .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        }
        route_annotations.insert(cell.0.name().to_string(), cell.route_annotations().clone());

        let document = layout_document(lib, &route_annotations).map_err(|e| {
            pyo3::exceptions::PyValueError::new_err(format!("Failed to serialize to JSON: {}", e))
        })?;
        return json::to_string_compact(&document).map_err(|e| {
            pyo3::exceptions::PyValueError::new_err(format!("Failed to serialize to JSON: {}", e))
        });
    }

    Err(pyo3::exceptions::PyTypeError::new_err(
        "design must be a Cell or Library",
    ))
}
