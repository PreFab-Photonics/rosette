#!/usr/bin/env python3
"""Visual gallery of every public component in ``rosette.components``.

Lays out one instance of each component on a grid so you can scroll
through them in ``rosette serve`` / the viewer and eyeball the
geometry. Each row is labeled with a text polygon on the ``marker``
layer so components are easy to find in a wide layout.

Components covered (ROS-542):

* ``sbend``                 — cosine, circular, and euler variants
* ``bragg_grating``         — uniform and gaussian-apodized
* ``mmi``                   — 1x2, 2x1, 2x2 (consolidated API, ROS-541)
* ``directional_coupler``
* ``ring``                  — allpass and add-drop
* ``crossing``              — simple, elliptical, and mmi variants
* ``edge_coupler``          — plain + with oxide cladding (ROS-536)
* ``grating_coupler``       — uniform and apodized

This file is intentionally flat — no routes between components, no
connections. It's a visual catalog, not a design. Run::

    # From this directory:
    python components_gallery.py

to emit ``output/components_gallery.gds``, or::

    rosette serve components_gallery.py

for a live preview.
"""

from __future__ import annotations

from rosette import Cell, Layer, Point, Polygon, load_layer_map, write_gds
from rosette.components import (
    bragg_grating,
    crossing,
    directional_coupler,
    edge_coupler,
    grating_coupler,
    mmi,
    ring,
    sbend,
)

layers = load_layer_map()
silicon = layers.silicon.layer
oxide = layers.oxide.layer
marker = layers.marker.layer


# -----------------------------------------------------------------------------
# Row helper
# -----------------------------------------------------------------------------


def _text_marker(label: str, origin: Point) -> Polygon:
    """Tiny rectangle tag on the marker layer so rows are identifiable.

    Rosette doesn't ship a text primitive yet; this is just a visible
    stub next to the row label. ``label`` is used in cell naming only.
    """
    w = max(2.0, 0.25 * len(label))
    return Polygon.rect(origin, w, 1.0)


class Gallery:
    """Accumulate components into a grid, one row per component family."""

    def __init__(self, top: Cell, *, row_pitch: float = 60.0) -> None:
        self.top = top
        self.row_pitch = row_pitch
        self._next_y = 0.0

    def row(self, label: str, cells_in_row: list[Cell], *, x_pitch: float = 40.0) -> None:
        """Place each cell in `cells_in_row` along +X at the current row y."""
        y = self._next_y
        # Label marker at the far left of the row.
        self.top.add_polygon(_text_marker(label, Point(-20.0, y)), marker)
        x = 0.0
        for c in cells_in_row:
            self.top.add_ref(c.at(x, y))
            x += x_pitch
        self._next_y -= self.row_pitch


# -----------------------------------------------------------------------------
# Build each component variant once; reuse across the layout
# -----------------------------------------------------------------------------

design = Cell("components_gallery")
gallery = Gallery(design, row_pitch=70.0)

# --- sbend: cosine / circular / euler profiles ---
# Note: `sbend(bend_type="euler")` uses the whole-S-bend anisotropic
# clothoid in `_curves.euler_sbend_point` — a separate implementation
# from `Route(bend_profile="euler")`. The ROS-544 corner-spike bug was
# in the Route code path and does not affect the sbend rows.
gallery.row(
    "sbend (cosine, circular, euler)",
    [
        sbend(silicon, length=20.0, offset=5.0, bend_type="cosine"),
        sbend(silicon, length=20.0, offset=5.0, bend_type="circular"),
        sbend(silicon, length=20.0, offset=5.0, bend_type="euler"),
    ],
    x_pitch=35.0,
)

# --- bragg_grating: uniform vs gaussian apodization ---
gallery.row(
    "bragg_grating (uniform, gaussian)",
    [
        bragg_grating(silicon, num_periods=80, apodization="uniform"),
        bragg_grating(silicon, num_periods=80, apodization="gaussian"),
    ],
    x_pitch=40.0,
)

# --- mmi: 1x2 / 2x1 / 2x2 via the consolidated API (ROS-541) ---
gallery.row(
    "mmi (1x2, 2x1, 2x2)",
    [
        mmi(silicon, n_in=1, n_out=2),
        mmi(silicon, n_in=2, n_out=1),
        mmi(silicon, n_in=2, n_out=2, length=15.0),
    ],
    x_pitch=40.0,
)

# --- directional_coupler: default + longer coupling length ---
gallery.row(
    "directional_coupler",
    [
        directional_coupler(silicon, coupling_length=10.0, gap=0.2),
        directional_coupler(silicon, coupling_length=30.0, gap=0.2),
    ],
    x_pitch=80.0,
)

# --- ring: allpass vs add-drop ---
gallery.row(
    "ring (allpass, adddrop)",
    [
        ring(silicon, radius=8.0, coupling="allpass"),
        ring(silicon, radius=8.0, coupling="adddrop"),
    ],
    x_pitch=40.0,
)

# --- crossing: simple / elliptical / mmi ---
gallery.row(
    "crossing (simple, elliptical, mmi)",
    [
        crossing(silicon, crossing_type="simple"),
        crossing(silicon, crossing_type="elliptical"),
        crossing(silicon, crossing_type="mmi", center_width=3.0),
    ],
    x_pitch=30.0,
)

# --- edge_coupler: plain + with oxide cladding (ROS-536) ---
# Note: this component extends in -X from the opt port. On a
# left-to-right gallery row that means the body sits to the left of
# its placement origin. Account for that by bumping the first x by
# the taper_length so the tip doesn't collide with the row label.
edge_plain = edge_coupler(silicon, taper_length=80.0)
edge_clad = edge_coupler(silicon, taper_length=80.0, cladding_layer=oxide, cladding_width=3.0)
# Manual placement here (don't use Gallery.row) to shift past the -X extent.
y = gallery._next_y
design.add_polygon(_text_marker("edge_coupler (plain, w/ cladding)", Point(-20.0, y)), marker)
design.add_ref(edge_plain.at(100.0, y))
design.add_ref(edge_clad.at(220.0, y))
gallery._next_y -= gallery.row_pitch

# --- grating_coupler: uniform + apodized ---
gallery.row(
    "grating_coupler (uniform, apodized)",
    [
        grating_coupler(silicon, grating_type="uniform"),
        grating_coupler(silicon, grating_type="apodized"),
    ],
    x_pitch=60.0,
)


# -----------------------------------------------------------------------------
# Output
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    write_gds("output/components_gallery.gds", design)
    print("Wrote output/components_gallery.gds")
    print(
        f"Top cell: {design.polygon_count()} polygons, {design.ref_count()} refs"
    )
