export type ProjectCategory =
  | "AI / ML"
  | "Systems Engineering"
  | "Data Science"
  | "Product / Tools";

export interface ProjectMetric {
  label: string;
  value: string;
  context?: string;
}

export interface ProjectMedia {
  src: string;
  alt: string;
  caption: string;
  isAnimated?: boolean;
  mediaKind?: "video" | "chart" | "diagram";
  videoMp4?: string;
  videoWebm?: string;
  posterSrc?: string;
  width?: number;
  height?: number;
}

export interface ArchitectureNode {
  step: string;
  title: string;
  detail: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  categories: ProjectCategory[];
  featured: boolean;
  repoUrl: string;
  liveDemoUrl?: string;
  statusNote?: string;
  problem: string;
  whatIBuilt: string;
  architectureSummary: string;
  architecturePipeline: ArchitectureNode[];
  technologies: string[];
  metrics: ProjectMetric[];
  media: ProjectMedia[];
  highlights: string[];
  sketchType: "mpc" | "planpilot" | "tqe" | "segmentation" | "continual" | "calibrai" | "flood" | "hunter";
}

export const projectCategories: ("All" | ProjectCategory)[] = [
  "All",
  "AI / ML",
  "Systems Engineering",
  "Data Science",
  "Product / Tools",
];

