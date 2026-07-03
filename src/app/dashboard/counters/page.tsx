import { getCounters, getLeetcodeStats } from "@/lib/data";
import { CounterEditor } from "./CounterEditor";
import { LeetcodeEditor } from "./LeetcodeEditor";

export default async function CountersPage() {
  const [counters, leetcode] = await Promise.all([
    getCounters(),
    getLeetcodeStats(),
  ]);
  return (
    <div className="space-y-6">
      <CounterEditor initial={counters} />
      <LeetcodeEditor initial={leetcode} />
    </div>
  );
}
