/**
 * Path/waveguide geometry utilities for live preview rendering.
 *
 * These functions generate approximate ribbon outlines from a centerline
 * for the SVG drawing preview. The actual stored geometry is produced by
 * the Rust offset_polygon function.
 */

interface Point {
  x: number;
  y: number;
}

/**
 * Angle threshold (in degrees) for Manhattan snapping.
 * Snap to H/V if within this angle of an axis.
 */
const MANHATTAN_SNAP_ANGLE_DEG = 8;

/**
 * Constrain a point to Manhattan (horizontal or vertical) movement
 * from a reference point. Only snaps if the angle is within
 * MANHATTAN_SNAP_ANGLE_DEG of an axis; otherwise returns the original
 * point for free-form diagonal movement.
 *
 * @param lastPoint - The reference point to constrain from.
 * @param currentPoint - The point to constrain.
 * @returns Point constrained to H/V if near an axis, otherwise unchanged.
 */
export function constrainToManhattan(lastPoint: Point, currentPoint: Point): Point {
  const dx = currentPoint.x - lastPoint.x;
  const dy = currentPoint.y - lastPoint.y;

  if (dx === 0 && dy === 0) return currentPoint;

  const angleFromHorizontal = Math.abs(Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI));

  if (angleFromHorizontal <= MANHATTAN_SNAP_ANGLE_DEG) {
    return { x: currentPoint.x, y: lastPoint.y };
  }

  if (angleFromHorizontal >= 90 - MANHATTAN_SNAP_ANGLE_DEG) {
    return { x: lastPoint.x, y: currentPoint.y };
  }

  return currentPoint;
}

/**
 * Generate a ribbon polygon outline from a path centerline and width.
 *
 * This is a simplified version for the SVG preview — it uses miter joins
 * at corners without bend arcs. The actual stored geometry uses the Rust
 * offset_polygon function.
 *
 * @param pathPoints - Centerline waypoints.
 * @param width - Path width in world units.
 * @returns Array of outline points forming a closed polygon, or empty if < 2 points.
 */
export function createRibbonPreview(pathPoints: Point[], width: number): Point[] {
  if (pathPoints.length < 2) return [];

  const hw = width / 2;
  const n = pathPoints.length;
  const leftPoints: Point[] = [];
  const rightPoints: Point[] = [];

  for (let i = 0; i < n; i++) {
    const curr = pathPoints[i];

    if (i === 0) {
      // First point: perpendicular to first segment
      const next = pathPoints[1];
      const dx = next.x - curr.x;
      const dy = next.y - curr.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 1e-10) continue;
      const nx = -dy / len;
      const ny = dx / len;
      leftPoints.push({ x: curr.x + nx * hw, y: curr.y + ny * hw });
      rightPoints.push({ x: curr.x - nx * hw, y: curr.y - ny * hw });
    } else if (i === n - 1) {
      // Last point: perpendicular to last segment
      const prev = pathPoints[n - 2];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 1e-10) continue;
      const nx = -dy / len;
      const ny = dx / len;
      leftPoints.push({ x: curr.x + nx * hw, y: curr.y + ny * hw });
      rightPoints.push({ x: curr.x - nx * hw, y: curr.y - ny * hw });
    } else {
      // Interior: clamped miter to maintain constant width
      const prev = pathPoints[i - 1];
      const next = pathPoints[i + 1];

      const dx1 = curr.x - prev.x;
      const dy1 = curr.y - prev.y;
      const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      const dx2 = next.x - curr.x;
      const dy2 = next.y - curr.y;
      const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      if (len1 < 1e-10 || len2 < 1e-10) continue;

      const n1x = -dy1 / len1;
      const n1y = dx1 / len1;
      const n2x = -dy2 / len2;
      const n2y = dx2 / len2;

      const mx = n1x + n2x;
      const my = n1y + n2y;
      const mlen = Math.sqrt(mx * mx + my * my);

      if (mlen < 1e-10) {
        // 180° turn — use first segment normal
        leftPoints.push({ x: curr.x + n1x * hw, y: curr.y + n1y * hw });
        rightPoints.push({ x: curr.x - n1x * hw, y: curr.y - n1y * hw });
      } else {
        const mux = mx / mlen;
        const muy = my / mlen;
        const dot = mux * n1x + muy * n1y;

        if (Math.abs(dot) < 1e-6) {
          leftPoints.push({ x: curr.x + n1x * hw, y: curr.y + n1y * hw });
          rightPoints.push({ x: curr.x - n1x * hw, y: curr.y - n1y * hw });
        } else {
          const scale = Math.max(-2 * hw, Math.min(2 * hw, hw / dot));
          leftPoints.push({ x: curr.x + mux * scale, y: curr.y + muy * scale });
          rightPoints.push({ x: curr.x - mux * scale, y: curr.y - muy * scale });
        }
      }
    }
  }

  rightPoints.reverse();
  return [...leftPoints, ...rightPoints];
}
