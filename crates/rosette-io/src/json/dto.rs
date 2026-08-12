use std::collections::HashSet;

use rosette_core::cell::Element;
use rosette_core::{
    BBox, BendInfo, Cell, CellRef, Layer, Library, PathEndType, Point, Polygon, Port, Repetition,
    Transform, Vector2,
};
use serde::{Deserialize, Serialize};

use super::JsonError;

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
    pub(super) fn decode(json: &str) -> Result<Library, JsonError> {
        let header: DocumentHeader = serde_json::from_str(json)?;
        if header.format != FORMAT {
            return Err(JsonError::UnsupportedFormat(header.format));
        }
        if header.schema != SCHEMA_VERSION {
            return Err(JsonError::UnsupportedSchema(header.schema));
        }
        serde_json::from_str::<Self>(json)?.into_library()
    }

    pub(super) fn from_library(library: &Library) -> Result<Self, JsonError> {
        library.validate()?;
        Ok(Self {
            format: FORMAT.to_string(),
            schema: SCHEMA_VERSION,
            coordinate_system: CoordinateSystemDto {
                unit: UNIT.to_string(),
                y_axis: Y_AXIS.to_string(),
            },
            library: LibraryDto::from_library(library),
        })
    }

    pub(super) fn into_library(self) -> Result<Library, JsonError> {
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
        self.library.into_library()
    }
}

impl LibraryDto {
    fn from_library(library: &Library) -> Self {
        Self {
            name: library.name().to_string(),
            top_cell: library
                .explicit_top_cell()
                .map(|cell| cell.name().to_string()),
            cells: library.cells().iter().map(CellDto::from_cell).collect(),
        }
    }

    fn into_library(self) -> Result<Library, JsonError> {
        let mut library = Library::new(self.name);
        for (cell_index, cell) in self.cells.into_iter().enumerate() {
            library
                .add_cell(cell.into_cell(cell_index)?)
                .map_err(JsonError::InvalidLibrary)?;
        }
        if let Some(top_cell) = self.top_cell {
            library
                .set_top_cell(&top_cell)
                .map_err(JsonError::InvalidLibrary)?;
        }
        Ok(library)
    }
}

impl CellDto {
    fn from_cell(cell: &Cell) -> Self {
        Self {
            name: cell.name().to_string(),
            elements: cell
                .elements()
                .iter()
                .map(ElementDto::from_element)
                .collect(),
            ports: cell.ports().iter().map(PortDto::from_port).collect(),
            route: RouteAnnotationsDto {
                path_length: cell.path_length(),
                bends: cell.bends().iter().map(BendDto::from_bend).collect(),
                warnings: cell.warnings().to_vec(),
            },
            drc: DrcAnnotationsDto {
                skip: cell.drc_skip(),
                waive_regions: cell
                    .drc_waive_regions()
                    .iter()
                    .map(BBoxDto::from_bbox)
                    .collect(),
            },
            editor: EditorAnnotationsDto {
                origin: cell.origin().into(),
            },
        }
    }

    fn into_cell(self, cell_index: usize) -> Result<Cell, JsonError> {
        let cell_path = format!("library.cells[{cell_index}]");
        if self.name.is_empty() {
            return Err(invalid(&cell_path, "cell name cannot be empty"));
        }

        let mut cell = Cell::new(self.name);
        for (element_index, element) in self.elements.into_iter().enumerate() {
            element.add_to_cell(&mut cell, &format!("{cell_path}.elements[{element_index}]"))?;
        }

        let mut port_names = HashSet::with_capacity(self.ports.len());
        for (port_index, port) in self.ports.into_iter().enumerate() {
            let path = format!("{cell_path}.ports[{port_index}]");
            if !port_names.insert(port.name.clone()) {
                return Err(invalid(&path, "port name must be unique within its cell"));
            }
            cell.add_port(port.into_port(&path)?);
        }

        if let Some(path_length) = self.route.path_length {
            ensure_finite(path_length, &format!("{cell_path}.route.path_length"))?;
            cell.set_path_length(path_length);
        }
        for (bend_index, bend) in self.route.bends.into_iter().enumerate() {
            cell.add_bend(bend.into_bend(&format!("{cell_path}.route.bends[{bend_index}]"))?);
        }
        for warning in self.route.warnings {
            cell.add_warning(warning);
        }

        cell.set_drc_skip(self.drc.skip);
        for (region_index, region) in self.drc.waive_regions.into_iter().enumerate() {
            cell.add_drc_waive_region(
                region.into_bbox(&format!("{cell_path}.drc.waive_regions[{region_index}]"))?,
            );
        }

        let origin: Point = self.editor.origin.into();
        ensure_point(origin, &format!("{cell_path}.editor.origin"))?;
        cell.set_origin(origin);

        Ok(cell)
    }
}

