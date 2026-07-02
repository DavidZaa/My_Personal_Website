import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { getEvents } from "@/lib/data";
import { MonthCalendar } from "./MonthCalendar";

type Props = { searchParams: Promise<{ m?: string }> };

export default async function CalendarPage({ searchParams }: Props) {
  const { m } = await searchParams;
  const month = /^\d{4}-\d{2}$/.test(m ?? "")
    ? new Date(`${m}-01T00:00:00`)
    : new Date();

  // Fetch a padded range so leading/trailing grid days have their events.
  const rangeStart = startOfMonth(addMonths(month, -1)).toISOString();
  const rangeEnd = endOfMonth(addMonths(month, 1)).toISOString();
  const events = await getEvents(rangeStart, rangeEnd);

  return <MonthCalendar monthKey={format(month, "yyyy-MM")} events={events} />;
}
