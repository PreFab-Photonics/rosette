"""S-bend components for lateral offset transitions.

An S-bend shifts the waveguide laterally while maintaining the same direction.

Ports: "in" (at origin, facing -X), "out" (at end, facing +X)
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

    The S-bend starts at the origin with input pointing in -X direction,
    and ends at (length, offset) with output pointing in +X direction.

    Positive offset shifts the waveguide upward (+Y).
    Negative offset shifts the waveguide downward (-Y).

    Args:
        layer: GDS layer for the geometry
        waveguide_width: Waveguide width in microns
        length: Horizontal length of the S-bend in microns
        offset: Vertical offset in microns (positive = up)
        bend_type: Curve type:
            - "cosine": Smooth cosine interpolation (default, zero curvature at ends)
            - "circular": Two circular arcs (constant radius per half)
            - "euler": Clothoid curves (linearly varying curvature, lowest loss)
        num_segments: Number of polygon segments (default: auto based on geometry)

    Returns:
        Cell with ports "in" and "out"

    Raises:
        ValueError: If length or width is not positive

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import sbend
        >>> # Or in user projects: from components import sbend
        >>> s = sbend(Layer(1, 0), waveguide_width=0.5, length=20.0, offset=5.0)
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

    # Cell naming with type suffix
    type_suffix = "" if bend_type == "cosine" else f"_{bend_type}"
    cell = Cell(f"sbend{type_suffix}_l{length:.2f}_o{offset:.2f}_w{waveguide_width:.3f}")
    cell.add_polygon(Polygon(vertices), layer)

    # Add ports
    cell.add_port(Port("in", Point(0.0, 0.0), -Vector2.unit_x(), waveguide_width))
    cell.add_port(Port("out", Point(length, offset), Vector2.unit_x(), waveguide_width))

    # Path length
    cell.path_length = estimate_sbend_path_length(length, offset, bend_type, num_segments)

    return cell
