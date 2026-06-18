import { useEffect, useRef, useState } from "react";
import { useViewportStore, GRID_SIZE } from "@/stores/viewport";
import { useUIStore, SELECTION_COLORS } from "@/stores/ui";
import {
  useRulerStore,
  type Ruler,
  type Point,
  type RulerEndpoint,
  type AngleRuler,
  type PolylineRuler,
  type RadiusRuler,
  type SuperRuler,
} from "@/stores/ruler";
import { formatCoordinate, resolveDisplayUnit, type UnitInfo } from "@/lib/format";
import { RULER_BOX_WIDTH, RULER_BOX_HEIGHT } from "@/lib/ruler-hittest";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { UpdateRulerPropsCommand } from "@/lib/commands";

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

/** Super Ruler measurement box dimensions (taller to fit θ + label row). */
const SUPER_BOX_WIDTH = 160;
const SUPER_BOX_HEIGHT_BASE = 74; // Δx, Δy, Δd, θ
const SUPER_BOX_HEIGHT_WITH_LABEL = 90;

/** Endpoint coordinate badge dimensions (screen pixels). */
const COORD_BADGE_OFFSET = 14;

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
 * Calculate linear measurements between two points.
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

/**
 * Compute the angle between `start → end` in degrees, using the standard
 * math convention: 0° = +x axis, CCW positive, range (-180°, 180°].
 *
 * Note: the world Y axis points *down* on screen (same as SVG), so
 * callers that want a "CCW on screen" convention should negate dy before
 * passing in. We do this at the display site so the math here stays
 * convention-agnostic.
 */
