"""Grating coupler components.

Grating couplers enable fiber-to-chip coupling through diffraction.

Ports: "opt" (optical waveguide port at origin, facing +X toward chip)
"""

import math
from typing import Literal

from rosette import Cell, Layer, Point, Polygon, Port, Vector2

__all__ = ["grating_coupler"]


def grating_coupler(
    layer: Layer,
    waveguide_width: float = 0.5,
    period: float = 0.63,
    fill_factor: float = 0.5,
    num_periods: int = 25,
    grating_type: Literal["uniform", "apodized"] = "uniform",
    focusing_angle: float | None = None,
    grating_width: float = 12.0,
    taper_length: float = 20.0,
) -> Cell:
    """Create a grating coupler for fiber-to-chip coupling.

    The grating coupler extends in the -X direction from the port.
    Port "opt" is at the origin, pointing in +X (toward the chip).

    Args:
        layer: GDS layer for the geometry
        waveguide_width: Input waveguide width in microns
        period: Grating period in microns (default: 0.63 for 1550nm Si)
        fill_factor: Fill factor 0-1 (default: 0.5)
        num_periods: Number of grating periods
        grating_type: "uniform" or "apodized" (varying fill factor)
        focusing_angle: Angle in degrees for curved teeth (None for straight)
        grating_width: Width of the grating region in microns
        taper_length: Length of the taper from waveguide to grating in microns

    Returns:
        Cell with port "opt" (optical waveguide connection)

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import grating_coupler
        >>> # Or in user projects: from components import grating_coupler
        >>> gc = grating_coupler(Layer(1, 0), waveguide_width=0.5, focusing_angle=20.0)
    """
    if waveguide_width <= 0:
        raise ValueError("Waveguide width must be positive")
    if period <= 0:
        raise ValueError("Period must be positive")
    if not 0 < fill_factor < 1:
        raise ValueError("Fill factor must be between 0 and 1")

    cell = Cell(f"gc_w{waveguide_width:.3f}_p{period:.3f}")

    # Create taper from waveguide to grating width (extends in -X direction)
    taper = _create_taper(waveguide_width, grating_width, taper_length, focusing_angle)
    cell.add_polygon(taper, layer)

    # Create grating teeth (extend in -X direction after taper)
    for i in range(num_periods):
        # Calculate fill factor for this tooth
        if grating_type == "apodized":
            # Gaussian apodization
            center = num_periods / 2.0
            sigma = num_periods / 4.0
            x = i - center
            gaussian = math.exp(-x * x / (2.0 * sigma * sigma))
            ff = fill_factor * (0.3 + 0.7 * gaussian)
        else:
            ff = fill_factor

        tooth_width = period * ff
        gap = period * (1.0 - ff)

        # Position: gap first, then tooth (in -X direction)
        x_start = -(taper_length + i * period + gap)

        if focusing_angle is not None:
            tooth_poly = _curved_tooth(tooth_width, i, focusing_angle, taper_length, period, ff)
        else:
            # Straight rectangular tooth
            half_grating = grating_width / 2.0
            tooth_poly = Polygon(
                [
                    Point(x_start, -half_grating),
                    Point(x_start - tooth_width, -half_grating),
                    Point(x_start - tooth_width, half_grating),
                    Point(x_start, half_grating),
                ]
            )

        cell.add_polygon(tooth_poly, layer)

    # Add port at waveguide end (pointing +X toward chip)
    cell.add_port(Port("opt", Point(0, 0), Vector2.unit_x(), waveguide_width))

    return cell


def _create_taper(
    width_in: float,
    width_out: float,
    length: float,
    focusing_angle: float | None,
) -> Polygon:
    """Create the taper polygon extending in -X direction."""
    half_wg = width_in / 2.0

    if focusing_angle is not None:
        # Focused GC: taper with curved outer edge (arc)
        half_angle_rad = math.radians(focusing_angle / 2.0)
        n = 64  # arc resolution

        vertices = []

        # Start at top of waveguide
        vertices.append(Point(0.0, half_wg))

        # Arc from +half_angle to -half_angle
        for i in range(n + 1):
            theta = half_angle_rad - (2.0 * half_angle_rad * i) / n
            x = -length * math.cos(theta)
            y = length * math.sin(theta)
            vertices.append(Point(x, y))

        # End at bottom of waveguide
        vertices.append(Point(0.0, -half_wg))

        return Polygon(vertices)
    else:
        # Standard GC: trapezoidal taper
        half_grating = width_out / 2.0
        return Polygon(
            [
                Point(0.0, -half_wg),
                Point(-length, -half_grating),
                Point(-length, half_grating),
                Point(0.0, half_wg),
            ]
        )


def _curved_tooth(
    tooth_width: float,
    period_index: int,
    focusing_angle_deg: float,
    taper_length: float,
    period: float,
    fill_factor: float,
) -> Polygon:
    """Create a curved (focused) grating tooth.

    Creates arc-shaped teeth centered at the focal point (origin).
    Each tooth spans the full angular range defined by the focusing angle.
    """
    n = 64  # Arc resolution
    half_angle_rad = math.radians(focusing_angle_deg / 2.0)

    # Teeth start after taper, with gap first then tooth
    gap = period * (1.0 - fill_factor)
    r_inner = taper_length + period_index * period + gap
    r_outer = r_inner + tooth_width

    vertices = []

    # Outer arc (from +half_angle to -half_angle)
    for i in range(n + 1):
        theta = half_angle_rad - (2.0 * half_angle_rad * i) / n
        x = -r_outer * math.cos(theta)
        y = r_outer * math.sin(theta)
        vertices.append(Point(x, y))

    # Inner arc (from -half_angle to +half_angle)
    for i in range(n + 1):
        theta = -half_angle_rad + (2.0 * half_angle_rad * i) / n
        x = -r_inner * math.cos(theta)
        y = r_inner * math.sin(theta)
        vertices.append(Point(x, y))

    return Polygon(vertices)
