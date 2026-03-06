import { Canvas } from "@/components/canvas/Canvas";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Explorer } from "@/components/ui/Explorer";
import { Minimap } from "@/components/ui/Minimap";
import { Sidebar } from "@/components/ui/Sidebar";
import { StatusBar } from "@/components/ui/StatusBar";
import { Toolbar } from "@/components/ui/Toolbar";
import { useUIStore } from "@/stores/ui";

/**
 * Main application component.
 *
 * Floating UI overlays on a full-screen canvas with a docked status bar
 * at the bottom. The same UI is used for both standalone mode and design
 * preview mode (`rosette serve`).
 */
export default function App() {
  const theme = useUIStore((s) => s.theme);
  const zenMode = useUIStore((s) => s.zenMode);

  return (
    <div
      className={`flex h-screen w-screen flex-col ${theme === "dark" ? "bg-black" : "bg-white"}`}
    >
      {/* Canvas area with floating overlays */}
      <div className="relative min-h-0 flex-1">
        <Canvas />
        {!zenMode && <Toolbar />}
        {!zenMode && <Explorer />}
        {!zenMode && <Sidebar />}

        <Minimap />
        <CommandPalette />
      </div>

      {/* Docked status bar */}
      <StatusBar />
    </div>
  );
}
