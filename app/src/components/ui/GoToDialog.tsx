import { useCallback, useEffect, useRef, useState } from "react";
import { useGoToDialogStore } from "@/stores/goto-dialog";
import { useViewportStore, GRID_SIZE } from "@/stores/viewport";
import { useUIStore } from "@/stores/ui";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { getEffectiveViewport } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Micron display scale: 1 µm = 1000 nm. */
const UM_SCALE = 1_000;

/**
 * A single labelled coordinate input for the Go To dialog.
 */
function CoordinateField({
  label,
  value,
  onChange,
  isDark,
  autoFocus,
  onSubmit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  isDark: boolean;
  autoFocus?: boolean;
  /** Called when the user presses Enter — should confirm the whole form. */
  onSubmit?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-select content when the field receives autoFocus.
  // Use requestAnimationFrame to ensure selection happens after the browser
  // has focused the input and React has flushed the initial value.
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const el = inputRef.current;
      requestAnimationFrame(() => {
        el.focus();
        el.select();
      });
    }
  }, [autoFocus]);

  // Local string state so the user can type freely (e.g. clear the field, type a decimal).
  const [localValue, setLocalValue] = useState(String(value));

  // Sync from parent when value prop changes (e.g. initial defaults)
  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const commit = useCallback(
    (raw: string) => {
      const parsed = Number.parseFloat(raw);
      if (Number.isNaN(parsed)) return;
      onChange(parsed);
      setLocalValue(String(parsed));
    },
    [onChange],
  );

  return (
    <div className="flex items-center justify-between gap-3">
      <label className={cn("text-xs select-none", isDark ? "text-white/50" : "text-black/50")}>
        {label}
      </label>
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => commit(localValue)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit(localValue);
              onSubmit?.();
            } else if (e.key === "Tab") {
              // Wrap Tab cycling within the form inputs
              const form = inputRef.current?.closest("form");
              if (form) {
                const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input"));
                const idx = inputs.indexOf(inputRef.current!);
                if (idx >= 0) {
                  const next = e.shiftKey
                    ? (idx - 1 + inputs.length) % inputs.length
                    : (idx + 1) % inputs.length;
                  e.preventDefault();
                  commit(localValue);
                  inputs[next].focus();
                  inputs[next].select();
                }
              }
            }
          }}
          className={cn(
            "w-20 rounded border px-1.5 py-1 text-right font-mono text-xs outline-none",
            isDark
              ? "border-white/10 bg-white/5 text-white/90 focus:border-white/30"
              : "border-black/10 bg-black/5 text-black/90 focus:border-black/30",
          )}
          step={0.1}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
        />
        <span className={cn("w-6 text-xs select-none", isDark ? "text-white/40" : "text-black/40")}>
          {"\u00B5m"}
        </span>
      </div>
    </div>
  );
}

/**
 * Modal dialog for navigating to a specific coordinate.
 *
 * Collects X and Y coordinates (in µm), then pans the viewport to
 * center on that world position without changing the zoom level.
 *
 * Styled consistently with ArrayDialog and CommandPalette (centered overlay,
 * backdrop-blur, dark/light theming). Uses the keyboard-focus stack to
 * disable canvas shortcuts.
 */
export function GoToDialog() {
  const { isOpen, close } = useGoToDialogStore();
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  useKeyboardFocus("goto-dialog", isOpen);

  // Form state — both React state (for rendering) and refs (for synchronous
  // reads in handleConfirm, which may fire in the same event as a state update).
  const [x, _setX] = useState(0);
  const [y, _setY] = useState(0);

  const xRef = useRef(x);
  const yRef = useRef(y);

  const setX = useCallback((v: number) => {
    xRef.current = v;
    _setX(v);
  }, []);
  const setY = useCallback((v: number) => {
    yRef.current = v;
    _setY(v);
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);

  // Reset to defaults when opened
  useEffect(() => {
    if (!isOpen) return;
    setX(0);
    setY(0);
  }, [isOpen, setX, setY]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen, close]);

  // Read from refs so this always sees the latest values, even when called
  // synchronously after a CoordinateField commit in the same event loop tick.
  const handleConfirm = useCallback(() => {
    const canvas = document.getElementById("rosette-canvas") ?? document.querySelector("canvas");
    if (!canvas) {
      close();
      return;
    }

    // Convert µm → nm → world units
    const worldX = xRef.current * UM_SCALE * GRID_SIZE;
    // Negate Y: user sees Y-up, world uses Y-down
    const worldY = -(yRef.current * UM_SCALE * GRID_SIZE);

    const bounds = { minX: worldX, minY: worldY, maxX: worldX, maxY: worldY };
    const vp = getEffectiveViewport(canvas as HTMLCanvasElement);
    useViewportStore.getState().centerOnBounds(bounds, vp.width, vp.height, vp.screenCenter);

    close();
  }, [close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="fixed inset-0 flex items-start justify-center px-4 pt-[min(25vh,200px)]">
        <div
          ref={contentRef}
          role="dialog"
          aria-label="Go to Coordinate"
          className={cn(
            "w-full max-w-[320px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl",
            isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
          )}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              close();
            }
          }}
        >
          {/* Header */}
          <div
            className={cn(
              "border-b px-4 py-3 text-sm font-medium select-none",
              isDark ? "border-white/10 text-white/90" : "border-black/10 text-black/90",
            )}
          >
            Go to Coordinate
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-2 px-4 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
          >
            <CoordinateField
              label="X"
              value={x}
              onChange={setX}
              isDark={isDark}
              autoFocus
              onSubmit={handleConfirm}
            />
            <CoordinateField
              label="Y"
              value={y}
              onChange={setY}
              isDark={isDark}
              onSubmit={handleConfirm}
            />
          </form>

          {/* Footer */}
          <div
            className={cn(
              "flex items-center justify-end border-t px-4 py-3",
              isDark ? "border-white/10" : "border-black/10",
            )}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={close}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                  isDark
                    ? "border-white/10 text-white/70 hover:bg-white/5"
                    : "border-black/10 text-black/70 hover:bg-black/5",
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  isDark
                    ? "border-white/20 bg-white/10 text-white/90 hover:bg-white/15"
                    : "border-black/20 bg-black/10 text-black/90 hover:bg-black/15",
                )}
              >
                Go To
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
