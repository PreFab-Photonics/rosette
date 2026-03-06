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
    "euler_bend_point",
    "euler_bend_tangent",
    "euler_sbend_point",
    "euler_sbend_tangent",
]


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


def euler_bend_point(t: float, radius: float, total_angle: float) -> tuple[float, float]:
    """Euler (clothoid) bend centerline point at parameter t.

    An Euler bend uses two clothoid segments (increasing then decreasing curvature)
    to turn through a specified angle. The curvature varies linearly with arc length,
    providing smoother optical transitions than circular bends.

    The bend starts at the origin pointing in +X direction and turns counter-clockwise.
    For clockwise bends, negate the y-coordinate of the result.

    Args:
        t: Parameter from 0 (start) to 1 (end)
        radius: Effective bend radius in microns
        total_angle: Total bend angle in radians (positive)

    Returns:
        (x, y) position on centerline (assumes CCW bend)
    """
    if total_angle < 1e-10:
        return t * radius * total_angle, 0.0

    half_angle = total_angle / 2.0

    # Fresnel parameter at the midpoint
    # The tangent angle at parameter s is: theta = pi/2 * s^2
    # We want theta_max = half_angle, so s_max = sqrt(2 * half_angle / pi)
    s_max = math.sqrt(2.0 * half_angle / math.pi)

    # Scale factor to achieve the desired effective radius
    # Arc length = s_max (in Fresnel units), we want arc_length = radius * half_angle
    scale = radius * half_angle / s_max if s_max > 1e-10 else radius

    if t <= 0.5:
        # First half: spiral from 0 to s_max
        s = 2.0 * t * s_max
        x = scale * fresnel_c(s)
        y = scale * fresnel_s(s)
    else:
        # Second half: mirror and translate
        s = 2.0 * (1.0 - t) * s_max

        # Endpoint of first half
        x1 = scale * fresnel_c(s_max)
        y1 = scale * fresnel_s(s_max)

        # Current point from end (mirrored)
        x2 = scale * fresnel_c(s)
        y2 = scale * fresnel_s(s)

        # Rotate the difference by the midpoint angle
        dx, dy = x1 - x2, y1 - y2
        cos_mid = math.cos(half_angle)
        sin_mid = math.sin(half_angle)
        rotated_x = dx * cos_mid - dy * sin_mid
        rotated_y = dx * sin_mid + dy * cos_mid

        x = x1 + rotated_x
        y = y1 + rotated_y

    return x, y


def euler_bend_tangent(t: float, total_angle: float) -> tuple[float, float]:
    """Euler bend tangent direction at parameter t.

    For an Euler spiral, the tangent angle is proportional to s^2.

    Args:
        t: Parameter from 0 to 1
        total_angle: Total bend angle in radians (positive)

    Returns:
        (dx, dy) unit tangent vector (assumes CCW bend)
    """
    if total_angle < 1e-10:
        return 1.0, 0.0

    half_angle = total_angle / 2.0
    s_max = math.sqrt(2.0 * half_angle / math.pi)

    if t <= 0.5:
        s = 2.0 * t * s_max
        theta = (math.pi / 2.0) * s * s
    else:
        s = 2.0 * (1.0 - t) * s_max
        theta = total_angle - (math.pi / 2.0) * s * s

    return math.cos(theta), math.sin(theta)


def euler_sbend_point(t: float, length: float, offset: float) -> tuple[float, float]:
    """Euler (clothoid) S-bend centerline point at parameter t.

    An Euler S-bend uses two clothoid (Cornu spiral) segments, providing
    linearly varying curvature. This results in smoother optical transitions
    than circular or cosine bends.

    The curve is constructed from two Euler spirals meeting at the midpoint,
    scaled and positioned to achieve the desired length and offset.

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

    # Euler spiral parameter - determines the "tightness"
    # We use s_max = 1.0 as a reasonable value for typical S-bends
    s_max = 1.0

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

    For an Euler spiral, the tangent angle is proportional to s^2.

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
    s_max = 1.0

    # For Fresnel integrals: tangent angle theta = pi/2 * s^2
    if t <= 0.5:
        s = 2.0 * t * s_max
        theta = (math.pi / 2.0) * s * s
    else:
        s = 2.0 * (1.0 - t) * s_max
        theta_max = (math.pi / 2.0) * s_max * s_max
        theta = theta_max - (math.pi / 2.0) * s * s

    dx = math.cos(theta)
    dy = sign * math.sin(theta)

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
