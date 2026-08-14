/** Whether a keyboard event originated from a text-editing control. */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable === true
  );
}

/** Resolve the keyboard owner's undo/redo intent for a key event. */
export function getUndoRedoIntent(
  event: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "shiftKey">,
): "undo" | "redo" | null {
  if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return null;
  return event.shiftKey ? "redo" : "undo";
}

/** Pick the row that should receive focus after the current row is removed. */
export function getAdjacentKeyAfterRemoval<Key>(keys: readonly Key[], current: Key): Key | null {
  const index = keys.findIndex((key) => Object.is(key, current));
  if (index === -1 || keys.length <= 1) return null;
  return keys[index < keys.length - 1 ? index + 1 : index - 1] ?? null;
}
