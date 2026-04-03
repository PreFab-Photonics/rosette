import { create } from "zustand";
import { GRID_SIZE } from "@/stores/viewport";

/**
 * Default waveguide width: 100 nm (0.1 µm) in world units.
 */
export const DEFAULT_PATH_WIDTH = 100 * GRID_SIZE;

/**
 * Default number of arc points for corner rounding.
 */
export const DEFAULT_NUM_ARC_POINTS = 64;

/**
 * Path metadata stored alongside the WASM element.
 *
 * The WASM element is a polygon generated from the centerline + width.
 * We track the original parameters here so the path can be re-edited
 * (e.g., changing width or corner radius regenerates the polygon).
 */
export interface PathMetadata {
  /** Original waypoint positions in world coordinates. */
  waypoints: { x: number; y: number }[];
  /** Waveguide width in world units. */
  width: number;
  /** Corner radius in world units (0 = sharp corners). */
  cornerRadius: number;
  /** Number of arc points for corner rounding (higher = smoother). */
  numArcPoints: number;
  /** GDS layer number. */
  layer: number;
  /** GDS datatype. */
  datatype: number;
}

/**
 * Path tool state for managing waveguide drawing defaults
 * and path metadata for created paths.
 */
interface PathState {
  /** Default waveguide width for new paths (world units). */
  width: number;
  /** Default corner radius for new paths (world units). 0 = sharp corners. */
  cornerRadius: number;
  /** Default number of arc points for corner rounding. */
  numArcPoints: number;

  /** Set the default waveguide width. */
  setWidth: (width: number) => void;
  /** Set the default corner radius. */
  setCornerRadius: (cornerRadius: number) => void;
  /** Set the default number of arc points. */
  setNumArcPoints: (numArcPoints: number) => void;

  /** Path metadata keyed by element UUID. */
  pathMetadata: Map<string, PathMetadata>;
  /** Store path metadata for an element. */
  setPathMetadata: (id: string, metadata: PathMetadata) => void;
  /** Remove path metadata (e.g., on undo). */
  removePathMetadata: (id: string) => void;
}

export const usePathStore = create<PathState>((set, get) => ({
  width: DEFAULT_PATH_WIDTH,
  cornerRadius: 0,
  numArcPoints: DEFAULT_NUM_ARC_POINTS,

  setWidth: (width) => set({ width }),
  setCornerRadius: (cornerRadius) => set({ cornerRadius }),
  setNumArcPoints: (numArcPoints) => set({ numArcPoints }),

  pathMetadata: new Map(),

  setPathMetadata: (id, metadata) => {
    const next = new Map(get().pathMetadata);
    next.set(id, metadata);
    set({ pathMetadata: next });
  },

  removePathMetadata: (id) => {
    const next = new Map(get().pathMetadata);
    next.delete(id);
    set({ pathMetadata: next });
  },
}));
