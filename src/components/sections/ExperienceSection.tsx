"use client";

import React, { useState } from "react";
import {
  Briefcase,
  FlaskConical,
  HeartHandshake,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  experiences,
  suttProductPlaybook,
  type ExperienceItem,
} from "@/data/experience";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SectionReveal } from "@/components/SectionReveal";

function getKindStyles(kind: ExperienceItem["kind"]) {
  switch (kind) {
    case "work":
      return {
        label: "Work",
        badge: "bg-[var(--accent-green-soft)] text-[var(--accent-green)]",
        dot: "bg-[var(--accent-green)]",
        orgText: "text-[var(--accent-green)]",
      };
    case "leadership":
      return {
        label: "Leadership",
        badge: "bg-[var(--accent-orange-soft)] text-[var(--accent-orange)]",
        dot: "bg-[var(--accent-orange)]",
        orgText: "text-[var(--accent-orange)]",
      };
    case "impact":
    default:
      return {
        label: "Impact",
        badge: "bg-[var(--accent-blue-soft)] text-[var(--accent-blue)]",
        dot: "bg-[var(--accent-blue)]",
        orgText: "text-[var(--accent-blue)]",
      };
  }
}

function getKindIcon(kind: ExperienceItem["kind"]) {
  if (kind === "work") return Briefcase;
  if (kind === "leadership") return Users;
  return HeartHandshake;
}

export function ExperienceSection() {
  const [selectedCohortId, setSelectedCohortId] = useState<string>(
    suttProductPlaybook[0].id
  );
  const [filterKind, setFilterKind] = useState<
    "all" | "work" | "leadership" | "impact"
  >("all");

  const selectedCohort =
    suttProductPlaybook.find((c) => c.id === selectedCohortId) ??
    suttProductPlaybook[0];

  const visibleExperiences =
    filterKind === "all"
      ? experiences
      : experiences.filter((exp) => exp.kind === filterKind);

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="border-b-2 border-[var(--border-soft)] bg-[var(--bg-beige)]/35 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono-tech text-xs font-semibold tracking-wider text-[var(--accent-green)] uppercase">
                02 · Career &amp; Leadership Journey
              </p>
              <h2
                id="experience-heading"
                className="mt-1 font-serif-display text-3xl font-bold tracking-tight text-[var(--ink-primary)] sm:text-4xl"
              >
                Where I&apos;ve shipped, analysed &amp; led
              </h2>
            </div>

            {/* Timeline filter pills */}
            <div
              role="group"
              aria-label="Filter experience by category"
              className="flex flex-wrap gap-2"
            >
              {(
                [
                  { id: "all", label: "All Milestones" },
                  { id: "work", label: "Engineering & Product" },
                  { id: "leadership", label: "Leadership" },
                  { id: "impact", label: "Bootcamps & NSS" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterKind(tab.id)}
                  aria-pressed={filterKind === tab.id}
                  className={`rounded-xl border-2 px-3 py-1.5 text-xs font-bold transition-colors ${
                    filterKind === tab.id
                      ? "border-[var(--border-ink)] bg-[var(--ink-primary)] text-[var(--bg-surface)]"
                      : "border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--border-ink)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Interactive Vertical Spine */}
        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-4 hidden w-[3px] rounded-full bg-[var(--border-soft)] sm:block"
          />

          <div className="space-y-8">
            {visibleExperiences.map((exp, idx) => {
              const accent = getKindStyles(exp.kind);
              const KindIcon = getKindIcon(exp.kind);

              return (
                <SectionReveal key={exp.id} delay={idx * 0.05}>
                  <article className="relative sm:pl-12">
                    {/* Timeline Node Dot */}
                    <span
                      aria-hidden="true"
                      className={`absolute top-7 left-[7px] hidden h-5 w-5 rounded-full border-2 border-[var(--border-ink)] sm:block ${accent.dot}`}
                    />

                    <div className="ink-card rounded-3xl p-6 sm:p-7">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-ink)] px-2.5 py-0.5 text-xs font-bold ${accent.badge}`}
                            >
                              <KindIcon className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{accent.label}</span>
                            </span>
                            <span className="font-mono-tech text-xs font-medium text-[var(--ink-muted)]">
                              {exp.period} · {exp.location}
                            </span>
                          </div>

                          <h3 className="mt-2.5 font-serif-display text-xl font-bold text-[var(--ink-primary)] sm:text-2xl">
                            {exp.role}
                          </h3>
                          <p className={`text-sm font-semibold ${accent.orgText}`}>
                            {exp.organization}
                          </p>
                        </div>

                        {/* Animated Metric Counters */}
                        {exp.metrics.length > 0 && (
                          <div className="flex flex-wrap gap-2.5 sm:justify-end">
                            {exp.metrics.map((metric) => (
                              <div
                                key={metric.label}
                                className="rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-paper)] px-3.5 py-2 text-left sm:text-right"
                              >
                                <div className="font-mono-tech text-lg font-extrabold text-[var(--ink-primary)] sm:text-xl">
                                  <AnimatedCounter
                                    value={metric.value}
                                    prefix={metric.prefix}
                                    suffix={metric.suffix}
                                    decimals={metric.decimals}
                                  />
                                </div>
                                <div className="text-[11px] font-medium text-[var(--ink-muted)]">
                                  {metric.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
                        {exp.summary}
                      </p>

                      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--ink-primary)]">
                        {exp.achievements.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`}
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Special Interactive Product & Business Workbench inside SUTT */}
                      {exp.hasProductExplorer && (
                        <div className="mt-6 rounded-2xl border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] p-4 sm:p-5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp
                                className="h-4 w-4 text-[var(--accent-orange)]"
                                aria-hidden="true"
                              />
                              <h4 className="font-mono-tech text-xs font-bold tracking-wider text-[var(--ink-primary)] uppercase">
                                SU App Product Thinking · Cohort &amp; Experiment Playbook
                              </h4>
                            </div>
                            <span className="font-hand text-base text-[var(--accent-blue)]">
                              Click a cohort to inspect product loop
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {suttProductPlaybook.map((row) => {
                              const active = row.id === selectedCohort.id;
                              return (
                                <button
                                  key={row.id}
                                  type="button"
                                  onClick={() => setSelectedCohortId(row.id)}
                                  aria-pressed={active}
                                  className={`rounded-xl border-2 px-3 py-1.5 text-xs font-bold ${
                                    active
                                      ? "border-[var(--border-ink)] bg-[var(--accent-orange)] text-[#FFFDF9] shadow-[0_2px_0_var(--border-ink)]"
                                      : "border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--border-ink)] hover:text-[var(--ink-primary)]"
                                  }`}
                                >
                                  {row.cohort}
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3">
                              <p className="font-mono-tech text-[11px] font-bold text-[var(--ink-muted)] uppercase">
                                Behavioural Signal
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-[var(--ink-primary)]">
                                {selectedCohort.pattern}
                              </p>
                            </div>
                            <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3">
                              <p className="font-mono-tech text-[11px] font-bold text-[var(--accent-green)] uppercase">
                                Product Lever
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-[var(--ink-primary)]">
                                {selectedCohort.productAction}
                              </p>
                            </div>
                            <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3">
                              <p className="flex items-center gap-1 font-mono-tech text-[11px] font-bold text-[var(--accent-orange)] uppercase">
                                <FlaskConical className="h-3 w-3" aria-hidden="true" />
                                A/B Hypothesis
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-[var(--ink-primary)]">
                                {selectedCohort.experimentHypothesis}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-paper)] px-2.5 py-0.5 font-mono-tech text-[11px] font-medium text-[var(--ink-secondary)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
