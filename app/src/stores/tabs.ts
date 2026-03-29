/**
 * Tab management store for multi-document editing.
 *
 * Each tab represents an independent GDS file with its own isolated state:
 * WASM library, layers, undo/redo history, viewport, selection, explorer, etc.
 *
 * Uses a snapshot/restore pattern: when switching tabs, the current tab's
 * per-document store states are saved to a snapshot map, and the target
 * tab's snapshot is restored into the global stores. This avoids creating
 * per-tab store instances and keeps existing components unchanged.
 *
 * WasmLibrary instances stay alive in memory (not serialized) since they
 * hold full GDS data. They're swapped via the wasm-context store.
 */

import { create } from "zustand";
import type { WasmLibrary } from "@/wasm/rosette_wasm";
import type { Layer } from "@/stores/layer";
import type { Command } from "@/lib/commands";
import type { Ruler } from "@/stores/ruler";
import type { CellNode } from "@/stores/explorer";
import type { PathMetadata } from "@/stores/path";
import type { ClipboardSnapshot } from "@/stores/clipboard";
import type { ToolType } from "@/stores/tool";

import { useViewportStore, DEFAULT_ZOOM } from "@/stores/viewport";
import { useSelectionStore } from "@/stores/selection";
import { useHistoryStore } from "@/stores/history";
import { useLayerStore, DEFAULT_LAYERS } from "@/stores/layer";
import { useExplorerStore } from "@/stores/explorer";
import { useToolStore } from "@/stores/tool";
import { usePathStore, DEFAULT_PATH_WIDTH, DEFAULT_NUM_ARC_POINTS } from "@/stores/path";
import { useRulerStore } from "@/stores/ruler";
import { useClipboardStore } from "@/stores/clipboard";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useDocumentStore } from "@/stores/document";

// =============================================================================
// Types
// =============================================================================

/** A single tab representing an open document. */
export interface Tab {
  /** Unique tab identifier. */
  id: string;
  /** Display title (filename or "untitled"). */
  title: string;
  /** File path on disk (Tauri only). Null for new unsaved files. */
  filePath: string | null;
  /** Whether the document has unsaved changes. */
  isDirty: boolean;
}

/** Snapshot of all per-tab store states. Saved when switching away from a tab. */
export interface TabSnapshot {
  // Viewport
  viewport: {
    zoom: number;
    offset: { x: number; y: number };
    initialized: boolean;
  };

  // Selection
  selection: {
    selectedIds: Set<string>;
    hoveredId: string | null;
    lastSelectedId: string | null;
  };

  // History (command stacks)
  history: {
    undoStack: Command[];
    redoStack: Command[];
  };

  // Layers
  layers: {
    layers: Map<number, Layer>;
    activeLayerId: number;
  };

  // Explorer
  explorer: {
    projectName: string;
    cells: string[];
    cellTree: CellNode[] | null;
    expandedCells: Set<string>;
    activeCell: string | null;
    cellsLoaded: boolean;
    hierarchyLevelLimit: number;
    maxTreeDepth: number;
    hiddenCells: Set<string>;
  };

  // Tool
  tool: {
    activeTool: ToolType;
  };

  // Path tool
  path: {
    width: number;
    cornerRadius: number;
    numArcPoints: number;
    pathMetadata: Map<string, PathMetadata>;
  };

  // Rulers
  rulers: {
    rulers: Map<string, Ruler>;
    selectedRulerIds: Set<string>;
  };

  // Clipboard
  clipboard: {
    elements: ClipboardSnapshot[];
    hasContent: boolean;
  };

  // Document dirty state
  document: {
    isDirty: boolean;
  };
}

// =============================================================================
// Tab store
// =============================================================================

interface TabsState {
  /** All open tabs, in display order. */
  tabs: Tab[];
  /** ID of the currently active tab. */
  activeTabId: string | null;

