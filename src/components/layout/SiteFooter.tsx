import Link from "next/link";
import { profile } from "@/lib/content/profile";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="font-mono text-xs text-ink-dim">
          © {new Date().getFullYear()} David Zhang · transmitted from Los
          Angeles
        </p>
        <div className="flex items-center gap-5 font-mono text-xs">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-dim transition-colors hover:text-glow-b"
          >
            GitHub
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-dim transition-colors hover:text-glow-b"
          >
            LinkedIn
          </a>
          <a
            href={profile.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-dim transition-colors hover:text-glow-b"
          >
            Instagram
          </a>
          <a
            href={`mailto:${profile.links.email}`}
            className="text-ink-dim transition-colors hover:text-glow-b"
          >
            Email
          </a>
          <Link
            href="/dashboard"
            aria-label="Crew access"
            title="Crew access"
            className="text-ink-dim/40 transition-colors hover:text-glow-a"
          >
            ◈
          </Link>
        </div>
      </div>
    </footer>
  );
}
