import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry, list, str } from "@/lib/content";
import { work } from "@/lib/site";
import { asset } from "@/lib/paths";
import WorkDiagram from "@/components/WorkDiagram";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const w = work.find((x) => x.slug === slug);
  return { title: w?.title ?? "Case study", description: w?.blurb };
}

/** "Software Engineer at Foo" -> "Software Engineer"; `title:` in metadata wins. */
function roleTitle(name: string, title: string) {
  const i = name.indexOf(" at ");
  return title || (i > 0 ? name.slice(0, i) : name);
}

export default async function CaseStudy({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const w = work.find((x) => x.slug === slug);
  const e = getEntry("experience", slug);
  if (!w || !e) notFound();

  const companies = list(e.meta, "links")
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter((p) => p.length === 2 && p[1]);
  const next = work[(work.indexOf(w) + 1) % work.length];

  return (
    <article className="container case">
      <header className="detail-head">
        <Link className="back" href="/#work">
          <span aria-hidden="true">←</span> All work
        </Link>
        <h1>{w.title}</h1>
        <p className="sub">{w.blurb}</p>
        <dl className="meta-row">
          <div>
            <dt>Company</dt>
            <dd>
              {companies.length
                ? companies.map(([name, href], i) => (
                    <span key={href}>
                      {i > 0 && " · "}
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {name}
                      </a>
                    </span>
                  ))
                : str(e.meta, "company")}
            </dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{roleTitle(e.name, str(e.meta, "title"))}</dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>{str(e.meta, "date")}</dd>
          </div>
        </dl>
        <ul className="work-stats">
          {w.stats.map(([figure, label]) => (
            <li key={label}>
              <b>{figure}</b> {label}
            </li>
          ))}
        </ul>
      </header>

      <figure className="case-figure work-art">
        <WorkDiagram kind={w.diagram} />
        <figcaption>{w.caption}</figcaption>
      </figure>

      <div className="prose" dangerouslySetInnerHTML={{ __html: e.html }} />

      <p className="case-foot">
        <a className="work-more" href={asset("/#experience")}>
          More about my role <span aria-hidden="true">→</span>
        </a>
      </p>
      <p className="case-next">
        <Link className="work-more" href={`/work/${next.slug}/`}>
          {next.eyebrow.split(" · ")[1]}: {next.title} <span aria-hidden="true">→</span>
        </Link>
      </p>
    </article>
  );
}
