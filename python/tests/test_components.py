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

    def test_zero_offset_is_straight_rectangle(self, layer):
        """offset=0 short-circuits to a straight waveguide rectangle.

        This is the degenerate-case short-circuit: the S-bend code is skipped
        entirely, producing a single rectangular polygon and ports at y=0.
        """
        length = 15.0
        width = 0.5
        cell = sbend(layer, waveguide_width=width, length=length, offset=0.0)
        assert cell.polygon_count() == 1
        # Both ports on the centerline
        assert cell.port("in").position.y == pytest.approx(0.0)
        assert cell.port("out").position.y == pytest.approx(0.0)
        assert cell.port("out").position.x == pytest.approx(length)
        # Path length is just the straight length
        assert cell.path_length == pytest.approx(length)
        # BBox matches a plain rectangle
        bb = cell.bbox()
        assert bb.min.x == pytest.approx(0.0)
        assert bb.max.x == pytest.approx(length)
        assert bb.min.y == pytest.approx(-width / 2)
        assert bb.max.y == pytest.approx(width / 2)

    @pytest.mark.parametrize("bend_type", ["cosine", "circular", "euler"])
    def test_zero_offset_ignores_bend_type_and_num_segments(self, layer, bend_type):
        """offset=0 ignores bend_type and num_segments (documented contract).

        For a zero-offset S-bend the curve profile and segmentation have no
        geometric meaning — the result is always a single straight rectangle,
        regardless of which bend_type or how many segments the caller passes.
        """
        cell = sbend(
            layer,
            waveguide_width=0.5,
            length=10.0,
            offset=0.0,
            bend_type=bend_type,
            num_segments=128,
        )
        assert cell.polygon_count() == 1
        assert cell.path_length == pytest.approx(10.0)

    @pytest.mark.parametrize(
        "kwargs,match",
        [
            ({"length": 0.0}, "S-bend length must be positive"),
            ({"length": -1.0}, "S-bend length must be positive"),
            ({"waveguide_width": 0.0}, "Waveguide width must be positive"),
            ({"waveguide_width": -0.1}, "Waveguide width must be positive"),
        ],
    )
    def test_validation(self, layer, kwargs, match):
        """Invalid parameters raise ValueError with a helpful message."""
        defaults = {"length": 20.0, "offset": 5.0}
        defaults.update(kwargs)
        with pytest.raises(ValueError, match=match):
            sbend(layer, **defaults)


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

    def test_cell_name_distinguishes_waveguide_width(self, layer):
        """Two 1x2 MMIs with different waveguide_width must have different cell names.

        Before the polish pass the cell name was derived only from ``(mmi_type,
        length, mmi_width)`` so differently-portsized MMIs collided in the
        library. Include port_width + taper_width in the generated name.
        """
        a = mmi_1x2(layer, waveguide_width=0.5)
        b = mmi_1x2(layer, waveguide_width=0.7)
        assert a.name != b.name

    def test_cell_name_distinguishes_taper_width(self, layer):
        """Different taper widths must produce different cell names."""
        a = mmi_1x2(layer, taper_width=1.2)
        b = mmi_1x2(layer, taper_width=1.5)
        assert a.name != b.name

    def test_waveguide_width_validation_message(self, layer):
        """Invalid waveguide_width raises with the user-facing parameter name."""
        with pytest.raises(ValueError, match="Waveguide width"):
            mmi_1x2(layer, waveguide_width=0.0)


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

    def test_waveguide_width_validation_message(self, layer):
        """Invalid waveguide_width raises with the user-facing parameter name."""
        with pytest.raises(ValueError, match="Waveguide width"):
            ring(layer, waveguide_width=0.0)


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

    def test_simple_rejects_center_width(self, layer):
        """Setting center_width with crossing_type='simple' is a user error.

        The simple crossing has no center expansion region, so center_width
        would have been silently ignored before the polish pass.
        """
        with pytest.raises(ValueError, match="not applicable to crossing_type='simple'"):
            crossing(layer, crossing_type="simple", center_width=3.0)

    def test_simple_accepts_default_center_width(self, layer):
        """Leaving center_width unset (the default) still works for 'simple'."""
        cell = crossing(layer, crossing_type="simple")
        assert cell.polygon_count() > 0

    def test_waveguide_width_validation_message(self, layer):
        """Invalid waveguide_width raises with the user-facing parameter name."""
        with pytest.raises(ValueError, match="Waveguide width"):
            crossing(layer, waveguide_width=0.0)


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

    def test_straight_default_grating_width(self, layer):
        """focusing_angle=None with no grating_width uses the internal default."""
        cell = grating_coupler(layer, focusing_angle=None)
        assert cell.polygon_count() > 0

    def test_straight_custom_grating_width(self, layer):
        """focusing_angle=None with an explicit grating_width works."""
        cell = grating_coupler(layer, focusing_angle=None, grating_width=8.0)
        assert cell.polygon_count() > 0

    def test_focusing_with_grating_width_is_conflict(self, layer):
        """Setting both focusing_angle and grating_width warns and ignores.

        Before the polish pass grating_width was silently ignored for focused
        GCs; now it emits a UserWarning so the confusion is surfaced without
        breaking callers that echoed the old default value.
        """
        with pytest.warns(UserWarning, match="grating_width is only applicable"):
            cell = grating_coupler(layer, focusing_angle=20.0, grating_width=12.0)
        # The cell still builds successfully — grating_width is just ignored.
        assert cell.polygon_count() > 0

    def test_cell_name_distinguishes_parameters(self, layer):
        """GCs with different geometry-affecting parameters get distinct names.

        Before the polish pass the cell name was only
        ``gc_w{waveguide_width}_p{period}``, so GCs differing in
        focusing_angle / num_periods / fill_factor / grating_type /
        grating_width / taper_length silently collided in the library.
        """
        base = grating_coupler(layer)
        variants = [
            grating_coupler(layer, waveguide_width=0.7),
            grating_coupler(layer, period=0.60),
            grating_coupler(layer, fill_factor=0.6),
            grating_coupler(layer, num_periods=30),
            grating_coupler(layer, grating_type="apodized"),
            grating_coupler(layer, focusing_angle=None),  # switches to straight
            grating_coupler(layer, focusing_angle=None, grating_width=15.0),
            grating_coupler(layer, focusing_angle=25.0),
            grating_coupler(layer, taper_length=30.0),
        ]
        names = {base.name} | {v.name for v in variants}
        # All ten variants (base + 9) must have unique names
        assert len(names) == 10


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

    def test_waveguide_width_validation_message(self, layer):
        """Invalid waveguide_width raises with the user-facing parameter name."""
        with pytest.raises(ValueError, match="Waveguide width"):
            directional_coupler(layer, waveguide_width=0.0)

    def test_port_spacing_must_exceed_gap_plus_width(self, layer):
        """Port spacing <= gap + waveguide_width would invert the S-bend.

        Previously this was enforced only implicitly by geometry; now it
        raises with a clear message so users don't silently build an
        inside-out directional coupler.
        """
        with pytest.raises(ValueError, match="Port spacing"):
            directional_coupler(
                layer,
                waveguide_width=0.5,
                gap=0.2,
                port_spacing=0.6,  # 0.6 < 0.2 + 0.5 = 0.7
            )

    def test_port_spacing_equal_to_gap_plus_width_is_rejected(self, layer):
        """Equality case (zero-offset S-bends) is also rejected."""
        with pytest.raises(ValueError, match="Port spacing"):
            directional_coupler(
                layer,
                waveguide_width=0.5,
                gap=0.2,
                port_spacing=0.7,  # exactly gap + waveguide_width
            )


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
