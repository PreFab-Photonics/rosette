"""Tests for the `rosette shot` CLI subcommand."""

import json
import subprocess
import sys
from pathlib import Path

import pytest

from rosette.cli import (
    _load_retain_config,
    _parse_bbox_arg,
    _parse_layers_arg,
    _project_snapshot_dir,
    _prune_snapshots,
    shot_design,
)

PNG_MAGIC = b"\x89PNG\r\n\x1a\n"

DESIGN_SOURCE = """\
from rosette import Cell, Layer, Point, Polygon

design = Cell("smoke")
design.add_polygon(Polygon.rect(Point.origin(), 10.0, 10.0), Layer(1, 0))
design.add_polygon(Polygon.rect(Point(20.0, 0.0), 10.0, 10.0), Layer(2, 0))
"""


@pytest.fixture
def design_file(tmp_path: Path) -> Path:
    p = tmp_path / "smoke.py"
    p.write_text(DESIGN_SOURCE)
    return p


class TestParseBboxArg:
    def test_valid(self):
        bbox = _parse_bbox_arg("0,0,10,5")
        assert bbox.min.x == 0.0
        assert bbox.max.x == 10.0
        assert bbox.max.y == 5.0

    def test_negative_coords(self):
        bbox = _parse_bbox_arg("-5,-10,5,10")
        assert bbox.min.x == -5.0
        assert bbox.max.y == 10.0

    def test_wrong_part_count(self):
        with pytest.raises(ValueError, match="must be 'XMIN"):
            _parse_bbox_arg("0,0,10")

    def test_non_numeric(self):
        with pytest.raises(ValueError, match="must be numbers"):
            _parse_bbox_arg("0,0,abc,5")

    def test_min_must_be_less_than_max(self):
        with pytest.raises(ValueError, match="max must be greater"):
            _parse_bbox_arg("10,0,5,5")


class TestParseLayersArg:
    def test_single(self):
        assert _parse_layers_arg("1/0") == [(1, 0)]

    def test_multiple(self):
        assert _parse_layers_arg("1/0,2/3") == [(1, 0), (2, 3)]

    def test_missing_slash(self):
        with pytest.raises(ValueError, match="number/datatype"):
            _parse_layers_arg("1")

    def test_non_int(self):
        with pytest.raises(ValueError, match="must be ints"):
            _parse_layers_arg("a/0")


class TestShotDesign:
    def test_writes_png_and_sidecar(self, design_file: Path, tmp_path: Path):
        out = tmp_path / "shot.png"
        shot_design(
            design=str(design_file),
            out=str(out),
            cell=None,
            bbox_str=None,
            layer_str=None,
            width=200,
            height=None,
            pad=0.1,
            bg="#1a1a1a",
            fill_alpha=178,
            sidecar=True,
        )
        assert out.exists()
        assert out.read_bytes()[:8] == PNG_MAGIC

        sidecar = out.with_suffix(".png.json")
        assert sidecar.exists()
        meta = json.loads(sidecar.read_text())
        assert meta["image"] == "shot.png"
        assert meta["layers_rendered"] == [[1, 0], [2, 0]]
        assert set(meta["view"].keys()) >= {
            "scale_px_per_um",
            "canvas_px",
            "world_bbox_um",
        }

    def test_no_sidecar_flag(self, design_file: Path, tmp_path: Path):
        out = tmp_path / "shot.png"
        shot_design(
            design=str(design_file),
            out=str(out),
            cell=None,
            bbox_str=None,
            layer_str=None,
            width=128,
            height=None,
            pad=0.1,
            bg="#1a1a1a",
            fill_alpha=178,
            sidecar=False,
        )
        assert out.exists()
        assert not out.with_suffix(".png.json").exists()

    def test_default_output_path(self, design_file: Path, tmp_path: Path, monkeypatch):
        monkeypatch.chdir(tmp_path)
        shot_design(
            design=str(design_file),
            out=None,  # → smoke.png next to the design
            cell=None,
            bbox_str=None,
            layer_str=None,
            width=128,
            height=None,
            pad=0.1,
            bg="#1a1a1a",
            fill_alpha=178,
            sidecar=False,
        )
        assert (design_file.parent / "smoke.png").exists()

    def test_bbox_filter(self, design_file: Path, tmp_path: Path):
        out = tmp_path / "shot.png"
        shot_design(
            design=str(design_file),
            out=str(out),
            cell=None,
            bbox_str="0,0,10,10",  # excludes layer-2 rect at x=20..30
            layer_str=None,
            width=128,
            height=None,
            pad=0.1,
            bg="#1a1a1a",
            fill_alpha=178,
            sidecar=True,
        )
        meta = json.loads(out.with_suffix(".png.json").read_text())
        assert meta["layers_rendered"] == [[1, 0]]

    def test_layer_filter(self, design_file: Path, tmp_path: Path):
        out = tmp_path / "shot.png"
        shot_design(
            design=str(design_file),
            out=str(out),
            cell=None,
            bbox_str=None,
            layer_str="2/0",
            width=128,
            height=None,
            pad=0.1,
            bg="#1a1a1a",
            fill_alpha=178,
            sidecar=True,
        )
        meta = json.loads(out.with_suffix(".png.json").read_text())
        assert meta["layers_rendered"] == [[2, 0]]

    def test_invalid_bbox_exits(self, design_file: Path, tmp_path: Path):
        with pytest.raises(SystemExit) as exc:
            shot_design(
                design=str(design_file),
                out=str(tmp_path / "x.png"),
                cell=None,
                bbox_str="bad",
                layer_str=None,
                width=128,
                height=None,
                pad=0.1,
                bg="#1a1a1a",
                fill_alpha=178,
                sidecar=False,
            )
        assert exc.value.code == 2


