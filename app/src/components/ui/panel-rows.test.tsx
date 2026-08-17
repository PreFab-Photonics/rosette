import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_LAYERS, useLayerStore } from "@/stores/layer";
import { cellOccurrenceId, useExplorerStore } from "@/stores/explorer";
import { useKeyboardFocusStore } from "@/stores/keyboard-focus";
import { useContextMenuStore } from "@/stores/context-menu";
import { useCellDragStore } from "@/stores/cell-drag";
import { useTabsStore } from "@/stores/tabs";
import { useWasmContextStore } from "@/stores/wasm-context";
import { CellRow } from "./explorer/CellTree";
import { TabList } from "./explorer/TabList";
import { Explorer } from "./Explorer";
import { LayersPanel } from "./LayersPanel";

const mockUIState = vi.hoisted(() => ({
  theme: "dark" as const,
  explorerCollapsed: false,
  explorerWidth: 288,
  toggleExplorerCollapsed: vi.fn(),
  setExplorerWidth: vi.fn(),
}));

vi.mock("@/stores/ui", () => ({
  useUIStore: (selector: (state: typeof mockUIState) => unknown) => selector(mockUIState),
}));

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};

describe("panel row structure", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
  });

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200 });
    window.dispatchEvent(new Event("resize"));
    mockUIState.theme = "dark";
    mockUIState.explorerCollapsed = false;
    mockUIState.explorerWidth = 288;
    mockUIState.toggleExplorerCollapsed.mockReset();
    mockUIState.setExplorerWidth.mockReset();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    useKeyboardFocusStore.setState({ stack: [] });
    useContextMenuStore.setState({ isOpen: false, targetId: null });
    useCellDragStore.getState().endDrag();
    useWasmContextStore.setState({ library: null, renderer: null });
    useExplorerStore.setState({
      editingCellName: null,
      editingCellOccurrenceId: null,
      expansionInitialized: false,
      hasSeenHierarchy: false,
      isFocused: false,
      focusedItem: null,
    });
    useLayerStore.setState({
      layers: new Map(DEFAULT_LAYERS.map((layer) => [layer.id, layer])),
      activeLayerId: 1,
      editingLayerId: null,
      expandedLayerId: null,
      isFocused: false,
      focusedLayerId: null,
    });
    useTabsStore.setState({ tabs: [], activeTabId: null });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("keeps CellRow controls as siblings", () => {
    act(() =>
      root.render(
        <CellRow
          occurrenceId={cellOccurrenceId(["root", "child"])}
          name="child"
          isActive={false}
          isAriaSelected={false}
          isFocused={false}
          isTabStop={false}
          isDark={true}
          depth={1}
          guideLevels={[]}
          posInSet={1}
          setSize={1}
          hasChildren={true}
          isExpanded={false}
          isHidden={false}
          onToggleExpand={vi.fn()}
          onToggleVisibility={vi.fn()}
          onSelect={vi.fn()}
          onRename={vi.fn()}
          startEditing={false}
          canDrag={false}
        />,
      ),
    );

    expect(container.querySelector("button button")).toBeNull();
    expect(container.querySelectorAll("button")).toHaveLength(2);
    expect(container.querySelector("li")).not.toBeNull();
    const row = container.querySelector<HTMLLIElement>('li[role="treeitem"][aria-label="child"]')!;
    const mouseDown = new MouseEvent("mousedown", {
      button: 0,
      bubbles: true,
      cancelable: true,
    });
    act(() => row.dispatchEvent(mouseDown));
    expect(mouseDown.defaultPrevented).toBe(false);

    const chevron = container.querySelector<HTMLButtonElement>('button[aria-hidden="true"]')!;
    const chevronMouseDown = new MouseEvent("mousedown", {
      button: 0,
      bubbles: true,
      cancelable: true,
    });
    act(() => chevron.dispatchEvent(chevronMouseDown));
    expect(chevronMouseDown.defaultPrevented).toBe(true);
    expect(container.querySelectorAll('[data-hierarchy-guide="branch"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-hierarchy-guide="elbow"]')).toHaveLength(1);
    expect(
      container.querySelector<HTMLElement>('[data-hierarchy-guide="branch"]')?.style.bottom,
    ).toBe("50%");
  });

  it("announces and toggles Cell visibility without selecting the row", () => {
    const onToggleVisibility = vi.fn();
    const onSelect = vi.fn();
    act(() =>
      root.render(
        <CellRow
          occurrenceId={cellOccurrenceId(["child"])}
          name="child"
          isActive={false}
          isAriaSelected={false}
          isFocused
          isTabStop
          isDark
          depth={0}
          guideLevels={[]}
          posInSet={1}
          setSize={1}
          hasChildren={false}
          isExpanded={false}
          isHidden
          onToggleExpand={vi.fn()}
          onToggleVisibility={onToggleVisibility}
          onSelect={onSelect}
          onRename={vi.fn()}
          startEditing={false}
          canDrag={false}
        />,
      ),
    );

    const row = container.querySelector<HTMLLIElement>('[role="treeitem"]')!;
    const statusId = row.getAttribute("aria-describedby")!;
    expect(document.getElementById(statusId)?.textContent).toBe("Cell hidden");

    const visibility = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Show cell child"]',
    )!;
    expect(visibility.tabIndex).toBe(0);
    expect(visibility.classList.contains("opacity-100")).toBe(true);

    act(() => visibility.click());
    expect(onToggleVisibility).toHaveBeenCalledOnce();
    expect(onSelect).not.toHaveBeenCalled();

    act(() => {
      visibility.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 2 }));
      visibility.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, detail: 2 }));
    });
    expect(onToggleVisibility).toHaveBeenCalledTimes(2);
    expect(container.querySelector("input")).toBeNull();
  });

  it("reveals Cell visibility on row hover or keyboard focus", () => {
    act(() =>
      root.render(
        <CellRow
          occurrenceId={cellOccurrenceId(["child"])}
          name="child"
          isActive={false}
          isAriaSelected={false}
          isFocused={false}
          isTabStop
          isDark
          depth={0}
          guideLevels={[]}
          posInSet={1}
          setSize={1}
          hasChildren={false}
          isExpanded={false}
          isHidden={false}
          onToggleExpand={vi.fn()}
          onToggleVisibility={vi.fn()}
          onSelect={vi.fn()}
          onRename={vi.fn()}
          startEditing={false}
          canDrag={false}
        />,
      ),
    );

    const visibility = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Hide cell child"]',
    )!;
    expect(visibility.classList.contains("opacity-0")).toBe(true);
    expect(visibility.classList.contains("pointer-events-none")).toBe(true);
    expect(visibility.classList.contains("group-hover:opacity-100")).toBe(true);
    expect(visibility.classList.contains("group-hover:pointer-events-auto")).toBe(true);
    expect(visibility.tabIndex).toBe(-1);
  });

  it("targets Cell context menus by definition and claims keyboard ownership", () => {
    const occurrenceId = cellOccurrenceId(["root", "child"]);
    act(() =>
      root.render(
        <CellRow
          occurrenceId={occurrenceId}
          name="child"
          isActive={false}
          isAriaSelected={false}
          isFocused={false}
          isTabStop
          isDark
          depth={1}
          guideLevels={[]}
          posInSet={1}
          setSize={1}
          hasChildren={false}
          isExpanded={false}
          isHidden={false}
          onToggleExpand={vi.fn()}
          onToggleVisibility={vi.fn()}
          onSelect={vi.fn()}
          onRename={vi.fn()}
          startEditing={false}
          canDrag
        />,
      ),
    );

    const row = container.querySelector<HTMLElement>('[role="treeitem"]')!;
    act(() =>
      row.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          clientX: 24,
          clientY: 36,
        }),
      ),
    );

    expect(useContextMenuStore.getState()).toMatchObject({
      isOpen: true,
      variant: "cell",
      targetId: "child",
      position: { x: 24, y: 36 },
    });
    expect(useExplorerStore.getState().focusedItem).toEqual({
      type: "cell",
      occurrenceId,
      name: "child",
    });
    expect(useKeyboardFocusStore.getState().owns("context-menu")).toBe(true);
  });

  it("preserves drag-to-canvas threshold and isolates row actions", () => {
    const bounds = new Float64Array([1, 2, 9, 10]);
    useWasmContextStore.setState({
      library: {
        get_cell_bounds: vi.fn(() => bounds),
        get_cell_origin_by_name: vi.fn(() => new Float64Array([3, 4])),
      } as never,
    });
    act(() =>
      root.render(
        <CellRow
          occurrenceId={cellOccurrenceId(["child"])}
          name="child"
          isActive={false}
          isAriaSelected={false}
          isFocused
          isTabStop
          isDark
          depth={0}
          guideLevels={[]}
          posInSet={1}
          setSize={1}
          hasChildren={false}
          isExpanded={false}
          isHidden={false}
          onToggleExpand={vi.fn()}
          onToggleVisibility={vi.fn()}
          onSelect={vi.fn()}
          onRename={vi.fn()}
          startEditing={false}
          canDrag
        />,
      ),
    );

    const visibility = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Hide cell child"]',
    )!;
    act(() => {
      visibility.dispatchEvent(
        new MouseEvent("mousedown", { button: 0, bubbles: true, clientX: 10, clientY: 10 }),
      );
      document.dispatchEvent(new MouseEvent("mousemove", { clientX: 20, clientY: 10 }));
    });
    expect(useCellDragStore.getState().cellName).toBeNull();

    const row = container.querySelector<HTMLElement>('[role="treeitem"]')!;
    act(() => {
      row.dispatchEvent(
        new MouseEvent("mousedown", { button: 0, bubbles: true, clientX: 10, clientY: 10 }),
      );
      document.dispatchEvent(new MouseEvent("mousemove", { clientX: 13, clientY: 13 }));
    });
    expect(useCellDragStore.getState().cellName).toBeNull();

    act(() => document.dispatchEvent(new MouseEvent("mousemove", { clientX: 16, clientY: 10 })));
    expect(useCellDragStore.getState()).toMatchObject({
      cellName: "child",
      bounds,
      origin: { x: 3, y: 4 },
    });
    act(() => document.dispatchEvent(new MouseEvent("mouseup")));
  });

  it("highlights filtered Cell names and locks forced expansion", () => {
    act(() =>
      root.render(
        <CellRow
          occurrenceId={cellOccurrenceId(["ring_Resonator"])}
          name="ring_Resonator"
          isActive={false}
          isAriaSelected={false}
          isFocused={false}
          isTabStop={false}
          isDark
          depth={0}
          guideLevels={[]}
          posInSet={1}
          setSize={1}
          hasChildren
          isExpanded
          isExpansionLocked
          isHidden={false}
          onToggleExpand={vi.fn()}
          onToggleVisibility={vi.fn()}
          onSelect={vi.fn()}
          onRename={vi.fn()}
          startEditing={false}
          canDrag={false}
          filterQuery="res"
        />,
      ),
    );

    expect(container.querySelector("mark")?.textContent).toBe("Res");
    expect(container.querySelector('button[aria-hidden="true"]')).toBeNull();
    expect(container.querySelector('button[aria-label="Hide cell ring_Resonator"]')).not.toBeNull();
    expect(container.querySelector("svg")?.classList.contains("rotate-90")).toBe(true);
  });

  it("lets a focused Cell visibility action own Enter and Space", () => {
    const occurrenceId = cellOccurrenceId(["child"]);
    useExplorerStore.getState().setCellTree([{ name: "child", children: [] }], {
      resetExpansion: true,
    });
    useExplorerStore.setState({
      activeCell: null,
      isFocused: true,
      focusedItem: { type: "cell", occurrenceId, name: "child" },
    });
    act(() => root.render(<Explorer />));

    const visibility = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Hide cell child"]',
    )!;
    act(() => visibility.focus());
    for (const key of ["Enter", " "]) {
      const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
      act(() => visibility.dispatchEvent(event));
      expect(event.defaultPrevented).toBe(false);
      expect(useExplorerStore.getState().editingCellName).toBeNull();
      expect(useExplorerStore.getState().activeCell).toBeNull();
    }
    act(() => useKeyboardFocusStore.getState().claim("context-menu"));
    const blockedEnter = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    act(() => visibility.dispatchEvent(blockedEnter));
    expect(blockedEnter.defaultPrevented).toBe(true);
    act(() => useKeyboardFocusStore.getState().release("context-menu"));

    const escape = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    act(() => visibility.dispatchEvent(escape));
    expect(escape.defaultPrevented).toBe(true);
    expect(useExplorerStore.getState().isFocused).toBe(false);

    act(() => visibility.click());
    expect(useExplorerStore.getState().hiddenCells.has("child")).toBe(true);
    expect(container.querySelector('button[aria-label="Show cell child"]')).not.toBeNull();
  });

  it("moves Cell row DOM focus with the keyboard cursor", () => {
    const renderRows = (focusedName: string) => (
      <ul>
        {["first", "second"].map((name) => (
          <CellRow
            key={name}
            occurrenceId={cellOccurrenceId([name])}
            name={name}
            isActive={name === "first"}
            isAriaSelected={name === "first"}
            isFocused={name === focusedName}
            isTabStop={name === focusedName}
            isDark
            depth={0}
            guideLevels={[]}
            posInSet={name === "first" ? 1 : 2}
            setSize={2}
            hasChildren={false}
            isExpanded={false}
            isHidden={false}
            onToggleExpand={vi.fn()}
            onToggleVisibility={vi.fn()}
            onSelect={vi.fn()}
            onRename={vi.fn()}
            startEditing={false}
            canDrag={name !== "first"}
          />
        ))}
      </ul>
    );

    act(() => root.render(renderRows("first")));
    expect(document.activeElement?.getAttribute("aria-label")).toBe("first");

    act(() => root.render(renderRows("second")));
    expect(document.activeElement?.getAttribute("aria-label")).toBe("second");
    expect(container.querySelector('li[aria-label="first"]')?.getAttribute("tabindex")).toBe("-1");
  });

  it("focuses only the targeted repeated Cell occurrence", () => {
    const firstId = cellOccurrenceId(["A", "shared"]);
    const secondId = cellOccurrenceId(["B", "shared"]);
    act(() =>
      root.render(
        <ul>
          {[firstId, secondId].map((occurrenceId, index) => (
            <CellRow
              key={occurrenceId}
              occurrenceId={occurrenceId}
              name="shared"
              isActive
              isAriaSelected={occurrenceId === firstId}
              isFocused={occurrenceId === secondId}
              isTabStop={occurrenceId === secondId}
              isDark
              depth={1}
              guideLevels={[]}
              posInSet={index + 1}
              setSize={2}
              hasChildren={false}
              isExpanded={false}
              isHidden={false}
              onToggleExpand={vi.fn()}
              onToggleVisibility={vi.fn()}
              onSelect={vi.fn()}
              onRename={vi.fn()}
              startEditing={false}
              canDrag={false}
            />
          ))}
        </ul>,
      ),
    );

    expect(document.activeElement?.getAttribute("data-occurrence-id")).toBe(secondId);
    expect(container.querySelectorAll('li[role="treeitem"][tabindex="0"]')).toHaveLength(1);
    expect(container.querySelectorAll('li[role="treeitem"][aria-selected="true"]')).toHaveLength(1);
  });

  it("reclaims Explorer keyboard focus when an already-focused Cell row is clicked", () => {
    act(() =>
      root.render(
        <CellRow
          occurrenceId={cellOccurrenceId(["child"])}
          name="child"
          isActive
          isAriaSelected
          isFocused={false}
          isTabStop
          isDark
          depth={0}
          guideLevels={[]}
          posInSet={1}
          setSize={1}
          hasChildren={false}
          isExpanded={false}
          isHidden={false}
          onToggleExpand={vi.fn()}
          onToggleVisibility={vi.fn()}
          onSelect={vi.fn()}
          onRename={vi.fn()}
          startEditing={false}
          canDrag={false}
        />,
      ),
    );
    const row = container.querySelector<HTMLLIElement>('li[role="treeitem"][aria-label="child"]')!;
    act(() => row.focus());
    act(() => useExplorerStore.getState().setFocused(false));
    expect(document.activeElement).toBe(row);

    act(() => row.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(useExplorerStore.getState().isFocused).toBe(true);
  });

  it("restores Cell row focus after canceling inline rename", async () => {
    act(() =>
      root.render(
        <CellRow
          occurrenceId={cellOccurrenceId(["child"])}
          name="child"
          isActive
          isAriaSelected
          isFocused
          isTabStop
          isDark
          depth={0}
          guideLevels={[]}
          posInSet={1}
          setSize={1}
          hasChildren={false}
          isExpanded={false}
          isHidden={false}
          onToggleExpand={vi.fn()}
          onToggleVisibility={vi.fn()}
          onSelect={vi.fn()}
          onRename={vi.fn()}
          startEditing={false}
          canDrag={false}
        />,
      ),
    );
    const row = container.querySelector<HTMLLIElement>('li[role="treeitem"][aria-label="child"]')!;
    act(() => row.dispatchEvent(new MouseEvent("dblclick", { bubbles: true })));
    const input = container.querySelector<HTMLInputElement>('input[value="child"]')!;
    expect(input.closest('[role="treeitem"]')).toBe(row);

    await act(async () => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    expect(document.activeElement?.getAttribute("aria-label")).toBe("child");
  });

  it("keeps external Cell rename focused when the row was previously unfocused", () => {
    const occurrenceId = cellOccurrenceId(["child"]);
    useExplorerStore.setState({
      cells: ["child"],
      cellTree: null,
      activeCell: "child",
      cellListMode: "flat",
    });

    function RenameHarness() {
      const state = useExplorerStore();
      return (
        <CellRow
          occurrenceId={occurrenceId}
          name="child"
          isActive
          isAriaSelected
          isFocused={
            state.isFocused &&
            state.focusedItem?.type === "cell" &&
            state.focusedItem.occurrenceId === occurrenceId
          }
          isTabStop
          isDark
          depth={0}
          guideLevels={[]}
          posInSet={1}
          setSize={1}
          hasChildren={false}
          isExpanded={false}
          isHidden={false}
          onToggleExpand={vi.fn()}
          onToggleVisibility={vi.fn()}
          onSelect={vi.fn()}
          onRename={vi.fn()}
          startEditing={state.editingCellOccurrenceId === occurrenceId}
          canDrag={false}
        />
      );
    }

    act(() => root.render(<RenameHarness />));
    act(() => useExplorerStore.getState().setEditingCell(occurrenceId, "child"));
    expect(document.activeElement).toBe(container.querySelector('input[value="child"]'));
  });

  it("opens the filter from typing and navigates results without leaving the input", async () => {
    const alphaId = cellOccurrenceId(["alpha"]);
    useTabsStore.setState({
      tabs: [
        { id: "one", title: "One", filePath: null, isDirty: false },
        { id: "two", title: "Two", filePath: null, isDirty: false },
      ],
      activeTabId: "one",
    });
    useExplorerStore.setState({
      cells: ["alpha", "beta", "gamma"],
      cellTree: null,
      cellListMode: "flat",
      activeCell: null,
      hiddenCells: new Set(),
      isFocused: true,
      focusedItem: { type: "cell", occurrenceId: alphaId, name: "alpha" },
    });
    act(() => root.render(<Explorer />));

    const alpha = container.querySelector<HTMLElement>('[role="treeitem"][aria-label="alpha"]')!;
    await act(async () => {
      alpha.dispatchEvent(
        new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }),
      );
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    const filter = container.querySelector<HTMLInputElement>('input[aria-label="Filter cells"]')!;
    expect(filter.value).toBe("a");
    expect(document.activeElement).toBe(filter);
    expect(
      document
        .getElementById(filter.getAttribute("aria-activedescendant")!)
        ?.getAttribute("aria-label"),
    ).toBe("alpha");
    expect(
      document
        .getElementById(filter.getAttribute("aria-activedescendant")!)
        ?.querySelector<HTMLButtonElement>("[data-explorer-row-action]")?.tabIndex,
    ).toBe(-1);
    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    act(() => filter.dispatchEvent(tab));
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(filter);
    expect(useExplorerStore.getState().isFocused).toBe(false);

    act(() =>
      filter.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }),
      ),
    );
    expect(document.activeElement).toBe(filter);
    expect(
      document
        .getElementById(filter.getAttribute("aria-activedescendant")!)
        ?.getAttribute("aria-label"),
    ).toBe("beta");
    expect(useKeyboardFocusStore.getState().owns("explorer-filter")).toBe(true);
    const betaVisibility = document
      .getElementById(filter.getAttribute("aria-activedescendant")!)
      ?.querySelector<HTMLButtonElement>("[data-explorer-row-action]")!;
    await act(async () => {
      betaVisibility.focus();
      betaVisibility.click();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    expect(useExplorerStore.getState().hiddenCells.has("beta")).toBe(true);
    expect(useExplorerStore.getState().isFocused).toBe(false);
    expect(document.activeElement).toBe(filter);
    expect(
      document
        .getElementById(filter.getAttribute("aria-activedescendant")!)
        ?.getAttribute("aria-label"),
    ).toBe("beta");

    act(() => useKeyboardFocusStore.getState().claim("context-menu"));
    act(() =>
      filter.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }),
      ),
    );
    expect(
      document
        .getElementById(filter.getAttribute("aria-activedescendant")!)
        ?.getAttribute("aria-label"),
    ).toBe("beta");
    const blockedTyping = new KeyboardEvent("keydown", {
      key: "x",
      bubbles: true,
      cancelable: true,
    });
    act(() => filter.dispatchEvent(blockedTyping));
    expect(blockedTyping.defaultPrevented).toBe(true);
    act(() => useKeyboardFocusStore.getState().release("context-menu"));

    const composingEnter = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
      isComposing: true,
    });
    act(() => filter.dispatchEvent(composingEnter));
    expect(composingEnter.defaultPrevented).toBe(false);
    expect(container.querySelector('input[aria-label="Filter cells"]')).toBe(filter);

    await act(async () => {
      filter.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
      );
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    expect(useExplorerStore.getState().activeCell).toBe("beta");
    expect(container.querySelector('input[aria-label="Filter cells"]')).toBeNull();
    expect(document.activeElement?.getAttribute("aria-label")).toBe("beta");
  });

  it("activates a pointer-selected filter result and closes the filter", async () => {
    const alphaId = cellOccurrenceId(["alpha"]);
    useExplorerStore.setState({
      cells: ["alpha", "beta"],
      cellTree: null,
      cellListMode: "flat",
      activeCell: null,
      hiddenCells: new Set(),
      isFocused: true,
      focusedItem: { type: "cell", occurrenceId: alphaId, name: "alpha" },
    });
    act(() => root.render(<Explorer />));

    const alpha = container.querySelector<HTMLElement>('[role="treeitem"][aria-label="alpha"]')!;
    await act(async () => {
      alpha.dispatchEvent(
        new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }),
      );
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    const beta = container.querySelector<HTMLElement>('[role="treeitem"][aria-label="beta"]')!;
    await act(async () => {
      beta.click();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    expect(container.querySelector('input[aria-label="Filter cells"]')).toBeNull();
    expect(useExplorerStore.getState().activeCell).toBe("beta");
    expect(useExplorerStore.getState().focusedItem).toEqual({
      type: "cell",
      occurrenceId: cellOccurrenceId(["beta"]),
      name: "beta",
    });
    expect(document.activeElement).toBe(beta);
  });

  it("closes the filter and restores row focus when a filtered drag begins", async () => {
    const alphaId = cellOccurrenceId(["alpha"]);
    useWasmContextStore.setState({
      library: {
        get_cell_bounds: vi.fn(() => new Float64Array([0, 0, 10, 10])),
        get_cell_origin_by_name: vi.fn(() => new Float64Array([0, 0])),
      } as never,
    });
    useExplorerStore.setState({
      cells: ["alpha", "beta"],
      cellTree: null,
      cellListMode: "flat",
      activeCell: null,
      hiddenCells: new Set(),
      isFocused: true,
      focusedItem: { type: "cell", occurrenceId: alphaId, name: "alpha" },
    });
    act(() => root.render(<Explorer />));

    const alpha = container.querySelector<HTMLElement>('[role="treeitem"][aria-label="alpha"]')!;
    await act(async () => {
      alpha.dispatchEvent(
        new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }),
      );
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    await act(async () => {
      alpha.dispatchEvent(
        new MouseEvent("mousedown", { button: 0, bubbles: true, clientX: 10, clientY: 10 }),
      );
      document.dispatchEvent(new MouseEvent("mousemove", { clientX: 16, clientY: 10 }));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    expect(useCellDragStore.getState().cellName).toBe("alpha");
    expect(container.querySelector('input[aria-label="Filter cells"]')).toBeNull();
    expect(useKeyboardFocusStore.getState().stack).not.toContain("explorer-filter");
    expect(useExplorerStore.getState().focusedItem).toEqual({
      type: "cell",
      occurrenceId: alphaId,
      name: "alpha",
    });
    expect(document.activeElement).toBe(alpha);
    act(() => document.dispatchEvent(new MouseEvent("mouseup")));
  });

  it("dismisses the filter before a filtered row context menu takes ownership", async () => {
    const alphaId = cellOccurrenceId(["alpha"]);
    useExplorerStore.setState({
      cells: ["alpha", "beta"],
      cellTree: null,
      cellListMode: "flat",
      activeCell: null,
      hiddenCells: new Set(),
      isFocused: true,
      focusedItem: { type: "cell", occurrenceId: alphaId, name: "alpha" },
    });
    act(() => root.render(<Explorer />));

    const alpha = container.querySelector<HTMLElement>('[role="treeitem"][aria-label="alpha"]')!;
    await act(async () => {
      alpha.dispatchEvent(
        new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }),
      );
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    act(() =>
      alpha.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          clientX: 12,
          clientY: 20,
        }),
      ),
    );

    expect(container.querySelector('input[aria-label="Filter cells"]')).toBeNull();
    expect(useContextMenuStore.getState()).toMatchObject({
      isOpen: true,
      variant: "cell",
      targetId: "alpha",
    });
    expect(useKeyboardFocusStore.getState().owns("context-menu")).toBe(true);
    expect(useKeyboardFocusStore.getState().stack).not.toContain("explorer-filter");
  });

  it("dismisses the filter before header controls take ownership", () => {
    useExplorerStore.setState({
      cells: ["alpha"],
      cellTree: null,
      cellListMode: "flat",
      activeCell: null,
      hiddenCells: new Set(),
      isFocused: false,
      focusedItem: null,
    });
    act(() => root.render(<Explorer />));

    act(() =>
      container.querySelector<HTMLButtonElement>('button[aria-label="Filter cells"]')!.click(),
    );
    const menu = container.querySelector<HTMLButtonElement>('button[aria-label="Explorer menu"]')!;
    act(() => {
      menu.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
      menu.click();
    });
    expect(container.querySelector('input[aria-label="Filter cells"]')).toBeNull();
    expect(menu.getAttribute("aria-expanded")).toBe("true");
    expect(useKeyboardFocusStore.getState().owns("explorer-menu")).toBe(true);

    act(() => menu.click());
    act(() =>
      container.querySelector<HTMLButtonElement>('button[aria-label="Filter cells"]')!.click(),
    );
    const renameProject = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Rename project"]',
    )!;
    act(() => {
      renameProject.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
      renameProject.click();
    });
    expect(container.querySelector('input[aria-label="Filter cells"]')).toBeNull();
    expect(container.querySelector('input[aria-label="Project name"]')).not.toBeNull();
    expect(useKeyboardFocusStore.getState().stack).not.toContain("explorer-filter");
  });

  it("returns focus to the filter when rename removes the highlighted result", async () => {
    const alphaId = cellOccurrenceId(["alpha"]);
    useExplorerStore.setState({
      cells: ["alpha", "beta"],
      cellTree: null,
      cellListMode: "flat",
      activeCell: null,
      hiddenCells: new Set(),
      isFocused: true,
      focusedItem: { type: "cell", occurrenceId: alphaId, name: "alpha" },
    });
    act(() => root.render(<Explorer />));

    const alpha = container.querySelector<HTMLElement>('[role="treeitem"][aria-label="alpha"]')!;
    await act(async () => {
      alpha.dispatchEvent(
        new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }),
      );
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    act(() => alpha.dispatchEvent(new MouseEvent("dblclick", { bubbles: true })));

    const rename = container.querySelector<HTMLInputElement>('input[value="alpha"]')!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(
        rename,
        "zoom",
      );
      rename.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const renameTab = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    await act(async () => {
      rename.dispatchEvent(renameTab);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    expect(renameTab.defaultPrevented).toBe(true);
    expect(useExplorerStore.getState().cells).toEqual(["beta", "zoom"]);
    expect(container.querySelector('[role="treeitem"][aria-label="zoom"]')).toBeNull();
    expect(document.activeElement).toBe(
      container.querySelector<HTMLInputElement>('input[aria-label="Filter cells"]'),
    );

    const filter = container.querySelector<HTMLInputElement>('input[aria-label="Filter cells"]')!;
    await act(async () => {
      filter.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
      );
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    await act(async () => {
      filter.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
      );
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    expect(document.activeElement?.getAttribute("aria-label")).toBe("zoom");
    expect(useExplorerStore.getState().focusedItem).toEqual({
      type: "cell",
      occurrenceId: cellOccurrenceId(["zoom"]),
      name: "zoom",
    });
  });

  it("filters the Explorer tree and announces an empty result", async () => {
    useExplorerStore.getState().setCellTree(
      [
        {
          name: "root",
          children: [{ name: "branch", children: [{ name: "leaf", children: [] }] }],
        },
        { name: "other", children: [] },
      ],
      { resetExpansion: true },
    );
    const savedExpansion = new Set<ReturnType<typeof cellOccurrenceId>>();
    useExplorerStore.setState({
      expandedCells: savedExpansion,
      cellListMode: "nested",
      isFocused: false,
      focusedItem: {
        type: "cell",
        occurrenceId: cellOccurrenceId(["other"]),
        name: "other",
      },
    });

    act(() => root.render(<Explorer />));
    expect(container.querySelector('input[aria-label="Filter cells"]')).toBeNull();
    const openFilter = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Filter cells"]',
    )!;
    act(() => openFilter.click());
    const filter = container.querySelector<HTMLInputElement>('input[aria-label="Filter cells"]')!;
    expect(container.querySelector("[data-explorer-header]")?.contains(filter)).toBe(false);
    expect(filter.closest("[data-explorer-filter-row]")).not.toBeNull();
    const setFilter = (value: string) => {
      const currentFilter = container.querySelector<HTMLInputElement>(
        'input[aria-label="Filter cells"]',
      )!;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(
        currentFilter,
        value,
      );
      currentFilter.dispatchEvent(new Event("input", { bubbles: true }));
    };
    act(() => {
      setFilter("leaf");
    });

    expect(
      [...container.querySelectorAll<HTMLElement>('[role="treeitem"]')].map((row) =>
        row.getAttribute("aria-label"),
      ),
    ).toEqual(["root", "branch", "leaf"]);
    expect(useExplorerStore.getState().expandedCells).toBe(savedExpansion);
    expect(container.querySelector("mark")?.textContent).toBe("leaf");

    act(() => {
      setFilter("missing");
    });
    expect(container.querySelector("output")?.textContent).toContain("No cells match “missing”");
    expect(container.querySelectorAll('[role="treeitem"]')).toHaveLength(0);

    act(() => useExplorerStore.getState().setFocused(true));
    expect(useExplorerStore.getState().isFocused).toBe(false);

    const clear = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Clear cell filter"]',
    )!;
    clear.focus();
    await act(async () => {
      clear.click();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    expect(document.activeElement).toBe(filter);
    expect(container.querySelector("output")).toBeNull();

    act(() => setFilter("missing"));
    const closeWithQuery = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Close cell filter"]',
    )!;
    closeWithQuery.focus();
    await act(async () => {
      closeWithQuery.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
      );
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    expect(document.activeElement).toBe(filter);
    expect(container.querySelector('button[aria-label="Close cell filter"]')).not.toBeNull();

    const close = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Close cell filter"]',
    )!;
    await act(async () => {
      close.click();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    expect(container.querySelector('input[aria-label="Filter cells"]')).toBeNull();
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Filter cells");

    const row = container.querySelector<HTMLElement>('[role="treeitem"]')!;
    act(() => row.focus());
    const shortcut = new KeyboardEvent("keydown", {
      key: "f",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    await act(async () => {
      row.dispatchEvent(shortcut);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    expect(shortcut.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(
      container.querySelector('input[aria-label="Filter cells"]'),
    );

    act(() => setFilter("leaf"));
    await act(async () => {
      container
        .querySelector<HTMLInputElement>('input[aria-label="Filter cells"]')!
        .dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
        );
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    expect(container.querySelector('input[aria-label="Filter cells"]')).not.toBeNull();
    await act(async () => {
      container
        .querySelector<HTMLInputElement>('input[aria-label="Filter cells"]')!
        .dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
        );
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    expect(document.activeElement?.getAttribute("aria-label")).toBe("other");
    expect(document.activeElement?.isConnected).toBe(true);
    expect(useExplorerStore.getState().isFocused).toBe(true);
  });

  it("keeps the desktop Explorer usable at minimum width and aligned when collapsed", () => {
    mockUIState.explorerWidth = 200;
    act(() => root.render(<Explorer />));

    const header = container.querySelector<HTMLElement>("[data-explorer-header]")!;
    expect(header.parentElement?.style.width).toBe("200px");
    expect(container.querySelector('button[aria-label="Filter cells"]')).not.toBeNull();
    expect(container.querySelector('button[aria-label="Explorer menu"]')).not.toBeNull();
    expect(container.querySelector('button[aria-label="Collapse Explorer"]')).not.toBeNull();

    act(() =>
      container.querySelector<HTMLButtonElement>('button[aria-label="Filter cells"]')!.click(),
    );
    expect(container.querySelector("[data-explorer-filter-row]")).not.toBeNull();
    expect(container.querySelector('button[aria-label="Collapse Explorer"]')).not.toBeNull();

    act(() => root.unmount());
    root = createRoot(container);
    mockUIState.explorerCollapsed = true;
    act(() => root.render(<Explorer />));
    const logo = container.querySelector<HTMLImageElement>('img[src="/icon.svg"]')!;
    expect(logo.parentElement?.parentElement?.classList.contains("pt-1")).toBe(true);
    expect(container.querySelector('button[aria-label="Expand Explorer"]')).not.toBeNull();
  });

  it("opens as a mobile drawer and releases filter ownership when dismissed", () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 600 });
    window.dispatchEvent(new Event("resize"));
    mockUIState.explorerCollapsed = true;
    act(() => root.render(<Explorer />));

    act(() =>
      container.querySelector<HTMLButtonElement>('button[aria-label="Expand Explorer"]')!.click(),
    );
    expect(container.querySelector("[data-explorer-header]")).not.toBeNull();
    expect(container.querySelector('button[aria-label="Collapse Explorer"]')).toBeNull();

    act(() =>
      container.querySelector<HTMLButtonElement>('button[aria-label="Filter cells"]')!.click(),
    );
    expect(useKeyboardFocusStore.getState().owns("explorer-filter")).toBe(true);

    act(() => document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })));
    expect(container.querySelector("[data-explorer-header]")).toBeNull();
    expect(container.querySelector('button[aria-label="Expand Explorer"]')).not.toBeNull();
    expect(useKeyboardFocusStore.getState().stack).not.toContain("explorer-filter");
  });

  it("renders dense, deep, repeated, flat, and empty hierarchy states", () => {
    const denseTree = Array.from({ length: 24 }, (_, index) => ({
      name: `root_${index.toString().padStart(2, "0")}`,
      children: [
        {
          name: "shared",
          children: [{ name: "branch", children: [{ name: "leaf", children: [] }] }],
        },
      ],
    }));
    useExplorerStore.getState().setCellTree(denseTree, { resetExpansion: true });
    act(() => root.render(<Explorer />));

    const nestedRows = [...container.querySelectorAll<HTMLElement>('[role="treeitem"]')];
    expect(nestedRows).toHaveLength(96);
    expect(new Set(nestedRows.map((row) => row.dataset.occurrenceId)).size).toBe(96);
    expect(Math.max(...nestedRows.map((row) => Number(row.getAttribute("aria-level"))))).toBe(4);
    expect(container.querySelector('[data-hierarchy-guide="branch"]')).not.toBeNull();

    act(() => useExplorerStore.getState().setCellListMode("flat"));
    const flatRows = [...container.querySelectorAll<HTMLElement>('[role="treeitem"]')];
    expect(flatRows).toHaveLength(27);
    expect(flatRows.every((row) => row.getAttribute("aria-level") === "1")).toBe(true);
    expect(container.querySelector('[data-hierarchy-guide="branch"]')).toBeNull();

    act(() => useExplorerStore.getState().setCellTree([], { resetExpansion: true }));
    expect(container.querySelectorAll('[role="treeitem"]')).toHaveLength(0);
    expect(container.querySelector('[role="tree"][aria-label="Cells"]')).not.toBeNull();
  });

  it("renders Layer rows as a roving semantic list without nested controls", () => {
    act(() => root.render(<LayersPanel />));

    expect(container.querySelector('ul[aria-label="Layers"]')).not.toBeNull();
    expect(container.querySelectorAll('ul[aria-label="Layers"] > li')).toHaveLength(
      DEFAULT_LAYERS.length,
    );
    expect(container.querySelector("button button")).toBeNull();
    expect(container.querySelectorAll('button[tabindex="0"]')).toHaveLength(1);
  });

  it("marks tabs as vertical and releases Explorer focus when focus leaves", () => {
    useTabsStore.setState({
      tabs: [
        { id: "one", title: "One", filePath: null, isDirty: false },
        { id: "two", title: "Two", filePath: null, isDirty: false },
      ],
      activeTabId: "one",
    });
    useExplorerStore.setState({
      isFocused: true,
      focusedItem: { type: "tab", id: "one" },
    });
    act(() =>
      root.render(
        <>
          <TabList isDark focusedItem={{ type: "tab", id: "one" }} isKeyboardNavigationActive />
          <button type="button">Outside</button>
        </>,
      ),
    );

    expect(container.querySelector('[role="tablist"]')?.getAttribute("aria-orientation")).toBe(
      "vertical",
    );
    expect(document.activeElement?.getAttribute("role")).toBe("tab");

    const globalKeyDown = vi.fn();
    window.addEventListener("keydown", globalKeyDown);
    const enter = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    act(() => document.activeElement?.dispatchEvent(enter));
    expect(enter.defaultPrevented).toBe(true);
    expect(globalKeyDown).not.toHaveBeenCalled();
    window.removeEventListener("keydown", globalKeyDown);

    const outside = [...container.querySelectorAll("button")].find(
      (button) => button.textContent === "Outside",
    )!;
    act(() => outside.focus());
    expect(useExplorerStore.getState().isFocused).toBe(false);
  });

  it("moves DOM focus into Layers when keyboard focus is requested", () => {
    act(() => root.render(<LayersPanel />));
    act(() => useLayerStore.getState().setFocused(true));

    expect(document.activeElement?.getAttribute("aria-label")).toBe("silicon");
    expect(useKeyboardFocusStore.getState().owns("layers-panel")).toBe(true);
  });

  it("restores Layer row focus after canceling inline rename", async () => {
    act(() => root.render(<LayersPanel />));
    act(() => useLayerStore.getState().setFocused(true));
    act(() => useLayerStore.getState().setEditingLayerId(1));
    const input = container.querySelector<HTMLInputElement>('input[value="silicon"]')!;
    expect(document.activeElement).toBe(input);

    await act(async () => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    const row = document.activeElement as HTMLButtonElement;
    expect(row.getAttribute("aria-label")).toBe("silicon");
    expect(useLayerStore.getState().isFocused).toBe(true);

    act(() => row.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    expect(useLayerStore.getState().isFocused).toBe(false);
    expect(useKeyboardFocusStore.getState().owns("layers-panel")).toBe(false);
    expect(document.activeElement).not.toBe(row);
  });

  it("can leave Layers after rename starts from an unfocused panel", async () => {
    act(() => root.render(<LayersPanel />));
    act(() => useLayerStore.getState().setEditingLayerId(1));
    const input = container.querySelector<HTMLInputElement>('input[value="silicon"]')!;
    expect(document.activeElement).toBe(input);

    await act(async () => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    const row = document.activeElement as HTMLButtonElement;
    expect(row.getAttribute("aria-label")).toBe("silicon");
    expect(useLayerStore.getState().isFocused).toBe(true);

    act(() => row.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    expect(useLayerStore.getState().isFocused).toBe(false);
    expect(useKeyboardFocusStore.getState().owns("layers-panel")).toBe(false);
    expect(document.activeElement).not.toBe(row);
  });

  it("restores Layer row focus after submitting inline rename", async () => {
    act(() => root.render(<LayersPanel />));
    act(() => useLayerStore.getState().setFocused(true));
    act(() => useLayerStore.getState().setEditingLayerId(1));
    const input = container.querySelector<HTMLInputElement>('input[value="silicon"]')!;

    await act(async () => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    expect(document.activeElement?.getAttribute("aria-label")).toBe("silicon");
    expect(useLayerStore.getState().isFocused).toBe(true);
  });

  it("keeps focus in the expanded Layer editor when sorting changes", async () => {
    act(() => root.render(<LayersPanel />));
    act(() => useLayerStore.getState().setFocused(true));
    act(() => useLayerStore.getState().setExpandedLayerId(1));
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    const nameInput = container.querySelector<HTMLInputElement>('input[value="silicon"]')!;
    expect(document.activeElement).toBe(nameInput);

    const layer = useLayerStore.getState().getLayer(1)!;
    act(() => useLayerStore.getState().setLayer({ ...layer, layerNumber: 20 }));
    expect(document.activeElement).toBe(nameInput);
  });

  it("restores the Layer row before leaving the panel after closing its editor", async () => {
    act(() => root.render(<LayersPanel />));
    act(() => useLayerStore.getState().setFocused(true));
    act(() => useLayerStore.getState().setExpandedLayerId(1));
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    const input = container.querySelector<HTMLInputElement>('input[value="silicon"]')!;

    act(() => input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    expect(useLayerStore.getState().expandedLayerId).toBe(1);
    expect(document.activeElement).not.toBe(input);

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    expect(useLayerStore.getState().expandedLayerId).toBeNull();
    const row = document.activeElement as HTMLButtonElement;
    expect(row.getAttribute("aria-label")).toBe("silicon");

    act(() => row.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    expect(useLayerStore.getState().isFocused).toBe(false);
    expect(document.activeElement).not.toBe(row);
  });

  it.each(Array.from({ length: 12 }, (_, index) => index))(
    "closes the Layer editor with Enter from keyboard field %i",
    async (tabIndex) => {
      act(() => root.render(<LayersPanel />));
      act(() => useLayerStore.getState().setFocused(true));
      act(() => useLayerStore.getState().setExpandedLayerId(1));
      await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
      const field = container.querySelector<HTMLElement>(`[data-tab-index="${tabIndex}"]`)!;
      act(() => field.focus());

      await act(async () => {
        field.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
        );
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      });

      expect(useLayerStore.getState().expandedLayerId).toBeNull();
      expect(document.activeElement?.getAttribute("aria-label")).toBe("silicon");
    },
  );

  it("restores Layer row focus when the swatch closes its editor", async () => {
    act(() => root.render(<LayersPanel />));
    act(() => useLayerStore.getState().setFocused(true));
    act(() => useLayerStore.getState().setExpandedLayerId(1));
    const swatch = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Edit layer color (#ff69b4)"]',
    )!;

    await act(async () => {
      swatch.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    expect(useLayerStore.getState().expandedLayerId).toBeNull();
    expect(document.activeElement?.getAttribute("aria-label")).toBe("silicon");
  });

  it("does not run Layer row actions beneath a higher keyboard scope", () => {
    act(() => root.render(<LayersPanel />));
    act(() => useLayerStore.getState().setFocused(true));
    const activeRow = container.querySelector<HTMLButtonElement>('button[aria-current="true"]')!;

    act(() => useKeyboardFocusStore.getState().claim("context-menu"));
    const blockedEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    act(() => activeRow.dispatchEvent(blockedEvent));
    expect(blockedEvent.defaultPrevented).toBe(true);
    expect(useLayerStore.getState().expandedLayerId).toBeNull();

    act(() => useKeyboardFocusStore.getState().release("context-menu"));
    act(() =>
      activeRow.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })),
    );
    expect(useLayerStore.getState().expandedLayerId).toBe(1);
  });

  it("gives a context menu ownership when opened from an unfocused Layer row", () => {
    act(() => root.render(<LayersPanel />));
    const swatch = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Edit layer color (#ff69b4)"]',
    )!;
    const mouseDown = new MouseEvent("mousedown", {
      button: 2,
      bubbles: true,
      cancelable: true,
    });
    act(() => swatch.dispatchEvent(mouseDown));
    expect(mouseDown.defaultPrevented).toBe(true);
    act(() => swatch.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true })));

    expect(useLayerStore.getState().isFocused).toBe(false);
    expect(useKeyboardFocusStore.getState().owns("context-menu")).toBe(true);
  });
});
