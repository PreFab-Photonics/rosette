import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RenderStats } from "./RenderStats";

describe("RenderStats", () => {
  let container: HTMLDivElement;
  let root: Root;
  let nextFrame: FrameRequestCallback | null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    nextFrame = null;

    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        nextFrame = callback;
        return 1;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  });

  it("separates RAF cadence from presented frames", () => {
    let presentedFrames = 10;
    let renderCpuTimeMs = 1;
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1200;
    const renderer = {
      get_border_segment_count: () => 24,
      get_presented_frame_count: () => presentedFrames,
      get_render_cpu_time_ms: () => renderCpuTimeMs,
      get_sample_count: () => 4,
      get_triangle_count: () => 18,
      shape_count: () => 6,
    };

    act(() => root.render(<RenderStats renderer={renderer} canvasRef={{ current: canvas }} />));

    act(() => nextFrame?.(0));
    presentedFrames = 12;
    act(() => nextFrame?.(500));
    presentedFrames = 15;
    renderCpuTimeMs = 6;
    act(() => nextFrame?.(1000));

    expect(container.textContent).toContain("RAF 2");
    expect(container.textContent).toContain("renders 5/s");
    expect(container.textContent).toContain("CPU 1.00 ms");
    expect(container.textContent).toContain("MSAA 4x");
    expect(container.textContent).toContain("frames15");
    expect(container.textContent).toContain("render polys6");
    expect(container.textContent).toContain("fill tris18");
    expect(container.textContent).toContain("default border segs24");
    expect(container.textContent).toContain("canvas1600 x 1200");

    const details = container.querySelector("details");
    const summary = container.querySelector("summary");
    expect(details?.open).toBe(false);
    act(() => summary?.click());
    expect(details?.open).toBe(true);

    const windowKeyDown = vi.fn();
    window.addEventListener("keydown", windowKeyDown);
    act(() =>
      summary?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })),
    );
    window.removeEventListener("keydown", windowKeyDown);
    expect(windowKeyDown).not.toHaveBeenCalled();
  });
});
