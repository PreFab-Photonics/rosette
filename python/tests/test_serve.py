"""Tests for DRC integration in the rosette._serve live-preview helpers."""

import json
import subprocess
from pathlib import Path

import pytest

from rosette import Cell, Layer, Point, Polygon
from rosette._core import DrcCache
from rosette._serve import (
    _launch_tauri,
    _load_drc_rules_safe,
    _load_layer_map_safe,
    _native_viewer_args,
    _prepare_design,
    _ProjectComponentCatalog,
    _run_drc_safe,
    _supports_server_context,
    _validate_webapp_bundle,
)
from rosette.drc import DrcRules


def _write_component_package(project: Path, source: str) -> Path:
    components = project / "components"
    components.mkdir(exist_ok=True)
    (components / "__init__.py").write_text(source)
    return components


def test_native_viewer_passes_local_server_context_to_desktop_app():
    assert _native_viewer_args("http://127.0.0.1:5173", True) == [
        "--rosette-server-context-v1",
        "--server-url",
        "http://127.0.0.1:5173",
        "--design-mode",
    ]
    assert _native_viewer_args("http://127.0.0.1:5174", False) == [
        "--rosette-server-context-v1",
        "--server-url",
        "http://127.0.0.1:5174",
    ]


def test_native_viewer_detects_trusted_server_transport(tmp_path: Path):
    compatible = tmp_path / "compatible"
    compatible.write_bytes(b"binary\0--server-url\0")
    incompatible = tmp_path / "incompatible"
    incompatible.write_bytes(b"binary")

    assert _supports_server_context(compatible)
    assert not _supports_server_context(incompatible)
    assert not _supports_server_context(tmp_path / "missing")


def test_native_launch_starts_a_fresh_app_for_the_server_url(tmp_path: Path, monkeypatch):
    app = tmp_path / "Rosette.app"
    binary = app / "Contents" / "MacOS" / "rosette-desktop"
    binary.parent.mkdir(parents=True)
    binary.write_bytes(b"binary\0--server-url\0")
    launches: list[list[str]] = []
    pgrep_results = iter([set(), {1234}])

    monkeypatch.setattr("rosette._serve._find_installed_app", lambda: app)
    monkeypatch.setattr("rosette._serve._pgrep", lambda _name: next(pgrep_results))
    monkeypatch.setattr(
        subprocess,
        "run",
        lambda command, **_kwargs: launches.append(command),
    )
    monkeypatch.setattr("time.sleep", lambda _seconds: None)

    handle = _launch_tauri("http://localhost:5173", design_mode=False)

    assert handle is not None
    assert launches == [
        [
            "open",
            "-n",
            "-a",
            str(app),
            "--args",
            "--rosette-server-context-v1",
            "--server-url",
            "http://localhost:5173",
        ]
    ]


