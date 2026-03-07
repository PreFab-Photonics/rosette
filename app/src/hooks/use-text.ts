import { useCallback, useEffect, useRef } from "react";
import { useTextStore } from "@/stores/text";
import { useLayerStore } from "@/stores/layer";
import { useHistoryStore } from "@/stores/history";
import { useToolStore } from "@/stores/tool";
import { useWasmContextStore } from "@/stores/wasm-context";
import { GRID_SIZE } from "@/stores/viewport";
import { CreateTextCommand } from "@/lib/commands";
import { handleTextEdit, getSelectedText } from "@/lib/text";
import { TEXT_DEFAULT_HEIGHT, TEXT_CURSOR_BLINK_MS } from "@/lib/constants";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";

/**
 * Snap a world coordinate to the nearest grid point.
 */
function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

/**
 * Hook for the text drawing tool.
 *
 * Handles:
 * - Click on canvas to place text at a position and start inline editing.
 * - Keydown listener for text input (attaches/detaches with editing state).
 * - Cursor blink interval.
 * - Commit (Enter) and cancel (Escape) flow.
 * - Click-away to commit text if it has content.
 *
 * @param screenToWorld - Function to convert screen coords to world coords.
 * @param library - The WasmLibrary instance.
 * @param renderer - The WasmRenderer instance.
 * @returns Event handlers for the Canvas component.
 */
export function useText(
  screenToWorld: (screenX: number, screenY: number) => { x: number; y: number } | null,
  library: WasmLibrary | null,
  renderer: WasmRenderer | null,
) {
  const isEditingText = useTextStore((s) => s.isEditingText);
  const blinkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // -------------------------------------------------------------------------
  // Commit / cancel helpers
  // -------------------------------------------------------------------------

  const commitText = useCallback(() => {
    const at = useTextStore.getState().activeText;
    if (!at || !at.content.trim() || !library || !renderer) {
      useTextStore.getState().stopEditing();
      return;
    }

    const activeLayer = useLayerStore.getState().layers.get(useLayerStore.getState().activeLayerId);
    const layerNumber = activeLayer?.layerNumber ?? 1;
    const datatype = activeLayer?.datatype ?? 0;

    const command = new CreateTextCommand(
      at.content,
      at.x,
      at.y,
      TEXT_DEFAULT_HEIGHT * GRID_SIZE,
      layerNumber,
      datatype,
    );
    useHistoryStore.getState().execute(command, { library, renderer });

    // Bump sync generation so TextOverlay re-renders
    useWasmContextStore.getState().bumpSyncGeneration();

    useTextStore.getState().stopEditing();
  }, [library, renderer]);

  const cancelEditing = useCallback(() => {
    useTextStore.getState().stopEditing();
  }, []);

  // -------------------------------------------------------------------------
  // Mouse handlers (called by Canvas)
  // -------------------------------------------------------------------------

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;

      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const world = screenToWorld(screenX, screenY);
      if (!world) return;

      // If already editing, click-away commits the text
      if (isEditingText) {
        commitText();
        return;
      }

      // Start new text at the snapped position
      const worldX = snapToGrid(world.x);
      const worldY = snapToGrid(world.y);
      useTextStore.getState().startEditing(worldX, worldY);
    },
    [screenToWorld, isEditingText, commitText],
  );

  const handleMouseMove = useCallback((_e: React.MouseEvent) => {
    // No-op for now. Could be used for text selection via drag in future.
  }, []);

  // -------------------------------------------------------------------------
  // Keyboard handler (window-level, only when editing)
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!isEditingText) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const at = useTextStore.getState().activeText;
      if (!at) return;

      // Escape cancels
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        cancelEditing();
        useToolStore.getState().setTool("select");
        return;
      }

      // Copy: write selected text to clipboard
      if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
        const selected = getSelectedText(at);
        if (selected) {
          e.preventDefault();
          navigator.clipboard.writeText(selected);
        }
        return;
      }

      // Paste
      if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.readText().then((clipText) => {
          if (!clipText) return;
          const current = useTextStore.getState().activeText;
          if (!current) return;

          // Insert pasted text character-by-character (respects selection delete)
          let updated = current;
          for (const ch of clipText) {
            const result = handleTextEdit(updated, ch === "\n" ? "Enter" : ch, {
              shiftKey: ch === "\n",
              ctrlKey: false,
              metaKey: false,
              preventDefault: () => {},
              stopPropagation: () => {},
              key: ch === "\n" ? "Enter" : ch,
            } as unknown as KeyboardEvent);
            if (result) {
              updated = result;
            }
          }
          useTextStore.getState().setActiveText(updated);
        });
        return;
      }

      const result = handleTextEdit(at, e.key, e);

      if (result === null) {
        // Enter was pressed -- commit text
        commitText();
        return;
      }

      // Skip state updates for no-op keys (modifiers, unrecognized keys)
      // where handleTextEdit returns the same activeText reference unchanged.
      if (result === at) return;

      useTextStore.getState().setActiveText(result);
      useTextStore.getState().resetCursor();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isEditingText, commitText, cancelEditing]);

  // -------------------------------------------------------------------------
  // Cursor blink interval
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (isEditingText) {
      blinkIntervalRef.current = setInterval(() => {
        useTextStore.getState().toggleCursor();
      }, TEXT_CURSOR_BLINK_MS);
    }

    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
        blinkIntervalRef.current = null;
      }
    };
  }, [isEditingText]);

  return {
    handleMouseDown,
    handleMouseMove,
    commitText,
    cancelEditing,
    isEditing: isEditingText,
  };
}
