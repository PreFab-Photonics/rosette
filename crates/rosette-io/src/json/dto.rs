use std::collections::{HashMap, HashSet};

use rosette_core::cell::Element;
use rosette_core::{
    BBox, Cell, CellRef, Layer, Library, PathEndType, Point, Polygon, Port, Repetition, Transform,
    Vector2,
};
use serde::{Deserialize, Serialize};

use super::{
    BendAnnotation, CellAnnotations, DrcAnnotations, EditorAnnotations, JsonError, LayoutDocument,
    RouteAnnotations,
};

pub const FORMAT: &str = "rosette-layout";
pub const SCHEMA_VERSION: u32 = 1;

const UNIT: &str = "um";
const Y_AXIS: &str = "up";
const DIRECTION_UNIT_TOLERANCE: f64 = 1e-9;

#[derive(Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub(super) struct DocumentDto {
    format: String,
    schema: u32,
    coordinate_system: CoordinateSystemDto,
    library: LibraryDto,
}

#[derive(Deserialize)]
struct DocumentHeader {
    format: String,
    schema: u32,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct CoordinateSystemDto {
    unit: String,
    y_axis: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct LibraryDto {
    name: String,
    top_cell: Option<String>,
    cells: Vec<CellDto>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct CellDto {
    name: String,
    elements: Vec<ElementDto>,
    ports: Vec<PortDto>,
    route: RouteAnnotationsDto,
    drc: DrcAnnotationsDto,
    editor: EditorAnnotationsDto,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case", deny_unknown_fields)]
enum ElementDto {
    Polygon {
        layer: LayerDto,
        vertices: Vec<PointDto>,
    },
    Path {
        layer: LayerDto,
        points: Vec<PointDto>,
        width: f64,
        end_type: PathEndTypeDto,
    },
    CellRef {
        cell: String,
        transform: TransformDto,
        repetition: Option<RepetitionDto>,
    },
    Text {
        layer: LayerDto,
        text: String,
        position: PointDto,
        height: f64,
    },
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
enum PathEndTypeDto {
    Flush,
    Round,
    HalfWidthExtension,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct PointDto {
    x: f64,
    y: f64,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct VectorDto {
    x: f64,
    y: f64,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct LayerDto {
    number: u16,
    datatype: u16,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct TransformDto {
    a: f64,
    b: f64,
    c: f64,
    d: f64,
    tx: f64,
    ty: f64,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct RepetitionDto {
    columns: u16,
    rows: u16,
    column_vector: VectorDto,
    row_vector: VectorDto,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct PortDto {
    name: String,
    position: PointDto,
    direction: VectorDto,
    width: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct RouteAnnotationsDto {
    path_length: Option<f64>,
    bends: Vec<BendDto>,
    warnings: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct BendDto {
    radius: f64,
    position: PointDto,
    requested_radius: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct DrcAnnotationsDto {
    skip: bool,
    waive_regions: Vec<BBoxDto>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct BBoxDto {
    min: PointDto,
    max: PointDto,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct EditorAnnotationsDto {
    origin: PointDto,
}

impl DocumentDto {
    pub(super) fn decode(json: &str) -> Result<LayoutDocument, JsonError> {
        let header: DocumentHeader = serde_json::from_str(json)?;
        if header.format != FORMAT {
            return Err(JsonError::UnsupportedFormat(header.format));
        }
        if header.schema != SCHEMA_VERSION {
            return Err(JsonError::UnsupportedSchema(header.schema));
        }
        serde_json::from_str::<Self>(json)?.into_document()
    }

    pub(super) fn from_document(document: &LayoutDocument) -> Result<Self, JsonError> {
        document.validate()?;
        Ok(Self {
            format: FORMAT.to_string(),
            schema: SCHEMA_VERSION,
            coordinate_system: CoordinateSystemDto {
                unit: UNIT.to_string(),
                y_axis: Y_AXIS.to_string(),
            },
            library: LibraryDto::from_document(document),
        })
    }

    pub(super) fn into_document(self) -> Result<LayoutDocument, JsonError> {
        if self.format != FORMAT {
            return Err(JsonError::UnsupportedFormat(self.format));
        }
        if self.schema != SCHEMA_VERSION {
            return Err(JsonError::UnsupportedSchema(self.schema));
        }
        if self.coordinate_system.unit != UNIT || self.coordinate_system.y_axis != Y_AXIS {
            return Err(JsonError::UnsupportedCoordinateSystem {
                unit: self.coordinate_system.unit,
                y_axis: self.coordinate_system.y_axis,
            });
        }
        self.library.into_document()
    }
}

impl LibraryDto {
    fn from_document(document: &LayoutDocument) -> Self {
        let library = document.library();
        Self {
            name: library.name().to_string(),
            top_cell: library
                .explicit_top_cell()
                .map(|cell| cell.name().to_string()),
            cells: library
                .cells()
                .iter()
                .map(|cell| {
                    CellDto::from_cell(
                        cell,
                        document
                            .annotations()
                            .get(cell.name())
                            .expect("validated document has annotations for every cell"),
                    )
                })
                .collect(),
        }
    }

    fn into_document(self) -> Result<LayoutDocument, JsonError> {
        let mut library = Library::new(self.name);
        let mut annotations = HashMap::with_capacity(self.cells.len());
        for (cell_index, cell) in self.cells.into_iter().enumerate() {
            let (cell, cell_annotations) = cell.into_parts(cell_index)?;
            let cell_name = cell.name().to_string();
            library.add_cell(cell).map_err(JsonError::InvalidLibrary)?;
            annotations.insert(cell_name, cell_annotations);
        }
        if let Some(top_cell) = self.top_cell {
            library
                .set_top_cell(&top_cell)
                .map_err(JsonError::InvalidLibrary)?;
        }
        LayoutDocument::from_parts(library, annotations)
    }
}

impl CellDto {
    fn from_cell(cell: &Cell, annotations: &CellAnnotations) -> Self {
        Self {
            name: cell.name().to_string(),
            elements: cell
                .elements()
                .iter()
                .map(ElementDto::from_element)
                .collect(),
            ports: cell.ports().iter().map(PortDto::from_port).collect(),
            route: RouteAnnotationsDto {
                path_length: annotations.route.path_length,
                bends: annotations
                    .route
                    .bends
                    .iter()
                    .map(BendDto::from_bend)
                    .collect(),
                warnings: annotations.route.warnings.clone(),
            },
            drc: DrcAnnotationsDto {
                skip: annotations.drc.skip,
                waive_regions: annotations
                    .drc
                    .waive_regions
                    .iter()
                    .map(BBoxDto::from_bbox)
                    .collect(),
            },
            editor: EditorAnnotationsDto {
                origin: annotations.editor.origin.into(),
            },
        }
    }

    fn into_parts(self, cell_index: usize) -> Result<(Cell, CellAnnotations), JsonError> {
        let cell_path = format!("library.cells[{cell_index}]");
        if self.name.is_empty() {
            return Err(invalid(&cell_path, "cell name cannot be empty"));
        }

        let mut cell =
            Cell::new(self.name).map_err(|error| invalid(&cell_path, &error.to_string()))?;
        for (element_index, element) in self.elements.into_iter().enumerate() {
            element.add_to_cell(&mut cell, &format!("{cell_path}.elements[{element_index}]"))?;
        }

        let mut port_names = HashSet::with_capacity(self.ports.len());
        for (port_index, port) in self.ports.into_iter().enumerate() {
            let path = format!("{cell_path}.ports[{port_index}]");
            if !port_names.insert(port.name.clone()) {
                return Err(invalid(&path, "port name must be unique within its cell"));
            }
            cell.add_port(port.into_port(&path)?)
                .map_err(|error| invalid(&path, &error.to_string()))?;
        }

        if let Some(path_length) = self.route.path_length {
            ensure_finite(path_length, &format!("{cell_path}.route.path_length"))?;
        }
        let mut bends = Vec::with_capacity(self.route.bends.len());
        for (bend_index, bend) in self.route.bends.into_iter().enumerate() {
            bends.push(bend.into_bend(&format!("{cell_path}.route.bends[{bend_index}]"))?);
        }

        let mut waive_regions = Vec::with_capacity(self.drc.waive_regions.len());
        for (region_index, region) in self.drc.waive_regions.into_iter().enumerate() {
            waive_regions
                .push(region.into_bbox(&format!("{cell_path}.drc.waive_regions[{region_index}]"))?);
        }

        let origin: Point = self.editor.origin.into();
        ensure_point(origin, &format!("{cell_path}.editor.origin"))?;

        Ok((
            cell,
            CellAnnotations {
                route: RouteAnnotations {
                    path_length: self.route.path_length,
                    bends,
                    warnings: self.route.warnings,
                },
                drc: DrcAnnotations {
                    skip: self.drc.skip,
                    waive_regions,
                },
                editor: EditorAnnotations { origin },
            },
        ))
    }
}

impl ElementDto {
    fn from_element(element: &Element) -> Self {
        match element {
            Element::Polygon { polygon, layer } => Self::Polygon {
                layer: (*layer).into(),
                vertices: polygon.vertices().iter().copied().map(Into::into).collect(),
            },
            Element::Path(path) => Self::Path {
                layer: path.layer().into(),
                points: path.points().iter().copied().map(Into::into).collect(),
                width: path.width(),
                end_type: path.end_type().into(),
            },
            Element::CellRef(cell_ref) => Self::CellRef {
                cell: cell_ref.cell_name().to_string(),
                transform: cell_ref.transform().into(),
                repetition: cell_ref.repetition().map(Into::into),
            },
            Element::Text(text) => Self::Text {
                layer: text.layer().into(),
                text: text.text().to_string(),
                position: text.position().into(),
                height: text.height(),
            },
        }
    }

    fn add_to_cell(self, cell: &mut Cell, path: &str) -> Result<(), JsonError> {
        match self {
            Self::Polygon { layer, vertices } => {
                let vertices: Vec<Point> = vertices.into_iter().map(Into::into).collect();
                let polygon = Polygon::new(vertices)
                    .map_err(|_| invalid(path, "polygon requires at least 3 finite vertices"))?;
                cell.add_polygon(polygon, Layer::from(layer));
            }
            Self::Path {
                layer,
                points,
                width,
                end_type,
            } => {
                let points: Vec<Point> = points.into_iter().map(Into::into).collect();
                if points.len() < 2 {
                    return Err(invalid(path, "path requires at least 2 points"));
                }
                for (point_index, point) in points.iter().enumerate() {
                    ensure_point(*point, &format!("{path}.points[{point_index}]"))?;
                }
                ensure_finite(width, &format!("{path}.width"))?;
                if width == 0.0 {
                    return Err(invalid(
                        &format!("{path}.width"),
                        "path width cannot be zero",
                    ));
                }
                cell.add_path(points, width, Layer::from(layer), end_type.into())
                    .map_err(|error| invalid(path, &error.to_string()))?;
            }
            Self::CellRef {
                cell: target,
                transform,
                repetition,
            } => {
                if target.is_empty() {
                    return Err(invalid(
                        &format!("{path}.cell"),
                        "reference target cannot be empty",
                    ));
                }
                let transform: Transform = transform.into();
                if !transform.is_finite() || !transform.is_invertible() {
                    return Err(invalid(
                        &format!("{path}.transform"),
                        "reference transform must be finite and invertible",
                    ));
                }
                let repetition = repetition
                    .map(|value| value.into_repetition(&format!("{path}.repetition")))
                    .transpose()?;
                let cell_ref = CellRef::with_transform(target, transform)
                    .map_err(|error| invalid(path, &error.to_string()))?
                    .with_repetition(repetition);
                cell.add_ref(cell_ref);
            }
            Self::Text {
                layer,
                text,
                position,
                height,
            } => {
                let position: Point = position.into();
                ensure_point(position, &format!("{path}.position"))?;
                ensure_finite(height, &format!("{path}.height"))?;
                if height <= 0.0 {
                    return Err(invalid(
                        &format!("{path}.height"),
                        "text height must be positive",
                    ));
                }
                cell.add_text_with_height(text, position, Layer::from(layer), height)
                    .map_err(|error| invalid(path, &error.to_string()))?;
            }
        }
        Ok(())
    }
}

impl PortDto {
    fn from_port(port: &Port) -> Self {
        Self {
            name: port.name().to_string(),
            position: port.position().into(),
            direction: port.direction().into(),
            width: port.width(),
        }
    }

    fn into_port(self, path: &str) -> Result<Port, JsonError> {
        if self.name.is_empty() {
            return Err(invalid(
                &format!("{path}.name"),
                "port name cannot be empty",
            ));
        }
        let position: Point = self.position.into();
        ensure_point(position, &format!("{path}.position"))?;
        let direction: Vector2 = self.direction.into();
        if !direction.is_finite() {
            return Err(invalid(
                &format!("{path}.direction"),
                "port direction must be finite",
            ));
        }
        let length = direction.length();
        if !length.is_finite() || length == 0.0 || (length - 1.0).abs() > DIRECTION_UNIT_TOLERANCE {
            return Err(invalid(
                &format!("{path}.direction"),
                "port direction must be a unit vector",
            ));
        }
        if let Some(width) = self.width {
            ensure_finite(width, &format!("{path}.width"))?;
            if width <= 0.0 {
                return Err(invalid(
                    &format!("{path}.width"),
                    "port width must be positive",
                ));
            }
            Port::with_width(self.name, position, direction, width)
                .map_err(|error| invalid(path, &error.to_string()))
        } else {
            Port::new(self.name, position, direction)
                .map_err(|error| invalid(path, &error.to_string()))
        }
    }
}

impl BendDto {
    fn from_bend(bend: &BendAnnotation) -> Self {
        Self {
            radius: bend.radius,
            position: bend.position.into(),
            requested_radius: bend.requested_radius,
        }
    }

    fn into_bend(self, path: &str) -> Result<BendAnnotation, JsonError> {
        ensure_finite(self.radius, &format!("{path}.radius"))?;
        let position: Point = self.position.into();
        ensure_point(position, &format!("{path}.position"))?;
        if let Some(requested_radius) = self.requested_radius {
            ensure_finite(requested_radius, &format!("{path}.requested_radius"))?;
        }
        Ok(BendAnnotation {
            radius: self.radius,
            position,
            requested_radius: self.requested_radius,
        })
    }
}

impl RepetitionDto {
    fn into_repetition(self, path: &str) -> Result<Repetition, JsonError> {
        if self.columns == 0 || self.rows == 0 {
            return Err(invalid(path, "repetition dimensions must be nonzero"));
        }
        let column_vector: Vector2 = self.column_vector.into();
        let row_vector: Vector2 = self.row_vector.into();
        if !column_vector.is_finite() || !row_vector.is_finite() {
            return Err(invalid(path, "repetition vectors must be finite"));
        }
        Repetition::new_vectors(self.columns, self.rows, column_vector, row_vector)
            .map_err(|error| invalid(path, &error.to_string()))
    }
}

impl BBoxDto {
    fn from_bbox(bbox: &BBox) -> Self {
        Self {
            min: bbox.min().into(),
            max: bbox.max().into(),
        }
    }

    fn into_bbox(self, path: &str) -> Result<BBox, JsonError> {
        BBox::new(self.min.into(), self.max.into())
            .map_err(|_| invalid(path, "bounding-box corners must be finite and ordered"))
    }
}

impl From<Point> for PointDto {
    fn from(value: Point) -> Self {
        Self {
            x: value.x,
            y: value.y,
        }
    }
}

impl From<PointDto> for Point {
    fn from(value: PointDto) -> Self {
        Self::new(value.x, value.y)
    }
}

impl From<Vector2> for VectorDto {
    fn from(value: Vector2) -> Self {
        Self {
            x: value.x,
            y: value.y,
        }
    }
}

impl From<VectorDto> for Vector2 {
    fn from(value: VectorDto) -> Self {
        Self::new(value.x, value.y)
    }
}

impl From<Layer> for LayerDto {
    fn from(value: Layer) -> Self {
        Self {
            number: value.number,
            datatype: value.datatype,
        }
    }
}

impl From<LayerDto> for Layer {
    fn from(value: LayerDto) -> Self {
        Self::new(value.number, value.datatype)
    }
}

impl From<Transform> for TransformDto {
    fn from(value: Transform) -> Self {
        Self {
            a: value.a,
            b: value.b,
            c: value.c,
            d: value.d,
            tx: value.tx,
            ty: value.ty,
        }
    }
}

impl From<TransformDto> for Transform {
    fn from(value: TransformDto) -> Self {
        Self::new(value.a, value.b, value.c, value.d, value.tx, value.ty)
    }
}

impl From<Repetition> for RepetitionDto {
    fn from(value: Repetition) -> Self {
        Self {
            columns: value.columns(),
            rows: value.rows(),
            column_vector: value.col_vector().into(),
            row_vector: value.row_vector().into(),
        }
    }
}

impl From<PathEndType> for PathEndTypeDto {
    fn from(value: PathEndType) -> Self {
        match value {
            PathEndType::Flush => Self::Flush,
            PathEndType::Round => Self::Round,
            PathEndType::HalfWidthExtension => Self::HalfWidthExtension,
        }
    }
}

impl From<PathEndTypeDto> for PathEndType {
    fn from(value: PathEndTypeDto) -> Self {
        match value {
            PathEndTypeDto::Flush => Self::Flush,
            PathEndTypeDto::Round => Self::Round,
            PathEndTypeDto::HalfWidthExtension => Self::HalfWidthExtension,
        }
    }
}

fn ensure_finite(value: f64, path: &str) -> Result<(), JsonError> {
    value
        .is_finite()
        .then_some(())
        .ok_or_else(|| invalid(path, "value must be finite"))
}

fn ensure_point(point: Point, path: &str) -> Result<(), JsonError> {
    point
        .is_finite()
        .then_some(())
        .ok_or_else(|| invalid(path, "point must be finite"))
}

fn invalid(path: &str, message: &str) -> JsonError {
    JsonError::InvalidDocument {
        path: path.to_string(),
        message: message.to_string(),
    }
}
