import { useCallback, useEffect, useMemo, useRef, useState, type RefCallback } from "react";
import {
  useLayerStore,
  LAYER_PALETTE,
  MAX_LAYER_NUMBER,
  type Layer,
  type FillPattern,
} from "@/stores/layer";
import { useContextMenuStore } from "@/stores/context-menu";
import { useHistoryStore } from "@/stores/history";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useUIStore } from "@/stores/ui";
import { useStatusMessageStore } from "@/stores/status-message";
import { useKeyboardFocusStore } from "@/stores/keyboard-focus";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { useInlineRename } from "@/hooks/use-inline-rename";
import { useRovingRows } from "@/hooks/use-roving-rows";
import { EditLayerCommand, DeleteLayerCommand } from "@/lib/commands";
import { getAdjacentKeyAfterRemoval, getUndoRedoIntent } from "@/lib/keyboard";
import { cn } from "@/lib/utils";
import { panelRowStateClassName } from "@/components/ui/panel-row";

// =============================================================================
// Constants
// =============================================================================

/** Preset color palette for the color picker (from store). */
const COLOR_PRESETS = LAYER_PALETTE;

/** Fill pattern options with labels and icons. */
const FILL_PATTERNS: { id: FillPattern; label: string }[] = [
  { id: "solid", label: "Solid" },
  { id: "hatched", label: "Hatched" },
  { id: "crosshatched", label: "Cross" },
  { id: "dotted", label: "Dotted" },
  { id: "horizontal", label: "Horiz" },
  { id: "vertical", label: "Vert" },
  { id: "zigzag", label: "Zigzag" },
  { id: "brick", label: "Brick" },
];

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Tiny SVG preview of a fill pattern for the selector buttons.
 */
function FillPatternIcon({ pattern, className }: { pattern: FillPattern; className?: string }) {
  const size = 14;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <rect x="0" y="0" width={size} height={size} fill="currentColor" opacity="0.15" rx="1" />
      {pattern === "solid" && (
        <rect
          x="1"
          y="1"
          width={size - 2}
          height={size - 2}
          fill="currentColor"
          opacity="0.5"
          rx="0.5"
        />
      )}
      {pattern === "hatched" && (
        <g stroke="currentColor" strokeWidth="1" opacity="0.6">
          <line x1="0" y1="4" x2="4" y2="0" />
          <line x1="0" y1="9" x2="9" y2="0" />
          <line x1="0" y1="14" x2="14" y2="0" />
          <line x1="5" y1="14" x2="14" y2="5" />
          <line x1="10" y1="14" x2="14" y2="10" />
        </g>
      )}
      {pattern === "crosshatched" && (
        <g stroke="currentColor" strokeWidth="1" opacity="0.6">
          <line x1="0" y1="4" x2="4" y2="0" />
          <line x1="0" y1="9" x2="9" y2="0" />
          <line x1="0" y1="14" x2="14" y2="0" />
          <line x1="5" y1="14" x2="14" y2="5" />
          <line x1="10" y1="14" x2="14" y2="10" />
          <line x1="10" y1="0" x2="14" y2="4" />
          <line x1="5" y1="0" x2="14" y2="9" />
          <line x1="0" y1="0" x2="14" y2="14" />
          <line x1="0" y1="5" x2="9" y2="14" />
          <line x1="0" y1="10" x2="4" y2="14" />
        </g>
      )}
      {pattern === "dotted" && (
        <g fill="currentColor" opacity="0.6">
          <circle cx="3.5" cy="3.5" r="1" />
          <circle cx="10.5" cy="3.5" r="1" />
          <circle cx="3.5" cy="10.5" r="1" />
          <circle cx="10.5" cy="10.5" r="1" />
          <circle cx="7" cy="7" r="1" />
        </g>
      )}
      {pattern === "horizontal" && (
        <g stroke="currentColor" strokeWidth="1" opacity="0.6">
          <line x1="0" y1="3.5" x2="14" y2="3.5" />
          <line x1="0" y1="7" x2="14" y2="7" />
          <line x1="0" y1="10.5" x2="14" y2="10.5" />
        </g>
      )}
      {pattern === "vertical" && (
        <g stroke="currentColor" strokeWidth="1" opacity="0.6">
          <line x1="3.5" y1="0" x2="3.5" y2="14" />
          <line x1="7" y1="0" x2="7" y2="14" />
          <line x1="10.5" y1="0" x2="10.5" y2="14" />
        </g>
      )}
      {pattern === "zigzag" && (
        <g stroke="currentColor" strokeWidth="1" opacity="0.6" fill="none">
          <polyline points="0,5 3.5,2 7,5 10.5,2 14,5" />
          <polyline points="0,10 3.5,7 7,10 10.5,7 14,10" />
        </g>
      )}
      {pattern === "brick" && (
        <g stroke="currentColor" strokeWidth="1" opacity="0.6">
          <line x1="0" y1="3.5" x2="14" y2="3.5" />
          <line x1="0" y1="7" x2="14" y2="7" />
          <line x1="0" y1="10.5" x2="14" y2="10.5" />
          <line x1="3.5" y1="0" x2="3.5" y2="3.5" />
          <line x1="10.5" y1="0" x2="10.5" y2="3.5" />
          <line x1="7" y1="3.5" x2="7" y2="7" />
          <line x1="3.5" y1="7" x2="3.5" y2="10.5" />
          <line x1="10.5" y1="7" x2="10.5" y2="10.5" />
          <line x1="7" y1="10.5" x2="7" y2="14" />
        </g>
      )}
    </svg>
  );
}

