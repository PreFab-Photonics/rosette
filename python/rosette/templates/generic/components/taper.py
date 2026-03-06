"""Linear taper component for width transitions.

A taper provides a linear width transition between two waveguide widths.

Ports: "in" (at origin with width_in), "out" (at end with width_out)
"""

from rosette import Cell, Layer, Point, Polygon, Port, Vector2

__all__ = ["taper"]


def taper(
    layer: Layer,
    width_in: float = 0.5,
    width_out: float = 1.0,
    length: float = 10.0,
) -> Cell:
    """Create a linear taper for width transitions.

    The taper is oriented along the positive X axis, with:
    - Input port ("in") at the origin with width_in
    - Output port ("out") at (length, 0) with width_out

    Args:
        layer: GDS layer for the taper geometry
        width_in: Input width at x=0 in microns
        width_out: Output width at x=length in microns
        length: Length of the taper in microns

    Returns:
        Cell with ports "in" and "out"

    Raises:
        ValueError: If length or widths are not positive

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import taper
        >>> # Or in user projects: from components import taper
        >>> t = taper(Layer(1, 0), width_in=0.5, width_out=1.0, length=10.0)
        >>> t.port("in").width
        0.5
        >>> t.port("out").width
        1.0
    """
    if length <= 0:
        raise ValueError("Taper length must be positive")
    if width_in <= 0:
        raise ValueError("Taper input width must be positive")
    if width_out <= 0:
        raise ValueError("Taper output width must be positive")

    cell = Cell(f"taper_l{length:.2f}_wi{width_in:.3f}_wo{width_out:.3f}")

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
