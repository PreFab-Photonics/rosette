"""Tests for DRC (Design Rule Checking) functionality.

These tests focus on Python-specific behavior and integration.
Core algorithm correctness is tested in Rust.
"""

import json

import pytest

from rosette import (
    BBox,
    Cell,
    CellRef,
    DrcRules,
    Layer,
    Library,
    Point,
    Polygon,
    load_drc_rules,
    run_drc,
)
from rosette.cli import _print_drc_result, _run_drc_check, check_design, drc_design


class TestDrcRules:
    """Tests for DrcRules builder."""

    def test_empty_rules(self):
        """Empty rules set has no rules."""
        rules = DrcRules()
        assert repr(rules) == "DrcRules(0 rules)"

    def test_chained_rules(self):
        """Rules can be chained fluently."""
        rules = (
            DrcRules()
            .min_width(Layer(1, 0), 0.1)
            .min_spacing(Layer(1, 0), Layer(1, 0), 0.2)
            .min_area(Layer(1, 0), 0.05)
        )
        assert "3 rules" in repr(rules)

    def test_layer_accepts_int(self):
        """Layer parameter accepts int (layer number with datatype=0)."""
        rules = DrcRules().min_width(1, 0.1)
        assert "1 rules" in repr(rules)

    def test_layer_accepts_tuple(self):
        """Layer parameter accepts (number, datatype) tuple."""
        rules = DrcRules().min_width((1, 2), 0.1)
        assert "1 rules" in repr(rules)

    def test_named_rules(self):
        """Rules can have optional names."""
        rules = DrcRules().min_width(Layer(1, 0), 0.1, name="M1.W.1")
        assert "1 rules" in repr(rules)


