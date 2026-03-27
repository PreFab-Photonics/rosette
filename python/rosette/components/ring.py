"""Ring resonator components.

Ring resonators are key building blocks for filters, modulators, and
sensors. Two coupling configurations are supported:

All-pass (single bus, 2 ports)::

    in ────[ bus waveguide ]──── out       y = 0
                 │     │
                [  ring  ]                 ring above bus

Add-drop (two buses, 4 ports)::

       in ────[  top bus   ]──── through   y = +(R + w + gap)
                │         │
               [   ring    ]               ring at y = 0
                │         │
     drop ────[ bottom bus ]──── add       y = -(R + w + gap)

Set ``coupling_length > 0`` to create a racetrack resonator (ring with
straight coupling sections).
"""

import math
from typing import Literal

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._utils import safe_cell_name

__all__ = ["ring"]


def ring(
    layer: Layer,
    waveguide_width: float = 0.5,
    radius: float = 10.0,
    gap: float = 0.2,
    coupling: Literal["allpass", "adddrop"] = "allpass",
    coupling_length: float = 0.0,
    bus_extension: float = 5.0,
    num_segments: int = 128,
) -> Cell:
    """Create a ring resonator.

    Geometry -- **allpass**: The bus waveguide is centered at ``y = 0``
    and the ring sits above it. Bus length is
    ``2 * bus_extension + coupling_length``.

    Geometry -- **adddrop**: The ring is centered at ``y = 0``. The top
    bus (in/through) is at ``y = radius + waveguide_width + gap`` and
    the bottom bus (drop/add) is at the negative of that.

    The *gap* parameter is the **edge-to-edge** distance between the
    nearest physical surfaces of the ring waveguide and the bus
    waveguide.

    Ports (allpass):
        - ``"in"``  at ``(0, 0)``, facing **-X**
        - ``"out"`` at ``(bus_length, 0)``, facing **+X**

    Ports (adddrop), where ``bus_y = radius + waveguide_width + gap``:
        - ``"in"``      at ``(0, +bus_y)``, facing **-X**
        - ``"through"`` at ``(bus_length, +bus_y)``, facing **+X**
        - ``"drop"``    at ``(0, -bus_y)``, facing **-X**
        - ``"add"``     at ``(bus_length, -bus_y)``, facing **+X**

    All port widths equal *waveguide_width*.

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Waveguide width in microns.
        radius: Ring centerline radius in microns.
        gap: Coupling gap between ring and bus in microns (edge-to-edge).
        coupling: ``"allpass"`` (single bus, 2 ports) or ``"adddrop"``
            (two buses, 4 ports).
        coupling_length: Length of straight coupling sections in microns.
            Set to ``0`` for a circular ring, or ``> 0`` for a racetrack.
        bus_extension: How far each bus waveguide extends beyond the
            ring/racetrack edges in microns.
        num_segments: Number of polygon segments for the ring arc.

    Returns:
        Cell with ports listed above.
        ``path_length`` = ring circumference
        (``2 * pi * radius + 2 * coupling_length``).

    Raises:
        ValueError: If *radius*, *waveguide_width*, or *gap* is not
            positive; if *radius* <= *waveguide_width* / 2; if
            *coupling_length* < 0; if *num_segments* < 3.

    Placement notes:
        The bus waveguide runs along **+X** with ``bus_length =
        2 * bus_extension + coupling_length`` (default 10 um).

        The ``"in"`` port faces **-X** and the ``"out"`` port faces **+X**,
        following the standard component convention that port directions
        point outward.  When routing *into* the ``"in"`` port, the route
        must approach from the **-X** side (left).

        To place the ring on a **vertical** waveguide segment, rotate by
        90 degrees **then** translate.  Use
        ``.at(0, 0).rotate(90).at(x, y)``::

            "in"  -> (x, y)     facing **-Y**
            "out" -> (x, y+10)  facing **+Y**     (for default bus_length=10)

        The ring body moves to the **+X** side (right) of the bus.

        **Transform order matters.**  ``.at(x, y).rotate(deg)`` translates
        first then rotates the *entire coordinate frame* around the origin,
        which moves the component to an unexpected position.  Always
        rotate first, then translate: ``.at(0, 0).rotate(deg).at(x, y)``.

    Example -- standalone::

        >>> from rosette import Layer
        >>> from rosette.components import ring
        >>> r = ring(Layer(1, 0), radius=10.0)
        >>> r_ad = ring(Layer(1, 0), radius=10.0, coupling="adddrop")

    Example -- ring inline on a GC loopback route::

        from rosette import Cell, Layer, Route, write_gds
        from rosette.components import grating_coupler, ring

        layer = Layer(1, 0)
        gc = grating_coupler(layer, focusing_angle=20.0)
        ring_cell = ring(layer, radius=10.0, gap=0.2)

        gc_in  = gc.at(0, 0)
        gc_out = gc.at(0, 127)

        # Rotate ring 90 deg then place on the vertical segment
        ring_inst = ring_cell.at(0, 0).rotate(90).at(25, 58.5)

        ring_in  = ring_inst.port("in")   # (25, 58.5) facing -Y
        ring_out = ring_inst.port("out")  # (25, 68.5) facing +Y

        # L-bend from gc_in to ring, then L-bend from ring to gc_out
        r1 = Route.through(
            gc_in.port("opt"),
            (25, 0),           # horizontal right, then vertical up
            ring_in,
            layer=layer, bend_radius=10.0,
        )
        r2 = Route.through(
            ring_out,
            (25, 127),         # vertical up, then horizontal left
            gc_out.port("opt"),
            layer=layer, bend_radius=10.0,
        )

        design = Cell("loopback_ring")
        design.add_ref(gc_in)
        design.add_ref(gc_out)
        design.add_ref(ring_inst)
        design.add_ref(r1.to_cell("r1"))
        design.add_ref(r2.to_cell("r2"))
        write_gds("output/loopback_ring.gds", design)
    """
    if radius <= 0:
        raise ValueError("Ring radius must be positive")
    if waveguide_width <= 0:
        raise ValueError("Ring width must be positive")
    if radius <= waveguide_width / 2:
        raise ValueError("Radius must be greater than half the waveguide width")
    if gap <= 0:
        raise ValueError("Gap must be positive")
    if coupling_length < 0:
        raise ValueError("Coupling length must be non-negative")
    if num_segments < 3:
        raise ValueError("Number of segments must be at least 3")

    is_adddrop = coupling == "adddrop"

    cell = Cell(safe_cell_name(f"ring_r{radius:.1f}_w{waveguide_width:.3f}_g{gap:.2f}"))

    # Ring center position
    # Bus top edge is at waveguide_width/2, ring inner edge should be gap above that
    # Ring inner edge = ring_center_y - radius - waveguide_width/2
    # So: ring_center_y - radius - waveguide_width/2 = waveguide_width/2 + gap
    # Therefore: ring_center_y = radius + waveguide_width + gap
    ring_center_y = radius + waveguide_width + gap

    # Generate ring polygon
    ring_poly = _ring_polygon(
        center_x=bus_extension + coupling_length / 2,
        center_y=ring_center_y if not is_adddrop else 0.0,
        radius=radius,
        width=waveguide_width,
        coupling_length=coupling_length,
        num_segments=num_segments,
    )
    cell.add_polygon(ring_poly, layer)

    # Total bus length
    bus_length = 2 * bus_extension + coupling_length

    # Add bus waveguide(s)
    if is_adddrop:
        # Top bus (through) - ring outer edge is at radius + waveguide_width/2
        # Bus bottom edge should be gap above that
        # Bus center = ring_outer + gap + waveguide_width/2 = radius + waveguide_width/2 + gap + waveguide_width/2
        top_y = radius + waveguide_width + gap
        cell.add_polygon(_bus_polygon(0, top_y, bus_length, waveguide_width), layer)
        # Bottom bus (drop) - symmetric
        bottom_y = -(radius + waveguide_width + gap)
        cell.add_polygon(_bus_polygon(0, bottom_y, bus_length, waveguide_width), layer)
    else:
        # Single bus below ring
        cell.add_polygon(_bus_polygon(0, 0, bus_length, waveguide_width), layer)

    # Add ports
    if is_adddrop:
        top_y = radius + waveguide_width + gap
        bottom_y = -(radius + waveguide_width + gap)
        cell.add_port(Port("in", Point(0.0, top_y), -Vector2.unit_x(), waveguide_width))
        cell.add_port(Port("through", Point(bus_length, top_y), Vector2.unit_x(), waveguide_width))
        cell.add_port(Port("add", Point(bus_length, bottom_y), Vector2.unit_x(), waveguide_width))
        cell.add_port(Port("drop", Point(0.0, bottom_y), -Vector2.unit_x(), waveguide_width))
    else:
        cell.add_port(Port("in", Point(0.0, 0.0), -Vector2.unit_x(), waveguide_width))
        cell.add_port(Port("out", Point(bus_length, 0.0), Vector2.unit_x(), waveguide_width))

    # Circumference for metadata
    circumference = 2 * math.pi * radius + 2 * coupling_length
    cell.path_length = circumference

    return cell


