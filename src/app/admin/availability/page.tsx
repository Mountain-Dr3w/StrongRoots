import { asc } from "drizzle-orm";

import { db, schema } from "@/db";
import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
import {
  addExceptionAction,
  addRuleAction,
  deleteExceptionAction,
  deleteRuleAction,
} from "./actions";

export const dynamic = "force-dynamic";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function AdminAvailability() {
  const rules = await db.select().from(schema.availabilityRules).orderBy(asc(schema.availabilityRules.dayOfWeek));
  const exceptions = await db
    .select()
    .from(schema.availabilityExceptions)
    .orderBy(asc(schema.availabilityExceptions.date));

  return (
    <main className="max-w-4xl mx-auto p-[var(--space-6)] flex flex-col gap-[var(--space-6)]">
      <h1 className="font-[var(--sr-font-display)] text-[44px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">Availability</h1>

      <Card>
        <CardTitle>Weekly rules</CardTitle>
        <CardBody className="flex flex-col gap-[var(--space-3)]">
          {rules.length === 0 ? (
            <p className="text-[var(--sr-ink-muted)]">No rules yet.</p>
          ) : (
            <div className="flex flex-col gap-[var(--space-2)]">
              {rules.map((r) => (
                <form
                  key={r.id}
                  action={deleteRuleAction}
                  className="flex items-center justify-between gap-[var(--space-3)] p-[var(--space-2)] border border-[var(--sr-line-soft)] rounded-[var(--sr-radius-sm)]"
                >
                  <input type="hidden" name="id" value={r.id} />
                  <div>
                    <strong>{WEEKDAYS[r.dayOfWeek]}</strong> {r.startTime}–{r.endTime} ({r.timezone})
                  </div>
                  <Button type="submit" variant="ghost" size="sm">Delete</Button>
                </form>
              ))}
            </div>
          )}

          <form action={addRuleAction} className="grid grid-cols-2 sm:grid-cols-5 gap-[var(--space-2)] pt-[var(--space-3)] border-t border-[var(--sr-line-soft)]">
            <select
              name="dayOfWeek"
              defaultValue="1"
              className="h-10 px-3 rounded-[var(--sr-radius-md)] bg-[var(--sr-surface)] border border-[var(--sr-line-soft)]"
            >
              {WEEKDAYS.map((d, i) => (
                <option key={i} value={i}>{d}</option>
              ))}
            </select>
            <Input name="startTime" placeholder="09:00" defaultValue="09:00" />
            <Input name="endTime" placeholder="17:00" defaultValue="17:00" />
            <Input name="timezone" placeholder="America/New_York" defaultValue="America/New_York" />
            <Button type="submit" variant="primary">Add</Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>Exceptions (blocked dates)</CardTitle>
        <CardBody className="flex flex-col gap-[var(--space-3)]">
          {exceptions.length === 0 ? (
            <p className="text-[var(--sr-ink-muted)]">No exceptions yet.</p>
          ) : (
            <div className="flex flex-col gap-[var(--space-2)]">
              {exceptions.map((e) => (
                <form
                  key={e.id}
                  action={deleteExceptionAction}
                  className="flex items-center justify-between gap-[var(--space-3)] p-[var(--space-2)] border border-[var(--sr-line-soft)] rounded-[var(--sr-radius-sm)]"
                >
                  <input type="hidden" name="id" value={e.id} />
                  <div>
                    <strong>{e.date}</strong> {e.blocked ? "— blocked" : "— open"}
                    {e.note ? ` — ${e.note}` : ""}
                  </div>
                  <Button type="submit" variant="ghost" size="sm">Delete</Button>
                </form>
              ))}
            </div>
          )}

          <form action={addExceptionAction} className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--space-2)] pt-[var(--space-3)] border-t border-[var(--sr-line-soft)]">
            <Input name="date" type="date" required />
            <Input name="note" placeholder="Holiday" />
            <label className="flex items-center gap-[var(--space-2)]">
              <input type="checkbox" name="blocked" defaultChecked />
              <span>Blocked</span>
            </label>
            <Button type="submit" variant="primary">Add</Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
