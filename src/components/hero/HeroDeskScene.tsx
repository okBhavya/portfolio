"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useDeskTheme } from "@/components/ThemeProvider";
import { profileConfig } from "@/data/profile";
import type { ProjectCategory } from "@/data/projects";

export type DeskObjectId =
  | "pinboard"
  | "laptop"
  | "owlbot"
  | "books"
  | "window"
  | "mug"
  | "globe"
  | "badminton";

interface HotspotBox {
  left: string;
  top: string;
  width: string;
  height: string;
}

interface DeskPropMeta {
  id: DeskObjectId;
  label: string;
  handNote: string;
  title: string;
  description: string;
  actionLabel: string;
  targetSection: string;
  filterCategory?: ProjectCategory;
  dayBox: HotspotBox;
  nightBox: HotspotBox;
}

const DESK_PROPS: DeskPropMeta[] = [
  {
    id: "pinboard",
    label: "Lab Pinboard — Open Projects",
    handNote: "Stuff I've built ↘",
    title: "Experiments & Flagship Projects",
    description:
      "6 flagship builds spanning autonomous world models, Sentinel SAR flood mapping, distributed task queues, continual RL, and 42M-event customer analytics.",
    actionLabel: "Open Projects Lab",
    targetSection: "projects",
    dayBox: { left: "6%", top: "3%", width: "32%", height: "47%" },
    nightBox: { left: "10%", top: "3%", width: "28%", height: "39%" },
  },
  {
    id: "window",
    label: "Pilani Campus Window — View Journey and Experience",
    handNote: "Pilani ↔ Kerala",
    title: "Where I Study & Build",
    description:
      "Studying Computer Science at BITS Pilani; spent Summer 2025 in Kerala interning at KITE on the Samagra statewide education platform.",
    actionLabel: "View Experience Timeline",
    targetSection: "experience",
    dayBox: { left: "68%", top: "1%", width: "27%", height: "52%" },
    nightBox: { left: "63%", top: "1%", width: "28%", height: "44%" },
  },
  {
    id: "books",
    label: "Textbooks and Courses — Read About & Education",
    handNote: "Coursework & BITS '27",
    title: `${profileConfig.education.shortName} — ${profileConfig.education.degree}`,
    description: `${profileConfig.education.period}. Core coursework in DSA, Algorithms, OOP, DBMS, Computer Networks, Deep Learning, RL, and HCI.`,
    actionLabel: "See Courses & About",
    targetSection: "about",
    dayBox: { left: "8%", top: "53%", width: "17%", height: "23%" },
    nightBox: { left: "8%", top: "58%", width: "18%", height: "27%" },
  },
  {
    id: "owlbot",
    label: "Owl Companion — Filter AI and ML Projects",
    handNote: "AI / ML builds!",
    title: "Applied AI, RL & RAG Systems",
    description:
      "From Parseval continual RL and body-frame world models to RAG policy assistants across 40,000+ schools at KITE.",
    actionLabel: "Filter AI / ML Projects",
    targetSection: "projects",
    filterCategory: "AI / ML",
    dayBox: { left: "26%", top: "45%", width: "10%", height: "28%" },
    nightBox: { left: "18%", top: "42%", width: "11%", height: "28%" },
  },
  {
    id: "mug",
    label: "Chai Mug — Play Hard Tetris",
    handNote: "Play Hard Tetris!",
    title: "Chai Break · Hard Tetris",
    description:
      "Need a breather from reading case studies? Custom-configure gravity, blind ghost, rising garbage, or pentomino chaos in Hard Tetris.",
    actionLabel: "Play Hard Tetris",
    targetSection: "playground",
    dayBox: { left: "34%", top: "58%", width: "8%", height: "20%" },
    nightBox: { left: "28%", top: "52%", width: "7%", height: "17%" },
  },
  {
    id: "laptop",
    label: "Drafting Laptop — Inspect Engineering Stack",
    handNote: "Tech stack ↙",
    title: "Engineering Stack & Systems",
    description:
      "PyTorch, DuckDB, Redis Lua scripts, FastAPI, PostgreSQL, TypeScript, and reproducible test suites.",
    actionLabel: "Inspect Tech Workbench",
    targetSection: "skills",
    dayBox: { left: "41%", top: "49%", width: "18%", height: "23%" },
    nightBox: { left: "49%", top: "62%", width: "22%", height: "17%" },
  },
  {
    id: "globe",
    label: "Desk Globe — Explore Interests and Impact",
    handNote: "Interests & curiosity",
    title: "Real-World Problems & Global Curiosity",
    description:
      "Interested in climate tech (AgriGyan MVP in 48 hrs), Sentinel SAR flood mapping across 3,656 km², travel, and startups.",
    actionLabel: "Explore About & Interests",
    targetSection: "about",
    dayBox: { left: "61%", top: "36%", width: "14%", height: "37%" },
    nightBox: { left: "75%", top: "41%", width: "13%", height: "32%" },
  },
  {
    id: "badminton",
    label: "Badminton Racket — See Campus Sports and Leadership",
    handNote: "BOSM & off-clock",
    title: "Beyond Code: Campus Sports & Leadership",
    description:
      "Raised ₹7 lakh for BOSM leading a 45-member Department of Legacy team—and unwind on the badminton court.",
    actionLabel: "See Leadership & Impact",
    targetSection: "experience",
    dayBox: { left: "75%", top: "55%", width: "19%", height: "22%" },
    nightBox: { left: "68%", top: "57%", width: "24%", height: "26%" },
  },
];

