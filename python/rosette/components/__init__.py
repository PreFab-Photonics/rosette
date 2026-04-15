"""Photonic components library.

User-customizable photonic building blocks. Each component is a function
that returns a ``Cell`` with named ports, ready for placement and routing.

Imports::

    # In the main rosette repo:
    from rosette.components import mmi_1x2, ring, grating_coupler

    # In user projects (after ``rosette init``):
    from components import mmi_1x2, ring, grating_coupler

Components are designed to be copied and modified to match your PDK or
process requirements.

Conventions
-----------
All components follow these conventions:

* **Units** -- All dimensions are in **microns**. All angles are in
  **degrees** (the Rust core uses radians; conversion happens at the
  PyO3 boundary).
* **Function signature** -- First parameter is always ``layer: Layer``.
  Remaining parameters have sensible defaults. Returns a ``Cell``.
* **Coordinate system** -- Components are oriented along **+X**. Input
  ports sit at or near the origin; output ports sit at positive x. The
  waveguide centerline lies on **y = 0** for single-port-pair components.
* **Port direction** -- Every port's direction vector points **outward**,
  away from the component body. An "in" port at the left side of a
  waveguide faces **-X**; an "out" port at the right faces **+X**. When
  two ports are connected, their directions point toward each other.
* **Port width** -- Each port carries a ``width`` attribute that equals
  the physical waveguide width at that port. Connecting ports with
  mismatched widths will produce a discontinuity.
* **Gap parameters** -- Where a component has a ``gap`` parameter (ring,
  directional coupler), it means the **edge-to-edge** distance between
  the nearest physical surfaces of the two waveguides.
* **Path length** -- Every component sets ``cell.path_length`` (float,
  microns) to the optical path length through the component. This is
  the physical arc/centerline length of the waveguide, useful for phase
  calculations and delay tracking.
* **Cell names** -- Auto-generated from component parameters and
  truncated to 32 characters (the GDS-II limit) via ``safe_cell_name``.

Component Catalog
-----------------
.. list-table::
   :header-rows: 1
   :widths: 22 38 40

   * - Component
     - Ports
     - Purpose
   * - ``sbend``
     - ``in``, ``out``
     - Lateral offset, same input/output direction
   * - ``mmi_1x2``
     - ``in``, ``out1``, ``out2``
     - 1-to-2 power splitter
   * - ``mmi_2x1``
     - ``in1``, ``in2``, ``out``
     - 2-to-1 power combiner
   * - ``mmi_2x2``
     - ``in1``, ``in2``, ``out1``, ``out2``
     - 2-by-2 coupler
   * - ``directional_coupler``
     - ``in1``, ``in2``, ``out1``, ``out2``
     - Evanescent directional coupler
   * - ``ring``
     - allpass: ``in``, ``out``; adddrop: ``in``, ``through``, ``add``, ``drop``
     - Ring / racetrack resonator
   * - ``crossing``
     - ``in1``, ``out1``, ``in2``, ``out2``
     - Low-loss waveguide intersection
   * - ``grating_coupler``
     - ``opt``
     - Fiber-to-chip coupling

Usage Example
-------------
Create components, place them as Instances, route between ports, and write
to GDS::

    from rosette import Cell, Layer, Route, write_gds
    from rosette.components import grating_coupler

    layer = Layer(1, 0)
    gc = grating_coupler(layer, waveguide_width=0.5, focusing_angle=20.0)

    gc_in = gc.at(0, 0)                     # Instance at origin
    gc_out = gc.at(0, 127)                  # Instance offset by fiber pitch

    route = Route.through(                   # Route between ports
        gc_in.port("opt"),
        (25, 0), (25, 127),                 # Waypoints for the S-bend
        gc_out.port("opt"),
        layer=layer, bend_radius=10.0,
    )

    design = Cell("loopback")
    design.add_ref(gc_in)
    design.add_ref(gc_out)
    design.add_ref(route.to_cell("route"))
    write_gds("output/loopback.gds", design)

Authoring Custom Components
---------------------------
Follow this skeleton when creating new components::

    from rosette import Cell, Layer, Point, Polygon, Port, Vector2
    from rosette.components._utils import safe_cell_name

    def my_component(layer: Layer, waveguide_width: float = 0.5, ...) -> Cell:
        cell = Cell(safe_cell_name(f"mycomp_w{waveguide_width:.3f}"))

        # Build geometry
        cell.add_polygon(Polygon([...]), layer)

        # Ports: direction points AWAY from the component body
        cell.add_port(Port("in", Point(0, 0), -Vector2.unit_x(), waveguide_width))
        cell.add_port(Port("out", Point(length, 0), Vector2.unit_x(), waveguide_width))

        cell.path_length = length  # Always set optical path length
        return cell

Internal modules available to component authors:

* ``_curves`` -- S-bend curve math (cosine, circular, Euler variants).
* ``_utils`` -- ``safe_cell_name()`` for GDS-safe cell naming.
"""

from rosette.components.crossing import crossing
from rosette.components.directional_coupler import directional_coupler
from rosette.components.grating_coupler import grating_coupler
from rosette.components.mmi import mmi_1x2, mmi_2x1, mmi_2x2
from rosette.components.ring import ring
from rosette.components.sbend import sbend

__all__ = [
    "crossing",
    "directional_coupler",
    "grating_coupler",
    "mmi_1x2",
    "mmi_2x1",
    "mmi_2x2",
    "ring",
    "sbend",
]
