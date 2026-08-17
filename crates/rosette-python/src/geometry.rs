//! Python bindings for geometry types.

use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use rosette_core::geometry::{Region, arc_points, fresnel_c, fresnel_s, path_length};
use rosette_core::{BBox, Point, Polygon, Transform, Vector2};
use std::f64::consts::PI;

/// A 2D point representing a position in space.
#[pyclass(name = "Point", from_py_object)]
#[derive(Clone)]
pub struct PyPoint(pub Point);

#[pymethods]
impl PyPoint {
    /// Create a new point.
    #[new]
    #[pyo3(signature = (x=0.0, y=0.0))]
    fn new(x: f64, y: f64) -> Self {
        PyPoint(Point::new(x, y))
    }

    /// The origin point (0, 0).
    #[staticmethod]
    fn origin() -> Self {
        PyPoint(Point::origin())
    }

    /// X coordinate.
    #[getter]
    fn x(&self) -> f64 {
        self.0.x
    }

    /// Y coordinate.
    #[getter]
    fn y(&self) -> f64 {
        self.0.y
    }

    /// Distance to another point.
    fn distance_to(&self, other: &PyPoint) -> f64 {
        self.0.distance_to(other.0)
    }

    /// Translate by a vector.
    fn translate(&self, v: &PyVector2) -> Self {
        PyPoint(self.0.translate(v.0))
    }

    /// Rotate around the origin by angle (in degrees).
    fn rotate(&self, angle_deg: f64) -> Self {
        PyPoint(self.0.rotate(angle_deg * PI / 180.0))
    }

    /// Rotate around a center point by angle (in degrees).
    fn rotate_around(&self, center: &PyPoint, angle_deg: f64) -> Self {
        PyPoint(self.0.rotate_around(center.0, angle_deg * PI / 180.0))
    }

    fn __repr__(&self) -> String {
        format!("Point({}, {})", self.0.x, self.0.y)
    }

    fn __add__(&self, other: &PyVector2) -> Self {
        PyPoint(self.0 + other.0)
    }

    fn __sub__(&self, other: &PyPoint) -> PyVector2 {
        PyVector2(self.0 - other.0)
    }

    fn __eq__(&self, other: &PyPoint) -> bool {
        self.0.x == other.0.x && self.0.y == other.0.y
    }
}

/// A 2D vector representing displacement or direction.
#[pyclass(name = "Vector2", from_py_object)]
#[derive(Clone)]
pub struct PyVector2(pub Vector2);

#[pymethods]
impl PyVector2 {
    /// Create a new vector.
    #[new]
    #[pyo3(signature = (x=0.0, y=0.0))]
    fn new(x: f64, y: f64) -> Self {
        PyVector2(Vector2::new(x, y))
    }

    /// Unit vector in X direction.
    #[staticmethod]
    fn unit_x() -> Self {
        PyVector2(Vector2::unit_x())
    }

    /// Unit vector in Y direction.
    #[staticmethod]
    fn unit_y() -> Self {
        PyVector2(Vector2::unit_y())
    }

    /// Create a unit vector from an angle (in degrees).
    #[staticmethod]
    fn from_angle(angle_deg: f64) -> Self {
        PyVector2(Vector2::from_angle(angle_deg * PI / 180.0))
    }

    #[getter]
    fn x(&self) -> f64 {
        self.0.x
    }

    #[getter]
    fn y(&self) -> f64 {
        self.0.y
    }

    /// Length of the vector.
    fn length(&self) -> f64 {
        self.0.length()
    }

    /// Normalize to unit length.
    fn normalize(&self) -> Self {
        PyVector2(self.0.normalize())
    }

    /// Dot product.
    fn dot(&self, other: &PyVector2) -> f64 {
        self.0.dot(other.0)
    }

    /// Perpendicular vector (90 degrees counter-clockwise).
    fn perpendicular(&self) -> Self {
        PyVector2(self.0.perpendicular())
    }

    /// Rotate by angle (in degrees).
    fn rotate(&self, angle_deg: f64) -> Self {
        PyVector2(self.0.rotate(angle_deg * PI / 180.0))
    }

    fn __repr__(&self) -> String {
        format!("Vector2({}, {})", self.0.x, self.0.y)
    }

    fn __add__(&self, other: &PyVector2) -> Self {
        PyVector2(self.0 + other.0)
    }

