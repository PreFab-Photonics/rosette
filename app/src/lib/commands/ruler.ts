import { useRulerStore, type Ruler, type Point, type RulerEndpoint } from "@/stores/ruler";
import { translateRuler } from "@/stores/ruler-geometry";
import type { Command, CommandContext, RulerPropsPatch } from "./types";

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
      // Start/end points - will create a simple ruler on execute.
      // Future kinds should construct the Ruler object directly and pass
      // it via the first branch above.
      this.ruler = { id: "", kind: "simple", start: rulerOrStart, end: end! };
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
      // Create new ruler. Only the two-point "simple" fallback path
      // reaches here (the constructor narrows to `SimpleRuler`); all
      // other kinds must be created via the Ruler-object constructor
      // overload and therefore go through the `alreadyCreated` branch.
      if (this.ruler.kind === "simple" || this.ruler.kind === "super") {
        const id = useRulerStore.getState().addRuler(this.ruler.start, this.ruler.end);
        this.ruler = { ...this.ruler, id };
      }
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
          // Kind-aware translation; polylines and future ruler kinds need
          // to move every control point, not just a two-point start/end.
          newRulers.set(id, translateRuler(ruler, dx, dy));
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

/**
 * Command to move a single ruler control point by index (kind-agnostic).
 *
 * Used for polyline / angle / radius vertex drags where the two-point
 * `endpoint` vocabulary doesn't apply.
 */
export class MoveRulerPointCommand implements Command {
  readonly type = "move-ruler-point";
  readonly description = "Move ruler vertex";

  constructor(
    private readonly rulerId: string,
    private readonly pointIndex: number,
    private readonly oldPosition: Point,
    private readonly newPosition: Point,
  ) {}

  execute(_ctx: CommandContext): void {
    useRulerStore.getState().updateRulerPoint(this.rulerId, this.pointIndex, this.newPosition);
  }

  undo(_ctx: CommandContext): void {
    useRulerStore.getState().updateRulerPoint(this.rulerId, this.pointIndex, this.oldPosition);
  }
}

/** Non-geometric ruler properties editable via commands. */

/**
 * Command to update non-geometric ruler properties (label, unit override).
 *
 * Intended to be pushed *once per commit* — e.g. on blur of a rename field
 * — not on every keystroke.
 */
export class UpdateRulerPropsCommand implements Command {
  readonly type = "update-ruler-props";
  readonly description = "Update ruler";

  constructor(
    private readonly rulerId: string,
    private readonly oldProps: RulerPropsPatch,
    private readonly newProps: RulerPropsPatch,
  ) {}

  execute(_ctx: CommandContext): void {
    useRulerStore.getState().updateRulerProps(this.rulerId, this.newProps);
  }

  undo(_ctx: CommandContext): void {
    useRulerStore.getState().updateRulerProps(this.rulerId, this.oldProps);
  }
}

// =============================================================================
// Layer Commands
// =============================================================================
