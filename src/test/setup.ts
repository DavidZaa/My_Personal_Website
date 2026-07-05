import "@testing-library/jest-dom/vitest";

// Node's experimental global localStorage shadows jsdom's and stays inert
// unless run with --localstorage-file, so `localStorage` is undefined in
// tests (and emits an ExperimentalWarning). Install a small in-memory
// Storage so code under test can persist without a browser.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", { value: storage, configurable: true });
}
