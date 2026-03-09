# Rosette Patterns

Copy-paste recipes for common photonic structures.

## Layer Setup

### Using Named Layers (Recommended)

```python
from rosette import load_layer_map

# Load layer definitions from rosette.toml
layers = load_layer_map()
layer = layers.core.layer   # Layer(1, 0) - with color, fill, etc.
clad = layers.clad.layer     # Layer(2, 0)

# Layer properties are also accessible
print(layers.core.color)     # "#4caf50"
print(layers.core.number)    # 1
```

### Using Layer Numbers Directly (Fallback)

```python
from rosette import Layer

layer = Layer(1, 0)  # Works but no name/color info
```

## Basic Structures

### Straight Waveguide

```python
from rosette import load_layer_map
from components import waveguide

layers = load_layer_map()
wg_cell = waveguide(100.0, 0.5, layers.core.layer)  # 100um long, 0.5um wide
```

### 90-Degree Bend

```python
from rosette import load_layer_map
from components import bend

layers = load_layer_map()
bend_cell = bend(5.0, 90, 0.5, layers.core.layer)  # 5um radius, 90 degrees
```

### S-Bend (Lateral Offset)

```python
from rosette import load_layer_map
from components import sbend

layers = load_layer_map()
# Offset waveguide by 10um laterally over 50um length
sbend_cell = sbend(50.0, 10.0, 0.5, layers.core.layer)  # length, offset, width
```

### Linear Taper

```python
from rosette import load_layer_map
from components import taper

layers = load_layer_map()
# Expand from 0.5um to 1.0um over 10um
taper_cell = taper(10.0, 0.5, 1.0, layers.core.layer)  # length, width_in, width_out
```

## Connected Circuits with Route

### Waveguide with Bends

```python
from rosette import Route, load_layer_map

layers = load_layer_map()
layer = layers.core.layer

# Route creates connected waveguide paths with automatic bends
route = Route(layer, width=0.5, bend_radius=5.0)
route.start_at(0, 0)
route.to(20, 0)        # Straight 20um
route.to(20, 30)       # 90° bend, then vertical
route.to(50, 30)       # 90° bend, then horizontal
route.end_at(50, 30)

cell = route.to_cell("waveguide_route")
print(f"Total path: {route.path_length:.1f}um")
```

### U-Turn (180-Degree)

```python
from rosette import Route, load_layer_map

layers = load_layer_map()
route = Route(layers.core.layer, width=0.5, bend_radius=5.0)
route.start_at(0, 0)
route.to(20, 0)
route.to(20, 10)     # 90° up
route.to(0, 10)      # 90° back
route.end_at(0, 10)
cell = route.to_cell("u_turn")
```

### Width Transition

```python
from rosette import Route, load_layer_map

layers = load_layer_map()
route = Route(layers.core.layer, width=0.4, bend_radius=5.0)
route.start_at(0, 0)
route.to(10, 0)                  # Narrow input
route.to(25, 0, width=1.0)       # Auto-taper to wide
route.to(75, 0)                  # Wide section
route.to(90, 0, width=0.4)       # Auto-taper back to narrow
route.end_at(100, 0)
cell = route.to_cell("tapered_section")
```

## Splitters and Combiners

### 1x2 MMI Splitter

```python
from rosette import Cell, Route, load_layer_map, write_gds
from components import mmi_1x2

layers = load_layer_map()
layer = layers.core.layer
mmi_cell = mmi_1x2(layer)
mmi = mmi_cell.at(0, 0)

# Route from MMI output
mmi_out1 = mmi.port("out1")
route = Route.through(
    mmi_out1,
    (mmi_out1.position.x + 10, mmi_out1.position.y),
    (mmi_out1.position.x + 10, 20),
    layer=layer, width=0.5, bend_radius=5.0
)

top = Cell("splitter")
top.add_ref(mmi)
top.add_ref(route.to_cell("mmi_output_route"))
write_gds("output.gds", top)
```

### Y-Branch Splitter

```python
from rosette import load_layer_map
from components import ybranch

layers = load_layer_map()
yb_cell = ybranch(0.5, layers.core.layer)  # 0.5um waveguide width
# Ports: in, out1, out2
```

## Couplers

### Directional Coupler

```python
from rosette import load_layer_map
from components import directional_coupler

layers = load_layer_map()
dc_cell = directional_coupler(
    layers.core.layer,
    coupling_length=20.0,
    gap=0.2,
    width=0.5
)
# Ports: in1, in2, out1, out2
```

### Ring Resonator (All-Pass)

```python
from rosette import load_layer_map
from components import ring

layers = load_layer_map()
ring_cell = ring(
    radius=10.0,
    width=0.5,
    layer=layers.core.layer,
    gap=0.2,
    coupling="allpass"
)
# Ports: in, out
```

### Ring Resonator (Add-Drop)

