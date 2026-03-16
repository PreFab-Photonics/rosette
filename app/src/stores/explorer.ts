import { create } from "zustand";
import { persist } from "zustand/middleware";

// =============================================================================
// Types
// =============================================================================

/** A node in the cell hierarchy tree. */
export interface CellNode {
  name: string;
  children: CellNode[];
}

/**
 * Explorer state for browsing cells in a design.
 *
 * Populated by the design server (SSE) or with a default "top" cell
 * in standalone mode. The Explorer panel reads from this store.
 */
interface ExplorerState {
  /** User-editable project name shown in the explorer header. */
  projectName: string;
  /** Flat list of cell names (for compatibility). First entry is the top cell. */
  cells: string[];
  /** Hierarchy tree roots (one per top-level cell). */
  cellTree: CellNode[] | null;
  /** Set of cell names whose tree nodes are expanded. */
  expandedCells: Set<string>;
  /** Currently selected cell name, or null. */
  activeCell: string | null;
  /** Cell name currently being edited inline (for rename), or null. */
  editingCellName: string | null;
  /** True once `setCells` has been called at least once (WASM/design loaded). */
  cellsLoaded: boolean;
  /** Maximum rendering depth for the hierarchy tree (1 = roots only). */
  hierarchyLevelLimit: number;
  /** Deepest nesting level in the current cellTree (0 when no tree). */
  maxTreeDepth: number;
  /** Set of cell names whose internal geometry is hidden. */
  hiddenCells: Set<string>;

  /** Set the project name. */
  setProjectName: (name: string) => void;
  /** Replace the cell list (called when a design loads or updates). */
  setCells: (cells: string[]) => void;
  /** Set the cell hierarchy tree roots. */
  setCellTree: (roots: CellNode[]) => void;
  /** Toggle a tree node's expanded/collapsed state. */
  toggleExpanded: (name: string) => void;
  /** Set the maximum hierarchy rendering depth. */
  setHierarchyLevelLimit: (limit: number) => void;
  /** Select a cell by name. */
  setActiveCell: (name: string | null) => void;
  /** Set the cell name that should enter inline edit mode. */
  setEditingCellName: (name: string | null) => void;
  /** Rename a cell in the local list. */
  renameCell: (oldName: string, newName: string) => void;
  /** Remove a cell from the local list. */
  removeCell: (name: string) => void;
  /** Add a cell to the local list. */
  addCell: (name: string) => void;
  /** Toggle visibility of a cell's internal geometry. */
  toggleCellVisibility: (name: string) => void;
  /** Show all cells (clear all hidden). */
  showAllCells: () => void;
  /** Hide all cells. */
  hideAllCells: () => void;
}

/** Collect all cell names from a single tree node into a flat list. */
function flattenNode(node: CellNode): string[] {
  const names: string[] = [node.name];
  for (const child of node.children) {
    names.push(...flattenNode(child));
  }
  return names;
}

/** Collect all unique cell names from a forest of tree roots. */
function flattenRoots(roots: CellNode[]): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const root of roots) {
    for (const name of flattenNode(root)) {
      if (!seen.has(name)) {
        seen.add(name);
        names.push(name);
      }
    }
  }
  return names;
}

/** Collect names of nodes that have children (for auto-expand). */
function collectParentNames(node: CellNode): string[] {
  const names: string[] = [];
  if (node.children.length > 0) {
    names.push(node.name);
    for (const child of node.children) {
      names.push(...collectParentNames(child));
    }
  }
  return names;
}

/** Compute the maximum nesting depth of a tree (1-indexed: a single root with no children = 1). */
function computeMaxDepth(roots: CellNode[]): number {
  function depth(node: CellNode): number {
    if (node.children.length === 0) return 1;
    let max = 0;
    for (const child of node.children) {
      max = Math.max(max, depth(child));
    }
    return 1 + max;
  }
  let max = 0;
  for (const root of roots) {
    max = Math.max(max, depth(root));
  }
  return max;
}

