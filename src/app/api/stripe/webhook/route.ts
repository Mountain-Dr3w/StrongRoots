import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { env } from "@/env";
import { enqueueJob } from "@/lib/jobs";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("[stripe] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object;
    const stripeSessionId = checkoutSession.id;

    const existingOrder = await db.query.orders.findFirst({
      where: eq(schema.orders.stripeSessionId, stripeSessionId),
    });
    if (existingOrder) {
      return NextResponse.json({ received: true, deduped: true });
    }

    const userId = checkoutSession.metadata?.userId;
    const productId = checkoutSession.metadata?.productId;
    if (!userId || !productId) {
      console.error("[stripe] checkout.session.completed missing metadata", stripeSessionId);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const [order] = await db
      .insert(schema.orders)
      .values({
        userId,
        productId,
        stripeSessionId,
        amountCents: checkoutSession.amount_total ?? 0,
        status: "paid",
      })
      .returning({ id: schema.orders.id });

    await db.insert(schema.entitlements).values({ userId, productId });

    await enqueueJob("sendReceiptEmail", { orderId: order.id });
  }

  return NextResponse.json({ received: true });
}
