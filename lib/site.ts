import { asset } from "./paths";

export const site = {
  name: "Htin Linn",
  role: "Software Engineer",
  location: "Bangkok, Thailand",
  email: "htinlinn.dev.03@gmail.com",
  github: "https://github.com/OhanaeL",
  linkedin: "https://www.linkedin.com/in/htin-linn-b599711a1/",
  legal: "https://hl-terms.pages.dev",
  // GitHub Pages project site; the deploy workflow injects the /Portfolio base path.
  url: "https://ohanael.github.io/Portfolio",

  headline: "I make AI systems faster and more reliable.",
  description:
    "Software engineer who optimizes AI agents and the services behind them, from model latency to tool-call reliability, in Rust, Go and Python.",

  // the About block: a two-sentence intro (content/about/introduction.txt) plus these facts
  facts: [
    ["Based in", "Bangkok, Thailand"],
    ["Education", "B.Sc. in ICT, Rangsit International College, Rangsit University"],
    ["Working in", "Rust, Go, Python, TypeScript"],
    ["Open source", "Contributor to Mindroid, MagickMind's Rust agent runtime", ["Mindroid", "https://github.com/General-Magick-Industries/mindroid"]],
    ["Hackathons", "1st place, CIMSO Hospitality ERP 2025. 3rd place, Hack the Zodiac 2024"],
  ] as [string, string, [string, string]?][],

  // headline numbers, kept product-agnostic: what changed, not whose system it was
  stats: [
    { figure: "40% faster", label: "End-to-end model turns after refactoring a production AI inference service" },
    { figure: "11s → 3.8s", label: "Per agent turn after I reworked how agents run a turn" },
    { figure: "61% → 100%", label: "Correct tool calls after I replaced text-parsed tool calls with native ones" },
    { figure: "~7s worst case", label: "Memory search, down from 30–60 s hangs when the embedding provider stalled" },
  ],

  resume: asset("/media/about/resume.pdf"),

  // The site assistant (sitepilot). `enabled` is the editorial switch; the
  // endpoint comes from NEXT_PUBLIC_PILOT_URL at build time (see worker/ and
  // the deploy workflow). The widget renders only when both are set.
  pilot: {
    enabled: true,
    url: process.env.NEXT_PUBLIC_PILOT_URL ?? "",
  },
} as const;

/** The case studies in the Work section; `slug` names the experience entry each one opens. */
export const work = [
  {
    slug: "software-engineer-at-general-magick-industries",
    eyebrow: "Software Engineer · General Magick Industries",
    title: "Cutting the wait on agent turns",
    blurb:
      "Where the time in an agent's turn went and how I cut it: a fast model for easy questions, an async AI inference service, work moved off the critical path, a context cache, and a ceiling on slow memory lookups.",
    stats: [
      ["40%", "faster end-to-end model turns"],
      ["11s → 3.8s", "per agent turn"],
      ["61% → 100%", "correct tool calls after I moved agents to native tool calling"],
    ],
    diagram: "runtime",
    caption: "The supervisor mints each agent's credentials and runs it as its own process. Agents receive workspace messages over pub/sub, reply the same way, and call the AI inference service and the AI memory service through the gateway. The agent decides when to escalate from the fast model to the frontier model.",
  },
  {
    slug: "developer-at-brillar-company",
    eyebrow: "Associate Fullstack Engineer · Brillar (Atenxion)",
    title: "Multi-agent workflows and CRM integrations",
    blurb:
      "Two multi-agent platforms, one on Google ADK and one on the OpenAI Agents SDK, where teams build their own workflows from agent and tool nodes, the integration service that connects them to Zoho CRM, SalesIQ, Chatwoot and Zendesk, and their RAG retrieval.",
    stats: [
      ["30%", "faster container build and startup"],
      ["4", "platforms behind one integration service"],
    ],
    diagram: "pipeline",
    caption: "Zoho CRM, SalesIQ, Chatwoot and Zendesk sit behind one integration service, so agents can open tickets and hand users to a human. A Crawl4AI crawler and a middle service that prepares uploads for Docling OCR feed RAG retrieval. Grafana and OpenTelemetry cover every service.",
  },
] as const;

/** The home page's sections, in order: the header links and the side rail both list these. */
export const sections = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
];
