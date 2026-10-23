import type { RegistrationState } from "@/config/site";

type Input = {
  override: RegistrationState | null;
  opensAt: string | null; // ISO timestamps
  closesAt: string | null;
  fallback: RegistrationState; // used when no override and no dates are set
  now: number;
};

// An admin override wins. Otherwise the dates decide: closed from closesAt on,
// open from opensAt on, coming-soon before it.
export function resolveState({ override, opensAt, closesAt, fallback, now }: Input): RegistrationState {
  if (override) return override;
  if (closesAt && now >= Date.parse(closesAt)) return "closed";
  if (opensAt) return now >= Date.parse(opensAt) ? "open" : "coming-soon";
  return fallback;
}
