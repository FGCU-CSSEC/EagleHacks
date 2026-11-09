"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Pendulum model; angles are in radians, positive is clockwise.
const MAX_ANGLE = (55 * Math.PI) / 180;
const STIFFNESS = 22; // gravity / cord length: higher swings faster
const DAMPING = 2.2;
const IDLE_SWAY = 0.012;
const BRUSH_GAIN = 0.02; // angular speed added per pixel of pointer movement
const MAX_BRUSH_SPEED = 1.6;
const MAX_RELEASE_SPEED = 3;

/**
 * Decorative press pass (public/brand/press-pass.png) hanging from the top of the hero.
 * It sways, reacts to the pointer brushing past, and can be dragged and released.
 * Hidden from assistive tech; static when the user prefers reduced motion.
 */
export default function PressPass() {
  const anchor = useRef<HTMLDivElement>(null);
  const swing = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchorEl = anchor.current;
    const swingEl = swing.current;
    if (!anchorEl || !swingEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      swingEl.style.transform = "rotate(-2deg)";
      return;
    }

    let theta = 0.06;
    let omega = 0;
    let dragging = false;
    let lastDragAngle = 0;
    let lastDragTime = 0;
    let last = performance.now();
    let frame = 0;

    const angleTo = (x: number, y: number) => {
      const r = anchorEl.getBoundingClientRect();
      return Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, Math.atan2(r.left + r.width / 2 - x, y - r.top)));
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      if (!dragging) {
        omega += (-STIFFNESS * Math.sin(theta) - DAMPING * omega) * dt;
        theta += omega * dt;
      }
      const idle = dragging ? 0 : IDLE_SWAY * Math.sin(now / 1500);
      swingEl.style.transform = `rotate(${(theta + idle) * (180 / Math.PI)}deg)`;
      frame = requestAnimationFrame(tick);
    };

    const onBrush = (e: PointerEvent) => {
      if (dragging || e.pointerType !== "mouse") return;
      const r = swingEl.getBoundingClientRect();
      const inside = e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
      if (inside) omega = Math.max(-MAX_BRUSH_SPEED, Math.min(MAX_BRUSH_SPEED, omega - e.movementX * BRUSH_GAIN));
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
      omega = Math.max(-MAX_RELEASE_SPEED, Math.min(MAX_RELEASE_SPEED, omega));
      last = performance.now();
    };

    document.addEventListener("pointermove", onBrush);
    swingEl.addEventListener("pointerdown", onDown);
    swingEl.addEventListener("pointermove", onMove);
    swingEl.addEventListener("pointerup", onUp);
    swingEl.addEventListener("pointercancel", onUp);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onBrush);
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
      className="absolute right-24 top-0 z-10 hidden w-[150px] select-none min-[1100px]:block"
    >
      <div ref={swing} data-cursor-grow className="origin-top touch-none">
        <Image
          src="/brand/press-pass.png"
          alt=""
          width={656}
          height={1510}
          sizes="320px"
          priority
          draggable={false}
          className="-mt-3 block h-auto w-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.5)]"
        />
      </div>
    </div>
  );
}
