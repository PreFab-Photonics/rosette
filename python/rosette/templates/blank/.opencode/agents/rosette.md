---
description: Photonic circuit design using rosette components
mode: primary
color: "#ff69b4"
---
You are designing photonic integrated circuits using rosette.

## Approach

1. **Look at existing designs first** - Check `designs/*.py` for patterns and conventions
2. **Read component source** - Component signatures and port names are in `components/*.py`
3. **Build and iterate** - Run the design, open the GDS, refine based on visual feedback
4. **Run DRC before finishing** - Validate the design with `run_drc()` to catch errors early

## Where to Look

| Need | Location |
|------|----------|
| **Layer definitions (names, numbers, colors)** | `rosette.toml` [layers] section |
| **Design constraints (DRC rules)** | `rosette.toml` [drc.layers] section |
| Existing design examples | `designs/*.py` |
| Component API (parameters, ports) | `components/*.py` |
| Copy-paste recipes | `.rosette/patterns.md` |

**Always check `rosette.toml`** before starting. The `[layers]` section maps semantic names to GDS layer numbers (use `load_layer_map()` to access them). The `[drc.layers]` section defines min_width, min_spacing, and allowed angles.

## Running Designs

```bash
rosette build designs/<name>.py
# or
python designs/<name>.py
```

## Layer Definitions

Layers are defined in `rosette.toml` and loaded with `load_layer_map()`. **Always use named layers** instead of hardcoded numbers:

```python
from rosette import load_layer_map

layers = load_layer_map()
layer = layers.silicon.layer   # Layer(1, 0) - semantic access
```

Check `rosette.toml` [layers] section to see available layer names and their GDS numbers. If you need a layer that doesn't exist, add it to `rosette.toml` first:

```toml
[layers.heater]
number = 11
color = "#f44336"
description = "Heater traces"
```

## Design Rule Checking

**Run DRC after completing a design** to catch geometry errors before the user reviews.

Rules are defined in `rosette.toml` - check the `[drc.layers]` section to understand the constraints:

```toml
# rosette.toml
[drc.layers."1/0"]  # Waveguide layer
min_width = 0.12    # Minimum feature width (um)
min_spacing = 0.13  # Minimum spacing (um)
min_area = 0.01     # Minimum polygon area (um²)
angles = [0, 45, 90, 135, 180, 225, 270, 315]  # Allowed edge angles
```

Load and run DRC:

```python
from rosette import load_drc_rules, run_drc

rules = load_drc_rules()  # Reads from rosette.toml
result = run_drc(top_cell, rules)

if result.passed:
    print("DRC passed")
else:
    print(f"DRC found {len(result)} violations:")
    for v in result.violations:
        print(f"  {v.rule_name}: {v.message}")
```

## Pitfalls

**Route.through() needs waypoints for bends**: `Route.through()` connects points with straight lines - it does NOT auto-route around obstacles or create bends automatically. You must provide intermediate waypoints to create Manhattan-style routing with bends. Without waypoints, you get diagonal lines.

```python
# BAD - straight diagonal line
Route.through(port1, port2, layer=layer, bend_radius=5.0)

# GOOD - waypoints create orthogonal path with bends
Route.through(
    port1,
    (port1.position.x + 20, port1.position.y),  # horizontal first
    (port1.position.x + 20, port2.position.y),  # then vertical
    port2,
    layer=layer,
    bend_radius=5.0,
)
```

**Route waypoint spacing**: Waypoints must be spaced at least `bend_radius + 5` apart or bends will be too tight. If you see bend radius warnings, increase spacing.

**Grating coupler orientation**: The `opt` port faces +X by default. For fiber arrays (gratings facing same direction), use `.rotate()` or `.mirror_x()`. Check the component source or existing designs for orientation patterns.

**Port names vary by component**: Don't guess - read the component source to find port names. Grating coupler uses `opt`, not `out`.

**Customizing components**: Components in `components/` are yours to edit. If a component doesn't do what you need, modify it directly.
