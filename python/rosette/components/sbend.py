"""S-bend components for lateral offset transitions.

An S-bend shifts the waveguide laterally while keeping the input and output
directions parallel (+X). Three curve profiles are available: cosine
(default, smooth), circular (two arcs), and Euler (clothoid, lowest loss).

Geometry (viewed along +X, positive offset example)::

                                                 ___________
                                                /          out (+X)
                                              _/
                                             /
                                            /
                                           _/
                                          /
    in (-X) __________________________ _/
    (0, 0)              ├── length ──┤    (length, offset)

Ports:
    - ``"in"``  at ``(0, 0)``,              facing **-X**, width = *waveguide_width*
    - ``"out"`` at ``(length, offset)``,    facing **+X**, width = *waveguide_width*

Choosing a bend type
--------------------
All three profiles give the same endpoint geometry; they differ in how
curvature is distributed along the path, which determines mode-matching
loss and radiation:

* ``"cosine"`` -- Smooth raised-cosine. Zero curvature at both endpoints,
  so it mates cleanly to straight waveguides. Good default.
* ``"circular"`` -- Two constant-radius arcs. Easy to reason about in
  terms of minimum bend radius, but curvature is discontinuous at the
  midpoint and nonzero at the ports.
* ``"euler"`` -- Two clothoid (Cornu) segments. Curvature varies linearly
  with arc length, peaking at the midpoint and zero at the ports. Lowest
  optical loss of the three; preferred for tight or lossy processes.
"""

import math
from typing import Literal

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._curves import (
    circular_sbend_point,
    circular_sbend_tangent,
    cosine_sbend_point,
    cosine_sbend_tangent,
    estimate_sbend_path_length,
    euler_sbend_point,
    euler_sbend_tangent,
)
from rosette.components._utils import safe_cell_name

__all__ = ["sbend"]


