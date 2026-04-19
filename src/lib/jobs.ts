/**
 * Job-queue shim. BD-011 wires up graphile-worker for real. For now, enqueued
 * jobs log to the console; webhook handlers call these so we can swap in the
 * real runner without touching call sites.
 */
export interface JobPayload {
  sendReceiptEmail: { orderId: string };
  sendBookingConfirmation: { bookingId: string };
  sendBookingReminder: { bookingId: string };
}

export async function enqueueJob<K extends keyof JobPayload>(
  name: K,
  payload: JobPayload[K],
): Promise<void> {
  console.log(`[jobs] enqueue ${String(name)}`, payload);
}