impl ElementDto {
    fn from_element(element: &Element) -> Self {
        match element {
            Element::Polygon { polygon, layer } => Self::Polygon {
                layer: (*layer).into(),
                vertices: polygon.vertices().iter().copied().map(Into::into).collect(),
            },
            Element::Path {
                points,
                width,
                layer,
                end_type,
            } => Self::Path {
                layer: (*layer).into(),
                points: points.iter().copied().map(Into::into).collect(),
                width: *width,
                end_type: (*end_type).into(),
            },
            Element::CellRef(cell_ref) => Self::CellRef {
                cell: cell_ref.cell_name.clone(),
                transform: cell_ref.transform.into(),
                repetition: cell_ref.repetition.map(Into::into),
            },
            Element::Text {
                text,
                position,
                layer,
                height,
            } => Self::Text {
                layer: (*layer).into(),
                text: text.clone(),
                position: (*position).into(),
                height: *height,
            },
        }
    }

    fn add_to_cell(self, cell: &mut Cell, path: &str) -> Result<(), JsonError> {
        match self {
            Self::Polygon { layer, vertices } => {
                let vertices: Vec<Point> = vertices.into_iter().map(Into::into).collect();
                let polygon = Polygon::try_new(vertices)
                    .ok_or_else(|| invalid(path, "polygon requires at least 3 finite vertices"))?;
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
                cell.add_path(points, width, Layer::from(layer), end_type.into());
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
                cell.add_ref(
                    CellRef::with_transform(target, transform).with_repetition(repetition),
                );
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
                cell.add_text_with_height(text, position, Layer::from(layer), height);
            }
        }
        Ok(())
    }
}

impl PortDto {
    fn from_port(port: &Port) -> Self {
        Self {
            name: port.name.clone(),
            position: port.position.into(),
            direction: port.direction.into(),
            width: port.width,
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
            Ok(Port::with_width(self.name, position, direction, width))
        } else {
            Ok(Port::new(self.name, position, direction))
        }
    }
}

impl BendDto {
    fn from_bend(bend: &BendInfo) -> Self {
        Self {
            radius: bend.radius,
            position: bend.position.into(),
            requested_radius: bend.requested_radius,
        }
    }

    fn into_bend(self, path: &str) -> Result<BendInfo, JsonError> {
        ensure_finite(self.radius, &format!("{path}.radius"))?;
        let position: Point = self.position.into();
        ensure_point(position, &format!("{path}.position"))?;
        match self.requested_radius {
            Some(requested_radius) => {
                ensure_finite(requested_radius, &format!("{path}.requested_radius"))?;
                Ok(BendInfo::auto_reduced(
                    self.radius,
                    position,
                    requested_radius,
                ))
            }
            None => Ok(BendInfo::new(self.radius, position)),
        }
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
        Ok(Repetition::new_vectors(
            self.columns,
            self.rows,
            column_vector,
            row_vector,
        ))
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
        let bbox = BBox::new(self.min.into(), self.max.into());
        if !bbox.is_valid() {
            return Err(invalid(
                path,
                "bounding-box corners must be finite and ordered",
            ));
        }
        Ok(bbox)
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
            columns: value.columns,
            rows: value.rows,
            column_vector: value.col_vector.into(),
            row_vector: value.row_vector.into(),
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