interface HeroDeskSceneProps {
  onSelectProjectFilter?: (category: ProjectCategory | "All") => void;
}

export function HeroDeskScene({ onSelectProjectFilter }: HeroDeskSceneProps) {
  const { theme } = useDeskTheme();
  const prefersReduced = useReducedMotion();
  const [hoveredProp, setHoveredProp] = useState<DeskPropMeta | null>(null);
  const [activePopover, setActivePopover] = useState<DeskPropMeta | null>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const isNight = theme === "night";

  const navigateToSection = (sectionId: string, filter?: ProjectCategory) => {
    if (filter && onSelectProjectFilter) {
      onSelectProjectFilter(filter);
    }
    setActivePopover(null);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    }
  };

  const handlePropActivate = (prop: DeskPropMeta) => {
    if (prop.id === "pinboard") {
      onSelectProjectFilter?.("All");
      navigateToSection("projects");
      return;
    }
    if (prop.id === "owlbot") {
      navigateToSection("projects", "AI / ML");
      return;
    }
    setActivePopover(prop);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: nx * 3.5, y: ny * 2.5 });
  };

  const resetPointer = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredProp(null);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[920px] select-none"
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointer}
    >
      {/* Clean floating illustration stage matching gkoberger.com (no outer border box) */}
      <div
        className="relative mx-auto w-full"
        style={{
          transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0)`,
          transition: prefersReduced ? "none" : "transform 180ms ease-out",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={isNight ? "/hero/desk-night.png" : "/hero/desk-day.png"}
          alt={
            isNight
              ? "Hand-drawn night-mode illustration of Bhavya Gupta sleeping at his desk beside his closed laptop, reading owl, starry BITS Pilani clock tower window, books, mug, globe, and badminton racket"
              : "Hand-drawn illustration of Bhavya Gupta smiling behind his sticker-covered laptop at a desk with a My Projects corkboard, BITS Pilani clock tower window, owl, books, headphones, chai mug, globe, and badminton racket"
          }
          className="block h-auto w-full"
        />

        {/* Interactive invisible object hotspots with subtle handwritten callouts */}
        {DESK_PROPS.map((prop) => {
          const box = isNight ? prop.nightBox : prop.dayBox;
          const isHovered = hoveredProp?.id === prop.id;
          return (
            <button
              key={prop.id}
              type="button"
              aria-label={prop.label}
              onMouseEnter={() => setHoveredProp(prop)}
              onFocus={() => setHoveredProp(prop)}
              onBlur={() => setHoveredProp(null)}
              onClick={() => handlePropActivate(prop)}
              style={{
                left: box.left,
                top: box.top,
                width: box.width,
                height: box.height,
              }}
              className="group absolute cursor-pointer rounded-2xl border-2 border-transparent transition-colors hover:border-[var(--accent-blue)]/45 hover:bg-[var(--accent-blue)]/8 focus-visible:border-[var(--accent-orange)] focus-visible:outline-none"
            >
              {isHovered && (
                <span className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--bg-surface)]/95 px-2.5 py-0.5 font-hand text-base font-bold text-[var(--accent-blue)] shadow-sm ring-1 ring-[var(--border-soft)]">
                  {prop.handNote}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Contextual Popover Card inside Hero */}
      <AnimatePresence>
        {activePopover && (
          <motion.div
            role="dialog"
            aria-label={activePopover.title}
            initial={
              prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }
            }
            transition={{ duration: 0.16 }}
            className="ink-card absolute right-3 bottom-3 left-3 z-20 mx-auto max-w-md rounded-2xl p-4 sm:right-6 sm:bottom-4 sm:left-auto"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono-tech text-[11px] font-semibold tracking-wider text-[var(--accent-orange)] uppercase">
                  {activePopover.handNote}
                </p>
                <h3 className="mt-0.5 font-serif-display text-lg font-bold text-[var(--ink-primary)]">
                  {activePopover.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                aria-label="Close desk note"
                className="rounded-lg border border-[var(--border-soft)] p-1 text-[var(--ink-muted)] hover:border-[var(--border-ink)] hover:text-[var(--ink-primary)]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
              {activePopover.description}
            </p>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  navigateToSection(
                    activePopover.targetSection,
                    activePopover.filterCategory
                  )
                }
                className="ink-button rounded-xl bg-[var(--accent-orange)] px-3.5 py-1.5 text-xs font-bold text-[#FFFDF9]"
              >
                {activePopover.actionLabel} →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
