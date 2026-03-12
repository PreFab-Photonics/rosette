import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelectionStore } from "@/stores/selection";
import { useLayerStore } from "@/stores/layer";
import { useUIStore } from "@/stores/ui";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import {
  ChangeElementLayerCommand,
  EditVerticesCommand,
  ResizeElementsCommand,
  MoveElementsToCommand,
  SetCellOriginCommand,
  RenameCellCommand,
  UpdateTextContentCommand,
  MoveTextCommand,
  SetTextHeightCommand,
  type ArrayParams,
} from "@/lib/commands";
import { useExplorerStore, type CellNode } from "@/stores/explorer";
import { formatCoordinate, type UnitInfo } from "@/lib/format";
import { GRID_SIZE } from "@/stores/viewport";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

interface ElementData {
  id: string;
  layer: number;
  datatype: number;
  vertexCount: number;
  /** Flat vertex array [x0, y0, x1, y1, ...] in world coordinates. */
  vertices: Float64Array;
}

interface InstanceData {
  cellName: string;
  /** Effective world-space X: transform applied to child cell origin. */
  x: number;
  /** Effective world-space Y: transform applied to child cell origin. */
  y: number;
  /** Raw transform tx (needed for computing move deltas). */
  tx: number;
  /** Raw transform ty (needed for computing move deltas). */
  ty: number;
  /** Rotation in degrees (extracted from the linear part of the transform). */
  rotation: number;
  /** Uniform scale factor (extracted from the linear part of the transform). */
  scale: number;
  /** The full raw transform [a, b, c, d, tx, ty] for building modified transforms. */
  transform: Float64Array;
  /** Child cell origin in child-local coordinates (for pivot-correct rotation/scale). */
  childOriginX: number;
  childOriginY: number;
  /** Array repetition parameters, or null if not arrayed. */
  array: ArrayParams | null;
  /** A single synthetic ref UUID for this instance (used by set_cell_ref_transform). */
  refId: string;
  /** All selected IDs belonging to this instance (needed for translate). */
  ids: string[];
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Editable numeric field with label.
 *
 * Confirms on Enter/blur, reverts on Escape.
 * Tab/Shift+Tab advances to the next/previous field via native browser tabbing.
 * Enter/Space on the display button starts editing.
 */
function NumberField({
  label,
  value,
  unit,
  isDark,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  unit?: string;
  isDark: boolean;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);

  // Sync display value when external value changes while not editing
  useEffect(() => {
    if (!editing) {
      setEditValue(value);
    }
  }, [value, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleBlur = useCallback(() => {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      setEditing(false);
      return;
    }
    const parsed = Number.parseFloat(editValue);
    if (!Number.isNaN(parsed) && onChange) {
      onChange(parsed);
    }
    setEditing(false);
  }, [editValue, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inputRef.current?.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        cancelledRef.current = true;
        setEditValue(value);
        inputRef.current?.blur();
      }
    },
    [value],
  );

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-1" data-field={label}>
      <span className={cn("text-xs select-none", readOnly
        ? isDark ? "text-white/30" : "text-black/30"
        : isDark ? "text-white/50" : "text-black/50",
      )}>
        {label}
      </span>
      <div className="flex items-center gap-1">
        {editing && !readOnly ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "w-20 rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none",
              isDark
                ? "border-white/10 bg-white/5 text-white/90"
                : "border-black/10 bg-black/5 text-black/90",
            )}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!readOnly && onChange) {
                setEditing(true);
              }
            }}
            onFocus={() => {
              if (!readOnly && onChange) {
                setEditing(true);
              }
            }}
            className={cn(
              "w-20 rounded border border-transparent px-1.5 py-0.5 text-right font-mono text-xs outline-none transition-colors",
              readOnly
                ? isDark
                  ? "text-white/30"
                  : "text-black/30"
                : isDark
                  ? "cursor-text text-white/90 hover:bg-white/5"
                  : "cursor-text text-black/90 hover:bg-black/5",
            )}
            tabIndex={readOnly ? -1 : 0}
          >
            {value}
          </button>
        )}
        {unit && (
          <span
            className={cn("w-6 text-xs select-none", readOnly
              ? isDark ? "text-white/20" : "text-black/20"
              : isDark ? "text-white/40" : "text-black/40",
            )}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Editable text field with label.
 *
 * Same interaction model as NumberField: click/focus to edit, Enter/blur to confirm, Escape to cancel.
 */
function TextField({
  label,
  value,
  isDark,
  onChange,
}: {
  label: string;
  value: string;
  isDark: boolean;
  onChange: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!editing) {
      setEditValue(value);
    }
  }, [value, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleBlur = useCallback(() => {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      setEditing(false);
      return;
    }
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    }
    setEditing(false);
  }, [editValue, value, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inputRef.current?.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        cancelledRef.current = true;
        setEditValue(value);
        inputRef.current?.blur();
      }
    },
    [value],
  );

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-1" data-field={label}>
      <span className={cn("text-xs select-none", isDark ? "text-white/50" : "text-black/50")}>
        {label}
      </span>
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "w-32 rounded border px-1.5 py-0.5 text-right text-xs outline-none",
            isDark
              ? "border-white/10 bg-white/5 text-white/90"
              : "border-black/10 bg-black/5 text-black/90",
          )}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          onFocus={() => setEditing(true)}
          className={cn(
            "w-32 truncate rounded border border-transparent px-1.5 py-0.5 text-right text-xs outline-none transition-colors",
            isDark
              ? "cursor-text text-white/90 hover:bg-white/5"
              : "cursor-text text-black/90 hover:bg-black/5",
          )}
          tabIndex={0}
        >
          {value}
        </button>
      )}
    </div>
  );
}

