//! Enclosure check for layer containment.

use geo::{BooleanOps, Distance, Euclidean};
use rosette_core::{Layer, Polygon};

use crate::convert::{polygon_area, polygon_to_geo};
use crate::violation::{DrcViolation, RuleType, Severity};

/// Check that inner polygon is enclosed by outer polygon with minimum margin.
pub fn check_enclosure(
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

    let outside_area: f64 = difference
        .0
        .iter()
        .map(|p| {
            let coords: Vec<_> = p.exterior().coords().map(|c| (c.x, c.y)).collect();
            polygon_area(&coords).abs()
        })
        .sum();

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
}
