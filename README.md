<p align="center">
  <img src="https://raw.githubusercontent.com/PreFab-Photonics/rosette/main/www/public/rosette-logo.svg" alt="Rosette" width="200" />
</p>

# Rosette

A modern GDSII layout editor for integrated circuits. Fast. Intelligent. Accessible.

By [PreFab Photonics](https://prefabphotonics.com).

> [!WARNING]
> Rosette is in early development. The API is unstable and will have breaking changes. Not suitable for production use.

### Highlights

- **Fast** — A Rust core and GPU rendering that keeps you in the flow. From geometry operations to live preview, every layer of the stack is built for speed.
- **Intelligent** — AI-native from the ground up. Agent instructions and direct code access give LLM agents the context to design circuits alongside you.
- **Accessible** — A clean Python API, a modern desktop app, and documentation written for engineers. Professional tools without the learning cliff.

## Quickstart

Requires [uv](https://docs.astral.sh/uv/) and Python 3.11+.

```bash
uvx --from librosette rosette init my-chip
cd my-chip
```

`rosette init` creates the project directory, bootstraps uv (`uv init --bare`, `uv add librosette`, `git init`), then walks you through template and AI tool selection before scaffolding your project with editable components, layer config, and agent instructions. `uvx` runs the CLI in a throwaway environment, so this works before anything is installed.

Prefer to set things up yourself? Create the project first, then init in place:

```bash
mkdir my-chip && cd my-chip
uv init
uv add librosette
uv run rosette init
```

Run commands with `uv run rosette <command>`, or install the CLI globally with `uv tool install librosette` to use `rosette` directly. See the [installation guide](https://rosette.dev/docs/getting-started/installation) for details.

### Commands

```bash
rosette init                      # Scaffold a new project
rosette serve [design.py]         # Dev server with live preview
rosette build design.py           # Build design to GDS
rosette build design.py --check   # Build with DRC pre-check
rosette check design.py           # Run all checks (DRC, design checks)
rosette drc design.py             # Run DRC only
rosette run output.gds            # View a GDS file
rosette --version                 # Print version
```

`ro` is a short alias for `rosette`. Running bare `rosette` with no args opens an interactive command picker.

## Documentation

Full docs, API reference, and component library at **[rosette.dev/docs](https://rosette.dev/docs)**.

## License

MIT
