"""Tests for Python photonic components.

Components are now Python functions in rosette.components that return Cells.
These tests verify the component functions generate valid cells with ports.
"""

import pytest

from rosette import Cell, Layer
from rosette.components import (
    bend,
    crossing,
    directional_coupler,
    grating_coupler,
    mmi_1x2,
    mmi_2x1,
    mmi_2x2,
    ring,
    sbend,
    spiral,
    taper,
    waveguide,
    ybranch,
)


@pytest.fixture
def layer() -> Layer:
    """Standard waveguide layer."""
    return Layer(1, 0)


# =============================================================================
# Parameterized tests for common component behavior
# =============================================================================


@pytest.mark.parametrize(
    "component_factory,expected_ports",
    [
        # Two-port components (new API: layer first)
        (lambda layer: waveguide(layer, waveguide_width=0.5, length=10.0), ["in", "out"]),
        (lambda layer: bend(layer, waveguide_width=0.5, radius=5.0, angle=90.0), ["in", "out"]),
        (lambda layer: taper(layer, width_in=0.5, width_out=1.0, length=10.0), ["in", "out"]),
        (lambda layer: sbend(layer, waveguide_width=0.5, length=20.0, offset=5.0), ["in", "out"]),
        # Multi-port components
        (lambda layer: mmi_1x2(layer), ["in", "out1", "out2"]),
        (lambda layer: mmi_2x1(layer), ["in1", "in2", "out"]),
        (lambda layer: mmi_2x2(layer), ["in1", "in2", "out1", "out2"]),
        (lambda layer: directional_coupler(layer), ["in1", "in2", "out1", "out2"]),
        (lambda layer: ybranch(layer, waveguide_width=0.5), ["in", "out1", "out2"]),
        (
            lambda layer: ring(layer, waveguide_width=0.5, radius=10.0, coupling="allpass"),
            ["in", "out"],
        ),
        (
            lambda layer: ring(layer, waveguide_width=0.5, radius=10.0, coupling="adddrop"),
            ["in", "through", "add", "drop"],
        ),
        (lambda layer: spiral(layer, waveguide_width=0.5), ["in", "out"]),
        (lambda layer: crossing(layer, waveguide_width=0.5), ["in1", "out1", "in2", "out2"]),
        (lambda layer: grating_coupler(layer, waveguide_width=0.5), ["opt"]),
    ],
    ids=[
        "waveguide",
        "bend",
        "taper",
        "sbend",
        "mmi_1x2",
        "mmi_2x1",
        "mmi_2x2",
        "directional_coupler",
        "ybranch",
        "ring_allpass",
        "ring_adddrop",
        "spiral",
        "crossing",
        "grating_coupler",
    ],
)
def test_component_ports(component_factory, expected_ports, layer):
    """Components have expected port names."""
    cell = component_factory(layer)
    assert isinstance(cell, Cell)
    port_names = [p.name for p in cell.ports()]
    for port_name in expected_ports:
        assert port_name in port_names, f"Missing port '{port_name}' in {port_names}"


@pytest.mark.parametrize(
    "component_factory",
    [
        lambda layer: waveguide(layer, waveguide_width=0.5, length=10.0),
        lambda layer: bend(layer, waveguide_width=0.5, radius=5.0, angle=90.0),
        lambda layer: taper(layer, width_in=0.5, width_out=1.0, length=10.0),
        lambda layer: sbend(layer, waveguide_width=0.5, length=20.0, offset=5.0),
        lambda layer: mmi_1x2(layer),
        lambda layer: mmi_2x1(layer),
        lambda layer: mmi_2x2(layer),
        lambda layer: directional_coupler(layer),
        lambda layer: ybranch(layer, waveguide_width=0.5),
        lambda layer: ring(layer, waveguide_width=0.5, radius=10.0),
        lambda layer: spiral(layer, waveguide_width=0.5),
        lambda layer: crossing(layer, waveguide_width=0.5),
        lambda layer: grating_coupler(layer, waveguide_width=0.5),
    ],
    ids=[
        "waveguide",
        "bend",
        "taper",
        "sbend",
        "mmi_1x2",
        "mmi_2x1",
        "mmi_2x2",
        "directional_coupler",
        "ybranch",
        "ring",
        "spiral",
        "crossing",
        "grating_coupler",
    ],
)
def test_component_has_polygons(component_factory, layer):
    """All components generate cells with polygons."""
    cell = component_factory(layer)
    assert cell.polygon_count() > 0


# =============================================================================
# Component-specific tests
# =============================================================================


class TestWaveguide:
    """Waveguide component tests."""

    def test_basic(self, layer):
        """Create a basic waveguide."""
        cell = waveguide(layer, waveguide_width=0.5, length=10.0)
        assert cell.polygon_count() > 0
        assert cell.path_length == pytest.approx(10.0)

    def test_ports(self, layer):
        """Waveguide has in/out ports with correct positions."""
        cell = waveguide(layer, waveguide_width=0.5, length=10.0)
        port_in = cell.port("in")
        port_out = cell.port("out")

        assert port_in.position.x == pytest.approx(0.0)
        assert port_out.position.x == pytest.approx(10.0)


class TestBend:
    """Bend component tests."""

    def test_circular_90(self, layer):
        """90-degree circular bend."""
        cell = bend(layer, waveguide_width=0.5, radius=5.0, angle=90.0)
        assert cell.polygon_count() > 0

    def test_euler_90(self, layer):
        """90-degree Euler bend."""
        cell = bend(layer, waveguide_width=0.5, radius=5.0, angle=90.0, euler=True)
        assert cell.polygon_count() > 0

    def test_negative_angle(self, layer):
        """Negative angle bends clockwise."""
        cell = bend(layer, waveguide_width=0.5, radius=5.0, angle=-90.0)
        port_out = cell.port("out")
        # Output should be below input for clockwise bend
        assert port_out.position.y < 0


