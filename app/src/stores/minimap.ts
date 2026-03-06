import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Minimap UI state.
 *
 * Tracks whether the minimap is minimized (collapsed to a small icon)
 * or expanded (showing the full overview with shapes and viewport rect).
 */
interface MinimapState {
  /** Whether the minimap is collapsed to a small icon. */
  isMinimized: boolean;
  /** Toggle between minimized and expanded states. */
  toggle: () => void;
}

export const useMinimapStore = create<MinimapState>()(
  persist(
    (set) => ({
      isMinimized: true,
      toggle: () => set((s) => ({ isMinimized: !s.isMinimized })),
    }),
    {
      name: "rosette-minimap",
      partialize: (state) => ({ isMinimized: state.isMinimized }),
    },
  ),
);
