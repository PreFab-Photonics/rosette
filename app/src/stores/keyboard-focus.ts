import { create } from "zustand";

/**
 * Keyboard focus layer management.
 *
 * Tracks which UI component currently owns keyboard input.
 * Uses a stack to support nested layers (e.g., modal over palette).
 *
 * When any layer is active, canvas keyboard shortcuts are disabled
 * to prevent conflicts (e.g., typing "v" in search triggering select tool).
 */
interface KeyboardFocusState {
  /** Stack of active keyboard layers (most recent at end). */
  stack: string[];

  /** Claim keyboard focus for a layer. Idempotent - no-op if already claimed. */
  claim: (layer: string) => void;

  /** Release keyboard focus for a layer. Safe to call even if not claimed. */
  release: (layer: string) => void;

  /** Check if canvas shortcuts should be active (no layers claiming focus). */
  isCanvasActive: () => boolean;
}

export const useKeyboardFocusStore = create<KeyboardFocusState>()((set, get) => ({
  stack: [],

  claim: (layer) =>
    set((state) => ({
      stack: state.stack.includes(layer)
        ? state.stack // Already claimed, no-op
        : [...state.stack, layer],
    })),

  release: (layer) =>
    set((state) => ({
      stack: state.stack.filter((l) => l !== layer),
    })),

  isCanvasActive: () => get().stack.length === 0,
}));
