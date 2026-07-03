export type ProjectStatus = "active" | "shipped" | "research";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  github?: string;
  liveUrl?: string;
  featured: boolean;
  status: ProjectStatus;
}

export const projects: Project[] = [
  {
    slug: "sparseeval",
    name: "sparseeval",
    tagline: "Sparse estimation for GEPA-style LLM optimization",
    description:
      "Research tooling that replaces dense Pareto-table reevaluation with sparse estimation while preserving candidate-selection decisions. Built alongside my work with Professor Ying Nian Wu at UCLA Statistics.",
    tech: ["Python", "FastAPI", "Next.js", "Statistics"],
    github: "https://github.com/DavidZaa/sparseeval",
    featured: true,
    status: "research",
  },
  {
    slug: "ai-education-newspaper",
    name: "AI Education Newspaper",
    tagline: "An RSS-grounded newspaper that audits its own credibility",
    description:
      "A React/Node app that ingests RSS feeds, generates web-grounded article briefs, and scores each piece with an independent credibility report — a newspaper that shows its work.",
    tech: ["React", "Node", "SQLite", "LLM APIs"],
    github: "https://github.com/DavidZaa/AI-Newspaper-Reviewer",
    featured: true,
    status: "shipped",
  },
  {
    slug: "personal-website",
    name: "DZ-01 (this site)",
    tagline: "Portfolio + private mission control in one codebase",
    description:
      "The site you're looking at: a space-themed public portfolio wired to a hidden owner-only dashboard for tasks, calendar, blog publishing, and live stats. Next.js, Supabase, React Three Fiber.",
    tech: ["Next.js", "TypeScript", "Supabase", "Three.js"],
    github: "https://github.com/DavidZaa",
    featured: true,
    status: "active",
  },
  {
    slug: "resident-help-chatbot",
    name: "Irvine Resident-Help Chatbot",
    tagline: "Civic FAQ triage for the Office of the Vice Mayor",
    description:
      "A Flask-based chatbot deployed for the City of Irvine that automated resident FAQs and triage handoffs, built while advising on the office's web information architecture.",
    tech: ["Python", "Flask", "NLP"],
    featured: false,
    status: "shipped",
  },
  {
    slug: "brainbow",
    name: "BrainBow",
    tagline: "A real-time inclusivity index using NLP",
    description:
      "NLP system measuring conversational inclusivity in real time; published at MLNLP 2024 (Sydney) and the basis of a U.S. provisional patent on inclusivity index metrics for neurodiversity.",
    tech: ["Python", "NLP", "Research"],
    featured: false,
    status: "research",
  },
  {
    slug: "collab-coding-platform",
    name: "Smart Collaborative Coding Platform",
    tagline: "Real-time collaborative programming education",
    description:
      "Led development of a real-time collaborative coding platform for programming education at SoftCom Lab; published at SEAS 2023 (Toronto).",
    tech: ["JavaScript", "WebSockets", "Cloud"],
    featured: false,
    status: "shipped",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
