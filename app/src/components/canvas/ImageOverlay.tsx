import { useEffect, useMemo, useRef } from "react";
import { useViewportStore } from "@/stores/viewport";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import { useImageStore, imageKeyToId, type ImageEntry } from "@/stores/image";
import { useSelectionStore } from "@/stores/selection";
import { useExplorerStore } from "@/stores/explorer";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Single image element
// ---------------------------------------------------------------------------

/**
 * Renders a single image positioned in world coordinates.
 *
 * Selection and hover outlines are drawn based on the unified
 * selection store (using "img:"-prefixed IDs).
 */
function ImageElement({
  entry,
  zoom,
  offset,
  isSelected,
  isHovered,
  isDark,
}: {
  entry: ImageEntry;
  zoom: number;
  offset: { x: number; y: number };
  isSelected: boolean;
  isHovered: boolean;
  isDark: boolean;
}) {
  const screenX = entry.x * zoom + offset.x;
  const screenY = entry.y * zoom + offset.y;
  const screenWidth = entry.width * zoom;
  const screenHeight = entry.height * zoom;

  // Don't render if too small to see
  if (screenWidth < 1 && screenHeight < 1) return null;

  // Outline color: green for selected, white/black for hovered
  const showOutline = isSelected || isHovered;
  const outlineColor = isSelected
    ? "rgba(68, 255, 68, 0.8)"
    : isDark
      ? "rgba(255, 255, 255, 0.8)"
      : "rgba(0, 0, 0, 0.8)";

  return (
    <div
      className="pointer-events-none absolute top-0 left-0"
      style={{
        transform: `translate(${screenX}px, ${screenY}px)`,
        width: `${screenWidth}px`,
        height: `${screenHeight}px`,
      }}
    >
      <img
        src={entry.url}
        alt={entry.filename}
        className="block h-full w-full"
        style={{ objectFit: "fill" }}
        draggable={false}
      />
      {/* Selection / hover outline */}
      {showOutline && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            border: `1.5px solid ${outlineColor}`,
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Instance image element (read-only, transformed via affine)
// ---------------------------------------------------------------------------

/**
 * Renders an image from a child cell at a cell instance's transform.
 *
 * Uses CSS `matrix()` to apply the full affine transform, including
 * rotation, scale, and mirroring. Not interactive (no selection/hover).
 */
function InstanceImageElement({
  entry,
  transform,
  zoom,
  offset,
}: {
  entry: ImageEntry;
  /** Affine transform [a, b, c, d, tx, ty] in world coordinates. */
  transform: Float64Array;
  zoom: number;
  offset: { x: number; y: number };
}) {
  // The image's local position is (entry.x, entry.y) with size (entry.width, entry.height).
  // The instance transform maps local coords -> world coords.
  // CSS matrix(a, c, b, d, tx, ty) applies the affine in screen space.
  //
  // Strategy: position the image at the origin, apply a CSS matrix that:
  // 1. Translates by the image's local offset (entry.x, entry.y)
  // 2. Applies the instance affine transform
  // 3. Scales by viewport zoom
  // 4. Translates by viewport offset
  //
  // Combined: screenPos = zoom * (T * localPos) + viewportOffset
  // As CSS: translate(offset) * scale(zoom) * T * translate(entry.x, entry.y)
  const [a, b, c, d, tx, ty] = transform;

  // Compose: first translate by entry position, then apply instance transform
  // T * translate(ex, ey) = [a, b, c, d, a*ex + b*ey + tx, c*ex + d*ey + ty]
  const ex = entry.x;
  const ey = entry.y;
  const composedTx = a * ex + b * ey + tx;
  const composedTy = c * ex + d * ey + ty;

  // Now apply zoom and viewport offset
  const screenTx = composedTx * zoom + offset.x;
  const screenTy = composedTy * zoom + offset.y;
  const za = a * zoom;
  const zb = b * zoom;
  const zc = c * zoom;
  const zd = d * zoom;

  // Quick visibility check: estimate screen size
  const screenW = Math.abs(za * entry.width) + Math.abs(zb * entry.height);
  const screenH = Math.abs(zc * entry.width) + Math.abs(zd * entry.height);
  if (screenW < 1 && screenH < 1) return null;

  // CSS matrix(a, b, c, d, tx, ty) where CSS convention is:
  // | a  c  tx |   (column-major, so CSS params are: a, b, c, d, e, f
  // | b  d  ty |    where a=scaleX, b=skewY, c=skewX, d=scaleY, e=translateX, f=translateY)
  // Our affine: x' = a*x + b*y + tx, y' = c*x + d*y + ty
  // CSS matrix: x' = a*x + c*y + e, y' = b*x + d*y + f
  // So CSS params: (our_a, our_c, our_b, our_d, tx, ty)
  return (
    <div
      className="pointer-events-none absolute top-0 left-0"
      style={{
        width: `${entry.width}px`,
        height: `${entry.height}px`,
        transformOrigin: "0 0",
        transform: `matrix(${za}, ${zc}, ${zb}, ${zd}, ${screenTx}, ${screenTy})`,
      }}
    >
      <img
        src={entry.url}
        alt={entry.filename}
        className="block h-full w-full"
        style={{ objectFit: "fill" }}
        draggable={false}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main overlay
// ---------------------------------------------------------------------------

/** Cell context from WASM: a referenced cell name + its accumulated transform. */
interface CellContext {
  cellName: string;
  transform: Float64Array;
}

/**
 * HTML overlay for rendering reference images on top of the WebGPU canvas.
 *
 * Images are positioned in world coordinates and scale with viewport
 * zoom. They render below geometry overlays (text, rulers) but above
 * the WebGPU canvas.
 *
 * Renders images from:
 * 1. The active cell (selectable/hoverable via "img:" prefixed IDs)
 * 2. Child cells referenced by instances (read-only, affine transformed)
 *
 * Selection and hover state is read from the unified selection store
 * (using "img:"-prefixed IDs), so active-cell images participate in the
 * same click/marquee/hover system as WASM elements.
 */
export function ImageOverlay() {
  const { zoom, offset } = useViewportStore();
  const images = useImageStore((s) => s.images);
  const activeCell = useExplorerStore((s) => s.activeCell);
  const library = useWasmContextStore((s) => s.library);
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const hoveredId = useSelectionStore((s) => s.hoveredId);
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  // Re-read instance contexts when library content changes (undo/redo, cell switch).
  const undoCount = useHistoryStore((s) => s.undoStack.length);
  const redoCount = useHistoryStore((s) => s.redoStack.length);
  const renderer = useWasmContextStore((s) => s.renderer);

  // Track which cells have image bounds set in the WASM library,
  // so we can clear them when images are removed.
  const prevCellsRef = useRef<Set<string>>(new Set());

  // Sync per-cell image bounds to the WASM library so that instance
  // bounding boxes (selection outlines, zoom-to-fit) include images.
  useEffect(() => {
    if (!library || !renderer) return;

    // Compute bounds per cell from all images
    const cellBounds = new Map<string, [number, number, number, number]>();
    for (const entry of images.values()) {
      const existing = cellBounds.get(entry.cellName);
      if (existing) {
        existing[0] = Math.min(existing[0], entry.x);
        existing[1] = Math.min(existing[1], entry.y);
        existing[2] = Math.max(existing[2], entry.x + entry.width);
        existing[3] = Math.max(existing[3], entry.y + entry.height);
      } else {
        cellBounds.set(entry.cellName, [
          entry.x,
          entry.y,
          entry.x + entry.width,
          entry.y + entry.height,
        ]);
      }
    }

    // Clear bounds for cells that no longer have images
    for (const cellName of prevCellsRef.current) {
      if (!cellBounds.has(cellName)) {
        library.set_cell_image_bounds(cellName, null);
      }
    }

    // Set bounds for cells that have images
    for (const [cellName, bounds] of cellBounds) {
      library.set_cell_image_bounds(cellName, new Float64Array(bounds));
    }

    prevCellsRef.current = new Set(cellBounds.keys());

    // Re-sync renderer so cached instance bboxes are updated
    renderer.sync_from_library(library);
    renderer.mark_dirty();
  }, [images, library, renderer]);

  // Get instance cell contexts from WASM (recursive hierarchy walk).
  // Returns [(cellName, transform)] for all cells instanced by the active cell.
  const instanceContexts = useMemo((): CellContext[] => {
    if (!library) return [];
    try {
      return (library.get_instance_cell_contexts() as CellContext[]) ?? [];
    } catch {
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, activeCell, undoCount, redoCount]);

  // Collect images from child cells that have instances in the active cell.
  // Group by cellName for efficient lookup.
  const instanceImages = useMemo(() => {
    if (instanceContexts.length === 0 || images.size === 0) return [];

    // Build a map: cellName -> ImageEntry[]
    const cellImageMap = new Map<string, ImageEntry[]>();
    for (const entry of images.values()) {
      const list = cellImageMap.get(entry.cellName);
      if (list) {
        list.push(entry);
      } else {
        cellImageMap.set(entry.cellName, [entry]);
      }
    }

    // For each instance context, find matching images
    const result: { entry: ImageEntry; transform: Float64Array; key: string }[] = [];
    for (let i = 0; i < instanceContexts.length; i++) {
      const ctx = instanceContexts[i];
      const cellImages = cellImageMap.get(ctx.cellName);
      if (!cellImages) continue;
      for (const entry of cellImages) {
        result.push({
          entry,
          transform: ctx.transform,
          key: `inst-${i}-${entry.id}`,
        });
      }
    }
    return result;
  }, [instanceContexts, images]);

  if (images.size === 0 && instanceImages.length === 0) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden")}>
      {/* Instance images (from child cells, read-only) */}
      {instanceImages.map(({ entry, transform, key }) => (
        <InstanceImageElement
          key={key}
          entry={entry}
          transform={transform}
          zoom={zoom}
          offset={offset}
        />
      ))}
      {/* Active cell images (selectable/hoverable) */}
      {[...images.values()]
        .filter((entry) => entry.cellName === activeCell)
        .map((entry) => {
          const prefixedId = imageKeyToId(entry.id);
          return (
            <ImageElement
              key={entry.id}
              entry={entry}
              zoom={zoom}
              offset={offset}
              isSelected={selectedIds.has(prefixedId)}
              isHovered={hoveredId === prefixedId}
              isDark={isDark}
            />
          );
        })}
    </div>
  );
}
