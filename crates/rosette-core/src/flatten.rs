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
    pub fn new() -> Self {
        Self {
            polygons: Vec::new(),
        }
    }

    /// Add a polygon to the flat geometry.
    pub fn add_polygon(&mut self, polygon: &Polygon, layer: &Layer, group: Option<u32>) {
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
                            let mut ts = Vec::with_capacity(rep.count());
                            for row in 0..rep.rows {
                                for col in 0..rep.columns {
                                    let dx = col as f64 * rep.col_spacing;
                                    let dy = row as f64 * rep.row_spacing;
                                    ts.push(Transform::translate(dx, dy).then(&cell_ref.transform));
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
    use crate::{Cell, Layer, Library, Point, Polygon};

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
        use crate::CellRef;

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
}