class TestProjectComponentCatalog:
    def test_discovers_exported_factories_and_serializes_parameters(
        self, tmp_path: Path, monkeypatch
    ):
        monkeypatch.syspath_prepend(str(tmp_path))
        _write_component_package(
            tmp_path,
            """
from typing import Literal
from rosette import Cell, Layer

def device(
    layer: Layer,
    width: float = 0.5,
    count: int = 2,
    style: Literal["rib", "strip"] = "strip",
    enabled: bool = True,
    cladding: Layer | None = None,
) -> Cell:
    return Cell(f"device_{layer.number}_{layer.datatype}_{width}_{count}_{style}_{enabled}_{cladding is not None}")

def device_length(length: float = 10.0) -> float:
    return length

__all__ = ["device", "device_length"]
""",
        )

        catalog = _ProjectComponentCatalog(tmp_path, None)
        snapshot = catalog.snapshot()

        assert snapshot["version"] == 1
        assert snapshot["error"] is None
        assert snapshot["components"] == [
            {
                "name": "device",
                "parameters": [
                    {
                        "name": "width",
                        "type": "number",
                        "required": False,
                        "nullable": False,
                        "default": 0.5,
                    },
                    {
                        "name": "count",
                        "type": "integer",
                        "required": False,
                        "nullable": False,
                        "default": 2,
                    },
                    {
                        "name": "style",
                        "type": "string",
                        "required": False,
                        "nullable": False,
                        "default": "strip",
                        "choices": ["rib", "strip"],
                    },
                    {
                        "name": "enabled",
                        "type": "boolean",
                        "required": False,
                        "nullable": False,
                        "default": True,
                    },
                    {
                        "name": "cladding",
                        "type": "layer",
                        "required": False,
                        "nullable": True,
                        "default": None,
                    },
                ],
            }
        ]

    def test_materializes_defaults_and_parameter_overrides(self, tmp_path: Path, monkeypatch):
        monkeypatch.syspath_prepend(str(tmp_path))
        _write_component_package(
            tmp_path,
            """
from rosette import Cell, Layer, Point, Polygon

def device(layer: Layer, width: float = 0.5) -> Cell:
    suffix = str(width).replace(".", "p")
    child = Cell(f"child_{suffix}")
    child.add_polygon(Polygon.rect(Point.origin(), width, 1.0), layer)
    top = Cell(f"device_{layer.number}_{layer.datatype}_{suffix}")
    top.add_ref(child.at(0, 0))
    return top

__all__ = ["device"]
""",
        )
        catalog = _ProjectComponentCatalog(tmp_path, None)

        result = catalog.materialize(
            {
                "name": "device",
                "layer": {"layerNumber": 7, "datatype": 3},
                "parameters": {"width": 0.8},
            }
        )

        payload = json.loads(result["layoutJson"])
        assert result["topCell"] == "device_7_3_0p8"
        assert result["cellNames"] == ["child_0p8", "device_7_3_0p8"]
        assert payload["format"] == "rosette-layout"
        assert payload["schema"] == 1
        assert {cell["name"] for cell in payload["library"]["cells"]} == {
            "child_0p8",
            "device_7_3_0p8",
        }

    def test_rejects_unknown_parameters_and_invalid_values(self, tmp_path: Path, monkeypatch):
        monkeypatch.syspath_prepend(str(tmp_path))
        _write_component_package(
            tmp_path,
            """
from rosette import Cell, Layer

def device(layer: Layer, count: int = 2) -> Cell:
    return Cell("device")

__all__ = ["device"]
""",
        )
        catalog = _ProjectComponentCatalog(tmp_path, None)

        with pytest.raises(ValueError, match="Unknown parameter"):
            catalog.materialize(
                {
                    "name": "device",
                    "layer": {"layerNumber": 1, "datatype": 0},
                    "parameters": {"other": 3},
                }
            )
        with pytest.raises(ValueError, match="count must be an integer"):
            catalog.materialize(
                {
                    "name": "device",
                    "layer": {"layerNumber": 1, "datatype": 0},
                    "parameters": {"count": True},
                }
            )

    def test_reload_failure_keeps_last_good_catalog(self, tmp_path: Path, monkeypatch):
        monkeypatch.syspath_prepend(str(tmp_path))
        components = _write_component_package(
            tmp_path,
            """
from rosette import Cell, Layer

def first(layer: Layer) -> Cell:
    return Cell("first")

__all__ = ["first"]
""",
        )
        catalog = _ProjectComponentCatalog(tmp_path, None)

        (components / "__init__.py").write_text("this is not valid python !!!")
        assert catalog.reload() is False

        snapshot = catalog.snapshot()
        assert [item["name"] for item in snapshot["components"]] == ["first"]
        assert snapshot["version"] == 1
        assert "SyntaxError" in snapshot["error"]

    def test_reports_exported_factories_with_unsupported_parameters(
        self, tmp_path: Path, monkeypatch
    ):
        monkeypatch.syspath_prepend(str(tmp_path))
        _write_component_package(
            tmp_path,
            """
from rosette import Cell, Layer

def unsupported(layer: Layer, values: list[float] = []) -> Cell:
    return Cell("unsupported")

__all__ = ["unsupported"]
""",
        )

        catalog = _ProjectComponentCatalog(tmp_path, None)
        snapshot = catalog.snapshot()

        assert snapshot["components"] == []
        assert "Skipped unsupported" in snapshot["error"]

    def test_skips_factory_signatures_the_materializer_cannot_invoke(
        self, tmp_path: Path, monkeypatch
    ):
        monkeypatch.syspath_prepend(str(tmp_path))
        _write_component_package(
            tmp_path,
            """
from rosette import Cell, Layer

def keyword_layer(*, layer: Layer, width: float = 0.5) -> Cell:
    return Cell("keyword_layer")

def positional_parameter(layer: Layer, width: float = 0.5, /) -> Cell:
    return Cell("positional_parameter")

def valid(layer: Layer, /, *, width: float = 0.5) -> Cell:
    return Cell("valid")

__all__ = ["keyword_layer", "positional_parameter", "valid"]
""",
        )

        catalog = _ProjectComponentCatalog(tmp_path, None)
        snapshot = catalog.snapshot()

        assert [item["name"] for item in snapshot["components"]] == ["valid"]
        assert "Skipped keyword_layer: layer must accept a positional argument" in snapshot["error"]
        assert (
            "Skipped positional_parameter: parameter 'width' must accept a keyword argument"
            in snapshot["error"]
        )
        assert (
            catalog.materialize(
                {
                    "name": "valid",
                    "layer": {"layerNumber": 1, "datatype": 0},
                    "parameters": {"width": 0.7},
                }
            )["topCell"]
            == "valid"
        )

    def test_skips_nonfinite_defaults_without_breaking_valid_components(
        self, tmp_path: Path, monkeypatch
    ):
        monkeypatch.syspath_prepend(str(tmp_path))
        _write_component_package(
            tmp_path,
            """
from math import inf
from typing import Literal
from rosette import Cell, Layer

def invalid(layer: Layer, limit: float = inf) -> Cell:
    return Cell("invalid")

def invalid_choice(layer: Layer, limit: Literal[1.0, inf] = 1.0) -> Cell:
    return Cell("invalid_choice")

def valid(layer: Layer, limit: float = 1.0) -> Cell:
    return Cell("valid")

__all__ = ["invalid", "invalid_choice", "valid"]
""",
        )

        snapshot = _ProjectComponentCatalog(tmp_path, None).snapshot()

        assert [item["name"] for item in snapshot["components"]] == ["valid"]
        assert (
            "Skipped invalid: parameter default must be finite and JSON-safe" in snapshot["error"]
        )
        assert (
            "Skipped invalid_choice: literal choices must be finite and JSON-safe"
            in snapshot["error"]
        )
        json.dumps(snapshot, allow_nan=False)

    def test_rejects_cyclic_component_hierarchies(self, tmp_path: Path, monkeypatch):
        monkeypatch.syspath_prepend(str(tmp_path))
        _write_component_package(
            tmp_path,
            """
from rosette import Cell, Layer

def cyclic(layer: Layer) -> Cell:
    first = Cell("first")
    second = Cell("second")
    first.add_ref(second.at(0, 0))
    second.add_ref(first.at(0, 0))
    return first

__all__ = ["cyclic"]
""",
        )
        catalog = _ProjectComponentCatalog(tmp_path, None)

        with pytest.raises(ValueError, match="invalid hierarchy"):
            catalog.materialize(
                {
                    "name": "cyclic",
                    "layer": {"layerNumber": 1, "datatype": 0},
                    "parameters": {},
                }
            )

    def test_missing_package_is_an_empty_catalog(self, tmp_path: Path):
        assert _ProjectComponentCatalog(tmp_path, None).snapshot() == {
            "version": 1,
            "components": [],
            "error": None,
        }


