import { eq } from "drizzle-orm";

import { db, schema } from "@/db";

export async function seed() {
  const adminEmail = "ashlyn@strongroots.local";

  const existingAdmin = await db.query.users.findFirst({
    where: eq(schema.users.email, adminEmail),
  });

  const adminId =
    existingAdmin?.id ??
    (
      await db
        .insert(schema.users)
        .values({
          email: adminEmail,
          name: "Ashlyn",
          role: "admin",
          timezone: "America/New_York",
        })
        .returning({ id: schema.users.id })
    )[0].id;

  const sampleSlug = "foundations-8-week";

  const existingProduct = await db.query.products.findFirst({
    where: eq(schema.products.slug, sampleSlug),
  });

  let productId: string;
  if (existingProduct) {
    productId = existingProduct.id;
  } else {
    const [inserted] = await db
      .insert(schema.products)
      .values({
        slug: sampleSlug,
        type: "plan",
        name: "Foundations: 8-Week Starter",
        description: "An 8-week introduction to strength training fundamentals.",
        priceCents: 9900,
        stripePriceId: "price_seed_foundations",
        active: true,
      })
      .returning({ id: schema.products.id });
    productId = inserted.id;
  }

  const existingPlan = await db.query.plans.findFirst({
    where: eq(schema.plans.productId, productId),
  });

  if (!existingPlan) {
    await db.insert(schema.plans).values({
      productId,
      weeks: 8,
      level: "beginner",
      fileBundleKey: "bundles/foundations-8-week.zip",
    });
  }

  const existingRule = await db.query.availabilityRules.findFirst();
  if (!existingRule) {
    await db.insert(schema.availabilityRules).values([
      { dayOfWeek: 1, startTime: "09:00", endTime: "12:00", timezone: "America/New_York" },
      { dayOfWeek: 3, startTime: "13:00", endTime: "17:00", timezone: "America/New_York" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "12:00", timezone: "America/New_York" },
    ]);
  }

  console.log(`Seed complete: admin=${adminId} product=${productId}`);
  return { adminId, productId };
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
