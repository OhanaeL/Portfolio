"use client";

import type { PilotManifest } from "@sitepilot/core";
import { openaiTransport } from "@sitepilot/core";
import { defineTool, SitepilotProvider, SitepilotWidget } from "@sitepilot/react";
import { useMemo, useState } from "react";
import type { CatalogEntry } from "@/lib/pilot";
import { basePath } from "@/lib/paths";

const HISTORY_KEY = "pilot-chat";

function savedHistory() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(history: unknown[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

const norm = (s: string) => s.toLowerCase();

/**
 * The site assistant. Renders nothing unless a pilot endpoint is configured
 * (NEXT_PUBLIC_PILOT_URL, set by the deploy workflow) — the site is unchanged
 * without it. The persona and any private guidance live in worker/, not here.
 */
export default function Pilot({ manifest, catalog, url }: { manifest: PilotManifest; catalog: CatalogEntry[]; url: string }) {
  const transport = useMemo(() => openaiTransport({ url }), [url]);
  const [initial] = useState(savedHistory);
  const tools = useMemo(
    () => [
      defineTool<{ query: string }>({
        name: "search_portfolio",
        description:
          "Search everything on this site — projects, roles and case studies — by keyword (a technology, a company, a topic). Returns matches with the element key you can highlight to show the visitor. Use it whenever the visitor asks what was built with X, or about a role, before scrolling.",
        parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
        kind: "utility",
        execute: ({ query }) => {
          const q = norm(query).split(/\s+/).filter(Boolean);
          const hits = catalog.filter((c) => {
            const hay = norm([c.name, c.summary, c.tags.join(" "), c.kind].join(" "));
            return q.every((w) => hay.includes(w));
          });
          if (!hits.length) return `Nothing on the site matches "${query}".`;
          return hits
            .map((c) => `- [${c.kind}] ${c.name}${c.date ? ` (${c.date})` : ""}: ${c.summary}${c.tags.length ? ` Tags: ${c.tags.join(", ")}.` : ""} → element key "${c.key}"${c.href ? `, link ${c.href}` : ""}`)
            .join("\n");
        },
      }),
    ],
    [catalog],
  );

  return (
    <SitepilotProvider
      transport={transport}
      manifest={manifest}
      tools={tools}
      prompt="server"
      builtinTools={{ fill_field: false }}
      getPath={() => (typeof location === "undefined" ? "/" : location.pathname.replace(basePath, "") || "/")}
      history={{ initial, onChange: saveHistory }}
    >
      <SitepilotWidget
        title="Ask about this site"
        subtitle="Knows what is on this page"
        welcome={[
          "Hi, I'm the site guide.",
          "Ask me where anything is and I'll point at it, or ask what Lynn built with a given tool — try “which projects used Python?” or “open the résumé”.",
        ].join("\n\n")}
        placeholder="Ask about projects, roles, or where things are…"
        showToolToggles={false}
        footer={
          <>
            Powered by{" "}
            <a href="https://github.com/OhanaeL/sitepilot" target="_blank" rel="noopener noreferrer">
              sitepilot
            </a>
            {" · "}
            <a href="https://github.com/OhanaeL/Portfolio/blob/main/lib/pilot.ts" target="_blank" rel="noopener noreferrer">
              how this site is annotated
            </a>
          </>
        }
      />
    </SitepilotProvider>
  );
}
