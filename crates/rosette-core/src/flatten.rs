//! Library flattening for rendering.
//!
//! This module provides functionality to flatten a hierarchical [`Library`] into
//! a simple list of polygons, suitable for rendering in the web viewer.
//!
//! Flattening:
//! - Expands all cell references with their transforms applied
//! - Converts path elements to polygon ribbons
//! - Applies a uniform scale factor (e.g., μm → nm conversion)
//! - Skips text elements (not rendered in viewer)

use crate::cell::Element;
use crate::geometry::{Point, Polygon, Transform, offset_polygon};
use crate::layer::Layer;
use crate::{Cell, Library};

/// A flattened polygon with layer information.
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct FlatPolygon {
    /// Vertices as flat array [x0, y0, x1, y1, ...]
    #[cfg_attr(feature = "serde", serde(rename = "v"))]
    pub vertices: Vec<f64>,
    /// Layer number
    #[cfg_attr(feature = "serde", serde(rename = "l"))]
    pub layer: u16,
    /// Datatype number
    #[cfg_attr(feature = "serde", serde(rename = "d"))]
    pub datatype: u16,
    /// Instance group ID — polygons from the same top-level CellRef share this ID.
    /// `None` for polygons that belong directly to the cell being flattened (not from a ref).
    #[cfg_attr(
        feature = "serde",
        serde(rename = "g", default, skip_serializing_if = "Option::is_none")
    )]
    pub group: Option<u32>,
}

/// Result of flattening a library.
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct FlatGeometry {
    /// All polygons in the flattened design
    pub polygons: Vec<FlatPolygon>,
}

impl FlatGeometry {
    /// Create an empty flat geometry.
    fn new() -> Self {
        Self {
            polygons: Vec::new(),
        }
    }

    /// Add a polygon to the flat geometry.
    fn add_polygon(&mut self, polygon: &Polygon, layer: &Layer, group: Option<u32>) {
        let vertices: Vec<f64> = polygon.vertices().iter().flat_map(|p| [p.x, p.y]).collect();

        if vertices.len() >= 6 {
            self.polygons.push(FlatPolygon {
                vertices,
                layer: layer.number,
                datatype: layer.datatype,
                group,
            });
        }
    }
}

impl Default for FlatGeometry {
    fn default() -> Self {
        Self::new()
    }
}

/// Flatten a library into a simple polygon list.
///
/// This function:
/// - Starts from the top cell (last added cell)
/// - Recursively expands all cell references with their transforms
/// - Converts path elements to polygon ribbons
/// - Applies the given scale factor to all coordinates
/// - Skips text elements
///
/// # Arguments
/// * `library` - The library to flatten
/// * `scale` - Scale factor to apply (e.g., 1000.0 for μm → nm)
///
/// # Returns
/// A [`FlatGeometry`] containing all polygons ready for rendering.
pub fn flatten_library(library: &Library, scale: f64) -> FlatGeometry {
    let mut result = FlatGeometry::new();
    let mut next_group: u32 = 0;

    let scale_transform = Transform::scale(scale, scale);

    if let Some(top_cell) = library.top_cell() {
        flatten_cell_recursive(
            &mut result,
            top_cell,
            library,
            &scale_transform,
            None,
            &mut next_group,
        );
    }

    result
}

/// Flatten a specific cell (by name) into a polygon list.
///
/// Like [`flatten_library`], but starts from a named cell instead of the
/// top cell. Returns `None` if the cell is not found in the library.
///
/// The named cell is fully resolved: all `CellRef` elements are recursively
/// expanded with their transforms applied.
///
/// # Arguments
/// * `library` - The library containing the cell and its dependencies
/// * `cell_name` - Name of the cell to flatten
/// * `scale` - Scale factor to apply (e.g., 1000.0 for μm → nm)
pub fn flatten_cell(library: &Library, cell_name: &str, scale: f64) -> Option<FlatGeometry> {
    let cell = library.cell(cell_name)?;
    let mut result = FlatGeometry::new();
    let mut next_group: u32 = 0;
    let scale_transform = Transform::scale(scale, scale);
    flatten_cell_recursive(
        &mut result,
        cell,
        library,
        &scale_transform,
        None,
        &mut next_group,
    );
    Some(result)
}

