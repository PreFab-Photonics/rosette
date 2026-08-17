//! Element mutations and state: removal, flattening, translation,
//! dirty tracking, and render-polygon export.

use super::{REF_UUID_PREFIX, WasmLibrary, array_transforms};
use rosette_core::cell::Element;
use rosette_core::geometry::Vector2;
use rosette_core::path::stroke_path;
use rosette_core::{Point, Transform};
use std::collections::{HashMap, HashSet};
use std::convert::Infallible;
use wasm_bindgen::prelude::*;

fn translated(element: &Element, dx: f64, dy: f64) -> Option<Element> {
    let mut translated = element.clone();
    match &mut translated {
        Element::Polygon { polygon, .. } => {
            *polygon = polygon.translate(Vector2::new(dx, dy)).ok()?;
        }
        Element::Path(path) => {
            let points = path
                .points()
                .iter()
                .map(|point| Point::new(point.x + dx, point.y + dy))
                .collect();
            path.set_points(points).ok()?;
        }
        Element::Text(text) => {
            let position = text.position();
            text.set_position(Point::new(position.x + dx, position.y + dy))
                .ok()?;
        }
        Element::CellRef(cell_ref) => {
            let mut transform = cell_ref.transform();
            transform.tx += dx;
            transform.ty += dy;
            cell_ref.set_transform(transform).ok()?;
        }
    }
    Some(translated)
}

