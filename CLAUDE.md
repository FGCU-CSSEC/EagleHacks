@AGENTS.md

# EagleHacks 2027

## Event

- EagleHacks 2027, March 12–14, 2027, at FGCU
- MLH member event; 18+ only
- Cap of 200 confirmed hackers

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind). Read `node_modules/next/dist/docs/` before writing Next.js code (see AGENTS.md).
- Supabase: Postgres, Auth, RLS
- Resend for email
- Airtable for applications. Free plan: 1,000 API calls/month, so batch calls and use no Airtable automations.
- Notion for the hacker guide and schedule
- Deployed on Vercel

## Current state

- The site is the public shell. The hacker portal (sign-in, confirm button, QR check-in, admin) gets built on top of it by December.
- Site settings live in `src/config/site.ts` today and will move to a `site_settings` table.
- Registration button state is driven by `registration.state` (or `NEXT_PUBLIC_REGISTRATION_STATE` / `NEXT_PUBLIC_APPLICATION_URL`). See README.md.
- Keep the current design tokens at the top of `src/app/globals.css`.

## Data model (Supabase, `supabase/migrations`)

`application_status` enum: `accepted`, `waitlisted`, `rejected`, `confirmed`, `declined`, `expired`, `checked_in`.
`staff_role` enum: `admin`, `volunteer`. `scan_kind` enum: `check_in`, `meal`.

- `site_settings`: `key` (pk), `value` jsonb, `updated_at`, `updated_by`. Public read, admin write.
- `profiles`: `id` (pk, = `auth.users.id`), `email`, `full_name`, `created_at`. Created by trigger on signup.
- `applications`: `id`, `user_id` (unique), `airtable_record_id` (unique), `status`, `confirm_by`, `created_at`, `updated_at`. Mirrors the decision made in Airtable; Airtable stays the source for the form answers.
- `qr_tokens`: `id`, `user_id` (unique), `token` (unique, random). Hackers read their own; volunteers have no table access and use the `public.lookup_qr_token(token)` function only.
- `events`: `id`, `slug`, `name`, `starts_at`, `ends_at`.
- `meal_windows`: `id`, `event_id`, `name`, `starts_at`, `ends_at`.
- `scans`: `id`, `user_id`, `kind`, `meal_window_id` (required for `meal`), `scanned_by`, `scanned_at`. One check-in per hacker, one scan per hacker per meal window. A `check_in` scan moves a `confirmed` application to `checked_in`.
- `staff_roles`: `user_id` (pk), `role`, `created_at`.

Access: hackers read only their own rows; volunteers look up by QR token and insert scans; admins (rows in `staff_roles`) can do everything. Hackers cannot write `applications` directly, so confirm/decline and QR token creation go through server code with the secret key. The SQL RLS test is `supabase/tests/rls.sql`.

## Rules

- Enforce access with row-level security, not just app-side checks.
- Keep service keys server-side only. Never expose them to client code or `NEXT_PUBLIC_*` variables.
- Never put PII in URLs (query strings, path segments, redirects).
