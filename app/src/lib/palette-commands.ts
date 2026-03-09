/**
 * Command palette command definitions.
 *
 * Commands are organized by type and registered here for the command palette.
 * This file is the single source of truth for available commands.
 */

import { useUIStore } from "@/stores/ui";
import { useCommandPaletteStore } from "@/stores/command-palette";
import { useToolStore } from "@/stores/tool";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useSelectionStore } from "@/stores/selection";
import { useClipboardStore } from "@/stores/clipboard";
import { useHistoryStore } from "@/stores/history";
import { useLayerStore } from "@/stores/layer";
import { useMinimapStore } from "@/stores/minimap";
import { useViewportStore, type WorldBounds } from "@/stores/viewport";
import { ZOOM_IN_FACTOR, ZOOM_OUT_FACTOR } from "@/lib/constants";
import {
  PasteElementsCommand,
  DuplicateElementsCommand,
  DeleteElementsCommand,
  AddLayerCommand,
  DeleteLayerCommand,
  AddCellCommand,
  AddCellRefCommand,
  DeleteCellCommand,
  AlignElementsCommand,
  BooleanOperationCommand,
  placeRectangleInViewport,
  placePolygonInViewport,
  placeTextInViewport,
  snapshotElements,
} from "@/lib/commands";
import type { AlignType } from "@/lib/align";
import type { BooleanOpType } from "@/lib/commands";
import { useExplorerStore } from "@/stores/explorer";
import { keys } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

/** Command category types. */
export type CommandType = "command" | "tool" | "layer" | "cell";

/** Keyboard shortcut definition. */
export interface CommandShortcut {
  /** Modifier keys (e.g., "⌘", "⇧"). */
  modifiers?: string[];
  /** Main key. */
  key: string;
  /** Secondary key for sequences (e.g., "R" then "↵"). */
  then?: string;
}

/** Command item definition. */
export interface CommandItem {
  /** Unique identifier. */
  id: string;
  /** Command category. */
  type: CommandType;
  /** Display name. */
  name: string;
  /** Keyboard shortcut. */
  shortcut?: CommandShortcut;
  /** Action to execute. */
  action: () => void;
  /** Text used for fuzzy search (includes aliases). */
  searchableText: string;
  /** Optional color swatch (hex string, e.g. "#ff69b4"). */
  color?: string;
}

// =============================================================================
// Command Registry
// =============================================================================

/**
 * Get all available commands for the command palette.
 *
 * Commands are defined inline with their actions to keep everything
 * in one place. Actions close the palette after execution.
 */
