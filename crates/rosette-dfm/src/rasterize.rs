//! Rasterization of polygon geometry onto pixel grids.
//!
//! Converts vector geometry (polygons) into a binary pixel grid for
//! fabrication prediction models to operate on.

use std::collections::HashMap;

use rosette_core::cell::Element;
use rosette_core::hierarchy::{HierarchyEvent, WalkControl, walk_hierarchy};
use rosette_core::path::stroke_path_transformed;
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

/// A rasterized single-layer grid.
///
/// Pixels are stored as `f32` values in the range `[0.0, 1.0]`.
/// Input rasters from rasterization are binary (0.0 or 1.0).
/// Prediction models may produce continuous values representing
/// fabrication probability, which are then binarized at a chosen
/// threshold during contour extraction.
#[derive(Debug, Clone)]
pub struct LayerRaster {
    /// Pixel data: 0.0 = empty, 1.0 = filled, intermediate = partial.
    pub grid: Vec<f32>,
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
            grid: vec![0.0; width * height],
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
    pub fn get(&self, col: usize, row: usize) -> f32 {
        self.grid[row * self.width + col]
    }

    /// Set pixel at (col, row).
    #[inline]
    pub fn set(&mut self, col: usize, row: usize, value: f32) {
        self.grid[row * self.width + col] = value;
    }

    /// Total number of pixels.
    pub fn pixel_count(&self) -> usize {
        self.width * self.height
    }

    /// Count of filled pixels (value >= 0.5).
    pub fn filled_count(&self) -> usize {
        self.grid.iter().filter(|&&v| v >= 0.5).count()
    }

    /// Binarize the raster at the given threshold.
    ///
    /// Returns a new raster where pixels >= threshold become 1.0
    /// and pixels below become 0.0.
    pub fn binarize(&self, threshold: f32) -> Self {
        Self {
            grid: self
                .grid
                .iter()
                .map(|&v| if v >= threshold { 1.0 } else { 0.0 })
                .collect(),
            width: self.width,
            height: self.height,
            origin: self.origin,
            resolution: self.resolution,
        }
    }

    /// Whether this raster contains only binary values (0.0 or 1.0).
    pub fn is_binary(&self) -> bool {
        self.grid.iter().all(|&v| v == 0.0 || v == 1.0)
    }
}

/// Flatten a cell hierarchy into polygons grouped by layer.
///
/// This is analogous to the DRC runner's flatten_cell but returns owned polygons.
/// Placements that cannot be represented after transformation are skipped.
pub fn flatten_cell(
    cell: &Cell,
    library: Option<&Library>,
    transform: &Transform,
) -> HashMap<Layer, Vec<Polygon>> {
    let mut result: HashMap<Layer, Vec<Polygon>> = HashMap::new();

    let mut add_element = |element: &Element, placement: Transform| match element {
        Element::Polygon { polygon, layer } => {
            if let Some(polygon) = polygon.try_transform(&placement) {
                result.entry(*layer).or_default().push(polygon);
            }
        }
        Element::Path {
            points,
            width,
            layer,
            end_type,
        } => {
            if let Some(polygon) = stroke_path_transformed(points, *width, *end_type, &placement) {
                result.entry(*layer).or_default().push(polygon);
            }
        }
        Element::Text { .. } | Element::CellRef(_) => {}
    };

    if let Some(library) = library {
        walk_hierarchy(library, cell, *transform, |event| {
            if let HierarchyEvent::Element(placed) = event {
                add_element(placed.element, placed.placement.transform);
            }
            WalkControl::Continue
        });
    } else {
        for element in cell.elements() {
            add_element(element, *transform);
        }
    }

    result
}

/// Rasterize polygons onto a layer raster using scanline fill.
///
/// Uses the even-odd fill rule: a pixel is considered inside the polygon
/// if a ray from it crosses an odd number of polygon edges. This correctly
/// handles simple polygons but may produce unexpected results for
/// self-intersecting polygons (use DRC self-intersection check to catch those).
///
/// Degenerate polygons (fewer than 3 vertices) are silently skipped.
pub fn rasterize_polygons(raster: &mut LayerRaster, polygons: &[Polygon]) {
    for polygon in polygons {
        rasterize_polygon(raster, polygon);
    }
}

/// Rasterize a single polygon using even-odd scanline fill.
///
/// Skips degenerate polygons with fewer than 3 vertices.
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
                raster.set(col, row, 1.0);
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
    use rosette_core::{CellRef, PathEndType};

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
        assert_eq!(raster.get(mid_col, mid_row), 1.0);
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

    #[test]
    fn flatten_expands_arefs_and_strokes_before_transforming() {
        let layer = Layer::new(1, 0);
        let mut child = Cell::new("child");
        child.add_path(
            vec![Point::origin(), Point::new(10.0, 0.0)],
            2.0,
            layer,
            PathEndType::HalfWidthExtension,
        );
        let mut top = Cell::new("top");
        top.add_ref(
            CellRef::with_transform("child", Transform::scale(2.0, 3.0)).array(2, 1, 20.0, 0.0),
        );
        let mut library = Library::new("test");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let flattened = flatten_cell(
            library.cell("top").unwrap(),
            Some(&library),
            &Transform::identity(),
        );
        let polygons = &flattened[&layer];
        assert_eq!(polygons.len(), 2);
        let bounds: Vec<_> = polygons
            .iter()
            .map(|polygon| {
                let bbox = polygon.bbox();
                (bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y)
            })
            .collect();
        assert_eq!(
            bounds,
            vec![(-2.0, -3.0, 22.0, 3.0), (38.0, -3.0, 62.0, 3.0)]
        );
    }

    #[test]
    fn flatten_stops_at_cycles() {
        let layer = Layer::new(1, 0);
        let mut cell = Cell::new("cycle");
        cell.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), layer);
        cell.add_ref(CellRef::new("cycle"));
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();

        let flattened = flatten_cell(
            library.cell("cycle").unwrap(),
            Some(&library),
            &Transform::identity(),
        );
        assert_eq!(flattened[&layer].len(), 1);
    }

    #[test]
    fn flatten_skips_polygon_transform_overflow() {
        let kept_layer = Layer::new(1, 0);
        let skipped_layer = Layer::new(2, 0);
        let mut leaf = Cell::new("leaf");
        leaf.add_polygon(Polygon::rect(Point::new(2.0, 0.0), 1.0, 1.0), skipped_layer);
        let mut middle = Cell::new("middle");
        middle.add_ref(CellRef::new("leaf").scale(f64::MAX));
        let mut top = Cell::new("top");
        top.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), kept_layer);
        top.add_ref(CellRef::new("middle").scale(f64::MAX));
        let mut library = Library::new("test");
        library.add_cell(leaf).unwrap();
        library.add_cell(middle).unwrap();
        library.add_cell(top).unwrap();

        let flattened = flatten_cell(
            library.cell("top").unwrap(),
            Some(&library),
            &Transform::identity(),
        );
        assert_eq!(flattened[&kept_layer].len(), 1);
        assert!(!flattened.contains_key(&skipped_layer));
    }
}