function angleDegrees(start: Point, end: Point): number {
  // Use -(end.y - start.y) so positive angles are CCW on the user's screen
  // (+y displayed as up). This matches the status-bar Y-flip convention.
  const dy = -(end.y - start.y);
  const dx = end.x - start.x;
  if (dx === 0 && dy === 0) return 0;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/** Format a nanometer length using the given UnitInfo. */
function formatLength(valueInNm: number, unitInfo: UnitInfo): string {
  return `${formatCoordinate(valueInNm, unitInfo)} ${unitInfo.unit}`;
}

/**
 * Format an angle (degrees) with 3 decimal places. Always includes a sign
 * on negative values for readability.
 */
function formatAngle(deg: number): string {
  const rounded = Math.abs(deg) < 1e-9 ? 0 : deg;
  return `${rounded.toFixed(3)}°`;
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

interface TwoPointGraphicCommonProps {
  worldToScreen: (p: Point) => { x: number; y: number };
  hoveredEndpoint: RulerEndpoint | null;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  theme: "dark" | "light";
  zoom: number;
}

/**
 * Renders a simple two-point ruler with line, Δx/Δy/Δd box, and endpoints.
 * Matches the pre-ROS-560 behavior exactly.
 */
function SimpleRulerGraphic({
  ruler,
  worldToScreen,
  hoveredEndpoint,
  isSelected,
  isHovered,
  isDragging,
  theme,
  zoom,
}: TwoPointGraphicCommonProps & { ruler: Ruler & { kind: "simple" } }) {
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
  const unitInfo = resolveDisplayUnit(zoom);

  // Format measurements
  const dxFormatted = formatLength(dx, unitInfo);
  const dyFormatted = formatLength(dy, unitInfo);
  const dFormatted = formatLength(diagonal, unitInfo);

  // Measurement box dimensions - sized to fit formatted measurements.
  // Shared with hit-test code via `lib/ruler-hittest.ts`.
  const boxWidth = RULER_BOX_WIDTH;
  const boxHeight = RULER_BOX_HEIGHT;

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

      <EndpointDots
        startScreen={startScreen}
        endScreen={endScreen}
        hoveredEndpoint={hoveredEndpoint}
        isSelected={isSelected}
        theme={theme}
      />
    </g>
  );
}

/**
 * Editable label shown inside the Super Ruler's measurement box.
 *
 * Rendered only when the parent determines the ruler is in edit mode
 * (i.e. `editingRulerId === ruler.id`). Commits on Enter or blur,
 * reverts on Escape. While mounted, it claims the keyboard focus stack
 * so canvas shortcuts (including the 1–9 layer hotkeys, delete, etc.)
 * don't fire while the user is typing.
 *
 * The commit is funneled through `UpdateRulerPropsCommand` so it lands
 * in the undo history exactly once per rename, and is skipped entirely
 * when the label didn't change — matching the old window.prompt flow.
 */
function RulerLabelEditor({ ruler, theme }: { ruler: SuperRuler; theme: "dark" | "light" }) {
  const initialValue = ruler.label ?? "";
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);
  const committedRef = useRef(false);

  // Block canvas shortcuts while editing
  useKeyboardFocus("ruler-label-editor", true);

  // Autofocus + select on mount
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    // Defer by a frame so foreignObject is fully laid out before we focus
    const raf = requestAnimationFrame(() => {
      el.focus();
      el.select();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const finish = (commit: boolean) => {
    if (committedRef.current) return;
    committedRef.current = true;

    const rulerStore = useRulerStore.getState();
    rulerStore.setEditingRulerId(null);

    if (!commit) return;
    const next = value;
    const current = ruler.label ?? "";
    if (next === current) return;

    // Guard against the ruler having been deleted while the editor was
    // still mounted — blur fires on unmount and would otherwise push a
    // no-op command onto the undo stack.
    if (!rulerStore.rulers.has(ruler.id)) return;

    const { library, renderer } = useWasmContextStore.getState();
    if (!library || !renderer) return;
    const cmd = new UpdateRulerPropsCommand(ruler.id, { label: current }, { label: next });
    useHistoryStore.getState().execute(cmd, { library, renderer });
  };

  const colors = RULER_COLORS[theme];

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => finish(!cancelledRef.current)}
      onKeyDown={(e) => {
        // Keep the canvas from reacting to any key while we're typing
        e.stopPropagation();
        if (e.key === "Enter") {
          e.preventDefault();
          finish(true);
        } else if (e.key === "Escape") {
          e.preventDefault();
          cancelledRef.current = true;
          finish(false);
        }
      }}
      // Prevent the canvas mousedown-outside logic from swallowing clicks
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      placeholder="Label…"
      style={{
        pointerEvents: "auto",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "transparent",
        border: "none",
        outline: `1px solid ${colors.border}`,
        borderRadius: 3,
        padding: "1px 4px",
        marginBottom: 2,
        fontFamily: "monospace",
        fontSize: 11,
        fontWeight: 600,
        color: colors.text,
        lineHeight: "14px",
      }}
    />
  );
}

/**
 * Renders a "super" ruler: adds angle θ, endpoint-coordinate badges, and
 * an optional label row to the measurement box.
 *
 * Sign conventions (documented in place so nobody second-guesses them):
 *   - θ uses math convention (0° = +x, CCW positive), computed with
 *     `atan2(-dy, dx)` so the on-screen display matches a chart where
 *     +y points up. This matches the status-bar coord convention.
 *   - Endpoint coord badges show `-ruler.end.y / GRID_SIZE` as the Y
 *     component for the same reason.
 */
