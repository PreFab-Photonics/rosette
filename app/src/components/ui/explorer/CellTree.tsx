import { useState, useEffect, useRef, useCallback } from "react";
import type { CellNode } from "@/stores/explorer";
import { useExplorerStore } from "@/stores/explorer";
import { useContextMenuStore } from "@/stores/context-menu";
import { useCellDragStore } from "@/stores/cell-drag";
import { useWasmContextStore } from "@/stores/wasm-context";
import { cn } from "@/lib/utils";

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

/**
 * Single cell row in the explorer panel.
 *
 * Supports right-click context menu and inline rename editing
 * (triggered externally via the explorer store's `editingCellName`).
 */
export function CellRow({
  name,
  isActive,
  isFocused,
  isDark,
  depth,
  hasChildren,
  isExpanded,
  isHidden,
  onToggleExpand,
  onSelect,
  onRename,
  startEditing,
  canDrag,
}: {
  name: string;
  isActive: boolean;
  /** Whether this cell has the keyboard navigation cursor. */
  isFocused: boolean;
  isDark: boolean;
  depth: number;
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
  const [editName, setEditName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLButtonElement>(null);

  // Scroll the focused row into view when it becomes focused
  useEffect(() => {
    if (isFocused && rowRef.current) {
      rowRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isFocused]);

  // Enter edit mode when triggered externally (e.g., from context menu "Rename")
  useEffect(() => {
    if (startEditing) {
      setIsEditing(true);
      setEditName(name);
      // Clear the editing signal
      useExplorerStore.getState().setEditingCellName(null);
    }
  }, [startEditing, name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleNameSubmit = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== name) {
      onRename(trimmed);
    } else {
      setEditName(name);
    }
    setIsEditing(false);
  }, [editName, name, onRename]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleNameSubmit();
      } else if (e.key === "Escape") {
        setEditName(name);
        setIsEditing(false);
      }
    },
    [handleNameSubmit, name],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      useContextMenuStore.getState().open("cell", { x: e.clientX, y: e.clientY }, name);
    },
    [name],
  );

  const handleChevronClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleExpand();
    },
    [onToggleExpand],
  );

  // Custom drag: on left-button mousedown, attach global mousemove/mouseup
  // listeners for the duration of the potential drag. After a small movement
  // threshold (5px), initiate a cell drag via the store (bypassing the
  // browser's HTML5 drag-and-drop entirely).
  const handleCellMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only left button; skip if not draggable or editing
      if (e.button !== 0 || !canDrag || isEditing) {
        if (!canDrag) e.preventDefault();
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
    <button
      ref={rowRef}
      type="button"
      className={cn(
        "mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center rounded-lg py-1.5 text-left transition-colors focus:outline-none",
        isActive
          ? isDark
            ? "bg-[rgb(54,54,54)] text-white/90"
            : "bg-[rgb(217,217,217)] text-black/90"
          : isFocused
            ? isDark
              ? "bg-[rgb(44,44,44)] text-white/90"
              : "bg-[rgb(227,227,227)] text-black/90"
            : isDark
              ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90"
              : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90",
        isFocused && (isDark ? "ring-1 ring-white/25" : "ring-1 ring-black/20"),
      )}
      style={{ paddingLeft: `${7 + depth * 10}px`, paddingRight: "7px" }}
      onClick={onSelect}
      onContextMenu={handleContextMenu}
      onMouseDown={handleCellMouseDown}
      tabIndex={-1}
    >
      {/* Expand/collapse chevron (or spacer for leaves) */}
      {hasChildren ? (
        <button
          type="button"
          className="mr-0.5 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center bg-transparent border-none p-0"
          onClick={handleChevronClick}
        >
          <ChevronIcon expanded={isExpanded} isDark={isDark} />
        </button>
      ) : (
        <span className="mr-0.5 h-4 w-4 flex-shrink-0" />
      )}

      <div className="relative h-5 min-w-0 flex-1">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0",
              isDark ? "text-white/90" : "text-black/90",
            )}
          />
        ) : (
          <span
            className={cn(
              "absolute inset-0 truncate text-sm leading-5 select-none",
              isHidden && "opacity-40",
            )}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
              setEditName(name);
            }}
          >
            {name}
          </span>
        )}
      </div>
    </button>
  );
}

/**
 * Recursive tree node renderer for the cell hierarchy.
 */
export function CellTreeNode({
  node,
  depth,
  isDark,
  activeCell,
  focusedCellName,
  editingCellName,
  expandedCells,
  hiddenCells,
  onSelect,
  onRename,
  onToggleExpand,
}: {
  node: CellNode;
  depth: number;
  isDark: boolean;
  activeCell: string | null;
  focusedCellName: string | null;
  editingCellName: string | null;
  expandedCells: Set<string>;
  hiddenCells: Set<string>;
  onSelect: (name: string) => void;
  onRename: (oldName: string, newName: string) => void;
  onToggleExpand: (name: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedCells.has(node.name);

  // A cell can be dragged to create an instance if it's not the active cell.
  // You can't instance a cell inside itself.
  const canDrag = node.name !== activeCell;

  return (
    <>
      <CellRow
        name={node.name}
        isActive={node.name === activeCell}
        isFocused={node.name === focusedCellName}
        isDark={isDark}
        depth={depth}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        isHidden={hiddenCells.has(node.name)}
        onToggleExpand={() => onToggleExpand(node.name)}
        onSelect={() => onSelect(node.name)}
        onRename={(newName) => onRename(node.name, newName)}
        startEditing={editingCellName === node.name}
        canDrag={canDrag}
      />
      {hasChildren &&
        isExpanded &&
        node.children.map((child) => (
          <CellTreeNode
            key={`${node.name}/${child.name}`}
            node={child}
            depth={depth + 1}
            isDark={isDark}
            activeCell={activeCell}
            focusedCellName={focusedCellName}
            editingCellName={editingCellName}
            expandedCells={expandedCells}
            hiddenCells={hiddenCells}
            onSelect={onSelect}
            onRename={onRename}
            onToggleExpand={onToggleExpand}
          />
        ))}
    </>
  );
}

// =============================================================================
// Tab List (vertical, matches Explorer design language)
// =============================================================================
