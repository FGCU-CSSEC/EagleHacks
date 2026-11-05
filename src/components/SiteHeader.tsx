"use client";

import Image from "next/image";
import Cta from "@/components/Cta";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string };

type Props = {
  nav: NavItem[];
  dates: string;
  instagram: string;
  linkedin: string;
};

/**
 * Top bar. Desktop (above 760px): wordmark plus inline links.
 * Mobile: a "Menu" button that opens a full-screen dark menu.
 */
export default function SiteHeader({ nav, dates, instagram, linkedin }: Props) {
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // If the viewport grows to desktop while open, drop the menu.
    const mq = window.matchMedia("(min-width: 761px)");
    const onMq = () => {
      if (mq.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    const btn = menuBtn.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      btn?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="flex h-[72px] items-center justify-between gap-x-8 pr-[76px] desk:h-auto desk:py-[22px] desk:pr-24 min-[1100px]:pr-56">
        <a href="#" aria-label="EagleHacks home" className="flex min-h-11 items-center no-underline">
          <Image
            src="/brand/wordmark-white.png"
            alt="EagleHacks"
            width={733}
            height={100}
            className="h-[15px] w-auto desk:h-[18px]"
          />
        </a>
        <nav aria-label="Main" className="hidden flex-wrap gap-x-7 gap-y-1 desk:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="label inline-block py-3 no-underline hover:opacity-75">
              {n.label}
            </a>
          ))}
        </nav>
        <button
          ref={menuBtn}
          type="button"
          className="label inline-flex min-h-11 items-center gap-2.5 px-1 desk:hidden"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          Menu
          <svg aria-hidden="true" width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 1h20M0 6h20M0 11h20" />
          </svg>
        </button>
      </header>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink px-5 pb-8 text-paper"
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between">
            <Image src="/brand/wordmark-white.png" alt="EagleHacks" width={733} height={100} className="h-[15px] w-auto" />
            <button ref={closeBtn} type="button" className="label inline-flex min-h-11 items-center gap-2.5 px-1" onClick={close}>
              Close
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1l14 14M15 1L1 15" />
              </svg>
            </button>
          </div>
          <nav aria-label="Menu" className="mt-10 border-t border-rule-dark">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={close}
                className="h-display block border-b border-rule-dark py-3.5 text-[52px] leading-none no-underline"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto pt-12">
            <p className="mb-4 text-[15px] text-on-dark">{dates} · Fort Myers, FL</p>
            <Cta href="#sponsors" onClick={close} className="w-full">
              Sponsor EagleHacks
            </Cta>
            <div className="mt-4 flex gap-6">
              <a className="label inline-block py-3" href={instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a className="label inline-block py-3" href={linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
