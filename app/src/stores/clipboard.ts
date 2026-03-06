import { create } from "zustand";

/**
 * Snapshot of a polygon element for clipboard operations.
 */
export interface PolygonSnapshot {
  type: "polygon";
  /** Flat array of vertices [x0, y0, x1, y1, ...]. */
  vertices: Float64Array;
  /** Layer number. */
  layer: number;
  /** Datatype number. */
  datatype: number;
}

/**
 * Snapshot of a CellRef (cell instance) for clipboard operations.
 */
export interface CellRefSnapshot {
  type: "cell-ref";
  /** Name of the referenced cell. */
  cellName: string;
  /** Full affine transform [a, b, c, d, tx, ty]. */
  transform: Float64Array;
}

/**
 * Polygon-only element snapshot.
 *
 * Used by commands that only operate on polygons (layer changes, resize, etc.).
 * For general-purpose snapshotting that includes CellRef instances, use `ClipboardSnapshot`.
 */
export interface ElementSnapshot {
  /** Flat array of vertices [x0, y0, x1, y1, ...]. */
  vertices: Float64Array;
  /** Layer number. */
  layer: number;
  /** Datatype number. */
  datatype: number;
}

/** Any element snapshot that can live on the clipboard. */
export type ClipboardSnapshot = PolygonSnapshot | CellRefSnapshot;

/**
 * Clipboard state for copy/paste operations.
 */
interface ClipboardState {
  /** Copied element snapshots. */
  elements: ClipboardSnapshot[];

  /** Whether clipboard has content. */
  hasContent: boolean;

  /** Copy elements to clipboard. */
  copy: (elements: ClipboardSnapshot[]) => void;

  /** Clear clipboard. */
  clear: () => void;
}

/**
 * Zustand store for clipboard management.
 *
 * Stores element snapshots for copy/paste operations.
 * Session-only (cleared when tab closes).
 */
export const useClipboardStore = create<ClipboardState>((set) => ({
  elements: [],
  hasContent: false,

  copy: (elements) =>
    set({
      elements,
      hasContent: elements.length > 0,
    }),

  clear: () =>
    set({
      elements: [],
      hasContent: false,
    }),
}));
