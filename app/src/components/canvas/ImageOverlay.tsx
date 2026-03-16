import { useViewportStore } from "@/stores/viewport";
import { useImageStore, imageKeyToId, type ImageEntry } from "@/stores/image";
import { useSelectionStore } from "@/stores/selection";
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
// Main overlay
// ---------------------------------------------------------------------------

/**
 * HTML overlay for rendering reference images on top of the WebGPU canvas.
 *
 * Images are positioned in world coordinates and scale with viewport
 * zoom. They render below geometry overlays (text, rulers) but above
 * the WebGPU canvas.
 *
 * Selection and hover state is read from the unified selection store
 * (using "img:"-prefixed IDs), so images participate in the same
 * click/marquee/hover system as WASM elements.
 */
export function ImageOverlay() {
  const { zoom, offset } = useViewportStore();
  const images = useImageStore((s) => s.images);
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const hoveredId = useSelectionStore((s) => s.hoveredId);
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  if (images.size === 0) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden")}>
      {[...images.values()].map((entry) => {
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
