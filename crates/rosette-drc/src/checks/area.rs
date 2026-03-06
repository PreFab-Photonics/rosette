//! Minimum area check.

use rosette_core::{Layer, Polygon};

use crate::violation::{DrcViolation, RuleType, Severity};

/// Check that polygon meets minimum area requirement.
pub fn check_area(
    polygon: &Polygon,
    layer: Layer,
    min_area: f64,
    rule_name: Option<&str>,
) -> Option<DrcViolation> {
    let actual = polygon.area();
    if actual < min_area {
        let mut violation = DrcViolation::new(
            RuleType::MinArea {
                required: min_area,
                actual,
            },
            polygon.bbox(),
            layer,
            format!(
                "Polygon area {:.4} is less than minimum {:.4}",
                actual, min_area
            ),
        )
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
    fn test_area_pass() {
        let poly = Polygon::rect(Point::origin(), 10.0, 10.0);
        let result = check_area(&poly, Layer::new(1, 0), 50.0, None);
        assert!(result.is_none());
    }

    #[test]
    fn test_area_fail() {
        let poly = Polygon::rect(Point::origin(), 2.0, 2.0);
        let result = check_area(&poly, Layer::new(1, 0), 50.0, Some("MIN_AREA"));
        assert!(result.is_some());

        let v = result.unwrap();
        assert_eq!(v.rule_name, Some("MIN_AREA".to_string()));
        if let RuleType::MinArea { required, actual } = v.rule_type {
            assert!((required - 50.0).abs() < 1e-10);
            assert!((actual - 4.0).abs() < 1e-10);
        } else {
            panic!("Wrong rule type");
        }
    }
}
