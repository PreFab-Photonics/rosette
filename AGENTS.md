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

### CLI commands (user-facing)

```bash
rosette init                                       # Scaffold a new project
rosette serve [designs/file.py]                    # Dev server with live preview
rosette build designs/file.py                      # Build design to GDS
rosette build designs/file.py --check              # Build with DRC pre-check
rosette check designs/file.py                      # Run all checks (DRC, ...)
rosette drc designs/file.py                        # Run DRC only
rosette run output/file.gds                        # View a GDS file
rosette --version                                  # Print version
```

`ro` is a short alias for `rosette`. Running bare `rosette` with no args opens an interactive command picker.

## Key Conventions

**PyO3 boundary:** Rust uses radians, Python uses degrees — convert at the binding layer. PyO3 wrappers use `Py` prefix (`PyPoint`, `PyCell`). When adding or changing a binding, update `python/rosette/_core.pyi`.

**Python wrappers:** `__slots__` on all classes. `_inner` holds the Rust object. `_from_inner` classmethod to wrap existing Rust objects.

**Templates:** `rosette init` copies from `python/rosette/templates/blank/` or `python/rosette/templates/generic/`. Check if changes need template updates.

**API docs:** Every symbol in `__all__` (in `python/rosette/__init__.py`) must have a corresponding docs page in `www/content/docs/api-reference/`. Classes get their own `.mdx` file, functions and constants are documented on `index.mdx`. Run `uv run python www/scripts/check-api-docs.py` to verify. When adding or changing a public API symbol, update the docs page to match.
