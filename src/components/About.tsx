import { aboutPillars, site } from "@/config/site";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="scroll-mt-4">
      <div className="wrap-wide sec-pad">
        <div className="flex flex-wrap items-end gap-x-16 gap-y-8">
          <h2 id="about-h" className="h-display min-w-[min(100%,420px)] flex-[1_1_420px] text-[64px] desk:text-[clamp(56px,8vw,120px)]">
            Build.<br className="desk:hidden" /> Learn.<br className="desk:hidden" /> Meet.
          </h2>
          <p className="m-0 -mt-2 min-w-[min(100%,320px)] flex-[1_1_320px] text-[17px] leading-normal text-body-light desk:mt-0 desk:text-xl">
            {site.name} is a {site.hours}-hour hackathon at Florida Gulf Coast University. Students from FGCU and
            schools across Florida team up, build something new, and present it to judges from industry. Free,
            beginner-friendly, 18+.
          </p>
        </div>

        <ul className="m-0 mt-10 list-none p-0 desk:mt-16 desk:grid desk:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] desk:gap-x-10 desk:gap-y-8">
          {aboutPillars.map((p, i) => (
            <li
              key={p.title}
              className={`flex items-baseline gap-4 border-t-2 border-ink pb-[18px] pt-3.5 desk:block desk:pb-0 desk:pt-[18px] ${
                i === aboutPillars.length - 1 ? "border-b-2 desk:border-b-0" : ""
              }`}
            >
              <h3 className="cond m-0 w-24 shrink-0 text-[30px] font-extrabold leading-none desk:mb-2 desk:w-auto desk:text-4xl">
                {p.title}
              </h3>
              <p className="m-0 text-[15px] text-body-light desk:text-base">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
