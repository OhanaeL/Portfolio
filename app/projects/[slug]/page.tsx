import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry, getProjects, list, str, thumbnail } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getProjects({ all: true }).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getEntry("projects", slug);
  return { title: p?.name ?? "Project", description: p ? str(p.meta, "description") : undefined };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getEntry("projects", slug);
  if (!p) notFound();

  const github = str(p.meta, "github");
  const demo = str(p.meta, "demo") || str(p.meta, "website");
  const team = list(p.meta, "team");
  const disclaimer = str(p.meta, "disclaimer");

  return (
    <article className="detail">
      <p className="crumbs">
        <Link href="/projects/">Projects</Link> <span aria-hidden="true">/</span> {p.name}
      </p>
      <header className="page-head">
        <div>
          <h1>{p.name}</h1>
          <p className="muted">{str(p.meta, "date")}</p>
        </div>
        <p className="links">
          {github && (
            <a className="more" href={github} target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          )}
          {demo && (
            <a className="more" href={demo} target="_blank" rel="noopener noreferrer">
              Live demo <span aria-hidden="true">↗</span>
            </a>
          )}
        </p>
      </header>

      <ul className="tags">
        {list(p.meta, "tags").map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      {p.embeds.length > 0 && (
        <div className="embeds">
          {p.embeds.map((f) => (
            <video key={f} src={`${p.mediaBase}/embeds/${encodeURIComponent(f)}`} poster={thumbnail(p)} controls preload="metadata" />
          ))}
        </div>
      )}

      <div className="detail-body">
        <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />
        <aside className="detail-side">
          {team.length > 0 && (
            <div>
              <h4>Team</h4>
              <p>{team.join(", ")}</p>
            </div>
          )}
          {disclaimer && (
            <div>
              <h4>Note</h4>
              <p>{disclaimer}</p>
            </div>
          )}
        </aside>
      </div>

      {p.gallery.length > 0 && (
        <div className="gallery">
          {p.gallery.map((f) => (
            <a key={f} href={`${p.mediaBase}/images/${encodeURIComponent(f)}`} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${p.mediaBase}/images/${encodeURIComponent(f)}`} alt={f.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ")} loading="lazy" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
