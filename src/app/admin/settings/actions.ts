"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { fromEasternInput } from "@/lib/eastern";
import { SETTINGS_TAG, STATES } from "@/lib/settings";
import { createClient } from "@/lib/supabase/server";

export type SaveState = { ok?: boolean; error?: string };

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  redirect(error ? "/admin/settings?login=failed" : "/admin/settings");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/settings");
}

// RLS (admin_all on site_settings) is the real gate; the role check just gives a clear error.
export async function saveSettings(_prev: SaveState, formData: FormData): Promise<SaveState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in first." };
  const { data: role } = await supabase
    .from("staff_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (role?.role !== "admin") return { error: "Admins only." };

  const text = (name: string) => String(formData.get(name) ?? "").trim();

  const overrideRaw = text("override");
  const override = STATES.find((s) => s === overrideRaw) ?? null;
  if (overrideRaw !== "auto" && !override) return { error: "Pick a valid registration state." };

  const opensAt = text("opens_at") ? fromEasternInput(text("opens_at")) : null;
  const closesAt = text("closes_at") ? fromEasternInput(text("closes_at")) : null;
  if ((text("opens_at") && !opensAt) || (text("closes_at") && !closesAt)) {
    return { error: "Enter valid opening and closing times." };
  }
  if (opensAt && closesAt && Date.parse(closesAt) <= Date.parse(opensAt)) {
    return { error: "Applications must close after they open." };
  }

  const applicationUrl = text("application_url");
  if (applicationUrl && !/^https:\/\//i.test(applicationUrl)) {
    return { error: "The application link must start with https://" };
  }

  const eventDates = text("event_dates");
  if (!eventDates || eventDates.length > 100) return { error: "Enter the event dates (100 characters max)." };

  const cap = Number(text("cap"));
  if (!Number.isInteger(cap) || cap < 1 || cap > 5000) return { error: "Cap must be a whole number from 1 to 5000." };

  const rsvpDays = Number(text("rsvp_window_days"));
  if (!Number.isInteger(rsvpDays) || rsvpDays < 1 || rsvpDays > 60) {
    return { error: "RSVP window must be 1 to 60 days." };
  }

  const values: Record<string, unknown> = {
    registration_override: override,
    registration_opens_at: opensAt,
    registration_closes_at: closesAt,
    application_url: applicationUrl,
    event_dates: eventDates,
    cap,
    rsvp_window_days: rsvpDays,
  };
  const now = new Date().toISOString();
  const { error } = await supabase.from("site_settings").upsert(
    Object.entries(values).map(([key, value]) => ({ key, value, updated_at: now, updated_by: user.id })),
    { onConflict: "key" },
  );
  if (error) return { error: "Could not save. Try again." };

  updateTag(SETTINGS_TAG); // the public site refreshes on the next request
  return { ok: true };
}
