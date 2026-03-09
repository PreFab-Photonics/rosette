import { useEffect, useRef, useCallback, useState } from "react";
import { useRenderer } from "./use-renderer";
import { useViewportStore, GRID_SIZE, type WorldBounds } from "@/stores/viewport";
import { useUIStore } from "@/stores/ui";
import { useToolStore } from "@/stores/tool";
import { useSelectionStore } from "@/stores/selection";
import { useContextMenuStore } from "@/stores/context-menu";
import { useRulerStore } from "@/stores/ruler";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useExplorerStore } from "@/stores/explorer";
import { useCellDragStore } from "@/stores/cell-drag";

// Note: useSelectionStore is used via getState() in handleContextMenu
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useLaser } from "@/hooks/use-laser";
import { useZoom } from "@/hooks/use-zoom";
import { useRectangle } from "@/hooks/use-rectangle";
import { usePolygon } from "@/hooks/use-polygon";
import { useSelection } from "@/hooks/use-selection";
import { useMove } from "@/hooks/use-move";
import { useText } from "@/hooks/use-text";

import { useLibrary } from "@/hooks/use-library";
import { useLayerStore } from "@/stores/layer";
import { useHistoryStore } from "@/stores/history";
import { useWasm } from "@/hooks/use-wasm";
import { useRuler } from "@/hooks/use-ruler";
import { AddCellRefCommand } from "@/lib/commands";
import { getEffectiveViewport } from "@/lib/utils";
import { LaserCursor } from "@/components/canvas/LaserCursor";
import { ZoomBox } from "@/components/canvas/ZoomBox";
import { MarqueeBox } from "@/components/canvas/MarqueeBox";
import { PolygonPreview } from "@/components/canvas/PolygonPreview";
import { RulerOverlay } from "@/components/canvas/RulerOverlay";
import { InstanceLabels } from "@/components/canvas/InstanceLabels";
import { TextOverlay } from "@/components/canvas/TextOverlay";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { ZOOM_IN_FACTOR, ZOOM_OUT_FACTOR } from "@/lib/constants";

const CANVAS_ID = "rosette-canvas";

/**
 * Main canvas component for rendering the layout.
 *
 * Hosts the WebGPU surface and handles user interactions
 * (pan, zoom, resize).
 */
