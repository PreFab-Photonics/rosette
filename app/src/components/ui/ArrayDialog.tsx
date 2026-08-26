import { useCallback, useEffect, useRef, useState } from "react";
import { useArrayDialogStore } from "@/stores/array-dialog";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import { useStatusMessageStore } from "@/stores/status-message";
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
  unit?: string;
  min?: number;
  step?: number;
  integer?: boolean;
  autoFocus?: boolean;
  /** Called when the user presses Enter — should confirm the whole form. */
  onSubmit?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-select content when the field receives autoFocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.select();
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
      const clamped = min !== undefined ? Math.max(min, parsed) : parsed;
      const final = integer ? Math.round(clamped) : clamped;
      onChange(final);
      setLocalValue(String(final));
    },
    [onChange, min, integer],
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
          className="w-20 rounded border border-theme-border bg-input px-1.5 py-1 text-right font-mono text-xs text-foreground outline-none focus:border-focus-ring"
          step={step}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
        />
        {unit && <span className="w-6 text-xs text-foreground-subtle select-none">{unit}</span>}
      </div>
    </div>
  );
}

/**
 * Modal dialog for creating an array of duplicated elements.
 *
 * Collects columns, rows, column pitch, and row pitch, then
 * dispatches a CreateArrayCommand through the undo/redo history.
 *
 * Styled consistently with the CommandPalette (centered overlay, backdrop-blur,
 * theming). Uses the keyboard-focus stack to disable canvas shortcuts.
 */
