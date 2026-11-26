"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useDeskTheme } from "@/components/ThemeProvider";
import { profileConfig } from "@/data/profile";
import type { ProjectCategory } from "@/data/projects";

export type DeskObjectId =
  | "pinboard"
  | "laptop"
  | "owlbot"
  | "books"
  | "window"
  | "console"
  | "interests";

interface SvgHotspotSpec {
  points: string;
  labelX: number;
  labelY: number;
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
  day: SvgHotspotSpec;
  night: SvgHotspotSpec;
}

const DAY_DIMENSIONS = { width: 1376, height: 768 } as const;
const NIGHT_DIMENSIONS = { width: 1376, height: 768 } as const;

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
    day: {
      points: "36,34 516,34 516,386 36,386",
      labelX: 276,
      labelY: 32,
    },
    night: {
      points: "36,34 516,34 516,386 36,386",
      labelX: 276,
      labelY: 32,
    },
  },
  {
    id: "window",
    label: "BITS Pilani Clock Tower Window — View Journey and Experience",
    handNote: "Pilani ↔ Kerala",
    title: "Where I Study & Build",
    description:
      "Studying Computer Science at BITS Pilani; spent Summer 2025 in Kerala interning at KITE on the Samagra statewide education platform.",
    actionLabel: "View Experience Timeline",
    targetSection: "experience",
    day: {
      points: "896,24 1338,24 1338,474 1140,474 1126,386 968,386 896,436",
      labelX: 1117,
      labelY: 26,
    },
    night: {
      points: "896,24 1338,24 1338,474 1140,474 1126,386 968,386 896,436",
      labelX: 1117,
      labelY: 26,
    },
  },
  {
    id: "books",
    label: "Textbooks and Headphones — Read About & Education",
    handNote: "Coursework & BITS '27",
    title: `${profileConfig.education.shortName} — ${profileConfig.education.degree}`,
    description: `${profileConfig.education.period}. Core coursework in DSA, Algorithms, OOP, DBMS, Computer Networks, Deep Learning, RL, and HCI.`,
    actionLabel: "See Courses & About",
    targetSection: "about",
    day: {
      points: "64,540 296,540 296,620 390,620 390,726 64,726",
      labelX: 210,
      labelY: 534,
    },
    night: {
      points: "64,540 296,540 296,620 390,620 390,726 64,726",
      labelX: 210,
      labelY: 534,
    },
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
    day: {
      points: "316,458 450,458 450,628 316,628",
      labelX: 384,
      labelY: 452,
    },
    night: {
      points: "316,462 458,462 458,644 316,644",
      labelX: 388,
      labelY: 456,
    },
  },
  {
    id: "console",
    label: "Mini Nintendo Console — Play Tetris",
    handNote: "Play Tetris!",
    title: "Mini Nintendo Console · Tetris",
    description:
      "Take a breather from case studies and play Tetris — customize drop speed, toggle shadow guide, add rising rows, or unlock 5-cell pentominoes.",
    actionLabel: "Play Tetris",
    targetSection: "playground",
    day: {
      points: "452,554 550,554 550,708 410,708 410,630 452,630",
      labelX: 494,
      labelY: 548,
    },
    night: {
      points: "452,544 540,544 540,710 410,710 410,636 452,636",
      labelX: 494,
      labelY: 538,
    },
  },
  {
    id: "laptop",
    label: "Lenovo Laptop — Inspect Engineering Stack",
    handNote: "Tech stack ↙",
    title: "Engineering Stack & Systems",
    description:
      "PyTorch, DuckDB, Redis Lua scripts, FastAPI, PostgreSQL, TypeScript, and reproducible test suites.",
    actionLabel: "Inspect Tech Workbench",
    targetSection: "skills",
    day: {
      points: "554,486 852,486 852,690 554,690",
      labelX: 703,
      labelY: 480,
    },
    night: {
      points: "566,576 854,576 854,704 566,704",
      labelX: 710,
      labelY: 572,
    },
  },
  {
    id: "interests",
    label:
      "Desk Globe & Badminton Racket — Explore Interests & Curiosity",
    handNote: "Interests & curiosity",
    title: "Interests, Impact & Off-Clock",
    description:
      "Raised ₹7 lakh for BOSM leading a 45-member Department of Legacy team, shipped the AgriGyan climate-tech MVP in 48 hrs, mapped 3,656 km² of floods, and unwind on the badminton court.",
    actionLabel: "Explore Experience & About",
    targetSection: "experience",
    day: {
      points: "912,392 1136,392 1146,596 1336,612 1336,722 912,722",
      labelX: 1030,
      labelY: 386,
    },
    night: {
      points: "912,392 1136,392 1146,596 1336,612 1336,722 912,722",
      labelX: 1030,
      labelY: 386,
    },
  },
];

interface HeroDeskSceneProps {
  onSelectProjectFilter?: (category: ProjectCategory | "All") => void;
}

