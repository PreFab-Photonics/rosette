import { useState, useEffect, useCallback, useRef } from "react";
import { useWasm } from "@/hooks/use-wasm";
import { useUIStore } from "@/stores/ui";
import { useViolationsStore } from "@/stores/violations";
import type { WasmRenderer } from "@/wasm/rosette_wasm";
import { applyRendererViewport, subscribeRendererToViewport } from "./renderer-viewport";
import { applyRendererTheme } from "./renderer-theme";

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
  const violations = useViolationsStore((s) => s.violations);
  const selectedViolation = useViolationsStore((s) => s.selectedIndex);

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

        applyRendererTheme(r);
        // Set device pixel ratio for proper HiDPI scaling
        r.set_dpr(window.devicePixelRatio || 1);
        if (import.meta.env.DEV) {
          r.set_diagnostics_enabled(true);
        }
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
    // Theme is intentionally not in deps; it updates the existing renderer below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wasmReady, wasm, canvasId]);

  // Update concrete renderer colors when the resolved document theme changes.
  useEffect(() => {
    if (renderer && isReady) {
      applyRendererTheme(renderer);
    }
  }, [renderer, isReady, theme]);

  // Update grid visibility when toggled
  useEffect(() => {
    if (renderer && isReady) {
      renderer.set_grid_visible(showGrid);
    }
  }, [renderer, isReady, showGrid]);

  // Sync DRC violation markers to the renderer. Each violation is flattened to
  // [minX, minY, maxX, maxY, severity] where severity is 1 (error) or 0
  // (warning). Coordinates are passed in micrometers; the renderer's
  // set_violations converts them to world units (scaled, Y negated).
  useEffect(() => {
    if (!(renderer && isReady)) return;
    const data = new Float32Array(violations.length * 5);
    violations.forEach((v, i) => {
      const [[minX, minY], [maxX, maxY]] = v.bbox;
      data[i * 5 + 0] = minX;
      data[i * 5 + 1] = minY;
      data[i * 5 + 2] = maxX;
      data[i * 5 + 3] = maxY;
      data[i * 5 + 4] = v.severity === "error" ? 1 : 0;
    });
    renderer.set_violations(data);
  }, [renderer, isReady, violations]);

  // Emphasize the violation currently selected in the panel.
  useEffect(() => {
    if (!(renderer && isReady)) return;
    renderer.set_selected_violation(selectedViolation ?? undefined);
  }, [renderer, isReady, selectedViolation]);

  // Update the renderer synchronously with the store. Routing this through a
  // React effect makes rapid zoom depend on React's commit cadence even though
  // the renderer already coalesces updates in its requestAnimationFrame loop.
  useEffect(() => {
    if (!(renderer && isReady)) return;
    return subscribeRendererToViewport(renderer);
  }, [renderer, isReady]);

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
        applyRendererViewport(renderer);
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