def test_prepare_design_collects_descendants_added_after_parent_placement():
    leaf = Cell("leaf")
    child = Cell("child")
    top = Cell("top")
    top.add_ref(child.at(0, 0))
    child.add_ref(leaf.at(0, 0))

    design_json, _ = _prepare_design(top)

    assert {cell["name"] for cell in json.loads(design_json)["library"]["cells"]} == {
        "leaf",
        "child",
        "top",
    }


def test_viewer_manifest_matches_native_layout_contract():
    design_json, _ = _prepare_design(Cell("top"))
    payload = json.loads(design_json)
    manifest_path = Path(__file__).resolve().parents[2] / "app" / "public" / "viewer-manifest.json"
    manifest = json.loads(manifest_path.read_text())

    assert manifest == {
        "layoutFormat": payload["format"],
        "layoutSchema": payload["schema"],
    }


def test_webapp_bundle_validation_rejects_stale_and_accepts_current(tmp_path: Path):
    with pytest.raises(RuntimeError, match="stale or incomplete"):
        _validate_webapp_bundle(tmp_path)

    manifest = tmp_path / "viewer-manifest.json"
    manifest.write_text('{"layoutFormat":"rosette-layout","layoutSchema":0}')
    with pytest.raises(RuntimeError, match="does not support"):
        _validate_webapp_bundle(tmp_path)

    manifest.write_text('{"layoutFormat":"rosette-layout","layoutSchema":1}')
    _validate_webapp_bundle(tmp_path)


