//! Rasterization of polygon geometry onto pixel grids.
//!
//! Converts vector geometry (polygons) into a binary pixel grid for
//! fabrication prediction models to operate on.

use std::collections::HashMap;

use rosette_core::{BBox, Cell, Layer, Library, Point, Polygon, Transform};

/// Configuration for rasterization.
#[derive(Debug, Clone)]
pub struct RasterConfig {
    /// Pixel size in design units (e.g., 0.01 um).
    pub resolution: f64,
    /// Padding around cell bounding box in design units.
    pub padding: f64,
}

impl Default for RasterConfig {
    fn default() -> Self {
        Self {
            resolution: 0.01,
            padding: 1.0,
        }
    }
}

/// A rasterized single-layer binary grid.
///
/// Pixels are stored as `u8` (0 = empty, 1 = filled) for memory efficiency.
/// A 10k x 10k grid uses ~100 MB with f64 but only ~100 MB / 8 ≈ 12.5 MB with u8.
#[derive(Debug, Clone)]
pub struct LayerRaster {
    /// Pixel data: 1 = filled, 0 = empty.
    pub grid: Vec<u8>,
    /// Grid width in pixels.
    pub width: usize,
    /// Grid height in pixels.
    pub height: usize,
    /// Origin point in design units (bottom-left corner of grid).
    pub origin: Point,
    /// Pixel size in design units.
    pub resolution: f64,
}

impl LayerRaster {
    /// Create a new empty raster covering the given bounding box.
    pub fn from_bbox(bbox: &BBox, config: &RasterConfig) -> Self {
        let padded = bbox.expand_by(config.padding);
        let width = ((padded.width()) / config.resolution).ceil() as usize + 1;
        let height = ((padded.height()) / config.resolution).ceil() as usize + 1;

        Self {
            grid: vec![0; width * height],
            width,
            height,
            origin: padded.min(),
            resolution: config.resolution,
        }
    }

    /// Get the design-space point for the center of pixel (col, row).
    #[inline]
    pub fn pixel_center(&self, col: usize, row: usize) -> Point {
        Point::new(
            self.origin.x + (col as f64 + 0.5) * self.resolution,
            self.origin.y + (row as f64 + 0.5) * self.resolution,
        )
    }

    /// Get pixel value at (col, row).
    #[inline]
    pub fn get(&self, col: usize, row: usize) -> u8 {
        self.grid[row * self.width + col]
    }

    /// Set pixel at (col, row) to filled (1) or empty (0).
    #[inline]
    pub fn set(&mut self, col: usize, row: usize, value: u8) {
        self.grid[row * self.width + col] = value;
    }

    /// Total number of pixels.
    pub fn pixel_count(&self) -> usize {
        self.width * self.height
    }

    /// Count of filled pixels.
    pub fn filled_count(&self) -> usize {
        self.grid.iter().filter(|&&v| v != 0).count()
    }
}

/// Flatten a cell hierarchy into polygons grouped by layer.
///
/// This is analogous to the DRC runner's flatten_cell but returns owned polygons.
pub fn flatten_cell(
    cell: &Cell,
    library: Option<&Library>,
    transform: &Transform,
) -> HashMap<Layer, Vec<Polygon>> {
    let mut result: HashMap<Layer, Vec<Polygon>> = HashMap::new();

    // Add direct polygons
    for (polygon, layer) in cell.polygons() {
        let transformed = polygon.transform(transform);
        result.entry(*layer).or_default().push(transformed);
    }

    // Convert paths to polygons and add them
    for (points, width, layer, _end_type) in cell.paths() {
        let transformed_points: Vec<Point> = points.iter().map(|p| transform.apply(*p)).collect();
        // Use offset_polygon to convert path centerline + width to polygon
        if let Some(poly) = rosette_core::offset_polygon(&transformed_points, width) {
            result.entry(*layer).or_default().push(poly);
        }
    }

    // Recursively flatten cell references
    if let Some(lib) = library {
        for cell_ref in cell.cell_refs() {
            if let Some(ref_cell) = lib.cell(&cell_ref.cell_name) {
                let combined = transform.then(&cell_ref.transform);
                let child_polygons = flatten_cell(ref_cell, Some(lib), &combined);

                for (layer, polys) in child_polygons {
                    result.entry(layer).or_default().extend(polys);
                }
            }
        }
    }

    result
}

/// Rasterize polygons onto a layer raster using scanline fill.
///
/// For each row, finds polygon edge intersections and fills spans.
pub fn rasterize_polygons(raster: &mut LayerRaster, polygons: &[Polygon]) {
    for polygon in polygons {
        rasterize_polygon(raster, polygon);
    }
}

