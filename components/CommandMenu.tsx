"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/lib/site";

type Item = {
  id: string;
  group: "Navigate" | "Actions" | "Links";
  label: string;
  hint?: string;
  run: () => void | Promise<void>;
};

export const OPEN_EVENT = "open-command-menu";

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.pushState(null, "", `#${id}`);
}

/** Persisted theme override; "system" removes the attribute and lets the media query decide. */
function cycleTheme() {
  const root = document.documentElement;
  const current = root.dataset.theme;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const effectiveDark = current ? current === "dark" : systemDark;
  const next = effectiveDark ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
}

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const items = useMemo<Item[]>(
    () => [
      { id: "top", group: "Navigate", label: "Top", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
      { id: "experience", group: "Navigate", label: "Experience", run: () => scrollTo("experience") },
      { id: "toolbox", group: "Navigate", label: "Toolbox", run: () => scrollTo("toolbox") },
      { id: "projects", group: "Navigate", label: "Projects", run: () => scrollTo("projects") },
      { id: "about", group: "Navigate", label: "About", run: () => scrollTo("about") },
      {
        id: "copy-email",
        group: "Actions",
        label: copied ? "Copied" : "Copy email",
        hint: site.email,
        run: async () => {
          try {
            await navigator.clipboard.writeText(site.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          } catch {
            window.location.href = `mailto:${site.email}`;
          }
        },
      },
      { id: "resume", group: "Actions", label: "Open résumé", hint: "PDF", run: () => void window.open(site.resume, "_blank", "noopener") },
      { id: "theme", group: "Actions", label: "Toggle theme", hint: "light / dark", run: cycleTheme },
      { id: "github", group: "Links", label: "GitHub", hint: "github.com/OhanaeL", run: () => void window.open(site.github, "_blank", "noopener") },
      { id: "linkedin", group: "Links", label: "LinkedIn", run: () => void window.open(site.linkedin, "_blank", "noopener") },
      { id: "email", group: "Links", label: "Email", hint: site.email, run: () => void (window.location.href = `mailto:${site.email}`) },
    ],
    [copied]
  );

  const visible = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => `${i.group} ${i.label} ${i.hint ?? ""}`.toLowerCase().includes(s));
  }, [items, q]);

  // open / close wiring: keyboard shortcut, the header button, escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = isMac() ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, [open, close]);

  // reset and focus on open; lock the page behind it
  useEffect(() => {
    if (!open) return;
    setQ("");
    setCursor(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  useEffect(() => setCursor(0), [q]);

  const run = (item: Item) => {
    const keepOpen = item.id === "copy-email" || item.id === "theme";
    void item.run();
    if (!keepOpen) close();
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, visible.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = visible[cursor];
      if (item) run(item);
    }
  };

  // keep the highlighted row in view
  useEffect(() => {
    const row = listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`);
    row?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!open) return null;

  let lastGroup: string | null = null;
  return (
    <div className="cmdk-overlay" onMouseDown={close} role="presentation">
      <div
        className="cmdk"
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cmdk-input-row">
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Type a command or search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="cmdk-kbd">esc</kbd>
        </div>
        <ul className="cmdk-list" ref={listRef} role="listbox">
          {visible.length === 0 && <li className="cmdk-empty">Nothing matches.</li>}
          {visible.map((item, i) => {
            const heading = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <li key={item.id} role="none">
                {heading && <div className="cmdk-group">{heading}</div>}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === cursor}
                  data-index={i}
                  className={i === cursor ? "cmdk-item is-active" : "cmdk-item"}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => run(item)}
                >
                  <span>{item.label}</span>
                  {item.hint && <span className="cmdk-hint">{item.hint}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>{isMac() ? "⌘" : "ctrl"}</kbd><kbd>K</kbd> toggle</span>
        </div>
      </div>
    </div>
  );
}
