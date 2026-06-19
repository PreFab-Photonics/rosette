import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";
import { GRID_SIZE } from "@/stores/viewport";
import { useWasmContextStore } from "@/stores/wasm-context";
import { usePathStore } from "@/stores/path";
import { useHistoryStore } from "@/stores/history";
import { snapToGrid, getActiveLayerSpec, viewportPlacement } from "./helpers";
import { CreateRectangleCommand, CreatePolygonCommand, CreatePathCommand } from "./element";
import { CreateTextCommand } from "./text";

/**
 * Place a rectangle centered in the current viewport.
 *
 * Used by both the keyboard shortcut (R → Enter) and the command palette.
 */
export function placeRectangleInViewport(
  library: WasmLibrary,
  renderer: WasmRenderer,
  canvas: HTMLElement,
): void {
  const { centerX, centerY, halfW, halfH } = viewportPlacement(canvas);
  const width = halfW * 2;
  const height = halfH * 2;
  const originX = snapToGrid(centerX - halfW);
  const originY = snapToGrid(centerY - halfH);

  const { layerNumber, datatype } = getActiveLayerSpec();

  const command = new CreateRectangleCommand(
    originX,
    originY,
    width,
    height,
    layerNumber,
    datatype,
  );
  useHistoryStore.getState().execute(command, { library, renderer });
}

/**
 * Place a 3-point triangle centered in the current viewport.
 *
 * Used by both the keyboard shortcut (G → Enter) and the command palette.
 */
export function placePolygonInViewport(
  library: WasmLibrary,
  renderer: WasmRenderer,
  canvas: HTMLElement,
): void {
  const { centerX, centerY, halfW, halfH } = viewportPlacement(canvas);

  const points = new Float64Array([
    snapToGrid(centerX - halfW),
    snapToGrid(centerY - halfH),
    snapToGrid(centerX + halfW),
    snapToGrid(centerY - halfH),
    snapToGrid(centerX),
    snapToGrid(centerY + halfH),
  ]);

  const { layerNumber, datatype } = getActiveLayerSpec();

  const command = new CreatePolygonCommand(points, layerNumber, datatype);
  useHistoryStore.getState().execute(command, { library, renderer });
}

/**
 * Place a text label centered in the current viewport.
 *
 * Used by both the keyboard shortcut (T → Enter) and the command palette.
 */
export function placeTextInViewport(
  library: WasmLibrary,
  renderer: WasmRenderer,
  canvas: HTMLElement,
): void {
  const { centerX, centerY, halfH } = viewportPlacement(canvas);
  // Size the text height to ~10 % of the visible vertical extent (matching rect/polygon sizing)
  const height = Math.max(snapToGrid(halfH), GRID_SIZE);

  const { layerNumber, datatype } = getActiveLayerSpec();

  const command = new CreateTextCommand(
    "Text",
    snapToGrid(centerX),
    snapToGrid(centerY),
    height,
    layerNumber,
    datatype,
  );
  useHistoryStore.getState().execute(command, { library, renderer });
  useWasmContextStore.getState().bumpSyncGeneration();
}

/**
 * Place a horizontal path (waveguide) centered in the current viewport.
 *
 * Used by both the keyboard shortcut (H → Enter) and the command palette.
 * Creates a simple two-point horizontal path using the current path defaults
 * (width, corner radius) from the path store.
 */
export function placePathInViewport(
  library: WasmLibrary,
  renderer: WasmRenderer,
  canvas: HTMLElement,
): void {
  const { centerX, centerY, halfW } = viewportPlacement(canvas);

  const x0 = snapToGrid(centerX - halfW);
  const x1 = snapToGrid(centerX + halfW);
  const y = snapToGrid(centerY);

  const points = new Float64Array([x0, y, x1, y]);
  const waypoints = [
    { x: x0, y },
    { x: x1, y },
  ];

  const { layerNumber, datatype } = getActiveLayerSpec();
  const { width, cornerRadius, numArcPoints } = usePathStore.getState();

  const command = new CreatePathCommand(
    points,
    width,
    layerNumber,
    datatype,
    waypoints,
    cornerRadius,
    numArcPoints,
  );
  useHistoryStore.getState().execute(command, { library, renderer });
}
