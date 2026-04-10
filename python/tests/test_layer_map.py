"""Tests for LayerMap and load_layer_map functionality."""

import tempfile
from pathlib import Path

import pytest

from rosette import DEFAULT_LAYERS, Layer, LayerInfo, LayerMap, _default_layer_map, load_layer_map


class TestLayerInfo:
    """Tests for LayerInfo class."""

    def test_basic_creation(self):
        """Create a LayerInfo with all defaults."""
        info = LayerInfo("silicon", Layer(1, 0))
        assert info.name == "silicon"
        assert info.number == 1
        assert info.datatype == 0
        assert info.color == "#808080"
        assert info.fill == "solid"
        assert info.opacity == pytest.approx(0.7)
        assert info.description == ""

    def test_custom_properties(self):
        """Create a LayerInfo with custom display properties."""
        info = LayerInfo(
            "metal",
            Layer(10, 2),
            color="#ffeb3b",
            fill="hatched",
            opacity=0.5,
            description="Metal routing layer",
        )
        assert info.name == "metal"
        assert info.number == 10
        assert info.datatype == 2
        assert info.color == "#ffeb3b"
        assert info.fill == "hatched"
        assert info.opacity == pytest.approx(0.5)
        assert info.description == "Metal routing layer"

    def test_layer_property(self):
        """LayerInfo exposes the underlying Layer object."""
        info = LayerInfo("silicon", Layer(1, 0))
        assert info.layer == Layer(1, 0)

    def test_repr(self):
        """LayerInfo has a useful repr."""
        info = LayerInfo("silicon", Layer(1, 0), color="#ff0000")
        assert "silicon" in repr(info)
        assert "1" in repr(info)
        assert "#ff0000" in repr(info)


class TestLayerMap:
    """Tests for LayerMap class."""

    def test_empty_map(self):
        """Empty LayerMap has no layers."""
        lm = LayerMap()
        assert len(lm) == 0
        assert lm.names() == []

    def test_attribute_access(self):
        """Layers are accessible by name as attributes."""
        lm = LayerMap(
            [
                LayerInfo("silicon", Layer(1, 0), color="#ff0000"),
                LayerInfo("metal", Layer(10, 0), color="#00ff00"),
            ]
        )
        assert lm.silicon.number == 1
        assert lm.metal.number == 10
        assert lm.silicon.color == "#ff0000"

    def test_missing_attribute_raises(self):
        """Accessing a missing layer raises AttributeError with helpful message."""
        lm = LayerMap([LayerInfo("silicon", Layer(1, 0))])
        with pytest.raises(AttributeError, match="No layer named 'heater'"):
            lm.heater  # noqa: B018

    def test_contains(self):
        """LayerMap supports 'in' operator."""
        lm = LayerMap([LayerInfo("silicon", Layer(1, 0))])
        assert "silicon" in lm
        assert "heater" not in lm

    def test_iteration(self):
        """LayerMap is iterable over LayerInfo objects."""
        infos = [
            LayerInfo("silicon", Layer(1, 0)),
            LayerInfo("metal", Layer(10, 0)),
        ]
        lm = LayerMap(infos)
        names = [info.name for info in lm]
        assert names == ["silicon", "metal"]

    def test_len(self):
        """LayerMap reports correct length."""
        lm = LayerMap(
            [
                LayerInfo("silicon", Layer(1, 0)),
                LayerInfo("metal", Layer(10, 0)),
            ]
        )
        assert len(lm) == 2

    def test_get(self):
        """LayerMap.get returns LayerInfo or None."""
        lm = LayerMap([LayerInfo("silicon", Layer(1, 0))])
        assert lm.get("silicon") is not None
        assert lm.get("silicon").number == 1
        assert lm.get("heater") is None

    def test_names(self):
        """LayerMap.names returns all layer names."""
        lm = LayerMap(
            [
                LayerInfo("silicon", Layer(1, 0)),
                LayerInfo("metal", Layer(10, 0)),
            ]
        )
        assert lm.names() == ["silicon", "metal"]

    def test_to_dict_list(self):
        """to_dict_list exports in app-compatible format."""
        lm = LayerMap(
            [
                LayerInfo("silicon", Layer(1, 0), color="#ff0000", fill="solid", opacity=0.7),
                LayerInfo("metal", Layer(10, 0), color="#00ff00", fill="hatched", opacity=0.5),
            ]
        )
        dicts = lm.to_dict_list()
        assert len(dicts) == 2

        assert dicts[0]["id"] == 1
        assert dicts[0]["layerNumber"] == 1
        assert dicts[0]["datatype"] == 0
        assert dicts[0]["name"] == "silicon"
        assert dicts[0]["color"] == "#ff0000"
        assert dicts[0]["fillPattern"] == "solid"
        assert dicts[0]["opacity"] == pytest.approx(0.7)
        assert dicts[0]["visible"] is True

        assert dicts[1]["id"] == 2
        assert dicts[1]["layerNumber"] == 10
        assert dicts[1]["fillPattern"] == "hatched"

    def test_repr(self):
        """LayerMap repr shows layer names."""
        lm = LayerMap(
            [
                LayerInfo("silicon", Layer(1, 0)),
                LayerInfo("metal", Layer(10, 0)),
            ]
        )
        assert "silicon" in repr(lm)
        assert "metal" in repr(lm)


