import Image from "next/image";
import SponsorRequestDialog from "@/components/SponsorRequestDialog";
import { site, sponsorPerks } from "@/config/site";

export default function Sponsors() {
  return (
    <section id="sponsors" aria-labelledby="sp-h" className="scroll-mt-4 bg-ink text-paper">
      <div className="wrap-wide sec-pad grid gap-x-[72px] desk:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="desk:col-start-1 desk:row-start-1">
          <h2 id="sp-h" className="h-display text-[clamp(52px,7vw,104px)] leading-[0.88]">
            Sponsor EagleHacks {site.year}
          </h2>
          <p className="mt-7 max-w-[560px] text-xl leading-normal text-on-dark">
            Sponsors keep EagleHacks free for every hacker while connecting with the next generation of engineers
            and innovators!
          </p>
        </div>

        <div className="relative my-10 h-[380px] desk:col-start-2 desk:row-span-2 desk:row-start-1 desk:my-0 desk:h-[560px] desk:self-center">
          <Image
            src="/photos/sponsor-booth.webp"
            alt="A sponsor recruiter talking with a student at the EagleHacks 2026 career fair"
            fill
            sizes="(min-width: 1240px) 320px, (min-width: 761px) 30vw, 100vw"
            className="object-cover object-[center_20%]"
          />
        </div>

        <div className="desk:col-start-1 desk:row-start-2">
          <ul className="m-0 list-none p-0 desk:mt-11">
            {sponsorPerks.map((p, i) => (
              <li
                key={p.title}
                className={`flex flex-wrap gap-x-6 gap-y-1 border-t border-rule-dark py-4 ${
                  i === sponsorPerks.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="cond w-[180px] shrink-0 text-[26px] font-extrabold leading-[1.1]">{p.title}</span>
                <span className="min-w-[240px] flex-1 text-base text-on-dark">{p.body}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-x-7 gap-y-4 desk:flex-row desk:flex-wrap desk:items-center">
            <SponsorRequestDialog email={site.links.email} />
            <p className="m-0 text-[15px] text-muted-dark">In-kind welcome: food, swag, hardware, cloud credits.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
