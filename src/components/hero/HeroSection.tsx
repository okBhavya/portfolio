"use client";

import React from "react";
import { ArrowDownRight, Mail } from "lucide-react";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/SocialIcons";
import { buildGmailComposeHref, profileConfig } from "@/data/profile";
import type { ProjectCategory } from "@/data/projects";
import { HeroDeskScene } from "./HeroDeskScene";

interface HeroSectionProps {
  onSelectProjectFilter?: (category: ProjectCategory | "All") => void;
}

export function HeroSection({ onSelectProjectFilter }: HeroSectionProps) {
  const statusLabel =
    profileConfig.availability.labels[profileConfig.availability.mode];

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="border-b-2 border-[var(--border-soft)] pt-4 pb-14 sm:pt-8 sm:pb-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Top Centerpiece: Floating Hand-Drawn Desk Illustration */}
        <HeroDeskScene onSelectProjectFilter={onSelectProjectFilter} />

        {/* Centered High-Contrast Social Row directly under Desk (>= 44x44 tap targets) */}
        <div
          aria-label="Quick social links"
          className="mt-4 flex items-center justify-center gap-3 sm:gap-4"
        >
          <a
            href={
              profileConfig.socials.find((s) => s.id === "linkedin")?.href ?? "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-beige)] hover:text-[var(--ink-primary)]"
          >
            <LinkedInIcon className="h-6 w-6" />
          </a>
          <a
            href={
              profileConfig.socials.find((s) => s.id === "instagram")?.href ??
              "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-beige)] hover:text-[var(--ink-primary)]"
          >
            <InstagramIcon className="h-6 w-6" />
          </a>
          <a
            href={
              profileConfig.socials.find((s) => s.id === "github")?.href ?? "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-beige)] hover:text-[var(--ink-primary)]"
          >
            <GitHubIcon className="h-6 w-6" />
          </a>
          <a
            href={buildGmailComposeHref()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-beige)] hover:text-[var(--ink-primary)]"
          >
            <Mail className="h-6 w-6" aria-hidden="true" />
          </a>
        </div>

        {/* Clean Centered Editorial Bio Copy */}
        <div className="mx-auto mt-6 max-w-2xl text-center">
          <p className="font-hand text-2xl font-bold text-[var(--accent-orange)] sm:text-3xl">
            {profileConfig.heroGreeting}
          </p>

          <h1
            id="hero-heading"
            className="text-balance mt-1.5 font-serif-display text-2xl leading-[1.2] font-bold tracking-tight text-[var(--ink-primary)] sm:text-4xl"
          >
            {profileConfig.heroHeadline}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[var(--ink-secondary)] sm:text-lg">
            {profileConfig.heroSupporting}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#projects"
              className="ink-button inline-flex items-center gap-2 rounded-xl bg-[var(--accent-orange-fill)] px-5 py-2.5 text-sm font-bold text-[#FFFDF9]"
            >
              <span>Explore my work</span>
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="ink-button inline-flex items-center gap-2 rounded-xl bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-bold text-[var(--ink-primary)]"
            >
              <Mail
                className="h-4 w-4 text-[var(--accent-green)]"
                aria-hidden="true"
              />
              <span>Let&apos;s connect</span>
            </a>
          </div>

          <p
            title={profileConfig.availability.detail}
            className="mt-4 inline-flex items-center gap-2 font-mono-tech text-xs font-medium text-[var(--ink-muted)]"
          >
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full bg-[var(--accent-green)]"
            />
            <span>{statusLabel}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
