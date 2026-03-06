# Rosette

A photonic layout library for designing integrated circuits. Rust core with Python bindings.

## Installation

```bash
pip install rosette
```

## Quick Start

```python
from rosette import *

# Create a simple waveguide route
route = Route(Layer(1, 0), width=0.5, bend_radius=10.0)
route.start_at(0, 0)
route.to(100, 0)
route.to(100, 50)
route.end_at(150, 50)

cell = route.to_cell("my_route")
write_gds("output.gds", cell)
```

## Components

| Component            | Description                               |
| -------------------- | ----------------------------------------- |
| `Waveguide`          | Straight waveguide section                |
| `Bend`               | Circular or Euler bend                    |
| `Taper`              | Width transition                          |
| `SBend`              | S-curve lateral offset                    |
| `MMI`                | Multi-mode interferometer (1x2, 2x1, 2x2) |
| `DirectionalCoupler` | Evanescent coupler                        |
| `YBranch`            | Y-junction splitter                       |
| `Ring`               | Ring resonator (all-pass or add-drop)     |
| `Spiral`             | Compact delay line                        |
| `GratingCoupler`     | Fiber-to-chip coupler                     |
| `Crossing`           | Waveguide intersection                    |

## CLI

```bash
rosette init my_project    # Create a new project
rosette build design.py    # Build design to GDS
```

## Development

```bash
# Install dependencies
uv sync --dev

# Build Python package
uv run maturin develop

# Run tests
cargo test
uv run pytest
```
