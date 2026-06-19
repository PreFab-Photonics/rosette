import { useSelectionStore } from "@/stores/selection";
import {
  useClipboardStore,
  type ClipboardSnapshot,
  type ElementSnapshot,
  type TextSnapshot,
} from "@/stores/clipboard";
import { computeAlignmentDeltas, type AlignType, type AlignmentDelta } from "@/lib/align";
import { usePathStore, DEFAULT_NUM_ARC_POINTS, type PathMetadata } from "@/stores/path";
import { useImageStore, imageIdToKey } from "@/stores/image";
import { computeActualCornerRadius } from "@/lib/path";
import type { Command, CommandContext, BooleanOpType } from "./types";
import {
  snapshotElements,
  restoreSnapshots,
  offsetSnapshot,
  warnBendRadiusReductions,
  syncCellTree,
} from "./helpers";

/**
 * Command to create a rectangle element.
 */
export class CreateRectangleCommand implements Command {
  readonly type = "create-rectangle";
  readonly description: string;

  /** Created element ID (populated after execute). */
  private elementId: string | null = null;

  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly width: number,
    private readonly height: number,
    private readonly layer: number,
    private readonly datatype: number = 0,
  ) {
    this.description = `Create rectangle at (${x}, ${y})`;
  }

  execute(ctx: CommandContext): void {
    const id = ctx.library.add_rectangle(
      this.x,
      this.y,
      this.width,
      this.height,
      this.layer,
      this.datatype,
    );

    if (id) {
      this.elementId = id;
      ctx.renderer.sync_from_library(ctx.library);
      ctx.renderer.mark_dirty();
      useSelectionStore.getState().select(id);
    }
  }

  undo(ctx: CommandContext): void {
    if (this.elementId) {
      ctx.library.remove_element(this.elementId);
      ctx.renderer.sync_from_library(ctx.library);
      ctx.renderer.mark_dirty();

      // Clear selection if the deleted element was selected
      const { selectedIds, removeFromSelection } = useSelectionStore.getState();
      if (selectedIds.has(this.elementId)) {
        removeFromSelection(this.elementId);
      }
    }
  }

  /** Get the created element ID (available after execute). */
  getElementId(): string | null {
    return this.elementId;
  }
}

/**
 * Command to delete one or more elements.
 *
 * Handles both regular polygon UUIDs and synthetic ref UUIDs (from CellRef instances).
 */
export class DeleteElementsCommand implements Command {
  readonly type = "delete-elements";
  readonly description: string;

  /** Snapshots of deleted elements for restoration. */
  private snapshots: ClipboardSnapshot[] = [];

  /** New IDs assigned to restored elements (for redo tracking). */
  private restoredIds: string[] = [];

  constructor(private readonly elementIds: string[]) {
    const count = elementIds.length;
    this.description = count === 1 ? "Delete element" : `Delete ${count} elements`;
  }

  execute(ctx: CommandContext): void {
    // If this is a redo, we need to use restoredIds instead of original elementIds
    let idsToDelete = this.restoredIds.length > 0 ? this.restoredIds : this.elementIds;

    // Snapshot elements before deleting (only on first execute)
    if (this.snapshots.length === 0) {
      this.snapshots = snapshotElements(ctx.library, idsToDelete);
    }

    // Clean up path metadata for any deleted paths
    usePathStore.getState().removePathMetadataMany(idsToDelete);

    // Separate image IDs from WASM element IDs
    const imageIds: string[] = [];
    const wasmIds: string[] = [];
    for (const id of idsToDelete) {
      if (id.startsWith("img:")) {
        imageIds.push(id);
      } else {
        wasmIds.push(id);
      }
    }

    // Remove images from the image store
    for (const imgId of imageIds) {
      useImageStore.getState().removeImage(imageIdToKey(imgId));
    }

    // Delete WASM elements in a single batch operation
    if (wasmIds.length > 0) {
      ctx.library.remove_elements(wasmIds);
    }

    // Clear restored IDs for next potential redo
    this.restoredIds = [];

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Clear selection
    useSelectionStore.getState().clearSelection();
  }

  undo(ctx: CommandContext): void {
    this.restoredIds = restoreSnapshots(ctx.library, this.snapshots);

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Select restored elements
    if (this.restoredIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(this.restoredIds));
    }
  }
}

