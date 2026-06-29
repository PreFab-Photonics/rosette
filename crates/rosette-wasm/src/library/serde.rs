//! Serialization: load from / export to JSON and GDS-II, with the
//! SDK(micrometre, Y-up) <-> world(GRID_SIZE, Y-down) coordinate conversion.

use super::{ElementRef, WasmLibrary};
use rosette_core::cell::Element;
use rosette_core::geometry::Vector2;
use rosette_core::{Library, Point, Transform};
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use uuid::Uuid;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl WasmLibrary {
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

                        // Transform repetition lattice vectors (in the CellRef's
                        // local pre-transform space, matching GDS AREF semantics):
                        // scale X, scale+negate Y, for each vector component.
                        if let Some(ref mut rep) = cell_ref.repetition {
                            rep.col_vector =
                                Vector2::new(rep.col_vector.x * s, -rep.col_vector.y * s);
                            rep.row_vector =
                                Vector2::new(rep.row_vector.x * s, -rep.row_vector.y * s);
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
            hierarchy_depth_limit: 0,
            hidden_cells: HashSet::new(),
            cell_image_bounds: HashMap::new(),
            instance_bbox_cache: RefCell::new(HashMap::new()),
            instance_bbox_cache_cell: RefCell::new(None),
            spatial_index: RefCell::new(None),
            spatial_index_cell: RefCell::new(None),
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

                        // Inverse of the Y-flip + unit-scale applied on import:
                        // scale X by `inv`, scale+negate Y. Applied per-component
                        // of each lattice vector (supports skewed/hex AREFs).
                        if let Some(ref mut rep) = cell_ref.repetition {
                            rep.col_vector =
                                Vector2::new(rep.col_vector.x * inv, -rep.col_vector.y * inv);
                            rep.row_vector =
                                Vector2::new(rep.row_vector.x * inv, -rep.row_vector.y * inv);
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

                        // Inverse of the Y-flip + unit-scale applied on import:
                        // scale X by `inv`, scale+negate Y. Applied per-component
                        // of each lattice vector (supports skewed/hex AREFs).
                        if let Some(ref mut rep) = cell_ref.repetition {
                            rep.col_vector =
                                Vector2::new(rep.col_vector.x * inv, -rep.col_vector.y * inv);
                            rep.row_vector =
                                Vector2::new(rep.row_vector.x * inv, -rep.row_vector.y * inv);
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
}
