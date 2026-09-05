import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { ProjectComponent } from "@/lib/project-components";
import { useComponentDialogStore } from "@/stores/component-dialog";
import { DEFAULT_LAYERS, useLayerStore } from "@/stores/layer";

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

const component: ProjectComponent = {
  name: "edge_coupler",
  parameters: [
    {
      name: "required_layer",
      type: "layer",
      required: true,
      nullable: false,
    },
    {
      name: "taper_profile",
      type: "string",
      required: true,
      nullable: false,
      choices: ["linear", "exponential"],
    },
    {
      name: "tip_width",
      type: "number",
      required: false,
      nullable: false,
      default: 0.15,
    },
    {
      name: "cladding_width",
      type: "number",
      required: false,
      nullable: true,
      default: null,
    },
    {
      name: "enabled",
      type: "boolean",
      required: false,
      nullable: false,
      default: true,
    },
  ],
};

describe("ComponentDialog", () => {
  let container: HTMLDivElement;
  let root: Root;
  let ComponentDialog: typeof import("./ComponentDialog").ComponentDialog;

  beforeAll(async () => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: () => ({ matches: false, addEventListener: () => undefined }),
    });
    ({ ComponentDialog } = await import("./ComponentDialog"));
  });

  afterAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
  });

  beforeEach(async () => {
    useLayerStore.getState().resetLayers(DEFAULT_LAYERS);
    useComponentDialogStore.getState().close();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => root.render(<ComponentDialog />));
    act(() => useComponentDialogStore.getState().open(component));
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
  });

  afterEach(() => {
    act(() => root.unmount());
    useComponentDialogStore.getState().close();
    container.remove();
  });

  it("uses the established dialog hierarchy and valid defaults", () => {
    const dialog = container.querySelector("dialog");
    const placementLayer = container.querySelector<HTMLSelectElement>(
      "#component-parameter-__layer__",
    );
    const requiredLayer = container.querySelector<HTMLSelectElement>(
      "#component-parameter-required_layer",
    );
    const profile = container.querySelector<HTMLSelectElement>(
      "#component-parameter-taper_profile",
    );
    const nullable = container.querySelector<HTMLInputElement>(
      "#component-parameter-cladding_width",
    );
    const form = container.querySelector("form");
    const fieldset = container.querySelector("fieldset");
    const submit = container.querySelector<HTMLButtonElement>('button[type="submit"]');

    expect(dialog?.getAttribute("aria-label")).toBe("Add Edge coupler");
    expect(dialog?.open).toBe(true);
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(dialog?.className).toContain("static");
    expect(dialog?.textContent).toContain("Placement");
    expect(dialog?.textContent).toContain("Parameters");
    expect(dialog?.textContent).toContain("Required layer");
    expect(dialog?.textContent).toContain("Taper profile");
    expect(placementLayer?.value).toBe("1/0");
    expect(requiredLayer?.value).toBe("1/0");
    expect(profile?.value).toBe("choice:0");
    expect(nullable?.disabled).toBe(true);
    expect(form?.className).toContain("flex-auto");
    expect(fieldset?.className).toContain("flex-auto");
    expect(submit?.textContent).toBe("Place Component");
    expect(document.activeElement).toBe(placementLayer);
  });

  it("shows field-level validation and focuses the invalid field", async () => {
    const width = container.querySelector<HTMLInputElement>("#component-parameter-tip_width")!;
    const form = container.querySelector("form")!;

    act(() => setInputValue(width, ""));
    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    expect(width.getAttribute("aria-invalid")).toBe("true");
    expect(container.textContent).toContain("Tip width is required");
    expect(document.activeElement).toBe(width);
  });
});