function SuperRulerGraphic({
  ruler,
  worldToScreen,
  hoveredEndpoint,
  isSelected,
  isHovered,
  isDragging,
  theme,
  zoom,
}: TwoPointGraphicCommonProps & { ruler: SuperRuler }) {
  const colors = RULER_COLORS[theme];
  const selectionColor = SELECTION_COLORS[theme];
  const startScreen = worldToScreen(ruler.start);
  const endScreen = worldToScreen(ruler.end);

  const lineColor = isSelected ? selectionColor : isHovered ? colors.hover : colors.line;
  const borderColor = isSelected ? selectionColor : isHovered ? colors.hover : colors.border;
  const lineWidth = isSelected || isHovered || isDragging ? 2 : 1.5;

  const midScreen = {
    x: (startScreen.x + endScreen.x) / 2,
    y: (startScreen.y + endScreen.y) / 2,
  };

  const { dx, dy, diagonal } = calculateMeasurements(ruler.start, ruler.end);
  const unitInfo = resolveDisplayUnit(zoom, ruler.unitOverride);
  const theta = angleDegrees(ruler.start, ruler.end);

  const dxFormatted = formatLength(dx, unitInfo);
  const dyFormatted = formatLength(dy, unitInfo);
  const dFormatted = formatLength(diagonal, unitInfo);
  const thetaFormatted = formatAngle(theta);

  const hasLabel = !!(ruler.label && ruler.label.length > 0);
  const isEditingLabel = useRulerStore((s) => s.editingRulerId) === ruler.id;
  // While editing, reserve room for the label row even if it's empty,
  // so the box doesn't jump size as the user types.
  const showLabelRow = hasLabel || isEditingLabel;
  const boxWidth = SUPER_BOX_WIDTH;
  const boxHeight = showLabelRow ? SUPER_BOX_HEIGHT_WITH_LABEL : SUPER_BOX_HEIGHT_BASE;

  // Endpoint coord badges — placed just outside the endpoint, offset along
  // the axis perpendicular to the ruler so they don't sit on the line.
  const formatXY = (p: Point) => {
    const xNm = p.x / GRID_SIZE;
    const yNm = -p.y / GRID_SIZE; // Y-flip to match status bar convention
    return `(${formatCoordinate(xNm, unitInfo)}, ${formatCoordinate(yNm, unitInfo)}) ${unitInfo.unit}`;
  };

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

      {/* Central measurement box */}
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
            {isEditingLabel ? (
              <RulerLabelEditor ruler={ruler} theme={theme} />
            ) : (
              hasLabel && (
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: 2,
                    cursor: "text",
                    // Allow double-click to land on the label even though
                    // the surrounding SVG root is pointer-events: none.
                    pointerEvents: "auto",
                  }}
                  onDoubleClick={(e) => {
                    // Enter inline-edit on double-click, matching the
                    // layer/cell rename interaction in the sidebar.
                    e.stopPropagation();
                    useRulerStore.getState().setEditingRulerId(ruler.id);
                  }}
                >
                  {ruler.label}
                </div>
              )
            )}
            <div>
              <span style={{ opacity: 0.7 }}>Δx</span> {dxFormatted}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Δy</span> {dyFormatted}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Δd</span> {dFormatted}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>θ</span> {thetaFormatted}
            </div>
          </div>
        </div>
      </foreignObject>

      {/* Endpoint coord badges */}
      <CoordBadge
        screen={startScreen}
        text={formatXY(ruler.start)}
        theme={theme}
        offsetY={-COORD_BADGE_OFFSET}
      />
      <CoordBadge
        screen={endScreen}
        text={formatXY(ruler.end)}
        theme={theme}
        offsetY={COORD_BADGE_OFFSET}
      />

      <EndpointDots
        startScreen={startScreen}
        endScreen={endScreen}
        hoveredEndpoint={hoveredEndpoint}
        isSelected={isSelected}
        theme={theme}
      />
    </g>
  );
}

/** Shared endpoint-dot rendering for simple + super rulers. */
function EndpointDots({
  startScreen,
  endScreen,
  hoveredEndpoint,
  isSelected,
  theme,
}: {
  startScreen: { x: number; y: number };
  endScreen: { x: number; y: number };
  hoveredEndpoint: RulerEndpoint | null;
  isSelected: boolean;
  theme: "dark" | "light";
}) {
  const colors = RULER_COLORS[theme];
  const selectionColor = SELECTION_COLORS[theme];

  return (
    <>
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
    </>
  );
}

/** Small coordinate badge rendered near a ruler endpoint. */
function CoordBadge({
  screen,
  text,
  theme,
  offsetY,
}: {
  screen: { x: number; y: number };
  text: string;
  theme: "dark" | "light";
  offsetY: number;
}) {
  const colors = RULER_COLORS[theme];
  const width = 160;
  const height = 18;
  return (
    <foreignObject
      x={screen.x - width / 2}
      y={screen.y + offsetY - height / 2}
      width={width}
      height={height}
      overflow="visible"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: 3,
            padding: "1px 5px",
            fontFamily: "monospace",
            fontSize: 10,
            color: colors.text,
            lineHeight: "12px",
            whiteSpace: "nowrap",
            opacity: 0.95,
          }}
        >
          {text}
        </div>
      </div>
    </foreignObject>
  );
}

