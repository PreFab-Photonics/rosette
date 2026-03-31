"""Grating coupler components.

Grating couplers enable fiber-to-chip coupling through diffraction. The
structure extends in the **-X** direction from the waveguide port: first
a taper widens the waveguide from *waveguide_width* to the grating
aperture, then periodic teeth diffract light vertically toward the fiber.

The single port ``"opt"`` sits at the origin and faces **+X** (toward
the rest of the on-chip circuit).

Placement guide
---------------
Default orientation: port ``"opt"`` at origin facing **+X**, grating
body (taper + teeth) extending in **-X**.

To connect a GC to a component port, rotate the GC so that ``opt``
faces **toward** the component (into the port). The grating body will
then extend **away** from the component::

    # GC opt needs to face | Rotation
    # +X  (default/east)   | 0
    # -X  (west)           | 180
    # +Y  (north)          | 90
    # -Y  (south)          | -90

    # Example: place GC with opt facing -X (toward a port on the left)
    gc_inst = gc.at(0, 0).rotate(180).at(x, y)

Spacing
-------
Grating couplers couple to optical fibers, which have a standard
center-to-center pitch of **127 um** in fiber arrays. When placing
multiple GCs (e.g., for a splitter with two outputs), space them at
this pitch or wider. The grating body is typically ~12 um wide, so
placing GCs closer than ~20 um will cause physical overlap.

Use S-bend routes (via intermediate waypoints) to fan out from
closely-spaced component ports to the wider GC pitch::

    # Fan out from MMI outputs (2 um apart) to GC pitch (127 um apart)
    gc_out1 = gc.at(0, 0).rotate(180).at(x, -63.5)
    gc_out2 = gc.at(0, 0).rotate(180).at(x, +63.5)
"""

import math
from typing import Literal

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._utils import safe_cell_name

__all__ = ["grating_coupler"]


def grating_coupler(
    layer: Layer,
    waveguide_width: float = 0.5,
    period: float = 0.63,
    fill_factor: float = 0.5,
    num_periods: int = 25,
    grating_type: Literal["uniform", "apodized"] = "uniform",
    focusing_angle: float | None = 20.0,
    grating_width: float = 12.0,
    taper_length: float = 20.0,
) -> Cell:
    """Create a grating coupler for fiber-to-chip coupling.

    The component extends in the **-X** direction from the origin:
    a taper fans out from *waveguide_width* to the grating aperture,
    followed by *num_periods* grating teeth. Total extent in -X is
    approximately ``taper_length + num_periods * period``.

    Port:
        - ``"opt"`` at ``(0, 0)``, facing **+X**, width = *waveguide_width*

    Tooth styles:

    * **Straight** (``focusing_angle=None``): Rectangular teeth spanning
      the full *grating_width*. The taper is a simple trapezoid from
      *waveguide_width* to *grating_width*.
    * **Focused / curved** (``focusing_angle=<degrees>``): Arc-shaped
      teeth whose curvature is centered at the focal point (the origin).
      *focusing_angle* is the **full** angular aperture of the fan; each
      tooth spans +-half that angle. The *grating_width* parameter is
      ignored when *focusing_angle* is set.

    Apodization:

    * ``"uniform"`` -- All teeth have the same *fill_factor*.
    * ``"apodized"`` -- Fill factor is modulated by a Gaussian envelope
      centered on the middle tooth, tapering to ~30% of *fill_factor*
      at the edges. This reduces back-reflections and improves the
      mode overlap with a Gaussian fiber mode.

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Input waveguide width in microns.
        period: Grating period in microns. The default (0.63) targets
            ~1550 nm wavelength on a typical silicon photonics platform.
        fill_factor: Fraction of each period occupied by the tooth
            (0 to 1, exclusive).
        num_periods: Number of grating periods.
        grating_type: ``"uniform"`` or ``"apodized"`` (Gaussian
            modulation of fill factor).
        focusing_angle: Full angular aperture of the curved grating
            fan in degrees (default: 20.0). Set to ``None`` for straight
            (rectangular) teeth.
        grating_width: Width of the grating region in microns (only
            used when *focusing_angle* is ``None``).
        taper_length: Length of the taper from waveguide to grating
            aperture in microns.

    Returns:
        Cell with port ``"opt"``.
        ``path_length`` = *taper_length*.

    Raises:
        ValueError: If *waveguide_width*, *period*, *taper_length*, or
            *grating_width* is not positive; if *fill_factor* is not
            strictly between 0 and 1; if *num_periods* < 1.

    Example:
        >>> from rosette import Layer
        >>> from rosette.components import grating_coupler
        >>> gc = grating_coupler(Layer(1, 0))  # focused by default
    """
    if waveguide_width <= 0:
        raise ValueError("Waveguide width must be positive")
    if period <= 0:
        raise ValueError("Period must be positive")
    if not 0 < fill_factor < 1:
        raise ValueError("Fill factor must be between 0 and 1")
    if taper_length <= 0:
        raise ValueError("Taper length must be positive")
    if grating_width <= 0:
        raise ValueError("Grating width must be positive")
    if num_periods < 1:
        raise ValueError("Number of periods must be at least 1")

    cell = Cell(safe_cell_name(f"gc_w{waveguide_width:.3f}_p{period:.3f}"))

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

    cell.path_length = taper_length

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

        # Start at bottom of waveguide (CCW winding)
        vertices.append(Point(0.0, -half_wg))

        # Arc from -half_angle to +half_angle
        for i in range(n + 1):
            theta = -half_angle_rad + (2.0 * half_angle_rad * i) / n
            x = -length * math.cos(theta)
            y = length * math.sin(theta)
            vertices.append(Point(x, y))

        # End at top of waveguide
        vertices.append(Point(0.0, half_wg))

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
