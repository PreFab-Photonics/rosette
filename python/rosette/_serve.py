"""Live viewer for rosette serve and run commands.

Handles design serialization, server startup, file watching, and
Tauri/browser viewer management.
"""

from __future__ import annotations

import copy
import importlib
import inspect
import json
import math
import os
import shutil
import signal
import subprocess
import sys
import threading
import types
import typing
import webbrowser
from collections.abc import Callable
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from rosette import Cell, Library
    from rosette._core import DrcCache
    from rosette._core import Library as _CoreLibrary
    from rosette.drc import DrcRules
    from rosette.project import LayerMap

_LAYOUT_FORMAT = "rosette-layout"
_LAYOUT_SCHEMA = 1

# =============================================================================
# Design serialization helpers
# =============================================================================


def _build_cell_tree(cell: Cell, child_cells_list: list[Cell] | None) -> dict[str, object]:
    """Build a hierarchy tree from a cell and its children.

    Uses the Rust-side cell_ref_names() to get direct children of each cell,
    then recursively builds the tree structure.

    Args:
        cell: The top-level Cell (Python wrapper)
        child_cells_list: List of all child Cell objects (Python wrappers), or None

    Returns:
        Dict tree: {"name": str, "children": [...]}, suitable for JSON serialization.
    """
    # Build a lookup from cell name -> Python Cell wrapper
    cell_map = {cell.name: cell}
    if child_cells_list:
        for c in child_cells_list:
            cell_map[c.name] = c

    # Track visited cells to avoid infinite recursion from circular refs
    def build_node(c: Cell, visited: set[str] | None = None) -> dict[str, object]:
        if visited is None:
            visited = set()
        if c.name in visited:
            return {"name": c.name, "children": []}
        visited = visited | {c.name}

        # Get direct child cell names from Rust CellRef elements
        direct_refs = c.cell_ref_names()
        children: list[dict[str, object]] = []
        for ref_name in sorted(set(direct_refs)):
            child = cell_map.get(ref_name)
            if child is not None:
                children.append(build_node(child, visited))
            else:
                # Referenced cell not in our tracked set — show as leaf
                children.append({"name": ref_name, "children": []})
        return {"name": c.name, "children": children}

    return build_node(cell)


# =============================================================================
# Design preparation
# =============================================================================


def _prepare_design(cell: Cell):
    """Serialize cell hierarchy and build explorer tree.

    Returns:
        Tuple of (json_str, cell_tree) where:
        - json_str: Hierarchical library JSON (micrometers, full structure)
        - cell_tree: Hierarchy tree dict for the explorer panel
    """
    from rosette._api import _collect_all_cells
    from rosette._core import to_json

    child_cells: set[Cell] = set()
    _collect_all_cells(cell, child_cells)
    child_cells_list = list(child_cells)

    # Serialize to hierarchical JSON (preserves cells, refs, paths, text)
    if child_cells_list:
        inner_cells = [c._inner for c in child_cells_list]
        json_str = to_json(cell._inner, inner_cells)
    else:
        json_str = to_json(cell._inner, None)

    # Build hierarchy tree for the explorer panel
    cell_tree = _build_cell_tree(cell, child_cells_list)

    return json_str, cell_tree


def _prepare_design_from_library(library: Library | _CoreLibrary):
    """Serialize a Library (e.g. from read_gds) for the viewer.

    The Library already contains the full cell hierarchy, so we serialize
    it directly rather than collecting child cells from Python wrappers.

    Returns:
        Tuple of (json_str, cell_tree)
    """
    from rosette import Library as LibWrapper
    from rosette._core import to_json

    # Wrap into Python types
    if not isinstance(library, LibWrapper):
        library = LibWrapper._from_inner(library)

    all_cells = library.cells()
    if not all_cells:
        raise ValueError("GDS file contains no cells")

    # The browser derives the complete hierarchy forest from the serialized
    # library. This single tree is retained only as a fallback for old clients.
    top = library.top_cell()
    if top is None:
        roots = library.roots()
        top = roots[0] if roots else all_cells[0]
    child_cells_list = [c for c in all_cells if c.name != top.name]

    # Serialize the full hierarchical library
    json_str = to_json(library._inner)

    # Build hierarchy tree
    cell_tree = _build_cell_tree(top, child_cells_list)

    return json_str, cell_tree


# =============================================================================
# Project component catalog
# =============================================================================