export function getCommands(): CommandItem[] {
  const { setThemeSetting } = useUIStore.getState();
  const { close } = useCommandPaletteStore.getState();
  const { setTool } = useToolStore.getState();

  const commands: CommandItem[] = [
    // =========================================================================
    // File commands (Tauri only)
    // =========================================================================
    ...(() => {
      if (!("__TAURI__" in window)) return [];

      return [
        {
          id: "file-open",
          type: "command" as CommandType,
          name: "File: Open GDS",
          shortcut: { modifiers: [keys.mod], key: "O" },
          action: async () => {
            close();
            const { pickGdsFile } = await import("@/lib/tauri");
            const path = await pickGdsFile();
            if (path) {
              const { emit } = await import("@tauri-apps/api/event");
              await emit("open-file", path);
            }
          },
          searchableText: "File open gds load import",
        },
        {
          id: "file-save",
          type: "command" as CommandType,
          name: "File: Save",
          shortcut: { modifiers: [keys.mod], key: "S" },
          action: async () => {
            close();
            const { handleSave } = await import("@/App");
            await handleSave(false);
          },
          searchableText: "File save gds export write",
        },
        {
          id: "file-save-as",
          type: "command" as CommandType,
          name: "File: Save As",
          shortcut: { modifiers: [keys.mod, "⇧"], key: "S" },
          action: async () => {
            close();
            const { handleSave } = await import("@/App");
            await handleSave(true);
          },
          searchableText: "File save as gds export write new",
        },
      ] satisfies CommandItem[];
    })(),

    // =========================================================================
    // Theme commands
    // =========================================================================
    {
      id: "theme-dark",
      type: "command",
      name: "Set Theme: Dark",
      action: () => {
        setThemeSetting("dark");
        close();
      },
      searchableText: "Set theme dark mode",
    },
    {
      id: "theme-light",
      type: "command",
      name: "Set Theme: Light",
      action: () => {
        setThemeSetting("light");
        close();
      },
      searchableText: "Set theme light mode",
    },
    {
      id: "theme-system",
      type: "command",
      name: "Set Theme: System",
      action: () => {
        setThemeSetting("system");
        close();
      },
      searchableText: "Set theme system auto automatic",
    },

    // =========================================================================
    // View commands
    // =========================================================================
    {
      id: "view-toggle-minimap",
      type: "command",
      name: "View: Toggle Minimap",
      action: () => {
        useMinimapStore.getState().toggle();
        close();
      },
      searchableText: "Toggle minimap show hide overview map",
    },
    {
      id: "view-toggle-grid",
      type: "command",
      name: "View: Toggle Grid",
      action: () => {
        useUIStore.getState().toggleGrid();
        close();
      },
      searchableText: "Toggle grid show hide dots points",
    },
    {
      id: "view-toggle-zen-mode",
      type: "command",
      name: "View: Toggle Zen Mode",
      action: () => {
        useUIStore.getState().toggleZenMode();
        close();
      },
      searchableText: "Toggle zen mode focus distraction free hide toolbar explorer sidebar panels",
    },
    {
      id: "view-show-layers",
      type: "command",
      name: "View: Show Layers Panel",
      action: () => {
        useUIStore.getState().setSidebarTab("layers");
        close();
      },
      searchableText: "Show layers panel sidebar switch tab",
    },
    {
      id: "view-show-inspector",
      type: "command",
      name: "View: Show Inspector Panel",
      action: () => {
        useUIStore.getState().setSidebarTab("inspector");
        close();
      },
      searchableText: "Show inspector panel sidebar switch tab properties",
    },
    {
      id: "view-zoom-in",
      type: "command",
      name: "View: Zoom In",
      shortcut: { key: "+" },
      action: () => {
        const canvas = document.getElementById("rosette-canvas");
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          useViewportStore.getState().zoomAt(ZOOM_IN_FACTOR, rect.width / 2, rect.height / 2);
        }
        close();
      },
      searchableText: "Zoom in magnify enlarge",
    },
    {
      id: "view-zoom-out",
      type: "command",
      name: "View: Zoom Out",
      shortcut: { key: "-" },
      action: () => {
        const canvas = document.getElementById("rosette-canvas");
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          useViewportStore.getState().zoomAt(ZOOM_OUT_FACTOR, rect.width / 2, rect.height / 2);
        }
        close();
      },
      searchableText: "Zoom out shrink reduce",
    },
    {
      id: "view-zoom-to-fit",
      type: "command",
      name: "View: Zoom to Fit",
      shortcut: { key: "F" },
      action: () => {
        const canvas = document.getElementById("rosette-canvas");
        const { library } = useWasmContextStore.getState();
        if (canvas && library) {
          const boundsArray = library.get_all_bounds();
          const bounds: WorldBounds | null = boundsArray
            ? {
                minX: boundsArray[0],
                minY: boundsArray[1],
                maxX: boundsArray[2],
                maxY: boundsArray[3],
              }
            : null;
          const rect = canvas.getBoundingClientRect();
          useViewportStore.getState().zoomToFit(bounds, rect.width, rect.height);
        }
        close();
      },
      searchableText: "Zoom to fit all objects view",
    },
    {
      id: "view-zoom-to-selection",
      type: "command",
      name: "View: Zoom to Selection",
      shortcut: { modifiers: [keys.shift], key: "F" },
      action: () => {
        const canvas = document.getElementById("rosette-canvas");
        const { library } = useWasmContextStore.getState();
        if (canvas && library) {
          const selectedIds = useSelectionStore.getState().selectedIds;
          if (selectedIds.size > 0) {
            const boundsArray = library.get_bounds_for_ids([...selectedIds]);
            const bounds: WorldBounds | null = boundsArray
              ? {
                  minX: boundsArray[0],
                  minY: boundsArray[1],
                  maxX: boundsArray[2],
                  maxY: boundsArray[3],
                }
              : null;
            const rect = canvas.getBoundingClientRect();
            useViewportStore.getState().zoomToSelected(bounds, rect.width, rect.height);
          }
        }
        close();
      },
      searchableText: "Zoom to fit selection selected elements",
    },

    // =========================================================================
    // Tool commands
    // =========================================================================
    {
      id: "tool-select",
      type: "tool",
      name: "Tool: Select",
      shortcut: { key: "V" },
      action: () => {
        setTool("select");
        close();
      },
      searchableText: "Tool select cursor pointer",
    },
    {
      id: "tool-laser",
      type: "tool",
      name: "Tool: Laser Pointer",
      shortcut: { key: "Q" },
      action: () => {
        setTool("laser");
        close();
      },
      searchableText: "Tool laser pointer",
    },
    {
      id: "tool-pan",
      type: "tool",
      name: "Tool: Pan",
      shortcut: { key: "P" },
      action: () => {
        setTool("pan");
        close();
      },
      searchableText: "Tool pan hand grab",
    },
    {
      id: "tool-move",
      type: "tool",
      name: "Tool: Move",
      shortcut: { key: "M" },
      action: () => {
        setTool("move");
        close();
      },
      searchableText: "Tool move drag",
    },
    {
      id: "tool-zoom",
      type: "tool",
      name: "Tool: Zoom",
      shortcut: { key: "Z" },
      action: () => {
        setTool("zoom");
        close();
      },
      searchableText: "Tool zoom magnify",
    },
    {
      id: "tool-ruler",
      type: "tool",
      name: "Tool: Ruler",
      shortcut: { key: "U" },
      action: () => {
        setTool("ruler");
        close();
      },
      searchableText: "Tool ruler measure distance",
    },
    {
      id: "tool-rectangle",
      type: "tool",
      name: "Tool: Rectangle",
      shortcut: { key: "R" },
      action: () => {
        setTool("rectangle");
        close();
      },
      searchableText: "Tool rectangle shape draw box",
    },
    {
      id: "tool-polygon",
      type: "tool",
      name: "Tool: Polygon",
      shortcut: { key: "G" },
      action: () => {
        setTool("polygon");
        close();
      },
      searchableText: "Tool polygon shape draw",
    },
    {
      id: "tool-text",
      type: "tool",
      name: "Tool: Text",
      shortcut: { key: "T" },
      action: () => {
        setTool("text");
        close();
      },
      searchableText: "Tool text label annotation",
    },

    // =========================================================================
    // Add commands
    // =========================================================================
    {
      id: "add-rectangle",
      type: "command",
      name: "Add: Rectangle",
      shortcut: { key: "R", then: "↵" },
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        const canvas = document.getElementById("rosette-canvas");
        if (library && renderer && canvas) {
          placeRectangleInViewport(library, renderer, canvas);
        }
        close();
      },
      searchableText: "Add rectangle create shape box place",
    },
    {
      id: "add-polygon",
      type: "command",
      name: "Add: Polygon",
      shortcut: { key: "G", then: "↵" },
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        const canvas = document.getElementById("rosette-canvas");
        if (library && renderer && canvas) {
          placePolygonInViewport(library, renderer, canvas);
        }
        close();
      },
      searchableText: "Add polygon create shape triangle place",
    },
    {
      id: "add-text",
      type: "command",
      name: "Add: Text",
      shortcut: { key: "T", then: "↵" },
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        const canvas = document.getElementById("rosette-canvas");
        if (library && renderer && canvas) {
          placeTextInViewport(library, renderer, canvas);
        }
        close();
      },
      searchableText: "Add text create label annotation place",
    },

    // =========================================================================
    // Edit commands
    // =========================================================================
    {
      id: "edit-undo",
      type: "command",
      name: "Edit: Undo",
      shortcut: { modifiers: [keys.mod], key: "Z" },
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        if (library && renderer) {
          const { canUndo, undo } = useHistoryStore.getState();
          if (canUndo) {
            undo({ library, renderer });
          }
        }
        close();
      },
      searchableText: "Undo revert back",
    },
    {
      id: "edit-redo",
      type: "command",
      name: "Edit: Redo",
      shortcut: { modifiers: [keys.mod, keys.shift], key: "Z" },
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        if (library && renderer) {
          const { canRedo, redo } = useHistoryStore.getState();
          if (canRedo) {
            redo({ library, renderer });
          }
        }
        close();
      },
      searchableText: "Redo repeat forward",
    },
    {
      id: "edit-copy",
      type: "command",
      name: "Edit: Copy Selection",
      shortcut: { modifiers: [keys.mod], key: "C" },
      action: () => {
        const { library } = useWasmContextStore.getState();
        const { selectedIds } = useSelectionStore.getState();
        if (!library || selectedIds.size === 0) {
          close();
          return;
        }
        const snapshots = snapshotElements(library, selectedIds);
        useClipboardStore.getState().copy(snapshots);
        close();
      },
      searchableText: "Copy selection clipboard",
    },
    {
      id: "edit-paste",
      type: "command",
      name: "Edit: Paste",
      shortcut: { modifiers: [keys.mod], key: "V" },
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        if (!library || !renderer || !useClipboardStore.getState().hasContent) {
          close();
          return;
        }
        const command = new PasteElementsCommand();
        useHistoryStore.getState().execute(command, { library, renderer });
        close();
      },
      searchableText: "Paste clipboard",
    },
    {
      id: "edit-duplicate",
      type: "command",
      name: "Edit: Duplicate Selection",
      shortcut: { modifiers: [keys.mod], key: "B" },
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        const { selectedIds } = useSelectionStore.getState();
        if (!library || !renderer || selectedIds.size === 0) {
          close();
          return;
        }
        const command = new DuplicateElementsCommand([...selectedIds]);
        useHistoryStore.getState().execute(command, { library, renderer });
        close();
      },
      searchableText: "Duplicate selection clone",
    },
    {
      id: "edit-delete",
      type: "command",
      name: "Edit: Delete Selection",
      shortcut: { key: keys.backspace },
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        const { selectedIds } = useSelectionStore.getState();
        if (!library || !renderer || selectedIds.size === 0) {
          close();
          return;
        }
        const command = new DeleteElementsCommand([...selectedIds]);
        useHistoryStore.getState().execute(command, { library, renderer });
        close();
      },
      searchableText: "Delete selection remove",
    },
    {
      id: "edit-edit-selection",
      type: "command",
      name: "Edit: Edit Selection in Inspector",
      shortcut: { key: "E" },
      action: () => {
        if (useSelectionStore.getState().selectedIds.size > 0) {
          useUIStore.getState().requestInspectorFocus();
        }
        close();
      },
      searchableText: "Edit selection inspector properties focus",
    },
    {
      id: "edit-select-all",
      type: "command",
      name: "Edit: Select All",
      shortcut: { modifiers: [keys.mod], key: "A" },
      action: () => {
        const { library } = useWasmContextStore.getState();
        if (!library) {
          close();
          return;
        }
        const allIds = library.get_all_ids();
        useSelectionStore.getState().selectAll(allIds);
        close();
      },
      searchableText: "Select all elements",
    },

    // =========================================================================
    // Layer commands
    // =========================================================================
    {
      id: "layer-add",
      type: "layer",
      name: "Layer: Add",
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        if (!library || !renderer) {
          close();
          return;
        }
        const command = new AddLayerCommand();
        useHistoryStore.getState().execute(command, { library, renderer });
        close();
      },
      searchableText: "Add new layer create",
    },
    {
      id: "layer-delete",
      type: "layer",
      name: "Layer: Delete Active",
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        const { activeLayerId, layers } = useLayerStore.getState();
        if (!library || !renderer || layers.size <= 1) {
          close();
          return;
        }
        const command = new DeleteLayerCommand(activeLayerId);
        useHistoryStore.getState().execute(command, { library, renderer });
        close();
      },
      searchableText: "Delete active layer remove",
    },
    {
      id: "layer-edit",
      type: "layer",
      name: "Layer: Edit Active",
      action: () => {
        const { activeLayerId } = useLayerStore.getState();
        useLayerStore.getState().setExpandedLayerId(activeLayerId);
        useUIStore.getState().setSidebarTab("layers");
        close();
      },
      searchableText: "Edit active layer color fill pattern properties",
    },
    {
      id: "layer-rename",
      type: "layer",
      name: "Layer: Rename Active",
      action: () => {
        const { activeLayerId } = useLayerStore.getState();
        useLayerStore.getState().setEditingLayerId(activeLayerId);
        close();
      },
      searchableText: "Rename active layer",
    },
    {
      id: "layer-toggle-visibility",
      type: "layer",
      name: "Layer: Toggle Active Visibility",
      action: () => {
        const { activeLayerId } = useLayerStore.getState();
        useLayerStore.getState().toggleVisibility(activeLayerId);
        close();
      },
      searchableText: "Toggle active layer visibility show hide",
    },
    {
      id: "layer-show-all",
      type: "layer",
      name: "Layer: Show All",
      action: () => {
        useLayerStore.getState().showAllLayers();
        close();
      },
      searchableText: "Show all layers visible",
    },
    {
      id: "layer-hide-all",
      type: "layer",
      name: "Layer: Hide All",
      action: () => {
        useLayerStore.getState().hideAllLayers();
        close();
      },
      searchableText: "Hide all layers invisible",
    },

    // Dynamic: one entry per layer to switch active layer
    ...useLayerStore
      .getState()
      .getAllLayers()
      .map(
        (layer): CommandItem => ({
          id: `layer-activate-${layer.id}`,
          type: "layer",
          name: `Layer: Set Active: ${layer.name}`,
          color: layer.color,
          action: () => {
            useLayerStore.getState().setActiveLayer(layer.id);
            close();
          },
          searchableText: `Layer set active ${layer.name} switch`,
        }),
      ),

    // =========================================================================
    // Cell commands
    // =========================================================================
    {
      id: "cell-add",
      type: "cell",
      name: "Cell: Add",
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        if (!library || !renderer) {
          close();
          return;
        }
        const existing = useExplorerStore.getState().cells;
        let n = 1;
        let name = `cell${n}`;
        while (existing.includes(name)) {
          n++;
          name = `cell${n}`;
        }
        const command = new AddCellCommand(name);
        useHistoryStore.getState().execute(command, { library, renderer });
        close();
      },
      searchableText: "Add new cell create",
    },
    {
      id: "cell-delete",
      type: "cell",
      name: "Cell: Delete Active",
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        const { activeCell, cells } = useExplorerStore.getState();
        if (!library || !renderer || !activeCell || cells.length <= 1) {
          close();
          return;
        }
        const command = new DeleteCellCommand(activeCell);
        useHistoryStore.getState().execute(command, { library, renderer });
        close();
      },
      searchableText: "Delete active cell remove",
    },
    {
      id: "cell-rename",
      type: "cell",
      name: "Cell: Rename Active",
      action: () => {
        const { activeCell } = useExplorerStore.getState();
        if (activeCell) {
          useExplorerStore.getState().setEditingCellName(activeCell);
        }
        close();
      },
      searchableText: "Rename active cell",
    },
    {
      id: "cell-change-origin",
      type: "cell",
      name: "Cell: Change Origin",
      action: () => {
        // Clear selection so the cell inspector (with origin fields) is shown,
        // then focus the Origin X field.
        useSelectionStore.getState().clearSelection();
        useUIStore.getState().requestInspectorFocusField("X");
        close();
      },
      searchableText: "Cell change origin position offset set move",
    },

    // Dynamic: one entry per cell to switch active cell
    ...useExplorerStore.getState().cells.map(
      (cellName): CommandItem => ({
        id: `cell-activate-${cellName}`,
        type: "cell",
        name: `Cell: Set Active: ${cellName}`,
        action: () => {
          useExplorerStore.getState().setActiveCell(cellName);
          close();
        },
        searchableText: `Cell set active ${cellName} switch`,
      }),
    ),

    // Dynamic: one entry per cell to add as instance in the active cell
    ...useExplorerStore
      .getState()
      .cells.filter((cellName) => cellName !== useExplorerStore.getState().activeCell)
      .map(
        (cellName): CommandItem => ({
          id: `cell-instance-${cellName}`,
          type: "cell",
          name: `Cell: Add Instance: ${cellName}`,
          action: () => {
            const { library, renderer } = useWasmContextStore.getState();
            const currentActive = useExplorerStore.getState().activeCell;
            if (!library || !renderer || !currentActive) {
              close();
              return;
            }
            if (!library.can_instance_cell(currentActive, cellName)) {
              close();
              return;
            }

            // Place at the center of the current viewport
            const { zoom, offset } = useViewportStore.getState();
            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;
            const worldX = (screenCenterX - offset.x) / zoom;
            const worldY = (screenCenterY - offset.y) / zoom;

            const command = new AddCellRefCommand(cellName, worldX, worldY);
            useHistoryStore.getState().execute(command, { library, renderer });
            close();
          },
          searchableText: `Cell add instance ${cellName} place ref reference`,
        }),
      ),

    // =========================================================================
    // Hierarchy commands
    // =========================================================================
    {
      id: "hierarchy-set-max-level",
      type: "command",
      name: "Hierarchy: Show All Levels",
      action: () => {
        const { setHierarchyLevelLimit } = useExplorerStore.getState();
        setHierarchyLevelLimit(Infinity);
        close();
      },
      searchableText: "Hierarchy show all levels max depth expand full",
    },
    {
      id: "hierarchy-set-level",
      type: "command",
      name: "Hierarchy: Set Level",
      action: () => {
        close();
        // Focus the level input after the palette closes
        requestAnimationFrame(() => {
          const input = document.getElementById("hierarchy-level-input") as HTMLInputElement | null;
          if (input) {
            input.focus();
            input.select();
          }
        });
      },
      searchableText: "Hierarchy set level depth limit change",
    },

    // =========================================================================
    // Boolean operations
    // =========================================================================
    ...makeBooleanCommands(close),

    // =========================================================================
    // Alignment commands
    // =========================================================================
    ...makeAlignCommands(close),
  ];

  return commands;
}

