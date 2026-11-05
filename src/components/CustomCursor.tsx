"use client";

import { useEffect, useRef } from "react";

const interactive = "a, button, summary, [role='button'], label";

/**
 * Desktop-only cursor: a small dot that follows the pointer exactly and a ring
 * that trails it and swells over links and buttons. Uses difference blending so
 * it reads on both the ink and paper sections. Does nothing on touch devices.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;

    const html = document.documentElement;
    html.classList.add("custom-cursor");

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let frame = 0;

    const draw = () => {
      rx += (x - rx) * (reduce ? 1 : 0.18);
      ry += (y - ry) * (reduce ? 1 : 0.18);
      scale += (targetScale - scale) * (reduce ? 1 : 0.2);
      dotEl.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0) scale(${targetScale > 1 ? 0.4 : 1})`;
      ringEl.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${scale})`;
      frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        dotEl.style.opacity = ringEl.style.opacity = "1";
      }
      targetScale = (e.target as Element | null)?.closest?.(interactive) ? 2 : 1;
    };
    const onDown = () => (targetScale = 0.7);
    const onUp = () => (targetScale = 1);
    const onLeave = () => {
      visible = false;
      dotEl.style.opacity = ringEl.style.opacity = "0";
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      html.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={ring} className="absolute left-0 top-0 h-9 w-9 rounded-full border-[1.5px] border-white opacity-0 transition-opacity duration-200" />
      <div ref={dot} className="absolute left-0 top-0 h-2 w-2 rounded-full bg-white opacity-0 transition-opacity duration-200" />
    </div>
  );
}
