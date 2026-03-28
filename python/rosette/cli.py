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


def _find_design_files() -> list[Path]:
    """Find design .py files in the current project."""
    designs_dir = Path.cwd() / "designs"
    if not designs_dir.exists():
        return []
    return sorted(f for f in designs_dir.glob("*.py") if not f.name.startswith("_"))


def _find_gds_files() -> list[Path]:
    """Find .gds files in output/ and current directory."""
    files: list[Path] = []
    output_dir = Path.cwd() / "output"
    if output_dir.exists():
        files.extend(output_dir.glob("*.gds"))
    files.extend(Path.cwd().glob("*.gds"))
    return sorted(set(files))


# Commands that need a design .py file
_NEEDS_DESIGN = {"build", "check", "dfm", "drc"}
# Commands that need a .gds file
_NEEDS_GDS = {"run"}
# Commands that take no file argument
_NEEDS_NOTHING = {"init", "update", "serve"}


def _select_command_interactive() -> tuple[str, str | None]:
    """Interactive command picker for bare `rosette` invocation.

    Returns (command, file_path) tuple. file_path is None for commands
    that don't need one.
    """
    commands = [
        ("serve", "serve", "Start dev server with live preview"),
        ("build", "build", "Build a design to GDS"),
        ("check", "check", "Run all checks (DRC, design checks; --include-dfm for DFM)"),
        ("drc", "drc", "Run DRC only"),
        ("dfm", "dfm", "Run DFM prediction only"),
        ("run", "run", "View a GDS file"),
        ("init", "init", "Initialize rosette in current project"),
        ("update", "update", "Update agent files to latest template"),
    ]

    try:
        command = _interactive_select("Select a command", commands)
    except Exception:
        command = _simple_select("Select a command", commands)

    if command is None:
        sys.exit(0)

    # Commands that don't need a file
    if command in _NEEDS_NOTHING:
        return command, None

    # Commands that need a .gds file
    if command in _NEEDS_GDS:
        gds_files = _find_gds_files()
        if not gds_files:
            print("No .gds files found in output/ or current directory")
            print("Build a design first:")
            print("  rosette build <path/to/design.py>")
            sys.exit(1)

        file_options = [(str(f), f.name, str(f.relative_to(Path.cwd()))) for f in gds_files]
        try:
            selected = _interactive_select("Select a GDS file", file_options)
        except Exception:
            selected = _simple_select("Select a GDS file", file_options)
        if selected is None:
            sys.exit(0)
        return command, selected

    # Commands that need a design .py file
    design_files = _find_design_files()
    if not design_files:
        print("No design files found in designs/")
        print("Create a design first, or specify one directly:")
        print(f"  rosette {command} <path/to/design.py>")
        sys.exit(1)

    file_options = [(str(f), f.name, str(f.relative_to(Path.cwd()))) for f in design_files]
    try:
        selected = _interactive_select("Select a design", file_options)
    except Exception:
        selected = _simple_select("Select a design", file_options)
    if selected is None:
        sys.exit(0)

    return command, selected


