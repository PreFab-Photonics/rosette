"""Tests for Python photonic components.

Components are now Python functions in rosette.components that return Cells.
These tests verify the component functions generate valid cells with ports.
"""

import math

import pytest

from rosette import Cell, Layer, Route, write_gds
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

    # ------------------------------------------------------------------
    # Port positions / directions / widths (doc-string contract)
    # ------------------------------------------------------------------

    @pytest.mark.parametrize("bend_type", ["cosine", "circular", "euler"])
    def test_port_positions_directions_widths(self, layer, bend_type):
        """Ports sit at ``(0, 0)`` / ``(length, offset)`` facing -X/+X.

        Pinned per the ``sbend`` docstring "Ports" section for every
        bend_type.
        """
        length = 25.0
        offset = 7.0
        width = 0.6
        cell = sbend(
            layer,
            waveguide_width=width,
            length=length,
            offset=offset,
            bend_type=bend_type,
        )
        port_in = cell.port("in")
        port_out = cell.port("out")

        assert port_in.position.x == pytest.approx(0.0)
        assert port_in.position.y == pytest.approx(0.0)
        assert port_in.direction.x == pytest.approx(-1.0)
        assert port_in.direction.y == pytest.approx(0.0)
        assert port_in.width == pytest.approx(width)

        assert port_out.position.x == pytest.approx(length)
        assert port_out.position.y == pytest.approx(offset)
        assert port_out.direction.x == pytest.approx(1.0)
        assert port_out.direction.y == pytest.approx(0.0)
        assert port_out.width == pytest.approx(width)

    # ------------------------------------------------------------------
    # path_length and bbox (sanity — exact integration is covered in
    # test_curves.py).
    # ------------------------------------------------------------------

    @pytest.mark.parametrize("bend_type", ["cosine", "circular", "euler"])
    def test_path_length_at_least_horizontal_length(self, layer, bend_type):
        """Arc length is always >= horizontal span; a nonzero offset makes it
        strictly greater.
        """
        cell = sbend(layer, length=20.0, offset=5.0, bend_type=bend_type)
        assert cell.path_length > 20.0  # curved -> strictly longer
        cell_straight = sbend(layer, length=20.0, offset=0.0)
        assert cell_straight.path_length == pytest.approx(20.0)

    def test_bbox_extents_small_fixed_case(self, layer):
        """BBox hugs the input/output ports for a small fixed parameter set."""
        length = 20.0
        offset = 5.0
        width = 0.5
        cell = sbend(layer, waveguide_width=width, length=length, offset=offset, bend_type="cosine")
        bb = cell.bbox()
        half = width / 2.0
        # X extent is exactly [0, length] — no horizontal overshoot.
        assert bb.min.x == pytest.approx(0.0, abs=1e-9)
        assert bb.max.x == pytest.approx(length, abs=1e-9)
        # Y extent encloses the 0..offset range plus the half-width at each
        # port (centerline goes from 0 to offset, sidewalls add half-width
        # on each side).
        assert bb.min.y == pytest.approx(-half, abs=1e-6)
        assert bb.max.y == pytest.approx(offset + half, abs=1e-6)


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

    # ------------------------------------------------------------------
    # Port positions / directions / widths — one parameter-set per variant.
    # Pinned to the docstring "Ports" contract.
    # ------------------------------------------------------------------

    def test_1x2_port_positions_directions_widths(self, layer):
        """mmi_1x2 ports match docstring: in @(0,0), out1/2 @(tl, ±sep/2)."""
        length = 10.0
        taper_length = 5.0
        waveguide_width = 0.5
        port_separation = 2.0
        total_length = length + 2 * taper_length

        cell = mmi_1x2(
            layer,
            waveguide_width=waveguide_width,
            length=length,
            taper_length=taper_length,
            port_separation=port_separation,
        )

        p_in = cell.port("in")
        assert p_in.position.x == pytest.approx(0.0)
        assert p_in.position.y == pytest.approx(0.0)
        assert p_in.direction.x == pytest.approx(-1.0)
        assert p_in.direction.y == pytest.approx(0.0)
        assert p_in.width == pytest.approx(waveguide_width)

        # "1" = lower (y < 0), "2" = upper (y > 0).
        p_out1 = cell.port("out1")
        assert p_out1.position.x == pytest.approx(total_length)
        assert p_out1.position.y == pytest.approx(-port_separation / 2)
        assert p_out1.direction.x == pytest.approx(1.0)
        assert p_out1.direction.y == pytest.approx(0.0)
        assert p_out1.width == pytest.approx(waveguide_width)

        p_out2 = cell.port("out2")
        assert p_out2.position.x == pytest.approx(total_length)
        assert p_out2.position.y == pytest.approx(+port_separation / 2)
        assert p_out2.direction.x == pytest.approx(1.0)
        assert p_out2.width == pytest.approx(waveguide_width)

    def test_2x1_port_positions_directions_widths(self, layer):
        """mmi_2x1: in1/2 @(0, ±sep/2) facing -X, out @(tl, 0) facing +X."""
        waveguide_width = 0.5
        port_separation = 2.0
        total_length = 10.0 + 2 * 5.0  # defaults

        cell = mmi_2x1(layer, waveguide_width=waveguide_width, port_separation=port_separation)
        p_in1 = cell.port("in1")
        p_in2 = cell.port("in2")
        p_out = cell.port("out")

        assert p_in1.position.x == pytest.approx(0.0)
        assert p_in1.position.y == pytest.approx(-port_separation / 2)
        assert p_in1.direction.x == pytest.approx(-1.0)
        assert p_in1.width == pytest.approx(waveguide_width)

        assert p_in2.position.x == pytest.approx(0.0)
        assert p_in2.position.y == pytest.approx(+port_separation / 2)
        assert p_in2.direction.x == pytest.approx(-1.0)
        assert p_in2.width == pytest.approx(waveguide_width)

        assert p_out.position.x == pytest.approx(total_length)
        assert p_out.position.y == pytest.approx(0.0)
        assert p_out.direction.x == pytest.approx(1.0)
        assert p_out.width == pytest.approx(waveguide_width)

    def test_2x2_port_positions_directions_widths(self, layer):
        """mmi_2x2: all four ports at ±sep/2 on left/right faces."""
        waveguide_width = 0.5
        port_separation = 2.0
        length = 15.0
        taper_length = 5.0
        total_length = length + 2 * taper_length

        cell = mmi_2x2(
            layer,
            waveguide_width=waveguide_width,
            length=length,
            taper_length=taper_length,
            port_separation=port_separation,
        )
        py = port_separation / 2
        expected = {
            "in1": (0.0, -py, -1.0),
            "in2": (0.0, +py, -1.0),
            "out1": (total_length, -py, 1.0),
            "out2": (total_length, +py, 1.0),
        }
        for name, (px, pyv, dx) in expected.items():
            p = cell.port(name)
            assert p.position.x == pytest.approx(px), f"{name} x"
            assert p.position.y == pytest.approx(pyv), f"{name} y"
            assert p.direction.x == pytest.approx(dx), f"{name} dx"
            assert p.direction.y == pytest.approx(0.0), f"{name} dy"
            assert p.width == pytest.approx(waveguide_width), f"{name} width"

    # ------------------------------------------------------------------
    # path_length contract: total_length = length + 2 * taper_length
    # ------------------------------------------------------------------

    @pytest.mark.parametrize(
        "factory,length,taper_length",
        [
            (mmi_1x2, 10.0, 5.0),
            (mmi_2x1, 10.0, 5.0),
            (mmi_2x2, 15.0, 5.0),
            (mmi_2x2, 20.0, 2.0),
            (mmi_1x2, 5.0, 0.0),  # taper_length >= 0 is allowed
        ],
    )
    def test_path_length_is_total_length(self, layer, factory, length, taper_length):
        """path_length == length + 2*taper_length for all MMI variants."""
        cell = factory(layer, length=length, taper_length=taper_length)
        assert cell.path_length == pytest.approx(length + 2 * taper_length)

    # ------------------------------------------------------------------
    # BBox extents: the MMI body dominates Y; total_length sets X.
    # ------------------------------------------------------------------

    def test_bbox_extents_small_fixed_case(self, layer):
        """BBox: X from 0..total_length; |Y| from half mmi_width."""
        length = 10.0
        taper_length = 5.0
        mmi_width = 6.0
        cell = mmi_2x2(layer, length=length, taper_length=taper_length, mmi_width=mmi_width)
        bb = cell.bbox()
        total_length = length + 2 * taper_length
        assert bb.min.x == pytest.approx(0.0)
        assert bb.max.x == pytest.approx(total_length)
        # MMI body sets |y| = mmi_width/2 (tapers are narrower).
        assert bb.max.y == pytest.approx(mmi_width / 2)
        assert bb.min.y == pytest.approx(-mmi_width / 2)

    # ------------------------------------------------------------------
    # Parametrized ValueError branches (all 6 in _create_mmi).
    # ------------------------------------------------------------------

    @pytest.mark.parametrize(
        "kwargs,match",
        [
            ({"length": 0.0}, "MMI length"),
            ({"length": -1.0}, "MMI length"),
            ({"mmi_width": 0.0}, "MMI width"),
            ({"mmi_width": -1.0}, "MMI width"),
            ({"waveguide_width": 0.0}, "Waveguide width"),
            ({"waveguide_width": -0.1}, "Waveguide width"),
            ({"taper_width": 0.0}, "Taper width"),
            ({"taper_width": -0.1}, "Taper width"),
            ({"taper_length": -0.1}, "Taper length"),
            ({"port_separation": 0.0}, "Port separation"),
            ({"port_separation": -1.0}, "Port separation"),
        ],
    )
    @pytest.mark.parametrize("factory", [mmi_1x2, mmi_2x1, mmi_2x2])
    def test_validation(self, layer, factory, kwargs, match):
        """All six ``_create_mmi`` ValueError branches fire for each variant."""
        with pytest.raises(ValueError, match=match):
            factory(layer, **kwargs)


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

    # ------------------------------------------------------------------
    # Port positions / directions / widths (per docstring)
    # ------------------------------------------------------------------

    def test_allpass_ports(self, layer):
        """Allpass: in @(0,0) -X, out @(bus_length, 0) +X, both waveguide_width."""
        radius = 10.0
        waveguide_width = 0.5
        gap = 0.2
        bus_extension = 5.0
        coupling_length = 0.0
        bus_length = 2 * bus_extension + coupling_length

        cell = ring(
            layer,
            waveguide_width=waveguide_width,
            radius=radius,
            gap=gap,
            coupling="allpass",
            coupling_length=coupling_length,
            bus_extension=bus_extension,
        )
        p_in = cell.port("in")
        p_out = cell.port("out")

        assert p_in.position.x == pytest.approx(0.0)
        assert p_in.position.y == pytest.approx(0.0)
        assert p_in.direction.x == pytest.approx(-1.0)
        assert p_in.width == pytest.approx(waveguide_width)

        assert p_out.position.x == pytest.approx(bus_length)
        assert p_out.position.y == pytest.approx(0.0)
        assert p_out.direction.x == pytest.approx(+1.0)
        assert p_out.width == pytest.approx(waveguide_width)

    def test_adddrop_ports(self, layer):
        """Adddrop: in/through at +bus_y, drop/add at -bus_y.

        ``bus_y = radius + waveguide_width + gap`` per the docstring.
        """
        radius = 10.0
        waveguide_width = 0.5
        gap = 0.2
        bus_extension = 4.0
        coupling_length = 3.0
        bus_length = 2 * bus_extension + coupling_length
        bus_y = radius + waveguide_width + gap

        cell = ring(
            layer,
            waveguide_width=waveguide_width,
            radius=radius,
            gap=gap,
            coupling="adddrop",
            coupling_length=coupling_length,
            bus_extension=bus_extension,
        )

        expected = {
            # name: (x, y, dx)
            "in": (0.0, +bus_y, -1.0),
            "through": (bus_length, +bus_y, +1.0),
            "drop": (0.0, -bus_y, -1.0),
            "add": (bus_length, -bus_y, +1.0),
        }
        for name, (px, py, dx) in expected.items():
            p = cell.port(name)
            assert p.position.x == pytest.approx(px), f"{name} x"
            assert p.position.y == pytest.approx(py), f"{name} y"
            assert p.direction.x == pytest.approx(dx), f"{name} dx"
            assert p.direction.y == pytest.approx(0.0), f"{name} dy"
            assert p.width == pytest.approx(waveguide_width), f"{name} width"

    # ------------------------------------------------------------------
    # path_length: 2*pi*radius + 2*coupling_length
    # ------------------------------------------------------------------

    @pytest.mark.parametrize("coupling_length", [0.0, 5.0, 12.5])
    @pytest.mark.parametrize("coupling", ["allpass", "adddrop"])
    def test_path_length_is_circumference(self, layer, coupling, coupling_length):
        """path_length == 2*pi*radius + 2*coupling_length (racetrack circumf)."""
        radius = 7.5
        cell = ring(
            layer,
            radius=radius,
            coupling=coupling,
            coupling_length=coupling_length,
        )
        assert cell.path_length == pytest.approx(2 * math.pi * radius + 2 * coupling_length)

    # ------------------------------------------------------------------
    # BBox sanity
    # ------------------------------------------------------------------

    def test_allpass_bbox_extents(self, layer):
        """Allpass: Y from -w/2 (bus bottom) up to ring top; X spans bus."""
        radius = 10.0
        waveguide_width = 0.5
        gap = 0.2
        bus_extension = 5.0
        cell = ring(
            layer,
            waveguide_width=waveguide_width,
            radius=radius,
            gap=gap,
            coupling="allpass",
            bus_extension=bus_extension,
        )
        bb = cell.bbox()
        # Bus bottom is at -width/2.
        assert bb.min.y == pytest.approx(-waveguide_width / 2)
        # Ring top is at ring_center_y + radius + width/2.
        ring_center_y = radius + waveguide_width + gap
        assert bb.max.y == pytest.approx(ring_center_y + radius + waveguide_width / 2, rel=1e-3)
        # X must at least cover the bus 0..bus_length.
        bus_length = 2 * bus_extension
        assert bb.min.x <= 0.0 + 1e-9
        assert bb.max.x >= bus_length - 1e-9

    def test_adddrop_bbox_symmetric_in_y(self, layer):
        """Adddrop: ring centered at y=0, so |min.y| == |max.y|."""
        cell = ring(layer, radius=10.0, coupling="adddrop")
        bb = cell.bbox()
        assert bb.min.y == pytest.approx(-bb.max.y)

    # ------------------------------------------------------------------
    # Parametrized validation — every ValueError branch in ``ring``.
    # ------------------------------------------------------------------

    @pytest.mark.parametrize(
        "kwargs,match",
        [
            ({"radius": 0.0}, "Ring radius"),
            ({"radius": -1.0}, "Ring radius"),
            ({"waveguide_width": 0.0}, "Waveguide width"),
            ({"waveguide_width": -0.1}, "Waveguide width"),
            # Radius <= waveguide_width / 2
            ({"radius": 0.1, "waveguide_width": 0.5}, "Radius must be greater"),
            ({"radius": 0.25, "waveguide_width": 0.5}, "Radius must be greater"),
            ({"gap": 0.0}, "Gap"),
            ({"gap": -0.1}, "Gap"),
            ({"coupling_length": -0.5}, "Coupling length"),
            ({"num_segments": 2}, "Number of segments"),
            ({"num_segments": 0}, "Number of segments"),
        ],
    )
    def test_validation(self, layer, kwargs, match):
        """All ``ring`` ValueError branches fire with a helpful message."""
        with pytest.raises(ValueError, match=match):
            ring(layer, **kwargs)


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

    # ------------------------------------------------------------------
    # Port positions / directions / widths for every crossing_type.
    # ------------------------------------------------------------------

    @pytest.mark.parametrize("crossing_type", ["simple", "elliptical", "mmi"])
    def test_port_positions_directions_widths(self, layer, crossing_type):
        """Four ports on cardinal directions at ``±arm_length``, facing outward."""
        arm_length = 5.0
        waveguide_width = 0.5
        cell = crossing(
            layer,
            waveguide_width=waveguide_width,
            arm_length=arm_length,
            crossing_type=crossing_type,
        )
        expected = {
            # name: (x, y, dx, dy)
            "in1": (-arm_length, 0.0, -1.0, 0.0),
            "out1": (+arm_length, 0.0, +1.0, 0.0),
            "in2": (0.0, -arm_length, 0.0, -1.0),
            "out2": (0.0, +arm_length, 0.0, +1.0),
        }
        for name, (px, py, dx, dy) in expected.items():
            p = cell.port(name)
            assert p.position.x == pytest.approx(px), f"{name} x"
            assert p.position.y == pytest.approx(py), f"{name} y"
            assert p.direction.x == pytest.approx(dx), f"{name} dx"
            assert p.direction.y == pytest.approx(dy), f"{name} dy"
            assert p.width == pytest.approx(waveguide_width), f"{name} width"

    # ------------------------------------------------------------------
    # path_length = 2 * arm_length
    # ------------------------------------------------------------------

    @pytest.mark.parametrize("crossing_type", ["simple", "elliptical", "mmi"])
    @pytest.mark.parametrize("arm_length", [5.0, 8.0, 12.5])
    def test_path_length_is_twice_arm_length(self, layer, crossing_type, arm_length):
        """Horizontal path length (``in1`` → ``out1``) is ``2 * arm_length``."""
        cell = crossing(layer, arm_length=arm_length, crossing_type=crossing_type)
        assert cell.path_length == pytest.approx(2 * arm_length)

    # ------------------------------------------------------------------
    # BBox: centered at origin, symmetric in both X and Y.
    # ------------------------------------------------------------------

    @pytest.mark.parametrize("crossing_type", ["simple", "elliptical", "mmi"])
    def test_bbox_is_symmetric_and_matches_arm_length(self, layer, crossing_type):
        arm_length = 5.0
        cell = crossing(layer, arm_length=arm_length, crossing_type=crossing_type)
        bb = cell.bbox()
        assert bb.min.x == pytest.approx(-arm_length)
        assert bb.max.x == pytest.approx(+arm_length)
        assert bb.min.y == pytest.approx(-arm_length)
        assert bb.max.y == pytest.approx(+arm_length)

    # ------------------------------------------------------------------
    # Parametrized validation — every ValueError branch in ``crossing``.
    # ------------------------------------------------------------------

    @pytest.mark.parametrize(
        "kwargs,match",
        [
            ({"waveguide_width": 0.0}, "Waveguide width"),
            ({"waveguide_width": -0.1}, "Waveguide width"),
            ({"arm_length": 0.0}, "Arm length must be positive"),
            ({"arm_length": -1.0}, "Arm length must be positive"),
            ({"crossing_type": "bogus"}, "Unknown crossing type"),
            ({"center_width": 0.0, "crossing_type": "elliptical"}, "Center width"),
            ({"center_width": -1.0, "crossing_type": "elliptical"}, "Center width"),
            # arm_length <= center_width / 2 (non-simple only)
            (
                {"crossing_type": "elliptical", "arm_length": 1.0, "center_width": 3.0},
                "Arm length must be greater than half",
            ),
            (
                {"crossing_type": "mmi", "arm_length": 1.0, "center_width": 3.0},
                "Arm length must be greater than half",
            ),
            # simple + explicit center_width => rejected
            (
                {"crossing_type": "simple", "center_width": 2.0},
                "not applicable to crossing_type='simple'",
            ),
        ],
    )
    def test_validation(self, layer, kwargs, match):
        """All ``crossing`` ValueError branches fire with helpful messages."""
        with pytest.raises(ValueError, match=match):
            crossing(layer, **kwargs)


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

    # ------------------------------------------------------------------
    # Port position / direction / width.
    # ------------------------------------------------------------------

    @pytest.mark.parametrize(
        "kwargs",
        [
            {},  # default: focused
            {"focusing_angle": None},  # straight
            {"focusing_angle": None, "grating_width": 10.0},
            {"focusing_angle": 30.0},
            {"grating_type": "apodized"},
        ],
    )
    def test_opt_port_contract(self, layer, kwargs):
        """``"opt"`` is always at ``(0, 0)`` facing +X with waveguide_width."""
        waveguide_width = 0.5
        cell = grating_coupler(layer, waveguide_width=waveguide_width, **kwargs)
        p = cell.port("opt")
        assert p.position.x == pytest.approx(0.0)
        assert p.position.y == pytest.approx(0.0)
        assert p.direction.x == pytest.approx(+1.0)
        assert p.direction.y == pytest.approx(0.0)
        assert p.width == pytest.approx(waveguide_width)

    # ------------------------------------------------------------------
    # path_length == taper_length (documented).
    # ------------------------------------------------------------------

    @pytest.mark.parametrize("taper_length", [10.0, 20.0, 35.0])
    def test_path_length_is_taper_length(self, layer, taper_length):
        cell = grating_coupler(layer, taper_length=taper_length)
        assert cell.path_length == pytest.approx(taper_length)

    # ------------------------------------------------------------------
    # BBox sanity: the body lies entirely in -X, taper right edge at x=0.
    # ------------------------------------------------------------------

    def test_bbox_straight_extents(self, layer):
        """Straight GC: x spans [-(taper + n*period), 0], y=±grating_width/2."""
        waveguide_width = 0.5
        period = 0.63
        num_periods = 25
        taper_length = 20.0
        grating_width = 12.0
        cell = grating_coupler(
            layer,
            waveguide_width=waveguide_width,
            period=period,
            num_periods=num_periods,
            focusing_angle=None,
            grating_width=grating_width,
            taper_length=taper_length,
        )
        bb = cell.bbox()
        expected_x_min = -(taper_length + num_periods * period)
        assert bb.min.x == pytest.approx(expected_x_min)
        assert bb.max.x == pytest.approx(0.0)
        assert bb.min.y == pytest.approx(-grating_width / 2)
        assert bb.max.y == pytest.approx(+grating_width / 2)

    def test_bbox_focused_body_extends_in_minus_x(self, layer):
        """Focused GC body is entirely in -X; taper right edge at x=0."""
        cell = grating_coupler(layer, taper_length=20.0, focusing_angle=20.0)
        bb = cell.bbox()
        assert bb.max.x == pytest.approx(0.0)
        assert bb.min.x < 0.0
        # Symmetric in y.
        assert bb.min.y == pytest.approx(-bb.max.y)

    # ------------------------------------------------------------------
    # Parametrized validation — every ValueError branch.
    # ------------------------------------------------------------------

    @pytest.mark.parametrize(
        "kwargs,match",
        [
            ({"waveguide_width": 0.0}, "Waveguide width"),
            ({"waveguide_width": -0.1}, "Waveguide width"),
            ({"period": 0.0}, "Period"),
            ({"period": -0.5}, "Period"),
            ({"fill_factor": 0.0}, "Fill factor"),
            ({"fill_factor": 1.0}, "Fill factor"),
            ({"fill_factor": -0.1}, "Fill factor"),
            ({"fill_factor": 1.5}, "Fill factor"),
            ({"taper_length": 0.0}, "Taper length"),
            ({"taper_length": -1.0}, "Taper length"),
            # grating_width <= 0 only reachable when focusing_angle is None
            (
                {"focusing_angle": None, "grating_width": 0.0},
                "Grating width",
            ),
            (
                {"focusing_angle": None, "grating_width": -1.0},
                "Grating width",
            ),
            ({"num_periods": 0}, "Number of periods"),
            ({"num_periods": -1}, "Number of periods"),
        ],
    )
    def test_validation(self, layer, kwargs, match):
        """All ``grating_coupler`` ValueError branches fire."""
        with pytest.raises(ValueError, match=match):
            grating_coupler(layer, **kwargs)


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

    # ------------------------------------------------------------------
    # Port positions / directions / widths (per docstring).
    # ------------------------------------------------------------------

    def test_port_positions_directions_widths(self, layer):
        """Four ports at ``(0 or tl, ±port_spacing/2)``, facing -X/+X."""
        waveguide_width = 0.5
        coupling_length = 20.0
        bend_length = 10.0
        port_spacing = 5.0
        total_length = 2 * bend_length + coupling_length
        py = port_spacing / 2

        cell = directional_coupler(
            layer,
            waveguide_width=waveguide_width,
            coupling_length=coupling_length,
            bend_length=bend_length,
            port_spacing=port_spacing,
        )

        expected = {
            "in1": (0.0, +py, -1.0),
            "in2": (0.0, -py, -1.0),
            "out1": (total_length, +py, +1.0),
            "out2": (total_length, -py, +1.0),
        }
        for name, (px, pyv, dx) in expected.items():
            p = cell.port(name)
            assert p.position.x == pytest.approx(px), f"{name} x"
            assert p.position.y == pytest.approx(pyv), f"{name} y"
            assert p.direction.x == pytest.approx(dx), f"{name} dx"
            assert p.direction.y == pytest.approx(0.0), f"{name} dy"
            assert p.width == pytest.approx(waveguide_width), f"{name} width"

    # ------------------------------------------------------------------
    # path_length == 2 * cosine_sbend_arc + coupling_length.
    # ------------------------------------------------------------------

    def test_path_length_matches_arc_plus_coupling(self, layer):
        """``2 * cosine_arc(bend_length, sbend_offset) + coupling_length``.

        Where ``sbend_offset = |port_spacing/2 - (gap + waveguide_width)/2|``.
        """
        from rosette.components._curves import estimate_sbend_path_length

        waveguide_width = 0.5
        coupling_length = 20.0
        bend_length = 10.0
        port_spacing = 5.0
        gap = 0.2
        cell = directional_coupler(
            layer,
            waveguide_width=waveguide_width,
            coupling_length=coupling_length,
            gap=gap,
            bend_length=bend_length,
            port_spacing=port_spacing,
        )
        sbend_offset = abs(port_spacing / 2 - (gap + waveguide_width) / 2)
        expected_arc = estimate_sbend_path_length(bend_length, sbend_offset, "cosine")
        assert cell.path_length == pytest.approx(2 * expected_arc + coupling_length)

    # ------------------------------------------------------------------
    # BBox: total_length in X, |port_spacing/2| + half-width in Y.
    # ------------------------------------------------------------------

    def test_bbox_extents_small_fixed_case(self, layer):
        waveguide_width = 0.5
        coupling_length = 20.0
        bend_length = 10.0
        port_spacing = 5.0
        cell = directional_coupler(
            layer,
            waveguide_width=waveguide_width,
            coupling_length=coupling_length,
            bend_length=bend_length,
            port_spacing=port_spacing,
        )
        bb = cell.bbox()
        total_length = 2 * bend_length + coupling_length
        # X extent is exactly [0, total_length].
        assert bb.min.x == pytest.approx(0.0)
        assert bb.max.x == pytest.approx(total_length)
        # Y extent encloses the port half-spacing plus half-width.
        expected_half_y = port_spacing / 2 + waveguide_width / 2
        assert bb.max.y == pytest.approx(expected_half_y, rel=1e-3)
        assert bb.min.y == pytest.approx(-expected_half_y, rel=1e-3)

    # ------------------------------------------------------------------
    # Parametrized validation — all ValueError branches.
    # ------------------------------------------------------------------

    @pytest.mark.parametrize(
        "kwargs,match",
        [
            ({"coupling_length": 0.0}, "Coupling length"),
            ({"coupling_length": -1.0}, "Coupling length"),
            ({"gap": 0.0}, "Gap"),
            ({"gap": -0.1}, "Gap"),
            ({"waveguide_width": 0.0}, "Waveguide width"),
            ({"waveguide_width": -0.1}, "Waveguide width"),
            ({"bend_length": 0.0}, "Bend length"),
            ({"bend_length": -1.0}, "Bend length"),
            ({"num_segments": 0}, "Number of segments"),
            ({"num_segments": -1}, "Number of segments"),
            # Port spacing too small: gap + waveguide_width >= port_spacing.
            (
                {"waveguide_width": 0.5, "gap": 0.2, "port_spacing": 0.6},
                "Port spacing",
            ),
            (
                {"waveguide_width": 0.5, "gap": 0.2, "port_spacing": 0.7},
                "Port spacing",
            ),
        ],
    )
    def test_validation(self, layer, kwargs, match):
        """All ``directional_coupler`` ValueError branches fire."""
        with pytest.raises(ValueError, match=match):
            directional_coupler(layer, **kwargs)


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