// =============================================================================
// Alignment command helpers
// =============================================================================

/** Map of align types to display names and search aliases. */
const ALIGN_DEFS: { id: AlignType; name: string; search: string }[] = [
  { id: "align-left", name: "Align Left", search: "Align left edges" },
  {
    id: "align-center-h",
    name: "Align Center Horizontally",
    search: "Align center horizontal middle",
  },
  { id: "align-right", name: "Align Right", search: "Align right edges" },
  { id: "align-top", name: "Align Top", search: "Align top edges" },
  { id: "align-center-v", name: "Align Center Vertically", search: "Align center vertical middle" },
  { id: "align-bottom", name: "Align Bottom", search: "Align bottom edges" },
  { id: "center-align", name: "Center Align", search: "Center align both axes" },
  { id: "origin-align", name: "Align to Origin", search: "Origin align center zero" },
];

// =============================================================================
// Boolean operation command helpers
// =============================================================================

/** Boolean operation definitions. */
const BOOLEAN_DEFS: { id: BooleanOpType; name: string; search: string }[] = [
  { id: "union", name: "Union", search: "Boolean union merge combine" },
  { id: "subtract", name: "Subtract", search: "Boolean subtract difference cut" },
  { id: "intersect", name: "Intersect", search: "Boolean intersect overlap common" },
  { id: "xor", name: "Exclude (XOR)", search: "Boolean exclude xor symmetric difference" },
];