class TestProjectLocalDefault:
    """Snapshots default to <project_root>/.rosette/snapshots/ when rosette.toml exists."""

    def _make_project(self, tmp_path: Path) -> Path:
        """Create a minimal rosette project with a design file."""
        (tmp_path / "rosette.toml").write_text('[project]\nname = "test"\n')
        designs = tmp_path / "designs"
        designs.mkdir()
        design = designs / "smoke.py"
        design.write_text(DESIGN_SOURCE)
        return design

    def test_default_lands_in_project_snapshots_dir(
        self, tmp_path: Path, monkeypatch
    ):
        design = self._make_project(tmp_path)
        monkeypatch.chdir(tmp_path)
        shot_design(
            design=str(design),
            out=None,
            cell=None,
            bbox_str=None,
            layer_str=None,
            width=128,
            height=None,
            pad=0.1,
            bg="#1a1a1a",
            fill_alpha=178,
            sidecar=True,
        )
        snapshots = tmp_path / ".rosette" / "snapshots"
        assert snapshots.is_dir()
        pngs = list(snapshots.glob("*.png"))
        assert len(pngs) == 1
        # Filename pattern: <stem>-<YYYYMMDD-HHMMSS>-<6hex>.png
        name = pngs[0].name
        assert name.startswith("smoke-")
        assert name.endswith(".png")
        assert pngs[0].with_suffix(".png.json").exists()

    def test_falls_back_when_no_rosette_toml(self, tmp_path: Path, monkeypatch):
        # No rosette.toml anywhere → should write next to design.
        design = tmp_path / "loose.py"
        design.write_text(DESIGN_SOURCE)
        monkeypatch.chdir(tmp_path)
        shot_design(
            design=str(design),
            out=None,
            cell=None,
            bbox_str=None,
            layer_str=None,
            width=128,
            height=None,
            pad=0.1,
            bg="#1a1a1a",
            fill_alpha=178,
            sidecar=False,
        )
        assert (tmp_path / "loose.png").exists()
        assert not (tmp_path / ".rosette").exists()

    def test_explicit_out_bypasses_project_dir(self, tmp_path: Path, monkeypatch):
        design = self._make_project(tmp_path)
        monkeypatch.chdir(tmp_path)
        explicit = tmp_path / "elsewhere.png"
        shot_design(
            design=str(design),
            out=str(explicit),
            cell=None,
            bbox_str=None,
            layer_str=None,
            width=128,
            height=None,
            pad=0.1,
            bg="#1a1a1a",
            fill_alpha=178,
            sidecar=False,
        )
        assert explicit.exists()
        assert not (tmp_path / ".rosette").exists()

    def test_project_snapshot_dir_helper(self, tmp_path: Path, monkeypatch):
        (tmp_path / "rosette.toml").write_text("")
        monkeypatch.chdir(tmp_path)
        d = _project_snapshot_dir()
        assert d == tmp_path / ".rosette" / "snapshots"

    def test_project_snapshot_dir_returns_none_outside_project(
        self, tmp_path: Path, monkeypatch
    ):
        monkeypatch.chdir(tmp_path)
        assert _project_snapshot_dir() is None


