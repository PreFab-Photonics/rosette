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

    let rules = DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(2, 0), Some("OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(result.passed());
}

#[test]
fn test_require_overlap_same_layer_isolated_polygon_fails() {
    // A single polygon has no other polygon to overlap with
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    let rules =
        DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("SELF_OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(
        !result.passed(),
        "Single polygon should fail same-layer require_overlap (no other polygon to overlap)"
    );
    assert_eq!(result.violations.len(), 1);
}

#[test]
fn test_require_overlap_same_layer_overlapping_passes() {
    // Two overlapping polygons on the same layer should pass
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    cell.add_polygon(
        Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    let rules =
        DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("SELF_OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(
        result.passed(),
        "Two overlapping same-layer polygons should pass require_overlap"
    );
}

#[test]
fn test_require_overlap_same_layer_non_overlapping_fails() {
    // Two non-overlapping polygons should each fail (neither overlaps another)
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    cell.add_polygon(
        Polygon::rect(Point::new(10.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    let rules =
        DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("SELF_OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(
        !result.passed(),
        "Two non-overlapping same-layer polygons should fail require_overlap"
    );
    assert_eq!(
        result.violations.len(),
        2,
        "Each polygon should have its own violation"
    );
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

    let rules = DrcRules::new().min_enclosure(Layer::new(2, 0), Layer::new(1, 0), 4.0, Some("ENC"));
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

    let rules = DrcRules::new().min_enclosure(Layer::new(2, 0), Layer::new(1, 0), 1.0, Some("ENC"));
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

    let rules =
        DrcRules::new().min_enclosure(Layer::new(2, 0), Layer::new(1, 0), 1.0, Some("ENC_MISSING"));
    let result = run_drc(&cell, &rules, None);

    assert!(!result.passed());
    assert_eq!(result.violations.len(), 1);

    let v = &result.violations[0];
    assert_eq!(v.rule_name, Some("ENC_MISSING".to_string()));
    assert_eq!(v.layer2, Some(Layer::new(1, 0)));
}

#[test]
fn test_forbid_overlap_same_layer_no_self_compare() {
    // A single polygon on a layer must not be flagged against itself
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(
        result.passed(),
        "Single polygon should not trigger same-layer forbid_overlap (self-comparison)"
    );
}

#[test]
fn test_forbid_overlap_same_layer_detects_overlap() {
    // Two overlapping polygons on the same layer should be flagged
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    cell.add_polygon(
        Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(
        !result.passed(),
        "Two overlapping same-layer polygons should fail forbid_overlap"
    );
    assert_eq!(
        result.violations.len(),
        1,
        "Should produce exactly one violation (no duplicate)"
    );
    assert_eq!(result.violations[0].rule_name, Some("NO_OVLP".to_string()));

    // Intra-cell violations should have both cell names set to the same cell
    let v = &result.violations[0];
    assert_eq!(v.cell_name, Some("test".to_string()));
    assert_eq!(v.cell_name2, Some("test".to_string()));
}

#[test]
fn test_forbid_overlap_same_layer_non_overlapping_passes() {
    // Two non-overlapping polygons on the same layer should pass
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    cell.add_polygon(
        Polygon::rect(Point::new(10.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(
        result.passed(),
        "Two non-overlapping same-layer polygons should pass forbid_overlap"
    );
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

    let rules = DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(1, 0), 3.0, Some("SPC"));
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

#[test]
fn test_forbid_overlap_cross_hierarchy() {
    // Child cell has a polygon at (0,0)-(5,5).
    // Top cell has a polygon at (3,0)-(8,5) AND a CellRef to child.
    // The two polygons overlap — DRC should catch it across hierarchy.
    let mut child = Cell::new("child");
    child.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    let mut top = Cell::new("top");
    top.add_polygon(
        Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    top.add_ref(CellRef::new("child"));

    let mut lib = Library::new("test_lib");
    lib.add_cell(child).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

    assert!(
        !result.passed(),
        "Cross-hierarchy overlapping polygons should fail forbid_overlap"
    );
    assert_eq!(result.violations.len(), 1);
    assert_eq!(
        result.stats.polygons_checked, 2,
        "Should see 2 polygons: one from top, one from child"
    );

    // Verify cell names are attached to the violation
    let v = &result.violations[0];
    assert!(v.cell_name.is_some(), "cell_name should be set");
    assert!(v.cell_name2.is_some(), "cell_name2 should be set");
    // One should be "top", the other "child" (order depends on group iteration)
    let names: std::collections::HashSet<&str> = [
        v.cell_name.as_deref().unwrap(),
        v.cell_name2.as_deref().unwrap(),
    ]
    .into_iter()
    .collect();
    assert!(names.contains("top"), "violation should reference 'top'");
    assert!(
        names.contains("child"),
        "violation should reference 'child'"
    );
}

#[test]
fn test_forbid_overlap_cross_hierarchy_no_overlap_passes() {
    // Child cell polygon at (0,0)-(5,5), top cell polygon at (10,0)-(15,5).
    // No overlap — should pass.
    let mut child = Cell::new("child");
    child.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    let mut top = Cell::new("top");
    top.add_polygon(
        Polygon::rect(Point::new(10.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    top.add_ref(CellRef::new("child"));

    let mut lib = Library::new("test_lib");
    lib.add_cell(child).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

    assert!(
        result.passed(),
        "Non-overlapping cross-hierarchy polygons should pass"
    );
}

#[test]
fn test_forbid_overlap_array_instances_overlap() {
    // Child cell has a 4-wide polygon. Array with col_spacing=3 means
    // copies overlap by 1 unit each.
    let mut child = Cell::new("child");
    child.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 4.0, 2.0),
        Layer::new(1, 0),
    );

    let mut top = Cell::new("top");
    top.add_ref(CellRef::new("child").array(3, 1, 3.0, 10.0));

    let mut lib = Library::new("test_lib");
    lib.add_cell(child).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

    assert!(
        !result.passed(),
        "Array instances with overlapping polygons should fail forbid_overlap"
    );
    // 3 copies: pairs (0,1) and (1,2) overlap, but (0,2) don't
    assert_eq!(
        result.violations.len(),
        2,
        "Should have 2 violations for 3 overlapping-adjacent copies"
    );
}

#[test]
fn test_forbid_overlap_many_non_overlapping_fast() {
    // Many non-overlapping polygons spread apart. The bbox pre-filter should
    // skip expensive boolean intersection for all pairs.
    let mut cell = Cell::new("test");
    for i in 0..50 {
        cell.add_polygon(
            Polygon::rect(Point::new(i as f64 * 20.0, 0.0), 5.0, 5.0),
            Layer::new(1, 0),
        );
    }

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(
        result.passed(),
        "Well-spaced polygons should not trigger overlap violations"
    );
    assert_eq!(result.stats.polygons_checked, 50);
}

#[test]
fn test_require_overlap_many_separated_fast() {
    // Mirror of test_forbid_overlap_many_non_overlapping_fast but for
    // require_overlap. 50 polygons on layer1 each paired with an overlapping
    // polygon on layer2. The R-tree bulk path should resolve these in
    // O(n log n) rather than O(n*m) boolean intersections.
    let mut cell = Cell::new("test");
    let layer1 = Layer::new(1, 0);
    let layer2 = Layer::new(2, 0);

    for i in 0..50 {
        let x = i as f64 * 20.0;
        cell.add_polygon(Polygon::rect(Point::new(x, 0.0), 5.0, 5.0), layer1);
        cell.add_polygon(Polygon::rect(Point::new(x + 1.0, 0.0), 5.0, 5.0), layer2);
    }

    let rules = DrcRules::new().require_overlap(layer1, layer2, Some("REQ_OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(
        result.passed(),
        "Each layer1 polygon overlaps a layer2 polygon — should pass"
    );
    assert_eq!(result.stats.polygons_checked, 100);
}

#[test]
fn test_require_overlap_many_no_match_reports_all() {
    // 50 polygons on layer1, none on layer2. Every polygon should report a
    // missing-overlap violation.
    let mut cell = Cell::new("test");
    let layer1 = Layer::new(1, 0);
    let layer2 = Layer::new(2, 0);

    for i in 0..50 {
        cell.add_polygon(
            Polygon::rect(Point::new(i as f64 * 20.0, 0.0), 5.0, 5.0),
            layer1,
        );
    }

    let rules = DrcRules::new().require_overlap(layer1, layer2, Some("REQ_OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(!result.passed());
    assert_eq!(
        result.violations.len(),
        50,
        "Each polygon should have a missing-overlap violation"
    );
}

#[test]
fn test_spacing_skip_touching_at_ports() {
    // Simulate route polygon abutting component polygon at a port connection.
    // Touching polygons (distance=0) should NOT produce spacing violations.
    let mut cell = Cell::new("test");
    // Component polygon: 0..10 x 0..2
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 10.0, 2.0),
        Layer::new(1, 0),
    );
    // Route polygon: 10..20 x 0..2 (abuts at x=10)
    cell.add_polygon(
        Polygon::rect(Point::new(10.0, 0.0), 10.0, 2.0),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(1, 0), 0.15, Some("SPC"));
    let result = run_drc(&cell, &rules, None);

    assert!(
        result.passed(),
        "Touching polygons at port connections should not fail spacing"
    );
}

#[test]
fn test_non_rigid_transform_catches_width_violation() {
    // A child cell has a polygon with width 0.5 (passes min_width=0.15).
    // When scaled 0.1x in X direction, the actual width becomes 0.05 (fails).
    // The hierarchy-aware DRC must detect this despite the cell being reused.
    let mut child = Cell::new("narrow");
    // 0.5 wide, 10 long rectangle
    child.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.5),
        Layer::new(1, 0),
    );

    // Create top cell with two refs: one rigid (passes), one scaled (should fail)
    let mut top = Cell::new("top");
    // Rigid instance at origin — width is 0.5, passes min_width=0.15
    top.add_ref(CellRef::new("narrow"));
    // Non-uniform scale: 0.1x in X — polygon becomes 1.0 x 0.05, width = 0.05
    top.add_ref(CellRef::with_transform(
        "narrow",
        Transform::scale(0.1, 0.1),
    ));

    let mut lib = Library::new("test_lib");
    lib.add_cell(child).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.15, Some("WIDTH"));
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

    assert!(
        !result.passed(),
        "Non-rigid scaled instance with insufficient width should fail min_width"
    );
}

#[test]
fn test_rigid_transform_detects_once_emits_per_instance() {
    // Per ROS-552: per-polygon rules detect each unique cell once but
    // emit one violation per rigid instance, carrying the owning
    // `cell_name` and a `location` in top-level global coordinates.
    let mut child = Cell::new("tiny");
    // 0.05 wide polygon — fails min_width=0.15
    child.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 0.05),
        Layer::new(1, 0),
    );

    let mut top = Cell::new("top");
    // 3 rigid instances at different positions
    top.add_ref(CellRef::new("tiny").at(0.0, 0.0));
    top.add_ref(CellRef::new("tiny").at(100.0, 0.0));
    top.add_ref(CellRef::new("tiny").at(200.0, 0.0));

    let mut lib = Library::new("test_lib");
    lib.add_cell(child).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.15, Some("WIDTH"));
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

    assert!(!result.passed());
    // One violation per rigid instance (3), each attributed to the child
    // cell with a distinct global-coord bbox.
    assert_eq!(
        result.violations.len(),
        3,
        "Per-polygon violations should be emitted once per rigid instance"
    );
    let xs: Vec<f64> = result
        .violations
        .iter()
        .map(|v| v.location.min().x)
        .collect();
    assert!(xs.contains(&0.0));
    assert!(xs.contains(&100.0));
    assert!(xs.contains(&200.0));
    for v in &result.violations {
        assert_eq!(v.cell_name.as_deref(), Some("tiny"));
        assert!(v.cell_name2.is_none());
    }
}

#[test]
fn test_snap_to_grid_simple_pass() {
    // On-grid polygon passes snap-to-grid check.
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 0.5),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new().snap_to_grid(Layer::new(1, 0), 0.001, None);
    let result = run_drc(&cell, &rules, None);
    assert!(result.passed());
}

#[test]
fn test_snap_to_grid_simple_fail() {
    // Off-grid polygon fails snap-to-grid check.
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(0.5, 0.0),
            Point::new(0.5, 0.003),
            Point::new(0.0, 0.003),
        ]),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new().snap_to_grid(Layer::new(1, 0), 0.005, None);
    let result = run_drc(&cell, &rules, None);
    assert!(!result.passed());
}

#[test]
fn test_snap_to_grid_off_grid_translation() {
    // A child cell has on-grid local vertices, but is placed at an off-grid
    // translation. The snap-to-grid check must catch this because the final
    // world coordinates are off-grid.
    let mut child = Cell::new("block");
    // All vertices are multiples of 0.005 (on 5nm grid locally)
    child.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 0.5, 0.25),
        Layer::new(1, 0),
    );

    let mut top = Cell::new("top");
    // Place at x=0.003 — off the 5nm grid
    top.add_ref(CellRef::new("block").at(0.003, 0.0));

    let mut lib = Library::new("test_lib");
    lib.add_cell(child).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().snap_to_grid(Layer::new(1, 0), 0.005, Some("GRID"));
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

    assert!(
        !result.passed(),
        "Off-grid translation should be caught even if local vertices are on-grid"
    );
    // All 4 rect vertices are shifted by 0.003 in x, so all are off-grid
    assert!(
        !result.violations.is_empty(),
        "Expected violations for off-grid translated vertices"
    );
}

