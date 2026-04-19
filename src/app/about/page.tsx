import type { Metadata } from "next";

import { Card, CardBody, CardTitle } from "@/components/Card";

export const metadata: Metadata = {
  title: "About",
  description: "Ashlyn is a trainer who turned her own recovery into a system others can use.",
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ashlyn",
  jobTitle: "Personal Trainer",
  url: "https://strongroots.example/about",
  sameAs: [],
};

export default function AboutPage() {
  return (
    <main className="min-h-screen p-[var(--space-8)]">
      <div className="max-w-2xl mx-auto flex flex-col gap-[var(--space-6)]">
        <h1 className="text-[var(--font-size-2xl)] font-semibold">About Ashlyn</h1>
        <p className="text-[var(--color-muted)]">
          Ashlyn is a trainer who turned her own recovery into a system others can use.
          She coaches mostly online, with a handful of 1:1 consulting slots each week.
          Full bio to be provided by Ashlyn — this is a placeholder.
        </p>
        <Card>
          <CardTitle>How I work</CardTitle>
          <CardBody className="flex flex-col gap-[var(--space-2)] text-[var(--color-muted)]">
            <p>Training should repair, not punish. Programs progress steadily; sessions check in.</p>
            <p>If a plan isn't right for where you are, we talk. No surprises.</p>
          </CardBody>
        </Card>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      </div>
    </main>
  );
}
