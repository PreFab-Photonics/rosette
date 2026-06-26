"""Tests for DRC integration in the rosette._serve live-preview helpers."""

from pathlib import Path

from rosette import Cell, DrcCache, DrcRules, Layer, Point, Polygon
from rosette._serve import _load_layer_map_safe, _run_drc_safe


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
            '[layers.metal]\nnumber = 42\ndatatype = 3\ncolor = "#abcdef"\n'
        )
        monkeypatch.chdir(tmp_path)

        layers = _load_layer_map_safe()

        assert layers is not None
        by_name = {ly["name"]: ly for ly in layers}
        assert "metal" in by_name
        assert by_name["metal"]["layerNumber"] == 42
        assert by_name["metal"]["datatype"] == 3

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
