import { create } from "zustand";

/**
 * Selection state for managing selected and hovered shapes.
 */
interface SelectionState {
  /** Currently selected element IDs. */
  selectedIds: Set<string>;
  /** Currently hovered element ID. */
  hoveredId: string | null;
  /** Last selected element ID (for Tab cycling reference). */
  lastSelectedId: string | null;

  /** Select a single element (clears previous selection). */
  select: (id: string) => void;
  /** Add element to selection (Shift+click). */
  addToSelection: (id: string) => void;
  /** Toggle element in selection (Ctrl/Cmd+click). */
  toggleSelection: (id: string) => void;
  /** Remove element from selection. */
  deselect: (id: string) => void;
  /** Remove element from selection (alias for deselect). */
  removeFromSelection: (id: string) => void;
  /** Clear all selection. */
  clearSelection: () => void;
  /** Select all provided elements. */
  selectAll: (ids: string[]) => void;
  /** Set selection to specific set of IDs. */
  setSelection: (ids: Set<string>) => void;
  /** Set hovered element. */
  setHover: (id: string | null) => void;
  /** Select the next element in a list (Tab cycling). */
  selectNext: (allIds: string[]) => void;
  /** Select the previous element in a list (Shift+Tab cycling). */
  selectPrevious: (allIds: string[]) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedIds: new Set(),
  hoveredId: null,
  lastSelectedId: null,

  select: (id) => set({ selectedIds: new Set([id]), lastSelectedId: id }),

  addToSelection: (id) =>
    set((state) => ({
      selectedIds: new Set([...state.selectedIds, id]),
      lastSelectedId: id,
    })),

  toggleSelection: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedIds);
      if (newSet.has(id)) {
        newSet.delete(id);
        // If we removed the last selected, update lastSelectedId to another selected item or null
        const newLastSelected =
          state.lastSelectedId === id
            ? newSet.size > 0
              ? [...newSet][newSet.size - 1]
              : null
            : state.lastSelectedId;
        return { selectedIds: newSet, lastSelectedId: newLastSelected };
      } else {
        newSet.add(id);
        return { selectedIds: newSet, lastSelectedId: id };
      }
    }),

  deselect: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedIds);
      newSet.delete(id);
      const newLastSelected =
        state.lastSelectedId === id
          ? newSet.size > 0
            ? [...newSet][newSet.size - 1]
            : null
          : state.lastSelectedId;
      return { selectedIds: newSet, lastSelectedId: newLastSelected };
    }),

  removeFromSelection: (id) => useSelectionStore.getState().deselect(id),

  clearSelection: () => set({ selectedIds: new Set(), lastSelectedId: null }),

  selectAll: (ids) =>
    set({
      selectedIds: new Set(ids),
      lastSelectedId: ids.length > 0 ? ids[ids.length - 1] : null,
    }),

  setSelection: (ids) =>
    set({
      selectedIds: ids,
      lastSelectedId: ids.size > 0 ? [...ids][ids.size - 1] : null,
    }),

  setHover: (id) => set({ hoveredId: id }),

  selectNext: (allIds) =>
    set((state) => {
      if (allIds.length === 0) return state;

      // If nothing selected, select the first element
      if (state.selectedIds.size === 0) {
        return { selectedIds: new Set([allIds[0]]), lastSelectedId: allIds[0] };
      }

      // Find the index of the last selected element
      const refId = state.lastSelectedId ?? [...state.selectedIds][0];
      const currentIndex = allIds.indexOf(refId);

      // If not found in list, select the first element
      if (currentIndex === -1) {
        return { selectedIds: new Set([allIds[0]]), lastSelectedId: allIds[0] };
      }

      // Select the next element (wrap around)
      const nextIndex = (currentIndex + 1) % allIds.length;
      const nextId = allIds[nextIndex];
      return { selectedIds: new Set([nextId]), lastSelectedId: nextId };
    }),

  selectPrevious: (allIds) =>
    set((state) => {
      if (allIds.length === 0) return state;

      // If nothing selected, select the last element
      if (state.selectedIds.size === 0) {
        const lastId = allIds[allIds.length - 1];
        return { selectedIds: new Set([lastId]), lastSelectedId: lastId };
      }

      // Find the index of the last selected element
      const refId = state.lastSelectedId ?? [...state.selectedIds][0];
      const currentIndex = allIds.indexOf(refId);

      // If not found in list, select the last element
      if (currentIndex === -1) {
        const lastId = allIds[allIds.length - 1];
        return { selectedIds: new Set([lastId]), lastSelectedId: lastId };
      }

      // Select the previous element (wrap around)
      const prevIndex = (currentIndex - 1 + allIds.length) % allIds.length;
      const prevId = allIds[prevIndex];
      return { selectedIds: new Set([prevId]), lastSelectedId: prevId };
    }),
}));