class TestRunDrc:
    """Tests for run_drc function."""

    def test_empty_cell_passes(self):
        """Empty cell passes all rules."""
        cell = Cell("empty")
        rules = DrcRules().min_area(Layer(1, 0), 1.0)
        result = run_drc(cell, rules)

        assert result.passed
        assert len(result.violations) == 0
        assert result.polygons_checked == 0

    def test_min_area_pass(self):
        """Polygon meeting min area requirement passes."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))

        rules = DrcRules().min_area(Layer(1, 0), 50.0)
        result = run_drc(cell, rules)

        assert result.passed
        assert len(result.violations) == 0

    def test_min_area_fail(self):
        """Polygon violating min area requirement fails."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 2.0, 2.0), Layer(1, 0))

        rules = DrcRules().min_area(Layer(1, 0), 50.0, name="MIN_AREA")
        result = run_drc(cell, rules)

        assert not result.passed
        assert len(result.violations) == 1

        v = result.violations[0]
        assert v.rule_name == "MIN_AREA"
        assert v.rule_type == "min_area"
        assert v.layer == (1, 0)
        assert "less than" in v.message

    def test_min_width_pass(self):
        """Rectangle meeting min width passes."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 5.0), Layer(1, 0))

        rules = DrcRules().min_width(Layer(1, 0), 4.0)
        result = run_drc(cell, rules)

        assert result.passed

    def test_min_width_fail(self):
        """Narrow rectangle violates min width."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 2.0), Layer(1, 0))

        rules = DrcRules().min_width(Layer(1, 0), 3.0)
        result = run_drc(cell, rules)

        assert not result.passed
        assert result.violations[0].rule_type == "min_width"

    def test_min_width_l_shape_fails(self):
        """L-shaped polygon with narrow arms fails min width.

        This tests the improved width algorithm that correctly handles
        non-rectangular shapes. The old bounding-box approach would
        incorrectly report width=10 for this L-shape.
        """
        cell = Cell("test")
        # L-shape with 0.5-wide arms
        l_shape = Polygon(
            [
                Point(0.0, 0.0),
                Point(10.0, 0.0),
                Point(10.0, 0.5),
                Point(0.5, 0.5),
                Point(0.5, 10.0),
                Point(0.0, 10.0),
            ]
        )
        cell.add_polygon(l_shape, Layer(1, 0))

        # Should fail min_width=0.6 because arms are only 0.5 wide
        rules = DrcRules().min_width(Layer(1, 0), 0.6)
        result = run_drc(cell, rules)

        assert not result.passed, "L-shape with 0.5 width should fail min_width=0.6"
        assert result.violations[0].rule_type == "min_width"

    def test_min_width_l_shape_passes(self):
        """L-shaped polygon with wide arms passes min width."""
        cell = Cell("test")
        # L-shape with 2.0-wide arms
        l_shape = Polygon(
            [
                Point(0.0, 0.0),
                Point(10.0, 0.0),
                Point(10.0, 2.0),
                Point(2.0, 2.0),
                Point(2.0, 10.0),
                Point(0.0, 10.0),
            ]
        )
        cell.add_polygon(l_shape, Layer(1, 0))

        # Should pass min_width=1.5 because arms are 2.0 wide
        rules = DrcRules().min_width(Layer(1, 0), 1.5)
        result = run_drc(cell, rules)

        assert result.passed, "L-shape with 2.0 width should pass min_width=1.5"

    def test_min_width_u_shape(self):
        """U-shaped polygon tests width of multiple narrow sections."""
        cell = Cell("test")
        # U-shape with 1.0-wide arms and bottom
        u_shape = Polygon(
            [
                Point(0.0, 0.0),
                Point(5.0, 0.0),
                Point(5.0, 5.0),
                Point(4.0, 5.0),
                Point(4.0, 1.0),
                Point(1.0, 1.0),
                Point(1.0, 5.0),
                Point(0.0, 5.0),
            ]
        )
        cell.add_polygon(u_shape, Layer(1, 0))

        # Should pass min_width=0.8
        rules = DrcRules().min_width(Layer(1, 0), 0.8)
        result = run_drc(cell, rules)
        assert result.passed, "U-shape with 1.0 width should pass min_width=0.8"

        # Should fail min_width=1.2
        rules = DrcRules().min_width(Layer(1, 0), 1.2)
        result = run_drc(cell, rules)
        assert not result.passed, "U-shape with 1.0 width should fail min_width=1.2"

    def test_min_spacing_pass(self):
        """Polygons with sufficient spacing pass."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(10, 0), 5.0, 5.0), Layer(1, 0))

        rules = DrcRules().min_spacing(Layer(1, 0), Layer(1, 0), 4.0)
        result = run_drc(cell, rules)

        assert result.passed

    def test_min_spacing_fail(self):
        """Polygons too close violate spacing rule."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(6, 0), 5.0, 5.0), Layer(1, 0))

        rules = DrcRules().min_spacing(Layer(1, 0), Layer(1, 0), 2.0)
        result = run_drc(cell, rules)

        assert not result.passed
        assert result.violations[0].rule_type == "min_spacing"

    def test_allowed_angles_manhattan(self):
        """Manhattan rectangle passes 0/90 angle check."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 5.0), Layer(1, 0))

        rules = DrcRules().allowed_angles(Layer(1, 0), [0.0, 90.0])
        result = run_drc(cell, rules)

        assert result.passed

    def test_allowed_angles_fail(self):
        """45-degree edges fail manhattan angle check."""
        cell = Cell("test")
        # Diamond with 45-degree edges
        cell.add_polygon(
            Polygon(
                [
                    Point(0, 1),
                    Point(1, 0),
                    Point(0, -1),
                    Point(-1, 0),
                ]
            ),
            Layer(1, 0),
        )

        rules = DrcRules().allowed_angles(Layer(1, 0), [0.0, 90.0])
        result = run_drc(cell, rules)

        assert not result.passed
        assert len(result.violations) == 4  # All 4 edges are 45 degrees

    def test_forbid_overlap_pass(self):
        """Non-overlapping polygons pass forbid overlap check."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(10, 0), 5.0, 5.0), Layer(2, 0))

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(2, 0))
        result = run_drc(cell, rules)

        assert result.passed

    def test_forbid_overlap_fail(self):
        """Overlapping polygons fail forbid overlap check."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(3, 0), 5.0, 5.0), Layer(2, 0))

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(2, 0))
        result = run_drc(cell, rules)

        assert not result.passed
        assert result.violations[0].rule_type == "forbidden_overlap"

    def test_multiple_rules(self):
        """Multiple rules are all checked."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 2.0, 2.0), Layer(1, 0))

        rules = (
            DrcRules()
            .min_area(Layer(1, 0), 50.0)  # Will fail
            .min_width(Layer(1, 0), 5.0)  # Will fail
        )
        result = run_drc(cell, rules)

        assert not result.passed
        assert len(result.violations) == 2
        assert result.rules_checked == 2

    # --- New check types ---

    def test_min_edge_length_pass(self):
        """Rectangle with long edges passes min edge length."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 5.0), Layer(1, 0))

        rules = DrcRules().min_edge_length(Layer(1, 0), 4.0)
        result = run_drc(cell, rules)

        assert result.passed

    def test_min_edge_length_fail(self):
        """Thin rectangle has short edges that fail."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 0.05), Layer(1, 0))

        rules = DrcRules().min_edge_length(Layer(1, 0), 0.1, name="EDGE_LEN")
        result = run_drc(cell, rules)

        assert not result.passed
        assert len(result.violations) == 2  # Two 0.05-length edges
        v = result.violations[0]
        assert v.rule_type == "min_edge_length"
        assert v.rule_name == "EDGE_LEN"

    def test_max_width_pass(self):
        """Narrow waveguide passes max width check."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 20.0, 0.5), Layer(1, 0))

        rules = DrcRules().max_width(Layer(1, 0), 1.0)
        result = run_drc(cell, rules)

        assert result.passed

    def test_max_width_fail(self):
        """Wide waveguide fails max width check."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 20.0, 3.0), Layer(1, 0))

        rules = DrcRules().max_width(Layer(1, 0), 1.0, name="MAX_W")
        result = run_drc(cell, rules)

        assert not result.passed
        v = result.violations[0]
        assert v.rule_type == "max_width"
        assert v.rule_name == "MAX_W"

    def test_self_intersection_pass(self):
        """Simple rectangle passes self-intersection check."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 5.0), Layer(1, 0))

        rules = DrcRules().no_self_intersection(Layer(1, 0))
        result = run_drc(cell, rules)

        assert result.passed

    def test_self_intersection_fail(self):
        """Bowtie polygon fails self-intersection check."""
        cell = Cell("test")
        # Bowtie: edges cross in the middle
        bowtie = Polygon(
            [
                Point(0.0, 0.0),
                Point(10.0, 5.0),
                Point(10.0, 0.0),
                Point(0.0, 5.0),
            ]
        )
        cell.add_polygon(bowtie, Layer(1, 0))

        rules = DrcRules().no_self_intersection(Layer(1, 0), name="NO_SELF_X")
        result = run_drc(cell, rules)

        assert not result.passed
        v = result.violations[0]
        assert v.rule_type == "self_intersection"
        assert v.rule_name == "NO_SELF_X"

    def test_forbid_overlap_cross_hierarchy(self):
        """Overlap detected between top cell polygon and instanced child polygon."""
        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))

        top = Cell("top")
        top.add_polygon(Polygon.rect(Point(3, 0), 5.0, 5.0), Layer(1, 0))
        top.add_ref(child.at(0, 0))

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(1, 0), name="NO_OVLP")
        result = run_drc(top, rules)

        assert not result.passed
        assert len(result.violations) == 1
        assert result.violations[0].rule_type == "forbidden_overlap"
        assert result.polygons_checked == 2

        # Verify cell names are reported
        v = result.violations[0]
        names = {v.cell_name, v.cell_name2}
        assert "top" in names
        assert "child" in names

    def test_forbid_overlap_cross_hierarchy_non_overlapping_passes(self):
        """Non-overlapping polygons across hierarchy pass."""
        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))

        top = Cell("top")
        top.add_polygon(Polygon.rect(Point(10, 0), 5.0, 5.0), Layer(1, 0))
        top.add_ref(child.at(0, 0))

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(1, 0), name="NO_OVLP")
        result = run_drc(top, rules)

        assert result.passed
        assert result.polygons_checked == 2

    def test_forbid_overlap_two_instances_overlap(self):
        """Two instances of the same child placed so their polygons overlap."""
        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))

        top = Cell("top")
        top.add_ref(child.at(0, 0))
        top.add_ref(child.at(3, 0))  # Overlaps by 2 units

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(1, 0), name="NO_OVLP")
        result = run_drc(top, rules)

        assert not result.passed
        assert len(result.violations) == 1
        assert result.polygons_checked == 2

    def test_forbid_overlap_nested_hierarchy(self):
        """Overlap detected through two levels of hierarchy."""
        leaf = Cell("leaf")
        leaf.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))

        mid = Cell("mid")
        mid.add_ref(leaf.at(0, 0))

        top = Cell("top")
        top.add_ref(mid.at(0, 0))
        top.add_ref(mid.at(3, 0))  # Overlaps by 2 units

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(1, 0), name="NO_OVLP")
        result = run_drc(top, rules)

        assert not result.passed
        assert len(result.violations) == 1
        assert result.polygons_checked == 2


class TestDrcSkip:
    """Tests for the per-cell ``drc_skip`` suppression mechanism."""

    def test_default_is_false(self):
        """Cells default to ``drc_skip = False``."""
        cell = Cell("c")
        assert cell.drc_skip is False

    def test_constructor_kwarg(self):
        """``drc_skip`` can be set via constructor kwarg."""
        cell = Cell("c", drc_skip=True)
        assert cell.drc_skip is True

    def test_setter(self):
        """``drc_skip`` can be toggled via the property setter."""
        cell = Cell("c")
        cell.drc_skip = True
        assert cell.drc_skip is True
        cell.drc_skip = False
        assert cell.drc_skip is False

    def test_intra_cell_violation_suppressed(self):
        """Internal violation in a trusted cell is suppressed."""
        trusted = Cell("trusted", drc_skip=True)
        trusted.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        trusted.add_polygon(Polygon.rect(Point(3, 0), 5.0, 5.0), Layer(1, 0))

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(1, 0), name="NO_OVLP")
        result = run_drc(trusted, rules)

        assert result.passed
        assert len(result.violations) == 0
        assert result.suppressed_violations == 1
        assert result.skipped_cells == 1

    def test_inter_cell_violation_kept(self):
        """A trusted cell still gets checked against untrusted neighbors."""
        child = Cell("child", drc_skip=True)
        child.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))

        top = Cell("top")
        top.add_polygon(Polygon.rect(Point(3, 0), 5.0, 5.0), Layer(1, 0))
        top.add_ref(child.at(0, 0))

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(1, 0), name="NO_OVLP")
        result = run_drc(top, rules)

        assert not result.passed
        assert len(result.violations) == 1
        assert result.suppressed_violations == 0
        assert result.skipped_cells == 1

    def test_both_cells_trusted_suppressed(self):
        """Overlap between two trusted cells is suppressed."""
        a = Cell("a", drc_skip=True)
        a.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))

        b = Cell("b", drc_skip=True)
        b.add_polygon(Polygon.rect(Point(3, 0), 5.0, 5.0), Layer(1, 0))

        top = Cell("top")
        top.add_ref(a.at(0, 0))
        top.add_ref(b.at(0, 0))

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(1, 0), name="NO_OVLP")
        result = run_drc(top, rules)

        assert result.passed
        assert len(result.violations) == 0
        assert result.suppressed_violations == 1
        assert result.skipped_cells == 2

    def test_skip_propagates_to_subtree(self):
        """A trusted parent suppresses its untrusted children's violations too."""
        grandchild = Cell("grandchild")
        grandchild.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        grandchild.add_polygon(Polygon.rect(Point(3, 0), 5.0, 5.0), Layer(1, 0))

        parent = Cell("parent", drc_skip=True)
        parent.add_ref(grandchild.at(0, 0))

        top = Cell("top")
        top.add_ref(parent.at(0, 0))

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(1, 0), name="NO_OVLP")
        result = run_drc(top, rules)

        assert result.passed
        assert result.suppressed_violations == 1
        assert result.skipped_cells == 2

    def test_diamond_hierarchy(self):
        """Cell reachable via both trusted and untrusted parents is in the closure."""
        # Regression: traversal order must not matter. A shared cell reached
        # first via an untrusted parent must still be added to the skipped
        # closure when later reached via a trusted parent.
        shared = Cell("shared")
        shared.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        shared.add_polygon(Polygon.rect(Point(3, 0), 5.0, 5.0), Layer(1, 0))

        parent_a = Cell("parent_a")
        parent_a.add_ref(shared.at(0, 0))

        parent_b = Cell("parent_b", drc_skip=True)
        parent_b.add_ref(shared.at(0, 0))

        top = Cell("top")
        # Untrusted parent first to reproduce the visit-order bug pattern.
        top.add_ref(parent_a.at(0, 0))
        top.add_ref(parent_b.at(20, 0))

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(1, 0), name="NO_OVLP")
        result = run_drc(top, rules)

        assert result.passed, (
            "shared's intra-cell violation must be suppressed via the trusted parent_b, "
            "even when reached first via the untrusted parent_a"
        )
        assert result.skipped_cells == 2  # parent_b and shared

    def test_per_polygon_violation_suppressed_via_provenance(self):
        """Per ROS-552, per-polygon rules carry cell-name provenance so
        drc_skip now suppresses them."""
        trusted = Cell("trusted", drc_skip=True)
        trusted.add_polygon(Polygon.rect(Point(0, 0), 10.0, 0.05), Layer(1, 0))

        rules = DrcRules().min_width(Layer(1, 0), 0.5, name="MIN_W")
        result = run_drc(trusted, rules)

        assert result.passed
        assert result.suppressed_violations == 1
        assert result.skipped_cells == 1

    def test_no_skipped_cells_default(self):
        """Without any drc_skip cells, both new stats are 0 and behavior is unchanged."""
        cell = Cell("plain")
        cell.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(3, 0), 5.0, 5.0), Layer(1, 0))

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(1, 0), name="NO_OVLP")
        result = run_drc(cell, rules)

        assert not result.passed
        assert len(result.violations) == 1
        assert result.suppressed_violations == 0
        assert result.skipped_cells == 0