/**
 * Command to paste elements from clipboard.
 *
 * Creates new elements from clipboard snapshots at their original positions.
 */
export class PasteElementsCommand implements Command {
  readonly type = "paste-elements";
  readonly description: string;

  /** IDs of created elements (for undo). */
  private createdIds: string[] = [];

  /** IDs of created elements that are paths (for path metadata cleanup on undo). */
  private createdPathIds: string[] = [];

  /** Snapshots to paste (captured at construction). */
  private readonly snapshots: ClipboardSnapshot[];

  constructor() {
    const { elements } = useClipboardStore.getState();
    // Deep-copy snapshots so clipboard mutations don't affect this command
    this.snapshots = elements.map((e): ClipboardSnapshot => {
      if (e.type === "cell-ref") {
        return {
          type: "cell-ref",
          cellName: e.cellName,
          transform: new Float64Array(e.transform),
          repetition: e.repetition ? new Float64Array(e.repetition) : null,
        };
      }
      if (e.type === "text") {
        return { ...e };
      }
      if (e.type === "image") {
        return { ...e };
      }
      if (e.type === "path") {
        return {
          type: "path",
          waypoints: e.waypoints.map((wp) => ({ ...wp })),
          width: e.width,
          cornerRadius: e.cornerRadius,
          numArcPoints: e.numArcPoints,
          layer: e.layer,
          datatype: e.datatype,
        };
      }
      return {
        type: "polygon",
        vertices: new Float64Array(e.vertices),
        layer: e.layer,
        datatype: e.datatype,
      };
    });
    const count = this.snapshots.length;
    this.description = count === 1 ? "Paste element" : `Paste ${count} elements`;
  }

  execute(ctx: CommandContext): void {
    if (this.snapshots.length === 0) return;

    this.createdIds = restoreSnapshots(ctx.library, this.snapshots);

    // Track which created elements are paths (for metadata cleanup on undo)
    this.createdPathIds = this.createdIds.filter((id) =>
      usePathStore.getState().pathMetadata.has(id),
    );

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Select pasted elements
    if (this.createdIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(this.createdIds));
    }
  }

  undo(ctx: CommandContext): void {
    // Clean up path metadata for any pasted paths
    usePathStore.getState().removePathMetadataMany(this.createdPathIds);

    // Separate image IDs from WASM element IDs
    const imageIds: string[] = [];
    const wasmIds: string[] = [];
    for (const id of this.createdIds) {
      if (id.startsWith("img:")) {
        imageIds.push(id);
      } else {
        wasmIds.push(id);
      }
    }

    // Remove pasted images
    for (const imgId of imageIds) {
      useImageStore.getState().removeImage(imageIdToKey(imgId));
    }

    // Delete the pasted WASM elements in a single batch operation
    if (wasmIds.length > 0) {
      ctx.library.remove_elements(wasmIds);
    }

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Clear selection
    useSelectionStore.getState().clearSelection();
  }
}

/**
 * Command to duplicate selected elements in place.
 *
 * Creates copies of elements at their original positions.
 */
export class DuplicateElementsCommand implements Command {
  readonly type = "duplicate-elements";
  readonly description: string;

  /** Snapshots of elements to duplicate. */
  private snapshots: ClipboardSnapshot[] = [];

  /** IDs of created duplicates (for undo). */
  private createdIds: string[] = [];

  /** IDs of created elements that are paths (for path metadata cleanup on undo). */
  private createdPathIds: string[] = [];

  constructor(private readonly elementIds: string[]) {
    const count = elementIds.length;
    this.description = count === 1 ? "Duplicate element" : `Duplicate ${count} elements`;
  }

