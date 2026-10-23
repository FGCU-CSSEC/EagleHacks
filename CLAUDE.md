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
- Registration state, opens/closes times, Airtable form URL, event dates, cap and RSVP window live in the `site_settings` table (keys: `registration_override`, `registration_opens_at`, `registration_closes_at`, `application_url`, `event_dates`, `cap`, `rsvp_window_days`). Admins edit them at `/admin/settings`. `src/lib/settings.ts` reads them, cached 60s (tag `site-settings`), and `src/config/site.ts` is the fallback. Everything else in `site.ts` (links, FAQ, organizers, sponsors) is still code.
- The button state comes from `src/lib/registration.ts`: admin override, else the dates, else the `site.ts` / `NEXT_PUBLIC_REGISTRATION_STATE` fallback. Times are entered in Eastern and stored as UTC.
- `npm test` runs the unit checks in `src/lib/registration.test.mjs`.
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

## Airtable `Applications` table

Created by `scripts/setup-airtable.ts` (`npx tsx scripts/setup-airtable.ts`, needs `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` in `.env.local`). Form setup is in `docs/airtable-form.md`. Field names, in order (use these exact strings in API code):

`First name`, `Last name`, `Email`, `Phone`, `Age`, `School`, `Level of study`, `Country of residence`, `Major`, `Graduation year`, `Resume`, `GitHub`, `LinkedIn`, `Gender`, `Pronouns`, `Pronouns - Other, please specify`, `Race/ethnicity`, `Race/ethnicity - Other, please specify`, `Dietary restrictions`, `Dietary details`, `T-shirt size, US`, `I am 18 or older`, `MLH Code of Conduct`, `MLH data sharing`, `MLH and DEV emails`, `Status`, `Reviewer notes`, `Submitted at`.

- `Status` options: `Pending`, `Accepted`, `Waitlisted`, `Rejected` (new form rows have it empty; treat as Pending). `Submitted at` is a created-time field.
- `School` is a single-line text field. Airtable caps selects at 10,000 options (it rejected MLH's ~17,500 unique schools), so MLH's "pick from the verified list" rule is not met by the Airtable form. Never trim the school list silently.
- Free plan: 1,000 API calls/month. Batch reads and writes (up to 10 records per write call).

## TODO

- **Before January: build the application form at `/apply` on our site (replaces the Airtable form).**
  - `School` is a searchable combobox loaded from MLH's verified list (https://github.com/MLH/mlh-policies/blob/main/schools.csv), plus a "My school isn't listed" option.
  - Save each application to Supabase first. Resumes go in a private Supabase Storage bucket.
  - Then copy applications to Airtable in batches of 10 records per API call, for reviewers. One Airtable call per application would burn the free plan's 1,000 calls/month.
  - Use the field names above, including the exact MLH checkbox wording from `docs/airtable-form.md`.

## Rules

- Enforce access with row-level security, not just app-side checks.
- Keep service keys server-side only. Never expose them to client code or `NEXT_PUBLIC_*` variables.
- Never put PII in URLs (query strings, path segments, redirects).
