import { useEffect, useLayoutEffect, useRef, useState, useCallback, type RefObject } from "react";
import { useContextMenuStore } from "@/stores/context-menu";
import { useSelectionStore } from "@/stores/selection";
import { useClipboardStore } from "@/stores/clipboard";
import { useHistoryStore } from "@/stores/history";
import { useUIStore } from "@/stores/ui";
import { useRulerStore } from "@/stores/ruler";
import { useLayerStore } from "@/stores/layer";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { cn, keys, centerViewOnSelection } from "@/lib/utils";
import {
  DeleteElementsCommand,
  DeleteRulersCommand,
  RemoveImageCommand,
  PasteElementsCommand,
  DuplicateElementsCommand,
  AddLayerCommand,
  DeleteLayerCommand,
  AddCellCommand,
  DeleteCellCommand,
  snapshotElements,
} from "@/lib/commands";
import { isImageId, imageIdToKey } from "@/stores/image";
import { useExplorerStore, generateUniqueCellName } from "@/stores/explorer";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";

/**
 * Keyboard shortcut definition for menu items.
 */
interface Shortcut {
  modifiers?: string[];
  key: string;
}

/**
 * Menu item definition.
 */
interface MenuItem {
  id: string;
  label: string;
  shortcut?: Shortcut;
  action: () => void;
  disabled: boolean;
}

/**
 * Separator between menu item groups.
 */
interface MenuSeparator {
  id: string;
  separator: true;
}

type MenuEntry = MenuItem | MenuSeparator;

function isSeparator(entry: MenuEntry): entry is MenuSeparator {
  return "separator" in entry && entry.separator;
}

