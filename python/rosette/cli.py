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


def _apply_template(
    template_dir: Path, project_dir: Path, name: str, tools: list[str] | None = None
):
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
            if rel_str == "AGENTS.md.template":
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
        default=None,
        help="Project template to use (blank, generic). Interactive if omitted.",
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
        template = args.template  # None means interactive
        init_project(args.name, template=template, tools=tools)
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
    return [key for (key, _), sel in zip(options, selected, strict=True) if sel]


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


def _init_git(project_dir: Path):
    """Initialize a git repository if git is available and not already in one."""
    try:
        # Check if already inside a git repo
        result = subprocess.run(
            ["git", "rev-parse", "--is-inside-work-tree"],
            cwd=project_dir,
            capture_output=True,
        )
        if result.returncode == 0:
            return  # Already in a git repo

        subprocess.run(
            ["git", "init"],
            cwd=project_dir,
            capture_output=True,
        )
    except FileNotFoundError:
        pass  # git not installed


def init_project(name: str | None, template: str | None = None, tools: list[str] | None = None):
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

    # Select template if not specified
    if template is None:
        template = _select_template_interactive()

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

    # Create directories (not part of template)
    (project_dir / "designs").mkdir(exist_ok=True)
    (project_dir / "output").mkdir(exist_ok=True)

    # Copy components for user customization (shadcn-style)
    _copy_components(project_dir)

    # Copy source files for agent reference
    _copy_source_files(project_dir / ".rosette")

    # Initialize git repository
    _init_git(project_dir)

    # Set up venv with rosette for LSP support
    _setup_venv(project_dir)

    tool_names = ", ".join(sorted(tools))
    print(f"Initialized rosette project '{name}' (template: {template}, tools: {tool_names})")
    print()
    print("Next steps:")
    print("  Create a design in designs/ and build it:")
    print("  rosette build designs/<name>.py")
    print()
    print("Or use an AI agent:")
    if "opencode" in tools:
        print("  opencode       # reads AGENTS.md")
    if "claude" in tools:
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
    # If neither detected (legacy project), default to opencode for backwards compat
    if not tools:
        tools.append("opencode")

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
