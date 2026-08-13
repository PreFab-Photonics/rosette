//! Cell reference (instance) operations: placement, arrays, instance labels,
//! cell bounds/preview, and the cell hierarchy tree.

use super::{CellRefInfo, ElementRef, WasmLibrary};
use rosette_core::cell::Element;
use rosette_core::geometry::BBox;
use rosette_core::{CellRef, Repetition, Transform, Vector2};
use uuid::Uuid;
use wasm_bindgen::prelude::*;

#[derive(Debug, PartialEq, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct ParentRef {
    parent: String,
    element_index: usize,
    transform: Vec<f64>,
    repetition: Option<Vec<f64>>,
}

fn parse_transform(values: &[f64]) -> Option<Transform> {
    if values.len() != 6 || !values.iter().all(|value| value.is_finite()) {
        return None;
    }
    let transform = Transform::new(
        values[0], values[1], values[2], values[3], values[4], values[5],
    );
    transform.is_invertible().then_some(transform)
}

fn parse_repetition(values: &[f64]) -> Option<Repetition> {
    if values.len() != 6 || !values.iter().all(|value| value.is_finite()) {
        return None;
    }
    let columns = values[0];
    let rows = values[1];
    if columns < 1.0
        || columns > u16::MAX as f64
        || columns.fract() != 0.0
        || rows < 1.0
        || rows > u16::MAX as f64
        || rows.fract() != 0.0
    {
        return None;
    }
    Some(Repetition::new_vectors(
        columns as u16,
        rows as u16,
        Vector2::new(values[2], values[3]),
        Vector2::new(values[4], values[5]),
    ))
}

