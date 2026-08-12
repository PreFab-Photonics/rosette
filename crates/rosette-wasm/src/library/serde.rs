//! Serialization: load from / export to JSON and GDS-II, with the
//! SDK(micrometre, Y-up) <-> world(GRID_SIZE, Y-down) coordinate conversion.

use super::{ElementRef, WasmLibrary};
use rosette_core::cell::Element;
use rosette_core::{BBox, BendInfo, CellRef, Library, Point, Port, Repetition, Transform};
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use uuid::Uuid;
use wasm_bindgen::prelude::*;

struct ConvertedCell {
    origin: Point,
    elements: Vec<Element>,
    ports: Vec<Port>,
    path_length: Option<f64>,
    bends: Vec<BendInfo>,
    waive_regions: Vec<BBox>,
}

fn convert_element_coordinates(
    element: &Element,
    coordinate_transform: &Transform,
    coordinate_inverse: &Transform,
    scalar: f64,
) -> Result<Element, JsValue> {
    match element {
        Element::Polygon { polygon, layer } => {
            if polygon
                .vertices()
                .iter()
                .map(|point| coordinate_transform.apply(*point))
                .any(|point| !point.is_finite())
            {
                return Err(JsValue::from_str(
                    "polygon coordinate conversion overflowed",
                ));
            }
            Ok(Element::Polygon {
                polygon: polygon
                    .try_transform(coordinate_transform)
                    .ok_or_else(|| JsValue::from_str("polygon coordinate conversion overflowed"))?,
                layer: *layer,
            })
        }
        Element::Path {
            points,
            width,
            layer,
            end_type,
        } => {
            let points: Vec<Point> = points
                .iter()
                .map(|point| coordinate_transform.apply(*point))
                .collect();
            let width = width * scalar;
            if points.iter().any(|point| !point.is_finite()) || !width.is_finite() || width == 0.0 {
                return Err(JsValue::from_str("path coordinate conversion overflowed"));
            }
            Ok(Element::Path {
                points,
                width,
                layer: *layer,
                end_type: *end_type,
            })
        }
        Element::CellRef(cell_ref) => {
            let transform = coordinate_transform
                .then(&cell_ref.transform)
                .then(coordinate_inverse);
            if !transform.is_invertible() {
                return Err(JsValue::from_str(
                    "cell reference coordinate conversion produced an invalid transform",
                ));
            }
            let repetition = match cell_ref.repetition {
                Some(repetition) => {
                    if repetition.columns == 0 || repetition.rows == 0 {
                        return Err(JsValue::from_str(
                            "cell reference repetition has a zero dimension",
                        ));
                    }
                    let col_vector = coordinate_transform.apply_linear(repetition.col_vector);
                    let row_vector = coordinate_transform.apply_linear(repetition.row_vector);
                    if !col_vector.is_finite() || !row_vector.is_finite() {
                        return Err(JsValue::from_str(
                            "cell reference repetition conversion overflowed",
                        ));
                    }
                    Some(Repetition::new_vectors(
                        repetition.columns,
                        repetition.rows,
                        col_vector,
                        row_vector,
                    ))
                }
                None => None,
            };
            Ok(Element::CellRef(
                CellRef::with_transform(cell_ref.cell_name.clone(), transform)
                    .with_repetition(repetition),
            ))
        }
        Element::Text {
            text,
            position,
            layer,
            height,
        } => {
            let position = coordinate_transform.apply(*position);
            let height = height * scalar;
            if !position.is_finite() || !height.is_finite() || height <= 0.0 {
                return Err(JsValue::from_str("text coordinate conversion overflowed"));
            }
            Ok(Element::Text {
                text: text.clone(),
                position,
                layer: *layer,
                height,
            })
        }
    }
}