  execute(ctx: CommandContext): void {
    // Snapshot elements on first execute
    if (this.snapshots.length === 0) {
      this.snapshots = snapshotElements(ctx.library, this.elementIds);
    }

    this.createdIds = restoreSnapshots(ctx.library, this.snapshots);

    // Track which created elements are paths (for metadata cleanup on undo)
    this.createdPathIds = this.createdIds.filter((id) =>
      usePathStore.getState().pathMetadata.has(id),
    );

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Select duplicated elements
    if (this.createdIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(this.createdIds));
    }
  }

  undo(ctx: CommandContext): void {
    // Clean up path metadata for any duplicated paths
    usePathStore.getState().removePathMetadataMany(this.createdPathIds);

    // Separate image IDs from WASM element IDs
    const imageIds: string[] = [];
    const wasmIds: string[] = [];
    for (const id of this.createdIds) {
      if (id.startsWith("img:")) {
        imageIds.push(id);
      } else {
        wasmIds.push(id);
      }
    }

    // Remove duplicated images
    for (const imgId of imageIds) {
      useImageStore.getState().removeImage(imageIdToKey(imgId));
    }

    // Delete the duplicated WASM elements in a single batch operation
    if (wasmIds.length > 0) {
      ctx.library.remove_elements(wasmIds);
    }

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Restore selection to original elements
    if (this.elementIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(this.elementIds));
    } else {
      useSelectionStore.getState().clearSelection();
    }
  }
}

/**
 * Command to create an array of duplicated elements.
 *
 * Duplicates the given elements in a grid pattern with the specified
 * number of columns, rows, and lattice vectors (column and row
 * displacement vectors, in world coordinates). The original elements
 * remain at grid position (0, 0); copies are created for all other grid
 * positions. Supports skewed/hex lattices via non-orthogonal vectors —
 * a rectangular array has `colVector.y === 0` and `rowVector.x === 0`.
 */
export class CreateArrayCommand implements Command {
  readonly type = "create-array";
  readonly description: string;

  /** Snapshots of the source elements. */
  private snapshots: ClipboardSnapshot[] = [];

  /** IDs of all created copies (for undo). */
  private createdIds: string[] = [];

  /** IDs of created elements that are paths (for path metadata cleanup on undo). */
  private createdPathIds: string[] = [];

  constructor(
    private readonly elementIds: string[],
    private readonly columns: number,
    private readonly rows: number,
    /** Column displacement vector in world units (step from column k to k+1). */
    private readonly colVector: { x: number; y: number },
    /** Row displacement vector in world units (step from row k to k+1). */
    private readonly rowVector: { x: number; y: number },
  ) {
    const copies = columns * rows - 1;
    this.description = copies === 1 ? "Create array (1 copy)" : `Create array (${copies} copies)`;
  }

  execute(ctx: CommandContext): void {
    // Snapshot source elements on first execute
    if (this.snapshots.length === 0) {
      this.snapshots = snapshotElements(ctx.library, this.elementIds);
    }

    this.createdIds = [];
    const allOffsetSnapshots: ClipboardSnapshot[] = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        // Skip the origin position (that's where the original elements already are)
        if (row === 0 && col === 0) continue;

        const dx = col * this.colVector.x + row * this.rowVector.x;
        const dy = col * this.colVector.y + row * this.rowVector.y;

        const offsetSnaps = this.snapshots.map((s) => offsetSnapshot(s, dx, dy));
        const ids = restoreSnapshots(ctx.library, offsetSnaps);
        this.createdIds.push(...ids);
        allOffsetSnapshots.push(...offsetSnaps);
      }
    }

    // Track which created elements are paths (for metadata cleanup on undo)
    this.createdPathIds = this.createdIds.filter((id) =>
      usePathStore.getState().pathMetadata.has(id),
    );

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Select all newly created copies
    if (this.createdIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set([...this.elementIds, ...this.createdIds]));
    }
  }

  undo(ctx: CommandContext): void {
    // Clean up path metadata for any array-created paths
    usePathStore.getState().removePathMetadataMany(this.createdPathIds);

    // Separate image IDs from WASM element IDs
    const imageIds: string[] = [];
    const wasmIds: string[] = [];
    for (const id of this.createdIds) {
      if (id.startsWith("img:")) {
        imageIds.push(id);
      } else {
        wasmIds.push(id);
      }
    }

    // Remove array-created images
    for (const imgId of imageIds) {
      useImageStore.getState().removeImage(imageIdToKey(imgId));
    }

    // Delete array-created WASM elements
    if (wasmIds.length > 0) {
      ctx.library.remove_elements(wasmIds);
    }

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Restore selection to original elements
    if (this.elementIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(this.elementIds));
    } else {
      useSelectionStore.getState().clearSelection();
    }
  }
}

/**
 * Command to create a polygon element.
 */
export class CreatePolygonCommand implements Command {
  readonly type = "create-polygon";
  readonly description: string;

  /** Created element ID (populated after execute). */
  private elementId: string | null = null;

