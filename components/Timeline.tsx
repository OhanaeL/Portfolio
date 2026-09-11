import { str, type Entry } from "@/lib/content";

/** "Software Engineer at Foo" -> ["Software Engineer", "Foo"]; no " at " -> [name, company meta]. */
function split(e: Entry) {
  const i = e.name.indexOf(" at ");
  const title = i > 0 ? e.name.slice(0, i) : e.name;
  const company = str(e.meta, "company") || (i > 0 ? e.name.slice(i + 4) : "");
  return { title, company };
}

/** Entries without a real date (the hackathon roundup) don't belong on a timeline. */
export const dated = (entries: Entry[]) =>
  entries.filter((e) => {
    const d = str(e.meta, "date");
    return d && d.toUpperCase() !== "N/A";
  });

const MONTH = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]+/g;

/** "August 2024 - December 2025" -> "Aug 2024 – Dec 2025", so the column stays one line. */
const compact = (d: string) => d.replace(MONTH, "$1").replace(/\s+-\s+/g, " – ");

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
            <span className="tl-rail" aria-hidden="true">
              <i className="tl-dot" />
            </span>
            <div className="tl-body">
              <h3 className="tl-title">
                {title}
                {company && <span className="tl-company"> · {company}</span>}
              </h3>
              <p className="tl-desc">{str(e.meta, "description")}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
