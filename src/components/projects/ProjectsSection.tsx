"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  FolderOpen,
  GitBranch,
} from "lucide-react";
import {
  projectCategories,
  projects,
  type ProjectCategory,
  type ProjectItem,
} from "@/data/projects";
import { SectionReveal } from "@/components/SectionReveal";
import { LazyProjectVideo } from "./LazyProjectVideo";
import { ProjectSketchVisual } from "./ProjectSketchVisual";

interface ProjectsSectionProps {
  activeCategory: "All" | ProjectCategory;
  onCategoryChange: (cat: "All" | ProjectCategory) => void;
  onOpenProject: (project: ProjectItem) => void;
}

function getPreviewBadgeLabel(project: ProjectItem): string {
  const firstMedia = project.media[0];
  if (!firstMedia) return "Architecture Diagram";
  if (firstMedia.mediaKind === "video" || firstMedia.isAnimated) {
    return "Live Rollout Video";
  }
  return "Benchmark Chart";
}

function renderFormattedStatValue(value: string) {
  const match = value.match(/^(.+?)\s*(\([^)]+\))$/);
  if (!match) {
    return <span>{value}</span>;
  }
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1">
      <span>{match[1]}</span>
      <span className="whitespace-nowrap text-[11px] font-semibold text-[var(--ink-muted)]">
        {match[2]}
      </span>
    </span>
  );
}

