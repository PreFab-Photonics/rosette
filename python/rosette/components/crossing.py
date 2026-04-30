"""Waveguide crossing components.

Allows two waveguides to intersect with minimal crosstalk and loss.
The crossing is centered at the origin with four arms along the
cardinal directions. Three geometries are available:

* **simple** -- A bare cross shape. Simplest, but highest loss.
* **elliptical** -- Waveguide width smoothly expands (cosine profile)
  at the center. Lower loss due to reduced diffraction.
* **mmi** -- Rectangular expansion at the center with tapered
  transitions. Broadband, process-tolerant.

Geometry (viewed from +Z, centered at origin)::

                         out2 (+Y)
                            |
                            |
                            |
    in1 ----------------- (0,0) ----------------- out1
    (-X)                    |                     (+X)
                            |
                            |
                          in2 (-Y)

        |<-- arm_length -->|<-- arm_length -->|

Ports (all with width = *waveguide_width*):
    - ``"in1"``  at ``(-arm_length, 0)``, facing **-X** (west)
    - ``"out1"`` at ``(+arm_length, 0)``, facing **+X** (east)
    - ``"in2"``  at ``(0, -arm_length)``, facing **-Y** (south)
    - ``"out2"`` at ``(0, +arm_length)``, facing **+Y** (north)

Choosing a ``crossing_type``
----------------------------
In order of increasing complexity / decreasing loss:

* ``"simple"`` -- Two straight waveguides overlap at the center with
  no expansion. Easiest to DRC and fastest to write, but the mode
  sees a sudden 2-D transition at the intersection so insertion loss
  and crosstalk are the highest. Acceptable for coarse layouts and
  non-critical test structures.
* ``"elliptical"`` -- The waveguide half-width expands with a cosine
  profile up to *center_width*/2 at the origin, then tapers back down
  in the opposite arm. This keeps the fundamental mode guided across
  the intersection while gently flaring it to reduce diffraction into
  the orthogonal waveguide. Best single-wavelength performance and
  the sensible default.
* ``"mmi"`` -- The center is a square of side *center_width* with
  linear tapers from each arm. Acts as a very short multimode region.
  Slightly worse than elliptical at the design wavelength but more
  tolerant to process width variation and more broadband, useful for
  wavelength-multiplexed circuits.
"""

import math
from typing import Literal

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._utils import safe_cell_name

__all__ = ["crossing"]


