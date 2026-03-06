import { create } from "zustand";

/**
 * Command palette state.
 */
interface CommandPaletteState {
  /** Whether the command palette is open. */
  isOpen: boolean;
  /** Optional initial search text to pre-fill when opening. */
  initialSearch: string;

  /** Open the command palette, optionally with pre-filled search text. */
  open: (initialSearch?: string) => void;
  /** Close the command palette. */
  close: () => void;
  /** Toggle the command palette. */
  toggle: () => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>()((set) => ({
  isOpen: false,
  initialSearch: "",

  open: (initialSearch?: string) => set({ isOpen: true, initialSearch: initialSearch ?? "" }),
  close: () => set({ isOpen: false, initialSearch: "" }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen, initialSearch: "" })),
}));
