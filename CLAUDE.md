# Ashlyn Training — Claude Code Config

## Project
Full-service online training platform for trainer Ashlyn. Sells digital plans, books 1:1 consulting, delivers gated digital content. Mobile-first PWA that scales to desktop web. Hosted on Velveteen (Docker + Caddy).

## Stack
- Next.js 16 App Router, TypeScript strict, Tailwind
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
