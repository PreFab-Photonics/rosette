"""Live viewer for rosette serve and run commands.

Handles design serialization, server startup, file watching, and
Tauri/browser viewer management.
"""

from __future__ import annotations

import shutil
import subprocess
import sys
import webbrowser
from pathlib import Path

# =============================================================================
# Design serialization helpers
# =============================================================================


def _source_to_dict(src) -> dict:
    """Convert a SourceLocation to a JSON-serialisable dict."""
    return {
        "file": src.file,
        "line": src.line,
        "fn": src.function,
        "code": src.code,
        "type": src.element_type,
    }


def _build_source_map(cell) -> list[dict | None] | None:
    """Build a source map indexed by element position.

    Each entry corresponds to the element at the same index in the cell's
    elements list.  The WASM viewer correlates entries by element index
    (extracted from the UUID), so the order here must match the order
    elements were added to the cell.

    Returns None if source tracking was not active during design execution.
    """
    sources = getattr(cell, "_element_sources", None)
    if not sources:
        return None

    source_map: list[dict | None] = [
        _source_to_dict(src) if src is not None else None for src in sources
    ]

    return source_map if any(s is not None for s in source_map) else None


def _build_child_source_maps(cell) -> dict[str, list[dict | None]] | None:
    """Build source maps for child cells (for editing shapes inside components).

    The WASM renderer assigns ref sub-polygon UUIDs as ``ref:N:M`` where N is
    the CellRef element index and M is a flat polygon counter that increments
    for each polygon/path encountered while recursively traversing the child
    cell.  Text elements do not produce render polygons, so they are skipped
    here to keep the counter aligned.

    Returns ``{cell_name: [source_or_null, ...]}`` where the list is indexed
    by the WASM poly_counter (i.e. render polygon order within that cell).
    Returns None if no child cells have source tracking.
    """
    child_cells = list(cell.get_child_cells()) if hasattr(cell, "get_child_cells") else []
    if not child_cells:
        return None

    result: dict[str, list[dict | None]] = {}
    for child in child_cells:
        sources = getattr(child, "_element_sources", None)
        if not sources:
            continue

        # Build list matching WASM poly_counter order: skip text elements
        # since they don't produce render polygons.
        render_sources: list[dict | None] = []
        for src in sources:
            if src is not None and src.element_type == "text":
                continue
            render_sources.append(_source_to_dict(src) if src is not None else None)

        if any(s is not None for s in render_sources):
            result[child.name] = render_sources

    return result if result else None


def _build_cell_vars(cell, child_cells_list):
    """Build cell variable metadata: {cell_name: {var_name, file, line}}.

    Extracts the Python variable name from the Cell definition source line
    (e.g. ``triangle_cell = Cell("triangle")`` → var_name = "triangle_cell").
    This metadata enables the web viewer to target the correct cell variable
    when adding elements to child cells.
    """
    result = {}
    all_cells = [cell] + (child_cells_list or [])
    for c in all_cells:
        def_source = getattr(c, "_def_source", None)
        if def_source is None:
            continue
        code = def_source.code
        eq_idx = code.find("=")
        if eq_idx > 0:
            var_name = code[:eq_idx].strip()
        else:
            var_name = c.name
        result[c.name] = {
            "var_name": var_name,
            "file": def_source.file,
            "line": def_source.line,
        }
    return result if result else None


def _build_cell_tree(cell, child_cells_list):
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
    def build_node(c, visited=None):
        if visited is None:
            visited = set()
        if c.name in visited:
            return {"name": c.name, "children": []}
        visited = visited | {c.name}

        # Get direct child cell names from Rust CellRef elements
        direct_refs = c._inner.cell_ref_names()
        children = []
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


def _prepare_design(cell):
    """Serialize cell hierarchy and build explorer tree.

    Returns:
        Tuple of (json_str, cell_tree, source_map, child_source_maps, cell_vars) where:
        - json_str: Hierarchical library JSON (micrometers, full structure)
        - cell_tree: Hierarchy tree dict for the explorer panel
        - source_map: Source info list indexed by element position (or None)
        - child_source_maps: Source maps for child cells (or None)
        - cell_vars: Cell variable metadata (or None)
    """
    from rosette._core import to_json

    # Collect child cells
    child_cells_list = list(cell.get_child_cells()) if hasattr(cell, "get_child_cells") else None

    # Serialize to hierarchical JSON (preserves cells, refs, paths, text)
    if child_cells_list:
        inner_cells = [c._inner for c in child_cells_list]
        json_str = to_json(cell._inner, inner_cells)
    else:
        json_str = to_json(cell._inner, None)

    # Build hierarchy tree for the explorer panel
    cell_tree = _build_cell_tree(cell, child_cells_list)

    # Build source maps for two-way editing
    source_map = _build_source_map(cell)
    child_source_maps = _build_child_source_maps(cell)
    cell_vars = _build_cell_vars(cell, child_cells_list)

    return json_str, cell_tree, source_map, child_source_maps, cell_vars


def _prepare_design_from_library(library):
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

    top = library.top_cell()
    if top is None:
        raise ValueError("GDS file contains no cells")

    all_cells = library.cells()
    child_cells_list = [c for c in all_cells if c.name != top.name]

    # Serialize the full hierarchical library
    json_str = to_json(library._inner)

    # Build hierarchy tree
    cell_tree = _build_cell_tree(top, child_cells_list)

    return json_str, cell_tree


