import { useCallback, useEffect } from "react";
import { useZoomStore } from "@/stores/zoom";
import { useToolStore } from "@/stores/tool";
import { useViewportStore } from "@/stores/viewport";

/**
 * Hook to manage zoom tool marquee interactions.
 *
 * Handles:
 * - Mouse events when zoom tool is active
 * - Drawing the marquee selection box
 * - Converting screen bounds to world coordinates
 * - Triggering zoomToBounds on mouse up
 *
 * @param canvasRef - Reference to the canvas element for coordinate conversion.
 */
export function useZoom(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const activeTool = useToolStore((s) => s.activeTool);
  const { box, isDrawing, startDrawing, updateBox, reset } = useZoomStore();
  const { zoom, offset, zoomToBounds } = useViewportStore();

  // Handle mouse down - start drawing zoom box
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (activeTool !== "zoom" || e.button !== 0) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      startDrawing(x, y);
    },
    [activeTool, canvasRef, startDrawing],
  );

  // Handle mouse move - update zoom box dimensions
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (activeTool !== "zoom" || !isDrawing) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      updateBox(mouseX, mouseY);
    },
    [activeTool, isDrawing, canvasRef, updateBox],
  );

  // Handle mouse up - execute zoom and reset
  const handleMouseUp = useCallback(() => {
    if (activeTool !== "zoom" || !isDrawing || !box) {
      reset();
      return;
    }

    const canvas = canvasRef.current;

    // Only zoom if box has meaningful dimensions and canvas is available
    if (Math.abs(box.width) > 5 && Math.abs(box.height) > 5 && canvas) {
      // Convert screen box to world coordinates
      // worldPos = (screenPos - offset) / zoom
      const screenMinX = Math.min(box.x, box.x + box.width);
      const screenMaxX = Math.max(box.x, box.x + box.width);
      const screenMinY = Math.min(box.y, box.y + box.height);
      const screenMaxY = Math.max(box.y, box.y + box.height);

      // Convert to world coordinates (in pixels, not grid units)
      const worldMinX = (screenMinX - offset.x) / zoom;
      const worldMaxX = (screenMaxX - offset.x) / zoom;
      const worldMinY = (screenMinY - offset.y) / zoom;
      const worldMaxY = (screenMaxY - offset.y) / zoom;

      const bounds = {
        minX: worldMinX,
        maxX: worldMaxX,
        minY: worldMinY,
        maxY: worldMaxY,
      };

      // Use CSS pixel dimensions (getBoundingClientRect), not canvas.width/height
      // which are now physical pixels for HiDPI support
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        zoomToBounds(bounds, rect.width, rect.height);
      }
    }

    reset();
  }, [activeTool, isDrawing, box, zoom, offset, zoomToBounds, reset, canvasRef]);

  // Reset zoom state when switching away from zoom tool
  useEffect(() => {
    if (activeTool !== "zoom") {
      reset();
    }
  }, [activeTool, reset]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    box,
    isZoomActive: activeTool === "zoom",
    isDrawingZoom: isDrawing,
  };
}
