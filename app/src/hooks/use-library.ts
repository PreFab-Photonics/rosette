import { useState, useEffect, useCallback, useRef } from "react";
import type { WasmLibrary } from "@/wasm/rosette_wasm";
import { useExplorerStore } from "@/stores/explorer";
import type { CellNode } from "@/stores/explorer";
import { useLayerStore, hexToRgba, FILL_PATTERN_IDS } from "@/stores/layer";

// Module-level singleton for library
let libraryInstance: WasmLibrary | null = null;

/**
 * Check if running in design preview mode.
 * Design mode is activated by the `?design=true` URL parameter,
 * set by `rosette serve`.
 */
function isDesignMode(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get("design") === "true";
}

/**
 * Response from the /api/design SSE endpoint.
 */
interface DesignResponse {
  version: number;
  json: string | null;
  /** Cell hierarchy tree (design mode) or flat list (legacy). */
  cells: CellNode | string[] | null;
}

/**
 * Response from /api/design/navigate.
 */
interface NavigateResponse {
  json: string;
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
  layers: Map<number, { color: string; layerNumber: number; datatype: number; visible?: boolean }>,
  defaultAlpha = 0.7,
) {
  for (const layer of layers.values()) {
    const alpha = layer.visible ? defaultAlpha : 0;
    const [r, g, b, a] = hexToRgba(layer.color, alpha);
    lib.set_layer_color(layer.layerNumber, layer.datatype, r, g, b, a);
  }
}

/**
 * Hook to manage the WasmLibrary instance.
 *
 * Creates a singleton library with a default cell and syncs layer colors.
 * In design mode (`?design=true`), connects to `/api/design/events` SSE
 * for live updates from `rosette serve`, and supports navigating into
 * nested cells via `/api/design/navigate`.
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
  // Track which cell the current library was loaded for (to avoid redundant navigations)
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
      lib.add_cell("top");
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

            // Sync layer colors (use ref to avoid effect dependency)
            syncLayerColors(newLibrary, layersRef.current);

            // Free old library to prevent memory leak
            if (libraryInstance) {
              libraryInstance.free();
            }

            libraryInstance = newLibrary;
            setLibrary(newLibrary);
            setIsReady(true);
            designVersionRef.current = data.version;

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
    // (e.g., SSE just loaded the top cell — no need to re-fetch it)
    if (loadedCellRef.current === activeCell) return;

    let cancelled = false;

    const navigateToCell = async () => {
      try {
        const res = await fetch("/api/design/navigate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cell: activeCell }),
        });

        if (!res.ok || cancelled) return;

        const data: NavigateResponse = await res.json();
        if (cancelled || !data.json) return;

        const newLibrary = wasm.WasmLibrary.from_flat_json(data.json);
        syncLayerColors(newLibrary, layersRef.current);

        // Free old library
        if (libraryInstance) {
          libraryInstance.free();
        }

        libraryInstance = newLibrary;
        loadedCellRef.current = activeCell;
        setLibrary(newLibrary);
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
