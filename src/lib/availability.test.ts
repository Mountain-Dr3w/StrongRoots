import { describe, expect, it } from "vitest";

import { canCancel, computeOpenSlots } from "@/lib/availability";

describe("computeOpenSlots", () => {
  const rules = [
    { dayOfWeek: 1, startTime: "09:00", endTime: "12:00", timezone: "UTC" },
  ];

  it("returns slots that fit within the availability window", () => {
    const from = new Date("2026-06-01T00:00:00Z"); // Monday
    const to = new Date("2026-06-01T23:59:59Z");
    const slots = computeOpenSlots({
      from,
      to,
      durationMinutes: 60,
      rules,
      exceptions: [],
      bookings: [],
    });
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0].toISOString()).toBe("2026-06-01T09:00:00.000Z");
    const last = slots[slots.length - 1];
    expect(last.getTime() + 60 * 60 * 1000).toBeLessThanOrEqual(
      new Date("2026-06-01T12:00:00Z").getTime(),
    );
  });

  it("excludes blocked exception dates", () => {
    const from = new Date("2026-06-01T00:00:00Z");
    const to = new Date("2026-06-01T23:59:59Z");
    const slots = computeOpenSlots({
      from,
      to,
      durationMinutes: 60,
      rules,
      exceptions: [{ date: "2026-06-01", blocked: true }],
      bookings: [],
    });
    expect(slots).toHaveLength(0);
  });

  it("skips slots that conflict with an existing confirmed booking", () => {
    const from = new Date("2026-06-01T00:00:00Z");
    const to = new Date("2026-06-01T23:59:59Z");
    const slots = computeOpenSlots({
      from,
      to,
      durationMinutes: 60,
      rules,
      exceptions: [],
      bookings: [
        {
          startAt: new Date("2026-06-01T10:00:00Z"),
          endAt: new Date("2026-06-01T11:00:00Z"),
          status: "confirmed",
        },
      ],
    });
    for (const slot of slots) {
      const end = new Date(slot.getTime() + 60 * 60 * 1000);
      expect(
        end.getTime() <= new Date("2026-06-01T10:00:00Z").getTime() ||
          slot.getTime() >= new Date("2026-06-01T11:00:00Z").getTime(),
      ).toBe(true);
    }
  });

  it("ignores cancelled bookings when computing conflicts", () => {
    const from = new Date("2026-06-01T00:00:00Z");
    const to = new Date("2026-06-01T23:59:59Z");
    const slotsWithCancelled = computeOpenSlots({
      from,
      to,
      durationMinutes: 60,
      rules,
      exceptions: [],
      bookings: [
        {
          startAt: new Date("2026-06-01T10:00:00Z"),
          endAt: new Date("2026-06-01T11:00:00Z"),
          status: "cancelled",
        },
      ],
    });
    const slotsWithNone = computeOpenSlots({
      from,
      to,
      durationMinutes: 60,
      rules,
      exceptions: [],
      bookings: [],
    });
    expect(slotsWithCancelled.length).toBe(slotsWithNone.length);
  });
});

describe("canCancel", () => {
  it("allows cancellation more than 24h in advance", () => {
    const now = new Date("2026-06-01T12:00:00Z");
    const start = new Date("2026-06-03T12:00:00Z");
    expect(canCancel(start, now)).toBe(true);
  });

  it("blocks cancellation within 24h of the booking", () => {
    const now = new Date("2026-06-01T12:00:00Z");
    const start = new Date("2026-06-02T11:00:00Z");
    expect(canCancel(start, now)).toBe(false);
  });
});
