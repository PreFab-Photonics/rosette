import { useEffect, useRef, useCallback } from "react";
import { useLaserStore, type LaserPoint } from "@/stores/laser";
import { useToolStore } from "@/stores/tool";
import type { WasmRenderer } from "@/wasm/rosette_wasm";

/** Laser fade duration in milliseconds (matches rosette-web). */
const FADE_DURATION = 300;

/** Number of interpolation steps between each pair of control points. */
const SMOOTHING_STEPS = 16;

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
      // Smooth the path using quadratic Bezier interpolation
      const smoothedPoints = smoothPath(points);

      // Scale by DPR for HiDPI displays
      const dpr = window.devicePixelRatio || 1;

      // Flatten points array for WASM (scaled to physical pixels)
      const flatPoints = new Float64Array(smoothedPoints.length * 2);
      for (let i = 0; i < smoothedPoints.length; i++) {
        flatPoints[i * 2] = smoothedPoints[i].x * dpr;
        flatPoints[i * 2 + 1] = smoothedPoints[i].y * dpr;
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
