import { create } from "zustand";
import type { ProjectComponent } from "@/lib/project-components";

interface ComponentDialogState {
  component: ProjectComponent | null;
  open: (component: ProjectComponent) => void;
  close: () => void;
}

export const useComponentDialogStore = create<ComponentDialogState>()((set) => ({
  component: null,
  open: (component) => set({ component }),
  close: () => set({ component: null }),
}));
