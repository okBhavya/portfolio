"use client";

import React, { useState } from "react";
import { ArrowUp } from "lucide-react";
import type { ProjectCategory, ProjectItem } from "@/data/projects";
import { Navbar } from "./Navbar";
import { HeroSection } from "./hero/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { ProjectsSection } from "./projects/ProjectsSection";
import { ProjectModal } from "./projects/ProjectModal";
import { SkillsSection } from "./sections/SkillsSection";
import { PlaygroundSection } from "./playground/PlaygroundSection";
import { ContactSection } from "./sections/ContactSection";
import { Footer } from "./Footer";

export function PortfolioApp() {
  const [projectFilter, setProjectFilter] = useState<"All" | ProjectCategory>(
    "All"
  );
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen border-x-0 border-[var(--border-ink)] bg-[var(--bg-paper)] sm:mx-auto sm:border-x-4 xl:max-w-[1480px]">
      <Navbar />
      <main id="main-content">
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
        {/* Translucent orange Back-to-Top arrow button on the right side just before footer */}
        <div className="bg-lab-dots pb-6">
          <div className="mx-auto flex max-w-6xl justify-end px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[var(--accent-orange)] bg-[#D96B27]/20 text-[var(--accent-orange)] backdrop-blur-xs transition-all hover:-translate-y-0.5 hover:bg-[#D96B27]/32 active:translate-y-0"
            >
              <ArrowUp className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
