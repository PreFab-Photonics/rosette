import { useCallback, useEffect, useRef, useState } from "react";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { cellOccurrenceId, cellOccurrencePath, useExplorerStore } from "@/stores/explorer";
import { useContextMenuStore } from "@/stores/context-menu";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import { useUIStore } from "@/stores/ui";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { useKeyboardFocusStore } from "@/stores/keyboard-focus";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useResize } from "@/hooks/use-resize";
import { RenameCellCommand, DeleteCellCommand } from "@/lib/commands";
import { getUndoRedoIntent, isEditableTarget } from "@/lib/keyboard";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import { useTabsStore, switchTab } from "@/stores/tabs";
import { findFocusedRowIndex, focusedItemForRow, projectExplorerRows } from "./explorer/navigation";
import { HamburgerMenu } from "./explorer/HamburgerMenu";
import { CellRow, cellRowDomId } from "./explorer/CellTree";
import { TabList } from "./explorer/TabList";

const CONTAINED_EXPLORER_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "ArrowRight",
  "ArrowLeft",
  "Home",
  "End",
  " ",
  "Enter",
  "F2",
  "Delete",
  "Backspace",
  "Escape",
]);

/**
 * Collapsed explorer — narrow icon rail with app icon and expand button.
 * Shows a tab count badge when 2+ tabs are open.
 */
