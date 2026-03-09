#!/usr/bin/env python3
"""Basic primitive shapes - rectangles, polygons, and cell references.

This example demonstrates the fundamental rosette primitives without
any photonic-specific components. Great for learning the core API.
"""

from rosette import Cell, Layer, Point, Polygon, Port, Vector2, load_layer_map, write_gds

# Load layer definitions from rosette.toml
layers = load_layer_map()

# Use named layers from the layer map, with fallbacks for extra layers
core = layers.core.layer  # Layer(1, 0) - waveguide core
clad = layers.clad.layer  # Layer(2, 0) - cladding
marker = Layer(10, 0)  # Additional layers can still use Layer() directly

# =============================================================================
# Basic Polygons
# =============================================================================

# Create a simple cell with a rectangle
rect_cell = Cell("rectangle")
rect_cell.add_polygon(Polygon.rect(Point(0, 0), 20, 10), core)

# Add a port on the right side
rect_cell.add_port(Port("east", Point(20, 5), Vector2(1, 0), 10))

# Create a cell with a custom polygon (triangle)
triangle_cell = Cell("triangle")
triangle_cell.add_polygon(
    Polygon([Point(0, 0), Point(30, 0), Point(15, 25)]),
    clad,
)

# Create a cell with a ring (polygon with hole)
ring_cell = Cell("ring")
outer = Polygon.regular(Point(0, 0), radius=20, sides=32)
inner = Polygon.regular(Point(0, 0), radius=12, sides=32)
ring_cell.add_polygon(outer, core)
ring_cell.add_polygon(inner, core)  # Overlapping polygons - viewer may XOR these

# =============================================================================
# Cell Hierarchy
# =============================================================================

# Create a top-level cell that references other cells
# Use 'design' as the conventional name for `rosette serve` and `rosette build`
design = Cell("basic_shapes")
top = design  # alias for backward compatibility

# Place rectangles using the ergonomic .at() syntax
top.add_ref(rect_cell.at(0, 0))
top.add_ref(rect_cell.at(0, 20))
top.add_ref(rect_cell.at(0, 40).mirror_x())  # Mirrored instance

# Place triangle with rotation
top.add_ref(triangle_cell.at(50, 0))
top.add_ref(triangle_cell.at(50, 40).rotate(180))

# Place ring
top.add_ref(ring_cell.at(120, 25))

# Add a marker rectangle directly to top cell
top.add_polygon(Polygon.rect(Point(-5, -5), 150, 80), marker)

# =============================================================================
# Output (only when run directly, not when imported by rosette serve)
# =============================================================================

if __name__ == "__main__":
    write_gds("output/basic_shapes.gds", top)
    print("Wrote output/basic_shapes.gds")
    print(f"Top cell: {top.polygon_count()} polygons, {top.ref_count()} refs")
