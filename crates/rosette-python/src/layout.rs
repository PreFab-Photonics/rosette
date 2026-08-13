//! Python bindings for layout types.

use crate::extract_layer;
use crate::geometry::{PyBBox, PyPoint, PyPolygon, PyTransform, PyVector2};
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use rosette_checks::RouteAnnotationMap;
use rosette_core::cell::PathEndType;
use rosette_core::component::connect_transform;
use rosette_core::{
    Cell, CellRef, DuplicatePolicy, Layer, Library, Point, Port, Transform, Vector2,
};
use rosette_route::RouteAnnotations;
use std::f64::consts::PI;

const GDS_ARRAY_MAX: i64 = 32_767;

fn validate_port_parts(
    name: &str,
    position: Point,
    direction: Vector2,
    width: Option<f64>,
) -> PyResult<()> {
    if name.is_empty() {
        return Err(PyValueError::new_err("Port name cannot be empty"));
    }
    if !position.is_finite() {
        return Err(PyValueError::new_err("Port position must be finite"));
    }
    if !direction.is_finite() {
        return Err(PyValueError::new_err("Port direction must be finite"));
    }
    let direction_length = direction.length();
    if direction.is_zero() || direction_length == 0.0 {
        return Err(PyValueError::new_err("Port direction cannot be zero"));
    }
    if !direction_length.is_finite() {
        return Err(PyValueError::new_err(
            "Port direction must have finite length",
        ));
    }
    if let Some(width) = width {
        if !width.is_finite() {
            return Err(PyValueError::new_err("Port width must be finite"));
        }
        if width <= 0.0 {
            return Err(PyValueError::new_err("Port width must be positive"));
        }
    }
    Ok(())
}

fn validate_cell_ref_transform(transform: &Transform) -> PyResult<()> {
    if !transform.is_finite() {
        return Err(PyValueError::new_err("CellRef transform must be finite"));
    }
    if !transform.is_invertible() {
        return Err(PyValueError::new_err(
            "CellRef transform must be invertible",
        ));
    }
    Ok(())
}

fn validate_cell_ref(cell_ref: &CellRef) -> PyResult<()> {
    if cell_ref.cell_name.is_empty() {
        return Err(PyValueError::new_err(
            "CellRef target cell name cannot be empty",
        ));
    }
    validate_cell_ref_transform(&cell_ref.transform)?;
    if let Some(repetition) = cell_ref.repetition {
        if repetition.columns == 0
            || repetition.rows == 0
            || repetition.columns > GDS_ARRAY_MAX as u16
            || repetition.rows > GDS_ARRAY_MAX as u16
        {
            return Err(PyValueError::new_err(format!(
                "CellRef array columns and rows must be in [1, {GDS_ARRAY_MAX}]"
            )));
        }
        if !repetition.col_vector.is_finite() {
            return Err(PyValueError::new_err(
                "CellRef array column vector must be finite",
            ));
        }
        if !repetition.row_vector.is_finite() {
            return Err(PyValueError::new_err(
                "CellRef array row vector must be finite",
            ));
        }
    }
    Ok(())
}

fn extract_array_dimensions(
    columns: &Bound<'_, PyAny>,
    rows: &Bound<'_, PyAny>,
) -> PyResult<(u16, u16)> {
    let columns = columns.extract::<i64>().ok();
    let rows = rows.extract::<i64>().ok();
    match (columns, rows) {
        (Some(columns), Some(rows))
            if (1..=GDS_ARRAY_MAX).contains(&columns) && (1..=GDS_ARRAY_MAX).contains(&rows) =>
        {
            Ok((columns as u16, rows as u16))
        }
        _ => Err(PyValueError::new_err(format!(
            "columns and rows must be in [1, {GDS_ARRAY_MAX}]"
        ))),
    }
}

/// GDS path end type.
#[pyclass(name = "PathEndType", from_py_object)]
#[derive(Clone, Copy)]
pub struct PyPathEndType(pub PathEndType);

#[pymethods]
#[allow(non_snake_case)]
impl PyPathEndType {
    /// Flush (square) ends at path endpoints.
    #[classattr]
    fn FLUSH() -> Self {
        PyPathEndType(PathEndType::Flush)
    }

    /// Round ends.
    #[classattr]
    fn ROUND() -> Self {
        PyPathEndType(PathEndType::Round)
    }

    /// Square ends extending half-width past endpoints.
    #[classattr]
    fn HALF_WIDTH_EXTENSION() -> Self {
        PyPathEndType(PathEndType::HalfWidthExtension)
    }

