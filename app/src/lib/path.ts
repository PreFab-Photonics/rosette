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
 * Densify a centerline by replacing sharp interior corners with circular arc points.
 *
 * TypeScript mirror of the Rust `densify_centerline_with_arcs` function.
 * Used for the live SVG drawing preview so the user sees rounded corners
 * while drawing.
 *
 * Uses a two-pass algorithm so adjacent corners sharing a segment split the
 * available space fairly instead of the first corner greedily consuming it all.
 *
 * @param points - Centerline waypoints.
 * @param cornerRadius - Bend radius in world units (0 = sharp corners).
 * @param numArcPoints - Maximum arc points per corner (higher = smoother).
 * @returns Densified centerline with arc points inserted at corners.
 */
export function densifyCenterlineWithArcs(
  points: Point[],
  cornerRadius: number,
  numArcPoints: number = 64,
): Point[] {
  const n = points.length;
  if (n < 3 || cornerRadius <= 0) return points;

  // Pre-compute segment lengths
  const segLengths: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    segLengths.push(Math.sqrt(dx * dx + dy * dy));
  }

  const numCorners = n - 2;

  // --- Pass 1: compute turn angles and ideal setbacks ---
  const turnAngles: (number | null)[] = [];

  for (let i = 1; i < n - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const inLen = segLengths[i - 1];
    const outLen = segLengths[i];
    if (inLen < 1e-10 || outLen < 1e-10) {
      turnAngles.push(null);
      continue;
    }

    const inX = (curr.x - prev.x) / inLen;
    const inY = (curr.y - prev.y) / inLen;
    const outX = (next.x - curr.x) / outLen;
    const outY = (next.y - curr.y) / outLen;

    const cross = inX * outY - inY * outX;
    const dot = inX * outX + inY * outY;
    const turnAngle = Math.atan2(cross, dot);

    if (Math.abs(turnAngle) < 1e-6) {
      turnAngles.push(null);
    } else {
      turnAngles.push(turnAngle);
    }
  }

  // Ideal setback per corner
  const setbacks: number[] = turnAngles.map((ta) => {
    if (ta === null) return 0;
    const halfAngle = Math.abs(ta) / 2;
    return cornerRadius * Math.tan(halfAngle);
  });

  // --- Pass 2: resolve conflicts on shared segments (iterative) ---
  // Segment k is claimed by corner k-1 (outgoing) and corner k (incoming).
  for (let _iter = 0; _iter < 3; _iter++) {
    for (let k = 0; k < segLengths.length; k++) {
      const capacity = segLengths[k] * 0.95;

      const outCorner = k > 0 ? k - 1 : null;
      const inCorner = k < numCorners ? k : null;

      const outClaim = outCorner !== null ? setbacks[outCorner] : 0;
      const inClaim = inCorner !== null ? setbacks[inCorner] : 0;

      const total = outClaim + inClaim;
      if (total > capacity && total > 1e-10) {
        const scale = capacity / total;
        if (outCorner !== null) {
          setbacks[outCorner] = Math.min(setbacks[outCorner], outClaim * scale);
        }
        if (inCorner !== null) {
          setbacks[inCorner] = Math.min(setbacks[inCorner], inClaim * scale);
        }
      }
    }
  }

  // --- Pass 3: generate arc points ---
  const result: Point[] = [points[0]];

  for (let c = 0; c < numCorners; c++) {
    const i = c + 1; // centerline vertex index
    const curr = points[i];
    const turnAngle = turnAngles[c];

    if (turnAngle === null) {
      result.push(curr);
      continue;
    }

    const setback = setbacks[c];
    const halfAngle = Math.abs(turnAngle) / 2;
    const tanHalf = Math.tan(halfAngle);
    const radius = Math.abs(tanHalf) > 1e-10 ? setback / tanHalf : 0;

    if (radius < 1e-6 || setback < 1e-6) {
      result.push(curr);
      continue;
    }

    const prev = points[i - 1];
    const next = points[i + 1];
    const inLen = segLengths[i - 1];
    const outLen = segLengths[i];

    const inX = (curr.x - prev.x) / inLen;
    const inY = (curr.y - prev.y) / inLen;
    const outX = (next.x - curr.x) / outLen;
    const outY = (next.y - curr.y) / outLen;

    const turnSign = turnAngle > 0 ? 1 : -1;

    // Tangent points
    const bendStartX = curr.x + inX * -setback;
    const bendStartY = curr.y + inY * -setback;
    const bendEndX = curr.x + outX * setback;
    const bendEndY = curr.y + outY * setback;

    // Arc center: perpendicular to incoming at bend_start, offset by radius
    const perpX = -inY * turnSign;
    const perpY = inX * turnSign;
    const centerX = bendStartX + perpX * radius;
    const centerY = bendStartY + perpY * radius;

    // Vector from center to bend_start
    const startVecX = bendStartX - centerX;
    const startVecY = bendStartY - centerY;

    const numSegments = Math.min(
      Math.max(Math.ceil(((Math.abs(turnAngle) * 180) / Math.PI) * 2), 8),
      numArcPoints,
    );

    result.push({ x: bendStartX, y: bendStartY });
    for (let j = 1; j < numSegments; j++) {
      const t = j / numSegments;
      const angle = turnAngle * t;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      result.push({
        x: centerX + startVecX * cos - startVecY * sin,
        y: centerY + startVecX * sin + startVecY * cos,
      });
    }
    result.push({ x: bendEndX, y: bendEndY });
  }

  result.push(points[n - 1]);
  return result;
}

