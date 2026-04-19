# Session State

## Current Focus
BD-001 (database schema + migrations) is CLOSED. Plan for BD-002 (auth) and BD-003 (design system) — both unblocked. User directive: work through all 14 tickets and push to github.com/Mountain-Dr3w/StrongRoots.

## Last Completed
- BD-001: full Drizzle schema (12 tables across auth/products/commerce/scheduling/content/email), Vitest round-trip tests for every table group, idempotent `npm run db:seed` (admin user + Foundations 8-Week plan). `drizzle-kit push` runs clean against local Postgres (`npm run db:up`).

## Next Step
`bd ready` returns `StrongRoots-bo5` (BD-002 auth) and `StrongRoots-roo` (BD-003 design system). BD-003 has no external dependencies — ideal next. BD-002 can scaffold with placeholder env; full email magic link requires Resend API key from operator.

## Open Blockers
- **BD-002 (auth)** — needs `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `AUTH_SECRET`. Scaffold works without; verification needs keys.
- **BD-006 (Stripe checkout)** — needs Stripe test-mode keys + webhook secret.
- **BD-008 (consulting booking)** — needs Stripe.
- **BD-011 (transactional email)** — needs Resend.
- **BD-014 (Velveteen deploy)** — needs Velveteen subdomain + registry creds + webhook URL.

## Branch
main

## Notes
- Local DB: `npm run db:up` (docker compose), then `npm run db:push`, then `npm run db:seed`.
- Tests: `npm run test` — Vitest with globalSetup that drops+pushes schema against DATABASE_URL_TEST before every run.
- GitHub remote: `git@github.com:Mountain-Dr3w/StrongRoots.git` (HTTPS via gh).
- Design system integration is external; do not invent visuals. BD-003 only wires token seams.
- Stripe account must be in test mode until BD-006 ships and is QA'd.
