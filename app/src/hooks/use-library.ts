import { useState, useEffect, useCallback, useRef } from "react";
import type { WasmLibrary } from "@/wasm/rosette_wasm";
import { useExplorerStore } from "@/stores/explorer";
import type { CellNode } from "@/stores/explorer";
import {
  useLayerStore,
  hexToRgba,
  FILL_PATTERN_IDS,
  LAYER_PALETTE,
  type FillPattern,
  type Layer,
} from "@/stores/layer";
import { isTauri, readGdsBytes, listenTauri, getPendingFile } from "@/lib/tauri";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useSelectionStore } from "@/stores/selection";
import { useViewportStore } from "@/stores/viewport";

// Module-level singleton for library
let libraryInstance: WasmLibrary | null = null;

// =============================================================================
// Source map for two-way editing (rosette serve)
// =============================================================================

/** Source location info from the Python server. */
export interface SourceInfo {
  file: string;
  line: number;
  fn: string;
  code: string;
  type: string; // "polygon" | "path" | "ref"
}

/** UUID → SourceInfo mapping, built after each design update. */
let currentSourceMap: Map<string, SourceInfo> | null = null;

/** Stored child source maps for lazy lookup when in a child cell. */
let storedChildSourceMaps: Record<string, (SourceInfo | null)[]> | null = null;
/** Stored server source map (top cell, element-indexed). */
let storedServerSourceMap: (SourceInfo | null)[] | null = null;
/**
 * Cache UUID → element index so lookups survive library replacement (SSE updates
 * create a new WasmLibrary with fresh UUIDs, making old UUIDs return -1 from
 * get_element_index). The element index within a cell doesn't change across
 * re-executions of the same design.
 */
const elemIdxCache = new Map<string, number>();

/**
 * Get source info for an element by UUID.
 * Returns null if no source tracking is available or the element has no source.
 */
export function getSourceInfo(uuid: string): SourceInfo | null {
  // Fast path: pre-built source map
  const cached = currentSourceMap?.get(uuid) ?? null;
  if (cached) return cached;

  // Fallback: when navigated into a child cell, element v4 UUIDs
  // aren't in the source map (which was built for the top cell).
  // Look up child source maps using element index.
  if (!uuid.startsWith("ref:") && libraryInstance) {
    const activeCellName = libraryInstance.active_cell_name();
    let elemIdx = libraryInstance.get_element_index(uuid);
    // If UUID is stale (library was replaced by SSE), use cached index
    if (elemIdx < 0 && elemIdxCache.has(uuid)) {
      elemIdx = elemIdxCache.get(uuid)!;
    }
    if (elemIdx >= 0) {
      elemIdxCache.set(uuid, elemIdx);
      if (storedChildSourceMaps && activeCellName && storedChildSourceMaps[activeCellName]) {
        const childMap = storedChildSourceMaps[activeCellName];
        if (elemIdx < childMap.length && childMap[elemIdx]) {
          return childMap[elemIdx];
        }
      }
      if (storedServerSourceMap && elemIdx < storedServerSourceMap.length) {
        const source = storedServerSourceMap[elemIdx];
        if (source) return source;
      }
    }
  }

  return null;
}

/**
 * Send an edit request to the Python server.
 * The server patches the source file, the file watcher detects the change,
 * and the design is re-executed automatically.
 */
