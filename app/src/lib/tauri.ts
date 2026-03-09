/**
 * Tauri integration utilities.
 *
 * Provides type-safe wrappers around Tauri IPC commands and a runtime
 * check for whether the app is running inside a Tauri webview.
 */

/** Whether the app is running inside a Tauri webview. */
export const isTauri = "__TAURI__" in window;

/** Response from the `open_gds` Tauri command. */
export interface OpenGdsResponse {
  /** Full hierarchical Library JSON (micrometers, Y-up). */
  json: string;
}

/**
 * Invoke a Tauri command. Returns `null` if not running in Tauri.
 *
 * Uses dynamic import so the module doesn't fail to load in browsers.
 */
async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
  return tauriInvoke<T>(cmd, args);
}

/** Open a GDS file via the Tauri backend. Returns full Library JSON. */
export async function openGds(path: string): Promise<OpenGdsResponse> {
  return invoke<OpenGdsResponse>("open_gds", { path });
}

/** Save GDS bytes to a file via the Tauri backend. */
export async function saveGds(path: string, bytes: Uint8Array): Promise<void> {
  return invoke<void>("save_gds", { path, bytes: Array.from(bytes) });
}

/** Get and clear the pending file path from CLI args. */
export async function getPendingFile(): Promise<string | null> {
  return invoke<string | null>("get_pending_file");
}

/** Get the current file path (last opened or saved). */
export async function getCurrentFile(): Promise<string | null> {
  return invoke<string | null>("get_current_file");
}

/** Set the current file path. */
export async function setCurrentFile(path: string | null): Promise<void> {
  return invoke<void>("set_current_file", { path });
}

/** Open a native file dialog to pick a GDS file. Returns the path or null. */
export async function pickGdsFile(): Promise<string | null> {
  const { open } = await import("@tauri-apps/plugin-dialog");
  const result = await open({
    title: "Open GDS File",
    filters: [
      {
        name: "GDS Files",
        extensions: ["gds", "gds2", "gdsii"],
      },
    ],
    multiple: false,
    directory: false,
  });

  if (result === null) return null;
  // `open` returns a string path (single file mode)
  return result as string;
}

/** Open a native save dialog for GDS files. Returns the path or null. */
export async function pickSaveFile(defaultPath?: string): Promise<string | null> {
  const { save } = await import("@tauri-apps/plugin-dialog");
  const result = await save({
    title: "Save GDS File",
    filters: [
      {
        name: "GDS Files",
        extensions: ["gds"],
      },
    ],
    defaultPath,
  });

  return result;
}

/**
 * Listen for Tauri events. Returns an unlisten function.
 */
export async function listenTauri<T>(
  event: string,
  handler: (payload: T) => void,
): Promise<() => void> {
  const { listen } = await import("@tauri-apps/api/event");
  const unlisten = await listen<T>(event, (e) => handler(e.payload));
  return unlisten;
}
