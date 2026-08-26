import { readThemeTokens, type ThemeTokens } from "@/lib/theme";

interface ThemeableRenderer {
  set_render_theme(
    canvasR: number,
    canvasG: number,
    canvasB: number,
    canvasA: number,
    gridR: number,
    gridG: number,
    gridB: number,
    gridA: number,
    gridOpacity: number,
  ): void;
  set_selection_color(r: number, g: number, b: number, a: number): void;
  set_hover_color(r: number, g: number, b: number, a: number): void;
  set_crosshair_color(r: number, g: number, b: number, a: number): void;
  set_laser_color(r: number, g: number, b: number): void;
  set_violation_error_color(r: number, g: number, b: number, a: number): void;
  set_violation_warning_color(r: number, g: number, b: number, a: number): void;
}

function parseComponent(value: string): number {
  const component = value.trim();
  const parsed = Number.parseFloat(component);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid theme color component: ${value}`);
  return component.endsWith("%") ? parsed / 100 : parsed / 255;
}

function parseAlpha(value: string | undefined): number {
  if (value === undefined) return 1;
  const alpha = value.trim();
  const parsed = Number.parseFloat(alpha);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid theme alpha component: ${value}`);
  return alpha.endsWith("%") ? parsed / 100 : parsed;
}

function parseBrowserColor(color: string): [number, number, number, number] {
  if (typeof document === "undefined") throw new Error(`Unsupported theme color: ${color}`);
  if (typeof CSS !== "undefined" && CSS.supports && !CSS.supports("color", color)) {
    throw new Error(`Unsupported theme color: ${color}`);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error(`Unable to resolve theme color: ${color}`);
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255, a / 255];
}

/** Convert a hexadecimal or RGB CSS color into normalized RGBA components. */
export function parseThemeColor(color: string): [number, number, number, number] {
  const value = color.trim().toLowerCase();
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    const expanded =
      hex.length === 3 || hex.length === 4
        ? [...hex].map((component) => component + component).join("")
        : hex;
    if (expanded.length !== 6 && expanded.length !== 8) {
      throw new Error(`Invalid hexadecimal theme color: ${color}`);
    }
    const channels = expanded.match(/.{2}/g);
    if (!channels) throw new Error(`Invalid hexadecimal theme color: ${color}`);
    const parsedChannels = channels.map((channel) => Number.parseInt(channel, 16) / 255);
    const [r, g, b, a = 1] = parsedChannels;
    if (![r, g, b, a].every(Number.isFinite)) {
      throw new Error(`Invalid hexadecimal theme color: ${color}`);
    }
    return [r, g, b, a];
  }

  const match = value.match(/^rgba?\((.*)\)$/);
  if (!match) return parseBrowserColor(value);
  const [componentsPart, alphaPart] = match[1].split("/").map((part) => part.trim());
  const components = componentsPart.split(/[\s,]+/).filter(Boolean);
  if (components.length === 4 && alphaPart === undefined) {
    return [
      parseComponent(components[0]),
      parseComponent(components[1]),
      parseComponent(components[2]),
      parseAlpha(components[3]),
    ];
  }
  if (components.length !== 3) throw new Error(`Invalid RGB theme color: ${color}`);
  return [
    parseComponent(components[0]),
    parseComponent(components[1]),
    parseComponent(components[2]),
    parseAlpha(alphaPart),
  ];
}

/** Apply semantic document tokens to the imperative WebGPU renderer. */
export function applyRendererTheme(
  renderer: ThemeableRenderer,
  tokens: ThemeTokens = readThemeTokens(),
): void {
  const canvas = parseThemeColor(tokens.canvas);
  const grid = parseThemeColor(tokens.canvasGrid);
  const selection = parseThemeColor(tokens.selection);
  const hover = parseThemeColor(tokens.hoverOutline);
  const crosshair = parseThemeColor(tokens.crosshair);
  const [laserR, laserG, laserB] = parseThemeColor(tokens.laser);
  const violationError = parseThemeColor(tokens.violationError);
  const violationWarning = parseThemeColor(tokens.violationWarning);
  const gridOpacity = Number.parseFloat(tokens.canvasGridOpacity);
  if (!Number.isFinite(gridOpacity)) {
    throw new Error(`Invalid grid opacity theme token: ${tokens.canvasGridOpacity}`);
  }

  renderer.set_render_theme(...canvas, ...grid, gridOpacity);
  renderer.set_selection_color(...selection);
  renderer.set_hover_color(...hover);
  renderer.set_crosshair_color(...crosshair);
  renderer.set_laser_color(laserR, laserG, laserB);
  renderer.set_violation_error_color(...violationError);
  renderer.set_violation_warning_color(...violationWarning);
}
