"""Rosette CLI - Photonic layout tool.

Commands:
    rosette init [path]      Initialize rosette (in cwd, or a new dir at [path])
    rosette build <file>     Build a design to GDS
    rosette check <file>     Run all checks (DRC, ...)
    rosette drc <file>       Run DRC only
    rosette serve [file]     Start dev server with live preview
"""

from __future__ import annotations

import argparse
import logging
import os
import shutil
import subprocess
import sys
import tomllib
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from rosette import BBox, Cell, ChecksResult, DfmResult, DrcResult

log = logging.getLogger(__name__)

# Template directory location (relative to this file)
TEMPLATES_DIR = Path(__file__).parent / "templates"
# Components directory location (relative to this file)
COMPONENTS_DIR = Path(__file__).parent / "components"

# Marker comments for framework-managed sections in agent files
_MARKER_BEGIN = "<!-- BEGIN:rosette-agent-rules -->"
_MARKER_END = "<!-- END:rosette-agent-rules -->"

# Harness adapters: map each supported AI tool family to where its files live.
# The instruction body (templates/<t>/agent-rules.md.template) and skills
# (templates/<t>/skills/) are stored once per template, harness-neutral. Each
# adapter projects them into the filenames/directories that tool family reads.
#   - instructions: the project-root instruction filename the harness loads
#   - skills_dir:   the directory the harness scans for <skill>/SKILL.md
#   - aliases:      tool names that resolve to this harness (de-dupe identical
#                   conventions instead of writing the same files twice)
#
# Most modern agents converged on AGENTS.md + .agents/skills/ as the
# vendor-neutral standard (OpenCode, Codex, Cursor, Gemini CLI, Copilot,
# Windsurf, Aider all read it), so they share the single "agents" harness.
# Claude Code is the lone diverger (CLAUDE.md + .claude/skills/).
# Sources: agents.md, agentskills.io, developers.openai.com/codex,
# cursor.com/docs/skills, code.claude.com/docs/en/skills,
# opencode.ai/docs/skills.


class _Harness:
    __slots__ = ("aliases", "description", "instructions", "key", "label", "skills_dir")

    def __init__(
        self,
        key: str,
        label: str,
        instructions: str,
        skills_dir: str,
        description: str,
        aliases: tuple[str, ...] = (),
    ):
        self.key = key
        self.label = label
        self.instructions = instructions
        self.skills_dir = skills_dir
        self.description = description
        self.aliases = aliases


HARNESSES: dict[str, _Harness] = {
    "agents": _Harness(
        "agents",
        "AGENTS.md standard",
        "AGENTS.md",
        ".agents/skills",
        "OpenCode, Codex, Cursor, Gemini, Copilot, …",
        aliases=("opencode", "codex", "cursor", "gemini", "copilot"),
    ),
    "claude": _Harness(
        "claude",
        "Claude Code",
        "CLAUDE.md",
        ".claude/skills",
        "Anthropic Claude Code",
    ),
}

# Resolve a user-supplied tool name (including legacy aliases like "opencode")
# to a canonical harness key.
_HARNESS_ALIASES: dict[str, str] = {
    alias: h.key for h in HARNESSES.values() for alias in (h.key, *h.aliases)
}


def _resolve_harness(tool: str) -> str | None:
    """Map a tool name (or alias) to a canonical harness key, or None."""
    return _HARNESS_ALIASES.get(tool)


def _parse_tool_spec(tool: str | None) -> list[str]:
    """Resolve a --tool spec into a de-duplicated list of harness keys.

    Accepts None / "none" (-> []), a single tool/alias, or a comma-separated
    list (e.g. "agents,claude" or "opencode,claude"). Exits with an error on an
    unknown tool name.
    """
    if tool is None or tool.strip().lower() == "none":
        return []
    keys: list[str] = []
    for raw in tool.split(","):
        name = raw.strip()
        if not name:
            continue
        key = _resolve_harness(name)
        if key is None:
            valid = sorted({*HARNESSES, *_HARNESS_ALIASES})
            print(f"Error: Unknown tool: {name}")
            print(f"Valid options: {', '.join(valid)}, none")
            sys.exit(1)
        if key not in keys:
            keys.append(key)
    return keys


# Source filename (under each template dir) holding the canonical instruction
# body. Projected to each harness's instruction filename at init/update time.
_AGENT_RULES_TEMPLATE = "agent-rules.md.template"


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
    template_dir: Path,
    project_dir: Path,
    name: str,
    harnesses: list[str] | None = None,
):
    """Apply a template to the project directory.

    The agent instruction body and skills are stored once per template
    (``agent-rules.md.template`` and ``skills/``), harness-neutral. They are
    projected into each selected harness's filenames/directories via the
    ``HARNESSES`` adapter map -- so an AGENTS.md-standard user gets ``AGENTS.md``
    + ``.agents/skills/`` and a Claude user gets ``CLAUDE.md`` +
    ``.claude/skills/`` from the same source.

    - ``agent-rules.md.template`` and ``skills/`` are handled by the harness
      adapter (skipped here, installed by ``_install_harness``)
    - Files ending in ``.template`` have ``{{name}}`` replaced and the extension
      stripped
    - File named ``gitignore``: entries are appended to existing ``.gitignore``
    - All other files are copied as-is
    """
    for src_path in template_dir.rglob("*"):
        if src_path.is_dir():
            continue

        # Compute relative path and destination
        rel_path = src_path.relative_to(template_dir)
        rel_parts = rel_path.parts

        # Harness-managed sources are installed separately, per selected tool.
        if rel_parts[0] == "skills" or rel_parts[-1] == _AGENT_RULES_TEMPLATE:
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

    # Project the harness-neutral instruction body + skills into each selected
    # tool's locations.
    for key in harnesses or []:
        _install_harness(template_dir, project_dir, name, key)