    fn __repr__(&self) -> String {
        match self.0 {
            PathEndType::Flush => "PathEndType.FLUSH".to_string(),
            PathEndType::Round => "PathEndType.ROUND".to_string(),
            PathEndType::HalfWidthExtension => "PathEndType.HALF_WIDTH_EXTENSION".to_string(),
        }
    }
}

/// A GDS layer specification.
#[pyclass(name = "Layer", from_py_object)]
#[derive(Clone)]
pub struct PyLayer(pub Layer);

#[pymethods]
impl PyLayer {
    /// Create a new layer.
    #[new]
    #[pyo3(signature = (number, datatype=0))]
    fn new(number: u16, datatype: u16) -> Self {
        PyLayer(Layer::new(number, datatype))
    }

    /// Layer number.
    #[getter]
    fn number(&self) -> u16 {
        self.0.number
    }

    /// Datatype.
    #[getter]
    fn datatype(&self) -> u16 {
        self.0.datatype
    }

    fn __repr__(&self) -> String {
        format!("Layer({}, {})", self.0.number, self.0.datatype)
    }

    fn __hash__(&self) -> u64 {
        use std::hash::{Hash, Hasher};
        let mut hasher = std::collections::hash_map::DefaultHasher::new();
        self.0.number.hash(&mut hasher);
        self.0.datatype.hash(&mut hasher);
        hasher.finish()
    }

    fn __eq__(&self, other: &PyLayer) -> bool {
        self.0 == other.0
    }
}

/// A connection port on a component.
#[pyclass(name = "Port", from_py_object)]
#[derive(Clone)]
pub struct PyPort(pub Port);

#[pymethods]
impl PyPort {
    /// Create a new port.
    #[new]
    #[pyo3(signature = (name, position, direction, width=None))]
    fn new(
        name: String,
        position: &PyPoint,
        direction: &PyVector2,
        width: Option<f64>,
    ) -> PyResult<Self> {
        validate_port_parts(&name, position.0, direction.0, width)?;
        let port = match width {
            Some(w) => Port::with_width(name, position.0, direction.0, w),
            None => Port::new(name, position.0, direction.0),
        };
        Ok(PyPort(port))
    }

    /// Port name.
    #[getter]
    fn name(&self) -> &str {
        &self.0.name
    }

    /// Port position.
    #[getter]
    fn position(&self) -> PyPoint {
        PyPoint(self.0.position)
    }

    /// Port direction (outward).
    #[getter]
    fn direction(&self) -> PyVector2 {
        PyVector2(self.0.direction)
    }

    /// Port width.
    #[getter]
    fn width(&self) -> Option<f64> {
        self.0.width
    }

    /// Angle of the direction (in degrees).
    fn angle(&self) -> f64 {
        self.0.angle() * 180.0 / PI
    }

    /// Check if this port can connect to another port.
    ///
    /// Ports can connect if they are at the same position (within tolerance)
    /// and have opposite directions.
    #[pyo3(signature = (other, tolerance=0.001))]
    fn can_connect_to(&self, other: &PyPort, tolerance: f64) -> bool {
        self.0.can_connect_to(&other.0, tolerance)
    }

    fn __repr__(&self) -> String {
        format!(
            "Port('{}', position=({}, {}), angle={:.1})",
            self.0.name,
            self.0.position.x,
            self.0.position.y,
            self.angle()
        )
    }
}

/// A reference to another cell with transformation.
#[pyclass(name = "CellRef", from_py_object)]
#[derive(Clone)]
pub struct PyCellRef(pub CellRef);

/// Union type for CellRef constructor: accepts either a Cell or a string.
#[derive(FromPyObject)]
enum CellOrName {
    Cell(PyCell),
    Name(String),
}

#[pymethods]
impl PyCellRef {
    /// Create a new cell reference.
    ///
    /// Args:
    ///     cell_or_name: Either a Cell object or a cell name string.
    ///
    /// Example:
    ///     ```python
    ///     ref1 = CellRef("my_cell")      # From string
    ///     ref2 = CellRef(waveguide_cell) # From Cell object
    ///     ```
    #[new]
    fn new(cell_or_name: CellOrName) -> PyResult<Self> {
        let name = match cell_or_name {
            CellOrName::Cell(cell) => cell.0.name().to_string(),
            CellOrName::Name(name) => name,
        };
        if name.is_empty() {
            return Err(PyValueError::new_err(
                "CellRef target cell name cannot be empty",
            ));
        }
        Ok(PyCellRef(CellRef::new(name)))
    }

