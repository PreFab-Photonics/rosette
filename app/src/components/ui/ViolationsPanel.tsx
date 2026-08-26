import { useMemo } from "react";
import { WarningCircle, WarningTriangle } from "iconoir-react";
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
  const violations = useViolationsStore((s) => s.violations);
  const errorCount = useViolationsStore((s) => s.errorCount);
  const warningCount = useViolationsStore((s) => s.warningCount);
  const suppressed = useViolationsStore((s) => s.suppressed);
  const waived = useViolationsStore((s) => s.waived);
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

  if (!configured) {
    return (
      <div className="px-3 py-4 text-xs text-foreground-muted">
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
      icon: <WarningCircle className="h-3.5 w-3.5 text-danger-strong" />,
    },
    {
      id: "warning",
      label: "Warnings",
      count: warningCount,
      icon: <WarningTriangle className="h-3.5 w-3.5 text-warning-strong" />,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Severity filter buttons with integrated counts */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 text-xs text-foreground">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSeverityFilter(f.id)}
            className={cn(
              "flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 text-[11px] transition-colors focus:outline-none",
              severityFilter === f.id
                ? "bg-interactive text-foreground"
                : "text-foreground-muted hover:bg-interactive",
            )}
          >
            {f.icon}
            <span>{f.label}</span>
            <span className="tabular-nums">{f.count}</span>
          </button>
        ))}
        {(suppressed > 0 || waived > 0) && (
          <span className="ml-auto text-foreground-muted">
            {[
              suppressed > 0 ? `${suppressed} suppressed` : null,
              waived > 0 ? `${waived} waived` : null,
            ]
              .filter(Boolean)
              .join(", ")}
          </span>
        )}
      </div>

      <div className="h-px bg-theme-border" />

      {/* Violation list */}
      {filtered.length === 0 ? (
        <div className="px-3 py-4 text-xs text-foreground-muted">No matching violations.</div>
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
                    "hover:bg-interactive",
                    isSelected && "bg-interactive",
                  )}
                >
                  <span className="flex items-center gap-1.5 text-xs">
                    <span
                      className={cn(
                        "inline-block h-2 w-2 shrink-0 rounded-full",
                        isError ? "bg-danger-strong" : "bg-warning-strong",
                      )}
                    />
                    <span className="font-medium text-foreground">{v.rule}</span>
                    <span className="ml-auto shrink-0 text-foreground-muted tabular-nums">
                      {formatLayer(v.layer)}
                      {v.layer2 ? `, ${formatLayer(v.layer2)}` : ""}
                    </span>
                  </span>
                  <span className="text-[11px] leading-snug text-foreground-muted">
                    {v.message}
                  </span>
                  {hint && <span className="text-[10px] text-foreground-muted italic">{hint}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
