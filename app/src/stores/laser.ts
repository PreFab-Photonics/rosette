import { create } from "zustand";

/**
 * Point in screen coordinates.
 */
export interface LaserPoint {
  x: number;
  y: number;
}

/**
 * Laser pointer state for trail rendering and fade animation.
 */
interface LaserState {
  /** Trail points in screen coordinates. */
  points: LaserPoint[];

  /** Current opacity (1.0 = fully visible, 0.0 = invisible). */
  opacity: number;

  /** Whether we're currently drawing (mouse is down). */
  isDrawing: boolean;

  /** Add a point to the trail. */
  addPoint: (point: LaserPoint) => void;

  /** Start drawing (mouse down). */
  startDrawing: () => void;

  /** Stop drawing (mouse up). */
  stopDrawing: () => void;

  /** Set opacity (for fade animation). */
  setOpacity: (opacity: number) => void;

  /** Clear all points and reset state. */
  reset: () => void;
}

/** Maximum number of raw points to keep in the trail (before smoothing). */
const MAX_POINTS = 500;

/** Minimum distance between points (in pixels) to avoid too many points. */
const MIN_POINT_DISTANCE = 1;

export const useLaserStore = create<LaserState>((set, get) => ({
  points: [],
  opacity: 1.0,
  isDrawing: false,

  addPoint: (point) => {
    const { points, isDrawing } = get();
    if (!isDrawing) return;

    // Check minimum distance from last point
    if (points.length > 0) {
      const last = points[points.length - 1];
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MIN_POINT_DISTANCE) return;
    }

    // Add point, keeping within max limit
    const newPoints = [...points, point];
    if (newPoints.length > MAX_POINTS) {
      newPoints.shift();
    }

    set({ points: newPoints });
  },

  startDrawing: () => {
    set({ isDrawing: true, points: [], opacity: 1.0 });
  },

  stopDrawing: () => {
    set({ isDrawing: false });
  },

  setOpacity: (opacity) => {
    set({ opacity: Math.max(0, Math.min(1, opacity)) });
  },

  reset: () => {
    set({ points: [], opacity: 1.0, isDrawing: false });
  },
}));
