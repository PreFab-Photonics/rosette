import { create } from "zustand";
import { translateRuler } from "./ruler-geometry";

/**
 * A point in world coordinates.
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Discriminator for the ruler union.
 *
 * Additional kinds are introduced in follow-up issues:
 * - `"super"`   — ROS-560 (angle, endpoint coords, label, unit override)
 * - `"polyline"`— ROS-565 (multi-segment)
 * - `"angle"`   — ROS-562 (protractor, 3 points)
 * - `"radius"`  — ROS-563 (center + edge)
 *
 * Today only `"simple"` is active; the union is defined now so that
 * exhaustive `switch (ruler.kind)` checks can be added incrementally
 * without a disruptive rename later.
 */
export type RulerKind = "simple" | "super" | "polyline" | "angle" | "radius";

/**
 * Display-unit override for rulers. `"auto"` means "follow the zoom-driven
 * default from `lib/format.getDisplayUnit`".
 */
export type RulerUnit = "auto" | "nm" | "um" | "mm";

/**
 * A simple two-point measurement ruler (the original ruler).
 */
export interface SimpleRuler {
  /** Unique identifier. */
  id: string;
  /** Discriminator. */
  kind: "simple";
  /** Start point in world coordinates. */
  start: Point;
  /** End point in world coordinates. */
  end: Point;
}

/**
 * A "super" linear ruler. Same shape as a simple ruler plus extras:
 *
 * - Angle θ shown in the measurement box (degrees).
 * - Endpoint coordinate badges near each endpoint.
 * - Optional user-editable `label` displayed inside the box.
 * - Optional `unitOverride` forcing nm/µm/mm instead of zoom-auto.
 *
 * See ROS-560.
 */
export interface SuperRuler {
  /** Unique identifier. */
  id: string;
  /** Discriminator. */
  kind: "super";
  /** Start point in world coordinates. */
  start: Point;
  /** End point in world coordinates. */
  end: Point;
  /** Optional user-editable label shown in the measurement box. */
  label?: string;
  /** Display-unit preference for this ruler. Defaults to `"auto"`. */
  unitOverride?: RulerUnit;
}

/**
 * A multi-segment polyline ruler (ROS-565).
 *
 * `points` always has at least two entries once finalised. During
 * creation the *last* entry tracks the cursor (preview) and the entries
 * before it are committed by the user clicking. Pressing Enter or
 * double-clicking finalises; Backspace removes the last committed point.
 */
export interface PolylineRuler {
  /** Unique identifier. */
  id: string;
  /** Discriminator. */
  kind: "polyline";
  /**
   * Vertices in path order. While the ruler is being created (`id` is in
   * `activeRulerId`), the **last** entry is the cursor preview; entries
   * before it are committed clicks.
   */
  points: Point[];
}

/**
 * A three-point protractor / angle ruler (ROS-562).
 *
 * Users click `vertex → armA → armB`. The ruler displays two dashed
 * arms from `vertex` and an arc between them labelled with θ in degrees.
 */
export interface AngleRuler {
  /** Unique identifier. */
  id: string;
  /** Discriminator. */
  kind: "angle";
  /** Shared vertex of the two arms. */
  vertex: Point;
  /** End of the first arm. */
  armA: Point;
  /** End of the second arm. During creation this tracks the cursor. */
  armB: Point;
}

/**
 * A center + edge radius ruler (ROS-563).
 *
 * Users click `center → edge`. The ruler displays a dashed line from
 * `center` to `edge` and a world-space circle of radius `|edge - center|`
 * centered on `center`, labelled with `r` and `d = 2r`.
 */
export interface RadiusRuler {
  /** Unique identifier. */
  id: string;
  /** Discriminator. */
  kind: "radius";
  /** Circle center. */
  center: Point;
  /** Point on the circle. During creation this tracks the cursor. */
  edge: Point;
}

/**
 * A ruler measurement. All ruler kinds from the family share the same
 * store, selection, hit-test, and undo infrastructure.
 */
