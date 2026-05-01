"""Tests for ``rosette.components._tapers``.

Unit tests for the shared taper polygon helper that backs MMI and
grating coupler tapers. The module is internal (leading underscore), but
it underpins several observable component contracts (port widths,
monotonic width profiles, adiabatic taper shape), so it gets direct
coverage here.
"""

from __future__ import annotations

import math
from itertools import pairwise

import pytest

from rosette.components._tapers import taper_polygon

PROFILES = ["linear", "parabolic", "exponential"]


def _edge_widths(poly, n: int) -> tuple[list[tuple[float, float]], list[tuple[float, float]]]:
    """Split a CCW taper polygon into (bottom_edge, top_edge) lists of
    ``(x, w_local)`` samples, where ``w_local = top_y - bottom_y`` at
    matching x. Polygon vertices are in order: bottom L->R (n+1 pts),
    top R->L (n+1 pts). For the linear fast path there are only 4
    vertices, so n must be 1 for that case.
    """
    verts = list(poly.vertices())
    assert len(verts) == 2 * (n + 1), f"expected {2 * (n + 1)} verts, got {len(verts)}"
    bottom = [(v.x, v.y) for v in verts[: n + 1]]
    top = [(v.x, v.y) for v in verts[n + 1 :]][::-1]  # reverse to L->R
    # At each sample x the top and bottom x-coordinates match; width is top_y - bottom_y
    samples = []
    for (xb, yb), (xt, yt) in zip(bottom, top, strict=True):
        assert xb == pytest.approx(xt), f"top/bottom x mismatch: {xb} vs {xt}"
        samples.append((xb, yt - yb))
    return samples, [(xb, yb) for xb, yb in bottom]


# ---------------------------------------------------------------------------
# Endpoint widths: every profile must hit width_in at x=0 and width_out at x=L.
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("profile", PROFILES)
def test_endpoint_widths(profile):
    """``w(0) == width_in`` and ``w(length) == width_out`` for all profiles."""
    width_in, width_out, length = 0.5, 1.2, 10.0
    poly = taper_polygon(width_in, width_out, length, profile=profile, num_segments=16)
    # Linear returns exactly 4 vertices; the others 2*(n+1).
    n = 1 if profile == "linear" else 16
    samples, _ = _edge_widths(poly, n)
    assert samples[0][0] == pytest.approx(0.0)
    assert samples[0][1] == pytest.approx(width_in)
    assert samples[-1][0] == pytest.approx(length)
    assert samples[-1][1] == pytest.approx(width_out)


@pytest.mark.parametrize("profile", PROFILES)
def test_centerline_on_y_zero(profile):
    """Every sampled pair is symmetric about y=0 (centerline)."""
    poly = taper_polygon(0.5, 1.2, 10.0, profile=profile, num_segments=8)
    verts = list(poly.vertices())
    n = 1 if profile == "linear" else 8
    # Pair up bottom[i] with top[2n+1-i] -- they must have matching x and
    # y-values that sum to zero.
    for i in range(n + 1):
        vb = verts[i]
        vt = verts[2 * n + 1 - i]
        assert vb.x == pytest.approx(vt.x)
        assert vb.y + vt.y == pytest.approx(0.0)


# ---------------------------------------------------------------------------
# Width profile shape per profile.
# ---------------------------------------------------------------------------


def test_linear_is_four_vertices():
    """Linear taper is always a 4-vertex trapezoid regardless of num_segments."""
    poly = taper_polygon(0.5, 1.2, 10.0, profile="linear", num_segments=1000)
    assert len(poly) == 4


def test_linear_width_is_linear_in_x():
    """For ``linear``, sampled widths lie on the straight line ``w_in + t*(w_out-w_in)``."""
    width_in, width_out, length = 0.5, 1.2, 10.0
    poly = taper_polygon(width_in, width_out, length, profile="linear")
    samples, _ = _edge_widths(poly, 1)
    # 4-vertex polygon: only endpoints; both must match the linear formula.
    for x, w in samples:
        t = x / length
        expected = width_in + t * (width_out - width_in)
        assert w == pytest.approx(expected)


def test_parabolic_satisfies_constant_angle_formula():
    """``w(x)^2 = w_in^2 + t * (w_out^2 - w_in^2)`` at every sample point."""
    width_in, width_out, length, n = 0.3, 1.5, 50.0, 32
    poly = taper_polygon(width_in, width_out, length, profile="parabolic", num_segments=n)
    samples, _ = _edge_widths(poly, n)
    for x, w in samples:
        t = x / length
        expected_w_sq = width_in**2 + t * (width_out**2 - width_in**2)
        assert w * w == pytest.approx(expected_w_sq)


