//! Python bindings for I/O operations.

use crate::layout::{PyCell, PyLibrary};
use pyo3::prelude::*;
use rosette_core::Cell;
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
}

struct PortInfo {
    name: String,
    x: f64,
    y: f64,
    width: Option<f64>,
}

impl BuildSummary {
    fn from_cell(cell: &Cell) -> Self {
        let bbox = cell.bbox();
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

        let refs = cell.cell_refs().map(|r| r.cell_name.clone()).collect();

        // Check if cell has only refs (no direct polygons)
        let has_refs_only = bbox_width.is_none() && cell.ref_count() > 0;

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

        lines.join("\n")
    }
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
            let summary = BuildSummary::from_cell(top);
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
                let summary = BuildSummary::from_cell(top);
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
        return json::to_string(&lib.0).map_err(|e| {
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
            lib.add_cell(cell.0.clone());
        }

        return json::to_string(&lib).map_err(|e| {
            pyo3::exceptions::PyValueError::new_err(format!("Failed to serialize to JSON: {}", e))
        });
    }

    Err(pyo3::exceptions::PyTypeError::new_err(
        "design must be a Cell or Library",
    ))
}

/// Serialize a Cell or Library to a flattened JSON string for the web viewer.
///
/// This flattens the design hierarchy into a simple list of polygons:
/// - Expands all cell references with their transforms applied
/// - Converts path elements to polygon ribbons
/// - Scales coordinates from micrometers to nanometers (×1000)
/// - Skips text elements
///
/// The output format is optimized for the web viewer:
/// ```json
/// {"polygons": [{"v": [x0,y0,x1,y1,...], "l": 1, "d": 0}, ...]}
/// ```
///
/// Args:
///     design: A Cell or Library to serialize
///     cells: Optional list of child cells (only for Cell, not Library)
///
/// Returns:
///     A JSON string with flattened polygon data
///
/// Example:
///     >>> cell = Cell("my_design")
///     >>> cell.add_polygon(Polygon.rect(Point.origin(), 10, 5), 1)
///     >>> json_str = to_flat_json(cell)
#[pyfunction]
#[pyo3(signature = (design, cells=None))]
pub fn to_flat_json(design: &Bound<'_, PyAny>, cells: Option<Vec<PyCell>>) -> PyResult<String> {
    use rosette_core::flatten_library;

    // Scale factor: SDK uses micrometers, web app uses nanometers
    const UM_TO_NM: f64 = 1000.0;

    // Try Library first
    if let Ok(lib) = design.extract::<PyLibrary>() {
        if cells.is_some() {
            return Err(pyo3::exceptions::PyTypeError::new_err(
                "cells parameter is only valid when design is a Cell, not a Library",
            ));
        }

        let flat = flatten_library(&lib.0, UM_TO_NM);
        return serde_json::to_string(&flat).map_err(|e| {
            pyo3::exceptions::PyValueError::new_err(format!("Failed to serialize to JSON: {}", e))
        });
    }

    // Try Cell
    if let Ok(cell) = design.extract::<PyCell>() {
        // Create a library for flattening
        let mut lib = rosette_core::Library::new(cell.0.name().to_string());

        if let Some(child_cells) = cells {
            let cells_vec: Vec<_> = child_cells.iter().map(|c| c.0.clone()).collect();
            lib.add_cell_recursive(cell.0.clone(), &cells_vec);
        } else {
            lib.add_cell(cell.0.clone());
        }

        let flat = flatten_library(&lib, UM_TO_NM);
        return serde_json::to_string(&flat).map_err(|e| {
            pyo3::exceptions::PyValueError::new_err(format!("Failed to serialize to JSON: {}", e))
        });
    }

    Err(pyo3::exceptions::PyTypeError::new_err(
        "design must be a Cell or Library",
    ))
}

/// Flatten a specific cell (by name) from a pre-built library to JSON.
///
/// This is used by `rosette serve` to support navigating into nested cells.
/// The caller provides the top cell and its children (to build the library),
/// then specifies which cell to flatten.
///
/// Args:
///     cell_name: Name of the cell to flatten
///     top_cell: The top-level cell (used to build the library)
///     child_cells: All child cells referenced by the hierarchy
///
/// Returns:
///     A JSON string with flattened polygon data for the requested cell,
///     or None if the cell is not found.
#[pyfunction]
#[pyo3(signature = (cell_name, top_cell, child_cells))]
pub fn to_flat_json_cell(
    cell_name: &str,
    top_cell: &PyCell,
    child_cells: Vec<PyCell>,
) -> PyResult<Option<String>> {
    use rosette_core::flatten_cell;

    const UM_TO_NM: f64 = 1000.0;

    // Build a library with the full hierarchy
    let mut lib = rosette_core::Library::new(top_cell.0.name().to_string());
    let cells_vec: Vec<_> = child_cells.into_iter().map(|c| c.0).collect();
    lib.add_cell_recursive(top_cell.0.clone(), &cells_vec);

    // Flatten the requested cell
    match flatten_cell(&lib, cell_name, UM_TO_NM) {
        Some(flat) => {
            let json = serde_json::to_string(&flat).map_err(|e| {
                pyo3::exceptions::PyValueError::new_err(format!(
                    "Failed to serialize to JSON: {}",
                    e
                ))
            })?;
            Ok(Some(json))
        }
        None => Ok(None),
    }
}
