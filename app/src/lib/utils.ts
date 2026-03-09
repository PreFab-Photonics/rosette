import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSelectionStore } from "@/stores/selection";
import { useViewportStore } from "@/stores/viewport";
import { useUIStore } from "@/stores/ui";
import type { WasmLibrary } from "@/wasm/rosette_wasm";

/**
 * Merge class names with Tailwind CSS classes.
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Panel width (Tailwind w-72) in CSS pixels. Must match Explorer.tsx and Sidebar.tsx. */
const PANEL_WIDTH = 288;
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
  const { zenMode, explorerCollapsed, sidebarCollapsed } = useUIStore.getState();

  let leftInset = 0;
  let rightInset = 0;

  if (!zenMode) {
    // Explorer on the left
    leftInset = explorerCollapsed
      ? COLLAPSED_WIDTH + PANEL_GAP
      : PANEL_WIDTH + PANEL_GAP;

    // Sidebar on the right
    rightInset = sidebarCollapsed
      ? COLLAPSED_WIDTH + PANEL_GAP
      : PANEL_WIDTH + PANEL_GAP;
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
 * Center the viewport on the currently selected elements.
 *
 * Reads the current selection from the store, computes bounds via the library,
 * and updates the viewport to center on those bounds. Accounts for floating
 * panels (Explorer/Sidebar) so the selection centers in the visible area.
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
  const vp = getEffectiveViewport(canvas);
  useViewportStore.getState().centerOnBounds(bounds, vp.width, vp.height, vp.screenCenter);
}
