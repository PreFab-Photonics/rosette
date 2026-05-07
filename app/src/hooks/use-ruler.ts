import { useCallback, useEffect } from "react";
import { isRulerTool, useToolStore } from "@/stores/tool";
import { useHistoryStore } from "@/stores/history";
import { useRulerStore, type Point, type Ruler } from "@/stores/ruler";
import { useUIStore } from "@/stores/ui";
import {
  CreateRulerCommand,
  MoveRulersCommand,
  MoveRulerEndpointCommand,
  MoveRulerPointCommand,
} from "@/lib/commands";
import { calculateSnappedPoint, getSnapVertices } from "@/lib/snap";
import {
  findRulerAtScreenPoint,
  findRulerEndpointAtScreenPoint,
  findRulerVertexAtScreenPoint,
} from "@/lib/ruler-hittest";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";

/**
 * Angles (radians) Manhattan-snap to the nearest multiple of π/4 (45°)
 * when Alt is held during creation / endpoint drag.
 *
 * Matches the path tool's `MANHATTAN_SNAP_ANGLE_DEG = 45` convention.
 */
const MANHATTAN_SNAP_RAD = Math.PI / 4;

/**
 * Constrain `end` so that the segment `start → end` lies on the nearest
 * 0°/45°/90°/… direction while preserving its original length.
 *
 * Used when the Super Ruler is created/dragged with Alt held. Returns the
 * constrained point; if `start` and `end` coincide, returns `end` unchanged.
 */
function manhattanConstrain(start: Point, end: Point): Point {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length === 0) return end;
  const rawAngle = Math.atan2(dy, dx);
  const snapped = Math.round(rawAngle / MANHATTAN_SNAP_RAD) * MANHATTAN_SNAP_RAD;
  return {
    x: start.x + Math.cos(snapped) * length,
    y: start.y + Math.sin(snapped) * length,
  };
}

/** Map a ruler sub-tool to the `Ruler["kind"]` it creates. */
function rulerKindForTool(tool: string): Ruler["kind"] | null {
  switch (tool) {
    case "ruler":
      return "simple";
    case "ruler-super":
      return "super";
    case "ruler-polyline":
      return "polyline";
    case "ruler-angle":
      return "angle";
    case "ruler-radius":
      return "radius";
    default:
      return null;
  }
}

/**
 * Hook for ruler tool interactions.
 *
 * Handles creating rulers by clicking two points, selecting rulers,
 * editing existing rulers by dragging their endpoints, and moving
 * entire rulers.
 *
 * @param screenToWorld - Function to convert screen coordinates to world coordinates.
 * @param library - The WasmLibrary instance (for command context).
 * @param renderer - The WasmRenderer instance (for command context).
 * @param zoom - Current zoom level.
 * @param offset - Current viewport offset.
 * @returns Event handlers and state.
 */
