import { Button } from "@/components/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-[var(--space-6)] p-[var(--space-8)]">
      <h1
        className="text-[var(--font-size-2xl)] font-semibold text-[var(--color-fg)]"
      >
        StrongRoots
      </h1>
      <p className="text-[var(--color-muted)]">
        Themed primitive — swap <code>--color-primary</code> in <code>globals.css</code> to retheme.
      </p>
      <div className="flex gap-[var(--space-3)]">
        <Button variant="primary">Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
    </main>
  );
}
