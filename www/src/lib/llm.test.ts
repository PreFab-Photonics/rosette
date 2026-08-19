import { describe, expect, test } from "bun:test";
import {
  getCanonicalUrl,
  getMarkdownHeaders,
  getMarkdownUrl,
  getSourceUrl,
  renderLLMPage,
} from "./llm";

function component(
  name: string,
  attributes: Record<string, unknown>,
  children = "",
): string {
  return `\0${JSON.stringify({ name, attributes, children })}\0`;
}

const expression = (value: string) => ({ value: JSON.stringify(value) });

describe("LLM page rendering", () => {
  test("renders nested MDX components as ordinary Markdown", async () => {
    const parameter = component(
      "PyParameter",
      { name: expression("name"), type: expression("str") },
      "Name of the cell.",
    );
    const returns = component(
      "PyFunctionReturn",
      { type: expression("Cell") },
      "The new cell.",
    );
    const fn = component(
      "PyFunction",
      { name: expression("create"), type: expression("(name) -> Cell") },
      `Create a cell.\n\n${component("div", {}, parameter)}\n\n${returns}`,
    );
    const callout = component(
      "Callout",
      { title: expression("Stable API"), type: expression("warn") },
      "Use the documented signature.",
    );

    const markdown = await renderLLMPage({
      title: "Cell",
      description: "Cell API reference.",
      pathname: "/docs/api-reference/Cell",
      sourcePath: "api-reference/Cell.mdx",
      processed: `${callout}\n\n${fn}`,
    });

    expect(markdown).toContain(
      'canonical_url: "https://rosette.dev/docs/api-reference/Cell"',
    );
    expect(markdown).toContain(
      'markdown_url: "https://rosette.dev/docs/api-reference/Cell.md"',
    );
    expect(markdown).toContain("> **Warning: Stable API**");
    expect(markdown).toContain("### `create`");
    expect(markdown).toContain("create(name) -> Cell");
    expect(markdown).toContain("- **`name`** (`str`)");
    expect(markdown).toContain("**Returns:** `Cell`");
    expect(markdown).not.toContain("\0");
    expect(markdown).not.toContain("<PyFunction");
    expect(markdown).not.toContain("&#x");
  });

  test("handles single-quoted expressions and default attributes", async () => {
    const parameter = component(
      "PyParameter",
      {
        name: expression("on_duplicate"),
        type: { value: `'Literal["error", "keep"]'` },
        default: { value: `'"error"'` },
      },
      "Duplicate policy.",
    );
    const fn = component(
      "PyFunction",
      {
        name: expression("add_cell"),
        type: { value: `'(cell, *, on_duplicate="error") -> None'` },
      },
      parameter,
    );

    const markdown = await renderLLMPage({
      title: "Library",
      pathname: "/docs/api-reference/Library",
      sourcePath: "api-reference/Library.mdx",
      processed: fn,
    });

    expect(markdown).toContain(
      'add_cell(cell, *, on_duplicate="error") -> None',
    );
    expect(markdown).toContain('`Literal["error", "keep"]`');
    expect(markdown).toContain('default `"error"`');
  });

  test("builds canonical machine and source URLs", () => {
    expect(getMarkdownUrl("/docs/guides/routing")).toBe(
      "/docs/guides/routing.md",
    );
    expect(getCanonicalUrl("/docs/guides/routing")).toBe(
      "https://rosette.dev/docs/guides/routing",
    );
    expect(getSourceUrl("guides/routing.mdx")).toMatch(
      /^https:\/\/github\.com\/PreFab-Photonics\/rosette\/blob\/[^/]+\/www\/content\/docs\/guides\/routing\.mdx$/,
    );
  });

  test("returns Markdown and canonical response headers", () => {
    const headers = new Headers(getMarkdownHeaders("/docs/guides/routing"));

    expect(headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(headers.get("link")).toBe(
      '<https://rosette.dev/docs/guides/routing>; rel="canonical"',
    );
    expect(headers.get("vary")).toBeNull();
  });
});