def crossing(
    layer: Layer,
    waveguide_width: float = 0.5,
    arm_length: float = 5.0,
    crossing_type: Literal["simple", "elliptical", "mmi"] = "elliptical",
    center_width: float | None = None,
) -> Cell:
    """Create a waveguide crossing.

    Centered at the origin with four arms along the cardinal directions.
    The horizontal path (``"in1"`` to ``"out1"``) and vertical path
    (``"in2"`` to ``"out2"``) intersect at the center.

    Ports (all with width = *waveguide_width*):
        - ``"in1"``  at ``(-arm_length, 0)``, facing **-X** (west)
        - ``"out1"`` at ``(+arm_length, 0)``, facing **+X** (east)
        - ``"in2"``  at ``(0, -arm_length)``, facing **-Y** (south)
        - ``"out2"`` at ``(0, +arm_length)``, facing **+Y** (north)

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Waveguide width in microns.
        arm_length: Length of each arm extending from the center in
            microns. For the ``"elliptical"`` and ``"mmi"`` variants,
            must be strictly greater than *center_width* / 2 so each
            arm has room for a full taper.
        crossing_type: Geometry at the intersection:

            - ``"simple"`` -- Plain cross, no center expansion. Highest
              loss, simplest to DRC. Use for coarse layouts or test
              structures where performance is not critical.
            - ``"elliptical"`` -- Cosine-profile width expansion at the
              center (default). Lowest insertion loss and lowest crosstalk
              for single-wavelength operation.
            - ``"mmi"`` -- Rectangular expansion with linear tapers.
              Slightly worse than ``"elliptical"`` at the design wavelength
              but more broadband and more tolerant to process width
              variation.
        center_width: Maximum width at the center of the expansion
            region in microns. Default: ``3 * waveguide_width`` for
            ``"elliptical"`` / ``"mmi"``. Must be ``None`` when
            ``crossing_type="simple"`` (the simple crossing has no
            center expansion region).

    Returns:
        Cell with ports ``"in1"``, ``"out1"``, ``"in2"``, ``"out2"``.
        ``path_length`` = ``2 * arm_length`` (length of the horizontal
        path, which by symmetry equals the vertical path).

    Raises:
        ValueError: If *waveguide_width* or *arm_length* is not positive;
            if *crossing_type* is unknown; if *center_width* is set while
            ``crossing_type="simple"``; if *center_width* <= 0; if
            *arm_length* <= *center_width* / 2 for non-simple types.

    Placement notes:
        Unlike most components (which are anchored at the **-X** end with
        ``in`` at the origin), the crossing is anchored at its **center**.
        Place by computing the center position, not the corner.

        To rotate a crossing 45 degrees (e.g. for a crossover laid out
        along diagonals), rotate **before** translating: ``.at(0, 0)
        .rotate(45).at(x, y)``.

        **Transform order matters.** ``.at(x, y).rotate(deg)`` translates
        first then rotates the *entire coordinate frame* around the origin,
        which moves the component to an unexpected position. Always
        rotate first, then translate: ``.at(0, 0).rotate(deg).at(x, y)``.

    Examples:
        Default low-loss elliptical crossing::

            >>> from rosette import Layer
            >>> from rosette.components import crossing
            >>> c = crossing(Layer(1, 0))  # elliptical by default

        Broadband MMI-style crossing for a WDM circuit::

            c = crossing(
                Layer(1, 0),
                crossing_type="mmi",
                center_width=2.0,
                arm_length=8.0,
            )

        Crossover grid -- route a waveguide across a bus bar::

            from rosette import Cell, Layer, Route, write_gds
            from rosette.components import crossing

            layer = Layer(1, 0)
            x = crossing(layer)

            # Place crossing at the intersection of the bus (y=0) and
            # the signal line (x=50).
            xi = x.at(0, 0).at(50, 0)

            # Bus runs west-to-east across the crossing (in1 -> out1).
            bus = Route.through(
                (0, 0),
                xi.port("in1"),
                xi.port("out1"),
                (100, 0),
                layer=layer, bend_radius=10.0,
            )
            # Signal drops down through the crossing (out2 -> in2).
            signal = Route.through(
                (50, 50),
                xi.port("out2"),
                xi.port("in2"),
                (50, -50),
                layer=layer, bend_radius=10.0,
            )

            design = Cell("crossover")
            design.add_ref(xi)
            design.add_ref(bus.to_cell("bus"))
            design.add_ref(signal.to_cell("signal"))
            write_gds("output/crossover.gds", design)
    """
    if waveguide_width <= 0:
        raise ValueError("Waveguide width must be positive")
    if arm_length <= 0:
        raise ValueError("Arm length must be positive")
    if crossing_type not in ("simple", "elliptical", "mmi"):
        raise ValueError(f"Unknown crossing type: {crossing_type!r}")
    if crossing_type == "simple" and center_width is not None:
        raise ValueError(
            "center_width is not applicable to crossing_type='simple' "
            "(the simple crossing has no center expansion region)"
        )

    if center_width is None:
        center_width = waveguide_width * 3 if crossing_type != "simple" else waveguide_width

    if center_width <= 0:
        raise ValueError("Center width must be positive")
    if crossing_type != "simple" and arm_length <= center_width / 2:
        raise ValueError("Arm length must be greater than half the center width")

    cell = Cell(safe_cell_name(f"crossing_{crossing_type}_w{waveguide_width:.3f}"))

    if crossing_type == "simple":
        _add_simple_crossing(cell, waveguide_width, arm_length, layer)
    elif crossing_type == "elliptical":
        _add_elliptical_crossing(cell, waveguide_width, arm_length, center_width, layer)
    else:
        _add_mmi_crossing(cell, waveguide_width, arm_length, center_width, layer)

    # Add ports
    cell.add_port(Port("in1", Point(-arm_length, 0), -Vector2.unit_x(), waveguide_width))
    cell.add_port(Port("out1", Point(arm_length, 0), Vector2.unit_x(), waveguide_width))
    cell.add_port(Port("in2", Point(0, -arm_length), -Vector2.unit_y(), waveguide_width))
    cell.add_port(Port("out2", Point(0, arm_length), Vector2.unit_y(), waveguide_width))

    # Total size for metadata
    cell.path_length = 2 * arm_length

    return cell


