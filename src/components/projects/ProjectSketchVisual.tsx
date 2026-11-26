import React from "react";
import type { ProjectItem } from "@/data/projects";

export function ProjectSketchVisual({
  sketchType,
}: {
  sketchType: ProjectItem["sketchType"];
}) {
  switch (sketchType) {
    case "mpc":
      return (
        <svg
          viewBox="0 0 320 130"
          className="h-full w-full"
          aria-hidden="true"
        >
          <rect width="320" height="130" fill="var(--bg-paper)" />
          {/* Curved road path */}
          <path
            d="M15 104 Q115 96, 165 62 T305 28"
            fill="none"
            stroke="var(--border-soft)"
            strokeWidth="36"
            strokeLinecap="round"
          />
          <path
            d="M15 104 Q115 96, 165 62 T305 28"
            fill="none"
            stroke="var(--ink-muted)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          {/* Sampled MPC rollout fan */}
          <path d="M88 92 Q145 78, 198 48" fill="none" stroke="var(--accent-blue)" strokeWidth="1.6" opacity="0.5" />
          <path d="M88 92 Q148 92, 196 76" fill="none" stroke="var(--accent-orange)" strokeWidth="1.6" opacity="0.45" />
          <path d="M88 92 Q145 68, 210 42" fill="none" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" />
          {/* Ego vehicle */}
          <g transform="translate(64 84) rotate(-14)">
            <rect width="32" height="16" rx="4" fill="var(--accent-orange)" stroke="var(--border-ink)" strokeWidth="2" />
            <circle cx="26" cy="4" r="2" fill="#FFFDF9" />
            <circle cx="26" cy="12" r="2" fill="#FFFDF9" />
          </g>
          {/* Obstacle clearance circle */}
          <circle cx="220" cy="76" r="14" fill="var(--accent-orange-soft)" stroke="var(--accent-orange)" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="212" y="70" width="16" height="12" rx="3" fill="var(--ink-primary)" />
          <text x="16" y="24" fontSize="10" fontFamily="monospace" fill="var(--ink-muted)">
            N=256 · H=10 · 56ms CPU
          </text>
        </svg>
      );

    case "planpilot":
      return (
        <svg viewBox="0 0 320 130" className="h-full w-full" aria-hidden="true">
          <rect width="320" height="130" fill="var(--bg-paper)" />
          {/* Gantt lanes */}
          <line x1="54" y1="22" x2="54" y2="108" stroke="var(--border-ink)" strokeWidth="1.8" />
          <line x1="54" y1="108" x2="300" y2="108" stroke="var(--border-ink)" strokeWidth="1.8" />
          <text x="18" y="42" fontSize="9.5" fontFamily="monospace" fill="var(--ink-secondary)">M1</text>
          <text x="18" y="68" fontSize="9.5" fontFamily="monospace" fill="var(--ink-secondary)">M2</text>
          <text x="18" y="94" fontSize="9.5" fontFamily="monospace" fill="var(--ink-secondary)">M3</text>
          <rect x="64" y="30" width="68" height="16" rx="4" fill="var(--accent-green)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <rect x="138" y="30" width="18" height="16" rx="3" fill="var(--accent-mustard)" stroke="var(--border-ink)" strokeWidth="1.4" />
          <rect x="162" y="30" width="84" height="16" rx="4" fill="var(--accent-blue)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <rect x="84" y="56" width="96" height="16" rx="4" fill="var(--accent-orange)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <rect x="192" y="56" width="76" height="16" rx="4" fill="var(--accent-green)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <rect x="70" y="82" width="110" height="16" rx="4" fill="var(--accent-blue)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <rect x="208" y="82" width="64" height="16" rx="4" fill="var(--accent-mustard)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <text x="200" y="20" fontSize="9.5" fontFamily="monospace" fill="var(--accent-green)">
            CP-SAT + [F1] Verified
          </text>
        </svg>
      );

    case "tqe":
      return (
        <svg viewBox="0 0 320 130" className="h-full w-full" aria-hidden="true">
          <rect width="320" height="130" fill="var(--bg-paper)" />
          {/* Queue -> Lua -> Workers -> Postgres */}
          <rect x="14" y="42" width="60" height="44" rx="8" fill="var(--bg-surface)" stroke="var(--border-ink)" strokeWidth="2" />
          <text x="44" y="62" textAnchor="middle" fontSize="9.5" fontWeight="700" fontFamily="monospace" fill="var(--ink-primary)">FastAPI</text>
          <text x="44" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--ink-muted)">dual-write</text>
          <path d="M74 64 H104" stroke="var(--border-ink)" strokeWidth="2" />
          <rect x="104" y="32" width="82" height="64" rx="10" fill="var(--accent-orange-soft)" stroke="var(--border-ink)" strokeWidth="2" />
          <text x="145" y="55" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="monospace" fill="var(--ink-primary)">Redis Lua</text>
          <text x="145" y="70" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--accent-orange)">10 atomic ops</text>
          <text x="145" y="83" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--ink-muted)">lease token</text>
          <path d="M186 48 L220 34 M186 64 H220 M186 80 L220 94" stroke="var(--border-ink)" strokeWidth="2" />
          <rect x="220" y="20" width="84" height="24" rx="6" fill="var(--accent-green-soft)" stroke="var(--border-ink)" strokeWidth="1.8" />
          <text x="262" y="35" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="var(--ink-primary)">Worker 42MB</text>
          <rect x="220" y="52" width="84" height="24" rx="6" fill="var(--accent-green-soft)" stroke="var(--border-ink)" strokeWidth="1.8" />
          <text x="262" y="67" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="var(--ink-primary)">Worker 42MB</text>
          <rect x="220" y="84" width="84" height="24" rx="6" fill="var(--accent-blue-soft)" stroke="var(--border-ink)" strokeWidth="1.8" />
          <text x="262" y="99" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="var(--ink-primary)">Postgres Log</text>
        </svg>
      );

    case "segmentation":
      return (
        <svg viewBox="0 0 320 130" className="h-full w-full" aria-hidden="true">
          <rect width="320" height="130" fill="var(--bg-paper)" />
          {/* Cluster bubbles + revenue lift bars */}
          <circle cx="58" cy="48" r="22" fill="var(--accent-orange-soft)" stroke="var(--border-ink)" strokeWidth="2" />
          <circle cx="112" cy="76" r="28" fill="var(--accent-green-soft)" stroke="var(--border-ink)" strokeWidth="2" />
          <circle cx="88" cy="36" r="14" fill="var(--accent-mustard-soft)" stroke="var(--border-ink)" strokeWidth="1.8" />
          <text x="58" y="51" textAnchor="middle" fontSize="8.5" fontWeight="700" fontFamily="monospace" fill="var(--ink-primary)">47% rev</text>
          <text x="112" y="79" textAnchor="middle" fontSize="8.5" fontWeight="700" fontFamily="monospace" fill="var(--ink-primary)">k=7</text>
          {/* Lift bars */}
          <rect x="176" y="72" width="24" height="36" rx="4" fill="var(--border-soft)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <rect x="212" y="48" width="24" height="60" rx="4" fill="var(--accent-blue)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <rect x="248" y="28" width="24" height="80" rx="4" fill="var(--accent-green)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <text x="224" y="20" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="var(--accent-orange)">
            42.4M Events · +$310k EV
          </text>
        </svg>
      );

    case "continual":
      return (
        <svg viewBox="0 0 320 130" className="h-full w-full" aria-hidden="true">
          <rect width="320" height="130" fill="var(--bg-paper)" />
          {/* Orthogonal projection vectors */}
          <line x1="86" y1="102" x2="180" y2="102" stroke="var(--accent-blue)" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="86" y1="102" x2="48" y2="36" stroke="var(--accent-orange)" strokeWidth="2.4" strokeDasharray="4 3" />
          <line x1="86" y1="102" x2="86" y2="28" stroke="var(--accent-green)" strokeWidth="3.2" strokeLinecap="round" />
          <rect x="86" y="88" width="14" height="14" fill="none" stroke="var(--border-ink)" strokeWidth="1.5" />
          <text x="95" y="34" fontSize="9" fontWeight="700" fontFamily="monospace" fill="var(--accent-green)">g_proj ⟂ g_mem</text>
          <text x="184" y="105" fontSize="9" fontFamily="monospace" fill="var(--accent-blue)">g_mem</text>
          {/* Parseval spectrum */}
          <text x="216" y="42" fontSize="9" fontFamily="monospace" fill="var(--ink-secondary)">σ(W) ≈ 1</text>
          <rect x="216" y="52" width="14" height="40" rx="3" fill="var(--accent-mustard)" stroke="var(--border-ink)" strokeWidth="1.5" />
          <rect x="236" y="54" width="14" height="38" rx="3" fill="var(--accent-mustard)" stroke="var(--border-ink)" strokeWidth="1.5" />
          <rect x="256" y="53" width="14" height="39" rx="3" fill="var(--accent-mustard)" stroke="var(--border-ink)" strokeWidth="1.5" />
          <rect x="276" y="55" width="14" height="37" rx="3" fill="var(--accent-mustard)" stroke="var(--border-ink)" strokeWidth="1.5" />
        </svg>
      );

    case "calibrai":
      return (
        <svg viewBox="0 0 320 130" className="h-full w-full" aria-hidden="true">
          <rect width="320" height="130" fill="var(--bg-paper)" />
          {/* Chat bubble + Shadow DOM pill */}
          <rect x="28" y="18" width="264" height="52" rx="10" fill="var(--bg-surface)" stroke="var(--border-ink)" strokeWidth="2" />
          <line x1="46" y1="36" x2="220" y2="36" stroke="var(--ink-secondary)" strokeWidth="4" strokeLinecap="round" />
          <line x1="46" y1="50" x2="178" y2="50" stroke="var(--border-soft)" strokeWidth="4" strokeLinecap="round" />
          <rect x="28" y="78" width="264" height="34" rx="10" fill="var(--accent-green-soft)" stroke="var(--border-ink)" strokeWidth="2" />
          <circle cx="48" cy="95" r="7" fill="var(--accent-green)" stroke="var(--border-ink)" strokeWidth="1.5" />
          <text x="64" y="99" fontSize="10" fontWeight="700" fontFamily="monospace" fill="var(--ink-primary)">
            Shadow DOM · Trust Signal
          </text>
          <text x="276" y="99" textAnchor="end" fontSize="9" fontFamily="monospace" fill="var(--accent-green)">
            MV3
          </text>
        </svg>
      );

    case "flood":
      return (
        <svg viewBox="0 0 320 130" className="h-full w-full" aria-hidden="true">
          <rect width="320" height="130" fill="var(--bg-paper)" />
          <rect x="28" y="20" width="96" height="90" rx="8" fill="#27323F" stroke="var(--border-ink)" strokeWidth="2" />
          <path d="M40 86 Q64 46, 98 62 T116 38" fill="none" stroke="#7AB3D8" strokeWidth="10" strokeLinecap="round" />
          <text x="76" y="102" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="#F2ECE0">VV+VH SAR</text>
          <path d="M132 65 H162" stroke="var(--border-ink)" strokeWidth="2.2" />
          <rect x="168" y="20" width="124" height="90" rx="8" fill="var(--accent-blue-soft)" stroke="var(--border-ink)" strokeWidth="2" />
          <path d="M182 86 Q210 42, 248 60 T282 38" fill="none" stroke="var(--accent-blue)" strokeWidth="12" strokeLinecap="round" />
          <text x="230" y="102" textAnchor="middle" fontSize="8.5" fontWeight="700" fontFamily="monospace" fill="var(--ink-primary)">
            IoU 0.71 · 3,656 km²
          </text>
        </svg>
      );

    case "hunter":
    default:
      return (
        <svg viewBox="0 0 320 130" className="h-full w-full" aria-hidden="true">
          <rect width="320" height="130" fill="var(--bg-paper)" />
          <rect x="24" y="24" width="110" height="82" rx="8" fill="var(--bg-surface)" stroke="var(--border-ink)" strokeWidth="2" />
          <text x="79" y="54" textAnchor="middle" fontSize="9.5" fontWeight="700" fontFamily="monospace" fill="var(--ink-primary)">Filter Gate</text>
          <text x="79" y="70" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--accent-green)">Remote + SWE/AI</text>
          <path d="M134 65 H170" stroke="var(--border-ink)" strokeWidth="2" />
          <rect x="170" y="24" width="126" height="82" rx="8" fill="var(--accent-mustard-soft)" stroke="var(--border-ink)" strokeWidth="2" />
          <text x="233" y="54" textAnchor="middle" fontSize="9.5" fontWeight="700" fontFamily="monospace" fill="var(--ink-primary)">0–100 Match</text>
          <text x="233" y="70" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--ink-secondary)">Human Approval</text>
        </svg>
      );
  }
}