def _render_agent_rules(template_dir: Path, name: str) -> str | None:
    """Read the canonical instruction body and substitute {{name}}.

    Returns None if the template has no agent-rules file.
    """
    src = template_dir / _AGENT_RULES_TEMPLATE
    if not src.exists():
        return None
    return src.read_text().replace("{{name}}", name)


def _install_skills(template_dir: Path, skills_dest: Path):
    """Copy the template's harness-neutral skills into ``skills_dest``.

    Each ``skills/<skill>/`` directory is copied verbatim. No-op if the
    template ships no skills.
    """
    skills_src = template_dir / "skills"
    if not skills_src.is_dir():
        return
    for skill_dir in sorted(skills_src.iterdir()):
        if not skill_dir.is_dir():
            continue
        shutil.copytree(
            skill_dir,
            skills_dest / skill_dir.name,
            dirs_exist_ok=True,
            ignore=_COMPONENT_COPY_IGNORE,
        )


def _install_harness(template_dir: Path, project_dir: Path, name: str, tool: str):
    """Write instruction file + skills for a single harness."""
    harness = HARNESSES[tool]
    rules = _render_agent_rules(template_dir, name)
    if rules is not None:
        (project_dir / harness.instructions).write_text(rules)
    _install_skills(template_dir, project_dir / harness.skills_dir)


def _append_gitignore(src_path: Path, dest_path: Path):
    """Merge the template's .gitignore into the project's, avoiding duplicates.

    Preserves the template's own section headers (e.g. ``# Python / uv``,
    ``# Rosette``) rather than re-labeling every entry as Rosette. When the
    destination already exists, only patterns not already present are appended,
    keeping their surrounding comment lines for context.
    """
    src_lines = src_path.read_text().splitlines()

    if not dest_path.exists():
        # Fresh file (e.g. after `uv init --bare`): copy the template verbatim.
        dest_path.write_text(src_path.read_text())
        return

    existing = dest_path.read_text()
    existing_patterns = {
        line.strip()
        for line in existing.splitlines()
        if line.strip() and not line.strip().startswith("#")
    }

    # Split the template into sections delimited by blank lines, then keep only
    # the sections that still contribute at least one new pattern. This drops
    # whole headers (e.g. "# Python / uv") when uv already covered them, and
    # preserves the template's own labels for the sections we do add.
    sections: list[list[str]] = []
    current: list[str] = []
    for line in src_lines:
        if line.strip() == "":
            if current:
                sections.append(current)
                current = []
        else:
            current.append(line)
    if current:
        sections.append(current)

    blocks: list[str] = []
    for section in sections:
        kept = [
            line
            for line in section
            if line.strip().startswith("#") or line.strip() not in existing_patterns
        ]
        # Only keep sections that contain at least one (new) pattern line.
        if any(ln.strip() and not ln.strip().startswith("#") for ln in kept):
            blocks.append("\n".join(kept))

    if not blocks:
        return

    if existing and not existing.endswith("\n"):
        existing += "\n"
    existing += "\n" + "\n\n".join(blocks) + "\n"
    dest_path.write_text(existing)


# What `_copy_components` ships into user projects (non-minimal):
#   - __init__.py         (the public re-exports + conventions docstring)
#   - _utils.py           (safe_cell_name helper, stable API for component authors)
#   - _curves.py          (shared S-bend math, stable API for component authors)
#   - All public component modules (bragg_grating.py, crossing.py, mmi.py, ...)
# What it deliberately skips:
#   - __pycache__/ and *.pyc         (build artifacts; see _COMPONENT_COPY_IGNORE)
#   - Tests (components/ has none today; kept here for future proofing)
# In minimal mode (blank template) only the allow-list below is kept so the
# `from components import ...` re-export surface exists without pre-loading
# the full stdlib catalog. Non-minimal mode ships everything that survives
# `_COMPONENT_COPY_IGNORE`.
_MINIMAL_COMPONENT_FILES = ("__init__.py", "_utils.py", "_curves.py")
_COMPONENT_COPY_IGNORE = shutil.ignore_patterns("__pycache__", "*.pyc")


