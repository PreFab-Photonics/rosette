"""Multi-Mode Interferometer (MMI) components.

MMIs use multimode interference to split or combine optical power. Three
variants are provided: ``mmi_1x2`` (splitter), ``mmi_2x1`` (combiner),
and ``mmi_2x2`` (coupler).

All MMIs share the same internal structure::

    ┌─ taper ─┬── MMI body ──┬─ taper ─┐
    x=0       taper_length    ...       total_length

``total_length = length + 2 * taper_length``.

Port naming -- numbered ports are spatially ordered: ``1`` = lower
(y < 0), ``2`` = upper (y > 0). ``"in"``/``"out"`` (without a number)
sit at y = 0.
"""

from typing import Literal

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._utils import safe_cell_name

__all__ = ["mmi_1x2", "mmi_2x1", "mmi_2x2"]


def mmi_1x2(
    layer: Layer,
    waveguide_width: float = 0.5,
    length: float = 10.0,
    mmi_width: float = 6.0,
    taper_length: float = 5.0,
    taper_width: float = 1.2,
    port_separation: float = 2.0,
) -> Cell:
    """Create a 1x2 MMI splitter.

    Splits a single input into two outputs with nominally equal power.

    Ports:
        - ``"in"``   at ``(0, 0)``, facing **-X**, width = *waveguide_width*
        - ``"out1"`` at ``(total_length, -port_separation/2)``, facing **+X** (lower)
        - ``"out2"`` at ``(total_length, +port_separation/2)``, facing **+X** (upper)

    where ``total_length = length + 2 * taper_length``.

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Width of input/output waveguides in microns.
        length: Length of the multimode region in microns.
        mmi_width: Width of the multimode region in microns.
        taper_length: Length of each taper connecting the waveguide to
            the MMI body in microns.
        taper_width: Width of the taper at the MMI body interface in
            microns (the wide end of the taper where it meets the
            multimode region).
        port_separation: Center-to-center distance between the two
            output ports in microns.

    Returns:
        Cell with ports ``"in"``, ``"out1"``, ``"out2"``.
        ``path_length`` = *total_length*.

    Raises:
        ValueError: If any dimension is not positive, or *taper_length*
            is negative.

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import mmi_1x2
        >>> s = mmi_1x2(Layer(1, 0))
        >>> s.port("out1").position.y < 0  # lower output
        True
    """
    return _create_mmi(
        "1x2", layer, length, mmi_width, waveguide_width, taper_length, taper_width, port_separation
    )


def mmi_2x1(
    layer: Layer,
    waveguide_width: float = 0.5,
    length: float = 10.0,
    mmi_width: float = 6.0,
    taper_length: float = 5.0,
    taper_width: float = 1.2,
    port_separation: float = 2.0,
) -> Cell:
    """Create a 2x1 MMI combiner.

    Combines two inputs into a single output. This is the mirror of
    ``mmi_1x2``.

    Ports:
        - ``"in1"`` at ``(0, -port_separation/2)``, facing **-X** (lower)
        - ``"in2"`` at ``(0, +port_separation/2)``, facing **-X** (upper)
        - ``"out"`` at ``(total_length, 0)``, facing **+X**

    where ``total_length = length + 2 * taper_length``.

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Width of input/output waveguides in microns.
        length: Length of the multimode region in microns.
        mmi_width: Width of the multimode region in microns.
        taper_length: Length of each taper in microns.
        taper_width: Width of the taper at the MMI body interface in
            microns.
        port_separation: Center-to-center distance between the two
            input ports in microns.

    Returns:
        Cell with ports ``"in1"``, ``"in2"``, ``"out"``.
        ``path_length`` = *total_length*.

    Raises:
        ValueError: If any dimension is not positive, or *taper_length*
            is negative.

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import mmi_2x1
        >>> combiner = mmi_2x1(Layer(1, 0))
    """
    return _create_mmi(
        "2x1", layer, length, mmi_width, waveguide_width, taper_length, taper_width, port_separation
    )


