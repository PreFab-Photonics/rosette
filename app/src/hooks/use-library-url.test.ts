import { afterEach, describe, expect, it } from "vitest";
import { designApiUrl, isDesignMode } from "./use-library";

const originalUrl = window.location.href;

afterEach(() => {
  window.history.replaceState({}, "", originalUrl);
});

describe("design API URL", () => {
  it("uses the current origin in browser serve mode", () => {
    window.history.replaceState({}, "", "/preview");

    expect(isDesignMode()).toBe(true);
    expect(designApiUrl("/api/design/events")).toBe("/api/design/events?viewerProtocol=1");
  });

  it("keeps legacy design query links working", () => {
    window.history.replaceState({}, "", "/?design=true");

    expect(isDesignMode()).toBe(true);
  });

  it("uses an explicit loopback server from the bundled native app", () => {
    window.history.replaceState({}, "", "/preview?server=http%3A%2F%2F127.0.0.1%3A5173");

    expect(designApiUrl("/api/design/events")).toBe(
      "http://127.0.0.1:5173/api/design/events?viewerProtocol=1",
    );
  });

  it("rejects non-loopback server overrides", () => {
    window.history.replaceState({}, "", "/preview?server=https%3A%2F%2Fexample.com");

    expect(designApiUrl("/api/design")).toBe("/api/design?viewerProtocol=1");
  });
});
