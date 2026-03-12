"""Tests for the semantic patcher (libcst-based)."""

from __future__ import annotations

import textwrap
from pathlib import Path

import pytest

from rosette._patcher import (
    AddElement,
    CodePatcher,
    DeleteElement,
    ModifyLayer,
    ModifyPathWidth,
    ModifyVertices,
    PatchResult,
    SemanticPatcher,
    WORLD_PER_UM,
)


@pytest.fixture
def patcher():
    return SemanticPatcher()


def um_to_world(x: float, y: float) -> tuple[float, float]:
    """Convert Python µm to WASM world coords (inverse of world_to_um)."""
    return (x * WORLD_PER_UM, -y * WORLD_PER_UM)


def write_source(tmp_path: Path, code: str) -> Path:
    """Write dedented source code to a temp file and return the path."""
    p = tmp_path / "design.py"
    p.write_text(textwrap.dedent(code))
    return p


# =============================================================================
# ModifyVertices
# =============================================================================


class TestModifyVertices:
    def test_single_line_polygon(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_polygon(Polygon([Point(0, 0), Point(10, 0), Point(5, 8)]), core)
        """)
        # New vertices: triangle with different coords
        x0, y0 = um_to_world(0, 0)
        x1, y1 = um_to_world(20, 0)
        x2, y2 = um_to_world(10, 15)

        result = patcher.apply(ModifyVertices(
            file=str(src), line=3, old_code=None,
            vertices=[x0, y0, x1, y1, x2, y2],
        ))

        assert result.success
        code = src.read_text()
        assert "Point(0, 0)" in code
        assert "Point(20, 0)" in code
        assert "Point(10, 15)" in code
        # Layer argument should be preserved
        assert "core" in code

    def test_multiline_polygon(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_polygon(
                Polygon([Point(0, 0), Point(30, 0), Point(15, 25)]),
                clad,
            )
        """)
        x0, y0 = um_to_world(1, 1)
        x1, y1 = um_to_world(2, 2)
        x2, y2 = um_to_world(3, 3)

        result = patcher.apply(ModifyVertices(
            file=str(src), line=3, old_code=None,
            vertices=[x0, y0, x1, y1, x2, y2],
        ))

        assert result.success
        code = src.read_text()
        assert "Point(1, 1)" in code
        assert "Point(2, 2)" in code
        assert "Point(3, 3)" in code
        assert "clad" in code

    def test_bare_list_in_add_polygon(self, tmp_path, patcher):
        """add_polygon([Point(...)], layer) without Polygon wrapper."""
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_polygon([Point(0, 0), Point(10, 0), Point(5, 8)], core)
        """)
        x0, y0 = um_to_world(100, 200)
        x1, y1 = um_to_world(300, 400)

        result = patcher.apply(ModifyVertices(
            file=str(src), line=3, old_code=None,
            vertices=[x0, y0, x1, y1],
        ))

        assert result.success
        code = src.read_text()
        assert "Point(100, 200)" in code
        assert "Point(300, 400)" in code

    def test_polygon_rect_stays_rect(self, tmp_path, patcher):
        """Polygon.rect() should update params when result is still a rectangle."""
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_polygon(Polygon.rect(Point(0, 0), 20, 10), core)
        """)
        # New rectangle: origin (5, 5), width 30, height 15
        # As vertices: (5,5), (35,5), (35,20), (5,20)
        verts = []
        for x, y in [(5, 5), (35, 5), (35, 20), (5, 20)]:
            wx, wy = um_to_world(x, y)
            verts.extend([wx, wy])

        result = patcher.apply(ModifyVertices(
            file=str(src), line=3, old_code=None, vertices=verts,
        ))

        assert result.success
        code = src.read_text()
        # Should still use Polygon.rect() with updated params
        assert "Polygon.rect(" in code
        assert "Point(5, 5)" in code
        assert ", 30," in code or ", 30)" in code
        assert "15" in code
        assert "core" in code

    def test_polygon_rect_converts_to_points(self, tmp_path, patcher):
        """Polygon.rect() converts to Polygon([...]) when result is not a rectangle."""
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_polygon(Polygon.rect(Point(0, 0), 20, 10), core)
        """)
        # Triangle (not a rectangle)
        verts = []
        for x, y in [(0, 0), (20, 0), (10, 15)]:
            wx, wy = um_to_world(x, y)
            verts.extend([wx, wy])

        result = patcher.apply(ModifyVertices(
            file=str(src), line=3, old_code=None, vertices=verts,
        ))

        assert result.success
        code = src.read_text()
        # Should have been converted to Polygon([Point(...)])
        assert "Polygon.rect" not in code
        assert "Polygon([" in code
        assert "Point(0, 0)" in code
        assert "Point(20, 0)" in code
        assert "Point(10, 15)" in code
        assert "core" in code

    def test_add_path_vertices(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_path([Point(0, 0), Point(10, 0)], core, width=0.5)
        """)
        x0, y0 = um_to_world(5, 5)
        x1, y1 = um_to_world(15, 5)

        result = patcher.apply(ModifyVertices(
            file=str(src), line=3, old_code=None,
            vertices=[x0, y0, x1, y1],
        ))

        assert result.success
        code = src.read_text()
        assert "Point(5, 5)" in code
        assert "Point(15, 5)" in code
        assert "width=0.5" in code

    def test_old_code_mismatch(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell.add_polygon(Polygon([Point(0, 0)]), core)
        """)
        result = patcher.apply(ModifyVertices(
            file=str(src), line=2, old_code="cell.add_polygon(WRONG)",
            vertices=[0, 0],
        ))
        assert not result.success
        assert "mismatch" in result.error

    def test_file_not_found(self, tmp_path, patcher):
        result = patcher.apply(ModifyVertices(
            file=str(tmp_path / "nonexistent.py"), line=1,
            old_code=None, vertices=[0, 0],
        ))
        assert not result.success
        assert "not found" in result.error

    def test_line_out_of_range(self, tmp_path, patcher):
        src = write_source(tmp_path, "x = 1\n")
        result = patcher.apply(ModifyVertices(
            file=str(src), line=99, old_code=None, vertices=[0, 0],
        ))
        assert not result.success
        assert "out of range" in result.error


# =============================================================================
# ModifyLayer
# =============================================================================


class TestModifyLayer:
    def test_replace_variable_layer(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_polygon(Polygon([Point(0, 0), Point(10, 0), Point(5, 8)]), core)
        """)
        result = patcher.apply(ModifyLayer(
            file=str(src), line=3, old_code=None, layer=5, datatype=2,
        ))

        assert result.success
        code = src.read_text()
        assert "Layer(5, 2)" in code
        # Geometry should be preserved
        assert "Point(0, 0)" in code

    def test_replace_layer_literal(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_polygon(Polygon([Point(0, 0)]), Layer(1, 0))
        """)
        result = patcher.apply(ModifyLayer(
            file=str(src), line=3, old_code=None, layer=3, datatype=1,
        ))

        assert result.success
        code = src.read_text()
        assert "Layer(3, 1)" in code

    def test_no_add_call_at_line(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            x = 42
        """)
        result = patcher.apply(ModifyLayer(
            file=str(src), line=2, old_code=None, layer=1,
        ))
        assert not result.success


