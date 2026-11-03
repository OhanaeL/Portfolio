"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { SEEN_EVENT, SEEN_READY, SEEN_STATE, type SeenCommand } from "@/lib/seen";

const send = (command: SeenCommand) => window.dispatchEvent(new CustomEvent(SEEN_EVENT, { detail: command }));

const onReady = (cb: () => void) => {
  window.addEventListener(SEEN_READY, cb);
  return () => window.removeEventListener(SEEN_READY, cb);
};

/** Turns on the assistant's eye view for the page it is on, and off again when you leave. */
export default function SeenDemo() {
  const ready = useSyncExternalStore(onReady, () => document.documentElement.dataset.pilot === "on", () => false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onState = (e: Event) => setOn((e as CustomEvent<boolean>).detail);
    window.addEventListener(SEEN_STATE, onState);
    return () => {
      window.removeEventListener(SEEN_STATE, onState);
      send("off");
    };
  }, []);

  return (
    <div className="seen-demo">
      <button type="button" className={on ? "btn btn-primary" : "btn"} disabled={!ready} aria-pressed={on} onClick={() => send("toggle")}>
        {on ? "Hide what the AI sees" : "Show what the AI sees"}
      </button>
      {!ready && <span className="seen-note">The assistant is off in this build, so there is nothing to show.</span>}
    </div>
  );
}
