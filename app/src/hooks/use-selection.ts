import { useCallback, useEffect, useRef } from "react";
import { useSelectionStore } from "@/stores/selection";
import { useMarqueeStore } from "@/stores/marquee";
import { useHistoryStore } from "@/stores/history";
import { useViewportStore } from "@/stores/viewport";
import { useRulerStore } from "@/stores/ruler";
import { hitTestImages, hitTestImagesRect, isImageId } from "@/stores/image";
import { MoveRulerEndpointCommand } from "@/lib/commands";
import { calculateSnappedPoint, getSnapVertices } from "@/lib/snap";
import {
  findRulerAtScreenPoint,
  findRulerEndpointAtScreenPoint,
  findRulersInScreenRect,
} from "@/lib/ruler-hittest";
import type { WasmLibrary, WasmRenderer } from "@/wasm/rosette_wasm";

/**
 * A point in world coordinates.
 */
interface Point {
  x: number;
  y: number;
}

/** Minimum marquee size in pixels to trigger selection. */
const MIN_MARQUEE_SIZE = 5;

/**
 * Expand a single hit ID to all IDs in the same instance group.
 * In design mode, polygons from the same cell reference share a group.
 */
function expandToGroup(library: WasmLibrary, hitId: string): string[] {
  return library.get_group_ids(hitId);
}

/**
 * Expand a list of hit IDs to include all group members.
 * Deduplicates the result.
 *
 * For CellRef synthetic UUIDs ("ref:N:M"), all IDs sharing the same element
 * index N belong to the same group.  We track which element indices have
 * already been expanded so we call get_group_ids at most once per instance,
 * avoiding O(N^2) WASM calls for large AREF arrays.
 */
function expandAllToGroups(library: WasmLibrary, hitIds: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  const expandedRefIndices = new Set<string>();
  for (const id of hitIds) {
    // For ref UUIDs, extract the element index and skip if already expanded
    if (id.startsWith("ref:")) {
      const elemIdx = id.substring(4, id.indexOf(":", 4));
      if (expandedRefIndices.has(elemIdx)) {
        // Already expanded this instance group — just add this ID if new
        if (!seen.has(id)) {
          seen.add(id);
          result.push(id);
        }
        continue;
      }
      expandedRefIndices.add(elemIdx);
    }
    const groupIds = library.get_group_ids(id);
    for (const gid of groupIds) {
      if (!seen.has(gid)) {
        seen.add(gid);
        result.push(gid);
      }
    }
  }
  return result;
}

/**
 * Hook for selection tool functionality.
 *
 * Handles mouse interactions for selecting shapes, including:
 * - Click to select
 * - Shift+click to add to selection
 * - Ctrl/Cmd+click to toggle selection
 * - Drag to marquee select (intersecting shapes)
 * - Shift+drag to add marquee selection
 * - Hover highlighting
 *
 * @param screenToWorld - Function to convert screen coordinates to world coordinates.
 * @param library - The WasmLibrary instance for hit testing.
 * @param renderer - The WasmRenderer instance for visual feedback.
 * @returns Event handlers and selection state.
 */
