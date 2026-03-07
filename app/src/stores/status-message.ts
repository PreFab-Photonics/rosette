/**
 * Ephemeral status message store.
 *
 * Any part of the app can push a short message that appears in the status bar
 * and auto-dismisses after a configurable duration.
 *
 * Usage:
 *   useStatusMessageStore.getState().show("Something happened", "warn");
 */

import { create } from "zustand";

/** Severity level for styling. */
export type StatusLevel = "info" | "warn" | "error";

interface StatusMessageState {
  /** Current message to display, or null when idle. */
  message: string | null;
  /** Severity level for styling. */
  level: StatusLevel;
  /** Show a status message that auto-dismisses after `duration` ms (default 3000). */
  show: (message: string, level?: StatusLevel, duration?: number) => void;
  /** Clear the current message immediately. */
  clear: () => void;
}

/** Handle for the current auto-dismiss timer. */
let dismissTimer: ReturnType<typeof setTimeout> | null = null;

export const useStatusMessageStore = create<StatusMessageState>((set) => ({
  message: null,
  level: "info",

  show: (message, level = "info", duration = 3000) => {
    // Clear any existing timer so new messages reset the countdown
    if (dismissTimer !== null) {
      clearTimeout(dismissTimer);
    }
    set({ message, level });
    dismissTimer = setTimeout(() => {
      set({ message: null });
      dismissTimer = null;
    }, duration);
  },

  clear: () => {
    if (dismissTimer !== null) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
    set({ message: null });
  },
}));
