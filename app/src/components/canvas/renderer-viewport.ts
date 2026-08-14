import { useViewportStore } from "@/stores/viewport";
import type { WasmRenderer } from "@/wasm/rosette_wasm";

/** Keep WebGPU viewport updates independent of React's commit cadence. */
export function applyRendererViewport(
  renderer: Pick<WasmRenderer, "set_viewport">,
  getDpr: () => number = () => window.devicePixelRatio || 1,
): void {
  const state = useViewportStore.getState();
  const dpr = getDpr();
  renderer.set_viewport(state.offset.x * dpr, state.offset.y * dpr, state.zoom * dpr);
}

/** Keep WebGPU viewport updates independent of React's commit cadence. */
export function subscribeRendererToViewport(
  renderer: Pick<WasmRenderer, "set_viewport">,
  getDpr: () => number = () => window.devicePixelRatio || 1,
): () => void {
  applyRendererViewport(renderer, getDpr);
  return useViewportStore.subscribe((state, previousState) => {
    if (
      state.zoom === previousState.zoom &&
      state.offset.x === previousState.offset.x &&
      state.offset.y === previousState.offset.y
    ) {
      return;
    }
    applyRendererViewport(renderer, getDpr);
  });
}
