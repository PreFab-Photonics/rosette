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

#[derive(Debug, PartialEq)]
struct ServerLaunch {
    url: String,
    design_mode: bool,
}

/// Parse local design-server arguments passed by `rosette serve --native`.
fn parse_server_launch_from(args: &[String]) -> Option<ServerLaunch> {
    for (i, arg) in args.iter().enumerate() {
        if arg == "--server-url" {
            return args.get(i + 1).map(|url| ServerLaunch {
                url: url.clone(),
                design_mode: args.iter().any(|value| value == "--design-mode"),
            });
        }
    }

    // Compatibility with launchers predating the trusted-origin transport.
    for (i, arg) in args.iter().enumerate() {
        if arg == "--url" {
            let mut url: url::Url = args.get(i + 1)?.parse().ok()?;
            let design_mode = url
                .query_pairs()
                .any(|(key, value)| key == "design" && value.eq_ignore_ascii_case("true"));
            url.set_query(None);
            return Some(ServerLaunch {
                url: url.to_string(),
                design_mode,
            });
        }
    }
    None
}

fn parse_server_launch() -> Option<ServerLaunch> {
    let args: Vec<String> = std::env::args().collect();
    parse_server_launch_from(&args)
}

/// Keep the webview on its platform-specific bundled origin and add API context.
fn server_viewer_url(mut app_url: url::Url, launch: &ServerLaunch) -> Result<url::Url, String> {
    let server_url: url::Url = launch
        .url
        .parse()
        .map_err(|error| format!("invalid --server-url value: {error}"))?;
    let is_loopback = matches!(
        server_url.host_str(),
        Some("localhost" | "127.0.0.1" | "::1")
    );
    if server_url.scheme() != "http" || !is_loopback {
        return Err("--server-url must be an HTTP loopback URL".into());
    }

    app_url.set_path(if launch.design_mode { "/preview" } else { "/" });
    app_url.set_query(None);
    app_url.set_fragment(None);
    {
        let mut query = app_url.query_pairs_mut();
        query.append_pair("server", server_url.as_str());
    }
    Ok(app_url)
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
    let server_launch = parse_server_launch();

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
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
        ])
        .setup(move |app| {
            // Preserve the trusted bundled origin while pointing API/SSE
            // requests at the local Python design server.
            if let Some(ref launch) = server_launch {
                let window = app
                    .get_webview_window("main")
                    .expect("main window not found");
                let parsed = server_viewer_url(
                    window.url().expect("failed to read bundled app URL"),
                    launch,
                )
                .unwrap_or_else(|error| panic!("{error}"));
                window
                    .navigate(parsed)
                    .expect("failed to add design-server context");
            }

            // On Windows/Linux, file associations pass the path as a CLI arg.
            // (macOS uses Apple Events instead — handled in the run callback below.)
            // Skip design-server arguments so they aren't misidentified as GDS paths.
            #[cfg(not(target_os = "macos"))]
            {
                let args: Vec<String> = std::env::args().collect();
                let mut skip_next = false;
                for arg in args.iter().skip(1) {
                    if skip_next {
                        skip_next = false;
                        continue;
                    }
                    if arg == "--server-url" || arg == "--url" {
                        skip_next = true;
                        continue;
                    }
                    if arg == "--design-mode" {
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
                            *pending = Some(path_str);
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

#[cfg(test)]
mod tests {
    use super::{ServerLaunch, parse_server_launch_from, server_viewer_url};

    #[test]
    fn server_context_preserves_platform_app_origin() {
        let launch = ServerLaunch {
            url: "http://127.0.0.1:5173".into(),
            design_mode: true,
        };

        let mac = server_viewer_url("tauri://localhost".parse().unwrap(), &launch).unwrap();
        assert_eq!(
            mac.as_str(),
            "tauri://localhost/preview?server=http%3A%2F%2F127.0.0.1%3A5173%2F"
        );

        let windows =
            server_viewer_url("http://tauri.localhost".parse().unwrap(), &launch).unwrap();
        assert_eq!(
            windows.as_str(),
            "http://tauri.localhost/preview?server=http%3A%2F%2F127.0.0.1%3A5173%2F"
        );
    }

    #[test]
    fn server_context_rejects_non_loopback_urls() {
        let launch = ServerLaunch {
            url: "https://example.com".into(),
            design_mode: false,
        };
        assert!(server_viewer_url("tauri://localhost".parse().unwrap(), &launch).is_err());
    }

    #[test]
    fn legacy_remote_url_is_translated_to_server_context() {
        let args = [
            "rosette-desktop".into(),
            "--url".into(),
            "http://127.0.0.1:5173?design=true".into(),
        ];
        assert_eq!(
            parse_server_launch_from(&args),
            Some(ServerLaunch {
                url: "http://127.0.0.1:5173/".into(),
                design_mode: true,
            })
        );
    }

    #[test]
    fn versioned_server_context_is_parsed() {
        let args = [
            "rosette-desktop".into(),
            "--server-url".into(),
            "http://127.0.0.1:5173".into(),
            "--design-mode".into(),
        ];
        assert_eq!(
            parse_server_launch_from(&args),
            Some(ServerLaunch {
                url: "http://127.0.0.1:5173".into(),
                design_mode: true,
            })
        );
    }
}
