export const revalidate = false;

export const LLMS_INDEX = `# Rosette Documentation

> Rosette is a scriptable GDSII layout editor for integrated circuits, focused on silicon photonics. Its public API is Python, backed by a Rust geometry and layout core.

Coordinates, dimensions, and distances are in microns. The website documents the current development branch. In an initialized project, prefer the generated \`.rosette/\` contracts when their manifest matches the installed package. If Rosette reports that they are stale, run \`uv run rosette update\` before relying on them.

## Getting Started

- [Installation](https://rosette.dev/docs/getting-started/installation.md): Install Rosette, initialize a project, and select an agent harness.
- [First layout](https://rosette.dev/docs/getting-started/first-layout.md): Build and view a small GDS design from Python.
- [Core concepts](https://rosette.dev/docs/getting-started/core-concepts.md): Understand cells, layers, ports, geometry, and verification.
- [Agent workflows](https://rosette.dev/docs/guides/agent-workflows.md): Use generated contracts and the build-check-inspect loop.

## Design Workflows

- [Routing](https://rosette.dev/docs/guides/routing.md): Connect ports with waypoint-based photonic routes and inspect bend diagnostics.
- [Cells and hierarchy](https://rosette.dev/docs/guides/cells-and-hierarchy.md): Compose reusable cells with instances and arrays.
- [Design rule checking](https://rosette.dev/docs/guides/design-rule-checking.md): Configure DRC rules and consume human or JSON results.
- [Snapshots](https://rosette.dev/docs/guides/snapshots.md): Render design regions with world-to-pixel coordinate metadata.

## Machine Contracts

- [Python API contract](https://rosette.dev/api.pyi): Exact public Python signatures for the current website revision.
- [CLI manifest](https://rosette.dev/cli.json): Commands, arguments, defaults, exit behavior, and JSON schema versions.
- [API reference](https://rosette.dev/docs/api-reference.md): Human explanations and examples for the public Python API.
- [Cell](https://rosette.dev/docs/api-reference/Cell.md): Layout geometry, hierarchy, ports, and placement methods.
- [Route](https://rosette.dev/docs/api-reference/Route.md): Route construction, port connection, and bend diagnostics.
- [DrcRules](https://rosette.dev/docs/api-reference/DrcRules.md): Programmatic DRC rule construction and warning behavior.

## Optional

- [Full documentation corpus](https://rosette.dev/llms-full.txt): All documentation pages in navigation order.
- [Agent-Driven Design](https://rosette.dev/blog/agent-driven-design): Design philosophy behind Rosette's agent workflow.
- [GitHub repository](https://github.com/PreFab-Photonics/rosette): Source code, examples, and issue tracker.
`;

export function GET() {
  return new Response(LLMS_INDEX, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
