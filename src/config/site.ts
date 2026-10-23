// ---------------------------------------------------------------------------
// EagleHacks site settings
// Dates, cap, registration state/window, application URL and RSVP window now
// live in the site_settings table (edit at /admin/settings). The values here are
// the fallback when the database is unreachable or a setting is unset.
// ---------------------------------------------------------------------------

export type RegistrationState = "coming-soon" | "open" | "waitlist" | "closed";

export const site = {
  name: "EagleHacks",
  year: 2027,
  tagline: "Southwest Florida's hackathon",
  dates: "March 12–14, 2027",
  startDate: "2027-03-12",
  location: "Florida Gulf Coast University, Fort Myers, FL",
  hours: 36,
  cap: 200,
  rsvpWindowDays: 7, // days an accepted hacker has to confirm
  organizer: "FGCU Computer Science & Software Engineering Club (CSSEC)",
  url: "https://eagle-hacks.com",

  registration: {
    // Manual state. Change this and redeploy (or set NEXT_PUBLIC_REGISTRATION_STATE
    // in Vercel) to flip the button.
    state: (process.env.NEXT_PUBLIC_REGISTRATION_STATE as RegistrationState) || "coming-soon",
    // Shown while state is "coming-soon".
    opensLabel: "January 2027",
    // Airtable form link used while state is "open" or "waitlist".
    formUrl: process.env.NEXT_PUBLIC_APPLICATION_URL || "",
  },

  links: {
    discord: "https://discord.gg/kVzFTrtxW3",
    instagram: "https://instagram.com/fgcu_cssec",
    linkedin: "https://www.linkedin.com/company/cssec/",
    email: "fgcu.cssec@gmail.com",
    devpost: "", // add the 2027 Devpost link when it exists
    hackerGuide: "", // add the public Notion guide link when it exists
    mlhCodeOfConduct: "https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md",
  },
} as const;

export const faq: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: "General",
    items: [
      {
        q: "What is a hackathon?",
        a: "A weekend where students team up to build a project from scratch, learn new tools at workshops, and meet mentors and sponsors. At the end, teams demo what they made and judges award prizes.",
      },
      {
        q: "How much experience do I need?",
        a: "None. First-time hackers are welcome, and there will be beginner workshops and mentors to help you get a project working.",
      },
      {
        q: "How much does it cost?",
        a: "Nothing. Food, swag and the venue are covered by our sponsors.",
      },
      {
        q: "Who can participate?",
        a: "Students and recent graduates who are 18 or older, from any school or major. All attendees agree to the MLH Code of Conduct.",
      },
    ],
  },
  {
    category: "Event details",
    items: [
      {
        q: "When and where is it?",
        a: "March 12–14, 2027 at Florida Gulf Coast University in Fort Myers. Exact building and check-in times will be in the hacker guide.",
      },
      {
        q: "How big can my team be?",
        a: "Up to four people. You can also come solo and find a team at the event or in our Discord.",
      },
      {
        q: "How many people can attend?",
        a: "We have room for 200 hackers. Accepted applicants confirm their spot by email, and spots go to the first 200 who confirm.",
      },
    ],
  },
  {
    category: "Logistics",
    items: [
      {
        q: "What should I bring?",
        a: "A laptop and charger, a student ID, and anything you need to stay comfortable overnight. Hardware is welcome.",
      },
      {
        q: "Will there be food?",
        a: "Yes, meals and snacks are provided throughout the weekend. Tell us about dietary needs when you apply.",
      },
    ],
  },
  {
    category: "Sponsors and volunteers",
    items: [
      {
        q: "How can my company sponsor?",
        a: "Email us at fgcu.cssec@gmail.com and we'll send the 2027 sponsorship packet.",
      },
      {
        q: "Can I volunteer or mentor?",
        a: "Yes. Email us or message an organizer on Discord, and we'll add you to the volunteer list.",
      },
    ],
  },
];

// 2026 team as a starting point. Update for the 2027 board.
export const organizers: { name: string; role: string; linkedin?: string }[] = [
  { name: "Deividas Ilgunas", role: "Lead hackathon coordinator", linkedin: "https://www.linkedin.com/in/dilgunas2003/" },
  { name: "Jordan Robertson", role: "Co-lead hackathon coordinator", linkedin: "https://www.linkedin.com/in/jordantyrobertson/" },
  { name: "Allison Brown", role: "Budget, communications, events, logistics, marketing", linkedin: "https://www.linkedin.com/in/allison-brown27/" },
  { name: "Tommy Baratta", role: "Communications, events, logistics", linkedin: "https://www.linkedin.com/in/thomas-baratta/" },
  { name: "Dominique Lucien", role: "Events", linkedin: "https://www.linkedin.com/in/dominique-lucien/" },
  { name: "Lentz Fortune", role: "Budget, logistics", linkedin: "https://www.linkedin.com/in/lentzfortune/" },
  { name: "Katharine Ringo", role: "Events, logistics", linkedin: "https://www.linkedin.com/in/katharine-ringo-422917274/" },
  { name: "Samson Silver", role: "Communications, marketing", linkedin: "https://www.linkedin.com/in/samson-silver-798536293/" },
  { name: "Kayla Kerr", role: "Budget, marketing", linkedin: "https://www.linkedin.com/in/kayla-kerr-a67a121b5/" },
  { name: "Professor Allen", role: "Faculty advisor", linkedin: "https://www.linkedin.com/in/paul-allen-235312b/" },
];

// 2027 sponsors go here as they sign. Leave empty to show the "become a sponsor" message.
export const sponsors: { name: string; url: string; logo?: string }[] = [];
