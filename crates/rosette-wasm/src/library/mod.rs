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
use rosette_core::geometry::{BBox, offset_polygon};
use rosette_core::{Cell, CellRef, Layer, Library, Point, Polygon, Transform};
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use wasm_bindgen::prelude::*;

/// A rendered polygon: (uuid, vertices, color, fill_pattern).
/// fill_pattern: 0=solid, 1=hatched, 2=crosshatched, 3=dotted, 4=horizontal, 5=vertical, 6=zigzag, 7=brick.
type RenderPolygon = (String, Vec<[f64; 2]>, [f32; 4], u32);

/// Iterate over all array copy transforms for a CellRef.
///
/// For a non-arrayed CellRef, yields a single transform (the base).
/// For an arrayed CellRef, yields `rows * cols` transforms with offsets
/// applied in the CellRef's local (pre-transform) space, matching GDS
/// writer semantics. The per-copy translation is applied BEFORE the
/// CellRef transform, so rotated/mirrored/scaled AREFs place copies along
/// the transformed lattice vectors.
///
/// The offset for copy (col, row) is:
///   `let v = rep.copy_offset(col, row); base.then(&Transform::translate(v.x, v.y))`
fn array_transforms(cell_ref: &CellRef) -> Vec<Transform> {
    match &cell_ref.repetition {
        None => vec![cell_ref.transform],
        Some(rep) if rep.is_single() => vec![cell_ref.transform],
        Some(rep) => {
            let mut transforms = Vec::with_capacity(rep.count());
            for row in 0..rep.rows {
                for col in 0..rep.columns {
                    let v = rep.copy_offset(col, row);
                    let offset = cell_ref.transform.then(&Transform::translate(v.x, v.y));
                    transforms.push(offset);
                }
            }
            transforms
        }
    }
}

/// Element identifier mapping UUID to cell name and element index.
#[derive(Debug, Clone)]
struct ElementRef {
    cell_name: String,
    element_index: usize,
}

/// Prefix for synthetic UUIDs generated for CellRef-resolved polygons.
/// Format: "ref:{cellref_element_index}:{polygon_index_within_ref}"
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
    instance_bbox_cache: RefCell<HashMap<usize, BBox>>,
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
fn text_bbox(text: &str, position: &Point, height: f64) -> BBox {
    let em_size = height / TEXT_CAP_HEIGHT_RATIO;
    let lines: Vec<&str> = text.split('\n').collect();
    let max_chars = lines.iter().map(|l| l.len()).max().unwrap_or(1).max(1);
    let width = em_size * 0.6 * max_chars as f64;
    let total_height = em_size * 1.2 * lines.len() as f64;
    BBox::new(
        Point::new(position.x, position.y - total_height),
        Point::new(position.x + width, position.y),
    )
}

/// Parse a synthetic ref UUID and return (cellref_element_index, polygon_index).
/// Format: "ref:{elem_idx}:{poly_idx}"
fn parse_ref_uuid(uuid: &str) -> Option<(usize, usize)> {
    let rest = uuid.strip_prefix(REF_UUID_PREFIX)?;
    let mut parts = rest.split(':');
    let elem_idx: usize = parts.next()?.parse().ok()?;
    let poly_idx: usize = parts.next()?.parse().ok()?;
    Some((elem_idx, poly_idx))
}

/// Parse a synthetic ref UUID and return just the CellRef element index.
fn parse_ref_uuid_element_index(uuid: &str) -> Option<usize> {
    let rest = uuid.strip_prefix(REF_UUID_PREFIX)?;
    let mut parts = rest.split(':');
    parts.next()?.parse().ok()
}

// Non-wasm_bindgen methods for internal use
impl WasmLibrary {
    // =========================================================================
    // CellRef resolution helpers (on-the-fly, no persistent flattening)
    // =========================================================================

