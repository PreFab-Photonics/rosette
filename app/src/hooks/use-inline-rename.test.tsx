import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { useInlineRename } from "./use-inline-rename";

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function Harness({ onCommit }: { onCommit: (value: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const rename = useInlineRename({
    value: "original",
    isEditing,
    onEditingChange: setIsEditing,
    onCommit,
  });

  return isEditing ? (
    <input
      ref={rename.inputRef}
      value={rename.draft}
      onChange={(event) => rename.setDraft(event.target.value)}
      onBlur={rename.commit}
      onKeyDown={rename.handleKeyDown}
    />
  ) : (
    <button type="button" onClick={() => setIsEditing(true)}>
      Rename
    </button>
  );
}

describe("useInlineRename", () => {
  let container: HTMLDivElement;
  let root: Root;
  let onCommit: (value: string) => void;

  beforeAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    onCommit = vi.fn<(value: string) => void>();
    act(() => root.render(<Harness onCommit={onCommit} />));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  function startEditing() {
    const button = container.querySelector("button")!;
    act(() => button.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    return container.querySelector("input")!;
  }

  it("trims and commits once on Enter", () => {
    const input = startEditing();
    expect(document.activeElement).toBe(input);

    act(() => setInputValue(input, "  renamed  "));
    act(() => input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));

    expect(onCommit).toHaveBeenCalledOnce();
    expect(onCommit).toHaveBeenCalledWith("renamed");
    expect(container.querySelector("input")).toBeNull();
  });

  it("cancels on Escape without committing on the resulting blur", () => {
    const input = startEditing();
    act(() => setInputValue(input, "renamed"));
    act(() => input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));

    expect(onCommit).not.toHaveBeenCalled();
    expect(container.querySelector("input")).toBeNull();
  });

  it("commits a changed value on blur", () => {
    const input = startEditing();
    act(() => setInputValue(input, "renamed"));
    act(() => input.blur());
    expect(onCommit).toHaveBeenCalledWith("renamed");
  });
});
