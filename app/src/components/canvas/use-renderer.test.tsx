import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { useUIStore } from "@/stores/ui";
import { useRenderer } from "./use-renderer";

const mocks = vi.hoisted(() => {
  const renderer = {
    destroy: vi.fn(),
    set_render_theme: vi.fn(),
    set_selection_color: vi.fn(),
    set_hover_color: vi.fn(),
    set_crosshair_color: vi.fn(),
    set_laser_color: vi.fn(),
    set_violation_error_color: vi.fn(),
    set_violation_warning_color: vi.fn(),
    set_dpr: vi.fn(),
    set_diagnostics_enabled: vi.fn(),
    set_grid_visible: vi.fn(),
    set_violations: vi.fn(),
    set_selected_violation: vi.fn(),
  };
  const create = vi.fn(async () => renderer);
  return { renderer, create, wasm: { WasmRenderer: { create } } };
});

vi.mock("@/hooks/use-wasm", () => ({
  useWasm: () => ({ wasm: mocks.wasm, isReady: true }),
}));

vi.mock("@/stores/ui", async () => {
  const { create } = await import("zustand");
  const mockedUIStore = create(() => ({ theme: "dark" as "dark" | "light", showGrid: true }));
  return { useUIStore: mockedUIStore };
});

vi.mock("./renderer-viewport", () => ({
  applyRendererViewport: vi.fn(),
  subscribeRendererToViewport: vi.fn(() => () => {}),
}));

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};

function Harness() {
  useRenderer("test-canvas");
  return null;
}

function setRendererTokens(canvas: string, grid: string) {
  const root = document.documentElement;
  root.style.setProperty("--theme-canvas", canvas);
  root.style.setProperty("--theme-canvas-grid", grid);
  root.style.setProperty("--theme-canvas-grid-opacity", "0.5");
  root.style.setProperty("--theme-selection", "#44ff44");
  root.style.setProperty("--theme-hover-outline", grid);
  root.style.setProperty("--theme-crosshair", "#33bf33cc");
  root.style.setProperty("--theme-laser", "#ff0000");
  root.style.setProperty("--theme-violation-error", "#ed2938f2");
  root.style.setProperty("--theme-violation-warning", "#f59e0af2");
}

describe("useRenderer theme updates", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    setRendererTokens("#121212", "#ffffff");
    useUIStore.setState({ theme: "dark", showGrid: true });
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    document.documentElement.removeAttribute("style");
  });

  it("updates the existing renderer when the resolved theme changes", async () => {
    await act(async () => root.render(<Harness />));
    await vi.waitFor(() => expect(mocks.create).toHaveBeenCalledOnce());
    await vi.waitFor(() => expect(mocks.renderer.set_render_theme).toHaveBeenCalled());
    expect(mocks.renderer.set_diagnostics_enabled).toHaveBeenCalledWith(true);
    const callsBeforeThemeChange = mocks.renderer.set_render_theme.mock.calls.length;

    setRendererTokens("#ffffff", "#000000");
    await act(async () => useUIStore.setState({ theme: "light" }));

    expect(mocks.create).toHaveBeenCalledOnce();
    expect(mocks.renderer.set_render_theme.mock.calls.length).toBeGreaterThan(
      callsBeforeThemeChange,
    );
    expect(mocks.renderer.set_render_theme).toHaveBeenLastCalledWith(1, 1, 1, 1, 0, 0, 0, 1, 0.5);
  });
});
