/**
 * History store for undo/redo functionality.
 *
 * Manages command stacks and provides methods for executing,
 * undoing, and redoing commands.
 */

import { create } from "zustand";
import type { Command, CommandContext } from "@/lib/commands";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useStatusMessageStore } from "@/stores/status-message";

/** Maximum number of commands to keep in history. */
const MAX_HISTORY_DEPTH = 100;

/**
 * History state interface.
 */
interface HistoryState {
  /** Stack of commands that can be undone. */
  undoStack: Command[];

  /** Stack of commands that can be redone. */
  redoStack: Command[];

  /** Whether undo is available. */
  canUndo: boolean;

  /** Whether redo is available. */
  canRedo: boolean;

  /**
   * Execute a command and add it to the undo stack.
   *
   * Clears the redo stack since we're branching history.
   */
  execute: (command: Command, ctx: CommandContext) => void;

  /**
   * Undo the last command.
   *
   * Moves it to the redo stack.
   */
  undo: (ctx: CommandContext) => void;

  /**
   * Redo the last undone command.
   *
   * Moves it back to the undo stack.
   */
  redo: (ctx: CommandContext) => void;

  /**
   * Clear all history.
   */
  clear: () => void;

  /**
   * Push a command to the undo stack without executing it.
   *
   * Useful when the action has already been performed (e.g., drag operations)
   * and we just need to record it for undo.
   */
  pushCommand: (command: Command) => void;
}

/**
 * Zustand store for history management.
 */
export const useHistoryStore = create<HistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],
  canUndo: false,
  canRedo: false,

  execute: (command, ctx) => {
    // Execute the command — if it throws (e.g., validation error from
    // WASM), show the error in the status bar and skip adding to history.
    try {
      command.execute(ctx);
    } catch (e) {
      useStatusMessageStore.getState().show(String(e), "warn");
      return;
    }

    // Notify overlays (e.g., instance labels) that library state changed.
    useWasmContextStore.getState().bumpSyncGeneration();

    set((state) => {
      // Add to undo stack, respecting max depth
      const newUndoStack = [...state.undoStack, command];
      if (newUndoStack.length > MAX_HISTORY_DEPTH) {
        newUndoStack.shift(); // Remove oldest
      }

      return {
        undoStack: newUndoStack,
        redoStack: [], // Clear redo stack on new action
        canUndo: true,
        canRedo: false,
      };
    });
  },

  undo: (ctx) => {
    const { undoStack } = get();
    if (undoStack.length === 0) return;

    // Pop the last command
    const command = undoStack[undoStack.length - 1];

    // Undo it — catch errors to avoid corrupting the stack.
    try {
      command.undo(ctx);
    } catch (e) {
      useStatusMessageStore.getState().show(String(e), "warn");
      return;
    }
    useWasmContextStore.getState().bumpSyncGeneration();

    set((state) => {
      const newUndoStack = state.undoStack.slice(0, -1);
      const newRedoStack = [...state.redoStack, command];

      return {
        undoStack: newUndoStack,
        redoStack: newRedoStack,
        canUndo: newUndoStack.length > 0,
        canRedo: true,
      };
    });
  },

  redo: (ctx) => {
    const { redoStack } = get();
    if (redoStack.length === 0) return;

    // Pop the last undone command
    const command = redoStack[redoStack.length - 1];

    // Re-execute it — catch errors to avoid corrupting the stack.
    try {
      command.execute(ctx);
    } catch (e) {
      useStatusMessageStore.getState().show(String(e), "warn");
      return;
    }
    useWasmContextStore.getState().bumpSyncGeneration();

    set((state) => {
      const newRedoStack = state.redoStack.slice(0, -1);
      const newUndoStack = [...state.undoStack, command];

      return {
        undoStack: newUndoStack,
        redoStack: newRedoStack,
        canUndo: true,
        canRedo: newRedoStack.length > 0,
      };
    });
  },

  clear: () => {
    set({
      undoStack: [],
      redoStack: [],
      canUndo: false,
      canRedo: false,
    });
  },

  pushCommand: (command) => {
    set((state) => {
      // Add to undo stack, respecting max depth
      const newUndoStack = [...state.undoStack, command];
      if (newUndoStack.length > MAX_HISTORY_DEPTH) {
        newUndoStack.shift(); // Remove oldest
      }

      return {
        undoStack: newUndoStack,
        redoStack: [], // Clear redo stack on new action
        canUndo: true,
        canRedo: false,
      };
    });
  },
}));
