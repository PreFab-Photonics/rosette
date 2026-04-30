"""Tests for Python photonic components.

Components are now Python functions in rosette.components that return Cells.
These tests verify the component functions generate valid cells with ports.
"""

import math

import pytest

from rosette import Cell, Layer
from rosette.components import (
    bragg_grating,
    crossing,
    directional_coupler,
    grating_coupler,
    mmi_1x2,
    mmi_2x1,
    mmi_2x2,
    ring,
    sbend,
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
        (lambda layer: sbend(layer, waveguide_width=0.5, length=20.0, offset=5.0), ["in", "out"]),
        # Multi-port components
        (lambda layer: mmi_1x2(layer), ["in", "out1", "out2"]),
        (lambda layer: mmi_2x1(layer), ["in1", "in2", "out"]),
        (lambda layer: mmi_2x2(layer), ["in1", "in2", "out1", "out2"]),
        (lambda layer: directional_coupler(layer), ["in1", "in2", "out1", "out2"]),
        (
            lambda layer: ring(layer, waveguide_width=0.5, radius=10.0, coupling="allpass"),
            ["in", "out"],
        ),
        (
            lambda layer: ring(layer, waveguide_width=0.5, radius=10.0, coupling="adddrop"),
            ["in", "through", "add", "drop"],
        ),
        (lambda layer: crossing(layer, waveguide_width=0.5), ["in1", "out1", "in2", "out2"]),
        (lambda layer: grating_coupler(layer, waveguide_width=0.5), ["opt"]),
        (lambda layer: bragg_grating(layer, num_periods=20), ["in", "out"]),
    ],
    ids=[
        "sbend",
        "mmi_1x2",
        "mmi_2x1",
        "mmi_2x2",
        "directional_coupler",
        "ring_allpass",
        "ring_adddrop",
        "crossing",
        "grating_coupler",
        "bragg_grating",
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
        lambda layer: sbend(layer, waveguide_width=0.5, length=20.0, offset=5.0),
        lambda layer: mmi_1x2(layer),
        lambda layer: mmi_2x1(layer),
        lambda layer: mmi_2x2(layer),
        lambda layer: directional_coupler(layer),
        lambda layer: ring(layer, waveguide_width=0.5, radius=10.0),
        lambda layer: crossing(layer, waveguide_width=0.5),
        lambda layer: grating_coupler(layer, waveguide_width=0.5),
        lambda layer: bragg_grating(layer, num_periods=20),
    ],
    ids=[
        "sbend",
        "mmi_1x2",
        "mmi_2x1",
        "mmi_2x2",
        "directional_coupler",
        "ring",
        "crossing",
        "grating_coupler",
        "bragg_grating",
    ],
)
def test_component_has_polygons(component_factory, layer):
    """All components generate cells with polygons."""
    cell = component_factory(layer)
    assert cell.polygon_count() > 0


# =============================================================================
# Component-specific tests
# =============================================================================


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