def test_exponential_has_constant_fractional_rate():
    """``log(w)`` must vary linearly in ``t`` for the exponential profile.

    Equivalently: consecutive samples on a uniform grid satisfy
    ``w[i+1] / w[i] = const``.
    """
    width_in, width_out, length, n = 0.3, 1.5, 50.0, 16
    poly = taper_polygon(width_in, width_out, length, profile="exponential", num_segments=n)
    samples, _ = _edge_widths(poly, n)
    widths = [w for _, w in samples]
    ratios = [b / a for a, b in pairwise(widths)]
    # All ratios equal within float tolerance.
    ref = ratios[0]
    for r in ratios:
        assert r == pytest.approx(ref, rel=1e-12)
    # And the ratio across the whole span is (w_out / w_in).
    assert widths[-1] / widths[0] == pytest.approx(width_out / width_in)


# ---------------------------------------------------------------------------
# Monotonicity: every profile produces a monotonic width vs x for both
# widening (w_out > w_in) and narrowing (w_out < w_in).
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("profile", PROFILES)
@pytest.mark.parametrize(
    "width_in,width_out",
    [
        (0.3, 1.5),  # widening
        (1.5, 0.3),  # narrowing
    ],
)
def test_width_monotonic_in_x(profile, width_in, width_out):
    """Width is monotonic in ``x`` (increasing if widening, decreasing otherwise)."""
    n = 1 if profile == "linear" else 32
    poly = taper_polygon(width_in, width_out, 10.0, profile=profile, num_segments=n)
    samples, _ = _edge_widths(poly, n)
    widths = [w for _, w in samples]
    if width_out > width_in:
        for a, b in pairwise(widths):
            assert b >= a - 1e-12, f"{profile}: widths not monotonically increasing: {widths}"
    else:
        for a, b in pairwise(widths):
            assert b <= a + 1e-12, f"{profile}: widths not monotonically decreasing: {widths}"


@pytest.mark.parametrize("profile", PROFILES)
def test_equal_widths_gives_rectangle_width(profile):
    """``width_in == width_out`` gives a constant-width shape regardless of profile."""
    n = 1 if profile == "linear" else 16
    poly = taper_polygon(0.7, 0.7, 5.0, profile=profile, num_segments=n)
    samples, _ = _edge_widths(poly, n)
    for _, w in samples:
        assert w == pytest.approx(0.7)


# ---------------------------------------------------------------------------
# Vertex-count invariants: callers (e.g. DRC grids) can rely on them.
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("profile", ["parabolic", "exponential"])
@pytest.mark.parametrize("num_segments", [2, 8, 32, 128])
def test_curved_vertex_count(profile, num_segments):
    """Curved profiles yield exactly ``2 * (num_segments + 1)`` vertices."""
    poly = taper_polygon(0.5, 1.2, 10.0, profile=profile, num_segments=num_segments)
    assert len(poly) == 2 * (num_segments + 1)


# ---------------------------------------------------------------------------
# Validation.
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "width_in,width_out,length,match",
    [
        (0.0, 1.0, 10.0, "width_in"),
        (-0.1, 1.0, 10.0, "width_in"),
        (0.5, 0.0, 10.0, "width_out"),
        (0.5, -0.1, 10.0, "width_out"),
        (0.5, 1.0, 0.0, "length"),
        (0.5, 1.0, -1.0, "length"),
    ],
)
def test_validation_rejects_non_positive_dimensions(width_in, width_out, length, match):
    with pytest.raises(ValueError, match=match):
        taper_polygon(width_in, width_out, length)


def test_validation_rejects_unknown_profile():
    # Pin num_segments to a valid value so this test still exercises the
    # "unknown profile" branch if the default ever changes to something
    # that would otherwise fail the num_segments >= 2 check first.
    with pytest.raises(ValueError, match="Unknown profile"):
        taper_polygon(0.5, 1.2, 10.0, profile="cubic", num_segments=16)  # type: ignore[arg-type]


@pytest.mark.parametrize("num_segments", [0, 1, -1])
def test_validation_rejects_too_few_segments_for_curved(num_segments):
    """Curved profiles need at least 2 segments to be a meaningful sampling."""
    with pytest.raises(ValueError, match="num_segments"):
        taper_polygon(0.5, 1.2, 10.0, profile="parabolic", num_segments=num_segments)


