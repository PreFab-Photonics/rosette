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
        <MenuSurface isDark={true}>
          <MenuItem isDark={true}>
            <span>Copy</span>
            <MenuShortcut isDark={true} shortcut={{ modifiers: ["Command"], key: "C" }} />
          </MenuItem>
          <MenuSeparator isDark={true} />
          <MenuItem isDark={true}>Delete</MenuItem>
        </MenuSurface>,
      ),
    );

    const surface = container.firstElementChild as HTMLElement;
    const items = [...container.querySelectorAll<HTMLButtonElement>("button")];

    expect(surface.className).toContain("bg-[rgb(29,29,29)]");
    expect(items).toHaveLength(2);
    expect(items.every((item) => item.className.includes("h-7"))).toBe(true);
    expect([...container.querySelectorAll("kbd")].map((key) => key.textContent)).toEqual([
      "Command",
      "C",
    ]);
    expect(surface.children[1].className).toContain("bg-white/10");
  });

  it("applies active and disabled states without changing button behavior", () => {
    const onActive = vi.fn();
    const onDisabled = vi.fn();

    act(() =>
      root.render(
        <MenuSurface isDark={false}>
          <MenuItem isDark={false} active onClick={onActive}>
            View
          </MenuItem>
          <MenuItem isDark={false} disabled onClick={onDisabled}>
            Delete
          </MenuItem>
        </MenuSurface>,
      ),
    );

    const surface = container.firstElementChild as HTMLElement;
    const [activeItem, disabledItem] = [...container.querySelectorAll<HTMLButtonElement>("button")];

    expect(surface.className).toContain("bg-[rgb(241,241,241)]");
    expect(activeItem.className).toContain("bg-[rgb(217,217,217)]");
    expect(disabledItem.className).toContain("opacity-40");

    act(() => {
      activeItem.click();
      disabledItem.click();
    });
    expect(onActive).toHaveBeenCalledOnce();
    expect(onDisabled).not.toHaveBeenCalled();
  });
});