def _component_parameter_spec(
    parameter: inspect.Parameter, annotation: object
) -> dict[str, object]:
    """Convert one supported factory parameter into JSON-safe metadata."""
    from rosette import Layer

    nullable = False
    origin = typing.get_origin(annotation)
    arguments = list(typing.get_args(annotation))
    if origin is types.UnionType or str(origin) == "typing.Union":
        nullable = type(None) in arguments
        arguments = [argument for argument in arguments if argument is not type(None)]
        if len(arguments) != 1:
            raise TypeError("union parameters must contain one supported type and None")
        annotation = arguments[0]
        origin = typing.get_origin(annotation)

    choices: list[object] | None = None
    if origin is typing.Literal:
        choices = list(typing.get_args(annotation))
        if not choices:
            raise TypeError("literal parameters must define at least one choice")
        choice_types = {type(choice) for choice in choices}
        if choice_types == {bool}:
            kind = "boolean"
        elif choice_types <= {int}:
            kind = "integer"
        elif choice_types <= {int, float} and bool not in choice_types:
            kind = "number"
        elif choice_types == {str}:
            kind = "string"
        else:
            raise TypeError("literal choices must share a scalar type")
    elif annotation is Layer:
        kind = "layer"
    elif annotation is bool:
        kind = "boolean"
    elif annotation is int:
        kind = "integer"
    elif annotation is float:
        kind = "number"
    elif annotation is str:
        kind = "string"
    elif parameter.default is not inspect.Parameter.empty and parameter.default is not None:
        default_type = type(parameter.default)
        if default_type is bool:
            kind = "boolean"
        elif default_type is int:
            kind = "integer"
        elif default_type is float:
            kind = "number"
        elif default_type is str:
            kind = "string"
        elif default_type is Layer:
            kind = "layer"
        else:
            raise TypeError("parameter default must be a supported scalar or Layer")
    else:
        raise TypeError("parameter must have a supported type annotation")

    required = parameter.default is inspect.Parameter.empty
    spec: dict[str, object] = {
        "name": parameter.name,
        "type": kind,
        "required": required,
        "nullable": nullable,
    }
    if not required:
        default = parameter.default
        if isinstance(default, Layer):
            default = {"layerNumber": default.number, "datatype": default.datatype}
        try:
            json.dumps(default, allow_nan=False)
        except (TypeError, ValueError) as error:
            raise TypeError("parameter default must be finite and JSON-safe") from error
        spec["default"] = default
    if choices is not None:
        try:
            json.dumps(choices, allow_nan=False)
        except (TypeError, ValueError) as error:
            raise TypeError("literal choices must be finite and JSON-safe") from error
        spec["choices"] = choices
    return spec


def _component_parameter_value(spec: dict[str, object], value: object) -> object:
    """Validate and convert a JSON component parameter value."""
    from rosette import Layer

    name = str(spec["name"])
    if value is None:
        if spec["nullable"]:
            return None
        raise ValueError(f"{name} cannot be null")

    kind = spec["type"]
    if kind == "boolean":
        if type(value) is not bool:
            raise ValueError(f"{name} must be a boolean")
        converted = value
    elif kind == "integer":
        if type(value) is not int:
            raise ValueError(f"{name} must be an integer")
        converted = value
    elif kind == "number":
        if (
            isinstance(value, bool)
            or not isinstance(value, (int, float))
            or not math.isfinite(value)
        ):
            raise ValueError(f"{name} must be a finite number")
        converted = float(value)
    elif kind == "string":
        if not isinstance(value, str):
            raise ValueError(f"{name} must be a string")
        converted = value
    elif kind == "layer":
        if not isinstance(value, dict) or set(value) != {"layerNumber", "datatype"}:
            raise ValueError(f"{name} must be a layer")
        number = value["layerNumber"]
        datatype = value["datatype"]
        if type(number) is not int or not 0 <= number <= 999:
            raise ValueError(f"{name}.layerNumber must be an integer 0-999")
        if type(datatype) is not int or not 0 <= datatype <= 999:
            raise ValueError(f"{name}.datatype must be an integer 0-999")
        converted = Layer(number, datatype)
    else:  # pragma: no cover - specs are built internally
        raise ValueError(f"Unsupported parameter type for {name}")

    choices = spec.get("choices")
    if choices is not None and not isinstance(choices, list):  # pragma: no cover
        raise ValueError(f"Invalid choices for {name}")
    if isinstance(choices, list) and converted not in choices:
        allowed = ", ".join(repr(choice) for choice in choices)
        raise ValueError(f"{name} must be one of {allowed}")
    return converted