class TestDrcWaiveRegions:
    """Tests for the region-waiver (``drc_waive_regions``) suppression."""

    def test_default_is_empty(self):
        """Cells default to no waiver regions."""
        cell = Cell("c")
        assert cell.drc_waive_regions == []

    def test_add_and_clear(self):
        """Regions can be added, read back, and cleared."""
        cell = Cell("c")
        region = BBox(Point(0, 0), Point(1, 1))
        cell.add_drc_waive_region(region)
        assert len(cell.drc_waive_regions) == 1
        got = cell.drc_waive_regions[0]
        assert got.min.x == 0.0 and got.max.x == 1.0

        cell.clear_drc_waive_regions()
        assert cell.drc_waive_regions == []

    def test_setter_replaces(self):
        """Assigning the property replaces the whole list."""
        cell = Cell("c")
        cell.add_drc_waive_region(BBox(Point(0, 0), Point(1, 1)))
        cell.drc_waive_regions = [BBox(Point(2, 2), Point(3, 3))]
        assert len(cell.drc_waive_regions) == 1
        assert cell.drc_waive_regions[0].min.x == 2.0

    def test_contained_violation_waived(self):
        """A violation fully inside a waiver region is suppressed."""
        cell = Cell("c")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10.0, 0.05), Layer(1, 0))
        cell.add_drc_waive_region(BBox(Point(-1, -1), Point(11, 1)))

        rules = DrcRules().min_width(Layer(1, 0), 0.5, name="MIN_W")
        result = run_drc(cell, rules)

        assert result.passed
        assert len(result.violations) == 0
        assert result.waived_violations == 1
        assert result.suppressed_violations == 0

    def test_partial_overlap_kept(self):
        """Full containment is required — partial overlap does not waive."""
        cell = Cell("c")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10.0, 0.05), Layer(1, 0))
        # Covers only the left half of the polygon.
        cell.add_drc_waive_region(BBox(Point(-1, -1), Point(4, 1)))

        rules = DrcRules().min_width(Layer(1, 0), 0.5, name="MIN_W")
        result = run_drc(cell, rules)

        assert not result.passed
        assert len(result.violations) == 1
        assert result.waived_violations == 0

    def test_no_regions_default(self):
        """Without waiver regions, behavior is unchanged and the stat is 0."""
        cell = Cell("c")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10.0, 0.05), Layer(1, 0))

        rules = DrcRules().min_width(Layer(1, 0), 0.5, name="MIN_W")
        result = run_drc(cell, rules)

        assert not result.passed
        assert result.waived_violations == 0

    def test_region_transformed_through_placement(self):
        """A child-local waiver tracks a translated placement (global frame)."""
        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 10.0, 0.05), Layer(1, 0))
        child.add_drc_waive_region(BBox(Point(-1, -1), Point(11, 1)))

        top = Cell("top")
        top.add_ref(child.at(1000, 2000))

        rules = DrcRules().min_width(Layer(1, 0), 0.5, name="MIN_W")
        result = run_drc(top, rules)

        assert result.passed, (
            "child-local waiver must be transformed into global coords for the translated placement"
        )
        assert result.waived_violations == 1


class TestSnapToGrid:
    """Tests for snap-to-grid DRC check."""

    def test_on_grid_passes(self):
        """Polygon with on-grid vertices passes."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 1.0, 0.5), Layer(1, 0))

        rules = DrcRules().snap_to_grid(Layer(1, 0), 0.001)
        result = run_drc(cell, rules)
        assert result.passed

    def test_off_grid_fails(self):
        """Polygon with off-grid vertex fails."""
        cell = Cell("test")
        # 0.003 is not a multiple of 0.005
        poly = Polygon([Point(0.0, 0.0), Point(0.5, 0.0), Point(0.5, 0.003), Point(0.0, 0.003)])
        cell.add_polygon(poly, Layer(1, 0))

        rules = DrcRules().snap_to_grid(Layer(1, 0), 0.005, name="GRID_5NM")
        result = run_drc(cell, rules)

        assert not result.passed
        assert len(result.violations) >= 1
        v = result.violations[0]
        assert v.rule_type == "off_grid"
        assert v.rule_name == "GRID_5NM"
        assert v.severity == "error"
        assert "off grid" in v.message

    def test_5nm_grid_passes(self):
        """Polygon aligned to 5nm grid passes."""
        cell = Cell("test")
        poly = Polygon([Point(0.0, 0.0), Point(0.5, 0.0), Point(0.5, 0.25), Point(0.0, 0.25)])
        cell.add_polygon(poly, Layer(1, 0))

        rules = DrcRules().snap_to_grid(Layer(1, 0), 0.005)
        result = run_drc(cell, rules)
        assert result.passed

    def test_toml_config(self, tmp_path):
        """snap_to_grid loads from TOML config."""
        toml_content = """
[drc.layers."1/0"]
snap_to_grid = 0.005
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

        # On-grid cell passes
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 1.0, 0.5), Layer(1, 0))
        result = run_drc(cell, rules)
        assert result.passed

        # Off-grid cell fails
        cell2 = Cell("test2")
        cell2.add_polygon(
            Polygon([Point(0.0, 0.0), Point(0.003, 0.0), Point(0.0, 0.01)]),
            Layer(1, 0),
        )
        result2 = run_drc(cell2, rules)
        assert not result2.passed
        assert result2.violations[0].rule_type == "off_grid"

    def test_layer_accepts_int(self):
        """snap_to_grid accepts int layer."""
        rules = DrcRules().snap_to_grid(1, 0.001)
        assert "1 rules" in repr(rules)

    def test_layer_accepts_tuple(self):
        """snap_to_grid accepts tuple layer."""
        rules = DrcRules().snap_to_grid((1, 0), 0.001)
        assert "1 rules" in repr(rules)


class TestAcuteAngle:
    """Tests for the acute-angle DRC check."""

    def test_rectangle_passes(self):
        """Rectangle (all 90° interior angles) passes threshold 60°."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 10.0, 5.0), Layer(1, 0))

        rules = DrcRules().acute_angle(Layer(1, 0), 60.0)
        result = run_drc(cell, rules)
        assert result.passed

    def test_sharp_triangle_fails(self):
        """Thin triangle with ~1° apex fails threshold 60°."""
        cell = Cell("test")
        # Apex at (50, 0), base from (0, -0.5) to (0, 0.5). Apex angle ~1.1°.
        poly = Polygon([Point(0.0, 0.5), Point(0.0, -0.5), Point(50.0, 0.0)])
        cell.add_polygon(poly, Layer(1, 0))

        rules = DrcRules().acute_angle(Layer(1, 0), 60.0, name="ACUTE_60")
        result = run_drc(cell, rules)

        assert not result.passed
        assert len(result.violations) == 1
        v = result.violations[0]
        assert v.rule_type == "acute_angle"
        assert v.rule_name == "ACUTE_60"
        assert v.severity == "error"
        assert "Acute interior angle" in v.message

    def test_reflex_vertex_ignored(self):
        """L-shape has a 270° reflex vertex but no convex acute angles."""
        cell = Cell("test")
        cell.add_polygon(
            Polygon(
                [
                    Point(0.0, 0.0),
                    Point(10.0, 0.0),
                    Point(10.0, 5.0),
                    Point(5.0, 5.0),
                    Point(5.0, 10.0),
                    Point(0.0, 10.0),
                ]
            ),
            Layer(1, 0),
        )

        rules = DrcRules().acute_angle(Layer(1, 0), 60.0)
        result = run_drc(cell, rules)
        assert result.passed, [v.message for v in result.violations]

    def test_toml_config(self, tmp_path):
        """acute_angle loads from TOML config."""
        toml_content = """
