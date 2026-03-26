"""Rosette CLI - Photonic layout tool.

Commands:
    rosette init             Initialize rosette in current uv project
    rosette build <file>     Build a design to GDS
    rosette check <file>     Run all checks (DRC, ...)
    rosette drc <file>       Run DRC only
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

# Marker comments for framework-managed sections in agent files
_MARKER_BEGIN = "<!-- BEGIN:rosette-agent-rules -->"
_MARKER_END = "<!-- END:rosette-agent-rules -->"


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

    # check command - run all checks
    check_parser = subparsers.add_parser("check", help="Run all checks (DRC, ...)")
    check_parser.add_argument("design", help="Design file (path or path:target)")
    check_parser.add_argument(
        "--config", default=None, help="Path to rosette.toml (auto-detected if omitted)"
    )
    check_parser.add_argument("-v", "--verbose", action="store_true", help="Show detailed output")

    # drc command - run DRC only
    drc_parser = subparsers.add_parser("drc", help="Run DRC only")
    drc_parser.add_argument("design", help="Design file (path or path:target)")
    drc_parser.add_argument(
        "--config", default=None, help="Path to rosette.toml (auto-detected if omitted)"
    )
    drc_parser.add_argument("-v", "--verbose", action="store_true", help="Show detailed output")

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
    elif args.command == "check":
        check_design(args.design, args.config, args.verbose)
    elif args.command == "drc":
        drc_design(args.design, args.config, args.verbose)
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
    # Blank template starts empty — no pre-built components
    if template != "blank":
        _copy_components(project_dir)

    # Copy API stub for agent reference
    _copy_api_stub(project_dir / ".rosette")

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


def _copy_api_stub(rosette_dir: Path):
    """Copy the typed API stub to .rosette/ for agent reference."""
    package_dir = Path(__file__).parent

    pyi_file = package_dir / "_core.pyi"
    if pyi_file.exists():
        rosette_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(pyi_file, rosette_dir / "api.pyi")


def _update_agent_file(dest: Path, new_content: str):
    """Update an agent file, preserving user content outside markers.

    If the existing file contains BEGIN/END markers, only the content between
    markers is replaced. Any user content before or after the markers is kept.
    If no markers are found (legacy file), the entire file is overwritten.
    """
    if not dest.exists():
        dest.write_text(new_content)
        return

    existing = dest.read_text()

    # If the existing file has markers, do a surgical replacement
    begin_idx = existing.find(_MARKER_BEGIN)
    end_idx = existing.find(_MARKER_END)

    if begin_idx != -1 and end_idx != -1 and begin_idx < end_idx:
        end_idx += len(_MARKER_END)
        # Consume trailing newline after end marker if present
        if end_idx < len(existing) and existing[end_idx] == "\n":
            end_idx += 1

        # Extract the managed section from new content
        new_begin = new_content.find(_MARKER_BEGIN)
        new_end = new_content.find(_MARKER_END)
        if new_begin != -1 and new_end != -1:
            new_end += len(_MARKER_END)
            if new_end < len(new_content) and new_content[new_end] == "\n":
                new_end += 1
            managed_section = new_content[new_begin:new_end]
        else:
            managed_section = new_content

        updated = existing[:begin_idx] + managed_section + existing[end_idx:]
        dest.write_text(updated)
    else:
        # Legacy file without markers -- overwrite entirely
        dest.write_text(new_content)


def update_project():
    """Update agent instruction files to latest templates.

    Convention:
    - AGENTS.md / CLAUDE.md: only the section between BEGIN/END markers is
      replaced, preserving any user content outside the markers
    - .rosette/api.pyi: fully replaced with latest API stub
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

    # Update template files, preserving user content outside markers
    for template_file in template_dir.glob("*.template"):
        output_name = template_file.stem  # e.g., AGENTS.md.template -> AGENTS.md
        # Skip user-owned files
        if output_name == "rosette.toml":
            continue
        # Filter tool-specific templates
        if output_name == "AGENTS.md" and "opencode" not in tools:
            continue
        if output_name == "CLAUDE.md" and "claude" not in tools:
            continue
        content = template_file.read_text().replace("{{name}}", name)
        dest = project_dir / output_name

        if output_name in ("AGENTS.md", "CLAUDE.md"):
            # Marker-based update: preserve user content outside markers
            _update_agent_file(dest, content)
        else:
            dest.write_text(content)

    # Update API stub for agent reference
    _copy_api_stub(project_dir / ".rosette")

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


def _format_layer(layer_tuple: tuple[int, int]) -> str:
    """Format a layer tuple as 'number/datatype'."""
    return f"{layer_tuple[0]}/{layer_tuple[1]}"


def _run_drc_check(
    design_spec: str,
    config_path: str | None = None,
) -> tuple:
    """Run DRC on a design and return (result, file_path).

    Loads the design, loads rules from rosette.toml, and runs DRC.
    Returns (DrcResult, file_path) for the caller to format output.
    """
    from rosette import load_drc_rules, run_drc

    # Load design
    cell, file_path, _ = load_design(design_spec)

    # Load DRC rules from rosette.toml
    try:
        rules = load_drc_rules(config_path)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except ValueError as e:
        print(f"Error in DRC config: {e}")
        sys.exit(1)

    # Run DRC (Rust engine)
    result = run_drc(cell, rules)
    return result, file_path


def _print_drc_result(result, file_path: Path, verbose: bool = False) -> bool:
    """Print DRC results. Returns True if passed."""
    # Header
    print(f"drc  {file_path}  {result.rules_checked} rules, {result.polygons_checked} polygons")

    if result.passed:
        print(f"\n  passed ({result.elapsed_ms:.1f}ms)")
        return True

    # Print violations
    print()
    errors = 0
    warnings = 0
    for v in result.violations:
        if v.severity == "error":
            errors += 1
            label = "FAIL"
        else:
            warnings += 1
            label = "WARN"

        # Use rule_name if available, otherwise rule_type
        name = v.rule_name or v.rule_type
        layer_str = _format_layer(v.layer)

        # Build the violation line
        if v.layer2 is not None:
            layer_str += f", {_format_layer(v.layer2)}"

        print(f"  {label}  {name} on {layer_str}: {v.message}")

        if verbose:
            bbox = v.bbox
            print(
                f"        at ({bbox[0][0]:.3f}, {bbox[0][1]:.3f}) "
                f"to ({bbox[1][0]:.3f}, {bbox[1][1]:.3f})"
            )

    # Summary
    parts = []
    if errors:
        parts.append(f"{errors} error{'s' if errors != 1 else ''}")
    if warnings:
        parts.append(f"{warnings} warning{'s' if warnings != 1 else ''}")
    summary = ", ".join(parts)
    count = len(result.violations)
    print(
        f"\n  {count} violation{'s' if count != 1 else ''} ({summary}) in {result.elapsed_ms:.1f}ms"
    )
    return False


def drc_design(design: str, config: str | None = None, verbose: bool = False):
    """Run DRC on a design."""
    result, file_path = _run_drc_check(design, config)
    passed = _print_drc_result(result, file_path, verbose)
    if not passed:
        sys.exit(1)


def check_design(design: str, config: str | None = None, verbose: bool = False):
    """Run all checks on a design.

    Currently runs DRC. More checks will be added in the future.
    """
    all_passed = True

    # DRC
    result, file_path = _run_drc_check(design, config)
    passed = _print_drc_result(result, file_path, verbose)
    if not passed:
        all_passed = False

    # Future checks would go here:
    # connectivity, density, LVS, etc.

    if not all_passed:
        sys.exit(1)


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
