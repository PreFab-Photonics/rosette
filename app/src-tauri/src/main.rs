// Prevents an additional console window on Windows in release.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod state;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .manage(state::AppState::new())
        .invoke_handler(tauri::generate_handler![
            commands::open_gds,
            commands::navigate_cell,
            commands::get_cell_tree,
            commands::get_pending_file,
        ])
        .setup(|app| {
            // Handle file associations: when a user double-clicks a .gds file,
            // the OS passes the path as a CLI argument. Store it so the frontend
            // can retrieve it on mount via `get_pending_file`.
            let args: Vec<String> = std::env::args().collect();
            if let Some(path) = args.get(1)
                && (path.ends_with(".gds") || path.ends_with(".gds2") || path.ends_with(".gdsii"))
            {
                let state = app.state::<state::AppState>();
                if let Ok(mut pending) = state.pending_file.lock() {
                    *pending = Some(path.clone());
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Rosette");
}
