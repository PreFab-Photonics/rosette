"""Ring resonator components.

Ring resonators are key building blocks for filters, modulators, and sensors.

All-pass configuration:
    in ----[bus waveguide]---- out
              |       |
             [  ring  ]

Add-drop configuration:
       in ----[     ]---- through
              [ring ]
     drop ----[     ]---- add
"""

import math
from typing import Literal

from rosette import Cell, Layer, Point, Polygon, Port, Vector2

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

    Args:
        layer: GDS layer for the geometry
        waveguide_width: Waveguide width in microns
        radius: Ring radius (center of waveguide) in microns
        gap: Coupling gap between ring and bus in microns
        coupling: "allpass" (single bus) or "adddrop" (two buses)
        coupling_length: Length of straight coupling sections for racetrack (0 = circular)
        bus_extension: Bus waveguide extension beyond the ring in microns
        num_segments: Number of polygon segments for ring

    Returns:
        Cell with ports based on coupling type:
        - allpass: "in" (left, facing -X), "out" (right, facing +X)
        - adddrop:
          - "in" (top-left, facing -X), "through" (top-right, facing +X)
          - "drop" (bottom-left, facing -X), "add" (bottom-right, facing +X)

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import ring
        >>> # Or in user projects: from components import ring
        >>> r = ring(Layer(1, 0), radius=10.0)  # All-pass ring
        >>> r_ad = ring(Layer(1, 0), radius=10.0, coupling="adddrop")  # Add-drop
    """
    if radius <= 0:
        raise ValueError("Ring radius must be positive")
    if waveguide_width <= 0:
        raise ValueError("Ring width must be positive")
    if gap <= 0:
        raise ValueError("Gap must be positive")

    is_adddrop = coupling == "adddrop"

    cell = Cell(f"ring_r{radius:.1f}_w{waveguide_width:.3f}_g{gap:.2f}")

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
        # Simple circular ring - create proper annular polygon
        # Trace: outer ring clockwise, then inner ring counter-clockwise
        points = []

        # Outer ring (counter-clockwise)
        for i in range(num_segments):
            angle = 2 * math.pi * i / num_segments
            points.append(
                Point(
                    center_x + outer_r * math.cos(angle),
                    center_y + outer_r * math.sin(angle),
                )
            )
        # Close outer ring back to start
        points.append(points[0])

        # Connect to inner ring at the same angle (0 radians)
        inner_start = Point(center_x + inner_r, center_y)
        points.append(inner_start)

        # Inner ring (clockwise, so reversed direction)
        for i in range(num_segments, 0, -1):
            angle = 2 * math.pi * i / num_segments
            points.append(
                Point(
                    center_x + inner_r * math.cos(angle),
                    center_y + inner_r * math.sin(angle),
                )
            )

        return Polygon(points)
    else:
        # Racetrack: two semicircles connected by straights
        # Create proper closed annular polygon
        half_cl = coupling_length / 2
        half_segs = num_segments // 2
        points = []

        # Outer path (counter-clockwise): bottom-right -> right arc -> top -> left arc -> bottom-left
        # Start at bottom-right
        for i in range(half_segs + 1):
            angle = -math.pi / 2 + math.pi * i / half_segs
            points.append(
                Point(
                    center_x + half_cl + outer_r * math.cos(angle),
                    center_y + outer_r * math.sin(angle),
                )
            )

        # Left semicircle (outer)
        for i in range(half_segs + 1):
            angle = math.pi / 2 + math.pi * i / half_segs
            points.append(
                Point(
                    center_x - half_cl + outer_r * math.cos(angle),
                    center_y + outer_r * math.sin(angle),
                )
            )

        # Connect to inner path at bottom-right
        points.append(Point(center_x + half_cl, center_y - inner_r))

        # Inner path (clockwise): bottom-right -> right arc (reversed) -> top -> left arc (reversed) -> bottom-left
        # Right semicircle (inner, reversed)
        for i in range(half_segs, -1, -1):
            angle = -math.pi / 2 + math.pi * i / half_segs
            points.append(
                Point(
                    center_x + half_cl + inner_r * math.cos(angle),
                    center_y + inner_r * math.sin(angle),
                )
            )

        # Left semicircle (inner, reversed)
        for i in range(half_segs, -1, -1):
            angle = math.pi / 2 + math.pi * i / half_segs
            points.append(
                Point(
                    center_x - half_cl + inner_r * math.cos(angle),
                    center_y + inner_r * math.sin(angle),
                )
            )

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
