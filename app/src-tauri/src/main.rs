// Prevents an additional console window on Windows in release.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod state;

use serde::Deserialize;
use tauri::{Emitter, Manager};
use tauri_plugin_window_state::StateFlags;

/// Check if a path looks like a GDS file.
fn is_gds_path(path: &str) -> bool {
    let lower = path.to_lowercase();
    lower.ends_with(".gds") || lower.ends_with(".gds2") || lower.ends_with(".gdsii")
}

/// Parse `--url <URL>` from CLI arguments.
///
/// When `rosette serve --native` launches the desktop app, it passes
/// the Python dev-server URL (e.g. `http://localhost:5173?design=true`)
/// so the webview connects to the live-reload SSE endpoint instead of
/// loading the bundled frontend.
fn parse_url_arg() -> Option<String> {
    let args: Vec<String> = std::env::args().collect();
    for (i, arg) in args.iter().enumerate() {
        if arg == "--url" {
            return args.get(i + 1).cloned();
        }
    }
    None
}

/// Minimal view of the persisted window state file (written by tauri-plugin-window-state).
#[derive(Deserialize)]
struct SavedWindowState {
    #[serde(default)]
    maximized: bool,
}

/// Read the saved window state from disk so we know if the window was maximized.
fn read_saved_window_state(app: &tauri::App) -> Option<SavedWindowState> {
    let config_dir = app.path().app_config_dir().ok()?;
    let state_path = config_dir.join(".window-state.json");
    let file = std::fs::File::open(state_path).ok()?;
    let reader = std::io::BufReader::new(file);
    let states: std::collections::HashMap<String, SavedWindowState> =
        serde_json::from_reader(reader).ok()?;
    states
        .into_iter()
        .find(|(k, _)| k == "main")
        .map(|(_, v)| v)
}

fn main() {
    let url_override = parse_url_arg();

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_window_state::Builder::new()
                .with_state_flags(
                    StateFlags::SIZE
                        | StateFlags::POSITION
                        | StateFlags::MAXIMIZED
                        | StateFlags::FULLSCREEN,
                )
                .skip_initial_state("main")
                .build(),
        )
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
        .setup(move |app| {
            // If --url was passed, navigate the main window to that URL.
            // This is used by `rosette serve --native` to point the webview
            // at the Python dev server instead of the bundled frontend.
            if let Some(ref url) = url_override {
                let window = app
                    .get_webview_window("main")
                    .expect("main window not found");
                let parsed: url::Url = url
                    .parse()
                    .unwrap_or_else(|_| panic!("invalid --url value: {url}"));
                window
                    .navigate(parsed)
                    .expect("failed to navigate to --url");
            }

            // On Windows/Linux, file associations pass the path as a CLI arg.
            // (macOS uses Apple Events instead — handled in the run callback below.)
            // Skip the value after --url so it isn't misidentified as a GDS path.
            #[cfg(not(target_os = "macos"))]
            {
                let args: Vec<String> = std::env::args().collect();
                let mut skip_next = false;
                for arg in args.iter().skip(1) {
                    if skip_next {
                        skip_next = false;
                        continue;
                    }
                    if arg == "--url" {
                        skip_next = true;
                        continue;
                    }
                    if is_gds_path(arg) {
                        let state = app.state::<state::AppState>();
                        if let Ok(mut pending) = state.pending_file.lock() {
                            *pending = Some(arg.clone());
                        }
                        break;
                    }
                }
            }

            // Manually restore window state to avoid the macOS maximize animation.
            // The plugin's initial restore is skipped for "main" (skip_initial_state)
            // so we handle it here: if the window was maximized, we size it to fill
            // the screen directly instead of calling maximize(), which would trigger
            // an animated zoom effect on macOS.
            if let Some(window) = app.get_webview_window("main") {
                let saved = read_saved_window_state(app);
                let was_maximized = saved.as_ref().is_some_and(|s| s.maximized);

                if was_maximized {
                    // Set frame to the usable monitor area (excludes menu bar and dock) — no animation.
                    if let Ok(Some(monitor)) = window.current_monitor() {
                        let work = monitor.work_area();
                        let _ = window.set_position(tauri::PhysicalPosition::new(
                            work.position.x,
                            work.position.y,
                        ));
                        let _ = window
                            .set_size(tauri::PhysicalSize::new(work.size.width, work.size.height));
                    }
                } else {
                    // Not maximized — restore saved size/position normally.
                    use tauri_plugin_window_state::WindowExt;
                    let _ = window.restore_state(
                        StateFlags::SIZE | StateFlags::POSITION | StateFlags::FULLSCREEN,
                    );
                }

                window.show().unwrap_or_default();
            }

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
                if url.scheme() == "file"
                    && let Ok(path) = url.to_file_path()
                {
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

        // Suppress unused variable warning on non-macOS platforms.
        let _ = (&app_handle, &event);
    });
}