def main():
    """Main CLI entry point."""
    from rosette import __version__

    parser = argparse.ArgumentParser(
        prog="rosette",
        description="Photonic layout tool for creating and building GDS designs",
    )
    parser.add_argument("-V", "--version", action="version", version=f"rosette {__version__}")
    subparsers = parser.add_subparsers(dest="command")

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
    build_parser.add_argument(
        "--check", action="store_true", help="Run DRC before building (warns but still writes GDS)"
    )
    build_parser.add_argument(
        "--config",
        default=None,
        help="Path to rosette.toml for --check (auto-detected if omitted)",
    )

    # check command - run all checks
    check_parser = subparsers.add_parser("check", help="Run all checks (DRC, design checks)")
    check_parser.add_argument("design", help="Design file (path or path:target)")
    check_parser.add_argument(
        "--config", default=None, help="Path to rosette.toml (auto-detected if omitted)"
    )
    check_parser.add_argument(
        "--include-dfm",
        action="store_true",
        help="Also run DFM prediction (requires [dfm] section in rosette.toml)",
    )
    check_parser.add_argument("-v", "--verbose", action="store_true", help="Show detailed output")

    # drc command - run DRC only
    drc_parser = subparsers.add_parser("drc", help="Run DRC only")
    drc_parser.add_argument("design", help="Design file (path or path:target)")
    drc_parser.add_argument(
        "--config", default=None, help="Path to rosette.toml (auto-detected if omitted)"
    )
    drc_parser.add_argument("-v", "--verbose", action="store_true", help="Show detailed output")

    # dfm command - run DFM prediction only
    dfm_parser = subparsers.add_parser("dfm", help="Run DFM prediction")
    dfm_parser.add_argument("design", help="Design file (path or path:target)")
    dfm_parser.add_argument(
        "--config", default=None, help="Path to rosette.toml (auto-detected if omitted)"
    )
    dfm_parser.add_argument(
        "--gds",
        default=None,
        metavar="OUTPUT",
        help="Write GDS with predicted polygons on offset layers (e.g., 1/0 -> 1/100)",
    )
    dfm_parser.add_argument("-v", "--verbose", action="store_true", help="Show detailed output")

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

    # No command given: interactive picker in TTY, help text otherwise
    if args.command is None:
        if sys.stdin.isatty():
            command, design = _select_command_interactive()
            # Re-dispatch through the same main() with synthetic args
            argv = [command]
            if design:
                argv.append(design)
            sys.argv = ["rosette", *argv]
            return main()
        else:
            parser.print_help()
            sys.exit(0)

    if args.command == "init":
        init_project(template=args.template, tool=args.tool)
    elif args.command == "update":
        update_project()
    elif args.command == "build":
        build_design(args.design, args.output, args.verbose, args.check, args.config)
    elif args.command == "check":
        check_design(args.design, args.config, args.verbose, args.include_dfm)
    elif args.command == "drc":
        drc_design(args.design, args.config, args.verbose)
    elif args.command == "dfm":
        dfm_design(args.design, args.config, args.verbose, args.gds)
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


def _interactive_select(
    header: str,
    options: list[tuple],
    preamble: list[str] | None = None,
) -> str | None:
    """Generic radio selector using terminal raw mode (Unix).

    Args:
        header: Prompt text (e.g. "Select a command")
        options: List of (key, label, description) tuples
        preamble: Optional lines to display before the selector

    Returns:
        The selected option key, or None if cancelled (Esc/Ctrl+C/q).
    """
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
            f"{header} "
            f"(\033[1m\u2191\u2193\033[0m move, "
            f"\033[1menter\033[0m confirm, "
            f"\033[1mesc\033[0m cancel):\r\n"
        )
        for i, (_, label, desc) in enumerate(options):
            dot = "\033[32m\u25cf\033[0m" if i == cursor else "\u25cb"
            arrow = "\033[36m\u203a\033[0m " if i == cursor else "  "
            sys.stdout.write(f"  {arrow}{dot} {label} \033[2m- {desc}\033[0m\r\n")
        sys.stdout.flush()
        drawn = True

    def _read_escape_sequence() -> str | None:
        """Read after \\x1b. Returns 'up'/'down' for arrows, None for bare Esc."""
        # Use VMIN=0 VTIME=1 (100ms timeout) to distinguish bare Esc from sequences.
        # Arrow keys send \x1b[A/B as a fast burst; bare Esc has nothing after.
        seq_settings = termios.tcgetattr(fd)
        seq_settings[6][termios.VMIN] = 0
        seq_settings[6][termios.VTIME] = 1  # 100ms in deciseconds
        termios.tcsetattr(fd, termios.TCSANOW, seq_settings)
        try:
            ch2 = os.read(fd, 1)
            if not ch2:
                return None  # Bare Escape (timed out)
            if ch2 == b"[":
                ch3 = os.read(fd, 1)
                if ch3 == b"A":
                    return "up"
                elif ch3 == b"B":
                    return "down"
            return None  # Unknown sequence, treat as cancel
        finally:
            # Restore raw mode: VMIN=1 VTIME=0 (blocking read)
            raw_settings = termios.tcgetattr(fd)
            raw_settings[6][termios.VMIN] = 1
            raw_settings[6][termios.VTIME] = 0
            termios.tcsetattr(fd, termios.TCSANOW, raw_settings)

    try:
        tty.setraw(fd)
        sys.stdout.write("\r\n")
        if preamble:
            for line in preamble:
                sys.stdout.write(f"  {line}\r\n")
            sys.stdout.write("\r\n")
            sys.stdout.flush()
        render()

        while True:
            ch = os.read(fd, 1)
            if ch in (b"\r", b"\n"):
                break
            elif ch == b"\x1b":
                action = _read_escape_sequence()
                if action == "up":
                    cursor = (cursor - 1) % len(options)
                    render()
                elif action == "down":
                    cursor = (cursor + 1) % len(options)
                    render()
                else:
                    return None  # Bare Esc or unknown
            elif ch in (b"\x03", b"q"):  # Ctrl+C or q
                return None
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        sys.stdout.write("\n")

    return options[cursor][0]