class TestRetention:
    def test_prune_keeps_n_newest(self, tmp_path: Path):
        # Create 5 dummy snapshots with staggered mtimes
        import os
        import time as _t

        for i in range(5):
            png = tmp_path / f"snap-{i}.png"
            png.write_bytes(b"x")
            sidecar = tmp_path / f"snap-{i}.png.json"
            sidecar.write_text("{}")
            # Older mtime for lower indices
            ts = _t.time() - (5 - i)
            os.utime(png, (ts, ts))

        deleted = _prune_snapshots(tmp_path, retain=2)
        assert deleted == 3
        remaining = sorted(p.name for p in tmp_path.glob("*.png"))
        assert remaining == ["snap-3.png", "snap-4.png"]
        # Sidecars for deleted PNGs are gone too
        assert not (tmp_path / "snap-0.png.json").exists()
        assert (tmp_path / "snap-3.png.json").exists()

    def test_prune_zero_keeps_all(self, tmp_path: Path):
        for i in range(3):
            (tmp_path / f"s-{i}.png").write_bytes(b"x")
        deleted = _prune_snapshots(tmp_path, retain=0)
        assert deleted == 0
        assert len(list(tmp_path.glob("*.png"))) == 3

    def test_prune_negative_keeps_all(self, tmp_path: Path):
        (tmp_path / "x.png").write_bytes(b"x")
        deleted = _prune_snapshots(tmp_path, retain=-1)
        assert deleted == 0

    def test_prune_ignores_non_png_files(self, tmp_path: Path):
        (tmp_path / "a.png").write_bytes(b"x")
        (tmp_path / "notes.txt").write_text("keep me")
        (tmp_path / "config.toml").write_text("keep me too")
        _prune_snapshots(tmp_path, retain=10)
        assert (tmp_path / "notes.txt").exists()
        assert (tmp_path / "config.toml").exists()

    def test_prune_missing_dir_is_noop(self, tmp_path: Path):
        deleted = _prune_snapshots(tmp_path / "does-not-exist", retain=5)
        assert deleted == 0

    def test_load_retain_config_default(self, tmp_path: Path, monkeypatch):
        monkeypatch.chdir(tmp_path)
        # No rosette.toml → default 20
        assert _load_retain_config() == 20

    def test_load_retain_config_from_toml(self, tmp_path: Path, monkeypatch):
        (tmp_path / "rosette.toml").write_text("[snapshots]\nretain = 5\n")
        monkeypatch.chdir(tmp_path)
        assert _load_retain_config() == 5

    def test_load_retain_config_invalid_falls_back(
        self, tmp_path: Path, monkeypatch
    ):
        (tmp_path / "rosette.toml").write_text('[snapshots]\nretain = "bad"\n')
        monkeypatch.chdir(tmp_path)
        assert _load_retain_config() == 20

    def test_shot_prunes_default_dir(self, tmp_path: Path, monkeypatch):
        # Make a project with a design and pre-populate snapshots dir.
        (tmp_path / "rosette.toml").write_text("")
        designs = tmp_path / "designs"
        designs.mkdir()
        design = designs / "p.py"
        design.write_text(DESIGN_SOURCE)
        snapshots = tmp_path / ".rosette" / "snapshots"
        snapshots.mkdir(parents=True)
        for i in range(3):
            (snapshots / f"old-{i}.png").write_bytes(b"x")
            (snapshots / f"old-{i}.png.json").write_text("{}")
        monkeypatch.chdir(tmp_path)

        shot_design(
            design=str(design),
            out=None,
            cell=None,
            bbox_str=None,
            layer_str=None,
            width=128,
            height=None,
            pad=0.1,
            bg="#1a1a1a",
            fill_alpha=178,
            sidecar=True,
            retain=2,  # keep only 2 newest including the one we just took
        )

        pngs = list(snapshots.glob("*.png"))
        assert len(pngs) == 2

    def test_shot_explicit_out_skips_pruning(self, tmp_path: Path, monkeypatch):
        (tmp_path / "rosette.toml").write_text("")
        designs = tmp_path / "designs"
        designs.mkdir()
        design = designs / "p.py"
        design.write_text(DESIGN_SOURCE)
        snapshots = tmp_path / ".rosette" / "snapshots"
        snapshots.mkdir(parents=True)
        for i in range(5):
            (snapshots / f"keep-{i}.png").write_bytes(b"x")
        monkeypatch.chdir(tmp_path)

        shot_design(
            design=str(design),
            out=str(tmp_path / "elsewhere.png"),
            cell=None,
            bbox_str=None,
            layer_str=None,
            width=128,
            height=None,
            pad=0.1,
            bg="#1a1a1a",
            fill_alpha=178,
            sidecar=False,
            retain=1,  # would prune to 1, but explicit --out skips pruning entirely
        )
        assert len(list(snapshots.glob("*.png"))) == 5


class TestShotSubprocess:
    """End-to-end test invoking the actual `rosette shot` console script."""

    def test_subprocess_invocation(self, design_file: Path, tmp_path: Path):
        out = tmp_path / "e2e.png"
        result = subprocess.run(
            [
                sys.executable,
                "-m",
                "rosette.cli",
                "shot",
                str(design_file),
                "--out",
                str(out),
                "--width",
                "256",
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )
        assert result.returncode == 0, f"stderr: {result.stderr}\nstdout: {result.stdout}"
        assert out.exists()
        assert out.read_bytes()[:8] == PNG_MAGIC
        assert out.with_suffix(".png.json").exists()
