"use client";

import { useActionState } from "react";
import { saveSettings, type SaveState } from "./actions";

export type FormValues = {
  override: string; // "auto" or a registration state
  opensAt: string; // Eastern, datetime-local format
  closesAt: string;
  applicationUrl: string;
  eventDates: string;
  cap: number;
  rsvpWindowDays: number;
};

const field = "mt-1 block w-full rounded border border-line bg-surface px-3 py-2";

export default function SettingsForm({ values }: { values: FormValues }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveSettings, {});

  return (
    <form action={action} className="grid gap-5">
      <label className="block">
        <span className="font-semibold">Registration state</span>
        <select name="override" defaultValue={values.override} className={field}>
          <option value="auto">Automatic (from the opening and closing times)</option>
          <option value="coming-soon">Override: coming soon</option>
          <option value="open">Override: open</option>
          <option value="waitlist">Override: waitlist</option>
          <option value="closed">Override: closed</option>
        </select>
        <span className="text-sm text-muted">An override beats the times below until you set this back to Automatic.</span>
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-semibold">Applications open (Eastern time)</span>
          <input type="datetime-local" name="opens_at" defaultValue={values.opensAt} className={field} />
        </label>
        <label className="block">
          <span className="font-semibold">Applications close (Eastern time)</span>
          <input type="datetime-local" name="closes_at" defaultValue={values.closesAt} className={field} />
        </label>
      </div>

      <label className="block">
        <span className="font-semibold">Airtable form link</span>
        <input type="url" name="application_url" defaultValue={values.applicationUrl} placeholder="https://airtable.com/..." className={field} />
      </label>

      <label className="block">
        <span className="font-semibold">Event dates</span>
        <input type="text" name="event_dates" required maxLength={100} defaultValue={values.eventDates} className={field} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-semibold">Cap (confirmed hackers)</span>
          <input type="number" name="cap" required min={1} max={5000} defaultValue={values.cap} className={field} />
        </label>
        <label className="block">
          <span className="font-semibold">RSVP window (days to confirm)</span>
          <input type="number" name="rsvp_window_days" required min={1} max={60} defaultValue={values.rsvpWindowDays} className={field} />
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-primary btn-lg">
          {pending ? "Saving…" : "Save settings"}
        </button>
        <p role="status" className={state.error ? "text-red-700" : "text-green"}>
          {state.error ?? (state.ok ? "Saved. The site updates within a minute." : "")}
        </p>
      </div>
    </form>
  );
}
