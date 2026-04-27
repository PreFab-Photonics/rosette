//! Python bindings for I/O operations.

use crate::layout::{PyCell, PyLibrary};
use pyo3::prelude::*;
use rosette_core::{Cell, Library};
use rosette_io::{gds, json};

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
    fn from_cell(cell: &Cell) -> Self {
        Self::from_cell_with_library(cell, None)
    }

    fn from_cell_with_library(cell: &Cell, library: Option<&Library>) -> Self {
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
                    let origin = cell_ref.transform.apply(rosette_core::Point::new(0.0, 0.0));
                    let mut port_infos = Vec::new();
                    let mut angles = Vec::new();
                    for port in ref_cell.ports() {
                        let transformed = port.transform(&cell_ref.transform);
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
            path_length: cell.path_length(),
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
    Ok(PyLibrary(lib))
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

        if print_summary && let Some(top) = lib.0.top_cell() {
            let summary = BuildSummary::from_cell_with_library(top, Some(&lib.0));
            if verbose {
                eprintln!("{}", summary.format_verbose());
            } else {
                eprintln!("  {}", summary.format_terse());
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
            lib.add_cell_recursive(cell.0.clone(), &cells_vec);
            gds::write_library(path, &lib).map_err(|e| {
                pyo3::exceptions::PyIOError::new_err(format!("Failed to write GDS: {}", e))
            })?;

            if print_summary && let Some(top) = lib.top_cell() {
                let summary = BuildSummary::from_cell_with_library(top, Some(&lib));
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
                let summary = BuildSummary::from_cell(&cell.0);
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

/// Serialize a Cell or Library to a JSON string.
///
/// This is used internally by `rosette serve` to send designs to the web viewer.
/// The JSON format preserves the full structure including cells, elements, and ports.
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
        return json::to_string_compact(&lib.0).map_err(|e| {
            pyo3::exceptions::PyValueError::new_err(format!("Failed to serialize to JSON: {}", e))
        });
    }

    // Try Cell
    if let Ok(cell) = design.extract::<PyCell>() {
        // Create a library for serialization
        let mut lib = rosette_core::Library::new(cell.0.name().to_string());

        if let Some(child_cells) = cells {
            let cells_vec: Vec<_> = child_cells.iter().map(|c| c.0.clone()).collect();
            lib.add_cell_recursive(cell.0.clone(), &cells_vec);
        } else {
            lib.add_cell(cell.0.clone())
                .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        }

        return json::to_string_compact(&lib).map_err(|e| {
            pyo3::exceptions::PyValueError::new_err(format!("Failed to serialize to JSON: {}", e))
        });
    }

    Err(pyo3::exceptions::PyTypeError::new_err(
        "design must be a Cell or Library",
    ))
}
