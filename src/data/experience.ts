export interface ExperienceMetric {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
}

export interface ExperienceItem {
  id: string;
  organization: string;
  shortOrg: string;
  role: string;
  period: string;
  location: string;
  kind: "work" | "leadership" | "impact";
  accent: "terracotta" | "forest" | "mustard" | "slate";
  summary: string;
  achievements: string[];
  metrics: ExperienceMetric[];
  tags: string[];
  hasProductExplorer?: boolean;
}

export interface SuttCohortRow {
  id: string;
  cohort: string;
  share: string;
  pattern: string;
  productAction: string;
  experimentHypothesis: string;
}

export const suttProductPlaybook: SuttCohortRow[] = [
  {
    id: "power",
    cohort: "High-Frequency Campus Regulars",
    share: "Core daily transactors",
    pattern: "Frequent low-ticket food & outlet payments across multiple campus vendors.",
    productAction: "Protect checkout speed and introduce subtle streak / convenience loops.",
    experimentHypothesis:
      "A/B test tailored vendor-affinity quick-pay nudges to lift weekly repeat frequency.",
  },
  {
    id: "selective",
    cohort: "Vendor-Loyal Spenders",
    share: "High single-vendor affinity",
    pattern: "Concentrated wallet spend at 1–2 preferred campus spots with predictable timing.",
    productAction: "Cross-pollinate discovery toward adjacent campus services & events.",
    experimentHypothesis:
      "Measure cross-vendor trial lift via affinity-ranked surface placement.",
  },
  {
    id: "episodic",
    cohort: "Event & Fest Burst Users",
    share: "Spiky seasonal activity",
    pattern: "Sharp wallet top-ups during BOSM/Oasis/Apogee followed by quiet weeks.",
    productAction: "Convert one-off fest top-ups into habitual everyday SU App usage.",
    experimentHypothesis:
      "Compare post-event retention messages triggered by gradient-boosting propensity scores.",
  },
  {
    id: "churn-risk",
    cohort: "Low-Balance Drop-Off Segment",
    share: "Elevated churn propensity",
    pattern: "Wallet balance approaches zero after consecutive small purchases, causing silent drop-off.",
    productAction: "Intervene before abandonment without spamming active users.",
    experimentHypothesis:
      "A/B test timely low-balance recharge nudges predicted by logistic regression & GBDT risk scores.",
  },
];

