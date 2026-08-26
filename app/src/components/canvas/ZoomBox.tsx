import type { ZoomBox as ZoomBoxType } from "@/stores/zoom";

const FILL_COLOR = "var(--theme-zoom-fill)";
const STROKE_COLOR = "var(--theme-zoom-stroke)";

interface ZoomBoxProps {
  /** The zoom box coordinates and dimensions. */
  box: ZoomBoxType;
}

/**
 * Renders the zoom marquee selection box overlay.
 *
 * Uses absolute positioning within the canvas container.
 * Handles negative width/height by normalizing coordinates.
 */
export function ZoomBox({ box }: ZoomBoxProps) {
  // Normalize coordinates to handle negative width/height
  const x = box.width >= 0 ? box.x : box.x + box.width;
  const y = box.height >= 0 ? box.y : box.y + box.height;
  const width = Math.abs(box.width);
  const height = Math.abs(box.height);

  // Don't render if box is too small
  if (width < 2 && height < 2) return null;

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: x,
        top: y,
        width,
        height,
        backgroundColor: FILL_COLOR,
        border: `1px solid ${STROKE_COLOR}`,
      }}
    />
  );
}
