import { useState, useCallback } from "react";
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

/**
 * Hook for rectangle drawing tool.
 *
 * Handles mouse interactions for drawing rectangles with grid snapping.
 * Uses WasmLibrary for shape storage and WasmRenderer for preview.
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
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const activeLayerId = useLayerStore((s) => s.activeLayerId);
  const layers = useLayerStore((s) => s.layers);

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

      setStartPoint({ x: worldX, y: worldY });
      setIsDrawing(true);
    },
    [screenToWorld],
  );

  /**
   * Handle mouse move - update preview.
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !startPoint || !renderer) return;

      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const world = screenToWorld(screenX, screenY);
      if (!world) return;

      const worldX = snapToGrid(world.x);
      const worldY = snapToGrid(world.y);

      // Calculate rectangle bounds
      const minX = Math.min(startPoint.x, worldX);
      const minY = Math.min(startPoint.y, worldY);
      const maxX = Math.max(startPoint.x, worldX);
      const maxY = Math.max(startPoint.y, worldY);

      // Create rectangle points (counter-clockwise)
      const points = new Float64Array([minX, minY, maxX, minY, maxX, maxY, minX, maxY]);

      // Get layer color for preview
      const layer = layers.get(activeLayerId);
      const [r, g, b] = layer ? hexToRgba(layer.color, 0.5) : [0.5, 0.5, 0.5, 0.5];
      const color = new Float32Array([r, g, b, 0.5]);

      renderer.set_preview_shape(points, color);
      renderer.mark_dirty();
    },
    [isDrawing, startPoint, screenToWorld, renderer, layers, activeLayerId],
  );

  /**
   * Handle mouse up - finalize shape.
   */
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !startPoint || !library || !renderer) {
      setIsDrawing(false);
      setStartPoint(null);
      renderer?.clear_preview();
      return;
    }

    // Get current mouse position from the last preview
    // We need to recalculate the bounds
    // For now, we use the preview shape if available

    // Clear preview first
    renderer.clear_preview();

    // The preview was set in handleMouseMove, so we need the last known position
    // Since we don't store currentPoint, we'll skip creating shape if no movement
    // This is a simplification - in practice we should track currentPoint

    // Reset state
    setIsDrawing(false);
    setStartPoint(null);
  }, [isDrawing, startPoint, library, renderer]);

  /**
   * Finalize rectangle with specific end point.
   * Called from Canvas when we know the end position.
   */
  const finalizeRectangle = useCallback(
    (endX: number, endY: number) => {
      if (!startPoint || !library || !renderer) return;

      const worldX = snapToGrid(endX);
      const worldY = snapToGrid(endY);

      // Calculate rectangle bounds
      const minX = Math.min(startPoint.x, worldX);
      const minY = Math.min(startPoint.y, worldY);
      const width = Math.abs(worldX - startPoint.x);
      const height = Math.abs(worldY - startPoint.y);

      // Only create if non-zero area
      if (width > 0 && height > 0) {
        // Get the active layer's GDS layer number and datatype
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
      setIsDrawing(false);
      setStartPoint(null);
    },
    [startPoint, library, renderer, activeLayerId, layers],
  );

  /**
   * Cancel drawing (e.g., on mouse leave).
   */
  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    renderer?.clear_preview();
  }, [renderer]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    finalizeRectangle,
    cancelDrawing,
    isDrawing,
  };
}
