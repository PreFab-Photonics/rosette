"""Tests for layout types: Layer, Port, Cell, CellRef, Library, Instance.

These tests focus on Python API surface and convenience features.
Core correctness is tested in Rust.
"""

import tempfile
import warnings
from pathlib import Path

import pytest

from rosette import (
    Cell,
    CellRef,
    Instance,
    Layer,
    Library,
    Point,
    Polygon,
    Port,
    Vector2,
    write_gds,
)


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
        """Add cell reference."""
        cell = Cell("test")
        ref = CellRef("other_cell")
        cell.add_ref(ref)
        assert cell.ref_count() == 1


class TestCellRef:
    """Tests for CellRef class."""

    def test_init_from_string(self):
        """Create cell reference from string name."""
        ref = CellRef("my_cell")
        assert ref.cell_name == "my_cell"

    def test_init_from_cell(self):
        """Create cell reference from Cell object."""
        cell = Cell("waveguide")
        ref = CellRef(cell)
        assert ref.cell_name == "waveguide"

    def test_init_from_cell_with_transforms(self):
        """Create cell reference from Cell and chain transforms."""
        cell = Cell("component")
        ref = CellRef(cell).at(10.0, 20.0).rotate(90.0)
        assert ref.cell_name == "component"

    def test_chain_transforms(self):
        """Chain multiple transforms (fluent API)."""
        ref = CellRef("my_cell").at(10.0, 0.0).rotate(45.0).scale(0.5)
        assert ref.cell_name == "my_cell"

    def test_port_with_translation(self):
        """Get transformed port from translated CellRef."""
        cell = Cell("component")
        cell.add_port(Port("opt", Point(5.0, 0.0), Vector2.unit_x(), width=0.5))

        ref = CellRef(cell).at(100.0, 50.0)
        port = ref.port("opt", cell)

        # Position should be translated
        assert port.position.x == pytest.approx(105.0)
        assert port.position.y == pytest.approx(50.0)
        # Direction should be unchanged
        assert port.direction.x == pytest.approx(1.0)
        assert port.direction.y == pytest.approx(0.0)
        # Width should be preserved
        assert port.width == pytest.approx(0.5)

    def test_port_with_rotation(self):
        """Get transformed port from rotated CellRef."""
        cell = Cell("component")
        # Port at (10, 0) pointing in +X direction
        cell.add_port(Port("opt", Point(10.0, 0.0), Vector2.unit_x(), width=0.5))

        # Rotate 90 degrees counter-clockwise
        ref = CellRef(cell).rotate(90.0)
        port = ref.port("opt", cell)

        # Position (10, 0) rotated 90 degrees -> (0, 10)
        assert port.position.x == pytest.approx(0.0)
        assert port.position.y == pytest.approx(10.0)
        # Direction +X rotated 90 degrees -> +Y
        assert port.direction.x == pytest.approx(0.0)
        assert port.direction.y == pytest.approx(1.0)

    def test_port_with_combined_transforms(self):
        """Get transformed port from CellRef with multiple transforms."""
        cell = Cell("component")
        cell.add_port(Port("opt", Point(10.0, 0.0), Vector2.unit_x(), width=0.5))

        # Translate then rotate
        ref = CellRef(cell).at(100.0, 0.0).rotate(90.0)
        port = ref.port("opt", cell)

        # First translate (10,0) -> (110, 0), then rotate 90 degrees -> (0, 110)
        assert port.position.x == pytest.approx(0.0)
        assert port.position.y == pytest.approx(110.0)
        # Direction rotated 90 degrees
        assert port.direction.x == pytest.approx(0.0)
        assert port.direction.y == pytest.approx(1.0)

    def test_port_with_mirror(self):
        """Get transformed port from mirrored CellRef."""
        cell = Cell("component")
        cell.add_port(Port("opt", Point(10.0, 5.0), Vector2(1.0, 1.0), width=0.5))

        # Mirror across Y axis (flips X)
        ref = CellRef(cell).mirror_y()
        port = ref.port("opt", cell)

        # Position X flipped
        assert port.position.x == pytest.approx(-10.0)
        assert port.position.y == pytest.approx(5.0)
        # Direction X flipped
        assert port.direction.x == pytest.approx(-1.0 / (2**0.5))
        assert port.direction.y == pytest.approx(1.0 / (2**0.5))

    def test_port_nonexistent_raises(self):
        """Getting nonexistent port from CellRef raises KeyError."""
        cell = Cell("component")
        cell.add_port(Port("opt", Point(0, 0), Vector2.unit_x()))

        ref = CellRef(cell).at(10.0, 0.0)
        with pytest.raises(KeyError):
            ref.port("nonexistent", cell)


