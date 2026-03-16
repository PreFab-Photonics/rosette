import { useViewportStore } from "@/stores/viewport";
import { useSelectionStore } from "@/stores/selection";
import { usePathStore, type PathMetadata } from "@/stores/path";
import { useUIStore, SELECTION_COLORS, HOVER_COLORS } from "@/stores/ui";

/**
 * A point in world coordinates.
 */
interface Point {
  x: number;
  y: number;
}

/**
 * Renders centerline + waypoint dots for selected and hovered paths.
 *
 * This SVG overlay sits on top of the WebGPU canvas to show the original
 * path waypoints when a path element is selected or hovered, matching
 * the behavior of rosette-web's selected path rendering.
 */
export function PathSelectionOverlay() {
  const { zoom, offset } = useViewportStore();
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const hoveredId = useSelectionStore((s) => s.hoveredId);
  const pathMetadata = usePathStore((s) => s.pathMetadata);
  const theme = useUIStore((s) => s.theme);

  const selectionColor = theme === "dark" ? SELECTION_COLORS.dark : SELECTION_COLORS.light;
  const hoverColor = theme === "dark" ? HOVER_COLORS.dark : HOVER_COLORS.light;

  const worldToScreen = (p: Point) => ({
    x: p.x * zoom + offset.x,
    y: p.y * zoom + offset.y,
  });

  // Collect path metadata for selected paths
  const selectedPaths: { meta: PathMetadata; color: string }[] = [];
  for (const id of selectedIds) {
    const meta = pathMetadata.get(id);
    if (meta && meta.waypoints.length >= 2) {
      selectedPaths.push({ meta, color: selectionColor });
    }
  }

  // Collect hovered path (if not already selected)
  let hoveredPath: { meta: PathMetadata; color: string } | null = null;
  if (hoveredId && !selectedIds.has(hoveredId)) {
    const meta = pathMetadata.get(hoveredId);
    if (meta && meta.waypoints.length >= 2) {
      hoveredPath = { meta, color: hoverColor };
    }
  }

  const allPaths = hoveredPath ? [...selectedPaths, hoveredPath] : selectedPaths;

  if (allPaths.length === 0) return null;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {allPaths.map(({ meta, color }, pathIdx) => {
        const screenPoints = meta.waypoints.map(worldToScreen);
        const lineD = screenPoints
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
          .join(" ");

        return (
          <g key={pathIdx}>
            {/* Centerline through waypoints */}
            <path
              d={lineD}
              fill="none"
              stroke={color}
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={0.8}
            />

            {/* Waypoint dots */}
            {screenPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={3}
                fill={color}
                fillOpacity={0.9}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
