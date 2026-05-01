"""Multi-Mode Interferometer (MMI) components.

MMIs use multimode interference to split or combine optical power.
A single :func:`mmi` function covers the common variants; pick
``n_in`` / ``n_out`` to select behaviour:

* ``mmi(layer)`` - default 1x2 splitter (``n_in=1, n_out=2``)
* ``mmi(layer, n_in=2, n_out=1)`` - 2x1 combiner (mirror of the 1x2)
* ``mmi(layer, n_in=2, n_out=2, length=15.0)`` - 2x2 coupler

All variants share the same internal structure::

    +- taper -+-- MMI body --+- taper -+
    x=0       taper_length    ...       total_length

``total_length = length + 2 * taper_length``.

Port naming -- numbered ports are spatially ordered: ``1`` = lower
(y < 0), ``2`` = upper (y > 0). ``"in"``/``"out"`` (without a number)
sit at y = 0 and are used only on the side with a single port.

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
* **1 x N splitter** (``n_in=1, n_out=N``, N=2 here): ``length ~= (3 * L_pi) / (4 * N)``
  using restricted interference when inputs are at the
  symmetry-preserving positions ``+/- W_e / (2N)``.
* **2 x 2 coupler** (``n_in=2, n_out=2``): two classic operating
  points: ``3 * L_pi`` gives a pair of direct images (cross-state
  when inputs are symmetric); ``(3 * L_pi) / 2`` gives a mirrored
  image (bar state). A **3 dB 2x2 MMI** uses ``length = (3 * L_pi) / 2``
  with inputs at ``y = +/- W_e / 6``.

In practice ``W_e ~= mmi_width`` within a few percent for high-contrast
silicon waveguides; use this as a first-pass analytic design, then
refine with an eigenmode solver.

Port-separation guidance
------------------------
*port_separation* (center-to-center distance between the two ports
on a 2-port side) should sit at the symmetry-preserving position
predicted by the self-imaging theory:

* For a 3 dB **1x2 splitter**: ``port_separation ~= mmi_width / 2``
  (inputs/outputs at ``+/- mmi_width / 4``).
* For a 3 dB **2x2 coupler**: ``port_separation ~= mmi_width / 3``
  (inputs/outputs at ``+/- mmi_width / 6``).

Placing the ports far from these optima gives the wrong splitting
ratio or introduces asymmetry between outputs. The defaults in this
module (``port_separation=2.0``, ``mmi_width=6.0``) target a 3 dB
2x2 MMI on a typical silicon photonics platform and are a reasonable
starting point for adaptation.

**Tapers.** The *taper_width* parameter sets the width of each access
waveguide at the MMI body interface. Wider tapers launch a cleaner
fundamental mode into the MMI (less excitation of undesired higher-order
modes in the multimode region) at the cost of footprint. A typical rule
is ``taper_width ~= 2-3 x waveguide_width``; the module default is
``1.2 um`` which is a compromise for ``waveguide_width = 0.5``.
"""

from typing import Literal

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._tapers import taper_polygon
from rosette.components._utils import safe_cell_name

__all__ = ["mmi"]


