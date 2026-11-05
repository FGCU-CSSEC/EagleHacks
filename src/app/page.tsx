import Hero from "@/components/Hero";
import PhotoMosaic from "@/components/PhotoMosaic";
import Sponsors from "@/components/Sponsors";
import Team from "@/components/Team";
import { faq, site } from "@/config/site";
import { getPublicSettings } from "@/lib/settings";

export default async function Home() {
  const { eventDates } = await getPublicSettings();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <main id="main">
        <Hero />
        <PhotoMosaic />

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
            <div className="max-w-[40rem] divide-y divide-line border-y border-line">
              {faq.map((item) => (
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
        </section>

        <Sponsors />

        <Team />
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