class _ProjectComponentCatalog:
    """Discover and materialize project-owned component factories."""

    def __init__(self, project_dir: Path, config_path: Path | None) -> None:
        self._project_dir = project_dir.resolve()
        self._components_dir = (self._project_dir / "components").resolve()
        self._config_path = config_path.resolve() if config_path is not None else None
        self._lock = threading.Lock()
        self._factories: dict[str, Callable[..., object]] = {}
        self._parameters: dict[str, list[dict[str, object]]] = {}
        self._version = 0
        self._error: str | None = None
        self.reload()

    @property
    def components_dir(self) -> Path:
        return self._components_dir

    def _discover(
        self,
    ) -> tuple[
        dict[str, Callable[..., object]],
        dict[str, list[dict[str, object]]],
        list[str],
    ]:
        if (
            not self._components_dir.is_dir()
            or not (self._components_dir / "__init__.py").is_file()
        ):
            return {}, {}, []
        if not self._components_dir.is_relative_to(self._project_dir):
            raise ValueError("components package must be inside the project")

        old_modules = {
            name: module
            for name, module in sys.modules.items()
            if name == "components" or name.startswith("components.")
        }
        for name in old_modules:
            del sys.modules[name]

        def restore_modules() -> None:
            for module_name in list(sys.modules):
                if module_name == "components" or module_name.startswith("components."):
                    del sys.modules[module_name]
            sys.modules.update(old_modules)

        for bytecode_dir in self._components_dir.rglob("__pycache__"):
            shutil.rmtree(bytecode_dir, ignore_errors=True)

        project_path = str(self._project_dir)
        if project_path in sys.path:
            sys.path.remove(project_path)
        sys.path.insert(0, project_path)
        importlib.invalidate_caches()
        try:
            package = importlib.import_module("components")
        except Exception:
            restore_modules()
            raise

        try:
            package_file = getattr(package, "__file__", None)
            if package_file is None or not Path(package_file).resolve().is_relative_to(
                self._components_dir
            ):
                raise ImportError("components resolved outside the project")
            exports = getattr(package, "__all__", [])
            if not isinstance(exports, list) or not all(isinstance(name, str) for name in exports):
                raise ValueError("components.__all__ must be a list of strings")
        except Exception:
            restore_modules()
            raise

        factories: dict[str, Callable[..., object]] = {}
        parameters: dict[str, list[dict[str, object]]] = {}
        warnings: list[str] = []
        try:
            for name in exports:
                if name.startswith("_"):
                    continue
                candidate = getattr(package, name, None)
                if not inspect.isfunction(candidate):
                    continue
                source_file = inspect.getsourcefile(candidate)
                if source_file is None or not Path(source_file).resolve().is_relative_to(
                    self._components_dir
                ):
                    continue
                signature = inspect.signature(candidate)
                factory_parameters = list(signature.parameters.values())
                if not factory_parameters or factory_parameters[0].name != "layer":
                    continue
                try:
                    if factory_parameters[0].kind not in (
                        inspect.Parameter.POSITIONAL_ONLY,
                        inspect.Parameter.POSITIONAL_OR_KEYWORD,
                    ):
                        raise TypeError("layer must accept a positional argument")
                    hints = typing.get_type_hints(candidate, include_extras=True)
                    specs = []
                    for parameter in factory_parameters[1:]:
                        if parameter.kind not in (
                            inspect.Parameter.POSITIONAL_OR_KEYWORD,
                            inspect.Parameter.KEYWORD_ONLY,
                        ):
                            raise TypeError(
                                f"parameter {parameter.name!r} must accept a keyword argument"
                            )
                        annotation = hints.get(parameter.name, parameter.annotation)
                        specs.append(_component_parameter_spec(parameter, annotation))
                except (NameError, TypeError, ValueError) as error:
                    warnings.append(f"Skipped {name}: {error}")
                    continue
                factories[name] = candidate
                parameters[name] = specs
        except Exception:
            restore_modules()
            raise
        return factories, parameters, warnings

    def reload(self) -> bool:
        """Reload project components atomically, retaining the last-good set on error."""
        with self._lock:
            try:
                factories, parameters, warnings = self._discover()
            except Exception as error:
                self._error = f"{type(error).__name__}: {error}"
                return False
            self._factories = factories
            self._parameters = parameters
            self._version += 1
            self._error = "; ".join(warnings) or None
        return True

    def snapshot(self) -> dict[str, object]:
        """Return immutable JSON-safe catalog state."""
        with self._lock:
            components = [
                {"name": name, "parameters": copy.deepcopy(self._parameters[name])}
                for name in sorted(self._factories)
            ]
            return {
                "version": self._version,
                "components": components,
                "error": self._error,
            }

    def materialize(self, request: dict[str, object]) -> dict[str, object]:
        """Run one catalog factory and return a self-contained layout document."""
        from rosette import Cell, Layer
        from rosette._design import design_config_context

        if set(request) != {"name", "layer", "parameters"}:
            raise ValueError("Request must contain name, layer, and parameters")
        name = request["name"]
        if not isinstance(name, str) or not name or name.startswith("_"):
            raise ValueError("name must be a public component name")
        layer_value = request["layer"]
        layer_spec: dict[str, object] = {
            "name": "layer",
            "type": "layer",
            "nullable": False,
        }
        layer = _component_parameter_value(layer_spec, layer_value)
        if not isinstance(layer, Layer):  # pragma: no cover - guaranteed by the spec
            raise ValueError("layer must be a layer")
        supplied = request["parameters"]
        if not isinstance(supplied, dict) or not all(isinstance(key, str) for key in supplied):
            raise ValueError("parameters must be an object")

        with self._lock:
            factory = self._factories.get(name)
            specs = copy.deepcopy(self._parameters.get(name, []))
            if factory is None:
                raise KeyError(f"Unknown component {name!r}")

            spec_by_name = {str(spec["name"]): spec for spec in specs}
            extras = sorted(set(supplied) - spec_by_name.keys())
            if extras:
                raise ValueError(f"Unknown parameter: {extras[0]}")
            arguments: dict[str, object] = {}
            for parameter_name, spec in spec_by_name.items():
                if parameter_name in supplied:
                    arguments[parameter_name] = _component_parameter_value(
                        spec, supplied[parameter_name]
                    )
                elif spec["required"]:
                    raise ValueError(f"Missing required parameter: {parameter_name}")

            try:
                with design_config_context(self._project_dir, self._config_path):
                    cell = factory(layer, **arguments)
            except Exception as error:
                raise ValueError(f"{name}: {error}") from error
        if not isinstance(cell, Cell):
            raise ValueError(f"{name} must return a Cell")

        from rosette import Library
        from rosette._api import _collect_all_cells
        from rosette._core import to_json

        child_cells: set[Cell] = set()
        _collect_all_cells(cell, child_cells)
        library = Library(cell.name)
        try:
            library.add_cell_recursive(cell, list(child_cells), on_duplicate="error")
            library.set_top_cell(cell.name)
        except ValueError as error:
            raise ValueError(f"{name} returned an invalid hierarchy: {error}") from error
        layout_json = to_json(library._inner)
        payload = json.loads(layout_json)
        cells = payload.get("library", {}).get("cells", [])
        cell_names = sorted(
            item["name"]
            for item in cells
            if isinstance(item, dict) and isinstance(item.get("name"), str)
        )
        return {
            "layoutJson": layout_json,
            "topCell": cell.name,
            "cellNames": cell_names,
        }


