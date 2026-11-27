export type ProjectCategory =
  | "AI / ML"
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
  sketchType: "mpc" | "segmentation" | "continual" | "calibrai" | "flood";
}

export const projectCategories: ("All" | ProjectCategory)[] = [
  "All",
  "AI / ML",
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
        caption: "Open-loop error growth (0.022 m at 1 step → 0.635 m at 10 steps), mitigated by 10 Hz replanning.",
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
      "Explicit safety constraints halved out-of-road incidents in traffic (40.0% → 20.0%).",
      "Includes failure-case diagnostics across unseen roundabouts, T-junctions, and dense traffic.",
    ],
    sketchType: "mpc",
  },
  {
    id: "flood-mapping",
    slug: "flood-prediction",
    title: "Multi-Temporal Sentinel-1 Flood Prediction",
    shortTitle: "Flood Prediction",
    tagline:
      "4-band Sentinel-1 SAR Attention U-Net mapping monsoon flood extent across Chhatarpur & Satna with 0.9101 test IoU.",
    categories: ["AI / ML", "Data Science"],
    featured: true,
    repoUrl: "https://github.com/okBhavya/Flood-Prediction",
    problem:
      "Optical satellite imagery is blinded by dense monsoon cloud cover during peak flooding, delaying rapid district-scale inundation mapping across affected regions like Chhatarpur and Satna in Madhya Pradesh.",
    whatIBuilt:
      "Built an end-to-end Sentinel-1 SAR flood mapping and deep-learning semantic segmentation pipeline (Team 26) using SNAP 14.0.0 calibration, Rasterio multi-temporal 64×64 patch generation, a U-Net baseline on Dataset-I, and 4-gate Attention U-Net models for Chhatarpur and Satna districts.",
    architectureSummary:
      "Pre-flood and post-flood Sentinel-1 GRD scenes undergo SNAP 14.0.0 Orbit, Thermal Noise Removal, Gamma0 Calibration, Refined Lee speckle filtering, Terrain Correction, and Collocation onto a common 10 m EPSG:32644 grid. Four-channel [before_VV, before_VH, after_VV, after_VH] tensors with per-band normalization and spatial-block splits train a 7.85M-parameter AttentionUNet with BCE + Soft Dice loss.",
    architecturePipeline: [
      {
        step: "01",
        title: "SNAP 14.0.0 SAR Pipeline",
        detail: "Calibrated Gamma0, Refined Lee speckle filter & 10 m EPSG:32644 terrain correction on 28,535 × 21,578 grids.",
      },
      {
        step: "02",
        title: "4-Band Temporal Stacks",
        detail: "Extracted 4,531 Chhatarpur & 11,407 kept Satna 64×64 [VVb, VHb, VVa, VHa] patches with zero nodata skips.",
      },
      {
        step: "03",
        title: "Attention U-Net Training",
        detail: "4-gate AttentionUNet (7.85M params) improved validation IoU/Dice to 0.8999 / 0.9473 on Chhatarpur.",
      },
      {
        step: "04",
        title: "District Flood Reconstruction",
        detail: "Stitched full Chhatarpur flood map (273.26 km² predicted flood) achieving 0.9101 test IoU & 0.9529 Dice.",
      },
    ],
    technologies: [
      "PyTorch",
      "Sentinel-1 SAR",
      "SNAP 14.0.0",
      "Rasterio",
      "Attention U-Net",
      "Scikit-learn",
      "NumPy & Pandas",
    ],
    metrics: [
      {
        label: "Chhatarpur Test IoU",
        value: "0.9101 (0.9529 Dice)",
        context: "AttentionUNet best epoch 24/25 · Val IoU 0.8999",
      },
      {
        label: "Chhatarpur SAR Patches",
        value: "4,531 (3,722 / 809)",
        context: "Plus 11,407 Satna & 3,911 Dataset-I kept 64×64 patches",
      },
      {
        label: "Dataset-I UNet Test IoU",
        value: "0.8789 (0.9355 Dice)",
        context: "Model 1 baseline across 3,464 train / 447 val patches",
      },
      {
        label: "Satna AttentionUNet IoU",
        value: "0.8308 (0.9076 Dice)",
        context: "Model 2 across 9,413 train / 1,994 val patches (Epoch 37/40)",
      },
    ],
    media: [
      {
        src: "/projects/flood-prediction/collage.png",
        alt: "Model 2 Attention U-Net Chhatarpur validation patches comparing Before/After VV and VH SAR bands against ground truth and predictions",
        caption:
          "Chhatarpur validation patches comparing multi-temporal Sentinel-1 [VV, VH] inputs with ground truth and Model 2 Attention U-Net predictions.",
        mediaKind: "chart",
        width: 2054,
        height: 1414,
      },
      {
        src: "/projects/flood-prediction/architecture_schematic.png",
        alt: "Architecture schematic comparing Model 1 U-Net (7.76M params) and Model 2 Attention U-Net (7.85M params) with 4 additive attention gates",
        caption:
          "Model 1 UNet (7,763,329 params) vs. Model 2 AttentionUNet (7,851,093 params) over 4-channel 64×64 SAR stacks.",
        mediaKind: "diagram",
        width: 2004,
        height: 1094,
      },
      {
        src: "/projects/flood-prediction/chhatarpur_enhanced_curves.png",
        alt: "Model 2 Chhatarpur BCE + Soft Dice loss trajectory and spatial-block validation IoU and Dice curves",
        caption:
          "Model 2 Chhatarpur training curves reaching peak validation IoU 0.8999 and Dice 0.9473 at epoch 24.",
        mediaKind: "chart",
        width: 2213,
        height: 773,
      },
      {
        src: "/projects/flood-prediction/chhatarpur_reconstructed_map.png",
        alt: "Reconstructed Chhatarpur district flood prediction map from Sentinel-1A/1D scenes on EPSG:32644 10 m grid",
        caption:
          "Reconstructed Chhatarpur district flood raster (273.26 km² predicted flood across Sentinel-1 scenes from 23 May to 03 Sep 2026).",
        mediaKind: "chart",
        width: 1344,
        height: 1092,
      },
    ],
    highlights: [
      "Spatial-block train/validation splitting eliminates adjacent-patch leakage across Chhatarpur (4,531 patches) and Satna (11,669 aligned patches).",
      "Zero nodata or low-flood skips in Chhatarpur Dataset_II while stitching full-district flood predictions.",
    ],
    sketchType: "flood",
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
        alt: "Trained CAR-SR continual RL inverted pendulum agent balancing across task shifts",
        caption: "Live inverted pendulum (CartPole-v1) checkpoint balancing across shifted task dynamics.",
        isAnimated: true,
        mediaKind: "video",
        width: 640,
        height: 360,
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
];
