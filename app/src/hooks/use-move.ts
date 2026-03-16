import { useCallback, useRef, useState } from "react";
import { useSelectionStore } from "@/stores/selection";
import { useHistoryStore } from "@/stores/history";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useRulerStore, type Ruler } from "@/stores/ruler";
import { useImageStore, hitTestImages, isImageId, imageIdToKey } from "@/stores/image";
import { useViewportStore } from "@/stores/viewport";
import { MoveElementsCommand, MoveRulersCommand, MoveImagesCommand } from "@/lib/commands";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";

/**
 * A point in world coordinates.
 */
interface Point {
  x: number;
  y: number;
}

/** Screen pixel threshold for detecting ruler line hover/click. */
const RULER_LINE_HIT_THRESHOLD_PX = 8;

/** Measurement box dimensions in screen pixels. */
const RULER_BOX_WIDTH = 140;
const RULER_BOX_HEIGHT = 56;

/**
 * Calculate distance from a point to a line segment.
 */
function pointToSegmentDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  if (lenSq === 0) {
    return Math.sqrt(A * A + B * B);
  }

  const param = Math.max(0, Math.min(1, dot / lenSq));
  const closestX = x1 + param * C;
  const closestY = y1 + param * D;

  const dx = px - closestX;
  const dy = py - closestY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Find which ruler (if any) is at a screen point.
 */
function findRulerAtScreenPoint(
  screenX: number,
  screenY: number,
  rulers: Map<string, Ruler>,
  zoom: number,
  offset: { x: number; y: number },
): string | null {
  for (const ruler of rulers.values()) {
    const startScreenX = ruler.start.x * zoom + offset.x;
    const startScreenY = ruler.start.y * zoom + offset.y;
    const endScreenX = ruler.end.x * zoom + offset.x;
    const endScreenY = ruler.end.y * zoom + offset.y;

    // Check box first
    const midX = (startScreenX + endScreenX) / 2;
    const midY = (startScreenY + endScreenY) / 2;
    const halfWidth = RULER_BOX_WIDTH / 2;
    const halfHeight = RULER_BOX_HEIGHT / 2;

    if (
      screenX >= midX - halfWidth &&
      screenX <= midX + halfWidth &&
      screenY >= midY - halfHeight &&
      screenY <= midY + halfHeight
    ) {
      return ruler.id;
    }

    // Check line
    const distance = pointToSegmentDistance(
      screenX,
      screenY,
      startScreenX,
      startScreenY,
      endScreenX,
      endScreenY,
    );

    if (distance <= RULER_LINE_HIT_THRESHOLD_PX) {
      return ruler.id;
    }
  }

  return null;
}

/**
 * Hook for move tool functionality.
 *
 * Handles drag interactions for moving elements:
 * - Click on any element to start moving it (immediately, even if not selected)
 * - If the clicked element is part of a selection, move all selected elements
 * - If the clicked element is not selected, move only that element
 * - Drag to move in real-time
 * - Release to finalize move (creates undoable command)
 * - Escape to cancel move and restore original positions
 *
 * @param screenToWorld - Function to convert screen coordinates to world coordinates.
 * @param library - The WasmLibrary instance for element manipulation.
 * @param renderer - The WasmRenderer instance for visual updates.
 * @returns Event handlers and move state.
 */
