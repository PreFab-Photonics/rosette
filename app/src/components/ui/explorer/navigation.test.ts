import { beforeEach, describe, expect, it } from "vitest";
import { cellOccurrenceId, useExplorerStore, type RawCellNode } from "@/stores/explorer";
import { findFocusedRowIndex, focusedItemForRow, projectExplorerRows } from "./navigation";

const tree: RawCellNode[] = [
  { name: "A", children: [{ name: "shared", children: [{ name: "leaf", children: [] }] }] },
  { name: "B", children: [{ name: "shared", children: [{ name: "leaf", children: [] }] }] },
];

describe("projectExplorerRows", () => {
  beforeEach(() => {
    useExplorerStore.setState({
      cells: [],
      cellTree: null,
      expandedCells: new Set(),
      expansionInitialized: false,
      hasSeenHierarchy: false,
      activeCell: null,
      focusedItem: null,
      cellListMode: "nested",
    });
    useExplorerStore.getState().setCellTree(tree);
  });

  function project(mode: "nested" | "flat" = "nested", tabs: { id: string }[] = []) {
    const state = useExplorerStore.getState();
    return projectExplorerRows({
      tabs,
      cellTree: state.cellTree,
      cells: state.cells,
      expandedCells: state.expandedCells,
      cellListMode: mode,
    });
  }

  it("projects repeated branches with exact parent identities", () => {
    const rows = project().filter((row) => row.type === "cell");
    const sharedRows = rows.filter((row) => row.name === "shared");

    expect(sharedRows.map((row) => row.occurrenceId)).toEqual([
      cellOccurrenceId(["A", "shared"]),
      cellOccurrenceId(["B", "shared"]),
    ]);
    expect(sharedRows.map((row) => row.parentOccurrenceId)).toEqual([
      cellOccurrenceId(["A"]),
      cellOccurrenceId(["B"]),
    ]);
  });

  it("hides only the collapsed occurrence's descendants", () => {
    useExplorerStore.getState().toggleExpanded(cellOccurrenceId(["A", "shared"]));
    const ids = project()
      .filter((row) => row.type === "cell")
      .map((row) => row.occurrenceId);

    expect(ids).not.toContain(cellOccurrenceId(["A", "shared", "leaf"]));
    expect(ids).toContain(cellOccurrenceId(["B", "shared", "leaf"]));
  });

  it("projects flat mode as one canonical row per definition", () => {
    const rows = project("flat").filter((row) => row.type === "cell");
    expect(rows.map((row) => row.name)).toEqual(["A", "shared", "leaf", "B"]);
    expect(rows.map((row) => row.occurrenceId)).toEqual(
      rows.map((row) => cellOccurrenceId([row.name])),
    );
  });

  it("includes tabs only when multiple tabs are visible", () => {
    expect(project("nested", [{ id: "one" }])[0].type).toBe("cell");
    expect(project("nested", [{ id: "one" }, { id: "two" }]).slice(0, 2)).toEqual([
      { type: "tab", id: "one" },
      { type: "tab", id: "two" },
    ]);
  });

  it("finds focus by occurrence rather than cell name", () => {
    const rows = project();
    const target = {
      type: "cell" as const,
      occurrenceId: cellOccurrenceId(["B", "shared"]),
      name: "shared",
    };
    const index = findFocusedRowIndex(rows, target);
    expect(focusedItemForRow(rows[index])).toEqual(target);
  });
});
