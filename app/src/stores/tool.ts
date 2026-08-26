import { create } from "zustand";
import { isSourceBacked } from "@/stores/document";
import { useStatusMessageStore } from "@/stores/status-message";

/**
 * Available tool types.
 *
 * Ruler sub-tools share the same RulerOverlay + hook dispatch. They differ
 * only in what `Ruler` variant is constructed and how creation clicks are
 * interpreted. See ROS-556 for the full family plan.
 */
export type ToolType =
  | "select"
  | "pan"
  | "laser"
  | "zoom"
  | "rectangle"
  | "move"
  | "polygon"
  | "path"
  | "ruler"
  | "ruler-super"
  | "ruler-polyline"
  | "ruler-angle"
  | "ruler-radius"
  | "text";

/** True for any ruler sub-tool (simple or any of the specialized kinds). */
export function isRulerTool(tool: ToolType): boolean {
  return (
    tool === "ruler" ||
    tool === "ruler-super" ||
    tool === "ruler-polyline" ||
    tool === "ruler-angle" ||
    tool === "ruler-radius"
  );
}

/** True when a tool can mutate layout geometry. */
export function isModelEditingTool(tool: ToolType): boolean {
  return (
    tool === "rectangle" ||
    tool === "move" ||
    tool === "polygon" ||
    tool === "path" ||
    tool === "text"
  );
}

/**
 * Tool state for managing the active drawing/interaction tool.
 */
interface ToolState {
  /** Currently active tool. */
  activeTool: ToolType;
  /** Timestamp (ms) when the tool was last changed. */
  toolSetAt: number;

  /** Set the active tool. */
  setTool: (tool: ToolType) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  activeTool: "select",
  toolSetAt: 0,

  setTool: (tool) => {
    if (isSourceBacked() && isModelEditingTool(tool)) {
      useStatusMessageStore
        .getState()
        .show("Live source previews are read-only. Choose Edit a copy to make changes.", "warn");
      return;
    }
    set({ activeTool: tool, toolSetAt: Date.now() });
  },
}));
