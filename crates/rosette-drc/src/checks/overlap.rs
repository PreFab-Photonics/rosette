//! Overlap checks (required and forbidden).
//!
//! Uses R-tree spatial indexing for the bulk forbidden-overlap check to avoid
//! O(n²) boolean intersection operations on well-separated polygons.

use geo::{Area, BooleanOps, BoundingRect, Intersects};
use rosette_core::{BBox, Layer, Point, Polygon, polygon_to_geo};
use rstar::{AABB, RTree};

use super::spatial::IndexedPolygon;
use crate::violation::{DrcViolation, RuleType, Severity};

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

    // Build R-tree for second set of polygons.
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

    // Lazily-memoized `geo` conversions of polygons2 (ROS-555). On dense
    // fixtures a single poly2 is a candidate across many poly1 queries;
    // caching avoids reconverting it each time. Lazy (rather than eager) so
    // sparse fixtures — where most poly2 are queried zero or one times — pay
    // only for the conversions they actually use.
    let mut geo2_cache: Vec<Option<geo::Polygon<f64>>> = vec![None; polygons2.len()];

    let mut violations = Vec::new();

    for (poly1, orig_idx1) in polygons1 {
        let bbox1 = poly1.bbox();
        // Query R-tree for polygons whose bbox overlaps with poly1's bbox
        let search_envelope = AABB::from_corners(
            [bbox1.min().x, bbox1.min().y],
            [bbox1.max().x, bbox1.max().y],
        );

        // Lift poly1's geo conversion out of the candidate loop — an R-tree
        // query on a dense fixture can return many candidates, and each one
        // previously reconverted poly1.
        let mut geo1 = None;

        for candidate in tree.locate_in_envelope_intersecting(&search_envelope) {
            // Same-layer: skip self-comparison and duplicate pairs
            if same_layer && candidate.orig_index <= *orig_idx1 {
                continue;
            }

            let (poly2, _) = &polygons2[candidate.index];
            // `get_or_insert_with` returns &mut T; inits on first use, memoized
            // thereafter. Inner shadow binds the deref so later uses read
            // the converted polygon, not the Option wrapper.
            let geo1 = geo1.get_or_insert_with(|| polygon_to_geo(poly1));
            let geo2 = geo2_cache[candidate.index].get_or_insert_with(|| polygon_to_geo(poly2));

            // Cheap predicate first: `Intersects` answers "do they touch at
            // all?" without materializing the intersection polygon. In the
            // passing case (bboxes overlap but geometry doesn't) this avoids
            // the expensive `BooleanOps::intersection` entirely — the common
            // case for forbid_overlap, which has no early exit otherwise.
            if !geo1.intersects(&*geo2) {
                continue;
            }

            // They intersect — now compute the actual intersection so we can
            // report a precise area and location. Filter out boundary-only
            // (zero-area) touches, which are not forbidden overlaps.
            let intersection = geo1.intersection(&*geo2);
            let overlap_area = intersection.unsigned_area();
            if overlap_area <= 1e-10 {
                continue;
            }

            // Use the intersection's bounding rect as the violation location
            // (much more precise than the union of both polygons' bboxes).
            let location = intersection
                .bounding_rect()
                .map(|r| {
                    BBox::new(
                        Point::new(r.min().x, r.min().y),
                        Point::new(r.max().x, r.max().y),
                    )
                })
                .unwrap_or_else(|| poly1.bbox().merge(&poly2.bbox()));

            let message = format!(
                "Forbidden overlap ({:.3} um²) at ({:.1}, {:.1}) to ({:.1}, {:.1})",
                overlap_area,
                location.min().x,
                location.min().y,
                location.max().x,
                location.max().y,
            );

            let mut violation =
                DrcViolation::new(RuleType::ForbiddenOverlap, location, layer1, message)
                    .with_layer2(layer2)
                    .with_severity(Severity::Error)
                    .with_polygon_idx(*orig_idx1)
                    .with_polygon_idx2(candidate.orig_index);

            if let Some(name) = rule_name {
                violation = violation.with_name(name);
            }

            violations.push(violation);
        }
    }

    violations
}

