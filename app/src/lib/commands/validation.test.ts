import { describe, expect, it, vi } from "vitest";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";
import { useHistoryStore } from "@/stores/history";
import { usePathStore } from "@/stores/path";
import { restoreSnapshots } from "./helpers";
import {
  DeleteElementsCommand,
  BooleanOperationCommand,
  MoveElementsCommand,
  SetCellOriginCommand,
  SetInstanceArrayCommand,
  SetInstanceTransformCommand,
  SetTextHeightCommand,
  translationTargetCount,
  translateElementsOrThrow,
  type CommandContext,
  snapshotElements,
} from ".";

function commandContext(libraryMethods: Record<string, unknown>): {
  ctx: CommandContext;
  renderer: {
    sync_from_library: ReturnType<typeof vi.fn>;
    set_crosshair_origin: ReturnType<typeof vi.fn>;
    mark_dirty: ReturnType<typeof vi.fn>;
  };
} {
  const library = libraryMethods as unknown as WasmLibrary;
  const renderer = {
    sync_from_library: vi.fn(),
    set_crosshair_origin: vi.fn(),
    mark_dirty: vi.fn(),
  };
  return {
    ctx: { library, renderer: renderer as unknown as WasmRenderer },
    renderer,
  };
}

describe("validated editor commands", () => {
  it("keeps the subtraction base mapped after snapshot ordering", () => {
    const booleanOperation = vi
      .fn()
      .mockReturnValueOnce(["result-1"])
      .mockReturnValueOnce(["result-2"]);
    const restored = ["restored-base", "restored-other"];
    let restoreIndex = 0;
    const { ctx } = commandContext({
      get_canonical_element_id: vi.fn((id: string) => id),
      get_element_index: vi.fn((id: string) => (id === "base" ? 1 : 4)),
      get_cell_ref_info: vi.fn(() => undefined),
      get_text_element_info: vi.fn(() => null),
      get_native_path_info: vi.fn(() => undefined),
      get_element_info: vi.fn(() => ({
        vertices: new Float64Array([0, 0, 1, 0, 1, 1]),
        layer: 1,
        datatype: 0,
        free: vi.fn(),
      })),
      boolean_operation: booleanOperation,
      remove_elements: vi.fn(),
      add_polygon: vi.fn(() => restored[restoreIndex++]),
    });
    const command = new BooleanOperationCommand(["other", "base"], "subtract", "base");

    command.execute(ctx);
    command.undo(ctx);
    command.execute(ctx);

    expect(booleanOperation).toHaveBeenNthCalledWith(2, restored, "subtract", "restored-base");
  });

  it("deduplicates synthetic instance IDs when checking translation counts", () => {
    const library = {
      get_canonical_element_id: vi.fn((id: string) =>
        id.startsWith("ref:4:") ? "ref:4:0:stable-token" : id,
      ),
    } as unknown as WasmLibrary;
    expect(
      translationTargetCount(library, [
        "ref:4:0:stable-token",
        "ref:4:12:stable-token",
        "polygon",
        "polygon",
      ]),
    ).toBe(2);
  });

  it("counts real and synthetic CellRef aliases as one atomic translation target", () => {
    const synthetic = "ref:4:0:stable-token";
    const translate = vi.fn(() => 1);
    const library = {
      get_canonical_element_id: vi.fn((id: string) =>
        id === "stable-token" || id === synthetic ? synthetic : id,
      ),
      translate_elements: translate,
    } as unknown as WasmLibrary;

    expect(() =>
      translateElementsOrThrow(library, ["stable-token", synthetic], 10, 20),
    ).not.toThrow();
    expect(translate).toHaveBeenCalledWith(["stable-token", synthetic], 10, 20);
  });

  it("snapshots and restores native paths in mixed element order", () => {
    const calls: string[] = [];
    const library = {
      get_canonical_element_id: vi.fn((id: string) => id),
      get_element_index: vi.fn((id: string) => (id === "native" ? 1 : 2)),
      get_cell_ref_info: vi.fn(() => undefined),
      get_text_element_info: vi.fn(() => null),
      get_native_path_info: vi.fn((id: string) =>
        id === "native"
          ? {
              centerline: new Float64Array([1, 2, 3, 4]),
              width: -5,
              end_type: 2,
              layer: 6,
              datatype: 7,
              free: vi.fn(),
            }
          : undefined,
      ),
      get_element_info: vi.fn((id: string) =>
        id === "polygon"
          ? {
              vertices: new Float64Array([0, 0, 1, 0, 1, 1]),
              layer: 8,
              datatype: 9,
              free: vi.fn(),
            }
          : undefined,
      ),
      restore_native_path: vi.fn(() => {
        calls.push("native-path");
        return "restored-native";
      }),
      add_polygon: vi.fn(() => {
        calls.push("polygon");
        return "restored-polygon";
      }),
    } as unknown as WasmLibrary;

    const snapshots = snapshotElements(library, ["native", "polygon"]);
    expect(snapshots.map((snapshot) => snapshot.type)).toEqual(["native-path", "polygon"]);
    expect(snapshots[0]).toMatchObject({ width: -5, endType: 2, layer: 6, datatype: 7 });
    expect(snapshots.map((snapshot) => snapshot.originalIndex)).toEqual([1, 2]);
    expect(restoreSnapshots(library, snapshots, true)).toEqual([
      "restored-native",
      "restored-polygon",
    ]);
    expect(calls).toEqual(["native-path", "polygon"]);
  });

  it("restores standalone delete undo at exact mixed element indices", () => {
    const syntheticRef = "ref:5:0:ref-real";
    const originalIndices: Record<string, number> = {
      native: 1,
      text: 3,
      polygon: 4,
      "ref-real": 5,
      app: 6,
    };
    const restoreOrder: string[] = [];
    const moves: Array<[string, number]> = [];
    usePathStore.setState({
      pathMetadata: new Map([
        [
          "app",
          {
            waypoints: [
              { x: 0, y: 0 },
              { x: 10, y: 0 },
            ],
            width: 2,
            cornerRadius: 0,
            numArcPoints: 8,
            layer: 5,
            datatype: 0,
          },
        ],
      ]),
    });

    const { ctx } = commandContext({
      get_canonical_element_id: vi.fn((id: string) =>
        id === "ref-real" || id === syntheticRef ? syntheticRef : id,
      ),
      get_element_index: vi.fn((id: string) => originalIndices[id] ?? -1),
      get_cell_ref_info: vi.fn((id: string) =>
        id === syntheticRef
          ? {
              cell_name: "child",
              transform: new Float64Array([1, 0, 0, 1, 20, 30]),
              free: vi.fn(),
            }
          : undefined,
      ),
      get_cell_ref_array_vectors: vi.fn(() => undefined),
      get_text_element_info: vi.fn((id: string) =>
        id === "text" ? { text: "label", x: 1, y: 2, height: 3, layer: 2, datatype: 0 } : null,
      ),
      get_native_path_info: vi.fn((id: string) =>
        id === "native"
          ? {
              centerline: new Float64Array([0, 0, 1, 0]),
              width: 1,
              end_type: 0,
              layer: 1,
              datatype: 0,
              free: vi.fn(),
            }
          : undefined,
      ),
      get_element_info: vi.fn((id: string) =>
        id === "polygon"
          ? {
              vertices: new Float64Array([0, 0, 1, 0, 1, 1]),
              layer: 3,
              datatype: 0,
              free: vi.fn(),
            }
          : undefined,
      ),
      remove_elements: vi.fn(() => 5),
      get_cell_tree: vi.fn(() => null),
      restore_native_path: vi.fn(() => {
        restoreOrder.push("native");
        return "restored-native";
      }),
      add_text: vi.fn(() => {
        restoreOrder.push("text");
        return "restored-text";
      }),
      add_polygon: vi.fn(() => {
        restoreOrder.push("polygon");
        return "restored-polygon";
      }),
      add_cell_ref_with_transform: vi.fn(() => {
        restoreOrder.push("cell-ref");
        return "restored-ref";
      }),
      create_path_rounded: vi.fn(() => {
        restoreOrder.push("app-path");
        return "restored-app";
      }),
      move_element_to_index: vi.fn((id: string, index: number) => {
        moves.push([id, index]);
        return true;
      }),
    });

    try {
      const command = new DeleteElementsCommand([
        "app",
        syntheticRef,
        "ref-real",
        "polygon",
        "text",
        "native",
      ]);
      command.execute(ctx);
      command.undo(ctx);

      expect(restoreOrder).toEqual(["native", "text", "polygon", "cell-ref", "app-path"]);
      expect(moves).toEqual([
        ["restored-native", 1],
        ["restored-text", 3],
        ["restored-polygon", 4],
        ["restored-ref", 5],
        ["restored-app", 6],
      ]);
    } finally {
      usePathStore.setState({ pathMetadata: new Map() });
    }
  });

  it("does not record or render a failed element move", () => {
    const { ctx, renderer } = commandContext({
      get_canonical_element_id: vi.fn((id: string) => id),
      translate_elements: vi.fn(() => 1),
    });
    const command = new MoveElementsCommand(["a", "b"], 10, 20);
    useHistoryStore.getState().clear();

    useHistoryStore.getState().execute(command, ctx);

    expect(useHistoryStore.getState().undoStack).toHaveLength(0);
    expect(renderer.sync_from_library).not.toHaveBeenCalled();
    expect(renderer.mark_dirty).not.toHaveBeenCalled();
  });

  it("throws before rendering failed instance edits", () => {
    const transform = commandContext({ set_cell_ref_transform: vi.fn(() => false) });
    expect(() =>
      new SetInstanceTransformCommand(
        "ref:0:0:stable-token",
        new Float64Array([1, 0, 0, 1, 0, 0]),
        new Float64Array([1, 0, 0, 1, 10, 20]),
      ).execute(transform.ctx),
    ).toThrow("Could not set instance transform");
    expect(transform.renderer.sync_from_library).not.toHaveBeenCalled();

    const array = commandContext({ set_cell_ref_array_vectors: vi.fn(() => false) });
    expect(() =>
      new SetInstanceArrayCommand("ref:0:0:stable-token", null, {
        columns: 2,
        rows: 2,
        colVector: { x: 10, y: 0 },
        rowVector: { x: 0, y: 10 },
      }).execute(array.ctx),
    ).toThrow("Could not set instance array");
    expect(array.renderer.sync_from_library).not.toHaveBeenCalled();
  });

  it("throws before renderer updates for failed text and origin edits", () => {
    const text = commandContext({ set_text_height: vi.fn(() => false) });
    expect(() => new SetTextHeightCommand("text", 10, Infinity).execute(text.ctx)).toThrow(
      "Could not set text height",
    );
    expect(text.renderer.sync_from_library).not.toHaveBeenCalled();

    const origin = commandContext({ set_cell_origin: vi.fn(() => false) });
    expect(() => new SetCellOriginCommand(0, 0, Infinity, 0).execute(origin.ctx)).toThrow(
      "Could not set cell origin",
    );
    expect(origin.renderer.set_crosshair_origin).not.toHaveBeenCalled();
    expect(origin.renderer.mark_dirty).not.toHaveBeenCalled();
  });
});
