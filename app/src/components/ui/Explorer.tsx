import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavArrowLeft, NavArrowRight, Menu } from "iconoir-react";
import { useExplorerStore } from "@/stores/explorer";
import type { CellNode } from "@/stores/explorer";
import { useContextMenuStore } from "@/stores/context-menu";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import { useUIStore } from "@/stores/ui";
import { useSelectionStore } from "@/stores/selection";
import { useClipboardStore } from "@/stores/clipboard";
import { useViewportStore, type WorldBounds } from "@/stores/viewport";
import { useRulerStore } from "@/stores/ruler";
import { useCellDragStore } from "@/stores/cell-drag";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useResize } from "@/hooks/use-resize";
import {
  RenameCellCommand,
  PasteElementsCommand,
  DuplicateElementsCommand,
  DeleteElementsCommand,
  DeleteRulersCommand,
  snapshotElements,
} from "@/lib/commands";
import { ZOOM_IN_FACTOR, ZOOM_OUT_FACTOR } from "@/lib/constants";
import { isTauri } from "@/lib/tauri";
import { cn, keys, centerViewOnSelection, getEffectiveViewport } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

// =============================================================================
// Types (shared by HamburgerMenu)
// =============================================================================

interface Shortcut {
  modifiers?: string[];
  key: string;
}

interface SubMenuItem {
  id: string;
  label: string;
  shortcut?: Shortcut;
  action: () => void;
  disabled: boolean;
}

interface SubMenuSeparator {
  id: string;
  separator: true;
}

type SubMenuEntry = SubMenuItem | SubMenuSeparator;

function isSubSeparator(entry: SubMenuEntry): entry is SubMenuSeparator {
  return "separator" in entry && entry.separator;
}

interface TopLevelMenu {
  id: string;
  label: string;
  buildItems: () => SubMenuEntry[];
}

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Chevron icon for tree expand/collapse.
 */