#[wasm_bindgen]
impl WasmLibrary {
    /// Remove an element by its UUID.
    ///
    /// Returns true if the element was removed, false if not found.
    /// Handles both real UUIDs and synthetic ref UUIDs (from CellRef instances).
    pub fn remove_element(&mut self, id: &str) -> bool {
        let resolved_id = if id.starts_with(REF_UUID_PREFIX) {
            self.resolve_ref_uuid_parts(id)
                .map(|(_, _, token)| token.to_string())
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

        let removed = self
            .library
            .edit_cell(&elem_ref.cell_name, |cell| {
                Ok::<_, Infallible>(cell.remove_element(elem_ref.element_index).is_some())
            })
            .unwrap_or(false);
        if !removed {
            self.element_refs.insert(resolved_id, elem_ref);
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
        let mut scheduled_ids = HashSet::new();

        for id in &ids {
            // First check: synthetic ref UUID (from CellRef instance)
            if id.starts_with(REF_UUID_PREFIX) {
                if let Some((elem_idx, _, token)) = self.resolve_ref_uuid_parts(id)
                    && scheduled_ids.insert(token.to_string())
                    && let Some(cell_name) = &active_cell_name
                {
                    to_remove.push((token.to_string(), cell_name.clone(), elem_idx));
                }
                continue;
            }

            if scheduled_ids.insert(id.clone())
                && let Some(elem_ref) = self.element_refs.get(id)
            {
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

        let mut candidate_library = self.library.clone();
        let mut removed: HashMap<String, Vec<(String, usize)>> = HashMap::new();
        for (id, cell_name, element_index) in to_remove {
            match candidate_library.edit_cell(&cell_name, |cell| {
                Ok::<_, Infallible>(cell.remove_element(element_index).is_some())
            }) {
                Ok(true) => removed
                    .entry(cell_name)
                    .or_default()
                    .push((id, element_index)),
                Ok(false) => {}
                Err(_) => return 0,
            }
        }

        let removed_count = removed.values().map(Vec::len).sum();
        if removed_count > 0 {
            let mut candidate_refs = self.element_refs.clone();
            for (cell_name, entries) in &removed {
                for (id, _) in entries {
                    candidate_refs.remove(id);
                }
                for element_ref in candidate_refs.values_mut() {
                    if element_ref.cell_name == *cell_name {
                        element_ref.element_index -= entries
                            .iter()
                            .filter(|(_, index)| *index < element_ref.element_index)
                            .count();
                    }
                }
            }
            self.library = candidate_library;
            self.element_refs = candidate_refs;
            self.mark_dirty();
        }

        removed_count
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

        // Build the complete replacement before touching editor state.
        let library_snapshot = self.library.clone();
        let Some(cell_snapshot) = library_snapshot.cell(&cell_name).cloned() else {
            return false;
        };

        let mut flattened = Vec::new();
        let identity = Transform::identity();
        for element in cell_snapshot.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    flattened.push(Element::Polygon {
                        polygon: polygon.clone(),
                        layer: *layer,
                    });
                }
                Element::Path(path) => {
                    // Preserve paths as polygons (ribbon conversion)
                    if let Some(ribbon) = stroke_path(path.points(), path.width(), path.end_type())
                    {
                        flattened.push(Element::Polygon {
                            polygon: ribbon,
                            layer: path.layer(),
                        });
                    }
                }
                Element::CellRef(cell_ref) => {
                    // Recursively flatten referenced cell geometry
                    if let Some(ref_cell) = library_snapshot.cell(cell_ref.cell_name()) {
                        for copy_transform in array_transforms(cell_ref) {
                            let combined = identity.then(&copy_transform);
                            let mut polygons = Vec::new();
                            self.flatten_cell_recursive(
                                ref_cell,
                                &library_snapshot,
                                &combined,
                                &[cell_snapshot.name()],
                                1.0,
                                &mut polygons,
                            );
                            flattened.extend(
                                polygons
                                    .into_iter()
                                    .map(|(polygon, layer)| Element::Polygon { polygon, layer }),
                            );
                        }
                    }
                }
                Element::Text(text) => flattened.push(Element::Text(text.clone())),
            }
        }

        let mut candidate_library = self.library.clone();
        let replaced = candidate_library
            .edit_cell(&cell_name, |cell| {
                cell.clear_elements();
                for element in &flattened {
                    match element {
                        Element::Polygon { polygon, layer } => {
                            cell.add_polygon(polygon.clone(), *layer);
                        }
                        Element::Text(text) => {
                            cell.add_text_with_height(
                                text.text(),
                                text.position(),
                                text.layer(),
                                text.height(),
                            )?;
                        }
                        Element::Path(_) | Element::CellRef(_) => unreachable!(),
                    }
                }
                Ok::<(), rosette_core::CellValidationError>(())
            })
            .is_ok();
        if !replaced {
            return false;
        }

        let mut candidate_refs = self.element_refs.clone();
        candidate_refs.retain(|_, element_ref| element_ref.cell_name != cell_name);
        for element_index in 0..flattened.len() {
            candidate_refs.insert(
                uuid::Uuid::new_v4().to_string(),
                super::ElementRef {
                    cell_name: cell_name.clone(),
                    element_index,
                },
            );
        }

        self.library = candidate_library;
        self.element_refs = candidate_refs;
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
            .map(|cell| cell.polygons().count())
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
        self.translate_elements(vec![id.to_string()], dx, dy) == 1
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
        if ids.is_empty() || !dx.is_finite() || !dy.is_finite() {
            return 0;
        }

        let mut targets: HashMap<String, HashMap<usize, Element>> = HashMap::new();
        for id in &ids {
            let (cell_name, element_index, must_be_cell_ref) = if id.starts_with(REF_UUID_PREFIX) {
                let Some((element_index, _, _)) = self.resolve_ref_uuid_parts(id) else {
                    return 0;
                };
                let Some(cell_name) = self.active_cell.clone() else {
                    return 0;
                };
                (cell_name, element_index, true)
            } else {
                let Some(element_ref) = self.element_refs.get(id) else {
                    return 0;
                };
                (
                    element_ref.cell_name.clone(),
                    element_ref.element_index,
                    false,
                )
            };

            let Some(element) = self
                .library
                .cell(&cell_name)
                .and_then(|cell| cell.elements().get(element_index))
            else {
                return 0;
            };
            if must_be_cell_ref && !matches!(element, Element::CellRef(_)) {
                return 0;
            }
            let Some(translated) = translated(element, dx, dy) else {
                return 0;
            };
            targets
                .entry(cell_name)
                .or_default()
                .entry(element_index)
                .or_insert(translated);
        }

        let count = targets.values().map(HashMap::len).sum();
        let mut candidate = self.library.clone();
        for (cell_name, replacements) in &targets {
            let edited = candidate
                .edit_cell(cell_name, |cell| {
                    cell.edit_elements(|elements| {
                        for (&element_index, replacement) in replacements {
                            elements[element_index] = replacement.clone();
                        }
                        Ok::<_, Infallible>(())
                    })
                })
                .is_ok();
            if !edited {
                return 0;
            }
        }

        self.library = candidate;
        self.mark_dirty();
        count
    }

    /// Get the element index for a UUID.
    ///
    /// Returns the element's position in the parent cell's elements list,
    /// or -1 if the UUID is not found.
    pub fn get_element_index(&self, uuid: &str) -> i32 {
        match self.element_refs.get(uuid) {
            Some(elem_ref) => elem_ref.element_index as i32,
            None => -1,
        }
    }

    /// Move an element identified by its real UUID to an exact index.
    ///
    /// This preserves every UUID and updates all index mappings in the owning
    /// cell. Synthetic CellRef IDs and out-of-range target indices are rejected.
    pub fn move_element_to_index(&mut self, uuid: &str, target_index: usize) -> bool {
        if uuid.starts_with(REF_UUID_PREFIX) {
            return false;
        }
        let Some(element_ref) = self.element_refs.get(uuid).cloned() else {
            return false;
        };
        let Some(cell) = self.library.cell(&element_ref.cell_name) else {
            return false;
        };
        let source_index = element_ref.element_index;
        if source_index >= cell.elements().len() || target_index >= cell.elements().len() {
            return false;
        }
        if source_index == target_index {
            return true;
        }

        let moved = self
            .library
            .edit_cell(&element_ref.cell_name, |cell| {
                cell.edit_elements(|elements| {
                    if source_index < target_index {
                        elements[source_index..=target_index].rotate_left(1);
                    } else {
                        elements[target_index..=source_index].rotate_right(1);
                    }
                    Ok::<_, Infallible>(())
                })
            })
            .is_ok();
        if !moved {
            return false;
        }

        for (id, entry) in &mut self.element_refs {
            if entry.cell_name != element_ref.cell_name {
                continue;
            }
            if id == uuid {
                entry.element_index = target_index;
            } else if source_index < target_index
                && entry.element_index > source_index
                && entry.element_index <= target_index
            {
                entry.element_index -= 1;
            } else if source_index > target_index
                && entry.element_index >= target_index
                && entry.element_index < source_index
            {
                entry.element_index += 1;
            }
        }

        self.mark_dirty();
        true
    }

    /// Resolve an element ID to its canonical logical target in the active cell.
    ///
    /// Real CellRef UUIDs and their synthetic aliases resolve to the same
    /// tokenized representative ID. Stale or invalid synthetic IDs fail.
    pub fn get_canonical_element_id(&self, id: &str) -> Option<String> {
        if id.starts_with(REF_UUID_PREFIX) {
            let (element_index, _, token) = self.resolve_ref_uuid_parts(id)?;
            return self.canonical_ref_uuid(element_index, token);
        }

        let element_ref = self.element_refs.get(id)?;
        let cell = self.library.cell(&element_ref.cell_name)?;
        if matches!(
            cell.elements().get(element_ref.element_index),
            Some(Element::CellRef(_))
        ) && self.active_cell.as_deref() == Some(element_ref.cell_name.as_str())
        {
            self.canonical_ref_uuid(element_ref.element_index, id)
        } else {
            Some(id.to_string())
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn translations_preserve_ids_kinds_and_order_and_reject_overflow_atomically() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("top").unwrap();
        let polygon_id = library
            .add_polygon(&[0.0, 0.0, 2.0, 0.0, 2.0, 2.0], 1, 0)
            .unwrap();
        let text_id = library.add_text("label", 3.0, 4.0, 5.0, 2, 0).unwrap();

        assert_eq!(
            library.translate_elements(vec![polygon_id.clone(), text_id.clone()], 6.0, -2.0),
            2
        );
        assert_eq!(library.get_element_index(&polygon_id), 0);
        assert_eq!(library.get_element_index(&text_id), 1);
        assert_eq!(
            library.get_element_vertices(&polygon_id).unwrap(),
            vec![6.0, -2.0, 8.0, -2.0, 8.0, 0.0]
        );
        let cell = library.library.cell("top").unwrap();
        assert!(matches!(cell.elements()[0], Element::Polygon { .. }));
        assert!(matches!(cell.elements()[1], Element::Text(_)));

        let huge_id = library
            .add_polygon(&[f64::MAX, 0.0, f64::MAX, 1.0, f64::MAX, 2.0], 3, 0)
            .unwrap();
        let before = library.get_element_vertices(&huge_id).unwrap();
        library.mark_clean();
        assert!(!library.translate_element(&huge_id, f64::MAX, 0.0));
        assert_eq!(library.get_element_vertices(&huge_id).unwrap(), before);
        assert!(!library.is_dirty());

        let safe_before = library.get_element_vertices(&polygon_id).unwrap();
        assert_eq!(
            library.translate_elements(vec![polygon_id.clone(), huge_id.clone()], f64::MAX, 0.0,),
            0
        );
        assert_eq!(
            library.get_element_vertices(&polygon_id).unwrap(),
            safe_before
        );
        assert_eq!(library.get_element_vertices(&huge_id).unwrap(), before);
        assert!(!library.is_dirty());
    }

    #[test]
    fn multi_cell_translation_failure_preserves_all_cells_and_caches() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("safe").unwrap();
        let safe_id = library
            .add_polygon(&[0.0, 0.0, 1.0, 0.0, 1.0, 1.0], 1, 0)
            .unwrap();
        library.add_cell("extreme").unwrap();
        assert!(library.set_active_cell("extreme"));
        let extreme_id = library
            .add_polygon(&[f64::MAX, 0.0, f64::MAX, 1.0, f64::MAX, 2.0], 2, 0)
            .unwrap();
        library.with_spatial_index(|_| ()).unwrap();
        library.mark_clean();

        let safe_before = library.get_element_vertices(&safe_id).unwrap();
        let extreme_before = library.get_element_vertices(&extreme_id).unwrap();
        assert_eq!(
            library.translate_elements(vec![safe_id.clone(), extreme_id.clone()], f64::MAX, 0.0,),
            0
        );

        assert_eq!(library.get_element_vertices(&safe_id).unwrap(), safe_before);
        assert_eq!(
            library.get_element_vertices(&extreme_id).unwrap(),
            extreme_before
        );
        assert!(!library.is_dirty());
        assert!(library.spatial_index.borrow().is_some());
    }

    #[test]
    fn stale_synthetic_ids_never_retarget_after_index_shifts() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library
            .add_polygon(&[0.0, 0.0, 1.0, 0.0, 1.0, 1.0], 1, 0)
            .unwrap();
        library.add_cell("parent").unwrap();
        assert!(library.set_active_cell("parent"));
        let first = library.add_cell_ref("child", 0.0, 0.0).unwrap();
        let second = library.add_cell_ref("child", 10.0, 0.0).unwrap();
        let old_ids = library.get_all_ids();
        assert_eq!(library.hit_test(0.5, 0.5), Some(old_ids[0].clone()));
        assert_eq!(
            library.hit_test_rect(9.5, -0.5, 11.5, 1.5),
            vec![old_ids[1].clone()]
        );
        assert_eq!(library.get_instance_bboxes()[0].0, old_ids[0]);
        assert_eq!(library.get_instance_labels()[1].0, old_ids[1]);

        assert!(library.remove_element(&first));
        let new_id = library.get_all_ids().pop().unwrap();
        assert!(new_id.starts_with("ref:0:0:"));
        assert!(new_id.ends_with(&second));

        for stale_id in old_ids {
            assert!(library.get_cell_ref_info(&stale_id).is_none());
            assert!(library.get_element_vertices(&stale_id).is_none());
            assert!(!library.translate_element(&stale_id, 1.0, 0.0));
            assert!(!library.remove_element(&stale_id));
        }
        assert!(library.get_cell_ref_info(&new_id).is_some());
        assert_eq!(library.get_element_index(&second), 0);
    }