  /** Create a new tab and make it active. Returns the new tab ID. */
  addTab: (options?: { title?: string; filePath?: string | null }) => string;
  /** Close a tab by ID. Returns true if a tab was closed. */
  closeTab: (id: string) => boolean;
  /** Switch to a tab by ID. */
  setActiveTab: (id: string) => void;
  /** Update a tab's properties. */
  updateTab: (id: string, patch: Partial<Pick<Tab, "title" | "filePath" | "isDirty">>) => void;
  /** Get the active tab. */
  getActiveTab: () => Tab | null;
  /** Get a tab by ID. */
  getTab: (id: string) => Tab | undefined;
  /** Find a tab by file path. */
  findTabByPath: (filePath: string) => Tab | undefined;
}

function generateTabId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useTabsStore = create<TabsState>((set, get) => ({
  tabs: [],
  activeTabId: null,

  addTab: (options) => {
    const id = generateTabId();
    const tab: Tab = {
      id,
      title: options?.title ?? "untitled",
      filePath: options?.filePath ?? null,
      isDirty: false,
    };

    set((state) => ({
      tabs: [...state.tabs, tab],
      activeTabId: id,
    }));

    return id;
  },

  closeTab: (id) => {
    const state = get();
    const tabIndex = state.tabs.findIndex((t) => t.id === id);
    if (tabIndex === -1) return false;

    const newTabs = state.tabs.filter((t) => t.id !== id);

    // Determine new active tab
    let newActiveTabId = state.activeTabId;
    if (state.activeTabId === id) {
      if (newTabs.length === 0) {
        newActiveTabId = null;
      } else if (tabIndex < newTabs.length) {
        // Select the tab at the same index (the one that slides in)
        newActiveTabId = newTabs[tabIndex].id;
      } else {
        // Was the last tab, select the new last tab
        newActiveTabId = newTabs[newTabs.length - 1].id;
      }
    }

    set({ tabs: newTabs, activeTabId: newActiveTabId });
    return true;
  },

  setActiveTab: (id) => {
    const state = get();
    if (state.tabs.some((t) => t.id === id)) {
      set({ activeTabId: id });
    }
  },

  updateTab: (id, patch) => {
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  },

  getActiveTab: () => {
    const state = get();
    if (!state.activeTabId) return null;
    return state.tabs.find((t) => t.id === state.activeTabId) ?? null;
  },

  getTab: (id) => get().tabs.find((t) => t.id === id),

  findTabByPath: (filePath) => get().tabs.find((t) => t.filePath === filePath),
}));

// =============================================================================
// Snapshot management (module-level, outside the store)
// =============================================================================

/** Per-tab state snapshots keyed by tab ID. */
const tabSnapshots = new Map<string, TabSnapshot>();

/** Per-tab WasmLibrary instances keyed by tab ID. */
const tabLibraries = new Map<string, WasmLibrary>();

/**
 * Save the current global store states as a snapshot for the given tab.
 */
export function saveTabSnapshot(tabId: string): void {
  const viewport = useViewportStore.getState();
  const selection = useSelectionStore.getState();
  const history = useHistoryStore.getState();
  const layers = useLayerStore.getState();
  const explorer = useExplorerStore.getState();
  const tool = useToolStore.getState();
  const path = usePathStore.getState();
  const ruler = useRulerStore.getState();
  const clipboard = useClipboardStore.getState();
  const document = useDocumentStore.getState();

  const snapshot: TabSnapshot = {
    viewport: {
      zoom: viewport.zoom,
      offset: { ...viewport.offset },
      initialized: viewport.initialized,
    },
    selection: {
      selectedIds: new Set(selection.selectedIds),
      hoveredId: selection.hoveredId,
      lastSelectedId: selection.lastSelectedId,
    },
    history: {
      undoStack: [...history.undoStack],
      redoStack: [...history.redoStack],
    },
    layers: {
      layers: new Map(layers.layers),
      activeLayerId: layers.activeLayerId,
    },
    explorer: {
      projectName: explorer.projectName,
      cells: [...explorer.cells],
      cellTree: explorer.cellTree,
      expandedCells: new Set(explorer.expandedCells),
      activeCell: explorer.activeCell,
      cellsLoaded: explorer.cellsLoaded,
      hierarchyLevelLimit: explorer.hierarchyLevelLimit,
      maxTreeDepth: explorer.maxTreeDepth,
      hiddenCells: new Set(explorer.hiddenCells),
    },
    tool: {
      activeTool: tool.activeTool,
    },
    path: {
      width: path.width,
      cornerRadius: path.cornerRadius,
      numArcPoints: path.numArcPoints,
      pathMetadata: new Map(path.pathMetadata),
    },
    rulers: {
      rulers: new Map(ruler.rulers),
      selectedRulerIds: new Set(ruler.selectedRulerIds),
    },
    clipboard: {
      elements: [...clipboard.elements],
      hasContent: clipboard.hasContent,
    },
    document: {
      isDirty: document.isDirty,
    },
  };

  tabSnapshots.set(tabId, snapshot);

  // Also sync dirty state to the tab
  useTabsStore.getState().updateTab(tabId, { isDirty: document.isDirty });
}