/** Minimum on-screen segment length (px) required to show its length badge. */
const POLYLINE_SEGMENT_LABEL_MIN_PX = 60;

/**
 * Renders a polyline ruler (ROS-565).
 *
 * Draws a dashed polyline, a summary box at the centroid showing the
 * segment count and total length, and per-segment length badges for
 * segments long enough on screen to avoid visual clutter.
 */
function PolylineRulerGraphic({
  ruler,
  worldToScreen,
  hoveredEndpoint,
  isSelected,
  isHovered,
  isDragging,
  theme,
  zoom,
}: {
  ruler: PolylineRuler;
  worldToScreen: (p: Point) => { x: number; y: number };
  hoveredEndpoint: { pointIndex: number } | null;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  theme: "dark" | "light";
  zoom: number;
}) {
  const colors = RULER_COLORS[theme];
  const selectionColor = SELECTION_COLORS[theme];
  const pts = ruler.points;
  if (pts.length < 2) return null;

  const screenPts = pts.map(worldToScreen);

  const lineColor = isSelected ? selectionColor : isHovered ? colors.hover : colors.line;
  const borderColor = isSelected ? selectionColor : isHovered ? colors.hover : colors.border;
  const lineWidth = isSelected || isHovered || isDragging ? 2 : 1.5;

  const unitInfo = resolveDisplayUnit(zoom);

  // Per-segment lengths in nm + screen-pixel lengths.
  let totalNm = 0;
  const segmentLengthsNm: number[] = [];
  const segmentLengthsScreen: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const wdx = (pts[i + 1].x - pts[i].x) / GRID_SIZE;
    const wdy = (pts[i + 1].y - pts[i].y) / GRID_SIZE;
    const lenNm = Math.sqrt(wdx * wdx + wdy * wdy);
    segmentLengthsNm.push(lenNm);
    totalNm += lenNm;
    const sdx = screenPts[i + 1].x - screenPts[i].x;
    const sdy = screenPts[i + 1].y - screenPts[i].y;
    segmentLengthsScreen.push(Math.sqrt(sdx * sdx + sdy * sdy));
  }

  // Centroid of the screen-space polyline for the summary box.
  const centroid = screenPts.reduce(
    (acc, p) => ({ x: acc.x + p.x / screenPts.length, y: acc.y + p.y / screenPts.length }),
    { x: 0, y: 0 },
  );

  const pathD = screenPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const summaryText = `${pts.length - 1} seg  total ${formatLength(totalNm, unitInfo)}`;
  const summaryWidth = 190;
  const summaryHeight = 28;

  return (
    <g>
      {/* Dashed polyline */}
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
        strokeDasharray="6 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Per-segment length badges (collapsed when segment is short) */}
      {segmentLengthsNm.map((lenNm, i) => {
        if (segmentLengthsScreen[i] < POLYLINE_SEGMENT_LABEL_MIN_PX) return null;
        const mid = {
          x: (screenPts[i].x + screenPts[i + 1].x) / 2,
          y: (screenPts[i].y + screenPts[i + 1].y) / 2,
        };
        return (
          <CoordBadge
            key={`${mid.x},${mid.y}`}
            screen={mid}
            text={formatLength(lenNm, unitInfo)}
            theme={theme}
            offsetY={0}
          />
        );
      })}

      {/* Summary box */}
      <foreignObject
        x={centroid.x - summaryWidth / 2}
        y={centroid.y - summaryHeight / 2}
        width={summaryWidth}
        height={summaryHeight}
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
              borderRadius: 4,
              padding: "2px 8px",
              fontFamily: "monospace",
              fontSize: 11,
              color: colors.text,
              lineHeight: "14px",
              whiteSpace: "nowrap",
            }}
          >
            {summaryText}
          </div>
        </div>
      </foreignObject>

      {/* Vertex handles */}
      {screenPts.map((s, i) => {
        const hovered = hoveredEndpoint?.pointIndex === i;
        return (
          <circle
            key={`${s.x},${s.y}`}
            cx={s.x}
            cy={s.y}
            r={hovered ? ENDPOINT_HOVER_RADIUS : ENDPOINT_RADIUS}
            fill={isSelected ? selectionColor : hovered ? colors.hover : colors.endpoint}
            stroke={isSelected ? selectionColor : hovered ? colors.hover : "none"}
            strokeWidth={hovered || isSelected ? 2 : 0}
            style={{ transition: "r 0.1s, fill 0.1s" }}
          />
        );
      })}
    </g>
  );
}