    /// Lower a resolved facade Instance without reconstructing its transform.
    #[staticmethod]
    fn _from_transform(cell_name: String, transform: &PyTransform) -> PyResult<Self> {
        if cell_name.is_empty() {
            return Err(PyValueError::new_err(
                "CellRef target cell name cannot be empty",
            ));
        }
        let transform = transform.0;
        let values = [
            transform.a,
            transform.b,
            transform.c,
            transform.d,
            transform.tx,
            transform.ty,
        ];
        let scale_x = transform.a.hypot(transform.c);
        let scale_y = transform.b.hypot(transform.d);
        let scale_error = (scale_x - scale_y).abs() / scale_x.max(scale_y);
        let normalized_dot =
            (transform.a * transform.b + transform.c * transform.d) / (scale_x * scale_y);
        let min_gds_magnification = 16.0_f64.powi(-65);
        let max_gds_magnification = 16.0_f64.powi(63);
        if !values.iter().all(|value| value.is_finite())
            || !transform.is_invertible()
            || !scale_x.is_finite()
            || !scale_y.is_finite()
            || !scale_error.is_finite()
            || !normalized_dot.is_finite()
            || scale_x == 0.0
            || scale_y == 0.0
            || scale_x < min_gds_magnification
            || scale_x >= max_gds_magnification
            || scale_error > 1e-12
            || normalized_dot.abs() > 1e-12
        {
            return Err(PyValueError::new_err(
                "Instance transform must contain only translation, rotation, reflection, and uniform non-zero scale representable in GDS REAL8",
            ));
        }
        Ok(PyCellRef(CellRef::with_transform(cell_name, transform)))
    }

    /// Set the position.
    fn at(&self, x: f64, y: f64) -> PyResult<Self> {
        if !x.is_finite() || !y.is_finite() {
            return Err(PyValueError::new_err("CellRef position must be finite"));
        }
        let transform = Transform::translate(x, y).then(&self.0.transform);
        validate_cell_ref_transform(&transform)?;
        Ok(PyCellRef(self.0.clone().at(x, y)))
    }

    /// Rotate by angle (in degrees).
    fn rotate(&self, angle_deg: f64) -> PyResult<Self> {
        let angle = angle_deg * PI / 180.0;
        if !angle.is_finite() {
            return Err(PyValueError::new_err("CellRef rotation must be finite"));
        }
        let transform = Transform::rotate(angle).then(&self.0.transform);
        validate_cell_ref_transform(&transform)?;
        Ok(PyCellRef(self.0.clone().rotate(angle)))
    }

    /// Mirror across X axis.
    fn mirror_x(&self) -> Self {
        PyCellRef(self.0.clone().mirror_x())
    }

    /// Mirror across Y axis.
    fn mirror_y(&self) -> Self {
        PyCellRef(self.0.clone().mirror_y())
    }

    /// Scale uniformly.
    fn scale(&self, s: f64) -> PyResult<Self> {
        if !s.is_finite() || s == 0.0 {
            return Err(PyValueError::new_err(
                "CellRef scale must be finite and nonzero",
            ));
        }
        let transform = Transform::scale_uniform(s).then(&self.0.transform);
        validate_cell_ref_transform(&transform)?;
        Ok(PyCellRef(self.0.clone().scale(s)))
    }

    /// Set array repetition (columns × rows rectangular grid with given pitch).
    ///
    /// Creates a GDS AREF — a single compact array reference instead of
    /// many individual references. In the viewer, the entire array is
    /// selected as one object.
    ///
    /// Args:
    ///     columns: Number of columns (1 to 32767; GDS COLROW INT16 limit).
    ///     rows: Number of rows (1 to 32767; GDS COLROW INT16 limit).
    ///     col_spacing: Column pitch — center-to-center distance between
    ///         adjacent copies along local +X, in µm. Negative values
    ///         place copies along local −X.
    ///     row_spacing: Row pitch — center-to-center distance between
    ///         adjacent copies along local +Y, in µm. Negative values
    ///         place copies along local −Y.
    ///
    /// Note:
    ///     The Python wrappers (`CellRef.array` / `Instance.array`) validate
    ///     the [1, 32767] range before calling this binding.
    ///
    ///     For hex packings or any skewed / non-orthogonal grid, use
    ///     :meth:`array_vectors` instead.
    ///
    /// Example:
    ///     ```python
    ///     ref = CellRef("unit").at(0, 0).array(10, 5, 20.0, 15.0)
    ///     ```
    fn array(
        &self,
        columns: &Bound<'_, PyAny>,
        rows: &Bound<'_, PyAny>,
        col_spacing: f64,
        row_spacing: f64,
    ) -> PyResult<Self> {
        let (columns, rows) = extract_array_dimensions(columns, rows)?;
        if !col_spacing.is_finite() || !row_spacing.is_finite() {
            return Err(PyValueError::new_err(
                "CellRef array spacing must be finite",
            ));
        }
        Ok(PyCellRef(self.0.clone().array(
            columns,
            rows,
            col_spacing,
            row_spacing,
        )))
    }

