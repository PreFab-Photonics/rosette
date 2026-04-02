import { useMemo } from "react";
import { useUIStore } from "@/stores/ui";
import { useViewportStore, GRID_SIZE } from "@/stores/viewport";
import { useMinimapStore } from "@/stores/minimap";
import { useSelectionStore } from "@/stores/selection";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useLayerStore } from "@/stores/layer";
import { useStatusMessageStore } from "@/stores/status-message";
import { usePathStore } from "@/stores/path";
import { getDisplayUnit, formatCoordinate } from "@/lib/format";
import { SCALE_BAR_TARGET_PIXELS, SCALE_BAR_MAX_WIDTH, NICE_NUMBERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import { Position, SystemRestart } from "iconoir-react";

// =============================================================================
// Scale calculation (from ScaleDisplay)
// =============================================================================

interface ScaleInfo {
  length: number;
  label: string;
}

const calculateScale = (zoom: number): ScaleInfo => {
  const nmPerPixel = 1 / (zoom * GRID_SIZE);
  const targetLength = SCALE_BAR_TARGET_PIXELS * nmPerPixel;
  const unitInfo = getDisplayUnit(zoom);
  const rawValue = targetLength / unitInfo.scale;
  const chosenValue = NICE_NUMBERS.find((n) => n >= rawValue) ?? rawValue;
  const formattedValue =
    unitInfo.unit === "mm" && chosenValue >= 1000 ? chosenValue.toExponential(1) : chosenValue;

  return {
    length: chosenValue * unitInfo.scale,
    label: `${formattedValue} ${unitInfo.unit}`,
  };
};

// =============================================================================
// Main Component
// =============================================================================

/** App version — injected at build time from workspace Cargo.toml via Vite `define`. */
const VERSION = __APP_VERSION__;

/**
 * Version badge with beta warning tooltip.
 */
function VersionBadge({ isDark }: { isDark: boolean }) {
  return (
    <div className="group relative flex items-center gap-1.5">
      {/* Yellow dot */}
      <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-500" />
      {/* Version text */}
      <span className={cn("text-[10px] select-none", isDark ? "text-white/40" : "text-black/40")}>
        v{VERSION}
      </span>

      {/* Hover popup */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-56 rounded-lg border p-2.5 text-[11px] leading-relaxed opacity-0 transition-opacity group-hover:opacity-100",
          isDark
            ? "border-white/10 bg-[rgb(29,29,29)] text-white/70"
            : "border-black/10 bg-[rgb(241,241,241)] text-black/70",
        )}
      >
        <span className={cn("font-medium", isDark ? "text-white/90" : "text-black/90")}>
          Rosette v{VERSION} Beta
        </span>
        <p className="mt-1.5">
          Features may be unstable or incomplete. Not suitable for production use.
        </p>
      </div>
    </div>
  );
}

/**
 * Ephemeral status message displayed in the center of the status bar.
 *
 * Auto-dismisses after a timeout (managed by the store).
 * Any part of the app can trigger a message via:
 *   useStatusMessageStore.getState().show("message", "warn");
 */
function StatusMessage({ isDark }: { isDark: boolean }) {
  const message = useStatusMessageStore((s) => s.message);
  const level = useStatusMessageStore((s) => s.level);

  if (!message) {
    return <div className="flex-1" />;
  }

  return (
    <div className="flex min-w-0 flex-1 items-center justify-center">
      <span
        className={cn(
          "truncate text-[11px] select-none",
          level === "warn" && (isDark ? "text-yellow-400/80" : "text-yellow-600/80"),
          level === "error" && (isDark ? "text-red-400/80" : "text-red-600/80"),
          level === "info" && (isDark ? "text-white/50" : "text-black/50"),
        )}
      >
        {message}
      </span>
    </div>
  );
}

/**
 * Compact selection summary shown in the center of the status bar
 * when elements are selected and no ephemeral status message is active.
 */
