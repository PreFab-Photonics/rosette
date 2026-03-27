//! Comparison of designed vs predicted rasters.
//!
//! Computes quantitative metrics (edge deviation, area change) and
//! reports violations when tolerances are exceeded.

use rosette_core::{BBox, Layer, Point};

use crate::rasterize::LayerRaster;

/// Severity level for DFM violations.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Severity {
    /// Non-critical — review recommended.
    Warning,
    /// Critical — must be addressed.
    Error,
}

/// Type of DFM violation.
#[derive(Debug, Clone)]
pub enum DfmViolationType {
    /// Area changed more than allowed.
    AreaDeviation {
        /// Maximum allowed relative deviation (0.0-1.0).
        max_allowed: f64,
        /// Actual relative deviation (signed: negative = shrinkage).
        actual: f64,
    },
}

/// A single DFM violation.
#[derive(Debug, Clone)]
pub struct DfmViolation {
    /// Layer where violation occurred.
    pub layer: Layer,
    /// Type of violation with measured values.
    pub violation_type: DfmViolationType,
    /// Bounding box around the worst deviation location.
    pub location: BBox,
    /// Human-readable description.
    pub message: String,
    /// Severity level.
    pub severity: Severity,
}

/// Per-layer comparison metrics.
#[derive(Debug, Clone)]
pub struct LayerMetrics {
    /// Layer these metrics apply to.
    pub layer: Layer,
    /// Maximum edge deviation in design units.
    pub max_edge_deviation: f64,
    /// Relative area change (signed: negative = area shrinkage).
    pub area_deviation: f64,
    /// Designed area in design units squared.
    pub designed_area: f64,
    /// Predicted area in design units squared.
    pub predicted_area: f64,
}

/// Tolerances for DFM comparison.
///
/// When set, violations are reported for deviations exceeding these limits.
#[derive(Debug, Clone)]
pub struct DfmTolerances {
    /// Maximum allowed relative area deviation (0.0-1.0).
    pub max_area_deviation: Option<f64>,
    /// Severity for violations.
    pub severity: Severity,
}

impl Default for DfmTolerances {
    fn default() -> Self {
        Self {
            max_area_deviation: None,
            severity: Severity::Error,
        }
    }
}

/// Compare designed vs predicted rasters for a single layer.
///
/// Always computes metrics. Reports violations only if tolerances are provided.
///
/// Returns (metrics, violations).
pub fn compare_layer(
    designed: &LayerRaster,
    predicted: &LayerRaster,
    layer: Layer,
    tolerances: Option<&DfmTolerances>,
) -> (LayerMetrics, Vec<DfmViolation>) {
    let resolution = designed.resolution;
    let pixel_area = resolution * resolution;

    // Count filled pixels for area metrics
    let designed_filled = designed.filled_count();
    let predicted_filled = predicted.filled_count();

    let designed_area = designed_filled as f64 * pixel_area;
    let predicted_area = predicted_filled as f64 * pixel_area;

    let area_deviation = if designed_filled > 0 {
        (predicted_filled as f64 - designed_filled as f64) / designed_filled as f64
    } else {
        0.0
    };

    // Compute edge deviation via boundary pixel comparison
    let designed_boundary = extract_boundary_pixels(designed);
    let predicted_boundary = extract_boundary_pixels(predicted);

    // Handle degenerate cases: if one has boundary and the other doesn't,
    // the feature was completely erased or appeared from nothing.
    // Use the diagonal of the raster as a conservative max deviation.
    let raster_diagonal =
        ((designed.width as f64).powi(2) + (designed.height as f64).powi(2)).sqrt();

    let w = designed.width;
    let h = designed.height;

    let (max_edge_deviation_px, worst_px, worst_py) =
        if !designed_boundary.is_empty() && predicted_boundary.is_empty() {
            // Feature completely erased — use designed boundary centroid as location
            let (cx, cy) = boundary_centroid(&designed_boundary);
            (raster_diagonal, cx, cy)
        } else if designed_boundary.is_empty() && !predicted_boundary.is_empty() {
            // Feature appeared from nothing
            let (cx, cy) = boundary_centroid(&predicted_boundary);
            (raster_diagonal, cx, cy)
        } else {
            // Normal case: both have boundaries, compute Hausdorff via distance transform
            // Take max of both directions for symmetric comparison
            let (d1, c1, r1) = hausdorff_one_way(&predicted_boundary, &designed_boundary, w, h);
            let (d2, c2, r2) = hausdorff_one_way(&designed_boundary, &predicted_boundary, w, h);
            if d1 >= d2 { (d1, c1, r1) } else { (d2, c2, r2) }
        };

    let max_edge_deviation = max_edge_deviation_px * resolution;

    // Location of worst deviation in design units
    let worst_location = BBox::new(
        Point::new(
            designed.origin.x + worst_px as f64 * resolution,
            designed.origin.y + worst_py as f64 * resolution,
        ),
        Point::new(
            designed.origin.x + (worst_px + 1) as f64 * resolution,
            designed.origin.y + (worst_py + 1) as f64 * resolution,
        ),
    );

    let metrics = LayerMetrics {
        layer,
        max_edge_deviation,
        area_deviation,
        designed_area,
        predicted_area,
    };

    // Check tolerances and generate violations
    let mut violations = Vec::new();

    if let Some(tol) = tolerances
        && let Some(max_area) = tol.max_area_deviation
        && area_deviation.abs() > max_area
    {
        violations.push(DfmViolation {
            layer,
            violation_type: DfmViolationType::AreaDeviation {
                max_allowed: max_area,
                actual: area_deviation,
            },
            location: worst_location,
            message: format!(
                "area deviation {:.1}% exceeds max {:.1}%",
                area_deviation * 100.0,
                max_area * 100.0
            ),
            severity: tol.severity,
        });
    }

    (metrics, violations)
}