/**
 * Color picker with preset swatches and hex input.
 */
function ColorPicker({
  color,
  isDark,
  onChange,
  hexTabIdx,
}: {
  color: string;
  isDark: boolean;
  onChange: (color: string) => void;
  hexTabIdx?: number;
}) {
  const [hexInput, setHexInput] = useState(color);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync hex input when color prop changes externally
  useEffect(() => {
    setHexInput(color);
  }, [color]);

  const handleHexSubmit = useCallback(() => {
    const cleaned = hexInput.trim().replace(/^#?/, "#");
    // Validate hex color
    if (/^#[0-9a-fA-F]{6}$/.test(cleaned)) {
      onChange(cleaned.toLowerCase());
    } else {
      setHexInput(color); // revert
    }
  }, [hexInput, color, onChange]);

  const handleHexKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inputRef.current?.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setHexInput(color);
        inputRef.current?.blur();
      }
    },
    [color],
  );

  return (
    <div className="flex flex-col gap-1.5">
      {/* Swatch grid */}
      <div className="grid grid-cols-8 gap-1">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-label={`Use color ${preset}`}
            onClick={(e) => {
              e.stopPropagation();
              onChange(preset);
            }}
            className={cn(
              "h-5 w-full rounded border outline-none transition-all",
              preset === color
                ? "ring-1 ring-offset-1 " +
                    (isDark
                      ? "ring-white/60 ring-offset-[rgb(29,29,29)]"
                      : "ring-black/60 ring-offset-[rgb(241,241,241)]")
                : isDark
                  ? "border-white/10 hover:border-white/30"
                  : "border-black/10 hover:border-black/30",
            )}
            style={{ backgroundColor: preset }}
            tabIndex={-1}
          />
        ))}
      </div>

      {/* Hex input */}
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "h-5 w-5 flex-shrink-0 rounded border",
            isDark ? "border-white/10" : "border-black/10",
          )}
          style={{ backgroundColor: color }}
        />
        <input
          ref={inputRef}
          type="text"
          value={hexInput}
          data-tab-index={hexTabIdx}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={handleHexSubmit}
          onKeyDown={handleHexKeyDown}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
          className={cn(
            "h-6 min-w-0 flex-1 rounded border px-1.5 font-mono text-xs outline-none",
            isDark
              ? "border-white/10 bg-white/5 text-white/90"
              : "border-black/10 bg-black/5 text-black/90",
          )}
        />
      </div>
    </div>
  );
}

/**
 * Fill pattern selector as a row of small toggle buttons.
 */