/** Arc radius (screen pixels) used by the Angle Ruler. */
const ANGLE_ARC_RADIUS_PX = 36;

/**
 * Renders an angle / protractor ruler (ROS-562).
 *
 * Draws two dashed arms from the vertex and a small arc between them
 * labelled with θ in degrees. The arc always goes the short way between
 * the arms unless Shift is held while creating (future enhancement).
 */
function AngleRulerGraphic({
  ruler,
  worldToScreen,
  hoveredEndpoint,
  isSelected,
  isHovered,
  isDragging,
  theme,
  zoom: _zoom,
}: {
  ruler: AngleRuler;
  worldToScreen: (p: Point) => { x: number; y: number };
  hoveredEndpoint: { pointIndex: number } | null;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  theme: "dark" | "light";
  zoom: number;
}) {
  const colors = RULER_COLORS[theme];
  const selectionColor = SELECTION_COLORS[theme];

  const v = worldToScreen(ruler.vertex);
  const a = worldToScreen(ruler.armA);
  const b = worldToScreen(ruler.armB);

  const lineColor = isSelected ? selectionColor : isHovered ? colors.hover : colors.line;
  const lineWidth = isSelected || isHovered || isDragging ? 2 : 1.5;

  // Angles of each arm from the vertex, in screen space.
  // Note: screen Y grows downward, but atan2(dy, dx) works either way as
  // long as we're consistent between the arc sweep and label placement.
  const angleA = Math.atan2(a.y - v.y, a.x - v.x);
  const angleB = Math.atan2(b.y - v.y, b.x - v.x);

  // Normalize signed delta to [-PI, PI] so we always draw the short arc.
  let delta = angleB - angleA;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta <= -Math.PI) delta += 2 * Math.PI;

  // Arc sweep direction (+1 CCW on screen, -1 CW). SVG sweep-flag = 1 is
  // clockwise in the SVG Y-down system, so we flip for our convention.
  const sweepFlag = delta > 0 ? 1 : 0;
  const largeArcFlag = 0; // always short arc

  // Convert signed on-screen delta into a user-facing degrees value with
  // the status-bar Y-flip convention (CCW positive when viewing the
  // canvas with +y up).
  const thetaDeg = -(delta * 180) / Math.PI;

  // Arc endpoints on each arm at the fixed screen radius.
  const arcStart = {
    x: v.x + Math.cos(angleA) * ANGLE_ARC_RADIUS_PX,
    y: v.y + Math.sin(angleA) * ANGLE_ARC_RADIUS_PX,
  };
  const arcEnd = {
    x: v.x + Math.cos(angleB) * ANGLE_ARC_RADIUS_PX,
    y: v.y + Math.sin(angleB) * ANGLE_ARC_RADIUS_PX,
  };

  // Label position: midpoint of the arc, extended a bit outward.
  const midAngle = angleA + delta / 2;
  const labelRadius = ANGLE_ARC_RADIUS_PX + 10;
  const labelPos = {
    x: v.x + Math.cos(midAngle) * labelRadius,
    y: v.y + Math.sin(midAngle) * labelRadius,
  };

  const arcPath = `M ${arcStart.x} ${arcStart.y} A ${ANGLE_ARC_RADIUS_PX} ${ANGLE_ARC_RADIUS_PX} 0 ${largeArcFlag} ${sweepFlag} ${arcEnd.x} ${arcEnd.y}`;

  const handlePoints = [v, a, b];

  return (
    <g>
      {/* Arms */}
      <line
        x1={v.x}
        y1={v.y}
        x2={a.x}
        y2={a.y}
        stroke={lineColor}
        strokeWidth={lineWidth}
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
      <line
        x1={v.x}
        y1={v.y}
        x2={b.x}
        y2={b.y}
        stroke={lineColor}
        strokeWidth={lineWidth}
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
      {/* Arc */}
      <path d={arcPath} fill="none" stroke={lineColor} strokeWidth={lineWidth} />
      {/* Angle label */}
      <CoordBadge screen={labelPos} text={`θ ${formatAngle(thetaDeg)}`} theme={theme} offsetY={0} />
      {/* Vertex handles */}
      {handlePoints.map((p, i) => {
        const hovered = hoveredEndpoint?.pointIndex === i;
        return (
          <circle
            key={`${p.x},${p.y}`}
            cx={p.x}
            cy={p.y}
            r={hovered ? ENDPOINT_HOVER_RADIUS : ENDPOINT_RADIUS}
            fill={isSelected ? selectionColor : hovered ? colors.hover : colors.endpoint}
            stroke={isSelected ? selectionColor : hovered ? colors.hover : "none"}
            strokeWidth={hovered || isSelected ? 2 : 0}
            style={{ transition: "r 0.1s, fill 0.1s" }}
          />
        );
      })}
    </g>
  );
}