/**
 * Restore a tab's snapshot into the global stores.
 */
export function restoreTabSnapshot(tabId: string): void {
  const snapshot = tabSnapshots.get(tabId);
  if (!snapshot) return;

  // Restore viewport
  useViewportStore.setState({
    zoom: snapshot.viewport.zoom,
    offset: { ...snapshot.viewport.offset },
    initialized: snapshot.viewport.initialized,
  });

  // Restore selection
  useSelectionStore.setState({
    selectedIds: new Set(snapshot.selection.selectedIds),
    hoveredId: snapshot.selection.hoveredId,
    lastSelectedId: snapshot.selection.lastSelectedId,
  });

  // Restore history
  useHistoryStore.setState({
    undoStack: [...snapshot.history.undoStack],
    redoStack: [...snapshot.history.redoStack],
    canUndo: snapshot.history.undoStack.length > 0,
    canRedo: snapshot.history.redoStack.length > 0,
  });

  // Restore layers (clear transient keyboard focus state)
  useLayerStore.setState({
    layers: new Map(snapshot.layers.layers),
    activeLayerId: snapshot.layers.activeLayerId,
    editingLayerId: null,
    expandedLayerId: null,
    isFocused: false,
    focusedLayerId: null,
  });

  // Restore explorer (clear transient keyboard focus state)
  useExplorerStore.setState({
    projectName: snapshot.explorer.projectName,
    cells: [...snapshot.explorer.cells],
    cellTree: snapshot.explorer.cellTree,
    expandedCells: new Set(snapshot.explorer.expandedCells),
    activeCell: snapshot.explorer.activeCell,
    editingCellName: null,
    cellsLoaded: snapshot.explorer.cellsLoaded,
    hierarchyLevelLimit: snapshot.explorer.hierarchyLevelLimit,
    maxTreeDepth: snapshot.explorer.maxTreeDepth,
    hiddenCells: new Set(snapshot.explorer.hiddenCells),
    isFocused: false,
    focusedItem: null,
  });

  // Restore tool
  useToolStore.setState({
    activeTool: snapshot.tool.activeTool,
    toolSetAt: Date.now(),
  });

  // Restore path
  usePathStore.setState({
    width: snapshot.path.width,
    cornerRadius: snapshot.path.cornerRadius,
    numArcPoints: snapshot.path.numArcPoints,
    pathMetadata: new Map(snapshot.path.pathMetadata),
  });

  // Restore rulers
  useRulerStore.setState({
    rulers: new Map(snapshot.rulers.rulers),
    activeRulerId: null,
    previewEnd: null,
    selectedRulerIds: new Set(snapshot.rulers.selectedRulerIds),
    hoveredRulerId: null,
    marqueePreviewIds: new Set(),
    hoveredEndpoint: null,
    draggingEndpoint: null,
    draggingEndpointOriginal: null,
    isMovingRuler: false,
    moveStartPoint: null,
    moveOriginalPoint: null,
    snapPoint: null,
  });

  // Restore clipboard
  useClipboardStore.setState({
    elements: [...snapshot.clipboard.elements],
    hasContent: snapshot.clipboard.hasContent,
  });

  // Restore document dirty state
  useDocumentStore.setState({
    isDirty: snapshot.document.isDirty,
  });

  // Restore WASM library reference
  const library = tabLibraries.get(tabId) ?? null;
  useWasmContextStore.setState({ library });
  useWasmContextStore.getState().bumpSyncGeneration();
}

