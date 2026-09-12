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
    "Software engineer working on agent runtimes, LLM inference and the backend services behind them, in Rust, Go and Python.",

  now: {
    title: "Software Engineer at MagickMind (General Magick Industries)",
    body:
      "I own the agent runtime and inference path: the agent supervisor that runs each agent as an isolated, credentialed process, the reasoning service behind it, and agent memory. Contributor to Mindroid, the company's open-source Rust agent runtime.",
    stack: ["Python", "Rust", "Go", "TypeScript", "React", "FastAPI", "Docker", "PostgreSQL"],
  },

  // the About block: a two-sentence intro (content/about/introduction.txt) plus these facts
  facts: [
    ["Based in", "Bangkok, Thailand"],
    ["Education", "ICT, Rangsit International College, Rangsit University"],
    ["Working in", "Rust, Go, Python, TypeScript"],
    ["Open source", "Contributor to Mindroid, MagickMind's Rust agent runtime"],
    ["Hackathons", "1st place, CIMSO Hospitality ERP 2025. 3rd place, Hack the Zodiac 2024"],
  ] as [string, string][],

  stats: [
    { figure: "40% faster", label: "Fast-path inference latency in the reasoning service" },
    { figure: "4s → 2.5s", label: "Agent turn latency after execution-loop caching" },
    { figure: "300+ / 100+", label: "Candidates and companies on a recruitment platform I built" },
    { figure: "1st place", label: "CIMSO Hospitality ERP Hackathon, 2025" },
  ],

  resume: asset("/media/about/resume.pdf"),
} as const;
