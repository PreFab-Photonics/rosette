//! DRC execution engine.

use std::collections::HashMap;
use std::time::{Duration, Instant};

use rosette_core::{Cell, Layer, Library, Polygon, Transform};

use crate::checks::{
    check_angles, check_area, check_enclosure, check_forbid_overlap, check_require_overlap,
    check_spacing, check_width,
};
use crate::rules::{DrcRules, Rule};
use crate::violation::{DrcViolation, RuleType};

/// Statistics from a DRC run.
#[derive(Debug, Clone)]
pub struct DrcStats {
    /// Number of polygons checked.
    pub polygons_checked: usize,
    /// Number of rules checked.
    pub rules_checked: usize,
    /// Total elapsed time.
    pub elapsed: Duration,
}

/// Result of running DRC.
#[derive(Debug, Clone)]
pub struct DrcResult {
    /// List of violations found.
    pub violations: Vec<DrcViolation>,
    /// Statistics from the run.
    pub stats: DrcStats,
}

impl DrcResult {
    /// Check if DRC passed (no violations).
    pub fn passed(&self) -> bool {
        self.violations.is_empty()
    }

    /// Number of violations found.
    pub fn violation_count(&self) -> usize {
        self.violations.len()
    }
}

/// DRC execution engine.
pub struct DrcRunner {
    rules: DrcRules,
}

impl DrcRunner {
    /// Create a new DRC runner with the given rules.
    pub fn new(rules: DrcRules) -> Self {
        Self { rules }
    }

    /// Run DRC on a cell, flattening all cell references.
    ///
    /// # Arguments
    ///
    /// * `cell` - The cell to check
    /// * `library` - Optional library containing referenced cells
    pub fn check(&self, cell: &Cell, library: Option<&Library>) -> DrcResult {
        let start = Instant::now();

        // Flatten cell to get all polygons with transforms applied
        let polygons_by_layer = self.flatten_cell(cell, library, &Transform::identity());

        let polygons_checked: usize = polygons_by_layer.values().map(|v| v.len()).sum();
        let mut violations = Vec::new();

        for rule in self.rules.rules() {
            let rule_violations = self.check_rule(rule, &polygons_by_layer);
            violations.extend(rule_violations);
        }

        DrcResult {
            violations,
            stats: DrcStats {
                polygons_checked,
                rules_checked: self.rules.rules().len(),
                elapsed: start.elapsed(),
            },
        }
    }

    /// Flatten a cell recursively, applying transforms.
    fn flatten_cell(
        &self,
        cell: &Cell,
        library: Option<&Library>,
        transform: &Transform,
    ) -> HashMap<Layer, Vec<(Polygon, usize)>> {
        let mut result: HashMap<Layer, Vec<(Polygon, usize)>> = HashMap::new();
        let mut global_index = 0usize;

        // Add direct polygons
        for (polygon, layer) in cell.polygons() {
            let transformed = polygon.transform(transform);
            result
                .entry(*layer)
                .or_default()
                .push((transformed, global_index));
            global_index += 1;
        }

        // Recursively flatten cell references
        if let Some(lib) = library {
            for cell_ref in cell.cell_refs() {
                if let Some(ref_cell) = lib.cell(&cell_ref.cell_name) {
                    let combined = transform.then(&cell_ref.transform);
                    let child_polygons = self.flatten_cell(ref_cell, Some(lib), &combined);

                    for (layer, polys) in child_polygons {
                        let entry = result.entry(layer).or_default();
                        for (poly, _) in polys {
                            entry.push((poly, global_index));
                            global_index += 1;
                        }
                    }
                }
            }
        }

        result
    }

    /// Check a single rule against the flattened polygons.
    fn check_rule(
        &self,
        rule: &Rule,
        polygons_by_layer: &HashMap<Layer, Vec<(Polygon, usize)>>,
    ) -> Vec<DrcViolation> {
        match rule {
            Rule::MinWidth { layer, width, name } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .filter_map(|(poly, _)| check_width(poly, *layer, *width, name.as_deref()))
                    .collect()
            }

            Rule::MinArea { layer, area, name } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .filter_map(|(poly, _)| check_area(poly, *layer, *area, name.as_deref()))
                    .collect()
            }

