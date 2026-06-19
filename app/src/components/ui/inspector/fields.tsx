import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLayerStore } from "@/stores/layer";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { cn } from "@/lib/utils";

/**
 * Editable numeric field with label.
 *
 * Confirms on Enter/blur, reverts on Escape.
 * Tab/Shift+Tab advances to the next/previous field via native browser tabbing.
 * Enter/Space on the display button starts editing.
 */
export function NumberField({
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
  const mountedRef = useRef(true);

  // Track mount state so blur during unmount doesn't fire onChange
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
    // If the component is unmounting (e.g., Escape cleared selection and the
    // inspector is switching views), suppress the onChange call — the user
    // didn't confirm the edit.
    if (!mountedRef.current) return;
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
      <span
        className={cn(
          "text-xs select-none",
          readOnly
            ? isDark
              ? "text-white/30"
              : "text-black/30"
            : isDark
              ? "text-white/50"
              : "text-black/50",
        )}
      >
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
                setEditValue(value);
                setEditing(true);
              }
            }}
            onFocus={() => {
              if (!readOnly && onChange) {
                setEditValue(value);
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
            className={cn(
              "w-6 text-xs select-none",
              readOnly
                ? isDark
                  ? "text-white/20"
                  : "text-black/20"
                : isDark
                  ? "text-white/40"
                  : "text-black/40",
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
export function TextField({
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
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
    if (!mountedRef.current) return;
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
export function TextAreaField({
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
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
    if (!mountedRef.current) return;
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
export function LayerSelector({
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
            // Custom listbox: a native <select> can't render per-option color
            // swatches or the portal-positioned styling this dropdown needs.
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
            role="listbox"
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
                  // Custom option (see listbox note above). Roving focus is
                  // managed by the listbox container via highlightIndex.
                  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
                  role="option"
                  tabIndex={-1}
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
export function SectionHeader({ label, isDark }: { label: string; isDark: boolean }) {
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
