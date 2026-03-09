import { useCallback, useEffect, useRef, useState } from "react";
import { Component, AngleTool, NavArrowRight } from "iconoir-react";
import { useUIStore, type SidebarTab } from "@/stores/ui";
import { useMinimapStore } from "@/stores/minimap";
import { cn, keys } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useResize } from "@/hooks/use-resize";
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
// Collapsed Sidebar (icon rail)
// =============================================================================

/**
 * Collapsed sidebar — narrow icon rail with tab icons.
 * Clicking an icon expands to that tab.
 */
function CollapsedSidebar({
  isDark,
  onExpand,
}: {
  isDark: boolean;
  onExpand: (tab: SidebarTab) => void;
}) {
  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border py-1",
        isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
      )}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <Tooltip
            key={tab.id}
            label={tab.label}
            shortcut={{ modifiers: [keys.shift], key: tab.shortcut }}
            position="left"
          >
            <button
              onClick={() => onExpand(tab.id)}
              className={cn(
                "cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none",
                isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
              )}
            >
              <div className="flex h-4 w-4 items-center justify-center">
                <Icon className={cn("h-4 w-4", isDark ? "text-white/60" : "text-black/60")} />
              </div>
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Right sidebar with tabbed panels.
 *
 * Floating panel positioned in the top-right corner.
 * Matches the design from rosette-web.
 *
 * Responsive behavior:
 * - Expanded (default on lg): Full w-72 panel with tab content
 * - Collapsed (on md/sm or manual toggle): Narrow icon rail (w-11)
 * - On sm: expanding opens as an overlay drawer
 */
export function Sidebar() {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleCollapsed = useUIStore((s) => s.toggleSidebarCollapsed);
  const sidebarWidth = useUIStore((s) => s.sidebarWidth);
  const setSidebarWidth = useUIStore((s) => s.setSidebarWidth);
  const { isSm } = useBreakpoint();

  const { handleProps: resizeHandleProps } = useResize({
    side: "right",
    width: sidebarWidth,
    onResize: setSidebarWidth,
  });

  const activeTab = useUIStore((s) => s.sidebarTab);
  const setSidebarTab = useUIStore((s) => s.setSidebarTab);
  const isMinimapMinimized = useMinimapStore((s) => s.isMinimized);

  // On sm, the expanded Sidebar is an overlay — track if it was manually opened
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on outside click (sm overlay mode)
  useEffect(() => {
    if (!isSm || !drawerOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isSm, drawerOpen]);

  const handleExpand = useCallback(
    (tab: SidebarTab) => {
      setSidebarTab(tab);
      if (isSm) {
        setDrawerOpen(true);
      } else {
        toggleCollapsed();
      }
    },
    [isSm, toggleCollapsed, setSidebarTab],
  );

  // Reserve space below the sidebar for the minimap and the docked status bar.
  const STATUS_BAR_HEIGHT = 24;
  const minimapReserve = (isMinimapMinimized ? 0 : 206) + STATUS_BAR_HEIGHT;

  // Show collapsed rail when collapsed (and not in sm drawer-open state)
  if (collapsed && !(isSm && drawerOpen)) {
    return <CollapsedSidebar isDark={isDark} onExpand={handleExpand} />;
  }

  const isOverlay = isSm && drawerOpen;

  return (
    <>
      {/* Backdrop for overlay mode */}
      {isOverlay && <div className="fixed inset-0 z-39" />}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-4 right-4 z-40 rounded-xl border",
          isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
          isOverlay && "shadow-xl",
        )}
        style={{ width: sidebarWidth }}
      >
        {/* Invisible resize handle on the left edge */}
        <div {...resizeHandleProps} />
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

          {/* Collapse button — push to right */}
          {!isSm && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className={cn(
                "ml-auto cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none",
                isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
              )}
            >
              <NavArrowRight
                className={cn("h-4 w-4", isDark ? "text-white/40" : "text-black/40")}
              />
            </button>
          )}
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
    </>
  );
}
