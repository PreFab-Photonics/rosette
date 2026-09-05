import { create } from "zustand";
import { fetchProjectComponentCatalog, type ProjectComponent } from "@/lib/project-components";

interface ComponentCatalogState {
  components: ProjectComponent[];
  version: number;
  error: string | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  reset: () => void;
}

export const useComponentCatalogStore = create<ComponentCatalogState>()((set) => ({
  components: [],
  version: 0,
  error: null,
  isLoading: false,

  refresh: async () => {
    set({ isLoading: true });
    const catalog = await fetchProjectComponentCatalog();
    if (catalog === null) {
      set({ components: [], version: 0, error: null, isLoading: false });
      return;
    }
    set({ ...catalog, isLoading: false });
  },

  reset: () => set({ components: [], version: 0, error: null, isLoading: false }),
}));
