"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDeskTheme } from "@/components/ThemeProvider";
import { profileConfig } from "@/data/profile";
import type { ProjectCategory } from "@/data/projects";
import {
  BookOpen,
  Code2,
  Coffee,
  Compass,
  FolderKanban,
  Gamepad2,
  Sparkles,
  X,
} from "lucide-react";

export type DeskObjectId =
  | "pinboard"
  | "laptop"
  | "owlbot"
  | "books"
  | "window"
  | "mug"
  | "globe"
  | "badminton"
  | "sketchpad";

interface DeskPropMeta {
  id: DeskObjectId;
  label: string;
  handNote: string;
  title: string;
  description: string;
  actionLabel: string;
  targetSection: string;
  filterCategory?: ProjectCategory;
}

const DESK_PROPS: Record<DeskObjectId, DeskPropMeta> = {
  pinboard: {
    id: "pinboard",
    label: "Lab Pinboard",
    handNote: "Stuff I've built ↘",
    title: "Experiments & Flagship Projects",
    description:
      "6 verified engineering builds spanning autonomous world models, distributed task queues, OR-Tools copilots, and 42M-event customer analytics.",
    actionLabel: "Open Projects Lab",
    targetSection: "projects",
  },
  laptop: {
    id: "laptop",
    label: "Drafting Laptop",
    handNote: "Code & stack ↙",
    title: "Engineering Stack & Systems",
    description:
      "PyTorch, DuckDB, Redis Lua scripts, FastAPI, PostgreSQL, TypeScript, and rigorous test harnesses.",
    actionLabel: "Inspect Tech Workbench",
    targetSection: "skills",
  },
  owlbot: {
    id: "owlbot",
    label: "Owl-Bot Companion",
    handNote: "AI / ML builds!",
    title: "Applied AI, RL & RAG Systems",
    description:
      "From Parseval continual RL and body-frame world models to RAG policy assistants across 40,000+ schools at KITE.",
    actionLabel: "Filter AI / ML Projects",
    targetSection: "projects",
    filterCategory: "AI / ML",
  },
  books: {
    id: "books",
    label: "Textbooks & Notes",
    handNote: "BITS '27 · Learning",
    title: `${profileConfig.education.shortName} — ${profileConfig.education.degree}`,
    description: `${profileConfig.education.period}. Plus 2 years teaching Class 12 math with NSS Pilani (80% scored 75%+ in Boards).`,
    actionLabel: "Read About & Education",
    targetSection: "about",
  },
  window: {
    id: "window",
    label: "Pilani Campus Window",
    handNote: "Pilani ↔ Kerala",
    title: "Where I Study & Build",
    description:
      "Based in Pilani at BITS Pilani; spent Summer 2025 in Kerala interning at KITE on the Samagra statewide education platform.",
    actionLabel: "View Experience Timeline",
    targetSection: "experience",
  },
  mug: {
    id: "mug",
    label: "Chai & Coffee Mug",
    handNote: "Fuel + mini-game!",
    title: "Powered by Masala Chai & Late-Night Builds",
    description:
      "Need a break from case studies? Collect coffee cups and AI tokens while dodging bugs in Byte Runner.",
    actionLabel: "Play Byte Runner",
    targetSection: "playground",
  },
  globe: {
    id: "globe",
    label: "Desk Globe",
    handNote: "Curiosity & impact",
    title: "Real-World Problems & Global Curiosity",
    description:
      "Interested in climate tech (AgriGyan MVP in 48 hrs), Sentinel SAR flood mapping across 3,656 km², travel, and startups.",
    actionLabel: "Explore Interests",
    targetSection: "about",
  },
  badminton: {
    id: "badminton",
    label: "Badminton Racket",
    handNote: "BOSM & off-clock",
    title: "Beyond Code: Campus Sports & Leadership",
    description:
      "Raised ₹7 lakh for BOSM leading a 45-member Department of Legacy team—and still find time for badminton rallies.",
    actionLabel: "See Leadership & Impact",
    targetSection: "experience",
  },
  sketchpad: {
    id: "sketchpad",
    label: "UI Sketchpad & Headphones",
    handNote: "Product & HCI",
    title: "Product Sense & Human-Computer Interaction",
    description:
      "Product Lead for SU App (₹12 Cr+ transactions analysed) and creator of CalibrAI trust calibration overlays.",
    actionLabel: "See Product Work",
    targetSection: "experience",
  },
};

interface HeroDeskSceneProps {
  onSelectProjectFilter?: (category: ProjectCategory | "All") => void;
}