export const projects: ProjectItem[] = [
  {
    id: "world-models-mpc",
    slug: "world-models",
    title: "Action-Conditioned World Models & Predictive Control",
    shortTitle: "World Models & MPC",
    tagline:
      "Neural dynamics rollouts powering real-time, constraint-safe Model Predictive Control for autonomous driving in MetaDrive.",
    categories: ["AI / ML"],
    featured: true,
    repoUrl:
      "https://github.com/okBhavya/Action-Conditioned-World-Models-Predictive-Control-for-Autonomous-Driving",
    problem:
      "Autonomous driving controllers have to anticipate how steering and throttle compound over multi-second horizons without leaving the road or colliding. Purely reactive controllers struggle on unseen curves, while open-loop neural rollouts accumulate quadratic drift.",
    whatIBuilt:
      "Built an end-to-end world-model and receding-horizon MPC framework in PyTorch and MetaDrive. Trained a body-frame neural dynamics model on offline driving trajectories and paired it with a 10 Hz sampling MPC planner enforcing four explicit safety constraints.",
    architectureSummary:
      "At each 0.1s control step, the ego dynamic state [v_long, v_lat, yaw_rate, steering] is rolled forward across N=256 temporally smoothed candidate action sequences over H=10 steps via a 3-layer SiLU MLP predicting local deltas, then filtered through hard safety constraints before applying u_0*.",
    architecturePipeline: [
      {
        step: "01",
        title: "Ego Body-Frame State",
        detail: "Extracts [v_long, v_lat, yaw_rate, steer] invariant to global map rotation.",
      },
      {
        step: "02",
        title: "Batch World-Model Rollout",
        detail: "3-layer SiLU MLP (256 units) rolls out N=256 trajectories for H=10 steps on CPU.",
      },
      {
        step: "03",
        title: "4 Explicit Safety Filters",
        detail: "Road boundary margin, 14 m/s speed cap, 3.5 m obstacle clearance, 6 s⁻¹ steer rate.",
      },
      {
        step: "04",
        title: "Receding-Horizon MPC",
        detail: "Selects min-cost feasible sequence at 10 Hz (56 ms/step) with braking fallback.",
      },
    ],
    technologies: [
      "PyTorch",
      "MetaDrive Simulator",
      "Gymnasium",
      "Model Predictive Control",
      "NumPy",
      "Pytest",
    ],
    metrics: [
      {
        label: "Unseen Seeds Success",
        value: "80.0%",
        context: "vs 20.0% Stanley PID baseline",
      },
      {
        label: "Route Completion",
        value: "88.1%",
        context: "vs 55.8% Stanley PID",
      },
      {
        label: "Traffic Collision Rate",
        value: "0.0%",
        context: "with explicit safety constraints",
      },
      {
        label: "CPU Planning Latency",
        value: "56.0 ms",
        context: "well below 100 ms (10 Hz) real-time cap",
      },
    ],
    media: [
      {
        src: "/projects/world-models/demo-poster.png",
        videoMp4: "/projects/world-models/demo.mp4",
        videoWebm: "/projects/world-models/demo.webm",
        posterSrc: "/projects/world-models/demo-poster.png",
        alt: "Top-down closed-loop MPC rollout in MetaDrive simulator",
        caption: "Closed-loop MPC top-down rollout on procedural curve map SC.",
        isAnimated: true,
        mediaKind: "video",
        width: 690,
        height: 310,
      },
      {
        src: "/projects/world-models/benchmark_comparison.png",
        alt: "Controller benchmark comparison chart",
        caption: "Closed-loop benchmark across unseen seeds, unseen layouts, and dynamic traffic.",
        mediaKind: "chart",
        width: 2250,
        height: 675,
      },
      {
        src: "/projects/world-models/prediction_error_growth.png",
        alt: "Autoregressive prediction error growth from 1 to 20 steps",
        caption: "Open-loop error growth (0.022 m at 1 step -> 0.635 m at 10 steps), mitigated by 10 Hz replanning.",
        mediaKind: "chart",
        width: 1650,
        height: 675,
      },
      {
        src: "/projects/world-models/ablation_a_safety.png",
        alt: "Ablation chart showing impact of explicit safety constraints",
        caption: "Ablation A: Explicit safety constraints halve out-of-road rate (20% vs 40%).",
        mediaKind: "chart",
        width: 1050,
        height: 675,
      },
    ],
    highlights: [
      "1-step position error of 0.022 m (2.2 cm) and 0.12° heading error across 686 held-out transitions.",
      "Explicit safety constraints halved out-of-road incidents in traffic (40.0% -> 20.0%).",
      "Includes failure-case diagnostics across unseen roundabouts, T-junctions, and dense traffic.",
    ],
    sketchType: "mpc",
  },
  {
    id: "flood-mapping",
    slug: "planet-sentinel",
    title: "Flood Extent Mapping from Satellite Imagery",
    shortTitle: "Planet Sentinel",
    tagline:
      "ResNet-encoder U-Net processing Sentinel-1/2 dual-polarization SAR data to map monsoon flood extent across 3,656 km².",
    categories: ["AI / ML", "Data Science"],
    featured: true,
    repoUrl: "https://github.com/okBhavya/Planet-Sentinal",
    statusNote:
      "Metrics verified from resume; the GitHub repository currently contains an initial readme stub while code packaging is pending.",
    problem:
      "Optical satellite imagery is blinded by thick cloud cover precisely when monsoon floods peak, delaying rapid situational mapping for district disaster response.",
    whatIBuilt:
      "Built an end-to-end Sentinel-1/2 flood segmentation pipeline using SNAP (gpt) preprocessing, Rasterio chip extraction, and a ResNet-encoder U-Net trained on dual-polarization (VV+VH) SAR imagery with an interactive Streamlit demo.",
    architectureSummary:
      "Preprocessed Sentinel-1/2 scenes via SNAP into 4,831 calibrated image chips across 11 historical flood events, trained a ResNet-encoder U-Net fusing VV+VH channels, and ran inference over Chhatarpur during the 2026 monsoon.",
    architecturePipeline: [
      {
        step: "01",
        title: "SNAP (gpt) & Rasterio",
        detail: "Calibrated Sentinel-1/2 scenes into 4,831 tiled chips across 11 flood events.",
      },
      {
        step: "02",
        title: "Dual-Pol VV+VH Features",
        detail: "Combined vertical-vertical and vertical-horizontal SAR channels (+0.08 IoU).",
      },
      {
        step: "03",
        title: "ResNet-Encoder U-Net",
        detail: "Semantic segmentation improved flood IoU from 0.42 baseline to 0.71.",
      },
      {
        step: "04",
        title: "Chhatarpur Monsoon Demo",
        detail: "Mapped 3,656 km² of flooded terrain in an interactive Streamlit explorer.",
      },
    ],
    technologies: ["PyTorch", "Rasterio", "SNAP (gpt)", "Sentinel-1/2", "Streamlit"],
    metrics: [
      {
        label: "Flood IoU Score",
        value: "0.71 (from 0.42)",
        context: "+0.08 IoU contribution from dual-pol VV+VH",
      },
      {
        label: "Training Dataset",
        value: "4,831 chips",
        context: "Across 11 distinct flood events",
      },
      {
        label: "Mapped Monsoon Area",
        value: "3,656 km²",
        context: "Chhatarpur 2026 monsoon deployment demo",
      },
    ],
    media: [],
    highlights: [
      "Demonstrates end-to-end geospatial ML pipeline from SAR radar calibration to actionable flood maps.",
    ],
    sketchType: "flood",
  },
  {
    id: "distributed-task-queue",
    slug: "task-queue-engine",
    title: "TQE — Distributed Task Queue Engine",
    shortTitle: "Task Queue Engine",
    tagline:
      "High-throughput, fault-tolerant distributed task queue built from scratch with atomic Redis Lua scripts and PostgreSQL event sourcing.",
    categories: ["Systems Engineering"],
    featured: true,
    repoUrl: "https://github.com/okBhavya/Distributed-Task-Queue-Engine",
    problem:
      "Off-the-shelf task queues abstract away hard distributed-systems trade-offs: race conditions during lease expiry, duplicate retries, Redis memory loss, and bloated worker processes.",
    whatIBuilt:
      "Built an entire distributed task queue engine from first principles—no Celery, RQ, or Dramatiq. Implemented 10 atomic Redis Lua state transitions, cryptographic lease-fencing tokens, dual-write PostgreSQL event sourcing, leader-elected recovery, a FastAPI control plane, and a sub-second Streamlit telemetry UI.",
    architectureSummary:
      "Clients submit jobs via FastAPI (dual-writing Postgres + atomic Redis enqueue). Lean asyncio workers (42.94 MB RSS) claim tasks via Lua scripts using IEEE 754 exact float64 priority scores (P*10^14 + T) and lease tokens, while a Redis Streams Persister batches lifecycle events to Postgres and a leader-elected Scheduler reaps expired leases and reconciles cold restarts.",
    architecturePipeline: [
      {
        step: "01",
        title: "Dual-Write API Gateway",
        detail: "FastAPI validates idempotency keys, writes Postgres audit truth, and calls atomic enqueue Lua.",
      },
      {
        step: "02",
        title: "10 Atomic Redis Lua Scripts",
        detail: "Single-roundtrip ZSET transitions using server TIME and float64 priority+FIFO scoring.",
      },
      {
        step: "03",
        title: "Lease-Fenced Worker Fleet",
        detail: "42.94 MB RSS asyncio workers; graceful SIGTERM release preserves retry budgets.",
      },
      {
        step: "04",
        title: "Persister & Leader Reconciler",
        detail: "XREADGROUP consumer batches events to Postgres; Reconciler recovers from Redis FLUSHALL.",
      },
    ],
    technologies: [
      "Python 3.12 (asyncio)",
      "Redis + Lua Scripts",
      "PostgreSQL + Alembic",
      "FastAPI",
      "Docker Compose",
      "Streamlit",
      "Hypothesis & Chaos Tests",
    ],
    metrics: [
      {
        label: "Sustained Throughput",
        value: "30,149.5/min",
        context: "502.5 jobs/sec (3.0x over 10k target)",
      },
      {
        label: "Chaos Failure Rate",
        value: "0.047%",
        context: "Under SIGKILL worker chaos testing",
      },
      {
        label: "Telemetry Latency (p99)",
        value: "14.52 ms",
        context: "Pipelined Redis stats snapshot",
      },
      {
        label: "Crash Recovery / RSS",
        value: "2.10 s / 42.9 MB",
        context: "100% (15/15) poison-job DLQ isolation",
      },
    ],
    media: [],
    highlights: [
      "50+ worker containers run comfortably on a single laptop thanks to strict worker import isolation.",
      "48 passing unit, integration, and chaos tests verifying lease fencing, redelivery, and DLQ isolation.",
      "Zero burned retries on graceful shutdown by decrementing attempt counts when releasing in-flight jobs.",
    ],
    sketchType: "tqe",
  },
  {
    id: "customer-segmentation",
    slug: "customer-intelligence",
    title: "Customer Intelligence & Banner Ranking Engine",
    shortTitle: "Customer Intelligence",
    tagline:
      "Behavioral segmentation, calibrated propensity scoring, LambdaRank personalization, and CUPED A/B design across 42.4M eCommerce events.",
    categories: ["Data Science", "AI / ML"],
    featured: true,
    repoUrl: "https://github.com/okBhavya/Customer-Segmentation",
    problem:
      "Standard RFM heuristics collapse on zero-inflated browse-heavy storefronts (where 80%+ of visitors spend $0), while naive promotional targeting wastes contact budget and observational click logs suffer from heavy popularity bias.",
    whatIBuilt:
      "Built an out-of-time customer decisioning pipeline processing 42.4M REES46 eCommerce events (3.02M users) in DuckDB. Engineered 48 leakage-free temporal features, segmented users with K-Means (k=7), trained calibrated LightGBM purchase/churn models, ranked 239 category banners with LambdaRank + SNIPS counterfactual evaluation, and sized CUPED-accelerated experiments.",
    architectureSummary:
      "Raw CSV events become typed Parquet in DuckDB, feeding strict 10-day lookback / 7-day forward snapshots. Segments and calibrated LightGBM probabilities drive an expected-value Next-Best-Action simulator that withholds treatments when expected lift cannot cover marginal contact cost.",
    architecturePipeline: [
      {
        step: "01",
        title: "DuckDB Ingest & SQL Layer",
        detail: "Cleaned 42.4M events (3.02M users) into 48 leakage-audited temporal features.",
      },
      {
        step: "02",
        title: "K-Means & Calibrated GBDT",
        detail: "7 behavioral archetypes + isotonic/sigmoid calibrated LightGBM propensity models.",
      },
      {
        step: "03",
        title: "LambdaRank + SNIPS",
        detail: "239 category banner ranking with clipped Inverse Propensity Scoring.",
      },
      {
        step: "04",
        title: "NBA Policy & CUPED Sizing",
        detail: "Expected-value treatment gating + 17.11% CUPED variance reduction sizing.",
      },
    ],
    technologies: [
      "DuckDB",
      "Python",
      "LightGBM",
      "Scikit-learn",
      "Statsmodels",
      "Optuna",
      "Streamlit",
      "Pytest",
    ],
    metrics: [
      {
        label: "Events / Users Processed",
        value: "42.4M / 3.02M",
        context: "165,647 items across 239 category banners",
      },
      {
        label: "Churn ROC-AUC Lift",
        value: "0.682 vs 0.519",
        context: "5.5x forward purchase R² lift over RFM",
      },
      {
        label: "Simulated NBA Value",
        value: "+$310,266",
        context: "Net incremental EV over segment heuristics",
      },
      {
        label: "Banner NDCG@10 / CUPED",
        value: "+2.58% / -17.1% var",
        context: "178,706 users/arm A/B power sizing",
      },
    ],
    media: [
      {
        src: "/projects/customer-seg/segment_outcomes.png",
        alt: "Behavioral customer segment outcomes across 7 K-Means clusters",
        caption: "Seven K-Means customer archetypes validated out-of-time (Power Buyers drive 47.4% of test revenue).",
        mediaKind: "chart",
        width: 1784,
        height: 1482,
      },
      {
        src: "/projects/customer-seg/nba_policy_simulation.png",
        alt: "Next-Best-Action expected value policy simulation chart",
        caption: "Model EV policy delivers $3.01M simulated EV by suppressing unprofitable contacts.",
        mediaKind: "chart",
        width: 1350,
        height: 750,
      },
      {
        src: "/projects/customer-seg/banner_ranking_ndcg.png",
        alt: "Category banner ranking NDCG@10 comparison",
        caption: "LightGBM LambdaRank improves NDCG@10 by +2.58% over Global Popularity.",
        mediaKind: "chart",
        width: 1650,
        height: 675,
      },
      {
        src: "/projects/customer-seg/power_curve.png",
        alt: "Statistical power and MDE curve with CUPED variance reduction",
        caption: "CUPED pre-period spend covariate reduces required variance by 17.11% (1.21x effective sample size).",
        mediaKind: "chart",
        width: 1050,
        height: 750,
      },
    ],
    highlights: [
      "37 unit tests including bitwise SQL-vs-pandas checks and shuffled-label leakage audits.",
      "Explicitly separates observational SNIPS CTR proxy (0.04796) and offline EV simulation from live A/B claims.",
      "Zero-inflated RFM handling isolates zero-spend users before quartile binning.",
    ],
    sketchType: "segmentation",
  },
  {
    id: "continual-learning",
    slug: "continual-rl",
    title: "CAR-SR — Continual RL Under Task Conflict",
    shortTitle: "CAR-SR Continual RL",
    tagline:
      "Conflict-aware orthogonal gradient projection and Parseval spectral regularization resolving the stability-plasticity trilemma in RL.",
    categories: ["AI / ML"],
    featured: true,
    repoUrl: "https://github.com/okBhavya/Continual-Learning",
    problem:
      "When a single fixed-capacity RL policy trains across sequential tasks with conflicting optimal actions, standard experience replay blends contradictory Bellman targets and triggers negative transfer, while Fisher regularization freezes output weights and destroys plasticity.",
    whatIBuilt:
      "Designed and benchmarked CAR-SR (Conflict-Aware Replay with Spectral Regularization) in PyTorch and Gymnasium across 63 multi-seed runs and 3 graduated conflict curricula (similar, partial, dissimilar), with automated evaluation and visualization tooling.",
    architectureSummary:
      "At every step, CAR-SR computes cosine alignment c_t between active-task gradients and reservoir replay memory gradients. When c_t < 0, active gradients are orthogonally projected onto the normal plane of replay gradients, while Parseval regularization keeps hidden weight matrices near isometric frames.",
    architecturePipeline: [
      {
        step: "01",
        title: "Graduated Conflict Curricula",
        detail: "No-task-ID CartPole-v1 sequences: similar, partial (x>0 flip), and dissimilar (global flip).",
      },
      {
        step: "02",
        title: "Dual-Stream Gradient Check",
        detail: "Measures cosine similarity c_t between active TD loss and reservoir memory loss.",
      },
      {
        step: "03",
        title: "Orthogonal Projection",
        detail: "Removes conflicting component when c_t < 0 so historical Bellman errors do not worsen.",
      },
      {
        step: "04",
        title: "Parseval Spectral Frame",
        detail: "Penalizes ||W^T W - I||_F^2 to preserve hidden rank and forward plasticity.",
      },
    ],
    technologies: [
      "PyTorch",
      "Gymnasium",
      "SciPy & Pandas",
      "Matplotlib",
      "Pytest",
      "YAML Experiment CLI",
    ],
    metrics: [
      {
        label: "Forgetting Reduction",
        value: "-42%",
        context: "97.4 ± 34.3 vs 168.4 naive on partial conflict",
      },
      {
        label: "Forward Transfer Uplift",
        value: "82.8 vs 44.9",
        context: "Parseval frame nearly doubles transfer vs ablation",
      },
      {
        label: "Benchmark Matrix",
        value: "5 algos / 63 runs",
        context: "3 seeds × 3 conflict regimes + ablations",
      },
      {
        label: "Test Suite",
        value: "18 tests passed",
        context: "Gradient projection, envs, and CRL metric proofs",
      },
    ],
    media: [
      {
        src: "/projects/continual-rl/agent_demo-poster.png",
        videoMp4: "/projects/continual-rl/agent_demo.mp4",
        videoWebm: "/projects/continual-rl/agent_demo.webm",
        posterSrc: "/projects/continual-rl/agent_demo-poster.png",
        alt: "Trained CAR-SR continual RL agent balancing across task shifts",
        caption: "Live checkpoint rollout demonstrating retained policy control across shifted physics.",
        isAnimated: true,
        mediaKind: "video",
        width: 588,
        height: 340,
      },
      {
        src: "/projects/continual-rl/forgetting_vs_conflict.png",
        alt: "Catastrophic forgetting across graduated conflict regimes",
        caption: "CAR-SR reduces partial-conflict forgetting to 97.4 vs 142.3 (Replay) and 168.4 (Naive).",
        mediaKind: "chart",
        width: 2400,
        height: 1650,
      },
      {
        src: "/projects/continual-rl/stability_plasticity_pareto.png",
        alt: "Stability vs plasticity Pareto frontier across CRL methods",
        caption: "Retention-plasticity trade-off across 5 algorithms and ablation variants.",
        mediaKind: "chart",
        width: 2400,
        height: 1800,
      },
    ],
    highlights: [
      "Isolated ablation studies prove orthogonal projection prevents forgetting (+63% forgetting surge without it) while Parseval preserves plasticity.",
      "Reproducible CLI orchestration across parallel workers with deterministic seeding.",
    ],
    sketchType: "continual",
  },
  {
    id: "calibrai",
    slug: "calibrai",
    title: "CalibrAI — Trust Calibration Signals for AI Assistants",
    shortTitle: "CalibrAI Extension",
    tagline:
      "Chrome Manifest V3 extension & consent-aware FastAPI backend rendering non-invasive reliability signals below LLM responses.",
    categories: ["Product / Tools", "AI / ML"],
    featured: true,
    repoUrl:
      "https://github.com/okBhavya/Designing-Trust-Calibration-Signals-for-AI-Assistants",
    problem:
      "Users routinely over-trust fluent AI assistant outputs because chat UIs present uncertain guesses and verified answers with identical visual confidence. Researching trust calibration across ChatGPT, Claude, and Gemini requires consistent UI instrumentation without breaking host pages or leaking user text.",
    whatIBuilt:
      "Built a Manifest V3 Chrome extension (WXT + React 18 + strict TypeScript) with provider-neutral site adapters and an isolated Shadow DOM signal overlay, paired with a consent-enforced FastAPI + SQLAlchemy + PostgreSQL/SQLite backend and statistical calibration helpers.",
    architectureSummary:
      "Content scripts detect completed answers via MutationObserver + two-sample stability checks, compute SHA-256 answer hashes, and pass typed captures only to the background service worker—which enforces HTTPS, short-lived HMAC-SHA256 tokens, and explicit consent before invoking a replaceable SignalProvider (currently a deterministic mock).",
    architecturePipeline: [
      {
        step: "01",
        title: "Isolated Platform Adapters",
        detail: "ChatGPT, Claude, and Gemini DOM adapters share a single typed capture contract.",
      },
      {
        step: "02",
        title: "Shadow DOM Signal Overlay",
        detail: "Renders confidence & explanation pills non-invasively without host CSS collisions.",
      },
      {
        step: "03",
        title: "Worker Network Boundary",
        detail: "Content script never touches network; worker enforces HTTPS + HMAC-SHA256 tokens.",
      },
      {
        step: "04",
        title: "Consent-Bound FastAPI",
        detail: "Versioned consent, cascade deletion, rate limits, and AUROC/ECE/Brier eval helpers.",
      },
    ],
    technologies: [
      "TypeScript (Strict)",
      "React 18 & WXT (MV3)",
      "Shadow DOM",
      "FastAPI",
      "SQLAlchemy & Alembic",
      "PostgreSQL / SQLite",
      "Vitest & Pytest",
    ],
    metrics: [
      {
        label: "Supported AI Surfaces",
        value: "3 Platforms",
        context: "ChatGPT, Claude, and Gemini adapters",
      },
      {
        label: "Automated Tests",
        value: "24 Passed",
        context: "12 extension Vitest + 12 FastAPI pytest tests",
      },
      {
        label: "Extension Permissions",
        value: "Minimal (storage)",
        context: "Zero history, tabs, or unrestricted host scopes",
      },
      {
        label: "Current Provider Mode",
        value: "Deterministic Mock",
        context: "Phase 2A foundation ready for Phase 2B judging",
      },
    ],
    media: [],
    highlights: [
      "Built with security-first boundaries: raw prompt/answer persistence disabled in production/study environments.",
      "Includes deterministic evaluation tooling for AUROC, fixed-bin ECE, Brier score, and isotonic calibration.",
    ],
    sketchType: "calibrai",
  },
  {
    id: "planpilot",
    slug: "planpilot",
    title: "PlanPilot — AI Production Scheduling Copilot",
    shortTitle: "PlanPilot",
    tagline:
      "LLM copilot layered over Google OR-Tools CP-SAT with 5-stage rule validation, zero-hallucination citations, and DuckDB ERP onboarding.",
    categories: ["AI / ML", "Product / Tools"],
    featured: false,
    repoUrl: "https://github.com/okBhavya/PlanPilot",
    problem:
      "Factory schedulers rely on mathematical constraint solvers like CP-SAT, yet converting shop-floor operating rules into solver constraints, cleaning messy SAP CSVs, and explaining why an order slipped normally require deep operations-research expertise—and raw LLMs hallucinate numbers.",
    whatIBuilt:
      "Engineered a full-stack AI copilot around OR-Tools CP-SAT. It parses plain-English rules into validated solver constraints, traces lateness root causes deterministically before LLM narration, profiles ERP extracts in DuckDB, and ranks schedule trade-offs via MAUT.",
    architectureSummary:
      "A Streamlit workspace and Typer CLI talk to a FastAPI gateway backed by PostgreSQL 16 and Arq/Redis workers. Natural-language rules pass a 5-stage deterministic gate (schema, fuzzy entity match, semantic bounds, DFS cycle check, trial solve), while schedule explanations require regex verification against solver-extracted atomic facts.",
    architecturePipeline: [
      {
        step: "01",
        title: "NL Rule -> 5-Stage Gate",
        detail: "Pydantic schema, fuzzy entity linking, semantic bounds, DFS cycle check, CP-SAT trial solve.",
      },
      {
        step: "02",
        title: "DuckDB ERP Onboarding",
        detail: "Zero-copy SQL profiling of SAP-style CSVs + 3-color DFS BOM cycle detection.",
      },
      {
        step: "03",
        title: "OR-Tools CP-SAT + Arq",
        detail: "Async Redis/Arq workers compute optimal schedules persisted to PostgreSQL 16.",
      },
      {
        step: "04",
        title: "Grounded Citation Verifier",
        detail: "Backward critical-chain tracer extracts [F1]/[F2] facts; regex guard blocks hallucinations.",
      },
    ],
    technologies: [
      "Google OR-Tools (CP-SAT)",
      "FastAPI",
      "DuckDB",
      "PostgreSQL 16",
      "Redis / Arq",
      "OpenAI & Anthropic",
      "Streamlit",
      "Pydantic & Mypy Strict",
    ],
    metrics: [
      {
        label: "NL Rule Exact Match",
        value: "90.91%",
        context: "100.0% schema valid across 65 gold rules",
      },
      {
        label: "Root-Cause Attribution",
        value: "100% (25/25)",
        context: "0.11 ms p50 backward critical-chain trace",
      },
      {
        label: "Hallucination Rejection",
        value: "100.0%",
        context: "Adversarial altered-number checks blocked",
      },
      {
        label: "ERP Defect Detection F1",
        value: "100.0%",
        context: "30 ERP cases; 120.11 ms p50 DuckDB profiling",
      },
    ],
    media: [],
    highlights: [
      "170 unit and integration tests passing offline without live LLM calls via SHA-256 cached responses.",
      "Multi-Attribute Utility Theory (MAUT) comparison lets planners weigh OTD%, makespan, tardiness, and setups interactively.",
      "Shipped with strict mypy typing, ruff linting, Docker Compose stack, and Typer CLI.",
    ],
    sketchType: "planpilot",
  },
  {
    id: "internship-hunter",
    slug: "internship-hunter",
    title: "Internship Hunter — Remote Technical Role Matcher",
    shortTitle: "Internship Hunter",
    tagline:
      "Multi-agent discovery, strict qualification gating, and transparent 0–100 profile matching for remote engineering internships.",
    categories: ["Product / Tools", "Systems Engineering"],
    featured: false,
    repoUrl: "https://github.com/okBhavya/Internship_hunter",
    problem:
      "Job boards drown students in mislabelled full-time, non-technical, on-site, or expired listings, while automated scripts that bypass logins or fabricate resume claims create unacceptable ethical and security risks.",
    whatIBuilt:
      "Built a full-stack FastAPI + SQLAlchemy (13-table schema) and React 19 + TypeScript + Tailwind workspace with modular source adapters (Remotive, Adzuna), deterministic duplicate detection, weighted 0–100 matching, factual verification checks, and strict no-CAPTCHA-bypass human-approval gates.",
    architectureSummary:
      "Source adapters normalize raw listings into SQLite via SQLAlchemy, filter strictly for verified remote technical internships, compute weighted skill/role/experience scores, and pause for explicit user approval before any external submission.",
    architecturePipeline: [
      {
        step: "01",
        title: "Modular Source Adapters",
        detail: "Ingests Remotive & Adzuna feeds with duplicate detection across listings.",
      },
      {
        step: "02",
        title: "Strict Qualification Policy",
        detail: "Rejects non-remote, senior, expired, or non-technical roles deterministically.",
      },
      {
        step: "03",
        title: "Weighted Match Scorer",
        detail: "0–100 scoring across technical skills (30%), role (20%), experience (15%), and more.",
      },
      {
        step: "04",
        title: "Human Approval Queue",
        detail: "Verification agent checks claims; CAPTCHAs/auth always route to manual action.",
      },
    ],
    technologies: [
      "FastAPI",
      "SQLAlchemy",
      "React 19",
      "TypeScript",
      "Vite & Tailwind CSS",
      "Pytest",
    ],
    metrics: [
      {
        label: "Data Model",
        value: "13+ tables",
        context: "Jobs, matches, skills, audit logs & approval queue",
      },
      {
        label: "Safety Posture",
        value: "Human-in-Loop",
        context: "Never bypasses CAPTCHAs, MFA, or login walls",
      },
    ],
    media: [],
    highlights: [
      "Pairs agent orchestration with strict factual consistency verification and explicit safety boundaries.",
    ],
    sketchType: "hunter",
  },
];
