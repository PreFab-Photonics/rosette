import {
  isTauri,
  pickSaveFile,
  pickSaveImageFile,
  saveGds,
  saveBytes,
  getCurrentFile,
  setCurrentFile,
} from "@/lib/tauri";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useStatusMessageStore } from "@/stores/status-message";
import { useDocumentStore } from "@/stores/document";
import { useHistoryStore } from "@/stores/history";
import { useSelectionStore } from "@/stores/selection";
import { useRulerStore } from "@/stores/ruler";
import { useClipboardStore } from "@/stores/clipboard";
import { useLayerStore } from "@/stores/layer";

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

    useDocumentStore.getState().markClean();
    useStatusMessageStore.getState().show(`Saved to ${path.split("/").pop()}`);
  } catch (err) {
    console.error("Failed to save GDS file:", err);
    useStatusMessageStore.getState().show(`Save failed: ${err}`, "error");
  }
}

/**
 * Check if there are unsaved changes and prompt the user before discarding.
 *
 * In Tauri mode, shows a native confirmation dialog. In the browser,
 * falls back to `window.confirm()`.
 *
 * @returns `true` if the user confirmed (or there are no unsaved changes),
 *          `false` if the user cancelled.
 */
export async function confirmDiscardChanges(): Promise<boolean> {
  if (!useDocumentStore.getState().isDirty) return true;

  if (isTauri) {
    const { ask } = await import("@tauri-apps/plugin-dialog");
    return ask("You have unsaved changes. Do you want to discard them?", {
      title: "Unsaved Changes",
      kind: "warning",
      okLabel: "Discard",
      cancelLabel: "Cancel",
    });
  }

  return window.confirm("You have unsaved changes. Do you want to discard them?");
}

/**
 * Create a new empty file, resetting the editor to a blank state.
 *
 * Checks for unsaved changes, then dispatches a DOM event that
 * `use-library.ts` listens for. The actual library replacement
 * happens inside the hook (which owns the singleton and local state).
 */
export async function handleNewFile(): Promise<void> {
  // Guard: check unsaved changes
  const confirmed = await confirmDiscardChanges();
  if (!confirmed) return;

  // Reset stores that don't depend on the library
  useHistoryStore.getState().clear();
  useSelectionStore.getState().clearSelection();
  useRulerStore.getState().clearAllRulers();
  useClipboardStore.getState().clear();
  useLayerStore.getState().resetLayers([]);
  useDocumentStore.getState().markClean();

  // Clear current file path in Tauri
  if (isTauri) {
    await setCurrentFile(null);
  }

  // Dispatch event for use-library to handle (it owns the WASM singleton)
  window.dispatchEvent(new CustomEvent("rosette-new-file"));
}

/**
 * Capture the current canvas viewport as a PNG blob.
 *
 * Uses the WASM renderer's offscreen capture method which renders to a
 * separate texture with `COPY_SRC`, copies pixels to a staging buffer,
 * and returns raw RGBA data. This avoids the WebGPU surface recycling
 * issue that makes `canvas.toBlob()` produce blank images.
 *
 * The raw RGBA pixels are painted onto a 2D canvas and encoded to PNG.
 */
async function captureScreenshotBlob(): Promise<Blob> {
  const { renderer } = useWasmContextStore.getState();
  if (!renderer) {
    throw new Error("Renderer not ready");
  }

  // Capture raw RGBA pixels via offscreen GPU render
  const rawData: Uint8Array = await renderer.capture_screenshot();

  // Parse header: first 8 bytes are (width, height) as little-endian u32
  const view = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);
  const width = view.getUint32(0, true);
  const height = view.getUint32(4, true);
  const pixels = rawData.slice(8);

  // Paint RGBA pixels onto a 2D canvas and encode to PNG
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to create 2D context");
  }

  const imageData = new ImageData(
    new Uint8ClampedArray(pixels.buffer, pixels.byteOffset, pixels.byteLength),
    width,
    height,
  );
  ctx.putImageData(imageData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    offscreen.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("PNG encoding failed"))),
      "image/png",
    );
  });
}

/**
 * Export the current canvas viewport as a PNG file.
 *
 * - **Tauri**: prompts with a native save dialog and writes to disk.
 * - **Browser**: triggers a download via a temporary `<a>` tag.
 */
export async function handleScreenshot() {
  try {
    const blob = await captureScreenshotBlob();

    if (isTauri) {
      // Tauri: native save dialog + write to disk
      let path = await pickSaveImageFile();
      if (!path) return; // User cancelled

      if (!path.endsWith(".png")) {
        path += ".png";
      }

      const bytes = new Uint8Array(await blob.arrayBuffer());
      await saveBytes(path, bytes);

      useStatusMessageStore.getState().show(`Screenshot saved to ${path.split("/").pop()}`);
    } else {
      // Browser: download via temporary <a> tag
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "screenshot.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      useStatusMessageStore.getState().show("Screenshot downloaded");
    }
  } catch (err) {
    console.error("Screenshot failed:", err);
    useStatusMessageStore.getState().show(`Screenshot failed: ${err}`, "error");
  }
}

/**
 * Copy the current canvas viewport as a PNG image to the clipboard.
 */
export async function handleScreenshotToClipboard() {
  try {
    const blob = await captureScreenshotBlob();

    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

    useStatusMessageStore.getState().show("Screenshot copied to clipboard");
  } catch (err) {
    console.error("Screenshot to clipboard failed:", err);
    useStatusMessageStore.getState().show(`Screenshot to clipboard failed: ${err}`, "error");
  }
}
