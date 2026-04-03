//! Python bindings for geometry types.

use pyo3::prelude::*;
use rosette_core::{BBox, Point, Polygon, Transform, Vector2};
use rosette_core::{
    arc_points, fresnel_c, fresnel_s, offset_polygon, offset_polygon_varying, path_length,
};
use std::f64::consts::PI;

/// A 2D point representing a position in space.
#[pyclass(name = "Point")]
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
#[pyclass(name = "Vector2")]
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
#[pyclass(name = "Polygon")]
#[derive(Clone)]
pub struct PyPolygon(pub Polygon);

#[pymethods]
impl PyPolygon {
    /// Create a polygon from a list of points.
    #[new]
    fn new(vertices: Vec<PyPoint>) -> PyResult<Self> {
        if vertices.len() < 3 {
            return Err(pyo3::exceptions::PyValueError::new_err(
                "Polygon requires at least 3 vertices",
            ));
        }
        let points: Vec<Point> = vertices.into_iter().map(|p| p.0).collect();
        Ok(PyPolygon(Polygon::new(points)))
    }

    /// Create a rectangle from origin, width, and height.
    #[staticmethod]
    fn rect(origin: &PyPoint, width: f64, height: f64) -> Self {
        PyPolygon(Polygon::rect(origin.0, width, height))
    }

    /// Create a centered rectangle.
    #[staticmethod]
    fn rect_centered(center: &PyPoint, width: f64, height: f64) -> Self {
        PyPolygon(Polygon::rect_centered(center.0, width, height))
    }

    /// Create a regular polygon with n sides.
    #[staticmethod]
    fn regular(center: &PyPoint, radius: f64, sides: usize) -> PyResult<Self> {
        if sides < 3 {
            return Err(pyo3::exceptions::PyValueError::new_err(
                "Regular polygon requires at least 3 sides",
            ));
        }
        Ok(PyPolygon(Polygon::regular(center.0, radius, sides)))
    }

    /// Get the vertices as a list of points.
    fn vertices(&self) -> Vec<PyPoint> {
        self.0.vertices().iter().map(|p| PyPoint(*p)).collect()
    }

    /// Number of vertices.
    fn __len__(&self) -> usize {
        self.0.len()
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
        PyBBox(self.0.bbox())
    }

    /// Translate by a vector.
    fn translate(&self, v: &PyVector2) -> Self {
        PyPolygon(self.0.translate(v.0))
    }

    /// Rotate around the origin (in degrees).
    fn rotate(&self, angle_deg: f64) -> Self {
        PyPolygon(self.0.rotate(angle_deg * PI / 180.0))
    }

    /// Rotate around a point (in degrees).
    fn rotate_around(&self, center: &PyPoint, angle_deg: f64) -> Self {
        PyPolygon(self.0.rotate_around(center.0, angle_deg * PI / 180.0))
    }

    /// Scale relative to the origin.
    fn scale(&self, sx: f64, sy: f64) -> Self {
        PyPolygon(self.0.scale(sx, sy))
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
        self.0.union(&other.0).into_iter().map(PyPolygon).collect()
    }

    /// Subtract another polygon from this one.
    ///
    /// Returns a list of polygons covering the area of `self` that does not
    /// overlap with `other`. If `other` cuts a hole, the result is a keyholed
    /// single-ring polygon.
    fn subtract(&self, other: &PyPolygon) -> Vec<PyPolygon> {
        self.0
            .subtract(&other.0)
            .into_iter()
            .map(PyPolygon)
            .collect()
    }

    /// Compute the intersection of this polygon with another.
    ///
    /// Returns a list of polygons covering the area shared by both inputs.
    fn intersect(&self, other: &PyPolygon) -> Vec<PyPolygon> {
        self.0
            .intersect(&other.0)
            .into_iter()
            .map(PyPolygon)
            .collect()
    }

