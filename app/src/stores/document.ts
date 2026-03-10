/**
 * Document state store for tracking unsaved changes.
 *
 * Tracks whether the current design has been modified since the last
 * save (or since creation). Used to gate destructive actions like
 * "New" and "Open" behind an unsaved-changes confirmation dialog.
 */

import { create } from "zustand";

interface DocumentState {
  /** Whether the document has unsaved changes. */
  isDirty: boolean;

  /** Mark the document as having unsaved changes. */
  markDirty: () => void;

  /** Mark the document as clean (after save or new file). */
  markClean: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  isDirty: false,

  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
