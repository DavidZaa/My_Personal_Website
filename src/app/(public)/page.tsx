import { HudPanel } from "@/components/ui/HudPanel";
import { profile } from "@/lib/content/profile";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <HudPanel title="System check">
        <h1 className="text-3xl font-semibold glow-text">{profile.name}</h1>
        <p className="mt-2 text-ink-dim">
          {profile.title} — star system deploying shortly.
        </p>
      </HudPanel>
    </div>
  );
}
