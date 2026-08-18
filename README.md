<p align="center">
  <img src="https://raw.githubusercontent.com/PreFab-Photonics/rosette/main/www/public/rosette-logo.svg" alt="Rosette" width="200" />
</p>

# Rosette

Open-source photonic layout tools for agents and humans.

Rosette is a scriptable GDS-II layout environment for integrated photonics. It
combines a typed Python API, a Rust core, and a local WebGPU viewer for designing,
checking, and reviewing layouts.

Built by [PreFab Photonics](https://prefabphotonics.com).

> [!WARNING]
> Rosette is beta software. The API is unstable, breaking changes are expected,
> and it is not suitable for production use.

## What does "agent-native" mean?

Rosette does not ship its own model or proprietary chat interface. It works with
the coding agents you already use, including Claude Code and AGENTS.md-compatible
tools such as OpenCode, Codex, and Cursor.

`rosette init` gives those agents the material they need to work effectively:
project instructions, task-focused API contracts, machine-readable layer and
design-rule configuration, editable component source, and focused skills.

Rosette deliberately exposes small, reusable primitives instead of trying to
pre-build every high-level circuit or workflow. Cells, ports, geometry, routes,
checks, and editable photonic components give agents the vocabulary and guardrails
to compose much larger designs.

The agent works in normal Python files and verifies its work with the same commands
you use:

```text
prompt -> write Python -> build GDS -> run checks -> fix violations -> repeat
```

No custom model, MCP server, or dedicated agent harness is required. The project
stays readable, editable, and version-controlled by you.

## Try it out

The quickest start requires [uv](https://docs.astral.sh/uv/) and Python 3.11+:

```bash
uvx --from librosette rosette init my-chip
cd my-chip
```

This creates a Python project, installs Rosette, and walks you through choosing a
project template and agent setup. Open the directory with your coding agent and
describe a design, or write the Python yourself.

Once you have a design script, the core workflow is:

```bash
rosette serve designs/my_design.py  # Live local preview
rosette check designs/my_design.py  # DRC, connectivity, and bend checks
rosette build designs/my_design.py  # Export GDS-II
```

The examples use `rosette` for readability. In a project managed by uv, prefix
commands with `uv run`; an activated virtual environment or global tool installation
can use them as shown. Run `rosette --help` for the complete CLI. Other installation
options are covered in the
[installation guide](https://rosette.dev/docs/getting-started/installation).

## What's included

- **Scriptable layout:** Geometry, ports, hierarchy, compact arrays, transforms,
  boolean operations, and GDS-II import and export through a typed Python API.
- **Photonic building blocks:** Minimal, editable components for common devices,
  designed to be composed into larger circuits.
- **Verification:** Checks for design rules, connectivity, and other layout
  constraints, with results both humans and agents can act on.
- **Visual inspection:** A local viewer with GPU rendering, hierarchy and layer
  controls, and hot reload for inspecting an entire design or a specific region.
- **Open foundations:** The Rust core, Python package, CLI, and viewer are all in
  this repository and licensed under MIT.

## Documentation

- [Getting started](https://rosette.dev/docs/getting-started)
- [Guides](https://rosette.dev/docs/guides)
- [Python API reference](https://rosette.dev/docs/api-reference)
- [Agent workflows](https://rosette.dev/docs/guides/agent-workflows)
- [Example designs](https://github.com/PreFab-Photonics/rosette/tree/main/designs)

## License

[MIT](https://github.com/PreFab-Photonics/rosette/blob/main/LICENSE)
