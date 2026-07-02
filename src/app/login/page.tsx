import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser, isOwner } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/data/config";
import { HudPanel } from "@/components/ui/HudPanel";
import { LoginButton } from "@/components/dashboard/LoginButton";

export const metadata: Metadata = {
  title: "Crew access",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (isOwner(user)) redirect("/dashboard");

  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <HudPanel title="Crew access" className="w-full max-w-sm text-center">
        <p className="text-sm text-ink-dim">
          This hatch opens for exactly one Google account.
        </p>
        <div className="mt-6">
          {isSupabaseConfigured() ? (
            <LoginButton />
          ) : (
            <p className="font-mono text-xs text-glow-warm">
              demo mode — dashboard is open at /dashboard
            </p>
          )}
        </div>
      </HudPanel>
    </div>
  );
}