    /// Recursively collect render polygons from a cell for on-the-fly CellRef resolution.
    ///
    /// Generates synthetic UUIDs in the format "ref:{cellref_element_index}:{poly_counter}"
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
        cellref_elem_idx: usize,
        poly_counter: &mut usize,
        default_color: &[f32; 4],
        current_depth: u32,
        max_depth: u32,
        result: &mut Vec<RenderPolygon>,
    ) {
        for element in cell.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    let transformed = polygon.transform(transform);
                    let key = layer_key(layer.number, layer.datatype);
                    let color = self
                        .layer_colors
                        .get(&key)
                        .copied()
                        .unwrap_or(*default_color);

                    if color[3] <= 0.0 {
                        *poly_counter += 1;
                        continue;
                    }

                    let fill_pattern = self.layer_fill_patterns.get(&key).copied().unwrap_or(0);
                    let vertices: Vec<[f64; 2]> =
                        transformed.vertices().iter().map(|p| [p.x, p.y]).collect();

                    let uuid = format!("{REF_UUID_PREFIX}{cellref_elem_idx}:{poly_counter}");
                    *poly_counter += 1;
                    result.push((uuid, vertices, color, fill_pattern));
                }
                Element::Path {
                    points,
                    width,
                    layer,
                    ..
                } => {
                    let transformed_points: Vec<Point> =
                        points.iter().map(|p| transform.apply(*p)).collect();
                    let scale = (transform.a.powi(2) + transform.c.powi(2)).sqrt();
                    let scaled_width = *width * scale;
                    if let Some(ribbon) = offset_polygon(&transformed_points, scaled_width) {
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
                            let uuid =
                                format!("{REF_UUID_PREFIX}{cellref_elem_idx}:{poly_counter}");
                            result.push((uuid, vertices, color, fill_pattern));
                        }
                    }
                    *poly_counter += 1;
                }
                Element::CellRef(nested_ref) => {
                    // Skip recursion if the next level would exceed the depth limit
                    if max_depth > 0 && current_depth + 1 >= max_depth {
                        continue;
                    }
                    // Skip internal geometry for hidden cells
                    if self.hidden_cells.contains(&nested_ref.cell_name) {
                        continue;
                    }
                    if let Some(ref_cell) = self.library.cell(&nested_ref.cell_name) {
                        for copy_transform in array_transforms(nested_ref) {
                            let combined = transform.then(&copy_transform);
                            self.collect_render_polygons_recursive(
                                ref_cell,
                                &combined,
                                cellref_elem_idx,
                                poly_counter,
                                default_color,
                                current_depth + 1,
                                max_depth,
                                result,
                            );
                        }
                    }
                }
                Element::Text { .. } => {}
            }
        }
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
        let is_rigid = transform.is_rigid();
        let det_abs = if is_rigid {
            1.0
        } else {
            transform.determinant().abs()
        };

        for element in cell.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    let area = polygon.area() * det_abs;
                    *area_map
                        .entry((layer.number, layer.datatype))
                        .or_insert(0.0) += area;
                }
                Element::Path {
                    points,
                    width,
                    layer,
                    ..
                } => {
                    // Convert path to polygon ribbon, applying transform for width scaling.
                    let transformed_points: Vec<Point> =
                        points.iter().map(|p| transform.apply(*p)).collect();
                    let scale = (transform.a.powi(2) + transform.c.powi(2)).sqrt();
                    let scaled_width = *width * scale;
                    if let Some(ribbon) = offset_polygon(&transformed_points, scaled_width) {
                        let area = ribbon.area();
                        *area_map
                            .entry((layer.number, layer.datatype))
                            .or_insert(0.0) += area;
                    }
                }
                Element::CellRef(cell_ref) => {
                    if max_depth > 0 && current_depth + 1 >= max_depth {
                        continue;
                    }
                    if self.hidden_cells.contains(&cell_ref.cell_name) {
                        continue;
                    }
                    if let Some(ref_cell) = self.library.cell(&cell_ref.cell_name) {
                        for copy_transform in array_transforms(cell_ref) {
                            let combined = transform.then(&copy_transform);
                            self.collect_area_recursive(
                                ref_cell,
                                &combined,
                                current_depth + 1,
                                max_depth,
                                area_map,
                            );
                        }
                    }
                }
                Element::Text { .. } => {}
            }
        }
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
        current_depth: u32,
        max_depth: u32,
        result: &mut Vec<(String, [f64; 6])>,
    ) {
        for element in cell.elements() {
            if let Element::CellRef(nested_ref) = element {
                if max_depth > 0 && current_depth + 1 >= max_depth {
                    continue;
                }
                if self.hidden_cells.contains(&nested_ref.cell_name) {
                    continue;
                }
                if let Some(ref_cell) = self.library.cell(&nested_ref.cell_name) {
                    for copy_transform in array_transforms(nested_ref) {
                        let combined = transform.then(&copy_transform);
                        let t = [
                            combined.a,
                            combined.b,
                            combined.c,
                            combined.d,
                            combined.tx,
                            combined.ty,
                        ];
                        result.push((nested_ref.cell_name.clone(), t));
                        self.collect_cell_contexts_recursive(
                            ref_cell,
                            &combined,
                            current_depth + 1,
                            max_depth,
                            result,
                        );
                    }
                }
            }
        }
    }

    /// Recursively collect bounding boxes from a referenced cell.
    fn collect_bounds_recursive(
        &self,
        cell_name: &str,
        transform: &Transform,
        combined: &mut Option<BBox>,
    ) {
        // Include image overlay bounds (set from JS) for this cell
        if let Some(img_bounds) = self.cell_image_bounds.get(cell_name) {
            // Transform the four corners of the image bounds rectangle
            let corners = [
                Point::new(img_bounds[0], img_bounds[1]),
                Point::new(img_bounds[2], img_bounds[1]),
                Point::new(img_bounds[2], img_bounds[3]),
                Point::new(img_bounds[0], img_bounds[3]),
            ];
            for corner in &corners {
                let tp = transform.apply(*corner);
                let point_bbox = BBox::new(tp, tp);
                *combined = Some(match combined {
                    Some(existing) => existing.merge(&point_bbox),
                    None => point_bbox,
                });
            }
        }

        if let Some(cell) = self.library.cell(cell_name) {
            for element in cell.elements() {
                match element {
                    Element::Polygon { polygon, .. } => {
                        let transformed = polygon.transform(transform);
                        let bbox = transformed.bbox();
                        *combined = Some(match combined {
                            Some(existing) => existing.merge(&bbox),
                            None => bbox,
                        });
                    }
                    Element::Path { points, width, .. } => {
                        let transformed_points: Vec<Point> =
                            points.iter().map(|p| transform.apply(*p)).collect();
                        let scale = (transform.a.powi(2) + transform.c.powi(2)).sqrt();
                        let scaled_width = *width * scale;
                        if let Some(ribbon) = offset_polygon(&transformed_points, scaled_width) {
                            let bbox = ribbon.bbox();
                            *combined = Some(match combined {
                                Some(existing) => existing.merge(&bbox),
                                None => bbox,
                            });
                        }
                    }
                    Element::Text {
                        text,
                        position,
                        height,
                        ..
                    } => {
                        let transformed_pos = transform.apply(*position);
                        let scale = (transform.a.powi(2) + transform.c.powi(2)).sqrt();
                        let scaled_height = *height * scale;
                        let bbox = text_bbox(text, &transformed_pos, scaled_height);
                        *combined = Some(match combined {
                            Some(existing) => existing.merge(&bbox),
                            None => bbox,
                        });
                    }
                    Element::CellRef(nested_ref) => {
                        for copy_transform in array_transforms(nested_ref) {
                            let nested_transform = transform.then(&copy_transform);
                            self.collect_bounds_recursive(
                                &nested_ref.cell_name,
                                &nested_transform,
                                combined,
                            );
                        }
                    }
                }
            }
        }
    }

    /// Compute the bounding box for a CellRef instance without caching.
    ///
    /// If the referenced cell has geometry, returns its bounding box transformed
    /// by the CellRef's transform (and all array-copy transforms, if arrayed).
    /// If the cell is empty, returns a small placeholder box centered at the
    /// CellRef's translation point so that empty instances remain visible,
    /// selectable, and labeled.
    ///
    /// Prefer `instance_bbox_cached` at call sites that know the element index —
    /// it memoises the result.
    fn compute_instance_bbox(&self, cell_ref: &CellRef) -> BBox {
        let mut combined: Option<BBox> = None;
        for copy_transform in array_transforms(cell_ref) {
            self.collect_bounds_recursive(&cell_ref.cell_name, &copy_transform, &mut combined);
        }
        combined.unwrap_or_else(|| {
            // Empty cell: use a small placeholder centered at the placement point.
            // 500 world units half-size → 10 nm → 20 nm × 20 nm placeholder.
            const HALF: f64 = 500.0;
            let (tx, ty) = cell_ref.transform.translation();
            BBox::new(
                Point::new(tx - HALF, ty - HALF),
                Point::new(tx + HALF, ty + HALF),
            )
        })
    }

    /// Return the cached bbox for a CellRef in the active cell, computing on miss.
    ///
    /// The cache is keyed by `element_index` within the cell named in
    /// `instance_bbox_cache_cell`. If `cell_name` differs from the cached
    /// cell, the cache is wiped and re-bound to `cell_name`. This keeps the
    /// key a cheap `usize` instead of allocating a String on every lookup.
    fn instance_bbox_cached(&self, cell_name: &str, elem_idx: usize, cell_ref: &CellRef) -> BBox {
        // Ensure the cache is bound to `cell_name`. If not, reset it.
        {
            let mut cache_cell = self.instance_bbox_cache_cell.borrow_mut();
            if cache_cell.as_deref() != Some(cell_name) {
                self.instance_bbox_cache.borrow_mut().clear();
                *cache_cell = Some(cell_name.to_string());
            }
        }

        if let Some(bbox) = self.instance_bbox_cache.borrow().get(&elem_idx).copied() {
            return bbox;
        }
        let bbox = self.compute_instance_bbox(cell_ref);
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
        result: &mut Vec<f64>,
    ) {
        if let Some(cell) = self.library.cell(cell_name) {
            for element in cell.elements() {
                match element {
                    Element::Polygon { polygon, .. } => {
                        let transformed = polygon.transform(transform);
                        let verts = transformed.vertices();
                        result.push(verts.len() as f64);
                        for point in verts {
                            result.push(point.x);
                            result.push(point.y);
                        }
                    }
                    Element::CellRef(cell_ref) => {
                        for copy_transform in array_transforms(cell_ref) {
                            let nested = transform.then(&copy_transform);
                            self.collect_vertices_recursive(&cell_ref.cell_name, &nested, result);
                        }
                    }
                    _ => {}
                }
            }
        }
    }

    /// Resolve a synthetic ref UUID to its transformed polygon and layer.
    ///
    /// Returns None if the UUID is not a valid ref UUID or the referenced data doesn't exist.
    fn resolve_ref_uuid(&self, uuid: &str) -> Option<(Polygon, Layer)> {
        let (cellref_elem_idx, target_poly_idx) = parse_ref_uuid(uuid)?;

        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell(cell_name)?;
        let element = cell.elements().get(cellref_elem_idx)?;

        if let Element::CellRef(cell_ref) = element
            && let Some(ref_cell) = self.library.cell(&cell_ref.cell_name)
        {
            let mut counter: usize = 0;
            for copy_transform in array_transforms(cell_ref) {
                if let Some(result) = self.find_polygon_recursive(
                    ref_cell,
                    &copy_transform,
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
        target_idx: usize,
        counter: &mut usize,
    ) -> Option<(Polygon, Layer)> {
        for element in cell.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    if *counter == target_idx {
                        return Some((polygon.transform(transform), *layer));
                    }
                    *counter += 1;
                }
                Element::Path {
                    points,
                    width,
                    layer,
                    ..
                } => {
                    if *counter == target_idx {
                        let transformed_points: Vec<Point> =
                            points.iter().map(|p| transform.apply(*p)).collect();
                        let scale = (transform.a.powi(2) + transform.c.powi(2)).sqrt();
                        let scaled_width = *width * scale;
                        if let Some(ribbon) = offset_polygon(&transformed_points, scaled_width) {
                            return Some((ribbon, *layer));
                        }
                    }
                    *counter += 1;
                }
                Element::CellRef(nested_ref) => {
                    if let Some(ref_cell) = self.library.cell(&nested_ref.cell_name) {
                        for copy_transform in array_transforms(nested_ref) {
                            let combined = transform.then(&copy_transform);
                            if let Some(result) = self
                                .find_polygon_recursive(ref_cell, &combined, target_idx, counter)
                            {
                                return Some(result);
                            }
                        }
                    }
                }
                Element::Text { .. } => {}
            }
        }
        None
    }

    /// Recursively collect preview polygon data for drag-and-drop visualization.
    fn collect_preview_polygons(
        &self,
        cell: &Cell,
        transform: &Transform,
        default_color: &[f32; 4],
        result: &js_sys::Array,
    ) {
        for element in cell.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    let transformed = polygon.transform(transform);
                    let vertices: Vec<f64> = transformed
                        .vertices()
                        .iter()
                        .flat_map(|p| vec![p.x, p.y])
                        .collect();

                    if vertices.len() >= 6 {
                        let key = layer_key(layer.number, layer.datatype);
                        let color = self
                            .layer_colors
                            .get(&key)
                            .copied()
                            .unwrap_or(*default_color);
                        // Use 40% opacity for preview
                        let preview_color = [color[0], color[1], color[2], 0.4];

                        let obj = js_sys::Object::new();
                        let verts_array = js_sys::Float64Array::from(&vertices[..]);
                        js_sys::Reflect::set(&obj, &JsValue::from_str("vertices"), &verts_array)
                            .ok();

                        let color_array = js_sys::Array::new();
                        for &c in &preview_color {
                            color_array.push(&JsValue::from_f64(c as f64));
                        }
                        js_sys::Reflect::set(&obj, &JsValue::from_str("color"), &color_array).ok();

                        result.push(&obj);
                    }
                }
                Element::Path {
                    points,
                    width,
                    layer,
                    ..
                } => {
                    let transformed_points: Vec<Point> =
                        points.iter().map(|p| transform.apply(*p)).collect();
                    let scale = (transform.a.powi(2) + transform.c.powi(2)).sqrt();
                    let scaled_width = *width * scale;
                    if let Some(ribbon) = offset_polygon(&transformed_points, scaled_width) {
                        let vertices: Vec<f64> = ribbon
                            .vertices()
                            .iter()
                            .flat_map(|p| vec![p.x, p.y])
                            .collect();

                        if vertices.len() >= 6 {
                            let key = layer_key(layer.number, layer.datatype);
                            let color = self
                                .layer_colors
                                .get(&key)
                                .copied()
                                .unwrap_or(*default_color);
                            let preview_color = [color[0], color[1], color[2], 0.4];

                            let obj = js_sys::Object::new();
                            let verts_array = js_sys::Float64Array::from(&vertices[..]);
                            js_sys::Reflect::set(
                                &obj,
                                &JsValue::from_str("vertices"),
                                &verts_array,
                            )
                            .ok();

                            let color_array = js_sys::Array::new();
                            for &c in &preview_color {
                                color_array.push(&JsValue::from_f64(c as f64));
                            }
                            js_sys::Reflect::set(&obj, &JsValue::from_str("color"), &color_array)
                                .ok();

                            result.push(&obj);
                        }
                    }
                }
                Element::CellRef(cell_ref) => {
                    if let Some(ref_cell) = self.library.cell(&cell_ref.cell_name) {
                        for copy_transform in array_transforms(cell_ref) {
                            let combined = transform.then(&copy_transform);
                            self.collect_preview_polygons(
                                ref_cell,
                                &combined,
                                default_color,
                                result,
                            );
                        }
                    }
                }
                Element::Text { .. } => {}
            }
        }
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
                if cell_ref.cell_name == target {
                    return true;
                }
                if self.cell_references_recursive(&cell_ref.cell_name, target, visited) {
                    return true;
                }
            }
        }
        false
    }

    /// Build a JS object `{ name, children }` for a single cell node.
    ///
    /// `visited` prevents infinite recursion from circular references.
    /// Children are the unique cell names referenced by `CellRef` elements,
    /// preserving the order of first appearance. Cells not in the library
    /// are also included as leaf nodes (their geometry may be missing, but
    /// they should still appear in the tree).
    fn build_cell_tree_node(&self, cell_name: &str, visited: &mut Vec<String>) -> JsValue {
        let obj = js_sys::Object::new();
        let _ = js_sys::Reflect::set(&obj, &"name".into(), &JsValue::from_str(cell_name));

        let children_arr = js_sys::Array::new();

        if !visited.contains(&cell_name.to_string()) {
            visited.push(cell_name.to_string());

            if let Some(cell) = self.library.cell(cell_name) {
                // Collect unique child cell names in order of first appearance
                let mut seen_children = Vec::new();
                for cell_ref in cell.cell_refs() {
                    if !seen_children.contains(&cell_ref.cell_name) {
                        seen_children.push(cell_ref.cell_name.clone());
                    }
                }
                for child_name in &seen_children {
                    let child_node = self.build_cell_tree_node(child_name, visited);
                    children_arr.push(&child_node);
                }
            }
        }

        let _ = js_sys::Reflect::set(&obj, &"children".into(), &children_arr);
        obj.into()
    }

    /// Recursively flatten a cell and all its references into polygons.
    fn flatten_cell_recursive(&mut self, cell: &Cell, library: &Library, transform: &Transform) {
        for element in cell.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    // Transform the polygon and add it
                    let transformed = polygon.transform(transform);
                    let vertices: Vec<f64> = transformed
                        .vertices()
                        .iter()
                        .flat_map(|p| vec![p.x, p.y])
                        .collect();

                    if vertices.len() >= 6 {
                        self.add_polygon(&vertices, layer.number, layer.datatype);
                    }
                }
                Element::Path {
                    points,
                    width,
                    layer,
                    ..
                } => {
                    // Convert path to polygon using offset_polygon
                    let transformed_points: Vec<Point> =
                        points.iter().map(|p| transform.apply(*p)).collect();

                    // Scale width by the transform's scale factor
                    let scale = (transform.a.powi(2) + transform.c.powi(2)).sqrt();
                    let scaled_width = *width * scale;

                    if let Some(ribbon) = offset_polygon(&transformed_points, scaled_width) {
                        let vertices: Vec<f64> = ribbon
                            .vertices()
                            .iter()
                            .flat_map(|p| vec![p.x, p.y])
                            .collect();

                        if vertices.len() >= 6 {
                            self.add_polygon(&vertices, layer.number, layer.datatype);
                        }
                    }
                }
                Element::CellRef(cell_ref) => {
                    // Find the referenced cell and recurse with combined transform
                    if let Some(ref_cell) = library.cell(&cell_ref.cell_name) {
                        for copy_transform in array_transforms(cell_ref) {
                            let combined = transform.then(&copy_transform);
                            self.flatten_cell_recursive(ref_cell, library, &combined);
                        }
                    }
                }
                Element::Text { .. } => {
                    // Skip text elements for now
                }
            }
        }
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
                    if let Some(ref_cell) = self.library.cell(&cell_ref.cell_name) {
                        // Skip internal geometry for hidden cells
                        if self.hidden_cells.contains(&cell_ref.cell_name) {
                            continue;
                        }
                        let mut poly_counter: usize = 0;
                        for copy_transform in array_transforms(cell_ref) {
                            self.collect_render_polygons_recursive(
                                ref_cell,
                                &copy_transform,
                                elem_idx,
                                &mut poly_counter,
                                &default_color,
                                0,
                                max_depth,
                                &mut result,
                            );
                        }
                    }
                }
                Element::Path {
                    points,
                    width,
                    layer,
                    ..
                } => {
                    // Render path as polygon ribbon.
                    // In init_from_library mode paths remain as Element::Path.
                    if let Some(uuid) = index_to_uuid.get(&elem_idx)
                        && let Some(ribbon) = offset_polygon(points, *width)
                    {
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
    /// Returns `(element_index, [minX, minY, maxX, maxY])` for each instance.
    /// Used by the renderer to generate outline segments on selection/hover.
    #[allow(dead_code)]
    pub(crate) fn get_instance_bboxes(&self) -> Vec<(usize, [f64; 4])> {
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
                let bbox = self.instance_bbox_cached(cell_name, elem_idx, cell_ref);
                result.push((
                    elem_idx,
                    [bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y],
                ));
            }
        }

        result
    }

    /// Collect label data for all CellRef instances in the active cell.
    ///
    /// Returns `(element_index, cell_name, [minX, minY, maxX, maxY], repetition)`
    /// where repetition is `Some((columns, rows))` for AREFs, `None` for SREFs.
    #[allow(clippy::type_complexity)]
    pub(crate) fn get_instance_labels(&self) -> Vec<(usize, String, [f64; 4], Option<(u16, u16)>)> {
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
                let bbox = self.instance_bbox_cached(cell_name, elem_idx, cell_ref);
                let rep = cell_ref.repetition.as_ref().and_then(|r| {
                    if r.is_single() {
                        None
                    } else {
                        Some((r.columns, r.rows))
                    }
                });
                labels.push((
                    elem_idx,
                    cell_ref.cell_name.clone(),
                    [bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y],
                    rep,
                ));
            }
        }

        labels
    }
}
