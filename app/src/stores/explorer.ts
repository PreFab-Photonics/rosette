import { create } from "zustand";
import { persist } from "zustand/middleware";

// =============================================================================
// Types
// =============================================================================

declare const cellOccurrenceIdBrand: unique symbol;

/** Stable identity for one displayed occurrence in the cell hierarchy. */
export type CellOccurrenceId = string & { readonly [cellOccurrenceIdBrand]: true };

/** Raw hierarchy node received from WASM or the design server. */
export interface RawCellNode {
  name: string;
  children: RawCellNode[];
}

/** Normalized hierarchy node used by the Explorer UI. */
export interface CellNode {
  occurrenceId: CellOccurrenceId;
  name: string;
  children: CellNode[];
}

/** Item currently highlighted by the keyboard cursor in the Explorer. */
export type FocusedItem =
  | { type: "tab"; id: string }
  | { type: "cell"; occurrenceId: CellOccurrenceId; name: string };

/** How the cell list is displayed in the Explorer panel. */
export type CellListMode = "nested" | "flat";

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
  /** Set of hierarchy occurrences whose children are expanded. */
  expandedCells: Set<CellOccurrenceId>;
  /** Whether initial hierarchy expansion has been established for this document. */
  expansionInitialized: boolean;
  /** Whether this document has ever contained an expandable hierarchy node. */
  hasSeenHierarchy: boolean;
  /** Currently selected cell name, or null. */
  activeCell: string | null;
  /** Cell name currently being edited inline (for rename), or null. */
  editingCellName: string | null;
  /** Exact cell occurrence currently being edited inline, or null. */
  editingCellOccurrenceId: CellOccurrenceId | null;
  /** True once `setCells` has been called at least once (WASM/design loaded). */
  cellsLoaded: boolean;
  /** Maximum rendering depth for the hierarchy tree (1 = roots only). */
  hierarchyLevelLimit: number;
  /** Deepest nesting level in the current cellTree (0 when no tree). */
  maxTreeDepth: number;
  /** Set of cell names whose internal geometry is hidden. */
  hiddenCells: Set<string>;
  /** Whether the cell list is shown as a flat alphabetical list or a nested tree. */
  cellListMode: CellListMode;

  /** Whether the Explorer panel has keyboard focus for arrow-key navigation. */
  isFocused: boolean;
  /** The item currently highlighted by the keyboard cursor (tab or cell). */
  focusedItem: FocusedItem | null;

  /** Set the project name. */
  setProjectName: (name: string) => void;
  /** Replace the cell list (called when a design loads or updates). */
  setCells: (cells: string[]) => void;
  /** Set the cell hierarchy tree roots. */
  setCellTree: (roots: RawCellNode[], options?: { resetExpansion?: boolean }) => void;
  /** Toggle a tree node's expanded/collapsed state. */
  toggleExpanded: (occurrenceId: CellOccurrenceId) => void;
  /** Set the maximum hierarchy rendering depth. */
  setHierarchyLevelLimit: (limit: number) => void;
  /** Select a cell by name. */
  setActiveCell: (name: string | null) => void;
  /** Set the cell name that should enter inline edit mode. */
  setEditingCellName: (name: string | null) => void;
  /** Set the exact cell occurrence that should enter inline edit mode. */
  setEditingCell: (occurrenceId: CellOccurrenceId, name: string) => void;
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
  /** Set the cell list display mode (flat or nested). */
  setCellListMode: (mode: CellListMode) => void;
  /** Set keyboard focus state for the Explorer panel. */
  setFocused: (focused: boolean) => void;
  /** Set the keyboard-cursor item (tab or cell). */
  setFocusedItem: (item: FocusedItem | null) => void;
}

/** Encode a complete cell-name path without separator collisions. */
export function cellOccurrenceId(path: readonly string[]): CellOccurrenceId {
  return JSON.stringify(path) as CellOccurrenceId;
}

/** Decode an internally generated occurrence ID. */
export function cellOccurrencePath(occurrenceId: CellOccurrenceId): string[] {
  return JSON.parse(occurrenceId) as string[];
}

