"""Characterization tests for Rosette's Python and agent-facing contracts."""

from __future__ import annotations

import ast
import inspect
from pathlib import Path

import rosette
import rosette._core as core
import rosette.components

ROOT = Path(__file__).resolve().parents[2]
NATIVE_STUB_PATH = ROOT / "python" / "rosette" / "_core.pyi"
FACADE_STUB_PATH = ROOT / "python" / "rosette" / "api.pyi"

CURRENT_FACADE_EXPORTS = (
    "DEFAULT_LAYERS",
    "ArrayCopy",
    "BBox",
    "Cell",
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
    "Instance",
    "Layer",
    "LayerInfo",
    "LayerMap",
    "LayerMetrics",
    "LayerPrediction",
    "Library",
    "PathEndType",
    "Point",
    "Polygon",
    "Port",
    "RenderResult",
    "Route",
    "Transform",
    "Vector2",
    "add_dfm_predictions",
    "arc_points",
    "connect_transform",
    "fresnel_c",
    "fresnel_s",
    "load_checks_config",
    "load_dfm_config",
    "load_drc_rules",
    "load_layer_map",
    "offset_polygon",
    "offset_polygon_varying",
    "path_length",
    "read_gds",
    "render_png",
    "run_checks",
    "run_dfm",
    "run_drc",
    "write_gds",
)

CURRENT_EXPORTS_BY_KIND = {
    "core": {
        "BBox",
        "Cell",
        "Instance",
        "Layer",
        "Library",
        "PathEndType",
        "Point",
        "Polygon",
        "Port",
        "Transform",
        "Vector2",
        "connect_transform",
    },
    "feature": {
        "ChecksConfig",
        "DfmConfig",
        "DrcRules",
        "GaussianModel",
        "Route",
        "arc_points",
        "offset_polygon",
        "offset_polygon_varying",
        "read_gds",
        "render_png",
        "run_checks",
        "run_dfm",
        "run_drc",
        "write_gds",
    },
    "project_policy": {
        "DEFAULT_LAYERS",
        "LayerInfo",
        "LayerMap",
        "load_checks_config",
        "load_dfm_config",
        "load_drc_rules",
        "load_layer_map",
    },
    "result_type": {
        "ArrayCopy",
        "CheckViolation",
        "ChecksResult",
        "DfmResult",
        "DfmViolation",
        "DrcResult",
        "DrcViolation",
        "LayerMetrics",
        "LayerPrediction",
        "RenderResult",
    },
    "internal": {
        "DrcCache",
        "add_dfm_predictions",
        "fresnel_c",
        "fresnel_s",
        "path_length",
    },
}

TARGET_FACADE_EXPORTS = (
    "BBox",
    "Cell",
    "Instance",
    "Layer",
    "Library",
    "PathEndType",
    "Point",
    "Polygon",
    "Port",
    "Transform",
    "Vector2",
    "connect_transform",
)

TARGET_FEATURE_EXPORTS = {
    "rosette.checks": (
        "CheckViolation",
        "ChecksConfig",
        "ChecksResult",
        "load_checks_config",
        "run_checks",
    ),
    "rosette.dfm": (
        "DfmConfig",
        "DfmResult",
        "DfmViolation",
        "GaussianModel",
        "LayerMetrics",
        "LayerPrediction",
        "load_dfm_config",
        "run_dfm",
    ),
    "rosette.drc": (
        "DrcResult",
        "DrcRules",
        "DrcViolation",
        "load_drc_rules",
        "run_drc",
    ),
    "rosette.geometry": (
        "arc_points",
        "offset_polygon",
        "offset_polygon_varying",
    ),
    "rosette.io": ("read_gds", "write_gds"),
    "rosette.layout": ("ArrayCopy",),
    "rosette.project": ("LayerInfo", "LayerMap", "load_layer_map"),
    "rosette.render": ("RenderResult", "render_png"),
    "rosette.routing": ("Route",),
}

TARGET_REMOVED_EXPORTS = {
    "DEFAULT_LAYERS",
    "DrcCache",
    "add_dfm_predictions",
    "fresnel_c",
    "fresnel_s",
    "path_length",
}

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


def _stub_tree(path: Path) -> ast.Module:
    return ast.parse(path.read_text())


def _stub_symbols(path: Path) -> dict[str, ast.ClassDef | ast.FunctionDef]:
    return {
        node.name: node
        for node in _stub_tree(path).body
        if isinstance(node, (ast.ClassDef, ast.FunctionDef))
    }


