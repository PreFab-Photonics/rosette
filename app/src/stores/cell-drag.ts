import { create } from "zustand";

/**
 * Lightweight store for custom cell drag-and-drop from Explorer to Canvas.
 *
 * Bypasses the browser's HTML5 drag-and-drop API entirely so we have full
 * control over the drag ghost (we render a bounding box preview on the
 * WebGPU canvas instead of the browser's default drag image).
 */

interface CellDragState {
  /** Name of the cell currently being dragged, or null if no drag is active. */
  cellName: string | null;
  /** Cached bounding box of the dragged cell: [minX, minY, maxX, maxY]. */
  bounds: Float64Array | null;
  /** Cached origin of the dragged cell. */
  origin: { x: number; y: number };

  /** Begin a cell drag. Called from Explorer on mousedown. */
  startDrag: (cellName: string, bounds: Float64Array | null, origin: { x: number; y: number }) => void;
  /** End the drag (drop or cancel). */
  endDrag: () => void;
}

export const useCellDragStore = create<CellDragState>((set) => ({
  cellName: null,
  bounds: null,
  origin: { x: 0, y: 0 },

  startDrag: (cellName, bounds, origin) => set({ cellName, bounds, origin }),
  endDrag: () => set({ cellName: null, bounds: null, origin: { x: 0, y: 0 } }),
}));
