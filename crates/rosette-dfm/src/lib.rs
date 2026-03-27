//! DFM (Design for Manufacturability) prediction for photonic layouts.
//!
//! This crate provides virtual nanofabrication prediction by:
//! 1. Rasterizing vector geometry onto a pixel grid
//! 2. Applying a fabrication prediction model
//! 3. Vectorizing the predicted raster back to polygons
//! 4. Comparing designed vs predicted geometry with quantitative metrics
//!
//! # Models
//!
//! - [`GaussianModel`]: Simple Gaussian blur for proximity effect simulation
//! - Future: PreFab models for foundry-calibrated predictions
//!
//! # Example
//!
//! ```
//! use rosette_core::{Cell, Layer, Point, Polygon};
//! use rosette_dfm::{DfmConfig, GaussianModel, run_dfm};
//!
//! let mut cell = Cell::new("test");
//! cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 2.0), Layer::new(1, 0));
//!
//! let model = GaussianModel::from_design_units(0.08, 0.01, 0.5);
//! let config = DfmConfig::default();
//! let layers = vec![Layer::new(1, 0)];
//!
//! let result = run_dfm(&cell, None, &layers, &model, &config);
//! println!("Predicted {} polygons", result.total_predicted_polygons());
//! for lp in &result.layers {
//!     if let Some(m) = &lp.metrics {
//!         println!("  edge deviation: {:.3} um", m.max_edge_deviation);
//!     }
//! }
//! ```

mod compare;
mod contour;
pub mod model;
pub mod rasterize;
mod result;

pub use compare::{DfmTolerances, DfmViolation, DfmViolationType, LayerMetrics, Severity};
pub use contour::extract_contours;
pub use model::{DfmModel, GaussianModel};
pub use rasterize::{LayerRaster, RasterConfig};
pub use result::{DfmResult, DfmStats, LayerPrediction};

use std::collections::HashMap;
use std::time::Instant;

use rosette_core::{Cell, Layer, Library, Transform};

/// Top-level configuration for DFM prediction.
#[derive(Debug, Clone)]
pub struct DfmConfig {
    /// Rasterization configuration.
    pub raster: RasterConfig,
    /// Threshold for contour extraction (0.0 - 1.0).
    pub contour_threshold: f64,
    /// Whether to retain the raster data in results.
    pub keep_raster: bool,
    /// Optional tolerances for pass/fail checking (global default).
    pub tolerances: Option<DfmTolerances>,
    /// Default model sigma in design units (used as fallback for per-layer overrides).
    pub default_sigma: f64,
    /// Default model threshold (used as fallback for per-layer overrides).
    pub default_threshold: f64,
    /// Per-layer overrides. Values here take precedence over the global config.
    pub layer_configs: HashMap<Layer, LayerDfmConfig>,
}

impl Default for DfmConfig {
    fn default() -> Self {
        Self {
            raster: RasterConfig::default(),
            contour_threshold: 0.5,
            keep_raster: false,
            tolerances: None,
            default_sigma: 0.08,
            default_threshold: 0.5,
            layer_configs: HashMap::new(),
        }
    }
}

/// Per-layer DFM configuration overrides.
///
/// Any field set to `Some` overrides the corresponding global config value.
/// Fields left as `None` fall back to the global default.
#[derive(Debug, Clone, Default)]
pub struct LayerDfmConfig {
    /// Override Gaussian sigma in design units for this layer.
    pub sigma: Option<f64>,
    /// Override binarization threshold for this layer.
    pub threshold: Option<f64>,
    /// Override area deviation tolerance for this layer.
    pub max_area_deviation: Option<f64>,
    /// Override severity for this layer.
    pub severity: Option<Severity>,
}