class TestRunDrcSafe:
    """Tests for _run_drc_safe — serializing DRC results for the viewer."""

    def test_returns_none_when_no_rules(self):
        """No configured rules => no DRC payload."""
        cell = Cell("test")
        assert _run_drc_safe(cell, None) is None

    def test_clean_design_reports_passed(self):
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))
        rules = DrcRules().min_width(Layer(1, 0), 1.0)

        payload = _run_drc_safe(cell, rules)

        assert payload is not None
        assert payload["passed"] is True
        assert payload["error_count"] == 0
        assert payload["violations"] == []

    def test_violation_is_serialized(self):
        """A failing design produces a JSON-friendly violation entry."""
        cell = Cell("test")
        # Narrow rectangle violates min width.
        cell.add_polygon(Polygon.rect(Point.origin(), 0.05, 5.0), Layer(1, 0))
        rules = DrcRules().min_width(Layer(1, 0), 1.0, name="MIN_W")

        payload = _run_drc_safe(cell, rules)

        assert payload is not None
        assert payload["passed"] is False
        assert payload["error_count"] >= 1
        v = payload["violations"][0]
        # Shape the viewer relies on.
        assert v["severity"] in ("error", "warning")
        assert v["rule"] == "MIN_W"
        assert isinstance(v["message"], str)
        assert v["layer"] == [1, 0]
        assert v["layer2"] is None
        # bbox is [[min_x, min_y], [max_x, max_y]] in top-cell coords.
        assert len(v["bbox"]) == 2
        assert len(v["bbox"][0]) == 2
        assert len(v["bbox"][1]) == 2

    def test_rule_falls_back_to_rule_type_when_unnamed(self):
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 0.05, 5.0), Layer(1, 0))
        rules = DrcRules().min_width(Layer(1, 0), 1.0)

        payload = _run_drc_safe(cell, rules)

        assert payload is not None
        assert payload["violations"][0]["rule"] == "min_width"


class TestRunDrcSafeCache:
    """A reused DrcCache must not change which violations the viewer sees."""

    def test_cache_reuse_matches_uncached(self):
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 0.05, 5.0), Layer(1, 0))
        rules = DrcRules().min_width(Layer(1, 0), 1.0, name="MIN_W")

        cache = DrcCache()
        first = _run_drc_safe(cell, rules, cache)
        # Second call with the same (unchanged) design hits the whole-design
        # short-circuit; payload must be identical.
        second = _run_drc_safe(cell, rules, cache)
        uncached = _run_drc_safe(cell, rules)

        assert first == second == uncached

    def test_cache_tracks_edits(self):
        rules = DrcRules().min_width(Layer(1, 0), 0.5, name="MIN_W")
        cache = DrcCache()

        # Start clean (wide enough), then edit to a too-thin polygon: the
        # cached path must reflect the new violation.
        clean = Cell("test")
        clean.add_polygon(Polygon.rect(Point.origin(), 2.0, 5.0), Layer(1, 0))
        assert _run_drc_safe(clean, rules, cache)["passed"] is True

        thin = Cell("test")
        thin.add_polygon(Polygon.rect(Point.origin(), 0.05, 5.0), Layer(1, 0))
        cached = _run_drc_safe(thin, rules, cache)
        uncached = _run_drc_safe(thin, rules)
        assert cached["passed"] is False
        assert cached == uncached


