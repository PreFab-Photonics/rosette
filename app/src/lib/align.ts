/**
 * Alignment utilities for selected elements.
 *
 * Computes per-element translation deltas to align polygons, text labels,
 * and cell instances relative to a reference element or the cell origin.
 */

import type { WasmLibrary } from "@/wasm/rosette_wasm";

// =============================================================================
// Types
// =============================================================================

/** Supported alignment operations. */
export type AlignType =
  | "align-left"
  | "align-center-h"
  | "align-right"
  | "align-top"
  | "align-center-v"
  | "align-bottom"
  | "center-align"
  | "origin-align";

/** Axis-aligned bounding box. */
interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** A translation to apply to a group of element IDs. */
export interface AlignmentDelta {
  ids: string[];
  dx: number;
  dy: number;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Parse a Float64Array bounds result into an object.
 */
function parseBounds(arr: Float64Array): Bounds {
  return { minX: arr[0], minY: arr[1], maxX: arr[2], maxY: arr[3] };
}

/**
 * Get the center of a bounding box.
 */
function boundsCenter(b: Bounds): { x: number; y: number } {
  return { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 };
}

/**
 * Resolve a flat set of selected IDs into logical alignment groups.
 *
 * Each group represents one "unit" for alignment purposes:
 * - A regular polygon is its own group (single UUID).
 * - A text element is its own group (single UUID).
 * - A cell instance is one group containing all its synthetic ref UUIDs.
 *
 * The function deduplicates by expanding each ID to its group via
 * `library.get_group_ids()` and tracking which IDs have been visited.
 */
export function resolveAlignmentGroups(library: WasmLibrary, selectedIds: Set<string>): string[][] {
  const visited = new Set<string>();
  const groups: string[][] = [];

  for (const id of selectedIds) {
    if (visited.has(id)) continue;

    const groupIds = library.get_group_ids(id);
    // Filter to only IDs that are actually selected
    const selectedGroup = groupIds.filter((gid) => selectedIds.has(gid));
    for (const gid of selectedGroup) {
      visited.add(gid);
    }

    if (selectedGroup.length > 0) {
      groups.push(selectedGroup);
    }
  }

  return groups;
}

// =============================================================================
// Alignment computation
// =============================================================================

/**
 * Compute alignment deltas for all selected element groups.
 *
 * @param library - WASM library for querying element bounds.
 * @param selectedIds - Currently selected element IDs.
 * @param referenceId - The ID of the reference element (other elements align to this).
 *   For `origin-align`, this is ignored and elements align to cell origin (0, 0).
 * @param alignType - The alignment operation to perform.
 * @returns Array of deltas to apply. Empty array if alignment is not possible
 *   (e.g., fewer than 2 groups for non-origin alignment).
 */
export function computeAlignmentDeltas(
  library: WasmLibrary,
  selectedIds: Set<string>,
  referenceId: string | null,
  alignType: AlignType,
): AlignmentDelta[] {
  const groups = resolveAlignmentGroups(library, selectedIds);

  if (alignType === "origin-align") {
    return computeOriginAlign(library, groups);
  }

  // All other alignment types need at least 2 groups and a reference
  if (groups.length < 2 || !referenceId) return [];

  // Find the reference group (the group containing the referenceId)
  const refGroupIndex = groups.findIndex((group) => group.includes(referenceId));
  if (refGroupIndex === -1) return [];

  const refBoundsArr = library.get_bounds_for_ids(groups[refGroupIndex]);
  if (!refBoundsArr) return [];
  const refBounds = parseBounds(refBoundsArr);
  const refCenter = boundsCenter(refBounds);

  const deltas: AlignmentDelta[] = [];

  for (let i = 0; i < groups.length; i++) {
    if (i === refGroupIndex) continue;

    const group = groups[i];
    const boundsArr = library.get_bounds_for_ids(group);
    if (!boundsArr) continue;

    const bounds = parseBounds(boundsArr);
    const center = boundsCenter(bounds);
    let dx = 0;
    let dy = 0;

    switch (alignType) {
      case "align-left":
        dx = refBounds.minX - bounds.minX;
        break;
      case "align-center-h":
        dx = refCenter.x - center.x;
        break;
      case "align-right":
        dx = refBounds.maxX - bounds.maxX;
        break;
      case "align-top":
        dy = refBounds.minY - bounds.minY;
        break;
      case "align-center-v":
        dy = refCenter.y - center.y;
        break;
      case "align-bottom":
        dy = refBounds.maxY - bounds.maxY;
        break;
      case "center-align":
        dx = refCenter.x - center.x;
        dy = refCenter.y - center.y;
        break;
    }

    if (dx !== 0 || dy !== 0) {
      deltas.push({ ids: group, dx, dy });
    }
  }

  return deltas;
}

/**
 * Compute origin-align deltas: move each group's center to the cell origin (0, 0).
 */
function computeOriginAlign(library: WasmLibrary, groups: string[][]): AlignmentDelta[] {
  const deltas: AlignmentDelta[] = [];

  for (const group of groups) {
    const boundsArr = library.get_bounds_for_ids(group);
    if (!boundsArr) continue;

    const center = boundsCenter(parseBounds(boundsArr));
    const dx = -center.x;
    const dy = -center.y;

    if (dx !== 0 || dy !== 0) {
      deltas.push({ ids: group, dx, dy });
    }
  }

  return deltas;
}