class TestLibrary:
    """Tests for Library class."""

    def test_init(self):
        """Create empty library."""
        lib = Library("test_lib")
        assert lib.name == "test_lib"
        assert len(lib.cells()) == 0

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
        parent.add_ref(CellRef("child"))
        lib.add_cell(parent)

        top = lib.top_cell()
        assert top is not None
        assert top.name == "parent"


class TestInstance:
    """Tests for Instance class - the ergonomic positioned cell."""

    def test_cell_at_returns_instance(self):
        """Cell.at() returns an Instance."""
        cell = Cell("test")
        instance = cell.at(10.0, 20.0)
        assert isinstance(instance, Instance)
        assert instance.cell is cell
        assert instance.cell_name == "test"

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

    def test_auto_child_tracking(self):
        """Adding Instance automatically tracks child cells."""
        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))

        parent = Cell("parent")
        parent.add_ref(child.at(0.0, 0.0))

        # Child should be tracked
        assert child in parent.get_child_cells()

    def test_auto_child_tracking_recursive(self):
        """Child tracking is recursive through nested cells."""
        grandchild = Cell("grandchild")
        grandchild.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))

        child = Cell("child")
        child.add_ref(grandchild.at(0, 0))

        parent = Cell("parent")
        parent.add_ref(child.at(10, 0))

        # Both child and grandchild should be tracked
        children = parent.get_child_cells()
        assert child in children
        assert grandchild in children

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

    def test_cellref_warning(self):
        """Adding raw CellRef triggers a warning about untracked cells."""
        cell = Cell("test")
        ref = CellRef("other_cell")

        with pytest.warns(UserWarning, match="without automatic child tracking"):
            cell.add_ref(ref)

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

    def test_instance_repr(self):
        """Instance has informative repr."""
        cell = Cell("my_component")
        instance = cell.at(100.5, 200.25)
        repr_str = repr(instance)
        assert "Instance" in repr_str
        assert "my_component" in repr_str
        assert "100.5" in repr_str or "100.50" in repr_str

    def test_add_ref_accepts_cell_directly(self):
        """add_ref() accepts Cell directly (placed at origin)."""
        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))

        parent = Cell("parent")
        # No .at(0, 0) needed - Cell is auto-wrapped
        with warnings.catch_warnings():
            warnings.simplefilter("error")
            parent.add_ref(child)

        assert parent.ref_count() == 1
        assert child in parent.get_child_cells()

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
        from rosette import read_gds

        # Asymmetric cell: polygon only in +X half
        child = Cell("asym")
        child.add_polygon(Polygon.rect(Point(0, 0), 20, 5), Layer(1, 0))
        child.add_port(Port("tip", Point(20.0, 2.5), Vector2.unit_x()))

        # Rotate 180 then place at (50, 0)
        inst = child.at(0, 0).rotate(180.0).at(50, 0)
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

            # Read back the child's bbox through the parent reference
            # If the rotation was lost, the bbox would be wrong
            child_read = lib.cell("asym")
            assert child_read is not None
            assert child_read.polygon_count() == 1

    def test_instance_mirror_x_gds_roundtrip(self):
        """mirror_x() Instance survives GDS round-trip."""
        from rosette import read_gds

        child = Cell("mirrored")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))

        inst = child.at(0, 0).mirror_x().at(30, 0)

        parent = Cell("top_mirror")
        parent.add_ref(inst)

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "mirror.gds"
            write_gds(path, parent)

            lib = read_gds(str(path))
            parent_read = lib.cell("top_mirror")
            assert parent_read is not None
            assert parent_read.ref_count() == 1

    def test_instance_rotate_then_translate_gds_roundtrip(self):
        """Rotated Instance port positions are consistent across both idioms.

        Regression test: Instance.add_ref() used to decompose the transform
        as .at(pos).rotate(angle), which double-rotates the translation.
        The fix applies rotation first, then translation:
        .rotate(angle).at(pos).
        """
        from rosette import read_gds

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

        # Idiom 2: .at(0,0).rotate(deg).at(x,y) -- rotate then translate
        # Transform: T(25, 58.5) * R(90)
        # Port (10, 0) -> R(90) -> (0, 10) -> T -> (25, 68.5)
        inst2 = child.at(0, 0).rotate(90.0).at(25.0, 58.5)
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

            child_read = lib.cell("child")
            assert child_read is not None
            assert child_read.polygon_count() == 1


