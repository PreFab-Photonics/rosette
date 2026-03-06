import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useViewportStore } from "@/stores/viewport";
import { useUIStore } from "@/stores/ui";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useLayerStore } from "@/stores/layer";
import { useHistoryStore } from "@/stores/history";
import { useMinimapStore } from "@/stores/minimap";
import {
  calculateMinimapBounds,
  drawViewportRect,
  getMinimapColors,
  minimapToWorld,
  renderMinimapPolygons,
  type MinimapBounds,
  type RenderPolygon,
} from "@/lib/minimap";

/** Pixel size of the expanded minimap canvas (square). */
const MINIMAP_SIZE = 180;

/**
 * Minimap overview panel.
 *
 * Shows a scaled-down view of all shapes in the design with a dashed
 * rectangle indicating the current viewport. Click or drag within the
 * minimap to navigate. Collapses to a small icon when minimized.
 *
 * Reads all data from Zustand stores -- no props needed.
 */
export function Minimap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeCacheRef = useRef<HTMLCanvasElement | null>(null);
  const boundsRef = useRef<MinimapBounds | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Store state
  const zoom = useViewportStore((s) => s.zoom);
  const offset = useViewportStore((s) => s.offset);
  const theme = useUIStore((s) => s.theme);
  const library = useWasmContextStore((s) => s.library);
  const layers = useLayerStore((s) => s.layers);
  const isMinimized = useMinimapStore((s) => s.isMinimized);

  // Track history stack lengths as a reactive signal for shape changes.
  // Every shape mutation (create, delete, move, undo, redo) updates these.
  const undoCount = useHistoryStore((s) => s.undoStack.length);
  const redoCount = useHistoryStore((s) => s.redoStack.length);

  const isDark = theme === "dark";
  const colors = useMemo(() => getMinimapColors(isDark), [isDark]);

  // ============================================================
  // Forward wheel events to the main canvas so scroll-zoom works
  // ============================================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const mainCanvas = document.getElementById("rosette-canvas");
      if (!mainCanvas) return;

      // Prevent the default so the page doesn't scroll, then
      // re-dispatch an identical wheel event on the main canvas.
      e.preventDefault();
      mainCanvas.dispatchEvent(new WheelEvent("wheel", e));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // ============================================================
  // Get main canvas dimensions (CSS pixels for viewport math)
  // ============================================================
  const getCanvasRect = useCallback(() => {
    const el = document.getElementById("rosette-canvas");
    return el?.getBoundingClientRect() ?? null;
  }, []);

  // ============================================================
  // Navigation: convert minimap click to world coords, update offset
  // ============================================================
  const handleNavigation = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const bounds = boundsRef.current;
      if (!bounds) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Convert minimap position to world coordinates
      const world = minimapToWorld(mouseX, mouseY, bounds);

      // Center the viewport on this world point
      const canvasRect = getCanvasRect();
      if (!canvasRect) return;

      const newOffsetX = -(world.x * zoom) + canvasRect.width / 2;
      const newOffsetY = -(world.y * zoom) + canvasRect.height / 2;

      useViewportStore.getState().setOffset(newOffsetX, newOffsetY);
    },
    [zoom, getCanvasRect],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.stopPropagation();
      setIsDragging(true);
      handleNavigation(e);
    },
    [handleNavigation],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDragging) {
        handleNavigation(e);
      }
    },
    [isDragging, handleNavigation],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ============================================================
  // Cache shape rendering to an offscreen canvas.
  // Only redraws when library content or layers change.
  // ============================================================
  useEffect(() => {
    if (isMinimized || !library) return;

    const worldBounds = library.get_all_bounds();
    if (!worldBounds) {
      boundsRef.current = null;
      shapeCacheRef.current = null;
      return;
    }

    const bounds = calculateMinimapBounds(worldBounds, MINIMAP_SIZE);
    if (!bounds) {
      boundsRef.current = null;
      shapeCacheRef.current = null;
      return;
    }

    boundsRef.current = bounds;

    // Fetch polygon data from WASM
    let polygons: RenderPolygon[];
    try {
      polygons = library.get_render_polygons() as RenderPolygon[];
    } catch {
      shapeCacheRef.current = null;
      return;
    }

    if (!polygons || polygons.length === 0) {
      shapeCacheRef.current = null;
      return;
    }

    // Filter out polygons on hidden layers.
    // get_render_polygons returns colors from library's layer_colors, but we
    // need to check visibility from the JS-side layer store. The polygon color
    // encodes the layer -- we can't reverse it to a layer number, but we can
    // use get_element_info per polygon to check layer. For performance, we
    // build a set of hidden layers upfront and filter by element info.
    const hiddenLayers = new Set<string>();
    for (const [, layer] of layers) {
      if (!layer.visible) {
        hiddenLayers.add(`${layer.layerNumber}:${layer.datatype}`);
      }
    }

    let filteredPolygons = polygons;
    if (hiddenLayers.size > 0) {
      filteredPolygons = polygons.filter(([id]) => {
        const info = library.get_element_info(id);
        if (!info) return true; // show if we can't determine
        const key = `${info.layer}:${info.datatype}`;
        const hidden = hiddenLayers.has(key);
        info.free();
        return !hidden;
      });
    }

    // Render to offscreen canvas
    const offscreen = document.createElement("canvas");
    offscreen.width = MINIMAP_SIZE;
    offscreen.height = MINIMAP_SIZE;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    offCtx.clearRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);
    renderMinimapPolygons(offCtx, bounds, filteredPolygons);

    shapeCacheRef.current = offscreen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, layers, isMinimized, undoCount, redoCount]);

  // ============================================================
  // Composite: draw cached shapes + viewport rect.
  // Runs on every viewport change (cheap).
  // ============================================================
  useEffect(() => {
    if (isMinimized) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bounds = boundsRef.current;

    // Clear and fill background
    ctx.clearRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);
    ctx.fillStyle = colors.canvasBg;
    ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

    // Draw cached shapes
    if (shapeCacheRef.current) {
      ctx.drawImage(shapeCacheRef.current, 0, 0);
    }

    // Draw viewport rectangle
    if (bounds) {
      const canvasRect = getCanvasRect();
      if (canvasRect && canvasRect.width > 0 && canvasRect.height > 0) {
        drawViewportRect(ctx, bounds, offset, zoom, canvasRect.width, canvasRect.height, colors);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, offset, isMinimized, colors, getCanvasRect, undoCount, redoCount]);

  // ============================================================
  // Don't render when minimized — toggle lives in StatusBar
  // ============================================================
  if (isMinimized) return null;

  const containerClasses = `rounded-xl border p-1 ${
    isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"
  }`;

  return (
    <div className="pointer-events-none absolute bottom-4 right-4 select-none">
      <div ref={containerRef} className={`pointer-events-auto relative ${containerClasses}`}>
        <canvas
          ref={canvasRef}
          width={MINIMAP_SIZE}
          height={MINIMAP_SIZE}
          className="pointer-events-auto cursor-move rounded-lg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    </div>
  );
}
