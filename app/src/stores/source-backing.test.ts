import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";
import type { Command, CommandContext } from "@/lib/commands";
import { useDocumentStore } from "@/stores/document";
import { useHistoryStore } from "@/stores/history";
import { useToolStore } from "@/stores/tool";

const context = {
  library: {} as WasmLibrary,
  renderer: {} as WasmRenderer,
} satisfies CommandContext;

function command(scope?: Command["scope"]) {
  const execute = vi.fn<(ctx: CommandContext) => void>();
  const undo = vi.fn<(ctx: CommandContext) => void>();
  return {
    type: "test",
    description: "Test command",
    scope,
    execute,
    undo,
  } satisfies Command;
}

describe("source-backed editing policy", () => {
  beforeEach(() => {
    useHistoryStore.getState().clear();
    useDocumentStore.setState({
      backing: { kind: "document" },
      liveUpdatesEnabled: true,
      isDirty: false,
    });
    useToolStore.setState({ activeTool: "select", toolSetAt: 0 });
  });

  it("rejects model commands without dirtying or recording the source preview", () => {
    useDocumentStore.getState().setSource({ kind: "python", path: "design.py" });
    const modelCommand = command();

    useHistoryStore.getState().execute(modelCommand, context);

    expect(modelCommand.execute).not.toHaveBeenCalled();
    expect(useHistoryStore.getState().undoStack).toHaveLength(0);
    expect(useDocumentStore.getState().isDirty).toBe(false);
  });

  it("keeps measurement commands usable across source reloads", () => {
    useDocumentStore.getState().setSource({ kind: "python", path: "design.py" });
    const measurement = command("measurement");
    const staleModel = command();

    useHistoryStore.getState().execute(measurement, context);
    useDocumentStore.getState().setDocument();
    useHistoryStore.getState().execute(staleModel, context);
    useDocumentStore.getState().setSource({ kind: "python", path: "design.py" });
    useHistoryStore.getState().discardModelCommands();

    expect(measurement.execute).toHaveBeenCalledOnce();
    expect(useHistoryStore.getState().undoStack).toEqual([measurement]);
    expect(useDocumentStore.getState().isDirty).toBe(false);
  });

  it("prevents model editing tools while leaving ruler tools available", () => {
    useDocumentStore.getState().setSource({ kind: "python", path: "design.py" });

    useToolStore.getState().setTool("rectangle");
    expect(useToolStore.getState().activeTool).toBe("select");

    useToolStore.getState().setTool("ruler");
    expect(useToolStore.getState().activeTool).toBe("ruler");
  });

  it("does not reconnect a document that was detached from its live source", () => {
    useDocumentStore.getState().setSource({ kind: "python", path: "design.py" });
    expect(useDocumentStore.getState().liveUpdatesEnabled).toBe(true);

    useDocumentStore.getState().setDocument();

    expect(useDocumentStore.getState().backing.kind).toBe("document");
    expect(useDocumentStore.getState().liveUpdatesEnabled).toBe(false);
  });
});
