"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUp } from "lucide-react";
import type { ProjectCategory, ProjectItem } from "@/data/projects";
import { Navbar } from "./Navbar";
import { HeroSection } from "./hero/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { ProjectsSection } from "./projects/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { PlaygroundSection } from "./playground/PlaygroundSection";
import { ContactSection } from "./sections/ContactSection";
import { Footer } from "./Footer";

const LazyProjectModal = dynamic(
  () => import("./projects/ProjectModal").then((mod) => mod.ProjectModal),
  { ssr: false }
);

export function PortfolioApp() {
  const [projectFilter, setProjectFilter] = useState<"All" | ProjectCategory>(
    "All"
  );
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-dvh border-x-0 border-[var(--border-ink)] bg-[var(--bg-paper)] sm:mx-auto sm:border-x-4 xl:max-w-[1480px]">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <HeroSection onSelectProjectFilter={setProjectFilter} />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection
          activeCategory={projectFilter}
          onCategoryChange={setProjectFilter}
          onOpenProject={setSelectedProject}
        />
        <SkillsSection onOpenProject={setSelectedProject} />
        <PlaygroundSection />
        <ContactSection />
      </main>
      <Footer />
      {/* Floating scroll-gated Back-to-top button; Footer keeps extra bottom clearance on mobile */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        className={`fixed right-4 bottom-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[var(--accent-orange)] bg-[#D96B27]/20 text-[var(--accent-orange)] backdrop-blur-xs transition-all hover:-translate-y-0.5 hover:bg-[#D96B27]/32 active:translate-y-0 sm:right-6 sm:bottom-6 ${
          showBackToTop
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </button>
      {selectedProject && (
        <LazyProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