  constructor(
    private readonly points: Float64Array,
    private readonly layer: number,
    private readonly datatype: number = 0,
  ) {
    this.description = `Create polygon with ${points.length / 2} vertices`;
  }

  execute(ctx: CommandContext): void {
    const id = ctx.library.add_polygon(this.points, this.layer, this.datatype);

    if (id) {
      this.elementId = id;
      ctx.renderer.sync_from_library(ctx.library);
      ctx.renderer.mark_dirty();
      useSelectionStore.getState().select(id);
    }
  }

  undo(ctx: CommandContext): void {
    if (this.elementId) {
      ctx.library.remove_element(this.elementId);
      ctx.renderer.sync_from_library(ctx.library);
      ctx.renderer.mark_dirty();

      // Clear selection if the deleted element was selected
      const { selectedIds, removeFromSelection } = useSelectionStore.getState();
      if (selectedIds.has(this.elementId)) {
        removeFromSelection(this.elementId);
      }
    }
  }

  /** Get the created element ID (available after execute). */
  getElementId(): string | null {
    return this.elementId;
  }
}

/**
 * Command to create a path (waveguide) polygon from a centerline and width.
 *
 * Uses the Rust WASM `create_path_rounded` to generate a ribbon polygon with
 * circular-arc bends at interior corners when `cornerRadius > 0`.
 */
export class CreatePathCommand implements Command {
  readonly type = "create-path";
  readonly description: string;

  /** Created element ID (populated after execute). */
  private elementId: string | null = null;

  /** Path metadata for undo/redo management. */
  private metadata: PathMetadata | null = null;

  constructor(
    private readonly points: Float64Array,
    private readonly width: number,
    private readonly layer: number,
    private readonly datatype: number = 0,
    private readonly waypoints?: { x: number; y: number }[],
    private readonly cornerRadius: number = 0,
    private readonly numArcPoints: number = DEFAULT_NUM_ARC_POINTS,
  ) {
    this.description = `Create path with ${points.length / 2} waypoints`;
  }

  execute(ctx: CommandContext): void {
    const id = ctx.library.create_path_rounded(
      this.points,
      this.width,
      this.cornerRadius,
      this.numArcPoints,
      this.layer,
      this.datatype,
    );

    if (id) {
      this.elementId = id;

      // Restore path metadata on redo (metadata is set after first execute by the caller,
      // or by the command itself on redo if waypoints were provided).
      if (this.metadata) {
        // Ensure actual radius is populated (may be missing from older metadata)
        this.metadata.actualCornerRadius = computeActualCornerRadius(
          this.metadata.waypoints,
          this.metadata.cornerRadius,
        );
        usePathStore.getState().setPathMetadata(id, this.metadata);
      } else if (this.waypoints) {
        this.metadata = {
          waypoints: this.waypoints,
          width: this.width,
          cornerRadius: this.cornerRadius,
          actualCornerRadius: computeActualCornerRadius(this.waypoints, this.cornerRadius),
          numArcPoints: this.numArcPoints,
          layer: this.layer,
          datatype: this.datatype,
        };
        usePathStore.getState().setPathMetadata(id, this.metadata);
      }

      ctx.renderer.sync_from_library(ctx.library);
      ctx.renderer.mark_dirty();
      useSelectionStore.getState().select(id);

      // Warn if any corners had their bend radius auto-reduced
      if (this.waypoints) {
        warnBendRadiusReductions(this.waypoints, this.cornerRadius);
      }
    }
  }

  undo(ctx: CommandContext): void {
    if (this.elementId) {
      // Snapshot metadata before removing so redo can restore it
      if (!this.metadata) {
        this.metadata = usePathStore.getState().pathMetadata.get(this.elementId) ?? null;
      }

      usePathStore.getState().removePathMetadata(this.elementId);
      ctx.library.remove_element(this.elementId);
      ctx.renderer.sync_from_library(ctx.library);
      ctx.renderer.mark_dirty();

      const { selectedIds, removeFromSelection } = useSelectionStore.getState();
      if (selectedIds.has(this.elementId)) {
        removeFromSelection(this.elementId);
      }
    }
  }

  /** Get the created element ID (available after execute). */
  getElementId(): string | null {
    return this.elementId;
  }
}

/**
 * Command to edit a path's properties (width, waypoints, or waypoint removal).
 *
 * Uses snapshot-delete-recreate: removes the old path element, creates a new one
 * with updated parameters, and manages path metadata for undo/redo.
 */
