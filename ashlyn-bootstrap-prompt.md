# Claude Code Bootstrap Prompt — Ashlyn Training Platform

**Paste everything below this line into Claude Code in an empty directory.**

---

You are bootstrapping a new project. Read this entire prompt, then execute the tasks in order. Do not skip steps. Do not ask for clarification on decisions already made — they are deliberate.

## Project Context

We are building **Ashlyn Training**, a full-service online training platform for a personal trainer named Ashlyn. The platform sells digital training plans, offers 1:1 consulting bookings, and delivers gated digital content to paying customers. Mobile-first, scales to desktop web. The aesthetic and voice layer is handled externally by a design system that will be wired in later — do not invent visual direction. Leave tokens, slots, and component seams in place.

## Non-Negotiables

- Next.js 14 App Router, TypeScript strict, Tailwind CSS
- Drizzle ORM against PostgreSQL
- NextAuth v5 (email magic link + Google)
- Stripe for payments
- Resend + React Email for transactional mail
- graphile-worker for background jobs (Postgres-backed, no Redis)
- PWA shell for mobile install
- Hosted on **Velveteen** (the platform formerly called Reify) — deployment is Docker + Caddy behind a subdomain
- Do **not** use Prisma, Redis, BullMQ, Pages Router, or a separate backend framework
- Do **not** write tests in the scaffolding phase — tests come per-story via Superpowers' TDD skill
- App Router server components by default; client components only when interactivity requires it
- Server-side sessions only; never store auth state in `localStorage`

## Phase 0 — Tooling Setup

Execute these in order. If a step fails, stop and surface the failure rather than working around it.

### 0.1 Install Claude Code plugins

Install and enable the following plugins in this order. Use whatever plugin install mechanism the current Claude Code version exposes — check `claude --help` or the plugin docs if the command has shifted.

1. **Superpowers** — TDD-driven development, planning discipline, root-cause debugging. This is the primary quality harness for this project.
2. **Context7** — live library documentation lookups during development.
3. **commit-commands** — structured commit workflow.
4. **security-guidance** — security hygiene on changes.

Confirm each is enabled before proceeding. If any fails to install, surface the error and stop.

### 0.2 Install and initialize Beads (`bd`)

Beads is our issue tracker. The user should not have to configure anything.

1. Check if `bd` is on `PATH`. If not, install it per the current Beads install docs (`go install` or `brew install beads-cli` depending on platform). Pick the path that requires no manual flags.
2. Run `bd init` inside the project root.
3. Confirm `bd list` returns an empty ticket set.
4. All tickets in Phase 2 below get created via `bd create` — do not ask the user to create any tickets manually.

### 0.3 Scaffold the repo

```bash
npx create-next-app@latest ashlyn-training \
  --typescript --tailwind --app --src-dir --eslint --import-alias "@/*" --no-turbopack
cd ashlyn-training
```

Then install runtime deps:

```bash
npm i drizzle-orm postgres @auth/drizzle-adapter next-auth@beta \
      stripe @stripe/stripe-js \
      graphile-worker \
      resend @react-email/components \
      zod react-hook-form @hookform/resolvers \
      date-fns lucide-react \
      next-pwa
npm i -D drizzle-kit @types/node tsx
```

Initialize `git`, make the first commit (`chore: initial scaffold`), and create a `main` branch if not already on it.

## Phase 1 — Write Standing Config

### 1.1 Create `CLAUDE.md` at repo root

Contents:

````markdown
# Ashlyn Training — Claude Code Config

## Project
Full-service online training platform for trainer Ashlyn. Sells digital plans, books 1:1 consulting, delivers gated digital content. Mobile-first PWA that scales to desktop web. Hosted on Velveteen (Docker + Caddy).

## Stack
- Next.js 14 App Router, TypeScript strict, Tailwind
- Drizzle ORM + PostgreSQL
- NextAuth v5 (email magic link + Google)
- Stripe (Checkout for plans, Payment Intents for consulting deposits)
- graphile-worker for async jobs
- Resend + React Email
- PWA via next-pwa

