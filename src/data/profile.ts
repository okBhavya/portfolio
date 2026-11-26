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
  interests: string[];
  courses: string[];
  aboutNotes: {
    id: string;
    title: string;
    eyebrow: string;
    body: string;
    highlight: string;
  }[];
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
      description: "Best way to reach me for collaborations, ideas, or engineering chats.",
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
      description: "Full repositories, benchmark suites, tests, and architecture docs.",
    },
    {
      id: "instagram",
      label: "Instagram",
      handle: "@bhavya_g27",
      href: "https://www.instagram.com/bhavya_g27/",
      description: "Campus life at BITS Pilani, travel notes, and off-screen moments.",
    },
  ],
  interests: [
    "Artificial Intelligence & Machine Learning",
    "Applied AI & LLM Applications",
    "Product Engineering & Product Management",
    "Data Science & Causal Analytics",
    "Human-Computer Interaction & Trust UX",
    "Startups, Entrepreneurship & Climate Tech",
    "Badminton, Campus Fests & Teaching Math",
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
  aboutNotes: [
    {
      id: "study",
      eyebrow: "01 / What I Study",
      title: "Computer Science at BITS Pilani (2023–2027)",
      body: "I'm pursuing my B.E. in Computer Science Engineering in Pilani—balancing core systems, databases, and probability with hands-on research in continual reinforcement learning, world models, and applied LLMs.",
      highlight: "Theory matters most when you test whether it survives messy real data.",
    },
    {
      id: "build",
      eyebrow: "02 / What I Enjoy Building",
      title: "Systems That Are Both Rigorous and Usable",
      body: "Whether it's writing atomic Redis Lua scripts for a task queue engine, calibrating LightGBM propensity scores across 42M events, or shipping a Chrome Shadow DOM overlay that makes AI assistants easier to trust—I like owning the full arc from math to product UX.",
      highlight: "Good engineering disappears into a product people genuinely want to use.",
    },
    {
      id: "approach",
      eyebrow: "03 / How I Approach Problems",
      title: "Measure First, Question Assumptions, Ship Fast",
      body: "You'll see a pattern across my repos: evaluation harnesses, leakage audits, ablation studies, and chaos tests. Before claiming something works, I like proving where it breaks—and then framing the product trade-off clearly.",
      highlight: "Curiosity starts the notebook; discipline makes the benchmark reproducible.",
    },
    {
      id: "life",
      eyebrow: "04 / Beyond the Terminal",
      title: "Campus Leadership, Teaching & Sport",
      body: "Outside code, I've led a 45-member alumni fundraising team for BOSM, spent two years teaching Class 12 mathematics to local students in Pilani through NSS, prototyped climate-tech crop advisory in 48 hours, and happily lose track of time on a badminton court.",
      highlight: "Technology only feels exciting when it connects back to people.",
    },
  ],
};

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://bhavyagupta.dev";
