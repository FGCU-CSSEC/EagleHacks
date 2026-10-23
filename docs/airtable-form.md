# Airtable application form

Source: [MLH registration guide](https://guide.mlh.com/general-information/managing-registrations/registrations).
Create the table with `npx tsx scripts/setup-airtable.ts`, then build a **Form view** on the
`Applications` table with the settings below. Fields appear in the order they were created.

## Form header

Put this in the form description until EagleHacks reaches MLH Membership stage, then remove it:

> We are currently in the process of partnering with MLH.

Also say on the form that EagleHacks is for hackers 18 and older.

## Fields

"Input type" is what the field is in Airtable; the form shows it automatically, so you don't
choose it in the form editor. "Required" means switch on **Required** for that field in the form
view. MLH only mandates the fields marked **MLH**.

| Field | Input type | Default value | Required in form? | Notes |
| --- | --- | --- | --- | --- |
| First name | Short text | None (blank) | Yes (MLH) |  |
| Last name | Short text | None (blank) | Yes (MLH) |  |
| Email | Email | None (blank) | Yes (MLH) |  |
| Phone | Phone number | None (blank) | Yes (MLH) |  |
| Age | Dropdown (pick one) | None (blank) | Yes (MLH) | 18 to 30, then 31+. MLH wants ages, not date of birth. |
| School | Short text | None (blank) | Yes (MLH) | Not MLH's dropdown yet. See "School" below. |
| Level of study | Dropdown (pick one) | None (blank) | Yes (MLH) |  |
| Country of residence | Dropdown (pick one) | None (blank) | Yes (MLH) | ISO 3166 names, United States first. |
| Major | Dropdown (pick one) | None (blank) | No |  |
| Graduation year | Dropdown (pick one) | None (blank) | No | 2026 to 2031. MLH allows Level of study instead of, or alongside, graduation year. |
| Resume | File upload | None (blank) | No |  |
| GitHub | Link (URL) | None (blank) | No |  |
| LinkedIn | Link (URL) | None (blank) | No |  |
| Gender | Dropdown (pick one) | None (blank) | No |  |
| Pronouns | Dropdown (pick one) | None (blank) | No | Always optional. |
| Pronouns - Other, please specify | Short text | None (blank) | No | Show only when Pronouns is "Other". |
| Race/ethnicity | Multi-select (pick any) | None (blank) | No | Applicants can choose more than one. |
| Race/ethnicity - Other, please specify | Short text | None (blank) | No | Show only when Race/ethnicity includes "Other (Please Specify)". |
| Dietary restrictions | Multi-select (pick any) | None (blank) | No |  |
| Dietary details | Long text | None (blank) | No |  |
| T-shirt size, US | Dropdown (pick one) | None (blank) | No | Make it required if you need sizes for ordering. |
| I am 18 or older | Checkbox | Unchecked | Yes | EagleHacks is 18+ only. |
| MLH Code of Conduct | Checkbox | Unchecked | Yes (MLH) | Exact wording below. |
| MLH data sharing | Checkbox | Unchecked | Yes (MLH) | Exact wording below. |
| MLH and DEV emails | Checkbox | Unchecked | No (MLH) | Optional for hackers, but MLH requires it to be on the form. |

**Default values:** leave every applicant field blank, with nothing pre-selected. The three consent
checkboxes (Code of Conduct, data sharing, emails) must start unchecked, because MLH needs the
applicant to opt in themselves. Don't pre-select "United States" or "None" either; wrong guesses
become wrong data.

**Leave these out of the form view** (staff only): `Status`, `Reviewer notes`, `Submitted at`.
New rows start with an empty Status; treat empty as Pending. Airtable forms can't set a Status default, and applicants never see it. If you want one, set the field's default value to "Pending" in the Airtable field settings.

## Checkbox wording

Each checkbox field's description already holds this text (the script put it there). In the form
view, paste the same text into the field's label or description so applicants see it. Each is a
single checkbox. Include the links so they are clickable.

**MLH Code of Conduct** (required)

> I have read and agree to the MLH Code of Conduct. (https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md)

**MLH data sharing** (required)

> I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and administration (including the creation of linked accounts on MLH and DEV (dev.to)) in line with the MLH Privacy Policy. I further agree to the terms of both the MLH Contest Terms and Conditions (https://github.com/MLH/mlh-policies/blob/main/contest-terms.md) and the MLH Privacy Policy

**MLH and DEV emails** (optional, but must be on the form)

> I authorize MLH + DEV to send me occasional emails about relevant events, career opportunities, and community announcements.

**I am 18 or older** (required; our own wording)

> I confirm that I am 18 years of age or older.

The data sharing text is copied exactly from the MLH guide as of 2026-10-22, including its
"ranking, and administration" phrasing. Re-check it against the guide before the form goes live.

## School

MLH requires School to be picked from its verified list (about 17,500 unique names), but
Airtable caps a select field at 10,000 options (it rejected the full list). So `School` is a
**single-line text** field for now. This does not meet MLH's "pick from the verified list" rule,
so treat the Airtable form as a stopgap.

Until the `/apply` form exists (see the TODO in `CLAUDE.md`):

- Tell applicants to type their school's full official name, as it appears on MLH's list:
  https://github.com/MLH/mlh-policies/blob/main/schools.csv
- Add short help text under the School field in the form view, for example:
  "Type your school's full name, for example: Florida Gulf Coast University."
- Don't open the form to the public before January; use it for testing only.
