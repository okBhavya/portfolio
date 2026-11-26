"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

export function SignatureSvg({ className = "w-48 h-14" }: { className?: string }) {
  const prefersReduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 270 72"
      fill="none"
      aria-label="Bhavya Gupta handwritten signature"
      role="img"
      className={className}
    >
      <motion.text
        x="8"
        y="46"
        fill="currentColor"
        fontSize="40"
        fontWeight="700"
        letterSpacing="0.5"
        style={{ fontFamily: "var(--font-hand), Caveat, cursive" }}
        transform="rotate(-1.5 135 36)"
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        Bhavya Gupta
      </motion.text>
      <motion.path
        d="M12 58 C78 52, 168 51, 246 56"
        stroke="var(--accent-orange)"
        strokeWidth="2.8"
        strokeLinecap="round"
        initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
      />
    </svg>
  );
}