fn convert_library_coordinates(
    library: &mut Library,
    coordinate_transform: Transform,
    coordinate_inverse: Transform,
    scalar: f64,
) -> Result<(), JsValue> {
    if !scalar.is_finite() || scalar <= 0.0 {
        return Err(JsValue::from_str(
            "coordinate conversion requires a positive finite scale",
        ));
    }

    let converted: Result<HashMap<String, ConvertedCell>, JsValue> = library
        .cells()
        .iter()
        .map(|cell| {
            let origin = coordinate_transform.apply(cell.origin());
            if !origin.is_finite() {
                return Err(JsValue::from_str("cell origin conversion overflowed"));
            }
            let elements = cell
                .elements()
                .iter()
                .map(|element| {
                    convert_element_coordinates(
                        element,
                        &coordinate_transform,
                        &coordinate_inverse,
                        scalar,
                    )
                })
                .collect::<Result<Vec<_>, _>>()?;
            let ports = cell
                .ports()
                .iter()
                .map(|port| {
                    let mut converted =
                        port.try_transform(&coordinate_transform).ok_or_else(|| {
                            JsValue::from_str("port coordinate conversion overflowed")
                        })?;
                    if let Some(width) = converted.width {
                        let width = width * scalar;
                        if !width.is_finite() || width <= 0.0 {
                            return Err(JsValue::from_str(
                                "port width coordinate conversion overflowed",
                            ));
                        }
                        converted.width = Some(width);
                    }
                    Ok(converted)
                })
                .collect::<Result<Vec<_>, _>>()?;
            let path_length = cell
                .path_length()
                .map(|length| {
                    let length = length * scalar;
                    length.is_finite().then_some(length).ok_or_else(|| {
                        JsValue::from_str("path length coordinate conversion overflowed")
                    })
                })
                .transpose()?;
            let bends = cell
                .bends()
                .iter()
                .map(|bend| {
                    let radius = bend.radius * scalar;
                    let position = coordinate_transform.apply(bend.position);
                    let requested_radius = bend.requested_radius.map(|radius| radius * scalar);
                    if !radius.is_finite()
                        || !position.is_finite()
                        || requested_radius.is_some_and(|radius| !radius.is_finite())
                    {
                        return Err(JsValue::from_str(
                            "bend annotation coordinate conversion overflowed",
                        ));
                    }
                    Ok(BendInfo {
                        radius,
                        position,
                        requested_radius,
                    })
                })
                .collect::<Result<Vec<_>, _>>()?;
            let waive_regions = cell
                .drc_waive_regions()
                .iter()
                .map(|region| {
                    region.try_transform(&coordinate_transform).ok_or_else(|| {
                        JsValue::from_str("DRC waiver coordinate conversion overflowed")
                    })
                })
                .collect::<Result<Vec<_>, _>>()?;
            Ok((
                cell.name().to_string(),
                ConvertedCell {
                    origin,
                    elements,
                    ports,
                    path_length,
                    bends,
                    waive_regions,
                },
            ))
        })
        .collect();
    let converted = converted?;

    let mut candidate = library.clone();
    let mut cell_error = None;
    candidate
        .edit_cells(|cell| {
            if cell_error.is_some() {
                return;
            }
            let converted = converted
                .get(cell.name())
                .expect("converted cell names match the source library");
            cell.set_origin(converted.origin);
            if let Err(error) =
                cell.edit_elements(|current| current.clone_from_slice(&converted.elements))
            {
                cell_error = Some(error);
                return;
            }
            if let Err(error) =
                cell.edit_ports(|current| current.clone_from_slice(&converted.ports))
            {
                cell_error = Some(error);
                return;
            }
            if let Some(path_length) = converted.path_length {
                cell.set_path_length(path_length);
            }
            if let Err(error) =
                cell.edit_bends(|current| current.clone_from_slice(&converted.bends))
            {
                cell_error = Some(error);
                return;
            }
            cell.set_drc_waive_regions(converted.waive_regions.clone());
        })
        .map_err(|error| JsValue::from_str(&error.to_string()))?;
    if let Some(error) = cell_error {
        return Err(JsValue::from_str(&error.to_string()));
    }
    *library = candidate;
    Ok(())
}

#[wasm_bindgen]
impl WasmLibrary {
    /// Load a full hierarchical library from JSON without flattening.
    ///
    /// This preserves all cells, cell references, paths, and text elements.
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

