import { Component, AngleTool } from "iconoir-react";
import { useUIStore, type SidebarTab } from "@/stores/ui";
import { useMinimapStore } from "@/stores/minimap";
import { cn, keys } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import { LayersPanel } from "./LayersPanel";
import { InspectorPanel } from "./InspectorPanel";

// =============================================================================
// Types
// =============================================================================

interface Tab {
  id: SidebarTab;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortcut: string;
}

const TABS: Tab[] = [
  { id: "layers", icon: Component, label: "Layers", shortcut: "L" },
  { id: "inspector", icon: AngleTool, label: "Inspector", shortcut: "I" },
];

// =============================================================================
// Main Component
// =============================================================================

/**
 * Right sidebar with tabbed panels.
 *
 * Floating panel positioned in the top-right corner.
 * Matches the design from rosette-web.
 */
export function Sidebar() {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  const activeTab = useUIStore((s) => s.sidebarTab);
  const setSidebarTab = useUIStore((s) => s.setSidebarTab);
  const isMinimapMinimized = useMinimapStore((s) => s.isMinimized);

  // Reserve space below the sidebar for the minimap and the docked status bar.
  // Minimap hidden (minimized): 0px (toggle is in the status bar now)
  // Minimap expanded: 190px (180 canvas + 8 padding + 2 border) + 16px gap = 206px
  // Status bar: 24px (h-6)
  const STATUS_BAR_HEIGHT = 24;
  const minimapReserve = (isMinimapMinimized ? 0 : 206) + STATUS_BAR_HEIGHT;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-40 w-72 rounded-xl border",
        isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
      )}
    >
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-1 pt-1 pb-[3px]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Tooltip
              key={tab.id}
              label={tab.label}
              shortcut={{ modifiers: [keys.shift], key: tab.shortcut }}
            >
              <button
                onClick={() => setSidebarTab(tab.id)}
                className={cn(
                  "cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none",
                  isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
                  isActive && (isDark ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]"),
                )}
              >
                <div className="flex h-4 w-4 items-center justify-center">
                  <Icon className={cn("h-4 w-4", isDark ? "text-white/90" : "text-black/90")} />
                </div>
              </button>
            </Tooltip>
          );
        })}
      </div>

      {/* Divider */}
      <div className={cn("h-px", isDark ? "bg-white/10" : "bg-black/10")} />

      {/* Panel content */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: `calc(100vh - ${70 + minimapReserve}px)` }}
        onWheel={(e) => e.stopPropagation()}
      >
        {activeTab === "layers" && <LayersPanel />}
        {activeTab === "inspector" && <InspectorPanel />}
      </div>
    </div>
  );
}
