import { create } from "zustand";

/**
 * State for the "Go to Coordinate" dialog.
 *
 * Opened from the command palette or Explorer View menu.
 * The dialog collects X/Y coordinates (in µm) and pans the viewport
 * to center on that world position.
 */
interface GoToDialogState {
  /** Whether the dialog is open. */
  isOpen: boolean;

  /** Open the dialog. */
  open: () => void;
  /** Close the dialog. */
  close: () => void;
}

export const useGoToDialogStore = create<GoToDialogState>()((set) => ({
  isOpen: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
