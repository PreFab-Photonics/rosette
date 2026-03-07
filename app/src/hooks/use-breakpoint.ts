import { useSyncExternalStore } from "react";

/**
 * Breakpoint thresholds for responsive layout.
 *
 * The lg threshold is derived from the actual UI geometry:
 *   Explorer (left-4 + w-72 = 304px) + Toolbar (~500px centered) + Sidebar (w-72 + right-4 = 304px)
 *   → 304 + 500 + 304 = 1108px minimum, rounded up to 1120px for breathing room.
 *
 * - lg (>= 1120px): Full desktop — all panels expanded
 * - md (768–1119px): Panels collapse to icon rails, toolbar enters compact mode
 * - sm (< 768px): Single-panel mode, minimal toolbar, simplified status bar
 */
const BREAKPOINTS = {
  md: 768,
  lg: 1120,
} as const;

interface BreakpointState {
  /** >= 1120px — full desktop layout */
  isLg: boolean;
  /** 768–1119px — tablet / narrow desktop */
  isMd: boolean;
  /** < 768px — mobile / very narrow */
  isSm: boolean;
}

/**
 * Resolve current breakpoint state from window width.
 */
function getBreakpointState(): BreakpointState {
  if (typeof window === "undefined") {
    return { isLg: true, isMd: false, isSm: false };
  }
  const w = window.innerWidth;
  return {
    isLg: w >= BREAKPOINTS.lg,
    isMd: w >= BREAKPOINTS.md && w < BREAKPOINTS.lg,
    isSm: w < BREAKPOINTS.md,
  };
}

// Singleton state — updated on every resize, shared by all subscribers.
let current = getBreakpointState();
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): BreakpointState {
  return current;
}

// Single resize listener (attached once at module load).
if (typeof window !== "undefined") {
  const update = () => {
    const next = getBreakpointState();
    if (next.isLg !== current.isLg || next.isMd !== current.isMd || next.isSm !== current.isSm) {
      current = next;
      for (const cb of listeners) cb();
    }
  };

  window.addEventListener("resize", update);
}

/**
 * Subscribe to responsive breakpoint state.
 *
 * Uses `useSyncExternalStore` for tear-free reads — no stale closure issues,
 * no extra re-renders. The resize listener is shared across all subscribers.
 *
 * @example
 * const { isLg, isMd, isSm } = useBreakpoint();
 * if (isSm) return <CollapsedToolbar />;
 */
export function useBreakpoint(): BreakpointState {
  return useSyncExternalStore(subscribe, getSnapshot, () => ({
    isLg: true,
    isMd: false,
    isSm: false,
  }));
}