# =============================================================================
# Server and layer map helpers
# =============================================================================


def _validate_webapp_bundle(webapp_dir: Path) -> None:
    """Reject a bundled viewer that cannot read the current layout JSON."""
    manifest_path = webapp_dir / "viewer-manifest.json"
    rebuild = "Run 'uv run python scripts/bundle_webapp.py' to rebuild it."
    if not manifest_path.is_file():
        raise RuntimeError(f"Web app bundle is stale or incomplete. {rebuild}")

    try:
        manifest = json.loads(manifest_path.read_text())
    except (OSError, json.JSONDecodeError) as error:
        raise RuntimeError(f"Web app bundle manifest is unreadable. {rebuild}") from error

    if not isinstance(manifest, dict):
        raise RuntimeError(f"Web app bundle manifest is invalid. {rebuild}")
    if (
        manifest.get("layoutFormat") != _LAYOUT_FORMAT
        or manifest.get("layoutSchema") != _LAYOUT_SCHEMA
    ):
        raise RuntimeError(f"Web app bundle does not support the current layout format. {rebuild}")


def _start_server(port: int):
    """Start the web viewer server. Returns (server, url)."""
    from rosette._server import RosetteServer

    webapp_dir = Path(__file__).parent / "_webapp"
    if not webapp_dir.exists():
        print("Error: Web app not bundled. Run 'scripts/bundle_webapp.py' first.")
        print(f"Expected at: {webapp_dir}")
        sys.exit(1)
    try:
        _validate_webapp_bundle(webapp_dir)
    except RuntimeError as error:
        print(f"Error: {error}")
        sys.exit(1)

    server = RosetteServer(webapp_dir, port)
    try:
        _, actual_port = server.start_background()
    except OSError as e:
        print(f"Error: {e}")
        sys.exit(1)

    if actual_port != port:
        print(f"Port {port} in use, using {actual_port}")

    return server, f"http://localhost:{actual_port}"


