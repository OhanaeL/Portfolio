"use client";

import { useEffect, useState } from "react";
import SmoothLink from "./SmoothLink";

const SECTIONS = [
  { id: "top", label: "Top" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
];

/**
 * Fixed marker rail in the left gutter (wide screens only, see CSS). The
 * section whose top edge was most recently crossed is the active one, which
 * reads correctly for tall sections that never fully enter the viewport.
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

  return (
    <nav className="sidenav" aria-label="Sections">
      {SECTIONS.map((s) => (
        <SmoothLink
          key={s.id}
          href={s.id === "top" ? "#main" : `#${s.id}`}
          className={active === s.id ? "sidenav-item is-active" : "sidenav-item"}
          aria-current={active === s.id ? "true" : undefined}
        >
          <i aria-hidden="true" />
          <span>{s.label}</span>
        </SmoothLink>
      ))}
    </nav>
  );
}
