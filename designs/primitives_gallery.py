#!/usr/bin/env python3
"""Primitives gallery - a tour of the core rosette API.

This example demonstrates the fundamental, photonic-agnostic primitives
that everything else is built on. It is a deliberate catalog rather than
a real design - great for learning the core API and for exercising the
build pipeline in tests.

Primitives covered:

* Polygon constructors  - ``rect``, ``rect_centered``, ``regular``,
                          and custom vertex lists
* Boolean operations    - ``subtract``, ``union``, ``intersect``, ``xor``
                          (each returns ``list[Polygon]``)
* Paths                 - ``add_path`` (centerline + width) with end types
* Cell hierarchy        - ``add_ref`` + the ergonomic ``.at()`` placement
* Transforms            - ``rotate`` / ``mirror_x`` and the chaining-order
                          rule, plus array placement
* Labels                - ``add_text`` on an annotation layer

The CLI loads the ``design`` variable below. Preview it live::

    rosette serve primitives_gallery.py

or build it to GDS::

    rosette build primitives_gallery.py
"""

from rosette import (
    Cell,
    PathEndType,
    Point,
    Polygon,
    load_layer_map,
)

# Load layers from rosette.toml
layers = load_layer_map()
silicon = layers.silicon.layer
oxide = layers.oxide.layer
marker = layers.marker.layer
text = layers.text.layer

# =============================================================================
# 1. Polygon constructors
# =============================================================================

# A rectangle anchored at its lower-left corner.
rect_cell = Cell("rectangle")
rect_cell.add_polygon(Polygon.rect(Point(0, 0), 20, 10), silicon)

# The same size rectangle, but anchored at its center.
rect_centered_cell = Cell("rect_centered")
rect_centered_cell.add_polygon(Polygon.rect_centered(Point(0, 0), 20, 10), silicon)

# A regular N-gon. Bump `sides` up and `regular` approximates a circle.
hexagon_cell = Cell("hexagon")
hexagon_cell.add_polygon(Polygon.regular(Point(0, 0), radius=12, sides=6), silicon)

# A custom polygon from an explicit vertex list (a triangle). The triangle
# is asymmetric, which makes the mirror/rotate demos below actually visible.
triangle_cell = Cell("triangle")
triangle_cell.add_polygon(
    Polygon([Point(0, 0), Point(30, 0), Point(5, 25)]),
    oxide,
)

# =============================================================================
# 2. Boolean operations
# =============================================================================
#
# All four boolean ops are Polygon methods that return `list[Polygon]`,
# because a single operation can produce several disjoint pieces (and any
# holes are "keyholed" into a single ring via a zero-width bridge).

# --- subtract: cut a hole to make a donut ---
donut_cell = Cell("donut")
outer = Polygon.regular(Point(0, 0), radius=20, sides=32)
inner = Polygon.regular(Point(0, 0), radius=8, sides=32)
# subtract() cuts the inner disk out of the outer disk, producing a single
# keyholed polygon (a true hole) rather than two overlapping solids.
for part in outer.subtract(inner):
    donut_cell.add_polygon(part, silicon)

# The remaining three ops all act on the *same* overlapping pair of squares
# so you can place them side by side and compare the results by eye.
a = Polygon.rect(Point(0, 0), 16, 16)
b = Polygon.rect(Point(8, 8), 16, 16)


def _boolean_cell(name: str, parts: list[Polygon]) -> Cell:
    cell = Cell(name)
    for part in parts:
        cell.add_polygon(part, silicon)
    return cell


union_cell = _boolean_cell("bool_union", a.union(b))  # combined L-shape
intersect_cell = _boolean_cell("bool_intersect", a.intersect(b))  # small overlap square
xor_cell = _boolean_cell("bool_xor", a.xor(b))  # everything except the overlap

# =============================================================================
# 3. Paths
# =============================================================================
#
# A path stores a centerline + width instead of an explicit outline. It is
# the compact way to express waveguide-like geometry. Paths are added
# directly to a cell rather than constructed as standalone Polygons.

path_cell = Cell("path")
path_cell.add_path(
    [Point(0, 0), Point(30, 0), Point(50, 20), Point(80, 20)],
    width=2.0,
    layer=silicon,
    end_type=PathEndType.ROUND,  # rounded caps at the endpoints
)

# =============================================================================
# 4. Cell hierarchy + transforms
# =============================================================================
#
# Use 'design' as the conventional top-cell name for `rosette serve`
# and `rosette build`. The layout below is organized into clear horizontal
# bands (bottom to top) so each group of primitives is easy to find.
design = Cell("primitives_gallery")

# --- Band 1: polygon constructors (y = 0) ---
design.add_ref(rect_cell.at(0, 0))
design.add_ref(rect_centered_cell.at(40, 5))
design.add_ref(hexagon_cell.at(95, 5))

# --- Band 2: transforms on the asymmetric triangle (y = 40) ---
# Chaining-order matters: each chained transform wraps the *outside* of the
# accumulated transform, so the FIRST call is applied to the geometry first.
# To transform a cell about its own origin and THEN move it into place, do
# the transform first and place last -- otherwise the placement offset gets
# mirrored/rotated too and the geometry flies off somewhere unexpected.
design.add_ref(triangle_cell.at(0, 40))  # original orientation
design.add_ref(triangle_cell.at(0, 0).mirror_x().at(50, 65))  # mirror, then place
design.add_ref(triangle_cell.at(0, 0).rotate(180).at(135, 65))  # rotate, then place

# --- Band 3: a path instance (y = 90), in its own clear row ---
design.add_ref(path_cell.at(0, 90))

# --- Band 4: boolean results, laid out left-to-right (y = 130) ---
design.add_ref(donut_cell.at(20, 150))
design.add_ref(union_cell.at(70, 130))
design.add_ref(intersect_cell.at(120, 138))
design.add_ref(xor_cell.at(160, 130))

# --- Band 5: array placement (y = 195) ---
# A grid of small rectangles instanced from a single source cell.
dot_cell = Cell("dot")
dot_cell.add_polygon(Polygon.rect(Point(0, 0), 3, 3), silicon)
design.add_ref(
    dot_cell.at(0, 195).array(columns=8, rows=3, col_spacing=8.0, row_spacing=8.0)
)

# =============================================================================
# 5. Labels
# =============================================================================
#
# add_text() places a GDS text label on an annotation layer. Labels are for
# documentation/debugging and are typically not fabricated. They sit to the
# left of the extent marker (which spans x = -10 .. 200) so they don't
# overlap the geometry.
design.add_text("polygons", Point(-60, 30), text, height=4.0)
design.add_text("transforms", Point(-60, 75), text, height=4.0)
design.add_text("paths", Point(-60, 115), text, height=4.0)
design.add_text("booleans", Point(-60, 175), text, height=4.0)
design.add_text("array", Point(-60, 225), text, height=4.0)

# An overall extent marker so the full layout is easy to frame in the viewer.
design.add_polygon(Polygon.rect(Point(-10, -10), 210, 250), marker)