function SelectionInfo({ isDark }: { isDark: boolean }) {
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const library = useWasmContextStore((s) => s.library);
  const layers = useLayerStore((s) => s.layers);
  const pathMetadata = usePathStore((s) => s.pathMetadata);

  const info = useMemo(() => {
    const count = selectedIds.size;
    if (count === 0 || !library) return null;

    const firstId = selectedIds.values().next().value as string;
    const isRef = firstId.startsWith("ref:");

    // --- Single instance (CellRef) ---
    if (count === 1 && isRef) {
      const refInfo = library.get_cell_ref_info(firstId);
      if (refInfo) {
        const cellName = refInfo.cell_name;
        refInfo.free();
        return { label: `Instance "${cellName}"`, layerNumber: null, datatype: null };
      }
    }

    // --- Single text element ---
    if (count === 1 && library.is_text_element(firstId)) {
      const textInfo = library.get_text_element_info(firstId) as {
        text: string;
        layer: number;
        datatype: number;
      } | null;
      if (textInfo) {
        const preview =
          textInfo.text.length > 20 ? textInfo.text.slice(0, 20) + "\u2026" : textInfo.text;
        return {
          label: `Text "${preview}"`,
          layerNumber: textInfo.layer,
          datatype: textInfo.datatype,
        };
      }
    }

    // --- Single path (waveguide) ---
    if (count === 1) {
      const pathMeta = pathMetadata.get(firstId);
      if (pathMeta) {
        return {
          label: `Path \u00b7 ${pathMeta.waypoints.length} waypoints`,
          layerNumber: pathMeta.layer,
          datatype: pathMeta.datatype,
        };
      }
    }

    // --- Polygon(s) ---
    // Gather layer info from all selected elements
    let firstLayer: number | null = null;
    let firstDatatype: number | null = null;
    let mixed = false;
    let vertexCount = 0;

    for (const id of selectedIds) {
      const elInfo = library.get_element_info(id);
      if (elInfo) {
        if (firstLayer === null) {
          firstLayer = elInfo.layer;
          firstDatatype = elInfo.datatype;
        } else if (elInfo.layer !== firstLayer || elInfo.datatype !== firstDatatype) {
          mixed = true;
        }
        if (count === 1) {
          vertexCount = elInfo.vertices.length / 2;
        }
        elInfo.free();
        // For multi-select we only need to detect mixed, so we can break early
        if (mixed && count > 1) break;
      }
    }

    if (count === 1) {
      return {
        label: `Polygon \u00b7 ${vertexCount} vertices`,
        layerNumber: firstLayer,
        datatype: firstDatatype,
      };
    }

    if (mixed) {
      return { label: `${count} elements \u00b7 Mixed layers`, layerNumber: null, datatype: null };
    }

    return { label: `${count} elements`, layerNumber: firstLayer, datatype: firstDatatype };
  }, [selectedIds, library, pathMetadata]);

  if (!info) return null;

  // Look up layer display name and color
  const layerMeta = useMemo(() => {
    if (info.layerNumber === null) return null;
    for (const layer of layers.values()) {
      if (layer.layerNumber === info.layerNumber && layer.datatype === info.datatype) {
        return { name: layer.name, color: layer.color };
      }
    }
    return null;
  }, [info, layers]);

  const layerSuffix =
    info.layerNumber !== null
      ? ` \u00b7 ${layerMeta?.name ? `${info.layerNumber}/${info.datatype} ${layerMeta.name}` : `${info.layerNumber}/${info.datatype}`}`
      : "";

  return (
    <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
      {layerMeta && (
        <div
          className="h-2 w-2 flex-shrink-0 rounded-full -translate-y-px"
          style={{ backgroundColor: layerMeta.color }}
        />
      )}
      <span
        className={cn(
          "truncate text-[11px] select-none",
          isDark ? "text-white/50" : "text-black/50",
        )}
      >
        {info.label}
        {layerSuffix}
      </span>
    </div>
  );
}

/**
 * Center section of the status bar.
 *
 * Priority: ephemeral status message > selection info > empty spacer.
 */
function CenterInfo({ isDark }: { isDark: boolean }) {
  const message = useStatusMessageStore((s) => s.message);
  const hasSelection = useSelectionStore((s) => s.selectedIds.size > 0);

  if (message) {
    return <StatusMessage isDark={isDark} />;
  }

  if (hasSelection) {
    return <SelectionInfo isDark={isDark} />;
  }

  return <div className="flex-1" />;
}

/**
 * Scale bar indicator — line + label showing current zoom scale.
 */
