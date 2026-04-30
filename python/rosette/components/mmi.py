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

Self-imaging theory (cheat sheet)
---------------------------------
A multimode waveguide of width ``W_e`` supports multiple modes whose
beat lengths satisfy a simple rational relationship. This produces
**self-images** of the input field at regular intervals along the
MMI body. The key length scale is the half-beat length of the two
lowest modes::

    L_pi = (4 * n_eff * W_e^2) / (3 * lambda)

where ``W_e`` is the **effective** MMI width (slightly larger than the
geometric *mmi_width* due to mode penetration into the cladding) and
``lambda`` is the vacuum wavelength. From ``L_pi`` the self-imaging
lengths are:

* **N-fold image** (general interference): ``L = (3 * L_pi) / N``,
  giving an N-fold copy of the input at that position.
* **1 x N splitter** (``mmi_1x2`` uses N=2): ``length ≈ (3 * L_pi) / (4 * N)``
  using restricted interference when inputs are at the
  symmetry-preserving positions ``±W_e / (2N)``.
* **2 x 2 coupler** (``mmi_2x2``): two classic operating points:
  ``3 * L_pi`` gives a pair of direct images (cross-state when inputs
  are symmetric); ``(3 * L_pi) / 2`` gives a mirrored image (bar state).
  A **3 dB 2x2 MMI** uses ``length = (3 * L_pi) / 2`` with inputs at
  ``y = ±W_e / 6``.

In practice ``W_e ≈ mmi_width`` within a few percent for high-contrast
silicon waveguides; use this as a first-pass analytic design, then
refine with an eigenmode solver.

Port-separation guidance
------------------------
*port_separation* (center-to-center distance between the two ports
on the 2-port side) should sit at the symmetry-preserving position
predicted by the self-imaging theory:

* For a 3 dB **1x2 splitter**: ``port_separation ≈ mmi_width / 2``
  (inputs/outputs at ``±mmi_width / 4``).
* For a 3 dB **2x2 coupler**: ``port_separation ≈ mmi_width / 3``
  (inputs/outputs at ``±mmi_width / 6``).

Placing the ports far from these optima gives the wrong splitting
ratio or introduces asymmetry between outputs. The defaults in this
module (``port_separation=2.0``, ``mmi_width=6.0``) target a 3 dB
``mmi_2x2`` on a typical silicon photonics platform and are a reasonable
starting point for adaptation.

