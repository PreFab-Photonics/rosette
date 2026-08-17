//! WASM bindings for rosette-core Library and Cell.
//!
//! Provides a [`WasmLibrary`] that wraps `rosette_core::Library` and exposes
//! methods to JavaScript for creating and manipulating photonic layouts.

mod cells;
mod elements;
mod geometry;
mod layers;
mod path;
mod queries;
mod refs;
mod serde;
mod spatial;
mod text;

use rosette_core::cell::Element;
use rosette_core::geometry::BBox;
use rosette_core::hierarchy::{HierarchyEvent, WalkControl, walk_hierarchy, walk_hierarchy_from};
use rosette_core::path::{
    stroke_path, stroke_path_transformed, stroke_path_transformed_with_scale,
};
use rosette_core::{Cell, CellRef, Layer, Library, Point, Polygon, Transform};
use rosette_io::json::CellAnnotations;
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use wasm_bindgen::prelude::*;

/// A rendered polygon: (uuid, vertices, color, fill_pattern).
/// fill_pattern: 0=solid, 1=hatched, 2=crosshatched, 3=dotted, 4=horizontal, 5=vertical, 6=zigzag, 7=brick.
type RenderPolygon = (String, Vec<[f64; 2]>, [f32; 4], u32);

/// Iterate over canonical SREF/AREF copy transforms.
fn array_transforms(cell_ref: &CellRef) -> impl ExactSizeIterator<Item = Transform> + '_ {
    cell_ref.copies().map(|copy| copy.transform)
}

/// Element identifier mapping UUID to cell name and element index.
#[derive(Debug, Clone)]
struct ElementRef {
    cell_name: String,
    element_index: usize,
}

#[derive(Debug, PartialEq, ::serde::Serialize)]
struct CellTreeNode {
    name: String,
    children: Vec<CellTreeNode>,
}

/// Prefix for synthetic UUIDs generated for CellRef-resolved polygons.
/// Format: "ref:{cellref_element_index}:{polygon_index_within_ref}:{cellref_uuid}"
pub(crate) const REF_UUID_PREFIX: &str = "ref:";

/// Element information returned by get_element_info.
///
/// Contains all data needed to reconstruct an element for undo/redo.
#[wasm_bindgen]
pub struct ElementInfo {
    vertices: Vec<f64>,
    layer: u16,
    datatype: u16,
}

#[wasm_bindgen]
impl ElementInfo {
    /// Get the vertices as a flat array [x0, y0, x1, y1, ...].
    #[wasm_bindgen(getter)]
    pub fn vertices(&self) -> Vec<f64> {
        self.vertices.clone()
    }

    /// Get the layer number.
    #[wasm_bindgen(getter)]
    pub fn layer(&self) -> u16 {
        self.layer
    }

    /// Get the datatype number.
    #[wasm_bindgen(getter)]
    pub fn datatype(&self) -> u16 {
        self.datatype
    }
}

/// CellRef information returned by get_cell_ref_info.
///
/// Contains all data needed to reconstruct a CellRef element for undo/redo.
#[wasm_bindgen]
pub struct CellRefInfo {
    cell_name: String,
    /// Full affine transform [a, b, c, d, tx, ty]
    transform: Vec<f64>,
}

/// Native layout path information returned by get_native_path_info.
#[wasm_bindgen]
pub struct NativePathInfo {
    centerline: Vec<f64>,
    width: f64,
    end_type: u8,
    layer: u16,
    datatype: u16,
}

#[wasm_bindgen]
impl NativePathInfo {
    /// Get the centerline as [x0, y0, x1, y1, ...].
    #[wasm_bindgen(getter)]
    pub fn centerline(&self) -> Vec<f64> {
        self.centerline.clone()
    }

    /// Get the signed path width.
    #[wasm_bindgen(getter)]
    pub fn width(&self) -> f64 {
        self.width
    }

    /// Get the GDS path end type (0=flush, 1=round, 2=half-width extension).
    #[wasm_bindgen(getter)]
    pub fn end_type(&self) -> u8 {
        self.end_type
    }

    /// Get the layer number.
    #[wasm_bindgen(getter)]
    pub fn layer(&self) -> u16 {
        self.layer
    }

    /// Get the datatype number.
    #[wasm_bindgen(getter)]
    pub fn datatype(&self) -> u16 {
        self.datatype
    }
}

#[wasm_bindgen]
impl CellRefInfo {
    /// Get the referenced cell name.
    #[wasm_bindgen(getter)]
    pub fn cell_name(&self) -> String {
        self.cell_name.clone()
    }

    /// Get the transform as [a, b, c, d, tx, ty].
    #[wasm_bindgen(getter)]
    pub fn transform(&self) -> Vec<f64> {
        self.transform.clone()
    }
}

