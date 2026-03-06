import { create } from "zustand";

/**
 * Available tool types.
 */
export type ToolType =
  | "select"
  | "pan"
  | "laser"
  | "zoom"
  | "rectangle"
  | "move"
  | "polygon"
  | "ruler";

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

  setTool: (tool) => set({ activeTool: tool, toolSetAt: Date.now() }),
}));