class TestTaper:
    """Taper component tests."""

    def test_basic(self, layer):
        """Create a basic taper."""
        cell = taper(layer, width_in=0.5, width_out=1.0, length=10.0)
        assert cell.polygon_count() > 0

    def test_port_widths(self, layer):
        """Taper ports have different widths."""
        cell = taper(layer, width_in=0.5, width_out=1.0, length=10.0)
        port_in = cell.port("in")
        port_out = cell.port("out")
        assert port_in.width == pytest.approx(0.5)
        assert port_out.width == pytest.approx(1.0)


class TestSBend:
    """S-bend component tests."""

    def test_cosine(self, layer):
        """Cosine S-bend."""
        cell = sbend(layer, waveguide_width=0.5, length=20.0, offset=5.0, bend_type="cosine")
        assert cell.polygon_count() > 0

    def test_circular(self, layer):
        """Circular S-bend."""
        cell = sbend(layer, waveguide_width=0.5, length=20.0, offset=5.0, bend_type="circular")
        assert cell.polygon_count() > 0

    def test_euler(self, layer):
        """Euler S-bend."""
        cell = sbend(layer, waveguide_width=0.5, length=20.0, offset=5.0, bend_type="euler")
        assert cell.polygon_count() > 0

    def test_vertical_offset(self, layer):
        """Output port is vertically offset."""
        cell = sbend(layer, waveguide_width=0.5, length=20.0, offset=5.0)
        port_in = cell.port("in")
        port_out = cell.port("out")
        vertical_diff = port_out.position.y - port_in.position.y
        assert vertical_diff == pytest.approx(5.0)


class TestMMI:
    """MMI component tests."""

    def test_1x2(self, layer):
        """1x2 MMI splitter."""
        cell = mmi_1x2(layer)
        assert cell.polygon_count() > 0
        ports = [p.name for p in cell.ports()]
        assert "in" in ports
        assert "out1" in ports
        assert "out2" in ports

    def test_2x1(self, layer):
        """2x1 MMI combiner."""
        cell = mmi_2x1(layer)
        ports = [p.name for p in cell.ports()]
        assert "in1" in ports
        assert "in2" in ports
        assert "out" in ports

    def test_2x2(self, layer):
        """2x2 MMI coupler."""
        cell = mmi_2x2(layer)
        ports = [p.name for p in cell.ports()]
        assert "in1" in ports
        assert "in2" in ports
        assert "out1" in ports
        assert "out2" in ports


class TestRing:
    """Ring resonator tests."""

    def test_allpass(self, layer):
        """All-pass ring."""
        cell = ring(layer, waveguide_width=0.5, radius=10.0, coupling="allpass")
        ports = [p.name for p in cell.ports()]
        assert "in" in ports
        assert "out" in ports

    def test_adddrop(self, layer):
        """Add-drop ring."""
        cell = ring(layer, waveguide_width=0.5, radius=10.0, coupling="adddrop")
        ports = [p.name for p in cell.ports()]
        assert "in" in ports
        assert "through" in ports
        assert "add" in ports
        assert "drop" in ports


class TestSpiral:
    """Spiral component tests."""

    def test_basic(self, layer):
        """Create a basic spiral."""
        cell = spiral(layer, waveguide_width=0.5, turns=3, min_radius=10.0)
        assert cell.polygon_count() > 0

    def test_path_length(self, layer):
        """Spiral has substantial path length."""
        cell = spiral(layer, waveguide_width=0.5, turns=3)
        assert cell.path_length is not None
        assert cell.path_length > 0


class TestCrossing:
    """Crossing component tests."""

    def test_simple(self, layer):
        """Simple crossing."""
        cell = crossing(layer, waveguide_width=0.5, crossing_type="simple")
        assert cell.polygon_count() > 0

    def test_elliptical(self, layer):
        """Elliptical crossing."""
        cell = crossing(layer, waveguide_width=0.5, crossing_type="elliptical")
        assert cell.polygon_count() > 0

    def test_mmi(self, layer):
        """MMI-based crossing."""
        cell = crossing(layer, waveguide_width=0.5, crossing_type="mmi")
        assert cell.polygon_count() > 0


class TestGratingCoupler:
    """Grating coupler tests."""

    def test_uniform(self, layer):
        """Uniform grating coupler."""
        cell = grating_coupler(layer, waveguide_width=0.5, grating_type="uniform")
        assert cell.polygon_count() > 0

    def test_apodized(self, layer):
        """Apodized grating coupler."""
        cell = grating_coupler(layer, waveguide_width=0.5, grating_type="apodized")
        assert cell.polygon_count() > 0

    def test_focusing(self, layer):
        """Focused grating coupler."""
        cell = grating_coupler(layer, waveguide_width=0.5, focusing_angle=30.0)
        assert cell.polygon_count() > 0


class TestDirectionalCoupler:
    """Directional coupler tests."""

    def test_basic(self, layer):
        """Create a basic directional coupler."""
        cell = directional_coupler(layer)
        assert cell.polygon_count() > 0
        ports = [p.name for p in cell.ports()]
        assert "in1" in ports
        assert "in2" in ports
        assert "out1" in ports
        assert "out2" in ports


class TestYBranch:
    """Y-branch tests."""

    def test_basic(self, layer):
        """Create a basic Y-branch."""
        cell = ybranch(layer, waveguide_width=0.5)
        assert cell.polygon_count() > 0
        ports = [p.name for p in cell.ports()]
        assert "in" in ports
        assert "out1" in ports
        assert "out2" in ports
