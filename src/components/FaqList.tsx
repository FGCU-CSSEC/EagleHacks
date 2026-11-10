"use client";

import { useState, useSyncExternalStore } from "react";

type Item = { q: string; a: string };

const DESKTOP_QUERY = "(min-width: 761px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Desktop (above 760px): every answer is visible in two columns.
 * Mobile: an accordion, one answer open at a time.
 */
export default function FaqList({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isDesktop = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );

  return (
    <div className="mt-8 grid gap-x-14 desk:mt-12 desk:grid-cols-2">
      {items.map((item, i) => {
        const open = isDesktop || openIndex === i;
        return (
          <div key={item.q} className="border-t border-ink/25 py-1 desk:pb-[30px] desk:pt-5">
            <h3 className="m-0">
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={open}
                aria-controls={`faq-a-${i}`}
                tabIndex={isDesktop ? -1 : 0}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex min-h-11 w-full items-center justify-between gap-4 py-2 text-left text-[19px] font-bold leading-[1.3] desk:pointer-events-none desk:min-h-0 desk:cursor-text desk:py-0"
              >
                {item.q}
                <span aria-hidden="true" className="shrink-0 text-2xl font-normal leading-none desk:hidden">
                  {open ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={`faq-a-${i}`}
              role="region"
              aria-labelledby={`faq-q-${i}`}
              inert={!open}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none desk:mt-1.5 desk:grid-rows-[1fr] ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="m-0 pb-4 text-base text-body-light desk:pb-0">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
