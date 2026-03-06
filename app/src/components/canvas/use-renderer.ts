import { useState, useEffect, useCallback, useRef } from "react";
import { useWasm } from "@/hooks/use-wasm";
import { HOVER_COLORS, SELECTION_COLORS, useUIStore } from "@/stores/ui";
import { useViewportStore } from "@/stores/viewport";
import type { WasmRenderer } from "@/wasm/rosette_wasm";

/**
 * Convert hex color to RGBA floats for WASM.
 */
function hexToRgba(hex: string): [number, number, number, number] {
  const cleanHex = hex.replace("#", "");
  const r = Number.parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = Number.parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = Number.parseInt(cleanHex.slice(4, 6), 16) / 255;
  return [r, g, b, 1.0];
}

/**
 * Hook to create and manage the WASM renderer.
 *
 * @param canvasId - The DOM id of the canvas element, or null to skip creation.
 */
export function useRenderer(canvasId: string | null) {
  const { wasm, isReady: wasmReady } = useWasm();
  const [renderer, setRenderer] = useState<WasmRenderer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Ref to track renderer for cleanup (state may be stale in cleanup function)
  const rendererRef = useRef<WasmRenderer | null>(null);

  const theme = useUIStore((s) => s.theme);
  const showGrid = useUIStore((s) => s.showGrid);
  const { zoom, offset } = useViewportStore();

  // Initialize renderer
  useEffect(() => {
    // Wait for both WASM and canvas to be ready
    if (!wasmReady || !wasm || !canvasId) return;

    let mounted = true;

    async function initRenderer() {
      try {
        const r = await wasm!.WasmRenderer.create(canvasId!);

        if (!mounted) {
          // Component unmounted during async init - clean up orphaned renderer
          r.destroy();
          return;
        }

        r.set_theme(theme === "dark");
        // Set selection color based on theme
        const selectionColor = SELECTION_COLORS[theme];
        const [sr, sg, sb, sa] = hexToRgba(selectionColor);
        r.set_selection_color(sr, sg, sb, sa);
        // Set hover color based on theme
        const hoverColor = HOVER_COLORS[theme];
        const [hr, hg, hb, ha] = hexToRgba(hoverColor);
        r.set_hover_color(hr, hg, hb, ha);
        // Set device pixel ratio for proper HiDPI scaling
        r.set_dpr(window.devicePixelRatio || 1);
        rendererRef.current = r;
        setRenderer(r);
        setIsReady(true);
      } catch (e) {
        console.error("Failed to create renderer:", e);
        if (mounted) {
          setError(e as Error);
        }
      }
    }

    initRenderer();

    return () => {
      mounted = false;
      // Clean up GPU resources when unmounting
      if (rendererRef.current) {
        rendererRef.current.destroy();
        rendererRef.current = null;
      }
    };
    // theme is intentionally NOT in deps - we use set_theme() to update it
    // without recreating the entire renderer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wasmReady, wasm, canvasId]);

  // Update theme and outline colors when theme changes
  useEffect(() => {
    if (renderer && isReady) {
      renderer.set_theme(theme === "dark");
      // Update selection color based on theme
      const selectionColor = SELECTION_COLORS[theme];
      const [sr, sg, sb, sa] = hexToRgba(selectionColor);
      renderer.set_selection_color(sr, sg, sb, sa);
      // Update hover color based on theme
      const hoverColor = HOVER_COLORS[theme];
      const [hr, hg, hb, ha] = hexToRgba(hoverColor);
      renderer.set_hover_color(hr, hg, hb, ha);
    }
  }, [renderer, isReady, theme]);

  // Update grid visibility when toggled
  useEffect(() => {
    if (renderer && isReady) {
      renderer.set_grid_visible(showGrid);
    }
  }, [renderer, isReady, showGrid]);

  // Update viewport when zoom/offset changes
  // Scale by devicePixelRatio for HiDPI/retina display support
  useEffect(() => {
    if (renderer && isReady) {
      const dpr = window.devicePixelRatio || 1;
      renderer.set_viewport(offset.x * dpr, offset.y * dpr, zoom * dpr);
    }
  }, [renderer, isReady, zoom, offset.x, offset.y]);

  // Render function
  const render = useCallback(() => {
    if (renderer && isReady) {
      renderer.render();
    }
  }, [renderer, isReady]);

  // Resize handler - also updates DPR in case it changed (e.g., moving between monitors)
  const resize = useCallback(
    (width: number, height: number) => {
      if (renderer && isReady) {
        renderer.set_dpr(window.devicePixelRatio || 1);
        renderer.resize(width, height);
      }
    },
    [renderer, isReady],
  );

  // Screen to world conversion
  // Input is in CSS pixels, scales to physical pixels for renderer
  const screenToWorld = useCallback(
    (screenX: number, screenY: number): { x: number; y: number } | null => {
      if (renderer && isReady) {
        const dpr = window.devicePixelRatio || 1;
        const result = renderer.screen_to_world(screenX * dpr, screenY * dpr);
        return { x: result[0], y: result[1] };
      }
      return null;
    },
    [renderer, isReady],
  );

  return {
    renderer,
    isReady,
    error,
    render,
    resize,
    screenToWorld,
  };
}
