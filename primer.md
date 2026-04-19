# Session State

## Current Focus
Design system integration — Loam direction from `strong_roots_design/`. Phase 1 (foundation tokens + fonts) shipped on `main`. Phase 2 (primitives) and Phase 3 (screens) are filed and blocked-by Phase 1 (now unblocked).

## Last Completed
- StrongRoots-lk4 — Design system Phase 2: Button/Input/Card/Dialog/FaqAccordion rebuilt against the Loam spec. Button gains `secondary`/`tertiary` variants + optional `arrow` prop (primary/accent/tertiary auto-arrow). Input gains `label`/`hint`/`error` slots. Card gains `CardImage` 16:9 slot. Dialog + FaqAccordion retokenized.
- StrongRoots-6wz — Design system Phase 1: `--sr-*` tokens in globals.css, Instrument Serif + Manrope + JetBrains Mono via next/font, `data-theme=light` default. Legacy `--color-*`/`--radius-*`/`--font-size-*` aliased to sr equivalents through Phase 3.
- BD-001 — Drizzle schema (12 tables) + idempotent seed
- BD-002 — NextAuth v5 with magic-link + Google; middleware for /admin & /account
- BD-003 — Design system token seams (globals.css + primitive components)
- BD-004 — /shop catalog (URL-filtered by type)
- BD-005 — /shop/[slug] detail page + FAQ accordion
- BD-006 — Stripe Checkout action + webhook (idempotent order+entitlement)
- BD-007 — Entitlements + HMAC signed URLs for gated content
- BD-008 — Availability rules + consulting booking flow
- BD-009 — Customer dashboard (library/bookings/profile tabs)
- BD-010 — Admin dashboard (products CRUD, content, bookings, availability, customers)
- BD-011 — React Email templates (magic-link, receipt, booking conf/reminder/cancel) + sendEmail wrapper
- BD-012 — PWA manifest + metadata + offline fallback + mobile polish
- BD-013 — Marketing pages (/, /about, /contact) + robots + sitemap + structured data
- BD-014 — Dockerfile (multi-stage standalone) + docker-compose.yml + GitHub Actions (CI + deploy)

## Next Step
Design system Phase 3 — rebuild marketing pages against `strong_roots_design/design_source/applications.jsx` (split-tri hero, plans grid, consulting tiers), then account/admin. Tracked as StrongRoots-cs2. Final step of Phase 3: delete legacy `--color-*` / `--radius-*` / `--font-size-*` aliases from `globals.css`.

Operator verification still pending:
1. Provide real Stripe test keys → run through BD-006 end-to-end (checkout + webhook).
2. Provide Resend key + domain → verify BD-011 email delivery + BD-002 magic link.
3. Provide Google OAuth creds → verify BD-002 Google provider.
4. Set up Velveteen secrets (VELVETEEN_WEBHOOK_URL, VELVETEEN_TOKEN) → first deploy fires.
5. Confirm Velveteen subdomain.
6. Swap placeholder icons + design tokens with real design system assets (BD-003 seam).

## Open Blockers
- Full end-to-end verification of Stripe flows (test-mode keys required).
- Resend domain verification for real email delivery.
- Velveteen credentials + subdomain.

## Branch
main

## Notes
- `npm run db:up` to start local Postgres. `npm run db:push` to sync schema.
  `npm run db:seed` seeds admin + sample plan + Mon/Wed/Fri availability.
- `npm run test` runs Vitest (globalSetup resets + re-pushes test DB).
- `npm run build` produces a Next.js standalone build for Docker.
- CI: `.github/workflows/ci.yml` (lint + typecheck + test + build).
- Deploy: `.github/workflows/deploy.yml` builds+pushes to ghcr.io and triggers
  Velveteen webhook if secrets are set.
- Email, Stripe, Google, and Resend are all set up behind env-gated fallbacks,
  so the app boots + runs without any third-party keys.
