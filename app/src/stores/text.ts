import { create } from "zustand";
import type { ActiveText } from "@/lib/text";

/**
 * Text tool state for managing inline text editing.
 */
interface TextState {
  /** The text currently being edited, or null when not editing. */
  activeText: ActiveText | null;
  /** Cursor blink toggle (flips every TEXT_CURSOR_BLINK_MS). */
  showCursor: boolean;
  /** True while inline text editing is active (suppresses other shortcuts). */
  isEditingText: boolean;

  /** Begin editing a new text at the given world position. */
  startEditing: (x: number, y: number) => void;
  /** Update the active text state (cursor moves, content changes, etc.). */
  setActiveText: (activeText: ActiveText) => void;
  /** Clear the active text and stop editing. */
  stopEditing: () => void;
  /** Toggle cursor visibility (called by blink interval). */
  toggleCursor: () => void;
  /** Reset cursor to visible (called on each keystroke). */
  resetCursor: () => void;
}

export const useTextStore = create<TextState>((set) => ({
  activeText: null,
  showCursor: true,
  isEditingText: false,

  startEditing: (x, y) =>
    set({
      activeText: {
        x,
        y,
        content: "",
        cursorPosition: { line: 0, column: 0 },
      },
      showCursor: true,
      isEditingText: true,
    }),

  setActiveText: (activeText) => set({ activeText, showCursor: true }),

  stopEditing: () =>
    set({
      activeText: null,
      showCursor: true,
      isEditingText: false,
    }),

  toggleCursor: () => set((s) => ({ showCursor: !s.showCursor })),

  resetCursor: () => set({ showCursor: true }),
}));