def _ring_polygon(
    center_x: float,
    center_y: float,
    radius: float,
    width: float,
    coupling_length: float,
    num_segments: int,
) -> Polygon:
    """Generate ring or racetrack polygon."""
    half_width = width / 2
    outer_r = radius + half_width
    inner_r = radius - half_width

    if coupling_length <= 0:
        # Annular polygon using a "cut" at angle 0.
        # Outer ring CCW, bridge to inner at angle 0, inner ring CW, close.
        points = []

        # Outer ring (counter-clockwise, from angle 0 back to angle 0)
        # Use num_segments+1 points so the last point coincides with the
        # first, closing the outer contour at the radial seam.
        for i in range(num_segments + 1):
            angle = 2 * math.pi * i / num_segments
            points.append(
                Point(
                    center_x + outer_r * math.cos(angle),
                    center_y + outer_r * math.sin(angle),
                )
            )

        # Bridge from outer to inner at angle 0 (radial cut)
        points.append(Point(center_x + inner_r, center_y))

        # Inner ring (clockwise, from just before angle 0 back to angle 0)
        for i in range(num_segments - 1, 0, -1):
            angle = 2 * math.pi * i / num_segments
            points.append(
                Point(
                    center_x + inner_r * math.cos(angle),
                    center_y + inner_r * math.sin(angle),
                )
            )

        return Polygon(points)
    else:
        # Racetrack: two semicircles connected by straights.
        # Annular polygon with a radial cut at the bottom-left.
        # Outer path CCW, bridge to inner, inner path CW, close.
        half_cl = coupling_length / 2
        half_segs = num_segments // 2
        points = []

        # --- Outer path (CCW): bottom-left -> bottom-right -> right arc -> top-right -> top-left -> left arc -> back ---

        # Bottom straight (left to right)
        points.append(Point(center_x - half_cl, center_y - outer_r))
        points.append(Point(center_x + half_cl, center_y - outer_r))

        # Right semicircle (outer, -pi/2 to +pi/2)
        for i in range(1, half_segs + 1):
            angle = -math.pi / 2 + math.pi * i / half_segs
            points.append(
                Point(
                    center_x + half_cl + outer_r * math.cos(angle),
                    center_y + outer_r * math.sin(angle),
                )
            )

        # Top straight (right to left)
        points.append(Point(center_x - half_cl, center_y + outer_r))

        # Left semicircle (outer, +pi/2 to +3pi/2, excluding last point
        # which coincides with the starting bottom-left point)
        for i in range(1, half_segs):
            angle = math.pi / 2 + math.pi * i / half_segs
            points.append(
                Point(
                    center_x - half_cl + outer_r * math.cos(angle),
                    center_y + outer_r * math.sin(angle),
                )
            )

        # --- Bridge from outer to inner at bottom-left (radial cut) ---
        points.append(Point(center_x - half_cl, center_y - inner_r))

        # --- Inner path (CW): bottom-left -> left arc (reversed) -> top-left -> top-right -> right arc (reversed) -> bottom-right ---

        # Left semicircle (inner, reversed: +3pi/2 to +pi/2)
        for i in range(half_segs - 1, -1, -1):
            angle = math.pi / 2 + math.pi * i / half_segs
            points.append(
                Point(
                    center_x - half_cl + inner_r * math.cos(angle),
                    center_y + inner_r * math.sin(angle),
                )
            )

        # Top straight inner (left to right)
        points.append(Point(center_x + half_cl, center_y + inner_r))

        # Right semicircle (inner, reversed: +pi/2 to -pi/2)
        for i in range(half_segs - 1, -1, -1):
            angle = -math.pi / 2 + math.pi * i / half_segs
            points.append(
                Point(
                    center_x + half_cl + inner_r * math.cos(angle),
                    center_y + inner_r * math.sin(angle),
                )
            )

        # Bottom straight inner (right to left): the right semicircle
        # already ended at bottom-right inner, so we only need bottom-left
        # inner. This point coincides with the bridge point above, creating
        # a zero-length edge at the annular cut -- standard for GDS.
        points.append(Point(center_x - half_cl, center_y - inner_r))

        return Polygon(points)


def _bus_polygon(x_start: float, y_center: float, length: float, width: float) -> Polygon:
    """Generate a straight bus waveguide polygon."""
    half_w = width / 2
    return Polygon(
        [
            Point(x_start, y_center - half_w),
            Point(x_start + length, y_center - half_w),
            Point(x_start + length, y_center + half_w),
            Point(x_start, y_center + half_w),
        ]
    )
