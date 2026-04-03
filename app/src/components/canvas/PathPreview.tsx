import { useViewportStore } from "@/stores/viewport";
import { useLayerStore } from "@/stores/layer";
import { usePathStore } from "@/stores/path";
import { SELECTION_COLORS } from "@/stores/ui";
import { createRibbonPreview } from "@/lib/path";
import type { PathAlignmentGuides } from "@/hooks/use-path";

/**
 * A point in world coordinates.
 */
interface Point {
  x: number;
  y: number;
}

interface PathPreviewProps {
  /** Waypoints placed so far in world coordinates. */
  waypoints: Point[];
  /** Current cursor position in world coordinates. */
  cursorPoint: Point | null;
  /** Alignment guide info for rendering guide lines. */
  alignmentGuides?: PathAlignmentGuides | null;
}

/**
 * Renders the waveguide path preview as an SVG overlay.
 *
 * Shows:
 * - Semi-transparent ribbon polygon (waveguide width preview)
 * - Centerline path through waypoints (dashed)
 * - Waypoint vertex dots
 * - Alignment guide lines when cursor aligns with existing waypoints
 */
export function PathPreview({ waypoints, cursorPoint, alignmentGuides }: PathPreviewProps) {
  const { zoom, offset } = useViewportStore();
  const activeLayerId = useLayerStore((s) => s.activeLayerId);
  const layers = useLayerStore((s) => s.layers);
  const width = usePathStore((s) => s.width);
  const cornerRadius = usePathStore((s) => s.cornerRadius);
  const numArcPoints = usePathStore((s) => s.numArcPoints);

  // Get layer color
  const layer = layers.get(activeLayerId);
  const strokeColor = layer?.color ?? "#888888";

  // Convert world coordinates to screen coordinates
  const worldToScreen = (p: Point) => ({
    x: p.x * zoom + offset.x,
    y: p.y * zoom + offset.y,
  });

  if (waypoints.length === 0) return null;

  // Build the full path including cursor point.
  // Deduplicate: if the cursor sits exactly on the last waypoint (happens
  // immediately after a click, before the next mouse-move), exclude it so
  // the ribbon doesn't degenerate from a zero-length trailing segment.
  const lastWp = waypoints[waypoints.length - 1];
  const cursorIsDuplicate =
    cursorPoint &&
    lastWp &&
    Math.abs(cursorPoint.x - lastWp.x) < 1e-6 &&
    Math.abs(cursorPoint.y - lastWp.y) < 1e-6;
  const allPoints =
    cursorPoint && !cursorIsDuplicate ? [...waypoints, cursorPoint] : waypoints;
  const screenPoints = allPoints.map(worldToScreen);

  // Build SVG path for the centerline
  const centerlineD = screenPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Generate ribbon preview polygon (with rounded corners if cornerRadius > 0)
  const ribbonPoints = createRibbonPreview(allPoints, width, cornerRadius, numArcPoints);
  const ribbonScreen = ribbonPoints.map(worldToScreen);
  const ribbonD =
    ribbonScreen.length > 0
      ? ribbonScreen.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"
      : "";

  // Compute alignment guide lines
  const cursorScreen = cursorPoint ? worldToScreen(cursorPoint) : null;
  const alignedXScreen = alignmentGuides?.alignedVertexX
    ? worldToScreen(alignmentGuides.alignedVertexX)
    : null;
  const alignedYScreen = alignmentGuides?.alignedVertexY
    ? worldToScreen(alignmentGuides.alignedVertexY)
    : null;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {/* Alignment guide lines */}
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

      {/* Ribbon polygon fill (semi-transparent waveguide width preview) */}
      {ribbonD && <path d={ribbonD} fill={strokeColor} fillOpacity={0.15} stroke="none" />}

      {/* Ribbon polygon outline */}
      {ribbonD && (
        <path d={ribbonD} fill="none" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} />
      )}

      {/* Centerline path (dashed) */}
      <path
        d={centerlineD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeDasharray="6 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Waypoint vertex dots */}
      {waypoints.map((_, i) => {
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
