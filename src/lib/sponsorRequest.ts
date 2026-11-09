export const SPONSOR_INTERESTS = [
  "Sponsorship tiers",
  "A challenge or prize track",
  "A workshop",
  "Mentors or judges",
  "In-kind donation",
] as const;

export type SponsorInterest = (typeof SPONSOR_INTERESTS)[number];

export type SponsorRequest = {
  name: string;
  organization: string;
  email: string;
  phone: string;
  interests: SponsorInterest[];
  message: string;
  /** Honeypot. Hidden from people, so any value here means the submission came from a bot. */
  website: string;
};

export type SponsorRequestErrors = Partial<Record<"name" | "organization" | "email" | "phone", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side checks for the request form. Returns an error message per invalid field. */
export function validateSponsorRequest(request: SponsorRequest): SponsorRequestErrors {
  const errors: SponsorRequestErrors = {};
  if (!request.name.trim()) errors.name = "Enter your name.";
  if (!request.organization.trim()) errors.organization = "Enter your company or organization.";

  const email = request.email.trim();
  if (!email) errors.email = "Enter your work email.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";

  const phone = request.phone.trim();
  if (phone && phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a valid phone number, or leave it blank.";

  return errors;
}

/**
 * Sends a sponsor packet request.
 *
 * TODO: placeholder. The backend teammate will replace this with a call to the real endpoint,
 * which should save the request to Airtable and drop any request whose `website` honeypot is
 * filled in. Reject the promise on failure so the form can show its error state.
 */
export async function submitSponsorRequest(request: SponsorRequest): Promise<void> {
  void request;
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
