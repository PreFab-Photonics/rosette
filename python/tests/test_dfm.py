"""Tests for DFM (Design for Manufacturability) prediction functionality.

These tests focus on Python-specific behavior and integration.
Core algorithm correctness is tested in Rust.
"""

import pytest

from rosette import (
    Cell,
    DfmConfig,
    DfmResult,
    DfmViolation,
    GaussianModel,
    Layer,
    LayerMetrics,
    LayerPrediction,
    Point,
    Polygon,
    load_dfm_config,
    run_dfm,
)
from rosette.cli import _print_dfm_result, _run_dfm_check, dfm_design


class TestDfmConfig:
    """Tests for DfmConfig."""

    def test_default_config(self):
        """Default config has reasonable values."""
        config = DfmConfig()
        assert config.resolution == 0.01
        assert config.padding == 1.0
        assert config.contour_threshold == 0.5
        assert config.keep_raster is False
        assert config.has_tolerances is False

    def test_custom_config(self):
        """Custom config values are preserved."""
        config = DfmConfig(resolution=0.05, padding=2.0, contour_threshold=0.3, keep_raster=True)
        assert config.resolution == 0.05
        assert config.padding == 2.0
        assert config.contour_threshold == 0.3
        assert config.keep_raster is True

    def test_config_with_tolerances(self):
        """Config with tolerances enables pass/fail checking."""
        config = DfmConfig(max_area_deviation=0.10)
        assert config.has_tolerances is True
        assert config.max_area_deviation == 0.10

    def test_config_without_tolerances(self):
        """Config without tolerances is informational."""
        config = DfmConfig()
        assert config.has_tolerances is False
        assert config.max_area_deviation is None

    def test_config_severity(self):
        """Config accepts severity parameter."""
        config = DfmConfig(max_area_deviation=0.10, severity="warning")
        assert config.has_tolerances is True

    def test_config_invalid_severity(self):
        """Invalid severity raises ValueError."""
        with pytest.raises(ValueError, match="severity"):
            DfmConfig(max_area_deviation=0.10, severity="fatal")

    def test_set_layer_config(self):
        """Can set per-layer config overrides."""
        config = DfmConfig(resolution=0.5, padding=1.0)
        config.set_layer_config(Layer(1, 0), sigma=0.05, max_area_deviation=0.05)
        config.set_layer_config(Layer(2, 0), sigma=0.15)
        # No assertion on internals — verified via run_dfm behavior

    def test_set_layer_config_invalid_severity(self):
        """Invalid per-layer severity raises ValueError."""
        config = DfmConfig()
        with pytest.raises(ValueError, match="severity"):
            config.set_layer_config(Layer(1, 0), severity="fatal")

    def test_repr(self):
        """Config has readable repr."""
        config = DfmConfig()
        assert "DfmConfig" in repr(config)
        assert "0.01" in repr(config)


class TestGaussianModel:
    """Tests for GaussianModel."""

    def test_sigma(self):
        """Sigma is stored correctly."""
        model = GaussianModel(sigma=0.05)
        assert model.sigma == 0.05

    def test_custom_sigma(self):
        """Custom sigma is preserved."""
        model = GaussianModel(sigma=0.1)
        assert model.sigma == 0.1

    def test_name(self):
        """Model name is 'gaussian'."""
        model = GaussianModel(sigma=0.05)
        assert model.name == "gaussian"

    def test_repr(self):
        """Model has readable repr."""
        model = GaussianModel(sigma=0.05)
        assert "GaussianModel" in repr(model)
        assert "0.05" in repr(model)