#[test]
fn test_snap_to_grid_on_grid_translation() {
    // Child cell placed at on-grid translation should pass.
    let mut child = Cell::new("block");
    child.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 0.5, 0.25),
        Layer::new(1, 0),
    );

    let mut top = Cell::new("top");
    // Place at x=0.005 — on the 5nm grid
    top.add_ref(CellRef::new("block").at(0.005, 0.0));

    let mut lib = Library::new("test_lib");
    lib.add_cell(child).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().snap_to_grid(Layer::new(1, 0), 0.005, None);
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

    assert!(result.passed(), "On-grid translation should pass");
}

// --- warning_margin tests (ROS-521) ---

#[test]
fn test_warning_margin_off_by_default_min_width() {
    // With no warning_margin, a near-threshold width is an error.
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::origin(), 0.115, 10.0),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.12, Some("W"));
    let result = run_drc(&cell, &rules, None);

    assert!(!result.passed(), "Legacy: any violation fails");
    assert_eq!(result.error_count(), 1);
    assert_eq!(result.warning_count(), 0);
    assert_eq!(result.violations[0].severity, Severity::Error);
}

#[test]
fn test_warning_margin_downgrades_near_threshold_width() {
    // 0.115 < 0.12 (violation) but within margin 0.01 of 0.12 → warning.
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::origin(), 0.115, 10.0),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new()
        .warning_margin(0.01)
        .min_width(Layer::new(1, 0), 0.12, Some("W"));
    let result = run_drc(&cell, &rules, None);

    assert!(result.passed(), "Warnings should not cause the run to fail");
    assert_eq!(result.error_count(), 0);
    assert_eq!(result.warning_count(), 1);
    assert_eq!(result.violations[0].severity, Severity::Warning);
}

