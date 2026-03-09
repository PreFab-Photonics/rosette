"""Rosette CLI - Photonic layout tool.

Commands:
    rosette init <name>      Create a new rosette project
    rosette build <file>     Build a design to GDS
    rosette serve [file]     Start dev server with live preview
"""

import argparse
import importlib.util
import os
import shutil
import subprocess
import sys
import webbrowser
from pathlib import Path

# Template directory location (relative to this file)
TEMPLATES_DIR = Path(__file__).parent / "templates"
# Components directory location (relative to this file)
COMPONENTS_DIR = Path(__file__).parent / "components"


def _get_template_dir(template_name: str) -> Path | None:
    """Get path to a template directory, or None if not found."""
    template_path = TEMPLATES_DIR / template_name
    if template_path.is_dir():
        return template_path
    return None


def _list_templates() -> list[str]:
    """List available template names."""
    if not TEMPLATES_DIR.exists():
        return []
    return [d.name for d in TEMPLATES_DIR.iterdir() if d.is_dir()]


def _apply_template(template_dir: Path, project_dir: Path, name: str):
    """Apply a template to the project directory.

    - Files ending in .template have {{name}} replaced and extension stripped
    - File named 'gitignore' is renamed to '.gitignore'
    - All other files are copied as-is
    """
    for src_path in template_dir.rglob("*"):
        if src_path.is_dir():
            continue

        # Compute relative path and destination
        rel_path = src_path.relative_to(template_dir)
        dest_path = project_dir / rel_path

        # Handle special naming
        if dest_path.name == "gitignore":
            dest_path = dest_path.parent / ".gitignore"

        # Create parent directories
        dest_path.parent.mkdir(parents=True, exist_ok=True)

        if src_path.suffix == ".template":
            # Process template file: substitute {{name}} and strip .template extension
            content = src_path.read_text()
            content = content.replace("{{name}}", name)
            dest_path = dest_path.with_suffix("")  # Remove .template extension
            dest_path.write_text(content)
        else:
            # Copy file as-is
            shutil.copy2(src_path, dest_path)


def _copy_components(project_dir: Path):
    """Copy the components directory to the project for user customization."""
    import tempfile

    if not COMPONENTS_DIR.exists():
        print("Warning: Components directory not found, skipping")
        return

    target_dir = project_dir / "components"

    # Copy to temp location first, then move atomically
    # This prevents data loss if copytree fails mid-operation
    with tempfile.TemporaryDirectory(dir=project_dir) as tmp:
        tmp_target = Path(tmp) / "components"
        shutil.copytree(COMPONENTS_DIR, tmp_target)

        # Only remove existing after successful copy
        if target_dir.exists():
            shutil.rmtree(target_dir)

        # Move from temp to final location
        shutil.move(str(tmp_target), str(target_dir))

    # Count files copied
    py_files = list(target_dir.glob("*.py"))
    print(f"Copied {len(py_files)} component files to components/")


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        prog="rosette",
        description="Photonic layout tool for creating and building GDS designs",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # init command - initializes in current directory
    init_parser = subparsers.add_parser(
        "init", help="Initialize a rosette project in current directory"
    )
    init_parser.add_argument(
        "name",
        nargs="?",
        default=None,
        help="Project name (defaults to directory name)",
    )
    init_parser.add_argument(
        "-t",
        "--template",
        default="blank",
        help="Project template to use (default: blank)",
    )

    # update command - updates template files
    subparsers.add_parser("update", help="Update AGENTS.md to latest template")

    # build command
    build_parser = subparsers.add_parser("build", help="Build a design to GDS")
    build_parser.add_argument("design", help="Design file (path or path:target)")
    build_parser.add_argument("-o", "--output", default="output", help="Output directory")
    build_parser.add_argument(
        "-v", "--verbose", action="store_true", help="Show detailed build output"
    )

    # serve command
    serve_parser = subparsers.add_parser("serve", help="Start dev server with live preview")
    serve_parser.add_argument(
        "design",
        nargs="?",
        default=None,
        help="Design file (.py). If omitted, opens empty canvas.",
    )
    serve_parser.add_argument(
        "-p", "--port", type=int, default=5173, help="Server port (default: 5173)"
    )
    serve_parser.add_argument(
        "--no-open", action="store_true", help="Don't open browser automatically"
    )

    # run command
    run_parser = subparsers.add_parser("run", help="View a GDS file in the browser")
    run_parser.add_argument("file", help="GDS file to view (.gds)")
    run_parser.add_argument(
        "-p", "--port", type=int, default=5173, help="Server port (default: 5173)"
    )
    run_parser.add_argument(
        "--no-open", action="store_true", help="Don't open browser automatically"
    )

    args = parser.parse_args()

    if args.command == "init":
        init_project(args.name, args.template)
    elif args.command == "update":
        update_project()
    elif args.command == "build":
        build_design(args.design, args.output, args.verbose)
    elif args.command == "serve":
        serve_design(args.design, args.port, args.no_open)
    elif args.command == "run":
        run_gds(args.file, args.port, args.no_open)


