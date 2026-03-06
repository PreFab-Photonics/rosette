# rosette-core

Core geometry types and data structures for photonic layout.

## Overview

This crate provides the fundamental types for creating photonic layouts:

- **Geometry**: `Point`, `Polygon`, `Transform`, `BBox`
- **Layout**: `Layer`, `Port`, `Cell`, `CellRef`

## Key Types

| Type | Description |
|------|-------------|
| `Point` | 2D coordinate (x, y) |
| `Polygon` | Closed polygon defined by vertices |
| `Transform` | Affine transformation (translate, rotate, scale, mirror) |
| `BBox` | Axis-aligned bounding box |
| `Layer` | GDS layer number and datatype |
| `Port` | Named connection point with position and direction |
| `Cell` | Container for geometry, can reference other cells |
| `CellRef` | Reference to another cell with transformation |

## Usage

```rust
use rosette_core::{Cell, Layer, Point, Polygon};

// Create geometry
let rect = Polygon::rect(Point::origin(), 10.0, 5.0);

// Add to cell
let mut cell = Cell::new("my_cell");
cell.add_polygon(rect, Layer::new(1, 0));
```

## Module Structure

```
src/
├── lib.rs           # Public API exports
├── geometry/
│   ├── mod.rs       # Geometry module
│   ├── point.rs     # Point, Vector2
│   ├── polygon.rs   # Polygon
│   ├── transform.rs # Transform
│   └── bbox.rs      # BBox
├── layer.rs         # Layer
├── port.rs          # Port
└── cell.rs          # Cell, CellRef
```
