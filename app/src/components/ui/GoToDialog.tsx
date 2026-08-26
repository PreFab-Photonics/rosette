import { useCallback, useEffect, useRef, useState } from "react";
import { useGoToDialogStore } from "@/stores/goto-dialog";
import { useViewportStore, GRID_SIZE } from "@/stores/viewport";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { getEffectiveViewport } from "@/lib/utils";

/** Micron display scale: 1 µm = 1000 nm. */
const UM_SCALE = 1_000;

/**
 * A single labelled coordinate input for the Go To dialog.
 */
function CoordinateField({
  label,
  value,
  onChange,
  autoFocus,
  onSubmit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
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
      <label className="text-xs text-foreground-muted select-none">{label}</label>
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
          className="w-20 rounded border border-theme-border bg-input px-1.5 py-1 text-right font-mono text-xs text-foreground outline-none focus:border-focus-ring"
          step={0.1}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
        />
        <span className="w-6 text-xs text-foreground-subtle select-none">{"\u00B5m"}</span>
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
 * backdrop-blur theming). Uses the keyboard-focus stack to
 * disable canvas shortcuts.
 */
export function GoToDialog() {
  const { isOpen, close } = useGoToDialogStore();

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

  const contentRef = useRef<HTMLDialogElement>(null);

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
        <dialog
          open
          ref={contentRef}
          aria-label="Go to Coordinate"
          className="static m-0 w-full max-w-[320px] overflow-hidden rounded-xl border border-theme-border bg-surface p-0 shadow-md backdrop-blur-xl"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              close();
            }
          }}
        >
          {/* Header */}
          <div className="border-b border-theme-border px-4 py-3 text-sm font-medium text-foreground select-none">
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
              autoFocus
              onSubmit={handleConfirm}
            />
            <CoordinateField label="Y" value={y} onChange={setY} onSubmit={handleConfirm} />
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end border-t border-theme-border px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-theme-border px-3 py-1.5 text-xs text-foreground-secondary transition-colors hover:bg-input"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-lg border border-theme-border-strong bg-theme-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-theme-border-strong"
              >
                Go To
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}
