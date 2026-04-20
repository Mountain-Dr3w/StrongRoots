import type { Metadata } from "next";

import { Eyebrow } from "@/components/site/Eyebrow";
import { SiteShell } from "@/components/site/SiteShell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Ashlyn by email.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="px-6 md:px-10 pt-16 md:pt-24 pb-24 md:pb-32">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>Get in touch</Eyebrow>
            <h1 className="font-[var(--sr-font-display)] font-normal text-[var(--sr-ink)] text-[48px] md:text-[64px] leading-[var(--sr-lh-tight)] tracking-[-0.02em]">
              Say hello.
            </h1>
            <p className="text-[var(--sr-ink-soft)] text-[17px] leading-[var(--sr-lh-normal)] max-w-xl">
              For booking questions, use the session CTA on the shop page. For everything
              else, a note to the address below is the fastest way through.
            </p>
          </div>

          <div className="border-t border-[var(--sr-line-soft)] pt-10 flex flex-col gap-6">
            <Eyebrow>Email</Eyebrow>
            <a
              href="mailto:hello@strongroots.example"
              className="font-[var(--sr-font-display)] text-[36px] md:text-[48px] text-[var(--sr-ink)] hover:text-[var(--sr-ink-soft)] transition-colors break-all"
            >
              hello@strongroots.example
            </a>
            <p className="font-[var(--sr-font-mono)] text-[13px] text-[var(--sr-ink-muted)]">
              Replies within 2 business days.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
