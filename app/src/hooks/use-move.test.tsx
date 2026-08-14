import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { useMove } from "./use-move";
import { useHistoryStore } from "@/stores/history";
import { useSelectionStore } from "@/stores/selection";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";

const REF_ID = "ref:0:0:token";
const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};

describe("useMove CellRef preview", () => {
  let container: HTMLDivElement;
  let root: Root;
  let handlers: ReturnType<typeof useMove>;
  let library: WasmLibrary;
  let renderer: WasmRenderer;
  let translateElements: ReturnType<typeof vi.fn>;
  let syncFromLibrary: ReturnType<typeof vi.fn>;
  let setMoveTargets: ReturnType<typeof vi.fn>;
  let setMoveDelta: ReturnType<typeof vi.fn>;
  let clearMovePreview: ReturnType<typeof vi.fn>;

  function Harness() {
    handlers = useMove((x, y) => ({ x, y }), library, renderer);
    return null;
  }

  const canvas = {
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
  } as unknown as HTMLCanvasElement;

  const eventAt = (x: number, y: number) =>
    ({
      button: 0,
      clientX: x,
      clientY: y,
      currentTarget: canvas,
    }) as unknown as React.MouseEvent;

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
    translateElements = vi.fn(() => 1);
    syncFromLibrary = vi.fn();
    setMoveTargets = vi.fn();
    setMoveDelta = vi.fn();
    clearMovePreview = vi.fn();
    library = {
      hit_test_with_tolerance: vi.fn(() => REF_ID),
      get_group_ids: vi.fn(() => [REF_ID]),
      get_canonical_element_id: vi.fn((id: string) => id),
      translate_elements: translateElements,
    } as unknown as WasmLibrary;
    renderer = {
      set_hover: vi.fn(),
      set_move_preview_targets: setMoveTargets,
      set_move_preview_delta: setMoveDelta,
      clear_move_preview: clearMovePreview,
      sync_from_library: syncFromLibrary,
      mark_dirty: vi.fn(),
    } as unknown as WasmRenderer;
    useSelectionStore.setState({
      selectedIds: new Set(),
      hoveredId: null,
      lastSelectedId: null,
    });
    useHistoryStore.getState().clear();
    act(() => root.render(<Harness />));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    useHistoryStore.getState().clear();
  });

  it("updates only the GPU preview until mouseup commits once", () => {
    act(() => handlers.handleMouseDown(eventAt(10, 20)));
    expect(renderer.set_hover).toHaveBeenCalledWith(undefined);
    expect(setMoveTargets).toHaveBeenCalledWith([REF_ID]);
    clearMovePreview.mockClear();

    act(() => handlers.handleMouseMove(eventAt(15, 27)));
    expect(setMoveDelta).toHaveBeenLastCalledWith(5, 7);
    expect(translateElements).not.toHaveBeenCalled();
    expect(syncFromLibrary).not.toHaveBeenCalled();

    act(() => handlers.handleMouseUp());
    expect(clearMovePreview).toHaveBeenCalledOnce();
    expect(translateElements).toHaveBeenCalledOnce();
    expect(translateElements).toHaveBeenCalledWith([REF_ID], 5, 7);
    expect(syncFromLibrary).toHaveBeenCalledOnce();
    expect(useHistoryStore.getState().undoStack).toHaveLength(1);
  });

  it("cancels a preview without mutating the library", () => {
    act(() => handlers.handleMouseDown(eventAt(10, 20)));
    clearMovePreview.mockClear();
    act(() => handlers.handleMouseMove(eventAt(15, 27)));
    act(() => handlers.cancelMove());

    expect(clearMovePreview).toHaveBeenCalledOnce();
    expect(translateElements).not.toHaveBeenCalled();
    expect(syncFromLibrary).not.toHaveBeenCalled();
    expect(useHistoryStore.getState().undoStack).toHaveLength(0);
  });

  it("cancels and consumes undo shortcuts during a preview", () => {
    act(() => handlers.handleMouseDown(eventAt(10, 20)));
    clearMovePreview.mockClear();
    const event = new KeyboardEvent("keydown", {
      key: "z",
      metaKey: true,
      cancelable: true,
    });

    act(() => window.dispatchEvent(event));

    expect(event.defaultPrevented).toBe(true);
    expect(clearMovePreview).toHaveBeenCalledOnce();
    expect(translateElements).not.toHaveBeenCalled();
  });
});
