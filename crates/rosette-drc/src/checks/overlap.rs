//! Overlap checks (required and forbidden).

use geo::BooleanOps;
use rosette_core::{Layer, Polygon};

use crate::convert::{polygon_area, polygon_to_geo};
use crate::violation::{DrcViolation, RuleType, Severity};

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
    let has_overlap = intersection.0.iter().any(|p| {
        let coords: Vec<_> = p.exterior().coords().map(|c| (c.x, c.y)).collect();
        polygon_area(&coords).abs() > 1e-10
    });

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
    let has_overlap = intersection.0.iter().any(|p| {
        let coords: Vec<_> = p.exterior().coords().map(|c| (c.x, c.y)).collect();
        polygon_area(&coords).abs() > 1e-10
    });

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