def _layer_map_to_viewer_layers(layer_map: LayerMap) -> list[dict[str, object]]:
    return [
        {
            "id": i,
            "layerNumber": info.layer.number,
            "datatype": info.layer.datatype,
            "name": info.name,
            "color": info.color,
            "visible": True,
            "fillPattern": info.fill,
            "opacity": info.opacity,
        }
        for i, info in enumerate(layer_map, start=1)
    ]


def _load_layer_map_safe(config_path: str | Path | None = None) -> list[dict[str, object]] | None:
    """Try to load layer map from rosette.toml, fall back to defaults."""
    try:
        from rosette.project import load_layer_map

        layer_map = load_layer_map(config_path)
        if len(layer_map) > 0:
            return _layer_map_to_viewer_layers(layer_map)
    except (FileNotFoundError, ValueError):
        pass
    # Fall back to built-in defaults so the app always has layers
    from rosette._api import _default_layer_map

    return _layer_map_to_viewer_layers(_default_layer_map())


def _load_drc_rules_safe(config_path: str | Path | None = None):
    """Try to load DRC rules from rosette.toml.

    Returns the ``DrcRules`` if the ``[drc]`` section is present and valid,
    otherwise ``None``. A missing or invalid DRC config must never break the
    live preview, so all expected config errors are swallowed.
    """
    try:
        from rosette.drc import load_drc_rules

        return load_drc_rules(config_path)
    except (FileNotFoundError, ValueError):
        return None


def _run_drc_safe(
    cell: Cell, rules: DrcRules | None, cache: DrcCache | None = None
) -> dict[str, object] | None:
    """Run DRC and serialize the result to a JSON-friendly dict for the viewer.

    Returns ``None`` when no rules are configured or the DRC engine raises, so
    a DRC failure degrades gracefully to "no violations shown" rather than
    killing the reload.

    When an internal DRC cache is supplied, DRC re-runs are
    incremental: a change to one cell only re-checks that cell and its
    dependents, rather than the full design every reload (ROS-548). Results
    are identical to a cache-free run.

    The ``bbox`` is in top-level flattened global coordinates (the same frame
    the viewer renders), so no transform is needed downstream.
    """
    if rules is None:
        return None
    try:
        from rosette._api import run_drc

        result = run_drc(cell, rules, cache=cache)
    except Exception as e:  # never let DRC break live preview
        print(f"drc error: {e}")
        return None

    violations = []
    for v in result.violations:
        (min_x, min_y), (max_x, max_y) = v.bbox
        violations.append(
            {
                "severity": v.severity,
                "rule": v.rule_name or v.rule_type,
                "message": v.message,
                "layer": list(v.layer),
                "layer2": list(v.layer2) if v.layer2 is not None else None,
                "cell_name": v.cell_name,
                "cell_name2": v.cell_name2,
                "bbox": [[min_x, min_y], [max_x, max_y]],
            }
        )

    return {
        "violations": violations,
        "error_count": result.error_count,
        "warning_count": result.warning_count,
        "suppressed": result.suppressed_violations,
        "waived": result.waived_violations,
        "passed": result.passed,
    }


# =============================================================================
# Tauri / browser viewer management
# =============================================================================


def _find_installed_app() -> Path | None:
    """Find an installed Rosette.app bundle on macOS.

    Checks common installation locations. Using the .app bundle ensures
    macOS shows the correct app icon and identity in the Dock, rather
    than a generic executable icon.
    """
    if sys.platform != "darwin":
        return None

    candidates = [
        Path("/Applications/Rosette.app"),
        Path.home() / "Applications" / "Rosette.app",
    ]

    for app in candidates:
        if app.exists() and app.is_dir():
            return app

    return None


def _find_tauri_binary() -> Path | None:
    """Find a pre-built Tauri binary, or None if not available.

    Checks the workspace-level target/ directory (Cargo workspaces
    build into the root target/, not each crate's own target/).
    Prefers release over debug.
    """
    workspace_root = Path(__file__).parent.parent.parent
    target_dir = workspace_root / "target"
    if not target_dir.exists():
        return None

    binary_name = "rosette-desktop"
    if sys.platform == "win32":
        binary_name += ".exe"

    for profile in ("release", "debug"):
        binary = target_dir / profile / binary_name
        if binary.exists() and binary.is_file():
            return binary

    return None


