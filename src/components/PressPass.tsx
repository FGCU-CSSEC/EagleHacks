"use client";

import { useEffect, useRef } from "react";

const MAX = (55 * Math.PI) / 180;
const STIFFNESS = 22; // g / L: how quickly the pendulum swings
const DAMPING = 1.1;

/**
 * A press pass on a lanyard that hangs from the top of the hero. It sways on
 * its own, swings when the mouse brushes it, and can be dragged and let go.
 * Decorative only: hidden from assistive tech and not focusable. Static with
 * reduced motion.
 */
export default function PressPass() {
  const anchor = useRef<HTMLDivElement>(null);
  const swing = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchorEl = anchor.current;
    const swingEl = swing.current;
    if (!anchorEl || !swingEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      swingEl.style.transform = "rotate(-3deg)";
      return;
    }

    let theta = 0.3; // radians, positive = clockwise; start with a small swing
    let omega = 0;
    let dragging = false;
    let lastDragAngle = 0;
    let lastDragTime = 0;
    let last = performance.now();
    let frame = 0;

    const angleTo = (x: number, y: number) => {
      const r = anchorEl.getBoundingClientRect();
      return Math.max(-MAX, Math.min(MAX, Math.atan2(r.left + r.width / 2 - x, y - r.top)));
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      if (!dragging) {
        omega += (-STIFFNESS * Math.sin(theta) - DAMPING * omega) * dt;
        theta += omega * dt;
      }
      const idle = dragging ? 0 : 0.03 * Math.sin(now / 1100);
      swingEl.style.transform = `rotate(${(theta + idle) * (180 / Math.PI)}deg)`;
      frame = requestAnimationFrame(tick);
    };

    const onEnterMove = (e: PointerEvent) => {
      if (dragging || e.pointerType !== "mouse") return;
      const r = swingEl.getBoundingClientRect();
      const inside = e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
      if (inside) omega = Math.max(-4, Math.min(4, omega - e.movementX * 0.05));
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      omega = 0;
      lastDragAngle = theta = angleTo(e.clientX, e.clientY);
      lastDragTime = performance.now();
      swingEl.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const a = angleTo(e.clientX, e.clientY);
      const now = performance.now();
      const dt = Math.max((now - lastDragTime) / 1000, 0.001);
      omega = (a - lastDragAngle) / dt;
      lastDragAngle = theta = a;
      lastDragTime = now;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      omega = Math.max(-6, Math.min(6, omega));
      last = performance.now();
    };

    document.addEventListener("pointermove", onEnterMove);
    swingEl.addEventListener("pointerdown", onDown);
    swingEl.addEventListener("pointermove", onMove);
    swingEl.addEventListener("pointerup", onUp);
    swingEl.addEventListener("pointercancel", onUp);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onEnterMove);
      swingEl.removeEventListener("pointerdown", onDown);
      swingEl.removeEventListener("pointermove", onMove);
      swingEl.removeEventListener("pointerup", onUp);
      swingEl.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      ref={anchor}
      aria-hidden="true"
      className="absolute right-24 top-0 z-10 hidden w-[132px] select-none min-[1100px]:block"
    >
      <div ref={swing} className="origin-top cursor-grab touch-none active:cursor-grabbing" style={{ transformOrigin: "50% 0" }}>
        {/* Lanyard strap with stitching and clip */}
        <div className="mx-auto -mt-6 h-[104px] w-4 bg-accent shadow-[inset_2px_0_0_rgba(255,255,255,0.25),inset_-2px_0_0_rgba(0,0,0,0.25)]" />
        <div className="mx-auto h-4 w-6 rounded-sm bg-[#8d8a82]" />
        {/* The pass */}
        <div className="relative -mt-1 rounded-md bg-paper px-3 pb-3 pt-6 text-ink shadow-[0_18px_30px_rgba(0,0,0,0.45)]">
          <span className="absolute left-1/2 top-2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-ink/80" />
          <p className="cond m-0 text-center text-[46px] font-black leading-[0.9]">Press</p>
          <div className="my-2 border-y-2 border-ink py-1 text-center">
            <p className="label m-0 text-[9px] tracking-[0.18em]">EagleHacks 2027</p>
          </div>
          <p className="label m-0 text-center text-[9px] tracking-[0.18em] text-muted">Admit one hacker</p>
          <div
            className="mt-2.5 h-7"
            style={{
              background:
                "repeating-linear-gradient(90deg, #111 0 2px, transparent 2px 4px, #111 4px 5px, transparent 5px 8px, #111 8px 11px, transparent 11px 13px)",
            }}
          />
          <p className="label m-0 mt-1.5 text-center text-[9px] tracking-[0.18em]">Mar 12–14</p>
        </div>
      </div>
    </div>
  );
}
