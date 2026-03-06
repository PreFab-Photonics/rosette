import { useCallback, useEffect, useRef } from "react";
import { useSelectionStore } from "@/stores/selection";
import { useMarqueeStore } from "@/stores/marquee";
import { useHistoryStore } from "@/stores/history";
import { useViewportStore } from "@/stores/viewport";
import { useRulerStore, type Ruler } from "@/stores/ruler";
import { MoveRulerEndpointCommand } from "@/lib/commands";
import { calculateSnappedPoint, getSnapVertices } from "@/lib/snap";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";

/**
 * A point in world coordinates.
 */
interface Point {
  x: number;
  y: number;
}

/** Minimum marquee size in pixels to trigger selection. */
const MIN_MARQUEE_SIZE = 5;

/**
 * Expand a single hit ID to all IDs in the same instance group.
 * In design mode, polygons from the same cell reference share a group.
 */
function expandToGroup(library: WasmLibrary, hitId: string): string[] {
  return library.get_group_ids(hitId);
}

/**
 * Expand a list of hit IDs to include all group members.
 * Deduplicates the result.
 */
function expandAllToGroups(library: WasmLibrary, hitIds: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const id of hitIds) {
    const groupIds = library.get_group_ids(id);
    for (const gid of groupIds) {
      if (!seen.has(gid)) {
        seen.add(gid);
        result.push(gid);
      }
    }
  }
  return result;
}

/** Screen pixel threshold for detecting ruler line hover/click. */
const RULER_LINE_HIT_THRESHOLD_PX = 8;

/** Screen pixel threshold for detecting ruler endpoint hover/click. */
const RULER_ENDPOINT_HIT_THRESHOLD_PX = 12;

/** Measurement box dimensions in screen pixels (must match RulerOverlay). */
const RULER_BOX_WIDTH = 140;
const RULER_BOX_HEIGHT = 56;

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

/** Ruler endpoint type. */
type RulerEndpoint = "start" | "end";

/**
 * Find which ruler endpoint (if any) is near a screen point.
 */
function findRulerEndpointAtScreenPoint(
  screenX: number,
  screenY: number,
  rulers: Map<string, Ruler>,
  zoom: number,
  offset: { x: number; y: number },
): { rulerId: string; endpoint: RulerEndpoint } | null {
  for (const ruler of rulers.values()) {
    const startScreenX = ruler.start.x * zoom + offset.x;
    const startScreenY = ruler.start.y * zoom + offset.y;
    const endScreenX = ruler.end.x * zoom + offset.x;
    const endScreenY = ruler.end.y * zoom + offset.y;

    // Check start endpoint
    const dxStart = screenX - startScreenX;
    const dyStart = screenY - startScreenY;
    if (
      dxStart * dxStart + dyStart * dyStart <=
      RULER_ENDPOINT_HIT_THRESHOLD_PX * RULER_ENDPOINT_HIT_THRESHOLD_PX
    ) {
      return { rulerId: ruler.id, endpoint: "start" };
    }

    // Check end endpoint
    const dxEnd = screenX - endScreenX;
    const dyEnd = screenY - endScreenY;
    if (
      dxEnd * dxEnd + dyEnd * dyEnd <=
      RULER_ENDPOINT_HIT_THRESHOLD_PX * RULER_ENDPOINT_HIT_THRESHOLD_PX
    ) {
      return { rulerId: ruler.id, endpoint: "end" };
    }
  }

  return null;
}

/**
 * Find which ruler (if any) is at a screen point (line or box).
 */
