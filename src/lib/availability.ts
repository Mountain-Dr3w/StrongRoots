import { addMinutes, isBefore } from "date-fns";

export interface AvailabilityRule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface AvailabilityException {
  date: string;
  blocked: boolean;
}

export interface ExistingBooking {
  startAt: Date;
  endAt: Date;
  status: string;
}

export interface SlotQuery {
  from: Date;
  to: Date;
  durationMinutes: number;
  rules: AvailabilityRule[];
  exceptions: AvailabilityException[];
  bookings: ExistingBooking[];
}

function parseTime(time: string): { hours: number; minutes: number } {
  const [h, m] = time.split(":");
  return { hours: Number(h), minutes: Number(m) };
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function computeOpenSlots(q: SlotQuery): Date[] {
  const results: Date[] = [];
  const blockedDates = new Set(
    q.exceptions.filter((e) => e.blocked).map((e) => e.date),
  );

  const activeBookings = q.bookings.filter(
    (b) => b.status !== "cancelled" && b.status !== "no_show",
  );

  for (let t = new Date(q.from); isBefore(t, q.to); t = addMinutes(t, 15)) {
    const candidate = new Date(t);
    if (blockedDates.has(isoDate(candidate))) continue;

    const weekday = candidate.getUTCDay();
    const matched = q.rules.find((r) => r.dayOfWeek === weekday);
    if (!matched) continue;

    const { hours: startH, minutes: startM } = parseTime(matched.startTime);
    const { hours: endH, minutes: endM } = parseTime(matched.endTime);

    const startOfWindow = new Date(
      Date.UTC(
        candidate.getUTCFullYear(),
        candidate.getUTCMonth(),
        candidate.getUTCDate(),
        startH,
        startM,
      ),
    );
    const endOfWindow = new Date(
      Date.UTC(
        candidate.getUTCFullYear(),
        candidate.getUTCMonth(),
        candidate.getUTCDate(),
        endH,
        endM,
      ),
    );

    const slotEnd = addMinutes(candidate, q.durationMinutes);
    if (isBefore(candidate, startOfWindow)) continue;
    if (isBefore(endOfWindow, slotEnd)) continue;

    const conflicts = activeBookings.some(
      (b) => isBefore(b.startAt, slotEnd) && isBefore(candidate, b.endAt),
    );
    if (conflicts) continue;

    if (candidate.getUTCMinutes() % Math.min(q.durationMinutes, 30) !== 0) continue;

    results.push(candidate);
  }

  return results;
}

export function canCancel(startAt: Date, now: Date = new Date()): boolean {
  const diffMs = startAt.getTime() - now.getTime();
  return diffMs >= 24 * 60 * 60 * 1000;
}
