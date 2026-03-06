/**
 * Command pattern implementation for undo/redo system.
 *
 * Commands encapsulate document-mutating operations and provide
 * execute/undo capabilities for history management.
 */

import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";
import { useSelectionStore } from "@/stores/selection";
import {
  useClipboardStore,
  type ClipboardSnapshot,
  type ElementSnapshot,
  type TextSnapshot,
} from "@/stores/clipboard";
import { useRulerStore, type Ruler, type Point, type RulerEndpoint } from "@/stores/ruler";
import { useLayerStore, hexToRgba, type Layer } from "@/stores/layer";
import { useExplorerStore } from "@/stores/explorer";
import { useViewportStore, GRID_SIZE } from "@/stores/viewport";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import { computeAlignmentDeltas, type AlignType, type AlignmentDelta } from "@/lib/align";

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
 * Snapshot of an element's data for restoration.
 * Re-exported from clipboard store for command use.
 */
export type { ElementSnapshot } from "@/stores/clipboard";

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
 * Snapshot selected elements for clipboard/undo operations.
 *
 * Handles both regular polygon UUIDs and synthetic ref UUIDs (from CellRef instances).
 * Deduplicates synthetic ref UUIDs so each CellRef instance is snapshotted once.
 */
export function snapshotElements(library: WasmLibrary, ids: Iterable<string>): ClipboardSnapshot[] {
  const snapshots: ClipboardSnapshot[] = [];
  // Track which CellRef element indices we've already snapshotted
  // (multiple synthetic ref UUIDs map to the same CellRef)
  const snapshotRefIndices = new Set<string>();

  for (const id of ids) {
    // Check if this is a synthetic ref UUID (CellRef instance)
    if (id.startsWith("ref:")) {
      const elemIdx = id.split(":")[1];
      if (snapshotRefIndices.has(elemIdx)) continue;
      snapshotRefIndices.add(elemIdx);

      const refInfo = library.get_cell_ref_info(id);
      if (refInfo) {
        snapshots.push({
          type: "cell-ref",
          cellName: refInfo.cell_name,
          transform: new Float64Array(refInfo.transform),
        });
        refInfo.free();
      }
      continue;
    }

    // Regular UUID - check if it's actually a CellRef with a real UUID
    const refInfo = library.get_cell_ref_info(id);
    if (refInfo) {
      snapshots.push({
        type: "cell-ref",
        cellName: refInfo.cell_name,
        transform: new Float64Array(refInfo.transform),
      });
      refInfo.free();
      continue;
    }

    // Text element — check before polygon since get_element_info returns
    // synthetic bounding-rect vertices for text (which we don't want to
    // snapshot as a polygon).
    const textInfo = library.get_text_element_info(id) as {
      text: string;
      x: number;
      y: number;
      height: number;
      layer: number;
      datatype: number;
    } | null;
    if (textInfo) {
      snapshots.push({
        type: "text",
        text: textInfo.text,
        x: textInfo.x,
        y: textInfo.y,
        height: textInfo.height,
        layer: textInfo.layer,
        datatype: textInfo.datatype,
      });
      continue;
    }

    // Polygon element
    const info = library.get_element_info(id);
    if (info) {
      snapshots.push({
        type: "polygon",
        vertices: new Float64Array(info.vertices),
        layer: info.layer,
        datatype: info.datatype,
      });
      info.free();
    }
  }

  return snapshots;
}

/**
 * Restore snapshots by creating elements in the library.
 *
 * Returns the IDs of the newly created elements.
 */
