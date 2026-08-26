import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function installMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<() => void>();
  const media = {
    get matches() {
      return matches;
    },
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: vi.fn((_type: string, listener: () => void) => listeners.add(listener)),
    removeEventListener: vi.fn((_type: string, listener: () => void) => listeners.delete(listener)),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } satisfies MediaQueryList;
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => media),
  );
  return {
    setMatches(next: boolean) {
      matches = next;
      listeners.forEach((listener) => listener());
    },
  };
}

describe("UI theme state", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("style");
  });

  afterEach(() => vi.unstubAllGlobals());

  it("follows system changes only while the system preference is selected", async () => {
    const system = installMatchMedia(false);
    const { useUIStore } = await import("./ui");
    expect(useUIStore.getState().theme).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");

    system.setMatches(true);
    expect(useUIStore.getState().theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");

    useUIStore.getState().setThemeSetting("light");
    system.setMatches(false);
    system.setMatches(true);
    expect(useUIStore.getState().theme).toBe("light");
  });

  it("persists explicit preferences", async () => {
    installMatchMedia(false);
    const { useUIStore } = await import("./ui");
    useUIStore.getState().setThemeSetting("dark");
    const persisted = JSON.parse(localStorage.getItem("rosette-ui")!);
    expect(persisted.state.themeSetting).toBe("dark");
    expect(persisted.state.theme).toBeUndefined();
  });

  it("rejects invalid persisted preferences", async () => {
    installMatchMedia(false);
    localStorage.setItem("rosette-ui", JSON.stringify({ state: { themeSetting: "sepia" } }));
    const { useUIStore } = await import("./ui");
    expect(useUIStore.getState().themeSetting).toBe("system");
    expect(useUIStore.getState().theme).toBe("light");
  });
});