function ProjectCard({
  project,
  expIndex,
  isActive,
  onOpenProject,
  onSelectCard,
}: {
  project: ProjectItem;
  expIndex: number;
  isActive: boolean;
  onOpenProject: (project: ProjectItem) => void;
  onSelectCard?: () => void;
}) {
  const firstMedia = project.media[0];

  return (
    <article className="ink-card flex h-full flex-col overflow-hidden rounded-3xl">
      {/* Folder Top Tab Bar */}
      <div className="flex items-center justify-between border-b-2 border-[var(--border-soft)] bg-[var(--bg-beige)]/70 px-4 py-2.5">
        <div className="flex items-center gap-1.5 font-mono-tech text-[11px] font-bold text-[var(--ink-secondary)]">
          <FolderOpen
            className="h-3.5 w-3.5 text-[var(--accent-orange)]"
            aria-hidden="true"
          />
          <span>EXP-{String(expIndex + 1).padStart(2, "0")}</span>
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

      {/* Visual Preview Thumbnail */}
      {isActive ? (
        <div className="group relative h-44 w-full overflow-hidden border-b-2 border-[var(--border-soft)] bg-[#F5EFE2]">
          {firstMedia ? (
            firstMedia.mediaKind === "video" &&
            firstMedia.videoMp4 &&
            firstMedia.videoWebm &&
            firstMedia.posterSrc ? (
              <LazyProjectVideo
                mp4Src={firstMedia.videoMp4}
                webmSrc={firstMedia.videoWebm}
                posterSrc={firstMedia.posterSrc}
                alt={firstMedia.alt}
                width={firstMedia.width ?? 690}
                height={firstMedia.height ?? 340}
                objectFit={
                  project.id === "continual-learning" ? "contain" : "cover"
                }
                className="transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <Image
                src={firstMedia.src}
                alt={firstMedia.alt}
                width={firstMedia.width ?? 1200}
                height={firstMedia.height ?? 720}
                sizes="(max-width: 768px) 92vw, 440px"
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
              />
            )
          ) : (
            <ProjectSketchVisual sketchType={project.sketchType} />
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 bottom-2.5 z-10 rounded-lg border border-[var(--border-ink)] bg-[var(--bg-surface)]/95 px-2.5 py-1 font-mono-tech text-[10px] font-bold text-[var(--ink-primary)] shadow-xs"
          >
            {getPreviewBadgeLabel(project)}
          </span>
          <button
            type="button"
            onClick={() => onOpenProject(project)}
            aria-label={`Open case study for ${project.title}`}
            className="absolute inset-0 z-20 cursor-pointer bg-transparent focus-visible:outline-offset-[-4px]"
          />
        </div>
      ) : (
        <div className="relative h-44 w-full overflow-hidden border-b-2 border-[var(--border-soft)] bg-[#F5EFE2]">
          {firstMedia ? (
            <Image
              src={firstMedia.posterSrc ?? firstMedia.src}
              alt=""
              width={firstMedia.width ?? 1200}
              height={firstMedia.height ?? 720}
              sizes="360px"
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <ProjectSketchVisual sketchType={project.sketchType} />
          )}
          <span
            aria-hidden="true"
            className="absolute right-3 bottom-2.5 rounded-lg border border-[var(--border-ink)] bg-[var(--bg-surface)]/95 px-2.5 py-1 font-mono-tech text-[10px] font-bold text-[var(--ink-primary)] shadow-xs"
          >
            {getPreviewBadgeLabel(project)}
          </span>
        </div>
      )}

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="font-serif-display text-xl font-bold leading-snug text-[var(--ink-primary)]">
            {project.shortTitle}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
            {project.tagline}
          </p>

          <div className="mt-4 grid grid-cols-2 items-stretch gap-2">
            {project.metrics.slice(0, 2).map((m) => (
              <div
                key={m.label}
                className="flex flex-col justify-between rounded-xl border border-[var(--border-soft)] bg-[var(--bg-paper)] px-2.5 py-2"
              >
                <div className="font-mono-tech text-sm font-extrabold leading-tight text-[var(--ink-primary)]">
                  {renderFormattedStatValue(m.value)}
                </div>
                <div className="mt-1 text-[11px] font-medium leading-tight text-[var(--ink-muted)]">
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

          {isActive ? (
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border-soft)] pt-3.5">
              <button
                type="button"
                onClick={() => onOpenProject(project)}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--accent-orange)] hover:underline"
              >
                <span>Open Case Study</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={`/projects/${project.slug}`}
                  aria-label={`Page — shareable link to ${project.shortTitle} case study`}
                  className="rounded-lg border border-[var(--border-soft)] px-2 py-1 font-mono-tech text-[11px] font-semibold text-[var(--ink-muted)] hover:border-[var(--border-ink)] hover:text-[var(--ink-primary)]"
                >
                  Page
                </Link>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Repo — ${project.shortTitle} on GitHub`}
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-soft)] px-2.5 py-1 font-mono-tech text-[11px] font-semibold text-[var(--ink-secondary)] hover:border-[var(--border-ink)] hover:text-[var(--ink-primary)]"
                >
                  <GitBranch className="h-3 w-3" aria-hidden="true" />
                  <span>Repo</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center border-t border-[var(--border-soft)] pt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCard?.();
                }}
                aria-label={`Bring to center — ${project.shortTitle}`}
                className="font-mono-tech text-xs font-bold text-[var(--accent-orange)] hover:underline"
              >
                Bring to center ↻
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection({
  activeCategory,
  onCategoryChange,
  onOpenProject,
}: ProjectsSectionProps) {
  const [rawIndex, setRawIndex] = useState(0);
  const swipeStartX = useRef<number | null>(null);

  const visibleProjects = projects.filter(
    (p) => activeCategory === "All" || p.categories.includes(activeCategory)
  );
  const count = visibleProjects.length;
  const activeIdx = count > 0 ? ((rawIndex % count) + count) % count : 0;

  const stepCarousel = (delta: number) => {
    if (count <= 1) return;
    setRawIndex((prev) => (((prev + delta) % count) + count) % count);
  };

  const handleCategorySwitch = (cat: "All" | ProjectCategory) => {
    setRawIndex(0);
    onCategoryChange(cat);
  };

  const prevIdx = count > 1 ? (activeIdx - 1 + count) % count : -1;
  const nextIdx = count > 1 ? (activeIdx + 1) % count : -1;
  const activeProject = visibleProjects[activeIdx];
  const prevProject = prevIdx >= 0 ? visibleProjects[prevIdx] : null;
  const nextProject =
    nextIdx >= 0 && nextIdx !== prevIdx ? visibleProjects[nextIdx] : null;

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-b-2 border-[var(--border-soft)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="font-mono-tech text-xs font-semibold tracking-wider text-[var(--accent-orange)] uppercase">
                  03 · Personal Engineering Lab
                </p>
                <h2
                  id="projects-heading"
                  className="text-balance mt-1 font-serif-display text-3xl font-bold tracking-tight text-[var(--ink-primary)] sm:text-4xl"
                >
                  Experiments &amp; systems I&apos;ve built
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
                  Spin through the circular project carousel—each folder opens
                  a full case study verified directly from repository source
                  code and benchmark logs.
                </p>
              </div>

              {count > 1 && (
                <div className="flex shrink-0 items-center gap-2 self-start sm:self-end">
                  <button
                    type="button"
                    onClick={() => stepCarousel(-1)}
                    aria-label="Previous project"
                    className="ink-button inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--ink-primary)]"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="min-w-[4.5rem] rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-beige)] px-3 py-2 text-center font-mono-tech text-xs font-bold text-[var(--ink-primary)]">
                    {String(activeIdx + 1).padStart(2, "0")} /{" "}
                    {String(count).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => stepCarousel(1)}
                    aria-label="Next project"
                    className="ink-button inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--ink-primary)]"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {/* Domain Filter Strip */}
            <div className="relative">
              <div
                role="group"
                aria-label="Filter projects by domain"
                className="no-scrollbar flex flex-nowrap gap-2 overflow-x-auto pb-1 pr-6 sm:flex-wrap sm:overflow-visible sm:pr-0"
              >
                {projectCategories.map((cat) => {
                  const selected = cat === activeCategory;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySwitch(cat)}
                      aria-pressed={selected}
                      className={`shrink-0 rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition-all ${
                        selected
                          ? "border-[var(--border-ink)] bg-[var(--accent-orange-fill)] text-[#FFFDF9] shadow-[0_2px_0_var(--border-ink)]"
                          : "border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--border-ink)]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 right-0 bottom-1 w-8 bg-gradient-to-l from-[var(--bg-paper)] to-transparent sm:hidden"
              />
            </div>
          </div>
        </SectionReveal>

        {/* Interactive Circular Orbital Carousel Stage */}
        {activeProject && (
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Projects circular carousel"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                stepCarousel(-1);
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                stepCarousel(1);
              }
            }}
            onPointerDown={(e) => {
              swipeStartX.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (swipeStartX.current === null) return;
              const dx = e.clientX - swipeStartX.current;
              swipeStartX.current = null;
              if (Math.abs(dx) > 52) {
                stepCarousel(dx < 0 ? 1 : -1);
              }
            }}
            className="mt-10 focus:outline-none"
          >
            {/* Curved orbital track */}
            <div className="relative mx-auto flex min-h-[500px] items-center justify-center overflow-hidden py-4">
              {/* Left orbital wing card (Previous in circular ring) */}
              {prevProject && (
                <div
                  onClick={() => setRawIndex(prevIdx)}
                  className="hidden cursor-pointer text-left transition-all duration-300 ease-out hover:-translate-y-0.5 lg:block lg:w-[320px] lg:-translate-x-10 lg:translate-y-4 lg:-rotate-3 lg:scale-[0.86]"
                >
                  <ProjectCard
                    project={prevProject}
                    expIndex={projects.findIndex(
                      (p) => p.id === prevProject.id
                    )}
                    isActive={false}
                    onOpenProject={onOpenProject}
                    onSelectCard={() => setRawIndex(prevIdx)}
                  />
                </div>
              )}

              {/* Center Spotlight Card */}
              <div className="z-20 w-full max-w-[440px] shrink-0 transition-all duration-300 ease-out">
                <ProjectCard
                  project={activeProject}
                  expIndex={projects.findIndex(
                    (p) => p.id === activeProject.id
                  )}
                  isActive
                  onOpenProject={onOpenProject}
                />
              </div>

              {/* Right orbital wing card (Next in circular ring) */}
              {nextProject && (
                <div
                  onClick={() => setRawIndex(nextIdx)}
                  className="hidden cursor-pointer text-left transition-all duration-300 ease-out hover:-translate-y-0.5 lg:block lg:w-[320px] lg:translate-x-10 lg:translate-y-4 lg:rotate-3 lg:scale-[0.86]"
                >
                  <ProjectCard
                    project={nextProject}
                    expIndex={projects.findIndex(
                      (p) => p.id === nextProject.id
                    )}
                    isActive={false}
                    onOpenProject={onOpenProject}
                    onSelectCard={() => setRawIndex(nextIdx)}
                  />
                </div>
              )}
            </div>

            {/* Orbital Dot & Label Ring Strip */}
            {count > 1 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {visibleProjects.map((proj, idx) => {
                  const selected = idx === activeIdx;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => setRawIndex(idx)}
                      aria-label={`Focus ${proj.shortTitle}`}
                      aria-pressed={selected}
                      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 font-mono-tech text-[11px] font-bold transition-all ${
                        selected
                          ? "border-[var(--border-ink)] bg-[var(--ink-primary)] text-[var(--bg-paper)] shadow-[0_2px_0_var(--accent-orange)]"
                          : "border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--border-ink)]"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${
                          selected
                            ? "bg-[var(--accent-orange)]"
                            : "bg-[var(--border-soft)]"
                        }`}
                      />
                      <span>{proj.shortTitle}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