#[test]
fn test_warning_margin_keeps_far_violations_as_errors() {
    // 0.05 is far below 0.12 (well outside margin 0.01) → still an error.
    let mut cell = Cell::new("test");
    cell.add_polygon(Polygon::rect(Point::origin(), 0.05, 10.0), Layer::new(1, 0));

    let rules = DrcRules::new()
        .warning_margin(0.01)
        .min_width(Layer::new(1, 0), 0.12, Some("W"));
    let result = run_drc(&cell, &rules, None);

    assert!(!result.passed(), "Far-below-threshold should still error");
    assert_eq!(result.error_count(), 1);
    assert_eq!(result.warning_count(), 0);
}

#[test]
fn test_warning_margin_applies_to_min_spacing() {
    // Two polygons with a 0.11 gap, min_spacing=0.12, margin=0.02.
    // Gap 0.11 is within [0.10, 0.12) → warning.
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
        Layer::new(1, 0),
    );
    cell.add_polygon(
        Polygon::rect(Point::new(1.11, 0.0), 1.0, 1.0),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new().warning_margin(0.02).min_spacing(
        Layer::new(1, 0),
        Layer::new(1, 0),
        0.12,
        Some("S"),
    );
    let result = run_drc(&cell, &rules, None);

    assert_eq!(result.violation_count(), 1);
    assert_eq!(result.violations[0].severity, Severity::Warning);
    assert!(result.passed());
}

#[test]
fn test_warning_margin_applies_to_max_width() {
    // max_width = 5.0, actual = 5.05, margin = 0.1 → warning.
    let mut cell = Cell::new("test");
    cell.add_polygon(Polygon::rect(Point::origin(), 5.05, 10.0), Layer::new(1, 0));

    let rules = DrcRules::new()
        .warning_margin(0.1)
        .max_width(Layer::new(1, 0), 5.0, Some("MW"));
    let result = run_drc(&cell, &rules, None);

    assert_eq!(result.violation_count(), 1);
    assert_eq!(result.violations[0].severity, Severity::Warning);
    assert!(result.passed());
}

#[test]
fn test_warning_margin_does_not_downgrade_categorical() {
    // Forbidden-overlap is binary — a warning_margin must not silence it.
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    cell.add_polygon(
        Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new()
        .warning_margin(999.0) // huge — must not matter
        .forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(!result.passed());
    assert_eq!(result.error_count(), 1);
    assert_eq!(result.warning_count(), 0);
}

#[test]
fn test_warning_margin_mixed_result() {
    // Two rules: one produces a warning, one produces an error.
    // Overall `passed()` should be false because of the error.
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::origin(), 0.115, 10.0),
        Layer::new(1, 0),
    );
    cell.add_polygon(
        Polygon::rect(Point::new(100.0, 0.0), 0.02, 10.0),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new()
        .warning_margin(0.01)
        .min_width(Layer::new(1, 0), 0.12, Some("W"));
    let result = run_drc(&cell, &rules, None);

    assert!(
        !result.passed(),
        "Should fail because at least one error remains"
    );
    assert_eq!(result.error_count(), 1);
    assert_eq!(result.warning_count(), 1);
}

#[test]
fn test_warning_margin_zero_disables() {
    // Explicit zero should behave identically to `None`.
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::origin(), 0.115, 10.0),
        Layer::new(1, 0),
    );

    let rules = DrcRules::new()
        .warning_margin(0.0)
        .min_width(Layer::new(1, 0), 0.12, Some("W"));
    let result = run_drc(&cell, &rules, None);

    assert!(!result.passed());
    assert_eq!(result.error_count(), 1);
}

#[test]
fn test_warning_margin_does_not_apply_to_min_area() {
    // `warning_margin` is expressed in length units (typically µm).
    // `MinArea` thresholds are in µm², so mixing them would silently
    // downgrade huge area violations for a small length-unit margin.
    // The policy is: `MinArea` violations are never downgraded.
    let mut cell = Cell::new("test");
    // Area = 0.0099 µm²; threshold = 0.01 µm²; shortfall = 0.0001 µm².
    // With a 0.01-µm margin, a naive comparison would downgrade to a
    // warning — which we explicitly do NOT want.
    cell.add_polygon(Polygon::rect(Point::origin(), 0.099, 0.1), Layer::new(1, 0));

    let rules = DrcRules::new()
        .warning_margin(0.01)
        .min_area(Layer::new(1, 0), 0.01, Some("A"));
    let result = run_drc(&cell, &rules, None);

    assert!(!result.passed(), "MinArea violations must stay errors");
    assert_eq!(result.error_count(), 1);
    assert_eq!(result.warning_count(), 0);
    assert_eq!(result.violations[0].severity, Severity::Error);
}