/**
 * Info about a corner where the bend radius was auto-reduced.
 */
export interface BendReduction {
  /** 1-based index of the interior corner (1 = first interior vertex). */
  cornerIndex: number;
  /** The radius the user requested (world units). */
  requested: number;
  /** The radius actually used after clamping (world units). */
  actual: number;
}

/**
 * Check which corners of a path would have their bend radius auto-reduced.
 *
 * Uses the same two-pass algorithm as `densifyCenterlineWithArcs` to compute
 * the actual setbacks after fair segment sharing, then reports corners where
 * the resulting radius is less than requested.
 *
 * @param waypoints - Centerline waypoints in world coordinates.
 * @param cornerRadius - Requested bend radius in world units.
 * @returns Array of reductions (empty if no corners were reduced).
 */
export function checkBendRadiusReductions(
  waypoints: Point[],
  cornerRadius: number,
): BendReduction[] {
  const n = waypoints.length;
  if (n < 3 || cornerRadius <= 0) return [];

  // Pre-compute segment lengths
  const segLengths: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = waypoints[i + 1].x - waypoints[i].x;
    const dy = waypoints[i + 1].y - waypoints[i].y;
    segLengths.push(Math.sqrt(dx * dx + dy * dy));
  }

  const numCorners = n - 2;

  // Pass 1: compute turn angles and ideal setbacks
  const turnAngles: (number | null)[] = [];
  for (let i = 1; i < n - 1; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i];
    const next = waypoints[i + 1];

    const inLen = segLengths[i - 1];
    const outLen = segLengths[i];
    if (inLen < 1e-10 || outLen < 1e-10) {
      turnAngles.push(null);
      continue;
    }

    const inX = (curr.x - prev.x) / inLen;
    const inY = (curr.y - prev.y) / inLen;
    const outX = (next.x - curr.x) / outLen;
    const outY = (next.y - curr.y) / outLen;

    const cross = inX * outY - inY * outX;
    const dot = inX * outX + inY * outY;
    const turnAngle = Math.atan2(cross, dot);

    turnAngles.push(Math.abs(turnAngle) < 1e-6 ? null : turnAngle);
  }

  const setbacks: number[] = turnAngles.map((ta) => {
    if (ta === null) return 0;
    return cornerRadius * Math.tan(Math.abs(ta) / 2);
  });

  // Pass 2: resolve conflicts (iterative)
  for (let _iter = 0; _iter < 3; _iter++) {
    for (let k = 0; k < segLengths.length; k++) {
      const capacity = segLengths[k] * 0.95;
      const outCorner = k > 0 ? k - 1 : null;
      const inCorner = k < numCorners ? k : null;

      const outClaim = outCorner !== null ? setbacks[outCorner] : 0;
      const inClaim = inCorner !== null ? setbacks[inCorner] : 0;

      const total = outClaim + inClaim;
      if (total > capacity && total > 1e-10) {
        const scale = capacity / total;
        if (outCorner !== null) {
          setbacks[outCorner] = Math.min(setbacks[outCorner], outClaim * scale);
        }
        if (inCorner !== null) {
          setbacks[inCorner] = Math.min(setbacks[inCorner], inClaim * scale);
        }
      }
    }
  }

  // Report reductions
  const reductions: BendReduction[] = [];
  for (let c = 0; c < numCorners; c++) {
    const ta = turnAngles[c];
    if (ta === null) continue;

    const halfAngle = Math.abs(ta) / 2;
    const tanHalf = Math.tan(halfAngle);
    if (Math.abs(tanHalf) < 1e-10) continue;

    const actualRadius = setbacks[c] / tanHalf;
    if (actualRadius < cornerRadius - 1e-6) {
      reductions.push({
        cornerIndex: c + 1, // 1-based
        requested: cornerRadius,
        actual: actualRadius,
      });
    }
  }

  return reductions;
}

/**
 * Generate a ribbon polygon outline from a path centerline and width.
 *
 * When `cornerRadius > 0`, the centerline is first densified with circular
 * arc points at each interior corner, producing smooth bends in the preview.
 * The actual stored geometry uses the Rust `create_path_rounded` function.
 *
 * @param pathPoints - Centerline waypoints.
 * @param width - Path width in world units.
 * @param cornerRadius - Bend radius in world units (0 = sharp corners).
 * @param numArcPoints - Maximum arc points per corner (higher = smoother).
 * @returns Array of outline points forming a closed polygon, or empty if < 2 points.
 */
export function createRibbonPreview(
  pathPoints: Point[],
  width: number,
  cornerRadius: number = 0,
  numArcPoints: number = 64,
): Point[] {
  // Densify centerline if corner radius is set
  const smoothed =
    cornerRadius > 0
      ? densifyCenterlineWithArcs(pathPoints, cornerRadius, numArcPoints)
      : pathPoints;
  if (smoothed.length < 2) return [];

  const hw = width / 2;
  const n = smoothed.length;
  const leftPoints: Point[] = [];
  const rightPoints: Point[] = [];

  for (let i = 0; i < n; i++) {
    const curr = smoothed[i];

    if (i === 0) {
      // First point: perpendicular to first segment
      const next = smoothed[1];
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
      const prev = smoothed[n - 2];
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
      const prev = smoothed[i - 1];
      const next = smoothed[i + 1];

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
