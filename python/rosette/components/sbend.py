"""S-bend components for lateral offset transitions.

An S-bend shifts the waveguide laterally while keeping the input and output
directions parallel (+X). Three curve profiles are available: cosine
(default, smooth), circular (two arcs), and Euler (clothoid, lowest loss).
"""

import math
from typing import Literal

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._curves import (
    circular_sbend_point,
    circular_sbend_tangent,
    cosine_sbend_point,
    cosine_sbend_tangent,
    estimate_sbend_path_length,
    euler_sbend_point,
    euler_sbend_tangent,
)
from rosette.components._utils import safe_cell_name

__all__ = ["sbend"]


def sbend(
    layer: Layer,
    waveguide_width: float = 0.5,
    length: float = 20.0,
    offset: float = 5.0,
    bend_type: Literal["cosine", "circular", "euler"] = "cosine",
    num_segments: int | None = None,
) -> Cell:
    """Create an S-bend for lateral waveguide offset.

    Shifts the waveguide by *offset* microns in Y over a horizontal
    span of *length* microns, while keeping input and output directions
    both along +X. Useful for connecting two ports that are at the same
    x-coordinate but different y-coordinates, or for creating lateral
    transitions inside a route.

    When ``offset=0`` the result is a straight waveguide of the given
    *length* (degenerate case).

    Ports:
        - ``"in"``  at ``(0, 0)``, facing **-X**, width = *waveguide_width*
        - ``"out"`` at ``(length, offset)``, facing **+X**, width = *waveguide_width*

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Waveguide width in microns.
        length: Horizontal length of the S-bend in microns.
        offset: Vertical offset in microns. Positive = up (+Y),
            negative = down (-Y).
        bend_type: Curve profile:

            - ``"cosine"`` -- Smooth raised-cosine interpolation (default).
              Zero curvature at both endpoints, making it easy to connect
              to straight waveguides.
            - ``"circular"`` -- Two circular arcs joined at the midpoint.
              Constant bend radius per half, but curvature is discontinuous
              at the junction.
            - ``"euler"`` -- Two clothoid (Cornu-spiral) segments. Curvature
              varies linearly with arc length, giving the lowest optical
              loss of the three options.
        num_segments: Number of polygon segments. ``None`` (default)
            auto-selects based on the aspect ratio ``|offset| / length``.

    Returns:
        Cell with ports ``"in"`` and ``"out"``.
        ``path_length`` = numerically integrated arc length of the centerline.

    Raises:
        ValueError: If *length* or *waveguide_width* is not positive.

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import sbend
        >>> s = sbend(Layer(1, 0), length=20.0, offset=5.0)
        >>> s.port("out").position.y
        5.0
    """
    if length <= 0:
        raise ValueError("S-bend length must be positive")
    if waveguide_width <= 0:
        raise ValueError("S-bend width must be positive")

    # Default segments based on geometry
    if num_segments is None:
        aspect = abs(offset) / length if offset != 0 else 0
        num_segments = 32 + int(aspect * 32)

    # Select curve functions based on bend type
    if bend_type == "circular":
        point_fn = circular_sbend_point
        tangent_fn = circular_sbend_tangent
    elif bend_type == "euler":
        point_fn = euler_sbend_point
        tangent_fn = euler_sbend_tangent
    else:  # cosine (default)
        point_fn = cosine_sbend_point
        tangent_fn = cosine_sbend_tangent

    # Generate centerline and build polygon
    half_width = waveguide_width / 2.0
    outer_points = []
    inner_points = []

    for i in range(num_segments + 1):
        t = i / num_segments

        # Get centerline point and tangent
        cx, cy = point_fn(t, length, offset)
        tx, ty = tangent_fn(t, length, offset)

        # Normalize tangent
        tlen = math.sqrt(tx * tx + ty * ty)
        if tlen > 1e-10:
            tx, ty = tx / tlen, ty / tlen

        # Normal (perpendicular)
        nx, ny = -ty, tx

        outer_points.append(Point(cx + nx * half_width, cy + ny * half_width))
        inner_points.append(Point(cx - nx * half_width, cy - ny * half_width))

    # Combine into polygon
    vertices = outer_points + inner_points[::-1]

    # Cell naming with type suffix (abbreviated for GDS 32-char limit)
    type_suffix = "" if bend_type == "cosine" else f"_{bend_type[:3]}"
    cell = Cell(
        safe_cell_name(f"sb{type_suffix}_l{length:.2f}_o{offset:.2f}_w{waveguide_width:.3f}")
    )
    cell.add_polygon(Polygon(vertices), layer)

    # Add ports
    cell.add_port(Port("in", Point(0.0, 0.0), -Vector2.unit_x(), waveguide_width))
    cell.add_port(Port("out", Point(length, offset), Vector2.unit_x(), waveguide_width))

    # Path length
    cell.path_length = estimate_sbend_path_length(length, offset, bend_type, num_segments)

    return cell