def _rewrite_component_imports(src: str) -> str:
    """Rewrite ``rosette.components.*`` imports to package-relative form.

    The stdlib components package uses absolute imports like
    ``from rosette.components._utils import safe_cell_name`` and
    ``from rosette.components.mmi import mmi`` (in ``__init__.py``).
    If those are copied verbatim into a user's ``components/`` package,
    ``from components import mmi`` still resolves against the
    installed ``rosette.components`` package -- so local edits to
    ``components/mmi.py`` are silently ignored. That defeats the whole
    shadcn-style "copy into the project and edit" workflow.

    This rewrites only **top-level** (column-zero) ``from
    rosette.components[.X] import ...`` statements to their relative
    form. Indented occurrences (docstring examples that teach users the
    public import path against the installed package) are left alone.

    Leaves ``from rosette import ...`` -- the core package -- untouched.

    Supported import forms (everything the current stdlib uses):

    * ``from rosette.components import X [as Y][, ...]``
    * ``from rosette.components.X import Y [as Z][, ...]``

    Explicitly **unsupported** column-zero forms (would produce a
    still-shadowed import if present):

    * ``import rosette.components`` / ``import rosette.components.X``
    * Multi-line ``from rosette.components... import (\\n    ...\\n)``
      where the module path is on a continuation line.

    If any of these ever show up in the stdlib components package, this
    function raises ``RuntimeError`` so that a broken ``rosette init``
    fails loudly at dev time rather than silently shipping a package
    whose user edits are ignored.
    """
    out_lines: list[str] = []
    for line in src.splitlines(keepends=True):
        # Only rewrite lines that start at column 0. Docstring examples
        # are always indented inside triple-quoted strings, so this
        # cleanly separates real imports from prose.
        if line.startswith("from rosette.components."):
            # e.g. "from rosette.components._utils import X"
            #  ->  "from ._utils import X"
            out_lines.append("from ." + line[len("from rosette.components.") :])
        elif line.startswith("from rosette.components import "):
            # e.g. "from rosette.components import mmi"
            #  ->  "from . import mmi"
            out_lines.append("from . import " + line[len("from rosette.components import ") :])
        elif line.startswith("import rosette.components"):
            # Not currently used in the stdlib. If someone adds this form,
            # the rewritten project would still defer to the installed
            # package. Fail loudly so the issue is fixed at the source.
            raise RuntimeError(
                "rosette.components contains an unsupported import form "
                f"(found `{line.rstrip()}`). Extend _rewrite_component_imports "
                "in cli.py to handle `import rosette.components[.X]`, or "
                "change the source to use `from rosette.components[.X] import ...` "
                "instead."
            )
        else:
            out_lines.append(line)
    return "".join(out_lines)


# Trimmed __init__.py written for blank-template projects. Preserves the
# conventions docstring but drops the component re-exports so that a missing
# module never causes a `ModuleNotFoundError` at import time.
_MINIMAL_COMPONENTS_INIT = '''\
"""Photonic components (minimal scaffold).

This ``components/`` package was created by ``rosette init --template blank``
and ships only the shared internals (``_utils``, ``_curves``). Add component
modules one at a time and re-export them from this file, for example::

    from components.my_sbend import my_sbend

    __all__ = ["my_sbend"]

For the full stdlib catalog (mmi, ring, grating_coupler, bragg_grating, ...),
either re-run ``rosette init`` with ``--template generic`` or copy files from
``rosette/components/`` in the rosette source tree.

See ``rosette.components`` for the authoring conventions (units, coordinate
system, port directions, path length, cell names).
"""

__all__: list[str] = []
'''


def _copy_components(project_dir: Path, *, minimal: bool = False) -> None:
    """Copy the components directory to the project for user customization.

    The stdlib ``rosette/components/`` package is copied into
    ``<project>/components/`` (shadcn-style), with absolute
    ``rosette.components.*`` imports rewritten to package-relative form
    (see ``_rewrite_component_imports``) so local edits in the user's
    project actually take effect. See ``_MINIMAL_COMPONENT_FILES`` and
    ``_COMPONENT_COPY_IGNORE`` above for what is shipped vs. skipped.

    Parameters
    ----------
    project_dir:
        Target project root. ``components/`` will be created inside it.
    minimal:
        If ``True`` (blank template), ship only the package scaffold
        (``__init__.py``, ``_utils.py``, ``_curves.py``) and rewrite
        ``__init__.py`` to drop the stdlib re-exports. Users then add
        components one file at a time. If ``False`` (generic and other
        non-blank templates), copy the full stdlib catalog.
    """
    import tempfile

    if not COMPONENTS_DIR.exists():
        print("Warning: Components directory not found, skipping")
        return

    target_dir = project_dir / "components"

    # Copy to temp location first, then move atomically.
    # This prevents data loss if copytree fails mid-operation.
    with tempfile.TemporaryDirectory(dir=project_dir) as tmp:
        tmp_target = Path(tmp) / "components"
        shutil.copytree(COMPONENTS_DIR, tmp_target, ignore=_COMPONENT_COPY_IGNORE)

        if minimal:
            # Keep only the scaffolding files; drop every component module.
            for entry in tmp_target.iterdir():
                if entry.name in _MINIMAL_COMPONENT_FILES:
                    continue
                if entry.is_dir():
                    shutil.rmtree(entry)
                else:
                    entry.unlink()
            # Replace __init__.py with a scaffold that doesn't import anything
            # the user hasn't added yet.
            (tmp_target / "__init__.py").write_text(_MINIMAL_COMPONENTS_INIT)

        # Rewrite absolute `rosette.components.*` imports to package-relative
        # form so the copied package is self-contained: edits to
        # `components/mmi.py` in a user project actually take effect when
        # they `from components import mmi`. Without this step the
        # re-exports in `__init__.py` (and the `_utils`/`_curves` imports in
        # every component module) still resolve against the installed
        # `rosette.components` package. See `_rewrite_component_imports`.
        for py_file in tmp_target.rglob("*.py"):
            original = py_file.read_text()
            rewritten = _rewrite_component_imports(original)
            if rewritten != original:
                py_file.write_text(rewritten)

        # Only remove existing after successful copy
        if target_dir.exists():
            shutil.rmtree(target_dir)

        # Move from temp to final location
        shutil.move(str(tmp_target), str(target_dir))

    # Count files copied
    py_files = list(target_dir.glob("*.py"))
    label = "scaffold" if minimal else "component"
    print(f"Copied {len(py_files)} {label} files to components/")


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


