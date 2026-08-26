import { useCallback, useEffect, useRef } from "react";
import { useAreaDialogStore, type LayerArea } from "@/stores/area-dialog";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { GRID_SIZE } from "@/stores/viewport";

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
function AreaRow({ item }: { item: LayerArea }) {
  return (
    <tr className="border-b border-input last:border-b-0">
      {/* Color swatch */}
      <td className="py-1.5 pr-2 pl-0">
        <span
          aria-label={`Color for ${item.name}`}
          className="inline-block h-3 w-3 rounded border border-theme-border-strong"
          style={{ backgroundColor: item.color }}
        />
      </td>
      {/* Layer name */}
      <td className="py-1.5 pr-3 text-xs text-foreground">{item.name}</td>
      {/* Layer/datatype */}
      <td className="py-1.5 pr-3 font-mono text-xs text-foreground-subtle">
        {item.layerNumber}/{item.datatype}
      </td>
      {/* Area */}
      <td className="py-1.5 text-right font-mono text-xs text-foreground">
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
 * theming). Uses the keyboard-focus stack to disable canvas
 * shortcuts while open.
 */
export function AreaDialog() {
  const { isOpen, close, layerAreas, totalArea, cellName } = useAreaDialogStore();

  useKeyboardFocus("area-dialog", isOpen);

  const contentRef = useRef<HTMLDialogElement>(null);

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
        <dialog
          open
          ref={contentRef}
          aria-label="Area Calculator"
          className="static m-0 w-full max-w-[420px] overflow-hidden rounded-xl border border-theme-border bg-surface p-0 shadow-md backdrop-blur-xl outline-none"
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
          <div className="border-b border-theme-border px-4 py-3 text-sm font-medium text-foreground select-none">
            Area: {cellName}
          </div>

          {/* Table */}
          <div
            className="max-h-[320px] overflow-y-auto px-4 py-3"
            onWheel={(e) => e.stopPropagation()}
          >
            {layerAreas.length === 0 ? (
              <p className="text-xs text-foreground-muted">No geometry in this cell.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-theme-border text-left text-[11px] text-foreground-subtle">
                    <th className="pb-1.5 pr-2 font-normal">
                      <span className="sr-only">Color</span>
                    </th>
                    <th className="pb-1.5 pr-3 font-normal">Layer</th>
                    <th className="pb-1.5 pr-3 font-normal">L/D</th>
                    <th className="pb-1.5 text-right font-normal">{"\u00B5m\u00B2"}</th>
                  </tr>
                </thead>
                <tbody>
                  {layerAreas.map((item) => (
                    <AreaRow key={`${item.layerNumber}:${item.datatype}`} item={item} />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer — total + close */}
          <div className="flex items-center justify-between border-t border-theme-border px-4 py-3">
            {layerAreas.length > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-foreground-secondary select-none">
                  Total
                </span>
                <span className="font-mono text-xs font-medium text-foreground">
                  {formatArea(totalArea)} {"\u00B5m\u00B2"}
                </span>
              </div>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-theme-border px-3 py-1.5 text-xs text-foreground-secondary transition-colors hover:bg-input"
            >
              Close
            </button>
          </div>
        </dialog>
      </div>
    </div>
  );
}
