import { useState, useCallback, useEffect } from "react";
import { useLayerStore } from "@/stores/layer";
import { GRID_SIZE } from "@/stores/viewport";
import { useHistoryStore } from "@/stores/history";
import { useToolStore } from "@/stores/tool";
import { usePathStore } from "@/stores/path";
import { CreatePathCommand } from "@/lib/commands";
import { constrainToManhattan } from "@/lib/path";
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
 */
function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

/** Screen pixel threshold for alignment snapping. */
const ALIGNMENT_THRESHOLD_PX = 6;

/**
 * Alignment guide information for rendering.
 */
export interface PathAlignmentGuides {
  /** Vertex the cursor is horizontally aligned with (same X). */
  alignedVertexX: Point | null;
  /** Vertex the cursor is vertically aligned with (same Y). */
  alignedVertexY: Point | null;
}

/**
 * Check if cursor aligns horizontally or vertically with any existing waypoint.
 */
function checkWaypointAlignment(
  currentPoint: Point,
  waypoints: Point[],
  zoom: number,
): { point: Point; guides: PathAlignmentGuides } {
  const thresholdWorld = ALIGNMENT_THRESHOLD_PX / zoom;
  let alignedX: Point | null = null;
  let alignedY: Point | null = null;
  let snappedX = currentPoint.x;
  let snappedY = currentPoint.y;

  for (const vertex of waypoints) {
    if (alignedX === null && Math.abs(currentPoint.x - vertex.x) <= thresholdWorld) {
      snappedX = vertex.x;
      alignedX = vertex;
    }
    if (alignedY === null && Math.abs(currentPoint.y - vertex.y) <= thresholdWorld) {
      snappedY = vertex.y;
      alignedY = vertex;
    }
    if (alignedX !== null && alignedY !== null) break;
  }

  return {
    point: { x: snappedX, y: snappedY },
    guides: { alignedVertexX: alignedX, alignedVertexY: alignedY },
  };
}

/**
 * Hook for path/waveguide drawing tool.
 *
 * Handles mouse interactions for drawing waveguide paths with:
 * - Grid snapping
 * - Manhattan (H/V) constraint
 * - Waypoint alignment guides
 * - Double-click to finish
 *
 * On finalization, sends waypoints to the Rust Route engine which generates
 * proper waveguide geometry with circular arc bends.
 *
 * @param screenToWorld - Function to convert screen to world coordinates.
 * @param library - The WasmLibrary instance.
 * @param renderer - The WasmRenderer instance.
 * @param zoom - Current zoom level.
 */
export function usePath(
  screenToWorld: (screenX: number, screenY: number) => { x: number; y: number } | null,
  library: WasmLibrary | null,
  renderer: WasmRenderer | null,
  zoom: number,
) {
  const [waypoints, setWaypoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cursorPoint, setCursorPoint] = useState<Point | null>(null);
  const [alignmentGuides, setAlignmentGuides] = useState<PathAlignmentGuides | null>(null);

  const activeLayerId = useLayerStore((s) => s.activeLayerId);
  const layers = useLayerStore((s) => s.layers);
  const activeTool = useToolStore((s) => s.activeTool);

  // Reset state when tool changes away from path
  useEffect(() => {
    if (activeTool !== "path") {
      setWaypoints([]);
      setIsDrawing(false);
      setCursorPoint(null);
      setAlignmentGuides(null);
    }
  }, [activeTool]);

  /**
   * Finalize the path and create a route via the Rust Route engine.
   */
  const finalizePath = useCallback(
    (pathWaypoints: Point[]) => {
      if (!library || !renderer || pathWaypoints.length < 2) return;

      // Get path parameters from the store
      const { width, cornerRadius, numArcPoints } = usePathStore.getState();

      // Convert points to flat Float64Array [x0, y0, x1, y1, ...]
      const flatPoints = new Float64Array(pathWaypoints.length * 2);
      for (let i = 0; i < pathWaypoints.length; i++) {
        flatPoints[i * 2] = pathWaypoints[i].x;
        flatPoints[i * 2 + 1] = pathWaypoints[i].y;
      }

      // Get the active layer's GDS layer number and datatype
      const activeLayer = layers.get(activeLayerId);
      const layerNumber = activeLayer?.layerNumber ?? 1;
      const datatype = activeLayer?.datatype ?? 0;

      // Create and execute command through history system.
      // Pass waypoints so the command manages path metadata for undo/redo.
      const command = new CreatePathCommand(
        flatPoints,
        width,
        layerNumber,
        datatype,
        [...pathWaypoints],
        cornerRadius,
        numArcPoints,
      );
      useHistoryStore.getState().execute(command, { library, renderer });

      // Reset drawing state but stay in path tool
      setWaypoints([]);
      setIsDrawing(false);
      setCursorPoint(null);
      setAlignmentGuides(null);
    },
    [library, renderer, activeLayerId, layers],
  );

  /**
   * Handle mouse down - add waypoint or finish path on double-click.
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;

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

      // Apply alignment and Manhattan constraint (unless Shift held)
      if (waypoints.length > 0 && !e.shiftKey) {
        const alignment = checkWaypointAlignment(snappedPoint, waypoints, zoom);
        snappedPoint = alignment.point;
        snappedPoint = constrainToManhattan(waypoints[waypoints.length - 1], snappedPoint);
      }

      // Double-click to finish path (need 2+ waypoints total, including this click)
      if (e.detail >= 2 && waypoints.length >= 2) {
        finalizePath(waypoints);
        return;
      }

      // Skip duplicate consecutive points
      const lastPoint = waypoints[waypoints.length - 1];
      if (lastPoint && snappedPoint.x === lastPoint.x && snappedPoint.y === lastPoint.y) {
        return;
      }

      // Add new waypoint
      const newWaypoints = [...waypoints, snappedPoint];
      setWaypoints(newWaypoints);
      setIsDrawing(true);
    },
    [screenToWorld, waypoints, zoom, finalizePath],
  );

  /**
   * Handle mouse move - update cursor position and alignment guides.
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

      // Check alignment and apply Manhattan constraint (unless Shift held)
      let guides: PathAlignmentGuides | null = null;
      if (waypoints.length > 0 && !e.shiftKey) {
        const alignment = checkWaypointAlignment(snappedPoint, waypoints, zoom);
        snappedPoint = alignment.point;
        guides = alignment.guides;

        // Apply Manhattan constraint from previous waypoint (after alignment)
        snappedPoint = constrainToManhattan(waypoints[waypoints.length - 1], snappedPoint);
      }

      setCursorPoint(snappedPoint);
      setAlignmentGuides(guides);
    },
    [screenToWorld, waypoints, zoom],
  );

  /**
   * Handle Enter key to finalize path.
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && waypoints.length >= 2) {
        e.preventDefault();
        finalizePath(waypoints);
      }
    },
    [waypoints, finalizePath],
  );

  // Register Enter key handler when drawing
  useEffect(() => {
    if (isDrawing) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isDrawing, handleKeyDown]);

  /**
   * Cancel drawing and reset state.
   */
  const cancelDrawing = useCallback(() => {
    setWaypoints([]);
    setIsDrawing(false);
    setCursorPoint(null);
    setAlignmentGuides(null);
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    cancelDrawing,
    isDrawing,
    /** Waypoints placed so far (for overlay rendering). */
    waypoints,
    /** Current cursor position in world coordinates (for overlay rendering). */
    cursorPoint,
    /** Alignment guide info for rendering guide lines. */
    alignmentGuides,
  };
}
