import { beforeEach, describe, expect, it } from "vitest";
import { useKeyboardFocusStore } from "./keyboard-focus";

describe("keyboard focus ownership", () => {
  beforeEach(() => useKeyboardFocusStore.setState({ stack: [] }));

  it("gives ownership to the topmost claimed layer", () => {
    const store = useKeyboardFocusStore.getState();
    store.claim("explorer");
    store.claim("context-menu");

    expect(useKeyboardFocusStore.getState().owns("explorer")).toBe(false);
    expect(useKeyboardFocusStore.getState().owns("context-menu")).toBe(true);
    expect(useKeyboardFocusStore.getState().isCanvasActive()).toBe(false);

    useKeyboardFocusStore.getState().release("context-menu");
    expect(useKeyboardFocusStore.getState().owns("explorer")).toBe(true);
  });

  it("keeps repeated claims idempotent", () => {
    const store = useKeyboardFocusStore.getState();
    store.claim("layers");
    store.claim("layers");
    expect(useKeyboardFocusStore.getState().stack).toEqual(["layers"]);
  });
});