# =============================================================================
# DeleteElement
# =============================================================================


class TestDeleteElement:
    def test_delete_single_line(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_polygon(Polygon([Point(0, 0), Point(10, 0), Point(5, 8)]), core)
            cell.add_polygon(Polygon([Point(20, 20)]), clad)
        """)
        result = patcher.apply(DeleteElement(
            file=str(src), line=3, old_code=None,
        ))

        assert result.success
        code = src.read_text()
        assert "Point(0, 0)" not in code
        # The other polygon should still be there
        assert "Point(20, 20)" in code

    def test_delete_preserves_other_lines(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_polygon(Polygon([Point(0, 0)]), core)
            x = 42
        """)
        result = patcher.apply(DeleteElement(
            file=str(src), line=3, old_code=None,
        ))

        assert result.success
        code = src.read_text()
        assert "x = 42" in code


# =============================================================================
# AddElement
# =============================================================================


class TestAddElement:
    def test_add_polygon_after_line(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_polygon(Polygon([Point(0, 0)]), Layer(1, 0))
        """)
        x0, y0 = um_to_world(10, 10)
        x1, y1 = um_to_world(20, 20)
        x2, y2 = um_to_world(30, 10)

        result = patcher.apply(AddElement(
            file=str(src), after_line=3, element_type="polygon",
            vertices=[x0, y0, x1, y1, x2, y2], layer=2, datatype=0,
            cell_var="cell",
        ))

        assert result.success
        code = src.read_text()
        lines = code.splitlines()
        assert len(lines) == 4
        assert "cell.add_polygon" in lines[3]
        assert "Point(10, 10)" in lines[3]
        assert "Layer(2, 0)" in lines[3]

    def test_add_path(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
        """)
        x0, y0 = um_to_world(0, 0)
        x1, y1 = um_to_world(100, 0)

        result = patcher.apply(AddElement(
            file=str(src), after_line=2, element_type="path",
            vertices=[x0, y0, x1, y1], layer=1, width=um_to_world(0.5, 0)[0],
            cell_var="cell",
        ))

        assert result.success
        code = src.read_text()
        assert "cell.add_path" in code
        assert "width=0.5" in code

    def test_preserves_indentation(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
                cell.add_polygon(Polygon([Point(0, 0)]), Layer(1, 0))
        """)
        x0, y0 = um_to_world(5, 5)

        result = patcher.apply(AddElement(
            file=str(src), after_line=3, element_type="polygon",
            vertices=[x0, y0], layer=1, cell_var="cell",
        ))

        assert result.success
        lines = src.read_text().splitlines()
        # New line should have same indent as line 3 (4 spaces from dedent + 4 extra = 4 extra)
        assert lines[3].startswith("    ")


# =============================================================================
# ModifyPathWidth
# =============================================================================


class TestModifyPathWidth:
    def test_modify_keyword_width(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_path([Point(0, 0), Point(10, 0)], core, width=0.5)
        """)
        # New width: 2.0 µm in world coords
        new_width_world = 2.0 * WORLD_PER_UM

        result = patcher.apply(ModifyPathWidth(
            file=str(src), line=3, old_code=None, width=new_width_world,
        ))

        assert result.success
        code = src.read_text()
        assert "width=2" in code

    def test_modify_positional_width(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell = Cell("top")
            cell.add_path([Point(0, 0), Point(10, 0)], core, 0.5)
        """)
        new_width_world = 3.0 * WORLD_PER_UM

        result = patcher.apply(ModifyPathWidth(
            file=str(src), line=3, old_code=None, width=new_width_world,
        ))

        assert result.success
        code = src.read_text()
        # The positional arg should now be 3
        assert ", 3)" in code or ", 3," in code

    def test_not_add_path(self, tmp_path, patcher):
        src = write_source(tmp_path, """\
            from rosette import *
            cell.add_polygon(Polygon([Point(0, 0)]), core)
        """)
        result = patcher.apply(ModifyPathWidth(
            file=str(src), line=2, old_code=None, width=50000,
        ))
        assert not result.success


# =============================================================================
# Formatting preservation
# =============================================================================


class TestFormattingPreservation:
    def test_untouched_lines_preserved(self, tmp_path, patcher):
        """Lines not involved in the edit should be byte-identical."""
        original = textwrap.dedent("""\
            from rosette import *

            # This is a comment with special chars: é à ü
            cell = Cell("top")
            cell.add_polygon(Polygon([Point(0, 0), Point(10, 0), Point(5, 8)]), core)
            x = 42  # trailing comment
        """)
        src = tmp_path / "design.py"
        src.write_text(original)

        x0, y0 = um_to_world(1, 1)
        x1, y1 = um_to_world(2, 2)
        x2, y2 = um_to_world(3, 3)

        patcher.apply(ModifyVertices(
            file=str(src), line=5, old_code=None,
            vertices=[x0, y0, x1, y1, x2, y2],
        ))

        new_lines = src.read_text().splitlines()
        original_lines = original.splitlines()

        # Lines 0-3 and 5 should be identical
        assert new_lines[0] == original_lines[0]
        assert new_lines[1] == original_lines[1]
        assert new_lines[2] == original_lines[2]
        assert new_lines[3] == original_lines[3]
        assert new_lines[5] == original_lines[5]


# =============================================================================
# Legacy CodePatcher (raw line replacement)
# =============================================================================


class TestCodePatcher:
    def test_patch_line(self, tmp_path):
        src = write_source(tmp_path, """\
            x = 1
            y = 2
        """)
        patcher = CodePatcher()
        result = patcher.patch_line(str(src), 1, old_code="x = 1", new_code="x = 42")
        assert result
        assert "x = 42" in src.read_text()

    def test_patch_line_old_code_mismatch(self, tmp_path):
        src = write_source(tmp_path, """\
            x = 1
        """)
        patcher = CodePatcher()
        result = patcher.patch_line(str(src), 1, old_code="x = 999", new_code="x = 42")
        assert not result
