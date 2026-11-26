"use client";

import React, { useState } from "react";
import { GraduationCap, Lightbulb, Sparkles } from "lucide-react";
import { profileConfig } from "@/data/profile";
import { SignatureSvg } from "@/components/SignatureSvg";
import { SectionReveal } from "@/components/SectionReveal";

export function AboutSection() {
  const [activeNoteId, setActiveNoteId] = useState<string>(
    profileConfig.aboutNotes[0].id
  );

  const activeNote =
    profileConfig.aboutNotes.find((n) => n.id === activeNoteId) ??
    profileConfig.aboutNotes[0];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-b-2 border-[var(--border-soft)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
            <p className="font-hand text-xl text-[var(--accent-blue)]">
              Not a corporate CV — just what drives my work.
            </p>
          </div>
        </SectionReveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* Left Column: Positioning & Education Card */}
          <SectionReveal delay={0.06} className="lg:col-span-5">
            <div className="ink-card flex h-full flex-col justify-between rounded-3xl p-6 sm:p-7">
              <div>
                <div className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--accent-green-soft)] px-3 py-1.5 text-xs font-bold text-[var(--ink-primary)]">
                  <GraduationCap className="h-4 w-4 text-[var(--accent-green)]" aria-hidden="true" />
                  <span>{profileConfig.education.shortName}</span>
                </div>

                <h3 className="mt-4 font-serif-display text-xl font-bold text-[var(--ink-primary)]">
                  {profileConfig.education.institution}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[var(--ink-secondary)]">
                  {profileConfig.education.degree}
                </p>
                <p className="mt-0.5 font-mono-tech text-xs text-[var(--ink-muted)]">
                  {profileConfig.education.period} · {profileConfig.education.location}
                </p>

                <blockquote className="mt-6 rounded-2xl border-2 border-dashed border-[var(--border-soft)] bg-[var(--bg-beige)]/65 p-4 text-sm leading-relaxed text-[var(--ink-primary)]">
                  &ldquo;{profileConfig.positioningStatement}&rdquo;
                </blockquote>

                <div className="mt-6">
                  <p className="font-mono-tech text-[11px] font-semibold tracking-wider text-[var(--ink-muted)] uppercase">
                    Areas I gravitate toward
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {profileConfig.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-paper)] px-2.5 py-1 text-xs font-medium text-[var(--ink-secondary)]"
                      >
                        {interest}
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

          {/* Right Column: Interactive Notebook Tabs + Full Scannable Cards */}
          <SectionReveal delay={0.12} className="lg:col-span-7">
            <div className="ink-card rounded-3xl p-6 sm:p-8">
              <div
                role="tablist"
                aria-label="About Bhavya notebook chapters"
                className="flex flex-wrap gap-2 border-b-2 border-[var(--border-soft)] pb-4"
              >
                {profileConfig.aboutNotes.map((note) => {
                  const selected = note.id === activeNote.id;
                  return (
                    <button
                      key={note.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={`about-panel-${note.id}`}
                      onClick={() => setActiveNoteId(note.id)}
                      className={`rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition-all sm:text-sm ${
                        selected
                          ? "border-[var(--border-ink)] bg-[var(--accent-orange)] text-[#FFFDF9] shadow-[0_2px_0_var(--border-ink)]"
                          : "border-[var(--border-soft)] bg-[var(--bg-paper)] text-[var(--ink-secondary)] hover:border-[var(--border-ink)]"
                      }`}
                    >
                      {note.eyebrow}
                    </button>
                  );
                })}
              </div>

              <div
                id={`about-panel-${activeNote.id}`}
                role="tabpanel"
                className="bg-notebook-grid mt-6 rounded-2xl border-2 border-[var(--border-soft)] bg-[var(--bg-paper)] p-5 sm:p-7"
              >
                <p className="font-mono-tech text-xs font-bold text-[var(--accent-green)]">
                  {activeNote.eyebrow}
                </p>
                <h3 className="mt-1.5 font-serif-display text-2xl font-bold text-[var(--ink-primary)]">
                  {activeNote.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--ink-secondary)]">
                  {activeNote.body}
                </p>
                <div className="mt-5 flex items-start gap-2.5 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--accent-mustard-soft)] px-4 py-3 text-sm font-semibold text-[var(--ink-primary)]">
                  <Lightbulb
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-orange)]"
                    aria-hidden="true"
                  />
                  <span>{activeNote.highlight}</span>
                </div>
              </div>

              {/* Compact 4-note quick glance strip below so readers can scan all 4 pillars effortlessly */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {profileConfig.aboutNotes.map((note) => {
                  const isCurrent = note.id === activeNote.id;
                  return (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => setActiveNoteId(note.id)}
                      className={`rounded-2xl border-2 p-3.5 text-left transition-colors ${
                        isCurrent
                          ? "border-[var(--border-ink)] bg-[var(--bg-beige)]"
                          : "border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-ink)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono-tech text-[11px] font-semibold text-[var(--accent-orange)]">
                          {note.eyebrow}
                        </span>
                        <Sparkles
                          className={`h-3.5 w-3.5 ${
                            isCurrent
                              ? "text-[var(--accent-orange)]"
                              : "text-[var(--ink-muted)]"
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-1 text-sm font-bold text-[var(--ink-primary)]">
                        {note.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
