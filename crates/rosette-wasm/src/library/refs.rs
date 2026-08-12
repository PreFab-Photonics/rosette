//! Cell reference (instance) operations: placement, arrays, instance labels,
//! cell bounds/preview, and the cell hierarchy tree.

use super::{CellRefInfo, ElementRef, WasmLibrary, array_transforms, parse_ref_uuid_element_index};
use rosette_core::cell::Element;
use rosette_core::geometry::BBox;
use rosette_core::{CellRef, Repetition, Transform, Vector2};
use uuid::Uuid;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl WasmLibrary {
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

        let element_index = self.library.edit_cell(&active_name, |cell| {
            cell.add_ref(cell_ref);
            cell.elements().len() - 1
        })?;

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
        let updated = self
            .library
            .edit_cell(&active_cell_name, |cell| {
                let Some(Element::CellRef(cell_ref)) = cell.elements_mut().get_mut(elem_idx) else {
                    return false;
                };
                cell_ref.transform = Transform::new(
                    transform[0],
                    transform[1],
                    transform[2],
                    transform[3],
                    transform[4],
                    transform[5],
                );
                true
            })
            .unwrap_or(false);
        if updated {
            self.mark_dirty();
        }
        updated
    }

    /// Get the array repetition parameters for a CellRef instance
    /// as scalar column/row pitches.
    ///
    /// `id` can be a synthetic ref UUID (e.g. "ref:3:0") or a real element UUID.
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
    /// `id` can be a synthetic ref UUID (e.g. "ref:3:0") or a real element UUID.
    /// Returns `[columns, rows, col_x, col_y, row_x, row_y]` where
    /// `(col_x, col_y)` is the column displacement vector and
    /// `(row_x, row_y)` is the row displacement vector, both in the
    /// CellRef's local (pre-transform) coordinate space.
    pub fn get_cell_ref_array_vectors(&self, id: &str) -> Option<Vec<f64>> {
        // Resolve element index from either synthetic ref UUID or real UUID
        let (cell_name, elem_idx) = if let Some(idx) = parse_ref_uuid_element_index(id) {
            (self.active_cell.as_ref()?.clone(), idx)
        } else if let Some(elem_ref) = self.element_refs.get(id) {
            (elem_ref.cell_name.clone(), elem_ref.element_index)
        } else {
            return None;
        };

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
    /// `id` can be a synthetic ref UUID (e.g. "ref:3:0") or a real element UUID.
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
        let (cell_name, elem_idx) = if let Some(idx) = parse_ref_uuid_element_index(id) {
            match &self.active_cell {
                Some(name) => (name.clone(), idx),
                None => return false,
            }
        } else if let Some(elem_ref) = self.element_refs.get(id) {
            (elem_ref.cell_name.clone(), elem_ref.element_index)
        } else {
            return false;
        };

        let updated = self
            .library
            .edit_cell(&cell_name, |cell| {
                let Some(Element::CellRef(cell_ref)) = cell.elements_mut().get_mut(elem_idx) else {
                    return false;
                };
                if columns <= 1 && rows <= 1 {
                    cell_ref.repetition = None;
                } else if let Some(existing) = cell_ref.repetition
                    && (existing.col_vector.y != 0.0 || existing.row_vector.x != 0.0)
                {
                    cell_ref.repetition = Some(Repetition::new_vectors(
                        columns,
                        rows,
                        existing.col_vector,
                        existing.row_vector,
                    ));
                } else {
                    cell_ref.repetition =
                        Some(Repetition::new(columns, rows, col_spacing, row_spacing));
                }
                true
            })
            .unwrap_or(false);
        if updated {
            self.mark_dirty();
        }
        updated
    }

    /// Set the array repetition parameters on a CellRef instance from full
    /// column and row displacement vectors (supports skewed/hex lattices).
    ///
    /// `id` can be a synthetic ref UUID (e.g. "ref:3:0") or a real element UUID.
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
        // Resolve element index from either synthetic ref UUID or real UUID
        let (cell_name, elem_idx) = if let Some(idx) = parse_ref_uuid_element_index(id) {
            match &self.active_cell {
                Some(name) => (name.clone(), idx),
                None => return false,
            }
        } else if let Some(elem_ref) = self.element_refs.get(id) {
            (elem_ref.cell_name.clone(), elem_ref.element_index)
        } else {
            return false;
        };

        let updated = self
            .library
            .edit_cell(&cell_name, |cell| {
                let Some(Element::CellRef(cell_ref)) = cell.elements_mut().get_mut(elem_idx) else {
                    return false;
                };
                if columns <= 1 && rows <= 1 {
                    cell_ref.repetition = None;
                } else {
                    cell_ref.repetition = Some(Repetition::new_vectors(
                        columns,
                        rows,
                        Vector2::new(col_x, col_y),
                        Vector2::new(row_x, row_y),
                    ));
                }
                true
            })
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
            .cell_origins
            .get(ref_cell_name)
            .copied()
            .unwrap_or_else(rosette_core::Point::origin);
        let cell_ref = CellRef::with_transform(
            ref_cell_name.to_string(),
            Transform::translate(x - origin.x, y - origin.y),
        );

        let element_index = self.library.edit_cell(parent_cell, |cell| {
            cell.add_ref(cell_ref);
            cell.elements().len() - 1
        })?;

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
    /// Returns a JS array of `{parent, transform, repetition}` records.
    /// `repetition` is `[columns, rows, col_x, col_y, row_x, row_y]` or null.
    pub fn get_cell_ref_parents(&self, name: &str) -> JsValue {
        #[derive(serde::Serialize)]
        struct ParentRef {
            parent: String,
            transform: Vec<f64>,
            repetition: Option<Vec<f64>>,
        }

        let mut entries: Vec<ParentRef> = Vec::new();

        for cell in self.library.cells() {
            for element in cell.elements() {
                if let Element::CellRef(cell_ref) = element
                    && cell_ref.cell_name == name
                {
                    let t = &cell_ref.transform;
                    entries.push(ParentRef {
                        parent: cell.name().to_string(),
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

        serde_wasm_bindgen::to_value(&entries).unwrap_or(JsValue::NULL)
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
        if transform.len() != 6
            || !self.library.contains(parent_cell)
            || !self.library.contains(ref_cell_name)
        {
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
        let mut cell_ref = CellRef::with_transform(ref_cell_name.to_string(), t);
        if let Some(repetition) = repetition {
            if repetition.len() != 6 {
                return None;
            }
            cell_ref.repetition = Some(Repetition::new_vectors(
                repetition[0] as u16,
                repetition[1] as u16,
                Vector2::new(repetition[2], repetition[3]),
                Vector2::new(repetition[4], repetition[5]),
            ));
        }

        let element_index = self.library.edit_cell(parent_cell, |cell| {
            cell.add_ref(cell_ref);
            cell.elements().len() - 1
        })?;

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

        for (elem_idx, name, bbox, rep) in labels {
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
        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return js_sys::Array::new().into(),
        };
        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return js_sys::Array::new().into(),
        };

        let max_depth = self.hierarchy_depth_limit;
        let mut contexts: Vec<(String, [f64; 6])> = Vec::new();

        // Walk top-level CellRefs
        for element in cell.elements() {
            if let Element::CellRef(cell_ref) = element {
                if cell_ref.cell_name == cell.name()
                    || self.hidden_cells.contains(&cell_ref.cell_name)
                {
                    continue;
                }
                if let Some(ref_cell) = self.library.cell(&cell_ref.cell_name) {
                    for copy_transform in array_transforms(cell_ref) {
                        let t = [
                            copy_transform.a,
                            copy_transform.b,
                            copy_transform.c,
                            copy_transform.d,
                            copy_transform.tx,
                            copy_transform.ty,
                        ];
                        contexts.push((cell_ref.cell_name.clone(), t));
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
            }
        }

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

        // Each root gets its own visited set so shared sub-cells appear
        // correctly under every root that references them.
        let roots = js_sys::Array::new();
        for cell in self.library.roots() {
            let mut visited = Vec::new();
            let node = self.build_cell_tree_node(cell.name(), &mut visited);
            roots.push(&node);
        }

        roots.into()
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
        let bbox = library.compute_instance_bbox("parent", cell_ref);
        assert_eq!((bbox.min().x, bbox.min().y), (-400.0, -300.0));
        assert_eq!((bbox.max().x, bbox.max().y), (650.0, 700.0));
    }

    #[test]
    fn malformed_zero_dimension_aref_bounds_do_not_panic() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_cell("parent").unwrap();
        let cell_ref = CellRef {
            cell_name: "child".to_string(),
            transform: Transform::translate(100.0, 200.0),
            repetition: Some(Repetition {
                columns: 0,
                rows: 2,
                col_vector: Vector2::new(10.0, 0.0),
                row_vector: Vector2::new(0.0, 10.0),
            }),
        };

        let bbox = library.compute_instance_bbox("parent", &cell_ref);
        assert_eq!((bbox.min().x, bbox.min().y), (-400.0, -300.0));
        assert_eq!((bbox.max().x, bbox.max().y), (600.0, 700.0));
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
}
