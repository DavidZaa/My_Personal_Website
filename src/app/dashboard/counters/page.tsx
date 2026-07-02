import { getCounters } from "@/lib/data";
import { CounterEditor } from "./CounterEditor";

export default async function CountersPage() {
  const counters = await getCounters();
  return <CounterEditor initial={counters} />;
}
