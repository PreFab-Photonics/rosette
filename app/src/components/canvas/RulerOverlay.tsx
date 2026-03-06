import { useViewportStore, GRID_SIZE } from "@/stores/viewport";
import { useUIStore, SELECTION_COLORS } from "@/stores/ui";
import { useRulerStore, type Ruler, type Point, type RulerEndpoint } from "@/stores/ruler";
import { getDisplayUnit, formatCoordinate } from "@/lib/format";

/**
 * Ruler color schemes for dark and light themes.
 */
const RULER_COLORS = {
  dark: {
    line: "#8b959f",
    text: "#8b959f",
    background: "#1a1d21",
    border: "#8b959f",
    endpoint: "#8b959f",
    hover: "#ffffff",
  },
  light: {
    line: "#4b5563",
    text: "#4b5563",
    background: "rgba(255, 255, 255, 0.95)",
    border: "#4b5563",
    endpoint: "#4b5563",
    hover: "#000000",
  },
} as const;

/** Endpoint dot radius in pixels. */
const ENDPOINT_RADIUS = 3;
/** Endpoint dot radius when hovered. */
const ENDPOINT_HOVER_RADIUS = 5;
/** Snap indicator radius in pixels. */
const SNAP_INDICATOR_RADIUS = 6;

/**
 * Snap indicator color schemes - uses selection green for consistency.
 */
const SNAP_COLORS = {
  dark: {
    fill: "rgba(68, 255, 68, 0.3)", // #44ff44 with alpha
    stroke: SELECTION_COLORS.dark,
  },
  light: {
    fill: "rgba(68, 255, 68, 0.3)", // #44ff44 with alpha
    stroke: SELECTION_COLORS.light,
  },
} as const;

/**
 * Calculate measurements between two points.
 * Input is in world units, output is in nanometers.
 * World units are converted to nanometers by dividing by GRID_SIZE.
 */
function calculateMeasurements(start: Point, end: Point) {
  // Convert world units to nanometers (1 grid point = 1 nanometer)
  const dx = Math.abs(end.x - start.x) / GRID_SIZE;
  const dy = Math.abs(end.y - start.y) / GRID_SIZE;
  const diagonal = Math.sqrt(dx * dx + dy * dy);
  return { dx, dy, diagonal };
}

interface SnapIndicatorProps {
  point: Point;
  worldToScreen: (p: Point) => { x: number; y: number };
  theme: "dark" | "light";
}

/**
 * Renders a snap indicator when snapping to geometry.
 * Shows a circle with crosshair at the snap target.
 */
function SnapIndicator({ point, worldToScreen, theme }: SnapIndicatorProps) {
  const colors = SNAP_COLORS[theme];
  const screen = worldToScreen(point);
  const r = SNAP_INDICATOR_RADIUS;

  return (
    <g>
      {/* Outer circle */}
      <circle
        cx={screen.x}
        cy={screen.y}
        r={r}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={2}
      />
      {/* Crosshair lines */}
      <line
        x1={screen.x - r - 2}
        y1={screen.y}
        x2={screen.x + r + 2}
        y2={screen.y}
        stroke={colors.stroke}
        strokeWidth={1.5}
      />
      <line
        x1={screen.x}
        y1={screen.y - r - 2}
        x2={screen.x}
        y2={screen.y + r + 2}
        stroke={colors.stroke}
        strokeWidth={1.5}
      />
    </g>
  );
}

interface RulerGraphicProps {
  ruler: Ruler;
  worldToScreen: (p: Point) => { x: number; y: number };
  hoveredEndpoint: RulerEndpoint | null;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  theme: "dark" | "light";
  zoom: number;
}

/**
 * Renders a single ruler with line, measurements, and endpoints.
 */