## Session Workflow
1. **Read `primer.md` first** before doing anything else. It is the source of truth for where we left off.
2. **Check Beads** — run `bd ready` to see unblocked tickets. Work top-down unless primer.md directs otherwise.
3. **Pick one ticket.** Do not multi-task across tickets. Mark it in-progress: `bd update <id> --status in_progress`.
4. **Work via Superpowers' TDD discipline** — write the failing test first, make it pass, refactor. No untested business logic ships.
5. **On completion**, close the ticket (`bd close <id>`), update `primer.md`, and commit using the commit-commands plugin.
6. **End of session**: update `primer.md` with next step, open blockers, and current branch state before exiting.

## Conventions
- Server Components by default. Add `"use client"` only when interactivity requires it.
- Use Server Actions for mutations. No client-side API routes unless external callers need them (Stripe webhooks, cron).
- Drizzle schema lives in `src/db/schema/*.ts`, one file per table group.
- All money is stored as integer cents. Never use floats for currency.
- All timestamps are `timestamp with time zone` and stored in UTC. Format at the view layer.
- Signed URLs for gated content expire in 15 minutes. Never expose raw file paths to the client.
- Env vars: everything server-only unless prefixed `NEXT_PUBLIC_`. Validate with Zod at startup in `src/env.ts`.

## Design System Integration
The visual layer is handled by an external design system. Leave these seams in place:
- Tailwind config exposes token-shaped CSS variables in `globals.css`. Do not hardcode color, radius, or spacing values in components — reference CSS vars.
- Components should accept `className` and forward it. Use `cn()` util for merging.
- No visual polish work in this project's tickets unless a ticket explicitly says so.

## Things to Avoid
- Prisma, Redis, BullMQ, Pages Router, Express/Fastify.
- `localStorage`/`sessionStorage` for auth state.
- Premature abstraction — inline until a pattern repeats 3+ times.
- Committing secrets. Use `.env.local` (gitignored) locally and Velveteen's env injection in prod.
- Writing tests outside the Superpowers TDD loop — we don't retroactively test-cover.

## Deployment
- Target: Velveteen. Dockerfile + `docker-compose.yml` live at repo root.
- Production URL: `ashlyn.<velveteen-base>.dev` (confirm subdomain with operator).
- Postgres is provisioned by Velveteen per-project. `DATABASE_URL` is injected.
- Migrations run on deploy via `drizzle-kit push` in the container entrypoint.
````

### 1.2 Create `primer.md` at repo root

Contents:

````markdown
# Session State

## Current Focus
Bootstrap phase complete. Ready to start BD-001 (database schema).

## Last Completed
- Scaffold, plugin install, Beads init, CLAUDE.md + primer.md written
- All stories seeded into Beads with dependencies

## Next Step
`bd ready` → pick BD-001 (schema) → write migrations → advance.

## Open Blockers
- None.

## Branch
main

## Notes
- Design system integration is external; do not invent visuals.
- Velveteen subdomain for prod needs to be confirmed before BD-014 (deploy).
- Stripe account must be in test mode until BD-006 ships and is QA'd.
````

## Phase 2 — Seed Beads

Create the following tickets with `bd create`, setting dependencies via `bd dep add <child> <parent>`. Use the exact titles. Use `bd update <id> --body` to attach the body text. The `depends_on` column tells you what each ticket blocks on.

| ID     | Title                                    | Depends on      |
|--------|------------------------------------------|-----------------|
| BD-001 | Database schema + migrations             | —               |
| BD-002 | Auth (NextAuth v5)                       | BD-001          |
| BD-003 | Design system wiring + token shell       | —               |
| BD-004 | Product catalog — plans & consulting     | BD-001, BD-003  |
| BD-005 | Product detail page                      | BD-004          |
| BD-006 | Stripe checkout for digital plans        | BD-004, BD-002  |
| BD-007 | Entitlements + signed URL content delivery | BD-006        |
| BD-008 | Consulting availability + booking flow   | BD-002, BD-006  |
| BD-009 | Customer dashboard                       | BD-007, BD-008  |
| BD-010 | Admin dashboard for Ashlyn               | BD-007, BD-008  |
| BD-011 | Transactional email (Resend)             | BD-006, BD-008  |
| BD-012 | PWA shell + mobile polish                | BD-003          |
| BD-013 | Marketing surface + SEO                  | BD-003, BD-004  |
| BD-014 | Velveteen deploy + CI                    | BD-011, BD-012  |

### Ticket bodies

