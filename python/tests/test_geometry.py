"""Tests for geometry types: Point, Vector2, Polygon, Transform, BBox.

These tests focus on Python-specific behavior (operators, repr, type coercion).
Core algorithm correctness is tested in Rust.
"""

import pytest

from rosette import BBox, Point, Polygon, Transform, Vector2


class TestPoint:
    """Tests for Point class - Python binding behavior."""

    def test_init_default(self):
        """Point() creates point at origin."""
        p = Point()
        assert p.x == 0.0
        assert p.y == 0.0

    def test_init_with_values(self):
        """Point(x, y) creates point at specified coordinates."""
        p = Point(3.5, -2.0)
        assert p.x == 3.5
        assert p.y == -2.0

    def test_add_vector(self):
        """Point + Vector2 returns Point (operator overload)."""
        p = Point(1.0, 2.0)
        v = Vector2(3.0, 4.0)
        result = p + v
        assert isinstance(result, Point)
        assert result.x == pytest.approx(4.0)
        assert result.y == pytest.approx(6.0)

    def test_sub_point(self):
        """Point - Point returns Vector2 (operator overload)."""
        p1 = Point(4.0, 6.0)
        p2 = Point(1.0, 2.0)
        result = p1 - p2
        assert isinstance(result, Vector2)
        assert result.x == pytest.approx(3.0)
        assert result.y == pytest.approx(4.0)

    def test_repr(self):
        """String representation is readable."""
        p = Point(1.5, 2.5)
        assert "1.5" in repr(p)
        assert "2.5" in repr(p)


class TestVector2:
    """Tests for Vector2 class - Python binding behavior."""

    def test_init_default(self):
        """Vector2() creates zero vector."""
        v = Vector2()
        assert v.x == 0.0
        assert v.y == 0.0

    def test_init_with_values(self):
        """Vector2(x, y) creates specified vector."""
        v = Vector2(3.0, 4.0)
        assert v.x == 3.0
        assert v.y == 4.0

    def test_add(self):
        """Vector addition (operator overload)."""
        v1 = Vector2(1.0, 2.0)
        v2 = Vector2(3.0, 4.0)
        result = v1 + v2
        assert result.x == pytest.approx(4.0)
        assert result.y == pytest.approx(6.0)

    def test_sub(self):
        """Vector subtraction (operator overload)."""
        v1 = Vector2(4.0, 6.0)
        v2 = Vector2(1.0, 2.0)
        result = v1 - v2
        assert result.x == pytest.approx(3.0)
        assert result.y == pytest.approx(4.0)

    def test_mul_scalar(self):
        """Vector scalar multiplication (operator overload)."""
        v = Vector2(1.0, 2.0)
        result = v * 3.0
        assert result.x == pytest.approx(3.0)
        assert result.y == pytest.approx(6.0)

    def test_neg(self):
        """Vector negation (operator overload)."""
        v = Vector2(1.0, -2.0)
        result = -v
        assert result.x == pytest.approx(-1.0)
        assert result.y == pytest.approx(2.0)


class TestPolygon:
    """Tests for Polygon class - Python binding behavior."""

    def test_init_from_points(self):
        """Create polygon from list of points."""
        points = [Point(0, 0), Point(10, 0), Point(10, 5), Point(0, 5)]
        poly = Polygon(points)
        assert len(poly) == 4

    def test_rect(self):
        """Create rectangle from origin, width, height."""
        poly = Polygon.rect(Point(0, 0), 10.0, 5.0)
        assert len(poly) == 4
        assert poly.area() == pytest.approx(50.0)

    def test_vertices(self):
        """Get polygon vertices as list."""
        poly = Polygon.rect(Point(0, 0), 10.0, 5.0)
        verts = poly.vertices()
        assert len(verts) == 4
        assert all(isinstance(v, Point) for v in verts)

    def test_len(self):
        """len() returns vertex count (Python protocol)."""
        poly = Polygon.rect(Point(0, 0), 10.0, 5.0)
        assert len(poly) == 4


