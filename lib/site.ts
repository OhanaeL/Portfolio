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
    { figure: "~20%", label: "Accuracy gain from new reasoning methods, in production" },
    { figure: "#1 contributor", label: "Across three production services" },
  ],

  resume: asset("/media/about/resume.pdf"),
} as const;
