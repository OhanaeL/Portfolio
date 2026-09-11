"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import SmoothLink from "./SmoothLink";

// one page: these are anchors, in the order the sections appear
const nav = [
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
];

/**
 * Starts as an inset glass island. Past the threshold it rises to the top,
 * expands edge to edge and stays there. Inner content keeps its container
 * width throughout, so nothing shifts horizontally.
 */
export default function SiteHeader() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    // Hysteresis: engage at 56px, release at 16px. A single threshold lets the
    // header chatter, because any layout nudge around that one value flips it
    // back and forth on consecutive scroll events.
    const ENGAGE = 56;
    const RELEASE = 16;
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      setStuck((was) => (was ? y > RELEASE : y > ENGAGE));
    };
    // coalesce bursts of scroll events into one read per frame
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={stuck ? "nav nav--stuck" : "nav"}>
      <div className="container nav-inner">
        <Link href="/" className="nav-name" aria-label={site.name}>
          LYNN
        </Link>
        <nav className="nav-links">
          {nav.map((item) => (
            <SmoothLink key={item.href} href={item.href}>
              {item.label}
            </SmoothLink>
          ))}
          <a className="nav-cta" href={`mailto:${site.email}`}>
            Get in touch <span aria-hidden="true">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
