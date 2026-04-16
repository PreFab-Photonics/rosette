import { useCallback, useEffect, useRef } from "react";
import { useAreaDialogStore, type LayerArea } from "@/stores/area-dialog";
import { useUIStore } from "@/stores/ui";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { GRID_SIZE } from "@/stores/viewport";
import { cn } from "@/lib/utils";

// =============================================================================
// Helpers
// =============================================================================

/** nm per µm. */
const NM_PER_UM = 1_000;

/**
 * Convert world-unit^2 area to µm^2 for display.
 *
 * World coordinates are `nm * GRID_SIZE`, so world-unit area is
 * `nm^2 * GRID_SIZE^2`. Divide by `GRID_SIZE^2` to get nm^2, then
 * by `1e6` to get µm^2.
 */
function formatArea(worldAreaSq: number): string {
  const areaUmSq = worldAreaSq / (GRID_SIZE * GRID_SIZE * NM_PER_UM * NM_PER_UM);
  if (areaUmSq === 0) return "0";
  if (areaUmSq >= 1) return areaUmSq.toFixed(2);
  // For very small areas, use toPrecision to avoid "0.00"
  return areaUmSq.toPrecision(4);
}

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * A single row in the area table.
 */
function AreaRow({ item, isDark }: { item: LayerArea; isDark: boolean }) {
  return (
    <tr className={cn("border-b last:border-b-0", isDark ? "border-white/5" : "border-black/5")}>
      {/* Color swatch */}
      <td className="py-1.5 pr-2 pl-0">
        <span
          className={cn(
            "inline-block h-3 w-3 rounded border",
            isDark ? "border-white/15" : "border-black/15",
          )}
          style={{ backgroundColor: item.color }}
        />
      </td>
      {/* Layer name */}
      <td className={cn("py-1.5 pr-3 text-xs", isDark ? "text-white/80" : "text-black/80")}>
        {item.name}
      </td>
      {/* Layer/datatype */}
      <td
        className={cn("py-1.5 pr-3 font-mono text-xs", isDark ? "text-white/40" : "text-black/40")}
      >
        {item.layerNumber}/{item.datatype}
      </td>
      {/* Area */}
      <td
        className={cn(
          "py-1.5 text-right font-mono text-xs",
          isDark ? "text-white/80" : "text-black/80",
        )}
      >
        {formatArea(item.area)}
      </td>
    </tr>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Modal dialog displaying per-layer polygon area for the active cell.
 *
 * Computes area recursively across all instanced cells. Styled consistently
 * with GoToDialog and ArrayDialog (centered overlay, backdrop-blur,
 * dark/light theming). Uses the keyboard-focus stack to disable canvas
 * shortcuts while open.
 */
export function AreaDialog() {
  const { isOpen, close, layerAreas, totalArea, cellName } = useAreaDialogStore();
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  useKeyboardFocus("area-dialog", isOpen);

  const contentRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        close();
      }
    },
    [close],
  );

  useEffect(() => {
    if (!isOpen) return;
    // Focus the dialog so Escape key works immediately
    contentRef.current?.focus();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClickOutside]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="fixed inset-0 flex items-start justify-center px-4 pt-[min(20vh,160px)]">
        <div
          ref={contentRef}
          role="dialog"
          aria-label="Area Calculator"
          className={cn(
            "w-full max-w-[420px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl outline-none",
            isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
          )}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              close();
            }
          }}
          // Make focusable for Escape key
          tabIndex={-1}
        >
          {/* Header */}
          <div
            className={cn(
              "border-b px-4 py-3 text-sm font-medium select-none",
              isDark ? "border-white/10 text-white/90" : "border-black/10 text-black/90",
            )}
          >
            Area: {cellName}
          </div>

          {/* Table */}
          <div
            className="max-h-[320px] overflow-y-auto px-4 py-3"
            onWheel={(e) => e.stopPropagation()}
          >
            {layerAreas.length === 0 ? (
              <p className={cn("text-xs", isDark ? "text-white/50" : "text-black/50")}>
                No geometry in this cell.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr
                    className={cn(
                      "border-b text-left text-[11px]",
                      isDark ? "border-white/10 text-white/40" : "border-black/10 text-black/40",
                    )}
                  >
                    <th className="pb-1.5 pr-2 font-normal" />
                    <th className="pb-1.5 pr-3 font-normal">Layer</th>
                    <th className="pb-1.5 pr-3 font-normal">L/D</th>
                    <th className="pb-1.5 text-right font-normal">{"\u00B5m\u00B2"}</th>
                  </tr>
                </thead>
                <tbody>
                  {layerAreas.map((item) => (
                    <AreaRow
                      key={`${item.layerNumber}:${item.datatype}`}
                      item={item}
                      isDark={isDark}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer — total + close */}
          <div
            className={cn(
              "flex items-center justify-between border-t px-4 py-3",
              isDark ? "border-white/10" : "border-black/10",
            )}
          >
            {layerAreas.length > 0 ? (
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-xs font-medium select-none",
                    isDark ? "text-white/60" : "text-black/60",
                  )}
                >
                  Total
                </span>
                <span
                  className={cn(
                    "font-mono text-xs font-medium",
                    isDark ? "text-white/90" : "text-black/90",
                  )}
                >
                  {formatArea(totalArea)} {"\u00B5m\u00B2"}
                </span>
              </div>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={close}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                isDark
                  ? "border-white/10 text-white/70 hover:bg-white/5"
                  : "border-black/10 text-black/70 hover:bg-black/5",
              )}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
