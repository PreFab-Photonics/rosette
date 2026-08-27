import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { ImportComponentCommand, viewportPlacement } from "@/lib/commands";
import {
  materializeProjectComponent,
  type ComponentLayerValue,
  type ComponentParameterValue,
  type ProjectComponentParameter,
} from "@/lib/project-components";
import { cn } from "@/lib/utils";
import { useComponentDialogStore } from "@/stores/component-dialog";
import { useHistoryStore } from "@/stores/history";
import { useLayerStore, type Layer } from "@/stores/layer";
import { useStatusMessageStore } from "@/stores/status-message";
import { useWasmContextStore } from "@/stores/wasm-context";

type FormValue = string | boolean | null;
type FieldErrors = Record<string, string>;

const NULL_CHOICE = "__rosette_null_choice__";
const MAIN_LAYER_FIELD = "__layer__";
const DISPLAY_WORDS: Record<string, string> = {
  dfm: "DFM",
  drc: "DRC",
  gds: "GDS",
  id: "ID",
  mmi: "MMI",
  n: "N",
  sbend: "S-bend",
};

function humanize(name: string): string {
  const words = name.replace(/[_-]+/g, " ").trim().split(/\s+/);
  if (!words[0]) return name;
  return words
    .map(
      (word, index) =>
        DISPLAY_WORDS[word.toLowerCase()] ?? (index === 0 ? humanizeWord(word) : word),
    )
    .join(" ");
}

function humanizeWord(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}

function fieldId(name: string): string {
  return `component-parameter-${name}`;
}

function layerKey(layer: ComponentLayerValue): string {
  return `${layer.layerNumber}/${layer.datatype}`;
}

function layerValue(layer: Layer): ComponentLayerValue {
  return { layerNumber: layer.layerNumber, datatype: layer.datatype };
}

function fallbackValue(parameter: ProjectComponentParameter, layers: Layer[]): FormValue {
  const firstChoice = parameter.choices?.[0];
  if (parameter.type === "boolean") {
    return typeof firstChoice === "boolean" ? firstChoice : false;
  }
  if (parameter.type === "layer") {
    return layers[0] ? layerKey(layerValue(layers[0])) : null;
  }
  if (firstChoice !== undefined) return String(firstChoice);
  if (parameter.type === "integer" || parameter.type === "number") return "0";
  return "";
}

function initialValue(parameter: ProjectComponentParameter, layers: Layer[]): FormValue {
  const value = parameter.default;
  if (value === null) return null;
  if (value === undefined) {
    return parameter.nullable ? null : fallbackValue(parameter, layers);
  }
  if (parameter.type === "boolean") return typeof value === "boolean" ? value : false;
  if (parameter.type === "layer") {
    return typeof value === "object" ? layerKey(value) : fallbackValue(parameter, layers);
  }
  return String(value);
}

function parseParameter(
  parameter: ProjectComponentParameter,
  raw: FormValue,
  layers: Layer[],
): ComponentParameterValue {
  if (raw === null) {
    if (parameter.nullable) return null;
    throw new Error(`${humanize(parameter.name)} is required`);
  }
  if (parameter.type === "boolean") return raw === true;
  if (typeof raw !== "string") throw new Error(`${humanize(parameter.name)} is invalid`);
  if (raw === "" && parameter.type !== "string") {
    throw new Error(`${humanize(parameter.name)} is required`);
  }

  if (parameter.type === "integer") {
    const value = Number(raw);
    if (!Number.isInteger(value)) {
      throw new Error(`${humanize(parameter.name)} must be an integer`);
    }
    return value;
  }
  if (parameter.type === "number") {
    const value = Number(raw);
    if (!Number.isFinite(value)) {
      throw new Error(`${humanize(parameter.name)} must be a finite number`);
    }
    return value;
  }
  if (parameter.type === "layer") {
    const layer = layers.find((candidate) => layerKey(layerValue(candidate)) === raw);
    if (!layer) throw new Error(`${humanize(parameter.name)} must be a project layer`);
    return layerValue(layer);
  }
  return raw;
}

function SelectChevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-foreground-subtle"
    >
      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FieldRow({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
      data-field={label}
    >
      <label htmlFor={id} className="pt-1.5 text-xs text-foreground-muted select-none">
        {label}
      </label>
      <div className="w-full min-w-0 sm:w-52">
        {children}
        {error && (
          <p id={`${id}-error`} className="mt-1 text-[11px] leading-tight text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function LayerControl({
  id,
  value,
  layers,
  nullable = false,
  error,
  disabled,
  inputRef,
  onChange,
}: {
  id: string;
  value: string | null;
  layers: Layer[];
  nullable?: boolean;
  error?: string;
  disabled?: boolean;
  inputRef?: RefObject<HTMLSelectElement | null>;
  onChange: (value: string | null) => void;
}) {
  const selected = layers.find((layer) => layerKey(layerValue(layer)) === value);

  return (
    <div className="relative">
      {selected && (
        <span
          className="pointer-events-none absolute top-1/2 left-2.5 z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-sm border border-theme-border"
          style={{ backgroundColor: selected.color }}
        />
      )}
      <select
        ref={inputRef}
        id={id}
        value={value ?? ""}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value || null)}
        className={cn(
          "h-8 w-full appearance-none rounded-lg border bg-input pr-7 text-xs text-foreground outline-none transition-colors",
          selected ? "pl-8" : "pl-2",
          error
            ? "border-danger focus:border-danger"
            : "border-theme-border focus:border-focus-ring",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {nullable && <option value="">None</option>}
        {!nullable && !selected && <option value="">Select layer...</option>}
        {layers.map((layer) => (
          <option key={layer.id} value={layerKey(layerValue(layer))}>
            {layer.name} ({layer.layerNumber}/{layer.datatype})
          </option>
        ))}
      </select>
      <SelectChevron />
    </div>
  );
}

function ParameterField({
  parameter,
  value,
  layers,
  error,
  disabled,
  onChange,
}: {
  parameter: ProjectComponentParameter;
  value: FormValue;
  layers: Layer[];
  error?: string;
  disabled?: boolean;
  onChange: (value: FormValue) => void;
}) {
  const id = fieldId(parameter.name);
  const previousValue = useRef<FormValue>(value ?? fallbackValue(parameter, layers));

  useEffect(() => {
    if (value !== null) previousValue.current = value;
  }, [value]);

  const inputClass = cn(
    "h-8 w-full rounded-lg border bg-input px-2 text-xs text-foreground outline-none transition-colors",
    parameter.type === "number" || parameter.type === "integer"
      ? "text-right font-mono"
      : "text-left",
    error ? "border-danger focus:border-danger" : "border-theme-border focus:border-focus-ring",
    disabled && "cursor-not-allowed opacity-50",
  );

  if (parameter.type === "layer") {
    return (
      <FieldRow id={id} label={humanize(parameter.name)} error={error}>
        <LayerControl
          id={id}
          value={typeof value === "string" ? value : null}
          layers={layers}
          nullable={parameter.nullable}
          error={error}
          disabled={disabled}
          onChange={onChange}
        />
      </FieldRow>
    );
  }

  if (parameter.type === "boolean" && !parameter.nullable && !parameter.choices) {
    return (
      <FieldRow id={id} label={humanize(parameter.name)} error={error}>
        <label className="flex h-8 items-center justify-end gap-2 text-xs text-foreground-secondary">
          <input
            id={id}
            type="checkbox"
            checked={value === true}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => onChange(event.target.checked)}
            className="h-4 w-4 accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          {value === true ? "Enabled" : "Disabled"}
        </label>
      </FieldRow>
    );
  }

  if (parameter.type === "boolean" || parameter.choices) {
    const choices =
      parameter.type === "boolean"
        ? (parameter.choices?.filter(
            (choice): choice is boolean => typeof choice === "boolean",
          ) ?? [true, false])
        : parameter.choices;
    const selectedIndex = choices?.findIndex((choice) => String(choice) === String(value)) ?? -1;

    return (
      <FieldRow id={id} label={humanize(parameter.name)} error={error}>
        <div className="relative">
          <select
            id={id}
            value={value === null ? NULL_CHOICE : `choice:${selectedIndex}`}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => {
              if (event.target.value === NULL_CHOICE) {
                onChange(null);
                return;
              }
              const choice = choices?.[Number(event.target.value.slice(7))];
              if (choice !== undefined) {
                onChange(parameter.type === "boolean" ? Boolean(choice) : String(choice));
              }
            }}
            className={cn(inputClass, "appearance-none pr-7 text-left font-sans")}
          >
            {parameter.nullable && <option value={NULL_CHOICE}>None</option>}
            {selectedIndex < 0 && <option value="choice:-1">Select value...</option>}
            {choices?.map((choice, index) => (
              <option key={`${typeof choice}:${String(choice)}`} value={`choice:${index}`}>
                {typeof choice === "boolean" ? (choice ? "Enabled" : "Disabled") : String(choice)}
              </option>
            ))}
          </select>
          <SelectChevron />
        </div>
      </FieldRow>
    );
  }

  return (
    <FieldRow id={id} label={humanize(parameter.name)} error={error}>
      <div className="flex min-w-0 items-center gap-2">
        <input
          id={id}
          type="text"
          inputMode={parameter.type === "string" ? undefined : "decimal"}
          value={value === null ? "" : String(value)}
          disabled={disabled || value === null}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
        {parameter.nullable && (
          <label className="flex shrink-0 items-center gap-1 text-[11px] text-foreground-subtle select-none">
            <input
              type="checkbox"
              checked={value === null}
              disabled={disabled}
              aria-label={`Use None for ${humanize(parameter.name)}`}
              onChange={(event) => onChange(event.target.checked ? null : previousValue.current)}
              className="h-3.5 w-3.5 accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            None
          </label>
        )}
      </div>
    </FieldRow>
  );
}

