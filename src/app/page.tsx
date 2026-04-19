import Link from "next/link";

import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";

export default function Home() {
  return (
    <main className="min-h-screen p-[var(--space-8)]">
      <div className="max-w-4xl mx-auto flex flex-col gap-[var(--space-8)]">
        <section className="text-center flex flex-col gap-[var(--space-4)] py-[var(--space-8)]">
          <h1 className="text-[var(--font-size-2xl)] font-semibold">
            Build strength that stays.
          </h1>
          <p className="text-[var(--color-muted)] max-w-xl mx-auto">
            Structured training plans and 1:1 consulting from Ashlyn — for people
            who want to stop starting over.
          </p>
          <div className="flex gap-[var(--space-3)] justify-center flex-wrap">
            <Link href="/shop?type=plan">
              <Button variant="primary" size="lg">Browse plans</Button>
            </Link>
            <Link href="/shop?type=consulting">
              <Button variant="ghost" size="lg">Book a session</Button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-4)]">
          <Card>
            <CardTitle>Plans</CardTitle>
            <CardBody className="text-[var(--color-muted)]">
              8 to 12-week programs with downloadable PDFs and video. Train on your schedule.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Consulting</CardTitle>
            <CardBody className="text-[var(--color-muted)]">
              1:1 sessions over video. Ashlyn reviews your training, form, and goals.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Built for mobile</CardTitle>
            <CardBody className="text-[var(--color-muted)]">
              Install as a PWA. Check your plan between sets.
            </CardBody>
          </Card>
        </section>
      </div>
    </main>
  );
}