def init_project(name: str | None, template: str = "blank"):
    """Initialize a rosette project.

    If name is provided, creates a new directory with that name.
    If name is None, initializes in the current directory.
    """
    if name is None:
        # Initialize in current directory (like `git init`)
        project_dir = Path.cwd()
        name = project_dir.name
    else:
        # Create new directory (like `git init foo`)
        project_dir = Path.cwd() / name
        if project_dir.exists():
            print(f"Error: Directory '{name}' already exists")
            sys.exit(1)
        project_dir.mkdir()

    # Check if already initialized
    if (project_dir / "rosette.toml").exists():
        print("Error: rosette.toml already exists (project already initialized)")
        sys.exit(1)

    # Load and apply template
    template_dir = _get_template_dir(template)
    if template_dir is None:
        available = _list_templates()
        print(f"Error: Template '{template}' not found")
        print(f"Available templates: {', '.join(available)}")
        sys.exit(1)

    _apply_template(template_dir, project_dir, name)

    # Create output directory (runtime, not part of template)
    (project_dir / "output").mkdir(exist_ok=True)

    # Copy components for user customization (shadcn-style)
    _copy_components(project_dir)

    # Copy source files for agent reference
    _copy_source_files(project_dir / ".rosette")

    # Set up venv with rosette for LSP support
    _setup_venv(project_dir)

    print(f"Initialized rosette project '{name}' (template: {template})")
    print()
    print("Next steps:")
    print("  rosette build designs/basic_shapes.py")
    print()
    print("Or use an AI agent:")
    print("  opencode  # reads AGENTS.md for instructions")


def _copy_source_files(rosette_dir: Path):
    """Copy bundled source files to .rosette/ for agent reference."""
    package_dir = Path(__file__).parent
    source_dir = package_dir / "_source"
    target_src = rosette_dir / "src"

    # Copy .pyi type stub (most useful for agents)
    pyi_file = package_dir / "_core.pyi"
    if pyi_file.exists():
        rosette_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(pyi_file, rosette_dir / "api.pyi")

    if not source_dir.exists():
        # Source not bundled (development install without running bundle_source.py)
        print("Note: Source files not bundled, skipping .rosette/src/ population")
        return

    # Clean and recreate target
    if target_src.exists():
        shutil.rmtree(target_src)
    target_src.mkdir(parents=True, exist_ok=True)

    # Copy all .rs files
    copied = 0
    for rs_file in source_dir.rglob("*.rs"):
        rel_path = rs_file.relative_to(source_dir)
        dest = target_src / rel_path
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(rs_file, dest)
        copied += 1

    if copied > 0:
        print(f"Copied {copied} source files to .rosette/src/")


def _setup_venv(project_dir: Path):
    """Set up a venv with rosette for LSP/editor support."""
    import rosette

    # Find where rosette is installed from
    rosette_path = Path(rosette.__file__).parent.parent.parent

    # Create venv
    venv_path = project_dir / ".venv"
    if not venv_path.exists():
        print("Setting up Python environment...")

        # Check if uv is available, fall back to standard venv/pip
        if shutil.which("uv"):
            subprocess.run(
                ["uv", "venv", str(venv_path)],
                capture_output=True,
            )
            subprocess.run(
                [
                    "uv",
                    "pip",
                    "install",
                    "-e",
                    str(rosette_path),
                    "--python",
                    str(venv_path / "bin" / "python"),
                ],
                capture_output=True,
            )
        else:
            # Fallback to standard venv + pip
            subprocess.run(
                [sys.executable, "-m", "venv", str(venv_path)],
                capture_output=True,
            )
            pip_path = venv_path / "bin" / "pip"
            if not pip_path.exists():
                pip_path = venv_path / "Scripts" / "pip"  # Windows
            subprocess.run(
                [str(pip_path), "install", "-e", str(rosette_path)],
                capture_output=True,
            )


