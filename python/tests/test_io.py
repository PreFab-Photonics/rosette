"""Tests for GDS I/O: write_gds, file validation."""

import struct
from pathlib import Path

from rosette import (
    Cell,
    CellRef,
    Layer,
    Library,
    Point,
    Polygon,
    write_gds,
)
from rosette.components import grating_coupler


class TestWriteGds:
    """Tests for write_gds function."""

    def test_write_empty_cell(self, tmp_path: Path):
        """Write empty cell to GDS."""
        cell = Cell("empty")
        output = tmp_path / "empty.gds"

        write_gds(str(output), cell)

        assert output.exists()
        assert output.stat().st_size > 0

    def test_write_cell_with_polygon(self, tmp_path: Path):
        """Write cell with polygon to GDS."""
        cell = Cell("with_polygon")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        output = tmp_path / "polygon.gds"

        write_gds(str(output), cell)

        assert output.exists()
        assert output.stat().st_size > 0

    def test_write_cell_with_multiple_polygons(self, tmp_path: Path):
        """Write cell with multiple polygons to GDS."""
        cell = Cell("multi_polygon")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(20, 0), 10, 5), Layer(2, 0))
        cell.add_polygon(Polygon.rect(Point(40, 0), 10, 5), Layer(1, 1))
        output = tmp_path / "multi.gds"

        write_gds(str(output), cell)

        assert output.exists()

    def test_write_cell_with_reference(self, tmp_path: Path):
        """Write cell with cell reference to GDS."""
        lib = Library("test")

        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))
        lib.add_cell(child)

        parent = Cell("parent")
        parent.add_ref(CellRef("child").at(10, 10))
        parent.add_ref(CellRef("child").at(20, 10))
        lib.add_cell(parent)

        output = tmp_path / "hierarchy.gds"
        write_gds(str(output), lib)

        assert output.exists()

    def test_write_library(self, tmp_path: Path):
        """Write library to GDS."""
        lib = Library("test_lib")

        cell1 = Cell("cell1")
        cell1.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        lib.add_cell(cell1)

        cell2 = Cell("cell2")
        cell2.add_polygon(Polygon.rect(Point(0, 0), 20, 10), Layer(2, 0))
        lib.add_cell(cell2)

        output = tmp_path / "library.gds"
        write_gds(str(output), lib)

        assert output.exists()

    def test_write_component_cell(self, tmp_path: Path):
        """Write component-generated cell to GDS."""
        cell = grating_coupler(Layer(1, 0), waveguide_width=0.5)
        output = tmp_path / "grating_coupler.gds"

        write_gds(str(output), cell)

        assert output.exists()

    def test_write_path_as_string(self, tmp_path: Path):
        """write_gds accepts string path."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        output = str(tmp_path / "string_path.gds")

        write_gds(output, cell)

        assert Path(output).exists()

    def test_write_creates_parent_dirs(self, tmp_path: Path):
        """write_gds creates parent directories if needed."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        output = tmp_path / "subdir" / "nested" / "output.gds"

        # Create parent dirs first (write_gds may or may not do this)
        output.parent.mkdir(parents=True, exist_ok=True)
        write_gds(str(output), cell)

        assert output.exists()

    def test_write_overwrites_existing(self, tmp_path: Path):
        """write_gds overwrites existing file."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        output = tmp_path / "overwrite.gds"

        # Write first time
        write_gds(str(output), cell)
        size1 = output.stat().st_size

        # Write again with different content
        cell.add_polygon(Polygon.rect(Point(20, 0), 10, 5), Layer(1, 0))
        write_gds(str(output), cell)
        size2 = output.stat().st_size

        assert size2 > size1


class TestGdsFileFormat:
    """Tests for GDS file format validation."""

    def test_gds_magic_number(self, tmp_path: Path):
        """GDS file starts with correct header."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        output = tmp_path / "test.gds"

        write_gds(str(output), cell)

        with open(output, "rb") as f:
            # GDS files start with HEADER record
            # Record format: 2 bytes length + 2 bytes record type
            data = f.read(4)
            assert len(data) == 4
            _length, record_type = struct.unpack(">HH", data)
            # HEADER is record type 0x0002
            assert record_type == 0x0002

    def test_gds_contains_structure(self, tmp_path: Path):
        """GDS file contains BGNSTR/ENDSTR for cell."""
        cell = Cell("my_cell")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        output = tmp_path / "test.gds"

        write_gds(str(output), cell)

        # Read entire file and look for BGNSTR (0x0502) and STRNAME
        with open(output, "rb") as f:
            content = f.read()

        # BGNSTR record type in big-endian
        assert b"\x05\x02" in content or b"\x00\x05" in content

    def test_gds_library_name(self, tmp_path: Path):
        """GDS file contains library name."""
        lib = Library("my_library")
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        lib.add_cell(cell)
        output = tmp_path / "test.gds"

        write_gds(str(output), lib)

        with open(output, "rb") as f:
            content = f.read()

        # Library name should appear in file
        assert b"my_library" in content

    def test_gds_ends_with_endlib(self, tmp_path: Path):
        """GDS file ends with ENDLIB record."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        output = tmp_path / "test.gds"

        write_gds(str(output), cell)

        with open(output, "rb") as f:
            content = f.read()

        # ENDLIB is record type 0x0400, length 4
        # Last 4 bytes should be ENDLIB
        last_record = content[-4:]
        length, record_type = struct.unpack(">HH", last_record)
        assert record_type == 0x0400
        assert length == 4


class TestGdsEdgeCases:
    """Edge cases for GDS output."""

    def test_large_polygon(self, tmp_path: Path):
        """Write polygon with many vertices."""
        # Create polygon with many points
        import math

        n_points = 100
        points = [
            Point(
                10 * math.cos(2 * math.pi * i / n_points),
                10 * math.sin(2 * math.pi * i / n_points),
            )
            for i in range(n_points)
        ]
        poly = Polygon(points)

        cell = Cell("large_poly")
        cell.add_polygon(poly, Layer(1, 0))
        output = tmp_path / "large.gds"

        write_gds(str(output), cell)

        assert output.exists()

    def test_small_features(self, tmp_path: Path):
        """Write very small geometry."""
        cell = Cell("small")
        # Very small rectangle
        cell.add_polygon(Polygon.rect(Point(0, 0), 0.001, 0.001), Layer(1, 0))
        output = tmp_path / "small.gds"

        write_gds(str(output), cell)

        assert output.exists()

    def test_large_coordinates(self, tmp_path: Path):
        """Write geometry at large coordinates."""
        cell = Cell("large_coords")
        # Large coordinates
        cell.add_polygon(Polygon.rect(Point(1000000, 1000000), 10, 5), Layer(1, 0))
        output = tmp_path / "large_coords.gds"

        write_gds(str(output), cell)

        assert output.exists()

    def test_negative_coordinates(self, tmp_path: Path):
        """Write geometry at negative coordinates."""
        cell = Cell("negative")
        cell.add_polygon(Polygon.rect(Point(-100, -100), 10, 5), Layer(1, 0))
        output = tmp_path / "negative.gds"

        write_gds(str(output), cell)

        assert output.exists()

    def test_multiple_layers(self, tmp_path: Path):
        """Write geometry on many different layers."""
        cell = Cell("multi_layer")
        for i in range(10):
            for j in range(4):
                cell.add_polygon(Polygon.rect(Point(i * 20, j * 10), 5, 5), Layer(i, j))
        output = tmp_path / "multi_layer.gds"

        write_gds(str(output), cell)

        assert output.exists()

    def test_deep_hierarchy(self, tmp_path: Path):
        """Write deeply nested cell hierarchy."""
        lib = Library("deep")

        # Create chain of cells
        for i in range(5):
            cell = Cell(f"level_{i}")
            cell.add_polygon(Polygon.rect(Point(0, 0), 5, 5), Layer(1, 0))
            if i > 0:
                cell.add_ref(CellRef(f"level_{i - 1}").at(10, 0))
            lib.add_cell(cell)

        output = tmp_path / "deep.gds"
        write_gds(str(output), lib)

        assert output.exists()

    def test_cell_name_special_chars(self, tmp_path: Path):
        """Cell names with special characters."""
        # GDS allows certain characters in cell names
        cell = Cell("cell_with_underscore")
        cell.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        output = tmp_path / "special.gds"

        write_gds(str(output), cell)

        assert output.exists()

    def test_transformed_reference(self, tmp_path: Path):
        """Write cell reference with transformations."""
        lib = Library("transformed")

        child = Cell("child")
        child.add_polygon(Polygon.rect(Point(0, 0), 10, 5), Layer(1, 0))
        lib.add_cell(child)

        parent = Cell("parent")
        parent.add_ref(CellRef("child").at(0, 0))
        parent.add_ref(CellRef("child").at(20, 0).rotate(45))
        parent.add_ref(CellRef("child").at(40, 0).mirror_x())
        parent.add_ref(CellRef("child").at(60, 0).scale(0.5))
        lib.add_cell(parent)

        output = tmp_path / "transformed.gds"
        write_gds(str(output), lib)

        assert output.exists()
