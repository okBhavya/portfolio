"use client";

import React from "react";
import { ArrowDownRight, Mail } from "lucide-react";
import { profileConfig } from "@/data/profile";
import type { ProjectCategory } from "@/data/projects";
import { HeroDeskScene } from "./HeroDeskScene";

interface HeroSectionProps {
  onSelectProjectFilter?: (category: ProjectCategory | "All") => void;
}

export function HeroSection({ onSelectProjectFilter }: HeroSectionProps) {
  const statusLabel =
    profileConfig.availability.labels[profileConfig.availability.mode];

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="bg-lab-dots relative border-b-2 border-[var(--border-soft)] pt-8 pb-14 sm:pt-12 sm:pb-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Copy & Status */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            title={profileConfig.availability.detail}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--border-ink)] bg-[var(--bg-surface)] px-3.5 py-1 text-xs font-semibold text-[var(--ink-primary)] shadow-[0_2px_0_var(--border-ink)]"
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-[var(--accent-green)]"
            />
            <span>{statusLabel}</span>
          </div>

          <p className="mt-5 font-hand text-2xl font-bold text-[var(--accent-orange)] sm:text-3xl">
            {profileConfig.heroGreeting}
          </p>

          <h1
            id="hero-heading"
            className="mt-2 font-serif-display text-3xl leading-[1.12] font-bold tracking-tight text-[var(--ink-primary)] sm:text-5xl lg:text-[3.35rem]"
          >
            {profileConfig.heroHeadline}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--ink-secondary)] sm:text-lg">
            {profileConfig.heroSupporting}
          </p>

          {/* Primary CTAs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#projects"
              className="ink-button inline-flex items-center gap-2 rounded-xl bg-[var(--accent-orange)] px-5 py-3 text-sm font-bold text-[#FFFDF9]"
            >
              <span>Explore my work</span>
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="ink-button inline-flex items-center gap-2 rounded-xl bg-[var(--bg-surface)] px-5 py-3 text-sm font-bold text-[var(--ink-primary)]"
            >
              <Mail className="h-4 w-4 text-[var(--accent-green)]" aria-hidden="true" />
              <span>Let&apos;s connect</span>
            </a>
          </div>
        </div>

        {/* Centerpiece Illustrated Desk Workspace */}
        <div className="mt-9 sm:mt-11">
          <HeroDeskScene onSelectProjectFilter={onSelectProjectFilter} />
        </div>
      </div>
    </section>
  );
}