[drc.layers."1/0"]
acute_angle = 60.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

        # Rectangle passes
        ok_cell = Cell("ok")
        ok_cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 1.0, 1.0), Layer(1, 0))
        assert run_drc(ok_cell, rules).passed

        # Sharp triangle fails
        bad_cell = Cell("bad")
        bad_cell.add_polygon(
            Polygon([Point(0.0, 0.5), Point(0.0, -0.5), Point(50.0, 0.0)]),
            Layer(1, 0),
        )
        bad_result = run_drc(bad_cell, rules)
        assert not bad_result.passed
        assert bad_result.violations[0].rule_type == "acute_angle"
        assert bad_result.violations[0].rule_name == "L1/0.acute_angle"

    def test_layer_accepts_int(self):
        """acute_angle accepts int layer."""
        rules = DrcRules().acute_angle(1, 60.0)
        assert "1 rules" in repr(rules)

    def test_layer_accepts_tuple(self):
        """acute_angle accepts tuple layer."""
        rules = DrcRules().acute_angle((1, 0), 60.0)
        assert "1 rules" in repr(rules)


class TestNotInside:
    """Tests for the not-inside / exclusion-zone DRC check."""

    def test_inner_fully_inside_outer_fails(self):
        """Inner polygon sitting entirely inside an outer (exclusion) polygon violates."""
        cell = Cell("test")
        # Exclusion zone on layer (2, 0), forbidden layer on (1, 0).
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 20.0, 20.0), Layer(2, 0))
        cell.add_polygon(Polygon.rect(Point(5.0, 5.0), 3.0, 3.0), Layer(1, 0))

        rules = DrcRules().not_inside(Layer(1, 0), Layer(2, 0), name="KEEPOUT")
        result = run_drc(cell, rules)

        assert not result.passed
        assert len(result.violations) == 1
        v = result.violations[0]
        assert v.rule_type == "not_inside"
        assert v.rule_name == "KEEPOUT"
        assert v.layer == (1, 0)
        assert v.layer2 == (2, 0)

    def test_inner_partially_outside_passes(self):
        """Inner polygon crossing an exclusion boundary is not a violation."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 10.0, 10.0), Layer(2, 0))
        # Straddles the boundary
        cell.add_polygon(Polygon.rect(Point(5.0, 5.0), 10.0, 10.0), Layer(1, 0))

        rules = DrcRules().not_inside(Layer(1, 0), Layer(2, 0))
        assert run_drc(cell, rules).passed

    def test_inner_outside_outer_passes(self):
        """Inner polygon entirely outside the exclusion zone is fine."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 5.0, 5.0), Layer(2, 0))
        cell.add_polygon(Polygon.rect(Point(50.0, 50.0), 3.0, 3.0), Layer(1, 0))

        rules = DrcRules().not_inside(Layer(1, 0), Layer(2, 0))
        assert run_drc(cell, rules).passed

    def test_no_exclusion_zone_passes(self):
        """With no outer-layer polygons, nothing can be inside anything."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 5.0, 5.0), Layer(1, 0))

        rules = DrcRules().not_inside(Layer(1, 0), Layer(2, 0))
        assert run_drc(cell, rules).passed

    def test_union_of_outers_contains_inner(self):
        """Two abutting outer polygons together enclose an inner polygon."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 10.0, 10.0), Layer(2, 0))
        cell.add_polygon(Polygon.rect(Point(10.0, 0.0), 10.0, 10.0), Layer(2, 0))
        # Inner straddles the seam between the two outer rectangles.
        cell.add_polygon(Polygon.rect(Point(5.0, 2.0), 10.0, 6.0), Layer(1, 0))

        rules = DrcRules().not_inside(Layer(1, 0), Layer(2, 0))
        result = run_drc(cell, rules)
        assert not result.passed
        assert len(result.violations) == 1

    def test_toml_config(self, tmp_path):
        """not_inside loads from TOML [[drc.rules]]."""
        toml_content = """
[[drc.rules]]
type = "not_inside"
inner = "1/0"
outer = "2/0"
name = "KEEPOUT.SI"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

        # Violating design
        bad = Cell("bad")
        bad.add_polygon(Polygon.rect(Point(0.0, 0.0), 20.0, 20.0), Layer(2, 0))
        bad.add_polygon(Polygon.rect(Point(5.0, 5.0), 3.0, 3.0), Layer(1, 0))
        bad_result = run_drc(bad, rules)
        assert not bad_result.passed
        assert bad_result.violations[0].rule_type == "not_inside"
        assert bad_result.violations[0].rule_name == "KEEPOUT.SI"

        # Passing design (no inner polygons)
        ok = Cell("ok")
        ok.add_polygon(Polygon.rect(Point(0.0, 0.0), 20.0, 20.0), Layer(2, 0))
        assert run_drc(ok, rules).passed

    def test_toml_missing_fields_raises(self, tmp_path):
        """not_inside with missing fields raises ValueError."""
        toml_content = """
[[drc.rules]]
type = "not_inside"
inner = "1/0"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match=r"missing required fields.*outer"):
            load_drc_rules(config_file)


class TestDensity:
    """Tests for layer density (CMP uniformity) DRC check."""

    def test_full_fill_fails_max(self):
        """Region fully covered by a single polygon fails max=0.8."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 100.0, 100.0), Layer(1, 0))

        rules = DrcRules().density(Layer(1, 0), window=50.0, step=50.0, max=0.8, name="DENS")
        result = run_drc(cell, rules)
        assert not result.passed
        v = result.violations[0]
        assert v.rule_type == "density"
        assert v.rule_name == "DENS"
        assert "above maximum" in v.message

    def test_empty_fails_min(self):
        """Empty region fails min=0.2."""
        cell = Cell("test")
        # Use a region layer so the density check has something to scope to.
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 100.0, 100.0), Layer(99, 0))

        rules = DrcRules().density(
            Layer(1, 0),
            window=50.0,
            step=50.0,
            min=0.2,
            region_layer=Layer(99, 0),
            name="DENS",
        )
        result = run_drc(cell, rules)
        assert not result.passed
        v = result.violations[0]
        assert v.rule_type == "density"
        assert "below minimum" in v.message

    def test_requires_min_or_max(self):
        """density() requires at least one of min/max."""
        with pytest.raises(ValueError, match="at least one of min or max"):
            DrcRules().density(Layer(1, 0), window=100.0, step=50.0)

    def test_rejects_non_positive_window(self):
        """density() rejects window <= 0."""
        with pytest.raises(ValueError, match="window must be positive"):
            DrcRules().density(Layer(1, 0), window=0.0, step=50.0, min=0.2)

    def test_rejects_min_greater_than_max(self):
        """density() rejects min > max."""
        with pytest.raises(ValueError, match=r"min .* must be <= max"):
            DrcRules().density(Layer(1, 0), window=100.0, step=50.0, min=0.9, max=0.1)

    def test_layer_accepts_int_and_tuple(self):
        """density() accepts int and tuple layer forms."""
        rules_int = DrcRules().density(1, window=100.0, step=50.0, min=0.2)
        rules_tup = DrcRules().density((1, 0), window=100.0, step=50.0, min=0.2)
        assert "1 rules" in repr(rules_int)
        assert "1 rules" in repr(rules_tup)

    def test_region_layer_scopes_measurement(self):
        """region_layer limits where density is measured."""
        cell = Cell("test")
        # Target fill on the right half only.
        cell.add_polygon(Polygon.rect(Point(50.0, 0.0), 50.0, 100.0), Layer(1, 0))
        # Region marker covers only the left half — so density in the region is 0.
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 50.0, 100.0), Layer(99, 0))

        rules = DrcRules().density(
            Layer(1, 0),
            window=25.0,
            step=25.0,
            min=0.2,
            region_layer=Layer(99, 0),
            name="DENS_RL",
        )
        result = run_drc(cell, rules)
        assert not result.passed
        for v in result.violations:
            assert v.rule_type == "density"

    def test_toml_config(self, tmp_path):
        """Density config loads from TOML."""
        toml_content = """
[drc.layers."1/0".density]
min = 0.2
max = 0.8
window = 50.0
step = 50.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

        # Full-fill cell fails max=0.8
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 100.0, 100.0), Layer(1, 0))
        result = run_drc(cell, rules)
        assert not result.passed
        assert result.violations[0].rule_type == "density"
        # Auto-generated name prefix
        assert result.violations[0].rule_name.endswith(".density")

    def test_toml_config_region_layer_semantic(self, tmp_path):
        """Density config supports semantic region_layer names."""
        toml_content = """
[layers.silicon]
number = 1
datatype = 0

[layers.prbnd]
number = 99
datatype = 0

[drc.layers.silicon.density]
min = 0.2
window = 50.0
step = 50.0
region_layer = "prbnd"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

        # Empty target layer inside a prbnd region -> fails min=0.2
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 100.0, 100.0), Layer(99, 0))
        result = run_drc(cell, rules)
        assert not result.passed

    def test_toml_missing_min_max_raises(self, tmp_path):
        """Density block without min/max raises clear error."""
        toml_content = """