export async function sendEdit(edit: {
  file: string;
  line: number;
  old_code?: string;
  new_code: string;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/design/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Send a semantic edit operation to the Python server.
 * The server applies the edit using libcst, the file watcher detects the
 * change, and the design is re-executed automatically.
 */
export async function sendSemanticEdit(
  edit: Record<string, unknown>,
): Promise<boolean> {
  console.log("[edit] sendSemanticEdit →", JSON.stringify(edit, null, 2));
  try {
    const res = await fetch("/api/design/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    });
    const text = await res.text();
    console.log("[edit] sendSemanticEdit response:", res.status, text);
    return res.ok;
  } catch (e) {
    console.error("[edit] sendSemanticEdit error:", e);
    return false;
  }
}

/**
 * Send a vertex edit for a polygon or path element.
 * Vertices are in WASM world coordinates — the server handles conversion to µm.
 */
export function sendVertexEdit(
  elementId: string,
  newVertices: Float64Array,
): void {
  const source = getSourceInfo(elementId);
  if (!source) {
    const acn = libraryInstance?.active_cell_name() ?? null;
    const eidx = libraryInstance?.get_element_index(elementId) ?? -1;
    console.warn("[edit] sendVertexEdit BAIL: no source for", elementId.slice(0, 8), {
      activeCellName: acn,
      elemIdx: eidx,
      hasChildMaps: storedChildSourceMaps !== null,
      childMapKeys: storedChildSourceMaps ? Object.keys(storedChildSourceMaps) : [],
      childMapForCell: storedChildSourceMaps && acn ? (storedChildSourceMaps[acn]?.length ?? "missing") : "n/a",
      childEntry: storedChildSourceMaps && acn && storedChildSourceMaps[acn] ? storedChildSourceMaps[acn][eidx] : "n/a",
      hasServerMap: storedServerSourceMap !== null,
      serverMapLen: storedServerSourceMap?.length ?? 0,
      serverEntry: storedServerSourceMap && eidx >= 0 ? storedServerSourceMap[eidx] : "n/a",
    });
    return;
  }
  if (source.type !== "polygon" && source.type !== "path") { console.warn("[edit] sendVertexEdit BAIL: wrong type", source.type, "for", elementId); return; }

  sendSemanticEdit({
    op: "modify_vertices",
    file: source.file,
    line: source.line,
    old_code: source.code,
    vertices: Array.from(newVertices),
  });
}

/**
 * Send a move_ref edit to update .at(x, y) for a cell reference.
 * dx/dy are in WASM world coordinates.
 */
export function sendRefMove(
  elementId: string,
  dx: number,
  dy: number,
): void {
  const source = getSourceInfo(elementId);
  if (!source) {
    const acn = libraryInstance?.active_cell_name() ?? null;
    const eidx = libraryInstance?.get_element_index(elementId) ?? -1;
    console.warn("[edit] sendRefMove BAIL: no source for", elementId.slice(0, 8), {
      activeCellName: acn, elemIdx: eidx,
      hasChildMaps: storedChildSourceMaps !== null,
      childMapKeys: storedChildSourceMaps ? Object.keys(storedChildSourceMaps) : [],
      childEntry: storedChildSourceMaps && acn && storedChildSourceMaps[acn] ? storedChildSourceMaps[acn][eidx] : "n/a",
    });
    return;
  }
  if (source.type !== "ref") { console.warn("[edit] sendRefMove BAIL: wrong type", source.type, "for", elementId); return; }

  sendSemanticEdit({
    op: "move_ref",
    file: source.file,
    line: source.line,
    old_code: source.code,
    dx,
    dy,
  });
}

/**
 * Send a layer change for an element.
 */
export function sendLayerEdit(
  elementId: string,
  layer: number,
  datatype: number,
): void {
  const source = getSourceInfo(elementId);
  console.log("[edit] sendLayerEdit", { elementId, source });
  if (!source) { console.warn("[edit] sendLayerEdit BAIL: no source for", elementId); return; }
  if (source.type !== "polygon" && source.type !== "path") { console.warn("[edit] sendLayerEdit BAIL: wrong type", source.type, "for", elementId); return; }

  sendSemanticEdit({
    op: "modify_layer",
    file: source.file,
    line: source.line,
    old_code: source.code,
    layer,
    datatype,
  });
}

/**
 * Send a delete operation for an element.
 */
export function sendDeleteEdit(elementId: string): void {
  const source = getSourceInfo(elementId);
  if (!source) return;

  sendSemanticEdit({
    op: "delete_element",
    file: source.file,
    line: source.line,
    old_code: source.code,
  });
}

/**
 * Send an add operation for a new polygon element.
 * Inserts a new add_polygon call after the last source-tracked element.
 */
export function sendAddEdit(
  vertices: Float64Array,
  layer: number,
  datatype: number,
): void {
  if (!currentSourceMap || currentSourceMap.size === 0) return;

  // Find the last source entry to determine file, insertion point, and cell variable.
  let lastLine = 0;
  let file = "";
  let cellVar = "cell";

  for (const source of currentSourceMap.values()) {
    if (source.line > lastLine) {
      lastLine = source.line;
      file = source.file;
      // Extract cell variable from code like "top.add_polygon(...)" or "top.add_ref(...)"
      const dotIdx = source.code.indexOf(".");
      if (dotIdx > 0) {
        cellVar = source.code.substring(0, dotIdx).trim();
      }
    }
  }

  if (!file || lastLine === 0) return;

  sendSemanticEdit({
    op: "add_element",
    file,
    after_line: lastLine,
    element_type: "polygon",
    vertices: Array.from(vertices),
    layer,
    datatype,
    cell_var: cellVar,
  });
}

/**
 * Build UUID → SourceInfo mapping using element indices.
 *
 * The server sends source_map indexed by element position in the top cell,
 * plus child_source_maps keyed by cell name for elements inside components.
 *
 * For direct element UUIDs we look up source_map[element_index].
 * For ref UUIDs ("ref:N:M") we resolve the child cell name via
 * get_cell_ref_info and look up child_source_maps[cell_name][M].
 */
function buildSourceMap(
  lib: WasmLibrary,
  serverSourceMap: (SourceInfo | null)[] | null,
  childSourceMaps?: Record<string, (SourceInfo | null)[]> | null,
): void {
  // Store raw data for lazy lookups (e.g., when navigated into child cell)
  storedServerSourceMap = serverSourceMap;
  storedChildSourceMaps = childSourceMaps ?? null;

  if (!serverSourceMap || serverSourceMap.length === 0) {
    currentSourceMap = null;
    return;
  }

  const map = new Map<string, SourceInfo>();
  try {
    const renderPolygons = lib.get_render_polygons() as [string, unknown, unknown, unknown][];
    for (const rp of renderPolygons) {
      const uuid = rp[0];
      if (!uuid) continue;

      if (uuid.startsWith("ref:")) {
        // ref:N:M — map to the parent cell's add_ref line (type: "ref")
        // so that dragging sends move_ref, not modify_vertices.
        // Child source maps are only used for non-ref UUIDs (inside child cells).
        const colonPos = uuid.indexOf(":", 4);
        const elemIdx = parseInt(uuid.substring(4, colonPos > 0 ? colonPos : undefined), 10);

        if (elemIdx >= 0 && elemIdx < serverSourceMap.length) {
          const source = serverSourceMap[elemIdx];
          if (source) {
            map.set(uuid, source);
          }
        }
      } else {
        const elemIdx = lib.get_element_index(uuid);
        if (elemIdx >= 0 && elemIdx < serverSourceMap.length) {
          const source = serverSourceMap[elemIdx];
          if (source) {
            map.set(uuid, source);
          }
        }
      }
    }
  } catch (e) {
    console.error("[sourceMap] buildSourceMap error:", e);
  }

  console.log("[sourceMap] built:", map.size, "entries, children:", childSourceMaps ? Object.keys(childSourceMaps).join(",") : "none");
  currentSourceMap = map.size > 0 ? map : null;
}

/**
 * Check if running in design preview mode.
 * Design mode is activated by the `?design=true` URL parameter,
 * set by `rosette serve`.
 */
export function isDesignMode(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get("design") === "true";
}

/**
 * Check if running in embed mode.
 * Embed mode loads a static JSON file and hides all chrome.
 * Activated by `?embed=true&src=path/to/design.json`.
 */
export function isEmbedMode(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get("embed") === "true";
}

/**
 * Get the static JSON source URL for embed mode.
 */
function getEmbedSrc(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("src");
}

/**
 * Get custom layer colors from the URL for embed mode.
 *
 * Accepts a `?colors=` parameter with comma-separated hex colors (without #).
 * Colors are applied in order to auto-discovered layers.
 * Example: `?colors=4037C1,F3CD49` assigns purple to layer 1, gold to layer 2.
 */
function getEmbedColors(): string[] | null {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("colors");
  if (!raw) return null;
  return raw.split(",").map((c) => `#${c.trim()}`);
}

/**
 * Get custom layer fill patterns from the URL for embed mode.
 *
 * Accepts a `?fills=` parameter with comma-separated fill pattern names.
 * Fills are applied in order to auto-discovered layers.
 * Valid values: solid, hatched, crosshatched, dotted.
 * Example: `?fills=solid,hatched` assigns solid to layer 1, hatched to layer 2.
 */
function getEmbedFills(): string[] | null {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("fills");
  if (!raw) return null;
  return raw.split(",").map((f) => f.trim());
}

/**
 * Get a custom project name from the URL for embed mode.
 * Example: `?name=my-design`
 */
function getEmbedName(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("name");
}

/**
 * Get a custom panel width from the URL for embed mode.
 *
 * Sets the Explorer and Sidebar panel widths in CSS pixels.
 * Example: `?panelWidth=200` makes both panels 200px wide.
 */
export function getEmbedPanelWidth(): number | null {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("panelWidth");
  if (!raw) return null;
  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value) || value <= 0) return null;
  return value;
}

/**
 * Get a custom zoom multiplier from the URL for embed mode.
 *
 * Applied after zoom-to-fit: values < 1 zoom out, values > 1 zoom in.
 * Example: `?zoom=0.8` zooms out 20% from the default fit view.
 */
export function getEmbedZoom(): number | null {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("zoom");
  if (!raw) return null;
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value) || value <= 0) return null;
  return value;
}

