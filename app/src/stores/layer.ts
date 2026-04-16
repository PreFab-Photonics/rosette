import { create } from "zustand";
import paletteData from "./palette.json";

/**
 * Fill pattern for layer rendering.
 */
export type FillPattern =
  | "solid"
  | "hatched"
  | "crosshatched"
  | "dotted"
  | "horizontal"
  | "vertical"
  | "zigzag"
  | "brick";

/** Maps fill pattern names to WASM renderer IDs. Single source of truth. */
export const FILL_PATTERN_IDS: Record<FillPattern, number> = {
  solid: 0,
  hatched: 1,
  crosshatched: 2,
  dotted: 3,
  horizontal: 4,
  vertical: 5,
  zigzag: 6,
  brick: 7,
};

/**
 * Color palette for layers. Used when auto-assigning colors to new layers
 * and as preset swatches in the color picker. Shared with the Rust
 * rasterizer (`crates/rosette-raster`) via `palette.json` — edit there.
 */
export const LAYER_PALETTE: string[] = paletteData.colors;

/** Maximum allowed value for GDS layer number and datatype. */
export const MAX_LAYER_NUMBER = 999;

/**
 * A layer for organizing shapes.
 *
 * Uses GDS layer number + datatype convention for proper foundry PDK compatibility.
 */
export interface Layer {
  /** Unique internal ID for React keys and lookups. */
  id: number;
  /** GDS layer number. */
  layerNumber: number;
  /** GDS datatype (default 0). */
  datatype: number;
  /** Display name. */
  name: string;
  /** Color in hex format (e.g., "#ff0000"). */
  color: string;
  /** Whether the layer is visible. */
  visible: boolean;
  /** Fill pattern for rendering (default "solid"). */
  fillPattern: FillPattern;
  /** Fill opacity 0.0-1.0 (default 0.7). */
  opacity: number;
}

/**
 * Default layers matching the rosette.toml template.
 */
export const DEFAULT_LAYERS: Layer[] = [
  {
    id: 1,
    layerNumber: 1,
    datatype: 0,
    name: "silicon",
    color: "#ff69b4",
    visible: true,
    fillPattern: "solid",
    opacity: 0.7,
  },
  {
    id: 2,
    layerNumber: 10,
    datatype: 0,
    name: "text",
    color: "#607d8b",
    visible: true,
    fillPattern: "dotted",
    opacity: 0.7,
  },
];

/**
 * Layer state management.
 */
interface LayerState {
  /** All layers indexed by ID. */
  layers: Map<number, Layer>;
  /** Currently active layer ID. */
  activeLayerId: number;
  /** Layer ID currently being edited (inline rename). Null when not editing. */
  editingLayerId: number | null;
  /** Layer ID with expanded editor open. Null when none expanded. */
  expandedLayerId: number | null;

  /** Whether the Layers panel has keyboard focus for arrow-key navigation. */
  isFocused: boolean;
  /** The layer ID currently highlighted by the keyboard cursor. */
  focusedLayerId: number | null;

  /** Get a layer by ID. */
  getLayer: (id: number) => Layer | undefined;
  /** Get the active layer. */
  getActiveLayer: () => Layer | undefined;
  /** Set the active layer. */
  setActiveLayer: (id: number) => void;
  /** Add or update a layer. */
  setLayer: (layer: Layer) => void;
  /** Add a new layer with auto-generated ID and layer number. */
  addLayer: (name?: string, color?: string) => Layer;
  /** Delete a layer by ID. */
  deleteLayer: (id: number) => void;
  /** Toggle layer visibility. */
  toggleVisibility: (id: number) => void;
  /** Set all layers visible. */
  showAllLayers: () => void;
  /** Set all layers hidden. */
  hideAllLayers: () => void;
  /** Get all layers as array (sorted by layer number). */
  getAllLayers: () => Layer[];
  /** Check if a layer number + datatype combination exists. */
  layerExists: (layerNumber: number, datatype: number) => boolean;
  /** Replace all layers with a new set (used when loading a GDS file). */
  resetLayers: (newLayers: Layer[]) => void;
  /** Set the layer being edited (for triggering inline rename from context menu). */
  setEditingLayerId: (id: number | null) => void;
  /** Set the layer with expanded editor. */
  setExpandedLayerId: (id: number | null) => void;
  /** Set keyboard focus state for the Layers panel. */
  setFocused: (focused: boolean) => void;
  /** Set the keyboard-cursor layer ID. */
  setFocusedLayerId: (id: number | null) => void;
}