// --- Density check tests (ROS-520) ---

#[test]
fn test_density_passes_uniform_fill() {
    // Region = cell's own 100x100 fill. Single big polygon gives density=1.0.
    // Rule: max=None (no upper), min=0.5 — passes everywhere.
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 100.0, 100.0),
        Layer::new(1, 0),
    );
    let rules = DrcRules::new().density(
        Layer::new(1, 0),
        Some(0.5),
        None,
        50.0,
        50.0,
        None,
        Some("DENS"),
    );
    let result = run_drc(&cell, &rules, None);
    assert!(result.passed(), "Full fill should pass min=0.5");
}

#[test]
fn test_density_fails_above_max() {
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 100.0, 100.0),
        Layer::new(1, 0),
    );
    let rules = DrcRules::new().density(
        Layer::new(1, 0),
        None,
        Some(0.8),
        50.0,
        50.0,
        None,
        Some("DENS"),
    );
    let result = run_drc(&cell, &rules, None);
    assert!(!result.passed(), "Full fill should fail max=0.8");
    // Windows at (0,0), (50,0), (0,50), (50,50) -> 4 violations
    assert!(!result.violations.is_empty());
    assert_eq!(result.violations[0].rule_name.as_deref(), Some("DENS"));
    if let RuleType::Density { actual, .. } = result.violations[0].rule_type {
        assert!(actual > 0.99);
    } else {
        panic!("expected Density rule type");
    }
}

#[test]
fn test_density_region_layer_limits_scope() {
    // Target polygon on layer 1 fills the right half.
    // Region layer (99) only covers the left half — where there's nothing.
    // So measured density in the region is 0 -> fails min=0.2.
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(50.0, 0.0), 50.0, 100.0),
        Layer::new(1, 0),
    );
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 50.0, 100.0),
        Layer::new(99, 0),
    );
    let rules = DrcRules::new().density(
        Layer::new(1, 0),
        Some(0.2),
        None,
        25.0,
        25.0,
        Some(Layer::new(99, 0)),
        None,
    );
    let result = run_drc(&cell, &rules, None);
    assert!(
        !result.passed(),
        "Density inside region (left half) is 0, should fail min=0.2"
    );
}

#[test]
fn test_density_aggregates_across_array() {
    // A small filled cell arrayed across a region. Verify density
    // aggregates across instances (hierarchical flattening).
    let mut child = Cell::new("child");
    // 5x5 filled tile
    child.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    // 10 columns x 10 rows at pitch 10.0 -> tiles at x=0, 10, ..., 90.
    // Fill spans [0, 95] x [0, 95]. Use region_layer explicitly so the
    // bbox is a clean [0, 100] x [0, 100].
    let mut top = Cell::new("top");
    top.add_ref(CellRef::new("child").array(10, 10, 10.0, 10.0));
    top.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 100.0, 100.0),
        Layer::new(99, 0),
    );

    let mut lib = Library::new("test_lib");
    lib.add_cell(child).unwrap();
    lib.add_cell(top).unwrap();

    // 100 tiles, each 5x5 = 25 area, total = 2500. Region = 10000.
    // Density = 2500 / 10000 = 0.25
    let rules = DrcRules::new().density(
        Layer::new(1, 0),
        Some(0.5), // density is 0.25, below min=0.5 -> fail
        None,
        100.0,
        100.0,
        Some(Layer::new(99, 0)),
        Some("DENS_ARR"),
    );
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
    assert!(
        !result.passed(),
        "Arrayed 25% fill should fail min=0.5, got {} violations",
        result.violations.len()
    );

    // Flip: same fill should pass min=0.2
    let rules_ok = DrcRules::new().density(
        Layer::new(1, 0),
        Some(0.2),
        None,
        100.0,
        100.0,
        Some(Layer::new(99, 0)),
        None,
    );
    let result_ok = run_drc(lib.cell("top").unwrap(), &rules_ok, Some(&lib));
    assert!(
        result_ok.passed(),
        "Arrayed 25% fill should pass min=0.2, got {} violations",
        result_ok.violations.len()
    );
}

#[test]
fn test_density_empty_design_skips_silently() {
    // Truly empty design: no geometry anywhere. Density is undefined
    // (no region to measure over), so the check is a silent no-op.
    // Users who want density enforced over an explicit floor-plan must
    // declare a region_layer.
    let cell = Cell::new("empty");
    let rules = DrcRules::new().density(
        Layer::new(1, 0),
        Some(0.2),
        Some(0.8),
        100.0,
        100.0,
        None,
        None,
    );
    let result = run_drc(&cell, &rules, None);
    assert!(result.passed());
}

#[test]
fn test_density_empty_target_layer_inside_populated_design() {
    // Target layer has no geometry, but the design has geometry on
    // another layer. Fallback region = bbox of placed geometry.
    // Measured density on the empty target = 0 everywhere -> fails min.
    let mut cell = Cell::new("test");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 100.0, 100.0),
        Layer::new(2, 0),
    );
    let rules = DrcRules::new().density(
        Layer::new(1, 0), // target layer: no polygons
        Some(0.2),
        None,
        50.0,
        50.0,
        None, // no region_layer -> fallback to placed-geometry bbox
        Some("DENS"),
    );
    let result = run_drc(&cell, &rules, None);
    assert!(
        !result.passed(),
        "Empty target layer inside populated design should fail min=0.2"
    );
    assert!(!result.violations.is_empty());
    if let RuleType::Density { actual, .. } = result.violations[0].rule_type {
        assert_eq!(actual, 0.0);
    } else {
        panic!("expected Density rule type");
    }
}

// ---- drc_skip suppression tests ----

