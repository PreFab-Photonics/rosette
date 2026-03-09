use std::sync::Mutex;

/// Shared application state.
pub struct AppState {
    /// File path passed via CLI args (e.g., double-clicking a .gds file).
    /// The frontend polls this once on mount, then it's cleared.
    pub pending_file: Mutex<Option<String>>,
    /// Path of the currently open GDS file (for Save, as opposed to Save As).
    pub current_file: Mutex<Option<String>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            pending_file: Mutex::new(None),
            current_file: Mutex::new(None),
        }
    }
}
