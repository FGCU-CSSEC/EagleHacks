import { aboutPillars, site } from "@/config/site";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="scroll-mt-4">
      <div className="wrap-wide sec-pad">
        {/* Double rule and dateline */}
        <div className="h-[3px] bg-ink" />
        <div className="mt-1 h-px bg-ink" />
        <p className="label m-0 flex justify-between gap-4 py-3 text-muted">
          <span>Fort Myers, Fl.</span>
          <span>{site.dates}</span>
        </p>

        <h2 id="about-h" className="sr-only">
          About {site.name}
        </h2>
        <p className="m-0 mt-6 max-w-[52rem] font-serif text-[22px] leading-[1.4] text-ink desk:mt-8 desk:text-[28px]">
          {site.name} is a {site.hours}-hour hackathon at Florida Gulf Coast University. Students from FGCU and
          schools across Florida team up, build something new, and present it to judges from industry. Free,
          beginner-friendly, 18+.
        </p>

        <div className="mt-8 h-px bg-ink desk:mt-10" />
        <ul className="m-0 list-none p-0 desk:grid desk:grid-cols-3">
          {aboutPillars.map((p) => (
            <li
              key={p.title}
              className="flex items-baseline gap-4 border-b border-ink/25 py-4 last:border-b-0 desk:block desk:border-b-0 desk:px-8 desk:py-8 desk:first:pl-0 desk:last:pr-0 desk:[&:not(:first-child)]:border-l desk:[&:not(:first-child)]:border-ink/30"
            >
              <h3 className="h-display m-0 w-36 shrink-0 text-[44px] desk:mb-3 desk:w-auto desk:text-[clamp(56px,7.4vw,104px)]">
                {p.title}.
              </h3>
              <p className="m-0 text-[15px] leading-snug text-body-light desk:text-[17px]">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