export function useSelection(
  screenToWorld: (screenX: number, screenY: number) => Point | null,
  library: WasmLibrary | null,
  renderer: WasmRenderer | null,
) {
  const { selectedIds, hoveredId, clearSelection, setHover } = useSelectionStore();
  const {
    box: marqueeBox,
    isDrawing: isDrawingMarquee,
    previewIds,
    startDrawing,
    updateBox,
    setPreviewIds,
    reset: resetMarquee,
  } = useMarqueeStore();
  const { zoom, offset } = useViewportStore();
  const rulers = useRulerStore((s) => s.rulers);
  const selectedRulerIds = useRulerStore((s) => s.selectedRulerIds);
  const selectRuler = useRulerStore((s) => s.selectRuler);
  const toggleRulerSelection = useRulerStore((s) => s.toggleSelection);
  const addRulerToSelection = useRulerStore((s) => s.addToSelection);
  const clearRulerSelection = useRulerStore((s) => s.clearSelection);
  const setHoveredRuler = useRulerStore((s) => s.setHoveredRuler);
  const setHoveredEndpoint = useRulerStore((s) => s.setHoveredEndpoint);
  const setDraggingEndpoint = useRulerStore((s) => s.setDraggingEndpoint);
  const endDraggingEndpoint = useRulerStore((s) => s.endDraggingEndpoint);
  const updateRulerEndpoint = useRulerStore((s) => s.updateEndpoint);
  const hoveredRulerId = useRulerStore((s) => s.hoveredRulerId);
  const hoveredEndpoint = useRulerStore((s) => s.hoveredEndpoint);
  const draggingEndpoint = useRulerStore((s) => s.draggingEndpoint);
  const setMarqueePreviewIds = useRulerStore((s) => s.setMarqueePreviewIds);
  const setSnapPoint = useRulerStore((s) => s.setSnapPoint);

  // Track the last preview IDs to avoid unnecessary updates
  const lastPreviewIdsRef = useRef<string>("");

  // RAF throttle for the marquee preview query. The marquee rectangle itself
  // updates immediately on every mousemove (smooth rubber-banding), but the
  // expensive preview work — rect hit-test, group expansion, and ruler/image
  // queries — runs at most once per animation frame. Pointer events fire far
  // faster than the display refresh (120+ Hz on trackpads), so coalescing this
  // to RAF avoids redundant per-event work when sweeping across dense geometry.
  const marqueePreviewRafRef = useRef<number>(0);

  // Cancel any pending marquee-preview frame on unmount.
  useEffect(() => {
    return () => {
      if (marqueePreviewRafRef.current !== 0) {
        cancelAnimationFrame(marqueePreviewRafRef.current);
        marqueePreviewRafRef.current = 0;
      }
    };
  }, []);

  // Sync selection state to renderer (filter out image IDs — renderer only knows WASM elements)
  useEffect(() => {
    if (!renderer) return;
    const wasmIds = Array.from(selectedIds).filter((id) => !isImageId(id));
    renderer.set_selection(wasmIds);
  }, [renderer, selectedIds]);

  // Sync hover state to renderer (single hover when not drawing marquee)
  useEffect(() => {
    if (!renderer) return;

    if (isDrawingMarquee) {
      // During marquee drawing, use set_hover_multiple for preview (filter images)
      const wasmIds = Array.from(previewIds).filter((id) => !isImageId(id));
      renderer.set_hover_multiple(wasmIds);
    } else if (hoveredId && !isImageId(hoveredId) && library) {
      // Normal hover on WASM element - expand to instance group for visual highlight
      const groupIds = expandToGroup(library, hoveredId);
      renderer.set_hover_multiple(groupIds);
    } else {
      // Image hover or no hover — clear renderer hover (image overlay handles its own)
      renderer.set_hover(undefined);
    }
  }, [renderer, library, hoveredId, isDrawingMarquee, previewIds]);

  /**
   * Handle mouse down - either select a shape/ruler, drag endpoint, or start marquee.
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left click

      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Check for ruler endpoint hit first (highest priority)
      const hitEndpoint = findRulerEndpointAtScreenPoint(screenX, screenY, rulers, zoom, offset);
      if (hitEndpoint) {
        // Start dragging the endpoint
        selectRuler(hitEndpoint.rulerId);
        setDraggingEndpoint(hitEndpoint);
        clearSelection();
        return;
      }

      // Check for ruler hit (line or box)
      const hitRulerId = findRulerAtScreenPoint(screenX, screenY, rulers, zoom, offset);
      if (hitRulerId) {
        // Clicked on a ruler - handle selection with modifier keys
        if (e.shiftKey) {
          // Shift+click: add to ruler selection
          addRulerToSelection([hitRulerId]);
        } else if (e.metaKey || e.ctrlKey) {
          // Ctrl/Cmd+click: toggle ruler selection
          toggleRulerSelection(hitRulerId);
        } else {
          // Plain click: select only this ruler
          selectRuler(hitRulerId);
        }
        clearSelection();
        return;
      }

      // Clear ruler selection when clicking elsewhere
      if (selectedRulerIds.size > 0) {
        clearRulerSelection();
      }

      const world = screenToWorld(screenX, screenY);
      if (!world || !library) return;

      // Hit test: WASM elements first (higher priority), then image overlays
      let hitId = library.hit_test(world.x, world.y);
      if (!hitId) {
        hitId = hitTestImages(world.x, world.y) ?? undefined;
      }

      if (hitId) {
        // Expand to instance group (all polygons from the same cell ref).
        // Image IDs are standalone (no group expansion needed).
        const groupIds = isImageId(hitId) ? [hitId] : expandToGroup(library, hitId);

        // Clicked on an element - handle selection immediately
        if (e.shiftKey) {
          // Shift+click: add group to selection
          const current = useSelectionStore.getState().selectedIds;
          const newSelection = new Set([...current, ...groupIds]);
          useSelectionStore.setState({ selectedIds: newSelection, lastSelectedId: hitId });
        } else if (e.metaKey || e.ctrlKey) {
          // Ctrl/Cmd+click: toggle group selection
          const current = useSelectionStore.getState().selectedIds;
          const allInSelection = groupIds.every((id) => current.has(id));
          const newSelection = new Set(current);
          if (allInSelection) {
            for (const id of groupIds) newSelection.delete(id);
          } else {
            for (const id of groupIds) newSelection.add(id);
          }
          useSelectionStore.setState({ selectedIds: newSelection, lastSelectedId: hitId });
        } else {
          // Plain click: select only this group
          useSelectionStore.setState({ selectedIds: new Set(groupIds), lastSelectedId: hitId });
        }
      } else {
        // Clicked empty space - start marquee drawing
        startDrawing(screenX, screenY);

        // Clear selection on plain click in empty space (will be replaced by marquee result)
        if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
          clearSelection();
        }
      }
    },
    [
      screenToWorld,
      library,
      rulers,
      zoom,
      offset,
      selectedRulerIds,
      clearSelection,
      selectRuler,
      toggleRulerSelection,
      addRulerToSelection,
      clearRulerSelection,
      setDraggingEndpoint,
      startDrawing,
    ],
  );

  /**
   * Handle mouse move - update hover state, drag endpoint, or marquee box.
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = e.currentTarget as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Handle endpoint dragging with geometry snapping
      // Shift key disables geometry snapping
      if (draggingEndpoint) {
        const world = screenToWorld(screenX, screenY);
        if (world) {
          const vertices = getSnapVertices(library);
          const snapResult = calculateSnappedPoint(
            screenX,
            screenY,
            world.x,
            world.y,
            vertices,
            zoom,
            offset,
            e.shiftKey,
          );
          updateRulerEndpoint(
            draggingEndpoint.rulerId,
            draggingEndpoint.endpoint,
            snapResult.point,
          );
          // Update snap indicator for visual feedback
          setSnapPoint(snapResult.isGeometrySnap ? snapResult.point : null);
        }
        return;
      }

      // Update marquee box if drawing
      if (isDrawingMarquee) {
        // Update the rubber-band rectangle immediately for smooth tracking.
        updateBox(screenX, screenY);

        // Defer the expensive preview query (hit-test + group expansion +
        // ruler/image checks) to the next animation frame, coalescing bursts of
        // pointer events into a single query per frame.
        if (marqueePreviewRafRef.current === 0) {
          marqueePreviewRafRef.current = requestAnimationFrame(() => {
            marqueePreviewRafRef.current = 0;

            // Bail if the marquee ended before this frame ran.
            const currentBox = useMarqueeStore.getState().box;
            if (!currentBox || !useMarqueeStore.getState().isDrawing) return;

            // Get screen bounds of marquee
            const screenMinX = Math.min(currentBox.x, currentBox.x + currentBox.width);
            const screenMaxX = Math.max(currentBox.x, currentBox.x + currentBox.width);
            const screenMinY = Math.min(currentBox.y, currentBox.y + currentBox.height);
            const screenMaxY = Math.max(currentBox.y, currentBox.y + currentBox.height);

            // Check rulers in marquee for preview
            const hitRulerIds = findRulersInScreenRect(
              screenMinX,
              screenMinY,
              screenMaxX,
              screenMaxY,
              rulers,
              zoom,
              offset,
            );
            setMarqueePreviewIds(hitRulerIds);

            // Check shapes + images in marquee for preview
            const worldX1 = (screenMinX - offset.x) / zoom;
            const worldX2 = (screenMaxX - offset.x) / zoom;
            const worldY1 = (screenMinY - offset.y) / zoom;
            const worldY2 = (screenMaxY - offset.y) / zoom;

            const worldMinX = Math.min(worldX1, worldX2);
            const worldMaxX = Math.max(worldX1, worldX2);
            const worldMinY = Math.min(worldY1, worldY2);
            const worldMaxY = Math.max(worldY1, worldY2);

            const rawHitIds = library
              ? library.hit_test_rect(worldMinX, worldMinY, worldMaxX, worldMaxY)
              : [];
            const hitIds = library ? expandAllToGroups(library, rawHitIds) : rawHitIds;
            const imageHitIds = hitTestImagesRect(worldMinX, worldMinY, worldMaxX, worldMaxY);
            const allHitIds = [...hitIds, ...imageHitIds];

            // Only update if the set of IDs changed (avoid unnecessary re-renders)
            const hitIdsKey = allHitIds.sort().join(",");
            if (hitIdsKey !== lastPreviewIdsRef.current) {
              lastPreviewIdsRef.current = hitIdsKey;
              setPreviewIds(allHitIds);
            }
          });
        }
        return;
      }

      // Check for ruler endpoint hover first (highest priority)
      const hitEndpoint = findRulerEndpointAtScreenPoint(screenX, screenY, rulers, zoom, offset);
      let hitRulerId: string | null = null;

      if (hitEndpoint) {
        if (
          hoveredEndpoint?.rulerId !== hitEndpoint.rulerId ||
          hoveredEndpoint?.endpoint !== hitEndpoint.endpoint
        ) {
          setHoveredEndpoint(hitEndpoint);
        }
        if (hoveredRulerId !== hitEndpoint.rulerId) {
          setHoveredRuler(hitEndpoint.rulerId);
        }
        hitRulerId = hitEndpoint.rulerId;
      } else {
        // Clear endpoint hover if not near any endpoint
        if (hoveredEndpoint) {
          setHoveredEndpoint(null);
        }

        // Check for ruler hover (line or box)
        hitRulerId = findRulerAtScreenPoint(screenX, screenY, rulers, zoom, offset);
        if (hitRulerId !== hoveredRulerId) {
          setHoveredRuler(hitRulerId);
        }
      }

      // Update shape hover state when not drawing marquee
      const world = screenToWorld(screenX, screenY);
      if (!world || !library) {
        if (hoveredId !== null) {
          setHover(null);
        }
        return;
      }

      // Only update shape hover if not hovering a ruler
      if (!hitRulerId) {
        let hitId = library.hit_test(world.x, world.y);
        if (!hitId) {
          hitId = hitTestImages(world.x, world.y) ?? undefined;
        }
        if ((hitId ?? null) !== hoveredId) {
          setHover(hitId ?? null);
        }
      } else if (hoveredId !== null) {
        // Clear shape hover when hovering ruler
        setHover(null);
      }
    },
    [
      screenToWorld,
      library,
      rulers,
      hoveredId,
      hoveredRulerId,
      hoveredEndpoint,
      draggingEndpoint,
      setHover,
      setHoveredRuler,
      setHoveredEndpoint,
      updateRulerEndpoint,
      setMarqueePreviewIds,
      isDrawingMarquee,
      updateBox,
      zoom,
      offset,
      setPreviewIds,
      setSnapPoint,
    ],
  );

  /**
   * Handle mouse up - finalize endpoint drag or marquee selection.
   */
  const handleMouseUp = useCallback(() => {
    // Cancel any pending marquee-preview frame so it can't run after finalize.
    if (marqueePreviewRafRef.current !== 0) {
      cancelAnimationFrame(marqueePreviewRafRef.current);
      marqueePreviewRafRef.current = 0;
    }

    // Stop endpoint dragging if active
    if (draggingEndpoint) {
      const dragResult = endDraggingEndpoint();
      // Clear snap indicator
      setSnapPoint(null);
      // Create undo command for the endpoint move if there was actual movement
      if (dragResult && library && renderer) {
        const command = new MoveRulerEndpointCommand(
          dragResult.rulerId,
          dragResult.endpoint,
          dragResult.oldPosition,
          dragResult.newPosition,
        );
        useHistoryStore.getState().pushCommand(command);
      }
      return;
    }

    if (!isDrawingMarquee || !marqueeBox) {
      resetMarquee();
      setMarqueePreviewIds([]);
      return;
    }

    // Check if marquee is large enough to trigger selection
    const width = Math.abs(marqueeBox.width);
    const height = Math.abs(marqueeBox.height);

    if (width > MIN_MARQUEE_SIZE || height > MIN_MARQUEE_SIZE) {
      // Get screen bounds of marquee
      const screenMinX = Math.min(marqueeBox.x, marqueeBox.x + marqueeBox.width);
      const screenMaxX = Math.max(marqueeBox.x, marqueeBox.x + marqueeBox.width);
      const screenMinY = Math.min(marqueeBox.y, marqueeBox.y + marqueeBox.height);
      const screenMaxY = Math.max(marqueeBox.y, marqueeBox.y + marqueeBox.height);

      // Check for rulers in marquee
      const hitRulerIds = findRulersInScreenRect(
        screenMinX,
        screenMinY,
        screenMaxX,
        screenMaxY,
        rulers,
        zoom,
        offset,
      );

      // Convert screen box to world coordinates for shape selection
      const worldX1 = (screenMinX - offset.x) / zoom;
      const worldX2 = (screenMaxX - offset.x) / zoom;
      const worldY1 = (screenMinY - offset.y) / zoom;
      const worldY2 = (screenMaxY - offset.y) / zoom;

      // Ensure min/max are correct (handles Y-axis inversion if present)
      const worldMinX = Math.min(worldX1, worldX2);
      const worldMaxX = Math.max(worldX1, worldX2);
      const worldMinY = Math.min(worldY1, worldY2);
      const worldMaxY = Math.max(worldY1, worldY2);

      // Query library for intersecting elements, expanding to instance groups
      const rawHitIds = library
        ? library.hit_test_rect(worldMinX, worldMinY, worldMaxX, worldMaxY)
        : [];
      const hitIds = library ? expandAllToGroups(library, rawHitIds) : rawHitIds;

      // Also hit-test image overlays in the marquee rect
      const imageHitIds = hitTestImagesRect(worldMinX, worldMinY, worldMaxX, worldMaxY);

      // Add rulers to selection
      if (hitRulerIds.length > 0) {
        addRulerToSelection(hitRulerIds);
      }

      // Add all hit shapes + images to selection in a single batch operation
      // (selection was already cleared on mouseDown for plain drag,
      // or preserved for shift+drag)
      const allHitIds = [...hitIds, ...imageHitIds];
      if (allHitIds.length > 0) {
        const currentSelection = useSelectionStore.getState().selectedIds;
        const newSelection = new Set([...currentSelection, ...allHitIds]);
        useSelectionStore.getState().setSelection(newSelection);
      }
    }

    resetMarquee();
    setMarqueePreviewIds([]);
  }, [
    isDrawingMarquee,
    marqueeBox,
    library,
    renderer,
    rulers,
    zoom,
    offset,
    draggingEndpoint,
    addRulerToSelection,
    endDraggingEndpoint,
    resetMarquee,
    setMarqueePreviewIds,
    setSnapPoint,
  ]);

  /**
   * Handle mouse leave - clear hover and cancel marquee.
   */
  const handleMouseLeave = useCallback(() => {
    if (hoveredId !== null) {
      setHover(null);
    }
    if (hoveredRulerId !== null) {
      setHoveredRuler(null);
    }
    if (hoveredEndpoint !== null) {
      setHoveredEndpoint(null);
    }
    if (draggingEndpoint !== null) {
      setDraggingEndpoint(null);
    }
    resetMarquee();
    setMarqueePreviewIds([]);
  }, [
    hoveredId,
    hoveredRulerId,
    hoveredEndpoint,
    draggingEndpoint,
    setHover,
    setHoveredRuler,
    setHoveredEndpoint,
    setDraggingEndpoint,
    resetMarquee,
    setMarqueePreviewIds,
  ]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    selectedIds,
    hoveredId,
    hoveredRulerId,
    hoveredEndpoint,
    marqueeBox,
    isDrawingMarquee,
    previewIds,
  };
}
