"""Shared curve utilities for photonic components.

This module provides common curve calculations used by multiple components,
including S-bends (cosine, circular, Euler) and related geometry.

These are internal utilities - component authors should import from here,
but end users should use the component functions directly.
"""

import math

from rosette import fresnel_c, fresnel_s

__all__ = [
    "circular_sbend_point",
    "circular_sbend_tangent",
    "cosine_sbend_point",
    "cosine_sbend_tangent",
    "estimate_sbend_path_length",
    "euler_sbend_point",
    "euler_sbend_tangent",
    "gaussian_envelope",
]


def gaussian_envelope(n: int, sigma: float, floor: float = 0.0) -> list[float]:
    """Return ``n`` samples of a Gaussian envelope centered at ``(n-1)/2``.

    The envelope has the form::

        w[i] = floor + (1 - floor) * exp(-(i - center)^2 / (2 * s^2))

    where ``center = (n - 1) / 2`` and ``s = sigma * n`` (so ``sigma`` is a
    fraction of the total length in samples, matching the bragg_grating
    convention). The underlying Gaussian peaks at ``1.0`` at the center
    and approaches ``floor`` at the tails; for odd ``n`` the central
    sample lands exactly on the peak, for even ``n`` the two central
    samples straddle it symmetrically and both fall slightly below ``1.0``.

    Args:
        n: Number of samples (must be >= 1).
        sigma: Standard deviation as a fraction of the total length
            (must be > 0). Smaller values give stronger apodization.
        floor: Pedestal added to the Gaussian tails, in [0, 1]. Use
            ``0.0`` for a pure Gaussian; use a positive value to keep a
            nonzero floor at the edges (e.g. ``0.3`` keeps the envelope
            at roughly 30% or more across the array).

    Returns:
        List of ``n`` floats, each in ``[floor, 1.0]``. The tail values
        approach but do not in general equal ``floor``.

    Raises:
        ValueError: If ``n < 1``, ``sigma <= 0``, or ``floor`` is not in
            ``[0, 1]``.
    """
    if n < 1:
        raise ValueError(f"n must be >= 1, got {n}")
    if sigma <= 0:
        raise ValueError(f"sigma must be > 0, got {sigma}")
    if not 0.0 <= floor <= 1.0:
        raise ValueError(f"floor must be in [0, 1], got {floor}")

    center = (n - 1) / 2.0
    s = sigma * n
    amplitude = 1.0 - floor
    return [floor + amplitude * math.exp(-((i - center) ** 2) / (2.0 * s * s)) for i in range(n)]


def cosine_sbend_point(t: float, length: float, offset: float) -> tuple[float, float]:
    """Cosine S-bend centerline point at parameter t in [0, 1].

    The cosine S-bend provides smooth transitions with zero curvature at endpoints.

    Args:
        t: Parameter from 0 (start) to 1 (end)
        length: Horizontal length of the S-bend
        offset: Vertical offset (positive = up)

    Returns:
        (x, y) position on centerline
    """
    x = t * length
    y = (offset / 2.0) * (1.0 - math.cos(math.pi * t))
    return x, y


def cosine_sbend_tangent(t: float, length: float, offset: float) -> tuple[float, float]:
    """Cosine S-bend tangent direction at parameter t.

    Args:
        t: Parameter from 0 to 1
        length: Horizontal length
        offset: Vertical offset

    Returns:
        (dx, dy) tangent vector (not normalized)
    """
    dx = length
    dy = (offset * math.pi / 2.0) * math.sin(math.pi * t)
    return dx, dy


def circular_sbend_point(t: float, length: float, offset: float) -> tuple[float, float]:
    """Circular arc S-bend centerline point at parameter t.

    Two circular arcs joined at the midpoint. Has discontinuous curvature
    at the junction but provides constant bend radius in each half.

    Args:
        t: Parameter from 0 to 1
        length: Horizontal length
        offset: Vertical offset

    Returns:
        (x, y) position on centerline
    """
    if abs(offset) < 1e-10:
        return t * length, 0.0

    # Calculate radius for two arcs
    radius = (length * length + offset * offset) / (4.0 * abs(offset))
    angle = math.asin(min(1.0, max(-1.0, length / (2.0 * radius))))
    sign = 1.0 if offset > 0 else -1.0

    if t <= 0.5:
        theta = 2.0 * t * angle
        x = radius * math.sin(theta)
        y = sign * radius * (1.0 - math.cos(theta))
    else:
        theta = 2.0 * (1.0 - t) * angle
        x = length - radius * math.sin(theta)
        y = offset - sign * radius * (1.0 - math.cos(theta))

    return x, y


