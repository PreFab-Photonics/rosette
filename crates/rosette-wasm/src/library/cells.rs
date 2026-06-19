//! Cell management: create/rename/remove cells, active cell,
//! visibility, origins, and image bounds.

use super::{ElementRef, WasmLibrary};
use rosette_core::{Cell, Library, Point};
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use uuid::Uuid;
use wasm_bindgen::prelude::*;

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
            hierarchy_depth_limit: 0,
            hidden_cells: HashSet::new(),
            cell_image_bounds: HashMap::new(),
            instance_bbox_cache: RefCell::new(HashMap::new()),
            instance_bbox_cache_cell: RefCell::new(None),
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
            self.mark_dirty();
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
        let mut removed_count = 0u32;

        // Collect which cells had CellRefs removed (need index rebuild)
        let mut affected_cells: Vec<String> = Vec::new();

        for cell in self.library.cells_mut() {
            let before = cell.elements().len();
            cell.remove_refs_by_name(name);
            let after = cell.elements().len();
            if before > after {
                removed_count += (before - after) as u32;
                affected_cells.push(cell.name().to_string());
            }
        }

        // Remove element_refs that belong to the deleted cell
        self.element_refs.retain(|_, r| r.cell_name != name);

        // Rebuild element_refs for affected cells (indices shifted)
        for cell_name in &affected_cells {
            // Remove old refs for this cell
            self.element_refs.retain(|_, r| r.cell_name != *cell_name);
            // Rebuild with correct indices
            if let Some(cell) = self.library.cell(cell_name) {
                for i in 0..cell.elements().len() {
                    let uuid = Uuid::new_v4().to_string();
                    self.element_refs.insert(
                        uuid,
                        ElementRef {
                            cell_name: cell_name.clone(),
                            element_index: i,
                        },
                    );
                }
            }
        }

        // Now remove the cell itself
        self.library.remove_cell(name);

        // Clear active cell if it was removed
        if self.active_cell.as_deref() == Some(name) {
            self.active_cell = self.library.cells().first().map(|c| c.name().to_string());
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
            Some(b) if b.len() >= 4 => {
                self.cell_image_bounds
                    .insert(cell_name.to_string(), [b[0], b[1], b[2], b[3]]);
                self.mark_dirty();
            }
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
        if let Some(cell_name) = &self.active_cell {
            // Remove refs for this cell
            self.element_refs.retain(|_, r| r.cell_name != *cell_name);

            // Replace cell with empty one
            if let Some(cell) = self.library.cell_mut(cell_name) {
                *cell = Cell::new(cell_name.clone());
            }

            self.mark_dirty();
        }
    }
}
