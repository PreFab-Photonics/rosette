import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { MenuItem, MenuSeparator, MenuShortcut, MenuSurface } from "./Menu";

vi.mock("@/stores/ui", () => ({ useUIStore: { getState: vi.fn() } }));

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};

describe("menu presentation", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("keeps items compact while rendering shortcut badges", () => {
    act(() =>
      root.render(
        <MenuSurface>
          <MenuItem>
            <span>Copy</span>
            <MenuShortcut shortcut={{ modifiers: ["Command"], key: "C" }} />
          </MenuItem>
          <MenuSeparator />
          <MenuItem>Delete</MenuItem>
        </MenuSurface>,
      ),
    );

    const surface = container.firstElementChild as HTMLElement;
    const items = [...container.querySelectorAll<HTMLButtonElement>("button")];

    expect(surface.className).toContain("bg-surface");
    expect(items).toHaveLength(2);
    expect(items.every((item) => item.className.includes("h-7"))).toBe(true);
    expect([...container.querySelectorAll("kbd")].map((key) => key.textContent)).toEqual([
      "Command",
      "C",
    ]);
    expect(surface.children[1].className).toContain("bg-theme-border");
  });

  it("applies active and disabled states without changing button behavior", () => {
    const onActive = vi.fn();
    const onDisabled = vi.fn();

    act(() =>
      root.render(
        <MenuSurface>
          <MenuItem active onClick={onActive}>
            View
          </MenuItem>
          <MenuItem disabled onClick={onDisabled}>
            Delete
          </MenuItem>
        </MenuSurface>,
      ),
    );

    const surface = container.firstElementChild as HTMLElement;
    const [activeItem, disabledItem] = [...container.querySelectorAll<HTMLButtonElement>("button")];

    expect(surface.className).toContain("bg-surface");
    expect(activeItem.className).toContain("bg-interactive");
    expect(disabledItem.className).toContain("opacity-40");

    act(() => {
      activeItem.click();
      disabledItem.click();
    });
    expect(onActive).toHaveBeenCalledOnce();
    expect(onDisabled).not.toHaveBeenCalled();
  });
});
