import type { Metadata } from "next";
import { getExperience, getIntroduction, list, str, type Entry } from "@/lib/content";
import { site } from "@/lib/site";
import { toolbox } from "@/lib/toolbox";

export const metadata: Metadata = { title: "Experience" };

/** "Software Engineer at Foo" -> title "Software Engineer"; `title:` in metadata wins. */
function roleTitle(e: Entry) {
  const i = e.name.indexOf(" at ");
  return str(e.meta, "title") || (i > 0 ? e.name.slice(0, i) : e.name);
}

function Company({ e }: { e: Entry }) {
  const items = list(e.meta, "links")
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter((p) => p.length === 2 && p[1]);
  if (!items.length) return <>{str(e.meta, "company")}</>;
  return items.map(([name, href], i) => (
    <span key={href}>
      {i > 0 && " · "}
      <a href={href} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    </span>
  ));
}

function Role({ e }: { e: Entry }) {
  return (
    <article className="role" id={e.slug}>
      <header className="role-head">
        <div>
          <h3>{roleTitle(e)}</h3>
          <p className="role-org">
            <Company e={e} />
          </p>
        </div>
        <span className="role-date">{str(e.meta, "date")}</span>
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: e.html }} />
    </article>
  );
}

export default function ExperiencePage() {
  const entries = getExperience();
  const groups = new Map<string, Entry[]>();
  for (const e of entries) {
    const g = str(e.meta, "group") || "Experience";
    groups.set(g, [...(groups.get(g) ?? []), e]);
  }
  const intro = getIntroduction();

  return (
    <>
      <div className="page-head">
        <h1>Experience</h1>
        <a className="more" href={site.resume} target="_blank" rel="noopener noreferrer">
          View résumé <span aria-hidden="true">↗</span>
        </a>
      </div>
      {intro && <div className="lede prose" dangerouslySetInnerHTML={{ __html: intro }} />}

      {[...groups].map(([title, items]) => (
        <section className="block" key={title}>
          <h2>{title}</h2>
          {items.map((e) => (
            <Role e={e} key={e.slug} />
          ))}
        </section>
      ))}

      <section className="block">
        <h2>Skills</h2>
        <dl className="skills">
          {toolbox.map((g) => (
            <div key={g.title}>
              <dt>{g.title}</dt>
              <dd>{g.tools.map((t) => t.name).join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