/**
 * Check if running in Tauri desktop mode.
 */
function isTauriMode(): boolean {
  return isTauri && !isDesignMode() && !isEmbedMode();
}

/**
 * Layer definition from rosette.toml (sent by the server).
 */
interface ServerLayerDef {
  id: number;
  layerNumber: number;
  datatype: number;
  name: string;
  color: string;
  visible: boolean;
  fillPattern: string;
  opacity: number;
}

/**
 * Response from the /api/design SSE endpoint.
 */
interface DesignResponse {
  version: number;
  json: string | null;
  /** Cell hierarchy tree (design mode) or flat list (legacy). */
  cells: CellNode | string[] | null;
  /** Source map for two-way editing (indexed by element position in top cell). */
  source_map: (SourceInfo | null)[] | null;
  /** Source maps for child cells: {cell_name: [source, ...]} indexed by render polygon order. */
  child_source_maps: Record<string, (SourceInfo | null)[]> | null;
  /** Layer definitions from rosette.toml (if available). */
  layers: ServerLayerDef[] | null;
  /** Source filename (e.g., "layout.py" or "mmi.gds"). */
  filename: string | null;
}

/** Type guard: is the cells payload a hierarchy tree? */
function isCellTree(cells: CellNode | string[] | null): cells is CellNode {
  return cells !== null && !Array.isArray(cells) && "name" in cells && "children" in cells;
}