def main() -> None:
    """Main CLI entry point."""
    from rosette import __version__

    parser = argparse.ArgumentParser(
        prog="rosette",
        description="Photonic layout tool for creating and building GDS designs",
    )
    parser.add_argument("-V", "--version", action="version", version=f"rosette {__version__}")
    subparsers = parser.add_subparsers(dest="command")

    # init command - initializes in a uv project (current dir or a new path)
    init_parser = subparsers.add_parser(
        "init", help="Initialize rosette in the current dir or a new project directory"
    )
    init_parser.add_argument(
        "path",
        nargs="?",
        default=None,
        help="Directory to create the project in (created if needed). Defaults to current dir.",
    )
    init_parser.add_argument(
        "-n",
        "--name",
        default=None,
        help="Project name (defaults to the project directory name). Interactive if omitted.",
    )
    init_parser.add_argument(
        "-t",
        "--template",
        default=None,
        help="Project template to use (blank, generic). Interactive if omitted.",
    )
    init_parser.add_argument(
        "--tool",
        default=None,
        help=(
            "AI tool(s) to configure, comma-separated (e.g. 'agents', 'claude', "
            "'agents,claude', or 'none'). Aliases like 'opencode'/'codex'/'cursor' "
            "map to the AGENTS.md standard. Interactive if omitted."
        ),
    )
    init_parser.add_argument(
        "-y",
        "--yes",
        action="store_true",
        help="Skip confirmation when bootstrapping a uv project (uv init + uv add librosette).",
    )
    init_parser.add_argument(
        "--no-git",
        dest="git",
        action="store_false",
        help="Don't run `git init` when bootstrapping a new project.",
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

    # shot command - render design to PNG
    shot_parser = subparsers.add_parser("shot", help="Render a design region to a PNG image")
    shot_parser.add_argument("design", help="Design file (path or path:target)")
    shot_parser.add_argument(
        "-o",
        "--out",
        default=None,
        help="Output PNG path (default: <design-stem>.png)",
    )
    shot_parser.add_argument(
        "--cell",
        default=None,
        help="Render only this cell (and its descendants) instead of the top cell",
    )
    shot_parser.add_argument(
        "--bbox",
        default=None,
        metavar="XMIN,YMIN,XMAX,YMAX",
        help="Render only this region, in microns (default: full extent)",
    )
    shot_parser.add_argument(
        "--layer",
        default=None,
        metavar="L/D[,L/D...]",
        help="Restrict to specific layers as 'number/datatype' pairs",
    )
    shot_parser.add_argument(
        "--width", type=int, default=1024, help="Output width in pixels (default: 1024)"
    )
    shot_parser.add_argument(
        "--height",
        type=int,
        default=None,
        help="Output height in pixels (default: derived from aspect)",
    )
    shot_parser.add_argument(
        "--pad",
        type=float,
        default=0.1,
        help="Fractional padding around target bbox (default: 0.1)",
    )
    shot_parser.add_argument(
        "--bg",
        default="#1a1a1a",
        help="Background color #RRGGBB or #RRGGBBAA (default: #1a1a1a)",
    )
    shot_parser.add_argument(
        "--fill-alpha",
        type=int,
        default=178,
        help="Layer fill alpha 0-255 (default: 178 ~70%%)",
    )
    shot_parser.add_argument(
        "--no-sidecar",
        action="store_true",
        help="Skip writing the <out>.json sidecar with view metadata",
    )
    shot_parser.add_argument(
        "--retain",
        type=int,
        default=None,
        metavar="N",
        help="Keep only the N newest snapshots in the default snapshots dir "
        "(default: 20, or [snapshots] retain in rosette.toml). "
        "0 disables pruning. Ignored when --out is set.",
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
        init_project(
            template=args.template,
            tool=args.tool,
            name=args.name,
            assume_yes=args.yes,
            git=args.git,
            path=args.path,
        )
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
    elif args.command == "shot":
        shot_design(
            design=args.design,
            out=args.out,
            cell=args.cell,
            bbox_str=args.bbox,
            layer_str=args.layer,
            width=args.width,
            height=args.height,
            pad=args.pad,
            bg=args.bg,
            fill_alpha=args.fill_alpha,
            sidecar=not args.no_sidecar,
            retain=args.retain,
        )


def _interactive_select(
    header: str,
    options: list[tuple[str, str, str]],
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
    options: list[tuple[str, str, str]],
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


def _sanitize_project_name(raw: str, fallback: str) -> str:
    """Normalize a project name, falling back to ``fallback`` if unusable.

    The name is written into ``rosette.toml`` as a TOML string and used as a
    markdown heading, so a double quote would corrupt the config. Strip
    surrounding whitespace, drop double quotes, and fall back when empty.
    """
    name = raw.strip().replace('"', "")
    return name or fallback


def _select_name_interactive(default: str) -> str:
    """Prompt for a project name, defaulting to ``default`` on empty input.

    Non-interactive contexts (no TTY) accept the default without prompting.
    """
    if not sys.stdin.isatty():
        return default
    # Make it explicit that Enter accepts the default. Bold styling matches the
    # radio selectors' "enter confirm" hints and is gated on _use_color().
    print(f"Project name [{_bold(default)}] ({_bold('enter')} to accept, or type a new name):")
    try:
        raw = input("> ")
    except EOFError:
        return default
    return _sanitize_project_name(raw, default)


def _select_tool_interactive() -> str | None:
    """Interactive single-select for AI tool configuration.

    Uses arrow keys + enter in TTY mode, falls back to numbered prompt.
    Returns a --tool spec string (e.g. "agents", "claude") or "none". The
    default in non-TTY contexts is the AGENTS.md standard.

    Note: the menu offers one harness at a time. Users who want files for
    multiple harnesses can pass a comma-separated ``--tool`` (e.g.
    ``--tool agents,claude``).
    """
    options = [(h.key, h.label, h.description) for h in HARNESSES.values()]
    options.append(("none", "None", "Skip AI tool setup"))
    preamble = [
        "Rosette sets up AI agent config so your editor knows how to work",
        "with photonic designs. Pick which tool you use:",
    ]

    default = next(iter(HARNESSES))  # AGENTS.md standard
    if not sys.stdin.isatty():
        return default

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


def _print_manual_setup_recipe(*, has_uv: bool):
    """Print the manual project-setup steps the user can run themselves.

    When uv is available we lead with the uv steps but still show the pip
    alternative (e.g. the user declined the uv bootstrap because they prefer
    pip). When uv is absent we only show the pip + venv flow.
    """
    print("Error: No pyproject.toml found. Initialize your project first:")
    print()
    if has_uv:
        print("With uv:")
        print("  uv init --bare")
        print("  uv add librosette")
        print("  uv run rosette init")
        print()
        print("Or with pip:")
    print("  python -m venv .venv")
    print("  source .venv/bin/activate   # Windows: .venv\\Scripts\\activate")
    print("  pip install librosette")
    print("  rosette init")


def _is_inside_git_repo(project_dir: Path) -> bool:
    """Return True if ``project_dir`` is already inside a git work tree.

    Walks up the directory tree (like git/uv do) so we don't nest a new repo
    inside an existing one. Falls back to a local ``.git`` check if the git
    invocation fails for any reason.
    """
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--is-inside-work-tree"],
            cwd=project_dir,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
        )
        return result.stdout.strip() == "true"
    except (OSError, subprocess.CalledProcessError):
        return (project_dir / ".git").exists()


def _maybe_git_init(project_dir: Path):
    """Initialize a git repo in ``project_dir`` unless one already exists.

    Best-effort: skips silently if git is unavailable or the directory is
    already inside a git repo (including a parent repo, to avoid nesting).
    Failures are non-fatal — a missing repo shouldn't block project
    scaffolding.
    """
    if shutil.which("git") is None:
        return
    if _is_inside_git_repo(project_dir):
        return
    cmd = ["git", "init"]
    print(f"$ {' '.join(cmd)}")
    try:
        subprocess.run(
            cmd,
            cwd=project_dir,
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except (OSError, subprocess.CalledProcessError):
        # Non-fatal: the project is still usable without a git repo.
        print("Warning: `git init` failed; skipping repo initialization.")


def _bootstrap_uv_project(project_dir: Path, *, assume_yes: bool, git: bool = True) -> bool:
    """Set up a uv project in ``project_dir`` so ``rosette init`` can proceed.

    Runs ``uv init --bare`` followed by ``uv add librosette`` and, unless
    ``git`` is False, ``git init`` (skipped if git is missing or the dir is
    already a repo). Returns True on success. On any failure (uv missing,
    declined prompt, subprocess error) prints guidance and returns False — the
    caller then exits.

    Behavior:
    - uv absent: print the pip-based manual recipe, return False.
    - uv present, interactive TTY: prompt for confirmation (default yes).
    - uv present, non-TTY: only proceed when ``assume_yes`` is set.
    """
    if shutil.which("uv") is None:
        _print_manual_setup_recipe(has_uv=False)
        return False

    if not assume_yes:
        if not sys.stdin.isatty():
            # Non-interactive and not explicitly confirmed: don't guess.
            _print_manual_setup_recipe(has_uv=True)
            return False
        print("No uv project found here. Set one up with uv now?")
        try:
            answer = input(f"Proceed? [{_bold('Y')}/n] ").strip().lower()
        except EOFError:
            answer = ""
        if answer in ("n", "no"):
            _print_manual_setup_recipe(has_uv=True)
            return False

    for cmd in (["uv", "init", "--bare"], ["uv", "add", "librosette"]):
        print(f"$ {' '.join(cmd)}")
        try:
            subprocess.run(cmd, cwd=project_dir, check=True)
        except (OSError, subprocess.CalledProcessError) as exc:
            print(f"Error: `{' '.join(cmd)}` failed: {exc}")
            print()
            print("Set up the project manually, then re-run `rosette init`:")
            _print_manual_setup_recipe(has_uv=True)
            return False

    if git:
        _maybe_git_init(project_dir)

    return True


def init_project(
    template: str | None = None,
    tool: str | None = None,
    name: str | None = None,
    assume_yes: bool = False,
    git: bool = True,
    path: str | None = None,
):
    """Initialize rosette in a uv project.

    With no ``path`` the current directory is used. When ``path`` is given the
    project is created/used at ``cwd / path`` (the directory is created if
    needed), mirroring ``uv init <path>`` and ``git init <dir>``.

    If no ``pyproject.toml`` exists yet, offers to bootstrap one with uv
    (``uv init --bare`` + ``uv add librosette``, plus ``git init`` unless
    ``git`` is False) when uv is available; see ``_bootstrap_uv_project``. Pass
    ``assume_yes`` to skip the prompt.
    """
    if path is not None:
        project_dir = Path.cwd() / path
        project_dir.mkdir(parents=True, exist_ok=True)
    else:
        project_dir = Path.cwd()
    default_name = project_dir.name

    # Guard before any bootstrap side effects: a directory that's already a
    # rosette project shouldn't be re-initialized.
    if (project_dir / "rosette.toml").exists():
        print("Error: rosette.toml already exists (project already initialized)")
        sys.exit(1)

    # Pre-flight: ensure we're inside a uv/Python project, offering to set one
    # up with uv when it's missing.
    if not (project_dir / "pyproject.toml").exists():
        if not _bootstrap_uv_project(project_dir, assume_yes=assume_yes, git=git):
            sys.exit(1)

    # Resolve project name: explicit flag wins; a positional path already
    # expresses intent so its basename is used without prompting; otherwise
    # prompt (defaulting to the directory name).
    if name is not None:
        name = _sanitize_project_name(name, default_name)
    elif path is not None:
        name = _sanitize_project_name(default_name, default_name)
    else:
        name = _select_name_interactive(default_name)

    # Select template if not specified
    if template is None:
        template = _select_template_interactive()

    # Select AI tool if not specified
    if tool is None:
        tool = _select_tool_interactive()

    # Resolve the tool spec (may be comma-separated; "none" disables) into a
    # de-duplicated list of canonical harness keys.
    harness_keys = _parse_tool_spec(tool)

    # Load and apply template
    template_dir = _get_template_dir(template)
    if template_dir is None:
        available = _list_templates()
        print(f"Error: Template '{template}' not found")
        print(f"Available templates: {', '.join(available)}")
        sys.exit(1)

    _apply_template(template_dir, project_dir, name, harnesses=harness_keys)

    # Create directories (not part of template)
    (project_dir / "designs").mkdir(exist_ok=True)
    (project_dir / "output").mkdir(exist_ok=True)

    # Copy components for user customization (shadcn-style).
    # Blank template gets a minimal scaffold (just __init__.py + shared
    # internals) so `from components import ...` doesn't ModuleNotFoundError;
    # all other templates get the full stdlib catalog.
    _copy_components(project_dir, minimal=(template == "blank"))

    # Copy API stub for agent reference
    _copy_api_stub(project_dir / ".rosette")

    tool_label = ", ".join(harness_keys) if harness_keys else "none"
    print(f"Initialized rosette project '{name}' (template: {template}, tool: {tool_label})")
    print()
    print("Next steps:")
    if path is not None:
        print(f"  cd {path}")
    print("  Create a design in designs/ and build it:")
    print("  uv run rosette build designs/<name>.py")
    print()
    if harness_keys:
        print("  Or use an AI agent:")
        for key in harness_keys:
            harness = HARNESSES[key]
            print(f"  # reads {harness.instructions} ({harness.description})")


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
    - Instruction files (AGENTS.md, CLAUDE.md, ...): only the section between
      BEGIN/END markers is replaced, preserving any user content outside the
      markers. The body is stored once per template and projected to each
      configured harness via the HARNESSES adapter.
    - Skills: each configured harness's skills dir (.agents/skills,
      .claude/skills, ...) is refreshed from the template's canonical skills/
    - .rosette/api.pyi: fully replaced with latest API stub
    - Only updates files for tools that are already configured
    - User-owned files are never touched:
      - designs/ - your design files
      - components/ - your customizable components (shadcn-style)
      - rosette.toml - your project config

    Components are intentionally NOT refreshed here. The shadcn-style copy
    in ``components/`` is yours to edit, and ``rosette update`` must not
    clobber local changes. To pull a newer version of a specific stdlib
    component into an existing project, diff your local copy against
    ``rosette/components/<name>.py`` in the installed rosette package and
    merge the changes manually (or delete your copy and re-run the
    relevant parts of ``rosette init`` in a scratch dir to see what's new).
    A future release may add ``rosette update --components=check`` and
    ``--components=<name>`` to automate this; see ROS-530.
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

    # Detect which harnesses are configured. A harness counts as configured if
    # either its instruction file or its skills dir is present, so a deleted
    # instruction file (or skills dir) is restored rather than silently dropped.
    tools = [
        t
        for t, h in HARNESSES.items()
        if (project_dir / h.instructions).exists() or (project_dir / h.skills_dir).is_dir()
    ]

    # Refresh non-harness template files (e.g. rosette.toml is user-owned and
    # skipped). The instruction body and skills are handled per-harness below.
    for template_file in template_dir.glob("*.template"):
        output_name = template_file.stem  # e.g. rosette.toml.template -> rosette.toml
        if output_name == "rosette.toml":
            continue  # user-owned
        if template_file.name == _AGENT_RULES_TEMPLATE:
            continue  # handled by the harness loop
        content = template_file.read_text().replace("{{name}}", name)
        (project_dir / output_name).write_text(content)

    # Refresh each configured harness: instruction file (marker-based, preserving
    # user content) + skills (each shipped skill dir is restored/overwritten from
    # the template; skills removed upstream are not pruned from the project).
    rules = _render_agent_rules(template_dir, name)
    for tool in tools:
        harness = HARNESSES[tool]
        if rules is not None:
            _update_agent_file(project_dir / harness.instructions, rules)
        _install_skills(template_dir, project_dir / harness.skills_dir)

    # Update API stub for agent reference
    _copy_api_stub(project_dir / ".rosette")

    tool_names = ", ".join(sorted(tools))
    print(f"Updated project to latest templates (tools: {tool_names})")


def load_design(path_spec: str) -> tuple[Cell, Path, str]:
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
    from rosette._design import load_design as _load_design

    return _load_design(path_spec)


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
) -> tuple[DrcResult, Path]:
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


def _print_drc_result(result: DrcResult, file_path: Path | None, verbose: bool = False) -> bool:
    """Print DRC results. Returns True if passed (no error-severity violations).

    Warnings (see ``DrcRules.warning_margin``) are shown but do not cause
    this function to return ``False``.
    """
    # Header
    print(
        f"{_bold('drc')}  {file_path}  "
        f"{_dim(f'{result.rules_checked} rules, {result.polygons_checked} polygons')}"
    )

    suppressed = result.suppressed_violations
    skipped = result.skipped_cells
    waived = result.waived_violations

    def _print_suppressed_line() -> None:
        if suppressed > 0:
            cell_word = "cell" if skipped == 1 else "cells"
            viol_word = "violation" if suppressed == 1 else "violations"
            print(
                f"  {_dim(f'{suppressed} {viol_word} suppressed across {skipped} trusted {cell_word} (drc_skip)')}"
            )
        if waived > 0:
            viol_word = "violation" if waived == 1 else "violations"
            print(f"  {_dim(f'{waived} {viol_word} waived by region (drc_waive_regions)')}")

    # No violations at all: clean pass.
    if not result.violations:
        print(f"\n  {_green('passed')} {_dim(f'({result.elapsed_ms:.1f}ms)')}")
        _print_suppressed_line()
        return True

    # Print violations (errors first visually via color, but in original order).
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

        # Append cell names when available
        cells_hint = ""
        if v.cell_name and v.cell_name2:
            if v.cell_name == v.cell_name2:
                cells_hint = _dim(f" (within '{v.cell_name}')")
            else:
                cells_hint = _dim(f" (between '{v.cell_name}' and '{v.cell_name2}')")

        print(f"  {label}  {_bold(name)} on {layer_str}: {v.message}{cells_hint}")

        if verbose:
            bbox = v.bbox
            print(
                f"        {_dim(f'at ({bbox[0][0]:.3f}, {bbox[0][1]:.3f})')}"
                f" {_dim(f'to ({bbox[1][0]:.3f}, {bbox[1][1]:.3f})')}"
            )

    # Warnings-only run: the overall check still passes.
    if result.passed:
        print(
            f"\n  {_green('passed')} "
            f"{_yellow(f'{warnings} warning' + ('s' if warnings != 1 else ''))} "
            f"{_dim(f'({result.elapsed_ms:.1f}ms)')}"
        )
        _print_suppressed_line()
        return True

    # Errors present (possibly with warnings).
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
    _print_suppressed_line()
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
    cell: Cell | None = None,
    file_path: Path | None = None,
) -> tuple[DfmResult, Path | None, bool, Cell]:
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
    result: DfmResult, file_path: Path | None, verbose: bool = False, has_tolerances: bool = False
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
    cell: Cell | None = None,
    file_path: Path | None = None,
) -> tuple[ChecksResult, Path | None]:
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


