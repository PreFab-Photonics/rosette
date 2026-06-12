#!/usr/bin/env python3
"""DRC violations showcase — intentionally breaks rules to exercise live DRC.

Run with `rosette serve designs/drc_showcase.py` and open the Violations panel
(or press Shift+V) to see severity-coded markers on the canvas. Each labeled
section below trips a different rule from `designs/rosette.toml`.

This file is deliberately NOT clean — it exists to demonstrate the viewer's
DRC overlay, not as an example of good layout.
"""

from rosette import Cell, Point, Polygon, load_layer_map, write_gds

layers = load_layer_map()
silicon = layers.silicon.layer
oxide = layers.oxide.layer
p_doping = layers.p_doping.layer
n_doping = layers.n_doping.layer

# Use 'design' as the conventional top-cell name for `rosette serve`.
design = Cell("drc_showcase")

# -----------------------------------------------------------------------------
# 1. min_width — silicon min_width is 0.12 um.
#    A 0.05 um-wide wire is too narrow.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 0), 8.0, 0.05), silicon)

# -----------------------------------------------------------------------------
# 2. min_spacing — silicon min_spacing is 0.13 um.
#    Two wires only 0.05 um apart are too close.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 5.0), 8.0, 0.5), silicon)
design.add_polygon(Polygon.rect(Point(0, 5.55), 8.0, 0.5), silicon)  # 0.05 gap

# -----------------------------------------------------------------------------
# 3. min_area — silicon min_area is 0.01 um^2.
#    A 0.05 x 0.05 = 0.0025 um^2 speck is too small.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 10.0), 0.05, 0.05), silicon)

# -----------------------------------------------------------------------------
# 4. angles — silicon allows only [0, 90] (Manhattan).
#    A triangle introduces non-orthogonal edges.
# -----------------------------------------------------------------------------
design.add_polygon(
    Polygon([Point(0, 14), Point(4, 14), Point(2, 17)]),
    silicon,
)

# -----------------------------------------------------------------------------
# 5. oxide min_width — oxide min_width is 0.18 um.
#    A 0.10 um oxide stripe is too narrow.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 20.0), 8.0, 0.10), oxide)

# -----------------------------------------------------------------------------
# 6. forbid_overlap (inter-layer) — P+ and N+ doping must not overlap (PN_NOOVLP).
#    These two regions overlap.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 25.0), 4.0, 4.0), p_doping)
design.add_polygon(Polygon.rect(Point(2.0, 27.0), 4.0, 4.0), n_doping)

# -----------------------------------------------------------------------------
# A clean reference shape so the design isn't entirely violations.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 35.0), 10.0, 2.0), silicon)

top = design  # alias

if __name__ == "__main__":
    write_gds("output/drc_showcase.gds", top)
    print("Wrote output/drc_showcase.gds")
    print(f"Top cell: {top.polygon_count()} polygons")
