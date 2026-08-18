import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useExplorerStore } from "@/stores/explorer";
import { useSelectionStore } from "@/stores/selection";
import { useViewportStore } from "@/stores/viewport";
import { useWasmContextStore } from "@/stores/wasm-context";
import type { WasmLibrary } from "@/wasm/rosette_wasm";
import { InstanceLabels } from "./InstanceLabels";

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};

vi.mock("@/stores/ui", () => ({
  useUIStore: (selector: (state: { theme: "dark" }) => unknown) => selector({ theme: "dark" }),
}));

describe("InstanceLabels", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    useExplorerStore.setState({ activeCell: "top" });
    useSelectionStore.setState({
      selectedIds: new Set(),
      hoveredId: null,
      lastSelectedId: null,
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    useWasmContextStore.setState({ library: null, renderer: null, syncGeneration: 0 });
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
  });

  it("reuses instance metadata across selection and viewport renders", () => {
    const getInstanceLabelData = vi.fn(() => [
      {
        id: "ref:0:0:test",
        name: "child",
        elementIndex: 0,
        minX: 0,
        minY: 0,
        maxX: 10,
        maxY: 10,
      },
    ]);
    const library = {
      active_cell_name: () => "top",
      get_instance_label_data: getInstanceLabelData,
      get_cell_ref_info: () => null,
    } as unknown as WasmLibrary;
    useWasmContextStore.setState({ library, syncGeneration: 0 });

    act(() => root.render(<InstanceLabels />));
    expect(getInstanceLabelData).not.toHaveBeenCalled();

    act(() => useSelectionStore.getState().setHover("ref:0:0:test"));
    expect(container.textContent).toContain("child");
    expect(getInstanceLabelData).toHaveBeenCalledTimes(1);

    act(() => useViewportStore.getState().pan(5, 10));
    expect(getInstanceLabelData).toHaveBeenCalledTimes(1);

    act(() => useWasmContextStore.getState().bumpSyncGeneration());
    expect(getInstanceLabelData).toHaveBeenCalledTimes(2);
  });
});