# =============================================================================
# Cross-component composition
# =============================================================================


class TestCompositions:
    """Integration tests that wire multiple components together.

    Catches port-direction or width regressions that slip through single
    component tests. The representative fixture is a Mach-Zehnder
    interferometer (2x ``mmi_2x2`` + two waveguide arms via ``Route``),
    which is the canonical "first real circuit" in photonics.
    """

    def test_mzi_from_mmi_2x2_and_routes(self, layer, tmp_path):
        """Build an MZI from two mmi_2x2 + two arms and verify it's valid.

        Asserts:
          * Arm ports connect at the same position with opposite
            directions and equal widths (``Port.can_connect_to``).
          * Each arm Route produces a non-empty Cell.
          * The top cell has the MMIs + two arm routes as child refs.
          * The design writes to a GDS file without error.
        """
        waveguide_width = 0.5
        mmi_length = 15.0
        port_separation = 2.0
        taper_length = 5.0
        total_mmi_length = mmi_length + 2 * taper_length  # 25.0
        arm_span = 40.0  # horizontal gap between the two MMIs
        arm_y_offset = 10.0  # how far each arm deflects off-center

        mmi = mmi_2x2(
            layer,
            waveguide_width=waveguide_width,
            length=mmi_length,
            port_separation=port_separation,
            taper_length=taper_length,
        )

        mmi_left = mmi.at(0, 0)
        mmi_right = mmi.at(total_mmi_length + arm_span, 0)

        upper_start = mmi_left.port("out2")  # upper output of the left MMI
        upper_end = mmi_right.port("in2")  # upper input of the right MMI
        lower_start = mmi_left.port("out1")  # lower output
        lower_end = mmi_right.port("in1")  # lower input

        # Sanity: the left/right MMI port pairs are directly opposite each
        # other (same y, same width, opposite x-facing directions), so the
        # Route endpoints can connect with zero mismatch.
        assert upper_start.position.y == pytest.approx(upper_end.position.y)
        assert lower_start.position.y == pytest.approx(lower_end.position.y)
        assert upper_start.width == pytest.approx(upper_end.width)
        assert upper_start.width == pytest.approx(waveguide_width)
        # Opposite-facing directions => the route departs right, arrives left.
        assert upper_start.direction.x * upper_end.direction.x < 0
        assert lower_start.direction.x * lower_end.direction.x < 0

        # Build two S-bend arms.
        upper_route = Route.through(
            upper_start,
            (total_mmi_length + arm_span / 4, upper_start.position.y),
            (total_mmi_length + arm_span / 4, upper_start.position.y + arm_y_offset),
            (total_mmi_length + 3 * arm_span / 4, upper_end.position.y + arm_y_offset),
            (total_mmi_length + 3 * arm_span / 4, upper_end.position.y),
            upper_end,
            layer=layer,
            width=waveguide_width,
            bend_radius=5.0,
        )
        lower_route = Route.through(
            lower_start,
            (total_mmi_length + arm_span / 4, lower_start.position.y),
            (total_mmi_length + arm_span / 4, lower_start.position.y - arm_y_offset),
            (total_mmi_length + 3 * arm_span / 4, lower_end.position.y - arm_y_offset),
            (total_mmi_length + 3 * arm_span / 4, lower_end.position.y),
            lower_end,
            layer=layer,
            width=waveguide_width,
            bend_radius=5.0,
        )

        upper_cell = upper_route.to_cell("mzi_arm_upper")
        lower_cell = lower_route.to_cell("mzi_arm_lower")

        # Each arm Route produces a valid cell with at least one polygon.
        assert upper_cell.polygon_count() >= 1
        assert lower_cell.polygon_count() >= 1

        # The routes actually carry some finite length.
        assert upper_route.path_length > arm_span
        assert lower_route.path_length > arm_span

        # Build the top cell.
        top = Cell("mzi_top")
        top.add_ref(mmi_left)
        top.add_ref(mmi_right)
        top.add_ref(upper_cell.at(0, 0))
        top.add_ref(lower_cell.at(0, 0))

        # Write to GDS — catches any geometric / referencing errors
        # (unknown cell, cycle, etc.) without needing behaviour tests.
        gds_path = tmp_path / "mzi.gds"
        write_gds(str(gds_path), top, quiet=True)
        assert gds_path.exists()
        assert gds_path.stat().st_size > 0

    def test_mmi_arms_port_pairs_connect(self, layer):
        """Port-pair matching without any routing, as a pure contract check.

        Two ``mmi_2x2`` placed back-to-back with the inter-MMI gap set
        to zero must have directly-matching port pairs per the MZI
        wiring convention.
        """
        mmi = mmi_2x2(layer, waveguide_width=0.5, length=15.0, taper_length=5.0)
        total = 15.0 + 2 * 5.0  # 25.0

        left = mmi.at(0, 0)
        right = mmi.at(total, 0)  # butt-coupled

        # Each output port of the left MMI should lie at the same (x, y)
        # as the corresponding input port of the right MMI, with
        # opposite-facing directions and equal widths.
        pairs = [("out1", "in1"), ("out2", "in2")]
        for left_name, right_name in pairs:
            a = left.port(left_name)
            b = right.port(right_name)
            assert a.can_connect_to(b), (
                f"{left_name}<->{right_name}: position/direction mismatch "
                f"({a.position} dir {a.direction} vs {b.position} dir {b.direction})"
            )
            assert a.width == pytest.approx(b.width)