export type Ruler = SimpleRuler | SuperRuler | PolylineRuler | AngleRuler | RadiusRuler;

/**
 * True for ruler kinds that are defined as two endpoints `start`/`end`.
 * Use this narrow helper from code that was written for the original
 * two-point ruler and hasn't been generalised over all kinds yet.
 */
export function isTwoPointRuler(ruler: Ruler): ruler is SimpleRuler | SuperRuler {
  return ruler.kind === "simple" || ruler.kind === "super";
}

/**
 * Which endpoint of a ruler is being interacted with.
 */
export type RulerEndpoint = "start" | "end";

/**
 * Information about a hovered or dragged endpoint.
 */
interface EndpointInfo {
  rulerId: string;
  endpoint: RulerEndpoint;
}

/**
 * Ruler state for managing measurement rulers.
 *
 * Rulers are ephemeral UI elements (not persisted in the library).
 * They're stored in world coordinates and rendered as SVG overlays.
 */
interface RulerState {
  /** All rulers, keyed by ID. */
  rulers: Map<string, Ruler>;
  /** ID of ruler currently being created (null when not creating). */
  activeRulerId: string | null;
  /** Preview end point while creating (cursor position, snapped to grid). */
  previewEnd: Point | null;
  /**
   * Click-step counter during multi-click ruler creation (angle, polyline).
   * Meaning depends on the active ruler kind:
   *  - angle: 1 after the vertex click, 2 after the armA click.
   *  - two-point rulers: always 1.
   *  - polyline: number of committed vertices so far.
   */
  creationStep: number;
  /** IDs of the currently selected rulers. */
  selectedRulerIds: Set<string>;
  /** ID of the ruler currently being hovered (whole ruler, not just endpoint). */
  hoveredRulerId: string | null;
  /** IDs of rulers currently under marquee selection (for preview highlighting). */
  marqueePreviewIds: Set<string>;
  /** Which endpoint is being hovered (for visual feedback). */
  hoveredEndpoint: EndpointInfo | null;
  /**
   * Which polyline vertex (or future kind's vertex) is being hovered.
   * Mutually exclusive with `hoveredEndpoint` — the UI clears one when it
   * sets the other.
   */
  hoveredVertex: { rulerId: string; pointIndex: number } | null;
  /** Which endpoint is being dragged. */
  draggingEndpoint: EndpointInfo | null;
  /**
   * Which polyline vertex is being dragged. Mutually exclusive with
   * `draggingEndpoint`.
   */
  draggingVertex: {
    rulerId: string;
    pointIndex: number;
    originalPosition: Point;
  } | null;
  /** Original position of endpoint being dragged (for undo). */
  draggingEndpointOriginal: Point | null;
  /** Whether the entire ruler is being moved. */
  isMovingRuler: boolean;
  /** Starting point for ruler move operation (updates during move). */
  moveStartPoint: Point | null;
  /** Original start point for ruler move operation (for undo). */
  moveOriginalPoint: Point | null;
  /** Current snap point when snapping to geometry (null = grid snap or no snap). */
  snapPoint: Point | null;
  /**
   * ID of the ruler whose label is currently being edited inline on the
   * canvas. Only meaningful for `"super"` rulers (they're the only kind
   * that carries a `label`). `null` when no inline edit is active.
   */
  editingRulerId: string | null;

