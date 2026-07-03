import Link from "next/link";
import { GlowButton } from "@/components/ui/GlowButton";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="hud-label">signal 404</p>
      <h1 className="mt-4 text-4xl font-semibold glow-text sm:text-5xl">
        Lost in space
      </h1>
      <p className="mt-4 max-w-md text-sm text-ink-dim">
        This coordinate doesn&apos;t exist in the system. The star charts may
        have changed, or the transmission was never sent.
      </p>
      <div className="mt-8">
        <GlowButton href="/">Return to the star system</GlowButton>
      </div>
      <Link
        href="/blog"
        className="mt-4 font-mono text-xs text-ink-dim hover:text-glow-b"
      >
        or check the transmission log →
      </Link>
    </div>
  );
}
