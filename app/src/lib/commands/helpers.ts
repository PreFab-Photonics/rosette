import type { WasmLibrary } from "@/wasm/rosette_wasm";
import { type ClipboardSnapshot } from "@/stores/clipboard";
import { type Layer } from "@/stores/layer";
import { useExplorerStore } from "@/stores/explorer";
import { useViewportStore, GRID_SIZE } from "@/stores/viewport";
import { usePathStore } from "@/stores/path";
import { useImageStore, imageKeyToId, imageIdToKey, type ImageEntry } from "@/stores/image";
import { computeActualCornerRadius, checkBendRadiusReductions } from "@/lib/path";
import { useStatusMessageStore } from "@/stores/status-message";
import { useLayerStore, hexToRgba, FILL_PATTERN_IDS } from "@/stores/layer";
import type { CommandContext } from "./types";

/**
 * Snapshot selected elements for clipboard/undo operations.
 *
 * Handles both regular polygon UUIDs and synthetic ref UUIDs (from CellRef instances).
 * Deduplicates synthetic ref UUIDs so each CellRef instance is snapshotted once.
 */
export function snapshotElements(library: WasmLibrary, ids: Iterable<string>): ClipboardSnapshot[] {
  const snapshots: ClipboardSnapshot[] = [];
  // Track which CellRef element indices we've already snapshotted
  // (multiple synthetic ref UUIDs map to the same CellRef)
  const snapshotRefIndices = new Set<string>();

  for (const id of ids) {
    // Check if this is an image overlay
    if (id.startsWith("img:")) {
      const imgKey = imageIdToKey(id);
      const entry = useImageStore.getState().images.get(imgKey);
      if (entry) {
        snapshots.push({
          type: "image",
          url: entry.url,
          filename: entry.filename,
          x: entry.x,
          y: entry.y,
          width: entry.width,
          height: entry.height,
          naturalWidth: entry.naturalWidth,
          naturalHeight: entry.naturalHeight,
          lockAspectRatio: entry.lockAspectRatio,
        });
      }
      continue;
    }

    // Check if this is a synthetic ref UUID (CellRef instance)
    if (id.startsWith("ref:")) {
      const elemIdx = id.split(":")[1];
      if (snapshotRefIndices.has(elemIdx)) continue;
      snapshotRefIndices.add(elemIdx);

      const refInfo = library.get_cell_ref_info(id);
      if (refInfo) {
        const arrayVectors = library.get_cell_ref_array_vectors(id);
        snapshots.push({
          type: "cell-ref",
          cellName: refInfo.cell_name,
          transform: new Float64Array(refInfo.transform),
          repetition: arrayVectors ? new Float64Array(arrayVectors) : null,
        });
        refInfo.free();
      }
      continue;
    }

    // Regular UUID - check if it's actually a CellRef with a real UUID
    const refInfo = library.get_cell_ref_info(id);
    if (refInfo) {
      const arrayVectors = library.get_cell_ref_array_vectors(id);
      snapshots.push({
        type: "cell-ref",
        cellName: refInfo.cell_name,
        transform: new Float64Array(refInfo.transform),
        repetition: arrayVectors ? new Float64Array(arrayVectors) : null,
      });
      refInfo.free();
      continue;
    }

    // Text element — check before polygon since get_element_info returns
    // synthetic bounding-rect vertices for text (which we don't want to
    // snapshot as a polygon).
    const textInfo = library.get_text_element_info(id) as {
      text: string;
      x: number;
      y: number;
      height: number;
      layer: number;
      datatype: number;
    } | null;
    if (textInfo) {
      snapshots.push({
        type: "text",
        text: textInfo.text,
        x: textInfo.x,
        y: textInfo.y,
        height: textInfo.height,
        layer: textInfo.layer,
        datatype: textInfo.datatype,
      });
      continue;
    }

    // Check if this element has path metadata (paths are stored as polygons
    // in WASM but have editable waypoint data in the path store)
    const pathMeta = usePathStore.getState().pathMetadata.get(id);
    if (pathMeta) {
      snapshots.push({
        type: "path",
        waypoints: pathMeta.waypoints.map((wp) => ({ ...wp })),
        width: pathMeta.width,
        cornerRadius: pathMeta.cornerRadius,
        numArcPoints: pathMeta.numArcPoints,
        layer: pathMeta.layer,
        datatype: pathMeta.datatype,
      });
      continue;
    }

    // Polygon element
    const info = library.get_element_info(id);
    if (info) {
      snapshots.push({
        type: "polygon",
        vertices: new Float64Array(info.vertices),
        layer: info.layer,
        datatype: info.datatype,
      });
      info.free();
    }
  }

  return snapshots;
}