    fn __sub__(&self, other: &PyVector2) -> Self {
        PyVector2(self.0 - other.0)
    }

    fn __mul__(&self, scalar: f64) -> Self {
        PyVector2(self.0 * scalar)
    }

    fn __rmul__(&self, scalar: f64) -> Self {
        PyVector2(self.0 * scalar)
    }

    fn __neg__(&self) -> Self {
        PyVector2(-self.0)
    }

    fn __eq__(&self, other: &PyVector2) -> bool {
        self.0.x == other.0.x && self.0.y == other.0.y
    }
}

/// A closed polygon defined by vertices.
#[pyclass(name = "Polygon", from_py_object)]
#[derive(Clone)]
pub struct PyPolygon(pub Polygon);

fn validate_polygon_points(points: &[Point], context: &str) -> PyResult<()> {
    if let Some(index) = points.iter().position(|point| !point.is_finite()) {
        return Err(PyValueError::new_err(format!(
            "{context} contains a non-finite point at index {index}"
        )));
    }
    Ok(())
}

fn validate_rect_inputs(origin: Point, width: f64, height: f64, centered: bool) -> PyResult<()> {
    if !origin.is_finite() {
        return Err(PyValueError::new_err(
            "Rectangle origin or center must be finite",
        ));
    }
    if !width.is_finite() || !height.is_finite() {
        return Err(PyValueError::new_err(
            "Rectangle width and height must be finite",
        ));
    }

    let corners = if centered {
        let half_width = width / 2.0;
        let half_height = height / 2.0;
        [
            Point::new(origin.x - half_width, origin.y - half_height),
            Point::new(origin.x + half_width, origin.y + half_height),
        ]
    } else {
        [origin, Point::new(origin.x + width, origin.y + height)]
    };
    if !corners.iter().all(|point| point.is_finite()) {
        return Err(PyValueError::new_err(
            "Rectangle coordinates must remain finite",
        ));
    }
    Ok(())
}

impl PyPolygon {
    fn from_transformed_points(points: Vec<Point>) -> PyResult<Self> {
        validate_polygon_points(&points, "Polygon transformation")?;
        Polygon::new(points)
            .map(Self)
            .map_err(|_| PyValueError::new_err("Polygon transformation contains invalid geometry"))
    }
}

#[pymethods]
impl PyPolygon {
    /// Create a polygon from a list of points.
    #[new]
    fn new(vertices: Vec<PyPoint>) -> PyResult<Self> {
        if vertices.len() < 3 {
            return Err(PyValueError::new_err(
                "Polygon requires at least 3 vertices",
            ));
        }
        let points: Vec<Point> = vertices.into_iter().map(|p| p.0).collect();
        validate_polygon_points(&points, "Polygon")?;
        Polygon::new(points)
            .map(PyPolygon)
            .map_err(|_| PyValueError::new_err("Polygon contains invalid geometry"))
    }

    /// Create a rectangle from origin, width, and height.
    #[staticmethod]
    fn rect(origin: &PyPoint, width: f64, height: f64) -> PyResult<Self> {
        validate_rect_inputs(origin.0, width, height, false)?;
        Polygon::rect(origin.0, width, height)
            .map(PyPolygon)
            .map_err(|_| PyValueError::new_err("Rectangle coordinates must remain finite"))
    }

    /// Create a centered rectangle.
    #[staticmethod]
    fn rect_centered(center: &PyPoint, width: f64, height: f64) -> PyResult<Self> {
        validate_rect_inputs(center.0, width, height, true)?;
        Polygon::rect_centered(center.0, width, height)
            .map(PyPolygon)
            .map_err(|_| PyValueError::new_err("Rectangle coordinates must remain finite"))
    }

