"use client";

import React, { useState } from "react";
import { ArrowUpRight, Wrench } from "lucide-react";
import { skillCategories, type SkillItem } from "@/data/skills";
import { projects, type ProjectItem } from "@/data/projects";
import { experiences } from "@/data/experience";
import { SectionReveal } from "@/components/SectionReveal";

interface SkillsSectionProps {
  onOpenProject: (project: ProjectItem) => void;
}

export function SkillsSection({ onOpenProject }: SkillsSectionProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(
    skillCategories[0].skills[0]
  );

  const matchedProjects = projects.filter((p) =>
    selectedSkill.usedInProjects.includes(p.id)
  );
  const matchedExperiences = experiences.filter((e) =>
    selectedSkill.usedInExperience.includes(e.id)
  );

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-b-2 border-[var(--border-soft)] bg-[var(--bg-beige)]/35 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div>
            <p className="font-mono-tech text-xs font-semibold tracking-wider text-[var(--accent-green)] uppercase">
              04 · Verified Technical Workbench
            </p>
            <h2
              id="skills-heading"
              className="text-balance mt-1 font-serif-display text-3xl font-bold tracking-tight text-[var(--ink-primary)] sm:text-4xl"
            >
              Tools I actually ship with
            </h2>
          </div>
        </SectionReveal>

        {/* Live Proof Inspector Bar */}
        <SectionReveal delay={0.05} className="mt-8">
          <div className="ink-card rounded-3xl p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Wrench
                    className="h-4 w-4 text-[var(--accent-orange)]"
                    aria-hidden="true"
                  />
                  <span className="font-mono-tech text-xs font-bold tracking-wider text-[var(--accent-orange)] uppercase">
                    Selected Tool Proof
                  </span>
                </div>
                <h3 className="mt-1 font-serif-display text-xl font-bold text-[var(--ink-primary)]">
                  {selectedSkill.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--ink-secondary)]">
                  {selectedSkill.detail}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {matchedProjects.map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => onOpenProject(proj)}
                    className="ink-button inline-flex items-center gap-1 rounded-xl bg-[var(--bg-paper)] px-3 py-1.5 text-xs font-bold text-[var(--ink-primary)]"
                  >
                    <span>{proj.shortTitle}</span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-[var(--accent-orange)]"
                      aria-hidden="true"
                    />
                  </button>
                ))}
                {matchedExperiences.map((exp) => (
                  <a
                    key={exp.id}
                    href="#experience"
                    className="ink-button inline-flex items-center gap-1 rounded-xl bg-[var(--accent-green-soft)] px-3 py-1.5 text-xs font-bold text-[var(--ink-primary)]"
                  >
                    <span>{exp.shortOrg}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Balanced 5-Category Grid: Row 1 (3 equal) + Row 2 (2 equal wide) on desktop; clean pairs on tablet */}
        <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-12">
          {skillCategories.map((cat, idx) => {
            const spanClass =
              idx < 3
                ? "lg:col-span-4"
                : idx === 3
                ? "lg:col-span-6"
                : "md:col-span-2 lg:col-span-6";

            return (
              <SectionReveal
                key={cat.id}
                delay={idx * 0.04}
                className={`flex ${spanClass}`}
              >
                <div className="ink-card flex h-full w-full flex-col justify-between rounded-3xl p-5 sm:p-6">
                  <div>
                    <h3 className="font-serif-display text-lg font-bold text-[var(--ink-primary)]">
                      {cat.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                      {cat.subtitle}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {cat.skills.map((skill) => {
                        const isSelected = selectedSkill.name === skill.name;
                        return (
                          <button
                            key={skill.name}
                            type="button"
                            onClick={() => setSelectedSkill(skill)}
                            aria-pressed={isSelected}
                            className={`rounded-xl border-2 px-3 py-1.5 text-xs font-bold transition-all ${
                              isSelected
                                ? "border-[var(--border-ink)] bg-[var(--accent-orange-fill)] text-[#FFFDF9] shadow-[0_2px_0_var(--border-ink)]"
                                : "border-[var(--border-soft)] bg-[var(--bg-paper)] text-[var(--ink-primary)] hover:border-[var(--border-ink)]"
                            }`}
                          >
                            {skill.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
