import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";
import type { RulerUnit } from "@/stores/ruler";

/**
 * Snapshot of an element's data for restoration.
 * Re-exported from clipboard store for command use.
 */
export type { ElementSnapshot } from "@/stores/clipboard";

/**
 * Context passed to commands for executing operations.
 */
export interface CommandContext {
  library: WasmLibrary;
  renderer: WasmRenderer;
}

/**
 * Base interface for all undoable commands.
 */
export interface Command {
  /** Command type identifier for debugging. */
  readonly type: string;

  /** Human-readable description of the command. */
  readonly description: string;

  /** Execute the command (first time or redo). */
  execute(ctx: CommandContext): void;

  /** Undo the command. */
  undo(ctx: CommandContext): void;
}

/**
 * Patch describing user-editable ruler properties.
 */
export interface RulerPropsPatch {
  /** New user-editable label. `undefined` means "don't change". */
  label?: string;
  /** New display-unit override. `undefined` means "don't change". */
  unitOverride?: RulerUnit;
}

/**
 * Array repetition parameters for an instance.
 *
 * The lattice is described by two displacement vectors (columns, rows) in the
 * CellRef's local (pre-transform) coordinate space. A rectangular (axis-aligned)
 * AREF has `colVector.y === 0` and `rowVector.x === 0`; anything else is a
 * skewed/hex lattice.
 */
export interface ArrayParams {
  columns: number;
  rows: number;
  /** Column displacement vector (step from one column to the next). */
  colVector: { x: number; y: number };
  /** Row displacement vector (step from one row to the next). */
  rowVector: { x: number; y: number };
}

export type BooleanOpType = "union" | "subtract" | "intersect" | "xor";