function CollapsedExplorer({ isDark, onExpand }: { isDark: boolean; onExpand: () => void }) {
  const tabCount = useTabsStore((s) => s.tabs.length);

  return (
    <div
      className={cn(
        "fixed top-4 left-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border pt-1 pb-[5px]",
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
        aria-label="Expand Explorer"
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
  const editingCellOccurrenceId = useExplorerStore((s) => s.editingCellOccurrenceId);
  const expandedCells = useExplorerStore((s) => s.expandedCells);
  const toggleExpanded = useExplorerStore((s) => s.toggleExpanded);
  const cellsLoaded = useExplorerStore((s) => s.cellsLoaded);
  const hierarchyLevelLimit = useExplorerStore((s) => s.hierarchyLevelLimit);
  const setHierarchyLevelLimit = useExplorerStore((s) => s.setHierarchyLevelLimit);
  const maxTreeDepth = useExplorerStore((s) => s.maxTreeDepth);
  const hiddenCells = useExplorerStore((s) => s.hiddenCells);
  const toggleCellVisibility = useExplorerStore((s) => s.toggleCellVisibility);
  const cellListMode = useExplorerStore((s) => s.cellListMode);
  const isFocused = useExplorerStore((s) => s.isFocused);
  const focusedItem = useExplorerStore((s) => s.focusedItem);
  const setFocused = useExplorerStore((s) => s.setFocused);
  const setFocusedItem = useExplorerStore((s) => s.setFocusedItem);
  const tabs = useTabsStore((s) => s.tabs);
  const [isCellFilterOpen, setIsCellFilterOpen] = useState(false);
  const [cellFilter, setCellFilter] = useState("");
  const filterQuery = cellFilter.trim();

  const rows = projectExplorerRows({
    tabs,
    cellTree,
    cells,
    expandedCells,
    cellListMode,
    filterQuery,
  });
  const cellRows = rows.filter((row) => row.type === "cell");
  const ariaSelectedOccurrenceId = cellRows.find((row) => row.name === activeCell)?.occurrenceId;
  const cellFilterCursorRow = isCellFilterOpen
    ? (cellRows.find(
        (row) => focusedItem?.type === "cell" && row.occurrenceId === focusedItem.occurrenceId,
      ) ?? cellRows[0])
    : null;
  const cellTabStopOccurrenceId =
    isFocused && focusedItem?.type === "cell"
      ? focusedItem.occurrenceId
      : !isFocused && !isCellFilterOpen
        ? (cellRows.find((row) => row.name === activeCell)?.occurrenceId ??
          cellRows[0]?.occurrenceId)
        : null;

  useEffect(() => {
    if (!isFocused) return;
    if (rows.length === 0) {
      setFocused(false);
      return;
    }
    if (!focusedItem) return;
    if (findFocusedRowIndex(rows, focusedItem) >= 0) return;

    let fallback = null;
    if (focusedItem.type === "cell") {
      const path = cellOccurrencePath(focusedItem.occurrenceId);
      for (let length = path.length - 1; length > 0 && !fallback; length--) {
        const ancestorId = cellOccurrenceId(path.slice(0, length));
        fallback = rows.find((row) => row.type === "cell" && row.occurrenceId === ancestorId);
      }
      fallback ??= rows.find((row) => row.type === "cell" && row.name === focusedItem.name);
    }
    fallback ??= rows.find((row) => row.type === "cell" && row.name === activeCell);
    fallback ??= rows[0];
    setFocusedItem(focusedItemForRow(fallback));
  }, [activeCell, focusedItem, isFocused, rows, setFocused, setFocusedItem]);

  // Claim keyboard focus when Explorer is keyboard-navigating
  useKeyboardFocus("explorer-panel", isFocused);
  useKeyboardFocus("explorer-filter", isCellFilterOpen);

  // On sm, the expanded Explorer is an overlay — track if it was manually opened
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const cellFilterRef = useRef<HTMLInputElement>(null);
  const cellFilterButtonRef = useRef<HTMLButtonElement>(null);
  const cellFilterReturnFocusRef = useRef<HTMLElement>(null);
  const cellFilterReturnItemRef = useRef<typeof focusedItem>(null);

  const openCellFilter = useCallback(() => {
    const activeElement = document.activeElement;
    cellFilterReturnFocusRef.current =
      activeElement instanceof HTMLElement && drawerRef.current?.contains(activeElement)
        ? activeElement
        : null;
    const explorerState = useExplorerStore.getState();
    cellFilterReturnItemRef.current = explorerState.isFocused ? explorerState.focusedItem : null;
    setIsCellFilterOpen(true);
    setFocused(false);
    requestAnimationFrame(() => cellFilterRef.current?.focus());
  }, [setFocused]);

  const dismissCellFilter = useCallback(() => {
    cellFilterReturnFocusRef.current = null;
    cellFilterReturnItemRef.current = null;
    setCellFilter("");
    setIsCellFilterOpen(false);
  }, []);

  const closeCellFilter = useCallback(() => {
    const returnFocus = cellFilterReturnFocusRef.current;
    const returnItem = cellFilterReturnItemRef.current;
    dismissCellFilter();
    requestAnimationFrame(() => {
      if (returnItem) {
        useExplorerStore.setState({ isFocused: true, focusedItem: returnItem });
      } else if (returnFocus?.isConnected) {
        returnFocus.focus();
      } else {
        cellFilterButtonRef.current?.focus();
      }
    });
  }, [dismissCellFilter]);

  const handleCellFilterKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isCellFilterOpen) return;
      if (!useKeyboardFocusStore.getState().owns("explorer-filter")) {
        event.preventDefault();
        return;
      }
      if (event.nativeEvent.isComposing) return;
      if (event.key === "Tab") {
        event.preventDefault();
        event.stopPropagation();
        cellFilterRef.current?.focus();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        if (cellFilter) {
          setCellFilter("");
          requestAnimationFrame(() => cellFilterRef.current?.focus());
        } else {
          closeCellFilter();
        }
        return;
      }
      if (event.target !== cellFilterRef.current || !cellFilterCursorRow) return;

      const cursorIndex = cellRows.findIndex(
        (row) => row.occurrenceId === cellFilterCursorRow.occurrenceId,
      );
      let nextRow = null;
      switch (event.key) {
        case "ArrowDown":
          nextRow = cellRows[(cursorIndex + 1) % cellRows.length];
          break;
        case "ArrowUp":
          nextRow = cellRows[(cursorIndex - 1 + cellRows.length) % cellRows.length];
          break;
        case "Home":
          nextRow = cellRows[0];
          break;
        case "End":
          nextRow = cellRows[cellRows.length - 1];
          break;
        case "Enter": {
          event.preventDefault();
          event.stopPropagation();
          const state = useExplorerStore.getState();
          if (cellFilterCursorRow.name === state.activeCell) {
            if (state.cells.length > 1) state.setActiveCell(null);
          } else {
            state.setActiveCell(cellFilterCursorRow.name);
          }
          cellFilterReturnItemRef.current = focusedItemForRow(cellFilterCursorRow);
          closeCellFilter();
          return;
        }
        default:
          return;
      }
      event.preventDefault();
      event.stopPropagation();
      setFocusedItem(focusedItemForRow(nextRow));
    },
    [cellFilter, cellFilterCursorRow, cellRows, closeCellFilter, isCellFilterOpen, setFocusedItem],
  );

  const handlePanelPointerDownCapture = useCallback(
    (event: React.PointerEvent) => {
      if (!isCellFilterOpen || !(event.target instanceof Element)) return;
      if (
        event.target.closest("#explorer-cell-filter") ||
        event.target.closest("#explorer-cell-tree") ||
        event.target.closest("[data-explorer-filter-toggle]")
      ) {
        return;
      }
      dismissCellFilter();
    },
    [dismissCellFilter, isCellFilterOpen],
  );

  useEffect(() => {
    if (!collapsed || (isSm && drawerOpen)) return;
    if (isFocused) setFocused(false);
    if (isCellFilterOpen) dismissCellFilter();
  }, [collapsed, dismissCellFilter, drawerOpen, isCellFilterOpen, isFocused, isSm, setFocused]);
  const cellListRef = useCallback(
    (node: HTMLUListElement | null) => {
      if (!node) return;
      const handleFocusOut = (event: FocusEvent) => {
        if (!node.contains(event.relatedTarget as Node | null)) setFocused(false);
      };
      const handleWheel = (event: WheelEvent) => event.stopPropagation();
      const handleContextMenu = (event: MouseEvent) => {
        if (event.target !== node) return;
        event.preventDefault();
        useContextMenuStore.getState().open("cell", { x: event.clientX, y: event.clientY });
      };
      node.addEventListener("focusout", handleFocusOut);
      node.addEventListener("wheel", handleWheel);
      node.addEventListener("contextmenu", handleContextMenu);
      return () => {
        node.removeEventListener("focusout", handleFocusOut);
        node.removeEventListener("wheel", handleWheel);
        node.removeEventListener("contextmenu", handleContextMenu);
      };
    },
    [setFocused],
  );

  // Close drawer on outside click (sm overlay mode)
  useEffect(() => {
    if (!isSm || !drawerOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
        dismissCellFilter();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dismissCellFilter, isSm, drawerOpen]);

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

  // Navigates the unified tab + cell row projection while focus is inside the Explorer.
  const handleExplorerKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isFocused || !useKeyboardFocusStore.getState().owns("explorer-panel")) return;
      if (
        e.target instanceof Element &&
        e.target.closest("[data-explorer-row-action]") &&
        (e.key === "Enter" || e.key === " ")
      ) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f" && !isEditableTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        openCellFilter();
        return;
      }
      if (isEditableTarget(e.target) || e.isComposing) return;

      const state = useExplorerStore.getState();
      if (state.editingCellName) return;

      const projectedRows = projectExplorerRows({
        tabs: useTabsStore.getState().tabs,
        cellTree: state.cellTree,
        cells: state.cells,
        expandedCells: state.expandedCells,
        cellListMode: state.cellListMode,
        filterQuery,
      });
      if (projectedRows.length === 0) return;

      const currentIndex = findFocusedRowIndex(projectedRows, state.focusedItem);
      const currentRow = currentIndex >= 0 ? projectedRows[currentIndex] : null;
      if (CONTAINED_EXPLORER_KEYS.has(e.key)) e.stopPropagation();

      const activateCurrentRow = () => {
        if (!currentRow) return;
        if (currentRow.type === "tab") {
          const currentTabId = useTabsStore.getState().activeTabId;
          if (currentRow.id === currentTabId) return;
          switchTab(currentTabId, currentRow.id);
          useTabsStore.getState().setActiveTab(currentRow.id);
          useExplorerStore.setState({
            isFocused: true,
            focusedItem: { type: "tab", id: currentRow.id },
          });
          return;
        }
        if (currentRow.name === state.activeCell) {
          if (state.cells.length > 1) setActiveCell(null);
        } else {
          setActiveCell(currentRow.name);
        }
      };

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const index = currentIndex < projectedRows.length - 1 ? currentIndex + 1 : 0;
          setFocusedItem(focusedItemForRow(projectedRows[index]));
          return;
        }
        case "ArrowUp": {
          e.preventDefault();
          const index = currentIndex > 0 ? currentIndex - 1 : projectedRows.length - 1;
          setFocusedItem(focusedItemForRow(projectedRows[index]));
          return;
        }
        case "Home":
          e.preventDefault();
          setFocusedItem(focusedItemForRow(projectedRows[0]));
          return;
        case "End":
          e.preventDefault();
          setFocusedItem(focusedItemForRow(projectedRows[projectedRows.length - 1]));
          return;
        case "ArrowRight": {
          e.preventDefault();
          if (currentRow?.type !== "cell" || state.cellListMode !== "nested") return;
          if (currentRow.hasChildren && !currentRow.isExpanded) {
            toggleExpanded(currentRow.occurrenceId);
          } else if (currentRow.hasChildren) {
            const child = projectedRows[currentIndex + 1];
            if (child?.type === "cell" && child.parentOccurrenceId === currentRow.occurrenceId) {
              setFocusedItem(focusedItemForRow(child));
            }
          }
          return;
        }
        case "ArrowLeft": {
          e.preventDefault();
          if (currentRow?.type !== "cell" || state.cellListMode !== "nested") return;
          if (currentRow.hasChildren && currentRow.isExpanded && !filterQuery) {
            toggleExpanded(currentRow.occurrenceId);
          } else if (currentRow.parentOccurrenceId) {
            const parent = projectedRows.find(
              (row) => row.type === "cell" && row.occurrenceId === currentRow.parentOccurrenceId,
            );
            if (parent) setFocusedItem(focusedItemForRow(parent));
          }
          return;
        }
        case " ":
          e.preventDefault();
          activateCurrentRow();
          return;
        case "Enter":
          e.preventDefault();
          if (currentRow?.type === "tab") {
            activateCurrentRow();
          } else if (currentRow?.type === "cell") {
            useExplorerStore.getState().setEditingCell(currentRow.occurrenceId, currentRow.name);
          }
          return;
        case "F2":
          e.preventDefault();
          if (currentRow?.type === "cell") {
            useExplorerStore.getState().setEditingCell(currentRow.occurrenceId, currentRow.name);
          }
          return;
        case "Delete":
        case "Backspace": {
          e.preventDefault();
          if (!currentRow) return;
          if (currentRow.type === "tab") {
            const closedIndex = currentIndex;
            window.dispatchEvent(new CustomEvent("rosette-close-tab", { detail: currentRow.id }));
            setTimeout(() => {
              const freshState = useExplorerStore.getState();
              const freshRows = projectExplorerRows({
                tabs: useTabsStore.getState().tabs,
                cellTree: freshState.cellTree,
                cells: freshState.cells,
                expandedCells: freshState.expandedCells,
                cellListMode: freshState.cellListMode,
                filterQuery,
              });
              const row = freshRows[Math.min(closedIndex, freshRows.length - 1)];
              useExplorerStore.setState(
                row
                  ? { isFocused: true, focusedItem: focusedItemForRow(row) }
                  : { isFocused: false, focusedItem: null },
              );
            }, 0);
            return;
          }
          if (state.cells.length <= 1) return;
          const { library, renderer } = useWasmContextStore.getState();
          if (!library || !renderer) return;
          const deletedIndex = currentIndex;
          useHistoryStore
            .getState()
            .execute(new DeleteCellCommand(currentRow.name), { library, renderer });
          const freshState = useExplorerStore.getState();
          const freshRows = projectExplorerRows({
            tabs: useTabsStore.getState().tabs,
            cellTree: freshState.cellTree,
            cells: freshState.cells,
            expandedCells: freshState.expandedCells,
            cellListMode: freshState.cellListMode,
            filterQuery,
          });
          const row = freshRows[Math.min(deletedIndex, freshRows.length - 1)];
          setFocusedItem(row ? focusedItemForRow(row) : null);
          return;
        }
        case "Escape":
          e.preventDefault();
          (e.target as HTMLElement).blur();
          setFocused(false);
          return;
      }

      const undoRedo = getUndoRedoIntent(e);
      if (undoRedo) {
        e.preventDefault();
        e.stopPropagation();
        const { library, renderer } = useWasmContextStore.getState();
        if (!library || !renderer) return;
        if (undoRedo === "redo") {
          useHistoryStore.getState().redo({ library, renderer });
        } else {
          useHistoryStore.getState().undo({ library, renderer });
        }
        return;
      }

      if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey || !e.key.trim()) return;
      e.preventDefault();
      e.stopPropagation();
      setCellFilter(e.key);
      openCellFilter();
    },
    [
      filterQuery,
      isFocused,
      openCellFilter,
      setActiveCell,
      setFocused,
      setFocusedItem,
      toggleExpanded,
    ],
  );

  const setDrawerNode = useCallback(
    (node: HTMLDivElement | null) => {
      drawerRef.current = node;
      if (!node) return;
      node.addEventListener("keydown", handleExplorerKeyDown);
      return () => {
        node.removeEventListener("keydown", handleExplorerKeyDown);
        if (drawerRef.current === node) drawerRef.current = null;
      };
    },
    [handleExplorerKeyDown],
  );

  const handleExpand = useCallback(() => {
    if (isSm) {
      // On mobile, open as overlay drawer
      setDrawerOpen(true);
    } else {
      toggleCollapsed();
    }
  }, [isSm, toggleCollapsed]);

  const handleCollapse = useCallback(() => {
    setFocused(false);
    dismissCellFilter();
    if (
      document.activeElement instanceof HTMLElement &&
      drawerRef.current?.contains(document.activeElement)
    ) {
      document.activeElement.blur();
    }
    toggleCollapsed();
  }, [dismissCellFilter, setFocused, toggleCollapsed]);

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
        ref={setDrawerNode}
        onPointerDownCapture={handlePanelPointerDownCapture}
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
        <div data-explorer-header className="flex items-center px-1 pt-1 pb-[3px]">
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
                aria-label="Project name"
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
                aria-label="Rename project"
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

          <button
            ref={cellFilterButtonRef}
            type="button"
            data-explorer-filter-toggle
            aria-label={isCellFilterOpen ? "Close cell filter" : "Filter cells"}
            aria-controls={isCellFilterOpen ? "explorer-cell-filter" : undefined}
            aria-expanded={isCellFilterOpen}
            onKeyDown={handleCellFilterKeyDown}
            onClick={isCellFilterOpen ? closeCellFilter : openCellFilter}
            className={cn(
              "flex-shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none focus-visible:ring-1",
              isDark
                ? "hover:bg-[rgb(54,54,54)] focus-visible:ring-white/30"
                : "hover:bg-[rgb(217,217,217)] focus-visible:ring-black/30",
            )}
          >
            {isCellFilterOpen ? (
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={isDark ? "text-white/60" : "text-black/60"}
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={isDark ? "text-white/60" : "text-black/60"}
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            )}
          </button>

          {/* Hamburger menu */}
          <HamburgerMenu isDark={isDark} />

          {/* Collapse button (not shown on sm — use drawer dismiss instead) */}
          {!isSm && (
            <button
              type="button"
              aria-label="Collapse Explorer"
              onClick={handleCollapse}
              className={cn(
                "ml-1 flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors focus:outline-none",
                isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
              )}
            >
              <NavArrowLeft
                strokeWidth={2}
                className={cn("h-4 w-4", isDark ? "text-white/60" : "text-black/60")}
              />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className={cn("h-px", isDark ? "bg-white/10" : "bg-black/10")} />

        {isCellFilterOpen && (
          <div data-explorer-filter-row className="px-1 pt-1.5 pb-1">
            <div
              id="explorer-cell-filter"
              className={cn(
                "flex h-6 items-center gap-1.5 rounded-lg border px-1.5 transition-colors focus-within:ring-1",
                isDark
                  ? "border-white/10 bg-white/5 text-white/40 focus-within:border-white/20 focus-within:ring-white/10"
                  : "border-black/10 bg-black/5 text-black/40 focus-within:border-black/20 focus-within:ring-black/10",
              )}
            >
              <svg
                aria-hidden="true"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="flex-shrink-0"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input
                ref={cellFilterRef}
                type="search"
                role="combobox"
                aria-label="Filter cells"
                aria-controls="explorer-cell-tree"
                aria-autocomplete="list"
                aria-expanded="true"
                aria-haspopup="tree"
                aria-activedescendant={
                  cellFilterCursorRow ? cellRowDomId(cellFilterCursorRow.occurrenceId) : undefined
                }
                value={cellFilter}
                onChange={(event) => setCellFilter(event.target.value)}
                onFocus={() => {
                  const state = useExplorerStore.getState();
                  if (state.isFocused) state.setFocused(false);
                }}
                onKeyDown={handleCellFilterKeyDown}
                placeholder="Filter cells"
                className={cn(
                  "min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-xs leading-5 outline-none [&::-webkit-search-cancel-button]:hidden",
                  isDark
                    ? "text-white/90 placeholder:text-white/30"
                    : "text-black/90 placeholder:text-black/30",
                )}
              />
              {cellFilter && (
                <button
                  type="button"
                  aria-label="Clear cell filter"
                  onKeyDown={handleCellFilterKeyDown}
                  onClick={() => {
                    setCellFilter("");
                    requestAnimationFrame(() => cellFilterRef.current?.focus());
                  }}
                  className={cn(
                    "flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0",
                    isDark
                      ? "text-white/40 hover:text-white/80"
                      : "text-black/40 hover:text-black/80",
                  )}
                >
                  <svg
                    aria-hidden="true"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Vertical tab list (shown when 2+ tabs are open) */}
        <TabList
          isDark={isDark}
          focusedItem={isFocused ? focusedItem : null}
          isKeyboardNavigationActive={isFocused}
        />

        {/* Cell tree / list */}
        <ul
          id="explorer-cell-tree"
          ref={cellListRef}
          role="tree"
          aria-label="Cells"
          tabIndex={-1}
          className="m-0 flex list-none flex-col gap-0.5 overflow-y-auto p-0 py-1"
          style={{
            maxHeight: isCellFilterOpen ? "calc(100vh - 210px)" : "calc(100vh - 176px)",
          }}
        >
          {cellRows.map((row) => (
            <CellRow
              key={row.occurrenceId}
              occurrenceId={row.occurrenceId}
              name={row.name}
              isActive={row.name === activeCell}
              isAriaSelected={row.occurrenceId === ariaSelectedOccurrenceId}
              isFocused={
                (isFocused &&
                  focusedItem?.type === "cell" &&
                  focusedItem.occurrenceId === row.occurrenceId) ||
                cellFilterCursorRow?.occurrenceId === row.occurrenceId
              }
              isTabStop={row.occurrenceId === cellTabStopOccurrenceId}
              isDark={isDark}
              depth={row.depth}
              guideLevels={row.guideLevels}
              posInSet={row.posInSet}
              setSize={row.setSize}
              hasChildren={row.hasChildren}
              isExpanded={row.isExpanded}
              isExpansionLocked={Boolean(filterQuery)}
              isHidden={hiddenCells.has(row.name)}
              onToggleExpand={() => toggleExpanded(row.occurrenceId)}
              onToggleVisibility={() => {
                toggleCellVisibility(row.name);
                if (isCellFilterOpen) {
                  requestAnimationFrame(() => {
                    cellFilterRef.current?.focus();
                    useExplorerStore.getState().setFocusedItem(focusedItemForRow(row));
                  });
                }
              }}
              onSelect={() => {
                handleSelectCell(row.name);
                if (isCellFilterOpen) {
                  cellFilterReturnItemRef.current = focusedItemForRow(row);
                  closeCellFilter();
                }
              }}
              onRename={(newName) => {
                const returnItem = cellFilterReturnItemRef.current;
                handleRenameCell(row.name, newName);
                if (isCellFilterOpen && returnItem?.type === "cell") {
                  const path = cellOccurrencePath(returnItem.occurrenceId).map((segment) =>
                    segment === row.name ? newName : segment,
                  );
                  cellFilterReturnItemRef.current = {
                    type: "cell",
                    occurrenceId: cellOccurrenceId(path),
                    name: returnItem.name === row.name ? newName : returnItem.name,
                  };
                }
              }}
              startEditing={
                editingCellName === row.name && editingCellOccurrenceId === row.occurrenceId
              }
              canDrag={row.name !== activeCell}
              filterQuery={filterQuery}
              moveDomFocusOnFocus={!isCellFilterOpen}
              isActionTabStop={
                isFocused &&
                focusedItem?.type === "cell" &&
                focusedItem.occurrenceId === row.occurrenceId
              }
              onRestoreFocusAfterRename={
                isCellFilterOpen ? () => cellFilterRef.current?.focus() : undefined
              }
              claimPanelFocusOnInteraction={!isCellFilterOpen}
              onDragStart={
                isCellFilterOpen
                  ? () => {
                      cellFilterReturnItemRef.current = focusedItemForRow(row);
                      closeCellFilter();
                    }
                  : undefined
              }
              onContextMenuOpen={isCellFilterOpen ? dismissCellFilter : undefined}
            />
          ))}
        </ul>
        {filterQuery && cellRows.length === 0 && (
          <output
            className={cn(
              "block px-3 py-5 text-center text-xs",
              isDark ? "text-white/40" : "text-black/40",
            )}
          >
            No cells match &ldquo;{filterQuery}&rdquo;
          </output>
        )}

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
