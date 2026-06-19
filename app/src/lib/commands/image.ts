import { useImageStore, imageKeyToId, imageIdToKey, type ImageEntry } from "@/stores/image";
import { useSelectionStore } from "@/stores/selection";
import type { Command, CommandContext } from "./types";

/**
 * Command to add an image overlay.
 *
 * Images are purely visual annotations — they live in the image store,
 * not in the WASM library, so they don't affect GDS output.
 */
export class AddImageCommand implements Command {
  readonly type = "add-image";
  readonly description = "Insert image";

  constructor(private readonly entry: ImageEntry) {}

  execute(_ctx: CommandContext): void {
    useImageStore.getState().addImage(this.entry);
    useSelectionStore.getState().select(imageKeyToId(this.entry.id));
  }

  undo(_ctx: CommandContext): void {
    useImageStore.getState().removeImage(this.entry.id);
    useSelectionStore.getState().clearSelection();
  }
}

/**
 * Command to remove one or more image overlays.
 *
 * Accepts a single ID or an array of IDs so multi-image deletion
 * is atomic (single undo step).
 */
export class RemoveImageCommand implements Command {
  readonly type = "remove-image";
  readonly description = "Remove image";

  /** Snapshots of the removed images for restoration. */
  private snapshots: ImageEntry[] = [];
  private readonly imageIds: string[];

  constructor(imageIds: string | string[]) {
    this.imageIds = Array.isArray(imageIds) ? imageIds : [imageIds];
  }

  execute(_ctx: CommandContext): void {
    const store = useImageStore.getState();
    // Snapshot on first execute
    if (this.snapshots.length === 0) {
      for (const id of this.imageIds) {
        const entry = store.images.get(id);
        if (entry) this.snapshots.push(entry);
      }
    }
    for (const id of this.imageIds) {
      useImageStore.getState().removeImage(id);
    }
    useSelectionStore.getState().clearSelection();
  }

  undo(_ctx: CommandContext): void {
    const restoredIds: string[] = [];
    for (const snapshot of this.snapshots) {
      useImageStore.getState().addImage(snapshot);
      restoredIds.push(imageKeyToId(snapshot.id));
    }
    if (restoredIds.length > 0) {
      useSelectionStore.getState().selectAll(restoredIds);
    }
  }
}

/**
 * Command to move an image overlay to a new position.
 */
export class MoveImageCommand implements Command {
  readonly type = "move-image";
  readonly description = "Move image";

  constructor(
    private readonly imageId: string,
    private readonly oldX: number,
    private readonly oldY: number,
    private readonly newX: number,
    private readonly newY: number,
  ) {}

  execute(_ctx: CommandContext): void {
    useImageStore.getState().updateImage(this.imageId, { x: this.newX, y: this.newY });
  }

  undo(_ctx: CommandContext): void {
    useImageStore.getState().updateImage(this.imageId, { x: this.oldX, y: this.oldY });
  }
}

/**
 * Command to move one or more image overlays by a delta.
 *
 * Used by the move tool for drag operations. Handles multiple images
 * atomically (single undo step).
 */
export class MoveImagesCommand implements Command {
  readonly type = "move-images";
  readonly description = "Move images";

  constructor(
    private readonly imageIds: string[],
    private readonly deltaX: number,
    private readonly deltaY: number,
  ) {}

  execute(_ctx: CommandContext): void {
    const store = useImageStore.getState();
    for (const imgId of this.imageIds) {
      const key = imageIdToKey(imgId);
      const entry = store.images.get(key);
      if (entry) {
        store.updateImage(key, { x: entry.x + this.deltaX, y: entry.y + this.deltaY });
      }
    }
  }

  undo(_ctx: CommandContext): void {
    const store = useImageStore.getState();
    for (const imgId of this.imageIds) {
      const key = imageIdToKey(imgId);
      const entry = store.images.get(key);
      if (entry) {
        store.updateImage(key, { x: entry.x - this.deltaX, y: entry.y - this.deltaY });
      }
    }
  }
}

/**
 * Command to resize an image overlay.
 */
export class ResizeImageCommand implements Command {
  readonly type = "resize-image";
  readonly description = "Resize image";

  constructor(
    private readonly imageId: string,
    private readonly oldWidth: number,
    private readonly oldHeight: number,
    private readonly newWidth: number,
    private readonly newHeight: number,
  ) {}

  execute(_ctx: CommandContext): void {
    useImageStore.getState().updateImage(this.imageId, {
      width: this.newWidth,
      height: this.newHeight,
    });
  }

  undo(_ctx: CommandContext): void {
    useImageStore.getState().updateImage(this.imageId, {
      width: this.oldWidth,
      height: this.oldHeight,
    });
  }
}
