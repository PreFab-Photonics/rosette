import { useCallback, useRef } from "react";
import { useLayerStore, hexToRgba } from "@/stores/layer";
import { GRID_SIZE } from "@/stores/viewport";
import { useHistoryStore } from "@/stores/history";
import { CreateRectangleCommand } from "@/lib/commands";
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

// Pre-allocated typed arrays to avoid GC pressure during drawing.
// These are reused on every mouse move — safe because wasm-bindgen copies
// the data into the WASM heap synchronously in set_preview_shape().
const _previewPoints = new Float64Array(8);
const _previewColor = new Float32Array(4);

/**
 * Hook for rectangle drawing tool.
 *
 * Handles mouse interactions for drawing rectangles with grid snapping.
 * Uses WasmLibrary for shape storage and WasmRenderer for preview.
 *
 * Performance: uses refs instead of state for drawing state to avoid
 * React re-renders (and callback recreation) during active drawing.
 * Typed arrays are pre-allocated at module level to eliminate GC pressure.
 *
 * @param screenToWorld - Function to convert screen coordinates to world coordinates.
 * @param library - The WasmLibrary instance for storing shapes.
 * @param renderer - The WasmRenderer instance for preview rendering.
 * @returns Event handlers and state.
 */
export function useRectangle(
  screenToWorld: (screenX: number, screenY: number) => { x: number; y: number } | null,
  library: WasmLibrary | null,
  renderer: WasmRenderer | null,
) {
  // Use refs for drawing state to avoid React re-renders during active drawing.
  // State changes would cause Canvas to recreate its handleMouseMove callback,
  // adding unnecessary overhead on every draw start/stop.
  const startPointRef = useRef<Point | null>(null);
  const isDrawingRef = useRef(false);

  // Cached layer color (RGBA), computed once on mouse-down instead of every mouse-move.
  const cachedColorRef = useRef<[number, number, number, number]>([0.5, 0.5, 0.5, 0.5]);

  /**
   * Handle mouse down - start drawing.
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

      // Snap to grid for precision
      const worldX = snapToGrid(world.x);
      const worldY = snapToGrid(world.y);

      startPointRef.current = { x: worldX, y: worldY };
      isDrawingRef.current = true;

      // Cache the active layer color for the duration of this draw.
      // Avoids Map lookup + hexToRgba parse on every mouse move.
      const activeLayerId = useLayerStore.getState().activeLayerId;
      const layers = useLayerStore.getState().layers;
      const layer = layers.get(activeLayerId);
      if (layer) {
        const [r, g, b] = hexToRgba(layer.color, 0.5);
        cachedColorRef.current = [r, g, b, 0.5];
      } else {
        cachedColorRef.current = [0.5, 0.5, 0.5, 0.5];
      }
    },
    [screenToWorld],
  );

  /**
   * Handle mouse move - update preview.
   *
   * Accepts pre-computed screen coordinates from Canvas to avoid
   * duplicate getBoundingClientRect() calls.
   *
   * @returns true if the preview was updated (caller should render eagerly).
   */
  const handleMouseMove = useCallback(
    (screenX: number, screenY: number): boolean => {
      const start = startPointRef.current;
      if (!isDrawingRef.current || !start || !renderer) return false;

      const world = screenToWorld(screenX, screenY);
      if (!world) return false;

      const worldX = snapToGrid(world.x);
      const worldY = snapToGrid(world.y);

      // Calculate rectangle bounds
      const minX = Math.min(start.x, worldX);
      const minY = Math.min(start.y, worldY);
      const maxX = Math.max(start.x, worldX);
      const maxY = Math.max(start.y, worldY);

      // Write into pre-allocated buffer (counter-clockwise)
      _previewPoints[0] = minX;
      _previewPoints[1] = minY;
      _previewPoints[2] = maxX;
      _previewPoints[3] = minY;
      _previewPoints[4] = maxX;
      _previewPoints[5] = maxY;
      _previewPoints[6] = minX;
      _previewPoints[7] = maxY;

      // Write cached color into pre-allocated buffer
      const c = cachedColorRef.current;
      _previewColor[0] = c[0];
      _previewColor[1] = c[1];
      _previewColor[2] = c[2];
      _previewColor[3] = c[3];

      renderer.set_preview_shape(_previewPoints, _previewColor);
      renderer.mark_dirty();
      return true;
    },
    [screenToWorld, renderer],
  );

  /**
   * Finalize rectangle with specific end point.
   * Called from Canvas when we know the end position.
   */
  const finalizeRectangle = useCallback(
    (endX: number, endY: number) => {
      const start = startPointRef.current;
      if (!start || !library || !renderer) return;

      const worldX = snapToGrid(endX);
      const worldY = snapToGrid(endY);

      // Calculate rectangle bounds
      const minX = Math.min(start.x, worldX);
      const minY = Math.min(start.y, worldY);
      const width = Math.abs(worldX - start.x);
      const height = Math.abs(worldY - start.y);

      // Only create if non-zero area
      if (width > 0 && height > 0) {
        // Get the active layer's GDS layer number and datatype
        const activeLayerId = useLayerStore.getState().activeLayerId;
        const layers = useLayerStore.getState().layers;
        const activeLayer = layers.get(activeLayerId);
        const layerNumber = activeLayer?.layerNumber ?? 1;
        const datatype = activeLayer?.datatype ?? 0;

        // Create and execute command through history system
        const command = new CreateRectangleCommand(
          minX,
          minY,
          width,
          height,
          layerNumber,
          datatype,
        );
        useHistoryStore.getState().execute(command, { library, renderer });
      }

      // Clear preview
      renderer.clear_preview();

      // Reset state
      isDrawingRef.current = false;
      startPointRef.current = null;
    },
    [library, renderer],
  );

  /**
   * Cancel drawing (e.g., on mouse leave).
   */
  const cancelDrawing = useCallback(() => {
    isDrawingRef.current = false;
    startPointRef.current = null;
    renderer?.clear_preview();
  }, [renderer]);

  return {
    handleMouseDown,
    handleMouseMove,
    finalizeRectangle,
    cancelDrawing,
  };
}