    /// Set array repetition from arbitrary column and row displacement vectors.
    ///
    /// Lower-level constructor supporting non-orthogonal lattices — hex
    /// packings, skewed test arrays, etc. Vectors are defined in the
    /// CellRef's local (pre-transform) coordinate space, in µm.
    ///
    /// Args:
    ///     columns: Number of columns (1 to 32767; GDS COLROW INT16 limit).
    ///     rows: Number of rows (1 to 32767; GDS COLROW INT16 limit).
    ///     col_vector: Column displacement — the offset between copy
    ///         `(c, r)` and `(c+1, r)`, in µm.
    ///     row_vector: Row displacement — the offset between copy
    ///         `(c, r)` and `(c, r+1)`, in µm.
    ///
    /// Note:
    ///     The Python wrappers validate the [1, 32767] range before
    ///     calling this binding.
    ///
    /// Example:
    ///     ```python
    ///     # Hex packing (flat-top): adjacent rows staggered by pitch/2.
    ///     import math
    ///     pitch = 10.0
    ///     ref = CellRef("unit").array_vectors(
    ///         6, 4,
    ///         Vector2(pitch, 0.0),
    ///         Vector2(pitch / 2.0, pitch * math.sqrt(3.0) / 2.0),
    ///     )
    ///     ```
    fn array_vectors(
        &self,
        columns: &Bound<'_, PyAny>,
        rows: &Bound<'_, PyAny>,
        col_vector: &PyVector2,
        row_vector: &PyVector2,
    ) -> PyResult<Self> {
        let (columns, rows) = extract_array_dimensions(columns, rows)?;
        if !col_vector.0.is_finite() {
            return Err(PyValueError::new_err(
                "CellRef array column vector must be finite",
            ));
        }
        if !row_vector.0.is_finite() {
            return Err(PyValueError::new_err(
                "CellRef array row vector must be finite",
            ));
        }
        Ok(PyCellRef(self.0.clone().array_vectors(
            columns,
            rows,
            col_vector.0,
            row_vector.0,
        )))
    }

    /// Cell name being referenced.
    #[getter]
    fn cell_name(&self) -> &str {
        &self.0.cell_name
    }

    /// Get a transformed port from this cell reference.
    ///
    /// Returns the named port from the source cell, transformed by this
    /// CellRef's transform (position, rotation, mirror, etc.).
    ///
    /// Args:
    ///     name: Name of the port to retrieve
    ///     cell: The source Cell object containing the port definition
    ///
    /// Returns:
    ///     The port with position and direction transformed
    ///
    /// Raises:
    ///     KeyError: If the port is not found in the cell
    ///     ValueError: If the transformed port is not representable
    ///
    /// Example:
    ///     ```python
    ///     gc_cell = grating_coupler(layer=layer)
    ///     gc_ref = CellRef(gc_cell).at(100, 50).rotate(180)
    ///     
    ///     # Get the transformed port
    ///     opt_port = gc_ref.port("opt", gc_cell)
    ///     
    ///     # Use in routing
    ///     route = Route.through(opt_port, ..., layer=layer)
    ///     ```
    fn port(&self, name: &str, cell: &PyCell) -> PyResult<PyPort> {
        let original_port = cell.0.port(name).ok_or_else(|| {
            pyo3::exceptions::PyKeyError::new_err(format!("Port '{}' not found", name))
        })?;
        original_port
            .try_transform(&self.0.transform)
            .map(PyPort)
            .ok_or_else(|| {
                PyValueError::new_err("CellRef port transform produced invalid finite geometry")
            })
    }

    fn __repr__(&self) -> String {
        format!(
            "CellRef('{}', at=({}, {}))",
            self.0.cell_name, self.0.transform.tx, self.0.transform.ty
        )
    }
}

/// A cell containing geometry and references to other cells.
#[pyclass(name = "Cell", from_py_object)]
#[derive(Clone)]
pub struct PyCell(pub Cell, RouteAnnotations);

impl PyCell {
    pub(crate) fn from_parts(cell: Cell, route_annotations: RouteAnnotations) -> Self {
        Self(cell, route_annotations)
    }

    pub(crate) fn route_annotations(&self) -> &RouteAnnotations {
        &self.1
    }
}

#[pymethods]
impl PyCell {
    /// Create a new empty cell.
    ///
    /// Args:
    ///     name: Cell name. Must be non-empty, <=32 characters, and printable ASCII.
    ///
    /// Raises:
    ///     ValueError: If the name is empty, longer than 32 characters,
    ///         or contains non-printable ASCII characters (spaces, Unicode, etc.)
    #[new]
    fn new(name: String) -> PyResult<Self> {
        rosette_io::gds::validate_structure_name(&name)
            .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        Ok(Self::from_parts(
            Cell::new(name),
            RouteAnnotations::default(),
        ))
    }

