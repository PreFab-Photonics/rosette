import { describe, expect, it, vi } from "vitest";
import type { ThemeTokens } from "@/lib/theme";
import { applyRendererTheme, parseThemeColor } from "./renderer-theme";

describe("renderer theme adapter", () => {
  it("parses the CSS color formats used by semantic tokens", () => {
    expect(parseThemeColor("#123")).toEqual([0x11 / 255, 0x22 / 255, 0x33 / 255, 1]);
    expect(parseThemeColor("rgb(64 128 255 / 50%)")).toEqual([64 / 255, 128 / 255, 1, 0.5]);
    expect(parseThemeColor("rgba(255, 0, 127, 0.25)")).toEqual([1, 0, 127 / 255, 0.25]);
  });

  it("applies a synthetic third palette without theme-specific branches", () => {
    const renderer = {
      set_render_theme: vi.fn(),
      set_selection_color: vi.fn(),
      set_hover_color: vi.fn(),
      set_crosshair_color: vi.fn(),
      set_laser_color: vi.fn(),
      set_violation_error_color: vi.fn(),
      set_violation_warning_color: vi.fn(),
    };
    const tokens = {
      canvas: "#102030",
      canvasGrid: "#abcdef80",
      canvasGridOpacity: "0.65",
      selection: "#fedcba",
      hoverOutline: "rgb(12 34 56 / 75%)",
      canvasLabel: "#ffffff",
      canvasLabelMuted: "rgb(255 255 255 / 50%)",
      selectionTranslucent: "rgb(254 220 186 / 30%)",
      ruler: "#ffffff",
      rulerSurface: "#000000",
      rulerHover: "#ffffff",
      minimapViewport: "#ffffff",
      minimapViewportFill: "rgb(255 255 255 / 10%)",
      minimapImageFill: "rgb(255 255 255 / 30%)",
      minimapImageStroke: "rgb(255 255 255 / 50%)",
      crosshair: "#00ff00",
      laser: "#ff0000",
      marqueeFill: "rgb(0 0 255 / 10%)",
      marqueeStroke: "rgb(0 0 255 / 60%)",
      zoomFill: "rgb(0 255 0 / 10%)",
      zoomStroke: "rgb(0 255 0 / 60%)",
      violationError: "#ff0000",
      violationWarning: "#ffaa00",
    } satisfies ThemeTokens;

    applyRendererTheme(renderer, tokens);

    expect(renderer.set_render_theme).toHaveBeenCalledWith(
      0x10 / 255,
      0x20 / 255,
      0x30 / 255,
      1,
      0xab / 255,
      0xcd / 255,
      0xef / 255,
      0x80 / 255,
      0.65,
    );
    expect(renderer.set_selection_color).toHaveBeenCalledWith(
      0xfe / 255,
      0xdc / 255,
      0xba / 255,
      1,
    );
    expect(renderer.set_hover_color).toHaveBeenCalledWith(12 / 255, 34 / 255, 56 / 255, 0.75);
    expect(renderer.set_crosshair_color).toHaveBeenCalledWith(0, 1, 0, 1);
    expect(renderer.set_laser_color).toHaveBeenCalledWith(1, 0, 0);
    expect(renderer.set_violation_error_color).toHaveBeenCalledWith(1, 0, 0, 1);
    expect(renderer.set_violation_warning_color).toHaveBeenCalledWith(1, 0xaa / 255, 0, 1);
  });
});