export class EditPathCommand implements Command {
  readonly type = "edit-path";
  readonly description: string;

  /** Current element ID (changes on each execute/undo cycle). */
  private currentId: string;

  /** Original metadata (for undo). */
  private readonly oldMeta: PathMetadata;

  /** New metadata (for execute/redo). */
  private readonly newMeta: PathMetadata;

  constructor(
    elementId: string,
    oldMeta: PathMetadata,
    newMeta: PathMetadata,
    description: string,
  ) {
    this.currentId = elementId;
    this.oldMeta = oldMeta;
    this.newMeta = newMeta;
    this.description = description;
  }

  execute(ctx: CommandContext): void {
    this.currentId = this.rebuildPath(ctx, this.currentId, this.newMeta);
  }

  undo(ctx: CommandContext): void {
    this.currentId = this.rebuildPath(ctx, this.currentId, this.oldMeta);
  }

  private rebuildPath(ctx: CommandContext, oldId: string, meta: PathMetadata): string {
    const flatPoints = new Float64Array(meta.waypoints.length * 2);
    for (let i = 0; i < meta.waypoints.length; i++) {
      flatPoints[i * 2] = meta.waypoints[i].x;
      flatPoints[i * 2 + 1] = meta.waypoints[i].y;
    }

    ctx.library.remove_element(oldId);
    const newId = ctx.library.create_path_rounded(
      flatPoints,
      meta.width,
      meta.cornerRadius,
      meta.numArcPoints ?? DEFAULT_NUM_ARC_POINTS,
      meta.layer,
      meta.datatype,
    );

    if (newId) {
      usePathStore.getState().removePathMetadata(oldId);
      usePathStore.getState().setPathMetadata(newId, {
        ...meta,
        actualCornerRadius: computeActualCornerRadius(meta.waypoints, meta.cornerRadius),
      });
      ctx.renderer.sync_from_library(ctx.library);
      ctx.renderer.mark_dirty();
      useSelectionStore.getState().select(newId);

      // Warn if any corners had their bend radius auto-reduced
      warnBendRadiusReductions(meta.waypoints, meta.cornerRadius);

      return newId;
    }

    // Fallback: sync even if create failed
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
    return oldId;
  }
}

/**
 * Command to move elements by a given delta.
 *
 * Translates elements in world coordinates. Preserves element UUIDs.
 */
export class MoveElementsCommand implements Command {
  readonly type = "move-elements";
  readonly description: string;

  constructor(
    private readonly elementIds: string[],
    private readonly deltaX: number,
    private readonly deltaY: number,
  ) {
    const count = elementIds.length;
    this.description = count === 1 ? "Move element" : `Move ${count} elements`;
  }

