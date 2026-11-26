"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type RevealCallback = () => void;
const revealCallbacks = new Map<Element, RevealCallback>();
let sharedObserver: IntersectionObserver | null = null;

function observeReveal(el: Element, cb: RevealCallback): () => void {
  if (!sharedObserver && typeof IntersectionObserver !== "undefined") {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const fn = revealCallbacks.get(entry.target);
            if (fn) {
              revealCallbacks.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
              fn();
            }
          }
        }
      },
      { threshold: 0.08, rootMargin: "40px 0px" }
    );
  }
  revealCallbacks.set(el, cb);
  sharedObserver?.observe(el);
  return () => {
    revealCallbacks.delete(el);
    sharedObserver?.unobserve(el);
  };
}

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function SectionReveal({
  children,
  className = "",
  delay = 0,
}: SectionRevealProps) {
  const prefersReduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (prefersReduced || revealed) return;

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      const rafId = window.requestAnimationFrame(() => setRevealed(true));
      return () => window.cancelAnimationFrame(rafId);
    }

    return observeReveal(el, () => setRevealed(true));
  }, [prefersReduced, revealed]);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${Math.round(delay * 1000)}ms` } : undefined}
      className={`transition-[opacity,transform] duration-500 ease-out ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
