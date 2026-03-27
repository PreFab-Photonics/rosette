#!/usr/bin/env python3
"""DFM test structures — designs for testing fabrication prediction.

Simple flat layouts for testing `rosette dfm` and `rosette check`.
Features range from comfortably wide to sub-resolution narrow.

    rosette dfm designs/dfm_test.py --config designs/rosette.toml
    rosette dfm designs/dfm_test.py --config designs/rosette.toml -v
    rosette check designs/dfm_test.py --config designs/rosette.toml
"""

from rosette import Cell, Layer, Point, Polygon, write_gds

layer = Layer(1, 0)

design = Cell("dfm_test")

# Wide waveguide — 0.5 um wide, 50 um long
# Standard SOI single-mode waveguide. Should show minimal DFM deviation.
design.add_polygon(Polygon.rect(Point(0, -0.25), 50.0, 0.5), layer)

# Narrow taper tip — tapers from 0.5 um to 0.08 um
# Sub-wavelength tip. Gaussian blur will round/erode the narrow end.
design.add_polygon(
    Polygon(
        [
            Point(0, 4.75),
            Point(20, 4.96),
            Point(20, 5.04),
            Point(0, 5.25),
        ]
    ),
    layer,
)

# Dense grating — 10 lines, 0.3 um wide, 0.3 um gaps
# Period = 0.6 um. Proximity effects will cause the lines to widen/merge.
for i in range(10):
    x = i * 0.6
    design.add_polygon(Polygon.rect(Point(x, 10), 0.3, 5.0), layer)

if __name__ == "__main__":
    write_gds("output/dfm_test.gds", design)
    print("Wrote output/dfm_test.gds")