/**
 * Renders a radius ruler (ROS-563).
 *
 * Draws a dashed segment from `center` to `edge`, a world-space circle
 * of radius `|edge - center|` centered on `center`, and labels `r` and
 * `d = 2r` beneath the segment midpoint.
 */
function RadiusRulerGraphic({
  ruler,
  worldToScreen,
  hoveredEndpoint,
  isSelected,
  isHovered,
  isDragging,
  theme,
  zoom,
}: {
  ruler: RadiusRuler;
  worldToScreen: (p: Point) => { x: number; y: number };
  hoveredEndpoint: { pointIndex: number } | null;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  theme: "dark" | "light";
  zoom: number;
}) {
  const colors = RULER_COLORS[theme];
  const selectionColor = SELECTION_COLORS[theme];

  const c = worldToScreen(ruler.center);
  const ePt = worldToScreen(ruler.edge);

  const lineColor = isSelected ? selectionColor : isHovered ? colors.hover : colors.line;
  const borderColor = isSelected ? selectionColor : isHovered ? colors.hover : colors.border;
  const lineWidth = isSelected || isHovered || isDragging ? 2 : 1.5;

  // Radius in screen pixels (circle must scale with zoom). World distance:
  const wdx = (ruler.edge.x - ruler.center.x) / GRID_SIZE;
  const wdy = (ruler.edge.y - ruler.center.y) / GRID_SIZE;
  const rNm = Math.sqrt(wdx * wdx + wdy * wdy);
  const dNm = rNm * 2;
  const rScreen = Math.sqrt((ePt.x - c.x) ** 2 + (ePt.y - c.y) ** 2);

  const unitInfo = resolveDisplayUnit(zoom);
  const rLabel = formatLength(rNm, unitInfo);
  const dLabel = formatLength(dNm, unitInfo);

  const mid = { x: (c.x + ePt.x) / 2, y: (c.y + ePt.y) / 2 };

  // Box with r and d lines.
  const boxW = 150;
  const boxH = 36;

  return (
    <g>
      {/* World-space circle */}
      <circle
        cx={c.x}
        cy={c.y}
        r={rScreen}
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
        strokeDasharray="4 4"
      />
      {/* Radius segment */}
      <line
        x1={c.x}
        y1={c.y}
        x2={ePt.x}
        y2={ePt.y}
        stroke={lineColor}
        strokeWidth={lineWidth}
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
      {/* r / d readouts box */}
      <foreignObject
        x={mid.x - boxW / 2}
        y={mid.y - boxH / 2}
        width={boxW}
        height={boxH}
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
              borderRadius: 4,
              padding: "2px 8px",
              fontFamily: "monospace",
              fontSize: 11,
              color: colors.text,
              lineHeight: "14px",
              whiteSpace: "nowrap",
            }}
          >
            <div>
              <span style={{ opacity: 0.7 }}>r</span> {rLabel}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>d</span> {dLabel}
            </div>
          </div>
        </div>
      </foreignObject>
      {/* Handles: 0 = center, 1 = edge */}
      {[
        { pt: c, name: "center" },
        { pt: ePt, name: "edge" },
      ].map(({ pt, name }, i) => {
        const hovered = hoveredEndpoint?.pointIndex === i;
        return (
          <circle
            key={name}
            cx={pt.x}
            cy={pt.y}
            r={hovered ? ENDPOINT_HOVER_RADIUS : ENDPOINT_RADIUS}
            fill={isSelected ? selectionColor : hovered ? colors.hover : colors.endpoint}
            stroke={isSelected ? selectionColor : hovered ? colors.hover : "none"}
            strokeWidth={hovered || isSelected ? 2 : 0}
            style={{ transition: "r 0.1s, fill 0.1s" }}
          />
        );
      })}
    </g>
  );
}