/// Run DFM prediction on a cell.
///
/// Rasterizes each specified layer, applies the prediction model,
/// extracts contour polygons, and computes comparison metrics.
///
/// Per-layer overrides in `config.layer_configs` take precedence over
/// the global model and tolerance settings.
///
/// # Arguments
///
/// * `cell` - The cell to predict
/// * `library` - Optional library containing referenced cells
/// * `layers` - Layers to process
/// * `model` - The default prediction model to apply
/// * `config` - Prediction configuration (with optional per-layer overrides)
pub fn run_dfm(
    cell: &Cell,
    library: Option<&Library>,
    layers: &[Layer],
    model: &dyn DfmModel,
    config: &DfmConfig,
) -> DfmResult {
    let start = Instant::now();

    // Flatten cell once and reuse for all layers
    let polygons_by_layer = rasterize::flatten_cell(cell, library, &Transform::identity());

    let mut layer_results = Vec::new();
    let mut total_pixels = 0;

    for &layer in layers {
        let polygons = match polygons_by_layer.get(&layer) {
            Some(polys) if !polys.is_empty() => polys,
            _ => {
                // No geometry on this layer — skip
                layer_results.push(LayerPrediction {
                    layer,
                    predicted_polygons: Vec::new(),
                    input_polygon_count: 0,
                    raster: None,
                    metrics: None,
                    violations: Vec::new(),
                });
                continue;
            }
        };

        let input_polygon_count = polygons.len();

        // Check for per-layer overrides
        let layer_cfg = config.layer_configs.get(&layer);

        // Compute bounding box
        let mut bbox = polygons[0].bbox();
        for poly in &polygons[1..] {
            bbox = bbox.merge(&poly.bbox());
        }

        // Rasterize
        let mut designed_raster = rasterize::LayerRaster::from_bbox(&bbox, &config.raster);
        rasterize::rasterize_polygons(&mut designed_raster, polygons);
        total_pixels += designed_raster.pixel_count();

        // Build per-layer model if overrides exist, otherwise use the global model
        let layer_model: Option<GaussianModel>;
        let effective_model: &dyn DfmModel = if let Some(lcfg) = layer_cfg
            && (lcfg.sigma.is_some() || lcfg.threshold.is_some())
        {
            // Create a layer-specific Gaussian model with overrides
            let sigma = lcfg.sigma.unwrap_or(config.default_sigma);
            let threshold = lcfg.threshold.unwrap_or(config.default_threshold);
            layer_model = Some(GaussianModel::from_design_units(
                sigma,
                config.raster.resolution,
                threshold,
            ));
            layer_model.as_ref().unwrap()
        } else {
            model
        };

        // Predict
        let predicted_raster = effective_model.predict(&designed_raster);

        // Extract contours
        let predicted_polygons = extract_contours(&predicted_raster, config.contour_threshold);

        // Build per-layer tolerances (override or global)
        let effective_tolerances = if let Some(lcfg) = layer_cfg
            && (lcfg.max_area_deviation.is_some() || lcfg.severity.is_some())
        {
            // Layer has tolerance overrides
            let global_tol = config.tolerances.as_ref();
            Some(DfmTolerances {
                max_area_deviation: lcfg
                    .max_area_deviation
                    .or(global_tol.and_then(|t| t.max_area_deviation)),
                severity: lcfg
                    .severity
                    .unwrap_or(global_tol.map_or(Severity::Error, |t| t.severity)),
            })
        } else {
            config.tolerances.clone()
        };

        // Compare designed vs predicted
        let (metrics, violations) = compare::compare_layer(
            &designed_raster,
            &predicted_raster,
            layer,
            effective_tolerances.as_ref(),
        );

        layer_results.push(LayerPrediction {
            layer,
            predicted_polygons,
            input_polygon_count,
            raster: if config.keep_raster {
                Some(predicted_raster)
            } else {
                None
            },
            metrics: Some(metrics),
            violations,
        });
    }

    DfmResult {
        layers: layer_results,
        stats: DfmStats {
            layers_processed: layers.len(),
            total_pixels,
            resolution: config.raster.resolution,
            elapsed: start.elapsed(),
        },
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::{Cell, Layer, Point, Polygon};

    #[test]
    fn test_run_dfm_simple() {
        let mut cell = Cell::new("test");
        let layer = Layer::new(1, 0);
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0), layer);

        let model = GaussianModel::new(0.0, 0.5); // No blur — passthrough
        let config = DfmConfig {
            raster: RasterConfig {
                resolution: 0.5,
                padding: 1.0,
            },
            contour_threshold: 0.5,
            keep_raster: false,
            tolerances: None,
            ..Default::default()
        };

        let result = run_dfm(&cell, None, &[layer], &model, &config);

        assert_eq!(result.layers.len(), 1);
        assert_eq!(result.layers[0].input_polygon_count, 1);
        assert_eq!(result.stats.layers_processed, 1);
        assert!(result.stats.total_pixels > 0);
        assert!(
            !result.layers[0].predicted_polygons.is_empty(),
            "Should produce predicted polygons"
        );
        // Metrics should be computed
        assert!(result.layers[0].metrics.is_some());
        // No blur = zero deviation
        let metrics = result.layers[0].metrics.as_ref().unwrap();
        assert!(metrics.max_edge_deviation < 0.01);
        assert!(metrics.area_deviation.abs() < 0.01);
        // No tolerances = passed
        assert!(result.passed());
    }

    #[test]
    fn test_run_dfm_empty_layer() {
        let cell = Cell::new("empty");
        let model = GaussianModel::new(1.0, 0.5);
        let config = DfmConfig::default();

        let result = run_dfm(&cell, None, &[Layer::new(1, 0)], &model, &config);

        assert_eq!(result.layers.len(), 1);
        assert_eq!(result.layers[0].input_polygon_count, 0);
        assert!(result.layers[0].predicted_polygons.is_empty());
        assert!(result.layers[0].metrics.is_none());
        assert!(result.passed());
    }

    #[test]
    fn test_run_dfm_keep_raster() {
        let mut cell = Cell::new("test");
        let layer = Layer::new(1, 0);
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0), layer);

        let model = GaussianModel::new(1.0, 0.5);
        let config = DfmConfig {
            raster: RasterConfig {
                resolution: 0.5,
                padding: 1.0,
            },
            contour_threshold: 0.5,
            keep_raster: true,
            tolerances: None,
            ..Default::default()
        };

        let result = run_dfm(&cell, None, &[layer], &model, &config);

        assert!(result.layers[0].raster.is_some());
        let raster = result.layers[0].raster.as_ref().unwrap();
        assert!(raster.pixel_count() > 0);
    }

    #[test]
    fn test_run_dfm_with_blur() {
        let mut cell = Cell::new("test");
        let layer = Layer::new(1, 0);
        // A narrow waveguide — blur should affect its shape
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 20.0, 0.5), layer);

        let model = GaussianModel::new(2.0, 0.5);
        let config = DfmConfig {
            raster: RasterConfig {
                resolution: 0.1,
                padding: 2.0,
            },
            contour_threshold: 0.5,
            keep_raster: false,
            tolerances: None,
            ..Default::default()
        };

        let result = run_dfm(&cell, None, &[layer], &model, &config);
        assert_eq!(result.layers.len(), 1);
        // Metrics should show some deviation from the blur
        let metrics = result.layers[0].metrics.as_ref().unwrap();
        assert!(metrics.max_edge_deviation > 0.0 || metrics.area_deviation.abs() > 0.0);
    }

    #[test]
    fn test_run_dfm_multiple_layers() {
        let mut cell = Cell::new("test");
        let l1 = Layer::new(1, 0);
        let l2 = Layer::new(2, 0);
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0), l1);
        cell.add_polygon(Polygon::rect(Point::new(10.0, 0.0), 5.0, 5.0), l2);

        let model = GaussianModel::new(0.0, 0.5);
        let config = DfmConfig {
            raster: RasterConfig {
                resolution: 0.5,
                padding: 1.0,
            },
            contour_threshold: 0.5,
            keep_raster: false,
            tolerances: None,
            ..Default::default()
        };

        let result = run_dfm(&cell, None, &[l1, l2], &model, &config);
        assert_eq!(result.layers.len(), 2);
        assert_eq!(result.layers[0].layer, l1);
        assert_eq!(result.layers[1].layer, l2);
        // Both should have metrics
        assert!(result.layers[0].metrics.is_some());
        assert!(result.layers[1].metrics.is_some());
    }

    #[test]
    fn test_run_dfm_with_tolerances_pass() {
        let mut cell = Cell::new("test");
        let layer = Layer::new(1, 0);
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0), layer);

        let model = GaussianModel::new(0.0, 0.5); // No blur
        let config = DfmConfig {
            raster: RasterConfig {
                resolution: 0.5,
                padding: 1.0,
            },
            contour_threshold: 0.5,
            keep_raster: false,
            tolerances: Some(DfmTolerances {
                max_area_deviation: Some(0.05),
                severity: Severity::Error,
            }),
            ..Default::default()
        };

        let result = run_dfm(&cell, None, &[layer], &model, &config);
        assert!(result.passed());
        assert!(result.violations().is_empty());
    }

    #[test]
    fn test_run_dfm_with_tolerances_fail() {
        let mut cell = Cell::new("test");
        let layer = Layer::new(1, 0);
        // Narrow feature that blur will heavily affect
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 20.0, 0.3), layer);

        let model = GaussianModel::new(3.0, 0.5); // Strong blur
        let config = DfmConfig {
            raster: RasterConfig {
                resolution: 0.1,
                padding: 2.0,
            },
            contour_threshold: 0.5,
            keep_raster: false,
            tolerances: Some(DfmTolerances {
                max_area_deviation: Some(0.01), // Very tight
                severity: Severity::Error,
            }),
            ..Default::default()
        };

        let result = run_dfm(&cell, None, &[layer], &model, &config);
        // Strong blur on narrow feature with tight tolerances should fail
        assert!(!result.passed());
        assert!(!result.violations().is_empty());
    }

    #[test]
    fn test_run_dfm_warnings_still_pass() {
        let mut cell = Cell::new("test");
        let layer = Layer::new(1, 0);
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 20.0, 0.3), layer);

        let model = GaussianModel::new(3.0, 0.5);
        let config = DfmConfig {
            raster: RasterConfig {
                resolution: 0.1,
                padding: 2.0,
            },
            contour_threshold: 0.5,
            keep_raster: false,
            tolerances: Some(DfmTolerances {
                max_area_deviation: Some(0.01),
                severity: Severity::Warning, // Warnings, not errors
            }),
            ..Default::default()
        };

        let result = run_dfm(&cell, None, &[layer], &model, &config);
        // Warnings don't cause failure
        assert!(result.passed());
        // But violations are still reported
        assert!(!result.violations().is_empty());
    }

    #[test]
    fn test_run_dfm_per_layer_config() {
        let mut cell = Cell::new("test");
        let l1 = Layer::new(1, 0);
        let l2 = Layer::new(2, 0);
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0), l1);
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0), l2);

        let model = GaussianModel::new(0.0, 0.5); // Global: no blur

        let mut layer_configs = HashMap::new();
        // Layer 2 gets a strong blur override
        layer_configs.insert(
            l2,
            LayerDfmConfig {
                sigma: Some(2.0),
                threshold: None,
                max_area_deviation: None,
                severity: None,
            },
        );

        let config = DfmConfig {
            raster: RasterConfig {
                resolution: 0.5,
                padding: 1.0,
            },
            contour_threshold: 0.5,
            keep_raster: false,
            tolerances: None,
            layer_configs,
            ..Default::default()
        };

        let result = run_dfm(&cell, None, &[l1, l2], &model, &config);
        assert_eq!(result.layers.len(), 2);

        // L1: no blur, minimal deviation
        let m1 = result.layers[0].metrics.as_ref().unwrap();
        assert!(m1.area_deviation.abs() < 0.05);

        // L2: strong blur, significant deviation
        let m2 = result.layers[1].metrics.as_ref().unwrap();
        assert!(m2.area_deviation.abs() > m1.area_deviation.abs());
    }

    #[test]
    fn test_run_dfm_per_layer_tolerance() {
        let mut cell = Cell::new("test");
        let l1 = Layer::new(1, 0);
        let l2 = Layer::new(2, 0);
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.3), l1);
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.3), l2);

        let model = GaussianModel::new(3.0, 0.5); // Strong blur

        let mut layer_configs = HashMap::new();
        // Layer 2 gets a loose tolerance — should pass
        layer_configs.insert(
            l2,
            LayerDfmConfig {
                sigma: None,
                threshold: None,
                max_area_deviation: Some(1.0), // 100% — anything passes
                severity: None,
            },
        );

        let config = DfmConfig {
            raster: RasterConfig {
                resolution: 0.1,
                padding: 2.0,
            },
            contour_threshold: 0.5,
            keep_raster: false,
            tolerances: Some(DfmTolerances {
                max_area_deviation: Some(0.01), // Global: very tight
                severity: Severity::Error,
            }),
            layer_configs,
            ..Default::default()
        };

        let result = run_dfm(&cell, None, &[l1, l2], &model, &config);

        // L1: uses global tight tolerance — should fail
        assert!(!result.layers[0].violations.is_empty());

        // L2: uses per-layer loose tolerance — should pass
        assert!(result.layers[1].violations.is_empty());
    }
}