    /// Cell name.
    #[getter]
    fn name(&self) -> &str {
        self.0.name()
    }

    /// Add a polygon to the cell.
    ///
    /// Args:
    ///     polygon: The polygon to add
    ///     layer: Layer number or Layer object
    #[pyo3(signature = (polygon, layer))]
    fn add_polygon(&mut self, polygon: &PyPolygon, layer: &Bound<'_, PyAny>) -> PyResult<()> {
        if let Some(index) = polygon
            .0
            .vertices()
            .iter()
            .position(|point| !point.is_finite())
        {
            return Err(PyValueError::new_err(format!(
                "Polygon contains a non-finite point at index {index}"
            )));
        }
        let layer = extract_layer(layer)?;
        self.0.add_polygon(polygon.0.clone(), layer);
        Ok(())
    }

    /// Add a cell reference.
    fn add_ref(&mut self, cell_ref: &PyCellRef) -> PyResult<()> {
        validate_cell_ref(&cell_ref.0)?;
        self.0.add_ref(cell_ref.0.clone());
        Ok(())
    }

    /// Add a path (centerline with width) to the cell.
    ///
    /// Paths are an alternative to polygons for representing waveguides and
    /// similar structures. They store a centerline and width, which can be
    /// more compact than storing the full polygon outline.
    ///
    /// Args:
    ///     points: List of Point objects along the path centerline
    ///     width: Width of the path
    ///     layer: Layer number or Layer object
    ///     end_type: Path end type (default: PathEndType.FLUSH)
    ///
    /// Example:
    ///     ```python
    ///     cell.add_path(
    ///         [Point(0, 0), Point(100, 0), Point(100, 50)],
    ///         width=0.5,
    ///         layer=1,
    ///         end_type=PathEndType.ROUND
    ///     )
    ///     ```
    #[pyo3(signature = (points, width, layer, end_type=None))]
    fn add_path(
        &mut self,
        points: Vec<PyPoint>,
        width: f64,
        layer: &Bound<'_, PyAny>,
        end_type: Option<PyPathEndType>,
    ) -> PyResult<()> {
        if points.len() < 2 {
            return Err(PyValueError::new_err(
                "Cell path requires at least 2 points",
            ));
        }
        if let Some(index) = points.iter().position(|point| !point.0.is_finite()) {
            return Err(PyValueError::new_err(format!(
                "Cell path point {index} must be finite"
            )));
        }
        if !width.is_finite() {
            return Err(PyValueError::new_err("Cell path width must be finite"));
        }
        if width == 0.0 {
            return Err(PyValueError::new_err("Cell path width cannot be zero"));
        }
        let layer = extract_layer(layer)?;
        let points: Vec<_> = points.into_iter().map(|p| p.0).collect();
        let end_type = end_type.map(|e| e.0).unwrap_or(PathEndType::Flush);
        self.0.add_path(points, width, layer, end_type);
        Ok(())
    }

    /// Add a text label to the cell.
    ///
    /// Text labels are useful for debugging and documentation but are
    /// typically not fabricated.
    ///
    /// Args:
    ///     text: The text string
    ///     position: Position of the text
    ///     layer: Layer number or Layer object
    ///     height: Text height in user units (default: 1.0)
    ///
    /// Example:
    ///     ```python
    ///     cell.add_text("Input", Point(0, 5), layer=10)
    ///     cell.add_text("Big Label", Point(0, 10), layer=10, height=5.0)
    ///     ```
    #[pyo3(signature = (text, position, layer, height=None))]
    fn add_text(
        &mut self,
        text: String,
        position: &PyPoint,
        layer: &Bound<'_, PyAny>,
        height: Option<f64>,
    ) -> PyResult<()> {
        let height = height.unwrap_or(1.0);
        if !position.0.is_finite() {
            return Err(PyValueError::new_err("Cell text position must be finite"));
        }
        if !height.is_finite() {
            return Err(PyValueError::new_err("Cell text height must be finite"));
        }
        if height <= 0.0 {
            return Err(PyValueError::new_err("Cell text height must be positive"));
        }
        let layer = extract_layer(layer)?;
        self.0.add_text_with_height(text, position.0, layer, height);
        Ok(())
    }

    /// Add a port.
    fn add_port(&mut self, port: &PyPort) -> PyResult<()> {
        validate_port_parts(
            &port.0.name,
            port.0.position,
            port.0.direction,
            port.0.width,
        )?;
        if self.0.port(&port.0.name).is_some() {
            return Err(PyValueError::new_err(format!(
                "Cell already contains a port named {:?}",
                port.0.name
            )));
        }
        self.0.add_port(port.0.clone());
        Ok(())
    }

