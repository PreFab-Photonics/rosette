import { useCallback, useEffect } from "react";
import { useToolStore } from "@/stores/tool";
import { useHistoryStore } from "@/stores/history";
import { useRulerStore, type Point, type Ruler, type RulerEndpoint } from "@/stores/ruler";
import { CreateRulerCommand, MoveRulersCommand, MoveRulerEndpointCommand } from "@/lib/commands";
import { calculateSnappedPoint, getSnapVertices } from "@/lib/snap";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";

/** Screen pixel threshold for detecting endpoint hover/click. */
const ENDPOINT_HIT_THRESHOLD_PX = 12;

/** Screen pixel threshold for detecting ruler line hover/click. */
const LINE_HIT_THRESHOLD_PX = 8;

/** Measurement box dimensions in screen pixels (must match RulerOverlay). */
const BOX_WIDTH = 140;
const BOX_HEIGHT = 56;

/**
 * Check if a screen point is near a world point.
 */
function isNearPoint(
  screenPoint: { x: number; y: number },
  worldPoint: Point,
  zoom: number,
  offset: { x: number; y: number },
  thresholdPx: number,
): boolean {
  const worldScreenX = worldPoint.x * zoom + offset.x;
  const worldScreenY = worldPoint.y * zoom + offset.y;
  const dx = screenPoint.x - worldScreenX;
  const dy = screenPoint.y - worldScreenY;
  return dx * dx + dy * dy <= thresholdPx * thresholdPx;
}

/**
 * Calculate distance from a point to a line segment.
 */
function pointToSegmentDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  // Handle degenerate case where start === end
  if (lenSq === 0) {
    return Math.sqrt(A * A + B * B);
  }

  const param = Math.max(0, Math.min(1, dot / lenSq));
  const closestX = x1 + param * C;
  const closestY = y1 + param * D;

  const dx = px - closestX;
  const dy = py - closestY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a screen point is near a ruler's line segment.
 */
function isNearRulerLine(
  screenX: number,
  screenY: number,
  ruler: Ruler,
  zoom: number,
  offset: { x: number; y: number },
  thresholdPx: number,
): boolean {
  const startScreenX = ruler.start.x * zoom + offset.x;
  const startScreenY = ruler.start.y * zoom + offset.y;
  const endScreenX = ruler.end.x * zoom + offset.x;
  const endScreenY = ruler.end.y * zoom + offset.y;

  const distance = pointToSegmentDistance(
    screenX,
    screenY,
    startScreenX,
    startScreenY,
    endScreenX,
    endScreenY,
  );

  return distance <= thresholdPx;
}

/**
 * Check if a screen point is inside a ruler's measurement box.
 */
function isInsideRulerBox(
  screenX: number,
  screenY: number,
  ruler: Ruler,
  zoom: number,
  offset: { x: number; y: number },
): boolean {
  const startScreenX = ruler.start.x * zoom + offset.x;
  const startScreenY = ruler.start.y * zoom + offset.y;
  const endScreenX = ruler.end.x * zoom + offset.x;
  const endScreenY = ruler.end.y * zoom + offset.y;

  const midX = (startScreenX + endScreenX) / 2;
  const midY = (startScreenY + endScreenY) / 2;

  const halfWidth = BOX_WIDTH / 2;
  const halfHeight = BOX_HEIGHT / 2;

  return (
    screenX >= midX - halfWidth &&
    screenX <= midX + halfWidth &&
    screenY >= midY - halfHeight &&
    screenY <= midY + halfHeight
  );
}

/**
 * Find which ruler endpoint (if any) is near a screen point.
 */
function findNearEndpoint(
  screenX: number,
  screenY: number,
  rulers: Map<string, Ruler>,
  zoom: number,
  offset: { x: number; y: number },
  excludeRulerId?: string,
): { rulerId: string; endpoint: RulerEndpoint } | null {
  const screenPoint = { x: screenX, y: screenY };

  for (const ruler of rulers.values()) {
    if (ruler.id === excludeRulerId) continue;

    if (isNearPoint(screenPoint, ruler.start, zoom, offset, ENDPOINT_HIT_THRESHOLD_PX)) {
      return { rulerId: ruler.id, endpoint: "start" };
    }
    if (isNearPoint(screenPoint, ruler.end, zoom, offset, ENDPOINT_HIT_THRESHOLD_PX)) {
      return { rulerId: ruler.id, endpoint: "end" };
    }
  }

  return null;
}

