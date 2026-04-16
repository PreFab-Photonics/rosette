import { create } from "zustand";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useExplorerStore } from "@/stores/explorer";
import { useLayerStore } from "@/stores/layer";

/**
 * Per-layer area data for the area calculator dialog.
 */
export interface LayerArea {
  /** GDS layer number. */
  layerNumber: number;
  /** GDS datatype. */
  datatype: number;
  /** Total polygon area on this layer (in design units squared). */
  area: number;
  /** Display name from the layer store (falls back to "Layer N"). */
  name: string;
  /** Hex color from the layer store. */
  color: string;
}

/**
 * State for the area calculator dialog.
 *
 * Opened from the command palette. Computes per-layer polygon area
 * for the active cell (including all instanced cells recursively).
 */
interface AreaDialogState {
  /** Whether the dialog is open. */
  isOpen: boolean;
  /** Per-layer area breakdown. */
  layerAreas: LayerArea[];
  /** Sum of all layer areas. */
  totalArea: number;
  /** Name of the cell being measured. */
  cellName: string;

  /** Compute areas and open the dialog. */
  open: () => void;
  /** Close the dialog. */
  close: () => void;
}

export const useAreaDialogStore = create<AreaDialogState>()((set) => ({
  isOpen: false,
  layerAreas: [],
  totalArea: 0,
  cellName: "",

  open: () => {
    const library = useWasmContextStore.getState().library;
    const activeCell = useExplorerStore.getState().activeCell;

    if (!library || !activeCell) return;

    // get_area_by_layer returns Float64Array: [layer, dt, area, layer, dt, area, ...]
    const raw = library.get_area_by_layer();
    const layers = useLayerStore.getState().layers;

    // Build a lookup: "layerNumber:datatype" → Layer
    const layerLookup = new Map<string, { name: string; color: string }>();
    for (const layer of layers.values()) {
      layerLookup.set(`${layer.layerNumber}:${layer.datatype}`, {
        name: layer.name,
        color: layer.color,
      });
    }

    const layerAreas: LayerArea[] = [];
    let totalArea = 0;

    for (let i = 0; i < raw.length; i += 3) {
      const layerNumber = raw[i];
      const datatype = raw[i + 1];
      const area = raw[i + 2];

      const key = `${layerNumber}:${datatype}`;
      const info = layerLookup.get(key);

      layerAreas.push({
        layerNumber,
        datatype,
        area,
        name: info?.name ?? `Layer ${layerNumber}`,
        color: info?.color ?? "#888888",
      });

      totalArea += area;
    }

    set({ isOpen: true, layerAreas, totalArea, cellName: activeCell });
  },

  close: () => set({ isOpen: false }),
}));
