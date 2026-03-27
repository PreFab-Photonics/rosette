//! Python bindings for DFM (Design for Manufacturability) prediction.

use pyo3::prelude::*;

use rosette_dfm::{
    DfmConfig, DfmResult, DfmTolerances, DfmViolation, DfmViolationType, GaussianModel,
    LayerDfmConfig, LayerMetrics, LayerPrediction, RasterConfig, Severity, run_dfm,
};

use crate::extract_layer;
use crate::geometry::PyPolygon;
use crate::layout::{PyCell, PyLibrary};

/// DFM prediction configuration.
#[pyclass(name = "DfmConfig")]
#[derive(Clone)]
pub struct PyDfmConfig(pub DfmConfig);

#[pymethods]
impl PyDfmConfig {
    /// Create a new DFM config.
    ///
    /// Args:
    ///     resolution: Pixel size in design units (default 0.01)
    ///     padding: Margin around cell bounding box in design units (default 1.0)
    ///     contour_threshold: Threshold for contour extraction, 0.0-1.0 (default 0.5)
    ///     keep_raster: Whether to retain raster data in results (default False)
    ///     max_area_deviation: Max allowed relative area deviation, 0.0-1.0 (None = no check)
    ///     severity: Violation severity, "error" or "warning" (default "error")
    #[new]
    #[pyo3(signature = (
        resolution=0.01,
        padding=1.0,
        contour_threshold=0.5,
        keep_raster=false,
        max_area_deviation=None,
        severity="error",
    ))]
    fn new(
        resolution: f64,
        padding: f64,
        contour_threshold: f64,
        keep_raster: bool,
        max_area_deviation: Option<f64>,
        severity: &str,
    ) -> PyResult<Self> {
        let sev = match severity {
            "error" => Severity::Error,
            "warning" => Severity::Warning,
            other => {
                return Err(pyo3::exceptions::PyValueError::new_err(format!(
                    "severity must be 'error' or 'warning', got '{other}'"
                )));
            }
        };

        let tolerances = if max_area_deviation.is_some() {
            Some(DfmTolerances {
                max_area_deviation,
                severity: sev,
            })
        } else {
            None
        };

        Ok(PyDfmConfig(DfmConfig {
            raster: RasterConfig {
                resolution,
                padding,
            },
            contour_threshold,
            keep_raster,
            tolerances,
            default_sigma: 0.08,
            default_threshold: 0.5,
            layer_configs: std::collections::HashMap::new(),
        }))
    }

    /// Set per-layer DFM configuration overrides.
    ///
    /// Per-layer settings override the global model and tolerance for a specific layer.
    /// Any parameter set to None falls back to the global default.
    ///
    /// Args:
    ///     layer: Layer to configure (Layer, int, or (int, int) tuple)
    ///     sigma: Override Gaussian sigma in design units (None = use global)
    ///     threshold: Override binarization threshold (None = use global)
    ///     max_area_deviation: Override area deviation tolerance (None = use global)
    ///     severity: Override violation severity, "error" or "warning" (None = use global)
    #[pyo3(signature = (layer, sigma=None, threshold=None, max_area_deviation=None, severity=None))]
    fn set_layer_config(
        &mut self,
        layer: Bound<'_, PyAny>,
        sigma: Option<f64>,
        threshold: Option<f64>,
        max_area_deviation: Option<f64>,
        severity: Option<&str>,
    ) -> PyResult<()> {
        let rust_layer = extract_layer(&layer)?;

        let sev = match severity {
            Some("error") => Some(Severity::Error),
            Some("warning") => Some(Severity::Warning),
            Some(other) => {
                return Err(pyo3::exceptions::PyValueError::new_err(format!(
                    "severity must be 'error' or 'warning', got '{other}'"
                )));
            }
            None => None,
        };

        self.0.layer_configs.insert(
            rust_layer,
            LayerDfmConfig {
                sigma,
                threshold,
                max_area_deviation,
                severity: sev,
            },
        );
        Ok(())
    }

    /// Pixel size in design units.
    #[getter]
    fn resolution(&self) -> f64 {
        self.0.raster.resolution
    }

    /// Padding around cell bounding box in design units.
    #[getter]
    fn padding(&self) -> f64 {
        self.0.raster.padding
    }

    /// Threshold for contour extraction.
    #[getter]
    fn contour_threshold(&self) -> f64 {
        self.0.contour_threshold
    }

    /// Whether raster data is retained in results.
    #[getter]
    fn keep_raster(&self) -> bool {
        self.0.keep_raster
    }

    /// Max allowed relative area deviation, or None.
    #[getter]
    fn max_area_deviation(&self) -> Option<f64> {
        self.0
            .tolerances
            .as_ref()
            .and_then(|t| t.max_area_deviation)
    }

    /// Whether tolerances are configured.
    #[getter]
    fn has_tolerances(&self) -> bool {
        self.0.tolerances.is_some()
    }

    fn __repr__(&self) -> String {
        format!(
            "DfmConfig(resolution={}, padding={}, contour_threshold={}, keep_raster={})",
            self.0.raster.resolution,
            self.0.raster.padding,
            self.0.contour_threshold,
            self.0.keep_raster
        )
    }
}

