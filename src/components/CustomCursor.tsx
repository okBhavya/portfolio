"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

interface RippleBurst {
  id: number;
  x: number;
  y: number;
}

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, [data-cursor='interactive']";

function subscribeFinePointer(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(FINE_POINTER_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getFinePointerSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

/**
 * Custom editorial cursor overlay for desktop fine pointers:
 * GPU-composited trailing orbital reticle + ink click ripples.
 */
export function CustomCursor() {
  const prefersReduced = usePrefersReducedMotion();
  const finePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    () => false
  );
  const enabled = finePointer && !prefersReduced;

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [ripples, setRipples] = useState<RippleBurst[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let isPressed = false;
    let rafId: number | null = null;
    let active = false;
    let rippleCounter = 0;
    const timeouts = new Set<number>();

    const applyTransforms = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        const pressScale = isPressed ? 0.8 : 1;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${pressScale})`;
      }
    };

    const tick = () => {
      ringX += (targetX - ringX) * 0.22;
      ringY += (targetY - ringY) * 0.22;
      applyTransforms();

      if (
        Math.abs(targetX - ringX) > 0.25 ||
        Math.abs(targetY - ringY) > 0.25
      ) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const scheduleTick = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (!active) {
        active = true;
        ringX = targetX;
        ringY = targetY;
        setVisible(true);
      }
      applyTransforms();
      const el = e.target as Element | null;
      setHovering(Boolean(el?.closest?.(INTERACTIVE_SELECTOR)));
      scheduleTick();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      isPressed = true;
      applyTransforms();
      const id = ++rippleCounter;
      const x = e.clientX;
      const y = e.clientY;
      setRipples((prev) => [...prev.slice(-4), { id, x, y }]);
      const timer = window.setTimeout(() => {
        timeouts.delete(timer);
        setRipples((prev) => prev.filter((item) => item.id !== id));
      }, 540);
      timeouts.add(timer);
    };

    const onPointerUp = () => {
      isPressed = false;
      applyTransforms();
    };

    const onPointerLeave = () => {
      active = false;
      isPressed = false;
      setVisible(false);
      setHovering(false);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      for (const timer of timeouts) window.clearTimeout(timer);
      timeouts.clear();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseleave", onPointerLeave);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
    >
      {/* Trailing orbital sketch reticle */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border-2 transition-[width,height,border-color,background-color,opacity] duration-150 ease-out will-change-transform ${
          visible ? "opacity-100" : "opacity-0"
        } ${
          hovering
            ? "h-10 w-10 border-[var(--accent-orange)] bg-[var(--accent-orange)]/10"
            : "h-7 w-7 border-[var(--ink-primary)]/45 bg-transparent"
        }`}
        style={{ transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)" }}
      />

      {/* Crisp ink pointer core */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full transition-[width,height,background-color,opacity] duration-100 will-change-transform ${
          visible ? "opacity-100" : "opacity-0"
        } ${
          hovering
            ? "h-2.5 w-2.5 bg-[var(--accent-orange)]"
            : "h-2 w-2 bg-[var(--ink-primary)]"
        }`}
        style={{ transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)" }}
      />

      {/* Click ink-ripple pulses */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="cursor-ripple fixed top-0 left-0 h-8 w-8 rounded-full border-2 border-[var(--accent-orange)]"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
          }}
        />
      ))}
    </div>
  );
}
