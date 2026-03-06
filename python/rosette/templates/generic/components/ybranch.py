"""Y-branch splitter component.

A Y-branch is a simple 1x2 power splitter using a Y-shaped junction.

Ports: "in" (left, center), "out1" (right, y < 0, lower), "out2" (right, y > 0, upper)
"""

import math

from rosette import Cell, Layer, Point, Polygon, Port, Vector2

__all__ = ["ybranch"]


def ybranch(
    layer: Layer,
    waveguide_width: float = 0.5,
    length: float = 10.0,
    arm_angle: float = 10.0,
    taper_length: float = 5.0,
) -> Cell:
    """Create a Y-branch splitter.

    The Y-branch splits a single input waveguide into two output waveguides
    at a specified angle.

    Args:
        layer: GDS layer for the geometry
        waveguide_width: Waveguide width in microns
        length: Length of the Y-branch junction in microns
        arm_angle: Angle of output arms in degrees
        taper_length: Length of output tapers in microns

    Returns:
        Cell with ports:
        - "in": Input at x=0, y=0 (facing -X)
        - "out1": Lower output at y < 0 (angled downward)
        - "out2": Upper output at y > 0 (angled upward)

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import ybranch
        >>> # Or in user projects: from components import ybranch
        >>> y = ybranch(Layer(1, 0), waveguide_width=0.5)
    """
    if waveguide_width <= 0:
        raise ValueError("Width must be positive")
    if length <= 0:
        raise ValueError("Length must be positive")

    cell = Cell(f"ybranch_w{waveguide_width:.3f}_l{length:.1f}_a{arm_angle:.1f}")

    # Convert angle to radians
    angle_rad = math.radians(arm_angle)

    # Total length including tapers
    total_length = length + taper_length

    # Y position at the split point
    split_y = length * math.tan(angle_rad)

    # Output port positions
    out_y = split_y + taper_length * math.tan(angle_rad)

    half_width = waveguide_width / 2

    # Create Y-junction polygon (main body)
    # This is a triangular region that splits into two arms
    junction_poly = Polygon(
        [
            Point(0, -half_width),
            Point(length, -split_y - half_width),
            Point(length, split_y + half_width),
            Point(0, half_width),
        ]
    )
    cell.add_polygon(junction_poly, layer)

    # Upper arm taper
    upper_taper = Polygon(
        [
            Point(length, split_y - half_width),
            Point(total_length, out_y - half_width),
            Point(total_length, out_y + half_width),
            Point(length, split_y + half_width),
        ]
    )
    cell.add_polygon(upper_taper, layer)

    # Lower arm taper
    lower_taper = Polygon(
        [
            Point(length, -split_y - half_width),
            Point(total_length, -out_y - half_width),
            Point(total_length, -out_y + half_width),
            Point(length, -split_y + half_width),
        ]
    )
    cell.add_polygon(lower_taper, layer)

    # Add ports
    cell.add_port(Port("in", Point(0, 0), -Vector2.unit_x(), waveguide_width))

    # Output ports (angled)
    out_dir_upper = Vector2(math.cos(angle_rad), math.sin(angle_rad))
    out_dir_lower = Vector2(math.cos(angle_rad), -math.sin(angle_rad))

    cell.add_port(Port("out1", Point(total_length, -out_y), out_dir_lower, waveguide_width))
    cell.add_port(Port("out2", Point(total_length, out_y), out_dir_upper, waveguide_width))

    # Path length (approximate)
    cell.path_length = total_length / math.cos(angle_rad)

    return cell