#[wasm_bindgen]
impl WasmLibrary {
    /// Get CellRef information for a given UUID.
    ///
    /// Works with both real UUIDs and synthetic ref UUIDs.
    /// Returns None if the element is not a CellRef.
    pub fn get_cell_ref_info(&self, id: &str) -> Option<CellRefInfo> {
        let (cell_name, element_index) = self.resolve_cell_ref_id(id)?;
        let cell = self.library.cell(&cell_name)?;
        if let Some(Element::CellRef(cell_ref)) = cell.elements().get(element_index) {
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

        let t = parse_transform(&transform)?;
        let cell_ref = CellRef::with_transform(ref_cell_name.to_string(), t);

        let element_index = self
            .library
            .edit_cell(&active_name, |cell| {
                cell.add_ref(cell_ref);
                cell.elements().len() - 1
            })
            .ok()?;

        let uuid = Uuid::new_v4().to_string();
        self.element_refs.insert(
            uuid.clone(),
            ElementRef {
                cell_name: active_name,
                element_index,
            },
        );

        self.mark_dirty();
        Some(uuid)
    }

    /// Set the full affine transform on a CellRef instance.
    ///
    /// `id` may be a tokenized synthetic ref UUID or a real CellRef UUID.
    /// `transform` must be `[a, b, c, d, tx, ty]` (6 elements).
    ///
    /// Returns true if the transform was set, false otherwise.
    pub fn set_cell_ref_transform(&mut self, id: &str, transform: Vec<f64>) -> bool {
        let Some(transform) = parse_transform(&transform) else {
            return false;
        };
        let (active_cell_name, elem_idx) = match self.resolve_cell_ref_id(id) {
            Some(target) => target,
            None => return false,
        };
        let updated = self
            .library
            .edit_cell(&active_cell_name, |cell| {
                cell.edit_element(elem_idx, |element| {
                    let Element::CellRef(cell_ref) = element else {
                        return false;
                    };
                    *cell_ref = CellRef::with_transform(cell_ref.cell_name.clone(), transform)
                        .with_repetition(cell_ref.repetition);
                    true
                })
            })
            .ok()
            .and_then(Result::ok)
            .unwrap_or(false);
        if updated {
            self.mark_dirty();
        }
        updated
    }

    /// Get the array repetition parameters for a CellRef instance
    /// as scalar column/row pitches.
    ///
    /// `id` can be a tokenized synthetic ref UUID or a real element UUID.
    /// Returns `[columns, rows, col_spacing, row_spacing]` or None if not
    /// arrayed. For non-axis-aligned (skewed/hex) AREFs this collapses each
    /// lattice vector to its magnitude — callers that care about skew should
    /// use [`WasmLibrary::get_cell_ref_array_vectors`] instead.
    pub fn get_cell_ref_array(&self, id: &str) -> Option<Vec<f64>> {
        let v = self.get_cell_ref_array_vectors(id)?;
        // v = [columns, rows, col_x, col_y, row_x, row_y]
        let col_spacing = (v[2] * v[2] + v[3] * v[3]).sqrt();
        let row_spacing = (v[4] * v[4] + v[5] * v[5]).sqrt();
        Some(vec![v[0], v[1], col_spacing, row_spacing])
    }

    /// Get the full array repetition parameters for a CellRef instance,
    /// including skewed/non-orthogonal column and row displacement vectors.
    ///
    /// `id` can be a tokenized synthetic ref UUID or a real element UUID.
    /// Returns `[columns, rows, col_x, col_y, row_x, row_y]` where
    /// `(col_x, col_y)` is the column displacement vector and
    /// `(row_x, row_y)` is the row displacement vector, both in the
    /// CellRef's local (pre-transform) coordinate space.
    pub fn get_cell_ref_array_vectors(&self, id: &str) -> Option<Vec<f64>> {
        // Resolve element index from either synthetic ref UUID or real UUID
        let (cell_name, elem_idx) = self.resolve_cell_ref_id(id)?;

        let cell = self.library.cell(&cell_name)?;
        if let Some(Element::CellRef(cell_ref)) = cell.elements().get(elem_idx)
            && let Some(rep) = &cell_ref.repetition
        {
            return Some(vec![
                rep.columns as f64,
                rep.rows as f64,
                rep.col_vector.x,
                rep.col_vector.y,
                rep.row_vector.x,
                rep.row_vector.y,
            ]);
        }
        None
    }

    /// Set the array repetition parameters on a CellRef instance as an
    /// axis-aligned rectangular grid.
    ///
    /// `id` can be a tokenized synthetic ref UUID or a real element UUID.
    /// If columns and rows are both 1, removes the array (reverts to single instance).
    ///
    /// # Skew preservation
    ///
    /// If the existing AREF has a non-orthogonal (skewed/hex) lattice,
    /// this method only updates `columns` and `rows` and leaves the
    /// existing lattice vectors intact — `col_spacing` and `row_spacing`
    /// are **ignored**. This prevents a callers that still speak the
    /// scalar API from silently collapsing a hex lattice to rectangular
    /// on every edit. For skewed/hex lattices use
    /// [`WasmLibrary::set_cell_ref_array_vectors`] to update the vectors
    /// themselves.
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
        if columns == 0 || rows == 0 || !col_spacing.is_finite() || !row_spacing.is_finite() {
            return false;
        }
        let (cell_name, elem_idx) = match self.resolve_cell_ref_id(id) {
            Some(target) => target,
            None => return false,
        };

        let updated = self
            .library
            .edit_cell(&cell_name, |cell| {
                cell.edit_element(elem_idx, |element| {
                    let Element::CellRef(cell_ref) = element else {
                        return false;
                    };
                    let repetition = if columns == 1 && rows == 1 {
                        None
                    } else if let Some(existing) = cell_ref.repetition
                        && (existing.col_vector.y != 0.0 || existing.row_vector.x != 0.0)
                    {
                        Some(Repetition::new_vectors(
                            columns,
                            rows,
                            existing.col_vector,
                            existing.row_vector,
                        ))
                    } else {
                        Some(Repetition::new(columns, rows, col_spacing, row_spacing))
                    };
                    *cell_ref = cell_ref.clone().with_repetition(repetition);
                    true
                })
            })
            .ok()
            .and_then(Result::ok)
            .unwrap_or(false);
        if updated {
            self.mark_dirty();
        }
        updated
    }

