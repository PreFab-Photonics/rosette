"""Tests for layout types: Layer, Port, Cell, Library, Instance.

These tests focus on Python API surface and convenience features.
Core correctness is tested in Rust.
"""

import tempfile
import warnings
from pathlib import Path

import pytest

from rosette import (
    BBox,
    Cell,
    Instance,
    Layer,
    Library,
    PathCap,
    Point,
    Polygon,
    Port,
    Transform,
    Vector2,
)
from rosette.io import write_gds
from rosette.layout import ArrayCopy
from rosette.routing import Route


class TestLayer:
    """Tests for Layer class."""

    def test_init_number_only(self):
        """Create layer with number only."""
        layer = Layer(1)
        assert layer.number == 1
        assert layer.datatype == 0

    def test_init_with_datatype(self):
        """Create layer with number and datatype."""
        layer = Layer(1, 2)
        assert layer.number == 1
        assert layer.datatype == 2

    def test_equality(self):
        """Layer equality comparison."""
        layer1 = Layer(1, 0)
        layer2 = Layer(1, 0)
        layer3 = Layer(1, 1)
        assert layer1 == layer2
        assert layer1 != layer3

    def test_hash(self):
        """Layer can be used in sets/dicts."""
        layer1 = Layer(1, 0)
        layer2 = Layer(1, 0)
        layer3 = Layer(2, 0)
        layer_set = {layer1, layer2, layer3}
        assert len(layer_set) == 2


class TestPort:
    """Tests for Port class."""

    def test_init_minimal(self):
        """Create port with required arguments."""
        port = Port("in", Point(0, 0), Vector2.unit_x())
        assert port.name == "in"
        assert port.position.x == 0.0
        assert port.width is None

    def test_init_with_width(self):
        """Create port with width."""
        port = Port("out", Point(10, 0), Vector2.unit_x(), width=0.5)
        assert port.width == pytest.approx(0.5)

    def test_angle(self):
        """Port angle from direction vector."""
        east = Port("e", Point(0, 0), Vector2.unit_x())
        north = Port("n", Point(0, 0), Vector2.unit_y())
        assert east.angle() == pytest.approx(0.0)
        assert north.angle() == pytest.approx(90.0)


