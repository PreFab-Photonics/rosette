import { useCallback, useEffect, useRef, useState } from "react";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { useExplorerStore } from "@/stores/explorer";
import { useContextMenuStore } from "@/stores/context-menu";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import { useUIStore } from "@/stores/ui";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useResize } from "@/hooks/use-resize";
import { RenameCellCommand, DeleteCellCommand } from "@/lib/commands";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import { useTabsStore, switchTab } from "@/stores/tabs";
import {
  getVisibleItems,
  findParentInTree,
  findNodeInTree,
  focusedItemEquals,
  findItemIndex,
} from "./explorer/navigation";
import { HamburgerMenu } from "./explorer/HamburgerMenu";
import { CellRow, CellTreeNode } from "./explorer/CellTree";
import { TabList } from "./explorer/TabList";

/**
 * Collapsed explorer — narrow icon rail with app icon and expand button.
 * Shows a tab count badge when 2+ tabs are open.
 */
function CollapsedExplorer({ isDark, onExpand }: { isDark: boolean; onExpand: () => void }) {
  const tabCount = useTabsStore((s) => s.tabs.length);

  return (
    <div
      className={cn(
        "fixed top-4 left-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border pt-[4.5px] pb-[5px]",
        isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
      )}
    >
      {/* App icon with tab count badge */}
      <div className="relative p-1">
        <img
          src="/icon.svg"
          alt=""
          draggable={false}
          className={cn(
            "h-5 w-5 select-none pointer-events-none rounded border",
            isDark ? "border-white/40" : "border-black/40",
          )}
        />
        {tabCount > 1 && (
          <span
            className={cn(
              "absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-0.5 text-[9px] font-medium leading-none",
              isDark ? "bg-white/20 text-white/80" : "bg-black/20 text-black/80",
            )}
          >
            {tabCount}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className={cn("mx-1 h-px w-5", isDark ? "bg-white/10" : "bg-black/10")} />

      {/* Expand button */}
      <button
        type="button"
        onClick={onExpand}
        className={cn(
          "cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none",
          isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
        )}
      >
        <NavArrowRight className={cn("h-4 w-4", isDark ? "text-white/60" : "text-black/60")} />
      </button>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Explorer panel showing cells in the design.
 *
 * Floating panel positioned in the top-left corner, mirroring the
 * right sidebar's visual style. Shows a hierarchical tree of cell names
 * from the current design, with expand/collapse support.
 *
 * Responsive behavior:
 * - Expanded (default on lg): Full w-72 panel with cell tree
 * - Collapsed (on md/sm or manual toggle): Narrow icon rail (w-11)
 * - On sm: expanding opens as an overlay drawer
 *
 * Features:
 * - Hierarchical tree view of cells (nested cell references)
 * - Click to navigate into a cell (view its resolved geometry)
 * - Expand/collapse tree nodes
 * - Right-click context menu (add, rename, delete)
 * - Inline rename (double-click or context menu)
 * - Hamburger menu with Edit, View, and Preferences actions
 * - Keyboard navigation (Shift+E to focus, arrows to navigate, Space/Enter/Delete for actions)
 */
export function Explorer() {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";
  const collapsed = useUIStore((s) => s.explorerCollapsed);
  const toggleCollapsed = useUIStore((s) => s.toggleExplorerCollapsed);
  const explorerWidth = useUIStore((s) => s.explorerWidth);
  const setExplorerWidth = useUIStore((s) => s.setExplorerWidth);
  const { isSm } = useBreakpoint();

  const { handleProps: resizeHandleProps } = useResize({
    side: "left",
    width: explorerWidth,
    onResize: setExplorerWidth,
  });

  const projectName = useExplorerStore((s) => s.projectName);
  const setProjectName = useExplorerStore((s) => s.setProjectName);
  const cells = useExplorerStore((s) => s.cells);
  const cellTree = useExplorerStore((s) => s.cellTree);
  const activeCell = useExplorerStore((s) => s.activeCell);
  const setActiveCell = useExplorerStore((s) => s.setActiveCell);
  const editingCellName = useExplorerStore((s) => s.editingCellName);
  const expandedCells = useExplorerStore((s) => s.expandedCells);
  const toggleExpanded = useExplorerStore((s) => s.toggleExpanded);
  const cellsLoaded = useExplorerStore((s) => s.cellsLoaded);
  const hierarchyLevelLimit = useExplorerStore((s) => s.hierarchyLevelLimit);
  const setHierarchyLevelLimit = useExplorerStore((s) => s.setHierarchyLevelLimit);
  const maxTreeDepth = useExplorerStore((s) => s.maxTreeDepth);
  const hiddenCells = useExplorerStore((s) => s.hiddenCells);
  const cellListMode = useExplorerStore((s) => s.cellListMode);
  const isFocused = useExplorerStore((s) => s.isFocused);
  const focusedItem = useExplorerStore((s) => s.focusedItem);
  const setFocused = useExplorerStore((s) => s.setFocused);
  const setFocusedItem = useExplorerStore((s) => s.setFocusedItem);

  // Claim keyboard focus when Explorer is keyboard-navigating
  useKeyboardFocus("explorer-panel", isFocused);

  // On sm, the expanded Explorer is an overlay — track if it was manually opened
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

  // Local state for the level input (kept in sync with store, allows partial typing).
  const displayLimit = (limit: number, depth: number) =>
    limit === Infinity ? (depth > 0 ? depth.toString() : "") : limit.toString();

  const [levelInputValue, setLevelInputValue] = useState(
    displayLimit(hierarchyLevelLimit, maxTreeDepth),
  );

  // Sync local input value when the store changes
  useEffect(() => {
    setLevelInputValue(displayLimit(hierarchyLevelLimit, maxTreeDepth));
  }, [hierarchyLevelLimit, maxTreeDepth]);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(projectName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== projectName) {
      setProjectName(trimmed);
    } else {
      setEditValue(projectName);
    }
    setIsEditing(false);
  }, [editValue, projectName, setProjectName]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      } else if (e.key === "Escape") {
        setEditValue(projectName);
        setIsEditing(false);
      }
    },
    [handleSubmit, projectName],
  );

  const handleRenameCell = useCallback((oldName: string, newName: string) => {
    const { library, renderer } = useWasmContextStore.getState();
    if (library && renderer) {
      const command = new RenameCellCommand(oldName, newName);
      useHistoryStore.getState().execute(command, { library, renderer });
    } else {
      useExplorerStore.getState().renameCell(oldName, newName);
    }
  }, []);

  const handleSelectCell = useCallback(
    (name: string) => {
      if (name === activeCell) {
        const totalCells = cells.length;
        if (totalCells <= 1) return;
      }
      setActiveCell(name === activeCell ? null : name);
    },
    [activeCell, cells.length, setActiveCell],
  );

  // Right-click on the cell list background (empty space) opens the cell
  // context menu without a target cell, so cell-specific items auto-disable.
  const handleBackgroundContextMenu = useCallback((e: React.MouseEvent) => {
    // Only fire when clicking the container itself, not a child CellRow
    if (e.target === e.currentTarget) {
      e.preventDefault();
      useContextMenuStore.getState().open("cell", { x: e.clientX, y: e.clientY });
    }
  }, []);

  // =========================================================================
  // Keyboard navigation for the Explorer (tabs + cell list)
  // =========================================================================

  // Unfocus Explorer on click outside the panel (when keyboard-focused)
  useEffect(() => {
    if (!isFocused) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isFocused, setFocused]);

  // Keyboard event handler for arrow-key navigation, actions, and escape.
  // Navigates a unified list of tabs (when 2+) followed by visible cells.
  useEffect(() => {
    if (!isFocused) return;

    const handler = (e: KeyboardEvent) => {
      // Don't handle if an input is focused (e.g., rename input, level input)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const {
        focusedItem: current,
        cellTree: tree,
        cells: allCells,
        expandedCells: expanded,
        activeCell: active,
        editingCellName: editing,
        cellListMode: listMode,
      } = useExplorerStore.getState();

      // Skip navigation while inline editing
      if (editing) return;

      const allTabs = useTabsStore.getState().tabs;
      const items = getVisibleItems(allTabs, tree, allCells, expanded, listMode);
      if (items.length === 0) return;

      const currentIndex = findItemIndex(items, current);

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          setFocusedItem(items[nextIndex]);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          setFocusedItem(items[prevIndex]);
          break;
        }
        case "ArrowRight": {
          // Only applies to cell items in nested mode — expand tree node or move to first child
          e.preventDefault();
          if (current?.type === "cell" && tree && listMode === "nested") {
            const node = findNodeInTree(tree, current.name);
            if (node && node.children.length > 0 && !expanded.has(current.name)) {
              toggleExpanded(current.name);
            } else if (node && node.children.length > 0 && expanded.has(current.name)) {
              setFocusedItem({ type: "cell", name: node.children[0].name });
            }
          }
          break;
        }
        case "ArrowLeft": {
          // Only applies to cell items in nested mode — collapse tree node or move to parent
          e.preventDefault();
          if (current?.type === "cell" && tree && listMode === "nested") {
            const node = findNodeInTree(tree, current.name);
            if (node && node.children.length > 0 && expanded.has(current.name)) {
              toggleExpanded(current.name);
            } else {
              const parent = findParentInTree(tree, current.name);
              if (parent) {
                setFocusedItem({ type: "cell", name: parent });
              }
            }
          }
          break;
        }
        case " ": {
          // Space: activate the focused item
          e.preventDefault();
          if (!current) break;
          if (current.type === "tab") {
            // Switch to the focused tab
            const activeTabId = useTabsStore.getState().activeTabId;
            if (current.id !== activeTabId) {
              switchTab(activeTabId, current.id);
              useTabsStore.getState().setActiveTab(current.id);
            }
          } else {
            // Set focused cell as active cell
            if (current.name === active) {
              if (allCells.length > 1) {
                setActiveCell(null);
              }
            } else {
              setActiveCell(current.name);
            }
          }
          break;
        }
        case "Enter": {
          // Enter: rename (cells only)
          e.preventDefault();
          if (current?.type === "cell") {
            useExplorerStore.getState().setEditingCellName(current.name);
          }
          break;
        }
        case "Delete":
        case "Backspace": {
          e.preventDefault();
          if (!current) break;
          if (current.type === "tab") {
            // Close the focused tab. The close-tab event is handled async,
            // so defer focus update to after the tab list has been updated.
            const closedIndex = currentIndex;
            window.dispatchEvent(new CustomEvent("rosette-close-tab", { detail: current.id }));
            setTimeout(() => {
              const freshState = useExplorerStore.getState();
              const freshTabs = useTabsStore.getState().tabs;
              const freshItems = getVisibleItems(
                freshTabs,
                freshState.cellTree,
                freshState.cells,
                freshState.expandedCells,
                freshState.cellListMode,
              );
              if (freshItems.length === 0) {
                setFocusedItem(null);
              } else {
                const idx = Math.min(closedIndex, freshItems.length - 1);
                setFocusedItem(freshItems[idx]);
              }
            }, 0);
          } else {
            // Delete the focused cell
            if (allCells.length > 1) {
              const { library, renderer } = useWasmContextStore.getState();
              if (library && renderer) {
                const nextIndex =
                  currentIndex < items.length - 1 ? currentIndex + 1 : currentIndex - 1;
                const nextFocus = nextIndex >= 0 ? items[nextIndex] : null;

                const command = new DeleteCellCommand(current.name);
                useHistoryStore.getState().execute(command, { library, renderer });

                if (nextFocus && !focusedItemEquals(nextFocus, current)) {
                  setFocusedItem(nextFocus);
                }
              }
            }
          }
          break;
        }
        case "z":
        case "Z": {
          // Cmd+Z / Cmd+Shift+Z: Undo/Redo (pass through while Explorer is focused)
          const mod = e.metaKey || e.ctrlKey;
          if (!mod) return;
          e.preventDefault();
          const { library, renderer } = useWasmContextStore.getState();
          if (!library || !renderer) break;
          if (e.shiftKey) {
            useHistoryStore.getState().redo({ library, renderer });
          } else {
            useHistoryStore.getState().undo({ library, renderer });
          }
          break;
        }
        case "Escape": {
          // Escape: release keyboard focus
          e.preventDefault();
          setFocused(false);
          break;
        }
        default:
          return; // Don't prevent default for unhandled keys
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isFocused, setFocused, setFocusedItem, setActiveCell, toggleExpanded]);

  const handleExpand = useCallback(() => {
    if (isSm) {
      // On mobile, open as overlay drawer
      setDrawerOpen(true);
    } else {
      toggleCollapsed();
    }
  }, [isSm, toggleCollapsed]);

  // Show collapsed rail when collapsed (and not in sm drawer-open state)
  if (collapsed && !(isSm && drawerOpen)) {
    return <CollapsedExplorer isDark={isDark} onExpand={handleExpand} />;
  }

  // On sm with drawer open, show as overlay
  const isOverlay = isSm && drawerOpen;

  return (
    <>
      {/* Backdrop for overlay mode */}
      {isOverlay && <div className="fixed inset-0 z-39" />}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-4 left-4 z-40 rounded-xl border transition-opacity duration-200",
          cellsLoaded ? "opacity-100" : "pointer-events-none opacity-0",
          isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
          isOverlay && "shadow-xl",
        )}
        style={{ width: explorerWidth }}
      >
        {/* Invisible resize handle on the right edge */}
        <div {...resizeHandleProps} />
        {/* Header bar — editable project name, matches Sidebar tab bar height */}
        <div className="flex items-center gap-1 px-1 pt-1 pb-[3px]">
          {/* Icon — same size as Sidebar tab buttons */}
          <div className="flex-shrink-0 p-1">
            <img
              src="/icon.svg"
              alt=""
              draggable={false}
              className={cn(
                "h-5 w-5 select-none pointer-events-none rounded border",
                isDark ? "border-white/40" : "border-black/40",
              )}
            />
          </div>
          <div className="relative h-5 min-w-0 flex-1">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-xs font-medium leading-5 outline-none focus:ring-0",
                  isDark ? "text-white/90" : "text-black/90",
                )}
              />
            ) : (
              <button
                type="button"
                className={cn(
                  "absolute inset-0 cursor-text truncate border-0 bg-transparent p-0 text-left text-xs font-medium leading-5 select-none focus:outline-none",
                  isDark ? "text-white/60" : "text-black/60",
                )}
                onClick={() => {
                  setEditValue(projectName);
                  setIsEditing(true);
                }}
              >
                {projectName}
              </button>
            )}
          </div>

          {/* Collapse button (not shown on sm — use drawer dismiss instead) */}
          {!isSm && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className={cn(
                "flex-shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none",
                isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
              )}
            >
              <NavArrowLeft className={cn("h-4 w-4", isDark ? "text-white/60" : "text-black/60")} />
            </button>
          )}

          {/* Hamburger menu */}
          <HamburgerMenu isDark={isDark} />
        </div>

        {/* Divider */}
        <div className={cn("h-px", isDark ? "bg-white/10" : "bg-black/10")} />

        {/* Vertical tab list (shown when 2+ tabs are open) */}
        <TabList isDark={isDark} focusedItem={isFocused ? focusedItem : null} />

        {/* Cell tree / list */}
        <div
          className="flex flex-col gap-0.5 overflow-y-auto py-1"
          style={{ maxHeight: "calc(100vh - 176px)" }}
          onWheel={(e) => e.stopPropagation()}
          onContextMenu={handleBackgroundContextMenu}
        >
          {cellTree && cellListMode === "nested"
            ? /* Hierarchical tree view */
              cellTree.map((root) => (
                <CellTreeNode
                  key={root.name}
                  node={root}
                  depth={0}
                  isDark={isDark}
                  activeCell={activeCell}
                  focusedCellName={
                    isFocused && focusedItem?.type === "cell" ? focusedItem.name : null
                  }
                  editingCellName={editingCellName}
                  expandedCells={expandedCells}
                  hiddenCells={hiddenCells}
                  onSelect={handleSelectCell}
                  onRename={handleRenameCell}
                  onToggleExpand={toggleExpanded}
                />
              ))
            : /* Flat list mode or no tree */
              cells.map((name) => (
                <CellRow
                  key={name}
                  name={name}
                  isActive={name === activeCell}
                  isFocused={isFocused && focusedItem?.type === "cell" && focusedItem.name === name}
                  isDark={isDark}
                  depth={0}
                  hasChildren={false}
                  isExpanded={false}
                  isHidden={hiddenCells.has(name)}
                  onToggleExpand={() => {}}
                  onSelect={() => handleSelectCell(name)}
                  onRename={(newName) => handleRenameCell(name, newName)}
                  startEditing={editingCellName === name}
                  canDrag={name !== activeCell}
                />
              ))}
        </div>

        {/* Hierarchy level footer — controls rendering depth on canvas */}
        <div className={cn("h-px", isDark ? "bg-white/10" : "bg-black/10")} />
        <div className="flex items-center justify-between pl-2 pr-[5.5px] py-1.5">
          <span
            className={cn(
              "text-xs select-none pointer-events-none",
              isDark ? "text-white/40" : "text-black/40",
            )}
          >
            Level
          </span>
          <div className="flex items-center gap-1">
            <input
              id="hierarchy-level-input"
              type="number"
              min="1"
              max={maxTreeDepth}
              value={levelInputValue}
              onChange={(e) => {
                const raw = e.target.value;
                setLevelInputValue(raw);
                const num = parseInt(raw, 10);
                if (!isNaN(num) && num >= 1) {
                  setHierarchyLevelLimit(num);
                }
              }}
              onBlur={() => {
                const num = parseInt(levelInputValue, 10) || maxTreeDepth;
                const clamped = Math.max(1, Math.min(num, maxTreeDepth));
                setHierarchyLevelLimit(clamped);
                setLevelInputValue(clamped.toString());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const num = parseInt(levelInputValue, 10) || maxTreeDepth;
                  const clamped = Math.max(1, Math.min(num, maxTreeDepth));
                  setHierarchyLevelLimit(clamped);
                  setLevelInputValue(clamped.toString());
                  e.currentTarget.blur();
                } else if (e.key === "Escape") {
                  e.currentTarget.blur();
                }
              }}
              className={cn(
                "h-6 w-12 rounded-lg border px-2 text-xs tabular-nums outline-none",
                isDark
                  ? "border-white/10 bg-white/5 text-white/90"
                  : "border-black/10 bg-black/5 text-black/90",
              )}
            />
            {/* "All levels" button */}
            <Tooltip label="All levels" position="bottom">
              <button
                type="button"
                aria-label="All levels"
                onClick={() => setHierarchyLevelLimit(Infinity)}
                className={cn(
                  "flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border transition-colors",
                  isDark
                    ? "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/90"
                    : "border-black/10 bg-black/5 text-black/40 hover:bg-black/10 hover:text-black/90",
                )}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
}
