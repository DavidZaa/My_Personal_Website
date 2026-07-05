import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { lockBodyScroll } from "./scrollLock";

describe("lockBodyScroll", () => {
  beforeEach(() => {
    // jsdom does not implement scrollTo; stub it so unlock can call it.
    window.scrollTo = vi.fn();
    Object.defineProperty(window, "scrollY", { value: 240, configurable: true });
    document.body.style.cssText = "";
  });

  afterEach(() => {
    document.body.style.cssText = "";
  });

  it("pins the body at the current scroll offset", () => {
    lockBodyScroll();
    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("-240px");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores prior styles and scroll position on unlock", () => {
    const unlock = lockBodyScroll();
    unlock();
    expect(document.body.style.position).toBe("");
    expect(document.body.style.top).toBe("");
    expect(document.body.style.overflow).toBe("");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 240);
  });
});
