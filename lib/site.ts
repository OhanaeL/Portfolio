import { asset } from "./paths";

export const site = {
  name: "Htin Linn",
  role: "Software Engineer",
  location: "Bangkok, Thailand",
  email: "htinlinn.dev.03@gmail.com",
  github: "https://github.com/OhanaeL",
  linkedin: "https://www.linkedin.com/in/htin-linn-b599711a1/",
  // Update this once the Vercel domain is assigned.
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

  stats: [
    { figure: "40% faster", label: "Fast-path response latency in the reasoning service" },
    { figure: "4s → 2.5s", label: "Agent turn latency after execution-loop caching" },
    { figure: "~20%", label: "Reasoning accuracy gain from frontier methods (RLM, mixture of judges)" },
    { figure: "#1 contributor", label: "On three of MagickMind's core services" },
  ],

  resume: asset("/media/about/resume.pdf"),
} as const;
