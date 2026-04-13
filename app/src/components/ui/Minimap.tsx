import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useViewportStore } from "@/stores/viewport";
import { useUIStore } from "@/stores/ui";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useLayerStore } from "@/stores/layer";
import { useHistoryStore } from "@/stores/history";
import { useMinimapStore } from "@/stores/minimap";
import { useImageStore } from "@/stores/image";
import { useExplorerStore } from "@/stores/explorer";
import {
  calculateMinimapBounds,
  drawViewportRect,
  getMinimapColors,
  minimapToWorld,
  renderMinimapPolygons,
  worldToMinimap,
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

  // Image overlays (scoped to active cell)
  const allImages = useImageStore((s) => s.images);
  const activeCell = useExplorerStore((s) => s.activeCell);

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

    // Collect images for the active cell
    const cellImages = [...allImages.values()].filter((img) => img.cellName === activeCell);

    // Collect instance image contexts from child cells
    type InstanceCtx = { cellName: string; transform: Float64Array };
    let instanceContexts: InstanceCtx[] = [];
    try {
      instanceContexts = (library.get_instance_cell_contexts() as InstanceCtx[] | null) ?? [];
    } catch {
      // method may not be available
    }

    // Build cell -> images lookup for instance rendering
    const cellImageMap = new Map<string, typeof cellImages>();
    if (instanceContexts.length > 0) {
      for (const entry of allImages.values()) {
        const list = cellImageMap.get(entry.cellName);
        if (list) list.push(entry);
        else cellImageMap.set(entry.cellName, [entry]);
      }
    }

    // Merge WASM bounds with all visible image bounds (direct + instance)
    let mergedBounds: Float64Array | null = worldBounds ?? null;
    let imgMinX = Infinity;
    let imgMinY = Infinity;
    let imgMaxX = -Infinity;
    let imgMaxY = -Infinity;
    let hasImages = false;

    // Direct images
    for (const img of cellImages) {
      hasImages = true;
      imgMinX = Math.min(imgMinX, img.x);
      imgMinY = Math.min(imgMinY, img.y);
      imgMaxX = Math.max(imgMaxX, img.x + img.width);
      imgMaxY = Math.max(imgMaxY, img.y + img.height);
    }

    // Instance images (transform corners to get world-space bounds)
    for (const ctx of instanceContexts) {
      const imgs = cellImageMap.get(ctx.cellName);
      if (!imgs) continue;
      const [a, b, c, d, tx, ty] = ctx.transform;
      for (const img of imgs) {
        hasImages = true;
        const corners = [
          [img.x, img.y],
          [img.x + img.width, img.y],
          [img.x + img.width, img.y + img.height],
          [img.x, img.y + img.height],
        ];
        for (const [px, py] of corners) {
          const wx = a * px + b * py + tx;
          const wy = c * px + d * py + ty;
          imgMinX = Math.min(imgMinX, wx);
          imgMinY = Math.min(imgMinY, wy);
          imgMaxX = Math.max(imgMaxX, wx);
          imgMaxY = Math.max(imgMaxY, wy);
        }
      }
    }

    if (hasImages) {
      if (mergedBounds) {
        mergedBounds = new Float64Array([
          Math.min(mergedBounds[0], imgMinX),
          Math.min(mergedBounds[1], imgMinY),
          Math.max(mergedBounds[2], imgMaxX),
          Math.max(mergedBounds[3], imgMaxY),
        ]);
      } else {
        mergedBounds = new Float64Array([imgMinX, imgMinY, imgMaxX, imgMaxY]);
      }
    }

    if (!mergedBounds) {
      boundsRef.current = null;
      shapeCacheRef.current = null;
      return;
    }

    const bounds = calculateMinimapBounds(mergedBounds, MINIMAP_SIZE);
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

    let filteredPolygons = polygons ?? [];
    if (hiddenLayers.size > 0 && filteredPolygons.length > 0) {
      filteredPolygons = filteredPolygons.filter(([id]) => {
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

    // Render image overlays as semi-transparent rectangles
    if (hasImages) {
      offCtx.fillStyle = "rgba(200, 200, 200, 0.3)";
      offCtx.strokeStyle = "rgba(200, 200, 200, 0.5)";
      offCtx.lineWidth = 0.5;

      // Direct images (axis-aligned)
      for (const img of cellImages) {
        const topLeft = worldToMinimap(img.x, img.y, bounds);
        const bottomRight = worldToMinimap(img.x + img.width, img.y + img.height, bounds);
        const w = bottomRight.x - topLeft.x;
        const h = bottomRight.y - topLeft.y;
        offCtx.fillRect(topLeft.x, topLeft.y, w, h);
        offCtx.strokeRect(topLeft.x, topLeft.y, w, h);
      }

      // Instance images (transformed — draw as filled quads)
      for (const ctx of instanceContexts) {
        const imgs = cellImageMap.get(ctx.cellName);
        if (!imgs) continue;
        const [a, b, c, d, tx, ty] = ctx.transform;
        for (const img of imgs) {
          const corners = [
            [img.x, img.y],
            [img.x + img.width, img.y],
            [img.x + img.width, img.y + img.height],
            [img.x, img.y + img.height],
          ];
          offCtx.beginPath();
          for (let i = 0; i < corners.length; i++) {
            const [px, py] = corners[i];
            const wx = a * px + b * py + tx;
            const wy = c * px + d * py + ty;
            const mp = worldToMinimap(wx, wy, bounds);
            if (i === 0) offCtx.moveTo(mp.x, mp.y);
            else offCtx.lineTo(mp.x, mp.y);
          }
          offCtx.closePath();
          offCtx.fill();
          offCtx.stroke();
        }
      }
    }

    shapeCacheRef.current = offscreen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, layers, isMinimized, undoCount, redoCount, allImages, activeCell]);

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
  }, [
    zoom,
    offset,
    isMinimized,
    colors,
    getCanvasRect,
    undoCount,
    redoCount,
    allImages,
    activeCell,
  ]);

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