class TestCell:
    """Tests for Cell class."""

    def test_init(self):
        """Create empty cell."""
        cell = Cell("test")
        assert cell.name == "test"
        assert cell.polygon_count() == 0
        assert cell.ref_count() == 0

    def test_add_polygon_layer_types(self):
        """Add polygon with different layer type variants."""
        cell = Cell("test")
        poly = Polygon.rect(Point(0, 0), 10, 5)

        # Layer object
        cell.add_polygon(poly, Layer(1, 0))
        assert cell.polygon_count() == 1

        # Int (convenience)
        cell.add_polygon(poly, 2)  # type: ignore[arg-type]
        assert cell.polygon_count() == 2

        # Tuple (convenience)
        cell.add_polygon(poly, (3, 1))  # type: ignore[arg-type]
        assert cell.polygon_count() == 3

    def test_add_port(self):
        """Add port to cell."""
        cell = Cell("test")
        port = Port("in", Point(0, 0), Vector2.unit_x(), width=0.5)
        cell.add_port(port)
        assert len(cell.ports()) == 1

    def test_get_port_by_name(self):
        """Get port by name."""
        cell = Cell("test")
        port = Port("in", Point(0, 0), Vector2.unit_x(), width=0.5)
        cell.add_port(port)
        retrieved = cell.port("in")
        assert retrieved is not None
        assert retrieved.name == "in"

    def test_get_nonexistent_port(self):
        """Getting nonexistent port raises KeyError."""
        cell = Cell("test")
        with pytest.raises(KeyError):
            cell.port("nonexistent")

    def test_bbox(self):
        """Cell bbox encompasses all polygons."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        bbox = cell.bbox()
        assert bbox is not None
        assert bbox.width() == pytest.approx(10.0)
        assert bbox.height() == pytest.approx(5.0)

    def test_add_ref(self):
        """Add a resolved child instance."""
        child = Cell("child")
        parent = Cell("parent")
        parent.add_ref(child.at(0, 0))
        assert parent.ref_count() == 1


class TestLibrary:
    """Tests for Library class."""

    def test_init(self):
        """Create empty library."""
        lib = Library("test_lib")
        assert lib.name == "test_lib"
        assert len(lib.cells()) == 0
        assert lib.roots() == []
        assert lib.top_cell() is None

    def test_add_and_get_cell(self):
        """Add and retrieve cell by name."""
        lib = Library("test_lib")
        cell = Cell("my_cell")
        lib.add_cell(cell)
        assert len(lib.cells()) == 1

        retrieved = lib.cell("my_cell")
        assert retrieved is not None
        assert retrieved.name == "my_cell"

    def test_get_nonexistent_cell(self):
        """Getting nonexistent cell returns None."""
        lib = Library("test_lib")
        assert lib.cell("nonexistent") is None

    def test_top_cell_hierarchy(self):
        """Top cell in hierarchy is the one not referenced."""
        lib = Library("test_lib")

        # Child cell
        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))
        lib.add_cell(child)

        # Parent cell that references child
        parent = Cell("parent")
        parent.add_ref(child.at(0, 0))
        lib.add_cell(parent)

        top = lib.top_cell()
        assert top is not None
        assert top.name == "parent"

    def test_roots_do_not_depend_on_insertion_order(self):
        """Structural roots are derived from references, not append order."""
        child = Cell("child")
        parent = Cell("parent")
        parent.add_ref(child.at(0, 0))
        independent = Cell("independent")
        lib = Library("test_lib")

        lib.add_cell(parent)
        lib.add_cell(independent)
        lib.add_cell(child)

        assert [cell.name for cell in lib.roots()] == ["parent", "independent"]
        assert lib.top_cell() is None

    def test_explicit_top_selects_multi_root_entry(self):
        """Explicit top resolves ambiguity without changing structural roots."""
        lib = Library("test_lib")
        lib.add_cell(Cell("root_a"))
        lib.add_cell(Cell("root_b"))

        lib.set_top_cell("root_b")
        assert lib.top_cell() is not None
        assert lib.top_cell().name == "root_b"
        assert [cell.name for cell in lib.roots()] == ["root_a", "root_b"]

        with pytest.raises(ValueError, match="does not exist"):
            lib.set_top_cell("missing")
        assert lib.top_cell().name == "root_b"

        lib.clear_top_cell()
        assert lib.top_cell() is None

    def test_add_cell_duplicate_policy(self):
        """Duplicate behavior is explicit and leaves the original installed."""
        lib = Library("test_lib")
        original = Cell("cell")
        lib.add_cell(original)

        with pytest.raises(ValueError, match="already exists"):
            lib.add_cell(Cell("cell"))
        lib.add_cell(Cell("cell"), on_duplicate="keep")
        assert len(lib.cells()) == 1

        with pytest.raises(ValueError, match="on_duplicate"):
            lib.add_cell(Cell("other"), on_duplicate="replace")  # type: ignore[arg-type]
        assert lib.cell("other") is None

    def test_recursive_add_is_atomic_on_missing_reference(self):
        """Malformed native hierarchies fail without partial insertion."""
        from rosette._core import Cell as CoreCell
        from rosette._core import CellRef as CoreCellRef

        root = CoreCell("root")
        root.add_ref(CoreCellRef("missing"))
        lib = Library("test_lib")

        with pytest.raises(ValueError, match="missing reference"):
            lib.add_cell_recursive(root, [])
        assert lib.cells() == []

    def test_recursive_add_rejects_cycles(self):
        """Cycles are reported instead of silently truncated."""
        from rosette._core import Cell as CoreCell
        from rosette._core import CellRef as CoreCellRef

        cell_a = CoreCell("A")
        cell_a.add_ref(CoreCellRef("B"))
        cell_b = CoreCell("B")
        cell_b.add_ref(CoreCellRef("A"))
        lib = Library("test_lib")

        with pytest.raises(ValueError, match="cycle"):
            lib.add_cell_recursive(cell_a, [cell_a, cell_b])
        assert lib.cells() == []

    def test_recursive_add_uses_explicit_duplicate_policy(self):
        """Existing dependencies can be retained or rejected atomically."""
        child = Cell("child")
        parent = Cell("parent")
        parent.add_ref(child.at(0, 0))
        lib = Library("test_lib")
        lib.add_cell(child)

        with pytest.raises(ValueError, match="already exists"):
            lib.add_cell_recursive(parent, [child], on_duplicate="error")
        assert lib.cell("parent") is None

        lib.add_cell_recursive(parent, [child])
        assert [cell.name for cell in lib.cells()] == ["child", "parent"]
        assert lib.top_cell() is not None
        assert lib.top_cell().name == "parent"

    def test_add_cell_validates_cells_created_outside_constructor(self):
        """Library keeps GDS name validation for route-produced cells."""
        route = Route(Layer(1))
        route.start_at(0, 0)
        route.to(1, 0)
        route.end_at(1, 0)
        invalid = route.to_cell("has space")
        with pytest.raises(ValueError, match="invalid character"):
            Library("test_lib").add_cell(invalid)


class TestInstance:
    """Tests for Instance class - the ergonomic positioned cell."""

    def test_cell_at_returns_instance(self):
        """Cell.at() returns an Instance."""
        cell = Cell("test")
        instance = cell.at(10.0, 20.0)
        assert isinstance(instance, Instance)
        assert instance.cell is cell
        assert instance.cell.name == "test"

    def test_instance_port_without_cell_argument(self):
        """Instance.port() doesn't require passing the cell again."""
        cell = Cell("component")
        cell.add_port(Port("opt", Point(5.0, 0.0), Vector2.unit_x(), width=0.5))

        # Old pattern: ref.port("opt", cell) - redundant!
        # New pattern: instance.port("opt") - no redundancy!
        instance = cell.at(100.0, 50.0)
        port = instance.port("opt")

        # Position should be translated
        assert port.position.x == pytest.approx(105.0)
        assert port.position.y == pytest.approx(50.0)
        # Width preserved
        assert port.width == pytest.approx(0.5)

    def test_instance_chaining(self):
        """Instance supports transform chaining."""
        cell = Cell("component")
        cell.add_port(Port("opt", Point(10.0, 0.0), Vector2.unit_x()))

        # Chain multiple transforms
        instance = cell.at(0.0, 0.0).rotate(90.0)
        port = instance.port("opt")

        # Position (10, 0) rotated 90 degrees -> (0, 10)
        assert port.position.x == pytest.approx(0.0)
        assert port.position.y == pytest.approx(10.0)

    def test_add_ref_with_instance(self):
        """Cell.add_ref() accepts Instance directly."""
        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))

        parent = Cell("parent")
        # No warning with Instance
        with warnings.catch_warnings():
            warnings.simplefilter("error")  # Fail if any warning
            parent.add_ref(child.at(0.0, 0.0))

        assert parent.ref_count() == 1

    def test_add_ref_records_direct_child_name(self):
        """Adding Instance records the direct hierarchy edge."""
        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))

        parent = Cell("parent")
        parent.add_ref(child.at(0.0, 0.0))

        assert parent.cell_ref_names() == ["child"]

    def test_auto_child_tracking_recursive(self):
        """Child tracking is recursive through nested cells."""
        grandchild = Cell("grandchild")
        grandchild.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))

        child = Cell("child")
        child.add_ref(grandchild.at(0, 0))

        parent = Cell("parent")
        parent.add_ref(child.at(10, 0))

        assert parent.cell_ref_names() == ["child"]
        assert child.cell_ref_names() == ["grandchild"]

    def test_write_gds_auto_collects_cells(self):
        """write_gds() auto-collects child cells from Instance tracking."""
        child1 = Cell("child1")
        child1.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))

        child2 = Cell("child2")
        child2.add_polygon(Polygon.rect(Point(0, 0), 5, 10), Layer(1, 0))

        top = Cell("top")
        top.add_ref(child1.at(0, 0))
        top.add_ref(child2.at(20, 0))

        # Write without explicit cell list - should work!
        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "test.gds"
            write_gds(path, top)  # No [child1, child2] needed!
            assert path.exists()
            assert path.stat().st_size > 0

    def test_add_ref_rejects_unresolved_objects(self):
        """The facade accepts only resolved Instance placements."""
        cell = Cell("test")
        with pytest.raises(TypeError, match="must be an Instance"):
            cell.add_ref(object())  # type: ignore[arg-type]

    def test_instance_mirror(self):
        """Instance mirror transforms work correctly."""
        cell = Cell("component")
        cell.add_port(Port("opt", Point(10.0, 5.0), Vector2.unit_x()))

        # Mirror across Y axis
        instance = cell.at(0, 0).mirror_y()
        port = instance.port("opt")

        # X position should be negated
        assert port.position.x == pytest.approx(-10.0)
        assert port.position.y == pytest.approx(5.0)

    def test_instance_scale(self):
        """Instance scale transforms work correctly."""
        cell = Cell("component")
        cell.add_port(Port("opt", Point(10.0, 5.0), Vector2.unit_x()))

        instance = cell.at(0, 0).scale(2.0)
        port = instance.port("opt")

        # Position should be scaled
        assert port.position.x == pytest.approx(20.0)
        assert port.position.y == pytest.approx(10.0)

    def test_instance_scale_is_preserved_by_native_lowering_and_gds(self):
        """Uniform scale is identical in ports, hierarchy geometry, and GDS."""
        from rosette.io import read_gds

        child = Cell("scaled_child")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))

        parent = Cell("scaled_parent")
        parent.add_ref(child.at(0, 0).scale(2).translate(30, 40))

        library = Library("scaled")
        library.add_cell(child)
        library.add_cell(parent)
        bbox = library.cell_bbox("scaled_parent")
        assert bbox is not None
        assert (bbox.min.x, bbox.min.y) == pytest.approx((30, 40))
        assert (bbox.max.x, bbox.max.y) == pytest.approx((50, 50))

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "scaled.gds"
            write_gds(path, parent)
            roundtrip = read_gds(path).cell_bbox("scaled_parent")

        assert roundtrip is not None
        assert (roundtrip.min.x, roundtrip.min.y) == pytest.approx((30, 40))
        assert (roundtrip.max.x, roundtrip.max.y) == pytest.approx((50, 50))

    def test_instance_rejects_non_gds_transform_when_added(self):
        """A placed instance must lower to rotation/reflection/uniform scale."""
        child = Cell("child")
        parent = Cell("parent")
        instance = Instance(child, Transform.scale(2, 3))

        with pytest.raises(ValueError, match="uniform non-zero scale"):
            parent.add_ref(instance)

        assert parent.ref_count() == 0
        assert parent.cell_ref_names() == []

    def test_instance_rejects_nearly_uniform_nonuniform_scale(self):
        child = Cell("child")
        parent = Cell("parent")

        with pytest.raises(ValueError, match="uniform non-zero scale"):
            parent.add_ref(Instance(child, Transform.scale(1.0, 1.0 + 9e-10)))

    def test_instance_accepts_tiny_scale_after_large_translation(self):
        child = Cell("child")
        parent = Cell("parent")
        instance = child.at(0, 0).scale(1e-10).translate(2_000_000, -2_000_000)

        parent.add_ref(instance)

        assert parent.ref_count() == 1
        assert parent.cell_ref_names() == ["child"]

    @pytest.mark.parametrize("scale", [1e-100, 1e200])
    def test_instance_rejects_scale_outside_gds_real_range(self, scale: float):
        child = Cell("child")
        parent = Cell("parent")

        with pytest.raises(ValueError, match="uniform non-zero scale"):
            parent.add_ref(child.at(0, 0).scale(scale))

        assert parent.ref_count() == 0
        assert parent.cell_ref_names() == []

    def test_instance_constructor_hides_repetition(self):
        child = Cell("child")

        with pytest.raises(TypeError, match="unexpected keyword argument"):
            Instance(child, repetition=(1, 2, 3))  # type: ignore[arg-type]

    def test_instance_copy_rejects_non_integer_indices(self):
        child = Cell("child")
        child.add_port(Port("out", Point.origin(), Vector2.unit_x()))
        array = child.at(0, 0).array(2, 2, 10, 10)

        with pytest.raises(TypeError, match="must be integers"):
            array.copy(0.5, 0)  # type: ignore[arg-type]
        with pytest.raises(TypeError, match="must be integers"):
            array.copy(True, 0)  # type: ignore[arg-type]

    def test_instance_repr(self):
        """Instance has informative repr."""
        cell = Cell("my_component")
        instance = cell.at(100.5, 200.25)
        repr_str = repr(instance)
        assert "Instance" in repr_str
        assert "my_component" in repr_str
        assert "100.5" in repr_str or "100.50" in repr_str

    def test_add_ref_rejects_cell_directly(self):
        """add_ref() requires explicit origin placement."""
        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))

        parent = Cell("parent")
        with pytest.raises(TypeError, match=r"use cell\.at\(0, 0\)"):
            parent.add_ref(child)

        assert parent.ref_count() == 0
        assert parent.cell_ref_names() == []

    def test_instance_rotate_180_port_direction(self):
        """180-degree rotation correctly flips port direction.

        Regression test: _is_mirrored_y() used to check dx < 0, which
        is true for any rotation > 90 degrees, falsely triggering a
        mirror that cancelled the rotation in both port queries and
        GDS output.
        """
        cell = Cell("component")
        cell.add_port(Port("opt", Point(10.0, 0.0), Vector2.unit_x()))

        instance = cell.at(0, 0).rotate(180.0)
        port = instance.port("opt")

        # Position (10, 0) rotated 180 -> (-10, 0)
        assert port.position.x == pytest.approx(-10.0)
        assert port.position.y == pytest.approx(0.0)
        # Direction (1, 0) rotated 180 -> (-1, 0)
        assert port.direction.x == pytest.approx(-1.0)
        assert port.direction.y == pytest.approx(0.0)

    def test_instance_rotate_270_port_direction(self):
        """270-degree rotation correctly transforms port direction."""
        cell = Cell("component")
        cell.add_port(Port("opt", Point(10.0, 0.0), Vector2.unit_x()))

        instance = cell.at(0, 0).rotate(270.0)
        port = instance.port("opt")

        # Position (10, 0) rotated 270 -> (0, -10)
        assert port.position.x == pytest.approx(0.0)
        assert port.position.y == pytest.approx(-10.0)
        # Direction (1, 0) rotated 270 -> (0, -1)
        assert port.direction.x == pytest.approx(0.0)
        assert port.direction.y == pytest.approx(-1.0)

    def test_instance_mirror_y_port_direction(self):
        """mirror_y() correctly flips port direction X component."""
        cell = Cell("component")
        cell.add_port(Port("opt", Point(10.0, 5.0), Vector2.unit_x()))

        instance = cell.at(0, 0).mirror_y()
        port = instance.port("opt")

        # Position X negated
        assert port.position.x == pytest.approx(-10.0)
        assert port.position.y == pytest.approx(5.0)
        # Direction X negated
        assert port.direction.x == pytest.approx(-1.0)
        assert port.direction.y == pytest.approx(0.0)

    def test_instance_mirror_x_port_direction(self):
        """mirror_x() correctly flips port direction Y component."""
        cell = Cell("component")
        cell.add_port(Port("opt", Point(10.0, 5.0), Vector2(0.0, 1.0)))

        instance = cell.at(0, 0).mirror_x()
        port = instance.port("opt")

        # Position Y negated
        assert port.position.x == pytest.approx(10.0)
        assert port.position.y == pytest.approx(-5.0)
        # Direction Y negated
        assert port.direction.x == pytest.approx(0.0)
        assert port.direction.y == pytest.approx(-1.0)

    def test_instance_rotate_180_gds_roundtrip(self):
        """180-degree rotated Instance survives GDS round-trip.

        Regression test: the broken _is_mirrored_y() caused add_ref()
        to emit a spurious mirror_y that cancelled the 180-degree
        rotation, making the GDS reference appear unrotated.
        """
        from rosette.io import read_gds

        # Asymmetric cell: polygon only in +X half
        child = Cell("asym")
        child.add_polygon(Polygon.rect(Point(0, 0), 20, 5), Layer(1, 0))
        child.add_port(Port("tip", Point(20.0, 2.5), Vector2.unit_x()))

        # Rotate 180 then place at (50, 0)
        inst = child.at(0, 0).rotate(180.0).translate(50, 0)
        port = inst.port("tip")

        # Port position: (20, 2.5) -> R(180) -> (-20, -2.5) -> T(50,0) -> (30, -2.5)
        assert port.position.x == pytest.approx(30.0)
        assert port.position.y == pytest.approx(-2.5)
        # Direction should be flipped
        assert port.direction.x == pytest.approx(-1.0)
        assert port.direction.y == pytest.approx(0.0)

        parent = Cell("top")
        parent.add_ref(inst)

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "rot180.gds"
            write_gds(path, parent)

            lib = read_gds(str(path))
            parent_read = lib.cell("top")
            assert parent_read is not None
            assert parent_read.ref_count() == 1

            bbox = lib.cell_bbox("top")
            assert bbox is not None
            assert (bbox.min.x, bbox.min.y) == pytest.approx((30.0, -5.0))
            assert (bbox.max.x, bbox.max.y) == pytest.approx((50.0, 0.0))

            # Read back the child's bbox through the parent reference
            # If the rotation was lost, the bbox would be wrong
            child_read = lib.cell("asym")
            assert child_read is not None
            assert child_read.polygon_count() == 1

    def test_instance_mirror_x_gds_roundtrip(self):
        """mirror_x() Instance survives GDS round-trip."""
        from rosette.io import read_gds

        child = Cell("mirrored")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))

        inst = child.at(0, 0).mirror_x().translate(30, 0)

        parent = Cell("top_mirror")
        parent.add_ref(inst)

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "mirror.gds"
            write_gds(path, parent)

            lib = read_gds(str(path))
            parent_read = lib.cell("top_mirror")
            assert parent_read is not None
            assert parent_read.ref_count() == 1

            bbox = lib.cell_bbox("top_mirror")
            assert bbox is not None
            assert (bbox.min.x, bbox.min.y) == pytest.approx((30.0, -5.0))
            assert (bbox.max.x, bbox.max.y) == pytest.approx((40.0, 0.0))

    def test_instance_rotate_then_translate_gds_roundtrip(self):
        """Rotated Instance port positions are consistent across both idioms.

        Regression test: Cell.add_ref(instance) used to decompose the transform
        as .at(pos).rotate(angle), which double-rotates the translation.
        The fix preserves rotation followed by parent-frame translation:
        .rotate(angle).translate(pos).
        """
        from rosette.io import read_gds

        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        child.add_port(Port("out", Point(10.0, 0.0), Vector2.unit_x()))

        # Idiom 1: .at(x,y).rotate(deg) -- translate then rotate around origin
        # Transform: R(90) * T(25, 58.5)
        # Port (10, 0) -> T -> (35, 58.5) -> R(90) -> (-58.5, 35)
        inst1 = child.at(25.0, 58.5).rotate(90.0)
        p1 = inst1.port("out")
        assert p1.position.x == pytest.approx(-58.5, abs=0.1)
        assert p1.position.y == pytest.approx(35.0, abs=0.1)

        # Idiom 2: .at(0,0).rotate(deg).translate(x,y)
        # Transform: T(25, 58.5) * R(90)
        # Port (10, 0) -> R(90) -> (0, 10) -> T -> (25, 68.5)
        inst2 = child.at(0, 0).rotate(90.0).translate(25.0, 58.5)
        p2 = inst2.port("out")
        assert p2.position.x == pytest.approx(25.0, abs=0.1)
        assert p2.position.y == pytest.approx(68.5, abs=0.1)

        # Write both to GDS and verify they round-trip (ref count preserved,
        # child cell intact)
        parent = Cell("parent")
        parent.add_ref(inst1)
        parent.add_ref(inst2)

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "rotated.gds"
            write_gds(path, parent)

            lib = read_gds(str(path))
            parent_read = lib.cell("parent")
            assert parent_read is not None
            assert parent_read.ref_count() == 2

            bbox = lib.cell_bbox("parent")
            assert bbox is not None
            assert (bbox.min.x, bbox.min.y) == pytest.approx((-63.5, 25.0))
            assert (bbox.max.x, bbox.max.y) == pytest.approx((25.0, 68.5))

            child_read = lib.cell("child")
            assert child_read is not None
            assert child_read.polygon_count() == 1