class TestLoadLayerMap:
    """Tests for load_layer_map function."""

    def _write_toml(self, tmpdir: Path, content: str) -> Path:
        """Write a rosette.toml file and return its path."""
        toml_path = tmpdir / "rosette.toml"
        toml_path.write_text(content)
        return toml_path

    def test_basic_loading(self):
        """Load a basic layer map from rosette.toml."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[layers.silicon]
number = 1
datatype = 0
color = "#ff69b4"
description = "Silicon waveguides"

[layers.metal]
number = 10
color = "#ffeb3b"
""",
            )
            lm = load_layer_map(path)

        assert len(lm) == 2
        assert lm.silicon.number == 1
        assert lm.silicon.datatype == 0
        assert lm.silicon.color == "#ff69b4"
        assert lm.silicon.description == "Silicon waveguides"
        assert lm.metal.number == 10
        assert lm.metal.datatype == 0  # default
        assert lm.metal.color == "#ffeb3b"

    def test_all_display_properties(self):
        """Load with all optional display properties."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[layers.metal]
number = 10
datatype = 2
color = "#ffeb3b"
fill = "crosshatched"
opacity = 0.5
description = "Metal routing"
""",
            )
            lm = load_layer_map(path)

        assert lm.metal.number == 10
        assert lm.metal.datatype == 2
        assert lm.metal.color == "#ffeb3b"
        assert lm.metal.fill == "crosshatched"
        assert lm.metal.opacity == pytest.approx(0.5)
        assert lm.metal.description == "Metal routing"

    def test_empty_layers_section(self):
        """Missing [layers] section returns default layer map."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[project]
name = "test"
""",
            )
            lm = load_layer_map(path)

        assert len(lm) == len(DEFAULT_LAYERS)
        assert "silicon" in lm
        assert "text" in lm

    def test_missing_number_raises(self):
        """Missing 'number' field raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[layers.core]
color = "#ff0000"
""",
            )
            with pytest.raises(ValueError, match="missing required field 'number'"):
                load_layer_map(path)

    def test_invalid_number_raises(self):
        """Out-of-range layer number raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[layers.core]
number = 1000
""",
            )
            with pytest.raises(ValueError, match="0-999"):
                load_layer_map(path)

    def test_negative_number_raises(self):
        """Negative layer number raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[layers.core]
number = -1
""",
            )
            with pytest.raises(ValueError, match="0-999"):
                load_layer_map(path)

    def test_invalid_color_raises(self):
        """Invalid hex color raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[layers.core]
number = 1
color = "red"
""",
            )
            with pytest.raises(ValueError, match="hex string"):
                load_layer_map(path)

    def test_invalid_fill_raises(self):
        """Invalid fill pattern raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[layers.core]
number = 1
fill = "stippled"
""",
            )
            with pytest.raises(ValueError, match="fill"):
                load_layer_map(path)

    def test_invalid_opacity_raises(self):
        """Out-of-range opacity raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[layers.core]
number = 1
opacity = 1.5
""",
            )
            with pytest.raises(ValueError, match="opacity"):
                load_layer_map(path)

    def test_duplicate_layer_pair_raises(self):
        """Duplicate (number, datatype) pair raises ValueError."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[layers.core]
number = 1
datatype = 0

[layers.also_core]
number = 1
datatype = 0
""",
            )
            with pytest.raises(ValueError, match="already defined"):
                load_layer_map(path)

    def test_file_not_found(self):
        """Missing config file raises FileNotFoundError."""
        with pytest.raises(FileNotFoundError):
            load_layer_map("/nonexistent/rosette.toml")

    def test_coexists_with_drc(self):
        """Layer map can coexist with DRC rules in same rosette.toml."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[project]
name = "test"

[layers.silicon]
number = 1
color = "#ff0000"

[drc.layers."1/0"]
min_width = 0.12
""",
            )
            lm = load_layer_map(path)

        assert len(lm) == 1
        assert lm.silicon.number == 1

    def test_defaults_applied(self):
        """Missing optional fields get sensible defaults."""
        with tempfile.TemporaryDirectory() as tmpdir:
            path = self._write_toml(
                Path(tmpdir),
                """
[layers.silicon]
number = 1
""",
            )
            lm = load_layer_map(path)

        assert lm.silicon.datatype == 0
        assert lm.silicon.color == "#808080"
        assert lm.silicon.fill == "solid"
        assert lm.silicon.opacity == pytest.approx(0.7)
        assert lm.silicon.description == ""


class TestDefaultLayers:
    """Tests for the DEFAULT_LAYERS constant and _default_layer_map."""

    def test_default_layers_constant(self):
        """DEFAULT_LAYERS has the expected entries."""
        names = [d["name"] for d in DEFAULT_LAYERS]
        assert names == ["silicon", "text"]

    def test_default_layers_numbers(self):
        """DEFAULT_LAYERS uses the standard numbering convention."""
        by_name = {d["name"]: d for d in DEFAULT_LAYERS}
        assert by_name["silicon"]["number"] == 1
        assert by_name["text"]["number"] == 10

    def test_default_layer_map(self):
        """_default_layer_map returns a valid LayerMap from defaults."""
        lm = _default_layer_map()
        assert len(lm) == 2
        assert lm.silicon.number == 1
        assert lm.silicon.color == "#ff69b4"
        assert lm.text.number == 10
        assert lm.text.fill == "dotted"

    def test_default_layer_map_to_dict_list(self):
        """_default_layer_map().to_dict_list() produces valid dicts."""
        dicts = _default_layer_map().to_dict_list()
        assert len(dicts) == 2
        assert dicts[0]["name"] == "silicon"
        assert dicts[0]["layerNumber"] == 1
        assert dicts[1]["name"] == "text"
        assert dicts[1]["layerNumber"] == 10