[drc.layers."1/0".density]
window = 50.0
step = 50.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match="at least one of 'min' or 'max'"):
            load_drc_rules(config_file)

    def test_toml_missing_window_raises(self, tmp_path):
        """Density block without window raises clear error."""
        toml_content = """
[drc.layers."1/0".density]
min = 0.2
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match="missing required 'window'"):
            load_drc_rules(config_file)

    def test_toml_step_defaults_to_half_window(self, tmp_path):
        """When step is omitted, it defaults to window / 2."""
        toml_content = """
[drc.layers."1/0".density]
min = 0.2
window = 100.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        # Loads without error; actual step is implementation detail but the
        # rule should fire on an empty design.
        rules = load_drc_rules(config_file)
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 200.0, 200.0), Layer(99, 0))
        # No polygons on target layer (1/0) -> density=0 everywhere -> fails
        result = run_drc(cell, rules)
        assert not result.passed


class TestDrcResult:
    """Tests for DrcResult class."""

    def test_result_properties(self):
        """Result has expected properties."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))

        rules = DrcRules().min_area(Layer(1, 0), 1.0)
        result = run_drc(cell, rules)

        assert result.passed is True
        assert result.polygons_checked == 1
        assert result.rules_checked == 1
        assert result.elapsed_ms >= 0

    def test_result_len(self):
        """len(result) returns violation count."""
        cell = Cell("test")
        rules = DrcRules()
        result = run_drc(cell, rules)

        assert len(result) == 0

    def test_result_repr_passed(self):
        """Repr shows PASSED for clean designs."""
        cell = Cell("test")
        rules = DrcRules()
        result = run_drc(cell, rules)

        assert "PASSED" in repr(result)

    def test_result_repr_failed(self):
        """Repr shows FAILED for violations."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 1.0, 1.0), Layer(1, 0))

        rules = DrcRules().min_area(Layer(1, 0), 100.0)
        result = run_drc(cell, rules)

        assert "FAILED" in repr(result)
        assert "1 errors" in repr(result)


class TestDrcViolation:
    """Tests for DrcViolation class."""

    def test_violation_properties(self):
        """Violation has expected properties."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 2.0, 2.0), Layer(1, 0))

        rules = DrcRules().min_area(Layer(1, 0), 50.0, name="AREA_CHECK")
        result = run_drc(cell, rules)

        assert len(result.violations) == 1
        v = result.violations[0]

        assert v.rule_name == "AREA_CHECK"
        assert v.rule_type == "min_area"
        assert v.severity == "error"
        assert v.layer == (1, 0)
        assert v.layer2 is None
        assert isinstance(v.message, str)
        assert isinstance(v.bbox, tuple)
        # Per ROS-552, per-polygon rules carry cell-name provenance.
        assert v.cell_name == "test"
        assert v.cell_name2 is None

    def test_violation_layer2_for_spacing(self):
        """Spacing violations have layer2 set."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(6, 0), 5.0, 5.0), Layer(2, 0))

        rules = DrcRules().min_spacing(Layer(1, 0), Layer(2, 0), 2.0)
        result = run_drc(cell, rules)

        assert len(result.violations) == 1
        v = result.violations[0]
        assert v.layer == (1, 0)
        assert v.layer2 == (2, 0)

    def test_violation_cell_names_intra_cell(self):
        """Intra-cell overlap violations have both cell_name fields set to the same cell."""
        cell = Cell("my_cell")
        cell.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(3, 0), 5.0, 5.0), Layer(1, 0))

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(1, 0))
        result = run_drc(cell, rules)

        assert len(result.violations) == 1
        v = result.violations[0]
        assert v.cell_name == "my_cell"
        assert v.cell_name2 == "my_cell"

    def test_violation_repr(self):
        """Violation has readable repr."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 1.0, 1.0), Layer(1, 0))

        rules = DrcRules().min_area(Layer(1, 0), 100.0, name="AREA")
        result = run_drc(cell, rules)

        v = result.violations[0]
        assert "DrcViolation" in repr(v)
        assert "AREA" in repr(v)

    def test_violation_hierarchical_provenance_per_polygon(self):
        """Per ROS-552: per-polygon violations in a nested cell carry the
        owning cell_name and a global-frame bbox."""
        leaf = Cell("leaf")
        leaf.add_polygon(Polygon.rect(Point(0, 0), 10.0, 0.05), Layer(1, 0))
        top = Cell("top")
        top.add_ref(CellRef("leaf").at(100.0, 50.0))
        lib = Library("prov_py")
        lib.add_cell(leaf)
        lib.add_cell(top)

        rules = DrcRules().min_width(Layer(1, 0), 0.5)
        result = run_drc(lib.cell("top"), rules, library=lib)

        assert len(result.violations) == 1
        v = result.violations[0]
        assert v.cell_name == "leaf"
        assert v.cell_name2 is None
        (min_x, min_y), (_max_x, _max_y) = v.bbox
        assert abs(min_x - 100.0) < 1e-9
        assert abs(min_y - 50.0) < 1e-9

    def test_violation_hierarchical_provenance_cross_layer_pairwise(self):
        """Cross-layer pairwise violations carry both cell_name fields."""
        a = Cell("cell_a")
        a.add_polygon(Polygon.rect(Point(0, 0), 2.0, 2.0), Layer(1, 0))
        b = Cell("cell_b")
        b.add_polygon(Polygon.rect(Point(0, 0), 2.0, 2.0), Layer(2, 0))
        top = Cell("top")
        top.add_ref(CellRef("cell_a").at(0, 0))
        top.add_ref(CellRef("cell_b").at(1.0, 0.0))  # overlapping
        lib = Library("prov_py2")
        lib.add_cell(a)
        lib.add_cell(b)
        lib.add_cell(top)

        rules = DrcRules().forbid_overlap(Layer(1, 0), Layer(2, 0))
        result = run_drc(lib.cell("top"), rules, library=lib)

        assert len(result.violations) >= 1
        v = result.violations[0]
        assert v.cell_name == "cell_a"
        assert v.cell_name2 == "cell_b"


class TestLoadDrcRules:
    """Tests for load_drc_rules function."""

    def test_load_from_explicit_path(self, tmp_path):
        """Can load rules from explicit path."""
        toml_content = """
[drc.layers."1/0"]
min_width = 0.15
min_spacing = 0.2
min_area = 0.05
angles = [0, 90]
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        # 4 rules: min_width, min_spacing, min_area, allowed_angles
        assert "4 rules" in repr(rules)

    def test_missing_type_field_raises(self, tmp_path):
        """Missing type field raises helpful ValueError."""
        toml_content = """
[[drc.rules]]
layer1 = "1/0"
layer2 = "2/0"
min_spacing = 0.5
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match="missing required 'type' field"):
            load_drc_rules(config_file)

    def test_missing_required_fields_raises(self, tmp_path):
        """Missing required fields raises helpful ValueError."""
        toml_content = """
[[drc.rules]]
type = "enclosure"
inner = "11/0"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match=r"missing required fields.*outer.*min_enclosure"):
            load_drc_rules(config_file)

    def test_load_empty_drc_section(self, tmp_path):
        """Empty DRC section returns empty rules."""
        toml_content = """
[project]
name = "test"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "0 rules" in repr(rules)

    def test_file_not_found(self, tmp_path):
        """Raises FileNotFoundError for missing file."""
        with pytest.raises(FileNotFoundError):
            load_drc_rules(tmp_path / "nonexistent.toml")

    def test_rules_work_with_run_drc(self, tmp_path):
        """Loaded rules can be used with run_drc."""
        toml_content = """
[drc.layers."1/0"]
min_width = 5.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)

        # Create cell with narrow polygon (should fail)
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 2.0), Layer(1, 0))

        result = run_drc(cell, rules)
        assert not result.passed
        assert result.violations[0].rule_type == "min_width"

    def test_layer_datatype_parsing(self, tmp_path):
        """Layer strings with datatype are parsed correctly."""
        toml_content = """
[drc.layers."5/10"]
min_area = 1.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)

        # Create cell with polygon on layer 5/10
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 0.5, 0.5), Layer(5, 10))

        result = run_drc(cell, rules)
        assert not result.passed  # 0.25 < 1.0
        assert result.violations[0].layer == (5, 10)

    def test_load_inter_layer_spacing(self, tmp_path):
        """Can load inter-layer spacing rules."""
        toml_content = """
[[drc.rules]]
type = "spacing"
layer1 = "1/0"
layer2 = "2/0"
min_spacing = 1.0
name = "L1_L2_SPC"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

    def test_load_enclosure_rule(self, tmp_path):
        """Can load enclosure rules."""
        toml_content = """
[[drc.rules]]
type = "enclosure"
inner = "11/0"
outer = "10/0"
min_enclosure = 0.1
name = "VIA_ENC"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

    def test_load_require_overlap_rule(self, tmp_path):
        """Can load require_overlap rules."""
        toml_content = """