class TestInstanceArray:
    """Tests for Instance.array() and GDS AREF support."""

    def test_instance_array_rejects_zero_columns(self):
        """Instance.array() raises ValueError for columns < 1."""
        child = Cell("unit")
        with pytest.raises(ValueError, match=r"columns and rows must be in \[1, 32767\]"):
            child.at(0, 0).array(0, 5, 10.0, 10.0)

    def test_instance_array_rejects_zero_rows(self):
        """Instance.array() raises ValueError for rows < 1."""
        child = Cell("unit")
        with pytest.raises(ValueError, match=r"columns and rows must be in \[1, 32767\]"):
            child.at(0, 0).array(5, 0, 10.0, 10.0)

    def test_instance_array_rejects_columns_above_gds_max(self):
        """Instance.array() raises ValueError for columns > 32767 (GDS INT16 limit)."""
        child = Cell("unit")
        with pytest.raises(ValueError, match=r"columns and rows must be in \[1, 32767\]"):
            child.at(0, 0).array(100_000, 1, 10.0, 10.0)
        # Just over the boundary — still rejected.
        with pytest.raises(ValueError, match=r"columns and rows must be in \[1, 32767\]"):
            child.at(0, 0).array(32768, 1, 10.0, 10.0)

    def test_instance_array_rejects_rows_above_gds_max(self):
        """Instance.array() raises ValueError for rows > 32767 (GDS INT16 limit)."""
        child = Cell("unit")
        with pytest.raises(ValueError, match=r"columns and rows must be in \[1, 32767\]"):
            child.at(0, 0).array(1, 100_000, 10.0, 10.0)
        with pytest.raises(ValueError, match=r"columns and rows must be in \[1, 32767\]"):
            child.at(0, 0).array(1, 32768, 10.0, 10.0)

    def test_instance_array_accepts_gds_max(self):
        """Instance.array() accepts 32767 (the exact GDS INT16 upper bound)."""
        child = Cell("unit")
        inst = child.at(0, 0).array(32767, 32767, 1.0, 1.0)
        assert inst.cell.name == "unit"

    def test_instance_array_above_u16_max_raises_value_error(self):
        """Values > 65535 still raise ValueError (not PyO3's OverflowError).

        Without the Python-side check, PyO3's u16 coercion would raise
        OverflowError for values above 65535; the wrapper normalizes to
        ValueError.
        """
        child = Cell("unit")
        with pytest.raises(ValueError, match=r"columns and rows must be in \[1, 32767\]"):
            child.at(0, 0).array(1_000_000, 1, 10.0, 10.0)
        with pytest.raises(ValueError, match=r"columns and rows must be in \[1, 32767\]"):
            child.at(0, 0).array(1, 1_000_000, 10.0, 10.0)

    def test_instance_array_basic(self):
        """Instance.array() returns an Instance."""
        child = Cell("unit")
        inst = child.at(0, 0).array(3, 2, 10.0, 20.0)
        assert isinstance(inst, Instance)
        assert inst.cell.name == "unit"

    def test_instance_array_gds_roundtrip(self):
        """Instance with array writes as AREF and round-trips through GDS."""
        from rosette.io import read_gds

        child = Cell("unit")
        child.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))

        top = Cell("top")
        arr = child.at(0, 0).array(4, 3, 15.0, 25.0)
        top.add_ref(arr)

        # Should be 1 ref (AREF), not 12 individual SREFs
        assert top.ref_count() == 1

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "aref_inst.gds"
            write_gds(path, top)

            lib = read_gds(str(path))
            top_read = lib.cell("top")
            assert top_read is not None
            assert top_read.ref_count() == 1

    def test_instance_array_preserves_transforms(self):
        """Instance.array() with rotation round-trips through GDS."""
        from rosette.io import read_gds

        child = Cell("unit")
        child.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))

        top = Cell("top")
        # array after rotation
        top.add_ref(child.at(10, 20).rotate(45).array(2, 3, 5.0, 8.0))
        # transform after array
        translated = child.at(0, 0).array(2, 3, 5.0, 8.0).translate(10, 20)
        top.add_ref(translated)

        assert translated.copy(0, 0).position == Point(10, 20)
        assert translated.copy(1, 2).position == Point(15, 36)

        assert top.ref_count() == 2

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "aref_transform.gds"
            write_gds(path, top)

            lib = read_gds(str(path))
            top_read = lib.cell("top")
            assert top_read is not None
            assert top_read.ref_count() == 2

    def test_array_accepts_negative_spacing(self):
        """Negative col_spacing/row_spacing place copies along -X/-Y.

        This is well-defined GDS AREF behavior and is relied on by the
        viewer's ArrayDialog (which flips row_spacing to map screen-Y-down
        onto world-Y-up before dispatching to the Rust core).

        The test builds a 3x2 array of a 5x5 unit cell with both pitches
        negative, round-trips it through GDS, and checks that the resolved
        bounding box extends into the negative quadrant exactly as
        predicted by mirroring the positive-pitch case.
        """
        from rosette.io import read_gds

        child = Cell("unit")
        child.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))

        top = Cell("top")
        # 3 columns at pitch -10 → origins at x = 0, -10, -20
        # 2 rows    at pitch -15 → origins at y = 0, -15
        # Each copy spans [origin, origin + 5) on both axes.
        top.add_ref(child.at(0, 0).array(3, 2, -10.0, -15.0))

        # Check the in-memory bbox before writing.
        lib = Library("lib")
        lib.add_cell(child)
        lib.add_cell(top)
        bb = lib.cell_bbox("top")
        assert bb is not None
        assert bb.min.x == pytest.approx(-20.0)
        assert bb.min.y == pytest.approx(-15.0)
        assert bb.max.x == pytest.approx(5.0)
        assert bb.max.y == pytest.approx(5.0)

        # Round-trip through GDS and re-check the bbox.
        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "aref_neg.gds"
            write_gds(path, top)

            lib_read = read_gds(str(path))
            top_read = lib_read.cell("top")
            assert top_read is not None
            assert top_read.ref_count() == 1  # still a single AREF

            bb_read = lib_read.cell_bbox("top")
            assert bb_read is not None
            assert bb_read.min.x == pytest.approx(-20.0)
            assert bb_read.min.y == pytest.approx(-15.0)
            assert bb_read.max.x == pytest.approx(5.0)
            assert bb_read.max.y == pytest.approx(5.0)


