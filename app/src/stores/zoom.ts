import { create } from "zustand";

/**
 * Zoom marquee box in screen coordinates.
 * Origin is the initial click point; width/height can be negative.
 */
export interface ZoomBox {
  /** X coordinate of initial click (screen pixels). */
  x: number;
  /** Y coordinate of initial click (screen pixels). */
  y: number;
  /** Width from origin (can be negative). */
  width: number;
  /** Height from origin (can be negative). */
  height: number;
}

/**
 * Zoom tool state for managing the marquee selection box.
 */
interface ZoomState {
  /** Current zoom marquee box (null when not drawing). */
  box: ZoomBox | null;
  /** Whether the user is currently drawing a zoom box. */
  isDrawing: boolean;

  /** Start drawing a zoom box at the given screen position. */
  startDrawing: (x: number, y: number) => void;
  /** Update the zoom box dimensions during drag. */
  updateBox: (mouseX: number, mouseY: number) => void;
  /** Stop drawing and clear the box. */
  stopDrawing: () => void;
  /** Reset all state. */
  reset: () => void;
}

export const useZoomStore = create<ZoomState>((set, get) => ({
  box: null,
  isDrawing: false,

  startDrawing: (x, y) =>
    set({
      box: { x, y, width: 0, height: 0 },
      isDrawing: true,
    }),

  updateBox: (mouseX, mouseY) => {
    const state = get();
    if (!state.box || !state.isDrawing) return;

    set({
      box: {
        ...state.box,
        width: mouseX - state.box.x,
        height: mouseY - state.box.y,
      },
    });
  },

  stopDrawing: () =>
    set({
      isDrawing: false,
    }),

  reset: () =>
    set({
      box: null,
      isDrawing: false,
    }),
}));
