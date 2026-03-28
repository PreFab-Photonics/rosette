"""Tests for unified design checks functionality.

These tests focus on Python-specific behavior and integration.
Core algorithm correctness is tested in Rust.
"""

import pytest

from rosette import (
    Cell,
    ChecksConfig,
    Layer,
    Point,
    Polygon,
    Port,
    Vector2,
    load_checks_config,
    run_checks,
)
from rosette.cli import (
    _print_checks_result,
    _run_checks_check,
)


def _make_waveguide(name: str, length: float, width: float) -> Cell:
    """Helper: create a simple waveguide cell with in/out ports."""
    cell = Cell(name)
    cell.add_polygon(Polygon.rect(Point.origin(), length, width), Layer(1, 0))
    cell.add_port(Port("in", Point(0.0, width / 2), -Vector2.unit_x(), width=width))
    cell.add_port(Port("out", Point(length, width / 2), Vector2.unit_x(), width=width))
    return cell


class TestChecksConfig:
    """Tests for ChecksConfig."""

    def test_defaults(self):
        """Default config has sensible values."""
        config = ChecksConfig()
        assert "ChecksConfig" in repr(config)

    def test_custom_values(self):
        """Config accepts custom values."""
        config = ChecksConfig(
            position_tolerance=0.01,
            angle_tolerance=1.0,
            check_widths=False,
            min_bend_radius=5.0,
            severity="warning",
        )
        assert "check_widths=false" in repr(config)

    def test_invalid_severity(self):
        """Invalid severity raises ValueError."""
        with pytest.raises(ValueError, match="severity"):
            ChecksConfig(severity="fatal")


class TestRunChecks:
    """Tests for run_checks function."""

    def test_empty_cell_passes(self):
        """Empty cell with no ports passes."""
        cell = Cell("empty")
        result = run_checks(cell)
        assert result.passed
        assert result.ports_checked == 0
        assert result.connections_found == 0
        assert result.bends_checked == 0

    def test_top_level_ports_exempt(self):
        """Top-level ports are treated as external I/O and not flagged."""
        cell = Cell("top")
        cell.add_port(Port("in", Point.origin(), -Vector2.unit_x(), width=0.5))
        cell.add_port(Port("out", Point(100.0, 0.0), Vector2.unit_x(), width=0.5))

        result = run_checks(cell)
        assert result.passed
        assert result.ports_checked == 2

    def test_connected_ports_pass(self):
        """Two components placed port-to-port pass connectivity."""
        wg1 = _make_waveguide("wg1", 10.0, 0.5)
        wg2 = _make_waveguide("wg2", 10.0, 0.5)

        top = Cell("top")
        top.add_ref(wg1)
        top.add_ref(wg2.at(10.0, 0.0))
        top.add_port(Port("in", Point(0.0, 0.25), -Vector2.unit_x(), width=0.5))
        top.add_port(Port("out", Point(20.0, 0.25), Vector2.unit_x(), width=0.5))

        result = run_checks(top)
        assert result.passed
        assert result.connections_found >= 1

    def test_unconnected_port(self):
        """A dangling port is flagged as unconnected."""
        wg = _make_waveguide("wg", 10.0, 0.5)

        top = Cell("top")
        top.add_ref(wg)
        top.add_port(Port("in", Point(0.0, 0.25), -Vector2.unit_x(), width=0.5))

        result = run_checks(top)
        assert not result.passed

        unconnected = [v for v in result.violations if v.violation_type == "unconnected_port"]
        assert len(unconnected) >= 1
        assert unconnected[0].name == "out"

    def test_width_mismatch(self):
        """Connected ports with different widths are flagged."""
        wg1 = _make_waveguide("wg1", 10.0, 0.5)
        wg2 = _make_waveguide("wg2", 10.0, 0.4)

        top = Cell("top")
        top.add_ref(wg1)
        top.add_ref(wg2.at(10.0, 0.05))
        top.add_port(Port("in", Point(0.0, 0.25), -Vector2.unit_x(), width=0.5))
        top.add_port(Port("out", Point(20.0, 0.25), Vector2.unit_x(), width=0.4))

        result = run_checks(top)

        width_violations = [v for v in result.violations if v.violation_type == "width_mismatch"]
        assert len(width_violations) >= 1
        assert width_violations[0].partner_name is not None

    def test_width_check_disabled(self):
        """Width mismatch is not flagged when check_widths=False."""
        wg1 = _make_waveguide("wg1", 10.0, 0.5)
        wg2 = _make_waveguide("wg2", 10.0, 0.4)

        top = Cell("top")
        top.add_ref(wg1)
        top.add_ref(wg2.at(10.0, 0.05))
        top.add_port(Port("in", Point(0.0, 0.25), -Vector2.unit_x(), width=0.5))
        top.add_port(Port("out", Point(20.0, 0.25), Vector2.unit_x(), width=0.4))

        config = ChecksConfig(check_widths=False)
        result = run_checks(top, config)

        width_violations = [v for v in result.violations if v.violation_type == "width_mismatch"]
        assert len(width_violations) == 0

    def test_with_custom_config(self):
        """Custom config is respected."""
        config = ChecksConfig(position_tolerance=0.01, severity="warning")
        cell = Cell("empty")
        result = run_checks(cell, config)
        assert result.passed


