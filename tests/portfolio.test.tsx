import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { PortfolioApp } from "@/components/PortfolioApp";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  buildMailtoHref,
  sanitizeField,
} from "@/components/sections/ContactSection";
import { profileConfig } from "@/data/profile";
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
    expect(projects.filter((p) => p.featured)).toHaveLength(6);
    expect(experiences).toHaveLength(5);
  });

  it("toggles Day and Night desk lamp theme", () => {
    renderApp();
    const toggle = screen.getByRole("button", {
      name: /switch to late-night study lamp mode/i,
    });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute("data-theme")).toBe("night");
    expect(
      screen.getByRole("button", {
        name: /switch to warm daylight paper mode/i,
      })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("filters projects by category and opens/closes a detailed case study modal", async () => {
    renderApp();

    const projectsSection = screen.getByRole("region", {
      name: /experiments & systems i've built/i,
    });

    const systemsFilter = within(projectsSection).getByRole("button", {
      name: "Systems Engineering",
    });
    fireEvent.click(systemsFilter);

    expect(
      within(projectsSection).getByRole("heading", {
        level: 3,
        name: "Task Queue Engine",
      })
    ).toBeInTheDocument();
    expect(
      within(projectsSection).queryByRole("heading", {
        level: 3,
        name: "World Models & MPC",
      })
    ).not.toBeInTheDocument();

    const openBtn = within(projectsSection).getByRole("button", {
      name: /open case study for tqe/i,
    });
    fireEvent.click(openBtn);

    const dialog = screen.getByRole("dialog", {
      name: /tqe — distributed task queue engine/i,
    });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("30,149.5/min")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", {
          name: /tqe — distributed task queue engine/i,
        })
      ).not.toBeInTheDocument();
    });
  });

  it("opens interactive hero desk popovers and SUTT cohort playbook tabs", async () => {
    renderApp();

    const globeProp = screen.getByRole("button", {
      name: /desk globe — explore interests/i,
    });
    fireEvent.click(globeProp);

    const globeDialog = screen.getByRole("dialog", {
      name: /real-world problems & global curiosity/i,
    });
    expect(globeDialog).toBeInTheDocument();

    fireEvent.click(
      within(globeDialog).getByRole("button", { name: /close desk note/i })
    );
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", {
          name: /real-world problems & global curiosity/i,
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

  it("starts Byte Runner game and toggles mute safely", () => {
    renderApp();

    const startBtn = screen.getByRole("button", { name: /start run/i });
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

  it("sanitizes contact inputs and validates empty submissions", () => {
    expect(sanitizeField("  Hello\n\rWorld\t! ", 40)).toBe("Hello World !");
    const mailHref = buildMailtoHref(
      profileConfig.email,
      "Test Subject",
      "Message body"
    );
    expect(mailHref.startsWith(`mailto:${profileConfig.email}?`)).toBe(true);

    renderApp();
    fireEvent.click(screen.getByRole("button", { name: /compose email/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/at least 4 characters/i);
  });
});
