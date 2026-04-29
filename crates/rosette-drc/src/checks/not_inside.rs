//! Not-inside / exclusion-zone check.
//!
//! Flags `inner`-layer polygons that are fully contained inside the union of
//! `outer`-layer polygons. Partial crossings are not violations — an inner
//! polygon must sit wholly inside an outer region for the rule to trigger.
//!
//! This is distinct from `forbid_overlap` (which flags any overlap) and from
//! the inverse of `enclosure` (which requires containment with a margin).
//! Use it to model keep-out zones: regions where a given layer is prohibited
//! from appearing in full.

use geo::{Area, BooleanOps, MultiPolygon};
use rosette_core::{Layer, Polygon, polygon_to_geo};

use crate::violation::{DrcViolation, RuleType, Severity};

/// Area tolerance: treat `inner - outer_union` as empty when below this.
///
/// Matches the tolerance used by `check_enclosure`. Values smaller than this
/// are floating-point noise from the boolean op, not real uncovered area.
const CONTAINMENT_AREA_EPS: f64 = 1e-10;

/// Check that no `inner`-layer polygon is fully contained in the union of
/// `outer`-layer polygons.
///
/// Returns one violation per offending inner polygon. An inner polygon is
/// considered "inside" when `inner - union(outer)` has area ≤
/// [`CONTAINMENT_AREA_EPS`] — i.e. every point of the inner polygon is also
/// covered by some outer polygon (boundary-touching is tolerated).
///
/// The outer polygons are unioned up front so a violation is raised when
/// multiple outer polygons together contain the inner one, even if no single
/// outer polygon does.
pub fn check_not_inside(
    inners: &[(Polygon, usize)],
    inner_layer: Layer,
    outers: &[(Polygon, usize)],
    outer_layer: Layer,
    rule_name: Option<&str>,
) -> Vec<DrcViolation> {
    // No outer polygons means no exclusion zones exist — nothing to violate.
    if inners.is_empty() || outers.is_empty() {
        return Vec::new();
    }

    // Union all outer polygons once. A single `difference` against this union
    // correctly handles the "inner contained by multiple adjacent outers" case.
    let outer_union = union_polygons(outers);

    let mut violations = Vec::new();
    for (inner_poly, _) in inners {
        let geo_inner = MultiPolygon::new(vec![polygon_to_geo(inner_poly)]);

        // Degenerate inner polygons (collinear vertices, sub-epsilon slivers)
        // have area below our tolerance. Any `difference` result against them
        // also falls below tolerance, which would otherwise flag them as
        // "fully inside" even when they're nowhere near an outer polygon.
        // Skip these — they're not meaningfully "inside" anything.
        let inner_area = geo_inner.unsigned_area();
        if inner_area <= CONTAINMENT_AREA_EPS {
            continue;
        }

        let diff = geo_inner.difference(&outer_union);

        if diff.unsigned_area() <= CONTAINMENT_AREA_EPS {
            let mut violation = DrcViolation::new(
                RuleType::NotInside,
                inner_poly.bbox(),
                inner_layer,
                format!(
                    "Layer ({}, {}) polygon is fully inside exclusion zone on layer ({}, {})",
                    inner_layer.number,
                    inner_layer.datatype,
                    outer_layer.number,
                    outer_layer.datatype
                ),
            )
            .with_layer2(outer_layer)
            .with_severity(Severity::Error);

            if let Some(name) = rule_name {
                violation = violation.with_name(name);
            }

            violations.push(violation);
        }
    }

    violations
}