def _find_tauri_source() -> Path | None:
    """Find the Tauri source directory (app/src-tauri/), or None."""
    tauri_dir = Path(__file__).parent.parent.parent / "app" / "src-tauri"
    if tauri_dir.exists() and (tauri_dir / "Cargo.toml").exists():
        return tauri_dir
    return None


def _pgrep(name: str) -> set[int]:
    """Return the set of PIDs whose process name matches *name*."""
    try:
        out = subprocess.check_output(["pgrep", "-x", name], stderr=subprocess.DEVNULL, text=True)
        return {int(pid) for pid in out.split() if pid.strip()}
    except (subprocess.CalledProcessError, OSError):
        return set()


class _PidHandle:
    """Minimal Popen-like wrapper around an OS pid for ``_cleanup_tauri``.

    When we launch via ``open -a`` we don't get a ``subprocess.Popen``
    object for the actual app — only for the short-lived ``open`` helper.
    This wrapper exposes ``poll()`` / ``terminate()`` / ``kill()`` backed
    by ``os.kill`` so ``_cleanup_tauri`` works unchanged.
    """

    def __init__(self, pid: int | None):
        self._pid = pid

    def poll(self) -> int | None:
        """Return None if the process is still running, else an int."""
        if self._pid is None:
            return 0
        try:
            os.kill(self._pid, 0)  # signal 0 — existence check
            return None  # still alive
        except ProcessLookupError:
            return 0  # already exited
        except PermissionError:
            return None  # alive but owned by another user (shouldn't happen)

    def terminate(self):
        if self._pid is None:
            return
        try:
            os.kill(self._pid, signal.SIGTERM)
        except (ProcessLookupError, PermissionError):
            pass

    def kill(self):
        if self._pid is None:
            return
        try:
            os.kill(self._pid, signal.SIGKILL)
        except (ProcessLookupError, PermissionError):
            pass

    def wait(self, timeout: float = 0):
        """Best-effort wait — poll until the process exits or timeout."""
        if self._pid is None:
            return
        import time

        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            if self.poll() is not None:
                return
            time.sleep(0.1)
        raise subprocess.TimeoutExpired(cmd="rosette-desktop", timeout=timeout)


