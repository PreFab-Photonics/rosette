import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSelectionStore } from "@/stores/selection";
import { useViewportStore, type WorldBounds } from "@/stores/viewport";
import { useUIStore } from "@/stores/ui";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useImageStore, isImageId, imageIdToKey, imageKeyToId } from "@/stores/image";
import { useExplorerStore } from "@/stores/explorer";
import type { WasmLibrary } from "@/wasm/rosette_wasm";

/**
 * Merge class names with Tailwind CSS classes.
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Collapsed rail width (w-[38px]) in CSS pixels. Must match Explorer.tsx and Sidebar.tsx. */
const COLLAPSED_WIDTH = 38;
/** Panel gap from viewport edge (Tailwind left-4/right-4 = 16px). Must match Explorer.tsx and Sidebar.tsx. */
const PANEL_GAP = 16;

/**
 * Compute the effective visible canvas area, accounting for floating panels.
 *
 * Returns `{ width, height, screenCenter }` where:
 * - `width`/`height` are the unoccluded viewport dimensions (for zoom calculation)
 * - `screenCenter` is the center of the visible area in canvas coordinates (for offset calculation)
 *
 * In zen mode both panels are hidden; when collapsed they show a narrow icon rail.
 */
export function getEffectiveViewport(canvas: HTMLElement): {
  width: number;
  height: number;
  screenCenter: { x: number; y: number };
} {
  const rect = canvas.getBoundingClientRect();
  const { zenMode, explorerCollapsed, sidebarCollapsed, explorerWidth, sidebarWidth } =
    useUIStore.getState();

  let leftInset = 0;
  let rightInset = 0;

  if (!zenMode) {
    // Explorer on the left
    leftInset = explorerCollapsed ? COLLAPSED_WIDTH + PANEL_GAP : explorerWidth + PANEL_GAP;

    // Sidebar on the right
    rightInset = sidebarCollapsed ? COLLAPSED_WIDTH + PANEL_GAP : sidebarWidth + PANEL_GAP;
  }

  const effectiveWidth = Math.max(1, rect.width - leftInset - rightInset);
  const effectiveHeight = rect.height;

  return {
    width: effectiveWidth,
    height: effectiveHeight,
    screenCenter: {
      x: leftInset + effectiveWidth / 2,
      y: effectiveHeight / 2,
    },
  };
}

/**
 * Detect if the current platform is macOS/iOS.
 * Used for showing platform-appropriate keyboard shortcuts.
 */
export const isMac =
  typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

/**
 * Platform-appropriate modifier key symbols.
 * Uses short text labels that render consistently across fonts.
 */
export const keys = {
  mod: isMac ? "⌘" : "Ctrl",
  shift: "⇧",
  alt: isMac ? "⌥" : "Alt",
  backspace: "⌫",
} as const;

/**
 * Get all image IDs (prefixed with "img:") for the active cell.
 */
export function getAllImageIds(): string[] {
  const { images } = useImageStore.getState();
  const activeCell = useExplorerStore.getState().activeCell;
  const ids: string[] = [];
  for (const entry of images.values()) {
    if (entry.cellName === activeCell) {
      ids.push(imageKeyToId(entry.id));
    }
  }
  return ids;
}

/**
 * Merge two world bounds, returning the union. Either or both may be null.
 */
function mergeBounds(a: WorldBounds | null, b: WorldBounds | null): WorldBounds | null {
  if (!a) return b;
  if (!b) return a;
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

/**
 * Compute the axis-aligned bounding box of an image rectangle after
 * applying an affine transform [a, b, c, d, tx, ty].
 */
function transformedImageBounds(
  entry: { x: number; y: number; width: number; height: number },
  t: Float64Array | number[],
): WorldBounds {
  const [a, b, c, d, tx, ty] = t;
  // Transform the four corners of the image rectangle
  const corners = [
    { x: entry.x, y: entry.y },
    { x: entry.x + entry.width, y: entry.y },
    { x: entry.x + entry.width, y: entry.y + entry.height },
    { x: entry.x, y: entry.y + entry.height },
  ];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of corners) {
    const wx = a * p.x + b * p.y + tx;
    const wy = c * p.x + d * p.y + ty;
    minX = Math.min(minX, wx);
    minY = Math.min(minY, wy);
    maxX = Math.max(maxX, wx);
    maxY = Math.max(maxY, wy);
  }
  return { minX, minY, maxX, maxY };
}

