//! Enclosure check for layer containment.
//!
//! The bulk entry point [`check_enclosure_bulk`] uses an R-tree spatial
//! index over the outer-layer polygons so each inner polygon only pays
//! boolean-geometry cost for the outers whose bbox is actually near it.
//! Mirrors the pattern used by `overlap.rs` and `spacing.rs`.

use geo::{Area, BooleanOps, Distance, Euclidean};
use rosette_core::{Layer, Polygon, polygon_to_geo};
use rstar::{AABB, RTree};

use super::spatial::IndexedPolygon;
use crate::violation::{DrcViolation, RuleType, Severity};

/// Bulk enclosure check using R-tree spatial indexing.
///
/// For each inner polygon, checks whether at least one outer polygon encloses
/// it with at least `min_enclosure` margin. Only outers whose bounding box
/// (expanded by `min_enclosure`) intersects the inner bbox are tested with
/// the expensive boolean-geometry path — any outer further away cannot
/// possibly enclose the inner with the required margin.
///
/// Preserves the semantics of the prior O(I×O) implementation:
/// - If at least one outer encloses the inner with sufficient margin → no
///   violation for that inner.
/// - Otherwise the "best" (largest actual enclosure distance) near-miss is
///   emitted for that inner.
/// - If no outer candidates are within range at all, an `actual = 0` violation
///   is emitted (same as when the outer layer is empty).
pub fn check_enclosure_bulk(
    inner_polys: &[(Polygon, usize)],
    inner_layer: Layer,
    outer_polys: &[(Polygon, usize)],
    outer_layer: Layer,
    min_enclosure: f64,
    rule_name: Option<&str>,
) -> Vec<DrcViolation> {
    if inner_polys.is_empty() {
        return Vec::new();
    }

    // If the outer layer is empty, every inner polygon is unenclosed. Emit a
    // dedicated message so users understand the outer layer was missing
    // entirely rather than just geometrically short.
    if outer_polys.is_empty() {
        return inner_polys
            .iter()
            .map(|(inner_poly, inner_idx)| {
                let mut violation = DrcViolation::new(
                    RuleType::Enclosure {
                        required: min_enclosure,
                        actual: 0.0,
                    },
                    inner_poly.bbox(),
                    inner_layer,
                    format!(
                        "Inner layer ({}, {}) has no enclosing geometry on outer layer ({}, {})",
                        inner_layer.number,
                        inner_layer.datatype,
                        outer_layer.number,
                        outer_layer.datatype
                    ),
                )
                .with_layer2(outer_layer)
                .with_severity(Severity::Error)
                .with_polygon_idx(*inner_idx);

                if let Some(name) = rule_name {
                    violation = violation.with_name(name);
                }

                violation
            })
            .collect();
    }

    // Build R-tree over outer polygons keyed on their bbox.
    let indexed: Vec<IndexedPolygon> = outer_polys
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

    for (inner_poly, inner_idx) in inner_polys {
        // Expand the search envelope by `min_enclosure` on each side. Any outer
        // whose bbox sits outside this envelope is at least `min_enclosure`
        // away from the inner bbox and therefore cannot satisfy the rule or
        // provide a useful near-miss (we already keep the best near-miss, so
        // only closer candidates matter).
        let search_bbox = inner_poly.bbox().expand_by(min_enclosure);
        let search_envelope = AABB::from_corners(
            [search_bbox.min().x, search_bbox.min().y],
            [search_bbox.max().x, search_bbox.max().y],
        );

        // Lazily converted — only allocate when we actually have a candidate
        // outer to test against.
        let mut geo_inner = None;

        let mut best_violation: Option<DrcViolation> = None;
        let mut is_enclosed = false;

        for candidate in tree.locate_in_envelope_intersecting(&search_envelope) {
            let (outer_poly, outer_idx) = &outer_polys[candidate.index];
            let geo_inner = geo_inner.get_or_insert_with(|| polygon_to_geo(inner_poly));
            let geo_outer = polygon_to_geo(outer_poly);

            // First: inner must be fully contained in outer. `inner - outer`
            // has non-zero area iff some part of the inner extends outside.
            let outside_area = geo_inner.difference(&geo_outer).unsigned_area();
            if outside_area > 1e-10 {
                // Not fully enclosed — record as a zero-enclosure near-miss
                // so an inner with no fully-enclosing outer still reports.
                let near_miss = build_violation(
                    inner_poly,
                    inner_layer,
                    outer_layer,
                    min_enclosure,
                    0.0,
                    format!(
                        "Inner layer ({}, {}) not fully enclosed by outer layer ({}, {})",
                        inner_layer.number,
                        inner_layer.datatype,
                        outer_layer.number,
                        outer_layer.datatype
                    ),
                    rule_name,
                    *inner_idx,
                    *outer_idx,
                );
                best_violation = keep_best_near_miss(best_violation, near_miss);
                continue;
            }

            // Second: minimum boundary-to-boundary distance.
            let distance = Euclidean::distance(geo_inner.exterior(), geo_outer.exterior());
            if distance >= min_enclosure {
                // This outer fully satisfies the rule — inner is covered.
                is_enclosed = true;
                break;
            }

            let near_miss = build_violation(
                inner_poly,
                inner_layer,
                outer_layer,
                min_enclosure,
                distance,
                format!(
                    "Enclosure {:.4} is less than minimum {:.4}",
                    distance, min_enclosure
                ),
                rule_name,
                *inner_idx,
                *outer_idx,
            );
            best_violation = keep_best_near_miss(best_violation, near_miss);
        }

        if is_enclosed {
            continue;
        }

        // No candidate enclosed this inner. Emit the best near-miss we found,
        // or a generic "no enclosing geometry nearby" if the R-tree query
        // returned nothing at all.
        let violation = best_violation.unwrap_or_else(|| {
            let mut v = DrcViolation::new(
                RuleType::Enclosure {
                    required: min_enclosure,
                    actual: 0.0,
                },
                inner_poly.bbox(),
                inner_layer,
                format!(
                    "Inner layer ({}, {}) has no enclosing geometry on outer layer ({}, {})",
                    inner_layer.number,
                    inner_layer.datatype,
                    outer_layer.number,
                    outer_layer.datatype
                ),
            )
            .with_layer2(outer_layer)
            .with_severity(Severity::Error)
            .with_polygon_idx(*inner_idx);

            if let Some(name) = rule_name {
                v = v.with_name(name);
            }
            v
        });
        violations.push(violation);
    }

    violations
}