/**
 * Apply current layer colors to a library instance.
 */
function syncLayerColors(
  lib: WasmLibrary,
  layers: Map<
    number,
    { color: string; layerNumber: number; datatype: number; visible?: boolean; opacity?: number }
  >,
) {
  for (const layer of layers.values()) {
    const alpha = layer.visible ? (layer.opacity ?? 0.7) : 0;
    const [r, g, b, a] = hexToRgba(layer.color, alpha);
    lib.set_layer_color(layer.layerNumber, layer.datatype, r, g, b, a);
  }
}

/** Color palette for auto-discovered layers (single source of truth in store). */
const LAYER_COLORS = LAYER_PALETTE;

/**
 * Apply server-provided layer definitions from rosette.toml.
 *
 * Uses the layer names, colors, fill patterns, and opacity from the
 * project's rosette.toml [layers] section. Any layers found in the
 * WASM library but not defined in rosette.toml get auto-assigned
 * colors from the palette.
 *
 * @returns true if server layers were applied, false if fallback needed
 */
function applyServerLayers(lib: WasmLibrary, serverLayers: ServerLayerDef[]): boolean {
  if (serverLayers.length === 0) return false;

  // Build a set of (layerNumber, datatype) pairs defined by the server
  const defined = new Set(serverLayers.map((l) => `${l.layerNumber}/${l.datatype}`));

  // Start with server-defined layers
  const newLayers: Layer[] = serverLayers.map((l) => ({
    id: l.id,
    layerNumber: l.layerNumber,
    datatype: l.datatype,
    name: l.name,
    color: l.color,
    visible: l.visible ?? true,
    fillPattern: (l.fillPattern ?? "solid") as Layer["fillPattern"],
    opacity: l.opacity ?? 0.7,
  }));

  // Discover any additional layers in the GDS that aren't in rosette.toml
  const usedLayers = lib.get_used_layers();
  let nextId = Math.max(0, ...newLayers.map((l) => l.id)) + 1;
  let colorIdx = newLayers.length;

  for (let i = 0; i < usedLayers.length; i += 2) {
    const layerNumber = usedLayers[i];
    const datatype = usedLayers[i + 1];
    const key = `${layerNumber}/${datatype}`;

    if (!defined.has(key)) {
      // Layer exists in GDS but not in rosette.toml — auto-assign
      newLayers.push({
        id: nextId++,
        layerNumber,
        datatype,
        name: datatype === 0 ? `layer${layerNumber}` : `layer${layerNumber}/${datatype}`,
        color: LAYER_COLORS[colorIdx % LAYER_COLORS.length],
        visible: true,
        fillPattern: "solid",
        opacity: 0.7,
      });
      colorIdx++;
    }
  }

  useLayerStore.getState().resetLayers(newLayers);
  return true;
}

