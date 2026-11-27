"use client";

import React from "react";
import { Mail } from "lucide-react";
import { GitHubIcon, InstagramIcon, LinkedInIcon } from "./SocialIcons";
import { buildGmailComposeHref, profileConfig } from "@/data/profile";
import { SignatureSvg } from "./SignatureSvg";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-[var(--border-ink)] bg-[var(--bg-surface)] pt-10 pb-20 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <SignatureSvg className="h-12 w-44 text-[var(--ink-primary)]" />
            <p className="mt-2 max-w-md text-xs leading-relaxed text-[var(--ink-secondary)]">
              Having plenty of sleep while evolving beyond endless expectations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={buildGmailComposeHref()}
              target="_blank"
              rel="noopener noreferrer"
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
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--border-soft)] pt-5 pr-12 font-mono-tech text-[11px] text-[var(--ink-muted)] sm:pr-0">
          <span>
            &copy; {currentYear} {profileConfig.name}.
          </span>

          {/* Hand-drawn warm teacup illustration */}
          <svg
            viewBox="0 0 88 54"
            role="img"
            aria-label="Cup of warm tea illustration"
            className="h-11 w-[72px] shrink-0 overflow-visible text-[var(--border-ink)]"
          >
            {/* Gently curling warm tea steam */}
            <path
              d="M32 16c-3-4 2-8-1-12"
              fill="none"
              stroke="var(--ink-muted)"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="tea-steam-a"
            />
            <path
              d="M42 15c-3-5 2-9-1-13"
              fill="none"
              stroke="var(--accent-orange)"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="tea-steam-b"
            />
            <path
              d="M52 16c-2-4 2-7-1-11"
              fill="none"
              stroke="var(--ink-muted)"
              strokeWidth="1.7"
              strokeLinecap="round"
              className="tea-steam-a"
            />

            {/* Saucer */}
            <ellipse
              cx="42"
              cy="46"
              rx="29"
              ry="5.5"
              fill="var(--bg-beige)"
              stroke="currentColor"
              strokeWidth="2.1"
            />
            {/* Cup handle */}
            <path
              d="M59 24c7 0 11 4 11 9.5c0 5-4 8.5-11 8.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* Terracotta ceramic mug body */}
            <path
              d="M22 22h40v12c0 7.5-7.5 12-20 12S22 41.5 22 34z"
              fill="var(--accent-orange-fill)"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinejoin="round"
            />
            {/* Tea liquid surface */}
            <ellipse
              cx="42"
              cy="22"
              rx="20"
              ry="4.8"
              fill="#C78A52"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* Hanging teabag string & tag */}
            <path
              d="M30 23c-1 4-2 8-2 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <rect
              x="25"
              y="34"
              width="6"
              height="6"
              rx="1.2"
              fill="var(--bg-surface)"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </div>
      </div>
    </footer>
  );
}
