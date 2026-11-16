import { site } from "@/config/site";

export default function ThankYou() {
  return (
    <section aria-labelledby="thanks-h" className="text-center">
      <div className="wrap-wide sec-pad-b">
        {/* Rule with centered label */}
        <div className="flex items-center gap-4 desk:gap-6">
          <div className="h-px flex-1 bg-ink/60" />
          <p className="label m-0 text-muted">A note of thanks</p>
          <div className="h-px flex-1 bg-ink/60" />
        </div>

        <h2
          id="thanks-h"
          className="h-display m-0 mt-6 text-[clamp(64px,11vw,160px)] text-ink desk:mt-8"
        >
          Thank you.
        </h2>
        <p className="mx-auto m-0 mt-6 max-w-[40rem] font-serif text-[18px] leading-[1.5] text-ink desk:mt-8 desk:text-[22px]">
          To every company that has kept {site.name} free for students: none of this happens without you. Our{" "}
          {site.year} sponsors will be announced soon.
        </p>
        <p className="m-0 mt-5 font-serif text-[15px] italic text-muted">— The {site.name} team</p>

        {/* Double rule */}
        <div className="mt-8 h-px bg-ink desk:mt-10" />
        <div className="mt-1 h-[3px] bg-ink" />
      </div>
    </section>
  );
}
