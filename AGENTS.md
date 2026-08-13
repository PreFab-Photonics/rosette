# AGENTS.md

AI-native, scriptable GDSII layout editor for integrated circuits, focused on silicon photonics. Rust core with Python bindings, web-based viewer app, docs site.

## Structure

```
crates/rosette-core     Geometry, atomic layout types, cell hierarchy
crates/rosette-checks   Check framework (orchestrates DRC, ...)
crates/rosette-drc      Design rule checking
crates/rosette-dfm      Design-for-manufacturing models
crates/rosette-io       GDS-II and versioned layout JSON reader/writer
crates/rosette-raster   Rasterization
crates/rosette-route    Photonic routing algorithms and diagnostics
crates/rosette-python   PyO3 bindings -> rosette._core
crates/rosette-wasm     WASM + WebGPU renderer

python/rosette/         Python API, CLI, dev server
  components/           Photonics devices (mmi, ring, sbend, grating_coupler, ...)
app/                    Viewer app (React/TS, WebGPU canvas)
app/src-tauri/          Tauri desktop wrapper
www/                    Docs site (Next.js + fumadocs) — see www/AGENTS.md
designs/                Example design scripts
```

Pipeline: `rosette-core` + feature crates such as `rosette-route` -> PyO3 (`rosette-python`) -> `rosette._core` -> Python wrappers (`python/rosette/_api.py`) -> the root facade and public feature modules.

## Commands

```bash
cargo test && uv run pytest                        # Full test suite
uv run maturin develop                             # Rebuild bindings after ANY Rust change
cargo test -p rosette-core waveguide               # Single Rust test
uv run pytest python/tests/test_file.py::Test -v   # Single Python test
bun run test                                       # App tests (vitest, from app/)

cargo fmt && cargo clippy -- -D warnings           # Rust lint
uv run ruff check python/ && uv run ruff format python/  # Python lint
uv run basedpyright python/rosette                 # Python type check (tests excluded)
bun run lint && bun run fmt                        # App lint (run from app/)
bun run tsc --noEmit                               # App type check (from app/)

bun dev                                            # App dev server (from app/)
bun run build:wasm                                 # Rebuild WASM (from app/)
uv run python scripts/bundle_webapp.py             # Rebuild local serve/run viewer bundle
```

CI gates on the non-mutating forms: `ruff format --check python/` and `bun fmt:check`.

### CLI commands (user-facing)

`uv run rosette shot designs/file.py -o out.png` renders a design region to PNG — use it
to visually inspect your own work. Use `uv run` for every `rosette` command; a bare
`rosette` resolves to a globally installed build that won't reflect local changes.
Full surface: `uv run rosette --help` or `uv run rosette cli-manifest`.

## Key Conventions

**PyO3 boundary:** Rust uses radians, Python uses degrees — convert at the binding layer. PyO3 wrappers use `Py` prefix (`PyPoint`, `PyCell`). When adding or changing a binding, update the native `python/rosette/_core.pyi`; update the agent facade contract in `python/rosette/api.pyi` separately when the public facade changes.

**Python wrappers:** `__slots__` on all classes. `_inner` holds the Rust object. `_from_inner` classmethod to wrap existing Rust objects.

**Templates:** `rosette init` scaffolds from `python/rosette/templates/{blank,generic}/`. Each template stores one harness-neutral instruction body (`agent-rules.md.template`) plus `skills/`; the `HARNESSES` adapter in `cli.py` projects them into each tool's files (`AGENTS.md` + `.agents/skills/` for most, `CLAUDE.md` + `.claude/skills/` for Claude Code). Read `HARNESSES` and `update_project()` in `cli.py` before changing any of this. Check whether your change needs a template update.

**API docs:** Every symbol exported by the root facade or a public feature module needs a docs page in `www/content/docs/api-reference/` — classes get their own `.mdx`, functions/constants go on `index.mdx`. New class pages must also be listed in `api-reference/meta.json` or the sidebar check fails. Verify with `uv run --no-project python www/scripts/check-api-docs.py`; update docs when changing public API.

**WASM bindings:** The app type-checks against `app/src/wasm/rosette_wasm.d.ts`, a checked-in cache of `wasm-pack` output (the rest of `app/src/wasm/` is gitignored). CI rebuilds wasm and fails if the committed stub's public API drifted. See Boundaries for how to regenerate it.

**JSON persistence:** `rosette-io` owns the versioned `rosette-layout` DTO and validated core conversions. Core model types must remain format-neutral and must not derive Serde for persistence.

## Boundaries

Never edit (generated): `target/`, `output/`, `app/src/wasm/*`, and `python/rosette/_webapp/` (viewer bundle built by `scripts/bundle_webapp.py`, gitignored, regenerated for wheel builds).

Exception: `app/src/wasm/rosette_wasm.d.ts` is a committed cache. After changing the `rosette-wasm` public API, run `bun run build:wasm` (from `app/`) and commit the stub with `git add -f` — wasm-pack writes a `src/wasm/.gitignore` of `*`.

Ask first: version bumps, PyPI publish, `.github/workflows/`.

## Gotchas

- Python 3.11 is the floor (`requires-python = ">=3.11"`; CI tests 3.11 and 3.14). Don't use 3.12+ syntax.
- `CHANGELOG.md` headings are parsed by `release-python.yml` to build the GitHub release — keep the `## [x.y.z] - YYYY-MM-DD` Keep a Changelog format.
