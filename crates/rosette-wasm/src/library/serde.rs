//! Serialization: load from / export to JSON and GDS-II, with the
//! SDK(micrometre, Y-up) <-> world(GRID_SIZE, Y-down) coordinate conversion.

use super::{ElementRef, WasmLibrary};
use rosette_core::cell::Element;
use rosette_core::{
    CellRef, Library, PathElement, Point, Port, Repetition, TextElement, Transform,
};
use rosette_io::json::{CellAnnotations, LayoutDocument};
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use std::convert::Infallible;
use uuid::Uuid;
use wasm_bindgen::prelude::*;

const UM_TO_WORLD: f64 = 50_000.0;

struct ConvertedCell {
    elements: Vec<Element>,
    ports: Vec<Port>,
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
                    .map_err(|_| JsValue::from_str("polygon coordinate conversion overflowed"))?,
                layer: *layer,
            })
        }
        Element::Path(path) => {
            let points: Vec<Point> = path
                .points()
                .iter()
                .map(|point| coordinate_transform.apply(*point))
                .collect();
            let width = path.width() * scalar;
            if points.iter().any(|point| !point.is_finite()) || !width.is_finite() || width == 0.0 {
                return Err(JsValue::from_str("path coordinate conversion overflowed"));
            }
            PathElement::new(points, width, path.layer(), path.end_type())
                .map(Element::Path)
                .map_err(|error| JsValue::from_str(&error.to_string()))
        }
        Element::CellRef(cell_ref) => {
            let transform = coordinate_transform
                .then(&cell_ref.transform())
                .then(coordinate_inverse);
            if !transform.is_invertible() {
                return Err(JsValue::from_str(
                    "cell reference coordinate conversion produced an invalid transform",
                ));
            }
            let repetition = match cell_ref.repetition() {
                Some(repetition) => {
                    let col_vector = coordinate_transform.apply_linear(repetition.col_vector());
                    let row_vector = coordinate_transform.apply_linear(repetition.row_vector());
                    if !col_vector.is_finite() || !row_vector.is_finite() {
                        return Err(JsValue::from_str(
                            "cell reference repetition conversion overflowed",
                        ));
                    }
                    Some(
                        Repetition::new_vectors(
                            repetition.columns(),
                            repetition.rows(),
                            col_vector,
                            row_vector,
                        )
                        .map_err(|error| JsValue::from_str(&error.to_string()))?,
                    )
                }
                None => None,
            };
            CellRef::with_transform(cell_ref.cell_name(), transform)
                .map(|cell_ref| Element::CellRef(cell_ref.with_repetition(repetition)))
                .map_err(|error| JsValue::from_str(&error.to_string()))
        }
        Element::Text(text) => {
            let position = coordinate_transform.apply(text.position());
            let height = text.height() * scalar;
            if !position.is_finite() || !height.is_finite() || height <= 0.0 {
                return Err(JsValue::from_str("text coordinate conversion overflowed"));
            }
            TextElement::new(text.text(), position, text.layer(), height)
                .map(Element::Text)
                .map_err(|error| JsValue::from_str(&error.to_string()))
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
                    let mut converted = port
                        .try_transform(&coordinate_transform)
                        .map_err(|_| JsValue::from_str("port coordinate conversion overflowed"))?;
                    if let Some(width) = converted.width() {
                        let width = width * scalar;
                        if !width.is_finite() || width <= 0.0 {
                            return Err(JsValue::from_str(
                                "port width coordinate conversion overflowed",
                            ));
                        }
                        converted
                            .set_width(Some(width))
                            .map_err(|error| JsValue::from_str(&error.to_string()))?;
                    }
                    Ok(converted)
                })
                .collect::<Result<Vec<_>, _>>()?;
            Ok((cell.name().to_string(), ConvertedCell { elements, ports }))
        })
        .collect();
    let converted = converted?;

    library
        .edit_cells(
            |cell| -> Result<_, rosette_core::CellEditError<Infallible>> {
                let converted = converted
                    .get(cell.name())
                    .expect("converted cell names match the source library");
                cell.edit_elements(|current| {
                    current.clone_from_slice(&converted.elements);
                    Ok::<_, Infallible>(())
                })?;
                cell.edit_ports(|current| {
                    current.clone_from_slice(&converted.ports);
                    Ok::<_, Infallible>(())
                })?;
                Ok(())
            },
        )
        .map_err(|error| JsValue::from_str(&error.to_string()))?;
    Ok(())
}

