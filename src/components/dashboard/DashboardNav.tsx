"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Overview", icon: "◉" },
  { href: "/dashboard/tasks", label: "Tasks", icon: "☑" },
  { href: "/dashboard/calendar", label: "Calendar", icon: "▦" },
  { href: "/dashboard/posts", label: "Posts", icon: "✎" },
  { href: "/dashboard/now", label: "Now", icon: "◍" },
  { href: "/dashboard/counters", label: "Counters", icon: "±" },
  { href: "/dashboard/guestbook", label: "Guestbook", icon: "📡" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "∿" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col md:gap-0.5">
      {items.map(({ href, label, icon }) => {
        const active =
          href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-2.5 rounded-sm px-3 py-2 font-mono text-xs transition-colors ${
              active
                ? "bg-glow-a/15 text-glow-b"
                : "text-ink-dim hover:bg-white/5 hover:text-ink"
            }`}
          >
            <span aria-hidden className="w-4 text-center">{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
