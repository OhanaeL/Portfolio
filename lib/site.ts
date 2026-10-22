import { asset } from "./paths";

export const site = {
  name: "Htin Linn",
  role: "Software Engineer",
  location: "Bangkok, Thailand",
  email: "htinlinn.dev.03@gmail.com",
  github: "https://github.com/OhanaeL",
  linkedin: "https://www.linkedin.com/in/htin-linn-b599711a1/",
  // GitHub Pages project site; the deploy workflow injects the /Portfolio base path.
  url: "https://ohanael.github.io/Portfolio",

  headline: "I build the systems AI agents run on.",
  description:
    "Software engineer working on agent runtimes and the backend services behind them, in Rust, Go and Python.",

  // the About block: a two-sentence intro (content/about/introduction.txt) plus these facts
  facts: [
    ["Based in", "Bangkok, Thailand"],
    ["Education", "B.Sc. in ICT, Rangsit International College, Rangsit University"],
    ["Working in", "Rust, Go, Python, TypeScript"],
    ["Open source", "Contributor to Mindroid, MagickMind's Rust agent runtime"],
    ["Hackathons", "1st place, CIMSO Hospitality ERP 2025. 3rd place, Hack the Zodiac 2024"],
  ] as [string, string][],

  // headline numbers, kept product-agnostic: what changed, not whose system it was
  stats: [
    { figure: "40% faster", label: "Hot-path latency on a production AI service" },
    { figure: "4s → 2.5s", label: "Per-turn agent latency after caching the execution loop" },
    { figure: "+34 pts", label: "GPQA accuracy from reasoning methods, same model as a direct call" },
    { figure: "#1 contributor", label: "Across three production services" },
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
    title: "Agents with an identity of their own",
    blurb:
      "Turning agents from a service that answered on their behalf into participants with their own identity, personality, memory and process.",
    stats: [
      ["40%", "faster fast-path responses"],
      ["4s → 2.5s", "per agent turn"],
      ["+22–34 pts", "GPQA accuracy from reasoning strategies"],
    ],
    diagram: "runtime",
    caption: "The supervisor mints each agent's credentials and runs it as its own process. Agents receive workspace messages over pub/sub, reply the same way, and call the AI inference service and the AI memory service through the gateway. The agent decides when to escalate from the fast model to the frontier model.",
  },
  {
    slug: "developer-at-brillar-company",
    eyebrow: "Associate Fullstack Engineer · Brillar (Atenxion)",
    title: "Multi-agent workflows and CRM integrations",
    blurb:
      "A Google ADK multi-agent platform where teams build their own workflows from agent and tool nodes, the integration service that connects it to Zoho CRM, SalesIQ, Chatwoot and Zendesk, and its RAG retrieval.",
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