function ScaleBar({
  isDark,
  widthInPixels,
  label,
}: {
  isDark: boolean;
  widthInPixels: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn("h-px", isDark ? "bg-white/50" : "bg-black/50")}
        style={{ width: `${Math.max(widthInPixels, 20)}px` }}
      />
      <span
        className={cn(
          "text-[10px] select-none pointer-events-none",
          isDark ? "text-white/40" : "text-black/40",
        )}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * Status bar at the bottom of the application.
 *
 * Responsive behavior:
 * - Default: Version + X coord + Y coord | status | scale bar + zen + minimap
 * - compact: Scale bar floats above; coords | status | zen + minimap
 * - minimal: Scale bar floats above; combined X,Y | zen + minimap
 */
export function StatusBar({
  compact = false,
  minimal = false,
}: {
  compact?: boolean;
  minimal?: boolean;
}) {
  const cursorX = useUIStore((s) => s.cursorWorld?.x);
  const cursorY = useUIStore((s) => s.cursorWorld?.y);
  const theme = useUIStore((s) => s.theme);
  const zoom = useViewportStore((s) => s.zoom);
  const zenMode = useUIStore((s) => s.zenMode);
  const toggleZenMode = useUIStore((s) => s.toggleZenMode);
  const isMinimapMinimized = useMinimapStore((s) => s.isMinimized);
  const toggleMinimap = useMinimapStore((s) => s.toggle);
  const isDark = theme === "dark";

  const unitInfo = useMemo(() => getDisplayUnit(zoom), [zoom]);

  const formattedX = useMemo(
    () => (cursorX !== undefined ? formatCoordinate(cursorX, unitInfo) : "\u2014"),
    [cursorX, unitInfo],
  );
  const formattedY = useMemo(
    () => (cursorY !== undefined ? formatCoordinate(cursorY, unitInfo) : "\u2014"),
    [cursorY, unitInfo],
  );

  const { length: scaleLength, label: scaleLabel } = useMemo(() => calculateScale(zoom), [zoom]);
  const widthInPixels = Math.min(scaleLength * zoom * GRID_SIZE, SCALE_BAR_MAX_WIDTH);

  const scaleBarInline = !compact && !minimal;

  return (
    <div className="relative flex-shrink-0">
      {/* Floating scale bar — shown above the status bar when compact/minimal */}
      {!scaleBarInline && (
        <div className="absolute bottom-full right-3 mb-2 font-mono text-[11px]">
          <ScaleBar isDark={isDark} widthInPixels={widthInPixels} label={scaleLabel} />
        </div>
      )}

      {/* Status bar row */}
      <div
        className={cn(
          "flex h-6 items-center border-t px-3 font-mono text-[11px]",
          isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
        )}
      >
        {/* Left: Version + Coordinates */}
        <div className="flex min-w-0 flex-shrink-0 items-center gap-1.5">
          {/* Version badge — hidden on compact/minimal */}
          {!compact && !minimal && (
            <>
              <VersionBadge isDark={isDark} />
              <span
                className={cn(
                  "mx-1 select-none pointer-events-none",
                  isDark ? "text-white/20" : "text-black/20",
                )}
              >
                &middot;
              </span>
            </>
          )}

          {minimal ? (
            /* Minimal: combined X,Y */
            <span
              className={cn(
                "text-[10px] select-none pointer-events-none",
                isDark ? "text-white/70" : "text-black/70",
              )}
            >
              {formattedX}, {formattedY} {unitInfo.unit}
            </span>
          ) : (
            /* Default / compact: separate X and Y */
            <>
              <span
                className={cn(
                  "leading-none select-none pointer-events-none",
                  isDark ? "text-white/40" : "text-black/40",
                )}
              >
                x:
              </span>
              <span
                className={cn(
                  "w-18 text-right leading-none select-none pointer-events-none",
                  isDark ? "text-white/70" : "text-black/70",
                )}
              >
                {formattedX}
              </span>
              <span
                className={cn(
                  "text-[10px] leading-none select-none pointer-events-none",
                  isDark ? "text-white/30" : "text-black/30",
                )}
              >
                {unitInfo.unit}
              </span>
              <span
                className={cn(
                  "mx-1 leading-none select-none pointer-events-none",
                  isDark ? "text-white/20" : "text-black/20",
                )}
              >
                &middot;
              </span>
              <span
                className={cn(
                  "leading-none select-none pointer-events-none",
                  isDark ? "text-white/40" : "text-black/40",
                )}
              >
                y:
              </span>
              <span
                className={cn(
                  "w-18 text-right leading-none select-none pointer-events-none",
                  isDark ? "text-white/70" : "text-black/70",
                )}
              >
                {formattedY}
              </span>
              <span
                className={cn(
                  "text-[10px] leading-none select-none pointer-events-none",
                  isDark ? "text-white/30" : "text-black/30",
                )}
              >
                {unitInfo.unit}
              </span>
            </>
          )}
        </div>

        {/* Center: status message > selection info > spacer — hidden on minimal */}
        {!minimal && <CenterInfo isDark={isDark} />}
        {minimal && <div className="flex-1" />}

        {/* Right: Scale bar (inline) + toggles */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {/* Scale bar — inline on full width only */}
          {scaleBarInline && (
            <ScaleBar isDark={isDark} widthInPixels={widthInPixels} label={scaleLabel} />
          )}

          {/* Zen mode toggle */}
          <Tooltip label="Zen Mode" position="top">
            <button
              onClick={toggleZenMode}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none",
                isDark ? "hover:bg-white/10" : "hover:bg-black/10",
                zenMode && (isDark ? "bg-white/10" : "bg-black/10"),
              )}
            >
              <SystemRestart
                width={14}
                height={14}
                className={cn(isDark ? "text-white/50" : "text-black/50")}
              />
            </button>
          </Tooltip>

          {/* Minimap toggle */}
          <Tooltip label="Minimap" position="top" align="end">
            <button
              onClick={toggleMinimap}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none",
                isDark ? "hover:bg-white/10" : "hover:bg-black/10",
                !isMinimapMinimized && (isDark ? "bg-white/10" : "bg-black/10"),
              )}
            >
              <Position
                width={14}
                height={14}
                className={cn(isDark ? "text-white/50" : "text-black/50")}
              />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
