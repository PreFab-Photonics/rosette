import { useState, useCallback, useEffect } from "react";
import { useLayerStore } from "@/stores/layer";
import { GRID_SIZE } from "@/stores/viewport";
import { useHistoryStore } from "@/stores/history";
import { useToolStore } from "@/stores/tool";
import { CreatePolygonCommand } from "@/lib/commands";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";

/**
 * A point in world coordinates.
 */
interface Point {
  x: number;
  y: number;
}

/**
 * Snap a world coordinate to the nearest grid point.
 * Grid spacing is GRID_SIZE world units.
 *
 * @param value - World coordinate.
 * @returns Snapped coordinate.
 */
function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

/**
 * Check if two points are within a threshold distance in screen space.
 *
 * @param p1 - First point in world coordinates.
 * @param p2 - Second point in world coordinates.
 * @param zoom - Current zoom level.
 * @param thresholdPx - Threshold in screen pixels.
 * @returns True if points are within threshold.
 */
function isNearInScreenSpace(p1: Point, p2: Point, zoom: number, thresholdPx: number): boolean {
  const dx = (p1.x - p2.x) * zoom;
  const dy = (p1.y - p2.y) * zoom;
  const distancePx = Math.sqrt(dx * dx + dy * dy);
  return distancePx <= thresholdPx;
}

/** Screen pixel threshold for closing polygon by clicking near start. */
const CLOSE_THRESHOLD_PX = 10;

/** Angle threshold (in degrees) for Manhattan snapping. Snap if within this angle of H/V axis. */
const MANHATTAN_SNAP_ANGLE_DEG = 8;

/** Screen pixel threshold for point alignment snapping. */
const ALIGNMENT_THRESHOLD_PX = 6;

/**
 * Alignment guide information for rendering.
 */
export interface AlignmentGuides {
  /** Vertex the cursor is horizontally aligned with (same X). */
  alignedVertexX: Point | null;
  /** Vertex the cursor is vertically aligned with (same Y). */
  alignedVertexY: Point | null;
}

/**
 * Check if cursor aligns horizontally or vertically with any existing polygon vertex.
 * Returns the snapped point and info about which vertices it aligns with.
 *
 * @param currentPoint - The current cursor point (after grid snap).
 * @param polygonPoints - Existing vertices in the polygon.
 * @param zoom - Current zoom level for screen-space threshold.
 * @returns Object with snapped point and alignment info.
 */
function checkPointAlignment(
  currentPoint: Point,
  polygonPoints: Point[],
  zoom: number,
): { point: Point; guides: AlignmentGuides } {
  const thresholdWorld = ALIGNMENT_THRESHOLD_PX / zoom;
  let alignedX: Point | null = null;
  let alignedY: Point | null = null;
  let snappedX = currentPoint.x;
  let snappedY = currentPoint.y;

  // Check alignment with each existing vertex
  for (const vertex of polygonPoints) {
    // Check X alignment (vertical guide)
    if (alignedX === null && Math.abs(currentPoint.x - vertex.x) <= thresholdWorld) {
      snappedX = vertex.x;
      alignedX = vertex;
    }

    // Check Y alignment (horizontal guide)
    if (alignedY === null && Math.abs(currentPoint.y - vertex.y) <= thresholdWorld) {
      snappedY = vertex.y;
      alignedY = vertex;
    }

    // Stop early if both alignments found
    if (alignedX !== null && alignedY !== null) break;
  }

  return {
    point: { x: snappedX, y: snappedY },
    guides: { alignedVertexX: alignedX, alignedVertexY: alignedY },
  };
}

/**
 * Constrain a point to Manhattan (horizontal or vertical) movement from a reference point.
 * Only snaps if the angle is within MANHATTAN_SNAP_ANGLE_DEG of an axis; otherwise returns
 * the original point for free-form diagonal movement.
 *
 * @param lastPoint - The reference point to constrain from.
 * @param currentPoint - The point to constrain.
 * @returns Point constrained to H/V if near an axis, otherwise the original point.
 */
function constrainToManhattan(lastPoint: Point, currentPoint: Point): Point {
  const dx = currentPoint.x - lastPoint.x;
  const dy = currentPoint.y - lastPoint.y;

  // Handle zero-length case
  if (dx === 0 && dy === 0) {
    return currentPoint;
  }

  // Calculate angle from horizontal (0 = horizontal, 90 = vertical)
  const angleFromHorizontal = Math.abs(Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI));

  // Check if close to horizontal (angle near 0)
  if (angleFromHorizontal <= MANHATTAN_SNAP_ANGLE_DEG) {
    return { x: currentPoint.x, y: lastPoint.y }; // Snap to horizontal
  }

  // Check if close to vertical (angle near 90)
  if (angleFromHorizontal >= 90 - MANHATTAN_SNAP_ANGLE_DEG) {
    return { x: lastPoint.x, y: currentPoint.y }; // Snap to vertical
  }

  // Diagonal - no snapping
  return currentPoint;
}

/**
 * Hook for polygon drawing tool.
 *
 * Handles mouse interactions for drawing polygons with grid snapping.
 * Uses WasmLibrary for shape storage and WasmRenderer for preview.
 *
 * @param screenToWorld - Function to convert screen coordinates to world coordinates.
 * @param library - The WasmLibrary instance for storing shapes.
 * @param renderer - The WasmRenderer instance for preview rendering.
 * @param zoom - Current zoom level for near-start detection.
 * @returns Event handlers and state.
 */
