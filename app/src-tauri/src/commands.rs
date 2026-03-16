use std::fs;

use serde::Serialize;
use tauri::State;
use tauri::ipc::Response;

use rosette_io::gds;

use crate::state::AppState;

/// Response from `open_gds` containing the full library JSON.
#[derive(Debug, Clone, Serialize)]
pub struct OpenGdsResponse {
    /// Full hierarchical Library JSON (micrometers, Y-up).
    /// The frontend loads this via `WasmLibrary.from_library_json()`.
    pub json: String,
}

/// Open a GDS file and return the full hierarchical library as JSON.
///
/// The frontend is responsible for loading this into a `WasmLibrary` that
/// preserves the full cell hierarchy (via `from_library_json`).
#[tauri::command]
pub fn open_gds(path: String) -> Result<OpenGdsResponse, String> {
    // Read the GDS file into a Library
    let library = gds::read(&path).map_err(|e| format!("Failed to read GDS file: {e}"))?;

    // Serialize the full library to JSON (coordinates in micrometers)
    let json = rosette_io::json::to_string(&library)
        .map_err(|e| format!("Failed to serialize library: {e}"))?;

    Ok(OpenGdsResponse { json })
}

/// Read raw GDS file bytes without parsing.
///
/// Returns the raw binary content via Tauri's binary IPC (no JSON encoding).
/// The frontend passes these bytes directly to `WasmLibrary.from_gds_bytes()`,
/// which parses the GDS in WASM — avoiding the JSON serialization round-trip
/// that `open_gds` uses.
#[tauri::command]
pub fn read_gds_bytes(path: String) -> Result<Response, String> {
    let bytes = fs::read(&path).map_err(|e| format!("Failed to read GDS file: {e}"))?;
    Ok(Response::new(bytes))
}

/// Save GDS bytes to a file.
///
/// The frontend generates the GDS binary via `WasmLibrary.to_gds()` and
/// sends the raw bytes here for writing to disk.
#[tauri::command]
pub fn save_gds(path: String, bytes: Vec<u8>) -> Result<(), String> {
    fs::write(&path, &bytes).map_err(|e| format!("Failed to write GDS file: {e}"))?;
    Ok(())
}

/// Save arbitrary bytes to a file without updating the current file path.
///
/// Used for exports (screenshots, etc.) that shouldn't affect the
/// project's save state.
#[tauri::command]
pub fn save_bytes(path: String, bytes: Vec<u8>) -> Result<(), String> {
    fs::write(&path, &bytes).map_err(|e| format!("Failed to write file: {e}"))?;
    Ok(())
}

/// Get and clear the pending file path (from CLI args / file associations).
/// The frontend calls this once on mount to check if a file was passed at launch.
#[tauri::command]
pub fn get_pending_file(state: State<'_, AppState>) -> Result<Option<String>, String> {
    let mut pending = state.pending_file.lock().map_err(|e| e.to_string())?;
    Ok(pending.take())
}
