"""Bend components for changing waveguide direction.

Supports both circular bends and Euler (clothoid) bends. Circular bends
have constant curvature; Euler bends linearly ramp curvature from zero at
the endpoints to a maximum at the midpoint, reducing optical mode mismatch
and loss.
"""

import math

from rosette import (
    Cell,
    Layer,
    Point,
    Polygon,
    Port,
    Vector2,
)
from rosette.components._curves import euler_bend_point, euler_bend_tangent
from rosette.components._utils import safe_cell_name

__all__ = ["bend"]


def bend(
    layer: Layer,
    waveguide_width: float = 0.5,
    radius: float = 5.0,
    angle: float = 90.0,
    euler: bool = False,
    num_segments: int | None = None,
) -> Cell:
    """Create a waveguide bend.

    The bend starts at the origin traveling in the +X direction and turns
    through the specified *angle*.

    * **Positive** angles bend **counter-clockwise** (output towards +Y).
    * **Negative** angles bend **clockwise** (output towards -Y).

    For a **circular** 90-degree CCW bend the output port is at
    ``(radius, radius)`` pointing in +Y.  In general the output position
    is ``(R * sin(a), R * (1 - cos(a)))`` for positive angles and
    ``(R * sin(|a|), -R * (1 - cos(|a|)))`` for negative angles, where
    *R* = *radius* and *a* = *angle* in radians.

    When ``euler=True`` the bend uses two clothoid (Cornu-spiral) segments
    instead of a constant-radius arc.  Curvature ramps linearly from zero
    at the endpoints to a peak at the midpoint, producing lower optical
    loss than a circular bend of the same effective radius.  The output
    position differs slightly from the circular case.

    Ports:
        - ``"in"``  at ``(0, 0)``, facing **-X**, width = *waveguide_width*
        - ``"out"`` at the bend endpoint, facing the exit tangent direction,
          width = *waveguide_width*

    Args:
        layer: GDS layer for the bend geometry.
        waveguide_width: Waveguide width in microns.
        radius: Bend radius in microns. For circular bends this is the
            exact centerline radius. For Euler bends it is the *effective*
            radius: the arc length equals ``radius * |angle|`` (same as
            a circular bend), but the physical footprint is slightly
            different.
        angle: Bend angle in degrees. Positive = CCW, negative = CW.
        euler: If ``True``, create an Euler (clothoid) bend instead of a
            circular bend.
        num_segments: Number of polygon segments. ``None`` (default)
            auto-selects ``max(8, int(|angle| * 2))``.

    Returns:
        Cell with ports ``"in"`` and ``"out"``.
        ``path_length`` = ``radius * |angle_in_radians|``.

    Raises:
        ValueError: If *radius* or *waveguide_width* is not positive,
            or *angle* is zero.

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import bend
        >>> b = bend(Layer(1, 0), radius=5.0, angle=90.0)
        >>> # Output is at (5, 5) pointing +Y for a 90-degree CCW bend
    """
    if radius <= 0:
        raise ValueError("Bend radius must be positive")
    if waveguide_width <= 0:
        raise ValueError("Bend width must be positive")
    if abs(angle) < 1e-6:
        raise ValueError("Bend angle cannot be zero")

    # Convert angle to radians
    angle_rad = math.radians(angle)

    # Determine number of segments
    if num_segments is None:
        num_segments = max(8, int(abs(angle) * 2))

    # Generate bend geometry
    if euler:
        vertices = _euler_bend_vertices(radius, angle_rad, waveguide_width, num_segments)
        name = f"bend_euler_r{radius:.2f}_a{angle:.0f}_w{waveguide_width:.3f}"
        out_pos, out_dir = _euler_output(radius, angle_rad)
    else:
        vertices = _circular_bend_vertices(radius, angle_rad, waveguide_width, num_segments)
        name = f"bend_r{radius:.2f}_a{angle:.0f}_w{waveguide_width:.3f}"
        out_pos, out_dir = _circular_output(radius, angle_rad)

    cell = Cell(safe_cell_name(name))
    cell.add_polygon(Polygon(vertices), layer)

    # Add ports
    cell.add_port(Port("in", Point(0.0, 0.0), -Vector2.unit_x(), waveguide_width))
    cell.add_port(Port("out", out_pos, out_dir, waveguide_width))

    # Set path length (arc length)
    cell.path_length = radius * abs(angle_rad)

    return cell


