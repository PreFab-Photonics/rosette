use std::sync::Mutex;

use rosette_core::Library;

/// Shared application state holding the currently loaded GDS library.
pub struct AppState {
    pub library: Mutex<Option<Library>>,
    /// File path passed via CLI args (e.g., double-clicking a .gds file).
    /// The frontend polls this once on mount, then it's cleared.
    pub pending_file: Mutex<Option<String>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            library: Mutex::new(None),
            pending_file: Mutex::new(None),
        }
    }
}
