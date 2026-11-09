import Cta from "@/components/Cta";
import { site } from "@/config/site";

export default function Location() {
  return (
    <section id="location" aria-labelledby="location-h" className="scroll-mt-4">
      <div className="wrap-wide sec-pad-b">
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8 border-t border-ink/25 pt-10 desk:pt-14">
          <div>
            <h2 id="location-h" className="h-display text-[clamp(48px,6vw,88px)]">
              Find us
            </h2>
            <address className="m-0 mt-5 text-lg not-italic leading-normal text-body-light">
              {site.address.map((line, i) => (
                <span key={line} className={`block ${i === 0 ? "font-bold text-ink" : ""}`}>
                  {line}
                </span>
              ))}
            </address>
            <Cta
              variant="accent"
              href={site.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full desk:w-auto"
            >
              Get directions
            </Cta>
          </div>

          <iframe
            title={`Map showing ${site.venue}, ${site.address[1]}, ${site.address[2]}`}
            src={site.mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[240px] w-full border-0 desk:w-[420px]"
          />
        </div>
      </div>
    </section>
  );
}
