import { create } from "zustand";

/**
 * Fill pattern for layer rendering.
 */
export type FillPattern = "solid" | "hatched" | "crosshatched" | "dotted";

/** Maps fill pattern names to WASM renderer IDs. Single source of truth. */
export const FILL_PATTERN_IDS: Record<FillPattern, number> = {
  solid: 0,
  hatched: 1,
  crosshatched: 2,
  dotted: 3,
};

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
 * Default layers matching common photonic PDKs.
 */
const DEFAULT_LAYERS: Layer[] = [
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
    layerNumber: 2,
    datatype: 0,
    name: "text",
    color: "#78909c",
    visible: true,
    fillPattern: "solid",
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
  /** Set the layer being edited (for triggering inline rename from context menu). */
  setEditingLayerId: (id: number | null) => void;
  /** Set the layer with expanded editor. */
  setExpandedLayerId: (id: number | null) => void;
}

export const useLayerStore = create<LayerState>((set, get) => ({
  layers: new Map(DEFAULT_LAYERS.map((l) => [l.id, l])),
  activeLayerId: 1,
  editingLayerId: null,
  expandedLayerId: null,

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

    // Find next available layer number
    let nextLayerNumber = 1;
    const usedNumbers = new Set(existingLayers.map((l) => l.layerNumber));
    while (usedNumbers.has(nextLayerNumber)) {
      nextLayerNumber++;
    }

    // Generate unique ID
    const maxId = Math.max(0, ...existingLayers.map((l) => l.id));
    const newId = maxId + 1;

    // Generate random color if not provided
    const newColor =
      color ??
      `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;

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

      return { layers: newLayers, activeLayerId: newActiveId };
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
    Array.from(get().layers.values()).sort((a, b) => a.layerNumber - b.layerNumber),

  layerExists: (layerNumber, datatype) => {
    const layers = get().layers;
    for (const layer of layers.values()) {
      if (layer.layerNumber === layerNumber && layer.datatype === datatype) {
        return true;
      }
    }
    return false;
  },

  setEditingLayerId: (id) => set({ editingLayerId: id }),
  setExpandedLayerId: (id) => set({ expandedLayerId: id }),
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