interface ContextMenuProps {
  library: WasmLibrary | null;
  renderer: WasmRenderer | null;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

/**
 * Context menu component for right-click actions.
 *
 * Shows different menu items based on whether the user right-clicked
 * on empty canvas space or on an element.
 *
 * Features:
 * - Platform-aware keyboard shortcuts (⌘ on Mac, Ctrl on Windows)
 * - Disabled items when actions aren't available
 * - Click outside or Escape to close
 * - Viewport boundary clamping
 */
export function ContextMenu({ library, renderer, canvasRef }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const { isOpen, position, variant, targetId, close } = useContextMenuStore();
  const { selectedIds } = useSelectionStore();
  const { hasContent: hasClipboardContent } = useClipboardStore();
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  // Claim keyboard focus to disable canvas shortcuts while menu is open
  useKeyboardFocus("context-menu", isOpen);

  // Check if there are any elements in the library
  const hasElements = library ? library.get_all_ids().length > 0 : false;
  const hasSelection = selectedIds.size > 0;

  // Build menu items based on variant
  const buildMenuItems = useCallback((): MenuEntry[] => {
    const copy = (): void => {
      if (!library) return;
      const snapshots = snapshotElements(library, selectedIds);
      useClipboardStore.getState().copy(snapshots);
      close();
    };

    const paste = (): void => {
      if (!library || !renderer) return;
      const command = new PasteElementsCommand();
      useHistoryStore.getState().execute(command, { library, renderer });
      const canvas = canvasRef.current;
      if (canvas) centerViewOnSelection(library, canvas);
      close();
    };

    const duplicate = (): void => {
      if (!library || !renderer || selectedIds.size === 0) return;
      const command = new DuplicateElementsCommand([...selectedIds]);
      useHistoryStore.getState().execute(command, { library, renderer });
      const canvas = canvasRef.current;
      if (canvas) centerViewOnSelection(library, canvas);
      close();
    };

    const deleteSelected = (): void => {
      if (!library || !renderer || selectedIds.size === 0) return;
      const command = new DeleteElementsCommand([...selectedIds]);
      useHistoryStore.getState().execute(command, { library, renderer });
      close();
    };

    const selectAll = (): void => {
      if (!library) return;
      const allIds = library.get_all_ids();
      useSelectionStore.getState().selectAll(allIds);
      close();
    };

    if (variant === "element") {
      const editElement = (): void => {
        useUIStore.getState().requestInspectorFocus();
        close();
      };

      // Element context menu: Edit, ---, Copy, Paste, Duplicate, ---, Delete, ---, Select All
      return [
        {
          id: "edit",
          label: "Edit",
          shortcut: { key: "E" },
          action: editElement,
          disabled: !hasSelection,
        },
        { id: "sep0", separator: true },
        {
          id: "copy",
          label: "Copy",
          shortcut: { modifiers: [keys.mod], key: "C" },
          action: copy,
          disabled: !hasSelection,
        },
        {
          id: "paste",
          label: "Paste",
          shortcut: { modifiers: [keys.mod], key: "V" },
          action: paste,
          disabled: !hasClipboardContent,
        },
        {
          id: "duplicate",
          label: "Duplicate",
          shortcut: { modifiers: [keys.mod], key: "B" },
          action: duplicate,
          disabled: !hasSelection,
        },
        { id: "sep1", separator: true },
        {
          id: "delete",
          label: "Delete",
          shortcut: { key: keys.backspace },
          action: deleteSelected,
          disabled: !hasSelection,
        },
        { id: "sep2", separator: true },
        {
          id: "selectAll",
          label: "Select All",
          shortcut: { modifiers: [keys.mod], key: "A" },
          action: selectAll,
          disabled: !hasElements,
        },
      ];
    }

    if (variant === "ruler") {
      // Ruler context menu: Paste, Delete, Select All
      const deleteRulers = (): void => {
        if (!library || !renderer) return;
        const { selectedRulerIds } = useRulerStore.getState();
        if (selectedRulerIds.size > 0) {
          const command = new DeleteRulersCommand([...selectedRulerIds]);
          useHistoryStore.getState().execute(command, { library, renderer });
        }
        close();
      };

      return [
        {
          id: "paste",
          label: "Paste",
          shortcut: { modifiers: [keys.mod], key: "V" },
          action: paste,
          disabled: !hasClipboardContent,
        },
        { id: "sep1", separator: true },
        {
          id: "delete",
          label: "Delete",
          shortcut: { key: keys.backspace },
          action: deleteRulers,
          disabled: false,
        },
        { id: "sep2", separator: true },
        {
          id: "selectAll",
          label: "Select All",
          shortcut: { modifiers: [keys.mod], key: "A" },
          action: selectAll,
          disabled: true,
        },
      ];
    }

    if (variant === "image") {
      // Image context menu: Edit, Delete
      const editImage = (): void => {
        useUIStore.getState().requestInspectorFocus();
        close();
      };

      const deleteImage = (): void => {
        if (!library || !renderer) return;
        const imageKeys = [...selectedIds].filter(isImageId).map(imageIdToKey);
        if (imageKeys.length > 0) {
          const cmd = new RemoveImageCommand(imageKeys);
          useHistoryStore.getState().execute(cmd, { library, renderer });
        }
        close();
      };

      return [
        {
          id: "edit",
          label: "Edit",
          shortcut: { key: "E" },
          action: editImage,
          disabled: false,
        },
        { id: "sep0", separator: true },
        {
          id: "delete",
          label: "Delete",
          shortcut: { key: keys.backspace },
          action: deleteImage,
          disabled: false,
        },
      ];
    }

    if (variant === "layer") {
      // Layer context menu: Add Layer, Rename, Toggle Visibility, ---, Delete
      const layerId = targetId ? Number(targetId) : null;
      const layerStore = useLayerStore.getState();
      const targetLayer = layerId !== null ? layerStore.getLayer(layerId) : undefined;
      const isLastLayer = layerStore.layers.size <= 1;

      const addLayer = (): void => {
        if (!library || !renderer) return;
        const command = new AddLayerCommand();
        useHistoryStore.getState().execute(command, { library, renderer });
        close();
      };

      const renameLayer = (): void => {
        if (layerId !== null) {
          useLayerStore.getState().setEditingLayerId(layerId);
        }
        close();
      };

      const toggleLayerVisibility = (): void => {
        if (layerId !== null) {
          useLayerStore.getState().toggleVisibility(layerId);
        }
        close();
      };

      const deleteLayer = (): void => {
        if (!library || !renderer || layerId === null) return;
        const command = new DeleteLayerCommand(layerId);
        useHistoryStore.getState().execute(command, { library, renderer });
        close();
      };

      const allLayers = Array.from(layerStore.layers.values());
      const allVisible = allLayers.every((l) => l.visible);
      const allHidden = allLayers.every((l) => !l.visible);

      const showAll = (): void => {
        useLayerStore.getState().showAllLayers();
        close();
      };

      const hideAll = (): void => {
        useLayerStore.getState().hideAllLayers();
        close();
      };

      const editLayer = (): void => {
        if (layerId !== null) {
          // Expand the layer editor and switch to layers tab
          useLayerStore.getState().setExpandedLayerId(layerId);
          useLayerStore.getState().setActiveLayer(layerId);
          useUIStore.getState().setSidebarTab("layers");
        }
        close();
      };

      return [
        {
          id: "editLayer",
          label: "Edit Layer",
          action: editLayer,
          disabled: !targetLayer,
        },
        {
          id: "addLayer",
          label: "Add Layer",
          action: addLayer,
          disabled: false,
        },
        {
          id: "rename",
          label: "Rename Layer",
          action: renameLayer,
          disabled: !targetLayer,
        },
        {
          id: "toggleVisibility",
          label: targetLayer?.visible ? "Hide Layer" : "Show Layer",
          action: toggleLayerVisibility,
          disabled: !targetLayer,
        },
        { id: "sep1", separator: true },
        {
          id: "showAll",
          label: "Show All Layers",
          action: showAll,
          disabled: allVisible,
        },
        {
          id: "hideAll",
          label: "Hide All Layers",
          action: hideAll,
          disabled: allHidden,
        },
        { id: "sep2", separator: true },
        {
          id: "delete",
          label: "Delete Layer",
          action: deleteLayer,
          disabled: !targetLayer || isLastLayer,
        },
      ];
    }

    if (variant === "cell") {
      // Cell context menu: Add Cell, Rename, ---, Delete
      const targetCellName = targetId;
      const explorerStore = useExplorerStore.getState();
      const isLastCell = explorerStore.cells.length <= 1;

      // Always create a standalone root-level cell (consistent with the "c"
      // keyboard shortcut). Creating hierarchy is a separate operation via
      // drag-and-drop or "Add Instance".
      const addCell = (): void => {
        if (!library || !renderer) return;
        const name = generateUniqueCellName();
        const command = new AddCellCommand(name);
        useHistoryStore.getState().execute(command, { library, renderer });
        if (useUIStore.getState().explorerCollapsed) {
          useUIStore.getState().toggleExplorerCollapsed();
        }
        useExplorerStore.getState().setActiveCell(name);
        useExplorerStore.getState().setEditingCellName(name);
        close();
      };

      const renameCell = (): void => {
        if (targetCellName) {
          useExplorerStore.getState().setEditingCellName(targetCellName);
        }
        close();
      };

      const deleteCell = (): void => {
        if (!library || !renderer || !targetCellName) return;
        const command = new DeleteCellCommand(targetCellName);
        useHistoryStore.getState().execute(command, { library, renderer });
        close();
      };

      const isCellHidden = targetCellName ? explorerStore.hiddenCells.has(targetCellName) : false;

      const toggleCellVisibility = (): void => {
        if (targetCellName) {
          useExplorerStore.getState().toggleCellVisibility(targetCellName);
        }
        close();
      };

      const allCells = explorerStore.cells;
      const allCellsVisible = allCells.every((c) => !explorerStore.hiddenCells.has(c));
      const allCellsHidden = allCells.every((c) => explorerStore.hiddenCells.has(c));

      const showAllCells = (): void => {
        useExplorerStore.getState().showAllCells();
        close();
      };

      const hideAllCells = (): void => {
        useExplorerStore.getState().hideAllCells();
        close();
      };

      return [
        {
          id: "addCell",
          label: "Add Cell",
          action: addCell,
          disabled: !targetCellName,
        },
        {
          id: "rename",
          label: "Rename Cell",
          action: renameCell,
          disabled: !targetCellName,
        },
        {
          id: "toggleVisibility",
          label: isCellHidden ? "Show Cell" : "Hide Cell",
          action: toggleCellVisibility,
          disabled: !targetCellName,
        },
        { id: "sep1", separator: true },
        {
          id: "showAllCells",
          label: "Show All Cells",
          action: showAllCells,
          disabled: allCellsVisible,
        },
        {
          id: "hideAllCells",
          label: "Hide All Cells",
          action: hideAllCells,
          disabled: allCellsHidden,
        },
        { id: "sep2", separator: true },
        {
          id: "delete",
          label: "Delete Cell",
          action: deleteCell,
          disabled: !targetCellName || isLastCell,
        },
      ];
    }

    // Canvas context menu: Paste, ---, Select All
    return [
      {
        id: "paste",
        label: "Paste",
        shortcut: { modifiers: [keys.mod], key: "V" },
        action: paste,
        disabled: !hasClipboardContent,
      },
      { id: "sep1", separator: true },
      {
        id: "selectAll",
        label: "Select All",
        shortcut: { modifiers: [keys.mod], key: "A" },
        action: selectAll,
        disabled: !hasElements,
      },
    ];
  }, [
    variant,
    library,
    renderer,
    selectedIds,
    hasSelection,
    hasClipboardContent,
    hasElements,
    close,
    canvasRef,
    targetId,
  ]);

  const menuItems = buildMenuItems();

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };

