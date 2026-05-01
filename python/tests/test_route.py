"""Tests for the Route API."""

import math

import pytest

from rosette import Layer, Point, Port, Route, Vector2, fresnel_c, fresnel_s, write_gds


class TestRouteBasic:
    """Basic Route functionality tests."""

    def test_straight_line(self):
        """Route between two points on the same axis."""
        layer = Layer(1, 0)
        route = Route(layer, width=0.5)
        route.start_at(0, 0, angle=0)
        route.to(100, 0)
        route.end_at(100, 0, angle=0)

        cell = route.to_cell("straight")
        assert cell.polygon_count() == 1
        assert abs(route.path_length - 100.0) < 0.1

    def test_90_degree_bend(self):
        """Route with a single 90-degree corner."""
        layer = Layer(1, 0)
        route = Route(layer, width=0.5, bend_radius=5.0)
        route.start_at(0, 0, angle=0)
        route.to(50, 0)
        route.to(50, 50)
        route.end_at(50, 50, angle=90)

        cell = route.to_cell("bend_90")
        assert cell.polygon_count() >= 2  # Straight + bend + straight

        # Path length: 50 - setback + arc + 50 - setback
        # setback = 5 * tan(45°) = 5
        # arc = 5 * π/2 ≈ 7.85
        expected = 50 - 5 + 5 * math.pi / 2 + 50 - 5
        assert abs(route.path_length - expected) < 1.0

    def test_s_curve(self):
        """Route with two opposite bends (S-curve)."""
        layer = Layer(1, 0)
        route = Route(layer, width=0.5, bend_radius=5.0)
        route.start_at(0, 0, angle=0)
        route.to(25, 0)
        route.to(25, 20)
        route.to(50, 20)
        route.end_at(50, 20, angle=0)

        cell = route.to_cell("s_curve")
        assert cell.polygon_count() >= 3

    def test_ports(self):
        """Route creates correct input/output ports."""
        layer = Layer(1, 0)
        route = Route(layer, width=0.5)
        route.start_at(0, 0, angle=0)
        route.to(50, 0)
        route.end_at(50, 0, angle=0)

        cell = route.to_cell("with_ports")

        in_port = cell.port("in")
        out_port = cell.port("out")

        assert in_port is not None
        assert out_port is not None
        assert abs(in_port.position.x) < 0.01
        assert abs(out_port.position.x - 50) < 0.01


class TestRouteFromPorts:
    """Tests for port-to-port routing."""

    def test_port_to_port(self):
        """Route between two ports."""
        layer = Layer(1, 0)

        port_a = Port("out", Point(0, 0), Vector2(1, 0), width=0.5)
        port_b = Port("in", Point(100, 50), Vector2(-1, 0), width=0.5)

        route = Route(layer, bend_radius=5.0)
        route.start_at_port(port_a)
        route.to(50, 0)
        route.to(50, 50)
        route.end_at_port(port_b)

        cell = route.to_cell("port_to_port")
        assert cell.polygon_count() >= 3

    def test_through_with_ports(self):
        """Route.through() with Port objects."""
        layer = Layer(1, 0)

        port_a = Port("out", Point(0, 0), Vector2(1, 0), width=0.5)
        port_b = Port("in", Point(100, 50), Vector2(-1, 0), width=0.5)

        route = Route.through(
            port_a, (50, 0), (50, 50), port_b, layer=layer, width=0.5, bend_radius=5.0
        )

        cell = route.to_cell("through_ports")
        assert cell.polygon_count() >= 3


class TestRouteThrough:
    """Tests for Route.through() static constructor."""

    def test_through_basic(self):
        """Route.through() with tuple waypoints."""
        layer = Layer(1, 0)

        route = Route.through(
            (0, 0, 0),  # Start with angle
            (50, 0),
            (50, 30),
            (100, 30, 0),  # End with angle
            layer=layer,
            width=0.5,
            bend_radius=5.0,
        )

        cell = route.to_cell("through_basic")
        assert cell.polygon_count() >= 3

    def test_through_with_points(self):
        """Route.through() with Point objects."""
        layer = Layer(1, 0)

        route = Route.through(
            Point(0, 0),
            Point(50, 0),
            Point(50, 30),
            Point(100, 30),
            layer=layer,
            width=0.5,
        )

        cell = route.to_cell("through_points")
        assert cell.polygon_count() >= 1


