import { create } from "zustand";
import { ZOOM_PADDING_PERCENT } from "@/lib/constants";

/**
 * Viewport state for camera control.
 *
 * Matches rosette-web's coordinate system:
 * - zoom: pixels per world unit (higher = more zoomed in)
 * - offset: screen position of world origin in pixels
 * - screenPos = worldPos * zoom + offset
 */
/** Bounds in world coordinates. */
interface WorldBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface ViewportState {
  /** Zoom level (pixels per world unit). Higher = more zoomed in. */
  zoom: number;
  /** Screen position of world origin in pixels. */
  offset: { x: number; y: number };
  /** Whether the viewport has been initialized. */
  initialized: boolean;

  /** Set zoom level. */
  setZoom: (zoom: number) => void;
  /** Zoom by a factor around a screen point. */
  zoomAt: (factor: number, screenX: number, screenY: number) => void;
  /** Pan by a delta in screen pixels. */
  pan: (dx: number, dy: number) => void;
  /** Set offset directly. */
  setOffset: (x: number, y: number) => void;
  /** Reset to default view (origin at screen center). */
  reset: (canvasWidth: number, canvasHeight: number) => void;
  /** Initialize offset to center origin on screen (only runs once). */
  initOffset: (canvasWidth: number, canvasHeight: number) => void;
  /** Zoom to fit the given world bounds with padding.
   * Optional screenCenter overrides where the bounds are centered on screen
   * (defaults to canvas center). Used to account for floating panels. */
  zoomToBounds: (
    bounds: WorldBounds,
    canvasWidth: number,
    canvasHeight: number,
    screenCenter?: { x: number; y: number },
  ) => void;
  /** Zoom to fit all objects, or reset to default if no bounds provided. */
  zoomToFit: (
    bounds: WorldBounds | null,
    canvasWidth: number,
    canvasHeight: number,
    screenCenter?: { x: number; y: number },
  ) => void;
  /** Zoom to fit selected objects (no-op if no bounds provided). */
  zoomToSelected: (
    bounds: WorldBounds | null,
    canvasWidth: number,
    canvasHeight: number,
    screenCenter?: { x: number; y: number },
  ) => void;
  /** Center view on bounds without changing zoom level. */
  centerOnBounds: (
    bounds: WorldBounds,
    canvasWidth: number,
    canvasHeight: number,
    screenCenter?: { x: number; y: number },
  ) => void;
}

/**
 * Grid size: pixels per grid point at zoom=1.
 * Each grid point represents 1 nanometer.
 * Matches rosette-web for consistent scaling.
 */
const GRID_SIZE = 50;

/** Default zoom level. Matches rosette-web: 2^-6 = 0.015625 */
const DEFAULT_ZOOM = Math.pow(2, -6);

/** Zoom bounds. MIN_ZOOM prevents grid rendering issues at extreme zoom-out levels. */
const MIN_ZOOM = 1e-18;
const MAX_ZOOM = 3;