export function ComponentDialog() {
  const component = useComponentDialogStore((state) => state.component);
  const close = useComponentDialogStore((state) => state.close);
  const layerMap = useLayerStore((state) => state.layers);
  const activeLayerId = useLayerStore((state) => state.activeLayerId);
  const layers = useMemo(
    () =>
      Array.from(layerMap.values()).sort(
        (left, right) => left.layerNumber - right.layerNumber || left.datatype - right.datatype,
      ),
    [layerMap],
  );
  const [mainLayerId, setMainLayerId] = useState(activeLayerId);
  const [values, setValues] = useState<Record<string, FormValue>>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const contentRef = useRef<HTMLDialogElement>(null);
  const firstControlRef = useRef<HTMLSelectElement>(null);

  useKeyboardFocus("component-dialog", component !== null);

  const dismiss = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    submittingRef.current = false;
    close();
  }, [close]);

  useEffect(() => {
    if (!component) return;
    abortRef.current?.abort();
    abortRef.current = null;
    submittingRef.current = false;
    const selectedLayerId = layerMap.has(activeLayerId) ? activeLayerId : (layers[0]?.id ?? 0);
    setMainLayerId(selectedLayerId);
    setValues(
      Object.fromEntries(
        component.parameters.map((parameter) => [parameter.name, initialValue(parameter, layers)]),
      ),
    );
    setFieldErrors({});
    setRequestError(null);
    setIsSubmitting(false);
  }, [component, activeLayerId, layerMap, layers]);

  useEffect(() => {
    if (!component) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => firstControlRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      previousFocus?.focus();
    };
  }, [component]);

  useEffect(() => {
    if (!component) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (
        contentRef.current &&
        (event.target === contentRef.current || !contentRef.current.contains(event.target as Node))
      ) {
        dismiss();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [component, dismiss]);

  if (!component) return null;

  const updateValue = (name: string, value: FormValue) => {
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    setRequestError(null);
  };

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (submittingRef.current) return;

    const errors: FieldErrors = {};
    const parameters: Record<string, ComponentParameterValue> = {};
    const mainLayer = layerMap.get(mainLayerId);
    if (!mainLayer) errors[MAIN_LAYER_FIELD] = "Select a project layer";

    for (const parameter of component.parameters) {
      try {
        parameters[parameter.name] = parseParameter(
          parameter,
          parameter.name in values ? values[parameter.name] : null,
          layers,
        );
      } catch (reason) {
        errors[parameter.name] = reason instanceof Error ? reason.message : String(reason);
      }
    }

    if (Object.keys(errors).length > 0 || !mainLayer) {
      setFieldErrors(errors);
      const firstInvalid =
        MAIN_LAYER_FIELD in errors ? fieldId(MAIN_LAYER_FIELD) : fieldId(Object.keys(errors)[0]);
      requestAnimationFrame(() => document.getElementById(firstInvalid)?.focus());
      return;
    }

    const context = useWasmContextStore.getState();
    if (!context.library || !context.renderer) {
      setRequestError("The editor is not ready");
      return;
    }
    const { library, renderer } = context;
    const controller = new AbortController();
    abortRef.current = controller;
    submittingRef.current = true;
    setIsSubmitting(true);
    setRequestError(null);

    try {
      const materialized = await materializeProjectComponent(
        {
          name: component.name,
          layer: layerValue(mainLayer),
          parameters,
        },
        controller.signal,
      );
      const currentContext = useWasmContextStore.getState();
      if (
        useComponentDialogStore.getState().component !== component ||
        currentContext.library !== library ||
        currentContext.renderer !== renderer
      ) {
        return;
      }
      const canvas = document.getElementById("rosette-canvas") ?? document.querySelector("canvas");
      if (!(canvas instanceof HTMLElement)) throw new Error("The editor is not ready");
      const placement = viewportPlacement(canvas);
      const placed = useHistoryStore
        .getState()
        .execute(
          new ImportComponentCommand(
            materialized.layoutJson,
            materialized.topCell,
            materialized.cellNames,
            placement.centerX,
            placement.centerY,
          ),
          { library, renderer },
        );
      if (!placed) throw new Error("The component could not be imported into this design");
      useStatusMessageStore.getState().show(`Placed ${materialized.topCell}`, "info");
      close();
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      if (useComponentDialogStore.getState().component === component) {
        setRequestError(reason instanceof Error ? reason.message : String(reason));
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    }
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      dismiss();
      return;
    }
    if (event.key !== "Tab" || !contentRef.current) return;

    const controls = Array.from(
      contentRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]',
      ),
    );
    if (controls.length === 0) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const parameterCount = component.parameters.length;
  const mainLayer = layerMap.get(mainLayerId);
  const mainLayerKey = mainLayer ? layerKey(layerValue(mainLayer)) : null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:items-start sm:px-4 sm:pt-[min(12vh,96px)] sm:pb-3">
        <dialog
          open
          ref={contentRef}
          aria-label={`Add ${humanize(component.name)}`}
          aria-modal="true"
          aria-busy={isSubmitting}
          className="static m-0 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[440px] flex-col overflow-hidden rounded-xl border border-theme-border bg-surface p-0 shadow-md backdrop-blur-xl outline-none sm:max-h-[calc(100dvh-7rem)]"
          onKeyDown={handleDialogKeyDown}
          onCancel={(event) => {
            event.preventDefault();
            dismiss();
          }}
        >
          <div className="border-b border-theme-border px-4 py-3 text-sm font-medium text-foreground select-none">
            Add {humanize(component.name)}
          </div>

          <form className="flex min-h-0 flex-auto flex-col" onSubmit={submit}>
            <fieldset
              disabled={isSubmitting}
              className="min-h-0 flex-auto overflow-y-auto px-4 py-3"
            >
              {requestError && (
                <div
                  className="mb-3 rounded-lg border border-danger/40 bg-danger/10 px-2.5 py-2 text-xs leading-relaxed text-danger"
                  role="alert"
                  aria-live="polite"
                >
                  {requestError}
                </div>
              )}

              <div className="pb-1.5 text-[10px] font-semibold tracking-wider text-foreground-faint uppercase select-none">
                Placement
              </div>
              <FieldRow
                id={fieldId(MAIN_LAYER_FIELD)}
                label="Layer"
                error={fieldErrors[MAIN_LAYER_FIELD]}
              >
                <LayerControl
                  id={fieldId(MAIN_LAYER_FIELD)}
                  inputRef={firstControlRef}
                  value={mainLayerKey}
                  layers={layers}
                  error={fieldErrors[MAIN_LAYER_FIELD]}
                  disabled={isSubmitting}
                  onChange={(value) => {
                    const selected = layers.find((layer) => value === layerKey(layerValue(layer)));
                    if (selected) setMainLayerId(selected.id);
                    setFieldErrors((current) => {
                      if (!(MAIN_LAYER_FIELD in current)) return current;
                      const next = { ...current };
                      delete next[MAIN_LAYER_FIELD];
                      return next;
                    });
                    setRequestError(null);
                  }}
                />
              </FieldRow>

              {parameterCount > 0 && (
                <>
                  <div className="mt-4 border-t border-theme-border pt-3 pb-1.5 text-[10px] font-semibold tracking-wider text-foreground-faint uppercase select-none">
                    Parameters
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {component.parameters.map((parameter) => (
                      <ParameterField
                        key={parameter.name}
                        parameter={parameter}
                        value={parameter.name in values ? values[parameter.name] : null}
                        layers={layers}
                        error={fieldErrors[parameter.name]}
                        disabled={isSubmitting}
                        onChange={(value) => updateValue(parameter.name, value)}
                      />
                    ))}
                  </div>
                </>
              )}
            </fieldset>

            <div className="flex flex-col gap-2 border-t border-theme-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="text-xs text-foreground-subtle select-none">
                {parameterCount === 0
                  ? "No configurable parameters"
                  : `${parameterCount} ${parameterCount === 1 ? "parameter" : "parameters"}`}
              </span>
              <div className="flex shrink-0 items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={dismiss}
                  className="rounded-lg border border-theme-border px-3 py-1.5 text-xs text-foreground-secondary transition-colors hover:bg-input"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || layers.length === 0}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    isSubmitting || layers.length === 0
                      ? "cursor-not-allowed opacity-40"
                      : "border-theme-border-strong bg-theme-border text-foreground hover:bg-theme-border-strong",
                  )}
                >
                  {isSubmitting ? "Creating..." : "Place Component"}
                </button>
              </div>
            </div>
          </form>
        </dialog>
      </div>
    </div>
  );
}
