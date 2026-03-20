# AGENTS.md

Layout editor for integrated photonic circuits. Rust core with Python bindings, web-based viewer app, docs site.

## Structure

```
crates/rosette-core     Geometry, layout, routing, cell hierarchy
crates/rosette-drc      Design rule checking
crates/rosette-io       GDS-II reader/writer
crates/rosette-python   PyO3 bindings -> rosette._core
crates/rosette-wasm     WASM + WebGPU renderer

python/rosette/         Python API, CLI, dev server, code patcher
app/                    Viewer app (React/TS, WebGPU canvas)
app/src-tauri/          Tauri desktop wrapper
www/                    Docs site (Next.js + fumadocs)
designs/                Example design scripts
```

Pipeline: `rosette-core` -> PyO3 (`rosette-python`) -> `rosette._core` -> Python wrapper (`python/rosette/__init__.py`).

## Commands

```bash
cargo test && uv run pytest                        # Full test suite
uv run maturin develop                             # Rebuild bindings after ANY Rust change
cargo test -p rosette-core waveguide               # Single Rust test
uv run pytest python/tests/test_file.py::Test -v   # Single Python test

cargo fmt && cargo clippy -- -D warnings           # Rust lint
uv run ruff check python/ && uv run ruff format python/  # Python lint
bun lint && bun fmt                                # App lint (run from app/)

bun dev                                            # App dev server (from app/)
bun run build:wasm                                 # Rebuild WASM (from app/)
```

## Key Conventions

**PyO3 boundary:** Rust uses radians, Python uses degrees — convert at the binding layer. PyO3 wrappers use `Py` prefix (`PyPoint`, `PyCell`). When adding or changing a binding, update `python/rosette/_core.pyi`.

**Python wrappers:** `__slots__` on all classes. `_inner` holds the Rust object. `_from_inner` classmethod to wrap existing Rust objects.

**Templates:** `rosette init` copies from `python/rosette/templates/blank/`. Check if changes need template updates.
