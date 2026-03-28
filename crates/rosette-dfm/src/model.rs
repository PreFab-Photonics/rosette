//! DFM prediction models.
//!
//! Defines the [`DfmModel`] trait and built-in implementations.
//! Start with [`GaussianModel`] for simple proximity effect simulation;
//! future models will integrate PreFab for foundry-calibrated predictions.

use rayon::prelude::*;

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
/// optical proximity effects during lithography. The blurred result
/// contains continuous values in `[0.0, 1.0]` representing fabrication
/// probability at each pixel. Binarization is deferred to contour
/// extraction, where the user-configured threshold is applied.
///
/// This is a simplified model suitable for quick iteration.
/// For foundry-calibrated predictions, use PreFab models (coming soon).
#[derive(Debug, Clone)]
pub struct GaussianModel {
    /// Gaussian sigma in pixels.
    pub sigma_px: f64,
}

impl GaussianModel {
    /// Create a new Gaussian model.
    ///
    /// # Arguments
    ///
    /// * `sigma_px` - Gaussian sigma in pixels
    pub fn new(sigma_px: f64) -> Self {
        Self { sigma_px }
    }

    /// Create from design-unit sigma and resolution.
    ///
    /// Converts sigma from design units to pixels.
    pub fn from_design_units(sigma: f64, resolution: f64) -> Self {
        Self {
            sigma_px: sigma / resolution,
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

        // Separable 2D Gaussian: horizontal pass, then vertical pass.
        // Both passes are row-parallel via rayon for large rasters.
        // Uses f64 intermediates for precision, final output is f32.

        // Horizontal pass (reads f32 input, writes f64 temp) — parallel by row
        let mut temp = vec![0.0f64; width * height];
        temp.par_chunks_mut(width)
            .enumerate()
            .for_each(|(row, temp_row)| {
                let row_offset = row * width;
                for (col, pixel) in temp_row.iter_mut().enumerate() {
                    let mut acc = 0.0;
                    for (k, &kv) in kernel.iter().enumerate() {
                        let src_col = (col as isize + k as isize - radius as isize)
                            .clamp(0, width as isize - 1)
                            as usize;
                        acc += input.grid[row_offset + src_col] as f64 * kv;
                    }
                    *pixel = acc;
                }
            });

        // Vertical pass — parallel by row, produces continuous f32 output
        let mut output = vec![0.0f32; width * height];
        output
            .par_chunks_mut(width)
            .enumerate()
            .for_each(|(row, out_row)| {
                for col in 0..width {
                    let mut acc = 0.0;
                    for (k, &kv) in kernel.iter().enumerate() {
                        let src_row = (row as isize + k as isize - radius as isize)
                            .clamp(0, height as isize - 1)
                            as usize;
                        acc += temp[src_row * width + col] * kv;
                    }
                    out_row[col] = acc.clamp(0.0, 1.0) as f32;
                }
            });

        LayerRaster {
            grid: output,
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

        let model = GaussianModel::new(0.0);
        let result = model.predict(&raster);

        assert_eq!(result.get(5, 5), 1.0);
        assert_eq!(result.get(0, 0), 0.0);
    }

    #[test]
    fn test_gaussian_blur_produces_continuous_values() {
        // Create a raster with a large filled block so the center survives blur
        let mut raster = make_test_raster(40, 40);
        for r in 10..30 {
            for c in 10..30 {
                raster.set(c, r, 1.0);
            }
        }

        let model = GaussianModel::new(2.0);
        let result = model.predict(&raster);

        // Center of a large block should be near 1.0
        assert!(result.get(20, 20) > 0.9);

        // Edge pixels should have intermediate (non-binary) values
        let edge_val = result.get(9, 20); // just outside the filled block
        assert!(
            edge_val > 0.0 && edge_val < 1.0,
            "Edge should be continuous, got {edge_val}"
        );

        // Output should NOT be binary — the model returns continuous values
        assert!(
            !result.is_binary(),
            "Blurred result should contain continuous values"
        );
    }

    #[test]
    fn test_gaussian_blur_binarized_spreads() {
        // Verify that binarizing at a low threshold shows spreading
        let mut raster = make_test_raster(20, 20);
        for r in 8..12 {
            for c in 8..12 {
                raster.set(c, r, 1.0);
            }
        }

        let model = GaussianModel::new(2.0);
        let result = model.predict(&raster);
        let binarized = result.binarize(0.3);

        let filled_input = raster.filled_count();
        let filled_output = binarized.filled_count();
        // With low threshold and spreading, output should have >= input filled
        assert!(filled_output >= filled_input);
    }

    #[test]
    fn test_gaussian_blur_erodes_small_features() {
        // A single pixel blurred with large sigma should have low center value
        let mut raster = make_test_raster(20, 20);
        raster.set(10, 10, 1.0);

        let model = GaussianModel::new(3.0);
        let result = model.predict(&raster);

        // Single pixel should be blurred to a very low value at center
        assert!(
            result.get(10, 10) < 0.5,
            "Single pixel center should be below 0.5 after large blur"
        );
        // Binarized at 0.5, it should disappear
        let binarized = result.binarize(0.5);
        assert_eq!(binarized.filled_count(), 0);
    }

    #[test]
    fn test_from_design_units() {
        let model = GaussianModel::from_design_units(0.05, 0.01);
        assert!((model.sigma_px - 5.0).abs() < 1e-10);
    }
}