    #[test]
    fn real_and_synthetic_ref_aliases_translate_once_atomically() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_cell("parent").unwrap();
        assert!(library.set_active_cell("parent"));
        let real_id = library.add_cell_ref("child", 3.0, 4.0).unwrap();
        let synthetic_id = library.get_canonical_element_id(&real_id).unwrap();

        assert_eq!(
            library.get_canonical_element_id(&real_id),
            library.get_canonical_element_id(&synthetic_id)
        );
        assert_eq!(library.get_group_ids(&real_id), vec![synthetic_id.clone()]);
        assert_eq!(
            library.translate_elements(vec![real_id, synthetic_id.clone()], 5.0, 6.0),
            1
        );
        assert_eq!(
            library
                .get_cell_ref_info(&synthetic_id)
                .unwrap()
                .transform(),
            vec![1.0, 0.0, 0.0, 1.0, 8.0, 10.0]
        );
    }

    #[test]
    fn moving_real_uuid_preserves_mixed_element_order_and_all_mappings() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_cell("top").unwrap();
        assert!(library.set_active_cell("top"));

        let polygon_id = library
            .add_polygon(&[0.0, 0.0, 1.0, 0.0, 1.0, 1.0], 1, 0)
            .unwrap();
        let native_path_id = library
            .restore_native_path(&[2.0, 0.0, 3.0, 0.0], 1.0, 0, 2, 0)
            .unwrap();
        let text_id = library.add_text("label", 4.0, 0.0, 1.0, 3, 0).unwrap();
        let ref_id = library.add_cell_ref("child", 5.0, 0.0).unwrap();
        let app_path_id = library
            .add_polygon(&[6.0, 0.0, 7.0, 0.0, 7.0, 1.0], 4, 0)
            .unwrap();

        assert!(library.move_element_to_index(&app_path_id, 0));
        assert!(library.move_element_to_index(&ref_id, 2));
        assert_eq!(library.get_element_index(&app_path_id), 0);
        assert_eq!(library.get_element_index(&polygon_id), 1);
        assert_eq!(library.get_element_index(&ref_id), 2);
        assert_eq!(library.get_element_index(&native_path_id), 3);
        assert_eq!(library.get_element_index(&text_id), 4);
        assert_eq!(
            library.get_all_ids(),
            vec![
                app_path_id,
                polygon_id,
                library.get_canonical_element_id(&ref_id).unwrap(),
                native_path_id,
                text_id,
            ]
        );

        library.mark_clean();
        let synthetic_id = library.get_canonical_element_id(&ref_id).unwrap();
        assert!(!library.move_element_to_index(&synthetic_id, 0));
        assert!(!library.move_element_to_index(&ref_id, 5));
        assert!(!library.is_dirty());
    }
}