/** Remap every path segment affected by a globally unique cell rename. */
export function remapCellOccurrenceId(
  occurrenceId: CellOccurrenceId,
  oldName: string,
  newName: string,
): CellOccurrenceId {
  return cellOccurrenceId(
    cellOccurrencePath(occurrenceId).map((segment) => (segment === oldName ? newName : segment)),
  );
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

/** Collect occurrence IDs of nodes that have children. */
function collectParentIds(node: CellNode): CellOccurrenceId[] {
  const ids: CellOccurrenceId[] = [];
  if (node.children.length > 0) {
    ids.push(node.occurrenceId);
    for (const child of node.children) {
      ids.push(...collectParentIds(child));
    }
  }
  return ids;
}

function hasExpandableNodes(nodes: readonly CellNode[] | null): boolean {
  if (!nodes) return false;
  return nodes.some((node) => node.children.length > 0 || hasExpandableNodes(node.children));
}

/** Sort and add deterministic occurrence identities at every hierarchy level. */
function normalizeCellTree(nodes: RawCellNode[], parentPath: readonly string[] = []): CellNode[] {
  return [...nodes]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((node) => {
      const path = [...parentPath, node.name];
      return {
        occurrenceId: cellOccurrenceId(path),
        name: node.name,
        children: normalizeCellTree(node.children, path),
      };
    });
}

function findFirstOccurrence(
  nodes: readonly CellNode[] | null,
  name: string,
): CellOccurrenceId | null {
  if (!nodes) return null;
  for (const node of nodes) {
    if (node.name === name) return node.occurrenceId;
    const child = findFirstOccurrence(node.children, name);
    if (child) return child;
  }
  return null;
}

function collectOccurrenceIds(nodes: readonly CellNode[]): Set<CellOccurrenceId> {
  const ids = new Set<CellOccurrenceId>();
  for (const node of nodes) {
    ids.add(node.occurrenceId);
    for (const childId of collectOccurrenceIds(node.children)) ids.add(childId);
  }
  return ids;
}

function renameCellTree(nodes: readonly CellNode[], oldName: string, newName: string): CellNode[] {
  return nodes.map((node) => ({
    occurrenceId: remapCellOccurrenceId(node.occurrenceId, oldName, newName),
    name: node.name === oldName ? newName : node.name,
    children: renameCellTree(node.children, oldName, newName),
  }));
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
      expandedCells: new Set<CellOccurrenceId>(),
      expansionInitialized: false,
      hasSeenHierarchy: false,
      activeCell: null,
      editingCellName: null,
      editingCellOccurrenceId: null,
      cellsLoaded: false,
      hierarchyLevelLimit: Infinity,
      maxTreeDepth: 0,
      hiddenCells: new Set<string>(),
      cellListMode: "nested" as CellListMode,
      isFocused: false,
      focusedItem: null,

      setProjectName: (name) => set({ projectName: name }),
      setCells: (cells) =>
        set((state) => {
          const sorted = [...cells].sort((a, b) => a.localeCompare(b));
          // Keep activeCell if it still exists in the new list, otherwise select first cell
          const activeCell =
            state.activeCell && sorted.includes(state.activeCell)
              ? state.activeCell
              : (sorted[0] ?? null);
          return {
            cells: sorted,
            cellTree: null,
            expandedCells: new Set<CellOccurrenceId>(),
            expansionInitialized: false,
            hasSeenHierarchy: false,
            activeCell,
            cellsLoaded: true,
            maxTreeDepth: 0,
          };
        }),
      setCellTree: (roots, options) =>
        set((state) => {
          const sorted = normalizeCellTree(roots);
          const cells = flattenRoots(sorted);
          const maxTreeDepth = computeMaxDepth(sorted);
          const resetExpansion = options?.resetExpansion === true;
          const hasHierarchy = hasExpandableNodes(sorted);
          const expandedCells =
            !state.expansionInitialized ||
            resetExpansion ||
            (!state.hasSeenHierarchy && hasHierarchy)
              ? new Set(sorted.flatMap(collectParentIds))
              : state.expandedCells;
          const activeCell =
            state.activeCell && cells.includes(state.activeCell)
              ? state.activeCell
              : (cells[0] ?? null);
          const occurrenceIds = collectOccurrenceIds(sorted);
          let focusedItem = state.focusedItem;
          if (focusedItem?.type === "cell" && !occurrenceIds.has(focusedItem.occurrenceId)) {
            const fallback = findFirstOccurrence(sorted, focusedItem.name);
            focusedItem = fallback
              ? { type: "cell", occurrenceId: fallback, name: focusedItem.name }
              : null;
          }
          const editingCellOccurrenceId =
            state.editingCellOccurrenceId && occurrenceIds.has(state.editingCellOccurrenceId)
              ? state.editingCellOccurrenceId
              : null;
          return {
            cellTree: sorted,
            cells,
            expandedCells,
            expansionInitialized: true,
            hasSeenHierarchy: resetExpansion
              ? hasHierarchy
              : state.hasSeenHierarchy || hasHierarchy,
            activeCell,
            focusedItem,
            editingCellName: editingCellOccurrenceId ? state.editingCellName : null,
            editingCellOccurrenceId,
            maxTreeDepth,
            cellsLoaded: true,
          };
        }),
      toggleExpanded: (occurrenceId) =>
        set((state) => {
          const next = new Set(state.expandedCells);
          if (next.has(occurrenceId)) {
            next.delete(occurrenceId);
          } else {
            next.add(occurrenceId);
          }
          return { expandedCells: next };
        }),
      setHierarchyLevelLimit: (limit) => set({ hierarchyLevelLimit: limit }),
      setActiveCell: (name) => set({ activeCell: name }),
      setEditingCellName: (name) =>
        set((state) => {
          if (name === null) return { editingCellName: null, editingCellOccurrenceId: null };
          const focusedOccurrence =
            state.focusedItem?.type === "cell" && state.focusedItem.name === name
              ? state.focusedItem.occurrenceId
              : null;
          const occurrenceId =
            focusedOccurrence ??
            (state.cellListMode === "nested"
              ? (findFirstOccurrence(state.cellTree, name) ?? cellOccurrenceId([name]))
              : cellOccurrenceId([name]));
          return { editingCellName: name, editingCellOccurrenceId: occurrenceId };
        }),
      setEditingCell: (occurrenceId, name) =>
        set({ editingCellName: name, editingCellOccurrenceId: occurrenceId }),
      renameCell: (oldName, newName) =>
        set((state) => {
          const cells = state.cells
            .map((c) => (c === oldName ? newName : c))
            .sort((a, b) => a.localeCompare(b));
          const activeCell = state.activeCell === oldName ? newName : state.activeCell;
          const focusedItem =
            state.focusedItem?.type === "cell"
              ? {
                  type: "cell" as const,
                  occurrenceId: remapCellOccurrenceId(
                    state.focusedItem.occurrenceId,
                    oldName,
                    newName,
                  ),
                  name: state.focusedItem.name === oldName ? newName : state.focusedItem.name,
                }
              : state.focusedItem;
          const expandedCells = new Set(
            [...state.expandedCells].map((id) => remapCellOccurrenceId(id, oldName, newName)),
          );
          const editingCellOccurrenceId = state.editingCellOccurrenceId
            ? remapCellOccurrenceId(state.editingCellOccurrenceId, oldName, newName)
            : null;
          const hiddenCells = new Set(state.hiddenCells);
          if (hiddenCells.has(oldName)) {
            hiddenCells.delete(oldName);
            hiddenCells.add(newName);
          }
          return {
            cells,
            cellTree: state.cellTree ? renameCellTree(state.cellTree, oldName, newName) : null,
            expandedCells,
            activeCell,
            focusedItem,
            editingCellName: state.editingCellName === oldName ? newName : state.editingCellName,
            editingCellOccurrenceId,
            hiddenCells,
          };
        }),
      removeCell: (name) =>
        set((state) => {
          const cells = state.cells.filter((c) => c !== name);
          const activeCell = state.activeCell === name ? (cells[0] ?? null) : state.activeCell;
          const focusedItem =
            state.focusedItem?.type === "cell" && state.focusedItem.name === name
              ? null
              : state.focusedItem;
          const hiddenCells = new Set(state.hiddenCells);
          hiddenCells.delete(name);
          return {
            cells,
            activeCell,
            focusedItem,
            editingCellName: state.editingCellName === name ? null : state.editingCellName,
            editingCellOccurrenceId:
              state.editingCellName === name ? null : state.editingCellOccurrenceId,
            hiddenCells,
          };
        }),
      addCell: (name) =>
        set((state) => {
          if (state.cells.includes(name)) return state;
          const cells = [...state.cells, name].sort((a, b) => a.localeCompare(b));
          return { cells };
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
      setCellListMode: (mode) =>
        set((state) => {
          if (state.focusedItem?.type !== "cell") return { cellListMode: mode };
          const occurrenceId =
            mode === "flat"
              ? cellOccurrenceId([state.focusedItem.name])
              : findFirstOccurrence(state.cellTree, state.focusedItem.name);
          return {
            cellListMode: mode,
            focusedItem: occurrenceId ? { ...state.focusedItem, occurrenceId } : state.focusedItem,
          };
        }),
      setFocused: (focused) =>
        set((state) => {
          if (focused) {
            if (state.isFocused && state.focusedItem) return state;
            // When focusing, initialize cursor to activeCell or first cell
            const cellName = state.activeCell ?? state.cells[0] ?? null;
            const occurrenceId = cellName
              ? state.cellListMode === "nested"
                ? findFirstOccurrence(state.cellTree, cellName)
                : cellOccurrenceId([cellName])
              : null;
            const focusedItem: FocusedItem | null =
              cellName && occurrenceId ? { type: "cell", occurrenceId, name: cellName } : null;
            return { isFocused: true, focusedItem };
          }
          return { isFocused: false, focusedItem: null };
        }),
      setFocusedItem: (item) => set({ focusedItem: item }),
    }),
    {
      name: "rosette-explorer",
      partialize: (state) => ({
        projectName: state.projectName,
        cellListMode: state.cellListMode,
      }),
    },
  ),
);

/**
 * Generate a unique cell name (`cell1`, `cell2`, ...) that doesn't
 * collide with any existing cell in the explorer store.
 */
export function generateUniqueCellName(): string {
  const existing = useExplorerStore.getState().cells;
  let n = 1;
  let name = `cell${n}`;
  while (existing.includes(name)) {
    n++;
    name = `cell${n}`;
  }
  return name;
}

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