def _print_checks_result(
    result: ChecksResult, file_path: Path | None, verbose: bool = False
) -> bool:
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

    # Design checks (always runs — uses defaults if no [checks] section)
    try:
        checks_result, _ = _run_checks_check(design, config, cell=cell, file_path=file_path)
        print()  # Separator
        checks_passed = _print_checks_result(checks_result, file_path, verbose)
        if not checks_passed:
            all_passed = False
    except (FileNotFoundError, ValueError) as e:
        print(f"\n{_yellow(f'Warning: design checks failed: {e}')}")

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


def _parse_bbox_arg(s: str) -> BBox:
    """Parse '--bbox XMIN,YMIN,XMAX,YMAX' into a BBox."""
    from rosette import BBox, Point

    parts = s.split(",")
    if len(parts) != 4:
        raise ValueError(f"--bbox must be 'XMIN,YMIN,XMAX,YMAX' (got {len(parts)} parts: {s!r})")
    try:
        xmin, ymin, xmax, ymax = (float(p) for p in parts)
    except ValueError as e:
        raise ValueError(f"--bbox values must be numbers: {e}") from e
    if xmax <= xmin or ymax <= ymin:
        raise ValueError(f"--bbox max must be greater than min: got {xmin},{ymin},{xmax},{ymax}")
    return BBox(Point(xmin, ymin), Point(xmax, ymax))


