import { useEffect } from "react";
import { useKeyboardFocusStore } from "@/stores/keyboard-focus";

/**
 * Claims keyboard focus while a component is active.
 *
 * When claimed, canvas keyboard shortcuts are disabled to prevent
 * conflicts (e.g., typing in a search input triggering tool shortcuts).
 *
 * Automatically releases on unmount or when `isActive` becomes false.
 *
 * @param layerName - Unique identifier for this focus layer (e.g., "command-palette")
 * @param isActive - Whether this component is currently active/visible
 *
 * @example
 * ```tsx
 * function CommandPalette() {
 *   const isOpen = useCommandPaletteStore((s) => s.isOpen);
 *   useKeyboardFocus("command-palette", isOpen);
 *   // ...
 * }
 * ```
 */
export function useKeyboardFocus(layerName: string, isActive: boolean): void {
  useEffect(() => {
    if (isActive) {
      useKeyboardFocusStore.getState().claim(layerName);
      return () => {
        useKeyboardFocusStore.getState().release(layerName);
      };
    }
  }, [layerName, isActive]);
}
