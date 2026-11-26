"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

export function SignatureSvg({ className = "w-48 h-14" }: { className?: string }) {
  const prefersReduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 280 82"
      fill="none"
      aria-label="Bhavya Gupta handwritten signature"
      role="img"
      className={className}
    >
      {/* Handwritten B + cursive Bhavya Gupta flourish */}
      <motion.path
        d="M22 62 C25 36, 30 16, 34 14 C44 10, 56 17, 50 28 C44 37, 30 37, 29 38 C46 37, 58 45, 51 57 C45 66, 26 65, 22 57"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      />
      <motion.path
        d="M60 18 C58 34, 57 52, 56 60 C60 44, 69 36, 74 44 C76 50, 72 60, 82 57 C89 55, 92 43, 86 43 C79 43, 76 58, 86 58 C92 58, 97 46, 100 43 C101 51, 104 60, 108 57 C112 54, 114 44, 118 44 C120 51, 121 57, 126 57 C131 57, 134 45, 137 44 C139 51, 136 69, 128 74 C121 77, 125 63, 142 54 C149 50, 155 43, 150 43 C143 43, 141 57, 150 57 C157 57, 163 49, 168 45"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, delay: 0.15, ease: "easeInOut" }}
      />
      <motion.path
        d="M193 26 C183 22, 174 36, 175 49 C176 58, 188 61, 196 52 L197 44 L189 44 M203 44 C203 53, 206 58, 211 56 C216 54, 218 45, 220 44 C221 51, 223 58, 228 57 C233 56, 235 46, 236 44 C236 53, 234 69, 234 74 M236 46 C244 41, 249 47, 247 54 C245 59, 238 58, 236 55 M254 24 L252 57 M247 36 L263 34 C261 46, 259 56, 266 56 C271 56, 274 49, 275 46"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
      />
      <motion.path
        d="M28 73 C95 67, 185 67, 256 71"
        stroke="var(--accent-orange)"
        strokeWidth="2.3"
        strokeLinecap="round"
        initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
}
