"use client";

import React, { useState } from "react";
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
      </main>
      <Footer />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
