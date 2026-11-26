"use client";

import React from "react";
import { ArrowUp, Mail } from "lucide-react";
import { GitHubIcon, InstagramIcon, LinkedInIcon } from "./SocialIcons";
import { profileConfig } from "@/data/profile";
import { SignatureSvg } from "./SignatureSvg";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t-2 border-[var(--border-ink)] bg-[var(--bg-surface)] py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <SignatureSvg className="h-12 w-40 text-[var(--ink-primary)]" />
            <p className="mt-2 max-w-md text-xs leading-relaxed text-[var(--ink-secondary)]">
              Hand-crafted on warm digital paper in Pilani. Zero templates, zero third-party trackers, plenty of chai.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profileConfig.email}`}
              aria-label="Email Bhavya Gupta"
              className="ink-button inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-paper)] text-[var(--ink-primary)]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={
                profileConfig.socials.find((s) => s.id === "linkedin")?.href ?? "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bhavya Gupta on LinkedIn"
              className="ink-button inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-paper)] text-[var(--ink-primary)]"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href={
                profileConfig.socials.find((s) => s.id === "github")?.href ?? "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bhavya Gupta on GitHub"
              className="ink-button inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-paper)] text-[var(--ink-primary)]"
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
            <a
              href={
                profileConfig.socials.find((s) => s.id === "instagram")?.href ?? "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bhavya Gupta on Instagram"
              className="ink-button inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-paper)] text-[var(--ink-primary)]"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="ink-button ml-1 inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-orange)] px-3.5 py-2 text-xs font-bold text-[#FFFDF9]"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Top</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-[var(--border-soft)] pt-5 font-mono-tech text-[11px] text-[var(--ink-muted)] sm:flex-row">
          <span>
            &copy; {currentYear} {profileConfig.name}. Built with Next.js, TypeScript &amp; custom SVG craft.
          </span>
          <span>BITS Pilani · B.E. CSE (2023–2027)</span>
        </div>
      </div>
    </footer>
  );
}
