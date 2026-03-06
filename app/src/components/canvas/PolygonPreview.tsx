import { useViewportStore } from "@/stores/viewport";
import { useLayerStore } from "@/stores/layer";
import { SELECTION_COLORS } from "@/stores/ui";
import type { AlignmentGuides } from "@/hooks/use-polygon";

/**
 * A point in world coordinates.
 */
interface Point {
  x: number;
  y: number;
}

interface PolygonPreviewProps {
  /** The polygon points in world coordinates. */
  points: Point[];
  /** The current cursor position in world coordinates. */
  cursorPoint: Point | null;
  /** Whether cursor is near the start point. */
  isNearStart: boolean;
  /** Alignment guide info for rendering guide lines. */
  alignmentGuides?: AlignmentGuides | null;
}

/**
 * Renders the polygon preview as an SVG overlay with dashed lines.
 *
 * Shows placed vertices as dots and edges as dashed lines.
 * The line from the last point to cursor is also dashed.
 * Shows a subtle snap indicator when near the start point.
 * Shows alignment guide lines when cursor aligns with existing vertices.
 */
export function PolygonPreview({
  points,
  cursorPoint,
  isNearStart,
  alignmentGuides,
}: PolygonPreviewProps) {
  const { zoom, offset } = useViewportStore();
  const activeLayerId = useLayerStore((s) => s.activeLayerId);
  const layers = useLayerStore((s) => s.layers);

  // Get layer color
  const layer = layers.get(activeLayerId);
  const strokeColor = layer?.color ?? "#888888";

  // Convert world coordinates to screen coordinates
  const worldToScreen = (p: Point) => ({
    x: p.x * zoom + offset.x,
    y: p.y * zoom + offset.y,
  });

  // Nothing to render if no points
  if (points.length === 0) return null;

  // Build the path including cursor point if available
  const allPoints = cursorPoint ? [...points, cursorPoint] : points;
  const screenPoints = allPoints.map(worldToScreen);

  // Build SVG path for the polygon edges
  const pathD = screenPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Close path back to start if we have 3+ points (to show the closing edge)
  // Only show closing path when polygon can actually be closed (3+ points)
  const closingPath =
    points.length >= 3 && cursorPoint
      ? `M ${screenPoints[screenPoints.length - 1].x} ${screenPoints[screenPoints.length - 1].y} L ${screenPoints[0].x} ${screenPoints[0].y}`
      : "";

  // Start point screen position for snap indicator
  const startScreenPoint = screenPoints[0];

  // Compute alignment guide lines (from aligned vertex to cursor)
  const cursorScreen = cursorPoint ? worldToScreen(cursorPoint) : null;
  const alignedXScreen = alignmentGuides?.alignedVertexX
    ? worldToScreen(alignmentGuides.alignedVertexX)
    : null;
  const alignedYScreen = alignmentGuides?.alignedVertexY
    ? worldToScreen(alignmentGuides.alignedVertexY)
    : null;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {/* Alignment guide lines - use selection green */}
      {cursorScreen && alignedXScreen && (
        <line
          x1={alignedXScreen.x}
          y1={alignedXScreen.y}
          x2={cursorScreen.x}
          y2={cursorScreen.y}
          stroke={SELECTION_COLORS.dark}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.5}
        />
      )}
      {cursorScreen && alignedYScreen && (
        <line
          x1={alignedYScreen.x}
          y1={alignedYScreen.y}
          x2={cursorScreen.x}
          y2={cursorScreen.y}
          stroke={SELECTION_COLORS.dark}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.5}
        />
      )}

      {/* Snap indicator ring around start point when near */}
      {isNearStart && (
        <circle
          cx={startScreenPoint.x}
          cy={startScreenPoint.y}
          r={9}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          opacity={0.5}
          className="animate-pulse"
        />
      )}

      {/* Main polygon edges */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeDasharray="6 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Closing edge preview (from cursor back to start) - highlighted when near */}
      {closingPath && (
        <path
          d={closingPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={isNearStart ? 2 : 1}
          strokeDasharray={isNearStart ? "none" : "4 4"}
          strokeLinecap="round"
          opacity={isNearStart ? 0.8 : 0.5}
        />
      )}

      {/* Vertex dots for placed points */}
      {points.map((_, i) => {
        const sp = screenPoints[i];
        return (
          <circle
            key={i}
            cx={sp.x}
            cy={sp.y}
            r={i === 0 ? 4 : 2.5}
            fill={i === 0 ? strokeColor : "white"}
            stroke={strokeColor}
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
}
