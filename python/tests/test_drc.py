"""Tests for DRC (Design Rule Checking) functionality.

These tests focus on Python-specific behavior and integration.
Core algorithm correctness is tested in Rust.
"""

import pytest

from rosette import Cell, DrcRules, Layer, Point, Polygon, load_drc_rules, run_drc


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
        assert "1 violations" in repr(result)


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

    def test_violation_repr(self):
        """Violation has readable repr."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 1.0, 1.0), Layer(1, 0))

        rules = DrcRules().min_area(Layer(1, 0), 100.0, name="AREA")
        result = run_drc(cell, rules)

        v = result.violations[0]
        assert "DrcViolation" in repr(v)
        assert "AREA" in repr(v)


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