    /// Create a regular polygon with n sides.
    #[staticmethod]
    fn regular(center: &PyPoint, radius: f64, sides: &Bound<'_, PyAny>) -> PyResult<Self> {
        let sides = sides.extract::<usize>().map_err(|_| {
            PyValueError::new_err("Regular polygon sides must be an integer of at least 3")
        })?;
        if sides < 3 {
            return Err(PyValueError::new_err(
                "Regular polygon requires at least 3 sides",
            ));
        }
        if !center.0.is_finite() {
            return Err(PyValueError::new_err(
                "Regular polygon center must be finite",
            ));
        }
        if !radius.is_finite() {
            return Err(PyValueError::new_err(
                "Regular polygon radius must be finite",
            ));
        }
        let extent = radius.abs();
        if ![
            center.0.x - extent,
            center.0.x + extent,
            center.0.y - extent,
            center.0.y + extent,
        ]
        .iter()
        .all(|value| value.is_finite())
        {
            return Err(PyValueError::new_err(
                "Regular polygon coordinates must remain finite",
            ));
        }
        Polygon::regular(center.0, radius, sides)
            .map(PyPolygon)
            .map_err(|_| PyValueError::new_err("Regular polygon coordinates must remain finite"))
    }

    /// Get the vertices as a list of points.
    fn vertices(&self) -> Vec<PyPoint> {
        self.0.vertices().iter().map(|p| PyPoint(*p)).collect()
    }

    /// Number of vertices.
    fn __len__(&self) -> usize {
        self.0.vertices().len()
    }

    /// Calculate the area.
    fn area(&self) -> f64 {
        self.0.area()
    }

    /// Calculate the centroid.
    fn centroid(&self) -> PyPoint {
        PyPoint(self.0.centroid())
    }

    /// Calculate the bounding box.
    fn bbox(&self) -> PyBBox {
        PyBBox::from_core(self.0.bbox())
    }

    /// Translate by a vector.
    fn translate(&self, v: &PyVector2) -> PyResult<Self> {
        if !v.0.is_finite() {
            return Err(PyValueError::new_err(
                "Polygon translation vector must be finite",
            ));
        }
        Self::from_transformed_points(
            self.0
                .vertices()
                .iter()
                .map(|point| point.translate(v.0))
                .collect(),
        )
    }

    /// Rotate around the origin (in degrees).
    fn rotate(&self, angle_deg: f64) -> PyResult<Self> {
        let angle = angle_deg * PI / 180.0;
        if !angle.is_finite() {
            return Err(PyValueError::new_err(
                "Polygon rotation angle must be finite",
            ));
        }
        Self::from_transformed_points(
            self.0
                .vertices()
                .iter()
                .map(|point| point.rotate(angle))
                .collect(),
        )
    }

    /// Rotate around a point (in degrees).
    fn rotate_around(&self, center: &PyPoint, angle_deg: f64) -> PyResult<Self> {
        let angle = angle_deg * PI / 180.0;
        if !center.0.is_finite() {
            return Err(PyValueError::new_err(
                "Polygon rotation center must be finite",
            ));
        }
        if !angle.is_finite() {
            return Err(PyValueError::new_err(
                "Polygon rotation angle must be finite",
            ));
        }
        Self::from_transformed_points(
            self.0
                .vertices()
                .iter()
                .map(|point| point.rotate_around(center.0, angle))
                .collect(),
        )
    }

    /// Scale relative to the origin.
    fn scale(&self, sx: f64, sy: f64) -> PyResult<Self> {
        if !sx.is_finite() || !sy.is_finite() {
            return Err(PyValueError::new_err(
                "Polygon scale factors must be finite",
            ));
        }
        Self::from_transformed_points(
            self.0
                .vertices()
                .iter()
                .map(|point| point.scale(sx, sy))
                .collect(),
        )
    }

    /// Mirror across the X axis.
    fn mirror_x(&self) -> Self {
        PyPolygon(self.0.mirror_x())
    }

    /// Mirror across the Y axis.
    fn mirror_y(&self) -> Self {
        PyPolygon(self.0.mirror_y())
    }

    /// Compute the union of this polygon with another.
    ///
    /// Returns a list of polygons covering the combined area of both inputs.
    /// Overlapping regions are merged. Holes are keyholed into single-ring
    /// polygons.
    fn union(&self, other: &PyPolygon) -> Vec<PyPolygon> {
        Region::from_polygon(&self.0)
            .union(&Region::from_polygon(&other.0))
            .to_keyholed_polygons()
            .into_iter()
            .map(PyPolygon)
            .collect()
    }

    /// Subtract another polygon from this one.
    ///
    /// Returns a list of polygons covering the area of `self` that does not
    /// overlap with `other`. If `other` cuts a hole, the result is a keyholed
    /// single-ring polygon.
    fn subtract(&self, other: &PyPolygon) -> Vec<PyPolygon> {
        Region::from_polygon(&self.0)
            .subtract(&Region::from_polygon(&other.0))
            .to_keyholed_polygons()
            .into_iter()
            .map(PyPolygon)
            .collect()
    }

