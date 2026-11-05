import TickerTrack from "@/components/TickerTrack";
import { getPublicSettings } from "@/lib/settings";

// Facts that aren't already stated in the hero, photo tile or About text.
export default async function Ticker() {
  const { state } = await getPublicSettings();
  const applications =
    state === "open"
      ? "Applications open now"
      : state === "waitlist"
        ? "Waitlist open"
        : state === "closed"
          ? "Applications closed"
          : "Applications open soon";
  const items = [
    applications,
    "Teams of up to four",
    "Workshops and mentors all weekend",
    "Meals and snacks provided",
    "Meet recruiters from local and national companies",
    "Hosted by CSSEC and INIT FGCU",
  ];

  return (
    <section
      aria-label="More about EagleHacks"
      className="overflow-hidden border-y-2 border-ink bg-paper py-2.5 text-ink desk:py-3"
    >
      <p className="sr-only">{items.join(", ")}</p>
      <div aria-hidden="true" className="cond text-[26px] font-extrabold leading-none desk:text-[34px]">
        <TickerTrack items={items} />
      </div>
    </section>
  );
}
