import { useLayerStore, type Layer } from "@/stores/layer";
import { useSelectionStore } from "@/stores/selection";
import { type ElementSnapshot } from "@/stores/clipboard";
import type { Command, CommandContext } from "./types";
import { syncLayerToWasm } from "./helpers";

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

    // Explicitly restore the layer color and fill pattern in WASM (matches the explicit removal in execute)
    syncLayerToWasm(this.snapshot, ctx);

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

/**
 * Command to edit layer properties (name, color, numbers, fill, opacity).
 *
 * Stores the full before/after layer snapshot for clean undo/redo.
 * When layer number or datatype changes, updates the WASM library's
 * layer color mapping accordingly.
 */
export class EditLayerCommand implements Command {
  readonly type = "edit-layer";
  readonly description: string;

  constructor(
    private readonly oldLayer: Layer,
    private readonly newLayer: Layer,
  ) {
    this.description = `Edit layer "${oldLayer.name}"`;
  }

  execute(ctx: CommandContext): void {
    const store = useLayerStore.getState();

    // If layer number or datatype changed, remove old WASM color mapping
    if (
      this.oldLayer.layerNumber !== this.newLayer.layerNumber ||
      this.oldLayer.datatype !== this.newLayer.datatype
    ) {
      ctx.library.remove_layer_color(this.oldLayer.layerNumber, this.oldLayer.datatype);
    }

    // Apply the new layer to the store
    store.setLayer(this.newLayer);

    // Sync the new color and fill pattern to WASM
    syncLayerToWasm(this.newLayer, ctx);

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    const store = useLayerStore.getState();

    // If layer number or datatype changed, remove the new WASM color mapping
    if (
      this.oldLayer.layerNumber !== this.newLayer.layerNumber ||
      this.oldLayer.datatype !== this.newLayer.datatype
    ) {
      ctx.library.remove_layer_color(this.newLayer.layerNumber, this.newLayer.datatype);
    }

    // Restore the old layer
    store.setLayer(this.oldLayer);

    // Restore old color and fill pattern in WASM
    syncLayerToWasm(this.oldLayer, ctx);

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

// =============================================================================
// Inspector Commands
// =============================================================================
