#!/usr/bin/env python3
"""Generate a showcase design JSON for the landing page viewer embed.

Creates a simple photonic layout on two layers to demonstrate the viewer's
multi-layer rendering on the landing page. Layer 1 is a waveguide with tapers,
layer 2 is cladding pads with hatched fill. No overlapping shapes.
"""

import sys
from pathlib import Path

# Add the python package to the path so we can import rosette
repo_root = Path(__file__).parent.parent
sys.path.insert(0, str(repo_root / "python"))


def main():
    from rosette import Cell, Layer, Point, Polygon
    from rosette._core import to_json

    core = Layer(1, 0)
    clad = Layer(2, 0)

    cell = Cell("top")

    # --- Core layer: waveguide with tapers ---
    # Main waveguide
    cell.add_polygon(Polygon.rect_centered(Point(0, 0), 100, 5), core)
    # Left taper (wider at outer end)
    cell.add_polygon(
        Polygon([Point(-70, -6), Point(-50, -2.5), Point(-50, 2.5), Point(-70, 6)]),
        core,
    )
    # Right taper
    cell.add_polygon(
        Polygon([Point(50, -2.5), Point(70, -6), Point(70, 6), Point(50, 2.5)]),
        core,
    )

    # --- Cladding layer: pads above and below the waveguide ---
    cell.add_polygon(Polygon.rect_centered(Point(0, 11), 60, 10), clad)
    cell.add_polygon(Polygon.rect_centered(Point(0, -11), 60, 10), clad)

    # Serialize (no child cells, everything is in one cell)
    json_str = to_json(cell._inner, None)

    # Output
    output_path = repo_root / "www" / "public" / "viewer" / "showcase.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json_str)
    print(f"Wrote showcase design to {output_path} ({len(json_str)} bytes)")


if __name__ == "__main__":
    main()
