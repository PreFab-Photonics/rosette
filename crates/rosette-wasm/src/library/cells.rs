//! Cell management: create/rename/remove cells, active cell,
//! visibility, origins, and image bounds.

use super::WasmLibrary;
use rosette_core::cell::Element;
use rosette_core::{Cell, Library, Point};
use rosette_io::json::CellAnnotations;
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl WasmLibrary {
    /// Create a new library with the given name.
    #[wasm_bindgen(constructor)]
    pub fn new(name: &str) -> Self {
        Self {
            library: Library::new(name.to_string()),
            active_cell: None,
            annotations: HashMap::new(),
            element_refs: HashMap::new(),
            layer_colors: HashMap::new(),
            layer_fill_patterns: HashMap::new(),
            dirty: false,
            hierarchy_depth_limit: 0,
            hidden_cells: HashSet::new(),
            cell_image_bounds: HashMap::new(),
            instance_bbox_cache: RefCell::new(HashMap::new()),
            instance_bbox_cache_cell: RefCell::new(None),
            spatial_index: RefCell::new(None),
            spatial_index_cell: RefCell::new(None),
        }
    }

    /// Add a new cell to the library.
    ///
    /// Returns an error if the name is invalid or already exists.
    pub fn add_cell(&mut self, name: &str) -> Result<(), JsValue> {
        rosette_io::gds::validate_structure_name(name)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        let cell = Cell::new(name.to_string());
        self.library
            .add_cell(cell)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        self.annotations
            .insert(name.to_string(), CellAnnotations::default());
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
        rosette_io::gds::validate_structure_name(new_name)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        let found = self
            .library
            .rename_cell(old_name, new_name)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;

        if found {
            // Update active cell reference if it was renamed
            if self.active_cell.as_deref() == Some(old_name) {
                self.active_cell = Some(new_name.to_string());
            }
            let annotations = self.annotations.remove(old_name).unwrap_or_default();
            self.annotations.insert(new_name.to_string(), annotations);
            if self.hidden_cells.remove(old_name) {
                self.hidden_cells.insert(new_name.to_string());
            }
            if let Some(bounds) = self.cell_image_bounds.remove(old_name) {
                self.cell_image_bounds.insert(new_name.to_string(), bounds);
            }
            // Update element refs that point to the old cell name
            for elem_ref in self.element_refs.values_mut() {
                if elem_ref.cell_name == old_name {
                    elem_ref.cell_name = new_name.to_string();
                }
            }
            self.mark_dirty();
        }
        Ok(found)
    }

    /// Remove a cell from the library.
    ///
    /// Returns false if the cell doesn't exist.
    /// Also returns false when another cell still references it.
    pub fn remove_cell(&mut self, name: &str) -> bool {
        if self.library.remove_cell(name).unwrap_or(false) {
            self.annotations.remove(name);
            self.hidden_cells.remove(name);
            self.cell_image_bounds.remove(name);
            if self.active_cell.as_deref() == Some(name) {
                self.active_cell = self
                    .library
                    .top_cell()
                    .or_else(|| self.library.roots().into_iter().next())
                    .or_else(|| self.library.cells().first())
                    .map(|cell| cell.name().to_string());
            }
            // Remove element refs that point to the removed cell
            self.element_refs.retain(|_, r| r.cell_name != name);
            self.mark_dirty();
            true
        } else {
            false
        }
    }

    /// Remove a cell and all CellRefs that reference it from other cells.
    ///
    /// Returns the number of removed references (0 if cell didn't exist).
    pub fn remove_cell_cascade(&mut self, name: &str) -> u32 {
        if !self.library.contains(name) {
            return 0;
        }

        let removed_indices: HashMap<String, Vec<usize>> = self
            .library
            .cells()
            .iter()
            .filter_map(|cell| {
                let indices: Vec<_> = cell
                    .elements()
                    .iter()
                    .enumerate()
                    .filter_map(|(index, element)| match element {
                        Element::CellRef(cell_ref) if cell_ref.cell_name == name => Some(index),
                        _ => None,
                    })
                    .collect();
                (!indices.is_empty()).then(|| (cell.name().to_string(), indices))
            })
            .collect();

        let removed_count = self.library.remove_cell_cascade(name) as u32;

        self.element_refs.retain(|_, element_ref| {
            if element_ref.cell_name == name {
                return false;
            }
            removed_indices
                .get(&element_ref.cell_name)
                .is_none_or(|indices| !indices.contains(&element_ref.element_index))
        });
        for element_ref in self.element_refs.values_mut() {
            if let Some(indices) = removed_indices.get(&element_ref.cell_name) {
                element_ref.element_index -= indices
                    .iter()
                    .filter(|&&index| index < element_ref.element_index)
                    .count();
            }
        }

        self.annotations.remove(name);
        self.hidden_cells.remove(name);
        self.cell_image_bounds.remove(name);

        if self.active_cell.as_deref() == Some(name) {
            self.active_cell = self
                .library
                .top_cell()
                .or_else(|| self.library.roots().into_iter().next())
                .or_else(|| self.library.cells().first())
                .map(|cell| cell.name().to_string());
        }

        self.mark_dirty();
        removed_count
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
        self.mark_dirty();
    }

    /// Set visibility of a cell's internal geometry.
    ///
    /// When a cell is hidden, its polygons and paths are not rendered inside
    /// CellRef instances. Bounding-box outlines, labels, and hit-testing
    /// remain active so the instance can still be selected and identified.
    pub fn set_cell_visibility(&mut self, cell_name: &str, visible: bool) {
        if visible {
            self.hidden_cells.remove(cell_name);
        } else {
            self.hidden_cells.insert(cell_name.to_string());
        }
        self.mark_dirty();
    }

    /// Check whether a cell's internal geometry is visible.
    pub fn is_cell_visible(&self, cell_name: &str) -> bool {
        !self.hidden_cells.contains(cell_name)
    }

    /// Get the list of currently hidden cell names.
    pub fn get_hidden_cells(&self) -> Vec<String> {
        self.hidden_cells.iter().cloned().collect()
    }

    /// Set the bounding box of image overlays for a cell.
    ///
    /// Called from JS whenever images change. The bounds are in the cell's
    /// local coordinate space and are included in instance bounding-box
    /// calculations so that selection outlines and zoom-to-fit encompass images.
    ///
    /// Pass `null` or an empty array to clear the image bounds for a cell.
    pub fn set_cell_image_bounds(&mut self, cell_name: &str, bounds: Option<Vec<f64>>) {
        match bounds {
            Some(b)
                if b.len() >= 4
                    && b[..4].iter().all(|value| value.is_finite())
                    && b[0] <= b[2]
                    && b[1] <= b[3] =>
            {
                self.cell_image_bounds
                    .insert(cell_name.to_string(), [b[0], b[1], b[2], b[3]]);
                self.mark_dirty();
            }
            Some(b) if b.len() >= 4 => {}
            _ => {
                if self.cell_image_bounds.remove(cell_name).is_some() {
                    self.mark_dirty();
                }
            }
        }
    }

    /// Get the origin of the active cell as [x, y].
    ///
    /// Returns None if no active cell exists.
    pub fn get_cell_origin(&self) -> Option<Vec<f64>> {
        let cell_name = self.active_cell.as_deref()?;
        self.library.cell(cell_name)?;
        let origin = self
            .annotations
            .get(cell_name)
            .map(|annotations| annotations.editor.origin)
            .unwrap_or_else(Point::origin);
        Some(vec![origin.x, origin.y])
    }

    /// Get the origin of a cell by name as [x, y].
    ///
    /// Returns None if the cell does not exist.
    pub fn get_cell_origin_by_name(&self, cell_name: &str) -> Option<Vec<f64>> {
        self.library.cell(cell_name)?;
        let origin = self
            .annotations
            .get(cell_name)
            .map(|annotations| annotations.editor.origin)
            .unwrap_or_else(Point::origin);
        Some(vec![origin.x, origin.y])
    }

    /// Set the origin of the active cell.
    ///
    /// Returns false if no active cell exists.
    pub fn set_cell_origin(&mut self, x: f64, y: f64) -> bool {
        if !x.is_finite() || !y.is_finite() {
            return false;
        }
        let cell_name = match self.active_cell.as_deref() {
            Some(name) => name.to_string(),
            None => return false,
        };
        if self.library.contains(&cell_name) {
            self.annotations.entry(cell_name).or_default().editor.origin = Point::new(x, y);
            self.mark_dirty();
            true
        } else {
            false
        }
    }

    /// Get the number of cells in the library.
    pub fn cell_count(&self) -> usize {
        self.library.cells().len()
    }

    /// Get the names of all cells in the library.
    pub fn get_cell_names(&self) -> Vec<String> {
        self.library
            .cells()
            .iter()
            .map(|c| c.name().to_string())
            .collect()
    }

    /// Clear all elements from the active cell.
    pub fn clear_active_cell(&mut self) {
        if let Some(cell_name) = self.active_cell.clone()
            && self
                .library
                .edit_cell(&cell_name, |cell| cell.clear_elements())
                .is_ok()
        {
            self.element_refs.retain(|_, r| r.cell_name != cell_name);
            self.mark_dirty();
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::{BBox, Port, Transform, Vector2};
    use rosette_io::json::{BendAnnotation, DrcAnnotations, EditorAnnotations, RouteAnnotations};

    #[test]
    fn annotation_state_follows_cell_lifecycle() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("cell").unwrap();
        let expected = CellAnnotations {
            route: RouteAnnotations {
                path_length: Some(42.0),
                bends: vec![BendAnnotation {
                    radius: 3.0,
                    position: Point::new(4.0, 5.0),
                    requested_radius: Some(6.0),
                }],
                warnings: vec!["warning".to_string()],
            },
            drc: DrcAnnotations {
                skip: true,
                waive_regions: vec![BBox::new(Point::origin(), Point::new(3.0, 4.0))],
            },
            editor: EditorAnnotations {
                origin: Point::new(12.0, -4.0),
            },
        };
        library
            .annotations
            .insert("cell".to_string(), expected.clone());
        library.clear_active_cell();
        assert_eq!(library.get_cell_origin(), Some(vec![12.0, -4.0]));
        assert_eq!(library.get_cell_path_length("cell"), Some(0.84));
        assert_eq!(library.annotations["cell"], expected);

        assert!(library.rename_cell("cell", "renamed").unwrap());
        assert!(!library.annotations.contains_key("cell"));
        assert_eq!(library.annotations["renamed"], expected);
        assert!(library.remove_cell("renamed"));
        assert!(!library.annotations.contains_key("renamed"));
        assert!(library.get_cell_origin_by_name("renamed").is_none());
    }

    #[test]
    fn clearing_active_cell_preserves_non_element_state() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("cell").unwrap();
        assert!(library.set_cell_origin(12.0, -4.0));
        let annotations = library.annotations.get_mut("cell").unwrap();
        annotations.route.path_length = Some(42.0);
        annotations.route.warnings.push("warning".to_string());
        annotations.drc.skip = true;
        annotations
            .drc
            .waive_regions
            .push(BBox::new(Point::origin(), Point::new(3.0, 4.0)));
        let expected_annotations = annotations.clone();
        library
            .library
            .edit_cell("cell", |cell| {
                cell.add_port(Port::new("input", Point::new(1.0, 2.0), Vector2::unit_x()));
            })
            .unwrap();
        library
            .add_polygon(&[0.0, 0.0, 2.0, 0.0, 2.0, 2.0], 1, 0)
            .unwrap();

        library.clear_active_cell();

        let cell = library.library.cell("cell").unwrap();
        assert!(cell.is_empty());
        assert_eq!(cell.ports().len(), 1);
        assert_eq!(library.annotations["cell"], expected_annotations);
        assert_eq!(library.get_cell_path_length("cell"), Some(0.84));
        assert_eq!(library.get_cell_origin(), Some(vec![12.0, -4.0]));
        assert!(library.element_refs.is_empty());
    }

    #[test]
    fn cascade_removal_preserves_surviving_ids_and_adjusts_indices() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_cell("other").unwrap();
        library.add_cell("parent").unwrap();
        assert!(library.set_active_cell("parent"));

        let polygon_id = library
            .add_polygon(&[0.0, 0.0, 1.0, 0.0, 1.0, 1.0], 1, 0)
            .unwrap();
        let removed_ref_id = library.add_cell_ref("child", 0.0, 0.0).unwrap();
        let text_id = library.add_text("label", 2.0, 3.0, 1.0, 2, 0).unwrap();
        let removed_ref_id_2 = library
            .add_cell_ref_with_transform("child", vec![1.0, 0.0, 0.0, 1.0, 4.0, 5.0])
            .unwrap();
        let other_ref_id = library
            .add_cell_ref_with_transform("other", vec![1.0, 0.0, 0.0, 1.0, 6.0, 7.0])
            .unwrap();

        assert_eq!(library.remove_cell_cascade("child"), 2);
        assert_eq!(library.get_element_index(&polygon_id), 0);
        assert_eq!(library.get_element_index(&text_id), 1);
        assert_eq!(library.get_element_index(&other_ref_id), 2);
        assert_eq!(library.get_element_index(&removed_ref_id), -1);
        assert_eq!(library.get_element_index(&removed_ref_id_2), -1);
        assert_eq!(
            library
                .get_cell_ref_info(&other_ref_id)
                .unwrap()
                .transform(),
            vec![1.0, 0.0, 0.0, 1.0, 6.0, 7.0]
        );
        assert_eq!(library.library.cell("parent").unwrap().elements().len(), 3);
        assert_eq!(
            library
                .library
                .cell("parent")
                .unwrap()
                .cell_refs()
                .next()
                .unwrap()
                .transform,
            Transform::translate(6.0, 7.0)
        );
    }
}