/// Rasterize a single polygon using scanline fill.
fn rasterize_polygon(raster: &mut LayerRaster, polygon: &Polygon) {
    let vertices = polygon.vertices();
    let n = vertices.len();
    if n < 3 {
        return;
    }

    // Compute polygon bbox in pixel space for early bounds
    let poly_bbox = polygon.bbox();
    let min_row = ((poly_bbox.min().y - raster.origin.y) / raster.resolution).floor() as isize;
    let max_row = ((poly_bbox.max().y - raster.origin.y) / raster.resolution).ceil() as isize;
    let min_row = min_row.max(0) as usize;
    let max_row = (max_row as usize).min(raster.height.saturating_sub(1));

    // Scanline fill: for each row, find edge intersections
    for row in min_row..=max_row {
        let y = raster.origin.y + (row as f64 + 0.5) * raster.resolution;

        // Collect x-intersections with all edges
        let mut intersections = Vec::new();
        for i in 0..n {
            let j = (i + 1) % n;
            let yi = vertices[i].y;
            let yj = vertices[j].y;

            // Check if scanline crosses this edge
            if (yi <= y && yj > y) || (yj <= y && yi > y) {
                let t = (y - yi) / (yj - yi);
                let x = vertices[i].x + t * (vertices[j].x - vertices[i].x);
                intersections.push(x);
            }
        }

        // Sort intersections and fill spans
        intersections.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));

        for pair in intersections.chunks_exact(2) {
            let x_start = pair[0];
            let x_end = pair[1];

            let col_start = ((x_start - raster.origin.x) / raster.resolution).ceil() as isize;
            let col_end = ((x_end - raster.origin.x) / raster.resolution).floor() as isize;

            let col_start = col_start.max(0) as usize;
            let col_end = (col_end as usize).min(raster.width.saturating_sub(1));

            for col in col_start..=col_end {
                raster.set(col, row, 1);
            }
        }
    }
}

/// Rasterize a cell on a specific layer.
pub fn rasterize_cell(
    cell: &Cell,
    library: Option<&Library>,
    layer: Layer,
    config: &RasterConfig,
) -> Option<LayerRaster> {
    let polygons_by_layer = flatten_cell(cell, library, &Transform::identity());
    let polygons = polygons_by_layer.get(&layer)?;

    if polygons.is_empty() {
        return None;
    }

    // Compute bounding box of all polygons on this layer
    let mut bbox = polygons[0].bbox();
    for poly in &polygons[1..] {
        bbox = bbox.merge(&poly.bbox());
    }

    let mut raster = LayerRaster::from_bbox(&bbox, config);
    rasterize_polygons(&mut raster, polygons);
    Some(raster)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rasterize_simple_rect() {
        let config = RasterConfig {
            resolution: 1.0,
            padding: 0.0,
        };

        // 4x4 rectangle at origin
        let poly = Polygon::rect(Point::new(0.0, 0.0), 4.0, 4.0);
        let bbox = poly.bbox();
        let mut raster = LayerRaster::from_bbox(&bbox, &config);
        rasterize_polygons(&mut raster, &[poly]);

        // Should have filled pixels inside
        assert!(raster.filled_count() > 0);
        // Center should be filled
        let mid_col = raster.width / 2;
        let mid_row = raster.height / 2;
        assert_eq!(raster.get(mid_col, mid_row), 1);
    }

    #[test]
    fn test_rasterize_cell() {
        let mut cell = Cell::new("test");
        let layer = Layer::new(1, 0);
        cell.add_polygon(Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0), layer);

        let config = RasterConfig {
            resolution: 1.0,
            padding: 1.0,
        };

        let raster = rasterize_cell(&cell, None, layer, &config).unwrap();
        assert!(raster.filled_count() > 0);
        assert!(raster.width > 10);
        assert!(raster.height > 10);
    }

    #[test]
    fn test_empty_layer() {
        let cell = Cell::new("empty");
        let config = RasterConfig::default();
        let result = rasterize_cell(&cell, None, Layer::new(1, 0), &config);
        assert!(result.is_none());
    }

    #[test]
    fn test_pixel_center() {
        let config = RasterConfig {
            resolution: 0.1,
            padding: 0.0,
        };
        let bbox = BBox::new(Point::new(0.0, 0.0), Point::new(1.0, 1.0));
        let raster = LayerRaster::from_bbox(&bbox, &config);

        let center = raster.pixel_center(0, 0);
        assert!((center.x - 0.05).abs() < 1e-10);
        assert!((center.y - 0.05).abs() < 1e-10);
    }
}
