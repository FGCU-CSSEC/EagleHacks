import {
  SPONSOR_INTERESTS,
  validateSponsorRequest,
  type SponsorRequest,
  type SponsorRequestErrors,
} from "./sponsorRequest.ts";

// Server-only: turns a sponsor packet request into a record in the Airtable "Sponsors" table.

const AIRTABLE_API = "https://api.airtable.com/v0";
const SPONSORS_TABLE = "Sponsors";
const REQUEST_TIMEOUT_MS = 10_000;

const MAX_SHORT_TEXT = 200;
const MAX_MESSAGE = 5000;

export type ParsedSponsorRequest =
  | { kind: "valid"; request: SponsorRequest }
  | { kind: "invalid"; errors: SponsorRequestErrors }
  | { kind: "spam" };

export type AirtableCredentials = { token: string; baseId: string };

/**
 * Turns an untrusted JSON body into a SponsorRequest. A filled-in honeypot (`website`) is reported
 * as spam before anything else is checked. Unknown interests are dropped, because Airtable's
 * `typecast` would otherwise create a new option for every value a caller sends.
 */
export function parseSponsorRequest(body: unknown): ParsedSponsorRequest {
  const input = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};

  if (typeof input.website === "string" && input.website.length > 0) return { kind: "spam" };

  const text = (key: string, max: number) => (typeof input[key] === "string" ? input[key].trim().slice(0, max) : "");
  const selected = Array.isArray(input.interests) ? input.interests : [];

  const request: SponsorRequest = {
    name: text("name", MAX_SHORT_TEXT),
    organization: text("organization", MAX_SHORT_TEXT),
    email: text("email", MAX_SHORT_TEXT),
    phone: text("phone", MAX_SHORT_TEXT),
    interests: SPONSOR_INTERESTS.filter((interest) => selected.includes(interest)),
    message: text("message", MAX_MESSAGE),
    website: "",
  };

  const errors = validateSponsorRequest(request);
  return Object.keys(errors).length > 0 ? { kind: "invalid", errors } : { kind: "valid", request };
}

/** Maps a request to the Airtable field names. Optional fields are left out when empty. */
export function toAirtableFields(request: SponsorRequest): Record<string, unknown> {
  return {
    Name: request.name,
    Company: request.organization,
    Email: request.email,
    ...(request.phone && { Phone: request.phone }),
    ...(request.interests.length > 0 && { "Interested In": request.interests }),
    ...(request.message && { Message: request.message }),
    Status: "New",
  };
}

/** Creates the record. Throws if Airtable rejects it or cannot be reached. */
export async function saveSponsorRequest(
  request: SponsorRequest,
  { token, baseId }: AirtableCredentials,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const response = await fetchImpl(`${AIRTABLE_API}/${encodeURIComponent(baseId)}/${SPONSORS_TABLE}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ records: [{ fields: toAirtableFields(request) }], typecast: true }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Airtable responded ${response.status}: ${await response.text()}`);
  }
}