**BD-001 — Database schema + migrations**
```
Define Drizzle schema and initial migration. Tables:
- users, accounts, sessions, verification_tokens (NextAuth-compatible)
- products (type: 'plan' | 'consulting', price_cents, stripe_price_id, active)
- plans (product_id FK, file_bundle_key, weeks, level)
- consulting_offerings (product_id FK, duration_minutes, requires_intake)
- orders (user_id, product_id, stripe_session_id, amount_cents, status)
- entitlements (user_id, product_id, granted_at, revoked_at)
- availability_rules (day_of_week, start_time, end_time, timezone)
- availability_exceptions (date, blocked, note)
- bookings (user_id, offering_id, start_at, end_at, status, intake_form_id)
- intake_forms (booking_id, answers jsonb, submitted_at)
- content_assets (plan_id, storage_key, mime, display_name, order)
- email_log (to, template, sent_at, stripe_event_id nullable)

Money is integer cents. Timestamps are timestamptz UTC. Add indexes on:
users.email, orders.stripe_session_id, entitlements(user_id, product_id),
bookings(start_at), content_assets(plan_id, order).

Done when: `drizzle-kit push` runs clean against a local Postgres, and a
`npm run db:seed` script creates one admin user + one sample plan product.
```

**BD-002 — Auth (NextAuth v5)**
```
NextAuth v5 with Drizzle adapter. Providers: email magic link (Resend) and
Google. Admin role gated on `users.role = 'admin'` column (add in this ticket
if not present). Protect /admin/* and /account/* via middleware.
Session strategy: database (not JWT). 30-day rolling expiration.
Done when: a user can sign in via magic link, see their email in /account,
and is redirected from /admin if not admin.
```

**BD-003 — Design system wiring + token shell**
```
This ticket does NOT produce visual design. It sets up the seams:
- Extend tailwind.config.ts to read CSS variables for color, radius,
  spacing, and typography scales.
- Define placeholder tokens in globals.css under :root and [data-theme='dark'].
- Create cn() util at src/lib/cn.ts.
- Create primitive components (Button, Input, Card, Dialog) that accept
  className and forward refs. No hardcoded colors; token-only.
- Document the slot contract in src/components/README.md so the design
  system team can swap in their tokens without refactoring.
Done when: a blank "/" page renders a themed Button whose color changes
when you swap the CSS var value in globals.css.
```

**BD-004 — Product catalog**
```
Listing page at /shop. Grid of cards. Filter by type (plan | consulting).
Server component fetches active products via Drizzle. Each card links to
/shop/[slug]. Add `slug` column to products if not already present.
Done when: /shop renders both product types and filter works via URL
search params (not client state).
```

**BD-005 — Product detail page**
```
/shop/[slug] server component. Shows description, price, what's included,
and a CTA. For 'plan' type: CTA is "Buy now" → Stripe Checkout.
For 'consulting' type: CTA is "Book a session" → booking flow (stubbed
to route to /book/[slug]; full flow lands in BD-008).
Include a FAQ accordion block (client component, collapsed by default).
Done when: both product types render with correct CTAs and metadata
(OG tags, title, description) populate from the product row.
```

**BD-006 — Stripe checkout for digital plans**
```
Server action creates a Checkout Session for plan purchases. Webhook
handler at /api/stripe/webhook verifies signature and on
`checkout.session.completed`:
1. Creates an order row.
2. Grants an entitlement for the purchased product.
3. Enqueues a graphile-worker job to send the receipt + access email
   (stub the email, real template in BD-011).
Handle idempotency via stripe_event_id dedupe in email_log and orders.
Use Stripe test mode keys in .env.local.
Done when: a test-mode purchase end-to-end grants an entitlement and
the order row is visible in /admin (stubbed) or via psql.
```

**BD-007 — Entitlements + signed URL content delivery**
```
/account/library lists products the user has entitlement to. Each plan
expands to show its content_assets. Clicking an asset hits
/api/content/[assetId] which:
1. Checks the user's session.
2. Checks entitlement for the asset's plan.
3. Generates a short-lived (15 min) signed URL for the storage key.
4. Redirects to the signed URL.
Storage layer: filesystem under `/var/ashlyn/content` in prod (mounted
volume), signed via HMAC with a server-only secret. No raw paths
reach the client.
Done when: an unentitled user gets 403, an entitled user streams the
asset, and the signed URL 404s after 15 minutes.
```

