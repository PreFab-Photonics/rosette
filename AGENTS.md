# AGENTS.md

Library development for rosette — a fast, intelligent, and accessible layout editor for integrated circuits.

## Architecture

```
crates/rosette-core   Geometry, layout, routing, cell hierarchy
crates/rosette-drc    Design rule checking
crates/rosette-io     GDS-II reader/writer
crates/rosette-python PyO3 bindings -> rosette._core
crates/rosette-wasm   WASM + WebGPU renderer

python/rosette/       Python API, CLI, dev server, code patcher
app/                  Viewer app (React/TS, WebGPU canvas)
app/src-tauri/        Tauri desktop wrapper
www/                  Docs site (Next.js + fumadocs)
designs/              Example design scripts
scripts/              Build/bundle helpers
```

**Rust -> Python pipeline:** `rosette-core` -> PyO3 (`rosette-python`) -> `rosette._core` -> Python wrapper (`python/rosette/__init__.py`).

**Live viewer loop:** `rosette serve` runs a design script, starts an HTTP server (`_server.py`), serves the bundled viewer app with the layout as JSON, watches for file changes, and streams updates via SSE. Edits in the viewer are patched back to source via `_patcher.py`.

## Commands

```bash
# Full test suite (Rust + Python)
cargo test && uv run pytest
# Note: cargo test only covers default members (core, drc, io, python)
# rosette-wasm and rosette-desktop are excluded from default workspace

# Rebuild Python bindings after ANY Rust change
uv run maturin develop

# Single Rust test (crate + name filter)
cargo test -p rosette-core waveguide

# Single Python test (file::class::method)
uv run pytest python/tests/test_layout.py::TestCell::test_basic -v

# Lint
cargo fmt && cargo clippy -- -D warnings          # Rust
uv run ruff check python/ && uv run ruff format python/  # Python
bun lint && bun fmt                                # App (run from app/)
bun lint && bun format                             # Docs (run from www/)

# App dev server (run from app/)
bun dev

# Rebuild WASM after crates/rosette-wasm changes (run from app/)
bun run build:wasm

# Packaging (run from repo root)
python scripts/bundle_source.py   # Bundle Rust source into python/rosette/_source/
python scripts/bundle_webapp.py   # Build viewer app into python/rosette/_webapp/
```

## Rust Conventions

**Naming:** PyO3 wrappers use `Py` prefix (`PyPoint`, `PyCell`). PyO3 functions use `py_` prefix.

**Visibility:** `pub` for API types re-exported at crate root. `pub(crate)` for internal helpers. Struct fields: `pub` for plain data types (`Point`, `Layer`), private with accessors for invariant types (`Cell`, `Library`).

**Patterns:** Builder/fluent (`CellRef::new("sub").at(10.0, 20.0).rotate(PI / 2.0)`). Newtype for PyO3 wrappers (`pub struct PyPoint(pub Point)`). `impl Into<T>` for flexible params. `From` trait for conversions. Immutable transforms (geometry methods return new values). Conditional serde (`#[cfg_attr(feature = "serde", ...)]`).

**Module structure:** `mod.rs` re-exports public types. `lib.rs` is a facade — users do `use rosette_core::{Cell, Point}`, not deep paths.

**Tests:** Local `const EPSILON: f64 = 1e-10` and `fn approx_eq()` per test module. Use `1e-10` for geometry, `1e-6` for routing/integration.

**PyO3 bindings:** Angles convert at boundary (Rust radians, Python degrees). Layer extraction accepts `Layer | int | (int, int)` via `extract_layer()`. Errors map to `PyValueError`. Use `#[pyo3(signature = (...))]` for defaults. When adding or changing a binding, update `python/rosette/_core.pyi`.

## Python Conventions

**Classes:** `__slots__` (alphabetical) on all wrapper classes. Private `_inner` holds the Rust object. `_from_inner` classmethod wraps existing Rust objects.

**Errors:** `ValueError` for invalid input. `FileNotFoundError` with action hints. CLI: `print()` + `sys.exit(1)`. Warnings: `warnings.warn(..., stacklevel=2)`.

**Components:** Function returning `Cell`. First param is always `layer: Layer`. Abbreviated parameterized name (GDS 32-char limit). Add ports, set `cell.path_length`. Private helpers prefixed `_`.

**Tests:** Fixtures in `conftest.py`. Use `pytest.approx()` for floats.

## Viewer App (`app/`)

React 19, TypeScript (strict), Zustand, Tailwind CSS v4, Vite 6, Bun, Oxlint, Oxfmt.

**Components:** Functional only, named exports, JSDoc on public components. `@/` path alias.

**State:** Zustand stores split by domain (`ui.ts`, `viewport.ts`). Interface-first design. Access with selectors: `useUIStore((s) => s.theme)`.

**Hooks:** `use-` prefix, return object with named properties. Handle cleanup in useEffect.

**Styling:** Tailwind inline. `clsx` + `tailwind-merge` via `cn()` for conditional classes.

### WASM Integration

WASM is built via `wasm-pack` into `src/wasm/`. `use-wasm.ts` handles async loading (singleton). `use-renderer.ts` creates the WebGPU renderer.

### Coordinate System

- `zoom`: pixels per world unit (higher = more zoomed in)
- `offset`: screen position of world origin
- Transform: `screenPos = worldPos * zoom + offset`
- Grid: 1 grid point = 1 nanometer

### HiDPI / Retina

Two coordinate spaces: **CSS pixels** (JS: mouse events, viewport store) and **physical pixels** (WASM: canvas buffer, GPU). Conversion at JS-WASM boundary in `use-renderer.ts` — scale offset/zoom/screen coords by `devicePixelRatio` before passing to WASM.

For new features: world-space geometry needs no DPR handling. Fixed-size UI elements scale by `viewport.dpr` in shader. Screen coords from JS to WASM multiply by DPR.

### Tauri Desktop (`app/src-tauri/`)

Small Rust crate wrapping the viewer as a native app. Commands return `Result<T, String>`. `AppState` with `Mutex`-wrapped fields. Platform-specific code via `#[cfg(target_os = "macos")]`. Build explicitly: `cargo build -p rosette-desktop`.

## Docs Site (`www/`)

Next.js 16 + fumadocs + Biome. Content in `www/content/docs/` (MDX).

**Components:** Named `export function` (not default). `"use client"` only when needed. Server components by default.

**Styling:** Tailwind v4 inline. Brand colors via `@theme` in `global.css`. Dark mode via `.dark` class.

## Templates

`rosette init` copies from `python/rosette/templates/blank/`. When making changes to the library, check if related updates are needed in template files or agent configs (`.opencode/`). Edit the templates, not this file, to change design workflow behavior.
