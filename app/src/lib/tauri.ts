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

/**
 * Read raw GDS file bytes via the Tauri backend.
 *
 * Uses Tauri's binary IPC — the bytes are transferred as an ArrayBuffer,
 * not JSON-encoded. The frontend passes these to `WasmLibrary.from_gds_bytes()`.
 */
export async function readGdsBytes(path: string): Promise<Uint8Array> {
  const buffer = await invoke<ArrayBuffer>("read_gds_bytes", { path });
  return new Uint8Array(buffer);
}

/** Save GDS bytes to a file via the Tauri backend. */
export async function saveGds(path: string, bytes: Uint8Array): Promise<void> {
  return invoke<void>("save_gds", { path, bytes: Array.from(bytes) });
}

/** Save arbitrary bytes to a file without updating the current file path. */
export async function saveBytes(path: string, bytes: Uint8Array): Promise<void> {
  return invoke<void>("save_bytes", { path, bytes: Array.from(bytes) });
}

/** Get and clear the pending file path from CLI args. */
export async function getPendingFile(): Promise<string | null> {
  return invoke<string | null>("get_pending_file");
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

/** Open a native save dialog for PNG images. Returns the path or null. */
export async function pickSaveImageFile(defaultPath?: string): Promise<string | null> {
  const { save } = await import("@tauri-apps/plugin-dialog");
  return save({
    title: "Export Screenshot",
    filters: [
      {
        name: "PNG Image",
        extensions: ["png"],
      },
    ],
    defaultPath,
  });
}

/** Open a native file dialog to pick an image file. Returns the path or null. */
export async function pickImageFile(): Promise<string | null> {
  const { open } = await import("@tauri-apps/plugin-dialog");
  const result = await open({
    title: "Insert Image",
    filters: [
      {
        name: "Image Files",
        extensions: ["png", "jpg", "jpeg", "svg", "webp", "gif", "bmp"],
      },
    ],
    multiple: false,
    directory: false,
  });

  if (result === null) return null;
  return result as string;
}

/** Read raw file bytes via the Tauri backend. */
export async function readFileBytes(path: string): Promise<Uint8Array> {
  const buffer = await invoke<ArrayBuffer>("read_gds_bytes", { path });
  return new Uint8Array(buffer);
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