/// Gaussian blur DFM model for proximity effect simulation.
#[pyclass(name = "GaussianModel")]
#[derive(Clone)]
pub struct PyGaussianModel {
    /// Sigma in design units (user-facing).
    sigma: f64,
    /// Binarization threshold.
    threshold: f64,
}

#[pymethods]
impl PyGaussianModel {
    /// Create a new Gaussian DFM model.
    ///
    /// Args:
    ///     sigma: Gaussian sigma in design units (e.g., 0.08 um)
    ///     threshold: Binarization threshold, 0.0-1.0 (default 0.5)
    #[new]
    #[pyo3(signature = (sigma, threshold=0.5))]
    fn new(sigma: f64, threshold: f64) -> Self {
        PyGaussianModel { sigma, threshold }
    }

    /// Gaussian sigma in design units.
    #[getter]
    fn sigma(&self) -> f64 {
        self.sigma
    }

    /// Binarization threshold.
    #[getter]
    fn threshold(&self) -> f64 {
        self.threshold
    }

    /// Model name.
    #[getter]
    fn name(&self) -> &str {
        "gaussian"
    }

    fn __repr__(&self) -> String {
        format!(
            "GaussianModel(sigma={}, threshold={})",
            self.sigma, self.threshold
        )
    }
}

impl PyGaussianModel {
    /// Convert to a Rust GaussianModel using the given resolution.
    pub(crate) fn to_rust_model(&self, resolution: f64) -> GaussianModel {
        GaussianModel::from_design_units(self.sigma, resolution, self.threshold)
    }
}

/// Per-layer comparison metrics.
#[pyclass(name = "LayerMetrics")]
#[derive(Clone)]
pub struct PyLayerMetrics(pub LayerMetrics);

#[pymethods]
impl PyLayerMetrics {
    /// Layer these metrics apply to.
    #[getter]
    fn layer(&self) -> (u16, u16) {
        (self.0.layer.number, self.0.layer.datatype)
    }

    /// Maximum edge deviation in design units.
    #[getter]
    fn max_edge_deviation(&self) -> f64 {
        self.0.max_edge_deviation
    }

    /// Relative area change (signed: negative = shrinkage).
    #[getter]
    fn area_deviation(&self) -> f64 {
        self.0.area_deviation
    }

    /// Designed area in design units squared.
    #[getter]
    fn designed_area(&self) -> f64 {
        self.0.designed_area
    }

    /// Predicted area in design units squared.
    #[getter]
    fn predicted_area(&self) -> f64 {
        self.0.predicted_area
    }

    fn __repr__(&self) -> String {
        format!(
            "LayerMetrics(layer=({}, {}), edge_dev={:.4}, area_dev={:.1}%)",
            self.0.layer.number,
            self.0.layer.datatype,
            self.0.max_edge_deviation,
            self.0.area_deviation * 100.0
        )
    }
}

/// A single DFM violation.
#[pyclass(name = "DfmViolation")]
#[derive(Clone)]
pub struct PyDfmViolation(pub DfmViolation);

#[pymethods]
impl PyDfmViolation {
    /// Layer where violation occurred.
    #[getter]
    fn layer(&self) -> (u16, u16) {
        (self.0.layer.number, self.0.layer.datatype)
    }