/**
 * Restore snapshots by creating elements in the library.
 *
 * Returns the IDs of the newly created elements.
 */
export function restoreSnapshots(library: WasmLibrary, snapshots: ClipboardSnapshot[]): string[] {
  const newIds: string[] = [];

  for (const snapshot of snapshots) {
    if (snapshot.type === "cell-ref") {
      const id = library.add_cell_ref_with_transform(snapshot.cellName, snapshot.transform);
      if (id) {
        // Restore AREF repetition if the original was an array reference.
        // The 6-element vector payload covers rectangular and skewed lattices.
        if (snapshot.repetition && snapshot.repetition.length === 6) {
          library.set_cell_ref_array_vectors(
            id,
            snapshot.repetition[0], // columns
            snapshot.repetition[1], // rows
            snapshot.repetition[2], // col_x
            snapshot.repetition[3], // col_y
            snapshot.repetition[4], // row_x
            snapshot.repetition[5], // row_y
          );
        }
        newIds.push(id);
      }
    } else if (snapshot.type === "text") {
      const id = library.add_text(
        snapshot.text,
        snapshot.x,
        snapshot.y,
        snapshot.height,
        snapshot.layer,
        snapshot.datatype,
      );
      if (id) {
        newIds.push(id);
      }
    } else if (snapshot.type === "path") {
      // Recreate path using create_path_rounded and restore path metadata
      const flatPoints = new Float64Array(snapshot.waypoints.length * 2);
      for (let i = 0; i < snapshot.waypoints.length; i++) {
        flatPoints[i * 2] = snapshot.waypoints[i].x;
        flatPoints[i * 2 + 1] = snapshot.waypoints[i].y;
      }
      const id = library.create_path_rounded(
        flatPoints,
        snapshot.width,
        snapshot.cornerRadius,
        snapshot.numArcPoints,
        snapshot.layer,
        snapshot.datatype,
      );
      if (id) {
        newIds.push(id);
        // Store path metadata so the element is recognized as a path
        const waypoints = snapshot.waypoints.map((wp) => ({ ...wp }));
        usePathStore.getState().setPathMetadata(id, {
          waypoints,
          width: snapshot.width,
          cornerRadius: snapshot.cornerRadius,
          actualCornerRadius: computeActualCornerRadius(waypoints, snapshot.cornerRadius),
          numArcPoints: snapshot.numArcPoints,
          layer: snapshot.layer,
          datatype: snapshot.datatype,
        });
      }
    } else if (snapshot.type === "image") {
      // Create a new image entry with a fresh ID, scoped to the active cell
      const newId = crypto.randomUUID();
      const entry: ImageEntry = {
        id: newId,
        url: snapshot.url,
        filename: snapshot.filename,
        x: snapshot.x,
        y: snapshot.y,
        width: snapshot.width,
        height: snapshot.height,
        naturalWidth: snapshot.naturalWidth,
        naturalHeight: snapshot.naturalHeight,
        lockAspectRatio: snapshot.lockAspectRatio,
        cellName: useExplorerStore.getState().activeCell ?? "",
      };
      useImageStore.getState().addImage(entry);
      newIds.push(imageKeyToId(newId));
    } else {
      const id = library.add_polygon(snapshot.vertices, snapshot.layer, snapshot.datatype);
      if (id) {
        newIds.push(id);
      }
    }
  }

  return newIds;
}

/**
 * Offset a clipboard snapshot by (dx, dy) in world coordinates, returning a new snapshot.
 */
export function offsetSnapshot(
  snapshot: ClipboardSnapshot,
  dx: number,
  dy: number,
): ClipboardSnapshot {
  if (snapshot.type === "polygon") {
    const verts = new Float64Array(snapshot.vertices.length);
    for (let i = 0; i < verts.length; i += 2) {
      verts[i] = snapshot.vertices[i] + dx;
      verts[i + 1] = snapshot.vertices[i + 1] + dy;
    }
    return { type: "polygon", vertices: verts, layer: snapshot.layer, datatype: snapshot.datatype };
  }
  if (snapshot.type === "path") {
    return {
      type: "path",
      waypoints: snapshot.waypoints.map((wp) => ({ x: wp.x + dx, y: wp.y + dy })),
      width: snapshot.width,
      cornerRadius: snapshot.cornerRadius,
      numArcPoints: snapshot.numArcPoints,
      layer: snapshot.layer,
      datatype: snapshot.datatype,
    };
  }
  if (snapshot.type === "cell-ref") {
    const t = new Float64Array(snapshot.transform);
    t[4] += dx; // tx
    t[5] += dy; // ty
    return {
      type: "cell-ref",
      cellName: snapshot.cellName,
      transform: t,
      repetition: snapshot.repetition ? new Float64Array(snapshot.repetition) : null,
    };
  }
  if (snapshot.type === "image") {
    return { ...snapshot, x: snapshot.x + dx, y: snapshot.y + dy };
  }
  // text
  return {
    type: "text",
    text: snapshot.text,
    x: snapshot.x + dx,
    y: snapshot.y + dy,
    height: snapshot.height,
    layer: snapshot.layer,
    datatype: snapshot.datatype,
  };
}