export function HeroDeskScene({ onSelectProjectFilter }: HeroDeskSceneProps) {
  const { theme } = useDeskTheme();
  const prefersReduced = usePrefersReducedMotion();
  const [hoveredProp, setHoveredProp] = useState<DeskPropMeta | null>(null);
  const [activePopover, setActivePopover] = useState<DeskPropMeta | null>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [preloadOther, setPreloadOther] = useState(false);

  const isNight = theme === "night";
  const dims = isNight ? NIGHT_DIMENSIONS : DAY_DIMENSIONS;

  useEffect(() => {
    const timer = window.setTimeout(() => setPreloadOther(true), 4500);
    return () => window.clearTimeout(timer);
  }, []);

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
    if (prop.id === "console") {
      navigateToSection("playground");
      return;
    }
    if (prop.id === "owlbot") {
      navigateToSection("projects", "AI / ML");
      return;
    }
    setActivePopover(prop);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: nx * 3.5, y: ny * 2.5 });
  };

  const handleHotspotPointerEnter = (
    e: React.PointerEvent<SVGGElement>,
    prop: DeskPropMeta
  ) => {
    if (
      e.pointerType === "mouse" &&
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches
    ) {
      setHoveredProp(prop);
    }
  };

  const resetPointer = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredProp(null);
  };

  const hoveredSpec = hoveredProp
    ? isNight
      ? hoveredProp.night
      : hoveredProp.day
    : null;

  return (
    <div
      className="relative mx-auto w-full max-w-[780px] select-none [-webkit-tap-highlight-color:transparent]"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      {/* Single aspect-ratio locked wrapper containing both images and exact SVG overlay */}
      <div
        className="hero-stage relative mx-auto w-full select-none [-webkit-tap-highlight-color:transparent]"
        style={{
          transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0)`,
          transition: prefersReduced ? "none" : "transform 180ms ease-out",
        }}
      >
        <Image
          src="/hero/desk-day.png"
          width={DAY_DIMENSIONS.width}
          height={DAY_DIMENSIONS.height}
          priority
          fetchPriority="high"
          decoding="sync"
          sizes="(max-width: 820px) 96vw, 780px"
          draggable={false}
          alt="Hand-drawn illustration of Bhavya Gupta wearing a black t-shirt with textured messy hair and no glasses behind his silver Lenovo laptop with a GNU sticker, alongside a mini Nintendo Tetris console, My Projects corkboard, BITS Pilani Clock Tower window, owl, books, headphones, globe, and badminton racket"
          className="hero-img-day hero-blend block h-full w-full select-none [-webkit-tap-highlight-color:transparent]"
        />
        <Image
          src="/hero/desk-night.png"
          width={NIGHT_DIMENSIONS.width}
          height={NIGHT_DIMENSIONS.height}
          loading={isNight || preloadOther ? "eager" : "lazy"}
          decoding="sync"
          sizes="(max-width: 820px) 96vw, 780px"
          draggable={false}
          alt="Hand-drawn night-mode illustration of Bhavya Gupta wearing a black t-shirt sleeping at his desk beside his closed silver Lenovo laptop with a GNU sticker, glowing mini Nintendo Tetris console, reading owl, starry BITS Pilani Clock Tower window, books, globe, and badminton racket"
          className="hero-img-night hero-blend block h-full w-full select-none [-webkit-tap-highlight-color:transparent]"
        />

        {/* Inline SVG hotspot map locked directly to natural pixel coordinates */}
        <svg
          viewBox={`0 0 ${dims.width} ${dims.height}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-label="Interactive desk workspace hotspots"
        >
          {DESK_PROPS.map((prop) => {
            const spec = isNight ? prop.night : prop.day;
            return (
              <g
                key={prop.id}
                role="button"
                tabIndex={0}
                aria-label={prop.label}
                className="hero-svg-hotspot"
                onPointerEnter={(e) => handleHotspotPointerEnter(e, prop)}
                onPointerLeave={() =>
                  setHoveredProp((curr) => (curr?.id === prop.id ? null : curr))
                }
                onFocus={() => {
                  if (
                    typeof window !== "undefined" &&
                    window.matchMedia("(hover: hover)").matches
                  ) {
                    setHoveredProp(prop);
                  }
                }}
                onBlur={() =>
                  setHoveredProp((curr) => (curr?.id === prop.id ? null : curr))
                }
                onClick={() => handlePropActivate(prop)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePropActivate(prop);
                  }
                }}
              >
                <polygon
                  points={spec.points}
                  fill="transparent"
                  stroke="none"
                  className="hero-svg-shape"
                />
              </g>
            );
          })}
        </svg>

        {/* Handwritten hover callout (rendered strictly via hover:hover pointer/focus interactions) */}
        {hoveredProp && hoveredSpec && (
          <div
            aria-hidden="true"
            style={{
              left: `${(hoveredSpec.labelX / dims.width) * 100}%`,
              top: `${(hoveredSpec.labelY / dims.height) * 100}%`,
            }}
            className={`hero-hand-tooltip pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--bg-surface)]/95 px-2.5 py-0.5 font-hand text-base font-bold text-[var(--accent-blue)] shadow-sm ring-1 ring-[var(--border-soft)] ${
              hoveredSpec.labelY < 80 ? "translate-y-1" : "-translate-y-full"
            }`}
          >
            {hoveredProp.handNote}
          </div>
        )}
      </div>

      {/* Contextual Popover Card inside Hero */}
      {activePopover && (
        <div
          role="dialog"
          aria-label={activePopover.title}
          className="surface-enter ink-card absolute right-3 bottom-3 left-3 z-20 mx-auto max-w-md rounded-2xl p-4 sm:right-6 sm:bottom-4 sm:left-auto"
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
              className="rounded-lg border border-[var(--border-soft)] p-1.5 text-[var(--ink-secondary)] hover:border-[var(--border-ink)] hover:text-[var(--ink-primary)]"
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
              className="ink-button rounded-xl bg-[var(--accent-orange-fill)] px-3.5 py-2 text-xs font-bold text-[#FFFDF9]"
            >
              {activePopover.actionLabel} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