/**
 * Multi-line text area field.
 *
 * Click to edit, Escape to cancel, blur to confirm. Shift+Enter inserts
 * newlines, plain Enter confirms (matching the inline canvas behaviour).
 */
function TextAreaField({
  label,
  value,
  isDark,
  onChange,
}: {
  label: string;
  value: string;
  isDark: boolean;
  onChange: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!editing) {
      setEditValue(value);
    }
  }, [value, editing]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  const handleBlur = useCallback(() => {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      setEditing(false);
      return;
    }
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    }
    setEditing(false);
  }, [editValue, value, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        textareaRef.current?.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        cancelledRef.current = true;
        setEditValue(value);
        textareaRef.current?.blur();
      }
    },
    [value],
  );

  // Preview: show up to 2 lines, truncate the rest
  const previewLines = value.split("\n");
  const preview = previewLines.length > 2 ? `${previewLines.slice(0, 2).join("\n")}...` : value;

  return (
    <div className="px-3 py-1" data-field={label}>
      <div className="flex items-center justify-between gap-2 pb-1">
        <span className={cn("text-xs select-none", isDark ? "text-white/50" : "text-black/50")}>
          {label}
        </span>
      </div>
      {editing ? (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          rows={Math.min(6, Math.max(2, editValue.split("\n").length))}
          className={cn(
            "w-full resize-none rounded border px-1.5 py-1 font-mono text-xs leading-relaxed outline-none",
            isDark
              ? "border-white/10 bg-white/5 text-white/90"
              : "border-black/10 bg-black/5 text-black/90",
          )}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          onFocus={() => setEditing(true)}
          className={cn(
            "w-full whitespace-pre-wrap rounded border border-transparent px-1.5 py-1 text-left font-mono text-xs leading-relaxed outline-none transition-colors",
            isDark
              ? "cursor-text text-white/90 hover:bg-white/5"
              : "cursor-text text-black/90 hover:bg-black/5",
          )}
          tabIndex={0}
        >
          {preview || <span className={isDark ? "text-white/30" : "text-black/30"}>Empty</span>}
        </button>
      )}
    </div>
  );
}

/**
 * Layer selector dropdown for changing element layer.
 *
 * Custom popover select that matches the app design language, replacing
 * the native <select> which can't be styled (no color swatches, no dark
 * mode in the dropdown, OS-rendered options).
 *
 * Uses local state for optimistic updates so the trigger reflects
 * the new value immediately instead of waiting for the WASM
 * round-trip (delete + recreate) to propagate through React.
 */
