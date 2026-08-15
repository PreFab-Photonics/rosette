import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_LAYERS, useLayerStore } from "@/stores/layer";
import { cellOccurrenceId, useExplorerStore } from "@/stores/explorer";
import { useKeyboardFocusStore } from "@/stores/keyboard-focus";
import { useContextMenuStore } from "@/stores/context-menu";
import { useTabsStore } from "@/stores/tabs";
import { CellRow } from "./explorer/CellTree";
import { TabList } from "./explorer/TabList";
import { LayersPanel } from "./LayersPanel";

vi.mock("@/stores/ui", () => ({
  useUIStore: (selector: (state: { theme: "dark" }) => unknown) => selector({ theme: "dark" }),
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
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    useKeyboardFocusStore.setState({ stack: [] });
    useContextMenuStore.setState({ isOpen: false, targetId: null });
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
          posInSet={1}
          setSize={1}
          hasChildren={true}
          isExpanded={false}
          isHidden={false}
          onToggleExpand={vi.fn()}
          onSelect={vi.fn()}
          onRename={vi.fn()}
          startEditing={false}
          canDrag={false}
        />,
      ),
    );

    expect(container.querySelector("button button")).toBeNull();
    expect(container.querySelectorAll("button")).toHaveLength(1);
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
            posInSet={name === "first" ? 1 : 2}
            setSize={2}
            hasChildren={false}
            isExpanded={false}
            isHidden={false}
            onToggleExpand={vi.fn()}
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
              posInSet={index + 1}
              setSize={2}
              hasChildren={false}
              isExpanded={false}
              isHidden={false}
              onToggleExpand={vi.fn()}
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
          posInSet={1}
          setSize={1}
          hasChildren={false}
          isExpanded={false}
          isHidden={false}
          onToggleExpand={vi.fn()}
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
          posInSet={1}
          setSize={1}
          hasChildren={false}
          isExpanded={false}
          isHidden={false}
          onToggleExpand={vi.fn()}
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
          posInSet={1}
          setSize={1}
          hasChildren={false}
          isExpanded={false}
          isHidden={false}
          onToggleExpand={vi.fn()}
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
