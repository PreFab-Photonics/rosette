//! Contour extraction from raster grids via marching squares.
//!
//! Converts a predicted raster back into vector polygons that can be
//! written to GDS or compared with the original design.

use rosette_core::{Point, Polygon};

use crate::rasterize::LayerRaster;

/// Extract contour polygons from a raster using marching squares.
///
/// The threshold determines the iso-value for contour extraction.
/// Pixels with values >= threshold are considered "filled".
/// Coordinates are mapped back to design units using the raster's
/// origin and resolution.
///
/// # Arguments
///
/// * `raster` - The predicted raster to extract contours from
/// * `threshold` - Binarization threshold in `[0.0, 1.0]` (typically 0.5)
///
/// # Returns
///
/// A vector of polygons representing the predicted geometry boundaries.
pub fn extract_contours(raster: &LayerRaster, threshold: f64) -> Vec<Polygon> {
    if raster.width < 2 || raster.height < 2 {
        return Vec::new();
    }

    let threshold = threshold as f32;
    let binary: Vec<bool> = raster.grid.iter().map(|&v| v >= threshold).collect();

    // Find all contour segments using marching squares
    let segments = march_squares(&binary, raster.width, raster.height);

    // Chain segments into closed polygons
    let chains = chain_segments(segments);

    // Convert pixel coordinates to design-unit polygons
    chains
        .into_iter()
        .filter(|chain| chain.len() >= 3)
        .map(|chain| {
            let vertices: Vec<Point> = chain
                .into_iter()
                .map(|(px, py)| {
                    Point::new(
                        raster.origin.x + px * raster.resolution,
                        raster.origin.y + py * raster.resolution,
                    )
                })
                .collect();
            Polygon::new(simplify_polygon(&vertices, raster.resolution * 0.1))
        })
        .collect()
}

/// A line segment in pixel coordinates.
type Segment = ((f64, f64), (f64, f64));

/// Marching squares contour finding.
///
/// Iterates over 2x2 cells in the binary grid and generates line segments
/// for contour boundaries.
fn march_squares(binary: &[bool], width: usize, height: usize) -> Vec<Segment> {
    let mut segments = Vec::new();

    for row in 0..height - 1 {
        for col in 0..width - 1 {
            // Sample the four corners of this cell
            let tl = binary[row * width + col] as u8;
            let tr = binary[row * width + (col + 1)] as u8;
            let br = binary[(row + 1) * width + (col + 1)] as u8;
            let bl = binary[(row + 1) * width + col] as u8;

            let case = (tl << 3) | (tr << 2) | (br << 1) | bl;

            let x = col as f64;
            let y = row as f64;

            // Midpoints of edges
            let top = (x + 0.5, y);
            let right = (x + 1.0, y + 0.5);
            let bottom = (x + 0.5, y + 1.0);
            let left = (x, y + 0.5);

            match case {
                0 | 15 => {} // All same — no contour
                1 => segments.push((bottom, left)),
                2 => segments.push((right, bottom)),
                3 => segments.push((right, left)),
                4 => segments.push((top, right)),
                5 => {
                    // Saddle point — disambiguate by sampling center value.
                    // Average of corners > 0.5 means center is "filled",
                    // so connect filled corners (TL + BR).
                    let center = (tl + tr + br + bl) as f64 / 4.0;
                    if center > 0.5 {
                        // Connect filled diagonal: TL-BR
                        segments.push((top, right));
                        segments.push((bottom, left));
                    } else {
                        // Connect empty diagonal: TR-BL
                        segments.push((top, left));
                        segments.push((right, bottom));
                    }
                }
                6 => segments.push((top, bottom)),
                7 => segments.push((top, left)),
                8 => segments.push((left, top)),
                9 => segments.push((bottom, top)),
                10 => {
                    // Saddle point — disambiguate by sampling center value.
                    let center = (tl + tr + br + bl) as f64 / 4.0;
                    if center > 0.5 {
                        // Connect filled diagonal: TR-BL
                        segments.push((left, top));
                        segments.push((right, bottom));
                    } else {
                        // Connect empty diagonal: TL-BR
                        segments.push((left, bottom));
                        segments.push((top, right));
                    }
                }
                11 => segments.push((right, top)),
                12 => segments.push((left, right)),
                13 => segments.push((right, bottom)),
                14 => segments.push((left, bottom)),
                _ => {} // Can't happen with 4-bit case
            }
        }
    }

    segments
}

/// Quantize a floating-point coordinate to an integer key for hashing.
///
/// Marching squares produces coordinates at 0.5-unit increments,
/// so we multiply by 2 to get integers.
fn quantize(v: f64) -> i64 {
    (v * 2.0).round() as i64
}

/// Hash key for a point (quantized to half-pixel grid).
fn point_key(p: (f64, f64)) -> (i64, i64) {
    (quantize(p.0), quantize(p.1))
}

/// An adjacency entry: (other_endpoint_x, other_endpoint_y, segment_index).
type AdjEntry = (f64, f64, usize);