[[drc.rules]]
type = "require_overlap"
layer1 = "11/0"
layer2 = "10/0"
name = "VIA_METAL_OVLP"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

    def test_load_forbid_overlap_rule(self, tmp_path):
        """Can load forbid_overlap rules."""
        toml_content = """
[[drc.rules]]
type = "forbid_overlap"
layer1 = "20/0"
layer2 = "21/0"
name = "PN_NOOVLP"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

    def test_load_mixed_layer_and_inter_layer_rules(self, tmp_path):
        """Can load both per-layer and inter-layer rules."""
        toml_content = """
[drc.layers."1/0"]
min_width = 0.12
min_spacing = 0.13

[drc.layers."10/0"]
min_width = 0.5

[[drc.rules]]
type = "spacing"
layer1 = "1/0"
layer2 = "10/0"
min_spacing = 1.0

[[drc.rules]]
type = "forbid_overlap"
layer1 = "1/0"
layer2 = "10/0"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        # 2 (layer 1/0) + 1 (layer 10/0) + 2 (inter-layer) = 5 rules
        assert "5 rules" in repr(rules)

    def test_load_no_overlap_per_layer(self, tmp_path):
        """Can load no_overlap per-layer config that generates forbid_overlap(L, L)."""
        toml_content = """
[drc.layers."1/0"]
min_width = 0.15
no_overlap = true
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        # min_width + forbid_overlap(same layer) = 2 rules
        assert "2 rules" in repr(rules)

    def test_no_overlap_detects_same_layer_overlap(self, tmp_path):
        """no_overlap = true catches overlapping polygons on the same layer."""
        toml_content = """
[drc.layers."1/0"]
no_overlap = true
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)

        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(3, 0), 5.0, 5.0), Layer(1, 0))

        result = run_drc(cell, rules)
        assert not result.passed
        assert len(result.violations) == 1
        assert result.violations[0].rule_type == "forbidden_overlap"

    def test_no_overlap_passes_non_overlapping(self, tmp_path):
        """no_overlap = true passes when polygons don't overlap."""
        toml_content = """
[drc.layers."1/0"]
no_overlap = true
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)

        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(10, 0), 5.0, 5.0), Layer(1, 0))

        result = run_drc(cell, rules)
        assert result.passed

    def test_no_overlap_no_self_compare(self, tmp_path):
        """no_overlap = true does not flag a single polygon against itself."""
        toml_content = """
[drc.layers."1/0"]
no_overlap = true
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)

        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))

        result = run_drc(cell, rules)
        assert result.passed

    def test_unknown_rule_type_raises(self, tmp_path):
        """Unknown rule type raises ValueError."""
        toml_content = """
[[drc.rules]]
type = "unknown_type"
layer1 = "1/0"
layer2 = "2/0"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match="Unknown DRC rule type"):
            load_drc_rules(config_file)

    def test_unknown_per_layer_key_warns(self, tmp_path):
        """Unrecognized per-layer key emits a warning (catches typos)."""
        toml_content = """
[drc.layers."1/0"]
min_widht = 0.12
min_spacing = 0.13
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.warns(UserWarning, match="Unknown DRC key 'min_widht' for layer 1/0"):
            rules = load_drc_rules(config_file)

        # The valid key (min_spacing) should still be loaded
        assert "1 rules" in repr(rules)

    def test_inter_layer_rules_without_name(self, tmp_path):
        """Inter-layer rules work without optional name field."""
        toml_content = """
[[drc.rules]]
type = "spacing"
layer1 = "1/0"
layer2 = "2/0"
min_spacing = 0.5
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

    def test_load_min_edge_length(self, tmp_path):
        """Can load min_edge_length from per-layer config."""
        toml_content = """
[drc.layers."1/0"]
min_edge_length = 0.1
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

        # Verify it works: thin rect has short edges
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 0.05), Layer(1, 0))
        result = run_drc(cell, rules)
        assert not result.passed
        assert result.violations[0].rule_type == "min_edge_length"

    def test_load_max_width(self, tmp_path):
        """Can load max_width from per-layer config."""
        toml_content = """
[drc.layers."1/0"]
max_width = 1.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

        # Verify it works: wide rectangle fails
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 20.0, 3.0), Layer(1, 0))
        result = run_drc(cell, rules)
        assert not result.passed
        assert result.violations[0].rule_type == "max_width"

    def test_load_no_self_intersection(self, tmp_path):
        """Can load no_self_intersection from per-layer config."""
        toml_content = """
[drc.layers."1/0"]
no_self_intersection = true
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

    def test_auto_generated_rule_names(self, tmp_path):
        """Per-layer rules get auto-generated names like L1/0.min_width."""
        toml_content = """
[drc.layers."1/0"]
min_width = 5.0
min_spacing = 10.0
min_area = 100.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)

        # Create cell that violates all rules
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 2.0, 2.0), Layer(1, 0))
        result = run_drc(cell, rules)

        assert not result.passed
        names = {v.rule_name for v in result.violations}
        assert "L1/0.min_width" in names
        assert "L1/0.min_area" in names

    def test_load_all_new_per_layer_rules(self, tmp_path):
        """All new per-layer rule types load together."""
        toml_content = """
[drc.layers."1/0"]
min_width = 0.1
max_width = 10.0
min_edge_length = 0.05
no_self_intersection = true
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "4 rules" in repr(rules)


class TestSemanticLayerNames:
    """Tests for semantic layer name support in DRC and DFM config."""

    def test_drc_semantic_per_layer_rules(self, tmp_path):
        """DRC rules can use semantic names from [layers] section."""
        toml_content = """
[layers.silicon]
number = 1
datatype = 0
color = "#ff69b4"

[drc.layers.silicon]
min_width = 5.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

        # Verify it resolves to the correct layer
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 2.0), Layer(1, 0))

        result = run_drc(cell, rules)
        assert not result.passed
        assert result.violations[0].rule_type == "min_width"
        assert result.violations[0].layer == (1, 0)

    def test_drc_semantic_auto_generated_names(self, tmp_path):
        """Semantic names produce readable auto-generated rule names."""
        toml_content = """
[layers.silicon]
number = 1
datatype = 0

[drc.layers.silicon]
min_width = 5.0
min_area = 100.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)

        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 2.0, 2.0), Layer(1, 0))

        result = run_drc(cell, rules)
        assert not result.passed
        names = {v.rule_name for v in result.violations}
        assert "Lsilicon.min_width" in names
        assert "Lsilicon.min_area" in names

    def test_drc_mixed_semantic_and_numeric(self, tmp_path):
        """Can mix semantic and numeric layer keys in the same config."""
        toml_content = """
[layers.silicon]
number = 1
datatype = 0

[drc.layers.silicon]
min_width = 0.12

[drc.layers."2/0"]
min_width = 0.5
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "2 rules" in repr(rules)

    def test_drc_semantic_inter_layer_rules(self, tmp_path):
        """Inter-layer rules can reference layers by semantic name."""
        toml_content = """
[layers.silicon]
number = 1
datatype = 0

[layers.oxide]
number = 2
datatype = 0

[[drc.rules]]
type = "spacing"
layer1 = "silicon"
layer2 = "oxide"
min_spacing = 1.0
name = "SI_OX_SPC"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

    def test_drc_semantic_mixed_inter_layer(self, tmp_path):
        """Inter-layer rules can mix semantic and numeric layer references."""
        toml_content = """
[layers.silicon]
number = 1
datatype = 0

[[drc.rules]]
type = "spacing"
layer1 = "silicon"
layer2 = "2/0"
min_spacing = 1.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

    def test_drc_unknown_semantic_name_raises(self, tmp_path):
        """Unknown semantic name raises clear ValueError."""
        toml_content = """
[layers.silicon]
number = 1

[drc.layers.nonexistent]
min_width = 0.12
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match="Unknown layer 'nonexistent'"):
            load_drc_rules(config_file)

    def test_drc_warns_unknown_numeric_layer(self, tmp_path):
        """Numeric layer not in [layers] emits a warning."""
        toml_content = """
[layers.silicon]
number = 1

[drc.layers."99/0"]
min_width = 0.12
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.warns(UserWarning, match="DRC layer '99/0' does not match any layer"):
            load_drc_rules(config_file)

    def test_drc_no_warning_when_no_layers_section(self, tmp_path):
        """No warning when [layers] is absent (backward compat)."""
        toml_content = """
