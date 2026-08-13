"""Python boundary regressions for core model validation."""

import sys

import pytest

from rosette import (
    Cell,
    Instance,
    Point,
    Polygon,
    Port,
    Transform,
    Vector2,
)
from rosette._core import Cell as NativeCell
from rosette._core import CellRef as NativeCellRef

NONFINITE = [float("nan"), float("inf"), float("-inf")]


class TestPolygonValidation:
    def test_constructor_rejects_too_few_vertices(self):
        with pytest.raises(ValueError, match="at least 3"):
            Polygon([Point.origin(), Point(1, 0)])

    @pytest.mark.parametrize("value", NONFINITE)
    def test_constructor_rejects_nonfinite_vertices(self, value: float):
        with pytest.raises(ValueError, match="non-finite point"):
            Polygon([Point.origin(), Point(1, 0), Point(value, 1)])

    @pytest.mark.parametrize("value", NONFINITE)
    def test_rect_rejects_nonfinite_inputs(self, value: float):
        with pytest.raises(ValueError, match="finite"):
            Polygon.rect(Point(value, 0), 1, 1)
        with pytest.raises(ValueError, match="finite"):
            Polygon.rect(Point.origin(), value, 1)
        with pytest.raises(ValueError, match="finite"):
            Polygon.rect_centered(Point.origin(), 1, value)

    def test_rect_rejects_finite_inputs_whose_corners_overflow(self):
        maximum = sys.float_info.max
        with pytest.raises(ValueError, match="remain finite"):
            Polygon.rect(Point(maximum, 0), maximum, 1)
        with pytest.raises(ValueError, match="remain finite"):
            Polygon.rect_centered(Point(maximum, 0), maximum, 1)

    @pytest.mark.parametrize("sides", [0, 2, -1, 10**100])
    def test_regular_rejects_invalid_side_counts(self, sides: int):
        with pytest.raises(ValueError, match="at least 3"):
            Polygon.regular(Point.origin(), 1, sides)

    @pytest.mark.parametrize("value", NONFINITE)
    def test_regular_rejects_nonfinite_center_and_radius(self, value: float):
        with pytest.raises(ValueError, match="center must be finite"):
            Polygon.regular(Point(value, 0), 1, 4)
        with pytest.raises(ValueError, match="radius must be finite"):
            Polygon.regular(Point.origin(), value, 4)

    def test_regular_rejects_coordinate_overflow(self):
        with pytest.raises(ValueError, match="remain finite"):
            Polygon.regular(Point(sys.float_info.max, 0), sys.float_info.max, 4)

    @pytest.mark.parametrize(
        "operation",
        [
            lambda polygon: polygon.translate(Vector2(float("inf"), 0)),
            lambda polygon: polygon.rotate(float("nan")),
            lambda polygon: polygon.rotate_around(Point(float("inf"), 0), 45),
            lambda polygon: polygon.scale(float("inf"), 1),
        ],
    )
    def test_transformations_reject_nonfinite_inputs(self, operation):
        polygon = Polygon.rect(Point.origin(), 1, 1)
        with pytest.raises(ValueError, match="finite"):
            operation(polygon)


class TestPortValidation:
    def test_rejects_empty_name(self):
        with pytest.raises(ValueError, match="name cannot be empty"):
            Port("", Point.origin(), Vector2.unit_x())

    @pytest.mark.parametrize("value", NONFINITE)
    def test_rejects_nonfinite_position(self, value: float):
        with pytest.raises(ValueError, match="position must be finite"):
            Port("p", Point(value, 0), Vector2.unit_x())

    @pytest.mark.parametrize("direction", [Vector2(), Vector2(0, -0.0)])
    def test_rejects_zero_direction(self, direction: Vector2):
        with pytest.raises(ValueError, match="cannot be zero"):
            Port("p", Point.origin(), direction)

    @pytest.mark.parametrize("value", NONFINITE)
    def test_rejects_nonfinite_direction(self, value: float):
        with pytest.raises(ValueError, match="direction must be finite"):
            Port("p", Point.origin(), Vector2(value, 1))

    def test_rejects_direction_with_overflowing_length(self):
        with pytest.raises(ValueError, match="finite length"):
            Port(
                "p",
                Point.origin(),
                Vector2(sys.float_info.max, sys.float_info.max),
            )

    @pytest.mark.parametrize("width", [0.0, -1.0, *NONFINITE])
    def test_rejects_invalid_width(self, width: float):
        with pytest.raises(ValueError, match="width must be"):
            Port("p", Point.origin(), Vector2.unit_x(), width)