def _parse_layers_arg(s: str) -> list[tuple[int, int]]:
    """Parse '--layer L/D[,L/D...]' into a list of (layer, datatype) tuples."""
    out: list[tuple[int, int]] = []
    for part in s.split(","):
        part = part.strip()
        if "/" not in part:
            raise ValueError(f"--layer entry must be 'number/datatype': got {part!r}")
        l_str, d_str = part.split("/", 1)
        try:
            out.append((int(l_str), int(d_str)))
        except ValueError as e:
            raise ValueError(f"--layer values must be ints: {e}") from e
    return out


_DEFAULT_RETAIN = 20


def _project_snapshot_dir() -> Path | None:
    """Project-local snapshots directory: `<project_root>/.rosette/snapshots/`.

    Returns None when no `rosette.toml` is found upward from cwd, signalling
    that the caller should fall back to writing next to the design file.
    """
    from rosette import _find_rosette_toml

    toml = _find_rosette_toml()
    if toml is None:
        return None
    return toml.parent / ".rosette" / "snapshots"


def _load_retain_config() -> int:
    """Read `[snapshots] retain = N` from rosette.toml; default 20."""
    from rosette import _find_rosette_toml

    toml_path = _find_rosette_toml()
    if toml_path is None:
        return _DEFAULT_RETAIN
    try:
        with open(toml_path, "rb") as f:
            data = tomllib.load(f)
    except (OSError, tomllib.TOMLDecodeError):
        return _DEFAULT_RETAIN
    section = data.get("snapshots", {})
    val = section.get("retain", _DEFAULT_RETAIN)
    if not isinstance(val, int):
        return _DEFAULT_RETAIN
    return val


