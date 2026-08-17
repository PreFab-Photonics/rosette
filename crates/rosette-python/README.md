# rosette-python

PyO3 bindings for rosette, compiled to the `rosette._core` extension module. Aggregates the full analysis pipeline for the Python API.

- **Depends on:** rosette-core, rosette-checks, rosette-drc, rosette-dfm, rosette-geometry, rosette-io, rosette-raster, rosette-route
- **Consumed by:** the Python wrappers (`python/rosette/_api.py`) and public modules

Rebuild after any Rust change with `uv run maturin develop`. See the workspace [`AGENTS.md`](../../AGENTS.md) for the crate map, and `cargo doc -p rosette-python --open` for the API reference.
