"""Cross-language characterization for the versioned layout format."""

from __future__ import annotations

import json

import pytest

from rosette import _core as core


def test_python_binding_serializes_default_annotations():
    library = core.Library("defaults")
    library.add_cell(core.Cell("plain"))

    payload = json.loads(core.to_json(library))
    assert payload["format"] == "rosette-layout"
    assert payload["schema"] == 1
    assert payload["coordinate_system"] == {"unit": "um", "y_axis": "up"}
    cell = payload["library"]["cells"][0]
    assert cell["route"] == {"path_length": None, "bends": [], "warnings": []}
    assert cell["drc"] == {"skip": False, "waive_regions": []}


def test_python_binding_serializes_route_owned_annotations():
    route = core.Route(core.Layer(1, 0), bend_radius=10.0)
    route.start_at(0, 0)
    route.to(5, 0)
    route.to(5, 5)
    route.end_at(5, 5, 90)

    library = core.Library("route")
    library.add_cell(route.to_cell("route_cell"))
    payload = json.loads(core.to_json(library))
    annotation = payload["library"]["cells"][0]["route"]

    assert annotation["path_length"] == pytest.approx(route.path_length)
    assert annotation["warnings"] == route.warnings
    assert len(annotation["bends"]) == len(route.bends) == 1
    assert annotation["bends"][0] == {
        "radius": pytest.approx(route.bends[0].radius),
        "position": {"x": 5.0, "y": 0.0},
        "requested_radius": 10.0,
    }


def test_python_binding_persists_explicit_top_selection():
    library = core.Library("multi-root")
    library.add_cell(core.Cell("a"))
    library.add_cell(core.Cell("b"))
    library.set_top_cell("b")

    payload = json.loads(core.to_json(library))

    assert payload["library"]["top_cell"] == "b"