def _prune_snapshots(snapshot_dir: Path, retain: int) -> int:
    """Delete oldest snapshots beyond `retain`. Non-positive `retain` keeps all.

    Only touches `*.png` and matching `*.png.json` files in `snapshot_dir`
    itself (no recursion), so unrelated files dropped in by a user are safe.
    Returns the number of PNG files deleted.
    """
    if retain <= 0 or not snapshot_dir.is_dir():
        return 0
    pngs = sorted(
        snapshot_dir.glob("*.png"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    deleted = 0
    for old in pngs[retain:]:
        try:
            old.unlink()
            sidecar = old.with_suffix(".png.json")
            if sidecar.exists():
                sidecar.unlink()
            deleted += 1
        except OSError:
            # Swallow cleanup failures — pruning is best-effort, the snapshot
            # we just took is the user-visible action and must succeed.
            pass
    return deleted


def shot_design(
    design: str,
    out: str | None,
    cell: str | None,
    bbox_str: str | None,
    layer_str: str | None,
    width: int,
    height: int | None,
    pad: float,
    bg: str,
    fill_alpha: int,
    sidecar: bool,
    retain: int | None = None,
) -> None:
    """Render a design to a PNG image (and a sidecar JSON by default).

    The CLI form of `rosette.render_png`. Reach for this — either as a
    subprocess (`rosette shot ...`) or by importing `render_png` directly
    — only when the conversation has hit a visual gap: the user is
    describing something they can see but the assistant can't picture, or
    the user has asked for a visual inspection. For data queries, read
    the design through the Cell/Library API instead; it's cheaper and
    more precise.

    Choose the subprocess form when the assistant doesn't already have
    the design's Python module loaded (no shared interpreter state).
    When the assistant is running inside the design's process, importing
    `rosette.render_png` directly is simpler.

    Output location: when `out` is None, snapshots land in
    `<project_root>/.rosette/snapshots/<stem>-<timestamp>-<tag>.png`,
    where `project_root` is the directory containing `rosette.toml`.
    The `.rosette/` directory is gitignored, and snapshots are pruned to
    the `retain` newest entries (default 20, configurable via
    `[snapshots] retain` in rosette.toml or `--retain N`; 0 disables
    pruning). When no `rosette.toml` is found, falls back to writing
    `<design-stem>.png` next to the design file with no pruning.
    Explicit `--out` paths are written verbatim and never pruned.

    `--no-sidecar` should rarely be set. The sidecar JSON is what makes
    the snapshot actionable: it carries the world↔pixel transform so any
    pixel position the assistant spots in the PNG can be turned back
    into design coordinates and fed to other tools.
    """
    import json
    import secrets
    import time

    from rosette import render_png

    try:
        bbox = _parse_bbox_arg(bbox_str) if bbox_str else None
        layers = _parse_layers_arg(layer_str) if layer_str else None
    except ValueError as e:
        print(f"{_red('Error')}: {e}")
        sys.exit(2)

    cell_obj, file_path, _ = load_design(design)

    using_default_dir = out is None
    snapshot_dir: Path | None = None
    if using_default_dir:
        snapshot_dir = _project_snapshot_dir()
        if snapshot_dir is not None:
            ts = time.strftime("%Y%m%d-%H%M%S")
            tag = secrets.token_hex(3)
            out_path = snapshot_dir / f"{file_path.stem}-{ts}-{tag}.png"
        else:
            out_path = file_path.with_suffix(".png")
    else:
        out_path = Path(out)

    out_path.parent.mkdir(parents=True, exist_ok=True)

    t0 = time.perf_counter()
    try:
        result = render_png(
            cell_obj,
            bbox=bbox,
            cell=cell,
            layers=layers,
            width=width,
            height=height,
            pad=pad,
            bg=bg,
            fill_alpha=fill_alpha,
        )
    except ValueError as e:
        print(f"{_red('Error')}: {e}")
        sys.exit(1)
    elapsed = (time.perf_counter() - t0) * 1000

    out_path.write_bytes(result.png)
    if sidecar:
        sidecar_path = out_path.with_suffix(out_path.suffix + ".json")
        meta = {
            "image": out_path.name,
            "view": result.view,
            "layers_rendered": [list(t) for t in result.layers_rendered],
        }
        sidecar_path.write_text(json.dumps(meta, indent=2))

    pruned = 0
    if using_default_dir and snapshot_dir is not None:
        retain_val = retain if retain is not None else _load_retain_config()
        pruned = _prune_snapshots(snapshot_dir, retain_val)

    canvas = result.view["canvas_px"]
    assert isinstance(canvas, tuple)
    layer_summary = ", ".join(_format_layer(lyr) for lyr in result.layers_rendered)
    size_kb = len(result.png) / 1024
    extras = f"{canvas[0]}x{canvas[1]}, {size_kb:.1f}KB, layers {layer_summary}, {elapsed:.0f}ms"
    if pruned:
        extras += f", pruned {pruned}"
    print(f"{_green('ok')} {out_path} {_dim(f'({extras})')}")


if __name__ == "__main__":
    main()