/** Dispatch a `Ruler` to the correct per-kind graphic. */
function RulerGraphic(
  props: TwoPointGraphicCommonProps & {
    ruler: Ruler;
    hoveredVertexIndex: number | null;
  },
) {
  switch (props.ruler.kind) {
    case "simple":
      return <SimpleRulerGraphic {...props} ruler={props.ruler} />;
    case "super":
      return <SuperRulerGraphic {...props} ruler={props.ruler} />;
    case "polyline":
      return (
        <PolylineRulerGraphic
          ruler={props.ruler}
          worldToScreen={props.worldToScreen}
          hoveredEndpoint={
            props.hoveredVertexIndex !== null ? { pointIndex: props.hoveredVertexIndex } : null
          }
          isSelected={props.isSelected}
          isHovered={props.isHovered}
          isDragging={props.isDragging}
          theme={props.theme}
          zoom={props.zoom}
        />
      );
    case "angle":
      return (
        <AngleRulerGraphic
          ruler={props.ruler}
          worldToScreen={props.worldToScreen}
          hoveredEndpoint={
            props.hoveredVertexIndex !== null ? { pointIndex: props.hoveredVertexIndex } : null
          }
          isSelected={props.isSelected}
          isHovered={props.isHovered}
          isDragging={props.isDragging}
          theme={props.theme}
          zoom={props.zoom}
        />
      );
    case "radius":
      return (
        <RadiusRulerGraphic
          ruler={props.ruler}
          worldToScreen={props.worldToScreen}
          hoveredEndpoint={
            props.hoveredVertexIndex !== null ? { pointIndex: props.hoveredVertexIndex } : null
          }
          isSelected={props.isSelected}
          isHovered={props.isHovered}
          isDragging={props.isDragging}
          theme={props.theme}
          zoom={props.zoom}
        />
      );
  }
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
  const showRulers = useUIStore((s) => s.showRulers);
  const {
    rulers,
    activeRulerId,
    selectedRulerIds,
    hoveredRulerId,
    marqueePreviewIds,
    hoveredEndpoint,
    hoveredVertex,
    draggingEndpoint,
    draggingVertex,
    snapPoint,
  } = useRulerStore();

  // Convert world coordinates to screen coordinates
  const worldToScreen = (p: Point) => ({
    x: p.x * zoom + offset.x,
    y: p.y * zoom + offset.y,
  });

  // Hidden by user (Show/Hide toggle) — render nothing.
  // The snap indicator is also hidden, since it only makes sense when the
  // user is actively interacting with rulers.
  if (!showRulers) return null;

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
        const isVertexHovered = hoveredVertex?.rulerId === ruler.id;
        const isVertexDragging = draggingVertex?.rulerId === ruler.id;
        const hoveredVertexIndex = isVertexDragging
          ? draggingVertex.pointIndex
          : isVertexHovered
            ? hoveredVertex.pointIndex
            : null;

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
            hoveredVertexIndex={hoveredVertexIndex}
            isSelected={isSelected}
            isHovered={isHovered && !isSelected}
            isDragging={isDragging || isVertexDragging || isActive}
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
