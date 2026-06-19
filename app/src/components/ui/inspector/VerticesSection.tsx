import { useState, useEffect, useRef, useCallback } from "react";
import { type UnitInfo, formatCoordinate } from "@/lib/format";
import { GRID_SIZE } from "@/stores/viewport";
import { cn } from "@/lib/utils";
import { NumberField, SectionHeader } from "./fields";

/**
 * A single vertex group with a header (index + remove) and X/Y NumberField rows.
 *
 * Uses the same full-width NumberField layout as the Position section so labels,
 * values, and units align without overlap.
 */
export function VertexRow({
  index,
  x,
  y,
  unit,
  isDark,
  canRemove,
  onChangeX,
  onChangeY,
  onRemove,
  readOnly,
}: {
  index: number;
  x: string;
  y: string;
  unit: string;
  isDark: boolean;
  canRemove: boolean;
  onChangeX: (value: number) => void;
  onChangeY: (value: number) => void;
  onRemove: () => void;
  readOnly?: boolean;
}) {
  return (
    <div data-vertex-row>
      {/* Vertex header: index label + remove button */}
      <div className="flex items-center justify-between px-3 pt-1.5 pb-0">
        <span
          className={cn(
            "text-[10px] font-mono select-none",
            isDark ? "text-white/30" : "text-black/30",
          )}
        >
          V{index}
        </span>
        {!readOnly && (
          <button
            type="button"
            aria-label="Remove vertex"
            onClick={onRemove}
            disabled={!canRemove}
            className={cn(
              "flex-shrink-0 rounded p-0.5 transition-colors",
              canRemove
                ? isDark
                  ? "text-white/40 hover:bg-white/10 hover:text-white/70"
                  : "text-black/40 hover:bg-black/10 hover:text-black/70"
                : isDark
                  ? "cursor-not-allowed text-white/10"
                  : "cursor-not-allowed text-black/10",
            )}
            tabIndex={canRemove ? 0 : -1}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M4 8h8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {/* X / Y coordinate fields */}
      <NumberField
        label="X"
        value={x}
        unit={unit}
        isDark={isDark}
        onChange={onChangeX}
        readOnly={readOnly}
      />
      <NumberField
        label="Y"
        value={y}
        unit={unit}
        isDark={isDark}
        onChange={onChangeY}
        readOnly={readOnly}
      />
    </div>
  );
}

/**
 * Vertices section for editing polygon vertex coordinates.
 *
 * Displays all vertices with editable X/Y fields, remove buttons per vertex,
 * and an "Add vertex" button at the bottom.
 */
export function VerticesSection({
  vertices,
  unitInfo,
  isDark,
  onChangeVertex,
  onRemoveVertex,
  onAddVertex,
  readOnly,
  label,
}: {
  vertices: Float64Array;
  unitInfo: UnitInfo;
  isDark: boolean;
  onChangeVertex: (index: number, axis: "x" | "y", displayValue: number) => void;
  onRemoveVertex: (index: number) => void;
  onAddVertex: () => void;
  readOnly?: boolean;
  label?: string;
}) {
  const vertexCount = vertices.length / 2;
  const canRemove = vertexCount > 3;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [pendingFocusIndex, setPendingFocusIndex] = useState<number | null>(null);

  // After the new vertex row renders, scroll to bottom and focus its X field.
  // Defers to next frame to ensure the DOM has updated with the new vertex data
  // (WASM dirty-flag triggers re-read via rAF, then React re-renders).
  // Retries up to 10 frames, then gives up. Cleanup cancels pending rAF on unmount.
  useEffect(() => {
    if (pendingFocusIndex === null) return;
    const target = pendingFocusIndex;
    let rafId: number;
    let retries = 0;
    const MAX_RETRIES = 10;

    const tryFocus = () => {
      const container = scrollRef.current;
      if (!container) {
        setPendingFocusIndex(null);
        return;
      }

      const vertexGroups = container.querySelectorAll<HTMLElement>("[data-vertex-row]");
      // Wait until the new vertex is actually in the DOM
      if (vertexGroups.length <= target) {
        retries++;
        if (retries >= MAX_RETRIES) {
          setPendingFocusIndex(null);
          return;
        }
        rafId = requestAnimationFrame(tryFocus);
        return;
      }

      // Scroll to bottom
      container.scrollTop = container.scrollHeight;

      // Focus the X field button of the new last vertex
      const lastGroup = vertexGroups[vertexGroups.length - 1];
      if (lastGroup) {
        const xButton = lastGroup.querySelector<HTMLElement>("[data-field='X'] button");
        if (xButton) {
          xButton.focus();
        }
      }

      setPendingFocusIndex(null);
    };

    rafId = requestAnimationFrame(tryFocus);
    return () => cancelAnimationFrame(rafId);
  }, [pendingFocusIndex]);

  const handleAdd = useCallback(() => {
    onAddVertex();
    // Schedule focus for the next render when the new vertex row exists
    setPendingFocusIndex(vertexCount);
  }, [onAddVertex, vertexCount]);

  const rows = [];
  for (let i = 0; i < vertexCount; i++) {
    const worldX = vertices[i * 2];
    const worldY = vertices[i * 2 + 1];
    // Convert world → nm → display (same as Position fields, Y negated)
    const displayX = formatCoordinate(worldX / GRID_SIZE, unitInfo);
    const displayY = formatCoordinate(-worldY / GRID_SIZE, unitInfo);
    rows.push(
      <VertexRow
        key={i}
        index={i}
        x={displayX}
        y={displayY}
        unit={unitInfo.unit}
        isDark={isDark}
        canRemove={canRemove}
        onChangeX={(v) => onChangeVertex(i, "x", v)}
        onChangeY={(v) => onChangeVertex(i, "y", v)}
        onRemove={() => onRemoveVertex(i)}
        readOnly={readOnly}
      />,
    );
  }

  return (
    <>
      <SectionHeader label={label ?? "Vertices"} isDark={isDark} />
      <div ref={scrollRef} className="flex max-h-48 flex-col overflow-y-auto">
        {rows}
      </div>
      {!readOnly && (
        <div className="px-3 pt-1">
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "flex w-full items-center justify-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors",
              isDark
                ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70"
                : "border-black/10 text-black/50 hover:bg-black/5 hover:text-black/70",
            )}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path d="M8 4v8M4 8h8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add vertex
          </button>
        </div>
      )}
    </>
  );
}
