import { useEffect, useRef, useCallback } from "react";
import { useLaserStore, type LaserPoint } from "@/stores/laser";
import { useToolStore } from "@/stores/tool";
import type { WasmRenderer } from "@/wasm/rosette_wasm";

/** Laser fade duration in milliseconds (matches rosette-web). */
const FADE_DURATION = 300;

/** Number of interpolation steps between each pair of control points. */
const SMOOTHING_STEPS = 16;

/**
 * Half-window size for the moving-average filter applied to raw input points.
 * A value of 2 means each point is averaged with its 2 neighbors on each side
 * (5-point window), which smooths out mouse jitter without adding noticeable lag.
 */
const FILTER_RADIUS = 2;

/**
 * Target spacing (in CSS pixels) for arc-length resampling.
 * After smoothing, the path is resampled at uniform intervals of this distance.
 * This ensures consistent point density (and therefore consistent visual thickness)
 * regardless of mouse speed.
 */
const RESAMPLE_SPACING = 2.5;

/**
 * Compute a point on a quadratic Bezier curve.
 */
function quadraticBezier(p0: LaserPoint, p1: LaserPoint, p2: LaserPoint, t: number): LaserPoint {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}

/**
 * Apply a moving-average filter to de-jitter raw input points.
 *
 * Each point is replaced by the average of itself and its neighbors within
 * the given radius. The first and last points are preserved exactly so the
 * trail endpoints stay anchored to the actual mouse positions.
 */
function filterPoints(points: LaserPoint[]): LaserPoint[] {
  if (points.length <= 2) return points;

  const filtered: LaserPoint[] = [points[0]];

  for (let i = 1; i < points.length - 1; i++) {
    const lo = Math.max(0, i - FILTER_RADIUS);
    const hi = Math.min(points.length - 1, i + FILTER_RADIUS);
    let sx = 0;
    let sy = 0;
    const count = hi - lo + 1;
    for (let j = lo; j <= hi; j++) {
      sx += points[j].x;
      sy += points[j].y;
    }
    filtered.push({ x: sx / count, y: sy / count });
  }

  filtered.push(points[points.length - 1]);
  return filtered;
}

/**
 * Smooth a path using quadratic Bezier curves (same algorithm as rosette-web).
 * Creates smooth curves through midpoints between consecutive points.
 */
function smoothPath(points: LaserPoint[]): LaserPoint[] {
  if (points.length < 3) {
    return points;
  }

  const smoothed: LaserPoint[] = [points[0]];

  for (let i = 1; i < points.length - 1; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];

    // Midpoint between p0 and p1 (start of curve)
    const start = {
      x: (p0.x + p1.x) / 2,
      y: (p0.y + p1.y) / 2,
    };

    // Midpoint between p1 and p2 (end of curve)
    const end = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };

    // Add start point if this is the first curve segment
    if (i === 1) {
      smoothed.push(start);
    }

    // Interpolate along the quadratic curve from start to end with p1 as control point
    for (let step = 1; step <= SMOOTHING_STEPS; step++) {
      const t = step / SMOOTHING_STEPS;
      smoothed.push(quadraticBezier(start, p1, end, t));
    }
  }

  // Add the last point
  smoothed.push(points[points.length - 1]);

  return smoothed;
}

/**
 * Resample a polyline at uniform arc-length intervals.
 *
 * Walks along the polyline and emits a new point every `RESAMPLE_SPACING`
 * pixels. This guarantees consistent segment density regardless of how fast
 * or slow the mouse was moving, eliminating the thick/thin visual variation
 * caused by uneven alpha accumulation at segment overlaps.
 *
 * The first and last points are always included.
 */
