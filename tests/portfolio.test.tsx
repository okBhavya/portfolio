import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { PortfolioApp } from "@/components/PortfolioApp";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  buildMailtoHref,
  sanitizeField,
} from "@/components/sections/ContactSection";
import { profileConfig, SITE_URL } from "@/data/profile";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";

function renderApp() {
  return render(
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  );
}

describe("Bhavya Gupta Portfolio", () => {
  it("renders verified identity, hero copy, and navigation links", () => {
    renderApp();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /intersection of ai, engineering, and product/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(profileConfig.heroGreeting)).toBeInTheDocument();
    expect(screen.getAllByText(profileConfig.email).length).toBeGreaterThanOrEqual(1);
    expect(projects.filter((p) => p.featured)).toHaveLength(5);
    expect(projects.find((p) => p.id === "flood-mapping")?.featured).toBe(true);
    expect(projects.find((p) => p.id === "planpilot")).toBeUndefined();
    expect(projects.find((p) => p.id === "internship-hunter")).toBeUndefined();
    expect(projects.find((p) => p.id === "distributed-task-queue")).toBeUndefined();
    expect(experiences).toHaveLength(5);
    expect(screen.queryByText("Behavioural cohorts")).not.toBeInTheDocument();
    expect(screen.queryByText(/Areas I gravitate toward/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Not a corporate CV/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/No fake 90% skill bars/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/01 \/ What I Study/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Built with Next\.js/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Having plenty of sleep while evolving beyond endless expectations/i)
    ).toBeInTheDocument();
    // Back to top is hidden from assistive tech at y = 0 and revealed once scrolled past 420px
    expect(
      screen.queryByRole("button", { name: "Back to top" })
    ).not.toBeInTheDocument();
    Object.defineProperty(window, "scrollY", { value: 520, writable: true });
    fireEvent.scroll(window);
    expect(
      screen.getByRole("button", { name: "Back to top" })
    ).toBeInTheDocument();
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    fireEvent.scroll(window);

    expect(screen.getByText(/Courses I've Learnt/i)).toBeInTheDocument();
    expect(screen.getByText("Human-Computer Interaction")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /How I Approach a Problem/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Step\s*03/i }));
    expect(
      screen.getByRole("heading", { level: 4, name: /3\. Prototype Modular Systems/i })
    ).toBeInTheDocument();
  });

  it("toggles Day and Night desk lamp theme", () => {
    renderApp();
    const toggle = screen.getByRole("button", {
      name: /switch to late-night study lamp/i,
    });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute("data-theme")).toBe("night");
    expect(
      screen.getByRole("button", {
        name: /switch to warm daylight paper/i,
      })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("spins circular project carousel, filters by domain, and opens/closes a detailed case study modal", async () => {
    renderApp();

    const projectsSection = screen.getByRole("region", {
      name: /experiments & systems i've built/i,
    });

    // Circular wrap: from 01 / 05, Previous wraps to 05 / 05 (CalibrAI)
    fireEvent.click(
      within(projectsSection).getByRole("button", { name: "Previous project" })
    );
    expect(within(projectsSection).getByText("05 / 05")).toBeInTheDocument();
    fireEvent.click(
      within(projectsSection).getByRole("button", { name: "Next project" })
    );
    expect(within(projectsSection).getByText("01 / 05")).toBeInTheDocument();

    const dataFilter = within(projectsSection).getByRole("button", {
      name: "Data Science",
    });
    fireEvent.click(dataFilter);

    expect(within(projectsSection).getByText("01 / 02")).toBeInTheDocument();
    expect(
      within(projectsSection).getByRole("heading", {
        level: 3,
        name: "Planet Sentinel",
      })
    ).toBeInTheDocument();
    expect(
      within(projectsSection).queryByRole("heading", {
        level: 3,
        name: "World Models & MPC",
      })
    ).not.toBeInTheDocument();

    fireEvent.click(
      within(projectsSection).getByRole("button", { name: "Next project" })
    );
    expect(within(projectsSection).getByText("02 / 02")).toBeInTheDocument();
    expect(
      within(projectsSection).getByRole("heading", {
        level: 3,
        name: "Customer Intelligence",
      })
    ).toBeInTheDocument();

    const openBtn = within(projectsSection).getByRole("button", {
      name: /open case study for customer intelligence/i,
    });
    fireEvent.click(openBtn);

    const dialog = await screen.findByRole("dialog", {
      name: /customer intelligence & banner ranking engine/i,
    });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("42.4M / 3.02M")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("link", { name: /^full page$/i })
    ).toHaveAttribute("href", "/projects/customer-intelligence");

    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", {
          name: /customer intelligence & banner ranking engine/i,
        })
      ).not.toBeInTheDocument();
    });
  });

  it("opens interactive hero desk popovers and SUTT cohort playbook tabs", async () => {
    renderApp();

    const globeProp = screen.getByRole("button", {
      name: /desk globe & badminton racket/i,
    });
    expect(
      screen.getByRole("button", { name: /mini nintendo console/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/hard tetris/i)).not.toBeInTheDocument();
    fireEvent.click(globeProp);

    const globeDialog = screen.getByRole("dialog", {
      name: /interests, impact & off-clock/i,
    });
    expect(globeDialog).toBeInTheDocument();

    fireEvent.click(
      within(globeDialog).getByRole("button", { name: /close desk note/i })
    );
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", {
          name: /interests, impact & off-clock/i,
        })
      ).not.toBeInTheDocument();
    });

    const lowBalanceTab = screen.getByRole("button", {
      name: /low-balance drop-off segment/i,
    });
    fireEvent.click(lowBalanceTab);
    expect(
      screen.getByText(/timely low-balance recharge nudges/i)
    ).toBeInTheDocument();
  });

  it("cross-links skills in the workbench to verified projects", () => {
    renderApp();

    const skillsSection = screen.getByRole("region", {
      name: /tools i actually ship with/i,
    });

    const duckdbBtn = within(skillsSection).getByRole("button", {
      name: "SQL & DuckDB",
    });
    fireEvent.click(duckdbBtn);

    expect(
      within(skillsSection).getByRole("heading", {
        level: 3,
        name: "SQL & DuckDB",
      })
    ).toBeInTheDocument();
    expect(
      within(skillsSection).getByRole("button", {
        name: /Customer Intelligence/i,
      })
    ).toBeInTheDocument();
  });

  it("starts Tetris, applies custom presets, and toggles mute safely", async () => {
    renderApp();

    expect(
      screen.getByRole("heading", { level: 2, name: /play fun game tetris/i })
    ).toBeInTheDocument();

    const blindBtn = await screen.findByRole("button", { name: /^Blind Drop/i });
    fireEvent.click(blindBtn);
    expect(screen.getByText(/1\.20x Score Multiplier/i)).toBeInTheDocument();

    const expSection = screen.getByRole("region", {
      name: /where i've shipped, analysed & led/i,
    });
    const workBadges = within(expSection).getAllByText("Work");
    expect(workBadges.length).toBe(2);
    for (const badge of workBadges) {
      expect(badge.parentElement).toHaveClass("bg-[var(--accent-green-soft)]");
    }
    const leadershipNodes = within(expSection).getAllByText("Leadership");
    expect(
      leadershipNodes.some((node) =>
        node.parentElement?.classList.contains("bg-[var(--accent-orange-soft)]")
      )
    ).toBe(true);
    const impactBadges = within(expSection).getAllByText("Impact");
    expect(impactBadges.length).toBe(2);
    for (const badge of impactBadges) {
      expect(badge.parentElement).toHaveClass("bg-[var(--accent-blue-soft)]");
    }

    const startBtn = screen.getByRole("button", { name: /start tetris/i });
    fireEvent.click(startBtn);

    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();

    const muteBtn = screen.getByRole("button", {
      name: /mute sound effects/i,
    });
    fireEvent.click(muteBtn);
    expect(
      screen.getByRole("button", { name: /unmute sound effects/i })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("sanitizes contact inputs, validates empty submissions, and prepares Gmail + mailto compose drafts", () => {
    expect(sanitizeField("  Hello\n\rWorld\t! ", 40)).toBe("Hello World !");
    const mailHref = buildMailtoHref(
      profileConfig.email,
      "Test Subject",
      "Message body"
    );
    expect(mailHref.startsWith(`mailto:${profileConfig.email}?`)).toBe(true);

    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    renderApp();

    const heroEmailLink = screen.getByRole("link", { name: "Email" });
    expect(heroEmailLink.getAttribute("href")).toContain("mail.google.com/mail/");

    const emailMeLink = screen.getByRole("link", { name: /email me/i });
    expect(emailMeLink.getAttribute("href")).toContain("mail.google.com/mail/");

    fireEvent.click(screen.getByRole("button", { name: /compose email/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/at least 4 characters/i);

    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Hi Bhavya, excited to connect about ML engineering." },
    });
    fireEvent.click(screen.getByRole("button", { name: /compose email/i }));

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("mail.google.com/mail/"),
      "_blank",
      "noopener,noreferrer"
    );
    expect(screen.getByRole("status")).toHaveTextContent(/gmail draft opened/i);
    expect(SITE_URL).toBe("https://www.bhavya.me");
  });
});