class TestBendRadiusChecks:
    """Tests for bend radius checking via run_checks."""

    def test_bend_below_minimum(self):
        """A bend below min_bend_radius is flagged."""
        cell = Cell("top")
        cell.add_bend(3.0, 5.0, 0.0)

        config = ChecksConfig(min_bend_radius=5.0)
        result = run_checks(cell, config)

        assert not result.passed
        bend_violations = [
            v for v in result.violations if v.violation_type == "bend_radius_too_small"
        ]
        assert len(bend_violations) == 1
        assert result.bends_checked == 1

    def test_bend_above_minimum(self):
        """A bend above min_bend_radius passes."""
        cell = Cell("top")
        cell.add_bend(10.0, 5.0, 0.0)

        config = ChecksConfig(min_bend_radius=5.0)
        result = run_checks(cell, config)

        assert result.passed
        assert result.bends_checked == 1

    def test_no_min_bend_radius(self):
        """Without min_bend_radius configured, bend checks are skipped."""
        cell = Cell("top")
        cell.add_bend(1.0, 5.0, 0.0)

        config = ChecksConfig()  # min_bend_radius=None
        result = run_checks(cell, config)

        # No violation because no minimum is configured
        bend_violations = [
            v for v in result.violations if v.violation_type == "bend_radius_too_small"
        ]
        assert len(bend_violations) == 0

    def test_auto_reduced_bend_warning(self):
        """An auto-reduced bend produces a warning."""
        cell = Cell("top")
        cell.add_bend(3.0, 5.0, 0.0, requested_radius=10.0)

        config = ChecksConfig(min_bend_radius=5.0)
        result = run_checks(cell, config)

        auto_reduced = [
            v for v in result.violations if v.violation_type == "bend_radius_auto_reduced"
        ]
        too_small = [v for v in result.violations if v.violation_type == "bend_radius_too_small"]
        assert len(auto_reduced) == 1
        assert auto_reduced[0].severity == "warning"
        assert len(too_small) == 1


class TestChecksResult:
    """Tests for ChecksResult properties."""

    def test_result_properties(self):
        """Result exposes all expected properties."""
        cell = Cell("test")
        result = run_checks(cell)

        assert isinstance(result.passed, bool)
        assert isinstance(result.ports_checked, int)
        assert isinstance(result.connections_found, int)
        assert isinstance(result.bends_checked, int)
        assert isinstance(result.elapsed_ms, float)
        assert isinstance(result.violations, list)
        assert len(result) == 0

    def test_repr_passed(self):
        """Repr includes PASSED for passing result."""
        cell = Cell("test")
        result = run_checks(cell)
        assert "PASSED" in repr(result)

    def test_repr_failed(self):
        """Repr includes FAILED for failing result."""
        wg = _make_waveguide("wg", 10.0, 0.5)
        top = Cell("top")
        top.add_ref(wg)

        result = run_checks(top)
        assert "FAILED" in repr(result)


class TestCheckViolation:
    """Tests for CheckViolation properties."""

    def test_violation_properties(self):
        """Violation exposes all expected properties."""
        wg = _make_waveguide("wg", 10.0, 0.5)
        top = Cell("top")
        top.add_ref(wg)

        result = run_checks(top)
        assert len(result.violations) > 0

        v = result.violations[0]
        assert isinstance(v.violation_type, str)
        assert isinstance(v.name, str)
        assert isinstance(v.cell_path, str)
        assert isinstance(v.message, str)
        assert v.severity in ("error", "warning")
        assert isinstance(v.bbox, tuple)
        assert len(v.bbox) == 2
        assert "CheckViolation" in repr(v)


class TestPortCanConnectTo:
    """Tests for Port.can_connect_to method."""

    def test_opposite_directions_connect(self):
        """Ports at same position with opposite directions can connect."""
        p1 = Port("out", Point.origin(), Vector2.unit_x(), width=0.5)
        p2 = Port("in", Point.origin(), -Vector2.unit_x(), width=0.5)
        assert p1.can_connect_to(p2)

    def test_same_direction_no_connect(self):
        """Ports with same direction cannot connect."""
        p1 = Port("out", Point.origin(), Vector2.unit_x(), width=0.5)
        p2 = Port("in", Point.origin(), Vector2.unit_x(), width=0.5)
        assert not p1.can_connect_to(p2)

    def test_far_apart_no_connect(self):
        """Ports far apart cannot connect."""
        p1 = Port("out", Point.origin(), Vector2.unit_x(), width=0.5)
        p2 = Port("in", Point(10.0, 0.0), -Vector2.unit_x(), width=0.5)
        assert not p1.can_connect_to(p2)

    def test_custom_tolerance(self):
        """Custom tolerance is respected."""
        p1 = Port("out", Point.origin(), Vector2.unit_x(), width=0.5)
        p2 = Port("in", Point(0.005, 0.0), -Vector2.unit_x(), width=0.5)
        assert not p1.can_connect_to(p2, tolerance=0.001)
        assert p1.can_connect_to(p2, tolerance=0.01)


