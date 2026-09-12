"use client";

import { useEffect } from "react";

const REACH = 240; // px beyond an element's box where the light still counts

/**
 * Cursor spotlight, drawn only on borders. Every `.spot` element has a ring
 * pseudo-element whose background is a radial gradient positioned at --x/--y.
 * This tracks the pointer and writes those two vars per element in the ring's
 * own coordinate space (the ring can be inset from the element, e.g. the
 * header island), so the light lands exactly on the edge under the cursor.
 * Pointer-only: touch devices never see it.
 */
export default function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let els = Array.from(document.querySelectorAll<HTMLElement>(".spot"));
    let px = -1e4;
    let py = -1e4;
    let frame = 0;

    const paint = () => {
      frame = 0;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const near =
          px > r.left - REACH && px < r.right + REACH && py > r.top - REACH && py < r.bottom + REACH;
        if (!near) {
          if (el.dataset.lit) {
            el.style.removeProperty("--x");
            el.style.removeProperty("--y");
            delete el.dataset.lit;
          }
          continue;
        }
        // the ring pseudo may be inset from the element box: subtract its offset
        const pseudo = el.dataset.spot === "after" ? "::after" : "::before";
        const cs = getComputedStyle(el, pseudo);
        const ox = parseFloat(cs.left) || 0;
        const oy = parseFloat(cs.top) || 0;
        el.style.setProperty("--x", `${px - r.left - ox}px`);
        el.style.setProperty("--y", `${py - r.top - oy}px`);
        el.dataset.lit = "1";
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      schedule();
    };
    const leave = () => {
      px = py = -1e4;
      schedule();
    };
    const refresh = () => {
      els = Array.from(document.querySelectorAll<HTMLElement>(".spot"));
      schedule();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", refresh);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", refresh);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
