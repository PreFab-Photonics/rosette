import { create } from "zustand";

/**
 * A point in world coordinates.
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * A ruler measurement line between two points.
 */
export interface Ruler {
  /** Unique identifier. */
  id: string;
  /** Start point in world coordinates. */
  start: Point;
  /** End point in world coordinates. */
  end: Point;
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
  /** IDs of the currently selected rulers. */
  selectedRulerIds: Set<string>;
  /** ID of the ruler currently being hovered (whole ruler, not just endpoint). */
  hoveredRulerId: string | null;
  /** IDs of rulers currently under marquee selection (for preview highlighting). */
  marqueePreviewIds: Set<string>;
  /** Which endpoint is being hovered (for visual feedback). */
  hoveredEndpoint: EndpointInfo | null;
  /** Which endpoint is being dragged. */
  draggingEndpoint: EndpointInfo | null;
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

  /** Start creating a new ruler at the given point. Returns the new ruler ID. */
  startRuler: (start: Point) => string;
  /** Update the preview end point while creating. */
  updatePreview: (end: Point) => void;
  /** Finalize the ruler being created with the given end point. Returns the finalized ruler. */
  finalizeRuler: (end: Point) => Ruler | null;
  /** Cancel ruler creation and remove the active ruler. */
  cancelCreation: () => void;
  /** Update an existing ruler's endpoint position. */
  updateEndpoint: (rulerId: string, endpoint: RulerEndpoint, point: Point) => void;
  /** Remove a ruler by ID. */
  removeRuler: (id: string) => void;
  /** Remove multiple rulers by ID. */
  removeRulers: (ids: string[]) => void;
  /** Remove all rulers. */
  clearAllRulers: () => void;
  /** Set the hovered endpoint (or null to clear). */
  setHoveredEndpoint: (info: EndpointInfo | null) => void;
  /** Set the dragging endpoint (or null to clear). Returns original position for undo. */
  setDraggingEndpoint: (info: EndpointInfo | null) => void;
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
  /** Add a ruler directly (for undo/redo). Returns the ruler ID. */
  addRuler: (start: Point, end: Point) => string;
  /** Restore rulers from snapshots (for undo). Returns new IDs. */
  restoreRulers: (rulers: Ruler[]) => string[];
  /** Set the current snap point (or null to clear). */
  setSnapPoint: (point: Point | null) => void;
}

/** Generate a unique ruler ID. */
function generateId(): string {
  return `ruler-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useRulerStore = create<RulerState>((set, get) => ({
  rulers: new Map(),
  activeRulerId: null,
  previewEnd: null,
  selectedRulerIds: new Set(),
  hoveredRulerId: null,
  marqueePreviewIds: new Set(),
  hoveredEndpoint: null,
  draggingEndpoint: null,
  draggingEndpointOriginal: null,
  isMovingRuler: false,
  moveStartPoint: null,
  moveOriginalPoint: null,
  snapPoint: null,

  startRuler: (start) => {
    const id = generateId();
    const ruler: Ruler = { id, start, end: start };

    set((state) => {
      const newRulers = new Map(state.rulers);
      newRulers.set(id, ruler);
      return {
        rulers: newRulers,
        activeRulerId: id,
        previewEnd: start,
      };
    });

    return id;
  },

  updatePreview: (end) => {
    const state = get();
    if (!state.activeRulerId) return;

    // Update both the preview point and the ruler's end point
    set((s) => {
      const newRulers = new Map(s.rulers);
      const ruler = newRulers.get(state.activeRulerId!);
      if (ruler) {
        newRulers.set(state.activeRulerId!, { ...ruler, end });
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

    const finalizedRuler: Ruler = { ...ruler, end };

    set((s) => {
      const newRulers = new Map(s.rulers);
      newRulers.set(state.activeRulerId!, finalizedRuler);
      return {
        rulers: newRulers,
        activeRulerId: null,
        previewEnd: null,
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
      };
    });
  },

  updateEndpoint: (rulerId, endpoint, point) => {
    set((state) => {
      const newRulers = new Map(state.rulers);
      const ruler = newRulers.get(rulerId);
      if (ruler) {
        newRulers.set(rulerId, {
          ...ruler,
          [endpoint]: point,
        });
      }
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
        draggingEndpoint: state.draggingEndpoint?.rulerId === id ? null : state.draggingEndpoint,
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
        draggingEndpoint:
          state.draggingEndpoint && ids.includes(state.draggingEndpoint.rulerId)
            ? null
            : state.draggingEndpoint,
      };
    });
  },

  clearAllRulers: () =>
    set({
      rulers: new Map(),
      activeRulerId: null,
      previewEnd: null,
      selectedRulerIds: new Set(),
      hoveredRulerId: null,
      marqueePreviewIds: new Set(),
      hoveredEndpoint: null,
      draggingEndpoint: null,
      draggingEndpointOriginal: null,
      isMovingRuler: false,
      moveStartPoint: null,
      moveOriginalPoint: null,
      snapPoint: null,
    }),

  setHoveredEndpoint: (info) => set({ hoveredEndpoint: info }),

  setDraggingEndpoint: (info) => {
    if (info) {
      // Capture original position when starting to drag
      const ruler = get().rulers.get(info.rulerId);
      const originalPos = ruler ? { ...ruler[info.endpoint] } : null;
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
    if (!ruler) {
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
          newRulers.set(rulerId, {
            ...ruler,
            start: { x: ruler.start.x + dx, y: ruler.start.y + dy },
            end: { x: ruler.end.x + dx, y: ruler.end.y + dy },
          });
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

  addRuler: (start, end) => {
    const id = generateId();
    const ruler: Ruler = { id, start, end };

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
        // Generate new ID for restored ruler
        const newId = generateId();
        newRulers.set(newId, { ...ruler, id: newId });
        newIds.push(newId);
      }
      return { rulers: newRulers };
    });

    return newIds;
  },

  setSnapPoint: (point) => set({ snapPoint: point }),
}));