/**
 * Compute the combined world bounds of all images visible in the active cell,
 * including images from child cells rendered through cell instances.
 * Returns null if there are no visible images.
 */
function getAllImageBounds(): WorldBounds | null {
  const { images } = useImageStore.getState();
  const activeCell = useExplorerStore.getState().activeCell;
  const { library } = useWasmContextStore.getState();
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let found = false;

  // Direct images in the active cell
  for (const entry of images.values()) {
    if (entry.cellName !== activeCell) continue;
    found = true;
    minX = Math.min(minX, entry.x);
    minY = Math.min(minY, entry.y);
    maxX = Math.max(maxX, entry.x + entry.width);
    maxY = Math.max(maxY, entry.y + entry.height);
  }

  // Instance images from child cells
  if (library && images.size > 0) {
    try {
      const contexts = library.get_instance_cell_contexts() as
        | { cellName: string; transform: Float64Array }[]
        | null;
      if (contexts) {
        for (const ctx of contexts) {
          for (const entry of images.values()) {
            if (entry.cellName !== ctx.cellName) continue;
            found = true;
            const b = transformedImageBounds(entry, ctx.transform);
            minX = Math.min(minX, b.minX);
            minY = Math.min(minY, b.minY);
            maxX = Math.max(maxX, b.maxX);
            maxY = Math.max(maxY, b.maxY);
          }
        }
      }
    } catch {
      // WASM method may not be available yet
    }
  }

  return found ? { minX, minY, maxX, maxY } : null;
}

/**
 * Compute the combined world bounds for the given image IDs (prefixed with "img:").
 * Returns null if none of the IDs are images or images are not found.
 */
export function getImageBoundsForIds(ids: Iterable<string>): WorldBounds | null {
  const { images } = useImageStore.getState();
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let found = false;
  for (const id of ids) {
    if (!isImageId(id)) continue;
    const entry = images.get(imageIdToKey(id));
    if (!entry) continue;
    found = true;
    minX = Math.min(minX, entry.x);
    minY = Math.min(minY, entry.y);
    maxX = Math.max(maxX, entry.x + entry.width);
    maxY = Math.max(maxY, entry.y + entry.height);
  }
  return found ? { minX, minY, maxX, maxY } : null;
}

/**
 * Zoom the viewport to fit all objects in the current cell, including images.
 *
 * Reads the library from the WASM context store, computes bounds, accounts for
 * floating panels via {@link getEffectiveViewport}, and updates the viewport.
 */
export function zoomToFitAll(): void {
  const canvas = document.getElementById("rosette-canvas");
  const { library } = useWasmContextStore.getState();
  if (!canvas || !library) return;

  const boundsArray = library.get_all_bounds();
  const wasmBounds: WorldBounds | null = boundsArray
    ? { minX: boundsArray[0], minY: boundsArray[1], maxX: boundsArray[2], maxY: boundsArray[3] }
    : null;
  const imageBounds = getAllImageBounds();
  const bounds = mergeBounds(wasmBounds, imageBounds);
  const vp = getEffectiveViewport(canvas);
  if (vp.width <= 0 || vp.height <= 0) return;
  useViewportStore.getState().zoomToFit(bounds, vp.width, vp.height, vp.screenCenter);
}

/**
 * Center the viewport on the currently selected elements, including images.
 *
 * Reads the current selection from the store, computes bounds via the library
 * and image store, and updates the viewport to center on those bounds.
 * Accounts for floating panels (Explorer/Sidebar) so the selection centers
 * in the visible area.
 */
export function centerViewOnSelection(library: WasmLibrary, canvas: HTMLCanvasElement): void {
  const selectedIds = useSelectionStore.getState().selectedIds;
  if (selectedIds.size === 0) return;

  // Get WASM element bounds (image IDs are silently ignored by the library)
  const boundsArray = library.get_bounds_for_ids([...selectedIds]);
  const wasmBounds: WorldBounds | null = boundsArray
    ? { minX: boundsArray[0], minY: boundsArray[1], maxX: boundsArray[2], maxY: boundsArray[3] }
    : null;

  // Get image bounds for any selected images
  const imageBounds = getImageBoundsForIds(selectedIds);
  const bounds = mergeBounds(wasmBounds, imageBounds);
  if (!bounds) return;

  const vp = getEffectiveViewport(canvas);
  useViewportStore.getState().centerOnBounds(bounds, vp.width, vp.height, vp.screenCenter);
}