def mmi(
    layer: Layer,
    *,
    n_in: Literal[1, 2] = 1,
    n_out: Literal[1, 2] = 2,
    waveguide_width: float = 0.5,
    length: float = 10.0,
    mmi_width: float = 6.0,
    taper_length: float = 5.0,
    taper_width: float = 1.2,
    port_separation: float = 2.0,
) -> Cell:
    """Create an N_in x N_out MMI splitter / combiner / coupler.

    Selects the variant via *n_in* / *n_out*:

    * ``n_in=1, n_out=2`` -- 1x2 splitter (the default). Splits one
      input into two outputs with nominally equal power. Uses 1xN
      restricted interference with the input on the axis of symmetry
      (y = 0).
    * ``n_in=2, n_out=1`` -- 2x1 combiner. Geometrically a mirror of
      the 1x2: same body and tapers, reflected so the two ports sit
      on the ``x = 0`` side. With coherent in-phase inputs the output
      carries their sum; relative phase shifts modulate the output
      amplitude (the operating principle of a Mach-Zehnder modulator).
    * ``n_in=2, n_out=2`` -- 2x2 coupler. Four ports, typical of
      Mach-Zehnder interferometers and I/Q mixers. At ``length = (3*L_pi)/2``
      with inputs at the canonical ``y = +/- W_e/6``, implements a
      3 dB split with 90 deg relative phase (quadrature hybrid). The
      2x2 default ``length`` of 10 um is a starting point only --
      for a 3 dB coupler target ``length ~= (3 * L_pi) / 2`` (see
      module docstring).

    See the module docstring for self-imaging theory, ``L_pi``
    sizing, and port-separation guidance.

    Ports (all have width = *waveguide_width*,
    ``total_length = length + 2 * taper_length``):

    * ``n_in == 1``: ``"in"`` at ``(0, 0)`` facing **-X**.
    * ``n_in == 2``: ``"in1"`` at ``(0, -port_separation/2)`` (lower)
      and ``"in2"`` at ``(0, +port_separation/2)`` (upper), facing **-X**.
    * ``n_out == 1``: ``"out"`` at ``(total_length, 0)`` facing **+X**.
    * ``n_out == 2``: ``"out1"`` at ``(total_length, -port_separation/2)``
      (lower) and ``"out2"`` at ``(total_length, +port_separation/2)``
      (upper), facing **+X**.

    Args:
        layer: GDS layer for the geometry.
        n_in: Number of input ports (1 or 2).
        n_out: Number of output ports (1 or 2).
        waveguide_width: Width of input/output waveguides in microns.
        length: Length of the multimode region in microns. For a 3 dB
            1x2 splitter, target ``length ~= (3 * L_pi) / 8``; for a
            3 dB 2x2 coupler, target ``length ~= (3 * L_pi) / 2`` (see
            module docstring).
        mmi_width: Width of the multimode region in microns. Wider
            bodies support more modes and longer *length*.
        taper_length: Length of each taper connecting the waveguide to
            the MMI body in microns. Must be >= 0; pass ``0.0`` to omit
            tapers (for test structures or when the access waveguide
            already matches *taper_width*).
        taper_width: Width of the taper at the MMI body interface in
            microns (the wide end of the taper where it meets the
            multimode region). Typically 2-3 x *waveguide_width*.
        port_separation: Center-to-center distance between two ports
            on the same side in microns. Target ``mmi_width / 2`` for
            a symmetric 3 dB 1x2 splitter; ``mmi_width / 3`` for a
            3 dB 2x2 coupler. Ignored on a side with only one port.

    Returns:
        Cell whose ports depend on *n_in* / *n_out* (see above).
        ``path_length`` = *total_length* (straight-line length; all
        arms through the MMI share this path length, so delay matching
        between them is automatic).

    Raises:
        ValueError: If *n_in* or *n_out* is not 1 or 2; if
            *waveguide_width*, *length*, *mmi_width*, *taper_width*,
            or *port_separation* is not positive; if *taper_length*
            is negative.

    Placement notes:
        Input ports face **-X** and output ports face **+X**, following
        the outward-facing convention. Route *into* input ports from
        the left.

        To rotate the MMI (e.g. 90 deg for a vertical fan-out), rotate
        **before** translating: ``.at(0, 0).rotate(90).at(x, y)``.
        ``.at(x, y).rotate(deg)`` translates first then rotates the
        entire coordinate frame around the origin, which moves the
        component to an unexpected position.

        For numbered ports, ``*1`` sits at negative y (below) and
        ``*2`` at positive y (above). Fan out from *port_separation*
        to a wider pitch with ``sbend`` or ``Route`` if needed.

        A 2x2 MMI is a drop-in replacement for ``directional_coupler``
        in a Mach-Zehnder interferometer: shorter and more tolerant to
        process width variation than an evanescent coupler, at the
        cost of slightly higher insertion loss.

    Examples:
        Default 3 dB 1x2 splitter::

            >>> from rosette import Layer
            >>> from rosette.components import mmi
            >>> s = mmi(Layer(1, 0))
            >>> s.port("out1").position.y < 0  # lower output
            True

        2x1 combiner (mirror of the 1x2)::

            >>> combiner = mmi(Layer(1, 0), n_in=2, n_out=1)

        2x2 coupler sized for 3 dB operation::

            >>> coupler = mmi(Layer(1, 0), n_in=2, n_out=2, length=15.0)

        Splitter feeding two grating couplers at fiber pitch::

            from rosette import Cell, Layer, Route, write_gds
            from rosette.components import grating_coupler, mmi

            layer = Layer(1, 0)
            splitter = mmi(layer)
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

        Worked Mach-Zehnder interferometer: two 2x2 MMIs with matched
        arms -- toggling the arm length imbalance sweeps the cross/bar
        ratio::

            from rosette import Cell, Layer, Route, write_gds
            from rosette.components import mmi

            layer = Layer(1, 0)
            coupler = mmi(layer, n_in=2, n_out=2, length=15.0)

            # Place input and output MMIs, separated by a 100 um arm region.
            mmi_in  = coupler.at(0, 0)
            mmi_out = coupler.at(0, 0).at(coupler.path_length + 100, 0)

            # Route the two arms. The upper arm takes a small detour to
            # create a delta-length and set the interferometer bias;
            # the waypoints are spaced so the 5 um bend radius fits.
            delta_y = 15.0   # extra y-excursion on the upper arm
            y_up = mmi_in.port("out2").position.y
            y_up_peak = y_up + delta_y
            upper = Route.through(
                mmi_in.port("out2"),
                (coupler.path_length + 20, y_up),
                (coupler.path_length + 20, y_up_peak),
                (coupler.path_length + 80, y_up_peak),
                (coupler.path_length + 80, mmi_out.port("in2").position.y),
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

    Migration from pre-1.0:
        The three variants ``mmi_1x2`` / ``mmi_2x1`` / ``mmi_2x2`` were
        consolidated into this single function::

            mmi_1x2(layer)  -> mmi(layer)                            # n_in=1, n_out=2 defaults
            mmi_2x1(layer)  -> mmi(layer, n_in=2, n_out=1)
            mmi_2x2(layer)  -> mmi(layer, n_in=2, n_out=2, length=15.0)

        Port names and geometry are unchanged.
    """
    if n_in not in (1, 2):
        raise ValueError(f"n_in must be 1 or 2, got {n_in}")
    if n_out not in (1, 2):
        raise ValueError(f"n_out must be 1 or 2, got {n_out}")
    if length <= 0:
        raise ValueError("MMI length must be positive")
    if mmi_width <= 0:
        raise ValueError("MMI width must be positive")
    if waveguide_width <= 0:
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

    cell = Cell(
        safe_cell_name(
            f"mmi_{n_in}x{n_out}_l{length:.1f}_w{mmi_width:.1f}"
            f"_pw{waveguide_width:.3f}_tw{taper_width:.3f}"
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

    # Port positions and names
    #
    # Numbered ports ("in1"/"in2", "out1"/"out2") are spatially ordered:
    # 1 = lower (y < 0), 2 = upper (y > 0). A lone port on a side keeps
    # the unnumbered "in"/"out" name and sits at y=0.
    if n_in == 1:
        input_positions = [0.0]
        input_names = ["in"]
    else:
        input_positions = [-half_sep, half_sep]
        input_names = ["in1", "in2"]

    if n_out == 1:
        output_positions = [0.0]
        output_names = ["out"]
    else:
        output_positions = [-half_sep, half_sep]
        output_names = ["out1", "out2"]

    # Tapers: waveguide_width at the outer face, taper_width at the MMI
    # body interface. The helper always produces a linear trapezoid
    # here; non-linear MMI tapers are uncommon and can be added later
    # by threading a ``profile`` parameter through the component API if
    # a user needs it. When taper_length == 0 the tapers degenerate and
    # are skipped entirely (the port widths must then equal taper_width
    # for a geometric match, but that's the caller's responsibility --
    # the API contract only validates taper_length >= 0).
    if taper_length > 0:
        input_taper = taper_polygon(waveguide_width, taper_width, taper_length)
        for y in input_positions:
            cell.add_polygon(input_taper.translate(Vector2(0.0, y)), layer)

        # Output taper: wide end at x_start (MMI body), narrow end at
        # total_length (port face). Build the canonical shape with the
        # widths flipped (wide -> narrow along +X) and translate so its
        # wide end lands at x_start.
        x_start = taper_length + length
        output_taper = taper_polygon(taper_width, waveguide_width, taper_length)
        for y in output_positions:
            cell.add_polygon(output_taper.translate(Vector2(x_start, y)), layer)

    # Input ports face -X
    for name, y in zip(input_names, input_positions, strict=True):
        cell.add_port(Port(name, Point(0.0, y), -Vector2.unit_x(), waveguide_width))

    # Output ports face +X
    for name, y in zip(output_names, output_positions, strict=True):
        cell.add_port(Port(name, Point(total_length, y), Vector2.unit_x(), waveguide_width))

    # Path length (straight-line through the MMI body + both tapers)
    cell.path_length = total_length

    return cell
