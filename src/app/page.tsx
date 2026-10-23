import RegisterButton from "@/components/RegisterButton";
import { faq, organizers, site, sponsors } from "@/config/site";
import { getPublicSettings } from "@/lib/settings";

const nav = [
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#team", label: "Team" },
];

export default async function Home() {
  const { eventDates, cap } = await getPublicSettings();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      {/*
        MLH trust badge: once EagleHacks is accepted as an MLH member event,
        MLH sends badge code that must be placed in the top corner of the site.
        Paste it here.
      */}

      <header className="border-b border-line bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75 sticky top-0 z-40">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <a href="#" className="font-display text-lg font-bold tracking-tight no-underline whitespace-nowrap">
            EagleHacks <span className="text-muted font-medium">{site.year}</span>
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-7 text-[0.9375rem]">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="no-underline text-muted hover:text-ink">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden sm:block">
            <RegisterButton size="sm" />
          </div>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="wrap pt-16 pb-20 md:pt-28 md:pb-28">
          <p className="text-muted text-lg">{site.tagline}, hosted at FGCU</p>
          <h1 className="mt-3 font-display font-extrabold text-[clamp(3.5rem,13vw,10.5rem)] leading-[0.9] tracking-[-0.045em]">
            EagleHacks
          </h1>
          <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            <div>
              <dt className="text-sm text-muted">When</dt>
              <dd className="font-semibold">{eventDates}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Where</dt>
              <dd className="font-semibold">FGCU, Fort Myers</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Length</dt>
              <dd className="font-semibold">{site.hours} hours</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Hackers</dt>
              <dd className="font-semibold">{cap} spots</dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <RegisterButton />
            <a
              href={site.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-2 underline-offset-4 decoration-line hover:decoration-ink"
            >
              Join the Discord
            </a>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-20 border-t border-line bg-surface">
          <div className="wrap grid gap-10 py-20 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <h2 className="font-display text-4xl font-bold md:text-5xl">About</h2>
            <div className="max-w-[38rem] space-y-5 text-lg">
              <p>
                EagleHacks is a {site.hours}-hour hackathon at Florida Gulf Coast University. Students from FGCU
                and schools across Florida form teams, build something new over a weekend, and present it to
                judges from industry.
              </p>
              <ul className="space-y-3">
                <li className="border-l-4 border-blue pl-4">
                  <span className="font-semibold">Build</span> a project that tackles a real problem, alone or in
                  a team of up to four.
                </li>
                <li className="border-l-4 border-green pl-4">
                  <span className="font-semibold">Learn</span> new tools at workshops run by mentors and sponsors.
                </li>
                <li className="border-l-4 border-blue pl-4">
                  <span className="font-semibold">Meet</span> recruiters and engineers from local and national
                  companies.
                </li>
              </ul>
              <p className="text-muted">
                It&apos;s free, beginner-friendly, and open to students 18 and older.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-line">
          <div className="wrap grid gap-10 py-20 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <div>
              <h2 className="font-display text-4xl font-bold md:text-5xl">FAQ</h2>
              <p className="mt-4 max-w-xs text-muted">
                Didn&apos;t find your answer? Email{" "}
                <a className="underline underline-offset-2" href={`mailto:${site.links.email}`}>
                  {site.links.email}
                </a>
                .
              </p>
            </div>
            <div className="max-w-[40rem] space-y-10">
              {faq.map((group) => (
                <div key={group.category}>
                  <h3 className="mb-3 text-xl font-bold">{group.category}</h3>
                  <div className="divide-y divide-line border-y border-line">
                    {group.items.map((item) => (
                      <details key={item.q} className="faq-item group">
                        <summary className="flex items-start justify-between gap-6 py-4 font-semibold">
                          <span>{item.q}</span>
                          <span aria-hidden="true" className="faq-sign mt-0.5 text-xl leading-none text-muted">
                            +
                          </span>
                        </summary>
                        <p className="pb-5 pr-10 text-muted">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsors */}
        <section id="sponsors" className="scroll-mt-20 border-t border-line bg-surface">
          <div className="wrap grid gap-10 py-20 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Sponsors</h2>
            <div className="max-w-[38rem]">
              {sponsors.length > 0 ? (
                <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {sponsors.map((s) => (
                    <li key={s.name}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold">
                        {s.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.logo} alt={s.name} className="h-12 w-auto" />
                        ) : (
                          s.name
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg">
                  2027 sponsors will be announced here. Want your company in front of 200 student builders?
                </p>
              )}
              <a
                href={`mailto:${site.links.email}?subject=EagleHacks%202027%20sponsorship`}
                className="btn btn-sm btn-pending mt-6 cursor-pointer hover:bg-paper"
              >
                Email us about sponsoring
              </a>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="scroll-mt-20 border-t border-line">
          <div className="wrap py-20">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Organizers</h2>
            <p className="mt-4 max-w-[38rem] text-muted">Run by {site.organizer}.</p>
            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {organizers.map((o) => (
                <li key={o.name} className="border-t border-line pt-4">
                  {o.linkedin ? (
                    <a
                      href={o.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline decoration-line underline-offset-4 hover:decoration-ink"
                    >
                      {o.name}
                    </a>
                  ) : (
                    <span className="font-semibold">{o.name}</span>
                  )}
                  <p className="text-[0.9375rem] text-muted">{o.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-ink text-white">
        <div className="wrap flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-2xl font-bold">EagleHacks {site.year}</p>
            <p className="mt-1 text-white/70">
              {eventDates} · {site.location}
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
            <li>
              <a className="hover:underline" href={site.links.mlhCodeOfConduct} target="_blank" rel="noopener noreferrer">
                MLH Code of Conduct
              </a>
            </li>
            <li>
              <a className="hover:underline" href={site.links.discord} target="_blank" rel="noopener noreferrer">
                Discord
              </a>
            </li>
            <li>
              <a className="hover:underline" href={site.links.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a className="hover:underline" href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a className="hover:underline" href={`mailto:${site.links.email}`}>
                Email
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