**BD-008 — Consulting availability + booking flow**
```
Admin defines weekly availability rules + exceptions (later, BD-010 UI;
for now, seed via script). Booking flow at /book/[slug]:
1. Calendar picker shows open slots computed from rules - exceptions
   - existing bookings. Slots in the viewer's timezone.
2. User selects slot, fills intake form (dynamic per-offering),
   confirms.
3. Stripe Payment Intent for deposit (if offering.requires_deposit).
4. On payment success, booking row created, intake saved,
   confirmation email enqueued.
Cancellation policy: user can cancel up to 24h before; later than that
goes to admin review.
Done when: a signed-in user can book a paid consulting slot that shows
in /admin and blocks that time from future bookings.
```

**BD-009 — Customer dashboard**
```
/account shell with tabs: Library (entitled plans), Bookings (upcoming
+ past), Profile (email, name, timezone). Server components fetch data
per tab. Bookings tab shows reschedule/cancel actions gated on the
24h policy from BD-008.
Done when: all three tabs render real data and the cancel action
actually cancels (status update + email).
```

**BD-010 — Admin dashboard for Ashlyn**
```
/admin shell, admin-role-gated. Pages:
- Dashboard: counts of active entitlements, upcoming bookings, this-
  month revenue.
- Products: CRUD on plans + consulting offerings, including Stripe
  price sync.
- Content: upload/delete content_assets per plan (multipart upload to
  local filesystem for now).
- Bookings: calendar view + per-booking drawer with intake answers.
- Availability: edit weekly rules and add/remove exceptions.
- Customers: search users, view entitlements, manual grant/revoke.
Done when: Ashlyn can run the entire business from /admin without
touching psql.
```

**BD-011 — Transactional email**
```
Real React Email templates for:
- Magic link sign-in (BD-002 was stubbed)
- Plan purchase receipt + access
- Booking confirmation (user + admin copies)
- Booking reminder (24h before, scheduled via graphile-worker)
- Booking cancellation
All templates use the design system's email tokens when available;
fall back to neutral defaults. Log every send to email_log.
Done when: all five templates fire in the right lifecycle moments and
render correctly in Gmail and Apple Mail.
```

**BD-012 — PWA shell + mobile polish**
```
next-pwa config with manifest, icons (placeholder until design system
ships), offline fallback page. Service worker caches static assets and
the marketing surface; never caches /account, /admin, or /api.
Add iOS install meta tags. Test "Add to Home Screen" on iOS Safari
and Android Chrome.
Mobile polish pass: safe-area-insets on all fixed elements, tap
targets >= 44px, no horizontal scroll at 320px width.
Done when: the app installs as a PWA on both iOS and Android and the
Lighthouse PWA audit passes.
```

**BD-013 — Marketing surface + SEO**
```
Public pages: /, /about, /shop (done in BD-004), /contact.
robots.txt, sitemap.ts (dynamic from products), OG images per route.
Structured data: Product schema on /shop/[slug], Person schema for
Ashlyn on /about.
Done when: the homepage tells the story, /about has Ashlyn's bio
placeholder, sitemap includes all public URLs, and Lighthouse SEO
score is >= 95.
```

**BD-014 — Velveteen deploy + CI**
```
Dockerfile (multi-stage, standalone Next.js output). docker-compose.yml
for local prod-like run. GitHub Actions workflow:
1. Lint + typecheck.
2. Build Docker image, tag with short SHA.
3. Push to Velveteen's registry.
4. Trigger Velveteen deploy via its webhook/API.
Entrypoint runs `drizzle-kit push` before starting the server.
Secrets: DATABASE_URL, NEXTAUTH_SECRET, STRIPE_*, RESEND_API_KEY,
GOOGLE_CLIENT_ID/SECRET, SIGNED_URL_SECRET — all injected by
Velveteen, never committed.
Done when: a push to main deploys to the Velveteen subdomain and the
app serves traffic over HTTPS.
```

## Phase 3 — Hand Off

When Phases 0–2 are complete:

1. Run `bd ready` and confirm BD-001 and BD-003 surface as unblocked (they have no deps).
2. Commit everything with message `chore: project bootstrap complete`.
3. Update `primer.md`'s "Next Step" to: `Start BD-001.`
4. Print the `bd ready` output to the terminal and stop. Do not begin BD-001 in this same session — the operator wants a clean break between bootstrap and work.

---

**End of bootstrap prompt.**