    /// Set the array repetition parameters on a CellRef instance from full
    /// column and row displacement vectors (supports skewed/hex lattices).
    ///
    /// `id` can be a tokenized synthetic ref UUID or a real element UUID.
    /// `(col_x, col_y)` is the column displacement vector, `(row_x, row_y)`
    /// is the row displacement vector, both in the CellRef's local
    /// (pre-transform) coordinate space. If columns and rows are both 1,
    /// removes the array (reverts to single instance).
    ///
    /// Returns true if the array was set, false otherwise.
    #[allow(clippy::too_many_arguments)]
    pub fn set_cell_ref_array_vectors(
        &mut self,
        id: &str,
        columns: u16,
        rows: u16,
        col_x: f64,
        col_y: f64,
        row_x: f64,
        row_y: f64,
    ) -> bool {
        if columns == 0
            || rows == 0
            || ![col_x, col_y, row_x, row_y]
                .iter()
                .all(|value| value.is_finite())
        {
            return false;
        }
        // Resolve element index from either synthetic ref UUID or real UUID
        let (cell_name, elem_idx) = match self.resolve_cell_ref_id(id) {
            Some(target) => target,
            None => return false,
        };

        let updated = self
            .library
            .edit_cell(&cell_name, |cell| {
                cell.edit_element(elem_idx, |element| {
                    let Element::CellRef(cell_ref) = element else {
                        return false;
                    };
                    let repetition = if columns == 1 && rows == 1 {
                        None
                    } else {
                        Some(Repetition::new_vectors(
                            columns,
                            rows,
                            Vector2::new(col_x, col_y),
                            Vector2::new(row_x, row_y),
                        ))
                    };
                    *cell_ref = cell_ref.clone().with_repetition(repetition);
                    true
                })
            })
            .ok()
            .and_then(Result::ok)
            .unwrap_or(false);
        if updated {
            self.mark_dirty();
        }
        updated
    }

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
        self.add_cell_ref_to(&active_name.clone(), ref_cell_name, x, y)
    }

    /// Add a cell reference to a specific parent cell (without changing active cell).
    pub fn add_cell_ref_to(
        &mut self,
        parent_cell: &str,
        ref_cell_name: &str,
        x: f64,
        y: f64,
    ) -> Option<String> {
        if !x.is_finite() || !y.is_finite() {
            return None;
        }
        if parent_cell == ref_cell_name {
            return None;
        }

        if !self.library.contains(ref_cell_name) {
            return None;
        }

        if !self.can_instance_cell(parent_cell, ref_cell_name) {
            return None;
        }

        let origin = self
            .annotations
            .get(ref_cell_name)
            .map(|annotations| annotations.editor.origin)
            .unwrap_or_else(rosette_core::Point::origin);
        if !(x - origin.x).is_finite() || !(y - origin.y).is_finite() {
            return None;
        }
        let cell_ref = CellRef::with_transform(
            ref_cell_name.to_string(),
            Transform::translate(x - origin.x, y - origin.y),
        );

        let element_index = self
            .library
            .edit_cell(parent_cell, |cell| {
                cell.add_ref(cell_ref);
                cell.elements().len() - 1
            })
            .ok()?;

        let uuid = Uuid::new_v4().to_string();
        self.element_refs.insert(
            uuid.clone(),
            ElementRef {
                cell_name: parent_cell.to_string(),
                element_index,
            },
        );

        self.mark_dirty();
        Some(uuid)
    }

    /// Get all parent cells that reference a given cell, with their transforms.
    ///
    /// Returns a JS array of `{parent, elementIndex, transform, repetition}` records.
    /// `repetition` is `[columns, rows, col_x, col_y, row_x, row_y]` or null.
    pub fn get_cell_ref_parents(&self, name: &str) -> JsValue {
        serde_wasm_bindgen::to_value(&self.cell_ref_parents(name)).unwrap_or(JsValue::NULL)
    }

    fn cell_ref_parents(&self, name: &str) -> Vec<ParentRef> {
        let mut entries = Vec::new();
        for cell in self.library.cells() {
            for (element_index, element) in cell.elements().iter().enumerate() {
                if let Element::CellRef(cell_ref) = element
                    && cell_ref.cell_name == name
                {
                    let t = &cell_ref.transform;
                    entries.push(ParentRef {
                        parent: cell.name().to_string(),
                        element_index,
                        transform: vec![t.a, t.b, t.c, t.d, t.tx, t.ty],
                        repetition: cell_ref.repetition.map(|repetition| {
                            vec![
                                repetition.columns as f64,
                                repetition.rows as f64,
                                repetition.col_vector.x,
                                repetition.col_vector.y,
                                repetition.row_vector.x,
                                repetition.row_vector.y,
                            ]
                        }),
                    });
                }
            }
        }
        entries
    }

    /// Add a CellRef to a specific parent cell with a full affine transform.
    ///
    /// Like `add_cell_ref_to` but accepts a full [a, b, c, d, tx, ty] transform
    /// and optional repetition vectors.
    pub fn add_cell_ref_to_with_transform(
        &mut self,
        parent_cell: &str,
        ref_cell_name: &str,
        transform: Vec<f64>,
        repetition: Option<Vec<f64>>,
    ) -> Option<String> {
        if parent_cell == ref_cell_name {
            return None;
        }
        if !self.library.contains(ref_cell_name) {
            return None;
        }
        if !self.can_instance_cell(parent_cell, ref_cell_name) {
            return None;
        }

        self.restore_cell_ref_to_with_transform(parent_cell, ref_cell_name, transform, repetition)
    }

    /// Restore a CellRef in the active cell without rejecting imported cycles.
    ///
    /// This is reserved for undo of previously accepted hierarchy data.
    pub fn restore_cell_ref_with_transform(
        &mut self,
        ref_cell_name: &str,
        transform: Vec<f64>,
        repetition: Option<Vec<f64>>,
    ) -> Option<String> {
        let parent_cell = self.active_cell.clone()?;
        self.restore_cell_ref_to_with_transform(&parent_cell, ref_cell_name, transform, repetition)
    }

    /// Restore a CellRef in a named parent without rejecting imported cycles.
    ///
    /// This is reserved for undo of previously accepted hierarchy data.
    pub fn restore_cell_ref_to_with_transform(
        &mut self,
        parent_cell: &str,
        ref_cell_name: &str,
        transform: Vec<f64>,
        repetition: Option<Vec<f64>>,
    ) -> Option<String> {
        let element_index = self.library.cell(parent_cell)?.elements().len();
        self.restore_cell_ref_to_with_transform_at(
            parent_cell,
            ref_cell_name,
            transform,
            repetition,
            element_index,
        )
    }

    /// Restore a CellRef at its original element index without rejecting
    /// imported cycles or dangling targets.
    pub fn restore_cell_ref_to_with_transform_at(
        &mut self,
        parent_cell: &str,
        ref_cell_name: &str,
        transform: Vec<f64>,
        repetition: Option<Vec<f64>>,
        element_index: usize,
    ) -> Option<String> {
        if ref_cell_name.is_empty() || !self.library.contains(parent_cell) {
            return None;
        }

        let current_len = self.library.cell(parent_cell)?.elements().len();
        if element_index > current_len {
            return None;
        }

        let t = parse_transform(&transform)?;
        let repetition = match repetition {
            Some(values) => Some(parse_repetition(&values)?),
            None => None,
        };
        let cell_ref =
            CellRef::with_transform(ref_cell_name.to_string(), t).with_repetition(repetition);

        let inserted = self
            .library
            .edit_cell(parent_cell, |cell| {
                cell.add_ref(cell_ref);
                if cell
                    .edit_elements(|elements| elements[element_index..].rotate_right(1))
                    .is_err()
                {
                    cell.remove_element(current_len);
                    return false;
                }
                true
            })
            .ok()?;
        if !inserted {
            return None;
        }

        for element_ref in self.element_refs.values_mut() {
            if element_ref.cell_name == parent_cell && element_ref.element_index >= element_index {
                element_ref.element_index += 1;
            }
        }

        let uuid = Uuid::new_v4().to_string();
        self.element_refs.insert(
            uuid.clone(),
            ElementRef {
                cell_name: parent_cell.to_string(),
                element_index,
            },
        );

        self.mark_dirty();
        Some(uuid)
    }

    /// Get the bounding box of a cell's geometry (for drag preview).
    ///
    /// Returns `[minX, minY, maxX, maxY]` or None if the cell is empty/not found.
    /// Includes flattened CellRef geometry.
    pub fn get_cell_bounds(&self, cell_name: &str) -> Option<Vec<f64>> {
        // Verify the cell exists
        self.library.cell(cell_name)?;

        let mut combined_bbox: Option<BBox> = None;
        self.collect_bounds_recursive(cell_name, &Transform::identity(), &[], &mut combined_bbox);
        combined_bbox.map(|bbox| vec![bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y])
    }

    /// Get preview polygons for a cell reference at a given position.
    ///
    /// Returns a JS array of `{ vertices: number[], color: [r, g, b, a] }` objects
    /// suitable for rendering a preview during drag-and-drop.
    pub fn get_cell_preview_polygons(&self, cell_name: &str, x: f64, y: f64) -> JsValue {
        if !x.is_finite() || !y.is_finite() {
            return JsValue::NULL;
        }
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
    /// - `columns`, `rows` (optional): array repetition dimensions, present only for AREFs
    pub fn get_instance_label_data(&self) -> JsValue {
        let labels = self.get_instance_labels();
        let result = js_sys::Array::new();

        for (id, elem_idx, name, bbox, rep) in labels {
            let obj = js_sys::Object::new();
            js_sys::Reflect::set(&obj, &JsValue::from_str("id"), &JsValue::from_str(&id)).ok();
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
            if let Some((columns, rows)) = rep {
                js_sys::Reflect::set(
                    &obj,
                    &JsValue::from_str("columns"),
                    &JsValue::from_f64(columns as f64),
                )
                .ok();
                js_sys::Reflect::set(
                    &obj,
                    &JsValue::from_str("rows"),
                    &JsValue::from_f64(rows as f64),
                )
                .ok();
            }
            result.push(&obj);
        }

        result.into()
    }

    /// Collect all `(cell_name, transform)` pairs for cells referenced
    /// (directly or transitively) by the active cell.
    ///
    /// Returns a JS array of `{ cellName: string, transform: Float64Array }`
    /// objects. Each entry represents a cell instance with its accumulated
    /// world-space transform. Used by the JS-side image overlay to render
    /// images belonging to child cells at their instance positions.
    pub fn get_instance_cell_contexts(&self) -> JsValue {
        let contexts = self.instance_cell_contexts_internal();

        // Convert to JS array of { cellName, transform }
        let result = js_sys::Array::new();
        for (name, t) in &contexts {
            let obj = js_sys::Object::new();
            js_sys::Reflect::set(
                &obj,
                &JsValue::from_str("cellName"),
                &JsValue::from_str(name),
            )
            .ok();
            let transform = js_sys::Float64Array::new_with_length(6);
            transform.copy_from(t);
            js_sys::Reflect::set(&obj, &JsValue::from_str("transform"), &transform.into()).ok();
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

        serde_wasm_bindgen::to_value(&self.cell_tree_nodes()).unwrap_or(JsValue::NULL)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn placement_coordinates_position_the_child_origin() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        assert!(library.set_cell_origin(10.0, 20.0));
        library.add_cell("parent").unwrap();
        assert!(library.set_active_cell("parent"));

        library.add_cell_ref("child", 100.0, 200.0).unwrap();
        let parent = library.library.cell("parent").unwrap();
        let cell_ref = parent.cell_refs().next().unwrap();
        assert_eq!(
            (cell_ref.transform.tx, cell_ref.transform.ty),
            (90.0, 180.0)
        );
        let placed_origin = cell_ref
            .transform
            .apply(rosette_core::Point::new(10.0, 20.0));
        assert_eq!(placed_origin, rosette_core::Point::new(100.0, 200.0));
    }

    #[test]
    fn empty_aref_bounds_cover_each_transformed_origin() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        assert!(library.set_cell_origin(10.0, 20.0));
        library.add_cell("parent").unwrap();
        assert!(library.set_active_cell("parent"));

        let id = library.add_cell_ref("child", 100.0, 200.0).unwrap();
        assert!(library.set_cell_ref_array_vectors(&id, 2, 1, 50.0, 0.0, 0.0, 0.0));
        let cell_ref = library
            .library
            .cell("parent")
            .unwrap()
            .cell_refs()
            .next()
            .unwrap();
        let bbox = library.compute_instance_bbox("parent", cell_ref).unwrap();
        assert_eq!((bbox.min().x, bbox.min().y), (-400.0, -300.0));
        assert_eq!((bbox.max().x, bbox.max().y), (650.0, 700.0));
    }

    #[test]
    fn overflowed_empty_instance_origins_have_no_bounds_or_spatial_entries() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        assert!(library.set_cell_origin(f64::MAX, 0.0));
        library.add_cell("parent").unwrap();
        assert!(library.set_active_cell("parent"));
        let real_id = library
            .add_cell_ref_with_transform("child", vec![2.0, 0.0, 0.0, 1.0, 0.0, 0.0])
            .unwrap();
        let synthetic_id = library.get_canonical_element_id(&real_id).unwrap();
        let cell_ref = library
            .library
            .cell("parent")
            .unwrap()
            .cell_refs()
            .next()
            .unwrap();

        assert!(library.compute_instance_bbox("parent", cell_ref).is_none());
        assert!(library.get_instance_bboxes().is_empty());
        assert!(library.get_instance_labels().is_empty());
        assert!(library.get_bounds_for_ids(vec![synthetic_id]).is_none());
        assert!(library.hit_test_rect(-1.0, -1.0, 1.0, 1.0).is_empty());
    }

    #[test]
    fn image_contexts_skip_overflowed_and_noninvertible_accumulated_transforms() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("array_child").unwrap();
        library.add_cell("array_parent").unwrap();
        assert!(library.set_active_cell("array_parent"));
        let id = library
            .add_cell_ref_with_transform("array_child", vec![2.0, 0.0, 0.0, 1.0, 0.0, 0.0])
            .unwrap();
        assert!(library.set_cell_ref_array_vectors(&id, 2, 1, f64::MAX, 0.0, 0.0, 0.0));

        let contexts = library.instance_cell_contexts_internal();
        assert_eq!(contexts.len(), 1);
        assert!(contexts[0].1.iter().all(|value| value.is_finite()));

        let mut library = WasmLibrary::new("test");
        library.add_cell("leaf").unwrap();
        library.add_cell("middle").unwrap();
        assert!(library.set_active_cell("middle"));
        library
            .add_cell_ref_with_transform("leaf", vec![f64::MIN_POSITIVE, 0.0, 0.0, 1.0, 0.0, 0.0])
            .unwrap();
        library.add_cell("top").unwrap();
        assert!(library.set_active_cell("top"));
        library
            .add_cell_ref_with_transform("middle", vec![f64::MIN_POSITIVE, 0.0, 0.0, 1.0, 0.0, 0.0])
            .unwrap();

        let contexts = library.instance_cell_contexts_internal();
        assert_eq!(contexts.len(), 1);
        let transform = Transform::new(
            contexts[0].1[0],
            contexts[0].1[1],
            contexts[0].1[2],
            contexts[0].1[3],
            contexts[0].1[4],
            contexts[0].1[5],
        );
        assert!(transform.is_finite());
        assert!(transform.is_invertible());
    }

    #[test]
    fn transformed_ref_restoration_preserves_repetition() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_cell("parent").unwrap();

        library
            .add_cell_ref_to_with_transform(
                "parent",
                "child",
                vec![1.0, 0.0, 0.0, 1.0, 10.0, 20.0],
                Some(vec![3.0, 2.0, 8.0, 1.0, 2.0, 6.0]),
            )
            .unwrap();

        let cell_ref = library
            .library
            .cell("parent")
            .unwrap()
            .cell_refs()
            .next()
            .unwrap();
        let repetition = cell_ref.repetition.unwrap();
        assert_eq!((repetition.columns, repetition.rows), (3, 2));
        assert_eq!(repetition.col_vector, Vector2::new(8.0, 1.0));
        assert_eq!(repetition.row_vector, Vector2::new(2.0, 6.0));
    }

    #[test]
    fn restore_api_preserves_preexisting_self_references() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("self_ref").unwrap();
        assert!(library.set_active_cell("self_ref"));

        assert!(
            library
                .restore_cell_ref_with_transform(
                    "self_ref",
                    vec![1.0, 0.0, 0.0, 1.0, 0.0, 0.0],
                    None,
                )
                .is_some()
        );
        assert_eq!(library.library.cell("self_ref").unwrap().ref_count(), 1);
    }

    #[test]
    fn invalid_ref_edits_are_atomic_and_do_not_dirty() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_cell("parent").unwrap();
        assert!(library.set_active_cell("parent"));
        let id = library.add_cell_ref("child", 10.0, 20.0).unwrap();
        let synthetic_id = library.get_canonical_element_id(&id).unwrap();
        library.mark_clean();

        assert!(
            !library.set_cell_ref_transform(&synthetic_id, vec![1.0, 0.0, 0.0, 0.0, 30.0, 40.0])
        );
        assert!(!library.set_cell_ref_array(&synthetic_id, 0, 2, 5.0, 6.0));
        assert!(!library.set_cell_ref_array_vectors(&synthetic_id, 2, 2, f64::NAN, 0.0, 0.0, 6.0,));

        let cell_ref = library
            .library
            .cell("parent")
            .unwrap()
            .cell_refs()
            .next()
            .unwrap();
        assert_eq!(cell_ref.transform, Transform::translate(10.0, 20.0));
        assert!(cell_ref.repetition.is_none());
        assert!(!library.is_dirty());
    }

    #[test]
    fn valid_transform_and_repetition_edits_preserve_the_element_id() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_cell("parent").unwrap();
        assert!(library.set_active_cell("parent"));
        let id = library.add_cell_ref("child", 0.0, 0.0).unwrap();
        let element_index = library.get_element_index(&id);
        let synthetic_id = library.get_canonical_element_id(&id).unwrap();

        assert!(
            library.set_cell_ref_transform(&synthetic_id, vec![0.0, 1.0, -1.0, 0.0, 30.0, 40.0])
        );
        assert!(library.set_cell_ref_array_vectors(&synthetic_id, 3, 2, 8.0, 1.0, 2.0, 6.0,));

        assert_eq!(library.get_element_index(&id), element_index);
        assert_eq!(
            library.get_cell_ref_array_vectors(&synthetic_id),
            Some(vec![3.0, 2.0, 8.0, 1.0, 2.0, 6.0])
        );
        assert_eq!(
            library
                .get_cell_ref_info(&synthetic_id)
                .unwrap()
                .transform(),
            vec![0.0, 1.0, -1.0, 0.0, 30.0, 40.0]
        );
        assert_eq!(
            library.translate_elements(vec![synthetic_id.clone()], 5.0, -2.0),
            1
        );
        assert_eq!(
            library
                .get_cell_ref_info(&synthetic_id)
                .unwrap()
                .transform(),
            vec![0.0, 1.0, -1.0, 0.0, 35.0, 38.0]
        );
        assert_eq!(
            library.get_cell_ref_array_vectors(&synthetic_id),
            Some(vec![3.0, 2.0, 8.0, 1.0, 2.0, 6.0])
        );
    }

    #[test]
    fn restore_api_accepts_dangling_references_but_rejects_invalid_numbers() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("parent").unwrap();

        assert!(
            library
                .restore_cell_ref_to_with_transform(
                    "parent",
                    "missing",
                    vec![1.0, 0.0, 0.0, 1.0, 2.0, 3.0],
                    Some(vec![2.0, 3.0, 8.0, 1.0, 2.0, 6.0]),
                )
                .is_some()
        );
        assert!(
            library
                .restore_cell_ref_to_with_transform(
                    "parent",
                    "missing",
                    vec![1.0, 0.0, 0.0, 1.0, 2.0, 3.0],
                    Some(vec![0.0, 3.0, 8.0, 1.0, 2.0, 6.0]),
                )
                .is_none()
        );
        assert_eq!(library.library.cell("parent").unwrap().ref_count(), 1);
    }

    #[test]
    fn indexed_restore_reinstates_order_and_shifts_surviving_ids() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_cell("other").unwrap();
        library.add_cell("parent").unwrap();
        assert!(library.set_active_cell("parent"));

        let first_id = library
            .add_polygon(&[0.0, 0.0, 1.0, 0.0, 1.0, 1.0], 1, 0)
            .unwrap();
        let trailing_id = library.add_text("tail", 0.0, 0.0, 1.0, 2, 0).unwrap();

        let restored_id = library
            .restore_cell_ref_to_with_transform_at(
                "parent",
                "child",
                vec![1.0, 0.0, 0.0, 1.0, 10.0, 20.0],
                Some(vec![2.0, 3.0, 8.0, 1.0, 2.0, 6.0]),
                1,
            )
            .unwrap();

        assert_eq!(library.get_element_index(&first_id), 0);
        assert_eq!(library.get_element_index(&restored_id), 1);
        assert_eq!(library.get_element_index(&trailing_id), 2);
        let elements = library.library.cell("parent").unwrap().elements();
        assert!(matches!(elements[0], Element::Polygon { .. }));
        assert!(matches!(elements[1], Element::CellRef(_)));
        assert!(matches!(elements[2], Element::Text { .. }));
        assert!(
            library
                .restore_cell_ref_to_with_transform_at(
                    "parent",
                    "other",
                    vec![1.0, 0.0, 0.0, 1.0, 0.0, 0.0],
                    None,
                    4,
                )
                .is_none()
        );
        assert_eq!(library.library.cell("parent").unwrap().elements().len(), 3);
    }

    #[test]
    fn parent_snapshots_include_original_element_indices() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_cell("parent").unwrap();
        assert!(library.set_active_cell("parent"));
        library
            .add_polygon(&[0.0, 0.0, 1.0, 0.0, 1.0, 1.0], 1, 0)
            .unwrap();
        library.add_cell_ref("child", 0.0, 0.0).unwrap();
        library.add_text("middle", 0.0, 0.0, 1.0, 2, 0).unwrap();
        library.add_cell_ref("child", 1.0, 2.0).unwrap();

        let parents = library.cell_ref_parents("child");
        assert_eq!(parents.len(), 2);
        assert_eq!(parents[0].element_index, 1);
        assert_eq!(parents[1].element_index, 3);
    }

    #[test]
    fn cell_tree_exposes_rootless_cycle_components_and_omits_dangling_targets() {
        let mut library = WasmLibrary::new("test");
        for name in ["A", "B", "C", "D", "dangling_parent"] {
            library.add_cell(name).unwrap();
        }
        library
            .restore_cell_ref_to_with_transform("A", "B", vec![1.0, 0.0, 0.0, 1.0, 0.0, 0.0], None)
            .unwrap();
        library
            .restore_cell_ref_to_with_transform("B", "A", vec![1.0, 0.0, 0.0, 1.0, 0.0, 0.0], None)
            .unwrap();
        library
            .restore_cell_ref_to_with_transform("C", "D", vec![1.0, 0.0, 0.0, 1.0, 0.0, 0.0], None)
            .unwrap();
        library
            .restore_cell_ref_to_with_transform("D", "C", vec![1.0, 0.0, 0.0, 1.0, 0.0, 0.0], None)
            .unwrap();
        library
            .restore_cell_ref_to_with_transform(
                "dangling_parent",
                "missing",
                vec![1.0, 0.0, 0.0, 1.0, 0.0, 0.0],
                None,
            )
            .unwrap();

        let tree = library.cell_tree_nodes();
        assert_eq!(
            tree.iter()
                .map(|node| node.name.as_str())
                .collect::<Vec<_>>(),
            vec!["dangling_parent", "A", "C"]
        );
        assert!(tree[0].children.is_empty());
        assert_eq!(tree[1].children[0].name, "B");
        assert!(tree[1].children[0].children.is_empty());
        assert_eq!(tree[2].children[0].name, "D");
        assert!(tree[2].children[0].children.is_empty());
    }
}