def _circular_bend_vertices(
    radius: float, angle_rad: float, width: float, num_segments: int
) -> list[Point]:
    """Generate vertices for a circular bend polygon."""
    half_width = width / 2.0
    sign = 1.0 if angle_rad > 0 else -1.0

    # Center of the arc
    cy = sign * radius

    # Generate outer and inner edge points
    outer_points = []
    inner_points = []

    for i in range(num_segments + 1):
        t = i / num_segments
        theta = t * abs(angle_rad)

        # Point on centerline
        cx = radius * math.sin(theta)
        center_y = cy - sign * radius * math.cos(theta)

        # Tangent direction at this point
        tangent_x = math.cos(theta)
        tangent_y = sign * math.sin(theta)

        # Normal (perpendicular to tangent)
        normal_x = -tangent_y
        normal_y = tangent_x

        # Outer and inner points
        outer_points.append(
            Point(
                cx + normal_x * half_width,
                center_y + normal_y * half_width,
            )
        )
        inner_points.append(
            Point(
                cx - normal_x * half_width,
                center_y - normal_y * half_width,
            )
        )

    # Combine: outer forward, inner backward
    return outer_points + inner_points[::-1]


def _circular_output(radius: float, angle_rad: float) -> tuple[Point, Vector2]:
    """Calculate output port position and direction for circular bend."""
    sign = 1.0 if angle_rad > 0 else -1.0
    theta = abs(angle_rad)

    # Output position
    out_x = radius * math.sin(theta)
    out_y = sign * radius * (1 - math.cos(theta))

    # Output direction (tangent at end)
    dir_x = math.cos(theta)
    dir_y = sign * math.sin(theta)

    return Point(out_x, out_y), Vector2(dir_x, dir_y)


def _euler_bend_vertices(
    radius: float, angle_rad: float, width: float, num_segments: int
) -> list[Point]:
    """Generate vertices for an Euler (clothoid) bend polygon.

    Uses shared euler_bend_point/euler_bend_tangent from _curves module.
    """
    half_width = width / 2.0
    sign = 1.0 if angle_rad > 0 else -1.0
    total_angle = abs(angle_rad)

    outer_points = []
    inner_points = []

    for i in range(num_segments + 1):
        t = i / num_segments

        # Get centerline point and tangent from shared functions
        cx, cy = euler_bend_point(t, radius, total_angle)
        tx, ty = euler_bend_tangent(t, total_angle)

        # Apply sign for direction (CCW vs CW)
        cy *= sign
        ty *= sign

        # Normal (perpendicular to tangent)
        normal_x = -ty
        normal_y = tx

        outer_points.append(
            Point(
                cx + normal_x * half_width,
                cy + normal_y * half_width,
            )
        )
        inner_points.append(
            Point(
                cx - normal_x * half_width,
                cy - normal_y * half_width,
            )
        )

    return outer_points + inner_points[::-1]


def _euler_output(radius: float, angle_rad: float) -> tuple[Point, Vector2]:
    """Calculate output port position and direction for Euler bend."""
    sign = 1.0 if angle_rad > 0 else -1.0
    total_angle = abs(angle_rad)

    # Get endpoint from shared function
    x, y = euler_bend_point(1.0, radius, total_angle)
    y *= sign

    # Get tangent at end from shared function
    tx, ty = euler_bend_tangent(1.0, total_angle)
    ty *= sign

    return Point(x, y), Vector2(tx, ty)
