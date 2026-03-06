import { describe, it, expect } from "vitest";
import { formatCoordinate, type UnitInfo } from "./format";

describe("formatCoordinate", () => {
  const nmUnit: UnitInfo = { unit: "nm", scale: 1 };
  const umUnit: UnitInfo = { unit: "µm", scale: 1000 };

  it("formats values with 3 decimal places", () => {
    expect(formatCoordinate(1234, nmUnit)).toBe("1234.000");
    expect(formatCoordinate(1234567, umUnit)).toBe("1234.567");
  });

  it("uses scientific notation for large values", () => {
    expect(formatCoordinate(1e9, nmUnit)).toBe("1.000e+9");
  });

  it("handles non-finite values", () => {
    expect(formatCoordinate(NaN, nmUnit)).toBe("0.000");
    expect(formatCoordinate(Infinity, nmUnit)).toBe("0.000");
  });
});
