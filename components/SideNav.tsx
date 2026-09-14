"use client";

import { useEffect, useState } from "react";
import SmoothLink from "./SmoothLink";

const SECTIONS = [
  { id: "top", label: "Top" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
];

/**
 * Fixed rail in the left gutter (wide screens only, see CSS), built like a
 * revolver cylinder: the active section is always at the vertical centre and
 * pushed right, the others recede left, and the whole list rolls when the
 * active one changes. The section whose top edge most recently crossed a line
 * 40% down the viewport is the active one.
 */
export default function SideNav() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const targets = SECTIONS.slice(1)
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      // a line 40% down the viewport picks the section under the reader's eye
      const line = window.innerHeight * 0.4;
      let current = "top";
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const activeIndex = Math.max(0, SECTIONS.findIndex((s) => s.id === active));

  return (
    <nav className="sidenav" aria-label="Sections">
      {/* the list rolls so the active item always sits at the same spot, like a cylinder */}
      <div className="sidenav-list" style={{ "--i": activeIndex } as React.CSSProperties}>
        {SECTIONS.map((s, i) => (
          <SmoothLink
            key={s.id}
            href={s.id === "top" ? "#main" : `#${s.id}`}
            className={active === s.id ? "sidenav-item is-active" : "sidenav-item"}
            data-d={Math.min(3, Math.abs(i - activeIndex))}
            aria-current={active === s.id ? "true" : undefined}
          >
            <i aria-hidden="true" />
            <span>{s.label}</span>
          </SmoothLink>
        ))}
      </div>
    </nav>
  );
}
