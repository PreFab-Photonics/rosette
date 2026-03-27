"""Linear taper component for width transitions.

A trapezoidal taper that linearly transitions between two waveguide widths.
Use this to connect waveguides or component ports that have different widths.
"""

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._utils import safe_cell_name

__all__ = ["taper"]


def taper(
    layer: Layer,
    width_in: float = 0.5,
    width_out: float = 1.0,
    length: float = 10.0,
) -> Cell:
    """Create a linear taper for width transitions.

    A trapezoidal polygon oriented along +X that linearly interpolates
    width from *width_in* to *width_out*. Use this between any two
    components whose port widths differ.

    Geometry::

        (0, +wi/2)  ────────────  (length, +wo/2)
        │            taper body            │
        (0, -wi/2)  ────────────  (length, -wo/2)

    Ports:
        - ``"in"``  at ``(0, 0)``, facing **-X**, width = *width_in*
        - ``"out"`` at ``(length, 0)``, facing **+X**, width = *width_out*

    Args:
        layer: GDS layer for the taper geometry.
        width_in: Input waveguide width at x = 0 in microns.
        width_out: Output waveguide width at x = *length* in microns.
        length: Length of the taper in microns.

    Returns:
        Cell with ports ``"in"`` and ``"out"``.
        ``path_length`` = *length*.

    Raises:
        ValueError: If *length*, *width_in*, or *width_out* is not positive.

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import taper
        >>> t = taper(Layer(1, 0), width_in=0.5, width_out=1.0, length=10.0)
        >>> t.port("in").width, t.port("out").width
        (0.5, 1.0)
    """
    if length <= 0:
        raise ValueError("Taper length must be positive")
    if width_in <= 0:
        raise ValueError("Taper input width must be positive")
    if width_out <= 0:
        raise ValueError("Taper output width must be positive")

    cell = Cell(safe_cell_name(f"taper_l{length:.2f}_wi{width_in:.3f}_wo{width_out:.3f}"))

    # Create trapezoid polygon
    half_in = width_in / 2.0
    half_out = width_out / 2.0
    poly = Polygon(
        [
            Point(0.0, -half_in),
            Point(length, -half_out),
            Point(length, half_out),
            Point(0.0, half_in),
        ]
    )
    cell.add_polygon(poly, layer)

    # Add ports with appropriate widths
    cell.add_port(Port("in", Point(0.0, 0.0), -Vector2.unit_x(), width_in))
    cell.add_port(Port("out", Point(length, 0.0), Vector2.unit_x(), width_out))

    # Set path length metadata
    cell.path_length = length

    return cell
