import { useEffect, useRef, type RefObject } from "react";
import { useViewportStore, type WorldBounds } from "@/stores/viewport";
import { useToolStore } from "@/stores/tool";
import { useSelectionStore } from "@/stores/selection";
import { useHistoryStore } from "@/stores/history";
import { useClipboardStore } from "@/stores/clipboard";
import { useRulerStore } from "@/stores/ruler";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";
import {
  ZOOM_IN_FACTOR,
  ZOOM_OUT_FACTOR,
  ZOOM_IN_FACTOR_FAST,
  ZOOM_OUT_FACTOR_FAST,
  PAN_SPEED,
  PAN_SPEED_FAST,
} from "@/lib/constants";
import {
  AddCellCommand,
  DeleteElementsCommand,
  DeleteRulersCommand,
  RemoveImageCommand,
  PasteElementsCommand,
  DuplicateElementsCommand,
  placeRectangleInViewport,
  placePolygonInViewport,
  placeTextInViewport,
  snapshotElements,
} from "@/lib/commands";
import { isImageId, imageIdToKey } from "@/stores/image";
import { useCommandPaletteStore } from "@/stores/command-palette";
import { useKeyboardFocusStore } from "@/stores/keyboard-focus";
import { useUIStore } from "@/stores/ui";
import { useExplorerStore, generateUniqueCellName } from "@/stores/explorer";
import { useLayerStore } from "@/stores/layer";
import { useTextStore } from "@/stores/text";
import { centerViewOnSelection, getEffectiveViewport, zoomToFitAll } from "@/lib/utils";

/** Keys tracked for continuous panning. */
const PAN_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

/**
 * Keyboard shortcuts for the canvas.
 *
 * Shortcuts:
 * - `=` / `+`: Zoom in
 * - `-` / `_`: Zoom out
 * - Arrow keys: Pan (supports diagonal)
 * - Hold `Shift`: Zoom/pan faster
 * - `Escape`: Cancel current operation or switch to select tool
 * - `V`: Select tool
 * - `P`: Pan tool
 * - `U`: Ruler tool
 * - `F`: Zoom to fit all objects (or reset if none)
 * - `Shift+F`: Zoom to fit selected objects
 * - `Cmd/Ctrl+A`: Select all objects
 * - `Cmd/Ctrl+C`: Copy selected objects
 * - `Cmd/Ctrl+V`: Paste from clipboard
 * - `Cmd/Ctrl+B`: Duplicate selected objects
 * - `Delete/Backspace`: Delete selected objects
 * - `Cmd/Ctrl+Z`: Undo
 * - `Cmd/Ctrl+Shift+Z` or `Cmd/Ctrl+Y`: Redo
 * - `Tab`: Cycle selection to next object
 * - `Shift+Tab`: Cycle selection to previous object
 * - `Shift+E`: Focus Explorer panel for keyboard navigation
 * - `Shift+L`: Focus Layers panel for keyboard navigation
 */