[drc.layers."1/0"]
min_width = 0.12
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        import warnings as _w

        with _w.catch_warnings():
            _w.simplefilter("error")
            rules = load_drc_rules(config_file)

        assert "1 rules" in repr(rules)

    def test_drc_no_warning_for_matching_numeric_layer(self, tmp_path):
        """No warning when a numeric key matches a [layers] entry."""
        toml_content = """
[layers.silicon]
number = 1
datatype = 0

[drc.layers."1/0"]
min_width = 0.12
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        import warnings as _w

        with _w.catch_warnings():
            _w.simplefilter("error")
            rules = load_drc_rules(config_file)

        assert "1 rules" in repr(rules)

    def test_drc_semantic_enclosure_rule(self, tmp_path):
        """Enclosure inter-layer rules accept semantic names."""
        toml_content = """
[layers.via]
number = 11

[layers.metal]
number = 10

[[drc.rules]]
type = "enclosure"
inner = "via"
outer = "metal"
min_enclosure = 0.1
name = "VIA_ENC"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

    def test_drc_semantic_forbid_overlap(self, tmp_path):
        """Forbid overlap inter-layer rules accept semantic names."""
        toml_content = """
[layers.p_doping]
number = 20

[layers.n_doping]
number = 21

[[drc.rules]]
type = "forbid_overlap"
layer1 = "p_doping"
layer2 = "n_doping"
name = "PN_NOOVLP"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

    def test_drc_semantic_require_overlap(self, tmp_path):
        """Require overlap inter-layer rules accept semantic names."""
        toml_content = """
[layers.via]
number = 11

[layers.metal]
number = 10

[[drc.rules]]
type = "require_overlap"
layer1 = "via"
layer2 = "metal"
name = "VIA_METAL_OVLP"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        rules = load_drc_rules(config_file)
        assert "1 rules" in repr(rules)

    def test_dfm_semantic_layers(self, tmp_path):
        """DFM config layers list accepts semantic names."""
        toml_content = """
[layers.silicon]
number = 1
datatype = 0

[dfm]
resolution = 0.01
sigma = 0.08
layers = ["silicon"]
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        from rosette import load_dfm_config

        _cfg, _model, layers = load_dfm_config(config_file)
        assert len(layers) == 1
        assert layers[0] == Layer(1, 0)

    def test_dfm_semantic_per_layer_override(self, tmp_path):
        """DFM per-layer overrides accept semantic names."""
        toml_content = """
[layers.silicon]
number = 1
datatype = 0

[dfm]
resolution = 0.01
sigma = 0.08
layers = ["silicon"]

[dfm.layer.silicon]
sigma = 0.05
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        from rosette import load_dfm_config

        _cfg, _model, layers = load_dfm_config(config_file)
        assert len(layers) == 1

    def test_dfm_mixed_semantic_and_numeric(self, tmp_path):
        """DFM layers list can mix semantic and numeric references."""
        toml_content = """
[layers.silicon]
number = 1
datatype = 0

[dfm]
resolution = 0.01
sigma = 0.08
layers = ["silicon", "2/0"]
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        from rosette import load_dfm_config

        _cfg, _model, layers = load_dfm_config(config_file)
        assert len(layers) == 2
        assert layers[0] == Layer(1, 0)
        assert layers[1] == Layer(2, 0)


def _write_design_and_config(tmp_path, *, passing: bool):
    """Helper: write a design .py file and rosette.toml in tmp_path.

    If passing=True, the design satisfies DRC rules.
    If passing=False, the design violates min_width.
    """
    # Design file
    width = 10.0 if passing else 0.05
    design_py = tmp_path / "design.py"
    design_py.write_text(
        f"from rosette import Cell, Layer, Point, Polygon\n"
        f'design = Cell("test")\n'
        f"design.add_polygon(Polygon.rect(Point.origin(), {width}, {width}), Layer(1, 0))\n"
    )

    # Config file
    config_file = tmp_path / "rosette.toml"
    config_file.write_text('[drc.layers."1/0"]\nmin_width = 0.15\nmin_area = 0.01\n')
    return design_py, config_file


class TestDrcCli:
    """Tests for `rosette drc` and `rosette check` CLI commands."""

    def test_run_drc_check_passing(self, tmp_path):
        """_run_drc_check returns passing result for valid design."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=True)

        result, file_path = _run_drc_check(str(design_py), str(config_file))
        assert result.passed
        assert result.rules_checked == 2
        assert file_path.name == "design.py"

    def test_run_drc_check_failing(self, tmp_path):
        """_run_drc_check returns violations for invalid design."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=False)

        result, _file_path = _run_drc_check(str(design_py), str(config_file))
        assert not result.passed
        assert len(result.violations) > 0

    def test_print_drc_result_pass(self, tmp_path, capsys):
        """_print_drc_result prints pass message."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=True)
        result, file_path = _run_drc_check(str(design_py), str(config_file))

        passed = _print_drc_result(result, file_path)
        assert passed

        captured = capsys.readouterr()
        assert "passed" in captured.out
        assert "drc" in captured.out

    def test_print_drc_result_fail(self, tmp_path, capsys):
        """_print_drc_result prints violations."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=False)
        result, file_path = _run_drc_check(str(design_py), str(config_file))

        passed = _print_drc_result(result, file_path)
        assert not passed

        captured = capsys.readouterr()
        assert "FAIL" in captured.out
        assert "violation" in captured.out

    def test_print_drc_result_verbose(self, tmp_path, capsys):
        """Verbose mode shows bounding box coordinates."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=False)
        result, file_path = _run_drc_check(str(design_py), str(config_file))

        _print_drc_result(result, file_path, verbose=True)

        captured = capsys.readouterr()
        assert "at (" in captured.out

    def test_drc_design_exits_on_failure(self, tmp_path):
        """drc_design calls sys.exit(1) on violations."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=False)

        with pytest.raises(SystemExit) as exc_info:
            drc_design(str(design_py), str(config_file))
        assert exc_info.value.code == 1

    def test_drc_design_no_exit_on_pass(self, tmp_path, capsys):
        """drc_design does not exit on pass."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=True)

        # Should not raise SystemExit
        drc_design(str(design_py), str(config_file))

        captured = capsys.readouterr()
        assert "passed" in captured.out

    def test_check_design_exits_on_failure(self, tmp_path):
        """check_design calls sys.exit(1) on violations."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=False)

        with pytest.raises(SystemExit) as exc_info:
            check_design(str(design_py), str(config_file))
        assert exc_info.value.code == 1

    def test_check_design_no_exit_on_pass(self, tmp_path, capsys):
        """check_design does not exit on pass."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=True)

        # Should not raise SystemExit
        check_design(str(design_py), str(config_file))

        captured = capsys.readouterr()
        assert "passed" in captured.out

    def test_missing_config_exits(self, tmp_path):
        """Missing rosette.toml gives clear error and exits."""
        design_py = tmp_path / "design.py"
        design_py.write_text('from rosette import Cell\ndesign = Cell("test")\n')
        fake_config = str(tmp_path / "nonexistent.toml")

        with pytest.raises(SystemExit) as exc_info:
            drc_design(str(design_py), fake_config)
        assert exc_info.value.code == 1

    def test_auto_detect_config(self, tmp_path, monkeypatch, capsys):
        """config_path=None auto-detects rosette.toml from cwd."""
        design_py, _config_file = _write_design_and_config(tmp_path, passing=True)

        # Change cwd to tmp_path so _find_rosette_toml() finds the config
        monkeypatch.chdir(tmp_path)

        # No explicit config -- should auto-detect rosette.toml
        drc_design(str(design_py))

        captured = capsys.readouterr()
        assert "passed" in captured.out


