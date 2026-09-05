import { useState, useEffect, useRef, useCallback, useId } from "react";
import { useExplorerStore, type CellOccurrenceId } from "@/stores/explorer";
import { useContextMenuStore } from "@/stores/context-menu";
import { useCellDragStore } from "@/stores/cell-drag";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useKeyboardFocusStore } from "@/stores/keyboard-focus";
import { useInlineRename } from "@/hooks/use-inline-rename";
import { useDocumentStore } from "@/stores/document";
import { cn } from "@/lib/utils";
import { panelRowStateClassName } from "@/components/ui/panel-row";
import { VisibilityIcon } from "@/components/ui/VisibilityIcon";

/**
 * Chevron icon for tree expand/collapse.
 */
export function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={cn(
        "flex-shrink-0 text-foreground-subtle transition-transform duration-150",
        expanded ? "rotate-90" : "rotate-0",
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
}: {
  depth: number;
  guideLevels: readonly number[];
  isLastSibling: boolean;
}) {
  if (depth === 0) return null;
  const guideLeft = (level: number) => 12 + level * 10;
  const branchLevel = depth - 1;

  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {guideLevels.map((level) => (
        <span
          key={level}
          data-hierarchy-guide="ancestor"
          className="absolute w-px bg-theme-border"
          style={{ left: guideLeft(level), top: -2, bottom: -2 }}
        />
      ))}
      <span
        data-hierarchy-guide="branch"
        className="absolute w-px bg-theme-border"
        style={{
          left: guideLeft(branchLevel),
          top: -2,
          bottom: isLastSibling ? "50%" : -2,
        }}
      />
      <span
        data-hierarchy-guide="elbow"
        className="absolute h-px w-[5px] bg-theme-border"
        style={{ left: guideLeft(branchLevel), top: "50%" }}
      />
    </span>
  );
}

function HighlightedCellName({ name, query }: { name: string; query: string }) {
  const normalizedQuery = query.trim().toLowerCase();
  const matchIndex = name.toLowerCase().indexOf(normalizedQuery);
  if (!normalizedQuery || matchIndex < 0) return name;
  const matchEnd = matchIndex + normalizedQuery.length;

  return (
    <>
      {name.slice(0, matchIndex)}
      <mark className="rounded-[2px] bg-highlight text-inherit">
        {name.slice(matchIndex, matchEnd)}
      </mark>
      {name.slice(matchEnd)}
    </>
  );
}

