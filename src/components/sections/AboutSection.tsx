"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Compass,
  GitMerge,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { profileConfig, type ProblemStep } from "@/data/profile";
import { SignatureSvg } from "@/components/SignatureSvg";
import { SectionReveal } from "@/components/SectionReveal";

function getStepStyles(accent: ProblemStep["accent"], isSelected: boolean) {
  switch (accent) {
    case "green":
      return isSelected
        ? "border-[var(--border-ink)] bg-[var(--accent-green)] text-[#FFFDF9] shadow-[0_3px_0_var(--border-ink)]"
        : "border-[var(--border-soft)] bg-[var(--accent-green-soft)]/55 text-[var(--ink-primary)] hover:border-[var(--border-ink)]";
    case "blue":
      return isSelected
        ? "border-[var(--border-ink)] bg-[var(--accent-blue)] text-[#FFFDF9] shadow-[0_3px_0_var(--border-ink)]"
        : "border-[var(--border-soft)] bg-[var(--accent-blue-soft)]/55 text-[var(--ink-primary)] hover:border-[var(--border-ink)]";
    case "mustard":
      return isSelected
        ? "border-[var(--border-ink)] bg-[var(--accent-mustard)] text-[#1F2421] shadow-[0_3px_0_var(--border-ink)]"
        : "border-[var(--border-soft)] bg-[var(--accent-mustard-soft)]/60 text-[var(--ink-primary)] hover:border-[var(--border-ink)]";
    case "orange":
    default:
      return isSelected
        ? "border-[var(--border-ink)] bg-[var(--accent-orange)] text-[#FFFDF9] shadow-[0_3px_0_var(--border-ink)]"
        : "border-[var(--border-soft)] bg-[var(--accent-orange-soft)]/55 text-[var(--ink-primary)] hover:border-[var(--border-ink)]";
  }
}

