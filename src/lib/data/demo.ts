import type {
  CalendarEvent,
  Counter,
  GithubStats,
  GuestbookEntry,
  LeetcodeStats,
  NowStatus,
  Post,
  Task,
} from "@/lib/types";

/**
 * Sample data served when Supabase isn't configured, so the whole site
 * (dashboard included) works out of the box. Shapes mirror the real
 * tables exactly — swapping in Supabase changes nothing downstream.
 */

const NOW = "2026-07-03T18:00:00.000Z";

export const demoPosts: Post[] = [
  {
    id: "demo-post-1",
    slug: "hello-universe",
    title: "Hello, universe",
    excerpt:
      "Why I built my own corner of space instead of another white-background portfolio.",
    content_md: `Every CS student has a portfolio site. Most of them look the same: a headshot, three cards, a copy of the resume.

I wanted mine to feel like *operating something* — a small mission control that happens to also be my portfolio.

## What this site actually is

- A public face: projects, research, writing
- A private dashboard where I run my week
- One codebase, one deploy, zero CMS

\`\`\`ts
const site = {
  public: ["projects", "blog", "now", "guestbook"],
  private: ["tasks", "calendar", "editor"],
};
\`\`\`

More on the architecture in a future post.`,
    status: "published",
    published_at: "2026-07-01T09:00:00.000Z",
    created_at: "2026-06-30T20:00:00.000Z",
    updated_at: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "demo-post-2",
    slug: "sparse-estimation-notes",
    title: "Notes on sparse estimation for LLM optimization",
    excerpt:
      "What replacing dense Pareto-table reevaluation actually buys you, in plain terms.",
    content_md: `GEPA-style optimizers spend most of their budget reevaluating a dense Pareto table. The observation driving my current research: most of those evaluations don't change any *decision*.

If candidate selection is the output that matters, you can estimate the table sparsely and keep the same selections with a fraction of the compute.

## The questions we're testing

1. **Selection agreement** — do sparse and dense runs pick the same candidates?
2. **Cost** — how many evaluations do we actually skip?
3. **Robustness** — does this hold across candidate-population sizes?

Early numbers look promising. Writing this up properly soon.`,
    status: "published",
    published_at: "2026-06-20T17:30:00.000Z",
    created_at: "2026-06-19T22:00:00.000Z",
    updated_at: "2026-06-20T17:30:00.000Z",
  },
  {
    id: "demo-post-3",
    slug: "draft-riscv-notes",
    title: "Field notes from a RISC-V AI SoC team",
    excerpt: "Draft — what performance characterization looks like in practice.",
    content_md: "Draft in progress.",
    status: "draft",
    published_at: null,
    created_at: "2026-07-02T15:00:00.000Z",
    updated_at: "2026-07-02T15:00:00.000Z",
  },
];

export const demoTasks: Task[] = [
  { id: "demo-task-1", title: "Ship personal site v1", done: false, due_date: "2026-07-05", position: 0, created_at: NOW },
  { id: "demo-task-2", title: "Run sparse-vs-dense agreement experiment (n=500)", done: false, due_date: "2026-07-08", position: 1, created_at: NOW },
  { id: "demo-task-3", title: "Draft RISC-V profiling blog post", done: false, due_date: null, position: 2, created_at: NOW },
  { id: "demo-task-4", title: "Update resume with ESWIN internship", done: true, due_date: null, position: 3, created_at: NOW },
  { id: "demo-task-5", title: "Review PR feedback on sparseeval", done: true, due_date: null, position: 4, created_at: NOW },
];

export const demoEvents: CalendarEvent[] = [
  { id: "demo-ev-1", title: "Research sync — Prof. Wu", starts_at: "2026-07-06T17:00:00.000Z", ends_at: "2026-07-06T18:00:00.000Z", notes: "Bring agreement plots" },
  { id: "demo-ev-2", title: "ESWIN standup", starts_at: "2026-07-07T01:00:00.000Z", ends_at: "2026-07-07T01:30:00.000Z", notes: null },
  { id: "demo-ev-3", title: "Site v1 launch", starts_at: "2026-07-05T20:00:00.000Z", ends_at: null, notes: "Deploy + share" },
  { id: "demo-ev-4", title: "Gym", starts_at: "2026-07-04T15:00:00.000Z", ends_at: "2026-07-04T16:00:00.000Z", notes: null },
];

export const demoCounters: Counter[] = [
  { id: "demo-c-1", label: "Papers read this year", value: 47, unit: null, icon: "📄" },
  { id: "demo-c-2", label: "LeetCode streak", value: 23, unit: "days", icon: "🔥" },
  { id: "demo-c-3", label: "Coffees consumed", value: 312, unit: null, icon: "☕" },
  { id: "demo-c-4", label: "Experiments launched", value: 18, unit: null, icon: "🧪" },
];

export const demoNowStatus: NowStatus = {
  focus: "Sparse estimation research + shipping this website",
  building: "Mission-control dashboard for this site",
  listening: "Vangelis — Blade Runner OST",
  location: "Los Angeles, CA",
  updated_at: NOW,
};

export const demoGuestbook: GuestbookEntry[] = [
  {
    id: "demo-g-1",
    author_name: "Ada L.",
    author_avatar: null,
    message: "The boot sequence got me. Incredible site.",
    user_id: "demo-user-1",
    created_at: "2026-07-02T04:12:00.000Z",
  },
  {
    id: "demo-g-2",
    author_name: "Kai",
    author_avatar: null,
    message: "Found the terminal easter egg 🚀",
    user_id: "demo-user-2",
    created_at: "2026-07-01T19:44:00.000Z",
  },
  {
    id: "demo-g-3",
    author_name: "Priya",
    author_avatar: null,
    message: "Signal received from Mumbai. Good luck with recruiting season!",
    user_id: "demo-user-3",
    created_at: "2026-06-30T11:03:00.000Z",
  },
];

function synthCalendar(): GithubStats["contributionCalendar"] {
  // Deterministic pseudo-random contribution pattern — looks organic,
  // renders identically on server and client (no hydration mismatch).
  const days: GithubStats["contributionCalendar"] = [];
  const start = new Date("2025-07-06T00:00:00.000Z");
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < 371; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const weekday = d.getUTCDay();
    const busy = weekday > 0 && weekday < 6 ? 0.75 : 0.45;
    const r = rand();
    const count = r < 1 - busy ? 0 : Math.floor(r * 14);
    const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;
    days.push({
      date: d.toISOString().slice(0, 10),
      count,
      level: level as 0 | 1 | 2 | 3 | 4,
    });
  }
  return days;
}

export const demoGithubStats: GithubStats = {
  totalContributions: 1287,
  totalCommits: 943,
  publicRepos: 14,
  totalStars: 87,
  followers: 42,
  topLanguages: [
    { name: "Python", color: "#3572A5", percent: 38 },
    { name: "TypeScript", color: "#3178c6", percent: 31 },
    { name: "C++", color: "#f34b7d", percent: 18 },
    { name: "JavaScript", color: "#f1e05a", percent: 13 },
  ],
  contributionCalendar: synthCalendar(),
};

export const demoLeetcodeStats: LeetcodeStats = {
  totalSolved: 412,
  easy: 128,
  medium: 214,
  hard: 70,
};

export const demoVisitorCount = 1024;
