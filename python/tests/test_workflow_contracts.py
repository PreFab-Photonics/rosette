"""End-to-end characterization for representative Rosette user workflows."""

from __future__ import annotations

import importlib
import json
import sys
from pathlib import Path

from rosette.cli import build_design, check_design, init_project, shot_design, update_project

PNG_MAGIC = b"\x89PNG\r\n\x1a\n"

GENERIC_LOOPBACK = """\
from rosette import Cell
from rosette.project import load_layer_map
from rosette.routing import Route
from components import grating_coupler

layers = load_layer_map()
gc = grating_coupler(layers.silicon.layer, waveguide_width=0.5)

gc_in = gc.at(0, 0)
gc_out = gc.at(0, 127)

route = Route(layers.silicon.layer, width=0.5, bend_radius=10.0)
route.start_at_port(gc_in.port("opt"))
route.to(40, 0)
route.to(40, 127)
route.end_at_port(gc_out.port("opt"))

design = Cell("loopback")
design.add_ref(gc_in)
design.add_ref(gc_out)
design.add_ref(route.to_cell("route"))
"""


def _make_uv_project(project_dir: Path) -> None:
    project_dir.mkdir()
    (project_dir / "pyproject.toml").write_text(
        '[project]\nname = "workflow-contract"\nversion = "0.1.0"\n'
    )
    (project_dir / ".gitignore").write_text(".venv/\n")


def _clear_local_components() -> None:
    for module_name in list(sys.modules):
        if module_name == "components" or module_name.startswith("components."):
            del sys.modules[module_name]


def test_generated_project_build_check_shot_update_workflow(
    tmp_path: Path, monkeypatch, capsys
) -> None:
    project_dir = tmp_path / "workflow-contract"
    _make_uv_project(project_dir)
    monkeypatch.chdir(project_dir)
    _clear_local_components()

    try:
        init_project("generic", tool="agents,claude")
        design_path = project_dir / "designs" / "loopback.py"
        design_path.write_text(GENERIC_LOOPBACK)

        build_design(str(design_path), "output")
        assert (project_dir / "output" / "loopback.gds").exists()

        components = importlib.import_module("components")
        assert components.grating_coupler.__module__ == "components.grating_coupler"

        capsys.readouterr()
        check_design(str(design_path), json_output=True)
        check_payload = json.loads(capsys.readouterr().out)
        assert check_payload["schema"] == 1
        assert check_payload["command"] == "check"
        assert check_payload["passed"] is True
        assert check_payload["dfm"] is None
        assert check_payload["drc"]["passed"] is True
        assert check_payload["checks"]["passed"] is True

        shot_path = project_dir / "output" / "loopback.png"
        shot_design(
            design=str(design_path),
            out=str(shot_path),
            cell=None,
            bbox_str=None,
            layer_str=None,
            width=256,
            height=None,
            pad=0.1,
            bg="#1a1a1a",
            fill_alpha=178,
            sidecar=True,
        )
        assert shot_path.read_bytes()[:8] == PNG_MAGIC
        assert shot_path.with_suffix(".png.json").exists()

        agents_path = project_dir / "AGENTS.md"
        agents_path.write_text(agents_path.read_text() + "\n## User rules\n\nPreserve this.\n")
        component_path = project_dir / "components" / "grating_coupler.py"
        component_path.write_text(component_path.read_text() + "\n# User-owned edit.\n")
        design_before = design_path.read_bytes()
        component_before = component_path.read_bytes()

        update_project()

        assert design_path.read_bytes() == design_before
        assert component_path.read_bytes() == component_before
        assert "Preserve this." in agents_path.read_text()
        assert (project_dir / "CLAUDE.md").exists()
        manifest = json.loads((project_dir / ".rosette" / "manifest.json").read_text())
        assert set(manifest["references"]) == {"api.pyi", "cli.json"}
    finally:
        _clear_local_components()
        while str(project_dir) in sys.path:
            sys.path.remove(str(project_dir))