        Self::init_from_library(library)
    }

    /// Create a WasmLibrary directly from raw GDS binary bytes.
    ///
    /// This is the fast path for the Tauri desktop app: the raw file bytes
    /// are passed directly to WASM, avoiding the JSON serialization round-trip
    /// that `from_library_json` requires.
    pub fn from_gds_bytes(bytes: &[u8]) -> Result<WasmLibrary, JsValue> {
        let library = rosette_io::gds::read_bytes(bytes)
            .map_err(|e| JsValue::from_str(&format!("GDS parse error: {}", e)))?;

        Self::init_from_library(library)
    }

    /// Shared initialization: transform coordinates, build element refs, set active cell.
    ///
    /// Takes a `Library` in SDK coordinates (micrometers, Y-up) and produces a
    /// fully initialized `WasmLibrary` in world coordinates (nm * GRID_SIZE, Y-down).
    fn init_from_library(mut library: Library) -> Result<WasmLibrary, JsValue> {
        // Scale factor: SDK uses micrometers, app world units = nm * GRID_SIZE.
        // 1 μm = 1000 nm, and 1 nm = GRID_SIZE world units.
        // Y is negated: GDS/SDK use math convention (Y-up), renderer uses screen (Y-down).
        const UM_TO_NM: f64 = 1000.0;
        const GRID_SIZE: f64 = 50.0;
        let s = UM_TO_NM * GRID_SIZE;

        // Pre-compute the flip transforms once (used for CellRef conjugation)
        let flip = Transform::scale(s, -s);
        let flip_inv = Transform::scale(1.0 / s, -1.0 / s);

        convert_library_coordinates(&mut library, flip, flip_inv, s)?;

        // Import the V1 editor annotation into authoritative editor state.
        let cell_origins = library
            .cells()
            .iter()
            .map(|cell| (cell.name().to_string(), cell.origin()))
            .collect();
        library
            .edit_cells(|cell| cell.set_origin(Point::origin()))
            .map_err(|error| JsValue::from_str(&error.to_string()))?;

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

        // Prefer a persisted or unambiguous top, then the first graph root,
        // with a final fallback for rootless cycles and imported GDS.
        let active_cell = library
            .top_cell()
            .or_else(|| library.roots().into_iter().next())
            .or_else(|| library.cells().first())
            .map(|cell| cell.name().to_string());

        Ok(WasmLibrary {
            library,
            active_cell,
            cell_origins,
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
        })
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
        let mut library = self.library_with_origins()?;

        // Inverse scale: world -> um. s = UM_TO_NM * GRID_SIZE = 50000
        const UM_TO_NM: f64 = 1000.0;
        const GRID_SIZE: f64 = 50.0;
        let s = UM_TO_NM * GRID_SIZE;
        let inv = 1.0 / s;
        let inv_flip = Transform::scale(inv, -inv);
        let flip = Transform::scale(s, -s);

        convert_library_coordinates(&mut library, inv_flip, flip, inv)?;

        rosette_io::gds::write_bytes(&library)
            .map_err(|e| JsValue::from_str(&format!("GDS write error: {}", e)))
    }

    /// Export the library to JSON with coordinates in micrometers (GDS convention).
    ///
    /// The returned document follows the versioned `rosette-layout` schema.
    ///
    /// # Returns
    /// A JSON string with coordinates converted back to micrometers/Y-up.
    ///
    /// # Errors
    /// Returns a JsValue error if serialization fails.
    pub fn to_library_json(&self) -> Result<String, JsValue> {
        // Clone the library and apply inverse coordinate transform
        let mut library = self.library_with_origins()?;

        const UM_TO_NM: f64 = 1000.0;
        const GRID_SIZE: f64 = 50.0;
        let s = UM_TO_NM * GRID_SIZE;
        let inv = 1.0 / s;
        let inv_flip = Transform::scale(inv, -inv);
        let flip = Transform::scale(s, -s);

        convert_library_coordinates(&mut library, inv_flip, flip, inv)?;

        rosette_io::json::to_string(&library)
            .map_err(|e| JsValue::from_str(&format!("JSON serialize error: {}", e)))
    }
}

