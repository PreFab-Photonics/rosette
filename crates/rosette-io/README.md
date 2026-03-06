# rosette-io

File I/O for photonic layout, supporting GDS II format.

## Overview

This crate handles reading and writing layout files. Currently supports:

- **GDS II**: Industry-standard binary format for IC/photonic layout

## Usage

### Writing GDS

```rust
use rosette_core::{Cell, Layer, Point, Polygon};
use rosette_io::gds;

let mut cell = Cell::new("TOP");
cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));

gds::write("output.gds", &cell)?;
```

### Writing a Library

```rust
use rosette_core::{Library, Cell, CellRef};
use rosette_io::gds;

let mut lib = Library::new("mylib");

let mut sub = Cell::new("SUB");
// ... add geometry to sub

let mut top = Cell::new("TOP");
top.add_ref(CellRef::new("SUB").at(10.0, 0.0));

lib.add_cell(sub);
lib.add_cell(top);

gds::write_library("output.gds", &lib)?;
```

## Module Structure

```
src/
├── lib.rs        # Public API
└── gds/
    ├── mod.rs    # GDS module
    ├── writer.rs # GDS binary writer
    └── reader.rs # GDS reader (future)
```

## GDS Format Notes

- Coordinates are stored as integers (database units)
- Default unit: 1 database unit = 1 nanometer
- User units: 1 micrometer = 1000 database units
