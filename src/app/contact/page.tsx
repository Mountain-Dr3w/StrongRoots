import type { Metadata } from "next";

import { Card, CardBody, CardTitle } from "@/components/Card";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Ashlyn by email.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen p-[var(--space-8)]">
      <div className="max-w-xl mx-auto flex flex-col gap-[var(--space-6)]">
        <h1 className="text-[var(--font-size-2xl)] font-semibold">Contact</h1>
        <Card>
          <CardTitle>Email</CardTitle>
          <CardBody>
            <p>
              <a
                href="mailto:hello@strongroots.example"
                className="underline text-[var(--color-accent)]"
              >
                hello@strongroots.example
              </a>
            </p>
            <p className="text-[var(--color-muted)] mt-[var(--space-2)]">
              For booking questions, use the session CTA on the shop page.
            </p>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
