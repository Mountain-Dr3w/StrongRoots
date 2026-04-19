"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db, schema } from "@/db";
import { canCancel } from "@/lib/availability";
import { enqueueJob } from "@/lib/jobs";
import { getStripe } from "@/lib/stripe";

export async function createBookingAction(formData: FormData) {
  const session = await auth();
  if (!session) redirect("/signin?callbackUrl=/shop");

  const offeringId = formData.get("offeringId") as string;
  const startAtIso = formData.get("startAt") as string;
  if (!offeringId || !startAtIso) redirect("/shop");

  const offering = await db.query.consultingOfferings.findFirst({
    where: eq(schema.consultingOfferings.id, offeringId),
  });
  if (!offering) redirect("/shop");

  const startAt = new Date(startAtIso);
  const endAt = new Date(startAt.getTime() + offering.durationMinutes * 60 * 1000);

  const status = offering.requiresDeposit ? "pending_payment" : "confirmed";

  const [booking] = await db
    .insert(schema.bookings)
    .values({
      userId: session.user.id,
      offeringId,
      startAt,
      endAt,
      status,
    })
    .returning({ id: schema.bookings.id });

  if (offering.requiresIntake) {
    const answers: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("intake_")) answers[key.slice("intake_".length)] = value;
    }
    await db.insert(schema.intakeForms).values({
      bookingId: booking.id,
      answers,
    });
  }

  if (offering.requiresDeposit) {
    const stripe = getStripe();
    if (stripe) {
      const product = await db.query.products.findFirst({
        where: eq(schema.products.id, offering.productId),
      });
      if (product) {
        const pi = await stripe.paymentIntents.create({
          amount: product.priceCents,
          currency: "usd",
          metadata: { bookingId: booking.id, userId: session.user.id },
        });
        await db
          .update(schema.bookings)
          .set({ stripePaymentIntentId: pi.id })
          .where(eq(schema.bookings.id, booking.id));
        redirect(`/book/confirm/${booking.id}?clientSecret=${pi.client_secret}`);
      }
    }
  }

  await enqueueJob("sendBookingConfirmation", { bookingId: booking.id });
  redirect(`/account`);
}

export async function cancelBookingAction(formData: FormData) {
  const session = await auth();
  if (!session) redirect("/signin");

  const bookingId = formData.get("bookingId") as string;
  const booking = await db.query.bookings.findFirst({
    where: eq(schema.bookings.id, bookingId),
  });
  if (!booking || booking.userId !== session.user.id) redirect("/account");

  const newStatus = canCancel(booking.startAt) ? "cancelled" : booking.status;
  if (newStatus !== booking.status) {
    await db
      .update(schema.bookings)
      .set({ status: "cancelled" })
      .where(eq(schema.bookings.id, bookingId));
  } else {
    // late cancel: flag for admin review. BD-010 surfaces these; for now we log.
    console.log(`[booking] late-cancel requested for ${bookingId} — needs admin review`);
  }

  redirect("/account");
}
