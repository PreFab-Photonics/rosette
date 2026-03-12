import { useState, useEffect, useCallback, useRef } from "react";
import type { WasmLibrary } from "@/wasm/rosette_wasm";
import { useExplorerStore } from "@/stores/explorer";
import type { CellNode } from "@/stores/explorer";
import {
  useLayerStore,
  hexToRgba,
  FILL_PATTERN_IDS,
  LAYER_PALETTE,
  type Layer,
} from "@/stores/layer";
import { isTauri, readGdsBytes, listenTauri, getPendingFile } from "@/lib/tauri";
import { useWasmContextStore } from "@/stores/wasm-context";
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

/**
 * Get source info for an element by UUID.
 * Returns null if no source tracking is available or the element has no source.
 */
export function getSourceInfo(uuid: string): SourceInfo | null {
  return currentSourceMap?.get(uuid) ?? null;
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
 * Send a vertex edit for a polygon or path element.
 * Vertices are in WASM world coordinates — the server handles conversion to µm.
 */
export function sendVertexEdit(
  elementId: string,
  newVertices: Float64Array,
): void {
  const source = getSourceInfo(elementId);
  if (!source) return;
  if (source.type !== "polygon" && source.type !== "path") return;

  sendSemanticEdit({
    op: "modify_vertices",
    file: source.file,
    line: source.line,
    old_code: source.code,
    vertices: Array.from(newVertices),
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
  if (!source) return;
  if (source.type !== "polygon" && source.type !== "path") return;

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
 * Build UUID → SourceInfo mapping from render polygon order.
 * The render polygons are in the same order as the flat JSON polygons,
 * so we can correlate by index.
 */
function buildSourceMap(
  lib: WasmLibrary,
  serverSourceMap: (SourceInfo | null)[] | null,
): void {
  if (!serverSourceMap || serverSourceMap.length === 0) {
    currentSourceMap = null;
    return;
  }

  const map = new Map<string, SourceInfo>();
  try {
    const renderPolygons = lib.get_render_polygons() as [string, unknown, unknown, unknown][];
    for (let i = 0; i < renderPolygons.length && i < serverSourceMap.length; i++) {
      const uuid = renderPolygons[i][0];
      const source = serverSourceMap[i];
      if (uuid && source) {
        map.set(uuid, source);
      }
    }
  } catch {
    // WASM call failed, no source map
  }

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
 * Check if running in Tauri desktop mode.
 */
function isTauriMode(): boolean {
  return isTauri && !isDesignMode();
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
  /** Source map for two-way editing (parallel to flat JSON polygons). */
  source_map: (SourceInfo | null)[] | null;
  /** Layer definitions from rosette.toml (if available). */
  layers: ServerLayerDef[] | null;
  /** Source filename (e.g., "layout.py" or "mmi.gds"). */
  filename: string | null;
}

/**
 * Response from /api/design/navigate.
 */
interface NavigateResponse {
  json: string;
  source_map: (SourceInfo | null)[] | null;
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
 * for live updates from `rosette serve`, and supports navigating into
 * nested cells via `/api/design/navigate`.
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
  // Track which cell the current library was loaded for (design mode only)
  const loadedCellRef = useRef<string | null>(null);

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

    // In design mode, don't create default library - wait for server data
    if (isDesignMode()) {
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
    // Mark the initial cell as loaded so the navigate effect doesn't fire
    loadedCellRef.current = "top";
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
      loadedCellRef.current = "top";

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
            // Create library from pre-flattened JSON (fast path)
            const newLibrary = wasm.WasmLibrary.from_flat_json(data.json);

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

            if (oldLib) {
              requestAnimationFrame(() => {
                try { oldLib.free(); } catch { /* already freed */ }
              });
            }

            // Build UUID → SourceInfo mapping for two-way editing
            buildSourceMap(newLibrary, data.source_map ?? null);

            // Update explorer with cell hierarchy from the server
            if (data.cells) {
              if (isCellTree(data.cells)) {
                // SSE always delivers the top cell's geometry
                loadedCellRef.current = data.cells.name;
                useExplorerStore.getState().setCellTree([data.cells]);
              } else {
                // Legacy flat list fallback
                loadedCellRef.current = data.cells[0] ?? null;
                useExplorerStore.getState().setCells(data.cells);
              }
            }

            // Set project name from source filename (e.g., "layout.py" or "mmi.gds")
            if (data.filename) {
              useExplorerStore.getState().setProjectName(data.filename);
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

  // Design mode: navigate into a cell when activeCell changes
  const activeCell = useExplorerStore((s) => s.activeCell);
  const cellTree = useExplorerStore((s) => s.cellTree);

  useEffect(() => {
    if (!wasm || !isWasmReady || !isDesignMode() || !cellTree || !activeCell) return;

    // Don't navigate if we haven't loaded the initial design yet
    if (!libraryInstance) return;

    // Skip if the current library already has geometry for this cell
    if (loadedCellRef.current === activeCell) return;

    let cancelled = false;

    const navigateToCell = async () => {
      try {
        // Design mode: use HTTP API
        const res = await fetch("/api/design/navigate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cell: activeCell }),
        });

        if (!res.ok || cancelled) return;

        const data: NavigateResponse = await res.json();
        if (cancelled || !data.json) return;

        const newLibrary = wasm.WasmLibrary.from_flat_json(data.json);
        discoverLayers(newLibrary);
        syncLayerColors(newLibrary, useLayerStore.getState().layers);

        // Defer freeing old library so React re-renders first
        const oldLib = libraryInstance;

        libraryInstance = newLibrary;
        loadedCellRef.current = activeCell;
        setLibrary(newLibrary);

        if (oldLib) {
          requestAnimationFrame(() => {
            try { oldLib.free(); } catch { /* already freed */ }
          });
        }

        // Build source map for the navigated cell
        buildSourceMap(newLibrary, data.source_map ?? null);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to navigate to cell:", err);
        }
      }
    };

    navigateToCell();

    return () => {
      cancelled = true;
    };
  }, [wasm, isWasmReady, activeCell, cellTree]);

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
