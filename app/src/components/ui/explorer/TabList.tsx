import { useEffect, useRef, useCallback } from "react";
import { useExplorerStore, type FocusedItem } from "@/stores/explorer";
import { useTabsStore, switchTab } from "@/stores/tabs";
import type { Tab } from "@/stores/tabs";
import { cn } from "@/lib/utils";
import { panelRowStateClassName } from "@/components/ui/panel-row";

/**
 * Single tab row in the vertical tab list.
 * Mirrors the CellRow style: rounded-lg, same hover/active colors.
 */
export function TabRow({
  tab,
  isActive,
  isFocused,
  isKeyboardNavigationActive,
  isDark,
  onFocus,
  onSelect,
  onClose,
  onMiddleClick,
}: {
  tab: Tab;
  isActive: boolean;
  /** Whether this tab has the keyboard navigation cursor. */
  isFocused: boolean;
  isKeyboardNavigationActive: boolean;
  isDark: boolean;
  onFocus: () => void;
  onSelect: () => void;
  onClose: (e: React.MouseEvent) => void;
  onMiddleClick: (e: React.MouseEvent) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Scroll the focused row into view when it becomes focused
  useEffect(() => {
    if (isFocused && rowRef.current) {
      if (document.activeElement !== rowRef.current) {
        rowRef.current.focus({ preventScroll: true });
      }
      rowRef.current.scrollIntoView?.({ block: "nearest" });
    }
  }, [isFocused]);

  return (
    <div
      ref={rowRef}
      role="tab"
      tabIndex={isFocused || (!isKeyboardNavigationActive && isActive) ? 0 : -1}
      aria-selected={isActive}
      className={cn(
        "group mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-1.5 rounded-lg py-1.5 pr-1 pl-2 transition-colors",
        panelRowStateClassName({ isActive, isFocused, isDark }),
      )}
      onClick={onSelect}
      onFocus={onFocus}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onSelect();
        }
      }}
      onMouseDown={onMiddleClick}
    >
      {/* Dirty indicator dot */}
      {tab.isDirty ? (
        <span
          className={cn(
            "h-1.5 w-1.5 flex-shrink-0 rounded-full",
            isDark ? "bg-white/50" : "bg-black/50",
          )}
        />
      ) : (
        <span className="h-1.5 w-1.5 flex-shrink-0" />
      )}

      {/* Tab title */}
      <span className="min-w-0 flex-1 truncate text-sm select-none">{tab.title}</span>

      {/* Close button — visible on hover or when active */}
      <button
        type="button"
        aria-label="Close tab"
        onClick={onClose}
        className={cn(
          "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm transition-opacity",
          "opacity-0 group-hover:opacity-100",
          isDark
            ? "hover:bg-white/15 text-white/50 hover:text-white/80"
            : "hover:bg-black/15 text-black/50 hover:text-black/80",
        )}
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Vertical tab list showing all open documents.
 *
 * Rendered inside the Explorer panel between the header and cell tree.
 * Only shown when there are 2+ tabs (a single tab is implicit).
 */
export function TabList({
  isDark,
  focusedItem,
  isKeyboardNavigationActive,
}: {
  isDark: boolean;
  focusedItem: FocusedItem | null;
  isKeyboardNavigationActive: boolean;
}) {
  const tabs = useTabsStore((s) => s.tabs);
  const activeTabId = useTabsStore((s) => s.activeTabId);

  const handleTabSelect = useCallback(
    (tabId: string) => {
      if (tabId === activeTabId) return;
      const preserveExplorerFocus = useExplorerStore.getState().isFocused;
      switchTab(activeTabId, tabId);
      useTabsStore.getState().setActiveTab(tabId);
      if (preserveExplorerFocus) {
        useExplorerStore.setState({
          isFocused: true,
          focusedItem: { type: "tab", id: tabId },
        });
      }
    },
    [activeTabId],
  );

  const handleTabClose = useCallback(async (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    // Dispatch the close-tab event — App.tsx handles dirty confirmation and cleanup
    window.dispatchEvent(new CustomEvent("rosette-close-tab", { detail: tabId }));
  }, []);

  const handleMiddleClick = useCallback((e: React.MouseEvent, tabId: string) => {
    if (e.button === 1) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("rosette-close-tab", { detail: tabId }));
    }
  }, []);

  // Don't render when there's only 1 tab
  if (tabs.length <= 1) return null;

  return (
    <>
      <div
        role="tablist"
        aria-label="Open designs"
        aria-orientation="vertical"
        className="flex flex-col gap-0.5 py-1"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            useExplorerStore.getState().setFocused(false);
          }
        }}
      >
        {tabs.map((tab) => (
          <TabRow
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            isFocused={focusedItem?.type === "tab" && focusedItem.id === tab.id}
            isKeyboardNavigationActive={isKeyboardNavigationActive}
            isDark={isDark}
            onFocus={() => {
              const store = useExplorerStore.getState();
              if (!store.isFocused) store.setFocused(true);
              store.setFocusedItem({ type: "tab", id: tab.id });
            }}
            onSelect={() => handleTabSelect(tab.id)}
            onClose={(e) => handleTabClose(e, tab.id)}
            onMiddleClick={(e) => handleMiddleClick(e, tab.id)}
          />
        ))}
      </div>
      {/* Divider below tabs */}
      <div className={cn("h-px", isDark ? "bg-white/10" : "bg-black/10")} />
    </>
  );
}

// =============================================================================
// Collapsed Explorer (icon rail)
// =============================================================================
