import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Info,
  Layers,
} from "lucide-react";
import { profileConfig, SITE_URL } from "@/data/profile";
import { projects } from "@/data/projects";
import { ProjectMediaGallery } from "@/components/projects/ProjectMediaGallery";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug || p.id === slug);
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const pageUrl = `${SITE_URL}/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.tagline,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "article",
      url: pageUrl,
      title: `${project.title} | ${profileConfig.name}`,
      description: project.tagline,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | ${profileConfig.name}`,
      description: project.tagline,
      images: ["/opengraph-image"],
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug || p.id === slug);
  if (!project) notFound();

  return (
    <div className="min-h-dvh border-x-0 border-[var(--border-ink)] bg-[var(--bg-paper)] sm:mx-auto sm:border-x-4 xl:max-w-[1480px]">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/#projects"
              className="ink-button inline-flex items-center gap-2 rounded-xl bg-[var(--bg-surface)] px-4 py-2 text-xs font-bold text-[var(--ink-primary)]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Portfolio Projects</span>
            </Link>

            <span className="font-mono-tech text-xs text-[var(--ink-muted)]">
              {profileConfig.name} · Case Study
            </span>
          </div>

          <div className="ink-card mt-6 rounded-3xl p-6 sm:p-8">
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

            <h1 className="text-balance mt-3 font-serif-display text-3xl font-bold tracking-tight text-[var(--ink-primary)] sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-2.5 text-base leading-relaxed text-[var(--ink-secondary)]">
              {project.tagline}
            </p>

            {project.statusNote && (
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl border-2 border-[var(--border-ink)] bg-[var(--accent-mustard-soft)] p-3.5 text-xs font-medium text-[var(--ink-primary)] sm:text-sm">
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-orange)]"
                  aria-hidden="true"
                />
                <span>{project.statusNote}</span>
              </div>
            )}

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

            <div className="mt-6">
              <ProjectMediaGallery project={project} />
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <section className="rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-paper)] p-4 sm:p-5">
                <h2 className="font-mono-tech text-xs font-bold tracking-wider text-[var(--accent-orange)] uppercase">
                  The Problem
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-primary)]">
                  {project.problem}
                </p>
              </section>
              <section className="rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-paper)] p-4 sm:p-5">
                <h2 className="font-mono-tech text-xs font-bold tracking-wider text-[var(--accent-green)] uppercase">
                  What I Built
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-primary)]">
                  {project.whatIBuilt}
                </p>
              </section>
            </div>

            <section className="mt-7 rounded-2xl border-2 border-[var(--border-ink)] bg-[var(--bg-beige)]/45 p-5">
              <div className="flex items-center gap-2">
                <Layers
                  className="h-4 w-4 text-[var(--accent-blue)]"
                  aria-hidden="true"
                />
                <h2 className="font-mono-tech text-xs font-bold tracking-wider text-[var(--ink-primary)] uppercase">
                  Technical Architecture
                </h2>
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
                    <h3 className="mt-1 text-sm font-bold text-[var(--ink-primary)]">
                      {node.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--ink-secondary)]">
                      {node.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {project.highlights.length > 0 && (
              <section className="mt-6">
                <h2 className="font-mono-tech text-xs font-bold tracking-wider text-[var(--ink-muted)] uppercase">
                  Verification &amp; Key Takeaways
                </h2>
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
              </section>
            )}

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
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ink-button inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-green-fill)] px-4 py-2 text-xs font-bold text-[#FFFDF9]"
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
        </article>
      </main>
      <Footer />
    </div>
  );
}
