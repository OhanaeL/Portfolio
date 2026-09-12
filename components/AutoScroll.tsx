"use client";

import { useEffect, useRef } from "react";

const SPEED = 28; // px per second
const RESUME_AFTER = 1600; // ms of no interaction before drifting again

/**
 * A horizontal scroll container that advances by itself. Expects its content
 * rendered twice back to back: when scrollLeft passes the first copy it jumps
 * back by that width, so the loop has no visible seam. Any user interaction
 * (hover, touch, wheel, drag, focus) pauses it; it resumes shortly after.
 * Off entirely under prefers-reduced-motion.
 */
export default function AutoScroll({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    let resumeAt = 0;
    let last = 0;
    let frame = 0;
    // the last scrollLeft we wrote: scroll events arrive a frame later, so a flag can't tell ours from the user's
    let lastSet = -1;
    // our own fractional position; scrollLeft may round or keep fractions depending on zoom
    let pos = el.scrollLeft;

    // one copy's width plus the gap after it: the exact distance between the two copies
    const half = () => {
      const first = el.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      return first ? first.offsetWidth + gap : el.scrollWidth / 2;
    };

    const tick = (t: number) => {
      frame = requestAnimationFrame(tick);
      if (!last) last = t;
      const dt = Math.min(64, t - last);
      last = t;
      if (paused || t < resumeAt) return;
      pos += (SPEED * dt) / 1000;
      const h = half();
      if (pos >= h) pos -= h;
      if (Math.abs(pos - el.scrollLeft) >= 0.5) {
        lastSet = pos;
        el.scrollLeft = pos;
      }
    };

    const hold = () => {
      paused = true;
    };
    const release = () => {
      paused = false;
      resumeAt = performance.now() + RESUME_AFTER;
    };
    // a scroll we didn't cause is the user: back off for a moment, and keep the loop seamless
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - lastSet) < 1.5) return;
      resumeAt = performance.now() + RESUME_AFTER;
      const h = half();
      if (el.scrollLeft >= h) el.scrollLeft -= h;
      else if (el.scrollLeft <= 0) el.scrollLeft += h;
      pos = el.scrollLeft;
    };

    el.addEventListener("pointerenter", hold);
    el.addEventListener("pointerleave", release);
    el.addEventListener("focusin", hold);
    el.addEventListener("focusout", release);
    el.addEventListener("touchstart", hold, { passive: true });
    el.addEventListener("touchend", release);
    el.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerenter", hold);
      el.removeEventListener("pointerleave", release);
      el.removeEventListener("focusin", hold);
      el.removeEventListener("focusout", release);
      el.removeEventListener("touchstart", hold);
      el.removeEventListener("touchend", release);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