export function cellRowDomId(occurrenceId: CellOccurrenceId): string {
  return `explorer-cell-${encodeURIComponent(occurrenceId)}`;
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
  depth,
  guideLevels,
  posInSet,
  setSize,
  hasChildren,
  isExpanded,
  isHidden,
  onToggleExpand,
  onToggleVisibility,
  onSelect,
  onRename,
  startEditing,
  canDrag,
  filterQuery = "",
  isExpansionLocked = false,
  moveDomFocusOnFocus = true,
  isActionTabStop = isFocused,
  onRestoreFocusAfterRename,
  claimPanelFocusOnInteraction = true,
  onDragStart,
  onContextMenuOpen,
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
  depth: number;
  guideLevels: readonly number[];
  posInSet: number;
  setSize: number;
  hasChildren: boolean;
  isExpanded: boolean;
  /** Whether this cell's internal geometry is hidden. */
  isHidden: boolean;
  onToggleExpand: () => void;
  onToggleVisibility: () => void;
  onSelect: () => void;
  onRename: (newName: string) => void;
  startEditing: boolean;
  /** Whether this cell can be dragged onto the canvas to create an instance. */
  canDrag: boolean;
  /** Current cell filter, used to highlight the matching name segment. */
  filterQuery?: string;
  /** Whether hierarchy expansion is temporarily controlled by filtering. */
  isExpansionLocked?: boolean;
  /** Whether the visual cursor should also move DOM focus to this row. */
  moveDomFocusOnFocus?: boolean;
  /** Whether secondary row actions join the tab order for this cursor state. */
  isActionTabStop?: boolean;
  /** Optional focus target used when rename completes outside normal tree navigation. */
  onRestoreFocusAfterRename?: () => void;
  /** Whether pointer interaction should transfer keyboard ownership to tree navigation. */
  claimPanelFocusOnInteraction?: boolean;
  /** Called once the pointer crosses the drag threshold and a drag can begin. */
  onDragStart?: () => void;
  /** Called before this row transfers keyboard ownership to its context menu. */
  onContextMenuOpen?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const sourceBacked = useDocumentStore((s) => s.backing.kind === "source");
  const rowRef = useRef<HTMLLIElement>(null);
  const visibilityStatusId = useId();

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
      if (moveDomFocusOnFocus && document.activeElement !== rowRef.current) {
        rowRef.current.focus({ preventScroll: true });
      }
      rowRef.current.scrollIntoView?.({ block: "nearest" });
    }
  }, [isEditing, isFocused, moveDomFocusOnFocus]);

  // Enter edit mode when triggered externally (e.g., from context menu "Rename")
  useEffect(() => {
    if (startEditing && !sourceBacked) {
      setIsEditing(true);
      // Clear the editing signal
      useExplorerStore.getState().setEditingCellName(null);
    }
  }, [sourceBacked, startEditing]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      useExplorerStore.getState().setFocusedItem({ type: "cell", occurrenceId, name });
      onContextMenuOpen?.();
      useContextMenuStore.getState().open("cell", { x: e.clientX, y: e.clientY }, name);
    },
    [name, occurrenceId, onContextMenuOpen],
  );

  const handleChevronClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleExpand();
    },
    [onToggleExpand],
  );

  const focusRow = useCallback(() => {
    const store = useExplorerStore.getState();
    if (claimPanelFocusOnInteraction && !store.isFocused) store.setFocused(true);
    store.setFocusedItem({ type: "cell", occurrenceId, name });
  }, [claimPanelFocusOnInteraction, name, occurrenceId]);

  const handleRowFocus = useCallback(
    (event: React.FocusEvent<HTMLLIElement>) => {
      if (event.target === event.currentTarget) focusRow();
    },
    [focusRow],
  );

  const handleRowClick = useCallback(() => {
    focusRow();
    onSelect();
  }, [focusRow, onSelect]);

  const handleVisibilityClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      focusRow();
      onToggleVisibility();
    },
    [focusRow, onToggleVisibility],
  );

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
      if (event.key === "Tab" && onRestoreFocusAfterRename) {
        event.preventDefault();
        event.stopPropagation();
        handleNameSubmit();
        requestAnimationFrame(onRestoreFocusAfterRename);
        return;
      }
      const restoresRowFocus = event.key === "Enter" || event.key === "Escape";
      handleKeyDown(event);
      if (restoresRowFocus) {
        requestAnimationFrame(() =>
          onRestoreFocusAfterRename ? onRestoreFocusAfterRename() : rowRef.current?.focus(),
        );
      }
    },
    [handleKeyDown, handleNameSubmit, onRestoreFocusAfterRename],
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
      if (sourceBacked || !canDrag || isEditing) {
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

          onDragStart?.();
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
    [canDrag, isEditing, name, onDragStart, sourceBacked],
  );

  return (
    <li
      id={cellRowDomId(occurrenceId)}
      ref={rowRef}
      role="treeitem"
      aria-label={name}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-level={depth + 1}
      aria-describedby={visibilityStatusId}
      aria-posinset={posInSet}
      aria-selected={isAriaSelected}
      aria-setsize={setSize}
      data-occurrence-id={occurrenceId}
      className={cn(
        "group relative mx-1 flex min-w-0 w-[calc(100%-8px)] cursor-pointer items-center rounded-lg border-0 py-1.5 text-left transition-colors focus:outline-none",
        panelRowStateClassName({ isActive, isFocused }),
      )}
      style={{ paddingLeft: `${7 + depth * 10}px`, paddingRight: "7px" }}
      onClick={handleRowClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={(event) => {
        event.stopPropagation();
        if (!sourceBacked) setIsEditing(true);
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
      />

      {/* Expand/collapse chevron (or spacer for leaves) */}
      {hasChildren && isExpansionLocked ? (
        <span
          aria-hidden="true"
          className="pointer-events-none relative z-10 mr-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center"
        >
          <ChevronIcon expanded={isExpanded} />
        </span>
      ) : hasChildren ? (
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
          <ChevronIcon expanded={isExpanded} />
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
            className="absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 text-foreground outline-none focus:ring-0"
          />
        ) : (
          <span
            className={cn(
              "pointer-events-none absolute inset-0 truncate text-sm leading-5 select-none",
              isHidden && "opacity-40",
            )}
          >
            <HighlightedCellName name={name} query={filterQuery} />
          </span>
        )}
      </div>
      <span id={visibilityStatusId} className="sr-only">
        {isHidden ? "Cell hidden" : "Cell visible"}
      </span>
      <button
        type="button"
        aria-label={`${isHidden ? "Show" : "Hide"} cell ${name}`}
        title={`${isHidden ? "Show" : "Hide"} cell`}
        data-explorer-row-action
        className={cn(
          "relative z-10 flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 outline-none transition-[color,background-color,opacity] focus-visible:ring-1",
          isFocused
            ? "opacity-100"
            : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
          isHidden
            ? "text-foreground-secondary hover:bg-theme-border focus-visible:ring-focus-ring"
            : "text-foreground-muted hover:bg-theme-border hover:text-foreground-secondary focus-visible:ring-focus-ring",
        )}
        onClick={handleVisibilityClick}
        onDoubleClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          if (!useKeyboardFocusStore.getState().owns("explorer-panel")) event.preventDefault();
          event.stopPropagation();
        }}
        onMouseDown={(event) => event.stopPropagation()}
        tabIndex={isActionTabStop ? 0 : -1}
      >
        <VisibilityIcon isHidden={isHidden} />
      </button>
    </li>
  );
}

// =============================================================================
// Tab List (vertical, matches Explorer design language)
// =============================================================================