class TestLoadLayerMapSafe:
    """Tests for _load_layer_map_safe — used to seed the viewer's layers,
    including the empty-canvas (`rosette serve` with no design) case.
    """

    def test_reads_config_layers(self, tmp_path: Path, monkeypatch):
        """A project rosette.toml's [layers] are surfaced, not the defaults."""
        (tmp_path / "rosette.toml").write_text(
            '[project]\nname = "x"\n\n'
            '[layers.metal]\nnumber = 42\ndatatype = 3\ncolor = "#abcdef"\n\n'
            '[layers.text]\nnumber = 10\ncolor = "#123456"\nfill = "dotted"\nopacity = 0.5\n'
        )
        monkeypatch.chdir(tmp_path)

        layers = _load_layer_map_safe()

        assert layers == [
            {
                "id": 1,
                "layerNumber": 42,
                "datatype": 3,
                "name": "metal",
                "color": "#abcdef",
                "visible": True,
                "fillPattern": "solid",
                "opacity": 0.7,
            },
            {
                "id": 2,
                "layerNumber": 10,
                "datatype": 0,
                "name": "text",
                "color": "#123456",
                "visible": True,
                "fillPattern": "dotted",
                "opacity": 0.5,
            },
        ]

    def test_reads_explicit_design_config_outside_cwd(self, tmp_path: Path, monkeypatch):
        project = tmp_path / "project"
        project.mkdir()
        config = project / "rosette.toml"
        config.write_text('[layers.custom]\nnumber = 77\ncolor = "#abcdef"\n')
        outside = tmp_path / "outside"
        outside.mkdir()
        monkeypatch.chdir(outside)

        layers = _load_layer_map_safe(config)

        assert layers is not None
        assert layers[0]["name"] == "custom"
        assert layers[0]["layerNumber"] == 77

    def test_reads_drc_from_explicit_design_config(self, tmp_path: Path, monkeypatch):
        config = tmp_path / "rosette.toml"
        config.write_text('[drc.layers."1/0"]\nmin_width = 0.5\n')
        outside = tmp_path / "outside"
        outside.mkdir()
        monkeypatch.chdir(outside)

        rules = _load_drc_rules_safe(config)

        assert rules is not None
        thin = Cell("thin")
        thin.add_polygon(Polygon.rect(Point.origin(), 2.0, 0.1), Layer(1, 0))
        assert _run_drc_safe(thin, rules)["passed"] is False

    def test_falls_back_to_defaults_without_config(self, tmp_path: Path, monkeypatch):
        """No rosette.toml => built-in default layers (silicon, text)."""
        monkeypatch.chdir(tmp_path)

        layers = _load_layer_map_safe()

        assert layers is not None
        names = {ly["name"] for ly in layers}
        assert {"silicon", "text"} <= names

    def test_falls_back_to_defaults_when_layers_section_absent(self, tmp_path: Path, monkeypatch):
        """A [project]-only rosette.toml (blank template) => default layers."""
        (tmp_path / "rosette.toml").write_text('[project]\nname = "x"\ntemplate = "blank"\n')
        monkeypatch.chdir(tmp_path)

        layers = _load_layer_map_safe()

        assert layers is not None
        names = {ly["name"] for ly in layers}
        assert {"silicon", "text"} <= names