/**
 * Convert world units to micrometers for display in status messages.
 * World units are nm * GRID_SIZE, so: µm = world / GRID_SIZE / 1000.
 */
export function worldToUm(world: number): string {
  const um = world / GRID_SIZE / 1000;
  return um.toFixed(um >= 10 ? 1 : um >= 1 ? 2 : 3);
}

/**
 * Show a status bar warning if any corners had their bend radius auto-reduced.
 */
export function warnBendRadiusReductions(
  waypoints: { x: number; y: number }[],
  cornerRadius: number,
): void {
  if (cornerRadius <= 0) return;
  const reductions = checkBendRadiusReductions(waypoints, cornerRadius);
  if (reductions.length === 0) return;

  const requestedUm = worldToUm(cornerRadius);
  const minActual = Math.min(...reductions.map((r) => r.actual));
  const minActualUm = worldToUm(minActual);

  const msg =
    reductions.length === 1
      ? `Bend radius reduced to ${minActualUm} µm at corner ${reductions[0].cornerIndex} (requested ${requestedUm} µm)`
      : `Bend radius reduced at ${reductions.length} corners (min ${minActualUm} µm, requested ${requestedUm} µm)`;

  useStatusMessageStore.getState().show(msg, "warn");
}

/**
 * Sync a layer's color and fill pattern to the WASM library.
 */
export function syncLayerToWasm(layer: Layer, ctx: CommandContext): void {
  const alpha = layer.visible ? layer.opacity : 0;
  const [r, g, b, a] = hexToRgba(layer.color, alpha);
  ctx.library.set_layer_color(layer.layerNumber, layer.datatype, r, g, b, a);
  ctx.library.set_layer_fill_pattern(
    layer.layerNumber,
    layer.datatype,
    FILL_PATTERN_IDS[layer.fillPattern ?? "solid"] ?? 0,
  );
}

/**
 * Rebuild the Explorer cell tree from the WASM library's current state.
 *
 * Called after any command that changes cell structure (add, delete, rename)
 * or cell references (add/remove instance). This keeps the Explorer's
 * hierarchical tree in sync with the library in standalone mode.
 * In design mode the tree comes from the WASM library, same as standalone.
 */
export function syncCellTree(library: WasmLibrary): void {
  const tree = library.get_cell_tree();
  if (tree) {
    useExplorerStore.getState().setCellTree(tree);
  }
}

export function snapToGrid(v: number): number {
  return Math.round(v / GRID_SIZE) * GRID_SIZE;
}

/** Get the active layer's GDS layer number and datatype. */
export function getActiveLayerSpec(): { layerNumber: number; datatype: number } {
  const { activeLayerId, layers } = useLayerStore.getState();
  const activeLayer = layers.get(activeLayerId);
  return {
    layerNumber: activeLayer?.layerNumber ?? 1,
    datatype: activeLayer?.datatype ?? 0,
  };
}

/**
 * Compute viewport-center placement parameters.
 *
 * Returns the world-space center and a grid-snapped size that is
 * ~10 % of the visible extent (minimum 1 grid unit per axis).
 */
export function viewportPlacement(canvas: HTMLElement): {
  centerX: number;
  centerY: number;
  halfW: number;
  halfH: number;
} {
  const { zoom, offset } = useViewportStore.getState();
  const rect = canvas.getBoundingClientRect();

  const centerX = (rect.width / 2 - offset.x) / zoom;
  const centerY = (rect.height / 2 - offset.y) / zoom;

  const visibleWidth = rect.width / zoom;
  const visibleHeight = rect.height / zoom;
  const halfW = Math.max(snapToGrid((visibleWidth * 0.1) / 2), GRID_SIZE);
  const halfH = Math.max(snapToGrid((visibleHeight * 0.1) / 2), GRID_SIZE);

  return { centerX, centerY, halfW, halfH };
}
