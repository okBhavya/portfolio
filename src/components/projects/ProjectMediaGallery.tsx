"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { ProjectItem } from "@/data/projects";
import { LazyProjectVideo } from "./LazyProjectVideo";
import { ProjectSketchVisual } from "./ProjectSketchVisual";

export function ProjectMediaGallery({ project }: { project: ProjectItem }) {
  const [mediaSelection, setMediaSelection] = useState<{
    projectId: string;
    index: number;
  }>({ projectId: project.id, index: 0 });

  const activeMediaIdx =
    mediaSelection.projectId === project.id ? mediaSelection.index : 0;

  const activeMedia =
    project.media.length > 0
      ? project.media[activeMediaIdx] ?? project.media[0]
      : null;

  if (!activeMedia) {
    return (
      <div className="overflow-hidden rounded-2xl border-2 border-[var(--border-soft)] bg-[#F5EFE2]">
        <div className="h-44 w-full">
          <ProjectSketchVisual sketchType={project.sketchType} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] p-3">
      <div className="relative overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[#F5EFE2]">
        {activeMedia.mediaKind === "video" &&
        activeMedia.videoMp4 &&
        activeMedia.videoWebm &&
        activeMedia.posterSrc ? (
          <div
            className="mx-auto w-full max-w-[700px]"
            style={{
              aspectRatio: `${activeMedia.width ?? 690} / ${activeMedia.height ?? 340}`,
              maxHeight: "340px",
            }}
          >
            <LazyProjectVideo
              mp4Src={activeMedia.videoMp4}
              webmSrc={activeMedia.videoWebm}
              posterSrc={activeMedia.posterSrc}
              alt={activeMedia.alt}
              width={activeMedia.width ?? 690}
              height={activeMedia.height ?? 340}
              objectFit="contain"
              showControls
            />
          </div>
        ) : (
          <Image
            src={activeMedia.src}
            alt={activeMedia.alt}
            width={activeMedia.width ?? 1200}
            height={activeMedia.height ?? 720}
            loading="eager"
            decoding="sync"
            sizes="(max-width: 900px) 92vw, 820px"
            className="mx-auto max-h-[340px] w-auto object-contain"
          />
        )}
      </div>
      <p className="mt-2.5 px-1 text-xs font-medium text-[var(--ink-secondary)]">
        {activeMedia.caption}
      </p>
      {project.media.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.media.map((item, idx) => {
            const isSelected = idx === activeMediaIdx;
            return (
              <button
                key={item.src}
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  setMediaSelection({
                    projectId: project.id,
                    index: idx,
                  })
                }
                className={`rounded-lg border px-2.5 py-1 font-mono-tech text-[11px] font-semibold transition-colors ${
                  isSelected
                    ? "border-[var(--border-ink)] bg-[var(--ink-primary)] text-[var(--bg-surface)]"
                    : "border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:border-[var(--border-ink)]"
                }`}
              >
                Figure {idx + 1}
                {item.isAnimated ? " (Video)" : ""}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
