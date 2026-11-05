import Image from "next/image";
import RegisterButton from "@/components/RegisterButton";
import SiteHeader from "@/components/SiteHeader";
import { site } from "@/config/site";
import { getPublicSettings } from "@/lib/settings";

const nav = [
  { href: "#about", label: "About" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#faq", label: "FAQ" },
  { href: "#team", label: "Team" },
];

export default async function Hero() {
  const { eventDates } = await getPublicSettings();

  return (
    <section aria-labelledby="hero-h" className="relative overflow-hidden bg-ink text-paper">
      {/* Oversized eagle, cropped by the section edge. */}
      <Image
        src="/brand/eagle-white.png"
        alt=""
        aria-hidden="true"
        width={448}
        height={733}
        priority
        className="pointer-events-none absolute -right-24 -bottom-[220px] h-[520px] w-auto max-w-none desk:bottom-auto desk:right-[-6%] desk:top-16 desk:h-[1040px]"
      />

      {/*
        MLH trust badge: once EagleHacks is accepted as an MLH member event,
        MLH sends badge code that must be placed in the top corner of the site.
        Paste it here. The top-right corner is reserved for it (the header and
        hero copy keep clear of this area).
      */}
      <div
        id="mlh-badge-slot"
        className="absolute right-4 top-0 z-20 h-[70px] w-12 desk:right-5 desk:h-[88px] desk:w-[60px]"
      />

      <div className="relative mx-auto max-w-[1240px] px-5 desk:px-8">
        <SiteHeader nav={nav} dates={eventDates} instagram={site.links.instagram} linkedin={site.links.linkedin} />

        <div className="max-w-[640px] pb-[316px] pt-10 desk:pb-28 desk:pt-[120px]">
          <p className="label mb-5 text-muted-dark desk:mb-7">Southwest Florida&rsquo;s hackathon</p>
          <h1 id="hero-h">
            <Image
              src="/brand/wordmark-white.png"
              alt="EagleHacks"
              width={733}
              height={100}
              priority
              sizes="(min-width: 761px) 640px, 100vw"
              className="block h-auto w-full"
            />
            <Image
              src="/brand/2027-white.png"
              alt="2027"
              width={564}
              height={229}
              priority
              sizes="(min-width: 761px) 295px, 56vw"
              className="mt-3.5 block h-auto w-[56%] desk:mt-5 desk:w-[46%]"
            />
          </h1>
          <p className="mt-7 text-lg font-bold leading-[1.35] desk:mt-10 desk:text-xl">
            {eventDates}
            <span className="hidden desk:inline">&nbsp; |&nbsp; </span>
            <br className="desk:hidden" />
            Fort Myers, FL
          </p>
          <p className="mt-0.5 text-base text-on-dark desk:text-lg">Florida Gulf Coast University</p>

          <div className="mt-7 flex flex-col gap-3.5 desk:mt-9 desk:flex-row desk:flex-wrap desk:items-center desk:gap-x-7 desk:gap-y-4">
            <a href="#sponsors" className="cta cta-paper w-full desk:w-auto">
              Sponsor EagleHacks <span aria-hidden="true" className="font-normal [font-stretch:100%]">→</span>
            </a>
            <RegisterButton variant="status" />
          </div>
        </div>
      </div>
    </section>
  );
}
