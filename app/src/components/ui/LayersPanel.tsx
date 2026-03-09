import { useCallback, useEffect, useRef, useState } from "react";
import { useLayerStore, LAYER_PALETTE, MAX_LAYER_NUMBER, type Layer, type FillPattern } from "@/stores/layer";
import { useContextMenuStore } from "@/stores/context-menu";
import { useHistoryStore } from "@/stores/history";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useUIStore } from "@/stores/ui";
import { useStatusMessageStore } from "@/stores/status-message";
import { EditLayerCommand } from "@/lib/commands";
import { cn } from "@/lib/utils";

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
            "h-6 flex-1 rounded border px-1.5 font-mono text-xs outline-none",
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
    <div className="flex gap-1">
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
              "flex flex-1 flex-col items-center gap-0.5 rounded-lg border px-1 py-1 text-[10px] outline-none transition-colors",
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
  const editorRef = useRef<HTMLDivElement>(null);

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
    <div
      ref={editorRef}
      role="group"
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
    </div>
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
  isExpanded,
  isDark,
  onSelect,
  onToggleExpand,
  startEditing,
}: {
  layer: Layer;
  isActive: boolean;
  isExpanded: boolean;
  isDark: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  startEditing: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(layer.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enter edit mode when triggered externally (e.g., from context menu "Rename")
  useEffect(() => {
    if (startEditing) {
      setIsEditing(true);
      setEditName(layer.name);
      // Clear the editing signal
      useLayerStore.getState().setEditingLayerId(null);
    }
  }, [startEditing, layer.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const library = useWasmContextStore((s) => s.library);
  const renderer = useWasmContextStore((s) => s.renderer);

  const handleNameSubmit = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== layer.name && library && renderer) {
      const cmd = new EditLayerCommand(layer, { ...layer, name: trimmed });
      useHistoryStore.getState().execute(cmd, { library, renderer });
    } else {
      setEditName(layer.name);
    }
    setIsEditing(false);
  }, [editName, layer, library, renderer]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleNameSubmit();
      } else if (e.key === "Escape") {
        setEditName(layer.name);
        setIsEditing(false);
      }
    },
    [handleNameSubmit, layer.name],
  );

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
      onSelect();
      onToggleExpand();
    },
    [onSelect, onToggleExpand],
  );

  return (
    <div className="flex flex-col gap-0.5">
      {/* Compact row */}
      <button
        type="button"
        className={cn(
          "group relative mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-[7px] py-1.5 text-left transition-colors",
          isActive
            ? isDark
              ? "bg-[rgb(54,54,54)] text-white/90"
              : "bg-[rgb(217,217,217)] text-black/90"
            : isDark
              ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90"
              : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90",
        )}
        onClick={onSelect}
        onContextMenu={handleContextMenu}
        onMouseDown={(e) => e.preventDefault()}
        tabIndex={-1}
      >
        {/* Color swatch - click to open editor */}
        <span
          role="img"
          className={cn(
            "h-4.5 w-4.5 flex-shrink-0 cursor-pointer rounded border outline-none transition-shadow",
            isDark
              ? "border-white/10 hover:border-white/30"
              : "border-black/10 hover:border-black/30",
            !layer.visible && "opacity-40",
          )}
          style={{ backgroundColor: layer.color }}
          onClick={handleSwatchClick}
          onKeyDown={() => {}}
        />

        {/* Layer name */}
        <div className="relative h-5 min-w-0 flex-1">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0",
                isDark ? "text-white/90" : "text-gray-900",
              )}
            />
          ) : (
            <span
              className={cn(
                "absolute inset-0 truncate text-sm leading-5 select-none",
                !layer.visible && "opacity-40",
              )}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {layer.name}
            </span>
          )}
        </div>

        {/* Layer number / datatype */}
        <div
          className={cn(
            "flex flex-shrink-0 items-center self-center font-mono text-xs",
            !layer.visible && "opacity-40",
          )}
        >
          <span className="select-none">{layer.layerNumber}</span>
          <span className="px-0.5 opacity-50 select-none">/</span>
          <span className="select-none">{layer.datatype}</span>
        </div>
      </button>

      {/* Expanded editor */}
      {isExpanded && <LayerEditor layer={layer} isDark={isDark} />}
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
 */
export function LayersPanel() {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  const { getAllLayers, activeLayerId, setActiveLayer } = useLayerStore();
  const editingLayerId = useLayerStore((s) => s.editingLayerId);
  const expandedLayerId = useLayerStore((s) => s.expandedLayerId);
  const setExpandedLayerId = useLayerStore((s) => s.setExpandedLayerId);

  const layers = getAllLayers();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleToggleExpand = useCallback(
    (layerId: number) => {
      const current = useLayerStore.getState().expandedLayerId;
      setExpandedLayerId(current === layerId ? null : layerId);
    },
    [setExpandedLayerId],
  );

  return (
    <div className="flex h-full flex-col">
      {/* Layer list */}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-1"
        onWheel={(e) => e.stopPropagation()}
      >
        {layers.map((layer) => (
          <LayerRow
            key={layer.id}
            layer={layer}
            isActive={layer.id === activeLayerId}
            isExpanded={expandedLayerId === layer.id}
            isDark={isDark}
            onSelect={() => setActiveLayer(layer.id)}
            onToggleExpand={() => handleToggleExpand(layer.id)}
            startEditing={editingLayerId === layer.id}
          />
        ))}
      </div>
    </div>
  );
}
