import { beforeEach, describe, expect, it } from "vitest";
import {
  cellOccurrenceId,
  cellOccurrencePath,
  useExplorerStore,
  type RawCellNode,
} from "./explorer";

const repeatedTree: RawCellNode[] = [
  {
    name: "A",
    children: [{ name: "shared", children: [{ name: "leaf", children: [] }] }],
  },
  {
    name: "B",
    children: [{ name: "shared", children: [{ name: "leaf", children: [] }] }],
  },
];

describe("explorer occurrence identity", () => {
  beforeEach(() => {
    useExplorerStore.setState({
      cells: [],
      cellTree: null,
      expandedCells: new Set(),
      expansionInitialized: false,
      hasSeenHierarchy: false,
      activeCell: null,
      editingCellName: null,
      editingCellOccurrenceId: null,
      hiddenCells: new Set(),
      isFocused: false,
      focusedItem: null,
      cellListMode: "nested",
    });
  });

  it("assigns distinct deterministic IDs to repeated definitions", () => {
    useExplorerStore.getState().setCellTree(repeatedTree);
    const [a, b] = useExplorerStore.getState().cellTree!;
    const aShared = a.children[0];
    const bShared = b.children[0];

    expect(aShared.occurrenceId).toBe(cellOccurrenceId(["A", "shared"]));
    expect(bShared.occurrenceId).toBe(cellOccurrenceId(["B", "shared"]));
    expect(aShared.occurrenceId).not.toBe(bShared.occurrenceId);
  });

  it("expands repeated occurrences independently", () => {
    useExplorerStore.getState().setCellTree(repeatedTree);
    const [a, b] = useExplorerStore.getState().cellTree!;
    const aShared = a.children[0].occurrenceId;
    const bShared = b.children[0].occurrenceId;

    useExplorerStore.getState().toggleExpanded(aShared);
    expect(useExplorerStore.getState().expandedCells.has(aShared)).toBe(false);
    expect(useExplorerStore.getState().expandedCells.has(bShared)).toBe(true);
  });

  it("preserves an explicitly collapsed tree across rebuilds", () => {
    useExplorerStore.getState().setCellTree(repeatedTree);
    for (const id of useExplorerStore.getState().expandedCells) {
      useExplorerStore.getState().toggleExpanded(id);
    }
    expect(useExplorerStore.getState().expandedCells.size).toBe(0);

    useExplorerStore.getState().setCellTree(repeatedTree);
    expect(useExplorerStore.getState().expandedCells.size).toBe(0);
  });

  it("auto-expands when a leaf-only design first gains hierarchy", () => {
    useExplorerStore.getState().setCellTree([{ name: "top", children: [] }]);
    expect(useExplorerStore.getState().expandedCells.size).toBe(0);

    useExplorerStore
      .getState()
      .setCellTree([{ name: "top", children: [{ name: "child", children: [] }] }]);
    expect(useExplorerStore.getState().expandedCells.has(cellOccurrenceId(["top"]))).toBe(true);
  });

  it("does not reopen a collapsed parent after delete and undo", () => {
    const hierarchical: RawCellNode[] = [
      { name: "top", children: [{ name: "child", children: [] }] },
    ];
    useExplorerStore.getState().setCellTree(hierarchical);
    useExplorerStore.getState().toggleExpanded(cellOccurrenceId(["top"]));

    useExplorerStore.getState().setCellTree([{ name: "top", children: [] }]);
    useExplorerStore.getState().setCellTree(hierarchical);
    expect(useExplorerStore.getState().expandedCells.has(cellOccurrenceId(["top"]))).toBe(false);
  });

  it("resets expansion explicitly for a fresh document", () => {
    useExplorerStore.getState().setCellTree(repeatedTree);
    for (const id of useExplorerStore.getState().expandedCells) {
      useExplorerStore.getState().toggleExpanded(id);
    }

    useExplorerStore.getState().setCellTree(repeatedTree, { resetExpansion: true });
    expect(useExplorerStore.getState().expandedCells.size).toBeGreaterThan(0);
  });

  it("remaps focused and expanded descendant paths across rename", () => {
    useExplorerStore.getState().setCellTree(repeatedTree);
    const leafId = cellOccurrenceId(["A", "shared", "leaf"]);
    useExplorerStore.getState().setFocusedItem({
      type: "cell",
      occurrenceId: leafId,
      name: "leaf",
    });

    useExplorerStore.getState().renameCell("shared", "renamed");
    const state = useExplorerStore.getState();
    expect(state.focusedItem).toEqual({
      type: "cell",
      occurrenceId: cellOccurrenceId(["A", "renamed", "leaf"]),
      name: "leaf",
    });
    expect(state.expandedCells.has(cellOccurrenceId(["A", "renamed"]))).toBe(true);
    expect(state.expandedCells.has(cellOccurrenceId(["B", "renamed"]))).toBe(true);
  });

  it("encodes arbitrary cell names without collisions", () => {
    const names = ["a/b", '"quoted"', "x:y", "[json]", "back\\slash"];
    const id = cellOccurrenceId(names);
    expect(cellOccurrencePath(id)).toEqual(names);
    expect(id).not.toBe(cellOccurrenceId([names.join("/")]));
  });

  it("normalizes finite cycle-truncated hierarchy output without reconstructing omitted edges", () => {
    useExplorerStore
      .getState()
      .setCellTree([{ name: "A", children: [{ name: "B", children: [] }] }]);
    const [root] = useExplorerStore.getState().cellTree!;
    expect(root.occurrenceId).toBe(cellOccurrenceId(["A"]));
    expect(root.children[0].occurrenceId).toBe(cellOccurrenceId(["A", "B"]));
    expect(root.children[0].children).toEqual([]);
  });
});
