export type AvailabilityMode = "building" | "seeking" | "custom";

export interface AvailabilityConfig {
  mode: AvailabilityMode;
  labels: Record<AvailabilityMode, string>;
  detail: string;
}

export interface SocialLink {
  id: "email" | "linkedin" | "github" | "instagram";
  label: string;
  handle: string;
  href: string;
  description: string;
}

export interface ProblemStep {
  id: string;
  step: string;
  shortTitle: string;
  title: string;
  summary: string;
  checkQuestion: string;
  proofExample: string;
  accent: "orange" | "green" | "blue" | "mustard";
}

export interface ProfileConfig {
  name: string;
  firstName: string;
  tagline: string;
  heroGreeting: string;
  heroHeadline: string;
  heroSupporting: string;
  positioningStatement: string;
  email: string;
  location: string;
  education: {
    institution: string;
    shortName: string;
    degree: string;
    period: string;
    location: string;
  };
  availability: AvailabilityConfig;
  socials: SocialLink[];
  courses: string[];
  problemApproachIntro: string;
  problemApproachFlow: ProblemStep[];
}

const envAvailability = process.env.NEXT_PUBLIC_AVAILABILITY_MODE;
const resolvedMode: AvailabilityMode =
  envAvailability === "seeking" || envAvailability === "custom"
    ? envAvailability
    : "building";

export const profileConfig: ProfileConfig = {
  name: "Bhavya Gupta",
  firstName: "Bhavya",
  tagline: "AI, Engineering & Product",
  heroGreeting: "Hey, I'm Bhavya.",
  heroHeadline:
    "I build things at the intersection of AI, engineering, and product.",
  heroSupporting: "Computer Science student at BITS Pilani.",
  positioningStatement:
    "I build intelligent systems, explore ideas, and turn complex problems into products people can actually use.",
  email: "f20230494@pilani.bits-pilani.ac.in",
  location: "Pilani, India",
  education: {
    institution: "Birla Institute of Technology and Science, Pilani",
    shortName: "BITS Pilani",
    degree: "B.E. Computer Science Engineering",
    period: "August 2023 – May 2027",
    location: "Pilani, India",
  },
  availability: {
    mode: resolvedMode,
    labels: {
      building: "BITS Pilani '27 · Building & Researching",
      seeking: "Open to AI, SWE & Product Internships / Roles",
      custom: "Always happy to chat about interesting builds",
    },
    detail:
      "Configurable status (via NEXT_PUBLIC_AVAILABILITY_MODE) — currently set to honest builder mode unless toggled.",
  },
  socials: [
    {
      id: "email",
      label: "Email",
      handle: "f20230494@pilani.bits-pilani.ac.in",
      href: "mailto:f20230494@pilani.bits-pilani.ac.in",
      description:
        "Best way to reach me for collaborations, ideas, or engineering chats.",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      handle: "in/bhavya-gupta-5122861ba",
      href: "https://www.linkedin.com/in/bhavya-gupta-5122861ba/",
      description: "Experience timeline, product work, and campus leadership.",
    },
    {
      id: "github",
      label: "GitHub",
      handle: "@okBhavya",
      href: "https://github.com/okBhavya",
      description:
        "Full repositories, benchmark suites, tests, and architecture docs.",
    },
    {
      id: "instagram",
      label: "Instagram",
      handle: "@bhavya_g27",
      href: "https://www.instagram.com/bhavya_g27/",
      description:
        "Campus life at BITS Pilani, travel notes, and off-screen moments.",
    },
  ],
  courses: [
    "Data Structures & Algorithms",
    "Algorithms",
    "Object-Oriented Programming",
    "Database Management",
    "Computer Networks",
    "Deep Learning",
    "Reinforcement Learning",
    "Human-Computer Interaction",
  ],
  problemApproachIntro:
    "Before touching architectures or interfaces, I map what actually breaks in the real world—who uses the output, where messy data leaks future information, and what an error costs. Every project follows this repeatable loop from problem framing to shipped product.",
  problemApproachFlow: [
    {
      id: "frame",
      step: "01",
      shortTitle: "Frame Constraint",
      title: "1. Frame User Pain & Hard Constraints",
      summary:
        "Translate vague goals into explicit decision metrics, latency budgets, and failure costs before writing modeling or UI code.",
      checkQuestion:
        "What real decision changes if this output improves, and what bug or latency budget makes it unusable?",
      proofExample:
        "SU App churn economics (₹12 Cr+ spend), 100 ms (10 Hz) MPC budget, and strict study-consent rules in CalibrAI.",
      accent: "orange",
    },
    {
      id: "audit",
      step: "02",
      shortTitle: "Audit & Baseline",
      title: "2. Audit Data Integrity & Build a Simple Baseline",
      summary:
        "Clean raw schemas, prevent temporal/target leakage, and benchmark a fast deterministic or linear baseline as the floor to beat.",
      checkQuestion:
        "Do time splits hold without future leaks, and how far does a simple heuristic already go?",
      proofExample:
        "SQL-vs-pandas parity checks across 42.4M eCommerce events in DuckDB; Stanley PID & Naive Replay baselines.",
      accent: "blue",
    },
    {
      id: "ablate",
      step: "03",
      shortTitle: "Build & Ablate",
      title: "3. Prototype Modular Systems & Run Ablations",
      summary:
        "Iterate cleanly separated components and verify each architectural piece with controlled ablations instead of stacking blind complexity.",
      checkQuestion:
        "Which mechanism actually moves the metric when everything else is held constant?",
      proofExample:
        "Dual-pol VV+VH SAR (+0.08 flood IoU), Orthogonal Projection vs. Parseval regularization, and explicit MPC safety constraints.",
      accent: "green",
    },
    {
      id: "stress",
      step: "04",
      shortTitle: "Break It First",
      title: "4. Adversarial, Chaos & Failure-Mode Testing",
      summary:
        "Actively hunt edge cases—kill worker processes mid-task, shuffle target labels, test altered citations, and inspect unseen layouts.",
      checkQuestion:
        "Where does this degrade under distribution shift, process crashes, or adversarial inputs?",
      proofExample:
        "SIGKILL worker chaos suite in Task Queue Engine (0.047% failure rate) & hallucination-blocking tests in PlanPilot.",
      accent: "mustard",
    },
    {
      id: "ship",
      step: "05",
      shortTitle: "Ship & Iterate",
      title: "5. Package Usable Product & Measure Impact",
      summary:
        "Wrap verified systems in fast, intuitive interfaces and measure downstream adoption with calibrated experiments—then feed insights back to Step 01.",
      checkQuestion:
        "Can non-specialists inspect, trust, and act on the output immediately without manual babysitting?",
      proofExample:
        "Streamlit monitoring dashboards across 40,000+ schools at KITE, Shadow DOM overlays, and CUPED A/B power sizing.",
      accent: "orange",
    },
  ],
};

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://bhavya-gupta-portfolio-eta.vercel.app";
