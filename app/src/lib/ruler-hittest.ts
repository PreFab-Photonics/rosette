import type { Ruler, Point, RulerEndpoint } from "@/stores/ruler";
import { rulerPoints } from "@/stores/ruler-geometry";

/**
 * Shared ruler hit-testing logic and measurement-box constants.
 *
 * Centralizes the hit-test math and screen-pixel thresholds used across the
 * canvas (cursor interactions, right-click menu, selection, move). Keeping
 * these in one place avoids the historic duplication that existed in
 * RulerOverlay.tsx, use-ruler.ts, use-selection.ts, use-move.ts, and
 * Canvas.tsx (the old right-click handler).
 *
 * All functions operate on screen-space coordinates: the caller converts
 * mouse events to canvas-relative screen pixels and supplies the current
 * viewport `zoom` and `offset` so we can project ruler world points back
 * onto the screen for comparison.
 */

/** Screen pixel threshold for detecting ruler endpoint hover/click. */
export const RULER_ENDPOINT_HIT_THRESHOLD_PX = 12;

/** Screen pixel threshold for detecting ruler line hover/click. */
export const RULER_LINE_HIT_THRESHOLD_PX = 8;

/** Measurement box width in screen pixels (must match the SVG overlay). */
export const RULER_BOX_WIDTH = 140;

/** Measurement box height in screen pixels (must match the SVG overlay). */
export const RULER_BOX_HEIGHT = 56;

/** A viewport offset in screen pixels. */
export interface ViewportOffset {
  x: number;
  y: number;
}

/**
 * Distance from point `(px, py)` to line segment `((x1, y1), (x2, y2))`.
 *
 * Handles the degenerate zero-length segment by returning the distance to
 * the shared endpoint.
 */
export function pointToSegmentDistance(
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

/** Project a world-space ruler point to screen coordinates. */
function projectPoint(p: Point, zoom: number, offset: ViewportOffset) {
  return { x: p.x * zoom + offset.x, y: p.y * zoom + offset.y };
}

/**
 * True when `(screenX, screenY)` is within `thresholdPx` of the world point.
 */
function isNearPoint(
  screenX: number,
  screenY: number,
  worldPoint: Point,
  zoom: number,
  offset: ViewportOffset,
  thresholdPx: number,
): boolean {
  const s = projectPoint(worldPoint, zoom, offset);
  const dx = screenX - s.x;
  const dy = screenY - s.y;
  return dx * dx + dy * dy <= thresholdPx * thresholdPx;
}

/**
 * Find the ruler endpoint (start or end) nearest the given screen point,
 * within `RULER_ENDPOINT_HIT_THRESHOLD_PX`. Returns `null` if none are near.
 *
 * Iteration order follows the map's insertion order; callers that need a
 * specific priority (e.g., top-most first) should iterate externally.
 */
export function findRulerEndpointAtScreenPoint(
  screenX: number,
  screenY: number,
  rulers: Map<string, Ruler>,
  zoom: number,
  offset: ViewportOffset,
  excludeRulerId?: string,
): { rulerId: string; endpoint: RulerEndpoint } | null {
  for (const ruler of rulers.values()) {
    if (excludeRulerId && ruler.id === excludeRulerId) continue;

    // Endpoint hit-test only applies to two-point rulers. Polylines (and
    // future kinds) use `findRulerVertexAtScreenPoint` instead.
    if (ruler.kind !== "simple" && ruler.kind !== "super") continue;

    if (isNearPoint(screenX, screenY, ruler.start, zoom, offset, RULER_ENDPOINT_HIT_THRESHOLD_PX)) {
      return { rulerId: ruler.id, endpoint: "start" };
    }
    if (isNearPoint(screenX, screenY, ruler.end, zoom, offset, RULER_ENDPOINT_HIT_THRESHOLD_PX)) {
      return { rulerId: ruler.id, endpoint: "end" };
    }
  }
  return null;
}

/**
 * Find the ruler *vertex* (any control point of a non-two-point kind)
 * nearest the screen point. Returns `{ rulerId, pointIndex }` where
 * `pointIndex` is the position in the array returned by
 * `rulerPoints(ruler)`.
 *
 * Two-point rulers (`simple`, `super`) are intentionally skipped here —
 * they use `findRulerEndpointAtScreenPoint`, which carries the
 * `"start" | "end"` vocabulary used by their undo commands. Callers that
 * want a single lookup should run `findRulerEndpointAtScreenPoint` first
 * and fall through to this on miss.
 */
export function findRulerVertexAtScreenPoint(
  screenX: number,
  screenY: number,
  rulers: Map<string, Ruler>,
  zoom: number,
  offset: ViewportOffset,
  excludeRulerId?: string,
): { rulerId: string; pointIndex: number } | null {
  for (const ruler of rulers.values()) {
    if (excludeRulerId && ruler.id === excludeRulerId) continue;
    // Symmetric with findRulerEndpointAtScreenPoint's two-point-only
    // guard: keep the two hit-test functions exclusive so their callers
    // can't accidentally double-fire.
    if (ruler.kind === "simple" || ruler.kind === "super") continue;
    const pts = rulerPoints(ruler);
    for (let i = 0; i < pts.length; i++) {
      if (isNearPoint(screenX, screenY, pts[i], zoom, offset, RULER_ENDPOINT_HIT_THRESHOLD_PX)) {
        return { rulerId: ruler.id, pointIndex: i };
      }
    }
  }
  return null;
}

/**
 * True when `(screenX, screenY)` lies inside the measurement box of `ruler`.
 *
 * The box is `RULER_BOX_WIDTH × RULER_BOX_HEIGHT` centered on the midpoint
 * of the ruler's two endpoints in screen space.
 */
export function isInsideRulerBox(
  screenX: number,
  screenY: number,
  ruler: Ruler,
  zoom: number,
  offset: ViewportOffset,
): boolean {
  // Measurement boxes only exist for two-point rulers (simple + super).
  // Polyline / angle / radius rulers render their labels differently;
  // hit-testing their labels is handled in `isNearRulerLine` / the
  // kind-specific hit-test below.
  if (ruler.kind !== "simple" && ruler.kind !== "super") return false;
  const s = projectPoint(ruler.start, zoom, offset);
  const e = projectPoint(ruler.end, zoom, offset);
  const midX = (s.x + e.x) / 2;
  const midY = (s.y + e.y) / 2;
  const halfW = RULER_BOX_WIDTH / 2;
  const halfH = RULER_BOX_HEIGHT / 2;
  return (
    screenX >= midX - halfW &&
    screenX <= midX + halfW &&
    screenY >= midY - halfH &&
    screenY <= midY + halfH
  );
}

/**
 * True when `(screenX, screenY)` is within `thresholdPx` of any of the
 * ruler's line segments. Walks the polyline formed by `rulerPoints`.
 */
export function isNearRulerLine(
  screenX: number,
  screenY: number,
  ruler: Ruler,
  zoom: number,
  offset: ViewportOffset,
  thresholdPx: number = RULER_LINE_HIT_THRESHOLD_PX,
): boolean {
  const pts = rulerPoints(ruler);
  for (let i = 0; i < pts.length - 1; i++) {
    const a = projectPoint(pts[i], zoom, offset);
    const b = projectPoint(pts[i + 1], zoom, offset);
    if (pointToSegmentDistance(screenX, screenY, a.x, a.y, b.x, b.y) <= thresholdPx) {
      return true;
    }
  }
  return false;
}

/**
 * Find the ruler at the given screen point, checking the measurement box
 * first (higher priority), then the line segment. Returns the ruler id or
 * `null`.
 */
export function findRulerAtScreenPoint(
  screenX: number,
  screenY: number,
  rulers: Map<string, Ruler>,
  zoom: number,
  offset: ViewportOffset,
  excludeRulerId?: string,
): string | null {
  for (const ruler of rulers.values()) {
    if (excludeRulerId && ruler.id === excludeRulerId) continue;
    if (isInsideRulerBox(screenX, screenY, ruler, zoom, offset)) return ruler.id;
    if (isNearRulerLine(screenX, screenY, ruler, zoom, offset)) return ruler.id;
  }
  return null;
}

/** Cross product used by segment-segment intersection. */
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

/** Do two segments intersect (including collinear overlap at endpoints)? */
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

/**
 * True when the segment `((x1, y1), (x2, y2))` intersects the axis-aligned
 * rectangle bounded by `(rectMinX, rectMinY)` and `(rectMaxX, rectMaxY)`.
 */
export function lineIntersectsRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rectMinX: number,
  rectMinY: number,
  rectMaxX: number,
  rectMaxY: number,
): boolean {
  // Either endpoint inside the rect
  if (
    (x1 >= rectMinX && x1 <= rectMaxX && y1 >= rectMinY && y1 <= rectMaxY) ||
    (x2 >= rectMinX && x2 <= rectMaxX && y2 >= rectMinY && y2 <= rectMaxY)
  ) {
    return true;
  }

  // Intersects any of the 4 rect edges
  const edges: [number, number, number, number][] = [
    [rectMinX, rectMinY, rectMaxX, rectMinY],
    [rectMaxX, rectMinY, rectMaxX, rectMaxY],
    [rectMinX, rectMaxY, rectMaxX, rectMaxY],
    [rectMinX, rectMinY, rectMinX, rectMaxY],
  ];
  for (const [ex1, ey1, ex2, ey2] of edges) {
    if (segmentsIntersect(x1, y1, x2, y2, ex1, ey1, ex2, ey2)) return true;
  }
  return false;
}