function FillTypeSelector({
  value,
  isDark,
  onChange,
  baseTabIdx,
}: {
  value: FillPattern;
  isDark: boolean;
  onChange: (pattern: FillPattern) => void;
  baseTabIdx?: number;
}) {
  return (
    <div className="grid grid-cols-4 gap-1">
      {FILL_PATTERNS.map((pattern, i) => {
        const isActive = value === pattern.id;
        return (
          <button
            key={pattern.id}
            type="button"
            data-tab-index={baseTabIdx != null ? baseTabIdx + i : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onChange(pattern.id);
            }}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg border px-1 py-1 text-[10px] outline-none transition-colors",
              isActive
                ? isDark
                  ? "border-white/20 bg-white/10 text-white/90"
                  : "border-black/20 bg-black/10 text-black/90"
                : isDark
                  ? "border-white/5 text-white/40 hover:border-white/15 hover:text-white/70 focus:border-white/15 focus:text-white/70"
                  : "border-black/5 text-black/40 hover:border-black/15 hover:text-black/70 focus:border-black/15 focus:text-black/70",
            )}
            tabIndex={-1}
          >
            <FillPatternIcon pattern={pattern.id} />
          </button>
        );
      })}
    </div>
  );
}

/**
 * Inline editable number field for the layer editor.
 *
 * Always renders an input element (no button/input swap) so Tab cycling
 * works naturally. Styled as plain text when unfocused, as an input when focused.
 */
function LayerNumberField({
  label,
  value,
  isDark,
  onChange,
  tabIdx,
}: {
  label: string;
  value: number;
  isDark: boolean;
  onChange: (value: number) => void;
  tabIdx?: number;
}) {
  const [editValue, setEditValue] = useState(String(value));
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync display value from prop when not focused
  useEffect(() => {
    if (!focused) setEditValue(String(value));
  }, [value, focused]);

  const commit = useCallback(() => {
    const parsed = Number.parseInt(editValue, 10);
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= MAX_LAYER_NUMBER && parsed !== value) {
      onChange(parsed);
    } else {
      setEditValue(String(value));
    }
  }, [editValue, value, onChange]);

  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-xs select-none", isDark ? "text-white/50" : "text-black/50")}>
        {label}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        data-tab-index={tabIdx}
        onChange={(e) => setEditValue(e.target.value)}
        onFocus={(e) => {
          setFocused(true);
          e.target.select();
        }}
        onBlur={() => {
          setFocused(false);
          commit();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            inputRef.current?.blur();
          } else if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            setEditValue(String(value));
            inputRef.current?.blur();
          }
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        className={cn(
          "w-16 cursor-text rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none transition-colors",
          focused
            ? isDark
              ? "border-white/10 bg-white/5 text-white/90"
              : "border-black/10 bg-black/5 text-black/90"
            : isDark
              ? "border-transparent text-white/90 hover:bg-white/5"
              : "border-transparent text-black/90 hover:bg-black/5",
        )}
      />
    </div>
  );
}

/**
 * Inline editable text field for the layer editor.
 *
 * Always renders an input element so Tab cycling works naturally.
 */
function LayerTextField({
  label,
  value,
  isDark,
  onChange,
  tabIdx,
}: {
  label: string;
  value: string;
  isDark: boolean;
  onChange: (value: string) => void;
  tabIdx?: number;
}) {
  const [editValue, setEditValue] = useState(value);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync display value from prop when not focused
  useEffect(() => {
    if (!focused) setEditValue(value);
  }, [value, focused]);

  const commit = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    } else {
      setEditValue(value);
    }
  }, [editValue, value, onChange]);

  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-xs select-none", isDark ? "text-white/50" : "text-black/50")}>
        {label}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        data-tab-index={tabIdx}
        onChange={(e) => setEditValue(e.target.value)}
        onFocus={(e) => {
          setFocused(true);
          e.target.select();
        }}
        onBlur={() => {
          setFocused(false);
          commit();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            inputRef.current?.blur();
          } else if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            setEditValue(value);
            inputRef.current?.blur();
          }
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        className={cn(
          "w-28 cursor-text truncate rounded border px-1.5 py-0.5 text-right text-xs outline-none transition-colors",
          focused
            ? isDark
              ? "border-white/10 bg-white/5 text-white/90"
              : "border-black/10 bg-black/5 text-black/90"
            : isDark
              ? "border-transparent text-white/90 hover:bg-white/5"
              : "border-transparent text-black/90 hover:bg-black/5",
        )}
      />
    </div>
  );
}