    /// Get a port by name. Raises KeyError if not found.
    fn port(&self, name: &str) -> PyResult<PyPort> {
        self.0.port(name).map(|p| PyPort(p.clone())).ok_or_else(|| {
            pyo3::exceptions::PyKeyError::new_err(format!("Port '{}' not found", name))
        })
    }

    /// Get all ports.
    fn ports(&self) -> Vec<PyPort> {
        self.0.ports().iter().map(|p| PyPort(p.clone())).collect()
    }

    /// Number of polygons.
    fn polygon_count(&self) -> usize {
        self.0.polygon_count()
    }

    /// Get all polygons (and their layers) stored directly on this cell.
    ///
    /// Does not descend into referenced cells; only returns polygons added
    /// via ``add_polygon``. Cell references and paths are excluded.
    ///
    /// Returns:
    ///     List of ``(Polygon, Layer)`` tuples.
    fn polygons(&self) -> Vec<(PyPolygon, PyLayer)> {
        self.0
            .polygons()
            .map(|(polygon, layer)| (PyPolygon(polygon.clone()), PyLayer(*layer)))
            .collect()
    }

    /// Number of cell references.
    fn ref_count(&self) -> usize {
        self.0.ref_count()
    }

    /// Get the unique names of all cells referenced by this cell.
    ///
    /// Returns:
    ///     List of unique cell names that this cell references (direct children only).
    fn cell_ref_names(&self) -> Vec<String> {
        let mut names: Vec<String> = self.0.cell_refs().map(|r| r.cell_name.clone()).collect();
        names.sort();
        names.dedup();
        names
    }

    /// Number of paths.
    fn path_count(&self) -> usize {
        self.0.path_count()
    }

    /// Number of text labels.
    fn text_count(&self) -> usize {
        self.0.text_count()
    }

    /// Calculate the bounding box.
    fn bbox(&self) -> Option<PyBBox> {
        self.0.bbox().map(PyBBox)
    }

    /// Place a cell reference by aligning its port to a target port.
    ///
    /// This is the primary method for positioning components in a design.
    ///
    /// Args:
    ///     cell_ref: The cell reference to place
    ///     cell_port: The port on the referenced cell to align
    ///     target_port: The target port to connect to
    ///
    /// Returns:
    ///     The transformed CellRef
    ///
    /// Example:
    ///     ```python
    ///     # Place a grating coupler aligned to a waveguide's output
    ///     gc_cell = gc.to_cell(layer)
    ///     gc_port = gc_cell.port("opt")
    ///     wg_out = waveguide.port("out")
    ///     
    ///     ref = cell.place_at_port(CellRef("gc"), gc_port, wg_out)
    ///     cell.add_ref(ref)
    ///     ```
    fn place_at_port(
        &self,
        cell_ref: &PyCellRef,
        cell_port: &PyPort,
        target_port: &PyPort,
    ) -> PyResult<PyCellRef> {
        let transform = connect_transform(&cell_port.0, &target_port.0);
        let transform = transform.then(&cell_ref.0.transform);
        validate_cell_ref_transform(&transform)?;
        // Create a new CellRef with the combined transform
        Ok(PyCellRef(CellRef::with_transform(
            cell_ref.0.cell_name.clone(),
            transform,
        )))
    }

    fn __repr__(&self) -> String {
        let mut parts = vec![format!("{} polygons", self.0.polygon_count())];
        if self.0.path_count() > 0 {
            parts.push(format!("{} paths", self.0.path_count()));
        }
        if self.0.text_count() > 0 {
            parts.push(format!("{} texts", self.0.text_count()));
        }
        if self.0.ref_count() > 0 {
            parts.push(format!("{} refs", self.0.ref_count()));
        }
        format!("Cell('{}', {})", self.0.name(), parts.join(", "))
    }
}

/// A library containing multiple cells.
#[pyclass(name = "Library", from_py_object)]
#[derive(Clone)]
pub struct PyLibrary(pub Library, RouteAnnotationMap);

impl PyLibrary {
    pub(crate) fn from_library(library: Library) -> Self {
        let route_annotations = library
            .cells()
            .iter()
            .map(|cell| (cell.name().to_string(), RouteAnnotations::default()))
            .collect();
        Self(library, route_annotations)
    }

    pub(crate) fn route_annotations(&self) -> &RouteAnnotationMap {
        &self.1
    }

