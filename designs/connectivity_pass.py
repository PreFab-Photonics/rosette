#!/usr/bin/env python3
"""A fully connected design -- connectivity check should PASS.

Two grating couplers connected by a routed waveguide.
All sub-instance ports are either connected to a partner or covered
by a top-level port.

Try:
    rosette connectivity designs/connectivity_pass.py
    rosette check designs/connectivity_pass.py
"""

from rosette import Cell, Layer, Route
from rosette.components import grating_coupler

layer = Layer(1, 0)

# Grating couplers
gc_cell = grating_coupler(layer, waveguide_width=0.5, focusing_angle=20.0)
gc_in = gc_cell.at(0, 0)
gc_out = gc_cell.at(0, 80.0)

# Route between their optical ports
route = Route.through(
    gc_in.port("opt"),
    (30, 0),
    (30, 80),
    gc_out.port("opt"),
    layer=layer,
    bend_radius=10.0,
)

# Assemble -- every port is connected
design = Cell("connectivity_pass")
design.add_ref(gc_in)
design.add_ref(gc_out)
design.add_ref(route.to_cell("route_wg"))

if __name__ == "__main__":
    from rosette import write_gds

    write_gds("output/connectivity_pass.gds", design)