export function AboutSection() {
  const [selectedStepId, setSelectedStepId] = useState<string>(
    profileConfig.problemApproachFlow[0].id
  );

  const selectedStep =
    profileConfig.problemApproachFlow.find((s) => s.id === selectedStepId) ??
    profileConfig.problemApproachFlow[0];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-b-2 border-[var(--border-soft)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div>
            <p className="font-mono-tech text-xs font-semibold tracking-wider text-[var(--accent-orange)] uppercase">
              01 · Field Notes &amp; Context
            </p>
            <h2
              id="about-heading"
              className="mt-1 font-serif-display text-3xl font-bold tracking-tight text-[var(--ink-primary)] sm:text-4xl"
            >
              A bit about how I think &amp; build
            </h2>
          </div>
        </SectionReveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* Left Column: Positioning, Education & Courses I've Learnt */}
          <SectionReveal delay={0.06} className="lg:col-span-5">
            <div className="ink-card flex h-full flex-col justify-between rounded-3xl p-6 sm:p-7">
              <div>
                <div className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--accent-green-soft)] px-3 py-1.5 text-xs font-bold text-[var(--ink-primary)]">
                  <GraduationCap
                    className="h-4 w-4 text-[var(--accent-green)]"
                    aria-hidden="true"
                  />
                  <span>{profileConfig.education.shortName}</span>
                </div>

                <h3 className="mt-4 font-serif-display text-xl font-bold text-[var(--ink-primary)]">
                  {profileConfig.education.institution}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[var(--ink-secondary)]">
                  {profileConfig.education.degree}
                </p>
                <p className="mt-0.5 font-mono-tech text-xs text-[var(--ink-muted)]">
                  {profileConfig.education.period} ·{" "}
                  {profileConfig.education.location}
                </p>

                <blockquote className="mt-6 rounded-2xl border-2 border-dashed border-[var(--border-soft)] bg-[var(--bg-beige)]/65 p-4 text-sm leading-relaxed text-[var(--ink-primary)]">
                  &ldquo;{profileConfig.positioningStatement}&rdquo;
                </blockquote>

                <div className="mt-6">
                  <p className="font-mono-tech text-[11px] font-semibold tracking-wider text-[var(--ink-muted)] uppercase">
                    Courses I&apos;ve Learnt
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {profileConfig.courses.map((course) => (
                      <span
                        key={course}
                        className="rounded-lg border border-[var(--border-ink)]/35 bg-[var(--bg-beige)]/75 px-2.5 py-1 text-xs font-semibold text-[var(--ink-primary)]"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t-2 border-[var(--border-soft)] pt-4">
                <span className="font-mono-tech text-xs text-[var(--ink-muted)]">
                  Signed in Pilani
                </span>
                <SignatureSvg className="h-12 w-40 text-[var(--ink-primary)]" />
              </div>
            </div>
          </SectionReveal>

          {/* Right Column: Dedicated How I Approach a Problem Flowchart & Breakdown */}
          <SectionReveal delay={0.12} className="lg:col-span-7">
            <div className="ink-card flex h-full flex-col justify-between rounded-3xl p-6 sm:p-8">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono-tech text-xs font-bold tracking-wider text-[var(--accent-green)] uppercase">
                    <GitMerge className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Engineering Workflow</span>
                  </span>
                  <span className="font-hand text-base text-[var(--accent-blue)]">
                    Click any stage in the flow to inspect
                  </span>
                </div>

                <h3 className="mt-2 font-serif-display text-2xl font-bold text-[var(--ink-primary)] sm:text-3xl">
                  How I Approach a Problem
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
                  {profileConfig.problemApproachIntro}
                </p>

                {/* Interactive Engineering Decision Flowchart */}
                <div className="bg-notebook-grid mt-6 rounded-2xl border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] p-4 sm:p-5">
                  <div
                    role="group"
                    aria-label="Problem-solving flowchart steps"
                    className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:gap-1.5"
                  >
                    {profileConfig.problemApproachFlow.map((node, index) => {
                      const isSelected = node.id === selectedStep.id;
                      const isLast =
                        index === profileConfig.problemApproachFlow.length - 1;
                      return (
                        <React.Fragment key={node.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedStepId(node.id)}
                            aria-pressed={isSelected}
                            className={`flex flex-1 flex-row items-center justify-between gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all lg:flex-col lg:items-start lg:px-2.5 lg:py-3 ${getStepStyles(
                              node.accent,
                              isSelected
                            )}`}
                          >
                            <span
                              className={`font-mono-tech text-[10px] font-bold uppercase ${
                                isSelected && node.accent !== "mustard"
                                  ? "text-[#FFFDF9]/90"
                                  : "text-[var(--ink-muted)]"
                              }`}
                            >
                              Step {node.step}
                            </span>
                            <span className="text-xs font-bold leading-snug sm:text-[13px]">
                              {node.shortTitle}
                            </span>
                          </button>

                          {!isLast && (
                            <div
                              aria-hidden="true"
                              className="flex items-center justify-center text-[var(--ink-muted)]"
                            >
                              <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Feedback Loop Indicator */}
                  <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border-soft)] bg-[var(--bg-surface)]/75 px-3 py-1.5 font-mono-tech text-[11px] text-[var(--ink-secondary)]">
                    <RefreshCw
                      className="h-3.5 w-3.5 shrink-0 text-[var(--accent-orange)]"
                      aria-hidden="true"
                    />
                    <span>
                      Feedback Loop: real user metrics &amp; error logs feed
                      directly back into Step 01
                    </span>
                  </div>

                  {/* Active Stage Deep-Dive */}
                  <div className="mt-4 rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-surface)] p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-serif-display text-lg font-bold text-[var(--ink-primary)] sm:text-xl">
                        {selectedStep.title}
                      </h4>
                      <span className="rounded-md bg-[var(--bg-beige)] px-2 py-0.5 font-mono-tech text-[11px] font-bold text-[var(--ink-secondary)]">
                        {selectedStep.step} / 05
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
                      {selectedStep.summary}
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-paper)] p-3">
                        <p className="font-mono-tech text-[10px] font-bold tracking-wider text-[var(--accent-blue)] uppercase">
                          Key Question I Ask
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[var(--ink-primary)]">
                          {selectedStep.checkQuestion}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--accent-mustard-soft)]/55 p-3">
                        <p className="flex items-center gap-1 font-mono-tech text-[10px] font-bold tracking-wider text-[var(--accent-orange)] uppercase">
                          <Compass className="h-3 w-3" aria-hidden="true" />
                          <span>Where It Shows Up</span>
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[var(--ink-primary)]">
                          {selectedStep.proofExample}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
