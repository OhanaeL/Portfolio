"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/** What the page is actually showing right now: the saved override, else the OS preference. */
function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Light / dark switch. Writes data-theme on <html> (the CSS tokens key off it)
 * and remembers the choice; the inline script in layout.tsx replays it before
 * first paint so there is no flash. The label names the mode you'd switch to.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(current());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(current());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme ? `Switch to ${next} mode` : "Switch theme"}
      title={theme ? `Switch to ${next} mode` : undefined}
    >
      <i aria-hidden="true" />
      <span>{theme ? next : "theme"}</span>
    </button>
  );
}