def _add_simple_crossing(cell: Cell, width: float, arm_length: float, layer: Layer):
    """Add simple cross-shaped crossing."""
    half_w = width / 2

    # Horizontal arm
    h_arm = Polygon(
        [
            Point(-arm_length, -half_w),
            Point(arm_length, -half_w),
            Point(arm_length, half_w),
            Point(-arm_length, half_w),
        ]
    )
    cell.add_polygon(h_arm, layer)

    # Vertical arm
    v_arm = Polygon(
        [
            Point(-half_w, -arm_length),
            Point(half_w, -arm_length),
            Point(half_w, arm_length),
            Point(-half_w, arm_length),
        ]
    )
    cell.add_polygon(v_arm, layer)


def _add_elliptical_crossing(
    cell: Cell, width: float, arm_length: float, center_width: float, layer: Layer
):
    """Add crossing with smooth elliptical expansion at center.

    Each arm is a single continuous polygon whose half-width smoothly expands
    from waveguide_width/2 at the port to center_width/2 at the origin using
    a cosine profile. The two arms overlap at the center, which is standard
    for crossing geometry on the same layer.
    """
    half_w = width / 2
    half_cw = center_width / 2
    n = 32  # points for the expansion region

    # Horizontal arm: single polygon from -arm_length to +arm_length
    upper = []
    lower = []
    for i in range(n + 1):
        # x goes from -arm_length to 0 (left half with expansion)
        x = -arm_length + arm_length * i / n
        # Cosine expansion: half_w at x=-arm_length, half_cw at x=0
        t = i / n
        hw = half_w + (half_cw - half_w) * 0.5 * (1.0 - math.cos(math.pi * t))
        upper.append(Point(x, hw))
        lower.append(Point(x, -hw))
    for i in range(1, n + 1):
        # x goes from 0 to +arm_length (right half, narrowing back)
        x = arm_length * i / n
        t = i / n
        hw = half_cw + (half_w - half_cw) * 0.5 * (1.0 - math.cos(math.pi * t))
        upper.append(Point(x, hw))
        lower.append(Point(x, -hw))
    cell.add_polygon(Polygon(upper + lower[::-1]), layer)

    # Vertical arm: same approach, rotated 90 degrees
    left = []
    right = []
    for i in range(n + 1):
        y = -arm_length + arm_length * i / n
        t = i / n
        hw = half_w + (half_cw - half_w) * 0.5 * (1.0 - math.cos(math.pi * t))
        right.append(Point(hw, y))
        left.append(Point(-hw, y))
    for i in range(1, n + 1):
        y = arm_length * i / n
        t = i / n
        hw = half_cw + (half_w - half_cw) * 0.5 * (1.0 - math.cos(math.pi * t))
        right.append(Point(hw, y))
        left.append(Point(-hw, y))
    cell.add_polygon(Polygon(right + left[::-1]), layer)


def _add_mmi_crossing(
    cell: Cell, width: float, arm_length: float, center_width: float, layer: Layer
):
    """Add MMI-style crossing (rectangular expansion)."""
    half_w = width / 2
    half_cw = center_width / 2

    # Central square
    center = Polygon(
        [
            Point(-half_cw, -half_cw),
            Point(half_cw, -half_cw),
            Point(half_cw, half_cw),
            Point(-half_cw, half_cw),
        ]
    )
    cell.add_polygon(center, layer)

    # Horizontal tapers
    h_left = Polygon(
        [
            Point(-arm_length, -half_w),
            Point(-half_cw, -half_cw),
            Point(-half_cw, half_cw),
            Point(-arm_length, half_w),
        ]
    )
    h_right = Polygon(
        [
            Point(half_cw, -half_cw),
            Point(arm_length, -half_w),
            Point(arm_length, half_w),
            Point(half_cw, half_cw),
        ]
    )
    cell.add_polygon(h_left, layer)
    cell.add_polygon(h_right, layer)

    # Vertical tapers
    v_bottom = Polygon(
        [
            Point(-half_w, -arm_length),
            Point(half_w, -arm_length),
            Point(half_cw, -half_cw),
            Point(-half_cw, -half_cw),
        ]
    )
    v_top = Polygon(
        [
            Point(-half_cw, half_cw),
            Point(half_cw, half_cw),
            Point(half_w, arm_length),
            Point(-half_w, arm_length),
        ]
    )
    cell.add_polygon(v_bottom, layer)
    cell.add_polygon(v_top, layer)
