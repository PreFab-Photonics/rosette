import { useEffect, useState, type RefObject } from "react";
import type { WasmRenderer } from "@/wasm/rosette_wasm";

interface RenderStatsProps {
  renderer: Pick<
    WasmRenderer,
    | "get_border_segment_count"
    | "get_presented_frame_count"
    | "get_render_cpu_time_ms"
    | "get_sample_count"
    | "get_triangle_count"
    | "shape_count"
  >;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

interface Stats {
  rafFps: number;
  presentedFps: number;
  presentedFrames: number;
  cpuFrameMs: number | null;
  sampleCount: number;
  shapes: number;
  triangles: number;
  borderSegments: number;
  canvasWidth: number;
  canvasHeight: number;
  dpr: number;
}

const SAMPLE_INTERVAL_MS = 1000;

export function RenderStats({ renderer, canvasRef }: RenderStatsProps) {
  const initialCanvas = canvasRef.current;
  const [stats, setStats] = useState<Stats>(() => ({
    rafFps: 0,
    presentedFps: 0,
    presentedFrames: renderer.get_presented_frame_count(),
    cpuFrameMs: null,
    sampleCount: renderer.get_sample_count(),
    shapes: renderer.shape_count(),
    triangles: renderer.get_triangle_count(),
    borderSegments: renderer.get_border_segment_count(),
    canvasWidth: initialCanvas?.width ?? 0,
    canvasHeight: initialCanvas?.height ?? 0,
    dpr: window.devicePixelRatio || 1,
  }));

  useEffect(() => {
    let animationFrame = 0;
    let sampleStartedAt: number | null = null;
    let rafFrames = 0;
    let lastPresentedFrames = renderer.get_presented_frame_count();
    let lastRenderCpuTimeMs = renderer.get_render_cpu_time_ms();

    const tick = (timestamp: number) => {
      if (sampleStartedAt === null) {
        sampleStartedAt = timestamp;
        animationFrame = requestAnimationFrame(tick);
        return;
      }

      rafFrames += 1;

      const elapsed = timestamp - sampleStartedAt;
      if (elapsed >= SAMPLE_INTERVAL_MS) {
        const presentedFrames = renderer.get_presented_frame_count();
        const presentedDelta = (presentedFrames - lastPresentedFrames) >>> 0;
        const renderCpuTimeMs = renderer.get_render_cpu_time_ms();
        const canvas = canvasRef.current;

        setStats({
          rafFps: Math.round((rafFrames * 1000) / elapsed),
          presentedFps: Math.round((presentedDelta * 1000) / elapsed),
          presentedFrames,
          cpuFrameMs:
            presentedDelta > 0
              ? Math.max(0, renderCpuTimeMs - lastRenderCpuTimeMs) / presentedDelta
              : null,
          sampleCount: renderer.get_sample_count(),
          shapes: renderer.shape_count(),
          triangles: renderer.get_triangle_count(),
          borderSegments: renderer.get_border_segment_count(),
          canvasWidth: canvas?.width ?? 0,
          canvasHeight: canvas?.height ?? 0,
          dpr: window.devicePixelRatio || 1,
        });

        sampleStartedAt = timestamp;
        rafFrames = 0;
        lastPresentedFrames = presentedFrames;
        lastRenderCpuTimeMs = renderCpuTimeMs;
      }

      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [renderer, canvasRef]);

  return (
    <aside
      aria-label="Render statistics"
      className="pointer-events-none absolute bottom-3 left-3 z-30 rounded-md border border-theme-border bg-surface-translucent font-mono text-[10px] leading-none text-foreground-secondary shadow-sm backdrop-blur-sm select-none"
    >
      <details className="group">
        <summary
          aria-label="Toggle render details"
          className="pointer-events-auto flex cursor-pointer list-none items-center gap-2 px-2 py-1 [&::-webkit-details-marker]:hidden"
          onKeyDown={(event) => event.stopPropagation()}
        >
          <span>RAF {stats.rafFps}</span>
          <span>renders {stats.presentedFps}/s</span>
          <span title="Average CPU time for frames presented during the last sample">
            CPU {stats.cpuFrameMs === null ? "--" : `${stats.cpuFrameMs.toFixed(2)} ms`}
          </span>
          <span>MSAA {stats.sampleCount}x</span>
          <span aria-hidden="true" className="text-foreground-muted group-open:hidden">
            +
          </span>
          <span aria-hidden="true" className="hidden text-foreground-muted group-open:inline">
            -
          </span>
        </summary>
        <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 border-t border-theme-border px-2 py-1.5 text-foreground-muted">
          <span>frames</span>
          <span className="text-right text-foreground-secondary">
            {stats.presentedFrames.toLocaleString()}
          </span>
          <span>render polys</span>
          <span className="text-right text-foreground-secondary">
            {stats.shapes.toLocaleString()}
          </span>
          <span>fill tris</span>
          <span className="text-right text-foreground-secondary">
            {stats.triangles.toLocaleString()}
          </span>
          <span>default border segs</span>
          <span className="text-right text-foreground-secondary">
            {stats.borderSegments.toLocaleString()}
          </span>
          <span>canvas</span>
          <span className="text-right text-foreground-secondary">
            {stats.canvasWidth} x {stats.canvasHeight}
          </span>
          <span>DPR</span>
          <span className="text-right text-foreground-secondary">{stats.dpr.toFixed(2)}x</span>
        </div>
      </details>
    </aside>
  );
}
