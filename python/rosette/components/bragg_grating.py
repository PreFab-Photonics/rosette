"""Bragg grating component.

Bragg gratings are periodic refractive-index perturbations along a
waveguide that act as **wavelength-selective reflectors**: light at
the Bragg wavelength ``lambda_B = 2 * n_eff * period`` (first-order)
is reflected back toward the input, while light away from the stopband
passes through almost unperturbed. They are the workhorse in-line
element for:

* On-chip narrowband filters and DBR laser mirrors
* Quarter-wave-shifted cavities (narrow transmission peak inside the
  stopband, enabled here by the ``phase_shift`` argument)
* Wavelength references, sensors, and dispersion compensators

This component builds a **sidewall-corrugated** straight waveguide:
a single polygon whose top and bottom sidewalls step outward and
inward each period. The mean width stays at ``waveguide_width``; the
peak-to-peak sidewall modulation is ``corrugation_width``.

Geometry (viewed along +X, exaggerated)::

      _   _   _   _          _   _   _
     | |_| |_| |_| |   ...  | |_| |_| |
      _   _   _   _          _   _   _
     | |_| |_| |_| |   ...  | |_| |_| |

The grating starts and ends on a **wide half** so the transitions to
the port width are adjacent to an outward-facing corrugation edge
rather than producing an isolated thin sliver at the port.

Ports:
    - ``"in"``  at ``(0, 0)``,          facing **-X**, width = *waveguide_width*
    - ``"out"`` at ``(length, 0)``,     facing **+X**, width = *waveguide_width*

where ``length = num_periods * period + duty_cycle * period`` (the
extra ``duty_cycle * period`` is the trailing wide half) plus an
un-corrugated stub of length ``phase_shift / (2*pi) * period`` if
*phase_shift* is set.
"""

import math
from typing import Literal

from rosette import Cell, Layer, Point, Polygon, Port, Vector2
from rosette.components._curves import gaussian_envelope
from rosette.components._utils import safe_cell_name

__all__ = ["bragg_grating"]