export const experiences: ExperienceItem[] = [
  {
    id: "sutt",
    organization: "Students' Union Technical Team (SUTT), BITS Pilani",
    shortOrg: "SUTT · SU App",
    role: "Product Lead, SU App",
    period: "July 2025 – July 2026",
    location: "Pilani, India",
    kind: "work",
    accent: "forest",
    summary:
      "Owned data-driven product strategy and user analytics for the campus super-app powering student payments, dining, and campus services.",
    achievements: [
      "Analysed over ₹12 crore in transactions across 5,000+ students to uncover spending rhythms and retention bottlenecks.",
      "Engineered behavioural RFM (Recency, Frequency, Monetary) and vendor-affinity features from raw campus transaction logs.",
      "Segmented 5,000+ students into 4–5 distinct behavioural cohorts using K-Means for targeted engagement and retention.",
      "Prototyped logistic regression and gradient-boosting propensity models and designed A/B tests for repeat usage and low-balance churn.",
    ],
    metrics: [
      { value: 12, prefix: "₹", suffix: " Cr+", label: "Transactions analysed" },
      { value: 5000, suffix: "+", label: "Students segmented" },
    ],
    tags: ["Product Strategy", "Python", "K-Means", "RFM & Affinity", "Logistic Regression", "Gradient Boosting", "A/B Testing"],
    hasProductExplorer: true,
  },
  {
    id: "kite",
    organization: "KITE — Kerala Infrastructure and Technology for Education",
    shortOrg: "KITE · Samagra",
    role: "AI/ML Intern, Samagra Platform",
    period: "May 2025 – July 2025",
    location: "Kerala, India",
    kind: "work",
    accent: "forest",
    summary:
      "Built production-oriented anomaly detection pipelines, RAG tooling, and monitoring dashboards supporting Kerala's statewide public education data platform.",
    achievements: [
      "Built Python ML pipelines for anomaly detection across 40,000+ schools, reducing manual data-review effort by 70%.",
      "Built a RAG-based AI assistant using FAISS/Pinecone and LLMs, cutting policy-query response times by 60%.",
      "Developed Streamlit analytics dashboards for real-time data-quality monitoring and AI-driven insights for policy teams.",
    ],
    metrics: [
      { value: 40000, suffix: "+", label: "Schools covered" },
      { value: 70, suffix: "%", label: "Less manual review" },
      { value: 60, suffix: "%", label: "Faster policy queries" },
    ],
    tags: ["Python", "Anomaly Detection", "LLM & RAG", "FAISS / Pinecone", "Streamlit"],
  },
  {
    id: "legacy",
    organization: "Department of Legacy, BITS Pilani",
    shortOrg: "Dept. of Legacy",
    role: "President",
    period: "August 2025 – April 2026",
    location: "Pilani, India",
    kind: "leadership",
    accent: "terracotta",
    summary:
      "Directed alumni relations and fundraising operations for BOSM (BITS Open Sports Meet), blending outreach strategy with operational execution.",
    achievements: [
      "Raised ₹7 lakh in alumni donations for BOSM (Sports Fest) to support student athletics and fest operations.",
      "Led and mentored a driven team of 45 members across outreach, donor stewardship, and campaign coordination.",
      "Established sustainable donation channels between BITSAA and global alumni to strengthen long-term institutional contributions.",
    ],
    metrics: [
      { value: 7, prefix: "₹", suffix: " Lakh", label: "Alumni funds raised" },
      { value: 45, label: "Team members led" },
    ],
    tags: ["Leadership", "Alumni Relations", "Fundraising Ops", "Team of 45"],
  },
  {
    id: "climatetech",
    organization: "Climate Tech Bootcamp by SusMafia",
    shortOrg: "SusMafia Bootcamp",
    role: "Product & AI Builder — AgriGyan",
    period: "March 2025",
    location: "Sprint / MVP",
    kind: "impact",
    accent: "slate",
    summary:
      "Validated a grassroots climate-resilience pain point and designed a working product concept under 48-hour startup sprint constraints.",
    achievements: [
      "Developed AgriGyan, a hyper-local crop advisory concept for farmers integrating soil signals, local market pricing, and remote sensing.",
      "Practiced rapid startup problem validation around sustainable agriculture and shipped an end-to-end MVP architecture in 48 hours.",
    ],
    metrics: [{ value: 48, suffix: " hrs", label: "Problem-to-MVP sprint" }],
    tags: ["AgriGyan", "Climate Tech", "Remote Sensing", "Product Discovery"],
  },
  {
    id: "nss",
    organization: "National Service Scheme (NSS School), BITS Pilani",
    shortOrg: "NSS Pilani",
    role: "Volunteer Mathematics Educator",
    period: "September 2023 – July 2025",
    location: "Pilani, India",
    kind: "impact",
    accent: "slate",
    summary:
      "Spent nearly two years making secondary-school mathematics approachable and intuitive for underprivileged students in Pilani.",
    achievements: [
      "Taught Mathematics to underprivileged children in Pilani, turning abstract exam topics into interactive problem-solving sessions.",
      "Helped improve Class 12 Mathematics outcomes, with 80% of students scoring 75%+ in board examinations.",
    ],
    metrics: [
      { value: 80, suffix: "%", label: "Class 12 scored 75%+" },
      { value: 2, suffix: " yrs", label: "Consistent mentoring" },
    ],
    tags: ["Teaching", "Mathematics", "Community Impact"],
  },
];