            Rule::AllowedAngles {
                layer,
                allowed_angles,
                name,
            } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .flat_map(|(poly, _)| {
                        check_angles(poly, *layer, allowed_angles, name.as_deref())
                    })
                    .collect()
            }

            Rule::MinSpacing {
                layer1,
                layer2,
                spacing,
                name,
            } => {
                let polys1 = polygons_by_layer.get(layer1);
                let polys2 = polygons_by_layer.get(layer2);

                match (polys1, polys2) {
                    (Some(p1), Some(p2)) => {
                        check_spacing(p1, *layer1, p2, *layer2, *spacing, name.as_deref())
                    }
                    _ => Vec::new(),
                }
            }

            Rule::Enclosure {
                inner,
                outer,
                enclosure,
                name,
            } => {
                let inner_polys = polygons_by_layer.get(inner);
                let outer_polys = polygons_by_layer.get(outer);

                match (inner_polys, outer_polys) {
                    (Some(ip), Some(op)) => {
                        let mut violations = Vec::new();
                        for (inner_poly, _) in ip {
                            for (outer_poly, _) in op {
                                if let Some(v) = check_enclosure(
                                    inner_poly,
                                    *inner,
                                    outer_poly,
                                    *outer,
                                    *enclosure,
                                    name.as_deref(),
                                ) {
                                    violations.push(v);
                                }
                            }
                        }
                        violations
                    }
                    _ => Vec::new(),
                }
            }

            Rule::RequireOverlap {
                layer1,
                layer2,
                name,
            } => {
                let polys1 = polygons_by_layer.get(layer1);
                let polys2 = polygons_by_layer.get(layer2);

                match (polys1, polys2) {
                    (Some(p1), Some(p2)) => {
                        let mut violations = Vec::new();
                        for (poly1, _) in p1 {
                            let mut has_overlap = false;
                            for (poly2, _) in p2 {
                                if check_require_overlap(
                                    poly1,
                                    *layer1,
                                    poly2,
                                    *layer2,
                                    name.as_deref(),
                                )
                                .is_none()
                                {
                                    has_overlap = true;
                                    break;
                                }
                            }
                            if !has_overlap {
                                violations.push(DrcViolation::new(
                                    RuleType::MissingOverlap,
                                    poly1.bbox(),
                                    *layer1,
                                    format!(
                                        "Polygon on Layer({}, {}) has no overlap with Layer({}, {})",
                                        layer1.number, layer1.datatype, layer2.number, layer2.datatype
                                    ),
                                ));
                            }
                        }
                        violations
                    }
                    _ => Vec::new(),
                }
            }

            Rule::ForbidOverlap {
                layer1,
                layer2,
                name,
            } => {
                let polys1 = polygons_by_layer.get(layer1);
                let polys2 = polygons_by_layer.get(layer2);

                match (polys1, polys2) {
                    (Some(p1), Some(p2)) => {
                        let mut violations = Vec::new();
                        for (poly1, _) in p1 {
                            for (poly2, _) in p2 {
                                if let Some(v) = check_forbid_overlap(
                                    poly1,
                                    *layer1,
                                    poly2,
                                    *layer2,
                                    name.as_deref(),
                                ) {
                                    violations.push(v);
                                }
                            }
                        }
                        violations
                    }
                    _ => Vec::new(),
                }
            }
        }
    }
}

/// Convenience function to run DRC.
pub fn run_drc(cell: &Cell, rules: &DrcRules, library: Option<&Library>) -> DrcResult {
    DrcRunner::new(rules.clone()).check(cell, library)
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::Point;

    #[test]
    fn test_empty_cell() {
        let cell = Cell::new("empty");
        let rules = DrcRules::new().min_area(Layer::new(1, 0), 1.0, None);

        let result = run_drc(&cell, &rules, None);
        assert!(result.passed());
        assert_eq!(result.stats.polygons_checked, 0);
    }

    #[test]
    fn test_min_area_pass() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 10.0), Layer::new(1, 0));

        let rules = DrcRules::new().min_area(Layer::new(1, 0), 50.0, None);
        let result = run_drc(&cell, &rules, None);

        assert!(result.passed());
    }

    #[test]
    fn test_min_area_fail() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 2.0, 2.0), Layer::new(1, 0));

        let rules = DrcRules::new().min_area(Layer::new(1, 0), 50.0, Some("MIN_AREA"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 1);
        assert_eq!(result.violations[0].rule_name, Some("MIN_AREA".to_string()));
    }

    #[test]
    fn test_multiple_rules() {
        let mut cell = Cell::new("test");
        cell.add_polygon(Polygon::rect(Point::origin(), 2.0, 2.0), Layer::new(1, 0));

        let rules = DrcRules::new()
            .min_area(Layer::new(1, 0), 50.0, None)
            .min_width(Layer::new(1, 0), 5.0, None);

        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 2);
        assert_eq!(result.stats.rules_checked, 2);
    }
}