    /// Violation type: "area_deviation".
    #[getter]
    fn violation_type(&self) -> &str {
        match &self.0.violation_type {
            DfmViolationType::AreaDeviation { .. } => "area_deviation",
        }
    }

    /// Human-readable description.
    #[getter]
    fn message(&self) -> &str {
        &self.0.message
    }

    /// Severity: "error" or "warning".
    #[getter]
    fn severity(&self) -> &str {
        match self.0.severity {
            Severity::Error => "error",
            Severity::Warning => "warning",
        }
    }

    /// Bounding box of worst deviation: ((min_x, min_y), (max_x, max_y)).
    #[getter]
    fn bbox(&self) -> ((f64, f64), (f64, f64)) {
        let loc = &self.0.location;
        let min = loc.min();
        let max = loc.max();
        ((min.x, min.y), (max.x, max.y))
    }

    /// Maximum allowed value (relative for area deviation).
    #[getter]
    fn max_allowed(&self) -> f64 {
        match &self.0.violation_type {
            DfmViolationType::AreaDeviation { max_allowed, .. } => *max_allowed,
        }
    }

    /// Actual measured value.
    #[getter]
    fn actual(&self) -> f64 {
        match &self.0.violation_type {
            DfmViolationType::AreaDeviation { actual, .. } => *actual,
        }
    }

    fn __repr__(&self) -> String {
        format!(
            "DfmViolation({} on ({}, {}): {})",
            self.violation_type(),
            self.0.layer.number,
            self.0.layer.datatype,
            self.0.message,
        )
    }
}

/// Prediction result for a single layer.
#[pyclass(name = "LayerPrediction")]
#[derive(Clone)]
pub struct PyLayerPrediction(pub LayerPrediction);

#[pymethods]
impl PyLayerPrediction {
    /// The layer that was predicted.
    #[getter]
    fn layer(&self) -> (u16, u16) {
        (self.0.layer.number, self.0.layer.datatype)
    }

    /// Predicted polygons as a list of Polygon objects.
    #[getter]
    fn predicted_polygons(&self) -> Vec<PyPolygon> {
        self.0
            .predicted_polygons
            .iter()
            .cloned()
            .map(PyPolygon)
            .collect()
    }

    /// Number of input polygons on this layer.
    #[getter]
    fn input_polygon_count(&self) -> usize {
        self.0.input_polygon_count
    }

    /// Number of predicted polygons on this layer.
    #[getter]
    fn predicted_polygon_count(&self) -> usize {
        self.0.predicted_polygons.len()
    }

    /// Comparison metrics for this layer, or None if no geometry.
    #[getter]
    fn metrics(&self) -> Option<PyLayerMetrics> {
        self.0.metrics.clone().map(PyLayerMetrics)
    }

    /// Violations on this layer.
    #[getter]
    fn violations(&self) -> Vec<PyDfmViolation> {
        self.0
            .violations
            .iter()
            .cloned()
            .map(PyDfmViolation)
            .collect()
    }

    /// Whether a raster is available for this layer.
    #[getter]
    fn has_raster(&self) -> bool {
        self.0.raster.is_some()
    }

    /// Raster data as a flat list of floats (row-major order).
    ///
    /// Returns None if keep_raster was False in the config.
    /// Use raster_width and raster_height to reshape.
    #[getter]
    fn raster_data(&self) -> Option<Vec<f64>> {
        self.0.raster.as_ref().map(|r| r.grid.clone())
    }

    /// Raster width in pixels. None if no raster data.
    #[getter]
    fn raster_width(&self) -> Option<usize> {
        self.0.raster.as_ref().map(|r| r.width)
    }

    /// Raster height in pixels. None if no raster data.
    #[getter]
    fn raster_height(&self) -> Option<usize> {
        self.0.raster.as_ref().map(|r| r.height)
    }

    /// Raster origin in design units as (x, y). None if no raster data.
    #[getter]
    fn raster_origin(&self) -> Option<(f64, f64)> {
        self.0.raster.as_ref().map(|r| (r.origin.x, r.origin.y))
    }

