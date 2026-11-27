"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FolderOpen, GitBranch } from "lucide-react";
import {
  projectCategories,
  projects,
  type ProjectCategory,
  type ProjectItem,
} from "@/data/projects";
import { SectionReveal } from "@/components/SectionReveal";
import { useDeskTheme } from "@/components/ThemeProvider";
import { LazyProjectVideo } from "./LazyProjectVideo";
import { ProjectSketchVisual } from "./ProjectSketchVisual";
import {
  CircularCarousel,
  type CircularCarouselHandle,
} from "./CircularCarousel";

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
        <div className="group relative h-40 w-full shrink-0 overflow-hidden border-b-2 border-[var(--border-soft)] bg-[#FAF6EE]">
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
                className={`h-full w-full ${
                  firstMedia.mediaKind === "chart" ||
                  firstMedia.mediaKind === "diagram"
                    ? "object-contain p-1.5"
                    : "object-cover object-center"
                } transition-transform duration-300 group-hover:scale-[1.03]`}
              />
            )
          ) : (
            <ProjectSketchVisual sketchType={project.sketchType} />
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 bottom-2 z-10 rounded-lg border border-[var(--border-ink)] bg-[var(--bg-surface)]/95 px-2 py-0.5 font-mono-tech text-[10px] font-bold text-[var(--ink-primary)] shadow-xs"
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
        <div className="relative h-40 w-full shrink-0 overflow-hidden border-b-2 border-[var(--border-soft)] bg-[#FAF6EE]">
          {firstMedia ? (
            <Image
              src={firstMedia.posterSrc ?? firstMedia.src}
              alt=""
              width={firstMedia.width ?? 1200}
              height={firstMedia.height ?? 720}
              sizes="360px"
              className={`h-full w-full ${
                firstMedia.mediaKind === "chart" ||
                firstMedia.mediaKind === "diagram"
                  ? "object-contain p-1.5"
                  : "object-cover object-center"
              }`}
            />
          ) : (
            <ProjectSketchVisual sketchType={project.sketchType} />
          )}
          <span
            aria-hidden="true"
            className="absolute right-2.5 bottom-2 rounded-lg border border-[var(--border-ink)] bg-[var(--bg-surface)]/95 px-2 py-0.5 font-mono-tech text-[10px] font-bold text-[var(--ink-primary)] shadow-xs"
          >
            {getPreviewBadgeLabel(project)}
          </span>
        </div>
      )}

      {/* Card Body */}
      <div className="flex min-h-0 flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="font-serif-display text-lg font-bold leading-snug text-[var(--ink-primary)] sm:text-xl">
            {project.shortTitle}
          </h3>
          <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-[var(--ink-secondary)]">
            {project.tagline}
          </p>

          <div className="mt-3 grid grid-cols-2 items-stretch gap-2">
            {project.metrics.slice(0, 2).map((m) => (
              <div
                key={m.label}
                className="flex flex-col justify-between rounded-xl border border-[var(--border-soft)] bg-[var(--bg-paper)] px-2.5 py-2"
              >
                <div className="font-mono-tech text-xs font-extrabold leading-tight text-[var(--ink-primary)] sm:text-[13px]">
                  {renderFormattedStatValue(m.value)}
                </div>
                <div className="mt-1 text-[10.5px] font-medium leading-tight text-[var(--ink-muted)]">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="shrink-0 whitespace-nowrap rounded-md bg-[var(--bg-beige)] px-2 py-0.5 font-mono-tech text-[10.5px] font-medium text-[var(--ink-secondary)]"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="shrink-0 whitespace-nowrap rounded-md border border-[var(--border-soft)] px-1.5 py-0.5 font-mono-tech text-[10px] font-semibold text-[var(--ink-muted)]">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {isActive ? (
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border-soft)] pt-3">
              <button
                type="button"
                onClick={() => onOpenProject(project)}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--accent-orange)] hover:underline"
              >
                <span>Open Case Study</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-1.5">
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
            <div className="mt-3 flex items-center justify-center border-t border-[var(--border-soft)] pt-3">
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCard?.();
                }}
                aria-label={`Bring to center — ${project.shortTitle}`}
                className="inline-flex h-[28px] items-center font-mono-tech text-xs font-bold text-[var(--accent-orange)] hover:underline"
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
  const { theme } = useDeskTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<CircularCarouselHandle>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const visibleProjects = projects.filter(
    (p) => activeCategory === "All" || p.categories.includes(activeCategory)
  );
  const count = visibleProjects.length;
  const safeIndex = count > 0 ? activeIndex % count : 0;

  const handleCategorySwitch = (cat: "All" | ProjectCategory) => {
    setActiveIndex(0);
    onCategoryChange(cat);
  };

  // Support global Left/Right arrow keys when the Projects lab is in view (without interfering with Tetris or modals/inputs)
  useEffect(() => {
    const onWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const activeTag = document.activeElement?.tagName;
      if (
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        activeTag === "SELECT"
      ) {
        return;
      }
      if (document.querySelector('[role="dialog"]')) return;
      const activeEl = document.activeElement;
      if (activeEl?.closest("#playground")) return;
      if (activeEl?.closest('[aria-roledescription="carousel"]')) return;

      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const inFocusBand = rect.top < vh * 0.72 && rect.bottom > vh * 0.28;
      if (!inFocusBand) return;

      e.preventDefault();
      carouselRef.current?.stepBy(e.key === "ArrowRight" ? 1 : -1);
    };

    window.addEventListener("keydown", onWindowKeyDown);
    return () => window.removeEventListener("keydown", onWindowKeyDown);
  }, []);

  const carouselItems = visibleProjects.map((project) => ({
    id: project.id,
    title: project.shortTitle,
    subtitle: project.categories.join(" · "),
    project,
  }));

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-labelledby="projects-heading"
      className="border-b-2 border-[var(--border-soft)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="flex flex-col gap-5">
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
                Drag, click any card, or use the left and right arrow keys to
                spin through the 3D circular project carousel—each folder opens
                a verified case study.
              </p>
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

        {/* React Bits 3D Circular Orbit Carousel Stage */}
        {count > 0 && (
          <div className="mt-6">
            <div className="relative h-[500px] w-full sm:h-[595px]">
              <CircularCarousel
                key={activeCategory}
                carouselRef={carouselRef}
                items={carouselItems}
                preset="orbit"
                intro="rise"
                cardWidth={352}
                aspectRatio={0.7}
                gap={28}
                curve={0}
                tilt={-6}
                perspective={2050}
                autoplay="off"
                momentum={0.62}
                snap
                draggable
                focusOnClick
                parallax={0.24}
                depthFade={theme === "night" ? 0.38 : 0.22}
                fadeColor={theme === "night" ? "#111722" : "#F7F3EB"}
                cornerRadius={24}
                captions
                showArrows
                onChange={setActiveIndex}
                renderItem={(item, idx, isActive) => (
                  <ProjectCard
                    project={item.project}
                    expIndex={projects.findIndex(
                      (p) => p.id === item.project.id
                    )}
                    isActive={isActive}
                    onOpenProject={onOpenProject}
                    onSelectCard={() => carouselRef.current?.focusIndex(idx)}
                  />
                )}
              />
            </div>

            {/* Orbital Project Selector Strip */}
            {count > 1 && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {visibleProjects.map((proj, idx) => {
                  const selected = idx === safeIndex;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => carouselRef.current?.focusIndex(idx)}
                      aria-label={`Focus ${proj.shortTitle}`}
                      aria-pressed={selected}
                      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 font-mono-tech text-[11px] font-bold transition-all ${
                        selected
                          ? "border-[var(--border-ink)] bg-[var(--ink-primary)] text-[var(--bg-paper)] shadow-[0_2px_0_var(--accent-orange)]"
                          : "border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--border-ink)] hover:text-[var(--ink-primary)]"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full transition-colors ${
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
