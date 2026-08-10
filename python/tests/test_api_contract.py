"""Characterization tests for Rosette's Python and agent-facing contracts."""

from __future__ import annotations

import ast
import inspect
from pathlib import Path

import rosette
import rosette._core as core
import rosette.components

ROOT = Path(__file__).resolve().parents[2]
STUB_PATH = ROOT / "python" / "rosette" / "_core.pyi"

EXTENSION_EXPORTS = {
    "BBox",
    "Cell",
    "CellRef",
    "CheckViolation",
    "ChecksConfig",
    "ChecksResult",
    "DfmConfig",
    "DfmResult",
    "DfmViolation",
    "DrcCache",
    "DrcResult",
    "DrcRules",
    "DrcViolation",
    "GaussianModel",
    "Layer",
    "LayerMetrics",
    "LayerPrediction",
    "Library",
    "PathEndType",
    "Point",
    "Polygon",
    "PolygonIterator",
    "Port",
    "RenderResult",
    "Route",
    "Transform",
    "Vector2",
    "arc_points",
    "connect_transform",
    "fresnel_c",
    "fresnel_s",
    "offset_polygon",
    "offset_polygon_varying",
    "path_length",
    "read_gds",
    "render_png",
    "run_checks",
    "run_dfm",
    "run_drc",
    "to_json",
    "write_gds",
}

STUB_ONLY_VS_EXTENSION = {
    "ArrayCopy",
    "DEFAULT_LAYERS",
    "Instance",
    "LayerInfo",
    "LayerMap",
    "add_dfm_predictions",
    "load_checks_config",
    "load_dfm_config",
    "load_drc_rules",
    "load_layer_map",
}
STUB_ONLY_VS_FACADE = {
    "PolygonIterator",
    "connect_transform",
    "to_json",
}


def _stub_tree() -> ast.Module:
    return ast.parse(STUB_PATH.read_text())


def _stub_symbols() -> dict[str, ast.ClassDef | ast.FunctionDef]:
    return {
        node.name: node
        for node in _stub_tree().body
        if isinstance(node, (ast.ClassDef, ast.FunctionDef))
    }


def _stub_names() -> set[str]:
    names = set(_stub_symbols())
    names.update(
        node.target.id
        for node in _stub_tree().body
        if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name)
    )
    return names


def _public_names(obj: object) -> set[str]:
    return {name for name in dir(obj) if not name.startswith("_")}


def _stub_class_members(node: ast.ClassDef) -> set[str]:
    members = {child.name for child in node.body if isinstance(child, ast.FunctionDef)}
    members.update(
        child.target.id
        for child in node.body
        if isinstance(child, ast.AnnAssign) and isinstance(child.target, ast.Name)
    )
    return members


def _stub_parameter_shape(node: ast.FunctionDef) -> tuple[tuple[str, str], ...]:
    args = node.args
    shape: list[tuple[str, str]] = []
    shape.extend((arg.arg, "positional_only") for arg in args.posonlyargs)
    shape.extend((arg.arg, "positional_or_keyword") for arg in args.args)
    if args.vararg:
        shape.append((args.vararg.arg, "var_positional"))
    shape.extend((arg.arg, "keyword_only") for arg in args.kwonlyargs)
    if args.kwarg:
        shape.append((args.kwarg.arg, "var_keyword"))
    return tuple(shape)


def _runtime_parameter_shape(callable_obj: object) -> tuple[tuple[str, str], ...]:
    return tuple(
        (parameter.name, parameter.kind.name.lower())
        for parameter in inspect.signature(callable_obj).parameters.values()
    )


def test_extension_exports_are_stable():
    assert _public_names(core) == EXTENSION_EXPORTS


def test_public_facade_exports_exist_and_are_unique():
    assert len(rosette.__all__) == len(set(rosette.__all__))
    assert {name for name in rosette.__all__ if not hasattr(rosette, name)} == set()


def test_known_top_level_contract_differences_are_explicit():
    stub_names = _stub_names()
    extension_names = _public_names(core)
    facade_names = set(rosette.__all__)

    assert extension_names - stub_names == set()
    assert stub_names - extension_names == STUB_ONLY_VS_EXTENSION
    assert facade_names - stub_names == set()
    assert stub_names - facade_names == STUB_ONLY_VS_FACADE


def test_every_advertised_method_exists_at_runtime():
    missing: dict[str, set[str]] = {}
    for name, node in _stub_symbols().items():
        if not isinstance(node, ast.ClassDef):
            continue
        runtime_class = getattr(rosette, name, getattr(core, name, None))
        advertised = {
            child.name
            for child in node.body
            if isinstance(child, ast.FunctionDef) and not child.name.startswith("_")
        }
        absent = advertised - _public_names(runtime_class)
        if absent:
            missing[name] = absent

    assert missing == {}


def test_public_facade_methods_are_represented_in_agent_reference():
    stub_classes = {
        name: node for name, node in _stub_symbols().items() if isinstance(node, ast.ClassDef)
    }
    missing: dict[str, set[str]] = {}

    for name in set(rosette.__all__) & set(stub_classes):
        runtime_class = getattr(rosette, name)
        absent = _public_names(runtime_class) - _stub_class_members(stub_classes[name])
        if absent:
            missing[name] = absent

    assert missing == {}


def test_shared_function_signature_shapes_are_characterized():
    stub_functions = {
        name: node for name, node in _stub_symbols().items() if isinstance(node, ast.FunctionDef)
    }
    mismatches: dict[str, tuple[tuple[tuple[str, str], ...], tuple[tuple[str, str], ...]]] = {}

    for name in set(rosette.__all__) & set(stub_functions):
        runtime = getattr(rosette, name)
        if not callable(runtime):
            continue
        stub_shape = _stub_parameter_shape(stub_functions[name])
        runtime_shape = _runtime_parameter_shape(runtime)
        if stub_shape != runtime_shape:
            mismatches[name] = (stub_shape, runtime_shape)

    assert mismatches == {}


def test_corrected_agent_reference_annotations_match_facade_contract():
    functions = {
        name: node for name, node in _stub_symbols().items() if isinstance(node, ast.FunctionDef)
    }

    assert ast.unparse(functions["read_gds"].args.args[0].annotation) == "str | Path"
    assert ast.unparse(functions["write_gds"].args.args[0].annotation) == "str | Path"
    render_design = functions["render_png"].args.args[0]
    assert render_design.arg == "design"
    assert ast.unparse(render_design.annotation) == "Cell | Library"


def test_component_catalog_is_not_embedded_in_core_agent_reference():
    assert _stub_names().isdisjoint(rosette.components.__all__)


def test_cell_ref_names_is_delegated_by_public_cell_wrapper():
    child = rosette.Cell("child")
    parent = rosette.Cell("parent")
    parent.add_ref(child.at(0, 0))

    assert parent.cell_ref_names() == ["child"]
