"use client";

import Image from "next/image";
import Cta from "@/components/Cta";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type NavItem = { href: string; label: string };

type Props = {
  nav: NavItem[];
  dates: string;
  instagram: string;
  linkedin: string;
};

const CLOSE_MS = 520;

/**
 * Site header. Above 760px it shows the wordmark and inline links; below, a "Menu" button
 * opens a full-screen dialog that wipes down from the top and staggers its links in.
 */
export default function SiteHeader({ nav, dates, instagram, linkedin }: Props) {
  const [mounted, setMounted] = useState(false); // dialog is in the DOM
  const [open, setOpen] = useState(false); // dialog is visible; drives the transitions
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const openMenu = () => {
    clearTimeout(timer.current);
    setMounted(true);
    // Wait two frames so the closed state paints first and the transition can run.
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  };

  const close = () => {
    setOpen(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMounted(false), CLOSE_MS);
  };

  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // Close if the viewport grows to desktop while the menu is open.
    const mq = window.matchMedia("(min-width: 761px)");
    const onMq = () => {
      if (mq.matches) close();
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
  }, [mounted]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Staggered entrance when opening; no delay when closing.
  const rise = (i: number): CSSProperties => ({
    transitionDelay: open ? `${220 + i * 70}ms` : "0ms",
  });
  const riseClass = (shown: boolean) =>
    `transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
      shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`;

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
            <a key={n.href} href={n.href} className="label link-underline inline-block py-3 no-underline">
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
          onClick={openMenu}
        >
          Menu
          <svg aria-hidden="true" width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 1h20M0 6h20M0 11h20" />
          </svg>
        </button>
      </header>

      {mounted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink px-5 pb-8 text-paper transition-[clip-path] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none"
          style={{ clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
        >
          <div className={`flex h-[72px] shrink-0 items-center justify-between ${riseClass(open)}`} style={rise(0)}>
            <Image src="/brand/wordmark-white.png" alt="EagleHacks" width={733} height={100} className="h-[15px] w-auto" />
            <button ref={closeBtn} type="button" className="label inline-flex min-h-11 items-center gap-2.5 px-1" onClick={close}>
              Close
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1l14 14M15 1L1 15" />
              </svg>
            </button>
          </div>
          <nav aria-label="Menu" className="mt-10 border-t border-rule-dark">
            {nav.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                onClick={close}
                className={`h-display block border-b border-rule-dark py-3.5 text-[52px] leading-none no-underline ${riseClass(open)}`}
                style={rise(i + 1)}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className={`mt-auto pt-12 ${riseClass(open)}`} style={rise(nav.length + 1)}>
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
