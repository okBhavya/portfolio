import "@testing-library/jest-dom/vitest";

// Mock IntersectionObserver for jsdom test environment
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect(): void {}
  observe(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve(): void {}
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock matchMedia for reduced-motion & responsive hooks
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Lightweight Canvas 2D context mock for ByteRunnerGame tests in jsdom
HTMLCanvasElement.prototype.getContext = (() => {
  return {
    setTransform: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    roundRect: () => {},
    fill: () => {},
    stroke: () => {},
    fillText: () => {},
    save: () => {},
    restore: () => {},
    setLineDash: () => {},
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    lineCap: "butt",
    font: "",
    textAlign: "left",
    globalAlpha: 1,
  };
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;
