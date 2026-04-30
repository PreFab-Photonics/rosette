r"""Directional coupler components.

Two waveguides that approach each other via cosine S-bends, run parallel
in a close-proximity coupling region, then separate again::

    in1 (+y) ───\       /─── out1 (+y)
                 │ gap │
    in2 (-y) ───/       \─── out2 (-y)

    ├ bend_length ┤ coupling ┤ bend_length ┤
    ├──────────── total_length ────────────┤

``total_length = 2 * bend_length + coupling_length``.

Ports (all with width = *waveguide_width*):
    - ``"in1"``  at ``(0,            +port_spacing/2)``, facing **-X**
    - ``"in2"``  at ``(0,            -port_spacing/2)``, facing **-X**
    - ``"out1"`` at ``(total_length, +port_spacing/2)``, facing **+X**
    - ``"out2"`` at ``(total_length, -port_spacing/2)``, facing **+X**

Coupling-length vs. bend-length trade-off
-----------------------------------------
The power coupling ratio is set by the evanescent interaction integrated
over the whole path, which is dominated by the straight coupling region
but includes a non-negligible contribution from the S-bends (the arms
spend some distance close together while the bends bring them in and
out of the *gap* separation).

Practical guidance:

* **Short ``coupling_length`` (~0-5 um).** The S-bend contribution
  dominates. Power coupling is hard to predict because the effective
  interaction length depends strongly on *bend_length*. Prefer a
  dedicated bent coupler design for sub-50% ratios.
* **Moderate ``coupling_length`` (10-30 um).** The straight region
  dominates. Power coupling ~ ``sin^2(kappa * coupling_length)`` where
  ``kappa`` depends on *gap* and *waveguide_width*. This is the usual
  operating regime; tune *coupling_length* to hit the target ratio.
* **Long ``coupling_length`` (>> cross-over length).** Full power
  transfer occurs at ``L = pi / (2 * kappa)``. Longer couplers oscillate
  between the two waveguides and become very wavelength-sensitive.

**Bend length** should be long enough to keep bend loss negligible
(roughly ``bend_length >= 5 * waveguide_width`` for silicon photonics;
check your PDK's minimum radius). Shorter bends reduce footprint but
increase both the S-bend coupling contribution and the bend loss. If
you need a predictable splitting ratio, **fix *bend_length* first**
(set by the process's minimum radius) and tune *coupling_length* to
set the ratio.

**Gap** sets the coupling strength ``kappa`` exponentially. Halving
*gap* typically doubles ``kappa``, which halves the coupling length
needed for a given ratio.
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
        - ``"in1"``  at ``(0,  +py)``, facing **-X** (upper input)
        - ``"in2"``  at ``(0,  -py)``, facing **-X** (lower input)
        - ``"out1"`` at ``(tl, +py)``, facing **+X** (upper output)
        - ``"out2"`` at ``(tl, -py)``, facing **+X** (lower output)

    All port widths equal *waveguide_width*.

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Waveguide width in microns.
        coupling_length: Length of the parallel coupling region in
            microns. Dominates the power coupling ratio for typical
            values; see the module docstring for the trade-off.
        gap: Edge-to-edge gap between the two waveguides in the
            coupling region in microns. Sets the evanescent coupling
            strength (exponentially; smaller gap -> stronger coupling).
        bend_length: Horizontal length of each cosine S-bend transition
            in microns. Long enough to keep bend loss negligible
            (typically ``>= 5 * waveguide_width``); overly short bends
            contribute significantly to the net coupling and reduce
            splitting-ratio predictability.
        port_spacing: Center-to-center distance between the upper and
            lower port pairs in microns. Must be strictly greater than
            ``gap + waveguide_width`` so the S-bends can bring the two
            arms together in the coupling region. Larger *port_spacing*
            means steeper S-bends (more loss) or longer *bend_length*
            (more footprint).
        num_segments: Number of polygon segments per S-bend curve.
            Must be >= 1. Increase for smoother polygons on tight bends.

    Returns:
        Cell with ports ``"in1"``, ``"in2"``, ``"out1"``, ``"out2"``.
        ``path_length`` = arc length through one arm
        (``2 * S_bend_arc + coupling_length``), where ``S_bend_arc`` is
        the numerically integrated cosine-S-bend length over
        *bend_length* with offset ``(port_spacing - gap - waveguide_width)
        / 2``. The two arms are symmetric so either has the same
        *path_length*; use this for delay-line matching.

    Raises:
        ValueError: If *coupling_length*, *gap*, *waveguide_width*, or
            *bend_length* is not positive; if *num_segments* < 1;
            if *port_spacing* <= *gap* + *waveguide_width*.

    Placement notes:
        Input ports at ``x = 0`` face **-X**; output ports at
        ``x = total_length`` face **+X**, following the standard
        convention. Route *into* the input ports from the left.

        To rotate the coupler (e.g. 90 deg so inputs face **-Y**), rotate
        **before** translating: ``.at(0, 0).rotate(90).at(x, y)``.

        **Transform order matters.** ``.at(x, y).rotate(deg)`` translates
        first then rotates the *entire coordinate frame* around the origin,
        which moves the component to an unexpected position. Always
        rotate first, then translate.

        For a Mach-Zehnder interferometer, use two directional couplers
        (or ``mmi_2x2``) with a pair of matched-length arms between them.
        A typical 50/50 coupler at 1550 nm on silicon uses ``gap=0.2``,
        ``coupling_length`` around 10-20 um for single-mode waveguides.

    Examples:
        Standalone 3 dB (50/50) coupler::

            >>> from rosette import Layer
            >>> from rosette.components import directional_coupler
            >>> dc = directional_coupler(Layer(1, 0), coupling_length=20.0, gap=0.2)
            >>> dc.port("out1").position.y > 0
            True

        Tight coupler for small power tap (~5%)::

            # Short interaction length -> small cross-coupling.
            dc = directional_coupler(
                Layer(1, 0),
                coupling_length=2.0,
                gap=0.2,
                bend_length=15.0,
            )

        Two couplers as a Mach-Zehnder interferometer skeleton::

            from rosette import Cell, Layer, Route, write_gds
            from rosette.components import directional_coupler

            layer = Layer(1, 0)
            coupling_length = 15.0
            bend_length = 10.0                       # default
            dc = directional_coupler(
                layer, coupling_length=coupling_length, gap=0.2,
                bend_length=bend_length,
            )

            # Couplers separated by a 100 um straight gap. Use the coupler's
            # x-extent (2*bend_length + coupling_length), NOT dc.path_length
            # (which is the optical arc length through one arm and is a few
            # hundred nm longer than the x-extent).
            total_x = 2 * bend_length + coupling_length
            dc_in  = dc.at(0, 0)
            dc_out = dc.at(0, 0).at(total_x + 100, 0)

            upper = Route.through(
                dc_in.port("out1"), dc_out.port("in1"),
                layer=layer, bend_radius=10.0,
            )
            lower = Route.through(
                dc_in.port("out2"), dc_out.port("in2"),
                layer=layer, bend_radius=10.0,
            )

            design = Cell("mzi_skeleton")
            design.add_ref(dc_in)
            design.add_ref(dc_out)
            design.add_ref(upper.to_cell("upper"))
            design.add_ref(lower.to_cell("lower"))
            write_gds("output/mzi_skeleton.gds", design)
    """
    if coupling_length <= 0:
        raise ValueError("Coupling length must be positive")
    if gap <= 0:
        raise ValueError("Gap must be positive")
    if waveguide_width <= 0:
        raise ValueError("Waveguide width must be positive")
    if bend_length <= 0:
        raise ValueError("Bend length must be positive")
    if num_segments < 1:
        raise ValueError("Number of segments must be at least 1")
    if port_spacing <= gap + waveguide_width:
        raise ValueError(
            f"Port spacing ({port_spacing}) must be greater than "
            f"gap + waveguide_width ({gap + waveguide_width}) so the "
            f"S-bends can bring the two arms together in the coupling region"
        )

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
