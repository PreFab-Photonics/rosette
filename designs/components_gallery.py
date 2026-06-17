#!/usr/bin/env python3
"""Visual gallery of every public component in ``rosette.components``.

Lays out one instance of each component on a grid so you can scroll
through them in ``rosette serve`` / the viewer and eyeball the
geometry. Each row is labeled with a text annotation on the ``text``
layer so components are easy to find in a wide layout.

Components covered:

* ``sbend``                 — cosine, circular, and euler variants
* ``bragg_grating``         — uniform and gaussian-apodized
* ``mmi``                   — 1x2, 2x1, 2x2
* ``directional_coupler``
* ``ring``                  — allpass and add-drop
* ``crossing``              — simple, elliptical, and mmi variants
* ``edge_coupler``          — plain + with oxide cladding
* ``grating_coupler``       — uniform and apodized

This file is intentionally flat — no routes between components, no
connections. It's a visual catalog, not a design. Preview it live::

    rosette serve components_gallery.py

or build it to GDS::

    rosette build components_gallery.py
"""

from __future__ import annotations

from rosette import Cell, Point, load_layer_map
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
text = layers.text.layer


# -----------------------------------------------------------------------------
# Row helper
# -----------------------------------------------------------------------------


class Gallery:
    """Accumulate components into a grid, one row per component family."""

    def __init__(self, top: Cell, *, row_pitch: float = 70.0, label_gap: float = 22.0) -> None:
        self.top = top
        self.row_pitch = row_pitch
        self.label_gap = label_gap
        self._next_y = 0.0

    def row(
        self,
        label: str,
        cells_in_row: list[Cell],
        *,
        x_pitch: float = 40.0,
        x_start: float = 0.0,
    ) -> None:
        """Place each cell in `cells_in_row` along +X at the current row y.

        The text label sits on its own line *above* the geometry, so it never
        overlaps the components regardless of how long the label is.

        Args:
            label: Text annotation placed above the row.
            cells_in_row: Component cells to place left-to-right.
            x_pitch: Spacing between successive cells.
            x_start: X offset for the first cell. Use a positive value for
                components whose body extends in -X from their port (e.g.
                ``edge_coupler``, ``grating_coupler``) so the body stays
                clear of the left margin.
        """
        y = self._next_y
        # Row label, on its own line above the geometry.
        self.top.add_text(label, Point(0.0, y + self.label_gap), text, height=4.0)
        x = x_start
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
# Note: sbend(bend_type="euler") uses a whole-S-bend anisotropic clothoid,
# a separate implementation from Route(bend_profile="euler").
# A tighter aspect (offset/length) is used here so the euler variant reads
# cleanly; the euler midpoint currently forces a 90-degree tangent which
# looks kinked on very gentle bends (tracked in ROS-585).
gallery.row(
    "sbend (cosine, circular, euler)",
    [
        sbend(silicon, length=15.0, offset=8.0, bend_type="cosine"),
        sbend(silicon, length=15.0, offset=8.0, bend_type="circular"),
        sbend(silicon, length=15.0, offset=8.0, bend_type="euler"),
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

# --- mmi: 1x2 / 2x1 / 2x2 ---
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

# --- edge_coupler: plain + with oxide cladding ---
# This component extends in -X from its opt port, so shift the first cell
# right by the taper length (and space the variants well apart).
gallery.row(
    "edge_coupler (plain, w/ cladding)",
    [
        edge_coupler(silicon, taper_length=80.0),
        edge_coupler(silicon, taper_length=80.0, cladding_layer=oxide, cladding_width=3.0),
    ],
    x_pitch=120.0,
    x_start=100.0,
)

# --- grating_coupler: uniform + apodized ---
# Also extends in -X from its opt port, so give it an x_start too.
gallery.row(
    "grating_coupler (uniform, apodized)",
    [
        grating_coupler(silicon, grating_type="uniform"),
        grating_coupler(silicon, grating_type="apodized"),
    ],
    x_pitch=60.0,
    x_start=40.0,
)