class TestDrcJson:
    """Tests for `rosette drc --json` structured output."""

    def _write_warning_design_and_config(self, tmp_path):
        """A design whose only violation is within the warning margin."""
        design_py = tmp_path / "design.py"
        design_py.write_text(
            "from rosette import Cell, Layer, Point, Polygon\n"
            'design = Cell("test")\n'
            "design.add_polygon(Polygon.rect(Point.origin(), 0.115, 10.0), Layer(1, 0))\n"
        )
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(
            '[drc]\nwarning_margin = 0.01\n\n[drc.layers."1/0"]\nmin_width = 0.12\n'
        )
        return design_py, config_file

    def test_json_pass(self, tmp_path, capsys):
        """--json emits a parseable object with passed=true on a clean run."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=True)

        drc_design(str(design_py), str(config_file), json_output=True)

        out = json.loads(capsys.readouterr().out)
        assert out["schema"] == 1
        assert out["command"] == "drc"
        assert out["passed"] is True
        assert out["summary"]["errors"] == 0
        assert out["violations"] == []

    def test_json_warnings_only_passes(self, tmp_path, capsys):
        """A warnings-only run reports passed=true and does not exit."""
        design_py, config_file = self._write_warning_design_and_config(tmp_path)

        # Must NOT raise SystemExit — warnings-only is a pass.
        drc_design(str(design_py), str(config_file), json_output=True)

        out = json.loads(capsys.readouterr().out)
        assert out["passed"] is True
        assert out["summary"]["warnings"] == 1
        assert out["summary"]["errors"] == 0
        assert out["violations"][0]["severity"] == "warning"

    def test_json_errors_exits_with_bbox(self, tmp_path, capsys):
        """A failing run exits 1 and every violation carries a numeric bbox."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=False)

        with pytest.raises(SystemExit) as exc_info:
            drc_design(str(design_py), str(config_file), json_output=True)
        assert exc_info.value.code == 1

        out = json.loads(capsys.readouterr().out)
        assert out["passed"] is False
        assert out["summary"]["errors"] >= 1
        v = out["violations"][0]
        assert v["severity"] == "error"
        bbox = v["bbox"]
        assert len(bbox) == 2 and len(bbox[0]) == 2
        assert all(isinstance(c, (int, float)) for pt in bbox for c in pt)

    def test_json_missing_config_emits_error_object(self, tmp_path, capsys):
        """A config error surfaces as a JSON error object, not prose."""
        design_py = tmp_path / "design.py"
        design_py.write_text('from rosette import Cell\ndesign = Cell("test")\n')
        fake_config = str(tmp_path / "nonexistent.toml")

        with pytest.raises(SystemExit) as exc_info:
            drc_design(str(design_py), fake_config, json_output=True)
        assert exc_info.value.code == 1

        out = json.loads(capsys.readouterr().out)
        assert out["command"] == "drc"
        assert out["passed"] is False
        assert "error" in out


class TestCheckJson:
    """Tests for `rosette check --json` combined output."""

    def test_json_combined_no_dfm(self, tmp_path, capsys):
        """check --json returns a combined object with dfm=null by default."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=True)

        check_design(str(design_py), str(config_file), json_output=True)

        out = json.loads(capsys.readouterr().out)
        assert out["schema"] == 1
        assert out["command"] == "check"
        assert out["passed"] is True
        assert out["drc"]["passed"] is True
        assert out["checks"]["passed"] is True
        assert out["dfm"] is None

    def test_json_combined_fails_and_exits(self, tmp_path, capsys):
        """A failing sub-check makes top-level passed false and exits 1."""
        design_py, config_file = _write_design_and_config(tmp_path, passing=False)

        with pytest.raises(SystemExit) as exc_info:
            check_design(str(design_py), str(config_file), json_output=True)
        assert exc_info.value.code == 1

        out = json.loads(capsys.readouterr().out)
        assert out["passed"] is False
        assert out["drc"]["passed"] is False


class TestWarningMargin:
    """Tests for the DRC warning margin (ROS-521)."""

    def _cell_with_width(self, width: float) -> Cell:
        c = Cell("test")
        c.add_polygon(Polygon.rect(Point.origin(), width, 10.0), Layer(1, 0))
        return c

    def test_off_by_default(self):
        """With no warning_margin, near-threshold violations are still errors."""
        cell = self._cell_with_width(0.115)
        rules = DrcRules().min_width(Layer(1, 0), 0.12, name="W")

        result = run_drc(cell, rules)
        assert not result.passed
        assert result.error_count == 1
        assert result.warning_count == 0
        assert result.violations[0].severity == "error"

    def test_downgrades_near_threshold(self):
        """Within-margin violation becomes a warning and the run passes."""
        cell = self._cell_with_width(0.115)
        rules = DrcRules().warning_margin(0.01).min_width(Layer(1, 0), 0.12, name="W")

        result = run_drc(cell, rules)
        assert result.passed, "warnings alone should not fail"
        assert result.error_count == 0
        assert result.warning_count == 1
        assert result.violations[0].severity == "warning"

    def test_far_violation_stays_error(self):
        """A violation outside the margin remains an error."""
        cell = self._cell_with_width(0.05)
        rules = DrcRules().warning_margin(0.01).min_width(Layer(1, 0), 0.12, name="W")

        result = run_drc(cell, rules)
        assert not result.passed
        assert result.error_count == 1
        assert result.warning_count == 0

    def test_zero_margin_disables(self):
        """Passing 0.0 is equivalent to not setting it."""
        cell = self._cell_with_width(0.115)
        rules = DrcRules().warning_margin(0.0).min_width(Layer(1, 0), 0.12, name="W")

        result = run_drc(cell, rules)
        assert not result.passed
        assert result.error_count == 1

    def test_does_not_downgrade_categorical_violations(self):
        """Binary checks (forbid_overlap, etc.) are unaffected by warning_margin."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0.0, 0.0), 5.0, 5.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(3.0, 0.0), 5.0, 5.0), Layer(1, 0))

        rules = (
            DrcRules()
            .warning_margin(999.0)  # huge — must not silence binary rules
            .forbid_overlap(Layer(1, 0), Layer(1, 0), name="NO_OVLP")
        )
        result = run_drc(cell, rules)

        assert not result.passed
        assert result.error_count == 1
        assert result.warning_count == 0

    def test_does_not_apply_to_min_area(self):
        """min_area is excluded — its thresholds are squared units."""
        # Area = 0.0099 µm² vs. 0.01 µm² threshold. A naive comparison with a
        # length-unit margin of 0.01 µm would silently downgrade this.
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 0.099, 0.1), Layer(1, 0))

        rules = DrcRules().warning_margin(0.01).min_area(Layer(1, 0), 0.01, name="A")
        result = run_drc(cell, rules)

        assert not result.passed, "min_area violations must remain strict errors"
        assert result.error_count == 1
        assert result.warning_count == 0
        assert result.violations[0].severity == "error"

    def test_mixed_errors_and_warnings(self):
        """A run with both error- and warning-severity violations fails overall."""
        cell = Cell("test")
        # Near-threshold → warning
        cell.add_polygon(Polygon.rect(Point.origin(), 0.115, 10.0), Layer(1, 0))
        # Far below threshold → error
        cell.add_polygon(Polygon.rect(Point(100.0, 0.0), 0.02, 10.0), Layer(1, 0))

        rules = DrcRules().warning_margin(0.01).min_width(Layer(1, 0), 0.12, name="W")
        result = run_drc(cell, rules)

        assert not result.passed
        assert result.error_count == 1
        assert result.warning_count == 1

    def test_toml_config(self, tmp_path):
        """``warning_margin`` under ``[drc]`` is picked up by load_drc_rules."""
        config = tmp_path / "rosette.toml"
        config.write_text('[drc]\nwarning_margin = 0.01\n\n[drc.layers."1/0"]\nmin_width = 0.12\n')

        cell = self._cell_with_width(0.115)
        rules = load_drc_rules(str(config))
        result = run_drc(cell, rules)

        assert result.passed
        assert result.warning_count == 1

    def test_toml_rejects_non_numeric(self, tmp_path):
        """A non-numeric ``warning_margin`` surfaces a clear ValueError."""
        config = tmp_path / "rosette.toml"
        config.write_text('[drc]\nwarning_margin = "oops"\n')

        with pytest.raises(ValueError, match="warning_margin must be a number"):
            load_drc_rules(str(config))

    def test_cli_does_not_exit_on_warnings_only(self, tmp_path, capsys):
        """``rosette drc`` passes (exit 0) when only warnings are produced."""
        design_py = tmp_path / "design.py"
        design_py.write_text(
            "from rosette import Cell, Layer, Point, Polygon\n"
            'design = Cell("test")\n'
            "design.add_polygon(Polygon.rect(Point.origin(), 0.115, 10.0), Layer(1, 0))\n"
        )
        config = tmp_path / "rosette.toml"
        config.write_text('[drc]\nwarning_margin = 0.01\n\n[drc.layers."1/0"]\nmin_width = 0.12\n')

        # Must NOT raise SystemExit — warnings-only is a pass.
        drc_design(str(design_py), str(config))

        captured = capsys.readouterr()
        assert "WARN" in captured.out
        assert "passed" in captured.out

    def test_cli_exits_on_error_even_with_warnings(self, tmp_path):
        """``rosette drc`` still exits 1 if any error remains, alongside warnings."""
        design_py = tmp_path / "design.py"
        design_py.write_text(
            "from rosette import Cell, Layer, Point, Polygon\n"
            'design = Cell("test")\n'
            # One near-threshold (warning) + one far-below (error)
            "design.add_polygon(Polygon.rect(Point.origin(), 0.115, 10.0), Layer(1, 0))\n"
            "design.add_polygon(Polygon.rect(Point(100.0, 0.0), 0.02, 10.0), Layer(1, 0))\n"
        )
        config = tmp_path / "rosette.toml"
        config.write_text('[drc]\nwarning_margin = 0.01\n\n[drc.layers."1/0"]\nmin_width = 0.12\n')

        with pytest.raises(SystemExit) as exc_info:
            drc_design(str(design_py), str(config))
        assert exc_info.value.code == 1
