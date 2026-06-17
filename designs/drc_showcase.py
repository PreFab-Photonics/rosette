#!/usr/bin/env python3
"""DRC violations showcase — intentionally breaks rules to exercise live DRC.

This file is deliberately NOT clean — it exists to demonstrate DRC behaviour,
not as an example of good layout. Each numbered section trips exactly one rule
from `designs/rosette.toml`, laid out in its own horizontal band so the markers
don't overlap.

See the violations two ways:

    rosette drc drc_showcase.py          # headless — prints the violation list
    rosette serve drc_showcase.py        # live — open the Violations panel (Shift+V)

Coverage: one clean demo per *active* rule in rosette.toml. Rules that the
config supports but does not currently enable (no_self_intersection,
min_edge_length, max_width, density, snap_to_grid) are not exercised here.
"""

from rosette import Cell, Point, Polygon, load_layer_map

layers = load_layer_map()
silicon = layers.silicon.layer
oxide = layers.oxide.layer
p_doping = layers.p_doping.layer
n_doping = layers.n_doping.layer
exclusion = layers.exclusion.layer

# Use 'design' as the conventional top-cell name for `rosette serve`.
design = Cell("drc_showcase")

# -----------------------------------------------------------------------------
# 1. min_width — silicon min_width is 0.12 um.
#    A 0.05 um-wide wire is too narrow.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 0), 8.0, 0.05), silicon)

# -----------------------------------------------------------------------------
# 2. min_spacing — silicon min_spacing is 0.13 um.
#    Two wires with a 0.05 um gap are too close.
#    (top of lower rect = 5.0 + 0.5 = 5.5; bottom of upper rect = 5.55)
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 5.0), 8.0, 0.5), silicon)
design.add_polygon(Polygon.rect(Point(0, 5.55), 8.0, 0.5), silicon)  # 0.05 gap

# -----------------------------------------------------------------------------
# 3. min_area — silicon min_area is 0.01 um^2.
#    A 0.05 x 0.05 = 0.0025 um^2 speck is too small.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 10.0), 0.05, 0.05), silicon)

# -----------------------------------------------------------------------------
# 4. acute_angle — silicon requires convex interior angles >= 60 deg.
#    This triangle has ~56 deg base angles (at (0,14) and (4,14)),
#    which are too sharp.
# -----------------------------------------------------------------------------
design.add_polygon(
    Polygon([Point(0, 14), Point(4, 14), Point(2, 17)]),
    silicon,
)

# -----------------------------------------------------------------------------
# 5. no_overlap — silicon polygons on the same layer must not overlap.
#    These two rectangles overlap in their corner.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 20.0), 4.0, 4.0), silicon)
design.add_polygon(Polygon.rect(Point(2.0, 22.0), 4.0, 4.0), silicon)

# -----------------------------------------------------------------------------
# 6. oxide min_width — oxide min_width is 0.18 um.
#    A 0.10 um oxide stripe is too narrow.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 28.0), 8.0, 0.10), oxide)

# -----------------------------------------------------------------------------
# 7. spacing (inter-layer) — P+ and N+ doping must stay >= 0.50 um apart (PN_SPC).
#    These regions don't overlap, but the 0.20 um gap is too small.
#    (right edge of left rect = 4.0; left edge of right rect = 4.2)
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 33.0), 4.0, 4.0), p_doping)
design.add_polygon(Polygon.rect(Point(4.2, 33.0), 4.0, 4.0), n_doping)  # 0.20 gap

# -----------------------------------------------------------------------------
# 8. forbid_overlap (inter-layer) — P+ and N+ doping must not overlap (PN_NOOVLP).
#    These two regions overlap.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 40.0), 4.0, 4.0), p_doping)
design.add_polygon(Polygon.rect(Point(2.0, 42.0), 4.0, 4.0), n_doping)

# -----------------------------------------------------------------------------
# 9. not_inside (inter-layer) — silicon must not sit fully inside an
#    exclusion / keep-out zone (EXCL_KEEPOUT). This small silicon square is
#    fully contained by the larger exclusion rectangle.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 48.0), 20.0, 12.0), exclusion)
design.add_polygon(Polygon.rect(Point(6.0, 52.0), 4.0, 4.0), silicon)

# -----------------------------------------------------------------------------
# A clean reference shape so the design isn't entirely violations.
# -----------------------------------------------------------------------------
design.add_polygon(Polygon.rect(Point(0, 65.0), 10.0, 2.0), silicon)