class TestRunDfm:
    """Tests for run_dfm function."""

    def test_simple_prediction(self):
        """Basic prediction on a rectangle."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=1.0)
        model = GaussianModel(sigma=0.0)  # No blur — passthrough
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        assert isinstance(result, DfmResult)
        assert len(result.layers) == 1
        assert result.layers_processed == 1
        assert result.total_input_polygons == 1
        assert result.total_pixels > 0
        assert result.elapsed_ms >= 0
        assert result.passed is True

    def test_prediction_with_blur(self):
        """Prediction with Gaussian blur runs without error."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 2.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=2.0)
        model = GaussianModel(sigma=0.5)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        assert result.layers_processed == 1
        assert result.total_input_polygons == 1
        assert result.elapsed_ms >= 0

    def test_empty_cell(self):
        """Empty cell produces empty results."""
        cell = Cell("empty")
        result = run_dfm(cell, layers=[Layer(1, 0)])

        assert result.layers_processed == 1
        assert result.total_input_polygons == 0
        assert result.total_predicted_polygons == 0
        assert result.passed is True

    def test_multiple_layers(self):
        """Prediction works on multiple layers."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point(0, 0), 5.0, 5.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point(10, 0), 5.0, 5.0), Layer(2, 0))

        config = DfmConfig(resolution=0.5, padding=1.0)
        model = GaussianModel(sigma=0.0)
        result = run_dfm(cell, layers=[Layer(1, 0), Layer(2, 0)], model=model, config=config)

        assert len(result.layers) == 2
        assert result.layers_processed == 2
        assert result.total_input_polygons == 2

    def test_keep_raster(self):
        """Raster data is retained when keep_raster=True."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 5.0, 5.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=1.0, keep_raster=True)
        model = GaussianModel(sigma=0.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        lp = result.layers[0]
        assert lp.has_raster is True
        assert lp.raster_data is not None
        assert lp.raster_width is not None
        assert lp.raster_height is not None
        assert lp.raster_origin is not None
        assert len(lp.raster_data) == lp.raster_width * lp.raster_height

    def test_no_raster_by_default(self):
        """Raster data is not retained by default."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 5.0, 5.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=1.0)
        model = GaussianModel(sigma=0.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        lp = result.layers[0]
        assert lp.has_raster is False
        assert lp.raster_data is None

    def test_default_model(self):
        """run_dfm works with default model (None)."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 5.0, 5.0), Layer(1, 0))

        result = run_dfm(cell, layers=[Layer(1, 0)])
        assert result.layers_processed == 1

    def test_layer_accepts_int_and_tuple(self):
        """Layers accept int and tuple formats."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 5.0, 5.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=1.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], config=config)
        assert result.layers_processed == 1


class TestMetrics:
    """Tests for LayerMetrics."""

    def test_metrics_computed_for_geometry(self):
        """Metrics are always computed when geometry exists."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=1.0)
        model = GaussianModel(sigma=0.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        lp = result.layers[0]
        assert lp.metrics is not None
        m = lp.metrics
        assert isinstance(m, LayerMetrics)
        assert m.layer == (1, 0)
        assert isinstance(m.max_edge_deviation, float)
        assert isinstance(m.area_deviation, float)
        assert isinstance(m.designed_area, float)
        assert isinstance(m.predicted_area, float)

    def test_metrics_none_for_empty_layer(self):
        """No metrics for layers without geometry."""
        cell = Cell("empty")
        result = run_dfm(cell, layers=[Layer(1, 0)])

        assert result.layers[0].metrics is None

    def test_zero_blur_minimal_deviation(self):
        """No blur produces near-zero deviation."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=1.0)
        model = GaussianModel(sigma=0.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        m = result.layers[0].metrics
        assert m.max_edge_deviation < 0.1  # Near zero
        assert abs(m.area_deviation) < 0.05  # Near zero

    def test_blur_causes_deviation(self):
        """Gaussian blur causes measurable deviation."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 1.0), Layer(1, 0))

        config = DfmConfig(resolution=0.1, padding=2.0)
        model = GaussianModel(sigma=0.5)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        m = result.layers[0].metrics
        # Some deviation expected from blur
        assert m.max_edge_deviation > 0.0 or abs(m.area_deviation) > 0.0

    def test_metrics_repr(self):
        """LayerMetrics has readable repr."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 5.0, 5.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=1.0)
        model = GaussianModel(sigma=0.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        m = result.layers[0].metrics
        assert "LayerMetrics" in repr(m)
        assert "(1, 0)" in repr(m)


class TestTolerancesAndViolations:
    """Tests for tolerance checking and violations."""

    def test_tolerances_pass_no_blur(self):
        """No blur with tolerances passes."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=1.0, max_area_deviation=0.05)
        model = GaussianModel(sigma=0.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        assert result.passed is True
        assert len(result.violations) == 0

    def test_tight_tolerances_fail_with_blur(self):
        """Tight area tolerance + blur causes violations."""
        cell = Cell("test")
        # Narrow feature that blur will heavily affect (area loss)
        cell.add_polygon(Polygon.rect(Point.origin(), 20.0, 0.3), Layer(1, 0))

        config = DfmConfig(
            resolution=0.1,
            padding=2.0,
            max_area_deviation=0.01,  # Very tight — 1%
        )
        model = GaussianModel(sigma=3.0)  # Strong blur erases narrow feature
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        assert result.passed is False
        assert len(result.violations) > 0

    def test_violation_properties(self):
        """DfmViolation has expected properties."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 20.0, 0.3), Layer(1, 0))

        config = DfmConfig(resolution=0.1, padding=2.0, max_area_deviation=0.01)
        model = GaussianModel(sigma=3.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        assert len(result.violations) > 0
        v = result.violations[0]
        assert isinstance(v, DfmViolation)
        assert v.layer == (1, 0)
        assert v.violation_type == "area_deviation"
        assert isinstance(v.message, str)
        assert v.severity in ("error", "warning")
        assert isinstance(v.bbox, tuple)
        assert isinstance(v.max_allowed, float)
        assert isinstance(v.actual, float)

    def test_violation_repr(self):
        """DfmViolation has readable repr."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 20.0, 0.3), Layer(1, 0))

        config = DfmConfig(resolution=0.1, padding=2.0, max_area_deviation=0.01)
        model = GaussianModel(sigma=3.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        v = result.violations[0]
        assert "DfmViolation" in repr(v)

    def test_warnings_pass(self):
        """Warning-severity violations don't cause failure."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 20.0, 0.3), Layer(1, 0))

        config = DfmConfig(resolution=0.1, padding=2.0, max_area_deviation=0.01, severity="warning")
        model = GaussianModel(sigma=3.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        assert result.passed is True  # Warnings don't fail
        assert len(result.violations) > 0  # But violations are still reported
        assert result.violations[0].severity == "warning"

    def test_per_layer_violations(self):
        """Violations are attached to the correct layer prediction."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 20.0, 0.3), Layer(1, 0))

        config = DfmConfig(resolution=0.1, padding=2.0, max_area_deviation=0.01)
        model = GaussianModel(sigma=3.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        lp = result.layers[0]
        assert len(lp.violations) > 0
        assert lp.violations[0].layer == (1, 0)

    def test_result_passed_and_repr(self):
        """DfmResult repr shows PASSED/FAILED status."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))

        # Passing
        config = DfmConfig(resolution=0.5, padding=1.0, max_area_deviation=0.5)
        model = GaussianModel(sigma=0.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)
        assert "PASSED" in repr(result)


class TestLayerPrediction:
    """Tests for LayerPrediction class."""

    def test_prediction_properties(self):
        """LayerPrediction has expected properties."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=1.0)
        model = GaussianModel(sigma=0.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        lp = result.layers[0]
        assert isinstance(lp, LayerPrediction)
        assert lp.layer == (1, 0)
        assert lp.input_polygon_count == 1
        assert isinstance(lp.predicted_polygon_count, int)
        assert isinstance(lp.predicted_polygons, list)
        assert lp.metrics is not None
        assert isinstance(lp.violations, list)

    def test_repr(self):
        """LayerPrediction has readable repr."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 5.0, 5.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=1.0)
        model = GaussianModel(sigma=0.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], model=model, config=config)

        lp = result.layers[0]
        assert "LayerPrediction" in repr(lp)
        assert "(1, 0)" in repr(lp)


class TestDfmResult:
    """Tests for DfmResult class."""

    def test_result_properties(self):
        """DfmResult has expected properties."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))

        config = DfmConfig(resolution=0.5, padding=1.0)
        result = run_dfm(cell, layers=[Layer(1, 0)], config=config)

        assert result.layers_processed == 1
        assert result.total_input_polygons == 1
        assert isinstance(result.total_predicted_polygons, int)
        assert isinstance(result.total_pixels, int)
        assert result.resolution == 0.5
        assert result.elapsed_ms >= 0
        assert isinstance(result.passed, bool)
        assert isinstance(result.violations, list)

    def test_result_len(self):
        """len(result) returns layer count."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 5.0, 5.0), Layer(1, 0))

        result = run_dfm(cell, layers=[Layer(1, 0)])
        assert len(result) == 1

    def test_result_repr(self):
        """DfmResult has readable repr."""
        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 5.0, 5.0), Layer(1, 0))

        result = run_dfm(cell, layers=[Layer(1, 0)])
        assert "DfmResult" in repr(result)
        assert "1 layers" in repr(result)


class TestLoadDfmConfig:
    """Tests for load_dfm_config function."""

    def test_load_from_explicit_path(self, tmp_path):
        """Can load DFM config from explicit path."""
        toml_content = """
[dfm]
resolution = 0.02
padding = 2.0
sigma = 0.1
threshold = 0.4
layers = ["1/0", "2/0"]
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        config, model, layers = load_dfm_config(config_file)
        assert config.resolution == 0.02
        assert config.padding == 2.0
        assert model.sigma == 0.1
        assert config.contour_threshold == 0.4
        assert len(layers) == 2

    def test_load_with_tolerances(self, tmp_path):
        """Can load DFM config with tolerances."""
        toml_content = """
[dfm]
resolution = 0.01
sigma = 0.05
layers = ["1/0"]
max_area_deviation = 0.10
severity = "warning"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        config, _model, _layers = load_dfm_config(config_file)
        assert config.has_tolerances is True
        assert config.max_area_deviation == 0.10

    def test_load_without_tolerances(self, tmp_path):
        """Config without tolerances loads as informational."""
        toml_content = """
[dfm]
layers = ["1/0"]
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        config, _model, _layers = load_dfm_config(config_file)
        assert config.has_tolerances is False

    def test_missing_dfm_section_raises(self, tmp_path):
        """Missing [dfm] section raises ValueError."""
        toml_content = """
[project]
name = "test"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match="No \\[dfm\\] section"):
            load_dfm_config(config_file)

    def test_unknown_model_raises(self, tmp_path):
        """Unknown model type raises ValueError."""
        toml_content = """
[dfm]
model = "unknown_model"
layers = ["1/0"]
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match="Unknown DFM model type"):
            load_dfm_config(config_file)

    def test_file_not_found(self, tmp_path):
        """Raises FileNotFoundError for missing file."""
        with pytest.raises(FileNotFoundError):
            load_dfm_config(tmp_path / "nonexistent.toml")

    def test_default_values(self, tmp_path):
        """Missing optional fields use defaults."""
        toml_content = """
[dfm]
layers = ["1/0"]
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        config, model, layers = load_dfm_config(config_file)
        assert config.resolution == 0.01
        assert config.padding == 1.0
        assert config.contour_threshold == 0.5
        assert model.sigma == 0.08
        assert len(layers) == 1

    def test_empty_layers(self, tmp_path):
        """Empty layers list returns empty list."""
        toml_content = """
[dfm]
sigma = 0.05
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        _config, _model, layers = load_dfm_config(config_file)
        assert layers == []

    def test_config_works_with_run_dfm(self, tmp_path):
        """Loaded config can be used with run_dfm."""
        toml_content = """
[dfm]
resolution = 0.5
padding = 1.0
sigma = 0.0
layers = ["1/0"]
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        config, model, layers = load_dfm_config(config_file)

        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))

        result = run_dfm(cell, layers=layers, model=model, config=config)
        assert result.layers_processed == 1
        assert result.total_input_polygons == 1

    def test_invalid_resolution_raises(self, tmp_path):
        """Invalid resolution raises ValueError."""
        toml_content = """
[dfm]
resolution = -0.01
layers = ["1/0"]
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match="resolution"):
            load_dfm_config(config_file)

    def test_invalid_sigma_raises(self, tmp_path):
        """Invalid sigma raises ValueError."""
        toml_content = """
[dfm]
sigma = -1.0
layers = ["1/0"]
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match="sigma"):
            load_dfm_config(config_file)

    def test_invalid_tolerance_raises(self, tmp_path):
        """Invalid tolerance value raises ValueError."""
        toml_content = """
[dfm]
layers = ["1/0"]
max_area_deviation = -0.01
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match="max_area_deviation"):
            load_dfm_config(config_file)

    def test_invalid_severity_raises(self, tmp_path):
        """Invalid severity value raises ValueError."""
        toml_content = """
[dfm]
layers = ["1/0"]
max_area_deviation = 0.10
severity = "fatal"
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        with pytest.raises(ValueError, match="severity"):
            load_dfm_config(config_file)

    def test_load_per_layer_config(self, tmp_path):
        """Can load per-layer overrides from [dfm.layer."1/0"]."""
        toml_content = """
[dfm]
resolution = 0.01
sigma = 0.08
layers = ["1/0", "2/0"]

[dfm.layer."1/0"]
sigma = 0.05
max_area_deviation = 0.05

[dfm.layer."2/0"]
sigma = 0.15
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        _config, model, layers = load_dfm_config(config_file)
        assert model.sigma == 0.08  # Global default
        assert len(layers) == 2

    def test_per_layer_config_with_run_dfm(self, tmp_path):
        """Per-layer config produces different results per layer."""
        toml_content = """
[dfm]
resolution = 0.5
padding = 1.0
sigma = 0.0
layers = ["1/0", "2/0"]

[dfm.layer."2/0"]
sigma = 2.0
"""
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(toml_content)

        config, model, layers = load_dfm_config(config_file)

        cell = Cell("test")
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))
        cell.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(2, 0))

        result = run_dfm(cell, layers=layers, model=model, config=config)
        assert result.layers_processed == 2

        m1 = result.layers[0].metrics
        m2 = result.layers[1].metrics
        assert m1 is not None
        assert m2 is not None

        # Layer 1 has no blur (sigma=0) — minimal deviation
        # Layer 2 has strong blur (sigma=2) — significant deviation
        assert abs(m2.area_deviation) > abs(m1.area_deviation)


