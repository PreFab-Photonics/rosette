import { useSelectionStore } from "@/stores/selection";
import { useExplorerStore } from "@/stores/explorer";
import { type ClipboardSnapshot } from "@/stores/clipboard";
import { usePathStore } from "@/stores/path";
import type { Command, CommandContext } from "./types";
import { snapshotElements, restoreSnapshots, syncCellTree } from "./helpers";

/**
 * Command to add a new cell.
 *
 * Creates a cell with the given name. On undo, removes it.
 */
export class AddCellCommand implements Command {
  readonly type = "add-cell";
  readonly description: string;

  private cellName: string;

  constructor(name: string) {
    this.cellName = name;
    this.description = `Add cell "${name}"`;
  }

  execute(ctx: CommandContext): void {
    ctx.library.add_cell(this.cellName);
    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    ctx.library.remove_cell(this.cellName);
    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

/**
 * Command to add a new child cell under a parent.
 *
 * Creates a cell with the given name and adds a CellRef to it from the
 * parent cell. On undo, removes both the reference and the cell.
 */
export class AddChildCellCommand implements Command {
  readonly type = "add-child-cell";
  readonly description: string;

  constructor(
    private readonly cellName: string,
    private readonly parentCellName: string,
  ) {
    this.description = `Add child cell "${cellName}" to "${parentCellName}"`;
  }

  execute(ctx: CommandContext): void {
    // Create the new cell in WASM for immediate UI feedback
    ctx.library.add_cell(this.cellName);
    ctx.library.add_cell_ref_to(this.parentCellName, this.cellName, 0, 0);

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    // remove_cell_cascade removes the cell and all CellRefs pointing to it
    ctx.library.remove_cell_cascade(this.cellName);

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

/**
 * Command to delete a cell.
 *
 * Snapshots the cell's elements, origin, and parent CellRefs on first execute
 * so that undo fully restores the cell with all its content and references.
 */
export class DeleteCellCommand implements Command {
  readonly type = "delete-cell";
  readonly description: string;

  private cellName: string;
  private elementSnapshots: ClipboardSnapshot[] = [];
  private cellOrigin: [number, number] = [0, 0];
  private parentRefs: Array<{ parent: string; transform: Float64Array }> = [];

  constructor(name: string) {
    this.cellName = name;
    this.description = `Delete cell "${name}"`;
  }

  execute(ctx: CommandContext): void {
    // Snapshot on first execute only (same pattern as DeleteElementsCommand)
    if (this.elementSnapshots.length === 0 && this.parentRefs.length === 0) {
      // Save origin
      const origin = ctx.library.get_cell_origin_by_name(this.cellName);
      if (origin) {
        this.cellOrigin = [origin[0], origin[1]];
      }

      // Save parent CellRefs that point to this cell
      const parents = ctx.library.get_cell_ref_parents(this.cellName);
      if (Array.isArray(parents)) {
        this.parentRefs = parents.map((p: { parent: string; transform: number[] }) => ({
          parent: p.parent,
          transform: new Float64Array(p.transform),
        }));
      }

      // Snapshot elements: temporarily switch active cell to target,
      // grab all IDs, snapshot them, then switch back
      const prevActive = ctx.library.active_cell_name();
      ctx.library.set_active_cell(this.cellName);
      const allIds = ctx.library.get_all_ids();
      if (allIds.length > 0) {
        this.elementSnapshots = snapshotElements(ctx.library, allIds);
      }
      if (prevActive) {
        ctx.library.set_active_cell(prevActive);
      }
    }

    ctx.library.remove_cell_cascade(this.cellName);
    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    // Re-create the cell
    ctx.library.add_cell(this.cellName);

    // Restore origin
    const prevActive = ctx.library.active_cell_name();
    ctx.library.set_active_cell(this.cellName);
    ctx.library.set_cell_origin(this.cellOrigin[0], this.cellOrigin[1]);

    // Restore elements
    if (this.elementSnapshots.length > 0) {
      restoreSnapshots(ctx.library, this.elementSnapshots);
    }

    // Switch back before restoring parent refs
    if (prevActive) {
      ctx.library.set_active_cell(prevActive);
    }

    // Restore parent CellRefs
    for (const ref of this.parentRefs) {
      ctx.library.add_cell_ref_to_with_transform(ref.parent, this.cellName, ref.transform);
    }

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

/**
 * Command to flatten a cell by resolving all CellRef instances.
 *
 * Replaces all CellRef elements in the target cell with the resolved
 * polygon geometry (with transforms applied). Direct polygons, paths,
 * and text are preserved. Child cell definitions remain in the library.
 *
 * Fully undoable: on undo, the original elements (including CellRefs)
 * are restored from snapshots.
 */
export class FlattenCellCommand implements Command {
  readonly type = "flatten-cell";
  readonly description: string;

  private cellName: string;
  private originalSnapshots: ClipboardSnapshot[] = [];
  private originalOrigin: [number, number] = [0, 0];

  constructor(name: string) {
    this.cellName = name;
    this.description = `Flatten cell "${name}"`;
  }

  execute(ctx: CommandContext): void {
    // Switch to the target cell
    const prevActive = ctx.library.active_cell_name();
    ctx.library.set_active_cell(this.cellName);

    // Snapshot on first execute only (for undo)
    if (this.originalSnapshots.length === 0) {
      const origin = ctx.library.get_cell_origin();
      if (origin) {
        this.originalOrigin = [origin[0], origin[1]];
      }

      const allIds = ctx.library.get_all_ids();
      if (allIds.length > 0) {
        this.originalSnapshots = snapshotElements(ctx.library, allIds);
      }
    }

    // Remove path metadata for current element IDs before flattening.
    // On first execute these are the original IDs; on redo (after undo)
    // these are the IDs that restoreSnapshots created, which differ from
    // the originals. Querying live IDs each time keeps this correct.
    const currentIds = ctx.library.get_all_ids();
    const pathStore = usePathStore.getState();
    const pathIds = currentIds.filter((id) => pathStore.pathMetadata.has(id));
    if (pathIds.length > 0) {
      pathStore.removePathMetadataMany(pathIds);
    }

    // Perform the flatten — this clears the cell and re-populates with resolved polygons
    ctx.library.flatten_active_cell();

    // Clear selection (old IDs are invalid)
    useSelectionStore.getState().clearSelection();

    // Restore active cell if it was different
    if (prevActive && prevActive !== this.cellName) {
      ctx.library.set_active_cell(prevActive);
    }

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    // Switch to the target cell
    const prevActive = ctx.library.active_cell_name();
    ctx.library.set_active_cell(this.cellName);

    // Clear the flattened content
    ctx.library.clear_active_cell();

    // Restore origin
    ctx.library.set_cell_origin(this.originalOrigin[0], this.originalOrigin[1]);

    // Restore original elements (polygons, paths, CellRefs, text)
    // restoreSnapshots handles path metadata restoration automatically
    if (this.originalSnapshots.length > 0) {
      restoreSnapshots(ctx.library, this.originalSnapshots);
    }

    // Clear selection
    useSelectionStore.getState().clearSelection();

    // Restore active cell if it was different
    if (prevActive && prevActive !== this.cellName) {
      ctx.library.set_active_cell(prevActive);
    }

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

/**
 * Command to set the origin of the active cell.
 *
 * Updates both the library (persistent data) and the renderer
 * (crosshair position). On undo, reverts to the previous origin.
 */
export class SetCellOriginCommand implements Command {
  readonly type = "set-cell-origin";
  readonly description = "Set cell origin";

  constructor(
    private readonly oldX: number,
    private readonly oldY: number,
    private readonly newX: number,
    private readonly newY: number,
  ) {}

  execute(ctx: CommandContext): void {
    ctx.library.set_cell_origin(this.newX, this.newY);
    ctx.renderer.set_crosshair_origin(this.newX, this.newY);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    ctx.library.set_cell_origin(this.oldX, this.oldY);
    ctx.renderer.set_crosshair_origin(this.oldX, this.oldY);
    ctx.renderer.mark_dirty();
  }
}

/**
 * Command to rename a cell.
 *
 * On undo, reverts to the old name.
 */
export class RenameCellCommand implements Command {
  readonly type = "rename-cell";
  readonly description: string;

  constructor(
    private readonly oldName: string,
    private readonly newName: string,
  ) {
    this.description = `Rename cell "${oldName}" to "${newName}"`;
  }

  execute(ctx: CommandContext): void {
    // Update explorer active cell before tree sync so setCellTree finds it
    const explorer = useExplorerStore.getState();
    if (explorer.activeCell === this.oldName) {
      explorer.setActiveCell(this.newName);
    }
    ctx.library.rename_cell(this.oldName, this.newName);
    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    const explorer = useExplorerStore.getState();
    if (explorer.activeCell === this.newName) {
      explorer.setActiveCell(this.oldName);
    }
    ctx.library.rename_cell(this.newName, this.oldName);
    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

// =============================================================================
// Cell Instance Commands
// =============================================================================

/**
 * Command to place a cell reference (instance) in the active cell.
 *
 * Adds a CellRef element at the given position. The referenced cell's geometry
 * is resolved on-the-fly during rendering, so changes to the child cell are
 * always reflected in the parent.
 */
export class AddCellRefCommand implements Command {
  readonly type = "add-cell-ref";
  readonly description: string;

  /** UUID of the CellRef element (populated after execute). */
  private elementId: string | null = null;

  constructor(
    private readonly cellName: string,
    private readonly x: number,
    private readonly y: number,
  ) {
    this.description = `Place instance of "${cellName}"`;
  }

  execute(ctx: CommandContext): void {
    const id = ctx.library.add_cell_ref(this.cellName, this.x, this.y);

    if (id) {
      this.elementId = id;
      syncCellTree(ctx.library);
      ctx.renderer.sync_from_library(ctx.library);
      ctx.renderer.mark_dirty();

      // Auto-select the newly placed instance.
      // Selection uses synthetic ref UUIDs ("ref:{elementIndex}:0").
      const elemIdx = ctx.library.get_element_index(id);
      if (elemIdx >= 0) {
        useSelectionStore.getState().select(`ref:${elemIdx}:0`);
      }
    }
  }

  undo(ctx: CommandContext): void {
    if (this.elementId) {
      ctx.library.remove_element(this.elementId);
      syncCellTree(ctx.library);
      ctx.renderer.sync_from_library(ctx.library);
      ctx.renderer.mark_dirty();

      const { selectedIds, removeFromSelection } = useSelectionStore.getState();
      if (selectedIds.has(this.elementId)) {
        removeFromSelection(this.elementId);
      }
    }
  }
}

// =============================================================================
// Quick-add helpers
// =============================================================================

/** Snap a value to the nearest grid point. */