# =============================================================================
# Server and layer map helpers
# =============================================================================


def _start_server(port: int):
    """Start the web viewer server. Returns (server, url)."""
    from rosette._server import RosetteServer

    webapp_dir = Path(__file__).parent / "_webapp"
    if not webapp_dir.exists():
        print("Error: Web app not bundled. Run 'scripts/bundle_webapp.py' first.")
        print(f"Expected at: {webapp_dir}")
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


def _load_layer_map_safe() -> list[dict] | None:
    """Try to load layer map from rosette.toml, fall back to defaults."""
    try:
        from rosette import load_layer_map

        layer_map = load_layer_map()
        if len(layer_map) > 0:
            return layer_map.to_dict_list()
    except (FileNotFoundError, ValueError):
        pass
    # Fall back to built-in defaults so the app always has layers
    from rosette import _default_layer_map

    return _default_layer_map().to_dict_list()


# =============================================================================
# Tauri / browser viewer management
# =============================================================================


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


def _launch_tauri(url: str, allow_build: bool = False) -> subprocess.Popen | None:
    """Launch the Tauri desktop app pointing at the given URL.

    Tries a pre-built binary first. Only falls back to `cargo run`
    when allow_build is True (explicit --native flag), since building
    from source takes minutes.

    Returns the subprocess handle, or None on failure.
    """
    design_url = f"{url}?design=true" if "?" not in url else url

    # Try pre-built binary first (instant startup)
    binary = _find_tauri_binary()
    if binary:
        try:
            proc = subprocess.Popen(
                [str(binary), "--url", design_url],
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
                design_url,
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
) -> subprocess.Popen | None:
    """Open the viewer in a native Tauri window or browser.

    Returns the Tauri subprocess handle, or None if browser was used.
    """
    browser_url = f"{url}?design=true" if design_mode else url
    status = f"{url}  |  {label}  |  " if label else f"{url}  |  "

    if use_native:
        proc = _launch_tauri(url, allow_build=allow_build)
        if proc:
            print(f"{status}native  |  Ctrl+C to stop")
            return proc
        # Native requested but failed — fall back to browser
        if native_explicit:
            print("Warning: Could not launch native window, falling back to browser")

    webbrowser.open(browser_url)
    print(f"{status}Ctrl+C to stop")
    return None


def _cleanup_tauri(proc: subprocess.Popen | None):
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

    from rosette.cli import load_design

    logging.basicConfig(
        level=logging.WARNING,
        format="%(asctime)s %(name)s %(levelname)s: %(message)s",
        datefmt="%H:%M:%S",
    )

    server, url = _start_server(port)

    # Resolve native mode: auto-detect if not explicitly set.
    # Auto-detect only uses a pre-built binary (instant). Building from
    # source (cargo run) only happens with explicit --native.
    use_native = bool(native) if native is not None else _find_tauri_binary() is not None
    allow_build = native is True  # only build from source if explicitly requested

    tauri_proc = None

    if design:
        # Enable source tracking for two-way editing
        from rosette import enable_source_tracking

        enable_source_tracking()

        cell, file_path, _ = load_design(design)
        json_str, cell_tree, source_map, child_source_maps, cell_vars = _prepare_design(cell)
        layer_defs = _load_layer_map_safe()

        server.set_design_json(
            json_str,
            cells=cell_tree,
            layers=layer_defs,
            filename=Path(design).name,
            source_map=source_map,
            child_source_maps=child_source_maps,
            cell_vars=cell_vars,
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
            components_dir = Path.cwd() / "components"
            if components_dir.exists():
                watch_paths.append(components_dir)

            # Also watch rosette.toml for layer changes
            toml_path = Path.cwd() / "rosette.toml"
            if toml_path.exists():
                watch_paths.append(toml_path)

            for _changes in watch(*watch_paths):
                try:
                    # Clear module cache for all project files
                    project_dir = str(Path.cwd())
                    stale = [
                        name
                        for name, mod in list(sys.modules.items())
                        if hasattr(mod, "__file__")
                        and mod.__file__
                        and mod.__file__.startswith(project_dir)
                    ]
                    for name in stale:
                        del sys.modules[name]

                    # Also clear linecache so source tracking picks up changes
                    import linecache

                    linecache.clearcache()

                    cell, _, _ = load_design(design)
                    json_str, cell_tree, source_map, child_source_maps, cell_vars = _prepare_design(
                        cell
                    )
                    layer_defs = _load_layer_map_safe()

                    server.set_design_json(
                        json_str,
                        cells=cell_tree,
                        layers=layer_defs,
                        filename=Path(design).name,
                        source_map=source_map,
                        child_source_maps=child_source_maps,
                        cell_vars=cell_vars,
                    )
                except Exception as e:
                    print(f"error: {e}")

        except ImportError:
            _wait_forever()
        except KeyboardInterrupt:
            pass

    else:
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

    # Resolve native mode (auto-detect only uses pre-built binary)
    use_native = bool(native) if native is not None else _find_tauri_binary() is not None
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