  /**
   * Start creating a new ruler at the given point.
   *
   * `kind` defaults to `"simple"` so existing call sites that only pass a
   * point keep working. Future ruler kinds will add their own overloads.
   *
   * Returns the new ruler ID.
   */
  startRuler: (start: Point, kind?: Ruler["kind"]) => string;
  /** Update the preview end point while creating. */
  updatePreview: (end: Point) => void;
  /** Finalize the ruler being created with the given end point. Returns the finalized ruler. */
  finalizeRuler: (end: Point) => Ruler | null;
  /** Cancel ruler creation and remove the active ruler. */
  cancelCreation: () => void;
  /** Update an existing ruler's endpoint position. */
  updateEndpoint: (rulerId: string, endpoint: RulerEndpoint, point: Point) => void;
  /**
   * Set a single control point of the ruler by index (kind-agnostic).
   * Use this for polyline-vertex drags; two-point kinds should typically
   * go through `updateEndpoint`.
   */
  updateRulerPoint: (rulerId: string, pointIndex: number, point: Point) => void;
  /**
   * Append a committed vertex to an in-progress polyline ruler, and start
   * a new preview vertex at the same position. No-op for non-polyline or
   * non-active rulers.
   */
  appendPolylinePoint: (rulerId: string, point: Point) => void;
  /**
   * Remove the last committed vertex from an in-progress polyline ruler
   * (keeping the preview vertex). Returns `true` if a point was removed,
   * `false` if the polyline already has only one committed vertex (in
   * which case Backspace should cancel creation instead).
   */
  popPolylinePoint: (rulerId: string) => boolean;
  /**
   * Commit the intermediate click of a multi-click ruler creation flow.
   *
   * For angle rulers, call this after the second click (armA placement).
   * Advances `creationStep` to 2 and fixes `armA` at the given point;
   * subsequent mouse moves update `armB` as the preview.
   */
  commitAngleArmA: (rulerId: string, point: Point) => void;
  /**
   * Shallow-merge properties on the ruler keyed by `rulerId`.
   *
   * Only non-geometric fields (`label`, `unitOverride`, …) should be set
   * this way. Geometry mutations go through `updateEndpoint` /
   * `startMoveRuler` / `moveRuler` so their undo commands stay correct.
   *
   * Silently no-ops if the ruler doesn't exist or doesn't carry the
   * supplied fields.
   */
  updateRulerProps: (rulerId: string, props: { label?: string; unitOverride?: RulerUnit }) => void;
  /** Remove a ruler by ID. */
  removeRuler: (id: string) => void;
  /** Remove multiple rulers by ID. */
  removeRulers: (ids: string[]) => void;
  /** Remove all rulers. */
  clearAllRulers: () => void;
  /** Set the hovered endpoint (or null to clear). */
  setHoveredEndpoint: (info: EndpointInfo | null) => void;
  /** Set the hovered polyline/kind-vertex (or null to clear). */
  setHoveredVertex: (info: { rulerId: string; pointIndex: number } | null) => void;
  /** Set the dragging endpoint (or null to clear). Returns original position for undo. */
  setDraggingEndpoint: (info: EndpointInfo | null) => void;
  /**
   * Set the dragging polyline vertex (or null to clear).
   * Captures the original position for undo on start.
   */
  setDraggingVertex: (info: { rulerId: string; pointIndex: number } | null) => void;
  /**
   * End polyline-vertex dragging. Returns the before/after positions for
   * the caller to turn into an undoable command, or `null` when no
   * movement happened.
   */
  endDraggingVertex: () => {
    rulerId: string;
    pointIndex: number;
    oldPosition: Point;
    newPosition: Point;
  } | null;
  /** End endpoint dragging. Returns info for undo command if there was movement. */
  endDraggingEndpoint: () => {
    rulerId: string;
    endpoint: RulerEndpoint;
    oldPosition: Point;
    newPosition: Point;
  } | null;
  /** Select a single ruler by ID (clears other selections). */
  selectRuler: (id: string | null) => void;
  /** Toggle a ruler in/out of selection (Ctrl/Cmd+click). */
  toggleSelection: (id: string) => void;
  /** Add rulers to selection (for marquee/shift-click). */
  addToSelection: (ids: string[]) => void;
  /** Set selection to specific rulers. */
  setSelection: (ids: Set<string>) => void;
  /** Clear ruler selection. */
  clearSelection: () => void;
  /** Set the hovered ruler ID (whole ruler hover). */
  setHoveredRuler: (id: string | null) => void;
  /** Set the marquee preview ruler IDs. */
  setMarqueePreviewIds: (ids: string[]) => void;
  /** Start moving selected rulers. */
  startMoveRuler: (startPoint: Point) => void;
  /** Update ruler positions during move. */
  moveRuler: (currentPoint: Point) => void;
  /** End ruler move operation. Returns the total delta (for undo). */
  endMoveRuler: () => { rulerIds: string[]; deltaX: number; deltaY: number } | null;
  /** Delete the currently selected rulers. */
  deleteSelectedRulers: () => void;
  /**
   * Add a ruler directly (used by undo/redo and programmatic creation of
   * two-point rulers).
   *
   * Only `"simple"` and `"super"` kinds are supported here; polyline /
   * angle / radius kinds carry kind-specific data that doesn't map onto
   * `(start, end)` — for those, construct the `Ruler` object yourself
   * and push via `restoreRulers([ruler])`.
   *
   * `kind` defaults to `"simple"` for backward compatibility.
   *
   * Returns the ruler ID.
   */
  addRuler: (start: Point, end: Point, kind?: "simple" | "super") => string;
  /** Restore rulers from snapshots (for undo). Returns new IDs. */
  restoreRulers: (rulers: Ruler[]) => string[];
  /** Set the current snap point (or null to clear). */
  setSnapPoint: (point: Point | null) => void;
  /**
   * Request inline label editing for a ruler (or clear with `null`).
   * No-op if the ruler is not a `"super"` ruler.
   */
  setEditingRulerId: (id: string | null) => void;
}

