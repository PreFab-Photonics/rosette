import { useCallback, useEffect, useId, useMemo, useRef, useState, type RefCallback } from "react";
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
import { useStatusMessageStore } from "@/stores/status-message";
import { useKeyboardFocusStore } from "@/stores/keyboard-focus";
import { useDocumentStore } from "@/stores/document";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { useInlineRename } from "@/hooks/use-inline-rename";
import { useRovingRows } from "@/hooks/use-roving-rows";
import { EditLayerCommand, DeleteLayerCommand } from "@/lib/commands";
import { getAdjacentKeyAfterRemoval, getUndoRedoIntent, isEditableTarget } from "@/lib/keyboard";
import { cn } from "@/lib/utils";
import { panelRowStateClassName } from "@/components/ui/panel-row";
import { VisibilityIcon } from "@/components/ui/VisibilityIcon";

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
  onChange,
  hexTabIdx,
}: {
  color: string;
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
                ? "ring-1 ring-focus-ring ring-offset-1 ring-offset-surface"
                : "border-theme-border hover:border-focus-ring",
            )}
            style={{ backgroundColor: preset }}
            tabIndex={-1}
          />
        ))}
      </div>

      {/* Hex input */}
      <div className="flex items-center gap-1.5">
        <div
          className="h-5 w-5 flex-shrink-0 rounded border border-theme-border"
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
          className="h-6 min-w-0 flex-1 rounded border border-theme-border bg-input px-1.5 font-mono text-xs text-foreground outline-none"
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
  onChange,
  baseTabIdx,
}: {
  value: FillPattern;
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
                ? "border-theme-border-strong bg-theme-border text-foreground"
                : "border-input text-foreground-subtle hover:border-theme-border-strong hover:text-foreground-secondary focus:border-theme-border-strong focus:text-foreground-secondary",
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
  onChange,
  tabIdx,
}: {
  label: string;
  value: number;
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
      <span className="text-xs text-foreground-muted select-none">{label}</span>
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
            ? "border-theme-border bg-input text-foreground"
            : "border-transparent text-foreground hover:bg-input",
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
  onChange,
  tabIdx,
}: {
  label: string;
  value: string;
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
      <span className="text-xs text-foreground-muted select-none">{label}</span>
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
            ? "border-theme-border bg-input text-foreground"
            : "border-transparent text-foreground hover:bg-input",
        )}
      />
    </div>
  );
}

/**
 * Section header matching the inspector panel style.
 */
