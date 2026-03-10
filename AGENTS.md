# AGENTS.md

Library development for rosette. For photonic design work, use the **rosette** agent (Tab).

## Architecture

Rust core (`crates/`) -> PyO3 -> `rosette._core` -> Python wrapper (`python/rosette/__init__.py`)

Components are Python functions users own and customize (shadcn-style). They live in `python/rosette/components/` and get copied to user projects via `rosette init`.

## Commands

```bash
# Build & test
cargo test && uv run pytest              # Full test suite
uv run maturin develop                   # Rebuild Python bindings after Rust changes

# Single test
cargo test -p rosette-core waveguide     # Rust: crate + filter
uv run pytest python/tests/test_foo.py::TestClass::test_method -v

# Lint
cargo fmt && cargo clippy -- -D warnings
uv run ruff check python/ && uv run ruff format python/
```

## Where Things Live

| What                      | Where                             |
| ------------------------- | --------------------------------- |
| Geometry, layout, routing | `crates/rosette-core/src/`        |
| GDS writer                | `crates/rosette-io/src/gds/`      |
| PyO3 bindings             | `crates/rosette-python/src/`      |
| Python API wrapper        | `python/rosette/__init__.py`      |
| Type stubs                | `python/rosette/_core.pyi`        |
| Components                | `python/rosette/components/`      |
| CLI                       | `python/rosette/cli.py`           |
| Project template          | `python/rosette/templates/blank/` |

## Code Conventions

**Rust:** Standard rustfmt. Group imports (std, external, workspace, local). Use `thiserror` for errors, avoid `unwrap()` outside tests.

**Python:** Ruff defaults. Modern type hints (`list[str]`, `Path | None`). Class-based pytest organization.

**Float comparisons:** `const EPSILON: f64 = 1e-10` (Rust), `pytest.approx()` (Python).

## Template System

`rosette init` copies from `templates/blank/`:

- `AGENTS.md.template` -> user's `AGENTS.md` (design instructions)
- `.opencode/agents/rosette.md` -> rosette agent configuration
- `.rosette/patterns.md` -> copy-paste recipes
- `components/` -> editable component implementations

When modifying agent behavior for design workflows, edit the template files, not this file.

## Keeping Templates in Sync

When making changes to the library, check if related updates are needed in:

- **Agent configuration files** in `.opencode/` - update if changing workflows, commands, or conventions
- **Template files** in `python/rosette/templates/` - update if changing APIs, components, or project structure that affects new user projects

These files define the experience for AI agents and new projects, so they should stay consistent with the library's actual behavior.
