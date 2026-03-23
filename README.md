# Rosette

A modern GDSII layout editor for integrated circuits. Fast. Intelligent. Accessible.

By [PreFab Photonics](https://prefabphotonics.com).

### Highlights

- **Fast** — A Rust core and GPU rendering that keeps you in the flow. From geometry operations to live preview, every layer of the stack is built for speed.
- **Intelligent** — AI-native from the ground up. Agent instructions and direct code access give LLM agents the context to design circuits alongside you.
- **Accessible** — A clean Python API, a modern desktop app, and documentation written for engineers. Professional tools without the learning cliff.

## Quickstart

Requires [uv](https://docs.astral.sh/uv/) and Python 3.11+.

```bash
mkdir my-chip && cd my-chip
uv init
uv add librosette
uv run rosette init
```

`rosette init` walks you through template and AI tool selection, then scaffolds your project with editable components, layer config, and agent instructions.

### Commands

| Command                  | Description                           |
| ------------------------ | ------------------------------------- |
| `rosette init`           | Initialize rosette in current project |
| `rosette build <design>` | Compile a design script to GDS        |
| `rosette serve [design]` | Start dev server with live preview    |
| `rosette run <file.gds>` | View a GDS file                       |

Run commands with `uv run rosette <command>`, or activate the venv first (`source .venv/bin/activate`).

## License

MIT
