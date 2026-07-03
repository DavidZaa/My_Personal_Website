import { BootSequence } from "@/components/boot/BootSequence";
import { Hero } from "@/components/hero/Hero";
import { Starfield } from "@/components/voyage/Starfield";
import { Waypoint } from "@/components/voyage/Waypoint";
import { DossierSection } from "@/components/voyage/DossierSection";
import { PayloadBay } from "@/components/voyage/PayloadBay";
import { TransmissionSection } from "@/components/voyage/TransmissionSection";
import { TelemetryDeck } from "@/components/voyage/TelemetryDeck";
import { SignalStream } from "@/components/voyage/SignalStream";
import { isSupabaseConfigured } from "@/lib/data/config";
import {
  getCounters,
  getGithubStats,
  getGuestbookEntries,
  getLeetcodeStats,
  getPublishedPosts,
  getVisitorCount,
  recordPageView,
} from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [github, leetcode, counters, visitors, posts, guestbook] =
    await Promise.all([
      getGithubStats(),
      getLeetcodeStats(),
      getCounters(),
      getVisitorCount(),
      getPublishedPosts(),
      getGuestbookEntries(),
    ]);
  void recordPageView("/");

  return (
    <>
      <BootSequence />
      <Starfield />

      {/* Waypoint 01 — the map itself */}
      <Hero />

      <div className="space-y-10 pb-10">
        <Waypoint index={2} label="crew dossier" />
        <DossierSection />

        <Waypoint index={3} label="payload bay" />
        <PayloadBay />

        <Waypoint index={4} label="incoming transmission" />
        <TransmissionSection post={posts[0] ?? null} />

        <Waypoint index={5} label="telemetry deck" />
        <TelemetryDeck
          github={github}
          leetcode={leetcode}
          counters={counters}
          visitors={visitors}
        />

        <Waypoint index={6} label="signal stream" />
        <SignalStream entries={guestbook} configured={isSupabaseConfigured()} />
      </div>
    </>
  );
}
