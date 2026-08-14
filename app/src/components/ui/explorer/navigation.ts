import {
  cellOccurrenceId,
  type CellListMode,
  type CellNode,
  type CellOccurrenceId,
  type FocusedItem,
} from "@/stores/explorer";

export type ExplorerRow =
  | { type: "tab"; id: string }
  | {
      type: "cell";
      occurrenceId: CellOccurrenceId;
      name: string;
      depth: number;
      parentOccurrenceId: CellOccurrenceId | null;
      hasChildren: boolean;
      isExpanded: boolean;
      posInSet: number;
      setSize: number;
    };

interface ProjectExplorerRowsOptions {
  tabs: readonly { id: string }[];
  cellTree: readonly CellNode[] | null;
  cells: readonly string[];
  expandedCells: ReadonlySet<CellOccurrenceId>;
  cellListMode: CellListMode;
}

/** Build the authoritative visible row order for tabs and cells. */
export function projectExplorerRows({
  tabs,
  cellTree,
  cells,
  expandedCells,
  cellListMode,
}: ProjectExplorerRowsOptions): ExplorerRow[] {
  const rows: ExplorerRow[] = [];
  if (tabs.length > 1) {
    for (const tab of tabs) rows.push({ type: "tab", id: tab.id });
  }

  if (cellListMode === "flat" || !cellTree) {
    for (const [index, name] of cells.entries()) {
      rows.push({
        type: "cell",
        occurrenceId: cellOccurrenceId([name]),
        name,
        depth: 0,
        parentOccurrenceId: null,
        hasChildren: false,
        isExpanded: false,
        posInSet: index + 1,
        setSize: cells.length,
      });
    }
    return rows;
  }

  const walk = (
    nodes: readonly CellNode[],
    depth: number,
    parentOccurrenceId: CellOccurrenceId | null,
  ) => {
    for (const [index, node] of nodes.entries()) {
      const hasChildren = node.children.length > 0;
      const isExpanded = hasChildren && expandedCells.has(node.occurrenceId);
      rows.push({
        type: "cell",
        occurrenceId: node.occurrenceId,
        name: node.name,
        depth,
        parentOccurrenceId,
        hasChildren,
        isExpanded,
        posInSet: index + 1,
        setSize: nodes.length,
      });
      if (isExpanded) walk(node.children, depth + 1, node.occurrenceId);
    }
  };
  walk(cellTree, 0, null);
  return rows;
}

export function focusedItemForRow(row: ExplorerRow): FocusedItem {
  return row.type === "tab"
    ? row
    : {
        type: "cell",
        occurrenceId: row.occurrenceId,
        name: row.name,
      };
}

/** Check if two focused items identify the same displayed row. */
export function focusedItemEquals(a: FocusedItem | null, b: FocusedItem | null): boolean {
  if (a === null || b === null) return a === b;
  if (a.type !== b.type) return false;
  if (a.type === "tab" && b.type === "tab") return a.id === b.id;
  return a.type === "cell" && b.type === "cell" && a.occurrenceId === b.occurrenceId;
}

/** Find the focused item in a projected row list. */
export function findFocusedRowIndex(
  rows: readonly ExplorerRow[],
  target: FocusedItem | null,
): number {
  if (!target) return -1;
  return rows.findIndex((row) => focusedItemEquals(focusedItemForRow(row), target));
}

/** Find the next visible cell whose name starts with a type-ahead query. */
export function findTypeaheadRow(
  rows: readonly ExplorerRow[],
  currentIndex: number,
  query: string,
): ExplorerRow | null {
  if (!query || rows.length === 0) return null;
  const normalizedQuery = query.toLocaleLowerCase();
  for (let offset = 1; offset <= rows.length; offset++) {
    const index = (Math.max(currentIndex, -1) + offset) % rows.length;
    const row = rows[index];
    if (row.type === "cell" && row.name.toLocaleLowerCase().startsWith(normalizedQuery)) {
      return row;
    }
  }
  return null;
}
