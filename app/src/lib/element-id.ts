export interface SyntheticRefId {
  elementIndex: number;
  copyIndex: number;
  token: string;
}

/** Parse the tokenized synthetic CellRef ID emitted by WASM. */
export function parseSyntheticRefId(id: string): SyntheticRefId | null {
  const parts = id.split(":");
  if (parts.length !== 4 || parts[0] !== "ref" || !parts[3]) return null;
  if (!/^\d+$/.test(parts[1]) || !/^\d+$/.test(parts[2])) return null;
  const elementIndex = Number(parts[1]);
  const copyIndex = Number(parts[2]);
  if (!Number.isSafeInteger(elementIndex) || !Number.isSafeInteger(copyIndex)) return null;
  if (elementIndex < 0 || copyIndex < 0) return null;
  return { elementIndex, copyIndex, token: parts[3] };
}

export function syntheticRefTargetKey(id: string): string | null {
  const parsed = parseSyntheticRefId(id);
  return parsed ? `ref:${parsed.elementIndex}:${parsed.token}` : null;
}