/// WASM-compatible library wrapper.
///
/// Wraps a `rosette_core::Library` and provides methods for creating
/// and manipulating cells and elements from JavaScript.
#[wasm_bindgen]
pub struct WasmLibrary {
    library: Library,
    active_cell: Option<String>,
    /// Persisted annotations keyed by cell name. Editor origins here are the
    /// authoritative origins used by the editor and instance placement.
    annotations: HashMap<String, CellAnnotations>,
    /// Maps element UUIDs to their location in the library.
    element_refs: HashMap<String, ElementRef>,
    /// Layer colors for rendering (layer_key -> RGBA).
    layer_colors: HashMap<u32, [f32; 4]>,
    /// Layer fill patterns (layer_key -> pattern id).
    /// 0=solid, 1=hatched, 2=crosshatched, 3=dotted, 4=horizontal, 5=vertical, 6=zigzag, 7=brick.
    layer_fill_patterns: HashMap<u32, u32>,
    /// Whether the library has changed since last sync.
    dirty: bool,
    /// Maximum hierarchy depth for rendering CellRef instances.
    /// 0 means unlimited (fully resolve all nested references).
    /// 1 means only render direct elements of the active cell (instances shown as outlines only).
    /// N means resolve up to N levels of nesting.
    hierarchy_depth_limit: u32,
    /// Set of cell names whose internal geometry is hidden.
    /// Hidden cells still show bounding-box outlines and labels,
    /// but their polygons/paths are not rendered.
    hidden_cells: HashSet<String>,
    /// Image overlay bounds per cell (set from JS).
    ///
    /// Maps cell name to `[minX, minY, maxX, maxY]` in the cell's local
    /// coordinate space. Used to expand instance bounding boxes so that
    /// the selection/hover outlines and zoom-to-fit include images.
    cell_image_bounds: HashMap<String, [f64; 4]>,
    /// Cache of CellRef instance bounding boxes for the active cell,
    /// keyed by element index.
    ///
    /// Populated lazily by `instance_bbox_cached` and invalidated on any
    /// structural change (add/remove/move elements, change transforms, toggle
    /// hidden layers/cells, etc.) and whenever the active cell changes.
    /// Avoids repeatedly expanding large AREFs via `array_transforms` on
    /// hover/hit-test/sync hot paths.
    ///
    /// Only caches entries for the cell named in `instance_bbox_cache_cell`.
    instance_bbox_cache: RefCell<HashMap<usize, Option<BBox>>>,
    /// Name of the cell whose bboxes are currently cached in
    /// `instance_bbox_cache`. When the active cell changes, the cache is
    /// invalidated so we never return a bbox from a different cell.
    instance_bbox_cache_cell: RefCell<Option<String>>,
    /// Lazy R-tree spatial index over the active cell's element bounding
    /// boxes, used to make `hit_test`/`hit_test_rect` ~O(log n + k) instead
    /// of O(n) per pointer event.
    ///
    /// Built on demand by `with_spatial_index`, invalidated by `mark_dirty`
    /// (any structural mutation) and rebound when the active cell changes
    /// (tracked by `spatial_index_cell`), mirroring `instance_bbox_cache`.
    spatial_index: RefCell<Option<rstar::RTree<spatial::IndexedElement>>>,
    /// Name of the cell the `spatial_index` was built for, or `None` when the
    /// index is empty/invalid.
    spatial_index_cell: RefCell<Option<String>>,
}

/// Pack layer number and datatype into a single u32 key.
fn layer_key(layer: u16, datatype: u16) -> u32 {
    ((layer as u32) << 16) | (datatype as u32)
}

/// Compute absolute area of a polygon using the shoelace formula.
fn polygon_area(vertices: &[[f64; 2]]) -> f64 {
    let n = vertices.len();
    if n < 3 {
        return 0.0;
    }
    let mut area = 0.0;
    for i in 0..n {
        let j = (i + 1) % n;
        area += vertices[i][0] * vertices[j][1];
        area -= vertices[j][0] * vertices[i][1];
    }
    area.abs() * 0.5
}

fn accumulate_finite_area(area_map: &mut HashMap<(u16, u16), f64>, layer: Layer, area: f64) {
    if !area.is_finite() {
        return;
    }
    let key = (layer.number, layer.datatype);
    let sum = area_map.get(&key).copied().unwrap_or(0.0) + area;
    if sum.is_finite() {
        area_map.insert(key, sum);
    }
}

/// Ratio of CSS em-size to visual cap-height for monospace fonts.
///
/// The stored `height` represents the visual character height (cap-height).
/// CSS `font-size` sets the em square which is larger. This factor converts
/// cap-height → em-size so bounding boxes match what is rendered on screen.
const TEXT_CAP_HEIGHT_RATIO: f64 = 0.72;

/// Compute a bounding box for a text element.
///
/// The stored `height` is the visual cap-height. We convert to em-size
/// (height / CAP_RATIO) to match the CSS font-size used for rendering,
/// then derive character width (0.6 × em) and line height (1.2 × em).
///
/// `position` is the **bottom-left** anchor of the text in world
/// coordinates (Y-down). The bbox extends rightward (+X) and upward
/// (−Y, toward the top of the screen).
fn text_bbox(text: &str, position: &Point, height: f64) -> Option<BBox> {
    if !position.is_finite() || !height.is_finite() || height <= 0.0 {
        return None;
    }
    let em_size = height / TEXT_CAP_HEIGHT_RATIO;
    let lines: Vec<&str> = text.split('\n').collect();
    let max_chars = lines.iter().map(|l| l.len()).max().unwrap_or(1).max(1);
    let width = em_size * 0.6 * max_chars as f64;
    let total_height = em_size * 1.2 * lines.len() as f64;
    if !em_size.is_finite() || !width.is_finite() || !total_height.is_finite() {
        return None;
    }
    BBox::new(
        Point::new(position.x, position.y - total_height),
        Point::new(position.x + width, position.y),
    )
    .ok()
}

/// Parse a synthetic ref UUID without resolving it against library state.
/// Format: "ref:{elem_idx}:{poly_idx}:{cellref_uuid}"
fn parse_ref_uuid(uuid: &str) -> Option<(usize, usize, &str)> {
    let rest = uuid.strip_prefix(REF_UUID_PREFIX)?;
    let mut parts = rest.split(':');
    let elem_idx: usize = parts.next()?.parse().ok()?;
    let poly_idx: usize = parts.next()?.parse().ok()?;
    let token = parts.next()?;
    if token.is_empty() || parts.next().is_some() {
        return None;
    }
    Some((elem_idx, poly_idx, token))
}

