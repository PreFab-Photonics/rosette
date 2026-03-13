#!/usr/bin/env python3
"""Generate a showcase design JSON for the landing page viewer embed.

Reads the rosette logo PNG image and recreates it as pixel art using
rectangles on three layers (dark navy, purple, golden yellow).
Adjacent same-color pixels in each row are merged into wider rectangles
for efficiency. White/background pixels are omitted.
"""

import sys
from pathlib import Path

repo_root = Path(__file__).parent.parent
sys.path.insert(0, str(repo_root / "python"))

# Grid resolution
GRID = 64


def classify_pixel(r, g, b):
    """Classify an RGB pixel into one of 4 categories.

    Returns:
        "dark"   - dark navy/purple outlines
        "purple" - medium purple
        "gold"   - golden yellow
        "bg"     - white/cream background (skip)
    """
    brightness = (r + g + b) / 3.0

    # White / cream background
    if brightness > 180 and min(r, g, b) > 150:
        return "bg"

    # Golden yellow
    if r > 160 and g > 100 and b < 80:
        return "gold"

    # Dark navy
    if brightness < 65:
        return "dark"

    # Medium purple
    if b > 100 and b > r:
        return "purple"

    # Fallback darks
    if brightness < 100:
        return "dark"

    # Remaining
    if r > 140:
        return "gold"

    return "purple"


def main():
    try:
        from PIL import Image
    except ImportError:
        print("Pillow required: uv run --with Pillow python scripts/generate_showcase.py")
        sys.exit(1)

    from rosette import Cell, Layer, Point, Polygon
    from rosette._core import to_json

    dark = Layer(1, 0)
    purple = Layer(2, 0)
    gold = Layer(3, 0)

    layer_map = {"dark": dark, "purple": purple, "gold": gold}

    img_path = repo_root / "www" / "public" / "rosette-logo.png"
    img = Image.open(img_path).convert("RGB")
    img_small = img.resize((GRID, GRID), Image.Resampling.LANCZOS)

    cell = Cell("top")
    px_size = 1.0
    rect_count = 0

    for row in range(GRID):
        # Build classified row
        categories = []
        for col in range(GRID):
            r, g, b = img_small.getpixel((col, row))
            categories.append(classify_pixel(r, g, b))

        # Run-length encode: merge consecutive same-color pixels
        col = 0
        while col < GRID:
            cat = categories[col]
            if cat == "bg":
                col += 1
                continue

            # Find run length
            run_start = col
            while col < GRID and categories[col] == cat:
                col += 1
            run_len = col - run_start

            # Layout coords (Y flipped)
            x = run_start * px_size
            y = (GRID - 1 - row) * px_size
            width = run_len * px_size

            rect = Polygon.rect(Point(x, y), width, px_size)
            cell.add_polygon(rect, layer_map[cat])
            rect_count += 1

    print(f"Grid: {GRID}x{GRID}, Rectangles: {rect_count} (after row merging)")

    json_str = to_json(cell._inner, None)

    output_path = repo_root / "www" / "public" / "viewer" / "showcase.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json_str)
    print(f"Wrote {output_path} ({len(json_str)} bytes)")


if __name__ == "__main__":
    main()
