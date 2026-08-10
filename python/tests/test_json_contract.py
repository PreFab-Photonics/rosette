"""Cross-language characterization for the current JSON wire format."""

from __future__ import annotations

import json
from pathlib import Path

from rosette import _core as core

FIXTURE = Path(__file__).resolve().parents[2] / "fixtures" / "json" / "current-library.json"


def test_python_binding_matches_current_json_fixture():
    leaf = core.Cell("leaf", drc_skip=True)
    leaf.add_polygon(core.Polygon.rect(core.Point(-1, -0.5), 2, 1), core.Layer(1, 2))
    leaf.add_path(
        [core.Point(0, 0), core.Point(5, 0), core.Point(5, 2)],
        0.4,
        core.Layer(3, 0),
        core.PathEndType.ROUND,
    )
    leaf.add_text("leaf-label", core.Point(1, 2), core.Layer(10, 0), 1.5)
    leaf.add_port(core.Port("opt", core.Point(0, 0), core.Vector2(-1, 0), 0.4))
    leaf.path_length = 7.25
    leaf.add_bend(3.0, 5.0, 0.0, 4.0)
    leaf.add_warning("radius reduced")
    leaf.add_drc_waive_region(core.BBox(core.Point(-0.5, -0.5), core.Point(0.5, 0.5)))

    middle = core.Cell("middle")
    middle.add_ref(core.CellRef("leaf").at(2, 4))

    top = core.Cell("top")
    top.add_ref(core.CellRef("middle").at(10, 20).rotate(30))
    top.add_ref(
        core.CellRef("leaf").at(-5, 3).array_vectors(3, 2, core.Vector2(8, 1), core.Vector2(2, 6))
    )
    top.add_ref(core.CellRef("missing").at(100, 100))

    library = core.Library("phase0_contract")
    for cell in (leaf, middle, top):
        library.add_cell(cell)

    assert json.loads(core.to_json(library)) == json.loads(FIXTURE.read_text())
