import { useState, useEffect, useCallback, useRef } from "react";
import type { WasmLibrary } from "@/wasm/rosette_wasm";
import { useExplorerStore } from "@/stores/explorer";
import type { CellNode } from "@/stores/explorer";
import {
  useLayerStore,
  hexToRgba,
  FILL_PATTERN_IDS,
  LAYER_PALETTE,
  DEFAULT_LAYERS,
  type FillPattern,
  type Layer,
} from "@/stores/layer";
import { isTauri, readGdsBytes, listenTauri, getPendingFile } from "@/lib/tauri";
import { useHistoryStore } from "@/stores/history";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useSelectionStore } from "@/stores/selection";
import { useViewportStore } from "@/stores/viewport";
import { useRulerStore } from "@/stores/ruler";
import { useClipboardStore } from "@/stores/clipboard";
import { useDocumentStore } from "@/stores/document";
import {
  useTabsStore,
  setTabLibrary,
  getTabLibrary,
  saveTabSnapshot,
  initNewTab,
  switchTab,
} from "@/stores/tabs";

// Module-level singleton for library
let libraryInstance: WasmLibrary | null = null;

/**
 * Cache UUID → element index so selection can be restored across SSE library
 * replacements (which create a new WasmLibrary with fresh UUIDs, making old
 * UUIDs return -1 from get_element_index).
 */
const elemIdxCache = new Map<string, number>();

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
 * Reset per-document stores to a clean state (for new tabs).
 */
function resetDocumentStores(): void {
  useHistoryStore.getState().clear();
  useSelectionStore.getState().clearSelection();
  useRulerStore.getState().clearAllRulers();
  useClipboardStore.getState().clear();
  useDocumentStore.getState().markClean();
}

/**
 * Set up a library in the global stores and explorer tree.
 */