function SectionLabel({ label }: { label: string }) {
  return (
    <span className="text-[10px] font-semibold tracking-wider text-foreground-faint uppercase select-none">
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
function LayerEditor({
  layer,
  onRestoreRowFocus,
}: {
  layer: Layer;
  onRestoreRowFocus: () => void;
}) {
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

  const closeAndRestoreFocus = useCallback(() => {
    useLayerStore.getState().setExpandedLayerId(null);
    requestAnimationFrame(onRestoreRowFocus);
  }, [onRestoreRowFocus]);

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
        closeAndRestoreFocus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeAndRestoreFocus]);

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
  const handleEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") return; // let Escape bubble for close behavior

      e.stopPropagation(); // block canvas shortcuts

      if (e.key === "Enter") {
        e.preventDefault();
        if (e.target instanceof HTMLButtonElement) e.target.click();
        closeAndRestoreFocus();
        return;
      }

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
    },
    [closeAndRestoreFocus],
  );

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
        onChange={(name) => handleChange({ name })}
        tabIdx={0}
      />

      {/* Divider */}
      <div className="h-px bg-input" />

      {/* Color */}
      <div className="flex flex-col gap-1.5">
        <SectionLabel label="Color" />
        <ColorPicker
          color={layer.color}
          onChange={(color) => handleChange({ color })}
          hexTabIdx={1}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-input" />

      {/* Layer number + Datatype */}
      <div className="flex flex-col gap-1">
        <SectionLabel label="GDS" />
        <LayerNumberField
          label="Layer"
          value={layer.layerNumber}
          onChange={(layerNumber) => handleChange({ layerNumber })}
          tabIdx={2}
        />
        <LayerNumberField
          label="Datatype"
          value={layer.datatype}
          onChange={(datatype) => handleChange({ datatype })}
          tabIdx={3}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-input" />

      {/* Fill pattern */}
      <div className="flex flex-col gap-1.5">
        <SectionLabel label="Fill" />
        <FillTypeSelector
          value={layer.fillPattern}
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
  inUse,
  onSelect,
  onPointerSelect,
  onToggleVisibility,
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
  /** Whether any geometry in the library sits on this layer. */
  inUse: boolean;
  onSelect: () => void;
  onPointerSelect: () => void;
  onToggleVisibility: () => void;
  onToggleExpand: () => void;
  startEditing: boolean;
  rowRef: RefCallback<HTMLButtonElement>;
  rowTabIndex: number;
  onRowFocus: () => void;
  onRowKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onRestoreRowFocus: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const visibilityStatusId = useId();
  const sourceBacked = useDocumentStore((s) => s.backing.kind === "source");
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
    if (startEditing && !sourceBacked) {
      setIsEditing(true);
      // Clear the editing signal
      useLayerStore.getState().setEditingLayerId(null);
    }
  }, [sourceBacked, startEditing]);

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
      if (sourceBacked) return;
      onToggleExpand();
      if (isExpanded) requestAnimationFrame(onRestoreRowFocus);
    },
    [isExpanded, onRestoreRowFocus, onSelect, onRowFocus, onToggleExpand, sourceBacked],
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

  const handleVisibilityClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onRowFocus();
      onToggleVisibility();
    },
    [onRowFocus, onToggleVisibility],
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
    <li id={layerRowDomId(layer.id)} className="flex flex-col gap-0.5">
      {/* Compact row */}
      <div
        className={cn(
          "group relative mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-[7px] py-1.5 text-left transition-colors",
          panelRowStateClassName({ isActive, isFocused }),
        )}
        onContextMenu={handleContextMenu}
        title={!inUse ? "No shapes use this layer" : undefined}
      >
        <button
          ref={rowRef}
          type="button"
          aria-current={isActive ? "true" : undefined}
          aria-label={layer.name}
          aria-describedby={visibilityStatusId}
          className="absolute inset-0 cursor-pointer rounded-lg border-0 bg-transparent p-0 outline-none"
          onClick={onPointerSelect}
          onDoubleClick={(event) => {
            event.stopPropagation();
            if (!sourceBacked) setIsEditing(true);
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
          disabled={sourceBacked}
          className={cn(
            "relative z-10 h-4.5 w-4.5 flex-shrink-0 rounded border outline-none transition-shadow",
            "border-theme-border hover:border-focus-ring",
            sourceBacked ? "cursor-default" : "cursor-pointer",
            !layer.visible && "opacity-40",
          )}
          style={{ backgroundColor: layer.color }}
          onClick={handleSwatchClick}
          onMouseDown={handleSwatchMouseDown}
          tabIndex={-1}
        />

        <div
          className={cn(
            "pointer-events-none relative z-10 flex h-5 min-w-0 flex-1 items-center",
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
              className="pointer-events-auto m-0 min-w-0 flex-1 border-0 bg-transparent p-0 text-sm leading-5 text-foreground outline-none focus:ring-0"
            />
          ) : (
            <span className="min-w-0 flex-1 truncate text-sm leading-5 select-none">
              {layer.name}
            </span>
          )}
        </div>
        <span id={visibilityStatusId} className="sr-only">
          {layer.visible ? "Layer visible" : "Layer hidden"}
        </span>
        <button
          type="button"
          aria-label={`${layer.visible ? "Hide" : "Show"} layer ${layer.name}`}
          title={`${layer.visible ? "Hide" : "Show"} layer`}
          className={cn(
            "relative z-10 flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 outline-none transition-[color,background-color,opacity] focus-visible:ring-1",
            isFocused
              ? "opacity-100"
              : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
            layer.visible
              ? "text-foreground-muted hover:bg-theme-border hover:text-foreground-secondary focus-visible:ring-focus-ring"
              : "text-foreground-secondary hover:bg-theme-border focus-visible:ring-focus-ring",
          )}
          onClick={handleVisibilityClick}
          onDoubleClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              if (!useKeyboardFocusStore.getState().owns("layers-panel")) event.preventDefault();
              event.stopPropagation();
              return;
            }
            onRowKeyDown(event);
          }}
          tabIndex={isFocused ? 0 : -1}
        >
          <VisibilityIcon isHidden={!layer.visible} />
        </button>
        <div
          className={cn(
            "pointer-events-none relative z-10",
            !layer.visible ? "opacity-40" : !inUse && "opacity-50",
          )}
        >
          <LayerNumber layer={layer} />
        </div>
      </div>

      {/* Expanded editor */}
      {isExpanded && <LayerEditor layer={layer} onRestoreRowFocus={onRestoreRowFocus} />}
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

