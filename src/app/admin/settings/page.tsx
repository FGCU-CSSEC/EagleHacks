import type { Metadata } from "next";
import { Suspense } from "react";
import { toEasternInput } from "@/lib/eastern";
import { parseRows } from "@/lib/settings";
import { createClient } from "@/lib/supabase/server";
import { signIn, signOut } from "./actions";
import SettingsForm from "./SettingsForm";

export const metadata: Metadata = {
  title: "Settings | EagleHacks admin",
  robots: { index: false, follow: false },
};

export default function SettingsPage({ searchParams }: PageProps<"/admin/settings">) {
  return (
    <main id="main" className="wrap max-w-2xl py-10">
      <h1 className="text-3xl font-bold">Site settings</h1>
      <Suspense fallback={<p className="mt-6 text-muted">Loading…</p>}>
        <Content searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Content({ searchParams }: Pick<PageProps<"/admin/settings">, "searchParams">) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const { login } = await searchParams;
    return (
      <form action={signIn} className="mt-6 grid max-w-sm gap-4">
        <label className="block">
          <span className="font-semibold">Email</span>
          <input type="email" name="email" required autoComplete="username" className="mt-1 block w-full rounded border border-line bg-surface px-3 py-2" />
        </label>
        <label className="block">
          <span className="font-semibold">Password</span>
          <input type="password" name="password" required autoComplete="current-password" className="mt-1 block w-full rounded border border-line bg-surface px-3 py-2" />
        </label>
        {login === "failed" && <p role="alert" className="text-red-700">Wrong email or password.</p>}
        <button type="submit" className="btn btn-primary btn-lg justify-self-start">Sign in</button>
      </form>
    );
  }

  const [{ data: role }, { data: rows }] = await Promise.all([
    supabase.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle(),
    supabase.from("site_settings").select("key, value"),
  ]);

  if (role?.role !== "admin") {
    return (
      <div className="mt-6">
        <p>This account isn&apos;t an admin.</p>
        <form action={signOut} className="mt-4">
          <button type="submit" className="btn btn-sm">Sign out</button>
        </form>
      </div>
    );
  }

  const s = parseRows(rows ?? []);
  return (
    <div className="mt-6 grid gap-8">
      <SettingsForm
        values={{
          override: s.registration_override ?? "auto",
          opensAt: s.registration_opens_at ? toEasternInput(s.registration_opens_at) : "",
          closesAt: s.registration_closes_at ? toEasternInput(s.registration_closes_at) : "",
          applicationUrl: s.application_url,
          eventDates: s.event_dates,
          cap: s.cap,
          rsvpWindowDays: s.rsvp_window_days,
        }}
      />
      <form action={signOut}>
        <button type="submit" className="btn btn-sm">Sign out</button>
      </form>
    </div>
  );
}