  execute(ctx: CommandContext): void {
    // Translate all elements by the delta
    ctx.library.translate_elements(this.elementIds, this.deltaX, this.deltaY);

    // Keep path waypoints in sync with the WASM polygon
    usePathStore.getState().translateWaypoints(this.elementIds, this.deltaX, this.deltaY);

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    // Translate in the opposite direction
    ctx.library.translate_elements(this.elementIds, -this.deltaX, -this.deltaY);

    // Keep path waypoints in sync with the WASM polygon
    usePathStore.getState().translateWaypoints(this.elementIds, -this.deltaX, -this.deltaY);

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

// =============================================================================
// Ruler Commands
// =============================================================================

/**
 * Command to change the layer and/or datatype of one or more elements.
 *
 * Since the WASM API has no in-place mutation for layer/datatype,
 * this works by snapshotting, deleting, and re-adding elements with
 * the new properties. Selection is updated to track the new IDs.
 */
export class ChangeElementLayerCommand implements Command {
  readonly type = "change-element-layer";
  readonly description: string;

  /** Original snapshots — polygon or text — keyed by original ID. */
  private originals: { id: string; snapshot: ElementSnapshot | TextSnapshot }[] = [];

  /** New IDs created during execute (for undo). */
  private newIds: string[] = [];

  constructor(
    private readonly elementIds: string[],
    private readonly newLayer: number,
    private readonly newDatatype: number,
  ) {
    const count = elementIds.length;
    this.description = count === 1 ? "Change element layer" : `Change layer of ${count} elements`;
  }

  execute(ctx: CommandContext): void {
    // Snapshot originals on first execute
    if (this.originals.length === 0) {
      for (const id of this.elementIds) {
        // Check for text elements first — get_element_info returns synthetic
        // bounding-rect vertices for text, which would destroy the text data.
        const textInfo = ctx.library.get_text_element_info(id) as {
          text: string;
          x: number;
          y: number;
          height: number;
          layer: number;
          datatype: number;
        } | null;
        if (textInfo) {
          this.originals.push({
            id,
            snapshot: {
              type: "text",
              text: textInfo.text,
              x: textInfo.x,
              y: textInfo.y,
              height: textInfo.height,
              layer: textInfo.layer,
              datatype: textInfo.datatype,
            },
          });
          continue;
        }

        const info = ctx.library.get_element_info(id);
        if (info) {
          this.originals.push({
            id,
            snapshot: {
              vertices: new Float64Array(info.vertices),
              layer: info.layer,
              datatype: info.datatype,
            },
          });
          info.free();
        }
      }
    }

    // On redo, remove the previously restored originals
    const idsToRemove = this.newIds.length > 0 ? this.newIds : this.elementIds;
    ctx.library.remove_elements(idsToRemove);

    // Re-add with new layer/datatype, preserving element type
    const createdIds: string[] = [];
    for (const { snapshot } of this.originals) {
      let id: string | undefined;
      if ("type" in snapshot && snapshot.type === "text") {
        id = ctx.library.add_text(
          snapshot.text,
          snapshot.x,
          snapshot.y,
          snapshot.height,
          this.newLayer,
          this.newDatatype,
        );
      } else {
        id = ctx.library.add_polygon(
          (snapshot as ElementSnapshot).vertices,
          this.newLayer,
          this.newDatatype,
        );
      }
      if (id) createdIds.push(id);
    }

    this.newIds = createdIds;

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    if (createdIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(createdIds));
    }
  }

  undo(ctx: CommandContext): void {
    // Remove the new elements
    ctx.library.remove_elements(this.newIds);

    // Restore originals with their original layer/datatype, preserving element type
    const restoredIds: string[] = [];
    for (const { snapshot } of this.originals) {
      let id: string | undefined;
      if ("type" in snapshot && snapshot.type === "text") {
        id = ctx.library.add_text(
          snapshot.text,
          snapshot.x,
          snapshot.y,
          snapshot.height,
          snapshot.layer,
          snapshot.datatype,
        );
      } else {
        id = ctx.library.add_polygon(
          (snapshot as ElementSnapshot).vertices,
          snapshot.layer,
          snapshot.datatype,
        );
      }
      if (id) restoredIds.push(id);
    }

    // Point newIds at restored originals so redo can remove them
    this.newIds = restoredIds;

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    if (restoredIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(restoredIds));
    }
  }
}

/**
 * Command to resize elements by scaling vertices relative to the bounding box.
 *
 * Scales from the min-corner anchor so that position (minX, minY) stays fixed.
 */
export class ResizeElementsCommand implements Command {
  readonly type = "resize-elements";
  readonly description: string;

  /** Original snapshots for undo. */
  private originals: { id: string; snapshot: ElementSnapshot }[] = [];

  /** New IDs created during execute (for undo/redo tracking). */
  private newIds: string[] = [];

  constructor(
    private readonly elementIds: string[],
    private readonly oldBounds: { minX: number; minY: number; maxX: number; maxY: number },
    private readonly newWidth: number,
    private readonly newHeight: number,
  ) {
    const count = elementIds.length;
    this.description = count === 1 ? "Resize element" : `Resize ${count} elements`;
  }

