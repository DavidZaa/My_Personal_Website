import { BootSequence } from "@/components/boot/BootSequence";
import { Hero } from "@/components/hero/Hero";
import { Starfield } from "@/components/voyage/Starfield";
import { DescentTransition } from "@/components/voyage/DescentTransition";
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

      <div className="space-y-28 pb-16">
        <div>
          <DescentTransition />
          <DossierSection />
        </div>
        <PayloadBay />
        <TransmissionSection post={posts[0] ?? null} />
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
