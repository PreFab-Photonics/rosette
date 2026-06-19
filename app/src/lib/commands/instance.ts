import type { WasmLibrary } from "@/wasm/rosette_wasm";
import { useSelectionStore } from "@/stores/selection";
import type { Command, CommandContext, ArrayParams } from "./types";
import { syncCellTree } from "./helpers";

/**
 * Command to set the full affine transform on a CellRef instance.
 *
 * Used for changing rotation, scale, or mirror on an instance.
 * The `refId` must be a synthetic ref UUID (e.g. "ref:3:0").
 */
export class SetInstanceTransformCommand implements Command {
  readonly type = "set-instance-transform";
  readonly description: string;

  constructor(
    private readonly refId: string,
    private readonly oldTransform: Float64Array,
    private readonly newTransform: Float64Array,
    description?: string,
  ) {
    this.description = description ?? "Set instance transform";
  }

  execute(ctx: CommandContext): void {
    ctx.library.set_cell_ref_transform(this.refId, this.newTransform);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    ctx.library.set_cell_ref_transform(this.refId, this.oldTransform);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

/**
 * Command to set the array repetition on a CellRef instance.
 *
 * The `refId` must be a synthetic ref UUID (e.g. "ref:3:0"). Always writes
 * through `set_cell_ref_array_vectors` so skewed/hex lattices round-trip
 * faithfully — the scalar shim collapses off-axis components and is only
 * kept for display in status-bar-style summaries.
 */
export class SetInstanceArrayCommand implements Command {
  readonly type = "set-instance-array";
  readonly description: string;

  constructor(
    private readonly refId: string,
    private readonly oldParams: ArrayParams | null,
    private readonly newParams: ArrayParams | null,
  ) {
    this.description = "Set instance array";
  }

  execute(ctx: CommandContext): void {
    this.applyParams(ctx, this.newParams);
  }

  undo(ctx: CommandContext): void {
    this.applyParams(ctx, this.oldParams);
  }

  private applyParams(ctx: CommandContext, params: ArrayParams | null): void {
    if (params && (params.columns > 1 || params.rows > 1)) {
      ctx.library.set_cell_ref_array_vectors(
        this.refId,
        params.columns,
        params.rows,
        params.colVector.x,
        params.colVector.y,
        params.rowVector.x,
        params.rowVector.y,
      );
    } else {
      // Revert to single instance
      ctx.library.set_cell_ref_array_vectors(this.refId, 1, 1, 0, 0, 0, 0);
    }
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

/** Snapshot of a single AREF captured before flattening, used for undo. */

interface AreFlattenSnapshot {
  cellName: string;
  /** Full affine transform [a, b, c, d, tx, ty] of the original AREF. */
  transform: Float64Array;
  columns: number;
  rows: number;
  /** Column displacement vector in the AREF's local (pre-transform) frame. */
  colVector: { x: number; y: number };
  /** Row displacement vector in the AREF's local (pre-transform) frame. */
  rowVector: { x: number; y: number };
}

/**
 * Command to flatten one or more AREFs into `columns * rows` individual SREFs.
 *
 * Mirror of `CreateArrayCommand` — replaces each selected AREF in the active
 * cell with N single-instance CellRefs at pre-computed transforms. Undo
 * restores the original AREFs with their repetition intact.
 *
 * Transform composition matches the renderer/flattener in
 * `rosette-core::flatten` and `rosette-core::cell`: each copy's transform is
 * `original.then(Transform::translate(col·col_vector + row·row_vector))`,
 * i.e. the lattice displacement is applied in the AREF's local coordinate
 * space BEFORE the CellRef transform. This preserves rotation, mirroring,
 * and scaling of the resulting lattice and handles skewed/hex lattices
 * correctly.
 *
 * Preconditions:
 * - All `refIds` must refer to AREFs in the active cell. The WASM
 *   `add_cell_ref_with_transform` API adds to the active cell, so a real-UUID
 *   AREF from another cell would be silently relocated here. Non-AREF inputs
 *   and AREFs not in the active cell are filtered out at snapshot time.
 */
export class FlattenArrayCommand implements Command {
  readonly type = "flatten-array";
  readonly description: string;

  /** Snapshots of the flattened AREFs (one per snapshot), captured on first execute. */
  private snapshots: AreFlattenSnapshot[] = [];

  /**
   * Currently "live" IDs that represent the AREFs in the WASM library.
   *
   * - Before first execute: the caller-provided `refIds`.
   * - After execute: IDs of the newly created SREFs (the AREFs are gone).
   * - After undo: IDs of the restored AREFs.
   *
   * The next execute/undo always deletes whatever is live before creating the
   * other form, which makes the redo path explicit rather than inferred from
   * array-length coincidences.
   */
  private liveIds: string[];

  /**
   * IDs of the AREFs that were actually snapshotted/flattened. Used to drop
   * just those IDs from `selectionToRestore` on undo while preserving any
   * other elements that happened to be selected at construction time.
   */
  private flattenedIds: Set<string> = new Set();

  /** Selection to restore on undo. Captured at construction time. */
  private readonly selectionToRestore: Set<string>;

  constructor(refIds: string[], originalSelection?: Iterable<string>) {
    this.liveIds = refIds;
    this.selectionToRestore = new Set(originalSelection ?? refIds);
    const count = refIds.length;
    this.description = count === 1 ? "Flatten array" : `Flatten ${count} arrays`;
  }

  /** Compute the total number of SREFs that would be produced by flattening `refIds`. */
  static countCopies(library: WasmLibrary, refIds: Iterable<string>): number {
    let total = 0;
    for (const id of refIds) {
      const arrayParams = library.get_cell_ref_array(id);
      if (arrayParams && arrayParams.length === 4) {
        total += Math.max(1, arrayParams[0]) * Math.max(1, arrayParams[1]);
      }
    }
    return total;
  }

  execute(ctx: CommandContext): void {
    // Snapshot AREFs on first execute so undo can restore them. Non-AREF
    // inputs are skipped here as a defense-in-depth measure (the palette
    // action pre-filters, but direct callers may not).
    //
    // NOTE: we do not verify that each AREF lives in the active cell. The
    // app's selection state is always scoped to the active cell (selection
    // is cleared on cell switch), and `add_cell_ref_with_transform` writes
    // to the active cell unconditionally. Feeding this command a real-UUID
    // AREF from a non-active cell would silently relocate its copies — so
    // callers must ensure IDs are active-cell-scoped.
    if (this.snapshots.length === 0) {
      const keptIds: string[] = [];
      for (const id of this.liveIds) {
        const arrayVectors = ctx.library.get_cell_ref_array_vectors(id);
        if (!arrayVectors || arrayVectors.length !== 6) continue;
        const refInfo = ctx.library.get_cell_ref_info(id);
        if (!refInfo) continue;

        this.snapshots.push({
          cellName: refInfo.cell_name,
          transform: new Float64Array(refInfo.transform),
          columns: arrayVectors[0],
          rows: arrayVectors[1],
          colVector: { x: arrayVectors[2], y: arrayVectors[3] },
          rowVector: { x: arrayVectors[4], y: arrayVectors[5] },
        });
        keptIds.push(id);
        this.flattenedIds.add(id);
        refInfo.free();
      }
      // Narrow liveIds to just the AREFs we actually snapshotted.
      this.liveIds = keptIds;
    }

    if (this.snapshots.length === 0) return;

    // Delete whatever is live (originals on first execute, restored AREFs on redo).
    ctx.library.remove_elements(this.liveIds);

    // Create one SREF per (col, row) position for each flattened AREF.
    const newIds: string[] = [];
    for (const snap of this.snapshots) {
      const [a, b, c, d, tx, ty] = snap.transform;
      for (let row = 0; row < snap.rows; row++) {
        for (let col = 0; col < snap.columns; col++) {
          // Lattice displacement in the AREF's local frame — may be skewed.
          const dx = col * snap.colVector.x + row * snap.rowVector.x;
          const dy = col * snap.colVector.y + row * snap.rowVector.y;
          // original.then(translate(dx, dy)): linear part unchanged,
          // translation becomes (a*dx + b*dy + tx, c*dx + d*dy + ty).
          const copyTransform = new Float64Array([
            a,
            b,
            c,
            d,
            a * dx + b * dy + tx,
            c * dx + d * dy + ty,
          ]);
          const newId = ctx.library.add_cell_ref_with_transform(snap.cellName, copyTransform);
          if (newId) newIds.push(newId);
        }
      }
    }

    this.liveIds = newIds;

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Select the newly created single-instance refs so the user can see the result.
    if (newIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(newIds));
    } else {
      useSelectionStore.getState().clearSelection();
    }
  }

  undo(ctx: CommandContext): void {
    // Remove the SREFs currently in the library.
    if (this.liveIds.length > 0) {
      ctx.library.remove_elements(this.liveIds);
    }

    // Recreate the original AREFs with their repetition (preserves skew).
    const restoredIds: string[] = [];
    for (const snap of this.snapshots) {
      const id = ctx.library.add_cell_ref_with_transform(snap.cellName, snap.transform);
      if (id) {
        ctx.library.set_cell_ref_array_vectors(
          id,
          snap.columns,
          snap.rows,
          snap.colVector.x,
          snap.colVector.y,
          snap.rowVector.x,
          snap.rowVector.y,
        );
        restoredIds.push(id);
      }
    }

    this.liveIds = restoredIds;

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Restore the pre-flatten selection: keep everything that wasn't
    // flattened (still has valid UUIDs), then add the restored AREF IDs.
    // The original AREF UUIDs are stale — the AREFs exist again but have
    // fresh UUIDs from `add_cell_ref_with_transform`.
    const restoredSelection = new Set<string>();
    for (const id of this.selectionToRestore) {
      if (!this.flattenedIds.has(id)) {
        restoredSelection.add(id);
      }
    }
    for (const id of restoredIds) {
      restoredSelection.add(id);
    }

    if (restoredSelection.size > 0) {
      useSelectionStore.getState().setSelection(restoredSelection);
    } else {
      useSelectionStore.getState().clearSelection();
    }
  }
}

// =============================================================================
// Cell Commands
// =============================================================================
