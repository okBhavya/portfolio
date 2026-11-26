export interface SkillItem {
  name: string;
  detail: string;
  usedInProjects: string[];
  usedInExperience: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  accent: "terracotta" | "forest" | "mustard" | "slate";
  skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "programming-data",
    title: "Programming & Data",
    subtitle: "Languages, query engines, and analytical storage",
    accent: "terracotta",
    skills: [
      {
        name: "Python",
        detail: "Production ML pipelines, asyncio systems, fast CLI & backend tooling.",
        usedInProjects: [
          "world-models-mpc",
          "planpilot",
          "distributed-task-queue",
          "customer-segmentation",
          "continual-learning",
          "flood-mapping",
        ],
        usedInExperience: ["kite", "sutt"],
      },
      {
        name: "SQL & DuckDB",
        detail: "Zero-copy analytical feature layers across 42.4M events & ERP CSV profiling.",
        usedInProjects: ["customer-segmentation", "planpilot"],
        usedInExperience: ["sutt"],
      },
      {
        name: "TypeScript",
        detail: "Strict typed browser extensions, React apps, and frontend interfaces.",
        usedInProjects: ["calibrai", "internship-hunter"],
        usedInExperience: [],
      },
      {
        name: "PostgreSQL & DBMS",
        detail: "Durable event sourcing, Alembic migrations, relational schemas & indexing.",
        usedInProjects: ["distributed-task-queue", "planpilot", "calibrai"],
        usedInExperience: ["kite"],
      },
      {
        name: "Redis (Lua & Streams)",
        detail: "Atomic ZSET scheduling, lease fencing, XREADGROUP streams, Arq queues.",
        usedInProjects: ["distributed-task-queue", "planpilot"],
        usedInExperience: [],
      },
      {
        name: "Probability & Statistics",
        detail: "Bootstrap CIs, CUPED variance reduction, power sizing, calibration & ECE.",
        usedInProjects: ["customer-segmentation", "world-models-mpc", "calibrai"],
        usedInExperience: ["sutt", "nss"],
      },
    ],
  },
  {
    id: "ml-rl",
    title: "Machine Learning & RL",
    subtitle: "Deep learning, tabular modeling, control, and optimization",
    accent: "forest",
    skills: [
      {
        name: "PyTorch",
        detail: "Neural dynamics world models, continual RL policies, and ResNet U-Nets.",
        usedInProjects: ["world-models-mpc", "continual-learning", "flood-mapping"],
        usedInExperience: [],
      },
      {
        name: "Scikit-learn & LightGBM",
        detail: "K-Means cohort clustering, calibrated propensity classifiers, LambdaRank.",
        usedInProjects: ["customer-segmentation"],
        usedInExperience: ["sutt", "kite"],
      },
      {
        name: "Gymnasium & MetaDrive",
        detail: "Continuous control curricula, receding-horizon MPC & closed-loop rollouts.",
        usedInProjects: ["continual-learning", "world-models-mpc"],
        usedInExperience: [],
      },
      {
        name: "Google OR-Tools (CP-SAT)",
        detail: "Constraint programming for industrial scheduling & feasibility checks.",
        usedInProjects: ["planpilot"],
        usedInExperience: [],
      },
      {
        name: "Rasterio & SNAP (gpt)",
        detail: "Sentinel-1/2 dual-polarization SAR preprocessing and geospatial tiling.",
        usedInProjects: ["flood-mapping"],
        usedInExperience: ["climatetech"],
      },
    ],
  },
  {
    id: "llms-rag",
    title: "LLMs, Agents & RAG",
    subtitle: "Retrieval systems, structured copilot grounding, and local inference",
    accent: "mustard",
    skills: [
      {
        name: "LLM & RAG Pipelines",
        detail: "Retrieval-augmented policy assistants and grounded reasoning workflows.",
        usedInProjects: ["planpilot", "calibrai"],
        usedInExperience: ["kite"],
      },
      {
        name: "LangChain & Ollama",
        detail: "Prompt orchestration and local open-weight model experimentation.",
        usedInProjects: ["planpilot"],
        usedInExperience: ["kite"],
      },
      {
        name: "FAISS & Pinecone",
        detail: "Dense vector indexing for fast policy-document retrieval.",
        usedInProjects: [],
        usedInExperience: ["kite"],
      },
      {
        name: "Grounded Verification",
        detail: "5-stage rule compilers and regex citation checks preventing hallucinations.",
        usedInProjects: ["planpilot", "calibrai"],
        usedInExperience: [],
      },
    ],
  },
  {
    id: "product-analytics",
    title: "Product & Analytics",
    subtitle: "Connecting user behavior directly to business outcomes",
    accent: "terracotta",
    skills: [
      {
        name: "RFM & Cohort Segmentation",
        detail: "Behavioral clustering across 5,000+ students (₹12 Cr+ spend) and 3M users.",
        usedInProjects: ["customer-segmentation"],
        usedInExperience: ["sutt"],
      },
      {
        name: "A/B Testing & CUPED",
        detail: "MDE power sizing, retention test design, and pre-period variance reduction.",
        usedInProjects: ["customer-segmentation"],
        usedInExperience: ["sutt"],
      },
      {
        name: "Propensity & Churn Modeling",
        detail: "Logistic regression & GBDT models targeting low-balance & repeat-use drops.",
        usedInProjects: ["customer-segmentation"],
        usedInExperience: ["sutt"],
      },
      {
        name: "Counterfactual Eval (SNIPS)",
        detail: "Self-Normalized Inverse Propensity Scoring & offline EV policy simulation.",
        usedInProjects: ["customer-segmentation"],
        usedInExperience: [],
      },
    ],
  },
  {
    id: "engineering-prototyping",
    title: "Frontend, APIs & Testing",
    subtitle: "Turning models and backends into fast, reliable products",
    accent: "slate",
    skills: [
      {
        name: "FastAPI & Pydantic",
        detail: "Typed REST APIs, rate limiting, HMAC auth tokens, and OpenAPI schemas.",
        usedInProjects: [
          "distributed-task-queue",
          "planpilot",
          "calibrai",
          "internship-hunter",
        ],
        usedInExperience: [],
      },
      {
        name: "React, Next.js & WXT (MV3)",
        detail: "Interactive web apps, Shadow DOM Chrome extensions, and custom UI craft.",
        usedInProjects: ["calibrai", "internship-hunter"],
        usedInExperience: [],
      },
      {
        name: "Streamlit",
        detail: "Rapid policy dashboards, live queue telemetry, and ML demo workspaces.",
        usedInProjects: [
          "distributed-task-queue",
          "planpilot",
          "customer-segmentation",
          "flood-mapping",
        ],
        usedInExperience: ["kite"],
      },
      {
        name: "Docker, Pytest & Vitest",
        detail: "Multi-container Compose stacks, chaos tests, leakage audits & CI checks.",
        usedInProjects: [
          "distributed-task-queue",
          "planpilot",
          "customer-segmentation",
          "continual-learning",
          "calibrai",
          "world-models-mpc",
        ],
        usedInExperience: [],
      },
    ],
  },
];
