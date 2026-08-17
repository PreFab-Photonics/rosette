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

use std::collections::HashMap;

use rosette_core::cell::Element;
use rosette_core::hierarchy::{HierarchyEvent, WalkControl, walk_hierarchy};
use rosette_core::path::stroke_path_transformed_with_scale;
use rosette_core::{Cell, Layer, Library, Polygon, Transform};

/// A flattened polygon with layer information.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct FlatPolygon {
    /// Vertices as flat array [x0, y0, x1, y1, ...]
    #[serde(rename = "v")]
    pub vertices: Vec<f64>,
    /// Layer number
    #[serde(rename = "l")]
    pub layer: u16,
    /// Datatype number
    #[serde(rename = "d")]
    pub datatype: u16,
    /// Instance group ID — polygons from the same top-level CellRef share this ID.
    /// `None` for polygons that belong directly to the cell being flattened (not from a ref).
    #[serde(rename = "g", default, skip_serializing_if = "Option::is_none")]
    pub group: Option<u32>,
}

/// Result of flattening a library.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
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
/// - Starts from the explicit or unique top cell when available
/// - Otherwise includes every graph-derived root in a multi-root library
/// - Recursively expands all cell references with their transforms
/// - Converts path elements to polygon ribbons
/// - Applies the given scale factor to all coordinates
/// - Skips text elements
/// - Skips placements whose accumulated transform produces non-finite geometry
///
/// # Arguments
/// * `library` - The library to flatten
/// * `scale` - Scale factor to apply (e.g., 1000.0 for μm → nm)
///
/// # Returns
/// A [`FlatGeometry`] containing all polygons ready for rendering.
pub fn flatten_library(library: &Library, scale: f64) -> FlatGeometry {
    let mut result = FlatGeometry::new();
    let scale_transform = Transform::scale(scale, scale);
    let mut next_group = 0;

    if let Some(top_cell) = library.top_cell() {
        flatten_placed_cell(
            &mut result,
            top_cell,
            library,
            scale_transform,
            scale.abs(),
            &mut next_group,
        );
    } else {
        let roots = library.roots();
        if roots.is_empty() {
            if let Some(cell) = library.cells().first() {
                flatten_placed_cell(
                    &mut result,
                    cell,
                    library,
                    scale_transform,
                    scale.abs(),
                    &mut next_group,
                );
            }
        } else {
            for root in roots {
                flatten_placed_cell(
                    &mut result,
                    root,
                    library,
                    scale_transform,
                    scale.abs(),
                    &mut next_group,
                );
            }
        }
    }

    result
}

/// Flatten a specific cell (by name) into a polygon list.
///
/// Like [`flatten_library`], but starts from one named cell instead of the
/// library's default root selection. Returns `None` if the cell is not found.
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
    let scale_transform = Transform::scale(scale, scale);
    let mut next_group = 0;
    flatten_placed_cell(
        &mut result,
        cell,
        library,
        scale_transform,
        scale.abs(),
        &mut next_group,
    );
    Some(result)
}

