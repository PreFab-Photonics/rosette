//! DFM prediction models.
//!
//! Defines the [`DfmModel`] trait and built-in implementations.
//! Start with [`GaussianModel`] for simple proximity effect simulation;
//! future models will integrate PreFab for foundry-calibrated predictions.

use crate::rasterize::LayerRaster;

/// A fabrication prediction model that operates on rasterized geometry.
///
/// Models take a binary input raster (designed geometry) and produce
/// a predicted raster (what will actually be fabricated).
pub trait DfmModel: Send + Sync {
    /// Apply the prediction model to an input raster.
    fn predict(&self, input: &LayerRaster) -> LayerRaster;

    /// Human-readable model name.
    fn name(&self) -> &str;
}

/// Gaussian blur model for proximity effect simulation.
///
/// Applies a 2D Gaussian blur to the rasterized geometry to simulate
/// optical proximity effects during lithography. The blurred result is
/// then thresholded to produce a binary predicted geometry.
///
/// This is a simplified model suitable for quick iteration.
/// For foundry-calibrated predictions, use PreFab models (coming soon).
#[derive(Debug, Clone)]
pub struct GaussianModel {
    /// Gaussian sigma in pixels.
    pub sigma_px: f64,
    /// Threshold for binarization after blur (0.0 - 1.0).
    pub threshold: f64,
}

impl GaussianModel {
    /// Create a new Gaussian model.
    ///
    /// # Arguments
    ///
    /// * `sigma_px` - Gaussian sigma in pixels
    /// * `threshold` - Binarization threshold (default 0.5)
    pub fn new(sigma_px: f64, threshold: f64) -> Self {
        Self {
            sigma_px,
            threshold,
        }
    }

    /// Create from design-unit sigma and resolution.
    ///
    /// Converts sigma from design units to pixels.
    pub fn from_design_units(sigma: f64, resolution: f64, threshold: f64) -> Self {
        Self {
            sigma_px: sigma / resolution,
            threshold,
        }
    }
}

impl DfmModel for GaussianModel {
    fn predict(&self, input: &LayerRaster) -> LayerRaster {
        if self.sigma_px < 0.01 {
            // No blur needed — sigma is essentially zero
            return input.clone();
        }

        let width = input.width;
        let height = input.height;

        // Build 1D Gaussian kernel
        let radius = (self.sigma_px * 3.0).ceil() as usize;
        let kernel_size = 2 * radius + 1;
        let mut kernel = vec![0.0f64; kernel_size];
        let mut sum = 0.0;
        for (i, k) in kernel.iter_mut().enumerate() {
            let x = i as f64 - radius as f64;
            let val = (-x * x / (2.0 * self.sigma_px * self.sigma_px)).exp();
            *k = val;
            sum += val;
        }
        // Normalize
        for v in &mut kernel {
            *v /= sum;
        }

        // Separable 2D Gaussian: horizontal pass, then vertical pass
        let mut temp = vec![0.0f64; width * height];

        // Horizontal pass
        for row in 0..height {
            for col in 0..width {
                let mut acc = 0.0;
                for (k, &kv) in kernel.iter().enumerate() {
                    let src_col = col as isize + k as isize - radius as isize;
                    let src_col = src_col.clamp(0, width as isize - 1) as usize;
                    acc += input.grid[row * width + src_col] * kv;
                }
                temp[row * width + col] = acc;
            }
        }

        // Vertical pass
        let mut blurred = vec![0.0f64; width * height];
        for row in 0..height {
            for col in 0..width {
                let mut acc = 0.0;
                for (k, &kv) in kernel.iter().enumerate() {
                    let src_row = row as isize + k as isize - radius as isize;
                    let src_row = src_row.clamp(0, height as isize - 1) as usize;
                    acc += temp[src_row * width + col] * kv;
                }
                blurred[row * width + col] = acc;
            }
        }

        // Threshold to produce binary output
        let thresholded: Vec<f64> = blurred
            .iter()
            .map(|&v| if v >= self.threshold { 1.0 } else { 0.0 })
            .collect();

        LayerRaster {
            grid: thresholded,
            width,
            height,
            origin: input.origin,
            resolution: input.resolution,
        }
    }

    fn name(&self) -> &str {
        "gaussian"
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::Point;

    fn make_test_raster(width: usize, height: usize) -> LayerRaster {
        LayerRaster {
            grid: vec![0.0; width * height],
            width,
            height,
            origin: Point::new(0.0, 0.0),
            resolution: 1.0,
        }
    }

    #[test]
    fn test_zero_sigma_returns_clone() {
        let mut raster = make_test_raster(10, 10);
        raster.set(5, 5, 1.0);

        let model = GaussianModel::new(0.0, 0.5);
        let result = model.predict(&raster);

        assert!((result.get(5, 5) - 1.0).abs() < 1e-10);
        assert!((result.get(0, 0) - 0.0).abs() < 1e-10);
    }

    #[test]
    fn test_gaussian_blur_spreads() {
        // Create a raster with a single filled pixel
        let mut raster = make_test_raster(20, 20);
        // Fill a block so the blur has enough material to spread
        for r in 8..12 {
            for c in 8..12 {
                raster.set(c, r, 1.0);
            }
        }

        let model = GaussianModel::new(2.0, 0.3);
        let result = model.predict(&raster);

        // Center should still be filled
        assert!(result.get(10, 10) > 0.5);

        // Some spreading should occur — nearby pixels that were empty
        // should now potentially be filled (depending on threshold)
        let filled_input = raster.filled_count();
        let filled_output = result.filled_count();
        // With low threshold and spreading, output should have >= input filled
        assert!(filled_output >= filled_input);
    }

    #[test]
    fn test_gaussian_blur_erodes_small_features() {
        // A single pixel should be eroded away by gaussian blur at high threshold
        let mut raster = make_test_raster(20, 20);
        raster.set(10, 10, 1.0);

        let model = GaussianModel::new(3.0, 0.5);
        let result = model.predict(&raster);

        // Single pixel should be blurred below threshold
        assert!(result.get(10, 10) < 0.5 || result.filled_count() < 5);
    }

    #[test]
    fn test_from_design_units() {
        let model = GaussianModel::from_design_units(0.05, 0.01, 0.5);
        assert!((model.sigma_px - 5.0).abs() < 1e-10);
        assert!((model.threshold - 0.5).abs() < 1e-10);
    }
}
