#!/usr/bin/env python3
"""Bundle Rust source files into the Python package for agent reference.

Run this before building the wheel:
    python scripts/bundle_source.py
    maturin build
"""

import shutil
from pathlib import Path

ROOT = Path(__file__).parent.parent
SOURCE_TARGET = ROOT / "python" / "rosette" / "_source"

# Source directories to include
SOURCE_DIRS = [
    ("crates/rosette-core/src", "core"),
    ("crates/rosette-python/src", "python_bindings"),
    ("crates/rosette-io/src", "io"),
]


def main():
    # Clean existing source (except __init__.py)
    if SOURCE_TARGET.exists():
        for item in SOURCE_TARGET.iterdir():
            if item.name != "__init__.py":
                if item.is_dir():
                    shutil.rmtree(item)
                else:
                    item.unlink()

    SOURCE_TARGET.mkdir(parents=True, exist_ok=True)

    # Copy source files
    for src_dir, target_name in SOURCE_DIRS:
        src_path = ROOT / src_dir
        if not src_path.exists():
            print(f"Warning: {src_path} does not exist, skipping")
            continue

        target_path = SOURCE_TARGET / target_name
        target_path.mkdir(parents=True, exist_ok=True)

        # Copy all .rs files preserving directory structure
        for rs_file in src_path.rglob("*.rs"):
            rel_path = rs_file.relative_to(src_path)
            dest = target_path / rel_path
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(rs_file, dest)
            print(f"  {target_name}/{rel_path}")

    print(f"\nBundled source files to {SOURCE_TARGET}")


if __name__ == "__main__":
    main()
