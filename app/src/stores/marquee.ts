import { create } from "zustand";

/**
 * Marquee selection box in screen coordinates.
 * Origin is the initial click point; width/height can be negative.
 */
export interface MarqueeBox {
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
 * Marquee selection state for managing the drag-to-select box.
 */
interface MarqueeState {
  /** Current marquee box (null when not drawing). */
  box: MarqueeBox | null;
  /** Whether the user is currently drawing a marquee. */
  isDrawing: boolean;
  /** Element IDs currently under the marquee box (preview of what will be selected). */
  previewIds: Set<string>;

  /** Start drawing a marquee at the given screen position. */
  startDrawing: (x: number, y: number) => void;
  /** Update the marquee box dimensions during drag. */
  updateBox: (mouseX: number, mouseY: number) => void;
  /** Set the preview element IDs under the marquee. */
  setPreviewIds: (ids: string[]) => void;
  /** Reset all state. */
  reset: () => void;
}

export const useMarqueeStore = create<MarqueeState>((set, get) => ({
  box: null,
  isDrawing: false,
  previewIds: new Set(),

  startDrawing: (x, y) =>
    set({
      box: { x, y, width: 0, height: 0 },
      isDrawing: true,
      previewIds: new Set(),
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

  setPreviewIds: (ids) =>
    set({
      previewIds: new Set(ids),
    }),

  reset: () =>
    set({
      box: null,
      isDrawing: false,
      previewIds: new Set(),
    }),
}));
