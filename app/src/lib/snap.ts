/**
 * Geometry snapping utilities for ruler endpoints.
 *
 * Provides snap-to-vertex and snap-to-edge functionality for precise measurements.
 */

import { GRID_SIZE } from "@/stores/viewport";
import type { Point } from "@/stores/ruler";
import type { WasmLibrary } from "@/wasm/rosette_wasm";

/** Screen pixel threshold for detecting geometry snap. */
export const SNAP_THRESHOLD_PX = 15;

/**
 * Get all vertices from the library for snap detection.
 * Returns null if library is not available or has no vertices.
 */
export function getSnapVertices(library: WasmLibrary | null): Float64Array | null {
  if (!library) return null;
  try {
    const vertices = library.get_all_vertices();
    return vertices.length > 0 ? vertices : null;
  } catch {
    return null;
  }
}

/**
 * Result of a snap operation.
 */
export interface SnapResult {
  /** The snapped point in world coordinates. */
  point: Point;
  /** Whether the snap was to geometry (true) or grid (false). */
  isGeometrySnap: boolean;
}

/**
 * Find the closest point on a line segment to a given point.
 * Returns the closest point and the squared distance to it.
 */
function closestPointOnSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): { point: Point; distSq: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;

  // Handle degenerate case (segment is a point)
  if (lengthSq === 0) {
    const distSq = (px - x1) * (px - x1) + (py - y1) * (py - y1);
    return { point: { x: x1, y: y1 }, distSq };
  }

  // Project point onto line, clamped to segment
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSq));
  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;

  const distSq = (px - closestX) * (px - closestX) + (py - closestY) * (py - closestY);
  return { point: { x: closestX, y: closestY }, distSq };
}

/**
 * Find the nearest point on any edge to a screen point within the snap threshold.
 * Handles multiple polygons - each polygon's vertices are separated by the
 * polygon vertex count pattern (polygons are closed shapes).
 *
 * @param screenX - Screen X coordinate (CSS pixels)
 * @param screenY - Screen Y coordinate (CSS pixels)
 * @param polygonVertices - Array of vertex arrays, one per polygon
 * @param zoom - Current viewport zoom level
 * @param offset - Current viewport offset
 * @returns The nearest edge point if within threshold, null otherwise
 */
export function findNearestEdgePoint(
  screenX: number,
  screenY: number,
  polygonVertices: Array<Float64Array | number[]>,
  zoom: number,
  offset: { x: number; y: number },
): Point | null {
  let nearestPoint: Point | null = null;
  let nearestDistSq = SNAP_THRESHOLD_PX * SNAP_THRESHOLD_PX;

  // Convert screen point to world coordinates for distance calculation
  const worldPx = (screenX - offset.x) / zoom;
  const worldPy = (screenY - offset.y) / zoom;

  for (const vertices of polygonVertices) {
    const numVertices = vertices.length / 2;
    if (numVertices < 2) continue;

    // Iterate through edges of this polygon (including closing edge)
    for (let i = 0; i < numVertices; i++) {
      const j = (i + 1) % numVertices;

      const x1 = vertices[i * 2];
      const y1 = vertices[i * 2 + 1];
      const x2 = vertices[j * 2];
      const y2 = vertices[j * 2 + 1];

      // Find closest point on this edge (in world coordinates)
      const { point, distSq: worldDistSq } = closestPointOnSegment(
        worldPx,
        worldPy,
        x1,
        y1,
        x2,
        y2,
      );

      // Convert world distance to screen distance
      const screenDistSq = worldDistSq * zoom * zoom;

      if (screenDistSq < nearestDistSq) {
        nearestDistSq = screenDistSq;
        nearestPoint = point;
      }
    }
  }

  return nearestPoint;
}

/**
 * Snap a world coordinate to the nearest grid point.
 *
 * @param value - World coordinate value
 * @returns Snapped value
 */
export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

/**
 * Calculate snapped point with geometry priority.
 *
 * Attempts to snap to geometry (vertices) first, falls back to grid snap.
 *
 * @param screenX - Screen X coordinate
 * @param screenY - Screen Y coordinate
 * @param worldX - Unsnapped world X coordinate
 * @param worldY - Unsnapped world Y coordinate
 * @param vertices - All vertices from geometry elements
 * @param zoom - Viewport zoom
 * @param offset - Viewport offset
 * @returns Snap result with point and snap type
 */
/**
 * Parse the encoded vertex array into separate polygon vertex arrays.
 * Format: [n1, x0, y0, x1, y1, ..., n2, x0, y0, ...]
 * where n1, n2 are vertex counts for each polygon.
 */
function parsePolygonVertices(encoded: Float64Array | number[]): Array<number[]> {
  const polygons: Array<number[]> = [];
  let i = 0;

  while (i < encoded.length) {
    const vertexCount = encoded[i];
    i++;

    if (vertexCount < 2 || i + vertexCount * 2 > encoded.length) {
      break; // Invalid data
    }

    const vertices: number[] = [];
    for (let v = 0; v < vertexCount; v++) {
      vertices.push(encoded[i], encoded[i + 1]);
      i += 2;
    }
    polygons.push(vertices);
  }

  return polygons;
}

/**
 * Calculate snapped point with geometry priority.
 *
 * Attempts to snap to geometry (edges) first, falls back to grid snap.
 * Use skipGeometry to force grid-only snapping (e.g., when Shift is held).
 *
 * @param screenX - Screen X coordinate
 * @param screenY - Screen Y coordinate
 * @param worldX - Unsnapped world X coordinate
 * @param worldY - Unsnapped world Y coordinate
 * @param encodedVertices - All vertices from geometry elements
 * @param zoom - Viewport zoom
 * @param offset - Viewport offset
 * @param skipGeometry - If true, skip geometry snapping and use grid only
 * @returns Snap result with point and snap type
 */
export function calculateSnappedPoint(
  screenX: number,
  screenY: number,
  worldX: number,
  worldY: number,
  encodedVertices: Float64Array | number[] | null,
  zoom: number,
  offset: { x: number; y: number },
  skipGeometry = false,
): SnapResult {
  // Try geometry snap (edges, which includes vertices)
  if (!skipGeometry && encodedVertices && encodedVertices.length >= 5) {
    const polygons = parsePolygonVertices(encodedVertices);
    if (polygons.length > 0) {
      const geometrySnap = findNearestEdgePoint(screenX, screenY, polygons, zoom, offset);
      if (geometrySnap) {
        return {
          point: geometrySnap,
          isGeometrySnap: true,
        };
      }
    }
  }

  // Fall back to grid snap
  return {
    point: {
      x: snapToGrid(worldX),
      y: snapToGrid(worldY),
    },
    isGeometrySnap: false,
  };
}
