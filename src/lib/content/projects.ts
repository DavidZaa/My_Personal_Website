export type ProjectStatus = "active" | "shipped" | "research";
export type ProjectOrigin = "personal" | "research" | "club" | "civic" | "patent";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  year: string;
  origin: ProjectOrigin;
  github?: string;
  liveUrl?: string;
  featured: boolean;
  status: ProjectStatus;
}

/**
 * The complete payload manifest — compiled from GitHub, the resume,
 * clubs, and patents. Ordered roughly newest/most-significant first.
 */
export const projects: Project[] = [
  {
    slug: "sparseeval",
    name: "sparseeval",
    tagline: "Finding the best prompt+model combo without brute force",
    description:
      "An experiment comparing brute-force evaluation against an adaptive successive-halving sampler for prompt/model selection — the practical companion to my sparse-estimation research.",
    tech: ["Python", "FastAPI", "Next.js", "Statistics"],
    year: "2026",
    origin: "research",
    github: "https://github.com/DavidZaa/sparseeval",
    featured: true,
    status: "research",
  },
  {
    slug: "latentmode-gepa",
    name: "LatentMode GEPA",
    tagline: "Sparse estimation for GEPA-style LLM optimization",
    description:
      "Research with Professor Ying Nian Wu (UCLA Statistics): replacing dense Pareto-table reevaluation with sparse estimation while preserving candidate-selection decisions — measuring selection agreement, cost, and robustness at scale.",
    tech: ["Python", "Statistics", "LLM Optimization"],
    year: "2026",
    origin: "research",
    github: "https://github.com/DavidZaa/LatentModeGEPA-revisions",
    featured: true,
    status: "research",
  },
  {
    slug: "ai-newspaper-reviewer",
    name: "AI Newspaper Reviewer",
    tagline: "A newspaper that audits its own credibility",
    description:
      "An AI-powered education newspaper that gathers news, summarizes it, and visibly evaluates every summary for credibility and source faithfulness — the byline includes the receipts.",
    tech: ["React", "Node", "SQLite", "LLM APIs"],
    year: "2026",
    origin: "personal",
    github: "https://github.com/DavidZaa/AI-Newspaper-Reviewer",
    featured: true,
    status: "shipped",
  },
  {
    slug: "personal-website",
    name: "DZ-01 (this site)",
    tagline: "Portfolio + private mission control in one codebase",
    description:
      "The site you're flying through: a space-themed public portfolio wired to a hidden owner-only dashboard for tasks, calendar, blog publishing, and live stats.",
    tech: ["Next.js", "TypeScript", "Supabase", "Three.js"],
    year: "2026",
    origin: "personal",
    github: "https://github.com/DavidZaa/David_Personal_Website",
    featured: false,
    status: "active",
  },
  {
    slug: "datares-myla311",
    name: "MyLA311 Wait-Time Atlas",
    tagline: "Where and why LA residents wait longer for city services",
    description:
      "Leading a 5–6 person UCLA DataRes team analyzing MyLA311 open data across request types, ZIP codes, and submission channels — a Python/Colab pipeline and Plotly dashboard feeding staffing and routing recommendations, written up for the DataBlog.",
    tech: ["Python", "Pandas", "Plotly", "Open Data"],
    year: "2025–26",
    origin: "club",
    featured: false,
    status: "active",
  },
  {
    slug: "replicate-kit",
    name: "Replicate-Kit",
    tagline: "Research ideas → structured, reproducible experiment plans",
    description:
      "A tool that turns a research idea into a structured implementation plan — claims, datasets, metrics, experiments, configs, replication status — ending in a reproducibility report.",
    tech: ["Python", "Research Tooling"],
    year: "2026",
    origin: "personal",
    github: "https://github.com/DavidZaa/Replicate-Kit",
    featured: false,
    status: "shipped",
  },
  {
    slug: "operator-school",
    name: "Operator School",
    tagline: "AI education experiments",
    description:
      "A TypeScript playground for AI-education ideas — exercises and tooling for teaching people to work effectively with AI systems.",
    tech: ["TypeScript", "AI Education"],
    year: "2026",
    origin: "personal",
    github: "https://github.com/DavidZaa/Operator-School",
    featured: false,
    status: "active",
  },
  {
    slug: "edu-ai-index-dashboard",
    name: "Edu-AI Index Dashboard",
    tagline: "Visualizing AI adoption in education",
    description:
      "A JavaScript dashboard tracking and visualizing indicators of AI use in educational settings.",
    tech: ["JavaScript", "Data Viz"],
    year: "2026",
    origin: "personal",
    github: "https://github.com/DavidZaa/edu-ai-index-dashboard",
    featured: false,
    status: "shipped",
  },
  {
    slug: "vice-mayor-chatbot",
    name: "Irvine Resident-Help Chatbot",
    tagline: "Civic FAQ triage for the Office of the Vice Mayor",
    description:
      "A Flask-based contact and helpdesk chatbot deployed for Vice Mayor James Mai's office — automated resident FAQs and triage handoffs, built while advising on the site's information architecture.",
    tech: ["Python", "Flask", "NLP"],
    year: "2025",
    origin: "civic",
    github: "https://github.com/DavidZaa/Vice-Mayor-Chatbot",
    featured: false,
    status: "shipped",
  },
  {
    slug: "brainbow",
    name: "BrainBow",
    tagline: "A real-time inclusivity index using NLP",
    description:
      "A system raising awareness about neurodiversity by passively analyzing real-time sentiment from social media and news. Published at MLNLP 2024 (Sydney); basis of USPTO provisional #63/578,676.",
    tech: ["Python", "NLP", "Sentiment Analysis"],
    year: "2024",
    origin: "patent",
    github: "https://github.com/DavidZaa/BrainBow",
    featured: false,
    status: "research",
  },
  {
    slug: "web-coding-editor",
    name: "Collaborative Web Coding Editor",
    tagline: "Real-time collaborative programming education",
    description:
      "A web-based real-time collaborative coding and monitoring platform for programming education — used across three school districts (including Irvine USD), five public schools, and three private organizations. Published at SEAS 2023 (Toronto).",
    tech: ["JavaScript", "WebSockets", "Firepad"],
    year: "2022–23",
    origin: "research",
    github: "https://github.com/DavidZaa/Web-Coding-Editor",
    featured: false,
    status: "shipped",
  },
  {
    slug: "zebrafish-anxiety-model",
    name: "Zebrafish Anxiety–Learning Model",
    tagline: "A computational model of anxiety's role in learning",
    description:
      "A computational framework analyzing the relationship between anxiety and learning behavior using zebrafish behavioral modeling and data-driven analysis. Published in the Journal of Research High School, Vol. 2025(2).",
    tech: ["Python", "Behavioral Modeling", "Data Analysis"],
    year: "2025",
    origin: "research",
    featured: false,
    status: "research",
  },
  {
    slug: "sleep-wearable",
    name: "Sleep Brain-Wave Wearable",
    tagline: "Design concept for sleep-related brain wave detection",
    description:
      "Design concept for a wearable device detecting and stimulating sleep-related brain waves, aimed at insomnia and anxiety care for senior patients. Published at IEEE ICDSCA 2024.",
    tech: ["Embedded", "Signal Processing", "Research"],
    year: "2024",
    origin: "research",
    featured: false,
    status: "research",
  },
  {
    slug: "digiprescription",
    name: "DigiPrescription",
    tagline: "Mobile NLP for paperless prescriptions",
    description:
      "A mobile NLP system for paperless prescriptions — USPTO provisional patent #63/087,608, my first shipped app (2021).",
    tech: ["Mobile", "NLP"],
    year: "2021",
    origin: "patent",
    featured: false,
    status: "shipped",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