class TestPolygonBooleanOps:
    """Tests for Polygon boolean operations - Python binding behavior."""

    def test_union_overlapping(self):
        """Union of overlapping rectangles merges them."""
        a = Polygon.rect(Point(0, 0), 10, 10)
        b = Polygon.rect(Point(5, 0), 10, 10)
        result = a.union(b)
        assert isinstance(result, list)
        assert len(result) == 1
        assert isinstance(result[0], Polygon)
        # 10*10 + 10*10 - 5*10 overlap = 150
        total_area = sum(p.area() for p in result)
        assert total_area == pytest.approx(150.0)

    def test_union_disjoint(self):
        """Union of disjoint rectangles returns two polygons."""
        a = Polygon.rect(Point(0, 0), 5, 5)
        b = Polygon.rect(Point(20, 20), 5, 5)
        result = a.union(b)
        assert len(result) == 2
        total_area = sum(p.area() for p in result)
        assert total_area == pytest.approx(50.0)

    def test_subtract_overlapping(self):
        """Subtract removes overlapping region."""
        a = Polygon.rect(Point(0, 0), 10, 10)
        b = Polygon.rect(Point(5, 0), 10, 10)
        result = a.subtract(b)
        assert len(result) == 1
        # 10*10 - 5*10 = 50
        total_area = sum(p.area() for p in result)
        assert total_area == pytest.approx(50.0)

    def test_subtract_creates_hole(self):
        """Subtract with contained shape creates keyholed polygon."""
        outer = Polygon.rect(Point(0, 0), 20, 20)
        inner = Polygon.rect(Point(5, 5), 10, 10)
        result = outer.subtract(inner)
        assert len(result) == 1
        poly = result[0]
        # More vertices than a simple rectangle (keyhole bridge)
        assert len(poly) > 4
        # 20*20 - 10*10 = 300
        assert poly.area() == pytest.approx(300.0)

    def test_subtract_complete_coverage(self):
        """Subtracting a larger polygon returns empty list."""
        small = Polygon.rect(Point(2, 2), 3, 3)
        big = Polygon.rect(Point(0, 0), 10, 10)
        result = small.subtract(big)
        assert result == []

    def test_intersect_overlapping(self):
        """Intersect returns overlapping area."""
        a = Polygon.rect(Point(0, 0), 10, 10)
        b = Polygon.rect(Point(5, 0), 10, 10)
        result = a.intersect(b)
        assert len(result) == 1
        # 5*10 = 50
        total_area = sum(p.area() for p in result)
        assert total_area == pytest.approx(50.0)

    def test_intersect_no_overlap(self):
        """Intersect with no overlap returns empty list."""
        a = Polygon.rect(Point(0, 0), 5, 5)
        b = Polygon.rect(Point(20, 20), 5, 5)
        result = a.intersect(b)
        assert result == []

    def test_xor_overlapping(self):
        """XOR returns area in either but not both."""
        a = Polygon.rect(Point(0, 0), 10, 10)
        b = Polygon.rect(Point(5, 0), 10, 10)
        result = a.xor(b)
        # (10*10 + 10*10) - 2*(5*10) = 100
        total_area = sum(p.area() for p in result)
        assert total_area == pytest.approx(100.0)

    def test_xor_identical(self):
        """XOR of identical polygons returns empty list."""
        a = Polygon.rect(Point(0, 0), 10, 10)
        b = Polygon.rect(Point(0, 0), 10, 10)
        result = a.xor(b)
        assert result == []

    def test_result_polygons_are_usable(self):
        """Result polygons have working methods (area, vertices, bbox)."""
        a = Polygon.rect(Point(0, 0), 10, 10)
        b = Polygon.rect(Point(5, 0), 10, 10)
        result = a.union(b)
        poly = result[0]
        # Methods work
        assert poly.area() > 0
        assert len(poly.vertices()) >= 4
        bbox = poly.bbox()
        assert bbox.width() == pytest.approx(15.0)
        assert bbox.height() == pytest.approx(10.0)


class TestTransform:
    """Tests for Transform class - Python binding behavior."""

    def test_identity(self):
        """Identity transform doesn't change points."""
        t = Transform.identity()
        p = Point(5.0, 3.0)
        result = t.apply(p)
        assert result.x == pytest.approx(5.0)
        assert result.y == pytest.approx(3.0)

    def test_chain_then(self):
        """Chain transforms with then()."""
        t1 = Transform.translate(10.0, 0.0)
        t2 = Transform.rotate(90.0)
        combined = t1.then(t2)
        p = Point(0.0, 0.0)
        result = combined.apply(p)
        # Verify transforms are composed (result differs from original)
        assert result.x != 0.0 or result.y != 0.0


class TestBBox:
    """Tests for BBox class - Python binding behavior."""

    def test_init(self):
        """Create BBox from min/max points."""
        bbox = BBox(Point(0, 0), Point(10, 5))
        assert bbox.min.x == 0.0
        assert bbox.min.y == 0.0
        assert bbox.max.x == 10.0
        assert bbox.max.y == 5.0

    def test_width_height(self):
        """BBox width/height calculation."""
        bbox = BBox(Point(0, 0), Point(10, 5))
        assert bbox.width() == pytest.approx(10.0)
        assert bbox.height() == pytest.approx(5.0)

    def test_center(self):
        """BBox center calculation."""
        bbox = BBox(Point(0, 0), Point(10, 6))
        c = bbox.center()
        assert c.x == pytest.approx(5.0)
        assert c.y == pytest.approx(3.0)

    def test_merge(self):
        """Merge two bboxes."""
        bbox1 = BBox(Point(0, 0), Point(5, 5))
        bbox2 = BBox(Point(3, 3), Point(10, 10))
        merged = bbox1.merge(bbox2)
        assert merged.min.x == pytest.approx(0.0)
        assert merged.max.x == pytest.approx(10.0)
