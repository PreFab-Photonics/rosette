"""Shared taper polygon helper for photonic components.

Builds the polygon for a width-transition taper. The taper extends from
``x = 0`` (width = *width_in*) to ``x = length`` (width = *width_out*),
with the centerline on ``y = 0``. Callers translate, rotate, or mirror
the returned polygon as needed.

Supported profiles:

* ``"linear"`` -- ``w(t) = w_in + t * (w_out - w_in)``. Straight edges,
  always 4 vertices. This is the default and is what the existing
  component authors (``mmi``, straight ``grating_coupler``) use today.
* ``"parabolic"`` -- ``w(t)^2 = w_in^2 + t * (w_out^2 - w_in^2)``. This
  is the **constant-taper-angle** profile: ``dw/dx`` is chosen at each
  point so the local wedge half-angle is constant, giving the fastest
  adiabatic transition for a given loss budget. Standard for
  mode-evolution tapers at the endpoints of edge couplers, SSCs, and
  multimode interferometer ports.
* ``"exponential"`` -- ``w(t) = w_in * (w_out / w_in)^t``. Constant
  fractional rate of change; the local relative slope
  ``(1/w) * dw/dx`` is constant. Also a classic adiabatic profile,
  commonly used for spot-size converters.

For ``t = x / length`` in ``[0, 1]`` with ``t = 0`` at *width_in* and
``t = 1`` at *width_out*. The polygon is traced counter-clockwise
(bottom edge left-to-right, then top edge right-to-left).

Internal module -- component authors should import from here; end users
should not (the ROS-531 review deferred the public ``taper`` component
until there is concrete user demand).
"""

from __future__ import annotations

import math
from typing import Literal

from rosette import Point, Polygon

__all__ = ["TaperProfile", "taper_polygon"]


TaperProfile = Literal["linear", "parabolic", "exponential"]


def taper_polygon(
    width_in: float,
    width_out: float,
    length: float,
    profile: TaperProfile = "linear",
    num_segments: int = 64,
) -> Polygon:
    """Build a width-transition taper polygon.

    Canonical orientation: the taper extends from ``(0, 0)`` to
    ``(length, 0)`` along +X, centered on ``y = 0``. Width at ``x = 0``
    is *width_in*; width at ``x = length`` is *width_out*. Callers
    translate / rotate / mirror as needed.

    Args:
        width_in: Width at ``x = 0`` in microns (must be > 0).
        width_out: Width at ``x = length`` in microns (must be > 0).
        length: Taper length along +X in microns (must be > 0).
        profile: Width profile. ``"linear"`` is a straight-edged
            trapezoid with 4 vertices. ``"parabolic"`` and
            ``"exponential"`` are the constant-angle / constant-rate
            adiabatic profiles; they are sampled with *num_segments*
            segments along each edge. See the module docstring.
        num_segments: Sample count along each edge for curved
            profiles. Ignored for ``"linear"``. Must be >= 2.

    Returns:
        A ``Polygon`` traced counter-clockwise. For ``"linear"`` it has
        exactly 4 vertices; for curved profiles it has
        ``2 * (num_segments + 1)`` vertices.

    Raises:
        ValueError: If *width_in*, *width_out*, or *length* is not
            positive; if *num_segments* < 2; if *profile* is unknown;
            if *profile* is ``"exponential"`` and the widths have
            opposite signs (not possible with positive widths, but
            sanity-checked).

    Examples:
        Linear 0.5 -> 1.2 um taper over 5 um::

            >>> from rosette.components._tapers import taper_polygon
            >>> poly = taper_polygon(0.5, 1.2, 5.0)
            >>> len(poly)
            4

        Parabolic (adiabatic) 0.2 -> 1.0 um taper over 100 um, 32
        segments per edge::

            >>> poly = taper_polygon(0.2, 1.0, 100.0, "parabolic", 32)
            >>> len(poly)
            66
    """
    if width_in <= 0:
        raise ValueError(f"width_in must be > 0, got {width_in}")
    if width_out <= 0:
        raise ValueError(f"width_out must be > 0, got {width_out}")
    # Note: ``length`` must be strictly > 0. Callers with a possibly-zero
    # taper length (``mmi._create_mmi`` validates ``taper_length >= 0``)
    # must guard the call -- this helper refuses degenerate input rather
    # than silently emit a zero-area polygon.
    if length <= 0:
        raise ValueError(f"length must be > 0, got {length}")

    if profile == "linear":
        return _linear_taper(width_in, width_out, length)

    if num_segments < 2:
        raise ValueError(f"num_segments must be >= 2, got {num_segments}")

    if profile == "parabolic":
        width_fn = _parabolic_width
    elif profile == "exponential":
        width_fn = _exponential_width
    else:
        raise ValueError(
            f"Unknown profile {profile!r}; expected 'linear', 'parabolic', or 'exponential'"
        )

    # Sample widths at num_segments + 1 points from t=0 (width_in) to
    # t=1 (width_out). Build the polygon CCW: bottom edge L->R, then
    # top edge R->L.
    vertices: list[Point] = []
    n = num_segments
    # Bottom edge: i = 0..n, t = i / n.
    for i in range(n + 1):
        t = i / n
        w = width_fn(width_in, width_out, t)
        x = t * length
        vertices.append(Point(x, -0.5 * w))
    # Top edge: i = n..0 (reverse).
    for i in range(n, -1, -1):
        t = i / n
        w = width_fn(width_in, width_out, t)
        x = t * length
        vertices.append(Point(x, 0.5 * w))
    return Polygon(vertices)


def _linear_taper(width_in: float, width_out: float, length: float) -> Polygon:
    """4-vertex trapezoid: straight edges, CCW winding."""
    half_in = 0.5 * width_in
    half_out = 0.5 * width_out
    return Polygon(
        [
            Point(0.0, -half_in),
            Point(length, -half_out),
            Point(length, half_out),
            Point(0.0, half_in),
        ]
    )


def _parabolic_width(w_in: float, w_out: float, t: float) -> float:
    """Constant-taper-angle profile: ``w(t)^2 = w_in^2 + t*(w_out^2 - w_in^2)``.

    At ``t = 0``, ``w = w_in``; at ``t = 1``, ``w = w_out``. For
    ``w_in < w_out`` the width grows quickly early and slowly later
    (adiabatic widening); for ``w_in > w_out`` it shrinks slowly early
    and quickly later (adiabatic narrowing). Either direction gives a
    constant local wedge half-angle, which is why this profile
    minimises the taper length needed for a given coupling loss.
    """
    w_sq = w_in * w_in + t * (w_out * w_out - w_in * w_in)
    return math.sqrt(w_sq)


def _exponential_width(w_in: float, w_out: float, t: float) -> float:
    """Constant fractional rate: ``w(t) = w_in * (w_out / w_in)^t``.

    Equivalent to ``log(w)`` varying linearly in ``t``. At ``t = 0``,
    ``w = w_in``; at ``t = 1``, ``w = w_out``.
    """
    return w_in * (w_out / w_in) ** t
