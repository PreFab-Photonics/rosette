import type { WasmLibrary } from "@/wasm/rosette_wasm";

/** Hit test against exact geometry or its two-pixel low-zoom proxy. */
export function hitTestLayout(
  library: WasmLibrary,
  x: number,
  y: number,
  zoom: number,
): string | undefined {
  const proxyHalfSize = Number.isFinite(zoom) && zoom > 0 ? 1 / zoom : 0;
  return library.hit_test_with_tolerance(x, y, proxyHalfSize);
}
