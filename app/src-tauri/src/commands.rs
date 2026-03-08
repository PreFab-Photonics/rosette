use std::collections::HashSet;

use serde::Serialize;
use tauri::State;

use rosette_core::{flatten_cell, flatten_library};
use rosette_io::gds;

use crate::state::AppState;

/// Scale factor: GDS coordinates are in micrometers, frontend expects nanometers.
const UM_TO_NM: f64 = 1000.0;

/// A node in the cell hierarchy tree.
#[derive(Debug, Clone, Serialize)]
pub struct CellNode {
    pub name: String,
    pub children: Vec<CellNode>,
}

/// Response from `open_gds` containing flattened JSON and cell hierarchy.
#[derive(Debug, Clone, Serialize)]
pub struct OpenGdsResponse {
    /// Flattened geometry JSON (FlatGeometry format).
    pub json: String,
    /// Cell hierarchy tree rooted at the top cell.
    pub cells: Option<CellNode>,
}

/// Build a cell hierarchy tree from the library, starting at the given cell.
/// Tracks visited cells across the recursion to prevent stack overflow on
/// circular references in malformed GDS files.
fn build_cell_tree(library: &rosette_core::Library, cell_name: &str) -> CellNode {
    let mut ancestors = HashSet::new();
    build_cell_tree_inner(library, cell_name, &mut ancestors)
}

fn build_cell_tree_inner(
    library: &rosette_core::Library,
    cell_name: &str,
    ancestors: &mut HashSet<String>,
) -> CellNode {
    // Guard against circular references
    if !ancestors.insert(cell_name.to_string()) {
        return CellNode {
            name: cell_name.to_string(),
            children: vec![],
        };
    }

    let children = library
        .cell(cell_name)
        .map(|cell| {
            let mut seen_siblings = HashSet::new();
            cell.cell_refs()
                .filter_map(|cref| {
                    if !seen_siblings.insert(cref.cell_name.clone()) {
                        return None;
                    }
                    Some(build_cell_tree_inner(library, &cref.cell_name, ancestors))
                })
                .collect()
        })
        .unwrap_or_default();

    ancestors.remove(cell_name);

    CellNode {
        name: cell_name.to_string(),
        children,
    }
}

/// Open a GDS file, flatten it, and return the geometry JSON and cell tree.
#[tauri::command]
pub fn open_gds(path: String, state: State<'_, AppState>) -> Result<OpenGdsResponse, String> {
    // Read the GDS file
    let library = gds::read(&path).map_err(|e| format!("Failed to read GDS file: {e}"))?;

    // Flatten from the top cell
    let flat = flatten_library(&library, UM_TO_NM);
    let json = serde_json::to_string(&flat).map_err(|e| format!("Failed to serialize: {e}"))?;

    // Build cell hierarchy tree
    let cells = library
        .top_cell()
        .map(|top| build_cell_tree(&library, top.name()));

    // Store the library for later cell navigation
    let mut lib_lock = state.library.lock().map_err(|e| e.to_string())?;
    *lib_lock = Some(library);

    Ok(OpenGdsResponse { json, cells })
}

/// Navigate to a specific cell and return its flattened geometry.
#[tauri::command]
pub fn navigate_cell(cell_name: String, state: State<'_, AppState>) -> Result<String, String> {
    let lib_lock = state.library.lock().map_err(|e| e.to_string())?;
    let library = lib_lock
        .as_ref()
        .ok_or_else(|| "No GDS file loaded".to_string())?;

    let flat = flatten_cell(library, &cell_name, UM_TO_NM)
        .ok_or_else(|| format!("Cell '{cell_name}' not found"))?;

    serde_json::to_string(&flat).map_err(|e| format!("Failed to serialize: {e}"))
}

/// Get and clear the pending file path (from CLI args / file associations).
/// The frontend calls this once on mount to check if a file was passed at launch.
#[tauri::command]
pub fn get_pending_file(state: State<'_, AppState>) -> Result<Option<String>, String> {
    let mut pending = state.pending_file.lock().map_err(|e| e.to_string())?;
    Ok(pending.take())
}

/// Get the cell hierarchy tree for the currently loaded GDS file.
#[tauri::command]
pub fn get_cell_tree(state: State<'_, AppState>) -> Result<Option<CellNode>, String> {
    let lib_lock = state.library.lock().map_err(|e| e.to_string())?;
    let library = match lib_lock.as_ref() {
        Some(lib) => lib,
        None => return Ok(None),
    };

    Ok(library
        .top_cell()
        .map(|top| build_cell_tree(library, top.name())))
}
