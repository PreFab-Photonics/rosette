//! Python bindings for Route.

use crate::extract_layer;
use crate::geometry::PyPoint;
use crate::layout::{PyCell, PyPort};
use pyo3::prelude::*;
use pyo3::types::{PyList, PyTuple};
use rosette_core::Route;
use std::f64::consts::PI;

/// A path-based waveguide route.
///
/// Routes generate continuous waveguide geometry from a series of waypoints,
/// automatically inserting bends at corners and tapers for width transitions.
///
/// Example:
///     route = Route(Layer(1, 0), width=0.5, bend_radius=5.0)
///     route.start_at(0, 0, angle=0)
///     route.to(50, 0)
///     route.to(50, 30)
///     route.end_at(100, 30, angle=0)
///     cell = route.to_cell("my_route")
#[pyclass(name = "Route")]
pub struct PyRoute {
    route: Route,
}

#[pymethods]
impl PyRoute {
    /// Create a new Route.
    ///
    /// Args:
    ///     layer: The layer for the route geometry
    ///     width: Default waveguide width (default: 0.5)
    ///     bend_radius: Default bend radius at corners (default: 5.0)
    ///     auto_taper: Auto-insert tapers for width transitions (default: True)
    ///     taper_length: Length of auto-inserted tapers (default: 10.0)
    #[new]
    #[pyo3(signature = (layer, width=0.5, bend_radius=5.0, auto_taper=true, taper_length=10.0))]
    fn new(
        layer: &Bound<'_, PyAny>,
        width: f64,
        bend_radius: f64,
        auto_taper: bool,
        taper_length: f64,
    ) -> PyResult<Self> {
        let layer = extract_layer(layer)?;

        if width <= 0.0 {
            return Err(pyo3::exceptions::PyValueError::new_err(
                "width must be positive",
            ));
        }
        if bend_radius <= 0.0 {
            return Err(pyo3::exceptions::PyValueError::new_err(
                "bend_radius must be positive",
            ));
        }
        if taper_length <= 0.0 {
            return Err(pyo3::exceptions::PyValueError::new_err(
                "taper_length must be positive",
            ));
        }

        let mut route = Route::new(layer)
            .with_width(width)
            .with_bend_radius(bend_radius);

        if auto_taper {
            route = route.with_auto_taper(true).with_taper_length(taper_length);
        } else {
            route = route.with_auto_taper(false);
        }

        Ok(PyRoute { route })
    }

    /// Start the route at a specific position and angle.
    ///
    /// Args:
    ///     x: X coordinate
    ///     y: Y coordinate
    ///     angle: Direction angle in degrees (0 = +X direction)
    #[pyo3(signature = (x, y, angle=0.0))]
    fn start_at(&mut self, x: f64, y: f64, angle: f64) {
        let angle_rad = angle * PI / 180.0;
        self.route.start_at(x, y, angle_rad);
    }

    /// Start the route at a port.
    ///
    /// Uses the port's position, direction, and width.
    fn start_at_port(&mut self, port: &PyPort) {
        self.route.start_at_port(&port.0);
    }

    /// Add a waypoint to the route.
    ///
    /// Args:
    ///     x: X coordinate
    ///     y: Y coordinate
    ///     width: Optional width override from this point onward
    ///     bend_radius: Optional bend radius override at this corner
    #[pyo3(signature = (x, y, width=None, bend_radius=None))]
    fn to(&mut self, x: f64, y: f64, width: Option<f64>, bend_radius: Option<f64>) {
        self.route.to_full(x, y, width, bend_radius);
    }

    /// End the route at a specific position and angle.
    ///
    /// Args:
    ///     x: X coordinate
    ///     y: Y coordinate
    ///     angle: Direction angle in degrees (0 = +X direction)
    #[pyo3(signature = (x, y, angle=0.0))]
    fn end_at(&mut self, x: f64, y: f64, angle: f64) {
        let angle_rad = angle * PI / 180.0;
        self.route.end_at(x, y, angle_rad);
    }

    /// End the route at a port.
    fn end_at_port(&mut self, port: &PyPort) {
        self.route.end_at_port(&port.0);
    }

    /// Convert the route to a Cell.
    ///
    /// Args:
    ///     name: Name for the cell
    ///
    /// Returns:
    ///     Cell containing the route geometry
    fn to_cell(&self, name: &str) -> PyCell {
        PyCell(self.route.to_cell(name))
    }

    /// Get the total optical path length.
    #[getter]
    fn path_length(&self) -> f64 {
        self.route.path_length()
    }

    /// Get warnings from route generation.
    #[getter]
    fn warnings(&self) -> Vec<String> {
        self.route.warnings()
    }

