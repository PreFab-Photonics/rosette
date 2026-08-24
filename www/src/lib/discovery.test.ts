import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { GET as getApiContract } from "@/app/api.pyi/route";
import { LLMS_INDEX } from "@/app/llms.txt/route";
import { SITE_STRUCTURED_DATA } from "@/lib/structured-data";

describe("agent discovery", () => {
  test("uses absolute machine-readable documentation links", () => {
    const links = [...LLMS_INDEX.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(
      (match) => match[1],
    );

    expect(links.length).toBeGreaterThan(10);
    expect(links.every((link) => link.startsWith("https://"))).toBeTrue();
    expect(
      links
        .filter((link) => link.startsWith("https://www.rosette.dev/docs/"))
        .every((link) => link.endsWith(".md")),
    ).toBeTrue();
    expect(LLMS_INDEX).toContain("https://www.rosette.dev/api.pyi");
    expect(LLMS_INDEX).toContain("https://www.rosette.dev/cli.json");
    expect(LLMS_INDEX).toContain("generated `.rosette/` contracts");
    expect(LLMS_INDEX).toContain("uv run rosette update");
    expect(LLMS_INDEX).toContain("**When to use Rosette:**");
    expect(LLMS_INDEX).toContain("https://pypi.org/project/librosette/");
    expect(LLMS_INDEX).toContain("not a hosted HTTP API");
  });

  test("keeps llms.txt sections as link lists", () => {
    const sections = LLMS_INDEX.split("\n## ").slice(1);

    expect(sections.length).toBeGreaterThan(0);
    for (const section of sections) {
      const [, ...body] = section.trim().split("\n");
      const lines = body.filter((line) => line.length > 0);
      expect(lines.length).toBeGreaterThan(0);
      expect(lines.every((line) => line.startsWith("- ["))).toBeTrue();
    }
  });

  test("publishes factual software and publisher identity", () => {
    const [organization, software] = SITE_STRUCTURED_DATA["@graph"];

    expect(SITE_STRUCTURED_DATA["@context"]).toBe("https://schema.org");
    expect(organization["@type"]).toBe("Organization");
    expect(organization.name).toBe("PreFab Photonics Inc.");
    expect(software["@type"]).toContain("SoftwareApplication");
    expect(software.url).toBe("https://www.rosette.dev/");
    expect(software.downloadUrl).toBe("https://pypi.org/project/librosette/");
    expect(software.publisher["@id"]).toBe(organization["@id"]);
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