class TestRouteWarnings:
    """Tests for warning generation."""

    def test_tight_corner_warning(self):
        """Route warns when bend radius must be reduced."""
        layer = Layer(1, 0)

        route = Route(layer, width=0.5, bend_radius=20.0)  # Large radius
        route.start_at(0, 0, angle=0)
        route.to(10, 0)  # Short segment
        route.to(10, 10)
        route.end_at(10, 10, angle=90)

        _ = route.to_cell("tight")

        assert len(route.warnings) > 0
        assert "auto-reduced" in route.warnings[0]


class TestRouteWidthTransition:
    """Tests for width transitions."""

    def test_width_change(self):
        """Route handles width changes at waypoints."""
        layer = Layer(1, 0)

        route = Route(layer, width=0.5, bend_radius=5.0)
        route.start_at(0, 0, angle=0)
        route.to(50, 0, width=0.8)  # Width changes here
        route.to(100, 0)
        route.end_at(100, 0, angle=0)

        cell = route.to_cell("width_change")
        assert cell.polygon_count() >= 1


def _euler_setback_ratio(turn_angle: float) -> float:
    """Ground-truth Euler setback / bend_radius, computed from the Fresnel integrals.

    This mirrors the Rust ``setback_ratio`` helper; we recompute it here so
    the test is an independent check of the Rust implementation.
    """
    phi = abs(turn_angle) / 2.0
    if phi < 1e-12:
        return 0.0
    t_max = math.sqrt(2.0 * phi / math.pi)
    c = fresnel_c(t_max)
    s = fresnel_s(t_max)
    # cot(phi) = cos(phi) / sin(phi)
    cot_phi = math.cos(phi) / math.sin(phi)
    return math.sqrt(2.0 * math.pi * phi) * (c - s * cot_phi)


def _euler_clothoid_arc_length_numeric(
    turn_angle: float, bend_radius: float, samples: int = 4000
) -> float:
    """Numerically integrate the arc length of a full Euler (clothoid) corner.

    This is an **independent** check of the Route's Euler arc-length
    computation: it integrates the clothoid in an arc-length
    parameterisation (speed identically ``1``) without going through the
    Fresnel integrals. The half-corner has ``theta(s)`` ramping from 0 to
    the half-turn angle ``phi = |turn|/2`` while curvature ramps from 0 to
    ``1/R`` linearly in arc length.

    The per-half arc length is determined by requiring both boundary
    conditions simultaneously: ``kappa(s_max) = 1/R`` gives
    ``s_max = R * |turn|`` (twice the circular-bend equivalent), so the
    total arc length across both halves is ``2 * R * |turn|``.
    """
    phi = abs(turn_angle) / 2.0
    if phi < 1e-12:
        return 0.0

    # Arc-length parameterisation: kappa(s) = s / (R * s_max) ramps linearly
    # from 0 to 1/R across the half, giving theta(s) = s^2 / (2 * R * s_max).
    # Enforcing theta(s_max) = phi => s_max = 2 * R * phi = R * |turn|.
    s_max = bend_radius * abs(turn_angle)
    ds = s_max / samples
    prev_x = 0.0
    prev_y = 0.0
    prev_theta = 0.0
    half_length = 0.0
    for i in range(1, samples + 1):
        s = i * ds
        theta = s * s / (2.0 * bend_radius * s_max)
        # Midpoint rule on (cos, sin) to get a position increment.
        avg_theta = 0.5 * (prev_theta + theta)
        dx = ds * math.cos(avg_theta)
        dy = ds * math.sin(avg_theta)
        x = prev_x + dx
        y = prev_y + dy
        half_length += math.hypot(x - prev_x, y - prev_y)
        prev_x, prev_y, prev_theta = x, y, theta

    return 2.0 * half_length  # Two halves per corner.


