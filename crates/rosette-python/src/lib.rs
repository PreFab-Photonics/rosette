//! Python bindings for rosette.
//!
//! Provides a Pythonic API for creating photonic layouts.
//!
//! Note: Photonic components (waveguides, bends, MMIs, etc.) are now
//! implemented in Python as user-customizable code. See `rosette.components`.

use pyo3::prelude::*;

mod connectivity;
mod dfm;
mod drc;
mod geometry;
mod io;
mod layout;
mod route;

use connectivity::{
    PyConnViolation, PyConnectivityConfig, PyConnectivityResult, py_run_connectivity,
};
use dfm::{
    PyDfmConfig, PyDfmResult, PyDfmViolation, PyGaussianModel, PyLayerMetrics, PyLayerPrediction,
    py_run_dfm,
};
use drc::{PyDrcResult, PyDrcRules, PyDrcViolation, py_run_drc};
use geometry::{
    PyBBox, PyPoint, PyPolygon, PyPolygonIterator, PyTransform, PyVector2, py_arc_points,
    py_fresnel_c, py_fresnel_s, py_offset_polygon, py_offset_polygon_varying, py_path_length,
};
use layout::{PyCell, PyCellRef, PyLayer, PyLibrary, PyPathEndType, PyPort, py_connect_transform};
use rosette_core::Layer;
use route::PyRoute;

/// Extract a Layer from either an int, Layer object, or (int, int) tuple.
///
/// This is used by multiple modules to accept flexible layer specifications.
pub(crate) fn extract_layer(obj: &Bound<'_, PyAny>) -> PyResult<Layer> {
    // Try to extract as PyLayer first
    if let Ok(layer) = obj.extract::<PyLayer>() {
        return Ok(layer.0);
    }

    // Try to extract as int
    if let Ok(num) = obj.extract::<u16>() {
        return Ok(Layer::from_number(num));
    }

    // Try to extract as tuple (layer, datatype)
    if let Ok((num, datatype)) = obj.extract::<(u16, u16)>() {
        return Ok(Layer::new(num, datatype));
    }

    Err(pyo3::exceptions::PyTypeError::new_err(
        "layer must be a Layer, int, or (int, int) tuple",
    ))
}

/// Rosette - Photonic layout library (internal module)
#[pymodule]
fn _core(m: &Bound<'_, PyModule>) -> PyResult<()> {
    // Geometry types
    m.add_class::<PyPoint>()?;
    m.add_class::<PyVector2>()?;
    m.add_class::<PyPolygon>()?;
    m.add_class::<PyTransform>()?;
    m.add_class::<PyBBox>()?;

    // Layout types
    m.add_class::<PyLayer>()?;
    m.add_class::<PyPort>()?;
    m.add_class::<PyCell>()?;
    m.add_class::<PyCellRef>()?;
    m.add_class::<PyLibrary>()?;
    m.add_class::<PyPathEndType>()?;

    // Route (core routing infrastructure, not a component)
    m.add_class::<PyRoute>()?;

    // Iterators
    m.add_class::<PyPolygonIterator>()?;

    // Connectivity types
    m.add_class::<PyConnectivityConfig>()?;
    m.add_class::<PyConnectivityResult>()?;
    m.add_class::<PyConnViolation>()?;
    m.add_function(wrap_pyfunction!(py_run_connectivity, m)?)?;

    // DRC types
    m.add_class::<PyDrcRules>()?;
    m.add_class::<PyDrcResult>()?;
    m.add_class::<PyDrcViolation>()?;
    m.add_function(wrap_pyfunction!(py_run_drc, m)?)?;

    // DFM types
    m.add_class::<PyDfmConfig>()?;
    m.add_class::<PyDfmResult>()?;
    m.add_class::<PyDfmViolation>()?;
    m.add_class::<PyLayerPrediction>()?;
    m.add_class::<PyLayerMetrics>()?;
    m.add_class::<PyGaussianModel>()?;
    m.add_function(wrap_pyfunction!(py_run_dfm, m)?)?;

    // I/O functions
    m.add_function(wrap_pyfunction!(io::read_gds, m)?)?;
    m.add_function(wrap_pyfunction!(io::write_gds, m)?)?;
    m.add_function(wrap_pyfunction!(io::to_json, m)?)?;

    // Connection helpers
    m.add_function(wrap_pyfunction!(py_connect_transform, m)?)?;

    // Geometry utility functions
    m.add_function(wrap_pyfunction!(py_arc_points, m)?)?;
    m.add_function(wrap_pyfunction!(py_offset_polygon, m)?)?;
    m.add_function(wrap_pyfunction!(py_offset_polygon_varying, m)?)?;
    m.add_function(wrap_pyfunction!(py_path_length, m)?)?;
    m.add_function(wrap_pyfunction!(py_fresnel_c, m)?)?;
    m.add_function(wrap_pyfunction!(py_fresnel_s, m)?)?;

    Ok(())
}