// Non-wasm_bindgen methods for internal use
impl WasmLibrary {
    fn format_ref_uuid(element_index: usize, polygon_index: usize, token: &str) -> String {
        format!("{REF_UUID_PREFIX}{element_index}:{polygon_index}:{token}")
    }

    fn element_uuid_at(&self, cell_name: &str, element_index: usize) -> Option<&str> {
        self.element_refs
            .iter()
            .find(|(_, element_ref)| {
                element_ref.cell_name == cell_name && element_ref.element_index == element_index
            })
            .map(|(uuid, _)| uuid.as_str())
    }

    /// Resolve and validate a synthetic ID against its stable real CellRef UUID.
    /// The active cell, current element index, and element kind must all match.
    fn resolve_ref_uuid_parts<'a>(&self, uuid: &'a str) -> Option<(usize, usize, &'a str)> {
        let (element_index, polygon_index, token) = parse_ref_uuid(uuid)?;
        let active_cell = self.active_cell.as_deref()?;
        let element_ref = self.element_refs.get(token)?;
        if element_ref.cell_name != active_cell || element_ref.element_index != element_index {
            return None;
        }
        let cell = self.library.cell(active_cell)?;
        matches!(
            cell.elements().get(element_index),
            Some(Element::CellRef(_))
        )
        .then_some((element_index, polygon_index, token))
    }

    fn canonical_ref_uuid(&self, element_index: usize, token: &str) -> Option<String> {
        let active_cell = self.active_cell.as_deref()?;
        let element_ref = self.element_refs.get(token)?;
        if element_ref.cell_name != active_cell || element_ref.element_index != element_index {
            return None;
        }
        let cell = self.library.cell(active_cell)?;
        matches!(
            cell.elements().get(element_index),
            Some(Element::CellRef(_))
        )
        .then(|| Self::format_ref_uuid(element_index, 0, token))
    }

    fn resolve_cell_ref_id(&self, id: &str) -> Option<(String, usize)> {
        if id.starts_with(REF_UUID_PREFIX) {
            let (element_index, _, _) = self.resolve_ref_uuid_parts(id)?;
            return Some((self.active_cell.clone()?, element_index));
        }

        let element_ref = self.element_refs.get(id)?;
        let cell = self.library.cell(&element_ref.cell_name)?;
        matches!(
            cell.elements().get(element_ref.element_index),
            Some(Element::CellRef(_))
        )
        .then(|| (element_ref.cell_name.clone(), element_ref.element_index))
    }

    // =========================================================================
    // CellRef resolution helpers (on-the-fly, no persistent flattening)
    // =========================================================================

    /// Recursively collect render polygons from a cell for on-the-fly CellRef resolution.
    ///
    /// Generates synthetic UUIDs in the format
    /// "ref:{cellref_element_index}:{poly_counter}:{cellref_uuid}"
    /// where `cellref_element_index` is the index of the CellRef in the active cell,
    /// and `poly_counter` is a monotonically increasing counter for each polygon.
    ///
    /// `current_depth` tracks how many CellRef levels we've descended into.
    /// `max_depth` is the limit (0 = unlimited). When `current_depth >= max_depth`,
    /// nested CellRef elements are skipped (they still appear as bounding-box outlines
    /// via `get_instance_bboxes`).
    #[allow(clippy::too_many_arguments)]
    fn collect_render_polygons_recursive(
        &self,
        cell: &Cell,
        transform: &Transform,
        initial_ancestor: &str,
        cellref_elem_idx: usize,
        cellref_uuid: &str,
        poly_counter: &mut usize,
        default_color: &[f32; 4],
        current_depth: u32,
        max_depth: u32,
        result: &mut Vec<RenderPolygon>,
    ) {
        walk_hierarchy_from(
            &self.library,
            cell,
            *transform,
            &[initial_ancestor],
            |event| {
                if let HierarchyEvent::Enter(placement) = event
                    && placement.depth > 0
                    && ((max_depth > 0 && current_depth + placement.depth as u32 >= max_depth)
                        || self.hidden_cells.contains(placement.cell.name()))
                {
                    return WalkControl::SkipSubtree;
                }
                let HierarchyEvent::Element(placed) = event else {
                    return WalkControl::Continue;
                };
                match placed.element {
                    Element::Polygon { polygon, layer } => {
                        let Ok(transformed) = polygon.try_transform(&placed.placement.transform)
                        else {
                            *poly_counter += 1;
                            return WalkControl::Continue;
                        };
                        let key = layer_key(layer.number, layer.datatype);
                        let color = self
                            .layer_colors
                            .get(&key)
                            .copied()
                            .unwrap_or(*default_color);

                        if color[3] <= 0.0 {
                            *poly_counter += 1;
                            return WalkControl::Continue;
                        }

                        let fill_pattern = self.layer_fill_patterns.get(&key).copied().unwrap_or(0);
                        let vertices: Vec<[f64; 2]> =
                            transformed.vertices().iter().map(|p| [p.x, p.y]).collect();

                        let uuid =
                            Self::format_ref_uuid(cellref_elem_idx, *poly_counter, cellref_uuid);
                        *poly_counter += 1;
                        result.push((uuid, vertices, color, fill_pattern));
                    }
                    Element::Path(path) => {
                        if let Some(ribbon) = stroke_path_transformed(
                            path.points(),
                            path.width(),
                            path.end_type(),
                            &placed.placement.transform,
                        ) {
                            let layer = path.layer();
                            let key = layer_key(layer.number, layer.datatype);
                            let color = self
                                .layer_colors
                                .get(&key)
                                .copied()
                                .unwrap_or(*default_color);

                            if color[3] > 0.0 {
                                let fill_pattern =
                                    self.layer_fill_patterns.get(&key).copied().unwrap_or(0);
                                let vertices: Vec<[f64; 2]> =
                                    ribbon.vertices().iter().map(|p| [p.x, p.y]).collect();
                                let uuid = Self::format_ref_uuid(
                                    cellref_elem_idx,
                                    *poly_counter,
                                    cellref_uuid,
                                );
                                result.push((uuid, vertices, color, fill_pattern));
                            }
                        }
                        *poly_counter += 1;
                    }
                    Element::CellRef(_) | Element::Text(_) => {}
                }
                WalkControl::Continue
            },
        );
    }

    /// Recursively accumulate polygon area per layer for a cell.
    ///
    /// Walks all elements (polygons, paths, cell refs) applying the given
    /// transform. For rigid transforms (rotation, translation, mirror) the
    /// polygon area is used directly since it is invariant. For non-rigid
    /// transforms the area is scaled by `|determinant|`.
    fn collect_area_recursive(
        &self,
        cell: &Cell,
        transform: &Transform,
        current_depth: u32,
        max_depth: u32,
        area_map: &mut HashMap<(u16, u16), f64>,
    ) {
        walk_hierarchy(&self.library, cell, *transform, |event| {
            if let HierarchyEvent::Enter(placement) = event
                && placement.depth > 0
                && ((max_depth > 0 && current_depth + placement.depth as u32 >= max_depth)
                    || self.hidden_cells.contains(placement.cell.name()))
            {
                return WalkControl::SkipSubtree;
            }
            let HierarchyEvent::Element(placed) = event else {
                return WalkControl::Continue;
            };
            let det_abs = placed.placement.transform.determinant().abs();
            if !det_abs.is_finite() {
                return WalkControl::Continue;
            }
            match placed.element {
                Element::Polygon { polygon, layer } => {
                    let area = polygon.area() * det_abs;
                    accumulate_finite_area(area_map, *layer, area);
                }
                Element::Path(path) => {
                    if let Some(ribbon) = stroke_path_transformed(
                        path.points(),
                        path.width(),
                        path.end_type(),
                        &placed.placement.transform,
                    ) {
                        let area = ribbon.area();
                        accumulate_finite_area(area_map, path.layer(), area);
                    }
                }
                Element::CellRef(_) | Element::Text(_) => {}
            }
            WalkControl::Continue
        });
    }

    /// Recursively collect `(cell_name, transform)` pairs for all cells
    /// referenced (directly or transitively) by the given cell.
    ///
    /// Used by the JS-side image overlay to render images belonging to
    /// child cells at the correct instance transform.
    fn collect_cell_contexts_recursive(
        &self,
        cell: &Cell,
        transform: &Transform,
        initial_ancestor: &str,
        current_depth: u32,
        max_depth: u32,
        result: &mut Vec<(String, [f64; 6])>,
    ) {
        walk_hierarchy_from(
            &self.library,
            cell,
            *transform,
            &[initial_ancestor],
            |event| {
                if let HierarchyEvent::Enter(placement) = event {
                    if placement.depth == 0 {
                        return WalkControl::Continue;
                    }
                    if (max_depth > 0 && current_depth + placement.depth as u32 >= max_depth)
                        || self.hidden_cells.contains(placement.cell.name())
                    {
                        return WalkControl::SkipSubtree;
                    }
                    let transform = placement.transform;
                    if !transform.is_finite() || !transform.is_invertible() {
                        return WalkControl::SkipSubtree;
                    }
                    result.push((
                        placement.cell.name().to_string(),
                        [
                            transform.a,
                            transform.b,
                            transform.c,
                            transform.d,
                            transform.tx,
                            transform.ty,
                        ],
                    ));
                }
                WalkControl::Continue
            },
        );
    }

    fn instance_cell_contexts_internal(&self) -> Vec<(String, [f64; 6])> {
        let Some(cell_name) = &self.active_cell else {
            return Vec::new();
        };
        let Some(cell) = self.library.cell(cell_name) else {
            return Vec::new();
        };

        let max_depth = self.hierarchy_depth_limit;
        let mut contexts = Vec::new();
        for element in cell.elements() {
            let Element::CellRef(cell_ref) = element else {
                continue;
            };
            if cell_ref.cell_name() == cell.name()
                || self.hidden_cells.contains(cell_ref.cell_name())
            {
                continue;
            }
            let Some(ref_cell) = self.library.cell(cell_ref.cell_name()) else {
                continue;
            };
            for copy_transform in array_transforms(cell_ref) {
                if !copy_transform.is_finite() || !copy_transform.is_invertible() {
                    continue;
                }
                contexts.push((
                    cell_ref.cell_name().to_string(),
                    [
                        copy_transform.a,
                        copy_transform.b,
                        copy_transform.c,
                        copy_transform.d,
                        copy_transform.tx,
                        copy_transform.ty,
                    ],
                ));
                self.collect_cell_contexts_recursive(
                    ref_cell,
                    &copy_transform,
                    cell.name(),
                    0,
                    max_depth,
                    &mut contexts,
                );
            }
        }
        contexts
    }

    /// Recursively collect bounding boxes from a referenced cell.
    fn collect_bounds_recursive(
        &self,
        cell_name: &str,
        transform: &Transform,
        initial_ancestors: &[&str],
        combined: &mut Option<BBox>,
    ) {
        let Some(root) = self.library.cell(cell_name) else {
            return;
        };
        let merge = |combined: &mut Option<BBox>, bbox: BBox| {
            *combined = Some(match combined.take() {
                Some(existing) => existing.merge(&bbox),
                None => bbox,
            });
        };
        walk_hierarchy_from(
            &self.library,
            root,
            *transform,
            initial_ancestors,
            |event| {
                if let HierarchyEvent::Enter(placement) = event
                    && let Some(image_bounds) = self.cell_image_bounds.get(placement.cell.name())
                {
                    let image = BBox::new(
                        Point::new(image_bounds[0], image_bounds[1]),
                        Point::new(image_bounds[2], image_bounds[3]),
                    )
                    .and_then(|image| image.try_transform(&placement.transform));
                    if let Ok(image) = image {
                        merge(combined, image);
                    }
                }
                let HierarchyEvent::Element(placed) = event else {
                    return WalkControl::Continue;
                };
                let bbox = match placed.element {
                    Element::Polygon { polygon, .. } => polygon
                        .try_transform(&placed.placement.transform)
                        .ok()
                        .map(|polygon| polygon.bbox()),
                    Element::Path(path) => stroke_path_transformed(
                        path.points(),
                        path.width(),
                        path.end_type(),
                        &placed.placement.transform,
                    )
                    .map(|path| path.bbox()),
                    Element::Text(text) => {
                        let transform = placed.placement.transform;
                        let transformed_position = transform.apply(text.position());
                        let scale = transform.a.hypot(transform.c);
                        let transformed_height = text.height() * scale;
                        if !transformed_position.is_finite()
                            || !scale.is_finite()
                            || scale <= 0.0
                            || !text.height().is_finite()
                            || text.height() <= 0.0
                            || !transformed_height.is_finite()
                        {
                            None
                        } else {
                            text_bbox(text.text(), &transformed_position, transformed_height)
                        }
                    }
                    Element::CellRef(_) => None,
                };
                if let Some(bbox) = bbox {
                    merge(combined, bbox);
                }
                WalkControl::Continue
            },
        );
    }

    /// Compute the bounding box for a CellRef instance without caching.
    ///
    /// If the referenced cell has geometry, returns its bounding box transformed
    /// by the CellRef's transform (and all array-copy transforms, if arrayed).
    /// If the cell is empty, returns small placeholder boxes centered at each
    /// transformed cell origin so that empty instances remain visible,
    /// selectable, and labeled.
    ///
    /// Prefer `instance_bbox_cached` at call sites that know the element index —
    /// it memoises the result.
    fn compute_instance_bbox(&self, parent_cell: &str, cell_ref: &CellRef) -> Option<BBox> {
        let mut combined: Option<BBox> = None;
        let origin = self
            .annotations
            .get(cell_ref.cell_name())
            .map(|annotations| annotations.editor.origin)
            .unwrap_or_else(Point::origin);
        let placeholder = |transform: &Transform| {
            const HALF: f64 = 500.0;
            let placed_origin = transform.apply(origin);
            if !placed_origin.is_finite() {
                return None;
            }
            BBox::new(
                Point::new(placed_origin.x - HALF, placed_origin.y - HALF),
                Point::new(placed_origin.x + HALF, placed_origin.y + HALF),
            )
            .ok()
        };
        for copy_transform in array_transforms(cell_ref) {
            let mut copy_bounds = None;
            self.collect_bounds_recursive(
                cell_ref.cell_name(),
                &copy_transform,
                &[parent_cell],
                &mut copy_bounds,
            );
            let Some(bounds) = copy_bounds.or_else(|| placeholder(&copy_transform)) else {
                continue;
            };
            combined = Some(match combined.take() {
                Some(existing) => existing.merge(&bounds),
                None => bounds,
            });
        }
        // Malformed serialized repetitions can contain a zero dimension. Keep
        // the instance selectable at its anchor only when that anchor is finite.
        combined.or_else(|| placeholder(&cell_ref.transform()))
    }

    /// Return the cached bbox for a CellRef in the active cell, computing on miss.
    ///
    /// The cache is keyed by `element_index` within the cell named in
    /// `instance_bbox_cache_cell`. If `cell_name` differs from the cached
    /// cell, the cache is wiped and re-bound to `cell_name`. This keeps the
    /// key a cheap `usize` instead of allocating a String on every lookup.
    fn instance_bbox_cached(
        &self,
        cell_name: &str,
        elem_idx: usize,
        cell_ref: &CellRef,
    ) -> Option<BBox> {
        // Ensure the cache is bound to `cell_name`. If not, reset it.
        {
            let mut cache_cell = self.instance_bbox_cache_cell.borrow_mut();
            if cache_cell.as_deref() != Some(cell_name) {
                self.instance_bbox_cache.borrow_mut().clear();
                *cache_cell = Some(cell_name.to_string());
            }
        }

        if let Some(bbox) = self.instance_bbox_cache.borrow().get(&elem_idx) {
            return *bbox;
        }
        let bbox = self.compute_instance_bbox(cell_name, cell_ref);
        self.instance_bbox_cache.borrow_mut().insert(elem_idx, bbox);
        bbox
    }

    /// Invalidate the entire CellRef bbox cache.
    ///
    /// Called whenever geometry or CellRef transforms/repetitions change.
    fn invalidate_instance_bbox_cache(&mut self) {
        self.instance_bbox_cache.borrow_mut().clear();
        *self.instance_bbox_cache_cell.borrow_mut() = None;
        // The spatial index is derived from the same geometry, so drop it too.
        *self.spatial_index.borrow_mut() = None;
        *self.spatial_index_cell.borrow_mut() = None;
    }

    /// Mark the library as dirty AND invalidate derived caches.
    ///
    /// Prefer this over assigning `self.dirty = true` directly, so caches
    /// (like the instance bbox cache) stay consistent with mutations.
    fn mark_dirty(&mut self) {
        self.dirty = true;
        self.invalidate_instance_bbox_cache();
    }

    /// Recursively collect vertices from a referenced cell (for snap-to-geometry).
    fn collect_vertices_recursive(
        &self,
        cell_name: &str,
        transform: &Transform,
        initial_ancestor: &str,
        result: &mut Vec<f64>,
    ) {
        let Some(root) = self.library.cell(cell_name) else {
            return;
        };
        walk_hierarchy_from(
            &self.library,
            root,
            *transform,
            &[initial_ancestor],
            |event| {
                let HierarchyEvent::Element(placed) = event else {
                    return WalkControl::Continue;
                };
                let polygon = match placed.element {
                    Element::Polygon { polygon, .. } => Some(polygon.clone()),
                    Element::Path(path) => stroke_path_transformed(
                        path.points(),
                        path.width(),
                        path.end_type(),
                        &placed.placement.transform,
                    ),
                    Element::CellRef(_) | Element::Text(_) => None,
                };
                if let Some(polygon) = polygon {
                    let polygon = if matches!(placed.element, Element::Path(_)) {
                        Some(polygon)
                    } else {
                        polygon.try_transform(&placed.placement.transform).ok()
                    };
                    let Some(polygon) = polygon else {
                        return WalkControl::Continue;
                    };
                    result.push(polygon.vertices().len() as f64);
                    for point in polygon.vertices() {
                        result.push(point.x);
                        result.push(point.y);
                    }
                }
                WalkControl::Continue
            },
        );
    }

    /// Resolve a synthetic ref UUID to its transformed polygon and layer.
    ///
    /// Returns None if the UUID is not a valid ref UUID or the referenced data doesn't exist.
    fn resolve_ref_uuid(&self, uuid: &str) -> Option<(Polygon, Layer)> {
        let (cellref_elem_idx, target_poly_idx, _) = self.resolve_ref_uuid_parts(uuid)?;

        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell(cell_name)?;
        let element = cell.elements().get(cellref_elem_idx)?;

        if let Element::CellRef(cell_ref) = element
            && let Some(ref_cell) = self.library.cell(cell_ref.cell_name())
        {
            if self.hidden_cells.contains(cell_ref.cell_name()) {
                return None;
            }
            let mut counter: usize = 0;
            for copy_transform in array_transforms(cell_ref) {
                if let Some(result) = self.find_polygon_recursive(
                    ref_cell,
                    &copy_transform,
                    cell.name(),
                    self.hierarchy_depth_limit,
                    target_poly_idx,
                    &mut counter,
                ) {
                    return Some(result);
                }
            }
        }
        None
    }

    /// Recursively find the Nth polygon in a cell hierarchy.
    fn find_polygon_recursive(
        &self,
        cell: &Cell,
        transform: &Transform,
        initial_ancestor: &str,
        max_depth: u32,
        target_idx: usize,
        counter: &mut usize,
    ) -> Option<(Polygon, Layer)> {
        let mut found = None;
        walk_hierarchy_from(
            &self.library,
            cell,
            *transform,
            &[initial_ancestor],
            |event| {
                if let HierarchyEvent::Enter(placement) = event
                    && placement.depth > 0
                    && ((max_depth > 0 && placement.depth as u32 >= max_depth)
                        || self.hidden_cells.contains(placement.cell.name()))
                {
                    return WalkControl::SkipSubtree;
                }
                let HierarchyEvent::Element(placed) = event else {
                    return WalkControl::Continue;
                };
                let polygon = match placed.element {
                    Element::Polygon { polygon, layer } => Some((polygon.clone(), *layer)),
                    Element::Path(path) => stroke_path_transformed(
                        path.points(),
                        path.width(),
                        path.end_type(),
                        &placed.placement.transform,
                    )
                    .map(|polygon| (polygon, path.layer())),
                    Element::CellRef(_) | Element::Text(_) => return WalkControl::Continue,
                };
                if *counter == target_idx
                    && let Some((polygon, layer)) = polygon
                {
                    found = if matches!(placed.element, Element::Path(_)) {
                        Some((polygon, layer))
                    } else {
                        polygon
                            .try_transform(&placed.placement.transform)
                            .ok()
                            .map(|polygon| (polygon, layer))
                    };
                    return WalkControl::Break;
                }
                *counter += 1;
                WalkControl::Continue
            },
        );
        found
    }

    /// Recursively collect preview polygon data for drag-and-drop visualization.
    fn collect_preview_polygons(
        &self,
        cell: &Cell,
        transform: &Transform,
        default_color: &[f32; 4],
        result: &js_sys::Array,
    ) {
        walk_hierarchy(&self.library, cell, *transform, |event| {
            let HierarchyEvent::Element(placed) = event else {
                return WalkControl::Continue;
            };
            let (polygon, layer) = match placed.element {
                Element::Polygon { polygon, layer } => (polygon.clone(), *layer),
                Element::Path(path) => {
                    let Some(polygon) = stroke_path_transformed(
                        path.points(),
                        path.width(),
                        path.end_type(),
                        &placed.placement.transform,
                    ) else {
                        return WalkControl::Continue;
                    };
                    (polygon, path.layer())
                }
                Element::CellRef(_) | Element::Text(_) => return WalkControl::Continue,
            };
            let transformed = if matches!(placed.element, Element::Path(_)) {
                Some(polygon)
            } else {
                polygon.try_transform(&placed.placement.transform).ok()
            };
            let Some(transformed) = transformed else {
                return WalkControl::Continue;
            };
            let vertices: Vec<f64> = transformed
                .vertices()
                .iter()
                .flat_map(|point| [point.x, point.y])
                .collect();
            if vertices.len() >= 6 {
                let key = layer_key(layer.number, layer.datatype);
                let color = self
                    .layer_colors
                    .get(&key)
                    .copied()
                    .unwrap_or(*default_color);
                let preview_color = [color[0], color[1], color[2], 0.4];
                let object = js_sys::Object::new();
                let vertices_array = js_sys::Float64Array::from(&vertices[..]);
                js_sys::Reflect::set(&object, &JsValue::from_str("vertices"), &vertices_array).ok();
                let color_array = js_sys::Array::new();
                for &component in &preview_color {
                    color_array.push(&JsValue::from_f64(component as f64));
                }
                js_sys::Reflect::set(&object, &JsValue::from_str("color"), &color_array).ok();
                result.push(&object);
            }
            WalkControl::Continue
        });
    }

    /// Check if a cell transitively references another cell.
    ///
    /// Returns true if `cell_name` references `target` directly or through
    /// any chain of CellRef elements. Used for circular reference detection.
    fn cell_references_recursive(
        &self,
        cell_name: &str,
        target: &str,
        visited: &mut Vec<String>,
    ) -> bool {
        if visited.contains(&cell_name.to_string()) {
            return false; // Already visited, avoid infinite loops
        }
        visited.push(cell_name.to_string());

        if let Some(cell) = self.library.cell(cell_name) {
            for cell_ref in cell.cell_refs() {
                if cell_ref.cell_name() == target {
                    return true;
                }
                if self.cell_references_recursive(cell_ref.cell_name(), target, visited) {
                    return true;
                }
            }
        }
        false
    }

    fn cell_tree_nodes(&self) -> Vec<CellTreeNode> {
        let mut covered = HashSet::new();
        let mut roots = Vec::new();

        for cell in self.library.roots() {
            roots.push(self.build_cell_tree_node(cell.name(), &mut HashSet::new(), &mut covered));
        }

        // Closed cycles have no graph roots. Add one deterministic entry per
        // still-uncovered component, preserving the library's cell order.
        for cell in self.library.cells() {
            if !covered.contains(cell.name()) {
                roots.push(self.build_cell_tree_node(
                    cell.name(),
                    &mut HashSet::new(),
                    &mut covered,
                ));
            }
        }

        roots
    }

    /// Build one hierarchy node. References to missing cells are omitted
    /// because Explorer nodes are selectable and require a real target cell.
    fn build_cell_tree_node(
        &self,
        cell_name: &str,
        ancestors: &mut HashSet<String>,
        covered: &mut HashSet<String>,
    ) -> CellTreeNode {
        covered.insert(cell_name.to_string());
        ancestors.insert(cell_name.to_string());

        let mut seen_children = HashSet::new();
        let mut child_names = Vec::new();
        if let Some(cell) = self.library.cell(cell_name) {
            for cell_ref in cell.cell_refs() {
                if self.library.contains(cell_ref.cell_name())
                    && seen_children.insert(cell_ref.cell_name().to_string())
                    && !ancestors.contains(cell_ref.cell_name())
                {
                    child_names.push(cell_ref.cell_name().to_string());
                }
            }
        }
        let children = child_names
            .iter()
            .map(|child_name| self.build_cell_tree_node(child_name, ancestors, covered))
            .collect();

        ancestors.remove(cell_name);
        CellTreeNode {
            name: cell_name.to_string(),
            children,
        }
    }

    /// Recursively flatten a cell and all its references into polygons.
    fn flatten_cell_recursive(
        &self,
        cell: &Cell,
        library: &Library,
        transform: &Transform,
        initial_ancestors: &[&str],
        absolute_width_scale: f64,
        result: &mut Vec<(Polygon, Layer)>,
    ) {
        walk_hierarchy_from(library, cell, *transform, initial_ancestors, |event| {
            let HierarchyEvent::Element(placed) = event else {
                return WalkControl::Continue;
            };
            let (polygon, layer) = match placed.element {
                Element::Polygon { polygon, layer } => (polygon.clone(), *layer),
                Element::Path(path) => {
                    let Some(polygon) = stroke_path_transformed_with_scale(
                        path.points(),
                        path.width(),
                        path.end_type(),
                        &placed.placement.transform,
                        absolute_width_scale,
                    ) else {
                        return WalkControl::Continue;
                    };
                    (polygon, path.layer())
                }
                Element::CellRef(_) | Element::Text(_) => return WalkControl::Continue,
            };
            let transformed = if matches!(placed.element, Element::Path(_)) {
                Some(polygon)
            } else {
                polygon.try_transform(&placed.placement.transform).ok()
            };
            let Some(transformed) = transformed else {
                return WalkControl::Continue;
            };
            result.push((transformed, layer));
            WalkControl::Continue
        });
    }

    /// Get all polygons for rendering (internal).
    ///
    /// Returns a vector of (uuid, vertices, color) for each polygon.
    /// The UUID allows selection to work correctly.
    /// CellRef elements are resolved on-the-fly with synthetic UUIDs,
    /// so changes to referenced cells are always reflected.
    pub(crate) fn get_render_polygons_internal(&self) -> Vec<RenderPolygon> {
        let default_color = [0.5, 0.5, 0.5, 0.7];

        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };

        // Pre-allocate result with estimated capacity (Opt 6).
        // Each element could produce ~1 polygon, CellRefs may produce more.
        let mut result = Vec::with_capacity(cell.elements().len());

        // Build a reverse lookup: element_index → UUID for direct polygons.
        // The element_refs HashMap has arbitrary iteration order, but we need
        // to emit render polygons in element order (matching flatten_cell_recursive)
        // so that buildSourceMap's index-based correlation works correctly.
        let mut index_to_uuid: std::collections::HashMap<usize, String> =
            std::collections::HashMap::new();
        for (uuid, elem_ref) in &self.element_refs {
            if elem_ref.cell_name == *cell_name {
                index_to_uuid.insert(elem_ref.element_index, uuid.clone());
            }
        }

        // Iterate elements in order — matching flatten_cell_recursive which
        // processes Polygons and CellRefs in element order. This ensures render
        // polygon index i corresponds to source_map index i.
        let max_depth = self.hierarchy_depth_limit;
        for (elem_idx, element) in cell.elements().iter().enumerate() {
            match element {
                Element::Polygon { polygon, layer } => {
                    if let Some(uuid) = index_to_uuid.get(&elem_idx) {
                        let key = layer_key(layer.number, layer.datatype);
                        let color = self
                            .layer_colors
                            .get(&key)
                            .copied()
                            .unwrap_or(default_color);
                        let fill_pattern = self.layer_fill_patterns.get(&key).copied().unwrap_or(0);
                        let vertices: Vec<[f64; 2]> =
                            polygon.vertices().iter().map(|p| [p.x, p.y]).collect();
                        result.push((uuid.clone(), vertices, color, fill_pattern));
                    }
                }
                Element::CellRef(cell_ref) => {
                    if let Some(ref_cell) = self.library.cell(cell_ref.cell_name())
                        && let Some(cellref_uuid) = index_to_uuid.get(&elem_idx)
                    {
                        // Skip internal geometry for hidden cells
                        if self.hidden_cells.contains(cell_ref.cell_name()) {
                            continue;
                        }
                        let mut poly_counter: usize = 0;
                        for copy_transform in array_transforms(cell_ref) {
                            self.collect_render_polygons_recursive(
                                ref_cell,
                                &copy_transform,
                                cell.name(),
                                elem_idx,
                                cellref_uuid,
                                &mut poly_counter,
                                &default_color,
                                0,
                                max_depth,
                                &mut result,
                            );
                        }
                    }
                }
                Element::Path(path) => {
                    // Render path as polygon ribbon.
                    // In init_from_library mode paths remain as Element::Path.
                    if let Some(uuid) = index_to_uuid.get(&elem_idx)
                        && let Some(ribbon) =
                            stroke_path(path.points(), path.width(), path.end_type())
                    {
                        let layer = path.layer();
                        let key = layer_key(layer.number, layer.datatype);
                        let color = self
                            .layer_colors
                            .get(&key)
                            .copied()
                            .unwrap_or(default_color);
                        let fill_pattern = self.layer_fill_patterns.get(&key).copied().unwrap_or(0);
                        let vertices: Vec<[f64; 2]> =
                            ribbon.vertices().iter().map(|p| [p.x, p.y]).collect();
                        result.push((uuid.clone(), vertices, color, fill_pattern));
                    }
                }
                // Text elements don't produce rendered polygons
                _ => {}
            }
        }

        // Sort by area descending so large shapes draw first and small shapes
        // render on top. This ensures features like waveguides and vias are never
        // hidden behind substrate or cladding polygons.
        result.sort_by(|a, b| {
            let area_a = polygon_area(&a.1);
            let area_b = polygon_area(&b.1);
            area_b
                .partial_cmp(&area_a)
                .unwrap_or(std::cmp::Ordering::Equal)
        });

        result
    }

    /// Get the underlying library reference.
    pub fn library(&self) -> &Library {
        &self.library
    }

    /// Get bounding boxes for all CellRef instances in the active cell.
    ///
    /// Returns `(canonical_id, [minX, minY, maxX, maxY])` for each instance.
    /// Used by the renderer to generate outline segments on selection/hover.
    #[allow(dead_code)]
    pub(crate) fn get_instance_bboxes(&self) -> Vec<(String, [f64; 4])> {
        let mut result = Vec::new();

        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return result,
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return result,
        };

        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::CellRef(cell_ref) = element {
                let Some(token) = self.element_uuid_at(cell_name, elem_idx) else {
                    continue;
                };
                let Some(bbox) = self.instance_bbox_cached(cell_name, elem_idx, cell_ref) else {
                    continue;
                };
                result.push((
                    Self::format_ref_uuid(elem_idx, 0, token),
                    [bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y],
                ));
            }
        }

        result
    }

    /// Collect label data for all CellRef instances in the active cell.
    ///
    /// Returns `(canonical_id, element_index, cell_name, bbox, repetition)`
    /// where repetition is `Some((columns, rows))` for AREFs, `None` for SREFs.
    #[allow(clippy::type_complexity)]
    pub(crate) fn get_instance_labels(
        &self,
    ) -> Vec<(String, usize, String, [f64; 4], Option<(u16, u16)>)> {
        let mut labels = Vec::new();

        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return labels,
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return labels,
        };

        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::CellRef(cell_ref) = element {
                let Some(token) = self.element_uuid_at(cell_name, elem_idx) else {
                    continue;
                };
                let Some(bbox) = self.instance_bbox_cached(cell_name, elem_idx, cell_ref) else {
                    continue;
                };
                let rep = cell_ref.repetition().and_then(|r| {
                    if r.is_single() {
                        None
                    } else {
                        Some((r.columns(), r.rows()))
                    }
                });
                labels.push((
                    Self::format_ref_uuid(elem_idx, 0, token),
                    elem_idx,
                    cell_ref.cell_name().to_string(),
                    [bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y],
                    rep,
                ));
            }
        }

        labels
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extreme_text_bounds_are_omitted_before_reaching_bbox_outputs() {
        assert!(text_bbox("label", &Point::new(f64::MAX, 0.0), f64::MAX / 2.0).is_none());

        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_text("label", 1.0, 0.0, f64::MAX, 1, 0).unwrap();
        library.add_cell("top").unwrap();
        assert!(library.set_active_cell("top"));
        library
            .add_cell_ref_with_transform("child", vec![2.0, 0.0, 0.0, 1.0, 0.0, 0.0])
            .unwrap();

        let mut bounds = None;
        library.collect_bounds_recursive(
            "child",
            &Transform::scale(2.0, 1.0),
            &["top"],
            &mut bounds,
        );
        assert!(bounds.is_none());
        assert!(library.get_cell_bounds("top").is_none());
        assert!(library.get_all_bounds().is_none());
    }
}
