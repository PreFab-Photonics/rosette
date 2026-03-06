/**
 * Lightweight store for sharing WASM library and renderer refs.
 *
 * Canvas.tsx owns the lifecycle of these objects. This store simply
 * mirrors them so that non-component code (palette commands, future
 * overlay actions) can access them via `getState()`.
 */

import { create } from "zustand";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";

interface WasmContextState {
  library: WasmLibrary | null;
  renderer: WasmRenderer | null;
  /** Incremented every time the library is synced to the renderer. */
  syncGeneration: number;
  setLibrary: (library: WasmLibrary | null) => void;
  setRenderer: (renderer: WasmRenderer | null) => void;
  /** Call after syncing library to renderer to notify subscribers. */
  bumpSyncGeneration: () => void;
}

export const useWasmContextStore = create<WasmContextState>((set) => ({
  library: null,
  renderer: null,
  syncGeneration: 0,
  setLibrary: (library) => set({ library }),
  setRenderer: (renderer) => set({ renderer }),
  bumpSyncGeneration: () => set((s) => ({ syncGeneration: s.syncGeneration + 1 })),
}));
