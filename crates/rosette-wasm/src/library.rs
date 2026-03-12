//! WASM bindings for rosette-core Library and Cell.
//!
//! Provides a [`WasmLibrary`] that wraps `rosette_core::Library` and exposes
//! methods to JavaScript for creating and manipulating photonic layouts.

use rosette_core::cell::Element;
use rosette_core::geometry::{BBox, Vector2, offset_polygon};
use rosette_core::{Cell, CellRef, Layer, Library, Point, Polygon, Repetition, Transform};
use std::collections::{HashMap, HashSet};
use uuid::Uuid;
use wasm_bindgen::prelude::*;

/// A rendered polygon: (uuid, vertices, color, fill_pattern).
/// fill_pattern: 0=solid, 1=hatched, 2=crosshatched, 3=dotted.
type RenderPolygon = (String, Vec<[f64; 2]>, [f32; 4], u32);

/// Iterate over all array copy transforms for a CellRef.
///
/// For a non-arrayed CellRef, yields a single transform (the base).
/// For an arrayed CellRef, yields `rows * cols` transforms with offsets
/// applied in the CellRef's local space (pre-multiplied).
///
/// The offset for copy (col, row) is:
///   `Transform::translate(col * col_spacing, row * row_spacing).then(&base)`
fn array_transforms(cell_ref: &CellRef) -> Vec<Transform> {
    match &cell_ref.repetition {
        None => vec![cell_ref.transform],
        Some(rep) if rep.is_single() => vec![cell_ref.transform],
        Some(rep) => {
            let mut transforms = Vec::with_capacity(rep.count());
            for row in 0..rep.rows {
                for col in 0..rep.columns {
                    let dx = col as f64 * rep.col_spacing;
                    let dy = row as f64 * rep.row_spacing;
                    let offset = Transform::translate(dx, dy).then(&cell_ref.transform);
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
const REF_UUID_PREFIX: &str = "ref:";

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
    /// 0=solid, 1=hatched, 2=crosshatched, 3=dotted.
    layer_fill_patterns: HashMap<u32, u32>,
    /// Whether the library has changed since last sync.
    dirty: bool,
    /// Maps element UUIDs to hole start indices for polygons with cutouts.
    ///
    /// Produced by `boolean_operation` when the result has interior rings.
    /// Consumed by the renderer to pass hole data to `earcutr::earcut`.
    hole_indices_map: HashMap<String, Vec<usize>>,
    /// Maximum hierarchy depth for rendering CellRef instances.
    /// 0 means unlimited (fully resolve all nested references).
    /// 1 means only render direct elements of the active cell (instances shown as outlines only).
    /// N means resolve up to N levels of nesting.
    hierarchy_depth_limit: u32,
}

/// Generate a constant-width ribbon polygon from a centerline.
///
/// At each interior vertex, computes the miter point that keeps the path
/// edges at exactly `half_width` from the centerline. The miter length is
/// clamped to `2 * half_width` to avoid spikes at very sharp bends.
fn constant_width_path(centerline: &[Point], width: f64) -> Option<Polygon> {
    if centerline.len() < 2 {
        return None;
    }

    let hw = width / 2.0;
    let n = centerline.len();
    let mut left = Vec::with_capacity(n);
    let mut right = Vec::with_capacity(n);

    for i in 0..n {
        let (nx, ny) = if i == 0 {
            // First point: perpendicular to first segment
            let dx = centerline[1].x - centerline[0].x;
            let dy = centerline[1].y - centerline[0].y;
            let len = (dx * dx + dy * dy).sqrt();
            if len < 1e-12 {
                continue;
            }
            (-dy / len, dx / len)
        } else if i == n - 1 {
            // Last point: perpendicular to last segment
            let dx = centerline[n - 1].x - centerline[n - 2].x;
            let dy = centerline[n - 1].y - centerline[n - 2].y;
            let len = (dx * dx + dy * dy).sqrt();
            if len < 1e-12 {
                continue;
            }
            (-dy / len, dx / len)
        } else {
            // Interior: compute miter from incoming and outgoing segment normals
            let dx1 = centerline[i].x - centerline[i - 1].x;
            let dy1 = centerline[i].y - centerline[i - 1].y;
            let len1 = (dx1 * dx1 + dy1 * dy1).sqrt();
            let dx2 = centerline[i + 1].x - centerline[i].x;
            let dy2 = centerline[i + 1].y - centerline[i].y;
            let len2 = (dx2 * dx2 + dy2 * dy2).sqrt();

            if len1 < 1e-12 || len2 < 1e-12 {
                continue;
            }

            // Per-segment unit normals (pointing left of travel direction)
            let n1x = -dy1 / len1;
            let n1y = dx1 / len1;
            let n2x = -dy2 / len2;
            let n2y = dx2 / len2;

            // Miter direction = average of the two normals
            let mx = n1x + n2x;
            let my = n1y + n2y;
            let mlen = (mx * mx + my * my).sqrt();

            if mlen < 1e-12 {
                // Normals are opposite (180° turn) — use first normal
                (n1x, n1y)
            } else {
                // Miter scale: hw / dot(miter_unit, n1) keeps edges at half_width
                let mux = mx / mlen;
                let muy = my / mlen;
                let dot = mux * n1x + muy * n1y;

                if dot.abs() < 1e-6 {
                    (n1x, n1y)
                } else {
                    let scale = (hw / dot).min(2.0 * hw).max(-2.0 * hw);
                    // Return the pre-scaled offset (not unit normal * hw)
                    left.push(Point::new(
                        centerline[i].x + mux * scale,
                        centerline[i].y + muy * scale,
                    ));
                    right.push(Point::new(
                        centerline[i].x - mux * scale,
                        centerline[i].y - muy * scale,
                    ));
                    continue;
                }
            }
        };

        left.push(Point::new(
            centerline[i].x + nx * hw,
            centerline[i].y + ny * hw,
        ));
        right.push(Point::new(
            centerline[i].x - nx * hw,
            centerline[i].y - ny * hw,
        ));
    }

    if left.len() < 2 {
        return None;
    }

    // Build closed polygon: left side forward, right side reversed
    right.reverse();
    left.append(&mut right);
    Some(Polygon::new(left))
}

/// Pack layer number and datatype into a single u32 key.
fn layer_key(layer: u16, datatype: u16) -> u32 {
    ((layer as u32) << 16) | (datatype as u32)
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

#[wasm_bindgen]
impl WasmLibrary {
    /// Create a new library with the given name.
    #[wasm_bindgen(constructor)]
    pub fn new(name: &str) -> Self {
        Self {
            library: Library::new(name.to_string()),
            active_cell: None,
            element_refs: HashMap::new(),
            layer_colors: HashMap::new(),
            layer_fill_patterns: HashMap::new(),
            dirty: false,
            hole_indices_map: HashMap::new(),
            hierarchy_depth_limit: 0,
        }
    }

    /// Add a new cell to the library.
    ///
    /// Returns an error if the name is invalid or already exists.
    pub fn add_cell(&mut self, name: &str) -> Result<(), JsValue> {
        let cell = Cell::new(name.to_string());
        self.library
            .add_cell(cell)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        if self.active_cell.is_none() {
            self.active_cell = Some(name.to_string());
        }
        Ok(())
    }

    /// Rename a cell in the library.
    ///
    /// Returns false if old_name doesn't exist, or throws a JS error if
    /// new_name is invalid or already taken.
    pub fn rename_cell(&mut self, old_name: &str, new_name: &str) -> Result<bool, JsValue> {
        let found = self
            .library
            .rename_cell(old_name, new_name)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;

        if found {
            // Update active cell reference if it was renamed
            if self.active_cell.as_deref() == Some(old_name) {
                self.active_cell = Some(new_name.to_string());
            }
            // Update element refs that point to the old cell name
            for elem_ref in self.element_refs.values_mut() {
                if elem_ref.cell_name == old_name {
                    elem_ref.cell_name = new_name.to_string();
                }
            }
            self.dirty = true;
        }
        Ok(found)
    }

    /// Remove a cell from the library.
    ///
    /// Returns false if the cell doesn't exist.
    /// If the removed cell is the active cell, the active cell is cleared.
    pub fn remove_cell(&mut self, name: &str) -> bool {
        if self.library.remove_cell(name) {
            // Clear active cell if it was removed
            if self.active_cell.as_deref() == Some(name) {
                self.active_cell = self.library.cells().first().map(|c| c.name().to_string());
            }
            // Remove element refs that point to the removed cell
            self.element_refs.retain(|_, r| r.cell_name != name);
            self.dirty = true;
            true
        } else {
            false
        }
    }

    /// Set the active cell by name.
    ///
    /// Returns false if the cell doesn't exist.
    pub fn set_active_cell(&mut self, name: &str) -> bool {
        if self.library.contains(name) {
            self.active_cell = Some(name.to_string());
            true
        } else {
            false
        }
    }

    /// Get the active cell name, or None if no cell exists.
    pub fn active_cell_name(&self) -> Option<String> {
        self.active_cell.clone()
    }

    /// Set the maximum hierarchy depth for rendering CellRef instances.
    ///
    /// - `0` means unlimited (fully resolve all nested references).
    /// - `1` means only render direct elements of the active cell; instances
    ///   are not resolved (they still appear as bounding-box outlines).
    /// - `N` means resolve up to N levels of nested CellRef elements.
    pub fn set_hierarchy_depth_limit(&mut self, limit: u32) {
        self.hierarchy_depth_limit = limit;
        self.dirty = true;
    }

    /// Get the origin of the active cell as [x, y].
    ///
    /// Returns None if no active cell exists.
    pub fn get_cell_origin(&self) -> Option<Vec<f64>> {
        let cell_name = self.active_cell.as_deref()?;
        let cell = self.library.cell(cell_name)?;
        let origin = cell.origin();
        Some(vec![origin.x, origin.y])
    }

    /// Get the origin of a cell by name as [x, y].
    ///
    /// Returns None if the cell does not exist.
    pub fn get_cell_origin_by_name(&self, cell_name: &str) -> Option<Vec<f64>> {
        let cell = self.library.cell(cell_name)?;
        let origin = cell.origin();
        Some(vec![origin.x, origin.y])
    }

    /// Set the origin of the active cell.
    ///
    /// Returns false if no active cell exists.
    pub fn set_cell_origin(&mut self, x: f64, y: f64) -> bool {
        let cell_name = match self.active_cell.as_deref() {
            Some(name) => name.to_string(),
            None => return false,
        };
        if let Some(cell) = self.library.cell_mut(&cell_name) {
            cell.set_origin(Point::new(x, y));
            self.dirty = true;
            true
        } else {
            false
        }
    }

    /// Get the number of cells in the library.
    pub fn cell_count(&self) -> usize {
        self.library.cells().len()
    }

    /// Set the color for a layer.
    ///
    /// Colors are RGBA with values 0.0-1.0.
    pub fn set_layer_color(&mut self, layer: u16, datatype: u16, r: f32, g: f32, b: f32, a: f32) {
        let key = layer_key(layer, datatype);
        self.layer_colors.insert(key, [r, g, b, a]);
        self.dirty = true;
    }

    /// Set the fill pattern for a layer.
    ///
    /// Pattern IDs: 0=solid, 1=hatched, 2=crosshatched, 3=dotted.
    pub fn set_layer_fill_pattern(&mut self, layer: u16, datatype: u16, pattern: u32) {
        let key = layer_key(layer, datatype);
        self.layer_fill_patterns.insert(key, pattern);
        self.dirty = true;
    }

    /// Add a rectangle to the active cell.
    ///
    /// Returns the element's UUID, or None if no active cell.
    ///
    /// # Arguments
    /// * `x`, `y` - Bottom-left corner position
    /// * `width`, `height` - Rectangle dimensions
    /// * `layer`, `datatype` - GDS layer specification
    pub fn add_rectangle(
        &mut self,
        x: f64,
        y: f64,
        width: f64,
        height: f64,
        layer: u16,
        datatype: u16,
    ) -> Option<String> {
        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell_mut(cell_name)?;

        let polygon = Polygon::rect(Point::new(x, y), width, height);
        let layer_spec = Layer::new(layer, datatype);

        cell.add_polygon(polygon, layer_spec);

        // Use actual element index (elements.len() - 1), not polygon_count(),
        // because the cell may contain mixed element types (CellRef, Path, etc.)
        let element_index = cell.elements().len() - 1;
        let uuid = Uuid::new_v4().to_string();

        self.element_refs.insert(
            uuid.clone(),
            ElementRef {
                cell_name: cell_name.clone(),
                element_index,
            },
        );

        self.dirty = true;
        Some(uuid)
    }

    /// Add a polygon to the active cell.
    ///
    /// Points are provided as a flat array: [x0, y0, x1, y1, ...].
    /// Returns the element's UUID, or None if no active cell or invalid points.
    pub fn add_polygon(&mut self, points: &[f64], layer: u16, datatype: u16) -> Option<String> {
        if points.len() < 6 {
            return None; // Need at least 3 points
        }

        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell_mut(cell_name)?;

        let vertices: Vec<Point> = points
            .chunks(2)
            .map(|chunk| Point::new(chunk[0], chunk[1]))
            .collect();

        let polygon = Polygon::new(vertices);
        let layer_spec = Layer::new(layer, datatype);

        cell.add_polygon(polygon, layer_spec);

        // Use actual element index (elements.len() - 1), not polygon_count(),
        // because the cell may contain mixed element types (CellRef, Path, etc.)
        let element_index = cell.elements().len() - 1;
        let uuid = Uuid::new_v4().to_string();

        self.element_refs.insert(
            uuid.clone(),
            ElementRef {
                cell_name: cell_name.clone(),
                element_index,
            },
        );

        self.dirty = true;
        Some(uuid)
    }

    /// Create a path (waveguide) polygon from a centerline and width.
    ///
    /// Generates a constant-width ribbon polygon. At interior corners the
    /// miter offset is clamped so the path edges stay at exactly half-width
    /// from the centerline without flaring at bends.
    ///
    /// Points are provided as a flat array: [x0, y0, x1, y1, ...].
    /// Returns the element's UUID, or None if generation fails.
    ///
    /// # Arguments
    /// * `points` - Flat array of centerline coordinates in world units
    /// * `width` - Path width in world units
    /// * `layer` - GDS layer number
    /// * `datatype` - GDS datatype number
    pub fn create_path(
        &mut self,
        points: &[f64],
        width: f64,
        layer: u16,
        datatype: u16,
    ) -> Option<String> {
        if points.len() < 4 {
            return None; // Need at least 2 points
        }

        let cell_name = self.active_cell.as_ref()?;

        let centerline: Vec<Point> = points
            .chunks(2)
            .map(|chunk| Point::new(chunk[0], chunk[1]))
            .collect();

        let polygon = constant_width_path(&centerline, width)?;

        let layer_spec = Layer::new(layer, datatype);
        let cell_name = cell_name.clone();
        let cell = self.library.cell_mut(&cell_name)?;
        cell.add_polygon(polygon, layer_spec);

        let element_index = cell.elements().len() - 1;
        let uuid = Uuid::new_v4().to_string();

        self.element_refs.insert(
            uuid.clone(),
            ElementRef {
                cell_name,
                element_index,
            },
        );

        self.dirty = true;
        Some(uuid)
    }

    /// Add a text label to the active cell.
    ///
    /// Returns the element's UUID, or None if no active cell.
    pub fn add_text(
        &mut self,
        text: &str,
        x: f64,
        y: f64,
        height: f64,
        layer: u16,
        datatype: u16,
    ) -> Option<String> {
        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell_mut(cell_name)?;

        let position = Point::new(x, y);
        let layer_spec = Layer::new(layer, datatype);

        cell.add_text_with_height(text, position, layer_spec, height);

        let element_index = cell.elements().len() - 1;
        let uuid = Uuid::new_v4().to_string();

        self.element_refs.insert(
            uuid.clone(),
            ElementRef {
                cell_name: cell_name.clone(),
                element_index,
            },
        );

        self.dirty = true;
        Some(uuid)
    }

    /// Get all text labels in the active cell as a JS array.
    ///
    /// Each entry is `{ id, text, x, y, height, layer, datatype }`.
    pub fn get_text_labels(&self) -> JsValue {
        let result = js_sys::Array::new();

        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return result.into(),
        };
        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return result.into(),
        };

        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::Text {
                text,
                position,
                layer,
                height,
            } = element
            {
                // Find the UUID for this element
                let uuid = self
                    .element_refs
                    .iter()
                    .find(|(_, er)| er.cell_name == *cell_name && er.element_index == elem_idx)
                    .map(|(uuid, _)| uuid.as_str());

                let id = match uuid {
                    Some(id) => id,
                    None => continue,
                };

                let obj = js_sys::Object::new();
                js_sys::Reflect::set(&obj, &"id".into(), &JsValue::from_str(id)).ok();
                js_sys::Reflect::set(&obj, &"text".into(), &JsValue::from_str(text)).ok();
                js_sys::Reflect::set(&obj, &"x".into(), &JsValue::from_f64(position.x)).ok();
                js_sys::Reflect::set(&obj, &"y".into(), &JsValue::from_f64(position.y)).ok();
                js_sys::Reflect::set(&obj, &"height".into(), &JsValue::from_f64(*height)).ok();
                js_sys::Reflect::set(
                    &obj,
                    &"layer".into(),
                    &JsValue::from_f64(layer.number as f64),
                )
                .ok();
                js_sys::Reflect::set(
                    &obj,
                    &"datatype".into(),
                    &JsValue::from_f64(layer.datatype as f64),
                )
                .ok();
                result.push(&obj);
            }
        }

        result.into()
    }

    /// Update the text content of an existing text element.
    ///
    /// Returns true if the element was found and updated.
    pub fn update_text(&mut self, id: &str, new_text: &str) -> bool {
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r.clone(),
            None => return false,
        };

        let cell = match self.library.cell_mut(&elem_ref.cell_name) {
            Some(c) => c,
            None => return false,
        };

        let elements = cell.elements_mut();
        if elem_ref.element_index >= elements.len() {
            return false;
        }

        if let Element::Text { text, .. } = &mut elements[elem_ref.element_index] {
            *text = new_text.to_string();
            self.dirty = true;
            true
        } else {
            false
        }
    }

    /// Get text-specific information for a given element UUID.
    ///
    /// Returns a JS object `{ text, x, y, height, layer, datatype }` or null
    /// if the element is not a text element.
    pub fn get_text_element_info(&self, id: &str) -> JsValue {
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r,
            None => return JsValue::NULL,
        };

        let cell = match self.library.cell(&elem_ref.cell_name) {
            Some(c) => c,
            None => return JsValue::NULL,
        };

        if let Some(Element::Text {
            text,
            position,
            layer,
            height,
        }) = cell.elements().get(elem_ref.element_index)
        {
            let obj = js_sys::Object::new();
            js_sys::Reflect::set(&obj, &"text".into(), &JsValue::from_str(text)).ok();
            js_sys::Reflect::set(&obj, &"x".into(), &JsValue::from_f64(position.x)).ok();
            js_sys::Reflect::set(&obj, &"y".into(), &JsValue::from_f64(position.y)).ok();
            js_sys::Reflect::set(&obj, &"height".into(), &JsValue::from_f64(*height)).ok();
            js_sys::Reflect::set(
                &obj,
                &"layer".into(),
                &JsValue::from_f64(layer.number as f64),
            )
            .ok();
            js_sys::Reflect::set(
                &obj,
                &"datatype".into(),
                &JsValue::from_f64(layer.datatype as f64),
            )
            .ok();
            obj.into()
        } else {
            JsValue::NULL
        }
    }

    /// Update the position of a text element.
    ///
    /// Returns true if the element was found and updated.
    pub fn set_text_position(&mut self, id: &str, x: f64, y: f64) -> bool {
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r.clone(),
            None => return false,
        };

        let cell = match self.library.cell_mut(&elem_ref.cell_name) {
            Some(c) => c,
            None => return false,
        };

        let elements = cell.elements_mut();
        if elem_ref.element_index >= elements.len() {
            return false;
        }

        if let Element::Text { position, .. } = &mut elements[elem_ref.element_index] {
            *position = Point::new(x, y);
            self.dirty = true;
            true
        } else {
            false
        }
    }

    /// Update the height of a text element.
    ///
    /// Returns true if the element was found and updated.
    pub fn set_text_height(&mut self, id: &str, new_height: f64) -> bool {
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r.clone(),
            None => return false,
        };

        let cell = match self.library.cell_mut(&elem_ref.cell_name) {
            Some(c) => c,
            None => return false,
        };

        let elements = cell.elements_mut();
        if elem_ref.element_index >= elements.len() {
            return false;
        }

        if let Element::Text { height, .. } = &mut elements[elem_ref.element_index] {
            *height = new_height;
            self.dirty = true;
            true
        } else {
            false
        }
    }

    /// Check if an element is a text element.
    pub fn is_text_element(&self, id: &str) -> bool {
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r,
            None => return false,
        };
        let cell = match self.library.cell(&elem_ref.cell_name) {
            Some(c) => c,
            None => return false,
        };
        matches!(
            cell.elements().get(elem_ref.element_index),
            Some(Element::Text { .. })
        )
    }

    /// Remove an element by its UUID.
    ///
    /// Returns true if the element was removed, false if not found.
    /// Handles both real UUIDs and synthetic ref UUIDs (from CellRef instances).
    pub fn remove_element(&mut self, id: &str) -> bool {
        // Check for synthetic ref UUID first
        let resolved_id = if let Some(elem_idx) = parse_ref_uuid_element_index(id) {
            // Find the real UUID that maps to this element index in the active cell
            if let Some(cell_name) = &self.active_cell {
                self.element_refs
                    .iter()
                    .find(|(_, er)| er.cell_name == *cell_name && er.element_index == elem_idx)
                    .map(|(uuid, _)| uuid.clone())
            } else {
                None
            }
        } else {
            Some(id.to_string())
        };

        let resolved_id = match resolved_id {
            Some(rid) => rid,
            None => return false,
        };

        let elem_ref = match self.element_refs.remove(&resolved_id) {
            Some(r) => r,
            None => return false,
        };

        let cell = match self.library.cell_mut(&elem_ref.cell_name) {
            Some(c) => c,
            None => return false,
        };

        // Remove the element
        if cell.remove_element(elem_ref.element_index).is_none() {
            return false;
        }

        // Clean up hole indices
        self.hole_indices_map.remove(&resolved_id);

        // Update all refs that point to elements after the removed one
        for ref_entry in self.element_refs.values_mut() {
            if ref_entry.cell_name == elem_ref.cell_name
                && ref_entry.element_index > elem_ref.element_index
            {
                ref_entry.element_index -= 1;
            }
        }

        self.dirty = true;
        true
    }

    /// Remove multiple elements by their UUIDs in a single batch operation.
    ///
    /// This is more efficient than calling `remove_element` repeatedly because
    /// it only rebuilds element indices once at the end, rather than after each removal.
    /// Handles both real UUIDs and synthetic ref UUIDs (from CellRef instances).
    /// Returns the number of elements successfully removed.
    pub fn remove_elements(&mut self, ids: Vec<String>) -> usize {
        if ids.is_empty() {
            return 0;
        }

        let active_cell_name = self.active_cell.clone();

        // Collect refs for elements to remove, grouped by cell.
        // Track which CellRef element indices we've already scheduled so
        // multiple synthetic UUIDs for the same instance don't cause double-removal.
        let mut to_remove: Vec<(String, String, usize)> = Vec::new(); // (id, cell_name, element_index)
        let mut scheduled_ref_indices: std::collections::HashSet<usize> =
            std::collections::HashSet::new();

        for id in &ids {
            // First check: synthetic ref UUID (from CellRef instance)
            if let Some(elem_idx) = parse_ref_uuid_element_index(id) {
                if scheduled_ref_indices.insert(elem_idx) {
                    // Find the real UUID for this element index so we can remove it from element_refs
                    if let Some(cell_name) = &active_cell_name {
                        // Find the real UUID that maps to this element index
                        let real_uuid = self
                            .element_refs
                            .iter()
                            .find(|(_, er)| {
                                er.cell_name == *cell_name && er.element_index == elem_idx
                            })
                            .map(|(uuid, _)| uuid.clone());

                        if let Some(uuid) = real_uuid {
                            to_remove.push((uuid, cell_name.clone(), elem_idx));
                        }
                    }
                }
                continue;
            }

            // Regular polygon UUID
            if let Some(elem_ref) = self.element_refs.get(id) {
                to_remove.push((
                    id.clone(),
                    elem_ref.cell_name.clone(),
                    elem_ref.element_index,
                ));
            }
        }

        if to_remove.is_empty() {
            return 0;
        }

        // Sort by cell name, then by element index in DESCENDING order
        // (removing from end first avoids index shifting issues)
        to_remove.sort_by(|a, b| {
            match a.1.cmp(&b.1) {
                std::cmp::Ordering::Equal => b.2.cmp(&a.2), // Descending index
                other => other,
            }
        });

        let mut removed_count = 0;

        // Process removals grouped by cell
        let mut current_cell: Option<String> = None;
        let mut indices_removed_in_cell: Vec<usize> = Vec::new();

        for (id, cell_name, element_index) in to_remove {
            // If switching to a new cell, apply index adjustments for previous cell
            if current_cell.as_ref() != Some(&cell_name) {
                if let Some(prev_cell) = &current_cell {
                    self.adjust_indices_after_batch_remove(prev_cell, &indices_removed_in_cell);
                }
                current_cell = Some(cell_name.clone());
                indices_removed_in_cell.clear();
            }

            // Remove from refs map and hole indices
            self.element_refs.remove(&id);
            self.hole_indices_map.remove(&id);

            // Remove from cell
            if let Some(cell) = self.library.cell_mut(&cell_name)
                && cell.remove_element(element_index).is_some()
            {
                indices_removed_in_cell.push(element_index);
                removed_count += 1;
            }
        }

        // Apply index adjustments for last cell
        if let Some(last_cell) = &current_cell {
            self.adjust_indices_after_batch_remove(last_cell, &indices_removed_in_cell);
        }

        if removed_count > 0 {
            self.dirty = true;
        }

        removed_count
    }

    /// Adjust element indices after removing multiple elements from a cell.
    /// `removed_indices` should be sorted in descending order.
    fn adjust_indices_after_batch_remove(&mut self, cell_name: &str, removed_indices: &[usize]) {
        if removed_indices.is_empty() {
            return;
        }

        // For each ref in this cell, count how many removed indices are below it
        for ref_entry in self.element_refs.values_mut() {
            if ref_entry.cell_name == cell_name {
                let adjustment = removed_indices
                    .iter()
                    .filter(|&&idx| idx < ref_entry.element_index)
                    .count();
                ref_entry.element_index -= adjustment;
            }
        }
    }

    /// Get UUIDs of all elements on a given layer in the active cell.
    ///
    /// Use this to snapshot elements before deletion (e.g., for undo support).
    pub fn get_elements_on_layer(&self, layer: u16, datatype: u16) -> Vec<String> {
        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };

        let target = Layer::new(layer, datatype);

        self.element_refs
            .iter()
            .filter(|(_, elem_ref)| {
                elem_ref.cell_name == *cell_name
                    && (cell
                        .elements()
                        .get(elem_ref.element_index)
                        .and_then(|e| e.layer())
                        == Some(target))
            })
            .map(|(uuid, _)| uuid.clone())
            .collect()
    }

    /// Remove all elements on a given layer from the active cell.
    ///
    /// Returns the number of removed elements.
    pub fn remove_elements_on_layer(&mut self, layer: u16, datatype: u16) -> usize {
        let ids = self.get_elements_on_layer(layer, datatype);
        self.remove_elements(ids)
    }

    /// Remove the color entry for a layer.
    ///
    /// Call this after deleting a layer to clean up stale rendering state.
    pub fn remove_layer_color(&mut self, layer: u16, datatype: u16) {
        let key = layer_key(layer, datatype);
        self.layer_fill_patterns.remove(&key);
        if self.layer_colors.remove(&key).is_some() {
            self.dirty = true;
        }
    }

    /// Get all unique (layer, datatype) pairs used across all cells.
    ///
    /// Returns a flat array: `[layer0, datatype0, layer1, datatype1, ...]`
    /// sorted by layer number then datatype.
    pub fn get_used_layers(&self) -> Vec<u32> {
        let mut seen = HashSet::new();
        for cell in self.library.cells() {
            for element in cell.elements() {
                if let Some(layer) = element.layer() {
                    seen.insert((layer.number, layer.datatype));
                }
            }
        }
        let mut pairs: Vec<_> = seen.into_iter().collect();
        pairs.sort();
        let mut result = Vec::with_capacity(pairs.len() * 2);
        for (num, dt) in pairs {
            result.push(num as u32);
            result.push(dt as u32);
        }
        result
    }

    /// Clear all elements from the active cell.
    pub fn clear_active_cell(&mut self) {
        if let Some(cell_name) = &self.active_cell {
            // Remove refs for this cell
            self.element_refs.retain(|_, r| r.cell_name != *cell_name);

            // Replace cell with empty one
            if let Some(cell) = self.library.cell_mut(cell_name) {
                *cell = Cell::new(cell_name.clone());
            }

            self.dirty = true;
        }
    }

    /// Check if the library has changed since last sync.
    pub fn is_dirty(&self) -> bool {
        self.dirty
    }

    /// Mark the library as clean (after syncing to renderer).
    pub fn mark_clean(&mut self) {
        self.dirty = false;
    }

    /// Get the number of elements in the active cell.
    pub fn element_count(&self) -> usize {
        self.active_cell
            .as_ref()
            .and_then(|name| self.library.cell(name))
            .map(|cell| cell.polygon_count())
            .unwrap_or(0)
    }

    /// Hit test at a world position.
    ///
    /// Returns the UUID of the element at that point, if any.
    /// When multiple elements overlap, returns the one with smallest area
    /// (typically the "topmost" in visual stacking).
    /// Also tests CellRef-resolved geometry using synthetic UUIDs.
    pub fn hit_test(&self, x: f64, y: f64) -> Option<String> {
        let point = Point::new(x, y);
        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell(cell_name)?;

        let mut hits: Vec<(String, f64)> = Vec::new(); // (uuid, area)

        // Test direct polygon elements
        for (uuid, elem_ref) in &self.element_refs {
            if elem_ref.cell_name != *cell_name {
                continue;
            }

            match cell.elements().get(elem_ref.element_index) {
                Some(Element::Polygon { polygon, layer }) => {
                    // Skip hidden layers (alpha == 0)
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    let bbox = polygon.bbox();
                    if !bbox.contains(point) {
                        continue;
                    }

                    if polygon.contains(point) {
                        hits.push((uuid.clone(), polygon.area()));
                    }
                }
                Some(Element::Path {
                    points,
                    width,
                    layer,
                    ..
                }) => {
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    if let Some(ribbon) = offset_polygon(points, *width) {
                        let bbox = ribbon.bbox();
                        if bbox.contains(point) && ribbon.contains(point) {
                            hits.push((uuid.clone(), ribbon.area()));
                        }
                    }
                }
                Some(Element::Text {
                    text,
                    position,
                    layer,
                    height,
                }) => {
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    let bbox = text_bbox(text, position, *height);
                    if bbox.contains(point) {
                        let area = (bbox.max().x - bbox.min().x) * (bbox.max().y - bbox.min().y);
                        hits.push((uuid.clone(), area));
                    }
                }
                _ => {}
            }
        }

        // Test CellRef instances via bounding box — clicking anywhere inside
        // the instance bbox selects the whole instance.
        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::CellRef(cell_ref) = element {
                let bbox = self.instance_bbox(cell_ref);
                if bbox.contains(point) {
                    // Use first synthetic UUID as the representative hit
                    let uuid = format!("{REF_UUID_PREFIX}{elem_idx}:0");
                    let area = (bbox.max().x - bbox.min().x) * (bbox.max().y - bbox.min().y);
                    hits.push((uuid, area));
                }
            }
        }

        // Return smallest area (topmost in stacking order)
        hits.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap_or(std::cmp::Ordering::Equal));
        hits.first().map(|(uuid, _)| uuid.clone())
    }

    /// Hit test a rectangle to find all intersecting elements.
    ///
    /// Returns UUIDs of all elements whose bounding boxes intersect
    /// the given rectangle (specified in world coordinates).
    /// Also tests CellRef-resolved geometry using synthetic UUIDs.
    pub fn hit_test_rect(&self, min_x: f64, min_y: f64, max_x: f64, max_y: f64) -> Vec<String> {
        let query_bbox = BBox::new(Point::new(min_x, min_y), Point::new(max_x, max_y));

        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };

        let mut hits: Vec<String> = Vec::new();

        // Test direct polygon elements
        for (uuid, elem_ref) in &self.element_refs {
            if elem_ref.cell_name != *cell_name {
                continue;
            }

            match cell.elements().get(elem_ref.element_index) {
                Some(Element::Polygon { polygon, layer }) => {
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    let bbox = polygon.bbox();
                    if bbox.overlaps(&query_bbox) {
                        hits.push(uuid.clone());
                    }
                }
                Some(Element::Path {
                    points,
                    width,
                    layer,
                    ..
                }) => {
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    if let Some(ribbon) = offset_polygon(points, *width) {
                        let bbox = ribbon.bbox();
                        if bbox.overlaps(&query_bbox) {
                            hits.push(uuid.clone());
                        }
                    }
                }
                Some(Element::Text {
                    text,
                    position,
                    layer,
                    height,
                }) => {
                    let key = layer_key(layer.number, layer.datatype);
                    if let Some(color) = self.layer_colors.get(&key)
                        && color[3] <= 0.0
                    {
                        continue;
                    }

                    let bbox = text_bbox(text, position, *height);
                    if bbox.overlaps(&query_bbox) {
                        hits.push(uuid.clone());
                    }
                }
                _ => {}
            }
        }

        // Test CellRef instances via bounding box
        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::CellRef(cell_ref) = element {
                let bbox = self.instance_bbox(cell_ref);
                if bbox.overlaps(&query_bbox) {
                    // Add all synthetic UUIDs for this instance
                    hits.extend(self.get_all_ref_uuids_for_element(elem_idx));
                }
            }
        }

        hits
    }

    /// Get all element UUIDs that belong to the same instance group as the given UUID.
    ///
    /// If the UUID is a synthetic ref UUID (from a CellRef instance), returns all
    /// synthetic UUIDs for that same CellRef element.
    /// If the UUID is part of a pre-flattened group (design mode), returns group members.
    /// Otherwise returns just the UUID itself.
    pub fn get_group_ids(&self, uuid: &str) -> Vec<String> {
        // Check if this is a synthetic CellRef UUID (format: "ref:{elem_idx}:{poly_idx}")
        if let Some(elem_idx) = parse_ref_uuid_element_index(uuid) {
            // Return all synthetic UUIDs for this CellRef instance
            return self.get_all_ref_uuids_for_element(elem_idx);
        }

        // Regular element — return just this element
        vec![uuid.to_string()]
    }

    /// Get all element IDs in the active cell.
    ///
    /// Returns a vector of UUIDs for all elements in the active cell,
    /// including synthetic UUIDs for CellRef-resolved geometry.
    pub fn get_all_ids(&self) -> Vec<String> {
        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };

        // Collect non-CellRef element UUIDs (polygons, paths, etc.)
        let mut ids: Vec<String> = self
            .element_refs
            .iter()
            .filter(|(_, elem_ref)| {
                elem_ref.cell_name == *cell_name
                    && !matches!(
                        cell.elements().get(elem_ref.element_index),
                        Some(Element::CellRef(_))
                    )
            })
            .map(|(uuid, _)| uuid.clone())
            .collect();

        // Include synthetic UUIDs for CellRef instances (these are the IDs
        // used by hit-testing and selection, so they must be the canonical
        // representation for CellRef elements)
        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::CellRef(_) = element {
                ids.extend(self.get_all_ref_uuids_for_element(elem_idx));
            }
        }

        ids
    }

    /// Get one representative UUID per element or CellRef instance.
    ///
    /// Used for Tab-cycling: each step in the cycle corresponds to one
    /// cell instance (CellRef) or one standalone element (polygon, path, text).
    pub fn get_group_representative_ids(&self) -> Vec<String> {
        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };

        let mut result = Vec::new();

        // Collect non-CellRef element UUIDs (polygons, paths, text)
        let mut direct_uuids: Vec<String> = self
            .element_refs
            .iter()
            .filter(|(_, elem_ref)| {
                elem_ref.cell_name == *cell_name
                    && !matches!(
                        cell.elements().get(elem_ref.element_index),
                        Some(Element::CellRef(_))
                    )
            })
            .map(|(uuid, _)| uuid.clone())
            .collect();
        direct_uuids.sort();
        result.extend(direct_uuids);

        // Include one representative per CellRef instance
        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::CellRef(_) = element {
                // Use the first synthetic UUID for this CellRef
                result.push(format!("{REF_UUID_PREFIX}{elem_idx}:0"));
            }
        }

        result
    }

    /// Get the bounding box of all elements in the active cell.
    ///
    /// Returns [minX, minY, maxX, maxY] or None if no elements exist.
    /// Includes CellRef-resolved geometry.
    pub fn get_all_bounds(&self) -> Option<Vec<f64>> {
        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell(cell_name)?;

        let mut combined_bbox: Option<BBox> = None;

        for elem_ref in self.element_refs.values() {
            if elem_ref.cell_name != *cell_name {
                continue;
            }

            if let Some(Element::Polygon { polygon, .. }) =
                cell.elements().get(elem_ref.element_index)
            {
                let bbox = polygon.bbox();
                combined_bbox = Some(match combined_bbox {
                    Some(existing) => existing.merge(&bbox),
                    None => bbox,
                });
            }
        }

        // Include CellRef-resolved geometry bounds (including array copies)
        for element in cell.elements() {
            if let Element::CellRef(cell_ref) = element {
                for copy_transform in array_transforms(cell_ref) {
                    self.collect_bounds_recursive(
                        &cell_ref.cell_name,
                        &copy_transform,
                        &mut combined_bbox,
                    );
                }
            }
        }

        combined_bbox.map(|bbox| vec![bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y])
    }

    /// Get the bounding box of elements with the given UUIDs.
    ///
    /// Returns [minX, minY, maxX, maxY] or None if none of the IDs are found.
    /// Handles both regular UUIDs and synthetic ref UUIDs.
    pub fn get_bounds_for_ids(&self, ids: Vec<String>) -> Option<Vec<f64>> {
        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell(cell_name)?;

        let mut combined_bbox: Option<BBox> = None;

        // Collect CellRef element indices we've already handled (to avoid double-counting)
        let mut handled_ref_elements: std::collections::HashSet<usize> =
            std::collections::HashSet::new();

        for id in &ids {
            // Check if this is a synthetic ref UUID
            if let Some(elem_idx) = parse_ref_uuid_element_index(id) {
                if handled_ref_elements.insert(elem_idx) {
                    // First time seeing this CellRef — include its full bounds
                    if let Some(Element::CellRef(cell_ref)) = cell.elements().get(elem_idx) {
                        let bbox = self.instance_bbox(cell_ref);
                        combined_bbox = Some(match combined_bbox {
                            Some(existing) => existing.merge(&bbox),
                            None => bbox,
                        });
                    }
                }
                continue;
            }

            // Regular element UUID (polygon or text)
            let elem_ref = match self.element_refs.get(id.as_str()) {
                Some(r) => r,
                None => continue,
            };

            if elem_ref.cell_name != *cell_name {
                continue;
            }

            let bbox = match cell.elements().get(elem_ref.element_index) {
                Some(Element::Polygon { polygon, .. }) => Some(polygon.bbox()),
                Some(Element::Text {
                    text,
                    position,
                    height,
                    ..
                }) => Some(text_bbox(text, position, *height)),
                _ => None,
            };

            if let Some(bbox) = bbox {
                combined_bbox = Some(match combined_bbox {
                    Some(existing) => existing.merge(&bbox),
                    None => bbox,
                });
            }
        }

        combined_bbox.map(|bbox| vec![bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y])
    }

    /// Get vertices of an element for outline rendering.
    ///
    /// Returns flat array [x0, y0, x1, y1, ...] or None if not found.
    /// For synthetic ref UUIDs, returns the transformed polygon vertices.
    pub fn get_element_vertices(&self, id: &str) -> Option<Vec<f64>> {
        // Handle synthetic ref UUIDs
        if let Some((polygon, _layer)) = self.resolve_ref_uuid(id) {
            let vertices: Vec<f64> = polygon
                .vertices()
                .iter()
                .flat_map(|p| vec![p.x, p.y])
                .collect();
            return Some(vertices);
        }

        let elem_ref = self.element_refs.get(id)?;
        let cell = self.library.cell(&elem_ref.cell_name)?;

        match cell.elements().get(elem_ref.element_index) {
            Some(Element::Polygon { polygon, .. }) => {
                let vertices: Vec<f64> = polygon
                    .vertices()
                    .iter()
                    .flat_map(|p| vec![p.x, p.y])
                    .collect();
                Some(vertices)
            }
            Some(Element::Path { points, width, .. }) => {
                // Convert path to ribbon polygon for outline rendering
                if let Some(ribbon) = offset_polygon(points, *width) {
                    let vertices: Vec<f64> = ribbon
                        .vertices()
                        .iter()
                        .flat_map(|p| vec![p.x, p.y])
                        .collect();
                    Some(vertices)
                } else {
                    None
                }
            }
            Some(Element::Text {
                text,
                position,
                height,
                ..
            }) => {
                // Return bounding rectangle corners for selection outline rendering
                let bbox = text_bbox(text, position, *height);
                Some(vec![
                    bbox.min().x,
                    bbox.min().y,
                    bbox.max().x,
                    bbox.min().y,
                    bbox.max().x,
                    bbox.max().y,
                    bbox.min().x,
                    bbox.max().y,
                ])
            }
            _ => None,
        }
    }

    /// Get full element information including vertices, layer, and datatype.
    ///
    /// Returns None/undefined if element not found.
    /// For synthetic ref UUIDs, returns the transformed polygon data.
    pub fn get_element_info(&self, id: &str) -> Option<ElementInfo> {
        // Handle synthetic ref UUIDs
        if let Some((polygon, layer)) = self.resolve_ref_uuid(id) {
            let vertices: Vec<f64> = polygon
                .vertices()
                .iter()
                .flat_map(|p| vec![p.x, p.y])
                .collect();
            return Some(ElementInfo {
                vertices,
                layer: layer.number,
                datatype: layer.datatype,
            });
        }

        let elem_ref = self.element_refs.get(id)?;
        let cell = self.library.cell(&elem_ref.cell_name)?;

        match cell.elements().get(elem_ref.element_index) {
            Some(Element::Polygon { polygon, layer }) => {
                let vertices: Vec<f64> = polygon
                    .vertices()
                    .iter()
                    .flat_map(|p| vec![p.x, p.y])
                    .collect();

                Some(ElementInfo {
                    vertices,
                    layer: layer.number,
                    datatype: layer.datatype,
                })
            }
            Some(Element::Path {
                points,
                width,
                layer,
                ..
            }) => {
                // Convert path centerline to ribbon polygon for selection outlines
                if let Some(ribbon) = offset_polygon(points, *width) {
                    let vertices: Vec<f64> = ribbon
                        .vertices()
                        .iter()
                        .flat_map(|p| vec![p.x, p.y])
                        .collect();
                    Some(ElementInfo {
                        vertices,
                        layer: layer.number,
                        datatype: layer.datatype,
                    })
                } else {
                    None
                }
            }
            Some(Element::Text {
                text,
                position,
                layer,
                height,
            }) => {
                // Return bounding rectangle as vertices so selection outlines work
                let bbox = text_bbox(text, position, *height);
                let vertices = vec![
                    bbox.min().x,
                    bbox.min().y,
                    bbox.max().x,
                    bbox.min().y,
                    bbox.max().x,
                    bbox.max().y,
                    bbox.min().x,
                    bbox.max().y,
                ];
                Some(ElementInfo {
                    vertices,
                    layer: layer.number,
                    datatype: layer.datatype,
                })
            }
            _ => None,
        }
    }

    /// Get CellRef information for a given UUID.
    ///
    /// Works with both real UUIDs and synthetic ref UUIDs.
    /// Returns None if the element is not a CellRef.
    pub fn get_cell_ref_info(&self, id: &str) -> Option<CellRefInfo> {
        // Try synthetic ref UUID first
        if let Some(elem_idx) = parse_ref_uuid_element_index(id) {
            let cell_name = self.active_cell.as_ref()?;
            let cell = self.library.cell(cell_name)?;
            if let Some(Element::CellRef(cell_ref)) = cell.elements().get(elem_idx) {
                let t = &cell_ref.transform;
                return Some(CellRefInfo {
                    cell_name: cell_ref.cell_name.clone(),
                    transform: vec![t.a, t.b, t.c, t.d, t.tx, t.ty],
                });
            }
            return None;
        }

        // Try real UUID
        let elem_ref = self.element_refs.get(id)?;
        let cell = self.library.cell(&elem_ref.cell_name)?;
        if let Some(Element::CellRef(cell_ref)) = cell.elements().get(elem_ref.element_index) {
            let t = &cell_ref.transform;
            Some(CellRefInfo {
                cell_name: cell_ref.cell_name.clone(),
                transform: vec![t.a, t.b, t.c, t.d, t.tx, t.ty],
            })
        } else {
            None
        }
    }

    /// Add a CellRef element with a full affine transform (for undo/redo).
    ///
    /// The transform is given as [a, b, c, d, tx, ty].
    /// Returns the UUID of the new element, or None on failure.
    pub fn add_cell_ref_with_transform(
        &mut self,
        ref_cell_name: &str,
        transform: Vec<f64>,
    ) -> Option<String> {
        if transform.len() != 6 {
            return None;
        }

        let active_name = self.active_cell.as_ref()?.clone();

        if active_name == ref_cell_name {
            return None;
        }

        if !self.library.contains(ref_cell_name) {
            return None;
        }

        if !self.can_instance_cell(&active_name, ref_cell_name) {
            return None;
        }

        let t = Transform::new(
            transform[0],
            transform[1],
            transform[2],
            transform[3],
            transform[4],
            transform[5],
        );
        let cell_ref = CellRef::with_transform(ref_cell_name.to_string(), t);

        let cell = self.library.cell_mut(&active_name)?;
        cell.add_ref(cell_ref);
        let element_index = cell.elements().len() - 1;

        let uuid = Uuid::new_v4().to_string();
        self.element_refs.insert(
            uuid.clone(),
            ElementRef {
                cell_name: active_name,
                element_index,
            },
        );

        self.dirty = true;
        Some(uuid)
    }

    /// Translate an element by the given delta in world coordinates.
    ///
    /// Returns true if successful, false if element not found.
    ///
    /// # Arguments
    /// * `id` - The element's UUID
    /// * `dx` - Translation delta in X direction (world units)
    /// * `dy` - Translation delta in Y direction (world units)
    pub fn translate_element(&mut self, id: &str, dx: f64, dy: f64) -> bool {
        let elem_ref = match self.element_refs.get(id) {
            Some(r) => r.clone(),
            None => return false,
        };

        let cell = match self.library.cell_mut(&elem_ref.cell_name) {
            Some(c) => c,
            None => return false,
        };

        let elements = cell.elements_mut();
        match elements.get_mut(elem_ref.element_index) {
            Some(Element::Polygon { polygon, .. }) => {
                let translation = Vector2::new(dx, dy);
                *polygon = polygon.translate(translation);
                self.dirty = true;
                true
            }
            Some(Element::Path { points, .. }) => {
                for point in points.iter_mut() {
                    *point = Point::new(point.x + dx, point.y + dy);
                }
                self.dirty = true;
                true
            }
            Some(Element::Text { position, .. }) => {
                *position = Point::new(position.x + dx, position.y + dy);
                self.dirty = true;
                true
            }
            _ => false,
        }
    }

    /// Translate multiple elements by the given delta.
    ///
    /// Returns the number of elements successfully translated.
    /// For synthetic ref UUIDs, translates the CellRef element's transform directly.
    ///
    /// # Arguments
    /// * `ids` - Array of element UUIDs
    /// * `dx` - Translation delta in X direction (world units)
    /// * `dy` - Translation delta in Y direction (world units)
    pub fn translate_elements(&mut self, ids: Vec<String>, dx: f64, dy: f64) -> usize {
        let mut count = 0;
        let mut translated_ref_elements: std::collections::HashSet<usize> =
            std::collections::HashSet::new();

        let active_cell_name = match &self.active_cell {
            Some(name) => name.clone(),
            None => return 0,
        };

        for id in &ids {
            // Check if this is a synthetic ref UUID
            if let Some(elem_idx) = parse_ref_uuid_element_index(id) {
                if translated_ref_elements.insert(elem_idx) {
                    // Translate the CellRef element's transform
                    if let Some(cell) = self.library.cell_mut(&active_cell_name)
                        && let Some(Element::CellRef(cell_ref)) =
                            cell.elements_mut().get_mut(elem_idx)
                    {
                        // Compose: new_transform = translate(dx,dy) * old_transform
                        cell_ref.transform = Transform::translate(dx, dy).then(&cell_ref.transform);
                        count += 1;
                        self.dirty = true;
                    }
                }
                continue;
            }

            // Regular polygon UUID
            if self.translate_element(id, dx, dy) {
                count += 1;
            }
        }

        count
    }

    /// Set the full affine transform on a CellRef instance.
    ///
    /// `id` must be a synthetic ref UUID (e.g. "ref:3:0").
    /// `transform` must be `[a, b, c, d, tx, ty]` (6 elements).
    ///
    /// Returns true if the transform was set, false otherwise.
    pub fn set_cell_ref_transform(&mut self, id: &str, transform: Vec<f64>) -> bool {
        if transform.len() != 6 {
            return false;
        }
        let elem_idx = match parse_ref_uuid_element_index(id) {
            Some(idx) => idx,
            None => return false,
        };
        let active_cell_name = match &self.active_cell {
            Some(name) => name.clone(),
            None => return false,
        };
        if let Some(cell) = self.library.cell_mut(&active_cell_name)
            && let Some(Element::CellRef(cell_ref)) = cell.elements_mut().get_mut(elem_idx)
        {
            cell_ref.transform = Transform::new(
                transform[0],
                transform[1],
                transform[2],
                transform[3],
                transform[4],
                transform[5],
            );
            self.dirty = true;
            return true;
        }
        false
    }

    /// Get the array repetition parameters for a CellRef instance.
    ///
    /// `id` must be a synthetic ref UUID (e.g. "ref:3:0").
    /// Returns `[columns, rows, col_spacing, row_spacing]` or None if not arrayed.
    pub fn get_cell_ref_array(&self, id: &str) -> Option<Vec<f64>> {
        let elem_idx = parse_ref_uuid_element_index(id)?;
        let cell_name = self.active_cell.as_ref()?;
        let cell = self.library.cell(cell_name)?;
        if let Some(Element::CellRef(cell_ref)) = cell.elements().get(elem_idx)
            && let Some(rep) = &cell_ref.repetition
        {
            return Some(vec![
                rep.columns as f64,
                rep.rows as f64,
                rep.col_spacing,
                rep.row_spacing,
            ]);
        }
        None
    }

    /// Set the array repetition parameters on a CellRef instance.
    ///
    /// `id` must be a synthetic ref UUID (e.g. "ref:3:0").
    /// `params` must be `[columns, rows, col_spacing, row_spacing]` (4 elements).
    /// If columns and rows are both 1, removes the array (reverts to single instance).
    ///
    /// Returns true if the array was set, false otherwise.
    pub fn set_cell_ref_array(
        &mut self,
        id: &str,
        columns: u16,
        rows: u16,
        col_spacing: f64,
        row_spacing: f64,
    ) -> bool {
        let elem_idx = match parse_ref_uuid_element_index(id) {
            Some(idx) => idx,
            None => return false,
        };
        let active_cell_name = match &self.active_cell {
            Some(name) => name.clone(),
            None => return false,
        };
        if let Some(cell) = self.library.cell_mut(&active_cell_name)
            && let Some(Element::CellRef(cell_ref)) = cell.elements_mut().get_mut(elem_idx)
        {
            if columns <= 1 && rows <= 1 {
                cell_ref.repetition = None;
            } else {
                cell_ref.repetition =
                    Some(Repetition::new(columns, rows, col_spacing, row_spacing));
            }
            self.dirty = true;
            return true;
        }
        false
    }

    /// Get all vertices from all polygons in the active cell.
    ///
    /// Returns a flat array with polygon boundaries encoded as:
    /// [n1, x0, y0, x1, y1, ..., n2, x0, y0, ...]
    /// where n1, n2 are vertex counts for each polygon.
    /// Includes CellRef-resolved geometry.
    ///
    /// Used for snap-to-geometry functionality.
    pub fn get_all_vertices(&self) -> Vec<f64> {
        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };

        let mut result = Vec::new();

        for elem_ref in self.element_refs.values() {
            if elem_ref.cell_name != *cell_name {
                continue;
            }

            if let Some(Element::Polygon { polygon, .. }) =
                cell.elements().get(elem_ref.element_index)
            {
                let verts = polygon.vertices();
                result.push(verts.len() as f64);
                for point in verts {
                    result.push(point.x);
                    result.push(point.y);
                }
            }
        }

        // Include CellRef-resolved vertices
        for element in cell.elements() {
            if let Element::CellRef(cell_ref) = element {
                self.collect_vertices_recursive(
                    &cell_ref.cell_name,
                    &cell_ref.transform,
                    &mut result,
                );
            }
        }

        result
    }

    // =========================================================================
    // Cell Reference (Instance) Methods
    // =========================================================================

    /// Add a cell reference (instance) to the active cell.
    ///
    /// Places an instance of `ref_cell_name` at position `(x, y)` in the active cell.
    /// The CellRef element is stored directly — its geometry is resolved on-the-fly
    /// during rendering and hit-testing, so changes to the child cell are always
    /// reflected in the parent.
    ///
    /// Returns the element index of the CellRef (used for undo), or -1 on failure.
    pub fn add_cell_ref(&mut self, ref_cell_name: &str, x: f64, y: f64) -> Option<String> {
        let active_name = self.active_cell.as_ref()?.clone();

        if active_name == ref_cell_name {
            return None;
        }

        if !self.library.contains(ref_cell_name) {
            return None;
        }

        if !self.can_instance_cell(&active_name, ref_cell_name) {
            return None;
        }

        let cell_ref =
            CellRef::with_transform(ref_cell_name.to_string(), Transform::translate(x, y));

        let cell = self.library.cell_mut(&active_name)?;
        cell.add_ref(cell_ref);
        let element_index = cell.elements().len() - 1;

        let uuid = Uuid::new_v4().to_string();
        self.element_refs.insert(
            uuid.clone(),
            ElementRef {
                cell_name: active_name,
                element_index,
            },
        );

        self.dirty = true;
        Some(uuid)
    }

    // CellRef removal is handled by `remove_element(uuid)` — no separate method needed.

    /// Get the element index for a UUID.
    ///
    /// Returns the element's position in the parent cell's elements list,
    /// or -1 if the UUID is not found. Useful for constructing synthetic
    /// ref UUIDs (e.g. `ref:{index}:0`) for selection after placing an instance.
    pub fn get_element_index(&self, uuid: &str) -> i32 {
        match self.element_refs.get(uuid) {
            Some(elem_ref) => elem_ref.element_index as i32,
            None => -1,
        }
    }

    /// Get the bounding box of a cell's geometry (for drag preview).
    ///
    /// Returns `[minX, minY, maxX, maxY]` or None if the cell is empty/not found.
    /// Includes flattened CellRef geometry.
    pub fn get_cell_bounds(&self, cell_name: &str) -> Option<Vec<f64>> {
        // Verify the cell exists
        self.library.cell(cell_name)?;

        let mut combined_bbox: Option<BBox> = None;
        self.collect_bounds_recursive(cell_name, &Transform::identity(), &mut combined_bbox);
        combined_bbox.map(|bbox| vec![bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y])
    }

    /// Get preview polygons for a cell reference at a given position.
    ///
    /// Returns a JS array of `{ vertices: number[], color: [r, g, b, a] }` objects
    /// suitable for rendering a preview during drag-and-drop.
    pub fn get_cell_preview_polygons(&self, cell_name: &str, x: f64, y: f64) -> JsValue {
        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return JsValue::NULL,
        };

        let transform = Transform::translate(x, y);
        let default_color = [0.5_f32, 0.5, 0.5, 0.4];

        let result = js_sys::Array::new();

        // Flatten the cell's geometry with the transform
        self.collect_preview_polygons(cell, &transform, &default_color, &result);

        result.into()
    }

    /// Get label data for all CellRef instances in the active cell.
    ///
    /// Returns a JS array of objects with:
    /// - `name`: cell name
    /// - `elementIndex`: CellRef element index (for matching with ref UUIDs)
    /// - `minX`, `minY`, `maxX`, `maxY`: bounding box in world coordinates
    pub fn get_instance_label_data(&self) -> JsValue {
        let labels = self.get_instance_labels();
        let result = js_sys::Array::new();

        for (elem_idx, name, bbox) in labels {
            let obj = js_sys::Object::new();
            js_sys::Reflect::set(&obj, &JsValue::from_str("name"), &JsValue::from_str(&name)).ok();
            js_sys::Reflect::set(
                &obj,
                &JsValue::from_str("elementIndex"),
                &JsValue::from_f64(elem_idx as f64),
            )
            .ok();
            js_sys::Reflect::set(
                &obj,
                &JsValue::from_str("minX"),
                &JsValue::from_f64(bbox[0]),
            )
            .ok();
            js_sys::Reflect::set(
                &obj,
                &JsValue::from_str("minY"),
                &JsValue::from_f64(bbox[1]),
            )
            .ok();
            js_sys::Reflect::set(
                &obj,
                &JsValue::from_str("maxX"),
                &JsValue::from_f64(bbox[2]),
            )
            .ok();
            js_sys::Reflect::set(
                &obj,
                &JsValue::from_str("maxY"),
                &JsValue::from_f64(bbox[3]),
            )
            .ok();
            result.push(&obj);
        }

        result.into()
    }

    /// Check whether placing `child_cell` inside `parent_cell` would create
    /// a circular reference.
    ///
    /// Returns true if the instancing is safe (no circular reference).
    pub fn can_instance_cell(&self, parent_cell: &str, child_cell: &str) -> bool {
        if parent_cell == child_cell {
            return false;
        }
        // Walk the child cell's hierarchy to check it doesn't reference parent
        !self.cell_references_recursive(child_cell, parent_cell, &mut Vec::new())
    }

    /// Get the cell hierarchy as a forest of tree roots for the Explorer panel.
    ///
    /// Returns a JS array of `CellNode` objects:
    /// ```ts
    /// Array<{ name: string, children: CellNode[] }>
    /// ```
    ///
    /// Top-level roots are cells that are not referenced by any other cell.
    /// Each root's children are the unique cells it references via `CellRef`
    /// elements, built recursively. Returns `JsValue::NULL` if the library
    /// has no cells.
    pub fn get_cell_tree(&self) -> JsValue {
        let cells = self.library.cells();
        if cells.is_empty() {
            return JsValue::NULL;
        }

        // Collect all cell names that are referenced by some other cell.
        let mut referenced: Vec<String> = Vec::new();
        for cell in cells {
            for cell_ref in cell.cell_refs() {
                if !referenced.contains(&cell_ref.cell_name) {
                    referenced.push(cell_ref.cell_name.clone());
                }
            }
        }

        // Top-level roots: cells not referenced by any other cell.
        // Each root gets its own visited set so shared sub-cells appear
        // correctly under every root that references them.
        let roots = js_sys::Array::new();
        for cell in cells {
            let name = cell.name();
            if !referenced.contains(&name.to_string()) {
                let mut visited = Vec::new();
                let node = self.build_cell_tree_node(name, &mut visited);
                roots.push(&node);
            }
        }

        roots.into()
    }

    /// Load a library from JSON, flattening all elements to polygons.
    ///
    /// This method parses a JSON-serialized `rosette_core::Library` and creates
    /// a new `WasmLibrary` with all elements flattened to polygons:
    /// - Path elements are converted to polygon ribbons using their width
    /// - Cell references are expanded with their transforms applied
    /// - Text elements are skipped (not rendered)
    ///
    /// This flattening makes the design ready for rendering in the web viewer.
    ///
    /// # Arguments
    /// * `json` - JSON string containing a serialized Library
    ///
    /// # Returns
    /// A new WasmLibrary with a single "flattened" cell containing all polygons.
    ///
    /// # Errors
    /// Returns a JsValue error if parsing fails.
    pub fn from_json(json: &str) -> Result<WasmLibrary, JsValue> {
        let library: Library = rosette_io::json::from_string(json)
            .map_err(|e| JsValue::from_str(&format!("JSON parse error: {}", e)))?;

        // Create a new library with a flattened cell
        let mut wasm_lib = WasmLibrary::new(library.name());
        wasm_lib.add_cell("flattened")?;
        wasm_lib.set_active_cell("flattened");

        // Scale factor: SDK uses micrometers, app world units = nm * GRID_SIZE
        // 1 μm = 1000 nm, and 1 nm = GRID_SIZE world units.
        // Y is negated: GDS/SDK use math convention (Y-up), renderer uses screen (Y-down).
        const UM_TO_NM: f64 = 1000.0;
        const GRID_SIZE: f64 = 50.0;
        let s = UM_TO_NM * GRID_SIZE;
        let scale_transform = Transform::scale(s, -s);

        // Flatten all cells into the single "flattened" cell
        if let Some(top_cell) = library.top_cell() {
            wasm_lib.flatten_cell_recursive(top_cell, &library, &scale_transform);
        }

        Ok(wasm_lib)
    }

    /// Export the library to JSON.
    ///
    /// # Returns
    /// A JSON string representation of the library.
    ///
    /// # Errors
    /// Returns a JsValue error if serialization fails.
    pub fn to_json(&self) -> Result<String, JsValue> {
        rosette_io::json::to_string(&self.library)
            .map_err(|e| JsValue::from_str(&format!("JSON serialize error: {}", e)))
    }

    /// Load a full hierarchical library from JSON without flattening.
    ///
    /// Unlike [`from_json`] which flattens the hierarchy into a single cell,
    /// this preserves all cells, cell references, paths, and text elements.
    /// Coordinates are converted from the SDK convention (micrometers, Y-up)
    /// to app world coordinates (GRID_SIZE units per nm, Y-down).
    ///
    /// This is the load path for Tauri desktop mode where the user opens a
    /// GDS file and wants to edit it hierarchically then save back.
    ///
    /// # Arguments
    /// * `json` - JSON string containing a serialized Library (in micrometers)
    ///
    /// # Returns
    /// A new WasmLibrary with the full cell hierarchy preserved.
    ///
    /// # Errors
    /// Returns a JsValue error if parsing fails.
    pub fn from_library_json(json: &str) -> Result<WasmLibrary, JsValue> {
        let library: Library = rosette_io::json::from_string(json)
            .map_err(|e| JsValue::from_str(&format!("JSON parse error: {}", e)))?;

        Ok(Self::init_from_library(library))
    }

    /// Create a WasmLibrary directly from raw GDS binary bytes.
    ///
    /// This is the fast path for the Tauri desktop app: the raw file bytes
    /// are passed directly to WASM, avoiding the JSON serialization round-trip
    /// that `from_library_json` requires.
    pub fn from_gds_bytes(bytes: &[u8]) -> Result<WasmLibrary, JsValue> {
        let library = rosette_io::gds::read_bytes(bytes)
            .map_err(|e| JsValue::from_str(&format!("GDS parse error: {}", e)))?;

        Ok(Self::init_from_library(library))
    }

    /// Shared initialization: transform coordinates, build element refs, set active cell.
    ///
    /// Takes a `Library` in SDK coordinates (micrometers, Y-up) and produces a
    /// fully initialized `WasmLibrary` in world coordinates (nm * GRID_SIZE, Y-down).
    fn init_from_library(mut library: Library) -> WasmLibrary {
        // Scale factor: SDK uses micrometers, app world units = nm * GRID_SIZE.
        // 1 μm = 1000 nm, and 1 nm = GRID_SIZE world units.
        // Y is negated: GDS/SDK use math convention (Y-up), renderer uses screen (Y-down).
        const UM_TO_NM: f64 = 1000.0;
        const GRID_SIZE: f64 = 50.0;
        let s = UM_TO_NM * GRID_SIZE;

        // Pre-compute the flip transforms once (used for CellRef conjugation)
        let flip = Transform::scale(s, -s);
        let flip_inv = Transform::scale(1.0 / s, -1.0 / s);

        // Transform all elements in every cell from um/Y-up to world/Y-down.
        // Iterate cells by index to avoid O(C^2) name lookups.
        for cell in library.cells_mut() {
            // Transform the cell origin
            let origin = cell.origin();
            cell.set_origin(Point::new(origin.x * s, -origin.y * s));

            // Transform all elements in-place
            for element in cell.elements_mut() {
                match element {
                    Element::Polygon { polygon, .. } => {
                        for v in polygon.vertices_mut() {
                            let x = v.x * s;
                            let y = -v.y * s;
                            *v = Point::new(x, y);
                        }
                    }
                    Element::Path { points, width, .. } => {
                        for p in points.iter_mut() {
                            let x = p.x * s;
                            let y = -p.y * s;
                            *p = Point::new(x, y);
                        }
                        *width *= s;
                    }
                    Element::CellRef(cell_ref) => {
                        // Conjugate the CellRef transform by the coordinate change S.
                        // CellRef transform T maps child→parent in um/Y-up.
                        // In world/Y-down: T_new = S * T * S^{-1}
                        // This correctly converts translation, rotation, and mirror.
                        cell_ref.transform = flip.then(&cell_ref.transform).then(&flip_inv);

                        // Scale repetition spacing (in parent cell's coordinate space).
                        // col_spacing is X-direction (just scale), row_spacing is
                        // Y-direction (scale + negate for Y-flip).
                        if let Some(ref mut rep) = cell_ref.repetition {
                            rep.col_spacing *= s;
                            rep.row_spacing *= -s;
                        }
                    }
                    Element::Text {
                        position, height, ..
                    } => {
                        *position = Point::new(position.x * s, -position.y * s);
                        *height *= s;
                    }
                }
            }
        }

        // Count total elements across all cells for pre-allocation (Opt 2)
        let total_elements: usize = library.cells().iter().map(|c| c.elements().len()).sum();

        // Build element_refs for all cells.
        // Pre-allocate HashMap to avoid ~17 resize/rehash cycles (Opt 2).
        // Iterate cells directly by slice to avoid O(C^2) name lookups (Opt 4).
        let mut element_refs = HashMap::with_capacity(total_elements);
        for cell in library.cells() {
            let cell_name = cell.name().to_string();
            for i in 0..cell.elements().len() {
                let uuid = Uuid::new_v4().to_string();
                element_refs.insert(
                    uuid,
                    ElementRef {
                        cell_name: cell_name.clone(),
                        element_index: i,
                    },
                );
            }
        }

        // Set active cell to top cell (last cell in the list)
        let active_cell = library.top_cell().map(|c| c.name().to_string());

        WasmLibrary {
            library,
            active_cell,
            element_refs,
            layer_colors: HashMap::new(),
            layer_fill_patterns: HashMap::new(),
            dirty: false,
            hole_indices_map: HashMap::new(),
            hierarchy_depth_limit: 0,
        }
    }

    /// Export the library as GDS II binary bytes.
    ///
    /// Coordinates are converted back from app world coordinates
    /// (GRID_SIZE units per nm, Y-down) to GDS convention (micrometers, Y-up).
    ///
    /// # Returns
    /// A `Uint8Array` containing the GDS binary data.
    ///
    /// # Errors
    /// Returns a JsValue error if serialization fails.
    pub fn to_gds(&self) -> Result<Vec<u8>, JsValue> {
        // Clone the library and apply inverse coordinate transform
        let mut library = self.library.clone();

        // Inverse scale: world -> um. s = UM_TO_NM * GRID_SIZE = 50000
        const UM_TO_NM: f64 = 1000.0;
        const GRID_SIZE: f64 = 50.0;
        let s = UM_TO_NM * GRID_SIZE;
        let inv = 1.0 / s;
        let inv_flip = Transform::scale(inv, -inv);
        let flip = Transform::scale(s, -s);

        for cell in library.cells_mut() {
            let origin = cell.origin();
            cell.set_origin(Point::new(origin.x * inv, -origin.y * inv));

            for element in cell.elements_mut() {
                match element {
                    Element::Polygon { polygon, .. } => {
                        for v in polygon.vertices_mut() {
                            let x = v.x * inv;
                            let y = -v.y * inv;
                            *v = Point::new(x, y);
                        }
                    }
                    Element::Path { points, width, .. } => {
                        for p in points.iter_mut() {
                            let x = p.x * inv;
                            let y = -p.y * inv;
                            *p = Point::new(x, y);
                        }
                        *width *= inv;
                    }
                    Element::CellRef(cell_ref) => {
                        // Inverse conjugation: T_original = S^{-1} * T_stored * S
                        cell_ref.transform = inv_flip.then(&cell_ref.transform).then(&flip);

                        if let Some(ref mut rep) = cell_ref.repetition {
                            rep.col_spacing *= inv;
                            rep.row_spacing *= -inv;
                        }
                    }
                    Element::Text {
                        position, height, ..
                    } => {
                        *position = Point::new(position.x * inv, -position.y * inv);
                        *height *= inv;
                    }
                }
            }
        }

        rosette_io::gds::write_bytes(&library)
            .map_err(|e| JsValue::from_str(&format!("GDS write error: {}", e)))
    }

    /// Export the library to JSON with coordinates in micrometers (GDS convention).
    ///
    /// This is used by the Tauri backend to write GDS files: the frontend sends
    /// this JSON to the backend, which deserializes and writes via `gds::write_library`.
    ///
    /// # Returns
    /// A JSON string with coordinates converted back to micrometers/Y-up.
    ///
    /// # Errors
    /// Returns a JsValue error if serialization fails.
    pub fn to_library_json(&self) -> Result<String, JsValue> {
        // Clone the library and apply inverse coordinate transform
        let mut library = self.library.clone();

        const UM_TO_NM: f64 = 1000.0;
        const GRID_SIZE: f64 = 50.0;
        let s = UM_TO_NM * GRID_SIZE;
        let inv = 1.0 / s;
        let inv_flip = Transform::scale(inv, -inv);
        let flip = Transform::scale(s, -s);

        for cell in library.cells_mut() {
            let origin = cell.origin();
            cell.set_origin(Point::new(origin.x * inv, -origin.y * inv));

            for element in cell.elements_mut() {
                match element {
                    Element::Polygon { polygon, .. } => {
                        for v in polygon.vertices_mut() {
                            let x = v.x * inv;
                            let y = -v.y * inv;
                            *v = Point::new(x, y);
                        }
                    }
                    Element::Path { points, width, .. } => {
                        for p in points.iter_mut() {
                            let x = p.x * inv;
                            let y = -p.y * inv;
                            *p = Point::new(x, y);
                        }
                        *width *= inv;
                    }
                    Element::CellRef(cell_ref) => {
                        // Inverse conjugation: T_original = S^{-1} * T_stored * S
                        cell_ref.transform = inv_flip.then(&cell_ref.transform).then(&flip);

                        if let Some(ref mut rep) = cell_ref.repetition {
                            rep.col_spacing *= inv;
                            rep.row_spacing *= -inv;
                        }
                    }
                    Element::Text {
                        position, height, ..
                    } => {
                        *position = Point::new(position.x * inv, -position.y * inv);
                        *height *= inv;
                    }
                }
            }
        }

        rosette_io::json::to_string(&library)
            .map_err(|e| JsValue::from_str(&format!("JSON serialize error: {}", e)))
    }

    /// Get all polygons for rendering.
    ///
    /// Returns a JS array of [id, vertices, color] tuples where:
    /// - id: UUID string
    /// - vertices: array of [x, y] pairs
    /// - color: [r, g, b, a] with values 0.0-1.0
    ///
    /// # Errors
    /// Returns a JsValue error if serialization fails.
    pub fn get_render_polygons(&self) -> Result<JsValue, JsValue> {
        let polygons = self.get_render_polygons_internal();

        serde_wasm_bindgen::to_value(&polygons)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }

    // =========================================================================
    // Boolean / CSG Operations
    // =========================================================================

    /// Perform a boolean operation on polygon elements.
    ///
    /// Supported operations: `"union"`, `"subtract"`, `"intersect"`, `"xor"`.
    ///
    /// For `"subtract"`, the element identified by `base_id` is the shape
    /// from which all others are subtracted. For other operations, `base_id`
    /// is ignored and all shapes are combined.
    ///
    /// Only polygon elements are supported — text labels and cell references
    /// are silently skipped. The input polygons are removed and replaced with
    /// the result polygon(s).
    ///
    /// Returns the UUIDs of the newly created result polygons, or an empty
    /// array if the operation cannot be performed.
    pub fn boolean_operation(
        &mut self,
        ids: Vec<String>,
        operation: &str,
        base_id: &str,
    ) -> Vec<String> {
        use geo::algorithm::bool_ops::BooleanOps;
        use geo::{Coord, LineString, MultiPolygon, Polygon as GeoPolygon};

        // Gather polygon data: (uuid, geo_polygon, layer, datatype)
        let mut polys: Vec<(String, GeoPolygon<f64>, u16, u16)> = Vec::new();

        for id in &ids {
            // Skip synthetic ref UUIDs (cell instances)
            if id.starts_with(REF_UUID_PREFIX) {
                continue;
            }
            let elem_ref = match self.element_refs.get(id) {
                Some(r) => r.clone(),
                None => continue,
            };
            let cell = match self.library.cell(&elem_ref.cell_name) {
                Some(c) => c,
                None => continue,
            };
            match cell.elements().get(elem_ref.element_index) {
                Some(Element::Polygon { polygon, layer }) => {
                    let coords: Vec<Coord<f64>> = polygon
                        .vertices()
                        .iter()
                        .map(|p| Coord { x: p.x, y: p.y })
                        .collect();
                    let geo_poly = GeoPolygon::new(LineString::new(coords), vec![]);
                    polys.push((id.clone(), geo_poly, layer.number, layer.datatype));
                }
                _ => continue, // Skip text, cell refs, paths
            }
        }

        if polys.len() < 2 {
            return Vec::new();
        }

        // Use the layer from the base element (for subtract) or first element
        let result_layer;
        let result_datatype;

        // Order polygons: for subtract, base_id goes first
        if operation == "subtract" {
            if let Some(pos) = polys.iter().position(|(id, _, _, _)| id == base_id) {
                polys.swap(0, pos);
            }
            result_layer = polys[0].2;
            result_datatype = polys[0].3;
        } else {
            result_layer = polys[0].2;
            result_datatype = polys[0].3;
        }

        // Perform the boolean operation by pairwise reduction
        let mut result: MultiPolygon<f64> = MultiPolygon::new(vec![polys[0].1.clone()]);

        for (_id, geo_poly, _layer, _dt) in polys.iter().skip(1) {
            let next = MultiPolygon::new(vec![geo_poly.clone()]);
            result = match operation {
                "union" => result.union(&next),
                "subtract" => result.difference(&next),
                "intersect" => result.intersection(&next),
                "xor" => result.xor(&next),
                _ => return Vec::new(),
            };
        }

        // Remove input elements
        let input_ids: Vec<String> = polys.iter().map(|(id, _, _, _)| id.clone()).collect();
        self.remove_elements(input_ids);

        // Convert result MultiPolygon back to rosette polygons and add them
        let mut new_ids: Vec<String> = Vec::new();

        for geo_poly in result.iter() {
            let exterior_coords: Vec<[f64; 2]> =
                geo_poly.exterior().coords().map(|c| [c.x, c.y]).collect();

            // Strip closing point if present (geo closes polygons, rosette doesn't)
            let exterior =
                if exterior_coords.len() > 1 && exterior_coords.first() == exterior_coords.last() {
                    &exterior_coords[..exterior_coords.len() - 1]
                } else {
                    &exterior_coords[..]
                };

            if exterior.len() < 3 {
                continue;
            }

            let holes: Vec<Vec<[f64; 2]>> = geo_poly
                .interiors()
                .iter()
                .map(|ring| {
                    let mut coords: Vec<[f64; 2]> = ring.coords().map(|c| [c.x, c.y]).collect();
                    // Strip closing point
                    if coords.len() > 1 && coords.first() == coords.last() {
                        coords.pop();
                    }
                    coords
                })
                .filter(|h| h.len() >= 3)
                .collect();

            // Build final vertex list: exterior + hole rings concatenated
            let mut all_points: Vec<[f64; 2]> = exterior.to_vec();
            let mut hole_start_indices: Vec<usize> = Vec::new();

            for hole in &holes {
                hole_start_indices.push(all_points.len());
                all_points.extend_from_slice(hole);
            }

            if all_points.len() < 3 {
                continue;
            }

            // Convert to flat f64 array and add as a polygon
            // (rosette_core::Polygon stores all points — exterior + holes —
            //  as a single vertex list; the renderer uses hole_indices to
            //  tell earcutr where each hole ring begins.)
            let flat: Vec<f64> = all_points.iter().flat_map(|p| vec![p[0], p[1]]).collect();
            if let Some(uuid) = self.add_polygon(&flat, result_layer, result_datatype) {
                if !hole_start_indices.is_empty() {
                    self.hole_indices_map
                        .insert(uuid.clone(), hole_start_indices);
                }
                new_ids.push(uuid);
            }
        }

        new_ids
    }
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

    /// Recursively collect bounding boxes from a referenced cell.
    fn collect_bounds_recursive(
        &self,
        cell_name: &str,
        transform: &Transform,
        combined: &mut Option<BBox>,
    ) {
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
                    _ => {}
                }
            }
        }
    }

    /// Compute the bounding box for a CellRef instance.
    ///
    /// If the referenced cell has geometry, returns its bounding box transformed
    /// by the CellRef's transform. If the cell is empty, returns a small
    /// placeholder box centered at the CellRef's translation point so that
    /// empty instances remain visible, selectable, and labeled.
    fn instance_bbox(&self, cell_ref: &CellRef) -> BBox {
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

    /// Get all synthetic ref UUIDs for a CellRef at the given element index.
    fn get_all_ref_uuids_for_element(&self, cellref_elem_idx: usize) -> Vec<String> {
        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };
        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };
        let element = match cell.elements().get(cellref_elem_idx) {
            Some(e) => e,
            None => return Vec::new(),
        };
        if let Element::CellRef(cell_ref) = element
            && let Some(ref_cell) = self.library.cell(&cell_ref.cell_name)
        {
            let mut uuids = Vec::new();
            let mut counter: usize = 0;
            let copy_count = cell_ref.repetition.as_ref().map_or(1, |r| r.count());
            for _ in 0..copy_count {
                self.count_polygons_recursive(ref_cell, cellref_elem_idx, &mut counter, &mut uuids);
            }
            return uuids;
        }
        Vec::new()
    }

    /// Count polygons in a cell recursively, generating synthetic UUIDs.
    fn count_polygons_recursive(
        &self,
        cell: &Cell,
        cellref_elem_idx: usize,
        counter: &mut usize,
        uuids: &mut Vec<String>,
    ) {
        for element in cell.elements() {
            match element {
                Element::Polygon { .. } | Element::Path { .. } => {
                    uuids.push(format!("{REF_UUID_PREFIX}{cellref_elem_idx}:{counter}"));
                    *counter += 1;
                }
                Element::CellRef(nested_ref) => {
                    if let Some(ref_cell) = self.library.cell(&nested_ref.cell_name) {
                        let copy_count = nested_ref.repetition.as_ref().map_or(1, |r| r.count());
                        for _ in 0..copy_count {
                            self.count_polygons_recursive(
                                ref_cell,
                                cellref_elem_idx,
                                counter,
                                uuids,
                            );
                        }
                    }
                }
                Element::Text { .. } => {}
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
    /// Get the hole indices map for polygons with cutouts.
    #[allow(dead_code)] // Used by renderer.rs
    pub(crate) fn hole_indices_map(&self) -> &HashMap<String, Vec<usize>> {
        &self.hole_indices_map
    }

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

        // Render direct polygon elements (UUID-tracked).
        // Only iterate element_refs that belong to the active cell (Opt 5).
        for (uuid, elem_ref) in &self.element_refs {
            if elem_ref.cell_name != *cell_name {
                continue;
            }

            match cell.elements().get(elem_ref.element_index) {
                Some(Element::Polygon { polygon, layer }) => {
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
                Some(Element::Path {
                    points,
                    width,
                    layer,
                    ..
                }) => {
                    if let Some(ribbon) = offset_polygon(points, *width) {
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
                _ => {}
            }
        }

        // Resolve CellRef elements on-the-fly with synthetic UUIDs
        let max_depth = self.hierarchy_depth_limit;
        for (elem_idx, element) in cell.elements().iter().enumerate() {
            if let Element::CellRef(cell_ref) = element
                && let Some(ref_cell) = self.library.cell(&cell_ref.cell_name)
            {
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
                let bbox = self.instance_bbox(cell_ref);
                result.push((
                    elem_idx,
                    [bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y],
                ));
            }
        }

        result
    }

    /// Get label data for all CellRef instances in the active cell.
    ///
    /// Returns a JS array of `{ name: string, bbox: [minX, minY, maxX, maxY] }` objects
    /// for rendering labels in the UI overlay.
    pub(crate) fn get_instance_labels(&self) -> Vec<(usize, String, [f64; 4])> {
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
                let bbox = self.instance_bbox(cell_ref);
                labels.push((
                    elem_idx,
                    cell_ref.cell_name.clone(),
                    [bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y],
                ));
            }
        }

        labels
    }
}