/**
 * Delete a tab's snapshot and free its WASM library.
 */
export function deleteTabSnapshot(tabId: string): void {
  tabSnapshots.delete(tabId);
  const lib = tabLibraries.get(tabId);
  if (lib) {
    lib.free();
    tabLibraries.delete(tabId);
  }
}

/**
 * Set the WASM library for a tab.
 */
export function setTabLibrary(tabId: string, library: WasmLibrary): void {
  tabLibraries.set(tabId, library);
}

/**
 * Get the WASM library for a tab (without removing it).
 */
export function getTabLibrary(tabId: string): WasmLibrary | null {
  return tabLibraries.get(tabId) ?? null;
}

/**
 * Switch from one tab to another.
 *
 * Saves the current tab's state, then restores the target tab's state.
 * The tabs store's activeTabId should be updated after calling this.
 */
export function switchTab(fromTabId: string | null, toTabId: string): void {
  // Save current tab's state
  if (fromTabId && fromTabId !== toTabId) {
    saveTabSnapshot(fromTabId);

    // Also save current library reference
    const currentLibrary = useWasmContextStore.getState().library;
    if (currentLibrary) {
      tabLibraries.set(fromTabId, currentLibrary);
    }
  }

  // Restore target tab's state
  restoreTabSnapshot(toTabId);
}

/**
 * Create default snapshot state for a new tab.
 */
function createDefaultSnapshot(): TabSnapshot {
  return {
    viewport: {
      zoom: DEFAULT_ZOOM,
      offset: { x: 0, y: 0 },
      initialized: false,
    },
    selection: {
      selectedIds: new Set(),
      hoveredId: null,
      lastSelectedId: null,
    },
    history: {
      undoStack: [],
      redoStack: [],
    },
    layers: {
      layers: new Map(DEFAULT_LAYERS.map((l) => [l.id, l])),
      activeLayerId: 1,
    },
    explorer: {
      projectName: "untitled-project",
      cells: ["top"],
      cellTree: null,
      expandedCells: new Set(),
      activeCell: "top",
      cellsLoaded: true,
      hierarchyLevelLimit: Infinity,
      maxTreeDepth: 0,
      hiddenCells: new Set(),
    },
    tool: {
      activeTool: "select",
    },
    path: {
      width: DEFAULT_PATH_WIDTH,
      cornerRadius: 0,
      numArcPoints: DEFAULT_NUM_ARC_POINTS,
      pathMetadata: new Map(),
    },
    rulers: {
      rulers: new Map(),
      selectedRulerIds: new Set(),
    },
    clipboard: {
      elements: [],
      hasContent: false,
    },
    document: {
      isDirty: false,
    },
  };
}

/**
 * Initialize a new tab with default state and a fresh WASM library.
 *
 * Creates a new WasmLibrary with one "top" cell and saves the initial
 * snapshot. Call this right after addTab() for new empty tabs.
 */
export function initNewTab(tabId: string, wasm: typeof import("@/wasm/rosette_wasm")): WasmLibrary {
  const lib = new wasm.WasmLibrary("rosette");
  try {
    lib.add_cell("top");
  } catch {
    // "top" is a valid cell name; this should never fail
  }
  lib.set_active_cell("top");

  tabLibraries.set(tabId, lib);

  const snapshot = createDefaultSnapshot();
  tabSnapshots.set(tabId, snapshot);

  return lib;
}

/**
 * Initialize a new tab with a loaded WASM library (for opening files).
 *
 * Saves the library and creates an initial snapshot. The caller is
 * responsible for setting up layers, explorer state, etc. in the snapshot
 * after calling this.
 */
export function initTabWithLibrary(
  tabId: string,
  library: WasmLibrary,
  snapshotOverrides?: Partial<TabSnapshot>,
): void {
  tabLibraries.set(tabId, library);
  const snapshot = { ...createDefaultSnapshot(), ...snapshotOverrides };
  tabSnapshots.set(tabId, snapshot);
}
