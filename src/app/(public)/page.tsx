import { BootSequence } from "@/components/boot/BootSequence";
import { Hero } from "@/components/hero/Hero";
import { Starfield } from "@/components/voyage/Starfield";
import { Bulkhead } from "@/components/voyage/Bulkhead";
import { DossierSection } from "@/components/voyage/DossierSection";
import { HangarBay } from "@/components/voyage/HangarBay";
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

      <div className="space-y-28 pb-16">
        {/* Crew deck and payload deck are adjoining ship interiors —
            joined by a bulkhead seam, not separated by open space. */}
        <div>
          <DossierSection />
          <Bulkhead label="deck 02 · payload bay" />
          <HangarBay />
        </div>
        <TransmissionSection posts={posts} />
        <TelemetryDeck
          github={github}
          leetcode={leetcode}
          counters={counters}
          visitors={visitors}
        />
        <SignalStream entries={guestbook} configured={isSupabaseConfigured()} />
      </div>
    </>
  );
}