```python
from rosette import load_layer_map
from components import ring

layers = load_layer_map()
ring_cell = ring(
    radius=10.0,
    width=0.5,
    layer=layers.core.layer,
    gap=0.2,
    coupling="adddrop"
)
# Ports: in, through, add, drop
```

## Fiber Coupling

### Grating Coupler

```python
from rosette import load_layer_map
from components import grating_coupler

layers = load_layer_map()
gc_cell = grating_coupler(
    waveguide_width=0.5,
    layer=layers.core.layer,
    period=0.63,
    fill_factor=0.5,
    num_periods=20
)
# Port: opt (connects to waveguide)
```

### GC I/O Pattern

```python
from rosette import Cell, Route, load_layer_map, write_gds
from components import grating_coupler

layers = load_layer_map()
layer = layers.core.layer
gc_cell = grating_coupler(waveguide_width=0.5, layer=layer)

# Position GCs
gc_in = gc_cell.at(0, 0)
gc_out = gc_cell.at(100, 0)

# Route between them
route = Route.through(gc_in.port("opt"), gc_out.port("opt"), layer=layer, bend_radius=5.0)

# Assemble
top = Cell("gc_io")
top.add_ref(gc_in)
top.add_ref(gc_out)
top.add_ref(route.to_cell("waveguide"))
write_gds("output.gds", top)
```

## Delay Lines

### Spiral Delay Line

```python
from rosette import load_layer_map
from components import spiral

layers = load_layer_map()
spiral_cell = spiral(
    width=0.5,
    layer=layers.core.layer,
    turns=5,
    min_radius=20.0,
    spacing=2.0
)
print(f"Path length: {spiral_cell.path_length:.1f}um")
```

## Waveguide Crossings

### Basic Crossing

```python
from rosette import load_layer_map
from components import crossing

layers = load_layer_map()
crossing_cell = crossing(width=0.5, layer=layers.core.layer)
# Ports: in1, out1 (horizontal), in2, out2 (vertical)
```

## Phase-Sensitive Designs

### Path Length Matching

```python
from rosette import Route, load_layer_map

layers = load_layer_map()
layer = layers.core.layer

# Arm 1: straight
route1 = Route(layer, width=0.5, bend_radius=10.0)
route1.start_at(0, 0)
route1.end_at(100, 0)
cell1 = route1.to_cell("arm1")

# Arm 2: with detour
route2 = Route(layer, width=0.5, bend_radius=10.0)
route2.start_at(0, 10)
route2.to(25, 10)
route2.to(25, 60)   # Detour up
route2.to(75, 60)
route2.to(75, 10)   # Detour down
route2.end_at(100, 10)
cell2 = route2.to_cell("arm2")

print(f"Arm 1: {route1.path_length:.2f}um")
print(f"Arm 2: {route2.path_length:.2f}um")
print(f"Difference: {abs(route1.path_length - route2.path_length):.2f}um")
```

## Design Rule Checking

### Load Rules from rosette.toml (Recommended)

Rules are defined in `rosette.toml` and loaded automatically:

```python
from rosette import load_drc_rules, run_drc

# Load rules from rosette.toml
rules = load_drc_rules()

# Run DRC on your design
result = run_drc(top_cell, rules)

if result.passed:
    print("DRC passed!")
else:
    print(f"DRC failed with {len(result)} violations:")
    for v in result.violations:
        print(f"  [{v.severity}] {v.rule_name}: {v.message}")
```

### rosette.toml DRC Configuration

```toml
# rosette.toml
[drc.layers."1/0"]  # Waveguide layer (Layer 1, datatype 0)
min_width = 0.12    # Minimum feature width (um)
min_spacing = 0.13  # Minimum spacing between features (um)
min_area = 0.01     # Minimum polygon area (um²)
angles = [0, 45, 90, 135, 180, 225, 270, 315]  # Allowed edge angles

[drc.layers."2/0"]  # Slab layer
min_width = 0.5
min_spacing = 0.25
```

### Manual Rules (For Custom Checks)

```python
from rosette import DrcRules, load_layer_map

layers = load_layer_map()

# Build rules programmatically using named layers
rules = (
    DrcRules()
    .min_width(layers.core.layer, 0.12, name="WG.W.1")
    .min_spacing(layers.core.layer, layers.core.layer, 0.13, name="WG.S.1")
    .require_enclosure(layers.core.layer, layers.clad.layer, 1.0, name="CLAD.E.1")
)
```

## Tips

- **Bend direction**: Positive angle = counter-clockwise, negative = clockwise
- **Auto-taper**: Route auto-tapers when you specify `width` at waypoints
- **Path length**: `route.path_length` gives cumulative optical path
- **Units**: All dimensions in micrometers (um), angles in degrees
- **Port names**: Check component port names in AGENTS.md or component source
- **Hierarchical designs**: Child cells are auto-tracked when using `.at()` or adding `Cell` directly
- **DRC early and often**: Run `run_drc()` after major design changes to catch issues early
