/**
 * Pure utility functions for minimap rendering and coordinate math.
 *
 * All functions are framework-agnostic and operate on plain data.
 * The minimap renders a scaled-down view of all polygons in the
 * WASM library, plus a viewport rectangle showing the current view.
 */

// ============================================================
// Types
// ============================================================

/** Computed bounds and transform for rendering the minimap. */
export interface MinimapBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  /** World-space width of the content. */
  width: number;
  /** World-space height of the content. */
  height: number;
  /** Scale factor: minimap pixels per world unit. */
  scale: number;
  /** X offset to center content within the minimap canvas. */
  offsetX: number;
  /** Y offset to center content within the minimap canvas. */
  offsetY: number;
}

/** Theme-aware colors for minimap rendering. */
export interface MinimapColors {
  canvasBg: string;
  viewportStroke: string;
  viewportFill: string;
}

/**
 * A single polygon from `WasmLibrary.get_render_polygons()`.
 *
 * Format: [uuid, vertices, rgba_color]
 * - uuid: string identifier
 * - vertices: array of [x, y] pairs in world coordinates
 * - rgba_color: [r, g, b, a] with values 0.0-1.0
 */
export type RenderPolygon = [string, [number, number][], [number, number, number, number]];

// ============================================================
// Bounds calculation
// ============================================================

/**
 * Calculate minimap bounds from WASM world bounds.
 *
 * Adds 5% padding and computes scale/offset to center
 * content within the minimap canvas.
 *
 * @param worldBounds - Float64Array [minX, minY, maxX, maxY] from library.get_all_bounds()
 * @param minimapSize - Pixel size of the minimap canvas (square)
 * @returns Computed bounds, or null if input is invalid
 */
export function calculateMinimapBounds(
  worldBounds: Float64Array,
  minimapSize: number,
): MinimapBounds | null {
  if (worldBounds.length < 4) return null;

  let minX = worldBounds[0];
  let minY = worldBounds[1];
  let maxX = worldBounds[2];
  let maxY = worldBounds[3];

  // Bail on degenerate bounds
  if (
    !Number.isFinite(minX) ||
    !Number.isFinite(minY) ||
    !Number.isFinite(maxX) ||
    !Number.isFinite(maxY)
  )
    return null;

  // Add 5% padding (minimum 1 world unit)
  const padding = Math.max((maxX - minX) * 0.05, (maxY - minY) * 0.05, 1);
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const width = maxX - minX;
  const height = maxY - minY;

  // Scale to fit the larger dimension
  const scaleX = minimapSize / width;
  const scaleY = minimapSize / height;
  const scale = Math.min(scaleX, scaleY);

  // Center within the minimap
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const offsetX = (minimapSize - scaledWidth) / 2;
  const offsetY = (minimapSize - scaledHeight) / 2;

  return { minX, minY, maxX, maxY, width, height, scale, offsetX, offsetY };
}

// ============================================================
// Coordinate conversion
// ============================================================

/** Convert world coordinates to minimap pixel coordinates. */
export function worldToMinimap(
  worldX: number,
  worldY: number,
  bounds: MinimapBounds,
): { x: number; y: number } {
  return {
    x: (worldX - bounds.minX) * bounds.scale + bounds.offsetX,
    y: (worldY - bounds.minY) * bounds.scale + bounds.offsetY,
  };
}

/** Convert minimap pixel coordinates to world coordinates. */
export function minimapToWorld(
  minimapX: number,
  minimapY: number,
  bounds: MinimapBounds,
): { x: number; y: number } {
  return {
    x: bounds.minX + (minimapX - bounds.offsetX) / bounds.scale,
    y: bounds.minY + (minimapY - bounds.offsetY) / bounds.scale,
  };
}

// ============================================================
// Rendering
// ============================================================

/**
 * Render polygon data from WASM onto a 2D canvas context.
 *
 * Each polygon is filled with its RGBA color. The color already
 * includes layer information (set via library.set_layer_color).
 */
export function renderMinimapPolygons(
  ctx: CanvasRenderingContext2D,
  bounds: MinimapBounds,
  polygons: RenderPolygon[],
): void {
  for (const [, vertices, color] of polygons) {
    if (vertices.length < 3) continue;

    // Convert RGBA 0-1 to CSS
    const r = Math.round(color[0] * 255);
    const g = Math.round(color[1] * 255);
    const b = Math.round(color[2] * 255);
    const a = color[3];

    ctx.fillStyle = `rgba(${r},${g},${b},${a})`;

    ctx.beginPath();
    const first = worldToMinimap(vertices[0][0], vertices[0][1], bounds);
    ctx.moveTo(first.x, first.y);

    for (let i = 1; i < vertices.length; i++) {
      const p = worldToMinimap(vertices[i][0], vertices[i][1], bounds);
      ctx.lineTo(p.x, p.y);
    }

    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Draw the viewport rectangle showing the current camera view.
 *
 * Uses the new coordinate system: screenPos = worldPos * zoom + offset.
 * No gridSize multiplier.
 */
export function drawViewportRect(
  ctx: CanvasRenderingContext2D,
  bounds: MinimapBounds,
  offset: { x: number; y: number },
  zoom: number,
  canvasWidth: number,
  canvasHeight: number,
  colors: MinimapColors,
): void {
  // World-space viewport bounds
  const viewMinX = -offset.x / zoom;
  const viewMinY = -offset.y / zoom;
  const viewMaxX = viewMinX + canvasWidth / zoom;
  const viewMaxY = viewMinY + canvasHeight / zoom;

  // Convert to minimap coordinates
  const topLeft = worldToMinimap(viewMinX, viewMinY, bounds);
  const bottomRight = worldToMinimap(viewMaxX, viewMaxY, bounds);

  const rectX = topLeft.x;
  const rectY = topLeft.y;
  const rectW = bottomRight.x - topLeft.x;
  const rectH = bottomRight.y - topLeft.y;

  ctx.strokeStyle = colors.viewportStroke;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.strokeRect(rectX, rectY, rectW, rectH);

  ctx.fillStyle = colors.viewportFill;
  ctx.fillRect(rectX, rectY, rectW, rectH);

  ctx.setLineDash([]);
}

// ============================================================
// Theme colors
// ============================================================

/** Get minimap colors for the current theme. */
export function getMinimapColors(isDark: boolean): MinimapColors {
  return {
    canvasBg: isDark ? "rgb(29,29,29)" : "rgb(241,241,241)",
    viewportStroke: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
    viewportFill: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
  };
}
