import { useSelectionStore } from "@/stores/selection";
import { type TextSnapshot } from "@/stores/clipboard";
import type { Command, CommandContext } from "./types";

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

/**
 * Command to convert text elements into polygon outlines.
 *
 * Accepts one or more text element IDs. Removes the text labels and replaces
 * them with polygon contours extracted from the embedded font.
 * Fully undoable as a single undo entry: undo restores all original texts.
 */
export class TextToPolygonsCommand implements Command {
  readonly type = "text-to-polygons";
  readonly description: string;

  /** Snapshots of the original text elements (for undo). */
  private snapshots: { snapshot: TextSnapshot; currentId: string }[] = [];
  /** UUIDs of all created polygon elements. */
  private resultIds: string[] = [];

  constructor(private textElementIds: string[]) {
    this.description =
      textElementIds.length === 1
        ? "Convert text to polygons"
        : `Convert ${textElementIds.length} texts to polygons`;
  }

  execute(ctx: CommandContext): void {
    // Snapshot text elements on first execute (for undo).
    if (this.snapshots.length === 0) {
      for (const id of this.textElementIds) {
        const info = ctx.library.get_text_element_info(id) as {
          text: string;
          x: number;
          y: number;
          height: number;
          layer: number;
          datatype: number;
        } | null;
        if (!info) continue;
        this.snapshots.push({
          snapshot: {
            type: "text",
            text: info.text,
            x: info.x,
            y: info.y,
            height: info.height,
            layer: info.layer,
            datatype: info.datatype,
          },
          currentId: id,
        });
      }
    }

    // Convert each text element (removes text, adds polygon contours).
    this.resultIds = [];
    for (const entry of this.snapshots) {
      const ids = ctx.library.text_to_polygons(entry.currentId);
      this.resultIds.push(...ids);
    }

    if (this.resultIds.length > 0) {
      useSelectionStore.getState().selectAll(this.resultIds);
    } else {
      useSelectionStore.getState().clearSelection();
    }

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }

  undo(ctx: CommandContext): void {
    // Remove all result polygons.
    if (this.resultIds.length > 0) {
      ctx.library.remove_elements(this.resultIds);
      this.resultIds = [];
    }

    // Restore all original text elements.
    const restoredIds: string[] = [];
    for (const entry of this.snapshots) {
      const s = entry.snapshot;
      const id = ctx.library.add_text(s.text, s.x, s.y, s.height, s.layer, s.datatype);
      if (id) {
        entry.currentId = id;
        restoredIds.push(id);
      }
    }

    if (restoredIds.length > 0) {
      useSelectionStore.getState().selectAll(restoredIds);
    }

    ctx.renderer.sync_from_library(ctx.library);
    ctx.renderer.mark_dirty();
  }
}

// =============================================================================
// Alignment Commands
// =============================================================================
