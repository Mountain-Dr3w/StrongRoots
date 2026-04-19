import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  return (
    <main className="max-w-2xl mx-auto p-[var(--space-6)]">
      <Card>
        <CardTitle>New product</CardTitle>
        <CardBody>
          <form action={createProductAction} className="flex flex-col gap-[var(--space-3)]">
            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Type</span>
              <select
                name="type"
                defaultValue="plan"
                className="h-10 px-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)]"
              >
                <option value="plan">Plan</option>
                <option value="consulting">Consulting</option>
              </select>
            </label>

            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Slug</span>
              <Input name="slug" required placeholder="foundations-8-week" />
            </label>

            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Name</span>
              <Input name="name" required />
            </label>

            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Description</span>
              <Input name="description" />
            </label>

            <label className="flex flex-col gap-[var(--space-1)]">
              <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Price (cents)</span>
              <Input name="priceCents" type="number" required min="0" defaultValue={9900} />
            </label>

            <fieldset className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-[var(--space-3)] flex flex-col gap-[var(--space-2)]">
              <legend className="text-[var(--font-size-sm)] text-[var(--color-muted)] px-[var(--space-1)]">
                Plan fields (ignored for consulting)
              </legend>
              <label className="flex flex-col gap-[var(--space-1)]">
                <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Weeks</span>
                <Input name="weeks" type="number" min="1" defaultValue={8} />
              </label>
              <label className="flex flex-col gap-[var(--space-1)]">
                <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Level</span>
                <select
                  name="level"
                  defaultValue="beginner"
                  className="h-10 px-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
            </fieldset>

            <fieldset className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-[var(--space-3)] flex flex-col gap-[var(--space-2)]">
              <legend className="text-[var(--font-size-sm)] text-[var(--color-muted)] px-[var(--space-1)]">
                Consulting fields (ignored for plans)
              </legend>
              <label className="flex flex-col gap-[var(--space-1)]">
                <span className="text-[var(--font-size-sm)] text-[var(--color-muted)]">Duration (minutes)</span>
                <Input name="durationMinutes" type="number" min="15" defaultValue={60} />
              </label>
              <label className="flex items-center gap-[var(--space-2)]">
                <input type="checkbox" name="requiresIntake" defaultChecked />
                <span>Requires intake form</span>
              </label>
              <label className="flex items-center gap-[var(--space-2)]">
                <input type="checkbox" name="requiresDeposit" />
                <span>Requires deposit at booking</span>
              </label>
            </fieldset>

            <Button type="submit" variant="primary">Create</Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
