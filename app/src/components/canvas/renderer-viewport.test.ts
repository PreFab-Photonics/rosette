import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ZOOM, useViewportStore } from "@/stores/viewport";
import { subscribeRendererToViewport } from "./renderer-viewport";

describe("subscribeRendererToViewport", () => {
  afterEach(() => {
    useViewportStore.setState({
      zoom: DEFAULT_ZOOM,
      offset: { x: 0, y: 0 },
      initialized: false,
    });
  });

  it("updates the renderer directly for viewport changes", () => {
    useViewportStore.setState({ zoom: 0.5, offset: { x: 10, y: 20 } });
    const setViewport = vi.fn();
    const unsubscribe = subscribeRendererToViewport({ set_viewport: setViewport }, () => 2);

    expect(setViewport).toHaveBeenLastCalledWith(20, 40, 1);

    useViewportStore.getState().zoomAt(2, 30, 40);
    expect(setViewport).toHaveBeenLastCalledWith(-20, 0, 2);

    const callCount = setViewport.mock.calls.length;
    useViewportStore.setState({ initialized: true });
    expect(setViewport).toHaveBeenCalledTimes(callCount);

    unsubscribe();
    useViewportStore.getState().pan(5, 5);
    expect(setViewport).toHaveBeenCalledTimes(callCount);
  });
});
