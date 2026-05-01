"""Edge coupler (inverse taper) component for fiber-edge coupling.

An edge coupler — also called an **inverse taper** or **spot-size
converter (SSC)** — is an alternative to the grating coupler for getting
light on and off chip. Instead of diffracting light vertically from a
periodic structure, it narrows the waveguide core toward the cleaved
chip edge; the fundamental mode weakens as the core shrinks and expands
laterally into the cladding, giving a larger, rounder mode that
mode-matches a lensed fiber or cleaved SMF reasonably well.

Relative to grating couplers:

* **Broader bandwidth** (no strong wavelength selectivity),
* **Lower polarization sensitivity** (no diffraction grating),
* **No vertical emission** — the fiber approaches the die edge, not
  the top surface. Needed for packaging flows that can't fit a
  vertically-coupled fiber array.

Geometry (viewed along +X)::

        chip edge                                    on-chip circuit
           │                                                 │
           │    cladding overlay (optional, full length)     │
           │  ┌───────────────────────────────────────────┐  │
           │  │                                           │  │
           │  │                                           │  │
           │  │ ·.                                      ..│  │
           │  │   ·. ──── taper core ──── ..··            │  │
           │  │      ·...           ...··                 │  │
           │  │          tip                       wide   │  │
           │  │   (width=tip_width)       (width=waveguide_width)
           │  └───────────────────────────────────────────┘  │
           │                                                 │
           └─────────────────────────────────────────────────┘
    x = -taper_length             x = 0  ── port "opt" (+X)

Port:
    - ``"opt"`` at ``(0, 0)``, facing **+X**, width = *waveguide_width*

The tip sits at ``(-taper_length, 0)``. There is **no port** at the tip:
the tip is meant to be cleaved/polished and butt-coupled to a fiber, not
routed to another on-chip component.

Choosing a taper profile
------------------------
Edge couplers are a textbook use case for **adiabatic** (non-linear)
taper profiles, because the mode evolves strongly as the core narrows
and mode-matching loss depends on the local taper angle:

* ``"linear"`` — Straight-edged trapezoid. Simple, predictable, and
  the default; use this unless you have a specific reason to do
  otherwise.
* ``"parabolic"`` — Constant-wedge-angle profile (``w² ∝ x``). Gives
  the shortest taper for a given coupling loss, so it's the standard
  choice when chip area is tight.
* ``"exponential"`` — Constant fractional rate of width change
  (``w(t) ∝ (w_out / w_in)^t``). A classic spot-size-converter
  profile.
"""

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._tapers import TaperProfile, taper_polygon
from rosette.components._utils import safe_cell_name

__all__ = ["edge_coupler"]


