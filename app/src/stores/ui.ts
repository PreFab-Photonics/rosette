import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyTheme,
  getSystemTheme,
  isThemeSetting,
  resolveTheme,
  subscribeToSystemTheme,
  type ResolvedTheme,
  type ThemeSetting,
} from "@/lib/theme";

export type { ResolvedTheme, ThemeSetting } from "@/lib/theme";

/** Right-click behavior on the canvas. */
export type RightClickMode = "context-menu" | "zoom";

/** Sidebar tab identifiers. */
export type SidebarTab = "layers" | "inspector" | "violations";

/** Default panel width in CSS pixels (Tailwind w-72). */
export const DEFAULT_PANEL_WIDTH = 288;
/** Minimum panel width when resizing. */
export const MIN_PANEL_WIDTH = 200;
/** Maximum panel width when resizing. */
export const MAX_PANEL_WIDTH = 480;

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
  /** Whether rulers (all kinds) are rendered on the canvas. */
  showRulers: boolean;
  /**
   * Last-used ruler sub-tool id, used by the toolbar's `RulerOpsButton` so
   * clicking the main button re-runs the previously chosen sub-tool.
   * Stored as the `ToolType` string to avoid a new enum.
   */
  lastRulerKind: "ruler" | "ruler-super" | "ruler-polyline" | "ruler-angle" | "ruler-radius";
  /** Right-click behavior on canvas: context menu or zoom out. */
  rightClickMode: RightClickMode;
  /** Whether zen mode is active (hides Toolbar, Explorer, Sidebar). */
  zenMode: boolean;
  /** Whether the Explorer panel is collapsed to an icon rail. */
  explorerCollapsed: boolean;
  /** Whether the Sidebar panel is collapsed to an icon rail. */
  sidebarCollapsed: boolean;
  /** Explorer panel width in CSS pixels. */
  explorerWidth: number;
  /** Sidebar panel width in CSS pixels. */
  sidebarWidth: number;

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
  /** Toggle ruler visibility globally. */
  toggleRulers: () => void;
  /** Set ruler visibility directly (used by auto-reveal on ruler tool activation). */
  setShowRulers: (visible: boolean) => void;
  /** Remember the last-used ruler sub-tool. */
  setLastRulerKind: (kind: UIState["lastRulerKind"]) => void;
  /** Toggle right-click mode between context menu and zoom. */
  toggleRightClickMode: () => void;
  /** Set right-click mode directly. */
  setRightClickMode: (mode: RightClickMode) => void;
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
  /** Set Explorer panel width, clamped to [MIN_PANEL_WIDTH, MAX_PANEL_WIDTH]. */
  setExplorerWidth: (width: number) => void;
  /** Set Sidebar panel width, clamped to [MIN_PANEL_WIDTH, MAX_PANEL_WIDTH]. */
  setSidebarWidth: (width: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      themeSetting: "system",
      theme: getSystemTheme(),
      wasmReady: false,
      cursorWorld: null,
      sidebarTab: "layers",
      inspectorFocusRequested: false,
      inspectorFocusField: null,
      showGrid: true,
      showRulers: true,
      lastRulerKind: "ruler",
      rightClickMode: "context-menu" as RightClickMode,
      zenMode: false,
      explorerCollapsed: false,
      sidebarCollapsed: false,
      explorerWidth: DEFAULT_PANEL_WIDTH,
      sidebarWidth: DEFAULT_PANEL_WIDTH,

      setThemeSetting: (setting) => {
        const theme = resolveTheme(setting);
        applyTheme(theme);
        set({ themeSetting: setting, theme });
      },
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "dark" ? "light" : "dark";
          applyTheme(newTheme);
          return { themeSetting: newTheme, theme: newTheme };
        }),
      syncSystemTheme: () =>
        set((state) => {
          if (state.themeSetting === "system") {
            const theme = getSystemTheme();
            applyTheme(theme);
            return { theme };
          }
          return {};
        }),
      setWasmReady: (ready) => set({ wasmReady: ready }),
      setCursorWorld: (pos) => set({ cursorWorld: pos }),
      setSidebarTab: (tab) => set({ sidebarTab: tab }),
      requestInspectorFocus: () =>
        set({ sidebarTab: "inspector", inspectorFocusRequested: true, inspectorFocusField: null }),
      requestInspectorFocusField: (field) =>
        set({ sidebarTab: "inspector", inspectorFocusRequested: true, inspectorFocusField: field }),
      clearInspectorFocus: () => set({ inspectorFocusRequested: false, inspectorFocusField: null }),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleRulers: () => set((state) => ({ showRulers: !state.showRulers })),
      setShowRulers: (visible) => set({ showRulers: visible }),
      setLastRulerKind: (kind) => set({ lastRulerKind: kind }),
      toggleRightClickMode: () =>
        set((state) => ({
          rightClickMode: state.rightClickMode === "context-menu" ? "zoom" : "context-menu",
        })),
      setRightClickMode: (mode) => set({ rightClickMode: mode }),
      toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
      toggleExplorerCollapsed: () =>
        set((state) => ({ explorerCollapsed: !state.explorerCollapsed })),
      toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setExplorerCollapsed: (collapsed) => set({ explorerCollapsed: collapsed }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setExplorerWidth: (width) =>
        set({
          explorerWidth: Math.round(Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, width))),
        }),
      setSidebarWidth: (width) =>
        set({
          sidebarWidth: Math.round(Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, width))),
        }),
    }),
    {
      // NOTE: app/public/theme-preload.js reads this persisted store (key
      // "rosette-ui", field "themeSetting") before first paint to avoid a
      // theme flash. Keep it in sync if the key or field name changes.
      name: "rosette-ui",
      partialize: (state) => ({
        themeSetting: state.themeSetting,
        showGrid: state.showGrid,
        showRulers: state.showRulers,
        lastRulerKind: state.lastRulerKind,
        rightClickMode: state.rightClickMode,
        zenMode: state.zenMode,
        explorerCollapsed: state.explorerCollapsed,
        sidebarCollapsed: state.sidebarCollapsed,
        explorerWidth: state.explorerWidth,
        sidebarWidth: state.sidebarWidth,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Resolve theme on rehydration (in case system preference changed)
          state.themeSetting = isThemeSetting(state.themeSetting) ? state.themeSetting : "system";
          state.theme = resolveTheme(state.themeSetting);
          applyTheme(state.theme);
          // Clamp persisted widths to current min/max (guards against constant changes)
          const clamp = (v: number) =>
            Math.round(Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, v)));
          state.explorerWidth = clamp(state.explorerWidth);
          state.sidebarWidth = clamp(state.sidebarWidth);
        }
      },
    },
  ),
);

subscribeToSystemTheme(() => useUIStore.getState().syncSystemTheme());