    /// Compute the intersection of this polygon with another.
    ///
    /// Returns a list of polygons covering the area shared by both inputs.
    fn intersect(&self, other: &PyPolygon) -> Vec<PyPolygon> {
        Region::from_polygon(&self.0)
            .intersect(&Region::from_polygon(&other.0))
            .to_keyholed_polygons()
            .into_iter()
            .map(PyPolygon)
            .collect()
    }

    /// Compute the symmetric difference (XOR) of this polygon with another.
    ///
    /// Returns a list of polygons covering the area in either input but not
    /// both.
    fn xor(&self, other: &PyPolygon) -> Vec<PyPolygon> {
        Region::from_polygon(&self.0)
            .xor(&Region::from_polygon(&other.0))
            .to_keyholed_polygons()
            .into_iter()
            .map(PyPolygon)
            .collect()
    }

    fn __repr__(&self) -> String {
        format!("Polygon({} vertices)", self.0.vertices().len())
    }

    fn __iter__(slf: PyRef<'_, Self>) -> PyPolygonIterator {
        PyPolygonIterator {
            vertices: slf.0.vertices().iter().map(|p| PyPoint(*p)).collect(),
            index: 0,
        }
    }
}

/// Iterator over polygon vertices.
#[pyclass(name = "PolygonIterator")]
struct PyPolygonIterator {
    vertices: Vec<PyPoint>,
    index: usize,
}

#[pymethods]
impl PyPolygonIterator {
    fn __iter__(slf: PyRef<'_, Self>) -> PyRef<'_, Self> {
        slf
    }

    fn __next__(&mut self) -> Option<PyPoint> {
        if self.index < self.vertices.len() {
            let point = self.vertices[self.index].clone();
            self.index += 1;
            Some(point)
        } else {
            None
        }
    }
}

/// A 2D affine transformation.
#[pyclass(name = "Transform", from_py_object)]
#[derive(Clone)]
pub struct PyTransform(pub Transform);

#[pymethods]
impl PyTransform {
    /// Identity transform.
    #[new]
    fn new() -> Self {
        PyTransform(Transform::identity())
    }

    /// Identity transform.
    #[staticmethod]
    fn identity() -> Self {
        PyTransform(Transform::identity())
    }

    /// Translation transform.
    #[staticmethod]
    fn translate(tx: f64, ty: f64) -> Self {
        PyTransform(Transform::translate(tx, ty))
    }

    /// Rotation transform (angle in degrees).
    #[staticmethod]
    fn rotate(angle_deg: f64) -> Self {
        PyTransform(Transform::rotate(angle_deg * PI / 180.0))
    }

    /// Uniform scale transform.
    #[staticmethod]
    fn scale_uniform(s: f64) -> Self {
        PyTransform(Transform::scale_uniform(s))
    }

    /// Non-uniform scale transform.
    #[staticmethod]
    fn scale(sx: f64, sy: f64) -> Self {
        PyTransform(Transform::scale(sx, sy))
    }

    /// Apply the transform to a point.
    fn apply(&self, p: &PyPoint) -> PyPoint {
        PyPoint(self.0.apply(p.0))
    }

    /// Compose with another transform.
    fn then(&self, other: &PyTransform) -> Self {
        PyTransform(self.0.then(&other.0))
    }

    /// Whether this transform is finite and has a finite inverse.
    fn _is_finite_invertible(&self) -> bool {
        self.0.is_finite() && self.0.is_invertible()
    }

    fn __repr__(&self) -> String {
        format!(
            "Transform(a={}, b={}, c={}, d={}, tx={}, ty={})",
            self.0.a, self.0.b, self.0.c, self.0.d, self.0.tx, self.0.ty
        )
    }
}

/// An axis-aligned bounding box.
#[pyclass(name = "BBox", from_py_object)]
#[derive(Clone)]
pub struct PyBBox {
    min: Point,
    max: Point,
}

impl PyBBox {
    pub(crate) fn from_core(bbox: BBox) -> Self {
        Self {
            min: bbox.min(),
            max: bbox.max(),
        }
    }

