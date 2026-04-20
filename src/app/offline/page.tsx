import { Eyebrow } from "@/components/site/Eyebrow";
import { Logo } from "@/components/site/Logo";

export const metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-[var(--sr-bg)]">
      <div className="max-w-md flex flex-col gap-8 items-start">
        <Logo tone="light" height={20} />
        <div className="flex flex-col gap-4">
          <Eyebrow>Connection lost</Eyebrow>
          <h1 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[40px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
            You're offline.
          </h1>
          <p className="text-[var(--sr-ink-soft)] leading-[var(--sr-lh-normal)]">
            Reconnect and we'll pick up where you left off. Your library content requires an
            active connection to stream securely.
          </p>
        </div>
        <p className="font-[var(--sr-font-mono)] text-[11px] text-[var(--sr-ink-muted)]">
          Tip: cached pages load fine. The gated content does not.
        </p>
      </div>
    </main>
  );
}