def _simple_select(
    header: str,
    options: list[tuple],
    preamble: list[str] | None = None,
) -> str | None:
    """Generic fallback numbered prompt selector.

    Args:
        header: Prompt text (e.g. "Select a command")
        options: List of (key, label, description) tuples
        preamble: Optional lines to display before the options
    """
    print()
    if preamble:
        for line in preamble:
            print(f"  {line}")
        print()
    for i, (_, label, desc) in enumerate(options, 1):
        print(f"  {i}. {label} - {desc}")

    choice = input(f"{header} (default: 1): ").strip()
    if not choice or choice == "1":
        return options[0][0]
    if choice.isdigit():
        idx = int(choice) - 1
        if 0 <= idx < len(options):
            return options[idx][0]
    return options[0][0]


def _select_tool_interactive() -> str | None:
    """Interactive single-select for AI tool configuration.

    Uses arrow keys + enter in TTY mode, falls back to numbered prompt.
    Returns the tool key ("opencode" or "claude") or None if skipped.
    """
    options = [
        ("opencode", "OpenCode", "Generates AGENTS.md"),
        ("claude", "Claude Code", "Generates CLAUDE.md"),
        ("none", "None", "Skip AI tool setup"),
    ]
    preamble = [
        "Rosette sets up AI agent config so your editor knows how to work",
        "with photonic designs. Pick which tool you use:",
    ]

    if not sys.stdin.isatty():
        return "opencode"

    try:
        result = _interactive_select("Select AI tool", options, preamble)
    except Exception:
        result = _simple_select("Select AI tool", options, preamble)
    if result is None:
        sys.exit(0)
    return result


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
        result = _interactive_select("Select a template", options)
    except Exception:
        result = _simple_select("Select a template", options)
    if result is None:
        sys.exit(0)
    return result


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


def _use_color() -> bool:
    """Check if we should use colored output."""
    if os.environ.get("NO_COLOR"):
        return False
    return sys.stdout.isatty()


def _color(text: str, code: str) -> str:
    """Wrap text in ANSI color codes if color is enabled."""
    if not _use_color():
        return text
    return f"\033[{code}m{text}\033[0m"


def _red(text: str) -> str:
    return _color(text, "31")


def _yellow(text: str) -> str:
    return _color(text, "33")


def _green(text: str) -> str:
    return _color(text, "32")


def _dim(text: str) -> str:
    return _color(text, "2")


def _bold(text: str) -> str:
    return _color(text, "1")


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
        # Also catches TOMLDecodeError (subclass of ValueError)
        print(f"Error in DRC config: {e}")
        sys.exit(1)

    # Run DRC (Rust engine)
    result = run_drc(cell, rules)
    return result, file_path


