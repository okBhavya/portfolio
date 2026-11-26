"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const elements = NAV_SECTIONS.map((s) =>
      document.getElementById(s.id)
    ).filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const updateActiveFromScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 120) {
        setActiveId("home");
        return;
      }
      if (
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 40
      ) {
        setActiveId("contact");
        return;
      }
      const probe = scrollY + 140;
      let current = elements[0].id;
      for (const el of elements) {
        if (el.offsetTop <= probe) {
          current = el.id;
        }
      }
      setActiveId(current);
    };

    updateActiveFromScroll();
    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveFromScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const drawerEl = document.getElementById("mobile-nav-drawer");
    const firstLink = drawerEl?.querySelector<HTMLElement>("a[href]");
    firstLink?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && headerRef.current) {
        const focusable = Array.from(
          headerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    setActiveId(id);
    setMobileOpen(false);
  };

  const pathname = usePathname();
  const isHome = pathname === "/";

  const toggleActionLabel =
    theme === "day"
      ? "Night mode: switch to late-night study lamp"
      : "Day mode: switch to warm daylight paper";

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b-2 border-[var(--border-soft)] bg-[var(--bg-paper)]"
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        {isHome ? (
          <a
            href="#home"
            onClick={() => handleNavClick("home")}
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl px-1 py-0.5 text-[var(--ink-primary)]"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-beige)] font-serif-display text-base font-bold shadow-[0_2px_0_var(--border-ink)] transition-transform group-hover:-rotate-3">
              BG
            </span>
            <span className="flex flex-col leading-tight whitespace-nowrap">
              <span className="font-serif-display text-base font-bold tracking-tight whitespace-nowrap">
                Bhavya Gupta
              </span>
              <span className="font-mono-tech text-[11px] whitespace-nowrap text-[var(--ink-muted)]">
                BITS Pilani &apos;27
              </span>
            </span>
          </a>
        ) : (
          <Link
            href="/#home"
            onClick={() => handleNavClick("home")}
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl px-1 py-0.5 text-[var(--ink-primary)]"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-beige)] font-serif-display text-base font-bold shadow-[0_2px_0_var(--border-ink)] transition-transform group-hover:-rotate-3">
              BG
            </span>
            <span className="flex flex-col leading-tight whitespace-nowrap">
              <span className="font-serif-display text-base font-bold tracking-tight whitespace-nowrap">
                Bhavya Gupta
              </span>
              <span className="font-mono-tech text-[11px] whitespace-nowrap text-[var(--ink-muted)]">
                BITS Pilani &apos;27
              </span>
            </span>
          </Link>
        )}

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_SECTIONS.map((item) => {
            const isActive = isHome && activeId === item.id;
            const classes = `relative rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "bg-[var(--bg-beige)] font-semibold text-[var(--ink-primary)]"
                : "text-[var(--ink-secondary)] hover:bg-[var(--bg-beige)]/60 hover:text-[var(--ink-primary)]"
            }`;
            const content = (
              <>
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute right-2.5 bottom-0.5 left-2.5 h-[2px] rounded-full bg-[var(--accent-orange)]"
                  />
                )}
              </>
            );
            return isHome ? (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? "location" : undefined}
                className={classes}
              >
                {content}
              </a>
            ) : (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={classes}
              >
                {content}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={toggleActionLabel}
            aria-pressed={theme === "night"}
            title={toggleActionLabel}
            className="ink-button inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-bold whitespace-nowrap text-[var(--ink-primary)]"
          >
            {theme === "day" ? (
              <>
                <Moon
                  className="h-4 w-4 shrink-0 text-[var(--accent-blue)]"
                  aria-hidden="true"
                />
                <span className="hidden whitespace-nowrap sm:inline">Night mode</span>
              </>
            ) : (
              <>
                <Sun
                  className="h-4 w-4 shrink-0 text-[var(--accent-mustard)]"
                  aria-hidden="true"
                />
                <span className="hidden whitespace-nowrap sm:inline">Day mode</span>
              </>
            )}
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            className="ink-button inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--ink-primary)] lg:hidden"
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
          className="border-t-2 border-[var(--border-soft)] bg-[var(--bg-surface)] px-4 py-3 lg:hidden"
        >
          <div className="grid grid-cols-2 gap-2">
            {NAV_SECTIONS.map((item) => {
              const isActive = isHome && activeId === item.id;
              const drawerClasses = `rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-[var(--border-ink)] bg-[var(--accent-orange-soft)] text-[var(--ink-primary)]"
                  : "border-[var(--border-soft)] bg-[var(--bg-paper)] text-[var(--ink-secondary)]"
              }`;
              return isHome ? (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={drawerClasses}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={`/#${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={drawerClasses}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