  execute(ctx: CommandContext): void {
    // Snapshot originals on first execute
    if (this.originals.length === 0) {
      for (const id of this.elementIds) {
        const info = ctx.library.get_element_info(id);
        if (info) {
          this.originals.push({
            id,
            snapshot: {
              vertices: new Float64Array(info.vertices),
              layer: info.layer,
              datatype: info.datatype,
            },
          });
          info.free();
        }
      }
    }

    const oldWidth = this.oldBounds.maxX - this.oldBounds.minX;
    const oldHeight = this.oldBounds.maxY - this.oldBounds.minY;
    const scaleX = oldWidth !== 0 ? this.newWidth / oldWidth : 1;
    const scaleY = oldHeight !== 0 ? this.newHeight / oldHeight : 1;

    // Remove current elements
    const idsToRemove = this.newIds.length > 0 ? this.newIds : this.elementIds;
    ctx.library.remove_elements(idsToRemove);

    // Re-add with scaled vertices
    const createdIds: string[] = [];
    for (const { snapshot } of this.originals) {
      const scaled = new Float64Array(snapshot.vertices.length);
      for (let i = 0; i < snapshot.vertices.length; i += 2) {
        scaled[i] = this.oldBounds.minX + (snapshot.vertices[i] - this.oldBounds.minX) * scaleX;
        scaled[i + 1] =
          this.oldBounds.minY + (snapshot.vertices[i + 1] - this.oldBounds.minY) * scaleY;
      }
      const id = ctx.library.add_polygon(scaled, snapshot.layer, snapshot.datatype);
      if (id) createdIds.push(id);
    }

    this.newIds = createdIds;

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    if (createdIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(createdIds));
    }
  }

  undo(ctx: CommandContext): void {
    // Remove scaled elements
    ctx.library.remove_elements(this.newIds);

    // Restore originals
    const restoredIds: string[] = [];
    for (const { snapshot } of this.originals) {
      const id = ctx.library.add_polygon(snapshot.vertices, snapshot.layer, snapshot.datatype);
      if (id) restoredIds.push(id);
    }

    this.newIds = restoredIds;

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    if (restoredIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(restoredIds));
    }
  }
}

/**
 * Command to edit the vertices of a single polygon element.
 *
 * Supports modifying vertex coordinates, adding vertices, and removing vertices.
 * Uses the delete-and-recreate pattern since there is no in-place vertex setter
 * in the WASM library.
 */
export class EditVerticesCommand implements Command {
  readonly type = "edit-vertices";
  readonly description: string;

  /** Original element snapshot for undo. */
  private original: ElementSnapshot | null = null;

  /** Current element ID (changes on each execute due to delete-and-recreate). */
  private currentId: string;

  constructor(
    elementId: string,
    private readonly newVertices: Float64Array,
    description?: string,
  ) {
    this.currentId = elementId;
    this.description = description ?? "Edit vertices";
  }

