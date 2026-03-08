/**
 * Tauri integration utilities.
 *
 * Provides type-safe wrappers around Tauri IPC commands and a runtime
 * check for whether the app is running inside a Tauri webview.
 */

import type { CellNode } from "@/stores/explorer";

/** Whether the app is running inside a Tauri webview. */
export const isTauri = "__TAURI__" in window;

/** Response from the `open_gds` Tauri command. */
export interface OpenGdsResponse {
  json: string;
  cells: CellNode | null;
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

/** Open a GDS file via the Tauri backend. */
export async function openGds(path: string): Promise<OpenGdsResponse> {
  return invoke<OpenGdsResponse>("open_gds", { path });
}

/** Navigate to a specific cell and get its flattened geometry. */
export async function navigateCell(cellName: string): Promise<string> {
  return invoke<string>("navigate_cell", { cellName });
}

/** Get the cell hierarchy tree. */
export async function getCellTree(): Promise<CellNode | null> {
  return invoke<CellNode | null>("get_cell_tree");
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
