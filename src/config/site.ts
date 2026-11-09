// Site content and fallback settings.
//
// Dates, cap, registration state and window, application URL and the RSVP window are stored in the
// site_settings table (edited at /admin/settings). The values in `site` below are used when the
// database is unreachable or a setting is unset. Everything else here is plain content.

export type RegistrationState = "coming-soon" | "open" | "waitlist" | "closed";

export const site = {
  name: "EagleHacks",
  year: 2027,
  tagline: "FGCU's 4th Annual Hackathon",
  dates: "March 12–14, 2027",
  startDate: "2027-03-12",
  endDate: "2027-03-14",
  venue: "Academic Building 9 (AB 9)",
  address: ["Academic Building 9 (AB9)", "11098 FGCU Blvd. N.", "Fort Myers, FL 33965"],
  mapUrl: "https://www.google.com/maps/search/?api=1&query=11098+FGCU+Blvd+N+Fort+Myers+FL+33965",
  mapEmbedUrl: "https://www.google.com/maps?q=11098+FGCU+Blvd+N,+Fort+Myers,+FL+33965&z=17&output=embed",
  hours: 36,
  cap: 200,
  rsvpWindowDays: 7, // days an accepted hacker has to confirm
  url: "https://eagle-hacks.com",

  registration: {
    // Manual state. Change it and redeploy, or set NEXT_PUBLIC_REGISTRATION_STATE.
    state: (process.env.NEXT_PUBLIC_REGISTRATION_STATE as RegistrationState) || "coming-soon",
    // Shown while state is "coming-soon".
    opensLabel: "January 2027",
    // Airtable form link used while state is "open" or "waitlist".
    formUrl: process.env.NEXT_PUBLIC_APPLICATION_URL || "",
  },

  links: {
    instagram: "https://www.instagram.com/init.fgcu/",
    linkedin: "https://www.linkedin.com/company/init-fgcu",
    email: "fgcu.cssec@gmail.com",
    devpost: "", // add the 2027 Devpost link when it exists
    hackerGuide: "", // add the public Notion guide link when it exists
    mlhCodeOfConduct: "https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md",
    mlhPrivacy: "https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md",
    mlhTerms: "https://github.com/MLH/mlh-policies/blob/main/contest-terms.md",
  },
} as const;

export const faq: { q: string; a: string }[] = [
  {
    q: "What is a hackathon?",
    a: "A weekend where students team up to build a project from scratch, learn at workshops, and demo for judges who award prizes.",
  },
  {
    q: "How much experience do I need?",
    a: "None. First-timers are welcome, with beginner workshops and mentors on hand.",
  },
  {
    q: "How much does it cost?",
    a: "Nothing. Food, swag and the venue are covered by our sponsors.",
  },
  {
    q: "Who can participate?",
    a: "Students and recent grads 18 or older, from any school or major. Everyone follows the MLH Code of Conduct.",
  },
  {
    q: "How big can my team be?",
    a: "Up to four. Come solo and find a team at the event.",
  },
  {
    q: "What should I bring?",
    a: "A laptop, charger, valid ID, and whatever keeps you comfortable overnight.",
  },
  {
    q: "Will there be food?",
    a: "Yes, meals and snacks all weekend. Tell us about dietary needs when you apply.",
  },
  {
    q: "How can my company sponsor?",
    a: "Email fgcu.cssec@gmail.com and we will send the 2027 sponsorship packet.",
  },
];

// Organizing groups, shown with their logos in the footer.
export const organizers: { name: string; logo: string; width: number; height: number; instagram: string }[] = [
  {
    name: "FGCU Computer Science & Software Engineering Club (CSSEC)",
    logo: "/brand/cssec-white.png",
    width: 600,
    height: 514,
    instagram: "https://www.instagram.com/fgcu_cssec/",
  },
  {
    name: "INIT FGCU",
    logo: "/brand/init-fgcu-wordmark-white.png",
    width: 1057,
    height: 408,
    instagram: "https://www.instagram.com/init.fgcu/",
  },
];

// Team members in display order. A headshot is picked up from public/photos/headshots/ by key
// (e.g. allison.webp; .jpg, .jpeg and .png also work). Without one, the card shows initials.
export const team: { key: string; name: string; role: string; linkedin?: string }[] = [
  { key: "allison", name: "Allison Brown", role: "Logistics, Communications, Budgeting, Marketing, Events", linkedin: "https://www.linkedin.com/in/abrown27/" },
  { key: "jeremy", name: "Jeremy Goldberg", role: "Logistics, Events", linkedin: "https://www.linkedin.com/in/jeremygoldbergswe/" },
  { key: "maria", name: "Maria Serpa Sanchez", role: "Logistics, Communications, Marketing", linkedin: "https://www.linkedin.com/in/maria-angel-serpa/" },
  { key: "katharine", name: "Katharine Ringo", role: "Logistics, Communications", linkedin: "https://www.linkedin.com/in/katharine-ringo-422917274/" },
  { key: "conrado", name: "Conrado Santizo", role: "Budgeting, Marketing", linkedin: "https://www.linkedin.com/in/conrado-santizo/" },
  { key: "javier", name: "Javier Tellez", role: "Marketing, Events", linkedin: "https://www.linkedin.com/in/javier-tellez-0297ba222/" },
  { key: "mihails", name: "Mihails Balalajs", role: "Communications, Budgeting, Events" },
];

// The three columns in the About section.
export const aboutPillars: { title: string; body: string }[] = [
  { title: "Build", body: "A project from scratch, solo or in a team of up to four." },
  { title: "Learn", body: "Workshops from mentors and sponsors. No experience needed." },
  { title: "Meet", body: "Recruiters and engineers from local and national companies." },
];

// Reasons to sponsor, shown in the sponsors band.
export const sponsorPerks: { title: string; body: string }[] = [
  { title: "Recruit", body: "Meet students while they build, not just on paper." },
  { title: "Showcase", body: "Run a workshop or put your API and hardware in hackers’ hands." },
  { title: "Invest locally", body: "Back Southwest Florida’s student tech community." },
];
