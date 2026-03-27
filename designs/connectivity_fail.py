#!/usr/bin/env python3
"""A design with connectivity issues -- connectivity check should FAIL.

Demonstrates two types of violations:
1. Unconnected port -- a waveguide's "out" port goes nowhere
2. Width mismatch -- a 0.5um waveguide connects to a 0.4um taper input

Try:
    rosette connectivity designs/connectivity_fail.py
    rosette connectivity designs/connectivity_fail.py -v
    rosette check designs/connectivity_fail.py
"""

from rosette import Cell, Layer
from rosette.components import grating_coupler, taper, waveguide

layer = Layer(1, 0)

# -- Problem 1: Dangling port --
# This waveguide's "out" port has nothing connected to it.
wg_dangling = waveguide(layer, waveguide_width=0.5, length=20.0)
gc_cell = grating_coupler(layer, waveguide_width=0.5, focusing_angle=20.0)
gc_in = gc_cell.at(0, 0)
wg_inst = wg_dangling.at(gc_in.port("opt").position.x, gc_in.port("opt").position.y)

# -- Problem 2: Width mismatch --
# The waveguide has width=0.5, but the taper input is width_in=0.4.
# They connect position-wise but their port widths don't match.
wg_wide = waveguide(layer, waveguide_width=0.5, length=15.0)
taper_cell = taper(layer, width_in=0.4, width_out=0.8, length=10.0)
wg_wide_inst = wg_wide.at(0, -20.0)
taper_inst = taper_cell.at(15.0, -20.0)

# Assemble
design = Cell("connectivity_fail")
design.add_ref(gc_in)
design.add_ref(wg_inst)
design.add_ref(wg_wide_inst)
design.add_ref(taper_inst)

if __name__ == "__main__":
    from rosette import write_gds

    write_gds("output/connectivity_fail.gds", design)
