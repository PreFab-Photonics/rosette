import { useState, useEffect, useRef, useCallback } from "react";
import { useExplorerStore, type CellOccurrenceId } from "@/stores/explorer";
import { useContextMenuStore } from "@/stores/context-menu";
import { useCellDragStore } from "@/stores/cell-drag";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useKeyboardFocusStore } from "@/stores/keyboard-focus";
import { useInlineRename } from "@/hooks/use-inline-rename";
import { cn } from "@/lib/utils";
import { panelRowStateClassName } from "@/components/ui/panel-row";

/**
 * Chevron icon for tree expand/collapse.
 */
export function ChevronIcon({ expanded, isDark }: { expanded: boolean; isDark: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={cn(
        "flex-shrink-0 transition-transform duration-150",
        expanded ? "rotate-90" : "rotate-0",
        isDark ? "text-white/40" : "text-black/40",
      )}
    >
      <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function HierarchyGuides({
  depth,
  guideLevels,
  isLastSibling,
  isDark,
}: {
  depth: number;
  guideLevels: readonly number[];
  isLastSibling: boolean;
  isDark: boolean;
}) {
  if (depth === 0) return null;
  const color = isDark ? "bg-white/10" : "bg-black/10";
  const guideLeft = (level: number) => 12 + level * 10;
  const branchLevel = depth - 1;

  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {guideLevels.map((level) => (
        <span
          key={level}
          data-hierarchy-guide="ancestor"
          className={cn("absolute w-px", color)}
          style={{ left: guideLeft(level), top: -2, bottom: -2 }}
        />
      ))}
      <span
        data-hierarchy-guide="branch"
        className={cn("absolute w-px", color)}
        style={{
          left: guideLeft(branchLevel),
          top: -2,
          bottom: isLastSibling ? "50%" : -2,
        }}
      />
      <span
        data-hierarchy-guide="elbow"
        className={cn("absolute h-px w-[5px]", color)}
        style={{ left: guideLeft(branchLevel), top: "50%" }}
      />
    </span>
  );
}

/**
 * Single cell row in the explorer panel.
 *
 * Supports right-click context menu and inline rename editing
 * (triggered externally via the explorer store's `editingCellName`).
 */
export function CellRow({
  occurrenceId,
  name,
  isActive,
  isAriaSelected,
  isFocused,
  isTabStop,
  isDark,
  depth,
  guideLevels,
  posInSet,
  setSize,
  hasChildren,
  isExpanded,
  isHidden,
  onToggleExpand,
  onSelect,
  onRename,
  startEditing,
  canDrag,
}: {
  occurrenceId: CellOccurrenceId;
  name: string;
  isActive: boolean;
  /** Whether this canonical occurrence represents the active cell to assistive technology. */
  isAriaSelected: boolean;
  /** Whether this cell has the keyboard navigation cursor. */
  isFocused: boolean;
  /** Whether this occurrence is the Explorer's current tab stop. */
  isTabStop: boolean;
  isDark: boolean;
  depth: number;
  guideLevels: readonly number[];
  posInSet: number;
  setSize: number;
  hasChildren: boolean;
  isExpanded: boolean;
  /** Whether this cell's internal geometry is hidden. */
  isHidden: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
  onRename: (newName: string) => void;
  startEditing: boolean;
  /** Whether this cell can be dragged onto the canvas to create an instance. */
  canDrag: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const rowRef = useRef<HTMLLIElement>(null);

  const {
    inputRef,
    draft: editName,
    setDraft: setEditName,
    commit: handleNameSubmit,
    handleKeyDown,
  } = useInlineRename({
    value: name,
    isEditing,
    onEditingChange: setIsEditing,
    onCommit: onRename,
  });

  // Scroll the focused row into view when it becomes focused
  useEffect(() => {
    if (isFocused && !isEditing && rowRef.current) {
      if (document.activeElement !== rowRef.current) {
        rowRef.current.focus({ preventScroll: true });
      }
      rowRef.current.scrollIntoView?.({ block: "nearest" });
    }
  }, [isEditing, isFocused]);

  // Enter edit mode when triggered externally (e.g., from context menu "Rename")
  useEffect(() => {
    if (startEditing) {
      setIsEditing(true);
      // Clear the editing signal
      useExplorerStore.getState().setEditingCellName(null);
    }
  }, [startEditing]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      useExplorerStore.getState().setFocusedItem({ type: "cell", occurrenceId, name });
      useContextMenuStore.getState().open("cell", { x: e.clientX, y: e.clientY }, name);
    },
    [name, occurrenceId],
  );

  const handleChevronClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleExpand();
    },
    [onToggleExpand],
  );

  const handleRowFocus = useCallback(() => {
    const store = useExplorerStore.getState();
    if (!store.isFocused) store.setFocused(true);
    store.setFocusedItem({ type: "cell", occurrenceId, name });
  }, [name, occurrenceId]);

  const handleRowClick = useCallback(() => {
    handleRowFocus();
    onSelect();
  }, [handleRowFocus, onSelect]);

  const handleRowKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
    if (
      !useKeyboardFocusStore.getState().owns("explorer-panel") &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  const handleRenameKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const restoresRowFocus = event.key === "Enter" || event.key === "Escape";
      handleKeyDown(event);
      if (restoresRowFocus) requestAnimationFrame(() => rowRef.current?.focus());
    },
    [handleKeyDown],
  );

  // Custom drag: on left-button mousedown, attach global mousemove/mouseup
  // listeners for the duration of the potential drag. After a small movement
  // threshold (5px), initiate a cell drag via the store (bypassing the
  // browser's HTML5 drag-and-drop entirely).
  const handleCellMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only left button; skip if not draggable or editing
      if (e.button !== 0) {
        if (e.button === 2) e.preventDefault();
        return;
      }
      if (!canDrag || isEditing) {
        return;
      }

      const startPos = { x: e.clientX, y: e.clientY };
      let dragging = false;

      const handleGlobalMouseMove = (ev: MouseEvent) => {
        // Movement threshold (5px) to distinguish click from drag
        const dx = ev.clientX - startPos.x;
        const dy = ev.clientY - startPos.y;
        if (!dragging && dx * dx + dy * dy < 25) return;

        if (!dragging) {
          dragging = true;

          const { library } = useWasmContextStore.getState();
          if (!library) return;

          const bounds = library.get_cell_bounds(name) ?? null;
          const originRaw = library.get_cell_origin_by_name(name);
          const origin = {
            x: originRaw ? originRaw[0] : 0,
            y: originRaw ? originRaw[1] : 0,
          };

          useCellDragStore.getState().startDrag(name, bounds, origin);
        }
      };

      const handleGlobalMouseUp = () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    },
    [canDrag, isEditing, name],
  );

  return (
    <li
      ref={rowRef}
      role="treeitem"
      aria-label={name}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-level={depth + 1}
      aria-posinset={posInSet}
      aria-selected={isAriaSelected}
      aria-setsize={setSize}
      data-occurrence-id={occurrenceId}
      className={cn(
        "relative mx-1 flex min-w-0 w-[calc(100%-8px)] cursor-pointer items-center rounded-lg border-0 py-1.5 text-left transition-colors focus:outline-none",
        panelRowStateClassName({ isActive, isFocused, isDark }),
      )}
      style={{ paddingLeft: `${7 + depth * 10}px`, paddingRight: "7px" }}
      onClick={handleRowClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={(event) => {
        event.stopPropagation();
        setIsEditing(true);
      }}
      onFocus={handleRowFocus}
      onKeyDown={handleRowKeyDown}
      onMouseDown={handleCellMouseDown}
      tabIndex={isTabStop ? 0 : -1}
    >
      <HierarchyGuides
        depth={depth}
        guideLevels={guideLevels}
        isLastSibling={posInSet === setSize}
        isDark={isDark}
      />

      {/* Expand/collapse chevron (or spacer for leaves) */}
      {hasChildren ? (
        <button
          type="button"
          aria-hidden="true"
          className="relative z-10 mr-0.5 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center bg-transparent border-none p-0"
          onClick={handleChevronClick}
          onContextMenu={handleContextMenu}
          onDoubleClick={(event) => event.stopPropagation()}
          onKeyDown={handleRowKeyDown}
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          tabIndex={-1}
        >
          <ChevronIcon expanded={isExpanded} isDark={isDark} />
        </button>
      ) : (
        <span className="pointer-events-none relative z-10 mr-0.5 h-4 w-4 flex-shrink-0" />
      )}

      <div className="relative z-10 h-5 min-w-0 flex-1">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleRenameKeyDown}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className={cn(
              "absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0",
              isDark ? "text-white/90" : "text-black/90",
            )}
          />
        ) : (
          <span
            className={cn(
              "pointer-events-none absolute inset-0 truncate text-sm leading-5 select-none",
              isHidden && "opacity-40",
            )}
          >
            {name}
          </span>
        )}
      </div>
    </li>
  );
}

// =============================================================================
// Tab List (vertical, matches Explorer design language)
// =============================================================================