class TestLoadChecksConfig:
    """Tests for load_checks_config."""

    def test_defaults_when_no_config(self, tmp_path, monkeypatch):
        """Returns defaults when no rosette.toml exists."""
        monkeypatch.chdir(tmp_path)
        config = load_checks_config()
        assert "ChecksConfig" in repr(config)

    def test_loads_from_toml(self, tmp_path):
        """Loads config from rosette.toml [checks] section."""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(
            "[checks]\n"
            "position_tolerance = 0.01\n"
            "angle_tolerance = 1.0\n"
            "check_widths = false\n"
            "min_bend_radius = 5.0\n"
            'severity = "warning"\n'
        )

        config = load_checks_config(str(config_file))
        assert "check_widths=false" in repr(config)

    def test_defaults_when_no_section(self, tmp_path):
        """Returns defaults when rosette.toml exists but has no [checks]."""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text('[project]\nname = "test"\n')

        config = load_checks_config(str(config_file))
        assert "ChecksConfig" in repr(config)

    def test_missing_config_file_raises(self, tmp_path):
        """Raises FileNotFoundError for explicit nonexistent path."""
        with pytest.raises(FileNotFoundError):
            load_checks_config(str(tmp_path / "nonexistent.toml"))


def _write_connected_design(tmp_path, *, connected: bool):
    """Helper: write a design with connected or unconnected ports."""
    design_py = tmp_path / "design.py"
    if connected:
        design_py.write_text(
            "from rosette import Cell, Point, Port, Vector2\n"
            'design = Cell("top")\n'
            'design.add_port(Port("in", Point.origin(), -Vector2.unit_x(), width=0.5))\n'
            'design.add_port(Port("out", Point(10.0, 0.0), Vector2.unit_x(), width=0.5))\n'
        )
    else:
        design_py.write_text(
            "from rosette import Cell, Layer, Point, Polygon, Port, Vector2\n"
            'wg = Cell("wg")\n'
            "wg.add_polygon(Polygon.rect(Point.origin(), 10.0, 0.5), Layer(1, 0))\n"
            'wg.add_port(Port("in", Point(0.0, 0.25), -Vector2.unit_x(), width=0.5))\n'
            'wg.add_port(Port("out", Point(10.0, 0.25), Vector2.unit_x(), width=0.5))\n'
            'design = Cell("top")\n'
            "design.add_ref(wg)\n"
        )

    config_file = tmp_path / "rosette.toml"
    config_file.write_text('[checks]\nposition_tolerance = 0.001\nseverity = "error"\n')
    return design_py, config_file


class TestChecksCli:
    """Tests for design checks in `rosette check`."""

    def test_run_checks_check_passing(self, tmp_path):
        """_run_checks_check returns passing result for connected design."""
        design_py, config_file = _write_connected_design(tmp_path, connected=True)

        result, file_path = _run_checks_check(str(design_py), str(config_file))
        assert result.passed
        assert file_path.name == "design.py"

    def test_run_checks_check_failing(self, tmp_path):
        """_run_checks_check returns violations for disconnected design."""
        design_py, config_file = _write_connected_design(tmp_path, connected=False)

        result, _file_path = _run_checks_check(str(design_py), str(config_file))
        assert not result.passed
        assert len(result.violations) > 0

    def test_print_checks_result_pass(self, tmp_path, capsys):
        """_print_checks_result prints pass message."""
        design_py, config_file = _write_connected_design(tmp_path, connected=True)
        result, file_path = _run_checks_check(str(design_py), str(config_file))

        passed = _print_checks_result(result, file_path)
        assert passed

        captured = capsys.readouterr()
        assert "passed" in captured.out
        assert "checks" in captured.out

    def test_print_checks_result_fail(self, tmp_path, capsys):
        """_print_checks_result prints violations."""
        design_py, config_file = _write_connected_design(tmp_path, connected=False)
        result, file_path = _run_checks_check(str(design_py), str(config_file))

        passed = _print_checks_result(result, file_path)
        assert not passed

        captured = capsys.readouterr()
        assert "FAIL" in captured.out
        assert "violation" in captured.out

    def test_print_checks_result_verbose(self, tmp_path, capsys):
        """Verbose mode shows bounding box coordinates."""
        design_py, config_file = _write_connected_design(tmp_path, connected=False)
        result, file_path = _run_checks_check(str(design_py), str(config_file))

        _print_checks_result(result, file_path, verbose=True)

        captured = capsys.readouterr()
        assert "at (" in captured.out
