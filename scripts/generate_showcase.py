#!/usr/bin/env python3
"""Generate a showcase design JSON for the landing page viewer embed.

Creates a clean geometric composition on two layers (brand purple + brand gold)
to demonstrate the viewer's multi-layer rendering on the landing page.
"""

import sys
from pathlib import Path

# Add the python package to the path so we can import rosette
repo_root = Path(__file__).parent.parent
sys.path.insert(0, str(repo_root / "python"))


def main():
    from rosette import Cell, Layer, Point, Polygon
    from rosette._core import to_json

    # Two layers — will be colored brand-purple and brand-gold by the viewer
    purple = Layer(1, 0)
    gold = Layer(2, 0)

    cell = Cell("top")

    # --- Purple layer: clean rectangles and rounded shapes ---
    # Large central rectangle
    cell.add_polygon(Polygon.rect_centered(Point(0, 0), 50, 24), purple)
    # Flanking squares
    cell.add_polygon(Polygon.rect_centered(Point(-45, 0), 18, 18), purple)
    cell.add_polygon(Polygon.rect_centered(Point(45, 0), 18, 18), purple)
    # Small accent rectangles
    cell.add_polygon(Polygon.rect_centered(Point(-20, 25), 12, 6), purple)
    cell.add_polygon(Polygon.rect_centered(Point(20, 25), 12, 6), purple)

    # --- Gold layer: hexagons and circles ---
    # Central hexagon
    cell.add_polygon(Polygon.regular(Point(0, 0), 8, 6), gold)
    # Orbiting circles (high-sided polygons)
    cell.add_polygon(Polygon.regular(Point(-45, 0), 5, 32), gold)
    cell.add_polygon(Polygon.regular(Point(45, 0), 5, 32), gold)
    # Accent hexagons
    cell.add_polygon(Polygon.regular(Point(-20, -22), 6, 6), gold)
    cell.add_polygon(Polygon.regular(Point(20, -22), 6, 6), gold)
    cell.add_polygon(Polygon.regular(Point(0, 28), 4, 6), gold)

    # Serialize (no child cells, everything is in one cell)
    json_str = to_json(cell._inner, None)

    # Output
    output_path = repo_root / "www" / "public" / "viewer" / "showcase.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json_str)
    print(f"Wrote showcase design to {output_path} ({len(json_str)} bytes)")


if __name__ == "__main__":
    main()
