"""Shared design-loading helper.

Lives in its own module (rather than ``cli.py``) so that both ``cli`` and
``_serve`` can import it without creating an import cycle.
"""

from __future__ import annotations

import importlib.util
import sys
import traceback
from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from rosette import Cell


class DesignLoadError(RuntimeError):
    """Error raised when a caller needs to control design-load reporting."""


def find_design_config(file_path: str | Path) -> Path | None:
    """Find the nearest rosette.toml at or above a design file's directory."""
    path = Path(file_path).resolve()
    directory = path if path.is_dir() else path.parent
    for candidate_dir in (directory, *directory.parents):
        candidate = candidate_dir / "rosette.toml"
        if candidate.is_file():
            return candidate
    return None


@contextmanager
def design_config_context(
    file_path: str | Path, config_path: str | Path | None = None
) -> Generator[None, None, None]:
    """Resolve implicit config lookups from an override or design directory."""
    from rosette._api import _CONFIG_PATH_OVERRIDE, _CONFIG_SEARCH_ROOT

    path = Path(file_path).resolve()
    directory = path if path.is_dir() else path.parent
    root_token = _CONFIG_SEARCH_ROOT.set(directory)
    config_token = _CONFIG_PATH_OVERRIDE.set(
        Path(config_path).resolve() if config_path is not None else None
    )
    try:
        yield
    finally:
        _CONFIG_PATH_OVERRIDE.reset(config_token)
        _CONFIG_SEARCH_ROOT.reset(root_token)


def _format_design_error(error: Exception, file_path: Path) -> str:
    """Format an exception with the most relevant source location."""
    location: str | None = None
    if isinstance(error, SyntaxError) and error.filename is not None:
        location = error.filename
        if error.lineno is not None:
            location += f":{error.lineno}"
    else:
        frames = traceback.extract_tb(error.__traceback__)
        design_path = file_path.resolve()
        frame = next(
            (
                candidate
                for candidate in reversed(frames)
                if Path(candidate.filename).resolve() == design_path
            ),
            frames[-1] if frames else None,
        )
        if frame is not None:
            location = f"{frame.filename}:{frame.lineno}"

    detail = type(error).__name__
    if str(error):
        detail += f": {error}"
    return f"{location}: {detail}" if location is not None else detail


def load_design(
    path_spec: str,
    config_path: str | Path | None = None,
    *,
    raise_errors: bool = False,
) -> tuple[Cell, Path, str]:
    """Load a design from a file using the 'design' convention.

    Args:
        path_spec: Path to design file, optionally with :target suffix
                   (e.g., "designs/chip.py" or "designs/chip.py:my_cell")
        config_path: Exact config file to use for implicit config lookups.
        raise_errors: Raise ``DesignLoadError`` instead of printing import or
                      design-function errors and exiting.

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

    # Resolve project-local imports from the config root (or the design's own
    # directory when no project config exists), independent of caller cwd.
    discovered_config = find_design_config(file_path)
    design_dir = file_path.parent.resolve()
    project_dir = (
        discovered_config.parent if discovered_config is not None else design_dir
    ).resolve()
    for import_dir in reversed((design_dir, project_dir, Path.cwd())):
        import_path = str(import_dir)
        if import_path not in sys.path:
            sys.path.insert(0, import_path)

    # Import the module
    spec = importlib.util.spec_from_file_location("design_module", file_path)
    if spec is None or spec.loader is None:
        print(f"Error: Could not load module from {file_path}")
        sys.exit(1)

    module = importlib.util.module_from_spec(spec)
    try:
        with design_config_context(file_path, config_path):
            spec.loader.exec_module(module)
    except Exception as e:
        message = f"Error loading design: {_format_design_error(e, file_path)}"
        if raise_errors:
            raise DesignLoadError(message) from e
        print(message)
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
            with design_config_context(file_path, config_path):
                cell = target()
        except Exception as e:
            message = f"Error calling {target_name}(): {_format_design_error(e, file_path)}"
            if raise_errors:
                raise DesignLoadError(message) from e
            print(message)
            sys.exit(1)
    else:
        cell = target

    # Verify it's a Cell
    if not isinstance(cell, Cell):
        print(f"Error: '{target_name}' must be a Cell, got {type(cell).__name__}")
        sys.exit(1)

    return cell, file_path, target_name
