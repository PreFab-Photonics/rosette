import { useMemo } from "react";
import { WarningCircle, WarningTriangle } from "iconoir-react";
import { useUIStore } from "@/stores/ui";
import { useViolationsStore, type SeverityFilter, type Violation } from "@/stores/violations";
import { useViewportStore, GRID_SIZE } from "@/stores/viewport";
import { getEffectiveViewport, cn } from "@/lib/utils";

/**
 * World-units-per-micrometer scale. Geometry is imported as `nm * GRID_SIZE`
 * with the Y axis negated (Y-up µm -> Y-down screen). Violation bboxes arrive
 * in µm, so they must be converted the same way before driving the viewport.
 * Matches the Rust `parse_violations` transform and `GoToDialog`.
 */
const UM_TO_WORLD = 1_000 * GRID_SIZE;

/** Format a layer tuple as "number/datatype". */
function formatLayer(layer: [number, number]): string {
  return `${layer[0]}/${layer[1]}`;
}

/** Build the cell-provenance hint, mirroring the CLI phrasing. */
function cellHint(v: Violation): string | null {
  if (v.cell_name && v.cell_name2) {
    return v.cell_name === v.cell_name2
      ? `within '${v.cell_name}'`
      : `between '${v.cell_name}' and '${v.cell_name2}'`;
  }
  if (v.cell_name) return `in '${v.cell_name}'`;
  return null;
}

/**
 * Violations panel — lists DRC violations from the live `rosette serve` DRC
 * run. Clicking a row selects it (emphasized on the canvas) and zooms the
 * viewport to the violation's bounding box.
 */
export function ViolationsPanel() {
  const isDark = useUIStore((s) => s.theme) === "dark";
  const violations = useViolationsStore((s) => s.violations);
  const errorCount = useViolationsStore((s) => s.errorCount);
  const warningCount = useViolationsStore((s) => s.warningCount);
  const suppressed = useViolationsStore((s) => s.suppressed);
  const configured = useViolationsStore((s) => s.configured);
  const selectedIndex = useViolationsStore((s) => s.selectedIndex);
  const severityFilter = useViolationsStore((s) => s.severityFilter);
  const selectViolation = useViolationsStore((s) => s.selectViolation);
  const setSeverityFilter = useViolationsStore((s) => s.setSeverityFilter);

  // Keep original indices so selection/canvas emphasis stays correct under filtering.
  const filtered = useMemo(
    () =>
      violations
        .map((v, index) => ({ v, index }))
        .filter(({ v }) => severityFilter === "all" || v.severity === severityFilter),
    [violations, severityFilter],
  );

  const handleRowClick = (index: number, v: Violation) => {
    selectViolation(index);
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const [[minXum, minYum], [maxXum, maxYum]] = v.bbox;
    // Convert µm -> world units (scaled, Y negated). Negation swaps Y min/max,
    // so re-normalize to keep minY <= maxY.
    const x0 = minXum * UM_TO_WORLD;
    const x1 = maxXum * UM_TO_WORLD;
    const y0 = -minYum * UM_TO_WORLD;
    const y1 = -maxYum * UM_TO_WORLD;
    const bounds = {
      minX: Math.min(x0, x1),
      minY: Math.min(y0, y1),
      maxX: Math.max(x0, x1),
      maxY: Math.max(y0, y1),
    };
    const vp = getEffectiveViewport(canvas);
    useViewportStore.getState().zoomToBounds(bounds, vp.width, vp.height, vp.screenCenter);
  };

  const mutedText = isDark ? "text-white/50" : "text-black/50";
  const rowHover = isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]";

  if (!configured) {
    return (
      <div className={cn("px-3 py-4 text-xs", mutedText)}>
        DRC is not configured. Add a <code>[drc]</code> section to <code>rosette.toml</code> to see
        violations here.
      </div>
    );
  }

  const FILTERS: {
    id: SeverityFilter;
    label: string;
    count: number;
    icon?: React.ReactNode;
  }[] = [
    { id: "all", label: "All", count: errorCount + warningCount },
    {
      id: "error",
      label: "Errors",
      count: errorCount,
      icon: <WarningCircle className="h-3.5 w-3.5 text-red-500" />,
    },
    {
      id: "warning",
      label: "Warnings",
      count: warningCount,
      icon: <WarningTriangle className="h-3.5 w-3.5 text-amber-500" />,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Severity filter buttons with integrated counts */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 px-3 py-2 text-xs",
          isDark ? "text-white/80" : "text-black/80",
        )}
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSeverityFilter(f.id)}
            className={cn(
              "flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 text-[11px] transition-colors focus:outline-none",
              severityFilter === f.id
                ? isDark
                  ? "bg-[rgb(54,54,54)] text-white/90"
                  : "bg-[rgb(217,217,217)] text-black/90"
                : cn(mutedText, rowHover),
            )}
          >
            {f.icon}
            <span>{f.label}</span>
            <span className="tabular-nums">{f.count}</span>
          </button>
        ))}
        {suppressed > 0 && (
          <span className={cn("ml-auto", mutedText)}>{suppressed} suppressed</span>
        )}
      </div>

      <div className={cn("h-px", isDark ? "bg-white/10" : "bg-black/10")} />

      {/* Violation list */}
      {filtered.length === 0 ? (
        <div className={cn("px-3 py-4 text-xs", mutedText)}>No matching violations.</div>
      ) : (
        <ul className="py-1">
          {filtered.map(({ v, index }) => {
            const isSelected = selectedIndex === index;
            const isError = v.severity === "error";
            const hint = cellHint(v);
            return (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleRowClick(index, v)}
                  className={cn(
                    "flex w-full cursor-pointer flex-col gap-0.5 px-3 py-1.5 text-left transition-colors focus:outline-none",
                    rowHover,
                    isSelected && (isDark ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]"),
                  )}
                >
                  <span className="flex items-center gap-1.5 text-xs">
                    <span
                      className={cn(
                        "inline-block h-2 w-2 shrink-0 rounded-full",
                        isError ? "bg-red-500" : "bg-amber-500",
                      )}
                    />
                    <span className={cn("font-medium", isDark ? "text-white/90" : "text-black/90")}>
                      {v.rule}
                    </span>
                    <span className={cn("ml-auto shrink-0 tabular-nums", mutedText)}>
                      {formatLayer(v.layer)}
                      {v.layer2 ? `, ${formatLayer(v.layer2)}` : ""}
                    </span>
                  </span>
                  <span className={cn("text-[11px] leading-snug", mutedText)}>{v.message}</span>
                  {hint && <span className={cn("text-[10px] italic", mutedText)}>{hint}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