export function usePolygon(
  screenToWorld: (screenX: number, screenY: number) => { x: number; y: number } | null,
  library: WasmLibrary | null,
  renderer: WasmRenderer | null,
  zoom: number,
) {
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cursorPoint, setCursorPoint] = useState<Point | null>(null);
  const [isNearStart, setIsNearStart] = useState(false);
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuides | null>(null);

  const activeLayerId = useLayerStore((s) => s.activeLayerId);
  const layers = useLayerStore((s) => s.layers);
  const activeTool = useToolStore((s) => s.activeTool);

  // Reset state when tool changes away from polygon
  useEffect(() => {
    if (activeTool !== "polygon") {
      setPoints([]);
      setIsDrawing(false);
      setCursorPoint(null);
      setIsNearStart(false);
      setAlignmentGuides(null);
    }
  }, [activeTool]);

  /**
   * Finalize the polygon and add it to the library.
   */
  const finalizePolygon = useCallback(
    (polygonPoints: Point[]) => {
      if (!library || !renderer || polygonPoints.length < 3) return;

      // Convert points to flat Float64Array [x0, y0, x1, y1, ...]
      const flatPoints = new Float64Array(polygonPoints.length * 2);
      for (let i = 0; i < polygonPoints.length; i++) {
        flatPoints[i * 2] = polygonPoints[i].x;
        flatPoints[i * 2 + 1] = polygonPoints[i].y;
      }

      // Get the active layer's GDS layer number and datatype
      const activeLayer = layers.get(activeLayerId);
      const layerNumber = activeLayer?.layerNumber ?? 1;
      const datatype = activeLayer?.datatype ?? 0;

      // Create and execute command through history system
      const command = new CreatePolygonCommand(flatPoints, layerNumber, datatype);
      useHistoryStore.getState().execute(command, { library, renderer });

      // Reset state but stay in polygon tool
      setPoints([]);
      setIsDrawing(false);
      setCursorPoint(null);
      setIsNearStart(false);
    },
    [library, renderer, activeLayerId, layers],
  );

  /**
   * Handle mouse down - add vertex or complete polygon.
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left click

      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const world = screenToWorld(screenX, screenY);
      if (!world) return;

      // Snap to grid
      let snappedPoint: Point = {
        x: snapToGrid(world.x),
        y: snapToGrid(world.y),
      };

      // Check point alignment and apply Manhattan constraint (unless Shift held)
      if (points.length > 0 && !e.shiftKey) {
        const alignment = checkPointAlignment(snappedPoint, points, zoom);
        snappedPoint = alignment.point;
        snappedPoint = constrainToManhattan(points[points.length - 1], snappedPoint);
      }

      // Check if clicking near start point to close polygon (need 3+ points)
      if (points.length >= 3) {
        const startPoint = points[0];
        if (isNearInScreenSpace(startPoint, snappedPoint, zoom, CLOSE_THRESHOLD_PX)) {
          // Close the polygon
          finalizePolygon(points);
          return;
        }
      }

      // Skip duplicate consecutive points
      const lastPoint = points[points.length - 1];
      if (lastPoint && snappedPoint.x === lastPoint.x && snappedPoint.y === lastPoint.y) {
        return;
      }

      // Add new point
      const newPoints = [...points, snappedPoint];
      setPoints(newPoints);
      setIsDrawing(true);
    },
    [screenToWorld, points, zoom, finalizePolygon],
  );

  /**
   * Handle mouse move - update cursor position and snap detection.
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const world = screenToWorld(screenX, screenY);
      if (!world) return;

      let snappedPoint: Point = {
        x: snapToGrid(world.x),
        y: snapToGrid(world.y),
      };

      // Check point alignment with existing vertices (unless Shift held)
      let guides: AlignmentGuides | null = null;
      if (points.length > 0 && !e.shiftKey) {
        const alignment = checkPointAlignment(snappedPoint, points, zoom);
        snappedPoint = alignment.point;
        guides = alignment.guides;

        // Apply Manhattan constraint from previous point (after alignment)
        snappedPoint = constrainToManhattan(points[points.length - 1], snappedPoint);
      }

      // Check if near start point for closing the polygon (need 3+ points)
      const nearStart =
        points.length >= 3 &&
        isNearInScreenSpace(points[0], snappedPoint, zoom, CLOSE_THRESHOLD_PX);

      // Snap to start point if near it
      if (nearStart) {
        snappedPoint = { ...points[0] };
        guides = null; // Don't show alignment guides when snapping to start
      }

      setIsNearStart(nearStart);
      setCursorPoint(snappedPoint);
      setAlignmentGuides(guides);
    },
    [screenToWorld, points, zoom],
  );

  /**
   * Cancel drawing and reset state.
   */
  const cancelDrawing = useCallback(() => {
    setPoints([]);
    setIsDrawing(false);
    setCursorPoint(null);
    setIsNearStart(false);
    setAlignmentGuides(null);
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    cancelDrawing,
    isDrawing,
    /** Points placed so far (for overlay rendering). */
    points,
    /** Current cursor position in world coordinates (for overlay rendering). */
    cursorPoint,
    /** Whether cursor is near the start point (for close indicator). */
    isNearStart,
    /** Alignment guide info for rendering guide lines. */
    alignmentGuides,
  };
}
