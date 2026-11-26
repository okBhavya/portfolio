"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  GitBranch,
  Info,
  Layers,
  X,
} from "lucide-react";
import { SITE_URL } from "@/data/profile";
import type { ProjectItem } from "@/data/projects";
import { ProjectMediaGallery } from "./ProjectMediaGallery";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);

  useEffect(() => {
    if (!project) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 10);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [project, onClose]);

  const handleCopyShareUrl = async () => {
    if (!project) return;
    const shareUrl = `${
      typeof window !== "undefined" ? window.location.origin : SITE_URL
    }/projects/${project.slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShareUrl(true);
      window.setTimeout(() => setCopiedShareUrl(false), 2000);
    } catch {
      // Ignore clipboard failure cleanly
    }
  };

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="backdrop-enter fixed inset-0 bg-[#141923]/65 backdrop-blur-xs"
        aria-hidden="true"
      />

      {/* Modal Sheet */}
      <div
        ref={dialogRef}
        className="surface-enter ink-card relative z-10 max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-3xl p-5 sm:p-8"
      >
            {/* Header inside Modal */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-[var(--border-soft)] pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {project.categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-lg border border-[var(--border-ink)] bg-[var(--accent-orange-soft)] px-2.5 py-0.5 font-mono-tech text-[11px] font-bold text-[var(--accent-orange)]"
                    >
                      {cat}
                    </span>
                  ))}
                  {!project.featured && (
                    <span className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-beige)] px-2.5 py-0.5 font-mono-tech text-[11px] font-semibold text-[var(--ink-secondary)]">
                      Field Note / Experiment
                    </span>
                  )}
                </div>
                <h2
                  id="case-study-title"
                  className="text-balance mt-2.5 font-serif-display text-2xl font-bold text-[var(--ink-primary)] sm:text-3xl"
                >
                  {project.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-base">
                  {project.tagline}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="ink-button inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-paper)] text-[var(--ink-primary)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Optional Repo Status Note */}
            {project.statusNote && (
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl border-2 border-[var(--border-ink)] bg-[var(--accent-mustard-soft)] p-3.5 text-xs font-medium text-[var(--ink-primary)] sm:text-sm">
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-orange)]"
                  aria-hidden="true"
                />
                <span>{project.statusNote}</span>
              </div>
            )}

            {/* Verified Metrics Strip */}
            {project.metrics.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-paper)] p-3.5"
                  >
                    <p className="font-mono-tech text-lg font-extrabold text-[var(--ink-primary)]">
                      {m.value}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-[var(--accent-green)]">
                      {m.label}
                    </p>
                    {m.context && (
                      <p className="mt-1 text-[11px] leading-snug text-[var(--ink-muted)]">
                        {m.context}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Media Gallery OR Schematic Visual */}
            <div className="mt-6">
              <ProjectMediaGallery key={project.id} project={project} />
            </div>

            {/* Problem & Solution Narrative */}
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-paper)] p-4 sm:p-5">
                <h3 className="font-mono-tech text-xs font-bold tracking-wider text-[var(--accent-orange)] uppercase">
                  The Problem
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-primary)]">
                  {project.problem}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-paper)] p-4 sm:p-5">
                <h3 className="font-mono-tech text-xs font-bold tracking-wider text-[var(--accent-green)] uppercase">
                  What I Built
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-primary)]">
                  {project.whatIBuilt}
                </p>
              </div>
            </div>

            {/* Architecture Pipeline */}
            <div className="mt-7 rounded-2xl border-2 border-[var(--border-ink)] bg-[var(--bg-beige)]/45 p-5">
              <div className="flex items-center gap-2">
                <Layers
                  className="h-4 w-4 text-[var(--accent-blue)]"
                  aria-hidden="true"
                />
                <h3 className="font-mono-tech text-xs font-bold tracking-wider text-[var(--ink-primary)] uppercase">
                  Technical Architecture
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
                {project.architectureSummary}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {project.architecturePipeline.map((node, idx) => (
                  <div
                    key={node.step}
                    className="relative rounded-xl border-2 border-[var(--border-soft)] bg-[var(--bg-surface)] p-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tech text-xs font-extrabold text-[var(--accent-orange)]">
                        {node.step}
                      </span>
                      {idx < project.architecturePipeline.length - 1 && (
                        <ArrowRight
                          className="hidden h-3.5 w-3.5 text-[var(--ink-muted)] lg:block"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <h4 className="mt-1 text-sm font-bold text-[var(--ink-primary)]">
                      {node.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--ink-secondary)]">
                      {node.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Highlights */}
            {project.highlights.length > 0 && (
              <div className="mt-6">
                <h3 className="font-mono-tech text-xs font-bold tracking-wider text-[var(--ink-muted)] uppercase">
                  Verification &amp; Key Takeaways
                </h3>
                <ul className="mt-2.5 space-y-2 text-sm text-[var(--ink-primary)]">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-green)]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack & Footer Links */}
            <div className="mt-7 flex flex-col gap-4 border-t-2 border-[var(--border-soft)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-paper)] px-2.5 py-1 font-mono-tech text-xs font-medium text-[var(--ink-secondary)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyShareUrl}
                  className="ink-button inline-flex items-center gap-1.5 rounded-xl bg-[var(--bg-paper)] px-3.5 py-2 text-xs font-bold text-[var(--ink-primary)]"
                >
                  {copiedShareUrl ? (
                    <>
                      <Check
                        className="h-3.5 w-3.5 text-[var(--accent-green)]"
                        aria-hidden="true"
                      />
                      <span>Copied Link</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy Share Link</span>
                    </>
                  )}
                </button>
                <Link
                  href={`/projects/${project.slug}`}
                  className="ink-button inline-flex items-center gap-1.5 rounded-xl bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-bold text-[var(--ink-primary)]"
                >
                  <span>Full Page</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ink-button inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-green)] px-4 py-2 text-xs font-bold text-[#FFFDF9]"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ink-button inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-orange-fill)] px-4 py-2 text-xs font-bold text-[#FFFDF9]"
                >
                  <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Inspect GitHub Repo</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
      </div>
  );
}