function restoreSnapshots(library: WasmLibrary, snapshots: ClipboardSnapshot[]): string[] {
  const newIds: string[] = [];

  for (const snapshot of snapshots) {
    if (snapshot.type === "cell-ref") {
      const id = library.add_cell_ref_with_transform(snapshot.cellName, snapshot.transform);
      if (id) {
        newIds.push(id);
      }
    } else if (snapshot.type === "text") {
      const id = library.add_text(
        snapshot.text,
        snapshot.x,
        snapshot.y,
        snapshot.height,
        snapshot.layer,
        snapshot.datatype,
      );
      if (id) {
        newIds.push(id);
      }
    } else {
      const id = library.add_polygon(snapshot.vertices, snapshot.layer, snapshot.datatype);
      if (id) {
        newIds.push(id);
      }
    }
  }

  return newIds;
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
    const idsToDelete = this.restoredIds.length > 0 ? this.restoredIds : this.elementIds;

    // Snapshot elements before deleting (only on first execute)
    if (this.snapshots.length === 0) {
      this.snapshots = snapshotElements(ctx.library, idsToDelete);
    }

    // Delete elements in a single batch operation (much faster for large selections)
    ctx.library.remove_elements(idsToDelete);

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
        };
      }
      if (e.type === "text") {
        return { ...e };
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

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Select pasted elements
    if (this.createdIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(this.createdIds));
    }
  }

  undo(ctx: CommandContext): void {
    // Delete the pasted elements in a single batch operation
    ctx.library.remove_elements(this.createdIds);

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

    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();

    // Select duplicated elements
    if (this.createdIds.length > 0) {
      useSelectionStore.getState().setSelection(new Set(this.createdIds));
    }
  }

  undo(ctx: CommandContext): void {
    // Delete the duplicated elements in a single batch operation
    ctx.library.remove_elements(this.createdIds);

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

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    // Translate in the opposite direction
    ctx.library.translate_elements(this.elementIds, -this.deltaX, -this.deltaY);

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

// =============================================================================
// Ruler Commands
// =============================================================================

/**
 * Command to create a ruler.
 *
 * Can be created in two ways:
 * 1. With start/end points - will create a new ruler on execute
 * 2. With an existing ruler - for recording interactive creation (won't execute, just undo/redo)
 */
export class CreateRulerCommand implements Command {
  readonly type = "create-ruler";
  readonly description = "Create ruler";

  /** Ruler data for restoration. */
  private ruler: Ruler;

  /** Whether this command was created for an already-existing ruler. */
  private readonly alreadyCreated: boolean;

  constructor(rulerOrStart: Ruler | Point, end?: Point) {
    if ("id" in rulerOrStart) {
      // Existing ruler - for recording interactive creation
      this.ruler = rulerOrStart;
      this.alreadyCreated = true;
    } else {
      // Start/end points - will create on execute
      this.ruler = { id: "", start: rulerOrStart, end: end! };
      this.alreadyCreated = false;
    }
  }

  execute(_ctx: CommandContext): void {
    if (this.alreadyCreated) {
      // Ruler already exists or was removed by undo - restore it
      const { rulers } = useRulerStore.getState();
      if (!rulers.has(this.ruler.id)) {
        // Restore the ruler (redo case)
        useRulerStore.setState((state) => {
          const newRulers = new Map(state.rulers);
          newRulers.set(this.ruler.id, this.ruler);
          return { rulers: newRulers };
        });
      }
      // If ruler exists, this is initial push - do nothing
    } else {
      // Create new ruler
      const id = useRulerStore.getState().addRuler(this.ruler.start, this.ruler.end);
      this.ruler = { ...this.ruler, id };
    }
  }

  undo(_ctx: CommandContext): void {
    useRulerStore.getState().removeRuler(this.ruler.id);
  }

  /** Get the created ruler ID. */
  getRulerId(): string {
    return this.ruler.id;
  }
}

/**
 * Command to delete one or more rulers.
 */
export class DeleteRulersCommand implements Command {
  readonly type = "delete-rulers";
  readonly description: string;

  /** Snapshots of deleted rulers for restoration. */
  private snapshots: Ruler[] = [];

  /** New IDs assigned to restored rulers (for redo tracking). */
  private restoredIds: string[] = [];

  constructor(private readonly rulerIds: string[]) {
    const count = rulerIds.length;
    this.description = count === 1 ? "Delete ruler" : `Delete ${count} rulers`;
  }

  execute(_ctx: CommandContext): void {
    const { rulers, removeRulers } = useRulerStore.getState();

    // If this is a redo, use restoredIds instead of original rulerIds
    const idsToDelete = this.restoredIds.length > 0 ? this.restoredIds : this.rulerIds;

    // Snapshot rulers before deleting (only on first execute)
    if (this.snapshots.length === 0) {
      for (const id of idsToDelete) {
        const ruler = rulers.get(id);
        if (ruler) {
          this.snapshots.push({ ...ruler });
        }
      }
    }

    removeRulers(idsToDelete);

    // Clear restored IDs for next potential redo
    this.restoredIds = [];
  }

  undo(_ctx: CommandContext): void {
    // Restore all deleted rulers
    const newIds = useRulerStore.getState().restoreRulers(this.snapshots);

    // Track new IDs for potential redo
    this.restoredIds = newIds;

    // Select restored rulers
    if (newIds.length > 0) {
      useRulerStore.getState().setSelection(new Set(newIds));
    }
  }
}

/**
 * Command to move rulers by a given delta.
 */
export class MoveRulersCommand implements Command {
  readonly type = "move-rulers";
  readonly description: string;

  constructor(
    private readonly rulerIds: string[],
    private readonly deltaX: number,
    private readonly deltaY: number,
  ) {
    const count = rulerIds.length;
    this.description = count === 1 ? "Move ruler" : `Move ${count} rulers`;
  }

  execute(_ctx: CommandContext): void {
    this.applyDelta(this.deltaX, this.deltaY);
  }

  undo(_ctx: CommandContext): void {
    this.applyDelta(-this.deltaX, -this.deltaY);
  }

  private applyDelta(dx: number, dy: number): void {
    useRulerStore.setState((state) => {
      const newRulers = new Map(state.rulers);
      for (const id of this.rulerIds) {
        const ruler = newRulers.get(id);
        if (ruler) {
          newRulers.set(id, {
            ...ruler,
            start: { x: ruler.start.x + dx, y: ruler.start.y + dy },
            end: { x: ruler.end.x + dx, y: ruler.end.y + dy },
          });
        }
      }
      return { rulers: newRulers };
    });
  }
}

/**
 * Command to move a ruler endpoint.
 */
export class MoveRulerEndpointCommand implements Command {
  readonly type = "move-ruler-endpoint";
  readonly description = "Move ruler endpoint";

  constructor(
    private readonly rulerId: string,
    private readonly endpoint: RulerEndpoint,
    private readonly oldPosition: Point,
    private readonly newPosition: Point,
  ) {}

  execute(_ctx: CommandContext): void {
    useRulerStore.getState().updateEndpoint(this.rulerId, this.endpoint, this.newPosition);
  }

  undo(_ctx: CommandContext): void {
    useRulerStore.getState().updateEndpoint(this.rulerId, this.endpoint, this.oldPosition);
  }
}

// =============================================================================
// Layer Commands
// =============================================================================

/**
 * Command to add a new layer.
 *
 * Creates a layer with auto-generated name, color, and layer number.
 * On undo, removes the created layer. On redo, restores it.
 */
export class AddLayerCommand implements Command {
  readonly type = "add-layer";
  readonly description = "Add layer";

  /** The created layer (populated after first execute). */
  private createdLayer: Layer | null = null;

  constructor(
    private readonly name?: string,
    private readonly color?: string,
  ) {}

  execute(_ctx: CommandContext): void {
    if (this.createdLayer) {
      // Redo: restore the exact same layer
      useLayerStore.getState().setLayer(this.createdLayer);
      useLayerStore.getState().setActiveLayer(this.createdLayer.id);
    } else {
      // First execute: create a new layer
      this.createdLayer = useLayerStore.getState().addLayer(this.name, this.color);
    }
  }

  undo(_ctx: CommandContext): void {
    if (this.createdLayer) {
      useLayerStore.getState().deleteLayer(this.createdLayer.id);
    }
  }
}

/**
 * Command to delete a layer.
 *
 * Deletes the layer and all shapes on it. Snapshots both the layer
 * definition and element geometry for undo restoration.
 * Won't delete the last remaining layer (guard in layer store).
 */
export class DeleteLayerCommand implements Command {
  readonly type = "delete-layer";
  readonly description: string;

  /** Snapshot of the deleted layer for restoration. */
  private snapshot: Layer | null = null;

  /** Snapshots of elements that were on this layer. */
  private elementSnapshots: ElementSnapshot[] = [];

  /** IDs assigned to restored elements (tracked for redo). */
  private restoredElementIds: string[] = [];

  constructor(private readonly layerId: number) {
    this.description = `Delete layer`;
  }

  execute(ctx: CommandContext): void {
    const store = useLayerStore.getState();

    // Always re-snapshot before deleting (layer may have been modified between undo and redo)
    this.snapshot = store.getLayer(this.layerId) ?? null;
    if (!this.snapshot) return;

    // Determine which IDs to remove (restored IDs on redo, query on first execute)
    const idsToRemove =
      this.restoredElementIds.length > 0
        ? this.restoredElementIds
        : ctx.library.get_elements_on_layer(this.snapshot.layerNumber, this.snapshot.datatype);

    // Snapshot element geometry before deleting (only on first execute)
    if (this.elementSnapshots.length === 0) {
      for (const id of idsToRemove) {
        const info = ctx.library.get_element_info(id);
        if (info) {
          this.elementSnapshots.push({
            vertices: new Float64Array(info.vertices),
            layer: info.layer,
            datatype: info.datatype,
          });
          info.free();
        }
      }
    }

    // Remove elements from the WASM library
    ctx.library.remove_elements(idsToRemove);
    this.restoredElementIds = [];

    // Clean up stale layer color from WASM
    ctx.library.remove_layer_color(this.snapshot.layerNumber, this.snapshot.datatype);

    // Delete the layer from the UI store
    store.deleteLayer(this.layerId);

    // Clear selection (deleted elements may have been selected)
    useSelectionStore.getState().clearSelection();

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    if (!this.snapshot) return;

    // Restore the layer definition in the UI store
    useLayerStore.getState().setLayer(this.snapshot);
    useLayerStore.getState().setActiveLayer(this.snapshot.id);

    // Explicitly restore the layer color in WASM (matches the explicit removal in execute)
    const alpha = this.snapshot.visible ? 0.7 : 0;
    const [r, g, b, a] = hexToRgba(this.snapshot.color, alpha);
    ctx.library.set_layer_color(this.snapshot.layerNumber, this.snapshot.datatype, r, g, b, a);

    // Restore all elements that were on this layer
    const newIds: string[] = [];
    for (const snap of this.elementSnapshots) {
      const id = ctx.library.add_polygon(snap.vertices, snap.layer, snap.datatype);
      if (id) {
        newIds.push(id);
      }
    }

    this.restoredElementIds = newIds;

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

// =============================================================================
// Inspector Commands
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
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    ctx.library.translate_elements(this.currentIds, -this.deltaX, -this.deltaY);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

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

/** Array repetition parameters for an instance. */
export interface ArrayParams {
  columns: number;
  rows: number;
  colSpacing: number;
  rowSpacing: number;
}

/**
 * Command to set the array repetition on a CellRef instance.
 *
 * The `refId` must be a synthetic ref UUID (e.g. "ref:3:0").
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
      ctx.library.set_cell_ref_array(
        this.refId,
        params.columns,
        params.rows,
        params.colSpacing,
        params.rowSpacing,
      );
    } else {
      // Revert to single instance
      ctx.library.set_cell_ref_array(this.refId, 1, 1, 0, 0);
    }
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

// =============================================================================
// Cell Commands
// =============================================================================

/**
 * Rebuild the Explorer cell tree from the WASM library's current state.
 *
 * Called after any command that changes cell structure (add, delete, rename)
 * or cell references (add/remove instance). This keeps the Explorer's
 * hierarchical tree in sync with the library in standalone mode.
 * In design mode the tree comes from the server, but calling this is harmless.
 */
export function syncCellTree(library: WasmLibrary): void {
  const tree = library.get_cell_tree();
  if (tree) {
    useExplorerStore.getState().setCellTree(tree);
  }
}

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
 * Command to delete a cell.
 *
 * On undo, re-adds the cell (as an empty cell — element restoration
 * is not supported since cells in the explorer are server-managed).
 */
export class DeleteCellCommand implements Command {
  readonly type = "delete-cell";
  readonly description: string;

  private cellName: string;

  constructor(name: string) {
    this.cellName = name;
    this.description = `Delete cell "${name}"`;
  }

  execute(ctx: CommandContext): void {
    ctx.library.remove_cell(this.cellName);
    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    ctx.library.add_cell(this.cellName);
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
    ctx.library.rename_cell(this.oldName, this.newName);
    syncCellTree(ctx.library);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
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
function snapToGrid(v: number): number {
  return Math.round(v / GRID_SIZE) * GRID_SIZE;
}

/** Get the active layer's GDS layer number and datatype. */
function getActiveLayerSpec(): { layerNumber: number; datatype: number } {
  const { activeLayerId, layers } = useLayerStore.getState();
  const activeLayer = layers.get(activeLayerId);
  return {
    layerNumber: activeLayer?.layerNumber ?? 1,
    datatype: activeLayer?.datatype ?? 0,
  };
}

/**
 * Compute viewport-center placement parameters.
 *
 * Returns the world-space center and a grid-snapped size that is
 * ~10 % of the visible extent (minimum 1 grid unit per axis).
 */
function viewportPlacement(canvas: HTMLElement): {
  centerX: number;
  centerY: number;
  halfW: number;
  halfH: number;
} {
  const { zoom, offset } = useViewportStore.getState();
  const rect = canvas.getBoundingClientRect();

  const centerX = (rect.width / 2 - offset.x) / zoom;
  const centerY = (rect.height / 2 - offset.y) / zoom;

  const visibleWidth = rect.width / zoom;
  const visibleHeight = rect.height / zoom;
  const halfW = Math.max(snapToGrid((visibleWidth * 0.1) / 2), GRID_SIZE);
  const halfH = Math.max(snapToGrid((visibleHeight * 0.1) / 2), GRID_SIZE);

  return { centerX, centerY, halfW, halfH };
}

/**
 * Place a rectangle centered in the current viewport.
 *
 * Used by both the keyboard shortcut (R → Enter) and the command palette.
 */
export function placeRectangleInViewport(
  library: WasmLibrary,
  renderer: WasmRenderer,
  canvas: HTMLElement,
): void {
  const { centerX, centerY, halfW, halfH } = viewportPlacement(canvas);
  const width = halfW * 2;
  const height = halfH * 2;
  const originX = snapToGrid(centerX - halfW);
  const originY = snapToGrid(centerY - halfH);

  const { layerNumber, datatype } = getActiveLayerSpec();

  const command = new CreateRectangleCommand(
    originX,
    originY,
    width,
    height,
    layerNumber,
    datatype,
  );
  useHistoryStore.getState().execute(command, { library, renderer });
}

/**
 * Place a 3-point triangle centered in the current viewport.
 *
 * Used by both the keyboard shortcut (G → Enter) and the command palette.
 */
export function placePolygonInViewport(
  library: WasmLibrary,
  renderer: WasmRenderer,
  canvas: HTMLElement,
): void {
  const { centerX, centerY, halfW, halfH } = viewportPlacement(canvas);

  const points = new Float64Array([
    snapToGrid(centerX - halfW),
    snapToGrid(centerY - halfH),
    snapToGrid(centerX + halfW),
    snapToGrid(centerY - halfH),
    snapToGrid(centerX),
    snapToGrid(centerY + halfH),
  ]);

  const { layerNumber, datatype } = getActiveLayerSpec();

  const command = new CreatePolygonCommand(points, layerNumber, datatype);
  useHistoryStore.getState().execute(command, { library, renderer });
}

/**
 * Place a text label centered in the current viewport.
 *
 * Used by both the keyboard shortcut (T → Enter) and the command palette.
 */
export function placeTextInViewport(
  library: WasmLibrary,
  renderer: WasmRenderer,
  canvas: HTMLElement,
): void {
  const { centerX, centerY, halfH } = viewportPlacement(canvas);
  // Size the text height to ~10 % of the visible vertical extent (matching rect/polygon sizing)
  const height = Math.max(snapToGrid(halfH), GRID_SIZE);

  const { layerNumber, datatype } = getActiveLayerSpec();

  const command = new CreateTextCommand(
    "Text",
    snapToGrid(centerX),
    snapToGrid(centerY),
    height,
    layerNumber,
    datatype,
  );
  useHistoryStore.getState().execute(command, { library, renderer });
  useWasmContextStore.getState().bumpSyncGeneration();
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

/**
 * Command to create a text label element.
 */
export class CreateTextCommand implements Command {
  readonly type = "create-text";
  readonly description: string;

  /** Created element ID (populated after execute). */
  private elementId: string | null = null;

  constructor(
    private readonly text: string,
    private readonly x: number,
    private readonly y: number,
    private readonly height: number,
    private readonly layer: number,
    private readonly datatype: number = 0,
  ) {
    this.description = `Create text "${text.slice(0, 20)}" at (${x}, ${y})`;
  }

  execute(ctx: CommandContext): void {
    const id = ctx.library.add_text(
      this.text,
      this.x,
      this.y,
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
 * Command to update a text element's content.
 */
export class UpdateTextContentCommand implements Command {
  readonly type = "update-text-content";
  readonly description = "Update text content";

  constructor(
    private readonly elementId: string,
    private readonly oldText: string,
    private readonly newText: string,
  ) {}

  execute(ctx: CommandContext): void {
    ctx.library.update_text(this.elementId, this.newText);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    ctx.library.update_text(this.elementId, this.oldText);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

/**
 * Command to move a text element to a new position.
 */
export class MoveTextCommand implements Command {
  readonly type = "move-text";
  readonly description = "Move text";

  constructor(
    private readonly elementId: string,
    private readonly oldX: number,
    private readonly oldY: number,
    private readonly newX: number,
    private readonly newY: number,
  ) {}

  execute(ctx: CommandContext): void {
    ctx.library.set_text_position(this.elementId, this.newX, this.newY);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    ctx.library.set_text_position(this.elementId, this.oldX, this.oldY);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

/**
 * Command to change a text element's height.
 */
export class SetTextHeightCommand implements Command {
  readonly type = "set-text-height";
  readonly description = "Set text height";

  constructor(
    private readonly elementId: string,
    private readonly oldHeight: number,
    private readonly newHeight: number,
  ) {}

  execute(ctx: CommandContext): void {
    ctx.library.set_text_height(this.elementId, this.newHeight);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    ctx.library.set_text_height(this.elementId, this.oldHeight);
    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

// =============================================================================
// Alignment Commands
// =============================================================================

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
    }

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    // Apply inverse translations in reverse order
    for (let i = this.deltas.length - 1; i >= 0; i--) {
      const delta = this.deltas[i];
      ctx.library.translate_elements(delta.ids, -delta.dx, -delta.dy);
    }

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

// =============================================================================
// Boolean Operation Commands
// =============================================================================

/** Supported boolean operation types. */
export type BooleanOpType = "union" | "subtract" | "intersect" | "xor";

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