/**
 * Find which ruler (if any) is at a screen point (line or box).
 */
function findRulerAtPoint(
  screenX: number,
  screenY: number,
  rulers: Map<string, Ruler>,
  zoom: number,
  offset: { x: number; y: number },
  excludeRulerId?: string,
): string | null {
  for (const ruler of rulers.values()) {
    if (ruler.id === excludeRulerId) continue;

    // Check box first (higher priority)
    if (isInsideRulerBox(screenX, screenY, ruler, zoom, offset)) {
      return ruler.id;
    }

    // Check line
    if (isNearRulerLine(screenX, screenY, ruler, zoom, offset, LINE_HIT_THRESHOLD_PX)) {
      return ruler.id;
    }
  }

  return null;
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
    selectedRulerIds,
    hoveredRulerId,
    draggingEndpoint,
    isMovingRuler,
    startRuler,
    updatePreview,
    finalizeRuler,
    cancelCreation,
    updateEndpoint,
    setHoveredEndpoint,
    setDraggingEndpoint,
    endDraggingEndpoint,
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

  // Reset state when tool changes away from ruler
  useEffect(() => {
    if (activeTool !== "ruler") {
      // Cancel any in-progress creation
      if (activeRulerId) {
        cancelCreation();
      }
      // Clear hover state but keep selection
      setHoveredEndpoint(null);
      setHoveredRuler(null);
    }
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

      // Check if clicking near an existing endpoint (to drag it)
      const nearEndpoint = findNearEndpoint(
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

      // Check if clicking on an existing ruler (to select or move it)
      const clickedRulerId = findRulerAtPoint(
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
        // Second click - finalize the ruler
        const finalizedRuler = finalizeRuler(snappedPoint);
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
        // No ruler selected, start a new one
        startRuler(snappedPoint);
      }
    },
    [
      screenToWorld,
      library,
      renderer,
      rulers,
      zoom,
      offset,
      activeRulerId,
      selectedRulerIds,
      startRuler,
      finalizeRuler,
      setDraggingEndpoint,
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

      // Handle endpoint dragging (with geometry snapping)
      if (draggingEndpoint) {
        updateEndpoint(draggingEndpoint.rulerId, draggingEndpoint.endpoint, snappedPoint);
        // Update snap indicator for visual feedback
        setSnapPoint(snapResult.isGeometrySnap ? snappedPoint : null);
        return;
      }

      // Handle ruler creation preview (with geometry snapping)
      if (activeRulerId) {
        updatePreview(snappedPoint);
        // Update snap indicator for visual feedback
        setSnapPoint(snapResult.isGeometrySnap ? snappedPoint : null);
        return;
      }

      // Handle hover detection for existing endpoints and rulers
      const nearEndpoint = findNearEndpoint(screenX, screenY, rulers, zoom, offset);
      setHoveredEndpoint(nearEndpoint);

      const hoveredId = nearEndpoint
        ? nearEndpoint.rulerId
        : findRulerAtPoint(screenX, screenY, rulers, zoom, offset);
      setHoveredRuler(hoveredId);

      // Show snap indicator before first click (when ready to place first point)
      // Only when not hovering over existing rulers/endpoints and no selection
      if (!nearEndpoint && !hoveredId && selectedRulerIds.size === 0) {
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
      isMovingRuler,
      selectedRulerIds,
      updatePreview,
      updateEndpoint,
      moveRuler,
      setHoveredEndpoint,
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
    isMovingRuler,
    endDraggingEndpoint,
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
    setHoveredRuler(null);
    setDraggingEndpoint(null);
    setSnapPoint(null);
  }, [cancelCreation, setHoveredEndpoint, setHoveredRuler, setDraggingEndpoint, setSnapPoint]);

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
