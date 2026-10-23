import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { site, type RegistrationState } from "@/config/site";
import { resolveState } from "./registration";

export const SETTINGS_TAG = "site-settings";
export const STATES: RegistrationState[] = ["coming-soon", "open", "waitlist", "closed"];

// site_settings rows are { key, value jsonb }. A missing or null key means
// "use src/config/site.ts".
export type RawSettings = {
  registration_override: RegistrationState | null; // null = automatic, by date
  registration_opens_at: string | null; // ISO
  registration_closes_at: string | null; // ISO
  application_url: string;
  event_dates: string;
  cap: number;
  rsvp_window_days: number;
};

export function parseRows(rows: { key: string; value: unknown }[]): RawSettings {
  const v = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const str = (x: unknown, d: string) => (typeof x === "string" ? x : d);
  const iso = (x: unknown) => (typeof x === "string" && !Number.isNaN(Date.parse(x)) ? x : null);
  const num = (x: unknown, d: number) => (typeof x === "number" && Number.isFinite(x) ? x : d);
  return {
    registration_override: STATES.find((s) => s === v.registration_override) ?? null,
    registration_opens_at: iso(v.registration_opens_at),
    registration_closes_at: iso(v.registration_closes_at),
    application_url: str(v.application_url, site.registration.formUrl),
    event_dates: str(v.event_dates, site.dates),
    cap: num(v.cap, site.cap),
    rsvp_window_days: num(v.rsvp_window_days, site.rsvpWindowDays),
  };
}

// What the public site needs, resolved at fill time. Cached for 60 seconds, so
// the button flips within about a minute of opens_at / closes_at. Saving in
// /admin/settings expires it immediately.
export async function getPublicSettings() {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  cacheTag(SETTINGS_TAG);

  let rows: { key: string; value: unknown }[] = [];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    const { data } = await createClient(url, key, { auth: { persistSession: false } })
      .from("site_settings")
      .select("key, value");
    rows = data ?? []; // on error, fall back to site.ts
  }

  const s = parseRows(rows);
  const state = resolveState({
    override: s.registration_override,
    opensAt: s.registration_opens_at,
    closesAt: s.registration_closes_at,
    fallback: site.registration.state,
    now: Date.now(),
  });
  const opensLabel = s.registration_opens_at
    ? new Date(s.registration_opens_at).toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        month: "long",
        year: "numeric",
      })
    : site.registration.opensLabel;

  return {
    state,
    opensLabel,
    applicationUrl: s.application_url,
    eventDates: s.event_dates,
    cap: s.cap,
    rsvpWindowDays: s.rsvp_window_days,
  };
}
