import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
import { updateProductAction } from "../actions";

type PageParams = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: PageParams }) {
  const { id } = await params;
  const product = await db.query.products.findFirst({ where: eq(schema.products.id, id) });
  if (!product) notFound();

  return (
    <main className="max-w-2xl mx-auto p-[var(--space-6)]">
      <Card>
        <CardTitle>{product.name}</CardTitle>
        <CardBody>
          <form action={updateProductAction} className="flex flex-col gap-[var(--space-3)]">
            <input type="hidden" name="id" value={product.id} />

            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Name</span>
              <Input name="name" defaultValue={product.name} required />
            </label>

            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Description</span>
              <Input name="description" defaultValue={product.description ?? ""} />
            </label>

            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Price (cents)</span>
              <Input name="priceCents" type="number" defaultValue={product.priceCents} required />
            </label>

            <label className="flex items-center gap-[var(--space-2)]">
              <input type="checkbox" name="active" defaultChecked={product.active} />
              <span>Active</span>
            </label>

            <Button type="submit" variant="primary">Save</Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