class TestLibraryCellBbox:
    """Tests for Library.cell_bbox() — the fully-resolved bounding box.

    Regression tests for ROS-509: Cell.bbox() skipped cell references
    entirely, so arrayed designs reported only the prototype's bbox (or
    None when the top cell had no direct polygons of its own).
    """

    def test_single_sref(self):
        """Parent with an SREF reports the transformed child bbox."""
        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))

        top = Cell("top")
        top.add_ref(child.at(20, 0))

        lib = Library("lib")
        lib.add_cell(child)
        lib.add_cell(top)

        bb = lib.cell_bbox("top")
        assert bb is not None
        assert bb.min.x == pytest.approx(20.0)
        assert bb.min.y == pytest.approx(0.0)
        assert bb.max.x == pytest.approx(30.0)
        assert bb.max.y == pytest.approx(5.0)

    def test_aref_matches_ros509_snippet(self):
        """ROS-509 exact scenario: 5x3 AREF of a 10x10 child at pitch (20, 20)."""
        child = Cell("unit")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 10), Layer(1, 0))

        top = Cell("top")
        top.add_ref(child.at(0, 0).array(5, 3, 20.0, 20.0))

        lib = Library("lib")
        lib.add_cell(child)
        lib.add_cell(top)

        bb = lib.cell_bbox("top")
        assert bb is not None
        # 5 columns at pitch 20, last origin at x=80, width 10 → max x = 90.
        # 3 rows at pitch 20, last origin at y=40, height 10 → max y = 50.
        assert bb.min.x == pytest.approx(0.0)
        assert bb.min.y == pytest.approx(0.0)
        assert bb.max.x == pytest.approx(90.0)
        assert bb.max.y == pytest.approx(50.0)

    def test_top_with_only_refs_no_longer_reports_none(self):
        """Regression: Cell.bbox() returns None for a cell with only refs.

        Before the fix, write_gds build summary would report 'empty' for a
        top cell that only contained CellRefs. Library.cell_bbox resolves
        the hierarchy and returns the true extent.
        """
        child = Cell("unit")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 10), Layer(1, 0))

        top = Cell("top")
        top.add_ref(child.at(100, 200))

        # Local bbox is still None (top has no direct polygons)
        assert top.bbox() is None

        lib = Library("lib")
        lib.add_cell(child)
        lib.add_cell(top)

        # Library-resolved bbox is correct
        bb = lib.cell_bbox("top")
        assert bb is not None
        assert bb.min.x == pytest.approx(100.0)
        assert bb.max.x == pytest.approx(110.0)

    def test_cell_bbox_includes_paths_in_local_cell(self):
        """Cell.bbox() now includes paths, not just polygons."""
        cell = Cell("with_path")
        cell.add_path([Point(0, 0), Point(10, 0)], 2.0, Layer(1, 0))

        bb = cell.bbox()
        assert bb is not None
        # Ribbon of width 2 centered on y=0 → extends y=-1 to y=+1.
        assert bb.min.x == pytest.approx(0.0)
        assert bb.min.y == pytest.approx(-1.0)
        assert bb.max.x == pytest.approx(10.0)
        assert bb.max.y == pytest.approx(1.0)

    def test_cell_path_cap_keyword_controls_endpoint_geometry(self):
        cell = Cell("round_path")
        cell.add_path(
            [Point(0, 0), Point(10, 0)],
            2.0,
            Layer(1, 0),
            cap=PathCap.ROUND,
        )

        bb = cell.bbox()
        assert bb is not None
        assert bb.min.x == pytest.approx(-1.0)
        assert bb.max.x == pytest.approx(11.0)

    def test_missing_cell_returns_none(self):
        lib = Library("lib")
        assert lib.cell_bbox("does_not_exist") is None

    def test_nested_hierarchy(self):
        """Nested hierarchy: unit < group (2x1 AREF) < top (SREF of group)."""
        unit = Cell("unit")
        unit.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))

        group = Cell("group")
        group.add_ref(unit.at(0, 0).array(2, 1, 10.0, 0.0))

        top = Cell("top")
        top.add_ref(group.at(100, 50))

        lib = Library("lib")
        lib.add_cell(unit)
        lib.add_cell(group)
        lib.add_cell(top)

        bb = lib.cell_bbox("top")
        assert bb is not None
        # group bbox = (0,0)-(15,5); shifted by (100,50) → (100,50)-(115,55).
        assert bb.min.x == pytest.approx(100.0)
        assert bb.min.y == pytest.approx(50.0)
        assert bb.max.x == pytest.approx(115.0)
        assert bb.max.y == pytest.approx(55.0)

    def test_returns_bbox_instance(self):
        """Return type is the Python BBox wrapper."""
        cell = Cell("c")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 10), Layer(1, 0))
        lib = Library("lib")
        lib.add_cell(cell)
        assert isinstance(lib.cell_bbox("c"), BBox)

    def test_rotated_aref_matches_gds_roundtrip(self):
        """ROS-517: rotated AREF placement is consistent viewer ↔ writer.

        Before the fix, flatten/viewer/cell_bbox applied the AREF pitch in
        the *parent* frame while the GDS writer applied it in the
        the reference's local (pre-transform) frame. They only agreed for
        axis-aligned AREFs. This test builds a rotated AREF, writes it to
        GDS, reads it back, and asserts that the fully-resolved bounding
        box matches — which is the round-trip invariant the two code
        paths must share.
        """
        from rosette.io import read_gds

        child = Cell("unit")
        child.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))

        top = Cell("top")
        # 2x1 AREF rotated 90° — the case where writer and flatten used
        # to diverge. Local copies at (0,0) and (10,0); after rotating
        # 90° ccw, copies should sit at world (0,0) and (0,10).
        top.add_ref(child.at(0, 0).rotate(90).array(2, 1, 10.0, 0.0))

        lib = Library("lib")
        lib.add_cell(child)
        lib.add_cell(top)

        # Fully-resolved bbox via the Rust flatten path.
        bb_flat = lib.cell_bbox("top")
        assert bb_flat is not None

        # Local 2x1 union: (0,0)-(15,5). Rotated 90° ccw → (-5, 0)-(0, 15).
        assert bb_flat.min.x == pytest.approx(-5.0)
        assert bb_flat.min.y == pytest.approx(0.0)
        assert bb_flat.max.x == pytest.approx(0.0)
        assert bb_flat.max.y == pytest.approx(15.0)

        # Round-trip through GDS and re-measure — must match.
        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "rotated_aref.gds"
            write_gds(path, top, [child])

            lib_rt = read_gds(str(path))
            bb_rt = lib_rt.cell_bbox("top")
            assert bb_rt is not None

            assert bb_rt.min.x == pytest.approx(bb_flat.min.x, abs=1e-6)
            assert bb_rt.min.y == pytest.approx(bb_flat.min.y, abs=1e-6)
            assert bb_rt.max.x == pytest.approx(bb_flat.max.x, abs=1e-6)
            assert bb_rt.max.y == pytest.approx(bb_flat.max.y, abs=1e-6)


