# rosette-python

PyO3 bindings for rosette, compiled to the `rosette._core` extension module. Aggregates the full analysis pipeline for the Python API.

- **Depends on:** rosette-core, rosette-checks, rosette-drc, rosette-dfm, rosette-io, rosette-raster
- **Consumed by:** the Python wrapper (`python/rosette/__init__.py`)

Rebuild after any Rust change with `uv run maturin develop`. See the workspace [`AGENTS.md`](../../AGENTS.md) for the crate map, and `cargo doc -p rosette-python --open` for the API reference.
