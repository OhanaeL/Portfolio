import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, linksOf, list, str, type Entry } from "@/lib/content";
import WorkDiagram, { isDiagramKind } from "@/components/WorkDiagram";
import CaseFigure from "@/components/CaseFigures";

type Params = { slug: string };

const withWriteup = (): Entry[] => getProjects().filter((p) => str(p.meta, "writeup") === "yes");

export function generateStaticParams(): Params[] {
  return withWriteup().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = withWriteup().find((x) => x.slug === slug);
  return { title: p?.name ?? "Project", description: p && str(p.meta, "description") };
}

export default async function ProjectWriteup({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = withWriteup().find((x) => x.slug === slug);
  if (!p) notFound();

  const links = linksOf(p);
  const stats = list(p.meta, "stats").map((s) => s.split("|"));
  const diagram = str(p.meta, "diagram");
  const github = str(p.meta, "github");

  return (
    <article className="container case">
      <header className="detail-head">
        <Link className="back back--projects" href="/#projects">
          <span aria-hidden="true">←</span> All projects
        </Link>
        <h1>{p.name}</h1>
        <p className="sub">{str(p.meta, "description")}</p>
        <dl className="meta-row">
          {links.length > 0 && (
            <div>
              <dt>Project</dt>
              <dd>
                {links.map(([name, href], i) => (
                  <span key={href}>
                    {i > 0 && " · "}
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {name}
                    </a>
                  </span>
                ))}
              </dd>
            </div>
          )}
          {str(p.meta, "title") && (
            <div>
              <dt>Role</dt>
              <dd>{str(p.meta, "title")}</dd>
            </div>
          )}
          <div>
            <dt>Period</dt>
            <dd>{str(p.meta, "date")}</dd>
          </div>
        </dl>
        {stats.length > 0 && (
          <ul className="work-stats">
            {stats.map(([figure, label]) => (
              <li key={label}>
                <b>{figure}</b> {label}
              </li>
            ))}
          </ul>
        )}
      </header>

      {isDiagramKind(diagram) && (
        <figure className="case-figure work-art">
          <WorkDiagram kind={diagram} />
          <figcaption>{str(p.meta, "diagram_caption")}</figcaption>
        </figure>
      )}

      <div className="prose">
        {p.html.split(/<div data-figure="([\w-]+)"><\/div>/).map((part, i) =>
          i % 2 ? <CaseFigure name={part} key={i} /> : <div key={i} dangerouslySetInnerHTML={{ __html: part }} />
        )}
      </div>

      {github && (
        <p className="case-foot">
          <a className="work-more" href={github} target="_blank" rel="noopener noreferrer">
            Read the source on GitHub <span aria-hidden="true">→</span>
          </a>
        </p>
      )}
    </article>
  );
}