/**
 * Section header matching the inspector panel style.
 */
function SectionLabel({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <span
      className={cn(
        "text-[10px] font-semibold uppercase tracking-wider select-none",
        isDark ? "text-white/30" : "text-black/30",
      )}
    >
      {label}
    </span>
  );
}

/**
 * Expanded inline layer editor that appears below the selected layer row.
 *
 * Allows editing: name, color, layer number, datatype, and fill pattern.
 * All changes go through EditLayerCommand for undo/redo support.
 */
function LayerEditor({ layer, isDark }: { layer: Layer; isDark: boolean }) {
  const library = useWasmContextStore((s) => s.library);
  const renderer = useWasmContextStore((s) => s.renderer);
  const editorRef = useRef<HTMLFieldSetElement>(null);

  const handleChange = useCallback(
    (updates: Partial<Layer>) => {
      if (!library || !renderer) return;
      const newLayer = { ...layer, ...updates };

      // Reject if layer number / datatype would collide with another layer
      if (updates.layerNumber !== undefined || updates.datatype !== undefined) {
        for (const other of useLayerStore.getState().layers.values()) {
          if (
            other.id !== layer.id &&
            other.layerNumber === newLayer.layerNumber &&
            other.datatype === newLayer.datatype
          ) {
            useStatusMessageStore
              .getState()
              .show(`Layer ${newLayer.layerNumber}/${newLayer.datatype} already exists`, "warn");
            return;
          }
        }
      }

      const cmd = new EditLayerCommand(layer, newLayer);
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [layer, library, renderer],
  );

  // Auto-focus the first field when the editor opens
  useEffect(() => {
    // Small delay to ensure the DOM has rendered
    const raf = requestAnimationFrame(() => {
      const first = editorRef.current?.querySelector<HTMLElement>("[data-tab-index='0']");
      first?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Don't close if an input inside the editor is focused (let it handle Escape first)
        const active = document.activeElement;
        if (active && editorRef.current?.contains(active) && active.tagName === "INPUT") {
          return;
        }
        e.preventDefault();
        useLayerStore.getState().setExpandedLayerId(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close on click outside the editor
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        useLayerStore.getState().setExpandedLayerId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manage Tab cycling within the editor using data-tab-index attributes
  const handleEditorKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") return; // let Escape bubble for close behavior

    e.stopPropagation(); // block canvas shortcuts

    if (e.key !== "Tab" || !editorRef.current) return;
    e.preventDefault(); // prevent browser default Tab

    const tabbables = Array.from(
      editorRef.current.querySelectorAll<HTMLElement>("[data-tab-index]"),
    ).sort((a, b) => Number(a.dataset.tabIndex) - Number(b.dataset.tabIndex));
    if (tabbables.length === 0) return;

    const currentIdx = tabbables.findIndex((el) => el === document.activeElement);
    const delta = e.shiftKey ? -1 : 1;
    const nextIdx =
      currentIdx === -1 ? 0 : (currentIdx + delta + tabbables.length) % tabbables.length;

    tabbables[nextIdx].focus();
  }, []);

  return (
    // Handlers below are event containment (stopPropagation) and Tab focus
    // management for the grouped controls, not user-facing interactions.
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <fieldset
      ref={editorRef}
      className="mx-1 flex w-[calc(100%-8px)] flex-col gap-2 px-2.5 py-2"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleEditorKeyDown}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Name */}
      <LayerTextField
        label="Name"
        value={layer.name}
        isDark={isDark}
        onChange={(name) => handleChange({ name })}
        tabIdx={0}
      />

      {/* Divider */}
      <div className={cn("h-px", isDark ? "bg-white/5" : "bg-black/5")} />

      {/* Color */}
      <div className="flex flex-col gap-1.5">
        <SectionLabel label="Color" isDark={isDark} />
        <ColorPicker
          color={layer.color}
          isDark={isDark}
          onChange={(color) => handleChange({ color })}
          hexTabIdx={1}
        />
      </div>

      {/* Divider */}
      <div className={cn("h-px", isDark ? "bg-white/5" : "bg-black/5")} />

      {/* Layer number + Datatype */}
      <div className="flex flex-col gap-1">
        <SectionLabel label="GDS" isDark={isDark} />
        <LayerNumberField
          label="Layer"
          value={layer.layerNumber}
          isDark={isDark}
          onChange={(layerNumber) => handleChange({ layerNumber })}
          tabIdx={2}
        />
        <LayerNumberField
          label="Datatype"
          value={layer.datatype}
          isDark={isDark}
          onChange={(datatype) => handleChange({ datatype })}
          tabIdx={3}
        />
      </div>

      {/* Divider */}
      <div className={cn("h-px", isDark ? "bg-white/5" : "bg-black/5")} />

      {/* Fill pattern */}
      <div className="flex flex-col gap-1.5">
        <SectionLabel label="Fill" isDark={isDark} />
        <FillTypeSelector
          value={layer.fillPattern}
          isDark={isDark}
          onChange={(fillPattern) => handleChange({ fillPattern })}
          baseTabIdx={4}
        />
      </div>
    </fieldset>
  );
}

/**
 * Single layer row in the panel.
 *
 * When expanded, shows the full layer editor inline below the compact row.
 */
function LayerRow({
  layer,
  isActive,
  isFocused,
  isExpanded,
  isDark,
  inUse,
  onSelect,
  onToggleExpand,
  startEditing,
  rowRef,
  rowTabIndex,
  onRowFocus,
  onRowKeyDown,
  onRestoreRowFocus,
}: {
  layer: Layer;
  isActive: boolean;
  /** Whether this layer has the keyboard navigation cursor. */
  isFocused: boolean;
  isExpanded: boolean;
  isDark: boolean;
  /** Whether any geometry in the library sits on this layer. */
  inUse: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  startEditing: boolean;
  rowRef: RefCallback<HTMLButtonElement>;
  rowTabIndex: number;
  onRowFocus: () => void;
  onRowKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onRestoreRowFocus: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const library = useWasmContextStore((s) => s.library);
  const renderer = useWasmContextStore((s) => s.renderer);

  const commitName = useCallback(
    (name: string) => {
      if (!library || !renderer) return;
      const cmd = new EditLayerCommand(layer, { ...layer, name });
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [layer, library, renderer],
  );

  const {
    inputRef,
    draft: editName,
    setDraft: setEditName,
    commit: handleNameSubmit,
    handleKeyDown,
  } = useInlineRename({
    value: layer.name,
    isEditing,
    onEditingChange: setIsEditing,
    onCommit: commitName,
  });

  // Enter edit mode when triggered externally (e.g., from context menu "Rename")
  useEffect(() => {
    if (startEditing) {
      setIsEditing(true);
      // Clear the editing signal
      useLayerStore.getState().setEditingLayerId(null);
    }
  }, [startEditing]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      useContextMenuStore
        .getState()
        .open("layer", { x: e.clientX, y: e.clientY }, String(layer.id));
    },
    [layer.id],
  );

  const handleSwatchClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRowFocus();
      onSelect();
      onToggleExpand();
      if (isExpanded) requestAnimationFrame(onRestoreRowFocus);
    },
    [isExpanded, onRestoreRowFocus, onRowFocus, onSelect, onToggleExpand],
  );

  const handleSwatchMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 2) e.preventDefault();
      // Prevent the LayerEditor's click-outside listener from firing first,
      // which would clear expandedLayerId before onToggleExpand reads it.
      if (isExpanded) {
        e.stopPropagation();
      }
    },
    [isExpanded],
  );

  const handleRenameKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const restoresRowFocus = event.key === "Enter" || event.key === "Escape";
      handleKeyDown(event);
      if (restoresRowFocus) requestAnimationFrame(onRestoreRowFocus);
    },
    [handleKeyDown, onRestoreRowFocus],
  );

  return (
    <li className="flex flex-col gap-0.5">
      {/* Compact row */}
      <div
        className={cn(
          "group relative mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-[7px] py-1.5 text-left transition-colors",
          panelRowStateClassName({ isActive, isFocused, isDark }),
        )}
        onContextMenu={handleContextMenu}
        title={!inUse ? "No shapes use this layer" : undefined}
      >
        <button
          ref={rowRef}
          type="button"
          aria-current={isActive ? "true" : undefined}
          aria-label={layer.name}
          className="absolute inset-0 cursor-pointer rounded-lg border-0 bg-transparent p-0 outline-none"
          onClick={onSelect}
          onDoubleClick={(event) => {
            event.stopPropagation();
            setIsEditing(true);
          }}
          onFocus={onRowFocus}
          onKeyDown={onRowKeyDown}
          onMouseDown={(event) => {
            if (event.button === 2) event.preventDefault();
          }}
          tabIndex={isEditing ? -1 : rowTabIndex}
        />

        {/* Color swatch - click to open editor */}
        <button
          type="button"
          aria-label={`Edit layer color (${layer.color})`}
          className={cn(
            "relative z-10 h-4.5 w-4.5 flex-shrink-0 cursor-pointer rounded border outline-none transition-shadow",
            isDark
              ? "border-white/10 hover:border-white/30"
              : "border-black/10 hover:border-black/30",
            !layer.visible && "opacity-40",
          )}
          style={{ backgroundColor: layer.color }}
          onClick={handleSwatchClick}
          onMouseDown={handleSwatchMouseDown}
          tabIndex={-1}
        />

        <div
          className={cn(
            "pointer-events-none relative z-10 flex h-5 min-w-0 flex-1 items-center gap-2",
            !layer.visible ? "opacity-40" : !inUse && "opacity-50",
          )}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleRenameKeyDown}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "pointer-events-auto m-0 min-w-0 flex-1 border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0",
                isDark ? "text-white/90" : "text-gray-900",
              )}
            />
          ) : (
            <span className="min-w-0 flex-1 truncate text-sm leading-5 select-none">
              {layer.name}
            </span>
          )}
          <LayerNumber layer={layer} />
        </div>
      </div>

      {/* Expanded editor */}
      {isExpanded && <LayerEditor layer={layer} isDark={isDark} />}
    </li>
  );
}

