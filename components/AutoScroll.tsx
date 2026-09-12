"use client";

import { useEffect, useRef } from "react";

const SPEED = 28; // px per second
const RESUME_AFTER = 1600; // ms of no interaction before drifting again
const FRICTION = 0.92; // per-frame velocity keep after a fling: a hard fling glides ~600px

/**
 * A horizontal scroll container that advances by itself. Expects its content
 * rendered twice back to back: when scrollLeft passes the first copy it jumps
 * back by that width, so the loop has no visible seam. Any user interaction
 * (hover, drag, touch, focus) pauses it; it resumes shortly after. Dragging
 * wraps too, so you can pull it left or right indefinitely, and a fling keeps
 * gliding with friction before the drift takes over again.
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
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    // fling: velocity sampled during the drag, decayed after release
    let vx = 0;
    let lastX = 0;
    let lastT = 0;
    let glide = 0;
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
      // momentum after a release: keep moving with decaying velocity, then hand back to the drift
      if (glide) {
        pos += glide * dt;
        glide *= Math.pow(FRICTION, dt / 16.7);
        if (Math.abs(glide) < 0.005) glide = 0;
        const hh = half();
        if (pos >= hh) pos -= hh;
        else if (pos < 0) pos += hh;
        lastSet = pos;
        el.scrollLeft = pos;
        return;
      }
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

    // drag to scroll (mouse, pen and touch alike); a real drag also swallows the click that would follow
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      lastX = e.clientX;
      lastT = performance.now();
      vx = 0;
      glide = 0;
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
      hold();
    };
    const dragMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      const h = half();
      let next = startLeft - dx;
      // keep the drag inside the seamless range so it can go on forever either way
      if (next >= h) { next -= h; startLeft -= h; }
      else if (next < 0) { next += h; startLeft += h; }
      lastSet = -1;
      el.scrollLeft = next;
      pos = next;
      // velocity in px/ms, smoothed so a jittery last sample doesn't decide the fling
      const now = performance.now();
      const dtm = now - lastT;
      if (dtm > 0) {
        const v = -(e.clientX - lastX) / dtm;
        vx = vx * 0.6 + v * 0.4;
        lastX = e.clientX;
        lastT = now;
      }
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-dragging");
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      // a quick release keeps going; a slow one just stops
      glide = Math.abs(vx) > 0.08 ? Math.max(-3, Math.min(3, vx)) : 0;
      release();
    };
    const swallowClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", dragMove);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", swallowClick, true);
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
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", dragMove);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", swallowClick, true);
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
