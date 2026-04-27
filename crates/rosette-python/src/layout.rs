//! Python bindings for layout types.

use crate::extract_layer;
use crate::geometry::{PyBBox, PyPoint, PyPolygon, PyTransform, PyVector2};
use pyo3::prelude::*;
use rosette_core::cell::PathEndType;
use rosette_core::component::connect_transform;
use rosette_core::{BendInfo, Cell, CellRef, Layer, Library, Point, Port};
use std::f64::consts::PI;

/// GDS path end type.
#[pyclass(name = "PathEndType")]
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
#[pyclass(name = "Layer")]
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
#[pyclass(name = "Port")]
#[derive(Clone)]
pub struct PyPort(pub Port);

#[pymethods]
impl PyPort {
    /// Create a new port.
    #[new]
    #[pyo3(signature = (name, position, direction, width=None))]
    fn new(name: String, position: &PyPoint, direction: &PyVector2, width: Option<f64>) -> Self {
        let port = match width {
            Some(w) => Port::with_width(name, position.0, direction.0, w),
            None => Port::new(name, position.0, direction.0),
        };
        PyPort(port)
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
#[pyclass(name = "CellRef")]
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
    fn new(cell_or_name: CellOrName) -> Self {
        let name = match cell_or_name {
            CellOrName::Cell(cell) => cell.0.name().to_string(),
            CellOrName::Name(name) => name,
        };
        PyCellRef(CellRef::new(name))
    }

    /// Set the position.
    fn at(&self, x: f64, y: f64) -> Self {
        PyCellRef(self.0.clone().at(x, y))
    }

    /// Rotate by angle (in degrees).
    fn rotate(&self, angle_deg: f64) -> Self {
        PyCellRef(self.0.clone().rotate(angle_deg * PI / 180.0))
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
    fn scale(&self, s: f64) -> Self {
        PyCellRef(self.0.clone().scale(s))
    }

    /// Set array repetition (columns × rows grid with given pitch).
    ///
    /// Creates a GDS AREF — a single compact array reference instead of
    /// many individual references. In the viewer, the entire array is
    /// selected as one object.
    ///
    /// Args:
    ///     columns: Number of columns (1 to 32767; GDS COLROW INT16 limit).
    ///     rows: Number of rows (1 to 32767; GDS COLROW INT16 limit).
    ///     col_spacing: Column pitch — center-to-center distance between
    ///         adjacent copies along local +X, in µm.
    ///     row_spacing: Row pitch — center-to-center distance between
    ///         adjacent copies along local +Y, in µm.
    ///
    /// Note:
    ///     The Python wrappers (`CellRef.array` / `Instance.array`) validate
    ///     the [1, 32767] range before calling this binding.
    ///
    /// Example:
    ///     ```python
    ///     ref = CellRef("unit").at(0, 0).array(10, 5, 20.0, 15.0)
    ///     ```
    fn array(&self, columns: u16, rows: u16, col_spacing: f64, row_spacing: f64) -> Self {
        PyCellRef(
            self.0
                .clone()
                .array(columns, rows, col_spacing, row_spacing),
        )
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
        let transformed_port = original_port.transform(&self.0.transform);
        Ok(PyPort(transformed_port))
    }

    fn __repr__(&self) -> String {
        format!(
            "CellRef('{}', at=({}, {}))",
            self.0.cell_name, self.0.transform.tx, self.0.transform.ty
        )
    }
}

/// A cell containing geometry and references to other cells.
#[pyclass(name = "Cell")]
#[derive(Clone)]
pub struct PyCell(pub Cell);

#[pymethods]
impl PyCell {
    /// Create a new empty cell.
    ///
    /// Raises:
    ///     ValueError: If the name is empty, longer than 32 characters,
    ///         or contains non-printable ASCII characters (spaces, Unicode, etc.)
    #[new]
    fn new(name: String) -> PyResult<Self> {
        rosette_core::validate_cell_name(&name)
            .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        Ok(PyCell(Cell::new(name)))
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
        let layer = extract_layer(layer)?;
        self.0.add_polygon(polygon.0.clone(), layer);
        Ok(())
    }

    /// Add a cell reference.
    fn add_ref(&mut self, cell_ref: &PyCellRef) {
        self.0.add_ref(cell_ref.0.clone());
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
        let layer = extract_layer(layer)?;
        let height = height.unwrap_or(1.0);
        self.0.add_text_with_height(text, position.0, layer, height);
        Ok(())
    }

    /// Add a port.
    fn add_port(&mut self, port: &PyPort) {
        self.0.add_port(port.0.clone());
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

    /// Get path length (if built from a Route).
    ///
    /// Returns None for cells without path length metadata.
    #[getter]
    fn path_length(&self) -> Option<f64> {
        self.0.path_length()
    }

    /// Set path length metadata.
    #[setter]
    fn set_path_length(&mut self, length: f64) {
        self.0.set_path_length(length);
    }

    /// Add a bend info entry.
    ///
    /// Args:
    ///     radius: Effective bend radius in um
    ///     x: X coordinate of bend location
    ///     y: Y coordinate of bend location
    ///     requested_radius: Original requested radius if auto-reduced (optional)
    #[pyo3(signature = (radius, x, y, requested_radius=None))]
    fn add_bend(&mut self, radius: f64, x: f64, y: f64, requested_radius: Option<f64>) {
        let bend = if let Some(req) = requested_radius {
            BendInfo::auto_reduced(radius, Point::new(x, y), req)
        } else {
            BendInfo::new(radius, Point::new(x, y))
        };
        self.0.add_bend(bend);
    }

    /// Get bend info entries as list of dicts.
    ///
    /// Each entry has keys: "radius", "x", "y", and optionally "requested_radius".
    #[getter]
    fn bends(&self, py: Python<'_>) -> PyResult<Py<PyAny>> {
        let list = pyo3::types::PyList::empty(py);
        for bend in self.0.bends() {
            let dict = pyo3::types::PyDict::new(py);
            dict.set_item("radius", bend.radius)?;
            dict.set_item("x", bend.position.x)?;
            dict.set_item("y", bend.position.y)?;
            if let Some(req) = bend.requested_radius {
                dict.set_item("requested_radius", req)?;
            }
            list.append(dict)?;
        }
        Ok(list.into())
    }

    /// Get warnings from the cell metadata.
    #[getter]
    fn cell_warnings(&self) -> Vec<String> {
        self.0.warnings().to_vec()
    }

    /// Add a warning to the cell metadata.
    fn add_warning(&mut self, warning: String) {
        self.0.add_warning(warning);
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
    ) -> PyCellRef {
        let transform = connect_transform(&cell_port.0, &target_port.0);
        // Create a new CellRef with the combined transform
        PyCellRef(CellRef::with_transform(
            cell_ref.0.cell_name.clone(),
            transform.then(&cell_ref.0.transform),
        ))
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
#[pyclass(name = "Library")]
#[derive(Clone)]
pub struct PyLibrary(pub Library);

#[pymethods]
impl PyLibrary {
    /// Create a new library.
    #[new]
    fn new(name: String) -> Self {
        PyLibrary(Library::new(name))
    }

    /// Library name.
    #[getter]
    fn name(&self) -> &str {
        self.0.name()
    }

    /// Add a cell to the library.
    ///
    /// Raises:
    ///     ValueError: If the cell name is invalid or a cell with the
    ///         same name already exists.
    fn add_cell(&mut self, cell: &PyCell) -> PyResult<()> {
        self.0
            .add_cell(cell.0.clone())
            .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))
    }

    /// Add a cell and all its referenced cells recursively.
    ///
    /// This method automatically adds all cells that are referenced by the
    /// given cell, resolving the entire hierarchy. You must provide a list
    /// of all available cells that may be referenced.
    ///
    /// Cells that already exist in the library (by name) are skipped.
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
    fn add_cell_recursive(&mut self, cell: &PyCell, available_cells: Vec<PyCell>) -> PyResult<()> {
        let cells: Vec<Cell> = available_cells.into_iter().map(|c| c.0).collect();
        // Validate all cell names before adding
        for c in &cells {
            rosette_core::validate_cell_name(c.name())
                .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        }
        rosette_core::validate_cell_name(cell.0.name())
            .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
        self.0.add_cell_recursive(cell.0.clone(), &cells);
        Ok(())
    }

    /// Get a cell by name.
    fn cell(&self, name: &str) -> Option<PyCell> {
        self.0.cell(name).map(|c| PyCell(c.clone()))
    }

    /// Get all cells.
    fn cells(&self) -> Vec<PyCell> {
        self.0.cells().iter().map(|c| PyCell(c.clone())).collect()
    }

    /// Get the top cell (last added).
    fn top_cell(&self) -> Option<PyCell> {
        self.0.top_cell().map(|c| PyCell(c.clone()))
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
///     from rosette import connect_transform, Waveguide, Layer
///     
///     wg1 = Waveguide(10.0, 0.5)
///     wg2 = Waveguide(5.0, 0.5)
///     
///     # Calculate transform to connect wg2's input to wg1's output
///     transform = connect_transform(wg2.port_in(), wg1.port_out())
///     
///     # Apply transform to position wg2
///     ref = CellRef("wg2").at(transform.tx, transform.ty).rotate(transform.rotation)
///     ```
#[pyfunction]
#[pyo3(name = "connect_transform")]
pub fn py_connect_transform(component_port: &PyPort, target_port: &PyPort) -> PyTransform {
    PyTransform(connect_transform(&component_port.0, &target_port.0))
}