fn flatten_placed_cell(
    result: &mut FlatGeometry,
    root: &Cell,
    library: &Library,
    root_transform: Transform,
    absolute_width_scale: f64,
    next_group: &mut u32,
) {
    let mut groups = HashMap::<usize, u32>::new();
    walk_hierarchy(library, root, root_transform, |event| {
        if let HierarchyEvent::Enter(placement) = event
            && let Some(step) = placement.path.first()
        {
            groups.entry(step.element_index).or_insert_with(|| {
                let group = *next_group;
                *next_group += 1;
                group
            });
        }
        let HierarchyEvent::Element(placed) = event else {
            return WalkControl::Continue;
        };
        let group = placed
            .placement
            .path
            .first()
            .and_then(|step| groups.get(&step.element_index).copied());
        match placed.element {
            Element::Polygon { polygon, layer } => {
                if let Some(transformed) = polygon.try_transform(&placed.placement.transform) {
                    result.add_polygon(&transformed, layer, group);
                }
            }
            Element::Path {
                points,
                width,
                layer,
                end_type,
            } => {
                if let Some(ribbon) = stroke_path_transformed_with_scale(
                    points,
                    *width,
                    *end_type,
                    &placed.placement.transform,
                    absolute_width_scale,
                ) {
                    result.add_polygon(&ribbon, layer, group);
                }
            }
            Element::Text { .. } | Element::CellRef(_) => {}
        }
        WalkControl::Continue
    });
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::{Cell, CellRef, Layer, Library, PathEndType, Point, Polygon};

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
    fn flatten_skips_polygon_transform_overflow() {
        let mut leaf = Cell::new("leaf");
        leaf.add_polygon(
            Polygon::rect(Point::new(2.0, 0.0), 1.0, 1.0),
            Layer::new(2, 0),
        );
        let mut middle = Cell::new("middle");
        middle.add_ref(CellRef::new("leaf").scale(f64::MAX));
        let mut top = Cell::new("top");
        top.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));
        top.add_ref(CellRef::new("middle").scale(f64::MAX));
        let mut library = Library::new("test");
        library.add_cell(leaf).unwrap();
        library.add_cell(middle).unwrap();
        library.add_cell(top).unwrap();

        let flat = flatten_library(&library, 1.0);
        assert_eq!(flat.polygons.len(), 1);
        assert_eq!(flat.polygons[0].layer, 1);
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
    fn multi_root_flattening_includes_all_roots_unless_top_is_selected() {
        let mut child_a = Cell::new("child_a");
        child_a.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));
        let mut child_b = Cell::new("child_b");
        child_b.add_polygon(
            Polygon::rect(Point::new(10.0, 0.0), 1.0, 1.0),
            Layer::new(2, 0),
        );
        let mut root_a = Cell::new("root_a");
        root_a.add_ref(CellRef::new("child_a"));
        let mut root_b = Cell::new("root_b");
        root_b.add_ref(CellRef::new("child_b"));
        let mut library = Library::new("multi");
        library.add_cell(child_a).unwrap();
        library.add_cell(child_b).unwrap();
        library.add_cell(root_a).unwrap();
        library.add_cell(root_b).unwrap();

        let all = flatten_library(&library, 1.0);
        assert_eq!(all.polygons.len(), 2);
        assert_eq!(
            all.polygons
                .iter()
                .map(|polygon| polygon.group)
                .collect::<Vec<_>>(),
            vec![Some(0), Some(1)]
        );

        library.set_top_cell("root_b").unwrap();
        let selected = flatten_library(&library, 1.0);
        assert_eq!(selected.polygons.len(), 1);
        assert_eq!(selected.polygons[0].layer, 2);
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
        use rosette_core::CellRef;

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
    fn test_flatten_path_end_types_have_distinct_geometry() {
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
        assert_eq!(
            flat_bbox(&flat.polygons[0].vertices),
            (0.0, -1.0, 10.0, 1.0)
        );
        assert_eq!(
            flat_bbox(&flat.polygons[1].vertices),
            (-1.0, -1.0, 11.0, 1.0)
        );
        assert_eq!(
            flat_bbox(&flat.polygons[2].vertices),
            (-1.0, -1.0, 11.0, 1.0)
        );
    }

    #[test]
    fn test_flatten_reflected_path_characterization() {
        let mut child = Cell::new("path");
        child.add_path(
            vec![
                Point::origin(),
                Point::new(10.0, 0.0),
                Point::new(10.0, 10.0),
            ],
            2.0,
            Layer::new(1, 0),
            rosette_core::PathEndType::default(),
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
        child.add_path(
            vec![Point::origin(), Point::new(10.0, 0.0)],
            2.0,
            Layer::new(1, 0),
            rosette_core::PathEndType::default(),
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
    fn test_nonuniform_path_scale_matches_bbox() {
        let mut child = Cell::new("path");
        child.add_path(
            vec![Point::origin(), Point::new(10.0, 0.0)],
            2.0,
            Layer::new(1, 0),
            rosette_core::PathEndType::default(),
        );
        let mut top = Cell::new("top");
        top.add_ref(CellRef::with_transform("path", Transform::scale(2.0, 3.0)));
        let mut library = Library::new("scaled");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let flat = flatten_library(&library, 1.0);
        assert_eq!(
            flat_bbox(&flat.polygons[0].vertices),
            (0.0, -3.0, 20.0, 3.0)
        );

        let bbox = rosette_core::hierarchy::cell_bbox(&library, "top").unwrap();
        assert_eq!(
            (bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y),
            (0.0, -3.0, 20.0, 3.0)
        );
    }

    #[test]
    fn test_negative_gds_path_width_is_absolute() {
        let mut child = Cell::new("path");
        child.add_path(
            vec![Point::origin(), Point::new(10.0, 0.0)],
            -2.0,
            Layer::new(1, 0),
            rosette_core::PathEndType::default(),
        );
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("path").scale(3.0));
        let mut library = Library::new("scaled");
        library.add_cell(child).unwrap();
        library.add_cell(top).unwrap();

        let flat = flatten_library(&library, 1.0);
        assert_eq!(
            flat_bbox(&flat.polygons[0].vertices),
            (0.0, -1.0, 30.0, 1.0)
        );

        let scaled_units = flatten_library(&library, 1000.0);
        assert_eq!(
            flat_bbox(&scaled_units.polygons[0].vertices),
            (0.0, -1000.0, 30000.0, 1000.0)
        );
    }

    #[test]
    fn test_flatten_cycle_stops_at_back_edge() {
        let mut cell = Cell::new("cycle");
        cell.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));
        cell.add_ref(CellRef::new("cycle").at(10.0, 0.0));
        let mut library = Library::new("cycle");
        library.add_cell(cell).unwrap();

        let flat = flatten_library(&library, 1.0);
        assert_eq!(flat.polygons.len(), 1);
        assert_eq!(flat_bbox(&flat.polygons[0].vertices), (0.0, 0.0, 1.0, 1.0));
    }
}