/// A boundary pixel position (col, row).
type BoundaryPixel = (usize, usize);

/// Extract boundary pixels from a raster.
///
/// A boundary pixel is one where the value > 0.5 and at least one
/// 4-connected neighbor has value <= 0.5 (or is out of bounds).
fn extract_boundary_pixels(raster: &LayerRaster) -> Vec<BoundaryPixel> {
    let mut boundary = Vec::new();
    let w = raster.width;
    let h = raster.height;

    for row in 0..h {
        for col in 0..w {
            if raster.get(col, row) <= 0.5 {
                continue;
            }

            // Check 4-connected neighbors
            let is_boundary = (col == 0 || raster.get(col - 1, row) <= 0.5)
                || (col + 1 >= w || raster.get(col + 1, row) <= 0.5)
                || (row == 0 || raster.get(col, row - 1) <= 0.5)
                || (row + 1 >= h || raster.get(col, row + 1) <= 0.5);

            if is_boundary {
                boundary.push((col, row));
            }
        }
    }

    boundary
}

/// Compute the centroid of boundary pixels.
fn boundary_centroid(boundary: &[BoundaryPixel]) -> (usize, usize) {
    if boundary.is_empty() {
        return (0, 0);
    }
    let sum_c: usize = boundary.iter().map(|&(c, _)| c).sum();
    let sum_r: usize = boundary.iter().map(|&(_, r)| r).sum();
    (sum_c / boundary.len(), sum_r / boundary.len())
}

