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

/**
 * Emit an open-file event for the Tauri backend to process.
 * The `use-library` hook listens for this event.
 */
async function emitOpenFile(path: string) {
  const { emit } = await import("@tauri-apps/api/event");
  await emit("open-file", path);
}

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

  // Tauri: Cmd+O to open a GDS file
  useEffect(() => {
    if (!isTauri) return;

    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "o") {
        e.preventDefault();
        const path = await pickGdsFile();
        if (path) {
          await emitOpenFile(path);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Tauri: listen for drag-drop events from the native webview
  useEffect(() => {
    if (!isTauri) return;

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
  }, []);

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