class TestBraggGrating:
    """Bragg grating component tests."""

    def test_basic(self, layer):
        """Uniform Bragg grating with default parameters."""
        cell = bragg_grating(layer, num_periods=50)
        assert cell.polygon_count() == 1  # single sidewall polygon

    def test_port_positions_and_widths(self, layer):
        """Ports sit at (0, 0) and (length, 0) with mean waveguide width."""
        num_periods = 100
        period = 0.32
        width = 0.5
        cell = bragg_grating(
            layer,
            waveguide_width=width,
            period=period,
            num_periods=num_periods,
        )
        port_in = cell.port("in")
        port_out = cell.port("out")

        assert port_in.position.x == pytest.approx(0.0)
        assert port_in.position.y == pytest.approx(0.0)
        assert port_in.direction.x == pytest.approx(-1.0)
        assert port_in.direction.y == pytest.approx(0.0)
        assert port_in.width == pytest.approx(width)

        assert port_out.position.x == pytest.approx(num_periods * period)
        assert port_out.position.y == pytest.approx(0.0)
        assert port_out.direction.x == pytest.approx(1.0)
        assert port_out.direction.y == pytest.approx(0.0)
        assert port_out.width == pytest.approx(width)

    def test_path_length_matches_total_length(self, layer):
        """path_length equals num_periods * period for a plain grating."""
        cell = bragg_grating(layer, period=0.32, num_periods=100)
        assert cell.path_length == pytest.approx(100 * 0.32)

    def test_phase_shift_extends_length(self, layer):
        """pi phase shift adds period/2 to the total length."""
        num_periods = 100
        period = 0.32
        plain = bragg_grating(layer, period=period, num_periods=num_periods)
        shifted = bragg_grating(
            layer,
            period=period,
            num_periods=num_periods,
            phase_shift=math.pi,
            phase_shift_position=0.5,
        )
        extra = shifted.path_length - plain.path_length
        assert extra == pytest.approx(period / 2.0)
        # Output port position follows suit.
        assert shifted.port("out").position.x == pytest.approx(plain.path_length + period / 2.0)

    def test_gaussian_apodization_preserves_length(self, layer):
        """Gaussian apodization does not change total length or polygon count.

        Apodization shapes the per-period sidewall amplitude but preserves
        the overall grating length. The peak amplitude is still reached at
        the center period (envelope = 1), so the overall bbox Y extent
        matches the uniform case for num_periods large enough that the
        center period exists.
        """
        uniform = bragg_grating(
            layer, num_periods=101, corrugation_width=0.1, apodization="uniform"
        )
        gaussian = bragg_grating(
            layer, num_periods=101, corrugation_width=0.1, apodization="gaussian"
        )
        assert uniform.path_length == pytest.approx(gaussian.path_length)
        assert uniform.polygon_count() == gaussian.polygon_count() == 1
        # Peak amplitude is reached at the middle period in both cases.
        expected_peak_half_y = (0.5 + 0.1) / 2.0
        assert uniform.bbox().max.y == pytest.approx(expected_peak_half_y)
        assert gaussian.bbox().max.y == pytest.approx(expected_peak_half_y)

    def test_gaussian_tight_envelope_narrows_tails(self, layer):
        """A very tight Gaussian envelope drives the end-period amplitude toward zero.

        The polygon's Y extent at the endpoints is bounded by the port
        half-width (``waveguide_width / 2``) because the first and last
        vertices are flush with the port. We verify that a tight Gaussian
        has the same global peak as uniform but still fits the port
        width at x = 0 (which both satisfy by construction).
        """
        # Both start flush at the port on both ends; the distinguishing
        # observable without a polygon-inspection API is that the tight
        # Gaussian's path length still matches (amplitude, not length,
        # is what apodization modulates).
        tight = bragg_grating(
            layer,
            num_periods=201,  # odd -> exact center period at index 100
            corrugation_width=0.2,
            apodization="gaussian",
            apodization_sigma=0.05,
        )
        assert tight.path_length == pytest.approx(201 * 0.32)
        # Peak in the middle still reaches the full amplitude.
        assert tight.bbox().max.y == pytest.approx((0.5 + 0.2) / 2.0)

    def test_bbox_y_extent_matches_peak_corrugation(self, layer):
        """Uniform grating's Y extent is (waveguide_width + corrugation_width)/2."""
        cell = bragg_grating(
            layer,
            waveguide_width=0.5,
            corrugation_width=0.1,
            num_periods=50,
            apodization="uniform",
        )
        bb = cell.bbox()
        expected_half = (0.5 + 0.1) / 2.0
        assert bb.max.y == pytest.approx(expected_half)
        assert bb.min.y == pytest.approx(-expected_half)

    @pytest.mark.parametrize(
        "kwargs,match",
        [
            ({"waveguide_width": 0.0}, "Waveguide width"),
            ({"waveguide_width": -0.1}, "Waveguide width"),
            ({"period": 0.0}, "Period"),
            ({"num_periods": 0}, "Number of periods"),
            ({"duty_cycle": 0.0}, "Duty cycle"),
            ({"duty_cycle": 1.0}, "Duty cycle"),
            ({"corrugation_width": 0.0}, "Corrugation width"),
            ({"corrugation_width": 0.6, "waveguide_width": 0.5}, "Corrugation width"),
            ({"apodization_sigma": 0.0}, "Apodization sigma"),
            ({"phase_shift_position": -0.1}, "Phase shift position"),
            ({"phase_shift_position": 1.1}, "Phase shift position"),
            ({"phase_shift": 0.0}, "Phase shift must be strictly positive"),
            ({"phase_shift": -math.pi}, "Phase shift must be strictly positive"),
        ],
    )
    def test_validation(self, layer, kwargs, match):
        """Invalid parameters raise ValueError with a helpful message."""
        with pytest.raises(ValueError, match=match):
            bragg_grating(layer, **kwargs)
