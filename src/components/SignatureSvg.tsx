"use client";

import React from "react";

export function SignatureSvg({ className = "w-48 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 270 72"
      fill="none"
      aria-label="Bhavya Gupta handwritten signature"
      role="img"
      className={className}
    >
      <text
        x="8"
        y="46"
        fill="currentColor"
        fontSize="40"
        fontWeight="700"
        letterSpacing="0.5"
        style={{ fontFamily: "var(--font-hand), Caveat, cursive" }}
        transform="rotate(-1.5 135 36)"
      >
        Bhavya Gupta
      </text>
      <path
        d="M12 58 C78 52, 168 51, 246 56"
        stroke="var(--accent-orange)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray="240"
        className="signature-underline"
      />
    </svg>
  );
}
