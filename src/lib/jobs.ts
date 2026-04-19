import { createElement } from "react";
import { eq } from "drizzle-orm";

import BookingCancellationEmail from "@/emails/BookingCancellation";
import BookingConfirmationEmail from "@/emails/BookingConfirmation";
import BookingReminderEmail from "@/emails/BookingReminder";
import ReceiptEmail from "@/emails/Receipt";
import { db, schema } from "@/db";
import { env } from "@/env";
import { sendEmail } from "@/lib/email";

export interface JobPayload {
  sendReceiptEmail: { orderId: string };
  sendBookingConfirmation: { bookingId: string };
  sendBookingReminder: { bookingId: string };
  sendBookingCancellation: { bookingId: string };
}

const baseUrl = () => env.AUTH_URL ?? "http://localhost:3000";

async function handleReceipt({ orderId }: JobPayload["sendReceiptEmail"]) {
  const order = await db.query.orders.findFirst({
    where: eq(schema.orders.id, orderId),
    with: { product: true, user: true } as never,
  });
  if (!order) return;

  const product = await db.query.products.findFirst({ where: eq(schema.products.id, order.productId) });
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, order.userId) });
  if (!product || !user?.email) return;

  await sendEmail({
    to: user.email,
    subject: `Your ${product.name} is ready`,
    template: "receipt",
    react: createElement(ReceiptEmail, {
      productName: product.name,
      amountCents: order.amountCents,
      accessUrl: `${baseUrl()}/account/library`,
    }),
  });
}

async function handleBookingConfirmation({ bookingId }: JobPayload["sendBookingConfirmation"]) {
  const booking = await db.query.bookings.findFirst({ where: eq(schema.bookings.id, bookingId) });
  if (!booking) return;

  const offering = await db.query.consultingOfferings.findFirst({
    where: eq(schema.consultingOfferings.id, booking.offeringId),
  });
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, booking.userId) });
  if (!offering || !user?.email) return;
  const product = await db.query.products.findFirst({ where: eq(schema.products.id, offering.productId) });
  if (!product) return;

  await sendEmail({
    to: user.email,
    subject: "Booking confirmed",
    template: "booking-confirmation",
    react: createElement(BookingConfirmationEmail, {
      productName: product.name,
      startAtIso: booking.startAt.toISOString(),
      forAdmin: false,
    }),
  });

  const admin = await db.query.users.findFirst({ where: eq(schema.users.role, "admin") });
  if (admin?.email) {
    await sendEmail({
      to: admin.email,
      subject: `New booking — ${product.name}`,
      template: "booking-confirmation-admin",
      react: createElement(BookingConfirmationEmail, {
        productName: product.name,
        startAtIso: booking.startAt.toISOString(),
        forAdmin: true,
        userEmail: user.email,
      }),
    });
  }
}

async function handleBookingReminder({ bookingId }: JobPayload["sendBookingReminder"]) {
  const booking = await db.query.bookings.findFirst({ where: eq(schema.bookings.id, bookingId) });
  if (!booking) return;
  const offering = await db.query.consultingOfferings.findFirst({
    where: eq(schema.consultingOfferings.id, booking.offeringId),
  });
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, booking.userId) });
  if (!offering || !user?.email) return;
  const product = await db.query.products.findFirst({ where: eq(schema.products.id, offering.productId) });
  if (!product) return;

  await sendEmail({
    to: user.email,
    subject: `Reminder: ${product.name} tomorrow`,
    template: "booking-reminder",
    react: createElement(BookingReminderEmail, {
      productName: product.name,
      startAtIso: booking.startAt.toISOString(),
    }),
  });
}

async function handleBookingCancellation({ bookingId }: JobPayload["sendBookingCancellation"]) {
  const booking = await db.query.bookings.findFirst({ where: eq(schema.bookings.id, bookingId) });
  if (!booking) return;
  const offering = await db.query.consultingOfferings.findFirst({
    where: eq(schema.consultingOfferings.id, booking.offeringId),
  });
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, booking.userId) });
  if (!offering || !user?.email) return;
  const product = await db.query.products.findFirst({ where: eq(schema.products.id, offering.productId) });
  if (!product) return;

  await sendEmail({
    to: user.email,
    subject: "Booking cancelled",
    template: "booking-cancellation",
    react: createElement(BookingCancellationEmail, {
      productName: product.name,
      startAtIso: booking.startAt.toISOString(),
    }),
  });
}

/**
 * Enqueue a job. Current implementation runs jobs inline; BD-014 or a future
 * refactor can swap in graphile-worker's quickAddJob without touching callers.
 */
export async function enqueueJob<K extends keyof JobPayload>(
  name: K,
  payload: JobPayload[K],
): Promise<void> {
  console.log(`[jobs] run ${String(name)}`, payload);
  switch (name) {
    case "sendReceiptEmail":
      await handleReceipt(payload as JobPayload["sendReceiptEmail"]);
      return;
    case "sendBookingConfirmation":
      await handleBookingConfirmation(payload as JobPayload["sendBookingConfirmation"]);
      return;
    case "sendBookingReminder":
      await handleBookingReminder(payload as JobPayload["sendBookingReminder"]);
      return;
    case "sendBookingCancellation":
      await handleBookingCancellation(payload as JobPayload["sendBookingCancellation"]);
      return;
  }
}
