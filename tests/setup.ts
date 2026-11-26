import React from "react";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock next/image synchronously for fast Vitest + jsdom runs without Next server image loader overhead
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const cleanProps = { ...props };
    delete cleanProps.priority;
    delete cleanProps.fill;
    delete cleanProps.unoptimized;
    return React.createElement("img", cleanProps);
  },
}));

// Mock IntersectionObserver for jsdom test environment (triggers immediate intersection)
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [1];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  disconnect(): void {}
  observe(target: Element): void {
    this.callback(
      [
        {
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRatio: 1,
          intersectionRect: target.getBoundingClientRect(),
          isIntersecting: true,
          rootBounds: null,
          target,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ],
      this
    );
  }
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

// Lightweight Canvas 2D context mock for HardTetrisGame tests in jsdom
HTMLCanvasElement.prototype.getContext = (() => {
  return {
    setTransform: () => {},
    translate: () => {},
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
