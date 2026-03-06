"""Bundled source files for agent reference.

This module provides access to the rosette source code so that
AI agents can explore the implementation when needed.
"""

from pathlib import Path

SOURCE_DIR = Path(__file__).parent


def get_source_files() -> dict[str, str]:
    """Return a dict of relative_path -> content for all source files."""
    files = {}
    for path in SOURCE_DIR.rglob("*.rs"):
        rel_path = path.relative_to(SOURCE_DIR)
        files[str(rel_path)] = path.read_text()
    return files


def copy_source_to(target_dir: Path) -> None:
    """Copy all source files to the target directory."""
    target_dir.mkdir(parents=True, exist_ok=True)

    for path in SOURCE_DIR.rglob("*.rs"):
        rel_path = path.relative_to(SOURCE_DIR)
        target_path = target_dir / rel_path
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(path.read_text())