function resampleByArcLength(points: LaserPoint[]): LaserPoint[] {
  if (points.length < 2) return points;

  const result: LaserPoint[] = [points[0]];

  // Track how much distance we've "used" along the current input segment
  let carry = 0;
  let prev = points[0];

  for (let i = 1; i < points.length; i++) {
    const curr = points[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const segLen = Math.sqrt(dx * dx + dy * dy);

    if (segLen < 1e-6) {
      prev = curr;
      continue;
    }

    // Direction unit vector for this input segment
    const ux = dx / segLen;
    const uy = dy / segLen;

    // Distance along this segment where we start placing output points
    let walked = RESAMPLE_SPACING - carry;

    while (walked <= segLen) {
      result.push({
        x: prev.x + ux * walked,
        y: prev.y + uy * walked,
      });
      walked += RESAMPLE_SPACING;
    }

    // How much of the spacing budget is left over for the next segment
    carry = segLen - (walked - RESAMPLE_SPACING);
    prev = curr;
  }

  // Always include the very last point so the trail reaches the cursor
  const last = points[points.length - 1];
  const lastResult = result[result.length - 1];
  const dxEnd = last.x - lastResult.x;
  const dyEnd = last.y - lastResult.y;
  if (Math.sqrt(dxEnd * dxEnd + dyEnd * dyEnd) > 0.5) {
    result.push(last);
  }

  return result;
}

/**
 * Hook to manage laser pointer interactions and sync with renderer.
 *
 * Handles:
 * - Mouse events when laser tool is active
 * - Sending points to WASM renderer
 * - Fade animation on mouse up
 *
 * @param renderer - The WASM renderer instance (or null if not ready).
 * @param isReady - Whether the renderer is ready.
 */
export function useLaser(renderer: WasmRenderer | null, isReady: boolean) {
  const activeTool = useToolStore((s) => s.activeTool);
  const { points, opacity, isDrawing, addPoint, startDrawing, stopDrawing, setOpacity, reset } =
    useLaserStore();

  // Track fade animation
  const fadeStartTime = useRef<number | null>(null);
  const fadeAnimationId = useRef<number | null>(null);

  // Send points to renderer whenever they change
  // Scale by devicePixelRatio for HiDPI/retina display support
  useEffect(() => {
    if (!renderer || !isReady) return;

    if (points.length === 0) {
      renderer.clear_laser();
    } else {
      // Pipeline: raw points → moving-average filter → Bezier smooth → arc-length resample
      const filtered = filterPoints(points);
      const smoothed = smoothPath(filtered);
      const resampled = resampleByArcLength(smoothed);

      // Scale by DPR for HiDPI displays
      const dpr = window.devicePixelRatio || 1;

      // Flatten points array for WASM (scaled to physical pixels)
      const flatPoints = new Float64Array(resampled.length * 2);
      for (let i = 0; i < resampled.length; i++) {
        flatPoints[i * 2] = resampled[i].x * dpr;
        flatPoints[i * 2 + 1] = resampled[i].y * dpr;
      }
      renderer.set_laser_points(flatPoints);
    }
  }, [renderer, isReady, points]);

  // Send opacity to renderer
  useEffect(() => {
    if (!renderer || !isReady) return;
    renderer.set_laser_opacity(opacity);
  }, [renderer, isReady, opacity]);

  // Start fade animation
  const startFade = useCallback(() => {
    // Cancel any existing animation
    if (fadeAnimationId.current !== null) {
      cancelAnimationFrame(fadeAnimationId.current);
    }

    fadeStartTime.current = performance.now();

    const animate = (currentTime: number) => {
      if (fadeStartTime.current === null) return;

      const elapsed = currentTime - fadeStartTime.current;
      const progress = Math.min(elapsed / FADE_DURATION, 1);

      if (progress >= 1) {
        // Animation complete
        fadeStartTime.current = null;
        fadeAnimationId.current = null;
        reset();
        return;
      }

      // Update opacity
      setOpacity(1 - progress);
      fadeAnimationId.current = requestAnimationFrame(animate);
    };

    fadeAnimationId.current = requestAnimationFrame(animate);
  }, [reset, setOpacity]);

  // Handle mouse down
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (activeTool !== "laser" || e.button !== 0) return;

      // Cancel any ongoing fade
      if (fadeAnimationId.current !== null) {
        cancelAnimationFrame(fadeAnimationId.current);
        fadeAnimationId.current = null;
        fadeStartTime.current = null;
      }

      startDrawing();
      addPoint({ x: e.clientX, y: e.clientY });
    },
    [activeTool, startDrawing, addPoint],
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (activeTool !== "laser" || !isDrawing) return;
      addPoint({ x: e.clientX, y: e.clientY });
    },
    [activeTool, isDrawing, addPoint],
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (activeTool !== "laser" || !isDrawing) return;
    stopDrawing();
    startFade();
  }, [activeTool, isDrawing, stopDrawing, startFade]);

  // Cleanup on unmount or tool change
  useEffect(() => {
    return () => {
      if (fadeAnimationId.current !== null) {
        cancelAnimationFrame(fadeAnimationId.current);
      }
    };
  }, []);

  // Reset laser when switching away from laser tool
  useEffect(() => {
    if (activeTool !== "laser") {
      if (fadeAnimationId.current !== null) {
        cancelAnimationFrame(fadeAnimationId.current);
        fadeAnimationId.current = null;
        fadeStartTime.current = null;
      }
      reset();
    }
  }, [activeTool, reset]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isLaserActive: activeTool === "laser",
  };
}
