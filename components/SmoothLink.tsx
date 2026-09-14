"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * An anchor that glides to its target instead of jumping. The page keeps
 * `scroll-behavior: auto` (smooth there breaks App Router navigation), so the
 * easing is done here per click. If the target isn't on the current page the
 * click falls through to a normal navigation (e.g. /#projects from a detail page).
 */
export default function SmoothLink({ href, onClick, children, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;

    const hash = href.split("#")[1];
    const target = hash ? document.getElementById(hash) : null;
    if (!target) return;

    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", `#${hash}`);
  };

  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
