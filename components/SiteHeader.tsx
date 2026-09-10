"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const nav = [
  { href: "/projects/", label: "Projects" },
  { href: "/experience/", label: "Experience" },
  { href: "/about/", label: "About" },
];

/**
 * Starts as an inset glass island. Past the threshold it rises to the top,
 * expands edge to edge and stays there. Inner content keeps its container
 * width throughout, so nothing shifts horizontally.
 */
export default function SiteHeader() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={stuck ? "nav nav--stuck" : "nav"}>
      <div className="container nav-inner">
        <Link href="/" className="nav-name">
          {site.name}
        </Link>
        <nav className="nav-links">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a className="nav-cta" href={`mailto:${site.email}`}>
            Get in touch <span aria-hidden="true">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