/**
 * Find all rulers whose line or measurement box overlaps the given screen
 * rectangle. Used by marquee selection.
 */
export function findRulersInScreenRect(
  screenMinX: number,
  screenMinY: number,
  screenMaxX: number,
  screenMaxY: number,
  rulers: Map<string, Ruler>,
  zoom: number,
  offset: ViewportOffset,
): string[] {
  const hitRulerIds: string[] = [];

  for (const ruler of rulers.values()) {
    const pts = rulerPoints(ruler);
    let hitSegment = false;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = projectPoint(pts[i], zoom, offset);
      const b = projectPoint(pts[i + 1], zoom, offset);
      if (lineIntersectsRect(a.x, a.y, b.x, b.y, screenMinX, screenMinY, screenMaxX, screenMaxY)) {
        hitSegment = true;
        break;
      }
    }
    if (hitSegment) {
      hitRulerIds.push(ruler.id);
      continue;
    }

    // Measurement-box overlap only applies to two-point rulers.
    if (ruler.kind === "simple" || ruler.kind === "super") {
      const s = projectPoint(ruler.start, zoom, offset);
      const e = projectPoint(ruler.end, zoom, offset);
      const midX = (s.x + e.x) / 2;
      const midY = (s.y + e.y) / 2;
      const boxMinX = midX - RULER_BOX_WIDTH / 2;
      const boxMaxX = midX + RULER_BOX_WIDTH / 2;
      const boxMinY = midY - RULER_BOX_HEIGHT / 2;
      const boxMaxY = midY + RULER_BOX_HEIGHT / 2;
      if (
        boxMinX <= screenMaxX &&
        boxMaxX >= screenMinX &&
        boxMinY <= screenMaxY &&
        boxMaxY >= screenMinY
      ) {
        hitRulerIds.push(ruler.id);
      }
    }
  }

  return hitRulerIds;
}
