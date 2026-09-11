import { asset } from "./paths";
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const CONTENT = path.join(process.cwd(), "content");

export type Meta = Record<string, string | string[]>;

export function slugify(name: string): string {
  // Matches the original site's rule, so existing URLs keep working.
  return name.toLowerCase().replace(/ /g, "-");
}

/** metadata.txt: `key: value` lines, plus `key:` followed by `- item` lists. */
export function parseMetadata(text: string): Meta {
  const out: Meta = {};
  let listKey: string | null = null;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;

    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && listKey) {
      (out[listKey] as string[]).push(item[1].trim());
      continue;
    }

    const kv = line.match(/^([A-Za-z_][\w .-]*):\s*(.*)$/);
    if (kv) {
      const key = kv[1].trim().toLowerCase();
      const value = kv[2].trim();
      if (value === "") {
        out[key] = [];
        listKey = key;
      } else {
        out[key] = value;
        listKey = null;
      }
    }
  }
  return out;
}

export const str = (m: Meta, k: string): string => {
  const v = m[k];
  return typeof v === "string" ? v : "";
};
export const list = (m: Meta, k: string): string[] => {
  const v = m[k];
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v.trim()) return v.split(",").map((s) => s.trim());
  return [];
};

export interface Entry {
  name: string;
  slug: string;
  meta: Meta;
  html: string;
  gallery: string[];
  embeds: string[];
  mediaBase: string;
}

type Section = "projects" | "experience" | "accomplishments";

function mediaFiles(section: Section, slug: string, kind: "images" | "embeds"): string[] {
  const dir = path.join(process.cwd(), "public", "media", section, slug, kind);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => !f.startsWith(".")).sort();
}

/** Expand the two custom shortcodes, then render markdown. */
function render(description: string, section: Section, slug: string) {
  const used = new Set<string>();
  const base = asset(`/media/${section}/${slug}`);

  let out = description.replace(/\[image:([^\]]+)\]/g, (_m, body: string) => {
    const [file, ...rest] = String(body).split(":");
    const name = file.trim();
    const caption = (rest.join(":").trim() || name).replace(/"/g, "&quot;");
    used.add(name);
    return `<span class="imgref" tabindex="0">${caption}<img src="${base}/images/${encodeURIComponent(
      name
    )}" alt="${caption}" loading="lazy" /></span>`;
  });

  out = out.replace(/\[website_link:([^\]]+)\]/g, (_m, name: string) => {
    const n = String(name).trim();
    return `<a class="xlink" href="/projects/${slugify(n)}/">${n}</a>`;
  });

  const html = marked.parse(out, { async: false, breaks: true, gfm: true }) as string;
  return { html, used };
}

export function getSection(section: Section): Entry[] {
  const dir = path.join(CONTENT, section);
  if (!fs.existsSync(dir)) return [];

  // featured.txt, when present, is an allow-list: only these entries are published.
  const featuredFile = path.join(dir, "featured.txt");
  const featured = fs.existsSync(featuredFile)
    ? fs
        .readFileSync(featuredFile, "utf8")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s && !s.startsWith("#"))
    : null;

  const orderFile = path.join(dir, "order.txt");
  const order = fs.existsSync(orderFile)
    ? fs.readFileSync(orderFile, "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    : [];

  const names = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => (featured ? featured.includes(n) : true));

  const entries = names.map((name) => {
    const slug = slugify(name);
    const folder = path.join(dir, name);
    const metaPath = path.join(folder, "metadata.txt");
    const descPath = path.join(folder, "description.txt");
    const meta = fs.existsSync(metaPath) ? parseMetadata(fs.readFileSync(metaPath, "utf8")) : {};
    const description = fs.existsSync(descPath) ? fs.readFileSync(descPath, "utf8") : "";
    const { html, used } = render(description, section, slug);

    const images = mediaFiles(section, slug, "images");
    return {
      name,
      slug,
      meta,
      html,
      gallery: images.filter((f) => !used.has(f)),
      embeds: mediaFiles(section, slug, "embeds"),
      mediaBase: asset(`/media/${section}/${slug}`),
    } satisfies Entry;
  });

  // order.txt wins; anything unlisted follows, newest-looking first
  const ranking = featured ?? order;
  entries.sort((a, b) => {
    const ia = ranking.indexOf(a.name);
    const ib = ranking.indexOf(b.name);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  return entries;
}

export const getProjects = () => getSection("projects");
export const getExperience = () => getSection("experience");
export const getAccomplishments = () => getSection("accomplishments");

export function getEntry(section: Section, slug: string): Entry | undefined {
  return getSection(section).find((e) => e.slug === slug);
}

export interface About {
  info: Meta;
  sections: { key: string; title: string; html: string }[];
  skills: { name: string; score: number; label: string; year: string; usage: string }[];
  certificates: string[];
}

export function getAbout(): About {
  const dir = path.join(CONTENT, "about");
  const read = (f: string) =>
    fs.existsSync(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), "utf8") : "";

  const info = parseMetadata(read("info.txt"));
  const order = read("order.txt").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

  const sections = order
    .filter((k) => k !== "skills" && k !== "certificates")
    .map((key) => ({
      key,
      title: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      html: marked.parse(read(`${key}.txt`), { async: false, breaks: true, gfm: true }) as string,
    }))
    .filter((s) => s.html.trim());

  const csv = read("skills.csv").split(/\r?\n/).filter(Boolean);
  const skills = csv.slice(1).map((line) => {
    // usage is free text and may contain commas — keep the tail intact
    const p = line.split(",");
    return {
      name: p[0], score: Number(p[3] || 0), label: p[4] || "",
      year: p[5] || "", usage: p.slice(6).join(",").trim(),
    };
  }).filter((s) => s.name);

  const certDir = path.join(process.cwd(), "public", "media", "about", "certificates");
  const certificates = fs.existsSync(certDir) ? fs.readdirSync(certDir).sort() : [];

  return { info, sections, skills, certificates };
}