function setupLibraryInStores(lib: WasmLibrary, projectName?: string): void {
  const tree = lib.get_cell_tree();
  if (tree) {
    useExplorerStore.getState().setCellTree(tree);
    const topCellName = lib.active_cell_name();
    if (topCellName) {
      useExplorerStore.getState().setActiveCell(topCellName);
    }
  } else {
    useExplorerStore.getState().setCells(["top"]);
  }

  if (projectName) {
    useExplorerStore.getState().setProjectName(projectName);
  }
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
 * Manages tabs: each open file gets its own tab with isolated state.
 *
 * @param wasm - The loaded WASM module
 * @param isWasmReady - Whether the WASM module is ready
 */
export function useLibrary(
  wasm: typeof import("@/wasm/rosette_wasm") | null,
  isWasmReady: boolean,
) {
  const [library, setLibraryState] = useState<WasmLibrary | null>(null);
  const [isReady, setIsReady] = useState(false);
  const layers = useLayerStore((s) => s.layers);
  const layersRef = useRef(layers);
  const designVersionRef = useRef(0);

  // Wrapper that keeps the module-level singleton in sync with React state
  const setLibrary = useCallback((lib: WasmLibrary | null) => {
    libraryInstance = lib;
    setLibraryState(lib);
  }, []);
  const wasmRef = useRef(wasm);

  // Keep refs in sync
  useEffect(() => {
    layersRef.current = layers;
  }, [layers]);
  useEffect(() => {
    wasmRef.current = wasm;
  }, [wasm]);

  // ===== Sync local library state when active tab changes =====
  // When a tab switch happens (via switchTab()), restoreTabSnapshot sets
  // the library in the wasm-context store. But Canvas.tsx gets library from
  // this hook's local React state, so we need to update it here too.
  useEffect(() => {
    const unsub = useTabsStore.subscribe((state, prevState) => {
      if (state.activeTabId && state.activeTabId !== prevState.activeTabId) {
        const lib = getTabLibrary(state.activeTabId);
        if (lib) {
          setLibrary(lib);
          setIsReady(true);
        }
      }
    });
    return unsub;
  }, [setLibrary]);

  // ===== Create initial tab on first load =====
  useEffect(() => {
    if (!wasm || !isWasmReady) return;

    // In design mode or embed mode, don't create default library - wait for server/static data
    if (isDesignMode() || isEmbedMode()) {
      return;
    }

    // Reset stale state from any previous design-mode session
    useExplorerStore.getState().setProjectName("untitled-project");
    useLayerStore.getState().resetLayers(DEFAULT_LAYERS);

    // Check if we already have tabs (e.g., from a hot reload)
    const { tabs } = useTabsStore.getState();
    if (tabs.length > 0) {
      // Re-attach to existing active tab's library
      const activeTabId = useTabsStore.getState().activeTabId;
      if (activeTabId) {
        const existingLib = getTabLibrary(activeTabId);
        if (existingLib) {
          setLibrary(existingLib);
          setIsReady(true);
          return;
        }
      }
    }

    // Create the first tab with a fresh library
    const projectName = useExplorerStore.getState().projectName;
    const tabId = useTabsStore.getState().addTab({ title: projectName });
    const lib = initNewTab(tabId, wasm);

    // Set up explorer
    const tree = lib.get_cell_tree();
    if (tree) {
      useExplorerStore.getState().setCellTree(tree);
    } else {
      useExplorerStore.getState().setCells(["top"]);
    }

    setLibrary(lib);
    setIsReady(true);
  }, [wasm, isWasmReady, setLibrary]);

  // ===== Listen for "new tab" events =====
  useEffect(() => {
    if (!wasm || !isWasmReady) return;

    const handleNewTab = () => {
      // Create a new tab with a fresh library
      const tabId = useTabsStore.getState().addTab({ title: "untitled-project" });
      const lib = initNewTab(tabId, wasm);

      // Reset stores for the new tab
      resetDocumentStores();
      useLayerStore.getState().resetLayers(DEFAULT_LAYERS);

      // Set up explorer
      useExplorerStore.getState().setProjectName("untitled-project");
      const tree = lib.get_cell_tree();
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

      // Install the library
      setLibrary(lib);
      setIsReady(true);

      // Notify overlays that library state changed
      useWasmContextStore.getState().bumpSyncGeneration();
    };

    window.addEventListener("rosette-new-tab", handleNewTab);
    return () => window.removeEventListener("rosette-new-tab", handleNewTab);
  }, [wasm, isWasmReady, setLibrary]);

  // ===== Tauri: listen for file-open events =====
  useEffect(() => {
    if (!wasm || !isWasmReady || !isTauriMode()) return;

    let cancelled = false;

    const handleOpenFile = async (path: string) => {
      if (cancelled) return;

      try {
        // Check if this file is already open in another tab
        const existingTab = useTabsStore.getState().findTabByPath(path);
        if (existingTab) {
          // Switch to the existing tab instead of opening a new one
          const currentId = useTabsStore.getState().activeTabId;
          if (currentId && currentId !== existingTab.id) {
            switchTab(currentId, existingTab.id);
            useTabsStore.getState().setActiveTab(existingTab.id);
            const existingLib = getTabLibrary(existingTab.id);
            if (existingLib) {
              setLibrary(existingLib);
              setIsReady(true);
            }
          }
          return;
        }

        // Read raw GDS bytes and parse directly in WASM (avoids JSON round-trip)
        const bytes = await readGdsBytes(path);
        if (cancelled) return;

        const newLibrary = wasm.WasmLibrary.from_gds_bytes(bytes);

        // Save current tab's state before switching
        const currentTabId = useTabsStore.getState().activeTabId;
        if (currentTabId) {
          saveTabSnapshot(currentTabId);
          const currentLib = useWasmContextStore.getState().library;
          if (currentLib) {
            setTabLibrary(currentTabId, currentLib);
          }
        }

        // Create a new tab for the file
        const basename = path.split(/[/\\]/).pop() ?? "untitled";
        const tabId = useTabsStore.getState().addTab({
          title: basename,
          filePath: path,
        });

        // Set up layers and colors for the new library
        discoverLayers(newLibrary);
        syncLayerColors(newLibrary, useLayerStore.getState().layers);

        // Store the library in the tab
        setTabLibrary(tabId, newLibrary);

        // Reset per-document stores
        resetDocumentStores();

        // Set up explorer tree
        setupLibraryInStores(newLibrary, basename);

        // Reset viewport for the new file
        const canvas = document.getElementById("rosette-canvas");
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          useViewportStore.getState().reset(rect.width, rect.height);
        }

        // Install the new library
        setLibrary(newLibrary);
        setIsReady(true);

        useWasmContextStore.getState().bumpSyncGeneration();
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
  }, [wasm, isWasmReady, setLibrary]);

  // ===== Listen for "new file" events (Cmd+N) =====
  useEffect(() => {
    if (!wasm || !isWasmReady) return;

    const handleNewFile = () => {
      // Save current tab's state before creating new tab
      const currentTabId = useTabsStore.getState().activeTabId;
      if (currentTabId) {
        saveTabSnapshot(currentTabId);
        const currentLib = useWasmContextStore.getState().library;
        if (currentLib) {
          setTabLibrary(currentTabId, currentLib);
        }
      }

      // Create a new tab with a fresh library
      const tabId = useTabsStore.getState().addTab({ title: "untitled-project" });
      const newLib = initNewTab(tabId, wasm);

      // Reset stores for the new tab
      resetDocumentStores();
      useLayerStore.getState().resetLayers(DEFAULT_LAYERS);

      // Set up explorer
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

      // Install the library
      setLibrary(newLib);
      setIsReady(true);

      // Notify overlays that library state changed
      useWasmContextStore.getState().bumpSyncGeneration();
    };

    window.addEventListener("rosette-new-file", handleNewFile);
    return () => window.removeEventListener("rosette-new-file", handleNewFile);
  }, [wasm, isWasmReady, setLibrary]);

  // ===== Design mode: SSE for live design updates from server =====
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

            setLibrary(newLibrary);
            setIsReady(true);
            designVersionRef.current = data.version;

            // Clear undo/redo history — the library was rebuilt from source,
            // so old commands reference stale UUIDs and would silently fail.
            useHistoryStore.getState().clear();

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
                try {
                  oldLib.free();
                } catch {
                  /* already freed */
                }
              });
            }

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
  }, [wasm, isWasmReady, setLibrary]);

  // ===== Embed mode: load a static JSON file once =====
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

        // Free old library to prevent memory leak
        const oldLib = useWasmContextStore.getState().library;
        if (oldLib) {
          oldLib.free();
        }

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
  }, [wasm, isWasmReady, setLibrary]);

  // ===== Sync layer colors and fill patterns to library =====
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
