"use client";

import { useCallback, useEffect, useRef } from "react";

/* ── Constants matching the viewer (grid.rs / viewport.ts) ───────────────── */

/** World-unit spacing between grid points at zoom = 1. */
const GRID_SIZE = 50;
/** Every Nth point is a major point. */
const MAJOR_INTERVAL = 5;
/** Base dot radius in CSS pixels. */
const DOT_RADIUS = 1.2;

/* ── LOD helpers (port of grid.rs) ───────────────────────────────────────── */

/** Returns skip factor: 1, 5, 25, 125, … based on zoom level. */
function calculateSkipFactor(zoom: number): number {
  if (zoom >= 1) return 1;
  const zoomLevel = Math.floor(Math.log(1 / zoom) / Math.log(5));
  return Math.pow(5, Math.max(0, zoomLevel));
}

/** Smooth fade between LOD levels (0..1). */
function calculateFadeOpacity(zoom: number): number {
  if (zoom >= 1) return 1;
  if (zoom <= 0) return 0;
  const currentLevel = Math.log(1 / zoom) / Math.log(5);
  const nextThreshold = Math.ceil(currentLevel);
  const fadeProgress = nextThreshold - currentLevel;
  return Math.min(1, fadeProgress * 0.8);
}

/* ── Message protocol ────────────────────────────────────────────────────── */

interface ViewportMsg {
  type: "rosette-viewport";
  zoom: number;
  offsetX: number;
  offsetY: number;
}

function isViewportMsg(data: unknown): data is ViewportMsg {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as ViewportMsg).type === "rosette-viewport"
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */

/**
 * Full-page canvas that renders a dot grid synced with the embedded viewer's
 * camera.  Implements the same LOD skip-factor logic as the Rust renderer so
 * the dots line up perfectly and appear at the right density.
 */
export function SyncedDotGrid({
  iframeRef,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const canvasSizeRef = useRef<{ w: number; h: number; dpr: number }>({
    w: 0,
    h: 0,
    dpr: 1,
  });

  // Viewer viewport state (CSS pixels from the iframe's Zustand store)
  const viewportRef = useRef<{
    zoom: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const iframe = iframeRef.current;
    const viewport = viewportRef.current;
    if (!canvas || !iframe || !viewport) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Only resize canvas when dimensions actually change
    const cached = canvasSizeRef.current;
    if (cached.w !== w || cached.h !== h || cached.dpr !== dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvasSizeRef.current = { w, h, dpr };
    }

    // Reset transform and clear (scale resets when canvas resizes,
    // but is a no-op when dimensions haven't changed)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // iframe position in viewport coordinates (canvas is fixed, so matches)
    const iframeRect = iframe.getBoundingClientRect();
    const iframeLeft = iframeRect.left;
    const iframeTop = iframeRect.top;
    const iframeCenterX = iframeLeft + iframeRect.width / 2;
    const iframeCenterY = iframeTop + iframeRect.height / 2;

    const { zoom, offsetX, offsetY } = viewport;

    // ── LOD: compute effective spacing with skip factor ──────────────────
    const skipFactor = calculateSkipFactor(zoom);
    const fadeOpacity = calculateFadeOpacity(zoom);

    // Effective spacing in CSS pixels between rendered dots
    const spacing = GRID_SIZE * skipFactor * zoom;

    // Don't draw if spacing still too small
    if (spacing < 6) return;

    // Viewer origin in viewport coordinates
    const ox = iframeLeft + offsetX;
    const oy = iframeTop + offsetY;

    // Align grid start to skip-factor-aligned positions (like grid.rs)
    const alignedSpacing = GRID_SIZE * skipFactor;

    // Calculate range in world-aligned grid indices
    const worldStartX = (0 - ox) / zoom;
    const worldEndX = (w - ox) / zoom;
    const worldStartY = (0 - oy) / zoom;
    const worldEndY = (h - oy) / zoom;

    const alignedStartX =
      Math.floor(worldStartX / alignedSpacing) * alignedSpacing;
    const alignedEndX =
      Math.ceil(worldEndX / alignedSpacing) * alignedSpacing;
    const alignedStartY =
      Math.floor(worldStartY / alignedSpacing) * alignedSpacing;
    const alignedEndY =
      Math.ceil(worldEndY / alignedSpacing) * alignedSpacing;

    // Count to cap
    const countX =
      Math.round((alignedEndX - alignedStartX) / alignedSpacing) + 1;
    const countY =
      Math.round((alignedEndY - alignedStartY) / alignedSpacing) + 1;
    if (countX * countY > 60000) return;

    const isDark = document.documentElement.classList.contains("dark");

    // Fade distance from iframe center
    const fadeRadius = Math.max(iframeRect.width, iframeRect.height) * 1.4;

    // Draw dots
    for (let wx = alignedStartX; wx <= alignedEndX; wx += alignedSpacing) {
      for (let wy = alignedStartY; wy <= alignedEndY; wy += alignedSpacing) {
        // Screen position
        const sx = wx * zoom + ox;
        const sy = wy * zoom + oy;

        // Skip dots inside the iframe (the viewer renders its own)
        if (
          sx >= iframeLeft - 1 &&
          sx <= iframeLeft + iframeRect.width + 1 &&
          sy >= iframeTop - 1 &&
          sy <= iframeTop + iframeRect.height + 1
        ) {
          continue;
        }

        // Radial fade from iframe center
        const dx = sx - iframeCenterX;
        const dy = sy - iframeCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radialFade = Math.max(0, 1 - dist / fadeRadius);
        if (radialFade <= 0) continue;

        // Major vs minor: a dot is major if its world-space index is
        // divisible by (MAJOR_INTERVAL * skipFactor * GRID_SIZE)
        const majorSpacing = MAJOR_INTERVAL * alignedSpacing;
        const isMajorX = Math.abs(wx % majorSpacing) < 0.5;
        const isMajorY = Math.abs(wy % majorSpacing) < 0.5;
        const isMajor = isMajorX && isMajorY;

        // Opacity: base * LOD fade * radial fade
        const themeOpacity = isDark ? 0.5 : 0.8;
        const baseAlpha = isMajor
          ? 0.8 * themeOpacity
          : 0.8 * fadeOpacity * themeOpacity;
        const alpha = baseAlpha * radialFade * radialFade; // quadratic falloff

        if (alpha < 0.01) continue;

        const color = isDark
          ? `rgba(255,255,255,${alpha})`
          : `rgba(0,0,0,${alpha})`;

        ctx.fillStyle = color;
        ctx.fillRect(
          sx - DOT_RADIUS,
          sy - DOT_RADIUS,
          DOT_RADIUS * 2,
          DOT_RADIUS * 2,
        );
      }
    }
  }, [iframeRef]);

  // Schedule a draw on the next animation frame (coalesces multiple calls)
  const scheduleRedraw = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  // Listen for viewport messages from the iframe — schedule draw directly,
  // no React state update needed since we draw imperatively on canvas.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Only accept messages from our own iframe
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (!isViewportMsg(e.data)) return;

      viewportRef.current = {
        zoom: e.data.zoom,
        offsetX: e.data.offsetX,
        offsetY: e.data.offsetY,
      };
      scheduleRedraw();
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [iframeRef, scheduleRedraw]);

  // Redraw on resize and scroll (iframe moves relative to fixed canvas)
  useEffect(() => {
    window.addEventListener("resize", scheduleRedraw);
    window.addEventListener("scroll", scheduleRedraw, { passive: true });
    return () => {
      window.removeEventListener("resize", scheduleRedraw);
      window.removeEventListener("scroll", scheduleRedraw);
    };
  }, [scheduleRedraw]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