/// Union a list of polygons into a `geo` `MultiPolygon`.
///
/// Uses `BooleanOps::union` iteratively. For the typical DRC case (a handful
/// of outer polygons per rule, maybe dozens), this is fast enough. If this
/// becomes a bottleneck on designs with thousands of outer polygons, swap in
/// a sweep-line union.
fn union_polygons(polys: &[(Polygon, usize)]) -> MultiPolygon<f64> {
    let mut acc = MultiPolygon::new(Vec::new());
    for (poly, _) in polys {
        let one = MultiPolygon::new(vec![polygon_to_geo(poly)]);
        acc = acc.union(&one);
    }
    acc
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::Point;

    fn p(poly: Polygon) -> (Polygon, usize) {
        (poly, 0)
    }

    #[test]
    fn inner_fully_inside_outer_violates() {
        // Outer: 20x20. Inner: 5x5 centered inside it.
        let outer = Polygon::rect(Point::new(0.0, 0.0), 20.0, 20.0);
        let inner = Polygon::rect(Point::new(7.5, 7.5), 5.0, 5.0);

        let v = check_not_inside(
            &[p(inner)],
            Layer::new(1, 0),
            &[p(outer)],
            Layer::new(2, 0),
            Some("KEEPOUT"),
        );
        assert_eq!(v.len(), 1);
        assert!(matches!(v[0].rule_type, RuleType::NotInside));
        assert_eq!(v[0].rule_name.as_deref(), Some("KEEPOUT"));
        assert_eq!(v[0].layer2, Some(Layer::new(2, 0)));
    }

    #[test]
    fn inner_partially_outside_does_not_violate() {
        // Inner straddles the boundary of outer.
        let outer = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);
        let inner = Polygon::rect(Point::new(5.0, 5.0), 10.0, 10.0); // crosses out

        let v = check_not_inside(
            &[p(inner)],
            Layer::new(1, 0),
            &[p(outer)],
            Layer::new(2, 0),
            None,
        );
        assert!(v.is_empty(), "partial crossing is not 'inside'");
    }

    #[test]
    fn inner_entirely_outside_does_not_violate() {
        let outer = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);
        let inner = Polygon::rect(Point::new(50.0, 50.0), 5.0, 5.0);

        let v = check_not_inside(
            &[p(inner)],
            Layer::new(1, 0),
            &[p(outer)],
            Layer::new(2, 0),
            None,
        );
        assert!(v.is_empty());
    }

    #[test]
    fn boundary_touching_inner_still_violates() {
        // Inner's top-right corner touches outer's top-right corner.
        // Full-containment semantics should still flag this — the inner
        // polygon's area is entirely covered by outer.
        let outer = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);
        let inner = Polygon::rect(Point::new(5.0, 5.0), 5.0, 5.0);

        let v = check_not_inside(
            &[p(inner)],
            Layer::new(1, 0),
            &[p(outer)],
            Layer::new(2, 0),
            None,
        );
        assert_eq!(v.len(), 1);
    }

    #[test]
    fn union_of_two_outers_contains_inner() {
        // Two abutting outer rectangles together cover an inner rectangle
        // that neither alone contains.
        let outer_a = Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0);
        let outer_b = Polygon::rect(Point::new(10.0, 0.0), 10.0, 10.0);
        // Inner straddles the seam between the two outers.
        let inner = Polygon::rect(Point::new(5.0, 2.0), 10.0, 6.0);

        let v = check_not_inside(
            &[p(inner)],
            Layer::new(1, 0),
            &[p(outer_a), p(outer_b)],
            Layer::new(2, 0),
            None,
        );
        assert_eq!(
            v.len(),
            1,
            "union of outers should collectively contain inner"
        );
    }

    #[test]
    fn no_outer_polygons_is_trivially_fine() {
        // Without any exclusion region, there's nothing to be inside of.
        let inner = Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0);
        let v = check_not_inside(&[p(inner)], Layer::new(1, 0), &[], Layer::new(2, 0), None);
        assert!(v.is_empty());
    }

    #[test]
    fn mixed_inners_reports_only_contained_ones() {
        // Three inners: one inside, one outside, one straddling.
        let outer = Polygon::rect(Point::new(0.0, 0.0), 20.0, 20.0);
        let inside = Polygon::rect(Point::new(5.0, 5.0), 3.0, 3.0);
        let outside = Polygon::rect(Point::new(100.0, 100.0), 3.0, 3.0);
        let straddling = Polygon::rect(Point::new(18.0, 5.0), 5.0, 3.0);

        let v = check_not_inside(
            &[p(inside), p(outside), p(straddling)],
            Layer::new(1, 0),
            &[p(outer)],
            Layer::new(2, 0),
            None,
        );
        assert_eq!(v.len(), 1, "only the fully-inside inner should violate");
    }

    #[test]
    fn degenerate_inner_far_from_outer_does_not_violate() {
        // Regression: a sub-epsilon / zero-area inner polygon must not be
        // reported as "fully inside" just because its difference against
        // anything also has sub-epsilon area. The inner must have real area
        // of its own to be meaningfully contained.
        //
        // The outer polygon is far away from the inner, so a correct
        // implementation cannot possibly find the inner "contained".
        let outer = Polygon::rect(Point::new(100.0, 100.0), 10.0, 10.0);

        // Tiny sliver: a triangle with area 5e-11 at the origin.
        // Base 1e-5, height 1e-5 → area = 0.5 * 1e-5 * 1e-5 = 5e-11.
        let sliver = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(1e-5, 0.0),
            Point::new(0.0, 1e-5),
        ]);

        let v = check_not_inside(
            &[p(sliver)],
            Layer::new(1, 0),
            &[p(outer)],
            Layer::new(2, 0),
            None,
        );
        assert!(
            v.is_empty(),
            "degenerate inner far from any outer must not be flagged"
        );
    }
}
