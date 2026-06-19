//! Layer styling and layer-scoped queries: colors, fill patterns,
//! used layers, per-layer area, and layer element management.

use super::{WasmLibrary, layer_key};
use rosette_core::Layer;
use rosette_core::Transform;
use std::collections::{HashMap, HashSet};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl WasmLibrary {
    /// Set the color for a layer.
    ///
    /// Colors are RGBA with values 0.0-1.0.
    pub fn set_layer_color(&mut self, layer: u16, datatype: u16, r: f32, g: f32, b: f32, a: f32) {
        let key = layer_key(layer, datatype);
        self.layer_colors.insert(key, [r, g, b, a]);
        self.mark_dirty();
    }

    /// Set the fill pattern for a layer.
    ///
    /// Pattern IDs: 0=solid, 1=hatched, 2=crosshatched, 3=dotted, 4=horizontal, 5=vertical, 6=zigzag, 7=brick.
    pub fn set_layer_fill_pattern(&mut self, layer: u16, datatype: u16, pattern: u32) {
        let key = layer_key(layer, datatype);
        self.layer_fill_patterns.insert(key, pattern);
        self.mark_dirty();
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
            self.mark_dirty();
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

    /// Compute the total polygon area per layer for the active cell.
    ///
    /// Recursively resolves all CellRef instances (including array references),
    /// converting paths to polygon ribbons, and accumulates area per
    /// `(layer_number, datatype)` pair. Respects [`hierarchy_depth_limit`] and
    /// [`hidden_cells`].
    ///
    /// Returns a flat `Float64Array`: `[layer0, datatype0, area0, layer1, datatype1, area1, ...]`
    /// sorted by layer number then datatype.
    pub fn get_area_by_layer(&self) -> Vec<f64> {
        let cell_name = match &self.active_cell {
            Some(name) => name,
            None => return Vec::new(),
        };

        let cell = match self.library.cell(cell_name) {
            Some(c) => c,
            None => return Vec::new(),
        };

        let mut area_map: HashMap<(u16, u16), f64> = HashMap::new();
        let identity = Transform::identity();
        let max_depth = self.hierarchy_depth_limit;

        self.collect_area_recursive(cell, &identity, 0, max_depth, &mut area_map);

        let mut pairs: Vec<_> = area_map.into_iter().collect();
        pairs.sort_by_key(|&((layer, dt), _)| (layer, dt));

        let mut result = Vec::with_capacity(pairs.len() * 3);
        for ((layer, dt), area) in pairs {
            result.push(layer as f64);
            result.push(dt as f64);
            result.push(area);
        }
        result
    }

    /// Get the path length metadata for a cell by name.
    ///
    /// Returns `None` if the cell does not exist or has no path length set.
    /// The returned value is in nanometers (matching the library's internal unit).
    pub fn get_cell_path_length(&self, cell_name: &str) -> Option<f64> {
        let cell = self.library.cell(cell_name)?;
        cell.path_length()
    }
}