export function ArrayDialog() {
  const { isOpen, elementIds, close } = useArrayDialogStore();
  const library = useWasmContextStore((s) => s.library);
  const renderer = useWasmContextStore((s) => s.renderer);

  useKeyboardFocus("array-dialog", isOpen);

  // Form state — both React state (for rendering) and refs (for synchronous
  // reads in handleConfirm, which may fire in the same event as a state update).
  //
  // The dialog exposes full lattice vectors (four ΔX/ΔY fields) so the user
  // can author rectangular, hex, or oblique arrays from one UI. Rectangular
  // arrays have Col ΔY = 0 and Row ΔX = 0, which is the default seed below.
  const [columns, _setColumns] = useState(2);
  const [rows, _setRows] = useState(1);
  const [colX, _setColX] = useState(0); // µm (display)
  const [colY, _setColY] = useState(0);
  const [rowX, _setRowX] = useState(0);
  const [rowY, _setRowY] = useState(0);

  const columnsRef = useRef(columns);
  const rowsRef = useRef(rows);
  const colXRef = useRef(colX);
  const colYRef = useRef(colY);
  const rowXRef = useRef(rowX);
  const rowYRef = useRef(rowY);

  const setColumns = useCallback((v: number) => {
    columnsRef.current = v;
    _setColumns(v);
  }, []);
  const setRows = useCallback((v: number) => {
    rowsRef.current = v;
    _setRows(v);
  }, []);
  const setColX = useCallback((v: number) => {
    colXRef.current = v;
    _setColX(v);
  }, []);
  const setColY = useCallback((v: number) => {
    colYRef.current = v;
    _setColY(v);
  }, []);
  const setRowX = useCallback((v: number) => {
    rowXRef.current = v;
    _setRowX(v);
  }, []);
  const setRowY = useCallback((v: number) => {
    rowYRef.current = v;
    _setRowY(v);
  }, []);

  const contentRef = useRef<HTMLDialogElement>(null);

  // Compute default spacing from the bounding box of the selected elements.
  // Seeds a rectangular lattice (Col along +X, Row along +Y) sized to
  // edge-to-edge tile the selection.
  useEffect(() => {
    if (!isOpen || !library || elementIds.length === 0) return;

    const boundsArray = library.get_bounds_for_ids(elementIds);
    if (boundsArray) {
      const width = boundsArray[2] - boundsArray[0]; // maxX - minX in world units
      const height = boundsArray[3] - boundsArray[1]; // maxY - minY in world units

      // Default pitch = selection bbox size (edge-to-edge tiling).
      const widthUm = width / GRID_SIZE / UM_SCALE;
      const heightUm = height / GRID_SIZE / UM_SCALE;

      // Round to 3 decimals for cleaner display
      const wRounded = Math.round(widthUm * 1000) / 1000;
      const hRounded = Math.round(heightUm * 1000) / 1000;
      setColX(wRounded);
      setColY(0);
      setRowX(0);
      setRowY(hRounded);
    }

    // Reset grid to defaults
    setColumns(2);
    setRows(1);
  }, [isOpen, library, elementIds, setColumns, setRows, setColX, setColY, setRowX, setRowY]);

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

    if (cols < 1 || rws < 1) return;
    if (cols === 1 && rws === 1) {
      // Nothing to create
      close();
      return;
    }

    // Convert µm → world units. Y is negated (display is screen-up; world
    // is screen-down), matching the polygon vertex / position conventions.
    const colVector = {
      x: colXRef.current * UM_SCALE * GRID_SIZE,
      y: -colYRef.current * UM_SCALE * GRID_SIZE,
    };
    const rowVector = {
      x: rowXRef.current * UM_SCALE * GRID_SIZE,
      y: -rowYRef.current * UM_SCALE * GRID_SIZE,
    };

    // Reject degenerate lattices — they'd stack every copy on top of the
    // original, silently burning undo history on a no-op. We keep the dialog
    // open so the user can correct the offending field instead of having to
    // reopen and re-enter everything. Checks (in order):
    //   - active axis with zero length (e.g. cols>1 but colVec ≈ 0)
    //   - two active axes whose vectors are parallel (collinear lattice)
    // The tolerance matches the grid quantum, since sub-nanometre offsets
    // are indistinguishable on screen and in GDS anyway.
    const EPS = 1e-6;
    const colActive = cols > 1;
    const rowActive = rws > 1;
    const colLen = Math.hypot(colVector.x, colVector.y);
    const rowLen = Math.hypot(rowVector.x, rowVector.y);
    if (colActive && colLen < EPS) {
      useStatusMessageStore
        .getState()
        .show("Column vector is zero — enter Col ΔX or Col ΔY", "warn");
      return;
    }
    if (rowActive && rowLen < EPS) {
      useStatusMessageStore.getState().show("Row vector is zero — enter Row ΔX or Row ΔY", "warn");
      return;
    }
    if (colActive && rowActive) {
      // Parallel iff the cross product vanishes.
      const cross = colVector.x * rowVector.y - colVector.y * rowVector.x;
      if (Math.abs(cross) < EPS * colLen * rowLen) {
        useStatusMessageStore
          .getState()
          .show("Column and row vectors are parallel — copies would overlap", "warn");
        return;
      }
    }

    const cmd = new CreateArrayCommand(elementIds, cols, rws, colVector, rowVector);
    useHistoryStore.getState().execute(cmd, { library, renderer });
    close();
  }, [library, renderer, elementIds, close]);

  if (!isOpen) return null;

  const totalCopies = columns * rows - 1;

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="fixed inset-0 flex items-start justify-center px-4 pt-[min(25vh,200px)]">
        <dialog
          open
          ref={contentRef}
          aria-label="Create Array"
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
              min={1}
              step={1}
              integer
              onSubmit={handleConfirm}
            />
            {/* Full lattice vectors. A rectangular array has Col ΔY = 0 and
                Row ΔX = 0 (the seeded default); hex / oblique arrays use the
                off-axis components. */}
            <DialogField
              label="Col ΔX"
              value={colX}
              onChange={setColX}
              unit={"\u00B5m"}
              step={0.1}
              onSubmit={handleConfirm}
            />
            <DialogField
              label="Col ΔY"
              value={colY}
              onChange={setColY}
              unit={"\u00B5m"}
              step={0.1}
              onSubmit={handleConfirm}
            />
            <DialogField
              label="Row ΔX"
              value={rowX}
              onChange={setRowX}
              unit={"\u00B5m"}
              step={0.1}
              onSubmit={handleConfirm}
            />
            <DialogField
              label="Row ΔY"
              value={rowY}
              onChange={setRowY}
              unit={"\u00B5m"}
              step={0.1}
              onSubmit={handleConfirm}
            />
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-theme-border px-4 py-3">
            <span className="text-xs text-foreground-subtle select-none">
              {totalCopies > 0
                ? `${totalCopies} ${totalCopies === 1 ? "copy" : "copies"} will be created`
                : "No copies to create"}
            </span>
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
                disabled={totalCopies === 0}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  totalCopies === 0
                    ? "cursor-not-allowed opacity-40"
                    : "border-theme-border-strong bg-theme-border text-foreground hover:bg-theme-border-strong",
                )}
              >
                Create
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}
