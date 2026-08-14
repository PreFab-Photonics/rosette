import { describe, expect, it } from "vitest";
import { getAdjacentKeyAfterRemoval, getUndoRedoIntent, isEditableTarget } from "./keyboard";

describe("keyboard helpers", () => {
  it("identifies text-editing targets", () => {
    expect(isEditableTarget(document.createElement("input"))).toBe(true);
    expect(isEditableTarget(document.createElement("textarea"))).toBe(true);
    expect(isEditableTarget(document.createElement("select"))).toBe(true);
    expect(isEditableTarget(document.createElement("button"))).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
  });

  it("recognizes undo and redo shortcuts", () => {
    expect(getUndoRedoIntent({ key: "z", metaKey: true, ctrlKey: false, shiftKey: false })).toBe(
      "undo",
    );
    expect(getUndoRedoIntent({ key: "Z", metaKey: false, ctrlKey: true, shiftKey: true })).toBe(
      "redo",
    );
    expect(getUndoRedoIntent({ key: "z", metaKey: false, ctrlKey: false, shiftKey: false })).toBe(
      null,
    );
  });

  it("chooses the next row, or the previous row at the end, after removal", () => {
    expect(getAdjacentKeyAfterRemoval([1, 2, 3], 2)).toBe(3);
    expect(getAdjacentKeyAfterRemoval([1, 2, 3], 3)).toBe(2);
    expect(getAdjacentKeyAfterRemoval([1], 1)).toBeNull();
    expect(getAdjacentKeyAfterRemoval([1, 2], 9)).toBeNull();
  });
});
