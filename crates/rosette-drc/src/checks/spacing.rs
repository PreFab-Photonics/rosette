//! Minimum spacing check with R-tree spatial indexing.

use geo::{Distance, Euclidean};
use rosette_core::{BBox, Layer, Polygon};
use rstar::{PointDistance, RTree, RTreeObject, AABB};

use crate::violation::{DrcViolation, RuleType, Severity};
use rosette_core::polygon_to_geo;

/// Wrapper for R-tree spatial indexing.
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

/// Check minimum spacing between polygons on two layers.
///
/// Uses R-tree for efficient spatial indexing to avoid O(n²) comparisons.
///
/// When `same_layer` is true, deduplication logic ensures each polygon pair is
/// only checked once (A-B, not B-A) and self-comparisons are skipped.
pub fn check_spacing(
    polygons1: &[(Polygon, usize)],
    layer1: Layer,
    polygons2: &[(Polygon, usize)],
    layer2: Layer,
    min_spacing: f64,
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
        // Expand bbox by spacing to find candidates
        let search_bbox = poly1.bbox().expand_by(min_spacing);
        let search_envelope = AABB::from_corners(
            [search_bbox.min().x, search_bbox.min().y],
            [search_bbox.max().x, search_bbox.max().y],
        );

        let geo_poly1 = polygon_to_geo(poly1);

        // Use locate_in_envelope_intersecting for proper intersection query
        for candidate in tree.locate_in_envelope_intersecting(&search_envelope) {
            // When checking same-layer spacing:
            // - Skip if candidate has lower or equal index to avoid duplicates (A-B and B-A)
            // - This also prevents self-comparison (A-A)
            if same_layer && candidate.orig_index <= *orig_idx1 {
                continue;
            }

            let (poly2, _) = &polygons2[candidate.index];
            let geo_poly2 = polygon_to_geo(poly2);

            // Compute exact distance
            let distance = Euclidean::distance(&geo_poly1, &geo_poly2);

            // Skip touching/overlapping polygons (distance ≈ 0). These are
            // intentionally connected (e.g., route abutting a component at a
            // port). Overlaps are handled by the forbid_overlap rule instead.
            if distance < 1e-10 {
                continue;
            }

            if distance < min_spacing {
                let violation_bbox = poly1.bbox().merge(&poly2.bbox());
                let mut violation = DrcViolation::new(
                    RuleType::MinSpacing {
                        required: min_spacing,
                        actual: distance,
                    },
                    violation_bbox,
                    layer1,
                    format!(
                        "Spacing {:.4} is less than minimum {:.4}",
                        distance, min_spacing
                    ),
                )
                .with_layer2(layer2)
                .with_severity(Severity::Error);

                if let Some(name) = rule_name {
                    violation = violation.with_name(name);
                }

                violations.push(violation);
            }
        }
    }

    violations
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::Point;

    #[test]
    fn test_spacing_pass() {
        let poly1 = Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0);
        let poly2 = Polygon::rect(Point::new(10.0, 0.0), 5.0, 5.0);

        let polys1 = vec![(poly1, 0)];
        let polys2 = vec![(poly2, 1)];

        let violations = check_spacing(
            &polys1,
            Layer::new(1, 0),
            &polys2,
            Layer::new(1, 0),
            4.0,
            None,
            true,
        );

        assert!(violations.is_empty());
    }

    #[test]
    fn test_spacing_fail() {
        // poly1: 5x5 rectangle at origin (0,0) to (5,5)
        // poly2: 5x5 rectangle at (6,0) to (11,5)
        // Gap between them: 1.0 (from x=5 to x=6)
        let poly1 = Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0);
        let poly2 = Polygon::rect(Point::new(6.0, 0.0), 5.0, 5.0);

        let polys1 = vec![(poly1, 0)];
        let polys2 = vec![(poly2, 1)];

        let violations = check_spacing(
            &polys1,
            Layer::new(1, 0),
            &polys2,
            Layer::new(2, 0),
            2.0,
            None,
            false,
        );

        assert_eq!(violations.len(), 1);
        if let RuleType::MinSpacing { required, actual } = violations[0].rule_type {
            assert!((required - 2.0).abs() < 1e-10);
            assert!((actual - 1.0).abs() < 1e-10);
        } else {
            panic!("Wrong rule type");
        }
    }

    #[test]
    fn test_same_layer_no_self_compare() {
        let poly = Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0);
        let polys = vec![(poly, 0)];

        // Same layer — should not compare against itself
        let violations = check_spacing(
            &polys,
            Layer::new(1, 0),
            &polys,
            Layer::new(1, 0),
            1.0,
            None,
            true,
        );

        assert!(violations.is_empty());
    }

    #[test]
    fn test_touching_polygons_not_flagged() {
        // Two rectangles sharing an edge (abutting at x=5). Distance = 0.
        // These represent connected waveguides and should NOT be flagged.
        let poly1 = Polygon::rect(Point::new(0.0, 0.0), 5.0, 2.0);
        let poly2 = Polygon::rect(Point::new(5.0, 0.0), 5.0, 2.0);

        let polys1 = vec![(poly1, 0)];
        let polys2 = vec![(poly2, 1)];

        let violations = check_spacing(
            &polys1,
            Layer::new(1, 0),
            &polys2,
            Layer::new(1, 0),
            0.15,
            None,
            true,
        );

        assert!(
            violations.is_empty(),
            "Touching polygons (distance=0) should not produce spacing violations"
        );
    }

    #[test]
    fn test_overlapping_polygons_not_flagged() {
        // Two overlapping rectangles. Distance = 0 (negative overlap).
        // Connected geometry should NOT produce spacing violations.
        let poly1 = Polygon::rect(Point::new(0.0, 0.0), 5.0, 2.0);
        let poly2 = Polygon::rect(Point::new(4.0, 0.0), 5.0, 2.0);

        let polys1 = vec![(poly1, 0)];
        let polys2 = vec![(poly2, 1)];

        let violations = check_spacing(
            &polys1,
            Layer::new(1, 0),
            &polys2,
            Layer::new(1, 0),
            0.15,
            None,
            true,
        );

        assert!(
            violations.is_empty(),
            "Overlapping polygons (distance=0) should not produce spacing violations"
        );
    }

    #[test]
    fn test_near_but_not_touching_still_fails() {
        // Two rectangles with tiny gap (0.01). Should still fail min_spacing=0.15.
        let poly1 = Polygon::rect(Point::new(0.0, 0.0), 5.0, 2.0);
        let poly2 = Polygon::rect(Point::new(5.01, 0.0), 5.0, 2.0);

        let polys1 = vec![(poly1, 0)];
        let polys2 = vec![(poly2, 1)];

        let violations = check_spacing(
            &polys1,
            Layer::new(1, 0),
            &polys2,
            Layer::new(1, 0),
            0.15,
            None,
            true,
        );

        assert_eq!(
            violations.len(),
            1,
            "Near but non-touching polygons (gap=0.01 < min_spacing=0.15) should fail"
        );
    }
}
