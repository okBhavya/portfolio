"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  durationMs = 380,
  className = "",
}: AnimatedCounterProps) {
  const prefersReduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [animatedValue, setAnimatedValue] = useState<number>(value);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      return;
    }

    const node = ref.current;
    if (!node) return;

    let rafId = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        observer.disconnect();

        const start = performance.now();

        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setAnimatedValue(value * eased);

          if (progress < 1) {
            rafId = window.requestAnimationFrame(tick);
          } else {
            setAnimatedValue(value);
          }
        };

        rafId = window.requestAnimationFrame(tick);
      },
      { threshold: 0.05, rootMargin: "120px 0px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [value, durationMs, prefersReduced]);

  const displayValue = prefersReduced ? value : animatedValue;

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString("en-IN");

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