fn convert_annotation_coordinates(
    annotations: &mut HashMap<String, CellAnnotations>,
    coordinate_transform: &Transform,
    scalar: f64,
) -> Result<(), JsValue> {
    if !scalar.is_finite() || scalar <= 0.0 {
        return Err(JsValue::from_str(
            "coordinate conversion requires a positive finite scale",
        ));
    }

    let mut candidate = annotations.clone();
    for cell_annotations in candidate.values_mut() {
        if let Some(path_length) = cell_annotations.route.path_length.as_mut() {
            *path_length *= scalar;
            if !path_length.is_finite() {
                return Err(JsValue::from_str(
                    "path length coordinate conversion overflowed",
                ));
            }
        }

        for bend in &mut cell_annotations.route.bends {
            bend.radius *= scalar;
            bend.position = coordinate_transform.apply(bend.position);
            if let Some(requested_radius) = bend.requested_radius.as_mut() {
                *requested_radius *= scalar;
            }
            if !bend.radius.is_finite()
                || !bend.position.is_finite()
                || bend
                    .requested_radius
                    .is_some_and(|requested_radius| !requested_radius.is_finite())
            {
                return Err(JsValue::from_str(
                    "bend annotation coordinate conversion overflowed",
                ));
            }
        }

        cell_annotations.drc.waive_regions = cell_annotations
            .drc
            .waive_regions
            .iter()
            .map(|region| {
                region
                    .try_transform(coordinate_transform)
                    .map_err(|_| JsValue::from_str("DRC waiver coordinate conversion overflowed"))
            })
            .collect::<Result<Vec<_>, _>>()?;

        cell_annotations.editor.origin = coordinate_transform.apply(cell_annotations.editor.origin);
        if !cell_annotations.editor.origin.is_finite() {
            return Err(JsValue::from_str(
                "cell origin coordinate conversion overflowed",
            ));
        }
    }

    *annotations = candidate;
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
        let document = rosette_io::json::from_string(json)
            .map_err(|error| JsValue::from_str(&format!("JSON parse error: {error}")))?;
        Self::init_from_document(document)
    }

    /// Create a WasmLibrary directly from raw GDS binary bytes.
    ///
    /// This is the fast path for the Tauri desktop app: the raw file bytes
    /// are passed directly to WASM, avoiding the JSON serialization round-trip
    /// that `from_library_json` requires.
    pub fn from_gds_bytes(bytes: &[u8]) -> Result<WasmLibrary, JsValue> {
        let library = rosette_io::gds::read_bytes(bytes)
            .map_err(|error| JsValue::from_str(&format!("GDS parse error: {error}")))?;
        let document = LayoutDocument::from_library(library)
            .map_err(|error| JsValue::from_str(&error.to_string()))?;
        Self::init_from_document(document)
    }

    fn init_from_document(document: LayoutDocument) -> Result<WasmLibrary, JsValue> {
        let (mut library, mut annotations) = document.into_parts();
        let sdk_to_world = Transform::scale(UM_TO_WORLD, -UM_TO_WORLD);
        let world_to_sdk = Transform::scale(1.0 / UM_TO_WORLD, -1.0 / UM_TO_WORLD);
        convert_library_coordinates(&mut library, sdk_to_world, world_to_sdk, UM_TO_WORLD)?;
        convert_annotation_coordinates(&mut annotations, &sdk_to_world, UM_TO_WORLD)?;

        let total_elements: usize = library
            .cells()
            .iter()
            .map(|cell| cell.elements().len())
            .sum();
        let mut element_refs = HashMap::with_capacity(total_elements);
        for cell in library.cells() {
            let cell_name = cell.name().to_string();
            for element_index in 0..cell.elements().len() {
                element_refs.insert(
                    Uuid::new_v4().to_string(),
                    ElementRef {
                        cell_name: cell_name.clone(),
                        element_index,
                    },
                );
            }
        }

        let active_cell = library
            .top_cell()
            .or_else(|| library.roots().into_iter().next())
            .or_else(|| library.cells().first())
            .map(|cell| cell.name().to_string());

        Ok(WasmLibrary {
            library,
            active_cell,
            annotations,
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
        let mut library = self.library.clone();
        let world_to_sdk = Transform::scale(1.0 / UM_TO_WORLD, -1.0 / UM_TO_WORLD);
        let sdk_to_world = Transform::scale(UM_TO_WORLD, -UM_TO_WORLD);
        convert_library_coordinates(&mut library, world_to_sdk, sdk_to_world, 1.0 / UM_TO_WORLD)?;

        rosette_io::gds::write_bytes(&library)
            .map_err(|error| JsValue::from_str(&format!("GDS write error: {error}")))
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
        let mut library = self.library.clone();
        let mut annotations = self.annotations.clone();
        let world_to_sdk = Transform::scale(1.0 / UM_TO_WORLD, -1.0 / UM_TO_WORLD);
        let sdk_to_world = Transform::scale(UM_TO_WORLD, -UM_TO_WORLD);
        convert_library_coordinates(&mut library, world_to_sdk, sdk_to_world, 1.0 / UM_TO_WORLD)?;
        convert_annotation_coordinates(&mut annotations, &world_to_sdk, 1.0 / UM_TO_WORLD)?;

        let document = LayoutDocument::from_parts(library, annotations)
            .map_err(|error| JsValue::from_str(&format!("JSON serialize error: {error}")))?;
        rosette_io::json::to_string(&document)
            .map_err(|error| JsValue::from_str(&format!("JSON serialize error: {error}")))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::{BBox, Cell, CellRef, Layer, PathEndType, Polygon, Port, Vector2};
    use rosette_io::json::{BendAnnotation, DrcAnnotations, EditorAnnotations, RouteAnnotations};

    const CURRENT_LIBRARY: &str = include_str!("../../../../fixtures/json/current-library.json");
    const CYCLE: &str = include_str!("../../../../fixtures/json/cycle.json");
    const MULTI_ROOT: &str = include_str!("../../../../fixtures/json/multi-root.json");

    fn document(library: Library) -> LayoutDocument {
        LayoutDocument::from_library(library).unwrap()
    }

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
        let library = restored.library();

        assert_eq!(library.cells().len(), 3);
        assert_eq!(library.top_cell().unwrap().name(), "top");
        let refs: Vec<_> = library.cell("top").unwrap().cell_refs().collect();
        let repetition = refs[1].repetition().unwrap();
        assert_eq!((repetition.columns(), repetition.rows()), (3, 2));
        assert_close(repetition.col_vector().x, 8.0);
        assert_close(repetition.col_vector().y, 1.0);
        assert_close(repetition.row_vector().x, 2.0);
        assert_close(repetition.row_vector().y, 6.0);
        assert_eq!(refs[2].cell_name(), "missing");

        assert_eq!(
            restored.annotations()["leaf"].route.warnings,
            ["radius reduced"]
        );
        assert!(restored.annotations()["leaf"].drc.skip);
    }

    #[test]
    fn hierarchical_json_round_trip_preserves_editor_origin() {
        let mut library = Library::new("origin");
        library.add_cell(Cell::new("origin").unwrap()).unwrap();
        let mut source = document(library);
        source
            .annotations_mut()
            .get_mut("origin")
            .unwrap()
            .editor
            .origin = Point::new(1.25, -2.5);
        let json = rosette_io::json::to_string(&source).unwrap();

        let wasm = WasmLibrary::from_library_json(&json).unwrap();
        assert_eq!(wasm.get_cell_origin(), Some(vec![62_500.0, 125_000.0]));
        assert_eq!(
            wasm.annotations["origin"].editor.origin,
            Point::new(62_500.0, 125_000.0)
        );

        let restored = rosette_io::json::from_string(&wasm.to_library_json().unwrap()).unwrap();
        assert_eq!(
            restored.annotations()["origin"].editor.origin,
            Point::new(1.25, -2.5)
        );
    }

    #[test]
    fn coordinate_round_trip_preserves_ports_route_and_drc_annotations() {
        let mut cell = Cell::new("annotated").unwrap();
        cell.add_port(
            Port::with_width("opt", Point::new(1.0, 2.0), Vector2::unit_y(), 0.4).unwrap(),
        )
        .unwrap();
        let mut library = Library::new("annotations");
        library.add_cell(cell).unwrap();
        let annotations = HashMap::from([(
            "annotated".to_string(),
            CellAnnotations {
                route: RouteAnnotations {
                    path_length: Some(7.25),
                    bends: vec![BendAnnotation {
                        radius: 3.0,
                        position: Point::new(3.0, 4.0),
                        requested_radius: Some(4.0),
                    }],
                    warnings: vec!["radius reduced".to_string()],
                },
                drc: DrcAnnotations {
                    skip: true,
                    waive_regions: vec![
                        BBox::new(Point::new(1.0, 2.0), Point::new(3.0, 5.0)).unwrap(),
                    ],
                },
                editor: EditorAnnotations {
                    origin: Point::new(-2.0, 6.0),
                },
            },
        )]);
        let source = LayoutDocument::from_parts(library, annotations).unwrap();

        let json = rosette_io::json::to_string(&source).unwrap();
        let wasm = WasmLibrary::from_library_json(&json).unwrap();
        let world = wasm.library.cell("annotated").unwrap();
        let port = &world.ports()[0];
        assert_eq!(port.position(), Point::new(50_000.0, -100_000.0));
        assert_eq!(port.direction(), Vector2::new(0.0, -1.0));
        assert_eq!(port.width(), Some(20_000.0));

        let world_annotations = &wasm.annotations["annotated"];
        assert_eq!(world_annotations.route.path_length, Some(362_500.0));
        assert_eq!(wasm.get_cell_path_length("annotated"), Some(7_250.0));
        assert_eq!(world_annotations.route.bends[0].radius, 150_000.0);
        assert_eq!(
            world_annotations.route.bends[0].position,
            Point::new(150_000.0, -200_000.0)
        );
        assert_eq!(
            world_annotations.route.bends[0].requested_radius,
            Some(200_000.0)
        );
        assert_eq!(world_annotations.route.warnings, ["radius reduced"]);
        assert!(world_annotations.drc.skip);
        assert_eq!(
            world_annotations.drc.waive_regions[0],
            BBox::new(
                Point::new(50_000.0, -250_000.0),
                Point::new(150_000.0, -100_000.0),
            )
            .unwrap()
        );
        assert_eq!(
            world_annotations.editor.origin,
            Point::new(-100_000.0, -300_000.0)
        );

        let restored = rosette_io::json::from_string(&wasm.to_library_json().unwrap()).unwrap();
        let restored_cell = restored.library().cell("annotated").unwrap();
        assert_point_close(restored_cell.ports()[0].position(), Point::new(1.0, 2.0));
        assert_eq!(restored_cell.ports()[0].direction(), Vector2::unit_y());
        assert_close(restored_cell.ports()[0].width().unwrap(), 0.4);
        let restored_annotations = &restored.annotations()["annotated"];
        assert_close(restored_annotations.route.path_length.unwrap(), 7.25);
        assert_close(restored_annotations.route.bends[0].radius, 3.0);
        assert_point_close(
            restored_annotations.route.bends[0].position,
            Point::new(3.0, 4.0),
        );
        assert_close(
            restored_annotations.route.bends[0]
                .requested_radius
                .unwrap(),
            4.0,
        );
        assert_eq!(restored_annotations.route.warnings, ["radius reduced"]);
        assert!(restored_annotations.drc.skip);
        assert_point_close(
            restored_annotations.drc.waive_regions[0].min(),
            Point::new(1.0, 2.0),
        );
        assert_point_close(
            restored_annotations.drc.waive_regions[0].max(),
            Point::new(3.0, 5.0),
        );
        assert_point_close(restored_annotations.editor.origin, Point::new(-2.0, 6.0));
    }

    #[test]
    fn coordinate_round_trip_preserves_element_semantics_and_order() {
        let mut child = Cell::new("child").unwrap();
        child.add_polygon(
            Polygon::new(vec![
                Point::origin(),
                Point::new(1.0, 0.0),
                Point::new(0.0, 1.0),
            ])
            .unwrap(),
            Layer::new(10, 0),
        );

        let mut top = Cell::new("top").unwrap();
        top.add_polygon(
            Polygon::new(vec![
                Point::new(1.0, 2.0),
                Point::new(3.0, 2.0),
                Point::new(3.0, 4.0),
            ])
            .unwrap(),
            Layer::new(1, 2),
        );
        top.add_path(
            vec![Point::new(-1.0, 2.0), Point::new(5.0, -6.0)],
            -2.0,
            Layer::new(3, 4),
            PathEndType::Round,
        )
        .unwrap();
        top.add_ref(
            CellRef::with_transform("child", Transform::new(0.0, -1.0, 1.0, 0.0, 3.0, -4.0))
                .unwrap()
                .with_repetition(Some(
                    Repetition::new_vectors(3, 2, Vector2::new(8.0, 1.0), Vector2::new(2.0, 6.0))
                        .unwrap(),
                )),
        );
        top.add_text_with_height("label", Point::new(7.0, -8.0), Layer::new(5, 6), 9.0)
            .unwrap();

        let mut library = Library::new("round-trip");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();
        let mut source = document(library);
        source
            .annotations_mut()
            .get_mut("top")
            .unwrap()
            .editor
            .origin = Point::new(1.25, -2.5);
        let json = rosette_io::json::to_string(&source).unwrap();
        let wasm = WasmLibrary::from_library_json(&json).unwrap();

        assert_eq!(wasm.get_cell_origin(), Some(vec![62_500.0, 125_000.0]));
        let world_top = wasm.library.cell("top").unwrap();
        assert_eq!(world_top.elements().len(), 4);
        let Element::Polygon { polygon, .. } = &world_top.elements()[0] else {
            panic!("polygon order changed");
        };
        assert_eq!(polygon.vertices()[0], Point::new(50_000.0, -100_000.0));
        let Element::Path(path) = &world_top.elements()[1] else {
            panic!("path order changed");
        };
        assert_eq!(path.points()[0], Point::new(-50_000.0, -100_000.0));
        assert_eq!(path.width(), -100_000.0);
        let Element::CellRef(cell_ref) = &world_top.elements()[2] else {
            panic!("cell reference order changed");
        };
        assert_eq!(
            cell_ref.transform(),
            Transform::new(0.0, 1.0, -1.0, 0.0, 150_000.0, 200_000.0)
        );
        let repetition = cell_ref.repetition().unwrap();
        assert_eq!(repetition.col_vector(), Vector2::new(400_000.0, -50_000.0));
        assert_eq!(repetition.row_vector(), Vector2::new(100_000.0, -300_000.0));
        let Element::Text(text) = &world_top.elements()[3] else {
            panic!("text order changed");
        };
        assert_eq!(text.position(), Point::new(350_000.0, 400_000.0));
        assert_eq!(text.height(), 450_000.0);
        assert_eq!(wasm.element_refs.len(), 5);

        let restored = rosette_io::json::from_string(&wasm.to_library_json().unwrap()).unwrap();
        let restored_top = restored.library().cell("top").unwrap();
        assert_eq!(
            restored.annotations()["top"].editor.origin,
            Point::new(1.25, -2.5)
        );
        assert!(matches!(
            restored_top.elements()[0],
            Element::Polygon { .. }
        ));
        let Element::Path(path) = &restored_top.elements()[1] else {
            panic!("path order changed after round trip");
        };
        for (actual, expected) in path
            .points()
            .iter()
            .zip([Point::new(-1.0, 2.0), Point::new(5.0, -6.0)])
        {
            assert_point_close(*actual, expected);
        }
        assert_close(path.width(), -2.0);
        let Element::CellRef(cell_ref) = &restored_top.elements()[2] else {
            panic!("cell reference order changed after round trip");
        };
        let expected_transform = [0.0, -1.0, 1.0, 0.0, 3.0, -4.0];
        let transform = cell_ref.transform();
        let actual_transform = [
            transform.a,
            transform.b,
            transform.c,
            transform.d,
            transform.tx,
            transform.ty,
        ];
        for (actual, expected) in actual_transform.into_iter().zip(expected_transform) {
            assert_close(actual, expected);
        }
        assert_eq!(cell_ref.repetition().unwrap().columns(), 3);
        let Element::Text(text) = &restored_top.elements()[3] else {
            panic!("text order changed after round trip");
        };
        assert_point_close(text.position(), Point::new(7.0, -8.0));
        assert_close(text.height(), 9.0);
    }

    #[test]
    fn gds_round_trip_uses_default_annotations() {
        let mut library = WasmLibrary::new("gds");
        library.add_cell("top").unwrap();
        library
            .add_polygon(&[0.0, 0.0, 50_000.0, 0.0, 50_000.0, 50_000.0], 1, 0)
            .unwrap();
        let annotations = library.annotations.get_mut("top").unwrap();
        annotations.route.path_length = Some(123.0);
        annotations.route.warnings.push("not in GDS".to_string());
        annotations.drc.skip = true;
        annotations.editor.origin = Point::new(10.0, 20.0);

        let bytes = library.to_gds().unwrap();
        let restored = WasmLibrary::from_gds_bytes(&bytes).unwrap();

        assert_eq!(restored.annotations["top"], CellAnnotations::default());
        assert_eq!(restored.get_cell_origin(), Some(vec![0.0, 0.0]));
        assert_eq!(restored.get_cell_path_length("top"), None);
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
                .any(|cell_ref| cell_ref.cell_name() == "missing")
        );
    }

    #[test]
    fn removing_a_self_referencing_cell_leaves_no_stale_element_ids() {
        let mut cell = Cell::new("self_ref").unwrap();
        cell.add_ref(CellRef::new("self_ref").unwrap());
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let json = rosette_io::json::to_string(&document(library)).unwrap();
        let mut library = WasmLibrary::from_library_json(&json).unwrap();

        assert!(!library.element_refs.is_empty());
        assert_eq!(library.remove_cell_cascade("self_ref"), 1);
        assert!(library.element_refs.is_empty());
        assert!(library.annotations.is_empty());
    }

    #[test]
    fn geometry_cycle_does_not_reenter_the_active_cell() {
        let mut cell_a = Cell::new("A").unwrap();
        cell_a.add_polygon(
            Polygon::rect(Point::origin(), 1.0, 1.0).unwrap(),
            Layer::new(1, 0),
        );
        cell_a.add_ref(CellRef::new("B").unwrap());
        let mut cell_b = Cell::new("B").unwrap();
        cell_b.add_polygon(
            Polygon::rect(Point::new(10.0, 0.0), 1.0, 1.0).unwrap(),
            Layer::new(1, 0),
        );
        cell_b.add_ref(CellRef::new("A").unwrap());
        let mut library = Library::new("cycle");
        library.add_cell(cell_a).unwrap();
        library.add_cell(cell_b).unwrap();
        let json = rosette_io::json::to_string(&document(library)).unwrap();

        let wasm = WasmLibrary::from_library_json(&json).unwrap();
        assert_eq!(wasm.active_cell.as_deref(), Some("A"));
        assert_eq!(wasm.get_render_polygons_internal().len(), 2);
        assert!(wasm.get_all_bounds().is_some());
    }
}