    pub(crate) fn to_core(&self) -> Result<BBox, rosette_core::BBoxValidationReason> {
        BBox::new(self.min, self.max)
    }
}

#[pymethods]
impl PyBBox {
    /// Create a bounding box from min and max points.
    #[new]
    fn new(min: &PyPoint, max: &PyPoint) -> Self {
        Self {
            min: min.0,
            max: max.0,
        }
    }

    /// Minimum corner.
    #[getter]
    fn min(&self) -> PyPoint {
        PyPoint(self.min)
    }

    /// Maximum corner.
    #[getter]
    fn max(&self) -> PyPoint {
        PyPoint(self.max)
    }

    /// Width of the bounding box.
    fn width(&self) -> f64 {
        self.max.x - self.min.x
    }

    /// Height of the bounding box.
    fn height(&self) -> f64 {
        self.max.y - self.min.y
    }

    /// Center point.
    fn center(&self) -> PyPoint {
        let center = self.to_core().map_or_else(
            |_| {
                Point::new(
                    (self.min.x + self.max.x) / 2.0,
                    (self.min.y + self.max.y) / 2.0,
                )
            },
            |bbox| bbox.center(),
        );
        PyPoint(center)
    }

    /// Area of the bounding box.
    fn area(&self) -> f64 {
        self.width() * self.height()
    }

    /// Check if the bounding box contains a point.
    fn contains(&self, p: &PyPoint) -> bool {
        p.0.x >= self.min.x && p.0.x <= self.max.x && p.0.y >= self.min.y && p.0.y <= self.max.y
    }

    /// Merge with another bounding box.
    fn merge(&self, other: &PyBBox) -> Self {
        Self {
            min: Point::new(self.min.x.min(other.min.x), self.min.y.min(other.min.y)),
            max: Point::new(self.max.x.max(other.max.x), self.max.y.max(other.max.y)),
        }
    }

    fn __repr__(&self) -> String {
        format!(
            "BBox(min=({}, {}), max=({}, {}))",
            self.min.x, self.min.y, self.max.x, self.max.y
        )
    }
}

// =============================================================================
// Utility Functions
// =============================================================================

/// Generate points along a circular arc.
///
/// Args:
///     center: Center point of the arc
///     radius: Radius of the arc
///     start_angle: Starting angle in degrees (0 = +X direction)
///     end_angle: Ending angle in degrees
///     num_points: Number of points to generate (default: 64)
///
/// Returns:
///     List of points along the arc
#[pyfunction]
#[pyo3(name = "arc_points", signature = (center, radius, start_angle, end_angle, num_points=64))]
pub fn py_arc_points(
    center: &PyPoint,
    radius: f64,
    start_angle: f64,
    end_angle: f64,
    num_points: usize,
) -> Vec<PyPoint> {
    let start_rad = start_angle * PI / 180.0;
    let end_rad = end_angle * PI / 180.0;
    arc_points(center.0, radius, start_rad, end_rad, num_points)
        .into_iter()
        .map(PyPoint)
        .collect()
}

/// Calculate the total length of a polyline path.
///
/// Args:
///     points: List of points defining the path
///
/// Returns:
///     Sum of distances between consecutive points
#[pyfunction]
#[pyo3(name = "path_length")]
pub fn py_path_length(points: Vec<PyPoint>) -> f64 {
    let pts: Vec<Point> = points.into_iter().map(|p| p.0).collect();
    path_length(&pts)
}

/// Fresnel cosine integral C(t).
///
/// The Fresnel cosine integral is defined as:
/// C(t) = integral from 0 to t of cos(pi/2 * u^2) du
///
/// Used for generating Euler (clothoid) spiral bends.
///
/// Args:
///     t: Upper limit of integration
///
/// Returns:
///     The value of C(t)
#[pyfunction]
#[pyo3(name = "fresnel_c")]
pub fn py_fresnel_c(t: f64) -> f64 {
    fresnel_c(t)
}

/// Fresnel sine integral S(t).
///
/// The Fresnel sine integral is defined as:
/// S(t) = integral from 0 to t of sin(pi/2 * u^2) du
///
/// Used for generating Euler (clothoid) spiral bends.
///
/// Args:
///     t: Upper limit of integration
///
/// Returns:
///     The value of S(t)
#[pyfunction]
#[pyo3(name = "fresnel_s")]
pub fn py_fresnel_s(t: f64) -> f64 {
    fresnel_s(t)
}
