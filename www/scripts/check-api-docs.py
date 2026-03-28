#!/usr/bin/env python3
"""Check that every public API symbol has a corresponding docs page.

Parses __all__ from rosette/__init__.py and verifies that each symbol
either has its own .mdx page (classes) or is documented on the index
page (functions and constants).

Usage:
    uv run python www/scripts/check-api-docs.py

Exit codes:
    0  All public symbols are documented
    1  Missing or extra documentation found
"""

from __future__ import annotations

import ast
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent  # repo root
DOCS_DIR = ROOT / "www" / "content" / "docs" / "api-reference"
ROSETTE_INIT = ROOT / "python" / "rosette" / "__init__.py"


def extract_all(filepath: Path) -> list[str]:
    """Extract __all__ list from a Python file using AST parsing."""
    source = filepath.read_text()
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "__all__":
                    if isinstance(node.value, ast.List):
                        return [
                            elt.value
                            for elt in node.value.elts
                            if isinstance(elt, ast.Constant) and isinstance(elt.value, str)
                        ]
    return []


def find_mdx_pages(docs_dir: Path) -> set[str]:
    """Find all top-level .mdx page names in the api-reference directory.

    Returns page names like 'Cell', 'Point', etc.
    Excludes index.mdx.
    """
    pages = set()
    for mdx in docs_dir.glob("*.mdx"):
        if mdx.name == "index.mdx":
            continue
        pages.add(mdx.stem)
    return pages


def find_documented_functions(index_mdx: Path) -> set[str]:
    """Find function names documented in the index.mdx via PyFunction components."""
    content = index_mdx.read_text()
    return set(re.findall(r'<PyFunction\s+name=\{"([^"]+)"\}', content))


def find_documented_attrs(index_mdx: Path) -> set[str]:
    """Find attribute/constant names documented in the index.mdx via PyAttribute components."""
    content = index_mdx.read_text()
    return set(re.findall(r'<PyAttribute\s+name=\{"([^"]+)"\}', content))


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    # ── Parse __all__ ──────────────────────────────────────────────────
    all_symbols = extract_all(ROSETTE_INIT)
    if not all_symbols:
        print(f"ERROR: Could not parse __all__ from {ROSETTE_INIT}", file=sys.stderr)
        return 1

    # Separate classes (uppercase, not ALL_CAPS) from functions/constants.
    # ALL_CAPS names like DEFAULT_LAYERS are constants documented on index.mdx.
    classes = [s for s in all_symbols if s[0].isupper() and not s.isupper()]
    functions = [s for s in all_symbols if s[0].islower()]
    constants = [s for s in all_symbols if s.isupper()]

    # ── Check docs exist ───────────────────────────────────────────────
    mdx_pages = find_mdx_pages(DOCS_DIR)
    index_mdx = DOCS_DIR / "index.mdx"

    # Classes: each needs its own .mdx page
    for cls in classes:
        if cls not in mdx_pages:
            errors.append(f"Class '{cls}' is in __all__ but has no docs page")

    # Functions: each needs a <PyFunction> entry on index.mdx
    documented_functions = find_documented_functions(index_mdx) if index_mdx.exists() else set()
    for func in functions:
        if func not in documented_functions:
            errors.append(f"Function '{func}' is in __all__ but not documented in index.mdx")

    # Constants: each needs a <PyAttribute> entry on index.mdx
    documented_attrs = find_documented_attrs(index_mdx) if index_mdx.exists() else set()
    for const in constants:
        if const not in documented_attrs:
            errors.append(f"Constant '{const}' is in __all__ but not documented in index.mdx")

    # Orphan check: pages that exist but aren't in __all__
    known_symbols = set(all_symbols)
    for page in mdx_pages:
        if page not in known_symbols:
            warnings.append(f"Docs page '{page}.mdx' exists but '{page}' is not in __all__")

    # ── Report ─────────────────────────────────────────────────────────
    if warnings:
        print(f"\n{'=' * 60}", file=sys.stderr)
        print(f"  API DOCS WARNINGS ({len(warnings)})", file=sys.stderr)
        print(f"{'=' * 60}", file=sys.stderr)
        for w in warnings:
            print(f"  WARNING: {w}", file=sys.stderr)

    if errors:
        print(f"\n{'=' * 60}", file=sys.stderr)
        print(f"  API DOCS CHECK FAILED ({len(errors)} errors)", file=sys.stderr)
        print(f"{'=' * 60}", file=sys.stderr)
        for e in errors:
            print(f"  ERROR: {e}", file=sys.stderr)
        print(
            "\nWhen adding or renaming a public API symbol, update the",
            file=sys.stderr,
        )
        print(
            "corresponding docs page in www/content/docs/api-reference/.",
            file=sys.stderr,
        )
        print(
            "See AGENTS.md for the docs convention.",
            file=sys.stderr,
        )
        return 1

    print(
        f"API docs check passed: {len(classes)} classes, "
        f"{len(functions)} functions, {len(constants)} constants "
        f"— all documented."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
