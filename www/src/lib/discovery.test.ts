import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { GET as getApiContract } from "@/app/api.pyi/route";
import { LLMS_INDEX } from "@/app/llms.txt/route";

describe("agent discovery", () => {
  test("uses absolute machine-readable documentation links", () => {
    const links = [...LLMS_INDEX.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(
      (match) => match[1],
    );

    expect(links.length).toBeGreaterThan(10);
    expect(links.every((link) => link.startsWith("https://"))).toBeTrue();
    expect(
      links
        .filter((link) => link.startsWith("https://rosette.dev/docs/"))
        .every((link) => link.endsWith(".md")),
    ).toBeTrue();
    expect(LLMS_INDEX).toContain("https://rosette.dev/api.pyi");
    expect(LLMS_INDEX).toContain("https://rosette.dev/cli.json");
    expect(LLMS_INDEX).toContain("generated `.rosette/` contracts");
    expect(LLMS_INDEX).toContain("uv run rosette update");
  });

  test("serves the authoritative Python contract", async () => {
    const response = getApiContract();
    const source = readFileSync(
      resolve(process.cwd(), "../python/rosette/api.pyi"),
      "utf8",
    );

    expect(await response.text()).toBe(source);
    expect(response.headers.get("content-type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });

  test("publishes a valid CLI manifest", () => {
    const manifest = JSON.parse(
      readFileSync(resolve(process.cwd(), "public/cli.json"), "utf8"),
    );

    expect(manifest.schema).toBe(1);
    expect(manifest.prog).toBe("rosette");
    expect(manifest.commands.build).toBeDefined();
    expect(manifest.commands.check).toBeDefined();
    expect(manifest.commands.drc).toBeDefined();
  });
});
