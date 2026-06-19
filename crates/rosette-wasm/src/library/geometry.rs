//! Geometry creation: rectangles, polygons, paths, and boolean operations.

use super::{ElementRef, REF_UUID_PREFIX, WasmLibrary, path};
use rosette_core::cell::Element;
use rosette_core::{Layer, Point, Polygon};
use uuid::Uuid;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl WasmLibrary {
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

        self.mark_dirty();
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

        self.mark_dirty();
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

        let polygon = path::constant_width_path(&centerline, width)?;

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

        self.mark_dirty();
        Some(uuid)
    }

    /// Create a path (waveguide) polygon with rounded corners from a centerline.
    ///
    /// Same as `create_path` but inserts circular arc points at interior corners
    /// before generating the ribbon polygon. If `corner_radius` is 0 the result
    /// is identical to `create_path`.
    ///
    /// Returns the element's UUID, or None if no active cell.
    pub fn create_path_rounded(
        &mut self,
        points: &[f64],
        width: f64,
        corner_radius: f64,
        num_arc_points: u32,
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

        let polygon =
            path::constant_width_path_rounded(&centerline, width, corner_radius, num_arc_points)?;

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

        self.mark_dirty();
        Some(uuid)
    }

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
        // Gather polygon data: (uuid, polygon, layer, datatype)
        let mut polys: Vec<(String, Polygon, u16, u16)> = Vec::new();

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
                    polys.push((id.clone(), polygon.clone(), layer.number, layer.datatype));
                }
                _ => continue, // Skip text, cell refs, paths
            }
        }

        if polys.len() < 2 {
            return Vec::new();
        }

        // Use the layer from the base element (for subtract) or first element
        // Order polygons: for subtract, base_id goes first
        if operation == "subtract"
            && let Some(pos) = polys.iter().position(|(id, _, _, _)| id == base_id)
        {
            polys.swap(0, pos);
        }
        let result_layer = polys[0].2;
        let result_datatype = polys[0].3;

        // Perform the boolean operation by pairwise reduction.
        //
        // We work in geo types for the reduction so that multi-polygon
        // results are treated as a single geometric entity at each step.
        // This is important for xor and union where distributing over
        // fragments would give wrong results.
        use geo::BooleanOps;
        use rosette_core::{polygon_to_geo, polygons_from_geo_multi};

        let mut result = geo::MultiPolygon::new(vec![polygon_to_geo(&polys[0].1)]);

        for (_id, poly, _layer, _dt) in polys.iter().skip(1) {
            let next = geo::MultiPolygon::new(vec![polygon_to_geo(poly)]);
            result = match operation {
                "union" => result.union(&next),
                "subtract" => result.difference(&next),
                "intersect" => result.intersection(&next),
                "xor" => result.xor(&next),
                _ => return Vec::new(),
            };
        }

        // Convert back to keyholed rosette polygons.
        let accumulated = polygons_from_geo_multi(&result);

        // Remove input elements
        let input_ids: Vec<String> = polys.iter().map(|(id, _, _, _)| id.clone()).collect();
        self.remove_elements(input_ids);

        // Add result polygons
        let mut new_ids: Vec<String> = Vec::new();
        for result_poly in &accumulated {
            let flat: Vec<f64> = result_poly
                .vertices()
                .iter()
                .flat_map(|p| [p.x, p.y])
                .collect();
            if let Some(uuid) = self.add_polygon(&flat, result_layer, result_datatype) {
                new_ids.push(uuid);
            }
        }

        new_ids
    }
}
