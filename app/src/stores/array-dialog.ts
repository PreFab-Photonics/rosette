import { create } from "zustand";

/**
 * State for the "Create Array" dialog.
 *
 * Opened from the context menu or command palette when elements are selected.
 * The dialog collects array parameters (columns, rows, spacing) and then
 * executes a CreateArrayCommand to duplicate the selected elements in a grid.
 */
interface ArrayDialogState {
  /** Whether the dialog is open. */
  isOpen: boolean;
  /** IDs of the elements to array. */
  elementIds: string[];

  /** Open the dialog for the given element IDs. */
  open: (elementIds: string[]) => void;
  /** Close the dialog. */
  close: () => void;
}

export const useArrayDialogStore = create<ArrayDialogState>()((set) => ({
  isOpen: false,
  elementIds: [],

  open: (elementIds: string[]) => set({ isOpen: true, elementIds }),
  close: () => set({ isOpen: false, elementIds: [] }),
}));
