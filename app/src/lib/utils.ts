import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSelectionStore } from "@/stores/selection";
import { useViewportStore } from "@/stores/viewport";
import type { WasmLibrary } from "@/wasm/rosette_wasm";

/**
 * Merge class names with Tailwind CSS classes.
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
 * Center the viewport on the currently selected elements.
 *
 * Reads the current selection from the store, computes bounds via the library,
 * and updates the viewport to center on those bounds.
 */
export function centerViewOnSelection(library: WasmLibrary, canvas: HTMLCanvasElement): void {
  const selectedIds = useSelectionStore.getState().selectedIds;
  if (selectedIds.size === 0) return;

  const boundsArray = library.get_bounds_for_ids([...selectedIds]);
  if (!boundsArray) return;

  const bounds = {
    minX: boundsArray[0],
    minY: boundsArray[1],
    maxX: boundsArray[2],
    maxY: boundsArray[3],
  };
  const rect = canvas.getBoundingClientRect();
  useViewportStore.getState().centerOnBounds(bounds, rect.width, rect.height);
}
