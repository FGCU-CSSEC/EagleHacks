import Image from "next/image";
import { organizers, site } from "@/config/site";

const links = [
  { href: site.links.instagram, label: "Instagram", external: true },
  { href: site.links.linkedin, label: "LinkedIn", external: true },
  { href: `mailto:${site.links.email}`, label: "Email", external: false },
  { href: site.links.mlhCodeOfConduct, label: "MLH Code of Conduct", external: true },
  { href: site.links.mlhPrivacy, label: "MLH Privacy Policy", external: true },
  { href: site.links.mlhTerms, label: "MLH Terms", external: true },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="wrap-wide flex flex-wrap items-end justify-between gap-x-12 gap-y-7 pb-9 pt-12 desk:pb-11 desk:pt-14">
        <div className="flex items-center gap-3.5 desk:gap-4">
          <Image src="/brand/eagle-white.png" alt="" width={448} height={733} className="h-14 w-auto desk:h-16" />
          <div>
            <Image
              src="/brand/wordmark-white.png"
              alt="EagleHacks"
              width={733}
              height={100}
              className="block h-[18px] w-auto desk:h-[22px]"
            />
            <p className="label m-0 mt-2 text-muted-dark desk:mt-2.5">Fort Myers, FL</p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3.5 desk:w-auto desk:flex-row desk:flex-wrap desk:items-center desk:gap-x-7 desk:gap-y-4">
          <p className="label m-0 text-muted-dark">Organized by</p>
          <div className="flex items-center gap-6 desk:gap-7">
            {organizers.map((o, i) => (
              <a
                key={o.name}
                href={o.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${o.name} on Instagram`}
                className="inline-flex items-center transition-opacity hover:opacity-75"
              >
                <Image
                  src={o.logo}
                  alt={o.name}
                  width={o.width}
                  height={o.height}
                  className={`w-auto ${i === 0 ? "h-[52px] desk:h-14" : "h-10 desk:h-11"}`}
                />
              </a>
            ))}
          </div>
        </div>

        <ul className="m-0 grid w-full list-none grid-cols-2 gap-x-4 border-t border-rule-dark p-0 pt-3 desk:flex desk:flex-wrap desk:gap-x-6 desk:gap-y-1 desk:pt-5">
          {links.map((l) => (
            <li key={l.label}>
              <a
                className="label block py-[13px] desk:inline-block desk:py-3"
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="label m-0 w-full text-muted-dark">
          © {site.name} {site.year} · Florida Gulf Coast University
        </p>
      </div>
    </footer>
  );
}