function LayerNumber({ layer }: { layer: Layer }) {
  return (
    <div className="flex flex-shrink-0 items-center self-center font-mono text-xs">
      <span className="select-none">{layer.layerNumber}</span>
      <span className="px-0.5 opacity-50 select-none">/</span>
      <span className="select-none">{layer.datatype}</span>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Layers panel content for managing GDS layers.
 *
 * This component is designed to be embedded in a sidebar, not used standalone.
 *
 * Features:
 * - View and select layers
 * - Inline layer editor (click to expand: name, color, numbers, fill pattern)
 * - Inline rename (double-click name)
 * - Right-click context menu (add, delete, rename, toggle visibility)
 * - All edits are undoable via the command/history system
 * - Keyboard navigation (Shift+L to focus, arrows to navigate, Space/Enter/Delete for actions)
 */
export function LayersPanel() {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  const { getAllLayers, activeLayerId, setActiveLayer } = useLayerStore();
  const editingLayerId = useLayerStore((s) => s.editingLayerId);
  const expandedLayerId = useLayerStore((s) => s.expandedLayerId);
  const setExpandedLayerId = useLayerStore((s) => s.setExpandedLayerId);
  const isFocused = useLayerStore((s) => s.isFocused);
  const focusedLayerId = useLayerStore((s) => s.focusedLayerId);
  const setFocused = useLayerStore((s) => s.setFocused);
  const setFocusedLayerId = useLayerStore((s) => s.setFocusedLayerId);

  // Claim keyboard focus when Layers panel is keyboard-navigating
  useKeyboardFocus("layers-panel", isFocused);

  const layers = getAllLayers();
  const layerIds = layers.map((layer) => layer.id);
  const scrollRef = useRef<HTMLUListElement>(null);

  const { getRowProps, handleNavigationKeyDown, focusRow } = useRovingRows<
    number,
    HTMLButtonElement
  >({
    rowKeys: layerIds,
    focusedKey: focusedLayerId,
    fallbackKey: activeLayerId,
    isActive: isFocused,
    wrap: true,
    onFocusedKeyChange: setFocusedLayerId,
    onFocusWithin: () => {
      const state = useLayerStore.getState();
      if (!state.isFocused) state.setFocused(true);
    },
  });

  // Derive the set of layers that actually carry geometry somewhere in the
  // library. Recomputed whenever the library is synced to the renderer.
  const library = useWasmContextStore((s) => s.library);
  const syncGeneration = useWasmContextStore((s) => s.syncGeneration);
  const usedLayerKeys = useMemo(() => {
    // Re-run whenever the library is synced to the renderer.
    void syncGeneration;
    const set = new Set<string>();
    if (!library) return set;
    const flat = library.get_used_layers();
    for (let i = 0; i + 1 < flat.length; i += 2) {
      set.add(`${flat[i]}/${flat[i + 1]}`);
    }
    return set;
  }, [library, syncGeneration]);

  const handleToggleExpand = useCallback(
    (layerId: number) => {
      const current = useLayerStore.getState().expandedLayerId;
      setExpandedLayerId(current === layerId ? null : layerId);
    },
    [setExpandedLayerId],
  );

  // =========================================================================
  // Keyboard navigation for the Layers panel
  // =========================================================================

  // Unfocus on click outside the panel
  useEffect(() => {
    if (!isFocused) return;
    const handler = (e: MouseEvent) => {
      if (scrollRef.current && !scrollRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isFocused, setFocused]);

  const handleLayerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, layerId: number) => {
      if (!useKeyboardFocusStore.getState().owns("layers-panel")) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }
      if (handleNavigationKeyDown(event, layerId)) return;

      if (event.key === " ") {
        event.preventDefault();
        setActiveLayer(layerId);
      } else if (event.key === "Enter") {
        event.preventDefault();
        const current = useLayerStore.getState().expandedLayerId;
        setExpandedLayerId(current === layerId ? null : layerId);
      } else if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        const allLayers = useLayerStore.getState().getAllLayers();
        const nextFocus = getAdjacentKeyAfterRemoval(
          allLayers.map((layer) => layer.id),
          layerId,
        );
        const { library: currentLibrary, renderer } = useWasmContextStore.getState();
        if (!currentLibrary || !renderer || nextFocus === null) return;
        useHistoryStore
          .getState()
          .execute(new DeleteLayerCommand(layerId), { library: currentLibrary, renderer });
        setFocusedLayerId(nextFocus);
      } else if (event.key === "Escape") {
        event.preventDefault();
        setFocused(false);
        event.currentTarget.blur();
      } else {
        const intent = getUndoRedoIntent(event.nativeEvent);
        if (!intent) return;
        event.preventDefault();
        const { library: currentLibrary, renderer } = useWasmContextStore.getState();
        if (!currentLibrary || !renderer) return;
        if (intent === "redo") {
          useHistoryStore.getState().redo({ library: currentLibrary, renderer });
        } else {
          useHistoryStore.getState().undo({ library: currentLibrary, renderer });
        }
      }
    },
    [handleNavigationKeyDown, setActiveLayer, setExpandedLayerId, setFocused, setFocusedLayerId],
  );

  return (
    <div className="flex h-full flex-col">
      {/* Layer list */}
      <ul
        ref={scrollRef}
        aria-label="Layers"
        className="m-0 flex flex-1 list-none flex-col gap-0.5 overflow-y-auto p-0 py-1"
        onWheel={(e) => e.stopPropagation()}
      >
        {layers.map((layer) => {
          const rowProps = getRowProps(layer.id);
          return (
            <LayerRow
              key={layer.id}
              layer={layer}
              isActive={layer.id === activeLayerId}
              isFocused={isFocused && layer.id === focusedLayerId}
              isExpanded={expandedLayerId === layer.id}
              isDark={isDark}
              inUse={usedLayerKeys.has(`${layer.layerNumber}/${layer.datatype}`)}
              onSelect={() => setActiveLayer(layer.id)}
              onToggleExpand={() => handleToggleExpand(layer.id)}
              startEditing={editingLayerId === layer.id}
              rowRef={rowProps.ref}
              rowTabIndex={rowProps.tabIndex}
              onRowFocus={rowProps.onFocus}
              onRowKeyDown={(event) => handleLayerKeyDown(event, layer.id)}
              onRestoreRowFocus={() => focusRow(layer.id)}
            />
          );
        })}
      </ul>
    </div>
  );
}
