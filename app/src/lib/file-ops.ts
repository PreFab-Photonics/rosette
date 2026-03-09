import { pickSaveFile, saveGds, getCurrentFile } from "@/lib/tauri";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useStatusMessageStore } from "@/stores/status-message";

/**
 * Emit an open-file event for the Tauri backend to process.
 * The `use-library` hook listens for this event.
 */
export async function emitOpenFile(path: string) {
  const { emit } = await import("@tauri-apps/api/event");
  await emit("open-file", path);
}

/**
 * Save the current library to a GDS file.
 *
 * If `forceDialog` is true or no current file path exists, prompts with Save As.
 * Otherwise saves to the current file path (Cmd+S behavior).
 */
export async function handleSave(forceDialog: boolean) {
  const library = useWasmContextStore.getState().library;
  if (!library) return;

  try {
    let path: string | null = null;

    if (!forceDialog) {
      // Try to get the current file path (Save)
      path = await getCurrentFile();
    }

    if (!path) {
      // No current file or Save As — show dialog
      path = await pickSaveFile();
    }

    if (!path) return; // User cancelled

    // Ensure .gds extension
    if (!path.endsWith(".gds") && !path.endsWith(".gds2") && !path.endsWith(".gdsii")) {
      path += ".gds";
    }

    // Generate GDS bytes from the WASM library
    const bytes = library.to_gds();

    // Write to disk via Tauri backend
    await saveGds(path, bytes);

    useStatusMessageStore.getState().show(`Saved to ${path.split("/").pop()}`);
  } catch (err) {
    console.error("Failed to save GDS file:", err);
    useStatusMessageStore.getState().show(`Save failed: ${err}`, "error");
  }
}
