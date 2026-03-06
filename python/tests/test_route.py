"""Tests for the Route API."""

import math

from rosette import Layer, Point, Port, Route, Vector2, write_gds


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
