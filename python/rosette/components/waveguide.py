"""Straight waveguide component.

The simplest photonic building block: a rectangular waveguide section of
constant width oriented along **+X**.
"""

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._utils import safe_cell_name

__all__ = ["waveguide"]


def waveguide(
    layer: Layer,
    waveguide_width: float = 0.5,
    length: float = 10.0,
) -> Cell:
    """Create a straight waveguide section.

    A constant-width rectangular waveguide oriented along +X, centered
    on the y-axis. This is the most basic routing element and is used
    to add explicit straight sections between bends or other components.

    Geometry::

        (0, +w/2) ──────────────── (length, +w/2)
        │          waveguide body          │
        (0, -w/2) ──────────────── (length, -w/2)

    Ports:
        - ``"in"``  at ``(0, 0)``, facing **-X**, width = *waveguide_width*
        - ``"out"`` at ``(length, 0)``, facing **+X**, width = *waveguide_width*

    Args:
        layer: GDS layer for the waveguide geometry.
        waveguide_width: Width of the waveguide in microns.
        length: Length of the waveguide in microns.

    Returns:
        Cell with ports ``"in"`` and ``"out"``.
        ``path_length`` = *length*.

    Raises:
        ValueError: If *length* or *waveguide_width* is not positive.

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import waveguide
        >>> wg = waveguide(Layer(1, 0), waveguide_width=0.5, length=10.0)
        >>> wg.port("out").position.x
        10.0
    """
    if length <= 0:
        raise ValueError("Waveguide length must be positive")
    if waveguide_width <= 0:
        raise ValueError("Waveguide width must be positive")

    cell = Cell(safe_cell_name(f"wg_l{length:.2f}_w{waveguide_width:.3f}"))

    # Create rectangle polygon centered on Y axis
    half_width = waveguide_width / 2.0
    poly = Polygon(
        [
            Point(0.0, -half_width),
            Point(length, -half_width),
            Point(length, half_width),
            Point(0.0, half_width),
        ]
    )
    cell.add_polygon(poly, layer)

    # Add ports
    cell.add_port(Port("in", Point(0.0, 0.0), -Vector2.unit_x(), waveguide_width))
    cell.add_port(Port("out", Point(length, 0.0), Vector2.unit_x(), waveguide_width))

    # Set path length metadata
    cell.path_length = length

    return cell
