/**
 * Formatting utilities for coordinate and scale display.
 */

import { GRID_SIZE } from "@/stores/viewport";
import { MM_THRESHOLD, UM_THRESHOLD, SCALE_BAR_TARGET_PIXELS } from "./constants";

export type UnitInfo = {
  unit: "nm" | "µm" | "mm";
  /** Nanometers per display unit */
  scale: number;
};

/**
 * Determine the appropriate display unit based on zoom level.
 * Used by both CoordinatesDisplay and ScaleDisplay for consistency.
 */
export function getDisplayUnit(zoom: number): UnitInfo {
  const nmPerPixel = 1 / (zoom * GRID_SIZE);
  const targetLength = SCALE_BAR_TARGET_PIXELS * nmPerPixel;

  if (targetLength >= MM_THRESHOLD) {
    return { unit: "mm", scale: MM_THRESHOLD };
  }
  if (targetLength >= UM_THRESHOLD) {
    return { unit: "µm", scale: UM_THRESHOLD };
  }
  return { unit: "nm", scale: 1 };
}

/**
 * Safely convert a value to a finite number, defaulting to 0.
 */
function toFinite(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

/**
 * Format a coordinate value for display.
 * Input is in nanometers, output is formatted in the given unit.
 */
export function formatCoordinate(valueInNm: number, unitInfo: UnitInfo): string {
  const value = toFinite(valueInNm) / unitInfo.scale;
  const absValue = Math.abs(value);

  // Use scientific notation for very large values
  if (absValue >= 1e6) {
    return value.toExponential(3);
  }
  // Always use 3 decimal places
  return value.toFixed(3);
}
