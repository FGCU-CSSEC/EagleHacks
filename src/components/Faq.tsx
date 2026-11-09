import FaqList from "@/components/FaqList";
import { faq, site } from "@/config/site";

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="scroll-mt-4">
      <div className="wrap-wide sec-pad">
        <h2 id="faq-h" className="h-display text-[clamp(56px,8vw,120px)]">
          FAQ
        </h2>
        <FaqList items={faq} />
        <p className="mt-3 text-base text-muted">
          Something else?{" "}
          <a className="text-ink underline underline-offset-4" href={`mailto:${site.links.email}`}>
            {site.links.email}
          </a>
        </p>
      </div>
    </section>
  );
}
