// Creates the "Applications" table for EagleHacks 2027 (MLH member event, 18+ only)
// in an Airtable base, following https://guide.mlh.com/general-information/managing-registrations/registrations
//
//   npx tsx scripts/setup-airtable.ts
//
// Reads AIRTABLE_TOKEN and AIRTABLE_BASE_ID from .env.local. The token needs the
// schema.bases:read and schema.bases:write scopes on that base. Safe to run twice:
// existing fields are skipped. Costs about 40 API calls per run.
import countries from "./data/countries.json";

try {
  process.loadEnvFile(".env.local");
} catch {
  console.error("Could not read .env.local in the current folder.");
  process.exit(1);
}
const token = process.env.AIRTABLE_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;
if (!token || !baseId) {
  console.error("Set AIRTABLE_TOKEN and AIRTABLE_BASE_ID in .env.local.");
  process.exit(1);
}

const TABLE = "Applications";
const CODE_OF_CONDUCT = "https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md";
const CONTEST_TERMS = "https://github.com/MLH/mlh-policies/blob/main/contest-terms.md";

type Field = { name: string; type: string; options?: unknown; description?: string };

const text = (name: string): Field => ({ name, type: "singleLineText" });
const longText = (name: string): Field => ({ name, type: "multilineText" });
const url = (name: string): Field => ({ name, type: "url" });
const select = (name: string, choices: string[], multiple = false): Field => ({
  name,
  type: multiple ? "multipleSelects" : "singleSelect",
  options: { choices: choices.map((c) => ({ name: c })) },
});
const checkbox = (name: string, description: string): Field => ({
  name,
  type: "checkbox",
  options: { icon: "check", color: "greenBright" },
  description,
});

// MLH's lists, copied from the registration guide.
const LEVEL_OF_STUDY = [
  "Less than Secondary / High School",
  "Secondary / High School",
  "Undergraduate University (2 year - community college or similar)",
  "Undergraduate University (3+ year)",
  "Graduate University (Masters, Professional, Doctoral, etc)",
  "Code School / Bootcamp",
  "Other Vocational / Trade Program or Apprenticeship",
  "Post Doctorate",
  "Other",
  "I'm not currently a student",
  "Prefer not to answer",
];
const MAJOR = [
  "Computer science, computer engineering, or software engineering",
  "Another engineering discipline (such as civil, electrical, mechanical, etc.)",
  "Information systems, information technology, or system administration",
  "A natural science (such as biology, chemistry, physics, etc.)",
  "Mathematics or statistics",
  "Web development or web design",
  "Business discipline (such as accounting, finance, marketing, etc.)",
  "Humanities discipline (such as literature, history, philosophy, etc.)",
  "Social science (such as anthropology, psychology, political science, etc.)",
  "Fine arts or performing arts (such as graphic design, music, studio art, etc.)",
  "Health science (such as nursing, pharmacy, radiology, etc.)",
  "Other (please specify)",
  "Undecided / No Declared Major",
  "My school does not offer majors / primary areas of study",
  "Prefer not to answer",
];
const GENDER = ["Man", "Woman", "Non-Binary", "Prefer to self-describe", "Prefer Not to Answer"];
const PRONOUNS = ["She/Her", "He/Him", "They/Them", "She/They", "He/They", "Prefer Not to Answer", "Other"];
const RACE_ETHNICITY = [
  "Asian Indian",
  "Black or African",
  "Chinese",
  "Filipino",
  "Guamanian or Chamorro",
  "Hispanic / Latino / Spanish Origin",
  "Japanese",
  "Korean",
  "Middle Eastern",
  "Native American or Alaskan Native",
  "Native Hawaiian",
  "Samoan",
  "Vietnamese",
  "White",
  "Other Asian (Thai, Cambodian, etc)",
  "Other Pacific Islander",
  "Other (Please Specify)",
  "Prefer Not to Answer",
];

// MLH's checkbox wording. The links follow the sentence, as on the MLH page.
const CHECKBOX_CODE_OF_CONDUCT = `I have read and agree to the MLH Code of Conduct. (${CODE_OF_CONDUCT})`;
const CHECKBOX_DATA_SHARING =
  "I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and administration (including the creation of linked accounts on MLH and DEV (dev.to)) in line with the MLH Privacy Policy. " +
  `I further agree to the terms of both the MLH Contest Terms and Conditions (${CONTEST_TERMS}) and the MLH Privacy Policy`;
const CHECKBOX_EMAILS =
  "I authorize MLH + DEV to send me occasional emails about relevant events, career opportunities, and community announcements.";