export const useExplorerStore = create<ExplorerState>()(
  persist(
    (set) => ({
      projectName: "untitled-project",
      cells: [],
      cellTree: null,
      expandedCells: new Set<string>(),
      activeCell: null,
      editingCellName: null,
      cellsLoaded: false,
      hierarchyLevelLimit: Infinity,
      maxTreeDepth: 0,
      hiddenCells: new Set<string>(),

      setProjectName: (name) => set({ projectName: name }),
      setCells: (cells) =>
        set((state) => {
          // Keep activeCell if it still exists in the new list, otherwise select top cell
          const activeCell =
            state.activeCell && cells.includes(state.activeCell)
              ? state.activeCell
              : (cells[0] ?? null);
          return { cells, activeCell, cellsLoaded: true };
        }),
      setCellTree: (roots) =>
        set((state) => {
          const cells = flattenRoots(roots);
          const maxTreeDepth = computeMaxDepth(roots);
          // Auto-expand all parent nodes on first load
          const expandedCells =
            state.expandedCells.size === 0
              ? new Set(roots.flatMap(collectParentNames))
              : state.expandedCells;
          const activeCell =
            state.activeCell && cells.includes(state.activeCell)
              ? state.activeCell
              : (cells[0] ?? null);
          return {
            cellTree: roots,
            cells,
            expandedCells,
            activeCell,
            maxTreeDepth,
            cellsLoaded: true,
          };
        }),
      toggleExpanded: (name) =>
        set((state) => {
          const next = new Set(state.expandedCells);
          if (next.has(name)) {
            next.delete(name);
          } else {
            next.add(name);
          }
          return { expandedCells: next };
        }),
      setHierarchyLevelLimit: (limit) => set({ hierarchyLevelLimit: limit }),
      setActiveCell: (name) => set({ activeCell: name }),
      setEditingCellName: (name) => set({ editingCellName: name }),
      renameCell: (oldName, newName) =>
        set((state) => {
          const cells = state.cells.map((c) => (c === oldName ? newName : c));
          const activeCell = state.activeCell === oldName ? newName : state.activeCell;
          const hiddenCells = new Set(state.hiddenCells);
          if (hiddenCells.has(oldName)) {
            hiddenCells.delete(oldName);
            hiddenCells.add(newName);
          }
          return { cells, activeCell, hiddenCells };
        }),
      removeCell: (name) =>
        set((state) => {
          const cells = state.cells.filter((c) => c !== name);
          const activeCell = state.activeCell === name ? (cells[0] ?? null) : state.activeCell;
          const hiddenCells = new Set(state.hiddenCells);
          hiddenCells.delete(name);
          return { cells, activeCell, hiddenCells };
        }),
      addCell: (name) =>
        set((state) => {
          if (state.cells.includes(name)) return state;
          return { cells: [...state.cells, name] };
        }),
      toggleCellVisibility: (name) =>
        set((state) => {
          const next = new Set(state.hiddenCells);
          if (next.has(name)) {
            next.delete(name);
          } else {
            next.add(name);
          }
          return { hiddenCells: next };
        }),
      showAllCells: () => set({ hiddenCells: new Set<string>() }),
      hideAllCells: () => set((state) => ({ hiddenCells: new Set(state.cells) })),
    }),
    {
      name: "rosette-explorer",
      partialize: (state) => ({ projectName: state.projectName }),
    },
  ),
);

/**
 * Sync project name changes to the active tab title.
 *
 * When the user renames the project in the Explorer header, update the
 * corresponding tab's display title to match (unless the tab has a file
 * path, in which case the filename is used instead).
 */
useExplorerStore.subscribe((state, prevState) => {
  if (state.projectName !== prevState.projectName) {
    import("@/stores/tabs").then(({ useTabsStore }) => {
      const { activeTabId, getActiveTab, updateTab } = useTabsStore.getState();
      if (!activeTabId) return;
      const tab = getActiveTab();
      // Only sync if the tab doesn't have a saved file path (file-based tabs use filename)
      if (tab && !tab.filePath) {
        updateTab(activeTabId, { title: state.projectName });
      }
    });
  }
});
