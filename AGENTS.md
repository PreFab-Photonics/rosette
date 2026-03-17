# AGENTS.md

Library development for rosette — an agentic design system for ICs.
For design work in user projects, use the **rosette** agent (Tab).

## Architecture

Rust core (`crates/`) -> PyO3 -> `rosette._core` -> Python wrapper (`python/rosette/__init__.py`)

Components are Python functions users own and customize (shadcn-style). They live in
`python/rosette/components/` and get copied to user projects via `rosette init`.

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
cargo test -p rosette-io roundtrip

# Single Python test (file::class::method)
uv run pytest python/tests/test_layout.py::TestCell::test_basic -v

# Lint (Rust)
cargo fmt && cargo clippy -- -D warnings

# Lint (Python)
uv run ruff check python/ && uv run ruff format python/

# App (run from app/ directory)
bun install && bun dev           # Dev server
bun lint && bun fmt              # Lint + format (oxlint/oxfmt)
bun run build:wasm               # Rebuild WASM after crates/rosette-wasm changes

# Packaging scripts (run from repo root)
python scripts/bundle_source.py  # Bundle Rust source into python/rosette/_source/ (before wheel build)
python scripts/bundle_webapp.py  # Build viewer app into python/rosette/_webapp/ (before publish)

# Docs site scripts
./scripts/build_landing_viewer.sh  # Build viewer embed for www/ landing page (calls generate_showcase.py)
```

## Where Things Live

| What                      | Where                             |
| ------------------------- | --------------------------------- |
| Geometry, layout, routing | `crates/rosette-core/src/`        |
| Design rule checking      | `crates/rosette-drc/src/`         |
| GDS reader/writer         | `crates/rosette-io/src/gds/`      |
| PyO3 bindings             | `crates/rosette-python/src/`      |
| WASM + WebGPU renderer    | `crates/rosette-wasm/src/`        |
| Python API wrapper        | `python/rosette/__init__.py`      |
| Type stubs                | `python/rosette/_core.pyi`        |
| Components                | `python/rosette/components/`      |
| CLI                       | `python/rosette/cli.py`           |
| Python tests              | `python/tests/`                   |
| Project templates         | `python/rosette/templates/blank/` |
| Viewer app (React/TS)     | `app/src/`                        |
| Docs site (Next.js)       | `www/`                            |

## Rust Conventions

**Naming:** PyO3 wrappers use `Py` prefix (`PyPoint`, `PyCell`). PyO3 functions use `py_` prefix.

**Visibility:** `pub` for API types re-exported at crate root. `pub(crate)` for internal
helpers (`set_name_unchecked`, `extract_layer`). Struct fields: `pub` for plain data
types (`Point`, `Layer`), private with accessors for invariant types (`Cell`, `Library`).

**Patterns:**

- Builder/fluent: `CellRef::new("sub").at(10.0, 20.0).rotate(PI / 2.0)`
- Newtype: all PyO3 wrappers (`pub struct PyPoint(pub Point)`)
- `impl Into<T>` for flexible params: `fn new(name: impl Into<String>)`
- `From` trait for ergonomic conversions: `Layer` from `u16` or `(u16, u16)`
- Immutable transforms: geometry methods return new values, never mutate
- Conditional serde: `#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]`

**Module structure:** `mod.rs` re-exports public types. `lib.rs` is a facade —
users do `use rosette_core::{Cell, Point}`, not deep paths.

**Tests:** Define local `const EPSILON: f64 = 1e-10` and `fn approx_eq()` per test
module. Use `1e-10` for geometry precision, `1e-6` for routing/integration.

**PyO3 bindings:** Angles convert at boundary (Rust radians, Python degrees).
Layer extraction accepts `Layer | int | (int, int)` via shared `extract_layer()`.
Errors map to `PyValueError`: `.map_err(|e| PyValueError::new_err(e.to_string()))`.
Use `#[pyo3(signature = (x=0.0, y=0.0))]` for defaults. When adding or changing a
binding, update the type stubs in `python/rosette/_core.pyi` to match.

## Python Conventions

**Classes:** Use `__slots__` (listed alphabetically) on all wrapper classes.
Private `_inner` attribute holds the Rust object. `_from_inner` classmethod wraps
existing Rust objects. Accept both wrapper and Rust types in public APIs.

**Errors:** `ValueError` with clear messages for invalid input. `FileNotFoundError`
with action hints. CLI errors use `print()` + `sys.exit(1)`. Warnings via
`warnings.warn(..., stacklevel=2)`.

**Components:** Each is a function returning `Cell`. First param is always `layer: Layer`.
Validate inputs, create Cell with abbreviated parameterized name (GDS 32-char limit,
e.g., `f"sb_l{length:.2f}_o{offset:.2f}"`), build geometry, add ports, set
`cell.path_length`, return. Private helpers prefixed with `_`.

**Tests:** Fixtures in `conftest.py`. Use `pytest.approx()` for floats.

## Tauri Desktop App (`app/src-tauri/`)

Small Rust crate wrapping the web viewer as a native app. See `app/AGENTS.md` for the
full web viewer conventions.

**Commands return `Result<T, String>`** (Tauri convention — errors serialize to frontend).
Map errors with `.map_err(|e| format!("Failed to ...: {e}"))`. No `thiserror` here.

**State:** `AppState` struct with `Mutex`-wrapped fields, injected via `State<'_, AppState>`.
Use `let _ = ...` to discard non-critical results. Use `expect()` only for truly
unrecoverable failures in `main()`.

**Platform code:** `#[cfg(target_os = "macos")]` / `#[cfg(not(...))]` for OS-specific paths.
Build explicitly: `cargo build -p rosette-desktop` (excluded from default workspace members).

## Docs Site (`www/`)

Next.js 16 + fumadocs + Biome. Content in `www/content/docs/` (MDX).

```bash
# Run from www/ directory
bun install && bun dev              # Dev server
bun lint                            # Biome check
bun format                          # Biome format --write
bun run types:check                 # TypeScript type check
```

**Components:** Named `export function` (not default, not arrow). `"use client"` only
when hooks/browser APIs are needed. Server components by default.

**Styling:** Tailwind v4 inline classes. Brand colors via `@theme` in `global.css`
(e.g., `bg-brand-purple`). Dark mode via `.dark` class with inline variants.

**Types:** `type` keyword for type-only imports (`import type { Metadata } from "next"`).

## Template System

`rosette init` copies from `templates/blank/`:

- `AGENTS.md.template` -> user's `AGENTS.md` (design instructions)
- `CLAUDE.md.template` -> user's `CLAUDE.md` (Claude Code instructions)
- `.opencode/agents/rosette.md` -> rosette agent configuration
- `.rosette/patterns.md` -> copy-paste recipes
- `components/` -> editable component implementations

When modifying agent behavior for design workflows, edit the template files, not this file.

## Keeping Templates in Sync

When making changes to the library, check if related updates are needed in:

- **Agent configuration files** in `.opencode/` — update if changing workflows, commands, or conventions
- **Template files** in `python/rosette/templates/` — update if changing APIs, components,
  or project structure that affects new user projects