export const useViewportStore = create<ViewportState>((set, get) => ({
  zoom: DEFAULT_ZOOM,
  offset: { x: 0, y: 0 }, // Will be initialized when canvas mounts
  initialized: false,

  setZoom: (zoom) =>
    set({
      zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom)),
    }),

  zoomAt: (factor, screenX, screenY) => {
    const state = get();
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.zoom * factor));

    // Calculate world position under cursor: worldPos = (screenPos - offset) / zoom
    const worldX = (screenX - state.offset.x) / state.zoom;
    const worldY = (screenY - state.offset.y) / state.zoom;

    // Calculate new offset to keep world position under cursor
    // screenPos = worldPos * newZoom + newOffset
    // newOffset = screenPos - worldPos * newZoom
    const newOffsetX = screenX - worldX * newZoom;
    const newOffsetY = screenY - worldY * newZoom;

    set({
      zoom: newZoom,
      offset: { x: newOffsetX, y: newOffsetY },
    });
  },

  pan: (dx, dy) =>
    set((state) => ({
      offset: {
        x: state.offset.x + dx,
        y: state.offset.y + dy,
      },
    })),

  setOffset: (x, y) => set({ offset: { x, y } }),

  reset: (canvasWidth, canvasHeight) =>
    set({
      zoom: DEFAULT_ZOOM,
      offset: { x: canvasWidth / 2, y: canvasHeight / 2 },
      initialized: true,
    }),

  initOffset: (canvasWidth, canvasHeight) => {
    const state = get();
    // Only initialize once - use explicit flag instead of checking offset values
    // (offset {0,0} is a valid panned position)
    if (!state.initialized) {
      set({
        offset: { x: canvasWidth / 2, y: canvasHeight / 2 },
        initialized: true,
      });
    }
  },

  zoomToBounds: (bounds, canvasWidth, canvasHeight, screenCenter?) => {
    // Calculate bounds dimensions
    const baseWidth = Math.abs(bounds.maxX - bounds.minX);
    const baseHeight = Math.abs(bounds.maxY - bounds.minY);

    // Use minimum bounds size for points/lines to ensure they're visible
    // 1000 world units = 1 micron, provides reasonable context around the object
    const MIN_BOUNDS_SIZE = 1000;
    const effectiveWidth = Math.max(baseWidth, MIN_BOUNDS_SIZE);
    const effectiveHeight = Math.max(baseHeight, MIN_BOUNDS_SIZE);

    const paddingX = effectiveWidth * ZOOM_PADDING_PERCENT;
    const paddingY = effectiveHeight * ZOOM_PADDING_PERCENT;
    const width = effectiveWidth + paddingX * 2;
    const height = effectiveHeight + paddingY * 2;

    // Center of bounds in world coordinates
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    // Calculate zoom to fit bounds in canvas (clamped to valid range)
    const zoomX = canvasWidth / width;
    const zoomY = canvasHeight / height;
    const newZoom = Math.max(MIN_ZOOM, Math.min(zoomX, zoomY, MAX_ZOOM));

    // Calculate offset to center bounds on screen
    // screenPos = worldPos * zoom + offset
    // offset = screenCenter - worldCenter * zoom
    const cx = screenCenter ? screenCenter.x : canvasWidth / 2;
    const cy = screenCenter ? screenCenter.y : canvasHeight / 2;
    const newOffset = {
      x: cx - centerX * newZoom,
      y: cy - centerY * newZoom,
    };

    set({
      zoom: newZoom,
      offset: newOffset,
    });
  },

  zoomToFit: (bounds, canvasWidth, canvasHeight, screenCenter?) => {
    if (bounds) {
      get().zoomToBounds(bounds, canvasWidth, canvasHeight, screenCenter);
    } else {
      // No objects - reset to default view, centering on visible area
      const cx = screenCenter ? screenCenter.x : canvasWidth / 2;
      const cy = screenCenter ? screenCenter.y : canvasHeight / 2;
      set({
        zoom: DEFAULT_ZOOM,
        offset: { x: cx, y: cy },
        initialized: true,
      });
    }
  },

  zoomToSelected: (bounds, canvasWidth, canvasHeight, screenCenter?) => {
    // Only zoom if we have bounds (i.e., there's a selection)
    if (bounds) {
      get().zoomToBounds(bounds, canvasWidth, canvasHeight, screenCenter);
    }
    // No-op if no selection
  },

  centerOnBounds: (bounds, canvasWidth, canvasHeight, screenCenter?) => {
    const state = get();

    // Center of bounds in world coordinates
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    // Calculate offset to center bounds on screen (keep current zoom)
    // screenPos = worldPos * zoom + offset
    // offset = screenCenter - worldCenter * zoom
    const cx = screenCenter ? screenCenter.x : canvasWidth / 2;
    const cy = screenCenter ? screenCenter.y : canvasHeight / 2;
    const newOffset = {
      x: cx - centerX * state.zoom,
      y: cy - centerY * state.zoom,
    };

    set({ offset: newOffset });
  },
}));

// Export constants and types for use elsewhere
export { GRID_SIZE, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM };
export type { WorldBounds };

/**
 * When running inside an iframe (embed mode), broadcast viewport changes to
 * the parent frame so the host page can render a synced background dot grid.
 */
if (typeof window !== "undefined" && window.parent !== window) {
  const postViewport = (state: ViewportState) => {
    window.parent.postMessage(
      {
        type: "rosette-viewport",
        zoom: state.zoom,
        offsetX: state.offset.x,
        offsetY: state.offset.y,
      },
      "*",
    );
  };

  // Broadcast on every state change
  useViewportStore.subscribe(postViewport);

  // Also broadcast the initial state so the host page can render immediately
  postViewport(useViewportStore.getState());
}
