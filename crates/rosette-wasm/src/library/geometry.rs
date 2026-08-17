//! Geometry creation: rectangles, polygons, paths, and boolean operations.

use super::{ElementRef, REF_UUID_PREFIX, WasmLibrary, path};
use rosette_core::cell::Element;
use rosette_core::{Layer, PathEndType, Point, Polygon};
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
        if ![x, y, width, height, x + width, y + height]
            .iter()
            .all(|value| value.is_finite())
        {
            return None;
        }
        let cell_name = self.active_cell.clone()?;

        let polygon = Polygon::rect(Point::new(x, y), width, height);
        let layer_spec = Layer::new(layer, datatype);

        let element_index = self
            .library
            .edit_cell(&cell_name, |cell| {
                cell.add_polygon(polygon, layer_spec);
                // Use actual element index, not polygon_count(), because the cell
                // may contain mixed element types (CellRef, Path, etc.).
                cell.elements().len() - 1
            })
            .ok()?;
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

    /// Add a polygon to the active cell.
    ///
    /// Points are provided as a flat array: [x0, y0, x1, y1, ...].
    /// Returns the element's UUID, or None if no active cell or invalid points.
    pub fn add_polygon(&mut self, points: &[f64], layer: u16, datatype: u16) -> Option<String> {
        if points.len() < 6
            || !points.len().is_multiple_of(2)
            || !points.iter().all(|value| value.is_finite())
        {
            return None; // Need at least 3 points
        }

        let cell_name = self.active_cell.clone()?;

        let vertices: Vec<Point> = points
            .chunks(2)
            .map(|chunk| Point::new(chunk[0], chunk[1]))
            .collect();

        let polygon = Polygon::new(vertices);
        let layer_spec = Layer::new(layer, datatype);

        let element_index = self
            .library
            .edit_cell(&cell_name, |cell| {
                cell.add_polygon(polygon, layer_spec);
                // Use actual element index, not polygon_count(), because the cell
                // may contain mixed element types (CellRef, Path, etc.).
                cell.elements().len() - 1
            })
            .ok()?;
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
        if points.len() < 4
            || !points.len().is_multiple_of(2)
            || !points.iter().all(|value| value.is_finite())
            || !width.is_finite()
            || width == 0.0
        {
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
        let element_index = self
            .library
            .edit_cell(&cell_name, |cell| {
                cell.add_polygon(polygon, layer_spec);
                cell.elements().len() - 1
            })
            .ok()?;
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
        if points.len() < 4
            || !points.len().is_multiple_of(2)
            || !points.iter().all(|value| value.is_finite())
            || !width.is_finite()
            || width == 0.0
            || !corner_radius.is_finite()
            || corner_radius < 0.0
        {
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
        let element_index = self
            .library
            .edit_cell(&cell_name, |cell| {
                cell.add_polygon(polygon, layer_spec);
                cell.elements().len() - 1
            })
            .ok()?;
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

    /// Restore an imported/native path as a centerline record.
    ///
    /// Unlike `create_path`, this preserves the path element kind, signed
    /// width, and GDS end type instead of lowering it to a polygon.
    pub fn restore_native_path(
        &mut self,
        points: &[f64],
        width: f64,
        end_type: u8,
        layer: u16,
        datatype: u16,
    ) -> Option<String> {
        if points.len() < 4
            || !points.len().is_multiple_of(2)
            || !points.iter().all(|value| value.is_finite())
            || !width.is_finite()
            || width == 0.0
        {
            return None;
        }
        let end_type = match end_type {
            0 => PathEndType::Flush,
            1 => PathEndType::Round,
            2 => PathEndType::HalfWidthExtension,
            _ => return None,
        };
        let centerline = points
            .chunks_exact(2)
            .map(|point| Point::new(point[0], point[1]))
            .collect();
        let cell_name = self.active_cell.clone()?;
        let element_index = self
            .library
            .edit_cell(&cell_name, |cell| {
                cell.add_path(centerline, width, Layer::new(layer, datatype), end_type);
                cell.elements().len() - 1
            })
            .ok()?;
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

    /// Generate canonical rounded-path preview vertices without mutating the library.
    pub fn path_preview(
        &self,
        points: &[f64],
        width: f64,
        corner_radius: f64,
        num_arc_points: u32,
    ) -> Vec<f64> {
        if points.len() < 4
            || !points.len().is_multiple_of(2)
            || !points.iter().all(|value| value.is_finite())
            || !width.is_finite()
            || width == 0.0
            || !corner_radius.is_finite()
            || corner_radius < 0.0
        {
            return Vec::new();
        }
        let centerline: Vec<Point> = points
            .chunks_exact(2)
            .map(|chunk| Point::new(chunk[0], chunk[1]))
            .collect();
        path::constant_width_path_rounded(&centerline, width, corner_radius, num_arc_points)
            .map(|polygon| {
                polygon
                    .vertices()
                    .iter()
                    .flat_map(|point| [point.x, point.y])
                    .collect()
            })
            .unwrap_or_default()
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

        // Reduce through Region so holes and multi-polygon topology survive
        // until the result is explicitly lowered to layout polygons.
        use rosette_core::geometry::Region;

        let mut result = Region::from_polygon(&polys[0].1);

        for (_id, poly, _layer, _dt) in polys.iter().skip(1) {
            let next = Region::from_polygon(poly);
            result = match operation {
                "union" => result.union(&next),
                "subtract" => result.subtract(&next),
                "intersect" => result.intersect(&next),
                "xor" => result.xor(&next),
                _ => return Vec::new(),
            };
        }

        // Convert back to keyholed rosette polygons.
        let accumulated = result.to_keyholed_polygons();

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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn path_preview_matches_created_geometry_and_rejects_odd_coordinates() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("top").unwrap();
        let points = [0.0, 0.0, 10.0, 0.0, 10.0, 10.0];

        let preview = library.path_preview(&points, 2.0, 0.0, 64);
        let id = library
            .create_path_rounded(&points, 2.0, 0.0, 64, 1, 0)
            .unwrap();
        assert_eq!(library.get_element_vertices(&id).unwrap(), preview);

        assert!(
            library
                .path_preview(&[0.0, 0.0, 1.0], 2.0, 0.0, 64)
                .is_empty()
        );
        assert!(library.create_path(&[0.0, 0.0, 1.0], 2.0, 1, 0).is_none());
        assert!(
            library
                .add_polygon(&[0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 2.0], 1, 0)
                .is_none()
        );
        assert!(
            library
                .add_polygon(&[0.0, 0.0, 1.0, 0.0, f64::NAN, 1.0], 1, 0)
                .is_none()
        );
        assert!(library.create_path(&points, 0.0, 1, 0).is_none());
        assert!(
            library
                .add_rectangle(f64::INFINITY, 0.0, 1.0, 1.0, 1, 0)
                .is_none()
        );

        let extreme = [f64::MAX, 0.0, f64::MAX, 1.0];
        assert!(
            library
                .path_preview(&extreme, f64::MAX / 2.0, 0.0, 64)
                .is_empty()
        );
        assert!(
            library
                .create_path(&extreme, f64::MAX / 2.0, 1, 0)
                .is_none()
        );
        assert!(
            library
                .create_path_rounded(&extreme, f64::MAX / 2.0, 1.0, 64, 1, 0)
                .is_none()
        );
        assert_eq!(library.library.cell("top").unwrap().elements().len(), 1);
    }

    #[test]
    fn synthetic_polygon_ids_ignore_text_elements() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_text("label", 0.0, 0.0, 1.0, 10, 0).unwrap();
        library
            .add_polygon(&[0.0, 0.0, 2.0, 0.0, 2.0, 2.0, 0.0, 2.0], 1, 0)
            .unwrap();
        library.add_cell("top").unwrap();
        assert!(library.set_active_cell("top"));
        library
            .add_cell_ref_with_transform("child", vec![1.0, 0.0, 0.0, 1.0, 0.0, 0.0])
            .unwrap();

        let rendered = library.get_render_polygons_internal();
        assert_eq!(rendered.len(), 1);
        let synthetic_id = library.get_all_ids().pop().unwrap();
        assert_eq!(rendered[0].0, synthetic_id);
        assert!(synthetic_id.starts_with("ref:0:0:"));
        assert!(library.get_element_vertices(&synthetic_id).is_some());
    }

    #[test]
    fn native_path_restore_and_ordered_ids_preserve_exact_element_records() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library.add_cell("top").unwrap();
        assert!(library.set_active_cell("top"));

        let polygon_id = library
            .add_polygon(&[0.0, 0.0, 1.0, 0.0, 1.0, 1.0], 1, 2)
            .unwrap();
        let ref_id = library.add_cell_ref("child", 3.0, 4.0).unwrap();
        let path_id = library
            .restore_native_path(&[5.0, 6.0, 7.0, 8.0], -9.0, 2, 10, 11)
            .unwrap();
        let text_id = library.add_text("tail", 12.0, 13.0, 14.0, 15, 16).unwrap();

        assert_eq!(
            library.get_all_ids(),
            vec![
                polygon_id,
                library.get_canonical_element_id(&ref_id).unwrap(),
                path_id.clone(),
                text_id,
            ]
        );
        let path = library.get_native_path_info(&path_id).unwrap();
        assert_eq!(path.centerline(), vec![5.0, 6.0, 7.0, 8.0]);
        assert_eq!(path.width(), -9.0);
        assert_eq!(path.end_type(), 2);
        assert_eq!((path.layer(), path.datatype()), (10, 11));

        let elements = library.library.cell("top").unwrap().elements();
        assert!(matches!(elements[0], Element::Polygon { .. }));
        assert!(matches!(elements[1], Element::CellRef(_)));
        assert!(matches!(elements[2], Element::Path { .. }));
        assert!(matches!(elements[3], Element::Text { .. }));
    }

    #[test]
    fn extreme_finite_instance_transforms_skip_polygons_without_panicking() {
        let mut library = WasmLibrary::new("test");
        library.add_cell("child").unwrap();
        library
            .add_polygon(&[1.0, 0.0, 2.0, 0.0, 1.0, 1.0], 1, 0)
            .unwrap();
        library.add_cell("top").unwrap();
        assert!(library.set_active_cell("top"));
        let real_id = library
            .add_cell_ref_with_transform("child", vec![f64::MAX, 0.0, 0.0, 1.0, 0.0, 0.0])
            .unwrap();
        let synthetic_id = library.get_canonical_element_id(&real_id).unwrap();

        assert!(library.get_render_polygons_internal().is_empty());
        assert!(library.get_element_vertices(&synthetic_id).is_none());
        assert!(library.get_all_vertices().is_empty());
        assert!(library.flatten_active_cell());
        assert!(library.library.cell("top").unwrap().elements().is_empty());
    }
}
