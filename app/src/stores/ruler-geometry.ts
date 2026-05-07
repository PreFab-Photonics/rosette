import type { Point, Ruler } from "@/stores/ruler";

/**
 * Pure helpers that operate on the `Ruler` discriminated union.
 *
 * Centralising kind dispatch here means the store, commands, renderers,
 * and hooks don't have to pattern-match on `ruler.kind` directly — they
 * can ask "what points does this ruler have?" or "translate this ruler".
 *
 * Only `"simple"` is implemented today; follow-up ruler-kind issues
 * (ROS-560 … ROS-563) extend each function with their new cases.
 */

/** Axis-aligned bounding rectangle in world coordinates. */
export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Return the ruler's control points in stable order.
 *
 * For a simple ruler this is `[start, end]`. Future kinds will return
 * their own ordered list (e.g., polyline vertices, angle arms).
 *
 * The returned array is always a fresh copy; mutating it does not affect
 * the ruler.
 */
export function rulerPoints(ruler: Ruler): Point[] {
  switch (ruler.kind) {
    case "simple":
    case "super":
      return [{ ...ruler.start }, { ...ruler.end }];
    case "polyline":
      return ruler.points.map((p) => ({ ...p }));
    case "angle":
      return [{ ...ruler.vertex }, { ...ruler.armA }, { ...ruler.armB }];
    case "radius":
      return [{ ...ruler.center }, { ...ruler.edge }];
  }
}

/**
 * Axis-aligned bounding box of the ruler's control points in world
 * coordinates. Useful for marquee rejection and fit-to-view.
 */
export function rulerBounds(ruler: Ruler): Bounds {
  const pts = rulerPoints(ruler);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

/**
 * Return a new ruler translated by `(dx, dy)` in world units. The source
 * ruler is not mutated. Preserves `id` and all ruler-specific fields.
 */
export function translateRuler(ruler: Ruler, dx: number, dy: number): Ruler {
  switch (ruler.kind) {
    case "simple":
    case "super":
      return {
        ...ruler,
        start: { x: ruler.start.x + dx, y: ruler.start.y + dy },
        end: { x: ruler.end.x + dx, y: ruler.end.y + dy },
      };
    case "polyline":
      return {
        ...ruler,
        points: ruler.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
      };
    case "angle":
      return {
        ...ruler,
        vertex: { x: ruler.vertex.x + dx, y: ruler.vertex.y + dy },
        armA: { x: ruler.armA.x + dx, y: ruler.armA.y + dy },
        armB: { x: ruler.armB.x + dx, y: ruler.armB.y + dy },
      };
    case "radius":
      return {
        ...ruler,
        center: { x: ruler.center.x + dx, y: ruler.center.y + dy },
        edge: { x: ruler.edge.x + dx, y: ruler.edge.y + dy },
      };
  }
}

/**
 * Return a new ruler with the control point at `pointIndex` replaced by
 * `point`. Indices follow the order from `rulerPoints`.
 *
 * If `pointIndex` is out of range, returns the original ruler.
 */
export function setRulerPoint(ruler: Ruler, pointIndex: number, point: Point): Ruler {
  switch (ruler.kind) {
    case "simple":
    case "super": {
      if (pointIndex === 0) return { ...ruler, start: { ...point } };
      if (pointIndex === 1) return { ...ruler, end: { ...point } };
      return ruler;
    }
    case "polyline": {
      if (pointIndex < 0 || pointIndex >= ruler.points.length) return ruler;
      const nextPoints = ruler.points.slice();
      nextPoints[pointIndex] = { ...point };
      return { ...ruler, points: nextPoints };
    }
    case "angle": {
      // 0 = vertex, 1 = armA, 2 = armB — matches rulerPoints order.
      if (pointIndex === 0) return { ...ruler, vertex: { ...point } };
      if (pointIndex === 1) return { ...ruler, armA: { ...point } };
      if (pointIndex === 2) return { ...ruler, armB: { ...point } };
      return ruler;
    }
    case "radius": {
      // 0 = center, 1 = edge.
      if (pointIndex === 0) return { ...ruler, center: { ...point } };
      if (pointIndex === 1) return { ...ruler, edge: { ...point } };
      return ruler;
    }
  }
}
