//! DFM prediction results.

use std::time::Duration;

use rosette_core::{Layer, Polygon};

use crate::compare::{DfmViolation, LayerMetrics, Severity};
use crate::rasterize::LayerRaster;

/// Prediction result for a single layer.
#[derive(Debug, Clone)]
pub struct LayerPrediction {
    /// The layer that was predicted.
    pub layer: Layer,
    /// Predicted polygons (vectorized from the predicted raster).
    pub predicted_polygons: Vec<Polygon>,
    /// Number of input polygons on this layer.
    pub input_polygon_count: usize,
    /// The predicted raster (retained if `keep_raster` was set).
    pub raster: Option<LayerRaster>,
    /// Comparison metrics (always computed when there's geometry).
    pub metrics: Option<LayerMetrics>,
    /// Violations from tolerance checks.
    pub violations: Vec<DfmViolation>,
}

/// Statistics from a DFM prediction run.
#[derive(Debug, Clone)]
pub struct DfmStats {
    /// Number of layers processed.
    pub layers_processed: usize,
    /// Total number of pixels across all layer rasters.
    pub total_pixels: usize,
    /// Resolution used for rasterization (design units per pixel).
    pub resolution: f64,
    /// Total elapsed time.
    pub elapsed: Duration,
}

/// Result of running DFM prediction.
#[derive(Debug, Clone)]
pub struct DfmResult {
    /// Per-layer prediction results.
    pub layers: Vec<LayerPrediction>,
    /// Prediction statistics.
    pub stats: DfmStats,
}

impl DfmResult {
    /// Total number of predicted polygons across all layers.
    pub fn total_predicted_polygons(&self) -> usize {
        self.layers.iter().map(|l| l.predicted_polygons.len()).sum()
    }

    /// Total number of input polygons across all layers.
    pub fn total_input_polygons(&self) -> usize {
        self.layers.iter().map(|l| l.input_polygon_count).sum()
    }

    /// All violations across all layers.
    pub fn violations(&self) -> Vec<&DfmViolation> {
        self.layers.iter().flat_map(|l| &l.violations).collect()
    }

    /// Whether the DFM check passed (no error-severity violations).
    ///
    /// Returns true if there are no violations, or if all violations are warnings.
    /// Also returns true when no tolerances were configured (informational mode).
    pub fn passed(&self) -> bool {
        !self
            .layers
            .iter()
            .flat_map(|l| &l.violations)
            .any(|v| v.severity == Severity::Error)
    }
}