def _launch_tauri(
    url: str, allow_build: bool = False, design_mode: bool = True
) -> subprocess.Popen[bytes] | _PidHandle | None:
    """Launch the Tauri desktop app pointing at the given URL.

    On macOS, prefers the installed Rosette.app bundle (via ``open -a``)
    so the Dock shows the correct icon and app identity. Falls back to
    a raw binary from target/, then to ``cargo run`` when *allow_build*
    is True (explicit ``--native`` flag), since building from source
    takes minutes.

    Returns the subprocess handle, or None on failure.
    """
    target_url = f"{url}?design=true" if design_mode and "?" not in url else url

    # On macOS, prefer the installed .app bundle so the Dock shows the
    # correct icon and app identity instead of a generic "exec" icon.
    # Use ``open -a`` so macOS properly associates the process with the
    # .app bundle (correct Dock icon, app name, and focus behavior).
    installed_app = _find_installed_app()
    if installed_app:
        # The inner binary name comes from the Cargo package name
        # (rosette-desktop), not the Tauri productName (Rosette).
        inner_binary = installed_app / "Contents" / "MacOS" / "rosette-desktop"
        if inner_binary.exists() and inner_binary.is_file():
            try:
                # Start a fresh instance so macOS passes this serve session's
                # --url argument instead of reusing an app on its bundled UI.
                # Then find the actual app PID for cleanup.
                pids_before = _pgrep("rosette-desktop")

                subprocess.run(
                    [
                        "open",
                        "-n",
                        "-a",
                        str(installed_app),
                        "--args",
                        "--url",
                        target_url,
                    ],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    check=True,
                )

                # ``open`` returns once the launch is initiated, but the
                # rosette-desktop process may not be visible to pgrep yet.
                # Retry briefly to give it time to start.
                import time

                for _ in range(10):  # up to ~1s
                    time.sleep(0.1)
                    pids_after = _pgrep("rosette-desktop")
                    new_pids = pids_after - pids_before
                    if new_pids:
                        return _PidHandle(new_pids.pop())

                # App launched but couldn't identify new PID (may have reused
                # an existing instance). Return a no-op handle.
                return _PidHandle(None)
            except (OSError, subprocess.CalledProcessError):
                pass  # Failed to launch via open, try raw binary

    # Try pre-built binary (instant startup)
    binary = _find_tauri_binary()
    if binary:
        try:
            proc = subprocess.Popen(
                [str(binary), "--url", target_url],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            return proc
        except OSError:
            pass  # Binary exists but failed to run, try cargo

    if not allow_build:
        return None

    # Fall back to cargo run (only with explicit --native)
    tauri_dir = _find_tauri_source()
    if tauri_dir is None:
        return None

    if not shutil.which("cargo"):
        print("Error: cargo not found, cannot build native app")
        return None

    print("Building native app (first run may take a few minutes)...")
    try:
        proc = subprocess.Popen(
            [
                "cargo",
                "run",
                "--release",
                "-p",
                "rosette-desktop",
                "--",
                "--url",
                target_url,
            ],
            cwd=str(tauri_dir.parent.parent),  # workspace root
        )
        return proc
    except OSError:
        return None


def _open_viewer(
    url: str,
    *,
    use_native: bool,
    allow_build: bool,
    native_explicit: bool,
    design_mode: bool = True,
    label: str = "",
) -> subprocess.Popen[bytes] | _PidHandle | None:
    """Open the viewer in a native Tauri window or browser.

    Returns the Tauri process handle, or None if browser was used.
    """
    browser_url = f"{url}?design=true" if design_mode else url
    status = f"{url}  |  {label}  |  " if label else f"{url}  |  "

    if use_native:
        proc = _launch_tauri(url, allow_build=allow_build, design_mode=design_mode)
        if proc:
            print(f"{status}native  |  Ctrl+C to stop")
            return proc
        # Native requested but failed — fall back to browser
        if native_explicit:
            print("Warning: Could not launch native window, falling back to browser")

    webbrowser.open(browser_url)
    print(f"{status}Ctrl+C to stop")
    return None


def _cleanup_tauri(proc: subprocess.Popen[bytes] | _PidHandle | None):
    """Terminate a Tauri process if still running."""
    if proc and proc.poll() is None:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            proc.kill()


# =============================================================================
# Main serve/run commands
# =============================================================================


def serve_design(
    design: str | None, port: int = 5173, no_open: bool = False, *, native: bool | None = None
):
    """Start development server with live preview for Python designs.

    Args:
        design: Path to design file (.py, optional). If None, opens empty canvas.
        port: Server port (default: 5173)
        no_open: Don't open browser automatically
        native: True to force native window, False to force browser,
                None to auto-detect (use native if Tauri binary/source available)
    """
    import logging

    from rosette._design import design_config_context, find_design_config, load_design

    logging.basicConfig(
        level=logging.WARNING,
        format="%(asctime)s %(name)s %(levelname)s: %(message)s",
        datefmt="%H:%M:%S",
    )

    server, url = _start_server(port)

    # Resolve native mode: auto-detect if not explicitly set.
    # Auto-detect only uses the installed .app bundle (correct Dock identity).
    # Raw dev binaries and cargo build only happen with explicit --native.
    use_native = bool(native) if native is not None else _find_installed_app() is not None
    allow_build = native is True  # only build from source if explicitly requested

    tauri_proc = None

    if design:
        # One DRC cache held for the whole serve session so re-runs on each
        # reload are incremental: a change to one cell only re-checks that
        # cell and its dependents (ROS-548). The cache invalidates itself when
        # the [drc] rule set changes.
        from rosette._core import DrcCache

        drc_cache = DrcCache()

        cell, file_path, _ = load_design(design)
        config_path = find_design_config(file_path)
        json_str, cell_tree = _prepare_design(cell)
        with design_config_context(file_path):
            layer_defs = _load_layer_map_safe(config_path)
            drc_rules = _load_drc_rules_safe(config_path)
        drc = _run_drc_safe(cell, drc_rules, drc_cache)

        server.set_design_json(
            json_str,
            cells=cell_tree,
            layers=layer_defs,
            filename=Path(design).name,
            drc=drc,
        )

        if not no_open:
            tauri_proc = _open_viewer(
                url,
                use_native=use_native,
                allow_build=allow_build,
                native_explicit=native is True,
                label=str(file_path),
            )
        else:
            print(f"{url}  |  {file_path}  |  Ctrl+C to stop")

        # Watch for file changes
        try:
            from watchfiles import watch

            watch_paths = [file_path]
            project_dir = (
                config_path.parent if config_path is not None else file_path.parent.resolve()
            )
            component_dirs = {
                project_dir / "components",
                file_path.parent.resolve() / "components",
            }
            watch_paths.extend(path for path in component_dirs if path.exists())

            # Also watch rosette.toml for layer changes
            if config_path is not None:
                watch_paths.append(config_path)

            for _changes in watch(*watch_paths):
                try:
                    # Clear module cache for all project files
                    project_dir_str = str(project_dir)
                    stale = [
                        name
                        for name, mod in list(sys.modules.items())
                        if hasattr(mod, "__file__")
                        and mod.__file__
                        and mod.__file__.startswith(project_dir_str)
                    ]
                    for name in stale:
                        del sys.modules[name]

                    cell, _, _ = load_design(design)
                    json_str, cell_tree = _prepare_design(cell)
                    with design_config_context(file_path):
                        layer_defs = _load_layer_map_safe(config_path)
                        # Reload DRC rules each iteration so edits to the [drc]
                        # section in rosette.toml take effect live.
                        drc_rules = _load_drc_rules_safe(config_path)
                    drc = _run_drc_safe(cell, drc_rules, drc_cache)

                    server.set_design_json(
                        json_str,
                        cells=cell_tree,
                        layers=layer_defs,
                        filename=Path(design).name,
                        drc=drc,
                    )
                except Exception as e:
                    print(f"error: {e}")

        except ImportError:
            _wait_forever()
        except KeyboardInterrupt:
            pass

    else:
        # No design file: still surface the project's configured layers so the
        # empty canvas reflects rosette.toml rather than the app's built-in
        # defaults. Falls back to defaults when there's no (or no [layers])
        # rosette.toml.
        config_path = find_design_config(Path.cwd())
        project_dir = config_path.parent if config_path is not None else Path.cwd().resolve()
        catalog = _ProjectComponentCatalog(project_dir, config_path)
        server.set_component_provider(catalog.snapshot, catalog.materialize)
        layer_defs = _load_layer_map_safe(config_path)
        server.set_design_json(None, layers=layer_defs)

        if not no_open:
            tauri_proc = _open_viewer(
                url,
                use_native=use_native,
                allow_build=allow_build,
                native_explicit=native is True,
                design_mode=False,
            )
        else:
            print(f"{url}  |  Ctrl+C to stop")

        if catalog.components_dir.is_dir():
            try:
                from watchfiles import watch

                for changes in watch(catalog.components_dir):
                    if not any(Path(path).suffix == ".py" for _, path in changes):
                        continue
                    if not catalog.reload():
                        error = catalog.snapshot()["error"]
                        print(f"error: component catalog reload failed: {error}")
            except ImportError:
                _wait_forever()
            except KeyboardInterrupt:
                pass
        else:
            _wait_forever()

    _cleanup_tauri(tauri_proc)

    print()


def run_gds(file: str, port: int = 5173, no_open: bool = False, *, native: bool | None = None):
    """View a GDS file in the browser or native window.

    Args:
        file: Path to GDS file
        port: Server port (default: 5173)
        no_open: Don't open browser automatically
        native: True to force native window, False to force browser,
                None to auto-detect (use native if Tauri binary/source available)
    """
    from rosette._core import read_gds

    file_path = Path(file)
    if not file_path.exists():
        print(f"Error: GDS file not found: {file_path}")
        sys.exit(1)

    if file_path.suffix.lower() not in (".gds", ".gdsii"):
        print(f"Error: Expected a .gds file, got {file_path.suffix}")
        sys.exit(1)

    server, url = _start_server(port)

    # Resolve native mode: auto-detect only uses the installed .app bundle.
    # Raw dev binaries and cargo build only happen with explicit --native.
    use_native = bool(native) if native is not None else _find_installed_app() is not None
    allow_build = native is True

    tauri_proc = None

    inner_lib = read_gds(str(file_path))
    json_str, cell_tree = _prepare_design_from_library(inner_lib)
    layer_defs = _load_layer_map_safe()

    server.set_design_json(json_str, cells=cell_tree, layers=layer_defs, filename=file_path.name)

    if not no_open:
        tauri_proc = _open_viewer(
            url,
            use_native=use_native,
            allow_build=allow_build,
            native_explicit=native is True,
            label=str(file_path),
        )
    else:
        print(f"{url}  |  {file_path}  |  Ctrl+C to stop")

    # Watch for changes to the GDS file
    try:
        from watchfiles import watch

        for _changes in watch(file_path):
            try:
                inner_lib = read_gds(str(file_path))
                json_str, cell_tree = _prepare_design_from_library(inner_lib)
                layer_defs = _load_layer_map_safe()
                server.set_design_json(
                    json_str,
                    cells=cell_tree,
                    layers=layer_defs,
                    filename=file_path.name,
                )
            except Exception as e:
                print(f"error: {e}")

    except ImportError:
        _wait_forever()
    except KeyboardInterrupt:
        pass

    _cleanup_tauri(tauri_proc)

    print()


def _wait_forever():
    """Block until Ctrl+C."""
    import time

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        pass
