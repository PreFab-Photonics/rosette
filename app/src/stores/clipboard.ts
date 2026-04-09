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
 * Snapshot of a path (waveguide) element for clipboard operations.
 *
 * Paths are stored as polygons in the WASM library but have additional
 * metadata (waypoints, width, corner radius) that allows re-editing.
 * This snapshot preserves that metadata so duplicated/pasted paths
 * remain editable paths rather than becoming plain polygons.
 */
export interface PathSnapshot {
  type: "path";
  /** Original waypoint positions in world coordinates. */
  waypoints: { x: number; y: number }[];
  /** Waveguide width in world units. */
  width: number;
  /** Corner radius in world units (0 = sharp corners). */
  cornerRadius: number;
  /** Number of arc points for corner rounding. */
  numArcPoints: number;
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
 * Snapshot of a text label element for clipboard operations.
 */
export interface TextSnapshot {
  type: "text";
  /** Text content. */
  text: string;
  /** World X position. */
  x: number;
  /** World Y position. */
  y: number;
  /** Text height (visual cap-height) in world units. */
  height: number;
  /** Layer number. */
  layer: number;
  /** Datatype number. */
  datatype: number;
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
export type ClipboardSnapshot = PolygonSnapshot | PathSnapshot | CellRefSnapshot | TextSnapshot;

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
