//! Overlap checks (required and forbidden).
//!
//! Uses R-tree spatial indexing for the bulk forbidden-overlap check to avoid
//! O(n²) boolean intersection operations on well-separated polygons.

use geo::Area;
use geo::BooleanOps;
use rosette_core::{polygon_to_geo, BBox, Layer, Polygon};
use rstar::{PointDistance, RTree, RTreeObject, AABB};

use crate::violation::{DrcViolation, RuleType, Severity};

/// Wrapper for R-tree spatial indexing of polygons by bounding box.
#[derive(Clone)]
struct IndexedPolygon {
    index: usize,
    orig_index: usize,
    bbox: BBox,
}

impl RTreeObject for IndexedPolygon {
    type Envelope = AABB<[f64; 2]>;

    fn envelope(&self) -> Self::Envelope {
        AABB::from_corners(
            [self.bbox.min().x, self.bbox.min().y],
            [self.bbox.max().x, self.bbox.max().y],
        )
    }
}

impl PointDistance for IndexedPolygon {
    fn distance_2(&self, point: &[f64; 2]) -> f64 {
        let min = self.bbox.min();
        let max = self.bbox.max();

        let dx = if point[0] < min.x {
            min.x - point[0]
        } else if point[0] > max.x {
            point[0] - max.x
        } else {
            0.0
        };

        let dy = if point[1] < min.y {
            min.y - point[1]
        } else if point[1] > max.y {
            point[1] - max.y
        } else {
            0.0
        };

        dx * dx + dy * dy
    }
}

/// Bulk forbidden-overlap check using R-tree spatial indexing.
///
/// Only polygon pairs whose bounding boxes overlap are checked with the
/// expensive boolean intersection, making this much faster than O(n²) for
/// layouts where most polygons are spatially separated.
pub fn check_forbid_overlap_bulk(
    polygons1: &[(Polygon, usize)],
    layer1: Layer,
    polygons2: &[(Polygon, usize)],
    layer2: Layer,
    rule_name: Option<&str>,
    same_layer: bool,
) -> Vec<DrcViolation> {
    if polygons1.is_empty() || polygons2.is_empty() {
        return Vec::new();
    }

    // Build R-tree for second set of polygons
    let indexed: Vec<IndexedPolygon> = polygons2
        .iter()
        .enumerate()
        .map(|(i, (poly, orig_idx))| IndexedPolygon {
            index: i,
            orig_index: *orig_idx,
            bbox: poly.bbox(),
        })
        .collect();
    let tree = RTree::bulk_load(indexed);

    let mut violations = Vec::new();

    for (poly1, orig_idx1) in polygons1 {
        let bbox1 = poly1.bbox();
        // Query R-tree for polygons whose bbox overlaps with poly1's bbox
        let search_envelope = AABB::from_corners(
            [bbox1.min().x, bbox1.min().y],
            [bbox1.max().x, bbox1.max().y],
        );

        for candidate in tree.locate_in_envelope_intersecting(&search_envelope) {
            // Same-layer: skip self-comparison and duplicate pairs
            if same_layer && candidate.orig_index <= *orig_idx1 {
                continue;
            }

            let (poly2, _) = &polygons2[candidate.index];
            if let Some(v) = check_forbid_overlap(poly1, layer1, poly2, layer2, rule_name) {
                violations.push(v);
            }
        }
    }

    violations
}

/// Check that two polygons do not overlap (forbidden overlap).
pub fn check_forbid_overlap(
    poly1: &Polygon,
    layer1: Layer,
    poly2: &Polygon,
    layer2: Layer,
    rule_name: Option<&str>,
) -> Option<DrcViolation> {
    let geo1 = polygon_to_geo(poly1);
    let geo2 = polygon_to_geo(poly2);

    let intersection = geo1.intersection(&geo2);

    // Check if intersection has any area
    let has_overlap = intersection.unsigned_area() > 1e-10;

    if has_overlap {
        let mut violation = DrcViolation::new(
            RuleType::ForbiddenOverlap,
            poly1.bbox().merge(&poly2.bbox()),
            layer1,
            format!(
                "Forbidden overlap between Layer({}, {}) and Layer({}, {})",
                layer1.number, layer1.datatype, layer2.number, layer2.datatype
            ),
        )
        .with_layer2(layer2)
        .with_severity(Severity::Error);

        if let Some(name) = rule_name {
            violation = violation.with_name(name);
        }

        Some(violation)
    } else {
        None
    }
}

/// Check that two polygons overlap (required overlap).
///
/// Returns a violation if there is NO overlap.
pub fn check_require_overlap(
    poly1: &Polygon,
    layer1: Layer,
    poly2: &Polygon,
    layer2: Layer,
    rule_name: Option<&str>,
) -> Option<DrcViolation> {
    let geo1 = polygon_to_geo(poly1);
    let geo2 = polygon_to_geo(poly2);

    let intersection = geo1.intersection(&geo2);

    // Check if intersection has any area
    let has_overlap = intersection.unsigned_area() > 1e-10;

    if !has_overlap {
        let mut violation = DrcViolation::new(
            RuleType::MissingOverlap,
            poly1.bbox().merge(&poly2.bbox()),
            layer1,
            format!(
                "Required overlap missing between Layer({}, {}) and Layer({}, {})",
                layer1.number, layer1.datatype, layer2.number, layer2.datatype
            ),
        )
        .with_layer2(layer2)
        .with_severity(Severity::Error);

        if let Some(name) = rule_name {
            violation = violation.with_name(name);
        }

        Some(violation)
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::Point;

    #[test]
    fn test_no_overlap() {
        let poly1 = Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0);
        let poly2 = Polygon::rect(Point::new(10.0, 0.0), 5.0, 5.0);

        let result = check_forbid_overlap(&poly1, Layer::new(1, 0), &poly2, Layer::new(2, 0), None);
        assert!(result.is_none()); // No overlap, no violation

        let result =
            check_require_overlap(&poly1, Layer::new(1, 0), &poly2, Layer::new(2, 0), None);
        assert!(result.is_some()); // No overlap, violation for require
    }

    #[test]
    fn test_with_overlap() {
        let poly1 = Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0);
        let poly2 = Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0);

        let result = check_forbid_overlap(&poly1, Layer::new(1, 0), &poly2, Layer::new(2, 0), None);
        assert!(result.is_some()); // Overlap exists, violation for forbid

        let result =
            check_require_overlap(&poly1, Layer::new(1, 0), &poly2, Layer::new(2, 0), None);
        assert!(result.is_none()); // Overlap exists, no violation for require
    }
}
