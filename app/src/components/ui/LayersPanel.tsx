import { useCallback, useEffect, useRef, useState } from "react";
import { useLayerStore, type Layer } from "@/stores/layer";
import { useContextMenuStore } from "@/stores/context-menu";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils";

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Single layer row in the panel.
 */
function LayerRow({
  layer,
  isActive,
  isDark,
  onSelect,
  onUpdateLayer,
  startEditing,
}: {
  layer: Layer;
  isActive: boolean;
  isDark: boolean;
  onSelect: () => void;
  onUpdateLayer: (updates: Partial<Layer>) => void;
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

  const handleNameSubmit = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== layer.name) {
      onUpdateLayer({ name: trimmed });
    } else {
      setEditName(layer.name);
    }
    setIsEditing(false);
  }, [editName, layer.name, onUpdateLayer]);

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

  return (
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
      {/* Color swatch */}
      <div
        className={cn(
          "h-4.5 w-4.5 flex-shrink-0 rounded border",
          isDark ? "border-white/10" : "border-black/10",
          !layer.visible && "opacity-40",
        )}
        style={{ backgroundColor: layer.color }}
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
 * - Toggle layer visibility (eye icon)
 * - Inline rename (double-click or context menu)
 * - Right-click context menu (add, delete, rename, toggle visibility)
 * - Color picker (click swatch)
 * - Add new layers
 * - Collapsible layer list
 */
export function LayersPanel() {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  const { getAllLayers, activeLayerId, setActiveLayer, setLayer } = useLayerStore();
  const editingLayerId = useLayerStore((s) => s.editingLayerId);

  const layers = getAllLayers();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleUpdateLayer = useCallback(
    (layer: Layer, updates: Partial<Layer>) => {
      setLayer({ ...layer, ...updates });
    },
    [setLayer],
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
            isDark={isDark}
            onSelect={() => setActiveLayer(layer.id)}
            onUpdateLayer={(updates) => handleUpdateLayer(layer, updates)}
            startEditing={editingLayerId === layer.id}
          />
        ))}
      </div>
    </div>
  );
}
