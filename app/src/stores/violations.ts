import { create } from "zustand";

/** A single DRC violation as delivered by the dev server over SSE. */
export interface Violation {
  /** "error" or "warning". */
  severity: "error" | "warning";
  /** Display name: the rule's configured name, or its rule type. */
  rule: string;
  /** Human-readable description of the violation. */
  message: string;
  /** Primary layer as [number, datatype]. */
  layer: [number, number];
  /** Second layer for pairwise rules, or null. */
  layer2: [number, number] | null;
  /** Cell containing the primary polygon, or null (e.g. density checks). */
  cell_name: string | null;
  /** Cell containing the second polygon (pairwise rules), or null. */
  cell_name2: string | null;
  /** Bounding box in top-cell global coords: [[minX, minY], [maxX, maxY]]. */
  bbox: [[number, number], [number, number]];
}

/** DRC result payload carried on the `design` SSE event. */
export interface DrcPayload {
  violations: Violation[];
  error_count: number;
  warning_count: number;
  /** Number of violations suppressed by trusted cells (drc_skip). */
  suppressed: number;
  /** Number of violations waived by region (drc_waive_regions). */
  waived: number;
  /** Whether the design passes (warnings alone still pass). */
  passed: boolean;
}

/** Severity filter for the violations panel. */
export type SeverityFilter = "all" | "error" | "warning";

interface ViolationsState {
  /** All (non-suppressed) violations from the latest DRC run. */
  violations: Violation[];
  errorCount: number;
  warningCount: number;
  suppressed: number;
  waived: number;
  passed: boolean;
  /** Whether DRC is configured at all (null payload => not configured). */
  configured: boolean;
  /** Index into `violations` of the selected row, or null. */
  selectedIndex: number | null;
  severityFilter: SeverityFilter;

  /** Replace the violation set from an SSE DRC payload (or clear it). */
  setDrc: (payload: DrcPayload | null) => void;
  /** Select a violation row (or clear with null). */
  selectViolation: (index: number | null) => void;
  setSeverityFilter: (filter: SeverityFilter) => void;
}

export const useViolationsStore = create<ViolationsState>((set) => ({
  violations: [],
  errorCount: 0,
  warningCount: 0,
  suppressed: 0,
  waived: 0,
  passed: true,
  configured: false,
  selectedIndex: null,
  severityFilter: "all",

  setDrc: (payload) =>
    set(() => {
      if (!payload) {
        return {
          violations: [],
          errorCount: 0,
          warningCount: 0,
          suppressed: 0,
          waived: 0,
          passed: true,
          configured: false,
          selectedIndex: null,
        };
      }
      return {
        violations: payload.violations,
        errorCount: payload.error_count,
        warningCount: payload.warning_count,
        suppressed: payload.suppressed,
        waived: payload.waived,
        passed: payload.passed,
        configured: true,
        // Drop a stale selection; the violation set was just rebuilt.
        selectedIndex: null,
      };
    }),

  selectViolation: (index) => set({ selectedIndex: index }),

  setSeverityFilter: (filter) => set({ severityFilter: filter }),
}));
