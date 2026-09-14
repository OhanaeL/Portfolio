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

  education: {
    degree: "B.Sc. in Information and Communication Technology",
    honours: "First Class Honours · GPA 3.96/4",
    school: "Rangsit International College, Rangsit University, Pathum Thani, Thailand",
    years: "2022 – 2025",
  },

  resume: asset("/media/about/resume.pdf"),
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/experience/", label: "Experience" },
  { href: "/projects/", label: "Projects" },
  { href: "/achievements/", label: "Achievements" },
] as const;

/** The two "Professional Work" cards on the home page. `slug` names the experience entry they open. */
export const work = [
  {
    slug: "software-engineer-at-general-magick-industries",
    eyebrow: "Software Engineer · General Magick Industries",
    title: "MagickMind agent runtime",
    blurb:
      "The supervisor that runs each AI agent as an isolated, credentialed process, the reasoning service behind it, and the memory that gives agents recall across conversations.",
    stats: [
      ["40%", "faster fast-path responses"],
      ["4s → 2.5s", "per agent turn"],
      ["~20%", "accuracy gain from new reasoning methods"],
    ],
    diagram: "runtime",
  },
  {
    slug: "developer-at-brillar-company",
    eyebrow: "Associate Fullstack Engineer · Brillar (Atenxion)",
    title: "AI microservices and CRM integrations",
    blurb:
      "Python services that turn documents and crawled pages into LLM-ready text, and one integration service that connects SalesIQ, Chatwoot and Zoho for every product.",
    stats: [
      ["30%", "faster container build and startup"],
      ["3", "CRM platforms behind one service"],
    ],
    diagram: "pipeline",
  },
] as const;

export type WorkCard = (typeof work)[number];
