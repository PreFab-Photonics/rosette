import { describe, expect, it } from "vitest";
import { wheelZoomFactor, ZOOM_IN_FACTOR, ZOOM_OUT_FACTOR } from "./constants";

describe("wheelZoomFactor", () => {
  it("scales continuously and caps large wheel deltas", () => {
    expect(wheelZoomFactor(0)).toBe(1);
    expect(wheelZoomFactor(10)).toBeLessThan(1);
    expect(wheelZoomFactor(-10)).toBeGreaterThan(1);
    expect(wheelZoomFactor(100)).toBe(ZOOM_OUT_FACTOR);
    expect(wheelZoomFactor(-100)).toBe(ZOOM_IN_FACTOR);
    expect(wheelZoomFactor(3, 1)).toBe(ZOOM_OUT_FACTOR);
    expect(wheelZoomFactor(-1, 2)).toBe(ZOOM_IN_FACTOR);

    expect(wheelZoomFactor(50)).toBeLessThanOrEqual(wheelZoomFactor(49));
    expect(wheelZoomFactor(-50)).toBeGreaterThanOrEqual(wheelZoomFactor(-49));
  });
});
