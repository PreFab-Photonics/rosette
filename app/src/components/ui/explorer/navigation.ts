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
      guideLevels: readonly number[];
    };

interface ProjectExplorerRowsOptions {
  tabs: readonly { id: string }[];
  cellTree: readonly CellNode[] | null;
  cells: readonly string[];
  expandedCells: ReadonlySet<CellOccurrenceId>;
  cellListMode: CellListMode;
  filterQuery?: string;
}

function filterCellTree(nodes: readonly CellNode[], normalizedQuery: string): CellNode[] {
  const filtered: CellNode[] = [];
  for (const node of nodes) {
    const children = filterCellTree(node.children, normalizedQuery);
    if (node.name.toLowerCase().includes(normalizedQuery) || children.length > 0) {
      filtered.push({ ...node, children });
    }
  }
  return filtered;
}

/** Build the authoritative visible row order for tabs and cells. */
export function projectExplorerRows({
  tabs,
  cellTree,
  cells,
  expandedCells,
  cellListMode,
  filterQuery = "",
}: ProjectExplorerRowsOptions): ExplorerRow[] {
  const rows: ExplorerRow[] = [];
  const normalizedQuery = filterQuery.trim().toLowerCase();
  const isFiltering = normalizedQuery.length > 0;
  if (tabs.length > 1) {
    for (const tab of tabs) rows.push({ type: "tab", id: tab.id });
  }

  if (cellListMode === "flat" || !cellTree) {
    const visibleCells = isFiltering
      ? cells.filter((name) => name.toLowerCase().includes(normalizedQuery))
      : cells;
    for (const [index, name] of visibleCells.entries()) {
      rows.push({
        type: "cell",
        occurrenceId: cellOccurrenceId([name]),
        name,
        depth: 0,
        parentOccurrenceId: null,
        hasChildren: false,
        isExpanded: false,
        posInSet: index + 1,
        setSize: visibleCells.length,
        guideLevels: [],
      });
    }
    return rows;
  }

  const walk = (
    nodes: readonly CellNode[],
    depth: number,
    parentOccurrenceId: CellOccurrenceId | null,
    guideLevels: readonly number[],
  ) => {
    for (const [index, node] of nodes.entries()) {
      const hasChildren = node.children.length > 0;
      const isExpanded = hasChildren && (isFiltering || expandedCells.has(node.occurrenceId));
      const hasNextSibling = index < nodes.length - 1;
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
        guideLevels,
      });
      if (isExpanded) {
        const childGuideLevels =
          depth > 0 && hasNextSibling ? [...guideLevels, depth - 1] : guideLevels;
        walk(node.children, depth + 1, node.occurrenceId, childGuideLevels);
      }
    }
  };
  const projectedTree = isFiltering ? filterCellTree(cellTree, normalizedQuery) : cellTree;
  walk(projectedTree, 0, null, []);
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