#[test]
fn test_drc_skip_suppresses_intra_cell_violation() {
    // A cell has two overlapping polygons on the same layer.
    // With drc_skip=true, the intra-cell violation should be suppressed.
    let mut trusted = Cell::new("trusted");
    trusted.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    trusted.add_polygon(
        Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    trusted.set_drc_skip(true);

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(&trusted, &rules, None);

    assert!(
        result.passed(),
        "trusted cell should suppress its own violation"
    );
    assert_eq!(result.violations.len(), 0);
    assert_eq!(result.stats.suppressed_violations, 1);
    assert_eq!(result.stats.skipped_cells, 1);
}

#[test]
fn test_drc_skip_keeps_inter_cell_violation() {
    // Trusted child cell has a polygon that overlaps a polygon in an
    // untrusted top cell. The inter-cell violation MUST survive — trust
    // is about interior, not about placement.
    let mut child = Cell::new("child");
    child.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    child.set_drc_skip(true);

    let mut top = Cell::new("top");
    top.add_polygon(
        Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    top.add_ref(CellRef::new("child"));

    let mut lib = Library::new("test_lib");
    lib.add_cell(child).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

    assert!(
        !result.passed(),
        "inter-cell violation against a trusted cell must still be reported"
    );
    assert_eq!(result.violations.len(), 1);
    assert_eq!(result.stats.suppressed_violations, 0);
    assert_eq!(result.stats.skipped_cells, 1);
}

#[test]
fn test_drc_skip_suppresses_when_both_cells_trusted() {
    // Two trusted cells overlap each other. With both trusted, the
    // inter-cell violation should be suppressed too.
    let mut a = Cell::new("a");
    a.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    a.set_drc_skip(true);

    let mut b = Cell::new("b");
    b.add_polygon(
        Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    b.set_drc_skip(true);

    let mut top = Cell::new("top");
    top.add_ref(CellRef::new("a"));
    top.add_ref(CellRef::new("b"));

    let mut lib = Library::new("test_lib");
    lib.add_cell(a).unwrap();
    lib.add_cell(b).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

    assert!(
        result.passed(),
        "overlap between two trusted cells should be suppressed"
    );
    assert_eq!(result.violations.len(), 0);
    assert_eq!(result.stats.suppressed_violations, 1);
    assert_eq!(result.stats.skipped_cells, 2);
}

#[test]
fn test_drc_skip_propagates_to_subtree() {
    // Trusted parent contains an untrusted child. The child's own
    // intra-cell violation should still be suppressed because the child
    // is reachable from a trusted ancestor.
    let mut grandchild = Cell::new("grandchild");
    grandchild.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    grandchild.add_polygon(
        Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    let mut parent = Cell::new("parent");
    parent.add_ref(CellRef::new("grandchild"));
    parent.set_drc_skip(true);

    let mut top = Cell::new("top");
    top.add_ref(CellRef::new("parent"));

    let mut lib = Library::new("test_lib");
    lib.add_cell(grandchild).unwrap();
    lib.add_cell(parent).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

    assert!(
        result.passed(),
        "grandchild's intra-cell violation should be suppressed via trusted ancestor"
    );
    assert_eq!(result.stats.suppressed_violations, 1);
    assert_eq!(
        result.stats.skipped_cells, 2,
        "closure should include parent and grandchild"
    );
}

#[test]
fn test_drc_skip_diamond_hierarchy() {
    // Regression: a "shared" cell reachable via BOTH a trusted and an
    // untrusted parent must be in the skipped closure regardless of
    // traversal order. Earlier single-pass DFS with a visited-set would
    // miss this because `shared` was marked visited via the untrusted
    // path before the trusted path had a chance to add it.
    //
    //        top (untrusted)
    //       /               \
    //   parent_a          parent_b  (drc_skip=true)
    //   (untrusted)           |
    //       \                /
    //          shared (untrusted) — has an internal overlap
    let mut shared = Cell::new("shared");
    shared.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    shared.add_polygon(
        Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );

    let mut parent_a = Cell::new("parent_a");
    parent_a.add_ref(CellRef::new("shared"));

    let mut parent_b = Cell::new("parent_b");
    parent_b.add_ref(CellRef::new("shared"));
    parent_b.set_drc_skip(true);

    let mut top = Cell::new("top");
    // Order matters for reproducing the old bug: put the untrusted
    // parent first so `shared` is visited via it first.
    top.add_ref(CellRef::new("parent_a"));
    top.add_ref(CellRef::new("parent_b"));

    let mut lib = Library::new("test_lib");
    lib.add_cell(shared).unwrap();
    lib.add_cell(parent_a).unwrap();
    lib.add_cell(parent_b).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));

    // `shared` must be in the closure via `parent_b`, so its intra-cell
    // violation is suppressed.
    assert!(
        result.passed(),
        "shared's intra-cell violation must be suppressed via trusted parent_b, \
         even though it's also reachable via untrusted parent_a"
    );
    // Multiple suppressed violations are expected here (intra-cell in
    // `shared` plus inter-instance overlaps between the two instances of
    // `shared`). The important invariant is that nothing survives.
    assert!(
        result.stats.suppressed_violations >= 1,
        "at least one violation should be suppressed via the trusted subtree"
    );
    assert_eq!(result.violations.len(), 0);
    assert_eq!(
        result.stats.skipped_cells, 2,
        "closure should include parent_b and shared"
    );
}

#[test]
fn test_drc_skip_suppresses_per_polygon_violation() {
    // Regression for ROS-552: per-polygon rules now carry cell-name
    // provenance, so drc_skip suppresses them. Previously (v1 of
    // drc_skip) this was a documented gap — the violation was kept.
    let mut trusted = Cell::new("trusted");
    // A polygon with a thin neck that violates min_width.
    trusted.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.05),
        Layer::new(1, 0),
    );
    trusted.set_drc_skip(true);

    let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.5, Some("MIN_W"));
    let result = run_drc(&trusted, &rules, None);

    // With ROS-552 in place, the per-polygon violation is attributed to
    // "trusted" and therefore suppressed.
    assert!(
        result.passed(),
        "per-polygon violation attributed to trusted cell should be suppressed"
    );
    assert_eq!(result.stats.suppressed_violations, 1);
    assert_eq!(result.stats.skipped_cells, 1);
}

#[test]
fn test_drc_skip_zero_skipped_cells_when_none_marked() {
    // Sanity: with no cells marked, stats reflect zero skipped cells
    // and zero suppressions, and behavior is unchanged.
    let mut cell = Cell::new("plain");
    cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    cell.add_polygon(
        Polygon::rect(Point::new(3.0, 0.0), 5.0, 5.0),
        Layer::new(1, 0),
    );
    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(1, 0), Some("NO_OVLP"));
    let result = run_drc(&cell, &rules, None);

    assert!(!result.passed());
    assert_eq!(result.violations.len(), 1);
    assert_eq!(result.stats.suppressed_violations, 0);
    assert_eq!(result.stats.skipped_cells, 0);
}

// ==================================================================
// ROS-552: Per-rule hierarchical provenance tests.
//
// Each rule type gets a test that:
//   1. Puts violating geometry in a leaf cell.
//   2. Instances that leaf in a parent at a non-identity transform.
//   3. Asserts `cell_name` is set and `location` is in top-level
//      global coordinates.
// ==================================================================