  execute(ctx: CommandContext): void {
    // Snapshot original on first execute
    if (!this.original) {
      const info = ctx.library.get_element_info(this.currentId);
      if (!info) return;
      this.original = {
        vertices: new Float64Array(info.vertices),
        layer: info.layer,
        datatype: info.datatype,
      };
      info.free();
    }

    // Remove current element
    ctx.library.remove_element(this.currentId);

    // Re-add with new vertices
    const id = ctx.library.add_polygon(
      this.newVertices,
      this.original.layer,
      this.original.datatype,
    );

    if (id) {
      this.currentId = id;
      useSelectionStore.getState().setSelection(new Set([id]));
    }

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    if (!this.original) return;

    // Remove the edited element
    ctx.library.remove_element(this.currentId);

    // Restore original
    const id = ctx.library.add_polygon(
      this.original.vertices,
      this.original.layer,
      this.original.datatype,
    );

    if (id) {
      this.currentId = id;
      useSelectionStore.getState().setSelection(new Set([id]));
    }

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

/**
 * Command to move elements to a specific position.
 *
 * Translates elements so their bounding box min-corner lands at (newX, newY).
 */
export class MoveElementsToCommand implements Command {
  readonly type = "move-elements-to";
  readonly description: string;

  private readonly deltaX: number;
  private readonly deltaY: number;

  /** Element IDs to translate. Stable through undo/redo since translate preserves IDs. */
  private readonly currentIds: string[];

  constructor(elementIds: string[], oldMinX: number, oldMinY: number, newX: number, newY: number) {
    this.currentIds = [...elementIds];
    this.deltaX = newX - oldMinX;
    this.deltaY = newY - oldMinY;
    this.description =
      elementIds.length === 1 ? "Move element" : `Move ${elementIds.length} elements`;
  }

  execute(ctx: CommandContext): void {
    ctx.library.translate_elements(this.currentIds, this.deltaX, this.deltaY);
    usePathStore.getState().translateWaypoints(this.currentIds, this.deltaX, this.deltaY);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    ctx.library.translate_elements(this.currentIds, -this.deltaX, -this.deltaY);
    usePathStore.getState().translateWaypoints(this.currentIds, -this.deltaX, -this.deltaY);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

/**
 * Command to align selected elements.
 *
 * Computes per-group translation deltas based on the alignment type and
 * a reference element (the last selected element). Supports polygons,
 * text labels, and cell instances (treated as groups of synthetic ref UUIDs).
 */
export class AlignElementsCommand implements Command {
  readonly type = "align-elements";
  readonly description: string;

  /** Computed deltas, populated on first execute. */
  private deltas: AlignmentDelta[] = [];

  constructor(
    private readonly selectedIds: Set<string>,
    private readonly referenceId: string | null,
    private readonly alignType: AlignType,
  ) {
    this.description = `Align elements (${alignType})`;
  }

  execute(ctx: CommandContext): void {
    // Compute deltas on first execution (they stay the same for redo)
    if (this.deltas.length === 0) {
      this.deltas = computeAlignmentDeltas(
        ctx.library,
        this.selectedIds,
        this.referenceId,
        this.alignType,
      );
    }

    for (const delta of this.deltas) {
      ctx.library.translate_elements(delta.ids, delta.dx, delta.dy);
      usePathStore.getState().translateWaypoints(delta.ids, delta.dx, delta.dy);
    }

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    // Apply inverse translations in reverse order
    for (let i = this.deltas.length - 1; i >= 0; i--) {
      const delta = this.deltas[i];
      ctx.library.translate_elements(delta.ids, -delta.dx, -delta.dy);
      usePathStore.getState().translateWaypoints(delta.ids, -delta.dx, -delta.dy);
    }

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

// =============================================================================
// Boolean Operation Commands
// =============================================================================

/** Supported boolean operation types. */

/**
 * Command to perform a boolean/CSG operation on polygon elements.
 *
 * Supported operations: union, subtract, intersect, xor (exclude).
 * Only works on polygon elements — text and cell instances are skipped.
 *
 * For subtract, `baseId` identifies the shape from which others are
 * subtracted. For other operations it is ignored.
 *
 * Input polygons are removed and replaced with the result polygon(s).
 */
export class BooleanOperationCommand implements Command {
  readonly type = "boolean-operation";
  readonly description: string;

  /** Snapshots of original elements for undo restoration. */
  private snapshots: ClipboardSnapshot[] = [];
  /** Current IDs of the input elements (updated on undo when elements get new UUIDs). */
  private currentIds: string[];
  /** Current base ID (updated on undo when elements get new UUIDs). */
  private currentBaseId: string;
  /** IDs of result polygons created by the operation. */
  private resultIds: string[] = [];

  constructor(
    inputIds: string[],
    private readonly operation: BooleanOpType,
    baseId: string,
  ) {
    this.description = `Boolean ${operation}`;
    this.currentIds = [...inputIds];
    this.currentBaseId = baseId;
  }

  execute(ctx: CommandContext): void {
    // Snapshot originals on first execution only
    if (this.snapshots.length === 0) {
      this.snapshots = snapshotElements(ctx.library, this.currentIds);
    }

    // Run the WASM boolean operation (removes inputs, creates results)
    this.resultIds = ctx.library.boolean_operation(
      this.currentIds,
      this.operation,
      this.currentBaseId,
    );

    // Select the result polygons
    if (this.resultIds.length > 0) {
      useSelectionStore.getState().selectAll(this.resultIds);
    } else {
      useSelectionStore.getState().clearSelection();
    }

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    // Remove result polygons
    if (this.resultIds.length > 0) {
      ctx.library.remove_elements(this.resultIds);
    }

    // Restore original elements from snapshots (they get new UUIDs)
    const restoredIds = restoreSnapshots(ctx.library, this.snapshots);

    // Map the old base ID to the new one. The snapshots are created
    // in the same order as currentIds (polygon-only), so we can find
    // the base by its position.
    const oldBaseIdx = this.currentIds.indexOf(this.currentBaseId);

    // Update currentIds for the next redo
    this.currentIds = restoredIds;
    if (oldBaseIdx >= 0 && oldBaseIdx < restoredIds.length) {
      this.currentBaseId = restoredIds[oldBaseIdx];
    }
    this.resultIds = [];

    // Restore selection
    useSelectionStore.getState().selectAll(restoredIds);

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

// =============================================================================
// Image Overlay Commands
// =============================================================================
