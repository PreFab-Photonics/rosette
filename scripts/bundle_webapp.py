#!/usr/bin/env python3
"""Bundle the web app for inclusion in the Python package.

This script:
1. Builds the web app (bun run build in app/)
2. Copies the built files to python/rosette/_webapp/

Run this before building/publishing the Python package.
"""

import shutil
import subprocess
import sys
from pathlib import Path


def main():
    # Paths
    repo_root = Path(__file__).parent.parent
    app_dir = repo_root / "app"
    dist_dir = app_dir / "dist"
    webapp_dir = repo_root / "python" / "rosette" / "_webapp"

    # Check bun is available
    if not shutil.which("bun"):
        print("Error: bun not found. Install from https://bun.sh")
        sys.exit(1)

    # Build web app
    print("Building web app...")
    result = subprocess.run(
        ["bun", "run", "build"],
        cwd=app_dir,
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        print("Error building web app:")
        print(result.stderr)
        sys.exit(1)

    # Check dist was created
    if not dist_dir.exists():
        print(f"Error: dist directory not found at {dist_dir}")
        sys.exit(1)

    # Clear existing webapp dir
    if webapp_dir.exists():
        shutil.rmtree(webapp_dir)

    # Copy dist to webapp dir
    print(f"Copying to {webapp_dir}...")
    shutil.copytree(dist_dir, webapp_dir)

    # Count files
    file_count = sum(1 for _ in webapp_dir.rglob("*") if _.is_file())
    print(f"Bundled {file_count} files to python/rosette/_webapp/")


if __name__ == "__main__":
    main()
