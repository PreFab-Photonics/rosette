import { useMemo } from "react";
import { useViewportStore, GRID_SIZE } from "@/stores/viewport";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useTextStore } from "@/stores/text";
import { useSelectionStore } from "@/stores/selection";
import { useLayerStore } from "@/stores/layer";
import { useUIStore } from "@/stores/ui";
import { useExplorerStore } from "@/stores/explorer";
import { getNormalizedSelection } from "@/lib/text";
import { TEXT_DEFAULT_HEIGHT, TEXT_FONT_FAMILY, TEXT_CAP_HEIGHT_RATIO } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Text label data returned from WASM library. */
interface TextLabel {
  id: string;
  text: string;
  x: number;
  y: number;
  height: number;
  layer: number;
  datatype: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Estimate the bounding box dimensions for a text label (must match the Rust text_bbox).
 *
 * `height` is the stored value (visual cap-height). We scale up by
 * `1 / TEXT_CAP_HEIGHT_RATIO` to get the CSS em-size, then derive
 * character width (0.6 × em) and line height (1.2 × em).
 *
 * Returns { width, totalHeight } in world units.
 */
function estimateTextSize(text: string, height: number): { width: number; totalHeight: number } {
  const emSize = height / TEXT_CAP_HEIGHT_RATIO;
  const lines = text.split("\n");
  const maxChars = Math.max(1, ...lines.map((l) => l.length));
  const width = emSize * 0.6 * maxChars;
  const totalHeight = emSize * 1.2 * lines.length;
  return { width, totalHeight };
}

// ---------------------------------------------------------------------------
// Committed text labels
// ---------------------------------------------------------------------------

/**
 * Renders a single committed (non-editing) text label with optional
 * selection/hover outline.
 */
function CommittedTextLabel({
  label,
  zoom,
  offset,
  color,
  isSelected,
  isHovered,
}: {
  label: TextLabel;
  zoom: number;
  offset: { x: number; y: number };
  color: string;
  isSelected: boolean;
  isHovered: boolean;
}) {
  // Stored height is the visual cap-height; scale to CSS em-size
  const fontSizePx = (label.height / TEXT_CAP_HEIGHT_RATIO) * zoom;

  // Don't render if too small to see
  if (fontSizePx < 1) return null;

  // Position is the bottom-left anchor; CSS div starts at top-left,
  // so offset upward by the total rendered height.
  const { width, totalHeight } = estimateTextSize(label.text, label.height);
  const screenX = label.x * zoom + offset.x;
  const screenY = (label.y - totalHeight) * zoom + offset.y;

  const showOutline = isSelected || isHovered;
  let outlineStyle: React.CSSProperties | undefined;
  if (showOutline) {
    const widthPx = width * zoom;
    const heightPx = totalHeight * zoom;
    const outlineColor = isSelected ? "rgba(68, 255, 68, 0.8)" : color;
    outlineStyle = {
      position: "absolute" as const,
      left: "-3px",
      top: "-3px",
      width: `${widthPx + 6}px`,
      height: `${heightPx + 6}px`,
      border: `1.5px solid ${outlineColor}`,
      borderRadius: "1px",
      pointerEvents: "none" as const,
    };
  }

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 select-none whitespace-pre"
      style={{
        transform: `translate(${screenX}px, ${screenY}px)`,
        fontSize: `${fontSizePx}px`,
        lineHeight: 1.2,
        fontFamily: TEXT_FONT_FAMILY,
        color: isSelected ? "rgb(68, 255, 68)" : color,
      }}
    >
      {showOutline && <div style={outlineStyle} />}
      {label.text}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active editing text
// ---------------------------------------------------------------------------

/**
 * Renders the text currently being edited inline on the canvas,
 * with blinking cursor and selection highlighting.
 */
function ActiveTextEditor({
  zoom,
  offset,
  color,
}: {
  zoom: number;
  offset: { x: number; y: number };
  color: string;
}) {
  const activeText = useTextStore((s) => s.activeText);
  const showCursor = useTextStore((s) => s.showCursor);

  if (!activeText) return null;

  // TEXT_DEFAULT_HEIGHT is in nm; multiply by GRID_SIZE to get world units,
  // divide by cap-height ratio to get CSS em-size, then by zoom to screen px.
  const fontSizePx = ((TEXT_DEFAULT_HEIGHT * GRID_SIZE) / TEXT_CAP_HEIGHT_RATIO) * zoom;
  if (fontSizePx < 1) return null;

  const lineHeightPx = fontSizePx * 1.2;
  // Approximate monospace character width (0.6 x font size is standard)
  const charWidthPx = fontSizePx * 0.6;

  // Position is the bottom-left anchor; CSS div starts at top-left,
  // so offset upward by the total rendered height of the current content.
  const lines = activeText.content.split("\n");
  const activeTextHeight = lineHeightPx * Math.max(1, lines.length);

  const screenX = activeText.x * zoom + offset.x;
  const screenY = activeText.y * zoom + offset.y - activeTextHeight;

  const selection = getNormalizedSelection(activeText.selection);

  // Cursor position in pixels relative to the text origin
  const cursorLine = activeText.cursorPosition.line;
  const cursorCol = activeText.cursorPosition.column;
  const cursorX = cursorCol * charWidthPx;
  const cursorY = cursorLine * lineHeightPx;

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 select-none"
      style={{
        transform: `translate(${screenX}px, ${screenY}px)`,
        fontSize: `${fontSizePx}px`,
        lineHeight: `${lineHeightPx}px`,
        fontFamily: TEXT_FONT_FAMILY,
        color,
      }}
    >
      {/* Text content with selection highlighting */}
      {lines.map((line, lineIndex) => {
        // Determine if this line has a selection
        const hasSelection =
          selection && lineIndex >= selection.start.line && lineIndex <= selection.end.line;

        if (!hasSelection) {
          return (
            <div key={lineIndex} style={{ height: `${lineHeightPx}px`, whiteSpace: "pre" }}>
              {line || "\u200B"}
            </div>
          );
        }

        // Selection spans this line
        const startCol = lineIndex === selection.start.line ? selection.start.column : 0;
        const endCol = lineIndex === selection.end.line ? selection.end.column : line.length;

        const beforeText = line.substring(0, startCol);
        const selectedText = line.substring(startCol, endCol);
        const afterText = line.substring(endCol);

        return (
          <div key={lineIndex} style={{ height: `${lineHeightPx}px`, whiteSpace: "pre" }}>
            {beforeText && <span>{beforeText}</span>}
            {selectedText && (
              <span
                style={{
                  backgroundColor: "rgba(65, 105, 225, 0.7)",
                  color: "#ffffff",
                }}
              >
                {selectedText}
              </span>
            )}
            {afterText && <span>{afterText}</span>}
            {!line && "\u200B"}
          </div>
        );
      })}

      {/* Blinking cursor */}
      {showCursor && (
        <div
          className="absolute"
          style={{
            left: `${cursorX}px`,
            top: `${cursorY}px`,
            width: "2px",
            height: `${lineHeightPx}px`,
            backgroundColor: color,
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main overlay
// ---------------------------------------------------------------------------

/**
 * HTML overlay for rendering text labels on top of the WebGPU canvas.
 *
 * Renders both committed text elements (from the WASM library) and
 * the active text being edited inline. Text size is in world units
 * (nanometers) and scales with the viewport zoom.
 *
 * Also renders selection/hover outlines for text elements, since the
 * WASM renderer only knows about polygon shapes and cannot draw
 * outlines for text.
 */
export function TextOverlay() {
  const { zoom, offset } = useViewportStore();
  const library = useWasmContextStore((s) => s.library);
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";
  const isEditing = useTextStore((s) => s.isEditingText);

  // Re-render when library syncs (new text added, undo/redo)
  const syncGeneration = useWasmContextStore((s) => s.syncGeneration);
  // Re-render when switching cells
  const activeCell = useExplorerStore((s) => s.activeCell);

  // Subscribe to selection/hover for outline rendering
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const hoveredId = useSelectionStore((s) => s.hoveredId);

  const layers = useLayerStore((s) => s.layers);
  const activeLayerId = useLayerStore((s) => s.activeLayerId);

  // Fetch committed text labels from WASM — memoized so it only re-runs when
  // library data actually changes, not on every pan/zoom frame.
  const textLabels = useMemo<TextLabel[]>(() => {
    // These deps trigger re-computation when library data changes
    void syncGeneration;
    void activeCell;
    if (!library) return [];
    try {
      const data = library.get_text_labels();
      if (data && Array.isArray(data)) {
        return data as TextLabel[];
      }
    } catch {
      // Library may not be ready yet
    }
    return [];
  }, [library, syncGeneration, activeCell]);

  // Get the active layer color for the editing text
  const activeLayer = layers.get(activeLayerId);
  const editingColor = activeLayer?.color ?? (isDark ? "#ffffff" : "#000000");

  // Helper to get layer color from layer number
  const getLayerColor = (layerNumber: number, datatype: number): string => {
    for (const layer of layers.values()) {
      if (layer.layerNumber === layerNumber && layer.datatype === datatype) {
        return layer.color;
      }
    }
    return isDark ? "#ffffff" : "#000000";
  };

  const hasContent = textLabels.length > 0 || isEditing;
  if (!hasContent) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden")}>
      {/* Committed text labels */}
      {textLabels.map((label) => (
        <CommittedTextLabel
          key={label.id}
          label={label}
          zoom={zoom}
          offset={offset}
          color={getLayerColor(label.layer, label.datatype)}
          isSelected={selectedIds.has(label.id)}
          isHovered={hoveredId === label.id}
        />
      ))}

      {/* Active editing text */}
      {isEditing && <ActiveTextEditor zoom={zoom} offset={offset} color={editingColor} />}
    </div>
  );
}
