"use client";

import React from "react";
import { ArrowUpRight, FlaskConical, FolderOpen, GitBranch } from "lucide-react";
import {
  projectCategories,
  projects,
  type ProjectCategory,
  type ProjectItem,
} from "@/data/projects";
import { SectionReveal } from "@/components/SectionReveal";
import { ProjectSketchVisual } from "./ProjectSketchVisual";

interface ProjectsSectionProps {
  activeCategory: "All" | ProjectCategory;
  onCategoryChange: (cat: "All" | ProjectCategory) => void;
  onOpenProject: (project: ProjectItem) => void;
}

export function ProjectsSection({
  activeCategory,
  onCategoryChange,
  onOpenProject,
}: ProjectsSectionProps) {
  const featuredProjects = projects.filter((p) => {
    if (!p.featured) return false;
    return activeCategory === "All" || p.categories.includes(activeCategory);
  });

  const secondaryProjects = projects.filter((p) => {
    if (p.featured) return false;
    return activeCategory === "All" || p.categories.includes(activeCategory);
  });

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-b-2 border-[var(--border-soft)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono-tech text-xs font-semibold tracking-wider text-[var(--accent-orange)] uppercase">
                03 · Personal Engineering Lab
              </p>
              <h2
                id="projects-heading"
                className="mt-1 font-serif-display text-3xl font-bold tracking-tight text-[var(--ink-primary)] sm:text-4xl"
              >
                Experiments &amp; systems I&apos;ve built
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
                Each folder opens a full case study verified directly from repository source code, test suites, and benchmark logs.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div
              role="group"
              aria-label="Filter projects by domain"
              className="flex flex-wrap gap-2"
            >
              {projectCategories.map((cat) => {
                const selected = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onCategoryChange(cat)}
                    aria-pressed={selected}
                    className={`rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition-all ${
                      selected
                        ? "border-[var(--border-ink)] bg-[var(--accent-orange)] text-[#FFFDF9] shadow-[0_2px_0_var(--border-ink)]"
                        : "border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--border-ink)]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </SectionReveal>

        {/* Flagship 6-Project Lab Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, idx) => (
            <SectionReveal key={project.id} delay={idx * 0.05}>
              <article className="ink-card ink-card-interactive group flex h-full flex-col overflow-hidden rounded-3xl">
                {/* Folder Top Tab Bar */}
                <div className="flex items-center justify-between border-b-2 border-[var(--border-soft)] bg-[var(--bg-beige)]/70 px-4 py-2.5">
                  <div className="flex items-center gap-1.5 font-mono-tech text-[11px] font-bold text-[var(--ink-secondary)]">
                    <FolderOpen className="h-3.5 w-3.5 text-[var(--accent-orange)]" aria-hidden="true" />
                    <span>EXP-{String(idx + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.categories.map((cat) => (
                      <span
                        key={cat}
                        className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-[var(--ink-secondary)]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visual Preview Thumbnail (Verified GIF/PNG or Custom Sketch) */}
                <button
                  type="button"
                  onClick={() => onOpenProject(project)}
                  aria-label={`Open case study for ${project.title}`}
                  className="relative h-40 w-full overflow-hidden border-b-2 border-[var(--border-soft)] bg-[var(--bg-paper)] text-left focus-visible:outline-offset-[-4px]"
                >
                  {project.media[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.media[0].src}
                      alt={project.media[0].alt}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <ProjectSketchVisual sketchType={project.sketchType} />
                  )}
                  <span className="absolute right-3 bottom-2.5 rounded-lg border border-[var(--border-ink)] bg-[var(--bg-surface)]/95 px-2.5 py-1 font-mono-tech text-[10px] font-bold text-[var(--ink-primary)] shadow-xs">
                    {project.media[0]?.isAnimated ? "Live Rollout GIF" : "Architecture Preview"}
                  </span>
                </button>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-serif-display text-xl font-bold leading-snug text-[var(--ink-primary)]">
                      {project.shortTitle}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
                      {project.tagline}
                    </p>

                    {/* Top 2 Verified Metrics */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {project.metrics.slice(0, 2).map((m) => (
                        <div
                          key={m.label}
                          className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-paper)] px-2.5 py-2"
                        >
                          <div className="font-mono-tech text-sm font-extrabold text-[var(--ink-primary)]">
                            {m.value}
                          </div>
                          <div className="truncate text-[11px] font-medium text-[var(--ink-muted)]">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-[var(--bg-beige)] px-2 py-0.5 font-mono-tech text-[10.5px] font-medium text-[var(--ink-secondary)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border-soft)] pt-3.5">
                      <button
                        type="button"
                        onClick={() => onOpenProject(project)}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--accent-orange)] hover:underline"
                      >
                        <span>Open Case Study</span>
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </button>

                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.shortTitle} GitHub repository`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-soft)] px-2.5 py-1 font-mono-tech text-[11px] font-semibold text-[var(--ink-secondary)] hover:border-[var(--border-ink)] hover:text-[var(--ink-primary)]"
                      >
                        <GitBranch className="h-3 w-3" aria-hidden="true" />
                        <span>Repo</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>

        {/* Additional Field Notes & Resume Projects */}
        {secondaryProjects.length > 0 && (
          <SectionReveal delay={0.12} className="mt-10">
            <div className="rounded-3xl border-2 border-dashed border-[var(--border-ink)] bg-[var(--bg-beige)]/45 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-[var(--accent-green)]" aria-hidden="true" />
                  <h3 className="font-mono-tech text-xs font-bold tracking-wider text-[var(--ink-primary)] uppercase">
                    Additional Lab Notes &amp; Resume Research
                  </h3>
                </div>
                <span className="font-hand text-lg text-[var(--accent-blue)]">
                  Also worth opening ↘
                </span>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {secondaryProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="ink-card ink-card-interactive flex flex-col justify-between rounded-2xl p-4 sm:p-5"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-serif-display text-lg font-bold text-[var(--ink-primary)]">
                          {proj.title}
                        </h4>
                        <span className="rounded-md bg-[var(--accent-green-soft)] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-[var(--accent-green)]">
                          {proj.categories.join(" · ")}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-secondary)]">
                        {proj.tagline}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-soft)] pt-3">
                      <button
                        type="button"
                        onClick={() => onOpenProject(proj)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent-orange)] hover:underline"
                      >
                        <span>Inspect Details</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono-tech text-[11px] font-semibold text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                      >
                        <GitBranch className="h-3 w-3" aria-hidden="true" />
                        <span>GitHub</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}