/**
 * Discover layers used in a library and reset the layer store.
 *
 * Queries the WASM library for all unique (layer, datatype) pairs,
 * builds Layer entries with auto-assigned colors and names, then
 * replaces the layer store contents.
 */
function discoverLayers(lib: WasmLibrary): void {
  const usedLayers = lib.get_used_layers();
  if (usedLayers.length === 0) return;

  const newLayers: Layer[] = [];
  for (let i = 0; i < usedLayers.length; i += 2) {
    const layerNumber = usedLayers[i];
    const datatype = usedLayers[i + 1];
    const id = i / 2 + 1;
    const colorIndex = (id - 1) % LAYER_COLORS.length;
    const name = datatype === 0 ? `layer${layerNumber}` : `layer${layerNumber}/${datatype}`;

    newLayers.push({
      id,
      layerNumber,
      datatype,
      name,
      color: LAYER_COLORS[colorIndex],
      visible: true,
      fillPattern: "solid",
      opacity: 0.7,
    });
  }

  useLayerStore.getState().resetLayers(newLayers);
}

/**
 * Hook to manage the WasmLibrary instance.
 *
 * Creates a singleton library with a default cell and syncs layer colors.
 * In design mode (`?design=true`), connects to `/api/design/events` SSE
 * for live updates from `rosette serve`. The full hierarchical library
 * is sent over SSE and loaded via `from_library_json`, giving design
 * mode the same instance handling as Tauri mode (cell navigation,
 * hierarchy depth control, instance transforms in inspector).
 *
 * In Tauri mode, loads full hierarchical GDS files via the backend and
 * manages them locally in the WASM library.
 *
 * @param wasm - The loaded WASM module
 * @param isWasmReady - Whether the WASM module is ready
 */