fn two_level_hierarchy(leaf: Cell) -> (Library, String) {
    // Parent places the leaf translated by (100, 50) — chosen so that
    // local-frame and global-frame are trivially distinguishable.
    let leaf_name = leaf.name().to_string();
    let mut top = Cell::new("top");
    top.add_ref(CellRef::new(&leaf_name).at(100.0, 50.0));
    let mut lib = Library::new("prov_lib");
    lib.add_cell(leaf).unwrap();
    lib.add_cell(top).unwrap();
    (lib, "top".to_string())
}

#[test]
fn prov_min_width_attributed_and_global() {
    let mut leaf = Cell::new("thin_wire");
    leaf.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.05),
        Layer::new(1, 0),
    );
    let (lib, top) = two_level_hierarchy(leaf);
    let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.5, None);
    let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
    assert_eq!(result.violations.len(), 1);
    let v = &result.violations[0];
    assert_eq!(v.cell_name.as_deref(), Some("thin_wire"));
    // Global-frame bbox: local (0,0)-(10,0.05) -> (100,50)-(110,50.05).
    assert!((v.location.min().x - 100.0).abs() < 1e-9);
    assert!((v.location.min().y - 50.0).abs() < 1e-9);
}

#[test]
fn prov_min_area_attributed_and_global() {
    let mut leaf = Cell::new("tiny_sq");
    leaf.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
        Layer::new(1, 0),
    );
    let (lib, top) = two_level_hierarchy(leaf);
    let rules = DrcRules::new().min_area(Layer::new(1, 0), 10.0, None);
    let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
    assert_eq!(result.violations.len(), 1);
    let v = &result.violations[0];
    assert_eq!(v.cell_name.as_deref(), Some("tiny_sq"));
    assert!((v.location.min().x - 100.0).abs() < 1e-9);
    assert!((v.location.min().y - 50.0).abs() < 1e-9);
}

#[test]
fn prov_allowed_angles_attributed_and_global() {
    // Triangle has 60° interior angles; allow only {0, 90} -> violation.
    let mut leaf = Cell::new("tri");
    leaf.add_polygon(
        Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(1.0, 0.0),
            Point::new(0.5, 1.0),
        ]),
        Layer::new(1, 0),
    );
    let (lib, top) = two_level_hierarchy(leaf);
    let rules = DrcRules::new().allowed_angles(Layer::new(1, 0), &[0.0, 90.0], None);
    let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
    assert!(!result.violations.is_empty());
    for v in &result.violations {
        assert_eq!(v.cell_name.as_deref(), Some("tri"));
        assert!(v.cell_name2.is_none());
        assert!(v.location.min().x >= 100.0 - 1e-9);
        assert!(v.location.min().y >= 50.0 - 1e-9);
    }
}

#[test]
fn prov_min_edge_length_attributed_and_global() {
    // A polygon with one tiny edge (0.01 long).
    let mut leaf = Cell::new("short_edge");
    leaf.add_polygon(
        Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.0),
            Point::new(10.0, 10.0),
            Point::new(10.0 - 0.01, 10.0),
            Point::new(0.0, 10.0),
        ]),
        Layer::new(1, 0),
    );
    let (lib, top) = two_level_hierarchy(leaf);
    let rules = DrcRules::new().min_edge_length(Layer::new(1, 0), 0.5, None);
    let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
    assert!(!result.violations.is_empty());
    for v in &result.violations {
        assert_eq!(v.cell_name.as_deref(), Some("short_edge"));
    }
}

#[test]
fn prov_self_intersection_attributed_and_global() {
    // Bowtie polygon (self-intersecting).
    let mut leaf = Cell::new("bowtie");
    leaf.add_polygon(
        Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 10.0),
            Point::new(10.0, 0.0),
            Point::new(0.0, 10.0),
        ]),
        Layer::new(1, 0),
    );
    let (lib, top) = two_level_hierarchy(leaf);
    let rules = DrcRules::new().no_self_intersection(Layer::new(1, 0), None);
    let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
    assert_eq!(result.violations.len(), 1);
    assert_eq!(result.violations[0].cell_name.as_deref(), Some("bowtie"));
}

#[test]
fn prov_max_width_attributed_and_global() {
    let mut leaf = Cell::new("fat");
    leaf.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 20.0, 20.0),
        Layer::new(1, 0),
    );
    let (lib, top) = two_level_hierarchy(leaf);
    let rules = DrcRules::new().max_width(Layer::new(1, 0), 5.0, None);
    let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
    assert_eq!(result.violations.len(), 1);
    let v = &result.violations[0];
    assert_eq!(v.cell_name.as_deref(), Some("fat"));
    assert!((v.location.min().x - 100.0).abs() < 1e-9);
}

#[test]
fn prov_acute_angle_attributed_and_global() {
    // Thin triangle has a very small apex angle.
    let mut leaf = Cell::new("sharp");
    leaf.add_polygon(
        Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(10.0, 0.01),
            Point::new(10.0, -0.01),
        ]),
        Layer::new(1, 0),
    );
    let (lib, top) = two_level_hierarchy(leaf);
    let rules = DrcRules::new().acute_angle(Layer::new(1, 0), 30.0, None);
    let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
    assert!(!result.violations.is_empty());
    for v in &result.violations {
        assert_eq!(v.cell_name.as_deref(), Some("sharp"));
    }
}

#[test]
fn prov_snap_to_grid_attributed_and_global() {
    // Leaf is on-grid; but the parent translates by an off-grid offset
    // so the final global coords are off-grid — forces snap-to-grid
    // to find violations in the flattened geometry.
    let mut leaf = Cell::new("ongrid");
    leaf.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 0.5),
        Layer::new(1, 0),
    );
    let mut top = Cell::new("top");
    // Translate by (0.0003, 0) — off 1nm grid since 0.0003 / 0.001 = 0.3.
    top.add_ref(CellRef::new("ongrid").at(0.0003, 0.0));
    let mut lib = Library::new("prov_lib");
    lib.add_cell(leaf).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().snap_to_grid(Layer::new(1, 0), 0.001, None);
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
    assert!(!result.violations.is_empty());
    for v in &result.violations {
        assert_eq!(
            v.cell_name.as_deref(),
            Some("ongrid"),
            "snap-to-grid violation should be attributed to the owning cell"
        );
    }
}

#[test]
fn prov_min_spacing_same_layer_intra_cell() {
    // Two close polygons in the leaf on the same layer -> intra-cell
    // same-layer min-spacing violation. Phase 2 emits per-instance
    // with cell_name == cell_name2 == leaf.
    let mut leaf = Cell::new("pair");
    leaf.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
        Layer::new(1, 0),
    );
    leaf.add_polygon(
        Polygon::rect(Point::new(1.05, 0.0), 1.0, 1.0),
        Layer::new(1, 0),
    );
    let (lib, top) = two_level_hierarchy(leaf);
    let rules = DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(1, 0), 0.2, None);
    let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
    assert!(!result.violations.is_empty());
    let v = &result.violations[0];
    assert_eq!(v.cell_name.as_deref(), Some("pair"));
    assert_eq!(v.cell_name2.as_deref(), Some("pair"));
    // Global: at least one coord should be at the shifted position.
    assert!(v.location.min().x >= 100.0 - 1e-9);
}

