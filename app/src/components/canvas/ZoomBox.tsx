import type { ZoomBox as ZoomBoxType } from "@/stores/zoom";

/** Zoom box fill color (green with 10% opacity). */
const FILL_COLOR = "rgba(46, 229, 120, 0.1)";
/** Zoom box stroke color (green with 60% opacity). */
const STROKE_COLOR = "rgba(46, 229, 120, 0.6)";

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
