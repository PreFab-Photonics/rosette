#!/usr/bin/env python3
"""Visual gallery of every public component in ``rosette.components``.

Lays out one instance of each component on a grid so you can scroll
through them in ``rosette serve`` / the viewer and eyeball the
geometry. Each row is labeled with a text annotation on the ``text``
layer so components are easy to find in a wide layout.

Components covered:

* ``sbend``                 — cosine, circular, and euler variants
* ``bragg_grating``         — uniform, gaussian-apodized, and phase-shifted
* ``mmi``                   — 1x2, 2x1, 2x2
* ``directional_coupler``
* ``ring``                  — allpass, add-drop, and racetrack
* ``crossing``              — simple, elliptical, and mmi variants
* ``edge_coupler``          — linear, parabolic, exponential, and clad
* ``grating_coupler``       — focused uniform/apodized and straight

This file is intentionally flat — no routes between components, no
connections. It's a visual catalog, not a design. Preview it live::

    uv run rosette serve designs/components_gallery.py

or build it to GDS::

    uv run rosette build designs/components_gallery.py
"""

from __future__ import annotations

import math

from rosette import Cell, Layer, Point
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
from rosette.project import load_layer_map

layers = load_layer_map()
silicon = layers.silicon.layer
oxide = layers.oxide.layer
text = layers.text.layer


# -----------------------------------------------------------------------------
# Row helper
# -----------------------------------------------------------------------------


class Gallery:
    """Accumulate components into a grid, one row per component family."""

    def __init__(
        self,
        top: Cell,
        label_layer: Layer,
        *,
        cell_gap: float = 15.0,
        label_gap: float = 10.0,
        row_gap: float = 25.0,
    ) -> None:
        self.top = top
        self.label_layer = label_layer
        self.cell_gap = cell_gap
        self.label_gap = label_gap
        self.row_gap = row_gap
        self._next_y = 0.0

    def row(
        self,
        label: str,
        cells_in_row: list[Cell],
        *,
        x_start: float = 0.0,
    ) -> None:
        """Place cells left-to-right using their actual geometry bounds.

        The text label sits on its own line *above* the geometry, so it never
        overlaps the components regardless of how long the label is.

        Args:
            label: Text annotation placed above the row.
            cells_in_row: Component cells to place left-to-right.
            x_start: X coordinate of the row's left edge.
        """
        top_y = self._next_y
        bounds = [cell.bbox() for cell in cells_in_row]
        if any(bound is None for bound in bounds):
            raise ValueError(f"Gallery row {label!r} contains an empty cell")

        row_height = max(bound.height() for bound in bounds if bound is not None)
        self.top.add_text(
            label,
            Point(x_start, top_y + self.label_gap),
            self.label_layer,
            height=4.0,
        )
        x = x_start
        for cell, bound in zip(cells_in_row, bounds, strict=True):
            assert bound is not None
            self.top.add_ref(cell.at(x - bound.min.x, top_y - bound.max.y))
            x += bound.width() + self.cell_gap
        self._next_y -= row_height + self.label_gap + self.row_gap


# -----------------------------------------------------------------------------
# Build each component variant once; reuse across the layout
# -----------------------------------------------------------------------------

design = Cell("components_gallery")
gallery = Gallery(design, text)

# --- sbend: cosine / circular / euler profiles ---
# Note: sbend(bend_type="euler") uses a whole-S-bend anisotropic clothoid,
# a separate implementation from Route(bend_profile="euler").
gallery.row(
    "sbend (cosine, circular, euler)",
    [
        sbend(silicon, length=20.0, offset=5.0, bend_type="cosine"),
        sbend(silicon, length=20.0, offset=5.0, bend_type="circular"),
        sbend(silicon, length=20.0, offset=5.0, bend_type="euler"),
    ],
)

# --- bragg_grating: uniform vs gaussian apodization ---
gallery.row(
    "bragg_grating (uniform, gaussian, phase-shifted)",
    [
        bragg_grating(silicon, num_periods=80, apodization="uniform"),
        bragg_grating(silicon, num_periods=80, apodization="gaussian"),
        bragg_grating(silicon, num_periods=80, phase_shift=math.pi),
    ],
)

# --- mmi: 1x2 / 2x1 / 2x2 ---
gallery.row(
    "mmi (1x2, 2x1, 2x2)",
    [
        mmi(silicon, n_in=1, n_out=2),
        mmi(silicon, n_in=2, n_out=1),
        mmi(silicon, n_in=2, n_out=2, length=15.0),
    ],
)

# --- directional_coupler: default + longer coupling length ---
gallery.row(
    "directional_coupler",
    [
        directional_coupler(silicon, coupling_length=10.0, gap=0.2),
        directional_coupler(silicon, coupling_length=30.0, gap=0.2),
    ],
)

# --- ring: allpass vs add-drop ---
gallery.row(
    "ring (allpass, adddrop, racetrack)",
    [
        ring(silicon, radius=8.0, coupling="allpass"),
        ring(silicon, radius=8.0, coupling="adddrop"),
        ring(silicon, radius=8.0, coupling_length=12.0),
    ],
)

# --- crossing: simple / elliptical / mmi ---
gallery.row(
    "crossing (simple, elliptical, mmi)",
    [
        crossing(silicon, crossing_type="simple"),
        crossing(silicon, crossing_type="elliptical"),
        crossing(silicon, crossing_type="mmi", center_width=3.0),
    ],
)

# --- edge_coupler: taper profiles + oxide cladding ---
gallery.row(
    "edge_coupler (linear, parabolic, exponential, clad)",
    [
        edge_coupler(silicon, taper_length=80.0),
        edge_coupler(silicon, taper_length=80.0, taper_profile="parabolic"),
        edge_coupler(silicon, taper_length=80.0, taper_profile="exponential"),
        edge_coupler(silicon, taper_length=80.0, cladding_layer=oxide, cladding_width=3.0),
    ],
)

# --- grating_coupler: focused uniform/apodized + straight ---
gallery.row(
    "grating_coupler (focused uniform, focused apodized, straight)",
    [
        grating_coupler(silicon, grating_type="uniform"),
        grating_coupler(silicon, grating_type="apodized"),
        grating_coupler(silicon, focusing_angle=None),
    ],
)
