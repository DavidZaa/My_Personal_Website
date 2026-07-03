"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#dossier", label: "About" },
  { href: "/#payload", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/now", label: "Now" },
  { href: "/guestbook", label: "Guestbook" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-[rgba(5,5,16,0.7)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-[0.25em] text-ink transition-colors hover:text-glow-b"
        >
          DZ<span className="text-glow-a">-01</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-sm px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "text-glow-b"
                    : "text-ink-dim hover:bg-white/5 hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          data-palette-trigger
          className="hud-panel hidden items-center gap-2 rounded-sm px-2.5 py-1 font-mono text-xs text-ink-dim transition-colors hover:text-ink sm:flex"
          aria-label="Open command palette"
        >
          <span>⌘K</span>
        </button>

        {/* Mobile nav: compact row of links */}
        <nav className="flex items-center gap-3 sm:hidden">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-ink-dim hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