export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const currentMouseWorld = useRef<{ x: number; y: number } | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // WASM and library
  const { wasm, isReady: isWasmReady } = useWasm();

  // Only create renderer after canvas is sized
  const { renderer, isReady, render, resize, screenToWorld, error } = useRenderer(
    canvasReady ? CANVAS_ID : null,
  );

  // Library for shape storage (uses rosette-core types)
  const { library } = useLibrary(wasm, isWasmReady);

  // Sync WASM refs into store for cross-tree access (palette commands, etc.)
  useEffect(() => {
    useWasmContextStore.getState().setLibrary(library);
    return () => useWasmContextStore.getState().setLibrary(null);
  }, [library]);
  useEffect(() => {
    useWasmContextStore.getState().setRenderer(renderer);
    return () => useWasmContextStore.getState().setRenderer(null);
  }, [renderer]);

  const { zoomAt, pan, initOffset, zoom, offset } = useViewportStore();
  const setCursorWorld = useUIStore((s) => s.setCursorWorld);
  const theme = useUIStore((s) => s.theme);
  const activeTool = useToolStore((s) => s.activeTool);

  // Laser pointer integration
  const {
    handleMouseDown: handleLaserMouseDown,
    handleMouseMove: handleLaserMouseMove,
    handleMouseUp: handleLaserMouseUp,
    isLaserActive,
  } = useLaser(renderer, isReady);

  // Zoom tool integration
  const {
    handleMouseDown: handleZoomMouseDown,
    handleMouseMove: handleZoomMouseMove,
    handleMouseUp: handleZoomMouseUp,
    box: zoomBox,
    isZoomActive,
    isDrawingZoom,
  } = useZoom(canvasRef);

  // Rectangle tool integration (now uses library + renderer)
  const {
    handleMouseDown: handleRectMouseDown,
    handleMouseMove: handleRectMouseMove,
    finalizeRectangle,
    cancelDrawing: cancelRectDrawing,
  } = useRectangle(screenToWorld, library, renderer);

  // Selection tool integration
  const {
    handleMouseDown: handleSelectMouseDown,
    handleMouseMove: handleSelectMouseMove,
    handleMouseUp: handleSelectMouseUp,
    handleMouseLeave: handleSelectMouseLeave,
    hoveredId: selectHoveredId,
    hoveredRulerId: selectHoveredRulerId,
    marqueeBox,
    isDrawingMarquee,
  } = useSelection(screenToWorld, library, renderer);

  // Move tool integration
  const {
    handleMouseDown: handleMoveMouseDown,
    handleMouseMove: handleMoveMouseMove,
    handleMouseUp: handleMoveMouseUp,
    handleMouseLeave: handleMoveMouseLeave,
    hoveredRulerId: moveHoveredRulerId,
  } = useMove(screenToWorld, library, renderer);

  // Polygon tool integration
  const {
    handleMouseDown: handlePolyMouseDown,
    handleMouseMove: handlePolyMouseMove,
    cancelDrawing: cancelPolyDrawing,
    points: polyPoints,
    cursorPoint: polyCursorPoint,
    isNearStart: polyIsNearStart,
    alignmentGuides: polyAlignmentGuides,
  } = usePolygon(screenToWorld, library, renderer, zoom);

  // Ruler tool integration
  const {
    handleMouseDown: handleRulerMouseDown,
    handleMouseMove: handleRulerMouseMove,
    handleMouseUp: handleRulerMouseUp,
    cancelDrawing: cancelRulerDrawing,
    isCreating: isCreatingRuler,
    isDraggingEndpoint: isDraggingRulerEndpoint,
    isMovingRuler,
    hoveredRulerId,
  } = useRuler(screenToWorld, library, renderer, zoom, offset);

  // Text tool integration
  const {
    handleMouseDown: handleTextMouseDown,
    handleMouseMove: handleTextMouseMove,
    cancelEditing: cancelTextEditing,
    isEditing: isEditingText,
  } = useText(screenToWorld, library, renderer);

  // Handle resize and signal when canvas is ready
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width > 0 && height > 0) {
        // Account for devicePixelRatio for sharp rendering on HiDPI/retina displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Initialize offset to center origin on screen (use CSS pixels)
        initOffset(width, height);

        // Signal that canvas is ready for renderer creation
        if (!canvasReady) {
          setCanvasReady(true);
        }

        // Pass physical pixel size to renderer, then render immediately
        // to avoid flicker (setting canvas.width/height clears the bitmap,
        // so we must repaint before the browser composites the blank frame)
        resize(Math.floor(width * dpr), Math.floor(height * dpr));
        render();
      }
    };

    // Initial size
    updateSize();

    // Watch for container resize
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [resize, render, canvasReady, initOffset]);

  // Render loop
  useEffect(() => {
    if (!isReady) return;

    let animationId: number;

    const loop = () => {
      render();
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationId);
  }, [isReady, render]);

  // Sync library to renderer when library or layer colors/visibility change
  const layers = useLayerStore((s) => s.layers);
  useEffect(() => {
    if (!renderer || !library) return;
    renderer.sync_from_library(library);
    renderer.mark_dirty();
  }, [renderer, library, layers]);

  // Switch the WASM library's active cell when the explorer selection changes
  const activeCell = useExplorerStore((s) => s.activeCell);
  useEffect(() => {
    if (!library || !renderer || !activeCell) return;
    const current = library.active_cell_name();
    if (current !== activeCell) {
      library.set_active_cell(activeCell);
      renderer.sync_from_library(library);
      renderer.mark_dirty();

      // Zoom to fit the new cell
      const canvas = canvasRef.current;
      if (canvas) {
        const boundsArray = library.get_all_bounds();
        const vp = getEffectiveViewport(canvas);
        if (boundsArray && vp.width > 0 && vp.height > 0) {
          const bounds: WorldBounds = {
            minX: boundsArray[0],
            minY: boundsArray[1],
            maxX: boundsArray[2],
            maxY: boundsArray[3],
          };
          useViewportStore.getState().zoomToFit(bounds, vp.width, vp.height, vp.screenCenter);
        }
      }
    }
  }, [library, renderer, activeCell]);

  // Update hierarchy depth limit for CellRef rendering
  const hierarchyLevelLimit = useExplorerStore((s) => s.hierarchyLevelLimit);
  useEffect(() => {
    if (!library || !renderer) return;
    // Convert from UI semantics (Infinity = all) to WASM semantics (0 = unlimited)
    const wasmLimit = hierarchyLevelLimit === Infinity ? 0 : hierarchyLevelLimit;
    library.set_hierarchy_depth_limit(wasmLimit);
    renderer.sync_from_library(library);
    renderer.mark_dirty();
  }, [library, renderer, hierarchyLevelLimit]);

  // Track if we've done the initial zoom-to-fit
  const hasInitialZoom = useRef(false);
  // Track the library instance to detect design mode reloads
  const lastLibraryRef = useRef<typeof library>(null);

  // Zoom to fit on initial load and when design updates (in design mode)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!library || !canvas) return;

    const boundsArray = library.get_all_bounds();
    if (!boundsArray) return; // No content yet

    const bounds: WorldBounds = {
      minX: boundsArray[0],
      minY: boundsArray[1],
      maxX: boundsArray[2],
      maxY: boundsArray[3],
    };

    const vp = getEffectiveViewport(canvas);
    if (vp.width <= 0 || vp.height <= 0) return;

    const isDesignReload = lastLibraryRef.current !== null && lastLibraryRef.current !== library;
    const isInitialLoad = !hasInitialZoom.current;

    if (isInitialLoad || isDesignReload) {
      useViewportStore.getState().zoomToFit(bounds, vp.width, vp.height, vp.screenCenter);
      hasInitialZoom.current = true;
    }

    lastLibraryRef.current = library;
  }, [library]);

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Detect trackpad pinch-to-zoom: browsers set ctrlKey=true for pinch gestures
      // Also check for small deltaY values typical of trackpads
      const isTrackpadPinch = e.ctrlKey || Math.abs(e.deltaY) < 50;

      let factor: number;
      if (isTrackpadPinch) {
        // Smooth trackpad zoom: scale factor based on deltaY magnitude
        const sensitivity = 0.01;
        factor = Math.pow(2, -e.deltaY * sensitivity);
      } else {
        // Original mouse wheel behavior (unchanged)
        factor = e.deltaY > 0 ? ZOOM_OUT_FACTOR : ZOOM_IN_FACTOR;
      }

      zoomAt(factor, mouseX, mouseY);
    },
    [zoomAt],
  );

  // Mouse down - start dragging, laser, zoom, rectangle, or move
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Handle laser tool
      if (activeTool === "laser" && e.button === 0) {
        handleLaserMouseDown(e);
        return;
      }

      // Handle zoom tool
      if (activeTool === "zoom" && e.button === 0) {
        handleZoomMouseDown(e);
        return;
      }

      // Handle rectangle tool
      if (activeTool === "rectangle" && e.button === 0) {
        handleRectMouseDown(e);
        return;
      }

      // Handle select tool
      if (activeTool === "select" && e.button === 0) {
        handleSelectMouseDown(e);
        return;
      }

      // Handle move tool
      if (activeTool === "move" && e.button === 0) {
        handleMoveMouseDown(e);
        return;
      }

      // Handle polygon tool
      if (activeTool === "polygon" && e.button === 0) {
        handlePolyMouseDown(e);
        return;
      }

      // Handle ruler tool
      if (activeTool === "ruler" && e.button === 0) {
        handleRulerMouseDown(e);
        return;
      }

      // Handle text tool
      if (activeTool === "text" && e.button === 0) {
        handleTextMouseDown(e);
        return;
      }

      // Middle button always pans, left button pans when pan tool active
      if (e.button === 1 || (e.button === 0 && activeTool === "pan")) {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [
      activeTool,
      handleLaserMouseDown,
      handleZoomMouseDown,
      handleRectMouseDown,
      handleSelectMouseDown,
      handleMoveMouseDown,
      handlePolyMouseDown,
      handleRulerMouseDown,
      handleTextMouseDown,
    ],
  );

  // RAF handle for batching cursor position updates (status bar doesn't need 120Hz)
  const cursorRafRef = useRef(0);
  useEffect(() => {
    return () => {
      if (cursorRafRef.current) cancelAnimationFrame(cursorRafRef.current);
    };
  }, []);

  // Mouse move - pan, laser, zoom, rectangle, move, or update cursor position
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Compute screen coordinates ONCE per event (avoids duplicate
      // getBoundingClientRect + subtraction in every tool handler).
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Track whether an active drawing tool handled this event.
      // If so, we'll render eagerly to minimize input-to-pixel latency.
      let needsEagerRender = false;

      // Handle laser tool movement
      if (activeTool === "laser") {
        handleLaserMouseMove(e);
      }

      // Handle zoom tool movement
      if (activeTool === "zoom") {
        handleZoomMouseMove(e);
      }

      // Handle rectangle tool movement (uses pre-computed screen coords).
      // Returns true if preview was updated (signals need for eager render).
      if (activeTool === "rectangle") {
        if (handleRectMouseMove(screenX, screenY)) {
          needsEagerRender = true;
        }
      }

      // Handle select tool hover
      if (activeTool === "select") {
        handleSelectMouseMove(e);
      }

      // Handle move tool
      if (activeTool === "move") {
        handleMoveMouseMove(e);
      }

      // Handle polygon tool movement
      if (activeTool === "polygon") {
        handlePolyMouseMove(e);
      }

      // Handle ruler tool movement
      if (activeTool === "ruler") {
        handleRulerMouseMove(e);
      }

      // Handle text tool movement
      if (activeTool === "text") {
        handleTextMouseMove(e);
      }

      // Compute world position once (shared with cursor display + rectangle finalization)
      const worldPos = screenToWorld(screenX, screenY);

      // Store current world position for rectangle finalization
      currentMouseWorld.current = worldPos;

      // Batch cursor position updates via RAF — the status bar doesn't need
      // updates faster than the display refresh rate. During active drawing,
      // this also avoids a Zustand write (and React re-render) on every event.
      if (cursorRafRef.current === 0) {
        cursorRafRef.current = requestAnimationFrame(() => {
          cursorRafRef.current = 0;
          const pos = currentMouseWorld.current;
          if (pos) {
            const gridX = Math.trunc(pos.x / GRID_SIZE);
            const gridY = Math.trunc(pos.y / GRID_SIZE);
            setCursorWorld({ x: gridX, y: -gridY });
          } else {
            setCursorWorld(null);
          }
        });
      }

      // Handle dragging
      if (isDragging) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        pan(dx, dy);
      }

      // Eager render: paint immediately after tool dispatch during active drawing.
      // This eliminates the worst-case wait (up to 16ms at 60Hz) for the next
      // RAF tick in the render loop. The RAF loop will still run but find
      // needs_render=false on most frames, so there's no double-paint.
      if (needsEagerRender) {
        render();
      }
    },
    [
      pan,
      screenToWorld,
      setCursorWorld,
      isDragging,
      activeTool,
      handleLaserMouseMove,
      handleZoomMouseMove,
      handleRectMouseMove,
      handleSelectMouseMove,
      handleMoveMouseMove,
      handlePolyMouseMove,
      handleRulerMouseMove,
      handleTextMouseMove,
      render,
    ],
  );

  // Mouse up - stop dragging, laser, zoom, rectangle, selection, or move
  const handleMouseUp = useCallback(() => {
    if (activeTool === "laser") {
      handleLaserMouseUp();
    }
    if (activeTool === "zoom") {
      handleZoomMouseUp();
    }
    if (activeTool === "rectangle" && currentMouseWorld.current) {
      // Finalize rectangle with current mouse position.
      // finalizeRectangle is a no-op if not currently drawing.
      finalizeRectangle(currentMouseWorld.current.x, currentMouseWorld.current.y);
    }
    if (activeTool === "select") {
      handleSelectMouseUp();
    }
    if (activeTool === "move") {
      handleMoveMouseUp();
    }
    if (activeTool === "ruler") {
      handleRulerMouseUp();
    }
    setIsDragging(false);
  }, [
    activeTool,
    handleLaserMouseUp,
    handleZoomMouseUp,
    finalizeRectangle,
    handleSelectMouseUp,
    handleMoveMouseUp,
    handleRulerMouseUp,
  ]);

  // Mouse leave - stop dragging, cancel rectangle, cancel polygon, cancel ruler, cancel text, clear hover, cancel move, and clear cursor
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    cancelRectDrawing();
    cancelPolyDrawing();
    cancelRulerDrawing();
    cancelTextEditing();
    handleSelectMouseLeave();
    handleMoveMouseLeave();
    // Cancel pending cursor RAF and clear immediately
    if (cursorRafRef.current) {
      cancelAnimationFrame(cursorRafRef.current);
      cursorRafRef.current = 0;
    }
    setCursorWorld(null);
  }, [
    setCursorWorld,
    cancelRectDrawing,
    cancelPolyDrawing,
    cancelRulerDrawing,
    cancelTextEditing,
    handleSelectMouseLeave,
    handleMoveMouseLeave,
  ]);

  // Context menu (right-click)
  const openContextMenu = useContextMenuStore((s) => s.open);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldPos = screenToWorld(screenX, screenY);

      if (!worldPos) return;

      // Check for ruler hit first (rulers are rendered on top)
      const { rulers, selectRuler } = useRulerStore.getState();
      for (const ruler of rulers.values()) {
        // Check if click is near the ruler line or inside the measurement box
        const startScreenX = ruler.start.x * zoom + offset.x;
        const startScreenY = ruler.start.y * zoom + offset.y;
        const endScreenX = ruler.end.x * zoom + offset.x;
        const endScreenY = ruler.end.y * zoom + offset.y;

        // Check measurement box (140x56 centered at midpoint)
        const midX = (startScreenX + endScreenX) / 2;
        const midY = (startScreenY + endScreenY) / 2;
        const boxHalfWidth = 70;
        const boxHalfHeight = 28;

        if (
          screenX >= midX - boxHalfWidth &&
          screenX <= midX + boxHalfWidth &&
          screenY >= midY - boxHalfHeight &&
          screenY <= midY + boxHalfHeight
        ) {
          selectRuler(ruler.id);
          openContextMenu("ruler", { x: e.clientX, y: e.clientY }, ruler.id);
          return;
        }

        // Check line proximity (8px threshold)
        const A = screenX - startScreenX;
        const B = screenY - startScreenY;
        const C = endScreenX - startScreenX;
        const D = endScreenY - startScreenY;
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        if (lenSq > 0) {
          const param = Math.max(0, Math.min(1, dot / lenSq));
          const closestX = startScreenX + param * C;
          const closestY = startScreenY + param * D;
          const dx = screenX - closestX;
          const dy = screenY - closestY;
          if (Math.sqrt(dx * dx + dy * dy) <= 8) {
            selectRuler(ruler.id);
            openContextMenu("ruler", { x: e.clientX, y: e.clientY }, ruler.id);
            return;
          }
        }
      }

      // Hit test to check if right-clicking on an element
      if (library) {
        const hitId = library.hit_test(worldPos.x, worldPos.y);

        if (hitId) {
          // Right-clicked on an element — expand to instance group
          const groupIds = library.get_group_ids(hitId);
          const { selectedIds, setSelection } = useSelectionStore.getState();
          // If the element's group isn't fully selected, select the group
          const allInSelection = groupIds.every((id: string) => selectedIds.has(id));
          if (!allInSelection) {
            setSelection(new Set(groupIds));
          }
          openContextMenu("element", { x: e.clientX, y: e.clientY }, hitId);
          return;
        }
      }

      // Right-clicked on empty canvas
      openContextMenu("canvas", { x: e.clientX, y: e.clientY });
    },
    [library, screenToWorld, openContextMenu, zoom, offset],
  );

  // ---------------------------------------------------------------------------
  // Cell instancing: custom drag from Explorer (no HTML5 drag-and-drop)
  // ---------------------------------------------------------------------------

  // Subscribe to the cell-drag store. When a drag is active, attach global
  // mousemove (to update the bounding-box preview) and mouseup (to place the
  // instance or cancel).
  const cellDragName = useCellDragStore((s) => s.cellName);
  const dragLabelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cellDragName) return;

    const canvas = canvasRef.current;
    if (!canvas || !renderer || !library) return;

    const { bounds, origin } = useCellDragStore.getState();

    const handleMouseMove = (e: MouseEvent) => {
      if (!bounds) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const worldPos = screenToWorld(mouseX, mouseY);
      if (!worldPos) return;

      // Offset the bounding box so the cell's origin is under the cursor
      const dx = worldPos.x - origin.x;
      const dy = worldPos.y - origin.y;

      const minX = bounds[0] + dx;
      const minY = bounds[1] + dy;
      const maxX = bounds[2] + dx;
      const maxY = bounds[3] + dy;

      const points = new Float64Array([minX, minY, maxX, minY, maxX, maxY, minX, maxY]);
      // Zero fill alpha — outline only (the renderer always draws preview borders)
      const color = new Float32Array([0.5, 0.5, 0.5, 0.0]);

      renderer.set_preview_shape(points, color);

      // Show origin cross at the cursor position (where the cell origin will land).
      // Convert 9 CSS pixels to world units using current zoom.
      const { zoom: currentZoom, offset: currentOffset } = useViewportStore.getState();
      const armWorld = 9 / currentZoom;
      // Match InstanceLabels cross color: white 50% on dark, black 50% on light
      const isDarkTheme = useUIStore.getState().theme === "dark";
      const crossColor = isDarkTheme
        ? new Float32Array([1.0, 1.0, 1.0, 0.5])
        : new Float32Array([0.0, 0.0, 0.0, 0.5]);
      renderer.set_preview_origin(worldPos.x, worldPos.y, armWorld, crossColor);
      renderer.mark_dirty();

      // Position the cell name label at the top-left of the bounding box (screen space)
      if (dragLabelRef.current) {
        const screenX = minX * currentZoom + currentOffset.x;
        const screenY = minY * currentZoom + currentOffset.y;
        dragLabelRef.current.style.transform = `translate(${screenX}px, ${screenY}px) translateY(-100%)`;
        dragLabelRef.current.style.display = "block";
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const worldPos = screenToWorld(mouseX, mouseY);

      // Clear preview
      renderer.clear_preview();
      renderer.mark_dirty();

      // Only place if the cursor is within the canvas bounds
      const inCanvas = mouseX >= 0 && mouseY >= 0 && mouseX <= rect.width && mouseY <= rect.height;

      if (worldPos && inCanvas) {
        // Validate: can we instance this cell in the active cell?
        const activeCell = library.active_cell_name();
        if (
          activeCell &&
          activeCell !== cellDragName &&
          library.can_instance_cell(activeCell, cellDragName)
        ) {
          const command = new AddCellRefCommand(cellDragName, worldPos.x, worldPos.y);
          useHistoryStore.getState().execute(command, { library, renderer });
        }
      }

      useCellDragStore.getState().endDrag();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      // Clean up preview if the effect is torn down while a drag is active
      renderer.clear_preview();
      renderer.mark_dirty();
    };
  }, [cellDragName, library, renderer, screenToWorld]);

  // Attach wheel listener (need passive: false)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Keyboard shortcuts (zoom, pan, tool selection, zoom-to-fit, undo/redo)
  useKeyboardShortcuts(canvasRef, library, renderer);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-red-950 text-red-200">
        <div className="text-center">
          <p className="text-lg font-semibold">Failed to initialize renderer</p>
          <p className="mt-2 text-sm opacity-75">{error.message}</p>
          <p className="mt-4 text-xs opacity-50">
            WebGPU may not be supported in your browser. Try Chrome 113+, Safari 17+, or Edge 113+.
          </p>
        </div>
      </div>
    );
  }

  // Determine cursor based on current tool and state
  const getCursorClass = () => {
    if (isDragging || isMovingRuler) return "cursor-grabbing";
    if (activeTool === "pan") return "cursor-grab";
    if (activeTool === "move") {
      if (moveHoveredRulerId) return "cursor-move";
      return "cursor-move";
    }
    if (isLaserActive) return "cursor-none";
    if (isZoomActive) return "cursor-crosshair";
    if (activeTool === "rectangle" || activeTool === "polygon") return "cursor-crosshair";
    if (activeTool === "text") return isEditingText ? "cursor-text" : "cursor-crosshair";
    if (activeTool === "ruler") {
      if (isDraggingRulerEndpoint) return "cursor-grabbing";
      if (isCreatingRuler) return "cursor-crosshair";
      if (hoveredRulerId) return "cursor-pointer";
      return "cursor-crosshair";
    }
    if (activeTool === "select") {
      if (isDrawingMarquee) return "cursor-crosshair";
      if (selectHoveredRulerId || selectHoveredId) return "cursor-pointer";
    }
    return "cursor-default";
  };
  const cursorClass = getCursorClass();

  return (
    <div ref={containerRef} className="relative h-full w-full select-none overflow-hidden">
      <canvas
        ref={canvasRef}
        id={CANVAS_ID}
        className={cursorClass}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
      />
      {isLaserActive && !isDragging && <LaserCursor />}
      {isDrawingZoom && zoomBox && <ZoomBox box={zoomBox} />}
      {isDrawingMarquee && marqueeBox && <MarqueeBox box={marqueeBox} />}
      {activeTool === "polygon" && polyPoints.length > 0 && (
        <PolygonPreview
          points={polyPoints}
          cursorPoint={polyCursorPoint}
          isNearStart={polyIsNearStart}
          alignmentGuides={polyAlignmentGuides}
        />
      )}
      {/* Cell name label during drag-to-instance */}
      {cellDragName && (
        <div
          ref={dragLabelRef}
          className={`pointer-events-none absolute top-0 left-0 text-[13px] leading-none font-mono select-none ${theme === "dark" ? "text-white" : "text-black"}`}
          style={{ display: "none", paddingBottom: "2px" }}
        >
          {cellDragName}
        </div>
      )}
      <InstanceLabels />
      <TextOverlay />
      <RulerOverlay />
      <ContextMenu library={library} renderer={renderer} canvasRef={canvasRef} />
    </div>
  );
}