def bragg_grating(
    layer: Layer,
    waveguide_width: float = 0.5,
    corrugation_width: float = 0.05,
    period: float = 0.32,
    num_periods: int = 200,
    duty_cycle: float = 0.5,
    apodization: Literal["uniform", "gaussian"] = "uniform",
    apodization_sigma: float = 0.25,
    phase_shift: float | None = None,
    phase_shift_position: float = 0.5,
) -> Cell:
    """Create a sidewall-corrugated Bragg grating.

    The component is a straight waveguide extending along **+X** from
    the origin. Each period consists of a **wide** half and a **narrow**
    half: the wide half has width ``waveguide_width + corrugation_width``,
    the narrow half has width ``waveguide_width - corrugation_width``,
    so the mean width is ``waveguide_width``. The wide/narrow split is
    set by *duty_cycle* (``duty_cycle = 0.5`` gives equal halves).

    The Bragg wavelength (first order) is approximately::

        lambda_B = 2 * n_eff * period

    where ``n_eff`` is the waveguide effective index. The default
    ``period = 0.32 um`` targets ~1550 nm on a typical silicon
    photonics platform (n_eff ~ 2.4).

    The grating **starts and ends on a wide half**: the main loop emits
    ``(wide, narrow)`` for each period, and one extra wide half of length
    ``duty_cycle * period`` is appended after the last period. This keeps
    the port-width transitions adjacent to outward-facing corrugation
    edges (avoiding an isolated short sliver at the output port that
    would fail a typical ``min_edge_length`` DRC rule).

    Ports:
        - ``"in"``  at ``(0, 0)``,      facing **-X**, width = *waveguide_width*
        - ``"out"`` at ``(length, 0)``, facing **+X**, width = *waveguide_width*

    where
    ``length = num_periods * period + duty_cycle * period`` when
    *phase_shift* is ``None``, or
    ``num_periods * period + duty_cycle * period + phase_shift / (2*pi) * period``
    otherwise.

    Apodization:

    * ``"uniform"`` -- every period uses the full *corrugation_width*.
    * ``"gaussian"`` -- the corrugation amplitude is modulated by a
      Gaussian envelope centered on the middle period::

          amp(i) = corrugation_width * exp(-((i - N/2) / (sigma * N))**2)

      where ``N = num_periods`` and ``sigma = apodization_sigma``.
      Gaussian apodization suppresses sidelobes in the reflection
      spectrum at the cost of a slightly wider stopband edge.

    Phase shift (optional):

    When *phase_shift* is not ``None``, an un-corrugated straight
    section of length ``phase_shift / (2*pi) * period`` is inserted at
    the period index ``floor(phase_shift_position * num_periods)``.
    The stub carries the **mean** waveguide width (``waveguide_width``),
    so there is a small sidewall step where the stub meets the adjacent
    periodic sections (``waveguide_width / 2`` vs. the neighboring
    ``half_narrow`` or ``half_wide`` sidewall). This is standard for
    quarter-wave-shifted DBRs and is what a simple rectangular-mask
    mask description produces; if your PDK requires a smooth
    transition, taper the stub externally.
    The canonical quarter-wave-shifted DBR uses ``phase_shift=math.pi``
    at ``phase_shift_position=0.5``, producing a narrow transmission
    resonance at the center of the stopband.

    Only positive *phase_shift* values are supported.

    Args:
        layer: GDS layer for the geometry.
        waveguide_width: Mean waveguide width in microns. Also the
            width of the ``in`` / ``out`` ports.
        corrugation_width: Peak-to-peak sidewall modulation in microns.
            Must be strictly less than *waveguide_width*.
        period: Grating period in microns. For first-order reflection at
            wavelength ``lambda_B``, use ``period = lambda_B / (2 * n_eff)``.
        num_periods: Number of grating periods.
        duty_cycle: Fraction of each period occupied by the **wide**
            half (0 to 1, exclusive). ``0.5`` gives equal wide/narrow
            segments.
        apodization: ``"uniform"`` (constant corrugation amplitude) or
            ``"gaussian"`` (Gaussian envelope, reduces sidelobes).
        apodization_sigma: Standard deviation of the Gaussian envelope,
            expressed as a fraction of the total grating length. Only
            used when ``apodization="gaussian"``. Smaller values give
            stronger apodization (more aggressive tapering at the ends).
        phase_shift: Optional phase shift in radians. When set, inserts
            an un-corrugated straight segment of length
            ``phase_shift / (2*pi) * period`` at *phase_shift_position*.
            Must be strictly positive when provided. Pass ``math.pi``
            for a quarter-wave-shifted DBR.
        phase_shift_position: Fractional position along the grating
            (0 to 1) where the phase-shift stub is inserted. Only used
            when *phase_shift* is not ``None``.

    Returns:
        Cell with ports ``"in"`` and ``"out"``.
        ``path_length`` = total physical length along +X
        (``num_periods * period + duty_cycle * period`` + optional
        phase-shift stub).

    Raises:
        ValueError: If *waveguide_width*, *period*, or *apodization_sigma*
            is not positive; if *corrugation_width* is not strictly
            between 0 and *waveguide_width*; if *duty_cycle* is not
            strictly between 0 and 1; if *num_periods* < 1; if
            *phase_shift_position* is not in [0, 1]; if *phase_shift*
            is provided and is not strictly positive.

    Placement notes:
        The ``"in"`` port faces **-X** and the ``"out"`` port faces
        **+X**, following the standard component convention that port
        directions point outward.  When routing *into* the ``"in"``
        port, the route must approach from the **-X** side (left).

        The grating body is centered on ``y = 0`` and extends from
        ``x = 0`` to ``x = length``. To place a Bragg grating on a
        **vertical** waveguide segment, rotate by 90 degrees **then**
        translate. Use ``.at(0, 0).rotate(90).at(x, y)``::

            "in"  -> (x, y)          facing **-Y**
            "out" -> (x, y + length) facing **+Y**

        **Transform order matters.**  ``.at(x, y).rotate(deg)`` translates
        first then rotates the *entire coordinate frame* around the origin,
        which moves the component to an unexpected position.  Always
        rotate first, then translate: ``.at(0, 0).rotate(deg).at(x, y)``.

        Unlike the ring (which composes with a bus along a route), the
        Bragg grating sits *inline* in a waveguide: route into ``"in"``,
        route out of ``"out"``. Because the mean width equals
        *waveguide_width*, the port widths match an unperturbed
        waveguide of the same width without needing a taper.

    Examples:
        Basic uniform grating (~1550 nm on silicon)::

            >>> from rosette import Layer
            >>> from rosette.components import bragg_grating
            >>> bg = bragg_grating(Layer(1, 0))
            >>> bg.port("in").width == 0.5
            True

        Apodized grating for low-sidelobe filtering::

            bg = bragg_grating(
                Layer(1, 0),
                num_periods=400,
                apodization="gaussian",
                apodization_sigma=0.2,
            )

        Quarter-wave-shifted DBR (narrow transmission resonance)::

            import math
            bg = bragg_grating(
                Layer(1, 0),
                num_periods=300,
                phase_shift=math.pi,
                phase_shift_position=0.5,
            )

        Inline between two grating couplers::

            from rosette import Cell, Layer, Route, write_gds
            from rosette.components import grating_coupler, bragg_grating

            layer = Layer(1, 0)
            gc = grating_coupler(layer)
            bg = bragg_grating(layer, num_periods=200)

            gc_in  = gc.at(0, 0).rotate(180).at(-50, 0)
            bg_in  = bg.at(0, 0)
            gc_out = gc.at(0, 0).rotate(0).at(bg.path_length + 50, 0)

            r_in = Route.through(
                gc_in.port("opt"),
                bg_in.port("in"),
                layer=layer, bend_radius=10.0,
            )
            r_out = Route.through(
                bg_in.port("out"),
                gc_out.port("opt"),
                layer=layer, bend_radius=10.0,
            )
            # ... add_ref + write_gds as usual
    """
    if waveguide_width <= 0:
        raise ValueError("Waveguide width must be positive")
    if period <= 0:
        raise ValueError("Period must be positive")
    if num_periods < 1:
        raise ValueError("Number of periods must be at least 1")
    if not 0 < duty_cycle < 1:
        raise ValueError("Duty cycle must be strictly between 0 and 1")
    if not 0 < corrugation_width < waveguide_width:
        raise ValueError("Corrugation width must be strictly between 0 and waveguide_width")
    if apodization_sigma <= 0:
        raise ValueError("Apodization sigma must be positive")
    if not 0.0 <= phase_shift_position <= 1.0:
        raise ValueError("Phase shift position must be in [0, 1]")
    if phase_shift is not None and phase_shift <= 0:
        raise ValueError("Phase shift must be strictly positive when provided")

    # Compute per-period corrugation amplitudes.
    amplitudes = _compute_amplitudes(
        num_periods=num_periods,
        corrugation_width=corrugation_width,
        apodization=apodization,
        sigma=apodization_sigma,
    )

    # Phase-shift stub insertion (un-corrugated straight section).
    if phase_shift is not None:
        stub_length = (phase_shift / (2.0 * math.pi)) * period
        stub_index = int(phase_shift_position * num_periods)
        stub_index = max(0, min(num_periods, stub_index))
    else:
        stub_length = 0.0
        stub_index = num_periods  # never reached inside the loop

    wide_frac = duty_cycle
    trailing_wide_length = wide_frac * period
    total_length = num_periods * period + trailing_wide_length + stub_length

    # Build the outline as two polylines (top sidewall, bottom sidewall)
    # then close them into a single polygon.
    # We walk left-to-right building the top sidewall; for each period we
    # emit a wide half then a narrow half (the per-period amplitude sets
    # how far the sidewall is offset from the centerline on that half).
    # After the main loop we append one extra wide half so the grating
    # terminates on a wide segment (see module docstring); otherwise the
    # polygon would close with a ``half_narrow -> half_port`` step that
    # shows up as an isolated thin sliver at the output port and fails a
    # typical ``min_edge_length`` DRC rule. The bottom sidewall mirrors
    # the top about y = 0.
    top: list[Point] = []
    bottom: list[Point] = []

    x = 0.0
    # Start flush at the input port with the port width.
    half_port = waveguide_width / 2.0
    top.append(Point(x, half_port))
    bottom.append(Point(x, -half_port))

    for i, amp in enumerate(amplitudes):
        # Insert the phase-shift stub before period `stub_index`.
        if stub_length > 0.0 and i == stub_index:
            # Un-corrugated: carry the port half-width across the stub.
            top.append(Point(x, half_port))
            bottom.append(Point(x, -half_port))
            x += stub_length
            top.append(Point(x, half_port))
            bottom.append(Point(x, -half_port))

        half_wide = (waveguide_width + amp) / 2.0
        half_narrow = (waveguide_width - amp) / 2.0

        # Wide half of this period (rectangular pulse).
        top.append(Point(x, half_wide))
        bottom.append(Point(x, -half_wide))
        x_mid = x + wide_frac * period
        top.append(Point(x_mid, half_wide))
        bottom.append(Point(x_mid, -half_wide))

        # Narrow half of this period.
        top.append(Point(x_mid, half_narrow))
        bottom.append(Point(x_mid, -half_narrow))
        x_end = x + period
        top.append(Point(x_end, half_narrow))
        bottom.append(Point(x_end, -half_narrow))

        x = x_end

    # Trailing wide half so the grating ends on an outward corrugation
    # edge rather than an isolated narrow-to-port step. Reuses the
    # amplitude of the last period so Gaussian apodization continues
    # smoothly into the terminator.
    trailing_amp = amplitudes[-1]
    trailing_half_wide = (waveguide_width + trailing_amp) / 2.0
    top.append(Point(x, trailing_half_wide))
    bottom.append(Point(x, -trailing_half_wide))
    x += trailing_wide_length
    top.append(Point(x, trailing_half_wide))
    bottom.append(Point(x, -trailing_half_wide))

    # Handle a phase-shift stub placed at the very end (stub_index == num_periods).
    if stub_length > 0.0 and stub_index == num_periods:
        top.append(Point(x, half_port))
        bottom.append(Point(x, -half_port))
        x += stub_length
        top.append(Point(x, half_port))
        bottom.append(Point(x, -half_port))

    # End flush at the output port width.
    top.append(Point(x, half_port))
    bottom.append(Point(x, -half_port))

    # Combine into a single closed polygon. Walking `top` left-to-right
    # along +y and then `bottom` right-to-left along -y gives clockwise
    # winding; that's fine for GDS (Polygon does not require CCW).
    vertices = top + bottom[::-1]

    cell = Cell(
        safe_cell_name(
            f"bg_w{waveguide_width:.3f}_p{period:.3f}_c{corrugation_width:.3f}"
            f"_n{num_periods}_{apodization[:3]}"
        )
    )
    cell.add_polygon(Polygon(vertices), layer)

    cell.add_port(Port("in", Point(0.0, 0.0), -Vector2.unit_x(), waveguide_width))
    cell.add_port(Port("out", Point(total_length, 0.0), Vector2.unit_x(), waveguide_width))

    cell.path_length = total_length

    return cell


def _compute_amplitudes(
    num_periods: int,
    corrugation_width: float,
    apodization: str,
    sigma: float,
) -> list[float]:
    """Per-period corrugation amplitude (peak-to-peak sidewall modulation)."""
    if apodization == "uniform":
        return [corrugation_width] * num_periods

    if apodization == "gaussian":
        # Envelope centered on the middle period. `sigma` is given as a
        # fraction of the total grating length; the envelope drops to 0
        # at the tails (floor=0.0), so the peak reaches `corrugation_width`
        # at the center.
        envelope = gaussian_envelope(num_periods, sigma=sigma, floor=0.0)
        return [corrugation_width * w for w in envelope]

    raise ValueError(f"Unknown apodization: {apodization!r}")
