import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { useRovingRows } from "./use-roving-rows";

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};

function Harness({ rowKeys, showEditor = false }: { rowKeys: number[]; showEditor?: boolean }) {
  const [focusedKey, setFocusedKey] = useState<number | null>(2);
  const { getRowProps, handleNavigationKeyDown } = useRovingRows<number, HTMLButtonElement>({
    rowKeys,
    focusedKey,
    fallbackKey: rowKeys[0] ?? null,
    isActive: true,
    wrap: true,
    onFocusedKeyChange: setFocusedKey,
  });

  return (
    <>
      {rowKeys.map((key) => {
        const props = getRowProps(key);
        return (
          <button
            key={key}
            ref={props.ref}
            data-key={key}
            tabIndex={props.tabIndex}
            onFocus={props.onFocus}
            onKeyDown={(event) => handleNavigationKeyDown(event, key)}
          >
            Row {key}
          </button>
        );
      })}
      {showEditor && <input aria-label="Nested editor" />}
    </>
  );
}

describe("useRovingRows", () => {
  let container: HTMLDivElement;
  let root: Root;

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
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const row = (key: number) =>
    container.querySelector<HTMLButtonElement>(`button[data-key="${key}"]`)!;

  it("moves real DOM focus with arrows, Home, and End", () => {
    act(() => root.render(<Harness rowKeys={[1, 2, 3]} />));
    expect(document.activeElement).toBe(row(2));
    expect(row(2).tabIndex).toBe(0);

    act(() =>
      row(2).dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })),
    );
    expect(document.activeElement).toBe(row(3));

    act(() =>
      row(3).dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })),
    );
    expect(document.activeElement).toBe(row(1));

    act(() => row(1).dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
    expect(document.activeElement).toBe(row(3));

    act(() => row(3).dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true })));
    expect(document.activeElement).toBe(row(1));
  });

  it("moves focus to the row at the removed row's previous index", () => {
    act(() => root.render(<Harness rowKeys={[1, 2, 3]} />));
    expect(document.activeElement).toBe(row(2));

    act(() => root.render(<Harness rowKeys={[1, 3]} />));
    expect(document.activeElement).toBe(row(3));
    expect(row(3).tabIndex).toBe(0);
  });

  it("does not steal focus from a nested editor on an equivalent list rerender", () => {
    act(() => root.render(<Harness rowKeys={[1, 2, 3]} showEditor />));
    const editor = container.querySelector<HTMLInputElement>('input[aria-label="Nested editor"]')!;
    act(() => editor.focus());

    act(() => root.render(<Harness rowKeys={[1, 2, 3]} showEditor />));
    expect(document.activeElement).toBe(editor);
  });
});
