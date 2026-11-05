import Image from "next/image";
import { site } from "@/config/site";
import { getPublicSettings } from "@/lib/settings";

export default async function PhotoMosaic() {
  const { cap } = await getPublicSettings();

  return (
    <section aria-label="Photos from EagleHacks 2026" className="bg-ink px-1.5 pb-1.5 desk:px-2 desk:pb-2">
      <div className="mosaic">
        <div className="m-crowd">
          <Image
            src="/photos/crowd.webp"
            alt="Hackers smiling in the audience at EagleHacks 2026"
            fill
            sizes="(min-width: 1440px) 600px, (min-width: 761px) 42vw, 100vw"
            className="object-[center_45%]"
          />
        </div>
        <div className="m-team">
          <Image
            src="/photos/team-laptop.webp"
            alt="A team gathered around a laptop working on their project"
            fill
            sizes="(min-width: 761px) 33vw, 50vw"
            className="object-[40%_30%] desk:object-[center_30%]"
          />
        </div>
        <div className="m-stat flex flex-col justify-end bg-paper p-4 text-ink desk:p-6">
          <p className="h-display text-[30px] desk:text-[clamp(30px,3.4vw,52px)]">
            {site.hours} hours.
            <br />
            {cap} hackers.
            <br />
            One weekend.
          </p>
        </div>
        <div className="m-award">
          <Image
            src="/photos/award.webp"
            alt="A winning hacker accepting a prize on stage"
            fill
            sizes="(min-width: 761px) 25vw, 50vw"
            className="object-[center_30%]"
          />
        </div>
      </div>
    </section>
  );
}