export function useKeyboardShortcuts(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  library: WasmLibrary | null,
  renderer: WasmRenderer | null,
) {
  const zoomAt = useViewportStore((s) => s.zoomAt);
  const pan = useViewportStore((s) => s.pan);
  const zoomToSelected = useViewportStore((s) => s.zoomToSelected);
  const setTool = useToolStore((s) => s.setTool);

  // Track currently pressed keys for continuous panning
  const pressedKeys = useRef(new Set<string>());
  const shiftHeld = useRef(false);
  const panAnimationId = useRef<number | null>(null);

  // Handle all keyboard shortcuts and panning animation
  useEffect(() => {
    // Animation loop for continuous panning
    const updatePan = () => {
      const keys = pressedKeys.current;
      if (keys.size === 0) {
        panAnimationId.current = null;
        return;
      }

      const speed = shiftHeld.current ? PAN_SPEED_FAST : PAN_SPEED;

      let dx = 0;
      let dy = 0;

      if (keys.has("ArrowUp")) dy += speed;
      if (keys.has("ArrowDown")) dy -= speed;
      if (keys.has("ArrowLeft")) dx += speed;
      if (keys.has("ArrowRight")) dx -= speed;

      if (dx !== 0 || dy !== 0) {
        pan(dx, dy);
      }

      panAnimationId.current = requestAnimationFrame(updatePan);
    };

    const startPanLoop = () => {
      if (panAnimationId.current === null && pressedKeys.current.size > 0) {
        panAnimationId.current = requestAnimationFrame(updatePan);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Track shift state
      shiftHeld.current = e.shiftKey;

      // Cmd/Ctrl+K: Open command palette (always allow, even when another layer has focus)
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        useCommandPaletteStore.getState().toggle();
        return;
      }

      // Skip all other shortcuts if another layer has keyboard focus
      // (e.g., command palette, context menu, modal dialogs)
      if (!useKeyboardFocusStore.getState().isCanvasActive()) {
        return;
      }

      // When focus is in a text input, let the input handle all keys natively.
      // Cmd+K is already handled above; everything else (typing, Cmd+Z undo,
      // Cmd+A select-all, Cmd+C copy, arrows, delete, etc.) belongs to the input.
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Skip all shortcuts while inline text editing is active.
      // The text tool's own keydown handler captures keystrokes separately.
      if (useTextStore.getState().isEditingText) {
        return;
      }

      // "/" : Open command palette (without modifiers, not in input fields)
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        useCommandPaletteStore.getState().open();
        return;
      }

      // Track pan keys and start animation loop
      if (PAN_KEYS.has(e.key)) {
        e.preventDefault();
        pressedKeys.current.add(e.key);
        startPanLoop();
        return;
      }

      // Get canvas center for zoom pivot
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Determine zoom factors based on shift modifier
      const zoomIn = e.shiftKey ? ZOOM_IN_FACTOR_FAST : ZOOM_IN_FACTOR;
      const zoomOut = e.shiftKey ? ZOOM_OUT_FACTOR_FAST : ZOOM_OUT_FACTOR;

      // Zoom shortcuts (allow with shift)
      switch (e.key) {
        case "=":
        case "+":
          e.preventDefault();
          zoomAt(zoomIn, centerX, centerY);
          break;
        case "-":
        case "_":
          e.preventDefault();
          zoomAt(zoomOut, centerX, centerY);
          break;
      }

      // Cmd/Ctrl+A: Select all objects
      if ((e.metaKey || e.ctrlKey) && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        if (library) {
          const allIds = library.get_all_ids();
          useSelectionStore.getState().selectAll(allIds);
        }
        return;
      }

      // Cmd/Ctrl+C: Copy selected objects
      if ((e.metaKey || e.ctrlKey) && (e.key === "c" || e.key === "C") && !e.shiftKey) {
        e.preventDefault();
        if (library) {
          const { selectedIds } = useSelectionStore.getState();
          if (selectedIds.size > 0) {
            const snapshots = snapshotElements(library, selectedIds);
            useClipboardStore.getState().copy(snapshots);
          }
        }
        return;
      }

      // Cmd/Ctrl+V: Paste from clipboard
      if ((e.metaKey || e.ctrlKey) && (e.key === "v" || e.key === "V") && !e.shiftKey) {
        e.preventDefault();
        if (library && renderer && canvas) {
          const { hasContent } = useClipboardStore.getState();
          if (hasContent) {
            const command = new PasteElementsCommand();
            useHistoryStore.getState().execute(command, { library, renderer });
            centerViewOnSelection(library, canvas);
          }
        }
        return;
      }

      // Cmd/Ctrl+B: Duplicate selected objects
      if ((e.metaKey || e.ctrlKey) && (e.key === "b" || e.key === "B") && !e.shiftKey) {
        e.preventDefault();
        if (library && renderer && canvas) {
          const { selectedIds } = useSelectionStore.getState();
          if (selectedIds.size > 0) {
            const command = new DuplicateElementsCommand([...selectedIds]);
            useHistoryStore.getState().execute(command, { library, renderer });
            centerViewOnSelection(library, canvas);
          }
        }
        return;
      }

      // Delete/Backspace: Delete selected objects, rulers, or images
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();

        // First check for selected rulers
        const { selectedRulerIds } = useRulerStore.getState();
        if (selectedRulerIds.size > 0 && library && renderer) {
          const command = new DeleteRulersCommand([...selectedRulerIds]);
          useHistoryStore.getState().execute(command, { library, renderer });
          return;
        }

        // Then check for selected shapes and images
        if (library && renderer) {
          const { selectedIds } = useSelectionStore.getState();
          if (selectedIds.size > 0) {
            // Separate image IDs from WASM element IDs
            const imageIds: string[] = [];
            const wasmIds: string[] = [];
            for (const id of selectedIds) {
              if (isImageId(id)) {
                imageIds.push(id);
              } else {
                wasmIds.push(id);
              }
            }

            // Delete images (single atomic command)
            if (imageIds.length > 0) {
              const cmd = new RemoveImageCommand(imageIds.map(imageIdToKey));
              useHistoryStore.getState().execute(cmd, { library, renderer });
            }

            // Delete WASM elements
            if (wasmIds.length > 0) {
              const command = new DeleteElementsCommand(wasmIds);
              useHistoryStore.getState().execute(command, { library, renderer });
            }
          }
        }
        return;
      }

      // Cmd/Ctrl+Z: Undo (without Shift)
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (library && renderer) {
          const { canUndo, undo } = useHistoryStore.getState();
          if (canUndo) {
            undo({ library, renderer });
          }
        }
        return;
      }

      // Cmd/Ctrl+Shift+Z or Cmd/Ctrl+Y: Redo
      if (
        (e.metaKey || e.ctrlKey) &&
        (((e.key === "z" || e.key === "Z") && e.shiftKey) || e.key === "y" || e.key === "Y")
      ) {
        e.preventDefault();
        if (library && renderer) {
          const { canRedo, redo } = useHistoryStore.getState();
          if (canRedo) {
            redo({ library, renderer });
          }
        }
        return;
      }

      // Tab / Shift+Tab: Cycle selection between objects (by instance group)
      if (e.key === "Tab") {
        e.preventDefault();
        if (library && canvas) {
          // Use group representatives so each Tab press moves to the next
          // cell instance (not individual polygons within an instance)
          const repIds = library.get_group_representative_ids();
          if (repIds.length > 0) {
            // Cycle to next/previous representative
            if (e.shiftKey) {
              useSelectionStore.getState().selectPrevious(repIds);
            } else {
              useSelectionStore.getState().selectNext(repIds);
            }
            // Expand the selected representative to its full group,
            // keeping lastSelectedId as the representative so the next
            // Tab press can find its position in the repIds list.
            const store = useSelectionStore.getState();
            const repId = store.lastSelectedId;
            if (repId) {
              const groupIds = library.get_group_ids(repId);
              if (groupIds.length > 1) {
                useSelectionStore.setState({
                  selectedIds: new Set(groupIds),
                  lastSelectedId: repId,
                });
              }
            }
            centerViewOnSelection(library, canvas);
          }
        }
        return;
      }

      // Enter: Place a shape centered in viewport shortly after switching to a drawing tool
      if (
        e.key === "Enter" &&
        (useToolStore.getState().activeTool === "rectangle" ||
          useToolStore.getState().activeTool === "polygon" ||
          useToolStore.getState().activeTool === "text")
      ) {
        const elapsed = Date.now() - useToolStore.getState().toolSetAt;
        if (elapsed > 2000) return; // Only within 2 s of activating the tool
        e.preventDefault();
        if (library && renderer && canvas) {
          const tool = useToolStore.getState().activeTool;
          if (tool === "rectangle") {
            placeRectangleInViewport(library, renderer, canvas);
          } else if (tool === "polygon") {
            placePolygonInViewport(library, renderer, canvas);
          } else {
            placeTextInViewport(library, renderer, canvas);
          }
        }
        return;
      }

      // Tool shortcuts - skip if Cmd/Ctrl is held (allow browser shortcuts like Cmd+R)
      if (e.metaKey || e.ctrlKey) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          // Cancel ruler creation if active
          if (useRulerStore.getState().activeRulerId) {
            useRulerStore.getState().cancelCreation();
          } else if (useRulerStore.getState().selectedRulerIds.size > 0) {
            // Deselect rulers if any are selected
            useRulerStore.getState().clearSelection();
          } else if (useSelectionStore.getState().selectedIds.size > 0) {
            // Deselect shapes if any are selected
            useSelectionStore.getState().clearSelection();
          } else {
            // Nothing selected, switch to select tool
            setTool("select");
          }
          break;
        case "v":
        case "V":
          e.preventDefault();
          setTool("select");
          break;
        case "p":
        case "P":
          e.preventDefault();
          setTool("pan");
          break;
        case "q":
        case "Q":
          e.preventDefault();
          setTool("laser");
          break;
        case "z":
        case "Z":
          e.preventDefault();
          setTool("zoom");
          break;
        case "r":
        case "R":
          e.preventDefault();
          setTool("rectangle");
          break;
        case "m":
        case "M":
          e.preventDefault();
          setTool("move");
          break;
        case "g":
        case "G":
          e.preventDefault();
          setTool("polygon");
          break;
        case "h":
        case "H":
          e.preventDefault();
          setTool("path");
          break;
        case "t":
          e.preventDefault();
          setTool("text");
          break;
        case "u":
        case "U":
          e.preventDefault();
          setTool("ruler");
          break;
        case "i":
          // Open command palette pre-filled with "add instance " search
          e.preventDefault();
          useCommandPaletteStore.getState().open("add instance ");
          break;
        case "f":
          // Zoom to fit all objects (or reset if none)
          e.preventDefault();
          zoomToFitAll();
          break;
        case "F":
          // Shift+F: Zoom to fit selected objects
          e.preventDefault();
          if (library && canvas) {
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
              const vpF = getEffectiveViewport(canvas);
              zoomToSelected(bounds, vpF.width, vpF.height, vpF.screenCenter);
            }
          }
          break;
        case "E":
          // Shift+E: Focus Explorer panel for keyboard navigation
          if (e.shiftKey) {
            e.preventDefault();
            // Expand the explorer if collapsed
            if (useUIStore.getState().explorerCollapsed) {
              useUIStore.getState().toggleExplorerCollapsed();
            }
            useExplorerStore.getState().setFocused(true);
            break;
          }
          // No shift — fall through to edit-selection behavior
          e.preventDefault();
          if (useSelectionStore.getState().selectedIds.size > 0) {
            useUIStore.getState().requestInspectorFocus();
          }
          break;
        case "e":
          // Edit selection in inspector panel
          e.preventDefault();
          if (useSelectionStore.getState().selectedIds.size > 0) {
            useUIStore.getState().requestInspectorFocus();
          }
          break;
        case "L":
          // Shift+L: Focus Layers panel for keyboard navigation
          e.preventDefault();
          useUIStore.getState().setSidebarTab("layers");
          useLayerStore.getState().setFocused(true);
          break;
        case "I":
          // Shift+I: Switch sidebar to Inspector tab
          e.preventDefault();
          useUIStore.getState().setSidebarTab("inspector");
          break;
        case "c": {
          // Create a new cell, switch to it, and start inline rename
          e.preventDefault();
          if (!library || !renderer) break;
          const cellName = generateUniqueCellName();
          const addCmd = new AddCellCommand(cellName);
          useHistoryStore.getState().execute(addCmd, { library, renderer });
          // Expand explorer if collapsed
          if (useUIStore.getState().explorerCollapsed) {
            useUIStore.getState().toggleExplorerCollapsed();
          }
          useExplorerStore.getState().setActiveCell(cellName);
          useExplorerStore.getState().setEditingCellName(cellName);
          break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      shiftHeld.current = e.shiftKey;
      pressedKeys.current.delete(e.key);
    };

    // Clear pressed keys when window loses focus (prevents sticky keys)
    const handleBlur = () => {
      pressedKeys.current.clear();
      shiftHeld.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      if (panAnimationId.current !== null) {
        cancelAnimationFrame(panAnimationId.current);
      }
    };
  }, [canvasRef, zoomAt, pan, setTool, library, renderer, zoomToSelected]);
}