/// Chain line segments into closed polygon loops using a hash-map adjacency list.
///
/// Each segment endpoint is quantized and used as a hash key.
/// Segments sharing an endpoint are chained together in O(n) total time.
/// Uses `VecDeque` internally so front-extension is O(1) instead of O(n).
fn chain_segments(segments: Vec<Segment>) -> Vec<Vec<(f64, f64)>> {
    use std::collections::{HashMap, VecDeque};

    if segments.is_empty() {
        return Vec::new();
    }

    // Build adjacency: point_key -> list of (other_endpoint, segment_index)
    let mut adj: HashMap<(i64, i64), Vec<AdjEntry>> = HashMap::new();
    for (i, &(a, b)) in segments.iter().enumerate() {
        adj.entry(point_key(a)).or_default().push((b.0, b.1, i));
        adj.entry(point_key(b)).or_default().push((a.0, a.1, i));
    }

    let mut used = vec![false; segments.len()];
    let mut chains: Vec<Vec<(f64, f64)>> = Vec::new();

    for start_idx in 0..segments.len() {
        if used[start_idx] {
            continue;
        }
        used[start_idx] = true;

        let (a, b) = segments[start_idx];
        let mut chain: VecDeque<(f64, f64)> = VecDeque::new();
        chain.push_back(a);
        chain.push_back(b);

        // Extend from the back
        loop {
            let tail = *chain.back().unwrap();
            let key = point_key(tail);
            let mut found = false;

            if let Some(neighbors) = adj.get_mut(&key) {
                for entry in neighbors.iter() {
                    let idx = entry.2;
                    if !used[idx] {
                        used[idx] = true;
                        chain.push_back((entry.0, entry.1));
                        found = true;
                        break;
                    }
                }
            }

            if !found {
                break;
            }
        }

        // Extend from the front — O(1) with VecDeque
        loop {
            let head = *chain.front().unwrap();
            let key = point_key(head);
            let mut found = false;

            if let Some(neighbors) = adj.get_mut(&key) {
                for entry in neighbors.iter() {
                    let idx = entry.2;
                    if !used[idx] {
                        used[idx] = true;
                        chain.push_front((entry.0, entry.1));
                        found = true;
                        break;
                    }
                }
            }

            if !found {
                break;
            }
        }

        chains.push(chain.into());
    }

    chains
}

/// Simplify a polygon using the Ramer-Douglas-Peucker algorithm.
///
/// Removes vertices that are within `tolerance` of the simplified line.
fn simplify_polygon(vertices: &[Point], tolerance: f64) -> Vec<Point> {
    if vertices.len() <= 3 {
        return vertices.to_vec();
    }

    let simplified = rdp_simplify(vertices, tolerance);

    if simplified.len() >= 3 {
        simplified
    } else {
        vertices.to_vec()
    }
}

/// Ramer-Douglas-Peucker line simplification.
fn rdp_simplify(points: &[Point], tolerance: f64) -> Vec<Point> {
    if points.len() <= 2 {
        return points.to_vec();
    }

    // Find the point with the maximum distance from the line (first, last)
    let first = points[0];
    let last = points[points.len() - 1];

    let mut max_dist = 0.0;
    let mut max_idx = 0;

    for (i, point) in points.iter().enumerate().skip(1).take(points.len() - 2) {
        let dist = perpendicular_distance(*point, first, last);
        if dist > max_dist {
            max_dist = dist;
            max_idx = i;
        }
    }

    if max_dist > tolerance {
        // Recursively simplify both halves
        let mut left = rdp_simplify(&points[..=max_idx], tolerance);
        let right = rdp_simplify(&points[max_idx..], tolerance);

        left.pop(); // Remove duplicate point at split
        left.extend(right);
        left
    } else {
        vec![first, last]
    }
}

/// Perpendicular distance from a point to a line defined by two points.
fn perpendicular_distance(point: Point, line_start: Point, line_end: Point) -> f64 {
    let dx = line_end.x - line_start.x;
    let dy = line_end.y - line_start.y;
    let len_sq = dx * dx + dy * dy;

    if len_sq < 1e-20 {
        // Degenerate line
        return ((point.x - line_start.x).powi(2) + (point.y - line_start.y).powi(2)).sqrt();
    }

    let numerator = ((line_end.x - line_start.x) * (line_start.y - point.y)
        - (line_start.x - point.x) * (line_end.y - line_start.y))
        .abs();

    numerator / len_sq.sqrt()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_contours_empty() {
        let raster = LayerRaster {
            grid: vec![0.0; 25],
            width: 5,
            height: 5,
            origin: Point::new(0.0, 0.0),
            resolution: 1.0,
        };

        let contours = extract_contours(&raster, 0.5);
        assert!(contours.is_empty());
    }

    #[test]
    fn test_extract_contours_filled_block() {
        // Create a 10x10 grid with a 6x6 filled block in the center
        let mut grid = vec![0.0f32; 100];
        for row in 2..8 {
            for col in 2..8 {
                grid[row * 10 + col] = 1.0;
            }
        }

        let raster = LayerRaster {
            grid,
            width: 10,
            height: 10,
            origin: Point::new(0.0, 0.0),
            resolution: 1.0,
        };

        let contours = extract_contours(&raster, 0.5);
        assert!(!contours.is_empty(), "Should extract at least one contour");

        // The contour should have non-zero area
        let total_area: f64 = contours.iter().map(|p| p.area()).sum();
        assert!(total_area > 0.0, "Contour should have positive area");
    }

    #[test]
    fn test_rdp_simplify() {
        let points = vec![
            Point::new(0.0, 0.0),
            Point::new(1.0, 0.001), // Nearly collinear
            Point::new(2.0, 0.0),
            Point::new(2.0, 2.0),
            Point::new(0.0, 2.0),
        ];

        let simplified = rdp_simplify(&points, 0.01);
        // The nearly-collinear point should be removed
        assert!(simplified.len() < points.len());
    }
}
