import { useEffect, useRef } from "react";
import { Canvas } from "@/components/canvas/Canvas";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Explorer } from "@/components/ui/Explorer";
import { Minimap } from "@/components/ui/Minimap";
import { Sidebar } from "@/components/ui/Sidebar";
import { StatusBar } from "@/components/ui/StatusBar";
import { Toolbar } from "@/components/ui/Toolbar";
import { useUIStore } from "@/stores/ui";
import {
  useTabsStore,
  switchTab,
  saveTabSnapshot,
  setTabLibrary,
  deleteTabSnapshot,
} from "@/stores/tabs";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { isTauri, pickGdsFile } from "@/lib/tauri";
import { emitOpenFile, handleSave, handleNewFile, confirmDiscardChanges } from "@/lib/file-ops";
import { useDocumentStore } from "@/stores/document";
import { isEmbedMode, getEmbedPanelWidth } from "@/hooks/use-library";
import { useWasmContextStore } from "@/stores/wasm-context";

/**
 * Main application component.
 *
 * Floating UI overlays on a full-screen canvas with a docked status bar
 * at the bottom. The same UI is used for both standalone mode, design
 * preview mode (`rosette serve`), and Tauri desktop mode.
 */
export default function App() {
  const theme = useUIStore((s) => s.theme);
  const zenMode = useUIStore((s) => s.zenMode);
  const { isLg, isMd, isSm } = useBreakpoint();
  const embed = isEmbedMode();

  // Sync panel collapsed state with breakpoint.
  // On initial load: if lg, ensure panels are expanded (overrides stale persisted state).
  // On resize transitions: auto-collapse when entering narrow, auto-expand when returning to lg.
  const prevIsLg = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevIsLg.current === null) {
      // Initial load — if wide, force panels expanded
      if (isLg) {
        useUIStore.getState().setExplorerCollapsed(false);
        useUIStore.getState().setSidebarCollapsed(false);
      }
    } else if (prevIsLg.current && !isLg) {
      // Entered narrow: auto-collapse both panels
      useUIStore.getState().setExplorerCollapsed(true);
      useUIStore.getState().setSidebarCollapsed(true);
    } else if (!prevIsLg.current && isLg) {
      // Returned to wide: auto-expand both panels
      useUIStore.getState().setExplorerCollapsed(false);
      useUIStore.getState().setSidebarCollapsed(false);
    }
    prevIsLg.current = isLg;
  }, [isLg]);

  // Embed mode: apply custom panel width from ?panelWidth= URL parameter
  useEffect(() => {
    if (!embed) return;
    const panelWidth = getEmbedPanelWidth();
    if (panelWidth !== null) {
      useUIStore.getState().setExplorerWidth(panelWidth);
      useUIStore.getState().setSidebarWidth(panelWidth);
    }
  }, [embed]);

  // Tauri: Cmd+O to open, Cmd+S to save, Cmd+Shift+S to save as, tab shortcuts
  useEffect(() => {
    if (!isTauri || embed) return;

    const handleKeyDown = async (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === "n") {
        e.preventDefault();
        await handleNewFile();
      } else if (e.key === "o") {
        e.preventDefault();
        // Open in a new tab (no discard confirmation needed)
        const path = await pickGdsFile();
        if (path) {
          await emitOpenFile(path);
        }
      } else if (e.key === "s" && e.shiftKey) {
        // Cmd+Shift+S: Save As (always show dialog)
        e.preventDefault();
        await handleSave(true);
      } else if (e.key === "s" && !e.shiftKey) {
        // Cmd+S: Save (to current file, or Save As if none)
        e.preventDefault();
        await handleSave(false);
      } else if (e.key === "t") {
        // Cmd+T: New tab
        e.preventDefault();
        // Save current tab, then create new empty tab
        const currentId = useTabsStore.getState().activeTabId;
        if (currentId) {
          saveTabSnapshot(currentId);
          const lib = useWasmContextStore.getState().library;
          if (lib) setTabLibrary(currentId, lib);
        }
        window.dispatchEvent(new CustomEvent("rosette-new-tab"));
      } else if (e.key === "w") {
        // Cmd+W: Close current tab
        e.preventDefault();
        const currentId = useTabsStore.getState().activeTabId;
        if (currentId) {
          // Simulate close button click via event
          window.dispatchEvent(new CustomEvent("rosette-close-tab", { detail: currentId }));
        }
      } else if (e.key === "[" && e.shiftKey) {
        // Cmd+Shift+[: Previous tab
        e.preventDefault();
        const { tabs, activeTabId: currentActiveId } = useTabsStore.getState();
        if (tabs.length > 1 && currentActiveId) {
          const idx = tabs.findIndex((t) => t.id === currentActiveId);
          const prevIdx = (idx - 1 + tabs.length) % tabs.length;
          switchTab(currentActiveId, tabs[prevIdx].id);
          useTabsStore.getState().setActiveTab(tabs[prevIdx].id);
        }
      } else if (e.key === "]" && e.shiftKey) {
        // Cmd+Shift+]: Next tab
        e.preventDefault();
        const { tabs, activeTabId: currentActiveId } = useTabsStore.getState();
        if (tabs.length > 1 && currentActiveId) {
          const idx = tabs.findIndex((t) => t.id === currentActiveId);
          const nextIdx = (idx + 1) % tabs.length;
          switchTab(currentActiveId, tabs[nextIdx].id);
          useTabsStore.getState().setActiveTab(tabs[nextIdx].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [embed]);

  // Listen for close-tab events (from Cmd+W keyboard shortcut)
  useEffect(() => {
    if (embed) return;

    const handleCloseTab = async (e: Event) => {
      const tabId = (e as CustomEvent).detail as string;
      if (!tabId) return;

      const tab = useTabsStore.getState().getTab(tabId);
      if (!tab) return;

      // Check dirty state: for the active tab, also check the live document
      // store (the tab store's isDirty may lag by a microtask on first edit).
      const isActive = useTabsStore.getState().activeTabId === tabId;
      const isDirty = isActive ? tab.isDirty || useDocumentStore.getState().isDirty : tab.isDirty;

      if (isDirty) {
        const confirmed = await confirmDiscardChanges();
        if (!confirmed) return;
      }

      const state = useTabsStore.getState();
      const tabIndex = state.tabs.findIndex((t) => t.id === tabId);

      if (isActive && state.tabs.length > 1) {
        const newTabs = state.tabs.filter((t) => t.id !== tabId);
        const newActiveId =
          tabIndex < newTabs.length ? newTabs[tabIndex].id : newTabs[newTabs.length - 1].id;
        switchTab(tabId, newActiveId);
        useTabsStore.getState().closeTab(tabId);
        deleteTabSnapshot(tabId);
      } else if (isActive && state.tabs.length === 1) {
        // Closing the last tab: create a new empty tab first, then clean up
        // the old one. This avoids freeing the library before the replacement
        // is installed.
        useTabsStore.getState().closeTab(tabId);
        window.dispatchEvent(new CustomEvent("rosette-new-tab"));
        // Delete snapshot after the new tab event has synchronously installed
        // a new library (the event handler runs synchronously via dispatchEvent).
        deleteTabSnapshot(tabId);
      } else {
        // Non-active tab — just remove it
        useTabsStore.getState().closeTab(tabId);
        deleteTabSnapshot(tabId);
      }
    };

    window.addEventListener("rosette-close-tab", handleCloseTab);
    return () => window.removeEventListener("rosette-close-tab", handleCloseTab);
  }, [embed]);

  // Tauri: listen for drag-drop events from the native webview
  useEffect(() => {
    if (!isTauri || embed) return;

    let unlisten: (() => void) | null = null;
    let cancelled = false;

    // Tauri v2 drag-drop events
    (async () => {
      try {
        const { getCurrentWebviewWindow } = await import("@tauri-apps/api/webviewWindow");
        const appWindow = getCurrentWebviewWindow();
        const unlistenFn = await appWindow.onDragDropEvent(async (event) => {
          if (event.payload.type === "drop") {
            const paths = event.payload.paths;
            const gdsPath = paths.find(
              (p: string) => p.endsWith(".gds") || p.endsWith(".gds2") || p.endsWith(".gdsii"),
            );
            if (gdsPath) {
              await emitOpenFile(gdsPath);
            }
          }
        });
        if (cancelled) {
          unlistenFn();
        } else {
          unlisten = unlistenFn;
        }
      } catch {
        // Not running in Tauri or API not available
      }
    })();

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [embed]);

  // Embed mode: full app experience (Explorer, Sidebar, StatusBar, CommandPalette)
  if (embed) {
    return (
      <div
        className={`flex h-screen w-screen flex-col ${theme === "dark" ? "bg-black" : "bg-white"}`}
      >
        <div className="relative min-h-0 flex-1">
          <Canvas />
          {!zenMode && <Toolbar compact={false} minimal={false} />}
          {!zenMode && <Explorer />}
          {!zenMode && <Sidebar />}
          <Minimap />
          <CommandPalette />
        </div>
        <StatusBar compact={isMd || isSm} minimal={isSm} />
      </div>
    );
  }

  return (
    <div
      className={`flex h-screen w-screen flex-col ${theme === "dark" ? "bg-black" : "bg-white"}`}
    >
      {/* Canvas area with floating overlays */}
      <div className="relative min-h-0 flex-1">
        <Canvas />
        {!zenMode && <Toolbar compact={!isLg} minimal={isSm} />}
        {!zenMode && <Explorer />}
        {!zenMode && <Sidebar />}

        {!isSm && <Minimap />}
        <CommandPalette />
      </div>

      {/* Docked status bar */}
      <StatusBar compact={isMd || isSm} minimal={isSm} />
    </div>
  );
}
