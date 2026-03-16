import { create } from "zustand";

/**
 * Prefix for image overlay IDs.
 *
 * Image IDs use this prefix so the selection, hover, move, and delete
 * systems can distinguish images from WASM library elements without
 * needing special branches everywhere. Functions like `isImageId()` and
 * `imageIdToKey()` provide the mapping.
 */
export const IMAGE_ID_PREFIX = "img:";

/** Check if a selection/hover ID refers to an image overlay. */
export function isImageId(id: string): boolean {
  return id.startsWith(IMAGE_ID_PREFIX);
}

/** Extract the image store key from a prefixed image ID. */
export function imageIdToKey(id: string): string {
  return id.slice(IMAGE_ID_PREFIX.length);
}

/** Create a prefixed image ID from a store key. */
export function imageKeyToId(key: string): string {
  return IMAGE_ID_PREFIX + key;
}

/**
 * An image overlay entry positioned in world coordinates.
 *
 * Images are purely visual reference annotations — they are NOT
 * part of the GDS layout and will not be exported.
 */
export interface ImageEntry {
  /** Unique identifier (store key, without the "img:" prefix). */
  id: string;
  /** Object URL for rendering (created from file bytes). */
  url: string;
  /** Original filename for display in the inspector. */
  filename: string;
  /** World-coordinate X position (top-left corner). */
  x: number;
  /** World-coordinate Y position (top-left corner). */
  y: number;
  /** Width in world units. */
  width: number;
  /** Height in world units. */
  height: number;
  /** Original pixel width (for aspect ratio preservation). */
  naturalWidth: number;
  /** Original pixel height (for aspect ratio preservation). */
  naturalHeight: number;
  /** Whether aspect ratio is locked when resizing. Defaults to true. */
  lockAspectRatio: boolean;
}

/**
 * Hit-test a world-coordinate point against all images.
 *
 * Returns the prefixed ID (e.g., "img:abc-123") of the topmost hit image,
 * or null if no image contains the point. When multiple images overlap,
 * the one with the smallest area wins (same heuristic as WASM hit_test).
 */
export function hitTestImages(worldX: number, worldY: number): string | null {
  const { images } = useImageStore.getState();
  let bestId: string | null = null;
  let bestArea = Infinity;

  for (const entry of images.values()) {
    if (
      worldX >= entry.x &&
      worldX <= entry.x + entry.width &&
      worldY >= entry.y &&
      worldY <= entry.y + entry.height
    ) {
      const area = entry.width * entry.height;
      if (area < bestArea) {
        bestArea = area;
        bestId = imageKeyToId(entry.id);
      }
    }
  }

  return bestId;
}

/**
 * Hit-test a world-coordinate rectangle against all images.
 *
 * Returns prefixed IDs of all images whose bounds overlap the query rect.
 */
export function hitTestImagesRect(
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
): string[] {
  const { images } = useImageStore.getState();
  const result: string[] = [];

  for (const entry of images.values()) {
    const imgMaxX = entry.x + entry.width;
    const imgMaxY = entry.y + entry.height;

    // AABB overlap test
    if (entry.x <= maxX && imgMaxX >= minX && entry.y <= maxY && imgMaxY >= minY) {
      result.push(imageKeyToId(entry.id));
    }
  }

  return result;
}

/**
 * Image overlay state for managing reference images on the canvas.
 *
 * Images are ephemeral UI annotations (not persisted in GDS).
 * They're stored in world coordinates and rendered as HTML overlays.
 *
 * Selection and hover are handled through the unified selection store
 * (using "img:"-prefixed IDs), not through a separate field here.
 */
interface ImageState {
  /** All images, keyed by ID (without prefix). */
  images: Map<string, ImageEntry>;

  /** Add an image entry. */
  addImage: (entry: ImageEntry) => void;
  /** Remove an image by ID (store key, without prefix). */
  removeImage: (id: string) => void;
  /** Update an existing image's properties. */
  updateImage: (id: string, updates: Partial<ImageEntry>) => void;
  /** Remove all images. */
  clearImages: () => void;
}

export const useImageStore = create<ImageState>((set, get) => ({
  images: new Map(),

  addImage: (entry) => {
    const next = new Map(get().images);
    next.set(entry.id, entry);
    set({ images: next });
  },

  removeImage: (id) => {
    const next = new Map(get().images);
    next.delete(id);
    set({ images: next });
  },

  updateImage: (id, updates) => {
    const next = new Map(get().images);
    const existing = next.get(id);
    if (existing) {
      next.set(id, { ...existing, ...updates });
      set({ images: next });
    }
  },

  clearImages: () => {
    // Revoke all object URLs to free memory
    for (const entry of get().images.values()) {
      URL.revokeObjectURL(entry.url);
    }
    set({ images: new Map() });
  },
}));