export const useLayerStore = create<LayerState>((set, get) => ({
  layers: new Map(DEFAULT_LAYERS.map((l) => [l.id, l])),
  activeLayerId: 1,
  editingLayerId: null,
  expandedLayerId: null,
  isFocused: false,
  focusedLayerId: null,

  getLayer: (id) => get().layers.get(id),

  getActiveLayer: () => {
    const state = get();
    return state.layers.get(state.activeLayerId);
  },

  setActiveLayer: (id) => set({ activeLayerId: id }),

  setLayer: (layer) =>
    set((state) => {
      const newLayers = new Map(state.layers);
      newLayers.set(layer.id, layer);
      return { layers: newLayers };
    }),

  addLayer: (name?: string, color?: string) => {
    const state = get();
    const existingLayers = Array.from(state.layers.values());

    // Find next available layer number (capped at MAX_LAYER_NUMBER)
    let nextLayerNumber = 1;
    const usedNumbers = new Set(existingLayers.map((l) => l.layerNumber));
    while (usedNumbers.has(nextLayerNumber) && nextLayerNumber <= MAX_LAYER_NUMBER) {
      nextLayerNumber++;
    }
    if (nextLayerNumber > MAX_LAYER_NUMBER) {
      // All layer numbers 1..999 are in use — return a dummy to satisfy the type,
      // but don't actually add it. Callers should check the store.
      return existingLayers[0];
    }

    // Generate unique ID
    const maxId = Math.max(0, ...existingLayers.map((l) => l.id));
    const newId = maxId + 1;

    // Pick next color from palette (cycling), or use the provided color
    const usedColors = new Set(existingLayers.map((l) => l.color));
    const newColor =
      color ??
      LAYER_PALETTE.find((c) => !usedColors.has(c)) ??
      LAYER_PALETTE[existingLayers.length % LAYER_PALETTE.length];

    const newLayer: Layer = {
      id: newId,
      layerNumber: nextLayerNumber,
      datatype: 0,
      name: name ?? `layer${nextLayerNumber}`,
      color: newColor,
      visible: true,
      fillPattern: "solid",
      opacity: 0.7,
    };

    set((s) => {
      const newLayers = new Map(s.layers);
      newLayers.set(newLayer.id, newLayer);
      return { layers: newLayers, activeLayerId: newLayer.id };
    });

    return newLayer;
  },

  deleteLayer: (id) =>
    set((state) => {
      if (state.layers.size <= 1) return state; // Don't delete last layer

      const newLayers = new Map(state.layers);
      newLayers.delete(id);

      // If deleting active layer, switch to first available
      let newActiveId = state.activeLayerId;
      if (state.activeLayerId === id) {
        newActiveId = newLayers.keys().next().value ?? 1;
      }

      const focusedLayerId = state.focusedLayerId === id ? null : state.focusedLayerId;
      return { layers: newLayers, activeLayerId: newActiveId, focusedLayerId };
    }),

  toggleVisibility: (id) =>
    set((state) => {
      const layer = state.layers.get(id);
      if (!layer) return state;

      const newLayers = new Map(state.layers);
      newLayers.set(id, { ...layer, visible: !layer.visible });
      return { layers: newLayers };
    }),

  showAllLayers: () =>
    set((state) => {
      const newLayers = new Map(state.layers);
      for (const [id, layer] of newLayers) {
        newLayers.set(id, { ...layer, visible: true });
      }
      return { layers: newLayers };
    }),

  hideAllLayers: () =>
    set((state) => {
      const newLayers = new Map(state.layers);
      for (const [id, layer] of newLayers) {
        newLayers.set(id, { ...layer, visible: false });
      }
      return { layers: newLayers };
    }),

  getAllLayers: () =>
    Array.from(get().layers.values()).sort(
      (a, b) => a.layerNumber - b.layerNumber || a.datatype - b.datatype,
    ),

  layerExists: (layerNumber, datatype) => {
    const layers = get().layers;
    for (const layer of layers.values()) {
      if (layer.layerNumber === layerNumber && layer.datatype === datatype) {
        return true;
      }
    }
    return false;
  },

  resetLayers: (newLayers) =>
    set(() => {
      const layers = new Map(newLayers.map((l) => [l.id, l]));
      const activeLayerId = newLayers[0]?.id ?? 1;
      return {
        layers,
        activeLayerId,
        editingLayerId: null,
        expandedLayerId: null,
        isFocused: false,
        focusedLayerId: null,
      };
    }),

  setEditingLayerId: (id) => set({ editingLayerId: id }),
  setExpandedLayerId: (id) => set({ expandedLayerId: id }),
  setFocused: (focused) => {
    if (focused) {
      const state = get();
      const focusedLayerId = state.activeLayerId;
      set({ isFocused: true, focusedLayerId });
    } else {
      set({ isFocused: false, focusedLayerId: null });
    }
  },
  setFocusedLayerId: (id) => set({ focusedLayerId: id }),
}));

/**
 * Convert hex color to RGBA float array for WASM.
 *
 * @param hex - Hex color string (e.g., "#ff0000")
 * @param alpha - Alpha value (0.0-1.0, default 0.7)
 * @returns [r, g, b, a] array with values 0.0-1.0
 */
export function hexToRgba(hex: string, alpha = 0.7): [number, number, number, number] {
  const cleanHex = hex.replace("#", "");
  const r = Number.parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = Number.parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = Number.parseInt(cleanHex.slice(4, 6), 16) / 255;
  return [r, g, b, alpha];
}
