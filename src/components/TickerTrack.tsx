"use client";

import { useEffect, useRef } from "react";

/**
 * A wire-service style ticker. It drifts on its own, speeds up while the page
 * scrolls and reverses when you scroll back up, so it responds to a thumb on
 * mobile as much as a mouse on desktop. With reduced motion it is a static line.
 */
export default function TickerTrack({ items }: { items: string[] }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let offset = 0;
    let dir = -1; // -1 drifts left, 1 right
    let boost = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (Math.abs(dy) > 1) dir = dy > 0 ? -1 : 1;
      boost = boost * 0.92 + Math.abs(dy) * 0.6;
      const half = el.scrollWidth / 2;
      offset += dir * (45 + Math.min(boost * 18, 600)) * dt;
      if (offset <= -half) offset += half;
      if (offset > 0) offset -= half;
      el.style.transform = `translate3d(${offset}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Two identical groups so the loop is seamless; each group repeats the items
  // to be wider than any screen.
  const group = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className={`flex shrink-0 items-center ${hidden ? "motion-reduce:hidden" : ""}`}>
      {[...items, ...items].map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span>{item}</span>
          <span aria-hidden="true" className="px-5 text-[0.6em] desk:px-7">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={track} className="flex w-max motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
      {group(false)}
      {group(true)}
    </div>
  );
}