/// One-way Hausdorff distance using a distance transform.
///
/// Computes the distance from each `from` boundary pixel to the nearest
/// `to` boundary pixel. Uses a two-pass distance transform (Rosenfeld-Pfaltz)
/// on a grid seeded with `to` pixels, then reads off distances at `from` positions.
///
/// O(width * height) instead of O(n * m) on boundary pixel counts.
///
/// Returns (max_distance_in_pixels, worst_col, worst_row).
fn hausdorff_one_way(
    from: &[BoundaryPixel],
    to: &[BoundaryPixel],
    width: usize,
    height: usize,
) -> (f64, usize, usize) {
    if from.is_empty() || to.is_empty() {
        return (0.0, 0, 0);
    }

    // Build distance grid via two-pass EDT approximation (Chebyshev-like).
    // We use squared Euclidean distance with a separable approach for speed.
    // For Hausdorff purposes, a chamfer distance transform is sufficient.
    let inf = (width + height) as f64;
    let mut dist = vec![inf; width * height];

    // Seed: distance = 0 at `to` boundary pixels
    for &(c, r) in to {
        dist[r * width + c] = 0.0;
    }

    // Forward pass (top-left to bottom-right)
    for r in 0..height {
        for c in 0..width {
            let idx = r * width + c;
            if c > 0 {
                let d = dist[idx - 1] + 1.0;
                if d < dist[idx] {
                    dist[idx] = d;
                }
            }
            if r > 0 {
                let d = dist[idx - width] + 1.0;
                if d < dist[idx] {
                    dist[idx] = d;
                }
            }
            if c > 0 && r > 0 {
                let d = dist[idx - width - 1] + std::f64::consts::SQRT_2;
                if d < dist[idx] {
                    dist[idx] = d;
                }
            }
            if c + 1 < width && r > 0 {
                let d = dist[idx - width + 1] + std::f64::consts::SQRT_2;
                if d < dist[idx] {
                    dist[idx] = d;
                }
            }
        }
    }

    // Backward pass (bottom-right to top-left)
    for r in (0..height).rev() {
        for c in (0..width).rev() {
            let idx = r * width + c;
            if c + 1 < width {
                let d = dist[idx + 1] + 1.0;
                if d < dist[idx] {
                    dist[idx] = d;
                }
            }
            if r + 1 < height {
                let d = dist[idx + width] + 1.0;
                if d < dist[idx] {
                    dist[idx] = d;
                }
            }
            if c + 1 < width && r + 1 < height {
                let d = dist[idx + width + 1] + std::f64::consts::SQRT_2;
                if d < dist[idx] {
                    dist[idx] = d;
                }
            }
            if c > 0 && r + 1 < height {
                let d = dist[idx + width - 1] + std::f64::consts::SQRT_2;
                if d < dist[idx] {
                    dist[idx] = d;
                }
            }
        }
    }

    // Find max distance among `from` pixels
    let mut max_dist = 0.0f64;
    let mut worst_col = 0;
    let mut worst_row = 0;

    for &(fc, fr) in from {
        let d = dist[fr * width + fc];
        if d > max_dist {
            max_dist = d;
            worst_col = fc;
            worst_row = fr;
        }
    }

    (max_dist, worst_col, worst_row)
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::Point;

    fn make_raster(width: usize, height: usize) -> LayerRaster {
        LayerRaster {
            grid: vec![0.0; width * height],
            width,
            height,
            origin: Point::new(0.0, 0.0),
            resolution: 1.0,
        }
    }

    #[test]
    fn test_identical_rasters_zero_deviation() {
        let mut designed = make_raster(20, 20);
        // Fill a block
        for r in 5..15 {
            for c in 5..15 {
                designed.set(c, r, 1.0);
            }
        }
        let predicted = designed.clone();

        let layer = Layer::new(1, 0);
        let (metrics, violations) = compare_layer(&designed, &predicted, layer, None);

        assert!((metrics.max_edge_deviation - 0.0).abs() < 1e-10);
        assert!((metrics.area_deviation - 0.0).abs() < 1e-10);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_area_deviation_shrinkage() {
        let mut designed = make_raster(20, 20);
        let mut predicted = make_raster(20, 20);

        // Designed: 10x10 block
        for r in 5..15 {
            for c in 5..15 {
                designed.set(c, r, 1.0);
            }
        }
        // Predicted: 8x8 block (smaller)
        for r in 6..14 {
            for c in 6..14 {
                predicted.set(c, r, 1.0);
            }
        }

        let layer = Layer::new(1, 0);
        let (metrics, _) = compare_layer(&designed, &predicted, layer, None);

        // Designed: 100 pixels, Predicted: 64 pixels -> -36%
        assert!(metrics.area_deviation < 0.0); // Shrinkage
        assert!((metrics.area_deviation - (-0.36)).abs() < 0.01);
    }

    #[test]
    fn test_edge_deviation_shifted_boundary() {
        let mut designed = make_raster(20, 20);
        let mut predicted = make_raster(20, 20);

        // Designed: block at cols 5-14
        for r in 5..15 {
            for c in 5..15 {
                designed.set(c, r, 1.0);
            }
        }
        // Predicted: block shifted right by 2 pixels
        for r in 5..15 {
            for c in 7..17 {
                predicted.set(c, r, 1.0);
            }
        }

        let layer = Layer::new(1, 0);
        let (metrics, _) = compare_layer(&designed, &predicted, layer, None);

        // Edge deviation should be ~2 pixels = 2.0 design units (resolution=1.0)
        assert!(metrics.max_edge_deviation >= 1.5);
        assert!(metrics.max_edge_deviation <= 3.0);
        // Area should be the same (same size block)
        assert!((metrics.area_deviation).abs() < 0.01);
    }

    #[test]
    fn test_tolerance_violation_area() {
        let mut designed = make_raster(20, 20);
        let mut predicted = make_raster(20, 20);

        for r in 5..15 {
            for c in 5..15 {
                designed.set(c, r, 1.0);
            }
        }
        for r in 6..14 {
            for c in 6..14 {
                predicted.set(c, r, 1.0);
            }
        }

        let tol = DfmTolerances {
            max_area_deviation: Some(0.10), // 10% — will be exceeded (36%)
            severity: Severity::Warning,
        };

        let layer = Layer::new(1, 0);
        let (_, violations) = compare_layer(&designed, &predicted, layer, Some(&tol));

        assert_eq!(violations.len(), 1);
        assert!(matches!(
            violations[0].violation_type,
            DfmViolationType::AreaDeviation { .. }
        ));
        assert_eq!(violations[0].severity, Severity::Warning);
    }

    #[test]
    fn test_tolerance_passes_when_within_limits() {
        let mut designed = make_raster(20, 20);
        for r in 5..15 {
            for c in 5..15 {
                designed.set(c, r, 1.0);
            }
        }
        let predicted = designed.clone();

        let tol = DfmTolerances {
            max_area_deviation: Some(0.01),
            severity: Severity::Error,
        };

        let layer = Layer::new(1, 0);
        let (_, violations) = compare_layer(&designed, &predicted, layer, Some(&tol));

        assert!(violations.is_empty());
    }

    #[test]
    fn test_empty_rasters() {
        let designed = make_raster(10, 10);
        let predicted = make_raster(10, 10);

        let layer = Layer::new(1, 0);
        let (metrics, violations) = compare_layer(&designed, &predicted, layer, None);

        assert!((metrics.max_edge_deviation).abs() < 1e-10);
        assert!((metrics.area_deviation).abs() < 1e-10);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_boundary_extraction() {
        let mut raster = make_raster(10, 10);
        // Fill a 4x4 block at (3,3)-(6,6)
        for r in 3..7 {
            for c in 3..7 {
                raster.set(c, r, 1.0);
            }
        }

        let boundary = extract_boundary_pixels(&raster);

        // Interior pixels (4,4), (4,5), (5,4), (5,5) should NOT be boundary
        assert!(!boundary.contains(&(4, 4)));
        assert!(!boundary.contains(&(5, 5)));

        // Edge pixels should be boundary
        assert!(boundary.contains(&(3, 3))); // corner
        assert!(boundary.contains(&(6, 6))); // corner
        assert!(boundary.contains(&(3, 5))); // left edge
        assert!(boundary.contains(&(5, 3))); // top edge

        // Total boundary: perimeter of 4x4 block = 4*4 - 2*2 = 12
        assert_eq!(boundary.len(), 12);
    }

    #[test]
    fn test_design_units_scaling() {
        // Use resolution=0.1 to verify pixel-to-design-unit conversion
        let mut designed = LayerRaster {
            grid: vec![0.0; 100],
            width: 10,
            height: 10,
            origin: Point::new(0.0, 0.0),
            resolution: 0.1,
        };
        let mut predicted = LayerRaster {
            grid: vec![0.0; 100],
            width: 10,
            height: 10,
            origin: Point::new(0.0, 0.0),
            resolution: 0.1,
        };

        // 5x5 block
        for r in 2..7 {
            for c in 2..7 {
                designed.set(c, r, 1.0);
            }
        }
        // Same block shifted right by 1 pixel = 0.1 design units
        for r in 2..7 {
            for c in 3..8 {
                predicted.set(c, r, 1.0);
            }
        }

        let layer = Layer::new(1, 0);
        let (metrics, _) = compare_layer(&designed, &predicted, layer, None);

        // Edge deviation should be ~0.1 um (1 pixel * 0.1 resolution)
        assert!(metrics.max_edge_deviation >= 0.05);
        assert!(metrics.max_edge_deviation <= 0.2);
    }
}
