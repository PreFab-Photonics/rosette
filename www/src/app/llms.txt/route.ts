export const revalidate = false;

export const LLMS_INDEX = `# Rosette Documentation

> Rosette is a scriptable GDSII layout editor for integrated circuits, focused on silicon photonics. Its public API is Python, backed by a Rust geometry and layout core.

Coordinates, dimensions, and distances are in microns. The website documents the current development branch. In an initialized project, prefer the generated \`.rosette/\` contracts when their manifest matches the installed package. If Rosette reports that they are stale, run \`uv run rosette update\` before relying on them.

**When to use Rosette:** Use Rosette for scriptable, local GDS-II layout work, especially integrated-photonics designs that agents and engineers build together in Python. It is a good fit for composing cells and ports, routing waveguides, importing or exporting GDS-II, running layout checks, and visually inspecting results in the local viewer.

Rosette is a Python package and CLI, not a hosted HTTP API or optical simulator. It is beta software with an unstable API and is not suitable for production sign-off. Install the [official \`librosette\` package from PyPI](https://pypi.org/project/librosette/) and work in a version-controlled local project.

## Getting Started

- [Official PyPI package](https://pypi.org/project/librosette/): Published wheels, supported Python versions, and release history.
- [Installation](https://www.rosette.dev/docs/getting-started/installation.md): Install Rosette, initialize a project, and select an agent harness.
- [First layout](https://www.rosette.dev/docs/getting-started/first-layout.md): Build and view a small GDS design from Python.
- [Core concepts](https://www.rosette.dev/docs/getting-started/core-concepts.md): Understand cells, layers, ports, geometry, and verification.
- [Agent workflows](https://www.rosette.dev/docs/guides/agent-workflows.md): Use generated contracts and the build-check-inspect loop.

## Project Templates

- [Template overview](https://www.rosette.dev/docs/templates.md): Choose between the generic catalog and blank authoring scaffold.
- [Component authoring](https://www.rosette.dev/docs/templates/component-authoring.md): Add or modify project-local components in either template.
- [Generic components](https://www.rosette.dev/docs/templates/generic/components.md): Included components, ports, signatures, and metric functions.
- [Blank components](https://www.rosette.dev/docs/templates/blank/components.md): Understand the minimal helper scaffold and empty public surface.

## Design Workflows

- [Routing](https://www.rosette.dev/docs/guides/routing.md): Connect ports with waypoint-based photonic routes and inspect bend diagnostics.
- [Cells and hierarchy](https://www.rosette.dev/docs/guides/cells-and-hierarchy.md): Compose reusable cells with instances and arrays.
- [Design rule checking](https://www.rosette.dev/docs/guides/design-rule-checking.md): Configure DRC rules and consume human or JSON results.
- [Snapshots](https://www.rosette.dev/docs/guides/snapshots.md): Render design regions with world-to-pixel coordinate metadata.

## Machine Contracts

- [Python API contract](https://www.rosette.dev/api.pyi): Exact public Python signatures for the current website revision.
- [CLI manifest](https://www.rosette.dev/cli.json): Commands, arguments, defaults, exit behavior, and JSON schema versions.
- [API reference](https://www.rosette.dev/docs/api-reference.md): Human explanations and examples for the public Python API.
- [Cell](https://www.rosette.dev/docs/api-reference/Cell.md): Layout geometry, hierarchy, ports, and placement methods.
- [Route](https://www.rosette.dev/docs/api-reference/Route.md): Route construction, port connection, and bend diagnostics.
- [DrcRules](https://www.rosette.dev/docs/api-reference/DrcRules.md): Programmatic DRC rule construction and warning behavior.

## Optional

- [Full documentation corpus](https://www.rosette.dev/llms-full.txt): All documentation pages in navigation order.
- [Agent-Driven Design](https://www.rosette.dev/blog/agent-driven-design): Design philosophy behind Rosette's agent workflow.
- [GitHub repository](https://github.com/PreFab-Photonics/rosette): Source code, examples, and issue tracker.
`;

export function GET() {
  return new Response(LLMS_INDEX, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
