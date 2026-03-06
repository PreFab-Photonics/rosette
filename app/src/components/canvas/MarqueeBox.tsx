import type { MarqueeBox as MarqueeBoxType } from "@/stores/marquee";

/** Marquee box fill color (blue with 10% opacity). */
const FILL_COLOR = "rgba(59, 130, 246, 0.1)";
/** Marquee box stroke color (blue with 60% opacity). */
const STROKE_COLOR = "rgba(59, 130, 246, 0.6)";

interface MarqueeBoxProps {
  /** The marquee box coordinates and dimensions. */
  box: MarqueeBoxType;
}

/**
 * Renders the marquee selection box overlay.
 *
 * Uses absolute positioning within the canvas container.
 * Handles negative width/height by normalizing coordinates.
 */
export function MarqueeBox({ box }: MarqueeBoxProps) {
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