class TestNativeCellRefValidation:
    def test_rejects_empty_target(self):
        with pytest.raises(ValueError, match="target cell name"):
            NativeCellRef("")
        with pytest.raises(ValueError, match="target cell name"):
            NativeCellRef._from_transform("", Transform.identity())

    @pytest.mark.parametrize("value", NONFINITE)
    def test_rejects_nonfinite_positions(self, value: float):
        ref = NativeCellRef("child")
        with pytest.raises(ValueError, match="position must be finite"):
            ref.at(value, 0)
        with pytest.raises(ValueError, match="position must be finite"):
            ref.at(0, value)

    @pytest.mark.parametrize("value", NONFINITE)
    def test_rejects_nonfinite_angles(self, value: float):
        with pytest.raises(ValueError, match="rotation must be finite"):
            NativeCellRef("child").rotate(value)

    def test_rejects_finite_angle_that_overflows_radian_conversion(self):
        with pytest.raises(ValueError, match="rotation must be finite"):
            NativeCellRef("child").rotate(sys.float_info.max)

    @pytest.mark.parametrize("scale", [0.0, *NONFINITE])
    def test_rejects_invalid_scales(self, scale: float):
        with pytest.raises(ValueError, match="finite and nonzero"):
            NativeCellRef("child").scale(scale)

    def test_rejects_noninvertible_transform_composition(self):
        ref = NativeCellRef("child").scale(1e200)
        with pytest.raises(ValueError, match=r"transform must be (finite|invertible)"):
            ref.scale(1e200)

    def test_accepts_extreme_finite_invertible_transform(self):
        assert NativeCellRef("child").scale(1e200).cell_name == "child"

    def test_port_transform_overflow_is_a_value_error(self):
        child = NativeCell("child")
        child.add_port(Port("p", Point(1e200, 0), Vector2.unit_x()))
        ref = NativeCellRef("child").scale(1e200)

        with pytest.raises(ValueError, match="invalid finite geometry"):
            ref.port("p", child)

    @pytest.mark.parametrize("dimension", [0, -1, 32768, 10**100])
    def test_arrays_reject_invalid_dimensions(self, dimension: int):
        ref = NativeCellRef("child")
        with pytest.raises(ValueError, match=r"\[1, 32767\]"):
            ref.array(dimension, 1, 1, 1)
        with pytest.raises(ValueError, match=r"\[1, 32767\]"):
            ref.array_vectors(dimension, 1, Vector2.unit_x(), Vector2.unit_y())

    @pytest.mark.parametrize("value", NONFINITE)
    def test_array_rejects_nonfinite_spacing(self, value: float):
        with pytest.raises(ValueError, match="spacing must be finite"):
            NativeCellRef("child").array(1, 1, value, 1)

    @pytest.mark.parametrize("value", NONFINITE)
    def test_array_vectors_reject_nonfinite_vectors(self, value: float):
        ref = NativeCellRef("child")
        with pytest.raises(ValueError, match="column vector must be finite"):
            ref.array_vectors(1, 1, Vector2(value, 0), Vector2.unit_y())
        with pytest.raises(ValueError, match="row vector must be finite"):
            ref.array_vectors(1, 1, Vector2.unit_x(), Vector2(0, value))

    def test_arrays_accept_boundary_dimensions_and_negative_finite_values(self):
        ref = NativeCellRef("child").scale(-1).at(-1, -2).rotate(-45)
        assert ref.array(32767, 1, -10, 0).cell_name == "child"
        assert ref.array_vectors(1, 32767, Vector2(-10, 0), Vector2(0, -20)).cell_name == "child"

    @pytest.mark.parametrize(
        "transform",
        [
            Transform.translate(float("inf"), 0),
            Transform.scale(0, 1),
            Transform.scale(2, 3),
        ],
    )
    def test_from_transform_rejects_invalid_or_non_gds_transform(self, transform: Transform):
        with pytest.raises(ValueError, match="Instance transform"):
            NativeCellRef._from_transform("child", transform)