def _print_drc_result(result, file_path: Path, verbose: bool = False) -> bool:
    """Print DRC results. Returns True if passed."""
    # Header
    print(
        f"{_bold('drc')}  {file_path}  "
        f"{_dim(f'{result.rules_checked} rules, {result.polygons_checked} polygons')}"
    )

    if result.passed:
        print(f"\n  {_green('passed')} {_dim(f'({result.elapsed_ms:.1f}ms)')}")
        return True

    # Print violations
    print()
    errors = 0
    warnings = 0
    for v in result.violations:
        if v.severity == "error":
            errors += 1
            label = _red("FAIL")
        else:
            warnings += 1
            label = _yellow("WARN")

        # Use rule_name if available, otherwise rule_type
        name = v.rule_name or v.rule_type
        layer_str = _format_layer(v.layer)

        # Build the violation line
        if v.layer2 is not None:
            layer_str += f", {_format_layer(v.layer2)}"

        print(f"  {label}  {_bold(name)} on {layer_str}: {v.message}")

        if verbose:
            bbox = v.bbox
            print(
                f"        {_dim(f'at ({bbox[0][0]:.3f}, {bbox[0][1]:.3f})')}"
                f" {_dim(f'to ({bbox[1][0]:.3f}, {bbox[1][1]:.3f})')}"
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
        f"\n  {_red(f'{count} violation' + ('s' if count != 1 else ''))} "
        f"({summary}) {_dim(f'in {result.elapsed_ms:.1f}ms')}"
    )
    return False


def drc_design(design: str, config: str | None = None, verbose: bool = False):
    """Run DRC on a design."""
    result, file_path = _run_drc_check(design, config)
    passed = _print_drc_result(result, file_path, verbose)
    if not passed:
        sys.exit(1)


def _run_dfm_check(
    design_spec: str,
    config_path: str | None = None,
    cell=None,
    file_path: Path | None = None,
) -> tuple:
    """Run DFM prediction on a design and return (result, file_path, has_tolerances, cell).

    Loads the design (unless cell/file_path are provided), loads DFM config
    from rosette.toml, and runs prediction.

    Raises FileNotFoundError/ValueError on config issues instead of exiting,
    so callers can decide how to handle errors.
    """
    from rosette import load_dfm_config, run_dfm

    # Load design if not provided
    if cell is None:
        cell, file_path, _ = load_design(design_spec)

    # Load DFM config from rosette.toml (raises on error — caller handles)
    dfm_config, model, layers = load_dfm_config(config_path)

    if not layers:
        raise ValueError(
            'No layers specified in [dfm] config. Add layers = ["1/0"] to rosette.toml.'
        )

    # Run DFM prediction (Rust engine)
    result = run_dfm(cell, layers=layers, model=model, config=dfm_config)
    return result, file_path, dfm_config.has_tolerances, cell


def _print_dfm_result(
    result, file_path: Path, verbose: bool = False, has_tolerances: bool = False
) -> bool:
    """Print DFM results. Returns True if passed (no error-severity violations)."""

    # Header
    print(
        f"{_bold('dfm')}  {file_path}  "
        f"{_dim(f'{result.layers_processed} layers, {result.total_input_polygons} polygons')}"
    )

    # Print violations first (if any)
    if result.violations:
        print()
        for v in result.violations:
            layer_str = f"{v.layer[0]}/{v.layer[1]}"
            if v.severity == "error":
                label = _red("FAIL")
            else:
                label = _yellow("WARN")

            print(f"  {label}  {_bold(v.violation_type)} on {layer_str}: {v.message}")

            if verbose:
                bbox = v.bbox
                print(
                    f"        {_dim(f'at ({bbox[0][0]:.3f}, {bbox[0][1]:.3f})')}"
                    f" {_dim(f'to ({bbox[1][0]:.3f}, {bbox[1][1]:.3f})')}"
                )

    # Per-layer summary
    print()
    for lp in result.layers:
        layer_str = f"{lp.layer[0]}/{lp.layer[1]}"
        if lp.input_polygon_count == 0:
            print(f"  {_dim(f'Layer {layer_str}: no geometry (skipped)')}")
            continue

        line = (
            f"  Layer {_bold(layer_str)}: "
            f"{lp.input_polygon_count} input -> "
            f"{lp.predicted_polygon_count} predicted"
        )
        print(line)

        # Metrics line
        m = lp.metrics
        if m is not None:
            area_pct = m.area_deviation * 100.0
            area_sign = "+" if area_pct >= 0 else ""
            features = ""
            if m.designed_feature_count != m.predicted_feature_count:
                features = f", features: {m.designed_feature_count}->{m.predicted_feature_count}"
            print(
                f"    edge deviation: {m.max_edge_deviation:.3f} um, "
                f"area: {area_sign}{area_pct:.1f}%{features}"
            )

        if verbose and lp.has_raster:
            w = lp.raster_width
            h = lp.raster_height
            print(f"    {_dim(f'raster: {w}x{h} pixels')}")

    # Summary line
    if result.passed:
        if result.violations:
            # Warnings present but no errors
            warn_count = len(result.violations)
            print(
                f"\n  {_green('passed')} "
                f"{_yellow(f'{warn_count} warning' + ('s' if warn_count != 1 else ''))} "
                f"{_dim(f'({result.elapsed_ms:.1f}ms)')}"
            )
        else:
            status = _green("passed") if has_tolerances else _green("done")
            print(f"\n  {status} {_dim(f'({result.elapsed_ms:.1f}ms)')}")
    else:
        errors = sum(1 for v in result.violations if v.severity == "error")
        warnings = sum(1 for v in result.violations if v.severity == "warning")
        parts = []
        if errors:
            parts.append(f"{errors} error{'s' if errors != 1 else ''}")
        if warnings:
            parts.append(f"{warnings} warning{'s' if warnings != 1 else ''}")
        summary = ", ".join(parts)
        count = len(result.violations)
        print(
            f"\n  {_red(f'{count} violation' + ('s' if count != 1 else ''))} "
            f"({summary}) {_dim(f'in {result.elapsed_ms:.1f}ms')}"
        )

    return result.passed