const years = Array.from({ length: 6 }, (_, i) => String(2026 + i));
const ages = [...Array.from({ length: 13 }, (_, i) => String(18 + i)), "31+"];

function buildFields(): Field[] {
  return [
    text("First name"),
    text("Last name"),
    { name: "Email", type: "email" },
    { name: "Phone", type: "phoneNumber" },
    select("Age", ages),
    // MLH wants a dropdown from its verified list (~17,500 schools), but Airtable caps a
    // select at 10,000 options. Plain text until the /apply form (see CLAUDE.md) handles it.
    text("School"),
    select("Level of study", LEVEL_OF_STUDY),
    select("Country of residence", countries),
    select("Major", MAJOR),
    select("Graduation year", years),
    { name: "Resume", type: "multipleAttachments" },
    url("GitHub"),
    url("LinkedIn"),
    select("Gender", GENDER),
    select("Pronouns", PRONOUNS),
    text("Pronouns - Other, please specify"),
    select("Race/ethnicity", RACE_ETHNICITY, true),
    text("Race/ethnicity - Other, please specify"),
    select("Dietary restrictions", ["None", "Vegetarian", "Vegan", "Celiac", "Allergies", "Kosher", "Halal", "Other"], true),
    longText("Dietary details"),
    select("T-shirt size, US", ["XS", "S", "M", "L", "XL", "XXL"]),
    checkbox("I am 18 or older", "I confirm that I am 18 years of age or older."),
    checkbox("MLH Code of Conduct", CHECKBOX_CODE_OF_CONDUCT),
    checkbox("MLH data sharing", CHECKBOX_DATA_SHARING),
    checkbox("MLH and DEV emails", CHECKBOX_EMAILS),
    select("Status", ["Pending", "Accepted", "Waitlisted", "Rejected"]),
    longText("Reviewer notes"),
    // Airtable rejects options on createdTime; it uses its default date and time format.
    { name: "Submitted at", type: "createdTime" },
  ];
}

class AirtableError extends Error {
  constructor(
    readonly status: number,
    detail: unknown,
  ) {
    super(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
}

async function api<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://api.airtable.com/v0${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status === 429 && attempt < 3) {
      await new Promise((r) => setTimeout(r, 30_000)); // Airtable's documented back-off
      continue;
    }
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new AirtableError(res.status, json?.error ?? res.statusText);
    return json as T;
  }
}

type Table = { id: string; name: string; fields: { name: string }[] };

async function main() {
  const fields = buildFields();
  const base = `/meta/bases/${baseId}/tables`;
  const created: string[] = [];
  const skipped: string[] = [];

  const { tables } = await api<{ tables: Table[] }>("GET", base);
  let table = tables.find((t) => t.name === TABLE);
  if (!table) {
    const [primary] = fields;
    table = await api<Table>("POST", base, {
      name: TABLE,
      description: "EagleHacks 2027 applications. MLH member event, 18+ only.",
      fields: [primary],
    });
    created.push(`table "${TABLE}" (with "${primary.name}")`);
  }

  const existing = new Set(table.fields.map((f) => f.name));
  const report = () => {
    console.log(`\nCreated (${created.length}):\n${created.map((c) => `  + ${c}`).join("\n") || "  none"}`);
    console.log(`Already there (${skipped.length}): ${skipped.join(", ") || "none"}`);
  };

  for (const field of fields) {
    if (existing.has(field.name)) {
      if (!created.some((c) => c.includes(`"${field.name}"`))) skipped.push(field.name);
      continue;
    }
    try {
      await api("POST", `${base}/${table.id}/fields`, field);
      created.push(`${field.name} (${field.type})`);
      await new Promise((r) => setTimeout(r, 250)); // stay under 5 requests/second
    } catch (e) {
      report();
      if (!(e instanceof AirtableError)) throw e;
      const count = (field.options as { choices?: unknown[] } | undefined)?.choices?.length;
      console.error(
        `\nStopped: Airtable rejected "${field.name}"${count ? ` with ${count} options` : ""} (HTTP ${e.status}).\n${e.message}`,
      );
      process.exit(1);
    }
  }
  report();
}

main().catch((e) => {
  if (e instanceof AirtableError) {
    console.error(`Airtable returned HTTP ${e.status}: ${e.message}`);
    if (e.status === 404) {
      console.error(
        "Airtable says it can't find the base. Check that AIRTABLE_BASE_ID is only the app... ID (no /tbl... or /viw... after it, no quotes or spaces), and that the token has access to that base.",
      );
    }
  } else {
    console.error(e instanceof Error ? e.message : e);
  }
  process.exit(1);
});
