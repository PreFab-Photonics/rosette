# AGENTS.md

Layout editor for integrated photonic circuits. Rust core with Python bindings, web-based viewer app, docs site.

## Structure

```
crates/rosette-core     Geometry, layout, routing, cell hierarchy
crates/rosette-checks   Check framework (orchestrates DRC, ...)
crates/rosette-drc      Design rule checking
crates/rosette-dfm      Design-for-manufacturing models
crates/rosette-io       GDS-II reader/writer
crates/rosette-raster   Rasterization
crates/rosette-python   PyO3 bindings -> rosette._core
crates/rosette-wasm     WASM + WebGPU renderer

python/rosette/         Python API, CLI, dev server
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
uv run basedpyright python/                        # Python type check
bun run lint && bun run fmt                        # App lint (run from app/)

bun dev                                            # App dev server (from app/)
bun run build:wasm                                 # Rebuild WASM (from app/)
```

### CLI commands (user-facing)

```bash
rosette init                                       # Scaffold a new project
rosette serve [designs/file.py]                    # Dev server with live preview
rosette build designs/file.py                      # Build design to GDS
rosette build designs/file.py --check              # Build with DRC pre-check
rosette check designs/file.py                      # Run all checks (DRC, design checks; --include-dfm)
rosette drc designs/file.py                        # Run DRC only
rosette dfm designs/file.py                        # Run DFM prediction (--gds writes predicted polygons)
rosette shot designs/file.py -o out.png            # Render a design region to PNG (AI visual inspection)
rosette run output/file.gds                        # View a GDS file
rosette update                                     # Update AGENTS.md to latest template
rosette --version                                  # Print version
```

`ro` is a short alias for `rosette`. Running bare `rosette` with no args opens an interactive command picker.

## Key Conventions

**PyO3 boundary:** Rust uses radians, Python uses degrees — convert at the binding layer. PyO3 wrappers use `Py` prefix (`PyPoint`, `PyCell`). When adding or changing a binding, update `python/rosette/_core.pyi`.

**Python wrappers:** `__slots__` on all classes. `_inner` holds the Rust object. `_from_inner` classmethod to wrap existing Rust objects.

**Templates:** `rosette init` copies from `python/rosette/templates/blank/` or `python/rosette/templates/generic/`. Check if changes need template updates.

**API docs:** Every `__all__` symbol (in `python/rosette/__init__.py`) needs a docs page in `www/content/docs/api-reference/` — classes get their own `.mdx`, functions/constants go on `index.mdx`. Verify with `uv run python www/scripts/check-api-docs.py`; update docs when changing public API.

## Bundling & Release

The wheel embeds a gitignored bundle, regenerated before any local wheel build (CI does this automatically on `v*` tags):

- **Web app** (`python/rosette/_webapp/`): viewer served by `rosette serve`/`run`. Build with `scripts/bundle_webapp.py` (runs `bun run build` in `app/`, copies `app/dist/`). Included via `pyproject.toml` `include`.