class TestCellValidation:
    @pytest.mark.parametrize(
        ("points", "width", "message"),
        [
            ([Point.origin()], 1.0, "at least 2 points"),
            ([Point.origin(), Point(float("nan"), 0)], 1.0, "point 1 must be finite"),
            ([Point.origin(), Point(1, 0)], 0.0, "cannot be zero"),
            ([Point.origin(), Point(1, 0)], float("inf"), "width must be finite"),
        ],
    )
    def test_add_path_rejects_without_mutation(self, points, width: float, message: str):
        cell = NativeCell("cell")
        with pytest.raises(ValueError, match=message):
            cell.add_path(points, width, 1)
        assert cell.path_count() == 0

    def test_add_path_accepts_negative_width(self):
        cell = NativeCell("cell")
        cell.add_path([Point.origin(), Point(1, 0)], -0.5, 1)
        assert cell.path_count() == 1

    @pytest.mark.parametrize(
        ("position", "height", "message"),
        [
            (Point(float("nan"), 0), 1.0, "position must be finite"),
            (Point.origin(), float("inf"), "height must be finite"),
            (Point.origin(), 0.0, "height must be positive"),
            (Point.origin(), -1.0, "height must be positive"),
        ],
    )
    def test_add_text_rejects_without_mutation(self, position: Point, height: float, message: str):
        cell = NativeCell("cell")
        with pytest.raises(ValueError, match=message):
            cell.add_text("label", position, 1, height)
        assert cell.text_count() == 0

    def test_duplicate_port_rejection_is_atomic(self):
        cell = NativeCell("cell")
        cell.add_port(Port("p", Point.origin(), Vector2.unit_x()))
        with pytest.raises(ValueError, match="already contains a port"):
            cell.add_port(Port("p", Point(1, 0), Vector2.unit_y()))
        assert [port.name for port in cell.ports()] == ["p"]


class TestFacadeAtomicity:
    @pytest.mark.parametrize(
        "operation",
        [
            lambda child: child.at(float("nan"), 0),
            lambda child: child.at(0, 0).rotate(float("inf")),
            lambda child: child.at(0, 0).scale(0),
            lambda child: child.at(0, 0).array(1, 1, float("nan"), 1),
            lambda child: child.at(0, 0).array_vectors(
                1, 1, Vector2(float("inf"), 0), Vector2.unit_y()
            ),
        ],
    )
    def test_instance_builders_reject_invalid_values(self, operation):
        with pytest.raises(ValueError, match=r"finite|nonzero"):
            operation(Cell("child"))

    def test_failed_native_lowering_does_not_track_or_insert_child(self):
        child = Cell("child")
        parent = Cell("parent")
        invalid = Instance(child, Transform.scale(2, 3))

        with pytest.raises(ValueError, match="uniform non-zero scale"):
            parent.add_ref(invalid)

        assert parent.ref_count() == 0
        assert parent.cell_ref_names() == []

    @pytest.mark.parametrize(
        "transform",
        [
            Transform.translate(float("inf"), 0),
            Transform.scale(0, 1),
            Transform.scale(float("nan"), 1),
        ],
    )
    def test_instance_constructor_rejects_invalid_transform(self, transform: Transform):
        with pytest.raises(ValueError, match="finite and invertible"):
            Instance(Cell("child"), transform)

    def test_instance_accepts_extreme_invertible_nonuniform_transform(self):
        instance = Instance(Cell("child"), Transform.scale(1e200, 1e-200))
        transformed = instance.transform.apply(Point(1, 1))
        assert transformed.x == pytest.approx(1e200)
        assert transformed.y == pytest.approx(1e-200)

    def test_failed_finite_transform_chaining_leaves_prior_instance_valid(self):
        original = Instance(Cell("child"), Transform.scale_uniform(1e200))

        with pytest.raises(ValueError, match="finite and invertible"):
            original.scale(1e200)

        transformed = original.transform.apply(Point(1, 0))
        assert transformed.x == pytest.approx(1e200)
        assert transformed.y == 0.0

    def test_array_builder_rejects_overflowing_copy_transform(self):
        original = Cell("child").at(0, 0)
        with pytest.raises(ValueError, match="copy offset"):
            original.array(3, 1, sys.float_info.max, 0)
        assert original.array_shape == (1, 1)
