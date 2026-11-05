"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type Member = { name: string; role: string; linkedin?: string; photo?: string };

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="2">
      {dir === "prev" ? <path d="M18 6H2M7 1L2 6l5 5" /> : <path d="M0 6h16M11 1l5 5-5 5" />}
    </svg>
  );
}

/** Scroll-snap carousel of committees. Works without JS; the buttons just page it. */
export default function TeamCarousel({ members }: { members: Member[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const card = el.querySelector("li");
    const step = (card?.getBoundingClientRect().width ?? el.clientWidth) + 16;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  const btn =
    "inline-flex h-11 w-11 items-center justify-center border border-ink text-ink transition-opacity hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink";

  return (
    <div>
      <div className="flex justify-end gap-2">
        <button type="button" className={btn} aria-label="Previous team members" disabled={atStart} onClick={() => page(-1)}>
          <Arrow dir="prev" />
        </button>
        <button type="button" className={btn} aria-label="Next team members" disabled={atEnd} onClick={() => page(1)}>
          <Arrow dir="next" />
        </button>
      </div>

      <ul
        ref={track}
        onScroll={update}
        tabIndex={0}
        aria-label="Team members"
        className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {members.map((m) => (
          <li
            key={m.name}
            className="w-[56%] shrink-0 snap-start min-[520px]:w-[calc((100%-32px)/3)] desk:w-[calc((100%-64px)/5)]"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
              {m.photo ? (
                <Image
                  src={m.photo}
                  alt={`Headshot of ${m.name}`}
                  fill
                  sizes="(min-width: 761px) 232px, (min-width: 520px) 33vw, 56vw"
                  className="object-cover object-top"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="cond absolute inset-0 flex items-center justify-center text-[96px] font-black text-paper/90"
                >
                  {initials(m.name)}
                </span>
              )}
            </div>
            <div className="mt-3 flex items-start justify-between gap-2 border-t-2 border-ink pt-3">
              <div className="min-w-0">
                <p className="m-0 text-[17px] font-bold leading-tight">{m.name}</p>
                <p className="m-0 mt-1 text-sm leading-snug text-muted">{m.role}</p>
              </div>
              {m.linkedin && (
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on LinkedIn`}
                  className="-mt-2 -mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center hover:opacity-70"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center bg-ink text-paper">
                    <LinkedInIcon />
                  </span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