function RulerGraphic({
  ruler,
  worldToScreen,
  hoveredEndpoint,
  isSelected,
  isHovered,
  isDragging,
  theme,
  zoom,
}: RulerGraphicProps) {
  const colors = RULER_COLORS[theme];
  const selectionColor = SELECTION_COLORS[theme];
  const startScreen = worldToScreen(ruler.start);
  const endScreen = worldToScreen(ruler.end);

  // Determine colors based on state - green for selection, white/black for hover
  const lineColor = isSelected ? selectionColor : isHovered ? colors.hover : colors.line;
  const borderColor = isSelected ? selectionColor : isHovered ? colors.hover : colors.border;
  const lineWidth = isSelected || isHovered || isDragging ? 2 : 1.5;

  // Calculate midpoint for measurement box
  const midScreen = {
    x: (startScreen.x + endScreen.x) / 2,
    y: (startScreen.y + endScreen.y) / 2,
  };

  // Calculate measurements
  const { dx, dy, diagonal } = calculateMeasurements(ruler.start, ruler.end);
  const unitInfo = getDisplayUnit(zoom);

  // Format measurements
  const dxFormatted = `${formatCoordinate(dx, unitInfo)} ${unitInfo.unit}`;
  const dyFormatted = `${formatCoordinate(dy, unitInfo)} ${unitInfo.unit}`;
  const dFormatted = `${formatCoordinate(diagonal, unitInfo)} ${unitInfo.unit}`;

  // Measurement box dimensions - sized to fit formatted measurements
  const boxWidth = 140;
  const boxHeight = 56;

  return (
    <g>
      {/* Dashed measurement line */}
      <line
        x1={startScreen.x}
        y1={startScreen.y}
        x2={endScreen.x}
        y2={endScreen.y}
        stroke={lineColor}
        strokeWidth={lineWidth}
        strokeDasharray="6 4"
        strokeLinecap="round"
      />

      {/* Measurement box */}
      <foreignObject
        x={midScreen.x - boxWidth / 2}
        y={midScreen.y - boxHeight / 2}
        width={boxWidth}
        height={boxHeight}
        overflow="visible"
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${borderColor}`,
              borderRadius: "4px",
              padding: "4px 8px",
              fontFamily: "monospace",
              fontSize: "11px",
              color: colors.text,
              lineHeight: "14px",
              whiteSpace: "nowrap",
            }}
          >
            <div>
              <span style={{ opacity: 0.7 }}>Δx</span> {dxFormatted}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Δy</span> {dyFormatted}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Δd</span> {dFormatted}
            </div>
          </div>
        </div>
      </foreignObject>

      {/* Start endpoint */}
      <circle
        cx={startScreen.x}
        cy={startScreen.y}
        r={hoveredEndpoint === "start" ? ENDPOINT_HOVER_RADIUS : ENDPOINT_RADIUS}
        fill={
          isSelected ? selectionColor : hoveredEndpoint === "start" ? colors.hover : colors.endpoint
        }
        stroke={isSelected ? selectionColor : hoveredEndpoint === "start" ? colors.hover : "none"}
        strokeWidth={hoveredEndpoint === "start" || isSelected ? 2 : 0}
        style={{ transition: "r 0.1s, fill 0.1s" }}
      />

      {/* End endpoint */}
      <circle
        cx={endScreen.x}
        cy={endScreen.y}
        r={hoveredEndpoint === "end" ? ENDPOINT_HOVER_RADIUS : ENDPOINT_RADIUS}
        fill={
          isSelected ? selectionColor : hoveredEndpoint === "end" ? colors.hover : colors.endpoint
        }
        stroke={isSelected ? selectionColor : hoveredEndpoint === "end" ? colors.hover : "none"}
        strokeWidth={hoveredEndpoint === "end" || isSelected ? 2 : 0}
        style={{ transition: "r 0.1s, fill 0.1s" }}
      />
    </g>
  );
}

/**
 * Renders all rulers as an SVG overlay.
 *
 * Positioned absolutely over the canvas. Shows persistent rulers
 * and any ruler currently being created.
 */
export function RulerOverlay() {
  const { zoom, offset } = useViewportStore();
  const theme = useUIStore((s) => s.theme);
  const {
    rulers,
    activeRulerId,
    selectedRulerIds,
    hoveredRulerId,
    marqueePreviewIds,
    hoveredEndpoint,
    draggingEndpoint,
    snapPoint,
  } = useRulerStore();

  // Convert world coordinates to screen coordinates
  const worldToScreen = (p: Point) => ({
    x: p.x * zoom + offset.x,
    y: p.y * zoom + offset.y,
  });

  // Nothing to render if no rulers and no snap point
  if (rulers.size === 0 && !snapPoint) return null;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {Array.from(rulers.values()).map((ruler) => {
        const isActive = ruler.id === activeRulerId;
        const isSelected = selectedRulerIds.has(ruler.id);
        const isHovered = ruler.id === hoveredRulerId || marqueePreviewIds.has(ruler.id);
        const isEndpointHovered = hoveredEndpoint?.rulerId === ruler.id;
        const isDragging = draggingEndpoint?.rulerId === ruler.id;

        return (
          <RulerGraphic
            key={ruler.id}
            ruler={ruler}
            worldToScreen={worldToScreen}
            hoveredEndpoint={
              isEndpointHovered
                ? hoveredEndpoint.endpoint
                : isDragging
                  ? draggingEndpoint.endpoint
                  : null
            }
            isSelected={isSelected}
            isHovered={isHovered && !isSelected}
            isDragging={isDragging || isActive}
            theme={theme}
            zoom={zoom}
          />
        );
      })}
      {/* Snap indicator when snapping to geometry */}
      {snapPoint && <SnapIndicator point={snapPoint} worldToScreen={worldToScreen} theme={theme} />}
    </svg>
  );
}
