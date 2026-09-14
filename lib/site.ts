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
} as const;

/** The case studies in the Work section; `slug` names the experience entry each one opens. */
export const work = [
  {
    slug: "software-engineer-at-general-magick-industries",
    eyebrow: "Software Engineer · General Magick Industries",
    title: "MagickMind agent runtime",
    blurb:
      "The supervisor that runs each agent as its own credentialed process, the reasoning service agents call, and the episodic memory they recall from.",
    stats: [
      ["40%", "faster fast-path responses"],
      ["4s → 2.5s", "per agent turn"],
      ["+22–34 pts", "GPQA accuracy from reasoning strategies"],
    ],
    diagram: "runtime",
    caption: "The supervisor mints each agent's credentials and runs it as its own process. Agents receive workspace messages over pub/sub, reply the same way, and call the reasoning service and episodic memory through the gateway. The agent decides when to escalate from the fast model to the frontier model.",
  },
  {
    slug: "developer-at-brillar-company",
    eyebrow: "Associate Fullstack Engineer · Brillar (Atenxion)",
    title: "AI microservices and CRM integrations",
    blurb:
      "Python services that turn documents and crawled pages into text for LLM workflows, and one integration service that connects SalesIQ, Chatwoot and Zoho for every product.",
    stats: [
      ["30%", "faster container build and startup"],
      ["3", "CRM platforms behind one service"],
    ],
    diagram: "pipeline",
    caption: "Three CRMs behind one integration service. Documents and crawled pages go through ingestion to the LLM workflows. Grafana and OpenTelemetry cover every service.",
  },
] as const;
