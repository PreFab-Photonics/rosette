"""Spiral delay line components.

Spirals provide compact optical delay lines with long path lengths in a
small footprint. The spiral is centered at the origin and winds outward.
Light enters at the outer edge (``"in"``) and exits at the center
(``"out"``).
"""

import math
from typing import Literal

from rosette import Cell, Layer, Point, Port, Vector2, offset_polygon
from rosette.components._utils import safe_cell_name

__all__ = ["spiral"]


def spiral(
    layer: Layer,
    waveguide_width: float = 0.5,
    turns: float = 3.0,
    min_radius: float = 10.0,
    spacing: float = 2.0,
    spiral_type: Literal["archimedean", "fermat"] = "archimedean",
    num_points_per_turn: int = 64,
) -> Cell:
    """Create a spiral delay line.

    The spiral is centered at the origin and winds outward from
    *min_radius* for the given number of *turns*. Light enters at the
    outer edge and exits at the center.

    Ports:
        - ``"in"``  at the **outer** end of the spiral, facing tangent
          inward (toward the spiral center).
          Position: ``(outer_r * cos(theta_max), outer_r * sin(theta_max))``
          where ``theta_max = turns * 2 * pi`` and ``outer_r`` is the
          radius at that angle.
        - ``"out"`` at the **inner** end (``(min_radius, 0)``), facing
          tangent outward (+Y direction at angle 0).

    Both port widths equal *waveguide_width*. Because the spiral has
    arbitrary winding, port positions depend on the parameters -- use
    ``cell.port("in").position`` to query the exact location after
    construction.

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Waveguide width in microns.
        turns: Number of spiral turns (can be fractional).
        min_radius: Minimum radius at the center of the spiral in
            microns.
        spacing: Radial distance gained per turn in microns
            (center-to-center between adjacent turns for Archimedean).
            Must be greater than *waveguide_width* to avoid overlapping
            turns.
        spiral_type: Spiral growth law:

            - ``"archimedean"`` -- Radius increases linearly with angle
              (constant radial spacing between turns).
            - ``"fermat"`` -- Radius squared increases linearly with
              angle (denser packing near center, useful for equal
              optical-path-length between turns).
        num_points_per_turn: Number of polygon vertices generated per
            360-degree revolution.

    Returns:
        Cell with ports ``"in"`` (outer) and ``"out"`` (center).
        ``path_length`` = numerically integrated centerline arc length.

    Raises:
        ValueError: If *waveguide_width*, *min_radius*, or *turns* is
            not positive; if *spacing* <= *waveguide_width*.

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import spiral
        >>> s = spiral(Layer(1, 0), turns=5, min_radius=15.0)
        >>> s.path_length > 400  # long delay line
        True
    """
    if waveguide_width <= 0:
        raise ValueError("Width must be positive")
    if min_radius <= 0:
        raise ValueError("Minimum radius must be positive")
    if turns <= 0:
        raise ValueError("Turns must be positive")
    if spacing <= waveguide_width:
        raise ValueError("Spacing must be greater than width")

    # Abbreviate type for GDS 32-char name limit: archimedean -> arch, fermat -> ferm
    type_abbr = spiral_type[:4]
    cell = Cell(
        safe_cell_name(f"sprl_{type_abbr}_t{turns:.1f}_r{min_radius:.1f}_w{waveguide_width:.3f}")
    )

    # Generate centerline points
    num_points = int(turns * num_points_per_turn) + 1
    centerline = []
    path_len = 0.0
    prev_point = None

    for i in range(num_points):
        t = i / (num_points - 1)  # 0 to 1
        theta = t * turns * 2 * math.pi

        if spiral_type == "archimedean":
            # r = min_radius + spacing * theta / (2*pi)
            r = min_radius + spacing * theta / (2 * math.pi)
        else:  # fermat
            # r^2 proportional to theta
            r = math.sqrt(min_radius**2 + (spacing * min_radius) * theta / math.pi)

        x = r * math.cos(theta)
        y = r * math.sin(theta)
        point = Point(x, y)
        centerline.append(point)

        if prev_point is not None:
            path_len += prev_point.distance_to(point)
        prev_point = point

    # Generate polygon from centerline
    poly = offset_polygon(centerline, waveguide_width)
    cell.add_polygon(poly, layer)

    # Calculate port positions and directions
    # Inner port (at center, t=0)
    inner_theta = 0
    inner_r = min_radius
    inner_pos = Point(inner_r * math.cos(inner_theta), inner_r * math.sin(inner_theta))
    # Direction tangent to spiral pointing outward (direction of increasing theta)
    inner_dir = Vector2(-math.sin(inner_theta), math.cos(inner_theta))

    # Outer port (at max radius, t=1)
    outer_theta = turns * 2 * math.pi
    if spiral_type == "archimedean":
        outer_r = min_radius + spacing * outer_theta / (2 * math.pi)
    else:
        outer_r = math.sqrt(min_radius**2 + (spacing * min_radius) * outer_theta / math.pi)
    outer_pos = Point(outer_r * math.cos(outer_theta), outer_r * math.sin(outer_theta))
    # Direction tangent pointing inward (opposite to direction of increasing theta)
    outer_dir = Vector2(math.sin(outer_theta), -math.cos(outer_theta))

    # Ports: "in" at outer (light enters), "out" at inner/center (light exits)
    cell.add_port(Port("in", outer_pos, outer_dir, waveguide_width))
    cell.add_port(Port("out", inner_pos, inner_dir, waveguide_width))

    cell.path_length = path_len

    # Record minimum bend radius for design checks (spiral center at origin)
    cell.add_bend(min_radius, 0.0, 0.0)

    return cell
