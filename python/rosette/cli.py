"""Rosette CLI - Photonic layout tool.

Commands:
    rosette init             Initialize rosette in current uv project
    rosette build <file>     Build a design to GDS
    rosette serve [file]     Start dev server with live preview
"""

import argparse
import importlib.util
import logging
import os
import shutil
import sys
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


def _apply_template(template_dir: Path, project_dir: Path, name: str, tool: str | None = None):
    """Apply a template to the project directory.

    - Files ending in .template have {{name}} replaced and extension stripped
    - File named 'gitignore': entries are appended to existing .gitignore if present
    - All other files are copied as-is
    - Tool-specific files (AGENTS.md, CLAUDE.md) are only copied for the selected tool
    """
    for src_path in template_dir.rglob("*"):
        if src_path.is_dir():
            continue

        # Compute relative path and destination
        rel_path = src_path.relative_to(template_dir)

        # Filter tool-specific files
        rel_str = str(rel_path)
        if rel_str == "AGENTS.md.template" and tool != "opencode":
            continue
        if rel_str == "CLAUDE.md.template" and tool != "claude":
            continue

        dest_path = project_dir / rel_path

        # Handle gitignore: append to existing rather than overwrite
        if dest_path.name == "gitignore":
            _append_gitignore(src_path, project_dir / ".gitignore")
            continue

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