    fn wrap_cell(&self, cell: &Cell) -> PyCell {
        PyCell::from_parts(
            cell.clone(),
            self.1.get(cell.name()).cloned().unwrap_or_default(),
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn annotated_cell(name: &str, path_length: f64) -> PyCell {
        PyCell::from_parts(
            Cell::new(name),
            RouteAnnotations::new(Some(path_length), Vec::new(), Vec::new()),
        )
    }

    #[test]
    fn library_preserves_route_annotations_and_duplicate_policy() {
        let leaf = annotated_cell("leaf", 12.0);
        let mut root = Cell::new("root");
        root.add_ref(CellRef::new("leaf"));
        let root = PyCell::from_parts(root, RouteAnnotations::default());
        let mut library = PyLibrary::from_library(Library::new("test"));

        library
            .add_cell_recursive(&root, vec![leaf.clone()], "keep")
            .unwrap();

        assert_eq!(
            library
                .cell("leaf")
                .unwrap()
                .route_annotations()
                .path_length(),
            Some(12.0)
        );
        assert_eq!(
            library
                .cells()
                .into_iter()
                .find(|cell| cell.0.name() == "leaf")
                .unwrap()
                .route_annotations()
                .path_length(),
            Some(12.0)
        );
        assert_eq!(library.roots()[0].0.name(), "root");
        assert_eq!(library.top_cell().unwrap().0.name(), "root");

        library
            .add_cell(&annotated_cell("leaf", 99.0), "keep")
            .unwrap();
        assert_eq!(
            library
                .cell("leaf")
                .unwrap()
                .route_annotations()
                .path_length(),
            Some(12.0)
        );
        assert!(
            library
                .add_cell(&annotated_cell("leaf", 99.0), "error")
                .is_err()
        );
        assert_eq!(library.0.cells().len(), 2);
        assert_eq!(library.1.len(), 2);
    }

    #[test]
    fn core_library_import_creates_default_route_annotations() {
        let mut core = Library::new("gds");
        core.add_cell(Cell::new("geometry")).unwrap();

        let library = PyLibrary::from_library(core);

        assert_eq!(
            library.route_annotations().get("geometry"),
            Some(&RouteAnnotations::default())
        );
    }
}

fn parse_duplicate_policy(value: &str) -> PyResult<DuplicatePolicy> {
    match value {
        "error" => Ok(DuplicatePolicy::Error),
        "keep" => Ok(DuplicatePolicy::KeepExisting),
        _ => Err(pyo3::exceptions::PyValueError::new_err(
            "on_duplicate must be 'error' or 'keep'",
        )),
    }
}

#[pymethods]
impl PyLibrary {
    /// Create a new library.
    #[new]
    fn new(name: String) -> Self {
        Self::from_library(Library::new(name))
    }

    /// Library name.
    #[getter]
    fn name(&self) -> &str {
        self.0.name()
    }

    /// Add a cell to the library.
    ///
    /// `on_duplicate="error"` rejects an existing identity, while
    /// `on_duplicate="keep"` retains the installed definition.
    ///
    /// Raises:
    ///     ValueError: If the cell name is invalid or a cell with the
    ///         same name already exists under the error policy.
    #[pyo3(signature = (cell, *, on_duplicate="error"))]
    fn add_cell(&mut self, cell: &PyCell, on_duplicate: &str) -> PyResult<()> {
        rosette_io::gds::validate_structure_name(cell.0.name())
            .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        let duplicates = parse_duplicate_policy(on_duplicate)?;
        let mut library = self.0.clone();
        let inserted = library
            .insert_cell(cell.0.clone(), duplicates)
            .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        if inserted {
            let mut route_annotations = self.1.clone();
            route_annotations.insert(cell.0.name().to_string(), cell.route_annotations().clone());
            self.0 = library;
            self.1 = route_annotations;
        }
        Ok(())
    }

    /// Add a cell and all its referenced cells recursively.
    ///
    /// This method automatically adds all cells that are referenced by the
    /// given cell, resolving the entire hierarchy. You must provide a list
    /// of all available cells that may be referenced.
    ///
    /// Validation is atomic. Missing references, cycles, ambiguous candidate
    /// definitions, and rejected duplicates raise `ValueError` without
    /// partially changing the library.
    ///
    /// Args:
    ///     cell: The cell to add (typically the top-level cell)
    ///     available_cells: List of all cells that may be referenced
    ///
    /// Example:
    ///     ```python
    ///     lib = Library("my_design")
    ///     all_cells = [mmi_cell, sbend_cell, waveguide_cell, top_cell]
    ///     lib.add_cell_recursive(top_cell, all_cells)
    ///     ```
    #[pyo3(signature = (cell, available_cells, *, on_duplicate="keep"))]
    fn add_cell_recursive(
        &mut self,
        cell: &PyCell,
        available_cells: Vec<PyCell>,
        on_duplicate: &str,
    ) -> PyResult<()> {
        let available_cells: Vec<(Cell, RouteAnnotations)> = available_cells
            .into_iter()
            .map(|cell| (cell.0, cell.1))
            .collect();
        let cells: Vec<Cell> = available_cells
            .iter()
            .map(|(cell, _)| cell.clone())
            .collect();
        // Validate all cell names before adding
        for c in &cells {
            rosette_io::gds::validate_structure_name(c.name())
                .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        }
        rosette_io::gds::validate_structure_name(cell.0.name())
            .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        let duplicates = parse_duplicate_policy(on_duplicate)?;
        let existing_names: std::collections::HashSet<_> = self
            .0
            .cells()
            .iter()
            .map(|cell| cell.name().to_string())
            .collect();
        let mut incoming_annotations: RouteAnnotationMap = available_cells
            .into_iter()
            .map(|(cell, annotations)| (cell.name().to_string(), annotations))
            .collect();
        incoming_annotations.insert(cell.0.name().to_string(), cell.route_annotations().clone());

        let mut library = self.0.clone();
        library
            .add_cell_recursive(cell.0.clone(), &cells, duplicates)
            .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        let mut route_annotations = self.1.clone();
        for added in library
            .cells()
            .iter()
            .filter(|added| !existing_names.contains(added.name()))
        {
            route_annotations.insert(
                added.name().to_string(),
                incoming_annotations
                    .remove(added.name())
                    .unwrap_or_default(),
            );
        }
        self.0 = library;
        self.1 = route_annotations;
        Ok(())
    }

    /// Get a cell by name.
    fn cell(&self, name: &str) -> Option<PyCell> {
        self.0.cell(name).map(|cell| self.wrap_cell(cell))
    }

    /// Get all cells.
    fn cells(&self) -> Vec<PyCell> {
        self.0
            .cells()
            .iter()
            .map(|cell| self.wrap_cell(cell))
            .collect()
    }

    /// Get graph-derived root cells in deterministic library order.
    fn roots(&self) -> Vec<PyCell> {
        self.0
            .roots()
            .into_iter()
            .map(|cell| self.wrap_cell(cell))
            .collect()
    }

    /// Select an existing cell as the explicit top entry cell.
    fn set_top_cell(&mut self, name: &str) -> PyResult<()> {
        self.0
            .set_top_cell(name)
            .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))
    }

