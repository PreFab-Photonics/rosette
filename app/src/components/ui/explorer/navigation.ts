import type { CellNode, CellListMode, FocusedItem } from "@/stores/explorer";

/**
 * Flatten the cell tree into a visible-order list, respecting expanded state.
 *
 * Only descends into children of nodes that are in the `expandedCells` set.
 * Returns cell names in the order they appear visually in the Explorer.
 *
 * In flat mode (or when no tree exists), returns the flat `cells` array directly.
 */
export function getVisibleCells(
  cellTree: CellNode[] | null,
  cells: string[],
  expandedCells: Set<string>,
  cellListMode: CellListMode = "nested",
): string[] {
  if (cellListMode === "flat" || !cellTree) return cells;
  const result: string[] = [];
  function walk(nodes: CellNode[]) {
    for (const node of nodes) {
      result.push(node.name);
      if (node.children.length > 0 && expandedCells.has(node.name)) {
        walk(node.children);
      }
    }
  }
  walk(cellTree);
  return result;
}

/**
 * Find the parent cell name for a given cell name in the tree.
 * Returns null if the cell is a root or not found.
 */
export function findParentInTree(cellTree: CellNode[] | null, targetName: string): string | null {
  if (!cellTree) return null;
  function search(nodes: CellNode[], parent: string | null): string | null {
    for (const node of nodes) {
      if (node.name === targetName) return parent;
      const found = search(node.children, node.name);
      if (found !== null) return found;
    }
    return null;
  }
  return search(cellTree, null);
}

/**
 * Find a CellNode by name in the tree.
 */
export function findNodeInTree(cellTree: CellNode[] | null, name: string): CellNode | null {
  if (!cellTree) return null;
  function search(nodes: CellNode[]): CellNode | null {
    for (const node of nodes) {
      if (node.name === name) return node;
      const found = search(node.children);
      if (found) return found;
    }
    return null;
  }
  return search(cellTree);
}

/**
 * Build a unified list of focusable items: tabs (when 2+) followed by visible cells.
 * This determines the order for ArrowUp/ArrowDown navigation.
 */
export function getVisibleItems(
  tabs: Array<{ id: string }>,
  cellTree: CellNode[] | null,
  cells: string[],
  expandedCells: Set<string>,
  cellListMode: CellListMode = "nested",
): FocusedItem[] {
  const items: FocusedItem[] = [];
  // Include tabs only when 2+ are open (matches TabList render condition)
  if (tabs.length > 1) {
    for (const tab of tabs) {
      items.push({ type: "tab", id: tab.id });
    }
  }
  const visibleCells = getVisibleCells(cellTree, cells, expandedCells, cellListMode);
  for (const name of visibleCells) {
    items.push({ type: "cell", name });
  }
  return items;
}

/** Check if two FocusedItem values are equal. */
export function focusedItemEquals(a: FocusedItem | null, b: FocusedItem | null): boolean {
  if (a === null || b === null) return a === b;
  if (a.type !== b.type) return false;
  if (a.type === "tab" && b.type === "tab") return a.id === b.id;
  if (a.type === "cell" && b.type === "cell") return a.name === b.name;
  return false;
}

/** Find the index of a FocusedItem in a list. Returns -1 if not found. */
export function findItemIndex(items: FocusedItem[], target: FocusedItem | null): number {
  if (!target) return -1;
  return items.findIndex((item) => focusedItemEquals(item, target));
}