function findRulerAtScreenPoint(
  screenX: number,
  screenY: number,
  rulers: Map<string, Ruler>,
  zoom: number,
  offset: { x: number; y: number },
): string | null {
  for (const ruler of rulers.values()) {
    const startScreenX = ruler.start.x * zoom + offset.x;
    const startScreenY = ruler.start.y * zoom + offset.y;
    const endScreenX = ruler.end.x * zoom + offset.x;
    const endScreenY = ruler.end.y * zoom + offset.y;

    // Check box first (higher priority)
    const midX = (startScreenX + endScreenX) / 2;
    const midY = (startScreenY + endScreenY) / 2;
    const halfWidth = RULER_BOX_WIDTH / 2;
    const halfHeight = RULER_BOX_HEIGHT / 2;

    if (
      screenX >= midX - halfWidth &&
      screenX <= midX + halfWidth &&
      screenY >= midY - halfHeight &&
      screenY <= midY + halfHeight
    ) {
      return ruler.id;
    }

    // Check line
    const distance = pointToSegmentDistance(
      screenX,
      screenY,
      startScreenX,
      startScreenY,
      endScreenX,
      endScreenY,
    );

    if (distance <= RULER_LINE_HIT_THRESHOLD_PX) {
      return ruler.id;
    }
  }

  return null;
}

/**
 * Check if a line segment intersects with a rectangle.
 */
function lineIntersectsRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rectMinX: number,
  rectMinY: number,
  rectMaxX: number,
  rectMaxY: number,
): boolean {
  // Check if either endpoint is inside the rect
  if (
    (x1 >= rectMinX && x1 <= rectMaxX && y1 >= rectMinY && y1 <= rectMaxY) ||
    (x2 >= rectMinX && x2 <= rectMaxX && y2 >= rectMinY && y2 <= rectMaxY)
  ) {
    return true;
  }

  // Check if line intersects any of the 4 rect edges
  const edges: [number, number, number, number][] = [
    [rectMinX, rectMinY, rectMaxX, rectMinY], // top
    [rectMaxX, rectMinY, rectMaxX, rectMaxY], // right
    [rectMinX, rectMaxY, rectMaxX, rectMaxY], // bottom
    [rectMinX, rectMinY, rectMinX, rectMaxY], // left
  ];

  for (const [ex1, ey1, ex2, ey2] of edges) {
    if (segmentsIntersect(x1, y1, x2, y2, ex1, ey1, ex2, ey2)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if two line segments intersect.
 */
function segmentsIntersect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
): boolean {
  const d1 = direction(x3, y3, x4, y4, x1, y1);
  const d2 = direction(x3, y3, x4, y4, x2, y2);
  const d3 = direction(x1, y1, x2, y2, x3, y3);
  const d4 = direction(x1, y1, x2, y2, x4, y4);

  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }

  if (d1 === 0 && onSegment(x3, y3, x4, y4, x1, y1)) return true;
  if (d2 === 0 && onSegment(x3, y3, x4, y4, x2, y2)) return true;
  if (d3 === 0 && onSegment(x1, y1, x2, y2, x3, y3)) return true;
  if (d4 === 0 && onSegment(x1, y1, x2, y2, x4, y4)) return true;

  return false;
}

function direction(xi: number, yi: number, xj: number, yj: number, xk: number, yk: number): number {
  return (xk - xi) * (yj - yi) - (xj - xi) * (yk - yi);
}

function onSegment(
  xi: number,
  yi: number,
  xj: number,
  yj: number,
  xk: number,
  yk: number,
): boolean {
  return (
    Math.min(xi, xj) <= xk &&
    xk <= Math.max(xi, xj) &&
    Math.min(yi, yj) <= yk &&
    yk <= Math.max(yi, yj)
  );
}

/**
 * Find all rulers that intersect with a screen rectangle.
 */
function findRulersInScreenRect(
  screenMinX: number,
  screenMinY: number,
  screenMaxX: number,
  screenMaxY: number,
  rulers: Map<string, Ruler>,
  zoom: number,
  offset: { x: number; y: number },
): string[] {
  const hitRulerIds: string[] = [];

  for (const ruler of rulers.values()) {
    const startScreenX = ruler.start.x * zoom + offset.x;
    const startScreenY = ruler.start.y * zoom + offset.y;
    const endScreenX = ruler.end.x * zoom + offset.x;
    const endScreenY = ruler.end.y * zoom + offset.y;

    // Check if ruler line intersects the marquee rect
    if (
      lineIntersectsRect(
        startScreenX,
        startScreenY,
        endScreenX,
        endScreenY,
        screenMinX,
        screenMinY,
        screenMaxX,
        screenMaxY,
      )
    ) {
      hitRulerIds.push(ruler.id);
      continue;
    }

    // Also check if measurement box intersects
    const midX = (startScreenX + endScreenX) / 2;
    const midY = (startScreenY + endScreenY) / 2;
    const boxMinX = midX - RULER_BOX_WIDTH / 2;
    const boxMaxX = midX + RULER_BOX_WIDTH / 2;
    const boxMinY = midY - RULER_BOX_HEIGHT / 2;
    const boxMaxY = midY + RULER_BOX_HEIGHT / 2;

    // Check if boxes overlap
    if (
      boxMinX <= screenMaxX &&
      boxMaxX >= screenMinX &&
      boxMinY <= screenMaxY &&
      boxMaxY >= screenMinY
    ) {
      hitRulerIds.push(ruler.id);
    }
  }

  return hitRulerIds;
}

/**
 * Hook for selection tool functionality.
 *
 * Handles mouse interactions for selecting shapes, including:
 * - Click to select
 * - Shift+click to add to selection
 * - Ctrl/Cmd+click to toggle selection
 * - Drag to marquee select (intersecting shapes)
 * - Shift+drag to add marquee selection
 * - Hover highlighting
 *
 * @param screenToWorld - Function to convert screen coordinates to world coordinates.
 * @param library - The WasmLibrary instance for hit testing.
 * @param renderer - The WasmRenderer instance for visual feedback.
 * @returns Event handlers and selection state.
 */
export function useSelection(
  screenToWorld: (screenX: number, screenY: number) => Point | null,
  library: WasmLibrary | null,
  renderer: WasmRenderer | null,
) {
  const { selectedIds, hoveredId, clearSelection, setHover } = useSelectionStore();
  const {
    box: marqueeBox,
    isDrawing: isDrawingMarquee,
    previewIds,
    startDrawing,
    updateBox,
    setPreviewIds,
    reset: resetMarquee,
  } = useMarqueeStore();
  const { zoom, offset } = useViewportStore();
  const rulers = useRulerStore((s) => s.rulers);
  const selectedRulerIds = useRulerStore((s) => s.selectedRulerIds);
  const selectRuler = useRulerStore((s) => s.selectRuler);
  const toggleRulerSelection = useRulerStore((s) => s.toggleSelection);
  const addRulerToSelection = useRulerStore((s) => s.addToSelection);
  const clearRulerSelection = useRulerStore((s) => s.clearSelection);
  const setHoveredRuler = useRulerStore((s) => s.setHoveredRuler);
  const setHoveredEndpoint = useRulerStore((s) => s.setHoveredEndpoint);
  const setDraggingEndpoint = useRulerStore((s) => s.setDraggingEndpoint);
  const endDraggingEndpoint = useRulerStore((s) => s.endDraggingEndpoint);
  const updateRulerEndpoint = useRulerStore((s) => s.updateEndpoint);
  const hoveredRulerId = useRulerStore((s) => s.hoveredRulerId);
  const hoveredEndpoint = useRulerStore((s) => s.hoveredEndpoint);
  const draggingEndpoint = useRulerStore((s) => s.draggingEndpoint);
  const setMarqueePreviewIds = useRulerStore((s) => s.setMarqueePreviewIds);
  const setSnapPoint = useRulerStore((s) => s.setSnapPoint);

  // Track the last preview IDs to avoid unnecessary updates
  const lastPreviewIdsRef = useRef<string>("");

  // Sync selection state to renderer
  useEffect(() => {
    if (!renderer) return;
    renderer.set_selection(Array.from(selectedIds));
  }, [renderer, selectedIds]);

  // Sync hover state to renderer (single hover when not drawing marquee)
  useEffect(() => {
    if (!renderer) return;

    if (isDrawingMarquee) {
      // During marquee drawing, use set_hover_multiple for preview
      renderer.set_hover_multiple(Array.from(previewIds));
    } else if (hoveredId && library) {
      // Normal hover - expand to instance group for visual highlight
      const groupIds = expandToGroup(library, hoveredId);
      renderer.set_hover_multiple(groupIds);
    } else {
      renderer.set_hover(hoveredId ?? undefined);
    }
  }, [renderer, library, hoveredId, isDrawingMarquee, previewIds]);

  /**
   * Handle mouse down - either select a shape/ruler, drag endpoint, or start marquee.
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left click

      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Check for ruler endpoint hit first (highest priority)
      const hitEndpoint = findRulerEndpointAtScreenPoint(screenX, screenY, rulers, zoom, offset);
      if (hitEndpoint) {
        // Start dragging the endpoint
        selectRuler(hitEndpoint.rulerId);
        setDraggingEndpoint(hitEndpoint);
        clearSelection();
        return;
      }

      // Check for ruler hit (line or box)
      const hitRulerId = findRulerAtScreenPoint(screenX, screenY, rulers, zoom, offset);
      if (hitRulerId) {
        // Clicked on a ruler - handle selection with modifier keys
        if (e.shiftKey) {
          // Shift+click: add to ruler selection
          addRulerToSelection([hitRulerId]);
        } else if (e.metaKey || e.ctrlKey) {
          // Ctrl/Cmd+click: toggle ruler selection
          toggleRulerSelection(hitRulerId);
        } else {
          // Plain click: select only this ruler
          selectRuler(hitRulerId);
        }
        clearSelection();
        return;
      }

      // Clear ruler selection when clicking elsewhere
      if (selectedRulerIds.size > 0) {
        clearRulerSelection();
      }

      const world = screenToWorld(screenX, screenY);
      if (!world || !library) return;

      const hitId = library.hit_test(world.x, world.y);

      if (hitId) {
        // Expand to instance group (all polygons from the same cell ref).
        // Use hitId as lastSelectedId so Tab cycling can locate it in the
        // group representative list.
        const groupIds = expandToGroup(library, hitId);

        // Clicked on an element - handle selection immediately
        if (e.shiftKey) {
          // Shift+click: add group to selection
          const current = useSelectionStore.getState().selectedIds;
          const newSelection = new Set([...current, ...groupIds]);
          useSelectionStore.setState({ selectedIds: newSelection, lastSelectedId: hitId });
        } else if (e.metaKey || e.ctrlKey) {
          // Ctrl/Cmd+click: toggle group selection
          const current = useSelectionStore.getState().selectedIds;
          const allInSelection = groupIds.every((id) => current.has(id));
          const newSelection = new Set(current);
          if (allInSelection) {
            for (const id of groupIds) newSelection.delete(id);
          } else {
            for (const id of groupIds) newSelection.add(id);
          }
          useSelectionStore.setState({ selectedIds: newSelection, lastSelectedId: hitId });
        } else {
          // Plain click: select only this group
          useSelectionStore.setState({ selectedIds: new Set(groupIds), lastSelectedId: hitId });
        }
      } else {
        // Clicked empty space - start marquee drawing
        startDrawing(screenX, screenY);

        // Clear selection on plain click in empty space (will be replaced by marquee result)
        if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
          clearSelection();
        }
      }
    },
    [
      screenToWorld,
      library,
      rulers,
      zoom,
      offset,
      selectedRulerIds,
      clearSelection,
      selectRuler,
      toggleRulerSelection,
      addRulerToSelection,
      clearRulerSelection,
      setDraggingEndpoint,
      startDrawing,
    ],
  );

  /**
   * Handle mouse move - update hover state, drag endpoint, or marquee box.
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Handle endpoint dragging with geometry snapping
      // Shift key disables geometry snapping
      if (draggingEndpoint) {
        const world = screenToWorld(screenX, screenY);
        if (world) {
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
          updateRulerEndpoint(
            draggingEndpoint.rulerId,
            draggingEndpoint.endpoint,
            snapResult.point,
          );
          // Update snap indicator for visual feedback
          setSnapPoint(snapResult.isGeometrySnap ? snapResult.point : null);
        }
        return;
      }

      // Update marquee box if drawing
      if (isDrawingMarquee) {
        updateBox(screenX, screenY);

        // Query elements under the marquee for preview highlighting
        const currentBox = useMarqueeStore.getState().box;
        if (currentBox) {
          // Get screen bounds of marquee
          const screenMinX = Math.min(currentBox.x, currentBox.x + currentBox.width);
          const screenMaxX = Math.max(currentBox.x, currentBox.x + currentBox.width);
          const screenMinY = Math.min(currentBox.y, currentBox.y + currentBox.height);
          const screenMaxY = Math.max(currentBox.y, currentBox.y + currentBox.height);

          // Check rulers in marquee for preview
          const hitRulerIds = findRulersInScreenRect(
            screenMinX,
            screenMinY,
            screenMaxX,
            screenMaxY,
            rulers,
            zoom,
            offset,
          );
          setMarqueePreviewIds(hitRulerIds);

          // Check shapes in marquee for preview
          if (library) {
            const worldX1 = (screenMinX - offset.x) / zoom;
            const worldX2 = (screenMaxX - offset.x) / zoom;
            const worldY1 = (screenMinY - offset.y) / zoom;
            const worldY2 = (screenMaxY - offset.y) / zoom;

            const worldMinX = Math.min(worldX1, worldX2);
            const worldMaxX = Math.max(worldX1, worldX2);
            const worldMinY = Math.min(worldY1, worldY2);
            const worldMaxY = Math.max(worldY1, worldY2);

            const rawHitIds = library.hit_test_rect(worldMinX, worldMinY, worldMaxX, worldMaxY);
            const hitIds = expandAllToGroups(library, rawHitIds);

            // Only update if the set of IDs changed (avoid unnecessary re-renders)
            const hitIdsKey = hitIds.sort().join(",");
            if (hitIdsKey !== lastPreviewIdsRef.current) {
              lastPreviewIdsRef.current = hitIdsKey;
              setPreviewIds(hitIds);
            }
          }
        }
        return;
      }

      // Check for ruler endpoint hover first (highest priority)
      const hitEndpoint = findRulerEndpointAtScreenPoint(screenX, screenY, rulers, zoom, offset);
      let hitRulerId: string | null = null;

      if (hitEndpoint) {
        if (
          hoveredEndpoint?.rulerId !== hitEndpoint.rulerId ||
          hoveredEndpoint?.endpoint !== hitEndpoint.endpoint
        ) {
          setHoveredEndpoint(hitEndpoint);
        }
        if (hoveredRulerId !== hitEndpoint.rulerId) {
          setHoveredRuler(hitEndpoint.rulerId);
        }
        hitRulerId = hitEndpoint.rulerId;
      } else {
        // Clear endpoint hover if not near any endpoint
        if (hoveredEndpoint) {
          setHoveredEndpoint(null);
        }

        // Check for ruler hover (line or box)
        hitRulerId = findRulerAtScreenPoint(screenX, screenY, rulers, zoom, offset);
        if (hitRulerId !== hoveredRulerId) {
          setHoveredRuler(hitRulerId);
        }
      }

      // Update shape hover state when not drawing marquee
      const world = screenToWorld(screenX, screenY);
      if (!world || !library) {
        if (hoveredId !== null) {
          setHover(null);
        }
        return;
      }

      // Only update shape hover if not hovering a ruler
      if (!hitRulerId) {
        const hitId = library.hit_test(world.x, world.y);
        if (hitId !== hoveredId) {
          setHover(hitId ?? null);
        }
      } else if (hoveredId !== null) {
        // Clear shape hover when hovering ruler
        setHover(null);
      }
    },
    [
      screenToWorld,
      library,
      rulers,
      hoveredId,
      hoveredRulerId,
      hoveredEndpoint,
      draggingEndpoint,
      setHover,
      setHoveredRuler,
      setHoveredEndpoint,
      updateRulerEndpoint,
      setMarqueePreviewIds,
      isDrawingMarquee,
      updateBox,
      zoom,
      offset,
      setPreviewIds,
      setSnapPoint,
    ],
  );

  /**
   * Handle mouse up - finalize endpoint drag or marquee selection.
   */
  const handleMouseUp = useCallback(() => {
    // Stop endpoint dragging if active
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
      return;
    }

    if (!isDrawingMarquee || !marqueeBox) {
      resetMarquee();
      setMarqueePreviewIds([]);
      return;
    }

    // Check if marquee is large enough to trigger selection
    const width = Math.abs(marqueeBox.width);
    const height = Math.abs(marqueeBox.height);

    if (width > MIN_MARQUEE_SIZE || height > MIN_MARQUEE_SIZE) {
      // Get screen bounds of marquee
      const screenMinX = Math.min(marqueeBox.x, marqueeBox.x + marqueeBox.width);
      const screenMaxX = Math.max(marqueeBox.x, marqueeBox.x + marqueeBox.width);
      const screenMinY = Math.min(marqueeBox.y, marqueeBox.y + marqueeBox.height);
      const screenMaxY = Math.max(marqueeBox.y, marqueeBox.y + marqueeBox.height);

      // Check for rulers in marquee
      const hitRulerIds = findRulersInScreenRect(
        screenMinX,
        screenMinY,
        screenMaxX,
        screenMaxY,
        rulers,
        zoom,
        offset,
      );

      // Convert screen box to world coordinates for shape selection
      const worldX1 = (screenMinX - offset.x) / zoom;
      const worldX2 = (screenMaxX - offset.x) / zoom;
      const worldY1 = (screenMinY - offset.y) / zoom;
      const worldY2 = (screenMaxY - offset.y) / zoom;

      // Ensure min/max are correct (handles Y-axis inversion if present)
      const worldMinX = Math.min(worldX1, worldX2);
      const worldMaxX = Math.max(worldX1, worldX2);
      const worldMinY = Math.min(worldY1, worldY2);
      const worldMaxY = Math.max(worldY1, worldY2);

      // Query library for intersecting elements, expanding to instance groups
      const rawHitIds = library
        ? library.hit_test_rect(worldMinX, worldMinY, worldMaxX, worldMaxY)
        : [];
      const hitIds = library ? expandAllToGroups(library, rawHitIds) : rawHitIds;

      // Add rulers to selection
      if (hitRulerIds.length > 0) {
        addRulerToSelection(hitRulerIds);
      }

      // Add all hit shapes to selection in a single batch operation
      // (selection was already cleared on mouseDown for plain drag,
      // or preserved for shift+drag)
      if (hitIds.length > 0) {
        const currentSelection = useSelectionStore.getState().selectedIds;
        const newSelection = new Set([...currentSelection, ...hitIds]);
        useSelectionStore.getState().setSelection(newSelection);
      }
    }

    resetMarquee();
    setMarqueePreviewIds([]);
  }, [
    isDrawingMarquee,
    marqueeBox,
    library,
    renderer,
    rulers,
    zoom,
    offset,
    draggingEndpoint,
    addRulerToSelection,
    endDraggingEndpoint,
    resetMarquee,
    setMarqueePreviewIds,
    setSnapPoint,
  ]);

  /**
   * Handle mouse leave - clear hover and cancel marquee.
   */
  const handleMouseLeave = useCallback(() => {
    if (hoveredId !== null) {
      setHover(null);
    }
    if (hoveredRulerId !== null) {
      setHoveredRuler(null);
    }
    if (hoveredEndpoint !== null) {
      setHoveredEndpoint(null);
    }
    if (draggingEndpoint !== null) {
      setDraggingEndpoint(null);
    }
    resetMarquee();
    setMarqueePreviewIds([]);
  }, [
    hoveredId,
    hoveredRulerId,
    hoveredEndpoint,
    draggingEndpoint,
    setHover,
    setHoveredRuler,
    setHoveredEndpoint,
    setDraggingEndpoint,
    resetMarquee,
    setMarqueePreviewIds,
  ]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    selectedIds,
    hoveredId,
    hoveredRulerId,
    hoveredEndpoint,
    marqueeBox,
    isDrawingMarquee,
    previewIds,
  };
}