export function useLibrary(
  wasm: typeof import("@/wasm/rosette_wasm") | null,
  isWasmReady: boolean,
) {
  const [library, setLibrary] = useState<WasmLibrary | null>(libraryInstance);
  const [isReady, setIsReady] = useState(!!libraryInstance);
  const layers = useLayerStore((s) => s.layers);
  const layersRef = useRef(layers);
  const designVersionRef = useRef(0);
  const wasmRef = useRef(wasm);

  // Keep refs in sync
  useEffect(() => {
    layersRef.current = layers;
  }, [layers]);
  useEffect(() => {
    wasmRef.current = wasm;
  }, [wasm]);

  // Initialize library once WASM is ready
  useEffect(() => {
    if (!wasm || !isWasmReady) return;

    // In design mode or embed mode, don't create default library - wait for server/static data
    if (isDesignMode() || isEmbedMode()) {
      return;
    }

    if (!libraryInstance) {
      const lib = new wasm.WasmLibrary("rosette");
      try {
        lib.add_cell("top");
      } catch {
        // "top" is a valid cell name; this should never fail
      }
      lib.set_active_cell("top");
      libraryInstance = lib;
    }

    const tree = libraryInstance.get_cell_tree();
    if (tree) {
      useExplorerStore.getState().setCellTree(tree);
    } else {
      useExplorerStore.getState().setCells(["top"]);
    }
    setLibrary(libraryInstance);
    setIsReady(true);
  }, [wasm, isWasmReady]);

  // Tauri mode: listen for file-open events from native menu / drag-drop / CLI args
  useEffect(() => {
    if (!wasm || !isWasmReady || !isTauriMode()) return;

    let cancelled = false;

    const handleOpenFile = async (path: string) => {
      if (cancelled) return;

      try {
        // Read raw GDS bytes and parse directly in WASM (avoids JSON round-trip)
        const bytes = await readGdsBytes(path);
        if (cancelled) return;

        const newLibrary = wasm.WasmLibrary.from_gds_bytes(bytes);
        discoverLayers(newLibrary);
        syncLayerColors(newLibrary, useLayerStore.getState().layers);

        if (libraryInstance) {
          libraryInstance.free();
        }

        libraryInstance = newLibrary;
        setLibrary(newLibrary);
        setIsReady(true);

        // Set project name from the opened file's basename
        const basename = path.split(/[/\\]/).pop();
        if (basename) {
          useExplorerStore.getState().setProjectName(basename);
        }

        // Build the cell tree from the WASM library itself
        const tree = newLibrary.get_cell_tree();
        if (tree) {
          useExplorerStore.getState().setCellTree(tree);
          // Set active cell to the top cell (first root in the tree)
          const topCellName = newLibrary.active_cell_name();
          if (topCellName) {
            useExplorerStore.getState().setActiveCell(topCellName);
          }
        }
      } catch (err) {
        console.error("Failed to open GDS file:", err);
      }
    };

    // Check for a file passed via CLI args (e.g., double-clicking a .gds file)
    getPendingFile().then((path) => {
      if (path && !cancelled) {
        handleOpenFile(path);
      }
    });

    // Listen for open-file events (from native menu or drag-drop)
    let unlisten: (() => void) | null = null;
    listenTauri<string>("open-file", handleOpenFile).then((fn) => {
      if (cancelled) {
        fn();
      } else {
        unlisten = fn;
      }
    });

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [wasm, isWasmReady]);

  // Listen for "new file" events (from Cmd+N, menu, or command palette)
  useEffect(() => {
    if (!wasm || !isWasmReady) return;

    const handleNewFile = () => {
      // Create a fresh library with one "top" cell
      const newLib = new wasm.WasmLibrary("rosette");
      try {
        newLib.add_cell("top");
      } catch {
        // "top" is a valid cell name; this should never fail
      }
      newLib.set_active_cell("top");

      // Free old library
      if (libraryInstance) {
        libraryInstance.free();
      }

      // Install the new library (both module singleton and React state)
      libraryInstance = newLib;
      setLibrary(newLib);
      setIsReady(true);

      // Reset explorer
      useExplorerStore.getState().setProjectName("untitled-project");
      const tree = newLib.get_cell_tree();
      if (tree) {
        useExplorerStore.getState().setCellTree(tree);
      } else {
        useExplorerStore.getState().setCells(["top"]);
      }
      useExplorerStore.getState().setActiveCell("top");

      // Reset viewport to center origin on screen
      const canvas = document.getElementById("rosette-canvas");
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        useViewportStore.getState().reset(rect.width, rect.height);
      }

      // Notify overlays that library state changed
      useWasmContextStore.getState().bumpSyncGeneration();
    };

    window.addEventListener("rosette-new-file", handleNewFile);
    return () => window.removeEventListener("rosette-new-file", handleNewFile);
  }, [wasm, isWasmReady]);

  // Design mode: SSE for live design updates from server
  useEffect(() => {
    if (!wasm || !isWasmReady || !isDesignMode()) return;

    const eventSource = new EventSource("/api/design/events");

    eventSource.addEventListener("design", (event) => {
      try {
        const data: DesignResponse = JSON.parse(event.data);

        // Handle server restart (version reset)
        if (data.version < designVersionRef.current) {
          designVersionRef.current = 0;
        }

        // Check if version changed and we have JSON
        if (data.version !== designVersionRef.current && data.json) {
          try {
            // Create library from hierarchical JSON (same path as Tauri/GDS)
            const newLibrary = wasm.WasmLibrary.from_library_json(data.json);

            // Apply server-provided layer definitions, or fall back to auto-discovery
            if (data.layers && data.layers.length > 0) {
              applyServerLayers(newLibrary, data.layers);
            } else {
              discoverLayers(newLibrary);
            }
            syncLayerColors(newLibrary, useLayerStore.getState().layers);

            // Defer freeing old library so React can re-render with the new
            // one first. Without this, InspectorPanel (or other components)
            // may call methods on the freed WASM object during the render
            // triggered by setLibrary, causing a null-pointer crash.
            const oldLib = libraryInstance;

            libraryInstance = newLibrary;
            setLibrary(newLibrary);
            setIsReady(true);
            designVersionRef.current = data.version;

            // Save selection state before clearing — we'll re-select equivalent
            // elements in the new library after it's ready.
            const prevSelectedIds = [...useSelectionStore.getState().selectedIds];
            const prevElemIndices: { elemIdx: number; refId: string }[] = [];
            for (const id of prevSelectedIds) {
              if (id.startsWith("ref:")) {
                // Synthetic ref:N:M IDs are stable across library replacements
                prevElemIndices.push({ elemIdx: -1, refId: id });
              } else if (oldLib) {
                let idx = oldLib.get_element_index(id);
                if (idx < 0) idx = elemIdxCache.get(id) ?? -1;
                if (idx >= 0) elemIdxCache.set(id, idx);
                prevElemIndices.push({ elemIdx: idx, refId: "" });
              }
            }

            useSelectionStore.getState().clearSelection();

            if (oldLib) {
              requestAnimationFrame(() => {
                try { oldLib.free(); } catch { /* already freed */ }
              });
            }

            // Build UUID → SourceInfo mapping for two-way editing
            buildSourceMap(newLibrary, data.source_map ?? null, data.child_source_maps ?? null);

            // Build cell tree from the WASM library (same as Tauri mode)
            const tree = newLibrary.get_cell_tree();
            if (tree) {
              // Preserve current active cell if it still exists in the new tree
              const prevActiveCell = useExplorerStore.getState().activeCell;
              useExplorerStore.getState().setCellTree(tree);
              if (prevActiveCell) {
                const cells = useExplorerStore.getState().cells;
                if (cells.includes(prevActiveCell)) {
                  // Restore previous cell — setCellTree may have kept it,
                  // but also sync the WASM library to match
                  newLibrary.set_active_cell(prevActiveCell);
                }
              }
            } else if (data.cells) {
              // Fallback to server-provided cell tree
              if (isCellTree(data.cells)) {
                useExplorerStore.getState().setCellTree([data.cells]);
              } else {
                useExplorerStore.getState().setCells(data.cells);
              }
            }

            // Set project name from source filename (e.g., "layout.py" or "mmi.gds")
            if (data.filename) {
              useExplorerStore.getState().setProjectName(data.filename);
            }

            // Re-select equivalent elements in the new library
            if (prevElemIndices.length > 0) {
              const newIds = new Set<string>();
              const allNewIds = newLibrary.get_all_ids();

              // Build index→UUID lookup for the new library
              const idxToNewUuid = new Map<number, string>();
              for (const id of allNewIds) {
                if (!id.startsWith("ref:")) {
                  const idx = newLibrary.get_element_index(id);
                  if (idx >= 0) idxToNewUuid.set(idx, id);
                }
              }

              for (const entry of prevElemIndices) {
                if (entry.refId) {
                  newIds.add(entry.refId);
                } else if (entry.elemIdx >= 0) {
                  const newId = idxToNewUuid.get(entry.elemIdx);
                  if (newId) newIds.add(newId);
                }
              }

              if (newIds.size > 0) {
                useSelectionStore.getState().setSelection(newIds);
              }
            }
          } catch (parseError) {
            console.error("Failed to parse design:", parseError);
          }
        }
      } catch (parseError) {
        console.error("Failed to parse SSE event:", parseError);
      }
    });

    eventSource.onerror = () => {
      // EventSource auto-reconnects, just log for debugging
      console.warn("SSE connection error, reconnecting...");
    };

    return () => {
      eventSource.close();
    };
  }, [wasm, isWasmReady]);

  // Embed mode: load a static JSON file once
  useEffect(() => {
    if (!wasm || !isWasmReady || !isEmbedMode()) return;

    const src = getEmbedSrc();
    if (!src || src.startsWith("//") || /^https?:\/\//i.test(src)) {
      console.error("Embed mode requires a relative ?src= parameter pointing to a JSON file");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Failed to fetch ${src}: ${response.status}`);
        const json = await response.text();
        if (cancelled) return;

        const newLibrary = wasm.WasmLibrary.from_library_json(json);
        discoverLayers(newLibrary);

        // Apply custom embed colors and fills if provided via ?colors= / ?fills= parameters
        const embedColors = getEmbedColors();
        const embedFills = getEmbedFills();
        if (embedColors || embedFills) {
          const layerMap = useLayerStore.getState().layers;
          const layerArray = Array.from(layerMap.values());
          const updated = layerArray.map((layer, i) => {
            let patched = layer;
            if (embedColors && i < embedColors.length) {
              patched = { ...patched, color: embedColors[i] };
            }
            if (embedFills && i < embedFills.length && embedFills[i] in FILL_PATTERN_IDS) {
              patched = { ...patched, fillPattern: embedFills[i] as FillPattern };
            }
            return patched;
          });
          useLayerStore.getState().resetLayers(updated);
        }

        syncLayerColors(newLibrary, useLayerStore.getState().layers);

        if (libraryInstance) {
          libraryInstance.free();
        }

        libraryInstance = newLibrary;
        setLibrary(newLibrary);
        setIsReady(true);

        // Set project name from ?name= parameter or fall back to library name
        const embedName = getEmbedName();
        if (embedName) {
          useExplorerStore.getState().setProjectName(embedName);
        }

        const tree = newLibrary.get_cell_tree();
        if (tree) {
          useExplorerStore.getState().setCellTree(tree);
          const topCellName = newLibrary.active_cell_name();
          if (topCellName) {
            useExplorerStore.getState().setActiveCell(topCellName);
          }
        }
      } catch (err) {
        console.error("Failed to load embed design:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [wasm, isWasmReady]);

  // Sync layer colors and fill patterns to library (hidden layers get alpha=0 so they don't render)
  useEffect(() => {
    if (!library) return;

    for (const layer of layers.values()) {
      const alpha = layer.visible ? (layer.opacity ?? 0.7) : 0;
      const [r, g, b, a] = hexToRgba(layer.color, alpha);
      library.set_layer_color(layer.layerNumber, layer.datatype, r, g, b, a);
      library.set_layer_fill_pattern(
        layer.layerNumber,
        layer.datatype,
        FILL_PATTERN_IDS[layer.fillPattern ?? "solid"] ?? 0,
      );
    }
  }, [library, layers]);

  // Add rectangle helper
  const addRectangle = useCallback(
    (x: number, y: number, width: number, height: number, layer: number) => {
      if (!library) return null;
      const id = library.add_rectangle(x, y, width, height, layer, 0);
      return id ?? null;
    },
    [library],
  );

  // Add polygon helper
  const addPolygon = useCallback(
    (points: number[], layer: number) => {
      if (!library) return null;
      const id = library.add_polygon(new Float64Array(points), layer, 0);
      return id ?? null;
    },
    [library],
  );

  // Clear active cell
  const clearCell = useCallback(() => {
    if (!library) return;
    library.clear_active_cell();
  }, [library]);

  return {
    library,
    isReady,
    addRectangle,
    addPolygon,
    clearCell,
  };
}
