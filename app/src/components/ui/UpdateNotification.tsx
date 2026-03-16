/**
 * In-app update notification toast.
 *
 * Checks for updates shortly after launch. When an update is available,
 * shows a minimal toast in the bottom-right with download progress and
 * a restart button — similar to Linear, Zed, and Cursor.
 *
 * Only active when running inside a Tauri webview; renders nothing in
 * the browser or embed mode.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils";
import { isTauri } from "@/lib/tauri";

type UpdateState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available"; version: string; notes: string | null }
  | { status: "downloading"; version: string; progress: number }
  | { status: "ready"; version: string }
  | { status: "error"; message: string };

/** Delay before the first update check (ms). */
const CHECK_DELAY = 5_000;

export function UpdateNotification() {
  const [state, setState] = useState<UpdateState>({ status: "idle" });
  const [dismissed, setDismissed] = useState(false);
  const isDark = useUIStore((s) => s.theme) === "dark";
  // Hold the update handle so we can download + install later.
  // biome-ignore lint/suspicious/noExplicitAny: Tauri plugin types are dynamic-imported
  const updateRef = useRef<any>(null);
  /** Tracks the available version for use in callbacks without stale closures. */
  const versionRef = useRef("");

  // Check for updates on mount (with delay).
  useEffect(() => {
    if (!isTauri) return;

    const timer = setTimeout(async () => {
      try {
        setState({ status: "checking" });
        const { check } = await import("@tauri-apps/plugin-updater");
        const update = await check();

        if (update) {
          updateRef.current = update;
          versionRef.current = update.version;
          setState({
            status: "available",
            version: update.version,
            notes: update.body ?? null,
          });
        } else {
          setState({ status: "idle" });
        }
      } catch (err) {
        // Don't bother the user if the check fails — just log it.
        console.warn("[updater] check failed:", err);
        setState({ status: "idle" });
      }
    }, CHECK_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const handleDownloadAndInstall = useCallback(async () => {
    const update = updateRef.current;
    if (!update) return;

    try {
      const version = versionRef.current;

      setState({ status: "downloading", version, progress: 0 });

      let downloaded = 0;
      let contentLength = 1; // avoid division by zero

      await update.downloadAndInstall((event: { event: string; data: { contentLength?: number; chunkLength?: number } }) => {
        switch (event.event) {
          case "Started":
            contentLength = event.data.contentLength ?? 1;
            break;
          case "Progress":
            downloaded += event.data.chunkLength ?? 0;
            setState({
              status: "downloading",
              version,
              progress: Math.min(downloaded / contentLength, 1),
            });
            break;
          case "Finished":
            break;
        }
      });

      setState({ status: "ready", version });
    } catch (err) {
      console.error("[updater] download failed:", err);
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Download failed",
      });
    }
  }, []);

  const handleRestart = useCallback(async () => {
    try {
      const { relaunch } = await import("@tauri-apps/plugin-process");
      await relaunch();
    } catch (err) {
      console.error("[updater] relaunch failed:", err);
    }
  }, []);

  // Nothing to show.
  if (!isTauri || state.status === "idle" || state.status === "checking" || dismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-10 right-4 z-[200] flex w-72 flex-col gap-2 rounded-xl border p-3 shadow-lg backdrop-blur-xl animate-[update-toast-in_0.3s_ease-out]",
        isDark
          ? "border-white/10 bg-[rgb(29,29,29)]/95 text-white/90"
          : "border-black/10 bg-[rgb(241,241,241)]/95 text-black/90",
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">
          {state.status === "error" ? "Update failed" : `Update available`}
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded transition-colors",
            isDark ? "hover:bg-white/10 text-white/40" : "hover:bg-black/10 text-black/40",
          )}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 1l8 8M9 1l-8 8" />
          </svg>
        </button>
      </div>

      {/* Version info */}
      {state.status !== "error" && (
        <p className={cn("text-[11px]", isDark ? "text-white/50" : "text-black/50")}>
          v{state.version} is ready to install
        </p>
      )}

      {/* Error message */}
      {state.status === "error" && (
        <p className={cn("text-[11px]", isDark ? "text-red-400/80" : "text-red-600/80")}>
          {state.message}
        </p>
      )}

      {/* Progress bar */}
      {state.status === "downloading" && (
        <div className={cn("h-1 w-full overflow-hidden rounded-full", isDark ? "bg-white/10" : "bg-black/10")}>
          <div
            className="h-full rounded-full bg-brand-purple transition-[width] duration-300 ease-out"
            style={{ width: `${Math.round(state.progress * 100)}%` }}
          />
        </div>
      )}

      {/* Action button */}
      {state.status === "available" && (
        <button
          type="button"
          onClick={handleDownloadAndInstall}
          className="mt-0.5 flex h-7 items-center justify-center rounded-lg border border-brand-purple-dark/50 bg-brand-purple px-3 text-xs font-medium text-white shadow-sm shadow-brand-purple-dark/30 ring-1 ring-inset ring-white/15 transition-colors hover:bg-brand-purple-light active:translate-y-px"
        >
          Download and install
        </button>
      )}

      {state.status === "downloading" && (
        <p className={cn("text-center text-[11px]", isDark ? "text-white/40" : "text-black/40")}>
          Downloading... {Math.round(state.progress * 100)}%
        </p>
      )}

      {state.status === "ready" && (
        <button
          type="button"
          onClick={handleRestart}
          className="mt-0.5 flex h-7 items-center justify-center rounded-lg border border-brand-purple-dark/50 bg-brand-purple px-3 text-xs font-medium text-white shadow-sm shadow-brand-purple-dark/30 ring-1 ring-inset ring-white/15 transition-colors hover:bg-brand-purple-light active:translate-y-px"
        >
          Restart to update
        </button>
      )}

      {state.status === "error" && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className={cn(
            "mt-0.5 flex h-7 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-colors active:translate-y-px",
            isDark
              ? "border-white/10 text-white/70 hover:bg-white/5"
              : "border-black/10 text-black/70 hover:bg-black/5",
          )}
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