def mmi_2x2(
    layer: Layer,
    waveguide_width: float = 0.5,
    length: float = 15.0,
    mmi_width: float = 6.0,
    taper_length: float = 5.0,
    taper_width: float = 1.2,
    port_separation: float = 2.0,
) -> Cell:
    """Create a 2x2 MMI coupler.

    A four-port coupler: two inputs on the left, two outputs on the
    right. Commonly used in Mach-Zehnder interferometers.

    Ports:
        - ``"in1"``  at ``(0, -port_separation/2)``, facing **-X** (lower)
        - ``"in2"``  at ``(0, +port_separation/2)``, facing **-X** (upper)
        - ``"out1"`` at ``(total_length, -port_separation/2)``, facing **+X** (lower)
        - ``"out2"`` at ``(total_length, +port_separation/2)``, facing **+X** (upper)

    where ``total_length = length + 2 * taper_length``.

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Width of input/output waveguides in microns.
        length: Length of the multimode region in microns.
        mmi_width: Width of the multimode region in microns.
        taper_length: Length of each taper in microns.
        taper_width: Width of the taper at the MMI body interface in
            microns.
        port_separation: Center-to-center distance between ports on the
            same side in microns.

    Returns:
        Cell with ports ``"in1"``, ``"in2"``, ``"out1"``, ``"out2"``.
        ``path_length`` = *total_length*.

    Raises:
        ValueError: If any dimension is not positive, or *taper_length*
            is negative.

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import mmi_2x2
        >>> coupler = mmi_2x2(Layer(1, 0))
    """
    return _create_mmi(
        "2x2", layer, length, mmi_width, waveguide_width, taper_length, taper_width, port_separation
    )


def _create_mmi(
    mmi_type: Literal["1x2", "2x1", "2x2"],
    layer: Layer,
    length: float,
    mmi_width: float,
    port_width: float,
    taper_length: float,
    taper_width: float,
    port_separation: float,
) -> Cell:
    """Create an MMI of the specified type."""
    if length <= 0:
        raise ValueError("MMI length must be positive")
    if mmi_width <= 0:
        raise ValueError("MMI width must be positive")
    if port_width <= 0:
        raise ValueError("Port width must be positive")
    if taper_width <= 0:
        raise ValueError("Taper width must be positive")
    if taper_length < 0:
        raise ValueError("Taper length must be non-negative")
    if port_separation <= 0:
        raise ValueError("Port separation must be positive")

    total_length = length + 2 * taper_length
    half_width = mmi_width / 2.0
    half_sep = port_separation / 2.0
    half_port = port_width / 2.0
    half_taper = taper_width / 2.0

    cell = Cell(safe_cell_name(f"mmi_{mmi_type}_l{length:.1f}_w{mmi_width:.1f}"))

    # MMI body (rectangular multimode region)
    body = Polygon(
        [
            Point(taper_length, -half_width),
            Point(taper_length + length, -half_width),
            Point(taper_length + length, half_width),
            Point(taper_length, half_width),
        ]
    )
    cell.add_polygon(body, layer)

    # Input positions and ports
    if mmi_type == "1x2":
        input_positions = [0.0]
        input_names = ["in"]
    else:
        input_positions = [-half_sep, half_sep]
        input_names = ["in1", "in2"]

    # Output positions and ports
    if mmi_type == "2x1":
        output_positions = [0.0]
        output_names = ["out"]
    else:
        output_positions = [-half_sep, half_sep]
        output_names = ["out1", "out2"]

    # Add input tapers
    for y in input_positions:
        taper = Polygon(
            [
                Point(0.0, y - half_port),
                Point(taper_length, y - half_taper),
                Point(taper_length, y + half_taper),
                Point(0.0, y + half_port),
            ]
        )
        cell.add_polygon(taper, layer)

    # Add output tapers
    x_start = taper_length + length
    for y in output_positions:
        taper = Polygon(
            [
                Point(x_start, y - half_taper),
                Point(total_length, y - half_port),
                Point(total_length, y + half_port),
                Point(x_start, y + half_taper),
            ]
        )
        cell.add_polygon(taper, layer)

    # Add input ports
    for name, y in zip(input_names, input_positions, strict=True):
        cell.add_port(Port(name, Point(0.0, y), -Vector2.unit_x(), port_width))

    # Add output ports
    for name, y in zip(output_names, output_positions, strict=True):
        cell.add_port(Port(name, Point(total_length, y), Vector2.unit_x(), port_width))

    # Path length (approximate)
    cell.path_length = total_length

    return cell
