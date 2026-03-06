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