def _append_gitignore(src_path: Path, dest_path: Path):
    """Append rosette-specific entries to .gitignore, avoiding duplicates."""
    new_entries = [
        line.strip()
        for line in src_path.read_text().splitlines()
        if line.strip() and not line.startswith("#")
    ]

    if dest_path.exists():
        existing = dest_path.read_text()
        existing_lines = {line.strip() for line in existing.splitlines()}
        to_add = [entry for entry in new_entries if entry not in existing_lines]
        if to_add:
            # Ensure we start on a new line
            if existing and not existing.endswith("\n"):
                existing += "\n"
            existing += "\n# Rosette\n"
            existing += "\n".join(to_add) + "\n"
            dest_path.write_text(existing)
    else:
        dest_path.write_text("# Rosette\n" + "\n".join(new_entries) + "\n")


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

    # init command - initializes in current uv project
    init_parser = subparsers.add_parser("init", help="Initialize rosette in current uv project")
    init_parser.add_argument(
        "-t",
        "--template",
        default=None,
        help="Project template to use (blank, generic). Interactive if omitted.",
    )
    init_parser.add_argument(
        "--tool",
        default=None,
        choices=["opencode", "claude", "none"],
        help="AI tool to configure (opencode, claude, none). Interactive if omitted.",
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
        init_project(template=args.template, tool=args.tool)
    elif args.command == "update":
        update_project()
    elif args.command == "build":
        build_design(args.design, args.output, args.verbose)
    elif args.command == "serve":
        from rosette._serve import serve_design

        native = None if args.native is None else True
        if args.no_native:
            native = False
        serve_design(args.design, args.port, args.no_open, native=native)
    elif args.command == "run":
        from rosette._serve import run_gds

        native_run = None if args.native is None else True
        if args.no_native:
            native_run = False
        run_gds(args.file, args.port, args.no_open, native=native_run)


def _select_tool_interactive() -> str | None:
    """Interactive single-select for AI tool configuration.

    Uses arrow keys + enter in TTY mode, falls back to numbered prompt.
    Returns the tool key ("opencode" or "claude") or None if skipped.
    """
    options = [
        ("opencode", "OpenCode", "Generates AGENTS.md"),
        ("claude", "Claude Code", "Generates CLAUDE.md"),
        (None, "None", "Skip AI tool setup"),
    ]

    if not sys.stdin.isatty():
        return "opencode"

    try:
        return _interactive_tool_radio(options)
    except Exception:
        return _simple_tool_select(options)


def _interactive_tool_radio(options: list[tuple[str | None, str, str]]) -> str | None:
    """Radio selector for AI tool using terminal raw mode (Unix)."""
    import termios
    import tty

    cursor = 0
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    drawn = False

    def render():
        nonlocal drawn
        if drawn:
            sys.stdout.write(f"\033[{len(options) + 1}A\033[J")
        sys.stdout.write(
            "Select AI tool (\033[1m\u2191\u2193\033[0m move, \033[1menter\033[0m confirm):\r\n"
        )
        for i, (_, label, desc) in enumerate(options):
            dot = "\033[32m\u25cf\033[0m" if i == cursor else "\u25cb"
            arrow = "\033[36m\u203a\033[0m " if i == cursor else "  "
            sys.stdout.write(f"  {arrow}{dot} {label} \033[2m- {desc}\033[0m\r\n")
        sys.stdout.flush()
        drawn = True

    try:
        tty.setraw(fd)
        sys.stdout.write("\r\n")
        sys.stdout.write("  Rosette sets up AI agent config so your editor knows how to work\r\n")
        sys.stdout.write("  with photonic designs. Pick which tool you use:\r\n")
        sys.stdout.write("\r\n")
        sys.stdout.flush()
        render()

        while True:
            ch = sys.stdin.read(1)
            if ch in ("\r", "\n"):
                break
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
    return options[cursor][0]


def _simple_tool_select(options: list[tuple[str | None, str, str]]) -> str | None:
    """Fallback numbered prompt for AI tool selection."""
    print()
    print("  Rosette sets up AI agent config so your editor knows how to work")
    print("  with photonic designs. Pick which tool you use:")
    print()
    for i, (_, label, desc) in enumerate(options, 1):
        print(f"  {i}. {label} - {desc}")

    choice = input("Choice (default: 1): ").strip()
    if not choice or choice == "1":
        return options[0][0]
    if choice.isdigit():
        idx = int(choice) - 1
        if 0 <= idx < len(options):
            return options[idx][0]
    return options[0][0]


def _select_template_interactive() -> str:
    """Interactive single-select for project template.

    Uses arrow keys + enter in TTY mode, falls back to numbered prompt.
    """
    options = [
        ("blank", "Blank", "Empty config, define your own layers"),
        ("generic", "Generic", "Pre-configured silicon photonics layers & DRC"),
    ]

    if not sys.stdin.isatty():
        return "blank"

    try:
        return _interactive_radio(options)
    except Exception:
        return _simple_template_select(options)


def _interactive_radio(options: list[tuple[str, str, str]]) -> str:
    """Radio selector using terminal raw mode (Unix)."""
    import termios
    import tty

    cursor = 0
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    drawn = False

    def render():
        nonlocal drawn
        if drawn:
            sys.stdout.write(f"\033[{len(options) + 1}A\033[J")
        sys.stdout.write(
            "Select a template (\033[1m\u2191\u2193\033[0m move, \033[1menter\033[0m confirm):\r\n"
        )
        for i, (_, label, desc) in enumerate(options):
            dot = "\033[32m\u25cf\033[0m" if i == cursor else "\u25cb"
            arrow = "\033[36m\u203a\033[0m " if i == cursor else "  "
            sys.stdout.write(f"  {arrow}{dot} {label} \033[2m- {desc}\033[0m\r\n")
        sys.stdout.flush()
        drawn = True

    try:
        tty.setraw(fd)
        sys.stdout.write("\r\n")
        render()

        while True:
            ch = sys.stdin.read(1)
            if ch in ("\r", "\n"):
                break
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
    return options[cursor][0]


def _simple_template_select(options: list[tuple[str, str, str]]) -> str:
    """Fallback numbered prompt for template selection."""
    print()
    for i, (_, label, desc) in enumerate(options, 1):
        print(f"  {i}. {label} - {desc}")

    choice = input("Choice (default: 1): ").strip()
    if not choice or choice == "1":
        return options[0][0]
    if choice.isdigit():
        idx = int(choice) - 1
        if 0 <= idx < len(options):
            return options[idx][0]
    return options[0][0]


def init_project(template: str | None = None, tool: str | None = None):
    """Initialize rosette in the current uv project.

    Expects the user has already run `uv init` and `uv add librosette`.
    """
    project_dir = Path.cwd()
    name = project_dir.name

    # Pre-flight: ensure we're inside a uv/Python project
    if not (project_dir / "pyproject.toml").exists():
        print("Error: No pyproject.toml found. Initialize your project first:")
        print()
        print("  uv init")
        print("  uv add librosette")
        print("  uv run rosette init")
        sys.exit(1)

    # Check if already initialized
    if (project_dir / "rosette.toml").exists():
        print("Error: rosette.toml already exists (project already initialized)")
        sys.exit(1)

    # Select template if not specified
    if template is None:
        template = _select_template_interactive()

    # Select AI tool if not specified
    if tool is None:
        tool = _select_tool_interactive()

    # Normalize "none" to None
    if tool == "none":
        tool = None

    # Validate tool name
    if tool is not None:
        valid_tools = {"opencode", "claude"}
        if tool not in valid_tools:
            print(f"Error: Unknown tool: {tool}")
            print(f"Valid options: {', '.join(sorted(valid_tools))}")
            sys.exit(1)

    # Load and apply template
    template_dir = _get_template_dir(template)
    if template_dir is None:
        available = _list_templates()
        print(f"Error: Template '{template}' not found")
        print(f"Available templates: {', '.join(available)}")
        sys.exit(1)

    _apply_template(template_dir, project_dir, name, tool=tool)

    # Create directories (not part of template)
    (project_dir / "designs").mkdir(exist_ok=True)
    (project_dir / "output").mkdir(exist_ok=True)

    # Copy components for user customization (shadcn-style)
    _copy_components(project_dir)

    # Copy source files for agent reference
    _copy_source_files(project_dir / ".rosette")

    tool_label = tool or "none"
    print(f"Initialized rosette project '{name}' (template: {template}, tool: {tool_label})")
    print()
    print("Next steps:")
    print("  Create a design in designs/ and build it:")
    print("  uv run rosette build designs/<name>.py")
    print()
    if tool == "opencode":
        print("  Or use an AI agent:")
        print("  opencode       # reads AGENTS.md")
    elif tool == "claude":
        print("  Or use an AI agent:")
        print("  claude         # reads CLAUDE.md")


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

    # Get project name and template from rosette.toml
    import tomllib

    with open(project_dir / "rosette.toml", "rb") as f:
        config = tomllib.load(f)
    project_config = config.get("project", {})
    name = project_config.get("name", project_dir.name)
    template_name = project_config.get("template", "blank")

    template_dir = _get_template_dir(template_name)
    if template_dir is None:
        print(f"Error: Template '{template_name}' not found")
        sys.exit(1)

    # Detect which tools are configured by checking for their files
    tools = []
    if (project_dir / "AGENTS.md").exists():
        tools.append("opencode")
    if (project_dir / "CLAUDE.md").exists():
        tools.append("claude")

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
        # Auto-detect: find all Cell objects in the module
        cell_vars = {
            name: obj
            for name, obj in vars(module).items()
            if isinstance(obj, Cell) and not name.startswith("_")
        }

        if len(cell_vars) == 1:
            # Exactly one Cell found -- use it
            target_name = next(iter(cell_vars))
        else:
            print(f"Error: No variable named '{target_name}' found in {file_path}")
            if cell_vars:
                names = ", ".join(cell_vars)
                print(f"  Found cells: {names}")
                print()
                print("Specify which one to build:")
                first = next(iter(cell_vars))
                print(f"    rosette build {file_path}:{first}")
            else:
                print()
                print("Define a Cell in your script:")
                print(f'    design = Cell("{file_path.stem}")')
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


if __name__ == "__main__":
    main()