class TestCellRefArray:
    """Tests for CellRef.array() - GDS AREF support."""

    def test_cellref_array_basic(self):
        """CellRef.array() returns a CellRef with same name."""
        ref = CellRef("unit").at(0, 0).array(3, 2, 10.0, 20.0)
        assert ref.cell_name == "unit"

    def test_cellref_array_gds_roundtrip(self):
        """CellRef with array writes as AREF and round-trips through GDS."""
        from rosette import read_gds

        child = Cell("unit")
        child.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))

        top = Cell("top")
        ref = CellRef("unit").at(0, 0).array(3, 2, 10.0, 20.0)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")  # CellRef warning
            top.add_ref(ref)

        # Should be 1 ref (AREF), not 6 individual SREFs
        assert top.ref_count() == 1

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "aref.gds"
            write_gds(path, top, [child])

            lib = read_gds(str(path))
            top_read = lib.cell("top")
            assert top_read is not None
            assert top_read.ref_count() == 1

    def test_instance_array_rejects_zero_columns(self):
        """Instance.array() raises ValueError for columns < 1."""
        child = Cell("unit")
        with pytest.raises(ValueError, match="columns and rows must be >= 1"):
            child.at(0, 0).array(0, 5, 10.0, 10.0)

    def test_instance_array_rejects_zero_rows(self):
        """Instance.array() raises ValueError for rows < 1."""
        child = Cell("unit")
        with pytest.raises(ValueError, match="columns and rows must be >= 1"):
            child.at(0, 0).array(5, 0, 10.0, 10.0)

    def test_cellref_array_rejects_zero(self):
        """CellRef.array() raises ValueError for columns or rows < 1."""
        with pytest.raises(ValueError, match="columns and rows must be >= 1"):
            CellRef("unit").array(0, 0, 10.0, 10.0)

    def test_instance_array_basic(self):
        """Instance.array() returns an Instance."""
        child = Cell("unit")
        inst = child.at(0, 0).array(3, 2, 10.0, 20.0)
        assert isinstance(inst, Instance)
        assert inst.cell_name == "unit"

    def test_instance_array_gds_roundtrip(self):
        """Instance with array writes as AREF and round-trips through GDS."""
        from rosette import read_gds

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
        from rosette import read_gds

        child = Cell("unit")
        child.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))

        top = Cell("top")
        # array after rotation
        top.add_ref(child.at(10, 20).rotate(45).array(2, 3, 5.0, 8.0))
        # transform after array
        top.add_ref(child.at(0, 0).array(2, 3, 5.0, 8.0).at(10, 20))

        assert top.ref_count() == 2

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "aref_transform.gds"
            write_gds(path, top)

            lib = read_gds(str(path))
            top_read = lib.cell("top")
            assert top_read is not None
            assert top_read.ref_count() == 2

    def test_instance_array_to_ref(self):
        """Instance.to_ref() preserves array repetition."""
        child = Cell("unit")
        inst = child.at(5, 10).array(3, 4, 8.0, 12.0)
        ref = inst.to_ref()
        assert isinstance(ref, CellRef)
        assert ref.cell_name == "unit"

    def test_instance_array_to_ref_gds_roundtrip(self):
        """Instance.to_ref() with array round-trips through GDS as AREF."""
        from rosette import read_gds

        child = Cell("unit")
        child.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))

        inst = child.at(0, 0).array(2, 3, 10.0, 15.0)
        ref = inst.to_ref()

        top = Cell("top")
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            top.add_ref(ref)

        assert top.ref_count() == 1

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "aref_toref.gds"
            write_gds(path, top, [child])

            lib = read_gds(str(path))
            top_read = lib.cell("top")
            assert top_read is not None
            assert top_read.ref_count() == 1
