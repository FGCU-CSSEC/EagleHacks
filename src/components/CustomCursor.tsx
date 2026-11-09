"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, summary, [role='button'], label, [data-cursor-grow]";

/**
 * Pointer-device cursor: a small dot that tracks the pointer with no lag and swells over
 * interactive elements. Difference blending keeps it visible on both dark and light
 * sections. Renders nothing on touch devices.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = dot.current;
    if (!el) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor");

    let visible = false;
    let hovering = false;
    let pressed = false;
    let x = 0;
    let y = 0;
    let frame = 0;

    const draw = () => {
      frame = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.dataset.state = pressed ? "down" : hovering ? "grow" : "idle";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
      hovering = !!(e.target as Element | null)?.closest?.(INTERACTIVE);
      schedule();
    };
    const onDown = () => {
      pressed = true;
      schedule();
    };
    const onUp = () => {
      pressed = false;
      schedule();
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
      root.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] hidden mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      {/* The outer element follows the pointer with no easing; only the inner dot eases its size. */}
      <div ref={dot} className="group absolute left-0 top-0 opacity-0 transition-opacity duration-150" data-state="idle">
        <div className="-ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-white transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-data-[state=down]:scale-[0.7] group-data-[state=grow]:scale-[3.4]" />
      </div>
    </div>
  );
}