export function useRuler(
  screenToWorld: (screenX: number, screenY: number) => { x: number; y: number } | null,
  library: WasmLibrary | null,
  renderer: WasmRenderer | null,
  zoom: number,
  offset: { x: number; y: number },
) {
  const activeTool = useToolStore((s) => s.activeTool);
  const {
    rulers,
    activeRulerId,
    creationStep,
    selectedRulerIds,
    hoveredRulerId,
    draggingEndpoint,
    draggingVertex,
    isMovingRuler,
    startRuler,
    updatePreview,
    finalizeRuler,
    cancelCreation,
    updateEndpoint,
    updateRulerPoint,
    appendPolylinePoint,
    commitAngleArmA,
    setHoveredEndpoint,
    setHoveredVertex,
    setDraggingEndpoint,
    setDraggingVertex,
    endDraggingEndpoint,
    endDraggingVertex,
    selectRuler,
    toggleSelection,
    addToSelection,
    clearSelection: clearRulerSelection,
    setHoveredRuler,
    startMoveRuler,
    moveRuler,
    endMoveRuler,
    setSnapPoint,
  } = useRulerStore();

  // Reset state when tool changes away from any ruler tool.
  // Also auto-reveal rulers when a ruler tool becomes active so the user
  // doesn't accidentally try to draw onto a hidden overlay.
  useEffect(() => {
    if (isRulerTool(activeTool)) {
      const { showRulers, setShowRulers } = useUIStore.getState();
      if (!showRulers) setShowRulers(true);
      return;
    }
    // Cancel any in-progress creation
    if (activeRulerId) {
      cancelCreation();
    }
    // Clear hover state but keep selection
    setHoveredEndpoint(null);
    setHoveredRuler(null);
  }, [activeTool, activeRulerId, cancelCreation, setHoveredEndpoint, setHoveredRuler]);

  /**
   * Handle mouse down - start new ruler, select ruler, or begin drag.
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left click

      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Convert to world coordinates
      const world = screenToWorld(screenX, screenY);
      if (!world) return;

      // Get fresh vertices and calculate snapped point (geometry first, then grid)
      // Shift key disables geometry snapping
      const vertices = getSnapVertices(library);
      const snapResult = calculateSnappedPoint(
        screenX,
        screenY,
        world.x,
        world.y,
        vertices,
        zoom,
        offset,
        e.shiftKey,
      );
      const snappedPoint = snapResult.point;

      // Check for polyline-vertex hit first (any ruler kind that has
      // vertices). For two-point rulers this also fires, but the
      // endpoint-based hit test below is preferred so the result can feed
      // the `draggingEndpoint` path (which carries endpoint-specific
      // undo logic).
      const nearEndpoint = findRulerEndpointAtScreenPoint(
        screenX,
        screenY,
        rulers,
        zoom,
        offset,
        activeRulerId ?? undefined,
      );
      if (nearEndpoint) {
        // Handle selection with modifier keys
        if (e.shiftKey) {
          addToSelection([nearEndpoint.rulerId]);
        } else if (e.metaKey || e.ctrlKey) {
          toggleSelection(nearEndpoint.rulerId);
        } else {
          selectRuler(nearEndpoint.rulerId);
        }
        setDraggingEndpoint(nearEndpoint);
        return;
      }

      // Fall through to kind-agnostic vertex hit-test (for polyline and
      // future kinds whose vertices don't fit the start/end mold).
      const nearVertex = findRulerVertexAtScreenPoint(
        screenX,
        screenY,
        rulers,
        zoom,
        offset,
        activeRulerId ?? undefined,
      );
      if (nearVertex) {
        if (e.shiftKey) {
          addToSelection([nearVertex.rulerId]);
        } else if (e.metaKey || e.ctrlKey) {
          toggleSelection(nearVertex.rulerId);
        } else {
          selectRuler(nearVertex.rulerId);
        }
        setDraggingVertex(nearVertex);
        return;
      }

      // Check if clicking on an existing ruler (to select or move it)
      const clickedRulerId = findRulerAtScreenPoint(
        screenX,
        screenY,
        rulers,
        zoom,
        offset,
        activeRulerId ?? undefined,
      );
      if (clickedRulerId) {
        // Handle selection with modifier keys
        if (e.shiftKey) {
          // Shift+click: add to selection
          addToSelection([clickedRulerId]);
        } else if (e.metaKey || e.ctrlKey) {
          // Ctrl/Cmd+click: toggle selection
          toggleSelection(clickedRulerId);
        } else if (selectedRulerIds.has(clickedRulerId)) {
          // Plain click on already selected ruler: start moving it
          startMoveRuler(snappedPoint);
        } else {
          // Plain click: select only this ruler
          selectRuler(clickedRulerId);
        }
        return;
      }

      // Clicking on empty space
      if (activeRulerId) {
        const active = rulers.get(activeRulerId);

        if (active && active.kind === "polyline") {
          // Polyline: click appends a new committed vertex. Finalization
          // happens on double-click (below) or via the Enter shortcut.
          // If this mousedown is the second half of a double-click, skip
          // the append — we'll finalize instead.
          if (e.detail >= 2) {
            const finalized = finalizeRuler(snappedPoint);
            setSnapPoint(null);
            if (finalized && library && renderer) {
              const command = new CreateRulerCommand(finalized);
              useHistoryStore.getState().pushCommand(command);
            }
          } else {
            appendPolylinePoint(activeRulerId, snappedPoint);
            setSnapPoint(null);
          }
          return;
        }

        if (active && active.kind === "angle") {
          // Click 2 commits armA; click 3 finalizes with armB at the
          // current position.
          if (creationStep === 1) {
            commitAngleArmA(activeRulerId, snappedPoint);
            setSnapPoint(null);
          } else {
            const finalized = finalizeRuler(snappedPoint);
            setSnapPoint(null);
            if (finalized && library && renderer) {
              const command = new CreateRulerCommand(finalized);
              useHistoryStore.getState().pushCommand(command);
            }
          }
          return;
        }

        if (active && active.kind === "radius") {
          // Click 2 finalizes the radius ruler.
          const finalized = finalizeRuler(snappedPoint);
          setSnapPoint(null);
          if (finalized && library && renderer) {
            const command = new CreateRulerCommand(finalized);
            useHistoryStore.getState().pushCommand(command);
          }
          return;
        }

        // Two-point rulers (simple / super): second click finalizes.
        // Apply Alt-Manhattan constraint for super rulers on commit,
        // matching the preview snapping below.
        const finalPoint =
          e.altKey && active && active.kind === "super"
            ? manhattanConstrain(active.start, snappedPoint)
            : snappedPoint;
        const finalizedRuler = finalizeRuler(finalPoint);
        // Clear snap indicator
        setSnapPoint(null);
        // Record creation for undo
        if (finalizedRuler && library && renderer) {
          const command = new CreateRulerCommand(finalizedRuler);
          useHistoryStore.getState().pushCommand(command);
        }
      } else if (selectedRulerIds.size > 0 && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        // Plain click on empty space with rulers selected - deselect
        clearRulerSelection();
      } else if (selectedRulerIds.size === 0) {
        // No ruler selected, start a new one. The discriminator comes from
        // the active tool; unknown ruler tools fall back to "simple".
        const kind = rulerKindForTool(activeTool) ?? "simple";
        startRuler(snappedPoint, kind);
      }
    },
    [
      screenToWorld,
      library,
      renderer,
      rulers,
      zoom,
      offset,
      activeTool,
      activeRulerId,
      creationStep,
      selectedRulerIds,
      startRuler,
      finalizeRuler,
      appendPolylinePoint,
      commitAngleArmA,
      setDraggingEndpoint,
      setDraggingVertex,
      selectRuler,
      toggleSelection,
      addToSelection,
      clearRulerSelection,
      startMoveRuler,
      setSnapPoint,
    ],
  );

  /**
   * Handle mouse move - update preview, drag endpoint, move ruler, or update hover.
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const world = screenToWorld(screenX, screenY);
      if (!world) return;

      // Get fresh vertices and calculate snapped point (geometry first, then grid)
      // Shift key disables geometry snapping
      const vertices = getSnapVertices(library);
      const snapResult = calculateSnappedPoint(
        screenX,
        screenY,
        world.x,
        world.y,
        vertices,
        zoom,
        offset,
        e.shiftKey,
      );
      const snappedPoint = snapResult.point;

      // Handle ruler moving (with geometry snapping)
      if (isMovingRuler) {
        moveRuler(snappedPoint);
        setSnapPoint(snapResult.isGeometrySnap ? snappedPoint : null);
        return;
      }

      // Handle endpoint dragging (with geometry snapping).
      // For super rulers with Alt held, constrain the segment to Manhattan
      // directions anchored at the *opposite* endpoint.
      if (draggingEndpoint) {
        const dragged = rulers.get(draggingEndpoint.rulerId);
        let point = snappedPoint;
        if (e.altKey && dragged && dragged.kind === "super") {
          const anchor = draggingEndpoint.endpoint === "start" ? dragged.end : dragged.start;
          point = manhattanConstrain(anchor, snappedPoint);
        }
        updateEndpoint(draggingEndpoint.rulerId, draggingEndpoint.endpoint, point);
        // Update snap indicator for visual feedback
        setSnapPoint(snapResult.isGeometrySnap ? snappedPoint : null);
        return;
      }

      // Handle polyline vertex drag.
      if (draggingVertex) {
        updateRulerPoint(draggingVertex.rulerId, draggingVertex.pointIndex, snappedPoint);
        setSnapPoint(snapResult.isGeometrySnap ? snappedPoint : null);
        return;
      }

      // Handle ruler creation preview (with geometry snapping).
      // Alt constrains super-ruler preview to Manhattan directions.
      if (activeRulerId) {
        const active = rulers.get(activeRulerId);
        let point = snappedPoint;
        if (e.altKey && active && active.kind === "super") {
          point = manhattanConstrain(active.start, snappedPoint);
        }
        updatePreview(point);
        // Update snap indicator for visual feedback
        setSnapPoint(snapResult.isGeometrySnap ? snappedPoint : null);
        return;
      }

      // Handle hover detection for existing endpoints and rulers.
      // Endpoint hit-test takes priority (two-point-only); then vertex
      // hit-test covers polylines / future kinds; then line/box hit-test.
      const nearEndpoint = findRulerEndpointAtScreenPoint(screenX, screenY, rulers, zoom, offset);
      setHoveredEndpoint(nearEndpoint);

      const nearVertex = nearEndpoint
        ? null
        : findRulerVertexAtScreenPoint(screenX, screenY, rulers, zoom, offset);
      setHoveredVertex(nearVertex);

      const hoveredId = nearEndpoint
        ? nearEndpoint.rulerId
        : nearVertex
          ? nearVertex.rulerId
          : findRulerAtScreenPoint(screenX, screenY, rulers, zoom, offset);
      setHoveredRuler(hoveredId);

      // Show snap indicator before first click (when ready to place first point)
      // Only when not hovering over existing rulers/endpoints and no selection
      if (!nearEndpoint && !nearVertex && !hoveredId && selectedRulerIds.size === 0) {
        // Ready to place first point - show snap indicator
        setSnapPoint(snapResult.isGeometrySnap ? snappedPoint : null);
      } else {
        // Hovering over existing ruler or have selection - clear snap indicator
        setSnapPoint(null);
      }
    },
    [
      screenToWorld,
      library,
      rulers,
      zoom,
      offset,
      activeRulerId,
      draggingEndpoint,
      draggingVertex,
      isMovingRuler,
      selectedRulerIds,
      updatePreview,
      updateEndpoint,
      updateRulerPoint,
      moveRuler,
      setHoveredEndpoint,
      setHoveredVertex,
      setHoveredRuler,
      setSnapPoint,
    ],
  );

  /**
   * Handle mouse up - stop dragging or moving.
   */
  const handleMouseUp = useCallback(() => {
    if (draggingEndpoint) {
      const dragResult = endDraggingEndpoint();
      // Clear snap indicator
      setSnapPoint(null);
      // Create undo command for the endpoint move if there was actual movement
      if (dragResult && library && renderer) {
        const command = new MoveRulerEndpointCommand(
          dragResult.rulerId,
          dragResult.endpoint,
          dragResult.oldPosition,
          dragResult.newPosition,
        );
        useHistoryStore.getState().pushCommand(command);
      }
    }
    if (draggingVertex) {
      const vertexResult = endDraggingVertex();
      setSnapPoint(null);
      if (vertexResult && library && renderer) {
        const command = new MoveRulerPointCommand(
          vertexResult.rulerId,
          vertexResult.pointIndex,
          vertexResult.oldPosition,
          vertexResult.newPosition,
        );
        useHistoryStore.getState().pushCommand(command);
      }
    }
    if (isMovingRuler) {
      const moveResult = endMoveRuler();
      // Create undo command for the move if there was actual movement
      if (moveResult && library && renderer) {
        const command = new MoveRulersCommand(
          moveResult.rulerIds,
          moveResult.deltaX,
          moveResult.deltaY,
        );
        // Push to history without executing (move already happened)
        useHistoryStore.getState().pushCommand(command);
      }
    }
  }, [
    draggingEndpoint,
    draggingVertex,
    isMovingRuler,
    endDraggingEndpoint,
    endDraggingVertex,
    endMoveRuler,
    library,
    renderer,
    setSnapPoint,
  ]);

  /**
   * Cancel ruler creation.
   */
  const cancelDrawing = useCallback(() => {
    cancelCreation();
    setHoveredEndpoint(null);
    setHoveredVertex(null);
    setHoveredRuler(null);
    setDraggingEndpoint(null);
    setDraggingVertex(null);
    setSnapPoint(null);
  }, [
    cancelCreation,
    setHoveredEndpoint,
    setHoveredVertex,
    setHoveredRuler,
    setDraggingEndpoint,
    setDraggingVertex,
    setSnapPoint,
  ]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing,
    /** Whether a ruler is currently being created. */
    isCreating: activeRulerId !== null,
    /** Whether an endpoint is being dragged. */
    isDraggingEndpoint: draggingEndpoint !== null,
    /** Whether a ruler is being moved. */
    isMovingRuler,
    /** ID of the hovered ruler (for cursor). */
    hoveredRulerId,
    /** IDs of the selected rulers. */
    selectedRulerIds,
  };
}
