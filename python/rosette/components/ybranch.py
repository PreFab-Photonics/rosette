"""Y-branch splitter component.

A geometry-based 1-to-2 power splitter. The waveguide splits into two
diverging arms at a specified angle. Unlike an MMI splitter, the Y-branch
relies on a smooth geometric transition rather than multimode interference.
"""

import math

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._utils import safe_cell_name

__all__ = ["ybranch"]


def ybranch(
    layer: Layer,
    waveguide_width: float = 0.5,
    length: float = 10.0,
    arm_angle: float = 10.0,
    taper_length: float = 5.0,
) -> Cell:
    """Create a Y-branch splitter.

    The waveguide begins at the origin and fans into two arms that
    diverge at +/- *arm_angle* from the +X axis. The component has two
    sections:

    1. **Junction** (0 to *length*): the waveguide body splits from a
       single input into two diverging arms.
    2. **Arm extension** (*length* to *length + taper_length*): each arm
       continues at the same angle and width. Despite the parameter name,
       no width tapering occurs -- *taper_length* simply controls how
       far the arms extend beyond the junction.

    Total component extent in x is ``length + taper_length``.

    Ports (where ``out_y = (length + taper_length) * tan(arm_angle)``):
        - ``"in"``   at ``(0, 0)``, facing **-X**,
          width = *waveguide_width*
        - ``"out1"`` at ``(length + taper_length, -out_y)``,
          facing the arm direction (angled downward),
          width = *waveguide_width*
        - ``"out2"`` at ``(length + taper_length, +out_y)``,
          facing the arm direction (angled upward),
          width = *waveguide_width*

    Note: the output port directions are **not** along +X -- they point
    along each arm's axis (rotated by +/- *arm_angle* from +X).

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Waveguide width in microns.
        length: Length of the diverging junction section in microns.
        arm_angle: Half-angle of the fork in degrees (each arm deviates
            by this angle from +X). Must be between 0 and 90 (exclusive).
        taper_length: Length of the straight arm extension beyond the
            junction in microns.

    Returns:
        Cell with ports ``"in"``, ``"out1"``, ``"out2"``.
        ``path_length`` = ``(length + taper_length) / cos(arm_angle)``.

    Raises:
        ValueError: If *waveguide_width*, *length*, or *taper_length*
            is not positive; if *arm_angle* is not in (0, 90).

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import ybranch
        >>> y = ybranch(Layer(1, 0), waveguide_width=0.5, arm_angle=10.0)
    """
    if waveguide_width <= 0:
        raise ValueError("Width must be positive")
    if length <= 0:
        raise ValueError("Length must be positive")
    if not 0 < arm_angle < 90:
        raise ValueError("Arm angle must be between 0 and 90 degrees (exclusive)")
    if taper_length <= 0:
        raise ValueError("Taper length must be positive")

    cell = Cell(safe_cell_name(f"ybranch_w{waveguide_width:.3f}_l{length:.1f}_a{arm_angle:.1f}"))

    # Convert angle to radians
    angle_rad = math.radians(arm_angle)

    # Total length including tapers
    total_length = length + taper_length

    # Y position at the split point
    split_y = length * math.tan(angle_rad)

    # Output port positions
    out_y = split_y + taper_length * math.tan(angle_rad)

    half_width = waveguide_width / 2

    # Each arm is a single polygon that traces from the input waveguide edge,
    # through the diverging junction, to the output.
    # Upper arm: outer edge goes from (0, +half_width) to (total, out_y+half_width),
    #            inner edge goes from (0, 0) along the arm center-line minus half_width.
    upper_arm = Polygon(
        [
            Point(0, 0),
            Point(0, half_width),
            Point(length, split_y + half_width),
            Point(total_length, out_y + half_width),
            Point(total_length, out_y - half_width),
            Point(length, split_y - half_width),
        ]
    )
    cell.add_polygon(upper_arm, layer)

    # Lower arm: mirror of upper
    lower_arm = Polygon(
        [
            Point(0, 0),
            Point(0, -half_width),
            Point(length, -split_y - half_width),
            Point(total_length, -out_y - half_width),
            Point(total_length, -out_y + half_width),
            Point(length, -split_y + half_width),
        ]
    )
    cell.add_polygon(lower_arm, layer)

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