    // Use mousedown to close before click handlers fire
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Track clamped position after menu is measured
  const [clampedPos, setClampedPos] = useState(position);

  // Clamp position to viewport bounds after DOM is ready
  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) {
      setClampedPos(position);
      return;
    }

    const menu = menuRef.current;
    const menuRect = menu.getBoundingClientRect();
    const padding = 8;

    let { x, y } = position;

    // Clamp to right edge
    if (x + menuRect.width + padding > window.innerWidth) {
      x = window.innerWidth - menuRect.width - padding;
    }

    // Clamp to bottom edge
    if (y + menuRect.height + padding > window.innerHeight) {
      y = window.innerHeight - menuRect.height - padding;
    }

    // Clamp to left edge
    if (x < padding) {
      x = padding;
    }

    // Clamp to top edge
    if (y < padding) {
      y = padding;
    }

    setClampedPos({ x, y });
  }, [isOpen, position]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-50 min-w-[170px] rounded-xl border py-1",
        isDark
          ? "border-white/10 bg-[rgb(29,29,29)] text-white/90"
          : "border-black/10 bg-[rgb(241,241,241)] text-black/90",
      )}
      style={{
        left: clampedPos.x,
        top: clampedPos.y,
      }}
    >
      {menuItems.map((entry) => {
        if (isSeparator(entry)) {
          return (
            <div
              key={entry.id}
              className={cn("my-1 h-px", isDark ? "bg-white/10" : "bg-black/10")}
            />
          );
        }

        const item = entry;
        return (
          <button
            key={item.id}
            className={cn(
              "mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs",
              "transition-colors",
              item.disabled
                ? "opacity-40"
                : isDark
                  ? "hover:bg-[rgb(54,54,54)]"
                  : "hover:bg-[rgb(217,217,217)]",
            )}
            onClick={() => {
              if (!item.disabled) {
                item.action();
              }
            }}
            disabled={item.disabled}
          >
            <span>{item.label}</span>
            {item.shortcut && (
              <span className="flex gap-0.5">
                {item.shortcut.modifiers?.map((modifier) => (
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
                  {item.shortcut.key}
                </kbd>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
