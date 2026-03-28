//! DRC execution engine.

use std::collections::HashMap;
use std::time::{Duration, Instant};

use rosette_core::cell::Element;
use rosette_core::{Cell, Layer, Library, Point, Polygon, Transform, offset_polygon};

use crate::checks::{
    check_angles, check_area, check_edge_length, check_enclosure, check_forbid_overlap,
    check_max_width, check_require_overlap, check_self_intersection, check_spacing, check_width,
};
use crate::rules::{DrcRules, Rule};
use crate::violation::{DrcViolation, RuleType, Severity};

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
    ///
    /// Handles all element types:
    /// - Polygons are transformed directly
    /// - Paths are converted to polygon ribbons via `offset_polygon`
    /// - CellRefs are recursively expanded, including array repetitions
    /// - Text elements are skipped (not geometric)
    fn flatten_cell(
        &self,
        cell: &Cell,
        library: Option<&Library>,
        transform: &Transform,
    ) -> HashMap<Layer, Vec<(Polygon, usize)>> {
        let mut result: HashMap<Layer, Vec<(Polygon, usize)>> = HashMap::new();
        let mut global_index = 0usize;

        for element in cell.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    let transformed = polygon.transform(transform);
                    result
                        .entry(*layer)
                        .or_default()
                        .push((transformed, global_index));
                    global_index += 1;
                }
                Element::Path {
                    points,
                    width,
                    layer,
                    ..
                } => {
                    // Transform path points and scale width
                    let transformed_points: Vec<Point> =
                        points.iter().map(|p| transform.apply(*p)).collect();
                    let scale = (transform.a.powi(2) + transform.c.powi(2)).sqrt();
                    let scaled_width = *width * scale;

                    // Convert to polygon ribbon (same as flatten.rs)
                    if let Some(ribbon) = offset_polygon(&transformed_points, scaled_width) {
                        result
                            .entry(*layer)
                            .or_default()
                            .push((ribbon, global_index));
                        global_index += 1;
                    }
                }
                Element::CellRef(cell_ref) => {
                    if let Some(lib) = library
                        && let Some(ref_cell) = lib.cell(&cell_ref.cell_name)
                    {
                        // Build list of transforms, expanding repetitions
                        let transforms = match &cell_ref.repetition {
                            None => vec![cell_ref.transform],
                            Some(rep) if rep.is_single() => vec![cell_ref.transform],
                            Some(rep) => {
                                let mut ts = Vec::with_capacity(rep.count());
                                for row in 0..rep.rows {
                                    for col in 0..rep.columns {
                                        let dx = col as f64 * rep.col_spacing;
                                        let dy = row as f64 * rep.row_spacing;
                                        ts.push(
                                            Transform::translate(dx, dy).then(&cell_ref.transform),
                                        );
                                    }
                                }
                                ts
                            }
                        };

                        for copy_transform in transforms {
                            let combined = transform.then(&copy_transform);
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
                Element::Text { .. } => {
                    // Skip text elements — not geometric
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
                    (Some(p1), Some(p2)) => check_spacing(
                        p1,
                        *layer1,
                        p2,
                        *layer2,
                        *spacing,
                        name.as_deref(),
                        layer1 == layer2,
                    ),
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
                        // For each inner polygon, check if ANY outer polygon encloses it.
                        // Only report a violation if no outer polygon provides sufficient enclosure.
                        for (inner_poly, _) in ip {
                            let mut best_violation: Option<DrcViolation> = None;
                            let mut is_enclosed = false;

                            for (outer_poly, _) in op {
                                match check_enclosure(
                                    inner_poly,
                                    *inner,
                                    outer_poly,
                                    *outer,
                                    *enclosure,
                                    name.as_deref(),
                                ) {
                                    None => {
                                        // This outer polygon encloses the inner one — no violation
                                        is_enclosed = true;
                                        break;
                                    }
                                    Some(v) => {
                                        // Keep the closest near-miss (largest actual value).
                                        // This gives the most actionable report: "you need 0.1
                                        // more enclosure" is more useful than "no enclosure
                                        // at all" from a distant unrelated outer polygon.
                                        let dominated = best_violation.as_ref().is_none_or(|bv| {
                                            match (&bv.rule_type, &v.rule_type) {
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
                                            }
                                        });
                                        if dominated {
                                            best_violation = Some(v);
                                        }
                                    }
                                }
                            }

                            if !is_enclosed && let Some(v) = best_violation {
                                violations.push(v);
                            }
                        }
                        violations
                    }
                    (Some(ip), None) => {
                        // Inner polygons exist but no outer polygons — every inner is unenclosed
                        let mut violations = Vec::new();
                        for (inner_poly, _) in ip {
                            let mut violation = DrcViolation::new(
                                RuleType::Enclosure {
                                    required: *enclosure,
                                    actual: 0.0,
                                },
                                inner_poly.bbox(),
                                *inner,
                                format!(
                                    "Inner layer ({}, {}) has no enclosing geometry on outer layer ({}, {})",
                                    inner.number, inner.datatype, outer.number, outer.datatype
                                ),
                            )
                            .with_layer2(*outer)
                            .with_severity(Severity::Error);

                            if let Some(name) = name {
                                violation = violation.with_name(name);
                            }

                            violations.push(violation);
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
                                let mut violation = DrcViolation::new(
                                    RuleType::MissingOverlap,
                                    poly1.bbox(),
                                    *layer1,
                                    format!(
                                        "Polygon on Layer({}, {}) has no overlap with Layer({}, {})",
                                        layer1.number, layer1.datatype, layer2.number, layer2.datatype
                                    ),
                                )
                                .with_layer2(*layer2)
                                .with_severity(Severity::Error);

                                if let Some(name) = name {
                                    violation = violation.with_name(name);
                                }

                                violations.push(violation);
                            }
                        }
                        violations
                    }
                    (Some(p1), None) => {
                        // Layer1 polygons exist but layer2 has nothing — every layer1 poly
                        // is missing the required overlap.
                        let mut violations = Vec::new();
                        for (poly1, _) in p1 {
                            let mut violation = DrcViolation::new(
                                RuleType::MissingOverlap,
                                poly1.bbox(),
                                *layer1,
                                format!(
                                    "Polygon on Layer({}, {}) has no overlap with Layer({}, {}) (layer is empty)",
                                    layer1.number, layer1.datatype, layer2.number, layer2.datatype
                                ),
                            )
                            .with_layer2(*layer2)
                            .with_severity(Severity::Error);

                            if let Some(name) = name {
                                violation = violation.with_name(name);
                            }

                            violations.push(violation);
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

            Rule::MinEdgeLength {
                layer,
                length,
                name,
            } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .flat_map(|(poly, _)| check_edge_length(poly, *layer, *length, name.as_deref()))
                    .collect()
            }

            Rule::SelfIntersection { layer, name } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .filter_map(|(poly, _)| check_self_intersection(poly, *layer, name.as_deref()))
                    .collect()
            }

            Rule::MaxWidth { layer, width, name } => {
                let Some(polys) = polygons_by_layer.get(layer) else {
                    return Vec::new();
                };

                polys
                    .iter()
                    .filter_map(|(poly, _)| check_max_width(poly, *layer, *width, name.as_deref()))
                    .collect()
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
    use rosette_core::{CellRef, Point};

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

    // --- Bug fix tests ---

    #[test]
    fn test_require_overlap_propagates_name_and_layer2() {
        // Two non-overlapping polygons on different layers with a named require_overlap rule
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(20.0, 0.0), 5.0, 5.0),
            Layer::new(2, 0),
        );

        let rules =
            DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(2, 0), Some("VIA_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 1);

        let v = &result.violations[0];
        assert_eq!(v.rule_name, Some("VIA_OVLP".to_string()));
        assert_eq!(v.layer, Layer::new(1, 0));
        assert_eq!(v.layer2, Some(Layer::new(2, 0)));
        assert!(matches!(v.rule_type, RuleType::MissingOverlap));
    }

    #[test]
    fn test_require_overlap_empty_layer2() {
        // Polygon on layer1 but nothing on layer2 — should still report violation
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(2, 0), Some("MUST_OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 1);

        let v = &result.violations[0];
        assert_eq!(v.rule_name, Some("MUST_OVLP".to_string()));
        assert_eq!(v.layer2, Some(Layer::new(2, 0)));
        assert!(v.message.contains("layer is empty"));
    }

    #[test]
    fn test_require_overlap_passes_when_overlapping() {
        // Overlapping polygons should pass
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
            Layer::new(2, 0),
        );

        let rules =
            DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(2, 0), Some("OVLP"));
        let result = run_drc(&cell, &rules, None);

        assert!(result.passed());
    }

    #[test]
    fn test_enclosure_any_outer_sufficient() {
        // Inner polygon enclosed by the second outer polygon but not the first.
        // Should pass because ANY outer is sufficient.
        let mut cell = Cell::new("test");

        // Inner: small box at (50, 50)
        cell.add_polygon(
            Polygon::rect(Point::new(50.0, 50.0), 5.0, 5.0),
            Layer::new(2, 0),
        );
        // Outer 1: far away — does NOT enclose inner
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0),
            Layer::new(1, 0),
        );
        // Outer 2: large box around inner — DOES enclose it
        cell.add_polygon(
            Polygon::rect(Point::new(40.0, 40.0), 25.0, 25.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().min_enclosure(Layer::new(2, 0), Layer::new(1, 0), 4.0, Some("ENC"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            result.passed(),
            "Should pass because outer2 encloses inner, got {} violations",
            result.violations.len()
        );
    }

    #[test]
    fn test_enclosure_fails_when_no_outer_encloses() {
        // Inner polygon not enclosed by any outer polygon
        let mut cell = Cell::new("test");

        // Inner: box at (50, 50)
        cell.add_polygon(
            Polygon::rect(Point::new(50.0, 50.0), 5.0, 5.0),
            Layer::new(2, 0),
        );
        // Outer 1: too far away
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0),
            Layer::new(1, 0),
        );

        let rules =
            DrcRules::new().min_enclosure(Layer::new(2, 0), Layer::new(1, 0), 1.0, Some("ENC"));
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 1);
        assert_eq!(result.violations[0].rule_name, Some("ENC".to_string()));
    }

    #[test]
    fn test_enclosure_no_outer_polygons() {
        // Inner polygon exists but no outer polygons at all
        let mut cell = Cell::new("test");
        cell.add_polygon(
            Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
            Layer::new(2, 0),
        );

        let rules = DrcRules::new().min_enclosure(
            Layer::new(2, 0),
            Layer::new(1, 0),
            1.0,
            Some("ENC_MISSING"),
        );
        let result = run_drc(&cell, &rules, None);

        assert!(!result.passed());
        assert_eq!(result.violations.len(), 1);

        let v = &result.violations[0];
        assert_eq!(v.rule_name, Some("ENC_MISSING".to_string()));
        assert_eq!(v.layer2, Some(Layer::new(1, 0)));
    }

    #[test]
    fn test_flatten_handles_repetition() {
        // Create a child cell with a small polygon
        let mut child = Cell::new("child");
        child.add_polygon(Polygon::rect(Point::origin(), 2.0, 2.0), Layer::new(1, 0));

        // Create top cell with an array reference: 3 columns, 2 rows
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("child").array(3, 2, 10.0, 20.0));

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        // min_area rule that passes for each instance
        let rules = DrcRules::new().min_area(Layer::new(1, 0), 1.0, None);
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(result.passed());
        // 3 columns * 2 rows = 6 polygon instances
        assert_eq!(
            result.stats.polygons_checked, 6,
            "Expected 6 polygons from 3x2 array, got {}",
            result.stats.polygons_checked
        );
    }

    #[test]
    fn test_flatten_handles_repetition_spacing() {
        // Array of small polygons that are too close together
        let mut child = Cell::new("child");
        child.add_polygon(Polygon::rect(Point::origin(), 3.0, 3.0), Layer::new(1, 0));

        // 2 columns with 5.0 spacing — gap is only 2.0 (5.0 - 3.0)
        let mut top = Cell::new("top");
        top.add_ref(CellRef::new("child").array(2, 1, 5.0, 10.0));

        let mut lib = Library::new("test_lib");
        lib.add_cell(child).unwrap();
        lib.add_cell(top).unwrap();

        let rules =
            DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(1, 0), 3.0, Some("SPC"));
        let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

        assert!(
            !result.passed(),
            "Should fail: gap is 2.0 but min_spacing is 3.0"
        );
    }

    #[test]
    fn test_flatten_handles_paths() {
        // Cell with a path element — should be converted to polygon for DRC
        let mut cell = Cell::new("test");
        cell.add_path_simple(
            vec![Point::new(0.0, 0.0), Point::new(20.0, 0.0)],
            2.0,
            Layer::new(1, 0),
        );

        // The path (width=2.0, length=20.0) becomes a polygon with area ~40
        let rules = DrcRules::new().min_area(Layer::new(1, 0), 30.0, None);
        let result = run_drc(&cell, &rules, None);

        assert_eq!(
            result.stats.polygons_checked, 1,
            "Path should be converted to 1 polygon"
        );
        assert!(
            result.passed(),
            "Path-derived polygon should pass min_area=30"
        );
    }

    #[test]
    fn test_flatten_path_width_checked() {
        // Path with width 1.0 should fail min_width=2.0
        let mut cell = Cell::new("test");
        cell.add_path_simple(
            vec![Point::new(0.0, 0.0), Point::new(20.0, 0.0)],
            1.0,
            Layer::new(1, 0),
        );

        let rules = DrcRules::new().min_width(Layer::new(1, 0), 2.0, Some("PATH_W"));
        let result = run_drc(&cell, &rules, None);

        assert!(
            !result.passed(),
            "Path with width=1.0 should fail min_width=2.0"
        );
    }
}
