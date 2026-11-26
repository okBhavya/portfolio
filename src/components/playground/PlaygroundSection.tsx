"use client";

import React from "react";
import { Gamepad2 } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { HardTetrisGame } from "./HardTetrisGame";

export function PlaygroundSection() {
  return (
    <section
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
                className="mt-1 font-serif-display text-3xl font-bold tracking-tight text-[var(--ink-primary)] sm:text-4xl"
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
          <HardTetrisGame />
        </SectionReveal>
      </div>
    </section>
  );
}
