r"""Directional coupler components.

Two waveguides that approach each other via cosine S-bends, run parallel
in a close-proximity coupling region, then separate again::

    in1 (+y) ───\       /─── out1 (+y)
                 │ gap │
    in2 (-y) ───/       \─── out2 (-y)

    ├ bend_length ┤ coupling ┤ bend_length ┤
    ├──────────── total_length ────────────┤

``total_length = 2 * bend_length + coupling_length``.
"""

import math

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._curves import (
    cosine_sbend_point,
    cosine_sbend_tangent,
    estimate_sbend_path_length,
)
from rosette.components._utils import safe_cell_name

__all__ = ["directional_coupler"]


def directional_coupler(
    layer: Layer,
    waveguide_width: float = 0.5,
    coupling_length: float = 20.0,
    gap: float = 0.2,
    bend_length: float = 10.0,
    port_spacing: float = 5.0,
    num_segments: int = 32,
) -> Cell:
    """Create a directional coupler.

    Two waveguides approach via cosine S-bends, run parallel for
    *coupling_length*, then separate again. The S-bends transition from
    *port_spacing* (center-to-center at the ports) down to
    *gap + waveguide_width* (center-to-center in the coupling region).

    Ports (where ``py = port_spacing / 2``,
    ``tl = 2 * bend_length + coupling_length``):
        - ``"in1"``  at ``(0, +py)``, facing **-X** (upper input)
        - ``"in2"``  at ``(0, -py)``, facing **-X** (lower input)
        - ``"out1"`` at ``(tl, +py)``, facing **+X** (upper output)
        - ``"out2"`` at ``(tl, -py)``, facing **+X** (lower output)

    All port widths equal *waveguide_width*.

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Waveguide width in microns.
        coupling_length: Length of the parallel coupling region in
            microns.
        gap: Edge-to-edge gap between the two waveguides in the
            coupling region in microns.
        bend_length: Horizontal length of each cosine S-bend transition
            in microns.
        port_spacing: Center-to-center distance between the upper and
            lower port pairs in microns. Must be large enough for the
            S-bends to reach the coupling gap.
        num_segments: Number of polygon segments per S-bend curve.

    Returns:
        Cell with ports ``"in1"``, ``"in2"``, ``"out1"``, ``"out2"``.
        ``path_length`` = arc length through one arm
        (``2 * S_bend_arc + coupling_length``).

    Raises:
        ValueError: If *coupling_length*, *gap*, *waveguide_width*, or
            *bend_length* is not positive; if *num_segments* < 1.

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import directional_coupler
        >>> dc = directional_coupler(Layer(1, 0), coupling_length=30.0, gap=0.15)
    """
    if coupling_length <= 0:
        raise ValueError("Coupling length must be positive")
    if gap <= 0:
        raise ValueError("Gap must be positive")
    if waveguide_width <= 0:
        raise ValueError("Width must be positive")
    if bend_length <= 0:
        raise ValueError("Bend length must be positive")
    if num_segments < 1:
        raise ValueError("Number of segments must be at least 1")

    total_length = 2 * bend_length + coupling_length
    port_y = port_spacing / 2
    coupling_y = (gap + waveguide_width) / 2  # Y position of waveguides in coupling region

    cell = Cell(safe_cell_name(f"dc_l{coupling_length:.1f}_g{gap:.2f}_w{waveguide_width:.3f}"))

    # Generate upper and lower arm polygons
    upper_poly = _coupler_arm_polygon(
        bend_length,
        coupling_length,
        waveguide_width,
        y_port=port_y,
        y_couple=coupling_y,
        num_segments=num_segments,
    )
    lower_poly = _coupler_arm_polygon(
        bend_length,
        coupling_length,
        waveguide_width,
        y_port=-port_y,
        y_couple=-coupling_y,
        num_segments=num_segments,
    )

    cell.add_polygon(upper_poly, layer)
    cell.add_polygon(lower_poly, layer)

    # Add ports
    cell.add_port(Port("in1", Point(0.0, port_y), -Vector2.unit_x(), waveguide_width))
    cell.add_port(Port("in2", Point(0.0, -port_y), -Vector2.unit_x(), waveguide_width))
    cell.add_port(Port("out1", Point(total_length, port_y), Vector2.unit_x(), waveguide_width))
    cell.add_port(Port("out2", Point(total_length, -port_y), Vector2.unit_x(), waveguide_width))

    # Path length through one arm (S-bend arc length + straight coupling)
    sbend_offset = abs(port_y - coupling_y)
    sbend_arc = estimate_sbend_path_length(bend_length, sbend_offset, "cosine")
    cell.path_length = 2 * sbend_arc + coupling_length

    return cell


def _coupler_arm_polygon(
    bend_length: float,
    coupling_length: float,
    width: float,
    y_port: float,
    y_couple: float,
    num_segments: int,
) -> Polygon:
    """Generate polygon for one arm of the directional coupler."""
    half_width = width / 2

    upper_points = []
    lower_points = []

    # Input S-bend (using shared curve utilities)
    offset_in = y_couple - y_port
    for i in range(num_segments + 1):
        t = i / num_segments
        # Get point on S-bend centerline (relative coords)
        rel_x, rel_y = cosine_sbend_point(t, bend_length, offset_in)
        x = rel_x
        y = y_port + rel_y

        # Get tangent for normal calculation
        tx, ty = cosine_sbend_tangent(t, bend_length, offset_in)
        tangent_len = math.sqrt(tx * tx + ty * ty)
        if tangent_len > 1e-10:
            tx, ty = tx / tangent_len, ty / tangent_len
        nx, ny = -ty, tx

        upper_points.append(Point(x + nx * half_width, y + ny * half_width))
        lower_points.append(Point(x - nx * half_width, y - ny * half_width))

    # Coupling region (straight)
    coupling_end = bend_length + coupling_length
    upper_points.append(Point(coupling_end, y_couple + half_width))
    lower_points.append(Point(coupling_end, y_couple - half_width))

    # Output S-bend
    offset_out = y_port - y_couple
    for i in range(num_segments + 1):
        t = i / num_segments
        rel_x, rel_y = cosine_sbend_point(t, bend_length, offset_out)
        x = coupling_end + rel_x
        y = y_couple + rel_y

        tx, ty = cosine_sbend_tangent(t, bend_length, offset_out)
        tangent_len = math.sqrt(tx * tx + ty * ty)
        if tangent_len > 1e-10:
            tx, ty = tx / tangent_len, ty / tangent_len
        nx, ny = -ty, tx

        upper_points.append(Point(x + nx * half_width, y + ny * half_width))
        lower_points.append(Point(x - nx * half_width, y - ny * half_width))

    return Polygon(upper_points + lower_points[::-1])
