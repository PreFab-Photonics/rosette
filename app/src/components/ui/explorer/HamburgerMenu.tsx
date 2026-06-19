import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Menu } from "iconoir-react";
import { useHistoryStore } from "@/stores/history";
import { useUIStore } from "@/stores/ui";
import { useSelectionStore } from "@/stores/selection";
import { useClipboardStore } from "@/stores/clipboard";
import { useViewportStore, type WorldBounds } from "@/stores/viewport";
import { useRulerStore } from "@/stores/ruler";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import {
  DeleteElementsCommand,
  DeleteRulersCommand,
  PasteElementsCommand,
  DuplicateElementsCommand,
  snapshotElements,
} from "@/lib/commands";
import { ZOOM_IN_FACTOR, ZOOM_OUT_FACTOR } from "@/lib/constants";
import { isTauri } from "@/lib/tauri";
import { handleNewFile } from "@/lib/file-ops";
import {
  cn,
  keys,
  centerViewOnSelection,
  getAllImageIds,
  getEffectiveViewport,
  zoomToFitAll,
} from "@/lib/utils";
import { useArrayDialogStore } from "@/stores/array-dialog";
import { useGoToDialogStore } from "@/stores/goto-dialog";

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
  /** When true, clicking this item does not close the menu (useful for toggles). */
  keepOpen?: boolean;
}

interface SubMenuSeparator {
  id: string;
  separator: true;
}

type SubMenuEntry = SubMenuItem | SubMenuSeparator;

export function isSubSeparator(entry: SubMenuEntry): entry is SubMenuSeparator {
  return "separator" in entry && entry.separator;
}

interface TopLevelMenu {
  id: string;
  label: string;
  buildItems: () => SubMenuEntry[];
}

/**
 * Renders a flyout submenu panel with items, separators, and keyboard shortcuts.
 */
export function FlyoutSubmenu({
  buildItems,
  isDark,
  onAction,
}: {
  buildItems: () => SubMenuEntry[];
  isDark: boolean;
  onAction: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [openLeft, setOpenLeft] = useState(false);
  // Counter to force re-render after keepOpen actions so checkmarks update.
  const [, setTick] = useState(0);
  const items = buildItems();

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
                if (entry.keepOpen) {
                  // Re-render to update checkmarks without closing the menu.
                  setTick((t) => t + 1);
                } else {
                  onAction();
                }
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
export function HamburgerMenu({ isDark }: { isDark: boolean }) {
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
          id: "file-new",
          label: "New",
          shortcut: { modifiers: [keys.mod], key: "N" },
          action: async () => {
            await handleNewFile();
          },
          disabled: false,
        },
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
          {
            id: "create-array",
            label: "Create Array\u2026",
            action: () => {
              const ids = useSelectionStore.getState().selectedIds;
              if (ids.size === 0) return;
              useArrayDialogStore.getState().open([...ids]);
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
              const allIds = [...library.get_all_ids(), ...getAllImageIds()];
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
            keepOpen: true,
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
            keepOpen: true,
          },
          { id: "sep-view-1", separator: true as const },
          {
            id: "fitAll",
            label: "Fit All",
            shortcut: { key: "F" },
            action: () => {
              zoomToFitAll();
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
          { id: "sep-view-2", separator: true as const },
          {
            id: "goToCoordinate",
            label: "Go to Coordinate\u2026",
            action: () => {
              useGoToDialogStore.getState().open();
            },
            disabled: false,
          },
        ];
      },
    },
    {
      id: "preferences",
      label: "Preferences",
      buildItems: () => {
        const { themeSetting, showGrid, rightClickMode } = useUIStore.getState();
        return [
          {
            id: "theme-light",
            label: `${themeSetting === "light" ? "\u2713  " : "     "}Light`,
            action: () => useUIStore.getState().setThemeSetting("light"),
            disabled: false,
            keepOpen: true,
          },
          {
            id: "theme-dark",
            label: `${themeSetting === "dark" ? "\u2713  " : "     "}Dark`,
            action: () => useUIStore.getState().setThemeSetting("dark"),
            disabled: false,
            keepOpen: true,
          },
          {
            id: "theme-system",
            label: `${themeSetting === "system" ? "\u2713  " : "     "}System`,
            action: () => useUIStore.getState().setThemeSetting("system"),
            disabled: false,
            keepOpen: true,
          },
          { id: "sep-prefs-1", separator: true as const },
          {
            id: "show-grid",
            label: `${showGrid ? "\u2713  " : "     "}Show Grid`,
            action: () => useUIStore.getState().toggleGrid(),
            disabled: false,
            keepOpen: true,
          },
          {
            id: "right-click-zoom",
            label: `${rightClickMode === "zoom" ? "\u2713  " : "     "}Right Click Zoom`,
            action: () => useUIStore.getState().toggleRightClickMode(),
            disabled: false,
            keepOpen: true,
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
                <FlyoutSubmenu buildItems={menu.buildItems} isDark={isDark} onAction={close} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
