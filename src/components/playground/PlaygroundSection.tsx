"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Gamepad2 } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";

function TetrisLoadingShell() {
  return (
    <div className="ink-card flex min-h-[580px] flex-col items-center justify-center rounded-3xl bg-[var(--bg-paper)] p-6 text-center">
      <p className="font-mono-tech text-xs font-bold tracking-wider text-[var(--accent-orange)] uppercase">
        Interactive Playground
      </p>
      <p className="mt-2 font-serif-display text-2xl font-bold text-[var(--ink-primary)]">
        Loading Hard Tetris Engine…
      </p>
    </div>
  );
}

const LazyHardTetrisGame = dynamic(
  () => import("./HardTetrisGame").then((mod) => mod.HardTetrisGame),
  {
    ssr: false,
    loading: () => <TetrisLoadingShell />,
  }
);

export function PlaygroundSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldLoadGame, setShouldLoadGame] = useState(false);

  useEffect(() => {
    if (shouldLoadGame) return;

    const triggerLoad = () => setShouldLoadGame(true);

    if (
      typeof window !== "undefined" &&
      (window.location.hash === "#playground" ||
        typeof IntersectionObserver === "undefined")
    ) {
      const rafId = window.requestAnimationFrame(triggerLoad);
      return () => window.cancelAnimationFrame(rafId);
    }

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          triggerLoad();
          observer.disconnect();
        }
      },
      { rootMargin: "450px 0px" }
    );

    const onHashChange = () => {
      if (window.location.hash === "#playground") {
        triggerLoad();
      }
    };

    observer.observe(el);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [shouldLoadGame]);

  return (
    <section
      ref={sectionRef}
      id="playground"
      aria-labelledby="playground-heading"
      className="border-b-2 border-[var(--border-soft)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 font-mono-tech text-xs font-semibold tracking-wider text-[var(--accent-orange)] uppercase">
                <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>05 · Interactive Playground</span>
              </p>
              <h2
                id="playground-heading"
                className="text-balance mt-1 font-serif-display text-3xl font-bold tracking-tight text-[var(--ink-primary)] sm:text-4xl"
              >
                Hard-mode Tetris, customized
              </h2>
            </div>
            <p className="font-hand text-xl text-[var(--accent-blue)]">
              Tune speed, blind ghost, rising garbage &amp; pentominoes!
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.08} className="mt-8">
          {shouldLoadGame ? <LazyHardTetrisGame /> : <TetrisLoadingShell />}
        </SectionReveal>
      </div>
    </section>
  );
}
