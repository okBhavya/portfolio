import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-lab-dots flex min-h-dvh items-center justify-center bg-[var(--bg-paper)] px-4 py-16">
      <div className="ink-card w-full max-w-lg rounded-3xl p-7 text-center sm:p-10">
        <div className="mx-auto inline-flex items-center gap-2 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--accent-orange-soft)] px-3 py-1 font-mono-tech text-xs font-bold text-[var(--accent-orange)]">
          <Compass className="h-3.5 w-3.5" aria-hidden="true" />
          <span>404 · PAGE NOT FOUND</span>
        </div>

        <h1 className="mt-5 font-serif-display text-3xl font-bold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
          Off the desk map
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
          This route doesn&apos;t exist in Bhavya&apos;s workbench. Head back to the
          main portfolio or explore verified project case studies from there.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="ink-button inline-flex items-center gap-2 rounded-xl bg-[var(--accent-orange-fill)] px-5 py-2.5 text-sm font-bold text-[#FFFDF9]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Portfolio</span>
          </Link>
          <Link
            href="/#projects"
            className="ink-button inline-flex items-center gap-2 rounded-xl bg-[var(--bg-paper)] px-5 py-2.5 text-sm font-bold text-[var(--ink-primary)]"
          >
            <span>View Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