export function useMove(
  screenToWorld: (screenX: number, screenY: number) => Point | null,
  library: WasmLibrary | null,
  renderer: WasmRenderer | null,
) {
  const [isMoving, setIsMoving] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredRulerId, setHoveredRulerId] = useState<string | null>(null);

  const { zoom, offset } = useViewportStore();
  const rulers = useRulerStore((s) => s.rulers);
  const selectRuler = useRulerStore((s) => s.selectRuler);

  // Track the elements being moved and their starting position
  const moveState = useRef<{
    elementIds: string[];
    rulerId: string | null;
    startWorld: Point;
    currentDelta: Point;
  } | null>(null);

  /**
   * Handle mouse down - start moving if clicking on an element or ruler.
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left click

      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const world = screenToWorld(screenX, screenY);
      if (!world) return;

      // Check for ruler hit first (rulers are rendered on top)
      const hitRulerId = findRulerAtScreenPoint(screenX, screenY, rulers, zoom, offset);
      if (hitRulerId) {
        // Select the ruler
        selectRuler(hitRulerId);
        useSelectionStore.getState().clearSelection();

        // Initialize move state for ruler
        moveState.current = {
          elementIds: [],
          rulerId: hitRulerId,
          startWorld: world,
          currentDelta: { x: 0, y: 0 },
        };

        setIsMoving(true);
        return;
      }

      // Hit test: WASM elements first, then images
      let hitId: string | undefined;
      if (library) {
        hitId = library.hit_test(world.x, world.y) ?? undefined;
      }
      if (!hitId) {
        hitId = hitTestImages(world.x, world.y) ?? undefined;
      }
      if (!hitId) return; // Clicked empty space, do nothing

      // Clear ruler selection when moving shapes/images
      selectRuler(null);

      // Determine which elements to move
      const { selectedIds } = useSelectionStore.getState();

      if (isImageId(hitId)) {
        // Image hit — images are always single-select for move
        let imageIds: string[];
        if (selectedIds.has(hitId)) {
          // Move all selected images (filter out WASM IDs; mixed move not supported)
          imageIds = [...selectedIds].filter((id) => isImageId(id));
        } else {
          imageIds = [hitId];
          useSelectionStore.getState().select(hitId);
        }

        moveState.current = {
          elementIds: imageIds,
          rulerId: null,
          startWorld: world,
          currentDelta: { x: 0, y: 0 },
        };
        setIsMoving(true);
        return;
      }

      if (!library) return;

      // Expand to instance group
      const groupIds = library.get_group_ids(hitId);

      let elementIds: string[];

      if (selectedIds.has(hitId)) {
        // Clicked on a selected element - move all selected (filter out image IDs)
        elementIds = [...selectedIds].filter((id) => !isImageId(id));
      } else {
        // Clicked on an unselected element - move the whole group
        elementIds = groupIds;
        // Select the group for visual feedback
        useSelectionStore.getState().setSelection(new Set(groupIds));
      }

      // Initialize move state
      moveState.current = {
        elementIds,
        rulerId: null,
        startWorld: world,
        currentDelta: { x: 0, y: 0 },
      };

      setIsMoving(true);
    },
    [screenToWorld, library, rulers, zoom, offset, selectRuler],
  );

  /**
   * Handle mouse move - update element/ruler positions in real-time.
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const world = screenToWorld(screenX, screenY);
      if (!world) return;

      // Update hover state when not moving
      if (!isMoving) {
        // Check ruler hover first
        const hitRulerId = findRulerAtScreenPoint(screenX, screenY, rulers, zoom, offset);
        if (hitRulerId !== hoveredRulerId) {
          setHoveredRulerId(hitRulerId);
        }

        // Check shape + image hover
        {
          let hitId: string | null = null;
          if (library) {
            hitId = library.hit_test(world.x, world.y) ?? null;
          }
          if (!hitId) {
            hitId = hitTestImages(world.x, world.y);
          }
          if (hitId !== hoveredId) {
            setHoveredId(hitId);
          }
        }
        return;
      }

      // We're in a move operation
      const state = moveState.current;
      if (!state) return;

      // Calculate the delta from start position
      const totalDeltaX = world.x - state.startWorld.x;
      const totalDeltaY = world.y - state.startWorld.y;

      // Calculate the incremental delta since last move
      const incrementalDeltaX = totalDeltaX - state.currentDelta.x;
      const incrementalDeltaY = totalDeltaY - state.currentDelta.y;

      // Apply the incremental translation for real-time feedback
      if (incrementalDeltaX !== 0 || incrementalDeltaY !== 0) {
        if (state.rulerId) {
          // Moving a ruler - get fresh state to avoid stale closure
          const ruler = useRulerStore.getState().rulers.get(state.rulerId);
          if (ruler) {
            useRulerStore.getState().updateEndpoint(state.rulerId, "start", {
              x: ruler.start.x + incrementalDeltaX,
              y: ruler.start.y + incrementalDeltaY,
            });
            useRulerStore.getState().updateEndpoint(state.rulerId, "end", {
              x: ruler.end.x + incrementalDeltaX,
              y: ruler.end.y + incrementalDeltaY,
            });
          }
        } else if (state.elementIds.length > 0 && isImageId(state.elementIds[0])) {
          // Moving images — update image store directly
          const imgStore = useImageStore.getState();
          for (const imgId of state.elementIds) {
            const key = imageIdToKey(imgId);
            const entry = imgStore.images.get(key);
            if (entry) {
              imgStore.updateImage(key, {
                x: entry.x + incrementalDeltaX,
                y: entry.y + incrementalDeltaY,
              });
            }
          }
        } else if (library && renderer) {
          // Moving shapes
          library.translate_elements(state.elementIds, incrementalDeltaX, incrementalDeltaY);
          renderer.sync_from_library(library);
          renderer.mark_dirty();
          // Notify subscribers (e.g. instance labels) that library data changed
          useWasmContextStore.getState().bumpSyncGeneration();
        }

        // Update current delta
        state.currentDelta = { x: totalDeltaX, y: totalDeltaY };
      }
    },
    [screenToWorld, library, renderer, rulers, zoom, offset, isMoving, hoveredId, hoveredRulerId],
  );

  /**
   * Handle mouse up - finalize the move with a command for undo/redo (shapes only).
   */
  const handleMouseUp = useCallback(() => {
    if (!isMoving) {
      setIsMoving(false);
      moveState.current = null;
      return;
    }

    const state = moveState.current;
    if (!state) {
      setIsMoving(false);
      return;
    }

    const { elementIds, rulerId, currentDelta } = state;

    // For rulers, create a command for undo/redo (doesn't need library/renderer)
    if (rulerId && (currentDelta.x !== 0 || currentDelta.y !== 0)) {
      // The move already happened incrementally, so just push the command
      const command = new MoveRulersCommand([rulerId], currentDelta.x, currentDelta.y);
      useHistoryStore.getState().pushCommand(command);
      setIsMoving(false);
      moveState.current = null;
      return;
    }

    // For images, push a single command for undo/redo (move already applied incrementally)
    if (
      elementIds.length > 0 &&
      isImageId(elementIds[0]) &&
      (currentDelta.x !== 0 || currentDelta.y !== 0)
    ) {
      const command = new MoveImagesCommand(elementIds, currentDelta.x, currentDelta.y);
      useHistoryStore.getState().pushCommand(command);
    } else if (library && renderer && (currentDelta.x !== 0 || currentDelta.y !== 0)) {
      // For shapes, create a command for undo/redo
      // First, undo the real-time moves (we applied them incrementally)
      library.translate_elements(elementIds, -currentDelta.x, -currentDelta.y);
      renderer.sync_from_library(library);

      // Now create and execute the command (which will apply the move again)
      const command = new MoveElementsCommand(elementIds, currentDelta.x, currentDelta.y);
      useHistoryStore.getState().execute(command, { library, renderer });
    }

    // Reset state
    setIsMoving(false);
    moveState.current = null;
  }, [isMoving, library, renderer]);

  /**
   * Cancel the current move operation, restoring original positions.
   */
  const cancelMove = useCallback(() => {
    if (!isMoving) {
      setIsMoving(false);
      moveState.current = null;
      return;
    }

    const state = moveState.current;
    if (state && (state.currentDelta.x !== 0 || state.currentDelta.y !== 0)) {
      if (state.rulerId) {
        // Undo ruler move - get fresh state to avoid stale closure
        const ruler = useRulerStore.getState().rulers.get(state.rulerId);
        if (ruler) {
          useRulerStore.getState().updateEndpoint(state.rulerId, "start", {
            x: ruler.start.x - state.currentDelta.x,
            y: ruler.start.y - state.currentDelta.y,
          });
          useRulerStore.getState().updateEndpoint(state.rulerId, "end", {
            x: ruler.end.x - state.currentDelta.x,
            y: ruler.end.y - state.currentDelta.y,
          });
        }
      } else if (state.elementIds.length > 0 && isImageId(state.elementIds[0])) {
        // Undo image moves
        const imgStore = useImageStore.getState();
        for (const imgId of state.elementIds) {
          const key = imageIdToKey(imgId);
          const entry = imgStore.images.get(key);
          if (entry) {
            imgStore.updateImage(key, {
              x: entry.x - state.currentDelta.x,
              y: entry.y - state.currentDelta.y,
            });
          }
        }
      } else if (library && renderer) {
        // Undo shape moves
        library.translate_elements(state.elementIds, -state.currentDelta.x, -state.currentDelta.y);
        renderer.sync_from_library(library);
        renderer.mark_dirty();
      }
    }

    setIsMoving(false);
    moveState.current = null;
  }, [isMoving, library, renderer]);

  /**
   * Handle mouse leave - cancel move if in progress.
   */
  const handleMouseLeave = useCallback(() => {
    if (isMoving) {
      cancelMove();
    }
    setHoveredId(null);
    setHoveredRulerId(null);
  }, [isMoving, cancelMove]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    cancelMove,
    isMoving,
    hoveredId,
    hoveredRulerId,
  };
}
