export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  due_date: string | null;
  position: number;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  notes: string | null;
}

export interface Counter {
  id: string;
  label: string;
  value: number;
  unit: string | null;
  icon: string | null;
}

export interface NowStatus {
  focus: string;
  building: string;
  listening: string | null;
  location: string | null;
  updated_at: string;
}

export interface GuestbookEntry {
  id: string;
  author_name: string;
  author_avatar: string | null;
  message: string;
  user_id: string;
  created_at: string;
}

export interface GithubStats {
  totalContributions: number;
  totalCommits: number;
  publicRepos: number;
  totalStars: number;
  followers: number;
  topLanguages: { name: string; color: string; percent: number }[];
  /** 53 weeks × 7 days of contribution counts, oldest week first */
  contributionCalendar: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
}

export interface LeetcodeStats {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
}

export type StatCacheKey = "github" | "leetcode";

export interface WriteResult {
  ok: boolean;
  demo?: boolean;
  error?: string;
  id?: string;
}

export interface PageViewStat {
  path: string;
  day: string;
  count: number;
}
