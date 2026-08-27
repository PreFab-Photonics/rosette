import { afterEach, describe, expect, it, vi } from "vitest";
import { useComponentDialogStore } from "@/stores/component-dialog";
import {
  fetchProjectComponentCatalog,
  materializeProjectComponent,
  type ProjectComponent,
} from "./project-components";

afterEach(() => {
  vi.unstubAllGlobals();
  useComponentDialogStore.getState().close();
});

describe("project component server contract", () => {
  it("parses a component catalog", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              version: 3,
              error: null,
              components: [
                {
                  name: "mmi",
                  parameters: [
                    {
                      name: "width",
                      type: "number",
                      required: false,
                      nullable: false,
                      default: 0.5,
                    },
                  ],
                },
              ],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
      ),
    );

    const catalog = await fetchProjectComponentCatalog();

    expect(catalog?.version).toBe(3);
    expect(catalog?.components[0].parameters[0].default).toBe(0.5);
  });

  it("ignores the SPA fallback when no component server is present", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("<html></html>", {
            status: 200,
            headers: { "Content-Type": "text/html" },
          }),
      ),
    );

    await expect(fetchProjectComponentCatalog()).resolves.toBeNull();
  });

  it("surfaces materialization errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ error: "width must be positive" }), {
            status: 422,
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );

    await expect(
      materializeProjectComponent({
        name: "mmi",
        layer: { layerNumber: 1, datatype: 0 },
        parameters: { width: -1 },
      }),
    ).rejects.toThrow("width must be positive");
  });
});

describe("project component palette commands", () => {
  it("opens the parameter dialog for a catalog entry", async () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({ matches: false, addEventListener: vi.fn() })),
    });
    const { getCommands } = await import("@/lib/palette-commands");
    const component: ProjectComponent = { name: "mmi", parameters: [] };
    const command = getCommands([component]).find((item) => item.id === "project-component-mmi");

    command?.action();

    expect(command?.name).toBe("Project Component: mmi");
    expect(useComponentDialogStore.getState().component).toBe(component);
  });
});
