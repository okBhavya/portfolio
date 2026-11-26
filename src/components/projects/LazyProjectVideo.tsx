"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

interface LazyProjectVideoProps {
  mp4Src: string;
  webmSrc: string;
  posterSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  objectFit?: "cover" | "contain";
  showControls?: boolean;
}

/** Lazily mounts and plays muted MP4/WebM rollouts near the viewport with a crisp poster fallback. */
export function LazyProjectVideo({
  mp4Src,
  webmSrc,
  posterSrc,
  alt,
  width,
  height,
  className = "",
  objectFit = "cover",
  showControls = false,
}: LazyProjectVideoProps) {
  const prefersReduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      return;
    }
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReduced]);

  const togglePlayback = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      void vid.play();
      setPaused(false);
    } else {
      vid.pause();
      setPaused(true);
    }
  };

  const fitClass = objectFit === "cover" ? "object-cover" : "object-contain";

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#F5EFE2]"
    >
      {/* Always keep crisp poster underneath so frame 0 never flashes a blank box while buffering */}
      <Image
        src={posterSrc}
        width={width}
        height={height}
        sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 480px"
        alt={alt}
        className={`h-full w-full ${fitClass} object-center ${className}`}
      />

      {shouldLoadVideo && !prefersReduced && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          width={width}
          height={height}
          onCanPlay={() => setVideoReady(true)}
          onPlaying={() => setVideoReady(true)}
          aria-label={alt}
          className={`absolute inset-0 h-full w-full ${fitClass} object-center transition-opacity duration-200 ${
            videoReady ? "opacity-100" : "opacity-0"
          } ${className}`}
        >
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src} type="video/mp4" />
        </video>
      )}

      {showControls && shouldLoadVideo && !prefersReduced && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={paused ? "Play rollout video" : "Pause rollout video"}
          className="ink-button absolute right-2.5 bottom-2.5 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[var(--bg-surface)]/95 px-2.5 py-1 font-mono-tech text-[11px] font-bold text-[var(--ink-primary)]"
        >
          {paused ? (
            <>
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Play</span>
            </>
          ) : (
            <>
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Pause</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
