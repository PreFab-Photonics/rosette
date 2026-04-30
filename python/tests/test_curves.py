"""Tests for ``rosette.components._curves``.

These are unit tests for the shared S-bend curve utilities that back
``sbend``, ``directional_coupler``, and any other component that needs
smooth lateral transitions. The functions are internal (leading
underscore), but they're the source of several observable contracts
(port positions, path length, tangent continuity) that component tests
rely on, so they deserve direct coverage.
"""

from __future__ import annotations

import math
from itertools import pairwise

import pytest

from rosette.components._curves import (
    circular_sbend_point,
    circular_sbend_tangent,
    cosine_sbend_point,
    cosine_sbend_tangent,
    estimate_sbend_path_length,
    euler_sbend_point,
    euler_sbend_tangent,
)

# The three curve profiles share a common parameterisation (t in [0, 1],
# length, offset) and the same endpoint contract, so most tests fan out
# across all three via parametrisation.
POINT_FUNCS = [
    ("cosine", cosine_sbend_point, cosine_sbend_tangent),
    ("circular", circular_sbend_point, circular_sbend_tangent),
    ("euler", euler_sbend_point, euler_sbend_tangent),
]


@pytest.mark.parametrize("name,point_fn,_tan_fn", POINT_FUNCS)
def test_point_at_t0_is_origin(name, point_fn, _tan_fn):
    """``*_sbend_point(0, ...)`` must return exactly ``(0, 0)``."""
    length, offset = 20.0, 5.0
    x, y = point_fn(0.0, length, offset)
    assert x == pytest.approx(0.0), f"{name}: x(0) != 0"
    assert y == pytest.approx(0.0), f"{name}: y(0) != 0"


@pytest.mark.parametrize("name,point_fn,_tan_fn", POINT_FUNCS)
def test_point_at_t1_is_endpoint(name, point_fn, _tan_fn):
    """``*_sbend_point(1, length, offset)`` must return ``(length, offset)``."""
    length, offset = 20.0, 5.0
    x, y = point_fn(1.0, length, offset)
    assert x == pytest.approx(length), f"{name}: x(1) != length"
    assert y == pytest.approx(offset), f"{name}: y(1) != offset"


@pytest.mark.parametrize("name,point_fn,_tan_fn", POINT_FUNCS)
@pytest.mark.parametrize("offset", [5.0, -5.0])
def test_point_endpoint_matches_offset_sign(name, point_fn, _tan_fn, offset):
    """Positive and negative offset are both honoured at t=1."""
    length = 20.0
    x, y = point_fn(1.0, length, offset)
    assert x == pytest.approx(length)
    assert y == pytest.approx(offset)


@pytest.mark.parametrize("name,point_fn,tan_fn", POINT_FUNCS)
def test_zero_offset_point_is_straight_line(name, point_fn, tan_fn):
    """With offset=0, point_fn must trace (t*length, 0) over the whole sweep."""
    length = 20.0
    for i in range(11):
        t = i / 10.0
        x, y = point_fn(t, length, 0.0)
        assert x == pytest.approx(t * length), f"{name}: x at t={t}"
        assert y == pytest.approx(0.0), f"{name}: y at t={t}"


@pytest.mark.parametrize("name,_point_fn,tan_fn", POINT_FUNCS)
def test_zero_offset_tangent_is_unit_x(name, _point_fn, tan_fn):
    """With offset=0 the tangent must be (1, 0) (or a positive-x multiple)."""
    length = 20.0
    for i in range(11):
        t = i / 10.0
        dx, dy = tan_fn(t, length, 0.0)
        # cosine tangent returns (length, 0); circular/euler return (1, 0).
        # In all cases dx is strictly positive and dy is exactly 0.
        assert dx > 0.0, f"{name}: dx not positive at t={t}"
        assert dy == pytest.approx(0.0), f"{name}: dy != 0 at t={t}"


@pytest.mark.parametrize("name,_point_fn,tan_fn", POINT_FUNCS)
def test_tangent_continuous_along_sweep(name, _point_fn, tan_fn):
    """Dense parameter sweep: consecutive tangent directions must not jump.

    We compare the *angle* of consecutive normalised tangents. The
    threshold is generous enough that all three profiles pass at this
    sample density (Euler has the highest curvature near t=0.5 and
    peaks around ~2 deg per step); any true C0 break in the tangent
    angle would produce a spike far above 5 deg.
    """
    length, offset = 20.0, 5.0
    n = 401
    prev_angle = None
    for i in range(n):
        t = i / (n - 1)
        dx, dy = tan_fn(t, length, offset)
        tlen = math.hypot(dx, dy)
        assert tlen > 0.0, f"{name}: zero-length tangent at t={t}"
        angle = math.atan2(dy, dx)
        if prev_angle is not None:
            delta = abs(angle - prev_angle)
            # atan2 range is (-pi, pi]; real delta is min(delta, 2pi-delta)
            delta = min(delta, 2 * math.pi - delta)
            assert delta < math.radians(5.0), (
                f"{name}: tangent jump {math.degrees(delta):.3f}deg at t={t}"
            )
        prev_angle = angle