def edge_coupler(
    layer: Layer,
    waveguide_width: float = 0.5,
    tip_width: float = 0.15,
    taper_length: float = 200.0,
    taper_profile: TaperProfile = "linear",
    cladding_layer: Layer | None = None,
    cladding_width: float = 3.0,
) -> Cell:
    """Create an edge coupler (inverse taper / spot-size converter).

    The component extends in the **-X** direction from the origin: the
    core narrows from *waveguide_width* at ``x = 0`` down to *tip_width*
    at ``x = -taper_length``, where the chip will be cleaved so the tip
    butt-couples to a lensed fiber or bare SMF.

    Optionally, a rectangular cladding / mode-expansion overlay is
    stamped on *cladding_layer*, spanning the full taper region
    (``x ∈ [-taper_length, 0]``, ``y ∈ [-cladding_width/2, +cladding_width/2]``).
    This polygon is typically used to mark the oxide strip, nitride
    overlay, or SiO2 undercut region in platforms where the mode expander
    is a separate mask layer.

    Port:
        - ``"opt"`` at ``(0, 0)``, facing **+X**, width = *waveguide_width*

    Args:
        layer: GDS layer for the waveguide core taper.
        waveguide_width: Width at the wide (on-chip) end in microns.
            Must be > 0.
        tip_width: Width at the chip-edge end in microns. Must satisfy
            ``0 < tip_width < waveguide_width`` (inverse tapers narrow
            toward the edge).
        taper_length: Length of the taper in microns. Must be > 0.
            Typical values for silicon-on-insulator edge couplers are
            100-300 um; longer tapers are more adiabatic (lower loss)
            but cost footprint.
        taper_profile: Width profile along the taper. See module
            docstring for trade-offs.

            - ``"linear"`` — straight-edged trapezoid (default).
            - ``"parabolic"`` — constant-angle adiabatic profile.
            - ``"exponential"`` — constant fractional rate.
        cladding_layer: Optional second GDS layer for a rectangular
            overlay covering the taper region. ``None`` (default)
            skips the overlay.
        cladding_width: Width (y-extent) of the cladding overlay in
            microns. Must be > *waveguide_width* so the overlay fully
            encloses the core at the wide end. Ignored when
            *cladding_layer* is ``None``.

    Returns:
        Cell with port ``"opt"``.
        ``path_length`` = *taper_length* (the centerline is a straight
        line from ``(0, 0)`` to ``(-taper_length, 0)``).

    Raises:
        ValueError: If *waveguide_width*, *tip_width*, or *taper_length*
            is not positive; if *tip_width* >= *waveguide_width*; if
            *cladding_layer* is set and *cladding_width* is not > 0 or
            is not strictly greater than *waveguide_width*.

    Placement notes:
        The ``"opt"`` port faces **+X** (into the chip) and the tip
        faces **-X** (toward the die edge). To place an edge coupler at
        each edge of a die::

            # West edge: opt faces +X (default), tip points west (-X).
            ec_west = ec.at(0, 0).at(x_west_edge, y)

            # East edge: rotate 180 so opt faces -X (into the chip from
            # the east) and the tip points east.
            ec_east = ec.at(0, 0).rotate(180).at(x_east_edge, y)

        **Transform order matters.** ``.at(x, y).rotate(deg)`` translates
        first and then rotates the *entire coordinate frame* around the
        origin, which moves the component to an unexpected position.
        Always rotate first, then translate:
        ``.at(0, 0).rotate(deg).at(x, y)``.

        Fibers for edge coupling typically sit at a 127 um pitch in a
        v-groove array, the same pitch used for grating-coupler arrays.

    Examples:
        Standalone edge coupler on a single layer::

            >>> from rosette import Layer
            >>> from rosette.components import edge_coupler
            >>> ec = edge_coupler(Layer(1, 0))
            >>> ec.port("opt").direction.x
            1.0

        Parabolic taper with a nitride cladding overlay::

            ec = edge_coupler(
                Layer(1, 0),
                waveguide_width=0.5,
                tip_width=0.18,
                taper_length=150.0,
                taper_profile="parabolic",
                cladding_layer=Layer(2, 0),
                cladding_width=4.0,
            )

        Place one edge coupler at each die edge and route between them::

            from rosette import Cell, Layer, Route, write_gds
            from rosette.components import edge_coupler

            layer = Layer(1, 0)
            ec = edge_coupler(layer)

            west = ec.at(0, 0).at(0.0, 0.0)
            east = ec.at(0, 0).rotate(180).at(1000.0, 0.0)

            route = Route.through(
                west.port("opt"),
                east.port("opt"),
                layer=layer,
                bend_radius=10.0,
            )

            design = Cell("edge_loopback")
            design.add_ref(west)
            design.add_ref(east)
            design.add_ref(route.to_cell("route"))
            write_gds("output/edge_loopback.gds", design)
    """
    if waveguide_width <= 0:
        raise ValueError("Waveguide width must be positive")
    if tip_width <= 0:
        raise ValueError("Tip width must be positive")
    if tip_width >= waveguide_width:
        raise ValueError("Tip width must be smaller than waveguide width")
    if taper_length <= 0:
        raise ValueError("Taper length must be positive")
    if cladding_layer is not None:
        if cladding_width <= 0:
            raise ValueError("Cladding width must be positive")
        if cladding_width <= waveguide_width:
            raise ValueError("Cladding width must exceed waveguide width")

    # Cell naming. Include every geometry-affecting parameter so distinct
    # edge couplers get distinct names; safe_cell_name handles truncation
    # and hashing if the composite exceeds the GDS-II 32-character limit.
    clad_tag = f"_cl{cladding_width:.1f}" if cladding_layer is not None else ""
    cell = Cell(
        safe_cell_name(
            f"ec_w{waveguide_width:.3f}_tw{tip_width:.3f}"
            f"_tl{taper_length:.1f}_{taper_profile[:3]}{clad_tag}"
        )
    )

    # Core taper. taper_polygon builds the canonical shape in +X with
    # width_in at x=0 and width_out at x=length. We want the wide end
    # (waveguide_width) at x=0 -- where the "opt" port sits -- and the
    # tip (tip_width) at x=-taper_length. Building with
    # (waveguide_width, tip_width) puts the wide end at x=0 and the tip
    # at x=+taper_length; mirror_y() then flips the tip to x=-taper_length
    # while leaving the wide end at x=0.
    core_taper = taper_polygon(
        width_in=waveguide_width,
        width_out=tip_width,
        length=taper_length,
        profile=taper_profile,
    ).mirror_y()
    cell.add_polygon(core_taper, layer)

    # Optional cladding overlay: rectangle covering the full taper region.
    if cladding_layer is not None:
        half_clad = cladding_width / 2.0
        cladding = Polygon(
            [
                Point(-taper_length, -half_clad),
                Point(0.0, -half_clad),
                Point(0.0, +half_clad),
                Point(-taper_length, +half_clad),
            ]
        )
        cell.add_polygon(cladding, cladding_layer)

    # Port at the wide (on-chip) end, facing +X into the circuit.
    cell.add_port(Port("opt", Point(0.0, 0.0), Vector2.unit_x(), waveguide_width))

    # Centerline is a straight line of length taper_length.
    cell.path_length = taper_length

    return cell
