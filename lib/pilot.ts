import type { PilotManifest } from "@sitepilot/core";
import { getExperience, getProjects, list, str } from "./content";
import { site, work } from "./site";

/** One searchable line per thing on the site, for the assistant's `search_portfolio` tool. */
export interface CatalogEntry {
  kind: "project" | "experience" | "case study";
  name: string;
  summary: string;
  tags: string[];
  date: string;
  /** The element key the assistant can highlight or click for it. */
  key: string;
  href?: string;
}

const roleTitle = (name: string, title: string) => {
  const i = name.indexOf(" at ");
  return title || (i > 0 ? name.slice(0, i) : name);
};

export function buildCatalog(): CatalogEntry[] {
  const projects = getProjects().map<CatalogEntry>((p) => ({
    kind: "project",
    name: p.name,
    summary: str(p.meta, "description"),
    tags: list(p.meta, "tags"),
    date: str(p.meta, "date"),
    key: `Project card: ${p.name}`,
    href: str(p.meta, "github") || str(p.meta, "demo") || undefined,
  }));
  const experience = getExperience().map<CatalogEntry>((e) => ({
    kind: "experience",
    name: `${roleTitle(e.name, str(e.meta, "title"))} · ${str(e.meta, "company") || e.name.split(" at ")[1] || ""}`,
    summary: str(e.meta, "description"),
    tags: [],
    date: str(e.meta, "date"),
    key: `Experience: ${roleTitle(e.name, str(e.meta, "title"))}`,
  }));
  const studies = work.map<CatalogEntry>((w) => ({
    kind: "case study",
    name: w.title,
    summary: w.blurb,
    tags: w.stats.map(([figure, label]) => `${figure} ${label}`),
    date: "",
    key: `Case study: ${w.title}`,
    href: `/work/${w.slug}/`,
  }));
  return [...studies, ...experience, ...projects];
}

/**
 * The assistant's map of the page, generated from the same content that
 * renders it, so labels and hints can never drift from what is on screen.
 */
export function buildPilotManifest(): PilotManifest {
  const catalog = buildCatalog();
  const hints: Record<string, string> = {};
  for (const c of catalog) {
    const bits = [c.summary, c.tags.length ? `Tags: ${c.tags.join(", ")}.` : "", c.date ? `(${c.date})` : ""].filter(Boolean);
    hints[c.key] = bits.join(" ");
  }
  hints["Résumé (PDF) link"] = "Opens the PDF résumé in a new tab.";
  hints["Get in touch link"] = `Opens the visitor's mail client addressed to ${site.email}.`;
  hints["Theme toggle button"] = "Switches between light and dark mode.";
  hints["Professional Work section"] = "The case studies of his professional roles. Highlight it for 'show me his work'.";
  hints["Experience section"] = "The timeline of every role he has held. Highlight it for 'show me his experience'.";
  hints["Selected Projects section"] = "The rail of all his projects. Highlight it for 'show me his projects'.";
  hints["About section"] = "His intro, facts, résumé and contact buttons. Highlight it for 'tell me about him on the page'.";

  return {
    elements: [
      { selector: ".nav-name", label: "Back to top link" },
      { selector: ".nav-links > a:not(.nav-cta)", label: "{text} nav link" },
      { selector: ".nav-cta", label: "Get in touch link" },
      { selector: ".theme-toggle", label: "Theme toggle button" },
      { selector: ".sidenav-item", label: "{text} section link" },
      { selector: "main > section[id]", label: "{text:.section-head h2} section" },
      { selector: ".hero .btn-primary", label: "View projects button" },
      { selector: ".hero .btn:not(.btn-primary), .about-actions .btn[href$='.pdf']", label: "Résumé (PDF) link" },
      { selector: ".about-actions .btn:not([href$='.pdf'])", label: "{text} link (about)" },
      { selector: ".footer-links a", label: "{text} link (footer)" },
      { selector: ".bento--stats", label: "Highlights", read: true },
      { selector: ".work", label: "Case study: {text:h3}", tier: "item", read: true },
      { selector: ".work-more", label: "Read case study link: {attr:href}" },
      { selector: ".tl-item", label: "Experience: {text:.tl-title}", tier: "item", read: true },
      { selector: ".proj", label: "Project card: {text:.proj-name}", tier: "item", read: true },
      { selector: ".about-body .prose", label: "About paragraph", read: true },
      { selector: ".facts", label: "About facts", read: true },
      { selector: ".case .back", label: "All work link" },
      { selector: ".case h1", label: "Case study title", read: true },
    ],
    areas: [
      { selector: ".hero", topic: "hero", description: `The top of ${site.name}'s portfolio: headline, intro and headline stats.` },
      { selector: "#work", topic: "work", description: "Professional Work: case-study cards that open their own page." },
      { selector: "#experience", topic: "experience", description: "Experience: a timeline of roles, plus the tools strip." },
      { selector: "#projects", topic: "projects", description: "Selected Projects: an auto-scrolling rail of project cards with GitHub/demo links." },
      { selector: "#about", topic: "about", description: "About: photo, intro paragraph, facts, résumé and contact buttons." },
      { selector: ".case", topic: "case-study", description: "A single case study page for one role." },
    ],
    hints,
  };
}
