import { useEffect, useRef } from "react";
import { Canvas } from "@/components/canvas/Canvas";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Explorer } from "@/components/ui/Explorer";
import { Minimap } from "@/components/ui/Minimap";
import { Sidebar } from "@/components/ui/Sidebar";
import { StatusBar } from "@/components/ui/StatusBar";
import { Toolbar } from "@/components/ui/Toolbar";
import { useUIStore } from "@/stores/ui";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { isTauri, pickGdsFile } from "@/lib/tauri";
import { emitOpenFile, handleSave, handleNewFile, confirmDiscardChanges } from "@/lib/file-ops";
import { isEmbedMode, getEmbedPanelWidth } from "@/hooks/use-library";

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

  // Tauri: Cmd+O to open, Cmd+S to save, Cmd+Shift+S to save as
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
        const confirmed = await confirmDiscardChanges();
        if (!confirmed) return;
        const path = await pickGdsFile();
        if (path) {
          await emitOpenFile(path);
        }
      } else if (e.key === "s" && e.shiftKey) {
        // Cmd+Shift+S: Save As (always show dialog)
        e.preventDefault();
        await handleSave(true);
      } else if (e.key === "s") {
        // Cmd+S: Save (to current file, or Save As if none)
        e.preventDefault();
        await handleSave(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
              const confirmed = await confirmDiscardChanges();
              if (!confirmed) return;
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