def dfm_design(
    design: str,
    config: str | None = None,
    verbose: bool = False,
    gds_output: str | None = None,
):
    """Run DFM prediction on a design."""
    try:
        result, file_path, has_tol, cell = _run_dfm_check(design, config)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except ValueError as e:
        print(f"Error in DFM config: {e}")
        sys.exit(1)
    passed = _print_dfm_result(result, file_path, verbose, has_tolerances=has_tol)

    # Write GDS with predicted polygons if requested
    if gds_output is not None:
        from rosette import add_dfm_predictions, write_gds

        add_dfm_predictions(cell, result)
        write_gds(gds_output, cell, quiet=False, verbose=verbose)
        print(f"\n  {_green('wrote')} {gds_output} (predicted on datatype +100)")

    if not passed:
        sys.exit(1)


def _run_checks_check(
    design_spec: str,
    config_path: str | None = None,
    cell=None,
    file_path: Path | None = None,
) -> tuple:
    """Run design checks on a design and return (result, file_path).

    Loads the design (unless cell/file_path are provided), loads checks
    config from rosette.toml, and runs all checks (connectivity + bend radius).
    """
    from rosette import load_checks_config, run_checks

    # Load design if not provided
    if cell is None:
        cell, file_path, _ = load_design(design_spec)

    # Load config (returns defaults if no [checks] section)
    checks_config = load_checks_config(config_path)

    # Run checks (Rust engine)
    result = run_checks(cell, checks_config)
    return result, file_path


def _print_checks_result(result, file_path: Path, verbose: bool = False) -> bool:
    """Print design check results. Returns True if passed."""
    # Header with stats
    stats_parts = [f"{result.ports_checked} ports", f"{result.connections_found} connections"]
    if result.bends_checked > 0:
        stats_parts.append(f"{result.bends_checked} bends")
    print(f"{_bold('checks')}  {file_path}  {_dim(', '.join(stats_parts))}")

    if result.passed:
        print(f"\n  {_green('passed')} {_dim(f'({result.elapsed_ms:.1f}ms)')}")
        return True

    # Print violations
    print()
    errors = 0
    warnings = 0
    for v in result.violations:
        if v.severity == "error":
            errors += 1
            label = _red("FAIL")
        else:
            warnings += 1
            label = _yellow("WARN")

        vtype = v.violation_type
        path_str = v.cell_path or "top"

        if v.partner_name is not None:
            partner_str = f" \u2192 {v.partner_name}"
            if v.partner_path:
                partner_str += f" on {v.partner_path}"
        else:
            partner_str = ""

        print(f"  {label}  {_bold(vtype)} {v.name} on {path_str}{partner_str}: {v.message}")

        if verbose:
            bbox = v.bbox
            print(
                f"        {_dim(f'at ({bbox[0][0]:.3f}, {bbox[0][1]:.3f})')}"
                f" {_dim(f'to ({bbox[1][0]:.3f}, {bbox[1][1]:.3f})')}"
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
        f"\n  {_red(f'{count} violation' + ('s' if count != 1 else ''))} "
        f"({summary}) {_dim(f'in {result.elapsed_ms:.1f}ms')}"
    )
    return False