def test_estimate_sbend_path_length_zero_offset_is_length():
    """With offset=0 the path length is exactly the horizontal span."""
    assert estimate_sbend_path_length(20.0, 0.0, "cosine") == pytest.approx(20.0)
    assert estimate_sbend_path_length(20.0, 0.0, "circular") == pytest.approx(20.0)
    assert estimate_sbend_path_length(20.0, 0.0, "euler") == pytest.approx(20.0)


@pytest.mark.parametrize("bend_type", ["cosine", "circular", "euler"])
def test_estimate_sbend_path_length_monotonic_in_abs_offset(bend_type):
    """Path length monotonically increases as |offset| increases."""
    length = 20.0
    offsets = [0.0, 1.0, 2.0, 3.0, 5.0, 8.0, 12.0]
    lens = [estimate_sbend_path_length(length, o, bend_type) for o in offsets]
    for a, b in pairwise(lens):
        assert b > a, f"{bend_type}: not monotonic ({lens})"


@pytest.mark.parametrize("bend_type", ["cosine", "circular", "euler"])
def test_estimate_sbend_path_length_symmetric_in_offset_sign(bend_type):
    """|offset| -> +offset and -offset produce the same arc length."""
    length = 20.0
    for o in (1.0, 5.0, 10.0):
        pos = estimate_sbend_path_length(length, o, bend_type)
        neg = estimate_sbend_path_length(length, -o, bend_type)
        assert pos == pytest.approx(neg), f"{bend_type}: asymmetric at offset={o}"


@pytest.mark.parametrize("bend_type", ["cosine", "circular", "euler"])
def test_estimate_sbend_path_length_at_least_straight_length(bend_type):
    """Arc length >= horizontal length (straight is the minimum)."""
    length = 20.0
    for o in (0.5, 2.0, 7.0):
        arc = estimate_sbend_path_length(length, o, bend_type)
        assert arc >= length, f"{bend_type}: arc {arc} < length {length}"


# ----------------------------------------------------------------------------
# Euler-specific coverage: the s_max = 1.0 scaling choice is documented in
# ``euler_sbend_point``, and the Fresnel-scaled physical space is load-bearing
# for how the polygon sidewalls are offset. These tests pin that choice at the
# boundaries so a future refactor that changes s_max has to face the test
# suite head-on.
# ----------------------------------------------------------------------------


def test_euler_midpoint_is_geometric_midpoint():
    """Euler spiral halves are mirrored, so the midpoint must be the
    geometric center ``(length/2, offset/2)`` regardless of s_max.
    """
    length, offset = 20.0, 5.0
    x, y = euler_sbend_point(0.5, length, offset)
    assert x == pytest.approx(length / 2.0)
    assert y == pytest.approx(offset / 2.0)


def test_euler_s_max_boundary_tangent_angle():
    """At t=0.5 the Fresnel parameter s = s_max = 1.0, so the tangent
    angle is theta = (pi/2) * s^2 = pi/2 — i.e. the (scaled) tangent has
    dx = 0 (to within float precision) and positive dy.

    This locks the ``s_max = 1.0`` choice at the midpoint boundary.
    """
    length, offset = 20.0, 5.0
    dx, dy = euler_sbend_tangent(0.5, length, offset)
    assert dx == pytest.approx(0.0, abs=1e-9)
    assert dy > 0.0


def test_euler_tangent_at_endpoints_is_horizontal():
    """At t=0 and t=1 the Fresnel parameter is s=0, so theta=0: the
    tangent is purely along +X. This matches the ``sbend`` contract that
    input and output directions are both +X.
    """
    length, offset = 20.0, 5.0
    for t in (0.0, 1.0):
        dx, dy = euler_sbend_tangent(t, length, offset)
        assert dx > 0.0
        assert dy == pytest.approx(0.0, abs=1e-12)


def test_euler_negative_offset_mirrors_positive():
    """Euler point trajectory is antisymmetric in Y under offset sign flip."""
    length, offset = 20.0, 5.0
    for i in range(11):
        t = i / 10.0
        x_pos, y_pos = euler_sbend_point(t, length, offset)
        x_neg, y_neg = euler_sbend_point(t, length, -offset)
        assert x_pos == pytest.approx(x_neg)
        assert y_pos == pytest.approx(-y_neg)
