import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  isThemeSetting,
  readThemeTokens,
  resolveTheme,
  subscribeToSystemTheme,
  THEME_TOKEN_PROPERTIES,
} from "./theme";

function installMatchMedia(matches: boolean) {
  const listeners = new Set<() => void>();
  const media = {
    matches,
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
  return { media, notify: () => listeners.forEach((listener) => listener()) };
}

describe("theme helpers", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("style");
  });

  afterEach(() => vi.unstubAllGlobals());

  it("validates persisted settings and resolves system preferences", () => {
    expect(["light", "dark", "system"].every(isThemeSetting)).toBe(true);
    expect(isThemeSetting("sepia")).toBe(false);
    expect(resolveTheme("system", "light")).toBe("light");
    expect(resolveTheme("system", "dark")).toBe("dark");
    expect(resolveTheme("light", "dark")).toBe("light");
  });

  it("applies the resolved theme to the document", () => {
    applyTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("subscribes to system appearance changes", () => {
    const { media, notify } = installMatchMedia(false);
    const listener = vi.fn();
    const unsubscribe = subscribeToSystemTheme(listener);
    notify();
    expect(listener).toHaveBeenCalledOnce();
    unsubscribe();
    expect(media.removeEventListener).toHaveBeenCalledWith("change", listener);
  });

  it("reads the semantic tokens used by non-DOM renderers", () => {
    document.documentElement.style.setProperty("--theme-canvas", "#123456");
    document.documentElement.style.setProperty("--theme-canvas-grid-opacity", "0.75");
    const tokens = readThemeTokens();
    expect(tokens.canvas).toBe("#123456");
    expect(tokens.canvasGridOpacity).toBe("0.75");
  });

  it("defines the same semantic token contract for both built-in themes", () => {
    const css = readFileSync(resolve(process.cwd(), "public/theme.css"), "utf8");
    const darkBlock = css.match(/:root,\s*:root\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/)?.[1];
    const lightBlock = css.match(/:root\[data-theme="light"\]\s*\{([\s\S]*?)\n\}/)?.[1];
    expect(darkBlock).toBeDefined();
    expect(lightBlock).toBeDefined();

    const tokenNames = (block: string) =>
      [...block.matchAll(/(--theme-[\w-]+)\s*:/g)].map((match) => match[1]).sort();
    const darkTokens = tokenNames(darkBlock!);
    expect(tokenNames(lightBlock!)).toEqual(darkTokens);
    for (const property of Object.values(THEME_TOKEN_PROPERTIES)) {
      expect(darkTokens).toContain(property);
    }
  });
});

describe("theme preload", () => {
  const preload = readFileSync(resolve(process.cwd(), "public/theme-preload.js"), "utf8");

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("style");
  });

  afterEach(() => vi.unstubAllGlobals());

  it("applies a persisted explicit theme before application startup", () => {
    installMatchMedia(true);
    localStorage.setItem("rosette-ui", JSON.stringify({ state: { themeSetting: "light" } }));
    window.eval(preload);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("falls back to the system for missing or invalid preferences", () => {
    installMatchMedia(true);
    localStorage.setItem("rosette-ui", JSON.stringify({ state: { themeSetting: "sepia" } }));
    window.eval(preload);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
