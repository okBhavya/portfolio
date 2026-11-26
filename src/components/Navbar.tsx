"use client";

import React, { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useDeskTheme } from "./ThemeProvider";

export interface NavSection {
  id: string;
  label: string;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "playground", label: "Playground" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [activeId, setActiveId] = useState<string>("home");
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useDeskTheme();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const elements = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    setActiveId(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--border-soft)] bg-[var(--bg-paper)]">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        <a
          href="#home"
          onClick={() => handleNavClick("home")}
          className="group inline-flex items-center gap-2.5 rounded-xl px-1 py-0.5 text-[var(--ink-primary)]"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-beige)] font-serif-display text-base font-bold shadow-[0_2px_0_var(--border-ink)] transition-transform group-hover:-rotate-3">
            BG
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif-display text-base font-bold tracking-tight">
              Bhavya Gupta
            </span>
            <span className="font-mono-tech text-[11px] text-[var(--ink-muted)]">
              BITS Pilani &apos;27
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_SECTIONS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? "location" : undefined}
                className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--bg-beige)] font-semibold text-[var(--ink-primary)]"
                    : "text-[var(--ink-secondary)] hover:bg-[var(--bg-beige)]/60 hover:text-[var(--ink-primary)]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute right-2.5 bottom-0.5 left-2.5 h-[2px] rounded-full bg-[var(--accent-orange)]"
                  />
                )}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "day"
                ? "Switch to late-night study lamp mode"
                : "Switch to warm daylight paper mode"
            }
            aria-pressed={theme === "night"}
            title={
              theme === "day" ? "Desk Lamp (Night Mode)" : "Daylight Paper Mode"
            }
            className="ink-button inline-flex items-center gap-1.5 rounded-xl bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-primary)]"
          >
            {theme === "day" ? (
              <>
                <Sun className="h-4 w-4 text-[var(--accent-orange)]" aria-hidden="true" />
                <span className="hidden sm:inline">Day</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-[var(--accent-mustard)]" aria-hidden="true" />
                <span className="hidden sm:inline">Night</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            className="ink-button inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--ink-primary)] md:hidden"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          className="border-t-2 border-[var(--border-soft)] bg-[var(--bg-surface)] px-4 py-3 md:hidden"
        >
          <div className="grid grid-cols-2 gap-2">
            {NAV_SECTIONS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-[var(--border-ink)] bg-[var(--accent-orange-soft)] text-[var(--ink-primary)]"
                      : "border-[var(--border-soft)] bg-[var(--bg-paper)] text-[var(--ink-secondary)]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
