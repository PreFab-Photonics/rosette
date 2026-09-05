import { useState, useEffect, useRef, useCallback } from "react";
import { type UnitInfo, formatCoordinate } from "@/lib/format";
import { GRID_SIZE } from "@/stores/viewport";
import { cn } from "@/lib/utils";
import { NumberField, SectionHeader } from "./fields";
import { useDocumentStore } from "@/stores/document";

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
  canRemove: boolean;
  onChangeX: (value: number) => void;
  onChangeY: (value: number) => void;
  onRemove: () => void;
  readOnly?: boolean;
}) {
  const sourceBacked = useDocumentStore((s) => s.backing.kind === "source");
  const isReadOnly = Boolean(readOnly || sourceBacked);
  return (
    <div data-vertex-row>
      {/* Vertex header: index label + remove button */}
      <div className="flex items-center justify-between px-3 pt-1.5 pb-0">
        <span className="font-mono text-[10px] text-foreground-faint select-none">V{index}</span>
        {!isReadOnly && (
          <button
            type="button"
            aria-label="Remove vertex"
            onClick={onRemove}
            disabled={!canRemove}
            className={cn(
              "flex-shrink-0 rounded p-0.5 transition-colors",
              canRemove
                ? "text-foreground-subtle hover:bg-theme-border hover:text-foreground-secondary"
                : "cursor-not-allowed text-theme-border",
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
      <NumberField label="X" value={x} unit={unit} onChange={onChangeX} readOnly={isReadOnly} />
      <NumberField label="Y" value={y} unit={unit} onChange={onChangeY} readOnly={isReadOnly} />
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
  onChangeVertex,
  onRemoveVertex,
  onAddVertex,
  readOnly,
  label,
}: {
  vertices: Float64Array;
  unitInfo: UnitInfo;
  onChangeVertex: (index: number, axis: "x" | "y", displayValue: number) => void;
  onRemoveVertex: (index: number) => void;
  onAddVertex: () => void;
  readOnly?: boolean;
  label?: string;
}) {
  const sourceBacked = useDocumentStore((s) => s.backing.kind === "source");
  const isReadOnly = Boolean(readOnly || sourceBacked);
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
        canRemove={canRemove}
        onChangeX={(v) => onChangeVertex(i, "x", v)}
        onChangeY={(v) => onChangeVertex(i, "y", v)}
        onRemove={() => onRemoveVertex(i)}
        readOnly={isReadOnly}
      />,
    );
  }

  return (
    <>
      <SectionHeader label={label ?? "Vertices"} />
      <div ref={scrollRef} className="flex max-h-48 flex-col overflow-y-auto">
        {rows}
      </div>
      {!isReadOnly && (
        <div className="px-3 pt-1">
          <button
            type="button"
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-1 rounded-lg border border-theme-border px-2 py-1 text-xs text-foreground-muted transition-colors hover:bg-input hover:text-foreground-secondary"
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