def check_design(
    design: str,
    config: str | None = None,
    verbose: bool = False,
    include_dfm: bool = False,
):
    """Run all checks on a design.

    Runs DRC and design checks (connectivity + bend radius).
    DFM prediction is only included when --include-dfm is passed.
    """
    all_passed = True

    # Load the design once — shared by all checks
    cell, file_path, _ = load_design(design)

    # DRC
    from rosette import load_drc_rules, run_drc

    try:
        rules = load_drc_rules(config)
        result = run_drc(cell, rules)
        passed = _print_drc_result(result, file_path, verbose)
        if not passed:
            all_passed = False
    except FileNotFoundError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except ValueError as e:
        print(f"Error in DRC config: {e}")
        sys.exit(1)

    # DFM (opt-in via --include-dfm flag)
    if include_dfm:
        try:
            dfm_result, _, has_tol, _ = _run_dfm_check(
                design, config, cell=cell, file_path=file_path
            )
            print()  # Separator between DRC and DFM output
            dfm_passed = _print_dfm_result(dfm_result, file_path, verbose, has_tolerances=has_tol)
            if not dfm_passed:
                all_passed = False
        except FileNotFoundError:
            print(
                f"\n{_yellow('Warning: --include-dfm specified but no [dfm] section in rosette.toml')}"
            )
        except ValueError as e:
            print(f"\n{_yellow(f'Warning: DFM config error: {e}')}")

    # Future checks would go here:
    # connectivity, LVS, etc.

    if not all_passed:
        sys.exit(1)


def build_design(
    design: str,
    output_dir: str,
    verbose: bool = False,
    check: bool = False,
    config: str | None = None,
):
    """Build a design to GDS using the 'design' convention."""
    from rosette import write_gds

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Load design using convention
    cell, file_path, _ = load_design(design)

    # Run DRC before building if --check is set
    if check:
        from rosette import load_drc_rules, run_drc

        try:
            rules = load_drc_rules(config)
            result = run_drc(cell, rules)
            _print_drc_result(result, file_path, verbose)
            print()  # blank line before next section
        except FileNotFoundError:
            print(_yellow("Warning: no rosette.toml found, skipping DRC"))
            print()
        except ValueError as e:
            print(_yellow(f"Warning: invalid DRC config: {e}"))
            print()

        # Design checks (connectivity + bend radius)
        try:
            checks_result, _ = _run_checks_check(design, config, cell=cell, file_path=file_path)
            checks_passed = _print_checks_result(checks_result, file_path, verbose)
            if not checks_passed:
                print(_yellow("Warning: check issues found, building anyway"))
            print()
        except (FileNotFoundError, ValueError):
            pass  # No checks config — skip silently

    # Output filename from design file name
    gds_output = output_path / f"{file_path.stem}.gds"

    # Set verbose mode
    if verbose:
        os.environ["ROSETTE_VERBOSE"] = "1"

    # Write GDS
    import time

    t0 = time.perf_counter()
    try:
        write_gds(str(gds_output), cell, quiet=False, verbose=verbose)
    except Exception as e:
        print(f"{_red('Error')} writing {gds_output}: {e}")
        sys.exit(1)
    elapsed = (time.perf_counter() - t0) * 1000
    print(f"{_green('ok')} {gds_output} {_dim(f'({elapsed:.0f}ms)')}")


if __name__ == "__main__":
    main()