class TestSkewedArefs:
    """ROS-512: AREFs with non-orthogonal (hex / skewed) lattice vectors."""

    def test_hex_packing_bbox_matches_analytic(self):
        """Hex-packed AREF flattens to the expected bounding box."""
        import math

        unit = Cell("unit")
        unit.add_polygon(Polygon.rect(Point(0, 0), 1.0, 1.0), Layer(1, 0))

        pitch = 10.0
        col = Vector2(pitch, 0.0)
        row = Vector2(pitch / 2.0, pitch * math.sqrt(3) / 2.0)

        top = Cell("top")
        top.add_ref(unit.at(0, 0).array_vectors(3, 2, col, row))

        lib = Library("lib")
        lib.add_cell(unit)
        lib.add_cell(top)

        bb = lib.cell_bbox("top")
        assert bb is not None
        # Copies span (0,0)..(2,0) along col + (0,0)..(1,0) along row.
        # Each unit is 1x1. Max x = 2*pitch + pitch/2 + 1 = 26.
        # Max y = pitch * sqrt(3)/2 + 1.
        assert bb.min.x == pytest.approx(0.0, abs=1e-9)
        assert bb.min.y == pytest.approx(0.0, abs=1e-9)
        assert bb.max.x == pytest.approx(2 * pitch + pitch / 2.0 + 1.0, abs=1e-9)
        assert bb.max.y == pytest.approx(pitch * math.sqrt(3) / 2.0 + 1.0, abs=1e-9)

    def test_skewed_aref_roundtrips_through_gds(self):
        """Acceptance: skewed AREF vectors are preserved on GDS round-trip.

        Before ROS-512 the reader collapsed each world-space lattice
        vector to a scalar magnitude, silently discarding any off-axis
        component. This test guards against that regression by comparing
        the fully-resolved bbox before and after a GDS write/read cycle.
        """
        import math

        from rosette.io import read_gds

        unit = Cell("unit")
        unit.add_polygon(Polygon.rect(Point(0, 0), 1.0, 1.0), Layer(1, 0))

        pitch = 10.0
        col = Vector2(pitch, 0.0)
        row = Vector2(pitch / 2.0, pitch * math.sqrt(3) / 2.0)

        top = Cell("top")
        top.add_ref(unit.at(0, 0).array_vectors(4, 3, col, row))

        lib = Library("lib")
        lib.add_cell(unit)
        lib.add_cell(top)

        bb_before = lib.cell_bbox("top")
        assert bb_before is not None

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "hex.gds"
            write_gds(path, top, [unit])

            lib_rt = read_gds(str(path))
            bb_after = lib_rt.cell_bbox("top")
            assert bb_after is not None

            # GDS stores coordinates on a DB-unit grid (default 1 nm = 1e-3 µm);
            # per-copy quantization accumulates across the array.  Compare
            # to within a small multiple of the grid.
            tol = 1e-3
            assert bb_after.min.x == pytest.approx(bb_before.min.x, abs=tol)
            assert bb_after.min.y == pytest.approx(bb_before.min.y, abs=tol)
            assert bb_after.max.x == pytest.approx(bb_before.max.x, abs=tol)
            assert bb_after.max.y == pytest.approx(bb_before.max.y, abs=tol)

    def test_array_vectors_degenerates_to_array_for_rectangular_case(self):
        """`array_vectors` with axis-aligned vectors matches `array`."""
        unit = Cell("unit")
        unit.add_polygon(Polygon.rect(Point(0, 0), 1.0, 1.0), Layer(1, 0))

        top_scalar = Cell("top_scalar")
        top_scalar.add_ref(unit.at(0, 0).array(3, 2, 5.0, 7.0))

        top_vec = Cell("top_vec")
        top_vec.add_ref(unit.at(0, 0).array_vectors(3, 2, Vector2(5.0, 0.0), Vector2(0.0, 7.0)))

        lib = Library("lib")
        lib.add_cell(unit)
        lib.add_cell(top_scalar)
        lib.add_cell(top_vec)

        bb_s = lib.cell_bbox("top_scalar")
        bb_v = lib.cell_bbox("top_vec")
        assert bb_s is not None and bb_v is not None
        assert bb_v.min.x == pytest.approx(bb_s.min.x)
        assert bb_v.min.y == pytest.approx(bb_s.min.y)
        assert bb_v.max.x == pytest.approx(bb_s.max.x)
        assert bb_v.max.y == pytest.approx(bb_s.max.y)

    def test_instance_array_vectors_roundtrips(self):
        """`Instance.array_vectors` lowers to GDS without losing its lattice."""
        import math

        from rosette.io import read_gds

        unit = Cell("unit")
        unit.add_polygon(Polygon.rect(Point(0, 0), 1.0, 1.0), Layer(1, 0))

        pitch = 10.0
        arr = unit.at(0, 0).array_vectors(
            3,
            2,
            Vector2(pitch, 0.0),
            Vector2(pitch / 2.0, pitch * math.sqrt(3) / 2.0),
        )

        top = Cell("top")
        top.add_ref(arr)

        lib = Library("lib")
        lib.add_cell(unit)
        lib.add_cell(top)

        bb_before = lib.cell_bbox("top")
        assert bb_before is not None

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "hex_instance.gds"
            write_gds(path, top, [unit])
            bb_after = read_gds(str(path)).cell_bbox("top")
            assert bb_after is not None
            tol = 1e-3  # one GDS DB unit (1 nm) in µm
            assert bb_after.min.x == pytest.approx(bb_before.min.x, abs=tol)
            assert bb_after.max.x == pytest.approx(bb_before.max.x, abs=tol)
            assert bb_after.max.y == pytest.approx(bb_before.max.y, abs=tol)

    def test_array_vectors_validates_dims(self):
        """Dim validation applies to `array_vectors` too."""
        unit = Cell("unit")
        unit.add_polygon(Polygon.rect(Point(0, 0), 1.0, 1.0), Layer(1, 0))

        with pytest.raises(ValueError):
            unit.at(0, 0).array_vectors(0, 1, Vector2(1, 0), Vector2(0, 1))
        with pytest.raises(ValueError):
            unit.at(0, 0).array_vectors(1, 0, Vector2(1, 0), Vector2(0, 1))
        with pytest.raises(ValueError):
            unit.at(0, 0).array_vectors(100_000, 1, Vector2(1, 0), Vector2(0, 1))