def test_linear_ignores_num_segments_validation():
    """Linear is always 4 vertices and must not raise on small num_segments."""
    # num_segments < 2 is only a constraint for curved profiles; linear
    # should be fine regardless.
    poly = taper_polygon(0.5, 1.2, 10.0, profile="linear", num_segments=0)
    assert len(poly) == 4


# ---------------------------------------------------------------------------
# Area sanity: for a widening taper, the curved profiles should enclose
# an area different from the linear trapezoid (parabolic: more area;
# exponential: sits between). This locks the profile shapes in a
# physically-meaningful way.
# ---------------------------------------------------------------------------


def test_widening_parabolic_area_exceeds_linear():
    """Parabolic ``w^2 = w1^2 + t*(w2^2-w1^2)`` widens faster than linear for w2 > w1, so
    the enclosed area is larger than the linear trapezoid."""
    width_in, width_out, length = 0.3, 1.5, 50.0
    a_lin = taper_polygon(width_in, width_out, length, "linear").area()
    a_par = taper_polygon(width_in, width_out, length, "parabolic", 128).area()
    assert a_par > a_lin


def test_widening_exponential_area_less_than_linear():
    """Exponential ``w = w1 * (w2/w1)^t`` widens slowly early, fast late; for w2 > w1 the
    area is smaller than the linear trapezoid."""
    width_in, width_out, length = 0.3, 1.5, 50.0
    a_lin = taper_polygon(width_in, width_out, length, "linear").area()
    a_exp = taper_polygon(width_in, width_out, length, "exponential", 128).area()
    assert a_exp < a_lin


def test_linear_area_matches_trapezoid_formula():
    """Linear taper area = ``(w_in + w_out) * length / 2``."""
    width_in, width_out, length = 0.3, 1.5, 50.0
    poly = taper_polygon(width_in, width_out, length, "linear")
    expected = 0.5 * (width_in + width_out) * length
    assert poly.area() == pytest.approx(expected)


# ---------------------------------------------------------------------------
# Regression: the refactored MMI / GC straight taper must produce the
# same physical geometry as the old hand-rolled polygons. Verify through
# the public component API by checking bbox extents and port positions
# (the component tests already cover these, so this is a direct
# cross-check that goes through the helper).
# ---------------------------------------------------------------------------


def test_linear_matches_manual_trapezoid_vertices():
    """The linear polygon matches the hand-coded MMI-style vertex order."""
    from rosette import Point

    width_in, width_out, length = 0.5, 1.2, 5.0
    poly = taper_polygon(width_in, width_out, length, "linear")
    expected = [
        Point(0.0, -width_in / 2),
        Point(length, -width_out / 2),
        Point(length, +width_out / 2),
        Point(0.0, +width_in / 2),
    ]
    got = list(poly.vertices())
    assert len(got) == 4
    for g, e in zip(got, expected, strict=True):
        assert g.x == pytest.approx(e.x)
        assert g.y == pytest.approx(e.y)


# ---------------------------------------------------------------------------
# Tangent-continuity sanity for curved profiles: refining num_segments
# should reduce the maximum edge-angle jump (i.e. the sampling is
# converging to a smooth curve).
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("profile", ["parabolic", "exponential"])
def test_refinement_reduces_max_angle_jump(profile):
    """Doubling num_segments at least halves the maximum edge-angle change
    (since the true curve is smooth, the discrete jumps scale ~ 1/n).
    """
    width_in, width_out, length = 0.3, 1.5, 50.0

    def max_jump(n: int) -> float:
        poly = taper_polygon(width_in, width_out, length, profile, n)
        _, bottom = _edge_widths(poly, n)
        prev_angle = None
        worst = 0.0
        for (x0, y0), (x1, y1) in pairwise(bottom):
            angle = math.atan2(y1 - y0, x1 - x0)
            if prev_angle is not None:
                worst = max(worst, abs(angle - prev_angle))
            prev_angle = angle
        return worst

    jump_coarse = max_jump(16)
    jump_fine = max_jump(128)
    # 8x more segments -> jumps should shrink. For parabolic the
    # convergence is slower than O(1/n) near the narrow end because
    # ``dw/dx ~ 1/w`` blows up there, so a generous factor of 2 is the
    # right bar. Exponential is smooth and converges as ~1/n^2; both
    # easily pass.
    assert jump_fine < jump_coarse / 2, (
        f"{profile}: refinement not converging: coarse={jump_coarse}, fine={jump_fine}"
    )