/// Keep the near-miss with the largest `actual` enclosure. Gives the most
/// actionable report: "you need 0.1 more enclosure" is more useful than
/// "no enclosure at all" from a distant unrelated outer polygon.
fn keep_best_near_miss(
    best: Option<DrcViolation>,
    candidate: DrcViolation,
) -> Option<DrcViolation> {
    match &best {
        None => Some(candidate),
        Some(bv) => {
            let replace = match (&bv.rule_type, &candidate.rule_type) {
                (
                    RuleType::Enclosure {
                        actual: best_actual,
                        ..
                    },
                    RuleType::Enclosure {
                        actual: new_actual, ..
                    },
                ) => *new_actual > *best_actual,
                _ => false,
            };
            if replace { Some(candidate) } else { best }
        }
    }
}

#[allow(clippy::too_many_arguments)]
fn build_violation(
    inner: &Polygon,
    inner_layer: Layer,
    outer_layer: Layer,
    required: f64,
    actual: f64,
    message: String,
    rule_name: Option<&str>,
    inner_idx: usize,
    outer_idx: usize,
) -> DrcViolation {
    let mut v = DrcViolation::new(
        RuleType::Enclosure { required, actual },
        inner.bbox(),
        inner_layer,
        message,
    )
    .with_layer2(outer_layer)
    .with_severity(Severity::Error)
    .with_polygon_idx(inner_idx)
    .with_polygon_idx2(outer_idx);

    if let Some(name) = rule_name {
        v = v.with_name(name);
    }
    v
}

