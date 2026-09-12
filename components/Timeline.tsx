import { str, list, type Entry } from "@/lib/content";

/** "Software Engineer at Foo" -> ["Software Engineer", "Foo"]; no " at " -> [name, company meta]. */
function split(e: Entry) {
  const i = e.name.indexOf(" at ");
  const title = i > 0 ? e.name.slice(0, i) : e.name;
  const company = str(e.meta, "company") || (i > 0 ? e.name.slice(i + 4) : "");
  return { title, company };
}

/**
 * `links:` in metadata is a list of "Name|https://..." lines. When present the
 * company reads as those names, each linking out; otherwise plain `company:` text.
 */
function companyLinks(e: Entry) {
  const items = list(e.meta, "links")
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter((p) => p.length === 2 && p[1]);
  if (!items.length) return null;
  return items.map(([name, href], i) => (
    <span key={href}>
      {i > 0 && " / "}
      <a href={href} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    </span>
  ));
}

/** Entries without a real date (the hackathon roundup) don't belong on a timeline. */
export const dated = (entries: Entry[]) =>
  entries.filter((e) => {
    const d = str(e.meta, "date");
    return d && d.toUpperCase() !== "N/A";
  });

const MONTH = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]+/g;

/** "August 2024 - December 2025" -> "Aug 2024 - Dec 2025", so the column stays one line. */
const compact = (d: string) => d.replace(MONTH, "$1");

/** Condensed, linear: date on the left, one dot per role, one-paragraph summary. */
export default function Timeline({ entries }: { entries: Entry[] }) {
  return (
    <ol className="timeline">
      {dated(entries).map((e) => {
        const { title, company } = split(e);
        const date = str(e.meta, "date");
        const current = /current|present/i.test(date);
        return (
          <li className={current ? "tl-item tl-item--current" : "tl-item"} key={e.slug}>
            <span className="tl-date">{compact(date)}</span>
            <span className="tl-rail spot" aria-hidden="true">
              <i className="tl-dot" />
            </span>
            <div className="tl-body">
              <h3 className="tl-title">
                {title}
                <span className="tl-company"> · {companyLinks(e) ?? company}</span>
              </h3>
              <p className="tl-desc">{str(e.meta, "description")}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
