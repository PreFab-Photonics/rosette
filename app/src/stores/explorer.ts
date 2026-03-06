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

  /** Set the project name. */
  setProjectName: (name: string) => void;
  /** Replace the cell list (called when a design loads or updates). */
  setCells: (cells: string[]) => void;
  /** Set the cell hierarchy tree roots. */
  setCellTree: (roots: CellNode[]) => void;
  /** Toggle a tree node's expanded/collapsed state. */
  toggleExpanded: (name: string) => void;
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
          // Auto-expand all parent nodes on first load
          const expandedCells =
            state.expandedCells.size === 0
              ? new Set(roots.flatMap(collectParentNames))
              : state.expandedCells;
          const activeCell =
            state.activeCell && cells.includes(state.activeCell)
              ? state.activeCell
              : (cells[0] ?? null);
          return { cellTree: roots, cells, expandedCells, activeCell, cellsLoaded: true };
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
      setActiveCell: (name) => set({ activeCell: name }),
      setEditingCellName: (name) => set({ editingCellName: name }),
      renameCell: (oldName, newName) =>
        set((state) => {
          const cells = state.cells.map((c) => (c === oldName ? newName : c));
          const activeCell = state.activeCell === oldName ? newName : state.activeCell;
          return { cells, activeCell };
        }),
      removeCell: (name) =>
        set((state) => {
          const cells = state.cells.filter((c) => c !== name);
          const activeCell = state.activeCell === name ? (cells[0] ?? null) : state.activeCell;
          return { cells, activeCell };
        }),
      addCell: (name) =>
        set((state) => {
          if (state.cells.includes(name)) return state;
          return { cells: [...state.cells, name] };
        }),
    }),
    {
      name: "rosette-explorer",
      partialize: (state) => ({ projectName: state.projectName }),
    },
  ),
);
