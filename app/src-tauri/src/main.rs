// Prevents an additional console window on Windows in release.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod state;

use tauri::{Emitter, Manager};

/// Check if a path looks like a GDS file.
fn is_gds_path(path: &str) -> bool {
    let lower = path.to_lowercase();
    lower.ends_with(".gds") || lower.ends_with(".gds2") || lower.ends_with(".gdsii")
}

fn main() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .manage(state::AppState::new())
        .invoke_handler(tauri::generate_handler![
            commands::open_gds,
            commands::read_gds_bytes,
            commands::save_gds,
            commands::save_bytes,
            commands::get_pending_file,
            commands::get_current_file,
            commands::set_current_file,
        ])
        .setup(|app| {
            // On Windows/Linux, file associations pass the path as a CLI arg.
            // (macOS uses Apple Events instead — handled in the run callback below.)
            #[cfg(not(target_os = "macos"))]
            {
                let args: Vec<String> = std::env::args().collect();
                if let Some(path) = args.iter().skip(1).find(|a| is_gds_path(a)) {
                    let state = app.state::<state::AppState>();
                    if let Ok(mut pending) = state.pending_file.lock() {
                        *pending = Some(path.clone());
                    }
                }
            }

            #[cfg(target_os = "macos")]
            let _ = app;

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building Rosette");

    app.run(|app_handle, event| {
        // On macOS, file associations deliver paths via RunEvent::Opened (Apple Events),
        // not CLI args. This handles both fresh launch and "already running" cases.
        #[cfg(target_os = "macos")]
        if let tauri::RunEvent::Opened { urls } = &event {
            for url in urls {
                if url.scheme() == "file" {
                    if let Ok(path) = url.to_file_path() {
                        let path_str = path.to_string_lossy().to_string();
                        if is_gds_path(&path_str) {
                            let state = app_handle.state::<state::AppState>();

                            // Emit to frontend for the "already running" case —
                            // the listener in use-library.ts handles this immediately.
                            let _ = app_handle.emit("open-file", &path_str);

                            // Also store as pending for the "cold start" case —
                            // on fresh launch, RunEvent::Opened fires before the
                            // webview mounts, so the emit has no listener yet.
                            // The frontend polls getPendingFile() on mount to
                            // catch this.
                            if let Ok(mut pending) = state.pending_file.lock() {
                                *pending = Some(path_str.clone());
                            }

                            if let Ok(mut current) = state.current_file.lock() {
                                *current = Some(path_str);
                            }
                            break;
                        }
                    }
                }
            }
        }

        // Suppress unused variable warning on non-macOS platforms.
        let _ = (&app_handle, &event);
    });
}