/// Check that inner polygon is enclosed by outer polygon with minimum margin.
///
/// Single-pair entry point retained for tests. The hot path goes through
/// [`check_enclosure_bulk`], which uses an R-tree to avoid
/// O(inner × outer) cost on large layouts.
#[cfg(test)]
fn check_enclosure(
    inner: &Polygon,
    inner_layer: Layer,
    outer: &Polygon,
    outer_layer: Layer,
    min_enclosure: f64,
    rule_name: Option<&str>,
) -> Option<DrcViolation> {
    let geo_inner = polygon_to_geo(inner);
    let geo_outer = polygon_to_geo(outer);

    // First check: inner must be completely within outer
    // Compute difference: inner - outer. If non-empty, inner extends outside outer.
    let difference = geo_inner.difference(&geo_outer);

    let outside_area = difference.unsigned_area();

    if outside_area > 1e-10 {
        // Inner extends outside outer
        let mut violation = DrcViolation::new(
            RuleType::Enclosure {
                required: min_enclosure,
                actual: 0.0,
            },
            inner.bbox(),
            inner_layer,
            format!(
                "Inner layer ({}, {}) not fully enclosed by outer layer ({}, {})",
                inner_layer.number, inner_layer.datatype, outer_layer.number, outer_layer.datatype
            ),
        )
        .with_layer2(outer_layer)
        .with_severity(Severity::Error);

        if let Some(name) = rule_name {
            violation = violation.with_name(name);
        }

        return Some(violation);
    }

    // Second check: minimum distance from inner boundary to outer boundary
    let inner_exterior = geo_inner.exterior();
    let outer_exterior = geo_outer.exterior();

    let distance = Euclidean::distance(inner_exterior, outer_exterior);

    if distance < min_enclosure {
        let mut violation = DrcViolation::new(
            RuleType::Enclosure {
                required: min_enclosure,
                actual: distance,
            },
            inner.bbox(),
            inner_layer,
            format!(
                "Enclosure {:.4} is less than minimum {:.4}",
                distance, min_enclosure
            ),
        )
        .with_layer2(outer_layer)
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
    fn test_enclosure_pass() {
        // Outer: 20x20 at origin, Inner: 10x10 centered
        let outer = Polygon::rect(Point::new(0.0, 0.0), 20.0, 20.0);
        let inner = Polygon::rect(Point::new(5.0, 5.0), 10.0, 10.0);

        let result = check_enclosure(
            &inner,
            Layer::new(2, 0),
            &outer,
            Layer::new(1, 0),
            4.0,
            None,
        );
        assert!(result.is_none());
    }

    #[test]
    fn test_enclosure_fail_margin() {
        // Outer: 20x20, Inner: 10x10 with only 2.0 margin
        let outer = Polygon::rect(Point::new(0.0, 0.0), 20.0, 20.0);
        let inner = Polygon::rect(Point::new(2.0, 2.0), 16.0, 16.0);

        let result = check_enclosure(
            &inner,
            Layer::new(2, 0),
            &outer,
            Layer::new(1, 0),
            3.0,
            Some("ENC_RULE"),
        );
        assert!(result.is_some());

        let v = result.unwrap();
        assert_eq!(v.rule_name, Some("ENC_RULE".to_string()));
    }

    #[test]
    fn test_enclosure_fail_outside() {
        // Inner extends outside outer
        let outer = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);
        let inner = Polygon::rect(Point::new(5.0, 5.0), 10.0, 10.0);

        let result = check_enclosure(
            &inner,
            Layer::new(2, 0),
            &outer,
            Layer::new(1, 0),
            1.0,
            None,
        );
        assert!(result.is_some());

        let v = result.unwrap();
        if let RuleType::Enclosure { actual, .. } = v.rule_type {
            assert!((actual - 0.0).abs() < 1e-10); // Reported as 0 enclosure
        }
    }

    #[test]
    fn test_enclosure_bulk_pass() {
        // Each inner nested inside an outer with comfortable margin.
        let inner_layer = Layer::new(2, 0);
        let outer_layer = Layer::new(1, 0);

        let inners: Vec<(Polygon, usize)> = (0..10)
            .map(|i| {
                (
                    Polygon::rect(Point::new(i as f64 * 50.0 + 5.0, 5.0), 10.0, 10.0),
                    i,
                )
            })
            .collect();
        let outers: Vec<(Polygon, usize)> = (0..10)
            .map(|i| {
                (
                    Polygon::rect(Point::new(i as f64 * 50.0, 0.0), 20.0, 20.0),
                    i,
                )
            })
            .collect();

        let violations =
            check_enclosure_bulk(&inners, inner_layer, &outers, outer_layer, 4.0, None);
        assert!(
            violations.is_empty(),
            "All inners should be enclosed: {:?}",
            violations
        );
    }

    #[test]
    fn test_enclosure_bulk_margin_fail() {
        // Inner fits inside the outer but margin is too tight.
        let inner_layer = Layer::new(2, 0);
        let outer_layer = Layer::new(1, 0);

        let inners = vec![(Polygon::rect(Point::new(2.0, 2.0), 16.0, 16.0), 0)];
        let outers = vec![(Polygon::rect(Point::new(0.0, 0.0), 20.0, 20.0), 0)];

        let violations =
            check_enclosure_bulk(&inners, inner_layer, &outers, outer_layer, 3.0, Some("ENC"));
        assert_eq!(violations.len(), 1);
        if let RuleType::Enclosure { actual, required } = violations[0].rule_type {
            assert!((actual - 2.0).abs() < 1e-6);
            assert!((required - 3.0).abs() < 1e-10);
        } else {
            panic!("expected Enclosure rule type");
        }
    }

    #[test]
    fn test_enclosure_bulk_no_outers() {
        // Empty outer layer — every inner reports a violation.
        let inner_layer = Layer::new(2, 0);
        let outer_layer = Layer::new(1, 0);

        let inners: Vec<(Polygon, usize)> = (0..3)
            .map(|i| (Polygon::rect(Point::new(i as f64 * 20.0, 0.0), 5.0, 5.0), i))
            .collect();
        let outers: Vec<(Polygon, usize)> = Vec::new();

        let violations =
            check_enclosure_bulk(&inners, inner_layer, &outers, outer_layer, 1.0, None);
        assert_eq!(violations.len(), 3);
        for v in &violations {
            assert!(v.message.contains("no enclosing geometry"));
        }
    }

    #[test]
    fn test_enclosure_bulk_far_away_outer() {
        // Outer is far away — R-tree query returns no candidates so we still
        // emit the fallback "no enclosing geometry" violation.
        let inner_layer = Layer::new(2, 0);
        let outer_layer = Layer::new(1, 0);

        let inners = vec![(Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0), 0)];
        let outers = vec![(Polygon::rect(Point::new(1000.0, 1000.0), 5.0, 5.0), 0)];

        let violations =
            check_enclosure_bulk(&inners, inner_layer, &outers, outer_layer, 0.5, None);
        assert_eq!(violations.len(), 1);
    }

    #[test]
    fn test_enclosure_bulk_picks_best_near_miss() {
        // Two outers near the inner: one fails with actual=0 (inner sticks
        // out), one fails with actual=0.5 (close margin). The 0.5 near-miss
        // is more actionable and should win.
        let inner_layer = Layer::new(2, 0);
        let outer_layer = Layer::new(1, 0);

        // Inner at (0,0) 10x10 → bbox [0..10, 0..10]
        let inners = vec![(Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0), 0)];
        // Outer A: encloses fully but only 0.5 margin, fails enclosure=1.0.
        // Outer B: partially overlaps the inner (inner sticks out) → actual=0.
        let outers = vec![
            (Polygon::rect(Point::new(-0.5, -0.5), 11.0, 11.0), 0),
            (Polygon::rect(Point::new(5.0, 5.0), 10.0, 10.0), 1),
        ];

        let violations =
            check_enclosure_bulk(&inners, inner_layer, &outers, outer_layer, 1.0, None);
        assert_eq!(violations.len(), 1);
        if let RuleType::Enclosure { actual, .. } = violations[0].rule_type {
            assert!(
                (actual - 0.5).abs() < 1e-6,
                "Should report the best (largest actual) near-miss, got {}",
                actual
            );
        }
    }

    #[test]
    fn test_enclosure_bulk_any_enclosing_outer_covers() {
        // Two outers: first fails the check, second fully encloses. No
        // violation should be emitted.
        let inner_layer = Layer::new(2, 0);
        let outer_layer = Layer::new(1, 0);

        let inners = vec![(Polygon::rect(Point::new(5.0, 5.0), 2.0, 2.0), 0)];
        let outers = vec![
            // Partial overlap → fails
            (Polygon::rect(Point::new(4.0, 4.0), 2.0, 2.0), 0),
            // Fully encloses with margin 3.0
            (Polygon::rect(Point::new(0.0, 0.0), 20.0, 20.0), 1),
        ];

        let violations =
            check_enclosure_bulk(&inners, inner_layer, &outers, outer_layer, 1.0, None);
        assert!(violations.is_empty());
    }
}
