#!/usr/bin/env python3
"""Grating coupler loopback - a simple fiber-to-fiber test structure."""

from rosette import Cell, Layer, Route, write_gds
from rosette.components import grating_coupler

layer = Layer(1, 0)
gc_spacing = 127.0  # Standard fiber array pitch

# Create grating coupler component
gc_cell = grating_coupler(waveguide_width=0.5, layer=layer, focusing_angle=20.0)

# Position grating couplers
gc_in = gc_cell.at(0, 0)
gc_out = gc_cell.at(0, gc_spacing)

# Route between the grating coupler ports
route = Route.through(
    gc_in.port("opt"),
    (25, 0),
    (25, gc_spacing),
    gc_out.port("opt"),
    layer=layer,
    bend_radius=10.0,
)

# Assemble top cell
design = Cell("gc_loopback")
design.add_ref(gc_in)
design.add_ref(gc_out)
design.add_ref(route.to_cell("loopback_wg"))

if __name__ == "__main__":
    write_gds("output/gc_loopback.gds", design)