def circular_sbend_tangent(t: float, length: float, offset: float) -> tuple[float, float]:
    """Circular arc S-bend tangent at parameter t.

    Args:
        t: Parameter from 0 to 1
        length: Horizontal length
        offset: Vertical offset

    Returns:
        (dx, dy) tangent vector (not normalized)
    """
    if abs(offset) < 1e-10:
        return 1.0, 0.0

    radius = (length * length + offset * offset) / (4.0 * abs(offset))
    angle = math.asin(min(1.0, max(-1.0, length / (2.0 * radius))))
    sign = 1.0 if offset > 0 else -1.0

    if t <= 0.5:
        theta = 2.0 * t * angle
    else:
        theta = 2.0 * (1.0 - t) * angle

    return math.cos(theta), sign * math.sin(theta)


def euler_sbend_point(t: float, length: float, offset: float) -> tuple[float, float]:
    """Euler (clothoid) S-bend centerline point at parameter t.

    An Euler S-bend uses two clothoid (Cornu spiral) segments, providing
    linearly varying curvature. This results in smoother optical transitions
    than circular or cosine bends.

    The curve is constructed from two Euler spirals meeting at the midpoint,
    scaled and positioned to achieve the desired length and offset.

    Note: this builds a whole-S-bend clothoid with **anisotropic**
    ``(scale_x, scale_y)`` rescaling so it hits ``(length, offset)``
    exactly. It is **not** the same shape as the per-corner isotropic
    clothoid fillet used by ``Route(bend_profile="euler")`` — see
    ``generate_euler_bend_polygon`` in ``rosette-core/src/component/route.rs``.
    Both are intentionally kept: this one lets the caller fix both
    endpoints, the Route one preserves the true constant-rate-of-curvature
    clothoid shape.

    Curvature profile and the aspect-derived ``s_max``
    ---------------------------------------------------
    A clothoid is parameterised by arc length ``s``: its tangent angle is
    ``theta(s) = (pi / 2) * s^2`` and its curvature is
    ``kappa(s) = pi * s``. Each half of the S-bend traces the clothoid
    from ``s = 0`` (zero curvature at the port) up to ``s = s_max``
    (maximum curvature at the midpoint), then the second half mirrors
    back down to zero curvature at the exit port. So ``s_max`` sets the
    **fraction of a full clothoid** each half uses, and thereby the
    tangent angle the unscaled curve reaches at the midpoint.

    We derive ``s_max`` from the bend aspect ratio instead of fixing it.
    Let ``phi = atan2(|offset|, length)`` be the overall chord angle of
    the S-bend. We pick ``s_max`` so the *unscaled* clothoid reaches a
    midpoint tangent angle of ``phi``::

        theta(s_max) = (pi / 2) * s_max^2 = phi
        s_max = sqrt(2 * phi / pi)

    (clamped to ``<= 1.0`` as a defensive cap; since ``phi <= pi/2`` the
    formula already yields ``s_max <= 1.0``). This makes the inflection
    slope scale with the geometry: a gentle bend (small ``phi``) gets a
    gentle inflection, while a tight bend (``phi`` approaching 90°)
    recovers the near-vertical midpoint of the old ``s_max = 1.0``
    behaviour.

    Historically this was hardcoded to ``s_max = 1.0``, which forced
    ``theta = 90°`` at the midpoint of *every* bend. After the
    anisotropic rescaling that produced a purely vertical centerline
    tangent at the inflection regardless of aspect ratio, so even very
    gentle S-bends read as kinked (see ROS-585).

    The anisotropic ``scale_x = (length/2) / C(s_max)``,
    ``scale_y = (|offset|/2) / S(s_max)`` still places the midpoint
    exactly at the geometric centre ``(length/2, offset/2)`` for any
    ``s_max``, so the endpoint/midpoint contract is unchanged.

    Note one inherent limit of the anisotropic scaling: because the
    Y-axis is stretched harder than the X-axis near the ports
    (``S(s) ~ (pi/6) s^3`` vs ``C(s) ~ s`` for small ``s``), the physical
    (post-scaling) midpoint slope has a floor of ``atan(3 * |offset| /
    length)`` — roughly three times the chord slope — reached as
    ``s_max -> 0``. So the physical inflection is always somewhat steeper
    than the chord, but the aspect-derived ``s_max`` keeps it gentle and
    geometry-proportional rather than pinned at vertical.

    Args:
        t: Parameter from 0 to 1
        length: Horizontal length
        offset: Vertical offset

    Returns:
        (x, y) position on centerline
    """
    if abs(offset) < 1e-10:
        return t * length, 0.0

    sign = 1.0 if offset > 0 else -1.0
    abs_offset = abs(offset)

    # Euler spiral parameter - determines the "tightness", derived from
    # the bend aspect ratio so the unscaled clothoid reaches a midpoint
    # tangent angle equal to the chord angle phi = atan2(|offset|, length):
    #   theta(s_max) = (pi/2) * s_max^2 = phi  =>  s_max = sqrt(2*phi/pi).
    # This keeps the inflection slope proportional to the geometry instead
    # of pinning it at 90 degrees (vertical) for every bend. See the
    # docstring for a full discussion (and ROS-585 for the prior bug).
    phi = math.atan2(abs_offset, length)
    s_max = min(1.0, math.sqrt(2.0 * phi / math.pi))

    # Get the Fresnel values at s_max (endpoint of half-spiral)
    c_max = fresnel_c(s_max)
    s_val_max = fresnel_s(s_max)

    # Scale factors to match desired geometry
    # Each half spans: x from 0 to length/2, y from 0 to offset/2
    if c_max > 1e-10 and s_val_max > 1e-10:
        scale_x = (length / 2.0) / c_max
        scale_y = (abs_offset / 2.0) / s_val_max
    else:
        return t * length, sign * t * abs_offset

    if t <= 0.5:
        # First half: trace the Euler spiral from 0 to s_max
        s = 2.0 * t * s_max
        c_val = fresnel_c(s)
        s_val = fresnel_s(s)
        x = scale_x * c_val
        y = scale_y * s_val
    else:
        # Second half: mirror of first half, translated to endpoint
        s = 2.0 * (1.0 - t) * s_max
        c_val = fresnel_c(s)
        s_val = fresnel_s(s)
        x = length - scale_x * c_val
        y = abs_offset - scale_y * s_val

    return x, sign * y


