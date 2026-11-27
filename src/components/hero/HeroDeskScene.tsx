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
      "5 flagship builds spanning autonomous world models, Sentinel SAR flood mapping, continual RL, 42.4M-event customer analytics, and CalibrAI.",
    actionLabel: "Open Projects Lab",
    targetSection: "projects",
    day: {
      points: "55,44 521,44 521,385 55,385",
      labelX: 288,
      labelY: 42,
    },
    night: {
      points: "55,44 521,44 521,385 55,385",
      labelX: 288,
      labelY: 42,
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
      points: "889,34 1318,34 1318,471 1126,471 1112,385 959,385 889,434",
      labelX: 1103,
      labelY: 36,
    },
    night: {
      points: "889,34 1318,34 1318,471 1126,471 1112,385 959,385 889,434",
      labelX: 1103,
      labelY: 36,
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
      points: "82,535 307,535 307,612 398,612 398,715 82,715",
      labelX: 224,
      labelY: 529,
    },
    night: {
      points: "74,548 312,548 312,616 404,616 404,716 74,716",
      labelX: 332,
      labelY: 610,
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
      points: "327,455 457,455 457,620 327,620",
      labelX: 392,
      labelY: 449,
    },
    night: {
      points: "112,324 274,324 274,548 112,548",
      labelX: 192,
      labelY: 318,
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
      points: "458,548 554,548 554,698 418,698 418,622 458,622",
      labelX: 499,
      labelY: 543,
    },
    night: {
      points: "458,539 544,539 544,700 418,700 418,628 458,628",
      labelX: 499,
      labelY: 533,
    },
  },
  {
    id: "laptop",
    label: "Lenovo Laptop — Inspect Engineering Stack",
    handNote: "Tech stack ↙",
    title: "Engineering Stack & Systems",
    description:
      "PyTorch, DuckDB, Scikit-learn, FastAPI, PostgreSQL, TypeScript, and reproducible test suites.",
    actionLabel: "Inspect Tech Workbench",
    targetSection: "skills",
    day: {
      points: "557,482 846,482 846,680 557,680",
      labelX: 702,
      labelY: 477,
    },
    night: {
      points: "569,570 848,570 848,694 569,694",
      labelX: 709,
      labelY: 566,
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
      points: "905,391 1122,391 1132,589 1316,605 1316,711 905,711",
      labelX: 1019,
      labelY: 385,
    },
    night: {
      points: "905,391 1122,391 1132,589 1316,605 1316,711 905,711",
      labelX: 1019,
      labelY: 385,
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
    const timer = window.setTimeout(() => setPreloadOther(true), 1200);
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
        {/* Behind-window animated sky: drifting clouds, moon/stars, and soaring birds */}
        <svg
          viewBox={`0 0 ${dims.width} ${dims.height}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
        >
          <defs>
            <clipPath id="hero-window-sky-clip">
              <rect x="930" y="62" width="353" height="367" rx="2" />
            </clipPath>
            <linearGradient id="heroDaySkyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#77BCEE" />
              <stop offset="58%" stopColor="#B4DFFA" />
              <stop offset="100%" stopColor="#DCEFFB" />
            </linearGradient>
            <linearGradient id="heroNightSkyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#091126" />
              <stop offset="55%" stopColor="#122146" />
              <stop offset="100%" stopColor="#1D2F5E" />
            </linearGradient>
            <radialGradient id="heroMoonHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g clipPath="url(#hero-window-sky-clip)">
            {/* Day sky */}
            <g className="hero-sky-day">
              <rect x="930" y="62" width="353" height="367" fill="url(#heroDaySkyGrad)" />

              {/* Soft inked drifting clouds passing behind the BITS Clock Tower */}
              <g className="window-cloud-slow">
                <path
                  d="M956 128c-12 0-21-7-21-16 0-8 7-15 16-16 4-11 16-18 30-18 16 0 29 9 32 21 9 1 16 7 16 15 0 8-9 14-20 14z"
                  fill="#FFFDF8"
                  stroke="#5F86A6"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M1195 168c-10 0-17-6-17-13 0-6 6-12 13-13 3-9 13-14 24-14 13 0 23 7 25 16 8 1 14 6 14 12 0 7-7 12-16 12z"
                  fill="#FFFDF8"
                  fillOpacity="0.94"
                  stroke="#5F86A6"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </g>
              <g className="window-cloud-fast">
                <path
                  d="M1046 218c-9 0-15-5-15-11 0-5 5-10 11-11 3-7 11-12 20-12 10 0 18 6 20 13 6 1 11 5 11 10 0 6-6 11-13 11z"
                  fill="#FFFDF8"
                  fillOpacity="0.9"
                  stroke="#6C92B1"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </g>

              {/* Flying V-birds soaring smoothly behind clock tower & canopy */}
              <g className="window-bird-glide-a">
                <path
                  d="M960 118c5-7 11-7 15 0c4-7 10-7 15 0"
                  fill="none"
                  stroke="#27323F"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="window-bird-flap"
                />
                <path
                  d="M982 134c4-5 9-5 12 0c3-5 8-5 12 0"
                  fill="none"
                  stroke="#27323F"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="window-bird-flap"
                />
              </g>
              <g className="window-bird-glide-b">
                <path
                  d="M1142 152c4-6 9-6 13 0c4-6 9-6 13 0"
                  fill="none"
                  stroke="#27323F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="window-bird-flap"
                />
              </g>
            </g>

            {/* Night sky */}
            <g className="hero-sky-night">
              <rect x="930" y="62" width="353" height="367" fill="url(#heroNightSkyGrad)" />

              {/* Twinkling stars */}
              <g fill="#E2ECFF">
                <circle cx="964" cy="96" r="1.7" className="window-star-a" />
                <circle cx="998" cy="182" r="1.4" className="window-star-b" />
                <circle cx="1058" cy="88" r="1.5" className="window-star-b" />
                <circle cx="1116" cy="108" r="1.3" className="window-star-a" />
                <circle cx="1182" cy="92" r="1.9" className="window-star-b" />
                <circle cx="1226" cy="134" r="1.5" className="window-star-a" />
                <circle cx="1256" cy="100" r="1.3" className="window-star-a" />
                <circle cx="954" cy="148" r="1.2" className="window-star-b" />
                <circle cx="1084" cy="166" r="1.4" className="window-star-a" />
                <circle cx="1206" cy="176" r="1.2" className="window-star-b" />
              </g>

              {/* Luminous crescent moon */}
              <circle cx="1028" cy="134" r="34" fill="url(#heroMoonHalo)" />
              <path
                d="M1037 115a19 19 0 1 0 14 31a15 15 0 1 1-14-31z"
                fill="#FDE68A"
              />

              {/* Quiet night clouds & moonlit birds */}
              <g className="window-cloud-slow" opacity="0.5">
                <path
                  d="M962 198c-10 0-17-6-17-12 0-6 6-11 13-12 3-8 13-13 24-13 12 0 22 6 24 15 7 1 12 5 12 11 0 6-7 11-16 11z"
                  fill="#1C3163"
                />
              </g>
              <g className="window-bird-glide-a" opacity="0.72">
                <path
                  d="M1115 144c4-5 8-5 11 0c3-5 7-5 11 0"
                  fill="none"
                  stroke="#BFD4FF"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  className="window-bird-flap"
                />
              </g>
            </g>
          </g>
        </svg>

        <Image
          src="/hero/desk-day-v6.png"
          width={DAY_DIMENSIONS.width}
          height={DAY_DIMENSIONS.height}
          priority
          fetchPriority="high"
          decoding="sync"
          sizes="(max-width: 820px) 96vw, 780px"
          draggable={false}
          onLoad={() => setPreloadOther(true)}
          alt="Hand-drawn illustration of Bhavya Gupta wearing a black t-shirt with textured messy hair and no glasses behind his silver Lenovo laptop with a GNU sticker, alongside a mini Nintendo Tetris console, My Projects corkboard, BITS Pilani Clock Tower window, owl, books, headphones, globe, and badminton racket"
          className="hero-img-day block h-full w-full select-none [-webkit-tap-highlight-color:transparent]"
        />
        <Image
          src="/hero/desk-night-v6.png"
          width={NIGHT_DIMENSIONS.width}
          height={NIGHT_DIMENSIONS.height}
          loading={isNight || preloadOther ? "eager" : "lazy"}
          decoding="sync"
          sizes="(max-width: 820px) 96vw, 780px"
          draggable={false}
          onLoad={() => setPreloadOther(true)}
          alt="Hand-drawn night-mode illustration of Bhavya Gupta wearing a black t-shirt sleeping at his desk beside his closed silver Lenovo laptop with a GNU sticker, glowing mini Nintendo Tetris console, owl reading on stacked books, starry BITS Pilani Clock Tower window, headphones, globe, and badminton racket"
          className="hero-img-night block h-full w-full select-none [-webkit-tap-highlight-color:transparent]"
        />

        {/* Inline SVG hotspot map & gentle foreground breeze/glow overlay locked to natural coordinates */}
        <svg
          viewBox={`0 0 ${dims.width} ${dims.height}`}
          className="absolute inset-0 z-20 h-full w-full overflow-visible"
          aria-label="Interactive desk workspace hotspots"
        >
          <defs>
            <clipPath id="hero-window-breeze-clip">
              <rect x="932" y="135" width="350" height="292" rx="2" />
            </clipPath>
            <radialGradient id="heroOwlBookGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.46" />
              <stop offset="65%" stopColor="#F59E0B" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Gentle tree-leaf breeze & floating leaves clipped inside the window glass */}
          <g clipPath="url(#hero-window-breeze-clip)" className="pointer-events-none">
            <g className="hero-sky-day">
              <g className="window-leaf-sway-a" fill="#4C7D46" stroke="#1E242B" strokeWidth="1.4">
                <path d="M948 242c9-10 21-10 26-2c-9 7-20 8-26 2z" />
                <path d="M962 262c10-8 21-6 25 2c-9 6-19 5-25-2z" />
                <path d="M944 282c8-8 18-8 23-1c-8 6-17 6-23 1z" />
              </g>
              <g className="window-leaf-sway-b" fill="#477641" stroke="#1E242B" strokeWidth="1.4">
                <path d="M1268 192c-10-9-22-8-26 1c9 7 19 6 26-1z" />
                <path d="M1254 222c-11-7-22-5-26 3c9 5 19 4 26-3z" />
                <path d="M1272 248c-9-7-19-6-23 2c8 5 17 4 23-2z" />
              </g>
              <path
                d="M1006 232c6-4 13-2 15 3c-6 4-12 3-15-3z"
                fill="#5A9252"
                stroke="#1E242B"
                strokeWidth="1.1"
                className="window-wind-leaf-a"
              />
              <path
                d="M1214 210c-6-4-12-2-14 3c5 4 11 3 14-3z"
                fill="#5A9252"
                stroke="#1E242B"
                strokeWidth="1.1"
                className="window-wind-leaf-b"
              />
            </g>

            <g className="hero-sky-night">
              <g className="window-leaf-sway-a" fill="#254238" stroke="#121A21" strokeWidth="1.4">
                <path d="M948 242c9-10 21-10 26-2c-9 7-20 8-26 2z" />
                <path d="M962 262c10-8 21-6 25 2c-9 6-19 5-25-2z" />
              </g>
              <g className="window-leaf-sway-b" fill="#223D34" stroke="#121A21" strokeWidth="1.4">
                <path d="M1268 192c-10-9-22-8-26 1c9 7 19 6 26-1z" />
                <path d="M1254 222c-11-7-22-5-26 3c9 5 19 4 26-3z" />
              </g>
              <path
                d="M1008 236c6-4 12-2 14 3c-5 3-11 2-14-3z"
                fill="#2F5447"
                stroke="#121A21"
                strokeWidth="1.1"
                className="window-wind-leaf-a"
              />
            </g>
          </g>

          {/* Subtle breathing golden lamp glow over the owl's open book atop the 3 stacked books */}
          <g className="hero-sky-night pointer-events-none">
            <circle cx="204" cy="442" r="46" fill="url(#heroOwlBookGlow)" className="owl-book-glow" />
          </g>

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
            className={`hero-hand-tooltip pointer-events-none absolute z-30 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--bg-surface)]/95 px-2.5 py-0.5 font-hand text-base font-bold text-[var(--accent-blue)] shadow-sm ring-1 ring-[var(--border-soft)] ${
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
