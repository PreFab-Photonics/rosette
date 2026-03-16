"""Rosette CLI - Photonic layout tool.

Commands:
    rosette init <name>      Create a new rosette project
    rosette build <file>     Build a design to GDS
    rosette serve [file]     Start dev server with live preview
"""

import argparse
import importlib.util
import logging
import os
import shutil
import subprocess
import sys
import webbrowser
from pathlib import Path

log = logging.getLogger(__name__)

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


def _apply_template(template_dir: Path, project_dir: Path, name: str, tools: list[str] | None = None):
    """Apply a template to the project directory.

    - Files ending in .template have {{name}} replaced and extension stripped
    - File named 'gitignore' is renamed to '.gitignore'
    - All other files are copied as-is
    - If tools is provided, only tool-specific files for selected tools are copied
    """
    for src_path in template_dir.rglob("*"):
        if src_path.is_dir():
            continue

        # Compute relative path and destination
        rel_path = src_path.relative_to(template_dir)

        # Filter tool-specific files
        if tools is not None:
            rel_str = str(rel_path)
            # OpenCode-specific files
            if rel_str.startswith(".opencode") or rel_str == "AGENTS.md.template":
                if "opencode" not in tools:
                    continue
            # Claude Code-specific files
            if rel_str == "CLAUDE.md.template":
                if "claude" not in tools:
                    continue

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
    init_parser.add_argument(
        "--tools",
        default=None,
        help="AI tools to configure, comma-separated (opencode,claude). Interactive if omitted.",
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
    serve_parser.add_argument(
        "--native",
        action="store_true",
        default=None,
        help="Open in native Tauri window (auto-detected if available)",
    )
    serve_parser.add_argument(
        "--no-native",
        action="store_true",
        help="Force browser mode even if Tauri app is available",
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
    run_parser.add_argument(
        "--native",
        action="store_true",
        default=None,
        help="Open in native Tauri window (auto-detected if available)",
    )
    run_parser.add_argument(
        "--no-native",
        action="store_true",
        help="Force browser mode even if Tauri app is available",
    )

    args = parser.parse_args()

    if args.command == "init":
        tools = args.tools.split(",") if args.tools else None
        init_project(args.name, args.template, tools=tools)
    elif args.command == "update":
        update_project()
    elif args.command == "build":
        build_design(args.design, args.output, args.verbose)
    elif args.command == "serve":
        native = None if args.native is None else True
        if args.no_native:
            native = False
        serve_design(args.design, args.port, args.no_open, native=native)
    elif args.command == "run":
        native_run = None if args.native is None else True
        if args.no_native:
            native_run = False
        run_gds(args.file, args.port, args.no_open, native=native_run)


def _select_tools_interactive() -> list[str]:
    """Interactive multi-select for AI tool configuration.

    Uses arrow keys + space in TTY mode, falls back to numbered prompt.
    """
    options = [
        ("opencode", "OpenCode"),
        ("claude", "Claude Code"),
    ]

    if not sys.stdin.isatty():
        return [key for key, _ in options]

    try:
        return _interactive_checkbox(options)
    except Exception:
        return _simple_select(options)


def _interactive_checkbox(options: list[tuple[str, str]]) -> list[str]:
    """Checkbox selector using terminal raw mode (Unix)."""
    import termios
    import tty

    selected = [False] * len(options)  # Start unchecked
    cursor = 0
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    drawn = False

    def render():
        nonlocal drawn
        if drawn:
            # Move cursor up to overwrite previous render
            sys.stdout.write(f"\033[{len(options) + 1}A\033[J")
        sys.stdout.write(
            "Select AI tools (\033[1m\u2191\u2193\033[0m move, "
            "\033[1mspace\033[0m toggle, "
            "\033[1menter\033[0m confirm):\r\n"
        )
        for i, (_, label) in enumerate(options):
            check = "\033[32m\u25cf\033[0m" if selected[i] else "\u25cb"
            arrow = "\033[36m\u203a\033[0m " if i == cursor else "  "
            sys.stdout.write(f"  {arrow}{check} {label}\r\n")
        sys.stdout.flush()
        drawn = True

    try:
        tty.setraw(fd)
        sys.stdout.write("\r\n")
        sys.stdout.write("  Rosette sets up AI agent config so your editor knows how to work\r\n")
        sys.stdout.write("  with photonic designs. Pick which tools you use:\r\n")
        sys.stdout.write("\r\n")
        sys.stdout.flush()
        render()

        while True:
            ch = sys.stdin.read(1)
            if ch in ("\r", "\n"):
                if any(selected):
                    break
                # Nothing selected — nudge the user
                continue
            elif ch == " ":
                selected[cursor] = not selected[cursor]
                render()
            elif ch == "\x1b":
                ch2 = sys.stdin.read(1)
                if ch2 == "[":
                    ch3 = sys.stdin.read(1)
                    if ch3 == "A":  # Up
                        cursor = (cursor - 1) % len(options)
                        render()
                    elif ch3 == "B":  # Down
                        cursor = (cursor + 1) % len(options)
                        render()
            elif ch == "\x03":  # Ctrl+C
                raise KeyboardInterrupt
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)

    sys.stdout.write("\n")
    return [key for (key, _), sel in zip(options, selected) if sel]


def _simple_select(options: list[tuple[str, str]]) -> list[str]:
    """Fallback numbered prompt for non-TTY or when raw mode fails."""
    print()
    print("  Rosette sets up AI agent config so your editor knows how to work")
    print("  with photonic designs. Pick which tools you use:")
    print()
    for i, (_, label) in enumerate(options, 1):
        print(f"  {i}. {label}")
    print(f"  {len(options) + 1}. All")

    choice = input(f"Choice (comma-separated, default: {len(options) + 1}): ").strip()
    if not choice or choice == str(len(options) + 1):
        return [key for key, _ in options]

    selected = []
    for c in choice.split(","):
        c = c.strip()
        if c.isdigit():
            idx = int(c) - 1
            if 0 <= idx < len(options):
                selected.append(options[idx][0])
    return selected or [key for key, _ in options]


def init_project(name: str | None, template: str = "blank", tools: list[str] | None = None):
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

    # Select AI tools if not specified
    if tools is None:
        tools = _select_tools_interactive()

    # Validate tool names
    valid_tools = {"opencode", "claude"}
    invalid = set(tools) - valid_tools
    if invalid:
        print(f"Error: Unknown tools: {', '.join(invalid)}")
        print(f"Valid options: {', '.join(sorted(valid_tools))}")
        sys.exit(1)

    # Load and apply template
    template_dir = _get_template_dir(template)
    if template_dir is None:
        available = _list_templates()
        print(f"Error: Template '{template}' not found")
        print(f"Available templates: {', '.join(available)}")
        sys.exit(1)

    _apply_template(template_dir, project_dir, name, tools=tools)

    # Create output directory (runtime, not part of template)
    (project_dir / "output").mkdir(exist_ok=True)

    # Copy components for user customization (shadcn-style)
    _copy_components(project_dir)

    # Copy source files for agent reference
    _copy_source_files(project_dir / ".rosette")

    # Set up venv with rosette for LSP support
    _setup_venv(project_dir)

    tool_names = ", ".join(sorted(tools))
    print(f"Initialized rosette project '{name}' (template: {template}, tools: {tool_names})")
    print()
    print("Next steps:")
    print("  rosette build designs/basic_shapes.py")
    print()
    print("Or use an AI agent:")
    if "opencode" in tools:
        print("  opencode       # reads AGENTS.md for instructions")
    if "claude" in tools:
        print("  claude         # reads CLAUDE.md for instructions")


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
    - Only updates files for tools that are already configured
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

    # Detect which tools are configured by checking for their files
    tools = []
    if (project_dir / "AGENTS.md").exists() or (project_dir / ".opencode").exists():
        tools.append("opencode")
    if (project_dir / "CLAUDE.md").exists():
        tools.append("claude")
    # If neither detected (legacy project), default to opencode for backwards compat
    if not tools:
        tools.append("opencode")

    # Rosette-managed directories: replace entirely from template
    managed_dirs = [".rosette"]
    if "opencode" in tools:
        managed_dirs.append(".opencode")
    for dir_name in managed_dirs:
        src = template_dir / dir_name
        if src.exists():
            dst = project_dir / dir_name
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)

    # Template files at root: process with {{name}} substitution (filtered by tools)
    for template_file in template_dir.glob("*.template"):
        output_name = template_file.stem  # e.g., AGENTS.md.template -> AGENTS.md
        # Filter tool-specific templates
        if output_name == "AGENTS.md" and "opencode" not in tools:
            continue
        if output_name == "CLAUDE.md" and "claude" not in tools:
            continue
        content = template_file.read_text().replace("{{name}}", name)
        (project_dir / output_name).write_text(content)

    # Update bundled source files for agent reference
    _copy_source_files(project_dir / ".rosette")

    # Ensure venv is set up
    _setup_venv(project_dir)

    tool_names = ", ".join(sorted(tools))
    print(f"Updated project to latest templates (tools: {tool_names})")


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
        _source_to_dict(src) if src is not None else None
        for src in sources
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
    log.info("[sourceMap] _build_child_source_maps: %d child cells", len(child_cells))
    if not child_cells:
        return None

    result: dict[str, list[dict | None]] = {}
    for child in child_cells:
        sources = getattr(child, "_element_sources", None)
        log.info("[sourceMap]   child '%s': %d sources", child.name, len(sources) if sources else 0)
        if not sources:
            continue

        # Build list matching WASM poly_counter order: skip text elements
        # since they don't produce render polygons.
        render_sources: list[dict | None] = []
        for i, src in enumerate(sources):
            if src is not None and src.element_type == "text":
                log.info("[sourceMap]     [%d] SKIP text: %s", i, src.code[:60] if src.code else "?")
                continue
            render_sources.append(_source_to_dict(src) if src is not None else None)
            if src is not None:
                log.info("[sourceMap]     [%d] → render[%d]: type=%s line=%d code=%s", i, len(render_sources)-1, src.element_type, src.line, src.code[:60] if src.code else "?")

        if any(s is not None for s in render_sources):
            result[child.name] = render_sources

    log.info("[sourceMap] _build_child_source_maps result: %s", {k: len(v) for k, v in result.items()} if result else None)
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


def _prepare_design(cell):
    """Serialize cell hierarchy and build explorer tree.

    Returns:
        Tuple of (json_str, cell_tree, source_map) where:
        - json_str: Hierarchical library JSON (micrometers, full structure)
        - cell_tree: Hierarchy tree dict for the explorer panel
        - source_map: Source info list indexed by element position (or None)
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

    return json_str, cell_tree, source_map, child_source_maps


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

    logging.basicConfig(
        level=logging.INFO,
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
        json_str, cell_tree, source_map, child_source_maps = _prepare_design(cell)
        layer_defs = _load_layer_map_safe()

        server.set_design_json(
            json_str,
            cells=cell_tree,
            layers=layer_defs,
            filename=Path(design).name,
            source_map=source_map,
            child_source_maps=child_source_maps,
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
                    json_str, cell_tree, source_map, child_source_maps = _prepare_design(cell)
                    layer_defs = _load_layer_map_safe()

                    server.set_design_json(
                        json_str,
                        cells=cell_tree,
                        layers=layer_defs,
                        filename=Path(design).name,
                        source_map=source_map,
                        child_source_maps=child_source_maps,
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


if __name__ == "__main__":
    main()
