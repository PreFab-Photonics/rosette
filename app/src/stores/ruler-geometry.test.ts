import { describe, it, expect } from "vitest";
import type { Ruler } from "@/stores/ruler";
import { rulerBounds, rulerPoints, setRulerPoint, translateRuler } from "./ruler-geometry";

describe("ruler-geometry (simple)", () => {
  const simple: Ruler = {
    id: "r1",
    kind: "simple",
    start: { x: 10, y: 20 },
    end: { x: 30, y: 5 },
  };

  it("returns control points in [start, end] order", () => {
    expect(rulerPoints(simple)).toEqual([
      { x: 10, y: 20 },
      { x: 30, y: 5 },
    ]);
  });

  it("copies points so callers can't mutate the ruler", () => {
    const pts = rulerPoints(simple);
    pts[0].x = 999;
    expect(simple.start.x).toBe(10);
  });

  it("computes an axis-aligned bounding box", () => {
    expect(rulerBounds(simple)).toEqual({
      minX: 10,
      minY: 5,
      maxX: 30,
      maxY: 20,
    });
  });

  it("translates without mutating the source", () => {
    const moved = translateRuler(simple, 5, -2);
    expect(moved).toEqual({
      id: "r1",
      kind: "simple",
      start: { x: 15, y: 18 },
      end: { x: 35, y: 3 },
    });
    // Source untouched
    expect(simple.start).toEqual({ x: 10, y: 20 });
  });

  it("setRulerPoint updates start (index 0) and end (index 1)", () => {
    const s = setRulerPoint(simple, 0, { x: 0, y: 0 });
    expect(s).toMatchObject({ start: { x: 0, y: 0 }, end: { x: 30, y: 5 } });

    const e = setRulerPoint(simple, 1, { x: 100, y: 100 });
    expect(e).toMatchObject({ start: { x: 10, y: 20 }, end: { x: 100, y: 100 } });
  });

  it("setRulerPoint returns the source on out-of-range index", () => {
    expect(setRulerPoint(simple, 2, { x: 0, y: 0 })).toBe(simple);
    expect(setRulerPoint(simple, -1, { x: 0, y: 0 })).toBe(simple);
  });
});

describe("ruler-geometry (polyline)", () => {
  const polyline: Ruler = {
    id: "p1",
    kind: "polyline",
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 20 },
    ],
  };

  it("returns control points in vertex order", () => {
    expect(rulerPoints(polyline)).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 20 },
    ]);
  });

  it("bounds cover all vertices", () => {
    expect(rulerBounds(polyline)).toEqual({
      minX: 0,
      minY: 0,
      maxX: 10,
      maxY: 20,
    });
  });

  it("translates every vertex", () => {
    const moved = translateRuler(polyline, -5, 3);
    expect(moved).toEqual({
      id: "p1",
      kind: "polyline",
      points: [
        { x: -5, y: 3 },
        { x: 5, y: 3 },
        { x: 5, y: 23 },
      ],
    });
  });

  it("setRulerPoint updates vertex at index and copies the point", () => {
    const p = { x: 99, y: 99 };
    const updated = setRulerPoint(polyline, 1, p);
    if (updated.kind !== "polyline") throw new Error("kind should be polyline");
    expect(updated.points[1]).toEqual({ x: 99, y: 99 });
    // Mutating the source point must not leak into the ruler.
    p.x = -1;
    expect(updated.points[1].x).toBe(99);
  });

  it("setRulerPoint returns source on out-of-range index", () => {
    expect(setRulerPoint(polyline, 5, { x: 0, y: 0 })).toBe(polyline);
    expect(setRulerPoint(polyline, -1, { x: 0, y: 0 })).toBe(polyline);
  });
});

describe("ruler-geometry (angle)", () => {
  const angle: Ruler = {
    id: "a1",
    kind: "angle",
    vertex: { x: 0, y: 0 },
    armA: { x: 10, y: 0 },
    armB: { x: 0, y: 10 },
  };

  it("rulerPoints returns [vertex, armA, armB]", () => {
    expect(rulerPoints(angle)).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 0, y: 10 },
    ]);
  });

  it("translates all three points", () => {
    const moved = translateRuler(angle, 5, 5);
    expect(moved).toEqual({
      id: "a1",
      kind: "angle",
      vertex: { x: 5, y: 5 },
      armA: { x: 15, y: 5 },
      armB: { x: 5, y: 15 },
    });
  });

  it("setRulerPoint addresses vertex (0), armA (1), armB (2)", () => {
    const p = { x: 42, y: 42 };
    expect(setRulerPoint(angle, 0, p)).toMatchObject({ vertex: { x: 42, y: 42 } });
    expect(setRulerPoint(angle, 1, p)).toMatchObject({ armA: { x: 42, y: 42 } });
    expect(setRulerPoint(angle, 2, p)).toMatchObject({ armB: { x: 42, y: 42 } });
    expect(setRulerPoint(angle, 3, p)).toBe(angle);
  });
});

describe("ruler-geometry (radius)", () => {
  const radius: Ruler = {
    id: "r1",
    kind: "radius",
    center: { x: 10, y: 10 },
    edge: { x: 20, y: 10 },
  };

  it("rulerPoints returns [center, edge]", () => {
    expect(rulerPoints(radius)).toEqual([
      { x: 10, y: 10 },
      { x: 20, y: 10 },
    ]);
  });

  it("translates both center and edge", () => {
    const moved = translateRuler(radius, 1, -1);
    expect(moved).toEqual({
      id: "r1",
      kind: "radius",
      center: { x: 11, y: 9 },
      edge: { x: 21, y: 9 },
    });
  });

  it("setRulerPoint addresses center (0) and edge (1)", () => {
    const p = { x: 0, y: 0 };
    expect(setRulerPoint(radius, 0, p)).toMatchObject({ center: { x: 0, y: 0 } });
    expect(setRulerPoint(radius, 1, p)).toMatchObject({ edge: { x: 0, y: 0 } });
    expect(setRulerPoint(radius, 2, p)).toBe(radius);
  });
});
