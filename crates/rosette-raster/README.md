# rosette-raster

CPU polygon rasterizer (vector → PNG) for photonic layouts, via tiny-skia. Output is deterministic and paired with a view transform so any pixel maps back to design coordinates.

- **Depends on:** rosette-core
- **Consumed by:** rosette-python (`rosette.render_png`, the `rosette shot` CLI command)

See the workspace [`AGENTS.md`](../../AGENTS.md) for the crate map, and `cargo doc -p rosette-raster --open` for the API reference.
