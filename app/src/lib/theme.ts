/** Persisted appearance preference. System resolves to a concrete theme. */
export type ThemeSetting = "light" | "dark" | "system";

/** Built-in theme currently applied to the viewer. */
export type ResolvedTheme = "light" | "dark";

const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

export function isThemeSetting(value: unknown): value is ThemeSetting {
  return value === "light" || value === "dark" || value === "system";
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light";
}

export function resolveTheme(
  setting: ThemeSetting,
  systemTheme: ResolvedTheme = getSystemTheme(),
): ResolvedTheme {
  return setting === "system" ? systemTheme : setting;
}

export function applyTheme(theme: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function subscribeToSystemTheme(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia(SYSTEM_THEME_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export const THEME_TOKEN_PROPERTIES = {
  canvas: "--theme-canvas",
  canvasGrid: "--theme-canvas-grid",
  canvasGridOpacity: "--theme-canvas-grid-opacity",
  canvasLabel: "--theme-canvas-label",
  canvasLabelMuted: "--theme-canvas-label-muted",
  selection: "--theme-selection",
  selectionTranslucent: "--theme-selection-translucent",
  hoverOutline: "--theme-hover-outline",
  ruler: "--theme-ruler",
  rulerSurface: "--theme-ruler-surface",
  rulerHover: "--theme-ruler-hover",
  minimapViewport: "--theme-minimap-viewport",
  minimapViewportFill: "--theme-minimap-viewport-fill",
  minimapImageFill: "--theme-minimap-image-fill",
  minimapImageStroke: "--theme-minimap-image-stroke",
  crosshair: "--theme-crosshair",
  laser: "--theme-laser",
  marqueeFill: "--theme-marquee-fill",
  marqueeStroke: "--theme-marquee-stroke",
  zoomFill: "--theme-zoom-fill",
  zoomStroke: "--theme-zoom-stroke",
  violationError: "--theme-violation-error",
  violationWarning: "--theme-violation-warning",
} as const;

export type ThemeTokens = { [K in keyof typeof THEME_TOKEN_PROPERTIES]: string };

/** Resolve non-DOM theme values after the document theme has been applied. */
export function readThemeTokens(element: Element = document.documentElement): ThemeTokens {
  const styles = getComputedStyle(element);
  return Object.fromEntries(
    Object.entries(THEME_TOKEN_PROPERTIES).map(([name, property]) => [
      name,
      styles.getPropertyValue(property).trim(),
    ]),
  ) as ThemeTokens;
}