    /// Compute the symmetric difference (XOR) of this polygon with another.
    ///
    /// Returns a list of polygons covering the area in either input but not
    /// both.
    fn xor(&self, other: &PyPolygon) -> Vec<PyPolygon> {
        self.0.xor(&other.0).into_iter().map(PyPolygon).collect()
    }

    fn __repr__(&self) -> String {
        format!("Polygon({} vertices)", self.0.len())
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
pub struct PyPolygonIterator {
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
#[pyclass(name = "Transform")]
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

    fn __repr__(&self) -> String {
        format!(
            "Transform(a={}, b={}, c={}, d={}, tx={}, ty={})",
            self.0.a, self.0.b, self.0.c, self.0.d, self.0.tx, self.0.ty
        )
    }
}

/// An axis-aligned bounding box.
#[pyclass(name = "BBox")]
#[derive(Clone)]
pub struct PyBBox(pub BBox);

#[pymethods]
impl PyBBox {
    /// Create a bounding box from min and max points.
    #[new]
    fn new(min: &PyPoint, max: &PyPoint) -> Self {
        PyBBox(BBox::new(min.0, max.0))
    }

    /// Minimum corner.
    #[getter]
    fn min(&self) -> PyPoint {
        PyPoint(self.0.min())
    }

    /// Maximum corner.
    #[getter]
    fn max(&self) -> PyPoint {
        PyPoint(self.0.max())
    }

    /// Width of the bounding box.
    fn width(&self) -> f64 {
        self.0.width()
    }

    /// Height of the bounding box.
    fn height(&self) -> f64 {
        self.0.height()
    }

    /// Center point.
    fn center(&self) -> PyPoint {
        PyPoint(self.0.center())
    }

    /// Area of the bounding box.
    fn area(&self) -> f64 {
        self.0.area()
    }

    /// Check if the bounding box contains a point.
    fn contains(&self, p: &PyPoint) -> bool {
        self.0.contains(p.0)
    }

    /// Merge with another bounding box.
    fn merge(&self, other: &PyBBox) -> Self {
        PyBBox(self.0.merge(&other.0))
    }

    fn __repr__(&self) -> String {
        format!(
            "BBox(min=({}, {}), max=({}, {}))",
            self.0.min().x,
            self.0.min().y,
            self.0.max().x,
            self.0.max().y
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

/// Create a polygon from a centerline and uniform width.
///
/// The polygon is created by offsetting the centerline perpendicular to the
/// path direction at each point, forming a "ribbon" shape.
///
/// Args:
///     centerline: List of points defining the centerline path (minimum 2 points)
///     width: Width of the polygon
///
/// Returns:
///     A closed polygon, or raises ValueError if centerline has fewer than 2 points
#[pyfunction]
#[pyo3(name = "offset_polygon")]
pub fn py_offset_polygon(centerline: Vec<PyPoint>, width: f64) -> PyResult<PyPolygon> {
    let points: Vec<Point> = centerline.into_iter().map(|p| p.0).collect();
    offset_polygon(&points, width)
        .map(PyPolygon)
        .ok_or_else(|| {
            pyo3::exceptions::PyValueError::new_err("Centerline requires at least 2 points")
        })
}

/// Create a polygon from a centerline with varying width.
///
/// Similar to offset_polygon, but allows specifying a different width at each
/// centerline point for tapered or variable-width shapes.
///
/// Args:
///     centerline: List of points defining the centerline path
///     widths: Width at each centerline point (must have same length as centerline)
///
/// Returns:
///     A closed polygon, or raises ValueError if inputs are invalid
#[pyfunction]
#[pyo3(name = "offset_polygon_varying")]
pub fn py_offset_polygon_varying(
    centerline: Vec<PyPoint>,
    widths: Vec<f64>,
) -> PyResult<PyPolygon> {
    let points: Vec<Point> = centerline.into_iter().map(|p| p.0).collect();
    offset_polygon_varying(&points, &widths)
        .map(PyPolygon)
        .ok_or_else(|| {
            pyo3::exceptions::PyValueError::new_err(
                "Centerline requires at least 2 points and widths must match centerline length",
            )
        })
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
