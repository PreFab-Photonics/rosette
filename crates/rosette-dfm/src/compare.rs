//! Comparison of designed vs predicted rasters.
//!
//! Computes quantitative metrics (edge deviation, area change) and
//! reports violations when tolerances are exceeded.

use rosette_core::{BBox, Layer};

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
    /// A designed feature completely disappeared in prediction.
    FeatureErasure {
        /// Number of designed features (connected components).
        designed_count: usize,
        /// Number of predicted features.
        predicted_count: usize,
    },
    /// Distinct designed features merged into fewer predicted features.
    FeatureMerge {
        /// Number of designed features (connected components).
        designed_count: usize,
        /// Number of predicted features.
        predicted_count: usize,
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
    /// Number of connected components in the designed raster.
    pub designed_feature_count: usize,
    /// Number of connected components in the predicted raster.
    pub predicted_feature_count: usize,
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
/// The `threshold` is used to binarize continuous rasters before comparison.
/// `layer_bbox` is the bounding box of the designed geometry on this layer,
/// used for locating area-level violations.
/// Always computes metrics. Reports violations only if tolerances are provided.
///
/// Returns (metrics, violations).
pub fn compare_layer(
    designed: &LayerRaster,
    predicted: &LayerRaster,
    layer: Layer,
    threshold: f32,
    layer_bbox: &BBox,
    tolerances: Option<&DfmTolerances>,
) -> (LayerMetrics, Vec<DfmViolation>) {
    // Binarize rasters at the threshold for comparison.
    // The designed raster is already binary from rasterization, so skip if possible.
    let designed_bin;
    let designed_ref = if designed.is_binary() {
        designed
    } else {
        designed_bin = designed.binarize(threshold);
        &designed_bin
    };
    let predicted_bin = predicted.binarize(threshold);

    let resolution = designed.resolution;
    let pixel_area = resolution * resolution;

    // Count filled pixels for area metrics
    let designed_filled = designed_ref.filled_count();
    let predicted_filled = predicted_bin.filled_count();

    let designed_area = designed_filled as f64 * pixel_area;
    let predicted_area = predicted_filled as f64 * pixel_area;

    let area_deviation = if designed_filled > 0 {
        (predicted_filled as f64 - designed_filled as f64) / designed_filled as f64
    } else {
        0.0
    };

    // Compute edge deviation via boundary pixel comparison
    let designed_boundary = extract_boundary_pixels(designed_ref);
    let predicted_boundary = extract_boundary_pixels(&predicted_bin);

    let w = designed_ref.width;
    let h = designed_ref.height;

    let max_edge_deviation_px = if !designed_boundary.is_empty() && predicted_boundary.is_empty() {
        // Feature completely erased — report deviation as the half-diagonal of
        // the designed geometry's bounding box (the farthest any edge could have
        // moved from center). This is more meaningful than the full raster diagonal.
        boundary_half_diagonal(&designed_boundary)
    } else if designed_boundary.is_empty() && !predicted_boundary.is_empty() {
        // Feature appeared from nothing — same logic using predicted boundary
        boundary_half_diagonal(&predicted_boundary)
    } else {
        // Normal case: both have boundaries, compute Hausdorff via distance transform
        // Take max of both directions for symmetric comparison
        let (d1, _, _) = hausdorff_one_way(&predicted_boundary, &designed_boundary, w, h);
        let (d2, _, _) = hausdorff_one_way(&designed_boundary, &predicted_boundary, w, h);
        d1.max(d2)
    };

    let max_edge_deviation = max_edge_deviation_px * resolution;

    // Count connected components (distinct features)
    let designed_feature_count = count_connected_components(designed_ref);
    let predicted_feature_count = count_connected_components(&predicted_bin);

    let metrics = LayerMetrics {
        layer,
        max_edge_deviation,
        area_deviation,
        designed_area,
        predicted_area,
        designed_feature_count,
        predicted_feature_count,
    };

    // Check tolerances and generate violations
    let mut violations = Vec::new();

    if let Some(tol) = tolerances {
        if let Some(max_area) = tol.max_area_deviation
            && area_deviation.abs() > max_area
        {
            violations.push(DfmViolation {
                layer,
                violation_type: DfmViolationType::AreaDeviation {
                    max_allowed: max_area,
                    actual: area_deviation,
                },
                location: *layer_bbox,
                message: format!(
                    "area deviation {:.1}% exceeds max {:.1}%",
                    area_deviation * 100.0,
                    max_area * 100.0
                ),
                severity: tol.severity,
            });
        }

        // Feature erasure: designed features that completely disappeared
        if designed_feature_count > 0 && predicted_feature_count == 0 {
            violations.push(DfmViolation {
                layer,
                violation_type: DfmViolationType::FeatureErasure {
                    designed_count: designed_feature_count,
                    predicted_count: 0,
                },
                location: *layer_bbox,
                message: format!(
                    "{} designed feature(s) completely erased by fabrication prediction",
                    designed_feature_count
                ),
                severity: tol.severity,
            });
        }

        // Feature merge: distinct features fused together
        if designed_feature_count > 1
            && predicted_feature_count > 0
            && predicted_feature_count < designed_feature_count
        {
            violations.push(DfmViolation {
                layer,
                violation_type: DfmViolationType::FeatureMerge {
                    designed_count: designed_feature_count,
                    predicted_count: predicted_feature_count,
                },
                location: *layer_bbox,
                message: format!(
                    "{} designed features merged into {} predicted features",
                    designed_feature_count, predicted_feature_count
                ),
                severity: Severity::Warning, // Merges are always warnings — may be intentional
            });
        }
    }

    (metrics, violations)
}

/// Count connected components (distinct features) in a binarized raster.
///
/// Uses a flood-fill approach with 4-connectivity. Each group of
/// adjacent filled pixels (value > 0.5) forms one connected component.
fn count_connected_components(raster: &LayerRaster) -> usize {
    let w = raster.width;
    let h = raster.height;
    let mut visited = vec![false; w * h];
    let mut count = 0;

    for start in 0..w * h {
        if visited[start] || raster.grid[start] < 0.5 {
            continue;
        }

        // BFS flood fill from this pixel
        count += 1;
        let mut queue = std::collections::VecDeque::new();
        queue.push_back(start);
        visited[start] = true;

        while let Some(idx) = queue.pop_front() {
            let col = idx % w;
            let row = idx / w;

            // 4-connected neighbors
            let neighbors = [
                if col > 0 { Some(idx - 1) } else { None },
                if col + 1 < w { Some(idx + 1) } else { None },
                if row > 0 { Some(idx - w) } else { None },
                if row + 1 < h { Some(idx + w) } else { None },
            ];

            for neighbor in neighbors.into_iter().flatten() {
                if !visited[neighbor] && raster.grid[neighbor] >= 0.5 {
                    visited[neighbor] = true;
                    queue.push_back(neighbor);
                }
            }
        }
    }

    count
}

/// A boundary pixel position (col, row).
type BoundaryPixel = (usize, usize);

/// Extract boundary pixels from a binarized raster.
///
/// A boundary pixel is one where the value > 0.5 and at least one
/// 4-connected neighbor has value <= 0.5 (or is out of bounds).
/// The raster should be binarized before calling this function.
fn extract_boundary_pixels(raster: &LayerRaster) -> Vec<BoundaryPixel> {
    let mut boundary = Vec::new();
    let w = raster.width;
    let h = raster.height;

    for row in 0..h {
        for col in 0..w {
            if raster.get(col, row) < 0.5 {
                continue;
            }

            // Check 4-connected neighbors
            let is_boundary = (col == 0 || raster.get(col - 1, row) < 0.5)
                || (col + 1 >= w || raster.get(col + 1, row) < 0.5)
                || (row == 0 || raster.get(col, row - 1) < 0.5)
                || (row + 1 >= h || raster.get(col, row + 1) < 0.5);

            if is_boundary {
                boundary.push((col, row));
            }
        }
    }

    boundary
}

/// Half-diagonal of the bounding box around boundary pixels, in pixel units.
///
/// Used as a fallback edge deviation when one side has no boundary (feature
/// completely erased or appeared from nothing). More meaningful than the
/// full raster diagonal because it's proportional to the actual feature size.
fn boundary_half_diagonal(boundary: &[BoundaryPixel]) -> f64 {
    if boundary.is_empty() {
        return 0.0;
    }
    let min_c = boundary.iter().map(|&(c, _)| c).min().unwrap();
    let max_c = boundary.iter().map(|&(c, _)| c).max().unwrap();
    let min_r = boundary.iter().map(|&(_, r)| r).min().unwrap();
    let max_r = boundary.iter().map(|&(_, r)| r).max().unwrap();
    let dc = (max_c - min_c) as f64;
    let dr = (max_r - min_r) as f64;
    (dc * dc + dr * dr).sqrt() / 2.0
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

    fn test_bbox() -> BBox {
        BBox::new(Point::new(0.0, 0.0), Point::new(20.0, 20.0))
    }

    #[test]
    fn test_identical_rasters_zero_deviation() {
        let mut designed = make_raster(20, 20);
        for r in 5..15 {
            for c in 5..15 {
                designed.set(c, r, 1.0);
            }
        }
        let predicted = designed.clone();

        let layer = Layer::new(1, 0);
        let bbox = test_bbox();
        let (metrics, violations) = compare_layer(&designed, &predicted, layer, 0.5, &bbox, None);

        assert!((metrics.max_edge_deviation - 0.0).abs() < 1e-10);
        assert!((metrics.area_deviation - 0.0).abs() < 1e-10);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_area_deviation_shrinkage() {
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

        let layer = Layer::new(1, 0);
        let bbox = test_bbox();
        let (metrics, _) = compare_layer(&designed, &predicted, layer, 0.5, &bbox, None);

        assert!(metrics.area_deviation < 0.0);
        assert!((metrics.area_deviation - (-0.36)).abs() < 0.01);
    }

    #[test]
    fn test_edge_deviation_shifted_boundary() {
        let mut designed = make_raster(20, 20);
        let mut predicted = make_raster(20, 20);

        for r in 5..15 {
            for c in 5..15 {
                designed.set(c, r, 1.0);
            }
        }
        for r in 5..15 {
            for c in 7..17 {
                predicted.set(c, r, 1.0);
            }
        }

        let layer = Layer::new(1, 0);
        let bbox = test_bbox();
        let (metrics, _) = compare_layer(&designed, &predicted, layer, 0.5, &bbox, None);

        assert!(metrics.max_edge_deviation >= 1.5);
        assert!(metrics.max_edge_deviation <= 3.0);
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
            max_area_deviation: Some(0.10),
            severity: Severity::Warning,
        };

        let layer = Layer::new(1, 0);
        let bbox = test_bbox();
        let (_, violations) = compare_layer(&designed, &predicted, layer, 0.5, &bbox, Some(&tol));

        assert_eq!(violations.len(), 1);
        assert!(matches!(
            violations[0].violation_type,
            DfmViolationType::AreaDeviation { .. }
        ));
        assert_eq!(violations[0].severity, Severity::Warning);
        // Area violation should report the layer bbox, not a single pixel
        assert_eq!(violations[0].location, bbox);
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
        let bbox = test_bbox();
        let (_, violations) = compare_layer(&designed, &predicted, layer, 0.5, &bbox, Some(&tol));

        assert!(violations.is_empty());
    }

    #[test]
    fn test_empty_rasters() {
        let designed = make_raster(10, 10);
        let predicted = make_raster(10, 10);

        let layer = Layer::new(1, 0);
        let bbox = BBox::new(Point::new(0.0, 0.0), Point::new(10.0, 10.0));
        let (metrics, violations) = compare_layer(&designed, &predicted, layer, 0.5, &bbox, None);

        assert!((metrics.max_edge_deviation).abs() < 1e-10);
        assert!((metrics.area_deviation).abs() < 1e-10);
        assert!(violations.is_empty());
    }

    #[test]
    fn test_boundary_extraction() {
        let mut raster = make_raster(10, 10);
        for r in 3..7 {
            for c in 3..7 {
                raster.set(c, r, 1.0);
            }
        }

        let boundary = extract_boundary_pixels(&raster);

        assert!(!boundary.contains(&(4, 4)));
        assert!(!boundary.contains(&(5, 5)));
        assert!(boundary.contains(&(3, 3)));
        assert!(boundary.contains(&(6, 6)));
        assert!(boundary.contains(&(3, 5)));
        assert!(boundary.contains(&(5, 3)));
        assert_eq!(boundary.len(), 12);
    }

    #[test]
    fn test_design_units_scaling() {
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

        for r in 2..7 {
            for c in 2..7 {
                designed.set(c, r, 1.0);
            }
        }
        for r in 2..7 {
            for c in 3..8 {
                predicted.set(c, r, 1.0);
            }
        }

        let layer = Layer::new(1, 0);
        let bbox = BBox::new(Point::new(0.0, 0.0), Point::new(1.0, 1.0));
        let (metrics, _) = compare_layer(&designed, &predicted, layer, 0.5, &bbox, None);

        assert!(metrics.max_edge_deviation >= 0.05);
        assert!(metrics.max_edge_deviation <= 0.2);
    }

    #[test]
    fn test_feature_count() {
        let mut raster = make_raster(20, 20);
        // Two separate blocks
        for r in 2..5 {
            for c in 2..5 {
                raster.set(c, r, 1.0);
            }
        }
        for r in 10..13 {
            for c in 10..13 {
                raster.set(c, r, 1.0);
            }
        }

        assert_eq!(count_connected_components(&raster), 2);
    }

    #[test]
    fn test_feature_erasure_violation() {
        let mut designed = make_raster(20, 20);
        for r in 5..15 {
            for c in 5..15 {
                designed.set(c, r, 1.0);
            }
        }
        // Predicted: completely empty
        let predicted = make_raster(20, 20);

        let tol = DfmTolerances {
            max_area_deviation: Some(0.01),
            severity: Severity::Error,
        };

        let layer = Layer::new(1, 0);
        let bbox = test_bbox();
        let (metrics, violations) =
            compare_layer(&designed, &predicted, layer, 0.5, &bbox, Some(&tol));

        assert_eq!(metrics.designed_feature_count, 1);
        assert_eq!(metrics.predicted_feature_count, 0);

        assert!(
            violations
                .iter()
                .any(|v| matches!(v.violation_type, DfmViolationType::FeatureErasure { .. }))
        );
    }

    #[test]
    fn test_feature_merge_violation() {
        let mut designed = make_raster(20, 20);
        // Two separate blocks
        for r in 2..5 {
            for c in 2..5 {
                designed.set(c, r, 1.0);
            }
        }
        for r in 7..10 {
            for c in 2..5 {
                designed.set(c, r, 1.0);
            }
        }

        // Predicted: one merged block
        let mut predicted = make_raster(20, 20);
        for r in 2..10 {
            for c in 2..5 {
                predicted.set(c, r, 1.0);
            }
        }

        let tol = DfmTolerances {
            max_area_deviation: Some(1.0), // Loose — don't trigger area violation
            severity: Severity::Warning,
        };

        let layer = Layer::new(1, 0);
        let bbox = test_bbox();
        let (metrics, violations) =
            compare_layer(&designed, &predicted, layer, 0.5, &bbox, Some(&tol));

        assert_eq!(metrics.designed_feature_count, 2);
        assert_eq!(metrics.predicted_feature_count, 1);

        assert!(
            violations
                .iter()
                .any(|v| matches!(v.violation_type, DfmViolationType::FeatureMerge { .. }))
        );
    }

    #[test]
    fn test_no_feature_violations_without_tolerances() {
        let mut designed = make_raster(20, 20);
        for r in 5..15 {
            for c in 5..15 {
                designed.set(c, r, 1.0);
            }
        }
        let predicted = make_raster(20, 20); // Completely empty

        let layer = Layer::new(1, 0);
        let bbox = test_bbox();
        // No tolerances = no violations (informational mode)
        let (_, violations) = compare_layer(&designed, &predicted, layer, 0.5, &bbox, None);
        assert!(violations.is_empty());
    }
}