**Tapers.** The *taper_width* parameter sets the width of each access
waveguide at the MMI body interface. Wider tapers launch a cleaner
fundamental mode into the MMI (less excitation of undesired higher-order
modes in the multimode region) at the cost of footprint. A typical rule
is ``taper_width ≈ 2-3 x waveguide_width``; the module default is
``1.2 um`` which is a compromise for ``waveguide_width = 0.5``.
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
    Uses 1 x N restricted interference with the input on the axis of
    symmetry (y = 0); see the module docstring for sizing guidance.

    Ports (all with width = *waveguide_width*,
    ``total_length = length + 2 * taper_length``):
        - ``"in"``   at ``(0,            0)``,                   facing **-X**
        - ``"out1"`` at ``(total_length, -port_separation/2)``,  facing **+X** (lower)
        - ``"out2"`` at ``(total_length, +port_separation/2)``,  facing **+X** (upper)

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Width of input/output waveguides in microns.
        length: Length of the multimode region in microns. For a 3 dB
            splitter, target ``length ≈ (3 * L_pi) / 8`` (see module
            docstring).
        mmi_width: Width of the multimode region in microns. Wider
            bodies support more modes and longer *length*.
        taper_length: Length of each taper connecting the waveguide to
            the MMI body in microns. Must be >= 0; pass ``0.0`` to omit
            tapers (for test structures or when the access waveguide
            already matches *taper_width*).
        taper_width: Width of the taper at the MMI body interface in
            microns (the wide end of the taper where it meets the
            multimode region). Typically 2-3x *waveguide_width*.
        port_separation: Center-to-center distance between the two
            output ports in microns. Target ``mmi_width / 2`` for a
            symmetric 3 dB splitter.

    Returns:
        Cell with ports ``"in"``, ``"out1"``, ``"out2"``.
        ``path_length`` = *total_length* (straight-line length; the two
        output arms each share this path length so delay matching between
        them is automatic).

    Raises:
        ValueError: If *waveguide_width*, *length*, *mmi_width*,
            *taper_width*, or *port_separation* is not positive; if
            *taper_length* is negative.

    Placement notes:
        ``"in"`` faces **-X** and the ``"out*"`` ports face **+X**,
        following the outward-facing convention. Route *into* the
        ``"in"`` port from the left.

        To rotate the splitter (e.g. 90 deg for a vertical fan-out),
        rotate **before** translating: ``.at(0, 0).rotate(90).at(x, y)``.
        ``.at(x, y).rotate(deg)`` translates first then rotates the
        entire coordinate frame around the origin, which moves the
        component to an unexpected position.

        ``out1`` sits at negative y (below) and ``out2`` at positive y
        (above). Fan out from *port_separation* to a wider pitch with
        ``sbend`` or ``Route`` if needed.

    Examples:
        Default 3 dB splitter::

            >>> from rosette import Layer
            >>> from rosette.components import mmi_1x2
            >>> s = mmi_1x2(Layer(1, 0))
            >>> s.port("out1").position.y < 0  # lower output
            True

        Splitter feeding two grating couplers at fiber pitch::

            from rosette import Cell, Layer, Route, write_gds
            from rosette.components import grating_coupler, mmi_1x2

            layer = Layer(1, 0)
            splitter = mmi_1x2(layer)
            gc = grating_coupler(layer)

            sp = splitter.at(0, 0)
            L = splitter.path_length                 # length attribute lives on the Cell
            gc_lo = gc.at(0, 0).at(L + 80, -63.5)
            gc_hi = gc.at(0, 0).at(L + 80, +63.5)

            r_lo = Route.through(
                sp.port("out1"), (L + 20, sp.port("out1").position.y),
                gc_lo.port("opt"),
                layer=layer, bend_radius=10.0,
            )
            r_hi = Route.through(
                sp.port("out2"), (L + 20, sp.port("out2").position.y),
                gc_hi.port("opt"),
                layer=layer, bend_radius=10.0,
            )

            design = Cell("splitter_gcs")
            for inst in (sp, gc_lo, gc_hi):
                design.add_ref(inst)
            design.add_ref(r_lo.to_cell("r_lo"))
            design.add_ref(r_hi.to_cell("r_hi"))
            write_gds("output/splitter_gcs.gds", design)
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
    ``mmi_1x2``: geometrically identical, reflected through the
    ``x = total_length / 2`` plane so the two ports sit on the
    ``x = 0`` side. When both inputs are coherent and in phase, the
    output carries their sum; relative phase shifts between the inputs
    produce amplitude modulation at the output (the operating principle
    of a Mach-Zehnder modulator).

    Ports (all with width = *waveguide_width*,
    ``total_length = length + 2 * taper_length``):
        - ``"in1"`` at ``(0,            -port_separation/2)``, facing **-X** (lower)
        - ``"in2"`` at ``(0,            +port_separation/2)``, facing **-X** (upper)
        - ``"out"`` at ``(total_length, 0)``,                  facing **+X**

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Width of input/output waveguides in microns.
        length: Length of the multimode region in microns. Use the same
            self-imaging length as a 1x2 splitter of matching geometry
            (see module docstring).
        mmi_width: Width of the multimode region in microns.
        taper_length: Length of each taper in microns. Must be >= 0.
        taper_width: Width of the taper at the MMI body interface in
            microns.
        port_separation: Center-to-center distance between the two
            input ports in microns. Target ``mmi_width / 2`` for
            symmetric operation.

    Returns:
        Cell with ports ``"in1"``, ``"in2"``, ``"out"``.
        ``path_length`` = *total_length* (same for both input arms).

    Raises:
        ValueError: If *waveguide_width*, *length*, *mmi_width*,
            *taper_width*, or *port_separation* is not positive; if
            *taper_length* is negative.

    Placement notes:
        ``"in1"``/``"in2"`` face **-X** and ``"out"`` faces **+X**.
        Rotate before translating: ``.at(0, 0).rotate(deg).at(x, y)``.
        ``out`` sits at ``y = 0``.

    Examples:
        Default combiner::

            >>> from rosette import Layer
            >>> from rosette.components import mmi_2x1
            >>> combiner = mmi_2x1(Layer(1, 0))

        Combiner terminating the arms of a Mach-Zehnder modulator::

            from rosette import Layer
            from rosette.components import mmi_1x2, mmi_2x1

            layer = Layer(1, 0)
            splitter = mmi_1x2(layer)
            combiner = mmi_2x1(layer)  # same port geometry as splitter
            # Place combiner after the MZI arms; route splitter.out1/out2
            # through phase-shifting arms into combiner.in1/in2.
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
    right. Commonly used in Mach-Zehnder interferometers and I/Q mixers.
    At ``length = (3 * L_pi) / 2`` with inputs at the canonical
    ``y = ±W_e / 6`` positions, the coupler implements a 3 dB split
    between outputs with a 90-degree relative phase (the standard
    quadrature hybrid).

    Ports (all with width = *waveguide_width*,
    ``total_length = length + 2 * taper_length``):
        - ``"in1"``  at ``(0,            -port_separation/2)``, facing **-X** (lower)
        - ``"in2"``  at ``(0,            +port_separation/2)``, facing **-X** (upper)
        - ``"out1"`` at ``(total_length, -port_separation/2)``, facing **+X** (lower)
        - ``"out2"`` at ``(total_length, +port_separation/2)``, facing **+X** (upper)

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Width of input/output waveguides in microns.
        length: Length of the multimode region in microns. For a 3 dB
            coupler, target ``length ≈ (3 * L_pi) / 2``.
        mmi_width: Width of the multimode region in microns.
        taper_length: Length of each taper in microns. Must be >= 0.
        taper_width: Width of the taper at the MMI body interface in
            microns.
        port_separation: Center-to-center distance between ports on the
            same side in microns. Target ``mmi_width / 3`` for a 3 dB
            coupler with symmetric outputs.

    Returns:
        Cell with ports ``"in1"``, ``"in2"``, ``"out1"``, ``"out2"``.
        ``path_length`` = *total_length* (identical for all arms).

    Raises:
        ValueError: If *waveguide_width*, *length*, *mmi_width*,
            *taper_width*, or *port_separation* is not positive; if
            *taper_length* is negative.

    Placement notes:
        All input ports face **-X**; all output ports face **+X**.
        Rotate before translating: ``.at(0, 0).rotate(deg).at(x, y)``.

        ``mmi_2x2`` is a drop-in replacement for ``directional_coupler``
        in a Mach-Zehnder interferometer. The MMI is shorter and more
        tolerant to process width variation than an evanescent coupler
        at the cost of slightly higher insertion loss.

    Examples:
        Default 2x2 coupler::

            >>> from rosette import Layer
            >>> from rosette.components import mmi_2x2
            >>> coupler = mmi_2x2(Layer(1, 0))

        Worked Mach-Zehnder interferometer: two 2x2 MMIs with matched
        arms -- toggling the arm length imbalance sweeps the cross/bar
        ratio::

            from rosette import Cell, Layer, Route, write_gds
            from rosette.components import mmi_2x2

            layer = Layer(1, 0)
            mmi = mmi_2x2(layer)

            # Place input and output MMIs, separated by a 100 um arm region.
            mmi_in  = mmi.at(0, 0)
            mmi_out = mmi.at(0, 0).at(mmi.path_length + 100, 0)

            # Route the two arms. The upper arm takes a small detour to
            # create a delta-length and set the interferometer bias;
            # the waypoints are spaced so the 5 um bend radius fits.
            delta_y = 15.0   # extra y-excursion on the upper arm
            y_up = mmi_in.port("out2").position.y
            y_up_peak = y_up + delta_y
            upper = Route.through(
                mmi_in.port("out2"),
                (mmi.path_length + 20, y_up),
                (mmi.path_length + 20, y_up_peak),
                (mmi.path_length + 80, y_up_peak),
                (mmi.path_length + 80, mmi_out.port("in2").position.y),
                mmi_out.port("in2"),
                layer=layer, bend_radius=5.0,
            )
            lower = Route.through(
                mmi_in.port("out1"), mmi_out.port("in1"),
                layer=layer, bend_radius=5.0,
            )

            design = Cell("mzi")
            design.add_ref(mmi_in)
            design.add_ref(mmi_out)
            design.add_ref(upper.to_cell("upper"))
            design.add_ref(lower.to_cell("lower"))
            write_gds("output/mzi.gds", design)
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
        raise ValueError("Waveguide width must be positive")
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

    cell = Cell(
        safe_cell_name(
            f"mmi_{mmi_type}_l{length:.1f}_w{mmi_width:.1f}_pw{port_width:.3f}_tw{taper_width:.3f}"
        )
    )

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
