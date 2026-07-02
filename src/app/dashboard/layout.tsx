import type { Metadata } from "next";
import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/data/config";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { SignOutButton } from "@/components/dashboard/SignOutButton";

export const metadata: Metadata = {
  title: "Mission Control",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOwner();
  const demo = !isSupabaseConfigured();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-line bg-[rgba(5,5,16,0.85)]">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-xs text-ink-dim hover:text-ink"
            >
              ← site
            </Link>
            <span className="text-line">|</span>
            <p className="font-mono text-xs font-semibold tracking-[0.2em]">
              MISSION CONTROL
            </p>
            <span className="live-dot" aria-hidden />
          </div>
          <SignOutButton />
        </div>
        {demo && (
          <div className="border-t border-glow-warm/30 bg-glow-warm/10 px-4 py-1.5 text-center font-mono text-[11px] text-glow-warm">
            demo mode — Supabase not configured; edits won&apos;t persist. See
            .env.example to go live.
          </div>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row">
        <aside className="md:w-48 md:shrink-0">
          <DashboardNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
