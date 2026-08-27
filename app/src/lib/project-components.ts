export interface ComponentLayerValue {
  layerNumber: number;
  datatype: number;
}

export type ComponentParameterValue = string | number | boolean | null | ComponentLayerValue;

export interface ProjectComponentParameter {
  name: string;
  type: "number" | "integer" | "string" | "boolean" | "layer";
  required: boolean;
  nullable: boolean;
  default?: ComponentParameterValue;
  choices?: Array<string | number | boolean>;
}

export interface ProjectComponent {
  name: string;
  parameters: ProjectComponentParameter[];
}

export interface ComponentCatalog {
  version: number;
  components: ProjectComponent[];
  error: string | null;
}

export interface MaterializedComponent {
  layoutJson: string;
  topCell: string;
  cellNames: string[];
}

export interface MaterializeComponentRequest {
  name: string;
  layer: ComponentLayerValue;
  parameters: Record<string, ComponentParameterValue>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLayerValue(value: unknown): value is ComponentLayerValue {
  return isRecord(value) && Number.isInteger(value.layerNumber) && Number.isInteger(value.datatype);
}

function isParameterValue(value: unknown): value is ComponentParameterValue {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    isLayerValue(value)
  );
}

function parseParameter(value: unknown): ProjectComponentParameter | null {
  if (!isRecord(value)) return null;
  if (typeof value.name !== "string") return null;
  if (!(["number", "integer", "string", "boolean", "layer"] as unknown[]).includes(value.type)) {
    return null;
  }
  if (typeof value.required !== "boolean" || typeof value.nullable !== "boolean") return null;
  if ("default" in value && !isParameterValue(value.default)) return null;
  if (
    "choices" in value &&
    (!Array.isArray(value.choices) ||
      !value.choices.every(
        (choice) =>
          typeof choice === "string" || typeof choice === "number" || typeof choice === "boolean",
      ))
  ) {
    return null;
  }
  return value as unknown as ProjectComponentParameter;
}

function parseCatalog(value: unknown): ComponentCatalog | null {
  if (!isRecord(value) || !Number.isInteger(value.version) || !Array.isArray(value.components)) {
    return null;
  }
  if (value.error !== null && typeof value.error !== "string") return null;
  const components: ProjectComponent[] = [];
  for (const item of value.components) {
    if (!isRecord(item) || typeof item.name !== "string" || !Array.isArray(item.parameters)) {
      return null;
    }
    const parameters = item.parameters.map(parseParameter);
    if (parameters.some((parameter) => parameter === null)) return null;
    components.push({ name: item.name, parameters: parameters as ProjectComponentParameter[] });
  }
  return { version: value.version as number, components, error: value.error as string | null };
}

async function readApiError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as unknown;
    if (isRecord(body) && typeof body.error === "string") return body.error;
  } catch {
    // Fall through to the HTTP status when the server did not return JSON.
  }
  return `${response.status} ${response.statusText}`.trim();
}

export async function fetchProjectComponentCatalog(): Promise<ComponentCatalog | null> {
  let response: Response;
  try {
    response = await fetch("/api/components", { headers: { Accept: "application/json" } });
  } catch {
    return null;
  }
  if (!response.ok || !response.headers.get("Content-Type")?.includes("application/json")) {
    return null;
  }
  const catalog = parseCatalog((await response.json()) as unknown);
  return catalog;
}

export async function materializeProjectComponent(
  request: MaterializeComponentRequest,
  signal?: AbortSignal,
): Promise<MaterializedComponent> {
  const response = await fetch("/api/components/materialize", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  if (!response.ok) throw new Error(await readApiError(response));

  const body = (await response.json()) as unknown;
  if (
    !isRecord(body) ||
    typeof body.layoutJson !== "string" ||
    typeof body.topCell !== "string" ||
    !Array.isArray(body.cellNames) ||
    !body.cellNames.every((name) => typeof name === "string")
  ) {
    throw new Error("The component server returned an invalid response");
  }
  return body as unknown as MaterializedComponent;
}
