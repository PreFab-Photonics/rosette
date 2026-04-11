/**
 * Image insertion operations.
 *
 * Handles picking an image file via native dialog (Tauri) or browser
 * file input, loading it, and placing it as an overlay annotation on
 * the canvas.
 */

import { isTauri, pickImageFile, readFileBytes } from "@/lib/tauri";
import { useViewportStore } from "@/stores/viewport";
import { useHistoryStore } from "@/stores/history";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useExplorerStore } from "@/stores/explorer";
import { AddImageCommand } from "@/lib/commands";
import type { ImageEntry } from "@/stores/image";

/** Accepted image MIME types for the browser file picker. */
const IMAGE_ACCEPT = "image/png,image/jpeg,image/svg+xml,image/webp,image/gif,image/bmp";

/** Map file extension to MIME type for Blob creation. */
function mimeTypeForExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const mimeMap: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    webp: "image/webp",
    gif: "image/gif",
    bmp: "image/bmp",
  };
  return mimeMap[ext] ?? "application/octet-stream";
}

/** Extract the filename from a full path. */
function basename(path: string): string {
  return path.replace(/\\/g, "/").split("/").pop() ?? path;
}

/**
 * Load an image from a URL and resolve its natural dimensions.
 */
function loadImageDimensions(
  url: string,
): Promise<{ naturalWidth: number; naturalHeight: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
    img.onerror = () => reject(new Error("Failed to decode image"));
    img.src = url;
  });
}

/**
 * Pick an image file using a hidden browser `<input type="file">`.
 *
 * Returns a promise that resolves with the object URL and filename,
 * or null if the user cancels the dialog.
 */
function pickImageBrowser(): Promise<{
  url: string;
  filename: string;
  naturalWidth: number;
  naturalHeight: number;
} | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = IMAGE_ACCEPT;
    input.style.display = "none";

    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const url = URL.createObjectURL(file);
      try {
        const { naturalWidth, naturalHeight } = await loadImageDimensions(url);
        resolve({ url, filename: file.name, naturalWidth, naturalHeight });
      } catch {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    });

    // Handle cancellation: if the window regains focus and no file was selected,
    // resolve null. Use a one-shot listener with a delay to avoid racing with
    // the change event.
    input.addEventListener("cancel", () => resolve(null));

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}

/**
 * Pick an image file using Tauri's native dialog.
 *
 * Reads file bytes via IPC and creates an object URL.
 */
async function pickImageNative(): Promise<{
  url: string;
  filename: string;
  naturalWidth: number;
  naturalHeight: number;
} | null> {
  const path = await pickImageFile();
  if (!path) return null;

  const filename = basename(path);
  const mimeType = mimeTypeForExtension(filename);

  const bytes = await readFileBytes(path);
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);

  try {
    const { naturalWidth, naturalHeight } = await loadImageDimensions(url);
    return { url, filename, naturalWidth, naturalHeight };
  } catch {
    URL.revokeObjectURL(url);
    return null;
  }
}

/**
 * Insert an image entry into the canvas at the viewport center.
 */
function insertImage(imageData: {
  url: string;
  filename: string;
  naturalWidth: number;
  naturalHeight: number;
}): void {
  const { zoom, offset } = useViewportStore.getState();
  const canvas = document.getElementById("rosette-canvas");
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const centerX = (rect.width / 2 - offset.x) / zoom;
  const centerY = (rect.height / 2 - offset.y) / zoom;

  // Size the image to ~20% of visible viewport width, maintaining aspect ratio
  const visibleWidth = rect.width / zoom;
  const worldWidth = visibleWidth * 0.2;
  const aspectRatio = imageData.naturalHeight / imageData.naturalWidth;
  const worldHeight = worldWidth * aspectRatio;

  // Position so the image is centered
  const x = centerX - worldWidth / 2;
  const y = centerY - worldHeight / 2;

  const entry: ImageEntry = {
    id: crypto.randomUUID(),
    url: imageData.url,
    filename: imageData.filename,
    x,
    y,
    width: worldWidth,
    height: worldHeight,
    naturalWidth: imageData.naturalWidth,
    naturalHeight: imageData.naturalHeight,
    lockAspectRatio: true,
    cellName: useExplorerStore.getState().activeCell ?? "",
  };

  // Execute via history for undo/redo support (command handles selection)
  const { library, renderer } = useWasmContextStore.getState();
  if (library && renderer) {
    const cmd = new AddImageCommand(entry);
    useHistoryStore.getState().execute(cmd, { library, renderer });
  }
}

/**
 * Pick an image file and insert it as an overlay centered in the current
 * viewport.
 *
 * Uses Tauri's native file dialog when available, falls back to a browser
 * `<input type="file">` for non-Tauri environments (dev server, embed).
 */
export async function pickAndInsertImage(): Promise<void> {
  const imageData = isTauri ? await pickImageNative() : await pickImageBrowser();
  if (!imageData) return;
  insertImage(imageData);
}