function ChevronIcon({ expanded, isDark }: { expanded: boolean; isDark: boolean }) {
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
 * Renders a flyout submenu panel with items, separators, and keyboard shortcuts.
 */
function FlyoutSubmenu({
  items,
  isDark,
  onAction,
}: {
  items: SubMenuEntry[];
  isDark: boolean;
  onAction: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [openLeft, setOpenLeft] = useState(false);

  // Detect if flyout would overflow viewport right edge (useLayoutEffect to avoid flash)
  useLayoutEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth - 8) {
        setOpenLeft(true);
      }
    }
  }, []);

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute -top-1 z-50 ml-1 min-w-[170px] rounded-xl border py-1",
        openLeft ? "right-full mr-1" : "left-full",
        isDark
          ? "border-white/10 bg-[rgb(29,29,29)] text-white/90"
          : "border-black/10 bg-[rgb(241,241,241)] text-black/90",
      )}
    >
      {items.map((entry) => {
        if (isSubSeparator(entry)) {
          return (
            <div
              key={entry.id}
              className={cn("my-1 h-px", isDark ? "bg-white/10" : "bg-black/10")}
            />
          );
        }
        return (
          <button
            key={entry.id}
            className={cn(
              "mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
              entry.disabled
                ? "opacity-40"
                : isDark
                  ? "hover:bg-[rgb(54,54,54)]"
                  : "hover:bg-[rgb(217,217,217)]",
            )}
            disabled={entry.disabled}
            onClick={() => {
              if (!entry.disabled) {
                // Some actions are async (File menu); catch unhandled rejections.
                Promise.resolve(entry.action()).catch((err) =>
                  console.error("Menu action failed:", err),
                );
                onAction();
              }
            }}
          >
            <span>{entry.label}</span>
            {entry.shortcut && (
              <span className="flex gap-0.5">
                {entry.shortcut.modifiers?.map((modifier) => (
                  <kbd
                    key={modifier}
                    className={cn(
                      "inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]",
                      isDark ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10",
                    )}
                  >
                    {modifier}
                  </kbd>
                ))}
                <kbd
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]",
                    isDark ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10",
                  )}
                >
                  {entry.shortcut.key}
                </kbd>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Hamburger dropdown menu for the Explorer panel header.
 *
 * Provides File, Edit, View, and Preferences submenus with flyout panels.
 * Edit and View mirror keyboard-shortcut actions; Preferences controls theme.
 */
function HamburgerMenu({ isDark }: { isDark: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useKeyboardFocus("explorer-menu", isOpen);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveSubmenu(null);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // Build top-level menus with their submenu item builders
  const menus: TopLevelMenu[] = [
    {
      id: "file",
      label: "File",
      buildItems: () => [
        {
          id: "file-open",
          label: "Open...",
          shortcut: { modifiers: [keys.mod], key: "O" },
          action: async () => {
            const { pickGdsFile } = await import("@/lib/tauri");
            const { emitOpenFile } = await import("@/lib/file-ops");
            const path = await pickGdsFile();
            if (path) {
              await emitOpenFile(path);
            }
          },
          disabled: !isTauri,
        },
        {
          id: "file-save",
          label: "Save",
          shortcut: { modifiers: [keys.mod], key: "S" },
          action: async () => {
            const { handleSave } = await import("@/lib/file-ops");
            await handleSave(false);
          },
          disabled: !isTauri,
        },
        {
          id: "file-save-as",
          label: "Save As...",
          shortcut: { modifiers: [keys.mod, keys.shift], key: "S" },
          action: async () => {
            const { handleSave } = await import("@/lib/file-ops");
            await handleSave(true);
          },
          disabled: !isTauri,
        },
        { id: "sep-file-1", separator: true as const },
        {
          id: "file-screenshot",
          label: "Export Screenshot",
          action: async () => {
            const { handleScreenshot } = await import("@/lib/file-ops");
            await handleScreenshot();
          },
          disabled: false,
        },
        {
          id: "file-screenshot-clipboard",
          label: "Copy Screenshot",
          action: async () => {
            const { handleScreenshotToClipboard } = await import("@/lib/file-ops");
            await handleScreenshotToClipboard();
          },
          disabled: false,
        },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      buildItems: () => {
        const { library, renderer } = useWasmContextStore.getState();
        const { canUndo, canRedo } = useHistoryStore.getState();
        const { selectedIds } = useSelectionStore.getState();
        const { hasContent: hasClipboardContent } = useClipboardStore.getState();
        const { selectedRulerIds } = useRulerStore.getState();
        const hasSelection = selectedIds.size > 0;
        const hasRulerSelection = selectedRulerIds.size > 0;
        const hasElements = library ? library.get_all_ids().length > 0 : false;

        return [
          {
            id: "undo",
            label: "Undo",
            shortcut: { modifiers: [keys.mod], key: "Z" },
            action: () => {
              if (library && renderer) {
                useHistoryStore.getState().undo({ library, renderer });
              }
            },
            disabled: !canUndo,
          },
          {
            id: "redo",
            label: "Redo",
            shortcut: { modifiers: [keys.mod, keys.shift], key: "Z" },
            action: () => {
              if (library && renderer) {
                useHistoryStore.getState().redo({ library, renderer });
              }
            },
            disabled: !canRedo,
          },
          { id: "sep-edit-1", separator: true as const },
          {
            id: "copy",
            label: "Copy",
            shortcut: { modifiers: [keys.mod], key: "C" },
            action: () => {
              if (!library) return;
              const ids = useSelectionStore.getState().selectedIds;
              const snapshots = snapshotElements(library, ids);
              useClipboardStore.getState().copy(snapshots);
            },
            disabled: !hasSelection,
          },
          {
            id: "paste",
            label: "Paste",
            shortcut: { modifiers: [keys.mod], key: "V" },
            action: () => {
              if (!library || !renderer) return;
              const command = new PasteElementsCommand();
              useHistoryStore.getState().execute(command, { library, renderer });
              const canvas = document.querySelector("canvas");
              if (canvas) centerViewOnSelection(library, canvas);
            },
            disabled: !hasClipboardContent,
          },
          {
            id: "duplicate",
            label: "Duplicate",
            shortcut: { modifiers: [keys.mod], key: "B" },
            action: () => {
              if (!library || !renderer) return;
              const ids = useSelectionStore.getState().selectedIds;
              if (ids.size === 0) return;
              const command = new DuplicateElementsCommand([...ids]);
              useHistoryStore.getState().execute(command, { library, renderer });
              const canvas = document.querySelector("canvas");
              if (canvas) centerViewOnSelection(library, canvas);
            },
            disabled: !hasSelection,
          },
          { id: "sep-edit-2", separator: true as const },
          {
            id: "delete",
            label: "Delete",
            shortcut: { key: keys.backspace },
            action: () => {
              if (!library || !renderer) return;
              // Delete rulers first (matches keyboard shortcut behavior)
              const rulerIds = useRulerStore.getState().selectedRulerIds;
              if (rulerIds.size > 0) {
                const cmd = new DeleteRulersCommand([...rulerIds]);
                useHistoryStore.getState().execute(cmd, { library, renderer });
                return;
              }
              // Then delete selected elements
              const ids = useSelectionStore.getState().selectedIds;
              if (ids.size === 0) return;
              const command = new DeleteElementsCommand([...ids]);
              useHistoryStore.getState().execute(command, { library, renderer });
            },
            disabled: !hasSelection && !hasRulerSelection,
          },
          { id: "sep-edit-3", separator: true as const },
          {
            id: "selectAll",
            label: "Select All",
            shortcut: { modifiers: [keys.mod], key: "A" },
            action: () => {
              if (!library) return;
              const allIds = library.get_all_ids();
              useSelectionStore.getState().selectAll(allIds);
            },
            disabled: !hasElements,
          },
        ];
      },
    },
    {
      id: "view",
      label: "View",
      buildItems: () => {
        const { library } = useWasmContextStore.getState();
        const { selectedIds } = useSelectionStore.getState();
        const hasSelection = selectedIds.size > 0;

        return [
          {
            id: "zoomIn",
            label: "Zoom In",
            shortcut: { key: "+" },
            action: () => {
              const canvas = document.querySelector("canvas");
              if (!canvas) return;
              const rect = canvas.getBoundingClientRect();
              useViewportStore.getState().zoomAt(ZOOM_IN_FACTOR, rect.width / 2, rect.height / 2);
            },
            disabled: false,
          },
          {
            id: "zoomOut",
            label: "Zoom Out",
            shortcut: { key: "-" },
            action: () => {
              const canvas = document.querySelector("canvas");
              if (!canvas) return;
              const rect = canvas.getBoundingClientRect();
              useViewportStore.getState().zoomAt(ZOOM_OUT_FACTOR, rect.width / 2, rect.height / 2);
            },
            disabled: false,
          },
          { id: "sep-view-1", separator: true as const },
          {
            id: "fitAll",
            label: "Fit All",
            shortcut: { key: "F" },
            action: () => {
              const canvas = document.querySelector("canvas");
              if (!canvas || !library) return;
              const boundsArray = library.get_all_bounds();
              const bounds: WorldBounds | null = boundsArray
                ? {
                    minX: boundsArray[0],
                    minY: boundsArray[1],
                    maxX: boundsArray[2],
                    maxY: boundsArray[3],
                  }
                : null;
              const vp = getEffectiveViewport(canvas);
              useViewportStore.getState().zoomToFit(bounds, vp.width, vp.height, vp.screenCenter);
            },
            disabled: false,
          },
          {
            id: "fitSelection",
            label: "Fit Selection",
            shortcut: { modifiers: [keys.shift], key: "F" },
            action: () => {
              const canvas = document.querySelector("canvas");
              if (!canvas || !library) return;
              const ids = useSelectionStore.getState().selectedIds;
              if (ids.size === 0) return;
              const boundsArray = library.get_bounds_for_ids([...ids]);
              const bounds: WorldBounds | null = boundsArray
                ? {
                    minX: boundsArray[0],
                    minY: boundsArray[1],
                    maxX: boundsArray[2],
                    maxY: boundsArray[3],
                  }
                : null;
              const vp = getEffectiveViewport(canvas);
              useViewportStore
                .getState()
                .zoomToSelected(bounds, vp.width, vp.height, vp.screenCenter);
            },
            disabled: !hasSelection,
          },
        ];
      },
    },
    {
      id: "preferences",
      label: "Preferences",
      buildItems: () => {
        const { themeSetting, showGrid } = useUIStore.getState();
        return [
          {
            id: "theme-light",
            label: `${themeSetting === "light" ? "\u2713  " : "     "}Light`,
            action: () => useUIStore.getState().setThemeSetting("light"),
            disabled: false,
          },
          {
            id: "theme-dark",
            label: `${themeSetting === "dark" ? "\u2713  " : "     "}Dark`,
            action: () => useUIStore.getState().setThemeSetting("dark"),
            disabled: false,
          },
          {
            id: "theme-system",
            label: `${themeSetting === "system" ? "\u2713  " : "     "}System`,
            action: () => useUIStore.getState().setThemeSetting("system"),
            disabled: false,
          },
          { id: "sep-prefs-1", separator: true as const },
          {
            id: "show-grid",
            label: `${showGrid ? "\u2713  " : "     "}Show Grid`,
            action: () => useUIStore.getState().toggleGrid(),
            disabled: false,
          },
        ];
      },
    },
  ];

  return (
    <div ref={menuRef} className="relative ml-auto flex-shrink-0">
      {/* Hamburger button — matches Sidebar tab button style */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setActiveSubmenu(null);
        }}
        className={cn(
          "cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none",
          isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
          isOpen && (isDark ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]"),
        )}
      >
        <div className="flex h-4 w-4 items-center justify-center">
          <Menu className={cn("h-4 w-4", isDark ? "text-white/60" : "text-black/60")} />
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full right-0 z-50 mt-1 min-w-[140px] rounded-xl border py-1",
            isDark
              ? "border-white/10 bg-[rgb(29,29,29)] text-white/90"
              : "border-black/10 bg-[rgb(241,241,241)] text-black/90",
          )}
        >
          {menus.map((menu) => (
            <div key={menu.id} className="relative">
              <button
                type="button"
                className={cn(
                  "mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                  isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
                  activeSubmenu === menu.id &&
                    (isDark ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]"),
                )}
                onMouseEnter={() => setActiveSubmenu(menu.id)}
                onClick={() => setActiveSubmenu(activeSubmenu === menu.id ? null : menu.id)}
              >
                <span>{menu.label}</span>
                <svg width="12" height="12" viewBox="0 0 16 16" className="flex-shrink-0">
                  <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>

              {/* Flyout submenu */}
              {activeSubmenu === menu.id && (
                <FlyoutSubmenu items={menu.buildItems()} isDark={isDark} onAction={close} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Single cell row in the explorer panel.
 *
 * Supports right-click context menu and inline rename editing
 * (triggered externally via the explorer store's `editingCellName`).
 */
function CellRow({
  name,
  isActive,
  isDark,
  depth,
  hasChildren,
  isExpanded,
  onToggleExpand,
  onSelect,
  onRename,
  startEditing,
  canDrag,
}: {
  name: string;
  isActive: boolean;
  isDark: boolean;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
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
      type="button"
      className={cn(
        "mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center rounded-lg py-1.5 text-left transition-colors focus:outline-none",
        isActive
          ? isDark
            ? "bg-[rgb(54,54,54)] text-white/90"
            : "bg-[rgb(217,217,217)] text-black/90"
          : isDark
            ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90"
            : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90",
      )}
      style={{ paddingLeft: `${7 + depth * 10}px`, paddingRight: "7px" }}
      onClick={onSelect}
      onContextMenu={handleContextMenu}
      onMouseDown={handleCellMouseDown}
      tabIndex={-1}
    >
      {/* Expand/collapse chevron (or spacer for leaves) */}
      {hasChildren ? (
        <span
          className="mr-0.5 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center"
          onClick={handleChevronClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onToggleExpand();
            }
          }}
        >
          <ChevronIcon expanded={isExpanded} isDark={isDark} />
        </span>
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
            className="absolute inset-0 truncate text-sm leading-5 select-none"
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
function CellTreeNode({
  node,
  depth,
  isDark,
  activeCell,
  editingCellName,
  expandedCells,
  onSelect,
  onRename,
  onToggleExpand,
}: {
  node: CellNode;
  depth: number;
  isDark: boolean;
  activeCell: string | null;
  editingCellName: string | null;
  expandedCells: Set<string>;
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
        isDark={isDark}
        depth={depth}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
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
            editingCellName={editingCellName}
            expandedCells={expandedCells}
            onSelect={onSelect}
            onRename={onRename}
            onToggleExpand={onToggleExpand}
          />
        ))}
    </>
  );
}

// =============================================================================
// Collapsed Explorer (icon rail)
// =============================================================================

/**
 * Collapsed explorer — narrow icon rail with app icon and expand button.
 */
function CollapsedExplorer({ isDark, onExpand }: { isDark: boolean; onExpand: () => void }) {
  return (
    <div
      className={cn(
        "fixed top-4 left-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border pt-[4.5px] pb-[5px]",
        isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
      )}
    >
      {/* App icon */}
      <div className="p-1">
        <img
          src="/icon.svg"
          alt=""
          draggable={false}
          className={cn("h-5 w-5 select-none pointer-events-none rounded border", isDark ? "border-white/40" : "border-black/40")}
        />
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

        {/* Cell tree / list */}
        <div
          className="flex flex-col gap-0.5 overflow-y-auto py-1"
          style={{ maxHeight: "calc(100vh - 176px)" }}
          onWheel={(e) => e.stopPropagation()}
        >
          {cellTree
            ? /* Hierarchical tree view */
              cellTree.map((root) => (
                <CellTreeNode
                  key={root.name}
                  node={root}
                  depth={0}
                  isDark={isDark}
                  activeCell={activeCell}
                  editingCellName={editingCellName}
                  expandedCells={expandedCells}
                  onSelect={handleSelectCell}
                  onRename={handleRenameCell}
                  onToggleExpand={toggleExpanded}
                />
              ))
            : /* Standalone mode: flat list */
              cells.map((name) => (
                <CellRow
                  key={name}
                  name={name}
                  isActive={name === activeCell}
                  isDark={isDark}
                  depth={0}
                  hasChildren={false}
                  isExpanded={false}
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