class TestArrayCopies:
    """Tests for Instance.copies() and per-copy port access (ROS-510).

    Arrayed instances store a single GDS AREF. These APIs let callers
    enumerate the individual copies and query their transformed ports
    *without* dropping the AREF or allocating ``columns * rows``
    extra SREFs.
    """

    def _unit_cell(self, with_port: bool = True) -> Cell:
        c = Cell("unit")
        c.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))
        if with_port:
            # Port anchored at local (0, 2.5) facing -X.
            c.add_port(Port("in", Point(0, 2.5), Vector2(-1, 0), 0.5))
        return c

    def test_array_shape_non_arrayed(self):
        """array_shape is (1, 1) on a plain instance."""
        inst = self._unit_cell(False).at(10, 20)
        assert inst.array_shape == (1, 1)

    def test_array_shape_arrayed(self):
        """array_shape reports (columns, rows)."""
        inst = self._unit_cell(False).at(0, 0).array(4, 3, 15.0, 25.0)
        assert inst.array_shape == (4, 3)

    def test_instance_is_not_a_collection(self):
        inst = self._unit_cell(False).at(0, 0).array(4, 3, 15.0, 25.0)

        with pytest.raises(TypeError):
            iter(inst)
        with pytest.raises(TypeError):
            len(inst)

    def test_copies_length_matches_grid(self):
        """list(inst.copies()) has length columns * rows."""
        inst = self._unit_cell(False).at(0, 0).array(4, 3, 15.0, 25.0)
        assert len(list(inst.copies())) == 12

    def test_copies_non_arrayed_yields_single(self):
        """A non-arrayed instance yields exactly one copy at (0, 0)."""
        inst = self._unit_cell(False).at(100, 50)
        out = list(inst.copies())
        assert len(out) == 1
        assert out[0].col == 0 and out[0].row == 0
        assert out[0].position.x == 100.0
        assert out[0].position.y == 50.0

    def test_copies_yields_array_copy_not_instance(self):
        """Iteration yields ArrayCopy, not Instance (avoids accidental add_ref)."""
        inst = self._unit_cell(False).at(0, 0).array(2, 2, 10.0, 10.0)
        for copy in inst.copies():
            assert isinstance(copy, ArrayCopy)
            assert not isinstance(copy, Instance)

    def test_array_copy_coordinates_are_read_only(self):
        instance = self._unit_cell(False).at(0, 0).array(2, 2, 10.0, 10.0)
        copy = next(instance.copies())

        with pytest.raises(AttributeError):
            copy.col = 1  # type: ignore[misc]
        with pytest.raises(AttributeError):
            copy.row = 1  # type: ignore[misc]

    def test_copies_column_major_order(self):
        """Copies are yielded in column-major order: col varies fastest."""
        inst = self._unit_cell(False).at(0, 0).array(3, 2, 10.0, 20.0)
        order = [(c.col, c.row) for c in inst.copies()]
        assert order == [(0, 0), (1, 0), (2, 0), (0, 1), (1, 1), (2, 1)]

    def test_copies_positions_rectangular(self):
        """Per-copy positions follow the rectangular lattice."""
        inst = self._unit_cell(False).at(0, 0).array(3, 2, 10.0, 20.0)
        positions = {(c.col, c.row): (c.position.x, c.position.y) for c in inst.copies()}
        assert positions[(0, 0)] == (0.0, 0.0)
        assert positions[(2, 0)] == (20.0, 0.0)
        assert positions[(0, 1)] == (0.0, 20.0)
        assert positions[(2, 1)] == (20.0, 20.0)

    def test_copies_positions_with_translation(self):
        """Outer translation shifts every copy uniformly."""
        inst = self._unit_cell(False).at(100, 50).array(2, 2, 10.0, 10.0)
        positions = {(c.col, c.row): (c.position.x, c.position.y) for c in inst.copies()}
        assert positions[(0, 0)] == (100.0, 50.0)
        assert positions[(1, 0)] == (110.0, 50.0)
        assert positions[(0, 1)] == (100.0, 60.0)
        assert positions[(1, 1)] == (110.0, 60.0)

    def test_copies_positions_with_rotation(self):
        """Outer rotation rotates the whole lattice around the origin.

        Local layout is copies at (0,0), (10,0), (20,0). Rotating the
        whole array 90° CCW sends (x, y) to (-y, x), so copies end up
        at (0,0), (0,10), (0,20).
        """
        inst = self._unit_cell(False).at(0, 0).array(3, 1, 10.0, 0.0).rotate(90)
        positions = {(c.col, c.row): (c.position.x, c.position.y) for c in inst.copies()}
        tol = 1e-9
        assert abs(positions[(0, 0)][0] - 0.0) < tol
        assert abs(positions[(0, 0)][1] - 0.0) < tol
        assert abs(positions[(1, 0)][0] - 0.0) < tol
        assert abs(positions[(1, 0)][1] - 10.0) < tol
        assert abs(positions[(2, 0)][0] - 0.0) < tol
        assert abs(positions[(2, 0)][1] - 20.0) < tol

    def test_copies_hex_lattice(self):
        """copies() walks a non-orthogonal lattice via array_vectors."""
        import math

        pitch = 10.0
        inst = (
            self._unit_cell(False)
            .at(0, 0)
            .array_vectors(
                2,
                2,
                Vector2(pitch, 0.0),
                Vector2(pitch / 2.0, pitch * math.sqrt(3.0) / 2.0),
            )
        )
        positions = {(c.col, c.row): (c.position.x, c.position.y) for c in inst.copies()}
        tol = 1e-9
        assert abs(positions[(0, 1)][0] - pitch / 2.0) < tol
        assert abs(positions[(0, 1)][1] - pitch * math.sqrt(3.0) / 2.0) < tol
        # Second row, second column: col_vec + row_vec.
        assert abs(positions[(1, 1)][0] - (pitch + pitch / 2.0)) < tol
        assert abs(positions[(1, 1)][1] - pitch * math.sqrt(3.0) / 2.0) < tol

    def test_copy_access_matches_iteration(self):
        """copy(col, row) returns the same validated view as copies()."""
        inst = self._unit_cell().at(5, 5).array(3, 2, 10.0, 20.0)
        for copy in inst.copies():
            direct = inst.copy(copy.col, copy.row)
            assert direct.position.x == copy.position.x
            assert direct.position.y == copy.position.y
            assert direct.port("in").position.x == copy.port("in").position.x
            assert direct.port("in").position.y == copy.port("in").position.y

    def test_copy_port_transforms_direction(self):
        """Port direction is rotated by the outer transform, untouched by copy offset."""
        inst = self._unit_cell().at(0, 0).array(3, 1, 10.0, 0.0).rotate(90)
        # Local direction (-1, 0) rotated 90° CCW -> (0, -1).
        for copy in inst.copies():
            p = copy.port("in")
            assert abs(p.direction.x - 0.0) < 1e-9
            assert abs(p.direction.y - (-1.0)) < 1e-9

    def test_instance_port_default_matches_legacy(self):
        """inst.port(name) with no col/row matches the pre-ROS-510 behaviour."""
        c = self._unit_cell()
        # Non-arrayed: should be identical to the single-copy transform.
        inst = c.at(100, 50).rotate(30)
        p_default = inst.port("in")
        p_copy = next(inst.copies()).port("in")
        assert p_default.position.x == p_copy.position.x
        assert p_default.position.y == p_copy.position.y

    def test_instance_port_arrayed_default_is_anchor(self):
        """inst.port(name) on an arrayed instance returns the (0, 0) copy."""
        inst = self._unit_cell().at(100, 50).array(3, 2, 10.0, 20.0)
        p_default = inst.port("in")
        p_anchor = inst.copy(0, 0).port("in")
        assert p_default.position.x == p_anchor.position.x
        assert p_default.position.y == p_anchor.position.y

    def test_copy_col_row_out_of_range_raises(self):
        """Out-of-range col/row raises IndexError."""
        inst = self._unit_cell().at(0, 0).array(3, 2, 10.0, 20.0)
        with pytest.raises(IndexError):
            inst.copy(3, 0)
        with pytest.raises(IndexError):
            inst.copy(0, 2)
        with pytest.raises(IndexError):
            inst.copy(-1, 0)

    def test_copies_does_not_mutate_parent(self):
        """Iterating doesn't change the parent's repetition or ref count."""
        inst = self._unit_cell(False).at(0, 0).array(3, 2, 10.0, 20.0)
        top = Cell("top")
        top.add_ref(inst)
        assert top.ref_count() == 1
        # Walk all copies.
        list(inst.copies())
        # AREF still a single ref.
        assert top.ref_count() == 1
        assert inst.array_shape == (3, 2)

    def test_copy_transform_round_trip_with_point(self):
        """copy.transform applied to local origin gives copy.position."""
        inst = self._unit_cell(False).at(10, 20).rotate(45).array(2, 2, 5.0, 8.0)
        for copy in inst.copies():
            via_transform = copy.transform.apply(Point.origin())
            assert abs(via_transform.x - copy.position.x) < 1e-9
            assert abs(via_transform.y - copy.position.y) < 1e-9