    fn __repr__(&self) -> String {
        format!(
            "LayerPrediction(layer=({}, {}), input={}, predicted={})",
            self.0.layer.number,
            self.0.layer.datatype,
            self.0.input_polygon_count,
            self.0.predicted_polygons.len()
        )
    }
}

/// Result of running DFM prediction.
#[pyclass(name = "DfmResult")]
#[derive(Clone)]
pub struct PyDfmResult(pub DfmResult);

#[pymethods]
impl PyDfmResult {
    /// Per-layer prediction results.
    #[getter]
    fn layers(&self) -> Vec<PyLayerPrediction> {
        self.0
            .layers
            .iter()
            .cloned()
            .map(PyLayerPrediction)
            .collect()
    }

    /// Total number of predicted polygons across all layers.
    #[getter]
    fn total_predicted_polygons(&self) -> usize {
        self.0.total_predicted_polygons()
    }

    /// Total number of input polygons across all layers.
    #[getter]
    fn total_input_polygons(&self) -> usize {
        self.0.total_input_polygons()
    }

    /// Whether the DFM check passed (no error-severity violations).
    #[getter]
    fn passed(&self) -> bool {
        self.0.passed()
    }

    /// All violations across all layers.
    #[getter]
    fn violations(&self) -> Vec<PyDfmViolation> {
        self.0
            .violations()
            .into_iter()
            .cloned()
            .map(PyDfmViolation)
            .collect()
    }

    /// Number of layers processed.
    #[getter]
    fn layers_processed(&self) -> usize {
        self.0.stats.layers_processed
    }

    /// Total number of pixels across all layer rasters.
    #[getter]
    fn total_pixels(&self) -> usize {
        self.0.stats.total_pixels
    }

    /// Resolution used for rasterization (design units per pixel).
    #[getter]
    fn resolution(&self) -> f64 {
        self.0.stats.resolution
    }

    /// Elapsed time in milliseconds.
    #[getter]
    fn elapsed_ms(&self) -> f64 {
        self.0.stats.elapsed.as_secs_f64() * 1000.0
    }

    /// Number of layer predictions.
    fn __len__(&self) -> usize {
        self.0.layers.len()
    }

    fn __repr__(&self) -> String {
        let status = if self.0.passed() { "PASSED" } else { "FAILED" };
        format!(
            "DfmResult({} layers, {} input -> {} predicted polygons, {}, {:.1}ms)",
            self.0.stats.layers_processed,
            self.0.total_input_polygons(),
            self.0.total_predicted_polygons(),
            status,
            self.elapsed_ms()
        )
    }
}

/// Run DFM prediction on a cell.
///
/// Rasterizes each specified layer, applies the prediction model,
/// extracts contour polygons, and computes comparison metrics.
///
/// Args:
///     cell: The cell to predict
///     layers: List of layers to process (Layer, int, or (int, int) tuple)
///     model: The prediction model (e.g., GaussianModel)
///     config: Optional DFM configuration (defaults to DfmConfig())
///     library: Optional library containing referenced cells
///
/// Returns:
///     DfmResult with per-layer predictions, metrics, and violations
#[pyfunction]
#[pyo3(name = "run_dfm", signature = (cell, layers, model, config=None, library=None))]
pub fn py_run_dfm(
    cell: &PyCell,
    layers: Vec<Bound<'_, PyAny>>,
    model: &PyGaussianModel,
    config: Option<&PyDfmConfig>,
    library: Option<&PyLibrary>,
) -> PyResult<PyDfmResult> {
    // Extract layers
    let rust_layers: Vec<rosette_core::Layer> = layers
        .iter()
        .map(|l| extract_layer(l))
        .collect::<PyResult<Vec<_>>>()?;

    // Use provided config or default, and set global model defaults for per-layer fallback
    let mut dfm_config = config.map(|c| c.0.clone()).unwrap_or_default();
    dfm_config.default_sigma = model.sigma;
    dfm_config.default_threshold = model.threshold;

    // Build the Rust model with correct resolution
    let rust_model = model.to_rust_model(dfm_config.raster.resolution);

    let lib_ref = library.map(|l| &l.0);
    let result = run_dfm(&cell.0, lib_ref, &rust_layers, &rust_model, &dfm_config);

    Ok(PyDfmResult(result))
}
