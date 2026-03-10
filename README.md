# Rosette

A modern layout editor for photonic integrated circuits — fast, intelligent, and collaborative.

Rosette combines a Rust-powered geometry engine with a Python API and a WebGPU visual editor. Design PICs with code, an AI agent, or visually. The output is fabrication-ready GDSII.

### Highlights

- **Fast visual editor** — WebGPU-rendered layout viewer with hot reload, layer controls, and cell hierarchy. Edit code, see changes instantly.
- **Rust core, Python API** — Geometry, routing, and DRC run in compiled Rust. You work in Python.
- **AI-native** — Every project includes agent instructions, type stubs, and structured feedback so AI coding tools can design circuits alongside you.

## Installation

```bash
pip install rosette
```

## Getting Started

Start a project:

```bash
rosette init my_chip
cd my_chip
```

This gives you a `rosette.toml` config (layers, DRC rules), editable components, example designs, and AI agent instructions. Build and preview with:

```bash
rosette build designs/basic_shapes.py
rosette serve designs/basic_shapes.py
```

Or use Rosette as a library in any Python script:

```python
from rosette import Cell, Layer, Point, Polygon, write_gds

cell = Cell("my_design")
cell.add_polygon(Polygon.rect(Point(0, 0), 20, 10), Layer(1, 0))

write_gds("output.gds", cell)
```

## License

MIT