export function HeroDeskScene({ onSelectProjectFilter }: HeroDeskSceneProps) {
  const { theme } = useDeskTheme();
  const prefersReduced = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<DeskObjectId | null>(null);
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

  const handlePropActivate = (id: DeskObjectId) => {
    const meta = DESK_PROPS[id];
    // Immediate navigation for primary discovery objects, playful card popover for contextual ones
    if (id === "pinboard") {
      onSelectProjectFilter?.("All");
      navigateToSection("projects");
      return;
    }
    if (id === "owlbot") {
      navigateToSection("projects", "AI / ML");
      return;
    }
    setActivePopover(meta);
  };

  const handleKeyActivate = (
    e: React.KeyboardEvent<SVGGElement>,
    id: DeskObjectId
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePropActivate(id);
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: nx * 5, y: ny * 3.5 });
  };

  const resetPointer = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredId(null);
  };

  const hoveredMeta = hoveredId ? DESK_PROPS[hoveredId] : null;

  return (
    <div
      className="relative mx-auto w-full max-w-[1060px] select-none"
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointer}
    >
      {/* Interactive SVG Desk Illustration */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[var(--border-ink)] bg-[var(--bg-surface)] shadow-[var(--shadow-ink)] transition-colors">
        {/* Subtle Desk Top Header Bar (sketchbook studio feel) */}
        <div className="flex items-center justify-between border-b-2 border-[var(--border-soft)] bg-[var(--bg-beige)]/70 px-4 py-2 text-xs">
          <div className="flex items-center gap-2 font-mono-tech text-[var(--ink-secondary)]">
            <span className="inline-block h-2.5 w-2.5 rounded-full border border-[var(--border-ink)] bg-[var(--accent-orange)]" />
            <span className="inline-block h-2.5 w-2.5 rounded-full border border-[var(--border-ink)] bg-[var(--accent-mustard)]" />
            <span className="inline-block h-2.5 w-2.5 rounded-full border border-[var(--border-ink)] bg-[var(--accent-green)]" />
            <span className="ml-1 hidden sm:inline">bhavya_desk.svg — interactive workspace</span>
            <span className="ml-1 sm:hidden">bhavya_desk.svg</span>
          </div>
          <div className="font-hand text-base text-[var(--accent-blue)]">
            {hoveredMeta ? hoveredMeta.handNote : "Click any object on the desk ✨"}
          </div>
        </div>

        <svg
          viewBox="0 0 1080 500"
          className="block h-auto w-full"
          role="img"
          aria-label="Illustrated interactive desk workspace of Bhavya Gupta with pinboard, laptop, AI owl-bot, textbooks, Pilani clock tower window, coffee mug, globe, sketchpad, and badminton racket"
        >
          <defs>
            <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={isNight ? "#1A2233" : "#FAF6EE"}
              />
              <stop
                offset="100%"
                stopColor={isNight ? "#141A27" : "#F2EBD9"}
              />
            </linearGradient>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={isNight ? "#121E3D" : "#BCE0F2"}
              />
              <stop
                offset="100%"
                stopColor={isNight ? "#243561" : "#EAF5FA"}
              />
            </linearGradient>
            <linearGradient id="lampGlow" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#F5B841" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#F5B841" stopOpacity="0" />
            </linearGradient>
            <pattern
              id="corkDots"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="0.9" fill="#9E7347" opacity="0.35" />
              <circle cx="7" cy="7" r="0.8" fill="#7D5631" opacity="0.28" />
            </pattern>
          </defs>

          {/* Studio Wall Background */}
          <rect x="0" y="0" width="1080" height="500" fill="url(#wallGrad)" />

          {/* Subtle graph texture on wall */}
          <g opacity={isNight ? 0.08 : 0.16} stroke="#8E8678" strokeWidth="1">
            <line x1="0" y1="100" x2="1080" y2="100" />
            <line x1="0" y1="200" x2="1080" y2="200" />
            <line x1="0" y1="300" x2="1080" y2="300" />
            <line x1="270" y1="0" x2="270" y2="410" />
            <line x1="540" y1="0" x2="540" y2="410" />
            <line x1="810" y1="0" x2="810" y2="410" />
          </g>

          {/* Warm study lamp cone in night mode */}
          {isNight && (
            <polygon
              points="168,145 45,420 355,420"
              fill="url(#lampGlow)"
            />
          )}

          {/* Background Layer (subtle parallax) */}
          <g
            style={{
              transform: `translate(${tilt.x * 0.55}px, ${tilt.y * 0.55}px)`,
              transition: prefersReduced ? "none" : "transform 160ms ease-out",
            }}
          >
            {/* 1. LEFT WALL: CORKBOARD / PINBOARD ("Projects") */}
            <g
              className="desk-prop"
              role="button"
              tabIndex={0}
              aria-label="Lab Pinboard — Open Projects"
              onMouseEnter={() => setHoveredId("pinboard")}
              onFocus={() => setHoveredId("pinboard")}
              onBlur={() => setHoveredId(null)}
              onClick={() => handlePropActivate("pinboard")}
              onKeyDown={(e) => handleKeyActivate(e, "pinboard")}
            >
              {/* Frame shadow */}
              <rect
                x="62"
                y="46"
                width="292"
                height="196"
                rx="10"
                fill="#1F2421"
                opacity="0.14"
              />
              {/* Wood frame */}
              <rect
                x="56"
                y="40"
                width="292"
                height="196"
                rx="10"
                fill="#B8834E"
                stroke="#1F2421"
                strokeWidth="3.2"
              />
              {/* Cork inner */}
              <rect
                x="68"
                y="52"
                width="268"
                height="172"
                rx="5"
                fill="#D6A874"
                stroke="#1F2421"
                strokeWidth="2"
              />
              <rect
                x="68"
                y="52"
                width="268"
                height="172"
                rx="5"
                fill="url(#corkDots)"
              />

              {/* Header banner */}
              <rect
                x="130"
                y="62"
                width="144"
                height="26"
                rx="4"
                fill="#FFFDF9"
                stroke="#1F2421"
                strokeWidth="2"
              />
              <text
                x="202"
                y="79"
                textAnchor="middle"
                fill="#1F2421"
                fontSize="13"
                fontWeight="700"
                fontFamily="monospace"
              >
                MY PROJECTS
              </text>

              {/* Sticky note 1: RL Curve */}
              <g transform="translate(82 98) rotate(-3)">
                <rect
                  width="76"
                  height="68"
                  rx="3"
                  fill="#FBF0B2"
                  stroke="#1F2421"
                  strokeWidth="2"
                />
                <circle cx="38" cy="8" r="4" fill="#D96B27" stroke="#1F2421" strokeWidth="1.5" />
                <path
                  d="M10 52 Q24 44, 34 32 T64 20"
                  fill="none"
                  stroke="#1F5E4B"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <text x="10" y="61" fontSize="8.5" fill="#1F2421" fontFamily="monospace">
                  CAR-SR -42%
                </text>
              </g>

              {/* Sticky note 2: Gantt / PlanPilot */}
              <g transform="translate(170 96) rotate(2)">
                <rect
                  width="80"
                  height="64"
                  rx="3"
                  fill="#D8ECE4"
                  stroke="#1F2421"
                  strokeWidth="2"
                />
                <circle cx="40" cy="8" r="4" fill="#3F7293" stroke="#1F2421" strokeWidth="1.5" />
                <rect x="10" y="20" width="38" height="7" rx="2" fill="#1F5E4B" />
                <rect x="26" y="31" width="42" height="7" rx="2" fill="#D96B27" />
                <rect x="14" y="42" width="32" height="7" rx="2" fill="#D49B2B" />
                <text x="10" y="58" fontSize="8" fill="#1F2421" fontFamily="monospace">
                  PlanPilot
                </text>
              </g>

              {/* Sticky note 3: 42.4M & TQE */}
              <g transform="translate(259 102) rotate(-2)">
                <rect
                  width="64"
                  height="96"
                  rx="3"
                  fill="#F7E1D1"
                  stroke="#1F2421"
                  strokeWidth="2"
                />
                <circle cx="32" cy="8" r="4" fill="#D96B27" stroke="#1F2421" strokeWidth="1.5" />
                <text x="8" y="29" fontSize="9.5" fontWeight="700" fill="#1F2421" fontFamily="monospace">
                  30k/m
                </text>
                <text x="8" y="42" fontSize="8" fill="#4A514C" fontFamily="monospace">
                  TQE Lua
                </text>
                <line x1="8" y1="52" x2="54" y2="52" stroke="#1F2421" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="8" y="67" fontSize="9.5" fontWeight="700" fill="#1F5E4B" fontFamily="monospace">
                  42.4M
                </text>
                <text x="8" y="80" fontSize="8" fill="#4A514C" fontFamily="monospace">
                  events
                </text>
              </g>

              {/* Lower white index card: World Model */}
              <g transform="translate(92 173) rotate(1.5)">
                <rect
                  width="150"
                  height="42"
                  rx="4"
                  fill="#FFFDF9"
                  stroke="#1F2421"
                  strokeWidth="2"
                />
                <circle cx="14" cy="11" r="3.5" fill="#D49B2B" stroke="#1F2421" strokeWidth="1.4" />
                <text x="26" y="18" fontSize="9.5" fontWeight="700" fill="#1F2421" fontFamily="monospace">
                  MPC World Model · 80%
                </text>
                <text x="26" y="33" fontSize="8.5" fill="#1F5E4B" fontFamily="monospace">
                  0% traffic collisions
                </text>
              </g>
            </g>

            {/* 2. RIGHT WALL: BITS PILANI CLOCK TOWER WINDOW */}
            <g
              className="desk-prop"
              role="button"
              tabIndex={0}
              aria-label="Pilani Campus Window — View Journey and Experience"
              onMouseEnter={() => setHoveredId("window")}
              onFocus={() => setHoveredId("window")}
              onBlur={() => setHoveredId(null)}
              onClick={() => handlePropActivate("window")}
              onKeyDown={(e) => handleKeyActivate(e, "window")}
            >
              {/* Window outer casing */}
              <rect
                x="718"
                y="38"
                width="298"
                height="208"
                rx="12"
                fill="#1F2421"
                opacity="0.14"
              />
              <rect
                x="712"
                y="32"
                width="298"
                height="208"
                rx="12"
                fill="#EFE8DA"
                stroke="#1F2421"
                strokeWidth="3.2"
              />
              {/* Sky backdrop */}
              <rect
                x="726"
                y="46"
                width="270"
                height="180"
                rx="6"
                fill="url(#skyGrad)"
                stroke="#1F2421"
                strokeWidth="2.4"
              />

              {/* Day Sun vs Night Moon & Stars */}
              {isNight ? (
                <g>
                  <circle cx="944" cy="82" r="18" fill="#F6E3A1" />
                  <circle cx="952" cy="77" r="15" fill="#18274D" />
                  <circle cx="760" cy="72" r="2.2" fill="#FFFDF9" />
                  <circle cx="792" cy="96" r="1.6" fill="#FFFDF9" />
                  <circle cx="835" cy="64" r="2" fill="#FFFDF9" />
                  <circle cx="892" cy="78" r="1.8" fill="#FFFDF9" />
                  <circle cx="972" cy="122" r="1.6" fill="#FFFDF9" />
                </g>
              ) : (
                <g>
                  <circle
                    cx="944"
                    cy="82"
                    r="20"
                    fill="#F4B942"
                    stroke="#1F2421"
                    strokeWidth="2"
                  />
                  {/* Soft stylized desert clouds */}
                  <path
                    d="M748 88 Q760 72, 778 78 Q792 66, 808 78 Q822 76, 826 90 Z"
                    fill="#FFFDF9"
                    stroke="#1F2421"
                    strokeWidth="1.8"
                  />
                </g>
              )}

              {/* Distant Pilani desert ridge */}
              <path
                d="M726 196 Q790 178, 860 192 T996 186 L996 226 L726 226 Z"
                fill={isNight ? "#1E2D3D" : "#D6C5A3"}
              />

              {/* Stylized BITS Pilani Clock Tower & Sandstone Dome */}
              <g>
                {/* Left & Right Wings */}
                <rect
                  x="764"
                  y="168"
                  width="194"
                  height="58"
                  fill={isNight ? "#4A433D" : "#E8D2AE"}
                  stroke="#1F2421"
                  strokeWidth="2.2"
                />
                {/* Archways */}
                <path
                  d="M780 226 V200 A10 10 0 0 1 800 200 V226 Z"
                  fill={isNight ? "#2A3242" : "#A66A43"}
                  stroke="#1F2421"
                  strokeWidth="1.8"
                />
                <path
                  d="M922 226 V200 A10 10 0 0 1 942 200 V226 Z"
                  fill={isNight ? "#2A3242" : "#A66A43"}
                  stroke="#1F2421"
                  strokeWidth="1.8"
                />
                {/* Central Clock Tower */}
                <rect
                  x="832"
                  y="102"
                  width="58"
                  height="124"
                  fill={isNight ? "#5C5248" : "#F0DEC0"}
                  stroke="#1F2421"
                  strokeWidth="2.4"
                />
                {/* Copper-green dome */}
                <path
                  d="M830 102 C832 76, 890 76, 892 102 Z"
                  fill="#1F5E4B"
                  stroke="#1F2421"
                  strokeWidth="2.2"
                />
                <line x1="861" y1="68" x2="861" y2="82" stroke="#1F2421" strokeWidth="2.2" />
                {/* Tower Clock */}
                <circle
                  cx="861"
                  cy="132"
                  r="14"
                  fill={isNight ? "#FBE6A2" : "#FFFDF9"}
                  stroke="#1F2421"
                  strokeWidth="2.2"
                />
                <path d="M861 132 V123 M861 132 L868 135" stroke="#1F2421" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Green trees & campus lawn */}
              <path
                d="M726 212 Q780 202, 845 214 T996 210 L996 226 L726 226 Z"
                fill={isNight ? "#163A30" : "#518B6A"}
                stroke="#1F2421"
                strokeWidth="1.8"
              />
              {/* Window pane crossbars */}
              <line x1="861" y1="46" x2="861" y2="226" stroke="#1F2421" strokeWidth="2.4" opacity="0.35" />
              {/* Window sill */}
              <rect
                x="702"
                y="236"
                width="318"
                height="14"
                rx="5"
                fill="#D7C9B0"
                stroke="#1F2421"
                strokeWidth="2.8"
              />
            </g>
          </g>

          {/* Hanging/Wall Desk Lamp on Left (visually anchors Day/Night feel) */}
          <g>
            <path
              d="M150 288 V256 C150 248, 165 246, 175 256"
              fill="none"
              stroke="#1F2421"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M158 262 L192 276 L172 294 L144 276 Z"
              fill="#D96B27"
              stroke="#1F2421"
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <ellipse
              cx="150"
              cy="376"
              rx="22"
              ry="7"
              fill="#272C28"
              stroke="#1F2421"
              strokeWidth="2.4"
            />
            <path d="M150 374 L150 288" stroke="#1F2421" strokeWidth="4.2" />
          </g>

          {/* 3. CENTRAL ILLUSTRATED CHARACTER: BHAVYA */}
          <g
            style={{
              transform: `translate(${tilt.x * 0.85}px, ${tilt.y * 0.7}px)`,
              transition: prefersReduced ? "none" : "transform 160ms ease-out",
            }}
          >
            {/* Chair back peeking behind shoulders */}
            <rect
              x="448"
              y="228"
              width="184"
              height="148"
              rx="22"
              fill={isNight ? "#2B364A" : "#3E4A43"}
              stroke="#1F2421"
              strokeWidth="3.2"
            />

            {/* Torso / Shirt (Day: forest overshirt + warm tee; Night: cozy mustard-amber hoodie) */}
            <path
              d="M442 374 C446 312, 480 288, 540 288 C600 288, 634 312, 638 374 Z"
              fill={isNight ? "#D49B2B" : "#1F5E4B"}
              stroke="#1F2421"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            {/* Inner collar / hoodie strings */}
            {isNight ? (
              <g>
                <path
                  d="M506 290 Q540 318, 574 290"
                  fill="none"
                  stroke="#1F2421"
                  strokeWidth="2.8"
                />
                <line x1="524" y1="306" x2="522" y2="338" stroke="#FFFDF9" strokeWidth="2.8" strokeLinecap="round" />
                <line x1="556" y1="306" x2="558" y2="338" stroke="#FFFDF9" strokeWidth="2.8" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                <path
                  d="M518 288 L540 342 L562 288 Z"
                  fill="#F7F3EB"
                  stroke="#1F2421"
                  strokeWidth="2.6"
                />
                {/* Subtle plaid/pocket lines */}
                <rect x="478" y="324" width="24" height="24" rx="4" fill="#184C3D" stroke="#1F2421" strokeWidth="2" />
              </g>
            )}

            {/* Neck */}
            <rect
              x="524"
              y="264"
              width="32"
              height="32"
              rx="10"
              fill="#E7B58C"
              stroke="#1F2421"
              strokeWidth="2.8"
            />

            {/* Ears */}
            <circle cx="486" cy="218" r="11" fill="#E7B58C" stroke="#1F2421" strokeWidth="2.8" />
            <circle cx="594" cy="218" r="11" fill="#E7B58C" stroke="#1F2421" strokeWidth="2.8" />

            {/* Head */}
            <rect
              x="490"
              y="158"
              width="100"
              height="114"
              rx="46"
              fill="#F1C39B"
              stroke="#1F2421"
              strokeWidth="3.2"
            />

            {/* Hair (styled dark wavy editorial hair) */}
            <path
              d="M486 206 C484 156, 514 134, 544 136 C578 138, 598 160, 594 206 C588 184, 574 176, 558 178 C542 180, 526 170, 510 180 C498 188, 492 196, 486 206 Z"
              fill="#232528"
              stroke="#1F2421"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M518 144 Q538 130, 558 142"
              fill="none"
              stroke="#232528"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Eyebrows */}
            <path d="M510 198 Q521 193, 531 198" fill="none" stroke="#1F2421" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M550 198 Q560 193, 571 198" fill="none" stroke="#1F2421" strokeWidth="2.8" strokeLinecap="round" />

            {/* Glasses (signature warm rounded frames) */}
            <g stroke="#1F2421" strokeWidth="2.6" fill={isNight ? "rgba(255,230,160,0.16)" : "rgba(255,255,255,0.22)"}>
              <rect x="504" y="204" width="30" height="22" rx="7" />
              <rect x="546" y="204" width="30" height="22" rx="7" />
              <line x1="534" y1="214" x2="546" y2="214" />
            </g>

            {/* Friendly Eyes */}
            <circle cx="519" cy="215" r="3.6" fill="#1F2421" />
            <circle cx="561" cy="215" r="3.6" fill="#1F2421" />
            <circle cx="520.5" cy="213.5" r="1.1" fill="#FFFDF9" />
            <circle cx="562.5" cy="213.5" r="1.1" fill="#FFFDF9" />

            {/* Nose & Warm Smile */}
            <path d="M540 218 Q544 228, 538 232" fill="none" stroke="#1F2421" strokeWidth="2.4" strokeLinecap="round" />
            <path
              d="M522 243 Q540 256, 558 243"
              fill="none"
              stroke="#1F2421"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Subtle rosy cheeks */}
            <ellipse cx="508" cy="233" rx="6" ry="3.2" fill="#D96B27" opacity="0.28" />
            <ellipse cx="572" cy="233" rx="6" ry="3.2" fill="#D96B27" opacity="0.28" />
          </g>

          {/* 4. FOREGROUND WOODEN DESK SLAB */}
          <g>
            {/* Floor shadow */}
            <rect
              x="44"
              y="398"
              width="992"
              height="36"
              rx="10"
              fill="#1F2421"
              opacity="0.16"
            />
            {/* Desk legs hint */}
            <rect x="94" y="408" width="22" height="92" fill="#C49A68" stroke="#1F2421" strokeWidth="3" />
            <rect x="964" y="408" width="22" height="92" fill="#C49A68" stroke="#1F2421" strokeWidth="3" />
            {/* Desk tabletop */}
            <rect
              x="44"
              y="366"
              width="992"
              height="42"
              rx="10"
              fill={isNight ? "#8F6A43" : "#E5C69B"}
              stroke="#1F2421"
              strokeWidth="3.4"
            />
            <line
              x1="54"
              y1="388"
              x2="1026"
              y2="388"
              stroke="#1F2421"
              strokeWidth="2"
              opacity="0.2"
            />
          </g>

          {/* Foreground Desk Props Layer */}
          <g
            style={{
              transform: `translate(${tilt.x}px, ${tilt.y}px)`,
              transition: prefersReduced ? "none" : "transform 160ms ease-out",
            }}
          >
            {/* 5. STACK OF TEXTBOOKS (LEFT) */}
            <g
              className="desk-prop"
              role="button"
              tabIndex={0}
              aria-label="Textbooks and Notes — Read About & Education"
              onMouseEnter={() => setHoveredId("books")}
              onFocus={() => setHoveredId("books")}
              onBlur={() => setHoveredId(null)}
              onClick={() => handlePropActivate("books")}
              onKeyDown={(e) => handleKeyActivate(e, "books")}
            >
              {/* Bottom book: Systems */}
              <rect x="78" y="344" width="118" height="22" rx="4" fill="#3F7293" stroke="#1F2421" strokeWidth="2.8" />
              <line x1="94" y1="355" x2="174" y2="355" stroke="#FFFDF9" strokeWidth="2" opacity="0.7" />
              {/* Middle book: RL & Control */}
              <rect x="86" y="322" width="108" height="22" rx="4" fill="#1F5E4B" stroke="#1F2421" strokeWidth="2.8" />
              <text x="102" y="337" fontSize="9.5" fontWeight="700" fill="#FFFDF9" fontFamily="monospace">
                RL &amp; ML
              </text>
              {/* Top book: Stats & Design */}
              <rect x="92" y="302" width="96" height="20" rx="4" fill="#D96B27" stroke="#1F2421" strokeWidth="2.8" />
              {/* Bookmark ribbon */}
              <path d="M162 322 V336 L167 331 L172 336 V322 Z" fill="#F4B942" stroke="#1F2421" strokeWidth="1.6" />
            </g>

            {/* 6. UI SKETCHPAD & HEADPHONES */}
            <g
              className="desk-prop"
              role="button"
              tabIndex={0}
              aria-label="Sketchpad and Headphones — Explore Product & HCI Work"
              onMouseEnter={() => setHoveredId("sketchpad")}
              onFocus={() => setHoveredId("sketchpad")}
              onBlur={() => setHoveredId(null)}
              onClick={() => handlePropActivate("sketchpad")}
              onKeyDown={(e) => handleKeyActivate(e, "sketchpad")}
            >
              {/* Open Spiral Sketchpad */}
              <polygon
                points="210,368 232,334 328,334 316,368"
                fill="#FFFDF9"
                stroke="#1F2421"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              {/* Wireframe doodle on sketchpad */}
              <rect x="238" y="341" width="38" height="10" rx="2" fill="#D8ECE4" stroke="#1F2421" strokeWidth="1.4" />
              <line x1="238" y1="357" x2="302" y2="357" stroke="#1F2421" strokeWidth="1.5" />
              <circle cx="294" cy="346" r="4.5" fill="#D96B27" stroke="#1F2421" strokeWidth="1.4" />

              {/* Studio Headphones resting beside pad */}
              <path
                d="M214 352 C210 318, 258 314, 260 350"
                fill="none"
                stroke="#1F2421"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M214 352 C210 318, 258 314, 260 350"
                fill="none"
                stroke="#D49B2B"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <rect x="205" y="346" width="14" height="22" rx="6" fill="#272C28" stroke="#1F2421" strokeWidth="2.2" />
              <rect x="253" y="346" width="14" height="22" rx="6" fill="#272C28" stroke="#1F2421" strokeWidth="2.2" />
            </g>

            {/* 7. AI OWL-BOT COMPANION */}
            <g
              className="desk-prop"
              role="button"
              tabIndex={0}
              aria-label="AI Owl-Bot — Filter AI and ML Projects"
              onMouseEnter={() => setHoveredId("owlbot")}
              onFocus={() => setHoveredId("owlbot")}
              onBlur={() => setHoveredId(null)}
              onClick={() => handlePropActivate("owlbot")}
              onKeyDown={(e) => handleKeyActivate(e, "owlbot")}
            >
              {/* Antenna */}
              <line x1="376" y1="274" x2="376" y2="290" stroke="#1F2421" strokeWidth="2.6" />
              <circle cx="376" cy="271" r="4.5" fill="#D96B27" stroke="#1F2421" strokeWidth="2" />
              {/* Owl ears */}
              <polygon points="350,295 344,280 364,289" fill="#3F7293" stroke="#1F2421" strokeWidth="2.4" strokeLinejoin="round" />
              <polygon points="402,295 408,280 388,289" fill="#3F7293" stroke="#1F2421" strokeWidth="2.4" strokeLinejoin="round" />
              {/* Body */}
              <rect
                x="344"
                y="288"
                width="64"
                height="78"
                rx="26"
                fill="#4A7C9B"
                stroke="#1F2421"
                strokeWidth="3"
              />
              {/* Belly plate */}
              <rect
                x="356"
                y="328"
                width="40"
                height="30"
                rx="12"
                fill="#EFE8DA"
                stroke="#1F2421"
                strokeWidth="2.2"
              />
              <text x="376" y="347" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1F2421" fontFamily="monospace">
                AI
              </text>
              {/* Big owl eyes */}
              <circle cx="363" cy="310" r="10.5" fill="#FFFDF9" stroke="#1F2421" strokeWidth="2.4" />
              <circle cx="389" cy="310" r="10.5" fill="#FFFDF9" stroke="#1F2421" strokeWidth="2.4" />
              <circle cx="364" cy="310" r="4.5" fill="#1F2421" />
              <circle cx="390" cy="310" r="4.5" fill="#1F2421" />
              <circle cx="365.5" cy="308.5" r="1.4" fill="#FFFDF9" />
              <circle cx="391.5" cy="308.5" r="1.4" fill="#FFFDF9" />
              {/* Brass beak */}
              <polygon points="371,316 381,316 376,325" fill="#D49B2B" stroke="#1F2421" strokeWidth="2" strokeLinejoin="round" />
              {/* Feet */}
              <path d="M362 366 L356 371 M362 366 L362 372 M390 366 L390 372 M390 366 L396 371" stroke="#1F2421" strokeWidth="2.6" strokeLinecap="round" />
            </g>

            {/* 8. CENTRAL DRAFTING LAPTOP ("Code & Stack") */}
            <g
              className="desk-prop"
              role="button"
              tabIndex={0}
              aria-label="Drafting Laptop — Inspect Engineering Stack"
              onMouseEnter={() => setHoveredId("laptop")}
              onFocus={() => setHoveredId("laptop")}
              onBlur={() => setHoveredId(null)}
              onClick={() => handlePropActivate("laptop")}
              onKeyDown={(e) => handleKeyActivate(e, "laptop")}
            >
              {/* Laptop screen */}
              <rect
                x="442"
                y="264"
                width="196"
                height="112"
                rx="10"
                fill="#242A2F"
                stroke="#1F2421"
                strokeWidth="3.2"
              />
              {/* Back-of-screen editorial badge (since screen faces viewer or split cutaway) -> let's render crisp code preview + stickers on bezel */}
              <rect x="452" y="274" width="176" height="88" rx="5" fill="#171C21" />
              {/* Code lines on laptop */}
              <circle cx="462" cy="283" r="3" fill="#D96B27" />
              <circle cx="472" cy="283" r="3" fill="#D49B2B" />
              <circle cx="482" cy="283" r="3" fill="#5AB896" />
              <rect x="462" y="294" width="64" height="5" rx="2" fill="#7AB3D8" />
              <rect x="532" y="294" width="44" height="5" rx="2" fill="#EA8343" />
              <rect x="472" y="305" width="96" height="5" rx="2" fill="#D8ECE4" opacity="0.75" />
              <rect x="472" y="316" width="76" height="5" rx="2" fill="#E6B84E" />
              <rect x="462" y="327" width="118" height="5" rx="2" fill="#5AB896" />
              <rect x="472" y="338" width="52" height="5" rx="2" fill="#F2ECE0" opacity="0.65" />
              <rect x="530" y="337" width="5" height="8" fill="#EA8343" className="animate-cursor" />

              {/* Laptop base */}
              <polygon
                points="422,376 658,376 672,390 408,390"
                fill="#D4CFC4"
                stroke="#1F2421"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <rect x="514" y="379" width="52" height="5" rx="2" fill="#9E998E" />
            </g>

            {/* 9. WARM CHAI / COFFEE MUG */}
            <g
              className="desk-prop"
              role="button"
              tabIndex={0}
              aria-label="Chai Mug — Play Byte Runner Game"
              onMouseEnter={() => setHoveredId("mug")}
              onFocus={() => setHoveredId("mug")}
              onBlur={() => setHoveredId(null)}
              onClick={() => handlePropActivate("mug")}
              onKeyDown={(e) => handleKeyActivate(e, "mug")}
            >
              {/* Steam */}
              <path
                d="M702 308 Q696 298, 704 288"
                fill="none"
                stroke={isNight ? "#F2ECE0" : "#525852"}
                strokeWidth="2.4"
                strokeLinecap="round"
                className="animate-steam"
              />
              <path
                d="M716 306 Q722 296, 714 285"
                fill="none"
                stroke={isNight ? "#F2ECE0" : "#525852"}
                strokeWidth="2.4"
                strokeLinecap="round"
                className="animate-steam-delayed"
              />
              {/* Handle */}
              <path
                d="M728 328 C744 328, 744 352, 728 352"
                fill="none"
                stroke="#1F2421"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
              <path
                d="M728 328 C744 328, 744 352, 728 352"
                fill="none"
                stroke="#D96B27"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Mug body */}
              <rect
                x="686"
                y="316"
                width="44"
                height="50"
                rx="8"
                fill="#D96B27"
                stroke="#1F2421"
                strokeWidth="3"
              />
              <ellipse cx="708" cy="318" rx="18" ry="4" fill="#6F4427" stroke="#1F2421" strokeWidth="1.8" />
              <text x="708" y="346" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FFFDF9" fontFamily="monospace">
                CHAI
              </text>
            </g>

            {/* 10. DESK GLOBE */}
            <g
              className="desk-prop"
              role="button"
              tabIndex={0}
              aria-label="Desk Globe — Explore Interests and Impact"
              onMouseEnter={() => setHoveredId("globe")}
              onFocus={() => setHoveredId("globe")}
              onBlur={() => setHoveredId(null)}
              onClick={() => handlePropActivate("globe")}
              onKeyDown={(e) => handleKeyActivate(e, "globe")}
            >
              {/* Stand */}
              <path d="M786 366 H830 M808 354 V366" stroke="#1F2421" strokeWidth="3.2" strokeLinecap="round" />
              {/* Brass meridian arc */}
              <path
                d="M808 282 A37 37 0 1 1 808 356"
                fill="none"
                stroke="#D49B2B"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
              <path
                d="M808 282 A37 37 0 1 1 808 356"
                fill="none"
                stroke="#1F2421"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Sphere */}
              <circle
                cx="806"
                cy="319"
                r="29"
                fill="#67A4C4"
                stroke="#1F2421"
                strokeWidth="3"
              />
              {/* Continents (India-centered stylized landmasses) */}
              <path
                d="M792 302 C800 296, 818 298, 822 309 C826 318, 814 326, 808 335 C804 325, 796 322, 790 315 Z"
                fill="#5A9A78"
                stroke="#1F2421"
                strokeWidth="1.6"
              />
              <path
                d="M782 325 C788 322, 794 330, 790 339 C783 340, 779 332, 782 325 Z"
                fill="#5A9A78"
                stroke="#1F2421"
                strokeWidth="1.4"
              />
            </g>

            {/* 11. BADMINTON RACKET & SHUTTLECOCK (RIGHT EDGE) */}
            <g
              className="desk-prop"
              role="button"
              tabIndex={0}
              aria-label="Badminton Racket — See Campus Sports and Leadership"
              onMouseEnter={() => setHoveredId("badminton")}
              onFocus={() => setHoveredId("badminton")}
              onBlur={() => setHoveredId(null)}
              onClick={() => handlePropActivate("badminton")}
              onKeyDown={(e) => handleKeyActivate(e, "badminton")}
            >
              <g transform="translate(918 238) rotate(22)">
                {/* Racket Head */}
                <ellipse
                  cx="32"
                  cy="38"
                  rx="24"
                  ry="32"
                  fill="rgba(255,253,249,0.22)"
                  stroke="#1F5E4B"
                  strokeWidth="5"
                />
                <ellipse
                  cx="32"
                  cy="38"
                  rx="24"
                  ry="32"
                  fill="none"
                  stroke="#1F2421"
                  strokeWidth="2.2"
                />
                {/* Strings */}
                <g stroke="#1F2421" strokeWidth="1" opacity="0.45">
                  <line x1="20" y1="12" x2="20" y2="64" />
                  <line x1="32" y1="7" x2="32" y2="69" />
                  <line x1="44" y1="12" x2="44" y2="64" />
                  <line x1="11" y1="24" x2="53" y2="24" />
                  <line x1="8" y1="38" x2="56" y2="38" />
                  <line x1="11" y1="52" x2="53" y2="52" />
                </g>
                {/* Shaft & Grip */}
                <line x1="32" y1="70" x2="32" y2="112" stroke="#1F2421" strokeWidth="3.6" />
                <rect x="27" y="108" width="10" height="30" rx="4" fill="#D96B27" stroke="#1F2421" strokeWidth="2.4" />
              </g>
              {/* Shuttlecock sitting on desk */}
              <g transform="translate(954 334)">
                <polygon
                  points="6,20 18,20 23,4 1,4"
                  fill="#FFFDF9"
                  stroke="#1F2421"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <line x1="8" y1="5" x2="10" y2="19" stroke="#1F2421" strokeWidth="1.2" />
                <line x1="16" y1="5" x2="14" y2="19" stroke="#1F2421" strokeWidth="1.2" />
                <circle cx="12" cy="24" r="6" fill="#D96B27" stroke="#1F2421" strokeWidth="2" />
              </g>
            </g>
          </g>

          {/* Subtle handwritten desk signature note at bottom right */}
          <text
            x="998"
            y="456"
            textAnchor="end"
            fill={isNight ? "#98A2B3" : "#6E736B"}
            fontSize="19"
            fontFamily="var(--font-hand), cursive"
          >
            curious by default · builder by habit
          </text>
        </svg>

        {/* Contextual Interactive Popover Card inside Scene */}
        <AnimatePresence>
          {activePopover && (
            <motion.div
              role="dialog"
              aria-label={activePopover.title}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="ink-card absolute right-4 bottom-4 left-4 z-20 mx-auto max-w-md rounded-2xl p-4 sm:right-6 sm:bottom-6 sm:left-auto"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono-tech text-[11px] font-semibold tracking-wider text-[var(--accent-orange)] uppercase">
                    {activePopover.label}
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
              <div className="mt-3 flex items-center justify-end gap-2">
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

      {/* Intentional Quick-Access Desk Strip (great discoverability on desktop & easy tapping on mobile!) */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <button
          type="button"
          onClick={() => handlePropActivate("pinboard")}
          className="ink-card ink-card-interactive flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[var(--ink-primary)]"
        >
          <FolderKanban className="h-4 w-4 shrink-0 text-[var(--accent-orange)]" aria-hidden="true" />
          <span>Pinboard · Projects</span>
        </button>
        <button
          type="button"
          onClick={() => handlePropActivate("owlbot")}
          className="ink-card ink-card-interactive flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[var(--ink-primary)]"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-[var(--accent-blue)]" aria-hidden="true" />
          <span>Owl-Bot · AI / ML</span>
        </button>
        <button
          type="button"
          onClick={() => handlePropActivate("laptop")}
          className="ink-card ink-card-interactive flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[var(--ink-primary)]"
        >
          <Code2 className="h-4 w-4 shrink-0 text-[var(--accent-green)]" aria-hidden="true" />
          <span>Laptop · Stack</span>
        </button>
        <button
          type="button"
          onClick={() => handlePropActivate("books")}
          className="ink-card ink-card-interactive flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[var(--ink-primary)]"
        >
          <BookOpen className="h-4 w-4 shrink-0 text-[var(--accent-mustard)]" aria-hidden="true" />
          <span>Books · BITS &apos;27</span>
        </button>
        <button
          type="button"
          onClick={() => handlePropActivate("globe")}
          className="ink-card ink-card-interactive flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[var(--ink-primary)]"
        >
          <Compass className="h-4 w-4 shrink-0 text-[var(--accent-green)]" aria-hidden="true" />
          <span>Globe · Curiosity</span>
        </button>
        <button
          type="button"
          onClick={() => navigateToSection("playground")}
          className="ink-card ink-card-interactive flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[var(--ink-primary)]"
        >
          <Gamepad2 className="h-4 w-4 shrink-0 text-[var(--accent-orange)]" aria-hidden="true" />
          <span className="flex items-center gap-1">
            Chai · Game <Coffee className="h-3 w-3 opacity-70" aria-hidden="true" />
          </span>
        </button>
      </div>
    </div>
  );
}
