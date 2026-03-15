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

// Text tool configuration
/** Default text height in nanometers (visual cap-height of characters). */
export const TEXT_DEFAULT_HEIGHT = 100;
/** Font family used for text rendering (matches embedded WASM font for polygon conversion). */
export const TEXT_FONT_FAMILY = "'Source Code Pro', monospace";
/** Cursor blink interval in milliseconds. */
export const TEXT_CURSOR_BLINK_MS = 530;
/**
 * Ratio of CSS em-size to visual cap-height for monospace fonts.
 *
 * CSS `font-size` sets the em square, but the visible character height
 * (cap-height) is shorter. For standard monospace fonts this ratio is
 * ~0.72. To make a character visually H nanometers tall, set
 * `font-size = H / TEXT_CAP_HEIGHT_RATIO`.
 */
export const TEXT_CAP_HEIGHT_RATIO = 0.72;