impl WasmLibrary {
    fn library_with_origins(&self) -> Result<Library, JsValue> {
        let mut library = self.library.clone();
        library
            .edit_cells(|cell| {
                cell.set_origin(
                    self.cell_origins
                        .get(cell.name())
                        .copied()
                        .unwrap_or_else(Point::origin),
                );
            })
            .map_err(|error| JsValue::from_str(&error.to_string()))?;
        Ok(library)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::{BBox, BendInfo, Cell, CellRef, Layer, PathEndType, Polygon, Port, Vector2};

    const CURRENT_LIBRARY: &str = include_str!("../../../../fixtures/json/current-library.json");
    const CYCLE: &str = include_str!("../../../../fixtures/json/cycle.json");
    const MULTI_ROOT: &str = include_str!("../../../../fixtures/json/multi-root.json");

    fn assert_close(actual: f64, expected: f64) {
        assert!((actual - expected).abs() < 1e-12, "{actual} != {expected}");
    }

    fn assert_point_close(actual: Point, expected: Point) {
        assert_close(actual.x, expected.x);
        assert_close(actual.y, expected.y);
    }

    #[test]
    fn hierarchical_json_round_trip_preserves_skew_repetition() {
        let wasm = WasmLibrary::from_library_json(CURRENT_LIBRARY).unwrap();
        let restored = rosette_io::json::from_string(&wasm.to_library_json().unwrap()).unwrap();

        assert_eq!(restored.cells().len(), 3);
        assert_eq!(restored.top_cell().unwrap().name(), "top");
        let refs: Vec<_> = restored.cell("top").unwrap().cell_refs().collect();
        let repetition = refs[1].repetition.unwrap();
        assert_eq!((repetition.columns, repetition.rows), (3, 2));
        assert!((repetition.col_vector.x - 8.0).abs() < 1e-12);
        assert!((repetition.col_vector.y - 1.0).abs() < 1e-12);
        assert!((repetition.row_vector.x - 2.0).abs() < 1e-12);
        assert!((repetition.row_vector.y - 6.0).abs() < 1e-12);
        assert_eq!(refs[2].cell_name, "missing");
    }

    #[test]
    fn hierarchical_json_round_trip_preserves_editor_origin() {
        let mut cell = Cell::new("origin");
        cell.set_origin(Point::new(1.25, -2.5));
        let mut library = Library::new("origin");
        library.add_cell(cell).unwrap();
        let json = rosette_io::json::to_string(&library).unwrap();

        let wasm = WasmLibrary::from_library_json(&json).unwrap();
        assert_eq!(wasm.get_cell_origin(), Some(vec![62500.0, 125000.0]));

        let restored = rosette_io::json::from_string(&wasm.to_library_json().unwrap()).unwrap();
        assert_eq!(
            restored.cell("origin").unwrap().origin(),
            Point::new(1.25, -2.5)
        );
    }

    #[test]
    fn coordinate_round_trip_preserves_ports_route_and_drc_annotations() {
        let mut cell = Cell::new("annotated");
        cell.add_port(Port::with_width(
            "opt",
            Point::new(1.0, 2.0),
            Vector2::unit_y(),
            0.4,
        ));
        cell.set_path_length(7.25);
        cell.add_bend(BendInfo::auto_reduced(3.0, Point::new(3.0, 4.0), 4.0));
        cell.add_drc_waive_region(BBox::new(Point::new(1.0, 2.0), Point::new(3.0, 5.0)));
        let mut library = Library::new("annotations");
        library.add_cell(cell).unwrap();

        let json = rosette_io::json::to_string(&library).unwrap();
        let wasm = WasmLibrary::from_library_json(&json).unwrap();
        let world = wasm.library.cell("annotated").unwrap();
        let port = &world.ports()[0];
        assert_eq!(port.position, Point::new(50_000.0, -100_000.0));
        assert_eq!(port.direction, Vector2::new(0.0, -1.0));
        assert_eq!(port.width, Some(20_000.0));
        assert_eq!(world.path_length(), Some(362_500.0));
        assert_eq!(wasm.get_cell_path_length("annotated"), Some(7_250.0));
        assert_eq!(world.bends()[0].radius, 150_000.0);
        assert_eq!(world.bends()[0].position, Point::new(150_000.0, -200_000.0));
        assert_eq!(world.bends()[0].requested_radius, Some(200_000.0));
        assert_eq!(
            world.drc_waive_regions()[0],
            BBox::new(
                Point::new(50_000.0, -250_000.0),
                Point::new(150_000.0, -100_000.0),
            )
        );

        let restored = rosette_io::json::from_string(&wasm.to_library_json().unwrap()).unwrap();
        let restored = restored.cell("annotated").unwrap();
        assert_point_close(restored.ports()[0].position, Point::new(1.0, 2.0));
        assert_eq!(restored.ports()[0].direction, Vector2::unit_y());
        assert_close(restored.ports()[0].width.unwrap(), 0.4);
        assert_close(restored.path_length().unwrap(), 7.25);
        assert_close(restored.bends()[0].radius, 3.0);
        assert_point_close(restored.bends()[0].position, Point::new(3.0, 4.0));
        assert_close(restored.bends()[0].requested_radius.unwrap(), 4.0);
        assert_point_close(restored.drc_waive_regions()[0].min(), Point::new(1.0, 2.0));
        assert_point_close(restored.drc_waive_regions()[0].max(), Point::new(3.0, 5.0));
    }

    #[test]
    fn coordinate_round_trip_preserves_element_semantics_and_order() {
        let mut child = Cell::new("child");
        child.add_polygon(
            Polygon::new(vec![
                Point::origin(),
                Point::new(1.0, 0.0),
                Point::new(0.0, 1.0),
            ]),
            Layer::new(10, 0),
        );

        let mut top = Cell::new("top");
        top.set_origin(Point::new(1.25, -2.5));
        top.add_polygon(
            Polygon::new(vec![
                Point::new(1.0, 2.0),
                Point::new(3.0, 2.0),
                Point::new(3.0, 4.0),
            ]),
            Layer::new(1, 2),
        );
        top.add_path(
            vec![Point::new(-1.0, 2.0), Point::new(5.0, -6.0)],
            -2.0,
            Layer::new(3, 4),
            PathEndType::Round,
        );
        top.add_ref(
            CellRef::with_transform("child", Transform::new(0.0, -1.0, 1.0, 0.0, 3.0, -4.0))
                .with_repetition(Some(Repetition::new_vectors(
                    3,
                    2,
                    rosette_core::Vector2::new(8.0, 1.0),
                    rosette_core::Vector2::new(2.0, 6.0),
                ))),
        );
        top.add_text_with_height("label", Point::new(7.0, -8.0), Layer::new(5, 6), 9.0);

        let mut source = Library::new("round-trip");
        source.add_cell(child).unwrap();
        source.add_cell(top).unwrap();
        let json = rosette_io::json::to_string(&source).unwrap();
        let wasm = WasmLibrary::from_library_json(&json).unwrap();

        assert_eq!(wasm.get_cell_origin(), Some(vec![62500.0, 125000.0]));
        let world_top = wasm.library.cell("top").unwrap();
        assert_eq!(world_top.elements().len(), 4);
        let Element::Polygon { polygon, .. } = &world_top.elements()[0] else {
            panic!("polygon order changed");
        };
        assert_eq!(polygon.vertices()[0], Point::new(50000.0, -100000.0));
        let Element::Path { points, width, .. } = &world_top.elements()[1] else {
            panic!("path order changed");
        };
        assert_eq!(points[0], Point::new(-50000.0, -100000.0));
        assert_eq!(*width, -100000.0);
        let Element::CellRef(cell_ref) = &world_top.elements()[2] else {
            panic!("cell reference order changed");
        };
        assert_eq!(
            cell_ref.transform,
            Transform::new(0.0, 1.0, -1.0, 0.0, 150000.0, 200000.0)
        );
        let repetition = cell_ref.repetition.unwrap();
        assert_eq!(
            repetition.col_vector,
            rosette_core::Vector2::new(400000.0, -50000.0)
        );
        assert_eq!(
            repetition.row_vector,
            rosette_core::Vector2::new(100000.0, -300000.0)
        );
        let Element::Text {
            position, height, ..
        } = &world_top.elements()[3]
        else {
            panic!("text order changed");
        };
        assert_eq!(*position, Point::new(350000.0, 400000.0));
        assert_eq!(*height, 450000.0);
        assert_eq!(wasm.element_refs.len(), 5);

        let restored: Library =
            rosette_io::json::from_string(&wasm.to_library_json().unwrap()).unwrap();
        let restored_top = restored.cell("top").unwrap();
        assert_eq!(restored_top.origin(), Point::new(1.25, -2.5));
        assert!(matches!(
            restored_top.elements()[0],
            Element::Polygon { .. }
        ));
        let Element::Path { points, width, .. } = &restored_top.elements()[1] else {
            panic!("path order changed after round trip");
        };
        for (actual, expected) in points
            .iter()
            .zip([Point::new(-1.0, 2.0), Point::new(5.0, -6.0)])
        {
            assert!((actual.x - expected.x).abs() < 1e-12);
            assert!((actual.y - expected.y).abs() < 1e-12);
        }
        assert!((*width + 2.0).abs() < 1e-12);
        let Element::CellRef(cell_ref) = &restored_top.elements()[2] else {
            panic!("cell reference order changed after round trip");
        };
        let expected_transform = [0.0, -1.0, 1.0, 0.0, 3.0, -4.0];
        let actual_transform = [
            cell_ref.transform.a,
            cell_ref.transform.b,
            cell_ref.transform.c,
            cell_ref.transform.d,
            cell_ref.transform.tx,
            cell_ref.transform.ty,
        ];
        for (actual, expected) in actual_transform.into_iter().zip(expected_transform) {
            assert!((actual - expected).abs() < 1e-12);
        }
        assert_eq!(cell_ref.repetition.unwrap().columns, 3);
        let Element::Text {
            position, height, ..
        } = &restored_top.elements()[3]
        else {
            panic!("text order changed after round trip");
        };
        assert!((position.x - 7.0).abs() < 1e-12);
        assert!((position.y + 8.0).abs() < 1e-12);
        assert!((*height - 9.0).abs() < 1e-12);
    }

    #[test]
    fn hierarchy_edge_case_fixtures_are_accepted() {
        let cycle = WasmLibrary::from_library_json(CYCLE).unwrap();
        assert_eq!(cycle.library.cells().len(), 2);
        assert!(cycle.get_all_bounds().is_none());
        assert!(cycle.get_render_polygons_internal().is_empty());
        assert!(cycle.get_all_vertices().is_empty());

        let multi_root = WasmLibrary::from_library_json(MULTI_ROOT).unwrap();
        assert_eq!(multi_root.library.cells().len(), 2);
        assert_eq!(multi_root.active_cell.as_deref(), Some("root_b"));
        assert_eq!(
            multi_root.library.explicit_top_cell().unwrap().name(),
            "root_b"
        );
    }

    #[test]
    fn removing_a_missing_cell_does_not_strip_dangling_references() {
        let mut library = WasmLibrary::from_library_json(CURRENT_LIBRARY).unwrap();

        assert_eq!(library.remove_cell_cascade("missing"), 0);
        assert!(
            library
                .library
                .cell("top")
                .unwrap()
                .cell_refs()
                .any(|cell_ref| cell_ref.cell_name == "missing")
        );
    }

    #[test]
    fn removing_a_self_referencing_cell_leaves_no_stale_element_ids() {
        let mut cell = Cell::new("self_ref");
        cell.add_ref(CellRef::new("self_ref"));
        let mut core = Library::new("test");
        core.add_cell(cell).unwrap();
        let json = rosette_io::json::to_string(&core).unwrap();
        let mut library = WasmLibrary::from_library_json(&json).unwrap();

        assert!(!library.element_refs.is_empty());
        assert_eq!(library.remove_cell_cascade("self_ref"), 1);
        assert!(library.element_refs.is_empty());
    }

    #[test]
    fn geometry_cycle_does_not_reenter_the_active_cell() {
        let mut cell_a = Cell::new("A");
        cell_a.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));
        cell_a.add_ref(CellRef::new("B"));
        let mut cell_b = Cell::new("B");
        cell_b.add_polygon(
            Polygon::rect(Point::new(10.0, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        cell_b.add_ref(CellRef::new("A"));
        let mut library = Library::new("cycle");
        library.add_cell(cell_a).unwrap();
        library.add_cell(cell_b).unwrap();
        let json = rosette_io::json::to_string(&library).unwrap();

        let wasm = WasmLibrary::from_library_json(&json).unwrap();
        assert_eq!(wasm.active_cell.as_deref(), Some("A"));
        assert_eq!(wasm.get_render_polygons_internal().len(), 2);
        assert!(wasm.get_all_bounds().is_some());
    }
}