def euler_sbend_tangent(t: float, length: float, offset: float) -> tuple[float, float]:
    """Euler S-bend tangent at parameter t.

    Computes the tangent in the same anisotropically-scaled physical space as
    ``euler_sbend_point``, ensuring correct normal offsets for polygon generation.

    Args:
        t: Parameter from 0 to 1
        length: Horizontal length
        offset: Vertical offset

    Returns:
        (dx, dy) tangent vector (not normalized)
    """
    if abs(offset) < 1e-10:
        return 1.0, 0.0

    sign = 1.0 if offset > 0 else -1.0
    abs_offset = abs(offset)

    # Aspect-derived s_max, identical to euler_sbend_point so point and
    # tangent stay consistent (theta(s_max) = chord angle). See that
    # function's docstring for the derivation.
    phi = math.atan2(abs_offset, length)
    s_max = min(1.0, math.sqrt(2.0 * phi / math.pi))

    # Scale factors matching euler_sbend_point
    c_max = fresnel_c(s_max)
    s_val_max = fresnel_s(s_max)

    if c_max < 1e-10 or s_val_max < 1e-10:
        return 1.0, 0.0

    scale_x = (length / 2.0) / c_max
    scale_y = (abs_offset / 2.0) / s_val_max

    # Tangent angle from the Fresnel spiral parameterisation.
    # Both halves use the same theta(s) because the second half is a spatial
    # mirror — the tangent direction relative to s is identical in both halves.
    if t <= 0.5:
        s = 2.0 * t * s_max
    else:
        s = 2.0 * (1.0 - t) * s_max
    theta = (math.pi / 2.0) * s * s

    # Apply the physical-space scale factors
    dx = scale_x * math.cos(theta)
    dy = sign * scale_y * math.sin(theta)

    return dx, dy


def estimate_sbend_path_length(
    length: float,
    offset: float,
    bend_type: str = "cosine",
    num_segments: int = 64,
) -> float:
    """Estimate path length through numerical integration.

    Args:
        length: Horizontal length
        offset: Vertical offset
        bend_type: "cosine", "circular", or "euler"
        num_segments: Number of integration segments

    Returns:
        Approximate arc length
    """
    if abs(offset) < 1e-10:
        return length

    # Select point function
    if bend_type == "circular":
        point_fn = circular_sbend_point
    elif bend_type == "euler":
        point_fn = euler_sbend_point
    else:
        point_fn = cosine_sbend_point

    total = 0.0
    prev_x, prev_y = 0.0, 0.0

    for i in range(1, num_segments + 1):
        t = i / num_segments
        x, y = point_fn(t, length, offset)
        total += math.sqrt((x - prev_x) ** 2 + (y - prev_y) ** 2)
        prev_x, prev_y = x, y

    return total