/** Generate a unique ruler ID. */
function generateId(): string {
  return `ruler-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useRulerStore = create<RulerState>((set, get) => ({
  rulers: new Map(),
  activeRulerId: null,
  previewEnd: null,
  creationStep: 0,
  selectedRulerIds: new Set(),
  hoveredRulerId: null,
  marqueePreviewIds: new Set(),
  hoveredEndpoint: null,
  hoveredVertex: null,
  draggingEndpoint: null,
  draggingVertex: null,
  draggingEndpointOriginal: null,
  isMovingRuler: false,
  moveStartPoint: null,
  moveOriginalPoint: null,
  snapPoint: null,
  editingRulerId: null,

  startRuler: (start, kind = "simple") => {
    const id = generateId();
    let ruler: Ruler;
    switch (kind) {
      case "simple":
        ruler = { id, kind: "simple", start, end: start };
        break;
      case "super":
        ruler = { id, kind: "super", start, end: start };
        break;
      case "polyline":
        // First committed vertex + a preview vertex that tracks the cursor.
        ruler = { id, kind: "polyline", points: [{ ...start }, { ...start }] };
        break;
      case "angle":
        // Click 1 places the vertex; armA + armB track the cursor until
        // subsequent clicks commit them.
        ruler = { id, kind: "angle", vertex: start, armA: start, armB: start };
        break;
      case "radius":
        // Click 1 places the center; `edge` tracks the cursor.
        ruler = { id, kind: "radius", center: start, edge: start };
        break;
    }

    set((state) => {
      const newRulers = new Map(state.rulers);
      newRulers.set(id, ruler);
      return {
        rulers: newRulers,
        activeRulerId: id,
        previewEnd: start,
        creationStep: 1,
      };
    });

    return id;
  },

  updatePreview: (end) => {
    const state = get();
    if (!state.activeRulerId) return;

    // Update both the preview point and the ruler's end point (or the
    // last polyline vertex — the one that tracks the cursor).
    set((s) => {
      const newRulers = new Map(s.rulers);
      const ruler = newRulers.get(state.activeRulerId!);
      if (ruler) {
        if (ruler.kind === "simple" || ruler.kind === "super") {
          newRulers.set(state.activeRulerId!, { ...ruler, end });
        } else if (ruler.kind === "polyline") {
          const nextPoints = ruler.points.slice();
          nextPoints[nextPoints.length - 1] = end;
          newRulers.set(state.activeRulerId!, { ...ruler, points: nextPoints });
        } else if (ruler.kind === "angle") {
          // Before the second click (step 1) we preview both armA and armB
          // because they share the vertex. After the second click
          // (step 2), only armB follows the cursor.
          if (state.creationStep === 1) {
            newRulers.set(state.activeRulerId!, { ...ruler, armA: end, armB: end });
          } else {
            newRulers.set(state.activeRulerId!, { ...ruler, armB: end });
          }
        } else if (ruler.kind === "radius") {
          newRulers.set(state.activeRulerId!, { ...ruler, edge: end });
        }
      }
      return {
        rulers: newRulers,
        previewEnd: end,
      };
    });
  },

  finalizeRuler: (end) => {
    const state = get();
    if (!state.activeRulerId) return null;

    const ruler = state.rulers.get(state.activeRulerId);
    if (!ruler) return null;

    let finalizedRuler: Ruler;
    if (ruler.kind === "simple" || ruler.kind === "super") {
      finalizedRuler = { ...ruler, end };
    } else if (ruler.kind === "polyline") {
      // Replace the preview vertex with the committed end.
      const nextPoints = ruler.points.slice();
      nextPoints[nextPoints.length - 1] = { ...end };
      finalizedRuler = { ...ruler, points: nextPoints };
    } else if (ruler.kind === "angle") {
      // Only meaningful to finalize after both arms have been placed
      // (creationStep === 2) — commit the current armB at `end`.
      finalizedRuler = { ...ruler, armB: { ...end } };
    } else if (ruler.kind === "radius") {
      finalizedRuler = { ...ruler, edge: { ...end } };
    } else {
      finalizedRuler = ruler;
    }

    set((s) => {
      const newRulers = new Map(s.rulers);
      newRulers.set(state.activeRulerId!, finalizedRuler);
      return {
        rulers: newRulers,
        activeRulerId: null,
        previewEnd: null,
        creationStep: 0,
        // Don't auto-select - let user click to select if needed
      };
    });

    return finalizedRuler;
  },

  cancelCreation: () => {
    const state = get();
    if (!state.activeRulerId) return;

    set((s) => {
      const newRulers = new Map(s.rulers);
      newRulers.delete(state.activeRulerId!);
      return {
        rulers: newRulers,
        activeRulerId: null,
        previewEnd: null,
        creationStep: 0,
      };
    });
  },

  updateEndpoint: (rulerId, endpoint, point) => {
    set((state) => {
      const newRulers = new Map(state.rulers);
      const ruler = newRulers.get(rulerId);
      // Endpoint mutations only apply to two-point rulers.
      if (ruler && (ruler.kind === "simple" || ruler.kind === "super")) {
        newRulers.set(rulerId, {
          ...ruler,
          [endpoint]: point,
        });
      }
      return { rulers: newRulers };
    });
  },

  updateRulerPoint: (rulerId, pointIndex, point) => {
    set((state) => {
      const newRulers = new Map(state.rulers);
      const ruler = newRulers.get(rulerId);
      if (!ruler) return { rulers: newRulers };
      if (ruler.kind === "simple" || ruler.kind === "super") {
        if (pointIndex === 0) newRulers.set(rulerId, { ...ruler, start: { ...point } });
        else if (pointIndex === 1) newRulers.set(rulerId, { ...ruler, end: { ...point } });
      } else if (ruler.kind === "polyline") {
        if (pointIndex < 0 || pointIndex >= ruler.points.length) {
          return { rulers: newRulers };
        }
        const nextPoints = ruler.points.slice();
        nextPoints[pointIndex] = { ...point };
        newRulers.set(rulerId, { ...ruler, points: nextPoints });
      }
      return { rulers: newRulers };
    });
  },

  appendPolylinePoint: (rulerId, point) => {
    set((state) => {
      const newRulers = new Map(state.rulers);
      const ruler = newRulers.get(rulerId);
      if (!ruler || ruler.kind !== "polyline") return { rulers: newRulers };
      // The last vertex is the cursor preview; commit it by appending a
      // new preview at the same position.
      const nextPoints = ruler.points.slice();
      const last = nextPoints[nextPoints.length - 1];
      nextPoints[nextPoints.length - 1] = { ...point };
      nextPoints.push({ ...last });
      newRulers.set(rulerId, { ...ruler, points: nextPoints });
      return { rulers: newRulers };
    });
  },

  popPolylinePoint: (rulerId) => {
    const state = get();
    const ruler = state.rulers.get(rulerId);
    if (!ruler || ruler.kind !== "polyline") return false;
    // points[] = [committed…, preview]. Need at least 2 committed vertices
    // to safely drop one and keep a valid polyline.
    if (ruler.points.length <= 2) return false;
    const nextPoints = ruler.points.slice();
    // Remove the committed vertex just before the preview.
    nextPoints.splice(nextPoints.length - 2, 1);
    set((s) => {
      const newRulers = new Map(s.rulers);
      newRulers.set(rulerId, { ...ruler, points: nextPoints });
      return { rulers: newRulers };
    });
    return true;
  },

  commitAngleArmA: (rulerId, point) => {
    set((state) => {
      const newRulers = new Map(state.rulers);
      const ruler = newRulers.get(rulerId);
      if (!ruler || ruler.kind !== "angle") return { rulers: newRulers };
      newRulers.set(rulerId, { ...ruler, armA: { ...point }, armB: { ...point } });
      return { rulers: newRulers, creationStep: 2 };
    });
  },

  updateRulerProps: (rulerId, props) => {
    set((state) => {
      const newRulers = new Map(state.rulers);
      const ruler = newRulers.get(rulerId);
      if (!ruler) return { rulers: newRulers };
      // Only "super" rulers currently carry label / unitOverride. Future
      // ruler kinds can opt in here as needed.
      if (ruler.kind !== "super") return { rulers: newRulers };
      newRulers.set(rulerId, { ...ruler, ...props });
      return { rulers: newRulers };
    });
  },

  removeRuler: (id) => {
    set((state) => {
      const newRulers = new Map(state.rulers);
      newRulers.delete(id);
      const newSelectedIds = new Set(state.selectedRulerIds);
      newSelectedIds.delete(id);
      return {
        rulers: newRulers,
        selectedRulerIds: newSelectedIds,
        hoveredRulerId: state.hoveredRulerId === id ? null : state.hoveredRulerId,
        hoveredEndpoint: state.hoveredEndpoint?.rulerId === id ? null : state.hoveredEndpoint,
        hoveredVertex: state.hoveredVertex?.rulerId === id ? null : state.hoveredVertex,
        draggingEndpoint: state.draggingEndpoint?.rulerId === id ? null : state.draggingEndpoint,
        draggingVertex: state.draggingVertex?.rulerId === id ? null : state.draggingVertex,
      };
    });
  },

  removeRulers: (ids) => {
    set((state) => {
      const newRulers = new Map(state.rulers);
      const newSelectedIds = new Set(state.selectedRulerIds);
      for (const id of ids) {
        newRulers.delete(id);
        newSelectedIds.delete(id);
      }
      return {
        rulers: newRulers,
        selectedRulerIds: newSelectedIds,
        hoveredRulerId: ids.includes(state.hoveredRulerId ?? "") ? null : state.hoveredRulerId,
        hoveredEndpoint:
          state.hoveredEndpoint && ids.includes(state.hoveredEndpoint.rulerId)
            ? null
            : state.hoveredEndpoint,
        hoveredVertex:
          state.hoveredVertex && ids.includes(state.hoveredVertex.rulerId)
            ? null
            : state.hoveredVertex,
        draggingEndpoint:
          state.draggingEndpoint && ids.includes(state.draggingEndpoint.rulerId)
            ? null
            : state.draggingEndpoint,
        draggingVertex:
          state.draggingVertex && ids.includes(state.draggingVertex.rulerId)
            ? null
            : state.draggingVertex,
      };
    });
  },

  clearAllRulers: () =>
    set({
      rulers: new Map(),
      activeRulerId: null,
      previewEnd: null,
      creationStep: 0,
      selectedRulerIds: new Set(),
      hoveredRulerId: null,
      marqueePreviewIds: new Set(),
      hoveredEndpoint: null,
      hoveredVertex: null,
      draggingEndpoint: null,
      draggingEndpointOriginal: null,
      draggingVertex: null,
      isMovingRuler: false,
      moveStartPoint: null,
      moveOriginalPoint: null,
      snapPoint: null,
    }),

  setHoveredEndpoint: (info) => set({ hoveredEndpoint: info }),

  setDraggingEndpoint: (info) => {
    if (info) {
      // Capture original position when starting to drag. Endpoint drag
      // only applies to two-point rulers; if someone passes a polyline
      // id we simply skip capture (no undo info available).
      const ruler = get().rulers.get(info.rulerId);
      const originalPos =
        ruler && (ruler.kind === "simple" || ruler.kind === "super")
          ? { ...ruler[info.endpoint] }
          : null;
      set({ draggingEndpoint: info, draggingEndpointOriginal: originalPos });
    } else {
      set({ draggingEndpoint: null });
    }
  },

  endDraggingEndpoint: () => {
    const state = get();
    const { draggingEndpoint, draggingEndpointOriginal, rulers } = state;

    if (!draggingEndpoint || !draggingEndpointOriginal) {
      set({ draggingEndpoint: null, draggingEndpointOriginal: null });
      return null;
    }

    const ruler = rulers.get(draggingEndpoint.rulerId);
    if (!ruler || (ruler.kind !== "simple" && ruler.kind !== "super")) {
      set({ draggingEndpoint: null, draggingEndpointOriginal: null });
      return null;
    }

    const newPosition = ruler[draggingEndpoint.endpoint];

    // Check if there was actual movement
    const hasMoved =
      newPosition.x !== draggingEndpointOriginal.x || newPosition.y !== draggingEndpointOriginal.y;

    set({ draggingEndpoint: null, draggingEndpointOriginal: null });

    if (hasMoved) {
      return {
        rulerId: draggingEndpoint.rulerId,
        endpoint: draggingEndpoint.endpoint,
        oldPosition: draggingEndpointOriginal,
        newPosition: { ...newPosition },
      };
    }

    return null;
  },

  setHoveredVertex: (info) => set({ hoveredVertex: info }),

  setDraggingVertex: (info) => {
    if (!info) {
      set({ draggingVertex: null });
      return;
    }
    const ruler = get().rulers.get(info.rulerId);
    if (!ruler || ruler.kind !== "polyline") {
      set({ draggingVertex: null });
      return;
    }
    if (info.pointIndex < 0 || info.pointIndex >= ruler.points.length) {
      set({ draggingVertex: null });
      return;
    }
    set({
      draggingVertex: {
        rulerId: info.rulerId,
        pointIndex: info.pointIndex,
        originalPosition: { ...ruler.points[info.pointIndex] },
      },
    });
  },

  endDraggingVertex: () => {
    const state = get();
    const dragging = state.draggingVertex;
    if (!dragging) {
      set({ draggingVertex: null });
      return null;
    }

    const ruler = state.rulers.get(dragging.rulerId);
    if (!ruler || ruler.kind !== "polyline") {
      set({ draggingVertex: null });
      return null;
    }
    if (dragging.pointIndex < 0 || dragging.pointIndex >= ruler.points.length) {
      set({ draggingVertex: null });
      return null;
    }

    const newPosition = { ...ruler.points[dragging.pointIndex] };
    const hasMoved =
      newPosition.x !== dragging.originalPosition.x ||
      newPosition.y !== dragging.originalPosition.y;

    set({ draggingVertex: null });

    if (hasMoved) {
      return {
        rulerId: dragging.rulerId,
        pointIndex: dragging.pointIndex,
        oldPosition: dragging.originalPosition,
        newPosition,
      };
    }
    return null;
  },

  selectRuler: (id) => set({ selectedRulerIds: id ? new Set([id]) : new Set() }),

  toggleSelection: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedRulerIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { selectedRulerIds: newSet };
    }),

  addToSelection: (ids) => {
    set((state) => {
      const newSelectedIds = new Set(state.selectedRulerIds);
      for (const id of ids) {
        newSelectedIds.add(id);
      }
      return { selectedRulerIds: newSelectedIds };
    });
  },

  setSelection: (ids) => set({ selectedRulerIds: ids }),

  clearSelection: () => set({ selectedRulerIds: new Set() }),

  setHoveredRuler: (id) => set({ hoveredRulerId: id }),

  setMarqueePreviewIds: (ids) => set({ marqueePreviewIds: new Set(ids) }),

  startMoveRuler: (startPoint) => {
    const state = get();
    if (state.selectedRulerIds.size === 0) return;

    set({
      isMovingRuler: true,
      moveStartPoint: startPoint,
      moveOriginalPoint: startPoint,
    });
  },

  moveRuler: (currentPoint) => {
    const state = get();
    if (!state.isMovingRuler || state.selectedRulerIds.size === 0 || !state.moveStartPoint) return;

    const dx = currentPoint.x - state.moveStartPoint.x;
    const dy = currentPoint.y - state.moveStartPoint.y;

    set((s) => {
      const newRulers = new Map(s.rulers);
      for (const rulerId of state.selectedRulerIds) {
        const ruler = newRulers.get(rulerId);
        if (ruler) {
          // Use the kind-aware helper so polyline / angle / radius rulers
          // translate every control point, not just a two-point segment.
          newRulers.set(rulerId, translateRuler(ruler, dx, dy));
        }
      }
      return {
        rulers: newRulers,
        moveStartPoint: currentPoint,
      };
    });
  },

  endMoveRuler: () => {
    const state = get();
    const { selectedRulerIds, moveStartPoint, moveOriginalPoint } = state;

    // Calculate total delta
    let result: { rulerIds: string[]; deltaX: number; deltaY: number } | null = null;
    if (moveStartPoint && moveOriginalPoint && selectedRulerIds.size > 0) {
      const deltaX = moveStartPoint.x - moveOriginalPoint.x;
      const deltaY = moveStartPoint.y - moveOriginalPoint.y;
      // Only return result if there was actual movement
      if (deltaX !== 0 || deltaY !== 0) {
        result = {
          rulerIds: [...selectedRulerIds],
          deltaX,
          deltaY,
        };
      }
    }

    set({
      isMovingRuler: false,
      moveStartPoint: null,
      moveOriginalPoint: null,
    });

    return result;
  },

  deleteSelectedRulers: () => {
    const state = get();
    if (state.selectedRulerIds.size > 0) {
      get().removeRulers(Array.from(state.selectedRulerIds));
    }
  },

  addRuler: (start, end, kind = "simple") => {
    const id = generateId();
    const ruler: Ruler =
      kind === "super" ? { id, kind: "super", start, end } : { id, kind: "simple", start, end };

    set((state) => {
      const newRulers = new Map(state.rulers);
      newRulers.set(id, ruler);
      return { rulers: newRulers };
    });

    return id;
  },

  restoreRulers: (rulers) => {
    const newIds: string[] = [];

    set((state) => {
      const newRulers = new Map(state.rulers);
      for (const ruler of rulers) {
        // Generate new ID for restored ruler; preserve kind + all other fields
        const newId = generateId();
        newRulers.set(newId, { ...ruler, id: newId });
        newIds.push(newId);
      }
      return { rulers: newRulers };
    });

    return newIds;
  },

  setSnapPoint: (point) => set({ snapPoint: point }),

  setEditingRulerId: (id) => {
    if (id === null) {
      set({ editingRulerId: null });
      return;
    }
    // Only super rulers carry a label; ignore requests for other kinds
    // so callers don't have to type-check.
    const ruler = get().rulers.get(id);
    if (!ruler || ruler.kind !== "super") return;
    set({ editingRulerId: id });
  },
}));