def update_project():
    """Update agent instruction files to latest templates.

    Convention:
    - Rosette-managed directories (.rosette/) are fully replaced
    - Template files (*.template) are processed with {{name}} substitution
    - User-owned files are never touched:
      - designs/ - your design files
      - components/ - your customizable components (shadcn-style)
      - rosette.toml - your project config
    """
    project_dir = Path.cwd()

    # Check if this is a rosette project
    if not (project_dir / "rosette.toml").exists():
        print("Error: Not a rosette project (rosette.toml not found)")
        sys.exit(1)

    # Get project name from rosette.toml
    import tomllib

    with open(project_dir / "rosette.toml", "rb") as f:
        config = tomllib.load(f)
    name = config.get("project", {}).get("name", project_dir.name)

    template_dir = _get_template_dir("blank")
    if template_dir is None:
        print("Error: Template 'blank' not found")
        sys.exit(1)

    # Rosette-managed directories: replace entirely from template
    managed_dirs = [".rosette"]
    for dir_name in managed_dirs:
        src = template_dir / dir_name
        if src.exists():
            dst = project_dir / dir_name
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)

    # Template files at root: process with {{name}} substitution
    for template_file in template_dir.glob("*.template"):
        output_name = template_file.stem  # e.g., AGENTS.md.template -> AGENTS.md
        content = template_file.read_text().replace("{{name}}", name)
        (project_dir / output_name).write_text(content)

    # Update bundled source files for agent reference
    _copy_source_files(project_dir / ".rosette")

    # Ensure venv is set up
    _setup_venv(project_dir)

    print("Updated project to latest templates")


def load_design(path_spec: str) -> tuple:
    """Load a design from a file using the 'design' convention.

    Args:
        path_spec: Path to design file, optionally with :target suffix
                   (e.g., "designs/chip.py" or "designs/chip.py:my_cell")

    Returns:
        Tuple of (cell, file_path, target_name)

    The design file should have a 'design' variable or function:
        design = Cell("my_design")  # Variable
        # or
        def design() -> Cell:       # Function (called with no args)
            ...
    """
    from rosette import Cell

    # Parse path_spec for optional :target
    if ":" in path_spec and not path_spec.startswith(":"):
        # Could be path:target or Windows path C:\...
        # Only split on last : if it doesn't look like a drive letter
        parts = path_spec.rsplit(":", 1)
        if len(parts[0]) > 1:  # Not a drive letter like C:
            file_path = Path(parts[0])
            target_name = parts[1]
        else:
            file_path = Path(path_spec)
            target_name = "design"
    else:
        file_path = Path(path_spec)
        target_name = "design"

    if not file_path.exists():
        print(f"Error: Design file not found: {file_path}")
        sys.exit(1)

    # Add project directory to path for imports
    project_dir = Path.cwd()
    if str(project_dir) not in sys.path:
        sys.path.insert(0, str(project_dir))

    # Import the module
    spec = importlib.util.spec_from_file_location("design_module", file_path)
    if spec is None or spec.loader is None:
        print(f"Error: Could not load module from {file_path}")
        sys.exit(1)

    module = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(module)
    except Exception as e:
        print(f"Error loading design: {e}")
        sys.exit(1)

    # Get the target attribute
    if not hasattr(module, target_name):
        print(f"Error: No '{target_name}' found in {file_path}")
        print()
        print("Add a Cell named 'design':")
        print('    design = Cell("my_design")')
        print()
        print("Or specify explicitly:")
        print(f"rosette build {file_path}:my_cell_name")
        sys.exit(1)

    target = getattr(module, target_name)

    # If callable, call it
    if callable(target):
        try:
            cell = target()
        except Exception as e:
            print(f"Error calling {target_name}(): {e}")
            sys.exit(1)
    else:
        cell = target

    # Verify it's a Cell
    if not isinstance(cell, Cell):
        print(f"Error: '{target_name}' must be a Cell, got {type(cell).__name__}")
        sys.exit(1)

    return cell, file_path, target_name


def build_design(design: str, output_dir: str, verbose: bool = False):
    """Build a design to GDS using the 'design' convention."""
    from rosette import write_gds

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Load design using convention
    cell, file_path, _ = load_design(design)

    # Output filename from design file name
    gds_output = output_path / f"{file_path.stem}.gds"

    # Set verbose mode
    if verbose:
        os.environ["ROSETTE_VERBOSE"] = "1"

    # Write GDS
    write_gds(str(gds_output), cell, quiet=False, verbose=verbose)
    print(f"ok {gds_output}")


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