/**
 * Generate command palette entries for boolean operations.
 */
function makeBooleanCommands(close: () => void): CommandItem[] {
  return BOOLEAN_DEFS.map(
    (def): CommandItem => ({
      id: `boolean-${def.id}`,
      type: "command",
      name: `Boolean: ${def.name}`,
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        if (!library || !renderer) {
          close();
          return;
        }
        const { selectedIds, lastSelectedId } = useSelectionStore.getState();
        if (selectedIds.size < 2) {
          close();
          return;
        }
        const ids = [...selectedIds];
        const baseId = lastSelectedId ?? ids[0];
        const cmd = new BooleanOperationCommand(ids, def.id, baseId);
        useHistoryStore.getState().execute(cmd, { library, renderer });
        close();
      },
      searchableText: def.search,
    }),
  );
}

/**
 * Generate command palette entries for all alignment operations.
 */
function makeAlignCommands(close: () => void): CommandItem[] {
  return ALIGN_DEFS.map(
    (def): CommandItem => ({
      id: `align-${def.id}`,
      type: "command",
      name: `Align: ${def.name}`,
      action: () => {
        const { library, renderer } = useWasmContextStore.getState();
        if (!library || !renderer) {
          close();
          return;
        }
        const { selectedIds, lastSelectedId } = useSelectionStore.getState();
        if (selectedIds.size === 0) {
          close();
          return;
        }
        if (def.id !== "origin-align" && selectedIds.size < 2) {
          close();
          return;
        }
        const cmd = new AlignElementsCommand(new Set(selectedIds), lastSelectedId, def.id);
        useHistoryStore.getState().execute(cmd, { library, renderer });
        close();
      },
      searchableText: def.search,
    }),
  );
}
