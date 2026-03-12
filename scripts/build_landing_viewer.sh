#!/usr/bin/env bash
set -euo pipefail

# Build the viewer app and copy to www/public/viewer/ for the landing page embed.
#
# Usage: ./scripts/build_landing_viewer.sh

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="$REPO_ROOT/app"
VIEWER_DIR="$REPO_ROOT/www/public/viewer"

echo "Building viewer app with relative base path..."
cd "$APP_DIR"
bun run tsc && bun run vite build --base ./

echo "Copying to $VIEWER_DIR..."
rm -rf "$VIEWER_DIR"
mkdir -p "$VIEWER_DIR"
cp -r dist/* "$VIEWER_DIR/"

echo "Generating showcase design..."
cd "$REPO_ROOT"
uv run python scripts/generate_showcase.py

FILE_COUNT=$(find "$VIEWER_DIR" -type f | wc -l | tr -d ' ')
echo "Done. $FILE_COUNT files in www/public/viewer/"