#[test]
fn prov_min_spacing_cross_layer() {
    // Two layers, cross-layer spacing violation across instances.
    let mut a = Cell::new("layer_a");
    a.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
        Layer::new(1, 0),
    );
    let mut b = Cell::new("layer_b");
    b.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
        Layer::new(2, 0),
    );
    let mut top = Cell::new("top");
    top.add_ref(CellRef::new("layer_a").at(0.0, 0.0));
    top.add_ref(CellRef::new("layer_b").at(1.05, 0.0));
    let mut lib = Library::new("prov_lib");
    lib.add_cell(a).unwrap();
    lib.add_cell(b).unwrap();
    lib.add_cell(top).unwrap();
    let rules = DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(2, 0), 0.5, None);
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
    assert!(!result.violations.is_empty());
    let v = &result.violations[0];
    assert_eq!(v.cell_name.as_deref(), Some("layer_a"));
    assert_eq!(v.cell_name2.as_deref(), Some("layer_b"));
}

#[test]
fn prov_enclosure_cross_layer() {
    // Inner on layer 2 in cell `inner_cell`; outer on layer 1 in cell
    // `outer_cell`. Parent places them so inner is barely enclosed
    // (margin < required).
    let mut inner_cell = Cell::new("inner_cell");
    inner_cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 4.0, 4.0),
        Layer::new(2, 0),
    );
    let mut outer_cell = Cell::new("outer_cell");
    outer_cell.add_polygon(
        Polygon::rect(Point::new(-0.5, -0.5), 5.0, 5.0),
        Layer::new(1, 0),
    );
    let mut top = Cell::new("top");
    top.add_ref(CellRef::new("inner_cell").at(0.0, 0.0));
    top.add_ref(CellRef::new("outer_cell").at(0.0, 0.0));
    let mut lib = Library::new("prov_lib");
    lib.add_cell(inner_cell).unwrap();
    lib.add_cell(outer_cell).unwrap();
    lib.add_cell(top).unwrap();
    let rules = DrcRules::new().min_enclosure(Layer::new(2, 0), Layer::new(1, 0), 2.0, None);
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
    assert!(!result.violations.is_empty());
    let v = &result.violations[0];
    assert_eq!(v.cell_name.as_deref(), Some("inner_cell"));
    assert_eq!(v.cell_name2.as_deref(), Some("outer_cell"));
}

#[test]
fn prov_enclosure_no_outer() {
    // Inner polygon with no outer on layer 1 — cell_name set,
    // cell_name2 = None (there's no outer polygon to attribute to).
    let mut leaf = Cell::new("orphan_inner");
    leaf.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 4.0, 4.0),
        Layer::new(2, 0),
    );
    let (lib, top) = two_level_hierarchy(leaf);
    let rules = DrcRules::new().min_enclosure(Layer::new(2, 0), Layer::new(1, 0), 2.0, None);
    let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
    assert_eq!(result.violations.len(), 1);
    let v = &result.violations[0];
    assert_eq!(v.cell_name.as_deref(), Some("orphan_inner"));
    assert!(v.cell_name2.is_none());
}

#[test]
fn prov_require_overlap_cross_layer() {
    // layer_a polygon has no overlapping layer_b polygon.
    let mut a = Cell::new("layer_a");
    a.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
        Layer::new(1, 0),
    );
    let mut b = Cell::new("layer_b");
    b.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
        Layer::new(2, 0),
    );
    let mut top = Cell::new("top");
    top.add_ref(CellRef::new("layer_a").at(0.0, 0.0));
    top.add_ref(CellRef::new("layer_b").at(50.0, 0.0)); // far away
    let mut lib = Library::new("prov_lib");
    lib.add_cell(a).unwrap();
    lib.add_cell(b).unwrap();
    lib.add_cell(top).unwrap();
    let rules = DrcRules::new().require_overlap(Layer::new(1, 0), Layer::new(2, 0), None);
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
    assert!(!result.violations.is_empty());
    let v = &result.violations[0];
    assert_eq!(v.cell_name.as_deref(), Some("layer_a"));
    // cell_name2 is None — require_overlap's "no match" violation can't
    // attribute to a specific outer polygon.
    assert!(v.cell_name2.is_none());
}

#[test]
fn prov_forbid_overlap_cross_layer() {
    let mut a = Cell::new("cell_a");
    a.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 2.0, 2.0),
        Layer::new(1, 0),
    );
    let mut b = Cell::new("cell_b");
    b.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 2.0, 2.0),
        Layer::new(2, 0),
    );
    let mut top = Cell::new("top");
    top.add_ref(CellRef::new("cell_a").at(0.0, 0.0));
    top.add_ref(CellRef::new("cell_b").at(1.0, 0.0)); // overlapping
    let mut lib = Library::new("prov_lib");
    lib.add_cell(a).unwrap();
    lib.add_cell(b).unwrap();
    lib.add_cell(top).unwrap();
    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(2, 0), None);
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
    assert!(!result.violations.is_empty());
    let v = &result.violations[0];
    assert_eq!(v.cell_name.as_deref(), Some("cell_a"));
    assert_eq!(v.cell_name2.as_deref(), Some("cell_b"));
}

#[test]
fn prov_not_inside_cross_layer() {
    // Inner polygon fully inside exclusion zone from another cell.
    let mut inner_cell = Cell::new("inner_cell");
    inner_cell.add_polygon(
        Polygon::rect(Point::new(2.0, 2.0), 1.0, 1.0),
        Layer::new(1, 0),
    );
    let mut zone_cell = Cell::new("zone_cell");
    zone_cell.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 10.0, 10.0),
        Layer::new(2, 0),
    );
    let mut top = Cell::new("top");
    top.add_ref(CellRef::new("inner_cell").at(0.0, 0.0));
    top.add_ref(CellRef::new("zone_cell").at(0.0, 0.0));
    let mut lib = Library::new("prov_lib");
    lib.add_cell(inner_cell).unwrap();
    lib.add_cell(zone_cell).unwrap();
    lib.add_cell(top).unwrap();
    let rules = DrcRules::new().not_inside(Layer::new(1, 0), Layer::new(2, 0), None);
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
    assert_eq!(result.violations.len(), 1);
    let v = &result.violations[0];
    assert_eq!(v.cell_name.as_deref(), Some("inner_cell"));
    // cell_name2 None here: not_inside unions outers, so we can't
    // attribute to a single outer polygon.
    assert!(v.cell_name2.is_none());
}

