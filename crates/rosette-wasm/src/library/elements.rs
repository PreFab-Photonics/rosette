//! Element mutations and state: removal, flattening, translation,
//! dirty tracking, and render-polygon export.

use super::{WasmLibrary, array_transforms, parse_ref_uuid_element_index};
use rosette_core::cell::Element;
use rosette_core::geometry::{Vector2, offset_polygon};
use rosette_core::{Point, Transform};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl WasmLibrary {
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

        // Update all refs that point to elements after the removed one
        for ref_entry in self.element_refs.values_mut() {
            if ref_entry.cell_name == elem_ref.cell_name
                && ref_entry.element_index > elem_ref.element_index
            {
                ref_entry.element_index -= 1;
            }
        }

        self.mark_dirty();
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

            // Remove from refs map
            self.element_refs.remove(&id);

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
            self.mark_dirty();
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

    /// Flatten the active cell by recursively resolving all CellRef instances.
    ///
    /// Replaces all CellRef elements in the active cell with the resolved
    /// polygon geometry from the referenced cells (with transforms applied).
    /// Direct polygons and paths in the active cell are preserved as-is.
    /// Text elements are preserved. Child cell definitions remain in the
    /// library (they are not deleted).
    ///
    /// Returns `true` if flattening was performed, `false` if there is no
    /// active cell or if the active cell contains no CellRef elements.
    pub fn flatten_active_cell(&mut self) -> bool {
        let cell_name = match &self.active_cell {
            Some(name) => name.clone(),
            None => return false,
        };

        let cell = match self.library.cell(&cell_name) {
            Some(c) => c,
            None => return false,
        };

        // Check if there are any CellRef elements to flatten
        let has_refs = cell
            .elements()
            .iter()
            .any(|e| matches!(e, Element::CellRef(_)));
        if !has_refs {
            return false;
        }

        // Clone the full library so we can read from it while mutating self.
        // This is necessary because flatten_cell_recursive calls self.add_polygon
        // which borrows self mutably, while we also need to look up referenced
        // cells by name in the library.
        let library_snapshot = self.library.clone();
        let cell_snapshot = library_snapshot.cell(&cell_name).unwrap().clone();

        // Preserve the cell origin
        let origin = cell.origin();

        // Clear the active cell (removes all elements and element_refs)
        self.clear_active_cell();

        // Restore the origin on the now-empty cell
        if let Some(cell) = self.library.cell_mut(&cell_name) {
            cell.set_origin(origin);
        }

        // Re-add elements: direct polygons/paths/text are copied as-is,
        // CellRef elements are recursively flattened into polygons.
        let identity = Transform::identity();
        for element in cell_snapshot.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    let vertices: Vec<f64> =
                        polygon.vertices().iter().flat_map(|p| [p.x, p.y]).collect();
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
                    // Preserve paths as polygons (ribbon conversion)
                    if let Some(ribbon) = offset_polygon(points, *width) {
                        let vertices: Vec<f64> =
                            ribbon.vertices().iter().flat_map(|p| [p.x, p.y]).collect();
                        if vertices.len() >= 6 {
                            self.add_polygon(&vertices, layer.number, layer.datatype);
                        }
                    }
                }
                Element::CellRef(cell_ref) => {
                    // Recursively flatten referenced cell geometry
                    if let Some(ref_cell) = library_snapshot.cell(&cell_ref.cell_name) {
                        for copy_transform in array_transforms(cell_ref) {
                            let combined = identity.then(&copy_transform);
                            self.flatten_cell_recursive(ref_cell, &library_snapshot, &combined);
                        }
                    }
                }
                Element::Text {
                    text,
                    position,
                    layer,
                    height,
                } => {
                    self.add_text(
                        text,
                        position.x,
                        position.y,
                        *height,
                        layer.number,
                        layer.datatype,
                    );
                }
            }
        }

        self.mark_dirty();
        true
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
                self.mark_dirty();
                true
            }
            Some(Element::Path { points, .. }) => {
                for point in points.iter_mut() {
                    *point = Point::new(point.x + dx, point.y + dy);
                }
                self.mark_dirty();
                true
            }
            Some(Element::Text { position, .. }) => {
                *position = Point::new(position.x + dx, position.y + dy);
                self.mark_dirty();
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
                        self.mark_dirty();
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
}