function LayerSelector({
  currentLayer,
  currentDatatype,
  isDark,
  onChange,
}: {
  currentLayer: number;
  currentDatatype: number;
  isDark: boolean;
  onChange: (layer: number, datatype: number) => void;
}) {
  const layers = useLayerStore((s) => s.getAllLayers)();

  const [localValue, setLocalValue] = useState(`${currentLayer}:${currentDatatype}`);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  useKeyboardFocus("layer-selector", isOpen);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync from props (e.g., selecting a different element, undo)
  const canonical = `${currentLayer}:${currentDatatype}`;
  useEffect(() => {
    setLocalValue(canonical);
  }, [canonical]);

  const selectedLayer = layers.find((l) => `${l.layerNumber}:${l.datatype}` === localValue);

  // When opening: set highlight, compute position, focus the dropdown
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0, width: 0 });

  const open = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
      width: Math.max(rect.width, 160),
    });
    const idx = layers.findIndex((l) => `${l.layerNumber}:${l.datatype}` === localValue);
    setHighlightIndex(idx >= 0 ? idx : 0);
    setIsOpen(true);
  }, [layers, localValue]);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const select = useCallback(
    (l: { layerNumber: number; datatype: number }) => {
      setLocalValue(`${l.layerNumber}:${l.datatype}`);
      onChange(l.layerNumber, l.datatype);
      close();
    },
    [onChange, close],
  );

  // Focus the dropdown div when it mounts so it receives keyboard events
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen]);

  // Keyboard on trigger: open on arrow/enter/space
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    },
    [open],
  );

  // Keyboard on dropdown: navigate, select, close
  const handleDropdownKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          setHighlightIndex((i) => Math.min(i + 1, layers.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          setHighlightIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
        case " ": {
          e.preventDefault();
          e.stopPropagation();
          const layer = layers[highlightIndex];
          if (layer) select(layer);
          break;
        }
        case "Escape":
        case "Tab":
          e.preventDefault();
          e.stopPropagation();
          close();
          break;
      }
    },
    [layers, highlightIndex, select, close],
  );

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-1">
      <span className={cn("text-xs select-none", isDark ? "text-white/50" : "text-black/50")}>
        Layer
      </span>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex max-w-36 items-center gap-1.5 rounded-lg border px-1.5 py-0.5 text-xs outline-none transition-colors",
          isDark
            ? "border-white/10 bg-white/5 text-white/90 hover:bg-white/10 focus-visible:border-white/40"
            : "border-black/10 bg-black/5 text-black/90 hover:bg-black/10 focus-visible:border-black/40",
        )}
      >
        {selectedLayer && (
          <div
            className={cn(
              "h-3 w-3 flex-shrink-0 rounded-sm border",
              isDark ? "border-white/10" : "border-black/10",
            )}
            style={{ backgroundColor: selectedLayer.color }}
          />
        )}
        <span className="truncate">
          {selectedLayer ? selectedLayer.name : `${currentLayer}/${currentDatatype}`}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          className={cn(
            "flex-shrink-0 transition-transform",
            isOpen && "rotate-180",
            isDark ? "text-white/40" : "text-black/40",
          )}
        >
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            tabIndex={-1}
            onKeyDown={handleDropdownKeyDown}
            className={cn(
              "fixed z-50 overflow-y-auto rounded-xl border py-1 shadow-lg outline-none",
              isDark
                ? "border-white/10 bg-[rgb(29,29,29)]"
                : "border-black/10 bg-[rgb(241,241,241)]",
            )}
            style={{
              top: dropdownPos.top,
              right: dropdownPos.right,
              minWidth: dropdownPos.width,
              maxHeight: 200,
            }}
          >
            {layers.map((l, i) => {
              const value = `${l.layerNumber}:${l.datatype}`;
              const isSelected = value === localValue;
              const isHighlighted = i === highlightIndex;
              return (
                <div
                  key={l.id}
                  data-layer-option
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors",
                    isHighlighted
                      ? isDark
                        ? "bg-[rgb(54,54,54)] text-white/90"
                        : "bg-[rgb(217,217,217)] text-black/90"
                      : isDark
                        ? "text-white/70"
                        : "text-black/70",
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(l);
                  }}
                  onMouseEnter={() => setHighlightIndex(i)}
                >
                  <div
                    className={cn(
                      "h-3.5 w-3.5 flex-shrink-0 rounded-sm border",
                      isDark ? "border-white/10" : "border-black/10",
                    )}
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="flex-1 truncate">{l.name}</span>
                  <span
                    className={cn(
                      "flex-shrink-0 font-mono text-[11px]",
                      isDark ? "text-white/40" : "text-black/40",
                    )}
                  >
                    {l.layerNumber}/{l.datatype}
                  </span>
                  {isSelected && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      className={cn("flex-shrink-0", isDark ? "text-white/70" : "text-black/70")}
                    >
                      <path
                        d="M3.5 8.5l3 3 6-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}

/**
 * Section header for grouping inspector fields.
 */
function SectionHeader({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <div
      className={cn(
        "px-3 pt-2.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider select-none",
        isDark ? "text-white/30" : "text-black/30",
      )}
    >
      {label}
    </div>
  );
}

/**
 * A single vertex group with a header (index + remove) and X/Y NumberField rows.
 *
 * Uses the same full-width NumberField layout as the Position section so labels,
 * values, and units align without overlap.
 */
function VertexRow({
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
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path d="M4 8h8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {/* X / Y coordinate fields */}
      <NumberField label="X" value={x} unit={unit} isDark={isDark} onChange={onChangeX} readOnly={readOnly} />
      <NumberField label="Y" value={y} unit={unit} isDark={isDark} onChange={onChangeY} readOnly={readOnly} />
    </div>
  );
}

/**
 * Vertices section for editing polygon vertex coordinates.
 *
 * Displays all vertices with editable X/Y fields, remove buttons per vertex,
 * and an "Add vertex" button at the bottom.
 */
function VerticesSection({
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

// =============================================================================
// Hooks
// =============================================================================

/**
 * Reads element data and bounds from the WASM library for the given selection.
 *
 * Returns null when nothing is selected or the library is unavailable.
 * Recomputes whenever selectedIds change.
 */
function useSelectedElementData(): {
  elements: ElementData[];
  bounds: Bounds | null;
  isMixed: boolean;
  /** Non-null when the selection is a single CellRef instance. */
  instance: InstanceData | null;
} | null {
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const library = useWasmContextStore((s) => s.library);

  // Force re-read when element geometry changes (e.g., during drag moves, undo/redo).
  // Uses requestAnimationFrame for frame-rate updates instead of slow polling.
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!library || selectedIds.size === 0) return;
    let rafId: number;
    const tick = () => {
      if (library.is_dirty()) {
        setVersion((v) => v + 1);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [library, selectedIds]);

  return useMemo(() => {
    if (selectedIds.size === 0 || !library) return null;

    // Detect if the selection is a CellRef instance.
    // All synthetic ref UUIDs for one instance share the same element index (ref:{elemIdx}:*).
    // Check the first selected ID — if it's a ref, try to get CellRef info.
    let instance: InstanceData | null = null;
    const firstId = selectedIds.values().next().value as string;
    if (firstId.startsWith("ref:")) {
      const refInfo = library.get_cell_ref_info(firstId);
      if (refInfo) {
        const [a, b, c, d, tx, ty] = refInfo.transform;
        // Compute the effective position: where the child cell's origin
        // lands in the parent after applying the CellRef transform.
        const childOriginRaw = library.get_cell_origin_by_name(refInfo.cell_name);
        const ox = childOriginRaw ? childOriginRaw[0] : 0;
        const oy = childOriginRaw ? childOriginRaw[1] : 0;

        // Extract rotation (radians → degrees) and uniform scale from the linear part.
        // For an affine [a,b,c,d]: rotation = atan2(c, a), scale = sqrt(a² + c²).
        const rotationRad = Math.atan2(c, a);
        const rotationDeg = (rotationRad * 180) / Math.PI;
        const scale = Math.sqrt(a * a + c * c);

        // Read array repetition parameters
        const arrayRaw = library.get_cell_ref_array(firstId);
        let arrayParams: ArrayParams | null = null;
        if (arrayRaw && arrayRaw.length === 4) {
          arrayParams = {
            columns: arrayRaw[0],
            rows: arrayRaw[1],
            colSpacing: arrayRaw[2],
            rowSpacing: arrayRaw[3],
          };
        }

        instance = {
          cellName: refInfo.cell_name,
          x: a * ox + b * oy + tx,
          y: c * ox + d * oy + ty,
          tx,
          ty,
          rotation: rotationDeg,
          scale,
          transform: new Float64Array(refInfo.transform),
          childOriginX: ox,
          childOriginY: oy,
          array: arrayParams,
          refId: firstId,
          ids: [...selectedIds],
        };
        refInfo.free();
      }
    }

    const elements: ElementData[] = [];
    for (const id of selectedIds) {
      const info = library.get_element_info(id);
      if (info) {
        elements.push({
          id,
          layer: info.layer,
          datatype: info.datatype,
          vertexCount: info.vertices.length / 2,
          vertices: new Float64Array(info.vertices),
        });
        info.free();
      }
    }

    if (elements.length === 0) return null;

    // Get merged bounds
    const boundsArray = library.get_bounds_for_ids([...selectedIds]);
    const bounds: Bounds | null = boundsArray
      ? { minX: boundsArray[0], minY: boundsArray[1], maxX: boundsArray[2], maxY: boundsArray[3] }
      : null;

    // Check if mixed layers
    const firstLayer = elements[0].layer;
    const firstDatatype = elements[0].datatype;
    const isMixed = elements.some((e) => e.layer !== firstLayer || e.datatype !== firstDatatype);

    // Suppress unused variable warning -- version is only used to trigger re-computation
    void version;

    return { elements, bounds, isMixed, instance };
  }, [selectedIds, library, version]);
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Inspector panel for viewing and editing selected element properties.
 *
 * Designed to be embedded in the sidebar alongside the Layers panel.
 *
 * Features:
 * - View element layer, datatype, position, dimensions
 * - Edit layer/datatype via dropdown
 * - Edit position (X, Y) with translation
 * - Edit dimensions (Width, Height) with scaling
 * - Multi-selection shows count and batch layer editing
 * - All edits are undoable via the command/history system
 */
/** Fixed display unit for the inspector panel: always microns. */
const UNIT_UM: UnitInfo = { unit: "\u00B5m", scale: 1_000 };

export function InspectorPanel() {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";
  const unitInfo = UNIT_UM;

  const data = useSelectedElementData();
  const library = useWasmContextStore((s) => s.library);
  const renderer = useWasmContextStore((s) => s.renderer);

  // Cell inspector data (shown when nothing is selected)
  const activeCell = useExplorerStore((s) => s.activeCell);
  const cellTree = useExplorerStore((s) => s.cellTree);

  // Detect if the active cell is a parent (has children = CellRef instances).
  // When true, only position is editable in the inspector; everything else is read-only.
  const isParentCell = useMemo(() => {
    if (!activeCell || !cellTree) return false;
    const findNode = (nodes: CellNode[]): CellNode | undefined => {
      for (const node of nodes) {
        if (node.name === activeCell) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
    };
    const node = findNode(cellTree);
    return node ? node.children.length > 0 : false;
  }, [activeCell, cellTree]);

  // Subscribe to history changes so cell inspector re-reads origin after undo/redo/execute.
  // The value itself is unused; the subscription triggers re-renders.
  useHistoryStore((s) => s.undoStack.length + s.redoStack.length);

  // Read cell origin — not memoized because we need fresh data after undo/redo.
  // Only used when nothing is selected (cell inspector), so it's cheap.
  const cellOriginRaw = library?.get_cell_origin();
  const cellOrigin = cellOriginRaw ? { x: cellOriginRaw[0], y: cellOriginRaw[1] } : { x: 0, y: 0 };
  const cellOriginRef = useRef(cellOrigin);
  cellOriginRef.current = cellOrigin;

  const handleCellRename = useCallback(
    (newName: string) => {
      if (!activeCell || !library || !renderer) return;
      if (newName === activeCell) return;
      const cmd = new RenameCellCommand(activeCell, newName);
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [activeCell, library, renderer],
  );

  const handleCellOriginChange = useCallback(
    (axis: "x" | "y", displayValue: number) => {
      if (!library || !renderer) return;
      // Convert display µm → nm → world coordinates. Y is negated.
      const valueInNm = displayValue * unitInfo.scale;
      const worldValue = axis === "y" ? -valueInNm * GRID_SIZE : valueInNm * GRID_SIZE;

      const cur = cellOriginRef.current;
      const cmd = new SetCellOriginCommand(
        cur.x,
        cur.y,
        axis === "x" ? worldValue : cur.x,
        axis === "y" ? worldValue : cur.y,
      );
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [library, renderer, unitInfo],
  );

  const handleLayerChange = useCallback(
    (newLayer: number, newDatatype: number) => {
      if (!data || !library || !renderer) return;

      const ids = data.elements.map((e) => e.id);
      const cmd = new ChangeElementLayerCommand(ids, newLayer, newDatatype);
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [data, library, renderer],
  );

  const handlePositionChange = useCallback(
    (axis: "x" | "y", displayValue: number) => {
      if (!data?.bounds || !library || !renderer) return;

      // Convert from display units → nm → world coordinates.
      // Y is negated (screen Y-up → world Y-down).
      const valueInNm = displayValue * unitInfo.scale;
      const worldValue = axis === "y" ? -valueInNm * GRID_SIZE : valueInNm * GRID_SIZE;

      const ids = data.elements.map((e) => e.id);
      const cmd = new MoveElementsToCommand(
        ids,
        data.bounds.minX,
        data.bounds.minY,
        axis === "x" ? worldValue : data.bounds.minX,
        // For Y, the user edits minY in display coords which maps to -maxY in world,
        // so we target: new world maxY = -worldValue, delta applies to minY accordingly.
        axis === "y" ? worldValue - (data.bounds.maxY - data.bounds.minY) : data.bounds.minY,
      );
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [data, library, renderer, unitInfo],
  );

  const handleDimensionChange = useCallback(
    (dimension: "width" | "height", displayValue: number) => {
      if (!data?.bounds || !library || !renderer) return;

      // Convert from display units → nm → world coordinates.
      const valueInNm = displayValue * unitInfo.scale;
      const worldValue = valueInNm * GRID_SIZE;
      if (worldValue <= 0) return;

      const currentWidth = data.bounds.maxX - data.bounds.minX;
      const currentHeight = data.bounds.maxY - data.bounds.minY;

      const ids = data.elements.map((e) => e.id);
      const cmd = new ResizeElementsCommand(
        ids,
        data.bounds,
        dimension === "width" ? worldValue : currentWidth,
        dimension === "height" ? worldValue : currentHeight,
      );
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [data, library, renderer, unitInfo],
  );

  const handleVertexChange = useCallback(
    (index: number, axis: "x" | "y", displayValue: number) => {
      if (!data || !library || !renderer) return;
      const el = data.elements[0];
      if (!el) return;

      const newVerts = new Float64Array(el.vertices);
      // Convert display → nm → world. Y is negated.
      const valueInNm = displayValue * unitInfo.scale;
      const worldValue = axis === "y" ? -valueInNm * GRID_SIZE : valueInNm * GRID_SIZE;

      newVerts[index * 2 + (axis === "x" ? 0 : 1)] = worldValue;

      const cmd = new EditVerticesCommand(el.id, newVerts, "Edit vertex");
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [data, library, renderer, unitInfo],
  );

  const handleVertexRemove = useCallback(
    (index: number) => {
      if (!data || !library || !renderer) return;
      const el = data.elements[0];
      if (!el || el.vertexCount <= 3) return;

      // Remove the vertex at `index` by copying all others
      const newVerts = new Float64Array(el.vertices.length - 2);
      let writeIdx = 0;
      for (let i = 0; i < el.vertexCount; i++) {
        if (i === index) continue;
        newVerts[writeIdx] = el.vertices[i * 2];
        newVerts[writeIdx + 1] = el.vertices[i * 2 + 1];
        writeIdx += 2;
      }

      const cmd = new EditVerticesCommand(el.id, newVerts, "Remove vertex");
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [data, library, renderer],
  );

  const handleVertexAdd = useCallback(() => {
    if (!data || !library || !renderer) return;
    const el = data.elements[0];
    if (!el) return;

    const count = el.vertexCount;
    // Insert a new vertex as the midpoint of the last edge (last vertex → first vertex)
    const lastX = el.vertices[(count - 1) * 2];
    const lastY = el.vertices[(count - 1) * 2 + 1];
    const firstX = el.vertices[0];
    const firstY = el.vertices[1];
    const midX = (lastX + firstX) / 2;
    const midY = (lastY + firstY) / 2;

    const newVerts = new Float64Array(el.vertices.length + 2);
    newVerts.set(el.vertices);
    newVerts[el.vertices.length] = midX;
    newVerts[el.vertices.length + 1] = midY;

    const cmd = new EditVerticesCommand(el.id, newVerts, "Add vertex");
    useHistoryStore.getState().execute(cmd, { library, renderer });
  }, [data, library, renderer]);


  // Native keydown listener on the panel container.
  // - Tab/Shift+Tab: cycle through focusable fields with wrap-around.
  // - Escape: stop propagation so canvas shortcuts don't fire.
  // Uses a native listener so it fires before the window-level shortcut handler.
  // Must be declared before the early return to satisfy Rules of Hooks.
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const handleKey = (e: KeyboardEvent) => {
      // Escape while editing an input: let the input's React onKeyDown handle
      // the cancel/revert logic. We only stop propagation at the window level
      // so canvas shortcuts don't fire — but we must NOT stop it here on the
      // panel, because that would prevent React (which listens at the root)
      // from ever seeing the event.
      if (e.key === "Escape") {
        return;
      }
      if (e.key === "Tab") {
        e.stopPropagation();
        e.preventDefault();
        const focusable = Array.from(
          el.querySelectorAll<HTMLElement>(
            "input, button:not([tabindex='-1']):not([data-layer-option])",
          ),
        );
        if (focusable.length === 0) return;
        const idx = focusable.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey
          ? (idx - 1 + focusable.length) % focusable.length
          : (idx + 1) % focusable.length;
        focusable[next].focus();
      }
    };
    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, []);

  // Focus an input field when requested (e.g., from context menu "Edit" or command palette).
  // When inspectorFocusField is set, targets the specific field by data-field attribute;
  // otherwise falls back to the first focusable input.
  const focusRequested = useUIStore((s) => s.inspectorFocusRequested);
  const focusField = useUIStore((s) => s.inspectorFocusField);
  useEffect(() => {
    if (!focusRequested || !panelRef.current) return;
    useUIStore.getState().clearInspectorFocus();
    // Defer to next frame so the panel DOM is fully rendered
    requestAnimationFrame(() => {
      const el = panelRef.current;
      if (!el) return;
      let target: HTMLElement | null = null;
      if (focusField) {
        const fieldEl = el.querySelector<HTMLElement>(`[data-field="${focusField}"]`);
        if (fieldEl) {
          target = fieldEl.querySelector<HTMLElement>("button:not([tabindex='-1']), input");
        }
      }
      if (!target) {
        target = el.querySelector<HTMLElement>(
          "input, button:not([tabindex='-1']):not([data-layer-option])",
        );
      }
      if (target) target.focus();
    });
  }, [focusRequested, focusField]);

  // Cell inspector (no selection)
  if (!data) {
    const originX = formatCoordinate(cellOrigin.x / GRID_SIZE, unitInfo);
    const originY = formatCoordinate(-cellOrigin.y / GRID_SIZE, unitInfo);

    return (
      <div ref={panelRef} className="flex flex-col pb-2" onWheel={(e) => e.stopPropagation()}>
        {/* Cell header */}
        <div className="px-3 pt-2 pb-1">
          <span
            className={cn(
              "text-xs font-medium select-none",
              isDark ? "text-white/70" : "text-black/70",
            )}
          >
            Cell
          </span>
        </div>

        {/* Divider */}
        <div className={cn("mx-3 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Name */}
        <SectionHeader label="Name" isDark={isDark} />
        {activeCell ? (
          <TextField label="Name" value={activeCell} isDark={isDark} onChange={handleCellRename} />
        ) : (
          <div className="px-3 py-1">
            <span
              className={cn(
                "text-xs italic select-none",
                isDark ? "text-white/40" : "text-black/40",
              )}
            >
              No cell
            </span>
          </div>
        )}

        {/* Divider */}
        <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Origin */}
        <SectionHeader label="Origin" isDark={isDark} />
        <NumberField
          label="X"
          value={originX}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={(v) => handleCellOriginChange("x", v)}
        />
        <NumberField
          label="Y"
          value={originY}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={(v) => handleCellOriginChange("y", v)}
        />
      </div>
    );
  }

  const { elements, bounds, isMixed } = data;
  const isSingle = elements.length === 1;
  const first = elements[0];

  // Text inspector (single text element selected)
  if (isSingle && library && library.is_text_element(first.id)) {
    const textInfo = library.get_text_element_info(first.id) as {
      text: string;
      x: number;
      y: number;
      height: number;
      layer: number;
      datatype: number;
    } | null;

    if (textInfo) {
      const textX = formatCoordinate(textInfo.x / GRID_SIZE, unitInfo);
      const textY = formatCoordinate(-textInfo.y / GRID_SIZE, unitInfo);
      const textHeight = formatCoordinate(textInfo.height / GRID_SIZE, unitInfo);

      const handleTextPositionChange = (axis: "x" | "y", displayValue: number) => {
        if (!renderer) return;
        const valueInNm = displayValue * unitInfo.scale;
        const worldValue = axis === "y" ? -valueInNm * GRID_SIZE : valueInNm * GRID_SIZE;
        const cmd = new MoveTextCommand(
          first.id,
          textInfo.x,
          textInfo.y,
          axis === "x" ? worldValue : textInfo.x,
          axis === "y" ? worldValue : textInfo.y,
        );
        useHistoryStore.getState().execute(cmd, { library, renderer });
      };

      const handleTextContentChange = (newContent: string) => {
        if (!renderer || newContent === textInfo.text) return;
        const cmd = new UpdateTextContentCommand(first.id, textInfo.text, newContent);
        useHistoryStore.getState().execute(cmd, { library, renderer });
        useWasmContextStore.getState().bumpSyncGeneration();
      };

      const handleTextHeightChange = (displayValue: number) => {
        if (!renderer) return;
        const valueInNm = displayValue * unitInfo.scale;
        const worldValue = valueInNm * GRID_SIZE;
        if (worldValue <= 0) return;
        const cmd = new SetTextHeightCommand(first.id, textInfo.height, worldValue);
        useHistoryStore.getState().execute(cmd, { library, renderer });
        useWasmContextStore.getState().bumpSyncGeneration();
      };

      const handleTextLayerChange = (newLayer: number, newDatatype: number) => {
        if (!renderer) return;
        const cmd = new ChangeElementLayerCommand([first.id], newLayer, newDatatype);
        useHistoryStore.getState().execute(cmd, { library, renderer });
        useWasmContextStore.getState().bumpSyncGeneration();
      };

      return (
        <div ref={panelRef} className="flex flex-col pb-2" onWheel={(e) => e.stopPropagation()}>
          {/* Text header */}
          <div className="px-3 pt-2 pb-1">
            <span
              className={cn(
                "text-xs font-medium select-none",
                isDark ? "text-white/70" : "text-black/70",
              )}
            >
              Text
            </span>
          </div>

          {/* Divider */}
          <div className={cn("mx-3 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

          {/* Layer */}
          <SectionHeader label="Layer" isDark={isDark} />
          <LayerSelector
            currentLayer={textInfo.layer}
            currentDatatype={textInfo.datatype}
            isDark={isDark}
            onChange={handleTextLayerChange}
          />

          {/* Divider */}
          <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

          {/* Content */}
          <SectionHeader label="Content" isDark={isDark} />
          <TextAreaField
            label="Text"
            value={textInfo.text}
            isDark={isDark}
            onChange={handleTextContentChange}
          />

          {/* Divider */}
          <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

          {/* Position */}
          <SectionHeader label="Position" isDark={isDark} />
          <NumberField
            label="X"
            value={textX}
            unit={unitInfo.unit}
            isDark={isDark}
            onChange={(v) => handleTextPositionChange("x", v)}
          />
          <NumberField
            label="Y"
            value={textY}
            unit={unitInfo.unit}
            isDark={isDark}
            onChange={(v) => handleTextPositionChange("y", v)}
          />

          {/* Divider */}
          <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

          {/* Text size */}
          <SectionHeader label="Size" isDark={isDark} />
          <NumberField
            label="Size"
            value={textHeight}
            unit={unitInfo.unit}
            isDark={isDark}
            onChange={handleTextHeightChange}
          />
        </div>
      );
    }
  }

  // Format bounds for display.
  // WASM world coordinates use GRID_SIZE world units per nanometer, with Y inverted.
  // Convert: world → nm (divide by GRID_SIZE, negate Y) → display unit (formatCoordinate).
  const posX = bounds ? formatCoordinate(bounds.minX / GRID_SIZE, unitInfo) : "—";
  const posY = bounds ? formatCoordinate(-bounds.maxY / GRID_SIZE, unitInfo) : "—";
  const width = bounds ? formatCoordinate((bounds.maxX - bounds.minX) / GRID_SIZE, unitInfo) : "—";
  const height = bounds ? formatCoordinate((bounds.maxY - bounds.minY) / GRID_SIZE, unitInfo) : "—";

  // When viewing from a parent cell, only position is editable.
  const positionEditable = isParentCell || isSingle;

  return (
    <div ref={panelRef} className="flex flex-col pb-2" onWheel={(e) => e.stopPropagation()}>
      {/* Selection summary */}
      <div className="px-3 pt-2 pb-1">
        <span
          className={cn(
            "text-xs font-medium select-none",
            isDark ? "text-white/70" : "text-black/70",
          )}
        >
          {isSingle ? `Polygon · ${first.vertexCount} vertices` : `${elements.length} elements`}
        </span>
      </div>

      {/* Divider */}
      <div className={cn("mx-3 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

      {/* Layer */}
      {!isParentCell && (
        <>
          <SectionHeader label="Layer" isDark={isDark} />

          {isMixed ? (
            <div className="flex items-center justify-between gap-2 px-3 py-1">
              <span className={cn("text-xs select-none", isDark ? "text-white/50" : "text-black/50")}>
                Layer
              </span>
              <span
                className={cn("text-xs italic select-none", isDark ? "text-white/40" : "text-black/40")}
              >
                Mixed
              </span>
            </div>
          ) : (
            <LayerSelector
              currentLayer={first.layer}
              currentDatatype={first.datatype}
              isDark={isDark}
              onChange={handleLayerChange}
            />
          )}

          {/* Divider */}
          <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />
        </>
      )}

      {/* Position */}
      <SectionHeader label="Position" isDark={isDark} />
      <NumberField
        label="X"
        value={posX}
        unit={unitInfo.unit}
        isDark={isDark}
        onChange={positionEditable ? (v) => handlePositionChange("x", v) : undefined}
        readOnly={!positionEditable}
      />
      <NumberField
        label="Y"
        value={posY}
        unit={unitInfo.unit}
        isDark={isDark}
        onChange={positionEditable ? (v) => handlePositionChange("y", v) : undefined}
        readOnly={!positionEditable}
      />

      {/* Divider */}
      <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

      {/* Dimensions */}
      <SectionHeader label="Size" isDark={isDark} />
      <NumberField
        label="W"
        value={width}
        unit={unitInfo.unit}
        isDark={isDark}
        onChange={isSingle && !isParentCell ? (v) => handleDimensionChange("width", v) : undefined}
        readOnly={!isSingle || isParentCell}
      />
      <NumberField
        label="H"
        value={height}
        unit={unitInfo.unit}
        isDark={isDark}
        onChange={isSingle && !isParentCell ? (v) => handleDimensionChange("height", v) : undefined}
        readOnly={!isSingle || isParentCell}
      />

      {/* Vertices — single selection when editable, all elements when parent (read-only) */}
      {(isSingle || isParentCell) && (
        <>
          {/* Divider */}
          <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

          {isParentCell && !isSingle ? (
            // Show vertices from all elements (read-only) when at parent cell
            elements.map((el, elIdx) => (
              <VerticesSection
                key={el.id}
                vertices={el.vertices}
                unitInfo={unitInfo}
                isDark={isDark}
                onChangeVertex={handleVertexChange}
                onRemoveVertex={handleVertexRemove}
                onAddVertex={handleVertexAdd}
                readOnly
                label={elements.length > 1 ? `Vertices (${elIdx + 1}/${elements.length})` : undefined}
              />
            ))
          ) : (
            <VerticesSection
              vertices={first.vertices}
              unitInfo={unitInfo}
              isDark={isDark}
              onChangeVertex={handleVertexChange}
              onRemoveVertex={handleVertexRemove}
              onAddVertex={handleVertexAdd}
              readOnly={isParentCell}
            />
          )}
        </>
      )}
    </div>
  );
}