/// Check that two polygons do not overlap (forbidden overlap).
///
/// Single-pair entry point. The hot path goes through
/// [`check_forbid_overlap_bulk`], which inlines this logic to avoid
/// re-converting `poly1` to its `geo` representation per candidate.
#[cfg(test)]
fn check_forbid_overlap(
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
    let overlap_area = intersection.unsigned_area();
    let has_overlap = overlap_area > 1e-10;

    if has_overlap {
        // Use the intersection's bounding rect as the violation location
        // (much more precise than the union of both polygons' bboxes).
        let location = intersection
            .bounding_rect()
            .map(|r| {
                BBox::new(
                    Point::new(r.min().x, r.min().y),
                    Point::new(r.max().x, r.max().y),
                )
            })
            .unwrap_or_else(|| poly1.bbox().merge(&poly2.bbox()));

        let message = format!(
            "Forbidden overlap ({:.3} um²) at ({:.1}, {:.1}) to ({:.1}, {:.1})",
            overlap_area,
            location.min().x,
            location.min().y,
            location.max().x,
            location.max().y,
        );

        let mut violation =
            DrcViolation::new(RuleType::ForbiddenOverlap, location, layer1, message)
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

/// Bulk required-overlap check using R-tree spatial indexing.
///
/// For each polygon on layer1, checks whether at least one polygon on layer2
/// has a non-zero-area intersection. Uses an R-tree on layer2 polygons so
/// that only bbox-overlapping candidates are tested with the expensive boolean
/// intersection — much faster than O(n×m) when polygons are spatially spread.
pub fn check_require_overlap_bulk(
    polygons1: &[(Polygon, usize)],
    layer1: Layer,
    polygons2: &[(Polygon, usize)],
    layer2: Layer,
    rule_name: Option<&str>,
    same_layer: bool,
) -> Vec<DrcViolation> {
    if polygons1.is_empty() {
        return Vec::new();
    }

    // If layer2 is empty, every layer1 polygon is missing required overlap.
    if polygons2.is_empty() {
        return polygons1
            .iter()
            .map(|(poly1, orig_idx1)| {
                let mut violation = DrcViolation::new(
                    RuleType::MissingOverlap,
                    poly1.bbox(),
                    layer1,
                    format!(
                        "Polygon on Layer({}, {}) has no overlap with Layer({}, {}) (layer is empty)",
                        layer1.number, layer1.datatype, layer2.number, layer2.datatype
                    ),
                )
                .with_layer2(layer2)
                .with_severity(Severity::Error)
                .with_polygon_idx(*orig_idx1);

                if let Some(name) = rule_name {
                    violation = violation.with_name(name);
                }

                violation
            })
            .collect();
    }

    // Build R-tree for second set of polygons.
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

    // Lazily-memoized `geo` conversions of polygons2 (ROS-555); see
    // `check_forbid_overlap_bulk` for the rationale.
    let mut geo2_cache: Vec<Option<geo::Polygon<f64>>> = vec![None; polygons2.len()];

    let mut violations = Vec::new();

    for (poly1, orig_idx1) in polygons1 {
        let bbox1 = poly1.bbox();
        let search_envelope = AABB::from_corners(
            [bbox1.min().x, bbox1.min().y],
            [bbox1.max().x, bbox1.max().y],
        );

        let mut has_overlap = false;
        // Lift poly1's geo conversion out of the candidate loop (only allocate
        // when the R-tree query returns at least one candidate to test).
        let mut geo1 = None;

        for candidate in tree.locate_in_envelope_intersecting(&search_envelope) {
            // Same-layer: skip self-comparison
            if same_layer && candidate.orig_index == *orig_idx1 {
                continue;
            }

            let (poly2, _) = &polygons2[candidate.index];
            let geo1 = geo1.get_or_insert_with(|| polygon_to_geo(poly1));
            let geo2 = geo2_cache[candidate.index].get_or_insert_with(|| polygon_to_geo(poly2));
            // A shared boundary edge (zero-area intersection) is not a
            // satisfying overlap for `require_overlap`, so require positive
            // area. Unlike `forbid_overlap` there is no `Intersects` pre-gate
            // here: the loop already breaks on the first satisfying overlap, so
            // the gate would only add a redundant traversal in the common
            // (overlapping) case.
            if geo1.intersection(&*geo2).unsigned_area() > 1e-10 {
                has_overlap = true;
                break;
            }
        }

        if !has_overlap {
            let mut violation = DrcViolation::new(
                RuleType::MissingOverlap,
                poly1.bbox(),
                layer1,
                format!(
                    "Polygon on Layer({}, {}) has no overlap with Layer({}, {})",
                    layer1.number, layer1.datatype, layer2.number, layer2.datatype
                ),
            )
            .with_layer2(layer2)
            .with_severity(Severity::Error)
            .with_polygon_idx(*orig_idx1);

            if let Some(name) = rule_name {
                violation = violation.with_name(name);
            }

            violations.push(violation);
        }
    }

    violations
}

/// Check that two polygons overlap (required overlap).
///
/// Returns a violation if there is NO overlap. Single-pair entry point;
/// the hot path goes through [`check_require_overlap_bulk`], which inlines
/// this logic to avoid re-converting `poly1` to its `geo` representation
/// per candidate.
#[cfg(test)]
fn check_require_overlap(
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

    #[test]
    fn test_require_overlap_bulk_cross_layer() {
        // Each poly1 overlaps exactly one poly2. Bulk path should find them via R-tree.
        let layer1 = Layer::new(1, 0);
        let layer2 = Layer::new(2, 0);

        let polys1: Vec<(Polygon, usize)> = (0..10)
            .map(|i| (Polygon::rect(Point::new(i as f64 * 20.0, 0.0), 5.0, 5.0), i))
            .collect();
        let polys2: Vec<(Polygon, usize)> = (0..10)
            .map(|i| {
                (
                    Polygon::rect(Point::new(i as f64 * 20.0 + 2.0, 0.0), 5.0, 5.0),
                    i,
                )
            })
            .collect();

        let violations = check_require_overlap_bulk(&polys1, layer1, &polys2, layer2, None, false);
        assert!(violations.is_empty(), "Each poly1 should overlap a poly2");
    }

    #[test]
    fn test_require_overlap_bulk_no_matches() {
        // All polys are well-separated — every poly1 should report a violation.
        let layer1 = Layer::new(1, 0);
        let layer2 = Layer::new(2, 0);

        let polys1: Vec<(Polygon, usize)> = (0..5)
            .map(|i| {
                (
                    Polygon::rect(Point::new(i as f64 * 100.0, 0.0), 5.0, 5.0),
                    i,
                )
            })
            .collect();
        let polys2: Vec<(Polygon, usize)> = (0..5)
            .map(|i| {
                (
                    Polygon::rect(Point::new(i as f64 * 100.0 + 50.0, 0.0), 5.0, 5.0),
                    i,
                )
            })
            .collect();

        let violations = check_require_overlap_bulk(&polys1, layer1, &polys2, layer2, None, false);
        assert_eq!(violations.len(), 5, "All 5 poly1s should have violations");
    }

    #[test]
    fn test_require_overlap_bulk_empty_layer2() {
        let layer1 = Layer::new(1, 0);
        let layer2 = Layer::new(2, 0);

        let polys1: Vec<(Polygon, usize)> = (0..3)
            .map(|i| (Polygon::rect(Point::new(i as f64 * 20.0, 0.0), 5.0, 5.0), i))
            .collect();
        let polys2: Vec<(Polygon, usize)> = Vec::new();

        let violations = check_require_overlap_bulk(&polys1, layer1, &polys2, layer2, None, false);
        assert_eq!(
            violations.len(),
            3,
            "All poly1s should have violations when layer2 is empty"
        );
        assert!(violations[0].message.contains("layer is empty"));
    }

    #[test]
    fn test_require_overlap_bulk_same_layer_skips_self() {
        // Single polygon on same layer — should NOT match itself.
        let layer = Layer::new(1, 0);
        let polys: Vec<(Polygon, usize)> = vec![(Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0), 0)];

        let violations = check_require_overlap_bulk(&polys, layer, &polys, layer, None, true);
        assert_eq!(
            violations.len(),
            1,
            "Single polygon should fail same-layer require_overlap"
        );
    }

    #[test]
    fn test_require_overlap_bulk_many_separated_fast() {
        // 50 well-separated polygons on each layer. The R-tree should skip
        // expensive boolean intersections for non-overlapping bbox pairs.
        let layer1 = Layer::new(1, 0);
        let layer2 = Layer::new(2, 0);

        // Each poly1 at (i*20, 0), each poly2 at (i*20 + 1, 0) — overlapping pairs.
        let polys1: Vec<(Polygon, usize)> = (0..50)
            .map(|i| (Polygon::rect(Point::new(i as f64 * 20.0, 0.0), 5.0, 5.0), i))
            .collect();
        let polys2: Vec<(Polygon, usize)> = (0..50)
            .map(|i| {
                (
                    Polygon::rect(Point::new(i as f64 * 20.0 + 1.0, 0.0), 5.0, 5.0),
                    i,
                )
            })
            .collect();

        let violations = check_require_overlap_bulk(&polys1, layer1, &polys2, layer2, None, false);
        assert!(
            violations.is_empty(),
            "Each poly1 has a matching poly2 nearby"
        );
    }
}
