/**
 * Document state store for tracking unsaved changes.
 *
 * Tracks whether the current design has been modified since the last
 * save (or since creation). Used to gate destructive actions like
 * "New" and "Open" behind an unsaved-changes confirmation dialog.
 *
 * Automatically syncs dirty state to the active tab in the tabs store.
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

/**
 * Sync dirty state changes to the active tab.
 *
 * Uses a cached module reference so the first call resolves the dynamic
 * import and all subsequent calls are synchronous. This avoids the race
 * condition where Cmd+W immediately after an edit could miss the dirty
 * flag due to microtask delay.
 */
let tabsModule: typeof import("@/stores/tabs") | null = null;

function syncDirtyToTab(isDirty: boolean): void {
  const update = (mod: typeof import("@/stores/tabs")) => {
    const activeTabId = mod.useTabsStore.getState().activeTabId;
    if (activeTabId) {
      mod.useTabsStore.getState().updateTab(activeTabId, { isDirty });
    }
  };

  if (tabsModule) {
    update(tabsModule);
  } else {
    import("@/stores/tabs").then((mod) => {
      tabsModule = mod;
      update(mod);
    });
  }
}

useDocumentStore.subscribe((state, prevState) => {
  if (state.isDirty !== prevState.isDirty) {
    syncDirtyToTab(state.isDirty);
  }
});