#[test]
fn prov_density_leaves_cell_name_none_by_design() {
    // Density is a window-based check with no single source polygon,
    // so cell_name is documented as intentionally None.
    let mut leaf = Cell::new("sparse");
    leaf.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
        Layer::new(1, 0),
    );
    let (lib, top) = two_level_hierarchy(leaf);
    let rules = DrcRules::new().density(Layer::new(1, 0), Some(0.5), None, 10.0, 5.0, None, None);
    let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
    // There's some density violations since the 1x1 square in a 10x10
    // window is < 0.5. The contract: cell_name is None.
    if let Some(v) = result.violations.first() {
        assert!(
            v.cell_name.is_none(),
            "Density violations have no cell attribution by design"
        );
    }
}

#[test]
fn prov_drc_skip_suppresses_per_polygon_in_nested_cell() {
    // Regression: a trusted leaf with per-polygon violation, placed in
    // an untrusted parent. ROS-552 lets drc_skip suppress it.
    let mut leaf = Cell::new("trusted_leaf");
    leaf.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.05),
        Layer::new(1, 0),
    );
    leaf.set_drc_skip(true);
    let (lib, top) = two_level_hierarchy(leaf);
    let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.5, None);
    let result = run_drc(lib.cell(&top).unwrap(), &rules, Some(&lib));
    assert!(result.passed());
    assert_eq!(result.stats.suppressed_violations, 1);
}

#[test]
fn prov_drc_skip_suppresses_cross_layer_when_both_trusted() {
    // Two trusted leaves in cross-layer forbid_overlap — now
    // suppressed since both cell_name and cell_name2 are populated.
    let mut a = Cell::new("a");
    a.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 2.0, 2.0),
        Layer::new(1, 0),
    );
    a.set_drc_skip(true);
    let mut b = Cell::new("b");
    b.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 2.0, 2.0),
        Layer::new(2, 0),
    );
    b.set_drc_skip(true);
    let mut top = Cell::new("top");
    top.add_ref(CellRef::new("a").at(0.0, 0.0));
    top.add_ref(CellRef::new("b").at(1.0, 0.0));
    let mut lib = Library::new("prov_lib");
    lib.add_cell(a).unwrap();
    lib.add_cell(b).unwrap();
    lib.add_cell(top).unwrap();
    let rules = DrcRules::new().forbid_overlap(Layer::new(1, 0), Layer::new(2, 0), None);
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
    assert!(result.passed());
    assert!(result.stats.suppressed_violations >= 1);
}

#[test]
fn prov_non_rigid_intra_cell_spacing_reflects_scaled_geometry() {
    // Regression for the ROS-552 review: under non-rigid (non-uniform
    // or uniform-but-non-1.0) scaling, Phase 2 intra-cell pairwise must
    // re-detect on transformed geometry so the reported `actual` and
    // `location` reflect scaled world coordinates.
    //
    // Leaf has two same-layer polygons 0.05 apart. Under 2× scale, the
    // spacing becomes 0.10, which passes min_spacing=0.08 — the runner
    // must see the scaled geometry to reach that conclusion.
    let mut leaf = Cell::new("pair");
    leaf.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 1.0, 1.0),
        Layer::new(1, 0),
    );
    leaf.add_polygon(
        Polygon::rect(Point::new(1.05, 0.0), 1.0, 1.0),
        Layer::new(1, 0),
    );
    let mut top = Cell::new("top");
    top.add_ref(CellRef::new("pair").scale(2.0));
    let mut lib = Library::new("nr_lib");
    lib.add_cell(leaf).unwrap();
    lib.add_cell(top).unwrap();

    // Spacing threshold sits between 0.05 (local) and 0.10 (2× scaled):
    // local detection would flag a violation, but the scaled geometry
    // is fine. Expect 0 violations.
    let rules = DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(1, 0), 0.08, None);
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
    assert!(
        result.passed(),
        "2x-scaled geometry should not trigger a 0.08 min-spacing violation"
    );

    // Tight threshold: both local (0.05) and scaled (0.10) fail. The
    // violation must be in global coords and carry cell_name set.
    let rules_tight = DrcRules::new().min_spacing(Layer::new(1, 0), Layer::new(1, 0), 0.2, None);
    let result = run_drc(lib.cell("top").unwrap(), &rules_tight, Some(&lib));
    assert!(!result.violations.is_empty());
    let v = &result.violations[0];
    assert_eq!(v.cell_name.as_deref(), Some("pair"));
    assert_eq!(v.cell_name2.as_deref(), Some("pair"));
    if let RuleType::MinSpacing { actual, .. } = v.rule_type {
        assert!(
            (actual - 0.1).abs() < 1e-6,
            "scaled actual should be 0.10, got {}",
            actual
        );
    } else {
        panic!("expected MinSpacing");
    }
}

#[test]
fn prov_detection_cache_dedupes_rigid_instances() {
    // Regression guard for the per-unique-cell detection cache: N rigid
    // instances of the same leaf must produce exactly N identical
    // violation templates (one detection, cloned N times). If the
    // cache were ever removed, the runner would still emit the right
    // number of violations but every one would carry subtly different
    // float noise from re-running the detection. Asserting identical
    // rule_type payloads locks in the cache invariant.
    let mut leaf = Cell::new("leaf");
    leaf.add_polygon(
        Polygon::rect(Point::new(0.0, 0.0), 10.0, 0.05),
        Layer::new(1, 0),
    );
    let mut top = Cell::new("top");
    for i in 0..5 {
        top.add_ref(CellRef::new("leaf").at(100.0 * i as f64, 0.0));
    }
    let mut lib = Library::new("dedup_lib");
    lib.add_cell(leaf).unwrap();
    lib.add_cell(top).unwrap();

    let rules = DrcRules::new().min_width(Layer::new(1, 0), 0.5, None);
    let result = run_drc(lib.cell("top").unwrap(), &rules, Some(&lib));
    assert_eq!(result.violations.len(), 5);

    // All violations share the same detection payload (same `actual`
    // width measurement). Any drift would indicate per-instance
    // re-detection rather than cached detection.
    let first_actual = match result.violations[0].rule_type {
        RuleType::MinWidth { actual, .. } => actual,
        _ => panic!("expected MinWidth"),
    };
    for v in &result.violations[1..] {
        if let RuleType::MinWidth { actual, .. } = v.rule_type {
            assert_eq!(
                actual, first_actual,
                "cached detection should produce bit-identical `actual` per instance"
            );
        }
    }
}
