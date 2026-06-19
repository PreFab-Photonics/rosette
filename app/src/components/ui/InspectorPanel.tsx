import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelectionStore } from "@/stores/selection";
import { useUIStore } from "@/stores/ui";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import {
  ChangeElementLayerCommand,
  EditVerticesCommand,
  EditPathCommand,
  ResizeElementsCommand,
  MoveElementsToCommand,
  SetCellOriginCommand,
  RenameCellCommand,
  UpdateTextContentCommand,
  MoveTextCommand,
  SetTextHeightCommand,
  TextToPolygonsCommand,
  MoveImageCommand,
  ResizeImageCommand,
  SetInstanceTransformCommand,
  SetInstanceArrayCommand,
  type ArrayParams,
} from "@/lib/commands";
import { useExplorerStore } from "@/stores/explorer";
import { usePathStore, type PathMetadata } from "@/stores/path";
import { useImageStore, isImageId, imageIdToKey } from "@/stores/image";
import { formatCoordinate, type UnitInfo } from "@/lib/format";
import { computePathLength } from "@/lib/path";
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

import {
  NumberField,
  TextField,
  TextAreaField,
  LayerSelector,
  SectionHeader,
} from "./inspector/fields";
import { VertexRow, VerticesSection } from "./inspector/VerticesSection";

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

        // Read array repetition parameters (lattice vectors).
        // Payload: [columns, rows, col_x, col_y, row_x, row_y].
        const arrayRaw = library.get_cell_ref_array_vectors(firstId);
        let arrayParams: ArrayParams | null = null;
        if (arrayRaw && arrayRaw.length === 6) {
          arrayParams = {
            columns: arrayRaw[0],
            rows: arrayRaw[1],
            colVector: { x: arrayRaw[2], y: arrayRaw[3] },
            rowVector: { x: arrayRaw[4], y: arrayRaw[5] },
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

  // Subscribe to history changes so cell inspector re-reads origin after undo/redo/execute.
  // The value itself is unused; the subscription triggers re-renders.
  useHistoryStore((s) => s.undoStack.length + s.redoStack.length);

  // Path metadata subscription — must be at the top level (before early returns)
  // to satisfy React's Rules of Hooks.
  const pathMetadata = usePathStore((s) => s.pathMetadata);

  // Image overlay selection — detected from the unified selection store.
  // An image is selected when selectedIds contains exactly one "img:"-prefixed ID
  // and no WASM element data is present.
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const allImages = useImageStore((s) => s.images);
  const selectedImageId = useMemo(() => {
    for (const id of selectedIds) {
      if (isImageId(id)) return imageIdToKey(id);
    }
    return null;
  }, [selectedIds]);
  const selectedImage = selectedImageId ? (allImages.get(selectedImageId) ?? null) : null;

  // Read cell origin — not memoized because we need fresh data after undo/redo.
  // Only used when nothing is selected (cell inspector), so it's cheap.
  const cellOriginRaw = library?.get_cell_origin();
  const cellOrigin = cellOriginRaw ? { x: cellOriginRaw[0], y: cellOriginRaw[1] } : { x: 0, y: 0 };
  const cellOriginRef = useRef(cellOrigin);
  cellOriginRef.current = cellOrigin;

  // Refs for path inspector callbacks (must be declared before early returns).
  const pathMetaRef = useRef<PathMetadata | undefined>(undefined);
  const firstIdRef = useRef<string | undefined>(undefined);

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
            "input, textarea, button:not([tabindex='-1']):not([data-layer-option])",
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
          target = fieldEl.querySelector<HTMLElement>(
            "button:not([tabindex='-1']), input, textarea",
          );
        }
      }
      if (!target) {
        target = el.querySelector<HTMLElement>(
          "input, textarea, button:not([tabindex='-1']):not([data-layer-option])",
        );
      }
      if (target) target.focus();
    });
  }, [focusRequested, focusField]);

  // Path inspector callbacks — declared here (before early returns) so hook
  // count is stable across renders.  The refs ensure they always read the
  // latest metadata without needing it in the dependency array.
  const handlePathWidthChange = useCallback(
    (displayValue: number) => {
      const meta = pathMetaRef.current;
      const elementId = firstIdRef.current;
      if (!meta || !elementId || !library || !renderer) return;
      if (!useSelectionStore.getState().selectedIds.has(elementId)) return;

      // Convert display µm → nm → world units (same as polygon dimension edits)
      const worldWidth = displayValue * unitInfo.scale * GRID_SIZE;
      if (worldWidth <= 0) return;

      const cmd = new EditPathCommand(
        elementId,
        meta,
        { ...meta, width: worldWidth },
        "Change path width",
      );
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [library, renderer, unitInfo],
  );

  const handlePathCornerRadiusChange = useCallback(
    (displayValue: number) => {
      const meta = pathMetaRef.current;
      const elementId = firstIdRef.current;
      if (!meta || !elementId || !library || !renderer) return;
      if (!useSelectionStore.getState().selectedIds.has(elementId)) return;
      const worldRadius = displayValue * unitInfo.scale * GRID_SIZE;
      if (worldRadius < 0) return;

      const cmd = new EditPathCommand(
        elementId,
        meta,
        { ...meta, cornerRadius: worldRadius },
        "Change path corner radius",
      );
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [library, renderer, unitInfo],
  );

  const handlePathWaypointChange = useCallback(
    (index: number, axis: "x" | "y", displayValue: number) => {
      const meta = pathMetaRef.current;
      const elementId = firstIdRef.current;
      if (!meta || !elementId || !library || !renderer) return;
      if (!useSelectionStore.getState().selectedIds.has(elementId)) return;

      // Convert display µm → nm → world (Y negated, same as polygon vertex edits)
      const valueInNm = displayValue * unitInfo.scale;
      const worldValue = axis === "y" ? -valueInNm * GRID_SIZE : valueInNm * GRID_SIZE;

      const newWaypoints = meta.waypoints.map((wp, i) => {
        if (i !== index) return wp;
        return axis === "x" ? { x: worldValue, y: wp.y } : { x: wp.x, y: worldValue };
      });

      const cmd = new EditPathCommand(
        elementId,
        meta,
        { ...meta, waypoints: newWaypoints },
        "Edit path waypoint",
      );
      useHistoryStore.getState().execute(cmd, { library, renderer });
    },
    [library, renderer, unitInfo],
  );

  const handlePathWaypointAdd = useCallback(() => {
    const meta = pathMetaRef.current;
    const elementId = firstIdRef.current;
    if (!meta || !elementId || !library || !renderer) return;
    if (!useSelectionStore.getState().selectedIds.has(elementId)) return;

    const wps = meta.waypoints;
    // Add a new waypoint by extending the last segment.
    // Compute the direction from second-to-last → last and extend by the same length.
    // Fall back to one grid unit in X if the last two waypoints are coincident.
    const last = wps[wps.length - 1];
    const prev = wps[wps.length - 2];
    let dx = last.x - prev.x;
    let dy = last.y - prev.y;
    if (dx === 0 && dy === 0) {
      dx = GRID_SIZE;
    }
    const newWp = { x: last.x + dx, y: last.y + dy };

    const cmd = new EditPathCommand(
      elementId,
      meta,
      { ...meta, waypoints: [...wps, newWp] },
      "Add path waypoint",
    );
    useHistoryStore.getState().execute(cmd, { library, renderer });
  }, [library, renderer]);

  // Image inspector (image overlay selected, no WASM element selection)
  if (!data && selectedImage) {
    // Images are in world coordinates. Convert to display units.
    // Image Y is top-left in world space; negate for user-facing display (Y-up).
    const imgX = formatCoordinate(selectedImage.x / GRID_SIZE, unitInfo);
    const imgY = formatCoordinate(-selectedImage.y / GRID_SIZE, unitInfo);
    const imgW = formatCoordinate(selectedImage.width / GRID_SIZE, unitInfo);
    const imgH = formatCoordinate(selectedImage.height / GRID_SIZE, unitInfo);
    const isLocked = selectedImage.lockAspectRatio;

    const handleImagePositionChange = (axis: "x" | "y", displayValue: number) => {
      if (!library || !renderer || !selectedImageId) return;
      const img = useImageStore.getState().images.get(selectedImageId);
      if (!img) return;
      const valueInNm = displayValue * unitInfo.scale;
      const worldValue = axis === "y" ? -valueInNm * GRID_SIZE : valueInNm * GRID_SIZE;
      const cmd = new MoveImageCommand(
        selectedImageId,
        img.x,
        img.y,
        axis === "x" ? worldValue : img.x,
        axis === "y" ? worldValue : img.y,
      );
      useHistoryStore.getState().execute(cmd, { library, renderer });
    };

    const handleImageSizeChange = (dimension: "width" | "height", displayValue: number) => {
      if (!library || !renderer || !selectedImageId) return;
      const img = useImageStore.getState().images.get(selectedImageId);
      if (!img) return;
      const valueInNm = displayValue * unitInfo.scale;
      const worldValue = valueInNm * GRID_SIZE;
      if (worldValue <= 0) return;

      let newWidth: number;
      let newHeight: number;

      if (img.lockAspectRatio) {
        // Preserve aspect ratio: changing one dimension scales the other
        const aspect = img.naturalHeight / img.naturalWidth;
        if (dimension === "width") {
          newWidth = worldValue;
          newHeight = worldValue * aspect;
        } else {
          newHeight = worldValue;
          newWidth = worldValue / aspect;
        }
      } else {
        newWidth = dimension === "width" ? worldValue : img.width;
        newHeight = dimension === "height" ? worldValue : img.height;
      }

      const cmd = new ResizeImageCommand(
        selectedImageId,
        img.width,
        img.height,
        newWidth,
        newHeight,
      );
      useHistoryStore.getState().execute(cmd, { library, renderer });
    };

    const handleToggleLockAspectRatio = () => {
      if (!selectedImageId) return;
      useImageStore.getState().updateImage(selectedImageId, { lockAspectRatio: !isLocked });
    };

    return (
      <div ref={panelRef} className="flex flex-col pb-2" onWheel={(e) => e.stopPropagation()}>
        {/* Image header */}
        <div className="px-3 pt-2 pb-1">
          <span
            className={cn(
              "text-xs font-medium select-none",
              isDark ? "text-white/70" : "text-black/70",
            )}
          >
            Image
          </span>
        </div>

        {/* Divider */}
        <div className={cn("mx-3 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Filename */}
        <SectionHeader label="File" isDark={isDark} />
        <div className="flex items-center justify-between gap-2 px-3 py-1">
          <span className={cn("text-xs select-none", isDark ? "text-white/50" : "text-black/50")}>
            Name
          </span>
          <span
            className={cn(
              "max-w-32 truncate text-right text-xs",
              isDark ? "text-white/90" : "text-black/90",
            )}
            title={selectedImage.filename}
          >
            {selectedImage.filename}
          </span>
        </div>

        {/* Divider */}
        <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Position */}
        <SectionHeader label="Position" isDark={isDark} />
        <NumberField
          label="X"
          value={imgX}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={(v) => handleImagePositionChange("x", v)}
        />
        <NumberField
          label="Y"
          value={imgY}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={(v) => handleImagePositionChange("y", v)}
        />

        {/* Divider */}
        <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Size */}
        <SectionHeader label="Size" isDark={isDark} />
        <NumberField
          label="W"
          value={imgW}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={(v) => handleImageSizeChange("width", v)}
        />
        <NumberField
          label="H"
          value={imgH}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={(v) => handleImageSizeChange("height", v)}
        />

        {/* Lock aspect ratio toggle */}
        <div className="flex items-center justify-between gap-2 px-3 py-1.5">
          <span className={cn("text-xs select-none", isDark ? "text-white/50" : "text-black/50")}>
            Lock ratio
          </span>
          <button
            type="button"
            onClick={handleToggleLockAspectRatio}
            className={cn(
              "flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-xs transition-colors",
              isLocked
                ? isDark
                  ? "border-white/20 bg-white/10 text-white/80"
                  : "border-black/20 bg-black/10 text-black/80"
                : isDark
                  ? "border-white/10 text-white/40 hover:text-white/60"
                  : "border-black/10 text-black/40 hover:text-black/60",
            )}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isLocked ? (
                <>
                  <rect x="3" y="7" width="10" height="7" rx="1" />
                  <path d="M5 7V5a3 3 0 0 1 6 0v2" />
                </>
              ) : (
                <>
                  <rect x="3" y="7" width="10" height="7" rx="1" />
                  <path d="M5 7V5a3 3 0 0 1 6 0" />
                </>
              )}
            </svg>
            {isLocked ? "On" : "Off"}
          </button>
        </div>
      </div>
    );
  }

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

  // Detect whether the selection represents a cell reference instance.
  // Two detection methods (any match → treat as ref):
  // 1. Hierarchical mode: UUIDs start with "ref:"
  // 2. Multi-polygon refs: group has multiple members
  const isFromRef =
    elements.every((e) => e.id.startsWith("ref:")) ||
    (library != null && library.get_group_ids(first.id).length > 1);

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

          {/* Divider */}
          <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

          {/* Convert to polygons */}
          <div className="px-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (!renderer) return;
                const cmd = new TextToPolygonsCommand([first.id]);
                useHistoryStore.getState().execute(cmd, { library, renderer });
              }}
              className={cn(
                "flex w-full items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs transition-colors",
                isDark
                  ? "border-white/10 text-white/60 hover:bg-white/5 hover:text-white/80"
                  : "border-black/10 text-black/60 hover:bg-black/5 hover:text-black/80",
              )}
            >
              Convert to Polygons
            </button>
          </div>
        </div>
      );
    }
  }

  // Derive path metadata from the top-level subscription (hook is above early returns).
  const pathMeta: PathMetadata | undefined =
    isSingle && first ? pathMetadata.get(first.id) : undefined;
  pathMetaRef.current = pathMeta;
  firstIdRef.current = first?.id;

  // Path inspector (single path selected)
  if (pathMeta && isSingle) {
    // Convert world → nm → display (same pipeline as polygon)
    const pathWidthDisplay = formatCoordinate(pathMeta.width / GRID_SIZE, unitInfo);
    const cornerRadiusDisplay = formatCoordinate(
      (pathMeta.actualCornerRadius ?? pathMeta.cornerRadius) / GRID_SIZE,
      unitInfo,
    );

    // Path length: world coords → nm → display unit
    const pathLengthWorld = computePathLength(
      pathMeta.waypoints,
      pathMeta.actualCornerRadius ?? pathMeta.cornerRadius,
    );
    const pathLengthDisplay = formatCoordinate(pathLengthWorld / GRID_SIZE, unitInfo);

    const posX = bounds ? formatCoordinate(bounds.minX / GRID_SIZE, unitInfo) : "—";
    const posY = bounds ? formatCoordinate(-bounds.maxY / GRID_SIZE, unitInfo) : "—";

    // Build waypoint rows (same conversion as polygon VerticesSection)
    const waypointRows = pathMeta.waypoints.map((wp, i) => {
      const displayX = formatCoordinate(wp.x / GRID_SIZE, unitInfo);
      const displayY = formatCoordinate(-wp.y / GRID_SIZE, unitInfo);
      return (
        <VertexRow
          // oxlint-disable-next-line react/no-array-index-key -- waypoint index is the row's stable identity
          key={i}
          index={i}
          x={displayX}
          y={displayY}
          unit={unitInfo.unit}
          isDark={isDark}
          canRemove={pathMeta.waypoints.length > 2}
          onChangeX={(v) => handlePathWaypointChange(i, "x", v)}
          onChangeY={(v) => handlePathWaypointChange(i, "y", v)}
          onRemove={() => {
            // Remove waypoint (minimum 2)
            if (pathMeta.waypoints.length <= 2) return;
            const meta = pathMetaRef.current;
            const elementId = firstIdRef.current;
            if (!meta || !elementId || !library || !renderer) return;
            const newWaypoints = meta.waypoints.filter((_, j) => j !== i);
            const cmd = new EditPathCommand(
              elementId,
              meta,
              { ...meta, waypoints: newWaypoints },
              "Remove path waypoint",
            );
            useHistoryStore.getState().execute(cmd, { library, renderer });
          }}
        />
      );
    });

    return (
      <div ref={panelRef} className="flex flex-col pb-2" onWheel={(e) => e.stopPropagation()}>
        {/* Path header */}
        <div className="px-3 pt-2 pb-1">
          <span
            className={cn(
              "text-xs font-medium select-none",
              isDark ? "text-white/70" : "text-black/70",
            )}
          >
            Path · {pathMeta.waypoints.length} waypoints · length: {pathLengthDisplay}{" "}
            {unitInfo.unit}
          </span>
        </div>

        {/* Divider */}
        <div className={cn("mx-3 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Layer */}
        <SectionHeader label="Layer" isDark={isDark} />
        <LayerSelector
          currentLayer={first.layer}
          currentDatatype={first.datatype}
          isDark={isDark}
          onChange={handleLayerChange}
        />

        {/* Divider */}
        <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Path properties */}
        <SectionHeader label="Path" isDark={isDark} />
        <NumberField
          label="Width"
          value={pathWidthDisplay}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={handlePathWidthChange}
        />
        <NumberField
          label="Radius"
          value={cornerRadiusDisplay}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={handlePathCornerRadiusChange}
        />

        {/* Divider */}
        <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Position */}
        <SectionHeader label="Position" isDark={isDark} />
        <NumberField
          label="X"
          value={posX}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={(v) => handlePositionChange("x", v)}
        />
        <NumberField
          label="Y"
          value={posY}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={(v) => handlePositionChange("y", v)}
        />

        {/* Divider */}
        <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Waypoints */}
        <SectionHeader label="Waypoints" isDark={isDark} />
        <div className="flex max-h-48 flex-col overflow-y-auto">{waypointRows}</div>
        <div className="px-3 pt-1">
          <button
            type="button"
            onClick={handlePathWaypointAdd}
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
            Add waypoint
          </button>
        </div>
      </div>
    );
  }

  // Cell instance inspector (CellRef selected)
  if (data.instance) {
    const inst = data.instance;

    // Instance position: transform tx/ty converted to display units.
    // tx/ty are in world coordinates; convert world → nm → display, Y negated.
    const instX = formatCoordinate(inst.tx / GRID_SIZE, unitInfo);
    const instY = formatCoordinate(-inst.ty / GRID_SIZE, unitInfo);

    // Bounding-box size (read-only)
    const instW = bounds
      ? formatCoordinate((bounds.maxX - bounds.minX) / GRID_SIZE, unitInfo)
      : "—";
    const instH = bounds
      ? formatCoordinate((bounds.maxY - bounds.minY) / GRID_SIZE, unitInfo)
      : "—";

    // Rotation display (degrees, rounded to 3 decimals to avoid float noise)
    const rotationDisplay = Number.isFinite(inst.rotation) ? inst.rotation.toFixed(3) : "0.000";
    // Scale display
    const scaleDisplay = Number.isFinite(inst.scale) ? inst.scale.toFixed(3) : "1.000";

    // Path length from referenced cell metadata (set by Route.to_cell() / components)
    const cellPathLength = library?.get_cell_path_length(inst.cellName);
    const cellPathLengthDisplay =
      cellPathLength != null ? formatCoordinate(cellPathLength, unitInfo) : null;

    // Array params (default to 1x1 with zero lattice vectors).
    // Lattice vectors are in the AREF's local (pre-transform) world-unit frame.
    const arrayCols = inst.array?.columns ?? 1;
    const arrayRows = inst.array?.rows ?? 1;
    const colVec = inst.array?.colVector ?? { x: 0, y: 0 };
    const rowVec = inst.array?.rowVector ?? { x: 0, y: 0 };
    const isArrayed = arrayCols > 1 || arrayRows > 1;
    // Vector component displays. Y is negated for display (screen Y-up →
    // world Y-down), matching polygon vertex / position fields.
    const colXDisplay = formatCoordinate(colVec.x / GRID_SIZE, unitInfo);
    const colYDisplay = formatCoordinate(-colVec.y / GRID_SIZE, unitInfo);
    const rowXDisplay = formatCoordinate(rowVec.x / GRID_SIZE, unitInfo);
    const rowYDisplay = formatCoordinate(-rowVec.y / GRID_SIZE, unitInfo);

    // Detect whether the original transform is mirrored (negative determinant).
    // A mirrored CellRef has det(linear) = a*d - b*c < 0.
    const isMirrored =
      inst.transform[0] * inst.transform[3] - inst.transform[1] * inst.transform[2] < 0;

    /** Build a new affine transform [a, b, c, d, tx, ty] from rotation (deg) and scale,
     *  preserving the mirror state of the original transform. */
    const buildTransform = (rotDeg: number, s: number, tx: number, ty: number): Float64Array => {
      const r = (rotDeg * Math.PI) / 180;
      const cosR = Math.cos(r);
      const sinR = Math.sin(r);
      // Non-mirrored: [s*cos, -s*sin, s*sin, s*cos]
      // Mirrored (Y-flip then rotate): [s*cos, s*sin, s*sin, -s*cos]
      const a = s * cosR;
      const b = isMirrored ? s * sinR : -s * sinR;
      const c = s * sinR;
      const d = isMirrored ? -s * cosR : s * cosR;
      return new Float64Array([a, b, c, d, tx, ty]);
    };

    const handleInstancePositionChange = (axis: "x" | "y", displayValue: number) => {
      if (!library || !renderer) return;
      const valueInNm = displayValue * unitInfo.scale;
      const worldValue = axis === "y" ? -valueInNm * GRID_SIZE : valueInNm * GRID_SIZE;
      const newTransform = new Float64Array(inst.transform);
      if (axis === "x") {
        newTransform[4] = worldValue;
      } else {
        newTransform[5] = worldValue;
      }
      const cmd = new SetInstanceTransformCommand(
        inst.refId,
        inst.transform,
        newTransform,
        "Move instance",
      );
      useHistoryStore.getState().execute(cmd, { library, renderer });
    };

    const handleInstanceRotationChange = (displayValue: number) => {
      if (!library || !renderer) return;
      const newTransform = buildTransform(displayValue, inst.scale, inst.tx, inst.ty);
      const cmd = new SetInstanceTransformCommand(
        inst.refId,
        inst.transform,
        newTransform,
        "Rotate instance",
      );
      useHistoryStore.getState().execute(cmd, { library, renderer });
    };

    const handleInstanceScaleChange = (displayValue: number) => {
      if (!library || !renderer) return;
      if (displayValue <= 0) return;
      const newTransform = buildTransform(inst.rotation, displayValue, inst.tx, inst.ty);
      const cmd = new SetInstanceTransformCommand(
        inst.refId,
        inst.transform,
        newTransform,
        "Scale instance",
      );
      useHistoryStore.getState().execute(cmd, { library, renderer });
    };

    const handleInstanceArrayChange = (
      field: "columns" | "rows" | "colX" | "colY" | "rowX" | "rowY",
      displayValue: number,
    ) => {
      if (!library || !renderer) return;
      const oldParams = inst.array;
      let cols = arrayCols;
      let rows = arrayRows;
      let newColVec = { ...colVec };
      let newRowVec = { ...rowVec };

      switch (field) {
        case "columns":
          cols = Math.max(1, Math.round(displayValue));
          break;
        case "rows":
          rows = Math.max(1, Math.round(displayValue));
          break;
        case "colX": {
          const world = displayValue * unitInfo.scale * GRID_SIZE;
          newColVec = { x: world, y: newColVec.y };
          break;
        }
        case "colY": {
          // Display Y is screen-up; world Y is screen-down, so negate.
          const world = -displayValue * unitInfo.scale * GRID_SIZE;
          newColVec = { x: newColVec.x, y: world };
          break;
        }
        case "rowX": {
          const world = displayValue * unitInfo.scale * GRID_SIZE;
          newRowVec = { x: world, y: newRowVec.y };
          break;
        }
        case "rowY": {
          const world = -displayValue * unitInfo.scale * GRID_SIZE;
          newRowVec = { x: newRowVec.x, y: world };
          break;
        }
      }

      const newParams: ArrayParams = {
        columns: cols,
        rows: rows,
        colVector: newColVec,
        rowVector: newRowVec,
      };
      const cmd = new SetInstanceArrayCommand(inst.refId, oldParams, newParams);
      useHistoryStore.getState().execute(cmd, { library, renderer });
    };

    return (
      <div ref={panelRef} className="flex flex-col pb-2" onWheel={(e) => e.stopPropagation()}>
        {/* Instance header */}
        <div className="px-3 pt-2 pb-1">
          <span
            className={cn(
              "text-xs font-medium select-none",
              isDark ? "text-white/70" : "text-black/70",
            )}
          >
            Instance · {inst.cellName}
          </span>
        </div>

        {/* Divider */}
        <div className={cn("mx-3 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Position */}
        <SectionHeader label="Position" isDark={isDark} />
        <NumberField
          label="X"
          value={instX}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={(v) => handleInstancePositionChange("x", v)}
        />
        <NumberField
          label="Y"
          value={instY}
          unit={unitInfo.unit}
          isDark={isDark}
          onChange={(v) => handleInstancePositionChange("y", v)}
        />

        {/* Divider */}
        <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Transform */}
        <SectionHeader label="Transform" isDark={isDark} />
        <NumberField
          label="Rotation"
          value={rotationDisplay}
          unit="°"
          isDark={isDark}
          onChange={handleInstanceRotationChange}
        />
        <NumberField
          label="Scale"
          value={scaleDisplay}
          isDark={isDark}
          onChange={handleInstanceScaleChange}
        />

        {/* Divider */}
        <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Array */}
        <SectionHeader label="Array" isDark={isDark} />
        <NumberField
          label="Columns"
          value={String(arrayCols)}
          isDark={isDark}
          onChange={(v) => handleInstanceArrayChange("columns", v)}
        />
        <NumberField
          label="Rows"
          value={String(arrayRows)}
          isDark={isDark}
          onChange={(v) => handleInstanceArrayChange("rows", v)}
        />
        {isArrayed && (
          <>
            {/* Full lattice vectors. A rectangular AREF has Col ΔY = 0 and
                Row ΔX = 0; hex / oblique lattices use the off-axis components. */}
            <NumberField
              label="Col ΔX"
              value={colXDisplay}
              unit={unitInfo.unit}
              isDark={isDark}
              onChange={(v) => handleInstanceArrayChange("colX", v)}
            />
            <NumberField
              label="Col ΔY"
              value={colYDisplay}
              unit={unitInfo.unit}
              isDark={isDark}
              onChange={(v) => handleInstanceArrayChange("colY", v)}
            />
            <NumberField
              label="Row ΔX"
              value={rowXDisplay}
              unit={unitInfo.unit}
              isDark={isDark}
              onChange={(v) => handleInstanceArrayChange("rowX", v)}
            />
            <NumberField
              label="Row ΔY"
              value={rowYDisplay}
              unit={unitInfo.unit}
              isDark={isDark}
              onChange={(v) => handleInstanceArrayChange("rowY", v)}
            />
          </>
        )}

        {/* Divider */}
        <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

        {/* Size (read-only bounding box) */}
        <SectionHeader label="Size" isDark={isDark} />
        <NumberField label="W" value={instW} unit={unitInfo.unit} isDark={isDark} readOnly />
        <NumberField label="H" value={instH} unit={unitInfo.unit} isDark={isDark} readOnly />

        {/* Path length (read-only, shown only when the referenced cell has it) */}
        {cellPathLengthDisplay != null && (
          <>
            <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />
            <SectionHeader label="Path" isDark={isDark} />
            <NumberField
              label="Length"
              value={cellPathLengthDisplay}
              unit={unitInfo.unit}
              isDark={isDark}
              readOnly
            />
          </>
        )}
      </div>
    );
  }

  // Format bounds for display.
  // WASM world coordinates use GRID_SIZE world units per nanometer, with Y inverted.
  // Convert: world → nm (divide by GRID_SIZE, negate Y) → display unit (formatCoordinate).
  const posX = bounds ? formatCoordinate(bounds.minX / GRID_SIZE, unitInfo) : "—";
  const posY = bounds ? formatCoordinate(-bounds.maxY / GRID_SIZE, unitInfo) : "—";
  const width = bounds ? formatCoordinate((bounds.maxX - bounds.minX) / GRID_SIZE, unitInfo) : "—";
  const height = bounds ? formatCoordinate((bounds.maxY - bounds.minY) / GRID_SIZE, unitInfo) : "—";

  // Position is always editable: single elements move directly, multi-selection
  // translates all elements by the delta from the current bounding-box origin.
  const positionEditable = true;

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
      {!isFromRef && (
        <>
          <SectionHeader label="Layer" isDark={isDark} />

          {isMixed ? (
            <div className="flex items-center justify-between gap-2 px-3 py-1">
              <span
                className={cn("text-xs select-none", isDark ? "text-white/50" : "text-black/50")}
              >
                Layer
              </span>
              <span
                className={cn(
                  "text-xs italic select-none",
                  isDark ? "text-white/40" : "text-black/40",
                )}
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
        onChange={isSingle && !isFromRef ? (v) => handleDimensionChange("width", v) : undefined}
        readOnly={!isSingle || isFromRef}
      />
      <NumberField
        label="H"
        value={height}
        unit={unitInfo.unit}
        isDark={isDark}
        onChange={isSingle && !isFromRef ? (v) => handleDimensionChange("height", v) : undefined}
        readOnly={!isSingle || isFromRef}
      />

      {/* Vertices — single selection when editable, all elements when ref (read-only) */}
      {(isSingle || isFromRef) && (
        <>
          {/* Divider */}
          <div className={cn("mx-3 mt-1 h-px", isDark ? "bg-white/5" : "bg-black/5")} />

          {isFromRef && !isSingle ? (
            // Show vertices from all elements (read-only) for ref instances
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
                label={
                  elements.length > 1 ? `Vertices (${elIdx + 1}/${elements.length})` : undefined
                }
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
              readOnly={isFromRef}
            />
          )}
        </>
      )}
    </div>
  );
}
