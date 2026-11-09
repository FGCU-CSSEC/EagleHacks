"use client";

import { useEffect, useState } from "react";

type Props = { start: string; end: string };

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** Live countdown to the event start. Renders a placeholder until mounted so server and client markup match. */
export default function Countdown({ start, end }: Props) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  // Reserves the height so the layout does not shift when the numbers appear.
  const box = "mt-8 min-h-[76px] desk:mt-10 desk:min-h-[92px]";

  if (now === null) return <div className={box} aria-hidden="true" />;
  if (now >= endMs) return null;
  if (now >= startMs) {
    return (
      <p className={`${box} label m-0 flex items-center text-paper`}>EagleHacks is happening now</p>
    );
  }

  const t = parts(startMs - now);
  const cells = [
    ["Days", t.days],
    ["Hrs", t.hours],
    ["Min", t.minutes],
    ["Sec", t.seconds],
  ] as const;

  return (
    <div className={box}>
      <p className="label m-0 mb-2 text-muted-dark">Hacking starts in</p>
      <p className="sr-only">{t.days} days until EagleHacks begins</p>
      <div aria-hidden="true" className="flex gap-4 desk:gap-6">
        {cells.map(([label, value]) => (
          <div key={label} className="min-w-[52px]">
            <div className="cond text-[44px] font-black leading-[0.9] tabular-nums desk:text-[60px]">
              {String(value).padStart(2, "0")}
            </div>
            <div className="label mt-1 text-[10px] text-muted-dark">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
