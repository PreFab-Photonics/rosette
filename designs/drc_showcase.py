#!/usr/bin/env python3
"""Labelled examples for every active rule in ``designs/rosette.toml``.

This design is deliberately invalid. Each geometry group targets one active
rule and is spaced far enough from the other groups to avoid accidental
cross-violations. From the repository root, inspect it with::

    uv run rosette drc designs/drc_showcase.py
    uv run rosette serve designs/drc_showcase.py

The active configuration contains 23 rules: three basic dimensional rules on
each of six fabrication layers, two additional silicon rules, and three
inter-layer rules.
"""

from __future__ import annotations

import math

from rosette import Cell, Layer, Point, Polygon
from rosette.project import load_layer_map

layers = load_layer_map()
silicon = layers.silicon.layer
oxide = layers.oxide.layer
marker = layers.marker.layer
p_doping = layers.p_doping.layer
n_doping = layers.n_doping.layer
exclusion = layers.exclusion.layer
text = layers.text.layer

design = Cell("drc_showcase")


def _label(value: str, x: float, y: float) -> None:
    design.add_text(value, Point(x, y), text, height=2.0)


def _rect(layer: Layer, x: float, y: float, width: float, height: float) -> None:
    design.add_polygon(Polygon.rect(Point(x, y), width, height), layer)


def _equilateral(layer: Layer, x: float, y: float, altitude: float) -> None:
    half_base = altitude / math.sqrt(3.0)
    design.add_polygon(
        Polygon(
            [
                Point(x, y),
                Point(x + 2.0 * half_base, y),
                Point(x + half_base, y + altitude),
            ]
        ),
        layer,
    )


def _basic_rule_examples(
    *,
    name: str,
    layer: Layer,
    x: float,
    min_width: float,
    min_spacing: float,
    min_area: float,
    square_area_example: bool = False,
) -> None:
    """Add isolated min-width, min-spacing, and min-area examples."""
    narrow_width = min_width * 0.6
    narrow_length = max(1.0, min_area / narrow_width * 1.5)
    _rect(layer, x, 0.0, narrow_length, narrow_width)
    _label(f"{name}.min_width", x, 3.0)

    feature_size = max(min_width * 1.2, math.sqrt(min_area) * 1.2)
    gap = min_spacing * 0.5
    _rect(layer, x, 25.0, feature_size, feature_size)
    _rect(layer, x + feature_size + gap, 25.0, feature_size, feature_size)
    _label(f"{name}.min_spacing", x, 25.0 + feature_size + 2.0)

    area_altitude = min_width * 1.05
    if square_area_example:
        _rect(layer, x, 50.0, area_altitude, area_altitude)
    else:
        # A triangle can satisfy min-width while remaining below min-area.
        _equilateral(layer, x, 50.0, area_altitude)
    _label(f"{name}.min_area", x, 50.0 + area_altitude + 2.0)


_basic_rule_examples(
    name="silicon",
    layer=silicon,
    x=0.0,
    min_width=0.12,
    min_spacing=0.13,
    min_area=0.02,
    square_area_example=True,
)
_basic_rule_examples(
    name="oxide",
    layer=oxide,
    x=40.0,
    min_width=0.18,
    min_spacing=0.20,
    min_area=0.05,
)
_basic_rule_examples(
    name="marker",
    layer=marker,
    x=80.0,
    min_width=0.25,
    min_spacing=0.30,
    min_area=0.10,
)
_basic_rule_examples(
    name="p_doping",
    layer=p_doping,
    x=120.0,
    min_width=0.30,
    min_spacing=0.40,
    min_area=0.10,
)
_basic_rule_examples(
    name="n_doping",
    layer=n_doping,
    x=160.0,
    min_width=0.30,
    min_spacing=0.40,
    min_area=0.10,
)
_basic_rule_examples(
    name="exclusion",
    layer=exclusion,
    x=210.0,
    min_width=5.0,
    min_spacing=10.0,
    min_area=25.0,
)

# Silicon-only rules.
design.add_polygon(
    Polygon([Point(0.0, 75.0), Point(4.0, 75.0), Point(2.0, 78.0)]),
    silicon,
)
_label("silicon.acute_angle", 0.0, 80.0)

_rect(silicon, 0.0, 100.0, 4.0, 4.0)
_rect(silicon, 2.0, 102.0, 4.0, 4.0)
_label("silicon.no_overlap", 0.0, 108.0)

# Inter-layer rules. Spacing ignores touching or overlapping polygons, leaving
# the overlap example attributable only to PN_NOOVLP.
_rect(p_doping, 120.0, 125.0, 4.0, 4.0)
_rect(n_doping, 124.2, 125.0, 4.0, 4.0)
_label("PN_SPC", 120.0, 131.0)

_rect(p_doping, 120.0, 150.0, 4.0, 4.0)
_rect(n_doping, 122.0, 152.0, 4.0, 4.0)
_label("PN_NOOVLP", 120.0, 158.0)

_rect(exclusion, 210.0, 125.0, 20.0, 12.0)
_rect(silicon, 216.0, 129.0, 4.0, 4.0)
_label("EXCL_KEEPOUT", 210.0, 139.0)