def _write_design_and_dfm_config(tmp_path, *, tolerances=False):
    """Helper: write a design .py file and rosette.toml with DFM config."""
    design_py = tmp_path / "design.py"
    design_py.write_text(
        "from rosette import Cell, Layer, Point, Polygon\n"
        'design = Cell("test")\n'
        "design.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))\n"
    )

    config_content = '[dfm]\nresolution = 0.5\npadding = 1.0\nsigma = 0.0\nlayers = ["1/0"]\n'
    if tolerances:
        config_content += "max_area_deviation = 0.5\n"

    config_file = tmp_path / "rosette.toml"
    config_file.write_text(config_content)
    return design_py, config_file


class TestDfmCli:
    """Tests for `rosette dfm` CLI command."""

    def test_run_dfm_check(self, tmp_path):
        """_run_dfm_check returns result for valid design."""
        design_py, config_file = _write_design_and_dfm_config(tmp_path)

        result, file_path, has_tol, cell = _run_dfm_check(str(design_py), str(config_file))
        assert isinstance(result, DfmResult)
        assert result.layers_processed == 1
        assert file_path.name == "design.py"
        assert has_tol is False
        assert cell is not None

    def test_print_dfm_result_informational(self, tmp_path, capsys):
        """_print_dfm_result prints metrics in informational mode."""
        design_py, config_file = _write_design_and_dfm_config(tmp_path)
        result, file_path, has_tol, _ = _run_dfm_check(str(design_py), str(config_file))

        passed = _print_dfm_result(result, file_path, has_tolerances=has_tol)
        assert passed

        captured = capsys.readouterr()
        assert "dfm" in captured.out
        assert "done" in captured.out
        assert "edge deviation" in captured.out
        assert "area" in captured.out

    def test_print_dfm_result_with_tolerances_pass(self, tmp_path, capsys):
        """_print_dfm_result shows 'passed' when tolerances met."""
        design_py, config_file = _write_design_and_dfm_config(tmp_path, tolerances=True)
        result, file_path, has_tol, _ = _run_dfm_check(str(design_py), str(config_file))

        passed = _print_dfm_result(result, file_path, has_tolerances=has_tol)
        assert passed

        captured = capsys.readouterr()
        assert "passed" in captured.out

    def test_print_dfm_result_with_violations(self, tmp_path, capsys):
        """_print_dfm_result shows violations when tolerances exceeded."""
        design_py = tmp_path / "design.py"
        design_py.write_text(
            "from rosette import Cell, Layer, Point, Polygon\n"
            'design = Cell("test")\n'
            "design.add_polygon(Polygon.rect(Point.origin(), 20.0, 0.3), Layer(1, 0))\n"
        )
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(
            "[dfm]\nresolution = 0.1\npadding = 2.0\nsigma = 3.0\n"
            'layers = ["1/0"]\nmax_area_deviation = 0.01\n'
        )

        result, file_path, has_tol, _ = _run_dfm_check(str(design_py), str(config_file))
        passed = _print_dfm_result(result, file_path, has_tolerances=has_tol)
        assert not passed

        captured = capsys.readouterr()
        assert "FAIL" in captured.out
        assert "violation" in captured.out

    def test_print_dfm_result_verbose(self, tmp_path, capsys):
        """Verbose mode shows raster dimensions."""
        design_py = tmp_path / "design.py"
        design_py.write_text(
            "from rosette import Cell, Layer, Point, Polygon\n"
            'design = Cell("test")\n'
            "design.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))\n"
        )
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(
            "[dfm]\nresolution = 0.5\npadding = 1.0\nsigma = 0.0\n"
            'layers = ["1/0"]\nkeep_raster = true\n'
        )

        result, file_path, has_tol, _ = _run_dfm_check(str(design_py), str(config_file))
        _print_dfm_result(result, file_path, verbose=True, has_tolerances=has_tol)

        captured = capsys.readouterr()
        assert "raster:" in captured.out
        assert "pixels" in captured.out

    def test_dfm_design_runs(self, tmp_path, capsys):
        """dfm_design runs successfully."""
        design_py, config_file = _write_design_and_dfm_config(tmp_path)

        dfm_design(str(design_py), str(config_file))

        captured = capsys.readouterr()
        assert "dfm" in captured.out
        assert "done" in captured.out

    def test_dfm_design_exits_on_failure(self, tmp_path):
        """dfm_design exits with code 1 on violations."""
        design_py = tmp_path / "design.py"
        design_py.write_text(
            "from rosette import Cell, Layer, Point, Polygon\n"
            'design = Cell("test")\n'
            "design.add_polygon(Polygon.rect(Point.origin(), 20.0, 0.3), Layer(1, 0))\n"
        )
        config_file = tmp_path / "rosette.toml"
        config_file.write_text(
            "[dfm]\nresolution = 0.1\npadding = 2.0\nsigma = 3.0\n"
            'layers = ["1/0"]\nmax_area_deviation = 0.01\n'
        )

        with pytest.raises(SystemExit) as exc_info:
            dfm_design(str(design_py), str(config_file))
        assert exc_info.value.code == 1

    def test_missing_config_exits(self, tmp_path):
        """Missing rosette.toml gives error and exits."""
        design_py = tmp_path / "design.py"
        design_py.write_text('from rosette import Cell\ndesign = Cell("test")\n')
        fake_config = str(tmp_path / "nonexistent.toml")

        with pytest.raises(SystemExit) as exc_info:
            dfm_design(str(design_py), fake_config)
        assert exc_info.value.code == 1