    /// Clear the explicit top selection and restore unique-root inference.
    fn clear_top_cell(&mut self) {
        self.0.clear_top_cell();
    }

    /// Get the explicit top cell or the sole graph-derived root.
    fn top_cell(&self) -> Option<PyCell> {
        self.0.top_cell().map(|cell| self.wrap_cell(cell))
    }

    /// Calculate the fully-resolved bounding box of a cell in this library.
    ///
    /// Unlike ``Cell.bbox()``, this recursively resolves every cell reference
    /// (SREF and AREF) and expands array repetitions, so the returned box
    /// covers everything that would appear when the cell is rendered or
    /// written to GDS.
    ///
    /// Args:
    ///     name: Name of the cell to measure.
    ///
    /// Returns:
    ///     The fully-resolved BBox, or None if the cell does not exist or
    ///     contains no geometry.
    ///
    /// Example:
    ///     ```python
    ///     lib = Library("design")
    ///     lib.add_cell(unit)
    ///     lib.add_cell(top)  # contains a 5x3 AREF of `unit`
    ///     bb = lib.cell_bbox("top")  # covers all 15 copies
    ///     ```
    fn cell_bbox(&self, name: &str) -> Option<PyBBox> {
        self.0.cell_bbox(name).map(PyBBox)
    }

    fn __repr__(&self) -> String {
        format!(
            "Library('{}', {} cells)",
            self.0.name(),
            self.0.cells().len()
        )
    }
}

/// Calculate the transform to connect one port to another.
///
/// This aligns a component so that `component_port` matches the position
/// of `target_port` with opposite directions (so they face each other).
///
/// Args:
///     component_port: The port on the component to be placed
///     target_port: The port to connect to
///
/// Returns:
///     A Transform that, when applied to the component, aligns the ports.
///
/// Example:
///     ```python
///     from rosette import Cell, Instance, Point, Port, Vector2, connect_transform
///
///     child = Cell("child")
///     child_port = Port("in", Point(0, 0), Vector2(-1, 0), width=0.5)
///     target_port = Port("out", Point(10, 0), Vector2(1, 0), width=0.5)
///     transform = connect_transform(child_port, target_port)
///     instance = Instance(child, transform)
///     ```
#[pyfunction]
#[pyo3(name = "connect_transform")]
pub fn py_connect_transform(component_port: &PyPort, target_port: &PyPort) -> PyTransform {
    PyTransform(connect_transform(&component_port.0, &target_port.0))
}
