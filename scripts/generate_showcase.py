#!/usr/bin/env python3
"""Generate a showcase design JSON for the landing page viewer embed.

Creates a visually interesting photonic layout and serializes it to JSON
for the embedded WebGPU viewer on the website.
"""

import sys
from pathlib import Path

# Add the python package to the path so we can import rosette
repo_root = Path(__file__).parent.parent
sys.path.insert(0, str(repo_root / "python"))


def main():
    from rosette import Cell, Layer, Point, Route
    from rosette.components.grating_coupler import grating_coupler
    from rosette.components.mmi import mmi_1x2, mmi_2x2
    from rosette.components.ring import ring
    from rosette.components.waveguide import waveguide
    from rosette._core import to_json

    layer = Layer(1, 0)
    wg_width = 0.5
    bend_radius = 10.0

    # Build a splitter tree with ring resonator and grating couplers
    chip = Cell("showcase")

    # Input grating coupler
    gc_in = grating_coupler(layer=layer, waveguide_width=wg_width)
    gc_in_inst = gc_in.at(0, 0)
    chip.add_ref(gc_in_inst)

    # 1x2 MMI splitter
    splitter = mmi_1x2(layer=layer, waveguide_width=wg_width)
    splitter_inst = splitter.at(80, 0)
    chip.add_ref(splitter_inst)

    # Route: input GC -> splitter
    r1 = Route.through(
        gc_in_inst.port("opt"),
        splitter_inst.port("in"),
        layer=layer,
        width=wg_width,
        bend_radius=bend_radius,
    )
    chip.add_ref(r1.to_cell("route_in"))

    # Top arm: splitter out1 -> ring resonator
    ring_res = ring(
        layer=layer,
        waveguide_width=wg_width,
        radius=10.0,
        gap=0.2,
        coupling_length=5.0,
        coupling="adddrop",
    )
    ring_inst = ring_res.at(160, 30)
    chip.add_ref(ring_inst)

    r_top = Route.through(
        splitter_inst.port("out1"),
        ring_inst.port("in"),
        layer=layer,
        width=wg_width,
        bend_radius=bend_radius,
    )
    chip.add_ref(r_top.to_cell("route_top"))

    # Output GC from ring through port
    gc_out1 = grating_coupler(layer=layer, waveguide_width=wg_width)
    gc_out1_inst = gc_out1.at(260, 30).rotate(180)
    chip.add_ref(gc_out1_inst)

    r_ring_out = Route.through(
        ring_inst.port("through"),
        gc_out1_inst.port("opt"),
        layer=layer,
        width=wg_width,
        bend_radius=bend_radius,
    )
    chip.add_ref(r_ring_out.to_cell("route_ring_out"))

    # Output GC from ring drop port
    gc_drop = grating_coupler(layer=layer, waveguide_width=wg_width)
    gc_drop_inst = gc_drop.at(260, 60).rotate(180)
    chip.add_ref(gc_drop_inst)

    r_drop = Route.through(
        ring_inst.port("drop"),
        gc_drop_inst.port("opt"),
        layer=layer,
        width=wg_width,
        bend_radius=bend_radius,
    )
    chip.add_ref(r_drop.to_cell("route_drop"))

    # Bottom arm: splitter out2 -> 2x2 MMI coupler
    coupler = mmi_2x2(layer=layer, waveguide_width=wg_width)
    coupler_inst = coupler.at(160, -30)
    chip.add_ref(coupler_inst)

    r_bot = Route.through(
        splitter_inst.port("out2"),
        coupler_inst.port("in1"),
        layer=layer,
        width=wg_width,
        bend_radius=bend_radius,
    )
    chip.add_ref(r_bot.to_cell("route_bot"))

    # Second input to 2x2 coupler
    gc_in2 = grating_coupler(layer=layer, waveguide_width=wg_width)
    gc_in2_inst = gc_in2.at(0, -50)
    chip.add_ref(gc_in2_inst)

    wg_loop = waveguide(layer=layer, waveguide_width=wg_width, length=30.0)
    wg_loop_inst = wg_loop.at(100, -50)
    chip.add_ref(wg_loop_inst)

    r_in2 = Route.through(
        gc_in2_inst.port("opt"),
        wg_loop_inst.port("in"),
        layer=layer,
        width=wg_width,
        bend_radius=bend_radius,
    )
    chip.add_ref(r_in2.to_cell("route_in2"))

    r_loop = Route.through(
        wg_loop_inst.port("out"),
        coupler_inst.port("in2"),
        layer=layer,
        width=wg_width,
        bend_radius=bend_radius,
    )
    chip.add_ref(r_loop.to_cell("route_loop"))

    # Output GCs from 2x2 coupler
    gc_out2 = grating_coupler(layer=layer, waveguide_width=wg_width)
    gc_out2_inst = gc_out2.at(260, -20).rotate(180)
    chip.add_ref(gc_out2_inst)

    r_coup_out1 = Route.through(
        coupler_inst.port("out1"),
        gc_out2_inst.port("opt"),
        layer=layer,
        width=wg_width,
        bend_radius=bend_radius,
    )
    chip.add_ref(r_coup_out1.to_cell("route_coup_out1"))

    gc_out3 = grating_coupler(layer=layer, waveguide_width=wg_width)
    gc_out3_inst = gc_out3.at(260, -50).rotate(180)
    chip.add_ref(gc_out3_inst)

    r_coup_out2 = Route.through(
        coupler_inst.port("out2"),
        gc_out3_inst.port("opt"),
        layer=layer,
        width=wg_width,
        bend_radius=bend_radius,
    )
    chip.add_ref(r_coup_out2.to_cell("route_coup_out2"))

    # Collect child cells and serialize
    child_cells = list(chip.get_child_cells())
    inner_cells = [c._inner for c in child_cells]
    json_str = to_json(chip._inner, inner_cells)

    # Output
    output_path = repo_root / "www" / "public" / "viewer" / "showcase.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json_str)
    print(f"Wrote showcase design to {output_path} ({len(json_str)} bytes)")


if __name__ == "__main__":
    main()