def sbend(
    layer: Layer,
    waveguide_width: float = 0.5,
    length: float = 20.0,
    offset: float = 5.0,
    bend_type: Literal["cosine", "circular", "euler"] = "cosine",
    num_segments: int | None = None,
) -> Cell:
    """Create an S-bend for lateral waveguide offset.

    Shifts the waveguide by *offset* microns in Y over a horizontal
    span of *length* microns, while keeping input and output directions
    both along +X. Useful for connecting two ports that are at the same
    x-coordinate but different y-coordinates (e.g. fanning out from
    tightly-packed component ports to fiber-array pitch), or for
    creating lateral transitions inside a route.

    When ``offset=0`` the result is a straight waveguide of the given
    *length* (degenerate case). In this case *bend_type* and *num_segments*
    have no geometric meaning and are ignored — the returned cell is a
    single rectangular polygon with ``path_length = length``.

    Ports:
        - ``"in"``  at ``(0, 0)``,            facing **-X**, width = *waveguide_width*
        - ``"out"`` at ``(length, offset)``,  facing **+X**, width = *waveguide_width*

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Waveguide width in microns.
        length: Horizontal length of the S-bend in microns. Must be > 0.
        offset: Vertical offset in microns. Positive = up (+Y),
            negative = down (-Y). May be zero (degenerate straight).
        bend_type: Curve profile:

            - ``"cosine"`` -- Smooth raised-cosine interpolation (default).
              Zero curvature at both endpoints, making it easy to connect
              to straight waveguides.
            - ``"circular"`` -- Two circular arcs joined at the midpoint.
              Constant bend radius per half, but curvature is discontinuous
              at the junction.
            - ``"euler"`` -- Two clothoid (Cornu-spiral) segments. Curvature
              varies linearly with arc length, giving the lowest optical
              loss of the three options.
        num_segments: Number of polygon segments. ``None`` (default)
            auto-selects based on the aspect ratio ``|offset| / length``
            (roughly ``32 + 32 * |offset|/length``). Increase for smoother
            polygons on high-aspect-ratio bends; decrease to reduce file
            size when many S-bends are stamped.

    Returns:
        Cell with ports ``"in"`` and ``"out"``.
        ``path_length`` = numerically integrated arc length of the
        centerline (falls back to *length* exactly when ``offset == 0``).

    Raises:
        ValueError: If *length* or *waveguide_width* is not positive.

    Placement notes:
        The ``"in"`` port faces **-X** and the ``"out"`` port faces **+X**,
        following the standard component convention that port directions
        point outward. When routing *into* the ``"in"`` port, the route
        must approach from the **-X** side (left).

        To place an S-bend on a **vertical** waveguide segment (shifting
        in X instead of Y), rotate by 90 degrees **then** translate. Use
        ``.at(0, 0).rotate(90).at(x, y)``::

            "in"  -> (x, y)                   facing **-Y**
            "out" -> (x - offset, y + length) facing **+Y**

        **Transform order matters.** ``.at(x, y).rotate(deg)`` translates
        first then rotates the *entire coordinate frame* around the origin,
        which moves the component to an unexpected position. Always
        rotate first, then translate: ``.at(0, 0).rotate(deg).at(x, y)``.

        For most routing jobs between arbitrary ports, prefer ``Route``:
        it inserts S-bend-like transitions automatically and handles
        width tapers. Use the explicit ``sbend`` component when you need
        a specific named cell, or when the transition is part of a
        hierarchical block that will be stamped many times.

    Examples:
        Standalone cosine S-bend::

            >>> from rosette import Layer
            >>> from rosette.components import sbend
            >>> s = sbend(Layer(1, 0), length=20.0, offset=5.0)
            >>> s.port("out").position.y
            5.0

        Euler S-bend for low-loss fan-out::

            s = sbend(
                Layer(1, 0),
                length=30.0,
                offset=10.0,
                bend_type="euler",
            )

        Fan out from two closely-spaced MMI outputs to fiber-array
        pitch (127 um) and land on two grating couplers::

            from rosette import Cell, Layer, write_gds
            from rosette.components import grating_coupler, mmi_1x2, sbend

            layer = Layer(1, 0)
            splitter = mmi_1x2(layer)
            gc = grating_coupler(layer)

            # Splitter outputs sit at y = +/- 1 um (port_separation=2).
            # Each S-bend shifts one arm by +/-62.5 um so the S-bend outputs
            # land at y = +/- 63.5 um -- the 127 um fiber-array pitch.
            sp = splitter.at(0, 0)
            fan_up   = sbend(layer, length=80.0, offset=+62.5)
            fan_down = sbend(layer, length=80.0, offset=-62.5)

            up_inst   = fan_up.at(sp.port("out2").position.x,
                                  sp.port("out2").position.y)
            down_inst = fan_down.at(sp.port("out1").position.x,
                                    sp.port("out1").position.y)

            # Grating couplers: opt port faces +X and sits at the cell
            # origin, so place each GC flush against the S-bend output to
            # butt-connect -- no Route needed.
            gc_up   = gc.at(up_inst.port("out").position.x,
                            up_inst.port("out").position.y)
            gc_down = gc.at(down_inst.port("out").position.x,
                            down_inst.port("out").position.y)

            design = Cell("fanout")
            for inst in (sp, up_inst, down_inst, gc_up, gc_down):
                design.add_ref(inst)
            write_gds("output/fanout.gds", design)
    """
    if length <= 0:
        raise ValueError("S-bend length must be positive")
    if waveguide_width <= 0:
        raise ValueError("Waveguide width must be positive")

    # Degenerate case: zero offset is a plain straight waveguide. Skip the
    # centerline/tangent machinery so the result is a single rectangle and
    # the cell name reflects the straight geometry.
    if offset == 0:
        half_width = waveguide_width / 2.0
        cell = Cell(safe_cell_name(f"sb_straight_l{length:.2f}_w{waveguide_width:.3f}"))
        cell.add_polygon(
            Polygon(
                [
                    Point(0.0, -half_width),
                    Point(length, -half_width),
                    Point(length, half_width),
                    Point(0.0, half_width),
                ]
            ),
            layer,
        )
        cell.add_port(Port("in", Point(0.0, 0.0), -Vector2.unit_x(), waveguide_width))
        cell.add_port(Port("out", Point(length, 0.0), Vector2.unit_x(), waveguide_width))
        cell.path_length = length
        return cell

    # Default segments based on geometry
    if num_segments is None:
        aspect = abs(offset) / length
        num_segments = 32 + int(aspect * 32)

    # Select curve functions based on bend type
    if bend_type == "circular":
        point_fn = circular_sbend_point
        tangent_fn = circular_sbend_tangent
    elif bend_type == "euler":
        point_fn = euler_sbend_point
        tangent_fn = euler_sbend_tangent
    else:  # cosine (default)
        point_fn = cosine_sbend_point
        tangent_fn = cosine_sbend_tangent

    # Generate centerline and build polygon
    half_width = waveguide_width / 2.0
    outer_points = []
    inner_points = []

    for i in range(num_segments + 1):
        t = i / num_segments

        # Get centerline point and tangent
        cx, cy = point_fn(t, length, offset)
        tx, ty = tangent_fn(t, length, offset)

        # Normalize tangent
        tlen = math.sqrt(tx * tx + ty * ty)
        if tlen > 1e-10:
            tx, ty = tx / tlen, ty / tlen

        # Normal (perpendicular)
        nx, ny = -ty, tx

        outer_points.append(Point(cx + nx * half_width, cy + ny * half_width))
        inner_points.append(Point(cx - nx * half_width, cy - ny * half_width))

    # Combine into polygon
    vertices = outer_points + inner_points[::-1]

    # Cell naming with type suffix (abbreviated for GDS 32-char limit)
    type_suffix = "" if bend_type == "cosine" else f"_{bend_type[:3]}"
    cell = Cell(
        safe_cell_name(f"sb{type_suffix}_l{length:.2f}_o{offset:.2f}_w{waveguide_width:.3f}")
    )
    cell.add_polygon(Polygon(vertices), layer)

    # Add ports
    cell.add_port(Port("in", Point(0.0, 0.0), -Vector2.unit_x(), waveguide_width))
    cell.add_port(Port("out", Point(length, offset), Vector2.unit_x(), waveguide_width))

    # Path length
    cell.path_length = estimate_sbend_path_length(length, offset, bend_type, num_segments)

    return cell
