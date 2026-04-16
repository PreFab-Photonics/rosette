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


def _has_color(png_bytes: bytes, rgb: tuple[int, int, int]) -> bool:
    """True if the rendered PNG contains at least one pixel of the given RGB.

    Decodes the full PNG (handles all 5 filter types) so we can reason about
    *what got drawn* rather than about specific pixel positions, which are
    sensitive to AA, padding, and aspect-fit math.
    """
    import struct
    import zlib

    assert png_bytes[:8] == PNG_MAGIC
    pos = 8
    width = height = bit_depth = color_type = None
    idat = bytearray()
    while pos < len(png_bytes):
        length = struct.unpack(">I", png_bytes[pos : pos + 4])[0]
        chunk_type = png_bytes[pos + 4 : pos + 8]
        data = png_bytes[pos + 8 : pos + 8 + length]
        pos += 12 + length
        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type = struct.unpack(">IIBB", data[:10])
        elif chunk_type == b"IDAT":
            idat.extend(data)
        elif chunk_type == b"IEND":
            break
    assert color_type == 6 and bit_depth == 8, "expected 8-bit RGBA"

    raw = zlib.decompress(bytes(idat))
    bpp = 4
    stride = width * bpp
    pixels = bytearray(width * height * bpp)
    prev_row = bytes(stride)
    for y in range(height):
        offset = y * (stride + 1)
        ftype = raw[offset]
        row = bytearray(raw[offset + 1 : offset + 1 + stride])
        if ftype == 1:  # Sub
            for i in range(bpp, stride):
                row[i] = (row[i] + row[i - bpp]) & 0xFF
        elif ftype == 2:  # Up
            for i in range(stride):
                row[i] = (row[i] + prev_row[i]) & 0xFF
        elif ftype == 3:  # Average
            for i in range(stride):
                a = row[i - bpp] if i >= bpp else 0
                b = prev_row[i]
                row[i] = (row[i] + ((a + b) >> 1)) & 0xFF
        elif ftype == 4:  # Paeth
            for i in range(stride):
                a = row[i - bpp] if i >= bpp else 0
                b = prev_row[i]
                c = prev_row[i - bpp] if i >= bpp else 0
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pred = a if pa <= pb and pa <= pc else (b if pb <= pc else c)
                row[i] = (row[i] + pred) & 0xFF
        elif ftype != 0:
            raise ValueError(f"unknown PNG filter type {ftype}")
        pixels[y * stride : (y + 1) * stride] = row
        prev_row = bytes(row)

    target = bytes(rgb)
    for i in range(0, len(pixels), bpp):
        if pixels[i : i + 3] == target:
            return True
    return False


class TestPaletteOverride:
    def test_explicit_palette_overrides_default(self, two_layer_library: Library):
        # Default: layer 1 = palette[1] = orange (#ff9800).
        # Override layer 1 → pink (#ff69b4) and verify the rendered pixels.
        result = render_png(
            two_layer_library,
            width=128,
            height=64,
            pad=0.0,
            fill_alpha=255,
            palette={1: "#ff69b4"},
        )
        # Layer 1 rect spans world (0,0)→(10,10). With pad=0 and aspect-fit,
        # it lands roughly in the left third of the canvas. Sample center-ish.
        assert _has_color(result.png, (0xFF, 0x69, 0xB4))
        assert not _has_color(result.png, (0xFF, 0x98, 0x00))  # default orange not used

    def test_unconfigured_layer_falls_back_to_indexed(
        self, two_layer_library: Library
    ):
        # Override only layer 1 → layer 2 should still get palette[2] = yellow.
        result = render_png(
            two_layer_library,
            width=128,
            height=64,
            pad=0.0,
            fill_alpha=255,
            palette={1: "#ff69b4"},
        )
        assert _has_color(result.png, (0xFF, 0xEB, 0x3B))  # palette[2] yellow

    def test_invalid_palette_color_raises(self, two_layer_library: Library):
        with pytest.raises(ValueError, match="invalid color"):
            render_png(two_layer_library, width=64, palette={1: "not-hex"})

    def test_auto_loads_from_rosette_toml(
        self, two_layer_library: Library, tmp_path, monkeypatch
    ):
        # Create a project rosette.toml with a pink layer 1.
        (tmp_path / "rosette.toml").write_text(
            '[layers.silicon]\n'
            'number = 1\n'
            'datatype = 0\n'
            'color = "#ff69b4"\n'
        )
        monkeypatch.chdir(tmp_path)
        result = render_png(
            two_layer_library, width=128, height=64, pad=0.0, fill_alpha=255
        )
        assert _has_color(result.png, (0xFF, 0x69, 0xB4))
        assert not _has_color(result.png, (0xFF, 0x98, 0x00))  # default orange not used

    def test_explicit_palette_beats_auto_loaded(
        self, two_layer_library: Library, tmp_path, monkeypatch
    ):
        (tmp_path / "rosette.toml").write_text(
            '[layers.silicon]\n'
            'number = 1\n'
            'datatype = 0\n'
            'color = "#ff69b4"\n'
        )
        monkeypatch.chdir(tmp_path)
        # Explicit palette wins over the auto-loaded one.
        result = render_png(
            two_layer_library,
            width=128,
            height=64,
            pad=0.0,
            fill_alpha=255,
            palette={1: "#00ff00"},  # green
        )
        assert _has_color(result.png, (0x00, 0xFF, 0x00))
        assert not _has_color(result.png, (0xFF, 0x69, 0xB4))  # auto-loaded pink overridden

    def test_no_rosette_toml_uses_default_palette(
        self, two_layer_library: Library, tmp_path, monkeypatch
    ):
        # Empty tmp_path, no rosette.toml. Should fall back to indexed palette.
        monkeypatch.chdir(tmp_path)
        result = render_png(
            two_layer_library, width=128, height=64, pad=0.0, fill_alpha=255
        )
        assert _has_color(result.png, (0xFF, 0x98, 0x00))  # palette[1] orange
