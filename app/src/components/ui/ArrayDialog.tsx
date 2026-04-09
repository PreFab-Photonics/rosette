import { useCallback, useEffect, useRef, useState } from "react";
import { useArrayDialogStore } from "@/stores/array-dialog";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import { useUIStore } from "@/stores/ui";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { CreateArrayCommand } from "@/lib/commands";
import { GRID_SIZE } from "@/stores/viewport";
import { cn } from "@/lib/utils";

/** Micron display scale: 1 µm = 1000 nm. */
const UM_SCALE = 1_000;

/**
 * A single labelled number input used inside the dialog.
 * Minimal compared to InspectorPanel's NumberField — no click-to-edit dance,
 * just a regular <input> since we're in a modal form.
 */
function DialogField({
  label,
  value,
  onChange,
  isDark,
  unit,
  min,
  step,
  integer,
  autoFocus,
  onSubmit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  isDark: boolean;
  unit?: string;
  min?: number;
  step?: number;
  integer?: boolean;
  autoFocus?: boolean;
  /** Called when the user presses Enter — should confirm the whole form. */
  onSubmit?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

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
      const clamped = min !== undefined ? Math.max(min, parsed) : parsed;
      const final = integer ? Math.round(clamped) : clamped;
      onChange(final);
      setLocalValue(String(final));
    },
    [onChange, min, integer],
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
              // Enter confirms the whole dialog
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
          step={step}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
        />
        {unit && (
          <span
            className={cn("w-6 text-xs select-none", isDark ? "text-white/40" : "text-black/40")}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Modal dialog for creating an array of duplicated elements.
 *
 * Collects columns, rows, column spacing, and row spacing, then
 * dispatches a CreateArrayCommand through the undo/redo history.
 *
 * Styled consistently with the CommandPalette (centered overlay, backdrop-blur,
 * dark/light theming). Uses the keyboard-focus stack to disable canvas shortcuts.
 */
export function ArrayDialog() {
  const { isOpen, elementIds, close } = useArrayDialogStore();
  const library = useWasmContextStore((s) => s.library);
  const renderer = useWasmContextStore((s) => s.renderer);
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  useKeyboardFocus("array-dialog", isOpen);

  // Form state — both React state (for rendering) and refs (for synchronous
  // reads in handleConfirm, which may fire in the same event as a state update).
  const [columns, _setColumns] = useState(2);
  const [rows, _setRows] = useState(1);
  const [colSpacing, _setColSpacing] = useState(0); // in µm
  const [rowSpacing, _setRowSpacing] = useState(0); // in µm

  const columnsRef = useRef(columns);
  const rowsRef = useRef(rows);
  const colSpacingRef = useRef(colSpacing);
  const rowSpacingRef = useRef(rowSpacing);

  const setColumns = useCallback((v: number) => {
    columnsRef.current = v;
    _setColumns(v);
  }, []);
  const setRows = useCallback((v: number) => {
    rowsRef.current = v;
    _setRows(v);
  }, []);
  const setColSpacing = useCallback((v: number) => {
    colSpacingRef.current = v;
    _setColSpacing(v);
  }, []);
  const setRowSpacing = useCallback((v: number) => {
    rowSpacingRef.current = v;
    _setRowSpacing(v);
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);

  // Compute default spacing from the bounding box of the selected elements
  useEffect(() => {
    if (!isOpen || !library || elementIds.length === 0) return;

    const boundsArray = library.get_bounds_for_ids(elementIds);
    if (boundsArray) {
      const width = boundsArray[2] - boundsArray[0]; // maxX - minX in world units
      const height = boundsArray[3] - boundsArray[1]; // maxY - minY in world units

      // Convert world → µm (edge-to-edge tiling by default)
      const widthUm = width / GRID_SIZE / UM_SCALE;
      const heightUm = height / GRID_SIZE / UM_SCALE;

      // Round to 3 decimals for cleaner display
      setColSpacing(Math.round(widthUm * 1000) / 1000);
      setRowSpacing(Math.round(heightUm * 1000) / 1000);
    }

    // Reset grid to defaults
    setColumns(2);
    setRows(1);
  }, [isOpen, library, elementIds, setColumns, setRows, setColSpacing, setRowSpacing]);

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
  // synchronously after a DialogField commit in the same event loop tick.
  const handleConfirm = useCallback(() => {
    if (!library || !renderer) return;
    const cols = columnsRef.current;
    const rws = rowsRef.current;
    const csp = colSpacingRef.current;
    const rsp = rowSpacingRef.current;

    if (cols < 1 || rws < 1) return;
    if (cols === 1 && rws === 1) {
      // Nothing to create
      close();
      return;
    }

    // Convert µm spacing → world units
    const colSpacingWorld = csp * UM_SCALE * GRID_SIZE;
    // Row spacing: positive µm means "downward on screen" = negative Y in world coords
    const rowSpacingWorld = -(rsp * UM_SCALE * GRID_SIZE);

    const cmd = new CreateArrayCommand(elementIds, cols, rws, colSpacingWorld, rowSpacingWorld);
    useHistoryStore.getState().execute(cmd, { library, renderer });
    close();
  }, [library, renderer, elementIds, close]);

  if (!isOpen) return null;

  const totalCopies = columns * rows - 1;

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="fixed inset-0 flex items-start justify-center px-4 pt-[min(25vh,200px)]">
        <div
          ref={contentRef}
          role="dialog"
          aria-label="Create Array"
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
            Create Array
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-2 px-4 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
          >
            <DialogField
              label="Columns"
              value={columns}
              onChange={setColumns}
              isDark={isDark}
              min={1}
              step={1}
              integer
              autoFocus
              onSubmit={handleConfirm}
            />
            <DialogField
              label="Rows"
              value={rows}
              onChange={setRows}
              isDark={isDark}
              min={1}
              step={1}
              integer
              onSubmit={handleConfirm}
            />
            <DialogField
              label="Col spacing"
              value={colSpacing}
              onChange={setColSpacing}
              isDark={isDark}
              unit={"\u00B5m"}
              step={0.1}
              onSubmit={handleConfirm}
            />
            <DialogField
              label="Row spacing"
              value={rowSpacing}
              onChange={setRowSpacing}
              isDark={isDark}
              unit={"\u00B5m"}
              step={0.1}
              onSubmit={handleConfirm}
            />
          </form>

          {/* Footer */}
          <div
            className={cn(
              "flex items-center justify-between border-t px-4 py-3",
              isDark ? "border-white/10" : "border-black/10",
            )}
          >
            <span className={cn("text-xs select-none", isDark ? "text-white/40" : "text-black/40")}>
              {totalCopies > 0
                ? `${totalCopies} ${totalCopies === 1 ? "copy" : "copies"} will be created`
                : "No copies to create"}
            </span>
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
                disabled={totalCopies === 0}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  totalCopies === 0
                    ? "cursor-not-allowed opacity-40"
                    : isDark
                      ? "border-white/20 bg-white/10 text-white/90 hover:bg-white/15"
                      : "border-black/20 bg-black/10 text-black/90 hover:bg-black/15",
                )}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
