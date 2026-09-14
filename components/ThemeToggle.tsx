"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/** What the page is showing right now: the saved override, else light. */
function current(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/**
 * Light / dark switch. Writes data-theme on <html> (the CSS tokens key off it)
 * and remembers the choice; the inline script in layout.tsx replays it before
 * first paint so there is no flash. The label names the mode you'd switch to.
 */
export default function ThemeToggle() {
  // null on the server and during hydration, so the markup matches on both sides
  const theme = useSyncExternalStore(subscribe, current, () => null);

  const toggle = () => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    notify();
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