    /// Create a route through a series of waypoints.
    ///
    /// Args:
    ///     *waypoints: Sequence of waypoints. Each can be:
    ///         - Port: uses position, angle, and width
    ///         - Point: uses position only
    ///         - (x, y) tuple: position only
    ///     layer: The layer for the route
    ///     width: Default waveguide width (default: 0.5)
    ///     bend_radius: Default bend radius (default: 5.0)
    ///
    /// Returns:
    ///     Route object
    ///
    /// Example:
    ///     route = Route.through(port_a, (50, 0), (50, 30), port_b, layer=Layer(1, 0))
    #[staticmethod]
    #[pyo3(signature = (*waypoints, layer, width=0.5, bend_radius=5.0))]
    fn through(
        waypoints: &Bound<'_, PyTuple>,
        layer: &Bound<'_, PyAny>,
        width: f64,
        bend_radius: f64,
    ) -> PyResult<PyRoute> {
        let layer_val = extract_layer(layer)?;

        if width <= 0.0 {
            return Err(pyo3::exceptions::PyValueError::new_err(
                "width must be positive",
            ));
        }
        if bend_radius <= 0.0 {
            return Err(pyo3::exceptions::PyValueError::new_err(
                "bend_radius must be positive",
            ));
        }

        let mut route = Route::new(layer_val)
            .with_width(width)
            .with_bend_radius(bend_radius);

        let items: Vec<Bound<'_, PyAny>> = waypoints.iter().collect();

        if items.is_empty() {
            return Err(pyo3::exceptions::PyValueError::new_err(
                "Route.through() requires at least 2 waypoints",
            ));
        }

        for (i, item) in items.iter().enumerate() {
            let is_first = i == 0;
            let is_last = i == items.len() - 1;

            // Try to extract as Port
            if let Ok(port) = item.extract::<PyPort>() {
                if is_first {
                    route.start_at_port(&port.0);
                } else if is_last {
                    route.end_at_port(&port.0);
                } else {
                    // Intermediate port - just use position as waypoint
                    route.to(port.0.position.x, port.0.position.y);
                }
                continue;
            }

            // Try to extract as Point
            if let Ok(point) = item.extract::<PyPoint>() {
                if is_first {
                    // First point without angle - use 0
                    route.start_at(point.0.x, point.0.y, 0.0);
                } else if is_last {
                    // Last point without angle - use the incoming direction
                    route.end_at(point.0.x, point.0.y, 0.0);
                } else {
                    route.to(point.0.x, point.0.y);
                }
                continue;
            }

            // Try to extract as tuple
            if let Ok(tuple) = item.extract::<Bound<'_, PyTuple>>() {
                let len = tuple.len();
                if len >= 2 {
                    let x: f64 = tuple.get_item(0)?.extract()?;
                    let y: f64 = tuple.get_item(1)?.extract()?;

                    if is_first {
                        let angle = if len >= 3 {
                            let a: f64 = tuple.get_item(2)?.extract()?;
                            a * PI / 180.0
                        } else {
                            0.0
                        };
                        route.start_at(x, y, angle);
                    } else if is_last {
                        let angle = if len >= 3 {
                            let a: f64 = tuple.get_item(2)?.extract()?;
                            a * PI / 180.0
                        } else {
                            0.0
                        };
                        route.end_at(x, y, angle);
                    } else {
                        route.to(x, y);
                    }
                    continue;
                }
            }

            // Try to extract as list [x, y] or [x, y, angle]
            if let Ok(list) = item.extract::<Bound<'_, PyList>>() {
                let len = list.len();
                if len >= 2 {
                    let x: f64 = list.get_item(0)?.extract()?;
                    let y: f64 = list.get_item(1)?.extract()?;

                    if is_first {
                        let angle = if len >= 3 {
                            let a: f64 = list.get_item(2)?.extract()?;
                            a * PI / 180.0
                        } else {
                            0.0
                        };
                        route.start_at(x, y, angle);
                    } else if is_last {
                        let angle = if len >= 3 {
                            let a: f64 = list.get_item(2)?.extract()?;
                            a * PI / 180.0
                        } else {
                            0.0
                        };
                        route.end_at(x, y, angle);
                    } else {
                        route.to(x, y);
                    }
                    continue;
                }
            }

            return Err(pyo3::exceptions::PyTypeError::new_err(format!(
                "Waypoint {} must be a Port, Point, (x, y) tuple, or [x, y] list",
                i
            )));
        }

        Ok(PyRoute { route })
    }

    fn __repr__(&self) -> String {
        format!("Route(path_length={:.3})", self.route.path_length())
    }
}