function layerRowDomId(layerId: number): string {
  return `layers-layer-${layerId}`;
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
 * - Type-to-filter layer search
 * - Keyboard navigation (Shift+L to focus, arrows to navigate, Space/Enter/Delete for actions)
 */
export function LayersPanel() {
  const { getAllLayers, activeLayerId, setActiveLayer } = useLayerStore();
  const editingLayerId = useLayerStore((s) => s.editingLayerId);
  const expandedLayerId = useLayerStore((s) => s.expandedLayerId);
  const setExpandedLayerId = useLayerStore((s) => s.setExpandedLayerId);
  const isFocused = useLayerStore((s) => s.isFocused);
  const focusedLayerId = useLayerStore((s) => s.focusedLayerId);
  const setFocused = useLayerStore((s) => s.setFocused);
  const setFocusedLayerId = useLayerStore((s) => s.setFocusedLayerId);
  const [isLayerFilterOpen, setIsLayerFilterOpen] = useState(false);
  const [layerFilter, setLayerFilter] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);
  const filterReturnLayerIdRef = useRef<number | null>(null);
  const sourceBacked = useDocumentStore((s) => s.backing.kind === "source");

  // Claim keyboard focus when Layers panel is keyboard-navigating
  useKeyboardFocus("layers-panel", isFocused);
  useKeyboardFocus("layers-filter", isLayerFilterOpen);

  const layers = getAllLayers();
  const filterQuery = isLayerFilterOpen ? layerFilter.trim().toLowerCase() : "";
  const filteredLayers = filterQuery
    ? layers.filter((layer) => layer.name.toLowerCase().includes(filterQuery))
    : layers;
  const layerIds = filteredLayers.map((layer) => layer.id);
  const filterCursorLayerId = isLayerFilterOpen
    ? (filteredLayers.find(
        (layer) => layer.id === (focusedLayerId ?? filterReturnLayerIdRef.current),
      )?.id ??
      filteredLayers[0]?.id ??
      null)
    : null;

  const openLayerFilter = useCallback(
    (initialQuery = "") => {
      const state = useLayerStore.getState();
      filterReturnLayerIdRef.current = state.focusedLayerId ?? state.activeLayerId;
      setLayerFilter(initialQuery);
      setIsLayerFilterOpen(true);
      setFocused(false);
      requestAnimationFrame(() => filterInputRef.current?.focus());
    },
    [setFocused],
  );

  const dismissLayerFilter = useCallback(() => {
    filterReturnLayerIdRef.current = null;
    setLayerFilter("");
    setIsLayerFilterOpen(false);
  }, []);

  const releaseLayerFocus = useCallback(() => {
    setFocused(false);
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && panelRef.current?.contains(activeElement)) {
      activeElement.blur();
    }
  }, [setFocused]);

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

  const closeLayerFilter = useCallback(
    (requestedLayerId?: number) => {
      const returnLayerId =
        requestedLayerId ?? filterReturnLayerIdRef.current ?? filterCursorLayerId ?? activeLayerId;
      dismissLayerFilter();
      requestAnimationFrame(() => {
        const state = useLayerStore.getState();
        const restoredLayerId = state.layers.has(returnLayerId)
          ? returnLayerId
          : state.activeLayerId;
        state.setFocused(true);
        state.setFocusedLayerId(restoredLayerId);
      });
    },
    [activeLayerId, dismissLayerFilter, filterCursorLayerId],
  );

  const handleLayerFilterKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!useKeyboardFocusStore.getState().owns("layers-filter")) {
        event.preventDefault();
        return;
      }
      if (event.nativeEvent.isComposing) return;
      if (event.key === "Tab") {
        event.preventDefault();
        event.stopPropagation();
        filterInputRef.current?.focus();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeLayerFilter();
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        event.stopPropagation();
        filterInputRef.current?.focus();
        return;
      }
      if (filteredLayers.length === 0) return;

      const cursorIndex = Math.max(
        0,
        filteredLayers.findIndex((layer) => layer.id === filterCursorLayerId),
      );
      let nextLayerId: number | null = null;
      switch (event.key) {
        case "ArrowDown":
          nextLayerId = filteredLayers[(cursorIndex + 1) % filteredLayers.length].id;
          break;
        case "ArrowUp":
          nextLayerId =
            filteredLayers[(cursorIndex - 1 + filteredLayers.length) % filteredLayers.length].id;
          break;
        case "Home":
          nextLayerId = filteredLayers[0].id;
          break;
        case "End":
          nextLayerId = filteredLayers[filteredLayers.length - 1].id;
          break;
        case "Enter":
          event.preventDefault();
          event.stopPropagation();
          setActiveLayer(filteredLayers[cursorIndex].id);
          closeLayerFilter(filteredLayers[cursorIndex].id);
          return;
        default:
          return;
      }
      event.preventDefault();
      event.stopPropagation();
      setFocusedLayerId(nextLayerId);
    },
    [closeLayerFilter, filterCursorLayerId, filteredLayers, setActiveLayer, setFocusedLayerId],
  );

  const handlePanelPointerDownCapture = useCallback(
    (event: React.PointerEvent) => {
      if (
        !isLayerFilterOpen ||
        !(event.target instanceof Element) ||
        event.target.closest("#layers-filter")
      ) {
        return;
      }
      dismissLayerFilter();
    },
    [dismissLayerFilter, isLayerFilterOpen],
  );

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

  // Release keyboard ownership on click outside the panel.
  useEffect(() => {
    if (!isFocused && !isLayerFilterOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return;
      if (isFocused) setFocused(false);
      if (isLayerFilterOpen) dismissLayerFilter();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dismissLayerFilter, isFocused, isLayerFilterOpen, setFocused]);

  const handleLayerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, layerId: number) => {
      if (!useKeyboardFocusStore.getState().owns("layers-panel")) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "f" &&
        !isEditableTarget(event.target)
      ) {
        event.preventDefault();
        event.stopPropagation();
        openLayerFilter();
        return;
      }
      if (handleNavigationKeyDown(event, layerId)) return;

      if (event.key === " ") {
        event.preventDefault();
        setActiveLayer(layerId);
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (sourceBacked) return;
        const current = useLayerStore.getState().expandedLayerId;
        setExpandedLayerId(current === layerId ? null : layerId);
      } else if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        if (sourceBacked) return;
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
        if (intent) {
          event.preventDefault();
          const { library: currentLibrary, renderer } = useWasmContextStore.getState();
          if (!currentLibrary || !renderer) return;
          if (intent === "redo") {
            useHistoryStore.getState().redo({ library: currentLibrary, renderer });
          } else {
            useHistoryStore.getState().undo({ library: currentLibrary, renderer });
          }
          return;
        }
        if (
          event.key.length !== 1 ||
          event.metaKey ||
          event.ctrlKey ||
          event.altKey ||
          !event.key.trim()
        ) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        openLayerFilter(event.key);
      }
    },
    [
      handleNavigationKeyDown,
      openLayerFilter,
      setActiveLayer,
      setExpandedLayerId,
      setFocused,
      setFocusedLayerId,
      sourceBacked,
    ],
  );

  return (
    <div
      ref={panelRef}
      className="flex h-full flex-col"
      onPointerDownCapture={handlePanelPointerDownCapture}
    >
      {isLayerFilterOpen && (
        <div data-layers-filter-row className="px-1 pt-1.5 pb-1">
          <div
            id="layers-filter"
            className="flex h-6 items-center gap-1.5 rounded-lg border border-theme-border bg-input px-1.5 text-foreground-subtle transition-colors focus-within:border-focus-ring focus-within:ring-1 focus-within:ring-focus-ring"
          >
            <svg
              aria-hidden="true"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="flex-shrink-0"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              ref={filterInputRef}
              type="search"
              aria-label="Filter layers"
              aria-controls="layers-list"
              aria-activedescendant={
                filterCursorLayerId === null ? undefined : layerRowDomId(filterCursorLayerId)
              }
              value={layerFilter}
              onChange={(event) => setLayerFilter(event.target.value)}
              onFocus={() => {
                const state = useLayerStore.getState();
                if (state.isFocused) state.setFocused(false);
              }}
              onKeyDown={handleLayerFilterKeyDown}
              placeholder="Filter layers"
              className="min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-xs leading-5 text-foreground outline-none placeholder:text-foreground-faint [&::-webkit-search-cancel-button]:hidden"
            />
            {layerFilter && (
              <button
                type="button"
                aria-label="Clear layer filter"
                onClick={() => {
                  setLayerFilter("");
                  requestAnimationFrame(() => filterInputRef.current?.focus());
                }}
                className="flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-foreground-subtle hover:text-foreground"
              >
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      {/* Layer list */}
      <ul
        id="layers-list"
        aria-label="Layers"
        className={cn(
          "m-0 flex list-none flex-col gap-0.5 overflow-y-auto p-0 py-1",
          filterQuery && filteredLayers.length === 0 ? "flex-none" : "flex-1",
        )}
        onWheel={(e) => e.stopPropagation()}
      >
        {filteredLayers.map((layer) => {
          const rowProps = getRowProps(layer.id);
          return (
            <LayerRow
              key={layer.id}
              layer={layer}
              isActive={layer.id === activeLayerId}
              isFocused={
                (isFocused && layer.id === focusedLayerId) ||
                (isLayerFilterOpen && layer.id === filterCursorLayerId)
              }
              isExpanded={expandedLayerId === layer.id}
              inUse={usedLayerKeys.has(`${layer.layerNumber}/${layer.datatype}`)}
              onSelect={() => setActiveLayer(layer.id)}
              onPointerSelect={() => {
                if (isLayerFilterOpen) dismissLayerFilter();
                setActiveLayer(layer.id);
                releaseLayerFocus();
              }}
              onToggleVisibility={() => useLayerStore.getState().toggleVisibility(layer.id)}
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
      {filterQuery && filteredLayers.length === 0 && (
        <output className="block px-3 py-5 text-center text-xs text-foreground-subtle">
          No layers match &ldquo;{layerFilter.trim()}&rdquo;
        </output>
      )}
    </div>
  );
}