def _prepare_design(cell):
    """Load child cells, flatten geometry, and build hierarchy tree.

    Returns:
        Tuple of (json_str, cell_tree, child_cells_list) where:
        - json_str: Flattened polygon JSON for the top cell
        - cell_tree: Hierarchy tree dict for the explorer panel
        - child_cells_list: List of child Cell objects (or None)
    """
    from rosette._core import to_flat_json

    # Collect child cells
    child_cells_list = list(cell.get_child_cells()) if hasattr(cell, "get_child_cells") else None

    # Serialize to flattened JSON for fast rendering
    if child_cells_list:
        inner_cells = [c._inner for c in child_cells_list]
        json_str = to_flat_json(cell._inner, inner_cells)
    else:
        json_str = to_flat_json(cell._inner, None)

    # Build hierarchy tree for the explorer panel
    cell_tree = _build_cell_tree(cell, child_cells_list)

    return json_str, cell_tree, child_cells_list


def _prepare_design_from_library(library):
    """Flatten a Library (e.g. from read_gds) for the viewer.

    The Library already contains the full cell hierarchy, so we serialize
    it directly rather than collecting child cells from Python wrappers.

    Returns:
        Tuple of (cell, json_str, cell_tree, child_cells_list)
    """
    from rosette import Library as LibWrapper
    from rosette._core import to_flat_json

    # Wrap into Python types
    if not isinstance(library, LibWrapper):
        library = LibWrapper._from_inner(library)

    top = library.top_cell()
    if top is None:
        raise ValueError("GDS file contains no cells")

    all_cells = library.cells()
    child_cells_list = [c for c in all_cells if c.name != top.name]

    # Flatten the whole library (preserves hierarchy for rendering)
    json_str = to_flat_json(library._inner)

    # Build hierarchy tree
    cell_tree = _build_cell_tree(top, child_cells_list)

    return top, json_str, cell_tree, child_cells_list


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
    """Try to load layer map from rosette.toml, return None on failure."""
    try:
        from rosette import load_layer_map

        layer_map = load_layer_map()
        if len(layer_map) > 0:
            return layer_map.to_dict_list()
    except (FileNotFoundError, ValueError):
        pass
    return None


def serve_design(design: str | None, port: int = 5173, no_open: bool = False):
    """Start development server with live preview for Python designs.

    Args:
        design: Path to design file (.py, optional). If None, opens empty canvas.
        port: Server port (default: 5173)
        no_open: Don't open browser automatically
    """
    server, url = _start_server(port)

    if design:
        cell, file_path, _ = load_design(design)
        json_str, cell_tree, child_cells_list = _prepare_design(cell)
        layer_defs = _load_layer_map_safe()

        server.set_design_json(json_str, cells=cell_tree, layers=layer_defs)
        server.set_design_cells(cell, child_cells_list)

        if not no_open:
            webbrowser.open(f"{url}?design=true")

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

                    cell, _, _ = load_design(design)
                    json_str, cell_tree, child_cells_list = _prepare_design(cell)
                    layer_defs = _load_layer_map_safe()

                    server.set_design_json(json_str, cells=cell_tree, layers=layer_defs)
                    server.set_design_cells(cell, child_cells_list)
                except Exception as e:
                    print(f"error: {e}")

        except ImportError:
            _wait_forever()
        except KeyboardInterrupt:
            pass

    else:
        if not no_open:
            webbrowser.open(url)
        print(f"{url}  |  Ctrl+C to stop")
        _wait_forever()

    print()


def run_gds(file: str, port: int = 5173, no_open: bool = False):
    """View a GDS file in the browser.

    Args:
        file: Path to GDS file
        port: Server port (default: 5173)
        no_open: Don't open browser automatically
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

    inner_lib = read_gds(str(file_path))
    cell, json_str, cell_tree, child_cells_list = _prepare_design_from_library(inner_lib)
    layer_defs = _load_layer_map_safe()

    server.set_design_json(json_str, cells=cell_tree, layers=layer_defs)
    server.set_design_cells(cell, child_cells_list)

    if not no_open:
        webbrowser.open(f"{url}?design=true")

    print(f"{url}  |  {file_path}  |  Ctrl+C to stop")

    # Watch for changes to the GDS file
    try:
        from watchfiles import watch

        for _changes in watch(file_path):
            try:
                inner_lib = read_gds(str(file_path))
                cell, json_str, cell_tree, child_cells_list = _prepare_design_from_library(
                    inner_lib
                )
                layer_defs = _load_layer_map_safe()
                server.set_design_json(json_str, cells=cell_tree, layers=layer_defs)
                server.set_design_cells(cell, child_cells_list)
            except Exception as e:
                print(f"error: {e}")

    except ImportError:
        _wait_forever()
    except KeyboardInterrupt:
        pass

    print()


def _wait_forever():
    """Block until Ctrl+C."""
    import time

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
