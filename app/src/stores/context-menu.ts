import { create } from "zustand";

/**
 * Context menu variant determines which actions are shown.
 */
export type ContextMenuVariant = "canvas" | "element" | "ruler" | "layer" | "cell" | "image";

/**
 * Context menu state for right-click menus.
 */
interface ContextMenuState {
  /** Whether the context menu is open. */
  isOpen: boolean;
  /** Screen position where the menu should appear. */
  position: { x: number; y: number };
  /** Menu variant (canvas or element). */
  variant: ContextMenuVariant;
  /** Target element ID when right-clicking on an element. */
  targetId: string | null;

  /** Open the context menu at the given position. */
  open: (
    variant: ContextMenuVariant,
    position: { x: number; y: number },
    targetId?: string | null,
  ) => void;

  /** Close the context menu. */
  close: () => void;
}

/**
 * Zustand store for context menu state.
 *
 * Manages the visibility, position, and target of the right-click context menu.
 */
export const useContextMenuStore = create<ContextMenuState>((set) => ({
  isOpen: false,
  position: { x: 0, y: 0 },
  variant: "canvas",
  targetId: null,

  open: (variant, position, targetId = null) =>
    set({
      isOpen: true,
      position,
      variant,
      targetId,
    }),

  close: () =>
    set({
      isOpen: false,
    }),
}));