def _stub_names(path: Path) -> set[str]:
    names = set(_stub_symbols(path))
    names.update(
        node.target.id
        for node in _stub_tree(path).body
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
    assert tuple(rosette.__all__) == CURRENT_FACADE_EXPORTS
    assert {name for name in rosette.__all__ if not hasattr(rosette, name)} == set()


def test_current_facade_classification_is_complete_and_disjoint():
    classified = [name for exports in CURRENT_EXPORTS_BY_KIND.values() for name in exports]

    assert set(CURRENT_EXPORTS_BY_KIND) == {
        "core",
        "feature",
        "project_policy",
        "result_type",
        "internal",
    }
    assert len(classified) == len(set(classified))
    assert set(classified) == set(CURRENT_FACADE_EXPORTS)


def test_target_contract_assigns_every_current_export_once():
    destinations = [
        *TARGET_FACADE_EXPORTS,
        *(name for exports in TARGET_FEATURE_EXPORTS.values() for name in exports),
        *TARGET_REMOVED_EXPORTS,
    ]

    assert len(destinations) == len(set(destinations))
    assert set(destinations) == set(CURRENT_FACADE_EXPORTS)


def test_native_stub_exactly_matches_extension_exports():
    assert _stub_names(NATIVE_STUB_PATH) == _public_names(core)


def test_facade_stub_exactly_matches_public_exports():
    assert _stub_names(FACADE_STUB_PATH) == set(rosette.__all__)


def test_extension_only_symbols_have_explicit_visibility():
    assert rosette.connect_transform is core.connect_transform
    assert hasattr(core, "CellRef")
    assert not hasattr(rosette, "CellRef")
    assert hasattr(core, "to_json")
    assert not hasattr(rosette, "to_json")
    assert not hasattr(core, "PolygonIterator")


def test_native_class_members_exactly_match_runtime():
    mismatches: dict[str, tuple[set[str], set[str]]] = {}
    for name, node in _stub_symbols(NATIVE_STUB_PATH).items():
        if not isinstance(node, ast.ClassDef):
            continue
        runtime_class = getattr(core, name)
        stub_members = {
            member for member in _stub_class_members(node) if not member.startswith("_")
        }
        runtime_members = _public_names(runtime_class)
        if stub_members != runtime_members:
            mismatches[name] = (
                stub_members - runtime_members,
                runtime_members - stub_members,
            )

    assert mismatches == {}


def test_native_instance_lowering_hook_matches_private_stub():
    cell_ref = _stub_symbols(NATIVE_STUB_PATH)["CellRef"]
    assert isinstance(cell_ref, ast.ClassDef)
    lowering = next(
        child
        for child in cell_ref.body
        if isinstance(child, ast.FunctionDef) and child.name == "_from_transform"
    )

    assert hasattr(core.CellRef, "_from_transform")
    assert _stub_parameter_shape(lowering) == _runtime_parameter_shape(core.CellRef._from_transform)


def test_library_method_signatures_match_contracts():
    methods = {
        "add_cell",
        "add_cell_recursive",
        "roots",
        "set_top_cell",
        "clear_top_cell",
        "top_cell",
    }
    for path, runtime in (
        (NATIVE_STUB_PATH, core.Library),
        (FACADE_STUB_PATH, rosette.Library),
    ):
        library = _stub_symbols(path)["Library"]
        assert isinstance(library, ast.ClassDef)
        stub_methods = {
            node.name: node for node in library.body if isinstance(node, ast.FunctionDef)
        }
        for name in methods:
            assert _stub_parameter_shape(stub_methods[name]) == _runtime_parameter_shape(
                getattr(runtime, name)
            )


def test_public_facade_methods_are_represented_in_agent_reference():
    stub_classes = {
        name: node
        for name, node in _stub_symbols(FACADE_STUB_PATH).items()
        if isinstance(node, ast.ClassDef)
    }
    mismatches: dict[str, tuple[set[str], set[str]]] = {}

    for name in set(rosette.__all__) & set(stub_classes):
        runtime_class = getattr(rosette, name)
        stub_members = {
            member
            for member in _stub_class_members(stub_classes[name])
            if not member.startswith("_")
        }
        runtime_members = _public_names(runtime_class)
        if stub_members != runtime_members:
            mismatches[name] = (
                stub_members - runtime_members,
                runtime_members - stub_members,
            )

    assert mismatches == {}


def test_native_function_signature_shapes_match_runtime():
    stub_functions = {
        name: node
        for name, node in _stub_symbols(NATIVE_STUB_PATH).items()
        if isinstance(node, ast.FunctionDef)
    }
    mismatches: dict[str, tuple[tuple[tuple[str, str], ...], tuple[tuple[str, str], ...]]] = {}

    for name, node in stub_functions.items():
        runtime = getattr(core, name)
        stub_shape = _stub_parameter_shape(node)
        runtime_shape = _runtime_parameter_shape(runtime)
        if stub_shape != runtime_shape:
            mismatches[name] = (stub_shape, runtime_shape)

    assert mismatches == {}


def test_native_stub_uses_precise_readonly_and_layer_contracts():
    tree = _stub_tree(NATIVE_STUB_PATH)
    assert not any(isinstance(node, ast.Name) and node.id == "Any" for node in ast.walk(tree))

    point = _stub_symbols(NATIVE_STUB_PATH)["Point"]
    assert isinstance(point, ast.ClassDef)
    x = next(node for node in point.body if isinstance(node, ast.FunctionDef) and node.name == "x")
    assert any(
        isinstance(decorator, ast.Name) and decorator.id == "property"
        for decorator in x.decorator_list
    )

    rules = _stub_symbols(NATIVE_STUB_PATH)["DrcRules"]
    assert isinstance(rules, ast.ClassDef)
    min_width = next(
        node
        for node in rules.body
        if isinstance(node, ast.FunctionDef) and node.name == "min_width"
    )
    layer = next(
        arg for arg in (*min_width.args.posonlyargs, *min_width.args.args) if arg.arg == "layer"
    )
    assert ast.unparse(layer.annotation) == "Layer | int | tuple[int, int]"


def test_facade_function_signature_shapes_match_runtime():
    stub_functions = {
        name: node
        for name, node in _stub_symbols(FACADE_STUB_PATH).items()
        if isinstance(node, ast.FunctionDef)
    }
    mismatches = {}
    for name, node in stub_functions.items():
        runtime = getattr(rosette, name)
        stub_shape = _stub_parameter_shape(node)
        runtime_shape = _runtime_parameter_shape(runtime)
        if stub_shape != runtime_shape:
            mismatches[name] = (stub_shape, runtime_shape)

    assert mismatches == {}


def test_route_constructor_signatures_match_agent_reference():
    for path, runtime in ((FACADE_STUB_PATH, rosette.Route), (NATIVE_STUB_PATH, core.Route)):
        route = _stub_symbols(path)["Route"]
        assert isinstance(route, ast.ClassDef)
        init = next(
            child
            for child in route.body
            if isinstance(child, ast.FunctionDef) and child.name == "__init__"
        )
        stub_shape = _stub_parameter_shape(init)[1:]
        stub_defaults = tuple(ast.literal_eval(default) for default in init.args.defaults)

        assert _runtime_parameter_shape(runtime) == stub_shape
        assert stub_defaults == (0.5, 5.0, "circular")
        parameters = inspect.signature(runtime).parameters
        assert tuple(parameter.default for parameter in parameters.values()) == (
            inspect.Parameter.empty,
            *stub_defaults,
        )


def test_corrected_agent_reference_annotations_match_facade_contract():
    functions = {
        name: node
        for name, node in _stub_symbols(FACADE_STUB_PATH).items()
        if isinstance(node, ast.FunctionDef)
    }

    assert ast.unparse(functions["read_gds"].args.args[0].annotation) == "str | Path"
    assert ast.unparse(functions["write_gds"].args.args[0].annotation) == "str | Path"
    render_design = functions["render_png"].args.args[0]
    assert render_design.arg == "design"
    assert ast.unparse(render_design.annotation) == "Cell | Library"


def test_component_catalog_is_not_embedded_in_core_agent_reference():
    assert _stub_names(FACADE_STUB_PATH).isdisjoint(rosette.components.__all__)
    content = FACADE_STUB_PATH.read_text()
    assert "from components" not in content
    assert "rosette.components" not in content


def test_cell_ref_names_is_delegated_by_public_cell_wrapper():
    child = rosette.Cell("child")
    parent = rosette.Cell("parent")
    parent.add_ref(child.at(0, 0))

    assert parent.cell_ref_names() == ["child"]
