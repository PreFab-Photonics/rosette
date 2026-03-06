/**
 * Shared constants for the Rosette viewer.
 */

// Zoom factors for mouse wheel and keyboard shortcuts
export const ZOOM_IN_FACTOR = 1.18;
export const ZOOM_OUT_FACTOR = 0.82;

// Fast zoom factors with Shift modifier
export const ZOOM_IN_FACTOR_FAST = 1.5;
export const ZOOM_OUT_FACTOR_FAST = 0.67;

// Pan speed in pixels per frame
export const PAN_SPEED = 8;
export const PAN_SPEED_FAST = 24;

// Scale bar configuration
export const SCALE_BAR_TARGET_PIXELS = 100;
export const SCALE_BAR_MAX_WIDTH = 200;

// Unit thresholds in nanometers
export const MM_THRESHOLD = 1_000_000; // 1,000,000 nm = 1 mm
export const UM_THRESHOLD = 1_000; // 1,000 nm = 1 µm

// "Nice" numbers for scale bar labels (human-readable intervals)
export const NICE_NUMBERS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000] as const;

// Zoom tool padding (percentage of bounds added as margin)
export const ZOOM_PADDING_PERCENT = 0.1;