class TestRouteEuler:
    """Tests for the Euler (clothoid) bend profile."""

    def test_euler_straight_line_matches_circular(self):
        """With no corners, bend_profile does not affect the result."""
        layer = Layer(1, 0)

        def make(profile):
            r = Route(layer, width=0.5, bend_profile=profile)
            r.start_at(0, 0, angle=0)
            r.to(100, 0)
            r.end_at(100, 0, angle=0)
            return r

        circ = make("circular")
        eul = make("euler")

        assert abs(circ.path_length - eul.path_length) < 1e-9
        assert circ.to_cell("c").polygon_count() == eul.to_cell("e").polygon_count() == 1

    def test_euler_90_degree_bend_path_length(self):
        """Euler 90° corner arc length matches 2 * R * (pi/2) = R * pi."""
        layer = Layer(1, 0)
        r = 5.0
        leg = 60.0

        route = Route(layer, width=0.5, bend_radius=r, bend_profile="euler")
        route.start_at(0, 0, angle=0)
        route.to(leg, 0)
        route.to(leg, leg)
        route.end_at(leg, leg, angle=90)

        assert not route.warnings, f"unexpected warnings: {route.warnings}"

        setback = r * _euler_setback_ratio(math.pi / 2)
        expected = 2.0 * (leg - setback) + r * math.pi
        assert abs(route.path_length - expected) < 0.5, (
            f"path_length={route.path_length}, expected={expected}, setback={setback}"
        )

    def test_euler_arc_length_matches_numeric(self):
        """Verify the Euler arc length matches a direct numerical integration."""
        layer = Layer(1, 0)
        r = 8.0
        leg = 100.0

        route = Route(layer, width=0.5, bend_radius=r, bend_profile="euler")
        route.start_at(0, 0, angle=0)
        route.to(leg, 0)
        route.to(leg, leg)
        route.end_at(leg, leg, angle=90)

        setback = r * _euler_setback_ratio(math.pi / 2)
        numeric_arc = _euler_clothoid_arc_length_numeric(math.pi / 2, r)
        expected = 2.0 * (leg - setback) + numeric_arc
        assert abs(route.path_length - expected) < 0.1

    def test_euler_longer_arc_than_circular(self):
        """For the same bend_radius, Euler arc length is 2x the circular arc."""
        layer = Layer(1, 0)
        r = 5.0

        def make(profile):
            route = Route(layer, width=0.5, bend_radius=r, bend_profile=profile)
            route.start_at(0, 0, angle=0)
            route.to(50, 0)
            route.to(50, 50)
            route.end_at(50, 50, angle=90)
            return route

        circ = make("circular")
        eul = make("euler")

        # Circular arc contribution: R * pi/2.
        # Euler arc contribution:    R * pi.
        # Difference in arc length = R * pi/2.
        # Also: Euler setbacks are larger, so Euler's straight segments are
        # shorter. Expected total extra = R*pi/2 - 2*(setback_eul - setback_circ).
        set_circ = r * math.tan(math.pi / 4)
        set_eul = r * _euler_setback_ratio(math.pi / 2)
        expected_extra = r * math.pi / 2 - 2.0 * (set_eul - set_circ)
        assert abs((eul.path_length - circ.path_length) - expected_extra) < 0.2

    def test_euler_45_degree_bend(self):
        """Euler corner works at non-90° angles too."""
        layer = Layer(1, 0)
        r = 5.0

        # 45° CCW turn: go from (0,0,0°) east, then up-and-to-the-right to (50, 50).
        route = Route(layer, width=0.5, bend_radius=r, bend_profile="euler")
        route.start_at(0, 0, angle=0)
        route.to(50, 0)
        route.to(100, 50)  # 45° turn at (50, 0)
        route.end_at(100, 50, angle=45)

        assert not route.warnings, f"unexpected warnings: {route.warnings}"
        cell = route.to_cell("euler_45")
        # Two straight segments + one Euler fillet.
        assert cell.polygon_count() == 3

    def test_euler_s_curve(self):
        """Euler profile works for S-curves (opposite-sign turns)."""
        layer = Layer(1, 0)

        route = Route(layer, width=0.5, bend_radius=5.0, bend_profile="euler")
        route.start_at(0, 0, angle=0)
        route.to(40, 0)
        route.to(40, 30)
        route.to(80, 30)
        route.end_at(80, 30, angle=0)

        assert not route.warnings
        cell = route.to_cell("euler_s")
        # 3 straights + 2 Euler bends.
        assert cell.polygon_count() >= 5

    def test_euler_through_waypoints(self):
        """Route.through() accepts bend_profile='euler'."""
        layer = Layer(1, 0)

        route = Route.through(
            (0, 0, 0),
            (50, 0),
            (50, 30),
            (100, 30, 0),
            layer=layer,
            width=0.5,
            bend_radius=5.0,
            bend_profile="euler",
        )

        assert not route.warnings
        cell = route.to_cell("through_euler")
        assert cell.polygon_count() >= 3

    def test_euler_tight_corner_auto_reduce(self):
        """Euler corners also trigger auto-reduce when spacing is too tight."""
        layer = Layer(1, 0)

        route = Route(layer, width=0.5, bend_radius=20.0, bend_profile="euler")
        route.start_at(0, 0, angle=0)
        route.to(5, 0)  # Very short segment
        route.to(5, 5)
        route.end_at(5, 5, angle=90)

        # Generate to populate warnings
        _ = route.to_cell("tight_euler")

        assert route.warnings
        assert "auto-reduced" in route.warnings[0]

    def test_invalid_bend_profile_raises(self):
        """Unknown bend_profile values raise ValueError."""
        layer = Layer(1, 0)
        with pytest.raises(ValueError, match="bend_profile"):
            Route(layer, bend_profile="sinusoidal")

        with pytest.raises(ValueError, match="bend_profile"):
            Route.through((0, 0), (50, 0), (50, 30), layer=layer, bend_profile="sinusoidal")

    def test_euler_path_length_scales_linearly_with_radius(self):
        """Euler arc length is exactly linear in bend_radius at fixed geometry.

        For a fixed turn angle, arc_length = 2 * R * |turn|, and the two
        setbacks scale linearly with R as well. So if we scale the
        *corner* bend_radius while keeping the corner geometry comfortable,
        the per-corner contribution to path_length is linear in R. We
        verify this by fitting the slope of (path_length vs R) at a fixed
        waypoint layout.
        """
        layer = Layer(1, 0)

        def length_for(r):
            route = Route(layer, width=0.5, bend_radius=r, bend_profile="euler")
            route.start_at(0, 0, angle=0)
            route.to(200, 0)
            route.to(200, 200)
            route.end_at(200, 200, angle=90)
            return route.path_length

        # Pick three radii well below the auto-reduce threshold.
        r1, r2, r3 = 3.0, 5.0, 8.0
        p1 = length_for(r1)
        p2 = length_for(r2)
        p3 = length_for(r3)

        # For a single 90° corner, d(path_length)/dR = pi - 2 * K_eul(pi/2),
        # where the first term is the arc derivative and the second is
        # twice the setback-per-radius (since two setbacks are subtracted
        # from the straight segments).
        k_eul = _euler_setback_ratio(math.pi / 2)
        expected_slope = math.pi - 2.0 * k_eul

        slope_12 = (p2 - p1) / (r2 - r1)
        slope_23 = (p3 - p2) / (r3 - r2)
        assert abs(slope_12 - expected_slope) < 0.05
        assert abs(slope_23 - expected_slope) < 0.05


class TestRouteIntegration:
    """Integration tests with GDS output."""

    def test_write_to_gds(self, tmp_path):
        """Route can be written to GDS file."""
        layer = Layer(1, 0)

        route = Route(layer, width=0.5, bend_radius=5.0)
        route.start_at(0, 0, angle=0)
        route.to(50, 0)
        route.to(50, 30)
        route.end_at(100, 30, angle=0)

        cell = route.to_cell("gds_test")

        gds_path = tmp_path / "route_test.gds"
        write_gds(str(gds_path), cell)

        assert gds_path.exists()
        assert gds_path.stat().st_size > 0
