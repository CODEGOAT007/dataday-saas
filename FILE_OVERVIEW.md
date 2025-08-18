# File Overview and Hover Note Plan

This document explains the purpose of key folders and files, and defines a standard "hover note" header comment to include at the top of source files so a new junior dev can quickly understand why each file exists.

## Standard header (copy/paste at top of files)
/**
 * @fileoverview One-line purpose of the file.
 * Why: Brief justification for why it exists and how it fits the app.
 * Owner: Team or area (e.g., Admin Dashboard, Auth, API)
 */

Example:
/**
 * @fileoverview Admin dashboard main component and state orchestration.
 * Why: Central place to manage users and phone leads (sales pipeline) for founders/coaches.
 * Owner: Admin Dashboard
 */

---


> Design & Style Reference: Fellow (fellow.app) — clean meeting UI, structured note-taking, and dark-mode admin patterns to emulate across pricing, admin call flows, and notes.

## Top-level
- README.md — Repo setup, commands, and quickstart.
- PLANNING.md — Architecture goals, stack, app constraints; read before building features.
- DIRECTORY_STRUCTURE.md — High-level folder map for onboarding.
- VERSION-3-*.md — Business, tech architecture, and messaging docs for v3.
- BUSINESS docs (FLOW-LIVESTREAM-TO-USER.md, etc.) — Sales flow and operations notes.
- database-schema.sql / migrate-*.sql — Postgres schema and migrations.
- supabase/ — SQL migrations applied via Supabase.
- tests/ — Jest tests organized by area; mirror app structure where possible.

## app/ (Next.js App Router)
- app/layout.tsx — Root providers (theme, query), analytics, PWA hooks, global toasters.
- app/page.tsx — Landing page.
- app/**/page.tsx — Route pages; UI + data hooks.
- app/api/** — Route handlers for server-side APIs (admin, goals, ai, etc.).
- app/admin/** — Admin UI routes (dashboard, coach views).
- app/dashboard/** — Authenticated user dashboard.
- app/today/** — Main day view after login.

## components/
- components/admin/** — Admin-only UI (dashboard, lead linear actions, workspace, etc.).
- components/auth/** — Login/logout, auth widgets.
- components/providers/** — Theme and TanStack Query providers.
- components/pwa/** — Install/debug widgets and service worker registration.
- components/ui/** — Shadcn UI primitives used across the app.

## hooks/
- use-auth.ts — Auth state, sign-in/out.
- use-toast.ts — Legacy shadcn toast (migrating to Sonner; use sonner directly).
- use-*/ — Feature state hooks (goals, logs, subscriptions, support circle).

## lib/
- supabase.ts / supabase-client.ts — Supabase clients (service role vs browser auth).
- stripe.ts — Stripe helpers for checkout/test mode.
- utils.ts — Reusable utilities and className helpers.

## types/
- supabase.ts — DB types for typed queries.
- index.ts — Shared app-level types (enums, unions).

## Admin area (key files)
- components/admin/admin-dashboard.tsx — Founder dashboard and management tabs (leads/users), summary section, dialogs.
- components/admin/lead-linear-actions.tsx — Compact controller for lead progression; toggles workspace.
- components/admin/lead-workspace.tsx — Slide-over focusing a single lead with linear actions and tools.
- app/api/admin/phone-leads/route.ts — CRUD + server-side guardrails for linear lead transitions.
- app/api/admin/users/route.ts — List users for admin.
- app/api/admin/auth/login/route.ts — Admin session cookie issuance.
- app/api/admin/auth/verify/route.ts — Verify admin cookie; returns session metadata.
- app/api/admin/preferences/route.ts — Persist per-admin UI prefs (summary collapsed).

## Testing
- tests/** — Unit tests for APIs, hooks, and components. Include expected, edge, and failure cases.

## Hover notes rollout plan
1. Add the header block to: admin components, admin API routes, lib/supabase*, lib/utils, app/layout.tsx, hooks.
2. Use a one-liner “@fileoverview” and a brief “Why” tailored to each file.
3. Keep comments short, clear, and actionable for junior devs.

