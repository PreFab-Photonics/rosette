#!/usr/bin/env python3
"""Grating coupler loopback - a simple fiber-to-fiber test structure."""

from components import grating_coupler

from rosette import Cell, Layer, Route, write_gds

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
    (20, 0),
    (20, gc_spacing),
    gc_out.port("opt"),
    layer=layer,
    bend_radius=10.0,
)

# Assemble top cell
top = Cell("gc_loopback")
top.add_ref(gc_in)
top.add_ref(gc_out)
top.add_ref(route.to_cell("loopback_wg"))

write_gds("output/gc_loopback.gds", top)
