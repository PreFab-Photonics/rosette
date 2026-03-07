import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Selection outline colors by theme.
 */
export const SELECTION_COLORS = {
  dark: "#44ff44", // Bright green
  light: "#44ff44", // Bright green
} as const;

/**
 * Hover outline colors by theme.
 */
export const HOVER_COLORS = {
  dark: "#ffffff", // White for dark mode
  light: "#000000", // Black for light mode
} as const;

/** Theme setting options. */
export type ThemeSetting = "light" | "dark" | "system";

/** Resolved theme (always light or dark). */
export type ResolvedTheme = "light" | "dark";

/**
 * Get the system's preferred color scheme.
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Resolve a theme setting to an actual theme.
 */
function resolveTheme(setting: ThemeSetting): ResolvedTheme {
  return setting === "system" ? getSystemTheme() : setting;
}

/** Sidebar tab identifiers. */
export type SidebarTab = "layers" | "inspector";

/**
 * UI state for application settings and preferences.
 */
interface UIState {
  /** User's theme preference (light, dark, or system). */
  themeSetting: ThemeSetting;
  /** Resolved color theme (always light or dark). */
  theme: ResolvedTheme;
  /** Whether the WASM module is loaded. */
  wasmReady: boolean;
  /** Current cursor position in world coordinates. */
  cursorWorld: { x: number; y: number } | null;
  /** Active sidebar tab. */
  sidebarTab: SidebarTab;
  /** Whether the inspector panel should focus its first input on next render. */
  inspectorFocusRequested: boolean;
  /** Optional field label to focus on (e.g., "X" under "Origin" section). When null, focuses first input. */
  inspectorFocusField: string | null;
  /** Whether the grid is visible on the canvas. */
  showGrid: boolean;
  /** Whether zen mode is active (hides Toolbar, Explorer, Sidebar). */
  zenMode: boolean;
  /** Whether the Explorer panel is collapsed to an icon rail. */
  explorerCollapsed: boolean;
  /** Whether the Sidebar panel is collapsed to an icon rail. */
  sidebarCollapsed: boolean;

  /** Set the theme preference. */
  setThemeSetting: (setting: ThemeSetting) => void;
  /** Toggle between light and dark themes (sets explicit preference). */
  toggleTheme: () => void;
  /** Update resolved theme from system preference. */
  syncSystemTheme: () => void;
  /** Mark WASM as ready. */
  setWasmReady: (ready: boolean) => void;
  /** Update cursor world position. */
  setCursorWorld: (pos: { x: number; y: number } | null) => void;
  /** Get the current selection color based on theme. */
  getSelectionColor: () => string;
  /** Set the active sidebar tab. */
  setSidebarTab: (tab: SidebarTab) => void;
  /** Request focus on the inspector panel's first input field. */
  requestInspectorFocus: () => void;
  /** Request focus on a specific inspector field by label (e.g., "Origin X"). */
  requestInspectorFocusField: (field: string) => void;
  /** Clear the inspector focus request. */
  clearInspectorFocus: () => void;
  /** Toggle grid visibility. */
  toggleGrid: () => void;
  /** Toggle zen mode (hide/show Toolbar, Explorer, Sidebar). */
  toggleZenMode: () => void;
  /** Toggle Explorer panel collapsed state. */
  toggleExplorerCollapsed: () => void;
  /** Toggle Sidebar panel collapsed state. */
  toggleSidebarCollapsed: () => void;
  /** Set Explorer collapsed state directly (used by auto-collapse on breakpoint change). */
  setExplorerCollapsed: (collapsed: boolean) => void;
  /** Set Sidebar collapsed state directly (used by auto-collapse on breakpoint change). */
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      themeSetting: "system",
      theme: getSystemTheme(),
      wasmReady: false,
      cursorWorld: null,
      sidebarTab: "layers",
      inspectorFocusRequested: false,
      inspectorFocusField: null,
      showGrid: true,
      zenMode: false,
      explorerCollapsed: false,
      sidebarCollapsed: false,

      setThemeSetting: (setting) => set({ themeSetting: setting, theme: resolveTheme(setting) }),
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "dark" ? "light" : "dark";
          return { themeSetting: newTheme, theme: newTheme };
        }),
      syncSystemTheme: () =>
        set((state) => {
          if (state.themeSetting === "system") {
            return { theme: getSystemTheme() };
          }
          return {};
        }),
      setWasmReady: (ready) => set({ wasmReady: ready }),
      setCursorWorld: (pos) => set({ cursorWorld: pos }),
      getSelectionColor: () => SELECTION_COLORS[get().theme],
      setSidebarTab: (tab) => set({ sidebarTab: tab }),
      requestInspectorFocus: () =>
        set({ sidebarTab: "inspector", inspectorFocusRequested: true, inspectorFocusField: null }),
      requestInspectorFocusField: (field) =>
        set({ sidebarTab: "inspector", inspectorFocusRequested: true, inspectorFocusField: field }),
      clearInspectorFocus: () => set({ inspectorFocusRequested: false, inspectorFocusField: null }),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
      toggleExplorerCollapsed: () =>
        set((state) => ({ explorerCollapsed: !state.explorerCollapsed })),
      toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setExplorerCollapsed: (collapsed) => set({ explorerCollapsed: collapsed }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: "rosette-ui",
      partialize: (state) => ({
        themeSetting: state.themeSetting,
        showGrid: state.showGrid,
        zenMode: state.zenMode,
        explorerCollapsed: state.explorerCollapsed,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        // Resolve theme on rehydration (in case system preference changed)
        if (state) {
          state.theme = resolveTheme(state.themeSetting);
        }
      },
    },
  ),
);

// Listen for system theme changes
if (typeof window !== "undefined") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    useUIStore.getState().syncSystemTheme();
  });
}
