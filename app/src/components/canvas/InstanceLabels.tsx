import { useMemo } from "react";
import { useViewportStore } from "@/stores/viewport";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useSelectionStore } from "@/stores/selection";
import { useExplorerStore } from "@/stores/explorer";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils";

/**
 * Instance label data from the WASM library.
 */
interface InstanceLabel {
  id: string;
  name: string;
  elementIndex: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  columns?: number;
  rows?: number;
}

/** Size of the origin cross arms in CSS pixels. */
const CROSS_ARM = 9;

/**
 * Compute the screen position of an instance's origin (where the child cell's
 * origin lands after applying the CellRef transform).
 *
 * Returns null if the CellRef info can't be retrieved.
 */
function getInstanceOriginScreen(
  library: ReturnType<typeof useWasmContextStore.getState>["library"],
  refId: string,
  zoom: number,
  offset: { x: number; y: number },
): { x: number; y: number } | null {
  if (!library) return null;

  const refInfo = library.get_cell_ref_info(refId);
  if (!refInfo) return null;

  const [a, b, c, d, tx, ty] = refInfo.transform;
  const cellName = refInfo.cell_name;
  refInfo.free();

  // Get the child cell's origin
  const originRaw = library.get_cell_origin_by_name(cellName);
  const ox = originRaw ? originRaw[0] : 0;
  const oy = originRaw ? originRaw[1] : 0;

  // Apply the CellRef transform to the child's origin
  const worldX = a * ox + b * oy + tx;
  const worldY = c * ox + d * oy + ty;

  return {
    x: worldX * zoom + offset.x,
    y: worldY * zoom + offset.y,
  };
}

/**
 * HTML overlay that renders cell instance name labels and origin cross markers.
 *
 * Labels and crosses only appear when an instance is hovered or selected,
 * matching the behavior of polygon outlines. Labels are positioned at the
 * top-left corner of the instance's bounding box. Crosses mark where the
 * child cell's origin lands in the parent.
 */
export function InstanceLabels({ hidden = false }: { hidden?: boolean }) {
  const { zoom, offset } = useViewportStore();
  const library = useWasmContextStore((s) => s.library);
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  // Re-render when library syncs (e.g. during drag moves)
  const syncGeneration = useWasmContextStore((s) => s.syncGeneration);
  // Re-render when switching cells
  const activeCell = useExplorerStore((s) => s.activeCell);
  // Subscribe to selection and hover state
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const hoveredId = useSelectionStore((s) => s.hoveredId);

  const activeIds = new Set(selectedIds);
  if (hoveredId) activeIds.add(hoveredId);
  const hasActiveIds = activeIds.size > 0;

  // Fetch instance metadata only when library content changes. Viewport-only
  // renders should only recalculate the screen positions below.
  const allLabels = useMemo<InstanceLabel[]>(() => {
    void syncGeneration;
    if (!library || !hasActiveIds || hidden) return [];
    try {
      if (library.active_cell_name() !== activeCell) return [];
      const data = library.get_instance_label_data();
      if (data && Array.isArray(data)) {
        return data as InstanceLabel[];
      }
    } catch {
      return [];
    }
    return [];
  }, [library, syncGeneration, activeCell, hasActiveIds, hidden]);

  if (!hasActiveIds || hidden) return null;

  // Filter to only active instances
  const visibleLabels = allLabels.filter((label) => activeIds.has(label.id));
  if (visibleLabels.length === 0) return null;

  const crossColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  return (
    <>
      {visibleLabels.map((label) => {
        // Position at the top-left (min corner) of the bbox
        const screenX = label.minX * zoom + offset.x;
        const screenY = label.minY * zoom + offset.y;

        // Compute the origin cross position for this instance
        const originPos = getInstanceOriginScreen(library, label.id, zoom, offset);

        return (
          <div key={`inst-${label.elementIndex}`}>
            {/* Instance name label */}
            <div
              className={cn(
                "pointer-events-none absolute text-[13px] leading-none font-mono select-none",
                isDark ? "text-white" : "text-black",
              )}
              style={{
                left: `${screenX}px`,
                top: `${screenY}px`,
                transform: "translateY(-100%)",
                paddingBottom: "2px",
              }}
            >
              {label.columns != null && label.rows != null
                ? `${label.name} [${label.columns}×${label.rows}]`
                : label.name}
            </div>

            {/* Origin cross marker */}
            {originPos && (
              <svg
                className="pointer-events-none absolute top-0 left-0 select-none"
                style={{
                  width: `${CROSS_ARM * 2 + 1}px`,
                  height: `${CROSS_ARM * 2 + 1}px`,
                  transform: `translate(${originPos.x - CROSS_ARM}px, ${originPos.y - CROSS_ARM}px)`,
                }}
                viewBox={`0 0 ${CROSS_ARM * 2 + 1} ${CROSS_ARM * 2 + 1}`}
              >
                {/* Horizontal arm */}
                <line
                  x1="0"
                  y1={CROSS_ARM}
                  x2={CROSS_ARM * 2}
                  y2={CROSS_ARM}
                  stroke={crossColor}
                  strokeWidth="1"
                />
                {/* Vertical arm */}
                <line
                  x1={CROSS_ARM}
                  y1="0"
                  x2={CROSS_ARM}
                  y2={CROSS_ARM * 2}
                  stroke={crossColor}
                  strokeWidth="1"
                />
              </svg>
            )}
          </div>
        );
      })}
    </>
  );
}
