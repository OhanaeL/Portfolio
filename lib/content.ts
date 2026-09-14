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

export type Section = "projects" | "experience" | "accomplishments";

function mediaFiles(section: Section, slug: string, kind: "images" | "embeds"): string[] {
  const dir = path.join(process.cwd(), "public", "media", section, slug, kind);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => !f.startsWith(".")).sort();
}

/** Expand the two custom shortcodes, then render markdown. */
function render(description: string, section: Section, slug: string): string {
  const base = asset(`/media/${section}/${slug}`);

  let out = description.replace(/\[image:([^\]]+)\]/g, (_m, body: string) => {
    const [file, ...rest] = String(body).split(":");
    const name = file.trim();
    const caption = rest.join(":").trim() || name;
    return `<a class="imgref" href="${base}/images/${encodeURIComponent(name)}" target="_blank" rel="noopener noreferrer">${caption}</a>`;
  });

  out = out.replace(/\[website_link:([^\]]+)\]/g, (_m, name: string) => {
    const n = String(name).trim();
    return `<a class="xlink" href="${asset(`/projects/${slugify(n)}/`)}">${n}</a>`;
  });

  return marked.parse(out, { async: false, breaks: true, gfm: true }) as string;
}

const readLines = (file: string) =>
  fs.existsSync(file)
    ? fs
        .readFileSync(file, "utf8")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s && !s.startsWith("#"))
    : null;

/** "Mar, 2025 - Won 1st Place …" -> date and title, so accomplishments need no metadata file. */
function fromDatedName(name: string): { date: string; title: string } | null {
  const m = name.match(/^([A-Za-z]{3}),?\s+(\d{4})\s+-\s+(.+)$/);
  return m ? { date: `${m[1]} ${m[2]}`, title: m[3] } : null;
}

/**
 * Every entry in a section. `featured.txt` is an allow-list when present;
 * with `all`, unlisted entries are included after the featured ones.
 */
export function getSection(section: Section, opts: { all?: boolean } = {}): Entry[] {
  const dir = path.join(CONTENT, section);
  if (!fs.existsSync(dir)) return [];

  const featured = readLines(path.join(dir, "featured.txt"));
  const order = readLines(path.join(dir, "order.txt")) ?? [];

  const names = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => (featured && !opts.all ? featured.includes(n) : true));

  const entries = names.map((name) => {
    const slug = slugify(name);
    const folder = path.join(dir, name);
    const metaPath = path.join(folder, "metadata.txt");
    const descPath = path.join(folder, "description.txt");
    const meta = fs.existsSync(metaPath) ? parseMetadata(fs.readFileSync(metaPath, "utf8")) : {};
    const dated = fromDatedName(name);
    if (dated) {
      meta.date ||= dated.date;
      meta.title ||= dated.title;
    }
    if (featured?.includes(name)) meta.featured = "yes";
    const description = fs.existsSync(descPath) ? fs.readFileSync(descPath, "utf8") : "";
    return {
      name,
      slug,
      meta,
      html: render(description, section, slug),
      gallery: mediaFiles(section, slug, "images"),
      embeds: mediaFiles(section, slug, "embeds"),
      mediaBase: asset(`/media/${section}/${slug}`),
    } satisfies Entry;
  });

  // featured order first, then order.txt, then whatever is left by name
  const ranking = [...(featured ?? []), ...order.filter((n) => !featured?.includes(n))];
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

export const getProjects = (opts?: { all?: boolean }) => getSection("projects", opts);
export const getExperience = (opts?: { all?: boolean }) => getSection("experience", opts);
export const getAccomplishments = () => getSection("accomplishments", { all: true });

/** Thumbnail: explicit `thumbnail:` in metadata, else the first image. */
export function thumbnail(e: Entry): string | undefined {
  const pick = str(e.meta, "thumbnail") || e.gallery[0];
  return pick ? `${e.mediaBase}/images/${encodeURIComponent(pick)}` : undefined;
}

export function getEntry(section: Section, slug: string): Entry | undefined {
  return getSection(section, { all: true }).find((e) => e.slug === slug);
}

/** content/about/introduction.txt, rendered. */
export function getIntroduction(): string {
  const file = path.join(CONTENT, "about", "introduction.txt");
  if (!fs.existsSync(file)) return "";
  return marked.parse(fs.readFileSync(file, "utf8"), { async: false, breaks: true, gfm: true }) as string;
}

export interface Certificate {
  title: string;
  from: string;
  description: string;
  year: string;
  file: string;
  verification: string;
}

/** public/media/about/certificates/certificates.txt: blank-line-separated `key: value` blocks. */
export function getCertificates(): Certificate[] {
  const dir = path.join(process.cwd(), "public", "media", "about", "certificates");
  const file = path.join(dir, "certificates.txt");
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split(/\r?\n\s*\r?\n/)
    .map(parseMetadata)
    .filter((m) => str(m, "filename") && fs.existsSync(path.join(dir, str(m, "filename"))))
    .map((m) => ({
      title: str(m, "title"),
      from: str(m, "from"),
      description: str(m, "description"),
      year: str(m, "year"),
      file: asset(`/media/about/certificates/${encodeURIComponent(str(m, "filename"))}`),
      verification: str(m, "verification"),
    }))
    .sort((a, b) => b.year.localeCompare(a.year));
}