/// Recursively flatten a cell and all its references into polygons.
///
/// `current_group` is the instance group ID for all polygons in this subtree.
/// `None` means we're at the top level (direct elements of the cell being flattened).
/// When we hit a CellRef at the top level, we allocate a new group ID so all
/// polygons from that instance share the same group.
fn flatten_cell_recursive(
    result: &mut FlatGeometry,
    cell: &Cell,
    library: &Library,
    transform: &Transform,
    current_group: Option<u32>,
    next_group: &mut u32,
) {
    for element in cell.elements() {
        match element {
            Element::Polygon { polygon, layer } => {
                let transformed = polygon.transform(transform);
                result.add_polygon(&transformed, layer, current_group);
            }
            Element::Path {
                points,
                width,
                layer,
                ..
            } => {
                // Transform path points
                let transformed_points: Vec<Point> =
                    points.iter().map(|p| transform.apply(*p)).collect();

                // Scale width by the transform's scale factor
                let scale = (transform.a.powi(2) + transform.c.powi(2)).sqrt();
                let scaled_width = *width * scale;

                // Convert to polygon ribbon
                if let Some(ribbon) = offset_polygon(&transformed_points, scaled_width) {
                    result.add_polygon(&ribbon, layer, current_group);
                }
            }
            Element::CellRef(cell_ref) => {
                // Find the referenced cell and recurse with combined transform.
                // If we're at the top level (no group yet), assign a new group ID
                // for this cell reference instance so all its polygons can be
                // selected together.
                if let Some(ref_cell) = library.cell(&cell_ref.cell_name) {
                    let transforms = match &cell_ref.repetition {
                        None => vec![cell_ref.transform],
                        Some(rep) if rep.is_single() => vec![cell_ref.transform],
                        Some(rep) => {
                            // AREF pitch vectors are defined in the CellRef's local
                            // space (pre-transform), matching GDS writer semantics.
                            // Apply the translation BEFORE the CellRef transform so
                            // that a rotated/mirrored/scaled AREF's copies are
                            // placed along the transformed lattice vectors.
                            let mut ts = Vec::with_capacity(rep.count());
                            for row in 0..rep.rows {
                                for col in 0..rep.columns {
                                    let offset = rep.copy_offset(col, row);
                                    ts.push(
                                        cell_ref
                                            .transform
                                            .then(&Transform::translate(offset.x, offset.y)),
                                    );
                                }
                            }
                            ts
                        }
                    };
                    let group = current_group.or_else(|| {
                        let id = *next_group;
                        *next_group += 1;
                        Some(id)
                    });
                    for copy_transform in transforms {
                        let combined = transform.then(&copy_transform);
                        flatten_cell_recursive(
                            result, ref_cell, library, &combined, group, next_group,
                        );
                    }
                }
            }
            Element::Text { .. } => {
                // Skip text elements for rendering
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{Cell, CellRef, Layer, Library, PathEndType, Point, Polygon};

    fn flat_bbox(vertices: &[f64]) -> (f64, f64, f64, f64) {
        let mut min_x = f64::INFINITY;
        let mut min_y = f64::INFINITY;
        let mut max_x = f64::NEG_INFINITY;
        let mut max_y = f64::NEG_INFINITY;
        for point in vertices.chunks_exact(2) {
            min_x = min_x.min(point[0]);
            min_y = min_y.min(point[1]);
            max_x = max_x.max(point[0]);
            max_y = max_y.max(point[1]);
        }
        (min_x, min_y, max_x, max_y)
    }

    #[test]
    fn test_flatten_simple() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));

        let mut library = Library::new("test_lib");
        library.add_cell(cell).unwrap();

        let flat = flatten_library(&library, 1.0);
        assert_eq!(flat.polygons.len(), 1);
        assert_eq!(flat.polygons[0].layer, 1);
        assert_eq!(flat.polygons[0].datatype, 0);
        // Rectangle has 4 vertices = 8 coordinates
        assert_eq!(flat.polygons[0].vertices.len(), 8);
    }

    #[test]
    fn test_flatten_with_scale() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));

        let mut library = Library::new("test_lib");
        library.add_cell(cell).unwrap();

        let flat = flatten_library(&library, 1000.0);
        assert_eq!(flat.polygons.len(), 1);
        // Check that coordinates are scaled
        // Rectangle at (0,0) with width=10, height=5, scaled by 1000
        // Vertices should include 10000 and 5000
        assert!(flat.polygons[0].vertices.contains(&10000.0));
        assert!(flat.polygons[0].vertices.contains(&5000.0));
    }

    #[test]
    fn test_flatten_hierarchy() {
        // Create child cell
        let mut child = Cell::new("child");
        child.add_polygon(Polygon::rect(Point::origin(), 5.0, 5.0), Layer::new(1, 0));

        // Create top cell with reference
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("child").at(10.0, 20.0));

        let mut library = Library::new("test_lib");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let flat = flatten_library(&library, 1.0);
        assert_eq!(flat.polygons.len(), 1);
        // Check that the polygon was translated
        // Original rect at (0,0), translated by (10, 20)
        assert!(flat.polygons[0].vertices.contains(&10.0));
        assert!(flat.polygons[0].vertices.contains(&20.0));
    }

    #[test]
    fn test_flatten_rotated_aref_pitch_is_local() {
        // Regression test for ROS-517.
        //
        // For a rotated AREF the pitch vector is defined in the CellRef's
        // local space and must be rotated into world space, matching the
        // GDS writer. A 2×1 array of a point-like child with
        // `col_spacing = 10`, rotated 90° ccw, should place the second copy
        // at world (0, 10) — NOT at world (10, 0) (which would correspond
        // to applying the pitch in the parent frame, i.e. the old bug).
        use crate::CellRef;

        let mut child = Cell::new("dot");
        // A small rectangle centered on the origin so we can read back the
        // approximate placement from vertex extents.
        child.add_polygon(
            Polygon::rect(Point::new(-0.5, -0.5), 1.0, 1.0),
            Layer::new(1, 0),
        );

        let mut top = Cell::new("top");
        top.add_ref(
            CellRef::new("dot")
                .rotate(std::f64::consts::FRAC_PI_2)
                .array(2, 1, 10.0, 0.0),
        );

        let mut library = Library::new("lib");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let flat = flatten_library(&library, 1.0);
        assert_eq!(flat.polygons.len(), 2);

        // Compute the per-polygon centroid (each polygon is a ~1×1 rect,
        // so the centroid is effectively its placement point).
        let centroid = |p: &FlatPolygon| {
            let mut sx = 0.0;
            let mut sy = 0.0;
            let n = (p.vertices.len() / 2) as f64;
            for chunk in p.vertices.chunks_exact(2) {
                sx += chunk[0];
                sy += chunk[1];
            }
            (sx / n, sy / n)
        };

        let mut centers: Vec<(f64, f64)> = flat.polygons.iter().map(centroid).collect();
        // Sort by y so we have a deterministic ordering independent of
        // flatten's traversal.
        centers.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap());

        // Expected: copies at (0, 0) and (0, 10) in world space.
        assert!(
            (centers[0].0 - 0.0).abs() < 1e-9,
            "copy0.x = {}",
            centers[0].0
        );
        assert!(
            (centers[0].1 - 0.0).abs() < 1e-9,
            "copy0.y = {}",
            centers[0].1
        );
        assert!(
            (centers[1].0 - 0.0).abs() < 1e-9,
            "copy1.x = {}",
            centers[1].0
        );
        assert!(
            (centers[1].1 - 10.0).abs() < 1e-9,
            "copy1.y = {}",
            centers[1].1
        );
    }

    #[test]
    fn test_flatten_path_end_types_currently_share_geometry() {
        let points = vec![Point::origin(), Point::new(10.0, 0.0)];
        let mut cell = Cell::new("paths");
        cell.add_path(points.clone(), 2.0, Layer::new(1, 0), PathEndType::Flush);
        cell.add_path(points.clone(), 2.0, Layer::new(2, 0), PathEndType::Round);
        cell.add_path(
            points,
            2.0,
            Layer::new(3, 0),
            PathEndType::HalfWidthExtension,
        );
        let mut library = Library::new("paths");
        library.add_cell(cell).unwrap();

        let flat = flatten_library(&library, 1.0);
        assert_eq!(flat.polygons.len(), 3);
        assert_eq!(flat.polygons[0].vertices, flat.polygons[1].vertices);
        assert_eq!(flat.polygons[0].vertices, flat.polygons[2].vertices);
        assert_eq!(
            flat_bbox(&flat.polygons[0].vertices),
            (0.0, -1.0, 10.0, 1.0)
        );
    }

    #[test]
    fn test_flatten_reflected_path_characterization() {
        let mut child = Cell::new("path");
        child.add_path_simple(
            vec![
                Point::origin(),
                Point::new(10.0, 0.0),
                Point::new(10.0, 10.0),
            ],
            2.0,
            Layer::new(1, 0),
        );
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("path").mirror_x());
        let mut library = Library::new("reflected");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let flat = flatten_library(&library, 1.0);
        assert_eq!(flat.polygons.len(), 1);
        let bbox = flat_bbox(&flat.polygons[0].vertices);
        assert_eq!(bbox, (0.0, -10.0, 11.0, 1.0));
    }

    #[test]
    fn test_flatten_uniform_path_scale_scales_width() {
        let mut child = Cell::new("path");
        child.add_path_simple(
            vec![Point::origin(), Point::new(10.0, 0.0)],
            2.0,
            Layer::new(1, 0),
        );
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("path").scale(2.0));
        let mut library = Library::new("scaled");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let flat = flatten_library(&library, 1.0);
        assert_eq!(
            flat_bbox(&flat.polygons[0].vertices),
            (0.0, -2.0, 20.0, 2.0)
        );
    }

    #[test]
    fn test_nonuniform_path_scale_currently_differs_from_bbox() {
        let mut child = Cell::new("path");
        child.add_path_simple(
            vec![Point::origin(), Point::new(10.0, 0.0)],
            2.0,
            Layer::new(1, 0),
        );
        let mut top = Cell::new("top");
        top.add_ref(CellRef::with_transform("path", Transform::scale(2.0, 3.0)));
        let mut library = Library::new("scaled");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let flat = flatten_library(&library, 1.0);
        assert_eq!(
            flat_bbox(&flat.polygons[0].vertices),
            (0.0, -2.0, 20.0, 2.0)
        );

        let bbox = library.cell_bbox("top").unwrap();
        assert_eq!(
            (bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y),
            (0.0, -3.0, 20.0, 3.0)
        );
    }
}
