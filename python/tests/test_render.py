"""Tests for the polygon rasterizer Python bindings."""

import pytest

from rosette import BBox, Cell, Layer, Library, Point, Polygon, RenderResult, render_png

PNG_MAGIC = b"\x89PNG\r\n\x1a\n"


@pytest.fixture
def two_layer_library() -> Library:
    """Library with two non-overlapping rectangles on different layers."""
    cell = Cell("test")
    cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))
    cell.add_polygon(Polygon.rect(Point(20.0, 0.0), 10.0, 10.0), Layer(2, 0))
    lib = Library("test_lib")
    lib.add_cell(cell)
    return lib


class TestRenderPng:
    def test_returns_render_result(self, two_layer_library: Library):
        result = render_png(two_layer_library, width=256)
        assert isinstance(result, RenderResult)

    def test_png_bytes_have_magic_header(self, two_layer_library: Library):
        result = render_png(two_layer_library, width=256)
        assert result.png.startswith(PNG_MAGIC)

    def test_canvas_dimensions_match_request(self, two_layer_library: Library):
        result = render_png(two_layer_library, width=400, height=200)
        assert result.view["canvas_px"] == (400, 200)

    def test_height_derived_from_aspect_when_omitted(
        self, two_layer_library: Library
    ):
        # Design extent: 30x10 → with 10% pad: 36x12 → at width=360, height ~120
        result = render_png(two_layer_library, width=360)
        w, h = result.view["canvas_px"]
        assert w == 360
        # Allow ±2 px rounding tolerance.
        assert abs(h - 120) <= 2

    def test_layers_rendered_in_order(self, two_layer_library: Library):
        result = render_png(two_layer_library, width=128)
        assert result.layers_rendered == [(1, 0), (2, 0)]

    def test_layer_filter(self, two_layer_library: Library):
        result = render_png(two_layer_library, width=128, layers=[(2, 0)])
        assert result.layers_rendered == [(2, 0)]

    def test_explicit_bbox_culls_outside_polygons(
        self, two_layer_library: Library
    ):
        # Layer 2 lives at x=20..30; this bbox + 10% pad won't reach it.
        result = render_png(
            two_layer_library,
            width=128,
            bbox=BBox(Point(0.0, 0.0), Point(10.0, 10.0)),
        )
        assert result.layers_rendered == [(1, 0)]

    def test_view_metadata_keys(self, two_layer_library: Library):
        result = render_png(two_layer_library, width=128)
        view = result.view
        assert set(view.keys()) >= {
            "scale_px_per_um",
            "offset_x_px",
            "offset_y_px",
            "canvas_px",
            "world_bbox_um",
        }
        assert set(view["world_bbox_um"].keys()) == {"min", "max"}

    def test_pixel_world_round_trip(self, two_layer_library: Library):
        result = render_png(two_layer_library, width=256)
        x_um, y_um = 5.0, 3.0
        px, py = result.world_to_px(x_um, y_um)
        rx, ry = result.px_to_world(px, py)
        assert abs(rx - x_um) < 1e-2
        assert abs(ry - y_um) < 1e-2

    def test_invalid_bg_color_raises(self, two_layer_library: Library):
        with pytest.raises(ValueError, match="bg color"):
            render_png(two_layer_library, width=128, bg="not-a-color")

    def test_unknown_cell_raises(self, two_layer_library: Library):
        with pytest.raises(ValueError, match="not found"):
            render_png(two_layer_library, width=128, cell="missing")

    def test_empty_library_raises(self):
        with pytest.raises(ValueError, match="no geometry"):
            render_png(Library("empty"), width=128)

    def test_writes_valid_png_to_disk(
        self, two_layer_library: Library, tmp_path
    ):
        result = render_png(two_layer_library, width=200, height=100)
        out = tmp_path / "shot.png"
        out.write_bytes(result.png)
        assert out.stat().st_size > 100
        assert out.read_bytes()[:8] == PNG_MAGIC

    def test_repr(self, two_layer_library: Library):
        result = render_png(two_layer_library, width=64, height=32)
        r = repr(result)
        assert "RenderResult" in r
        assert "64x32" in r
